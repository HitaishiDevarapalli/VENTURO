import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaGoogle, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle, FaUsers, FaUser, FaPhoneAlt, FaMobileAlt, FaArrowLeft } from 'react-icons/fa';

// Define structures for registered users
interface RegisteredUser {
  fullName: string;
  mobile: string;
  email: string;
  passwordHash: string; // Plain stored securely for demo purposes
}

export const LoginPage: React.FC = () => {
  const { loginWithGmail } = useAuth();
  
  // Navigation flow
  const [flow, setFlow] = useState<'login' | 'register' | 'otp_verification' | 'forgot_password' | 'reset_password'>('login');
  
  // Simulated loading & error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // New Phone OTP login states
  const [loginMobile, setLoginMobile] = useState('');
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [loginOtpInput, setLoginOtpInput] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');

  // Register inputs
  const [registerName, setRegisterName] = useState('');
  const [registerMobile, setRegisterMobile] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // OTP Verification states
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpTargetMobile, setOtpTargetMobile] = useState('');
  const [otpTargetEmail, setOtpTargetEmail] = useState('');
  const [otpPurpose, setOtpPurpose] = useState<'register' | 'forgot'>('register');
  const [resendTimer, setResendTimer] = useState(0);

  // Simulated live SMS banner
  const [simulatedSms, setSimulatedSms] = useState<{ mobile: string; otp: string } | null>(null);

  // Forgot password inputs
  const [forgotInput, setForgotInput] = useState(''); // Email or mobile
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Load remembered credentials on mount
  useEffect(() => {
    try {
      const remembered = localStorage.getItem('nexoop_remembered_credentials');
      if (remembered) {
        setEmail(remembered);
        setRememberMe(true);
      }
    } catch (e) {}
  }, []);

  // Timer for OTP resend
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // Read users helper
  const getRegisteredUsers = (): RegisteredUser[] => {
    try {
      const data = localStorage.getItem('nexoop_registered_users');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  };

  // Save users helper
  const saveRegisteredUsers = (users: RegisteredUser[]) => {
    try {
      localStorage.setItem('nexoop_registered_users', JSON.stringify(users));
    } catch (e) {}
  };

  // Generate and send simulated OTP
  const triggerOtpSend = (mobileNumber: string, emailAddress: string, purpose: 'register' | 'forgot') => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpTargetMobile(mobileNumber);
    setOtpTargetEmail(emailAddress);
    setOtpPurpose(purpose);
    setResendTimer(30);
    
    // Show simulated live notification banner
    setSimulatedSms({ mobile: mobileNumber, otp: code });
    setTimeout(() => {
      setSimulatedSms(null);
    }, 15000);
  };

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const users = getRegisteredUsers();
      
      // Check admin fallback credentials
      if (email.trim().toLowerCase() === 'admin@nexoop.in' && password === 'admin123') {
        if (rememberMe) {
          localStorage.setItem('nexoop_remembered_credentials', email);
        } else {
          localStorage.removeItem('nexoop_remembered_credentials');
        }
        loginWithGmail(email, 'Verified Investor');
        return;
      }

      const match = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.passwordHash === password);
      if (!match) {
        setError('Invalid email address or password. Try admin@nexoop.in / admin123');
        return;
      }

      if (rememberMe) {
        localStorage.setItem('venturo_remembered_credentials', email);
      } else {
        localStorage.removeItem('venturo_remembered_credentials');
      }

      // Automatically login
      loginWithGmail(match.email, 'Verified Investor');
    }, 1000);
  };

  // Register validation and submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!registerName.trim()) {
      setError('Full Name is required');
      return;
    }
    if (!registerMobile.trim() || registerMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!registerEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (registerPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check duplicate
    const users = getRegisteredUsers();
    const duplicateEmail = users.some(u => u.email.toLowerCase() === registerEmail.trim().toLowerCase());
    const duplicateMobile = users.some(u => u.mobile === registerMobile.trim());

    if (duplicateEmail) {
      setError('Email address is already registered');
      return;
    }
    if (duplicateMobile) {
      setError('Mobile number is already registered');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Trigger OTP send
      triggerOtpSend(registerMobile.trim(), registerEmail.trim(), 'register');
      setFlow('otp_verification');
    }, 1000);
  };

  // Verify OTP handler
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otpInput.trim() !== generatedOtp) {
      setError('Incorrect verification code. Please try again.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const users = getRegisteredUsers();

      if (otpPurpose === 'register') {
        const newUser: RegisteredUser = {
          fullName: registerName.trim(),
          mobile: registerMobile.trim(),
          email: registerEmail.trim(),
          passwordHash: registerPassword
        };
        users.push(newUser);
        saveRegisteredUsers(users);
        setSuccess('Registration completed successfully! Please login.');
        setFlow('login');
      } else {
        // Switch to reset password flow
        setFlow('reset_password');
      }
    }, 1000);
  };

  // Forgot password handler
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!forgotInput.trim()) {
      setError('Please enter your email or mobile number');
      return;
    }

    const users = getRegisteredUsers();
    const match = users.find(u => u.email.toLowerCase() === forgotInput.trim().toLowerCase() || u.mobile === forgotInput.trim());

    // Admin recovery fallback
    if (forgotInput.trim().toLowerCase() === 'admin@nexoop.in') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        triggerOtpSend('9999999999', 'admin@nexoop.in', 'forgot');
        setFlow('otp_verification');
      }, 1000);
      return;
    }

    if (!match) {
      setError('No registered account matches that email or mobile number');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      triggerOtpSend(match.mobile, match.email, 'forgot');
      setFlow('otp_verification');
    }, 1000);
  };

  // Reset password handler
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (resetNewPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const users = getRegisteredUsers();
      
      // Update target user
      if (otpTargetEmail.toLowerCase() === 'admin@venturo.in') {
        setSuccess('Password updated successfully! Please login.');
        setFlow('login');
        return;
      }

      const updated = users.map(u => {
        if (u.email.toLowerCase() === otpTargetEmail.toLowerCase()) {
          return { ...u, passwordHash: resetNewPassword };
        }
        return u;
      });
      saveRegisteredUsers(updated);
      setSuccess('Password reset successfully! Please login with your new password.');
      setFlow('login');
    }, 1000);
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
        position: 'relative'
      }}
    >
      {/* Simulated Live SMS Alert Overlay */}
      {simulatedSms && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 10000,
          border: '1px solid #334155',
          maxWidth: '360px',
          animation: 'slideIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 800 }}>💬 LIVE SMS SIMULATOR</span>
            <button onClick={() => setSimulatedSms(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1rem' }}>×</button>
          </div>
          <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
            Verification code for <strong>+91 {simulatedSms.mobile}</strong> is <strong style={{ fontSize: '1.05rem', color: '#FBBF24', letterSpacing: '1px' }}>{simulatedSms.otp}</strong>.
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '6px' }}>Copy and paste this code to proceed.</div>
        </div>
      )}

      {/* Centered Login / Registration / Verification Card */}
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
          position: 'relative'
        }}
      >
        {/* Loading overlay */}
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #F3F3F3',
              borderTop: '4px solid #10B981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        )}

        {/* ---------------- FLOW: LOGIN ---------------- */}
        {flow === 'login' && (
          <>
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
                Sign in using your mobile number and verification code
              </p>
            </div>

             {/* Form Fields */}
             <form
               onSubmit={(e) => {
                 e.preventDefault();
                 setError('');
                 setSuccess('');
                 if (!loginOtpSent) {
                   if (!loginName.trim()) {
                     setError('Full Name is required');
                     return;
                   }
                   if (!loginMobile.trim() || loginMobile.length < 10) {
                     setError('Please enter a valid 10-digit mobile number');
                     return;
                   }
                   if (!loginEmail.trim() || !loginEmail.includes('@')) {
                     setError('Please enter a valid email address');
                     return;
                   }
                   setLoading(true);
                   setTimeout(() => {
                     setLoading(false);
                     setLoginOtpSent(true);
                     const code = Math.floor(100000 + Math.random() * 900000).toString();
                     setGeneratedOtp(code);
                     setResendTimer(60);
                     setSimulatedSms({ mobile: loginMobile, otp: code });
                     setTimeout(() => setSimulatedSms(null), 15000);
                     setSuccess(`Verification code sent to ${countryCode} ${loginMobile}`);
                   }, 800);
                 } else {
                   if (loginOtpInput.trim() !== generatedOtp) {
                     setError('Incorrect OTP code. Please try again.');
                     return;
                   }
                   setLoading(true);
                   setTimeout(() => {
                     setLoading(false);
                     loginWithGmail(loginEmail, 'Verified Investor', loginName, `${countryCode} ${loginMobile}`);
                   }, 800);
                 }
               }}
               style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
             >
               {!loginOtpSent ? (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   <div>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                       Full Name
                     </label>
                     <div style={{ position: 'relative' }}>
                       <input
                         type="text"
                         required
                         placeholder="Enter your name"
                         value={loginName}
                         onChange={(e) => {
                           setLoginName(e.target.value);
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
                       <FaUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '13px' }} />
                     </div>
                   </div>

                   <div>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                       Email Address
                     </label>
                     <div style={{ position: 'relative' }}>
                       <input
                         type="email"
                         required
                         placeholder="name@example.com"
                         value={loginEmail}
                         onChange={(e) => {
                           setLoginEmail(e.target.value);
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
                       <FaEnvelope style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '13px' }} />
                     </div>
                   </div>

                   <div>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                       Mobile Number
                     </label>
                     <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
                       <select
                         value={countryCode}
                         onChange={(e) => setCountryCode(e.target.value)}
                         style={{
                           padding: '12px',
                           borderRadius: '12px',
                           border: '1.5px solid #E2E8F0',
                           backgroundColor: '#F8FAFC',
                           fontSize: '0.92rem',
                           fontWeight: 600,
                           outline: 'none',
                           cursor: 'pointer'
                         }}
                       >
                         <option value="+91">+91 (IN)</option>
                         <option value="+1">+1 (US)</option>
                         <option value="+44">+44 (UK)</option>
                         <option value="+971">+971 (UAE)</option>
                       </select>
                       <div style={{ position: 'relative', flex: 1 }}>
                         <input
                           type="tel"
                           required
                           maxLength={10}
                           placeholder="Enter your mobile number"
                           value={loginMobile}
                           onChange={(e) => {
                             setLoginMobile(e.target.value.replace(/\D/g, ''));
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
                         <FaPhoneAlt style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '13px' }} />
                       </div>
                     </div>
                   </div>
                 </div>
               ) : (
                 <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                     Enter 6-Digit OTP
                   </label>
                   <div style={{ position: 'relative' }}>
                     <input
                       type="text"
                       required
                       maxLength={6}
                       placeholder="XXXXXX"
                       value={loginOtpInput}
                       onChange={(e) => {
                         setLoginOtpInput(e.target.value.replace(/\D/g, ''));
                         setError('');
                       }}
                       style={{
                         width: '100%',
                         padding: '12px 12px 12px 42px',
                         borderRadius: '12px',
                         border: '1.5px solid #E2E8F0',
                         fontSize: '1.1rem',
                         fontWeight: 700,
                         letterSpacing: '6px',
                         textAlign: 'left',
                         outline: 'none',
                         color: '#0F172A',
                         boxSizing: 'border-box',
                         transition: 'border-color 0.2s',
                       }}
                       onFocus={(e) => (e.currentTarget.style.borderColor = '#10B981')}
                       onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                     />
                     <FaLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '14px' }} />
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.82rem' }}>
                     <span style={{ color: '#64748B' }}>
                       OTP sent to {countryCode} {loginMobile}
                     </span>
                     {resendTimer > 0 ? (
                       <span style={{ color: '#94A3B8', fontWeight: 600 }}>Resend in {resendTimer}s</span>
                     ) : (
                       <button
                         type="button"
                         onClick={() => {
                           const code = Math.floor(100000 + Math.random() * 900000).toString();
                           setGeneratedOtp(code);
                           setResendTimer(60);
                           setSimulatedSms({ mobile: loginMobile, otp: code });
                           setTimeout(() => setSimulatedSms(null), 15000);
                           setSuccess('New verification code sent');
                         }}
                         style={{ background: 'none', border: 'none', color: '#10B981', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                       >
                         Resend OTP
                       </button>
                     )}
                   </div>
                 </div>
               )}

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
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccess('');
                    setFlow('forgot_password');
                  }}
                  style={{ background: 'none', border: 'none', color: '#2563EB', textDecoration: 'none', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Forgot Password?
                </button>
              </div>

              {error && <div style={{ color: '#EF4444', fontSize: '0.82rem', fontWeight: 600 }}>{error}</div>}
              {success && <div style={{ color: '#10B981', fontSize: '0.82rem', fontWeight: 600 }}>{success}</div>}

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
                <span>{!loginOtpSent ? 'Send OTP' : 'Verify OTP'}</span>
                <FaArrowRight fontSize="13px" />
              </button>
            </form>

            {/* Footer Link */}
            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setFlow('register');
                }}
                style={{ background: 'none', border: 'none', color: '#10B981', textDecoration: 'none', fontWeight: 800, cursor: 'pointer', padding: 0 }}
              >
                Create Account
              </button>
            </div>
          </>
        )}

        {/* ---------------- FLOW: REGISTER ---------------- */}
        {flow === 'register' && (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                Create Account
              </h1>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B' }}>
                Join the enterprise assets portal
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '0.9rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                  />
                  <FaUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '13px' }} />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Mobile Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={registerMobile}
                    onChange={(e) => setRegisterMobile(e.target.value.replace(/\D/g, ''))}
                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '0.9rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                  />
                  <FaPhoneAlt style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '13px' }} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '0.9rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                  />
                  <FaEnvelope style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '13px' }} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="Create password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px 42px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '0.9rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                  />
                  <FaLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '13px' }} />
                  <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                    {showRegPassword ? <FaEyeSlash fontSize="14px" /> : <FaEye fontSize="14px" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Retype password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px 42px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '0.9rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                  />
                  <FaLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '13px' }} />
                  <button type="button" onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                    {showRegConfirmPassword ? <FaEyeSlash fontSize="14px" /> : <FaEye fontSize="14px" />}
                  </button>
                </div>
              </div>

              {error && <div style={{ color: '#EF4444', fontSize: '0.82rem', fontWeight: 600 }}>{error}</div>}

              {/* Submit Register */}
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
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                }}
              >
                Create Account
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setFlow('login');
                }}
                style={{ background: 'none', border: 'none', color: '#10B981', textDecoration: 'none', fontWeight: 800, cursor: 'pointer', padding: 0 }}
              >
                Sign In
              </button>
            </div>
          </>
        )}

        {/* ---------------- FLOW: OTP VERIFICATION ---------------- */}
        {flow === 'otp_verification' && (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#3B82F6', marginBottom: '16px' }}>
                <FaMobileAlt />
              </div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                Verify Phone Number
              </h1>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                We sent a 6-digit OTP code to <br /><strong>+91 {otpTargetMobile}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px', textAlign: 'center' }}>
                  ENTER 6-DIGIT OTP CODE
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="0 0 0 0 0 0"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    textAlign: 'center',
                    letterSpacing: '8px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {error && <div style={{ color: '#EF4444', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' }}>{error}</div>}

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
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                }}
              >
                Verify & Proceed
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setFlow(otpPurpose === 'register' ? 'register' : 'forgot_password');
                }}
                style={{ background: 'none', border: 'none', color: '#64748B', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
              >
                <FaArrowLeft fontSize="11px" /> Back
              </button>

              <button
                type="button"
                disabled={resendTimer > 0}
                onClick={() => triggerOtpSend(otpTargetMobile, otpTargetEmail, otpPurpose)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: resendTimer > 0 ? '#94A3B8' : '#2563EB',
                  fontWeight: 800,
                  cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                  padding: 0
                }}
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </>
        )}

        {/* ---------------- FLOW: FORGOT PASSWORD ---------------- */}
        {flow === 'forgot_password' && (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                Recover Password
              </h1>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                Enter your registered Email or Mobile Number to receive a verification OTP
              </p>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Email or Mobile Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="name@domain.com or 9876543210"
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '0.9rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                  />
                  <FaEnvelope style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '13px' }} />
                </div>
              </div>

              {error && <div style={{ color: '#EF4444', fontSize: '0.82rem', fontWeight: 600 }}>{error}</div>}

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
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                }}
              >
                Send Verification OTP
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setSuccess('');
                  setFlow('login');
                }}
                style={{ background: 'none', border: 'none', color: '#10B981', textDecoration: 'none', fontWeight: 800, cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
              >
                Back to Sign In
              </button>
            </div>
          </>
        )}

        {/* ---------------- FLOW: RESET PASSWORD ---------------- */}
        {flow === 'reset_password' && (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                Reset Password
              </h1>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B' }}>
                Set a secure password for your account
              </p>
            </div>

            <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* New Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new password"
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px 42px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '0.9rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                  />
                  <FaLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '13px' }} />
                  <button type="button" onClick={() => setShowResetPassword(!showResetPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                    {showResetPassword ? <FaEyeSlash fontSize="14px" /> : <FaEye fontSize="14px" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Confirm New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    placeholder="Retype new password"
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px 42px 12px 42px', borderRadius: '12px', border: '1.5px solid #E2E8F0', fontSize: '0.9rem', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
                  />
                  <FaLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '13px' }} />
                </div>
              </div>

              {error && <div style={{ color: '#EF4444', fontSize: '0.82rem', fontWeight: 600 }}>{error}</div>}

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
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                }}
              >
                Save & Update Password
              </button>
            </form>
          </>
        )}
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
      
      {/* Dynamic Keyframe Animation inject */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
