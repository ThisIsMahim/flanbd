import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BsPencil,
  BsTrash,
  BsPlus,
  BsImage,
  BsCheckCircle,
  BsXCircle,
  BsUpload,
  BsArrowLeft,
} from "react-icons/bs";

const BrandPageAdmin = () => {
  const [brands, setBrands] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editUploadProgress, setEditUploadProgress] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Form states
  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editLogoFile, setEditLogoFile] = useState(null);
  const [editLogoPreview, setEditLogoPreview] = useState("");
  const [editLogoUrl, setEditLogoUrl] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [brandsPerPage] = useState(5);

  // Custom Toast Notification System
  const showToast = (message, variant = "success") => {
    const id = Date.now();
    const newToast = { id, message, variant };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/brands");
      setBrands(response.data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch brands");
      showToast("Failed to load brands", "danger");
      setIsLoading(false);
    }
  };

  const handleAddModalShow = () => {
    setShowAddModal(true);
    setName("");
    setLogoFile(null);
    setLogoPreview("");
    setLogoUrl("");
    setError("");
  };

  const handleEditModalShow = (brand) => {
    setCurrentBrand(brand);
    setEditName(brand.name);
    setEditLogoUrl(brand.logo);
    setEditLogoFile(null);
    setEditLogoPreview("");
    setShowEditModal(true);
    setError("");
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        showToast("Image size should be less than 5MB", "warning");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        showToast("Image size should be less than 5MB", "warning");
        return;
      }
      setEditLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setEditLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToImgBB = async (file, isEdit = false) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            if (isEdit) {
              setEditUploadProgress(percentCompleted);
            } else {
              setUploadProgress(percentCompleted);
            }
          },
          withCredentials: false,
          crossDomain: true,
        }
      );

      showToast("Image uploaded successfully");
      return response.data.data.url;
    } catch (err) {
      console.error("ImgBB upload error:", err);
      showToast("Failed to upload image", "danger");
      throw new Error("Failed to upload image to ImgBB");
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    setError("");

    if (!logoFile) {
      showToast("Please select a logo image", "danger");
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress(0);

      // Upload to ImgBB
      const uploadedLogoUrl = await uploadImageToImgBB(logoFile);
      setLogoUrl(uploadedLogoUrl);

      // Create brand
      const newBrand = {
        name,
        logo: uploadedLogoUrl,
      };

      await axios.post("/api/brands", newBrand);
      showToast("Brand created successfully");
      setShowAddModal(false);
      fetchBrands();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to add brand";
      setError(errorMsg);
      showToast(errorMsg, "danger");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);
      let updatedLogoUrl = editLogoUrl;

      if (editLogoFile) {
        setEditUploadProgress(0);
        updatedLogoUrl = await uploadImageToImgBB(editLogoFile, true);
        setEditLogoUrl(updatedLogoUrl);
      }

      // Update brand
      const updatedBrand = {
        name: editName,
        logo: updatedLogoUrl,
      };

      await axios.put(`/api/brands/${currentBrand._id}`, updatedBrand);
      showToast("Brand updated successfully");
      setShowEditModal(false);
      fetchBrands();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to update brand";
      setError(errorMsg);
      showToast(errorMsg, "danger");
    } finally {
      setIsSubmitting(false);
      setEditUploadProgress(0);
    }
  };

  const handleDeleteBrand = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        setIsLoading(true);
        await axios.delete(`/api/brands/${id}`);
        showToast("Brand deleted successfully");
        fetchBrands();
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to delete brand";
        showToast(errorMsg, "danger");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Pagination logic
  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);
  const totalPages = Math.ceil(brands.length / brandsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toast Notification Component
  const ToastNotification = ({ message, variant, onClose }) => {
    const colorMap = {
      success: "bg-green-100 text-green-800 border-green-300",
      danger: "bg-red-100 text-red-800 border-red-300",
      warning: "bg-red-100 text-red-800 border-gold-300",
    };
    const iconMap = {
      success: <BsCheckCircle className="mr-2" />,
      danger: <BsXCircle className="mr-2" />,
      warning: <BsXCircle className="mr-2" />,
    };
    return (
      <div
        className={`fixed top-5 right-5 z-[9999] min-w-[300px] border shadow flex items-center justify-between px-4 py-3 rounded ${
          colorMap[variant] || ""
        } animate-slideIn`}
      >
        <div className="flex items-center">
          {iconMap[variant]}
          <span>{message}</span>
        </div>
        <button
          className="ml-4 text-xl font-bold focus:outline-none bg-transparent border-none"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    );
  };

  return (
    <div className="px-4 py-4 w-full">
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="mb-0 font-bold text-lg flex items-center">
              Brand Management
              <span className="ml-2 bg-gray-100 text-gray-800 rounded px-2 py-0.5 text-xs font-medium">
                {brands.length} brands
              </span>
            </h4>
          </div>
          <div className="mt-3 sm:mt-0">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium shadow"
              onClick={handleAddModalShow}
            >
              <BsPlus size={18} /> Add Brand
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          {error && (
            <div className="flex items-center bg-red-100 text-red-800 border border-red-300 rounded px-4 py-2 mb-4">
              <BsXCircle className="mr-2" size={20} />
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10">
              <svg
                className="animate-spin h-8 w-8 text-blue-600 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <p className="mt-2 text-gray-500">Loading brands...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 w-[120px]">Logo</th>
                      <th className="py-3 px-4">Brand Name</th>
                      <th className="py-3 px-4">Created</th>
                      <th className="py-3 px-4 w-[150px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBrands.length > 0 ? (
                      currentBrands.map((brand) => (
                        <tr
                          key={brand._id}
                          className="border-b last:border-b-0"
                        >
                          <td className="py-2 px-4">
                            <div className="flex items-center">
                              <img
                                src={brand.logo}
                                alt={brand.name}
                                className="rounded bg-gray-100 p-1"
                                style={{
                                  width: "60px",
                                  height: "40px",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                          </td>
                          <td className="py-2 px-4 font-semibold">
                            {brand.name}
                          </td>
                          <td className="py-2 px-4 text-gray-500 text-xs">
                            {new Date(brand.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="py-2 px-4">
                            <button
                              className="inline-flex items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-50 rounded px-2 py-1 mr-2"
                              onClick={() => handleEditModalShow(brand)}
                            >
                              <BsPencil size={14} />
                            </button>
                            <button
                              className="inline-flex items-center justify-center border border-red-600 text-red-600 hover:bg-red-50 rounded px-2 py-1"
                              onClick={() => handleDeleteBrand(brand._id)}
                            >
                              <BsTrash size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-8">
                          <BsImage
                            size={48}
                            className="text-gray-400 mx-auto mb-2"
                          />
                          <p className="text-gray-500">No brands found</p>
                          <button
                            className="mt-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded px-3 py-1 flex items-center gap-1 mx-auto"
                            onClick={handleAddModalShow}
                          >
                            <BsPlus size={14} /> Add your first brand
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {brands.length > brandsPerPage && (
                <div className="flex justify-center mt-4">
                  <nav>
                    <ul className="flex items-center space-x-1 text-xs">
                      <li>
                        <button
                          className={`px-3 py-1 rounded ${
                            currentPage === 1
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white border text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {[...Array(totalPages).keys()].map((number) => (
                        <li key={number + 1}>
                          <button
                            className={`px-3 py-1 rounded border ${
                              currentPage === number + 1
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                            onClick={() => paginate(number + 1)}
                          >
                            {number + 1}
                          </button>
                        </li>
                      ))}
                      <li>
                        <button
                          className={`px-3 py-1 rounded ${
                            currentPage === totalPages
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white border text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Brand Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center text-lg font-semibold">
                <BsPlus size={20} className="mr-2" /> Add New Brand
              </div>
              <button
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none bg-transparent border-none"
                onClick={() => !isSubmitting && setShowAddModal(false)}
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddBrand} className="px-6 py-4">
              <div className="mb-4">
                <label
                  htmlFor="brandName"
                  className="block text-sm font-medium mb-1"
                >
                  Brand Name
                </label>
                <input
                  id="brandName"
                  type="text"
                  placeholder="Enter brand name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 flex items-center">
                  <BsUpload size={16} className="mr-2" /> Brand Logo (Max 5MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  required
                  disabled={isSubmitting}
                  className="w-full border rounded px-3 py-2"
                />
                {logoPreview && (
                  <div className="mt-3 text-center">
                    <div className="border rounded inline-block p-2">
                      <img
                        src={logoPreview}
                        alt="Preview"
                        className="max-h-[120px] rounded mx-auto"
                      />
                    </div>
                  </div>
                )}
                {uploadProgress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="border border-gray-400 text-gray-700 rounded px-4 py-2 flex items-center gap-1 hover:bg-gray-100"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                >
                  <BsArrowLeft size={16} /> Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-blue-600 text-white rounded px-4 py-2 flex items-center gap-1 font-medium ${
                    isSubmitting || !logoFile
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                  disabled={isSubmitting || !logoFile}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <BsCheckCircle size={16} /> Save Brand
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center text-lg font-semibold">
                <BsPencil size={20} className="mr-2" /> Edit Brand
              </div>
              <button
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none bg-transparent border-none"
                onClick={() => !isSubmitting && setShowEditModal(false)}
                disabled={isSubmitting}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateBrand} className="px-6 py-4">
              <div className="mb-4">
                <label
                  htmlFor="editBrandName"
                  className="block text-sm font-medium mb-1"
                >
                  Brand Name
                </label>
                <input
                  id="editBrandName"
                  type="text"
                  placeholder="Enter brand name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Current Logo
                </label>
                <div className="border rounded inline-block p-2 mb-2">
                  <img
                    src={editLogoUrl}
                    alt="Current Logo"
                    className="max-h-[80px] rounded mx-auto"
                  />
                </div>
                <label className="block text-sm font-medium mb-1 flex items-center">
                  <BsUpload size={16} className="mr-2" /> Upload New Logo
                  (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditLogoChange}
                  disabled={isSubmitting}
                  className="w-full border rounded px-3 py-2"
                />
                {editLogoPreview && (
                  <div className="mt-3 text-center">
                    <div className="border rounded inline-block p-2">
                      <img
                        src={editLogoPreview}
                        alt="Preview"
                        className="max-h-[120px] rounded mx-auto"
                      />
                    </div>
                  </div>
                )}
                {editUploadProgress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Uploading...</span>
                      <span>{editUploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${editUploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="border border-gray-400 text-gray-700 rounded px-4 py-2 flex items-center gap-1 hover:bg-gray-100"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSubmitting}
                >
                  <BsArrowLeft size={16} /> Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-blue-600 text-white rounded px-4 py-2 flex items-center gap-1 font-medium ${
                    isSubmitting
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <BsCheckCircle size={16} /> Update Brand
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandPageAdmin;


