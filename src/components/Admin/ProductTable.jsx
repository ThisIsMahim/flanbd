import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Chip, IconButton, Tooltip } from "@mui/material";
import Rating from "@mui/material/Rating";
import { DataGrid } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  clearErrors,
  deleteProduct,
  getAdminProducts,
} from "../../actions/productAction";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";
import BackdropLoader from "../Layouts/BackdropLoader";
import MetaData from "../Layouts/MetaData";
import Actions from "./Actions";

const ProductTable = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { products, error } = useSelector((state) => state.products);
  const {
    loading,
    isDeleted,
    error: deleteError,
  } = useSelector((state) => state.product);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (deleteError) {
      enqueueSnackbar(deleteError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isDeleted) {
      enqueueSnackbar("Product Deleted Successfully", { variant: "success" });
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
    dispatch(getAdminProducts());
  }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar("Product ID copied to clipboard!", { variant: "success" });
  };

  // Function to strip HTML tags and truncate text
  const truncateDescription = (html, maxLength = 100) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const text = temp.textContent || temp.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Function to extract YouTube ID from URL
  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const [orderEdits, setOrderEdits] = useState({}); // {id: sortOrder}

  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span className="truncate">{params.value}</span>
          <Tooltip title="Copy ID">
            <IconButton
              size="small"
              onClick={() => copyToClipboard(params.value)}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
    {
      field: "sortOrder",
      headerName: "Order",
      minWidth: 90,
      flex: 0.4,
      renderCell: (params) => (
        <input
          type="number"
          className="w-20 px-2 py-1 border rounded"
          defaultValue={params.value ?? 0}
          onChange={(e) =>
            setOrderEdits((prev) => ({ ...prev, [params.row.id]: Number(e.target.value) }))
          }
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <img
            src={params.row.image}
            alt={params.value}
            className="w-10 h-10 object-cover rounded"
          />
          <span className="truncate">{params.value}</span>
        </div>
      ),
    },
    {
      field: "categories",
      headerName: "Categories",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-1">
          {params.value.slice(0, 3).map((category, index) => (
            <Chip
              key={index}
              label={category.name}
              size="small"
              sx={{
                fontSize: "0.75rem",
                maxWidth: "100px",
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
            />
          ))}
          {params.value.length > 3 && (
            <Tooltip
              title={params.value
                .slice(3)
                .map((cat) => cat.name)
                .join(", ")}
            >
              <Chip
                label={`+${params.value.length - 3}`}
                size="small"
                sx={{
                  fontSize: "0.75rem",
                  backgroundColor: "rgba(138, 57, 225, 0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(138, 57, 225, 0.15)",
                  },
                }}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => (
        <div className="flex flex-col">
          <span className="text-red-500">৳{params.value}</span>
          <span className="text-gray-500 line-through text-sm">
            ৳{params.row.cprice}
          </span>
        </div>
      ),
    },
    {
      field: "stock",
      headerName: "Stock",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "rating",
      headerName: "Rating",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => (
        <Rating value={params.value} readOnly precision={0.5} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Actions
          id={params.row.id}
          deleteHandler={deleteProductHandler}
          editRoute="product"
        />
      ),
    },
  ];

  const rows = [];

  products &&
    products.forEach((item) => {
      rows.unshift({
        id: item._id,
        name: item.name,
        description: item.description,
        image: item.images[0]?.url || "",
        categories: item.categories || [],
        video_url: item.video_url || "",
        stock: item.stock,
        price: item.price,
        cprice: item.cuttedPrice,
        rating: item.ratings,
        sortOrder: item.sortOrder ?? 0,
      });
    });

  return (
    <>
              <MetaData title="Admin Products | EyeGears" />

      {loading && <BackdropLoader />}

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-medium uppercase text-gray-800">
            Products
          </h1>
          <Link
            to="/admin/new_product"
            className="py-2 px-4 rounded-lg shadow-md font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-lg transition-all duration-200"
          >
            New Product
          </Link>
         
            <button
              onClick={async () => {
                const orders = Object.entries(orderEdits).map(([id, sortOrder]) => ({ id, sortOrder }));
                if (orders.length === 0) return;
                const { bulkUpdateProductSort } = await import("../../actions/productAction");
                try {
                  await dispatch(bulkUpdateProductSort(orders));
                  enqueueSnackbar("Product order updated", { variant: "success" });
                  setOrderEdits({});
                  dispatch(getAdminProducts());
                } catch (e) {
                  enqueueSnackbar(e?.response?.data?.message || e.message, { variant: "error" });
                }
              }}
              className="py-2 px-4 rounded-lg font-medium nav-button"
            >
              Save Order
            </button>
          
        </div>
        <div
          className="bg-white rounded-xl shadow-lg w-full overflow-hidden"
          style={{ height: 470 }}
        >
          
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectIconOnClick
            sx={{
              boxShadow: 0,
              border: 0,
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgba(138, 57, 225, 0.08)",
                borderBottom: "none",
              },
              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
              "& .super-app-theme--header": {
                fontWeight: "bold",
                color: "#6b21a8",
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ProductTable;
