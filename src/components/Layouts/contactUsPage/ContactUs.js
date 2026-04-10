import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LanguageContext } from "../../../utils/LanguageContext";
import MetaData from "../MetaData";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import "./ContactUs.css"; // Left for any future global additions, but completely empty

const ContactUs = () => {
  const { language } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  const translations = {
    english: {
      header: "Get in Touch",
      tagline: "Have questions? We'd love to hear from you.",
      infoLoc: "Our Location",
      infoAddr: "Dhaka, Bangladesh",
      infoPhone: "01845556566",
      infoEmail: "support@flanbd.store",
      formTitle: "Send a Message",
      formTag: "Fill out the form below and we'll get back to you within 24 hours.",
      labelName: "Full Name",
      labelPhone: "Phone Number",
      labelEmail: "Email Address",
      labelSub: "Subject",
      labelMsg: "Your Message",
      btnSend: "SEND MESSAGE",
      btnSending: "SENDING...",
      success: "Message sent! We'll be in touch soon.",
      error: "Something went wrong. Please try again.",
    },
    bangla: {
      header: "যোগাযোগ করুন",
      tagline: "আপনার কোনো প্রশ্ন থাকলে আমাদের জানান।",
      infoLoc: "আমাদের অবস্থান",
      infoAddr: "ঢাকা, বাংলাদেশ",
      infoPhone: "01845556566",
      infoEmail: "support@flanbd.store",
      formTitle: "বার্তা পাঠান",
      formTag: "নিচের ফর্মটি পূরণ করুন, আমরা আপনার সাথে যোগাযোগ করব।",
      labelName: "পুরো নাম",
      labelPhone: "ফোন নম্বর",
      labelEmail: "ইমেইল",
      labelSub: "বিষয়",
      labelMsg: "আপনার বার্তা",
      btnSend: "বার্তা পাঠান",
      btnSending: "পাঠানো হচ্ছে...",
      success: "বার্তা পাঠানো হয়েছে!",
      error: "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।",
    }
  };

  const t = translations[language] || translations.english;

  // Format header text to highlight the last word with our red accent
  const renderStyledHeader = (text) => {
    const words = text.split(" ");
    if (words.length <= 1) return <span className="text-[#ff1837]">{text}</span>;
    const lastWord = words.pop();
    return (
      <>
        {words.join(" ")} <span className="text-[#ff1837]">{lastWord}</span>
      </>
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", msg: "" });

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/usermessages`,
        formData
      );
      if (data.success) {
        setStatus({ type: "success", msg: t.success });
        setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      setStatus({ type: "error", msg: t.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white flex items-center justify-center pt-24 pb-8 sm:pt-32 sm:pb-12 px-5 font-sans min-h-[calc(100vh-80px)]">
      <MetaData title="Contact Us | Flan" />
      
      <div className="w-full max-w-[850px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-5 space-y-10 lg:-mt-6">
            <div className="relative group/header">
               {/* Animated minimal dash */}
               <div className="w-8 h-1 bg-[#ff1837] mb-6 transition-all duration-700 ease-out group-hover/header:w-16"></div>
               <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-[#0f0f0f] mb-3 tracking-tighter leading-[1.05]">
                 {renderStyledHeader(t.header)}
               </h1>
               <p className="text-base sm:text-[17px] font-medium text-gray-500 leading-relaxed max-w-[280px]">
                 {t.tagline}
               </p>
            </div>
            
            <div className="space-y-7 border-l-2 border-gray-100 pl-6 relative">
              {/* Animated left border highlight */}
              <div className="absolute left-[-2px] top-0 w-[2px] h-0 bg-[#ff1837] transition-all duration-700 hover-border-anim"></div>

              {/* Address */}
              <div className="group flex flex-col gap-1 cursor-default relative">
                <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full bg-white border-2 border-gray-300 group-hover:border-[#ff1837] transition-colors duration-300"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors group-hover:text-gray-600">{t.infoLoc}</p>
                <p className="text-[14px] sm:text-[15px] font-extrabold text-gray-900 tracking-tight group-hover:translate-x-1 group-hover:text-[#ff1837] transition-all duration-300">{t.infoAddr}</p>
              </div>
              
              {/* Phone */}
              <div className="group flex flex-col gap-1 relative">
                <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full bg-white border-2 border-gray-300 group-hover:border-[#ff1837] transition-colors duration-300"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors group-hover:text-gray-600">Phone</p>
                <a href={`tel:${t.infoPhone}`} className="text-[14px] sm:text-[15px] font-extrabold text-gray-900 tracking-tight w-fit group-hover:translate-x-1 group-hover:text-[#ff1837] transition-all duration-300">
                  {t.infoPhone}
                </a>
              </div>
              
              {/* Email */}
              <div className="group flex flex-col gap-1 relative">
                <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full bg-white border-2 border-gray-300 group-hover:border-[#ff1837] transition-colors duration-300"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors group-hover:text-gray-600">Email</p>
                <a href={`mailto:${t.infoEmail}`} className="text-[14px] sm:text-[15px] font-extrabold text-gray-900 tracking-tight w-fit group-hover:translate-x-1 group-hover:text-[#ff1837] transition-all duration-300">
                  {t.infoEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-gray-100 rounded-[16px] shadow-[0_4px_30px_rgb(0,0,0,0.03)] border-gray-100/60">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-black mb-1.5 tracking-tight">{t.formTitle}</h2>
              <p className="text-gray-500 font-medium text-xs sm:text-[13px]">{t.formTag}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[8.5px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t.labelName}</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="John Doe"
                    required 
                    className="w-full px-3.5 py-3 bg-[#f9f9f9] text-black font-semibold text-xs placeholder-gray-300 border border-gray-100 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff1837]/20 focus:border-[#ff1837]/30 transition-all duration-300"
                  />
                </div>
                
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-[8.5px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t.labelPhone}</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="+880 1..."
                    className="w-full px-3.5 py-3 bg-[#f9f9f9] text-black font-semibold text-xs placeholder-gray-300 border border-gray-100 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff1837]/20 focus:border-[#ff1837]/30 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[8.5px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t.labelEmail}</label>
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

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-[8.5px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t.labelSub}</label>
                <input 
                  type="text" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  placeholder="Order Tracking Inquiry"
                  required 
                  className="w-full px-3.5 py-3 bg-[#f9f9f9] text-black font-semibold text-xs placeholder-gray-300 border border-gray-100 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff1837]/20 focus:border-[#ff1837]/30 transition-all duration-300"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5 pb-1">
                <label className="text-[8.5px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">{t.labelMsg}</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  placeholder="Write your message here..."
                  required 
                  rows="3" 
                  className="w-full px-3.5 py-3 bg-[#f9f9f9] text-black font-semibold text-xs placeholder-gray-300 border border-gray-100 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff1837]/20 focus:border-[#ff1837]/30 transition-all duration-300 resize-none hide-scrollbar"
                />
              </div>

              {/* Status Alert */}
              {status.msg && (
                <div className={`p-2.5 text-[10px] font-extrabold uppercase tracking-widest rounded-lg mb-1 text-center transition-all ${
                  status.type === 'success' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {status.msg}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="group w-full sm:w-auto py-3 px-7 flex items-center justify-center gap-2 text-white bg-[#0f0f0f] hover:bg-[#ff1837] focus:outline-none focus:ring-2 focus:ring-[#ff1837]/30 rounded-lg font-extrabold uppercase tracking-[0.2em] text-[10px] transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_4px_14px_-6px_rgba(255,24,55,0.5)] hover:-translate-y-0.5 ml-auto"
              >
                <span className="ml-1">{isSubmitting ? t.btnSending : t.btnSend}</span>
                {!isSubmitting && (
                  <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                     <ArrowRightAltIcon className="group-hover:translate-x-0.5 transition-transform duration-300 rounded-full" style={{ fontSize: '12px' }} />
                  </div>
                )}
              </button>

            </form>
          </div>

        </div>
      </div>
      
      {/* CSS to ensure scrollbar hiding and hover anim */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .group\\/header:hover ~ .border-l-2 .hover-border-anim { height: 100%; }
        .border-l-2:hover .hover-border-anim { height: 100%; }
      `}} />
    </div>
  );
};

export default ContactUs;
