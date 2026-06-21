import React, { useState } from 'react';
import { 
  addProperty, 
  addFranchise, 
  addBusiness
} from '../db/marketplaceDb';
import type {
  PropertyListing,
  FranchiseListing,
  BusinessListing
} from '../db/marketplaceDb';

interface AdminPanelProps {
  onRefresh: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'franchises' | 'businesses'>('properties');
  
  // Property Form State
  const [propTitle, setPropTitle] = useState('');
  const [propCity, setPropCity] = useState('Hyderabad');
  const [propArea, setPropArea] = useState('');
  const [propPrice, setPropPrice] = useState('');
  const [propType, setPropType] = useState<'Apartment' | 'Villa' | 'House' | 'Plot' | 'Commercial'>('Apartment');
  const [propStatus, setPropStatus] = useState<'Buy' | 'Sell' | 'Rent'>('Buy');
  const [propLat, setPropLat] = useState('17.44');
  const [propLon, setPropLon] = useState('78.37');
  
  // Franchise Form State
  const [franBrand, setFranBrand] = useState('');
  const [franType, setFranType] = useState('Restaurant Franchise');
  const [franInvest, setFranInvest] = useState('');
  const [franCity, setFranCity] = useState('Hyderabad');
  const [franLat, setFranLat] = useState('17.44');
  const [franLon, setFranLon] = useState('78.37');

