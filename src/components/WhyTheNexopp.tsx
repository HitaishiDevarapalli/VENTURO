import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaUserCheck, FaHandshake, FaLock, FaUserGraduate, FaFileSignature, FaGem } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  title: string;
  icon: React.ReactNode;
  desc: string;
}

export const WhyTheNexopp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const features: Feature[] = [
    {
      title: 'Verified Listings',
      icon: <FaUserCheck />,
      desc: '100% physically audited properties and financially vetted business books for ultimate safety.'
    },
    {
      title: 'Trusted Partners',
      icon: <FaHandshake />,
      desc: 'Affiliated with top-tier developers, certified legal advisors, and institutional lenders.'
    },
    {
      title: 'Secure Transactions',
      icon: <FaLock />,
      desc: 'Escrow options and strictly regulated transaction guidelines protecting your capital.'
    },
    {
      title: 'Expert Support',
      icon: <FaUserGraduate />,
      desc: 'Dedicated acquisition managers guiding you through valuations, audits, and asset transfers.'
    },
    {
      title: 'Fast Approvals',
      icon: <FaFileSignature />,
      desc: 'Pre-vetted structures ensuring expedited approvals for loans, licensing, and registries.'
    },
    {
      title: 'End-to-End Solutions',
      icon: <FaGem />,
      desc: 'Comprehensive post-sale advisory, accounting setups, and wealth restructuring assistance.'
    }
  ];

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.feature-card');
    if (cards) {
      gsap.fromTo(cards, 
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
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
    <section className="section-padding why-venturo-section" ref={containerRef}>
      <div className="container">
        <span className="section-tag text-center">The TheNexopp Guarantee</span>
        <h2 className="section-title text-center">Why Leading Investors Choose TheNexopp</h2>
        <p className="section-subtitle text-center">
          Building absolute transparency and modern efficiency into high-value asset acquisitions and protective financial ecosystems.
        </p>

        <div className="features-grid">
          {features.map((feat, idx) => (
            <div key={idx} className="feature-card premium-card">
              <div className="feature-icon">{feat.icon}</div>
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyTheNexopp;
