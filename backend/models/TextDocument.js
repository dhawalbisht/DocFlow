// backend/models/TextDocument.js
const mongoose = require('mongoose');

const TextDocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TextDocument = mongoose.model('TextDocument', TextDocumentSchema);

module.exports = TextDocument;
