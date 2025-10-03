const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

const testEndpoints = async () => {
  console.log('Testing collection endpoints...\n');
  
  const endpoints = [
    '/collections/gents',
    '/collections/ladies',
    '/collections/sports-sunglass',
    '/collections/eyewear'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      
      if (response.data.success) {
        console.log(`✅ ${endpoint} - Success! Found ${response.data.products?.length || 0} products`);
      } else {
        console.log(`❌ ${endpoint} - Failed: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint} - Error ${error.response.status}: ${error.response.data?.message || error.message}`);
      } else {
        console.log(`❌ ${endpoint} - Network error: ${error.message}`);
      }
    }
    console.log('');
  }
  
  console.log('Testing completed!');
};

testEndpoints();






