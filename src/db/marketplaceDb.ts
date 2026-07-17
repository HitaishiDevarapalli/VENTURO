export interface Dealer {
  id: string;
  logo: string;
  photo: string;
  image?: string;
  companyName: string;
  company?: string;
  name?: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  premiumPartner: boolean;
  bestSeller: boolean;
  yearsExperience: number;
  responseTime: string;
  inventoryCount: number;
  coverage: { [city: string]: number };
  latitude: number;
  longitude: number;
  phone?: string;
  whatsapp?: string;
  email?: string;
  specialization?: string;
  languages?: string;
  reraNumber?: string;

  // Personal Information
  fullName?: string;
  mobileNumber?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';

  // Professional Information
  areasOfExpertise?: string[];

  // Property Categories
  propertyCategories?: string[]; // Flats, Apartments, Individual Houses, Villas, Residential Plots, Commercial Properties, Agricultural Lands, Farm Lands, Luxury Properties

  // Franchise Categories
  franchiseCategories?: string[]; // Food, Healthcare, Retail, Education, Automobile, Beauty, Technology, Existing Business, New Franchise

  // Service Areas
  serviceAreas?: {
    state: string;
    district: string;
    city: string;
    area: string;
    pincode?: string;
  }[];

  // Contact Information
  officeAddress?: string;
  googleMapsLink?: string;
  alternateMobile?: string;

  // Social Links
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };

  // Performance Settings & Status
  featured?: boolean;
  status?: 'Active' | 'Inactive';

  // Leaderboard & Performance Stats
  totalPropertiesSold?: number;
  totalFranchiseDealsClosed?: number;
  revenueGenerated?: number; // In Crores or Lakhs e.g. 42.5 (Cr)
  successRate?: number; // percentage e.g. 96
  totalLeadsHandled?: number;

  // Premium Broker Management
  premiumStartDate?: string;
  premiumExpiryDate?: string;
  featuredHomepageListing?: boolean;
  highlightPremiumCards?: boolean;
  showPremiumBadge?: boolean;
  createdDate?: string;
}

export interface PropertyListing {
  id: string;
  dealerId: string;
  featured?: boolean;
  title: string;
  description: string;
  image: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  image6?: string;
  images?: string[];
  state: string;
  district: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  price: number;
  priceDisplay: string;
  category: 'Apartment' | 'Villa' | 'House' | 'Plot' | 'Commercial' | string;
  status: 'Buy' | 'Sell' | 'Rent' | string;
  areaSqFt: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  premium: boolean;
  trending: boolean;
  bestSeller: boolean;
  availabilityCount: number;
  trustScore: number;
  createdDate: string;
  listingStatus?: 'Draft' | 'Pending' | 'Published' | 'Hidden' | 'Reserved' | 'Sold' | 'Expired' | 'Archived';
  urgent?: boolean;
  luxury?: boolean;
  hotDeal?: boolean;
  topPick?: boolean;
  newArrival?: boolean;
  editorsChoice?: boolean;
  readyToMove?: boolean;
  underConstruction?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  floors?: number;
  facing?: string;
  ageYears?: number;
  furnishing?: string;
  parkingSlots?: number;
  amenities?: string[];
  imageUrl?: string;
  sqft?: string;
  builtUpArea?: string;
  agentName?: string;
  agentRating?: number;
  agentImage?: string;
  parking?: string;

  // Property Management System Extensions
  propertyPurpose?: 'Sale' | 'Rent' | 'Lease';
  propertySubtype?: string;
  negotiable?: boolean;
  superBuiltUpArea?: string;
  carpetArea?: string;
  plotArea?: string;
  floorNumber?: number;
  totalFloors?: number;
  ownershipType?: string;

  // Detailed Location
  country?: string;
  locality?: string;
  landmark?: string;
  pincode?: string;
  postal_code?: string;
  fullAddress?: string;
  formatted_address?: string;
  google_place_id?: string;
  service_radius?: number; // in KM

  // Rich Media
  coverImage?: string;
  videoUrl?: string;
  virtualTourUrl?: string;
  floorPlanImages?: string[];
  masterPlanImage?: string;
  documentPdfs?: string[];
  galleryCaptions?: Record<string, string>;

  // Multi-Broker Assignment
  assignedBrokerIds?: string[];

