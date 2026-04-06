import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../../utils/LanguageContext";
import BlogApi from "../api/blogApi";
import MetaData from "../../components/Layouts/MetaData";

const ShowBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const t = (eng, ben) => (language === "english" ? eng : ben);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const data = await BlogApi.getAllBlogs();
        setBlogs(data);
        setError(null);
      } catch (err) {
        setError(t("Failed to load stories", "গল্প লোড করতে ব্যর্থ হয়েছে"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
    window.scrollTo(0, 0);
  }, [language]);

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const gridBlogs = blogs.length > 1 ? blogs.slice(1, 5) : []; // up to 4 articles for the grid

  return (
    <div className="bg-[#fcf9f8] font-['Inter'] text-[#1c1b1b] antialiased min-h-screen pt-24">
      <MetaData title={t("Stories | Flan", "গল্পসমূহ | Flan")} />
      
      <main className="max-w-7xl mx-auto px-6 md:px-12 pb-32">
        {/* Hero Section */}
        <header className="py-24 text-center">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-12 h-px bg-[#e8202a]"></span>
              <span className="text-xs font-bold tracking-[0.2em] text-[#e8202a] uppercase">
                {t("OUR STORIES", "আমাদের গল্প")}
              </span>
              <span className="w-12 h-px bg-[#e8202a]"></span>
            </div>
            <h1 className="font-['Noto_Serif'] text-5xl md:text-8xl font-black tracking-tight leading-none text-[#1c1b1b]">
              {t("The Fan Community", "ফ্যান কমিউনিটি")}
            </h1>
          </div>
          <p className="max-w-2xl mx-auto text-[#5d3f3c] text-lg md:text-xl font-light leading-relaxed">
            {t(
              "Explore the latest fandom insights, anime merchandise updates, and community highlights from the world of pop culture.",
              "পপ কালচারের জগত থেকে সর্বশেষ ফ্যানডম অন্তর্দৃষ্টি, অ্যানিমে মার্চেন্ডাইজ আপডেট এবং কমিউনিটি হাইলাইটগুলি অন্বেষণ করুন।"
            )}
          </p>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e8202a]"></div>
          </div>
        ) : error ? (
           <div className="text-center py-20 text-red-500">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-[#5d3f3c]">
            {t("Stories Coming Soon", "গল্প শীঘ্রই আসছে")}
          </div>
        ) : (
          <>
            {/* Featured Story */}
            {featuredBlog && (
              <section className="mb-32">
                <div 
                  className="grid grid-cols-1 md:grid-cols-12 gap-0 bg-[#f6f3f2] group cursor-pointer"
                  onClick={() => navigate(`/blog/${featuredBlog._id}`)}
                >
                  <div className="md:col-span-8 overflow-hidden">
                    <img 
                      className="w-full h-[500px] object-cover transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105" 
                      src={featuredBlog.imageUrl || "https://dummyimage.com/800x500/ccc/fff"} 
                      alt={featuredBlog.title} 
                    />
                  </div>
                  <div className="md:col-span-4 p-12 flex flex-col justify-center bg-white">
                    <span className="text-[10px] font-bold tracking-widest text-[#bf0019] mb-4 block uppercase">
                      {t("Feature Story", "ফিচার স্টোরি")}
                    </span>
                    <h2 className="font-['Noto_Serif'] text-3xl font-bold mb-6 group-hover:border-l-4 group-hover:border-[#bf0019] group-hover:pl-4 transition-all duration-300">
                      {featuredBlog.title}
                    </h2>
                    <div 
                      className="text-[#5d3f3c] text-sm leading-relaxed mb-8 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: featuredBlog.description }}
                    />
                    <div className="inline-flex items-center text-[#bf0019] font-bold text-xs tracking-widest uppercase group/link relative w-max">
                      {t("READ STORY", "গল্পটি পড়ুন")}
                      <span className="ml-2 group-hover/link:translate-x-2 transition-transform duration-300">→</span>
                      <div className="absolute bottom-0 left-0 w-0 h-px bg-[#bf0019] group-hover/link:w-full transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Blog Grid */}
            {gridBlogs.length > 0 && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24 mb-32">
                {gridBlogs.map((blog) => (
                  <article 
                    key={blog._id} 
                    className="group cursor-pointer"
                    onClick={() => navigate(`/blog/${blog._id}`)}
                  >
                    <div className="overflow-hidden mb-8 aspect-[16/10]">
                      <img 
                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105" 
                        src={blog.imageUrl || "https://dummyimage.com/600x400/ccc/fff"} 
                        alt={blog.title} 
                      />
                    </div>
                    <div className="transition-all duration-300 group-hover:border-l-4 group-hover:border-[#bf0019] group-hover:pl-6">
                      <h3 className="font-bold text-2xl mb-4 text-[#1c1b1b] font-['Inter'] uppercase tracking-tight">
                        {blog.title}
                      </h3>
                      <div 
                        className="text-[#5d3f3c] text-base leading-relaxed mb-6 line-clamp-2 overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: blog.description }}
                      />
                      <div className="inline-block text-[#bf0019] font-bold text-xs tracking-widest uppercase border-b border-transparent hover:border-[#bf0019] pb-1 transition-all">
                        {t("READ STORY →", "গল্পটি পড়ুন →")}
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </>
        )}

        {/* Newsletter CTA */}
        <section className="mb-10 bg-[#313030] text-white p-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-['Noto_Serif'] text-4xl font-bold mb-4">{t("Stay in the Loop", "যুক্ত থাকুন")}</h2>
            <p className="text-white/60 text-lg">
              {t("Join 50,000+ collectors and storytellers. Weekly insights delivered to your inbox.", "৫০,০০০+ কালেক্টর এবং গল্পকারদের সাথে যুক্ত হোন। প্রতি সপ্তাহে আপনার ইনবক্সে নতুন অন্তর্দৃষ্টি।")}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input 
                className="w-full bg-transparent border-0 border-b border-white/20 focus:ring-0 focus:border-[#bf0019] py-4 px-0 text-white placeholder:text-white/30 uppercase tracking-widest text-sm transition-all outline-none" 
                placeholder={t("YOUR@EMAIL.COM", "আপনার@ইমেইল.COM")} 
                type="email" 
              />
            </div>
            <button className="bg-[#bf0019] hover:bg-[#e8202a] text-white py-4 font-bold tracking-widest uppercase text-sm transition-all active:scale-95 text-center cursor-pointer border-none">
              {t("SUBSCRIBE NOW", "সাবস্ক্রাইব করুন")}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ShowBlogs;
