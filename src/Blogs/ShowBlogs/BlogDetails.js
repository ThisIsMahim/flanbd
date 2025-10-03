import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";
import "./BlogDetail.css";
import Loader from "../../components/Layouts/Loader";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import OptimizedImg from "../../components/common/OptimizedImg";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the blog data
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/blogs/${id}`);

        if (!response.data?.blog) {
          throw new Error("Blog data not found");
        }

        setBlog(response.data.blog);
        setError(null);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load blog"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBackClick = () => {
    navigate("/showblogs");
  };

  // Render loading state with water theme
  if (isLoading) {
    return (
      <div className="blogdetail-minimal-center">
        <Loader title="Loading article..." />
      </div>
    );
  }

  // Render error state with water theme
  if (error) {
    return (
      <div className="blogdetail-minimal-center">
        <div className="blogdetail-minimal-error">
          <h2>Unable to Load Content</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate("/blogs")}
            className="blogdetail-minimal-backbtn"
          >
            ← Return to Blog
          </button>
        </div>
      </div>
    );
  }

  // Render missing state with water theme
  if (!blog) {
    return (
      <div className="blogdetail-minimal-center">
        <div className="blogdetail-minimal-error">
          <h2>Article Not Available</h2>
          <button
            onClick={() => navigate("/")}
            className="blogdetail-minimal-backbtn"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="blogdetail-minimal-bg" style={{ position: "relative" }}>
        <div
          className="blogdetail-minimal-backbtn-wrapper mt-12"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: 16,
          }}
        >
          <button
            onClick={handleBackClick}
            aria-label="Back to Blogs"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-blue-light)] text-[var(--primary-blue-dark)] font-semibold shadow-md hover:bg-[var(--primary-blue-dark)] hover:text-white transition-colors duration-200 z-20"
          >
            <ArrowBackIcon fontSize="small" />
            <span className="inline">Back to Blogs</span>
          </button>
        </div>
        <main className="blogdetail-minimal-main">
          <header className="blogdetail-minimal-header">
            <div className="blogdetail-minimal-meta">
              <span>{formatDate(blog.createdAt)}</span>
              {blog.author && (
                <>
                  <span className="blogdetail-minimal-dot">•</span>
                  <span>By {blog.author.name || "Staff Writer"}</span>
                </>
              )}
            </div>
            <h1 className="blogdetail-minimal-title">
              <MenuBookIcon
                style={{
                  fontSize: 32,
                  marginRight: 8,
                  verticalAlign: "middle",
                }}
              />
              {blog.title}
            </h1>
            {blog.imageUrl && (
              <div className="blogdetail-minimal-imagewrap">
                <OptimizedImg
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="blogdetail-minimal-image"
                  quality="85"
                  format="auto"
                  placeholder="blur"
                  priority={true}
                />
              </div>
            )}
          </header>
          <article className="blogdetail-minimal-content prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.description }} />
          </article>
        </main>
      </div>
    </>
  );
};

export default BlogDetail;
