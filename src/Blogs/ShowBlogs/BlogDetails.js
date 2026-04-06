import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MetaData from "../../components/Layouts/MetaData";
import Loader from "../../components/Layouts/Loader";
import OptimizedImg from "../../components/common/OptimizedImg";
import BlogApi from "../api/blogApi";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const data = await BlogApi.getBlogById(id);
        if (data && data.blog) {
          setBlog(data.blog);
        } else if (data) {
          setBlog(data);
        } else {
          setError("Story not found");
        }
      } catch (err) {
        setError("Failed to load story");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-3xl font-black mb-4">{error || "Story Not Found"}</h2>
        <Link to="/stories" className="btn-account-link outline">Back to Stories</Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-wrapper">
      <MetaData title={`${blog.title} | Flan`} />
      
      <main className="blog-detail-container">
        <Link to="/stories" className="btn-back-blogs group">
          <ArrowBackIcon sx={{ fontSize: 18 }} className="group-hover:-translate-x-1 transition-transform" />
          Back to Stories
        </Link>

        <header className="blog-detail-header">
          <div className="blog-detail-meta">
            <span>{formatDate(blog.createdAt)}</span>
            <span>By {blog.author?.name || "Flan Team"}</span>
          </div>
          <h1 className="blog-detail-title">{blog.title}</h1>
        </header>

        {blog.imageUrl && (
          <OptimizedImg 
            src={blog.imageUrl} 
            alt={blog.title} 
            className="blog-detail-hero-img" 
            priority 
          />
        )}

        <article className="blog-article-body ql-editor">
          <div dangerouslySetInnerHTML={{ __html: blog.description }} />
        </article>

        <footer className="blog-detail-footer">
          <h4>Thanks for reading</h4>
          <Link to="/stories" className="btn-account-link outline inline-block">
            Read More Stories
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default BlogDetail;
