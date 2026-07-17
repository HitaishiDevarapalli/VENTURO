import { Request, Response } from 'express';
import { prisma } from '../index.js';

export const getDealers = async (req: Request, res: Response) => {
  try {
    const dealers = await prisma.broker.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const mapped = dealers.map(d => ({
      id: d.id,
      logo: d.photoUrl || '',
      photo: d.photoUrl || '',
      companyName: d.companyName || d.name,
      fullName: d.name,
      rating: d.rating,
      reviewCount: d.reviewCount,
      verified: d.verified,
      premiumPartner: d.commissionRate !== null,
      bestSeller: d.revenueGenerated > 10,
      yearsExperience: d.experienceYrs,
      responseTime: 'Within 2 hours',
      inventoryCount: 5,
      coverage: { Hyderabad: 3 },
      latitude: 17.43,
      longitude: 78.40,
      phone: d.phone,
      whatsapp: d.whatsapp || undefined,
      email: d.email,
      specialization: d.specialization || undefined,
      languages: d.languages.join(', '),
      reraNumber: d.reraNumber || undefined,
      revenueGenerated: d.revenueGenerated,
      commissionRate: d.commissionRate || undefined
    }));

    res.json(mapped);
  } catch (err) {
    console.error('Error fetching dealers:', err);
    res.status(500).json({ error: 'Failed to fetch dealers' });
  }
};

export const getDealerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const d = await prisma.broker.findUnique({
      where: { id }
    });

    if (!d) {
      return res.status(404).json({ error: 'Dealer not found' });
    }

    const mapped = {
      id: d.id,
      logo: d.photoUrl || '',
      photo: d.photoUrl || '',
      companyName: d.companyName || d.name,
      fullName: d.name,
      rating: d.rating,
      reviewCount: d.reviewCount,
      verified: d.verified,
      premiumPartner: d.commissionRate !== null,
      bestSeller: d.revenueGenerated > 10,
      yearsExperience: d.experienceYrs,
      responseTime: 'Within 2 hours',
      inventoryCount: 5,
      coverage: { Hyderabad: 3 },
      latitude: 17.43,
      longitude: 78.40,
      phone: d.phone,
      whatsapp: d.whatsapp || undefined,
      email: d.email,
      specialization: d.specialization || undefined,
      languages: d.languages.join(', '),
      reraNumber: d.reraNumber || undefined,
      revenueGenerated: d.revenueGenerated,
      commissionRate: d.commissionRate || undefined
    };

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dealer details' });
  }
};

export const createDealer = async (req: Request, res: Response) => {
  try {
    const item = req.body;

    const languages = item.languages
      ? item.languages.split(',').map((l: string) => l.trim())
      : ['English', 'Hindi', 'Telugu'];

    const dealer = await prisma.broker.create({
      data: {
        name: item.fullName || item.name || 'Broker Partner',
        companyName: item.companyName || '',
        designation: item.specialization || 'Authorized Partner',
        reraNumber: item.reraNumber || null,
        experienceYrs: parseInt(item.yearsExperience) || 0,
        languages,
        commissionRate: parseFloat(item.commissionRate) || null,
        specialization: item.specialization || '',
        rating: parseFloat(item.rating) || 5.0,
        reviewCount: parseInt(item.reviewCount) || 0,
        phone: item.phone || '',
        whatsapp: item.whatsapp || '',
        email: item.email || `${Math.random().toString(36).substring(7)}@broker.com`,
        photoUrl: item.photo || item.logo || '',
        revenueGenerated: parseFloat(item.revenueGenerated) || 0
      }
    });

    res.status(201).json(dealer);
  } catch (err) {
    console.error('Error creating dealer:', err);
    res.status(500).json({ error: 'Failed to create dealer' });
  }
};

export const updateDealer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = req.body;

    const languages = item.languages
      ? item.languages.split(',').map((l: string) => l.trim())
      : undefined;

    const dealer = await prisma.broker.update({
      where: { id },
      data: {
        name: item.fullName || item.name || undefined,
        companyName: item.companyName || undefined,
        reraNumber: item.reraNumber !== undefined ? item.reraNumber : undefined,
        experienceYrs: item.yearsExperience !== undefined ? parseInt(item.yearsExperience) : undefined,
        languages: languages || undefined,
        commissionRate: item.commissionRate !== undefined ? parseFloat(item.commissionRate) : undefined,
        specialization: item.specialization || undefined,
        rating: item.rating !== undefined ? parseFloat(item.rating) : undefined,
        reviewCount: item.reviewCount !== undefined ? parseInt(item.reviewCount) : undefined,
        phone: item.phone || undefined,
        whatsapp: item.whatsapp || undefined,
        email: item.email || undefined,
        photoUrl: item.photo || item.logo || undefined,
        revenueGenerated: item.revenueGenerated !== undefined ? parseFloat(item.revenueGenerated) : undefined
      }
    });

    res.json(dealer);
  } catch (err) {
    console.error('Error updating dealer:', err);
    res.status(500).json({ error: 'Failed to update dealer' });
  }
};

export const deleteDealer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.broker.delete({ where: { id } });
    res.json({ message: 'Dealer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete dealer' });
  }
};
