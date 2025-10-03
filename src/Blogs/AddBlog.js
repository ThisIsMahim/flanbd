import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AddBlog.css';
import BlogApi from './api/blogApi';

const AddBlog = ({ onAddBlog, onCancel, blog: existingBlog = null, isEditMode = false }) => {
  const [blogData, setBlogData] = useState({
    title: '',
    description: '',
    image: null,
    previewImage: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize form with existing blog data when in edit mode
  useEffect(() => {
    if (isEditMode && existingBlog) {
      setBlogData({
        title: existingBlog.title || '',
        description: existingBlog.description || '',
        image: null,
        previewImage: existingBlog.imageUrl || null
      });
    }
  }, [isEditMode, existingBlog]);

  // ReactQuill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'direction',
    'align',
    'link', 'image', 'video'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setBlogData(prev => ({ ...prev, description: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogData(prev => ({
          ...prev,
          image: file,
          previewImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!blogData.title.trim()) {
      setErrorMessage('Please enter a blog title');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    if (!blogData.description.trim() || blogData.description === '<p><br></p>') {
      setErrorMessage('Please enter blog content');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    if (!isEditMode && !blogData.image && !blogData.previewImage) {
      setErrorMessage('Please upload a featured image');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      let imageUrl = blogData.previewImage;
      
      // Only upload new image if one was selected
      if (blogData.image) {
        imageUrl = await BlogApi.uploadImage(blogData.image);
      }

      const blogPayload = {
        title: blogData.title,
        description: blogData.description,
        imageUrl: imageUrl || '',
        ...(isEditMode && { _id: existingBlog._id }) // Include ID if in edit mode
      };

      const result = isEditMode 
        ? await BlogApi.updateBlog(existingBlog._id, blogPayload)
        : await BlogApi.createBlog(blogPayload);
      
      onAddBlog(result);
      setSuccessMessage(`Blog ${isEditMode ? 'updated' : 'added'} successfully!`);
      
      if (!isEditMode) {
        setBlogData({
          title: '',
          description: '',
          image: null,
          previewImage: null
        });
      }
    } catch (error) {
      setErrorMessage(`Failed to ${isEditMode ? 'update' : 'add'} blog. Please try again.`);
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div className="Add-Blog-Dash-container Add-Blog-Dash-fade-in">
      <h2 className="Add-Blog-Dash-title">
        {isEditMode ? 'Edit Blog Post' : 'Add New Blog Post'}
      </h2>
      
      <form onSubmit={handleSubmit} className="Add-Blog-Dash-form">
        <div className="Add-Blog-Dash-form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={blogData.title}
            onChange={handleChange}
            placeholder="Enter blog title"
            className="Add-Blog-Dash-form-input"
          />
        </div>
        
        <div className="Add-Blog-Dash-form-group">
          <label>Content</label>
          <ReactQuill
            value={blogData.description}
            onChange={handleDescriptionChange}
            modules={modules}
            formats={formats}
            className="Add-Blog-Dash-quill"
            placeholder="Write your blog content here..."
          />
        </div>
        
        <div className="Add-Blog-Dash-form-group">
          <label htmlFor="image">Featured Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="Add-Blog-Dash-form-file"
          />
          <label htmlFor="image" className="Add-Blog-Dash-file-label">
            {blogData.image ? 'Change Image' : (blogData.previewImage ? 'Change Image' : 'Choose Image')}
          </label>
          
          {blogData.previewImage && (
            <div className="Add-Blog-Dash-image-preview-container">
              <img 
                src={blogData.previewImage} 
                alt="Preview" 
                className="Add-Blog-Dash-image-preview"
              />
            </div>
          )}
        </div>
        
        <div className="Add-Blog-Dash-button-group">
          <button 
            type="button" 
            className="Add-Blog-Dash-cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="Add-Blog-Dash-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isEditMode ? 'Updating...' : 'Adding...') 
              : (isEditMode ? 'Update Blog' : 'Add Blog')}
          </button>
        </div>
        
        {successMessage && (
          <div className="Add-Blog-Dash-success-message">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="Add-Blog-Dash-error-message">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddBlog;