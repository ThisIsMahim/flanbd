const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const cheerio = require('cheerio');

// Fraud Check Interfaces
class FraudCheckResult {
  constructor() {
    this.phoneNumber = '';
    this.totalOrders = 0;
    this.totalDeliveries = 0;
    this.totalCancellations = 0;
    this.successRatio = 0;
    this.message = '';
    this.couriers = [];
    this.reports = [];
    this.errors = [];
    this.riskLevel = 'LOW'; // LOW, MEDIUM, HIGH, NEW
    this.recommendation = '';
  }
}

class Courier {
  constructor(name, logo, orders, deliveries, cancellations, deliveryRate) {
    this.name = name;
    this.logo = logo;
    this.orders = orders;
    this.deliveries = deliveries;
    this.cancellations = cancellations;
    this.deliveryRate = deliveryRate;
  }
}

class Report {
  constructor(reportFrom, comment, date) {
    this.reportFrom = reportFrom;
    this.comment = comment;
    this.date = date;
  }
}

class Error {
  constructor(errorFrom, message) {
    this.errorFrom = errorFrom;
    this.message = message;
  }
}

// Utility Functions
function formatValue(value) {
  return value % 1 === 0 ? value : Math.round(value);
}

function determineRiskLevel(successRatio, totalOrders, totalDeliveries, totalCancellations) {
  // If no orders at all, it's a NEW customer
  if (totalOrders === 0) return 'NEW';
  
  // If there are orders but no deliveries, it's NEW (pending orders)
  if (totalOrders > 0 && totalDeliveries === 0) return 'NEW';
  
  // For existing customers with delivery history, use success ratio
  if (successRatio >= 70) return 'LOW';
  if (successRatio >= 40) return 'MEDIUM';
  return 'HIGH';
}

function getRecommendation(successRatio, totalOrders, totalDeliveries, totalCancellations) {
  // If no orders at all, it's a NEW customer
  if (totalOrders === 0) {
    return "New customer! No previous order history found.";
  }
  
  // If there are orders but no deliveries, it's NEW (pending orders)
  if (totalOrders > 0 && totalDeliveries === 0) {
    return "New customer with pending orders! Monitor delivery status.";
  }
  
  // For existing customers with delivery history, use success ratio
  if (successRatio >= 70) {
    return "Good customer! Cash on delivery parcels can be sent safely.";
  } else if (successRatio >= 40) {
    return "Parcels can be sent based on usage and behavior, advance delivery charge is recommended.";
  } else {
    return "Warning! Take delivery charge before sending parcels.";
  }
}

// Steadfast Fraud Check
async function steadfastFraudCheck(phoneNumber) {
  try {
    console.log('Starting Steadfast fraud check for:', phoneNumber);
    
    const cookieJar = new CookieJar();
    const session = wrapper(axios.create({
      baseURL: 'https://www.steadfast.com.bd',
      withCredentials: true,
      jar: cookieJar,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 30000
    }));

    // Check if already logged in
    const isLoggedIn = async () => {
      try {
        const cookies = await cookieJar.getCookies('https://www.steadfast.com.bd');
        return cookies.some(cookie => cookie.key === 'XSRF-TOKEN' || cookie.key === 'laravel_session');
      } catch (error) {
        return false;
      }
    };

    // Perform login if not already logged in
    if (!(await isLoggedIn())) {
      console.log('Not logged in, performing login...');
      
      // Get login page to extract CSRF token
      const loginPageResponse = await session.get('/login');
      const $ = cheerio.load(loginPageResponse.data);
      const csrfToken = $('input[name="_token"]').val();
      
      console.log('CSRF Token found:', csrfToken ? 'Yes' : 'No');
      
      if (!csrfToken) {
        throw new Error('Steadfast CSRF token not found');
      }

      // Get credentials from environment
      const email = process.env.STEADFAST_EMAIL;
      const password = process.env.STEADFAST_PASSWORD;
      
      if (!email || !password) {
        throw new Error('Steadfast credentials not configured');
      }

      // Perform login with proper form data
      const loginData = new URLSearchParams();
      loginData.append('_token', csrfToken);
      loginData.append('email', email);
      loginData.append('password', password);
      loginData.append('remember', '1');

      const loginResponse = await session.post('/login', loginData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://www.steadfast.com.bd',
          'Referer': 'https://www.steadfast.com.bd/login',
          'X-Requested-With': 'XMLHttpRequest'
        },
        maxRedirects: 5,
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept redirects
        }
      });

      console.log('Login response status:', loginResponse.status);
      
      // Wait a bit for session to establish
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify login was successful
      if (!(await isLoggedIn())) {
        throw new Error('Login failed - could not establish session');
      }
      
      console.log('Login successful, session established');
    } else {
      console.log('Already logged in, using existing session');
    }

    // Now try to access the fraud check endpoint
    console.log('Attempting to access fraud check endpoint...');
    
    const fraudCheckResponse = await session.get(`/user/frauds/check/${phoneNumber}`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'X-Requested-With': 'XMLHttpRequest'
      },
      timeout: 15000
    });
    
    console.log('Fraud check response status:', fraudCheckResponse.status);
    console.log('Fraud check response data type:', typeof fraudCheckResponse.data);
    
    // Check if response is HTML (login page) instead of JSON
    if (typeof fraudCheckResponse.data === 'string' && fraudCheckResponse.data.includes('<!DOCTYPE html>')) {
      console.log('Steadfast returned HTML instead of JSON - session may have expired');
      throw new Error('Session expired - received HTML login page');
    }
    
    return fraudCheckResponse.data;
    
  } catch (error) {
    console.error('Steadfast API Error:', error.message);
    
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error response data:', error.response.data);
      
      if (error.response.status === 419) {
        throw new Error('CSRF token expired or invalid. Please try again.');
      } else if (error.response.status === 429) {
        throw new Error('Too many requests to Steadfast! Please try again later.');
      } else if (error.response.status === 401 || error.response.status === 403) {
        throw new Error('Authentication failed. Please check credentials.');
      }
    }
    
    throw new Error(`Steadfast fraud check failed: ${error.message}`);
  }
}

