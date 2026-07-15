import React, { useState } from 'react';
import { propertiesDb } from '../db/marketplaceDb';
import {
  FaBuilding,
  FaHome,
  FaMapMarkerAlt,
  FaStore,
  FaBriefcase,
  FaChartLine,
  FaIndustry,
  FaTractor,
  FaHeart,
  FaRegHeart,
  FaBed,
  FaRulerCombined,
  FaStar,
  FaCalculator,
  FaBalanceScale,
  FaRobot,
  FaShieldAlt,
  FaUserTie,
  FaMoneyCheckAlt,
  FaArrowRight,
  FaCheckCircle,
  FaFire,
  FaCrown,
} from 'react-icons/fa';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onPropertyClick?: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onPropertyClick }) => {
  const [selectedRadius, setSelectedRadius] = useState('5 KM');
  const [wishlisted, setWishlisted] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlisted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { title: 'Apartments', icon: FaBuilding, bg: '#DCFCE7', color: '#16A34A', page: 'flatsPage' },
    { title: 'Villas', icon: FaHome, bg: '#DBEAFE', color: '#2563EB', page: 'housesPage' },
    { title: 'Independent Houses', icon: FaHome, bg: '#E0E7FF', color: '#4F46E5', page: 'housesPage' },
    { title: 'Plots / Land', icon: FaMapMarkerAlt, bg: '#DCFCE7', color: '#16A34A', page: 'landPage' },
    { title: 'Commercial', icon: FaBuilding, bg: '#FFEDD5', color: '#EA580C', page: 'propertiesPage' },
    { title: 'Industrial', icon: FaIndustry, bg: '#F3E8FF', color: '#9333EA', page: 'propertiesPage' },
    { title: 'Farm Land', icon: FaTractor, bg: '#FCE7F3', color: '#DB2777', page: 'landPage' },
    { title: 'Franchises', icon: FaStore, bg: '#FFE4E6', color: '#E11D48', page: 'franchisePage' },
    { title: 'Businesses', icon: FaBriefcase, bg: '#E0F2FE', color: '#0284C7', page: 'businessPage' },
  ];

  const featuredProperties = propertiesDb.slice(0, 4).map((p) => ({
    id: p.id,
    title: p.title || `${p.bedrooms || 3} BHK ${p.category}`,
    price: p.priceDisplay || (`₹${p.price || 1} L`),
    badge: p.verified ? 'Verified' : (p.premium ? 'Premium' : 'New Launch'),
    badgeColor: p.verified ? '#DCFCE7' : (p.premium ? '#FEF08A' : '#E0E7FF'),
    badgeText: p.verified ? '#16A34A' : (p.premium ? '#854D0E' : '#4F46E5'),
    badgeIcon: p.verified ? FaCheckCircle : (p.premium ? FaCrown : FaStar),
    image: p.image || p.imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    location: `${p.area ? p.area + ', ' : ''}${p.city || ''}`,
    bhk: `${p.bedrooms || 3} BHK`,
    area: p.sqft ? `${p.sqft} Sq.ft` : (p.builtUpArea ? `${p.builtUpArea} Sq.ft` : '1500 Sq.ft'),
    dist: '1.2 KM Away',
    brokerName: p.agentName || 'RealtyPlus Advisors',
    brokerRating: p.agentRating ? `${p.agentRating} (${p.reviewCount || 10})` : '4.8 (24)',
    brokerImg: p.agentImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
  }));

  const quickTools = [
    { title: 'Home Loan', subtitle: 'Calculate EMI & Apply Now', icon: FaMoneyCheckAlt, bg: '#DCFCE7', color: '#16A34A', page: 'loansPage' },
    { title: 'EMI Calculator', subtitle: 'Know your EMI in seconds', icon: FaCalculator, bg: '#DBEAFE', color: '#2563EB', page: 'financePage' },
    { title: 'Compare Properties', subtitle: 'Compare up to 4 properties', icon: FaBalanceScale, bg: '#FFEDD5', color: '#EA580C', page: 'propertiesPage' },
    { title: 'AI Assistant', subtitle: 'Get best property recommendations', icon: FaRobot, bg: '#FCE7F3', color: '#DB2777', page: 'propertiesPage' },
    { title: 'Insurance', subtitle: 'Protect what matters most', icon: FaShieldAlt, bg: '#F3E8FF', color: '#9333EA', page: 'insurancePage' },
    { title: 'Top Brokers', subtitle: 'Connect with Trusted Brokers', icon: FaUserTie, bg: '#CCFBF1', color: '#0D9488', page: 'propertiesPage' },
  ];

  return (
    <section style={{ backgroundColor: '#F8FAFC', padding: '2rem 0 5rem 0', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1360px', width: '100%', margin: '0 auto', padding: '0 24px', boxSizing: 'border-box' }}>
        
        {/* Middle Section: Asymmetric 2-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '36px', marginBottom: '48px' }}>
          
          {/* LEFT SIDE: Categories + Featured Properties */}
          <div>
            
            {/* Explore by Category */}
            <div style={{ marginBottom: '44px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Explore by Category
                  <FaChartLine style={{ color: '#2563EB', fontSize: '1.2rem' }} />
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                {categories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => onNavigate(cat.page)}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        padding: '18px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = cat.color;
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                      }}
                    >
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          backgroundColor: cat.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '10px',
                        }}
                      >
                        <Icon style={{ color: cat.color, fontSize: '22px' }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                        {cat.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Featured Properties */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Featured Properties
                </h2>
                <button
                  onClick={() => onNavigate('propertiesPage')}
                  style={{ background: 'none', border: 'none', color: '#16A34A', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>View All</span>
                  <FaArrowRight style={{ fontSize: '12px' }} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
                {featuredProperties.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', backgroundColor: '#FFFFFF', padding: '40px 20px', borderRadius: '20px', border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🏠</div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>No Featured Properties Yet</h4>
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>Properties added to the database will appear here.</p>
                  </div>
                ) : (
                  featuredProperties.map((prop) => {
                  const BadgeIcon = prop.badgeIcon;
                  const isFav = !!wishlisted[prop.id];
                  return (
                    <div
                      key={prop.id}
                      onClick={() => {
                        if (onPropertyClick) onPropertyClick(prop.id);
                        else onNavigate('propertiesPage');
                      }}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        border: '1px solid #E2E8F0',
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
                      }}
                    >
                      {/* Image Banner */}
                      <div style={{ position: 'relative', height: '160px', backgroundColor: '#0F172A' }}>
                        <img src={prop.image} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        
                        {/* Badge */}
                        <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: prop.badgeColor, color: prop.badgeText, padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <BadgeIcon />
                          <span>{prop.badge}</span>
                        </div>

                        {/* Wishlist Heart */}
                        <button
                          onClick={(e) => toggleWishlist(prop.id, e)}
                          style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          {isFav ? <FaHeart style={{ color: '#EF4444', fontSize: '14px' }} /> : <FaRegHeart style={{ color: '#FFFFFF', fontSize: '14px' }} />}
                        </button>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{prop.title}</h3>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#16A34A' }}>{prop.price}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B', marginBottom: '12px', fontWeight: 500 }}>
                            <FaMapMarkerAlt style={{ color: '#16A34A' }} />
                            <span>{prop.location}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: 600, color: '#475569', backgroundColor: '#F8FAFC', padding: '8px 10px', borderRadius: '10px', marginBottom: '12px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaBed style={{ color: '#3B82F6' }} /> {prop.bhk}</span>
                            {prop.area && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaRulerCombined style={{ color: '#3B82F6' }} /> {prop.area}</span>}
                            <span style={{ color: '#16A34A', marginLeft: 'auto' }}>{prop.dist}</span>
                          </div>
                        </div>

                        {/* Broker Footer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={prop.brokerImg} alt={prop.brokerName} style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} />
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>{prop.brokerName}</span>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FaStar /> {prop.brokerRating}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Map Card + Quick Tools & Services Grid */}
          <div>
            
            {/* Find Properties Near You (Interactive Map Card) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                padding: '22px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Find Properties Near You
                </h3>
                <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} /> Live
                </span>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch', marginBottom: '16px' }}>
                {/* Simulated Map Graphic */}
                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#E2E8F0',
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '220px',
                    backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
                    backgroundSize: '16px 16px',
                  }}
                >
                  {/* Map Roads & Rivers Simulation */}
                  <div style={{ position: 'absolute', top: '30%', left: 0, right: 0, height: '18px', backgroundColor: '#FFFFFF', opacity: 0.6, transform: 'rotate(-12deg)' }} />
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: '45%', width: '14px', backgroundColor: '#FFFFFF', opacity: 0.6, transform: 'rotate(25deg)' }} />
                  <div style={{ position: 'absolute', top: '60%', left: 0, right: 0, height: '24px', backgroundColor: '#BAE6FD', opacity: 0.5, transform: 'rotate(8deg)' }} />

                  {/* Map Pins */}
                  <div style={{ position: 'absolute', top: '25%', left: '35%', backgroundColor: '#16A34A', color: '#FFF', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, boxShadow: '0 4px 10px rgba(22,163,74,0.4)', border: '2px solid #FFF' }}>23</div>
                  <div style={{ position: 'absolute', top: '55%', left: '20%', backgroundColor: '#2563EB', color: '#FFF', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, boxShadow: '0 4px 10px rgba(37,99,235,0.4)', border: '2px solid #FFF' }}>12</div>
                  <div style={{ position: 'absolute', top: '40%', right: '25%', backgroundColor: '#16A34A', color: '#FFF', width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, boxShadow: '0 4px 10px rgba(22,163,74,0.4)', border: '2px solid #FFF' }}>7</div>
                  <div style={{ position: 'absolute', top: '70%', right: '35%', backgroundColor: '#38BDF8', color: '#FFF', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, boxShadow: '0 4px 10px rgba(56,189,248,0.4)', border: '2px solid #FFF' }}>3</div>
                  <div style={{ position: 'absolute', top: '20%', right: '15%', backgroundColor: '#EF4444', color: '#FFF', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, boxShadow: '0 4px 10px rgba(239,68,68,0.4)', border: '2px solid #FFF' }}>1</div>

                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, color: '#334155' }}>
                    📍 Hyderabad / Guntur
                  </div>
                </div>

                {/* Search Radius Options */}
                <div style={{ width: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>Search Radius</div>
                  {['1 KM', '3 KM', '5 KM', '10 KM', '20 KM', '50 KM'].map((rad) => {
                    const isSel = selectedRadius === rad;
                    return (
                      <label
                        key={rad}
                        onClick={() => setSelectedRadius(rad)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: isSel ? 700 : 500, color: isSel ? '#16A34A' : '#475569', cursor: 'pointer', padding: '4px 0' }}
                      >
                        <input
                          type="radio"
                          name="radius"
                          checked={isSel}
                          onChange={() => setSelectedRadius(rad)}
                          style={{ accentColor: '#16A34A', cursor: 'pointer' }}
                        />
                        <span>{rad}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => onNavigate('propertiesPage')}
                style={{
                  width: '100%',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#15803D')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#16A34A')}
              >
                View on Map
              </button>
            </div>

            {/* Quick Tools & Services Grid (2x3 Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {quickTools.map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => onNavigate(tool.page)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '18px',
                      border: '1px solid #E2E8F0',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = tool.color;
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: tool.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <Icon style={{ color: tool.color, fontSize: '20px' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>{tool.title}</div>
                      <div style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.4, fontWeight: 500 }}>{tool.subtitle}</div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Bottom Section: 3 Horizontal Columns (Franchise, Insights, Testimonial) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', borderTop: '1px solid #E2E8F0', paddingTop: '40px' }}>
          
          {/* Column 1: Top Franchise Opportunities */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Top Franchise Opportunities</h3>
              <button onClick={() => onNavigate('franchisePage')} style={{ background: 'none', border: 'none', color: '#16A34A', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>View All</span> <FaArrowRight style={{ fontSize: '10px' }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {[
                { name: 'SUBWAY', color: '#15803D', bg: '#DCFCE7' },
                { name: 'KFC', color: '#DC2626', bg: '#FEE2E2' },
                { name: 'Café Coffee Day', color: '#B91C1C', bg: '#FFE4E6' },
                { name: "Domino's", color: '#1D4ED8', bg: '#DBEAFE' },
                { name: 'Apollo Pharmacy', color: '#0D9488', bg: '#CCFBF1' },
              ].map((brand, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate('franchisePage')}
                  style={{ padding: '12px 18px', borderRadius: '14px', backgroundColor: brand.bg, color: brand.color, fontWeight: 800, fontSize: '13px', cursor: 'pointer', border: '1px solid transparent', transition: 'all 0.2s', flexGrow: 1, textAlign: 'center' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {brand.name}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Investment Insights */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Investment Insights</h3>
              <button onClick={() => onNavigate('propertiesPage')} style={{ background: 'none', border: 'none', color: '#16A34A', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>View All</span> <FaArrowRight style={{ fontSize: '10px' }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { title: 'Hyderabad Property Prices', val: '+12.4%', icon: FaBuilding, color: '#16A34A' },
                { title: 'Guntur Best ROI City', val: '+18.7%', icon: FaChartLine, color: '#16A34A' },
                { title: 'Villas High Demand', val: '+23.1%', icon: FaHome, color: '#16A34A' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
                        <Icon style={{ fontSize: '14px' }} />
                      </div>
                      <span>{item.title}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: item.color }}>{item.val}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: What Our Clients Say */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>What Our Clients Say</h3>
              <button onClick={() => alert('Viewing All Reviews...')} style={{ background: 'none', border: 'none', color: '#16A34A', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>View All</span> <FaArrowRight style={{ fontSize: '10px' }} />
              </button>
            </div>

            <div style={{ padding: '16px', borderRadius: '16px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', marginBottom: '10px', fontSize: '14px' }}>
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, margin: '0 0 16px 0', fontStyle: 'italic', fontWeight: 500 }}>
                "Found my dream villa through TheNexOop. Amazing experience and verified listings made everything seamless!"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Client" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Rajesh Kumar</div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Investor, Guntur AP</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HomePage;