  // Approval Workflow & Publishing
  approvalStatus?: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Published' | 'Archived' | 'Sold' | 'Reserved' | 'Available';
  reviewComments?: string[];
  scheduledPublishDate?: string;

  // Featured & Premium Management
  featuredDuration?: string;
  homepagePriority?: number;
  highlightPropertyCard?: boolean;
  sponsoredListing?: boolean;
  homepageBannerPlacement?: boolean;
  prioritySearchPlacement?: boolean;
  premiumStartDate?: string;
  premiumExpiryDate?: string;

  // SEO & Marketing
  seoTitle?: string;
  metaDescription?: string;
  urlSlug?: string;
  openGraphImage?: string;
  searchKeywords?: string[];
  marketingFlags?: {
    featureOnHomepage?: boolean;
    pushNotification?: boolean;
    emailCampaign?: boolean;
    socialMediaShare?: boolean;
  };
}

export interface FranchiseListing {
  id: string;
  brand: string;
  type: string;
  category?: string;
  investment: number;
  investmentDisplay: string;
  location: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  trending: boolean;
  availableBranchCount: number;
  image: string;
  images?: string[];
  logo: string;
  trustScore: number;
  dealerId?: string;

  // Granular Enterprise Fields
  franchiseCode?: string;
  opportunityType?: 'New Franchise' | 'Existing Business';
  status?: 'Active' | 'Closed' | 'Sold' | 'Investment Completed';
  shortDescription?: string;
  detailedDescription?: string;

  // Investment Details
  minInvestment?: number; // in Lakhs
  maxInvestment?: number; // in Lakhs
  franchiseFee?: string;
  securityDeposit?: string;
  workingCapital?: string;
  expectedRoi?: string;
  paybackPeriod?: string;
  profitMargin?: string;
  royaltyFee?: string;
  marketingFee?: string;

  // Business Information
  companyName?: string;
  yearEstablished?: number;
  existingOutletsCount?: number;
  totalFranchiseUnits?: number;
  brandRecognition?: 'Global' | 'National' | 'Regional' | 'Emerging';
  requiredExperience?: string;
  requiredStaff?: string;
  businessModel?: string;
  supportOffered?: string[];

  // Space Requirements
  minAreaSqFt?: number;
  maxAreaSqFt?: number;
  shopType?: 'High Street' | 'Mall' | 'Standalone' | 'Kiosk' | 'Any';
  floorPreference?: string;
  parkingRequirement?: string;

  // Location Hierarchy
  country?: string;
  district?: string;
  area?: string;
  pincode?: string;
  postal_code?: string;
  formatted_address?: string;
  fullAddress?: string;
  service_radius?: number;
  businessAddress?: string;
  googleMapsUrl?: string;

  // Media & Documents
  coverImage?: string;
  brandLogo?: string;
  videoUrls?: string[];
  promotionalVideoUrl?: string;
  brochurePdfUrl?: string;
  sampleAgreementUrl?: string;
  investmentPresentationUrl?: string;

  // Broker Assignment
  assignedBrokerIds?: string[];
  commissionRate?: string;

  // Approval Workflow
  approvalStatus?: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Published' | 'Archived' | 'Closed';
  reviewNotes?: string;

  // Featured & Premium Control
  featured?: boolean;
  featuredDuration?: string;
  homepagePriority?: number;
  highlightCard?: boolean;
  premiumFranchise?: boolean;
  sponsoredListing?: boolean;
  validityDate?: string;

  // SEO & Marketing
  seoTitle?: string;
  metaDescription?: string;
  urlSlug?: string;
  keywords?: string[];
  openGraphImage?: string;

  createdDate?: string;
}

export interface FranchiseEnquiry {
  id: string;
  franchiseId?: string;
  customerName: string;
  mobileNumber: string;
  email: string;
  interestedFranchise: string;
  investmentBudget: string;
  preferredLocation: string;
  assignedBrokerId?: string;
  assignedBrokerName?: string;
  status: 'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Negotiation' | 'Closed' | 'Lost';
  date?: string;
  createdDate?: string;
}


export interface BusinessListing {
  id: string;
  name: string;
  title?: string;
  industry: string;
  location: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  price: number;
  priceDisplay: string;
  revenueMonthly: string;
  profitMonthly: string;
  establishedYear: number;
  employeesCount: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  trending: boolean;
  image: string;
  description: string;
  reasonForSale: string;
  trustScore: number;
  revenue?: string;
  sellerProfile?: string;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  category: string;
  coverageAmount: string;
  claimProcess: string;
  premiumStartingPrice: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  logo: string;
  state: string;
  city: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  experience: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  photo: string;
  state: string;
  city: string;
}

