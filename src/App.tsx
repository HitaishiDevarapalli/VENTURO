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
import AdminPanel from './components/AdminPanel';
import { FaArrowLeft } from 'react-icons/fa';
import { siteSettingsDb, propertiesDb, franchiseDb, businessDb, updateSiteSettings } from './db/marketplaceDb';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { LoginModal } from './components/LoginModal';

type PageType = 'home' | 'propertiesPage' | 'flatsPage' | 'villasPage' | 'housesPage' | 'landPage' | 'franchisePage' | 'businessPage' | 'financePage' | 'loansPage' | 'financeServicePage' | 'insurancePage' | 'franchiseResales' | 'wishlist' | 'franchiseDetails' | 'newFranchise' | 'businessListings' | 'propertyDetails' | 'closeDeal' | 'adminPortal' | 'aboutUsPage';

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
  '/properties/villas': 'villasPage',
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
  '/admin': 'adminPortal',
  '/about': 'aboutUsPage',
  '/secret-admin': 'adminPortal',
  '/portal': 'adminPortal',
  '/nexoop-admin': 'adminPortal',
};

const getPathForPage = (page: PageType): string => {
  const path = Object.keys(routeMap).find(k => routeMap[k] === page);
  return path || '/';
};

const parseUrl = (path: string) => {
  if (window.location.search.includes('admin=true') || window.location.search.includes('portal=true')) {
    return { page: 'adminPortal' as PageType };
  }
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
  const { user } = useAuth();
  const [heroBgIndex, setHeroBgIndex] = useState(0);
  
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
 
   // Sync state with URL
   useEffect(() => {
     const handlePopState = () => setCurrentPath(window.location.pathname);
     window.addEventListener('popstate', handlePopState);
     return () => window.removeEventListener('popstate', handlePopState);
   }, []);
 
   // Visitor counter increment
   useEffect(() => {
     if (!sessionStorage.getItem('nexopp_visited_session')) {
       sessionStorage.setItem('nexopp_visited_session', 'true');
       const currentCount = siteSettingsDb.analytics?.totalVisitors || 0;
       updateSiteSettings({
         analytics: {
           ...(siteSettingsDb.analytics || {}),
           totalVisitors: currentCount + 1
         }
       });
     }
   }, []);

  const routeData = parseUrl(currentPath);
  const currentPage = routeData.page;
  
  const [selectedFranchiseId] = useState<string | null>(routeData.franchiseId || null);
  const [selectedBusinessIndustry, setSelectedBusinessIndustry] = useState<'Food' | 'Healthcare' | 'Retail & Stores' | null>(routeData.industry || null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(routeData.propertyId || null);
  const [selectedBuyPropertyId, setSelectedBuyPropertyId] = useState<string | null>(routeData.buyPropertyId || null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

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
    if (currentPage === 'adminPortal') {
      // Do not run Lenis smooth scroll on the admin page to allow native layout scrolling
      return;
    }

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

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      (window as any).lenis = null;
    };
  }, [currentPage]);

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      {currentPage !== 'adminPortal' && (
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
      )}
      
      {currentPage === 'adminPortal' ? (
        <AdminPanel onDataChange={() => {}} />
      ) : currentPage === 'franchiseResales' ? (
        <FranchiseResalesPage 
          onBack={navigateBack} 
          searchQuery={globalSearchQuery}
          onClearSearch={() => setGlobalSearchQuery('')}
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
          searchQuery={globalSearchQuery}
          onClearSearch={() => setGlobalSearchQuery('')}
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
          searchQuery={globalSearchQuery}
          onClearSearch={() => setGlobalSearchQuery('')}
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
        <PropertyCategories 
          title="Properties Marketplace"
          subtitle="Explore verified residential, commercial, plots and new projects across India"
          onBack={navigateBack}
          searchQuery={globalSearchQuery}
          onClearSearch={() => setGlobalSearchQuery('')}
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
            else if (cat === 'BuyVilla') navigateTo('villasPage');
            else if (cat === 'BuyHouse') navigateTo('housesPage');
            else if (cat === 'BuyLand') navigateTo('landPage');
          }}
        />

      ) : (currentPage === 'flatsPage' || currentPage === 'villasPage' || currentPage === 'housesPage' || currentPage === 'landPage') ? (
        <PropertyCategories 
          title={
            currentPage === 'flatsPage' ? 'Flats & Apartments' :
            currentPage === 'villasPage' ? 'Villas' :
            currentPage === 'housesPage' ? 'Individual Houses' : 'Lands & Plots'
          }
          subtitle={
            currentPage === 'flatsPage' ? 'Explore 1, 2, 3 & 4+ BHK luxury apartments and gated societies' :
            currentPage === 'villasPage' ? 'Discover premium luxury villas and row houses' :
            currentPage === 'housesPage' ? 'Discover independent houses, villas and bungalows for sale & rent' : 'Verified residential plots, commercial lands and agricultural layouts'
          }
          onBack={navigateBack}
          initialCategory={
            currentPage === 'flatsPage' ? 'BuyApartment' :
            currentPage === 'villasPage' ? 'BuyVilla' :
            currentPage === 'housesPage' ? 'BuyHouse' : 'BuyLand'
          }
          searchQuery={globalSearchQuery}
          onClearSearch={() => setGlobalSearchQuery('')}
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
            else if (cat === 'BuyVilla') navigateTo('villasPage');
            else if (cat === 'BuyHouse') navigateTo('housesPage');
            else if (cat === 'BuyLand') navigateTo('landPage');
          }}
        />

      ) : currentPage === 'franchisePage' ? (
        <FranchiseMarketplace 
          title="Franchise Marketplace"
          subtitle="Explore top brand franchises, resales, and new commercial opportunities across India"
          onBack={navigateBack}
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

      ) : currentPage === 'businessPage' ? (
        <BusinessMarketplace 
          title="Business Marketplace"
          subtitle="Discover verified businesses for sale, investment, and strategic acquisitions"
          onBack={navigateBack}
          onExploreCategory={(industry) => {
            setSelectedBusinessIndustry(industry);
            navigateTo('businessListings');
          }}
          onPropertyClick={(id) => {
            setSelectedPropertyId(id);
            navigateTo('propertyDetails', { propertyId: id });
          }}
        />

      ) : currentPage === 'aboutUsPage' ? (
        <>
          <SubpageHeader title="About Us & Leadership" onBack={navigateBack} />
          <AboutUs />
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
              setGlobalSearchQuery(query.trim());
              const q = query.trim().toLowerCase();
              const cat = category.toLowerCase();
              
              if (cat === 'property' || (cat === 'all categories' && (q.includes('property') || q.includes('apartment') || q.includes('flat') || q.includes('house') || q.includes('villa') || q.includes('land') || q.includes('plot') || q.includes('bhk') || q.includes('commercial')))) {
                if (q.includes('flat') || q.includes('apartment')) {
                  navigateTo('flatsPage');
                } else if (q.includes('villa')) {
                  navigateTo('villasPage');
                } else if (q.includes('house')) {
                  navigateTo('housesPage');
                } else if (q.includes('land') || q.includes('plot')) {
                  navigateTo('landPage');
                } else {
                  navigateTo('propertiesPage');
                }
              } else if (cat === 'franchise' || (cat === 'all categories' && (q.includes('franchise') || q.includes('resale') || q.includes('cafe') || q.includes('subway') || q.includes('brand')))) {
                if (q.includes('resale') || q.includes('existing')) {
                  navigateTo('franchiseResales');
                } else if (q !== '') {
                  navigateTo('newFranchise');
                } else {
                  navigateTo('franchisePage');
                }
              } else if (cat === 'business' || (cat === 'all categories' && (q.includes('business') || q.includes('food') || q.includes('health') || q.includes('retail') || q.includes('store') || q.includes('company')))) {
                if (q.includes('food')) {
                  setSelectedBusinessIndustry('Food');
                  navigateTo('businessListings', { industry: 'Food' });
                } else if (q.includes('health')) {
                  setSelectedBusinessIndustry('Healthcare');
                  navigateTo('businessListings', { industry: 'Healthcare' });
                } else if (q.includes('retail') || q.includes('store')) {
                  setSelectedBusinessIndustry('Retail & Stores');
                  navigateTo('businessListings', { industry: 'Retail & Stores' });
                } else if (q !== '') {
                  setSelectedBusinessIndustry('All' as any);
                  navigateTo('businessListings', { industry: 'All' as any });
                } else {
                  navigateTo('businessPage');
                }
              } else if (cat === 'finance' || (cat === 'all categories' && (q.includes('loan') || q.includes('finance') || q.includes('funding')))) {
                navigateTo('loansPage');
              } else if (cat === 'insurance' || (cat === 'all categories' && q.includes('insurance'))) {
                navigateTo('insurancePage');
              } else {
                const hasFranchiseMatch = franchiseDb.some(f => f.brand.toLowerCase().includes(q) || f.type.toLowerCase().includes(q) || f.city.toLowerCase().includes(q));
                const hasBizMatch = businessDb.some(b => b.name.toLowerCase().includes(q) || b.industry.toLowerCase().includes(q) || b.city.toLowerCase().includes(q));
                const hasPropMatch = propertiesDb.some(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.city.toLowerCase().includes(q));
                
                if (hasFranchiseMatch && !hasPropMatch) {
                  navigateTo('newFranchise');
                } else if (hasBizMatch && !hasPropMatch) {
                  setSelectedBusinessIndustry('All' as any);
                  navigateTo('businessListings', { industry: 'All' as any });
                } else if (q !== '' || hasPropMatch) {
                  navigateTo('propertiesPage');
                } else {
                  const el = document.getElementById('properties');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigateTo('propertiesPage');
                  }
                }
              }
            }}
          />
          
          <HomePage 
            onNavigate={(page) => navigateTo(page as PageType)} 
            onPropertyClick={(id) => {
              setSelectedPropertyId(id);
              navigateTo('propertyDetails', { propertyId: id });
            }}
          />
          <CTABanner />
          <WhyTheNexopp />
          <ContactUs />
        </>
      )}

      {currentPage !== 'adminPortal' && (
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
      )}
      <LoginModal />
    </div>
  );
};

export default App;