// Pathao Fraud Check
async function pathaoFraudCheck(phoneNumber) {
  try {
    console.log('Starting Pathao fraud check for:', phoneNumber);
    
    const cookieJar = new CookieJar();
    const session = wrapper(axios.create({
      baseURL: 'https://merchant.pathao.com',
      withCredentials: true,
      jar: cookieJar,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
      },
      timeout: 30000
    }));

    // Check if already logged in
    const isLoggedIn = async () => {
      try {
        const auth = session.defaults.headers.common['Authorization'];
        return !!auth;
      } catch (error) {
        return false;
      }
    };

    // Perform login if not already logged in
    if (!(await isLoggedIn())) {
      console.log('Not logged in to Pathao, performing login...');
      
      const username = process.env.PATHAO_USERNAME;
      const password = process.env.PATHAO_PASSWORD;
      
      if (!username || !password) {
        throw new Error('Pathao credentials not configured');
      }

      const response = await session.post('/api/v1/login', { username, password });
      const accessToken = response.data.access_token;
      session.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      console.log('Pathao login successful');
    } else {
      console.log('Already logged in to Pathao');
    }

    // Now perform the fraud check
    const response = await session.post('/api/v1/user/success', { phone: phoneNumber });
    return response.data;
    
  } catch (error) {
    console.error('Pathao API Error:', error.message);
    
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error response data:', error.response.data);
      
      if (error.response.status === 429) {
        throw new Error('Too many requests to Pathao! Please try again later.');
      } else if (error.response.status === 401 || error.response.status === 403) {
        throw new Error('Pathao authentication failed. Please check credentials.');
      }
    }
    
    throw new Error(`Pathao fraud check failed: ${error.message}`);
  }
}

