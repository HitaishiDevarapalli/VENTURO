import React, { useState, useEffect } from 'react';
import { 
  FaBuilding, 
  FaStore, 
  FaEnvelope, 
  FaTrash, 
  FaEdit, 
  FaSignOutAlt, 
  FaPalette, 
  FaCheckCircle,
  FaUserTie,
  FaChartPie,
  FaSearch,
  FaBell,
  FaUserShield,
  FaPlus,
  FaDesktop,
  FaVideo,
  FaUpload,
  FaChevronDown,
  FaChevronRight,
  FaHome,
  FaBriefcase,
  FaUsers,
  FaCog,
  FaChartLine,
  FaListAlt,
  FaQuestionCircle,
  FaMapMarkerAlt,
  FaEllipsisV,
  FaEye,
  FaArrowUp,
  FaCalendarAlt,
  FaFileAlt,
  FaStar,
  FaChartBar,
  FaFolder,
  FaClock,
  FaImage,
  FaTrophy,
  FaCompass
} from 'react-icons/fa';
import { 
  propertiesDb, 
  franchiseDb, 
  businessDb,
  dealersDb, 
  enquiriesDb, 
  siteSettingsDb, 
  teamMembersDb,
  deleteEnquiry, 
  updateEnquiryStatus, 
  updateSiteSettings, 
  addTeamMember,
  deleteTeamMember,
  updateProperty,
  updateFranchise,
  updateDealer,
  clearAllStaticData
} from '../db/marketplaceDb';
import { BrokerManagementSystem } from './BrokerManagementSystem';
import { Logo } from './Logo';
import { PropertyManagementSystem } from './PropertyManagementSystem';
import { FranchiseManagementSystem } from './FranchiseManagementSystem';
import type {
  PropertyListing,
  FranchiseListing,
  Dealer,
  SiteSettings,
  TeamMember
} from '../db/marketplaceDb';

