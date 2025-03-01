import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Document schema
const documentSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const DocumentModel = mongoose.model('Document', documentSchema);

// API routes
app.get('/api/documents', async (req, res) => {
  const documents = await DocumentModel.find();
  res.json(documents);
});

app.post('/api/documents', async (req, res) => {
  const newDocument = new DocumentModel(req.body);
  await newDocument.save();
  res.json(newDocument);
});

// Update document
app.put('/api/documents/:id', async (req, res) => {
  const { id } = req.params;
  const updatedDocument = await DocumentModel.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updatedDocument);
});

// Delete document
app.delete('/api/documents/:id', async (req, res) => {
  const { id } = req.params;
  await DocumentModel.findByIdAndDelete(id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 