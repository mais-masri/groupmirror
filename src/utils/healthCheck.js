import api from '../services/api';

const healthCheck = async () => {
  const delays = [500, 1000, 2000];
  
  for (let i = 0; i < delays.length; i++) {
    try {
      const response = await api.get('/api/health');
      console.log('✅ API OK');
      console.log('Health:', response.data);
      window.dispatchEvent(new CustomEvent('api:up'));
      return true;
    } catch (error) {
      if (i === delays.length - 1) {
        const status = error.response?.status || 'NETWORK_ERROR';
        const message = error.response?.data?.message || error.message || 'Unknown error';
        console.log(`❌ API DOWN: ${status} - ${message}`);
        window.dispatchEvent(new CustomEvent('api:down', { detail: message }));
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, delays[i]));
    }
  }
};

export default healthCheck;
