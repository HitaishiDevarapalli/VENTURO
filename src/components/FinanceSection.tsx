import React from 'react';
import { FaHeartbeat, FaShieldAlt, FaCar, FaBriefcase, FaBalanceScale, FaFileInvoiceDollar, FaChartLine, FaRegBuilding, FaUserTie } from 'react-icons/fa';

interface InsuranceProduct {
  name: string;
  icon: React.ReactNode;
  coverage: string;
  claimProcess: string;
  price: string;
}

interface ServiceProduct {
  name: string;
  icon: React.ReactNode;
  desc: string;
}

export const FinanceSection: React.FC = () => {
  const insuranceList: InsuranceProduct[] = [
    {
      name: 'Health Insurance',
      icon: <FaHeartbeat />,
      coverage: 'Up to ₹1 Crore Cover',
      claimProcess: 'Cashless in 30 Mins',
      price: '₹450 / month'
    },
    {
      name: 'Property Insurance',
      icon: <FaShieldAlt />,
      coverage: 'Complete Structure & Content',
      claimProcess: 'Digital Valuation Survey',
      price: '₹800 / month'
    },
    {
      name: 'Vehicle Insurance',
      icon: <FaCar />,
      coverage: 'Zero Depreciation Coverage',
      claimProcess: 'Instant Self-Video Claim',
      price: '₹250 / month'
    },
    {
      name: 'Business Insurance',
      icon: <FaBriefcase />,
      coverage: 'Asset & Liability Protection',
      claimProcess: 'Dedicated Corporate Desk',
      price: '₹1,200 / month'
    }
  ];

  const servicesList: ServiceProduct[] = [
    {
      name: 'Legal Services',
      icon: <FaBalanceScale />,
      desc: 'Bespoke corporate drafting, real-estate title checks & representation.'
    },
    {
      name: 'Tax Consultation',
      icon: <FaFileInvoiceDollar />,
      desc: 'Corporate auditing, transfer pricing solutions, & GST compliance.'
    },
    {
      name: 'Investment Advisory',
      icon: <FaChartLine />,
      desc: 'High-yield private equity allocations & real-estate portfolio advisory.'
    },
    {
      name: 'Company Registration',
      icon: <FaRegBuilding />,
      desc: 'LLP, Private Limited, & NGO setup with absolute end-to-end filings.'
    },
    {
      name: 'Business Consulting',
      icon: <FaUserTie />,
      desc: 'Scale auditing, market entrance strategies, & franchise planning.'
    }
  ];

  return (
    <section id="finance" className="section-padding finance-section-global">
      <div className="container">
        <span className="section-tag text-center">Ecosystem Support</span>
        <h2 className="section-title text-center">Finance & Professional Services</h2>
        <p className="section-subtitle text-center">
          Access institutional-grade protection and premium corporate advisory services tailored for enterprise growth.
        </p>

        <div className="finance-split-layout">
          {/* Left Column: Insurance */}
          <div className="finance-column">
            <div className="column-header">
              <h3 className="column-title">Asset & Health Protection</h3>
              <p className="column-subtitle">Customizable insurance products with dedicated claim assistance desk.</p>
            </div>
            <div className="insurance-grid">
              {insuranceList.map((ins, idx) => (
                <div key={idx} className="insurance-card premium-card">
                  <div className="ins-header">
                    <span className="ins-icon">{ins.icon}</span>
                    <h4 className="ins-title">{ins.name}</h4>
                  </div>
                  <div className="ins-details">
                    <div className="ins-row">
                      <span className="label">Limit</span>
                      <span className="val">{ins.coverage}</span>
                    </div>
                    <div className="ins-row">
                      <span className="label">Claims</span>
                      <span className="val">{ins.claimProcess}</span>
                    </div>
                  </div>
                  <div className="ins-footer">
                    <span className="ins-price">Starting {ins.price}</span>
                    <button className="btn-text-link">Compare &rarr;</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Services */}
          <div className="finance-column">
            <div className="column-header">
              <h3 className="column-title">Corporate Advisory</h3>
              <p className="column-subtitle">Expert professional services ensuring absolute legal compliance and scalability.</p>
            </div>
            <div className="services-list">
              {servicesList.map((serv, idx) => (
                <div key={idx} className="service-card-item glass-card">
                  <div className="service-icon-wrapper">{serv.icon}</div>
                  <div className="service-card-content">
                    <h4 className="service-name">{serv.name}</h4>
                    <p className="service-desc">{serv.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinanceSection;
