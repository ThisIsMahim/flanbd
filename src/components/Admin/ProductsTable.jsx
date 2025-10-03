import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct } from "../../actions/productAction";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";

// Helper function to safely get category label as a string
const getCategoryLabel = (category) => {
  if (!category) return "";
  if (typeof category === "string" || typeof category === "number")
    return String(category);
  if (Array.isArray(category)) {
    return category.map(getCategoryLabel).join(", ");
  }
  if (typeof category === "object") {
    // Always prefer the .name property if present and is a string
    if (typeof category.name === "string") return category.name;
    // If .name is itself an object, recurse
    if (category.name) return getCategoryLabel(category.name);
    // Fallback: stringify the _id if present
    if (category._id) return String(category._id);
    // Last resort: JSON.stringify (but never return an object)
    return JSON.stringify(category);
  }
  return String(category);
};

// Helper function to safely stringify any value for React rendering
const safeString = (val) => {
  if (val === null || val === undefined) return "";
  if (typeof val === "object") {
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }
  return String(val);
};

const ProductsTable = ({ products }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isDeleted } = useSelector((state) => state.product);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderEdits, setOrderEdits] = useState({});

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.brand?.name.toLowerCase().includes(query) ||
        product.categories?.some((cat) =>
          cat.name.toLowerCase().includes(query)
        ) ||
        product._id.toLowerCase().includes(query)
      );
    });
    setFilteredProducts(filtered);
    setPage(0);
  }, [searchQuery, products]);

  // Clamp page within bounds whenever filtered length or rows per page changes
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil((filteredProducts?.length || 0) / rowsPerPage));
    if (page > totalPages - 1) {
      setPage(0);
    }
  }, [filteredProducts, rowsPerPage, page]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleClearSearch = () => {
    // Clear query and reset filtered list
    setSearchQuery("");
    setFilteredProducts(products);
    // Go to page 2 (index 1); clamp effect will adjust if not enough rows
    setPage(1);
    navigate("/admin/products");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
    if (isDeleted) {
      toast.success("Product Deleted Successfully");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
  }, [dispatch, error, isDeleted]);

  const handleSaveOrderChanges = async () => {
    const orders = Object.entries(orderEdits).map(([id, sortOrder]) => ({ id, sortOrder }));
    if (orders.length === 0) {
      toast.error("No changes to save");
      return;
    }
    
    try {
      const { bulkUpdateProductSort } = await import("../../actions/productAction");
      await dispatch(bulkUpdateProductSort(orders));
      setOrderEdits({});
      toast.success("Order changes saved successfully");
      
      // Refresh products list
      const { getAdminProducts } = await import("../../actions/productAction");
      dispatch(getAdminProducts());
    } catch (e) {
      toast.error("Failed to save order changes");
    }
  };

  const dgColumns = [
    { field: "id", headerName: "ID", minWidth: 200, flex: 1, headerClassName: 'super-app-theme--header' },
    {
      field: "image",
      headerName: "Image",
      minWidth: 80,
      flex: 0.3,
      sortable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <img src={params.value} alt={params.row.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
      )
    },
    { field: "name", headerName: "Name", minWidth: 200, flex: 1, headerClassName: 'super-app-theme--header' },
    {
      field: "brand",
      headerName: "Brand",
      minWidth: 160,
      flex: 0.6,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {params.row.brandLogo && (
            <img src={params.row.brandLogo} alt={params.row.brand} style={{ width: 20, height: 20, objectFit: 'contain' }} />
          )}
          <span>{params.row.brand}</span>
        </Box>
      )
    },
    {
      field: "categories",
      headerName: "Categories",
      minWidth: 220,
      flex: 1,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {(params.value || []).slice(0,3).map((c, i) => (
            <Chip key={i} label={c} size="small" sx={{ fontSize: '0.75rem' }} />
          ))}
        </Box>
      )
    },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.4, headerClassName: 'super-app-theme--header' },
    { field: "stock", headerName: "Stock", minWidth: 80, flex: 0.3, headerClassName: 'super-app-theme--header' },
    { field: "warranty", headerName: "Warranty", minWidth: 110, flex: 0.4, headerClassName: 'super-app-theme--header', valueFormatter: (p)=>`${p.value} months` },
    { 
      field: "sortOrder", 
      headerName: "Order", 
      type: 'number', 
      editable: true, 
      minWidth: 90, 
      flex: 0.3, 
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {params.value}
          {orderEdits[params.row.id] !== undefined && (
            <Chip 
              label="Modified" 
              size="small" 
              color="primary" 
              sx={{ ml: 1, fontSize: '0.6rem', height: '18px' }} 
            />
          )}
        </Box>
      )
    },
    { field: "createdAt", headerName: "Created At", minWidth: 140, flex: 0.5, headerClassName: 'super-app-theme--header' },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      flex: 0.4,
      sortable: false,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              component={Link}
              to={`/admin/product/${params.row.id}`}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const dgRows = filteredProducts.map((p) => ({
    id: String(p._id),
    image: p.images?.[0]?.url || '',
    name: p.name,
    brand: p.brand?.name || '',
    brandLogo: p.brand?.logo || '',
    categories: (p.categories || []).map((c) => typeof c === 'string' ? c : (c?.name || '')),
    price: p.price,
    stock: p.stock,
    warranty: p.warranty,
    sortOrder: p.sortOrder ?? 0,
    createdAt: new Date(p.createdAt).toLocaleDateString(),
  }));

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-medium uppercase text-gray-800">Products</h2>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/new_product"
            className="py-2 px-4 rounded-lg shadow-md font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-lg transition-all duration-200"
          >
            New Product
          </Link>
          <button
            onClick={handleSaveOrderChanges}
            className="py-2 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg transition-all duration-200"
            title="Save Order"
            disabled={Object.keys(orderEdits).length === 0}
          >
            Save Order 
          </button>
        </div>
      </div>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search products by name, brand, category or ID..."
          value={searchQuery}
          onChange={(e) => { setPage(0); setSearchQuery(e.target.value); }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClearSearch}
                  edge="end"
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "error.main",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "primary.main",
              },
            },
          }}
        />
      </Box>
      <div className="bg-white rounded-xl shadow-lg w-full overflow-hidden" style={{ height: 520 }}>
        <DataGrid
          rows={dgRows}
          columns={dgColumns}
          pageSize={rowsPerPage}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginationMode="server"
          rowCount={filteredProducts.length}
          onCellEditCommit={(params) => {
            if (params.field === 'sortOrder') {
              setOrderEdits((prev) => ({ ...prev, [params.id]: Number(params.value) }));
            }
          }}
          sx={{
            boxShadow: 0,
            border: 0,
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(138, 57, 225, 0.08)',
              borderBottom: 'none',
            },
            '& .super-app-theme--header': {
              backgroundColor: 'rgba(138, 57, 225, 0.08)',
              fontWeight: 'bold',
              color: '#6b21a8'
            },
          }}
        />
      </div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <TablePagination
          component="div"
          count={filteredProducts.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { 
            setRowsPerPage(parseInt(e.target.value, 10)); 
            setPage(0); 
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>
    </>
  );
};

export default ProductsTable;