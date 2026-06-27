import React, { useEffect } from 'react';
import { franchiseDb } from '../db/marketplaceDb';
import { FaArrowLeft, FaMapMarkerAlt, FaStore, FaChartLine, FaCheckCircle, FaShoppingCart } from 'react-icons/fa';

interface FranchiseDetailsPageProps {
  franchiseId: string;
  onBack: () => void;
  onBuyProperty?: (id: string) => void;
}

export const FranchiseDetailsPage: React.FC<FranchiseDetailsPageProps> = ({ franchiseId, onBack, onBuyProperty }) => {
  const franchise = franchiseDb.find(f => f.id === franchiseId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [franchiseId]);

  if (!franchise) return <div style={{ padding: '100px', textAlign: 'center' }}>Franchise not found.</div>;

  return (
    <div className="prop-details-page animation-fade-in" style={{ padding: '2rem 0', background: 'var(--bg-main)', minHeight: '100vh' }}>
      <div className="container" style={{ position: 'relative' }}>
        
        {/* Back navigation */}
        <button className="circle-back-btn" onClick={onBack} title="Go Back" style={{ marginBottom: '1.5rem' }}>
          <FaArrowLeft />
        </button>

        <div className="feed-card premium-card landscape-card" style={{ marginBottom: '3rem' }}>
          <div className="feed-card-image-wrap">
            <img src={franchise.image} alt={franchise.brand} className="feed-card-img" />
            <button 
              className="buy-now-badge"
              onClick={(e) => {
                e.stopPropagation();
                onBuyProperty?.(franchise.id);
              }}
            >
              <FaShoppingCart /> Buy
            </button>
            <div className="feed-card-badges">
              {franchise.trending && <span className="badge-premium">🔥 Trending</span>}
            </div>
          </div>

          <div className="feed-card-body" style={{ padding: '2rem' }}>
            <div className="feed-card-price-title">
              <h3 className="feed-prop-price">{franchise.investmentDisplay}</h3>
              <h4 className="feed-prop-title" style={{ fontSize: '2rem' }}>{franchise.brand}</h4>
            </div>
            
            <div className="feed-card-specs" style={{ margin: '1.5rem 0' }}>
              <span className="spec-item"><FaStore /> {franchise.type}</span>
              <span className="spec-item"><FaMapMarkerAlt /> {franchise.availableBranchCount} Locations</span>
              <span className="spec-item"><FaChartLine /> {franchise.trustScore}% Trust Score</span>
              <span className="spec-item spec-highlight"><FaCheckCircle /> Verified Franchise</span>
            </div>

            <div className="feed-card-footer" style={{ borderTop: 'none', paddingTop: '0', marginTop: 'auto' }}>
              <div className="footer-left">
                <p className="feed-prop-seller" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  Type: <strong>{franchise.type}</strong>
                </p>
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  This is a verified seller representing {franchise.brand}. Acquiring this franchise provides you with fully equipped locations, trained staff, and an established customer base. Immediate revenue generation from day one.
                </p>
              </div>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button className="btn btn-gold" onClick={() => onBuyProperty?.(franchise.id)}>Contact Seller</button>
              <button className="btn btn-outline-gold">Download Brochure</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
