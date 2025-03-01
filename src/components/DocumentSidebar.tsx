
import React, { useState } from 'react';
import { PlusCircle, FileText, Menu, X } from 'lucide-react';
import { useDocuments } from '@/context/DocumentContext';
import DocumentItem from './DocumentItem';
import SearchBar from './SearchBar';
import { Document, DocumentWithoutId } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

const DocumentSidebar: React.FC = () => {
  const { 
    documents, 
    currentDocument, 
    isLoading, 
    createDocument, 
    setCurrentDocument 
  } = useDocuments();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleCreateDocument = async () => {
    const newDoc: DocumentWithoutId = {
      title: 'Untitled Document',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const created = await createDocument(newDoc);
    if (created) {
      setCurrentDocument(created);
    }
  };
  
  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };
  
  // Determine if sidebar should be shown based on device and state
  const sidebarActive = isMobile ? isMobileSidebarOpen : !isCollapsed;
  
  return (
    <>
      {/* Mobile toggle button - always visible on mobile */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-primary-foreground shadow-md"
          aria-label={isMobileSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-40
          bg-sidebar text-sidebar-foreground
          transition-all duration-300 ease-in-out
          ${sidebarActive ? 'translate-x-0' : '-translate-x-full'}
          ${isMobile ? 'w-[85%] max-w-[300px] shadow-xl' : 'w-[280px]'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <h1 className="font-medium">Note Labyrinth</h1>
            </div>
            
            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <Menu size={18} /> : <X size={18} />}
              </button>
            )}
          </div>
          
          {/* Search */}
          <div className="p-4 border-b border-sidebar-border">
            <SearchBar />
          </div>
          
          {/* Document list */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <h2 className="text-sm font-medium">My Documents</h2>
              <button
                onClick={handleCreateDocument}
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                aria-label="Create new document"
              >
                <PlusCircle size={18} />
              </button>
            </div>
            
            {isLoading ? (
              <div className="p-4 text-center text-sidebar-foreground/50 animate-pulse">
                Loading...
              </div>
            ) : documents.length === 0 ? (
              <div className="p-4 text-center text-sidebar-foreground/50">
                No documents found
              </div>
            ) : (
              documents.map((doc) => (
                <DocumentItem
                  key={doc._id}
                  document={doc}
                  isActive={currentDocument?._id === doc._id}
                />
              ))
            )}
          </div>
          
          {/* Footer */}
          <div className="p-3 border-t border-sidebar-border text-center">
            <button
              onClick={handleCreateDocument}
              className="w-full py-2 px-4 bg-sidebar-primary text-sidebar-primary-foreground rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <PlusCircle size={16} />
              <span>New Document</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile - only shown when sidebar is open on mobile */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 animate-fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Desktop collapsed sidebar button */}
      {!isMobile && isCollapsed && (
        <div className="fixed top-4 left-4 z-40">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-primary text-primary-foreground shadow-md"
            aria-label="Expand sidebar"
          >
            <Menu size={20} />
          </button>
        </div>
      )}
    </>
  );
};

export default DocumentSidebar;
