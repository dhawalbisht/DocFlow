const express = require('express');
const CodeDocument = require('../models/CodeDocument');

const router = express.Router();

module.exports = (io) => {
    // Create or update a code document
    router.post('/', async (req, res) => {
        const { title, code, id } = req.body;

        try {
            let document;
            if (id) {
                // Update existing document
                document = await CodeDocument.findByIdAndUpdate(id, { title, code }, { new: true });
            } else {
                // Create new document
                document = new CodeDocument({ title, code });
                await document.save();
            }

            io.emit('documentUpdated', document);
            res.status(201).json({ message: 'Code document saved successfully', document });
        } catch (error) {
            console.error('Error saving code document:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    });

    // Get all code documents
    router.get('/', async (req, res) => {
        try {
            const documents = await CodeDocument.find();
            res.status(200).json(documents);
        } catch (error) {
            console.error('Error fetching code documents:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Delete a code document by ID
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const deletedDocument = await CodeDocument.findByIdAndDelete(id);

            if (!deletedDocument) {
                return res.status(404).json({ message: 'Code document not found' });
            }

            io.emit('documentDeleted', deletedDocument);
            res.status(200).json({ message: 'Code document deleted successfully' });
        } catch (error) {
            console.error('Error deleting code document:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
};
