const { performFraudCheck } = require('../utils/fraudChecker');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const ErrorHandler = require('../utils/errorHandler');

// Import individual courier functions for testing
const { 
  steadfastFraudCheck, 
  pathaoFraudCheck, 
  redXFraudCheck, 
  paperFlyFraudCheck 
} = require('../utils/fraudChecker');

// Manual fraud check endpoint
exports.checkFraud = asyncErrorHandler(async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return next(new ErrorHandler('Phone number is required', 400));
  }

  // Validate phone number format (Bangladeshi format)
  const phoneRegex = /^(\+880|880|0)?1[3-9]\d{8}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return next(new ErrorHandler('Invalid phone number format', 400));
  }

  try {
    const fraudResult = await performFraudCheck(phoneNumber);
    
    res.status(200).json({
      status: 'success',
      data: fraudResult
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Test individual courier endpoints
exports.testSteadfast = asyncErrorHandler(async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return next(new ErrorHandler('Phone number is required', 400));
  }

  try {
    console.log('Testing Steadfast courier for:', phoneNumber);
    const result = await steadfastFraudCheck(phoneNumber);
    
    res.status(200).json({
      status: 'success',
      courier: 'Steadfast',
      data: result
    });
  } catch (error) {
    console.error('Steadfast test failed:', error.message);
    res.status(500).json({
      status: 'error',
      courier: 'Steadfast',
      message: error.message
    });
  }
});

exports.testPathao = asyncErrorHandler(async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return next(new ErrorHandler('Phone number is required', 400));
  }

  try {
    console.log('Testing Pathao courier for:', phoneNumber);
    const result = await pathaoFraudCheck(phoneNumber);
    
    res.status(200).json({
      status: 'success',
      courier: 'Pathao',
      data: result
    });
  } catch (error) {
    console.error('Pathao test failed:', error.message);
    res.status(500).json({
      status: 'error',
      courier: 'Pathao',
      message: error.message
    });
  }
});

exports.testRedX = asyncErrorHandler(async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return next(new ErrorHandler('Phone number is required', 400));
  }

  try {
    console.log('Testing RedX courier for:', phoneNumber);
    const result = await redXFraudCheck(phoneNumber);
    
    res.status(200).json({
      status: 'success',
      courier: 'RedX',
      data: result
    });
  } catch (error) {
    console.error('RedX test failed:', error.message);
    res.status(500).json({
      status: 'error',
      courier: 'RedX',
      message: error.message
    });
  }
});

exports.testPaperFly = asyncErrorHandler(async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return next(new ErrorHandler('Phone number is required', 400));
  }

  try {
    console.log('Testing PaperFly courier for:', phoneNumber);
    const result = await paperFlyFraudCheck(phoneNumber);
    
    res.status(200).json({
      status: 'success',
      courier: 'PaperFly',
      data: result
    });
  } catch (error) {
    console.error('PaperFly test failed:', error.message);
    res.status(500).json({
      status: 'error',
      courier: 'PaperFly',
      message: error.message
    });
  }
});

