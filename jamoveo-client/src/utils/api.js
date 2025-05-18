import axios from 'axios';

// Get the API URL from environment variables or use fallbacks
const getApiUrl = () => {
  // Force local development server for now to fix CORS issues
  if (window.location.hostname === 'localhost') {
    console.log('Forcing local API endpoint for development');
    return 'http://localhost:3000';
  }
  
  // For production use the production endpoint
  return 'https://jamoveo-backend-uez9.onrender.com';
};

// Create an axios instance with the appropriate base URL
const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  // Add withCredentials for CORS requests if needed
  withCredentials: false,
});

// Log which API URL is being used (for debugging)
console.log('Using API URL:', getApiUrl());

export default api; 