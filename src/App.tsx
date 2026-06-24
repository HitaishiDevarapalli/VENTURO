import React, { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCategories from './components/PropertyCategories';
import FeaturedProperties from './components/FeaturedProperties';
import FranchiseMarketplace from './components/FranchiseMarketplace';
import BusinessMarketplace from './components/BusinessMarketplace';
import FinanceSection from './components/FinanceSection';
import WhyTheNexopp from './components/WhyTheNexopp';
import SuccessStories from './components/SuccessStories';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import MarketplaceExplorer from './components/MarketplaceExplorer';
import FlatsPage from './components/FlatsPage';
import { propertiesDb } from './db/marketplaceDb';
import type { PropertyListing } from './db/marketplaceDb';

export const App: React.FC = () => {
  const [heroBgIndex, setHeroBgIndex] = useState(0);
  const [showFlatsOnly, setShowFlatsOnly] = useState(false);
  const [detailProp, setDetailProp] = useState<PropertyListing | null>(null);

  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    // Event listener to open Flats page view
    const handleSelectCategory = (e: Event) => {
      const category = (e as CustomEvent).detail;
      if (category === 'Apartment') {
        setShowFlatsOnly(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('select-property-category', handleSelectCategory);

    return () => {
      lenis.destroy();
      window.removeEventListener('select-property-category', handleSelectCategory);
    };
  }, []);

  return (
    <div className="app-wrapper">
      <Navbar heroBgIndex={heroBgIndex} />
      <main>
        {showFlatsOnly ? (
          <FlatsPage 
            properties={propertiesDb} 
            onBack={() => setShowFlatsOnly(false)} 
            onExploreDetails={(prop) => setDetailProp(prop)}
          />
        ) : (
          <>
            <Hero currentBg={heroBgIndex} setCurrentBg={setHeroBgIndex} />
            <PropertyCategories />
            <FeaturedProperties />
            <MarketplaceExplorer />
            <FranchiseMarketplace />
            <BusinessMarketplace />
            <FinanceSection />
            <WhyTheNexopp />
            <SuccessStories />
            <AboutUs />
            <ContactUs />
          </>
        )}
      </main>
      <Footer />

      {/* Simulated Detail Page popout panel */}
      {detailProp && (
        <div className="property-details-sheet-overlay" onClick={() => setDetailProp(null)}>
          <div className="property-details-sheet premium-card" onClick={(e) => e.stopPropagation()}>
            <button className="popover-close-btn" style={{ top: '1.5rem', right: '1.5rem' }} onClick={() => setDetailProp(null)}>&times;</button>
            <span className="landscape-type-badge">{detailProp.subType} • {detailProp.category}</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginTop: '0.5rem', marginBottom: '1.5rem' }}>{detailProp.title}</h2>
            <div className="property-gallery-grid">
              <img src={detailProp.image} alt="" className="gallery-main-img" />
              <div className="gallery-thumbnails">
                <img src={detailProp.gallery?.[0] || detailProp.image} alt="" className="gallery-thumb" />
                <img src={detailProp.gallery?.[1] || detailProp.image} alt="" className="gallery-thumb" />
              </div>
            </div>
            <div className="details-split-layout">
              <div>
                <h4 className="flex-sub-title">Specification Parameters</h4>
                <div className="detail-specs-grid">
                  <div className="spec-item">
                    <label>Ecosystem Price</label>
                    <span className="block text-lg font-bold text-slate-800 mt-1">{detailProp.priceDisplay}</span>
                  </div>
                  <div className="spec-item">
                    <label>Total Space</label>
                    <span className="block text-lg font-bold text-slate-800 mt-1">{detailProp.areaSqFt}</span>
                  </div>
                  <div className="spec-item">
                    <label>Availability Status</label>
                    <span className="block text-lg font-bold text-slate-800 mt-1">{detailProp.propertyStatus || 'Available'}</span>
                  </div>
                </div>
                <h4 className="flex-sub-title mt-6">Overview description</h4>
                <p className="text-slate-600 leading-relaxed mb-6">{detailProp.description}</p>
              </div>
              <div>
                <div className="seller-profile-sheet-v2">
                  <h4 className="font-semibold text-slate-800 mb-4">Assigned Portfolio Director</h4>
                  <div className="mt-6 flex flex-col gap-3">
                    <button className="btn btn-gold w-full" onClick={() => alert('Consultation inquiry submitted!')}>
                      Contact Representative
                    </button>
                    <button className="btn btn-secondary w-full" onClick={() => alert('Visit schedule requested!')}>
                      Schedule Site Visit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