// Test fraud check functionality (for debugging)
exports.testFraudCheck = asyncErrorHandler(async (req, res, next) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return next(new ErrorHandler('Phone number is required', 400));
    }

    try {
        // Create a simple test result without calling external APIs
        const testResult = {
            phoneNumber: phoneNumber,
            totalOrders: 5,
            totalDeliveries: 4,
            totalCancellations: 1,
            successRatio: 80,
            riskLevel: 'LOW',
            recommendation: 'Good customer! Cash on delivery parcels can be sent safely.',
            couriers: [
                {
                    name: 'Steadfast',
                    logo: 'https://i.ibb.co/tM68nWR/stead-fast.png',
                    orders: 3,
                    deliveries: 2,
                    cancellations: 1,
                    deliveryRate: 67
                },
                {
                    name: 'Pathao',
                    logo: 'https://i.ibb.co/b1xNZJY/pathao.png',
                    orders: 2,
                    deliveries: 2,
                    cancellations: 0,
                    deliveryRate: 100
                }
            ],
            reports: [],
            errors: [],
            checkedAt: new Date()
        };
        
        res.status(200).json({
            status: 'success',
            data: testResult
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Bulk fraud check for all orders without fraud check data
exports.bulkFraudCheck = asyncErrorHandler(async (req, res, next) => {
    try {
        // Find all orders without fraud check data
        const ordersWithoutFraudCheck = await Order.find({
            $or: [
                { fraudCheck: { $exists: false } },
                { fraudCheck: null }
            ]
        });

        if (ordersWithoutFraudCheck.length === 0) {
            return res.status(200).json({
                status: 'success',
                message: 'All orders already have fraud check data',
                data: {
                    processed: 0,
                    total: 0
                }
            });
        }

        let processed = 0;
        let errors = [];

        // Process each order
        for (const order of ordersWithoutFraudCheck) {
            try {
                const phoneNumber = order.shippingInfo?.phoneNo;
                if (!phoneNumber) {
                    errors.push(`Order ${order._id}: No phone number found`);
                    continue;
                }

                // Perform fraud check
                const fraudCheckResult = await performFraudCheck(phoneNumber);
                
                // Update order with fraud check data
                order.fraudCheck = {
                    phoneNumber: fraudCheckResult.phoneNumber,
                    totalOrders: fraudCheckResult.totalOrders,
                    totalDeliveries: fraudCheckResult.totalDeliveries,
                    totalCancellations: fraudCheckResult.totalCancellations,
                    successRatio: fraudCheckResult.successRatio,
                    riskLevel: fraudCheckResult.riskLevel,
                    recommendation: fraudCheckResult.recommendation,
                    couriers: fraudCheckResult.couriers,
                    reports: fraudCheckResult.reports,
                    errors: fraudCheckResult.errors,
                    checkedAt: new Date()
                };
                
                await order.save({ validateBeforeSave: false });
                processed++;
                
                // Add small delay to avoid overwhelming external APIs
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (error) {
                errors.push(`Order ${order._id}: ${error.message}`);
            }
        }

        res.status(200).json({
            status: 'success',
            message: `Bulk fraud check completed. Processed ${processed} orders.`,
            data: {
                processed,
                total: ordersWithoutFraudCheck.length,
                errors: errors.length > 0 ? errors : undefined
            }
        });
        
    } catch (error) {
        console.error('Error performing bulk fraud check:', error);
        res.status(500).json({
            status: 'error',
            message: `Bulk fraud check failed: ${error.message}`
        });
    }
});

// Get fraud check history for a phone number
exports.getFraudHistory = asyncErrorHandler(async (req, res, next) => {
  const { phoneNumber } = req.params;

  const orders = await Order.find({
    'shippingInfo.phoneNo': phoneNumber
  }).select('fraudCheck createdAt orderStatus totalPrice');

  const fraudHistory = orders.map(order => ({
    orderId: order._id,
    date: order.createdAt,
    status: order.orderStatus,
    amount: order.totalPrice,
    fraudCheck: order.fraudCheck || null
  }));

  res.status(200).json({
    status: 'success',
    data: {
      phoneNumber,
      totalOrders: orders.length,
      fraudHistory
    }
  });
});

// Get fraud statistics for admin dashboard
exports.getFraudStats = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find({
    fraudCheck: { $exists: true }
  }).select('fraudCheck createdAt orderStatus totalPrice');

  const stats = {
    totalOrdersChecked: orders.length,
    highRiskOrders: 0,
    mediumRiskOrders: 0,
    lowRiskOrders: 0,
    totalAmountAtRisk: 0,
    riskBreakdown: {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0
    }
  };

  orders.forEach(order => {
    if (order.fraudCheck) {
      const riskLevel = order.fraudCheck.riskLevel;
      stats.riskBreakdown[riskLevel]++;
      
      if (riskLevel === 'HIGH') {
        stats.highRiskOrders++;
        stats.totalAmountAtRisk += order.totalPrice || 0;
      } else if (riskLevel === 'MEDIUM') {
        stats.mediumRiskOrders++;
      } else {
        stats.lowRiskOrders++;
      }
    }
  });

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

// Get recent fraud checks
exports.getRecentFraudChecks = asyncErrorHandler(async (req, res, next) => {
  const { limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit;

  const orders = await Order.find({
    fraudCheck: { $exists: true }
  })
  .select('user fraudCheck createdAt orderStatus totalPrice shippingInfo')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(parseInt(limit))
  .populate('user', 'name email');

  const recentChecks = orders.map(order => ({
    orderId: order._id,
    customer: order.user,
    phoneNumber: order.shippingInfo?.phoneNo || order.fraudCheck?.phoneNumber,
    fraudCheck: order.fraudCheck,
    orderStatus: order.orderStatus,
    amount: order.totalPrice,
    date: order.createdAt
  }));

  res.status(200).json({
    status: 'success',
    data: {
      recentChecks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: await Order.countDocuments({ fraudCheck: { $exists: true } })
      }
    }
  });
});

// Get fraud check details for a specific order
exports.getOrderFraudCheck = asyncErrorHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .select('user fraudCheck createdAt orderStatus totalPrice shippingInfo')
    .populate('user', 'name email');

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  if (!order.fraudCheck) {
    return next(new ErrorHandler('No fraud check performed for this order', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      orderId: order._id,
      customer: order.user,
      fraudCheck: order.fraudCheck,
      orderStatus: order.orderStatus,
      amount: order.totalPrice,
      date: order.createdAt
    }
  });
});

// Perform fraud check for existing order and update it
exports.performOrderFraudCheck = asyncErrorHandler(async (req, res, next) => {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    const phoneNumber = order.shippingInfo?.phoneNo;
    if (!phoneNumber) {
        return next(new ErrorHandler('Phone number not found in order', 400));
    }

    try {
        // Perform fraud check
        const fraudCheckResult = await performFraudCheck(phoneNumber);
        
        // Update order with fraud check data
        order.fraudCheck = {
            phoneNumber: fraudCheckResult.phoneNumber,
            totalOrders: fraudCheckResult.totalOrders,
            totalDeliveries: fraudCheckResult.totalDeliveries,
            totalCancellations: fraudCheckResult.totalCancellations,
            successRatio: fraudCheckResult.successRatio,
            riskLevel: fraudCheckResult.riskLevel,
            recommendation: fraudCheckResult.recommendation,
            couriers: fraudCheckResult.couriers,
            reports: fraudCheckResult.reports,
            errors: fraudCheckResult.errors,
            checkedAt: new Date()
        };
        
        await order.save({ validateBeforeSave: false });
        
        res.status(200).json({
            status: 'success',
            message: 'Fraud check completed and order updated',
            data: {
                orderId: order._id,
                fraudCheck: order.fraudCheck
            }
        });
        
    } catch (error) {
        console.error('Error performing fraud check for order:', error);
        res.status(500).json({
            status: 'error',
            message: `Fraud check failed: ${error.message}`
        });
    }
});

// Get fraud alerts (high risk orders)
exports.getFraudAlerts = asyncErrorHandler(async (req, res, next) => {
  const { limit = 20 } = req.query;

  const highRiskOrders = await Order.find({
    'fraudCheck.riskLevel': 'HIGH'
  })
  .select('user fraudCheck createdAt orderStatus totalPrice shippingInfo')
  .sort({ createdAt: -1 })
  .limit(parseInt(limit))
  .populate('user', 'name email');

  const alerts = highRiskOrders.map(order => ({
    orderId: order._id,
    customer: order.user,
    phoneNumber: order.shippingInfo?.phoneNo || order.fraudCheck?.phoneNumber,
    fraudCheck: order.fraudCheck,
    orderStatus: order.orderStatus,
    amount: order.totalPrice,
    date: order.createdAt,
    alertType: 'HIGH_RISK'
  }));

  res.status(200).json({
    status: 'success',
    data: {
      alerts,
      totalAlerts: alerts.length
    }
  });
});

// Export fraud check data for analysis
exports.exportFraudData = asyncErrorHandler(async (req, res, next) => {
  const { startDate, endDate, riskLevel } = req.query;

  let query = { fraudCheck: { $exists: true } };

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  if (riskLevel) {
    query['fraudCheck.riskLevel'] = riskLevel;
  }

  const orders = await Order.find(query)
    .select('user fraudCheck createdAt orderStatus totalPrice shippingInfo')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  const exportData = orders.map(order => ({
    orderId: order._id,
    customerName: order.user?.name || '',
    customerEmail: order.user?.email || '',
    phoneNumber: order.shippingInfo?.phoneNo || order.fraudCheck?.phoneNumber,
    orderDate: order.createdAt,
    orderStatus: order.orderStatus,
    orderAmount: order.totalPrice,
    riskLevel: order.fraudCheck?.riskLevel,
    successRatio: order.fraudCheck?.successRatio,
    totalOrders: order.fraudCheck?.totalOrders,
    totalDeliveries: order.fraudCheck?.totalDeliveries,
    totalCancellations: order.fraudCheck?.totalCancellations,
    recommendation: order.fraudCheck?.recommendation,
    couriers: order.fraudCheck?.couriers || [],
    reports: order.fraudCheck?.reports || [],
    errors: order.fraudCheck?.errors || []
  }));

  res.status(200).json({
    status: 'success',
    data: {
      exportData,
      totalRecords: exportData.length,
      dateRange: { startDate, endDate },
      riskLevel
    }
  });
});
