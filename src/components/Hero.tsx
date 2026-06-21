import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface HeroProps {
  currentBg: number;
  setCurrentBg: React.Dispatch<React.SetStateAction<number>>;
}

export const Hero: React.FC<HeroProps> = ({ currentBg, setCurrentBg }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const buttonGroupRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  const backgrounds = [
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'
  ];

  useEffect(() => {
    // Background rotation timer
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    // Initial entrance animations using GSAP
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(headingRef.current, 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1.2, delay: 0.3 }
    )
    .fromTo(subRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1 }, 
      '-=0.8'
    )
    .fromTo(buttonGroupRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8 }, 
      '-=0.6'
    )
    .fromTo(counterRef.current?.children || [], 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, stagger: 0.15 }, 
      '-=0.4'
    );

    return () => clearInterval(interval);
  }, [backgrounds.length]);

  const stats = [
    { value: '50,000+', label: 'Properties Available' },
    { value: '5,000+', label: 'Businesses for Sale' },
    { value: '2,000+', label: 'Franchise Brands' },
    { value: '100+', label: 'Service Partners' }
  ];

  const isDarkBg = currentBg === 0 || currentBg === 1;

  return (
    <header id="hero" className={`hero-section ${isDarkBg ? 'hero-dark-mode' : 'hero-light-mode'}`} ref={heroRef}>
      {/* Cinematic Slideshow Background */}
      <div className="hero-bg-container">
        {backgrounds.map((bg, idx) => (
          <div 
            key={idx} 
            className={`hero-slide-img ${idx === currentBg ? 'active-slide' : ''}`}
            style={{ backgroundImage: `url(${bg})` }}
          />
        ))}
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content container">
        <h1 className="hero-heading" ref={headingRef}>
          India’s Unified Marketplace <br />
          <span>For Property, Business & Growth</span>
        </h1>
        
        <p className="hero-subheading" ref={subRef}>
          Buy, sell or rent properties, discover franchises, acquire businesses, access insurance 
          and professional services through one trusted ecosystem.
        </p>

        <div className="hero-buttons" ref={buttonGroupRef}>
          <button 
            className="btn btn-gold" 
            onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Marketplace
          </button>
          <button 
            className="btn btn-outline-gold"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Watch Demo
          </button>
        </div>

        <div className="hero-counters" ref={counterRef}>
          {stats.map((stat, idx) => (
            <div key={idx} className="counter-item">
              <div className="counter-number">{stat.value}</div>
              <div className="counter-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Hero;
