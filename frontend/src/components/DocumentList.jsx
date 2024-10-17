import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch documents function
    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/api/text-documents');
            setDocuments(response.data);
        } catch (err) {
            console.error('Error fetching documents:', err);
            setError('Failed to load documents. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await axios.delete(`http://localhost:4000/api/text-documents/${id}`);
                // Refetch documents after deletion
                await fetchDocuments();
            } catch (err) {
                console.error('Error deleting document:', err);
                alert('Failed to delete document.');
            }
        }
    };

    const handleRefresh = () => {
        fetchDocuments(); // Refresh documents on demand
    };

    if (loading) {
        return <p className="text-white">Loading documents...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Documents</h1>
            <button
                onClick={handleRefresh}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-4"
            >
                Refresh Documents
            </button>
            <ul>
                {documents.map((doc) => (
                    <li key={doc._id} className="border border-gray-700 p-4 mb-2 rounded-md">
                        <h2 className="text-xl font-semibold">{doc.title} ({doc.type})</h2>
                        <p>{doc.content}</p>
                        <button
                            onClick={() => handleDelete(doc._id)}
                            className="mt-2 text-red-500 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DocumentList;
