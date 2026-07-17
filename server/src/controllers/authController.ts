import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretventurokey123';

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, mobile, email, password } = req.body;

    if (!fullName || !mobile || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check duplicate
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email address is already registered' });
    }

    // Split name
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Get default admin or admin-level role (since schema RoleType is SUPER_ADMIN or ADMIN)
    let role = await prisma.role.findFirst({
      where: { name: 'ADMIN' }
    });

    if (!role) {
      role = await prisma.role.create({
        data: { name: 'ADMIN', description: 'Standard Admin User' }
      });
    }

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        firstName,
        lastName,
        phone: mobile,
        roleId: role.id,
        isActive: true
      },
      include: { role: true }
    });

    // Create JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        name: `${newUser.firstName} ${newUser.lastName}`.trim(),
        email: newUser.email,
        phone: newUser.phone,
        role: 'Verified Investor', // Standard decorative role for frontend UI
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.firstName)}&background=0D9488&color=fff&size=128&bold=true`
      }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { role: true }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email address or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email address or password' });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        phone: user.phone,
        role: 'Verified Investor', // Standard decorative role for frontend UI
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName)}&background=0D9488&color=fff&size=128&bold=true`
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { input } = req.body; // Can be email or mobile number

    if (!input) {
      return res.status(400).json({ error: 'Please enter your email or mobile number' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: input.toLowerCase().trim() },
          { phone: input.trim() }
        ]
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'No user account found with that email or mobile number' });
    }

    // Generate random 6 digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // In a real application, you would send this code via SMS or Email.
    // For our system, we return the OTP code in the response so the frontend simulation can read it.
    res.json({
      message: 'OTP verification code sent',
      otpCode,
      targetMobile: user.phone || '9999999999',
      targetEmail: user.email
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
