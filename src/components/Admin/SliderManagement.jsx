import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  Pencil,
  Trash,
  Plus,
  Upload as UploadIcon,
  GripVertical,
} from "react-bootstrap-icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Switch } from "@mui/material";

// Configure axios defaults
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const SLIDER_TYPE = "SLIDER_ROW";

function DraggableTableRow({
  slider,
  index,
  moveRow,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: SLIDER_TYPE,
    hover(item) {
      if (item.index === index) return;
      moveRow(item.index, index);
      item.index = index;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: SLIDER_TYPE,
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  drag(drop(ref));
  return (
    <tr
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="text-center"
    >
      <td className="p-2 border cursor-move">
        <GripVertical size={18} />
      </td>
      <td className="p-2 border">
        <img
          src={slider.imageUrl}
          alt={slider.title}
          className="w-20 h-14 object-cover mx-auto"
        />
      </td>
      <td className="p-2 border">{slider.title}</td>
      <td className="p-2 border">
        <Switch
          checked={slider.isActive}
          onChange={() => onToggleActive(slider)}
          color="primary"
          inputProps={{ "aria-label": "Active toggle" }}
        />
        <span className={slider.isActive ? "text-green-700" : "text-gray-400"}>
          {slider.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="p-2 border">
        <button
          className="bg-gold-400 px-2 py-1 mr-2 rounded"
          onClick={() => onEdit(slider)}
        >
          <Pencil size={14} />
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => onDelete(slider._id)}
        >
          <Trash size={14} />
        </button>
      </td>
    </tr>
  );
}

const SliderManagement = () => {
  const [sliders, setSliders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSlider, setCurrentSlider] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    isActive: true,
    order: 0,
    mobileContain: true,
  });

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/sliders`);
      setSliders(response.data.data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch sliders");
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToImgBB = async (file) => {
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
            setUploadProgress(percentCompleted);
          },
          withCredentials: false,
          crossDomain: true,
        }
      );
      return response.data.data.url;
    } catch (err) {
      throw new Error("Failed to upload image to ImgBB");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setIsLoading(true);
      setUploadProgress(0);

      let imageUrl = currentSlider?.imageUrl;
      if (imageFile) imageUrl = await uploadImageToImgBB(imageFile);

      const sliderData = {
        ...formData,
        imageUrl: imageUrl || formData.imageUrl,
      };

      if (currentSlider) {
        await axios.put(
          `${BACKEND_URL}/api/sliders/${currentSlider._id}`,
          sliderData
        );
      } else {
        await axios.post(`${BACKEND_URL}/api/sliders`, sliderData);
      }

      setShowModal(false);
      fetchSliders();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to save slider"
      );
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (slider) => {
    setCurrentSlider(slider);
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle,
      isActive: slider.isActive,
      order: slider.order,
      mobileContain: typeof slider.mobileContain === 'boolean' ? slider.mobileContain : true,
    });
    setImagePreview(slider.imageUrl);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      try {
        setIsLoading(true);
        await axios.delete(`${BACKEND_URL}/api/sliders/${id}`);
        fetchSliders();
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to delete slider"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddNew = () => {
    setCurrentSlider(null);
    setFormData({
      title: "",
      subtitle: "",
      isActive: true,
      order: 0,
    });
    setImagePreview("");
    setImageFile(null);
    setShowModal(true);
  };

  // Drag-and-drop reorder logic using react-dnd
  const moveRow = useCallback((from, to) => {
    setSliders((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  }, []);

  const handleSaveOrder = async () => {
    try {
      const slidersForOrder = sliders.map((slider, idx) => ({
        _id: slider._id,
        order: idx,
      }));
      await axios.post(`${BACKEND_URL}/api/sliders/reorder`, {
        sliders: slidersForOrder,
      });
      setSuccessMsg("Order saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update order"
      );
      fetchSliders(); // revert if update fails
    }
  };

  const handleToggleActive = async (slider) => {
    try {
      await axios.put(`${BACKEND_URL}/api/sliders/${slider._id}`, {
        isActive: !slider.isActive,
      });
      setSuccessMsg(
        `Slider marked as ${!slider.isActive ? "active" : "inactive"}`
      );
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchSliders();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update slider status"
      );
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Slider Management</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          onClick={handleAddNew}
        >
          <Plus /> Add Slider
        </button>
      </div>

      {error && (
        <div
          className="text-red-600 mb-4"
          style={{
            position: "fixed",
            left: "50%",
            bottom: 32,
            transform: "translateX(-50%)",
            background: "#e8f5e9",
            padding: "16px 32px",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(56,142,60,0.15)",
            zIndex: 9999,
            minWidth: 220,
            textAlign: "center",
            fontWeight: 500,
            fontSize: "1rem",
            transition: "opacity 0.3s",
          }}
        >
          {error}
        </div>
      )}
      {successMsg && (
        <div
          className="review-toast-success"
          style={{
            position: "fixed",
            left: "50%",
            bottom: 32,
            transform: "translateX(-50%)",
            background: "#e8f5e9",
            color: "#388e3c",
            padding: "16px 32px",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(56,142,60,0.15)",
            zIndex: 9999,
            minWidth: 220,
            textAlign: "center",
            fontWeight: 500,
            fontSize: "1rem",
            transition: "opacity 0.3s",
          }}
        >
          {successMsg}
        </div>
      )}

      {isLoading && !showModal ? (
        <div className="text-center my-6">
          <div className="loader" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <DndProvider backend={HTML5Backend}>
            <table className="min-w-full table-auto border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border w-8"></th>
                  <th className="p-2 border">Image</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sliders.map((slider, index) => (
                  <DraggableTableRow
                    key={slider._id}
                    slider={slider}
                    index={index}
                    moveRow={moveRow}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleActive={handleToggleActive}
                  />
                ))}
                {sliders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      No sliders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </DndProvider>
          <div className="flex justify-end mt-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
              onClick={handleSaveOrder}
              disabled={isLoading || sliders.length === 0}
            >
              Save Order
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg overflow-y-auto max-h-screen">
            <h3 className="text-xl font-bold mb-4">
              {currentSlider ? "Edit Slider" : "Add New Slider"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1">Subtitle</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-2"
                  required={!currentSlider}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-48 object-cover"
                  />
                )}
              </div>

              <div className="mb-4">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.mobileContain}
                    onChange={(e)=>setFormData({...formData, mobileContain: e.target.checked})}
                  />
                  <span>Show full image on mobile (contain)</span>
                </label>
              </div>

              {uploadProgress > 0 && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full">
                    <div
                      className="bg-blue-500 text-xs font-medium text-white text-center p-0.5 leading-none rounded-l-full"
                      style={{ width: `${uploadProgress}%` }}
                    >
                      {uploadProgress}%
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SliderManagement;

