import React, { useState, useMemo, useEffect } from 'react';
import { propertiesDb, dealersDb, franchiseDb, businessDb } from '../db/marketplaceDb';
import { 
  FaArrowLeft, FaHeart, FaRegHeart, FaShareAlt, 
  FaMapMarkerAlt, FaShoppingCart, FaPhone, 
  FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';

const getNearbyAmenities = (category: string, area: string, city: string) => {
  const baseDist = Math.floor(Math.random() * 8) / 10 + 0.4;
  switch (category) {
    case 'schools':
      return [
        { name: `Oakridge International School (${area})`, type: 'CBSE & IB World School', dist: (baseDist).toFixed(1), time: '3 mins drive' },
        { name: `Chirec Public School`, type: 'International Campus', dist: (baseDist + 1.1).toFixed(1), time: '6 mins drive' },
        { name: `Delhi Public School (${city})`, type: 'Senior Secondary CBSE', dist: (baseDist + 1.8).toFixed(1), time: '10 mins drive' },
        { name: `Kendriya Vidyalaya`, type: 'Central Government School', dist: (baseDist + 2.5).toFixed(1), time: '14 mins drive' }
      ];
    case 'hospitals':
      return [
        { name: `Apollo Hospitals Multispecialty`, type: '24/7 Emergency & ICU', dist: (baseDist + 0.5).toFixed(1), time: '4 mins drive' },
        { name: `Care Hospitals & Trauma Centre`, type: 'Super Specialty Hospital', dist: (baseDist + 1.4).toFixed(1), time: '8 mins drive' },
        { name: `Rainbow Children's Hospital`, type: 'Pediatric & Maternity Care', dist: (baseDist + 2.1).toFixed(1), time: '11 mins drive' },
        { name: `Vijaya Diagnostic Centre`, type: 'Radiology & Pathology Lab', dist: (baseDist + 0.3).toFixed(1), time: '2 mins walk' }
      ];
    case 'transit':
      return [
        { name: `${area} Metro Station`, type: 'Blue / Red Line Corridor', dist: (baseDist - 0.1 > 0 ? baseDist - 0.1 : 0.4).toFixed(1), time: '5 mins walk' },
        { name: `Main Bus Stop (${area})`, type: 'City & Intercity Transit', dist: '0.3', time: '3 mins walk' },
        { name: `${city} Central Railway Station`, type: 'Major Railway Junction', dist: (baseDist + 5.2).toFixed(1), time: '20 mins drive' },
        { name: `International Airport Express`, type: 'Direct Highway Access', dist: (baseDist + 22.0).toFixed(1), time: '35 mins drive' }
      ];
    case 'shopping':
      return [
        { name: `Inorbit Mall & Multiplex`, type: 'Premium Shopping Mall', dist: (baseDist + 0.8).toFixed(1), time: '5 mins drive' },
        { name: `Ratnadeep Supermarket`, type: 'Grocery & Daily Needs', dist: '0.4', time: '4 mins walk' },
        { name: `Starbucks Coffee & Lounge`, type: 'Cafe & Workspace', dist: '0.6', time: '6 mins walk' },
        { name: `Barbeque Nation & Fine Dining`, type: 'Multi-cuisine Restaurant', dist: (baseDist + 1.2).toFixed(1), time: '7 mins drive' }
      ];
    case 'banks':
      return [
        { name: `HDFC Bank & ATM Branch`, type: 'Banking & Wealth Management', dist: '0.3', time: '3 mins walk' },
        { name: `ICICI Bank 24/7 ATM`, type: 'Automated Teller Machine', dist: '0.5', time: '5 mins walk' },
        { name: `State Bank of India (SBI)`, type: 'Regional Branch Office', dist: (baseDist + 0.7).toFixed(1), time: '4 mins drive' },
        { name: `Axis Bank Priority Lounge`, type: 'Forex & Locker Facility', dist: (baseDist + 1.1).toFixed(1), time: '6 mins drive' }
      ];
    case 'fuel':
    default:
      return [
        { name: `Indian Oil 24/7 Petrol Pump`, type: 'Fuel & EV Charging Station', dist: (baseDist + 0.4).toFixed(1), time: '3 mins drive' },
        { name: `HP Petrol & Speed Mart`, type: 'Premium Fuel & Nitrogen', dist: (baseDist + 1.3).toFixed(1), time: '6 mins drive' },
        { name: `Bharat Petroleum (BPCL)`, type: 'Highway Fuel Station', dist: (baseDist + 2.4).toFixed(1), time: '10 mins drive' },
        { name: `Tata Power EV Fast Charging`, type: '60kW DC Fast Charger', dist: (baseDist + 0.9).toFixed(1), time: '5 mins drive' }
      ];
  }
};

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
  const [nearbyRadiusFilter, setNearbyRadiusFilter] = useState<number>(5); // Default 5 km
  const [activeAmenityTab, setActiveAmenityTab] = useState<string>('schools');

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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const nearbyPropertiesWithDistance = useMemo(() => {
    if (!property) return [];
    const propLat = property.latitude || 17.4326;
    const propLng = property.longitude || 78.4071;
    return propertiesDb
      .filter(p => p.id !== property.id)
      .map(p => {
        const dist = calculateDistance(propLat, propLng, p.latitude || 17.4326, p.longitude || 78.4071);
        return { ...p, distanceKm: dist };
      })
      .filter(p => p.distanceKm <= nearbyRadiusFilter)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [property, nearbyRadiusFilter]);

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

  // EMI Calculator State
  const [loanAmountLakhs, setLoanAmountLakhs] = useState<number>(150);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);

  useEffect(() => {
    if (property.price) {
      setLoanAmountLakhs(Math.round(property.price * 100 * 0.8));
    }
  }, [property]);

  const calculatedEmi = useMemo(() => {
    const P = loanAmountLakhs * 100000;
    const r = interestRate / (12 * 100);
    const n = loanTenureYears * 12;
    if (r === 0) return Math.round(P / n);
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  }, [loanAmountLakhs, interestRate, loanTenureYears]);

  // Derive specs fields
  const superArea = property.areaSqFt;
  const isPlot = property.category === 'Plot';
  const carpetArea = isPlot ? 'N/A' : `${Math.round(parseInt(superArea) * 0.85)} sqft`;
  const typeDisplay = isPlot ? 'Plots & Land' : (property.category === 'Villa' || property.category === 'House') ? 'House & Villa' : 'Flats & Apartments';

  return (
    <div className="prop-details-page animation-fade-in" style={{ padding: '115px 0 3rem', background: 'var(--bg-main)', minHeight: '100vh' }}>
      <div className="container" style={{ position: 'relative' }}>
        
        {/* Back navigation */}
        <button className="circle-back-btn" onClick={onBack} title="Go Back" style={{ marginBottom: '1.5rem' }}>
          <FaArrowLeft />
        </button>

        {/* Location Hierarchy Breadcrumbs */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '12px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.85rem', fontWeight: 600, color: '#475569', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <span style={{ color: '#1E40AF', display: 'flex', alignItems: 'center', gap: '4px' }}><FaMapMarkerAlt /> India</span>
          <span>→</span>
          <span>{property.state || 'Telangana'}</span>
          <span>→</span>
          <span>{property.district || 'Hyderabad'}</span>
          <span>→</span>
          <span style={{ color: '#0F172A', fontWeight: 700 }}>{property.city}</span>
          <span>→</span>
          <span style={{ color: '#2563EB', fontWeight: 700 }}>{property.area}</span>
          {property.postal_code && (
            <>
              <span>→</span>
              <span style={{ backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', color: '#64748B' }}>PIN: {property.postal_code}</span>
            </>
          )}
        </div>

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
                        <span className="spec-val">{property.propertySubtype || typeDisplay}</span>
                      </div>
                      <div className="spec-col">
                        <span className="spec-lbl">Bedrooms</span>
                        <span className="spec-val">{isPlot ? 'N/A' : (property.bedrooms ?? 3)}</span>
                      </div>
                    </div>

                    <div className="prop-spec-row">
                      <div className="spec-col">
                        <span className="spec-lbl">Super Built-up area</span>
                        <span className="spec-val">{property.superBuiltUpArea || superArea}</span>
                      </div>
                      <div className="spec-col">
                        <span className="spec-lbl">Bathrooms</span>
                        <span className="spec-val">{isPlot ? 'N/A' : (property.bathrooms ?? 2)}</span>
                      </div>
                    </div>

                    <div className="prop-spec-row">
                      <div className="spec-col">
                        <span className="spec-lbl">Project Status</span>
                        <span className="spec-val">{property.listingStatus || 'Ready to Move'}</span>
                      </div>
                      <div className="spec-col">
                        <span className="spec-lbl">Ownership Type</span>
                        <span className="spec-val">{property.ownershipType || 'Freehold'}</span>
                      </div>
                    </div>

                    <div className="prop-spec-row">
                      <div className="spec-col">
                        <span className="spec-lbl">Facing Direction</span>
                        <span className="spec-val">{property.facing || 'North-East'}</span>
                      </div>
                      <div className="spec-col">
                        <span className="spec-lbl">Carpet area</span>
                        <span className="spec-val">{property.carpetArea || carpetArea}</span>
                      </div>
                    </div>

                    <div className="prop-spec-row">
                      <div className="spec-col">
                        <span className="spec-lbl">Parking Slots</span>
                        <span className="spec-val">{isPlot ? 'None' : (property.parkingSlots ?? 2)}</span>
                      </div>
                      <div className="spec-col">
                        <span className="spec-lbl">Furnishing</span>
                        <span className="spec-val">{property.furnishing || 'Semi-Furnished'}</span>
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

            {/* Amenities Section */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="prop-section-block" style={{ marginTop: '2rem' }}>
                <h3 className="section-block-title">Amenities & Facilities</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1rem' }}>
                  {property.amenities.map((am: string, i: number) => (
                    <span key={i} style={{ padding: '8px 16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      ✓ {am}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Virtual Tour Section */}
            {property.virtualTourUrl && (
              <div className="prop-section-block" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px' }}>
                <h3 className="section-block-title" style={{ color: '#1E40AF' }}>🎥 360° Virtual Walkthrough & Tour</h3>
                <p style={{ fontSize: '0.9rem', color: '#334155', margin: '0.5rem 0 1rem 0' }}>Experience a full digital interactive walkthrough of this property from anywhere.</p>
                <a href={property.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ backgroundColor: '#1E40AF', color: '#FFF', padding: '10px 24px', borderRadius: '4px', textDecoration: 'none', fontWeight: 700, display: 'inline-block' }}>
                  Launch 360° Virtual Walkthrough →
                </a>
              </div>
            )}

            {/* Interactive Location Intelligence & Nearby Places Amenity Discovery Section */}
            <div className="prop-section-block" style={{ marginTop: '2.5rem', backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 className="section-block-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A' }}>
                    🗺️ Google Maps Location & Nearby Amenities
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    {property.formatted_address || `${property.area}, ${property.city}, ${property.state}`}
                  </span>
                </div>
                {property.google_place_id && (
                  <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #BFDBFE', fontFamily: 'monospace' }}>
                    Place ID: {property.google_place_id}
                  </span>
                )}
              </div>

              {/* Interactive Map Grid Container */}
              <div style={{ width: '100%', height: '340px', backgroundColor: '#0F172A', borderRadius: '16px', position: 'relative', overflow: 'hidden', border: '2px solid #334155', marginBottom: '24px', backgroundImage: 'radial-gradient(#475569 1.5px, transparent 1.5px)', backgroundSize: '30px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2), transparent 70%)' }} />
                
                {/* Property Pin */}
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ backgroundColor: '#EF4444', color: '#FFFFFF', padding: '8px 16px', borderRadius: '24px', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.5)', border: '3px solid #FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaMapMarkerAlt /> {property.title}
                  </div>
                  <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '10px solid #EF4444' }} />
                  <div style={{ width: '24px', height: '12px', background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 80%)', marginTop: '2px' }} />
                </div>

                {/* Simulated Surrounding Roads & Landmarks */}
                <div style={{ position: 'absolute', top: '20%', left: '15%', backgroundColor: 'rgba(30, 41, 59, 0.8)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', color: '#94A3B8', border: '1px solid #475569' }}>🎓 Oakridge School (1.2 km)</div>
                <div style={{ position: 'absolute', bottom: '25%', right: '15%', backgroundColor: 'rgba(30, 41, 59, 0.8)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', color: '#94A3B8', border: '1px solid #475569' }}>🏥 Apollo Hospital (2.4 km)</div>
                <div style={{ position: 'absolute', top: '30%', right: '25%', backgroundColor: 'rgba(30, 41, 59, 0.8)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', color: '#94A3B8', border: '1px solid #475569' }}>🚆 Metro Station (0.8 km)</div>
                <div style={{ position: 'absolute', bottom: '20%', left: '25%', backgroundColor: 'rgba(30, 41, 59, 0.8)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', color: '#94A3B8', border: '1px solid #475569' }}>🛍️ Inorbit Mall (3.1 km)</div>

                {/* Map Bottom Bar */}
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 20 }}>
                  <span style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #334155' }}>
                    GPS: {(property.latitude || 17.4326).toFixed(4)}° N, {(property.longitude || 78.4071).toFixed(4)}° E
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(property.formatted_address || (property.area + ', ' + property.city))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: '#2563EB', color: '#FFFFFF', padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)' }}
                  >
                    📍 Get Google Maps Navigation →
                  </a>
                </div>
              </div>

              {/* Nearby Places Amenity Discovery Tabs */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', color: '#0F172A', fontWeight: 800 }}>
                  Explore What's Nearby (Calculated via Haversine Distance)
                </h4>
                
                {/* Amenity Tabs */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
                  {[
                    { id: 'schools', label: '🎓 Schools & Colleges' },
                    { id: 'hospitals', label: '🏥 Hospitals & Clinics' },
                    { id: 'transit', label: '🚆 Metro & Transit' },
                    { id: 'shopping', label: '🛍️ Shopping & Dining' },
                    { id: 'banks', label: '🏦 Banks & ATMs' },
                    { id: 'fuel', label: '⛽ Petrol Pumps' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveAmenityTab(tab.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        border: activeAmenityTab === tab.id ? '2px solid #1E40AF' : '1px solid #E2E8F0',
                        backgroundColor: activeAmenityTab === tab.id ? '#EFF6FF' : '#F8FAFC',
                        color: activeAmenityTab === tab.id ? '#1D4ED8' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Amenity List Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                  {getNearbyAmenities(activeAmenityTab, property.area, property.city).map((item: any, idx: number) => (
                    <div key={idx} style={{ padding: '12px 16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A', marginBottom: '2px' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.type} • {item.time}</div>
                      </div>
                      <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #BBF7D0', whiteSpace: 'nowrap' }}>
                        📍 {item.dist} km
                      </span>
                    </div>
                  ))}
                </div>
              </div>
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
                    {dealer.fullName && <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '2px' }}>{dealer.fullName}</div>}
                    <span className="seller-since">{dealer.premiumPartner ? '👑 Premium Partner' : '✔ Verified Partner'}</span>
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
            <div className="prop-right-box prop-map-card" style={{ padding: '1rem', backgroundColor: '#0F172A', color: '#FFFFFF', border: '1px solid #334155', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaMapMarkerAlt /> Google Location
                </span>
                {property.postal_code && (
                  <span style={{ backgroundColor: '#1E293B', color: '#94A3B8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                    PIN: {property.postal_code}
                  </span>
                )}
              </div>
              <div className="map-embed-wrapper" style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#1E293B', backgroundImage: 'radial-gradient(#475569 1.5px, transparent 1.5px)', backgroundSize: '20px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid #475569' }}>
                <div style={{ backgroundColor: '#EF4444', color: '#FFFFFF', padding: '6px 12px', borderRadius: '20px', fontWeight: 800, fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.5)', zIndex: 2, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaMapMarkerAlt /> {property.area}
                </div>
                <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid #EF4444', zIndex: 2 }} />
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', background: 'rgba(15, 23, 42, 0.9)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', color: '#E2E8F0', border: '1px solid #334155' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {property.formatted_address || `${property.area}, ${property.city}`}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>
                    Lat: {(property.latitude || 17.4326).toFixed(4)}, Lng: {(property.longitude || 78.4071).toFixed(4)}
                  </div>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(property.formatted_address || (property.area + ', ' + property.city))}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', marginTop: '12px', padding: '10px', backgroundColor: '#2563EB', color: '#FFFFFF', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', transition: 'background 0.2s' }}
              >
                📍 Open in Google Maps App →
              </a>
            </div>

            {/* Interactive Mortgage & EMI Calculator */}
            <div className="prop-right-box" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🧮 Interactive Mortgage Calculator
              </h4>
              <div style={{ padding: '12px', backgroundColor: '#EFF6FF', borderRadius: '8px', marginBottom: '16px', textAlign: 'center', border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: '0.8rem', color: '#1E40AF', fontWeight: 600 }}>ESTIMATED MONTHLY EMI</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E3A8A' }}>₹{calculatedEmi.toLocaleString('en-IN')} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>/ month</span></div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-main)', fontWeight: 600 }}>
                    <span>Loan Amount</span>
                    <span>₹{loanAmountLakhs} Lakhs</span>
                  </div>
                  <input type="range" min="10" max="1000" step="5" value={loanAmountLakhs} onChange={e => setLoanAmountLakhs(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-main)', fontWeight: 600 }}>
                    <span>Interest Rate (p.a)</span>
                    <span>{interestRate}%</span>
                  </div>
                  <input type="range" min="5" max="15" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--text-main)', fontWeight: 600 }}>
                    <span>Loan Tenure</span>
                    <span>{loanTenureYears} Years</span>
                  </div>
                  <input type="range" min="5" max="30" step="1" value={loanTenureYears} onChange={e => setLoanTenureYears(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Automated Properties Nearby (Within 2 KM, 5 KM, 10 KM) */}
        <div className="prop-other-listings-section" style={{ marginTop: '4rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '2rem' }}>
            <div>
              <h3 className="section-block-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                📍 Properties Nearby (Spatial Haversine Calculation)
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Showing properties within {nearbyRadiusFilter} KM of {property.area}, {property.city}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[2, 5, 10, 25].map(rad => (
                <button
                  key={rad}
                  onClick={() => setNearbyRadiusFilter(rad)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: nearbyRadiusFilter === rad ? '2px solid #1E40AF' : '1px solid #CBD5E1',
                    backgroundColor: nearbyRadiusFilter === rad ? '#1E40AF' : '#FFFFFF',
                    color: nearbyRadiusFilter === rad ? '#FFFFFF' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Within {rad} KM
                </button>
              ))}
            </div>
          </div>

          {nearbyPropertiesWithDistance.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
              <FaMapMarkerAlt style={{ fontSize: '2rem', color: '#94A3B8', marginBottom: '10px' }} />
              <h4 style={{ margin: '0 0 6px 0', color: '#334155' }}>No properties found within {nearbyRadiusFilter} KM</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>Try expanding your distance filter to 10 KM or 25 KM to see more listings.</p>
            </div>
          ) : (
            <div className="other-listings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {nearbyPropertiesWithDistance.map(invProp => (
                <div 
                  key={invProp.id} 
                  className="feed-card premium-card landscape-card" 
                  style={{ cursor: 'pointer', flexDirection: 'column' }}
                  onClick={() => {
                    onPropertyClick(invProp.id);
                    setActiveImageIndex(0);
                    setShowPhone(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="feed-card-image-wrap" style={{ width: '100%', height: '200px' }}>
                    <img src={invProp.image} alt={invProp.title} className="feed-card-img" />
                    <div className="feed-card-badges">
                      {invProp.premium && <span className="badge-premium">💎 Premium</span>}
                      <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid #BFDBFE' }}>
                        📍 {invProp.distanceKm.toFixed(1)} KM Away
                      </span>
                    </div>
                  </div>
                  <div className="feed-card-body" style={{ width: '100%', padding: '1.25rem' }}>
                    <div className="feed-card-price-title">
                      <h3 className="feed-prop-price" style={{ fontSize: '1.2rem' }}>₹ {invProp.priceDisplay}</h3>
                      <h4 className="feed-prop-title" style={{ fontSize: '1rem', marginTop: '0.25rem' }}>{invProp.title}</h4>
                    </div>
                    <div className="feed-card-specs" style={{ margin: '0.75rem 0', fontSize: '0.85rem' }}>
                      <span>🛏 {invProp.category === 'Apartment' ? '3 BHK' : 'House'}</span>
                      <span>📐 {invProp.areaSqFt} Sq.Ft.</span>
                    </div>
                    <div className="feed-card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="feed-prop-location" style={{ fontSize: '0.85rem' }}><FaMapMarkerAlt /> {invProp.area}, {invProp.city}</span>
                      <span style={{ fontSize: '0.75rem', color: '#1E40AF', fontWeight: 700 }}>View Property →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                      <span className="info-value">{dealer.fullName || `${dealer.companyName} Operations Group`}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📞 Mobile Number</span>
                      <span className="info-value" style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{dealer.phone || dealer.mobileNumber || '+91 99890 87654'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">✉ Email Address</span>
                      <span className="info-value">{dealer.email || `info@${dealer.companyName.toLowerCase().replace(/\s+/g, '')}.com`}</span>
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
                          @thenexoop
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
