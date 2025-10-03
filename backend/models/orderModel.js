const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        phoneNo: {
            type: Number,
            required: true
        },
        deliveryArea: {
            type: String,
            enum: ["inside", "outside"],
        },
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true
            },
        },
    ],
    // User can be either authenticated user or guest
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: false // Made optional for guest orders
    },
    // Guest user information for non-logged-in users
    guestUser: {
        name: {
            type: String,
            required: function() { return !this.user; } // Required if no user
        },
        email: {
            type: String,
            required: function() { return !this.user; } // Required if no user
        },
        phone: {
            type: String,
            required: function() { return !this.user; } // Required if no user
        }
    },
    // Order type to distinguish between guest and authenticated orders
    orderType: {
        type: String,
        enum: ['guest', 'authenticated'],
        default: 'authenticated'
    },
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
    },
    paidAt: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    deliveryCharge: {
        type: Number,
        required: true,
        default: 0
    },
    couponCode: {
        type: String,
    },
    discount: {
        type: Number,
        default: 0,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },
    deliveredAt: Date,
    shippedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Fraud Check Fields
    fraudCheck: {
        phoneNumber: String,
        totalOrders: {
            type: Number,
            default: 0
        },
        totalDeliveries: {
            type: Number,
            default: 0
        },
        totalCancellations: {
            type: Number,
            default: 0
        },
        successRatio: {
            type: Number,
            default: 0
        },
        riskLevel: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'NEW'],
            default: 'NEW'
        },
        recommendation: String,
        couriers: [{
            name: String,
            logo: String,
            orders: Number,
            deliveries: Number,
            cancellations: Number,
            deliveryRate: Number
        }],
        reports: [{
            reportFrom: String,
            comment: String,
            date: String
        }],
        errors: [{
            errorFrom: String,
            message: String
        }],
        checkedAt: {
            type: Date,
            default: Date.now
        }
    }
});

module.exports = mongoose.model("Order", orderSchema);