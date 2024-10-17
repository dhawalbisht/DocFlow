import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000');

const TextEditor = () => {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [documents, setDocuments] = useState([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);
    const textAreaRef = useRef();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/text-documents');
                setDocuments(response.data);
                if (response.data.length > 0) {
                    // Optionally load the first document
                    handleDocumentSelect(response.data[0]);
                }
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        // Listen for text changes from other clients
        socket.on('textChange', (data) => {
            if (data !== content) {
                setContent(data);
            }
        });

        // Listen for title changes from other clients
        socket.on('titleChange', (newTitle) => {
            if (newTitle !== title) {
                setTitle(newTitle);
            }
        });

        return () => {
            socket.off('textChange');
            socket.off('titleChange');
        };
    }, []);

    const handleChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);
        socket.emit('textChange', newContent);
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        socket.emit('titleChange', newTitle);
    };

    const handleSave = async () => {
        try {
            if (selectedDocumentId) {
                await axios.put(`http://localhost:4000/api/text-documents/${selectedDocumentId}`, {
                    title,
                    content,
                });
                alert('Document updated successfully!');
            } else {
                await axios.post('http://localhost:4000/api/text-documents', {
                    title,
                    content,
                });
                alert('Document saved successfully!');
            }

            const documentsResponse = await axios.get('http://localhost:4000/api/text-documents');
            setDocuments(documentsResponse.data);
            resetForm();
        } catch (error) {
            console.error('Error saving document:', error);
            alert('Failed to save document');
        }
    };

    const resetForm = () => {
        setSelectedDocumentId(null);
        setTitle('');
        setContent('');
    };

    const handleDocumentSelect = (document) => {
        setSelectedDocumentId(document._id);
        setTitle(document.title);
        setContent(document.content);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await axios.delete(`http://localhost:4000/api/text-documents/${id}`);
                alert('Document deleted successfully!');
                const documentsResponse = await axios.get('http://localhost:4000/api/text-documents');
                setDocuments(documentsResponse.data);
                resetForm(); // Reset form if the current document is deleted
            } catch (error) {
                console.error('Error deleting document:', error);
                alert('Failed to delete document');
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4">Text Editor</h1>
            <input
                type="text"
                placeholder="Document Title"
                value={title}
                onChange={handleTitleChange}
                className="border border-gray-300 p-3 rounded mb-4 w-full focus:outline-none focus:ring focus:ring-blue-300"
            />
            <textarea
                ref={textAreaRef}
                value={content}
                onChange={handleChange}
                rows={10}
                placeholder="Start typing..."
                className="border border-gray-300 p-3 rounded w-full resize-none focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
                onClick={handleSave}
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600 transition duration-200"
            >
                {selectedDocumentId ? 'Update Document' : 'Save Document'}
            </button>

            <h2 className="text-2xl font-semibold mt-6">Existing Documents</h2>
            <ul className="mt-4 space-y-2">
                {documents.map((doc) => (
                    <li key={doc._id} className="flex items-center justify-between border-b pb-2">
                        <strong
                            onClick={() => handleDocumentSelect(doc)}
                            className="cursor-pointer text-blue-600 hover:underline"
                        >
                            {doc.title}
                        </strong>
                        <button
                            onClick={() => handleDelete(doc._id)}
                            className="text-red-500 hover:text-red-700 ml-4"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TextEditor;
