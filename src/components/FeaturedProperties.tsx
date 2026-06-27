import React from 'react';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';


interface Property {
  id: string;
  name: string;
  location: string;
  price: string;
  type: string;
  area: string;
  status: 'Buy' | 'Sell' | 'Rent';
  image: string;
}

interface FeaturedPropertiesProps {
  onPropertyClick?: (id: string) => void;
  onBuyProperty?: (id: string) => void;
  categoryFilter?: 'BuyApartment' | 'BuyHouse' | 'BuyLand';
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ onPropertyClick, onBuyProperty, categoryFilter }) => {
  const { toggleWishlist, isWishlisted } = useWishlist();

  const properties: Property[] = [
    {
      id: 'P1',
      name: 'Skyline Heights',
      location: 'Hyderabad',
      price: '₹85 Lakhs',
      type: 'Apartment',
      area: '1800 Sq Ft',
      status: 'Buy',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'P2',
      name: 'Golden Meadows',
      location: 'Guntur',
      price: '₹42 Lakhs',
      type: 'Plot',
      area: '240 Sq Yards',
      status: 'Sell',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'P3',
      name: 'Prestige Villas',
      location: 'Hyderabad',
      price: '₹1.8 Crore',
      type: 'Villa',
      area: '3200 Sq Ft',
      status: 'Buy',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'P4',
      name: 'Urban Nest',
      location: 'Vijayawada',
      price: '₹28,000 / mo',
      type: 'Apartment',
      area: '1200 Sq Ft',
      status: 'Rent',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'feat-5',
      name: 'Silicon Gateway',
      location: 'Bengaluru',
      price: '₹2.2 Crore',
      type: 'Villa',
      area: '3600 Sq Ft',
      status: 'Buy',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'feat-6',
      name: 'Cyber Crown',
      location: 'Visakhapatnam',
      price: '₹1.1 Crore',
      type: 'Apartment',
      area: '2100 Sq Ft',
      status: 'Buy',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'feat-7',
      name: 'Royal Palms',
      location: 'Guntur',
      price: '₹65 Lakhs',
      type: 'House',
      area: '1900 Sq Ft',
      status: 'Buy',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'feat-8',
      name: 'Emerald Fields',
      location: 'Vijayawada',
      price: '₹35 Lakhs',
      type: 'Plot',
      area: '300 Sq Yards',
      status: 'Sell',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  const filteredProperties = properties.filter(prop => {
    if (categoryFilter === 'BuyApartment') return prop.type === 'Apartment';
    if (categoryFilter === 'BuyHouse') return prop.type === 'Villa' || prop.type === 'House';
    if (categoryFilter === 'BuyLand') return prop.type === 'Plot';
    return true;
  });

  return (
    <section className="section-padding featured-properties-section">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', marginTop: '3rem' }}>
        {filteredProperties.length > 0 && filteredProperties.map((prop, idx) => (
          <div key={idx} className="property-card premium-card landscape-card" style={{ width: '100%' }}>
            <div className="property-image-container">
              <img 
                src={prop.image} 
                alt={prop.name} 
                className="property-img" 
                style={{ cursor: 'pointer' }}
                onClick={() => onPropertyClick?.(prop.id)}
              />
              <button 
                className={`wishlist-btn ${isWishlisted(prop.id) ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(prop.id);
                }}
              >
                {isWishlisted(prop.id) ? <FaHeart className="heart-icon filled" /> : <FaRegHeart className="heart-icon outline" />}
              </button>
              <button 
                className="buy-now-badge"
                onClick={(e) => {
                  e.stopPropagation();
                  onBuyProperty?.(prop.id);
                }}
              >
                <FaShoppingCart /> Buy
              </button>
              <span className={`status-badge ${prop.status.toLowerCase()}`}>
                For {prop.status}
              </span>
            </div>
            <div className="property-details">
              <div className="property-meta-top">
                <span className="property-type">{prop.type}</span>
                <span className="property-area">{prop.area}</span>
              </div>
              <h3 
                className="property-name" 
                style={{ cursor: 'pointer' }}
                onClick={() => onPropertyClick?.(prop.id)}
              >
                {prop.name}
              </h3>
              <p className="property-location">{prop.location}</p>
              <div className="property-meta-bottom">
                <span className="property-price">{prop.price}</span>
                <button className="btn btn-gold btn-view-details" onClick={() => onBuyProperty?.(prop.id)}>
                  BUY NOW
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProperties;
