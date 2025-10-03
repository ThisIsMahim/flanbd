import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { clearErrors, getOrderDetails, updateOrder } from '../../actions/orderAction';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import { formatDate } from '../../utils/functions';
import MetaData from '../Layouts/MetaData';
import TrackStepper from '../Order/TrackStepper';
import Loading from './Loading';

const UpdateOrder = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();

    const [status, setStatus] = useState("");

    const { order, error, loading } = useSelector((state) => state.orderDetails);
    const { isUpdated, error: updateError } = useSelector((state) => state.order);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (updateError) {
            enqueueSnackbar(updateError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isUpdated) {
            enqueueSnackbar("Order Updated Successfully", { variant: "success" });
            dispatch({ type: UPDATE_ORDER_RESET });
        }
        dispatch(getOrderDetails(params.id));
    }, [dispatch, error, params.id, isUpdated, updateError, enqueueSnackbar]);

    const updateOrderSubmitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("status", status);
        dispatch(updateOrder(params.id, formData));
    }

    return (
        <>
            <MetaData title="Admin: Update Order | EyeGears" />

            {loading ? <Loading /> : (
                <>
                    {order && order.shippingInfo && (
                        <div className="flex flex-col gap-4 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                            <Link to="/admin/orders" className="flex items-center gap-1 font-medium text-purple-700 hover:text-purple-900 transition-colors duration-200 w-max">
                                <ArrowBackIosIcon sx={{ fontSize: "18px" }} />
                                <span>Back to Orders</span>
                            </Link>

                            <div className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg min-w-full overflow-hidden">
                                <div className="sm:w-1/2 border-r border-gray-100">
                                    <div className="flex flex-col gap-3 my-8 mx-10">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-lg text-gray-800">Delivery Address</h3>
                                            {order.orderType === 'guest' && (
                                                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                                    Guest Order
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-medium text-gray-700">
                                            {order.user ? order.user.name : order.guestUser?.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">{`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pincode}`}</p>
                                        <div className="flex gap-2 text-sm">
                                            <p className="font-medium text-gray-700">Email</p>
                                            <p className="text-gray-600">
                                                {order.user ? order.user.email : order.guestUser?.email}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 text-sm">
                                            <p className="font-medium text-gray-700">Phone Number</p>
                                            <p className="text-gray-600">{order.shippingInfo.phoneNo}</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={updateOrderSubmitHandler} className="flex flex-col gap-3 p-8">
                                    <h3 className="font-medium text-lg text-gray-800">Update Status</h3>
                                    <div className="flex gap-2">
                                        <p className="text-sm font-medium text-gray-700">Current Status:</p>
                                        <p className="text-sm text-gray-600">
                                            {order.orderStatus === "Shipped" && (`Shipped on ${formatDate(order.shippedAt)}`)}
                                            {order.orderStatus === "Processing" && (`Ordered on ${formatDate(order.createdAt)}`)}
                                            {order.orderStatus === "Delivered" && (`Delivered on ${formatDate(order.deliveredAt)}`)}
                                        </p>
                                    </div>
                                    <FormControl fullWidth sx={{ 
                                        marginTop: 1,
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#8A39E1',
                                            },
                                        },
                                        '& .MuiInputLabel-root.Mui-focused': {
                                            color: '#8A39E1',
                                        },
                                    }}>
                                        <InputLabel id="order-status-select-label">Status</InputLabel>
                                        <Select
                                            labelId="order-status-select-label"
                                            id="order-status-select"
                                            value={status}
                                            label="Status"
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            {order.orderStatus === "Shipped" && (<MenuItem value={"Delivered"}>Delivered</MenuItem>)}
                                            {order.orderStatus === "Processing" && (<MenuItem value={"Shipped"}>Shipped</MenuItem>)}
                                            {order.orderStatus === "Delivered" && (<MenuItem value={"Delivered"}>Delivered</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <button 
                                        type="submit" 
                                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 mt-3 p-2.5 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                        disabled={!status}
                                    >
                                        Update
                                    </button>
                                </form>
                            </div>

                            <h3 className="font-medium text-lg text-gray-800 mt-4">Order Items</h3>
                            
                            {order.orderItems && order.orderItems.map((item) => {
                                const { _id, image, name, price, quantity } = item;

                                return (
                                    <div className="flex flex-col sm:flex-row min-w-full shadow-lg rounded-lg bg-white px-4 py-5" key={_id}>
                                        <div className="flex flex-col sm:flex-row sm:w-1/2 gap-3">
                                            <div className="w-full sm:w-32 h-24 flex items-center justify-center">
                                                <img draggable="false" className="h-full w-auto object-contain rounded-md" src={image} alt={name} />
                                            </div>
                                            <div className="flex flex-col gap-1 overflow-hidden">
                                                <p className="text-gray-800 font-medium">{name.length > 45 ? `${name.substring(0, 45)}...` : name}</p>
                                                <p className="text-sm text-gray-600 mt-1">Quantity: {quantity}</p>
                                                <p className="text-sm text-gray-600">Price: ৳{price.toLocaleString()}</p>
                                                <span className="font-medium text-gray-800">Total: ৳{(quantity * price).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full sm:w-1/2 mt-4 sm:mt-0">
                                            <h3 className="font-medium sm:text-center text-gray-800 mb-2">Order Status</h3>
                                            <TrackStepper
                                                orderOn={order.createdAt}
                                                shippedAt={order.shippedAt}
                                                deliveredAt={order.deliveredAt}
                                                activeStep={
                                                    order.orderStatus === "Delivered" ? 2 : order.orderStatus === "Shipped" ? 1 : 0
                                                }
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default UpdateOrder;