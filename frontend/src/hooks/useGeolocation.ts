
import { useState, useEffect } from 'react';

interface GeolocationState {
  coords: {
    latitude: number;
    longitude: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coords: null,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      });
      return;
    }

    const success = (position: GeolocationPosition) => {
      setState({
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        loading: false,
        error: null,
      });
    };

    const error = (error: GeolocationPositionError) => {
      setState({
        coords: null,
        loading: false,
        error: `Geolocation error: ${error.message}`,
      });
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    setState(prev => ({ ...prev, loading: true }));
    const watchId = navigator.geolocation.watchPosition(success, error, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
};

export default useGeolocation;
