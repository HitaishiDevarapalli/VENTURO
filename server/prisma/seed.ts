import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      description: 'Super administrator with full access'
    }
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Standard administrator'
    }
  });

  // 2. Create Default Admin User
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const defaultAdmin = await prisma.user.upsert({
    where: { email: 'admin@venturo.in' },
    update: {},
    create: {
      email: 'admin@venturo.in',
      passwordHash: adminPasswordHash,
      firstName: 'Venturo',
      lastName: 'Admin',
      phone: '9999999999',
      roleId: adminRole.id,
      isActive: true
    }
  });
  console.log('Default admin created:', defaultAdmin.email);

  // 3. Create Categories
  const aptCat = await prisma.category.upsert({
    where: { name: 'Apartment' },
    update: {},
    create: { name: 'Apartment', slug: 'apartment', description: 'Luxury Apartments' }
  });

  const villaCat = await prisma.category.upsert({
    where: { name: 'Villa' },
    update: {},
    create: { name: 'Villa', slug: 'villa', description: 'Exquisite Villas' }
  });

  const plotCat = await prisma.category.upsert({
    where: { name: 'Plot' },
    update: {},
    create: { name: 'Plot', slug: 'plot', description: 'Premium Land Plots' }
  });

  // 4. Create Brokers
  const broker1 = await prisma.broker.upsert({
    where: { email: 'satya.realty@venturo.in' },
    update: {},
    create: {
      name: 'Satya Narayana',
      companyName: 'Satya Premium Realty',
      designation: 'Principal Advisor',
      reraNumber: 'RERA-HYD-102948',
      experienceYrs: 12,
      languages: ['English', 'Telugu', 'Hindi'],
      commissionRate: 2.0,
      specialization: 'Luxury Residential & Villas',
      rating: 4.9,
      reviewCount: 48,
      address: 'Road No 36, Jubilee Hills, Hyderabad',
      phone: '9849012345',
      whatsapp: '9849012345',
      email: 'satya.realty@venturo.in',
      photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
      revenueGenerated: 42.5
    }
  });

  const broker2 = await prisma.broker.upsert({
    where: { email: 'karan.singh@venturo.in' },
    update: {},
    create: {
      name: 'Karan Singh',
      companyName: 'Apex Commercial Capital',
      designation: 'Managing Partner',
      reraNumber: 'RERA-MUM-998822',
      experienceYrs: 15,
      languages: ['English', 'Hindi', 'Marathi'],
      commissionRate: 1.5,
      specialization: 'Commercial Real Estate & Franchises',
      rating: 4.8,
      reviewCount: 32,
      address: 'Bandra West, Mumbai',
      phone: '9820098765',
      whatsapp: '9820098765',
      email: 'karan.singh@venturo.in',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      revenueGenerated: 85.0
    }
  });
  console.log('Brokers seeded.');

  // 5. Seed Properties
  const loc1 = await prisma.location.create({
    data: {
      latitude: 17.4300,
      longitude: 78.4000,
      city: 'Hyderabad',
      state: 'Telangana',
      area: 'Jubilee Hills',
      street: 'Road No 36'
    }
  });

  await prisma.property.create({
    data: {
      title: 'Ultra Luxury Sky Villa with Private Pool',
      slug: 'ultra-luxury-sky-villa-private-pool',
      propertyCode: 'PROP-9872',
      description: 'Exclusive double-height sky villa overlooking the Jubilee Hills valley. Includes a 15m private infinity lap pool, automated VRV climate control, Italian marble flooring, and 24/7 private concierge access.',
      status: 'PUBLISHED',
      listingType: 'SALE',
      categoryId: villaCat.id,
      brokerId: broker1.id,
      locationId: loc1.id,
      price: 245000000, // 24.5 Cr
      bedrooms: 5,
      bathrooms: 6,
      builtUpAreaSqFt: 8200,
      verified: true,
      premium: true,
      trending: true,
      parkingSlots: 4,
      furnishing: 'Fully Furnished',
      ageYears: 1,
      facing: 'East',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', isCover: true, order: 0 },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', isCover: false, order: 1 }
        ]
      }
    }
  });

  const loc2 = await prisma.location.create({
    data: {
      latitude: 12.9300,
      longitude: 77.6200,
      city: 'Bengaluru',
      state: 'Karnataka',
      area: 'Koramangala',
      street: '80 Feet Road'
    }
  });

  await prisma.property.create({
    data: {
      title: 'Premium Penthouse with City View',
      slug: 'premium-penthouse-city-view',
      propertyCode: 'PROP-5541',
      description: 'Spacious high-rise penthouse located in the heart of Koramangala. Features 360-degree views of Bengaluru skyline, private terrace garden, modular kitchen, and smart home automation.',
      status: 'PUBLISHED',
      listingType: 'SALE',
      categoryId: aptCat.id,
      brokerId: broker1.id,
      locationId: loc2.id,
      price: 125000000, // 12.5 Cr
      bedrooms: 4,
      bathrooms: 4,
      builtUpAreaSqFt: 4500,
      verified: true,
      premium: false,
      trending: true,
      parkingSlots: 3,
      furnishing: 'Semi-Furnished',
      ageYears: 2,
      facing: 'North-East',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', isCover: true, order: 0 }
        ]
      }
    }
  });
  console.log('Properties seeded.');

  // 6. Seed Franchises
  await prisma.franchise.create({
    data: {
      brand: 'Chai Kings',
      type: 'Food & Beverage',
      category: 'Cafe / Quick Service Restaurant',
      investment: 25.0, // 25 Lakhs
      investmentDisplay: '₹20 - 30 Lakhs',
      location: 'Hyderabad, Bengaluru, Chennai',
      state: 'Telangana',
      city: 'Hyderabad',
      latitude: 17.43,
      longitude: 78.40,
      rating: 4.7,
      reviewCount: 114,
      verified: true,
      trending: true,
      availableBranchCount: 18,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=150&q=80',
      trustScore: 92.5,
      dealerId: broker2.id
    }
  });

  await prisma.franchise.create({
    data: {
      brand: 'EuroKids Preschool',
      type: 'Education',
      category: 'Preschool & Play Group',
      investment: 18.0, // 18 Lakhs
      investmentDisplay: '₹15 - 20 Lakhs',
      location: 'Pan India expansion',
      state: 'Maharashtra',
      city: 'Mumbai',
      latitude: 19.05,
      longitude: 72.82,
      rating: 4.9,
      reviewCount: 95,
      verified: true,
      trending: false,
      availableBranchCount: 35,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
      logo: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=150&q=80',
      trustScore: 96.0,
      dealerId: broker2.id
    }
  });
  console.log('Franchises seeded.');

  // 7. Seed Businesses
  await prisma.business.create({
    data: {
      name: 'Cloud Kitchen Network in Gachibowli',
      title: 'High ROI Cloud Kitchen Network with 4 Brands',
      industry: 'Food Technology',
      location: 'Gachibowli, Hyderabad',
      state: 'Telangana',
      city: 'Hyderabad',
      latitude: 17.4400,
      longitude: 78.3400,
      price: 8500000, // 85 Lakhs
      priceDisplay: '₹85 Lakhs',
      revenueMonthly: '₹12 Lakhs',
      profitMonthly: '₹2.8 Lakhs',
      establishedYear: 2022,
      employeesCount: 14,
      rating: 4.6,
      reviewCount: 18,
      verified: true,
      trending: true,
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
      description: 'Fully equipped commercial cloud kitchen setup in Gachibowli. Operating 4 distinct virtual delivery brands (Biryani, North Indian, Chinese, Dessert) with high ratings on Swiggy and Zomato.',
      reasonForSale: 'Owners relocating to United States',
      trustScore: 89.0
    }
  });
  console.log('Businesses seeded.');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
