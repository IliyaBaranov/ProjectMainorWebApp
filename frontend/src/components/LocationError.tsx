
import React from 'react';
import { Button } from '@/components/ui/button';

interface LocationErrorProps {
  error: string;
  onRetry: () => void;
}

const LocationError: React.FC<LocationErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-yellow-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      
      <h3 className="text-xl font-medium mb-2">Location Access Needed</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        {error.includes('denied') 
          ? "We need your location to find nearby ATMs. Please enable location services in your browser settings and try again."
          : error
        }
      </p>
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
        <Button onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default LocationError;
