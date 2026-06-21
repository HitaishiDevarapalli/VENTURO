import React from 'react';

export const AboutUs: React.FC = () => {
  return (
    <section id="about" className="section-padding about-section">
      <div className="container">
        <div className="about-grid">
          {/* Left Column: Mission, Vision, Story */}
          <div className="about-text-content">
            <span className="section-tag">About Venturo</span>
            <h2 className="section-title">Redefining High-Value Asset Management</h2>
            <div className="accent-line-left"></div>

            <div className="about-paragraphs">
              <p className="about-story">
                <strong>Our Story:</strong> Founded with a vision to streamline complex Indian acquisition ecosystems, Venturo is the culmination of financial advisory expertise, enterprise brokerage, and luxury real estate networks. We identified a critical gap: high-net-worth investors were forced to navigate isolated silos to acquire properties, buy franchises, audit running businesses, and secure enterprise insurance. Venturo integrates these under a singular, trustworthy luxury portal.
              </p>
              
              <div className="mv-flex">
                <div className="mv-box">
                  <h4>Our Mission</h4>
                  <p>To deliver absolute transparency and frictionless speed for high-value private transactions, backed by institutional-grade audits and elite advisory networks.</p>
                </div>
                <div className="mv-box">
                  <h4>Our Vision</h4>
                  <p>To establish India's most respected digital registry and transaction network for premium real estate, operational franchises, and business assets.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Image & Trust Statistics Overlay */}
          <div className="about-image-wrapper">
            <div className="about-img-container">
              <img src="/assets/hero_skyline.png" alt="Venturo Executive Skyline" className="about-main-img" />
              <div className="about-overlay-stats glass-card">
                <div className="stat-card">
                  <span className="stat-num">₹2,500 Cr+</span>
                  <span className="stat-lbl">Transaction Volume Vetted</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num">12,000+</span>
                  <span className="stat-lbl">High-Net-Worth Members</span>
                </div>
                <div className="stat-card">
                  <span className="stat-num">99.8%</span>
                  <span className="stat-lbl">Clear Title Success Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
