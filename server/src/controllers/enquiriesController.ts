import { Request, Response } from 'express';
import { prisma } from '../index.js';

export const getEnquiries = async (req: Request, res: Response) => {
  try {
    const propertyEnquiries = await prisma.enquiry.findMany({
      include: {
        property: true,
        broker: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const franchiseEnquiries = await prisma.franchiseEnquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const mappedProperties = propertyEnquiries.map(e => ({
      id: e.id,
      customerName: e.customerName,
      phone: e.customerPhone,
      email: e.customerEmail || '',
      listingTitle: e.property?.title || 'Unknown Property',
      brokerName: e.broker?.name || 'Unassigned',
      status: e.status === 'NEW' ? 'New' : (e.status === 'CONTACTED' ? 'Contacted' : (e.status === 'FOLLOW_UP' ? 'Follow-up' : 'Closed')),
      priority: e.priority === 'HIGH' ? 'High' : (e.priority === 'LOW' ? 'Low' : 'Medium'),
      source: e.source,
      date: e.createdAt.toLocaleDateString(),
      type: 'Property'
    }));

    const mappedFranchises = franchiseEnquiries.map(e => ({
      id: e.id,
      customerName: e.customerName,
      phone: e.mobileNumber,
      email: e.email,
      listingTitle: e.interestedFranchise,
      brokerName: e.assignedBrokerName || 'Unassigned',
      status: e.status,
      priority: 'Medium',
      source: 'Website Form',
      date: e.createdAt.toLocaleDateString(),
      type: 'Franchise',
      investmentBudget: e.investmentBudget,
      preferredLocation: e.preferredLocation
    }));

    res.json({
      properties: mappedProperties,
      franchises: mappedFranchises
    });
  } catch (err) {
    console.error('Error fetching enquiries:', err);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
};

export const createPropertyEnquiry = async (req: Request, res: Response) => {
  try {
    const item = req.body;

    // Find first broker if not specified
    let brokerId = item.brokerId || null;
    if (!brokerId && item.brokerName) {
      const broker = await prisma.broker.findFirst({
        where: { name: { contains: item.brokerName, mode: 'mode' as any } } // case insensitive
      });
      if (broker) brokerId = broker.id;
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        customerName: item.customerName,
        customerPhone: item.phone || item.customerPhone,
        customerEmail: item.email || item.customerEmail || '',
        message: item.message || `Interested in ${item.listingTitle}`,
        status: 'NEW',
        priority: 'MEDIUM',
        source: item.source || 'WEBSITE_FORM',
        propertyId: item.propertyId || null,
        brokerId
      }
    });

    res.status(201).json(enquiry);
  } catch (err) {
    console.error('Error creating property enquiry:', err);
    res.status(500).json({ error: 'Failed to create enquiry' });
  }
};

export const createFranchiseEnquiry = async (req: Request, res: Response) => {
  try {
    const item = req.body;

    const enquiry = await prisma.franchiseEnquiry.create({
      data: {
        franchiseId: item.franchiseId || null,
        customerName: item.customerName,
        mobileNumber: item.mobileNumber || item.phone,
        email: item.email,
        interestedFranchise: item.interestedFranchise || item.listingTitle || 'General',
        investmentBudget: item.investmentBudget || 'Not Specified',
        preferredLocation: item.preferredLocation || 'Not Specified',
        assignedBrokerId: item.assignedBrokerId || null,
        assignedBrokerName: item.assignedBrokerName || null,
        status: 'New'
      }
    });

    res.status(201).json(enquiry);
  } catch (err) {
    console.error('Error creating franchise enquiry:', err);
    res.status(500).json({ error: 'Failed to create franchise enquiry' });
  }
};

export const updateEnquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, type } = req.body; // status, type = 'Property' or 'Franchise'

    if (type === 'Franchise') {
      const updated = await prisma.franchiseEnquiry.update({
        where: { id },
        data: { status }
      });
      return res.json(updated);
    } else {
      const dbStatus = status === 'New' ? 'NEW' : (status === 'Contacted' ? 'CONTACTED' : (status === 'Follow-up' ? 'FOLLOW_UP' : 'CLOSED'));
      const updated = await prisma.enquiry.update({
        where: { id },
        data: { status: dbStatus }
      });
      return res.json(updated);
    }
  } catch (err) {
    console.error('Error updating enquiry:', err);
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
};

export const deleteEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    if (type === 'Franchise') {
      await prisma.franchiseEnquiry.delete({ where: { id } });
    } else {
      await prisma.enquiry.delete({ where: { id } });
    }

    res.json({ message: 'Enquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
};
