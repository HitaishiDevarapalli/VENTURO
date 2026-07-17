import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SETTINGS_FILE = path.join(__dirname, '../../settings.json');

const defaultSettings = {
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
  availableCities: ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi NCR', 'Chennai', 'Pune', 'Guntur', 'Vijayawada', 'Visakhapatnam'],
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

const readSettings = () => {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
      return defaultSettings;
    }
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return defaultSettings;
  }
};

const writeSettings = (settings: any) => {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
};

export const getSettings = (req: Request, res: Response) => {
  const settings = readSettings();
  res.json(settings);
};

export const updateSettings = (req: Request, res: Response) => {
  try {
    const current = readSettings();
    const updated = { ...current, ...req.body };
    writeSettings(updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
