
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Document } from '@/types';
import { useDocuments } from '@/context/DocumentContext';
import { Trash2 } from 'lucide-react';

interface DocumentItemProps {
  document: Document;
  isActive: boolean;
}

// Helper function to strip HTML tags for preview
const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

const DocumentItem: React.FC<DocumentItemProps> = ({ document, isActive }) => {
  const { setCurrentDocument, deleteDocument } = useDocuments();
  
  const handleClick = () => {
    setCurrentDocument(document);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(document._id!);
    }
  };
  
  // Generate a preview from the content
  const contentPreview = stripHtml(document.content);
  const truncatedPreview = truncateText(contentPreview, 60);
  
  // Format the updated time
  const timeAgo = formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true });
  
  return (
    <div 
      className={`document-item ${isActive ? 'active' : ''} group`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-sm mb-1">{document.title}</h3>
        <button
          onClick={handleDelete}
          className="text-sidebar-foreground/0 group-hover:text-sidebar-foreground/50 hover:text-sidebar-foreground transition-all duration-200"
          aria-label="Delete document"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <p className="text-sidebar-foreground/70 text-xs mb-2">
        {truncatedPreview}
      </p>
      
      <p className="text-sidebar-foreground/50 text-xs italic">
        {timeAgo}
      </p>
    </div>
  );
};

export default DocumentItem;
