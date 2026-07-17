import { Request, Response } from 'express';
import { prisma } from '../index.js';

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const activeProperties = await prisma.property.count({
      where: { status: 'PUBLISHED' }
    });

    const activeFranchises = await prisma.franchise.count({
      where: { verified: true }
    });

    const activeBusinesses = await prisma.business.count({
      where: { verified: true }
    });

    const propertyLeads = await prisma.enquiry.count();
    const franchiseLeads = await prisma.franchiseEnquiry.count();

    const totalListings = activeProperties + activeFranchises + activeBusinesses;
    const totalLeads = propertyLeads + franchiseLeads;

    // Return aggregated stats
    res.json({
      activeListings: totalListings,
      happyClients: Math.floor(180 + totalLeads * 0.4), // simulated increment
      dealsClosed: Math.floor(45 + totalLeads * 0.15), // simulated increment
      totalVisitors: 14500 + totalLeads * 25,
      leadsCount: totalLeads,
      propertiesCount: activeProperties,
      franchisesCount: activeFranchises,
      businessesCount: activeBusinesses
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
