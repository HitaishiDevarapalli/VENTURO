export interface Dealer {
  id: string;
  logo: string;
  photo: string;
  companyName: string;
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
}

export interface PropertyListing {
  id: string;
  dealerId: string;
  title: string;
  description: string;
  image: string;
  state: string;
  district: string;
  city: string;
  area: string;
  latitude: number;
  longitude: number;
  price: number; // in Lakhs (e.g. 85 for 85 Lakhs, 180 for 1.8 Crore)
  priceDisplay: string;
  category: 'Apartment' | 'Villa' | 'House' | 'Plot' | 'Commercial';
  status: 'Buy' | 'Sell' | 'Rent';
  areaSqFt: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  premium: boolean;
  trending: boolean;
  bestSeller: boolean;
  availabilityCount: number;
  trustScore: number; // 0-100
  createdDate: string;
}

export interface FranchiseListing {
  id: string;
  brand: string;
  type: string;
  investment: number; // in Lakhs
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
  logo: string;
  trustScore: number;
}

export interface BusinessListing {
  id: string;
  name: string;
  industry: string;
  location: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  revenue: string;
  price: number; // in Lakhs
  priceDisplay: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  trending: boolean;
  sellerProfile: string;
  image: string;
  trustScore: number;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  category: 'Health' | 'Property' | 'Vehicle' | 'Business';
  rating: number;
  reviewCount: number;
  location: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  premiumStartingPrice: string;
  coverageAmount: string;
  claimProcess: string;
  trustScore: number;
}

export interface ServiceProvider {
  id: string;
  name: string;
  category: 'Legal Services' | 'Tax Consultation' | 'Investment Advisory' | 'Company Registration' | 'Business Consulting';
  rating: number;
  reviewCount: number;
  experience: number; // years
  location: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  trustScore: number;
}

// Initial Data Set
export let dealersDb: Dealer[] = [
  {
    id: 'D1',
    logo: '🏆',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120&h=120',
    companyName: 'ABC Developers',
    rating: 4.9,
    reviewCount: 320,
    verified: true,
    premiumPartner: true,
    bestSeller: true,
    yearsExperience: 15,
    responseTime: '15 Mins',
    inventoryCount: 10,
    coverage: { 'Hyderabad': 5, 'Guntur': 2, 'Vijayawada': 3 },
    latitude: 17.4483,
    longitude: 78.3741
  },
  {
    id: 'D2',
    logo: '💎',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120',
    companyName: 'Prestige Realty Group',
    rating: 4.8,
    reviewCount: 185,
    verified: true,
    premiumPartner: true,
    bestSeller: false,
    yearsExperience: 12,
    responseTime: '30 Mins',
    inventoryCount: 6,
    coverage: { 'Hyderabad': 3, 'Bengaluru': 3 },
    latitude: 12.9716,
    longitude: 77.5946
  },
  {
    id: 'D3',
    logo: '⭐',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120',
    companyName: 'Apex Capital Brokers',
    rating: 4.7,
    reviewCount: 95,
    verified: true,
    premiumPartner: false,
    bestSeller: true,
    yearsExperience: 8,
    responseTime: '1 Hour',
    inventoryCount: 5,
    coverage: { 'Vijayawada': 2, 'Visakhapatnam': 3 },
    latitude: 16.5062,
    longitude: 80.6480
  }
];

