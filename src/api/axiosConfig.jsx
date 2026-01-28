import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://reqres.in/api',
    timeout: 10000,

    headers: {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json'
    }
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Log the request for debugging (helpful for learning!)
    console.log('Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: config.baseURL + config.url,
      params: config.params,
      data: config.data,
    });

    // Example: Add auth token if available
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // Example: Add API key to headers
    if (config.requiresApiKey) {
      config.headers['x-api-key'] = 'reqres_9c58e2a469fe4984bf1dc39255ee611d';
    }

    // Add timestamp to track request duration
    config.metadata = { startTime: new Date().getTime() };

    return config;
  },
  (error) => {
    // Handle request errors (e.g., network issues before request is sent)
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date().getTime() - response.config.metadata.startTime;

    // Log successful response
    console.log('Response:', {
      status: response.status,
      url: response.config.url,
      duration: `${duration}ms`,
      data: response.data,
    });

    // Return the response data
    // You can transform it here if needed
    return response;
  },
  (error) => {
    /**
     * CENTRALIZED ERROR HANDLING
     * 
     * This catches ALL errors from API calls in one place!
     * Much cleaner than handling errors in every component.
     */

    if (error.response) {
      // Server responded with error status code (4xx, 5xx)
      console.error('Response Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        data: error.response.data,
      });

      // Handle specific status codes
      switch (error.response.status) {
        case 400:
          console.error('Bad Request - Check your data');
          break;
        case 401:
          console.error('Unauthorized - Please login');
          // Example: Redirect to login
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden - You don\'t have permission');
          break;
        case 404:
          console.error('Not Found - Resource doesn\'t exist');
          break;
        case 500:
          console.error('Server Error - Try again later');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error('Network Error:', {
        message: 'No response from server',
        url: error.config?.url,
      });
    } else {
      // Something else happened (e.g., request setup error)
      console.error('Error:', error.message);
    }

    // Always reject so component can handle it too if needed
    return Promise.reject(error);
  }
);


/**
 * GET request helper
 * @param {string} url - API endpoint
 * @param {object} params - Query parameters
 * @param {object} config - Additional axios config
 */
export const get = (url, params = {}, config = {}) => {
  return axiosInstance.get(url, { params, ...config });
};

/**
 * POST request helper
 * @param {string} url - API endpoint
 * @param {object} data - Request body
 * @param {object} config - Additional axios config
 */
export const post = (url, data = {}, config = {}) => {
  return axiosInstance.post(url, data, config);
};

/**
 * PUT request helper (full update)
 * @param {string} url - API endpoint
 * @param {object} data - Request body
 * @param {object} config - Additional axios config
 */
export const put = (url, data = {}, config = {}) => {
  return axiosInstance.put(url, data, config);
};

/**
 * PATCH request helper (partial update)
 * @param {string} url - API endpoint
 * @param {object} data - Request body
 * @param {object} config - Additional axios config
 */
export const patch = (url, data = {}, config = {}) => {
  return axiosInstance.patch(url, data, config);
};

/**
 * DELETE request helper
 * @param {string} url - API endpoint
 * @param {object} config - Additional axios config
 */
export const del = (url, config = {}) => {
  return axiosInstance.delete(url, config);
};

// Export the configured instance as default
export default axiosInstance;

/**
 * USAGE EXAMPLES IN COMPONENTS:
 * 
 * // Method 1: Using the instance directly
 * import axiosInstance from './api/axiosConfig';
 * const response = await axiosInstance.get('/users', { params: { page: 1 } });
 * 
 * // Method 2: Using helper functions (cleaner!)
 * import { get, post } from './api/axiosConfig';
 * const response = await get('/users', { page: 1 });
 * const newUser = await post('/users', { name: 'John', email: 'john@example.com' });
 * 
 * // Method 3: Accessing response data
 * const response = await get('/users');
 * const users = response.data; // Axios automatically puts data in .data
 */