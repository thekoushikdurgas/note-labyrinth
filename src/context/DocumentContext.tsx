import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Document, DocumentWithoutId, DocumentContextType } from '../types';
import { documentApi } from '../lib/api';
import { useToast } from '@/hooks/use-toast';

// Create a context with a default value
const DocumentContext = createContext<DocumentContextType>({
  documents: [],
  currentDocument: null,
  isLoading: false,
  isEditorLoading: false,
  isSaving: false,
  lastSaved: null,
  error: null,
  searchTerm: '',
  fetchDocuments: async () => {},
  createDocument: async () => null,
  updateDocument: async () => null,
  deleteDocument: async () => false,
  setCurrentDocument: () => {},
  setSearchTerm: () => {},
});

// Create a provider component
export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorLoading, setIsEditorLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { toast } = useToast();

  // Fetch all documents
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await documentApi.getAllDocuments();
      
      if (response.success && response.data) {
        setDocuments(response.data);
      } else {
        setError(response.error || 'Failed to fetch documents');
        toast({
          title: 'Error',
          description: response.error || 'Failed to fetch documents',
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create a new document
  const createDocument = useCallback(async (document: DocumentWithoutId) => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await documentApi.createDocument(document);
      
      if (response.success && response.data) {
        setDocuments(prev => [...prev, response.data!]);
        toast({
          title: 'Success',
          description: 'Document created successfully',
        });
        setLastSaved(new Date());
        return response.data;
      } else {
        setError(response.error || 'Failed to create document');
        toast({
          title: 'Error',
          description: response.error || 'Failed to create document',
          variant: 'destructive',
        });
        return null;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [toast]);

  // Update an existing document
  const updateDocument = useCallback(async (id: string, document: Partial<Document>) => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await documentApi.updateDocument(id, document);
      
      if (response.success && response.data) {
        setDocuments(prev => 
          prev.map(doc => doc._id === id ? response.data! : doc)
        );
        
        if (currentDocument && currentDocument._id === id) {
          setCurrentDocument(response.data);
        }
        
        setLastSaved(new Date());
        return response.data;
      } else {
        setError(response.error || 'Failed to update document');
        toast({
          title: 'Error',
          description: response.error || 'Failed to update document',
          variant: 'destructive',
        });
        return null;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [currentDocument, toast]);

  // Delete a document
  const deleteDocument = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await documentApi.deleteDocument(id);
      
      if (response.success) {
        setDocuments(prev => prev.filter(doc => doc._id !== id));
        
        // If the current document is deleted, set it to null
        if (currentDocument && currentDocument._id === id) {
          setCurrentDocument(null);
        }
        
        toast({
          title: 'Success',
          description: 'Document deleted successfully',
        });
        
        return true;
      } else {
        setError(response.error || 'Failed to delete document');
        toast({
          title: 'Error',
          description: response.error || 'Failed to delete document',
          variant: 'destructive',
        });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentDocument, toast]);

  // Fetch documents on initial load
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Filter documents based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // If search term is empty, fetch all documents
      fetchDocuments();
    } else {
      // Otherwise, search documents
      const searchDocuments = async () => {
        setIsLoading(true);
        try {
          const response = await documentApi.searchDocuments(searchTerm);
          if (response.success && response.data) {
            setDocuments(response.data);
          }
        } catch (err) {
          console.error('Search error:', err);
        } finally {
          setIsLoading(false);
        }
      };
      
      // Debounce search
      const debounceTimeout = setTimeout(() => {
        searchDocuments();
      }, 300);
      
      return () => clearTimeout(debounceTimeout);
    }
  }, [searchTerm, fetchDocuments]);

  const contextValue: DocumentContextType = {
    documents,
    currentDocument,
    isLoading,
    isEditorLoading,
    isSaving,
    lastSaved,
    error,
    searchTerm,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    setCurrentDocument,
    setSearchTerm,
  };

  return (
    <DocumentContext.Provider value={contextValue}>
      {children}
    </DocumentContext.Provider>
  );
};

// Custom hook to use the document context
export const useDocuments = () => useContext(DocumentContext);

export default DocumentContext;
