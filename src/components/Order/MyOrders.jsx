import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearErrors, myOrders, myOrdersSummary } from "../../actions/orderAction";
import { LanguageContext } from "../../utils/LanguageContext";
import MetaData from "../Layouts/MetaData";
import Loader from "../Layouts/Loader";
import OrderItem from "./OrderItem";
import GoldUserBadge from "../common/GoldUserBadge";
import GoldUserAnimation from "../common/GoldUserAnimation";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import "./MyOrders.css";

const statusOptions = ["Processing", "Shipped", "Delivered"];
const statusOptionsBn = ["প্রসেসিং", "শিপড", "ডেলিভার্ড"];
const dt = new Date();
const timeOptions = [
  { value: dt.getMonth(), label: "This Month", labelBn: "এই মাস" },
  { value: dt.getFullYear(), label: String(dt.getFullYear()), labelBn: String(dt.getFullYear()) },
  { value: dt.getFullYear() - 1, label: String(dt.getFullYear() - 1), labelBn: String(dt.getFullYear() - 1) },
];

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

  const { orders = [], loading, error } = useSelector((state) => state.myOrders);
  const { summary, loading: summaryLoading } = useSelector((state) => state.myOrdersSummary);
  const { user } = useSelector((state) => state.user);

  const t = (eng, ben) => (language === "english" ? eng : ben);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(myOrders());
    dispatch(myOrdersSummary());
  }, [dispatch, error, enqueueSnackbar]);

  useEffect(() => {
    if (user?.isGoldUser && user?.goldUserSince) {
      const timeDiff = new Date() - new Date(user.goldUserSince);
      if (timeDiff < 24 * 60 * 60 * 1000) {
        setShowGoldAnimation(true);
      }
    }
  }, [user]);

  // Apply filters
  useEffect(() => {
    if (loading) return;
    let result = [...orders];

    if (status) {
      result = result.filter((order) => order.orderStatus === status);
    }

    if (orderTime) {
      if (+orderTime === dt.getMonth()) {
        result = result.filter((order) => new Date(order.createdAt).getMonth() === +orderTime);
      } else {
        result = result.filter((order) => new Date(order.createdAt).getFullYear() === +orderTime);
      }
    }

    if (searchQuery.trim()) {
      result = result
        .map((order) => ({
          ...order,
          orderItems: order.orderItems.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((order) => order.orderItems.length > 0);
    }

    setFilteredOrders(result);
  }, [orders, loading, status, orderTime, searchQuery]);

  const clearFilters = () => {
    setStatus("");
    setOrderTime(0);
    setSearchQuery("");
  };

  const FilterContent = () => (
    <div className="flex flex-col gap-8 pr-4">
      <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-sm border border-gray-100">
        <span className="font-bold text-[13px] uppercase tracking-widest text-gray-900">{t("Filters", "ফিল্টার")}</span>
        <button className="text-[10px] font-bold text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-colors" onClick={clearFilters}>
          {t("Clear", "সাফ")}
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t("Order Status", "অর্ডার স্ট্যাটাস")}</div>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((opt, i) => (
            <button
              key={opt}
              type="button"
              onClick={() => setStatus(opt)}
              className={`px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border ${status === opt
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              {language === "bangla" ? statusOptionsBn[i] : opt}
            </button>
          ))}
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex flex-col gap-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{t("Order Time", "অর্ডারের সময়")}</div>
        <div className="flex flex-wrap gap-2">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setOrderTime(opt.value)}
              className={`px-4 py-2 rounded text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border ${+orderTime === opt.value
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              {language === "bangla" ? opt.labelBn : opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MetaData title={t("My Orders | FlanBD", "আমার অর্ডার | FlanBD")} />

      <GoldUserAnimation isVisible={showGoldAnimation} onComplete={() => setShowGoldAnimation(false)} />

      <div className="orders-page">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-10 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="mb-3 flex items-center">
              <Link to="/account" className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] text-gray-500 font-bold uppercase tracking-widest hover:text-gray-900 transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                {t("Back to Account", "অ্যাকাউন্টে ফিরে যান")}
              </Link>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{t("My Orders", "আমার অর্ডার")}</h1>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Gold Progress Compact */}
            {!summary?.isGold && summary?.lifetimeTotal !== undefined && (
              <div className="flex-1 sm:w-64 flex flex-col gap-1.5 bg-transparent md:bg-gray-50/50 md:p-3 md:rounded md:border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">
                    {t("Progress to Gold", "গোল্ডে অগ্রগতি")}
                  </span>
                  <span className="text-[10px] font-black text-gray-900">
                    {Math.min(100, Math.round(((summary?.lifetimeTotal || 0) / 44930) * 100))}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-[#c9a96e] h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.round(((summary?.lifetimeTotal || 0) / 44930) * 100))}%` }}
                  />
                </div>
                <span className="text-[8px] font-medium text-gray-400 break-words leading-tight">
                  {t(
                    `Spend ৳${Math.max(0, 44930 - (summary?.lifetimeTotal || 0)).toLocaleString()} more for Gold (-10%)`,
                    `গোল্ডের জন্য আরও ৳${Math.max(0, 44930 - (summary?.lifetimeTotal || 0)).toLocaleString()} খরচ করুন (-10%)`
                  )}
                </span>
              </div>
            )}

            <button className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded text-[10px] font-bold uppercase tracking-widest" onClick={() => setMobileFiltersOpen(true)}>
              <FilterListIcon sx={{ fontSize: 16 }} />
              {t("Filters", "ফিল্টার")}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          PaperProps={{
            sx: {
              width: "300px",
              maxWidth: "85vw",
              padding: "1rem",
              background: "white",
            },
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
            <button onClick={() => setMobileFiltersOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <CloseIcon />
            </button>
          </div>
          <FilterContent />
        </Drawer>

        {/* Main Layout */}
        <div className="orders-layout">
          {/* Filter Sidebar */}
          <div className="orders-filter-sidebar">
            <FilterContent />
          </div>

          {/* Content */}
          <div className="orders-main">
            {loading ? (
              <Loader />
            ) : (
              <>
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-6 p-0 md:p-6 rounded border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">{t("Lifetime Total", "মোট ব্যয়")}</span>
                    <span className="text-2xl font-black tracking-tight text-gray-900">৳{(summary?.lifetimeTotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col md:border-l border-gray-200 md:pl-6">
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">{t("Last 12 Months", "গত ১২ মাস")}</span>
                    <span className="text-2xl font-black tracking-tight text-gray-900">৳{(summary?.lastYearTotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col md:border-l border-gray-200 md:pl-6">
                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">{t("Status", "স্ট্যাটাস")}</span>
                    <div className="mt-1">
                      {summary?.isGold ? (
                        <GoldUserBadge size="small" showAnimation={false} />
                      ) : (
                        <span className="text-[13px] font-bold uppercase tracking-widest text-gray-900">{t("Standard", "স্ট্যান্ডার্ড")}</span>
                      )}
                    </div>
                  </div>
                </div>



                {/* Search */}
                <div className="flex items-center border-b-2 border-gray-100 focus-within:border-gray-900 transition-colors mb-8 mt-8">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="search"
                    placeholder={t("Search your orders...", "অর্ডার খুঁজুন...")}
                    className="w-full bg-transparent border-none outline-none py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400"
                  />
                  <button type="button" className="flex items-center gap-2 px-4 text-[10px] font-bold text-gray-900 uppercase tracking-widest hover:text-gray-500 transition-all">
                    <SearchIcon sx={{ fontSize: 16 }} />
                    <span className="hidden sm:inline">{t("Search", "খুঁজুন")}</span>
                  </button>
                </div>

                {/* Results */}
                {filteredOrders.length === 0 ? (
                  <div className="orders-empty">
                    <div className="orders-empty-icon">
                      <ShoppingBagOutlinedIcon sx={{ fontSize: 28 }} />
                    </div>
                    <h3>{t("No orders found", "কোনো অর্ডার পাওয়া যায়নি")}</h3>
                    <p>{t("Try adjusting your filters or search query", "ফিল্টার বা সার্চ পরিবর্তন করুন")}</p>
                    <Link to="/products">{t("Start Shopping", "কেনাকাটা শুরু করুন")}</Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {filteredOrders
                      .map((order) => {
                        const { _id, orderStatus, orderItems = [], createdAt, deliveredAt } = order;
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
                      .reverse()}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrders;
