import React, { useState, useEffect } from 'react';
import { 
  FaHandHoldingUsd, 
  FaCoins, 
  FaShieldAlt, 
  FaPercentage, 
  FaCalendarAlt, 
  FaBriefcase, 
  FaUserTie, 
  FaClock, 
  FaCheckCircle, 
  FaHeartbeat, 
  FaBuilding, 
  FaMoneyCheckAlt 
} from 'react-icons/fa';

interface FinanceCard {
  title: string;
  icon: React.ReactNode;
  tag: string;
  specs: {
    label: string;
    value: string;
    icon: React.ReactNode;
  }[];
  actionText: string;
}

interface FinanceSectionProps {
  onCategorySelect?: (category: 'loans' | 'finance' | 'insurance') => void;
  initialCategory?: 'loans' | 'finance' | 'insurance' | null;
}

export const FinanceSection: React.FC<FinanceSectionProps> = ({ onCategorySelect, initialCategory }) => {
  const [activeCategory, setActiveCategory] = useState<'loans' | 'finance' | 'insurance' | null>(initialCategory || null);
  const [showForm, setShowForm] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', requirements: '' });

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    } else {
      setActiveCategory(null);
    }
  }, [initialCategory]);

  useEffect(() => {
    const handleSelect = (e: Event) => {
      const cat = (e as CustomEvent).detail as 'loans' | 'finance' | 'insurance';
      if (onCategorySelect) {
        onCategorySelect(cat);
      } else {
        setActiveCategory(cat);
      }
    };
    window.addEventListener('select-finance-category', handleSelect);
    return () => window.removeEventListener('select-finance-category', handleSelect);
  }, [onCategorySelect]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setShowForm(null);
      setFormSubmitted(false);
      setFormData({ name: '', phone: '', email: '', requirements: '' });
    }, 3000);
  };

  const loansItems: FinanceCard[] = [
    {
      title: 'Home & Property Loan',
      icon: <FaBuilding className="text-amber-500" />,
      tag: 'Popular',
      specs: [
        { label: 'Cash In Hand', value: '₹ 50L - ₹ 10 Cr', icon: <FaHandHoldingUsd /> },
        { label: 'Interest Rate', value: '8.5% p.a. onwards', icon: <FaPercentage /> },
        { label: 'Max Tenure', value: 'Up to 30 Years', icon: <FaCalendarAlt /> },
        { label: 'Disbursal', value: 'Instant Digital Approval', icon: <FaMoneyCheckAlt /> }
      ],
      actionText: 'Apply Now'
    },
    {
      title: 'Business & Startup Loan',
      icon: <FaBriefcase className="text-amber-500" />,
      tag: 'Growth',
      specs: [
        { label: 'Cash In Hand', value: '₹ 10L - ₹ 5 Cr', icon: <FaHandHoldingUsd /> },
        { label: 'Interest Rate', value: '11.2% p.a. onwards', icon: <FaPercentage /> },
        { label: 'Max Tenure', value: 'Up to 7 Years', icon: <FaCalendarAlt /> },
        { label: 'Collateral', value: 'Unsecured Options Available', icon: <FaCheckCircle /> }
      ],
      actionText: 'Get Quote'
    }
  ];

  const financeItems: FinanceCard[] = [
    {
      title: 'Tax & Audit Consultation',
      icon: <FaUserTie className="text-amber-500" />,
      tag: 'Compliance',
      specs: [
        { label: 'Service', value: 'Corporate & Personal Tax', icon: <FaCoins /> },
        { label: 'Savings', value: 'Maximized Legal Deductions', icon: <FaPercentage /> },
        { label: 'Timeline', value: 'Same-Day Audits & Filings', icon: <FaClock /> },
        { label: 'Standard', value: '100% Compliance Guarantee', icon: <FaCheckCircle /> }
      ],
      actionText: 'Consult Expert'
    },
    {
      title: 'Investment & Wealth Advisory',
      icon: <FaCoins className="text-amber-500" />,
      tag: 'Strategic',
      specs: [
        { label: 'Focus', value: 'High-Yield Assets & PE', icon: <FaCoins /> },
        { label: 'Min Investment', value: '₹ 10 Lakhs onwards', icon: <FaHandHoldingUsd /> },
        { label: 'Updates', value: 'Real-time Portfolio Access', icon: <FaClock /> },
        { label: 'Advice', value: 'Tailored Asset Allocation', icon: <FaCheckCircle /> }
      ],
      actionText: 'Invest Wisely'
    }
  ];

  const insuranceItems: FinanceCard[] = [
    {
      title: 'Premium Health Insurance',
      icon: <FaHeartbeat className="text-amber-500" />,
      tag: 'Essential',
      specs: [
        { label: 'Max Cover', value: 'Up to ₹ 1 Crore Cover', icon: <FaShieldAlt /> },
        { label: 'Premium', value: 'Starting ₹ 450 / month', icon: <FaHandHoldingUsd /> },
        { label: 'Claim Process', value: 'Cashless in 30 Mins', icon: <FaClock /> },
        { label: 'Hospitals', value: '10,000+ Network Group', icon: <FaCheckCircle /> }
      ],
      actionText: 'Calculate Premium'
    },
    {
      title: 'Property & Asset Insurance',
      icon: <FaBuilding className="text-amber-500" />,
      tag: 'Security',
      specs: [
        { label: 'Coverage', value: 'Structure & Content Cover', icon: <FaShieldAlt /> },
        { label: 'Premium', value: 'Starting ₹ 800 / month', icon: <FaHandHoldingUsd /> },
        { label: 'Survey', value: 'Digital Valuation Survey', icon: <FaClock /> },
        { label: 'Support', value: 'Dedicated Claims Manager', icon: <FaCheckCircle /> }
      ],
      actionText: 'Protect Now'
    }
  ];

  const getActiveItems = () => {
    switch (activeCategory) {
      case 'loans': return loansItems;
      case 'finance': return financeItems;
      case 'insurance': return insuranceItems;
      default: return [];
    }
  };

  const getActiveTitle = () => {
    switch (activeCategory) {
      case 'loans': return 'Loans & Funding Solutions';
      case 'finance': return 'Finance & Advisory Services';
      case 'insurance': return 'Insurance & Protection Plans';
      default: return '';
    }
  };

  const handleToggleCategory = (cat: 'loans' | 'finance' | 'insurance') => {
    setActiveCategory(prev => prev === cat ? null : cat);
  };

  return (
    <section id="finance" className="section-padding finance-section-global" style={{ paddingTop: initialCategory ? '2rem' : '3rem' }}>
      <div className="container">
        {!initialCategory && (
          <div style={{ marginTop: '-1rem' }}>
            <span className="section-tag">Ecosystem Support</span>
            <h2 className="section-title">Loans, Finance & Insurance</h2>
          </div>
        )}

        {/* Categories Grid - Only show if no initialCategory (so it acts like a menu, and subpages act like new pages) */}
        {!initialCategory && (
          <div className="category-icon-grid" style={{ marginTop: '3rem', justifyContent: 'center', gap: '5rem' }}>
            
            <div 
              className={`category-icon-item ${activeCategory === 'loans' ? 'active' : ''}`} 
              onClick={() => {
                if (onCategorySelect) onCategorySelect('loans');
                else handleToggleCategory('loans');
              }}
            >
              <div className="category-icon-btn">
                <div className="category-icon-svg">
                  <FaHandHoldingUsd />
                </div>
              </div>
              <span className="category-icon-label" style={{ fontSize: '1.2rem' }}>Loans</span>
            </div>

            <div 
              className={`category-icon-item ${activeCategory === 'finance' ? 'active' : ''}`} 
              onClick={() => {
                if (onCategorySelect) onCategorySelect('finance');
                else handleToggleCategory('finance');
              }}
            >
              <div className="category-icon-btn">
                <div className="category-icon-svg">
                  <FaCoins />
                </div>
              </div>
              <span className="category-icon-label" style={{ fontSize: '1.2rem' }}>Finance</span>
            </div>

            <div 
              className={`category-icon-item ${activeCategory === 'insurance' ? 'active' : ''}`} 
              onClick={() => {
                if (onCategorySelect) onCategorySelect('insurance');
                else handleToggleCategory('insurance');
              }}
            >
              <div className="category-icon-btn">
                <div className="category-icon-svg">
                  <FaShieldAlt />
                </div>
              </div>
              <span className="category-icon-label" style={{ fontSize: '1.2rem' }}>Insurance</span>
            </div>

          </div>
        )}

        {/* Active Category Details Block */}
        {activeCategory && (
          <div className="finance-active-details" style={{ marginTop: !initialCategory ? '4rem' : '1rem' }}>
            {!initialCategory && (
              <h3 className="section-title text-center" style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>
                {getActiveTitle()}
              </h3>
            )}
            <div className="finance-active-cards-grid">
              {getActiveItems().map((item, itemIdx) => (
                <div key={itemIdx} className="finance-feed-card premium-card">
                  <div className="finance-card-header">
                    <div className="header-left">
                      <span className="finance-card-icon">{item.icon}</span>
                      <h4 className="finance-card-title">{item.title}</h4>
                    </div>
                    <span className="finance-card-tag">{item.tag}</span>
                  </div>

                  <div className="finance-card-specs">
                    {item.specs.map((spec, specIdx) => (
                      <div key={specIdx} className="finance-spec-item">
                        <span className="spec-icon">{spec.icon}</span>
                        <div className="spec-text">
                          <span className="spec-label">{spec.label}</span>
                          <span className="spec-val">{spec.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="finance-card-footer">
                    <button className="finance-action-btn" onClick={() => setShowForm(item.title)}>
                      {item.actionText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', width: '90%', maxWidth: '500px', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <button className="modal-close" onClick={() => setShowForm(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
              
              {!formSubmitted ? (
                <>
                  <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '1.5rem' }}>Apply for {showForm}</h3>
                  <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', width: '100%' }} />
                    <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', width: '100%' }} />
                    <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', width: '100%' }} />
                    <textarea placeholder="Specific Requirements / Amount" required value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} style={{ padding: '0.8rem 1rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '100px', fontFamily: 'inherit', width: '100%' }} />
                    <button type="submit" className="btn btn-gold" style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1.1rem', fontWeight: 600, width: '100%', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Submit Application</button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <FaCheckCircle style={{ fontSize: '4rem', color: '#4BB543', marginBottom: '1rem' }} />
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>Application Received!</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.5' }}>Our representative will contact you shortly regarding your {showForm} request.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default FinanceSection;