export interface CustomerEnquiry {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  listingTitle: string;
  brokerName: string;
  status: 'New' | 'Contacted' | 'Follow-up' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  source: string;
  date: string;
  name?: string;
  interest?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  photo: string;
  phone?: string;
  linkedin?: string;
}

export interface MainPageStats {
  propertiesListed: string;
  franchisesCount: string;
  verifiedBrokers: string;
  citiesCovered: string;
  totalPropertyValue: string;
  happyClients: string;
  activeListingsWhy?: string;
  happyCustomersWhy?: string;
  citiesCoveredWhy?: string;
  verifiedListingsWhy?: string;
  customerSupportWhy?: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroHighlightText?: string;
  heroSubtitle: string;
  heroBgUrl: string;
  heroMediaType?: 'image' | 'video';
  heroVideoUrl?: string;
  heroPopularTags?: string[];
  heroBadge1Text?: string;
  heroBadge2Text?: string;
  primaryColor: string;
  themeStyle: 'light-luxury' | 'gold-royal' | 'professional-white-green';
  analytics: {
    activeListings: number;
    happyClients: number;
    dealsClosed: number;
    totalVisitors: number;
  };
  availableCities?: string[];
  defaultCity?: string;
  promotionalVideoUrl?: string;
  mainPageStats?: MainPageStats;
}

export interface DemandRegion {
  id: string;
  name: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  radius: number;
  demandScore: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  propertySalesCount: number;
  franchiseSalesCount: number;
  businessSalesCount: number;
  lastUpdated: string;
  isAiEnabled: boolean;
  manualOverrideLevel?: 'High' | 'Medium' | 'Low' | null;
}

const sampleTeamMembers: TeamMember[] = [];
const sampleDealers: Dealer[] = [];
const sampleProperties: PropertyListing[] = [];
const sampleFranchises: FranchiseListing[] = [];
const sampleBusinesses: BusinessListing[] = [];
const sampleFranchiseEnquiries: FranchiseEnquiry[] = [];

const defaultSettings: SiteSettings = {
  heroTitle: "Your Next Opportunity",
  heroHighlightText: "One Click Away",
  heroSubtitle: "India's Premier Integrated Portal for Luxury Properties, Enterprise Franchises & Acquisitions.",
  heroBgUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  heroMediaType: "image",
  heroVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-building-exterior-41580-large.mp4",
  heroPopularTags: ['Apartment', 'Villa', 'Franchise', 'Commercial Property'],
  heroBadge1Text: "View More Pics",
  heroBadge2Text: "Verified Genuine Listings",
  primaryColor: "#10B981",
  themeStyle: "professional-white-green",
  analytics: {
    activeListings: 12,
    happyClients: 180,
    dealsClosed: 45,
    totalVisitors: 14500
  },
  availableCities: ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Chennai', 'Pune'],
  defaultCity: 'Hyderabad',
  promotionalVideoUrl: "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-building-exterior-41580-large.mp4",
  mainPageStats: {
    propertiesListed: '18,500+',
    franchisesCount: '950+',
    verifiedBrokers: '2,400+',
    citiesCovered: '32',
    totalPropertyValue: '₹850 Cr+',
    happyClients: '15K+',
    activeListingsWhy: '10,000+',
    happyCustomersWhy: '5,000+',
    citiesCoveredWhy: '50+',
    verifiedListingsWhy: '100%',
    customerSupportWhy: '24/7'
  }
};

// Exported Reactive Data Variables
export let dealersDb: Dealer[] = [];
export let propertiesDb: PropertyListing[] = [];
export let franchiseDb: FranchiseListing[] = [];
export let businessDb: BusinessListing[] = [];
export let insuranceDb: InsuranceProvider[] = [];
export let servicesDb: ServiceProvider[] = [];
export let enquiriesDb: CustomerEnquiry[] = [];
export let franchiseEnquiriesDb: FranchiseEnquiry[] = [];
export let siteSettingsDb: SiteSettings = defaultSettings;
export let teamMembersDb: TeamMember[] = [];
export let demandRegionsDb: DemandRegion[] = [];

