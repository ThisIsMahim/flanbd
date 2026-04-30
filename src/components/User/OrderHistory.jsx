import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Schedule as ProcessingIcon,
  Cancel as CancelledIcon,
  Star as GoldIcon,
} from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { myOrders } from "../../actions/orderAction";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";
import Loader from "../Layouts/Loader";

const OrderHistory = () => {
  const { language } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading, orders, error } = useSelector((state) => state.myOrders);
  const { summary } = useSelector((state) => state.myOrdersSummary);

  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    dispatch(myOrders());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <ProcessingIcon color="warning" />;
      case "shipped":
        return <ShippingIcon color="info" />;
      case "delivered":
        return <DeliveredIcon color="success" />;
      case "cancelled":
        return <CancelledIcon color="error" />;
      default:
        return <ProcessingIcon color="warning" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "warning";
      case "shipped":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const translations = {
    title: language === "english" ? "Order History" : "অর্ডার ইতিহাস",
    subtitle: language === "english" ? "Your complete order history" : "আপনার সম্পূর্ণ অর্ডার ইতিহাস",
    noOrders: language === "english" ? "No orders found" : "কোন অর্ডার পাওয়া যায়নি",
    orderId: language === "english" ? "Order ID" : "অর্ডার আইডি",
    orderDate: language === "english" ? "Order Date" : "অর্ডার তারিখ",
    totalAmount: language === "english" ? "Total Amount" : "মোট পরিমাণ",
    status: language === "english" ? "Status" : "অবস্থা",
    items: language === "english" ? "Items" : "আইটেম",
    shippingInfo: language === "english" ? "Shipping Information" : "শিপিং তথ্য",
    paymentInfo: language === "english" ? "Payment Information" : "পেমেন্ট তথ্য",
    fraudCheck: language === "english" ? "Fraud Check Results" : "ফ্রড চেক ফলাফল",
    riskLevel: language === "english" ? "Risk Level" : "ঝুঁকির মাত্রা",
    successRatio: language === "english" ? "Success Ratio" : "সাফল্যের অনুপাত",
    totalOrders: language === "english" ? "Total Orders" : "মোট অর্ডার",
    totalDeliveries: language === "english" ? "Total Deliveries" : "মোট ডেলিভারি",
    totalCancellations: language === "english" ? "Total Cancellations" : "মোট বাতিল",
    recommendation: language === "english" ? "Recommendation" : "সুপারিশ",
    goldUser: language === "english" ? "Gold User" : "গোল্ড ব্যবহারকারী",
    goldBenefits: language === "english" ? "Gold Benefits" : "গোল্ড সুবিধা",
    goldDiscount: language === "english" ? "10% Gold Discount" : "১০% গোল্ড ছাড়",
    prioritySupport: language === "english" ? "Priority Support" : "অগ্রাধিকার সহায়তা",
    exclusiveOffers: language === "english" ? "Exclusive Offers" : "এক্সক্লুসিভ অফার",
    viewDetails: language === "english" ? "View Details" : "বিস্তারিত দেখুন",
    hideDetails: language === "english" ? "Hide Details" : "বিস্তারিত লুকান",
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <Box className="text-center py-8">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <MetaData title="Order History" />
      <Box className="w-full mt-20 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Typography variant="h4" component="h1" gutterBottom className="text-center">
            {translations.title}
          </Typography>
          <Typography variant="body1" className="text-center mb-8 text-gray-600">
            {translations.subtitle}
          </Typography>

          {/* Gold User Benefits Section */}
          {summary?.isGold && (
            <Card className="mb-8 bg-gradient-to-r from-gold-50 to-amber-50 border-2 border-gold-200">
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <GoldIcon className="text-gold-600 mr-2" />
                  <Typography variant="h6" className="text-gold-800">
                    {translations.goldUser}
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="success.main">
                        {translations.goldDiscount}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="primary.main">
                        {translations.prioritySupport}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="secondary.main">
                        {translations.exclusiveOffers}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="info.main">
                        Lifetime: ৳{summary?.lifetimeTotal?.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {orders && orders.length > 0 ? (
            <Grid container spacing={3}>
              {orders.map((order) => (
                <Grid item xs={12} key={order._id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box>
                          <Typography variant="h6" component="h2">
                            {translations.orderId}: {order._id}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {translations.orderDate}: {formatDate(order.paidAt)}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="h6" color="primary">
                            ৳{order.totalPrice}
                          </Typography>
                          <Chip
                            icon={getStatusIcon(order.orderStatus)}
                            label={order.orderStatus}
                            color={getStatusColor(order.orderStatus)}
                            variant="outlined"
                          />
                        </Box>
                      </Box>

                      <Accordion
                        expanded={expandedOrder === order._id}
                        onChange={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography>
                            {expandedOrder === order._id ? translations.hideDetails : translations.viewDetails}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={3}>
                            {/* Order Items */}
                            <Grid item xs={12} md={6}>
                              <Typography variant="h6" gutterBottom>
                                {translations.items}
                              </Typography>
                              <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Product</TableCell>
                                      <TableCell align="right">Qty</TableCell>
                                      <TableCell align="right">Price</TableCell>
                                      <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {order.orderItems.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell align="right">{item.quantity}</TableCell>
                                        <TableCell align="right">৳{item.price}</TableCell>
                                        <TableCell align="right">৳{item.price * item.quantity}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>

                            {/* Shipping & Payment Info */}
                            <Grid item xs={12} md={6}>
                              <Typography variant="h6" gutterBottom>
                                {translations.shippingInfo}
                              </Typography>
                              <Box className="bg-gray-50 p-3 rounded">
                                <Typography variant="body2">
                                  {order.shippingInfo.address}
                                </Typography>
                                <Typography variant="body2">
                                  {order.shippingInfo.city}, {order.shippingInfo.state}
                                </Typography>
                                <Typography variant="body2">
                                  {order.shippingInfo.country} - {order.shippingInfo.pincode}
                                </Typography>
                                <Typography variant="body2">
                                  Phone: {order.shippingInfo.phoneNo}
                                </Typography>
                              </Box>

                              <Typography variant="h6" gutterBottom className="mt-3">
                                {translations.paymentInfo}
                              </Typography>
                              <Box className="bg-gray-50 p-3 rounded">
                                <Typography variant="body2">
                                  Method: {order.paymentInfo.method?.toUpperCase()}
                                </Typography>
                                <Typography variant="body2">
                                  Status: {order.paymentInfo.status}
                                </Typography>
                                {order.paymentInfo.transactionId && (
                                  <Typography variant="body2">
                                    Transaction ID: {order.paymentInfo.transactionId}
                                  </Typography>
                                )}
                              </Box>
                            </Grid>

                            {/* Fraud Check Results */}
                            {order.fraudCheck && (
                              <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                  {translations.fraudCheck}
                                </Typography>
                                <Box className="bg-gray-50 p-3 rounded">
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={3}>
                                      <Typography variant="body2">
                                        <strong>{translations.riskLevel}:</strong>
                                      </Typography>
                                      <Chip
                                        label={order.fraudCheck.riskLevel}
                                        color={
                                          order.fraudCheck.riskLevel === "HIGH" ? "error" :
                                          order.fraudCheck.riskLevel === "MEDIUM" ? "warning" :
                                          order.fraudCheck.riskLevel === "LOW" ? "success" : "default"
                                        }
                                        size="small"
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                      <Typography variant="body2">
                                        <strong>{translations.successRatio}:</strong> {order.fraudCheck.successRatio}%
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                      <Typography variant="body2">
                                        <strong>{translations.totalOrders}:</strong> {order.fraudCheck.totalOrders}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                      <Typography variant="body2">
                                        <strong>{translations.totalDeliveries}:</strong> {order.fraudCheck.totalDeliveries}
                                      </Typography>
                                    </Grid>
                                    {order.fraudCheck.recommendation && (
                                      <Grid item xs={12}>
                                        <Typography variant="body2">
                                          <strong>{translations.recommendation}:</strong> {order.fraudCheck.recommendation}
                                        </Typography>
                                      </Grid>
                                    )}
                                  </Grid>
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box className="text-center py-8">
              <Typography variant="h6" color="textSecondary">
                {translations.noOrders}
              </Typography>
            </Box>
          )}
        </div>
      </Box>
    </>
  );
};

export default OrderHistory;