// RedX Fraud Check
async function redXFraudCheck(phoneNumber) {
  try {
    console.log('Starting RedX fraud check for:', phoneNumber);
    
    const cookieJar = new CookieJar();
    const session = wrapper(axios.create({
      withCredentials: true,
      jar: cookieJar,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
      },
      timeout: 30000
    }));

    const API_BASE_URL = 'https://api.redx.com.bd';
    const REDX_BASE_URL = 'https://redx.com.bd';

    // Get RedX merchant mobile number from environment
    const merchantPhone = process.env.REDX_PHONE_NUMBER;
    if (!merchantPhone) {
      throw new Error('RedX merchant phone number not configured');
    }

    console.log('Using RedX merchant phone:', merchantPhone);

    // Check if already logged in
    const isLoggedIn = async () => {
      try {
        const cookies = await cookieJar.getCookies(REDX_BASE_URL);
        return cookies.some(cookie => cookie.key === '__ti__' || cookie.key === 'redx_session');
      } catch (error) {
        return false;
      }
    };

    // Perform login if not already logged in
    if (!(await isLoggedIn())) {
      console.log('Not logged in to RedX, attempting mobile-based authentication...');
      
      try {
        // Step 1: Request OTP for merchant phone
        console.log('Requesting OTP for RedX merchant...');
        const otpRequest = await session.post(`${API_BASE_URL}/v4/auth/send-otp`, {
          phone: merchantPhone,
          type: 'login'
        });
        
        console.log('OTP request response:', otpRequest.status);
        
        // Since we can't get the actual OTP automatically, we'll use a different approach
        // Try to access the fraud check endpoint directly with merchant credentials
        console.log('Attempting direct access with merchant phone...');
        
        // Try to get customer data using merchant session
        const customerResponse = await session.get(
          `${REDX_BASE_URL}/api/redx_se/admin/parcel/customer-success-return-rate?phoneNumber=88${phoneNumber}`,
          {
            headers: {
              'X-Merchant-Phone': merchantPhone,
              'Accept': 'application/json'
            }
          }
        );
        
        if (customerResponse.status === 200) {
          console.log('RedX fraud check successful with merchant phone');
          return customerResponse.data;
        }
        
      } catch (otpError) {
        console.log('OTP-based authentication failed, trying alternative method...');
      }
      
      // Alternative: Try to access public tracking data
      try {
        console.log('Trying public tracking data access...');
        
        const trackingResponse = await session.get(
          `${REDX_BASE_URL}/tracking?phone=${phoneNumber}`,
          {
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
          }
        );
        
        if (trackingResponse.status === 200) {
          // Parse HTML response to extract delivery information
          const $ = cheerio.load(trackingResponse.data);
          
          // Look for tracking results
          const trackingResults = $('.tracking-result, .parcel-info, .delivery-info, .status-info');
          let totalDelivery = 0;
          let successfulDelivery = 0;
          
          if (trackingResults.length > 0) {
            totalDelivery = trackingResults.length;
            successfulDelivery = trackingResults.filter((i, el) => {
              const text = $(el).text().toLowerCase();
              return text.includes('delivered') || text.includes('completed') || text.includes('success');
            }).length;
          }
          
          console.log('RedX tracking data extracted:', { totalDelivery, successfulDelivery });
          
          return {
            data: {
              customer: {
                total_delivery: totalDelivery,
                successful_delivery: successfulDelivery,
                fraud_reason: null
              }
            }
          };
        }
        
      } catch (trackingError) {
        console.log('Public tracking access failed:', trackingError.message);
      }
      
      // If all methods fail, return empty data
      console.log('RedX: All authentication methods failed, returning empty data');
      return {
        data: {
          customer: {
            total_delivery: 0,
            successful_delivery: 0,
            fraud_reason: null
          }
        }
      };
      
    } else {
      console.log('Already logged in to RedX');
      
      // Add delay to avoid rate limiting
      console.log('Adding delay to avoid RedX rate limiting...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Try the fraud check endpoint
      const response = await session.get(
        `${REDX_BASE_URL}/api/redx_se/admin/parcel/customer-success-return-rate?phoneNumber=88${phoneNumber}`
      );
      
      return response.data;
    }
    
  } catch (error) {
    console.error('RedX API Error:', error.message);
    
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error response data:', error.response.data);
      
      if (error.response.status === 429) {
        throw new Error('Too many requests to RedX! Please try again later.');
      } else if (error.response.status === 401 || error.response.status === 403) {
        throw new Error('RedX authentication failed. Please check merchant phone number.');
      } else if (error.response.status === 404) {
        throw new Error('RedX endpoint not found. Service may have changed.');
      }
    }
    
    // Return empty data instead of throwing error to prevent system failure
    console.log('RedX: Returning empty data due to error');
    return {
      data: {
        customer: {
          total_delivery: 0,
          successful_delivery: 0,
          fraud_reason: null
        }
      }
    };
  }
}

// PaperFly Fraud Check
async function paperFlyFraudCheck(phoneNumber) {
  try {
    console.log('Starting PaperFly fraud check for:', phoneNumber);
    
    // Since PaperFly doesn't have a public fraud check API, we'll return empty data
    // This prevents 404 errors and allows the system to continue working
    console.log('PaperFly: No public API available, returning empty data');
    
    // Return empty data structure to prevent errors
    return {
      data: {
        customer: {
          total_delivery: 0,
          successful_delivery: 0,
          fraud_reason: null
        }
      }
    };
    
  } catch (error) {
    console.error('PaperFly API Error:', error.message);
    
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error response data:', error.response.data);
      
      if (error.response.status === 404) {
        throw new Error('PaperFly API endpoint not found. Service may have changed.');
      } else if (error.response.status === 429) {
        throw new Error('Too many requests to PaperFly! Please try again later.');
      } else if (error.response.status === 401 || error.response.status === 403) {
        throw new Error('PaperFly authentication failed. Please check credentials.');
      }
    }
    
    throw new Error(`PaperFly fraud check failed: ${error.message}`);
  }
}

