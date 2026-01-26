// Exportado desde https://uiverse.io/Javierrocadev/hard-horse-30

import React from 'react';

interface LoaderProps {
  className?: string;
}

const Loader = ({ className }: LoaderProps) => {
  return (
    <div className={`flex flex-row gap-3 m-4 ${className || ''}`}>
      <div className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:.7s]" />
      <div className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:.3s]" />
      <div className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:.7s]" />
    </div>
  );
}

export default Loader;
