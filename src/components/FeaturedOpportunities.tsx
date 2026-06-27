import React, { useState, useRef } from 'react';
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaClock, FaArrowRight } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';

interface FeaturedItem {
  id: string;
  title: string;
  location: string;
  price: string;
  priceLabel?: string;
  details: string;
  image: string;
  category: 'PROPERTY' | 'FRANCHISE' | 'FINANCE' | 'INSURANCE';
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
  FINANCE: '#2563EB',
  INSURANCE: '#DC2626',
};

export const FeaturedOpportunities: React.FC<FeaturedOpportunitiesProps> = ({ onPropertyClick, onBuyProperty: _onBuyProperty, onViewAll }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const items: FeaturedItem[] = [
    {
      id: 'P1',
      title: '3 BHK Luxury Apartment',
      location: 'Gachibowli, Hyderabad',
      price: '₹ 1.25 Cr',
      details: '3 Beds  •  2 Baths  •  1650 sqft',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
      category: 'PROPERTY',
      timeAgo: '2 hours ago',
    },
    {
      id: 'P3',
      title: "Domino's Pizza Franchise",
      location: 'Hyderabad, Telangana',
      price: '₹ 30 - 40 Lakhs',
      details: 'High Return  •  Full Support',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
      category: 'FRANCHISE',
      timeAgo: '5 hours ago',
    },
    {
      id: 'feat-fin1',
      title: 'Home Loan',
      location: 'Interest Starting from',
      price: '8.40%',
      priceLabel: 'p.a.',
      details: 'Get quick approval in 24 hrs',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800',
      category: 'FINANCE',
      timeAgo: '1 day ago',
    },
    {
      id: 'feat-ins1',
      title: 'Term Life Insurance',
      location: 'Coverage up to',
      price: '₹ 1 Crore',
      details: 'Plans starting @ ₹ 499/month',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
      category: 'INSURANCE',
      timeAgo: '3 hours ago',
    },
    {
      id: 'P2',
      title: 'Premium Villa with Pool',
      location: 'Jubilee Hills, Hyderabad',
      price: '₹ 2.8 Cr',
      details: '4 Beds  •  3 Baths  •  3200 sqft',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
      category: 'PROPERTY',
      timeAgo: '6 hours ago',
    },
    {
      id: 'feat-fran2',
      title: 'Starbucks Franchise',
      location: 'Bangalore, Karnataka',
      price: '₹ 50 - 80 Lakhs',
      details: 'Premium Location  •  High ROI',
      image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&q=80&w=800',
      category: 'FRANCHISE',
      timeAgo: '1 day ago',
    },
  ];

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
          {items.map((item) => (
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
          ))}
        </div>
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default FeaturedOpportunities;
