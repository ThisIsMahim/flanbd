import React, { useContext, useRef, useEffect } from "react";
import { LanguageContext } from "../../../utils/LanguageContext";
import "./AboutUs.css";
import gsap from "gsap";
import {
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
  StarIcon,
  SparklesIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";

const AboutUs = () => {
  const { language } = useContext(LanguageContext);
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      );
    }
  }, []);

  // Translation function for better code organization
  const t = (eng, ben) => (language === "english" ? eng : ben);

  return (
    <div className="aboutus-main-container min-h-screen">
      {/* Hero Section with Flan Branding - More Spacing */}
      <section className="relative overflow-hidden py-32 px-4">
        {/* Minimal Background Elements */}
        <div className="absolute inset-0 bg-red-50/30"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-100 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-100 rounded-full blur-2xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Flan Branding - Clean and Minimal */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-2xl mb-8 shadow-lg">
              <HeartIcon className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
              <span className="text-red-600">F</span>
              <span className="text-gray-700">lan</span>
            </h1>

            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-16 h-1 bg-red-500 rounded-full"></div>
              <StarIcon className="w-6 h-6 text-yellow-500" />
              <div className="w-16 h-1 bg-pink-500 rounded-full"></div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {t("About Flan", "ফ্ল্যান সম্পর্কে")}
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
              {t(
                "Building Community Through Products Fans Love",
                "ফ্যানরা যে পণ্য ভালোবাসে তার মাধ্যমে কমিউনিটি গড়ে তোলা"
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Container - Apply ref here */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        <div
          ref={containerRef}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
        >
          {/* Mission Statement Section */}
          <section className="p-8 md:p-12 border-b border-gray-100">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <SparklesIcon className="w-8 h-8 text-red-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {t("Our Mission", "আমাদের মিশন")}
                </h2>
                <SparklesIcon className="w-8 h-8 text-red-600" />
              </div>
              <div className="w-24 h-1 bg-red-500 rounded-full mx-auto mb-8"></div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 rounded-2xl p-8 md:p-10 mb-8">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center font-medium">
                  {t(
                    "At Flan, we don't just sell merchandise, we build communities. Our mission is to provide premium anime merchandise, football fan gear, and pop culture collectibles that help fans express their identity and connect with like-minded enthusiasts. Every product is carefully curated to celebrate the fandoms we love and bring people together through shared passions.",
                    "ফ্ল্যানে, আমরা শুধু পণ্য বিক্রি করি না, আমরা কমিউনিটি গড়ে তুলি। আমাদের লক্ষ্য হল প্রিমিয়াম অ্যানিমে মার্চেন্ডাইজ, ফুটবল ফ্যান গিয়ার এবং পপ কালচার কালেক্টিবল প্রদান করা যা ফ্যানদের তাদের পরিচয় প্রকাশ করতে এবং একই রকম উত্সাহী ব্যক্তিদের সাথে সংযোগ স্থাপনে সাহায্য করে। প্রতিটি পণ্য সাবধানে নির্বাচিত হয় আমাদের প্রিয় ফ্যানডমগুলি উদযাপন করতে এবং ভাগ করা আবেগের মাধ্যমে মানুষকে একত্রিত করতে।"
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="p-8 md:p-12 border-b border-gray-100">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {t("What Sets Us Apart", "আমাদের বিশেষত্ব")}
              </h2>
              <div className="w-24 h-1 bg-pink-500 rounded-full mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Quality Focus */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {t("Premium Quality", "প্রিমিয়াম মান")}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {t(
                    "We understand that fandom merchandise is more than just products, it's a way to express your identity. That's why we hold ourselves to the highest standards of quality. From the authenticity of our anime keychains to the durability of our football mufflers, each item is crafted to last and bring joy to your fandom experience.",
                    "আমরা বুঝি যে ফ্যানডম মার্চেন্ডাইজ শুধু পণ্য নয়, এটি আপনার পরিচয় প্রকাশের একটি উপায়। এজন্যই আমরা নিজেদের সর্বোচ্চ মানের মানদণ্ডে রাখি। আমাদের অ্যানিমে কীচেইনের সত্যতা থেকে আমাদের ফুটবল মাফলারের স্থায়িত্ব পর্যন্ত, প্রতিটি আইটেম টেকসই এবং আপনার ফ্যানডম অভিজ্ঞতায় আনন্দ আনতে তৈরি করা হয়েছে।"
                  )}
                </p>
              </div>

              {/* Community Focus */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {t("Community First", "কমিউনিটি প্রথম")}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {t(
                    "But our commitment doesn't stop at the product. We value your time and trust, which is why we guarantee fast shipping so you can show off your new gear without delay. And if something isn't quite right, our simple and fan-friendly return policy makes it easy to exchange or return your purchase with confidence.",
                    "কিন্তু আমাদের প্রতিশ্রুতি শুধু পণ্যে থেমে থাকে না। আমরা আপনার সময় এবং বিশ্বাসকে মূল্য দিই, এজন্যই আমরা দ্রুত শিপিং গ্যারান্টি দিই যাতে আপনি বিলম্ব ছাড়াই আপনার নতুন গিয়ার প্রদর্শন করতে পারেন। এবং যদি কিছু ঠিক না হয়, আমাদের সহজ এবং ফ্যান-বান্ধব রিটার্ন নীতি আপনার কেনাকাটা আত্মবিশ্বাসের সাথে বিনিময় বা ফেরত দেওয়া সহজ করে তোলে।"
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Promise Section */}
          <section className="p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {t("Our Promise to You", "আপনার প্রতি আমাদের প্রতিশ্রুতি")}
              </h2>
              <div className="w-24 h-1 bg-purple-500 rounded-full mx-auto"></div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-purple-50 rounded-2xl p-8 md:p-10 mb-8">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center mb-8">
                  {t(
                    "Whether you're representing your favorite anime character, showing support for your football team, or celebrating your love for pop culture, Flan has the perfect merchandise for every moment. We aim to give you not just products, but the confidence, community, and connection you deserve as a fan.",
                    "আপনি আপনার প্রিয় অ্যানিমে চরিত্রের প্রতিনিধিত্ব করছেন, আপনার ফুটবল দলের সমর্থন দেখাচ্ছেন, বা আপনার পপ কালচারের প্রতি ভালোবাসা উদযাপন করছেন, ফ্ল্যানের প্রতিটি মুহূর্তের জন্য নিখুঁত মার্চেন্ডাইজ আছে। আমাদের লক্ষ্য হল আপনাকে শুধু পণ্য নয়, বরং আত্মবিশ্বাস, কমিউনিটি এবং সংযোগ দেওয়া যা আপনি একজন ফ্যান হিসাবে প্রাপ্য।"
                  )}
                </p>

                {/* Highlighted Promise */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <CheckBadgeIcon className="w-8 h-8 text-purple-600" />
                    <h3 className="text-2xl font-bold text-purple-800">
                      {t("The Flan Promise", "ফ্ল্যানের প্রতিশ্রুতি")}
                    </h3>
                  </div>
                  <p className="text-xl font-semibold text-purple-700 text-center leading-relaxed">
                    {t(
                      "At Flan, your fandom comes first and we gear you up with nothing less than the best.",
                      "ফ্ল্যানে, আপনার ফ্যানডম প্রথম আসে এবং আমরা সেগুলিকে সর্বোত্তমের চেয়ে কম কিছু দিয়ে সাজাই না।"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-red-600 text-white p-8 md:p-12">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                <GiftIcon className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t(
                  "Experience the Flan Difference",
                  "ফ্ল্যানের পার্থক্য অনুভব করুন"
                )}
              </h2>

              <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                {t(
                  "Discover your perfect fandom merchandise today!",
                  "আজই আপনার নিখুঁত ফ্যানডম মার্চেন্ডাইজ আবিষ্কার করুন!"
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  className="bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  onClick={() => (window.location.href = "/contact")}
                >
                  {t("Get Started", "শুরু করুন")}
                </button>

                <button
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-red-600 transition-all duration-300"
                  onClick={() => (window.location.href = "/products")}
                >
                  {t("Browse Products", "পণ্য দেখুন")}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <TruckIcon className="w-8 h-8 text-red-200 mb-2" />
                  <p className="text-red-100 font-medium">
                    {t("Fast Shipping", "দ্রুত শিপিং")}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <ArrowPathIcon className="w-8 h-8 text-red-200 mb-2" />
                  <p className="text-red-100 font-medium">
                    {t("Easy Returns", "সহজ ফেরত")}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <StarIcon className="w-8 h-8 text-red-200 mb-2" />
                  <p className="text-red-100 font-medium">
                    {t("Fan Approved", "ফ্যান অনুমোদিত")}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
