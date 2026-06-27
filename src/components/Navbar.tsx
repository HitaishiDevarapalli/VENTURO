import React, { useState, useEffect, useRef } from 'react';
import { FaHome, FaBuilding, FaBriefcase, FaCoins, FaInfoCircle, FaChevronDown, FaHeart, FaMapMarkedAlt, FaStore, FaHandHoldingUsd, FaChartLine, FaShieldAlt, FaUserCircle, FaEnvelope, FaCamera, FaSignOutAlt, FaCog, FaEdit, FaPen, FaCheck, FaTimes, FaPhone, FaUser, FaUtensils, FaMedkit } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';

interface NavbarProps {
  heroBgIndex: number;
  onOpenWishlist: () => void;
  onNavigateBusiness?: (industry: 'Food' | 'Healthcare' | 'Retail & Stores') => void;
  onNavigateProperties?: () => void;
  onNavigateFranchise?: () => void;
  onNavigateFinance?: () => void;
  onGoHome?: () => void;
  isSubpage?: boolean;
  onNavigateToPage?: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ heroBgIndex: _heroBgIndex, onOpenWishlist, onNavigateBusiness, onNavigateProperties, onNavigateFranchise, onNavigateFinance, onGoHome, isSubpage: _isSubpage, onNavigateToPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileName, setProfileName] = useState('Guest User');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [settingsForm, setSettingsForm] = useState({ name: '', email: '', phone: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { wishlistItems } = useWishlist();

  // Load saved profile data
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    const savedName = localStorage.getItem('profileName');
    const savedEmail = localStorage.getItem('profileEmail');
    const savedPhone = localStorage.getItem('profilePhone');
    if (savedImage) setProfileImage(savedImage);
    if (savedName) setProfileName(savedName);
    if (savedEmail) setProfileEmail(savedEmail);
    if (savedPhone) setProfilePhone(savedPhone);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
        localStorage.setItem('profileImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setProfileName(tempName.trim());
      localStorage.setItem('profileName', tempName.trim());
    }
    setEditingName(false);
  };

  const handleSaveSettings = () => {
    if (settingsForm.name.trim()) {
      setProfileName(settingsForm.name.trim());
      localStorage.setItem('profileName', settingsForm.name.trim());
    }
    if (settingsForm.email.trim()) {
      setProfileEmail(settingsForm.email.trim());
      localStorage.setItem('profileEmail', settingsForm.email.trim());
    }
    if (settingsForm.phone.trim()) {
      setProfilePhone(settingsForm.phone.trim());
      localStorage.setItem('profilePhone', settingsForm.phone.trim());
    }
    setShowSettings(false);
  };

  const handleLogout = () => {
    setProfileImage(null);
    setProfileName('Guest User');
    setProfileEmail('');
    setProfilePhone('');
    localStorage.removeItem('profileImage');
    localStorage.removeItem('profileName');
    localStorage.removeItem('profileEmail');
    localStorage.removeItem('profilePhone');
    setShowProfileDropdown(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Simple active section detection based on page scroll
      const sections = ['hero', 'properties', 'franchise', 'business', 'finance', 'about', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'hero', label: 'Home', icon: <FaHome /> },
    { id: 'properties', label: 'Property', icon: <FaHome />, dropdown: [
      { name: 'Flats', link: '#properties', subIcon: <FaBuilding /> },
      { name: 'Individual Houses', link: '#properties', subIcon: <FaHome /> },
      { name: 'Land', link: '#properties', subIcon: <FaMapMarkedAlt /> },
    ]},
    { id: 'franchise', label: 'Franchise', icon: <FaBuilding />, dropdown: [
      { name: 'New Franchise', link: '#franchise', subIcon: <FaStore /> },
      { name: 'Existing Franchise', link: '#franchise', subIcon: <FaBriefcase /> },
    ]},
    { id: 'business', label: 'Business', icon: <FaBriefcase />, dropdown: [
      { name: 'Food', link: 'Food', subIcon: <FaUtensils /> },
      { name: 'Healthcare', link: 'Healthcare', subIcon: <FaMedkit /> },
      { name: 'Retail & Stores', link: 'Retail & Stores', subIcon: <FaStore /> },
    ]},
    { id: 'finance', label: 'Finance', icon: <FaCoins />, dropdown: [
      { name: 'Loans', link: '#finance', subIcon: <FaHandHoldingUsd /> },
      { name: 'Finance', link: '#finance', subIcon: <FaChartLine /> },
      { name: 'Insurance', link: '#finance', subIcon: <FaShieldAlt /> },
    ]},
    { id: 'about', label: 'About Us', icon: <FaInfoCircle /> },
    { id: 'contact', label: 'Contact Us', icon: <FaEnvelope /> },
  ];

  const handleScrollTo = (id: string) => {
    if (onGoHome) {
      onGoHome();
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    setOpenDropdown(null);
  };

  const handleNavItemClick = (itemId: string) => {
    // For category pages, navigate to the dedicated page instead of scrolling
    if (itemId === 'properties' && onNavigateProperties) {
      onNavigateProperties();
      setOpenDropdown(null);
      return;
    }
    if (itemId === 'franchise' && onNavigateFranchise) {
      onNavigateFranchise();
      setOpenDropdown(null);
      return;
    }
    if (itemId === 'business' && onNavigateToPage) {
      onNavigateToPage('businessPage');
      setOpenDropdown(null);
      return;
    }
    if (itemId === 'finance' && onNavigateFinance) {
      onNavigateFinance();
      setOpenDropdown(null);
      return;
    }
    if (itemId === 'hero' && onGoHome) {
      onGoHome();
      setOpenDropdown(null);
      return;
    }
    // For about/contact, scroll on the homepage
    handleScrollTo(itemId);
  };

  const handleDropdownClick = (itemId: string, subName: string, subLink: string, e: React.MouseEvent) => {
    setOpenDropdown(null);
    e.preventDefault();

    if (itemId === 'business') {
      if (onNavigateBusiness) {
        onNavigateBusiness(subLink as any);
      }
      return;
    }

    if (onNavigateToPage) {
      if (itemId === 'properties') {
        if (subName === 'Flats') onNavigateToPage('flatsPage');
        else if (subName === 'Individual Houses') onNavigateToPage('housesPage');
        else if (subName === 'Land') onNavigateToPage('landPage');
      } else if (itemId === 'franchise') {
        if (subName === 'New Franchise') onNavigateToPage('newFranchise');
        else if (subName === 'Existing Franchise') onNavigateToPage('franchiseResales');
      } else if (itemId === 'finance') {
        if (subName === 'Loans') onNavigateToPage('loansPage');
        else if (subName === 'Finance') onNavigateToPage('financeServicePage');
        else if (subName === 'Insurance') onNavigateToPage('insurancePage');
      }
    } else {
      // Fallback behavior
      if (itemId === 'properties') {
        if (onNavigateProperties) onNavigateProperties();
      } else if (itemId === 'franchise') {
        if (onNavigateFranchise) onNavigateFranchise();
      } else if (itemId === 'finance') {
        if (onNavigateFinance) onNavigateFinance();
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('select-finance-category', { detail: subName.toLowerCase() }));
        }, 200);
      }
    }
  };

  const getNavTextColor = (itemId: string) => {
    if (activeSection === itemId || hoveredItem === itemId) return '#16A34A';
    return '#4B5563';
  };

  return (
    <nav className="navbar" style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
      transition: 'box-shadow 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
        width: '100%',
      }}>

        {/* Left: Logo */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); if (onGoHome) onGoHome(); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <path d="M3 21h18" />
              <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 0V3h12v18H3" />
              <path d="M13 7h4" />
              <path d="M13 11h4" />
              <path d="M13 15h4" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#1F2937',
              letterSpacing: '-0.3px',
              lineHeight: '1.2',
            }}>TheNexOop</span>
            <span style={{
              fontSize: '11px',
              color: '#9CA3AF',
              fontWeight: 500,
              letterSpacing: '0.5px',
              lineHeight: '1',
            }}>Find. Invest. Grow.</span>
          </div>
        </a>

        {/* Center: Nav Items */}
        <ul style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}>
          {menuItems.map((item) => (
            <li
              key={item.id}
              style={{ position: 'relative' }}
              onMouseEnter={() => {
                setHoveredItem(item.id);
                if (item.dropdown) setOpenDropdown(item.id);
              }}
              onMouseLeave={() => {
                setHoveredItem(null);
                setOpenDropdown(null);
              }}
            >
              <button
                onClick={() => handleNavItemClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: activeSection === item.id ? 600 : 500,
                  color: getNavTextColor(item.id),
                  transition: 'color 0.2s ease, background-color 0.2s ease',
                  whiteSpace: 'nowrap',
                  backgroundColor: hoveredItem === item.id ? '#F0FDF4' : 'transparent',
                }}
              >
                <span>{item.label}</span>
                {item.dropdown && (
                  <FaChevronDown style={{
                    fontSize: '10px',
                    transition: 'transform 0.2s ease',
                    transform: openDropdown === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    opacity: 0.6,
                  }} />
                )}
              </button>

              {item.dropdown && openDropdown === item.id && (
                <ul style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '8px 0',
                  minWidth: '200px',
                  listStyle: 'none',
                  margin: 0,
                  zIndex: 1001,
                  animation: 'fadeIn 0.15s ease',
                }}>
                  {item.dropdown.map((sub, idx) => (
                    <li key={idx}>
                      <a
                        href="#"
                        onClick={(e) => handleDropdownClick(item.id, sub.name, sub.link, e)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 18px',
                          color: '#374151',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: 500,
                          transition: 'background-color 0.15s ease, color 0.15s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#F0FDF4';
                          (e.currentTarget as HTMLElement).style.color = '#16A34A';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          (e.currentTarget as HTMLElement).style.color = '#374151';
                        }}
                      >
                        {sub.subIcon && <span style={{ fontSize: '15px', opacity: 0.75, display: 'flex', alignItems: 'center' }}>{sub.subIcon}</span>}
                        <span>{sub.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Right: Watchlist, Post, Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
          marginLeft: '8px',
        }}>
          {/* Watchlist */}
          <button
            onClick={onOpenWishlist}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#4B5563',
              fontSize: '13px',
              fontWeight: 500,
              padding: '6px 8px',
              borderRadius: '6px',
              transition: 'color 0.2s ease, background-color 0.2s ease',
              position: 'relative',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#16A34A';
              (e.currentTarget as HTMLElement).style.backgroundColor = '#F0FDF4';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#4B5563';
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            }}
          >
            <FaHeart style={{ fontSize: '14px' }} />
            <span>Watchlist</span>
            {wishlistItems.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '0px',
                left: '18px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '9px',
                fontWeight: 700,
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}>
                {wishlistItems.length}
              </span>
            )}
          </button>

          {/* Post Opportunity */}
          <button
            onClick={() => handleScrollTo('contact')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, transform 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#15803D';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#16A34A';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 700 }}>+</span>
            <span>Post Opportunity</span>
          </button>

          {/* Profile */}
          <div style={{ position: 'relative' }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: '2px solid #E5E7EB',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                color: '#6B7280',
                fontSize: '20px',
                transition: 'border-color 0.2s ease, color 0.2s ease',
                padding: 0,
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#16A34A';
                (e.currentTarget as HTMLElement).style.color = '#16A34A';
              }}
              onMouseLeave={(e) => {
                if (!showProfileDropdown) {
                  (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB';
                  (e.currentTarget as HTMLElement).style.color = '#6B7280';
                }
              }}
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <FaUserCircle />
              )}
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <>
                <div
                  onClick={() => setShowProfileDropdown(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                />
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  border: '1px solid #E5E7EB',
                  padding: '0',
                  minWidth: '260px',
                  zIndex: 100,
                  overflow: 'hidden',
                }}>
                  {/* Profile Header with Image + Name */}
                  <div style={{
                    padding: '20px 18px 16px',
                    borderBottom: '1px solid #F3F4F6',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #F0F9FF 100%)',
                  }}>
                    {/* Profile Image with camera overlay */}
                    <div style={{ position: 'relative' }}>
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          border: '3px solid #16A34A',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#F9FAFB',
                          cursor: 'pointer',
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <FaUserCircle style={{ fontSize: '36px', color: '#9CA3AF' }} />
                        )}
                      </div>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#16A34A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          border: '2px solid #FFFFFF',
                        }}
                      >
                        <FaCamera style={{ fontSize: '10px', color: '#FFFFFF' }} />
                      </div>
                    </div>

                    {/* Editable Name */}
                    {editingName ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          ref={nameInputRef}
                          type="text"
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
                          autoFocus
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#111827',
                            border: '1px solid #D1D5DB',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            width: '140px',
                            textAlign: 'center',
                            outline: 'none',
                          }}
                          onFocus={(e) => { e.target.style.borderColor = '#16A34A'; }}
                          onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; }}
                        />
                        <button onClick={handleSaveName} style={{ background: '#16A34A', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '11px' }}><FaCheck /></button>
                        <button onClick={() => setEditingName(false)} style={{ background: '#EF4444', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '11px' }}><FaTimes /></button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>{profileName}</span>
                        <FaPen
                          onClick={() => { setTempName(profileName); setEditingName(true); }}
                          style={{ fontSize: '10px', color: '#9CA3AF', cursor: 'pointer', transition: 'color 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#16A34A'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; }}
                        />
                      </div>
                    )}

                    {/* Email if set */}
                    {profileEmail && (
                      <span style={{ fontSize: '12px', color: '#6B7280', marginTop: '-6px' }}>{profileEmail}</span>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: '6px 0' }}>
                    {/* Change Photo */}
                    <div
                      onClick={() => { fileInputRef.current?.click(); setShowProfileDropdown(false); }}
                      style={{
                        padding: '10px 18px',
                        fontSize: '14px',
                        color: '#374151',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <FaCamera style={{ fontSize: '14px', color: '#16A34A' }} />
                      <span>{profileImage ? 'Change Photo' : 'Upload Photo'}</span>
                    </div>

                    {/* Edit Name */}
                    <div
                      onClick={() => { setTempName(profileName); setEditingName(true); }}
                      style={{
                        padding: '10px 18px',
                        fontSize: '14px',
                        color: '#374151',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F0FDF4'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <FaEdit style={{ fontSize: '14px', color: '#16A34A' }} />
                      <span>Edit Name</span>
                    </div>

                    {/* Settings */}
                    <div
                      onClick={() => { setSettingsForm({ name: profileName, email: profileEmail, phone: profilePhone }); setShowSettings(true); setShowProfileDropdown(false); }}
                      style={{
                        padding: '10px 18px',
                        fontSize: '14px',
                        color: '#374151',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <FaCog style={{ fontSize: '14px', color: '#6B7280' }} />
                      <span>Settings</span>
                    </div>
                  </div>

                  {/* Logout */}
                  <div style={{ borderTop: '1px solid #F3F4F6', padding: '6px 0' }}>
                    <div
                      onClick={handleLogout}
                      style={{
                        padding: '10px 18px',
                        fontSize: '14px',
                        color: '#EF4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <FaSignOutAlt style={{ fontSize: '14px' }} />
                      <span>Log Out</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Settings Modal */}
      {showSettings && (
        <>
          <div
            onClick={() => setShowSettings(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 2000,
              backdropFilter: 'blur(4px)',
            }}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            padding: '0',
            width: '420px',
            maxWidth: '90vw',
            zIndex: 2001,
            overflow: 'hidden',
          }}>
            {/* Settings Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaCog style={{ fontSize: '18px', color: '#16A34A' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>Account Settings</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#6B7280', fontSize: '18px', padding: '4px',
                  borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Profile Image in Settings */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #16A34A',
                  overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB',
                }}>
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FaUserCircle style={{ fontSize: '44px', color: '#9CA3AF' }} />
                  )}
                </div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute', bottom: '0', right: '0',
                    width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#16A34A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #FFFFFF',
                  }}
                >
                  <FaCamera style={{ fontSize: '11px', color: '#FFFFFF' }} />
                </div>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>{profileName}</span>
              {profileEmail && <span style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>{profileEmail}</span>}
            </div>

            {/* Form Fields */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Name Field */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaUser style={{ fontSize: '12px', color: '#16A34A' }} /> Full Name
                </label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  placeholder="Enter your name"
                  style={{
                    width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                    backgroundColor: '#F9FAFB',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#16A34A'; e.target.style.backgroundColor = '#FFFFFF'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.backgroundColor = '#F9FAFB'; }}
                />
              </div>

              {/* Email Field */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaEnvelope style={{ fontSize: '12px', color: '#16A34A' }} /> Email
                </label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  placeholder="Enter your email"
                  style={{
                    width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                    backgroundColor: '#F9FAFB',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#16A34A'; e.target.style.backgroundColor = '#FFFFFF'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.backgroundColor = '#F9FAFB'; }}
                />
              </div>

              {/* Phone Field */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaPhone style={{ fontSize: '12px', color: '#16A34A' }} /> Phone
                </label>
                <input
                  type="tel"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  style={{
                    width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid #D1D5DB',
                    borderRadius: '8px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                    backgroundColor: '#F9FAFB',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#16A34A'; e.target.style.backgroundColor = '#FFFFFF'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#D1D5DB'; e.target.style.backgroundColor = '#F9FAFB'; }}
                />
              </div>
            </div>

            {/* Save / Cancel Buttons */}
            <div style={{ padding: '16px 24px 20px', display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #F3F4F6' }}>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  padding: '10px 20px', fontSize: '14px', fontWeight: 600, borderRadius: '8px',
                  border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#374151', cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                style={{
                  padding: '10px 24px', fontSize: '14px', fontWeight: 600, borderRadius: '8px',
                  border: 'none', backgroundColor: '#16A34A', color: '#FFFFFF', cursor: 'pointer',
                  transition: 'background-color 0.15s, transform 0.1s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#15803D'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#16A34A'; }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </>
      )}

    </nav>
  );
};
export default Navbar;
