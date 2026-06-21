import React, { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCategories from './components/PropertyCategories';
import FeaturedProperties from './components/FeaturedProperties';
import FranchiseMarketplace from './components/FranchiseMarketplace';
import BusinessMarketplace from './components/BusinessMarketplace';
import FinanceSection from './components/FinanceSection';
import WhyVenturo from './components/WhyVenturo';
import SuccessStories from './components/SuccessStories';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import MarketplaceExplorer from './components/MarketplaceExplorer';

export const App: React.FC = () => {
  const [heroBgIndex, setHeroBgIndex] = useState(0);

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

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="app-wrapper">
      <Navbar heroBgIndex={heroBgIndex} />
      <main>
        <Hero currentBg={heroBgIndex} setCurrentBg={setHeroBgIndex} />
        <PropertyCategories />
        <FeaturedProperties />
        <MarketplaceExplorer />
        <FranchiseMarketplace />
        <BusinessMarketplace />
        <FinanceSection />
        <WhyVenturo />
        <SuccessStories />
        <AboutUs />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
};

export default App;
