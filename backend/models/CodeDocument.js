const mongoose = require('mongoose');

const CodeDocumentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const CodeDocument = mongoose.model('CodeDocument', CodeDocumentSchema);

module.exports = CodeDocument;
