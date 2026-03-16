import React, { useContext, useEffect } from "react";
import { LanguageContext } from "../../../utils/LanguageContext";
import MetaData from "../MetaData";
import {
  HeartIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import "./AboutUs.css";

const AboutUs = () => {
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const t = (eng, ben) => (language === "english" ? eng : ben);

  return (
    <div className="about-page-wrapper">
      <MetaData title={t("About Us | Flan", "আমাদের সম্পর্কে | Flan")} />

      <header className="about-hero">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          FLAN<span className="text-accent">.</span>
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          {t(
            "The bridge between passion and premium fandom merchandise. We build communities, one product at a time.",
            "প্যাশন এবং প্রিমিয়াম ফ্যানডম মার্চেন্ডাইজের মধ্যে সেতুবন্ধন। আমরা পণ্য নয়, বরং প্রতিটি পণ্যের মাধ্যমে গড়ে তুলি নতুন কমিউনিটি।"
          )}
        </motion.p>
      </header>

      <div className="about-section">
        {/* Mission */}
        <div className="about-content-row">
          <motion.div
            className="about-text"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>{t("Our Mission", "আমাদের লক্ষ্য")}</h2>
            <p>
              {t(
                "At Flan, we don't just sell merchandise; we nurture fan cultures. From the latest anime collectibles to high-end football gear, our mission is to provide fans with high-quality ways to express their identities and connect with their favorite worlds.",
                "ফ্ল্যানে, আমরা শুধু পণ্য বিক্রি করি না; আমরা ফ্যানদের আবেগ এবং কালচারকে লালন করি। লেটেস্ট অ্যানিমে কালেক্টিবল থেকে শুরু করে হাই-এন্ড ফুটবল গিয়ার পর্যন্ত, আমাদের লক্ষ্য হল ফ্যানদের তাদের পরিচয় প্রকাশ করতে এবং তাদের পছন্দের জগতের সাথে যুক্ত হতে উৎসাহিত করা।"
              )}
            </p>
          </motion.div>
          <motion.div
            className="about-image"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1470&auto=format&fit=crop" alt="Community" />
          </motion.div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">50k+</span>
            <span className="stat-label uppercase tracking-widest">{t("Community Members", "কমিউনিটি মেম্বার")}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">100%</span>
            <span className="stat-label uppercase tracking-widest">{t("Authentic Experience", "আসল অনুভূতি")}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">24h</span>
            <span className="stat-label uppercase tracking-widest">{t("Concierge Support", "সার্বক্ষণিক সাপোর্ট")}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">Free</span>
            <span className="stat-label uppercase tracking-widest">{t("Standard Delivery", "ফ্রি ডেলিভারি")}</span>
          </div>
        </div>

        {/* Values */}
        <div className="values-section">
          <div className="values-header">
            <h2>{t("The Flan Standard", "ফ্ল্যানের বিশেষত্ব")}</h2>
          </div>
          <div className="values-grid">
            <motion.div
              className="value-card"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="value-icon"><ShieldCheckIcon className="w-8 h-8" /></div>
              <h3>{t("Curated with Care", "যত্নে বাছাই করা")}</h3>
              <p>{t("We don't do generic. Every piece in our shop is hand-picked to ensure it meets the highest standards for hardcore fans.", "আমরা গতানুগতিক কিছু করি না। আমাদের শপে প্রতিটি পণ্য যত্নসহকারে বাছাই করা হয় যাতে তা ফ্যানদের সর্বোচ্চ চাহিদা পূরণ করতে পারে।")}</p>
            </motion.div>
            <motion.div
              className="value-card"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="value-icon"><UserGroupIcon className="w-8 h-8" /></div>
              <h3>{t("For Fans, By Fans", "ফ্যানদের জন্য ফ্যানদের দ্বারা")}</h3>
              <p>{t("The people behind Flan are fans themselves. We understand the excitement, the wait, and the joy of owning your favorite piece of merchandise.", "ফ্ল্যানের পেছনের মানুষগুলো নিজেরাই এই ফ্যান কালচারের অংশ। আমরা জানি আপনার প্রিয় পণ্যটি হাতে পাওয়ার রোমাঞ্চ এবং আনন্দ কতটা গভীর হতে পারে।")}</p>
            </motion.div>
            <motion.div
              className="value-card"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="value-icon"><HeartIcon className="w-8 h-8" /></div>
              <h3>{t("Building Culture", "কালচার গড়ে তোলা")}</h3>
              <p>{t("Beyond products, we host events, create stories, and provide a platform for fans to showcase their passion to the world.", "পণ্যের উর্ধ্বে আমরা ইভেন্ট আয়োজন করি, ফ্যানডম স্টোরি তৈরি করি এবং ফ্যানদের তাদের আবেগ বিশ্বের কাছে তুলে ধরার একটি প্ল্যাটফর্ম তৈরি করি।")}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
