import CloseIcon from "@mui/icons-material/Close";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
// import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Layouts/Loader";
import { LanguageContext } from "../../utils/LanguageContext";
import BlogApi from "../api/blogApi";
import "./ShowBlogs.css";
import BlogCard from "../../components/Home/BlogCard";

// Translations for the component
const translations = {
  english: {
    waterForLife: "Flan Stories",
    discoverInsights:
      "Discover our latest fandom stories, anime merchandise insights, and community updates from the world of anime and pop culture",
    quickView: "Quick View",
    readFull: "Read Full",
    readMore: "Read More →",
    loadMore: "Load More",
    viewFullPost: "View Full Post",
    retry: "Retry",
    failedToLoad: "Failed to load stories. Please try again later.",
  },
  bangla: {
    waterForLife: "ফ্যানের গল্প",
    discoverInsights:
      "অ্যানিমে, পপ কালচার এবং ফ্যান কমিউনিটি সম্পর্কে আমাদের সর্বশেষ গল্প, অন্তর্দৃষ্টি এবং আপডেটগুলি আবিষ্কার করুন",
    quickView: "দ্রুত দেখুন",
    readFull: "সম্পূর্ণ পড়ুন",
    readMore: "আরও পড়ুন →",
    loadMore: "আরও লোড করুন",
    viewFullPost: "সম্পূর্ণ পোস্ট দেখুন",
    retry: "পুনরায় চেষ্টা করুন",
    failedToLoad: "গল্প লোড করতে ব্যর্থ হয়েছে। পরে আবার চেষ্টা করুন।",
  },
};

const ShowBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const t = translations[language];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const data = await BlogApi.getAllBlogs();
        setBlogs(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError(t.failedToLoad);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [t]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedBlog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedBlog]);

  const showMoreBlogs = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const openBlogInNewPage = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(
      language === "bangla" ? "bn-BD" : undefined,
      options
    );
  };

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (isLoading) {
    return (
      <div className="show-blogs-container">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="show-blogs-container">
        <div className="error-message">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-btn"
            >
              {t.retry}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="show-blogs-bg min-h-screen py-10 px-2 flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full mx-auto glass-container p-6 md:p-12 rounded-2xl shadow-lg">
        <div className="blogs-header-content">
          <div className="flex items-center justify-center mb-2">
            <AutoStoriesIcon
              style={{ fontSize: 44, color: "var(--primary-blue-dark)" }}
            />
            <FavoriteIcon
              style={{
                fontSize: 32,
                color: "var(--primary-blue-light)",
                marginLeft: 8,
              }}
            />
          </div>
          <h1 className="blogs-main-title">{t.waterForLife}</h1>
          <p className="blogs-subtitle">{t.discoverInsights}</p>
        </div>
        <div className="content-wrapper">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="blogs-grid"
          >
            {blogs.slice(0, visibleCount).map((blog, index) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                t={t}
                onReadMore={openBlogInNewPage}
                showQuickView={true}
                onQuickView={setSelectedBlog}
              />
            ))}
          </motion.div>
          {visibleCount < blogs.length && (
            <motion.div
              className="see-more-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.button
                className="see-more-btn"
                onClick={showMoreBlogs}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.loadMore}
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
      {/* Modal logic: show if selectedBlog is set */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              className="modal-content glass-modal"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setSelectedBlog(null)}
              >
                <CloseIcon />
              </button>
              <div className="modal-header">
                <h2 className="modal-title">{selectedBlog.title}</h2>
                <p className="modal-date">
                  {formatDate(selectedBlog.createdAt)}
                </p>
              </div>
              <div className="modal-image-container">
                <img
                  src={selectedBlog.imageUrl}
                  alt={selectedBlog.title}
                  className="modal-image"
                />
              </div>
              <div
                className="modal-description"
                dangerouslySetInnerHTML={{
                  __html: selectedBlog.description,
                }}
              ></div>
              <div className="modal-actions">
                <motion.button
                  className="modal-full-view"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedBlog(null);
                    openBlogInNewPage(selectedBlog._id);
                  }}
                >
                  {t.viewFullPost}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowBlogs;
