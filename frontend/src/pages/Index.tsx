
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ATM } from '@/types/atm';
import { fetchAllATMs, fetchNearestATM } from '@/services/atmService';
import useGeolocation from '@/hooks/useGeolocation';
import ATMMap from '@/components/ATMMap';
import ATMList from '@/components/ATMList';
import Layout from '@/components/Layout';
import LocationError from '@/components/LocationError';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/sonner';
import { MapPin, List, Route } from 'lucide-react';

const Index = () => {
  const [atms, setAtms] = useState<ATM[]>([]);
  const [nearestATM, setNearestATM] = useState<ATM | null>(null);
  const [selectedATM, setSelectedATM] = useState<ATM | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  
  const { coords, loading: locationLoading, error: locationError } = useGeolocation();
  const isMobile = useIsMobile();
  
  // Convert coords to the format used by Leaflet
  const userLocation = coords 
    ? [coords.latitude, coords.longitude] as [number, number] 
    : null;
  
  // Fetch all ATMs on mount
  useEffect(() => {
    const loadATMs = async () => {
      try {
        setLoading(true);
        const data = await fetchAllATMs();
        // Ensure data is always an array
        const atmData = Array.isArray(data) ? data : [];
        setAtms(atmData);
        setError(null);
      } catch (err) {
        console.error('Error loading ATMs:', err);
        setAtms([]);
        setError('Failed to load ATM data. Please try again.');
        toast.error('Failed to load ATM data.');
      } finally {
        setLoading(false);
      }
    };
    
    loadATMs();
  }, []);
  
  const hasFetchedNearest = useRef(false); // Add this at top-level

  useEffect(() => {
    const getNearestATM = async () => {
      if (hasFetchedNearest.current || !userLocation || atms.length === 0) return;

      try {
        hasFetchedNearest.current = true; // ✅ Ensure it runs only once
        const nearest = await fetchNearestATM(userLocation[0], userLocation[1]);
        setNearestATM(nearest);

        if (!selectedATM) {
          setSelectedATM(nearest);
        }
      } catch (err) {
        console.error('Error fetching nearest ATM:', err);
        toast.error('Failed to find the nearest ATM.');
      }
    };

    getNearestATM();
  }, [userLocation, atms]);


  
  const handleRetryLocation = useCallback(() => {
    window.location.reload();
  }, []);
  
  const handleShowRoute = useCallback((atm: ATM) => {
    if (!userLocation) {
      toast.error('Your location is required to show the route.');
      return;
    }

    setSelectedATM(atm);
    setShowRoute(true);

    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [userLocation, isMobile]);
  
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);
  
  // Render header content
  const renderHeader = () => (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center">
        <div className="flex items-center mr-2">
          <div className="w-8 h-8 rounded-full bg-atm-primary flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3 6h18M10 16l4-4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-atm-primary ml-2">ATM Navigator</h1>
        </div>
        <span className="hidden md:inline-block text-sm px-2 py-1 bg-muted rounded-full">
          {locationLoading ? 'Locating...' : userLocation ? 'Location found' : 'No location'}
        </span>
      </div>
      
      {isMobile && (
        <Button variant="outline" size="sm" onClick={toggleSidebar}>
          <List size={18} />
          <span className="ml-2">ATMs List</span>
        </Button>
      )}
    </div>
  );
  
  // Render sidebar content
  const renderSidebar = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-atm-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading ATM data...</p>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      );
    }
    
    return (
      <ATMList
        atms={atms}
        nearestATM={nearestATM}
        userLocation={userLocation}
        selectedATM={selectedATM}
        setSelectedATM={setSelectedATM}
        onShowRoute={handleShowRoute}
      />
    );
  };
  
  // Render main content
  const renderMain = () => {
    if (locationError) {
      return (
        <LocationError error={locationError} onRetry={handleRetryLocation} />
      );
    }

    return (
      <div className="h-full rounded-lg overflow-hidden border shadow-sm">
        <ATMMap
          atms={atms}
          userLocation={userLocation}
          nearestATM={nearestATM}
          selectedATM={selectedATM}
          setSelectedATM={setSelectedATM}
          showRoute={showRoute}
          setShowRoute={setShowRoute}
        />
      </div>
    );
  };
  
  return (
    <Layout
      header={renderHeader()}
      sidebar={renderSidebar()}
      main={renderMain()}
      isMobile={isMobile}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
    />
  );
};

export default Index;
