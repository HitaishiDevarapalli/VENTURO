import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaStore, FaHotel } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);



interface FranchiseMarketplaceProps {
  onExploreResales?: () => void;
  onExploreNew?: () => void;
  onPropertyClick?: (id: string) => void;
  onBuyProperty?: (id: string) => void;
}

export const FranchiseMarketplace: React.FC<FranchiseMarketplaceProps> = ({ 
  onExploreResales, 
  onExploreNew
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.franchise-grid-card');
    if (cards) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.9, 
          stagger: 0.2,
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
    <section id="franchise" className="section-padding franchise-section" ref={containerRef}>
      <div className="container">
        {/* Header Area */}
        <div className="feed-header">
          <div className="feed-header-text">
            <span className="section-tag">Franchise Models</span>
            <h2 className="section-title">Franchise Marketplace</h2>
          </div>
        </div>

        {/* Categories as Icons */}
        <div className="category-icon-grid" style={{ marginTop: '3rem', justifyContent: 'center', gap: '5rem' }}>
          
          <div className="category-icon-item" onClick={onExploreNew}>
            <div className="category-icon-btn">
              <div className="category-icon-svg">
                <FaStore />
              </div>
            </div>
            <span className="category-icon-label" style={{ fontSize: '1.2rem' }}>New Franchise Openings</span>
          </div>

          <div className="category-icon-item" onClick={onExploreResales}>
            <div className="category-icon-btn">
              <div className="category-icon-svg">
                <FaHotel />
              </div>
            </div>
            <span className="category-icon-label" style={{ fontSize: '1.2rem' }}>Existing Franchise Resales</span>
          </div>

        </div>


      </div>
    </section>
  );
};

export default FranchiseMarketplace;