export interface ShowcaseVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl?: string;
  linkedCategory: 'Property' | 'Franchise' | 'Business' | 'None';
  linkedId?: string;
  title: string;
  displayOrder: number;
  status: 'Active' | 'Inactive';
  autoplayDuration?: number;
  createdDate: string;
}

export interface ShowcaseSettings {
  maxVideoSizeMB: number;
  maxVideoDurationSec: number;
  defaultPlaybackDurationSec: number;
}

export let showcaseVideosDb: ShowcaseVideo[] = [];
export let showcaseSettingsDb: ShowcaseSettings = {
  maxVideoSizeMB: 200,
  maxVideoDurationSec: 60,
  defaultPlaybackDurationSec: 10
};

const defaultShowcaseVideos: ShowcaseVideo[] = [
  {
    id: 'sv1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-villa-with-a-swimming-pool-42526-large.mp4',
    title: 'Luxury Villa Showcase',
    linkedCategory: 'None',
    displayOrder: 1,
    status: 'Active',
    createdDate: new Date().toLocaleDateString()
  },
  {
    id: 'sv2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-office-building-glass-facade-reflecting-the-sky-40439-large.mp4',
    title: 'Commercial Business Center',
    linkedCategory: 'None',
    displayOrder: 2,
    status: 'Active',
    createdDate: new Date().toLocaleDateString()
  },
  {
    id: 'sv3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-laptop-42171-large.mp4',
    title: 'Modern Workspaces & Offices',
    linkedCategory: 'None',
    displayOrder: 3,
    status: 'Active',
    createdDate: new Date().toLocaleDateString()
  },
  {
    id: 'sv4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-fresh-vegetable-salad-41617-large.mp4',
    title: 'Premium Restaurant Opportunities',
    linkedCategory: 'None',
    displayOrder: 4,
    status: 'Active',
    createdDate: new Date().toLocaleDateString()
  },
  {
    id: 'sv5',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-shopping-in-a-clothing-store-42323-large.mp4',
    title: 'Retail Shops & Showrooms',
    linkedCategory: 'None',
    displayOrder: 5,
    status: 'Active',
    createdDate: new Date().toLocaleDateString()
  }
];


const defaultDemandRegions: DemandRegion[] = [
  {
    id: 'dr1',
    name: 'Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.4300,
    longitude: 78.4000,
    radius: 5,
    demandScore: 85,
    demandLevel: 'High',
    propertySalesCount: 12,
    franchiseSalesCount: 4,
    businessSalesCount: 2,
    lastUpdated: new Date().toLocaleDateString(),
    isAiEnabled: true
  },
  {
    id: 'dr2',
    name: 'Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9300,
    longitude: 77.6200,
    radius: 5,
    demandScore: 78,
    demandLevel: 'High',
    propertySalesCount: 15,
    franchiseSalesCount: 6,
    businessSalesCount: 1,
    lastUpdated: new Date().toLocaleDateString(),
    isAiEnabled: true
  },
  {
    id: 'dr3',
    name: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.0500,
    longitude: 72.8200,
    radius: 2,
    demandScore: 92,
    demandLevel: 'High',
    propertySalesCount: 18,
    franchiseSalesCount: 8,
    businessSalesCount: 3,
    lastUpdated: new Date().toLocaleDateString(),
    isAiEnabled: true
  },
  {
    id: 'dr4',
    name: 'Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.4400,
    longitude: 78.3400,
    radius: 5,
    demandScore: 55,
    demandLevel: 'Medium',
    propertySalesCount: 6,
    franchiseSalesCount: 2,
    businessSalesCount: 0,
    lastUpdated: new Date().toLocaleDateString(),
    isAiEnabled: true
  },
  {
    id: 'dr5',
    name: 'Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9600,
    longitude: 77.7500,
    radius: 10,
    demandScore: 48,
    demandLevel: 'Medium',
    propertySalesCount: 8,
    franchiseSalesCount: 1,
    businessSalesCount: 1,
    lastUpdated: new Date().toLocaleDateString(),
    isAiEnabled: true
  }
];


// Reactive Selected City State
export let selectedCity: string = localStorage.getItem('nexopp_selected_city') || 'Hyderabad';
export const setSelectedCity = (city: string) => {
  selectedCity = city;
  localStorage.setItem('nexopp_selected_city', city);
  window.dispatchEvent(new CustomEvent('nexopp_data_changed'));
};

