import React, { useState } from 'react';
import type { PropertyListing } from '../db/marketplaceDb';
import { FaArrowLeft, FaStar, FaRegBookmark, FaBookmark } from 'react-icons/fa';

interface FlatsPageProps {
  properties: PropertyListing[];
  onBack: () => void;
  onExploreDetails: (prop: PropertyListing) => void;
}

export const FlatsPage: React.FC<FlatsPageProps> = ({ properties, onBack, onExploreDetails }) => {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const flats = properties.filter(p => p.category === 'Apartment');

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedIds.includes(id)) {
      setSavedIds(prev => prev.filter(item => item !== id));
    } else {
      setSavedIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="flats-page-container section-padding" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <div className="container">
        <button 
          onClick={onBack} 
          className="btn btn-secondary flex items-center gap-2 mb-8"
          style={{ padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <FaArrowLeft /> Back to Main Site
        </button>

        <span className="section-tag">Premium Residential Portfolios</span>
        <h2 className="section-title text-left" style={{ margin: '0.5rem 0 2rem 0' }}>Flats & Apartments Directory</h2>
        <p className="section-subtitle-left mb-8" style={{ maxWidth: '700px' }}>
          Browse our high-rise luxury apartment portfolios, pre-vetted with institutional title checks and premium city views.
        </p>

        <div className="explorer-listings-grid" style={{ marginTop: '2rem' }}>
          {flats.length === 0 ? (
            <div className="no-listings-fallback">No flats or apartments listed currently.</div>
          ) : (
            flats.map((prop) => (
              <div 
                key={prop.id} 
                className="listing-card-premium-landscape premium-card" 
                onClick={() => onExploreDetails(prop)}
                style={{ cursor: 'pointer' }}
              >
                <div className="landscape-image-wrapper">
                  <img src={prop.image} alt={prop.title} className="landscape-img" />
                  <div className="card-badges">
                    {prop.verified && <span className="badge verified">✔ Verified</span>}
                    {prop.premium && <span className="badge premium">💎 Premium</span>}
                  </div>
                </div>
                <div className="landscape-info-wrapper">
                  <div>
                    <div className="landscape-top-header">
                      <span className="landscape-type-badge">{prop.subType || 'Flat / Apartment'}</span>
                      <span className="landscape-score-badge">Match: 95%</span>
                    </div>
                    <h3 className="landscape-title">{prop.title}</h3>
                    <div className="landscape-meta-row">
                      <span>📏 {prop.areaSqFt}</span>
                      <span>📍 {prop.area}, {prop.city}</span>
                      <span className="card-rating"><FaStar /> {prop.rating}</span>
                    </div>
                  </div>
                  <div className="landscape-bottom-row">
                    <div className="landscape-price-block">
                      <span className="landscape-price-label">Price Range</span>
                      <span className="landscape-price-val">{prop.priceDisplay}</span>
                    </div>
                    <div className="landscape-actions">
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.5rem' }} 
                        onClick={(e) => toggleSave(prop.id, e)}
                      >
                        {savedIds.includes(prop.id) ? <FaBookmark className="text-amber-500" /> : <FaRegBookmark />}
                      </button>
                      <button className="btn btn-gold btn-view-details" style={{ padding: '0.6rem 1.5rem' }}>
                        Explore Portfolios
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FlatsPage;
