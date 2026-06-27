import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaWhatsapp } from 'react-icons/fa';

interface FooterProps {
  onNavigate?: (page: string) => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onScrollToSection }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 3000);
  };

  const handleLinkClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    action();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (onScrollToSection) {
      onScrollToSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const linkStyle: React.CSSProperties = {
    color: '#9CA3AF',
    textDecoration: 'none',
    fontSize: '0.9rem',
    lineHeight: '2',
    display: 'block',
    cursor: 'pointer',
    transition: 'color 0.2s',
  };

  const columnHeaderStyle: React.CSSProperties = {
    color: '#FFFFFF',
    textTransform: 'uppercase',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '1.5px',
    marginBottom: '16px',
  };

  const socialIconStyle: React.CSSProperties = {
    color: '#9CA3AF',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'color 0.2s',
  };

  return (
    <footer style={{ backgroundColor: '#1F2937', color: '#FFFFFF', padding: '60px 0 0 0' }}>
      {/* Top Row */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1.3fr',
          gap: '40px',
        }}
      >
        {/* Column 1 - Newsletter */}
        <div>
          <h3
            style={{
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '1.2rem',
              margin: '0 0 10px 0',
              lineHeight: '1.4',
            }}
          >
            Never Miss an Opportunity
          </h3>
          <p
            style={{
              color: '#9CA3AF',
              fontSize: '0.9rem',
              margin: '0 0 20px 0',
              lineHeight: '1.6',
            }}
          >
            Subscribe to get the best deals &amp; opportunities straight to your inbox.
          </p>

          {subscribed ? (
            <div
              style={{
                color: '#16A34A',
                fontSize: '0.9rem',
                fontWeight: 600,
                padding: '10px 0',
              }}
            >
              ✓ Successfully subscribed!
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{
                display: 'flex',
                gap: '0',
                maxWidth: '380px',
              }}
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid #374151',
                  borderRight: 'none',
                  borderRadius: '6px 0 0 6px',
                  backgroundColor: '#374151',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '0 6px 6px 0',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* Column 2 - EXPLORE */}
        <div>
          <h4 style={columnHeaderStyle}>EXPLORE</h4>
          <a href="#" onClick={(e) => handleLinkClick(e, () => onNavigate?.('propertiesPage'))} style={linkStyle}>Property</a>
          <a href="#" onClick={(e) => handleLinkClick(e, () => onNavigate?.('franchisePage'))} style={linkStyle}>Franchise</a>
          <a href="#" onClick={(e) => handleLinkClick(e, () => onNavigate?.('financePage'))} style={linkStyle}>Finance</a>
          <a href="#" onClick={(e) => handleLinkClick(e, () => onNavigate?.('insurancePage'))} style={linkStyle}>Insurance</a>
          <a href="#" onClick={(e) => handleLinkClick(e, () => onNavigate?.('financeServicePage'))} style={linkStyle}>Investments</a>
        </div>

        {/* Column 3 - COMPANY */}
        <div>
          <h4 style={columnHeaderStyle}>COMPANY</h4>
          <a href="#" onClick={(e) => handleScrollClick(e, 'about')} style={linkStyle}>About Us</a>
          <a href="#" onClick={(e) => handleScrollClick(e, 'about')} style={linkStyle}>Careers</a>
          <a href="#" onClick={(e) => handleScrollClick(e, 'about')} style={linkStyle}>Blog</a>
          <a href="#" onClick={(e) => handleScrollClick(e, 'about')} style={linkStyle}>Media Kit</a>
          <a href="#" onClick={(e) => handleScrollClick(e, 'contact')} style={linkStyle}>Contact Us</a>
        </div>

        {/* Column 4 - SUPPORT */}
        <div>
          <h4 style={columnHeaderStyle}>SUPPORT</h4>
          <a href="#" onClick={(e) => handleScrollClick(e, 'contact')} style={linkStyle}>Help Center</a>
          <a href="#" onClick={(e) => handleScrollClick(e, 'contact')} style={linkStyle}>FAQs</a>
          <a href="#" onClick={(e) => handleScrollClick(e, 'contact')} style={linkStyle}>Terms &amp; Conditions</a>
          <a href="#" onClick={(e) => handleScrollClick(e, 'contact')} style={linkStyle}>Privacy Policy</a>
          <a href="#" onClick={(e) => handleScrollClick(e, 'contact')} style={linkStyle}>Sitemap</a>
        </div>

        {/* Column 5 - FOLLOW US */}
        <div>
          <h4 style={columnHeaderStyle}>FOLLOW US</h4>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={socialIconStyle}>
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={socialIconStyle}>
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={socialIconStyle}>
              <FaLinkedinIn />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={socialIconStyle}>
              <FaYoutube />
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={socialIconStyle}>
              <FaWhatsapp />
            </a>
          </div>

          <h4 style={{ ...columnHeaderStyle, marginTop: '0' }}>DOWNLOAD APP</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              onClick={() => window.open('https://play.google.com/store', '_blank')}
              style={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px',
                padding: '10px 16px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <span style={{ color: '#9CA3AF', fontSize: '0.65rem', display: 'block' }}>
                GET IT ON
              </span>
              <span style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600 }}>
                Google Play
              </span>
            </div>
            <div
              onClick={() => window.open('https://apps.apple.com', '_blank')}
              style={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px',
                padding: '10px 16px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <span style={{ color: '#9CA3AF', fontSize: '0.65rem', display: 'block' }}>
                DOWNLOAD ON THE
              </span>
              <span style={{ color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600 }}>
                App Store
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div
        style={{
          borderTop: '1px solid #374151',
          marginTop: '48px',
          padding: '20px 24px',
          maxWidth: '1200px',
          margin: '48px auto 0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p style={{ color: '#9CA3AF', fontSize: '0.85rem', margin: 0 }}>
            © 2024 TheNexOop. All Rights Reserved.
          </p>
          <p style={{ color: '#9CA3AF', fontSize: '0.85rem', margin: 0 }}>
            Made with ❤️ for Your Next Opportunity
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
