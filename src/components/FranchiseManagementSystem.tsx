import React, { useState, useMemo } from 'react';
import {
  franchiseDb,
  dealersDb,
  franchiseEnquiriesDb,
  addFranchise,
  updateFranchise,
  deleteFranchise,
  updateFranchiseEnquiryStatus,
  assignFranchiseEnquiryBroker,
  deleteFranchiseEnquiry,
  bulkPublishFranchises,
  bulkArchiveFranchises,
  bulkDeleteFranchises
} from '../db/marketplaceDb';
import type { FranchiseListing } from '../db/marketplaceDb';
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaImages,
  FaFileExcel,
  FaFileCsv,
  FaFilePdf,
  FaCopy
} from 'react-icons/fa';

interface FranchiseManagementSystemProps {
  showNotification: (msg: string, type?: string) => void;
  activeSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

const DEFAULT_CATEGORIES = [
  'Food & Beverage',
  'Healthcare',
  'Retail',
  'Education',
  'Beauty & Wellness',
  'Automobile',
  'Technology',
  'Hospitality',
  'Existing Running Businesses',
  'Manufacturing',
  'Logistics',
  'Agriculture',
  'Other Business Opportunities'
];

export const FranchiseManagementSystem: React.FC<FranchiseManagementSystemProps> = ({ showNotification, activeSubTab, onSubTabChange: _onSubTabChange }) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'approvals' | 'featured_premium' | 'analytics' | 'categories_locations' | 'enquiries' | 'gallery' | 'reports'>('listings');

  React.useEffect(() => {
    if (activeSubTab) {
      setActiveTab(activeSubTab as any);
    }
  }, [activeSubTab]);

