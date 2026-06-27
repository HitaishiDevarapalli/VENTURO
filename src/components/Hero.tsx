import React, { useState } from 'react';
import { FaSearch, FaChevronDown, FaMapMarkerAlt, FaCheck, FaImages } from 'react-icons/fa';

interface HeroProps {
  currentBg: number;
  setCurrentBg: React.Dispatch<React.SetStateAction<number>>;
  onPropertyClick?: (id: string) => void;
  onSearch?: (category: string, query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ currentBg: _currentBg, setCurrentBg: _setCurrentBg, onPropertyClick, onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Hyderabad');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const locations = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Vijayawada', 'Visakhapatnam'];
  const categories = ['All Categories', 'Property', 'Franchise', 'Business', 'Finance', 'Insurance'];
  const popularTags = ['Apartment', 'Villa', 'Franchise', 'Home Loan', 'Health Insurance', 'Commercial Property'];

  const avatars = [
    { initials: 'AK', color: '#4F46E5' },
    { initials: 'SR', color: '#E11D48' },
    { initials: 'PM', color: '#F59E0B' },
  ];

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(selectedCategory, searchText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleTagClick = (tag: string) => {
    if (onSearch) {
      if (tag === 'Apartment') onSearch('Property', 'Apartment');
      else if (tag === 'Villa') onSearch('Property', 'Villa');
      else if (tag === 'Franchise') onSearch('Franchise', '');
      else if (tag === 'Home Loan') onSearch('Finance', 'Loan');
      else if (tag === 'Health Insurance') onSearch('Insurance', 'Health');
      else if (tag === 'Commercial Property') onSearch('Property', 'Commercial');
      else onSearch('All Categories', tag);
    }
  };

  return (
    <section
      id="hero"
      style={{
        paddingTop: '100px',
        paddingBottom: '3rem',
        backgroundColor: '#FFFFFF',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2rem',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '3rem',
        }}
      >
        {/* Left Column */}
        <div style={{ flex: '0 0 60%', maxWidth: '60%' }}>
          {/* Location Selector */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
            <div
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#F3F4F6',
                borderRadius: '9999px',
                padding: '8px 16px',
                fontSize: '14px',
                color: '#374151',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                userSelect: 'none',
              }}
            >
              <FaMapMarkerAlt style={{ color: '#16A34A', fontSize: '13px' }} />
              <span>{selectedLocation}</span>
              <FaChevronDown style={{ fontSize: '10px', color: '#9CA3AF', transform: showLocationDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </div>

            {/* Location Dropdown */}
            {showLocationDropdown && (
              <>
                {/* Backdrop to close dropdown */}
                <div
                  onClick={() => setShowLocationDropdown(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    border: '1px solid #E5E7EB',
                    padding: '8px 0',
                    minWidth: '200px',
                    zIndex: 100,
                    maxHeight: '280px',
                    overflowY: 'auto',
                  }}
                >
                  {locations.map((loc) => (
                    <div
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      style={{
                        padding: '10px 18px',
                        fontSize: '14px',
                        color: loc === selectedLocation ? '#16A34A' : '#374151',
                        fontWeight: loc === selectedLocation ? 600 : 400,
                        backgroundColor: loc === selectedLocation ? '#F0FDF4' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        if (loc !== selectedLocation) e.currentTarget.style.backgroundColor = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        if (loc !== selectedLocation) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <FaMapMarkerAlt style={{ fontSize: '11px', color: loc === selectedLocation ? '#16A34A' : '#9CA3AF' }} />
                      {loc}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: '3.2rem',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#111827',
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
            }}
          >
            Your Next Opportunity
            <br />
            Is Just{' '}
            <span style={{ color: '#16A34A' }}>One Click Away</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.7,
              color: '#6B7280',
              marginBottom: '2rem',
              maxWidth: '540px',
            }}
          >
            Explore the best Properties, Franchises, Finance &amp; Insurance
            opportunities all in one place.
          </p>

          {/* Search Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
              border: '1.5px solid #E5E7EB',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              marginBottom: '1.25rem',
              maxWidth: '600px',
              position: 'relative',
            }}
          >
            {/* Category Dropdown Toggle */}
            <div
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 18px',
                backgroundColor: '#F9FAFB',
                borderRight: '1.5px solid #E5E7EB',
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '10px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: '14px',
                fontWeight: 500,
                color: '#374151',
                transition: 'background-color 0.2s ease',
                userSelect: 'none',
              }}
            >
              <span>{selectedCategory}</span>
              <FaChevronDown style={{ fontSize: '10px', color: '#9CA3AF', transform: showCategoryDropdown ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </div>

            {/* Category Dropdown List */}
            {showCategoryDropdown && (
              <>
                <div
                  onClick={() => setShowCategoryDropdown(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    border: '1px solid #E5E7EB',
                    padding: '6px 0',
                    minWidth: '170px',
                    zIndex: 100,
                  }}
                >
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        color: cat === selectedCategory ? '#16A34A' : '#374151',
                        fontWeight: cat === selectedCategory ? 600 : 400,
                        backgroundColor: cat === selectedCategory ? '#F0FDF4' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (cat !== selectedCategory) e.currentTarget.style.backgroundColor = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        if (cat !== selectedCategory) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Text Input */}
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What are you looking for?"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                padding: '16px 18px',
                fontSize: '15px',
                color: '#111827',
                backgroundColor: 'transparent',
              }}
            />

            {/* Search Button */}
            <button
              onClick={handleSearchSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 24px',
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                border: 'none',
                borderTopRightRadius: '10px',
                borderBottomRightRadius: '10px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#15803D')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#16A34A')}
            >
              <FaSearch style={{ fontSize: '14px' }} />
              <span>Search</span>
            </button>
          </div>

          {/* Popular Tags */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              maxWidth: '600px',
            }}
          >
            <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500 }}>
              Popular:
            </span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F0FDF4';
                  e.currentTarget.style.borderColor = '#16A34A';
                  e.currentTarget.style.color = '#16A34A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.color = '#374151';
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ flex: '0 0 42%', maxWidth: '42%', position: 'relative', paddingBottom: '50px' }}>
          {/* Soft green gradient background frame */}
          <div
            style={{
              position: 'absolute',
              inset: '-24px',
              background: 'linear-gradient(135deg, rgba(22,163,74,0.07) 0%, rgba(22,163,74,0.03) 30%, transparent 50%, rgba(22,163,74,0.05) 100%)',
              borderRadius: '2.5rem',
              zIndex: 0,
            }}
          />

