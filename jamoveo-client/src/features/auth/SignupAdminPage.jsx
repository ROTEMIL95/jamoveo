import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import signupImage from '../../assets/images/signup.png';
import logo from '../../assets/icon/Iconlogo.png';

const API_URL = import.meta.env.VITE_API_URL;

function SignupAdminPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    instrument: '',
  });
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_URL}/auth/signup-admin`, form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left half - form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white px-4 sm:px-8 md:px-16 lg:px-20 py-8 md:py-16 lg:py-24 order-2 md:order-1">
        <div className="p-4 sm:p-6 md:p-8 rounded-full w-full max-w-lg">
          {/* Logo for mobile view */}
          <div className="md:hidden flex items-center gap-2 mb-14">
            <img src={logo} alt="JaMoveo Logo" className="w-10 h-10" />
            <h1 className="text-3xl font-bold text-black">JAMOVEO</h1>
          </div>
          
          <div className="font-bold mb-2"
            style={{
              color: 'rgba(110, 109, 109, 1)',
              fontFamily: 'Exo, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(20px, 4vw, 24px)',
              lineHeight: '1.4',
              letterSpacing: 0,
            }}
          >
            Welcome to JaMoveo
          </div>
          <h2 className="font-bold mb-4 md:mb-6"
            style={{
              color: 'rgba(147, 113, 0, 1)',
              fontFamily: 'Exo, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(36px, 6vw, 56px)',
              lineHeight: '1.2',
              letterSpacing: 0,
            }}
          >Admin Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
            <div>
              <label className="block mb-1" style={{
                fontFamily: 'Exo, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(14px, 3vw, 18px)',
                lineHeight: '1.5',
                letterSpacing: 0,
                color: 'rgba(0, 0, 0, 1)',
              }}>Username*</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="border border-gray-300 w-full"
                placeholder="Enter your username"
                required
                style={{
                  background: 'rgba(126, 106, 37, 0.08)',
                  height: '54px',
                  borderRadius: '12px',
                  borderWidth: '1px',
                  paddingTop: '17px',
                  paddingRight: '24px',
                  paddingBottom: '17px',
                  paddingLeft: '24px',
                  marginBottom: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                }}
              />
            </div>
            <div>
              <label className="block mb-1" style={{
                fontFamily: 'Exo, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(14px, 3vw, 18px)',
                lineHeight: '1.5',
                letterSpacing: 0,
                color: 'rgba(0, 0, 0, 1)',
              }}>Your Instrument*</label>
              <input
                type="text"
                name="instrument"
                value={form.instrument}
                onChange={handleChange}
                className="border border-gray-300 w-full"
                placeholder="Select your instrument"
                required
                style={{
                  background: 'rgba(126, 106, 37, 0.08)',
                  height: '54px',
                  borderRadius: '12px',
                  borderWidth: '1px',
                  paddingTop: '17px',
                  paddingRight: '24px',
                  paddingBottom: '17px',
                  paddingLeft: '24px',
                  marginBottom: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                }}
              />
            </div>
            <div>
              <label className="block mb-1" style={{
                fontFamily: 'Exo, sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(14px, 3vw, 18px)',
                lineHeight: '1.5',
                letterSpacing: 0,
                color: 'rgba(0, 0, 0, 1)',
              }}>Create password*</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="border border-gray-300 w-full"
                  required
                  placeholder="Your password"
                  style={{
                    background: 'rgba(126, 106, 37, 0.08)',
                    height: '54px',
                    borderRadius: '12px',
                    borderWidth: '1px',
                    paddingTop: '17px',
                    paddingRight: '24px',
                    paddingBottom: '17px',
                    paddingLeft: '24px',
                    marginBottom: '8px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: 30,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: 'rgba(147, 113, 0, 1)',
                  }}
                  tabIndex={-1}
                >
                  {isPasswordVisible ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full"
              style={{
                background: 'rgba(255, 205, 41, 1)',
                color: 'rgba(5, 4, 0, 1)',
                height: '54px',
                borderRadius: '12px',
                borderWidth: '1px',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: 0,
              }}
            >
              Register as Admin
            </button>
            <div className="text-center text-sm mt-4"
              style={{
                color: 'rgba(117, 117, 117, 1)',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: 0,
              }}
            >
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline"
                style={{
                  color: 'rgba(147, 113, 0, 1)',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: 0,
                }}
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Right half - image (desktop only) */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100 overflow-hidden relative order-2">
        <img
          src={signupImage}
          alt="Signup"
          style={{
            borderTopLeftRadius: '12px',
            borderBottomLeftRadius: '12px',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            maxWidth: '100vw',
            maxHeight: '100vh',
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255, 205, 41, 0.2)',
            borderTopLeftRadius: '12px',
            borderBottomLeftRadius: '12px',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
}

export default SignupAdminPage;
