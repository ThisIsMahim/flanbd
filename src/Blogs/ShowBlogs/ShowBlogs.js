import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import { LanguageContext } from "../../utils/LanguageContext";
import BlogApi from "../api/blogApi";
import BlogCard from "../../components/home/BlogCard";
import MetaData from "../../components/Layouts/MetaData";
import "./ShowBlogs.css";

const ShowBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedBlog, setSelectedBlog] = useState(null);
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedBlog ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedBlog]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(
      language === "bangla" ? "bn-BD" : "en-US",
      options
    );
  };

  return (
    <div className="blogs-page-wrapper">
      <MetaData title={t("Stories | Flan", "গল্পসমূহ | Flan")} />
      
      <header className="blogs-hero">
        <span className="stories-badge">{t("Our Stories", "আমাদের গল্প")}</span>
        <h1>{t("The Fan Community", "ফ্যান কমিউনিটি")}</h1>
        <p>
          {t(
            "Explore the latest fandom insights, anime merchandise updates, and community highlights from the world of pop culture.",
            "পপ কালচারের জগত থেকে সর্বশেষ ফ্যানডম অন্তর্দৃষ্টি, অ্যানিমে মার্চেন্ডাইজ আপডেট এবং কমিউনিটি হাইলাইটগুলি অন্বেষণ করুন।"
          )}
        </p>
      </header>

      <div className="blogs-grid-container">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-blog-card" />
          ))
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <p className="text-secondary mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-load-more">
              {t("Retry", "আবার চেষ্টা করুন")}
            </button>
          </div>
        ) : (
          blogs.slice(0, visibleCount).map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onReadMore={(id) => navigate(`/blog/${id}`)}
              showQuickView={true}
              onQuickView={setSelectedBlog}
            />
          ))
        )}
      </div>

      {!isLoading && !error && visibleCount < blogs.length && (
        <div className="blogs-load-more">
          <button className="btn-load-more" onClick={() => setVisibleCount(c => c + 6)}>
            {t("Load More Stories", "আরও গল্প দেখুন")}
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div 
            className="blog-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div 
              className="blog-modal-card"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="blog-modal-close" onClick={() => setSelectedBlog(null)}>
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>

              <div className="blog-modal-body">
                <img src={selectedBlog.imageUrl} alt={selectedBlog.title} className="blog-modal-img" />
                <div className="blog-modal-meta">{formatDate(selectedBlog.createdAt)}</div>
                <h2 className="blog-modal-title">{selectedBlog.title}</h2>
                <div 
                  className="blog-modal-desc ql-editor" 
                  dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
                />
              </div>

              <div className="blog-modal-footer">
                <button 
                  className="btn-account-link primary"
                  onClick={() => {
                    setSelectedBlog(null);
                    navigate(`/blog/${selectedBlog._id}`);
                  }}
                >
                  {t("Read Full Story", "সম্পূর্ণ গল্প পড়ুন")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowBlogs;
