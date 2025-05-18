import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import signupImage from '../../assets/images/signup.png';
import logo from '../../assets/icon/iconlogo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// רשימת כלי הנגינה
const instruments = [
  'vocals',
  'drums',
  'guitars',
  'bass',
  'saxophone',
  'keyboards',
];

function SignupPage() {
  const [form, setForm] = useState({ username: '', password: '', instrument: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();
  const API_URL = import.meta.env.VITE_API_URL;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, form);
      // לא שומרים את המשתמש בקונטקסט, כי נרצה שיתחבר ידנית
      // setUser(response.data);
      
      // מציגים הודעת הצלחה
      setSuccessMessage('Registration successful! Redirecting to login page...');
      
      // מעבר לדף ההתחברות אחרי שניה
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile image header removed */}
      
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
            }}>
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
            
            }}>Register</h2>
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
              <select
                name="instrument"
                value={form.instrument}
                onChange={handleChange}
                className="border border-gray-300 w-full"
                required
                style={{
                  background: 'rgba(126, 106, 37, 0.08)',
                  height: '54px',
                  borderRadius: '12px',
                  borderWidth: '1px',
                  paddingTop: '13px',
                  paddingRight: '24px',
                  paddingBottom: '13px',
                  paddingLeft: '24px',
                  marginBottom: '8px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px top 50%',
                  backgroundSize: '12px auto',
                }}
              >
                <option value="" disabled>Select your instrument</option>
                {instruments.map((instrument) => (
                  <option key={instrument} value={instrument} style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '16px',
                  }}>
                    {instrument.charAt(0).toUpperCase() + instrument.slice(1)}
                  </option>
                ))}
              </select>
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
                    right: 20,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: 'rgba(147, 113, 0, 1)',
                  }}
                  tabIndex={-1}
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}
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
              Register
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

export default SignupPage;
