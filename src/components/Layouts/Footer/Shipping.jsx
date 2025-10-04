import React from "react";
import { TruckIcon, MapPinIcon, ClockIcon, CreditCardIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const ShippingPolicies = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
    <div className="max-w-6xl mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-6 shadow-2xl">
          <TruckIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4">
          Shipping Policy
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6"></div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          At FlanBD, we strive to provide our customers with prompt and reliable shipping services. This Shipping Policy outlines the terms and conditions regarding the shipping and delivery of products purchased from our website.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="grid gap-8">
            {/* Shipping Destinations */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <MapPinIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Shipping Destinations</h2>
              </div>
              <div className="bg-white/60 rounded-xl p-4 text-gray-700">
                <p><strong>Domestic Shipping:</strong> We offer shipping to addresses located anywhere in Bangladesh.</p>
              </div>
            </div>

            {/* Order Processing */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Order Processing</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <div className="bg-white/60 rounded-xl p-4">
                  <p><strong>Processing Time:</strong> Orders are typically processed and shipped within 1-2 business days inside Dhaka and 2-3 days outside Dhaka after order is confirmed.</p>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <p><strong>Order Confirmation:</strong> Once your order is placed, you will receive an order confirmation email with your order details. You will receive a separate email with tracking information once your order has been shipped.</p>
                </div>
              </div>
            </div>

            {/* Shipping Methods and Costs */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <CreditCardIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Shipping Methods and Costs</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <div className="bg-white/60 rounded-xl p-4">
                  <p><strong>Express Shipping:</strong> For faster delivery, we offer express shipping options at an additional cost. Delivery times for express shipping vary by location and will be provided during checkout.</p>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <p><strong>Shipping Costs:</strong> Inside Dhaka: 70/-, Outside Dhaka: 130/-.</p>
                </div>
              </div>
            </div>

            {/* Delivery Timeframes */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <TruckIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Delivery Timeframes</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <div className="bg-white/60 rounded-xl p-4">
                  <p><strong>Estimated Delivery:</strong> Delivery times are estimated and may vary depending on factors such as shipping method, destination, and customs clearance. While we strive to deliver orders within the estimated timeframe, delays may occur due to unforeseen circumstances.</p>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <p><strong>Order Tracking:</strong> Once your order is shipped, you will receive a tracking number via email. You can use this number to track the status of your shipment on the carrier's website.</p>
                </div>
              </div>
            </div>

            {/* Order Changes and Cancellations */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Order Changes and Cancellations</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <div className="bg-white/60 rounded-xl p-4">
                  <p><strong>Order Changes:</strong> If you need to change your shipping address or modify your order after it has been placed, please contact us as soon as possible. We will do our best to accommodate your request, but changes cannot be guaranteed once the order has been processed.</p>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <p><strong>Order Cancellations:</strong> You may cancel your order before it is shipped by contacting our customer service team. Once the order has been shipped, it cannot be canceled.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ShippingPolicies;
