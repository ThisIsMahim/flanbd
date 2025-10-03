import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { LanguageContext } from "../../../utils/LanguageContext";
import ServiceBookingModal from "./ServiceBookingModal";

// CSS animations
const styles = `
  @keyframes waterRipple {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }
  
  .water-ripple {
    position: relative;
    overflow: hidden;
  }
  
  .water-ripple::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: rgba(56, 182, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: transform 0.6s, opacity 1s;
  }
  
  .water-ripple:hover::after {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 1;
  }
  
  .wave-bg {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%2338b6ff' fill-opacity='0.1' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") bottom center no-repeat;
    background-size: cover;
  }
  
  .glass-modal {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .modal-input {
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(4px);
    padding: 10px 15px;
    border-radius: 8px;
    width: 100%;
    color: #1e3a8a;
    font-size: 16px;
    transition: all 0.3s ease;
  }
  
  .modal-input:focus {
    outline: none;
    border-color: #38B6FF;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 0 3px rgba(56, 182, 255, 0.2);
  }
  
  .modal-textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  .water-submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #38B6FF;
    color: white;
    font-weight: 600;
    padding: 10px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .water-submit-btn:hover {
    background: #1a9ff3;
    transform: translateY(-2px);
  }
  
  .water-submit-btn:disabled {
    background: #9dd4f8;
    cursor: not-allowed;
    transform: none;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
    margin-right: 8px;
  }
  
  .water-toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .water-toast.success {
    border-left: 4px solid #4CAF50;
  }
  
  .water-toast.error {
    border-left: 4px solid #F44336;
  }
`;

const ServiceCard = ({ title, description, icon, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="water-ripple bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
    >
      <div className="text-blue-500 mb-4 text-4xl">{icon}</div>
      <h3 className="text-xl font-bold text-blue-800 mb-3">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
      <div className="mt-4">
        <div className="w-10 h-1 bg-blue-400 rounded-full"></div>
      </div>
    </motion.div>
  );
};

