const mongoose = require('mongoose');
const Order = require('../models/orderModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eyegears', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function addFraudCheckToExistingOrders() {
    try {
        console.log('Starting to add fraud check data to existing orders...');
        
        // Find orders without fraud check data
        const ordersWithoutFraudCheck = await Order.find({
            $or: [
                { fraudCheck: { $exists: false } },
                { fraudCheck: null }
            ]
        });
        
        console.log(`Found ${ordersWithoutFraudCheck.length} orders without fraud check data`);
        
        // Add default fraud check data to each order
        for (const order of ordersWithoutFraudCheck) {
            const phoneNumber = order.shippingInfo?.phoneNo?.toString();
            
            const defaultFraudCheck = {
                phoneNumber: phoneNumber || '',
                totalOrders: 0,
                totalDeliveries: 0,
                totalCancellations: 0,
                successRatio: 0,
                riskLevel: 'NEW',
                recommendation: 'New customer! No previous order history found.',
                couriers: [],
                reports: [],
                errors: [],
                checkedAt: new Date()
            };
            
            order.fraudCheck = defaultFraudCheck;
            await order.save();
            
            console.log(`Added fraud check data to order ${order._id}`);
        }
        
        console.log('Successfully added fraud check data to all existing orders');
        
    } catch (error) {
        console.error('Error adding fraud check data:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the script
addFraudCheckToExistingOrders();
