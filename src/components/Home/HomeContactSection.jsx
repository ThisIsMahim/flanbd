import EmailIcon from "@mui/icons-material/Email";
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
    <section className="bg-white py-10 md:py-14 border-t border-gray-100 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#ff1837]"></span>
            <span className="text-[10px] text-[#ff1837] font-black uppercase tracking-[0.25em]">Reach Out</span>
            <span className="w-8 h-[2px] bg-[#ff1837]"></span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f0f0f] tracking-tighter uppercase leading-[1.1]">
            Get in <span className="text-gray-400">Touch</span>
          </h2>
          <p className="text-sm font-medium text-gray-500 max-w-lg mx-auto mt-4">
            {t.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 h-full">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">
                {t.contactInfo}
              </h3>

              <div className="space-y-7 border-l-2 border-gray-100 pl-6">
                <div className="group flex flex-col gap-1 cursor-default">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-600 transition-colors">Address</p>
                  <p className="text-[14px] font-extrabold text-gray-900 tracking-tight group-hover:translate-x-1 group-hover:text-[#ff1837] transition-all duration-300">{t.address}</p>
                </div>

                <div className="group flex flex-col gap-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-600 transition-colors">Phone</p>
                  <a href={`tel:${t.phone}`} className="text-[14px] font-extrabold text-gray-900 tracking-tight w-fit group-hover:translate-x-1 group-hover:text-[#ff1837] transition-all duration-300">
                    {t.phone}
                  </a>
                </div>

                <div className="group flex flex-col gap-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-gray-600 transition-colors">Email</p>
                  <a href={`mailto:${t.email}`} className="text-[14px] font-extrabold text-gray-900 tracking-tight w-fit group-hover:translate-x-1 group-hover:text-[#ff1837] transition-all duration-300">
                    {t.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[8.5px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t.formName}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={language === 'bangla' ? "আপনার নাম" : "John Doe"}
                      required
                      className="w-full px-3.5 py-3 bg-[#f9f9f9] text-black font-semibold text-xs placeholder-gray-300 border border-gray-100 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff1837]/20 focus:border-[#ff1837]/30 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8.5px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t.formEmail}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full px-3.5 py-3 bg-[#f9f9f9] text-black font-semibold text-xs placeholder-gray-300 border border-gray-100 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff1837]/20 focus:border-[#ff1837]/30 transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8.5px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t.formSubject} ({language === 'bangla' ? 'ঐচ্ছিক' : 'Optional'})</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={language === 'bangla' ? "আমরা কিভাবে সাহায্য করতে পারি?" : "How can we help?"}
                    className="w-full px-3.5 py-3 bg-[#f9f9f9] text-black font-semibold text-xs placeholder-gray-300 border border-gray-100 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff1837]/20 focus:border-[#ff1837]/30 transition-all duration-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[8.5px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t.formMessage}</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={language === 'bangla' ? "এখানে আপনার বার্তা লিখুন..." : "Write your message here..."}
                    required
                    rows="4"
                    className="w-full px-3.5 py-3 bg-[#f9f9f9] text-black font-semibold text-xs placeholder-gray-300 border border-gray-100 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff1837]/20 focus:border-[#ff1837]/30 transition-all duration-300 resize-none"
                  ></textarea>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group px-8 py-3 bg-[#0f0f0f] hover:bg-[#ff1837] text-white text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-lg transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(255,24,55,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span>{isSubmitting ? t.sending : t.sendButton}</span>
                    {!isSubmitting && <EmailIcon style={{ fontSize: '12px' }} className="group-hover:translate-x-0.5 transition-transform" />}
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
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 ${showToast === "success"
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-red-100 text-red-800 border border-red-200"
            }`}
        >
          <div className="flex items-center">
            <span className="font-medium text-xs">{toastMessage}</span>
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

