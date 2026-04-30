import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditIcon from "@mui/icons-material/Edit";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import BlogApi from "../../Blogs/api/blogApi";
import { LanguageContext } from "../../utils/LanguageContext";
import "./HomeBlogSection.css";
import Loader from "../Layouts/Loader";
import BlogCard from "./BlogCard";
import useScrollReveal from "./hooks/useScrollReveal";

const HomeBlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  // Translations
  const translations = {
    english: {
      title: "Flan Stories",
      subtitle: "A Blog Section About Anime, Pop Culture & Fandom",
      readMore: "Read More",
      viewAllBlogs: "View All Blogs",
    },
    bangla: {
      title: "কাগজের গল্প",
      subtitle: "লেখা, সৃজনশীলতা এবং স্টেশনারি সম্পর্কে একটি ব্লগ বিভাগ",
      readMore: "আরও পড়ুন",
      viewAllBlogs: "সমস্ত ব্লগ দেখুন",
    },
  };

  const t = translations[language] || translations.english;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        // Only show the latest 3 blogs on the home page
        const response = await BlogApi.getAllBlogs();
        if (response && Array.isArray(response)) {
          setBlogs(response.slice(0, 3));
        } else {
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const openBlogInNewPage = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef(null);
  
  useScrollReveal(titleRef);
  useScrollReveal(subtitleRef, { delay: 0.12 });
  useScrollReveal(cardsRef, { delay: 0.2, y: 30 });

  return isLoading ? (
    <Loader title={t.title + " Loading..."} />
  ) : (
    <section className="bg-white py-10 md:py-14 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#ff1837]"></span>
            <span className="text-[10px] text-[#ff1837] font-black uppercase tracking-[0.25em]">Stories</span>
            <span className="w-8 h-[2px] bg-[#ff1837]"></span>
          </div>
          <h2
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f0f0f] tracking-tighter uppercase leading-[1.1]"
          >
            Flan <span className="text-gray-400">Blog</span>
          </h2>
          <p
            ref={subtitleRef}
            className="text-sm font-medium text-gray-500 max-w-xl mx-auto mt-4"
          >
            {t.subtitle}
          </p>
        </div>

        {!isLoading && blogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6" ref={cardsRef}>
            {blogs.map((blog, index) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                t={t}
                onReadMore={openBlogInNewPage}
                showQuickView={false}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <button
            className="group px-8 py-3.5 bg-[#0f0f0f] hover:bg-[#ff1837] text-white text-[10.5px] font-extrabold uppercase tracking-[0.2em] rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(255,24,55,0.5)]"
            onClick={() => navigate("/stories")}
          >
            {t.viewAllBlogs}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeBlogSection;
