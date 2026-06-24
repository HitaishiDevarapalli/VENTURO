import React, { useState, useEffect } from 'react';
import { FaHome, FaBuilding, FaBriefcase, FaCoins, FaInfoCircle, FaPhoneAlt, FaChevronDown } from 'react-icons/fa';

interface NavbarProps {
  heroBgIndex: number;
}

export const Navbar: React.FC<NavbarProps> = ({ heroBgIndex }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
    { id: 'properties', label: 'Properties', icon: <FaHome />, dropdown: [
      { name: 'Flats', link: '#properties' },
      { name: 'Individual Houses', link: '#properties' },
      { name: 'Land', link: '#properties' },
    ]},
    { id: 'franchise', label: 'Franchise', icon: <FaBuilding />, dropdown: [
      { name: 'New Franchise', link: '#franchise' },
      { name: 'Existing Franchise', link: '#franchise' },
      { name: 'Franchise Directory', link: '#franchise' },
    ]},
    { id: 'business', label: 'Business', icon: <FaBriefcase />, dropdown: [
      { name: 'Buy Business', link: '#business' },
      { name: 'Sell Business', link: '#contact' },
      { name: 'Startup Acquisition', link: '#business' },
      { name: 'Existing Businesses', link: '#business' },
    ]},
    { id: 'finance', label: 'Finance', icon: <FaCoins />, dropdown: [
      { name: 'Health Insurance', link: '#finance' },
      { name: 'Property Insurance', link: '#finance' },
      { name: 'Vehicle Insurance', link: '#finance' },
      { name: 'Business Insurance', link: '#finance' },
      { name: 'Legal Services', link: '#finance' },
      { name: 'Tax Consultation', link: '#finance' },
      { name: 'Investment Advisory', link: '#finance' },
      { name: 'Company Registration', link: '#finance' },
      { name: 'Business Consulting', link: '#finance' },
    ]},
    { id: 'about', label: 'About Us', icon: <FaInfoCircle /> },
    { id: 'contact', label: 'Contact Us', icon: <FaPhoneAlt /> }
  ];

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setOpenDropdown(null);
  };

  const isDarkBg = heroBgIndex === 0 || heroBgIndex === 1;
  const navbarClass = scrolled 
    ? 'navbar-scrolled' 
    : (isDarkBg ? 'navbar-transparent' : 'navbar-transparent navbar-light-bg-mode');

  return (
    <nav className={`navbar ${navbarClass}`}>
      <div className="navbar-container">
        <a href="#hero" className="navbar-logo" onClick={() => handleScrollTo('hero')}>
          TheNexopp
        </a>

        <ul className="navbar-menu">
          {menuItems.map((item) => (
            <li 
              key={item.id} 
              className={`navbar-item ${activeSection === item.id ? 'active' : ''}`}
              onMouseEnter={() => item.dropdown && setOpenDropdown(item.id)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button 
                className="navbar-link" 
                onClick={() => handleScrollTo(item.id)}
              >
                <span className="navbar-icon">{item.icon}</span>
                <span className="navbar-text">{item.label}</span>
                {item.dropdown && <FaChevronDown className="navbar-chevron" />}
              </button>

              {item.dropdown && openDropdown === item.id && (
                <ul className="navbar-dropdown">
                  {item.dropdown.map((sub, idx) => (
                    <li key={idx} className="navbar-dropdown-item">
                      <a href={sub.link} className="navbar-dropdown-link" onClick={() => setOpenDropdown(null)}>
                        {sub.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button className="btn btn-gold navbar-cta" onClick={() => handleScrollTo('contact')}>
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
