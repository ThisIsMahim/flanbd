import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React from "react";

const BlogCard = ({
  blog,
  onReadMore,
  showQuickView = false,
  onQuickView,
}) => {
  const getPlainText = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent || div.innerText || "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className="group relative overflow-hidden rounded-xl cursor-pointer aspect-[4/5] bg-[#0f0f0f]"
      onClick={() => onReadMore(blog._id)}
    >
      {/* Full-bleed cover image */}
      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* Gradient overlay — strong dark at bottom, fades to transparent */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

      {/* Top tag */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2.5 py-1 bg-[#ff1837] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-md">
          Story
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        {/* Date */}
        {blog.createdAt && (
          <span className="text-white/50 text-[9px] font-bold uppercase tracking-[0.2em] block mb-2">
            {formatDate(blog.createdAt)}
          </span>
        )}

        {/* Title */}
        <h3 className="text-white font-extrabold text-[15px] leading-snug uppercase tracking-tight line-clamp-2 mb-2 group-hover:text-white/90 transition-colors">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-white/60 text-[11px] leading-relaxed line-clamp-2 mb-3 font-medium">
          {getPlainText(blog.subtitle || blog.description).substring(0, 90)}...
        </p>

        {/* CTA */}
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff1837] group-hover:gap-3 transition-all duration-300">
          Read Story
          <ArrowForwardIcon sx={{ fontSize: 13 }} />
        </span>
      </div>
    </div>
  );
};

export default BlogCard;
