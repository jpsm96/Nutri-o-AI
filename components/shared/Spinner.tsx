
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-emerald-500 border-t-transparent`}></div>
      {text && <p className="text-gray-600 dark:text-gray-300 font-semibold">{text}</p>}
    </div>
  );
};

export default Spinner;
