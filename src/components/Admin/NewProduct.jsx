import {
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState, useMemo } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearErrors, createProduct } from "../../actions/productAction";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import QuillEditor from "../../utils/QuillEditor";
import BackdropLoader from "../Layouts/BackdropLoader";
import MetaData from "../Layouts/MetaData";

// Predefined specifications for sunglasses
const PREDEFINED_SPECIFICATIONS = [
  { title: "Lens Type", description: "Polycarbonate (lightweight, impact-resistant)" },
  { title: "UV Protection", description: "UV400 Protection - Blocks 100% of UVA and UVB rays" },
  { title: "Lens Coatings", description: "Anti-Scratch, Anti-Glare, Hydrophobic Coating" },
  { title: "Frame Material", description: "Plastic (Acetate, Polyamide) - Lightweight and durable" },
  { title: "Fit/Size", description: "Standard fit with adjustable nose pads" },
  { title: "Shape/Style", description: "Classic design suitable for all face shapes" },
  { title: "Lens Technology", description: "Polarized lenses reduce glare from reflective surfaces" },
  { title: "Additional Features", description: "Foldable design for easy storage and portability" },
];

// Helper function to reorder list
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Helper to upload a base64 image to ImgBB and return { url, public_id }
async function uploadImageToImgBB(base64Image) {
  const apiKey = process.env.REACT_APP_IMGBB_API_KEY || "YOUR_IMGBB_API_KEY";
  const formData = new FormData();
  const base64 = base64Image.includes(",")
    ? base64Image.split(",")[1]
    : base64Image;
  formData.append("image", base64);
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!data.success)
    throw new Error(data.error?.message || "ImgBB upload failed");
  return {
    url: data.data.url,
    public_id: data.data.id,
  };
}