          {/* House Image */}
          <div
            onClick={() => onPropertyClick?.('P5')}
            style={{
              position: 'relative',
              cursor: 'pointer',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              zIndex: 1,
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.01)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <img
              src="/assets/hero_villa.jpg"
              alt="Modern luxury house"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>

          {/* Trusted By Badge — floats at top-right edge */}
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-30px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 24px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              minWidth: '170px',
              textAlign: 'center',
              zIndex: 5,
            }}
          >
            <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500, marginBottom: '4px', letterSpacing: '0.03em' }}>
              Trusted by
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16A34A', lineHeight: 1.1 }}>
              10,000+
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginTop: '4px', marginBottom: '12px' }}>
              Happy Customers
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {avatars.map((avatar, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: avatar.color,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: '2.5px solid #FFFFFF',
                    marginLeft: idx === 0 ? 0 : '-10px',
                    position: 'relative',
                    zIndex: avatars.length - idx,
                  }}
                >
                  {avatar.initials}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row below image: View More Pics + Verified Genuine Listings */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', position: 'relative', zIndex: 1 }}>
            <div
              onClick={() => onPropertyClick?.('P5')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '9999px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#16A34A';
                e.currentTarget.style.borderColor = '#16A34A';
                const label = e.currentTarget.querySelector('span');
                const svg = e.currentTarget.querySelector('svg');
                if (label) label.style.color = '#FFFFFF';
                if (svg) svg.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#E5E7EB';
                const label = e.currentTarget.querySelector('span');
                const svg = e.currentTarget.querySelector('svg');
                if (label) label.style.color = '#111827';
                if (svg) svg.style.color = '#16A34A';
              }}
            >
              <FaImages style={{ fontSize: '15px', color: '#16A34A', transition: 'color 0.2s' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827', transition: 'color 0.2s' }}>
                View More Pics
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#FFFFFF', borderRadius: '9999px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaCheck style={{ fontSize: '10px', color: '#16A34A' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                Verified Genuine Listings
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
