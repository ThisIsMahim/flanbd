import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';

const FraudCheckerDashboard = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fraudResult, setFraudResult] = useState(null);
    const [stats, setStats] = useState(null);
    const [recentChecks, setRecentChecks] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchRecentChecks();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/v1/fraud-checker/stats', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.status === 'success') {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchRecentChecks = async () => {
        try {
            const response = await fetch('/api/v1/fraud-checker/recent?limit=5', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.status === 'success') {
                setRecentChecks(data.data.recentChecks);
            }
        } catch (error) {
            console.error('Error fetching recent checks:', error);
        }
    };

    const performFraudCheck = async () => {
        if (!phoneNumber) {
            enqueueSnackbar('Please enter a phone number', { variant: 'error' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/v1/fraud-checker/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ phoneNumber })
            });

            const data = await response.json();
            if (data.status === 'success') {
                setFraudResult(data.data);
                enqueueSnackbar('Fraud check completed successfully', { variant: 'success' });
                fetchStats();
                fetchRecentChecks();
            } else {
                enqueueSnackbar(data.message || 'Fraud check failed', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Error performing fraud check', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getRiskLevelColor = (riskLevel) => {
        switch (riskLevel) {
            case 'HIGH':
                return 'bg-red-100 text-red-800';
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-800';
            case 'LOW':
                return 'bg-green-100 text-green-800';
            case 'NEW':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <MetaData title="Fraud Checker Dashboard | EyeGears" />
            {loading && <BackdropLoader />}

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                <h1 className="text-xl font-medium uppercase mb-6 text-gray-800">Fraud Checker Dashboard</h1>

                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders Checked</h3>
                            <p className="text-3xl font-bold text-blue-600">{stats.totalOrdersChecked}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">High Risk Orders</h3>
                            <p className="text-3xl font-bold text-red-600">{stats.highRiskOrders}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Medium Risk Orders</h3>
                            <p className="text-3xl font-bold text-red-600">{stats.mediumRiskOrders}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Low Risk Orders</h3>
                            <p className="text-3xl font-bold text-green-600">{stats.lowRiskOrders}</p>
                        </div>
                    </div>
                )}

                {/* Manual Fraud Check */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Manual Fraud Check</h2>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Enter phone number (e.g., 01712345678)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                            onClick={performFraudCheck}
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                        >
                            {loading ? 'Checking...' : 'Check Fraud'}
                        </button>
                    </div>
                </div>

                {/* Fraud Check Result */}
                {fraudResult && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Fraud Check Result</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="text-center">
                                <h3 className="text-sm font-medium text-gray-600">Risk Level</h3>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(fraudResult.riskLevel)}`}>
                                    {fraudResult.riskLevel}
                                </span>
                            </div>
                            <div className="text-center">
                                <h3 className="text-sm font-medium text-gray-600">Success Ratio</h3>
                                <p className={`text-2xl font-bold mt-1 ${
                                    fraudResult.successRatio >= 70 ? 'text-green-600' : 
                                    fraudResult.successRatio >= 40 ? 'text-red-600' : 'text-red-600'
                                }`}>
                                    {fraudResult.successRatio}%
                                </p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{fraudResult.totalOrders}</p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-sm font-medium text-gray-600">Total Deliveries</h3>
                                <p className="text-2xl font-bold text-green-600 mt-1">{fraudResult.totalDeliveries}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-600 mb-2">Recommendation</h3>
                            <p className="text-gray-800 bg-gray-50 p-3 rounded">{fraudResult.recommendation}</p>
                        </div>

                        {fraudResult.couriers && fraudResult.couriers.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Courier Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {fraudResult.couriers.map((courier, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <img src={courier.logo} alt={courier.name} className="w-6 h-6 rounded" />
                                                    <span className="font-medium">{courier.name}</span>
                                                </div>
                                                <span className="text-sm text-gray-600">
                                                    {courier.deliveryRate}% success
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-sm">
                                                <div>Orders: {courier.orders}</div>
                                                <div>Delivered: {courier.deliveries}</div>
                                                <div>Cancelled: {courier.cancellations}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {fraudResult.reports && fraudResult.reports.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Reports</h3>
                                <div className="space-y-2">
                                    {fraudResult.reports.map((report, index) => (
                                        <div key={index} className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                                            <div className="flex justify-between items-start">
                                                <span className="font-medium text-red-800">{report.reportFrom}</span>
                                                <span className="text-xs text-gray-500">{report.date}</span>
                                            </div>
                                            <p className="text-red-700 text-sm mt-1">{report.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Recent Fraud Checks */}
                {recentChecks.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Fraud Checks</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Ratio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentChecks.map((check, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {check.orderId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {check.customer?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(check.fraudCheck?.riskLevel)}`}>
                                                    {check.fraudCheck?.riskLevel || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {check.fraudCheck?.successRatio || 0}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(check.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default FraudCheckerDashboard;

