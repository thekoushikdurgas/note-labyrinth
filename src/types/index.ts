
export interface Document {
  _id?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export type DocumentWithoutId = Omit<Document, '_id'>;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DocumentContextType {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  isEditorLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
  searchTerm: string;
  fetchDocuments: () => Promise<void>;
  createDocument: (document: DocumentWithoutId) => Promise<Document | null>;
  updateDocument: (id: string, document: Partial<Document>) => Promise<Document | null>;
  deleteDocument: (id: string) => Promise<boolean>;
  setCurrentDocument: (document: Document | null) => void;
  setSearchTerm: (term: string) => void;
}
