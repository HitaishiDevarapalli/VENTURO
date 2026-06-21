import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  image: string;
}

export const SuccessStories: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      quote: "Venturo transformed our commercial real-estate acquisition strategy. Their legal audit and title checks were flawless, enabling a complex ₹12 Crore land registry in Hyderabad to close within weeks.",
      author: "Ravi Teja",
      role: "Managing Director",
      company: "Apex Tech Holdings",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      quote: "Acquiring a franchise brand through Venturo's resale marketplace was completely turnkey. We got historical cash flows verified by certified accountants and completed the transfer without operational friction.",
      author: "Aditi Rao",
      role: "Franchise Partner",
      company: "Chai Oasis Guntur",
      rating: 5,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      quote: "Their investment advisory desk is top tier. They structured our corporate liability insurance policy and helped us evaluate potential IT software startup acquisitions with absolute diligence.",
      author: "Vikram Malhotra",
      role: "Founder & CEO",
      company: "Silicon Ventures",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="section-padding success-stories-section">
      <div className="container">
        <span className="section-tag text-center">Success Stories</span>
        <h2 className="section-title text-center">Trusted By India’s Leading Investors</h2>
        <p className="section-subtitle text-center">
          Read how institutional funds, corporate brands, and private owners leverage Venturo’s integrated asset marketplace.
        </p>

        {/* Sliding review container */}
        <div className="testimonial-slider-container">
          {testimonials.map((test, idx) => (
            <div 
              key={idx} 
              className={`testimonial-slide glass-card ${idx === activeIndex ? 'active-slide' : 'inactive-slide'}`}
            >
              <div className="quote-icon-box">
                <FaQuoteLeft />
              </div>
              
              <p className="testimonial-quote">"{test.quote}"</p>

              <div className="testimonial-rating">
                {Array.from({ length: test.rating }).map((_, i) => (
                  <FaStar key={i} className="star-icon" />
                ))}
              </div>

              <div className="testimonial-profile">
                <img src={test.image} alt={test.author} className="profile-img" />
                <div className="profile-details">
                  <h4 className="profile-name">{test.author}</h4>
                  <p className="profile-meta">{test.role}, <span className="company-gold">{test.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom dot navigation */}
        <div className="slider-dots">
          {testimonials.map((_, idx) => (
            <button 
              key={idx} 
              className={`dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
