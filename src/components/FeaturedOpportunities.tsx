import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaClock, FaArrowRight } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { propertiesDb, franchiseDb, selectedCity } from '../db/marketplaceDb';

interface FeaturedItem {
  id: string;
  title: string;
  location: string;
  price: string;
  priceLabel?: string;
  details: string;
  image: string;
  category: 'PROPERTY' | 'FRANCHISE';
  timeAgo: string;
}

interface FeaturedOpportunitiesProps {
  onPropertyClick?: (id: string) => void;
  onBuyProperty?: (id: string) => void;
  onViewAll?: () => void;
}

const categoryColors: Record<string, string> = {
  PROPERTY: '#16A34A',
  FRANCHISE: '#EA580C',
};

export const FeaturedOpportunities: React.FC<FeaturedOpportunitiesProps> = ({ onPropertyClick, onBuyProperty: _onBuyProperty, onViewAll }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [_activeTab, _setActiveTab] = useState<'ALL' | 'PROPERTY' | 'FRANCHISE'>('ALL');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick(t => t + 1);
    window.addEventListener('nexopp_data_changed', handler);
    return () => window.removeEventListener('nexopp_data_changed', handler);
  }, []);

  const items: FeaturedItem[] = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    tick;
    const matchLoc = (locStr?: string, cityStr?: string) => {
      if (!selectedCity || selectedCity === 'All India' || selectedCity === 'All Cities') return true;
      return (locStr?.toLowerCase().includes(selectedCity.toLowerCase()) || cityStr?.toLowerCase().includes(selectedCity.toLowerCase()));
    };

    const propItems: FeaturedItem[] = propertiesDb
      .filter(p => matchLoc(`${p.area}, ${p.city}`, p.city))
      .map(p => ({
        id: p.id,
        title: p.title,
        location: `${p.area}, ${p.city}`,
        price: p.priceDisplay,
        details: p.areaSqFt || p.category,
        image: p.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
        category: 'PROPERTY',
        timeAgo: 'Recently added'
      }));

    const franItems: FeaturedItem[] = franchiseDb
      .filter(f => matchLoc(f.location, f.city))
      .map(f => ({
        id: f.id,
        title: f.brand,
        location: f.location || `${f.city}, ${f.state}`,
        price: f.investmentDisplay,
        details: `${f.type} • High ROI`,
        image: f.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        category: 'FRANCHISE',
        timeAgo: 'Recently added'
      }));

    return [...propItems, ...franItems];
  }, [tick]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <section style={{
      padding: '3rem 5%',
      maxWidth: '1280px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <h2 style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#1F2937',
        }}>Featured Opportunities</h2>
        <a href="#" onClick={(e) => { e.preventDefault(); if (onViewAll) onViewAll(); }} style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#16A34A',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          View All <FaArrowRight size={12} />
        </a>
      </div>

      {/* Carousel Container */}
      <div style={{ position: 'relative' }}>
        {/* Left Arrow */}
        <button onClick={() => scroll('left')} style={{
          position: 'absolute',
          left: '-18px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          color: '#1F2937',
          fontSize: '0.9rem',
        }}>
          <FaChevronLeft />
        </button>

        {/* Right Arrow */}
        <button onClick={() => scroll('right')} style={{
          position: 'absolute',
          right: '-18px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          color: '#1F2937',
          fontSize: '0.9rem',
        }}>
          <FaChevronRight />
        </button>

        {/* Cards Row */}
        <div ref={scrollRef} style={{
          display: 'flex',
          gap: '1.25rem',
          overflowX: 'auto' as const,
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none' as const,
          msOverflowStyle: 'none' as const,
          padding: '0.5rem 0',
        }}>
          {items.length === 0 ? (
            <div style={{ width: '100%', padding: '2rem', textAlign: 'center', color: '#6B7280' }}>
              No featured opportunities available at the moment.
            </div>
          ) : (
            items.map((item) => (
            <div
              key={item.id}
              style={{
                flex: '0 0 280px',
                scrollSnapAlign: 'start',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '1px solid #E5E7EB',
                background: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: hoveredId === item.id ? 'translateY(-4px)' : 'none',
                boxShadow: hoveredId === item.id ? '0 8px 25px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onPropertyClick?.(item.id)}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img src={item.image} alt={item.title} style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover' as const,
                }} />
                {/* Category Badge */}
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  padding: '0.3rem 0.7rem',
                  borderRadius: '0.35rem',
                  background: categoryColors[item.category],
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}>{item.category}</span>
                {/* Heart */}
                <button onClick={(e) => { e.stopPropagation(); toggleWishlist(item.id); }} style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isWishlisted(item.id) ? '#DC2626' : '#9CA3AF',
                  fontSize: '0.85rem',
                }}>
                  {isWishlisted(item.id) ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '1rem' }}>
                <h3 style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#1F2937',
                  marginBottom: '0.3rem',
                }}>{item.title}</h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8rem',
                  color: '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  marginBottom: '0.5rem',
                }}>
                  <FaMapMarkerAlt size={10} /> {item.location}
                </p>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#16A34A',
                  marginBottom: '0.3rem',
                }}>
                  {item.price} {item.priceLabel && <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{item.priceLabel}</span>}
                </p>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.78rem',
                  color: '#6B7280',
                  marginBottom: '0.5rem',
                }}>{item.details}</p>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.72rem',
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}>
                  <FaClock size={10} /> {item.timeAgo}
                </p>
              </div>
            </div>
          ))
          )}
        </div>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default FeaturedOpportunities;
