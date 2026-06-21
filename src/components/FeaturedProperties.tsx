import React, { useRef } from 'react';

interface Property {
  name: string;
  location: string;
  price: string;
  type: string;
  area: string;
  status: 'Buy' | 'Sell' | 'Rent';
  image: string;
}

export const FeaturedProperties: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const properties: Property[] = [
    {
      name: 'Skyline Heights',
      location: 'Hyderabad',
      price: '₹85 Lakhs',
      type: 'Apartment',
      area: '1800 Sq Ft',
      status: 'Buy',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Golden Meadows',
      location: 'Guntur',
      price: '₹42 Lakhs',
      type: 'Plot',
      area: '240 Sq Yards',
      status: 'Sell',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200'
    },
    {
      name: 'Prestige Villas',
      location: 'Hyderabad',
      price: '₹1.8 Crore',
      type: 'Villa',
      area: '3200 Sq Ft',
      status: 'Buy',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Urban Nest',
      location: 'Vijayawada',
      price: '₹28,000 / mo',
      type: 'Apartment',
      area: '1200 Sq Ft',
      status: 'Rent',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Silicon Gateway',
      location: 'Bengaluru',
      price: '₹2.2 Crore',
      type: 'Villa',
      area: '3600 Sq Ft',
      status: 'Buy',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Cyber Crown',
      location: 'Visakhapatnam',
      price: '₹1.1 Crore',
      type: 'Apartment',
      area: '2100 Sq Ft',
      status: 'Buy',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Royal Palms',
      location: 'Guntur',
      price: '₹65 Lakhs',
      type: 'House',
      area: '1900 Sq Ft',
      status: 'Buy',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Emerald Fields',
      location: 'Vijayawada',
      price: '₹35 Lakhs',
      type: 'Plot',
      area: '300 Sq Yards',
      status: 'Sell',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  // We duplicate the list to ensure infinite smooth scrolling carousel
  const carouselItems = [...properties, ...properties];

  return (
    <section className="section-padding featured-properties-section">
      <div className="container">
        <span className="section-tag text-center">Featured Listings</span>
        <h2 className="section-title text-center">Curated Real Estate</h2>
        <p className="section-subtitle text-center">
          Handpicked premium listings featured for investors looking for stability, design, and prime locations.
        </p>
      </div>

      {/* Infinite Horizontal Carousel */}
      <div className="carousel-wrapper">
        <div className="carousel-track" ref={scrollRef}>
          {carouselItems.map((prop, idx) => (
            <div key={idx} className="property-card premium-card">
              <div className="property-image-container">
                <img src={prop.image} alt={prop.name} className="property-img" />
                <span className={`status-badge ${prop.status.toLowerCase()}`}>
                  For {prop.status}
                </span>
              </div>
              <div className="property-details">
                <div className="property-meta-top">
                  <span className="property-type">{prop.type}</span>
                  <span className="property-area">{prop.area}</span>
                </div>
                <h3 className="property-name">{prop.name}</h3>
                <p className="property-location">{prop.location}</p>
                <div className="property-meta-bottom">
                  <span className="property-price">{prop.price}</span>
                  <button className="btn btn-gold btn-view-details">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