export let propertiesDb: PropertyListing[] = [
  {
    id: 'P1',
    dealerId: 'D1',
    title: 'Skyline Heights',
    description: 'Ultra-luxurious high-rise apartment complex in the premium Financial District.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    state: 'Telangana',
    district: 'Rangareddy',
    city: 'Hyderabad',
    area: 'Gachibowli',
    latitude: 17.4483,
    longitude: 78.3741,
    price: 85,
    priceDisplay: '₹85 Lakhs',
    category: 'Apartment',
    status: 'Buy',
    areaSqFt: '1800 Sq Ft',
    rating: 4.9,
    reviewCount: 142,
    verified: true,
    premium: true,
    trending: true,
    bestSeller: true,
    availabilityCount: 5,
    trustScore: 98,
    createdDate: '2026-05-10'
  },
  {
    id: 'P2',
    dealerId: 'D1',
    title: 'Golden Meadows',
    description: 'Perfect open villa plots in Guntur with grand entrance arch, blacktop roads and security.',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    city: 'Guntur',
    area: 'Narakodur',
    latitude: 16.3067,
    longitude: 80.4363,
    price: 42,
    priceDisplay: '₹42 Lakhs',
    category: 'Plot',
    status: 'Sell',
    areaSqFt: '240 Sq Yards',
    rating: 4.5,
    reviewCount: 38,
    verified: true,
    premium: false,
    trending: false,
    bestSeller: false,
    availabilityCount: 2,
    trustScore: 90,
    createdDate: '2026-06-01'
  },
  {
    id: 'P3',
    dealerId: 'D1',
    title: 'Prestige Royal Gardens',
    description: 'Premium villa community with club house and lush green parks.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
    state: 'Telangana',
    district: 'Rangareddy',
    city: 'Hyderabad',
    area: 'Kokapet',
    latitude: 17.4168,
    longitude: 78.3248,
    price: 180,
    priceDisplay: '₹1.8 Crore',
    category: 'Villa',
    status: 'Buy',
    areaSqFt: '3200 Sq Ft',
    rating: 4.9,
    reviewCount: 74,
    verified: true,
    premium: true,
    trending: true,
    bestSeller: true,
    availabilityCount: 3,
    trustScore: 97,
    createdDate: '2026-04-15'
  },
  {
    id: 'P4',
    dealerId: 'D1',
    title: 'Urban Nest Studio',
    description: 'Cozy fully furnished apartment ideal for IT professionals working nearby.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    state: 'Andhra Pradesh',
    district: 'Krishna',
    city: 'Vijayawada',
    area: 'Benz Circle',
    latitude: 16.5062,
    longitude: 80.6480,
    price: 0.28, // ₹28,000 rent model
    priceDisplay: '₹28,000/mo',
    category: 'Apartment',
    status: 'Rent',
    areaSqFt: '1200 Sq Ft',
    rating: 4.6,
    reviewCount: 19,
    verified: true,
    premium: false,
    trending: true,
    bestSeller: false,
    availabilityCount: 3,
    trustScore: 89,
    createdDate: '2026-06-12'
  },
  {
    id: 'P5',
    dealerId: 'D2',
    title: 'Prestige Silicon Gateway',
    description: 'High-end smart technology villa with home automation in Electronic City.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    area: 'Whitefield',
    latitude: 12.9698,
    longitude: 77.7500,
    price: 220,
    priceDisplay: '₹2.2 Crore',
    category: 'Villa',
    status: 'Buy',
    areaSqFt: '3600 Sq Ft',
    rating: 4.8,
    reviewCount: 88,
    verified: true,
    premium: true,
    trending: true,
    bestSeller: false,
    availabilityCount: 2,
    trustScore: 96,
    createdDate: '2026-05-20'
  },
  {
    id: 'P6',
    dealerId: 'D3',
    title: 'Cyber Crown Tech Park Space',
    description: 'Fully corporate interior office space ready for occupancy inside business district.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    city: 'Visakhapatnam',
    area: 'Madhurawada',
    latitude: 17.8185,
    longitude: 83.3488,
    price: 110,
    priceDisplay: '₹1.1 Crore',
    category: 'Commercial',
    status: 'Buy',
    areaSqFt: '2100 Sq Ft',
    rating: 4.7,
    reviewCount: 45,
    verified: true,
    premium: false,
    trending: false,
    bestSeller: true,
    availabilityCount: 3,
    trustScore: 92,
    createdDate: '2026-03-10'
  },
  {
    id: 'P7',
    dealerId: 'D1',
    title: 'Golden Aura Meadows',
    description: 'Exclusive residential plots near development corridor with great connectivity.',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    city: 'Guntur',
    area: 'Amaravati Road',
    latitude: 16.3200,
    longitude: 80.4100,
    price: 55,
    priceDisplay: '₹55 Lakhs',
    category: 'Plot',
    status: 'Sell',
    areaSqFt: '300 Sq Yards',
    rating: 4.4,
    reviewCount: 22,
    verified: true,
    premium: false,
    trending: true,
    bestSeller: false,
    availabilityCount: 1, // trigger suggestions when searched
    trustScore: 87,
    createdDate: '2026-06-18'
  }
];

export let franchiseDb: FranchiseListing[] = [
  {
    id: 'F1',
    brand: 'Chai Oasis',
    type: 'Restaurant Franchise',
    investment: 15,
    investmentDisplay: '₹15 Lakhs',
    location: 'Hyderabad, Gachibowli',
    state: 'Telangana',
    city: 'Hyderabad',
    latitude: 17.4483,
    longitude: 78.3741,
    rating: 4.8,
    reviewCount: 112,
    verified: true,
    trending: true,
    availableBranchCount: 12,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    logo: '☕',
    trustScore: 95
  },
  {
    id: 'F2',
    brand: 'Vogue Retail Store',
    type: 'Retail Franchise',
    investment: 8,
    investmentDisplay: '₹8 Lakhs',
    location: 'Guntur, Amaravati Rd',
    state: 'Andhra Pradesh',
    city: 'Guntur',
    latitude: 16.3067,
    longitude: 80.4363,
    rating: 4.6,
    reviewCount: 48,
    verified: true,
    trending: false,
    availableBranchCount: 5,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    logo: '👕',
    trustScore: 89
  },
  {
    id: 'F3',
    brand: 'Apex Academy',
    type: 'Education Franchise',
    investment: 20,
    investmentDisplay: '₹20 Lakhs',
    location: 'Vijayawada, Benz Circle',
    state: 'Andhra Pradesh',
    city: 'Vijayawada',
    latitude: 16.5062,
    longitude: 80.6480,
    rating: 4.9,
    reviewCount: 86,
    verified: true,
    trending: true,
    availableBranchCount: 8,
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800',
    logo: '🎓',
    trustScore: 97
  }
];

