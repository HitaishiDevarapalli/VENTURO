import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

export const Footer: React.FC = () => {
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

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-global">
      <div className="container footer-grid-container">
        {/* Brand & Tagline */}
        <div className="footer-brand-col">
          <h3 className="footer-logo">VENTURO</h3>
          <p className="footer-tagline">India's Unified Marketplace for Property, Business & Growth</p>
          <div className="footer-socials">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebookF /></a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="footer-links-col">
          <h4>Marketplace Portfolios</h4>
          <ul>
            <li><a href="#properties" onClick={(e) => { e.preventDefault(); handleScrollTo('properties'); }}>🏠 Properties Portfolio</a></li>
            <li><a href="#franchise" onClick={(e) => { e.preventDefault(); handleScrollTo('franchise'); }}>🏢 Franchise Marketplace</a></li>
            <li><a href="#business" onClick={(e) => { e.preventDefault(); handleScrollTo('business'); }}>💼 Business Registry</a></li>
            <li><a href="#finance" onClick={(e) => { e.preventDefault(); handleScrollTo('finance'); }}>💰 Finance & Advisory</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#about" onClick={(e) => { e.preventDefault(); handleScrollTo('about'); }}>ℹ About Our Story</a></li>
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); handleScrollTo('contact'); }}>📞 Schedule Callback</a></li>
            <li><a href="#hero" onClick={(e) => { e.preventDefault(); handleScrollTo('hero'); }}>⚡ Back to Top</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="footer-newsletter-col">
          <h4>Marketplace Brief</h4>
          <p>Get exclusive early-access alerts on off-market assets and business listings directly in your inbox.</p>
          
          {subscribed ? (
            <div className="newsletter-success">
              <p>Successfully subscribed to Venturo Brief.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="footer-subscribe-form">
              <input 
                type="email" 
                required 
                placeholder="Enter corporate email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-gold footer-sub-btn">Subscribe</button>
            </form>
          )}
        </div>
      </div>

      {/* Footer Bottom copyright */}
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p>&copy; {new Date().getFullYear()} VENTURO. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#contact" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#contact" onClick={(e) => e.preventDefault()}>Terms & Conditions</a>
            <a href="#contact" onClick={(e) => e.preventDefault()}>Disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
