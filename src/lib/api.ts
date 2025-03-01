
import axios from 'axios';
import { Document, DocumentWithoutId, ApiResponse } from '../types';

// In a real application, this would come from environment variables
const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Document API functions
export const documentApi = {
  // For demo purposes, we'll use localStorage as a temporary backend
  // In a real application, these would make actual API calls
  
  getAllDocuments: async (): Promise<ApiResponse<Document[]>> => {
    try {
      // Simulate API call
      const storedDocs = localStorage.getItem('documents');
      const documents: Document[] = storedDocs ? JSON.parse(storedDocs) : [];
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, data: documents };
    } catch (error) {
      console.error('Error getting documents:', error);
      return { 
        success: false, 
        error: 'Failed to fetch documents'
      };
    }
  },
  
  getDocumentById: async (id: string): Promise<ApiResponse<Document>> => {
    try {
      // Simulate API call
      const storedDocs = localStorage.getItem('documents');
      const documents: Document[] = storedDocs ? JSON.parse(storedDocs) : [];
      const document = documents.find(doc => doc._id === id);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!document) {
        return { 
          success: false, 
          error: 'Document not found'
        };
      }
      
      return { success: true, data: document };
    } catch (error) {
      console.error('Error getting document:', error);
      return { 
        success: false, 
        error: 'Failed to fetch document'
      };
    }
  },
  
  createDocument: async (document: DocumentWithoutId): Promise<ApiResponse<Document>> => {
    try {
      // Simulate API call
      const storedDocs = localStorage.getItem('documents');
      const documents: Document[] = storedDocs ? JSON.parse(storedDocs) : [];
      
      // Create a new document with a unique ID
      const newDocument: Document = {
        ...document,
        _id: `doc_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add to "database"
      documents.push(newDocument);
      localStorage.setItem('documents', JSON.stringify(documents));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, data: newDocument };
    } catch (error) {
      console.error('Error creating document:', error);
      return { 
        success: false, 
        error: 'Failed to create document'
      };
    }
  },
  
  updateDocument: async (id: string, document: Partial<Document>): Promise<ApiResponse<Document>> => {
    try {
      // Simulate API call
      const storedDocs = localStorage.getItem('documents');
      const documents: Document[] = storedDocs ? JSON.parse(storedDocs) : [];
      
      const documentIndex = documents.findIndex(doc => doc._id === id);
      
      if (documentIndex === -1) {
        return { 
          success: false, 
          error: 'Document not found'
        };
      }
      
      // Update document
      const updatedDocument: Document = {
        ...documents[documentIndex],
        ...document,
        updatedAt: new Date().toISOString(),
      };
      
      documents[documentIndex] = updatedDocument;
      localStorage.setItem('documents', JSON.stringify(documents));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { success: true, data: updatedDocument };
    } catch (error) {
      console.error('Error updating document:', error);
      return { 
        success: false, 
        error: 'Failed to update document'
      };
    }
  },
  
  deleteDocument: async (id: string): Promise<ApiResponse<void>> => {
    try {
      // Simulate API call
      const storedDocs = localStorage.getItem('documents');
      const documents: Document[] = storedDocs ? JSON.parse(storedDocs) : [];
      
      const newDocuments = documents.filter(doc => doc._id !== id);
      
      localStorage.setItem('documents', JSON.stringify(newDocuments));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { 
        success: false, 
        error: 'Failed to delete document'
      };
    }
  },
  
  searchDocuments: async (searchTerm: string): Promise<ApiResponse<Document[]>> => {
    try {
      // Simulate API call
      const storedDocs = localStorage.getItem('documents');
      const documents: Document[] = storedDocs ? JSON.parse(storedDocs) : [];
      
      // Simple search implementation
      const filteredDocs = documents.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return { success: true, data: filteredDocs };
    } catch (error) {
      console.error('Error searching documents:', error);
      return { 
        success: false, 
        error: 'Failed to search documents'
      };
    }
  }
};

export default api;