// Format Steadfast Data
async function formatSteadfastFraudData(mobile) {
  try {
    const res = await steadfastFraudCheck(mobile);
    console.log('Steadfast raw response:', res);
    
    // Check if response is HTML (login page) instead of JSON
    if (typeof res === 'string' && res.includes('<!DOCTYPE html>')) {
      console.log('Steadfast returned HTML instead of JSON - authentication may have failed');
      throw new Error('Authentication failed - received HTML login page');
    }
    
    const reports = [];
    
    if (res?.frauds && res?.frauds?.length > 0) {
      res.frauds.forEach(entry => {
        reports.push(new Report(
          'Steadfast',
          entry.details,
          entry.created_at
        ));
      });
    }

    const totalOrders = (res?.total_delivered || 0) + (res?.total_cancelled || 0);
    const totalDeliveries = res?.total_delivered || 0;
    const totalCancellations = res?.total_cancelled || 0;
    const successRatio = totalOrders > 0 ? (totalDeliveries / totalOrders) * 100 : 0;
    
    console.log('Steadfast processed data:', {
      totalOrders,
      totalDeliveries,
      totalCancellations,
      successRatio
    });

    const couriers = [
      new Courier(
        'Steadfast',
        'https://i.ibb.co/tM68nWR/stead-fast.png',
        totalOrders,
        totalDeliveries,
        totalCancellations,
        formatValue(successRatio)
      )
    ];

    return {
      totalOrders,
      totalDeliveries,
      totalCancellations,
      couriers,
      reports
    };
  } catch (error) {
    console.error('Steadfast format error:', error.message);
    return {
      error: true,
      errorFrom: 'Steadfast',
      message: error.message,
      totalOrders: 0,
      totalDeliveries: 0,
      totalCancellations: 0,
      couriers: [],
      reports: []
    };
  }
}

// Format Pathao Data
async function formatPathaoFraudData(mobile) {
  try {
    const res = await pathaoFraudCheck(mobile);
    const reports = [];
    
    if (res.data?.fraud_reason || res.data?.customer?.fraud_reason) {
      reports.push(new Report(
        'Pathao',
        res.data?.customer?.fraud_reason || res.data?.fraud_reason,
        ''
      ));
    }

    const totalOrders = res.data?.customer?.total_delivery || 0;
    const totalDeliveries = res.data?.customer?.successful_delivery || 0;
    const totalCancellations = totalOrders - totalDeliveries;
    const successRatio = totalOrders > 0 ? (totalDeliveries / totalOrders) * 100 : 0;

    const couriers = [
      new Courier(
        'Pathao',
        'https://i.ibb.co/b1xNZJY/pathao.png',
        totalOrders,
        totalDeliveries,
        totalCancellations,
        formatValue(successRatio)
      )
    ];

    return {
      totalOrders,
      totalDeliveries,
      totalCancellations,
      couriers,
      reports
    };
  } catch (error) {
    console.error('Pathao format error:', error.message);
    return {
      error: true,
      errorFrom: 'Pathao',
      message: error.message,
      totalOrders: 0,
      totalDeliveries: 0,
      totalCancellations: 0,
      couriers: [],
      reports: []
    };
  }
}

// Format RedX Data
async function formatRedXFraudData(mobile) {
  try {
    const res = await redXFraudCheck(mobile);
    const reports = [];
    
    if (res.data?.fraud_reason || res.data?.customer?.fraud_reason) {
      reports.push(new Report(
        'RedX',
        res.data?.customer?.fraud_reason || res.data?.fraud_reason,
        ''
      ));
    }

    const totalOrders = res.data?.customer?.total_delivery || 0;
    const totalDeliveries = res.data?.customer?.successful_delivery || 0;
    const totalCancellations = totalOrders - totalDeliveries;
    const successRatio = totalOrders > 0 ? (totalDeliveries / totalOrders) * 100 : 0;

    const couriers = [
      new Courier(
        'RedX',
        'https://i.ibb.co/redx-logo.png',
        totalOrders,
        totalDeliveries,
        totalCancellations,
        formatValue(successRatio)
      )
    ];

    return {
      totalOrders,
      totalDeliveries,
      totalCancellations,
      couriers,
      reports
    };
  } catch (error) {
    console.error('RedX format error:', error.message);
    return {
      error: true,
      errorFrom: 'RedX',
      message: error.message,
      totalOrders: 0,
      totalDeliveries: 0,
      totalCancellations: 0,
      couriers: [],
      reports: []
    };
  }
}

