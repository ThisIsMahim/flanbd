import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Switch, TextField, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import MetaData from "../Layouts/MetaData";

const initialForm = {
  code: "",
  type: "percent",
  value: 10,
  minOrder: 0,
  expiresAt: "",
  active: true,
  usageLimit: "",
};

const CouponAdmin = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(initialForm);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/coupons`,
        { withCredentials: true }
      );
      const mapped = (data.coupons || []).map((c) => ({
        id: c._id,
        code: c.code,
        type: c.type,
        value: c.value,
        minOrder: c.minOrder || 0,
        active: c.active,
        usageLimit: c.usageLimit ?? "",
        usedCount: c.usedCount || 0,
        expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 10) : "",
        createdAt: new Date(c.createdAt).toLocaleString(),
      }));
      setRows(mapped);
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.message || e.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        value: Number(form.value),
        minOrder: Number(form.minOrder) || 0,
        usageLimit: form.usageLimit === "" ? undefined : Number(form.usageLimit),
      };
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/coupons`,
        payload,
        { withCredentials: true }
      );
      enqueueSnackbar("Coupon created", { variant: "success" });
      setForm(initialForm);
      fetchCoupons();
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.message || e.message, { variant: "error" });
    }
  };

  const updateField = (id, field, value) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleSaveRow = async (row) => {
    try {
      const payload = {
        code: row.code,
        type: row.type,
        value: Number(row.value),
        minOrder: Number(row.minOrder) || 0,
        usageLimit: row.usageLimit === "" ? undefined : Number(row.usageLimit),
        active: Boolean(row.active),
        expiresAt: row.expiresAt ? new Date(row.expiresAt).toISOString() : undefined,
      };
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/coupons/${row.id}`,
        payload,
        { withCredentials: true }
      );
      enqueueSnackbar("Coupon updated", { variant: "success" });
      fetchCoupons();
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.message || e.message, { variant: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/admin/coupons/${id}`,
        { withCredentials: true }
      );
      enqueueSnackbar("Coupon deleted", { variant: "success" });
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.message || e.message, { variant: "error" });
    }
  };

  const columns = useMemo(
    () => [
      { field: "code", headerName: "Code", minWidth: 140, flex: 0.6, editable: true },
      {
        field: "type",
        headerName: "Type",
        minWidth: 120,
        flex: 0.5,
        renderCell: (params) => (
          <select
            className="border rounded px-2 py-1"
            value={params.row.type}
            onChange={(e) => updateField(params.row.id, "type", e.target.value)}
          >
            <option value="percent">Percent</option>
            <option value="amount">Amount</option>
          </select>
        ),
      },
      { field: "value", headerName: "Value", minWidth: 100, flex: 0.4, renderCell: (p) => (
        <input type="number" className="w-24 px-2 py-1 border rounded" value={p.row.value}
          onChange={(e) => updateField(p.row.id, "value", e.target.value)} />
      ) },
      { field: "minOrder", headerName: "Min Order", minWidth: 120, flex: 0.5, renderCell: (p) => (
        <input type="number" className="w-28 px-2 py-1 border rounded" value={p.row.minOrder}
          onChange={(e) => updateField(p.row.id, "minOrder", e.target.value)} />
      ) },
      { field: "usageLimit", headerName: "Usage Limit", minWidth: 130, flex: 0.5, renderCell: (p) => (
        <input type="number" className="w-28 px-2 py-1 border rounded" value={p.row.usageLimit}
          onChange={(e) => updateField(p.row.id, "usageLimit", e.target.value)} />
      ) },
      { field: "usedCount", headerName: "Used", minWidth: 90, flex: 0.3 },
      { field: "expiresAt", headerName: "Expires", minWidth: 140, flex: 0.6, renderCell: (p) => (
        <input type="date" className="px-2 py-1 border rounded" value={p.row.expiresAt}
          onChange={(e) => updateField(p.row.id, "expiresAt", e.target.value)} />
      ) },
      { field: "active", headerName: "Active", minWidth: 90, flex: 0.3, renderCell: (p) => (
        <Switch checked={p.row.active} onChange={(e) => updateField(p.row.id, "active", e.target.checked)} />
      ) },
      {
        field: "actions",
        headerName: "Actions",
        minWidth: 130,
        flex: 0.5,
        renderCell: (p) => (
          <div className="flex items-center gap-1">
            <IconButton size="small" onClick={() => handleSaveRow(p.row)}>
              <SaveIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => handleDelete(p.row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <MetaData title="Admin Coupons | EyeGears" />
      <h1 className="text-xl font-semibold mb-4">Coupons</h1>

      <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <TextField label="Code" size="small" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
        <TextField label="Type" size="small" select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <MenuItem value="percent">Percent</MenuItem>
          <MenuItem value="amount">Amount</MenuItem>
        </TextField>
        <TextField label="Value" size="small" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
        <TextField label="Min Order" size="small" type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
        <TextField label="Usage Limit" size="small" type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
        <TextField label="Expires At" size="small" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} InputLabelProps={{ shrink: true }} />
        <div className="flex items-center gap-2">
          <label className="text-sm">Active</label>
          <Switch checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
        </div>
        <div className="md:col-span-3">
          <button type="submit" className="nav-button px-4 py-2 rounded">Create Coupon</button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow overflow-hidden" style={{ height: 520 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSize={10}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </div>
    </div>
  );
};

export default CouponAdmin;


