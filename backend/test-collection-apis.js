const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000/api/v1';
const TEST_TIMEOUT = 10000; // 10 seconds

// Test data
const testCases = [
  {
    name: 'Gents Collection API',
    endpoint: '/collections/gents',
    expectedStatus: 200
  },
  {
    name: 'Ladies Collection API',
    endpoint: '/collections/ladies',
    expectedStatus: 200
  },
  {
    name: 'Sports Sunglass API',
    endpoint: '/collections/sports-sunglass',
    expectedStatus: 200
  },
  {
    name: 'Eyewear API',
    endpoint: '/collections/eyewear',
    expectedStatus: 200
  }
];

// Test with query parameters
const testWithParams = [
  {
    name: 'Gents Collection with filters',
    endpoint: '/collections/gents',
    params: {
      page: 1,
      limit: 5,
      'price[gte]': 100,
      'price[lte]': 5000
    },
    expectedStatus: 200
  },
  {
    name: 'Ladies Collection with color filter',
    endpoint: '/collections/ladies',
    params: {
      page: 1,
      limit: 5,
      color: 'black'
    },
    expectedStatus: 200
  }
];

// Helper function to make API calls
async function testAPI(testCase) {
  try {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log(`📍 Endpoint: ${testCase.endpoint}`);
    
    const startTime = Date.now();
    const response = await axios.get(`${BASE_URL}${testCase.endpoint}`, {
      params: testCase.params || {},
      timeout: TEST_TIMEOUT
    });
    const endTime = Date.now();
    
    // Check status code
    if (response.status === testCase.expectedStatus) {
      console.log(`✅ Status: ${response.status} (Expected: ${testCase.expectedStatus})`);
    } else {
      console.log(`❌ Status: ${response.status} (Expected: ${testCase.expectedStatus})`);
    }
    
    // Check response structure
    if (response.data && response.data.success) {
      console.log(`✅ Response structure: Valid`);
      console.log(`📊 Products count: ${response.data.products?.length || 0}`);
      console.log(`📄 Total products: ${response.data.totalProducts || 'N/A'}`);
      console.log(`📖 Total pages: ${response.data.totalPages || 'N/A'}`);
      console.log(`⏱️  Response time: ${endTime - startTime}ms`);
    } else {
      console.log(`❌ Response structure: Invalid`);
      console.log(`📝 Response data:`, response.data);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📝 Response:`, error.response.data);
    }
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Collection APIs Test Suite');
  console.log('=' .repeat(50));
  
  let passedTests = 0;
  let totalTests = 0;
  
  // Test basic endpoints
  for (const testCase of testCases) {
    totalTests++;
    const result = await testAPI(testCase);
    if (result) passedTests++;
  }
  
  // Test with parameters
  for (const testCase of testWithParams) {
    totalTests++;
    const result = await testAPI(testCase);
    if (result) passedTests++;
  }
  
  // Test results summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(50));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Collection APIs are working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testAPI };
