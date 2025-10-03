import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

class BlogApi {
  static async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=ebe3dff29dbda9bc564df0cd18635710`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: false,
          crossDomain: true
        }
      );
      return response.data.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  }

  static async getAllBlogs(){
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/blogs`);
      // Extract the blogs array from the response
      return response.data.blogs || response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  };
  

  static async getBlogById(id) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      if (error.response?.status === 404) {
        throw new Error('Blog post not found');
      }
      throw new Error('Failed to load blog post. Please try again.');
    }
  }

  static async createBlog(blogData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/blogs/new`, blogData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Blog creation failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to create blog');
    }
  }

  static async updateBlog(id, blogData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/api/blog/${id}`, blogData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Blog update failed:', error);
      throw new Error(error.response?.data?.message || 'Failed to update blog');
    }
  }

  static async deleteBlog (id) {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/blog/${id}`);
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  };

  static async searchBlogs(query) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blogs/search`, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Blog search failed:', error);
      throw new Error('Failed to search blogs');
    }
  }
}

export default BlogApi;