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
    <div className="orders-filter-card">
      <div className="orders-filter-header">
        <span>{t("Filters", "ফিল্টার")}</span>
        <button className="orders-filter-clear" onClick={clearFilters}>
          {t("Clear", "সাফ")}
        </button>
      </div>

      {/* Status Filter */}
      <div className="orders-filter-group">
        <div className="orders-filter-group-title">{t("Order Status", "অর্ডার স্ট্যাটাস")}</div>
        {statusOptions.map((opt, i) => (
          <label key={opt} className={`orders-filter-option ${status === opt ? 'selected' : ''}`}>
            <input
              type="radio"
              name="status"
              value={opt}
              checked={status === opt}
              onChange={(e) => setStatus(e.target.value)}
            />
            {language === "bangla" ? statusOptionsBn[i] : opt}
          </label>
        ))}
      </div>

      {/* Time Filter */}
      <div className="orders-filter-group">
        <div className="orders-filter-group-title">{t("Order Time", "অর্ডারের সময়")}</div>
        {timeOptions.map((opt) => (
          <label key={opt.value} className={`orders-filter-option ${+orderTime === opt.value ? 'selected' : ''}`}>
            <input
              type="radio"
              name="ordertime"
              value={opt.value}
              checked={+orderTime === opt.value}
              onChange={(e) => setOrderTime(e.target.value)}
            />
            {language === "bangla" ? opt.labelBn : opt.label}
          </label>
        ))}
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
          <div className="orders-header-left">
            <div className="orders-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>{t("My Orders", "আমার অর্ডার")}</span>
            </div>
            <h1>{t("My Orders", "আমার অর্ডার")}</h1>
          </div>

          <button className="orders-filter-toggle" onClick={() => setMobileFiltersOpen(true)}>
            <FilterListIcon sx={{ fontSize: 16 }} />
            {t("Filters", "ফিল্টার")}
          </button>
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
              background: "var(--bg-primary)",
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
                <div className="orders-stats-row">
                  <div className="orders-stat-item">
                    <div className="orders-stat-label">{t("Lifetime Total", "মোট ব্যয়")}</div>
                    <div className="orders-stat-value">৳{(summary?.lifetimeTotal || 0).toLocaleString()}</div>
                  </div>
                  <div className="orders-stat-item">
                    <div className="orders-stat-label">{t("Last 12 Months", "গত ১২ মাস")}</div>
                    <div className="orders-stat-value">৳{(summary?.lastYearTotal || 0).toLocaleString()}</div>
                  </div>
                  <div className="orders-stat-item">
                    <div className="orders-stat-label">{t("Status", "স্ট্যাটাস")}</div>
                    <div className="orders-stat-value">
                      {summary?.isGold ? (
                        <GoldUserBadge size="small" showAnimation={false} />
                      ) : (
                        <span style={{ fontSize: 'var(--text-sm)' }}>{t("Standard", "স্ট্যান্ডার্ড")}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gold Progress Bar */}
                {!summary?.isGold && (
                  <div className="orders-gold-progress">
                    <div className="orders-gold-top">
                      <div className="orders-gold-label">
                        {t("Progress to Gold", "গোল্ডে অগ্রগতি")}
                      </div>
                      <div className="orders-gold-pct">
                        {Math.min(100, Math.round(((summary?.lifetimeTotal || 0) / 50000) * 100))}%
                      </div>
                    </div>
                    <div className="orders-gold-bar-track">
                      <div
                        className="orders-gold-bar-fill"
                        style={{ width: `${Math.min(100, Math.round(((summary?.lifetimeTotal || 0) / 50000) * 100))}%` }}
                      />
                    </div>
                    <div className="orders-gold-note">
                      {t(
                        `Spend ৳${Math.max(0, 50000 - (summary?.lifetimeTotal || 0)).toLocaleString()} more to unlock Gold status — 10% lifetime discount on every order`,
                        `গোল্ড স্ট্যাটাস আনলক করতে আরও ৳${Math.max(0, 50000 - (summary?.lifetimeTotal || 0)).toLocaleString()} খরচ করুন — প্রতিটি অর্ডারে ১০% আজীবন ছাড়`
                      )}
                    </div>
                  </div>
                )}

                {/* Monthly Chart */}
                {summary?.months?.length > 0 && (
                  <div className="orders-chart">
                    <div className="orders-chart-title">{t("Monthly Spend", "মাসিক ব্যয়")}</div>
                    <div className="orders-chart-bars">
                      {summary.months.map((m, idx) => {
                        const max = Math.max(1, ...summary.months.map(mm => mm.total));
                        const heightPct = Math.round((m.total / max) * 100);
                        return (
                          <div key={idx} className="orders-chart-bar-col">
                            <div
                              className={`orders-chart-bar ${m.total > 0 ? 'has-data' : ''}`}
                              style={{ height: `${Math.max(4, heightPct * 0.8)}px` }}
                              title={`৳${m.total.toLocaleString()}`}
                            />
                            <span className="orders-chart-label">{m.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Search */}
                <div className="orders-search">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="search"
                    placeholder={t("Search your orders...", "অর্ডার খুঁজুন...")}
                  />
                  <button type="button">
                    <SearchIcon sx={{ fontSize: 18 }} />
                    {t("Search", "খুঁজুন")}
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
