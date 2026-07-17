import { Request, Response } from 'express';
import { prisma } from '../index.js';

const getOrCreateCategory = async (name: string) => {
  const normalized = name.trim();
  let cat = await prisma.category.findUnique({
    where: { name: normalized }
  });
  if (!cat) {
    const slug = normalized.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    cat = await prisma.category.create({
      data: { name: normalized, slug }
    });
  }
  return cat.id;
};

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { category, city, minPrice, maxPrice, bedrooms, premium, trending, status } = req.query;

    const where: any = {};

    if (category) {
      const categoryId = await getOrCreateCategory(category as string);
      where.categoryId = categoryId;
    }

    if (city && city !== 'All India' && city !== 'All Cities') {
      where.location = {
        city: {
          contains: city as string,
          mode: 'insensitive'
        }
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms as string);
    }

    if (premium) {
      where.premium = premium === 'true';
    }

    if (trending) {
      where.trending = trending === 'true';
    }

    if (status) {
      where.listingType = status === 'Rent' ? 'RENT' : 'SALE';
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        location: true,
        images: true,
        category: true,
        broker: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map to frontend structure
    const mapped = properties.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.images.find(img => img.isCover)?.url || p.images[0]?.url || '',
      images: p.images.map(img => img.url),
      city: p.location.city,
      state: p.location.state,
      district: p.location.district || '',
      area: p.location.area,
      latitude: p.location.latitude,
      longitude: p.location.longitude,
      price: p.price,
      priceDisplay: `₹${(p.price / 10000000).toFixed(2)} Cr`,
      category: p.category.name,
      status: p.listingType === 'RENT' ? 'Rent' : 'Buy',
      areaSqFt: p.builtUpAreaSqFt ? `${p.builtUpAreaSqFt} sqft` : '',
      bedrooms: p.bedrooms || undefined,
      bathrooms: p.bathrooms || undefined,
      verified: p.verified,
      premium: p.premium,
      trending: p.trending,
      createdDate: p.createdAt.toLocaleDateString(),
      listingStatus: p.status,
      assignedBrokerIds: p.broker ? [p.broker.id] : [],
      dealerId: p.brokerId || undefined,
      parkingSlots: p.parkingSlots || undefined,
      furnishing: p.furnishing || undefined,
      ageYears: p.ageYears || undefined,
      facing: p.facing || undefined,
      floors: p.floors || undefined,
      balconies: p.balconies || undefined
    }));

    res.json(mapped);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const p = await prisma.property.findUnique({
      where: { id },
      include: {
        location: true,
        images: true,
        category: true,
        broker: true
      }
    });

    if (!p) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const mapped = {
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.images.find(img => img.isCover)?.url || p.images[0]?.url || '',
      images: p.images.map(img => img.url),
      city: p.location.city,
      state: p.location.state,
      district: p.location.district || '',
      area: p.location.area,
      latitude: p.location.latitude,
      longitude: p.location.longitude,
      price: p.price,
      priceDisplay: `₹${(p.price / 10000000).toFixed(2)} Cr`,
      category: p.category.name,
      status: p.listingType === 'RENT' ? 'Rent' : 'Buy',
      areaSqFt: p.builtUpAreaSqFt ? `${p.builtUpAreaSqFt} sqft` : '',
      bedrooms: p.bedrooms || undefined,
      bathrooms: p.bathrooms || undefined,
      verified: p.verified,
      premium: p.premium,
      trending: p.trending,
      createdDate: p.createdAt.toLocaleDateString(),
      listingStatus: p.status,
      assignedBrokerIds: p.broker ? [p.broker.id] : [],
      dealerId: p.brokerId || undefined,
      parkingSlots: p.parkingSlots || undefined,
      furnishing: p.furnishing || undefined,
      ageYears: p.ageYears || undefined,
      facing: p.facing || undefined,
      floors: p.floors || undefined,
      balconies: p.balconies || undefined
    };

    res.json(mapped);
  } catch (err) {
    console.error('Error fetching property:', err);
    res.status(500).json({ error: 'Failed to fetch property details' });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  try {
    const item = req.body;

    const categoryId = await getOrCreateCategory(item.category || 'Apartment');

    // Create Location first
    const location = await prisma.location.create({
      data: {
        latitude: parseFloat(item.latitude) || 17.43,
        longitude: parseFloat(item.longitude) || 78.40,
        city: item.city || 'Hyderabad',
        state: item.state || 'Telangana',
        district: item.district || '',
        area: item.area || 'Jubilee Hills'
      }
    });

    // Create Property
    const property = await prisma.property.create({
      data: {
        title: item.title,
        slug: (item.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4),
        propertyCode: 'PROP-' + Math.floor(1000 + Math.random() * 9000).toString(),
        description: item.description || '',
        status: item.listingStatus || 'PUBLISHED',
        listingType: item.status === 'Rent' ? 'RENT' : 'SALE',
        categoryId,
        brokerId: item.dealerId || null,
        locationId: location.id,
        price: parseFloat(item.price) || 0,
        bedrooms: item.bedrooms || null,
        bathrooms: item.bathrooms || null,
        builtUpAreaSqFt: parseFloat(item.areaSqFt) || null,
        verified: item.verified ?? true,
        premium: item.premium ?? false,
        trending: item.trending ?? false,
        parkingSlots: item.parkingSlots || null,
        furnishing: item.furnishing || null,
        ageYears: item.ageYears || null,
        facing: item.facing || null,
        floors: item.floors || null,
        balconies: item.balconies || null
      }
    });

    // Handle images
    if (item.images && Array.isArray(item.images)) {
      const imageRecords = item.images.map((url: string, index: number) => ({
        url,
        propertyId: property.id,
        isCover: index === 0,
        order: index
      }));
      await prisma.propertyImage.createMany({
        data: imageRecords
      });
    } else if (item.image) {
      await prisma.propertyImage.create({
        data: {
          url: item.image,
          propertyId: property.id,
          isCover: true,
          order: 0
        }
      });
    }

    const created = await prisma.property.findUnique({
      where: { id: property.id },
      include: { location: true, images: true, category: true, broker: true }
    });

    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({ error: 'Failed to create property' });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = req.body;

    const property = await prisma.property.findUnique({
      where: { id },
      include: { location: true }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Update location
    await prisma.location.update({
      where: { id: property.locationId },
      data: {
        latitude: parseFloat(item.latitude) || undefined,
        longitude: parseFloat(item.longitude) || undefined,
        city: item.city || undefined,
        state: item.state || undefined,
        district: item.district || undefined,
        area: item.area || undefined
      }
    });

    // Resolve category if updated
    let categoryId = undefined;
    if (item.category) {
      categoryId = await getOrCreateCategory(item.category);
    }

    // Update property details
    await prisma.property.update({
      where: { id },
      data: {
        title: item.title || undefined,
        description: item.description || undefined,
        status: item.listingStatus || undefined,
        listingType: item.status === 'Rent' ? 'RENT' : (item.status === 'Buy' ? 'SALE' : undefined),
        categoryId: categoryId || undefined,
        brokerId: item.dealerId !== undefined ? item.dealerId : undefined,
        price: item.price !== undefined ? parseFloat(item.price) : undefined,
        bedrooms: item.bedrooms !== undefined ? item.bedrooms : undefined,
        bathrooms: item.bathrooms !== undefined ? item.bathrooms : undefined,
        builtUpAreaSqFt: item.areaSqFt !== undefined ? parseFloat(item.areaSqFt) : undefined,
        verified: item.verified !== undefined ? item.verified : undefined,
        premium: item.premium !== undefined ? item.premium : undefined,
        trending: item.trending !== undefined ? item.trending : undefined,
        parkingSlots: item.parkingSlots !== undefined ? item.parkingSlots : undefined,
        furnishing: item.furnishing || undefined,
        ageYears: item.ageYears !== undefined ? item.ageYears : undefined,
        facing: item.facing || undefined,
        floors: item.floors !== undefined ? item.floors : undefined,
        balconies: item.balconies !== undefined ? item.balconies : undefined
      }
    });

    // Update images if provided
    if (item.images && Array.isArray(item.images)) {
      // Delete old images
      await prisma.propertyImage.deleteMany({
        where: { propertyId: id }
      });
      // Add new images
      const imageRecords = item.images.map((url: string, index: number) => ({
        url,
        propertyId: id,
        isCover: index === 0,
        order: index
      }));
      await prisma.propertyImage.createMany({
        data: imageRecords
      });
    }

    const updated = await prisma.property.findUnique({
      where: { id },
      include: { location: true, images: true, category: true, broker: true }
    });

    res.json(updated);
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(500).json({ error: 'Failed to update property' });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = await prisma.property.findUnique({
      where: { id }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Deleting property will cascade delete images and location (since location onDelete is Cascade)
    await prisma.property.delete({
      where: { id }
    });

    // Delete location too
    await prisma.location.delete({
      where: { id: property.locationId }
    });

    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};

export const bulkPublish = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    await prisma.property.updateMany({
      where: { id: { in: ids } },
      data: { status: 'PUBLISHED' }
    });
    res.json({ message: 'Properties published successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Bulk publish failed' });
  }
};

export const bulkHide = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    await prisma.property.updateMany({
      where: { id: { in: ids } },
      data: { status: 'HIDDEN' }
    });
    res.json({ message: 'Properties hidden successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Bulk hide failed' });
  }
};

export const bulkDelete = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    // Find locations
    const props = await prisma.property.findMany({
      where: { id: { in: ids } },
      select: { locationId: true }
    });
    const locationIds = props.map(p => p.locationId);

    await prisma.property.deleteMany({
      where: { id: { in: ids } }
    });

    await prisma.location.deleteMany({
      where: { id: { in: locationIds } }
    });

    res.json({ message: 'Properties deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Bulk delete failed' });
  }
};