export let businessDb: BusinessListing[] = [
  {
    id: 'B1',
    name: 'High-End Bistro & Lounge',
    industry: 'Food & Beverage',
    location: 'Hyderabad, Jubilee Hills',
    state: 'Telangana',
    city: 'Hyderabad',
    latitude: 17.4325,
    longitude: 78.4075,
    revenue: '₹1.2 Crore / yr',
    price: 45,
    priceDisplay: '₹45 Lakhs',
    rating: 4.7,
    reviewCount: 92,
    verified: true,
    trending: true,
    sellerProfile: 'Retiring Entrepreneur',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
    trustScore: 94
  },
  {
    id: 'B2',
    name: 'DailyMart Supermarket Chain',
    industry: 'Retail / FMCG',
    location: 'Guntur, Arundelpet',
    state: 'Andhra Pradesh',
    city: 'Guntur',
    latitude: 16.3120,
    longitude: 80.4420,
    revenue: '₹85 Lakhs / yr',
    price: 25,
    priceDisplay: '₹25 Lakhs',
    rating: 4.5,
    reviewCount: 31,
    verified: true,
    trending: false,
    sellerProfile: 'Relocating Owner',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    trustScore: 88
  },
  {
    id: 'B3',
    name: 'Precision Auto Parts Manufacturing',
    industry: 'Manufacturing',
    location: 'Vijayawada Industrial Area',
    state: 'Andhra Pradesh',
    city: 'Vijayawada',
    latitude: 16.5333,
    longitude: 80.6366,
    revenue: '₹4.5 Crore / yr',
    price: 150,
    priceDisplay: '₹1.5 Crore',
    rating: 4.9,
    reviewCount: 165,
    verified: true,
    trending: true,
    sellerProfile: 'Corporate Spin-off',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
    trustScore: 98
  },
  {
    id: 'B4',
    name: 'Tier-3 Enterprise Software Firm',
    industry: 'IT Services',
    location: 'Hyderabad, HITEC City',
    state: 'Telangana',
    city: 'Hyderabad',
    latitude: 17.4483,
    longitude: 78.3741,
    revenue: '₹3.8 Crore / yr',
    price: 200,
    priceDisplay: '₹2 Crore',
    rating: 4.8,
    reviewCount: 120,
    verified: true,
    trending: true,
    sellerProfile: 'Fund Exit Partner',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800',
    trustScore: 96
  }
];

export let insuranceDb: InsuranceProvider[] = [
  {
    id: 'I1',
    name: 'Apollo Munchen Health Group',
    category: 'Health',
    rating: 4.8,
    reviewCount: 1240,
    location: 'Hyderabad Corporate Office',
    state: 'Telangana',
    city: 'Hyderabad',
    latitude: 17.4483,
    longitude: 78.3741,
    verified: true,
    premiumStartingPrice: '₹450 / mo',
    coverageAmount: 'Up to ₹1 Crore Cover',
    claimProcess: 'Cashless in 30 Mins',
    trustScore: 97
  },
  {
    id: 'I2',
    name: 'Royal Sun Property Protection',
    category: 'Property',
    rating: 4.7,
    reviewCount: 680,
    location: 'Vijayawada Desk',
    state: 'Andhra Pradesh',
    city: 'Vijayawada',
    latitude: 16.5062,
    longitude: 80.6480,
    verified: true,
    premiumStartingPrice: '₹800 / mo',
    coverageAmount: 'Complete Asset Guard',
    claimProcess: 'Valuation Survey Desk',
    trustScore: 94
  }
];

export let servicesDb: ServiceProvider[] = [
  {
    id: 'S1',
    name: 'Tri-Legal Associates',
    category: 'Legal Services',
    rating: 4.9,
    reviewCount: 327,
    experience: 18,
    location: 'Hyderabad High Court Wing',
    state: 'Telangana',
    city: 'Hyderabad',
    latitude: 17.4483,
    longitude: 78.3741,
    verified: true,
    trustScore: 99
  },
  {
    id: 'S2',
    name: 'Balaji & Co. Chartered Accountants',
    category: 'Tax Consultation',
    rating: 4.8,
    reviewCount: 195,
    experience: 14,
    location: 'Guntur Arundelpet',
    state: 'Andhra Pradesh',
    city: 'Guntur',
    latitude: 16.3067,
    longitude: 80.4363,
    verified: true,
    trustScore: 95
  }
];

// Helper functions for Mutations in Admin Panel
export const addProperty = (property: PropertyListing) => {
  propertiesDb = [property, ...propertiesDb];
  // Sync dealer inventory
  const dealer = dealersDb.find(d => d.id === property.dealerId);
  if (dealer) {
    dealer.inventoryCount += 1;
    dealer.coverage[property.city] = (dealer.coverage[property.city] || 0) + 1;
  }
};

export const updatePropertyVerification = (id: string, verified: boolean) => {
  const item = propertiesDb.find(p => p.id === id);
  if (item) {
    item.verified = verified;
  }
};

export const addFranchise = (item: FranchiseListing) => {
  franchiseDb = [item, ...franchiseDb];
};

export const addBusiness = (item: BusinessListing) => {
  businessDb = [item, ...businessDb];
};
