// src/components/ui/select.jsx
import React from 'react';

export const Select = ({ children, onValueChange, defaultValue }) => {
  return (
    <select 
      onChange={(e) => onValueChange(e.target.value)} 
      defaultValue={defaultValue}
      className="w-full p-2 border rounded-md"
    >
      {children}
    </select>
  );
};

export const SelectTrigger = ({ children, className }) => {
  return <div className={`relative ${className}`}>{children}</div>;
};

export const SelectContent = ({ children }) => {
  return <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg">{children}</div>;
};

export const SelectItem = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};

export const SelectValue = () => null;