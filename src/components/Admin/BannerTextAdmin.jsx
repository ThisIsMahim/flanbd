import axios from "axios";
import React, { useEffect, useState } from "react";

const BannerTextAdmin = () => {
  const [bannerText, setBannerText] = useState("");
  const [bannerId, setBannerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBannerText = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/banner-text`);
        if (res.data.success && res.data.bannerText) {
          setBannerText(res.data.bannerText.text);
          setBannerId(res.data.bannerText._id);
        } else {
          setBannerText("");
          setBannerId(null);
        }
      } catch (err) {
        setError("Failed to fetch banner text");
      } finally {
        setLoading(false);
      }
    };
    fetchBannerText();
  }, []);

  const handleChange = (e) => {
    setBannerText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      if (bannerId) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/v1/banner-text/${bannerId}`, { text: bannerText });
        setMessage("Banner text updated successfully.");
      } else {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/banner-text`, { text: bannerText });
        setBannerId(res.data.bannerText._id);
        setMessage("Banner text created successfully.");
      }
    } catch (err) {
      setError("Failed to save banner text");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Banner Text</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Banner Text</label>
          <input
            type="text"
            value={bannerText}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mb-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? "Saving..." : bannerId ? "Update" : "Create"}
          </button>
          {message && <div className="mt-4 text-green-600">{message}</div>}
          {error && <div className="mt-4 text-red-600">{error}</div>}
        </form>
      )}
    </div>
  );
};

export default BannerTextAdmin; 