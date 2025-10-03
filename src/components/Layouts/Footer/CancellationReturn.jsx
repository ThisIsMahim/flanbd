import React from "react";
import { ArrowPathIcon, ShieldCheckIcon, TruckIcon, ClockIcon } from "@heroicons/react/24/outline";

const CancellationReturn = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
    <div className="max-w-6xl mx-auto px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-6 shadow-2xl">
          <ArrowPathIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4">
          Return & Refund Policy
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mb-6"></div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      At eyegears, we want you to be completely satisfied with your purchase. If you are not happy with your order for any reason, our Return & Refund Policy outlines your options for returning products and requesting refunds or exchanges.
    </p>
      </div>

      {/* Main Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="grid gap-8">
            {/* Return Eligibility */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Return Eligibility</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <div className="bg-white/60 rounded-xl p-4">
                  <p><strong>Time Frame:</strong> You may return products in the presence of the rider and pay delivery charge.</p>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <p><strong>Condition:</strong> To be eligible for a return, the item must be unused, in the same condition that you received it, and in its original packaging.</p>
                </div>
              </div>
            </div>

            {/* Return Process */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <TruckIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Return Process</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                {/* Intentionally keeping design section with no extra text as per user's supplied content */}
              </div>
            </div>

            {/* Refunds */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Refunds</h2>
              </div>
              <div className="bg-white/60 rounded-xl p-4 text-gray-700">
                <p><strong>Partial return:</strong> In certain situations, you may order more than one product and can keep some product and return the others.</p>
              </div>
            </div>

            {/* Exchanges */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <ArrowPathIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Exchanges</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <div className="bg-white/60 rounded-xl p-4">
                  <p><strong>Defective or Damaged Items:</strong> We only replace items if they are defective or damaged. If you need to exchange it for the same item, contact us with details and a photo of the damage within 24 hours.</p>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <p><strong>Exchange Process:</strong> Once your exchange is approved, we will ship the replacement item to you at no additional cost. If the item is no longer available, we will offer you a refund or alternative product.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CancellationReturn;
