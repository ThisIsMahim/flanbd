import React from "react";
import { motion } from "framer-motion";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import "./HomeBlogSection.css"

const BlogCard = ({
  blog,
  t,
  onReadMore,
  showQuickView = false,
  onQuickView,
}) => {
  // Remove HTML tags from description for clean preview
  const getPlainText = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent || div.innerText || "";
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

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="home-blog-card-cover"
      style={{
        backgroundImage: blog.imageUrl ? `url(${blog.imageUrl})` : undefined,
        backgroundColor: !blog.imageUrl ? "var(--section-bg)" : undefined,
      }}
    >
      <div className="home-blog-card-overlay" style={{ pointerEvents: "auto", color: "var(--primary-blue-dark)", background: "var(--glass-bg)" }}>
        <h3 className="font-bold text-2xl text-primary-blue-dark mb-2">
          {blog.title}
        </h3>
        {blog.subtitle && (
          <div className="text-base font-normal mb-3" style={{ color: "var(--primary-blue-dark)" }}>
            {getPlainText(blog.subtitle)}
          </div>
        )}
        {!blog.subtitle && blog.description && (
          <div className="text-base font-normal mb-3" style={{ color: "var(--primary-blue-dark)", opacity: 0.8 }}>
            {getPlainText(blog.description).substring(0, 70)}...
          </div>
        )}
        <div className="flex flex-col w-full gap-2 mt-2">
          <button
            className="home-blog-learnmore-btn home-animated-underline"
            onClick={() => onReadMore(blog._id)}
          >
            <span className="home-underline-text">{t.readMore}</span>
          </button>
          {showQuickView && (
            <button
              className="home-blog-learnmore-btn home-animated-underline border border-[var(--primary-blue-light)] px-3 py-1 rounded"
              onClick={() => onQuickView(blog)}
              type="button"
            >
              <MenuBookIcon style={{ fontSize: 18, marginRight: 4 }} />
              <span>Quick View</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