  // Business Form State
  const [bizName, setBizName] = useState('');
  const [bizIndustry, setBizIndustry] = useState('Food & Beverage');
  const [bizPrice, setBizPrice] = useState('');
  const [bizCity, setBizCity] = useState('Hyderabad');
  const [bizLat, setBizLat] = useState('17.44');
  const [bizLon, setBizLon] = useState('78.37');

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const newProp: PropertyListing = {
      id: 'P_' + Date.now(),
      dealerId: 'D1',
      title: propTitle,
      description: 'Newly listed premium asset with top tier approvals.',
      image: '/assets/luxury_apartment.png',
      state: propCity === 'Bengaluru' ? 'Karnataka' : (propCity === 'Hyderabad' ? 'Telangana' : 'Andhra Pradesh'),
      district: propCity === 'Hyderabad' ? 'Rangareddy' : propCity,
      city: propCity,
      area: propArea || 'Central Zone',
      latitude: parseFloat(propLat),
      longitude: parseFloat(propLon),
      price: parseFloat(propPrice),
      priceDisplay: `₹${propPrice} Lakhs`,
      category: propType,
      status: propStatus,
      areaSqFt: '2000 Sq Ft',
      rating: 4.8,
      reviewCount: 1,
      verified: true,
      premium: true,
      trending: true,
      bestSeller: false,
      availabilityCount: 1,
      trustScore: 95,
      createdDate: new Date().toISOString().split('T')[0]
    };
    addProperty(newProp);
    onRefresh();
    // Reset Form
    setPropTitle('');
    setPropPrice('');
    setPropArea('');
  };

  const handleAddFranchise = (e: React.FormEvent) => {
    e.preventDefault();
    const newFran: FranchiseListing = {
      id: 'F_' + Date.now(),
      brand: franBrand,
      type: franType,
      investment: parseFloat(franInvest),
      investmentDisplay: `₹${franInvest} Lakhs`,
      location: `${franCity}, Central Hub`,
      state: franCity === 'Hyderabad' ? 'Telangana' : 'Andhra Pradesh',
      city: franCity,
      latitude: parseFloat(franLat),
      longitude: parseFloat(franLon),
      rating: 4.7,
      reviewCount: 1,
      verified: true,
      trending: true,
      availableBranchCount: 2,
      image: '/assets/business_restaurant.png',
      logo: '⭐',
      trustScore: 94
    };
    addFranchise(newFran);
    onRefresh();
    setFranBrand('');
    setFranInvest('');
  };

  const handleAddBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    const newBiz: BusinessListing = {
      id: 'B_' + Date.now(),
      name: bizName,
      industry: bizIndustry,
      location: `${bizCity}, Prime Area`,
      state: bizCity === 'Hyderabad' ? 'Telangana' : 'Andhra Pradesh',
      city: bizCity,
      latitude: parseFloat(bizLat),
      longitude: parseFloat(bizLon),
      revenue: '₹50 Lakhs / yr',
      price: parseFloat(bizPrice),
      priceDisplay: `₹${bizPrice} Lakhs`,
      rating: 4.8,
      reviewCount: 1,
      verified: true,
      trending: true,
      sellerProfile: 'Corporate Seller',
      image: '/assets/business_it_office.png',
      trustScore: 92
    };
    addBusiness(newBiz);
    onRefresh();
    setBizName('');
    setBizPrice('');
  };

  return (
    <div className="admin-dashboard-panel premium-card">
      <div className="admin-header">
        <h3>Ecosystem Registry Management</h3>
        <div className="admin-tabs">
          <button className={`admin-tab-btn ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>Properties</button>
          <button className={`admin-tab-btn ${activeTab === 'franchises' ? 'active' : ''}`} onClick={() => setActiveTab('franchises')}>Franchises</button>
          <button className={`admin-tab-btn ${activeTab === 'businesses' ? 'active' : ''}`} onClick={() => setActiveTab('businesses')}>Businesses</button>
        </div>
      </div>

      <div className="admin-body">
        {activeTab === 'properties' && (
          <form onSubmit={handleAddProperty} className="admin-form">
            <div className="admin-form-grid">
              <div className="form-field">
                <label>Property Name</label>
                <input type="text" value={propTitle} onChange={(e) => setPropTitle(e.target.value)} placeholder="e.g. Skyline Residency" required />
              </div>
              <div className="form-field">
                <label>Budget (Lakhs)</label>
                <input type="number" value={propPrice} onChange={(e) => setPropPrice(e.target.value)} placeholder="e.g. 75" required />
              </div>
              <div className="form-field">
                <label>City Hub</label>
                <select value={propCity} onChange={(e) => setPropCity(e.target.value)}>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Guntur">Guntur</option>
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Visakhapatnam">Visakhapatnam</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>
              <div className="form-field">
                <label>Local Area</label>
                <input type="text" value={propArea} onChange={(e) => setPropArea(e.target.value)} placeholder="e.g. Benz Circle" required />
              </div>
              <div className="form-field">
                <label>Category</label>
                <select value={propType} onChange={(e) => setPropType(e.target.value as any)}>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House</option>
                  <option value="Plot">Plot</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              <div className="form-field">
                <label>Listing Status</label>
                <select value={propStatus} onChange={(e) => setPropStatus(e.target.value as any)}>
                  <option value="Buy">For Buy</option>
                  <option value="Sell">For Sell</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>
              <div className="form-field">
                <label>Latitude</label>
                <input type="text" value={propLat} onChange={(e) => setPropLat(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Longitude</label>
                <input type="text" value={propLon} onChange={(e) => setPropLon(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn btn-gold mt-4">Publish Property Listing</button>
          </form>
        )}

        {activeTab === 'franchises' && (
          <form onSubmit={handleAddFranchise} className="admin-form">
            <div className="admin-form-grid">
              <div className="form-field">
                <label>Brand Brand</label>
                <input type="text" value={franBrand} onChange={(e) => setFranBrand(e.target.value)} placeholder="e.g. Burger House" required />
              </div>
              <div className="form-field">
                <label>Franchise Type</label>
                <input type="text" value={franType} onChange={(e) => setFranType(e.target.value)} placeholder="e.g. Restaurant Franchise" required />
              </div>
              <div className="form-field">
                <label>Investment (Lakhs)</label>
                <input type="number" value={franInvest} onChange={(e) => setFranInvest(e.target.value)} placeholder="e.g. 15" required />
              </div>
              <div className="form-field">
                <label>City Hub</label>
                <select value={franCity} onChange={(e) => setFranCity(e.target.value)}>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Guntur">Guntur</option>
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Visakhapatnam">Visakhapatnam</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>
              <div className="form-field">
                <label>Latitude</label>
                <input type="text" value={franLat} onChange={(e) => setFranLat(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Longitude</label>
                <input type="text" value={franLon} onChange={(e) => setFranLon(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn btn-gold mt-4">Publish Franchise Opportunity</button>
          </form>
        )}

        {activeTab === 'businesses' && (
          <form onSubmit={handleAddBusiness} className="admin-form">
            <div className="admin-form-grid">
              <div className="form-field">
                <label>Business Name</label>
                <input type="text" value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="e.g. Premium Gym Hub" required />
              </div>
              <div className="form-field">
                <label>Industry</label>
                <select value={bizIndustry} onChange={(e) => setBizIndustry(e.target.value)}>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Retail / FMCG">Retail / FMCG</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Fitness / Lifestyle">Fitness / Lifestyle</option>
                </select>
              </div>
              <div className="form-field">
                <label>Asking Price (Lakhs)</label>
                <input type="number" value={bizPrice} onChange={(e) => setBizPrice(e.target.value)} placeholder="e.g. 45" required />
              </div>
              <div className="form-field">
                <label>City Hub</label>
                <select value={bizCity} onChange={(e) => setBizCity(e.target.value)}>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Guntur">Guntur</option>
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Visakhapatnam">Visakhapatnam</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>
              <div className="form-field">
                <label>Latitude</label>
                <input type="text" value={bizLat} onChange={(e) => setBizLat(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Longitude</label>
                <input type="text" value={bizLon} onChange={(e) => setBizLon(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn btn-gold mt-4">Publish Business Registry</button>
          </form>
        )}
      </div>
    </div>
  );
};
export default AdminPanel;
