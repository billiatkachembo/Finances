import React, { useState, useEffect } from 'react';

interface SpinnerProps {
  label?: string;
  size?: number; // Tailwind size (e.g., 8 = h-8 w-8)
  delay?: number; // Delay before showing
  className?: string;
  fullScreen?: boolean; // NEW: global mode
}

const Spinner: React.FC<SpinnerProps> = ({
  label = 'Loading',
  size = 8,
  delay = 300,
  className = 'text-primary',
  fullScreen = false,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  return (
    <div
      role="status"
      aria-label={label}
      className={`flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
        fullScreen ? 'fixed inset-0 z-[9999] bg-background' : ''
      }`}
      id={fullScreen ? 'global-loader' : undefined}
    >
      <svg
        className={`animate-spin h-${size} w-${size} ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      {label && <p className="mt-2 text-sm text-muted-foreground">{label}...</p>}
    </div>
  );
};

export default Spinner;
