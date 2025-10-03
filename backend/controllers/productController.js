const Product = require("../models/productModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const SearchFeatures = require("../utils/searchFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");
const axios = require("axios");
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
const Category = require("../models/categoryModel");
const Coupon = require("../models/Coupon");

// Helper: Recursively find all descendant category IDs
async function getAllDescendantCategoryIds(categoryId) {
  const categories = await Category.find({ parent: categoryId });
  let ids = [categoryId];
  for (const cat of categories) {
    const subIds = await getAllDescendantCategoryIds(cat._id);
    ids = ids.concat(subIds);
  }
  return ids;
}

// Get min and max product price (public)
exports.getPriceRange = asyncErrorHandler(async (req, res, next) => {
  try {
    const result = await Product.aggregate([
      {
        $match: {
          stock: { $gt: 0 },
          price: { $type: "number" },
        },
      },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    const minPrice = result[0]?.minPrice ?? 0;
    const maxPrice = result[0]?.maxPrice ?? 0;

    res.status(200).json({ success: true, minPrice, maxPrice });
  } catch (error) {
    return next(new ErrorHandler("Error fetching price range", 500));
  }
});

// Get All Products (NO PAGINATION)
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
  const productsCount = await Product.countDocuments();

  // Handle recursive subcategory filtering
  let queryObj = { ...req.query };
  if (queryObj.category) {
    // Find the category by name or ID
    let categoryDoc = null;
    if (mongoose.Types.ObjectId.isValid(queryObj.category)) {
      categoryDoc = await Category.findById(queryObj.category);
    } else {
      categoryDoc = await Category.findOne({ name: queryObj.category });
    }
    if (categoryDoc) {
      const allCatIds = await getAllDescendantCategoryIds(categoryDoc._id);
      queryObj.categories = allCatIds.map((id) => id.toString());
      delete queryObj.category;
    } else {
      // If category not found, remove it from query to avoid errors
      delete queryObj.category;
    }
  }

  // Apply search and filter features
  const searchFeature = new SearchFeatures(Product.find(), queryObj)
    .search()
    .filter();

  const products = await searchFeature.query.sort({ sortOrder: 1, createdAt: -1 }).populate(
    "categories",
    "name _id parent"
  );
  const filteredProductsCount = products.length;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    filteredProductsCount,
  });
});

// Admin: create coupon
exports.createCoupon = asyncErrorHandler(async (req, res, next) => {
  const coupon = await Coupon.create({ ...req.body, code: String(req.body.code).toUpperCase(), createdBy: req.user._id });
  res.status(201).json({ success: true, coupon });
});

// Admin: list coupons
exports.listCoupons = asyncErrorHandler(async (req, res, next) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, coupons });
});

// Admin: update coupon
exports.updateCoupon = asyncErrorHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    { ...req.body, code: req.body.code ? String(req.body.code).toUpperCase() : undefined },
    { new: true }
  );
  if (!coupon) return next(new ErrorHandler("Coupon not found", 404));
  res.status(200).json({ success: true, coupon });
});

// Admin: delete coupon
exports.deleteCoupon = asyncErrorHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return next(new ErrorHandler("Coupon not found", 404));
  res.status(200).json({ success: true });
});

// Get highest sort order for products
// Get highest sort order for products
exports.getHighestOrder = asyncErrorHandler(async (req, res, next) => {
  try {
    const highestOrderProduct = await Product.findOne().sort({ sortOrder: -1 });
    
    // If no products exist, start with 1, otherwise increment the highest order
    const highestOrder = highestOrderProduct ? highestOrderProduct.sortOrder + 1 : 1;
    
    res.status(200).json({
      success: true,
      highestOrder
    });
  } catch (error) {
    return next(new ErrorHandler("Error fetching highest order", 500));
  }
});

// Public: validate coupon and compute discount for a given amount
exports.validateCoupon = asyncErrorHandler(async (req, res, next) => {
  const code = String(req.query.code || "").trim().toUpperCase();
  const amount = Number(req.query.amount || 0);
  if (!code) return next(new ErrorHandler("Coupon code required", 400));
  const coupon = await Coupon.findOne({ code, active: true });
  if (!coupon) return next(new ErrorHandler("Invalid coupon", 404));
  if (coupon.expiresAt && coupon.expiresAt <= new Date()) {
    return next(new ErrorHandler("Coupon expired", 400));
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return next(new ErrorHandler("Coupon usage limit reached", 400));
  }
  if (amount < (coupon.minOrder || 0)) {
    return next(new ErrorHandler("Order amount is less than minimum required", 400));
  }
  const discount = coupon.type === "percent"
    ? Math.round((amount * coupon.value) / 100)
    : Math.min(coupon.value, amount);
  res.status(200).json({
    success: true,
    coupon: { code: coupon.code, type: coupon.type, value: coupon.value },
    discount,
  });
});


