import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { clearErrors, myOrders, myOrdersSummary } from "../../actions/orderAction";
import { LanguageContext } from "../../utils/LanguageContext";
import Breadcrumb from "../Layouts/Breadcrumb";
import Loader from "../Layouts/Loader";
import MetaData from "../Layouts/MetaData";
import OrderItem from "./OrderItem";
import GoldUserBadge from "../common/GoldUserBadge";
import GoldUserAnimation from "../common/GoldUserAnimation";
// import { LanguageContext } from '../Layouts/LanguageContext';

const orderStatus = ["Processing", "Shipped", "Delivered"];
const orderStatusbangla = ["প্রসেসিং", "শিপড", "ডেলিভার্ড"];
const dt = new Date();
const ordertime = [dt.getMonth(), dt.getFullYear() - 1, dt.getFullYear() - 2];
const ordertimeLabels = ["এই মাস", "গত বছর", "২ বছর আগে"];

const MyOrders = () => {
  const { language } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [status, setStatus] = useState("");
  const [orderTime, setOrderTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showGoldAnimation, setShowGoldAnimation] = useState(false);

  const {
    orders = [],
    loading,
    error,
  } = useSelector((state) => state.myOrders);
  const { summary, loading: summaryLoading } = useSelector((state) => state.myOrdersSummary);
  const { user } = useSelector((state) => state.user);

  // Fetch orders and summary on component mount
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(myOrders());
    dispatch(myOrdersSummary());
  }, [dispatch, error, enqueueSnackbar]);

  // Check if user just became Gold User
  useEffect(() => {
    if (user?.isGoldUser && user?.goldUserSince) {
      const goldUserDate = new Date(user.goldUserSince);
      const now = new Date();
      const timeDiff = now - goldUserDate;
      
      // Show animation if user became Gold User within the last 24 hours
      if (timeDiff < 24 * 60 * 60 * 1000) {
        setShowGoldAnimation(true);
      }
    }
  }, [user]);

  const handleGoldAnimationComplete = () => {
    setShowGoldAnimation(false);
  };

  // Apply filters and search in real-time
  useEffect(() => {
    if (loading) return;

    let result = [...orders];

    // Apply status filter
    if (status) {
      result = result.filter((order) => order.orderStatus === status);
    }

    // Apply time filter
    if (orderTime) {
      if (+orderTime === dt.getMonth()) {
        result = result.filter(
          (order) => new Date(order.createdAt).getMonth() === +orderTime
        );
      } else {
        result = result.filter(
          (order) => new Date(order.createdAt).getFullYear() === +orderTime
        );
      }
    }

    // Apply search filter
    if (searchQuery.trim()) {
      result = result
        .map((order) => ({
          ...order,
          orderItems: order.orderItems.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          ), // Closing parenthesis for filter
        }))
        .filter((order) => order.orderItems.length > 0);
      // Added comma after the filter closing parenthesis
    }

    setFilteredOrders(result);
  }, [orders, loading, status, orderTime, searchQuery]);

  const clearFilters = () => {
    setStatus("");
    setOrderTime(0);
    setSearchQuery("");
  };

  const FilterContent = () => (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg border border-[var(--primary-blue-light)] h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-white rounded-t-2xl border-b border-[var(--primary-blue-light)]">
        <p className="text-lg font-bold text-[var(--primary-blue-dark)] tracking-wide">
          {language === "bangla" ? "ফিল্টার" : "Filter"}
        </p>
        <button
          className="uppercase text-xs font-bold px-3 py-1 rounded-full bg-[var(--primary-blue-light)] text-white hover:bg-[var(--primary-blue-dark)] transition-colors"
          onClick={clearFilters}
        >
          {language === "bangla" ? "সব সাফ করুন" : "Clear All"}
        </button>
      </div>
      {/* Order Status Filter */}
      <div className="flex flex-col gap-2 px-4 py-4 border-b border-[var(--primary-blue-light)] bg-white">
        <span className="font-bold text-[var(--primary-blue-dark)] text-base mb-2">
          {language === "bangla" ? "অর্ডার স্ট্যাটাস" : "Order Status"}
        </span>
        <FormControl>
          <RadioGroup
            aria-labelledby="orderstatus-radio-buttons-group"
            onChange={(e) => setStatus(e.target.value)}
            name="orderstatus-radio-buttons"
            value={status}
          >
            {orderStatus.map((el, i) => (
              <FormControlLabel
                value={el}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: "var(--primary-blue-light)",
                      "&.Mui-checked": { color: "var(--primary-blue-dark)" },
                    }}
                  />
                }
                key={i}
                label={
                  <span className="text-sm text-[var(--primary-blue-dark)]">
                    {language === "bangla" ? orderStatusbangla[i] : el}
                  </span>
                }
                className="mb-1"
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
      {/* Order Time Filter */}
      <div className="flex flex-col gap-2 px-4 py-4 bg-white">
        <span className="font-bold text-[var(--primary-blue-dark)] text-base mb-2">
          {language === "bangla" ? "অর্ডারের সময়" : "Order Time"}
        </span>
        <FormControl>
          <RadioGroup
            aria-labelledby="ordertime-radio-buttons-group"
            onChange={(e) => setOrderTime(e.target.value)}
            name="ordertime-radio-buttons"
            value={orderTime}
          >
            {ordertime.map((el, i) => (
              <FormControlLabel
                value={el}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: "var(--primary-blue-light)",
                      "&.Mui-checked": { color: "var(--primary-blue-dark)" },
                    }}
                  />
                }
                key={i}
                label={
                  <span className="text-sm text-[var(--primary-blue-dark)]">
                    {language === "bangla"
                      ? ordertimeLabels[i]
                      : i === 0
                      ? "This Month"
                      : el}
                  </span>
                }
                className="mb-1"
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );

  return (
    <>
      <MetaData
        title={
          language === "bangla"
                    ? "আমার অর্ডার | EyeGears"
        : "My Orders | EyeGears"
        }
      />

      {/* Gold User Animation */}
      <GoldUserAnimation 
        isVisible={showGoldAnimation} 
        onComplete={handleGoldAnimationComplete} 
      />

      <main className="w-full sm:mt-0">
        <div className="px-2 sm:px-4">
          <div className="flex justify-between items-center mb-3">
            <Breadcrumb />
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center justify-center gap-1 px-2 py-2 mt-10 rounded-md shadow-md transition-colors duration-200"
              style={{
                backgroundColor: "var(--primary-blue-dark)",
                color: "var(--text-light)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--primary-blue-light)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--primary-blue-dark)")
              }
            >
              <FilterListIcon fontSize="small" />
              <span className="font-medium">
                {language === "bangla" ? "ফিল্টার" : "Filters"}
              </span>
            </button>
          </div>
        </div>

        <div className="flex gap-3.5 m-auto mb-7">
          {/* Sidebar Filters */}
          <div className="hidden sm:flex flex-col w-1/5 px-1">
            <FilterContent />
          </div>

          {/* Mobile Filter Drawer */}
          <Drawer
            anchor="right"
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            variant="temporary"
            elevation={24}
            ModalProps={{
              keepMounted: true,
              disablePortal: true,
              style: { position: "absolute", zIndex: 1200 },
            }}
            PaperProps={{
              sx: {
                width: "320px",
                maxWidth: "100%",
                height: "100%",
                backgroundColor: "white",
                backgroundImage: "none",
                border: "none",
                boxShadow: "0 0 15px rgba(0,0,0,0.1)",
                position: "fixed",
                zIndex: 1200,
              },
            }}
            SlideProps={{
              timeout: 300,
            }}
          >
            <FilterContent />
          </Drawer>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <Loader />
            ) : (
              <div className="flex flex-col gap-3 sm:mr-4 overflow-hidden">
                {/* Spending Summary Card */}
                <div className="bg-white border rounded p-4">
                  <div className="flex flex-wrap gap-6 items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total purchased (lifetime)</p>
                      <p className="text-2xl font-bold text-[var(--primary-blue-dark)]">৳{summary?.lifetimeTotal || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total last 12 months</p>
                      <p className="text-2xl font-bold text-[var(--primary-blue-dark)]">৳{summary?.lastYearTotal || 0}</p>
                    </div>
                    <div className="relative group">
                      <p className="text-sm text-gray-600">Status</p>
                      {summary?.isGold ? (
                        <GoldUserBadge size="medium" showAnimation={false} />
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[var(--primary-blue-light)] text-white">
                          Standard
                        </span>
                      )}
                      <div className="absolute top-full mt-2 right-0 bg-white border rounded shadow-lg hidden group-hover:block min-w-[200px] z-10">
                        <button className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${summary?.isGold ? 'text-yellow-600 font-semibold' : 'text-gray-700'}`} onClick={() => window.location.href = '/gold'}>
                          Gold — 10% discount
                        </button>
                        <div className="px-4 py-2 text-gray-500 text-sm cursor-default">
                          Standard — spend less than ৳10,000 in last 12 months
                        </div>
                      </div>
                    </div>
                    {!summary?.isGold && (
                      <div className="flex-1 min-w-[240px]">
                        <p className="text-sm text-gray-600 mb-1">Progress to Gold (৳50,000 lifetime)</p>
                        <div className="h-3 w-full bg-gray-200 rounded">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, Math.round(((summary?.lifetimeTotal || 0) / 50000) * 100))}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-3 rounded bg-gradient-to-r from-yellow-400 to-yellow-600"
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          You need ৳{Math.max(0, 50000 - (summary?.lifetimeTotal || 0))} more to get 10% lifetime discount
                        </p>
                      </div>
                    )}
                  </div>
                  {/* Simple monthly bars */}
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-[var(--primary-blue-dark)] mb-2">Monthly spend (last 12 months)</p>
                    <div className="grid grid-cols-12 gap-2 items-end" style={{minHeight: 120}}>
                      {(summary?.months || []).map((m, idx) => {
                        const max = Math.max(1, ...(summary?.months || []).map(mm => mm.total));
                        const heightPct = Math.round((m.total / max) * 100);
                        return (
                          <div key={idx} className="flex flex-col items-center gap-1">
                            <div className="w-full bg-[var(--primary-blue-light)] rounded" style={{ height: `${Math.max(6, heightPct)}px` }} />
                            <span className="text-[10px] text-gray-600">{m.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* Search Bar with real-time filtering */}
                <div className="flex items-center justify-between mx-1 sm:mx-0 sm:w-10/12 bg-white border rounded hover:shadow">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="search"
                    name="search"
                    placeholder={
                      language === "bangla"
                        ? "এখানে আপনার অর্ডার খুঁজুন"
                        : "Search your orders here"
                    }
                    className="p-2 text-sm outline-none flex-1 rounded-l"
                  />
                  <button
                    type="button"
                    className="h-full text-sm px-4 py-2.5 rounded-r flex items-center gap-1 font-medium transition-colors focus:outline-none"
                    style={{
                      background: "var(--primary-blue-dark)",
                      color: "var(--text-light)",
                      minWidth: 120,
                      borderLeft: "1px solid var(--primary-blue-light)",
                    }}
                  >
                    <SearchIcon sx={{ fontSize: "22px" }} />
                    <span>
                      {language === "bangla"
                        ? "অর্ডার খুঁজুন"
                        : "Search Orders"}
                    </span>
                  </button>
                </div>

                {/* Results */}
                {filteredOrders.length === 0 ? (
                  <div className="flex items-center flex-col gap-2 p-8 bg-white">
                    <img
                      draggable="false"
                      src="https://rukminim1.flixcart.com/www/100/100/promos/23/08/2020/c5f14d2a-2431-4a36-b6cb-8b5b5e283d4f.png"
                      alt={
                        language === "bangla" ? "খালি অর্ডার" : "Empty Orders"
                      }
                    />
                    <span className="text-lg font-medium">
                      {language === "bangla"
                        ? "দুঃখিত, কোনো ফলাফল পাওয়া যায়নি"
                        : "Sorry, no results found"}
                    </span>
                    <p>
                      {language === "bangla"
                        ? "খোঁজা পরিবর্তন করুন অথবা সব ফিল্টার সাফ করুন"
                        : "Edit search or clear all filters"}
                    </p>
                  </div>
                ) : (
                  filteredOrders
                    .map((order) => {
                      const {
                        _id,
                        orderStatus,
                        orderItems = [],
                        createdAt,
                        deliveredAt,
                      } = order;
                      return orderItems.map((item, index) => (
                        <OrderItem
                          {...item}
                          key={`${_id}-${index}`}
                          orderId={_id}
                          orderStatus={orderStatus}
                          createdAt={createdAt}
                          deliveredAt={deliveredAt}
                        />
                      ));
                    })
                    .reverse()
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default MyOrders;
