import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LocationData {
  displayName: string;
  city: string;
  locality: string;
  state: string;
  country: string;
  pincode: string;
  lat: number;
  lng: number;
}

interface LocationContextType {
  location: LocationData | null;
  setLocation: (loc: LocationData) => void;
  recentLocations: LocationData[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = 'nexopp_selected_location';
const RECENT_LOCATIONS_KEY = 'nexopp_recent_locations';

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<LocationData | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored location", e);
    }
    // Default fallback to Guntur
    return {
      displayName: 'Guntur, Andhra Pradesh',
      city: 'Guntur',
      locality: '',
      state: 'Andhra Pradesh',
      country: 'India',
      pincode: '522002',
      lat: 16.3067,
      lng: 80.4365,
    };
  });

  const [recentLocations, setRecentLocations] = useState<LocationData[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_LOCATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse recent locations", e);
    }
    return [];
  });

  const setLocation = (loc: LocationData) => {
    setLocationState(loc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
    
    // Update recent locations
    setRecentLocations(prev => {
      const filtered = prev.filter(p => p.displayName !== loc.displayName);
      const newRecent = [loc, ...filtered].slice(0, 5);
      localStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(newRecent));
      return newRecent;
    });

    // Also update legacy global city for backward compatibility with existing components
    window.localStorage.setItem('nexopp_selected_city', loc.city || loc.displayName.split(',')[0]);
    window.dispatchEvent(new Event('nexopp_data_changed'));
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, recentLocations }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationStore = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationStore must be used within a LocationProvider');
  }
  return context;
};
