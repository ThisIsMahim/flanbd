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
              <div className="flex-1 sm:w-72 flex flex-col gap-2.5 bg-gradient-to-r from-[#faf8f5] to-white p-5 rounded-2xl border border-[#eedfc3]/50 shadow-[0_4px_16px_rgba(212,175,55,0.08)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#eedfc3]/30 via-transparent to-transparent rounded-bl-full pointer-events-none"></div>
                
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-[#8a6d3b]">
                    {t("Progress to Gold", "গোল্ডে অগ্রগতি")}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-[#8a6d3b]">
                    {Math.min(100, Math.round(((summary?.lifetimeTotal || 0) / 44930) * 100))}%
                  </span>
                </div>
                
                <div className="w-full bg-[#eedfc3]/40 rounded-full h-2 overflow-hidden relative z-10">
                  <div
                    className="bg-gradient-to-r from-[#d4af37] to-[#aa8c2c] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                    style={{ width: `${Math.min(100, Math.round(((summary?.lifetimeTotal || 0) / 44930) * 100))}%` }}
                  />
                </div>
                
                <span className="text-[10px] font-semibold text-[#8a6d3b]/80 break-words leading-tight relative z-10">
                  {t(
                    `Spend ৳${Math.max(0, 44930 - (summary?.lifetimeTotal || 0)).toLocaleString()} more for Gold (-10%)`,
                    `গোল্ডের জন্য আরও ৳${Math.max(0, 44930 - (summary?.lifetimeTotal || 0)).toLocaleString()} খরচ করুন (-10%)`
                  )}
                </span>
              </div>
            )}

            <button className="lg:hidden flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3.5 sm:py-4 bg-gray-900 border border-gray-800 text-white rounded-2xl text-[12px] font-bold uppercase tracking-[0.1em] shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:bg-black hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 transition-all active:scale-[0.98] mt-2 sm:mt-0" onClick={() => setMobileFiltersOpen(true)}>
              <FilterListIcon sx={{ fontSize: 18 }} />
              {t("Filters & Sort", "ফিল্টার")}
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
                {/* Premium Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/80 to-white p-4 sm:p-5 rounded-2xl shadow-sm border border-blue-100/50 flex flex-col justify-center group hover:shadow-md transition-shadow">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-bl from-blue-200/40 via-transparent to-transparent rounded-bl-full pointer-events-none"></div>
                    <div className="flex items-center gap-2.5 mb-3 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                        <ShoppingBagOutlinedIcon className="text-blue-600 group-hover:text-white transition-colors !text-[16px]" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.05em] sm:tracking-[0.1em] text-blue-900/70">{t("Lifetime Total", "মোট ব্যয়")}</span>
                    </div>
                    <span className="text-xl sm:text-3xl font-black tracking-tight text-gray-900 mt-1 relative z-10 leading-none">৳{(summary?.lifetimeTotal || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="relative overflow-hidden bg-gradient-to-br from-purple-50/80 to-white p-4 sm:p-5 rounded-2xl shadow-sm border border-purple-100/50 flex flex-col justify-center group hover:shadow-md transition-shadow">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-bl from-purple-200/40 via-transparent to-transparent rounded-bl-full pointer-events-none"></div>
                    <div className="flex items-center gap-2.5 mb-3 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 transition-all duration-300">
                        <svg className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.05em] sm:tracking-[0.1em] text-purple-900/70">{t("Last 12 Months", "গত ১২ মাস")}</span>
                    </div>
                    <span className="text-xl sm:text-3xl font-black tracking-tight text-gray-900 mt-1 relative z-10 leading-none">৳{(summary?.lastYearTotal || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="col-span-2 lg:col-span-1 relative overflow-hidden bg-gradient-to-br from-amber-50/80 to-white p-4 sm:p-6 rounded-2xl shadow-sm border border-amber-100/50 flex flex-col justify-center group hover:shadow-md transition-shadow items-center sm:items-start text-center sm:text-left text-amber-900">
                    <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-bl from-amber-200/40 via-transparent to-transparent rounded-bl-full pointer-events-none"></div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3 relative z-10">
                      <div className="w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-amber-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 transition-all duration-300 shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                        <svg className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                      </div>
                      <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-[0.1em] text-amber-900/80 mt-1 sm:mt-0">{t("Your Status", "আপনার স্ট্যাটাস")}</span>
                    </div>
                    <div className="mt-1 relative z-10 w-full flex justify-center sm:justify-start">
                      {summary?.isGold ? (
                        <div className="scale-110 sm:scale-125 transform origin-center sm:origin-left mt-1 sm:mt-2">
                          <GoldUserBadge size="small" showAnimation={false} />
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-4 py-2 mt-1 rounded-xl text-xs sm:text-sm font-black text-gray-800 uppercase tracking-[0.15em] bg-white border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-shadow">
                          {t("Standard Member", "স্ট্যান্ডার্ড")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>



                {/* Search */}
                <div className="flex items-center bg-white border border-gray-200/80 rounded-2xl focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/20 focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 mb-6 sm:mb-8 mt-2 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)] group">
                  <div className="pl-5 text-gray-400 group-focus-within:text-gray-900 transition-colors shrink-0">
                    <SearchIcon sx={{ fontSize: 22 }} />
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="search"
                    placeholder={t("Search your orders by item name...", "অর্ডার খুঁজুন...")}
                    className="w-full bg-transparent border-none outline-none py-4 px-4 text-[13px] sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-medium"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")} className="pr-5 pl-2 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                      <CloseIcon sx={{ fontSize: 20 }} />
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