interface AdminPanelProps {
  onDataChange?: () => void;
  onRefresh?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onDataChange, onRefresh }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('nexopp_admin_auth') === 'true';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [newCityInput, setNewCityInput] = useState('');
  const [newTagInput, setNewTagInput] = useState('');

  // Main Category Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'main_stats' | 'customization' | 'hero_cms' | 'properties' | 'franchises' | 'businesses' | 'brokers' | 'inquiries' | 'team'>('overview');
  const [expandedMenu, setExpandedMenu] = useState<string | null>('brokers');
  const [analyticsDateRange, setAnalyticsDateRange] = useState<'This Week' | 'This Month' | 'Last 30 Days' | 'This Year'>('This Week');
  const [activeAnalyticsSlide, setActiveAnalyticsSlide] = useState<'property' | 'franchise' | 'business'>('property');
  const [propertySubTab, setPropertySubTab] = useState<string>('listings');
  const [franchiseSubTab, setFranchiseSubTab] = useState<string>('listings');
  const [businessSubTab, setBusinessSubTab] = useState<string>('listings');
  const [brokerSubTab, setBrokerSubTab] = useState<string>('directory');

  const SUB_MENU_ITEMS: Record<string, { id: string; label: string; icon: any }[]> = {
    properties: [
      { id: 'listings', label: 'All Properties', icon: <FaListAlt /> },
      { id: 'featured', label: 'Featured & Premium', icon: <FaStar /> },
      { id: 'analytics', label: 'Analytics & Stats', icon: <FaChartBar /> },
      { id: 'categories', label: 'Categories & Subtypes', icon: <FaFolder /> },
      { id: 'locations', label: 'Location Intelligence', icon: <FaMapMarkerAlt /> },
      { id: 'reports', label: 'Reports & Export', icon: <FaFileAlt /> },
    ],
    franchises: [
      { id: 'listings', label: 'Franchise Directory', icon: <FaListAlt /> },
      { id: 'approvals', label: 'Pending Approvals', icon: <FaClock /> },
      { id: 'featured_premium', label: 'Featured & Premium', icon: <FaStar /> },
      { id: 'analytics', label: 'Franchise Analytics', icon: <FaChartBar /> },
      { id: 'categories_locations', label: 'Categories & Locations', icon: <FaMapMarkerAlt /> },
      { id: 'enquiries', label: 'Franchise Enquiries', icon: <FaEnvelope /> },
      { id: 'gallery', label: 'Media & Gallery', icon: <FaImage /> },
      { id: 'reports', label: 'Reports & Export', icon: <FaFileAlt /> },
    ],
    businesses: [
      { id: 'listings', label: 'Business Directory', icon: <FaListAlt /> },
      { id: 'approvals', label: 'Pending Approvals', icon: <FaClock /> },
      { id: 'featured_premium', label: 'Featured & Premium', icon: <FaStar /> },
      { id: 'analytics', label: 'Business Analytics', icon: <FaChartBar /> },
      { id: 'categories_locations', label: 'Categories & Locations', icon: <FaMapMarkerAlt /> },
      { id: 'enquiries', label: 'Business Enquiries', icon: <FaEnvelope /> },
      { id: 'gallery', label: 'Media & Gallery', icon: <FaImage /> },
      { id: 'reports', label: 'Reports & Export', icon: <FaFileAlt /> },
    ],
    brokers: [
      { id: 'directory', label: 'Broker Directory', icon: <FaListAlt /> },
      { id: 'leaderboard', label: 'Top Leaderboard', icon: <FaTrophy /> },
      { id: 'premium', label: 'Premium Brokers', icon: <FaStar /> },
      { id: 'category_rank', label: 'Category Rankings', icon: <FaFolder /> },
      { id: 'location_rank', label: 'Location Rankings', icon: <FaMapMarkerAlt /> },
      { id: 'analytics', label: 'Broker Analytics', icon: <FaChartBar /> },
    ],
  };
  
  // New Team Member Form State
  const [newTeamMember, setNewTeamMember] = useState<Omit<TeamMember, 'id'>>({ name: '', designation: '', photo: '', phone: '', linkedin: '' });

  
  // State for reactive refresh
  const [tick, setTick] = useState(0);
  const triggerRefresh = () => {
    setTick(t => t + 1);
    onDataChange?.();
    onRefresh?.();
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  triggerRefresh;

  useEffect(() => {
    const handler = () => setTick(t => t + 1);
    window.addEventListener('nexopp_data_changed', handler);
    return () => window.removeEventListener('nexopp_data_changed', handler);
  }, []);

  useEffect(() => {
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.stop();
    }
    return () => {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.start();
      }
    };
  }, []);


  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);
  const showNotification = (message: string, type: string = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validEmail = email.toLowerCase().includes('admin') || email === 'admin@thenexoop.in';
    if (validEmail && (password === 'admin123' || password === 'nexopp2026')) {
      sessionStorage.setItem('nexopp_admin_auth', 'true');
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Invalid Admin credentials. Please try again.');
    }
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamMember.name || !newTeamMember.designation) {
      showNotification('Please enter Name and Designation', 'warning');
      return;
    }
    const id = 'TM_' + Date.now();
    addTeamMember({
      id,
      name: newTeamMember.name,
      designation: newTeamMember.designation,
      photo: newTeamMember.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      phone: newTeamMember.phone,
      linkedin: newTeamMember.linkedin
    });
    showNotification(`Added ${newTeamMember.name} to Executive Leadership!`);
    setNewTeamMember({ name: '', designation: '', photo: '', phone: '', linkedin: '' });
  };

  const handleDeleteTeamMember = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from Leadership profiles?`)) {
      deleteTeamMember(id);
      showNotification(`Removed ${name} from Leadership profiles.`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nexopp_admin_auth');
    setIsAuthenticated(false);
  };

  // Helper for multiple photo file uploads (Base64 conversion)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64List: string[]) => void) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    Promise.all(files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    })).then(results => {
      callback(results);
    });
  };

  // --- Category 1: Website Control & Customization State ---
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettingsDb);
  useEffect(() => {
    setSettingsForm(siteSettingsDb);
  }, [tick]);

  const currentMainStats = settingsForm.mainPageStats || {
    propertiesListed: '18,500+',
    franchisesCount: '950+',
    verifiedBrokers: '2,400+',
    citiesCovered: '32',
    totalPropertyValue: '₹850 Cr+',
    happyClients: '15K+',
    activeListingsWhy: '10,000+',
    happyCustomersWhy: '5,000+',
    citiesCoveredWhy: '50+',
    verifiedListingsWhy: '100%',
    customerSupportWhy: '24/7'
  };

  const handleAddCity = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCityInput.trim()) return;
    const currentCities = settingsForm.availableCities || ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Chennai', 'Pune'];
    if (!currentCities.includes(newCityInput.trim())) {
      setSettingsForm({ ...settingsForm, availableCities: [...currentCities, newCityInput.trim()] });
    }
    setNewCityInput('');
  };

  const handleRemoveCity = (cityToRemove: string) => {
    const currentCities = settingsForm.availableCities || ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Chennai', 'Pune'];
    setSettingsForm({ ...settingsForm, availableCities: currentCities.filter(c => c !== cityToRemove) });
  };

  const handleAddPopularTag = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    const currentTags = settingsForm.heroPopularTags || ['Apartment', 'Villa', 'Franchise', 'Commercial Property'];
    if (!currentTags.includes(newTagInput.trim())) {
      setSettingsForm({ ...settingsForm, heroPopularTags: [...currentTags, newTagInput.trim()] });
    }
    setNewTagInput('');
  };

  const handleRemovePopularTag = (tagToRemove: string) => {
    const currentTags = settingsForm.heroPopularTags || ['Apartment', 'Villa', 'Franchise', 'Commercial Property'];
    setSettingsForm({ ...settingsForm, heroPopularTags: currentTags.filter(t => t !== tagToRemove) });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(settingsForm);
    showNotification("Website appearance, locations & analytics successfully updated across the entire site!");
  };

  const handleClearStaticData = () => {
    if (window.confirm("Are you sure you want to remove all static sample data? This will clear initial demo properties and franchises.")) {
      clearAllStaticData();
      showNotification("All sample data cleared. Your database is now clean.", "warning");
    }
  };


  // --- Editing State for Modal / Inline Editing ---
  const [editingProperty, setEditingProperty] = useState<PropertyListing | null>(null);
  const [editingFranchise, setEditingFranchise] = useState<FranchiseListing | null>(null);
  const [editingBroker, setEditingBroker] = useState<Dealer | null>(null);


  // ================= PASSWORD AUTH LOGIN SCREEN (WHITE & GREEN PROFESSIONAL) =================
  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", padding: '20px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '48px 40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', width: '100%', maxWidth: '440px', textAlign: 'center' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <Logo size="xl" />
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A', margin: '0 0 6px 0' }}>
            Super Admin Portal
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0 0 32px 0', fontWeight: 500 }}>
            Enterprise Management & Control Center
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="Admin Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#0F172A', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#0F172A', fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
              />
            </div>
            
            {error && (
              <span style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: 600 }}>
                Invalid Admin credentials. Please try again.
              </span>
            )}

            <button
              type="submit"
              style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#0F172A', color: '#FFFFFF', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', marginTop: '8px', boxShadow: '0 4px 12px rgba(15,23,42,0.15)' }}
            >
              Access Portal
            </button>
          </form>
          
          <div style={{ marginTop: '32px', borderTop: '1px solid #F1F5F9', paddingTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button
              onClick={() => window.location.href = '/'}
              style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              ← Return to Main Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'properties': return { title: 'Property Management System', sub: 'Manage, Publish & Grow Your Property Listings' };
      case 'franchises': return { title: 'Franchise Management System', sub: 'Manage, Publish & Grow Your Franchise Opportunities' };
      case 'businesses': return { title: 'Business Management System', sub: 'Manage, Publish & Grow Your Business Listings & Opportunities' };
      case 'brokers': return { title: 'Broker Management System', sub: 'Manage, Verify & Empower Your Real Estate Broker Network' };
      case 'main_stats': return { title: 'Main Page Stats & Trust Metrics', sub: 'Edit Live Homepage Statistics, Trust Badges & Numbers' };
      case 'hero_cms': return { title: 'Homepage Builder Studio & Stats', sub: 'Customize Hero Sections, Stats, Backgrounds & Visible Elements' };
      case 'customization': return { title: 'Website Settings & Customization', sub: 'Configure Showcase Feeds, Brand Interactions & Stats' };
      case 'inquiries': return { title: 'Orders & Leads Enquiries', sub: 'Track Customer Leads, Consultation Requests & Inquiries' };
      case 'team': return { title: 'Team Members Manager', sub: 'Manage Internal Staff, Roles & Portal Access' };
      default: return { title: 'Welcome back, Super Admin! 👋', sub: "Here's what's happening with your marketplace today." };
    }
  };

  const headerInfo = getHeaderInfo();

  // ================= MAIN ULTRA-MODERN SAAS DASHBOARD EXACTLY MATCHING USER SCREENSHOT =================
  return (
    <div data-lenis-prevent="true" style={{ backgroundColor: '#F8FAFC', height: '100vh', width: '100%', overflow: 'hidden', fontFamily: "'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: '#0F172A', display: 'flex' }}>
      
      {/* Sidebar Navigation matching user screenshot exactly */}
      <div style={{ width: '265px', height: '100%', backgroundColor: '#FFFFFF', borderRight: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10 }}>
        
        {/* Top Brand Box */}
        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, color: '#16A34A' }}>
              ✦
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#0F172A', lineHeight: 1.1 }}>
                THENEXOPP
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748B', letterSpacing: '0.02em', marginTop: '2px' }}>
                Marketplace Control Center
              </div>
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '1.25rem', cursor: 'pointer', padding: '4px' }}>
            ≡
          </button>
        </div>

        {/* Sidebar Scrollable Nav */}
        <nav data-lenis-prevent="true" style={{ display: 'flex', flexDirection: 'column', padding: '10px 14px', gap: '4px', overflowY: 'auto', flexGrow: 1 }}>
          
          {/* Active Item: Dashboard */}
          <button
            onClick={() => {
              setActiveTab('overview');
              setExpandedMenu(null);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', border: 'none', borderRadius: '10px', cursor: 'pointer',
              fontSize: '0.9rem', fontWeight: activeTab === 'overview' ? 700 : 500,
              backgroundColor: activeTab === 'overview' ? '#16A34A' : 'transparent',
              color: activeTab === 'overview' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s', textAlign: 'left', width: '100%', boxSizing: 'border-box'
            }}
          >
            <span style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center' }}><FaHome /></span>
            <span style={{ flexGrow: 1 }}>Dashboard</span>
          </button>

          {/* Section: CONTENT MANAGEMENT */}
          <div style={{ padding: '16px 10px 6px 10px', fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            CONTENT MANAGEMENT
          </div>

          {[
            { id: 'properties', label: 'Property Management', icon: <FaBuilding />, hasArrow: true },
            { id: 'franchises', label: 'Franchise Management', icon: <FaStore />, hasArrow: true },
            { id: 'businesses', label: 'Business Management', icon: <FaBriefcase />, hasArrow: true },
            { id: 'inquiries', label: 'Lead & Enquiries', icon: <FaEnvelope /> },
            { id: 'orders', label: 'Orders & Bookings', icon: <FaListAlt /> },
          ].map((item) => {
            const isActive = activeTab === item.id || (item.id === 'orders' && activeTab === 'inquiries');
            const subItems = SUB_MENU_ITEMS[item.id];
            const currentSubTab = item.id === 'properties' ? propertySubTab : item.id === 'franchises' ? franchiseSubTab : item.id === 'businesses' ? businessSubTab : '';
            return (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <button
                  onClick={() => {
                    if (item.id === 'orders') {
                      setActiveTab('inquiries');
                      setExpandedMenu(null);
                    } else {
                      setActiveTab(item.id as any);
                      if (subItems) {
                        setExpandedMenu(expandedMenu === item.id ? null : item.id);
                      } else {
                        setExpandedMenu(null);
                      }
                    }
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                    fontSize: '0.88rem', fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? '#DCFCE7' : 'transparent',
                    color: isActive ? '#16A34A' : '#475569',
                    transition: 'all 0.15s', textAlign: 'left', width: '100%', boxSizing: 'border-box'
                  }}
                >
                  <span style={{ fontSize: '1rem', color: isActive ? '#16A34A' : '#94A3B8', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                  <span style={{ flexGrow: 1 }}>{item.label}</span>
                  {item.hasArrow && (
                    <span style={{ fontSize: '0.75rem', color: isActive ? '#16A34A' : '#94A3B8', display: 'flex', alignItems: 'center', transition: 'transform 0.2s', transform: expandedMenu === item.id ? 'rotate(90deg)' : 'none' }}>
                      <FaChevronRight />
                    </span>
                  )}
                </button>

                {expandedMenu === item.id && subItems && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '12px', marginTop: '4px', marginBottom: '6px', borderLeft: '2px solid #E2E8F0', marginLeft: '22px' }}>
                    {subItems.map(sub => {
                      const isSubActive = activeTab === item.id && currentSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab(item.id as any);
                            if (item.id === 'properties') setPropertySubTab(sub.id);
                            else if (item.id === 'franchises') setFranchiseSubTab(sub.id);
                            else if (item.id === 'businesses') setBusinessSubTab(sub.id);
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 12px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '0.82rem', fontWeight: isSubActive ? 700 : 500,
                            backgroundColor: isSubActive ? '#F0FDF4' : 'transparent',
                            color: isSubActive ? '#16A34A' : '#64748B',
                            transition: 'all 0.15s', textAlign: 'left', width: '100%', boxSizing: 'border-box'
                          }}
                        >
                          <span style={{ fontSize: '0.85rem', opacity: isSubActive ? 1 : 0.7 }}>{sub.icon}</span>
                          <span style={{ flexGrow: 1 }}>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Section: USER MANAGEMENT */}
          <div style={{ padding: '16px 10px 6px 10px', fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            USER MANAGEMENT
          </div>

          {[
            { id: 'brokers', label: 'Broker Management', icon: <FaUserTie />, hasArrow: true },
            { id: 'users', label: 'User Management', icon: <FaUsers /> },
            { id: 'team', label: 'Team Members', icon: <FaUserShield /> },
            { id: 'roles', label: 'Roles & Permissions', icon: <FaCog /> },
          ].map((item) => {
            const isActive = activeTab === item.id || ((item.id === 'users' || item.id === 'roles') && activeTab === 'team');
            const subItems = SUB_MENU_ITEMS[item.id];
            const currentSubTab = item.id === 'brokers' ? brokerSubTab : '';
            return (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <button
                  onClick={() => {
                    if (item.id === 'users' || item.id === 'roles') {
                      setActiveTab('team');
                      setExpandedMenu(null);
                    } else {
                      setActiveTab(item.id as any);
                      if (subItems) {
                        setExpandedMenu(expandedMenu === item.id ? null : item.id);
                      } else {
                        setExpandedMenu(null);
                      }
                    }
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                    fontSize: '0.88rem', fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? '#DCFCE7' : 'transparent',
                    color: isActive ? '#16A34A' : '#475569',
                    transition: 'all 0.15s', textAlign: 'left', width: '100%', boxSizing: 'border-box'
                  }}
                >
                  <span style={{ fontSize: '1rem', color: isActive ? '#16A34A' : '#94A3B8', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                  <span style={{ flexGrow: 1 }}>{item.label}</span>
                  {item.hasArrow && (
                    <span style={{ fontSize: '0.75rem', color: isActive ? '#16A34A' : '#94A3B8', display: 'flex', alignItems: 'center', transition: 'transform 0.2s', transform: expandedMenu === item.id ? 'rotate(90deg)' : 'none' }}>
                      <FaChevronRight />
                    </span>
                  )}
                </button>

                {expandedMenu === item.id && subItems && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '12px', marginTop: '4px', marginBottom: '6px', borderLeft: '2px solid #E2E8F0', marginLeft: '22px' }}>
                    {subItems.map(sub => {
                      const isSubActive = activeTab === item.id && currentSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab(item.id as any);
                            if (item.id === 'brokers') setBrokerSubTab(sub.id);
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 12px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '0.82rem', fontWeight: isSubActive ? 700 : 500,
                            backgroundColor: isSubActive ? '#F0FDF4' : 'transparent',
                            color: isSubActive ? '#16A34A' : '#64748B',
                            transition: 'all 0.15s', textAlign: 'left', width: '100%', boxSizing: 'border-box'
                          }}
                        >
                          <span style={{ fontSize: '0.85rem', opacity: isSubActive ? 1 : 0.7 }}>{sub.icon}</span>
                          <span style={{ flexGrow: 1 }}>{sub.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Section: SITE MANAGEMENT */}
          <div style={{ padding: '16px 10px 6px 10px', fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            SITE MANAGEMENT
          </div>

          {[
            { id: 'main_stats', label: 'Main Page Stats', icon: <FaChartLine /> },
            { id: 'hero_cms', label: 'CMS Builder', icon: <FaDesktop /> },
            { id: 'customization', label: 'Website Settings', icon: <FaPalette /> },
            { id: 'seo', label: 'SEO & Analytics', icon: <FaChartLine /> },
            { id: 'newsletter', label: 'Newsletter', icon: <FaEnvelope /> },
          ].map((item) => {
            const isActive = activeTab === item.id || (item.id === 'seo' && activeTab === 'customization') || (item.id === 'newsletter' && activeTab === 'inquiries');
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'seo') setActiveTab('customization');
                  else if (item.id === 'newsletter') setActiveTab('inquiries');
                  else setActiveTab(item.id as any);
                  setExpandedMenu(null);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                  fontSize: '0.88rem', fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? '#DCFCE7' : 'transparent',
                  color: isActive ? '#16A34A' : '#475569',
                  transition: 'all 0.15s', textAlign: 'left', width: '100%', boxSizing: 'border-box'
                }}
              >
                <span style={{ fontSize: '1rem', color: isActive ? '#16A34A' : '#94A3B8', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                <span style={{ flexGrow: 1 }}>{item.label}</span>
              </button>
            );
          })}

          {/* Section: SYSTEM */}
          <div style={{ padding: '16px 10px 6px 10px', fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            SYSTEM
          </div>

          {[
            { id: 'sys_settings', label: 'System Settings', icon: <FaCog /> },
            { id: 'logs', label: 'Activity Logs', icon: <FaFileAlt /> },
          ].map((item) => {
            const isActive = (item.id === 'sys_settings' && activeTab === 'customization') || (item.id === 'logs' && activeTab === 'overview');
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'sys_settings') setActiveTab('customization');
                  else setActiveTab('overview');
                  setExpandedMenu(null);
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', border: 'none', borderRadius: '10px', cursor: 'pointer',
                  fontSize: '0.88rem', fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? '#DCFCE7' : 'transparent',
                  color: isActive ? '#16A34A' : '#475569',
                  transition: 'all 0.15s', textAlign: 'left', width: '100%', boxSizing: 'border-box'
                }}
              >
                <span style={{ fontSize: '1rem', color: isActive ? '#16A34A' : '#94A3B8', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                <span style={{ flexGrow: 1 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ================= RIGHT MAIN PANEL ================= */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        
        {/* Top Navbar */}
        <div style={{ height: '72px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {getHeaderInfo().title}
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#64748B', fontWeight: 500 }}>
              {getHeaderInfo().sub}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.85rem' }} />
              <input
                type="text"
                placeholder="Search anything..."
                style={{ width: '100%', padding: '9px 40px 9px 38px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC', fontSize: '0.85rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
              />
              <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#E2E8F0', color: '#64748B', fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                ⌘K
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: '1px solid #E2E8F0' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#059669', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                SA
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>
                  Super Admin
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.72rem', color: '#059669' }}>Administrator</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div data-lenis-prevent="true" style={{ padding: '32px 36px', overflowY: 'auto', flexGrow: 1, backgroundColor: '#F8FAFC' }}>
          
          {/* ================= CATEGORY 0: GRAND OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Inter', 'Plus Jakarta Sans', -apple-system, sans-serif" }}>
              
              {/* Quick Banner: Edit Main Page Stats */}
              <div style={{ backgroundColor: '#EFF6FF', border: '2px solid #3B82F6', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#3B82F6', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
                    <FaChartBar />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1E3A8A' }}>Live Main Page Stats & Trust Metrics Control</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#334155' }}>Want to edit the stats shown on the homepage? (e.g. 18,500+ Properties, 950+ Franchises, 2,400+ Brokers, ₹850 Cr+ Value)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('main_stats')}
                  style={{ padding: '12px 24px', backgroundColor: '#1E3A8A', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(30, 58, 138, 0.3)' }}
                >
                  <span>Edit Main Page Stats Now →</span>
                </button>
              </div>

              {/* ROW 1: Top 5 Stat Cards with SVG Sparkline Graphs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                
                {/* Card 1: TOTAL PROPERTIES */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '135px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                      <FaHome />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>TOTAL PROPERTIES</span>
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', margin: '10px 0 6px 0', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {propertiesDb.length.toLocaleString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '2px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16A34A' }}>↑ 12.5% from last week</span>
                  <svg width="60" height="22" viewBox="0 0 60 22" fill="none">
                    <path d={propertiesDb.length === 0 ? "M2 18 L58 18" : "M2 18 C 12 14, 20 20, 32 10 C 44 2, 50 14, 58 6"} stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Card 2: FRANCHISES */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '135px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                    <FaStore />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>FRANCHISES</span>
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', margin: '10px 0 6px 0', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {franchiseDb.length.toLocaleString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '2px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563EB' }}>↑ 9.3% from last week</span>
                  <svg width="60" height="22" viewBox="0 0 60 22" fill="none">
                    <path d={franchiseDb.length === 0 ? "M2 18 L58 18" : "M2 16 C 14 18, 22 8, 34 14 C 46 20, 50 6, 58 8"} stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Card 3: BUSINESSES */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '135px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                    <FaBriefcase />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>BUSINESSES</span>
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', margin: '10px 0 6px 0', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {businessDb.length.toLocaleString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '2px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9333EA' }}>↑ 8.7% from last week</span>
                  <svg width="60" height="22" viewBox="0 0 60 22" fill="none">
                    <path d={businessDb.length === 0 ? "M2 18 L58 18" : "M2 18 C 16 10, 24 18, 34 8 C 44 -2, 50 14, 58 6"} stroke="#9333EA" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Card 4: LEAD ENQUIRIES */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '135px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FFEDD5', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                    <FaEnvelope />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>LEAD ENQUIRIES</span>
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', margin: '10px 0 6px 0', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {enquiriesDb.length.toLocaleString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '2px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16A34A' }}>↑ 15.8% from last week</span>
                  <svg width="60" height="22" viewBox="0 0 60 22" fill="none">
                    <path d={enquiriesDb.length === 0 ? "M2 18 L58 18" : "M2 16 C 14 16, 24 10, 36 12 C 48 14, 52 6, 58 8"} stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Card 5: TOTAL USERS */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '135px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#CCFBF1', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                    <FaUsers />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>TOTAL USERS</span>
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', margin: '10px 0 6px 0', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {(dealersDb.length + teamMembersDb.length + enquiriesDb.length).toLocaleString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '2px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16A34A' }}>↑ 18.6% from last week</span>
                  <svg width="60" height="22" viewBox="0 0 60 22" fill="none">
                    <path d={(dealersDb.length + teamMembersDb.length + enquiriesDb.length) === 0 ? "M2 18 L58 18" : "M2 18 C 14 18, 24 12, 36 15 C 48 18, 52 6, 58 10"} stroke="#0D9488" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ROW 2: 3 Columns Grid (Overview Analytics Line Chart, Recent Activity, Top Performing Locations Pie Chart) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '20px', alignItems: 'stretch' }}>
              
              {/* Col 1: Overview Analytics (Bar Graph showing listings by category with Slide navigation) */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '22px 24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '340px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', display: 'block' }}>Overview Analytics</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Active listings distribution (Bar Graph)</span>
                  </div>
                  
                  {/* Slider Pagination Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button 
                      onClick={() => {
                        if (activeAnalyticsSlide === 'business') setActiveAnalyticsSlide('franchise');
                        else if (activeAnalyticsSlide === 'franchise') setActiveAnalyticsSlide('property');
                      }}
                      disabled={activeAnalyticsSlide === 'property'}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', cursor: activeAnalyticsSlide === 'property' ? 'not-allowed' : 'pointer', opacity: activeAnalyticsSlide === 'property' ? 0.4 : 1, fontSize: '0.8rem', fontWeight: 'bold' }}
                    >
                      ←
                    </button>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', minWidth: '50px', textAlign: 'center' }}>
                      {activeAnalyticsSlide === 'property' ? '1 / 3' : activeAnalyticsSlide === 'franchise' ? '2 / 3' : '3 / 3'}
                    </span>
                    <button 
                      onClick={() => {
                        if (activeAnalyticsSlide === 'property') setActiveAnalyticsSlide('franchise');
                        else if (activeAnalyticsSlide === 'franchise') setActiveAnalyticsSlide('business');
                      }}
                      disabled={activeAnalyticsSlide === 'business'}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', cursor: activeAnalyticsSlide === 'business' ? 'not-allowed' : 'pointer', opacity: activeAnalyticsSlide === 'business' ? 0.4 : 1, fontSize: '0.8rem', fontWeight: 'bold' }}
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Tabs Row for quick selection */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                  {[
                    { id: 'property', label: 'Properties', color: '#16A34A', bgClass: '#DCFCE7' },
                    { id: 'franchise', label: 'Franchises', color: '#2563EB', bgClass: '#DBEAFE' },
                    { id: 'business', label: 'Businesses', color: '#9333EA', bgClass: '#F3E8FF' }
                  ].map(tab => {
                    const active = activeAnalyticsSlide === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveAnalyticsSlide(tab.id as any)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          border: active ? `2px solid ${tab.color}` : '1px solid #E2E8F0',
                          backgroundColor: active ? tab.bgClass : '#F8FAFC',
                          color: active ? tab.color : '#475569',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.2s'
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic SVG Bar Chart */}
                <div style={{ position: 'relative', height: '200px', width: '100%', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                  {activeAnalyticsSlide === 'property' && (() => {
                    const data = [
                      { label: 'Flats', val: propertiesDb.filter(p => p.category?.toLowerCase() === 'apartment' || p.category?.toLowerCase() === 'flats').length },
                      { label: 'Villas', val: propertiesDb.filter(p => p.category?.toLowerCase() === 'villa').length },
                      { label: 'Houses', val: propertiesDb.filter(p => p.category?.toLowerCase() === 'house' || p.category?.toLowerCase() === 'independent house').length },
                      { label: 'Plots', val: propertiesDb.filter(p => p.category?.toLowerCase() === 'plot' || p.category?.toLowerCase() === 'land').length },
                      { label: 'Commercial', val: propertiesDb.filter(p => p.category?.toLowerCase() === 'commercial').length }
                    ];
                    const maxVal = Math.max(...data.map(d => d.val), 1);
                    return (
                      <svg viewBox="0 0 360 170" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        {/* Grid lines */}
                        <line x1="30" y1="20" x2="350" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="30" y1="65" x2="350" y2="65" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="30" y1="110" x2="350" y2="110" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="30" y1="140" x2="350" y2="140" stroke="#E2E8F0" strokeWidth="1.5" />
                        
                        {/* Y-axis values */}
                        <text x="5" y="24" fontSize="8" fill="#94A3B8" fontWeight="600">{maxVal}</text>
                        <text x="5" y="69" fontSize="8" fill="#94A3B8" fontWeight="600">{Math.round(maxVal * 0.6)}</text>
                        <text x="5" y="114" fontSize="8" fill="#94A3B8" fontWeight="600">{Math.round(maxVal * 0.3)}</text>
                        <text x="5" y="144" fontSize="8" fill="#94A3B8" fontWeight="600">0</text>

                        {data.map((item, idx) => {
                          const barWidth = 32;
                          const x = 50 + idx * 60;
                          const barHeight = (item.val / maxVal) * 110;
                          const y = 140 - barHeight;
                          return (
                            <g key={idx}>
                              <rect x={x} y={y} width={barWidth} height={barHeight} fill="#16A34A" rx="4" ry="4" style={{ transition: 'all 0.5s ease' }} />
                              <text x={x + barWidth/2} y={y - 6} fontSize="8" fontWeight="700" fill="#16A34A" textAnchor="middle">{item.val}</text>
                              <text x={x + barWidth/2} y="154" fontSize="8" fontWeight="600" fill="#475569" textAnchor="middle">{item.label}</text>
                            </g>
                          );
                        })}
                      </svg>
                    );
                  })()}

                  {activeAnalyticsSlide === 'franchise' && (() => {
                    const data = [
                      { label: 'Food/Dining', val: franchiseDb.filter(f => f.type.toLowerCase().includes('food') || f.type.toLowerCase().includes('restaurant')).length },
                      { label: 'Retail/Stores', val: franchiseDb.filter(f => f.type.toLowerCase().includes('retail') || f.type.toLowerCase().includes('store')).length },
                      { label: 'Services', val: franchiseDb.filter(f => f.type.toLowerCase().includes('service')).length },
                      { label: 'Education', val: franchiseDb.filter(f => f.type.toLowerCase().includes('education')).length }
                    ];
                    const maxVal = Math.max(...data.map(d => d.val), 1);
                    return (
                      <svg viewBox="0 0 360 170" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <line x1="30" y1="20" x2="350" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="30" y1="65" x2="350" y2="65" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="30" y1="110" x2="350" y2="110" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="30" y1="140" x2="350" y2="140" stroke="#E2E8F0" strokeWidth="1.5" />
                        
                        <text x="5" y="24" fontSize="8" fill="#94A3B8" fontWeight="600">{maxVal}</text>
                        <text x="5" y="69" fontSize="8" fill="#94A3B8" fontWeight="600">{Math.round(maxVal * 0.6)}</text>
                        <text x="5" y="114" fontSize="8" fill="#94A3B8" fontWeight="600">{Math.round(maxVal * 0.3)}</text>
                        <text x="5" y="144" fontSize="8" fill="#94A3B8" fontWeight="600">0</text>

                        {data.map((item, idx) => {
                          const barWidth = 36;
                          const x = 55 + idx * 75;
                          const barHeight = (item.val / maxVal) * 110;
                          const y = 140 - barHeight;
                          return (
                            <g key={idx}>
                              <rect x={x} y={y} width={barWidth} height={barHeight} fill="#2563EB" rx="4" ry="4" style={{ transition: 'all 0.5s ease' }} />
                              <text x={x + barWidth/2} y={y - 6} fontSize="8" fontWeight="700" fill="#2563EB" textAnchor="middle">{item.val}</text>
                              <text x={x + barWidth/2} y="154" fontSize="8" fontWeight="600" fill="#475569" textAnchor="middle">{item.label}</text>
                            </g>
                          );
                        })}
                      </svg>
                    );
                  })()}

                  {activeAnalyticsSlide === 'business' && (() => {
                    const data = [
                      { label: 'Food/Dining', val: businessDb.filter(b => b.industry.toLowerCase().includes('food')).length },
                      { label: 'Healthcare', val: businessDb.filter(b => b.industry.toLowerCase().includes('health')).length },
                      { label: 'Retail Stores', val: businessDb.filter(b => b.industry.toLowerCase().includes('retail') || b.industry.toLowerCase().includes('store')).length },
                      { label: 'Services', val: businessDb.filter(b => b.industry.toLowerCase().includes('service')).length },
                    ];
                    const maxVal = Math.max(...data.map(d => d.val), 1);
                    return (
                      <svg viewBox="0 0 360 170" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                        <line x1="30" y1="20" x2="350" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="30" y1="65" x2="350" y2="65" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="30" y1="110" x2="350" y2="110" stroke="#F1F5F9" strokeWidth="1" />
                        <line x1="30" y1="140" x2="350" y2="140" stroke="#E2E8F0" strokeWidth="1.5" />
                        
                        <text x="5" y="24" fontSize="8" fill="#94A3B8" fontWeight="600">{maxVal}</text>
                        <text x="5" y="69" fontSize="8" fill="#94A3B8" fontWeight="600">{Math.round(maxVal * 0.6)}</text>
                        <text x="5" y="114" fontSize="8" fill="#94A3B8" fontWeight="600">{Math.round(maxVal * 0.3)}</text>
                        <text x="5" y="144" fontSize="8" fill="#94A3B8" fontWeight="600">0</text>

                        {data.map((item, idx) => {
                          const barWidth = 36;
                          const x = 55 + idx * 75;
                          const barHeight = (item.val / maxVal) * 110;
                          const y = 140 - barHeight;
                          return (
                            <g key={idx}>
                              <rect x={x} y={y} width={barWidth} height={barHeight} fill="#9333EA" rx="4" ry="4" style={{ transition: 'all 0.5s ease' }} />
                              <text x={x + barWidth/2} y={y - 6} fontSize="8" fontWeight="700" fill="#9333EA" textAnchor="middle">{item.val}</text>
                              <text x={x + barWidth/2} y="154" fontSize="8" fontWeight="600" fill="#475569" textAnchor="middle">{item.label}</text>
                            </g>
                          );
                        })}
                      </svg>
                    );
                  })()}
                </div>
              </div>

              {/* Col 2: Recent Activity */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '22px 24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>Recent Activity</span>
                  <button onClick={() => setActiveTab('inquiries')} style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    View All
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flexGrow: 1 }}>
                  {propertiesDb.length === 0 && franchiseDb.length === 0 && businessDb.length === 0 && enquiriesDb.length === 0 ? (
                    <div style={{ padding: '40px 10px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                      No recent activity yet. Added listings and enquiries will appear here.
                    </div>
                  ) : (
                    <>
                      {propertiesDb[0] && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.9rem' }}>
                            <FaHome />
                          </div>
                          <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0F172A' }}>New property added</span>
                              <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600 }}>{propertiesDb[0].createdDate || 'Recently'}</span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '1px' }}>{propertiesDb[0].title} in {propertiesDb[0].city}</div>
                          </div>
                        </div>
                      )}
                      {franchiseDb[0] && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.9rem' }}>
                            <FaStore />
                          </div>
                          <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0F172A' }}>New franchise registered</span>
                              <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600 }}>Recently</span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '1px' }}>{franchiseDb[0].brand} - {franchiseDb[0].city}</div>
                          </div>
                        </div>
                      )}
                      {businessDb[0] && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.9rem' }}>
                            <FaBriefcase />
                          </div>
                          <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0F172A' }}>New business listed</span>
                              <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600 }}>Recently</span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '1px' }}>{businessDb[0].title} - {businessDb[0].location}</div>
                          </div>
                        </div>
                      )}
                      {enquiriesDb[0] && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#FFEDD5', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.9rem' }}>
                            <FaEnvelope />
                          </div>
                          <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0F172A' }}>New lead received</span>
                              <span style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600 }}>{enquiriesDb[0].date || 'Recently'}</span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '1px' }}>{enquiriesDb[0].name} ({enquiriesDb[0].interest})</div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Col 3: Top Performing Locations (Donut / Pie Chart) */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '22px 24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>Top Performing Locations</span>
                  <button onClick={() => setActiveTab('properties')} style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    View All
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexGrow: 1, margin: '8px 0' }}>
                  {/* Donut SVG Graphic */}
                  <div style={{ width: '130px', height: '130px', flexShrink: 0, position: 'relative' }}>
                    {(() => {
                      const countHyd = propertiesDb.filter(p => p.city === 'Hyderabad').length;
                      const countVij = propertiesDb.filter(p => p.city === 'Vijayawada').length;
                      const countGun = propertiesDb.filter(p => p.city === 'Guntur').length;
                      const countBen = propertiesDb.filter(p => p.city === 'Bengaluru').length;
                      const totalLocUnits = countHyd + countVij + countGun + countBen;

                      const totalCirc = 226;
                      const pctHyd = totalLocUnits > 0 ? countHyd / totalLocUnits : 0;
                      const pctVij = totalLocUnits > 0 ? countVij / totalLocUnits : 0;
                      const pctGun = totalLocUnits > 0 ? countGun / totalLocUnits : 0;
                      const pctBen = totalLocUnits > 0 ? countBen / totalLocUnits : 0;

                      const dashHyd = Math.round(pctHyd * totalCirc);
                      const dashVij = Math.round(pctVij * totalCirc);
                      const dashGun = Math.round(pctGun * totalCirc);
                      const dashBen = Math.round(pctBen * totalCirc);

                      return (
                        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                          {totalLocUnits === 0 ? (
                            <circle cx="50" cy="50" r="36" fill="transparent" stroke="#E2E8F0" strokeWidth="20" />
                          ) : (
                            <>
                              {dashHyd > 0 && <circle cx="50" cy="50" r="36" fill="transparent" stroke="#0D9488" strokeWidth="20" strokeDasharray={`${dashHyd} ${totalCirc}`} strokeDashoffset={0} />}
                              {dashVij > 0 && <circle cx="50" cy="50" r="36" fill="transparent" stroke="#10B981" strokeWidth="20" strokeDasharray={`${dashVij} ${totalCirc}`} strokeDashoffset={-dashHyd} />}
                              {dashGun > 0 && <circle cx="50" cy="50" r="36" fill="transparent" stroke="#8B5CF6" strokeWidth="20" strokeDasharray={`${dashGun} ${totalCirc}`} strokeDashoffset={-(dashHyd + dashVij)} />}
                              {dashBen > 0 && <circle cx="50" cy="50" r="36" fill="transparent" stroke="#F97316" strokeWidth="20" strokeDasharray={`${dashBen} ${totalCirc}`} strokeDashoffset={-(dashHyd + dashVij + dashGun)} />}
                            </>
                          )}
                        </svg>
                      );
                    })()}
                  </div>

                  {/* Locations List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1, fontSize: '0.72rem' }}>
                    {propertiesDb.length === 0 && franchiseDb.length === 0 ? (
                      <div style={{ color: '#64748B', fontSize: '0.8rem', padding: '10px 0' }}>No locations recorded yet.</div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#0D9488', fontWeight: 700 }}>● <span style={{ color: '#334155' }}>Hyderabad</span></span>
                          <span style={{ fontWeight: 700, color: '#0F172A' }}>{propertiesDb.filter(p => p.city === 'Hyderabad').length} <span style={{ color: '#94A3B8', fontWeight: 500 }}>units</span></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#10B981', fontWeight: 700 }}>● <span style={{ color: '#334155' }}>Vijayawada</span></span>
                          <span style={{ fontWeight: 700, color: '#0F172A' }}>{propertiesDb.filter(p => p.city === 'Vijayawada').length} <span style={{ color: '#94A3B8', fontWeight: 500 }}>units</span></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#8B5CF6', fontWeight: 700 }}>● <span style={{ color: '#334155' }}>Guntur</span></span>
                          <span style={{ fontWeight: 700, color: '#0F172A' }}>{propertiesDb.filter(p => p.city === 'Guntur').length} <span style={{ color: '#94A3B8', fontWeight: 500 }}>units</span></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#F97316', fontWeight: 700 }}>● <span style={{ color: '#334155' }}>Bengaluru</span></span>
                          <span style={{ fontWeight: 700, color: '#0F172A' }}>{propertiesDb.filter(p => p.city === 'Bengaluru').length} <span style={{ color: '#94A3B8', fontWeight: 500 }}>units</span></span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Footer Pill */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #F1F5F9' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Total Locations</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>{new Set([...propertiesDb.map(p => p.city), ...franchiseDb.map(f => f.city), ...businessDb.map(b => b.location)]).size} Cities</div>
                  </div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                    <FaMapMarkerAlt />
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 3: 2 Columns Grid (Latest Properties Table, System Health & Quick Actions) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '20px', alignItems: 'start' }}>
              
              {/* Col 1: Latest Properties Table */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '22px 24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>Latest Properties</span>
                  <button onClick={() => setActiveTab('properties')} style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    View All
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #F1F5F9', color: '#64748B', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <th style={{ padding: '10px 8px 10px 0' }}>PROPERTY</th>
                        <th style={{ padding: '10px 8px' }}>TYPE</th>
                        <th style={{ padding: '10px 8px' }}>LOCATION</th>
                        <th style={{ padding: '10px 8px' }}>PRICE</th>
                        <th style={{ padding: '10px 8px' }}>STATUS</th>
                        <th style={{ padding: '10px 8px' }}>ADDED ON</th>
                        <th style={{ padding: '10px 0 10px 8px', textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {propertiesDb.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#64748B' }}>
                            No properties added yet. Click "Add Property" to create your first listing.
                          </td>
                        </tr>
                      ) : (
                        propertiesDb.slice(0, 5).map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: idx === 4 ? 'none' : '1px solid #F8FAFC' }}>
                            <td style={{ padding: '12px 8px 12px 0' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src={row.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=150&auto=format&fit=crop&q=80'} alt={row.title} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                                <div>
                                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>{row.title}</div>
                                  <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{row.id}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                              <span style={{ padding: '3px 10px', borderRadius: '6px', backgroundColor: '#DBEAFE', color: '#2563EB', fontWeight: 700, fontSize: '0.7rem' }}>{row.category}</span>
                            </td>
                            <td style={{ padding: '12px 8px', color: '#475569', fontWeight: 500 }}>{row.city}</td>
                            <td style={{ padding: '12px 8px', fontWeight: 700, color: '#0F172A' }}>{row.priceDisplay || ('₹ ' + row.price + ' L')}</td>
                            <td style={{ padding: '12px 8px' }}>
                              <span style={{ padding: '3px 10px', borderRadius: '6px', backgroundColor: '#DCFCE7', color: '#16A34A', fontWeight: 700, fontSize: '0.7rem' }}>{row.listingStatus || 'Active'}</span>
                            </td>
                            <td style={{ padding: '12px 8px', color: '#64748B' }}>{row.createdDate || 'Recently'}</td>
                            <td style={{ padding: '12px 0 12px 8px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button onClick={() => setActiveTab('properties')} title="Edit" style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaEdit /></button>
                                <button onClick={() => setActiveTab('properties')} title="View" style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaEye /></button>
                                <button onClick={() => setActiveTab('properties')} title="More" style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaEllipsisV /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Col 2: System Health & Quick Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Card 1: System Health */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '22px 24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>System Health</span>
                    <button onClick={() => setActiveTab('customization')} style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      View All
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#475569', fontWeight: 500 }}>Server Uptime</span>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>99.9%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '99.9%', height: '100%', backgroundColor: '#16A34A' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#475569', fontWeight: 500 }}>Website Performance</span>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>95%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '95%', height: '100%', backgroundColor: '#16A34A' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                      <span style={{ color: '#475569', fontWeight: 500 }}>Database Status</span>
                      <span style={{ fontWeight: 700, color: '#16A34A' }}>Healthy</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
                      <span style={{ color: '#475569', fontWeight: 500 }}>SSL Certificate</span>
                      <span style={{ fontWeight: 700, color: '#16A34A' }}>Valid</span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ color: '#475569', fontWeight: 500 }}>Storage Usage</span>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>72%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: '72%', height: '100%', backgroundColor: '#16A34A' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Quick Actions */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '22px 24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.03)' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                    Quick Actions
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    <button
                      onClick={() => setActiveTab('properties')}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 6px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                        <FaBuilding />
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0F172A', textAlign: 'center' }}>Add Property</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('franchises')}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 6px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FFEDD5', color: '#EA580C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                        <FaStore />
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0F172A', textAlign: 'center' }}>Add Franchise</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('businesses')}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 6px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#F3E8FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                        <FaBriefcase />
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0F172A', textAlign: 'center' }}>Add Business</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('brokers')}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 6px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                        <FaUserTie />
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0F172A', textAlign: 'center' }}>Add Broker</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================= CATEGORY 1: CUSTOMIZATION & ANALYTICS ================= */}
        {activeTab === 'customization' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Clean Sample Data Banner */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px 28px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', letterSpacing: '0.04em' }}>DATABASE PURGE CONTROL</h3>
                <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '0.85rem' }}>Remove all static demo properties and franchises to start with a completely clean slate.</p>
              </div>
              <button
                onClick={handleClearStaticData}
                style={{ padding: '10px 20px', backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.05em' }}
              >
                <FaTrash /> REMOVE STATIC DATA
              </button>
            </div>

            <form onSubmit={handleSaveSettings} style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Prominent Executive Card for Main Center Video */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '28px', color: '#0F172A', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ backgroundColor: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', padding: '4px 12px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>MAIN CENTER VIDEO</span>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', letterSpacing: '0.04em' }}>🎬 16:9 SHOWCASE VIDEO FEED</h3>
                </div>
                <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                  This video displays continuously on the main website center between the Hero banner and Browse by Category. Upload an exact 16:9 widescreen video (e.g. 1920x1080 or 1280x720 MP4).
                </p>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#334155', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>DIRECT VIDEO URL OR UPLOAD MP4 FILE</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      value={settingsForm.promotionalVideoUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, promotionalVideoUrl: e.target.value })}
                      placeholder="https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-building-exterior-41580-large.mp4"
                      style={{ flexGrow: 1, padding: '12px 16px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#0F172A', fontSize: '0.95rem', outline: 'none' }}
                    />
                    <label style={{ padding: '12px 24px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', transition: 'all 0.2s', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.06em' }}>
                      📁 UPLOAD MP4
                      <input
                        type="file"
                        accept="video/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, (list) => { if (list[0]) setSettingsForm({ ...settingsForm, promotionalVideoUrl: list[0] }); })}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: 0, fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', color: '#0F172A', letterSpacing: '0.04em' }}>HERO SECTION BRANDING & COLORS</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>PRIMARY BRAND ACCENT COLOR</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={settingsForm.primaryColor}
                      onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                      style={{ width: '50px', height: '44px', padding: 0, border: '1px solid #E2E8F0', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={settingsForm.primaryColor}
                      onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                      style={{ flexGrow: 1, padding: '12px 16px', border: '1px solid #E2E8F0', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>HERO BACKGROUND IMAGE (URL OR UPLOAD)</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      value={settingsForm.heroBgUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroBgUrl: e.target.value })}
                      placeholder="/assets/hero_villa.jpg"
                      style={{ flexGrow: 1, padding: '12px 16px', border: '1px solid #E2E8F0', fontSize: '0.95rem' }}
                    />
                    <label style={{ padding: '12px 16px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>
                      <FaUpload /> UPLOAD
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, (list) => { if (list[0]) setSettingsForm({ ...settingsForm, heroBgUrl: list[0] }); })}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>MAIN HERO TITLE</label>
                <input
                  type="text"
                  value={settingsForm.heroTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', fontSize: '1rem', fontWeight: 600 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>HERO SUBTITLE TEXT</label>
                <textarea
                  rows={2}
                  value={settingsForm.heroSubtitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', fontSize: '0.95rem' }}
                />
              </div>

              <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: '12px 0 0 0', fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', color: '#0F172A', letterSpacing: '0.04em' }}>MANAGE DEFAULT CITIES / LOCATIONS</h3>
              <p style={{ margin: '-16px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>Add or remove locations that appear in the website navigation location filter dropdown.</p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Add new city (e.g. Kolkata, Ahmedabad, Goa)"
                  value={newCityInput}
                  onChange={(e) => setNewCityInput(e.target.value)}
                  style={{ flexGrow: 1, padding: '12px 16px', border: '1px solid #E2E8F0', fontSize: '0.95rem' }}
                />
                <button
                  type="button"
                  onClick={handleAddCity}
                  style={{ padding: '12px 24px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.06em' }}
                >
                  + ADD CITY
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', backgroundColor: '#F8FAFC', padding: '16px', border: '1px solid #E2E8F0' }}>
                {(settingsForm.availableCities || ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Chennai', 'Pune']).map((city) => (
                  <div key={city} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF', border: '1px solid #1E40AF', color: '#1E40AF', padding: '6px 14px', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span>📍 {city}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCity(city)}
                      style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontWeight: 800, fontSize: '1rem', padding: '0 2px' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: '12px 0 0 0', fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', color: '#0F172A', letterSpacing: '0.04em' }}>PUBLIC ANALYTICS COUNTER METRICS</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', color: '#64748B', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>ACTIVE LISTINGS</label>
                  <input
                    type="number"
                    value={settingsForm.analytics.activeListings}
                    onChange={(e) => setSettingsForm({ ...settingsForm, analytics: { ...settingsForm.analytics, activeListings: Number(e.target.value) } })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', fontSize: '1.1rem', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', color: '#64748B', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>HAPPY CUSTOMERS</label>
                  <input
                    type="number"
                    value={settingsForm.analytics.happyClients}
                    onChange={(e) => setSettingsForm({ ...settingsForm, analytics: { ...settingsForm.analytics, happyClients: Number(e.target.value) } })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', fontSize: '1.1rem', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', color: '#64748B', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>DEALS CLOSED</label>
                  <input
                    type="number"
                    value={settingsForm.analytics.dealsClosed}
                    onChange={(e) => setSettingsForm({ ...settingsForm, analytics: { ...settingsForm.analytics, dealsClosed: Number(e.target.value) } })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', fontSize: '1.1rem', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', color: '#64748B', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>TOTAL VISITORS</label>
                  <input
                    type="number"
                    value={settingsForm.analytics.totalVisitors}
                    onChange={(e) => setSettingsForm({ ...settingsForm, analytics: { ...settingsForm.analytics, totalVisitors: Number(e.target.value) } })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', fontSize: '1.1rem', fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
                <button type="submit" style={{ padding: '14px 32px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.08em' }}>
                  SAVE ALL CUSTOMIZATIONS
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= CATEGORY: MAIN STATS ONLY ================= */}
        {activeTab === 'main_stats' && (
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Header banner */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '5px solid #1E40AF', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span style={{ backgroundColor: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', padding: '5px 14px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>Live Stats Control</span>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: '10px 0 6px 0', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Main Page Stats & Trust Metrics</h2>
                <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>Configure the live front-end Hero stats bar (18,500+ Properties, etc.), trust badges and custom metrics.</p>
              </div>
              <button type="submit" style={{ padding: '14px 32px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <FaCheckCircle /> Save & Publish Live Stats
              </button>
            </div>

            {/* 1. MAIN HOMEPAGE STATS BAR & TRUST METRICS (LIVE EDITING) */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid #E2E8F0', borderTop: '4px solid #16A34A', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800 }}>
                  📊
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '0.03em' }}>
                    1. MAIN HOMEPAGE STATS BAR & TRUST METRICS (LIVE EDITING)
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#64748B' }}>
                    Change any number or text here to immediately update the 6 stat cards displayed at the top of the main home page!
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
                {/* Stat 1: Properties Listed */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#16A34A' }}>
                    <span>🏠 Properties Listed Stat</span>
                  </label>
                  <input
                    type="text"
                    value={currentMainStats.propertiesListed}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      mainPageStats: {
                        ...currentMainStats,
                        propertiesListed: e.target.value
                      }
                    })}
                    placeholder="e.g. 18,500+"
                    style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', boxSizing: 'border-box' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>Displayed in 1st green stat box on Home.</span>
                </div>

                {/* Stat 2: Franchises */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#9333EA' }}>
                    <span>🏪 Franchises Stat</span>
                  </label>
                  <input
                    type="text"
                    value={currentMainStats.franchisesCount}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      mainPageStats: {
                        ...currentMainStats,
                        franchisesCount: e.target.value
                      }
                    })}
                    placeholder="e.g. 950+"
                    style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', boxSizing: 'border-box' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>Displayed in 2nd purple stat box on Home.</span>
                </div>

                {/* Stat 3: Verified Brokers */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#EA580C' }}>
                    <span>👥 Verified Brokers Stat</span>
                  </label>
                  <input
                    type="text"
                    value={currentMainStats.verifiedBrokers}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      mainPageStats: {
                        ...currentMainStats,
                        verifiedBrokers: e.target.value
                      }
                    })}
                    placeholder="e.g. 2,400+"
                    style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', boxSizing: 'border-box' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>Displayed in 3rd orange stat box on Home.</span>
                </div>

                {/* Stat 4: Cities Covered */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#2563EB' }}>
                    <span>🏙️ Cities Covered Stat</span>
                  </label>
                  <input
                    type="text"
                    value={currentMainStats.citiesCovered}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      mainPageStats: {
                        ...currentMainStats,
                        citiesCovered: e.target.value
                      }
                    })}
                    placeholder="e.g. 32"
                    style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', boxSizing: 'border-box' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>Displayed in 4th blue stat box on Home.</span>
                </div>

                {/* Stat 5: Total Property Value */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#DB2777' }}>
                    <span>💰 Total Property Value Stat</span>
                  </label>
                  <input
                    type="text"
                    value={currentMainStats.totalPropertyValue}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      mainPageStats: {
                        ...currentMainStats,
                        totalPropertyValue: e.target.value
                      }
                    })}
                    placeholder="e.g. ₹850 Cr+"
                    style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', boxSizing: 'border-box' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>Displayed in 5th pink stat box on Home.</span>
                </div>

                {/* Stat 6: Happy Clients */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#16A34A' }}>
                    <span>😊 Happy Clients Stat</span>
                  </label>
                  <input
                    type="text"
                    value={currentMainStats.happyClients}
                    onChange={(e) => setSettingsForm({
                      ...settingsForm,
                      mainPageStats: {
                        ...currentMainStats,
                        happyClients: e.target.value
                      }
                    })}
                    placeholder="e.g. 15K+"
                    style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', boxSizing: 'border-box' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>Displayed in 6th green stat box on Home.</span>
                </div>
              </div>

              {/* WHY VENTURO SECTION STATS */}
              <div style={{ borderTop: '1px dashed #CBD5E1', paddingTop: '20px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', color: '#334155', fontWeight: 700 }}>
                  Why Venturo / Section Stats (Secondary Metrics)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#475569', marginBottom: '6px' }}>Active Listings</label>
                    <input
                      type="text"
                      value={currentMainStats.activeListingsWhy || '10,000+'}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        mainPageStats: {
                          ...currentMainStats,
                          activeListingsWhy: e.target.value
                        }
                      })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#475569', marginBottom: '6px' }}>Happy Customers</label>
                    <input
                      type="text"
                      value={currentMainStats.happyCustomersWhy || '5,000+'}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        mainPageStats: {
                          ...currentMainStats,
                          happyCustomersWhy: e.target.value
                        }
                      })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#475569', marginBottom: '6px' }}>Cities Covered</label>
                    <input
                      type="text"
                      value={currentMainStats.citiesCoveredWhy || '50+'}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        mainPageStats: {
                          ...currentMainStats,
                          citiesCoveredWhy: e.target.value
                        }
                      })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#475569', marginBottom: '6px' }}>Verified %</label>
                    <input
                      type="text"
                      value={currentMainStats.verifiedListingsWhy || '100%'}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        mainPageStats: {
                          ...currentMainStats,
                          verifiedListingsWhy: e.target.value
                        }
                      })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#475569', marginBottom: '6px' }}>Support</label>
                    <input
                      type="text"
                      value={currentMainStats.customerSupportWhy || '24/7'}
                      onChange={(e) => setSettingsForm({
                        ...settingsForm,
                        mainPageStats: {
                          ...currentMainStats,
                          customerSupportWhy: e.target.value
                        }
                      })}
                      style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="submit" style={{ padding: '16px 36px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.08em' }}>
                <FaCheckCircle /> SAVE & PUBLISH LIVE STATS
              </button>
            </div>
          </form>
        )}

        {/* ================= CATEGORY: HOMEPAGE CMS BUILDER ONLY ================= */}
        {activeTab === 'hero_cms' && (
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Header banner */}
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderLeft: '5px solid #1E40AF', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span style={{ backgroundColor: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', padding: '5px 14px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>Homepage Builder</span>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.65rem', fontWeight: 700, color: '#0F172A', margin: '10px 0 6px 0', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Homepage Builder Studio</h2>
                <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>Configure the Hero section backgrounds, headings, tags and promotional layouts.</p>
              </div>
              <button type="submit" style={{ padding: '14px 32px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                <FaCheckCircle /> Save & Apply Hero Customizations
              </button>
            </div>

            {/* 2. RIGHT SIDE VISUAL MEDIA SETUP */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', border: '1px solid #1E40AF', backgroundColor: '#EFF6FF', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  <FaVideo />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', letterSpacing: '0.05em' }}>RIGHT-SIDE HERO MEDIA DISPLAY</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>Choose whether to display a high-resolution photo or an engaging video loop on the right side of the Hero banner.</p>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px', color: '#1E40AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>SELECT MEDIA DISPLAY TYPE</label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label
                    onClick={() => setSettingsForm({ ...settingsForm, heroMediaType: 'image' })}
                    style={{
                      flex: 1, padding: '22px', border: settingsForm.heroMediaType !== 'video' ? '2px solid #1E40AF' : '1px solid #E2E8F0',
                      backgroundColor: settingsForm.heroMediaType !== 'video' ? '#EFF6FF' : '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s'
                    }}
                  >
                    <input type="radio" checked={settingsForm.heroMediaType !== 'video'} onChange={() => setSettingsForm({ ...settingsForm, heroMediaType: 'image' })} style={{ accentColor: '#1E40AF' }} />
                    <div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#0F172A' }}>📷 STATIC PHOTO / IMAGE</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px', lineHeight: 1.5 }}>Displays a crisp luxury architectural or property image with hover effect.</div>
                    </div>
                  </label>

                  <label
                    onClick={() => setSettingsForm({ ...settingsForm, heroMediaType: 'video' })}
                    style={{
                      flex: 1, padding: '22px', border: settingsForm.heroMediaType === 'video' ? '2px solid #1E40AF' : '1px solid #E2E8F0',
                      backgroundColor: settingsForm.heroMediaType === 'video' ? '#EFF6FF' : '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s'
                    }}
                  >
                    <input type="radio" checked={settingsForm.heroMediaType === 'video'} onChange={() => setSettingsForm({ ...settingsForm, heroMediaType: 'video' })} style={{ accentColor: '#1E40AF' }} />
                    <div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#0F172A' }}>🎬 AUTOPLAY VIDEO LOOP</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px', lineHeight: 1.5 }}>Streams a dynamic architectural video loop on the right column.</div>
                    </div>
                  </label>
                </div>
              </div>

              {settingsForm.heroMediaType !== 'video' ? (
                <div style={{ backgroundColor: '#F8FAFC', padding: '24px', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.05em' }}>HERO BACKGROUND PHOTO</label>
                  
                  {settingsForm.heroBgUrl && (
                    <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#E2E8F0', position: 'relative', marginBottom: '16px' }}>
                      <img src={settingsForm.heroBgUrl} alt="Hero Background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => setSettingsForm({ ...settingsForm, heroBgUrl: '' })}
                        style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setSettingsForm({ ...settingsForm, heroBgUrl: ev.target?.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    onClick={() => document.getElementById('hero-bg-file-input')?.click()}
                    style={{
                      border: '2px dashed #CBD5E1',
                      borderRadius: '12px',
                      padding: '24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#475569',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div>Drag & Drop or Click to Upload Hero Photo</div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>PNG, JPG, or WEBP</div>
                    <input
                      id="hero-bg-file-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, (list) => { if (list[0]) setSettingsForm({ ...settingsForm, heroBgUrl: list[0] }); })}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: '#F8FAFC', padding: '24px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.05em' }}>HERO VIDEO URL (DIRECT MP4 URL)</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      value={settingsForm.heroVideoUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroVideoUrl: e.target.value })}
                      placeholder="https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-building-exterior-41580-large.mp4"
                      style={{ flexGrow: 1, padding: '12px 16px', border: '1px solid #CBD5E1', fontSize: '0.95rem', backgroundColor: '#FFFFFF' }}
                    />
                    <label style={{ padding: '12px 24px', backgroundColor: '#1E40AF', color: '#FFFFFF', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.06em' }}>
                      <FaUpload /> UPLOAD VIDEO
                      <input
                        type="file"
                        accept="video/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileUpload(e, (list) => { if (list[0]) setSettingsForm({ ...settingsForm, heroVideoUrl: list[0] }); })}
                      />
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>QUICK VIDEO PRESETS:</span>
                    <button type="button" onClick={() => setSettingsForm({ ...settingsForm, heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-building-exterior-41580-large.mp4" })} style={{ padding: '6px 12px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', color: '#1E40AF' }}>Apartment Exterior</button>
                    <button type="button" onClick={() => setSettingsForm({ ...settingsForm, heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-living-room-with-modern-decor-41575-large.mp4" })} style={{ padding: '6px 12px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', color: '#1E40AF' }}>Luxury Interior</button>
                    <button type="button" onClick={() => setSettingsForm({ ...settingsForm, heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-business-people-meeting-in-a-conference-room-42867-large.mp4" })} style={{ padding: '6px 12px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', color: '#1E40AF' }}>Enterprise Acquisitions</button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. TYPOGRAPHY & CONTENT MATTER */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', border: '1px solid #1E40AF', backgroundColor: '#EFF6FF', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  <FaEdit />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', letterSpacing: '0.05em' }}>CONTENT MATTER & HEADINGS</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>Customize the headline and description matter displayed on the left column of the Hero banner.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#334155', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>MAIN HERO HEADING TEXT</label>
                  <input
                    type="text"
                    value={settingsForm.heroTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                    placeholder="Your Next Opportunity"
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', fontSize: '1rem', fontWeight: 600 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#1E40AF', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>HIGHLIGHTED ACCENT WORDS</label>
                  <input
                    type="text"
                    value={settingsForm.heroHighlightText || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroHighlightText: e.target.value })}
                    placeholder="One Click Away"
                    style={{ width: '100%', padding: '12px 16px', border: '2px solid #1E40AF', fontSize: '1rem', fontWeight: 700, color: '#1E40AF' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#334155', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>HERO SUBTITLE & DESCRIPTION MATTER</label>
                <textarea
                  rows={3}
                  value={settingsForm.heroSubtitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', fontSize: '0.95rem', lineHeight: 1.6 }}
                />
              </div>
            </div>

            {/* 3. INTERACTIVE SEARCH & POPULAR TAGS */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', border: '1px solid #1E40AF', backgroundColor: '#EFF6FF', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  <FaSearch />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', letterSpacing: '0.05em' }}>SEARCH ENGINE & POPULAR TAGS</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>Add or remove quick-click search tags below the search bar to guide user discovery.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Add new popular search tag (e.g. Penthouse, 3 BHK, Franchise, Commercial)"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  style={{ flexGrow: 1, padding: '12px 16px', border: '1px solid #E2E8F0', fontSize: '0.95rem' }}
                />
                <button
                  type="button"
                  onClick={handleAddPopularTag}
                  style={{ padding: '12px 24px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.06em' }}
                >
                  + ADD SEARCH TAG
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', backgroundColor: '#F8FAFC', padding: '18px', border: '1px solid #E2E8F0' }}>
                {(settingsForm.heroPopularTags || ['Apartment', 'Villa', 'Franchise', 'Commercial Property']).map((tag) => (
                  <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF', border: '1px solid #1E40AF', color: '#1E40AF', padding: '6px 14px', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span>🏷️ {tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePopularTag(tag)}
                      style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontWeight: 800, fontSize: '1rem', padding: '0 2px' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. TRUST BADGES & METRICS */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '32px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', border: '1px solid #1E40AF', backgroundColor: '#EFF6FF', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  <FaCheckCircle />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', letterSpacing: '0.05em' }}>FLOATING BADGES & LIVE METRICS</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>Customize the floating trust badges surrounding the right column media.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#334155', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>HAPPY CUSTOMERS COUNT</label>
                  <input
                    type="number"
                    value={settingsForm.analytics.happyClients}
                    onChange={(e) => setSettingsForm({ ...settingsForm, analytics: { ...settingsForm.analytics, happyClients: Number(e.target.value) } })}
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', fontSize: '1rem', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#334155', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>LEFT ACTION BADGE LABEL</label>
                  <input
                    type="text"
                    value={settingsForm.heroBadge1Text || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge1Text: e.target.value })}
                    placeholder="View More Pics"
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', fontSize: '0.95rem', fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: '#334155', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>RIGHT VERIFIED BADGE LABEL</label>
                  <input
                    type="text"
                    value={settingsForm.heroBadge2Text || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge2Text: e.target.value })}
                    placeholder="Verified Genuine Listings"
                    style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', fontSize: '0.95rem', fontWeight: 600 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" style={{ padding: '16px 36px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.08em' }}>
                <FaCheckCircle /> SAVE & APPLY HERO CUSTOMIZATIONS
              </button>
            </div>
          </form>
        )}

        {/* ================= CATEGORY 3: PROPERTY MANAGEMENT SYSTEM ================= */}
        {activeTab === 'properties' && (
          <PropertyManagementSystem showNotification={showNotification} activeSubTab={propertySubTab} onSubTabChange={setPropertySubTab} />
        )}


        {/* ================= CATEGORY 4: FRANCHISES MANAGEMENT ================= */}
        {activeTab === 'franchises' && (
          <FranchiseManagementSystem showNotification={showNotification} activeSubTab={franchiseSubTab} onSubTabChange={setFranchiseSubTab} mode="franchise" />
        )}

        {/* ================= CATEGORY 4.2: BUSINESS MANAGEMENT ================= */}
        {activeTab === 'businesses' && (
          <FranchiseManagementSystem showNotification={showNotification} activeSubTab={businessSubTab} onSubTabChange={setBusinessSubTab} mode="business" />
        )}

        {/* ================= CATEGORY 4.5: BROKER MANAGEMENT SYSTEM ================= */}
        {activeTab === 'brokers' && (
          <BrokerManagementSystem showNotification={showNotification} activeSubTab={brokerSubTab} onSubTabChange={setBrokerSubTab} />
        )}

        {/* ================= CATEGORY 5: CONTACT INQUIRIES ================= */}
        {activeTab === 'inquiries' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {enquiriesDb.length === 0 ? (
              <div style={{ backgroundColor: '#FFFFFF', padding: '60px', textAlign: 'center', border: '1px solid #E2E8F0', color: '#64748B', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.1rem', fontWeight: 700 }}>
                NO CUSTOMER INQUIRIES RECEIVED YET.
              </div>
            ) : (
              enquiriesDb.map(enq => (
                <div key={enq.id} style={{ backgroundColor: '#FFFFFF', padding: '20px 24px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                      <h4 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', letterSpacing: '0.03em' }}>{enq.customerName}</h4>
                      <span style={{ padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: enq.status === 'New' ? '#FEE2E2' : '#EFF6FF', color: enq.status === 'New' ? '#DC2626' : '#1E40AF', border: enq.status === 'New' ? '1px solid #FECACA' : '1px solid #BFDBFE', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>{enq.status.toUpperCase()}</span>
                      <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{enq.date}</span>
                    </div>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#475569' }}>Inquired about: <strong style={{ color: '#0F172A' }}>{enq.listingTitle}</strong></p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>📞 {enq.phone} • ✉️ {enq.email}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <select
                      value={enq.status}
                      onChange={e => updateEnquiryStatus(enq.id, e.target.value as any)}
                      style={{ padding: '8px 14px', border: '1px solid #E2E8F0', fontWeight: 700, fontSize: '0.85rem', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}
                    >
                      <option value="New">STATUS: NEW</option>
                      <option value="Contacted">STATUS: CONTACTED</option>
                      <option value="Follow-up">STATUS: FOLLOW-UP</option>
                      <option value="Closed">STATUS: CLOSED</option>
                    </select>
                    <button
                      onClick={() => deleteEnquiry(enq.id)}
                      style={{ padding: '8px 14px', backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', cursor: 'pointer' }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'team' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '28px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', letterSpacing: '0.04em' }}>ADD NEW EXECUTIVE LEADERSHIP PROFILE</h3>
              <p style={{ margin: '0 0 20px 0', color: '#64748B', fontSize: '0.85rem' }}>Profiles added here will appear dynamically on the public About Us page.</p>
              
              <form onSubmit={handleAddTeamMember} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', color: '#334155', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={newTeamMember.name}
                    onChange={e => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', color: '#334155', fontFamily: "'Playfair Display', 'Cinzel', 'Georgia', serif" }}>DESIGNATION / TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Managing Director & CEO"
                    value={newTeamMember.designation}
                    onChange={e => setNewTeamMember({ ...newTeamMember, designation: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', color: '#334155', fontFamily: "'Playfair Display', 'Cinzel', 'Georgia', serif" }}>PHOTO URL (OR LEAVE BLANK)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newTeamMember.photo}
                    onChange={e => setNewTeamMember({ ...newTeamMember, photo: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', color: '#334155', fontFamily: "'Playfair Display', 'Cinzel', 'Georgia', serif" }}>PHONE NUMBER (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newTeamMember.phone || ''}
                    onChange={e => setNewTeamMember({ ...newTeamMember, phone: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px', color: '#334155', fontFamily: "'Playfair Display', 'Cinzel', 'Georgia', serif" }}>LINKEDIN PROFILE URL (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/..."
                    value={newTeamMember.linkedin || ''}
                    onChange={e => setNewTeamMember({ ...newTeamMember, linkedin: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <button
                    type="submit"
                    style={{ padding: '14px 24px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: "'Playfair Display', 'Cinzel', 'Georgia', serif", letterSpacing: '0.06em' }}
                  >
                    <FaPlus /> ADD LEADERSHIP PROFILE
                  </button>
                </div>
              </form>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '28px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Georgia', serif", margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', letterSpacing: '0.04em' }}>CURRENT LEADERSHIP PROFILES ({teamMembersDb.length})</h3>
              
              {teamMembersDb.length === 0 ? (
                <p style={{ color: '#64748B', fontStyle: 'italic' }}>No profiles added yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {teamMembersDb.map((tm) => (
                    <div key={tm.id} style={{ border: '1px solid #E2E8F0', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={tm.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80'} alt={tm.name} style={{ width: '64px', height: '64px', objectFit: 'cover', border: '1px solid #E2E8F0' }} />
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <h4 style={{ fontFamily: "'Playfair Display', 'Cinzel', 'Georgia', serif", margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tm.name}</h4>
                        <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#1E40AF', fontWeight: 700, fontFamily: "'Playfair Display', 'Cinzel', 'Georgia', serif" }}>{tm.designation.toUpperCase()}</p>
                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: '#64748B' }}>
                          {tm.phone && <span>{tm.phone}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTeamMember(tm.id, tm.name)}
                        style={{ padding: '10px', backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', cursor: 'pointer' }}
                        title="Delete Profile"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL: EDIT PROPERTY ================= */}
      {editingProperty && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div data-lenis-prevent="true" style={{ backgroundColor: '#FFFFFF', padding: '36px', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: '0 0 24px 0', fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', letterSpacing: '0.04em' }}>EDIT PROPERTY LISTING</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>TITLE</label>
                <input type="text" value={editingProperty.title} onChange={e => setEditingProperty({ ...editingProperty, title: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>CATEGORY</label>
                  <select value={editingProperty.category} onChange={e => setEditingProperty({ ...editingProperty, category: e.target.value as any })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }}>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>ASSIGN BROKER</label>
                  <select value={editingProperty.dealerId} onChange={e => setEditingProperty({ ...editingProperty, dealerId: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }}>
                    {dealersDb.map(d => <option key={d.id} value={d.id}>{d.companyName} ({d.fullName || 'Partner'}) — ⭐ {d.rating} {d.premiumPartner ? '👑 [PREMIUM]' : ''}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>PRICE DISPLAY LABEL</label>
                  <input type="text" value={editingProperty.priceDisplay} onChange={e => setEditingProperty({ ...editingProperty, priceDisplay: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>CITY</label>
                  <input type="text" value={editingProperty.city} onChange={e => setEditingProperty({ ...editingProperty, city: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>UPLOAD / ADD MORE PHOTOS</label>
                <label style={{ display: 'block', padding: '16px', textAlign: 'center', border: '1px dashed #1E40AF', cursor: 'pointer', backgroundColor: '#F8FAFC', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>
                  CLICK TO SELECT NEW PHOTOS
                  <input type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, list => { if (list.length) setEditingProperty({ ...editingProperty, image: list[0], images: list }); })} />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button onClick={() => setEditingProperty(null)} style={{ padding: '12px 24px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>CANCEL</button>
                <button onClick={() => { updateProperty(editingProperty.id, editingProperty); setEditingProperty(null); showNotification("Property details updated."); }} style={{ padding: '12px 28px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.06em' }}>SAVE CHANGES</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT FRANCHISE ================= */}
      {editingFranchise && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div data-lenis-prevent="true" style={{ backgroundColor: '#FFFFFF', padding: '36px', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: '0 0 24px 0', fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', letterSpacing: '0.04em' }}>EDIT FRANCHISE OPPORTUNITY</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>BRAND NAME</label>
                <input type="text" value={editingFranchise.brand} onChange={e => setEditingFranchise({ ...editingFranchise, brand: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>CATEGORY</label>
                  <select value={editingFranchise.category} onChange={e => setEditingFranchise({ ...editingFranchise, category: e.target.value as any, type: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }}>
                    <option value="Cafe & Restaurant">Cafe & Restaurant</option>
                    <option value="Retail & Fashion">Retail & Fashion</option>
                    <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                    <option value="Education & Training">Education & Training</option>
                    <option value="Automotive & Services">Automotive & Services</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>ASSIGN BROKER</label>
                  <select value={editingFranchise.dealerId} onChange={e => setEditingFranchise({ ...editingFranchise, dealerId: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }}>
                    {dealersDb.map(d => <option key={d.id} value={d.id}>{d.companyName} ({d.fullName || 'Partner'}) — ⭐ {d.rating} {d.premiumPartner ? '👑 [PREMIUM]' : ''}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>INVESTMENT LABEL</label>
                  <input type="text" value={editingFranchise.investmentDisplay} onChange={e => setEditingFranchise({ ...editingFranchise, investmentDisplay: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>LOCATION</label>
                  <input type="text" value={editingFranchise.location} onChange={e => setEditingFranchise({ ...editingFranchise, location: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button onClick={() => setEditingFranchise(null)} style={{ padding: '12px 24px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>CANCEL</button>
                <button onClick={() => { updateFranchise(editingFranchise.id, editingFranchise); setEditingFranchise(null); showNotification("Franchise details updated."); }} style={{ padding: '12px 28px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.06em' }}>SAVE CHANGES</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT BROKER ================= */}
      {editingBroker && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div data-lenis-prevent="true" style={{ backgroundColor: '#FFFFFF', padding: '36px', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", margin: '0 0 24px 0', fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', letterSpacing: '0.04em' }}>EDIT BROKER / PARTNER PROFILE</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>AGENCY / BROKER NAME</label>
                <input type="text" value={editingBroker.companyName} onChange={e => setEditingBroker({ ...editingBroker, companyName: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>SPECIALIZATION</label>
                  <input type="text" value={editingBroker.specialization} onChange={e => setEditingBroker({ ...editingBroker, specialization: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>YEARS EXPERIENCE</label>
                  <input type="number" value={editingBroker.yearsExperience} onChange={e => setEditingBroker({ ...editingBroker, yearsExperience: Number(e.target.value) })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>PHONE NUMBER</label>
                  <input type="text" value={editingBroker.phone} onChange={e => setEditingBroker({ ...editingBroker, phone: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>EMAIL ADDRESS</label>
                  <input type="email" value={editingBroker.email} onChange={e => setEditingBroker({ ...editingBroker, email: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '8px', color: '#475569', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>UPLOAD NEW PROFILE PHOTO</label>
                <label style={{ display: 'block', padding: '16px', textAlign: 'center', border: '1px dashed #1E40AF', cursor: 'pointer', backgroundColor: '#F8FAFC', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>
                  CLICK TO CHANGE BROKER PHOTO
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileUpload(e, list => { if (list[0]) setEditingBroker({ ...editingBroker, photo: list[0] }); })} />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button onClick={() => setEditingBroker(null)} style={{ padding: '12px 24px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>CANCEL</button>
                <button onClick={() => { updateDealer(editingBroker.id, editingBroker); setEditingBroker(null); showNotification("Broker profile updated successfully!"); }} style={{ padding: '12px 28px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.06em' }}>SAVE PROFILE</button>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
export default AdminPanel;
