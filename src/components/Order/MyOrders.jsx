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
        <div className="orders-header">
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4 sm:mt-0">
            {/* Gold Progress Premium Layout */}
            {!summary?.isGold && summary?.lifetimeTotal !== undefined && (
              <div className="flex-1 sm:w-72 flex flex-col gap-2 bg-gradient-to-r from-[#faf8f5] to-white p-4 rounded-xl border border-[#eedfc3]/50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#eedfc3]/20 via-transparent to-transparent rounded-bl-full pointer-events-none"></div>
                
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800/70">
                    {t("Progress to Gold", "গোল্ডে অগ্রগতি")}
                  </span>
                  <span className="text-xs font-black text-amber-900">
                    {Math.min(100, Math.round(((summary?.lifetimeTotal || 0) / 44930) * 100))}%
                  </span>
                </div>
                
                <div className="w-full bg-amber-900/10 rounded-full h-1.5 overflow-hidden relative z-10">
                  <div
                    className="bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                    style={{ width: `${Math.min(100, Math.round(((summary?.lifetimeTotal || 0) / 44930) * 100))}%` }}
                  />
                </div>
                
                <span className="text-[9px] font-medium text-amber-900/60 break-words leading-tight relative z-10">
                  {t(
                    `Spend ৳${Math.max(0, 44930 - (summary?.lifetimeTotal || 0)).toLocaleString()} more for Gold (-10%)`,
                    `গোল্ডের জন্য আরও ৳${Math.max(0, 44930 - (summary?.lifetimeTotal || 0)).toLocaleString()} খরচ করুন (-10%)`
                  )}
                </span>
              </div>
            )}

            <button className="lg:hidden flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-black transition-colors" onClick={() => setMobileFiltersOpen(true)}>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/50 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <ShoppingBagOutlinedIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500">{t("Lifetime Total", "মোট ব্যয়")}</span>
                    </div>
                    <span className="text-3xl font-black tracking-tight text-gray-900 mt-2">৳{(summary?.lifetimeTotal || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/50 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500">{t("Last 12 Months", "গত ১২ মাস")}</span>
                    </div>
                    <span className="text-3xl font-black tracking-tight text-gray-900 mt-2">৳{(summary?.lastYearTotal || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100/50 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500">{t("Status", "স্ট্যাটাস")}</span>
                    </div>
                    <div className="mt-2">
                      {summary?.isGold ? (
                        <GoldUserBadge size="small" showAnimation={false} />
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none bg-gray-100 text-gray-800 uppercase tracking-widest">{t("Standard", "স্ট্যান্ডার্ড")}</span>
                      )}
                    </div>
                  </div>
                </div>



                {/* Search */}
                <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-xl focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition-all mb-8 mt-2 overflow-hidden shadow-sm">
                  <div className="pl-4 text-gray-400">
                    <SearchIcon sx={{ fontSize: 20 }} />
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="search"
                    placeholder={t("Search your orders by item name...", "অর্ডার খুঁজুন...")}
                    className="w-full bg-transparent border-none outline-none py-3.5 px-3 text-sm font-medium text-gray-900 placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")} className="pr-4 text-gray-400 hover:text-gray-900 transition-colors">
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </button>
                  )}
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
