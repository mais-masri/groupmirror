const getApiUrl = () => {
  const apiUrl = 
    process.env.REACT_APP_API_URL ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL);

  if (!apiUrl) {
    console.warn('No API URL configured, using default http://localhost:3001');
    return 'http://localhost:3001';
  }

  return apiUrl;
};

export default getApiUrl;
