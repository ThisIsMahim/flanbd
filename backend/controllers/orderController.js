const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Coupon = require('../models/Coupon');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const { performFraudCheck } = require('../utils/fraudChecker');

// Create New Order (for authenticated users)
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice: clientTotal, // ignore for backend computations
        couponCode,
    } = req.body;

    const orderExist = await Order.findOne({ paymentInfo });

    if (orderExist) {
        return next(new ErrorHandler("Order Already Placed", 400));
    }

    // Derive items total from order items to avoid client-side mismatch
    const itemsTotal = (orderItems || []).reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity)), 0);

    // Compute delivery charge from shipping info (aligned with frontend)
    const deliveryCharge = shippingInfo?.deliveryArea === 'inside' ? 70 : 130;

    // Gold user eligibility (spend >= 10000 last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
    const lastYearAggregate = await Order.aggregate([
        { $match: { user: req.user._id, paidAt: { $gte: twelveMonthsAgo } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const lastYearTotal = lastYearAggregate.length ? lastYearAggregate[0].total : 0;
    const isGoldUser = lastYearTotal >= 10000;

    // Calculation order: items -> minus gold (10% on items ONLY) -> add delivery -> minus coupon
    const goldDiscount = isGoldUser ? Math.round(itemsTotal * 0.10) : 0;
    const baseWithDelivery = Math.max(0, (itemsTotal - goldDiscount) + deliveryCharge);

    // Apply coupon if provided (on amount after gold)
    let couponDiscount = 0;
    let appliedCoupon = null;
    if (couponCode) {
        const code = String(couponCode).trim().toUpperCase();
        const coupon = await Coupon.findOne({ code, active: true });
        if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
            if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
                const amountAfterGold = baseWithDelivery; // already includes gold reduction and delivery
                if (amountAfterGold >= (coupon.minOrder || 0)) {
                    couponDiscount = coupon.type === 'percent' ? Math.round((amountAfterGold * coupon.value) / 100) : Math.min(coupon.value, amountAfterGold);
                    appliedCoupon = coupon;
                }
            }
        }
    }

    const finalTotal = Math.max(0, baseWithDelivery - couponDiscount);

    // Perform fraud check for the customer's phone number
    let fraudCheckResult = null;
    try {
        if (shippingInfo?.phoneNo) {
            console.log('Performing fraud check for phone:', shippingInfo.phoneNo);
            fraudCheckResult = await performFraudCheck(shippingInfo.phoneNo.toString());
            console.log('Fraud check completed:', fraudCheckResult.riskLevel);
        }
    } catch (error) {
        console.error('Fraud check failed:', error.message);
        // Don't fail the order if fraud check fails
        fraudCheckResult = {
            phoneNumber: shippingInfo?.phoneNo?.toString(),
            totalOrders: 0,
            totalDeliveries: 0,
            totalCancellations: 0,
            successRatio: 0,
            riskLevel: 'NEW',
            recommendation: 'Fraud check failed - manual review required',
            couriers: [],
            reports: [],
            errors: [{ errorFrom: 'System', message: error.message }],
            checkedAt: new Date()
        };
    }

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice: finalTotal,
        deliveryCharge,
        paidAt: Date.now(),
        user: req.user._id,
        orderType: 'authenticated',
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        discount: goldDiscount + couponDiscount,
        fraudCheck: fraudCheckResult
    });

    // Prepare email content
    const emailSubject = "Order Placed - Your Order Has Been Placed";
    
    // Create HTML email content
    let orderItemsHtml = orderItems.map(item => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">৳${item.price}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">৳${item.price * item.quantity}</td>
        </tr>
    `).join('');

    const emailMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 30px; background-color: #0f172a; padding: 20px; border-radius: 8px 8px 0 0;">
                <img src="https://demo.eyegearsbd.com/logo.jpg" alt="EyeGears" style="height: 50px; margin-bottom: 10px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Order Placed Successfully!</h1>
            </div>
            
            <!-- Main Content -->
            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #0f172a; margin-bottom: 20px; font-size: 20px;">Hello ${req.user.name},</h2>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Thanks for placing an order. Your order is being processed. We'll shortly let you know once your it is confirmed.</p>
                
                <!-- Order Details Section -->
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Order Details</h3>
                    <p style="margin: 8px 0; color: #4a5568;"><strong style="color: #0f172a;">Order ID:</strong> ${order._id}</p>
                    <p style="margin: 8px 0; color: #4a5568;"><strong style="color: #0f172a;">Order Date:</strong> ${new Date(order.paidAt).toLocaleDateString()}</p>
                </div>
                
                <!-- Items Ordered Section -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #0f172a; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Items Ordered</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <thead>
                            <tr style="background-color: #0f172a;">
                                <th style="padding: 12px; text-align: left; color: #ffffff; font-weight: 600;">Product</th>
                                <th style="padding: 12px; text-align: center; color: #ffffff; font-weight: 600;">Qty</th>
                                <th style="padding: 12px; text-align: right; color: #ffffff; font-weight: 600;">Price</th>
                                <th style="padding: 12px; text-align: right; color: #ffffff; font-weight: 600;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItemsHtml}
                </tbody>
                        <tfoot style="background-color: #f8f9fa;">
                            ${appliedCoupon ? `<tr><td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; color: #0f172a;">Coupon (${appliedCoupon.code}):</td><td style="padding: 12px; text-align: right; font-weight: bold; color: #10b981;">-৳${couponDiscount}</td></tr>` : ''}
                            <tr><td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; color: #0f172a;">Delivery:</td>
                            <td style="padding: 12px; text-align: right; font-weight: bold; color: #10b981;">৳${shippingInfo?.deliveryArea === 'inside' ? 60 : 120}</td></tr>
                            <tr style="background-color: #0f172a;"><td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; color: #ffffff; font-size: 16px;">Grand Total:</td>
                            <td style="padding: 12px; text-align: right; font-weight: bold; color: #ffffff; font-size: 16px;">৳${finalTotal}</td></tr>
                </tfoot>
            </table>
                </div>
                
                <!-- Shipping Information Section -->
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Shipping Information</h3>
                    <p style="margin: 8px 0; color: #4a5568; line-height: 1.6;">
                ${shippingInfo.address},<br>
                ${shippingInfo.city}, ${shippingInfo.state},<br>
                        ${shippingInfo.country} - ${shippingInfo.pincode}<br>
                        <strong>Phone:</strong> ${shippingInfo.phoneNo}
                    </p>
                </div>
                
                <!-- Footer Message -->
                <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                    <p style="color: #4a5568; font-size: 16px; margin-bottom: 15px;">We'll send you another email when your order ships. If you have any questions, please contact our support team.</p>
                    <p style="color: #0f172a; font-size: 18px; font-weight: bold; margin-bottom: 20px;">Thank you for shopping with eyegears!</p>
                    <p style="font-size: 12px; color: #718096; margin: 0;">
                <strong>Note:</strong> This is an automated email. Please do not reply directly to this message.
            </p>
                </div>
            </div>
        </div>
    `;

    // Send email using nodemailer
    await sendEmail({
        email: req.user.email,
        subject: emailSubject,
        message: emailMessage
    });

    // Notify admin about the new order with fraud check information
    const adminSubject = `New Order Placed - #${order._id}`;
    const fraudRiskColor = fraudCheckResult?.riskLevel === 'HIGH' ? '#ff4444' : 
                          fraudCheckResult?.riskLevel === 'MEDIUM' ? '#ff8800' : 
                          fraudCheckResult?.riskLevel === 'LOW' ? '#00aa00' : '#888888';
    
    const adminMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 30px; background-color: #0f172a; padding: 25px; border-radius: 8px 8px 0 0;">
                <img src="https://demo.eyegearsbd.com/logo.jpg" alt="EyeGears" style="height: 60px; margin-bottom: 15px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">New Order Received</h1>
                <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 16px;">Order Management Dashboard</p>
            </div>
            
            <!-- Main Content -->
            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                
                <!-- Order Summary Card -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; color: white;">
                    <h2 style="color: #ffffff; margin: 0 0 15px 0; font-size: 24px; font-weight: bold;">Order Summary</h2>
                    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
                        <div>
                            <p style="margin: 5px 0; font-size: 14px; opacity: 0.9;">Order ID</p>
                            <p style="margin: 0; font-size: 18px; font-weight: bold;">${order._id}</p>
                        </div>
                        <div>
                            <p style="margin: 5px 0; font-size: 14px; opacity: 0.9;">Order Date</p>
                            <p style="margin: 0; font-size: 18px; font-weight: bold;">${new Date(order.paidAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p style="margin: 5px 0; font-size: 14px; opacity: 0.9;">Total Amount</p>
                            <p style="margin: 0; font-size: 18px; font-weight: bold;">৳${finalTotal}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Fraud Check Results -->
            ${fraudCheckResult ? `
                <div style="background-color: #fef3c7; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 6px solid ${fraudRiskColor};">
                    <h3 style="color: #92400e; margin-top: 0; margin-bottom: 15px; font-size: 18px; font-weight: bold;">🛡️ Fraud Check Results</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div>
                            <p style="margin: 5px 0; font-size: 14px; color: #92400e; font-weight: 600;">Risk Level</p>
                            <p style="margin: 0; font-size: 16px; font-weight: bold; color: ${fraudRiskColor};">${fraudCheckResult.riskLevel}</p>
                        </div>
                        <div>
                            <p style="margin: 5px 0; font-size: 14px; color: #92400e; font-weight: 600;">Success Ratio</p>
                            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #92400e;">${fraudCheckResult.successRatio}%</p>
                        </div>
                        <div>
                            <p style="margin: 5px 0; font-size: 14px; color: #92400e; font-weight: 600;">Total Orders</p>
                            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #92400e;">${fraudCheckResult.totalOrders}</p>
                        </div>
                        <div>
                            <p style="margin: 5px 0; font-size: 14px; color: #92400e; font-weight: 600;">Deliveries</p>
                            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #92400e;">${fraudCheckResult.totalDeliveries}</p>
                        </div>
                        <div>
                            <p style="margin: 5px 0; font-size: 14px; color: #92400e; font-weight: 600;">Cancellations</p>
                            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #92400e;">${fraudCheckResult.totalCancellations}</p>
                        </div>
                    </div>
                    <div style="margin-top: 15px; padding: 12px; background-color: #ffffff; border-radius: 8px;">
                        <p style="margin: 0; font-size: 14px; color: #92400e;"><strong>Recommendation:</strong> ${fraudCheckResult.recommendation}</p>
                    </div>
            </div>
            ` : ''}
            
                <!-- Customer Information -->
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                    <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 15px; font-size: 18px; font-weight: bold; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">👤 Customer Information</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                        <div>
                            <p style="margin: 5px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Name</p>
                            <p style="margin: 0; font-size: 16px; color: #0f172a; font-weight: bold;">${req.user.name}</p>
                        </div>
                        <div>
                            <p style="margin: 5px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Email</p>
                            <p style="margin: 0; font-size: 16px; color: #0f172a;">${req.user.email}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Order Items -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #0f172a; margin-bottom: 15px; font-size: 18px; font-weight: bold; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">🛍️ Order Items</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <thead>
                            <tr style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
                                <th style="padding: 15px; text-align: left; color: #ffffff; font-weight: 600; font-size: 14px;">Product</th>
                                <th style="padding: 15px; text-align: center; color: #ffffff; font-weight: 600; font-size: 14px;">Qty</th>
                                <th style="padding: 15px; text-align: right; color: #ffffff; font-weight: 600; font-size: 14px;">Price</th>
                                <th style="padding: 15px; text-align: right; color: #ffffff; font-weight: 600; font-size: 14px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItemsHtml}
                </tbody>
                        <tfoot style="background-color: #f8f9fa;">
                            ${appliedCoupon ? `<tr><td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; color: #0f172a; font-size: 14px;">Coupon (${appliedCoupon.code}):</td><td style="padding: 15px; text-align: right; font-weight: bold; color: #10b981; font-size: 14px;">-৳${couponDiscount}</td></tr>` : ''}
                    <tr>
                                <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; color: #0f172a; font-size: 14px;">Delivery:</td>
                                <td style="padding: 15px; text-align: right; font-weight: bold; color: #10b981; font-size: 14px;">৳${shippingInfo?.deliveryArea === 'inside' ? 60 : 120}</td>
                    </tr>
                            <tr style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
                                <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; color: #ffffff; font-size: 16px;">Grand Total:</td>
                                <td style="padding: 15px; text-align: right; font-weight: bold; color: #ffffff; font-size: 16px;">৳${finalTotal}</td>
                    </tr>
                </tfoot>
            </table>
                </div>
                
                <!-- Shipping Information -->
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                    <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 15px; font-size: 18px; font-weight: bold; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">🚚 Shipping Information</h3>
                    <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                        <p style="margin: 8px 0; color: #4a5568; line-height: 1.6; font-size: 14px;">
                            <strong style="color: #0f172a;">Address:</strong> ${shippingInfo.address}<br>
                            <strong style="color: #0f172a;">City:</strong> ${shippingInfo.city}, ${shippingInfo.state}<br>
                            <strong style="color: #0f172a;">Country:</strong> ${shippingInfo.country} - ${shippingInfo.pincode}<br>
                            <strong style="color: #0f172a;">Phone:</strong> ${shippingInfo.phoneNo}
                        </p>
                    </div>
                </div>
                
                <!-- Action Required -->
                <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; border: 2px solid #f59e0b;">
                    <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">⚡ Action Required</h3>
                    <p style="color: #92400e; margin: 0; font-size: 14px;">Please process this order and update the status in the admin dashboard.</p>
                </div>
            </div>
        </div>
    `;

    await sendEmail({
        email: "fa043541@gmail.com",
        subject: adminSubject,
        message: adminMessage
    });

    // Increment coupon usage if applied
    if (appliedCoupon) {
        appliedCoupon.usedCount = (appliedCoupon.usedCount || 0) + 1;
        await appliedCoupon.save();
    }

    res.status(201).json({
        success: true,
        order,
    });
});

// Create Guest Order (for non-logged-in users)
exports.guestOrder = asyncErrorHandler(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice: clientTotal,
        couponCode,
        guestUser,
    } = req.body;

    // Validate guest user information
    if (!guestUser || !guestUser.name || !guestUser.email || !guestUser.phone) {
        return next(new ErrorHandler("Guest user information is required", 400));
    }

    const orderExist = await Order.findOne({ paymentInfo });

    if (orderExist) {
        return next(new ErrorHandler("Order Already Placed", 400));
    }

    // Derive items total from order items
    const itemsTotal = (orderItems || []).reduce((sum, i) => sum + (Number(i.price) * Number(i.quantity)), 0);

    // Compute delivery charge from shipping info
    const deliveryCharge = shippingInfo?.deliveryArea === 'inside' ? 70 : 130;

    // Guest users don't get gold discount
    const goldDiscount = 0;
    const baseWithDelivery = Math.max(0, (itemsTotal - goldDiscount) + deliveryCharge);

    // Apply coupon if provided
    let couponDiscount = 0;
    let appliedCoupon = null;
    if (couponCode) {
        const code = String(couponCode).trim().toUpperCase();
        const coupon = await Coupon.findOne({ code, active: true });
        if (coupon && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
            if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
                const amountAfterGold = baseWithDelivery;
                if (amountAfterGold >= (coupon.minOrder || 0)) {
                    couponDiscount = coupon.type === 'percent' ? Math.round((amountAfterGold * coupon.value) / 100) : Math.min(coupon.value, amountAfterGold);
                    appliedCoupon = coupon;
                }
            }
        }
    }

    const finalTotal = Math.max(0, baseWithDelivery - couponDiscount);

    // Perform fraud check for the customer's phone number
    let fraudCheckResult = null;
    try {
        if (shippingInfo?.phoneNo) {
            console.log('Performing fraud check for guest phone:', shippingInfo.phoneNo);
            fraudCheckResult = await performFraudCheck(shippingInfo.phoneNo.toString());
            console.log('Fraud check completed:', fraudCheckResult.riskLevel);
        }
    } catch (error) {
        console.error('Fraud check failed:', error.message);
        fraudCheckResult = {
            phoneNumber: shippingInfo?.phoneNo?.toString(),
            totalOrders: 0,
            totalDeliveries: 0,
            totalCancellations: 0,
            successRatio: 0,
            riskLevel: 'NEW',
            recommendation: 'Fraud check failed - manual review required',
            couriers: [],
            reports: [],
            errors: [{ errorFrom: 'System', message: error.message }],
            checkedAt: new Date()
        };
    }

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        totalPrice: finalTotal,
        deliveryCharge,
        paidAt: Date.now(),
        user: null, // No user for guest orders
        guestUser: {
            name: guestUser.name,
            email: guestUser.email,
            phone: guestUser.phone
        },
        orderType: 'guest',
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        discount: goldDiscount + couponDiscount,
        fraudCheck: fraudCheckResult
    });

    // Prepare email content for guest
    const emailSubject = "Order placed successfully - Your Order Has Been Placed";
    
    let orderItemsHtml = orderItems.map(item => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">৳${item.price}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">৳${item.price * item.quantity}</td>
        </tr>
    `).join('');

    const emailMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 30px; background-color: #0f172a; padding: 20px; border-radius: 8px 8px 0 0;">
                <img src="https://demo.eyegearsbd.com/logo.jpg" alt="eyegears" style="height: 50px; margin-bottom: 10px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Order Placed Successfully!</h1>
            </div>
            
            <!-- Main Content -->
            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #0f172a; margin-bottom: 20px; font-size: 20px;">Hello ${guestUser.name},</h2>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">Thanks for placing an order. Your order is being processed. We'll shortly let you know once your it is confirmed.</p>
                
                <!-- Order Details Section -->
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Order Details</h3>
                    <p style="margin: 8px 0; color: #4a5568;"><strong style="color: #0f172a;">Order ID:</strong> ${order._id}</p>
                    <p style="margin: 8px 0; color: #4a5568;"><strong style="color: #0f172a;">Order Date:</strong> ${new Date(order.paidAt).toLocaleDateString()}</p>
                </div>
                
                <!-- Items Ordered Section -->
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #0f172a; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Items Ordered</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <thead>
                            <tr style="background-color: #0f172a;">
                                <th style="padding: 12px; text-align: left; color: #ffffff; font-weight: 600;">Product</th>
                                <th style="padding: 12px; text-align: center; color: #ffffff; font-weight: 600;">Qty</th>
                                <th style="padding: 12px; text-align: right; color: #ffffff; font-weight: 600;">Price</th>
                                <th style="padding: 12px; text-align: right; color: #ffffff; font-weight: 600;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItemsHtml}
                </tbody>
                        <tfoot style="background-color: #f8f9fa;">
                            ${appliedCoupon ? `<tr><td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; color: #0f172a;">Coupon (${appliedCoupon.code}):</td><td style="padding: 12px; text-align: right; font-weight: bold; color: #10b981;">-৳${couponDiscount}</td></tr>` : ''}
                            <tr>
                                <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; color: #0f172a;">Delivery:</td>
                                <td style="padding: 12px; text-align: right; font-weight: bold; color: #10b981;">৳${deliveryCharge}</td>
                            </tr>
                            <tr style="background-color: #0f172a;">
                                <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; color: #ffffff; font-size: 16px;">Grand Total:</td>
                                <td style="padding: 12px; text-align: right; font-weight: bold; color: #ffffff; font-size: 16px;">৳${finalTotal}</td>
                            </tr>
                </tfoot>
            </table>
                </div>
                
                <!-- Shipping Information Section -->
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Shipping Information</h3>
                    <p style="margin: 8px 0; color: #4a5568; line-height: 1.6;">
                ${shippingInfo.address},<br>
                ${shippingInfo.city}, ${shippingInfo.state},<br>
                        ${shippingInfo.country} - ${shippingInfo.pincode}<br>
                        <strong>Phone:</strong> ${shippingInfo.phoneNo}
                    </p>
                </div>
                
                <!-- Footer Message -->
                <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
                    <p style="color: #4a5568; font-size: 16px; margin-bottom: 15px;">We'll send you another email when your order ships. If you have any questions, please contact our support team.</p>
                    <p style="color: #0f172a; font-size: 18px; font-weight: bold; margin-bottom: 20px;">Thank you for shopping with EyeGears!</p>
                    <p style="font-size: 12px; color: #718096; margin: 0;">
                <strong>Note:</strong> This is an automated email. Please do not reply directly to this message.
            </p>
                </div>
            </div>
        </div>
    `;

    // Send email to guest user
    await sendEmail({
        email: guestUser.email,
        subject: emailSubject,
        message: emailMessage
    });

    // Notify admin about the guest order
    const adminSubject = `New Guest Order Placed - #${order._id}`;
    const fraudRiskColor = fraudCheckResult?.riskLevel === 'HIGH' ? '#ff4444' : 
                          fraudCheckResult?.riskLevel === 'MEDIUM' ? '#ff8800' : 
                          fraudCheckResult?.riskLevel === 'LOW' ? '#00aa00' : '#888888';
    
    const adminMessage = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 30px; background-color: #0f172a; padding: 25px; border-radius: 8px 8px 0 0;">
                <img src="https://demo.eyegearsbd.com/logo.jpg" alt="EyeGears" style="height: 60px; margin-bottom: 15px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">New Guest Order Received</h1>
                <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 16px;">Order Management Dashboard</p>
            </div>
            
            <!-- Main Content -->
            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <h2 style="color: #0f172a; margin-bottom: 20px; font-size: 20px;">Guest Order Details</h2>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.paidAt).toLocaleString()}</p>
            <p><strong>Order Type:</strong> Guest Order</p>
            
            ${fraudCheckResult ? `
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid ${fraudRiskColor};">
                <h3 style="color: #444; margin-top: 0;">Fraud Check Results</h3>
                <p><strong>Risk Level:</strong> <span style="color: ${fraudRiskColor}; font-weight: bold;">${fraudCheckResult.riskLevel}</span></p>
                <p><strong>Success Ratio:</strong> ${fraudCheckResult.successRatio}%</p>
                <p><strong>Total Orders:</strong> ${fraudCheckResult.totalOrders}</p>
                <p><strong>Total Deliveries:</strong> ${fraudCheckResult.totalDeliveries}</p>
                <p><strong>Total Cancellations:</strong> ${fraudCheckResult.totalCancellations}</p>
                <p><strong>Recommendation:</strong> ${fraudCheckResult.recommendation}</p>
            </div>
            ` : ''}
            
            <h3 style="color: #444; margin-top: 20px;">Guest Customer</h3>
            <p><strong>Name:</strong> ${guestUser.name}<br/>
            <strong>Email:</strong> ${guestUser.email}<br/>
            <strong>Phone:</strong> ${guestUser.phone}</p>
            
            <h3 style="color: #444; margin-top: 20px;">Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
                        <th style="padding: 8px; text-align: center; border-bottom: 1px solid #ddd;">Qty</th>
                        <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Price</th>
                        <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ddd;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderItemsHtml}
                </tbody>
                <tfoot>
                    ${appliedCoupon ? `<tr><td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Coupon (${appliedCoupon.code}):</td><td style="padding: 8px; text-align: right; font-weight: bold;">-৳${couponDiscount}</td></tr>` : ''}
                    <tr>
                        <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Delivery:</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold;">৳${deliveryCharge}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Grand Total:</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold;">৳${finalTotal}</td>
                    </tr>
                </tfoot>
            </table>
            <h3 style="color: #444; margin-top: 20px;">Shipping</h3>
            <p>
                ${shippingInfo.address},<br>
                ${shippingInfo.city}, ${shippingInfo.state},<br>
                ${shippingInfo.country} - ${shippingInfo.pincode}<br>
                Phone: ${shippingInfo.phoneNo}
            </p>
            </div>
        </div>
    `;

    await sendEmail({
        email: "fa043541@gmail.com",
        subject: adminSubject,
        message: adminMessage
    });

    // Increment coupon usage if applied
    if (appliedCoupon) {
        appliedCoupon.usedCount = (appliedCoupon.usedCount || 0) + 1;
        await appliedCoupon.save();
    }

    res.status(201).json({
        success: true,
        order,
    });
});

// Get Guest Order by Email and Phone
exports.getGuestOrder = asyncErrorHandler(async (req, res, next) => {
    const { email, phone } = req.body;

    if (!email || !phone) {
        return next(new ErrorHandler("Email and phone are required", 400));
    }

    const order = await Order.findOne({
        'guestUser.email': email,
        'guestUser.phone': phone,
        orderType: 'guest'
    });

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

// Get Single Order Details
exports.getSingleOrderDetails = asyncErrorHandler(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});


// Get Logged In User Orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id });

    if (!orders) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    res.status(200).json({
        success: true,
        orders,
    });
});

// Spending summary for current user
exports.myOrdersSummary = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;

    const now = new Date();
    const startOfYearWindow = new Date(now);
    startOfYearWindow.setFullYear(startOfYearWindow.getFullYear() - 1);

    // Total lifetime spend
    const lifetimeAgg = await Order.aggregate([
        { $match: { user: userId } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const lifetimeTotal = lifetimeAgg.length ? lifetimeAgg[0].total : 0;

    // Total spend in last 12 months and monthly buckets
    const lastYearAgg = await Order.aggregate([
        { $match: { user: userId, paidAt: { $gte: startOfYearWindow } } },
        { $group: {
            _id: { year: { $year: "$paidAt" }, month: { $month: "$paidAt" } },
            total: { $sum: "$totalPrice" }
        }},
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const lastYearTotal = lastYearAgg.reduce((sum, m) => sum + m.total, 0);
    const isGold = lastYearTotal >= 10000;
    const remainingToGold = isGold ? 0 : Math.max(0, 10000 - lastYearTotal);

    // Build the last 12 months series with zero-filled months
    const months = [];
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const y = d.getFullYear();
        const m = d.getMonth() + 1; // 1-based
        const found = lastYearAgg.find(x => x._id.year === y && x._id.month === m);
        months.push({
            label: `${monthNames[m-1]} ${String(y).slice(2)}`,
            year: y,
            month: m,
            total: found ? found.total : 0,
        });
    }

    res.status(200).json({
        success: true,
        summary: {
            lifetimeTotal,
            lastYearTotal,
            isGold,
            remainingToGold,
            months,
        }
    });
});


// Get All Orders ---ADMIN
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {

    const orders = await Order.find().populate("user", "name email");

    if (!orders) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        orders,
        totalAmount,
    });
});

// Update Order Status ---ADMIN
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("Order Not Found", 404));
    }

    // Handle fraud check updates
    if (req.body.fraudCheck) {
        order.fraudCheck = req.body.fraudCheck;
        await order.save({ validateBeforeSave: false });
        
        return res.status(200).json({
            success: true,
            message: "Fraud check data updated successfully"
        });
    }

    // Handle status updates
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Already Delivered", 400));
    }

    const status = req.body.status;
    let emailSubject = "";
    let emailMessage = "";
    // Resolve recipient and display name for both authenticated and guest orders
    const recipientName = order.user ? order.user.name : (order.guestUser && order.guestUser.name) ? order.guestUser.name : "Customer";
    const recipientEmail = order.user ? order.user.email : (order.guestUser && order.guestUser.email) ? order.guestUser.email : null;

    if (status === "Shipped") {
        order.shippedAt = Date.now();
        order.orderItems.forEach(async (i) => {
            await updateStock(i.product, i.quantity);
        });
        emailSubject = "Your Order Has Been Shipped";
        emailMessage = `
            <h2>Your Order #${order._id} Has Been Shipped</h2>
            <p>Hello ${recipientName},</p>
            <p>Your order has been shipped and is on its way to you.</p>
            <p>Expected delivery date: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            <p>Thank you for shopping with us!</p>
        `;
    }

    if (status === "Delivered") {
        order.deliveredAt = Date.now();
        emailSubject = "Your Order Has Been Delivered";
        emailMessage = `
            <h2>Your Order #${order._id} Has Been Delivered</h2>
            <p>Hello ${recipientName},</p>
            <p>Your order has been successfully delivered.</p>
            <p>We hope you're satisfied with your purchase. If you have any questions, please contact our support team.</p>
            <p>Thank you for shopping with us!</p>
        `;
    }

    order.orderStatus = status;
    await order.save({ validateBeforeSave: false });

    // Send email notification (only if we have an email address)
    if (emailSubject && emailMessage && recipientEmail) {
        await sendEmail({
            email: recipientEmail,
            subject: emailSubject,
            message: emailMessage
        });
    }

    res.status(200).json({
        success: true
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

// Delete Order ---ADMIN
exports.deleteOrder = async (req, res, next) => {
    try {
        console.log('Delete order called with ID:', req.params.id);

        const order = await Order.findById(req.params.id);
        console.log('Found order:', order ? 'Yes' : 'No');

        if (!order) {
            return next(new ErrorHandler("Order Not Found", 404));
        }

        console.log('Attempting to delete order...');
        await Order.findByIdAndDelete(req.params.id);
        console.log('Order deleted successfully');

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error('Error in deleteOrder:', error);
        return next(new ErrorHandler(error.message, 500));
    }
};