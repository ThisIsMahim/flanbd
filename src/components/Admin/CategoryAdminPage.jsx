import {
  Add,
  CloudUpload,
  Delete,
  DragHandle,
  Edit,
  Star,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const IMGBB_API_KEY = "a0d1c7f2693c806b61ca26899e0a1a29";

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subtext: "",
    icon: "",
    videoLinks: [""],
    isTopSelling: false,
    parent: null,
  });
  const [iconPreview, setIconPreview] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    // Removed icon from required validation
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/categories");
      setCategories(data.categories);
    } catch (error) {
      showSnackbar("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const uploadToImgBB = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: false,
          crossDomain: true,
        }
      );

      return response.data.data.url;
    } catch (error) {
      console.error("Error uploading image to ImgBB:", error);
      showSnackbar("Failed to upload image", "error");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleIconChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setIconPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);

    const imageUrl = await uploadToImgBB(file);
    if (imageUrl) {
      setFormData({ ...formData, icon: imageUrl });
    }
  };

  const handleOpenAddModal = () => {
    setCurrentCategory(null);
    setFormData({
      name: "",
      description: "",
      subtext: "",
      icon: "",
      videoLinks: [""],
      isTopSelling: false,
      parent: null,
    });
    setIconPreview("");
    setErrors({
      name: false,
      // Removed icon from required validation
    });
    setOpenModal(true);
  };

  const handleOpenEditModal = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      subtext: category.subtext || "",
      icon: category.icon,
      videoLinks: category.videoLinks?.length ? category.videoLinks : [""],
      isTopSelling: category.isTopSelling || false,
      parent: category.parent || null,
    });
    setIconPreview(category.icon);
    setErrors({
      name: false,
      // Removed icon from required validation
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleVideoLinkChange = (index, value) => {
    const newVideoLinks = [...formData.videoLinks];
    newVideoLinks[index] = value;
    setFormData({
      ...formData,
      videoLinks: newVideoLinks,
    });
  };

  const addVideoLinkField = () => {
    setFormData({
      ...formData,
      videoLinks: [...formData.videoLinks, ""],
    });
  };

  const removeVideoLinkField = (index) => {
    const newVideoLinks = formData.videoLinks.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      videoLinks: newVideoLinks,
    });
  };

  const handleParentChange = (e) => {
    setFormData({
      ...formData,
      parent: e.target.value === "" ? null : e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {
      name: !formData.name,
      // Removed icon validation - icon is now optional
    };
    setErrors(newErrors);
    return !newErrors.name; // Only validate name is required
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const submitData = { ...formData };
      if (!submitData.parent) delete submitData.parent;
      if (currentCategory) {
        await axios.put(
          `/api/v1/admin/category/${currentCategory._id}`,
          submitData
        );
        showSnackbar("Category updated successfully", "success");
      } else {
        await axios.post("/api/v1/admin/category/new", submitData);
        showSnackbar("Category created successfully", "success");
      }
      fetchCategories();
      setOpenModal(false);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (category) => {
    setCurrentCategory(category);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentCategory(null);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/v1/admin/category/${currentCategory._id}`);
      showSnackbar("Category deleted successfully", "success");
      fetchCategories();
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      showSnackbar(message, "error");
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategories(items);

    try {
      const orderedIds = items.map((item) => item._id);
      await axios.put("/api/v1/admin/category/order", { orderedIds });
      showSnackbar("Category order updated successfully", "success");
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      showSnackbar(message, "error");
      fetchCategories(); // Revert if update fails
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Box
      sx={{ p: 3 }}
      className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-[90vh] rounded-xl"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          pb: 2,
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h4" className="font-bold text-gray-800">
          Categories Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddModal}
          sx={{
            borderRadius: "8px",
            background: "linear-gradient(45deg, #9333ea 30%, #8A39E1 90%)",
            boxShadow: "0 3px 10px rgba(138, 57, 225, 0.3)",
            "&:hover": {
              boxShadow: "0 5px 15px rgba(138, 57, 225, 0.5)",
            },
          }}
        >
          Add Category
        </Button>
      </Box>

      {loading && !categories.length ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress sx={{ color: "#8A39E1" }} />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            position: "relative",
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
          }}
        >
          <Box sx={{ minWidth: "max-content" }}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <TableContainer
                    component={Paper}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                      borderRadius: "16px",
                      overflow: "hidden",
                    }}
                  >
                    <Table>
                      <TableHead sx={{ background: "rgba(147, 51, 234, 0.1)" }}>
                        <TableRow>
                          <TableCell
                            sx={{
                              width: 50,
                              position: "sticky",
                              left: 0,
                              background: "white",
                              zIndex: 1,
                            }}
                          ></TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "#6b21a8",
                              minWidth: 150,
                              position: "sticky",
                              left: 50,
                              background: "white",
                              zIndex: 1,
                            }}
                          >
                            Name
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "#6b21a8",
                              minWidth: 200,
                            }}
                          >
                            Description
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "#6b21a8",
                              minWidth: 150,
                            }}
                          >
                            Subtext
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "#6b21a8",
                              minWidth: 100,
                            }}
                          >
                            Icon
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "#6b21a8",
                              minWidth: 120,
                            }}
                          >
                            Type
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "#6b21a8",
                              minWidth: 200,
                            }}
                          >
                            Video Links
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "#6b21a8",
                              minWidth: 120,
                            }}
                          >
                            Top Selling
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "#6b21a8",
                              minWidth: 150,
                            }}
                          >
                            Slug
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "#6b21a8",
                              minWidth: 120,
                            }}
                          >
                            Created At
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              color: "#6b21a8",
                              minWidth: 120,
                              position: "sticky",
                              right: 0,
                              background: "white",
                              zIndex: 1,
                            }}
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {categories.map((category, index) => (
                          <Draggable
                            key={category._id}
                            draggableId={category._id}
                            index={index}
                          >
                            {(provided) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                sx={{
                                  "&:hover": {
                                    background: "rgba(147, 51, 234, 0.05)",
                                  },
                                }}
                              >
                                <TableCell
                                  {...provided.dragHandleProps}
                                  sx={{
                                    position: "sticky",
                                    left: 0,
                                    background: "white",
                                    zIndex: 1,
                                  }}
                                >
                                  <DragHandle sx={{ cursor: "move" }} />
                                </TableCell>
                                <TableCell
                                  className="font-medium"
                                  sx={{
                                    minWidth: 150,
                                    position: "sticky",
                                    left: 50,
                                    background: "white",
                                    zIndex: 1,
                                  }}
                                >
                                  {category.name}
                                </TableCell>
                                <TableCell sx={{ minWidth: 200 }}>
                                  {category.description?.substring(0, 50)}
                                  {category.description?.length > 50
                                    ? "..."
                                    : ""}
                                </TableCell>
                                <TableCell sx={{ minWidth: 150 }}>
                                  {category.subtext || "-"}
                                </TableCell>
                                <TableCell sx={{ minWidth: 100 }}>
                                  {category.icon && (
                                    <img
                                      src={category.icon}
                                      alt={category.name}
                                      style={{
                                        width: 50,
                                        height: 50,
                                        objectFit: "contain",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                      }}
                                    />
                                  )}
                                </TableCell>
                                <TableCell sx={{ minWidth: 120 }}>
                                  {category.parent
                                    ? (() => {
                                        const parentCat = categories.find(
                                          (cat) => cat._id === category.parent
                                        );
                                        return parentCat
                                          ? `Subcategory of ${parentCat.name}`
                                          : `Subcategory of (${category.parent.name})`;
                                      })()
                                    : "Category"}
                                </TableCell>
                                <TableCell sx={{ minWidth: 200 }}>
                                  {category.videoLinks?.length > 0 ? (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      {category.videoLinks
                                        .slice(0, 2)
                                        .map((link, i) => (
                                          <Typography
                                            key={i}
                                            variant="caption"
                                            noWrap
                                          >
                                            {link.substring(0, 30)}
                                            {link.length > 30 ? "..." : ""}
                                          </Typography>
                                        ))}
                                      {category.videoLinks.length > 2 && (
                                        <Typography variant="caption">
                                          +{category.videoLinks.length - 2} more
                                        </Typography>
                                      )}
                                    </Box>
                                  ) : (
                                    "-"
                                  )}
                                </TableCell>
                                <TableCell sx={{ minWidth: 120 }}>
                                  {category.isTopSelling ? (
                                    <Star color="primary" />
                                  ) : (
                                    "-"
                                  )}
                                </TableCell>
                                <TableCell
                                  className="text-gray-600"
                                  sx={{ minWidth: 150 }}
                                >
                                  {category.slug}
                                </TableCell>
                                <TableCell
                                  className="text-gray-600"
                                  sx={{ minWidth: 120 }}
                                >
                                  {new Date(
                                    category.createdAt
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    minWidth: 120,
                                    position: "sticky",
                                    right: 0,
                                    background: "white",
                                    zIndex: 1,
                                  }}
                                >
                                  <IconButton
                                    color="primary"
                                    onClick={() =>
                                      handleOpenEditModal(category)
                                    }
                                    sx={{
                                      background: "rgba(59, 130, 246, 0.1)",
                                      marginRight: 1,
                                      transition: "all 0.2s",
                                      "&:hover": {
                                        background: "rgba(59, 130, 246, 0.2)",
                                      },
                                    }}
                                  >
                                    <Edit />
                                  </IconButton>
                                  <IconButton
                                    color="error"
                                    onClick={() =>
                                      handleOpenDeleteDialog(category)
                                    }
                                    sx={{
                                      background: "rgba(239, 68, 68, 0.1)",
                                      transition: "all 0.2s",
                                      "&:hover": {
                                        background: "rgba(239, 68, 68, 0.2)",
                                      },
                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
        </Box>
      )}

      {/* Add/Edit Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            padding: "8px",
          },
        }}
      >
        <DialogTitle className="border-b pb-2 font-bold text-gray-800">
          {currentCategory ? "Edit Category" : "Add New Category"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              helperText={errors.name ? "Category name is required" : ""}
              margin="normal"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#8A39E1",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#8A39E1",
                },
              }}
            />
            {/* Parent Category Dropdown */}
            <FormControl fullWidth margin="normal">
              <InputLabel id="parent-category-label">
                Parent Category
              </InputLabel>
              <Select
                labelId="parent-category-label"
                value={formData.parent || ""}
                label="Parent Category"
                onChange={handleParentChange}
              >
                <MenuItem value="">None (Top-level)</MenuItem>
                {categories
                  .filter(
                    (cat) => !currentCategory || cat._id !== currentCategory._id
                  )
                  .map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#8A39E1",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#8A39E1",
                },
              }}
            />
            <TextField
              fullWidth
              label="Subtext"
              name="subtext"
              value={formData.subtext}
              onChange={handleInputChange}
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#8A39E1",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#8A39E1",
                },
              }}
            />

            <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={formData.isTopSelling}
                onChange={handleCheckboxChange}
                name="isTopSelling"
                color="primary"
              />
              <Typography variant="body2">
                Mark as Top Selling Category
              </Typography>
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                className="font-medium text-gray-700"
              >
                Video Links (Optional)
              </Typography>
              {formData.videoLinks.map((link, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <TextField
                    fullWidth
                    value={link}
                    onChange={(e) =>
                      handleVideoLinkChange(index, e.target.value)
                    }
                    placeholder="Enter video URL"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#8A39E1",
                        },
                      },
                    }}
                  />
                  {formData.videoLinks.length > 1 && (
                    <IconButton
                      onClick={() => removeVideoLinkField(index)}
                      color="error"
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                variant="outlined"
                size="small"
                onClick={addVideoLinkField}
                startIcon={<Add />}
                sx={{
                  mt: 1,
                  borderRadius: "8px",
                  borderColor: "#8A39E1",
                  color: "#8A39E1",
                  "&:hover": {
                    borderColor: "#6b21a8",
                    background: "rgba(138, 57, 225, 0.1)",
                  },
                }}
              >
                Add Video Link
              </Button>
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography
                variant="subtitle2"
                gutterBottom
                className="font-medium text-gray-700"
              >
                Category Icon (Optional)
              </Typography>
              {iconPreview ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <img
                    src={iconPreview}
                    alt="Icon Preview"
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "contain",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setIconPreview("");
                      setFormData({ ...formData, icon: "" });
                    }}
                    sx={{
                      borderRadius: "8px",
                      borderColor: "#ef4444",
                      color: "#ef4444",
                      "&:hover": {
                        borderColor: "#dc2626",
                        background: "rgba(239, 68, 68, 0.1)",
                      },
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              ) : (
                <label htmlFor="icon-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    disabled={uploading}
                    sx={{
                      mb: 1,
                      borderRadius: "8px",
                      borderColor: "#8A39E1",
                      color: "#8A39E1",
                      "&:hover": {
                        borderColor: "#6b21a8",
                        background: "rgba(138, 57, 225, 0.1)",
                      },
                    }}
                  >
                    {uploading ? "Uploading..." : "Upload Icon"}
                  </Button>
                  <input
                    id="icon-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleIconChange}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseModal}
            sx={{
              color: "gray",
              borderRadius: "8px",
              "&:hover": {
                background: "rgba(0,0,0,0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #9333ea 30%, #8A39E1 90%)",
              color: "white",
              borderRadius: "8px",
              boxShadow: "0 3px 10px rgba(138, 57, 225, 0.3)",
              "&:hover": {
                boxShadow: "0 5px 15px rgba(138, 57, 225, 0.5)",
              },
            }}
            disabled={loading || uploading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : currentCategory ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "8px",
          },
        }}
      >
        <DialogTitle className="font-bold text-gray-800">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography className="text-gray-600">
            Are you sure you want to delete the category "
            <span className="font-medium text-gray-800">
              {currentCategory?.name}
            </span>
            "?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              color: "gray",
              borderRadius: "8px",
              "&:hover": {
                background: "rgba(0,0,0,0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{
              borderRadius: "8px",
              boxShadow: "0 3px 10px rgba(239, 68, 68, 0.3)",
              "&:hover": {
                boxShadow: "0 5px 15px rgba(239, 68, 68, 0.5)",
              },
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: "8px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryAdminPage;
