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
    title: 'Skyline Heights 3 BHK',
    description: 'Ultra-luxurious high-rise 3 BHK apartment complex in the premium Financial District.',
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
    title: 'Golden Palms 2 BHK',
    description: 'Premium modern 2 BHK apartment block in Guntur city center with all amenities.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    city: 'Guntur',
    area: 'Narakodur',
    latitude: 16.3067,
    longitude: 80.4363,
    price: 42,
    priceDisplay: '₹42 Lakhs',
    category: 'Apartment',
    status: 'Buy',
    areaSqFt: '1100 Sq Ft',
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
    title: 'Prestige Royal Gardens 4 BHK',
    description: 'Premium 4 BHK villa community with private garden and club house.',
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
    title: 'Urban Nest Studio 1 BHK',
    description: 'Cozy fully furnished 1 BHK apartment ideal for IT professionals working nearby.',
    image: 'https://images.unsplash.com/photo-1522050212171-61b01dd24579?auto=format&fit=crop&q=80&w=800',
    state: 'Andhra Pradesh',
    district: 'Krishna',
    city: 'Vijayawada',
    area: 'Benz Circle',
    latitude: 16.5062,
    longitude: 80.6480,
    price: 0.28,
    priceDisplay: '₹28,000/mo',
    category: 'Apartment',
    status: 'Rent',
    areaSqFt: '750 Sq Ft',
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
    title: 'Prestige Silicon Gateway 4 BHK',
    description: 'High-end smart technology 4 BHK villa with home automation in Electronic City.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
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
    title: 'Aura Heights 2 BHK',
    description: 'Exclusive residential 2 BHK flat near development corridor with great connectivity.',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=800',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    city: 'Guntur',
    area: 'Amaravati Road',
    latitude: 16.3200,
    longitude: 80.4100,
    price: 55,
    priceDisplay: '₹55 Lakhs',
    category: 'Apartment',
    status: 'Buy',
    areaSqFt: '1250 Sq Ft',
    rating: 4.4,
    reviewCount: 22,
    verified: true,
    premium: false,
    trending: true,
    bestSeller: false,
    availabilityCount: 1,
    trustScore: 87,
    createdDate: '2026-06-18'
  },
  {
    id: 'P8',
    dealerId: 'D2',
    title: 'Silicon Heights 1 BHK',
    description: 'Premium modern 1 BHK apartment situated in Electronic City tech corridor.',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    area: 'Electronic City',
    latitude: 12.8500,
    longitude: 77.6600,
    price: 38,
    priceDisplay: '₹38 Lakhs',
    category: 'Apartment',
    status: 'Buy',
    areaSqFt: '680 Sq Ft',
    rating: 4.6,
    reviewCount: 29,
    verified: true,
    premium: false,
    trending: true,
    bestSeller: false,
    availabilityCount: 4,
    trustScore: 91,
    createdDate: '2026-06-15'
  },
  {
    id: 'P9',
    dealerId: 'D2',
    title: 'Greenwood Residency 2 BHK',
    description: 'Lush green 2 BHK apartment block with all amenities and close to key IT parks.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    area: 'Sarjapur Road',
    latitude: 12.9100,
    longitude: 77.6800,
    price: 65,
    priceDisplay: '₹65 Lakhs',
    category: 'Apartment',
    status: 'Buy',
    areaSqFt: '1200 Sq Ft',
    rating: 4.7,
    reviewCount: 42,
    verified: true,
    premium: true,
    trending: true,
    bestSeller: true,
    availabilityCount: 2,
    trustScore: 94,
    createdDate: '2026-06-10'
  },
  {
    id: 'P10',
    dealerId: 'D3',
    title: 'Coastal Vista 1 BHK',
    description: 'Beautiful 1 BHK sea-facing apartment layout located in high growth bay region.',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    city: 'Visakhapatnam',
    area: 'Beach Road',
    latitude: 17.7200,
    longitude: 83.3200,
    price: 45,
    priceDisplay: '₹45 Lakhs',
    category: 'Apartment',
    status: 'Buy',
    areaSqFt: '700 Sq Ft',
    rating: 4.5,
    reviewCount: 18,
    verified: true,
    premium: false,
    trending: true,
    bestSeller: false,
    availabilityCount: 3,
    trustScore: 88,
    createdDate: '2026-06-20'
  },
  {
    id: 'P11',
    dealerId: 'D3',
    title: 'Seaside Enclave 2 BHK',
    description: 'Spacious 2 BHK coastal apartment block situated in prime Visakhapatnam district.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    city: 'Visakhapatnam',
    area: 'MVP Colony',
    latitude: 17.7400,
    longitude: 83.3300,
    price: 78,
    priceDisplay: '₹78 Lakhs',
    category: 'Apartment',
    status: 'Buy',
    areaSqFt: '1150 Sq Ft',
    rating: 4.8,
    reviewCount: 34,
    verified: true,
    premium: true,
    trending: true,
    bestSeller: false,
    availabilityCount: 2,
    trustScore: 93,
    createdDate: '2026-06-19'
  },
  {
    id: 'P12',
    dealerId: 'D1',
    title: 'Central Manor 2 BHK',
    description: 'Elegant 2 BHK residential house located in prime Vijayawada central region.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
    state: 'Andhra Pradesh',
    district: 'Krishna',
    city: 'Vijayawada',
    area: 'Gunadala',
    latitude: 16.5100,
    longitude: 80.6600,
    price: 90,
    priceDisplay: '₹90 Lakhs',
    category: 'House',
    status: 'Buy',
    areaSqFt: '1600 Sq Ft',
    rating: 4.7,
    reviewCount: 25,
    verified: true,
    premium: true,
    trending: false,
    bestSeller: true,
    availabilityCount: 1,
    trustScore: 92,
    createdDate: '2026-06-22'
  },
  {
    id: 'P13',
    dealerId: 'D2',
    title: 'Green Meadows Premium Plots',
    description: 'Premium villa plots in a gated community with all modern amenities.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    state: 'Telangana',
    district: 'Rangareddy',
    city: 'Hyderabad',
    area: 'Shankarpalli',
    latitude: 17.3980,
    longitude: 78.1320,
    price: 120,
    priceDisplay: '₹1.2 Crore',
    category: 'Plot',
    status: 'Buy',
    areaSqFt: '300 Sq Yds',
    rating: 4.8,
    reviewCount: 45,
    verified: true,
    premium: true,
    trending: true,
    bestSeller: false,
    availabilityCount: 12,
    trustScore: 95,
    createdDate: '2026-06-23'
  },
  {
    id: 'P14',
    dealerId: 'D1',
    title: 'Sunrise Valley Layout',
    description: 'Affordable open plots with clear title and DTCP approval.',
    image: 'https://images.unsplash.com/photo-1624819777935-8ab65b1613eb?auto=format&fit=crop&q=80&w=800',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    city: 'Guntur',
    area: 'Tenali Highway',
    latitude: 16.2990,
    longitude: 80.4450,
    price: 35,
    priceDisplay: '₹35 Lakhs',
    category: 'Plot',
    status: 'Buy',
    areaSqFt: '200 Sq Yds',
    rating: 4.4,
    reviewCount: 12,
    verified: true,
    premium: false,
    trending: false,
    bestSeller: true,
    availabilityCount: 20,
    trustScore: 88,
    createdDate: '2026-06-24'
  },
  {
    id: 'P15',
    dealerId: 'D3',
    title: 'Coastal Breeze Layout',
    description: 'Sea-view premium plots perfectly suited for luxury villas or farmhouses.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    city: 'Visakhapatnam',
    area: 'Bheemili',
    latitude: 17.8910,
    longitude: 83.4540,
    price: 250,
    priceDisplay: '₹2.5 Crore',
    category: 'Plot',
    status: 'Buy',
    areaSqFt: '500 Sq Yds',
    rating: 4.9,
    reviewCount: 78,
    verified: true,
    premium: true,
    trending: true,
    bestSeller: true,
    availabilityCount: 4,
    trustScore: 99,
    createdDate: '2026-06-25'
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
  },
  {
    id: 'B5',
    name: 'Organic Cafe & Bakery',
    industry: 'Food & Beverage',
    location: 'Hyderabad, Gachibowli',
    state: 'Telangana',
    city: 'Hyderabad',
    latitude: 17.4400,
    longitude: 78.3480,
    revenue: '₹48 Lakhs / yr',
    price: 18,
    priceDisplay: '₹18 Lakhs',
    rating: 4.6,
    reviewCount: 45,
    verified: true,
    trending: false,
    sellerProfile: 'Retiring Chef',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    trustScore: 91
  },
  {
    id: 'B6',
    name: 'Apex Dental Care & Implant Clinic',
    industry: 'Healthcare',
    location: 'Guntur, Lakshmipuram',
    state: 'Andhra Pradesh',
    city: 'Guntur',
    latitude: 16.3050,
    longitude: 80.4350,
    revenue: '₹75 Lakhs / yr',
    price: 40,
    priceDisplay: '₹40 Lakhs',
    rating: 4.8,
    reviewCount: 52,
    verified: true,
    trending: true,
    sellerProfile: 'Specialist Relocating',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    trustScore: 95
  },
  {
    id: 'B7',
    name: 'MedLife Diagnostics Center',
    industry: 'Healthcare',
    location: 'Hyderabad, Madhapur',
    state: 'Telangana',
    city: 'Hyderabad',
    latitude: 17.4480,
    longitude: 78.3900,
    revenue: '₹2.1 Crore / yr',
    price: 95,
    priceDisplay: '₹95 Lakhs',
    rating: 4.7,
    reviewCount: 78,
    verified: true,
    trending: false,
    sellerProfile: 'Group Restructuring',
    image: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=800',
    trustScore: 93
  },
  {
    id: 'B8',
    name: 'Urban Edge Fashion Boutique',
    industry: 'Retail / FMCG',
    location: 'Hyderabad, Jubilee Hills',
    state: 'Telangana',
    city: 'Hyderabad',
    latitude: 17.4300,
    longitude: 78.4100,
    revenue: '₹60 Lakhs / yr',
    price: 22,
    priceDisplay: '₹22 Lakhs',
    rating: 4.4,
    reviewCount: 22,
    verified: true,
    trending: false,
    sellerProfile: 'Sole Proprietor Exit',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    trustScore: 89
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
