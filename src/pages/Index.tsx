
import React from 'react';
import { DocumentProvider } from '@/context/DocumentContext';
import DocumentSidebar from '@/components/DocumentSidebar';
import Editor from '@/components/Editor';
import { useDocuments } from '@/context/DocumentContext';

// EditorContainer component - wrapped with context
const EditorContainer: React.FC = () => {
  const { currentDocument } = useDocuments();
  
  return (
    <div className="flex-1 h-screen overflow-hidden animate-fade-in">
      <Editor document={currentDocument} />
    </div>
  );
};

// Main Index page
const Index: React.FC = () => {
  return (
    <DocumentProvider>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <DocumentSidebar />
        
        {/* Main content - offset for sidebar */}
        <div className="flex-1 ml-0 h-screen overflow-hidden">
          <EditorContainer />
        </div>
      </div>
    </DocumentProvider>
  );
};

export default Index;