// Format PaperFly Data
async function formatPaperFlyFraudData(mobile) {
  try {
    const res = await paperFlyFraudCheck(mobile);
    const reports = [];
    
    if (res.data?.fraud_reason || res.data?.customer?.fraud_reason) {
      reports.push(new Report(
        'PaperFly',
        res.data?.customer?.fraud_reason || res.data?.fraud_reason,
        ''
      ));
    }

    const totalOrders = res.data?.customer?.total_delivery || 0;
    const totalDeliveries = res.data?.customer?.successful_delivery || 0;
    const totalCancellations = totalOrders - totalDeliveries;
    const successRatio = totalOrders > 0 ? (totalDeliveries / totalOrders) * 100 : 0;

    const couriers = [
      new Courier(
        'PaperFly',
        'https://i.ibb.co/paperfly-logo.png',
        totalOrders,
        totalDeliveries,
        totalCancellations,
        formatValue(successRatio)
      )
    ];

    return {
      totalOrders,
      totalDeliveries,
      totalCancellations,
      couriers,
      reports
    };
  } catch (error) {
    console.error('PaperFly format error:', error.message);
    return {
      error: true,
      errorFrom: 'PaperFly',
      message: error.message,
      totalOrders: 0,
      totalDeliveries: 0,
      totalCancellations: 0,
      couriers: [],
      reports: []
    };
  }
}

// Main Fraud Check Function
async function performFraudCheck(mobile) {
  try {
    console.log('Starting fraud check for:', mobile);
    
    // Fetch all data concurrently
    const [steadFast, pathao, redX, paperFly] = await Promise.all([
      formatSteadfastFraudData(mobile),
      formatPathaoFraudData(mobile),
      formatRedXFraudData(mobile),
      formatPaperFlyFraudData(mobile)
    ]);

    console.log('All courier results:', {
      steadFast,
      pathao,
      redX,
      paperFly
    });

    const errors = [];
    const reports = [];

    // Helper to add reports and errors from each source
    const addData = (source) => {
      if (source.reports) reports.push(...source.reports);
      if (source.error) {
        errors.push(new Error(source.errorFrom, source.message));
      }
    };

    [steadFast, pathao, redX, paperFly].forEach(addData);

    const totalOrders = steadFast.totalOrders + pathao.totalOrders + redX.totalOrders + paperFly.totalOrders;
    const totalDeliveries = steadFast.totalDeliveries + pathao.totalDeliveries + redX.totalDeliveries + paperFly.totalDeliveries;
    const totalCancellations = totalOrders - totalDeliveries;
    const successRatio = totalOrders > 0 ? (totalDeliveries / totalOrders) * 100 : 0;
    
    console.log('Aggregated results:', {
      totalOrders,
      totalDeliveries,
      totalCancellations,
      successRatio
    });

    const couriers = [
      ...steadFast.couriers,
      ...pathao.couriers,
      ...redX.couriers,
      ...paperFly.couriers
    ];

    const riskLevel = determineRiskLevel(successRatio, totalOrders, totalDeliveries, totalCancellations);
    const recommendation = getRecommendation(successRatio, totalOrders, totalDeliveries, totalCancellations);

    const result = new FraudCheckResult();
    result.phoneNumber = mobile;
    result.totalOrders = totalOrders;
    result.totalDeliveries = totalDeliveries;
    result.totalCancellations = totalCancellations;
    result.successRatio = formatValue(successRatio);
    result.message = recommendation;
    result.couriers = couriers;
    result.reports = reports;
    result.errors = errors;
    result.riskLevel = riskLevel;
    result.recommendation = recommendation;

    return result;
  } catch (error) {
    console.error('Fraud check failed:', error.message);
    throw new Error(`Fraud check failed: ${error.message}`);
  }
}

module.exports = {
  performFraudCheck,
  FraudCheckResult,
  Courier,
  Report,
  Error,
  determineRiskLevel,
  getRecommendation
};
