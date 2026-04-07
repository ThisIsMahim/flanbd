import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../../utils/LanguageContext";
import MetaData from "../MetaData";
import "./ContactUs.css";

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
      btnSend: "Send Message",
      btnSending: "Sending...",
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 md:pt-24 md:pb-16 px-4 relative overflow-hidden">
      <MetaData title="Contact Us | Flan" />
      
      <div className="container mx-auto z-10 relative max-w-6xl">
        <header className="text-center mb-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 transition-transform hover:scale-105 duration-300">
            {t.header}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t.tagline}
          </p>
        </header>

        <main className="grid lg:grid-cols-5 gap-10">
          {/* Info Panel */}
          <section className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 h-full hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">
                {t.infoLoc}
              </h3>
              
              <div className="space-y-8 mt-6">
                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-red-50 group-hover:bg-red-500 group-hover:text-white rounded-full flex items-center justify-center text-red-500 transition-all duration-300 flex-shrink-0 shadow-sm">
                    <LocationOnIcon fontSize="medium" />
                  </div>
                  <div className="ml-5 mt-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Address</p>
                    <p className="text-gray-800 font-medium text-lg">{t.infoAddr}</p>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-red-50 group-hover:bg-red-500 group-hover:text-white rounded-full flex items-center justify-center text-red-500 transition-all duration-300 flex-shrink-0 shadow-sm">
                    <PhoneIcon fontSize="medium" />
                  </div>
                  <div className="ml-5 mt-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                    <a href={`tel:${t.infoPhone}`} className="text-gray-800 font-medium text-lg hover:text-red-500 transition-colors">
                      {t.infoPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-14 h-14 bg-red-50 group-hover:bg-red-500 group-hover:text-white rounded-full flex items-center justify-center text-red-500 transition-all duration-300 flex-shrink-0 shadow-sm">
                    <EmailIcon fontSize="medium" />
                  </div>
                  <div className="ml-5 mt-1">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                    <a href={`mailto:${t.infoEmail}`} className="text-gray-800 font-medium text-lg hover:text-red-500 transition-colors">
                      {t.infoEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Form Panel */}
          <section className="lg:col-span-3">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300 relative h-full">
              {/* Decorative abstract shape */}
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-red-100 rounded-full blur-xl opacity-50 z-0"></div>
              
              <div className="relative z-10 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.formTitle}</h2>
                <p className="text-gray-500">{t.formTag}</p>
              </div>

              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1 uppercase tracking-wide">{t.labelName}</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="John Doe"
                      required 
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 placeholder-gray-400" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1 uppercase tracking-wide">{t.labelPhone}</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="+880 1..."
                      className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 placeholder-gray-400" 
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-sm font-semibold text-gray-700 ml-1 uppercase tracking-wide">{t.labelEmail}</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="john@example.com"
                    required 
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 placeholder-gray-400" 
                  />
                </div>

                <div className="space-y-2 mb-6">
                  <label className="text-sm font-semibold text-gray-700 ml-1 uppercase tracking-wide">{t.labelSub}</label>
                  <input 
                    type="text" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    placeholder="How can we help?"
                    required 
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 placeholder-gray-400" 
                  />
                </div>

                <div className="space-y-2 mb-8">
                  <label className="text-sm font-semibold text-gray-700 ml-1 uppercase tracking-wide">{t.labelMsg}</label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="Write your message here..."
                    required 
                    rows="5" 
                    className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 placeholder-gray-400 resize-none" 
                  />
                </div>

                {status.msg && (
                  <div className={`p-4 rounded-xl mb-6 border ${
                    status.type === 'success' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  } font-medium flex items-center`}>
                    {status.msg}
                  </div>
                )}

                <div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? t.btnSending : t.btnSend}</span>
                    {!isSubmitting && (
                      <SendIcon className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fontSize="small" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ContactUs;
