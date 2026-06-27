import React, { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HomePage from './components/HomePage';
import PropertyCategories from './components/PropertyCategories';
import FeaturedProperties from './components/FeaturedProperties';
import FranchiseMarketplace from './components/FranchiseMarketplace';
import BusinessMarketplace from './components/BusinessMarketplace';
import FinanceSection from './components/FinanceSection';
import WhyTheNexopp from './components/WhyTheNexopp';
import FeaturedOpportunities from './components/FeaturedOpportunities';
import CTABanner from './components/CTABanner';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import { FranchiseResalesPage } from './components/FranchiseResalesPage';
import { WishlistPage } from './components/WishlistPage';
import { FranchiseDetailsPage } from './components/FranchiseDetailsPage';
import { NewFranchisePage } from './components/NewFranchisePage';
import { BusinessListingsPage } from './components/BusinessListingsPage';
import PropertyDetailsPage from './components/PropertyDetailsPage';
import CloseDealPage from './components/CloseDealPage';
import { FaArrowLeft } from 'react-icons/fa';

type PageType = 'home' | 'propertiesPage' | 'flatsPage' | 'housesPage' | 'landPage' | 'franchisePage' | 'businessPage' | 'financePage' | 'loansPage' | 'financeServicePage' | 'insurancePage' | 'franchiseResales' | 'wishlist' | 'franchiseDetails' | 'newFranchise' | 'businessListings' | 'propertyDetails' | 'closeDeal';

// Subpage header with back button
const SubpageHeader = ({ title, leftTitle, onBack }: { title: string; leftTitle?: string; onBack: () => void }) => (
  <div className="subpage-header">
    <div className="container" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', left: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="circle-back-btn" onClick={onBack} title="Go Back">
          <FaArrowLeft />
        </button>
        {leftTitle && <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{leftTitle}</h3>}
      </div>
      <h2 className="subpage-title" style={{ margin: 0 }}>{title}</h2>
    </div>
  </div>
);

const routeMap: Record<string, PageType> = {
  '/': 'home',
  '/properties': 'propertiesPage',
  '/properties/flats': 'flatsPage',
  '/properties/houses': 'housesPage',
  '/properties/lands': 'landPage',
  '/franchise': 'franchisePage',
  '/franchise/existing': 'franchiseResales',
  '/franchise/new': 'newFranchise',
  '/business': 'businessPage',
  '/finance': 'financePage',
  '/finance/loans': 'loansPage',
  '/finance/advisory': 'financeServicePage',
  '/finance/insurance': 'insurancePage',
  '/favourites': 'wishlist',
};

const getPathForPage = (page: PageType): string => {
  const path = Object.keys(routeMap).find(k => routeMap[k] === page);
  return path || '/';
};

const parseUrl = (path: string) => {
  if (path.startsWith('/property/')) {
    return { page: 'propertyDetails' as PageType, propertyId: path.split('/')[2] };
  }
  if (path.startsWith('/buy/')) {
    return { page: 'closeDeal' as PageType, buyPropertyId: path.split('/')[2] };
  }
  if (path.startsWith('/franchise/details/')) {
    return { page: 'franchiseDetails' as PageType, franchiseId: path.split('/')[3] };
  }
  if (path.startsWith('/business/listings/')) {
    return { page: 'businessListings' as PageType, industry: decodeURIComponent(path.split('/')[3]) as 'Food' | 'Healthcare' | 'Retail & Stores' };
  }
  
  return { page: routeMap[path] || 'home' as PageType };
};

export const App: React.FC = () => {
  const [heroBgIndex, setHeroBgIndex] = useState(0);
  
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Sync state with URL
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const routeData = parseUrl(currentPath);
  const currentPage = routeData.page;
  
  const [selectedFranchiseId] = useState<string | null>(routeData.franchiseId || null);
  const [selectedBusinessIndustry, setSelectedBusinessIndustry] = useState<'Food' | 'Healthcare' | 'Retail & Stores' | null>(routeData.industry || null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(routeData.propertyId || null);
  const [selectedBuyPropertyId, setSelectedBuyPropertyId] = useState<string | null>(routeData.buyPropertyId || null);

  const navigateToUrl = (url: string) => {
    window.history.pushState({}, '', url);
    setCurrentPath(url);
    
    // Scroll to top immediately, taking Lenis into account
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const navigateTo = (page: PageType, params?: { propertyId?: string, franchiseId?: string, industry?: string }) => {
    let url = getPathForPage(page);
    
    if (page === 'propertyDetails') {
      const pid = params?.propertyId || selectedPropertyId;
      if (pid) url = `/property/${pid}`;
    }
    if (page === 'closeDeal') {
      const bid = params?.propertyId || selectedBuyPropertyId;
      if (bid) url = `/buy/${bid}`;
    }
    if (page === 'franchiseDetails') {
      const fid = params?.franchiseId || selectedFranchiseId;
      if (fid) url = `/franchise/details/${fid}`;
    }
    if (page === 'businessListings') {
      const ind = params?.industry || selectedBusinessIndustry;
      if (ind) url = `/business/listings/${encodeURIComponent(ind)}`;
    }
    
    navigateToUrl(url);
  };

  const navigateBack = () => {
    window.history.back();
    setTimeout(() => {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }, 100);
  };

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
    });
    
    (window as any).lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      (window as any).lenis = null;
    };
  }, []);

  return (
    <div className="app-container">
      <Navbar 
        isSubpage={currentPage !== 'home'}
        heroBgIndex={heroBgIndex} 
        onOpenWishlist={() => navigateTo('wishlist')} 
        onNavigateBusiness={(industry) => {
          setSelectedBusinessIndustry(industry);
          navigateTo('businessListings', { industry });
        }}
        onNavigateProperties={() => navigateTo('propertiesPage')}
        onNavigateFranchise={() => navigateTo('franchisePage')}
        onNavigateFinance={() => navigateTo('financePage')}
        onNavigateToPage={(page: any) => navigateTo(page)}
        onGoHome={() => navigateToUrl('/')}
      />
      
      {currentPage === 'franchiseResales' ? (
        <FranchiseResalesPage 
          onBack={navigateBack} 
          onPropertyClick={(id) => {
            setSelectedPropertyId(id);
            navigateTo('propertyDetails', { propertyId: id });
          }}
          onBuyProperty={(id) => {
            setSelectedBuyPropertyId(id);
            navigateTo('closeDeal', { propertyId: id });
          }}
        />
      ) : currentPage === 'franchiseDetails' && selectedFranchiseId ? (
        <FranchiseDetailsPage 
          franchiseId={selectedFranchiseId} 
          onBack={navigateBack} 
          onBuyProperty={(id) => {
            setSelectedBuyPropertyId(id);
            navigateTo('closeDeal', { propertyId: id });
          }}
        />
      ) : currentPage === 'newFranchise' ? (
        <NewFranchisePage 
          onBack={navigateBack} 
          onPropertyClick={(id) => {
            setSelectedPropertyId(id);
            navigateTo('propertyDetails', { propertyId: id });
          }}
          onBuyProperty={(id) => {
            setSelectedBuyPropertyId(id);
            navigateTo('closeDeal', { propertyId: id });
          }}
        />
      ) : currentPage === 'wishlist' ? (
        <WishlistPage 
          onBack={navigateBack} 
          onPropertyClick={(id) => {
            setSelectedPropertyId(id);
            navigateTo('propertyDetails', { propertyId: id });
          }}
          onBuyProperty={(id) => {
            setSelectedBuyPropertyId(id);
            navigateTo('closeDeal', { propertyId: id });
          }}
        />
      ) : currentPage === 'propertyDetails' && selectedPropertyId ? (
        <PropertyDetailsPage 
          propertyId={selectedPropertyId} 
          onBack={navigateBack}            
          onPropertyClick={(id) => {
              setSelectedPropertyId(id);
              navigateTo('propertyDetails', { propertyId: id });
            }}
          onBuyProperty={(id) => {
            setSelectedBuyPropertyId(id);
            navigateTo('closeDeal');
          }}
        />
      ) : currentPage === 'closeDeal' && selectedBuyPropertyId ? (
        <CloseDealPage 
          propertyId={selectedBuyPropertyId} 
          onBack={navigateBack} 
        />
      ) : currentPage === 'businessListings' && selectedBusinessIndustry ? (
        <BusinessListingsPage 
          industry={selectedBusinessIndustry} 
          onBack={navigateBack} 
          onPropertyClick={(id) => {
            setSelectedPropertyId(id);
            navigateTo('propertyDetails', { propertyId: id });
          }}
          onBuyProperty={(id) => {
            setSelectedBuyPropertyId(id);
            navigateTo('closeDeal', { propertyId: id });
          }}
        />

      ) : currentPage === 'propertiesPage' ? (
        <>
          <SubpageHeader title="Properties Marketplace" onBack={navigateBack} />
          <PropertyCategories 
            onPropertyClick={(id) => {
              setSelectedPropertyId(id);
              navigateTo('propertyDetails', { propertyId: id });
            }} 
            onBuyProperty={(id) => {
              setSelectedBuyPropertyId(id);
              navigateTo('closeDeal', { propertyId: id });
            }}
            onCategorySelect={(cat) => {
              
              if (cat === 'BuyApartment') navigateTo('flatsPage');
              else if (cat === 'BuyHouse') navigateTo('housesPage');
              else if (cat === 'BuyLand') navigateTo('landPage');
            }}
          />
        </>

      ) : (currentPage === 'flatsPage' || currentPage === 'housesPage' || currentPage === 'landPage') ? (
        <>
          <SubpageHeader 
            title={
              currentPage === 'flatsPage' ? 'Flats & Apartments' :
              currentPage === 'housesPage' ? 'Individual Houses' : 'Lands & Plots'
            } 
            leftTitle="Properties"
            onBack={navigateBack} 
          />
          <PropertyCategories 
            initialCategory={
              currentPage === 'flatsPage' ? 'BuyApartment' :
              currentPage === 'housesPage' ? 'BuyHouse' : 'BuyLand'
            }
            onPropertyClick={(id) => {
              setSelectedPropertyId(id);
              navigateTo('propertyDetails', { propertyId: id });
            }} 
            onBuyProperty={(id) => {
              setSelectedBuyPropertyId(id);
              navigateTo('closeDeal', { propertyId: id });
            }}
            onCategorySelect={(cat) => {
              
              if (cat === 'BuyApartment') navigateTo('flatsPage');
              else if (cat === 'BuyHouse') navigateTo('housesPage');
              else if (cat === 'BuyLand') navigateTo('landPage');
            }}
          />
          <FeaturedProperties 
            categoryFilter={
              currentPage === 'flatsPage' ? 'BuyApartment' :
              currentPage === 'housesPage' ? 'BuyHouse' : 'BuyLand'
            }
            onPropertyClick={(id) => {
              setSelectedPropertyId(id);
              navigateTo('propertyDetails', { propertyId: id });
            }} 
            onBuyProperty={(id) => {
              setSelectedBuyPropertyId(id);
              navigateTo('closeDeal', { propertyId: id });
            }}
          />
        </>

      ) : currentPage === 'franchisePage' ? (
        <>
          <SubpageHeader title="Franchise Marketplace" onBack={navigateBack} />
          <FranchiseMarketplace 
            onExploreResales={() => navigateTo('franchiseResales')} 
            onExploreNew={() => navigateTo('newFranchise')}
            onPropertyClick={(id) => {
              setSelectedPropertyId(id);
              navigateTo('propertyDetails', { propertyId: id });
            }}
            onBuyProperty={(id) => {
              setSelectedBuyPropertyId(id);
              navigateTo('closeDeal', { propertyId: id });
            }}
          />
        </>

      ) : currentPage === 'businessPage' ? (
        <>
          <SubpageHeader title="Business Marketplace" onBack={navigateBack} />
          <BusinessMarketplace 
            onExploreCategory={(industry) => {
              setSelectedBusinessIndustry(industry);
              navigateTo('businessListings');
            }}
          />
        </>

      ) : currentPage === 'financePage' ? (
        <>
          <SubpageHeader title="Finance & Insurance" onBack={navigateBack} />
          <FinanceSection 
            onCategorySelect={(cat) => {
              if (cat === 'loans') navigateTo('loansPage');
              else if (cat === 'finance') navigateTo('financeServicePage');
              else if (cat === 'insurance') navigateTo('insurancePage');
            }}
          />
        </>

      ) : (currentPage === 'loansPage' || currentPage === 'financeServicePage' || currentPage === 'insurancePage') ? (
        <>
          <SubpageHeader 
            title={
              currentPage === 'loansPage' ? 'Loans & Funding' :
              currentPage === 'financeServicePage' ? 'Finance & Advisory' : 'Insurance & Protection'
            } 
            onBack={navigateBack} 
          />
          <FinanceSection 
            initialCategory={
              currentPage === 'loansPage' ? 'loans' :
              currentPage === 'financeServicePage' ? 'finance' : 'insurance'
            }
            onCategorySelect={(cat) => {
              if (cat === 'loans') navigateTo('loansPage');
              else if (cat === 'finance') navigateTo('financeServicePage');
              else if (cat === 'insurance') navigateTo('insurancePage');
            }}
          />
        </>

      ) : (
        <>
          <Hero 
            currentBg={heroBgIndex} 
            setCurrentBg={setHeroBgIndex} 
            onPropertyClick={(id) => {
              setSelectedPropertyId(id);
              navigateTo('propertyDetails', { propertyId: id });
            }}
            onSearch={(category, query) => {
              const q = query.toLowerCase();
              const cat = category.toLowerCase();
              
              if (cat === 'property' || (cat === 'all categories' && (q.includes('property') || q.includes('apartment') || q.includes('flat') || q.includes('house') || q.includes('villa') || q.includes('land') || q.includes('plot') || q.includes('commercial')))) {
                if (q.includes('flat') || q.includes('apartment')) {
                  navigateTo('flatsPage');
                } else if (q.includes('house') || q.includes('villa')) {
                  navigateTo('housesPage');
                } else if (q.includes('land') || q.includes('plot')) {
                  navigateTo('landPage');
                } else {
                  navigateTo('propertiesPage');
                }
              } else if (cat === 'franchise' || (cat === 'all categories' && q.includes('franchise'))) {
                if (q.includes('new')) {
                  navigateTo('newFranchise');
                } else if (q.includes('resale') || q.includes('existing')) {
                  navigateTo('franchiseResales');
                } else {
                  navigateTo('franchisePage');
                }
              } else if (cat === 'business' || (cat === 'all categories' && (q.includes('business') || q.includes('food') || q.includes('health') || q.includes('retail') || q.includes('store')))) {
                if (q.includes('food')) {
                  setSelectedBusinessIndustry('Food');
                  navigateTo('businessListings', { industry: 'Food' });
                } else if (q.includes('health')) {
                  setSelectedBusinessIndustry('Healthcare');
                  navigateTo('businessListings', { industry: 'Healthcare' });
                } else if (q.includes('retail') || q.includes('store')) {
                  setSelectedBusinessIndustry('Retail & Stores');
                  navigateTo('businessListings', { industry: 'Retail & Stores' });
                } else {
                  navigateTo('businessPage');
                }
              } else if (cat === 'finance' || (cat === 'all categories' && (q.includes('loan') || q.includes('finance') || q.includes('funding')))) {
                navigateTo('loansPage');
              } else if (cat === 'insurance' || (cat === 'all categories' && q.includes('insurance'))) {
                navigateTo('insurancePage');
              } else {
                const el = document.getElementById('properties');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigateTo('propertiesPage');
                }
              }
            }}
          />
          <HomePage onNavigate={(page) => navigateTo(page as PageType)} />
          <FeaturedOpportunities 
            onPropertyClick={(id) => {
              if (id === 'P3') {
                // Domino's Pizza - Food category
                setSelectedBusinessIndustry('Food');
                navigateTo('businessListings', { industry: 'Food' });
              } else if (id === 'feat-fran2') {
                // Starbucks - Food category
                setSelectedBusinessIndustry('Food');
                navigateTo('businessListings', { industry: 'Food' });
              } else if (id === 'feat-fin1') {
                navigateTo('loansPage');
              } else if (id === 'feat-ins1') {
                navigateTo('insurancePage');
              } else {
                setSelectedPropertyId(id);
                navigateTo('propertyDetails', { propertyId: id });
              }
            }}
            onBuyProperty={(id) => {
              setSelectedBuyPropertyId(id);
              navigateTo('closeDeal', { propertyId: id });
            }}
            onViewAll={() => navigateTo('housesPage')}
          />
          <CTABanner />
          <WhyTheNexopp />
          <AboutUs />
          <ContactUs />
        </>
      )}

      <Footer 
        onNavigate={(page) => navigateTo(page as PageType)} 
        onScrollToSection={(sectionId) => {
          navigateTo('home');
          setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }, 150);
        }}
      />
    </div>
  );
};

export default App;
