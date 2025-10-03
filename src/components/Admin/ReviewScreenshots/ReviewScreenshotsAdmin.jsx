import React, { useRef, useState, useEffect, useCallback } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./ReviewScreenshotsAdmin.css";

const IMGBB_API_KEY = process.env.REACT_APP_IMGBB_API_KEY;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function ScreenshotCard({ img, index, moveCard, onDelete }) {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: "SCREENSHOT",
    hover(item) {
      if (item.index === index) return;
      moveCard(item.index, index);
      item.index = index;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "SCREENSHOT",
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  drag(drop(ref));
  return (
    <div
      ref={ref}
      className="review-admin-card glass-card"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img src={img.url} alt="Review Screenshot" />
      <div className="review-admin-order">{index + 1}</div>
      <button
        className="review-admin-delete"
        onClick={() => onDelete(img.id)}
        title="Delete"
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

const ReviewScreenshotsAdmin = () => {
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/review-screenshots`)
      .then((res) => res.json())
      .then((data) => setScreenshots(data))
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(
      files.map((file) => ({ file, url: URL.createObjectURL(file) }))
    );
    setError("");
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error("ImgBB upload failed");
    }
  };

  const handleConfirmUpload = async () => {
    setUploading(true);
    setError("");
    try {
      for (let { file } of selectedFiles) {
        let url;
        try {
          url = await uploadToImgBB(file);
        } catch (err) {
          setError("Failed to upload to ImgBB. Please try again.");
          continue;
        }
        // POST the URL to backend
        const res = await fetch(`${BACKEND_URL}/api/review-screenshots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        if (!res.ok) throw new Error("Backend save failed");
        const newShot = await res.json();
        setScreenshots((prev) => [...prev, newShot]);
      }
      setSelectedFiles([]);
    } catch (err) {
      setError("Failed to upload one or more images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${BACKEND_URL}/api/review-screenshots/${id}`, {
      method: "DELETE",
    });
    setScreenshots((prev) => prev.filter((img) => img.id !== id));
  };

  const handleRemoveSelected = (idx) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Drag-and-drop reorder logic
  const moveCard = useCallback((from, to) => {
    setScreenshots((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  }, []);

  const handleReorder = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/review-screenshots/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: screenshots.map((img) => img.id) }),
      });
      setSuccessMsg("Order saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError("Failed to save order. Please try again.");
    }
  };

  return (
    <div className="review-admin-container glass-container glow-border">
      <div className="review-admin-header">
        <AddPhotoAlternateIcon
          style={{ fontSize: 32, color: "var(--primary-blue-dark)" }}
        />
        <h2 className="review-admin-title">Manage Review Screenshots</h2>
      </div>
      <div className="review-admin-upload-section">
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          className="glass-button review-upload-btn"
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
        >
          <AddPhotoAlternateIcon style={{ marginRight: 8 }} /> Select
          Screenshots
        </button>
        {selectedFiles.length > 0 && (
          <button
            className="glass-button review-upload-btn"
            style={{
              marginLeft: 12,
              background: "var(--primary-blue-light)",
              color: "var(--primary-blue-dark)",
            }}
            onClick={handleConfirmUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Confirm Upload"}
          </button>
        )}
      </div>
      {error && (
        <div className="review-admin-empty" style={{ color: "#d32f2f" }}>
          {error}
        </div>
      )}
      {selectedFiles.length > 0 && (
        <div className="review-admin-grid">
          {selectedFiles.map((fileObj, idx) => (
            <div className="review-admin-card glass-card" key={idx}>
              <img src={fileObj.url} alt="Preview" />
              <button
                className="review-admin-delete"
                onClick={() => handleRemoveSelected(idx)}
                title="Remove"
              >
                <DeleteIcon />
              </button>
            </div>
          ))}
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
      <DndProvider backend={HTML5Backend}>
        <div className="review-admin-grid">
          {loading && <div className="review-admin-empty">Loading...</div>}
          {!loading && screenshots.length === 0 && (
            <div className="review-admin-empty">
              No screenshots uploaded yet.
            </div>
          )}
          {screenshots.map((img, idx) => (
            <ScreenshotCard
              key={img.id}
              img={img}
              index={idx}
              moveCard={moveCard}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </DndProvider>
      <button
        className="glass-button review-reorder-btn"
        onClick={handleReorder}
        style={{ marginTop: 18 }}
      >
        Save Order
      </button>
    </div>
  );
};

export default ReviewScreenshotsAdmin;
