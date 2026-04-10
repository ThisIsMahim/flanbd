import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { clearErrors, getOrderDetails } from "../../actions/orderAction";
import Breadcrumb from "../Layouts/Breadcrumb";
import Loader from "../Layouts/Loader";
import MetaData from "../Layouts/MetaData";
import TrackStepper from "./TrackStepper";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();

  const { order, error, loading } = useSelector((state) => state.orderDetails);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getOrderDetails(params.id));
  }, [dispatch, error, params.id, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Order Details | FlanBD" />

      <main className="w-full mt-36">

        <Breadcrumb />
        {loading ? (
          <Loader />
        ) : (
          <>
            {order && order.user && order.shippingInfo && (
              <div className="flex flex-col gap-8 max-w-4xl mx-auto px-4 mt-6">
                <div className="flex flex-col md:flex-row gap-8 bg-white border border-gray-100 p-8">
                  <div className="flex-1 space-y-4">
                    <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Delivery Address</h3>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{order.user.name}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        {order.shippingInfo.address}<br />
                        {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}
                      </p>
                    </div>
                    <div className="space-y-1 mt-2">
                      <div className="flex gap-4 text-xs font-medium">
                        <span className="text-gray-400 w-12">Email</span>
                        <span className="text-gray-900">{order.user.email}</span>
                      </div>
                      <div className="flex gap-4 text-xs font-medium">
                        <span className="text-gray-400 w-12">Phone</span>
                        <span className="text-gray-900">{order.shippingInfo.phoneNo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 md:border-l border-gray-100 md:pl-8">
                    <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-500">Order ID</span>
                        <span className="text-gray-900 tracking-wide uppercase">{order._id.substring(0, 8)}...</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-500">Payment</span>
                        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider text-gray-900">{order.paymentInfo?.method || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium border-t border-gray-100 pt-3 mt-1">
                        <span className="font-bold tracking-widest text-gray-900 text-xs uppercase">Grand Total</span>
                        <span className="font-bold text-gray-900">৳{order.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 divide-y divide-gray-100 rounded">
                  <div className="p-4 px-8 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-[10px] font-bold tracking-widest text-gray-900 uppercase">Ordered Items ({order.orderItems?.length || 0})</h3>
                  </div>
                  {order.orderItems && order.orderItems.map((item) => {
                    const { _id, image, name, price, quantity } = item;
                    return (
                      <div className="flex flex-col sm:flex-row gap-8 p-6 sm:p-8" key={_id}>
                        <div className="flex flex-1 gap-6">
                          <div className="w-20 h-20 shrink-0 bg-white border border-gray-100 rounded p-1 flex items-center justify-center">
                            <img draggable="false" className="h-full w-full object-contain" src={image} alt={name} />
                          </div>
                          <div className="flex flex-col justify-center gap-1.5 min-w-0">
                            <p className="font-bold text-gray-900 text-sm truncate">{name}</p>
                            <p className="text-[11px] font-medium text-gray-400">
                              Qty: {quantity} &nbsp;&nbsp; ৳{price.toLocaleString()}
                            </p>
                            <span className="font-bold text-gray-900 text-sm">
                              Total: ৳{(quantity * price).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col w-full sm:w-1/2 justify-center mt-4 sm:mt-0">
                          <h3 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4 sm:text-center block">
                            Tracking Status
                          </h3>
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
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default OrderDetails;