// API URL Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Load from Backend API
export const loadDataAsync = async () => {
  try {
    // 1. Fetch settings
    const settingsRes = await fetch(`${API_URL}/settings`);
    if (settingsRes.ok) {
      siteSettingsDb = await settingsRes.json();
    }

    // 2. Fetch properties
    const propsRes = await fetch(`${API_URL}/properties`);
    if (propsRes.ok) {
      propertiesDb = await propsRes.json();
    }

    // 3. Fetch franchises
    const franRes = await fetch(`${API_URL}/franchises`);
    if (franRes.ok) {
      franchiseDb = await franRes.json();
    }

    // 4. Fetch businesses
    const busRes = await fetch(`${API_URL}/businesses`);
    if (busRes.ok) {
      businessDb = await busRes.json();
    }

    // 5. Fetch dealers
    const dealersRes = await fetch(`${API_URL}/dealers`);
    if (dealersRes.ok) {
      dealersDb = await dealersRes.json();
    }

    // 6. Fetch enquiries
    const enquiriesRes = await fetch(`${API_URL}/enquiries`);
    if (enquiriesRes.ok) {
      const data = await enquiriesRes.json();
      enquiriesDb = data.properties || [];
      franchiseEnquiriesDb = data.franchises || [];
    }

    // 7. Load local-only metadata from LocalStorage
    const dr = localStorage.getItem('nexopp_demand_regions');
    const sv = localStorage.getItem('nexopp_showcase_videos');
    const ss = localStorage.getItem('nexopp_showcase_settings');
    const t = localStorage.getItem('nexopp_team_members');

    teamMembersDb = t ? JSON.parse(t) : [];
    demandRegionsDb = dr ? JSON.parse(dr) : defaultDemandRegions;
    showcaseVideosDb = sv ? JSON.parse(sv) : defaultShowcaseVideos;
    showcaseSettingsDb = ss ? JSON.parse(ss) : {
      maxVideoSizeMB: 200,
      maxVideoDurationSec: 60,
      defaultPlaybackDurationSec: 10
    };

    // Recalculate frontend stats from database records
    const analyticsRes = await fetch(`${API_URL}/analytics`);
    if (analyticsRes.ok) {
      const stats = await analyticsRes.json();
      siteSettingsDb.analytics = {
        activeListings: stats.activeListings,
        happyClients: stats.happyClients,
        dealsClosed: stats.dealsClosed,
        totalVisitors: stats.totalVisitors
      };
    }

    window.dispatchEvent(new Event('nexopp_data_changed'));
  } catch (err) {
    console.error("Error loading marketplace data from API:", err);
  }
};

// Save local-only metadata to LocalStorage and Notify App
export const notifyDataChanged = () => {
  try {
    localStorage.setItem('nexopp_team_members', JSON.stringify(teamMembersDb));
    localStorage.setItem('nexopp_demand_regions', JSON.stringify(demandRegionsDb));
    localStorage.setItem('nexopp_showcase_videos', JSON.stringify(showcaseVideosDb));
    localStorage.setItem('nexopp_showcase_settings', JSON.stringify(showcaseSettingsDb));
    window.dispatchEvent(new Event('nexopp_data_changed'));
  } catch (err) {
    console.error("Error saving metadata to localStorage:", err);
  }
};

// Initialize immediately on module load
loadDataAsync();

