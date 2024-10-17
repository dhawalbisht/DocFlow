import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const CodeEditor = () => {
    const [code, setCode] = useState('// Write your code here...\nconsole.log("Hello, World!");');
    const [title, setTitle] = useState('My Code Document');
    const [output, setOutput] = useState('');
    const [documents, setDocuments] = useState([]);
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/code-documents');
            setDocuments(response.data);
            if (response.data.length > 0) {
                loadDocument(response.data[0]); // Load the first document if available
            }
        } catch (error) {
            console.error('Error fetching code documents:', error);
        }
    };

    const loadDocument = (doc) => {
        setSelectedDocumentId(doc._id);
        setTitle(doc.title);
        setCode(doc.code);
    };

    const handleEditorChange = (value) => {
        setCode(value);
    };

    const handleCompile = () => {
        try {
            setOutput(eval(code)); // WARNING: Using eval can be dangerous; consider a safer alternative
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !code.trim()) {
            alert('Title and code cannot be empty.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/api/code-documents', {
                title,
                code,
                id: selectedDocumentId, // Send the ID if updating
            });

            alert(response.data.message);
            await fetchDocuments(); // Re-fetch documents to update the list
        } catch (error) {
            console.error('Error saving document:', error);
            alert('Failed to save document.');
        }
    };

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Code Editor</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Document Title"
                    className="bg-gray-800 border border-gray-700 rounded-md p-2 w-full"
                />
            </div>
            <select
                onChange={(e) => loadDocument(documents[e.target.value])}
                className="mb-4 bg-gray-800 border border-gray-700 rounded-md p-2"
            >
                <option value="">Select a document</option>
                {documents.map((doc, index) => (
                    <option key={doc._id} value={index}>
                        {doc.title}
                    </option>
                ))}
            </select>
            <div className="border border-gray-700 rounded-md mb-4">
                <Editor
                    height="400px"
                    language="javascript"
                    value={code}
                    onChange={handleEditorChange}
                    theme="vs-dark"
                    options={{
                        automaticLayout: true,
                        selectOnLineNumbers: true,
                    }}
                />
            </div>
            <button
                onClick={handleCompile}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mb-4"
            >
                Compile
            </button>
            <button
                onClick={handleSave}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 mb-4"
            >
                {selectedDocumentId ? 'Save Changes' : 'Save New Document'}
            </button>
            <div>
                <h4 className="text-lg font-semibold">Output:</h4>
                <pre className="border border-gray-700 p-3 rounded-md bg-gray-800 overflow-auto">
                    {output}
                </pre>
            </div>
        </div>
    );
};

export default CodeEditor;