const NewProduct = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector((state) => state.newProduct);

  const [highlights, setHighlights] = useState([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [specs, setSpecs] = useState([...PREDEFINED_SPECIFICATIONS]);
  const [specsInput, setSpecsInput] = useState({
    title: "",
    description: "",
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [cuttedPrice, setCuttedPrice] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [stock, setStock] = useState(0);
  const [warranty, setWarranty] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [isDifferentColors, setIsDifferentColors] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Build parent and children maps for category relationships
  const parentMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      const catParentId =
        typeof cat.parent === "object" ? cat.parent?._id : cat.parent;
      map[cat._id] = catParentId || null;
    });
    return map;
  }, [categories]);

  const childrenMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      const catParentId =
        typeof cat.parent === "object" ? cat.parent?._id : cat.parent;
      if (catParentId) {
        if (!map[catParentId]) map[catParentId] = [];
        map[catParentId].push(cat._id);
      }
    });
    return map;
  }, [categories]);

  // Helper to get all parent IDs for a given category
  const getAllParentIds = (catId) => {
    const parents = [];
    let current = parentMap[catId];
    while (current) {
      parents.push(current);
      current = parentMap[current];
    }
    return parents;
  };

  // Helper to get all descendant IDs for a given category
  const getAllDescendantIds = (catId) => {
    let descendants = [];
    const children = childrenMap[catId] || [];
    descendants = [...children];
    children.forEach((childId) => {
      descendants = descendants.concat(getAllDescendantIds(childId));
    });
    return descendants;
  };

  // Helper to get only leaf categories (selected categories that are not parents of any other selected category)
  const getLeafCategories = () => {
    return selectedCategories.filter((catId) => {
      // If any selected category has this as parent, it's not a leaf
      return !selectedCategories.some(
        (otherId) => parentMap[otherId] === catId
      );
    });
  };

  const handleSpecsChange = (e) => {
    setSpecsInput({ ...specsInput, [e.target.name]: e.target.value });
  };

  const addSpecs = () => {
    if (!specsInput.title.trim() || !specsInput.description.trim()) return;
    setSpecs([...specs, specsInput]);
    setSpecsInput({ title: "", description: "" });
  };

  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    setHighlights([...highlights, highlightInput]);
    setHighlightInput("");
  };

  const deleteHighlight = (index) => {
    setHighlights(highlights.filter((h, i) => i !== index));
  };

  const deleteSpec = (index) => {
    setSpecs(specs.filter((s, i) => i !== index));
  };

  const resetSpecs = () => {
    setSpecs([...PREDEFINED_SPECIFICATIONS]);
  };

  const handleSpecEdit = (index, field, value) => {
    const updatedSpecs = [...specs];
    updatedSpecs[index][field] = value;
    setSpecs(updatedSpecs);
  };

  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const imageFiles = files.filter((file) => file.type.match("image.*"));
    if (imageFiles.length !== files.length) {
      enqueueSnackbar("Some files were not images and were skipped", {
        variant: "warning",
      });
    }

    const newImages = [];
    const newImagePreviews = [];

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          newImagePreviews.push(reader.result);
          newImages.push(reader.result);

          if (newImagePreviews.length === imageFiles.length) {
            setImagesPreview((old) => [...old, ...newImagePreviews]);
            setImages((old) => [...old, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteImage = (index) => {
    setImagesPreview(imagesPreview.filter((_, i) => i !== index));
    setImages(images.filter((_, i) => i !== index));
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    if (result.source.droppableId === "highlights") {
      const items = reorder(
        highlights,
        result.source.index,
        result.destination.index
      );
      setHighlights(items);
    } else if (result.source.droppableId === "specifications") {
      const items = reorder(
        specs,
        result.source.index,
        result.destination.index
      );
      setSpecs(items);
    } else if (result.source.droppableId === "images") {
      const items = reorder(
        images,
        result.source.index,
        result.destination.index
      );
      setImages(items);

      const previewItems = reorder(
        imagesPreview,
        result.source.index,
        result.destination.index
      );
      setImagesPreview(previewItems);
    }
  };

  const newProductSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (highlights.length <= 0) {
      enqueueSnackbar("Add Highlights", { variant: "warning" });
      setIsSubmitting(false);
      return;
    }
    if (!selectedBrand) {
      enqueueSnackbar("Select a Brand", { variant: "warning" });
      setIsSubmitting(false);
      return;
    }
    if (specs.length <= 1) {
      enqueueSnackbar("Add Minimum 2 Specifications", { variant: "warning" });
      setIsSubmitting(false);
      return;
    }
    if (images.length <= 0) {
      enqueueSnackbar("Add Product Images", { variant: "warning" });
      setIsSubmitting(false);
      return;
    }
    if (selectedCategories.length === 0) {
      enqueueSnackbar("Select at least one category", { variant: "warning" });
      setIsSubmitting(false);
      return;
    }

    // Validate selectedCategories against categories fetched from backend
    console.log("Selected categories before validation:", selectedCategories);
    const validCategoryIds = categories.map((cat) => cat._id);
    const invalidCategories = selectedCategories.filter(
      (catId) => !validCategoryIds.includes(catId)
    );
    if (invalidCategories.length > 0) {
      enqueueSnackbar("One or more selected categories are invalid.", {
        variant: "error",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("cuttedPrice", cuttedPrice);
      formData.append("stock", stock);
      formData.append("warranty", warranty);
      formData.append("brandname", selectedBrand._id);
      formData.append("video_url", videoUrl);
      formData.append("isDifferentColors", String(isDifferentColors));
      formData.append("sortOrder", sortOrder);

      // Append only leaf categories as an array
      const leafCategories = getLeafCategories();
      console.log("Leaf categories being sent to backend:", leafCategories);
      leafCategories.forEach((category) => {
        formData.append("categories", category);
      });

      // Append highlights
      highlights.forEach((highlight) => {
        formData.append("highlights", highlight);
      });

      // Append specifications
      specs.forEach((spec) => {
        formData.append("specifications", JSON.stringify(spec));
      });

      // Upload images to ImgBB and collect URLs
      const uploadedImages = [];
      for (let i = 0; i < images.length; i++) {
        const imgResult = await uploadImageToImgBB(images[i]);
        uploadedImages.push(imgResult);
      }
      formData.append("images", JSON.stringify(uploadedImages));

      // Append logo
      formData.append("logo", selectedBrand.logo);

      // Await dispatch and handle backend error response
      const result = await dispatch(createProduct(formData));
      if (result && result.payload && result.payload.success === false) {
        enqueueSnackbar(result.payload.message || "Product creation failed.", {
          variant: "error",
        });
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Product Created", { variant: "success" });
      dispatch({ type: NEW_PRODUCT_RESET });
      navigate("/admin/products");
    }
  }, [dispatch, error, success, navigate, enqueueSnackbar]);

  useEffect(() => {
    const fetchBrands = async () => {
      setBrandsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/public/brands`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Handle direct array response
        setBrands(Array.isArray(data) ? data : []);
      } catch (error) {
        enqueueSnackbar("Error fetching brands", { variant: "error" });
        console.error("Error fetching brands:", error);
      } finally {
        setBrandsLoading(false);
      }
    };

    fetchBrands();
  }, [enqueueSnackbar]);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/categories`
        );
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        enqueueSnackbar("Error loading categories", { variant: "error" });
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [enqueueSnackbar]);

  // Function to get the highest sort order
  const getHighestSortOrder = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/products/highest-order`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setSortOrder(data.highestOrder);
      } else {
        // Fallback: set to 1 if API call fails
        setSortOrder(1);
      }
    } catch (error) {
      console.error('Error fetching highest order:', error);
      // Fallback: set to 1 if API call fails
      setSortOrder(1);
    }
  };

  useEffect(() => {
    getHighestSortOrder();
  }, []);

  // Helper to build nested category tree
  const buildCategoryTree = (categories, parent = null) => {
    return categories
      .filter((cat) => {
        if (!cat.parent && !parent) return true;
        if (!cat.parent || !parent) return false;
        const parentId =
          typeof parent === "object" ? parent._id || parent : parent;
        const catParentId =
          typeof cat.parent === "object" ? cat.parent._id : cat.parent;
        return catParentId === parentId;
      })
      .map((cat) => ({
        ...cat,
        children: buildCategoryTree(categories, cat._id),
      }));
  };

  // Helper to render nested checkboxes
  const renderCategoryCheckboxes = (cats, level = 0) => {
    return cats.map((category) => [
      <Box
        key={category._id}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          pl: 1 + level * 3,
          borderRadius: 1,
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <input
          type="checkbox"
          id={`category-${category._id}`}
          name="category"
          value={category._id}
          checked={selectedCategories.includes(category._id)}
          onChange={(e) => {
            const value = category._id;
            if (e.target.checked) {
              // Select this category and all its parents
              const parents = getAllParentIds(value);
              setSelectedCategories((prev) =>
                Array.from(new Set([...prev, value, ...parents]))
              );
            } else {
              // Deselect this category and all its descendants
              const descendants = getAllDescendantIds(value);
              setSelectedCategories((prev) =>
                prev.filter(
                  (cat) => cat !== value && !descendants.includes(cat)
                )
              );
            }
          }}
          style={{ marginRight: "8px" }}
        />
        <label
          htmlFor={`category-${category._id}`}
          style={{ cursor: "pointer", flex: 1 }}
        >
          {category.name}
        </label>
      </Box>,
      category.children && category.children.length > 0
        ? renderCategoryCheckboxes(category.children, level + 1)
        : null,
    ]);
  };

  return (
    <>
      <MetaData title="Admin: New Product | EyeGears" />
      {loading && <BackdropLoader />}

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "text.primary", mb: 3 }}
        >
          Create New Product
        </Typography>

        <DragDropContext onDragEnd={onDragEnd}>
          <form onSubmit={newProductSubmitHandler}>
            <Grid container spacing={4}>
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                {/* Basic Information */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: "medium", mb: 2 }}
                  >
                    Basic Information
                  </Typography>
                  <TextField
                    fullWidth
                    label="Product Name"
                    variant="outlined"
                    size="small"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ fontWeight: "medium", mb: 1 }}
                    >
                      Description
                    </Typography>
                    <Box
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        overflow: "hidden",
                        "& .ql-toolbar": {
                          border: "none",
                          borderBottom: 1,
                          borderColor: "divider",
                        },
                        "& .ql-container": {
                          border: "none",
                          minHeight: 200,
                        },
                      }}
                    >
                      <QuillEditor
                        value={description}
                        onChange={setDescription}
                        placeholder="Write product description..."
                      />
                    </Box>
                  </Box>

                  <TextField
                    fullWidth
                    label="YouTube Video URL"
                    variant="outlined"
                    size="small"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    sx={{ mt: 2 }}
                    helperText="Paste the full YouTube URL here"
                  />
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={<Switch checked={isDifferentColors} onChange={(e)=>setIsDifferentColors(e.target.checked)} />}
                      label="This product has different colors (choose by image)"
                    />
                  </Box>
                </Paper>

                {/* Pricing */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: "medium", mb: 2 }}
                  >
                    Pricing
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        variant="outlined"
                        size="small"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Cutted Price"
                        type="number"
                        variant="outlined"
                        size="small"
                        required
                        value={cuttedPrice}
                        onChange={(e) => setCuttedPrice(e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Inventory */}
                <Paper
                  elevation={0}
                  sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: "medium", mb: 2 }}
                  >
                    Inventory
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={12} lg={6}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ fontWeight: "medium" }}
                        >
                          Categories
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            maxHeight: "200px",
                            overflowY: "auto",
                            p: 1,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
                          }}
                        >
                          {categoriesLoading ? (
                            <Typography variant="body2" color="textSecondary">
                              Loading categories...
                            </Typography>
                          ) : (
                            renderCategoryCheckboxes(
                              buildCategoryTree(categories)
                            )
                          )}
                        </Box>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={3} md={6} lg={3}>
                      <TextField
                        fullWidth
                        label="Stock"
                        type="number"
                        variant="outlined"
                        size="small"
                        required
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={6} lg={3}>
                      <TextField
                        fullWidth
                        label="Warranty (months)"
                        type="number"
                        variant="outlined"
                        size="small"
                        value={warranty}
                        onChange={(e) => setWarranty(e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6}>
                {/* Highlights */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: "medium", mb: 2 }}
                  >
                    Product Highlights
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      label="Add Highlight"
                      variant="outlined"
                      size="small"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={addHighlight}
                      sx={{ minWidth: "auto", px: 2 }}
                    >
                      <AddIcon />
                    </Button>
                  </Box>
                  <Droppable droppableId="highlights">
                    {(provided) => (
                      <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        sx={{
                          maxHeight: 160,
                          overflowY: "auto",
                          p: 1,
                          bgcolor: "background.default",
                          borderRadius: 1,
                          border: 1,
                          borderColor: "divider",
                        }}
                      >
                        {highlights.map((h, i) => (
                          <Draggable
                            key={`highlight-${i}`}
                            draggableId={`highlight-${i}`}
                            index={i}
                          >
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  p: 1.5,
                                  mb: 1,
                                  bgcolor: "background.paper",
                                  borderRadius: 1,
                                  boxShadow: 1,
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    boxShadow: 2,
                                  },
                                }}
                              >
                                <Typography variant="body2">{h}</Typography>
                                <IconButton
                                  onClick={() => deleteHighlight(i)}
                                  color="error"
                                  size="small"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </Paper>

                {/* Specifications */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{ fontWeight: "medium" }}
                    >
                      Specifications
                    </Typography>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={resetSpecs}
                      size="small"
                    >
                      Reset to Default
                    </Button>
                  </Box>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        value={specsInput.title}
                        onChange={handleSpecsChange}
                        name="title"
                        label="Name"
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        value={specsInput.description}
                        onChange={handleSpecsChange}
                        name="description"
                        label="Value"
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={addSpecs}
                        fullWidth
                        sx={{ minWidth: "auto" }}
                      >
                        <AddIcon />
                      </Button>
                    </Grid>
                  </Grid>
                  <Droppable droppableId="specifications">
                    {(provided) => (
                      <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        sx={{
                          maxHeight: 240,
                          overflowY: "auto",
                          p: 1,
                          bgcolor: "background.default",
                          borderRadius: 1,
                          border: 1,
                          borderColor: "divider",
                        }}
                      >
                        {specs.map((spec, i) => (
                          <Draggable
                            key={`spec-${i}`}
                            draggableId={`spec-${i}`}
                            index={i}
                          >
                            {(provided) => (
                              <Box
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  display: "flex",
                                  gap: 2,
                                  alignItems: "center",
                                  p: 1.5,
                                  mb: 1,
                                  bgcolor: "background.paper",
                                  borderRadius: 1,
                                  boxShadow: 1,
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    boxShadow: 2,
                                  },
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: "medium",
                                    width: 120,
                                    flexShrink: 0,
                                  }}
                                >
                                  {spec.title}
                                </Typography>
                                <TextField
                                  fullWidth
                                  value={spec.description}
                                  onChange={(e) =>
                                    handleSpecEdit(
                                      i,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      "& fieldset": {
                                        borderColor: "transparent",
                                      },
                                      "&:hover fieldset": {
                                        borderColor: "divider",
                                      },
                                      "&.Mui-focused fieldset": {
                                        borderColor: "primary.main",
                                      },
                                    },
                                  }}
                                />
                                <IconButton
                                  onClick={() => deleteSpec(i)}
                                  color="error"
                                  size="small"
                                  sx={{ flexShrink: 0 }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </Paper>

                {/* Brand & Images */}
                <Paper
                  elevation={0}
                  sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2 }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: "medium", mb: 2 }}
                  >
                    Brand & Images
                  </Typography>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <FormControl className="col-span-2" size="small" required>
                      <InputLabel id="brand-select-label">Brand</InputLabel>
                      <Select
                        labelId="brand-select-label"
                        id="brand-select"
                        value={selectedBrand ? selectedBrand._id : ""}
                        label="Brand"
                        onChange={(e) => {
                          const brandId = e.target.value;
                          const brand = brands.find((b) => b._id === brandId);
                          setSelectedBrand(brand);
                          setLogoPreview(brand.logo);
                        }}
                      >
                        <MenuItem value="">
                          <em>Select Brand</em>
                        </MenuItem>
                        {brands.map((brand) => (
                          <MenuItem key={brand._id} value={brand._id}>
                            <div className="flex items-center gap-2">
                              <img
                                src={brand.logo}
                                alt={brand.name}
                                className="w-6 h-6 object-contain"
                              />
                              <span>{brand.name}</span>
                            </div>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <div className="flex items-center justify-center">
                      <div className="flex flex-col items-center">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Brand Logo"
                            className="w-16 h-16 object-contain border rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                            <ImageIcon className="text-gray-400" />
                          </div>
                        )}
                        <span className="text-xs text-gray-500 mt-1">
                          Brand Logo
                        </span>
                      </div>
                    </div>
                  </div>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ fontWeight: "medium", mb: 1 }}
                    >
                      Product Images
                    </Typography>
                    <Droppable droppableId="images" direction="horizontal">
                      {(provided) => (
                        <Box
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            minHeight: 120,
                            p: 2,
                            border: 1,
                            borderColor: "divider",
                            borderStyle: "dashed",
                            borderRadius: 1,
                            bgcolor:
                              imagesPreview.length > 0
                                ? "transparent"
                                : "action.hover",
                          }}
                        >
                          {imagesPreview.length > 0 ? (
                            imagesPreview.map((image, i) => (
                              <Draggable
                                key={`image-${i}`}
                                draggableId={`image-${i}`}
                                index={i}
                              >
                                {(provided) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    sx={{
                                      position: "relative",
                                      "&:hover .delete-btn": { opacity: 1 },
                                    }}
                                  >
                                    <img
                                      src={image}
                                      alt={`Product ${i}`}
                                      style={{
                                        width: 96,
                                        height: 96,
                                        objectFit: "cover",
                                        borderRadius: 1,
                                        border: "1px solid",
                                        borderColor: "divider",
                                      }}
                                    />
                                    <IconButton
                                      className="delete-btn"
                                      onClick={() => deleteImage(i)}
                                      sx={{
                                        position: "absolute",
                                        top: -8,
                                        right: -8,
                                        bgcolor: "error.main",
                                        color: "common.white",
                                        opacity: 0,
                                        transition: "opacity 0.2s",
                                        "&:hover": { bgcolor: "error.dark" },
                                        width: 24,
                                        height: 24,
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: 120,
                                color: "text.disabled",
                              }}
                            >
                              <ImageIcon fontSize="large" />
                            </Box>
                          )}
                          {provided.placeholder}
                        </Box>
                      )}
                    </Droppable>
                  </Box>
                  <label htmlFor="images-upload">
                    <input
                      id="images-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleProductImageChange}
                      style={{ display: "none" }}
                    />
                    <Button
                      component="span"
                      variant="outlined"
                      color="primary"
                      startIcon={<CloudUploadIcon />}
                      fullWidth
                    >
                      Upload Images
                    </Button>
                  </label>
                </Paper>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ px: 6, py: 1.5, fontWeight: "medium" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Product...
                  </div>
                ) : (
                  "Create Product"
                )}
              </Button>
            </Box>
          </form>
        </DragDropContext>
      </Paper>
    </>
  );
};

export default NewProduct;