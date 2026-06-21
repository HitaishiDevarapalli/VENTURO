import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Business {
  name: string;
  location: string;
  industry: string;
  revenue: string;
  price: string;
  image: string;
}

export const BusinessMarketplace: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const businesses: Business[] = [
    {
      name: 'High-End Bistro & Lounge',
      location: 'Hyderabad',
      industry: 'Food & Beverage',
      revenue: '₹1.2 Crore / yr',
      price: '₹45 Lakhs',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'DailyMart Supermarket Chain',
      location: 'Guntur',
      industry: 'Retail / FMCG',
      revenue: '₹85 Lakhs / yr',
      price: '₹25 Lakhs',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Precision Auto Parts Manufacturing',
      location: 'Vijayawada',
      industry: 'Manufacturing',
      revenue: '₹4.5 Crore / yr',
      price: '₹1.5 Crore',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200'
    },
    {
      name: 'Tier-3 Enterprise Software Firm',
      location: 'Hyderabad',
      industry: 'IT Services',
      revenue: '₹3.8 Crore / yr',
      price: '₹2 Crore',
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800'
    },
    {
      name: 'Premium Fitness & Wellness Hub',
      location: 'Bengaluru',
      industry: 'Fitness / Lifestyle',
      revenue: '₹1.5 Crore / yr',
      price: '₹80 Lakhs',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const slide = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 380;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="business" className="section-padding business-section">
      <div className="container">
        <div className="business-header-flex">
          <div>
            <span className="section-tag">Business Registry</span>
            <h2 className="section-title">Acquisition Marketplace</h2>
            <p className="section-subtitle-left">
              Secure investment-ready operational businesses. Acquire equity or absolute ownership of cash-flowing enterprises.
            </p>
          </div>
          <div className="slider-controls">
            <button className="slider-btn" onClick={() => slide('left')} aria-label="Slide Left">
              <FaChevronLeft />
            </button>
            <button className="slider-btn" onClick={() => slide('right')} aria-label="Slide Right">
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div className="business-slider-container" ref={sliderRef}>
          {businesses.map((biz, idx) => (
            <div key={idx} className="business-card premium-card">
              <div className="business-image-wrapper">
                <img src={biz.image} alt={biz.name} className="business-img" />
                <span className="business-industry-badge">{biz.industry}</span>
              </div>
              
              <div className="business-info">
                <h3 className="business-name">{biz.name}</h3>
                <p className="business-location">{biz.location}</p>

                <div className="business-metrics">
                  <div className="metric-row">
                    <span className="label">Annual Revenue</span>
                    <span className="value font-semibold">{biz.revenue}</span>
                  </div>
                  <div className="metric-row">
                    <span className="label">Acquisition Price</span>
                    <span className="value text-gold font-bold">{biz.price}</span>
                  </div>
                </div>

                <div className="business-actions">
                  <button className="btn btn-primary w-full btn-biz-cta">
                    Request Financial Details
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

export default BusinessMarketplace;