// Bulk update product sort order ---ADMIN
exports.bulkUpdateSortOrder = asyncErrorHandler(async (req, res, next) => {
  const updates = req.body?.orders; // [{id, sortOrder}, ...]
  if (!Array.isArray(updates)) {
    return next(new ErrorHandler("orders array required", 400));
  }
  const bulk = updates.map((u) => ({
    updateOne: {
      filter: { _id: u.id },
      update: { $set: { sortOrder: Number(u.sortOrder) || 0 } },
    },
  }));
  if (bulk.length) {
    await Product.bulkWrite(bulk);
  }
  res.status(200).json({ success: true });
});

// Get all Brands
exports.getAllBrands = asyncErrorHandler(async (req, res, next) => {
  // Get all unique brands with their logos
  const brands = await Product.aggregate([
    {
      $group: {
        _id: "$brand.name",
        logo: { $first: "$brand.logo" },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        logo: 1,
      },
    },
  ]);
  res.status(200).json({
    success: true,
    brands,
  });
});

// Get All Products ---Product Sliders
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
  // Handle recursive subcategory filtering
  let queryObj = { ...req.query };
  if (queryObj.category) {
    let categoryDoc = null;
    if (mongoose.Types.ObjectId.isValid(queryObj.category)) {
      categoryDoc = await Category.findById(queryObj.category);
    } else {
      categoryDoc = await Category.findOne({ name: queryObj.category });
    }
    if (categoryDoc) {
      const allCatIds = await getAllDescendantCategoryIds(categoryDoc._id);
      queryObj.categories = allCatIds.map((id) => id.toString());
      delete queryObj.category;
    } else {
      // If category not found, remove it from query to avoid errors
      delete queryObj.category;
    }
  }

  const products = await new SearchFeatures(Product.find(), queryObj)
    .search()
    .filter()
    .query.sort({ sortOrder: 1, createdAt: -1 }).populate("categories", "name _id parent");
  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "categories",
    "name _id parent"
  );
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// Get All Products ---ADMIN
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find().sort({ sortOrder: 1, createdAt: -1 }).populate(
    "categories",
    "name _id parent"
  );
  res.status(200).json({
    success: true,
    products,
  });
});

// ... existing code ...

async function uploadToImgBB(base64Image) {
  const base64 = base64Image.includes(",")
    ? base64Image.split(",")[1]
    : base64Image;
  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    { image: base64 }
  );
  return {
    url: res.data.data.url,
    public_id: res.data.data.id,
  };
}

