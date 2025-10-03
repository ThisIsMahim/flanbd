import React, { useEffect, useRef, useState, useCallback } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./TrustedCompaniesAdmin.css";

const IMGBB_API_KEY = process.env.REACT_APP_IMGBB_API_KEY;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function CompanyCard({ company, index, moveCard, onDelete, onEdit }) {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: "COMPANY",
    hover(item) {
      if (item.index === index) return;
      moveCard(item.index, index);
      item.index = index;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "COMPANY",
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  drag(drop(ref));
  return (
    <div
      ref={ref}
      className="trusted-company-card glass-card"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img src={company.logo} alt={company.name} />
      <div className="trusted-company-name">{company.name}</div>
      <div className="trusted-company-actions">
        <button
          className="trusted-company-edit"
          onClick={() => onEdit(company)}
          title="Edit"
        >
          Edit
        </button>
        <button
          className="trusted-company-delete"
          onClick={() => onDelete(company.id)}
          title="Delete"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}

const TrustedCompaniesAdmin = () => {
  const [companies, setCompanies] = useState([]);
  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef();
  const editFileInputRef = useRef();
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({ 
    id: null, 
    name: "", 
    websiteUrl: "", 
    logo: "",
    logoFile: null,
    logoPreview: null
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/trusted-companies`);
      const data = await res.json();
      setCompanies(data);
    } catch (err) {
      setError("Failed to fetch companies");
    }
  };

  const handleLogoChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== "image/png") {
      setError("Logo must be a PNG file.");
      if (isEdit) {
        setEditData(prev => ({ ...prev, logoFile: null, logoPreview: null }));
      } else {
        setLogoFile(null);
        setLogoPreview(null);
      }
      return;
    }
    
    if (isEdit) {
      setEditData(prev => ({ 
        ...prev, 
        logoFile: file,
        logoPreview: URL.createObjectURL(file)
      }));
    } else {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
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

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Company name is required.");
      return;
    }
    if (!logoFile) {
      setError("Logo PNG file is required.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const logoUrl = await uploadToImgBB(logoFile);
      const res = await fetch(`${BACKEND_URL}/api/trusted-companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logo: logoUrl, websiteUrl }),
      });
      if (!res.ok) throw new Error("Backend save failed");
      const newCompany = await res.json();
      setCompanies((prev) => [...prev, newCompany]);
      setName("");
      setLogoFile(null);
      setLogoPreview(null);
      setWebsiteUrl("");
      setSuccessMsg("Company added successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError("Failed to upload logo or save company. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    
    try {
      await fetch(`${BACKEND_URL}/api/trusted-companies/${id}`, {
        method: "DELETE",
      });
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      setSuccessMsg("Company deleted successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError("Failed to delete company");
    }
  };

  const openEdit = (company) => {
    setEditData({ 
      id: company.id, 
      name: company.name, 
      websiteUrl: company.websiteUrl || "", 
      logo: company.logo,
      logoFile: null,
      logoPreview: null
    });
    setEditOpen(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    
    try {
      let logoUrl = editData.logo;
      
      // If a new logo file was selected, upload it
      if (editData.logoFile) {
        logoUrl = await uploadToImgBB(editData.logoFile);
      }
      
      const res = await fetch(`${BACKEND_URL}/api/trusted-companies/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: editData.name, 
          websiteUrl: editData.websiteUrl, 
          logo: logoUrl 
        }),
      });
      
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setCompanies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setEditOpen(false);
      setSuccessMsg("Company updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError("Failed to update company");
    } finally {
      setUploading(false);
    }
  };

  // Drag-and-drop reorder logic
  const moveCard = useCallback((from, to) => {
    setCompanies((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  }, []);

  const handleReorder = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/trusted-companies/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: companies.map((c) => c.id) }),
      });
      setSuccessMsg("Order saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError("Failed to save order. Please try again.");
    }
  };

  return (
    <div className="trusted-admin-container glass-container glow-border">
      <div className="trusted-admin-header">
        <AddPhotoAlternateIcon
          style={{ fontSize: 32, color: "var(--primary-blue-dark)" }}
        />
        <h2 className="trusted-admin-title">Manage Trusted Companies</h2>
      </div>
      
      <form className="trusted-admin-form" onSubmit={handleAddCompany}>
        <input
          type="text"
          placeholder="Company Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="trusted-admin-input"
          required
        />
        <input
          type="url"
          placeholder="Company Website URL (https://...)"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className="trusted-admin-input"
          pattern="https?://.+"
        />
        <input
          type="file"
          accept="image/png"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleLogoChange(e, false)}
        />
        <button
          type="button"
          className="glass-button trusted-upload-btn"
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
        >
          <AddPhotoAlternateIcon style={{ marginRight: 8 }} /> Select PNG Logo
        </button>
        {logoPreview && (
          <img
            src={logoPreview}
            alt="Preview"
            className="trusted-logo-preview"
          />
        )}
        <button
          type="submit"
          className="glass-button trusted-upload-btn"
          style={{
            background: "var(--primary-blue-light)",
            color: "var(--primary-blue-dark)",
          }}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Add Company"}
        </button>
      </form>
      
      <div className="trusted-admin-note">
        Logo must be a PNG file. Company name will be used as alt text in the
        carousel.
      </div>
      
      {error && <div className="trusted-admin-error">{error}</div>}
      
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
        <div className="trusted-admin-grid">
          {companies.map((company, idx) => (
            <CompanyCard
              key={company.id}
              company={company}
              index={idx}
              moveCard={moveCard}
              onDelete={handleDelete}
              onEdit={openEdit}
            />
          ))}
        </div>
      </DndProvider>
      
      <button
        className="glass-button trusted-reorder-btn"
        onClick={handleReorder}
        style={{ marginTop: 18 }}
      >
        Save Order
      </button>

      {editOpen && (
        <div className="trusted-edit-modal">
          <div className="trusted-edit-content glass-card">
            <h3>Edit Company</h3>
            <form onSubmit={handleEditSave} className="trusted-admin-form">
              <input
                type="text"
                className="trusted-admin-input"
                value={editData.name}
                onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
                placeholder="Company Name"
                required
              />
              
              <input
                type="url"
                className="trusted-admin-input"
                value={editData.websiteUrl}
                onChange={(e) => setEditData((d) => ({ ...d, websiteUrl: e.target.value }))}
                placeholder="Company Website URL (https://...)"
                pattern="https?://.+"
              />
              
              <input
                type="file"
                accept="image/png"
                ref={editFileInputRef}
                style={{ display: "none" }}
                onChange={(e) => handleLogoChange(e, true)}
              />
              
              <button
                type="button"
                className="glass-button trusted-upload-btn"
                onClick={() => editFileInputRef.current.click()}
                disabled={uploading}
              >
                <AddPhotoAlternateIcon style={{ marginRight: 8 }} /> 
                {editData.logoFile ? "Change PNG Logo" : "Select New PNG Logo"}
              </button>
              
              {(editData.logoPreview || editData.logo) && (
                <img
                  src={editData.logoPreview || editData.logo}
                  alt="Preview"
                  className="trusted-logo-preview"
                />
              )}
              
              <div style={{ display: 'flex', gap: 12, marginTop: '16px' }}>
                <button 
                  type="button" 
                  className="glass-button" 
                  onClick={() => setEditOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="glass-button" 
                  style={{ 
                    background: 'var(--primary-blue-light)', 
                    color: 'var(--primary-blue-dark)' 
                  }}
                  disabled={uploading}
                >
                  {uploading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustedCompaniesAdmin;