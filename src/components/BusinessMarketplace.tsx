import React from 'react';
import { FaUtensils, FaBriefcaseMedical, FaStore } from 'react-icons/fa';

interface BusinessMarketplaceProps {
  onExploreCategory: (category: 'Food' | 'Healthcare' | 'Retail & Stores') => void;
}

export const BusinessMarketplace: React.FC<BusinessMarketplaceProps> = ({ onExploreCategory }) => {
  return (
    <section id="business" className="section-padding business-section">
      <div className="container">
        {/* Header Area */}
        <div className="feed-header" style={{ marginBottom: '2rem' }}>
          <div className="feed-header-text">
            <span className="section-tag">Business Registry</span>
            <h2 className="section-title">Business Marketplace</h2>
          </div>
        </div>

        {/* Categories as Icons */}
        <div className="category-icon-grid" style={{ marginTop: '3rem', justifyContent: 'center', gap: '5rem' }}>
          
          <div className="category-icon-item" onClick={() => onExploreCategory('Food')}>
            <div className="category-icon-btn">
              <div className="category-icon-svg">
                <FaUtensils />
              </div>
            </div>
            <span className="category-icon-label" style={{ fontSize: '1.2rem' }}>Food</span>
          </div>

          <div className="category-icon-item" onClick={() => onExploreCategory('Healthcare')}>
            <div className="category-icon-btn">
              <div className="category-icon-svg">
                <FaBriefcaseMedical />
              </div>
            </div>
            <span className="category-icon-label" style={{ fontSize: '1.2rem' }}>Healthcare</span>
          </div>

          <div className="category-icon-item" onClick={() => onExploreCategory('Retail & Stores')}>
            <div className="category-icon-btn">
              <div className="category-icon-svg">
                <FaStore />
              </div>
            </div>
            <span className="category-icon-label" style={{ fontSize: '1.2rem' }}>Retail & Stores</span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BusinessMarketplace;
