
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useDocuments } from '@/context/DocumentContext';

const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm } = useDocuments();
  const [inputValue, setInputValue] = useState(searchTerm);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Update input value when search term changes
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSearchTerm(e.target.value);
  };
  
  // Clear search
  const handleClear = () => {
    setInputValue('');
    setSearchTerm('');
    inputRef.current?.focus();
  };
  
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-sidebar-foreground/50" />
      </div>
      
      <input
        ref={inputRef}
        type="text"
        placeholder="Search documents..."
        value={inputValue}
        onChange={handleChange}
        className="sidebar-search w-full py-2 pl-10 pr-10 focus:outline-none focus:ring-1 focus:ring-sidebar-ring transition-all duration-200"
      />
      
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-3 flex items-center text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
