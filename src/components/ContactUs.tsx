import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'Properties',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        category: 'Properties',
        message: ''
      });
    }, 4000);
  };

  return (
    <section id="contact" className="section-padding contact-section">
      <div className="container">
        <div className="contact-grid">
          {/* Left Column: Form */}
          <div className="contact-form-container premium-card">
            <h3 className="form-heading">Initiate Consultation</h3>
            <p className="form-subheading">Submit your requirements and an acquisition director will reach out within 24 hours.</p>

            {submitted ? (
              <div className="submission-success">
                <h4>Thank You</h4>
                <p>Your inquiry has been logged securely. A portfolio director has been assigned and will call you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="luxury-form">
                <div className="form-row-double">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Ananth Kumar" 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Contact Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="e.g. +91 98765 43210" 
                    />
                  </div>
                </div>

                <div className="form-row-double">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="e.g. ananth@example.com" 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Inquiry Portfolio</label>
                    <select 
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="Properties">Properties (Buy, Sell, Rent)</option>
                      <option value="Franchise">Franchise Opportunities</option>
                      <option value="Business">Business Acquisition / Sale</option>
                      <option value="Finance">Finance & Insurance Desk</option>
                      <option value="Services">Professional Advisory Desk</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Requirements / Notes</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Provide details about target locations, budgets, or business industries..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-gold w-full mt-2">
                  Request Confidential Callback
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Office Details & Mock Map */}
          <div className="contact-details-container">
            <span className="section-tag">Registry Headquarters</span>
            <h2 className="section-title">Get In Touch</h2>
            
            <div className="contact-info-list">
              <div className="contact-info-item">
                <span className="info-icon"><FaMapMarkerAlt /></span>
                <div className="info-text">
                  <h4>TheNexopp Towers</h4>
                  <p>Level 14, Financial District, Gachibowli, Hyderabad - 500032</p>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="info-icon"><FaPhoneAlt /></span>
                <div className="info-text">
                  <h4>Priority Desk</h4>
                  <p>+91 40 4900 2200 / +91 80 5600 7800</p>
                </div>
              </div>
              <div className="contact-info-item">
                <span className="info-icon"><FaEnvelope /></span>
                <div className="info-text">
                  <h4>Email Inquiries</h4>
                  <p>desk@thenexopp.in / acquisitions@thenexopp.in</p>
                </div>
              </div>
            </div>

            {/* Mock Map widget */}
            <div className="mock-map-widget premium-card">
              <div className="map-overlay">
                <FaMapMarkerAlt className="map-pin" />
                <span className="map-label">TheNexopp HQ (Gachibowli)</span>
              </div>
              <div className="map-grid-pattern"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
