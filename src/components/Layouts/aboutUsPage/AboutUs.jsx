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
    <div className="min-h-screen bg-white pt-32 pb-16 md:pt-40 md:pb-24 overflow-x-hidden">
      <MetaData title={t("About Us | Flan", "আমাদের সম্পর্কে | Flan")} />

      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-20 md:mb-32">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-6"
          >
            FLAN<span className="text-red-500">.</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t(
              "The bridge between passion and premium fandom merchandise. We build communities, one product at a time.",
              "প্যাশন এবং প্রিমিয়াম ফ্যানডম মার্চেন্ডাইজের মধ্যে সেতুবন্ধন। আমরা পণ্য নয়, বরং প্রতিটি পণ্যের মাধ্যমে গড়ে তুলি নতুন কমিউনিটি।"
            )}
          </motion.p>
        </header>

        <main className="space-y-20 md:space-y-32">
          {/* Mission */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="order-2 md:order-1"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                {t("Our Mission", "আমাদের লক্ষ্য")}
              </h2>
              <div className="w-20 h-1.5 bg-red-500 mb-8 rounded-full"></div>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                {t(
                  "At Flan, we don't just sell merchandise; we nurture fan cultures. From the latest anime collectibles to high-end football gear, our mission is to provide fans with high-quality ways to express their identities and connect with their favorite worlds.",
                  "ফ্ল্যানে, আমরা শুধু পণ্য বিক্রি করি না; আমরা ফ্যানদের আবেগ এবং কালচারকে লালন করি। লেটেস্ট অ্যানিমে কালেক্টিবল থেকে শুরু করে হাই-এন্ড ফুটবল গিয়ার পর্যন্ত, আমাদের লক্ষ্য হল ফ্যানদের তাদের পরিচয় প্রকাশ করতে এবং তাদের পছন্দের জগতের সাথে যুক্ত হতে উৎসাহিত করা।"
                )}
              </p>
            </motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-2 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 hidden md:block"></div>
              <img 
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1470&auto=format&fit=crop" 
                alt="Community" 
                className="w-full h-[300px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>

          {/* Stats */}
          <div className="bg-gray-50 rounded-[2.5rem] p-10 md:p-16 border border-gray-100 shadow-inner">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              {[
                { value: "50k+", label: t("Community Members", "কমিউনিটি মেম্বার") },
                { value: "100%", label: t("Authentic Experience", "আসল অনুভূতি") },
                { value: "24h", label: t("Concierge Support", "সার্বক্ষণিক সাপোর্ট") },
                { value: "Free", label: t("Standard Delivery", "ফ্রি ডেলিভারি") }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center justify-center p-4 hover:bg-white hover:shadow-lg rounded-2xl transition-all duration-300 cursor-default"
                >
                  <span className="text-4xl md:text-5xl font-black text-gray-900 mb-2">{stat.value}</span>
                  <span className="text-sm md:text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{t("The Flan Standard", "ফ্ল্যানের বিশেষত্ব")}</h2>
              <div className="w-24 h-1.5 bg-red-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <ShieldCheckIcon className="w-10 h-10" />,
                  title: t("Curated with Care", "যত্নে বাছাই করা"),
                  desc: t("We don't do generic. Every piece in our shop is hand-picked to ensure it meets the highest standards for hardcore fans.", "আমরা গতানুগতিক কিছু করি না। আমাদের শপে প্রতিটি পণ্য যত্নসহকারে বাছাই করা হয় যাতে তা ফ্যানদের সর্বোচ্চ চাহিদা পূরণ করতে পারে।")
                },
                {
                  icon: <UserGroupIcon className="w-10 h-10" />,
                  title: t("For Fans, By Fans", "ফ্যানদের জন্য ফ্যানদের দ্বারা"),
                  desc: t("The people behind Flan are fans themselves. We understand the excitement, the wait, and the joy of owning your favorite piece of merchandise.", "ফ্ল্যানের পেছনের মানুষগুলো নিজেরাই এই ফ্যান কালচারের অংশ। আমরা জানি আপনার প্রিয় পণ্যটি হাতে পাওয়ার রোমাঞ্চ এবং আনন্দ কতটা গভীর হতে পারে।")
                },
                {
                  icon: <HeartIcon className="w-10 h-10" />,
                  title: t("Building Culture", "কালচার গড়ে তোলা"),
                  desc: t("Beyond products, we host events, create stories, and provide a platform for fans to showcase their passion to the world.", "পণ্যের উর্ধ্বে আমরা ইভেন্ট আয়োজন করি, ফ্যানডম স্টোরি তৈরি করি এবং ফ্যানদের তাদের আবেগ বিশ্বের কাছে তুলে ধরার একটি প্ল্যাটফর্ম তৈরি করি।")
                }
              ].map((val, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                    {val.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{val.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutUs;
