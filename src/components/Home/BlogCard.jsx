import React from "react";
import { motion } from "framer-motion";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./BlogCard.css";

const BlogCard = ({
  blog,
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

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="modern-blog-card"
    >
      <div className="mb-card-image" onClick={() => onReadMore(blog._id)}>
        <img src={blog.imageUrl} alt={blog.title} />
      </div>

      <div className="mb-card-content">
        <h3 className="mb-card-title">{blog.title}</h3>
        <p className="mb-card-desc">
          {getPlainText(blog.subtitle || blog.description).substring(0, 100)}...
        </p>

        <div className="mb-card-footer">
          <button className="mb-btn-more group" onClick={() => onReadMore(blog._id)}>
            Read Story
            <ArrowForwardIcon sx={{ fontSize: 16 }} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {showQuickView && (
            <button className="mb-btn-quick" onClick={() => onQuickView(blog)}>
              <MenuBookIcon sx={{ fontSize: 20 }} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
