import React, { useState, useMemo, useEffect } from 'react';
import { propertiesDb, dealersDb } from '../db/marketplaceDb';
import type { Dealer } from '../db/marketplaceDb';
import { FaMapMarkerAlt, FaFilter, FaBuilding, FaHome, FaMapMarkedAlt, FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';

interface PropertyCategoriesProps {
  onPropertyClick?: (id: string) => void;
  onBuyProperty?: (id: string) => void;
  onCategorySelect?: (category: string) => void;
  initialCategory?: string | null;
}

export const PropertyCategories: React.FC<PropertyCategoriesProps> = ({ onPropertyClick, onBuyProperty, onCategorySelect, initialCategory }) => {
  // Feed Filters State
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedBhk, setSelectedBhk] = useState<string>('All');
  const [budgetLimit, setBudgetLimit] = useState<number>(500); // Up to 500 Lakhs (5 Cr)
  const [readyToMove, setReadyToMove] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  
  // Modal State
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [showSellerPortfolio, setShowSellerPortfolio] = useState<Dealer | null>(null);

  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);

  useEffect(() => {
    setActiveCategory(initialCategory || null);
  }, [initialCategory]);
  
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Scroll Blocker & Lenis Controller
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (showSellerPortfolio || selectedDealer) {
      lenis?.stop();
      document.body.classList.add('modal-open');
    } else {
      lenis?.start();
      document.body.classList.remove('modal-open');
    }
    return () => {
      lenis?.start();
      document.body.classList.remove('modal-open');
    };
  }, [showSellerPortfolio, selectedDealer]);

  const categoryIcons = [
    { id: 'BuyApartment', label: 'Flats & Apartments', icon: <FaBuilding /> },
    { id: 'BuyHouse', label: 'Individual Houses', icon: <FaHome /> },
    { id: 'BuyLand', label: 'Lands & Plots', icon: <FaMapMarkedAlt /> },
  ];

  // Apply Filters
  const filteredProperties = useMemo(() => {
    return propertiesDb.filter(prop => {
      // Category Match Logic
      if (activeCategory === 'BuyApartment') {
        if (!['Apartment'].includes(prop.category)) return false;
      } else if (activeCategory === 'BuyHouse') {
        if (!['House', 'Villa'].includes(prop.category)) return false;
      } else if (activeCategory === 'BuyLand') {
        if (prop.category !== 'Plot') return false;
      }

      // Filter by City
      if (selectedCity !== 'All' && prop.city !== selectedCity) return false;

      // Filter by Budget (prop.price is in Lakhs)
      if (prop.price > budgetLimit) return false;

      // Filter by BHK
      if (selectedBhk !== 'All') {
        if (selectedBhk === '1 BHK' && !prop.description.includes('1 BHK') && !prop.title.includes('1BHK')) return false;
        if (selectedBhk === '2 BHK' && !prop.description.includes('2 BHK') && !prop.title.includes('2BHK')) return false;
        if (selectedBhk === '3 BHK' && !prop.description.includes('3 BHK') && !prop.title.includes('3BHK')) return false;
        if (selectedBhk === '4+ BHK' && !prop.description.includes('4 BHK') && !prop.title.includes('4BHK') && !prop.title.includes('Penthouse')) return false;
      }

      // Checkboxes
      if (verifiedOnly && !prop.verified) return false;
      if (readyToMove && prop.status === 'Rent') return false; 

      return true;
    });
  }, [activeCategory, selectedCity, selectedBhk, budgetLimit, readyToMove, verifiedOnly]);

  const uniqueCities = Array.from(new Set(propertiesDb.map(p => p.city)));

  const getDealer = (dealerId: string): Dealer | undefined => {
    return dealersDb.find(d => d.id === dealerId);
  };

  return (
    <section id="properties" className="section-padding property-feed-section" style={{ paddingTop: initialCategory ? '2rem' : '5rem' }}>
      <div className="container">
        
        {/* Header Area - Hide on subpages since SubpageHeader covers it */}
        {!initialCategory && (
          <div className="feed-header">
            <div className="feed-header-text">
              <span className="section-tag">Explore TheNexopp</span>
              <h2 className="section-title">Property Categories</h2>
            </div>
          </div>
        )}

        {/* Category Icons Grid - only show when no initialCategory (i.e. on the properties landing page) */}
        {!initialCategory && (
        <div className="category-icon-grid">
          {categoryIcons.map(cat => (
            <div 
              key={cat.id} 
              className={`category-icon-item ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                if (onCategorySelect) {
                  onCategorySelect(cat.id);
                } else {
                  setActiveCategory(activeCategory === cat.id ? null : cat.id);
                }
              }}
            >
              <div className="category-icon-btn">
                <span className="category-icon-svg">{cat.icon}</span>
              </div>
              <p className="category-icon-label">{cat.label}</p>
            </div>
          ))}
        </div>
        )}

        {/* Show Feed Only if a Category is Selected */}
        {activeCategory && (
          <div className="category-feed-container animation-fade-in" style={initialCategory ? { marginTop: 0, paddingTop: 0, borderTop: 'none' } : {}}>
            <div className="feed-filter-bar glass-card">
          <div className="filter-group">
            <label>City</label>
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="feed-select">
              <option value="All">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>BHK</label>
            <select value={selectedBhk} onChange={(e) => setSelectedBhk(e.target.value)} className="feed-select">
              <option value="All">Any BHK</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4+ BHK">4+ BHK</option>
            </select>
          </div>

          <div className="filter-group slider-group">
            <label>Budget (Up to ₹{budgetLimit >= 100 ? (budgetLimit/100).toFixed(2) + ' Cr' : budgetLimit + ' L'})</label>
            <input 
              type="range" 
              min="20" 
              max="1000" 
              step="10"
              value={budgetLimit} 
              onChange={(e) => setBudgetLimit(Number(e.target.value))} 
              className="feed-slider"
            />
          </div>

          <div className="filter-group checkbox-group">
            <label className="feed-checkbox-label">
              <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
              Verified Sellers
            </label>
            <label className="feed-checkbox-label">
              <input type="checkbox" checked={readyToMove} onChange={(e) => setReadyToMove(e.target.checked)} />
              Ready To Move
            </label>
          </div>
        </div>

        {/* Listings Feed */}
        <div className="property-feed-list">
          {filteredProperties.length === 0 ? (
            <div className="feed-empty-state">
              <FaFilter className="empty-icon" />
              <h3>No properties match your criteria</h3>
              <p>Try adjusting your budget or selecting a different city.</p>
            </div>
          ) : (
            filteredProperties.map((prop) => (
              <div key={prop.id} className="feed-card premium-card landscape-card">
                <div className="feed-card-image-wrap">
                  <img 
                    src={prop.image} 
                    alt={prop.title} 
                    className="feed-card-img" 
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
                  <div className="feed-card-badges">
                    {prop.premium && <span className="badge-premium">💎 Premium</span>}
                    {prop.verified && <span className="badge-verified">✔ Verified</span>}
                  </div>
                </div>

                <div className="feed-card-body">
                  <div className="feed-card-price-title">
                    <h3 className="feed-prop-price">₹ {prop.priceDisplay}</h3>
                    <h4 
                      className="feed-prop-title" 
                      style={{ cursor: 'pointer' }}
                      onClick={() => onPropertyClick?.(prop.id)}
                    >
                      {prop.title}
                    </h4>
                  </div>
                  
                  <div className="feed-card-specs">
                    <span className="spec-item">🛏 {prop.category === 'Apartment' ? '3 BHK' : 'House'}</span>
                    <span className="spec-item">🛁 3 Baths</span>
                    <span className="spec-item">📐 {prop.areaSqFt} Sq.Ft.</span>
                    <span className="spec-item spec-highlight">✨ {prop.status === 'Buy' || prop.status === 'Sell' ? 'Ready To Move' : 'Available'}</span>
                  </div>

                  <div className="feed-card-footer">
                    <div className="footer-left">
                      <p className="feed-prop-location">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.area + ', ' + prop.city)}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="location-link"
                          title="View on Google Maps"
                        >
                          <FaMapMarkerAlt /> {prop.area}, {prop.city}
                        </a>
                      </p>
                      <p className="feed-prop-seller">👤 Seller: {getDealer(prop.dealerId)?.companyName || 'Independent Seller'} | 📅 Posted: {prop.createdDate}</p>
                    </div>
                    <div className="footer-right">
                      {getDealer(prop.dealerId) ? (
                        <div className="feed-seller-action-container">
                          <div className="feed-seller-label-group">
                            <span className="feed-seller-label">Seller</span>
                            <span className="feed-seller-rating">⭐ {getDealer(prop.dealerId)?.rating}</span>
                          </div>
                          <div className="feed-seller-photo-wrap" onClick={() => setSelectedDealer(getDealer(prop.dealerId)!)}>
                            <img 
                              src={getDealer(prop.dealerId)?.photo || getDealer(prop.dealerId)?.logo} 
                              alt={getDealer(prop.dealerId)?.companyName} 
                              className="feed-seller-photo-btn" 
                              title="View Seller Details" 
                            />
                          </div>
                        </div>
                      ) : (
                        <button className="btn btn-gold feed-view-btn" onClick={() => onPropertyClick?.(prop.id)}>View Details</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
          </div>
        )}

        {/* Seller Details Modal */}
        {selectedDealer && (
          <div className="seller-modal-overlay" onClick={() => setSelectedDealer(null)}>
            <div className="seller-modal-content seller-modal-wide" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal-btn" onClick={() => setSelectedDealer(null)}>×</button>
              
              <div className="seller-modal-split">
                {/* Left Column: Seller Details */}
                <div className="seller-modal-left">
                  <div className="seller-modal-header">
                    <img 
                      src={selectedDealer.photo || selectedDealer.logo} 
                      alt={selectedDealer.companyName} 
                      className="seller-modal-img" 
                      style={{ cursor: 'pointer' }}
                      title="View Fullscreen Portfolio"
                      onClick={() => {
                        setShowSellerPortfolio(selectedDealer);
                        setSelectedDealer(null);
                      }}
                    />
                    <div className="seller-modal-title">
                      <h3>{selectedDealer.companyName}</h3>
                      <div className="seller-badges">
                        {selectedDealer.verified && <span className="badge-verified">✔ Verified</span>}
                        {selectedDealer.premiumPartner && <span className="badge-premium">💎 Premium</span>}
                      </div>
                    </div>
                  </div>
                  <div className="seller-modal-body">
                    <div className="seller-stat-grid">
                      <div className="seller-stat">
                        <span className="stat-label">Rating</span>
                        <span className="stat-val">⭐ {selectedDealer.rating} ({selectedDealer.reviewCount})</span>
                      </div>
                      <div className="seller-stat">
                        <span className="stat-label">Experience</span>
                        <span className="stat-val">{selectedDealer.yearsExperience} Years</span>
                      </div>
                      <div className="seller-stat">
                        <span className="stat-label">Inventory</span>
                        <span className="stat-val">{selectedDealer.inventoryCount} Properties</span>
                      </div>
                      <div className="seller-stat">
                        <span className="stat-label">Response Time</span>
                        <span className="stat-val">{selectedDealer.responseTime}</span>
                      </div>
                    </div>
                    <button className="btn btn-gold w-100 mt-4" style={{marginTop: '1.5rem', width: '100%'}} onClick={() => alert(`Contacting ${selectedDealer.companyName}...`)}>Contact Seller</button>
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                        📸 Instagram: @venturo_realty
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column: Seller Inventory */}
                <div className="seller-modal-right">
                  <h4 className="inventory-title">Available Properties</h4>
                  <div className="seller-inventory-grid">
                    {propertiesDb.filter(p => p.dealerId === selectedDealer.id).length === 0 ? (
                      <p className="no-inventory-msg">No properties found for this seller.</p>
                    ) : (
                      propertiesDb.filter(p => p.dealerId === selectedDealer.id).map(invProp => (
                        <div key={invProp.id} className="inventory-card">
                          <div className="inventory-card-img-wrap">
                            <img src={invProp.image} alt={invProp.title} className="inventory-card-img" />
                            {invProp.premium && <span className="inventory-badge-tiny">💎</span>}
                          </div>
                          <div className="inventory-card-details">
                            <span className="inventory-price">₹ {invProp.priceDisplay}</span>
                            <span className="inventory-area">{invProp.area}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Seller Portfolio */}
        {showSellerPortfolio && (
          <div className="fullscreen-portfolio-overlay" data-lenis-prevent="true">
            <div className="container portfolio-container">
              <button 
                className="btn btn-back portfolio-back-btn" 
                onClick={() => {
                  setSelectedDealer(showSellerPortfolio);
                  setShowSellerPortfolio(null);
                }}
              >
                <FaArrowLeft /> Back to Details
              </button>

              <div className="portfolio-header">
                <img 
                  src={showSellerPortfolio.photo || showSellerPortfolio.logo} 
                  alt={showSellerPortfolio.companyName} 
                  className="portfolio-seller-img" 
                />
                <div className="portfolio-header-text">
                  <span className="section-tag">Exclusive Portfolio</span>
                  <h1 className="portfolio-title">{showSellerPortfolio.companyName}</h1>
                  <div className="portfolio-meta">
                    <span className="meta-item">⭐ {showSellerPortfolio.rating} ({showSellerPortfolio.reviewCount} Reviews)</span>
                    <span className="meta-item">💼 {showSellerPortfolio.yearsExperience} Years Exp</span>
                    <span className="meta-item">🏢 {showSellerPortfolio.inventoryCount} Active Properties</span>
                  </div>
                </div>
              </div>

              {/* Seller Profile & Contact Section - Placed FIRST (above properties) */}
              <div className="portfolio-seller-details-card premium-card" style={{ marginBottom: '3rem', padding: '2.5rem' }}>
                <div className="seller-details-grid">
                  <div className="seller-profile-column">
                    <img 
                      src={showSellerPortfolio.photo || showSellerPortfolio.logo} 
                      alt={showSellerPortfolio.companyName} 
                      className="seller-details-avatar" 
                    />
                    <h3 className="seller-details-name">{showSellerPortfolio.companyName}</h3>
                    <div className="seller-details-badges" style={{ marginTop: '0.5rem' }}>
                      {showSellerPortfolio.verified && <span className="badge-verified" style={{ marginRight: '8px' }}>✔ Verified Dealer</span>}
                      {showSellerPortfolio.premiumPartner && <span className="badge-premium">💎 Premium Partner</span>}
                    </div>
                    <div className="seller-details-rating" style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
                      ⭐ <strong>{showSellerPortfolio.rating}</strong> ({showSellerPortfolio.reviewCount} user reviews)
                    </div>
                  </div>

                  <div className="seller-info-column">
                    <h4 className="column-title">Contact & Agent Information</h4>
                    <div className="info-list">
                      <div className="info-item">
                        <span className="info-label">👤 Authorized Name</span>
                        <span className="info-value">{showSellerPortfolio.companyName} Operations Group</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">📞 Mobile Number</span>
                        <span className="info-value" style={{ color: 'var(--gold)', fontWeight: 'bold' }}>+91 99890 87654</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">✉ Email Address</span>
                        <span className="info-value">info@{showSellerPortfolio.companyName.toLowerCase().replace(/\s+/g, '')}.com</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">📍 Headquarters / City</span>
                        <span className="info-value">Jubilee Hills, Hyderabad, Telangana</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">⏱ Avg Response Time</span>
                        <span className="info-value">{showSellerPortfolio.responseTime}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">💼 Experience</span>
                        <span className="info-value">{showSellerPortfolio.yearsExperience} Years in Market</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">📸 Instagram Profile</span>
                        <span className="info-value">
                          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>
                            @venturo_realty
                          </a>
                        </span>
                      </div>
                    </div>

                    <div className="portfolio-message-box" style={{ marginTop: '2rem' }}>
                      <h5 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Send Direct Message</h5>
                      <textarea 
                        className="inquiry-textarea" 
                        placeholder={`Write your inquiry message for ${showSellerPortfolio.companyName} here...`}
                        style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: '6px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'none' }}
                      />
                      <button 
                        className="btn btn-gold" 
                        style={{ marginTop: '1rem', width: '100%' }}
                        onClick={() => alert(`Your inquiry has been successfully sent to ${showSellerPortfolio.companyName}! They will get back to you shortly.`)}
                      >
                        Submit Inquiry
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Properties Grid - Placed LATER (below contact card) */}
              <div className="portfolio-grid">
                {propertiesDb.filter(p => p.dealerId === showSellerPortfolio.id).map(prop => (
                  <div key={prop.id} className="feed-card premium-card landscape-card portfolio-card-item">
                    <div className="feed-card-image-wrap">
                      <img 
                        src={prop.image} 
                        alt={prop.title} 
                        className="feed-card-img" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setShowSellerPortfolio(null);
                          onPropertyClick?.(prop.id);
                        }}
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
                      <div className="feed-card-badges">
                        {prop.premium && <span className="badge-premium">💎 Premium</span>}
                        {prop.verified && <span className="badge-verified">✔ Verified</span>}
                      </div>
                    </div>

                    <div className="feed-card-body">
                      <div className="feed-card-price-title">
                        <h3 className="feed-prop-price">₹ {prop.priceDisplay}</h3>
                        <h4 
                          className="feed-prop-title" 
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setShowSellerPortfolio(null);
                            onPropertyClick?.(prop.id);
                          }}
                        >
                          {prop.title}
                        </h4>
                      </div>

                      <div className="feed-card-specs">
                        <span className="spec-item">🛏 {prop.category === 'Apartment' ? '3 BHK' : 'House'}</span>
                        <span className="spec-item">🛁 3 Baths</span>
                        <span className="spec-item">📐 {prop.areaSqFt} Sq.Ft.</span>
                        <span className="spec-item spec-highlight">✨ Ready To Move</span>
                      </div>

                      <div className="feed-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
                        <p className="feed-prop-location" style={{ margin: 0 }}>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(prop.area + ', ' + prop.city)}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="location-link"
                            title="View on Google Maps"
                          >
                            <FaMapMarkerAlt /> {prop.area}, {prop.city}
                          </a>
                        </p>
                        <button 
                          className="btn btn-gold btn-sm portfolio-buy-btn"
                          style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onBuyProperty?.(prop.id);
                          }}
                        >
                          <FaShoppingCart /> Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default PropertyCategories;