const WaterFeature = ({ title, description }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="flex items-start mb-4"
    >
      <div className="flex-shrink-0 mt-1">
        <WaterDropIcon className="text-blue-400" />
      </div>
      <div className="ml-4">
        <h4 className="text-lg font-semibold text-blue-800">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

const EyeGearsServices = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Translations
  const translations = {
    english: {
      metaTitle: "Our Services | EyeGears",
              heroTitle: "Premium Sunglasses Solutions",
      heroSubtitle:
                  "Advanced sunglasses products and services for your business and personal needs",
      servicesTitle: "Our Comprehensive Services",
              whyChooseUs: "Why Choose EyeGears?",
              featuresTitle: "Advanced Sunglasses Product Features",
      ctaTitle: "Experience the Quality Difference",
      ctaSubtitle: "Get your free consultation today",
      ctaButton: "Book a Consultation",
      services: [
        {
                  title: "Premium Sunglasses Products",
        description: "High-quality sunglasses for all your needs",
          icon: "📄",
        },
        {
                  title: "Custom Sunglasses Solutions",
        description: "Tailored sunglasses for your specific requirements",
          icon: "⚡",
        },
        {
                  title: "Bulk Sunglasses Supply",
        description: "Reliable bulk sunglasses supply for businesses",
          icon: "📦",
        },
        {
                  title: "Commercial Sunglasses Services",
        description: "Industrial-grade sunglasses solutions for businesses",
          icon: "🏢",
        },
        {
                  title: "Sunglasses Consultation",
        description: "Expert advice on sunglasses selection and usage",
          icon: "🛠️",
        },
        {
          title: "Quality Testing",
          description: "Comprehensive sunglasses quality analysis",
          icon: "🔬",
        },
      ],
      features: [
        {
          title: "Premium Quality Materials",
          description:
            "All our sunglasses meet international quality standards",
        },
        {
          title: "Eco-Friendly Options",
          description: "Sustainable and environmentally friendly sunglasses choices",
        },
        {
          title: "Waste Reduction",
          description: "Efficient sunglasses solutions that reduce waste",
        },
        {
          title: "Safe Handling",
          description: "Special safety features for all sunglasses",
        },
      ],
      benefits: [
        "Premium quality sunglasses",
        "Wide variety of sunglasses styles and sizes",
        "Competitive pricing and bulk discounts",
        "Fast and reliable delivery",
        "Expert consultation services",
        "24/7 customer support",
      ],
    },
    bangla: {
      metaTitle: "আমাদের সেবা | পেপারম্যান",
      heroTitle: "প্রিমিয়াম কাগজের সমাধান",
      heroSubtitle: "আপনার ব্যবসা এবং ব্যক্তিগত প্রয়োজনের জন্য উন্নত কাগজের পণ্য এবং সেবা",
      servicesTitle: "আমাদের সম্পূর্ণ সেবাসমূহ",
      whyChooseUs: "কেন পেপারম্যান বেছে নেবেন?",
      featuresTitle: "উন্নত কাগজের পণ্য বৈশিষ্ট্য",
      ctaTitle: "গুণমানের পার্থক্য অনুভব করুন",
      ctaSubtitle: "আজই আপনার বিনামূল্যের পরামর্শ বুক করুন",
      ctaButton: "পরামর্শ বুক করুন",
      services: [
        {
          title: "প্রিমিয়াম কাগজের পণ্য",
          description: "আপনার সমস্ত প্রয়োজনের জন্য উচ্চ-মানের কাগজের পণ্য",
          icon: "📄",
        },
        {
          title: "কাস্টম কাগজের সমাধান",
          description: "আপনার নির্দিষ্ট প্রয়োজনীয়তার জন্য কাস্টমাইজড কাগজের পণ্য",
          icon: "⚡",
        },
        {
          title: "বাল্ক কাগজ সরবরাহ",
          description: "ব্যবসার জন্য নির্ভরযোগ্য বাল্ক কাগজ সরবরাহ",
          icon: "📦",
        },
        {
          title: "বাণিজ্যিক কাগজ সেবা",
          description: "ব্যবসার জন্য শিল্প-গ্রেড কাগজের সমাধান",
          icon: "🏢",
        },
        {
          title: "কাগজ পরামর্শ",
          description: "কাগজ নির্বাচন এবং ব্যবহারে বিশেষজ্ঞ পরামর্শ",
          icon: "🛠️",
        },
        {
          title: "গুণমান পরীক্ষা",
          description: "সম্পূর্ণ কাগজের গুণমান বিশ্লেষণ",
          icon: "🔬",
        },
      ],
      features: [
        {
          title: "প্রিমিয়াম মানের উপাদান",
          description: "আমাদের সমস্ত কাগজের পণ্য আন্তর্জাতিক মানের মান পূরণ করে",
        },
        {
          title: "পরিবেশ-বান্ধব বিকল্প",
          description: "টেকসই এবং পরিবেশ-বান্ধব কাগজের পছন্দ",
        },
        {
          title: "বর্জ্য হ্রাস",
          description: "দক্ষ কাগজের সমাধান যা বর্জ্য হ্রাস করে",
        },
        {
          title: "নিরাপদ পরিচালনা",
          description: "সমস্ত কাগজের পণ্যের জন্য বিশেষ নিরাপত্তা বৈশিষ্ট্য",
        },
      ],
      benefits: [
        "প্রিমিয়াম মানের কাগজের পণ্য",
        "বিস্তৃত ধরনের কাগজ এবং আকার",
        "প্রতিযোগিতামূলক মূল্য এবং বাল্ক ছাড়",
        "দ্রুত এবং নির্ভরযোগ্য ডেলিভারি",
        "বিশেষজ্ঞ পরামর্শ সেবা",
        "২৪/৭ গ্রাহক সহায়তা",
      ],
    },
  };

  const t = translations[language] || translations.english;

  // Creating a ref for the CTA section
  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Floating water bubbles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-100 opacity-30"
          style={{
            width: `${Math.random() * 40 + 20}px`,
            height: `${Math.random() * 40 + 20}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0.3 }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Language Toggle */}
      <div className="flex justify-end p-4">
        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleLanguage}
          className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md"
        >
          {language === 'english' ? 'বাংলা' : 'English'}
        </motion.button> */}
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-16 px-4 md:px-8 text-center relative wave-bg"
      >
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-6"
        >
          <WaterDropIcon style={{ fontSize: 60, color: "#38B6FF" }} />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
          {t.heroTitle}
        </h1>
        <p className="text-xl text-blue-600 max-w-2xl mx-auto">
          {t.heroSubtitle}
        </p>
      </motion.section>

      {/* Services Section */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center text-blue-800 mb-12"
        >
          {t.servicesTitle}
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 md:px-8 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-blue-800 mb-4">
              {t.featuresTitle}
            </h2>
            <div className="w-20 h-1 bg-blue-400 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {t.features.map((feature, index) => (
                <WaterFeature
                  key={index}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                {t.whyChooseUs}
              </h3>
              <ul className="space-y-3">
                {t.benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 1, x: 0 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <span className="text-blue-500 mr-2">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 text-center">
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-100 opacity-30"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-100 opacity-30"></div>
          <div className="relative z-10">
            <WaterDropIcon
              style={{ fontSize: 50, color: "#38B6FF" }}
              className="mb-4"
            />
            <h2 className="text-3xl font-bold text-blue-800 mb-4">
              {t.ctaTitle}
            </h2>
            <p className="text-xl text-gray-600 mb-8">{t.ctaSubtitle}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md"
              onClick={() => setIsModalOpen(true)}
            >
              {t.ctaButton}
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Booking Modal */}
      <ServiceBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalTitle={
          language === "english" ? "Book a Consultation" : "পরামর্শ বুক করুন"
        }
        modalSubtitle={
          language === "english"
            ? "Fill in your details and we'll contact you to schedule your consultation"
            : "আপনার বিবরণ পূরণ করুন এবং আমরা আপনার পরামর্শ সময়সূচি করতে আপনার সাথে যোগাযোগ করব"
        }
        buttonText={t.ctaButton}
        formSubject="Consultation"
      />
    </div>
  );
};

export default EyeGearsServices;
