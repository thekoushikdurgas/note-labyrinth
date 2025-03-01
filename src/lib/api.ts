
import { Document, DocumentWithoutId, ApiResponse } from '../types';
import supabase from './supabase';

// Document API functions
export const documentApi = {
  getAllDocuments: async (): Promise<ApiResponse<Document[]>> => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('updatedAt', { ascending: false });
      
      if (error) throw error;
      
      return { success: true, data: data as Document[] };
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
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('_id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        return { 
          success: false, 
          error: 'Document not found'
        };
      }
      
      return { success: true, data: data as Document };
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
      // Create a new document with a unique ID
      const newDocument: Document = {
        ...document,
        _id: `doc_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('documents')
        .insert(newDocument)
        .select()
        .single();
      
      if (error) throw error;
      
      return { success: true, data: data as Document };
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
      const { data, error } = await supabase
        .from('documents')
        .update({
          ...document,
          updatedAt: new Date().toISOString(),
        })
        .eq('_id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { success: true, data: data as Document };
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
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('_id', id);
      
      if (error) throw error;
      
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
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
        .order('updatedAt', { ascending: false });
      
      if (error) throw error;
      
      return { success: true, data: data as Document[] };
    } catch (error) {
      console.error('Error searching documents:', error);
      return { 
        success: false, 
        error: 'Failed to search documents'
      };
    }
  }
};

export default { documentApi };