// Create Product ---ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      cuttedPrice,
      categories,
      stock,
      warranty,
      brandname,
      highlights,
      specifications,
      images: imagesRaw,
      logo,
      video_url,
    } = req.body;

    // Parse images as array if sent as JSON string
    let images = imagesRaw;
    if (typeof images === "string") {
      try {
        images = JSON.parse(images);
      } catch (e) {
        images = [images];
      }
    }

    // Defensive checks for required fields
    if (!logo) {
      return next(new ErrorHandler("Brand logo is required", 400));
    }
    if (!images || !Array.isArray(images) || images.length === 0) {
      return next(
        new ErrorHandler("At least one product image is required", 400)
      );
    }

    // Upload brand logo to Cloudinary
    const logoResult = await cloudinary.v2.uploader.upload(logo, {
      folder: "brands",
    });
    const brandLogo = {
      public_id: logoResult.public_id,
      url: logoResult.secure_url,
    };

    // No ImgBB upload here; images already uploaded in frontend
    const imagesLink = images;

    // Parse specifications if they're strings
    const parsedSpecs = specifications.map((spec) =>
      typeof spec === "string" ? JSON.parse(spec) : spec
    );

    // Parse categories as ObjectId
    const parsedCategories = Array.isArray(categories)
      ? categories.map((id) => new mongoose.Types.ObjectId(id))
      : [new mongoose.Types.ObjectId(categories)];

    // Resolve sort order before creating the product
    let resolvedSortOrder = 0;
    const provided = req.body.sortOrder;
    if (provided !== undefined && provided !== null && provided !== "") {
      const parsed = Number(provided);
      if (Number.isFinite(parsed) && parsed > 0) {
        resolvedSortOrder = parsed;
      } else {
        const highest = await Product.findOne().sort({ sortOrder: -1 }).select("sortOrder").lean();
        const highestVal = highest && Number.isFinite(highest.sortOrder) ? Number(highest.sortOrder) : null;
        if (highestVal === null || highestVal < 1) {
          const count = await Product.countDocuments();
          resolvedSortOrder = count + 1;
        } else {
          resolvedSortOrder = highestVal + 1;
        }
      }
    } else {
      const highest = await Product.findOne().sort({ sortOrder: -1 }).select("sortOrder").lean();
      const highestVal = highest && Number.isFinite(highest.sortOrder) ? Number(highest.sortOrder) : null;
      if (highestVal === null || highestVal < 1) {
        const count = await Product.countDocuments();
        resolvedSortOrder = count + 1; // next position (1-based sequence)
      } else {
        resolvedSortOrder = highestVal + 1;
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      cuttedPrice,
      categories: parsedCategories,
      stock,
      warranty,
      brand: {
        name: brandname,
        logo: brandLogo,
      },
      images: imagesLink,
      highlights,
      specifications: parsedSpecs,
      video_url,
      isDifferentColors: req.body.isDifferentColors === 'true' || req.body.isDifferentColors === true,
      user: req.user.id,
      sortOrder: resolvedSortOrder,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update Product ---ADMIN
// ... existing code ...

// Update Product ---ADMIN
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product Not Found", 404));
    }

    // Process brand logo
    let brandLogo = product.brand.logo;
    if (req.files && req.files["logo"]) {
      // Delete old logo if exists
      if (product.brand.logo && product.brand.logo.public_id) {
        await cloudinary.v2.uploader.destroy(product.brand.logo.public_id);
      }

      const logoFile = req.files["logo"][0];
      const result = await cloudinary.v2.uploader.upload(logoFile.path, {
        folder: "brands",
      });
      brandLogo = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } else if (req.body.brandLogo) {
      // Handle existing logo data
      try {
        const logoData = JSON.parse(req.body.brandLogo);
        brandLogo = {
          public_id: logoData.public_id,
          url: logoData.url,
        };
      } catch (error) {
        // If parsing fails, use the string value as URL and generate a public_id
        brandLogo = {
          public_id: req.body.brandLogo.split("/").pop().split(".")[0],
          url: req.body.brandLogo,
        };
      }
    }

    // Process product images
    let imagesLink = [];
    const imageOrderChanged = req.body.imageOrderChanged === "true";

    // Keep track of old images to preserve
    const oldImagesToKeep = req.body.oldImages
      ? Array.isArray(req.body.oldImages)
        ? req.body.oldImages
        : [req.body.oldImages]
      : [];

    // First, handle the old images that should be kept
    imagesLink = product.images.filter((img) =>
      oldImagesToKeep.includes(img.url)
    );

    // Delete old images that were removed
    const imagesToDelete = product.images.filter(
      (img) => !oldImagesToKeep.includes(img.url)
    );
    for (const img of imagesToDelete) {
      await cloudinary.v2.uploader.destroy(img.public_id);
    }

    // Then handle new images from ImgBB - DEBUG: Log what we receive
    if (req.body.images) {
      console.log("Raw images received from frontend:", req.body.images);
      console.log("Type of images:", typeof req.body.images);

      let newImages;
      try {
        // Parse the images array from JSON string
        if (typeof req.body.images === 'string') {
          newImages = JSON.parse(req.body.images);
          console.log("Parsed images:", newImages);
        } else {
          newImages = req.body.images;
        }

        // Ensure newImages is an array
        if (!Array.isArray(newImages)) {
          newImages = [newImages];
        }

        // Validate each image object has required fields
        newImages = newImages.filter(img => img && img.url && img.public_id);
        console.log("Validated images:", newImages);

        imagesLink = [...imagesLink, ...newImages];
      } catch (error) {
        console.error('Error parsing new images:', error);
        // If parsing fails, try to handle as single image object
        try {
          const singleImage = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
          if (singleImage && singleImage.url && singleImage.public_id) {
            imagesLink = [...imagesLink, singleImage];
          }
        } catch (parseError) {
          console.error('Error parsing single image:', parseError);
        }
      }
    }

    // Handle image reordering if needed
    if (imageOrderChanged && req.body.imageOrder) {
      const imageOrder = JSON.parse(req.body.imageOrder);
      const orderedImages = [];

      for (const imgRef of imageOrder) {
        if (imgRef.startsWith("old-")) {
          const imgUrl = imgRef.substring(4);
          const img = imagesLink.find((i) => i.url === imgUrl);
          if (img) orderedImages.push(img);
        } else if (imgRef.startsWith("new-")) {
          const imgUrl = imgRef.substring(4);
          const img = imagesLink.find((i) => i.url === imgUrl);
          if (img) orderedImages.push(img);
        }
      }

      // If we found all images in the order, use the ordered version
      if (orderedImages.length === imagesLink.length) {
        imagesLink = orderedImages;
      }
    }

    // Parse specifications
    let specifications = [];
    if (req.body.specifications) {
      specifications = Array.isArray(req.body.specifications)
        ? req.body.specifications.map((spec) =>
            typeof spec === "string" ? JSON.parse(spec) : spec
          )
        : [
            typeof req.body.specifications === "string"
              ? JSON.parse(req.body.specifications)
              : req.body.specifications,
          ];
    }

    // Parse highlights
    let highlights = [];
    if (req.body.highlights) {
      highlights = Array.isArray(req.body.highlights)
        ? req.body.highlights
        : [req.body.highlights];
    }

    // Parse categories
    let categories = [];
    if (req.body.categories) {
      try {
        // First try to parse if it's a JSON string
        categories =
          typeof req.body.categories === "string"
            ? JSON.parse(req.body.categories)
            : req.body.categories;

        // Ensure it's an array
        categories = Array.isArray(categories) ? categories : [categories];

        // Clean up any empty or invalid categories
        categories = categories.filter(
          (cat) => cat && typeof cat === "string" && cat.trim() !== ""
        );
      } catch (error) {
        console.error("Error parsing categories:", error);
        categories = Array.isArray(req.body.categories)
          ? req.body.categories
          : [req.body.categories];
      }
    }

    // Validate and convert categories to ObjectId
    const validCategoryObjectIds = categories
      .map((id) => {
        try {
          if (
            typeof id === "string" &&
            id.trim() &&
            mongoose.Types.ObjectId.isValid(id)
          ) {
            return new mongoose.Types.ObjectId(id);
          } else {
            console.error(
              "Invalid category id (not a string or not valid ObjectId):",
              id
            );
            return null;
          }
        } catch (e) {
          console.error("Error converting category id to ObjectId:", id, e);
          return null;
        }
      })
      .filter(Boolean);
    console.log("Final categories for update:", validCategoryObjectIds);

    // Update product
    product.set({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      cuttedPrice: req.body.cuttedPrice,
      categories: validCategoryObjectIds,
      category: validCategoryObjectIds[0],
      stock: req.body.stock,
      warranty: req.body.warranty,
      brand: {
        name: req.body.brandname,
        logo: brandLogo,
      },
      images: imagesLink,
      highlights,
      specifications,
      video_url: req.body.video_url,
      isDifferentColors: req.body.isDifferentColors === 'true' || req.body.isDifferentColors === true ? true : false,
      user: req.user.id,
      ...(req.body.sortOrder !== undefined && req.body.sortOrder !== null
        ? { sortOrder: Number(req.body.sortOrder) }
        : {}),
    });
    await product.save();

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return next(new ErrorHandler(error.message, 500));
  }
});

