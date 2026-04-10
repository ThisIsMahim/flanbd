import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Schedule as ProcessingIcon,
  Cancel as CancelledIcon,
} from "@mui/icons-material";
import { useContext, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";

const GuestOrderTracking = () => {
  const { language } = useContext(LanguageContext);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If navigated from GuestCheckout with order and contact info, prefill and show immediately
  useEffect(() => {
    const state = location?.state;
    if (state?.order) {
      setOrder(state.order);
    }
    if (state?.email) {
      setEmail(state.email);
    }
    if (state?.phone) {
      setPhone(state.phone);
    }
    // Clear navigation state effect on unmount not necessary; react-router handles state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.state]);

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
    title: language === "english" ? "Track Your Order" : "আপনার অর্ডার ট্র্যাক করুন",
    subtitle: language === "english" ? "Enter your email and phone number to track your guest order" : "আপনার অতিথি অর্ডার ট্র্যাক করতে আপনার ইমেইল এবং ফোন নম্বর দিন",
    email: language === "english" ? "Email Address" : "ইমেইল ঠিকানা",
    phone: language === "english" ? "Phone Number" : "ফোন নম্বর",
    search: language === "english" ? "Search Order" : "অর্ডার অনুসন্ধান করুন",
    orderNotFound: language === "english" ? "Order not found" : "অর্ডার পাওয়া যায়নি",
    orderId: language === "english" ? "Order ID" : "অর্ডার আইডি",
    orderDate: language === "english" ? "Order Date" : "অর্ডার তারিখ",
    totalAmount: language === "english" ? "Total Amount" : "মোট পরিমাণ",
    status: language === "english" ? "Status" : "অবস্থা",
    items: language === "english" ? "Items" : "আইটেম",
    shippingInfo: language === "english" ? "Shipping Information" : "শিপিং তথ্য",
    paymentInfo: language === "english" ? "Payment Information" : "পেমেন্ট তথ্য",
    guestInfo: language === "english" ? "Guest Information" : "অতিথি তথ্য",
    fraudCheck: language === "english" ? "Fraud Check Results" : "ফ্রড চেক ফলাফল",
    riskLevel: language === "english" ? "Risk Level" : "ঝুঁকির মাত্রা",
    successRatio: language === "english" ? "Success Ratio" : "সাফল্যের অনুপাত",
    totalOrders: language === "english" ? "Total Orders" : "মোট অর্ডার",
    totalDeliveries: language === "english" ? "Total Deliveries" : "মোট ডেলিভারি",
    totalCancellations: language === "english" ? "Total Cancellations" : "মোট বাতিল",
    recommendation: language === "english" ? "Recommendation" : "সুপারিশ",
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!email.trim() || !phone.trim()) {
      setError(language === "english" ? "Please enter both email and phone number" : "অনুগ্রহ করে ইমেইল এবং ফোন নম্বর উভয়ই দিন");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const { data } = await axios.post('/api/v1/order/guest/find', {
        email: email.trim(),
        phone: phone.trim()
      });

      setOrder(data.order);
    } catch (error) {
      setError(error.response?.data?.message || translations.orderNotFound);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData title="Track Order" />
      <Box className="w-full mt-20 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Typography variant="h4" component="h1" gutterBottom className="text-center">
            {translations.title}
          </Typography>
          <Typography variant="body1" className="text-center mb-8 text-gray-600">
            {translations.subtitle}
          </Typography>

          {/* Search Form */}
          <Card className="mb-8">
            <CardContent>
              <form onSubmit={handleSearch}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label={translations.email}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label={translations.phone}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      sx={{ backgroundColor: '#111827', height: '100%', '&:hover': { backgroundColor: '#ff0022' } }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <SearchIcon />
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Order Details */}
          {order && (
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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

                <Grid container spacing={3}>
                  {/* Guest Information */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      {translations.guestInfo}
                    </Typography>
                    <Box className="bg-gray-50 p-3 rounded">
                      <Typography variant="body2">
                        <strong>Name:</strong> {order.guestUser.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Email:</strong> {order.guestUser.email}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Phone:</strong> {order.guestUser.phone}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Shipping Information */}
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
                  </Grid>

                  {/* Order Items */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      {translations.items}
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table>
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

                  {/* Payment Information */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      {translations.paymentInfo}
                    </Typography>
                    <Box className="bg-gray-50 p-3 rounded">
                      <Typography variant="body2">
                        <strong>Method:</strong> {order.paymentInfo.method?.toUpperCase()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong> {order.paymentInfo.status}
                      </Typography>
                      {order.paymentInfo.transactionId && (
                        <Typography variant="body2">
                          <strong>Transaction ID:</strong> {order.paymentInfo.transactionId}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* Need Help CTA */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      {language === "english" ? "Need Help?" : "সাহায্য প্রয়োজন?"}
                    </Typography>
                    <Box className="bg-gray-50 p-3 rounded flex items-center justify-between gap-3">
                      <Typography variant="body2" className="text-gray-700">
                        {language === "english"
                          ? "If you have any questions or issues with your order, our support team is here to help."
                          : "আপনার অর্ডার সম্পর্কে কোন প্রশ্ন বা সমস্যায় আমাদের সাপোর্ট টিম সাহায্য করতে প্রস্তুত।"}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/contact"
                        sx={{ backgroundColor: '#111827', '&:hover': { backgroundColor: '#ff0022' } }}
                      >
                        {language === "english" ? "Contact Support" : "সাপোর্টে যোগাযোগ"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
        </div>
      </Box>
    </>
  );
};

export default GuestOrderTracking;
