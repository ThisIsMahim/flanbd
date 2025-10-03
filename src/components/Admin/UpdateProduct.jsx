import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearErrors,
  getProductDetails,
  updateProduct,
} from "../../actions/productAction";
import {
  REMOVE_PRODUCT_DETAILS,
  UPDATE_PRODUCT_RESET,
} from "../../constants/productConstants";
import QuillEditor from "../../utils/QuillEditor";
import { categories } from "../../utils/constants";
import BackdropLoader from "../Layouts/BackdropLoader";
import MetaData from "../Layouts/MetaData";

// DnD types
const DND_TYPE_HIGHLIGHT = "HIGHLIGHT";
const DND_TYPE_SPEC = "SPEC";
const DND_TYPE_IMAGE = "IMAGE";

function DraggableItem({ type, index, moveItem, children }) {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: type,
    hover(item) {
      if (item.index === index) return;
      moveItem(item.index, index);
      item.index = index;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  drag(drop(ref));
  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  );
}

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();

  const { loading, product, error } = useSelector(
    (state) => state.productDetails
  );
  const {
    loading: updateLoading,
    isUpdated,
    error: updateError,
  } = useSelector((state) => state.product);

  const [highlights, setHighlights] = useState([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [specs, setSpecs] = useState([]);
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
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [imageOrderChanged, setImageOrderChanged] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);

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

  const handleSpecsChange = (e) => {
    setSpecsInput({ ...specsInput, [e.target.name]: e.target.value });
  };

  const handleSpecEdit = (index, field, value) => {
    const updatedSpecs = [...specs];
    updatedSpecs[index][field] = value;
    setSpecs(updatedSpecs);
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      enqueueSnackbar("Please select an image file", { variant: "error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setLogoPreview(reader.result);
        setLogo(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        return {
          public_id: data.data.id,
          url: data.data.url,
        };
      } else {
        throw new Error(data.error?.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleProductImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const imageFiles = files.filter((file) => file.type.match("image.*"));
    if (imageFiles.length !== files.length) {
      enqueueSnackbar("Some files were not images and were skipped", {
        variant: "warning",
      });
    }

    try {
      const uploadPromises = imageFiles.map((file) => uploadImageToImgBB(file));

      let completedUploads = 0;
      const totalUploads = uploadPromises.length;

      const results = await Promise.all(
        uploadPromises.map((promise) =>
          promise.then((result) => {
            completedUploads++;
            setUploadProgress(
              Math.round((completedUploads / totalUploads) * 100)
            );
            return result;
          })
        )
      );

      const newImages = results.filter(Boolean);
      const newImagePreviews = newImages.map((img) => img.url);

      setImages((prev) => [...prev, ...newImages]);
      setImagesPreview((prev) => [...prev, ...newImagePreviews]);
      setImageOrderChanged(true);

      enqueueSnackbar("Images uploaded successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to upload some images", { variant: "error" });
      console.error("Image upload error:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteImage = (index) => {
    const updatedImagesPreview = [...imagesPreview];
    const updatedOldImages = [...oldImages];
    const updatedImages = [...images];

    if (index < oldImages.length) {
      updatedOldImages.splice(index, 1);
      setOldImages(updatedOldImages);
    } else {
      const adjustedIndex = index - oldImages.length;
      updatedImages.splice(adjustedIndex, 1);
      setImages(updatedImages);
    }

    updatedImagesPreview.splice(index, 1);
    setImagesPreview(updatedImagesPreview);
    setImageOrderChanged(true);
  };

  const newProductSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("cuttedPrice", cuttedPrice);
    formData.append("stock", stock);
    formData.append("warranty", warranty);
    formData.append("brandname", selectedBrand._id);
    formData.append("video_url", videoUrl);
    formData.append("sortOrder", sortOrder);

    // Only submit leaf categories (like NewProduct.jsx)
    const leafCategories = getLeafCategories().filter(
      (id) =>
        typeof id === "string" &&
        id.length === 24 &&
        /^[a-fA-F0-9]{24}$/.test(id)
    );
    console.log("Leaf categories being sent to backend:", leafCategories);
    if (leafCategories.length > 0) {
      formData.append("categories", JSON.stringify(leafCategories));
    }

    // Handle highlights
    if (highlights.length > 0) {
      highlights.forEach((highlight) => {
        formData.append("highlights", highlight);
      });
    }

    // Handle specifications
    if (specs.length > 0) {
      specs.forEach((spec) => {
        const { _id, ...specWithoutId } = spec;
        formData.append("specifications", JSON.stringify(specWithoutId));
      });
    }

    // Handle brand logo
    if (logo) {
      formData.append("logo", logo);
    } else if (selectedBrand && selectedBrand.logo) {
      // If no new logo is uploaded, send the existing logo data
      if (typeof selectedBrand.logo === "string") {
        formData.append("brandLogo", selectedBrand.logo);
      } else if (selectedBrand.logo.url) {
        // Ensure we include both public_id and url
        const logoData = {
          public_id:
            selectedBrand.logo.public_id ||
            selectedBrand.logo.url.split("/").pop().split(".")[0],
          url: selectedBrand.logo.url,
        };
        formData.append("brandLogo", JSON.stringify(logoData));
      }
    }

    // Handle product images - IMPROVED to handle array of objects correctly
    if (images.length > 0) {
      // Send images as a proper JSON string in the form data
      formData.append("images", JSON.stringify(images));
      console.log("Images being sent to backend:", images);
    }

    // Handle old images
    if (oldImages.length > 0) {
      oldImages.forEach((image) => {
        formData.append("oldImages", image.url);
      });
    }

    // Add image order if changed
    if (imageOrderChanged) {
      const imageOrder = imagesPreview.map((img, index) => {
        if (index < oldImages.length) {
          return `old-${oldImages[index].url}`;
        } else {
          const newIndex = index - oldImages.length;
          return `new-${images[newIndex].url}`;
        }
      });
      formData.append("imageOrderChanged", "true");
      formData.append("imageOrder", JSON.stringify(imageOrder));
    }

    dispatch(updateProduct(params.id, formData));
  };

  // DnD move handlers
  const moveHighlight = useCallback((from, to) => {
    setHighlights((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  }, []);
  const moveSpec = useCallback((from, to) => {
    setSpecs((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  }, []);
  const moveImage = useCallback(
    (from, to) => {
      setImagesPreview((prev) => {
        const updated = [...prev];
        const [moved] = updated.splice(from, 1);
        updated.splice(to, 0, moved);
        return updated;
      });
      // Also update images/oldImages order accordingly
      if (from < oldImages.length && to < oldImages.length) {
        setOldImages((prev) => {
          const updated = [...prev];
          const [moved] = updated.splice(from, 1);
          updated.splice(to, 0, moved);
          return updated;
        });
      } else if (from >= oldImages.length && to >= oldImages.length) {
        setImages((prev) => {
          const adjustedFrom = from - oldImages.length;
          const adjustedTo = to - oldImages.length;
          const updated = [...prev];
          const [moved] = updated.splice(adjustedFrom, 1);
          updated.splice(adjustedTo, 0, moved);
          return updated;
        });
      }
      setImageOrderChanged(true);
    },
    [oldImages.length]
  );

  const productId = params.id;

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
    if (product && product._id === productId) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCuttedPrice(product.cuttedPrice);

      // Set initial categories (will be enhanced when categories data is loaded)
      const initialCategories = (product.categories || []).map((cat) =>
        typeof cat === "object" ? cat._id : cat
      );
      setSelectedCategories(initialCategories);

      setStock(product.stock);
      setWarranty(product.warranty);
      setSortOrder(product.sortOrder || 0);
      setSelectedBrand(product.brand);
      setBrand(product.brand.name);
      setVideoUrl(product.video_url || "");
      setHighlights(product.highlights);
      setSpecs(product.specifications);
      setOldImages(product.images);
      setImagesPreview(product.images.map((img) => img.url));
      setLogoPreview(product.brand.logo);
    } else {
      dispatch(getProductDetails(productId));
    }

    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (updateError) {
      enqueueSnackbar(updateError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isUpdated) {
      enqueueSnackbar("Product Updated Successfully", { variant: "success" });
      dispatch({ type: UPDATE_PRODUCT_RESET });
      dispatch({ type: REMOVE_PRODUCT_DETAILS });
      navigate("/admin/products");
    }
  }, [
    dispatch,
    error,
    updateError,
    isUpdated,
    productId,
    product,
    navigate,
    enqueueSnackbar,
  ]);

  // Handle category selection when categories data becomes available
  useEffect(() => {
    if (product && categories.length > 0 && selectedCategories.length > 0) {
      // Get the current product categories
      const productCategoryIds = (product.categories || []).map((cat) =>
        typeof cat === "object" ? cat._id : cat
      );

      // Check if we need to enhance the selection with parent categories
      const needsEnhancement = productCategoryIds.some((catId) => {
        const category = categories.find((cat) => cat._id === catId);
        return (
          category &&
          category.parent &&
          !selectedCategories.includes(category.parent)
        );
      });

      if (needsEnhancement) {
        // Add parent categories for all selected categories
        const enhancedCategories = new Set(selectedCategories);
        productCategoryIds.forEach((catId) => {
          const category = categories.find((cat) => cat._id === catId);
          if (category && category.parent) {
            enhancedCategories.add(category.parent);
          }
        });
        setSelectedCategories(Array.from(enhancedCategories));
      }
    }
  }, [product, categories, selectedCategories]);

  useEffect(() => {
    if (product && product.brand) {
      setSelectedBrand(product.brand);
      setBrand(product.brand.name);
      // Handle both string and object logo formats
      if (typeof product.brand.logo === "string") {
        setLogoPreview(product.brand.logo);
      } else if (product.brand.logo && product.brand.logo.url) {
        setLogoPreview(product.brand.logo.url);
      }
    }
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/categories`
        );
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories); // Store full objects
        }
      } catch (error) {
        enqueueSnackbar("Error loading categories", { variant: "error" });
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, [enqueueSnackbar]);

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

  // Helper to get only leaf categories (selected categories that are not parents of any other selected category)
  const getLeafCategories = () => {
    return selectedCategories.filter((catId) => {
      // If any selected category has this as parent, it's not a leaf
      return !selectedCategories.some(
        (otherId) => parentMap[otherId] === catId
      );
    });
  };

  return (
    <>
      <MetaData title="Admin: Update Product | EyeGears" />

      {loading && <BackdropLoader />}
      {updateLoading && <BackdropLoader />}

      <div className="bg-white p-6 rounded-xl shadow-sm mb-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Update Product
          </h1>

          <DndProvider backend={HTML5Backend}>
            <form
              onSubmit={newProductSubmitHandler}
              className="bg-white rounded-lg pb-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">
                      Basic Information
                    </h2>
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
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <div className="relative">
                        <QuillEditor
                          value={description}
                          onChange={setDescription}
                          placeholder="Write product description..."
                          style={{
                            height: "200px",
                            marginBottom: "40px",
                            overflowY: "auto",
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  {/* Separate YouTube URL section with more spacing */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">
                      Video Information
                    </h2>
                    <TextField
                      fullWidth
                      label="YouTube Video URL"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      helperText="Paste the full YouTube URL here"
                    />
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">
                      Pricing
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <TextField
                        label="Price"
                        type="number"
                        variant="outlined"
                        size="small"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                      <TextField
                        label="Cutted Price"
                        type="number"
                        variant="outlined"
                        size="small"
                        required
                        value={cuttedPrice}
                        onChange={(e) => setCuttedPrice(e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </div>
                  </div>

                  {/* Inventory */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">
                      Inventory
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
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
                      <TextField
                        label="Stock"
                        type="number"
                        variant="outlined"
                        size="small"
                        required
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                      <TextField
                        label="Warranty (months)"
                        type="number"
                        variant="outlined"
                        size="small"
                        required
                        value={warranty}
                        onChange={(e) => setWarranty(e.target.value)}
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Highlights */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">
                      Product Highlights
                    </h2>
                    <div className="flex gap-2 mb-3">
                      <TextField
                        fullWidth
                        value={highlightInput}
                        onChange={(e) => setHighlightInput(e.target.value)}
                        label="Add Highlight"
                        variant="outlined"
                        size="small"
                      />
                      <button
                        type="button"
                        onClick={addHighlight}
                        className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <AddIcon />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {highlights.map((h, i) => (
                        <DraggableItem
                          key={`highlight-${i}`}
                          type={DND_TYPE_HIGHLIGHT}
                          index={i}
                          moveItem={moveHighlight}
                        >
                          <div className="flex justify-between items-center bg-white p-2 rounded border">
                            <span className="text-gray-700">{h}</span>
                            <button
                              type="button"
                              onClick={() => deleteHighlight(i)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </div>
                        </DraggableItem>
                      ))}
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">
                      Specifications
                    </h2>
                    <div className="grid grid-cols-5 gap-2 mb-3">
                      <TextField
                        className="col-span-2"
                        value={specsInput.title}
                        onChange={handleSpecsChange}
                        name="title"
                        label="Name"
                        variant="outlined"
                        size="small"
                      />
                      <TextField
                        className="col-span-2"
                        value={specsInput.description}
                        onChange={handleSpecsChange}
                        name="description"
                        label="Value"
                        variant="outlined"
                        size="small"
                      />
                      <button
                        type="button"
                        onClick={addSpecs}
                        className="flex items-center justify-center h-12 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <AddIcon />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {specs.map((spec, i) => (
                        <DraggableItem
                          key={`spec-${i}`}
                          type={DND_TYPE_SPEC}
                          index={i}
                          moveItem={moveSpec}
                        >
                          <div className="grid grid-cols-5 gap-2 items-center bg-white p-2 rounded border">
                            <span className="col-span-2 text-gray-700 font-medium">
                              {spec.title}
                            </span>
                            <TextField
                              className="col-span-2"
                              value={spec.description}
                              onChange={(e) =>
                                handleSpecEdit(i, "description", e.target.value)
                              }
                              variant="standard"
                              size="small"
                              InputProps={{
                                disableUnderline: true,
                                style: { padding: "2px 4px" },
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => deleteSpec(i)}
                              className="text-red-500 hover:text-red-700 justify-self-end"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </div>
                        </DraggableItem>
                      ))}
                    </div>
                  </div>

                  {/* Brand & Images */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">
                      Brand & Images
                    </h2>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <Grid item xs={12} sm={6} md={12} lg={6}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{ fontWeight: "medium" }}
                          >
                            Brand
                          </Typography>
                          <Select
                            value={selectedBrand?._id || ""}
                            onChange={(e) => {
                              const brand = brands.find(
                                (b) => b._id === e.target.value
                              );
                              setSelectedBrand(brand);
                              setBrand(brand.name);
                              setLogoPreview(brand.logo);
                            }}
                            disabled={brandsLoading}
                          >
                            {brands.map((brand) => (
                              <MenuItem key={brand._id} value={brand._id}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    style={{
                                      width: 24,
                                      height: 24,
                                      objectFit: "contain",
                                    }}
                                  />
                                  <Typography>{brand.name}</Typography>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                          {brandsLoading && (
                            <Typography variant="caption" color="textSecondary">
                              Loading brands...
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                      <div className="flex items-center justify-center">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                            ref={logoInputRef}
                          />
                          <div className="flex flex-col items-center">
                            {logoPreview ? (
                              <div className="relative">
                                <img
                                  src={logoPreview}
                                  alt="Brand Logo"
                                  className="w-16 h-16 object-contain border rounded"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">
                                  {selectedBrand?.name || "Brand Logo"}
                                </div>
                              </div>
                            ) : (
                              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                                <ImageIcon className="text-gray-400" />
                              </div>
                            )}
                            <span className="text-xs text-gray-500 mt-1">
                              {selectedBrand?.name || "Brand Logo"}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Images
                      </label>
                      <div className="flex flex-wrap gap-2 min-h-32 p-2 border border-dashed border-gray-300 rounded-lg">
                        {imagesPreview.length > 0 ? (
                          imagesPreview.map((image, i) => (
                            <DraggableItem
                              key={`image-${i}`}
                              type={DND_TYPE_IMAGE}
                              index={i}
                              moveItem={moveImage}
                            >
                              <div className="relative group">
                                <img
                                  src={image}
                                  alt={`Product ${i}`}
                                  className="w-24 h-24 object-cover rounded border"
                                />
                                <button
                                  type="button"
                                  onClick={() => deleteImage(i)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <DeleteIcon fontSize="small" />
                                </button>
                              </div>
                            </DraggableItem>
                          ))
                        ) : (
                          <div className="flex items-center justify-center w-full h-32 text-gray-400">
                            <ImageIcon fontSize="large" />
                          </div>
                        )}
                      </div>
                    </div>
                    <label className="block w-full">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleProductImageChange}
                        className="hidden"
                        ref={fileInputRef}
                        disabled={isUploading}
                      />
                      <div
                        className={`w-full py-2 px-4 border rounded-lg text-center cursor-pointer transition-colors ${
                          isUploading
                            ? "bg-gray-200 text-gray-500 border-gray-300"
                            : "bg-white border-purple-600 text-purple-600 hover:bg-purple-50"
                        }`}
                        onClick={() =>
                          !isUploading && fileInputRef.current.click()
                        }
                      >
                        {isUploading
                          ? `Uploading Images... ${uploadProgress}%`
                          : "Upload Images"}
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 mb-4 flex justify-end">
                <button
                  type="submit"
                  className={`px-6 py-3 text-white font-medium rounded-lg transition-colors shadow-md ${
                    updateLoading || isUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                  disabled={updateLoading || isUploading}
                >
                  {updateLoading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </DndProvider>
        </div>
      </div>
    </>
  );
};

export default UpdateProduct;
