import React, { useState } from 'react';
import {
  FaHome,
  FaBuilding,
  FaStore,
  FaBriefcase,
  FaHandHoldingUsd,
  FaShieldAlt,
  FaChartLine,
} from 'react-icons/fa';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const categories = [
  {
    title: 'Property',
    subtitle: 'Buy, Sell & Rent Properties',
    icon: FaHome,
    page: 'propertiesPage',
  },
  {
    title: 'Commercial Property',
    subtitle: 'Shops, Offices & Warehouses',
    icon: FaBuilding,
    page: 'propertiesPage',
  },
  {
    title: 'Franchise Opportunities',
    subtitle: 'Start Your Own Successful Business',
    icon: FaStore,
    page: 'franchisePage',
  },
  {
    title: 'Business for Sale',
    subtitle: 'Take Over an Existing Business',
    icon: FaBriefcase,
    page: 'businessPage',
  },
  {
    title: 'Finance Services',
    subtitle: 'Loans, Credit Cards & More',
    icon: FaHandHoldingUsd,
    page: 'financePage',
  },
  {
    title: 'Insurance',
    subtitle: 'Health, Life, Vehicle & More',
    icon: FaShieldAlt,
    page: 'financePage',
  },
  {
    title: 'Investment Opportunities',
    subtitle: 'Secure Your Future, Grow Wealth',
    icon: FaChartLine,
    page: 'financePage',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const sectionStyle: React.CSSProperties = {
    padding: '3rem 1.5rem',
    maxWidth: '1280px',
    margin: '0 auto',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#1F2937',
    textAlign: 'left',
    marginBottom: '2rem',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1rem',
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const isHovered = hoveredIndex === index;
    return {
      backgroundColor: '#FFFFFF',
      borderRadius: '1rem',
      border: isHovered ? '1px solid #16A34A' : '1px solid #E5E7EB',
      padding: '1.5rem',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: isHovered
        ? '0 8px 24px rgba(22, 163, 74, 0.12)'
        : '0 1px 3px rgba(0,0,0,0.04)',
      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    };
  };

  const iconCircleStyle: React.CSSProperties = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#F0FDF4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '1.4rem',
    color: '#16A34A',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#1F2937',
    marginBottom: '0.5rem',
    lineHeight: 1.3,
  };

  const cardSubtitleStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: '#6B7280',
    lineHeight: 1.5,
    marginBottom: '1rem',
    flexGrow: 1,
  };

  const arrowStyle: React.CSSProperties = {
    alignSelf: 'flex-start',
    fontSize: '1rem',
    color: '#16A34A',
    fontWeight: 700,
  };

  return (
    <section style={sectionStyle}>
      <h2 style={titleStyle}>Browse by Category</h2>

      <style>{`
        @media (max-width: 1024px) {
          .venturo-category-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .venturo-category-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>

      <div className="venturo-category-grid" style={gridStyle}>
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.title}
              style={getCardStyle(index)}
              onClick={() => onNavigate(cat.page)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div style={iconCircleStyle}>
                <Icon style={iconStyle} />
              </div>
              <div style={cardTitleStyle}>{cat.title}</div>
              <div style={cardSubtitleStyle}>{cat.subtitle}</div>
              <span style={arrowStyle}>→</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HomePage;
