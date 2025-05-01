
import axios from 'axios';
import { ATM } from '@/types/atm';

const API_URL = 'http://localhost:8080/api';

export const fetchAllATMs = async (): Promise<ATM[]> => {
  try {
    const response = await axios.get(`${API_URL}/atms`);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching ATMs:', error);
    return []; // Return empty array instead of throwing
  }
};

export const fetchNearestATM = async (lat: number, lon: number): Promise<ATM> => {
  try {
    const response = await axios.get(`${API_URL}/atms/nearest`, {
      params: { lat, lon }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nearest ATM:', error);
    throw error;
  }
};

// Helper function to calculate distance between two coordinates (in meters)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = 
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * 
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // distance in meters

  return distance;
};

// Format distance for display
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    return `${(meters / 1000).toFixed(1)} km`;
  }
};
