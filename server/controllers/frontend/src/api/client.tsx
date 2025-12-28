import axios from 'axios';

// Get API base URL from environment or use default
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Log the API base URL in development
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

// Request interceptor (for adding auth tokens if needed in future)
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(
        `API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
      );
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error - No response received:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        message: error.message,
        code: error.code,
      });
    } else {
      // Something else happened
      console.error('Request Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);