  // Search & Filter state for listings
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedBroker, setSelectedBroker] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalSubTab, setModalSubTab] = useState<'basic' | 'investment' | 'business' | 'space' | 'location' | 'media' | 'broker'>('basic');
  const [editingFranchise, setEditingFranchise] = useState<Partial<FranchiseListing>>({});

  // Broker Search inside Modal
  const [brokerSearch, setBrokerSearch] = useState('');

  // Categories & Locations state
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCatName, setNewCatName] = useState('');

  // Cascading Location state
  const [selectedState, setSelectedState] = useState('Telangana');
  const [_selectedDistrict, _setSelectedDistrict] = useState('Hyderabad');
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [newAreaInput, setNewAreaInput] = useState('');
  const [areasList, setAreasList] = useState<string[]>(['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Hitech City', 'Madhapur']);

  // Enquiry CRM search
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');

  // Gallery state
  const [galleryFranchiseId, setGalleryFranchiseId] = useState<string>(franchiseDb[0]?.id || '');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Derived filtered listings
  const filteredListings = useMemo(() => {
    return franchiseDb.filter(f => {
      if (selectedCategory !== 'All' && f.category !== selectedCategory && f.type !== selectedCategory) return false;
      if (selectedStatus !== 'All' && (f.approvalStatus || 'Published') !== selectedStatus) return false;
      if (selectedBroker !== 'All' && !f.assignedBrokerIds?.includes(selectedBroker) && f.dealerId !== selectedBroker) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchBrand = f.brand.toLowerCase().includes(q);
        const matchType = f.type.toLowerCase().includes(q);
        const matchLoc = f.location.toLowerCase().includes(q);
        const matchId = f.id.toLowerCase().includes(q);
        if (!matchBrand && !matchType && !matchLoc && !matchId) return false;
      }
      return true;
    });
  }, [franchiseDb, selectedCategory, selectedStatus, selectedBroker, searchQuery]);

  // Bulk Actions handler
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredListings.map(f => f.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkPublish = () => {
    if (selectedIds.length === 0) return;
    bulkPublishFranchises(selectedIds);
    setSelectedIds([]);
    showNotification(`Published ${selectedIds.length} franchise opportunities successfully.`, 'success');
  };

  const handleBulkArchive = () => {
    if (selectedIds.length === 0) return;
    bulkArchiveFranchises(selectedIds);
    setSelectedIds([]);
    showNotification(`Archived ${selectedIds.length} franchise opportunities.`, 'warning');
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} franchises?`)) {
      bulkDeleteFranchises(selectedIds);
      setSelectedIds([]);
      showNotification(`Deleted selected franchises successfully.`, 'warning');
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setModalMode('add');
    setEditingFranchise({
      id: `F${Date.now().toString().slice(-4)}`,
      brand: '',
      type: '',
      category: 'Food & Beverage',
      opportunityType: 'New Franchise',
      status: 'Active',
      investment: 30,
      investmentDisplay: '₹25 - ₹40 Lakhs',
      minInvestment: 25,
      maxInvestment: 40,
      franchiseFee: '₹5 Lakhs',
      securityDeposit: '₹2 Lakhs',
      workingCapital: '₹3 Lakhs',
      expectedRoi: '35% - 45%',
      paybackPeriod: '15 - 18 Months',
      profitMargin: '25%',
      royaltyFee: '5% of revenue',
      marketingFee: '1.5% of revenue',
      companyName: '',
      yearEstablished: 2020,
      existingOutletsCount: 10,
      totalFranchiseUnits: 25,
      brandRecognition: 'National',
      requiredExperience: 'Management background preferred',
      requiredStaff: '5 - 8 Staff',
      businessModel: 'FOFO',
      supportOffered: ['Location Assistance', 'Staff Training', 'Marketing Support'],
      minAreaSqFt: 500,
      maxAreaSqFt: 1200,
      shopType: 'High Street',
      floorPreference: 'Ground Floor',
      parkingRequirement: 'Adequate visitor parking',
      country: 'India',
      state: 'Telangana',
      district: 'Hyderabad',
      city: 'Hyderabad',
      area: 'Jubilee Hills',
      pincode: '500033',
      location: 'Hyderabad',
      latitude: 17.4065,
      longitude: 78.4772,
      rating: 4.8,
      reviewCount: 15,
      verified: true,
      trending: false,
      availableBranchCount: 3,
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'],
      logo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=200&q=80',
      trustScore: 95,
      assignedBrokerIds: [dealersDb[0]?.id || 'D1'],
      dealerId: dealersDb[0]?.id || 'D1',
      approvalStatus: 'Published',
      featured: false,
      premiumFranchise: false,
      createdDate: new Date().toISOString().split('T')[0]
    });
    setModalSubTab('basic');
    setIsModalOpen(true);
  };

  const openEditModal = (franchise: FranchiseListing) => {
    setModalMode('edit');
    setEditingFranchise({ ...franchise });
    setModalSubTab('basic');
    setIsModalOpen(true);
  };

  const handleDuplicate = (franchise: FranchiseListing) => {
    const duplicated: FranchiseListing = {
      ...franchise,
      id: `F${Date.now().toString().slice(-4)}`,
      brand: `${franchise.brand} (Copy)`,
      approvalStatus: 'Draft'
    };
    addFranchise(duplicated);
    showNotification(`Duplicated franchise '${franchise.brand}' to Drafts.`, 'success');
  };

  const handleSaveFranchise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFranchise.brand || !editingFranchise.type) {
      showNotification('Please fill in required fields (Brand Name & Business Type).', 'warning');
      return;
    }
    if (modalMode === 'add') {
      addFranchise(editingFranchise as FranchiseListing);
      showNotification(`Added new franchise opportunity '${editingFranchise.brand}'!`, 'success');
    } else {
      updateFranchise(editingFranchise.id!, editingFranchise);
      showNotification(`Updated franchise '${editingFranchise.brand}' successfully!`, 'success');
    }
    setIsModalOpen(false);
  };

  // Toggle Broker Assignment inside Modal
  const toggleBrokerAssignment = (brokerId: string) => {
    const current = editingFranchise.assignedBrokerIds || [];
    let updated: string[];
    if (current.includes(brokerId)) {
      updated = current.filter(id => id !== brokerId);
    } else {
      updated = [...current, brokerId];
    }
    setEditingFranchise({
      ...editingFranchise,
      assignedBrokerIds: updated,
      dealerId: updated[0] || editingFranchise.dealerId
    });
  };

  // Analytics metrics calculation
  const stats = useMemo(() => {
    const total = franchiseDb.length;
    const active = franchiseDb.filter(f => f.status === 'Active' && (f.approvalStatus === 'Published' || !f.approvalStatus)).length;
    const existingBiz = franchiseDb.filter(f => f.opportunityType === 'Existing Business').length;
    const newFranchise = franchiseDb.filter(f => f.opportunityType === 'New Franchise' || !f.opportunityType).length;
    const premiumCount = franchiseDb.filter(f => f.premiumFranchise || f.featured).length;
    const totalInvValue = franchiseDb.reduce((acc, f) => acc + (f.maxInvestment || f.investment || 30), 0);
    const totalEnquiries = franchiseEnquiriesDb.length;
    return { total, active, existingBiz, newFranchise, premiumCount, totalInvValue, totalEnquiries };
  }, [franchiseDb, franchiseEnquiriesDb]);

  // Export report simulation
  const exportReport = (format: string) => {
    showNotification(`Exporting Franchise Management Report as ${format.toUpperCase()}... Download initiated.`, 'success');
  };

  return (
    <div className="franchise-management-system" style={{ backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
      
      {/* Top System Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #E2E8F0', paddingBottom: '16px' }}>
        <div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '0.02em' }}>
            ENTERPRISE FRANCHISE MANAGEMENT SYSTEM
          </h2>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>
            Centralized hub for franchise opportunities, existing business sales, broker CRM workflows, approvals, and public website synchronization.
          </p>
        </div>
        <button
          onClick={openAddModal}
          style={{ padding: '12px 24px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", letterSpacing: '0.04em', boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)' }}
        >
          <FaPlus /> + ADD NEW FRANCHISE OPPORTUNITY
        </button>
      </div>

      {/* ================= TAB 1: LISTINGS & INVENTORY MANAGER ================= */}
      {activeTab === 'listings' && (
        <div>
          {/* Advanced Search & Filter Bar */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', border: '1px solid #E2E8F0', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexGrow: 1, gap: '12px', minWidth: '300px' }}>
              <div style={{ position: 'relative', flexGrow: 1 }}>
                <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search by Brand, Business Type, Location or ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #CBD5E1', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                style={{ padding: '10px 14px', border: '1px solid #CBD5E1', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}
              >
                <option value="All">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                style={{ padding: '10px 14px', border: '1px solid #CBD5E1', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Archived">Archived</option>
              </select>

              <select
                value={selectedBroker}
                onChange={e => setSelectedBroker(e.target.value)}
                style={{ padding: '10px 14px', border: '1px solid #CBD5E1', fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}
              >
                <option value="All">All Assigned Brokers</option>
                {dealersDb.map(d => <option key={d.id} value={d.id}>{d.name} ({d.company})</option>)}
              </select>
            </div>
          </div>

          {/* Bulk Action Controls */}
          {selectedIds.length > 0 && (
            <div style={{ backgroundColor: '#EFF6FF', padding: '14px 20px', border: '1px solid #BFDBFE', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: '#1E40AF', fontSize: '0.95rem' }}>
                ✓ Selected {selectedIds.length} Franchise Opportunity {selectedIds.length === 1 ? 'Listing' : 'Listings'}
              </span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={handleBulkPublish} style={{ padding: '8px 16px', backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
                  PUBLISH SELECTED
                </button>
                <button onClick={handleBulkArchive} style={{ padding: '8px 16px', backgroundColor: '#F59E0B', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
                  ARCHIVE SELECTED
                </button>
                <button onClick={handleBulkDelete} style={{ padding: '8px 16px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
                  DELETE SELECTED
                </button>
              </div>
            </div>
          )}

          {/* Listings Table */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '14px 16px', width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={filteredListings.length > 0 && selectedIds.length === filteredListings.length}
                      onChange={e => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th style={{ padding: '14px 16px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>BRAND & OPPORTUNITY</th>
                  <th style={{ padding: '14px 16px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>CATEGORY / TYPE</th>
                  <th style={{ padding: '14px 16px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>INVESTMENT & ROI</th>
                  <th style={{ padding: '14px 16px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>ASSIGNED BROKER</th>
                  <th style={{ padding: '14px 16px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>STATUS</th>
                  <th style={{ padding: '14px 16px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#334155', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748B', fontWeight: 600 }}>
                      No franchise listings matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredListings.map(fran => {
                    const assignedBroker = dealersDb.find(d => d.id === fran.dealerId || fran.assignedBrokerIds?.includes(d.id));
                    return (
                      <tr key={fran.id} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s' }}>
                        <td style={{ padding: '16px' }}>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(fran.id)}
                            onChange={e => handleSelectOne(fran.id, e.target.checked)}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <img src={fran.logo || fran.image} alt={fran.brand} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>
                                {fran.brand} {fran.featured && <span style={{ fontSize: '0.7rem', padding: '2px 6px', backgroundColor: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A', marginLeft: '6px', fontWeight: 700 }}>★ FEATURED</span>}
                              </div>
                              <div style={{ color: '#64748B', fontSize: '0.8rem' }}>ID: {fran.id} • 📍 {fran.location}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ padding: '4px 10px', backgroundColor: '#EFF6FF', color: '#1E40AF', fontWeight: 700, fontSize: '0.78rem', border: '1px solid #BFDBFE' }}>
                            {fran.category || 'Food & Beverage'}
                          </span>
                          <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>{fran.opportunityType || 'New Franchise'}</div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ fontWeight: 800, color: '#10B981', fontSize: '0.95rem' }}>{fran.investmentDisplay || `₹${fran.investment} Lakhs`}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Expected ROI: <strong>{fran.expectedRoi || '35% - 45%'}</strong></div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          {assignedBroker ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <img src={assignedBroker.image} alt={assignedBroker.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                              <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{assignedBroker.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{assignedBroker.company}</div>
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Unassigned</span>
                          )}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            padding: '4px 10px',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            backgroundColor: (fran.approvalStatus || 'Published') === 'Published' ? '#D1FAE5' : (fran.approvalStatus === 'Draft' ? '#FEF3C7' : '#FEE2E2'),
                            color: (fran.approvalStatus || 'Published') === 'Published' ? '#065F46' : (fran.approvalStatus === 'Draft' ? '#92400E' : '#991B1B'),
                            border: '1px solid currentColor'
                          }}>
                            {(fran.approvalStatus || 'Published').toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => openEditModal(fran)}
                              title="Edit Franchise"
                              style={{ padding: '8px 12px', backgroundColor: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleDuplicate(fran)}
                              title="Duplicate Listing"
                              style={{ padding: '8px 12px', backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              <FaCopy /> Copy
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete franchise '${fran.brand}'?`)) {
                                  deleteFranchise(fran.id);
                                  showNotification('Franchise deleted.', 'warning');
                                }
                              }}
                              title="Delete"
                              style={{ padding: '8px 12px', backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: APPROVAL WORKFLOW MANAGEMENT ================= */}
      {activeTab === 'approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '20px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
              FRANCHISE APPROVAL & GOVERNANCE BOARD
            </h3>
            <p style={{ margin: 0, color: '#64748B', fontSize: '0.88rem' }}>
              Review submitted franchise opportunities, add internal compliance review notes, and transition listings across lifecycle stages.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {['Draft', 'Pending Approval', 'Approved', 'Published', 'Archived'].map(stage => {
              const items = franchiseDb.filter(f => (f.approvalStatus || 'Published') === stage);
              return (
                <div key={stage} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #E2E8F0', paddingBottom: '10px', marginBottom: '14px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>
                      {stage.toUpperCase()} ({items.length})
                    </span>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: stage === 'Published' ? '#10B981' : (stage === 'Pending Approval' ? '#F59E0B' : '#64748B') }}></span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.length === 0 ? (
                      <p style={{ margin: '20px 0', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>No listings in {stage}.</p>
                    ) : (
                      items.map(f => (
                        <div key={f.id} style={{ padding: '14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem', marginBottom: '4px' }}>{f.brand}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '8px' }}>Inv: {f.investmentDisplay} • Broker: {f.dealerId || 'D1'}</div>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                            {stage !== 'Published' && (
                              <button
                                onClick={() => { updateFranchise(f.id, { approvalStatus: 'Published', status: 'Active' }); showNotification(`Published '${f.brand}'!`, 'success'); }}
                                style={{ padding: '6px 10px', backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}
                              >
                                ✓ PUBLISH
                              </button>
                            )}
                            {stage !== 'Pending Approval' && (
                              <button
                                onClick={() => { updateFranchise(f.id, { approvalStatus: 'Pending Approval' }); showNotification(`Moved '${f.brand}' to Pending Review.`, 'info'); }}
                                style={{ padding: '6px 10px', backgroundColor: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}
                              >
                                → TO REVIEW
                              </button>
                            )}
                            {stage !== 'Archived' && (
                              <button
                                onClick={() => { updateFranchise(f.id, { approvalStatus: 'Archived' }); showNotification(`Archived '${f.brand}'.`, 'warning'); }}
                                style={{ padding: '6px 10px', backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer' }}
                              >
                                ARCHIVE
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: FEATURED & PREMIUM CONTROL HUB ================= */}
      {activeTab === 'featured_premium' && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
            FEATURED & PREMIUM SPONSORSHIP CONTROL HUB
          </h3>
          <p style={{ margin: '0 0 20px 0', color: '#64748B', fontSize: '0.88rem' }}>
            Configure homepage priority ordering, spotlight card badges, verified trust emblems, and sponsored rank durations.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                <th style={{ padding: '14px 16px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>FRANCHISE BRAND</th>
                <th style={{ padding: '14px 16px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>FEATURED STATUS</th>
                <th style={{ padding: '14px 16px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>PREMIUM BADGE</th>
                <th style={{ padding: '14px 16px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>HOMEPAGE PRIORITY</th>
                <th style={{ padding: '14px 16px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>DURATION VALIDITY</th>
              </tr>
            </thead>
            <tbody>
              {franchiseDb.map(f => (
                <tr key={f.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '16px', fontWeight: 800, color: '#0F172A' }}>{f.brand}</td>
                  <td style={{ padding: '16px' }}>
                    <button
                      onClick={() => { updateFranchise(f.id, { featured: !f.featured }); showNotification(`Toggled featured status for '${f.brand}'.`, 'success'); }}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: f.featured ? '#10B981' : '#F1F5F9',
                        color: f.featured ? '#FFFFFF' : '#64748B',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {f.featured ? '★ FEATURED ACTIVE' : 'MARK AS FEATURED'}
                    </button>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button
                      onClick={() => { updateFranchise(f.id, { premiumFranchise: !f.premiumFranchise }); showNotification(`Toggled premium badge for '${f.brand}'.`, 'success'); }}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: f.premiumFranchise ? '#1E40AF' : '#F1F5F9',
                        color: f.premiumFranchise ? '#FFFFFF' : '#64748B',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {f.premiumFranchise ? '💎 PREMIUM VERIFIED' : 'ENABLE PREMIUM'}
                    </button>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <select
                      value={f.homepagePriority || 1}
                      onChange={e => { updateFranchise(f.id, { homepagePriority: Number(e.target.value) }); showNotification('Updated priority order.', 'info'); }}
                      style={{ padding: '6px 10px', border: '1px solid #CBD5E1', fontWeight: 700 }}
                    >
                      <option value={1}>Priority #1 (Top Spotlight)</option>
                      <option value={2}>Priority #2 (Upper Row)</option>
                      <option value={3}>Priority #3 (Standard Flow)</option>
                    </select>
                  </td>
                  <td style={{ padding: '16px', color: '#64748B', fontSize: '0.85rem' }}>
                    {f.featuredDuration || '30 Days'} (Exp: 2026-08-15)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= TAB 4: ANALYTICS DASHBOARD ================= */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* KPI Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '20px', border: '1px solid #E2E8F0', borderLeft: '4px solid #1E40AF' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>TOTAL FRANCHISE LISTINGS</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginTop: '6px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>{stats.total}</div>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', padding: '20px', border: '1px solid #E2E8F0', borderLeft: '4px solid #10B981' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>ACTIVE OPPORTUNITIES</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginTop: '6px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>{stats.active}</div>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', padding: '20px', border: '1px solid #E2E8F0', borderLeft: '4px solid #F59E0B' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>PREMIUM / FEATURED</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706', marginTop: '6px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>{stats.premiumCount}</div>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', padding: '20px', border: '1px solid #E2E8F0', borderLeft: '4px solid #8B5CF6' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.05em' }}>TOTAL LEADS / ENQUIRIES</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6D28D9', marginTop: '6px', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}>{stats.totalEnquiries}</div>
            </div>
          </div>

          {/* Breakdown Charts & Progress Bars */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
                CATEGORY-WISE OPPORTUNITY DISTRIBUTION
              </h4>
              {['Food & Beverage', 'Healthcare', 'Automobile', 'Retail', 'Education'].map((cat, idx) => {
                const count = franchiseDb.filter(f => f.category === cat || f.type.includes(cat.split(' ')[0])).length || (idx === 0 ? 1 : 0);
                const pct = Math.round((count / Math.max(stats.total, 1)) * 100);
                return (
                  <div key={cat} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>
                      <span>{cat}</span>
                      <span>{count} Listings ({pct}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.max(pct, 15)}%`, height: '100%', backgroundColor: idx === 0 ? '#1E40AF' : (idx === 1 ? '#10B981' : '#F59E0B') }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
                TOP PERFORMING ASSIGNED BROKERS
              </h4>
              {dealersDb.slice(0, 3).map(dealer => {
                const assignedCount = franchiseDb.filter(f => f.dealerId === dealer.id || f.assignedBrokerIds?.includes(dealer.id)).length;
                return (
                  <div key={dealer.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={dealer.image} alt={dealer.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>{dealer.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{dealer.company} • Rating: {dealer.rating}★</div>
                      </div>
                    </div>
                    <span style={{ padding: '4px 12px', backgroundColor: '#EFF6FF', color: '#1E40AF', fontWeight: 800, fontSize: '0.8rem', border: '1px solid #BFDBFE' }}>
                      {assignedCount} Franchises
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: CATEGORIES & LOCATIONS MASTER ================= */}
      {activeTab === 'categories_locations' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Categories Manager */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', margin: '0 0 14px 0' }}>
              FRANCHISE CATEGORY MASTER ({categories.length})
            </h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="New category name..."
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                style={{ flexGrow: 1, padding: '10px 14px', border: '1px solid #CBD5E1', outline: 'none' }}
              />
              <button
                onClick={() => {
                  if (!newCatName.trim()) return;
                  if (!categories.includes(newCatName.trim())) {
                    setCategories([...categories, newCatName.trim()]);
                    showNotification(`Added category '${newCatName}'!`, 'success');
                    setNewCatName('');
                  }
                }}
                style={{ padding: '10px 16px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                + ADD
              </button>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map((cat, idx) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>{idx + 1}. {cat}</span>
                  <button
                    onClick={() => {
                      if (categories.length <= 1) return;
                      setCategories(categories.filter(c => c !== cat));
                      showNotification(`Removed category '${cat}'.`, 'warning');
                    }}
                    style={{ color: '#DC2626', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cascading Location Hierarchy Manager */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', margin: '0 0 14px 0' }}>
              LOCATION HIERARCHY (State → District → City → Area)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>SELECT STATE / REGION</label>
                <input
                  type="text"
                  value={selectedState}
                  onChange={e => setSelectedState(e.target.value)}
                  placeholder="e.g. Andhra Pradesh, Telangana..."
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', fontWeight: 700, borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>SELECT CITY / DISTRICT</label>
                <input
                  type="text"
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  placeholder="e.g. Guntur, Hyderabad..."
                  style={{ width: '100%', padding: '10px', border: '1px solid #CBD5E1', fontWeight: 700, borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>MANAGE AREAS IN {selectedCity.toUpperCase()}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="New area (e.g. Kondapur)..."
                    value={newAreaInput}
                    onChange={e => setNewAreaInput(e.target.value)}
                    style={{ flexGrow: 1, padding: '10px 14px', border: '1px solid #CBD5E1' }}
                  />
                  <button
                    onClick={() => {
                      if (!newAreaInput.trim()) return;
                      setAreasList([...areasList, newAreaInput.trim()]);
                      setNewAreaInput('');
                      showNotification('Area added to location master.', 'success');
                    }}
                    style={{ padding: '10px 16px', backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + ADD AREA
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {areasList.map(area => (
                <span key={area} style={{ padding: '6px 12px', backgroundColor: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📍 {area}
                  <button onClick={() => setAreasList(areasList.filter(a => a !== area))} style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer', fontWeight: 800 }}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: FRANCHISE CRM & ENQUIRY MANAGEMENT ================= */}
      {activeTab === 'enquiries' && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              PROSPECTIVE FRANCHISEE CRM ({franchiseEnquiriesDb.length} LEADS)
            </h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Search lead or franchise..."
                value={enquirySearch}
                onChange={e => setEnquirySearch(e.target.value)}
                style={{ padding: '8px 14px', border: '1px solid #CBD5E1' }}
              />
              <select value={enquiryStatusFilter} onChange={e => setEnquiryStatusFilter(e.target.value)} style={{ padding: '8px 14px', border: '1px solid #CBD5E1', fontWeight: 700 }}>
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Meeting Scheduled">Meeting Scheduled</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                <th style={{ padding: '14px', fontSize: '0.85rem', fontWeight: 700 }}>CUSTOMER PROSPECT</th>
                <th style={{ padding: '14px', fontSize: '0.85rem', fontWeight: 700 }}>INTERESTED FRANCHISE</th>
                <th style={{ padding: '14px', fontSize: '0.85rem', fontWeight: 700 }}>BUDGET & LOCATION</th>
                <th style={{ padding: '14px', fontSize: '0.85rem', fontWeight: 700 }}>ASSIGNED BROKER</th>
                <th style={{ padding: '14px', fontSize: '0.85rem', fontWeight: 700 }}>LEAD STATUS</th>
                <th style={{ padding: '14px', fontSize: '0.85rem', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {franchiseEnquiriesDb
                .filter(enq => enquiryStatusFilter === 'All' || enq.status === enquiryStatusFilter)
                .map(enq => (
                  <tr key={enq.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>{enq.customerName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>📞 {enq.mobileNumber} • {enq.email}</div>
                    </td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#1E40AF' }}>{enq.interestedFranchise}</td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 700, color: '#10B981' }}>{enq.investmentBudget}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>📍 {enq.preferredLocation}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <select
                        value={enq.assignedBrokerId || 'D1'}
                        onChange={e => {
                          const dealer = dealersDb.find(d => d.id === e.target.value);
                          assignFranchiseEnquiryBroker(enq.id, e.target.value, dealer?.name || 'RealtyPlus Advisors');
                          showNotification(`Assigned lead to broker ${dealer?.name}.`, 'info');
                        }}
                        style={{ padding: '6px 10px', border: '1px solid #CBD5E1', fontWeight: 700, fontSize: '0.8rem' }}
                      >
                        {dealersDb.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <select
                        value={enq.status}
                        onChange={e => {
                          updateFranchiseEnquiryStatus(enq.id, e.target.value as any);
                          showNotification(`Updated CRM status to ${e.target.value}.`, 'success');
                        }}
                        style={{
                          padding: '6px 10px',
                          border: '1px solid #CBD5E1',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          backgroundColor: enq.status === 'New' ? '#FEF3C7' : '#EFF6FF',
                          color: enq.status === 'New' ? '#92400E' : '#1E40AF'
                        }}
                      >
                        <option value="New">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Meeting Scheduled">Meeting Scheduled</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Closed">Closed Won</option>
                        <option value="Lost">Closed Lost</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={() => { deleteFranchiseEnquiry(enq.id); showNotification('Lead removed.', 'warning'); }}
                        style={{ padding: '6px 12px', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= TAB 7: MEDIA & GALLERY HUB ================= */}
      {activeTab === 'gallery' && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              FRANCHISE MEDIA & GALLERY MANAGER
            </h3>
            <select
              value={galleryFranchiseId}
              onChange={e => setGalleryFranchiseId(e.target.value)}
              style={{ padding: '8px 14px', border: '1px solid #CBD5E1', fontWeight: 700 }}
            >
              {franchiseDb.map(f => <option key={f.id} value={f.id}>{f.brand} ({f.id})</option>)}
            </select>
          </div>

          <div style={{ border: '2px dashed #94A3B8', padding: '40px', textAlign: 'center', backgroundColor: '#F8FAFC', marginBottom: '24px' }}>
            <FaImages style={{ fontSize: '2.5rem', color: '#64748B', marginBottom: '12px' }} />
            <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#0F172A' }}>Drag & Drop Franchise Storefront Images, Floor Plans or PDF Brochures</h4>
            <p style={{ margin: '0 0 16px 0', color: '#64748B', fontSize: '0.85rem' }}>Supports high-resolution PNG, JPG, WebP images and PDF investment presentations.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <input
                type="text"
                placeholder="Or paste high-res image URL..."
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                style={{ width: '320px', padding: '10px', border: '1px solid #CBD5E1' }}
              />
              <button
                onClick={() => {
                  if (!newImageUrl.trim() || !galleryFranchiseId) return;
                  const item = franchiseDb.find(f => f.id === galleryFranchiseId);
                  if (item) {
                    const updatedImgs = [...(item.images || [item.image]), newImageUrl.trim()];
                    updateFranchise(item.id, { images: updatedImgs });
                    showNotification('Added photo to franchise gallery!', 'success');
                    setNewImageUrl('');
                  }
                }}
                style={{ padding: '10px 20px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                + ATTACH MEDIA
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {(franchiseDb.find(f => f.id === galleryFranchiseId)?.images || [franchiseDb.find(f => f.id === galleryFranchiseId)?.image]).map((img, i) => (
              <div key={i} style={{ position: 'relative', border: '1px solid #CBD5E1', borderRadius: '4px', overflow: 'hidden' }}>
                <img src={img} alt="Gallery item" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                <div style={{ padding: '8px', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>{i === 0 ? '★ COVER IMAGE' : `Slide #${i + 1}`}</span>
                  <button
                    onClick={() => {
                      const item = franchiseDb.find(f => f.id === galleryFranchiseId);
                      if (item && item.images && item.images.length > 1) {
                        updateFranchise(item.id, { images: item.images.filter((_, idx) => idx !== i) });
                        showNotification('Deleted photo from gallery.', 'warning');
                      } else {
                        showNotification('Cannot delete primary cover photo.', 'warning');
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontWeight: 800 }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 8: REPORTS & DATA EXPORT ================= */}
      {activeTab === 'reports' && (
        <div style={{ backgroundColor: '#FFFFFF', padding: '28px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
            ENTERPRISE FRANCHISE REPORTS & DATA EXPORT ENGINE
          </h3>
          <p style={{ margin: '0 0 24px 0', color: '#64748B', fontSize: '0.9rem' }}>
            Generate executive compliance reports, category inventory spreadsheets, and broker performance statements.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Complete Franchise Inventory Report', desc: 'Detailed snapshot of all active, draft, and closed opportunities with ROI specifications.' },
              { title: 'Category & Location Distribution Statement', desc: 'Geographic and sector-wise breakdown across major metropolitan hubs.' },
              { title: 'Broker Assignment & Lead Conversion Report', desc: 'Performance analytics tracking assigned brokers and CRM enquiry close rates.' }
            ].map((rep, i) => (
              <div key={i} style={{ padding: '20px', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>{rep.title}</h4>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748B' }}>{rep.desc}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => exportReport('Excel')} style={{ padding: '8px 14px', backgroundColor: '#10B981', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaFileExcel /> EXCEL
                  </button>
                  <button onClick={() => exportReport('CSV')} style={{ padding: '8px 14px', backgroundColor: '#3B82F6', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaFileCsv /> CSV
                  </button>
                  <button onClick={() => exportReport('PDF')} style={{ padding: '8px 14px', backgroundColor: '#EF4444', color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaFilePdf /> PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 7-SUBTAB ADD/EDIT FRANCHISE MODAL ================= */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', width: '95%', maxWidth: '1000px', maxHeight: '92vh', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', backgroundColor: '#1E40AF', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif", fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                {modalMode === 'add' ? '+ ADD NEW FRANCHISE OPPORTUNITY' : `EDIT FRANCHISE: ${editingFranchise.brand}`}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 700 }}>×</button>
            </div>

            {/* Modal Subnavigation */}
            <div style={{ display: 'flex', backgroundColor: '#F1F5F9', borderBottom: '1px solid #CBD5E1', overflowX: 'auto' }}>
              {[
                { id: 'basic', label: '1. Basic Info' },
                { id: 'investment', label: '2. Investment & ROI' },
                { id: 'business', label: '3. Business & Support' },
                { id: 'space', label: '4. Space Specs' },
                { id: 'location', label: '5. Location Hierarchy' },
                { id: 'media', label: '6. Media & Docs' },
                { id: 'broker', label: '7. Broker Assignment' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setModalSubTab(sub.id as any)}
                  style={{
                    padding: '12px 18px',
                    backgroundColor: modalSubTab === sub.id ? '#FFFFFF' : 'transparent',
                    color: modalSubTab === sub.id ? '#1E40AF' : '#64748B',
                    border: 'none',
                    borderBottom: modalSubTab === sub.id ? '3px solid #1E40AF' : 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveFranchise} style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
              
              {modalSubTab === 'basic' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>BRAND / FRANCHISE TITLE *</label>
                    <input
                      type="text"
                      required
                      value={editingFranchise.brand || ''}
                      onChange={e => setEditingFranchise({ ...editingFranchise, brand: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>BUSINESS SUBTYPE DESCRIPTION *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Artisanal Coffee & Bakery Chain"
                      value={editingFranchise.type || ''}
                      onChange={e => setEditingFranchise({ ...editingFranchise, type: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>FRANCHISE CATEGORY</label>
                    <select
                      value={editingFranchise.category || 'Food & Beverage'}
                      onChange={e => setEditingFranchise({ ...editingFranchise, category: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1' }}
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>OPPORTUNITY TYPE</label>
                    <select
                      value={editingFranchise.opportunityType || 'New Franchise'}
                      onChange={e => setEditingFranchise({ ...editingFranchise, opportunityType: e.target.value as any })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1' }}
                    >
                      <option value="New Franchise">New Franchise Opportunity</option>
                      <option value="Existing Business">Existing Running Business for Sale</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>DETAILED OPPORTUNITY OVERVIEW</label>
                    <textarea
                      rows={4}
                      value={editingFranchise.detailedDescription || ''}
                      onChange={e => setEditingFranchise({ ...editingFranchise, detailedDescription: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              )}

              {modalSubTab === 'investment' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>MINIMUM INVESTMENT (Lakhs ₹)</label>
                    <input
                      type="number"
                      value={editingFranchise.minInvestment || 25}
                      onChange={e => setEditingFranchise({ ...editingFranchise, minInvestment: Number(e.target.value), investmentDisplay: `₹${e.target.value} - ₹${editingFranchise.maxInvestment || 45} Lakhs` })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>MAXIMUM INVESTMENT (Lakhs ₹)</label>
                    <input
                      type="number"
                      value={editingFranchise.maxInvestment || 45}
                      onChange={e => setEditingFranchise({ ...editingFranchise, maxInvestment: Number(e.target.value), investmentDisplay: `₹${editingFranchise.minInvestment || 25} - ₹${e.target.value} Lakhs` })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>EXPECTED ROI (%)</label>
                    <input
                      type="text"
                      placeholder="e.g. 35% - 45%"
                      value={editingFranchise.expectedRoi || ''}
                      onChange={e => setEditingFranchise({ ...editingFranchise, expectedRoi: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>EXPECTED PAYBACK PERIOD</label>
                    <input
                      type="text"
                      placeholder="e.g. 14 - 18 Months"
                      value={editingFranchise.paybackPeriod || ''}
                      onChange={e => setEditingFranchise({ ...editingFranchise, paybackPeriod: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>FRANCHISE FEE</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹5 Lakhs"
                      value={editingFranchise.franchiseFee || ''}
                      onChange={e => setEditingFranchise({ ...editingFranchise, franchiseFee: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>ROYALTY FEE</label>
                    <input
                      type="text"
                      placeholder="e.g. 6% of monthly revenue"
                      value={editingFranchise.royaltyFee || ''}
                      onChange={e => setEditingFranchise({ ...editingFranchise, royaltyFee: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              )}

              {modalSubTab === 'business' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>LEGAL COMPANY NAME</label>
                    <input
                      type="text"
                      value={editingFranchise.companyName || ''}
                      onChange={e => setEditingFranchise({ ...editingFranchise, companyName: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>YEAR ESTABLISHED</label>
                    <input
                      type="number"
                      value={editingFranchise.yearEstablished || 2020}
                      onChange={e => setEditingFranchise({ ...editingFranchise, yearEstablished: Number(e.target.value) })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>EXISTING OPERATIONAL OUTLETS</label>
                    <input
                      type="number"
                      value={editingFranchise.existingOutletsCount || 10}
                      onChange={e => setEditingFranchise({ ...editingFranchise, existingOutletsCount: Number(e.target.value) })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>BUSINESS MODEL</label>
                    <input
                      type="text"
                      placeholder="FOFO / FOCO / COCO"
                      value={editingFranchise.businessModel || 'FOFO'}
                      onChange={e => setEditingFranchise({ ...editingFranchise, businessModel: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              )}

              {modalSubTab === 'space' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>MINIMUM AREA REQUIRED (Sq. Ft.)</label>
                    <input
                      type="number"
                      value={editingFranchise.minAreaSqFt || 500}
                      onChange={e => setEditingFranchise({ ...editingFranchise, minAreaSqFt: Number(e.target.value) })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>SHOP TYPE PREFERENCE</label>
                    <select
                      value={editingFranchise.shopType || 'High Street'}
                      onChange={e => setEditingFranchise({ ...editingFranchise, shopType: e.target.value as any })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1' }}
                    >
                      <option value="High Street">High Street Frontage</option>
                      <option value="Mall">Shopping Mall</option>
                      <option value="Standalone">Standalone Building</option>
                      <option value="Kiosk">Kiosk / Island</option>
                    </select>
                  </div>
                </div>
              )}

              {modalSubTab === 'location' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>STATE</label>
                    <input
                      type="text"
                      value={editingFranchise.state || 'Telangana'}
                      onChange={e => setEditingFranchise({ ...editingFranchise, state: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>CITY</label>
                    <input
                      type="text"
                      value={editingFranchise.city || 'Hyderabad'}
                      onChange={e => setEditingFranchise({ ...editingFranchise, city: e.target.value, location: `${editingFranchise.area || 'Jubilee Hills'}, ${e.target.value}` })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              )}

              {modalSubTab === 'media' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>PRIMARY COVER IMAGE URL</label>
                    <input
                      type="text"
                      value={editingFranchise.image || ''}
                      onChange={e => setEditingFranchise({ ...editingFranchise, image: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontWeight: 700, fontSize: '0.82rem', color: '#334155', display: 'block', marginBottom: '6px' }}>BRAND LOGO URL</label>
                    <input
                      type="text"
                      value={editingFranchise.logo || ''}
                      onChange={e => setEditingFranchise({ ...editingFranchise, logo: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              )}

              {modalSubTab === 'broker' && (
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: '#0F172A', fontSize: '1rem', fontWeight: 800 }}>
                    ASSIGN ONE OR MULTIPLE BROKERS FROM BROKER MANAGEMENT SYSTEM
                  </h4>
                  <input
                    type="text"
                    placeholder="Search broker by name or company..."
                    value={brokerSearch}
                    onChange={e => setBrokerSearch(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', marginBottom: '16px', boxSizing: 'border-box' }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                    {dealersDb
                      .filter(d => (d.name || d.companyName || '').toLowerCase().includes(brokerSearch.toLowerCase()) || (d.company || d.companyName || '').toLowerCase().includes(brokerSearch.toLowerCase()))
                      .map(dealer => {
                        const isAssigned = (editingFranchise.assignedBrokerIds || []).includes(dealer.id);
                        return (
                          <div
                            key={dealer.id}
                            onClick={() => toggleBrokerAssignment(dealer.id)}
                            style={{
                              padding: '14px',
                              border: isAssigned ? '2px solid #10B981' : '1px solid #CBD5E1',
                              backgroundColor: isAssigned ? '#ECFDF5' : '#FFFFFF',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderRadius: '4px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img src={dealer.image} alt={dealer.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                              <div>
                                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>{dealer.name}</div>
                                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{dealer.company} • {dealer.rating}★</div>
                              </div>
                            </div>
                            <span style={{ fontWeight: 800, color: isAssigned ? '#10B981' : '#94A3B8' }}>{isAssigned ? '✓ ASSIGNED' : '+ Assign'}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div style={{ marginTop: '28px', borderTop: '1px solid #CBD5E1', paddingTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '12px 20px', backgroundColor: '#F1F5F9', color: '#475569', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  style={{ padding: '12px 28px', backgroundColor: '#1E40AF', color: '#FFFFFF', border: 'none', fontWeight: 700, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif" }}
                >
                  {modalMode === 'add' ? '✓ SAVE & PUBLISH FRANCHISE' : '✓ SAVE CHANGES'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
