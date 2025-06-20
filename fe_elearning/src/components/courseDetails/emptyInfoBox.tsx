import React from 'react';

const EmptyInfoBox: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="text-sm font-mono text-center italic bg-gray-50 p-3 rounded border border-gray-200">
      {message}
    </div>
  );
};

export default EmptyInfoBox;
