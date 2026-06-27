import React, { useState, useMemo, useEffect } from 'react';
import { propertiesDb, dealersDb, franchiseDb, businessDb } from '../db/marketplaceDb';
import { 
  FaArrowLeft, FaHeart, FaRegHeart, FaShareAlt, 
  FaMapMarkerAlt, FaShoppingCart, FaPhone, 
  FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';

interface PropertyDetailsPageProps {
  propertyId: string;
  onBack: () => void;
  onPropertyClick: (id: string) => void;
  onBuyProperty?: (id: string) => void;
}

export const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({ 
  propertyId, 
  onBack, 
  onPropertyClick,
  onBuyProperty
}) => {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [message, setMessage] = useState('');
  const [showSellerPortfolio, setShowSellerPortfolio] = useState(false);

  // Reset all state and scroll to top when propertyId changes
  useEffect(() => {
    setActiveImageIndex(0);
    setShowPhone(false);
    setMessage('');
    setShowSellerPortfolio(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [propertyId]);

  useEffect(() => {
    const lenis = (window as any).lenis;
    if (showSellerPortfolio) {
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
  }, [showSellerPortfolio]);

  // Fetch current property or franchise or business
  const property = useMemo(() => {
    const p = propertiesDb.find(p => p.id === propertyId);
    if (p) return p;

    const f = franchiseDb.find(f => f.id === propertyId);
    if (f) {
      const index = parseInt(f.id.replace(/\D/g, '')) || 1;
      const dealerId = index % 2 === 0 ? 'D2' : 'D1';
      return {
        id: f.id,
        dealerId: dealerId,
        title: f.brand,
        description: `Verified operational setup for ${f.brand} (${f.type}). High customer retention, stable local supply chains, fully integrated POS systems, and complete staff handover. Ideal for owner-operator or passive investment.`,
        image: f.image,
        state: f.state || 'Telangana',
        district: 'Rangareddy',
        city: f.city || 'Hyderabad',
        area: f.location.split(',')[1]?.trim() || f.location,
        areaSqFt: `${f.availableBranchCount} Units Available`,
        priceDisplay: f.investmentDisplay,
        category: 'Commercial',
        specs: {
          'Type': f.type,
          'Branches': f.availableBranchCount,
          'Trust Score': `${f.trustScore}%`,
          'Status': 'Operational',
          'Verification': 'Verified Franchise',
          'Industry': f.type.split(' ')[0] || 'Retail',
          'Listed By': 'Brand Partner',
          'Headquarters': f.location
        }
      } as any;
    }

    const b = businessDb.find(b => b.id === propertyId);
    if (b) {
      const index = parseInt(b.id.replace(/\D/g, '')) || 1;
      const dealerId = index % 2 === 0 ? 'D2' : 'D1';
      return {
        id: b.id,
        dealerId: dealerId,
        title: b.name,
        description: `Premium running operational unit in the ${b.industry} sector. Monthly revenue averages verified against GST/tax registries. Sale includes trade license transfers, lease assignment, assets, inventory, and supplier contracts. Seller profile: ${b.sellerProfile}.`,
        image: b.image,
        state: b.state || 'Telangana',
        district: 'Rangareddy',
        city: b.city || 'Hyderabad',
        area: b.location.split(',')[1]?.trim() || b.location,
        areaSqFt: 'Operational Unit',
        priceDisplay: b.priceDisplay,
        category: 'Commercial',
        specs: {
          'Type': 'Business Acquisition',
          'Industry': b.industry,
          'Trust Score': `${b.trustScore}%`,
          'Revenue': b.revenue,
          'Status': 'Running',
          'Seller Profile': b.sellerProfile,
          'Listed By': 'Broker Brokerage',
          'Headquarters': b.location
        }
      } as any;
    }

    return null;
  }, [propertyId]);

  // Fetch dealer
  const dealer = useMemo(() => {
    if (!property) return null;
    return dealersDb.find(d => d.id === property.dealerId) || null;
  }, [property]);

  // Generate dynamic gallery images based on category
  const galleryImages = useMemo(() => {
    if (!property) return [];
    const mainImage = property.image;
    const defaults = {
      Apartment: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800',
      ],
      Villa: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      ],
      House: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
      ],
      Plot: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
      ],
      Commercial: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      ]
    };
    const key = (property.category === 'Villa' || property.category === 'House') ? property.category : 'Apartment';
    const list = defaults[key as keyof typeof defaults] || defaults.Apartment;
    return [mainImage, ...list];
  }, [property]);

  // Fetch other properties of the same dealer
  const otherProperties = useMemo(() => {
    if (!property) return [];
    return propertiesDb.filter(p => p.dealerId === property.dealerId && p.id !== property.id);
  }, [property]);

  if (!property) {
    return (
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2>Property Not Found</h2>
        <button className="btn btn-gold mt-4" onClick={onBack}><FaArrowLeft /> Go Back</button>
      </div>
    );
  }

  const handlePrevImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    alert(`Inquiry message successfully sent to ${dealer?.companyName || 'Seller'}! They will contact you shortly.`);
    setMessage('');
  };

  // Derive specs fields
  const superArea = property.areaSqFt;
  const isPlot = property.category === 'Plot';
  const carpetArea = isPlot ? 'N/A' : `${Math.round(parseInt(superArea) * 0.85)} sqft`;
  const typeDisplay = isPlot ? 'Plots & Land' : (property.category === 'Villa' || property.category === 'House') ? 'House & Villa' : 'Flats & Apartments';

  return (
    <div className="prop-details-page animation-fade-in" style={{ padding: '2rem 0', background: 'var(--bg-main)', minHeight: '100vh' }}>
      <div className="container" style={{ position: 'relative' }}>
        
        {/* Back navigation */}
        <button className="circle-back-btn" onClick={onBack} title="Go Back" style={{ marginBottom: '1.5rem' }}>
          <FaArrowLeft />
        </button>

        <div className="prop-details-split">
          
          {/* Left Column: Media & Specifications */}
          <div className="prop-details-left">
            
            {/* Gallery Slider */}
            <div className="prop-gallery-container">
              <div className="prop-gallery-main">
                <button className="gallery-arrow arrow-left" onClick={handlePrevImage}>
                  <FaChevronLeft />
                </button>
                <img 
                  src={galleryImages[activeImageIndex]} 
                  alt={`${property.title} - View ${activeImageIndex + 1}`} 
                  className="prop-gallery-img" 
                />
                <button className="gallery-arrow arrow-right" onClick={handleNextImage}>
                  <FaChevronRight />
                </button>
              </div>
              
              {/* Gallery Thumbnails */}
              <div className="prop-gallery-thumbs">
                {galleryImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`thumb-wrap ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img} alt="thumbnail" />
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications Table */}
            <div className="prop-section-block">
              <h3 className="section-block-title">Details</h3>
              <div className="prop-spec-table">
                {property.specs ? (
                  // Custom dynamic specifications for Franchise / Business
                  Object.entries(property.specs).reduce<any[]>((acc, [key, val], idx, arr) => {
                    if (idx % 2 === 0) {
                      const next = arr[idx + 1];
                      acc.push(
                        <div key={idx} className="prop-spec-row">
                          <div className="spec-col">
                            <span className="spec-lbl">{key}</span>
                            <span className="spec-val" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{val as string}</span>
                          </div>
                          {next ? (
                            <div className="spec-col">
                              <span className="spec-lbl">{next[0]}</span>
                              <span className="spec-val" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{next[1] as string}</span>
                            </div>
                          ) : (
                            <div className="spec-col">
                              <span className="spec-lbl"></span>
                              <span className="spec-val"></span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return acc;
                  }, [])
                ) : (
                  // Default property specifications
                  <>
                    <div className="prop-spec-row">
                      <div className="spec-col">
                        <span className="spec-lbl">Type</span>
                        <span className="spec-val">{typeDisplay}</span>
                      </div>
                      <div className="spec-col">
                        <span className="spec-lbl">Bedrooms</span>
                        <span className="spec-val">{isPlot ? 'N/A' : '3'}</span>
                      </div>
                    </div>

                    <div className="prop-spec-row">
                      <div className="spec-col">
                        <span className="spec-lbl">Super Built-up area sqft</span>
                        <span className="spec-val">{superArea}</span>
                      </div>
                      <div className="spec-col">
                        <span className="spec-lbl">Bathrooms</span>
                        <span className="spec-val">{isPlot ? 'N/A' : '2'}</span>
                      </div>
                    </div>

                    <div className="prop-spec-row">
                      <div className="spec-col">
                        <span className="spec-lbl">Project Status</span>
                        <span className="spec-val">Ready to Move</span>
                      </div>
                      <div className="spec-col">
                        <span className="spec-lbl">Listed By</span>
                        <span className="spec-val">{dealer ? 'Dealer' : 'Owner'}</span>
                      </div>
                    </div>

                    <div className="prop-spec-row">
                      <div className="spec-col">
                        <span className="spec-lbl">Facing</span>
                        <span className="spec-val">North-East</span>
                      </div>
                      <div className="spec-col">
                        <span className="spec-lbl">Carpet area sqft</span>
                        <span className="spec-val">{carpetArea}</span>
                      </div>
                    </div>

                    <div className="prop-spec-row">
                      <div className="spec-col">
                        <span className="spec-lbl">Car Parking</span>
                        <span className="spec-val">{isPlot ? 'None' : '1'}</span>
                      </div>
                      <div className="spec-col">
                        <span className="spec-lbl">Project Name</span>
                        <span className="spec-val" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{property.title}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="prop-section-block" style={{ marginTop: '2rem' }}>
              <h3 className="section-block-title">Description</h3>
              <p className="prop-desc-text">{property.description}</p>
            </div>
          </div>

          {/* Right Column: Pricing, Seller, Maps */}
          <div className="prop-details-right">
            
            {/* Price Box */}
            <div className="prop-right-box prop-price-box">
              <div className="price-box-header">
                <h2 className="price-title">₹ {property.priceDisplay}</h2>
                <div className="price-actions">
                  <button className="action-circle-btn" onClick={handleShare} title="Share Link">
                    <FaShareAlt />
                  </button>
                  <button 
                    className={`action-circle-btn wishlist-circle-btn ${isWishlisted(property.id) ? 'active' : ''}`} 
                    onClick={() => toggleWishlist(property.id)}
                    title={isWishlisted(property.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    {isWishlisted(property.id) ? <FaHeart className="filled" /> : <FaRegHeart />}
                  </button>
                </div>
              </div>
              <h4 className="price-specs-subtitle">
                {property.specs ? property.specs.Type || property.areaSqFt : `${isPlot ? 'Plot / Land' : '3 BHK - 2 Bathroom'} - ${superArea} sqft`}
              </h4>
              <p className="price-title-sub">{property.title}</p>
              
              <div className="price-box-footer">
                <span className="price-loc"><FaMapMarkerAlt /> {property.area}, {property.city}</span>
                <span className="price-date">Posted: {property.createdDate}</span>
              </div>

              <button 
                className="btn btn-gold w-100 mt-4" 
                style={{ width: '100%', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => onBuyProperty?.(property.id)}
              >
                <FaShoppingCart /> Buy Now
              </button>
            </div>

            {/* Seller Contact Card */}
            {dealer && (
              <div className="prop-right-box prop-seller-card">
                <div 
                  className="seller-card-header" 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => setShowSellerPortfolio(true)}
                  title="View Seller Portfolio"
                >
                  <img src={dealer.photo || dealer.logo} alt={dealer.companyName} className="seller-card-avatar" />
                  <div className="seller-card-meta">
                    <span className="posted-label">Posted By</span>
                    <h4 className="seller-name">{dealer.companyName}</h4>
                    <span className="seller-since">Member since Apr 2025</span>
                  </div>
                </div>
                
                <div className="seller-card-stats">
                  <div className="stat-box">
                    <span className="stat-num">{dealer.inventoryCount}</span>
                    <span className="stat-lbl">Items listed</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-num">⭐ {dealer.rating}</span>
                    <span className="stat-lbl">Rating</span>
                  </div>
                </div>

                <form onSubmit={handleSendMessage} className="seller-message-form">
                  <textarea 
                    className="inquiry-textarea" 
                    placeholder="Chat with seller..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: '100%', height: '80px', padding: '0.75rem', borderRadius: '6px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', resize: 'none', fontSize: '0.95rem' }}
                  />
                  <button type="submit" className="chat-seller-btn w-100 mt-2">
                    Chat with seller
                  </button>
                </form>

                <div className="seller-phone-reveal">
                  <FaPhone />
                  {showPhone ? (
                    <span className="phone-number" style={{ color: 'var(--gold)', fontWeight: 'bold' }}>+91 99890 87654</span>
                  ) : (
                    <>
                      <span className="phone-placeholder">** *** ****</span>
                      <button className="show-number-btn" onClick={() => setShowPhone(true)}>Show number</button>
                    </>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem', textAlign: 'center' }}>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                    📸 View Instagram Profile
                  </a>
                </div>
              </div>
            )}

            {/* Posted In Section */}
            <div className="prop-right-box prop-posted-in">
              <h4 className="posted-in-title">Posted in</h4>
              <p className="posted-in-text"><FaMapMarkerAlt /> {property.area}, {property.city}, {property.state}</p>
            </div>

            {/* Map Card */}
            <div className="prop-right-box prop-map-card" style={{ padding: '1rem' }}>
              <div className="map-embed-wrapper" style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden', background: '#e0dfdb' }}>
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400" 
                  alt="Map Location" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
                />
                {/* Visual marker overlay */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', zIndex: 2 }}>
                  <FaMapMarkerAlt style={{ color: '#ef4444', fontSize: '2.5rem', filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))' }} />
                </div>
                {/* Address block overlay */}
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', background: 'rgba(255, 255, 255, 0.95)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', color: '#1a1a1a', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                  <strong>Google Maps</strong>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>{property.area}, {property.city}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Other listings by the same seller */}
        {otherProperties.length > 0 && (
          <div className="prop-other-listings-section" style={{ marginTop: '4rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
            <h3 className="section-block-title" style={{ marginBottom: '2rem' }}>Other Properties by this Seller</h3>
            <div className="other-listings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {otherProperties.map(invProp => (
                <div 
                  key={invProp.id} 
                  className="feed-card premium-card landscape-card" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    onPropertyClick(invProp.id);
                    setActiveImageIndex(0);
                    setShowPhone(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="feed-card-image-wrap" style={{ height: '200px' }}>
                    <img src={invProp.image} alt={invProp.title} className="feed-card-img" />
                    <div className="feed-card-badges">
                      {invProp.premium && <span className="badge-premium">💎 Premium</span>}
                      {invProp.verified && <span className="badge-verified">✔ Verified</span>}
                    </div>
                  </div>
                  <div className="feed-card-body" style={{ padding: '1.25rem' }}>
                    <div className="feed-card-price-title">
                      <h3 className="feed-prop-price" style={{ fontSize: '1.2rem' }}>₹ {invProp.priceDisplay}</h3>
                      <h4 className="feed-prop-title" style={{ fontSize: '1rem', marginTop: '0.25rem' }}>{invProp.title}</h4>
                    </div>
                    <div className="feed-card-specs" style={{ margin: '0.75rem 0', fontSize: '0.85rem' }}>
                      <span>🛏 {invProp.category === 'Apartment' ? '3 BHK' : 'House'}</span>
                      <span>📐 {invProp.areaSqFt} Sq.Ft.</span>
                    </div>
                    <div className="feed-card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                      <span className="feed-prop-location" style={{ fontSize: '0.85rem' }}><FaMapMarkerAlt /> {invProp.area}, {invProp.city}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {showSellerPortfolio && dealer && (
        <div className="fullscreen-portfolio-overlay" data-lenis-prevent="true">
          <div className="container portfolio-container">
            <button 
              className="btn btn-back portfolio-back-btn" 
              onClick={() => setShowSellerPortfolio(false)}
            >
              <FaArrowLeft /> Back to Details
            </button>

            <div className="portfolio-header">
              <img 
                src={dealer.photo || dealer.logo} 
                alt={dealer.companyName} 
                className="portfolio-seller-img" 
              />
              <div className="portfolio-header-text">
                <span className="section-tag">Exclusive Portfolio</span>
                <h1 className="portfolio-title">{dealer.companyName}</h1>
                <div className="portfolio-meta">
                  <span className="meta-item">⭐ {dealer.rating} ({dealer.reviewCount} Reviews)</span>
                  <span className="meta-item">💼 {dealer.yearsExperience} Years Exp</span>
                  <span className="meta-item">🏢 {dealer.inventoryCount} Active Properties</span>
                </div>
              </div>
            </div>

            {/* Seller Profile & Contact Section */}
            <div className="portfolio-seller-details-card premium-card" style={{ marginBottom: '3rem', padding: '2.5rem' }}>
              <div className="seller-details-grid">
                <div className="seller-profile-column">
                  <img 
                    src={dealer.photo || dealer.logo} 
                    alt={dealer.companyName} 
                    className="seller-details-avatar" 
                  />
                  <h3 className="seller-details-name">{dealer.companyName}</h3>
                  <div className="seller-details-badges" style={{ marginTop: '0.5rem' }}>
                    {dealer.verified && <span className="badge-verified" style={{ marginRight: '8px' }}>✔ Verified Dealer</span>}
                    {dealer.premiumPartner && <span className="badge-premium">💎 Premium Partner</span>}
                  </div>
                  <div className="seller-details-rating" style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
                    ⭐ <strong>{dealer.rating}</strong> ({dealer.reviewCount} user reviews)
                  </div>
                </div>

                <div className="seller-info-column">
                  <h4 className="column-title">Contact & Agent Information</h4>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="info-label">👤 Authorized Name</span>
                      <span className="info-value">{dealer.companyName} Operations Group</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📞 Mobile Number</span>
                      <span className="info-value" style={{ color: 'var(--gold)', fontWeight: 'bold' }}>+91 99890 87654</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">✉ Email Address</span>
                      <span className="info-value">info@{dealer.companyName.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📍 Headquarters / City</span>
                      <span className="info-value">Jubilee Hills, Hyderabad, Telangana</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">⏱ Avg Response Time</span>
                      <span className="info-value">{dealer.responseTime}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">💼 Experience</span>
                      <span className="info-value">{dealer.yearsExperience} Years in Market</span>
                    </div>
                    {/* Instagram social link below everything in the contact info list */}
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
                      placeholder={`Write your inquiry message for ${dealer.companyName} here...`}
                      style={{ width: '100%', height: '100px', padding: '1rem', borderRadius: '6px', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'none' }}
                    />
                    <button 
                      className="btn btn-gold" 
                      style={{ marginTop: '1rem', width: '100%' }}
                      onClick={() => alert(`Your inquiry has been successfully sent to ${dealer.companyName}! They will get back to you shortly.`)}
                    >
                      Submit Inquiry
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="portfolio-grid">
              {propertiesDb.filter(p => p.dealerId === dealer.id).map(prop => (
                <div 
                  key={prop.id} 
                  className="feed-card premium-card landscape-card portfolio-card-item" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setShowSellerPortfolio(false);
                    onPropertyClick(prop.id);
                    setActiveImageIndex(0);
                    setShowPhone(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="feed-card-image-wrap">
                    <img 
                      src={prop.image} 
                      alt={prop.title} 
                      className="feed-card-img" 
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
                        setShowSellerPortfolio(false);
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
                      <h4 className="feed-prop-title">{prop.title}</h4>
                    </div>
                    <div className="feed-card-specs">
                      <span>📐 {prop.areaSqFt}</span>
                    </div>
                    <div className="feed-card-footer">
                      <span className="feed-prop-location"><FaMapMarkerAlt /> {prop.area}, {prop.city}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PropertyDetailsPage;
