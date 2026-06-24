import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Category {
  title: string;
  image: string;
  count: string;
  tagline: string;
  searchType: string;
}

export const PropertyCategories: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = [
    {
      title: 'Flats & Apartments',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
      count: '1,240 Listings',
      tagline: 'High-rise living with premium panoramic city views.',
      searchType: 'Apartment'
    },
    {
      title: 'Individual Houses',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
      count: '890 Listings',
      tagline: 'Spacious bespoke residences and luxury villas designed for private comfort.',
      searchType: 'Villa'
    },
    {
      title: 'Lands & Plots',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
      count: '670 Listings',
      tagline: 'Premium residential zones & strategic land developments.',
      searchType: 'Plot'
    }
  ];

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.category-landscape-card');
    if (cards) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, []);

  const handleCategoryClick = (categoryType: string) => {
    const explorerSection = document.getElementById('marketplace-explorer');
    if (explorerSection) {
      explorerSection.scrollIntoView({ behavior: 'smooth' });
      // Dispatch custom event to trigger filter selection in MarketplaceExplorer
      const event = new CustomEvent('select-property-category', { detail: categoryType });
      window.dispatchEvent(event);
    }
  };

  return (
    <section id="properties" className="section-padding property-categories-section" ref={containerRef}>
      <div className="container">
        <span className="section-tag text-center">Premium Real Estate</span>
        <h2 className="section-title text-center">Property Portfolios</h2>
        <p className="section-subtitle text-center">
          Explore curated luxury residential and high-yield commercial assets across India’s leading growth corridors.
        </p>

        <div className="categories-landscape-list">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="category-landscape-card premium-card"
              onClick={() => handleCategoryClick(cat.searchType)}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-landscape-image-wrapper">
                <img src={cat.image} alt={cat.title} className="category-landscape-img" />
                <div className="category-landscape-overlay"></div>
              </div>
              <div className="category-landscape-info">
                <div>
                  <span className="category-landscape-badge">{cat.count}</span>
                  <h3 className="category-landscape-title">{cat.title}</h3>
                  <p className="category-landscape-tagline">{cat.tagline}</p>
                </div>
                <button className="btn btn-gold btn-landscape-explore">
                  Explore Portfolios &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyCategories;
