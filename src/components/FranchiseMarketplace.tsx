import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaStore, FaHotel, FaGraduationCap } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

interface FranchiseListing {
  brand: string;
  type: string;
  investment: string;
  location: string;
  logo: React.ReactNode;
  image: string;
}

export const FranchiseMarketplace: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const listings: FranchiseListing[] = [
    {
      brand: 'Chai Oasis',
      type: 'Restaurant Franchise',
      investment: '₹15 Lakhs',
      location: 'Hyderabad',
      logo: <FaHotel />,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'
    },
    {
      brand: 'Vogue Retail',
      type: 'Retail Franchise',
      investment: '₹8 Lakhs',
      location: 'Guntur',
      logo: <FaStore />,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    },
    {
      brand: 'Apex Academy',
      type: 'Education Franchise',
      investment: '₹20 Lakhs',
      location: 'Vijayawada',
      logo: <FaGraduationCap />,
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800'
    }
  ];

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.franchise-grid-card');
    if (cards) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.9, 
          stagger: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, []);

  return (
    <section id="franchise" className="section-padding franchise-section" ref={containerRef}>
      <div className="container">
        <span className="section-tag text-center">Franchise Models</span>
        <h2 className="section-title text-center">Franchise Marketplace</h2>
        <p className="section-subtitle text-center">
          Expand your footprint or step into established operations. Choose between turnkey new setups or high-earning operational units.
        </p>

        {/* Categories split */}
        <div className="franchise-split-cards">
          <div className="franchise-category-card premium-card text-center">
            <div className="franchise-cat-icon"><FaStore /></div>
            <h3>New Franchise Openings</h3>
            <p>Deploy brand-new branch setups of popular national & regional brands in prime targeted locations.</p>
            <button className="btn btn-outline-gold">View Directory</button>
          </div>

          <div className="franchise-category-card premium-card text-center">
            <div className="franchise-cat-icon"><FaHotel /></div>
            <h3>Existing Franchise Resales</h3>
            <p>Acquire fully-furnished, staffed, and running franchise branches with immediate historical revenues.</p>
            <button className="btn btn-primary">Explore Resales</button>
          </div>
        </div>

        {/* Featured Listings Header */}
        <div className="featured-listings-header">
          <h3>Featured Franchise Opportunities</h3>
          <div className="accent-line-left"></div>
        </div>

        {/* Listings Grid */}
        <div className="franchise-listings-grid">
          {listings.map((list, idx) => (
            <div key={idx} className="franchise-grid-card premium-card">
              <div className="franchise-img-wrapper">
                <img src={list.image} alt={list.brand} />
                <div className="franchise-icon-badge">{list.logo}</div>
              </div>
              <div className="franchise-card-body">
                <span className="franchise-type">{list.type}</span>
                <h4 className="franchise-brand-name">{list.brand}</h4>
                
                <div className="franchise-details">
                  <div className="franchise-detail-row">
                    <span className="label">Investment Required</span>
                    <span className="value">{list.investment}</span>
                  </div>
                  <div className="franchise-detail-row">
                    <span className="label">Location Target</span>
                    <span className="value">{list.location}</span>
                  </div>
                </div>

                <button className="btn btn-gold w-full mt-4 btn-franchise">
                  Request Franchise Kit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FranchiseMarketplace;
