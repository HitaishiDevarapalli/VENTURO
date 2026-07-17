import { Request, Response } from 'express';
import { prisma } from '../index.js';

export const getBusinesses = async (req: Request, res: Response) => {
  try {
    const { industry, city } = req.query;
    const where: any = {};

    if (industry) {
      where.industry = { contains: industry as string, mode: 'insensitive' };
    }

    if (city && city !== 'All India' && city !== 'All Cities') {
      where.city = { contains: city as string, mode: 'insensitive' };
    }

    const businesses = await prisma.business.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(businesses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
};

export const getBusinessById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const business = await prisma.business.findUnique({
      where: { id }
    });
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json(business);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch business details' });
  }
};

export const createBusiness = async (req: Request, res: Response) => {
  try {
    const item = req.body;
    const business = await prisma.business.create({
      data: {
        name: item.name,
        title: item.title || item.name,
        industry: item.industry || 'General',
        location: item.location || '',
        state: item.state || '',
        city: item.city || '',
        latitude: parseFloat(item.latitude) || 17.43,
        longitude: parseFloat(item.longitude) || 78.40,
        price: parseFloat(item.price) || 0,
        priceDisplay: item.priceDisplay || `₹${item.price} Lakhs`,
        revenueMonthly: item.revenueMonthly || 'Not Disclosed',
        profitMonthly: item.profitMonthly || 'Not Disclosed',
        establishedYear: parseInt(item.establishedYear) || new Date().getFullYear(),
        employeesCount: parseInt(item.employeesCount) || 0,
        rating: parseFloat(item.rating) || 5.0,
        reviewCount: parseInt(item.reviewCount) || 0,
        verified: item.verified ?? true,
        trending: item.trending ?? false,
        image: item.image || '',
        description: item.description || '',
        reasonForSale: item.reasonForSale || ''
      }
    });
    res.status(201).json(business);
  } catch (err) {
    console.error('Error creating business:', err);
    res.status(500).json({ error: 'Failed to create business' });
  }
};

export const deleteBusiness = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.business.delete({ where: { id } });
    res.json({ message: 'Business deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete business' });
  }
};
