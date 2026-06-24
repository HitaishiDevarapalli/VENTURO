import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Category {
  title: string;
  image: string;
  count: string;
  tagline: string;
}

export const PropertyCategories: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = [
    {
      title: 'Flats',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200&h=800',
      count: '12,400+ Units',
      tagline: 'High-rise living with premium panoramic city views.'
    },
    {
      title: 'Individual Houses',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200&h=800',
      count: '8,200+ Homes',
      tagline: 'Spacious bespoke residences designed for private comfort.'
    },
    {
      title: 'Lands',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200&h=800',
      count: '9,800+ Plots',
      tagline: 'Premium residential zones & strategic developments.'
    }
  ];

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.category-card');
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

  return (
    <section id="properties" className="section-padding property-categories-section" ref={containerRef}>
      <div className="container">
        <span className="section-tag text-center">Premium Real Estate</span>
        <h2 className="section-title text-center">Property Portfolios</h2>
        <p className="section-subtitle text-center">
          Explore curated luxury residential and high-yield commercial assets across India’s leading growth corridors.
        </p>

        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <div key={idx} className="category-card premium-card">
              <div className="category-image-wrapper">
                <img src={cat.image} alt={cat.title} className="category-img" />
                <div className="category-overlay"></div>
                <span className="category-badge">{cat.count}</span>
              </div>
              <div className="category-info">
                <h3 className="category-card-title">{cat.title}</h3>
                <p className="category-card-tagline">{cat.tagline}</p>
                <button className="btn-text-link">Explore Listings &rarr;</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyCategories;
