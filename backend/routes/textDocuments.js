// backend/routes/textDocuments.js
const express = require('express');
const TextDocument = require('../models/TextDocument');

const router = express.Router();

module.exports = (io) => {
  // Create or update a text document
  router.post('/', async (req, res) => {
    const { title, content } = req.body;

    try {
      let document;
      const existingDoc = await TextDocument.findOne({ title });

      if (existingDoc) {
        existingDoc.content = content;
        document = await existingDoc.save();
      } else {
        document = new TextDocument({ title, content });
        await document.save();
      }

      io.emit('documentUpdated', document);
      res.status(201).json({ message: 'Text document saved successfully', document });
    } catch (error) {
      console.error('Error saving text document:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get all text documents
  router.get('/', async (req, res) => {
    try {
      const documents = await TextDocument.find();
      res.status(200).json(documents);
    } catch (error) {
      console.error('Error fetching text documents:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Delete a text document by ID
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const deletedDocument = await TextDocument.findByIdAndDelete(id);

      if (!deletedDocument) {
        return res.status(404).json({ message: 'Text document not found' });
      }

      io.emit('documentDeleted', deletedDocument);
      res.status(200).json({ message: 'Text document deleted successfully' });
    } catch (error) {
      console.error('Error deleting text document:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
};
