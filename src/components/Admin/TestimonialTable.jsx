import { useEffect, useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import MetaData from '../Layouts/MetaData';

const TestimonialTable = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/v1/admin/testimonials');
      const mapped = (data?.testimonials || []).map((t) => ({
        id: t._id,
        name: t.name,
        email: t.email,
        rating: t.rating,
        message: t.message,
        imageUrl: t.imageUrl,
        role: t.role,
        // product: t.product,
        // location: t.location,
        // time: t.time,
        status: t.status,
        createdAt: t.createdAt,
      }));
      setRows(mapped);
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.message || 'Failed to load testimonials', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); // eslint-disable-next-line
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await axios.put(`/api/v1/admin/testimonial/${id}`, { status });
      enqueueSnackbar(`Marked as ${status}`, { variant: 'success' });
      fetchAll();
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.message || 'Update failed', { variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await axios.delete(`/api/v1/admin/testimonial/${id}`);
      enqueueSnackbar('Deleted', { variant: 'success' });
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      enqueueSnackbar(e?.response?.data?.message || 'Delete failed', { variant: 'error' });
    }
  };

  const columns = useMemo(() => [
    {
      field: 'image', headerName: 'Avatar', width: 90, sortable: false,
      renderCell: (params) => (
        <img src={params.row.imageUrl || '/logo192.png'} alt={params.row.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
      )
    },
    { field: 'name', headerName: 'Name', flex: 0.5, minWidth: 140 },
    { field: 'email', headerName: 'Email', flex: 0.6, minWidth: 160 },
    { field: 'rating', headerName: 'Rating', width: 90 },
    { field: 'status', headerName: 'Status', width: 110 },
    { field: 'role', headerName: 'Role', width: 140 },
    // { field: 'product', headerName: 'Product', width: 160 },
    // { field: 'location', headerName: 'Location', width: 120 },
    // { field: 'time', headerName: 'Time', width: 120 },
    { field: 'message', headerName: 'Message', flex: 1, minWidth: 220 },
    {
      field: 'actions', headerName: 'Actions', sortable: false, minWidth: 260,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button className="px-2 py-1 border rounded" onClick={() => handleStatus(params.row.id, 'approved')}>Approve</button>
          <button className="px-2 py-1 border rounded" onClick={() => handleStatus(params.row.id, 'rejected')}>Reject</button>
          <button className="px-2 py-1 border rounded" onClick={() => handleDelete(params.row.id)}>Delete</button>
        </div>
      )
    },
  ], []);

  return (
    <>
      <MetaData title="Admin: Testimonials" />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-3">Testimonials</h2>
        <div style={{ width: '100%', height: 560 }}>
          <DataGrid rows={rows} columns={columns} loading={loading} disableRowSelectionOnClick />
        </div>
      </div>
    </>
  );
};

export default TestimonialTable;


