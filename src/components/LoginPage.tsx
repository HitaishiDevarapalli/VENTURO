import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle, FaUsers } from 'react-icons/fa';

export const LoginPage: React.FC = () => {
  const { loginWithGmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    // Use the AuthContext login function to unlock the app
    loginWithGmail(email, 'Verified Investor');
  };

  const handleGoogleLogin = () => {
    loginWithGmail('investor.guntur@gmail.com', 'Verified Investor');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        fontFamily: "'Roboto', 'Inter', sans-serif",
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Centered Login Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '460px',
          padding: '40px 32px',
          boxSizing: 'border-box',
          marginBottom: '24px',
        }}
      >
        {/* Welcome Text */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 8px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            Welcome Back <span style={{ fontSize: '1.8rem' }}>👋</span>
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B' }}>
            Sign in to access your account
          </p>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            color: '#334155',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.borderColor = '#CBD5E1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#E2E8F0';
          }}
        >
          <FaGoogle style={{ color: '#EA4335', fontSize: '16px' }} />
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '24px 0',
            color: '#94A3B8',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '1px',
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          <span style={{ padding: '0 16px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email Address */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 42px',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  outline: 'none',
                  color: '#0F172A',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#10B981')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
              />
              <FaEnvelope style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '14px' }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  borderRadius: '12px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.92rem',
                  fontWeight: 500,
                  outline: 'none',
                  color: '#0F172A',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#10B981')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
              />
              <FaLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '14px' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <FaEyeSlash fontSize="16px" /> : <FaEye fontSize="16px" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#10B981', cursor: 'pointer' }}
              />
              Remember me
            </label>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 700 }}>
              Forgot Password?
            </a>
          </div>

          {error && <div style={{ color: '#EF4444', fontSize: '0.8rem', fontWeight: 600 }}>{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #10B981, #0E9F6E, #0D9488)',
              color: '#FFFFFF',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            }}
          >
            <span>Sign In</span>
            <FaArrowRight fontSize="13px" />
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
          Don't have an account?{' '}
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#10B981', textDecoration: 'none', fontWeight: 800 }}>
            Create Account
          </a>
        </div>
      </div>

      {/* Verification Trust badges */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F766E', fontSize: '0.82rem', fontWeight: 700 }}>
          <FaCheckCircle fontSize="13px" /> Secure
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F766E', fontSize: '0.82rem', fontWeight: 700 }}>
          <FaCheckCircle fontSize="13px" /> Verified
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F766E', fontSize: '0.82rem', fontWeight: 700 }}>
          <FaUsers fontSize="14px" /> Trusted by Professionals
        </div>
      </div>

      {/* Copyright footer */}
      <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 500 }}>
        © 2024 TheNexOop. All rights reserved.
      </div>
    </div>
  );
};

export default LoginPage;
