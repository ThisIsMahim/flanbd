import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PhoneIcon from "@mui/icons-material/Phone";
import axios from "axios";
import React, { useContext, useState } from "react";
import { LanguageContext } from "../../utils/LanguageContext";

const HomeContactSection = () => {
  const { language } = useContext(LanguageContext) || { language: "english" };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Translations
  const translations = {
    english: {
      title: "Get in Touch",
      subtitle:
        "We're here to answer your questions about premium sunglasses and optical solutions",
      contactInfo: "Contact Information",
      address: "Dhaka, Bangladesh",
      phone: "+8801845-556566",
      email: "support@eyegearsbd.com",
      formName: "Your Name",
      formEmail: "Your Email",
      formSubject: "Subject",
      formMessage: "Your Message",
      sendButton: "Send Message",
      sending: "Sending...",
      successMessage: "Thank you! We'll get back to you soon.",
      errorMessage: "Failed to send message. Please try again later.",
      requiredFields: "Please fill in all required fields",
    },
    bangla: {
      title: "যোগাযোগ করুন",
      subtitle:
        "আমরা আপনার প্রিমিয়াম সানগ্লাস এবং অপটিক্যাল সমাধান সম্পর্কে প্রশ্নের উত্তর দিতে এখানে আছি",
      contactInfo: "যোগাযোগের তথ্য",
      address: "Dhaka, Bangladesh",
      phone: "+১ (৫৫৫) ১২৩-৪৫৬৭",
      email: "support@eyegearsbd.com",
      formName: "আপনার নাম",
      formEmail: "আপনার ইমেইল",
      formSubject: "বিষয়",
      formMessage: "আপনার বার্তা",
      sendButton: "বার্তা পাঠান",
      sending: "পাঠানো হচ্ছে...",
      successMessage: "ধন্যবাদ! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
      errorMessage: "বার্তা পাঠাতে ব্যর্থ হয়েছে। পরে আবার চেষ্টা করুন।",
      requiredFields: "অনুগ্রহ করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন",
    },
  };

  const t = translations[language];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToastMessage = (message, isSuccess = true) => {
    setToastMessage(message);
    setShowToast(isSuccess ? "success" : "error");
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.email || !formData.name || !formData.message) {
      showToastMessage(t.requiredFields, false);
      return;
    }

    setIsSubmitting(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/usermessages`,
        formData,
        config
      );

      if (data.success) {
        showToastMessage(t.successMessage, true);
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showToastMessage(error.response?.data?.message || t.errorMessage, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gray-50">
      <div className="container mx-auto z-10 relative max-w-6xl px-4">
        <div className="text-center mb-16 flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 transition-transform hover:scale-105 duration-300">
            {t.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 h-full hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">
                {t.contactInfo}
              </h3>
              
              <div className="space-y-8 mt-6">
                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-red-50 group-hover:bg-red-500 group-hover:text-white rounded-full flex items-center justify-center text-red-500 transition-all duration-300 flex-shrink-0 shadow-sm">
                    <LocationOnIcon fontSize="medium" />
                  </div>
                  <div className="ml-5 mt-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Address</p>
                    <p className="text-gray-800 font-medium text-lg">{t.address}</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-red-50 group-hover:bg-red-500 group-hover:text-white rounded-full flex items-center justify-center text-red-500 transition-all duration-300 flex-shrink-0 shadow-sm">
                    <PhoneIcon fontSize="medium" />
                  </div>
                  <div className="ml-5 mt-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-gray-800 font-medium text-lg">{t.phone}</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-red-50 group-hover:bg-red-500 group-hover:text-white rounded-full flex items-center justify-center text-red-500 transition-all duration-300 flex-shrink-0 shadow-sm">
                    <EmailIcon fontSize="medium" />
                  </div>
                  <div className="ml-5 mt-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-gray-800 font-medium text-lg">{t.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 relative">
               {/* Decorative abstract shape */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-red-100 rounded-full blur-xl opacity-50 z-0"></div>
              
              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">{t.formName}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={language === 'bangla' ? "আপনার নাম" : "John Doe"}
                      required
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">{t.formEmail}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={language === 'bangla' ? "john@example.com" : "john@example.com"}
                      required
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium text-gray-700 ml-1">{t.formSubject} ({language === 'bangla' ? 'ঐচ্ছিক' : 'Optional'})</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={language === 'bangla' ? "আমরা কিভাবে সাহায্য করতে পারি?" : "How can we help?"}
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2 mb-8">
                  <label className="text-sm font-medium text-gray-700 ml-1">{t.formMessage}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={language === 'bangla' ? "এখানে আপনার বার্তা লিখুন..." : "Write your message here..."}
                    required
                    rows="5"
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 placeholder-gray-400 resize-none"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? t.sending : t.sendButton}</span>
                    {!isSubmitting && (
                      <EmailIcon className="ml-2 group-hover:translate-x-1 transition-transform" fontSize="small" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 ${
            showToast === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center">
            <span className="font-medium">{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 text-lg font-bold opacity-70 hover:opacity-100 transition-opacity"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeContactSection;

