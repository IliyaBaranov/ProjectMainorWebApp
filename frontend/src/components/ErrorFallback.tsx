
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-red-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <div className="text-muted-foreground mb-6">
          <p className="mb-2">We encountered an error while trying to process your request.</p>
          <details className="text-sm text-left bg-muted/50 p-2 rounded mb-4 overflow-auto">
            <summary className="cursor-pointer">Error details</summary>
            <p className="mt-2 font-mono whitespace-pre-wrap">{error.message}</p>
          </details>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
          <Button onClick={resetErrorBoundary}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