// Mutations
export const addProperty = async (item: PropertyListing) => {
  try {
    await fetch(`${API_URL}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const updateProperty = async (id: string, updated: Partial<PropertyListing>) => {
  try {
    await fetch(`${API_URL}/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const deleteProperty = async (id: string) => {
  try {
    await fetch(`${API_URL}/properties/${id}`, { method: 'DELETE' });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const updatePropertyVerification = async (id: string, verified: boolean) => {
  await updateProperty(id, { verified });
};

export const togglePropertyFeatured = async (id: string) => {
  const item = propertiesDb.find(p => p.id === id);
  if (item) await updateProperty(id, { premium: !item.premium });
};

export const togglePropertyTrending = async (id: string) => {
  const item = propertiesDb.find(p => p.id === id);
  if (item) await updateProperty(id, { trending: !item.trending });
};

export const addFranchise = async (item: FranchiseListing) => {
  try {
    await fetch(`${API_URL}/franchises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const updateFranchise = async (id: string, updated: Partial<FranchiseListing>) => {
  try {
    await fetch(`${API_URL}/franchises/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const deleteFranchise = async (id: string) => {
  try {
    await fetch(`${API_URL}/franchises/${id}`, { method: 'DELETE' });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const addDealer = async (item: Dealer) => {
  try {
    await fetch(`${API_URL}/dealers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const updateDealer = async (id: string, updated: Partial<Dealer>) => {
  try {
    await fetch(`${API_URL}/dealers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const deleteDealer = async (id: string) => {
  try {
    await fetch(`${API_URL}/dealers/${id}`, { method: 'DELETE' });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const addBusiness = async (item: BusinessListing) => {
  try {
    await fetch(`${API_URL}/businesses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const deleteBusiness = async (id: string) => {
  try {
    await fetch(`${API_URL}/businesses/${id}`, { method: 'DELETE' });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

// Showcase Video Mutations
export const addShowcaseVideo = (video: Omit<ShowcaseVideo, 'id' | 'createdDate'>) => {
  const newVideo: ShowcaseVideo = {
    ...video,
    id: 'sv_' + Date.now(),
    createdDate: new Date().toLocaleDateString()
  };
  showcaseVideosDb = [...showcaseVideosDb, newVideo];
  notifyDataChanged();
};

export const updateShowcaseVideo = (id: string, updated: Partial<ShowcaseVideo>) => {
  showcaseVideosDb = showcaseVideosDb.map(v => v.id === id ? { ...v, ...updated } : v);
  notifyDataChanged();
};

export const deleteShowcaseVideo = (id: string) => {
  showcaseVideosDb = showcaseVideosDb.filter(v => v.id !== id);
  notifyDataChanged();
};

export const updateShowcaseSettings = (updated: Partial<ShowcaseSettings>) => {
  showcaseSettingsDb = { ...showcaseSettingsDb, ...updated };
  notifyDataChanged();
};

export const deleteEnquiry = async (id: string) => {
  try {
    await fetch(`${API_URL}/enquiries/${id}`, { method: 'DELETE' });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const updateEnquiryStatus = async (id: string, status: 'New' | 'Contacted' | 'Follow-up' | 'Closed') => {
  try {
    await fetch(`${API_URL}/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
  try {
    await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const clearAllStaticData = async () => {
  // Clear mock local metadata
  teamMembersDb = [];
  notifyDataChanged();
};

export const bulkPublishProperties = async (ids: string[]) => {
  try {
    await fetch(`${API_URL}/properties/bulk-publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const bulkHideProperties = async (ids: string[]) => {
  try {
    await fetch(`${API_URL}/properties/bulk-hide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const bulkDeleteProperties = async (ids: string[]) => {
  try {
    await fetch(`${API_URL}/properties/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const addTeamMember = (item: TeamMember) => {
  teamMembersDb = [item, ...teamMembersDb];
  notifyDataChanged();
};

export const updateTeamMember = (id: string, updated: Partial<TeamMember>) => {
  teamMembersDb = teamMembersDb.map(m => m.id === id ? { ...m, ...updated } : m);
  notifyDataChanged();
};

export const deleteTeamMember = (id: string) => {
  teamMembersDb = teamMembersDb.filter(m => m.id !== id);
  notifyDataChanged();
};

export const addFranchiseEnquiry = async (item: FranchiseEnquiry) => {
  try {
    await fetch(`${API_URL}/enquiries/franchise`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const updateFranchiseEnquiryStatus = async (id: string, status: FranchiseEnquiry['status']) => {
  try {
    await fetch(`${API_URL}/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, type: 'Franchise' })
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const assignFranchiseEnquiryBroker = async (id: string, brokerId: string, brokerName: string) => {
  try {
    await fetch(`${API_URL}/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedBrokerId: brokerId, assignedBrokerName: brokerName, type: 'Franchise' })
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const deleteFranchiseEnquiry = async (id: string) => {
  try {
    await fetch(`${API_URL}/enquiries/${id}?type=Franchise`, { method: 'DELETE' });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const bulkPublishFranchises = async (ids: string[]) => {
  try {
    await fetch(`${API_URL}/franchises/bulk-publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const bulkArchiveFranchises = async (ids: string[]) => {
  try {
    await fetch(`${API_URL}/franchises/bulk-archive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};

export const bulkDeleteFranchises = async (ids: string[]) => {
  try {
    await fetch(`${API_URL}/franchises/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    await loadDataAsync();
  } catch (err) {
    console.error(err);
  }
};
  notifyDataChanged();
};

export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const calculateDemandScore = (region: DemandRegion): { score: number; level: 'High' | 'Medium' | 'Low'; propSales: number; franSales: number; busSales: number } => {
  if (!region.isAiEnabled && region.manualOverrideLevel) {
    const level = region.manualOverrideLevel;
    const score = level === 'High' ? 85 : (level === 'Medium' ? 50 : 15);
    return { score, level, propSales: region.propertySalesCount, franSales: region.franchiseSalesCount, busSales: region.businessSalesCount };
  }

  let propSales = 0;
  let activeProps = 0;
  propertiesDb.forEach(p => {
    if (p.latitude && p.longitude) {
      const dist = getDistance(region.latitude, region.longitude, p.latitude, p.longitude);
      if (dist <= region.radius) {
        if (p.approvalStatus === 'Sold') {
          propSales++;
        } else {
          activeProps++;
        }
      }
    }
  });

  let franSales = 0;
  let activeFrans = 0;
  franchiseDb.forEach(f => {
    if (f.latitude && f.longitude) {
      const dist = getDistance(region.latitude, region.longitude, f.latitude, f.longitude);
      if (dist <= region.radius) {
        if (f.status === 'Sold' || f.approvalStatus === 'Closed') {
          franSales++;
        } else {
          activeFrans++;
        }
      }
    }
  });

  let busSales = 0;
  let activeBuses = 0;
  businessDb.forEach(b => {
    if (b.latitude && b.longitude) {
      const dist = getDistance(region.latitude, region.longitude, b.latitude, b.longitude);
      if (dist <= region.radius) {
        // BusinessListing does not have status/approvalStatus. Treat all matched businesses as active
        activeBuses++;
      }
    }
  });

  const totalSales = propSales + franSales + busSales;
  const totalActive = activeProps + activeFrans + activeBuses;
  
  let score = 25 + (totalSales * 15) + (totalActive * 3);
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  let level: 'High' | 'Medium' | 'Low' = 'Low';
  if (score > 70) level = 'High';
  else if (score > 30) level = 'Medium';

  return { score: Math.round(score), level, propSales, franSales, busSales };
};

export const recalculateAllDemandRegions = () => {
  demandRegionsDb = demandRegionsDb.map(r => {
    const calc = calculateDemandScore(r);
    return {
      ...r,
      demandScore: calc.score,
      demandLevel: calc.level,
      propertySalesCount: calc.propSales,
      franchiseSalesCount: calc.franSales,
      businessSalesCount: calc.busSales,
      lastUpdated: new Date().toLocaleDateString()
    };
  });
  notifyDataChanged();
};

export const addDemandRegion = (item: Omit<DemandRegion, 'id' | 'demandScore' | 'demandLevel' | 'propertySalesCount' | 'franchiseSalesCount' | 'businessSalesCount' | 'lastUpdated'>) => {
  const newId = 'dr_' + Date.now();
  const tempRegion: DemandRegion = {
    ...item,
    id: newId,
    demandScore: 0,
    demandLevel: 'Low',
    propertySalesCount: 0,
    franchiseSalesCount: 0,
    businessSalesCount: 0,
    lastUpdated: new Date().toLocaleDateString()
  };
  const calc = calculateDemandScore(tempRegion);
  const finalRegion = {
    ...tempRegion,
    demandScore: calc.score,
    demandLevel: calc.level,
    propertySalesCount: calc.propSales,
    franchiseSalesCount: calc.franSales,
    businessSalesCount: calc.busSales
  };
  demandRegionsDb = [finalRegion, ...demandRegionsDb];
  notifyDataChanged();
};

export const updateDemandRegion = (id: string, updated: Partial<DemandRegion>) => {
  demandRegionsDb = demandRegionsDb.map(r => {
    if (r.id === id) {
      const merged = { ...r, ...updated };
      const calc = calculateDemandScore(merged);
      return {
        ...merged,
        demandScore: calc.score,
        demandLevel: calc.level,
        propertySalesCount: calc.propSales,
        franchiseSalesCount: calc.franSales,
        businessSalesCount: calc.busSales,
        lastUpdated: new Date().toLocaleDateString()
      };
    }
    return r;
  });
  notifyDataChanged();
};

export const deleteDemandRegion = (id: string) => {
  demandRegionsDb = demandRegionsDb.filter(r => r.id !== id);
  notifyDataChanged();
};
