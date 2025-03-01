
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formatDistanceToNow } from 'date-fns';
import { Check, Save, Loader2, FileText } from 'lucide-react';
import { useDocuments } from '@/context/DocumentContext';
import { Document } from '@/types';

// Quill editor formats
const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'color', 'background',
  'align', 'code-block', 'formula'
];

// Quill editor modules
const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image'],
    [{ 'align': [] }],
    ['clean']
  ],
  clipboard: {
    // toggle to add custom clipboard handling
    matchVisual: false,
  }
};

interface EditorProps {
  document: Document | null;
}

const Editor: React.FC<EditorProps> = ({ document }) => {
  const { 
    updateDocument, 
    isEditorLoading, 
    isSaving, 
    lastSaved,
    setCurrentDocument,
    createDocument
  } = useDocuments();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isContentChanged, setIsContentChanged] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  
  const quillRef = useRef<ReactQuill>(null);
  
  // Update local state when document changes
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
    } else {
      setTitle('');
      setContent('');
    }
    setIsContentChanged(false);
  }, [document]);
  
  // Focus editor when document changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (quillRef.current && document) {
        quillRef.current.focus();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [document]);
  
  // Auto-save functionality
  const handleSave = useCallback(async () => {
    if (!document || !isContentChanged) return;
    
    const updatedDoc = await updateDocument(document._id!, {
      title,
      content,
    });
    
    if (updatedDoc) {
      setIsContentChanged(false);
      setShowSavedIndicator(true);
      
      // Hide saved indicator after 2 seconds
      setTimeout(() => {
        setShowSavedIndicator(false);
      }, 2000);
    }
  }, [document, title, content, isContentChanged, updateDocument]);
  
  // Title change handler
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsContentChanged(true);
    
    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // Set new timeout for auto-save
    const timeout = setTimeout(() => {
      handleSave();
    }, 1500);
    
    setSaveTimeout(timeout);
  };
  
  // Content change handler
  const handleContentChange = (value: string) => {
    setContent(value);
    setIsContentChanged(true);
    
    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // Set new timeout for auto-save
    const timeout = setTimeout(() => {
      handleSave();
    }, 30000); // Auto-save after 30 seconds of inactivity
    
    setSaveTimeout(timeout);
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);
  
  // Handle manual save
  const handleManualSave = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      setSaveTimeout(null);
    }
    
    handleSave();
  };
  
  if (isEditorLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center max-w-md p-6">
          <div className="bg-muted/30 p-12 rounded-2xl mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-medium mb-2">No Document Selected</h2>
          <p className="text-muted-foreground mb-6">
            Select a document from the sidebar or create a new one to get started.
          </p>
          <button
            onClick={() => {
              const newDoc = {
                title: 'Untitled Document',
                content: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              createDocument(newDoc).then((doc) => {
                if (doc) setCurrentDocument(doc);
              });
            }}
            className="py-2 px-4 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Create New Document
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 h-full flex flex-col">
      {/* Editor Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10 py-3 px-6 flex items-center justify-between shadow-sm">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full bg-transparent border-none text-lg font-medium focus:outline-none"
            placeholder="Untitled Document"
          />
        </div>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {lastSaved && (
            <span>
              Last saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
            </span>
          )}
          
          <button
            onClick={handleManualSave}
            disabled={isSaving || !isContentChanged}
            className={`
              flex items-center gap-2 py-1 px-3 rounded-md
              transition-all duration-200
              ${isContentChanged && !isSaving ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
              ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}
            `}
            aria-label="Save document"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : showSavedIndicator ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isSaving ? 'Saving...' : showSavedIndicator ? 'Saved!' : 'Save'}</span>
          </button>
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="flex-1 overflow-hidden">
        <div className="editor-container">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            placeholder="Start writing..."
          />
        </div>
      </div>
      
      {/* Auto-save indicator */}
      <div className={`
        fixed bottom-4 right-4 
        py-2 px-4 
        bg-primary text-primary-foreground 
        rounded-md shadow-md
        transition-all duration-300
        transform
        ${isContentChanged && !showSavedIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
      `}>
        <p className="text-sm">Your document will auto-save in 30 seconds</p>
      </div>
    </div>
  );
};

export default Editor;
