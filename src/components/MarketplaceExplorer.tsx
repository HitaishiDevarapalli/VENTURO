import React, { useState, useMemo, useEffect } from 'react';
import { 
  dealersDb, 
  propertiesDb, 
  franchiseDb, 
  businessDb, 
  insuranceDb, 
  servicesDb
} from '../db/marketplaceDb';
import type { 
  Dealer,
  PropertyListing
} from '../db/marketplaceDb';
import AdminPanel from './AdminPanel';
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaFilter, 
  FaMap, 
  FaThLarge, 
  FaColumns, 
  FaUserTie, 
  FaShieldAlt, 
  FaMapSigns, 
  FaCompass, 
  FaLayerGroup,
  FaRedo,
  FaCalculator,
  FaGraduationCap,
  FaHospital,
  FaRegBookmark,
  FaBookmark,
  FaTrash,
  FaPlus,
  FaChartLine
} from 'react-icons/fa';

export const MarketplaceExplorer: React.FC = () => {
  // Navigation tabs
  const [activeMarket, setActiveMarket] = useState<'properties' | 'franchises' | 'businesses' | 'finance' | 'admin'>('properties');
  
  // Layout Toggle State
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'split'>('split');
  
  // Refresh State for database mutations
  const [dbTick, setDbTick] = useState(0);
  const triggerRefresh = () => setDbTick(prev => prev + 1);

  // Saved / Bookmarked Properties ID array state
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  
  // Compare list
  const [compareList, setCompareList] = useState<PropertyListing[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Active User / Seller Role State for Dashboard Simulation
  const [sellerModeActive, setSellerModeActive] = useState(false);

  // Detail Page sheet state overlay
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState<PropertyListing | null>(null);

  // Active chat state overlay
  const [activeChatDealer, setActiveChatDealer] = useState<Dealer | null>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: 'buyer' | 'seller'; text: string; time: string }[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Seller Dashboard addition form state
  const [newPropertyForm, setNewPropertyForm] = useState({
    title: '',
    description: '',
    category: 'Apartment' as 'Apartment' | 'Villa' | 'Plot',
    subType: '2 BHK',
    price: 60,
    areaSqFt: '1400 Sq Ft',
    state: 'Telangana',
    city: 'Hyderabad',
    area: 'Gachibowli',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'
  });

  // EMI Calculator internal parameters state
  const [emiVal, setEmiVal] = useState({
    loanAmt: 80, // in Lakhs
    interestRate: 8.5,
    tenureYears: 20
  });

  // Search History tracking state for Recommendation Engine
  const [searchHistoryTypes, setSearchHistoryTypes] = useState<string[]>([]);

  // Listen to select-property-category event from PropertyCategories
  useEffect(() => {
    const handleSelectCategory = (e: Event) => {
      const category = (e as CustomEvent).detail;
      setSelectedType(category);
      setActiveMarket('properties');
    };
    window.addEventListener('select-property-category', handleSelectCategory);
    return () => window.removeEventListener('select-property-category', handleSelectCategory);
  }, []);

  // Filters State
  const [selectedState, setSelectedState] = useState<string>('Telangana');
  const [selectedCity, setSelectedCity] = useState<string>('Hyderabad');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedBudget, setSelectedBudget] = useState<number>(300); // Max Lakhs slider
  const [buySellRent, setBuySellRent] = useState<string>('All');
  const [selectedRadius, setSelectedRadius] = useState<number>(10); // KM
  
  // Specific SubType Advanced Filters
  const [selectedSubType, setSelectedSubType] = useState<string>('All');

  // Checkbox Filters
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [topRatedOnly, setTopRatedOnly] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);
  
  // Sorting State
  const [sortBy, setSortBy] = useState<string>('featured'); // newest, price-asc, price-desc, rating, smart-score

  // Map Visual Style Overlay Layers
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite' | 'traffic'>('street');
  const [selectedPin, setSelectedPin] = useState<any | null>(null);
  const [heatmapView, setHeatmapView] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showDealerProfile, setShowDealerProfile] = useState<Dealer | null>(null);

  // Coordinate hubs for distance calculations
  const cityCoordinates: { [key: string]: { lat: number; lon: number } } = {
    'Hyderabad': { lat: 17.4483, lon: 78.3741 },
    'Guntur': { lat: 16.3067, lon: 80.4363 },
    'Vijayawada': { lat: 16.5062, lon: 80.6480 },
    'Visakhapatnam': { lat: 17.6868, lon: 83.2185 },
    'Bengaluru': { lat: 12.9716, lon: 77.5946 },
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDealer = (id: string): Dealer | undefined => {
    return dealersDb.find(d => d.id === id);
  };

  // SMART PROPERTY RANKING ALGORITHM
  const getSmartScore = (prop: PropertyListing): number => {
    let locationDemand = 70; // Base location score
    if (prop.city === 'Hyderabad') locationDemand = 95;
    else if (prop.city === 'Bengaluru') locationDemand = 90;

    const viewsCount = prop.views || 100;
    const savesCount = prop.saves || 20;
    const inquiriesCount = prop.inquiries || 5;
    const userEngagement = Math.min(100, (viewsCount * 0.1) + (savesCount * 0.5) + (inquiriesCount * 2.0));

    const dealer = getDealer(prop.dealerId);
    const sellerRating = dealer ? dealer.rating * 20 : 80; // normalized to 100

    const dateOffsetDays = (new Date().getTime() - new Date(prop.createdDate).getTime()) / (1000 * 3600 * 24);
    const listingFreshness = Math.max(0, 100 - dateOffsetDays * 2);

    let sellerVerification = prop.verified ? 100 : 40;
    if (dealer?.sellerLevel === 'Nexopp Trusted Partner') sellerVerification = 100;
    else if (dealer?.sellerLevel === 'Premium Seller') sellerVerification = 90;
    else if (dealer?.sellerLevel === 'Verified Seller') sellerVerification = 80;

    // Weight allocation formula
    const score = (locationDemand * 0.40) + 
                  (userEngagement * 0.25) + 
                  (sellerRating * 0.15) + 
                  (listingFreshness * 0.10) + 
                  (sellerVerification * 0.10);
    return Math.round(score);
  };

  // Filters application for properties
  const filteredProperties = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    dbTick; 
    const hub = cityCoordinates[selectedCity] || { lat: 0, lon: 0 };
    
    let items = [...propertiesDb];

    // Priority sorting filter 
    items.sort((a, b) => {
      const aScore = (a.rating > 4.8 ? 100 : 0) + (a.verified ? 50 : 0);
      const bScore = (b.rating > 4.8 ? 100 : 0) + (b.verified ? 50 : 0);
      return bScore - aScore;
    });

    return items.filter(item => {
      // Location state/city matching
      if (item.state !== selectedState) return false;
      if (item.city !== selectedCity) {
        const dist = calculateDistance(hub.lat, hub.lon, item.latitude, item.longitude);
        if (dist > selectedRadius) return false;
      }
      
      if (selectedArea !== 'All' && item.area !== selectedArea) return false;
      
      // Property type
      if (selectedType !== 'All' && item.category !== selectedType) return false;
      
      // Advanced subType filters
      if (selectedSubType !== 'All' && item.subType !== selectedSubType) return false;

      if (item.price > selectedBudget) return false;
      if (buySellRent !== 'All' && item.status !== buySellRent) return false;
      
      if (verifiedOnly && !item.verified) return false;
      if (premiumOnly && !item.premium) return false;
      if (topRatedOnly && item.rating < 4.8) return false;
      
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'smart-score' || sortBy === 'featured') {
        return getSmartScore(b) - getSmartScore(a);
      }
      return 0; 
    });
  }, [selectedState, selectedCity, selectedArea, selectedType, selectedSubType, selectedBudget, buySellRent, selectedRadius, verifiedOnly, premiumOnly, topRatedOnly, sortBy, dbTick]);

  // Track search selections to populate recommendations
  useEffect(() => {
    if (selectedType !== 'All' && !searchHistoryTypes.includes(selectedType)) {
      setSearchHistoryTypes(prev => [...prev, selectedType]);
    }
  }, [selectedType]);

  // RECOMMENDATION ENGINE: Recommended properties based on user interactions
  const recommendedProperties = useMemo(() => {
    if (searchHistoryTypes.length === 0) {
      // Fallback: high smart score properties
      return [...propertiesDb]
        .sort((a, b) => getSmartScore(b) - getSmartScore(a))
        .slice(0, 3);
    }
    return [...propertiesDb]
      .filter(p => searchHistoryTypes.includes(p.category) && p.city === selectedCity)
      .sort((a, b) => getSmartScore(b) - getSmartScore(a))
      .slice(0, 3);
  }, [searchHistoryTypes, selectedCity]);

  // Franchise listings filter
  const filteredFranchises = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    dbTick;
    return franchiseDb.filter(fran => {
      if (fran.state !== selectedState) return false;
      if (fran.city !== selectedCity) return false;
      if (verifiedOnly && !fran.verified) return false;
      if (topRatedOnly && fran.rating < 4.8) return false;
      return true;
    });
  }, [selectedState, selectedCity, verifiedOnly, topRatedOnly, dbTick]);

  // Business listings filter
  const filteredBusinesses = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    dbTick;
    return businessDb.filter(biz => {
      if (biz.state !== selectedState) return false;
      if (biz.city !== selectedCity) return false;
      if (verifiedOnly && !biz.verified) return false;
      if (topRatedOnly && biz.rating < 4.8) return false;
      return true;
    });
  }, [selectedState, selectedCity, verifiedOnly, topRatedOnly, dbTick]);

  // Insurance desk filters
  const filteredInsurance = useMemo(() => {
    return insuranceDb.filter(ins => {
      if (ins.state !== selectedState) return false;
      if (ins.city !== selectedCity) return false;
      if (verifiedOnly && !ins.verified) return false;
      return true;
    });
  }, [selectedState, selectedCity, verifiedOnly]);

  // Services desk filters
  const filteredServices = useMemo(() => {
    return servicesDb.filter(serv => {
      if (serv.state !== selectedState) return false;
      if (serv.city !== selectedCity) return false;
      if (verifiedOnly && !serv.verified) return false;
      return true;
    });
  }, [selectedState, selectedCity, verifiedOnly]);

  // Dynamic nearby city check
  const nearbySuggestions = useMemo(() => {
    if (activeMarket !== 'properties' || filteredProperties.length >= 2) return [];
    const suggestionsConfig: { [city: string]: { name: string; count: number; dist: number }[] } = {
      'Guntur': [
        { name: 'Vijayawada', count: 12, dist: 32 },
        { name: 'Hyderabad', count: 24, dist: 270 }
      ],
      'Vijayawada': [
        { name: 'Guntur', count: 6, dist: 32 }
      ]
    };
    return suggestionsConfig[selectedCity] || [];
  }, [activeMarket, filteredProperties.length, selectedCity]);

  // Active dataset summary computed metrics
  const summaryMetrics = useMemo(() => {
    const total = filteredProperties.length;
    const topRated = filteredProperties.filter(p => p.rating >= 4.8).length;
    const hasBestSeller = filteredProperties.some(p => p.bestSeller);
    return { total, topRated, hasBestSeller };
  }, [filteredProperties]);

  const toggleSaveProperty = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedPropertyIds.includes(id)) {
      setSavedPropertyIds(prev => prev.filter(item => item !== id));
    } else {
      setSavedPropertyIds(prev => [...prev, id]);
    }
  };

  const handlePropertyClick = (prop: PropertyListing) => {
    // Increment view counter dynamically for smart score calculation
    prop.views = (prop.views || 0) + 1;
    setSelectedPropertyDetails(prop);
  };

  const calculatedEMI = useMemo(() => {
    const principal = emiVal.loanAmt * 100000; // Lakhs to Rupees
    const monthlyRate = (emiVal.interestRate / 12) / 100;
    const totalMonths = emiVal.tenureYears * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(emi);
  }, [emiVal]);

  const toggleCompareList = (prop: PropertyListing, e: React.MouseEvent) => {
    e.stopPropagation();
    if (compareList.some(item => item.id === prop.id)) {
      setCompareList(prev => prev.filter(item => item.id !== prop.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 properties at a time.');
        return;
      }
      setCompareList(prev => [...prev, prop]);
    }
  };

  // Chat message submission
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = { sender: 'buyer' as const, text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    // Auto-reply response simulator
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'seller' as const,
        text: `Thank you for reaching out. An acquisition executive from ${activeChatDealer?.companyName || 'our desk'} will review your inquiry and connect shortly.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  // Add new property inside dashboard console
  const handleAddPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: PropertyListing = {
      id: `P${propertiesDb.length + 1}`,
      dealerId: 'D1', // assign to active mock user
      title: newPropertyForm.title,
      description: newPropertyForm.description,
      image: newPropertyForm.image,
      state: newPropertyForm.state,
      district: newPropertyForm.state === 'Telangana' ? 'Rangareddy' : 'Krishna',
      city: newPropertyForm.city,
      area: newPropertyForm.area,
      latitude: cityCoordinates[newPropertyForm.city]?.lat || 17.44,
      longitude: cityCoordinates[newPropertyForm.city]?.lon || 78.37,
      price: newPropertyForm.price,
      priceDisplay: `₹${newPropertyForm.price} Lakhs`,
      category: newPropertyForm.category,
      status: 'Buy',
      areaSqFt: newPropertyForm.areaSqFt,
      rating: 5.0,
      reviewCount: 0,
      verified: true,
      premium: false,
      trending: false,
      bestSeller: false,
      availabilityCount: 1,
      trustScore: 99,
      createdDate: new Date().toISOString().split('T')[0],
      propertyStatus: 'Available',
      views: 0,
      saves: 0,
      inquiries: 0,
      contactRequests: 0,
      siteVisitRequests: 0,
      subType: newPropertyForm.subType
    };
    propertiesDb.unshift(created);
    alert('Property added successfully to your Nexopp dashboard!');
    setNewPropertyForm({
      title: '',
      description: '',
      category: 'Apartment',
      subType: '2 BHK',
      price: 60,
      areaSqFt: '1400 Sq Ft',
      state: 'Telangana',
      city: 'Hyderabad',
      area: 'Gachibowli',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'
    });
    triggerRefresh();
  };

  const handleDeleteProperty = (id: string) => {
    const idx = propertiesDb.findIndex(p => p.id === id);
    if (idx !== -1) {
      propertiesDb.splice(idx, 1);
      triggerRefresh();
    }
  };

  // Seller Dashboard statistics
  const dashboardStats = useMemo(() => {
    const myProperties = propertiesDb.filter(p => p.dealerId === 'D1');
    const activeCount = myProperties.filter(p => p.propertyStatus !== 'Sold').length;
    const soldCount = myProperties.filter(p => p.propertyStatus === 'Sold').length;
    const totalViews = myProperties.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalSaves = myProperties.reduce((acc, curr) => acc + (curr.saves || 0), 0);
    const totalInquiries = myProperties.reduce((acc, curr) => acc + (curr.inquiries || 0), 0);
    return { activeCount, soldCount, totalViews, totalSaves, totalInquiries };
  }, [dbTick]);

  return (
    <section id="marketplace-explorer" className="section-padding explorer-portal-section">
      <div className="container">
        <span className="section-tag text-center">Interactive Discovery</span>
        <h2 className="section-title text-center">Unified Marketplace Explorer</h2>
        <p className="section-subtitle text-center">
          Compare assets and consult with certified dealers. View live radius mappings and trust metrics on an enterprise interactive layout.
        </p>

        {/* Console view options bar */}
        <div className="explorer-market-tabs">
          <button className={`tab-btn ${activeMarket === 'properties' && !sellerModeActive ? 'active' : ''}`} onClick={() => { setActiveMarket('properties'); setSellerModeActive(false); }}>Properties Portal</button>
          <button className={`tab-btn ${activeMarket === 'franchises' ? 'active' : ''}`} onClick={() => { setActiveMarket('franchises'); setSellerModeActive(false); }}>Franchise Hub</button>
          <button className={`tab-btn ${activeMarket === 'businesses' ? 'active' : ''}`} onClick={() => { setActiveMarket('businesses'); setSellerModeActive(false); }}>Business Registry</button>
          <button className={`tab-btn ${activeMarket === 'finance' ? 'active' : ''}`} onClick={() => { setActiveMarket('finance'); setSellerModeActive(false); }}>Finance & Services</button>
          
          <button className={`tab-btn tab-admin-btn ${sellerModeActive ? 'active' : ''}`} onClick={() => { setSellerModeActive(true); }}>Seller Dashboard</button>
          <button className={`tab-btn tab-admin-btn ${activeMarket === 'admin' && !sellerModeActive ? 'active' : ''}`} onClick={() => { setActiveMarket('admin'); setSellerModeActive(false); }}>Admin Database Console</button>
        </div>

        {activeMarket === 'admin' && !sellerModeActive && (
          <AdminPanel onRefresh={triggerRefresh} />
        )}

        {sellerModeActive && (
          <div className="seller-dashboard-v2 premium-card">
            <h3 className="form-heading flex items-center gap-2"><FaChartLine /> Seller Business Intelligence & Listings Console</h3>
            <p className="form-subheading">Manage listings, monitor search traction, and mark properties sold.</p>
            
            <div className="dashboard-stats-row">
              <div className="dashboard-stat-card">
                <h4>Active Listings</h4>
                <span className="val">{dashboardStats.activeCount}</span>
              </div>
              <div className="dashboard-stat-card">
                <h4>Properties Sold</h4>
                <span className="val">{dashboardStats.soldCount}</span>
              </div>
              <div className="dashboard-stat-card">
                <h4>Total Views</h4>
                <span className="val">{dashboardStats.totalViews}</span>
              </div>
              <div className="dashboard-stat-card">
                <h4>Saves Traction</h4>
                <span className="val">{dashboardStats.totalSaves}</span>
              </div>
              <div className="dashboard-stat-card">
                <h4>Inquiries Received</h4>
                <span className="val">{dashboardStats.totalInquiries}</span>
              </div>
            </div>

            <div className="details-split-layout">
              <div>
                <h4 className="flex-sub-title">Add Property Registry</h4>
                <form onSubmit={handleAddPropertySubmit} className="luxury-form">
                  <div className="form-row-double">
                    <div className="form-group">
                      <label>Listing Title</label>
                      <input 
                        type="text" 
                        required 
                        value={newPropertyForm.title} 
                        onChange={(e) => setNewPropertyForm({...newPropertyForm, title: e.target.value})} 
                        placeholder="e.g. Prestige Heights Penthouse" 
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select 
                        value={newPropertyForm.category} 
                        onChange={(e) => setNewPropertyForm({...newPropertyForm, category: e.target.value as any})}
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa / House</option>
                        <option value="Plot">Lands & Plots</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-double">
                    <div className="form-group">
                      <label>Specific Sub-Type</label>
                      <select 
                        value={newPropertyForm.subType} 
                        onChange={(e) => setNewPropertyForm({...newPropertyForm, subType: e.target.value})}
                      >
                        {newPropertyForm.category === 'Apartment' && (
                          <>
                            <option value="1 BHK">1 BHK</option>
                            <option value="2 BHK">2 BHK</option>
                            <option value="3 BHK">3 BHK</option>
                            <option value="Penthouse">Penthouse</option>
                          </>
                        )}
                        {newPropertyForm.category === 'Villa' && (
                          <>
                            <option value="Independent House">Independent House</option>
                            <option value="Duplex House">Duplex House</option>
                            <option value="Farm House">Farm House</option>
                          </>
                        )}
                        {newPropertyForm.category === 'Plot' && (
                          <>
                            <option value="Residential Plot">Residential Plot</option>
                            <option value="Commercial Plot">Commercial Plot</option>
                            <option value="Agricultural Land">Agricultural Land</option>
                          </>
                        )}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Price (in Lakhs)</label>
                      <input 
                        type="number" 
                        required 
                        value={newPropertyForm.price} 
                        onChange={(e) => setNewPropertyForm({...newPropertyForm, price: parseInt(e.target.value)})} 
                      />
                    </div>
                  </div>

                  <div className="form-row-double">
                    <div className="form-group">
                      <label>Area (e.g. 1500 Sq Ft)</label>
                      <input 
                        type="text" 
                        required 
                        value={newPropertyForm.areaSqFt} 
                        onChange={(e) => setNewPropertyForm({...newPropertyForm, areaSqFt: e.target.value})} 
                      />
                    </div>
                    <div className="form-group">
                      <label>City Hub</label>
                      <select 
                        value={newPropertyForm.city} 
                        onChange={(e) => setNewPropertyForm({...newPropertyForm, city: e.target.value})}
                      >
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Guntur">Guntur</option>
                        <option value="Vijayawada">Vijayawada</option>
                        <option value="Visakhapatnam">Visakhapatnam</option>
                        <option value="Bengaluru">Bengaluru</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description Details</label>
                    <textarea 
                      required 
                      value={newPropertyForm.description} 
                      onChange={(e) => setNewPropertyForm({...newPropertyForm, description: e.target.value})}
                    />
                  </div>

                  <button type="submit" className="btn btn-gold w-full"><FaPlus /> Add Listing</button>
                </form>
              </div>

              <div>
                <h4 className="flex-sub-title">Your Current Listings</h4>
                <div className="listings-vertical-list">
                  {propertiesDb.filter(p => p.dealerId === 'D1').map((prop) => (
                    <div key={prop.id} className="service-card-explorer glass-card">
                      <div>
                        <h4 className="service-p-name">{prop.title}</h4>
                        <span className="service-p-cat">{prop.subType} • {prop.city}</span>
                        <p className="service-p-desc">Price: {prop.priceDisplay} | Status: <strong>{prop.propertyStatus || 'Available'}</strong></p>
                      </div>
                      <div className="service-p-right">
                        {prop.propertyStatus !== 'Sold' && (
                          <button 
                            className="btn btn-gold btn-landscape-explore" 
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginBottom: '0.5rem' }}
                            onClick={() => { prop.propertyStatus = 'Sold'; triggerRefresh(); }}
                          >
                            Mark Sold
                          </button>
                        )}
                        <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteProperty(prop.id)}><FaTrash /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!sellerModeActive && activeMarket !== 'admin' && (
          <div className="explorer-dashboard-grid">
            {/* Left Column: Filters Console */}
            <div className="explorer-filters-card premium-card">
              <div className="filter-header">
                <h3><FaFilter /> Advanced Parameters</h3>
                <button className="clear-filters-btn" onClick={() => {
                  setSelectedState('Telangana');
                  setSelectedCity('Hyderabad');
                  setSelectedArea('All');
                  setSelectedType('All');
                  setSelectedSubType('All');
                  setSelectedBudget(300);
                  setBuySellRent('All');
                  setSelectedRadius(10);
                  setVerifiedOnly(false);
                  setTopRatedOnly(false);
                  setPremiumOnly(false);
                }}><FaRedo /> Reset</button>
              </div>

              <div className="filter-group">
                <label>State Region</label>
                <select value={selectedState} onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity(e.target.value === 'Telangana' ? 'Hyderabad' : (e.target.value === 'Karnataka' ? 'Bengaluru' : 'Guntur'));
                }}>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>

              <div className="filter-group">
                <label>City Hub</label>
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                  {selectedState === 'Andhra Pradesh' && (
                    <>
                      <option value="Guntur">Guntur</option>
                      <option value="Vijayawada">Vijayawada</option>
                      <option value="Visakhapatnam">Visakhapatnam</option>
                    </>
                  )}
                  {selectedState === 'Telangana' && <option value="Hyderabad">Hyderabad</option>}
                  {selectedState === 'Karnataka' && <option value="Bengaluru">Bengaluru</option>}
                </select>
              </div>

              {activeMarket === 'properties' && (
                <>
                  <div className="filter-group">
                    <label>Primary Portfolio</label>
                    <select value={selectedType} onChange={(e) => { setSelectedType(e.target.value); setSelectedSubType('All'); }}>
                      <option value="All">All Categories</option>
                      <option value="Apartment">Flats & Apartments</option>
                      <option value="Villa">Individual Houses</option>
                      <option value="Plot">Lands & Plots</option>
                    </select>
                  </div>

                  {selectedType !== 'All' && (
                    <div className="filter-group">
                      <label>Specific Sub-Type</label>
                      <select value={selectedSubType} onChange={(e) => setSelectedSubType(e.target.value)}>
                        <option value="All">All Sub-Types</option>
                        {selectedType === 'Apartment' && (
                          <>
                            <option value="1 BHK">1 BHK</option>
                            <option value="2 BHK">2 BHK</option>
                            <option value="3 BHK">3 BHK</option>
                            <option value="Penthouse">Penthouse</option>
                          </>
                        )}
                        {selectedType === 'Villa' && (
                          <>
                            <option value="Independent House">Independent House</option>
                            <option value="Duplex House">Duplex House</option>
                            <option value="Farm House">Farm House</option>
                          </>
                        )}
                        {selectedType === 'Plot' && (
                          <>
                            <option value="Residential Plot">Residential Plot</option>
                            <option value="Commercial Plot">Commercial Plot</option>
                            <option value="Agricultural Land">Agricultural Land</option>
                          </>
                        )}
                      </select>
                    </div>
                  )}

                  <div className="filter-group">
                    <label>Radius Search</label>
                    <select value={selectedRadius} onChange={(e) => setSelectedRadius(parseInt(e.target.value))}>
                      <option value={2}>Within 2 KM</option>
                      <option value={5}>Within 5 KM</option>
                      <option value={10}>Within 10 KM</option>
                      <option value={20}>Within 20 KM</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <div className="slider-label-row">
                      <label>Maximum Price Cap</label>
                      <span className="slider-val">₹{selectedBudget} Lakhs</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="300" 
                      value={selectedBudget} 
                      onChange={(e) => setSelectedBudget(parseInt(e.target.value))}
                      className="budget-slider"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Ecosystem Transaction Mode</label>
                    <div className="radio-group-tabs">
                      <button className={`radio-tab ${buySellRent === 'All' ? 'active' : ''}`} onClick={() => setBuySellRent('All')}>All</button>
                      <button className={`radio-tab ${buySellRent === 'Buy' ? 'active' : ''}`} onClick={() => setBuySellRent('Buy')}>Buy</button>
                      <button className={`radio-tab ${buySellRent === 'Sell' ? 'active' : ''}`} onClick={() => setBuySellRent('Sell')}>Sell</button>
                      <button className={`radio-tab ${buySellRent === 'Rent' ? 'active' : ''}`} onClick={() => setBuySellRent('Rent')}>Rent</button>
                    </div>
                  </div>
                </>
              )}

              <div className="filter-group checkbox-filters-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
                  <span>Verified Sellers Only</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={topRatedOnly} onChange={(e) => setTopRatedOnly(e.target.checked)} />
                  <span>Top Rated (⭐ 4.8+)</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={premiumOnly} onChange={(e) => setPremiumOnly(e.target.checked)} />
                  <span>Nexopp Trusted Partner</span>
                </label>
              </div>

              <div className="filter-group">
                <label>Sort Order</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="featured">Featured Priorities</option>
                  <option value="smart-score">Smart Match Score</option>
                  <option value="newest">Newest Registries</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Vetted Rating</option>
                </select>
              </div>
            </div>

            {/* Right Column: Search Results Dashboard & Map */}
            <div className="explorer-dashboard-results">
              <div className="results-toolbar-header">
                {activeMarket === 'properties' && (
                  <div className="toolbar-stats-summary">
                    Showing <strong className="gold-text">{summaryMetrics.total} Properties</strong> in {selectedCity}
                    {summaryMetrics.topRated > 0 && <span className="stat-pill"><FaStar /> {summaryMetrics.topRated} Top Vetted</span>}
                    {summaryMetrics.hasBestSeller && <span className="stat-pill b-seller">🏆 Best Seller</span>}
                  </div>
                )}
                {activeMarket === 'franchises' && <div className="toolbar-stats-summary">Available Franchise Outlets: <strong className="gold-text">{filteredFranchises.length}</strong> in {selectedCity}</div>}
                {activeMarket === 'businesses' && <div className="toolbar-stats-summary">Cash-Flowing Acquisitions: <strong className="gold-text">{filteredBusinesses.length}</strong> in {selectedCity}</div>}
                {activeMarket === 'finance' && <div className="toolbar-stats-summary">Affiliated Financial Providers: <strong className="gold-text">{filteredInsurance.length + filteredServices.length}</strong></div>}

                <div className="view-mode-toggle-group">
                  <button className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><FaThLarge /> Grid</button>
                  <button className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}><FaMap /> Full Map</button>
                  <button className={`view-toggle-btn ${viewMode === 'split' ? 'active' : ''}`} onClick={() => setViewMode('split')}><FaColumns /> Split Screen</button>
                </div>
              </div>

              {compareList.length > 0 && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center">
                  <span>Comparing <strong className="text-amber-700">{compareList.length} properties</strong> (max 3)</span>
                  <div className="flex gap-2">
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }} onClick={() => setCompareList([])}>Clear</button>
                    <button className="btn btn-gold" style={{ padding: '0.4rem 1rem' }} onClick={() => setShowCompareModal(true)}>Compare Now</button>
                  </div>
                </div>
              )}

              <div className={`explorer-view-wrapper mode-${viewMode}`}>
                {(viewMode === 'map' || viewMode === 'split') && (
                  <div className="interactive-map-canvas-container premium-card">
                    <div className="map-layer-selector">
                      <button className={`layer-btn ${mapLayer === 'street' ? 'active' : ''}`} onClick={() => setMapLayer('street')}><FaCompass /> Map View</button>
                      <button className={`layer-btn ${mapLayer === 'satellite' ? 'active' : ''}`} onClick={() => setMapLayer('satellite')}><FaLayerGroup /> Satellite</button>
                      <button className={`layer-btn ${mapLayer === 'traffic' ? 'active' : ''}`} onClick={() => { setMapLayer('traffic'); setShowTraffic(!showTraffic); }}><FaMapSigns /> Traffic</button>
                      <button className={`layer-btn ${heatmapView ? 'active' : ''}`} onClick={() => setHeatmapView(!heatmapView)}><FaLayerGroup /> Heatmap</button>
                    </div>

                    <div className={`map-grid-layer ${mapLayer}`}>
                      {showTraffic && <div className="animated-traffic-lines"></div>}
                      {heatmapView && <div className="density-heatmap-overlay"></div>}
                      <div className="map-vector-routes"></div>

                      {activeMarket === 'properties' && filteredProperties.map((prop) => {
                        const relativeLeft = ((prop.longitude - 77.0) * 8.5) % 100;
                        const relativeTop = ((18.5 - prop.latitude) * 11.5) % 100;
                        return (
                          <button 
                            key={prop.id} 
                            className={`map-interactive-pin ${selectedPin?.id === prop.id ? 'pin-active' : ''}`}
                            style={{ left: `${Math.abs(relativeLeft)}%`, top: `${Math.abs(relativeTop)}%` }}
                            onClick={() => setSelectedPin(prop)}
                          >
                            <FaMapMarkerAlt />
                            <span className="pin-price-lbl">₹{prop.price >= 100 ? `${(prop.price/100).toFixed(1)}Cr` : `${prop.price}L`}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {(viewMode === 'grid' || viewMode === 'split') && (
                  <div className="listings-scroll-container">
                    {nearbySuggestions.length > 0 && (
                      <div className="low-inventory-alert-box premium-card">
                        <h4>⚠️ Limited Options in {selectedCity}</h4>
                        <p>We found higher availability in these nearby locations within reach:</p>
                        <div className="nearby-suggestions-flex">
                          {nearbySuggestions.map((sug, idx) => (
                            <button key={idx} className="nearby-suggestion-card glass-card" onClick={() => { setSelectedCity(sug.name); }}>
                              <strong>{sug.name}</strong>
                              <span>{sug.count} Listings • {sug.dist} KM Away</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeMarket === 'properties' && (
                      <div className="explorer-listings-grid">
                        {filteredProperties.length === 0 ? (
                          <div className="no-listings-fallback">No property listings match your selected parameters. Select Guntur or Hyderabad for more listings.</div>
                        ) : (
                          filteredProperties.map((prop) => {
                            const matchScore = getSmartScore(prop);
                            return (
                              <div key={prop.id} className="listing-card-premium-landscape premium-card" onClick={() => handlePropertyClick(prop)}>
                                <div className="landscape-image-wrapper">
                                  <img src={prop.image} alt={prop.title} className="landscape-img" />
                                  <div className="card-badges">
                                    {prop.verified && <span className="badge verified">✔ Verified</span>}
                                    {prop.premium && <span className="badge premium">💎 Premium</span>}
                                  </div>
                                </div>
                                <div className="landscape-info-wrapper">
                                  <div>
                                    <div className="landscape-top-header">
                                      <span className="landscape-type-badge">{prop.subType || prop.category}</span>
                                      <span className="landscape-score-badge">Match: {matchScore}%</span>
                                    </div>
                                    <h3 className="landscape-title">{prop.title}</h3>
                                    <div className="landscape-meta-row">
                                      <span>📏 {prop.areaSqFt}</span>
                                      <span>📍 {prop.area}, {prop.city}</span>
                                      <span className="card-rating"><FaStar /> {prop.rating}</span>
                                    </div>
                                  </div>
                                  <div className="landscape-bottom-row">
                                    <div className="landscape-price-block">
                                      <span className="landscape-price-label">Price Range</span>
                                      <span className="landscape-price-val">{prop.priceDisplay}</span>
                                    </div>
                                    <div className="landscape-actions">
                                      <button 
                                        className="btn btn-secondary" 
                                        style={{ padding: '0.5rem' }} 
                                        onClick={(e) => toggleSaveProperty(prop.id, e)}
                                      >
                                        {savedPropertyIds.includes(prop.id) ? <FaBookmark className="text-amber-500" /> : <FaRegBookmark />}
                                      </button>
                                      <button 
                                        className="btn btn-secondary" 
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                        onClick={(e) => toggleCompareList(prop, e)}
                                      >
                                        {compareList.some(item => item.id === prop.id) ? 'Selected' : 'Compare'}
                                      </button>
                                      <button className="btn btn-gold btn-view-details" style={{ padding: '0.6rem 1.5rem' }}>
                                        Explore Portfolios
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}

                        {/* RECOMMENDATION BLOCK */}
                        {recommendedProperties.length > 0 && (
                          <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                            <h4 className="flex-sub-title text-slate-800"><FaStar /> Recommended For You</h4>
                            <p className="text-sm text-slate-500 mb-4">Acquisitions based on your search history and preferences in {selectedCity}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {recommendedProperties.map(p => (
                                <div key={p.id} className="bg-white p-4 border border-slate-100 rounded-xl cursor-pointer" onClick={() => handlePropertyClick(p)}>
                                  <img src={p.image} alt={p.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                                  <h5 className="font-semibold text-sm line-clamp-1">{p.title}</h5>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-slate-400">{p.subType}</span>
                                    <span className="font-bold text-sm text-amber-600">{p.priceDisplay}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeMarket === 'franchises' && (
                      <div className="explorer-listings-grid">
                        {filteredFranchises.length === 0 ? (
                          <div className="no-listings-fallback">No franchise brand listings match.</div>
                        ) : (
                          filteredFranchises.map((fran) => (
                            <div key={fran.id} className="listing-card-premium premium-card">
                              <div className="card-image-wrap">
                                <img src={fran.image} alt={fran.brand} />
                              </div>
                              <div className="card-body-wrap">
                                <div className="card-meta-row">
                                  <span>{fran.type}</span>
                                  <span className="card-rating"><FaStar /> {fran.rating}</span>
                                </div>
                                <h3>{fran.brand}</h3>
                                <p>{fran.location}</p>
                                <div className="card-bottom-flex">
                                  <div className="card-price-block">
                                    <span className="label">Investment Required</span>
                                    <span className="price-val">{fran.investmentDisplay}</span>
                                  </div>
                                  <button className="btn btn-gold" onClick={() => alert(`Inquiring for ${fran.brand}`)}>Contact Brand</button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeMarket === 'businesses' && (
                      <div className="explorer-listings-grid">
                        {filteredBusinesses.length === 0 ? (
                          <div className="no-listings-fallback">No business acquisition options match.</div>
                        ) : (
                          filteredBusinesses.map((biz) => (
                            <div key={biz.id} className="listing-card-premium premium-card">
                              <div className="card-image-wrap">
                                <img src={biz.image} alt={biz.name} />
                              </div>
                              <div className="card-body-wrap">
                                <div className="card-meta-row">
                                  <span>{biz.industry}</span>
                                  <span className="card-rating"><FaStar /> {biz.rating}</span>
                                </div>
                                <h3>{biz.name}</h3>
                                <p>{biz.location}</p>
                                <div className="card-bottom-flex">
                                  <div className="card-price-block">
                                    <span className="label">Acquisition Price</span>
                                    <span className="price-val">{biz.priceDisplay}</span>
                                  </div>
                                  <button className="btn btn-gold" onClick={() => alert(`Opening escrow evaluation for ${biz.name}`)}>Acquire</button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeMarket === 'finance' && (
                      <div className="finance-services-explorer-grid">
                        <div className="finance-sub-explorer">
                          <h4 className="flex-sub-title"><FaShieldAlt /> Vetted Insurance Desks</h4>
                          <div className="listings-vertical-list">
                            {filteredInsurance.map((ins) => (
                              <div key={ins.id} className="service-card-explorer glass-card">
                                <div>
                                  <h4 className="service-p-name">{ins.name}</h4>
                                  <span className="service-p-cat">{ins.category} Insurance</span>
                                  <p className="service-p-desc">{ins.coverageAmount} • {ins.claimProcess}</p>
                                </div>
                                <div className="service-p-right">
                                  <span className="price">{ins.premiumStartingPrice}</span>
                                  <span className="rating"><FaStar /> {ins.rating}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="finance-sub-explorer">
                          <h4 className="flex-sub-title"><FaUserTie /> Verified Professional Advisory</h4>
                          <div className="listings-vertical-list">
                            {filteredServices.map((serv) => (
                              <div key={serv.id} className="service-card-explorer glass-card">
                                <div>
                                  <h4 className="service-p-name">{serv.name}</h4>
                                  <span className="service-p-cat">{serv.category}</span>
                                  <p className="service-p-desc">Experience: {serv.experience} Years Vetted Practice</p>
                                </div>
                                <div className="service-p-right">
                                  <span className="rating"><FaStar /> {serv.rating}</span>
                                  <button className="btn-text-link" onClick={() => alert(`Booking consulting call with ${serv.name}`)}>Book Call</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Property Details Modal Overlay Sheet */}
      {selectedPropertyDetails && (
        <div className="property-details-sheet-overlay" onClick={() => setSelectedPropertyDetails(null)}>
          <div className="property-details-sheet premium-card" onClick={(e) => e.stopPropagation()}>
            <button className="popover-close-btn" style={{ top: '1.5rem', right: '1.5rem' }} onClick={() => setSelectedPropertyDetails(null)}>&times;</button>
            
            <span className="landscape-type-badge">{selectedPropertyDetails.subType} • {selectedPropertyDetails.category}</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginTop: '0.5rem', marginBottom: '1.5rem' }}>{selectedPropertyDetails.title}</h2>
            
            <div className="property-gallery-grid">
              <img src={selectedPropertyDetails.image} alt="" className="gallery-main-img" />
              <div className="gallery-thumbnails">
                <img src={selectedPropertyDetails.gallery?.[0] || selectedPropertyDetails.image} alt="" className="gallery-thumb" />
                <img src={selectedPropertyDetails.gallery?.[1] || selectedPropertyDetails.image} alt="" className="gallery-thumb" />
              </div>
            </div>

            <div className="details-split-layout">
              <div>
                <h4 className="flex-sub-title">Specification Parameters</h4>
                <div className="detail-specs-grid">
                  <div className="spec-item">
                    <label>Ecosystem Price</label>
                    <span className="block text-lg font-bold text-slate-800 mt-1">{selectedPropertyDetails.priceDisplay}</span>
                  </div>
                  <div className="spec-item">
                    <label>Total Space</label>
                    <span className="block text-lg font-bold text-slate-800 mt-1">{selectedPropertyDetails.areaSqFt}</span>
                  </div>
                  <div className="spec-item">
                    <label>Availability Status</label>
                    <span className="block text-lg font-bold text-slate-800 mt-1">{selectedPropertyDetails.propertyStatus || 'Available'}</span>
                  </div>
                </div>

                <h4 className="flex-sub-title mt-6">Overview description</h4>
                <p className="text-slate-600 leading-relaxed mb-6">{selectedPropertyDetails.description}</p>

                <div className="nearby-points-section">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2"><FaCompass /> Location Intelligence Network</h4>
                  <div className="nearby-list">
                    <div className="nearby-item">
                      <span className="text-slate-500 flex items-center gap-2"><FaGraduationCap /> Nearby Schools</span>
                      <strong className="text-slate-700">{selectedPropertyDetails.nearbySchools?.join(', ') || 'Within 2.5 KM Radius'}</strong>
                    </div>
                    <div className="nearby-item">
                      <span className="text-slate-500 flex items-center gap-2"><FaHospital /> Nearby Healthcare</span>
                      <strong className="text-slate-700">{selectedPropertyDetails.nearbyHospitals?.join(', ') || 'Within 1.5 KM Radius'}</strong>
                    </div>
                    <div className="nearby-item">
                      <span className="text-slate-500 flex items-center gap-2"><FaMapSigns /> Transport Terminals</span>
                      <strong className="text-slate-700">{selectedPropertyDetails.nearbyTransit?.join(', ') || 'Connect corridor 10 mins'}</strong>
                    </div>
                  </div>
                </div>

                <div className="emi-calculator-card">
                  <h4 className="font-bold flex items-center gap-2"><FaCalculator /> Real-Estate Loan / EMI Calculator</h4>
                  <div className="calculator-inputs">
                    <div className="calc-input-group">
                      <label>Loan Amount (₹ Lakhs)</label>
                      <input 
                        type="number" 
                        value={emiVal.loanAmt} 
                        onChange={(e) => setEmiVal({...emiVal, loanAmt: parseInt(e.target.value) || 0})} 
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>Interest Rate (% Per Annum)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={emiVal.interestRate} 
                        onChange={(e) => setEmiVal({...emiVal, interestRate: parseFloat(e.target.value) || 0})} 
                      />
                    </div>
                    <div className="calc-input-group">
                      <label>Tenure (Years)</label>
                      <input 
                        type="number" 
                        value={emiVal.tenureYears} 
                        onChange={(e) => setEmiVal({...emiVal, tenureYears: parseInt(e.target.value) || 0})} 
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Estimated Monthly Installment:</span>
                    <strong className="text-xl text-amber-600 font-bold">₹{calculatedEMI.toLocaleString('en-IN')}/mo</strong>
                  </div>
                </div>
              </div>

              <div>
                {/* Seller Profile Summary Card */}
                {getDealer(selectedPropertyDetails.dealerId) && (
                  <div className="seller-profile-sheet-v2">
                    <h4 className="font-semibold text-slate-800 mb-4">Assigned Portfolio Director</h4>
                    <div className="seller-avatar-flex">
                      <img src={getDealer(selectedPropertyDetails.dealerId)?.photo} alt="" className="w-16 h-16 rounded-full object-cover border border-amber-300" />
                      <div>
                        <h5 className="font-bold text-slate-800">{getDealer(selectedPropertyDetails.dealerId)?.companyName}</h5>
                        <span className="seller-lvl-tag">{getDealer(selectedPropertyDetails.dealerId)?.sellerLevel || 'Verified Seller'}</span>
                      </div>
                    </div>
                    
                    <div className="seller-details-grid">
                      <div>
                        <span className="text-xs text-slate-400">Sold Count</span>
                        <strong className="block text-sm font-semibold">{getDealer(selectedPropertyDetails.dealerId)?.propertiesSold || 10} Properties</strong>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Member Since</span>
                        <strong className="block text-sm font-semibold">{getDealer(selectedPropertyDetails.dealerId)?.memberSince || 2022}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs text-slate-400">Average Response Time</span>
                        <strong className="block text-sm font-semibold">{getDealer(selectedPropertyDetails.dealerId)?.responseTime}</strong>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <button className="btn btn-gold w-full" onClick={() => { setActiveChatDealer(getDealer(selectedPropertyDetails.dealerId) || null); setChatMessages([{ sender: 'seller', text: 'Hello! How can I assist you with this property acquisition today?', time: 'Just now' }]); }}>
                        Chat with Representative
                      </button>
                      <button className="btn btn-secondary w-full" onClick={() => alert(`Calling prioritize desk: ${getDealer(selectedPropertyDetails.dealerId)?.phone}`)}>
                        Call Desk Director
                      </button>
                      <button className="btn btn-outline-gold w-full" onClick={() => alert('Visit schedule logged. Representative will call you shortly to confirm the slots.')}>
                        Schedule Site Visit
                      </button>
                      <button className="text-center text-xs text-amber-600 underline mt-2 cursor-pointer" onClick={() => alert('PDF Brochure generated. Download will start shortly.')}>
                        Download Brochure PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="property-details-sheet-overlay" onClick={() => setShowCompareModal(false)}>
          <div className="property-details-sheet premium-card" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <button className="popover-close-btn" onClick={() => setShowCompareModal(false)}>&times;</button>
            <h3 className="form-heading mb-4">Compare Selected Assets</h3>
            <div className="grid grid-cols-3 gap-4">
              {compareList.map(item => (
                <div key={item.id} className="border border-slate-200 p-4 rounded-xl">
                  <img src={item.image} alt="" className="w-full h-32 object-cover rounded-lg mb-2" />
                  <h4 className="font-bold text-sm line-clamp-1">{item.title}</h4>
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between border-b pb-1"><span>Price</span><strong>{item.priceDisplay}</strong></div>
                    <div className="flex justify-between border-b pb-1"><span>Area</span><strong>{item.areaSqFt}</strong></div>
                    <div className="flex justify-between border-b pb-1"><span>City</span><strong>{item.city}</strong></div>
                    <div className="flex justify-between pb-1"><span>Score</span><strong>{getSmartScore(item)}%</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Popover sheets */}
      {activeChatDealer && (
        <div className="fixed bottom-6 right-6 w-96 bg-white shadow-2xl border border-slate-200 rounded-2xl overflow-hidden z-[5000]">
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <img src={activeChatDealer.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h5 className="font-bold text-sm">{activeChatDealer.companyName}</h5>
                <span className="text-xs text-amber-500 font-medium">Acquisitions Room</span>
              </div>
            </div>
            <button className="text-white text-xl" onClick={() => setActiveChatDealer(null)}>&times;</button>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.sender === 'buyer' ? 'bg-slate-800 text-white rounded-tr-none' : 'bg-white border rounded-tl-none'}`}>
                  <p>{msg.text}</p>
                  <span className="text-[10px] opacity-60 block text-right mt-1">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChatMessage} className="p-3 border-t flex gap-2">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 border border-slate-200 rounded-xl px-3 outline-none text-sm"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="btn btn-gold" style={{ padding: '0.5rem 1rem' }}>Send</button>
          </form>
        </div>
      )}

      {/* Popover popups */}
      {showDealerProfile && (
        <div className="dealer-profile-modal-overlay">
          <div className="dealer-profile-sheet premium-card">
            <button className="popover-close-btn" onClick={() => setShowDealerProfile(null)}>&times;</button>
            <div className="dealer-header-flex">
              <img src={showDealerProfile.photo} alt={showDealerProfile.companyName} className="dealer-photo" />
              <div className="dealer-main-info">
                <span className="dealer-tag-badge">🏆 Vetted Partner Advisor</span>
                <h2>{showDealerProfile.companyName}</h2>
                <div className="dealer-rating-row">
                  <FaStar /> <span>{showDealerProfile.rating} ({showDealerProfile.reviewCount} Vetted Reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="dealer-stats-grid">
              <div className="d-stat">
                <span className="label">Broker Experience</span>
                <span className="value">{showDealerProfile.yearsExperience} Years</span>
              </div>
              <div className="d-stat">
                <span className="label">Response Rating</span>
                <span className="value">{showDealerProfile.responseTime}</span>
              </div>
              <div className="d-stat">
                <span className="label">Registered Inventory</span>
                <span className="value">{showDealerProfile.inventoryCount} Assets</span>
              </div>
            </div>

            <div className="dealer-coverage-section">
              <h4>Ecosystem Geographic Coverage</h4>
              <div className="coverage-locations-flex">
                {Object.entries(showDealerProfile.coverage).map(([city, count]) => (
                  <div key={city} className="coverage-badge-item glass-card">
                    <strong>{city}</strong>
                    <span>({count} listings)</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-gold w-full mt-4" onClick={() => { setActiveChatDealer(showDealerProfile); setShowDealerProfile(null); }}>
              Message Representative Now
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MarketplaceExplorer;
