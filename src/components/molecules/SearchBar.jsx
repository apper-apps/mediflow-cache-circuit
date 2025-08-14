import { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  onClear,
  className,
  showClearButton = true 
}) => {
  const [query, setQuery] = useState("");

  const handleSearch = (value) => {
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onClear) {
      onClear();
    }
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && showClearButton && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;