import React, { useEffect, useState } from 'react';
import AddBlog from './AddBlog';
import './BlogTable.css';
import BlogApi from './api/blogApi';

const BlogTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const blogsPerPage = 5;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await BlogApi.getAllBlogs();
        setBlogs(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load blogs');
        setIsLoading(false);
        console.error('Error:', err);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await BlogApi.deleteBlog(id);
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (err) {
        console.error('Error deleting blog:', err);
        setError('Failed to delete blog');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleAddBlog = (newBlog) => {
    setBlogs([newBlog, ...blogs]);
    setShowAddModal(false);
  };

  const handleEditBlog = (updatedBlog) => {
    setBlogs(blogs.map(blog => 
      blog._id === updatedBlog._id ? updatedBlog : blog
    ));
    setShowEditModal(false);
    setEditingBlog(null);
  };

  const startEditing = (blog) => {
    setEditingBlog(blog);
    setShowEditModal(true);
  };

  const filteredBlogs = blogs.filter(blog => {
    const title = blog.title || '';
    const description = blog.description || '';
    const searchLower = searchTerm.toLowerCase();
    
    return title.toLowerCase().includes(searchLower) ||
           description.toLowerCase().includes(searchLower);
  });

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  if (isLoading) {
    return (
      <div className="blog-dash-container">
        <div className="blog-dash-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="blog-dash-container blog-dash-fade-in">
      <div className="blog-dash-header">
        <h2 className="blog-dash-title">Manage Blog Posts</h2>
        <button 
          className="blog-dash-add-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add Blog
        </button>
      </div>
      
      {error && (
        <div className="blog-dash-error-message blog-dash-slide-down">
          {error}
        </div>
      )}
      
      <div className="blog-dash-search-container">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="blog-dash-search-input"
        />
      </div>
      
      <div className="blog-dash-table-responsive">
        <table className="blog-dash-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBlogs.length > 0 ? (
              currentBlogs.map(blog => (
                <tr key={blog._id} className="blog-dash-table-row">
                  <td>
                    {blog.imageUrl && (
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title || 'Blog image'} 
                        className="blog-dash-table-image"
                      />
                    )}
                  </td>
                  <td className="blog-dash-title-cell">{blog.title || 'Untitled'}</td>
                  <td className="blog-dash-description-cell">
                    {(() => {
                      const description = blog.description || '';
                      const strippedDescription = stripHtmlTags(description);
                      return strippedDescription.length > 100 
                        ? `${strippedDescription.substring(0, 100)}...` 
                        : strippedDescription;
                    })()}
                  </td>
                  <td>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'No date'}</td>
                  <td className="blog-dash-actions-cell">
                    <button 
                      onClick={() => startEditing(blog)}
                      className="blog-dash-action-btn blog-dash-edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(blog._id)}
                      className="blog-dash-action-btn blog-dash-delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="blog-dash-no-blogs">
                  {searchTerm ? 'No matching blogs found' : 'No blogs added yet'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredBlogs.length > blogsPerPage && (
        <div className="blog-dash-pagination">
          {Array.from({ length: Math.ceil(filteredBlogs.length / blogsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`blog-dash-page-btn ${currentPage === index + 1 ? 'blog-dash-active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Add Blog Modal */}
      {showAddModal && (
        <div className="blog-dash-modal-overlay">
          <div className="blog-dash-modal">
            <div className="blog-dash-modal-header">
              <h3>Add New Blog</h3>
              <button 
                className="blog-dash-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="blog-dash-modal-content">
              <AddBlog 
                onAddBlog={handleAddBlog} 
                onCancel={() => setShowAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {showEditModal && editingBlog && (
        <div className="blog-dash-modal-overlay">
          <div className="blog-dash-modal">
            <div className="blog-dash-modal-header">
              <h3>Edit Blog</h3>
              <button 
                className="blog-dash-modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingBlog(null);
                }}
              >
                &times;
              </button>
            </div>
            <div className="blog-dash-modal-content">
              <AddBlog 
                blog={editingBlog} 
                onAddBlog={handleEditBlog} 
                onCancel={() => {
                  setShowEditModal(false);
                  setEditingBlog(null);
                }}
                isEditMode={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogTable;