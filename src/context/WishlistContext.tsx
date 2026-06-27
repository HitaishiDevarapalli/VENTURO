import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface WishlistContextType {
  wishlistItems: string[];
  toggleWishlist: (propertyId: string) => void;
  isWishlisted: (propertyId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from localStorage if available
  const [wishlistItems, setWishlistItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexopp_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nexopp_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (propertyId: string) => {
    setWishlistItems(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId); // Remove if exists
      } else {
        return [...prev, propertyId]; // Add if doesn't exist
      }
    });
  };

  const isWishlisted = (propertyId: string) => {
    return wishlistItems.includes(propertyId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
