import { Request, Response } from 'express';
import { prisma } from '../index.js';

export const getFranchises = async (req: Request, res: Response) => {
  try {
    const { category, city, minInvestment, maxInvestment } = req.query;

    const where: any = {};

    if (category) {
      where.category = { contains: category as string, mode: 'insensitive' };
    }

    if (city && city !== 'All India' && city !== 'All Cities') {
      where.city = { contains: city as string, mode: 'insensitive' };
    }

    if (minInvestment || maxInvestment) {
      where.investment = {};
      if (minInvestment) where.investment.gte = parseFloat(minInvestment as string);
      if (maxInvestment) where.investment.lte = parseFloat(maxInvestment as string);
    }

    const franchises = await prisma.franchise.findMany({
      where,
      include: { broker: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(franchises);
  } catch (err) {
    console.error('Error fetching franchises:', err);
    res.status(500).json({ error: 'Failed to fetch franchises' });
  }
};

export const getFranchiseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const franchise = await prisma.franchise.findUnique({
      where: { id },
      include: { broker: true }
    });

    if (!franchise) {
      return res.status(404).json({ error: 'Franchise not found' });
    }

    res.json(franchise);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch franchise details' });
  }
};

export const createFranchise = async (req: Request, res: Response) => {
  try {
    const item = req.body;

    const franchise = await prisma.franchise.create({
      data: {
        brand: item.brand,
        type: item.type || 'Enterprise',
        category: item.category || '',
        investment: parseFloat(item.investment) || 0,
        investmentDisplay: item.investmentDisplay || `₹${item.investment} Lakhs`,
        location: item.location || '',
        state: item.state || '',
        city: item.city || '',
        latitude: parseFloat(item.latitude) || 17.43,
        longitude: parseFloat(item.longitude) || 78.40,
        rating: parseFloat(item.rating) || 5.0,
        reviewCount: parseInt(item.reviewCount) || 0,
        verified: item.verified ?? true,
        trending: item.trending ?? false,
        availableBranchCount: parseInt(item.availableBranchCount) || 1,
        image: item.image || '',
        images: Array.isArray(item.images) ? item.images : [],
        logo: item.logo || '',
        trustScore: parseFloat(item.trustScore) || 90,
        dealerId: item.dealerId || null
      }
    });

    res.status(201).json(franchise);
  } catch (err) {
    console.error('Error creating franchise:', err);
    res.status(500).json({ error: 'Failed to create franchise' });
  }
};

export const updateFranchise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = req.body;

    const franchise = await prisma.franchise.update({
      where: { id },
      data: {
        brand: item.brand || undefined,
        type: item.type || undefined,
        category: item.category || undefined,
        investment: item.investment !== undefined ? parseFloat(item.investment) : undefined,
        investmentDisplay: item.investmentDisplay || undefined,
        location: item.location || undefined,
        state: item.state || undefined,
        city: item.city || undefined,
        latitude: item.latitude !== undefined ? parseFloat(item.latitude) : undefined,
        longitude: item.longitude !== undefined ? parseFloat(item.longitude) : undefined,
        rating: item.rating !== undefined ? parseFloat(item.rating) : undefined,
        reviewCount: item.reviewCount !== undefined ? parseInt(item.reviewCount) : undefined,
        verified: item.verified !== undefined ? item.verified : undefined,
        trending: item.trending !== undefined ? item.trending : undefined,
        availableBranchCount: item.availableBranchCount !== undefined ? parseInt(item.availableBranchCount) : undefined,
        image: item.image || undefined,
        images: Array.isArray(item.images) ? item.images : undefined,
        logo: item.logo || undefined,
        trustScore: item.trustScore !== undefined ? parseFloat(item.trustScore) : undefined,
        dealerId: item.dealerId !== undefined ? item.dealerId : undefined
      }
    });

    res.json(franchise);
  } catch (err) {
    console.error('Error updating franchise:', err);
    res.status(500).json({ error: 'Failed to update franchise' });
  }
};

export const deleteFranchise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.franchise.delete({ where: { id } });
    res.json({ message: 'Franchise deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete franchise' });
  }
};

export const bulkPublishFranchises = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    await prisma.franchise.updateMany({
      where: { id: { in: ids } },
      data: { verified: true } // or status/etc
    });
    res.json({ message: 'Franchises published successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Bulk publish failed' });
  }
};

export const bulkArchiveFranchises = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    await prisma.franchise.updateMany({
      where: { id: { in: ids } },
      data: { trending: false }
    });
    res.json({ message: 'Franchises archived successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Bulk archive failed' });
  }
};

export const bulkDeleteFranchises = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    await prisma.franchise.deleteMany({
      where: { id: { in: ids } }
    });
    res.json({ message: 'Franchises deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Bulk delete failed' });
  }
};
