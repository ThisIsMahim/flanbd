import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditIcon from "@mui/icons-material/Edit";
import React, { useContext, useEffect, useState } from "react";
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

  const t = translations[language];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const data = await BlogApi.getAllBlogs();
        // Only show the latest 3 blogs on the home page
        setBlogs(data.slice(0, 3));
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

  // Refs for title and subtitle
  const titleRef = React.useRef(null);
  const subtitleRef = React.useRef(null);
  useScrollReveal(titleRef);
  useScrollReveal(subtitleRef, { delay: 0.12 });

  return isLoading ? (
    <Loader title={t.title + " Loading..."} />
  ) : (
    <section className=" md:py-12 2xl:mx-60">
      <div className="home-text-center mb-10 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2 mb-2">
          <div className="flex items-center justify-center gap-2">
            {/* <MenuBookIcon
              style={{ fontSize: 36, color: "var(--primary-blue-dark)" }}
            />
            <EditIcon
              style={{ fontSize: 30, color: "var(--primary-blue-light)" }}
            /> */}
          </div>
          {/* <div className="title-decoration visible" /> */}
        </div>
        <h2
          ref={titleRef}
          className="text-4xl font-bold mb-2 home-blog-title"
          style={{ color: 'var(--primary-blue-dark)' }}
        >
          {t.title}
        </h2>
        <p
          ref={subtitleRef}
          className="text-lg text-primary-blue-light max-w-xl mx-auto home-blog-subtitle"
        >
          {t.subtitle}
        </p>
      </div>

      {!isLoading && blogs.length > 0 && (
        <div className="home-blog-grid">
          {blogs.map((blog) => (
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
        <div className="relative group">
          <button
            className="relative group overflow-hidden px-10 py-3 text-lg flex items-center gap-3 font-semibold notebook-viewall-btn"
            style={{ minWidth: 220 }}
            onClick={() => navigate("/showblogs")}
          >
            <span className="relative z-10 flex items-center">
              <span className="tracking-wide drop-shadow-sm">
                {t.viewAllBlogs}
              </span>
            </span>
            {/* Animated background shine */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none notebook-viewall-btn-shine"></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeBlogSection;