// ... rest of the code ...
// ... rest of the code ...

// Delete Product ---ADMIN
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  // Delete images from cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  // Delete brand logo from cloudinary
  await cloudinary.v2.uploader.destroy(product.brand.logo.public_id);

  await Product.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// Create OR Update Reviews
exports.createProductReview = asyncErrorHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  const isReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of Product
exports.getProductReviews = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  let ratings = reviews.length === 0 ? 0 : avg / reviews.length;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings: Number(ratings),
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// ===== DEDICATED COLLECTION APIs =====

// Get Gents Collection Products
exports.getGentsCollection = asyncErrorHandler(async (req, res, next) => {
  try {
    // Find the Gents Collection category
    const gentsCategory = await Category.findOne({ name: "Gents Collection" });
    if (!gentsCategory) {
      return next(new ErrorHandler("Gents Collection category not found", 404));
    }

    // Get all descendant category IDs
    const allCatIds = await getAllDescendantCategoryIds(gentsCategory._id);
    
    // Build query with filters
    let query = { categories: { $in: allCatIds } };
    
    // Apply additional filters if provided
    if (req.query.brand) {
      query.brand = { name: req.query.brand };
    }
    
    if (req.query.price) {
      if (req.query.price.gte) query.price = { $gte: Number(req.query.price.gte) };
      if (req.query.price.lte) query.price = { ...query.price, $lte: Number(req.query.price.lte) };
    }
    
    if (req.query.ratings) {
      if (req.query.ratings.gte) query.ratings = { $gte: Number(req.query.ratings.gte) };
    }

    // Get products with pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("categories", "name _id parent")
      .populate("brand", "name logo")
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages,
      currentPage: page,
      productsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get Ladies Collection Products
exports.getLadiesCollection = asyncErrorHandler(async (req, res, next) => {
  try {
    // Find the Ladies Collection category
    const ladiesCategory = await Category.findOne({ name: "Ladies Collection" });
    if (!ladiesCategory) {
      return next(new ErrorHandler("Ladies Collection category not found", 404));
    }

    // Get all descendant category IDs
    const allCatIds = await getAllDescendantCategoryIds(ladiesCategory._id);
    
    // Build query with filters
    let query = { categories: { $in: allCatIds } };
    
    // Apply additional filters if provided
    if (req.query.brand) {
      query.brand = { name: req.query.brand };
    }
    
    if (req.query.price) {
      if (req.query.price.gte) query.price = { $gte: Number(req.query.price.gte) };
      if (req.query.price.lte) query.price = { ...query.price, $lte: Number(req.query.price.lte) };
    }
    
    if (req.query.ratings) {
      if (req.query.ratings.gte) query.ratings = { $gte: Number(req.query.ratings.gte) };
    }

    if (req.query.color) {
      query.color = { $regex: req.query.color, $options: 'i' };
    }

    // Get products with pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("categories", "name _id parent")
      .populate("brand", "name logo")
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages,
      currentPage: page,
      productsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get Sports Sunglass Products
exports.getSportsSunglass = asyncErrorHandler(async (req, res, next) => {
  try {
    // Find the Sports Sunglass category
    const sportsCategory = await Category.findOne({ name: "Sports Sunglass" });
    if (!sportsCategory) {
      return next(new ErrorHandler("Sports Sunglass category not found", 404));
    }

    // Get all descendant category IDs
    const allCatIds = await getAllDescendantCategoryIds(sportsCategory._id);
    
    // Build query with filters
    let query = { categories: { $in: allCatIds } };
    
    // Apply additional filters if provided
    if (req.query.brand) {
      query.brand = { name: req.query.brand };
    }
    
    if (req.query.price) {
      if (req.query.price.gte) query.price = { $gte: Number(req.query.price.gte) };
      if (req.query.price.lte) query.price = { ...query.price, $lte: Number(req.query.price.lte) };
    }
    
    if (req.query.ratings) {
      if (req.query.ratings.gte) query.ratings = { $gte: Number(req.query.ratings.gte) };
    }

    if (req.query.sportType) {
      query.sportType = { $regex: req.query.sportType, $options: 'i' };
    }

    // Get products with pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("categories", "name _id parent")
      .populate("brand", "name logo")
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages,
      currentPage: page,
      productsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get Eyewear Products
exports.getEyewear = asyncErrorHandler(async (req, res, next) => {
  try {
    // Find the Eyewear category
    const eyewearCategory = await Category.findOne({ name: "Eyewear" });
    if (!eyewearCategory) {
      return next(new ErrorHandler("Eyewear category not found", 404));
    }

    // Get all descendant category IDs
    const allCatIds = await getAllDescendantCategoryIds(eyewearCategory._id);
    
    // Build query with filters
    let query = { categories: { $in: allCatIds } };
    
    // Apply additional filters if provided
    if (req.query.brand) {
      query.brand = { name: req.query.brand };
    }
    
    if (req.query.price) {
      if (req.query.price.gte) query.price = { $gte: Number(req.query.price.gte) };
      if (req.query.price.lte) query.price = { ...query.price, $lte: Number(req.query.price.lte) };
    }
    
    if (req.query.ratings) {
      if (req.query.ratings.gte) query.ratings = { $gte: Number(req.query.ratings.gte) };
    }

    if (req.query.eyewearType) {
      query.eyewearType = { $regex: req.query.eyewearType, $options: 'i' };
    }

    // Get products with pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("categories", "name _id parent")
      .populate("brand", "name logo")
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages,
      currentPage: page,
      productsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
