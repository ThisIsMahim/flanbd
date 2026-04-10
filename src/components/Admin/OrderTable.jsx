import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';
import Actions from './Actions';
import { getAllOrders, updateOrder, deleteOrder } from '../../actions/orderAction';
import { clearErrors } from '../../actions/orderAction';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';
import { formatDate } from '../../utils/functions';

const OrderTable = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showFraudDetails, setShowFraudDetails] = useState(false);
    const [recheckingOrder, setRecheckingOrder] = useState(null);

    const { orders, error } = useSelector((state) => state.allOrders);
    const { loading, isDeleted, error: deleteError } = useSelector((state) => state.order);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (deleteError) {
            enqueueSnackbar(deleteError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isDeleted) {
            enqueueSnackbar("Deleted Successfully", { variant: "success" });
            dispatch({ type: DELETE_ORDER_RESET });
        }
        dispatch(getAllOrders());
    }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id));
    }

    const handleRecheckFraud = async (orderId, phoneNumber) => {
        setRecheckingOrder(orderId);
        try {
            const response = await axios.post(`/api/v1/fraud-checker/order/${orderId}/check`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            const data = response.data;

            if (data.status === 'success') {
                enqueueSnackbar('Fraud check completed successfully', { variant: 'success' });

                // Refresh orders list
                dispatch(getAllOrders());
            } else {
                enqueueSnackbar(data.message || 'Fraud check failed', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Error performing fraud check', { variant: 'error' });
        } finally {
            setRecheckingOrder(null);
        }
    };

    const handleBulkRecheck = async () => {
        setRecheckingOrder('bulk'); // Indicate bulk rechecking
        try {
            const response = await axios.post(`/api/v1/fraud-checker/bulk-check`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            const data = response.data;

            if (data.status === 'success') {
                enqueueSnackbar('Bulk fraud check completed successfully', { variant: 'success' });

                // Refresh orders list
                dispatch(getAllOrders());
            } else {
                enqueueSnackbar(data.message || 'Bulk fraud check failed', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Error performing bulk fraud check', { variant: 'error' });
        } finally {
            setRecheckingOrder(null);
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

    const handleFraudDetailsClick = (order) => {
        setSelectedOrder(order);
        setShowFraudDetails(true);
    };

    const columns = [
        {
            field: "customer",
            headerName: "Customer",
            minWidth: 180,
            flex: 0.5,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <div className="flex flex-col leading-tight py-2">
                    <span className="font-bold text-gray-900 text-xs">{params.row.customerName}</span>
                    <span className="text-[10px] text-gray-500">{params.row.customerEmail}</span>
                    <span className="text-[10px] text-[var(--accent)] font-medium">{params.row.customerPhone}</span>
                </div>
            )
        },
        {
            field: "id",
            headerName: "Order ID",
            minWidth: 160,
            flex: 0.3,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <div className="font-mono text-[10px] text-gray-500">
                    #{params.row.id.slice(-8).toUpperCase()}
                </div>
            )
        },
        {
            field: "status",
            headerName: "Status",
            minWidth: 150,
            flex: 0.2,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                return (
                    <>
                        {
                            params.row.status === "Delivered" ? (
                                <span className="text-sm bg-green-100 p-1 px-2 font-medium rounded-full text-green-800">{params.row.status}</span>
                            ) : params.row.status === "Shipped" ? (
                                <span className="text-sm bg-yellow-100 p-1 px-2 font-medium rounded-full text-yellow-800">{params.row.status}</span>
                            ) : (
                                <span className="text-sm bg-purple-100 p-1 px-2 font-medium rounded-full text-purple-800">{params.row.status}</span>
                            )
                        }
                    </>
                )
            },
        },
        {
            field: "fraudRisk",
            headerName: "Fraud Check",
            minWidth: 150,
            flex: 0.3,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                const fraudCheck = params.row.fraudCheck;
                if (!fraudCheck) {
                    return <span className="text-[10px] bg-gray-100 p-1 px-2 font-medium rounded text-gray-400 italic">Not Checked</span>;
                }
                return (
                    <div className="flex flex-col leading-tight border-l-2 pl-2" style={{ borderColor: fraudCheck.riskLevel === 'HIGH' ? '#ef4444' : fraudCheck.riskLevel === 'MEDIUM' ? '#f59e0b' : '#10b981' }}>
                        <span className={`text-[10px] font-bold ${fraudCheck.riskLevel === 'HIGH' ? 'text-red-600' : fraudCheck.riskLevel === 'MEDIUM' ? 'text-amber-600' : 'text-green-600'}`}>
                            {fraudCheck.riskLevel} RISK
                        </span>
                        <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">SR: {fraudCheck.successRatio}%</span>
                    </div>
                );
            },
        },
        {
            field: "itemsQty",
            headerName: "Qty",
            type: "number",
            minWidth: 60,
            flex: 0.1,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <div className="font-bold text-gray-600">
                    {params.row.itemsQty}
                </div>
            )
        },
        {
            field: "payment",
            headerName: "Payment",
            minWidth: 160,
            flex: 0.4,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                const isCOD = params.row.paymentMethod?.toLowerCase() === 'cod' || params.row.paymentMethod?.toLowerCase() === 'pending';
                return (
                    <div className="flex flex-col leading-tight py-1">
                        <span className={`font-bold text-xs uppercase tracking-wider ${isCOD ? 'text-gray-500' : 'text-purple-700'}`}>
                            {params.row.paymentMethod}
                        </span>
                        {!isCOD && (
                            <div className="flex flex-col mt-0.5">
                                {params.row.paymentPhone && (
                                    <span className="text-[10px] font-bold text-gray-800">
                                        Num: {params.row.paymentPhone}
                                    </span>
                                )}
                                {params.row.paymentId && (
                                    <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-1 rounded border border-purple-100 mt-0.5 w-fit">
                                        TX: {params.row.paymentId}
                                    </span>
                                )}
                            </div>
                        )}
                        {isCOD && (
                            <span className="text-[9px] text-gray-400 italic">No Transaction</span>
                        )}
                    </div>
                );
            }
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            minWidth: 120,
            flex: 0.2,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                return (
                    <span className="font-bold text-gray-900 text-sm">৳{params.row.amount.toLocaleString()}</span>
                );
            },
        },
        {
            field: "deliveryArea",
            headerName: "Area",
            minWidth: 100,
            flex: 0.2,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter bg-blue-50 px-1 rounded">{params.row.deliveryArea === 'inside' ? 'Inside' : 'Outside'}</span>
            )
        },
        {
            field: "orderOn",
            headerName: "Date",
            minWidth: 120,
            flex: 0.3,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <div className="text-[11px] text-gray-600 font-medium">
                    {params.row.orderOn}
                </div>
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 200,
            flex: 0.4,
            type: "number",
            sortable: false,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                const phoneNumber = params.row.phoneNumber;
                const isRechecking = recheckingOrder === params.row.id;

                return (
                    <div className="flex space-x-2">
                        <Actions editRoute={"order"} deleteHandler={deleteOrderHandler} id={params.row.id} />

                        {params.row.fraudCheck ? (
                            <button
                                onClick={() => handleFraudDetailsClick(params.row)}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                            >
                                Fraud Details
                            </button>
                        ) : (
                            <button
                                onClick={() => handleRecheckFraud(params.row.id, phoneNumber)}
                                disabled={isRechecking || !phoneNumber}
                                className={`text-xs px-2 py-1 rounded ${isRechecking || !phoneNumber
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                            >
                                {isRechecking ? 'Checking...' : 'Recheck'}
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    const rows = [];

    orders && orders.forEach((order) => {
        rows.unshift({
            id: order._id,
            customerName: order.user ? order.user.name : order.guestUser?.name,
            customerEmail: order.user ? order.user.email : order.guestUser?.email,
            customerPhone: order.shippingInfo?.phoneNo || order.guestUser?.phone,
            itemsQty: order.orderItems.length,
            amount: order.totalPrice,
            deliveryArea: order.shippingInfo?.deliveryArea,
            paymentMethod: order.paymentInfo?.method || "COD",
            paymentId: order.paymentInfo?.transactionId || order.paymentInfo?.id,
            paymentPhone: order.paymentInfo?.phoneNumber,
            orderOn: formatDate(order.createdAt),
            status: order.orderStatus,
            fraudCheck: order.fraudCheck,
            phoneNumber: order.shippingInfo?.phoneNo,
        });
    });

    return (
        <>
            <MetaData title="Admin Orders | EyeGears" />

            {loading && <BackdropLoader />}

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-medium uppercase text-gray-800">Orders</h1>
                    <button
                        onClick={handleBulkRecheck}
                        disabled={recheckingOrder}
                        className={`px-4 py-2 rounded-lg font-medium ${recheckingOrder
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                    >
                        {recheckingOrder ? 'Checking...' : 'Recheck All Orders'}
                    </button>
                </div>
                <div className="bg-white rounded-xl shadow-lg w-full overflow-hidden" style={{ height: 470 }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectIconOnClick
                        sx={{
                            boxShadow: 0,
                            border: 0,
                            borderColor: 'primary.light',
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main',
                            },
                            '& .super-app-theme--header': {
                                backgroundColor: 'rgba(138, 57, 225, 0.08)',
                                fontWeight: 'bold',
                                color: '#6b21a8'
                            },
                        }}
                    />
                </div>
            </div>

            {/* Fraud Details Modal */}
            {showFraudDetails && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Fraud Check Details</h2>
                            <button
                                onClick={() => setShowFraudDetails(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700">Order ID</h3>
                                    <p className="text-gray-600">{selectedOrder.id}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Risk Level</h3>
                                    <span className={`text-sm p-1 px-2 font-medium rounded-full ${getRiskLevelColor(selectedOrder.fraudCheck.riskLevel)}`}>
                                        {selectedOrder.fraudCheck.riskLevel}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700">Success Ratio</h3>
                                    <p className={`text-lg font-bold ${selectedOrder.fraudCheck.successRatio >= 70 ? 'text-green-600' :
                                        selectedOrder.fraudCheck.successRatio >= 40 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {selectedOrder.fraudCheck.successRatio}%
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Total Orders</h3>
                                    <p className="text-lg font-bold text-gray-800">{selectedOrder.fraudCheck.totalOrders}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-700">Total Deliveries</h3>
                                    <p className="text-lg font-bold text-green-600">{selectedOrder.fraudCheck.totalDeliveries}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Recommendation</h3>
                                <p className="text-gray-600 bg-gray-50 p-3 rounded">{selectedOrder.fraudCheck.recommendation}</p>
                            </div>

                            {selectedOrder.fraudCheck.couriers && selectedOrder.fraudCheck.couriers.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Courier Details</h3>
                                    <div className="space-y-2">
                                        {selectedOrder.fraudCheck.couriers.map((courier, index) => (
                                            <div key={index} className="bg-gray-50 p-3 rounded">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <img src={courier.logo} alt={courier.name} className="w-6 h-6 rounded" />
                                                        <span className="font-medium">{courier.name}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        {courier.deliveryRate}% success rate
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                                                    <div>Orders: {courier.orders}</div>
                                                    <div>Delivered: {courier.deliveries}</div>
                                                    <div>Cancelled: {courier.cancellations}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedOrder.fraudCheck.reports && selectedOrder.fraudCheck.reports.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Reports</h3>
                                    <div className="space-y-2">
                                        {selectedOrder.fraudCheck.reports.map((report, index) => (
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

                            {selectedOrder.fraudCheck.errors && selectedOrder.fraudCheck.errors.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">Errors</h3>
                                    <div className="space-y-2">
                                        {selectedOrder.fraudCheck.errors.map((error, index) => (
                                            <div key={index} className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                                                <span className="font-medium text-yellow-800">{error.errorFrom}</span>
                                                <p className="text-yellow-700 text-sm mt-1">{error.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderTable;
