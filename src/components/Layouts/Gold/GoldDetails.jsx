import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import MetaData from "../MetaData";

const Benefit = ({ title, desc, icon }) => (
  <div className="p-5 rounded-2xl bg-white/70 border border-red-200 shadow-sm hover:shadow-md transition">
    <div className="text-2xl mb-2">{icon}</div>
    <div className="font-semibold text-red-800">{title}</div>
    <div className="text-sm text-red-900/80 mt-1">{desc}</div>
  </div>
);

const GoldDetails = () => {
  return (
    <>
      <MetaData title="Gold Membership - EyeGears | 10% Additional Discount" />
      <main className="min-h-screen bg-gradient-to-b from-red-50 via-red-100 to-white">
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white font-bold shadow border-2 border-red-300">
            <span>👑</span>
            <span>Gold Membership</span>
            <span className="opacity-90">10% OFF</span>
          </div>
          <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-red-900">Save additional 10% on every order, always.</h1>
          <p className="mt-3 text-red-900/80">Join Gold to unlock a flat 10% discount across the site. No limits, no complexities.</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a href="/products" className="px-5 py-2.5 rounded-full bg-red-500 text-white font-bold shadow hover:bg-red-600 transition">Shop now</a>
            <Link to="/account" className="px-5 py-2.5 rounded-full border border-red-300 text-red-800 font-semibold bg-white/70 hover:bg-white transition">Manage account</Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Benefit title="Flat 10% additional discount" desc="Automatic at checkout for Gold members." icon="💸" />
          <Benefit title="No coupons needed" desc="Discount applies without codes." icon="🎟️" />
          <Benefit title="Applies site‑wide" desc="On all eligible products and services." icon="🛍️" />
        </div>

        <div className="mt-10 p-5 rounded-2xl bg-white/70 border border-amber-200">
          <h2 className="text-xl font-bold text-red-900">How to become Gold?</h2>
          <ol className="list-decimal pl-5 mt-2 text-red-900/90 space-y-1">
            <li>Create an account and start ordering.</li>
            <li>Reach the spending threshold(10000 Taka in one year); we’ll upgrade you automatically.</li>
            <li>Enjoy 10% off on every next order.</li>
          </ol>
          <p className="mt-3 text-sm text-red-900/70">Note: Gold has one benefit only — a flat 10% discount. No other perks.</p>
        </div>
      </section>
    </main>
    </>
  );
};

export default GoldDetails;



