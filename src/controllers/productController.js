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
            images,
            logo,
            video_url,
        } = req.body;

        // Upload brand logo to Cloudinary
        const logoResult = await cloudinary.v2.uploader.upload(logo, {
            folder: "brands",
        });
        const brandLogo = {
            public_id: logoResult.public_id,
            url: logoResult.secure_url,
        };

        // Upload product images to Cloudinary
        const imagesLink = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });
            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        // Parse specifications if they're strings
        const parsedSpecs = specifications.map(spec => 
            typeof spec === 'string' ? JSON.parse(spec) : spec
        );

        // Parse categories if they're strings
        const parsedCategories = Array.isArray(categories) ? categories : [categories];

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
                logo: brandLogo
            },
            images: imagesLink,
            highlights,
            specifications: parsedSpecs,
            video_url,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Update Product ---ADMIN
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ErrorHandler("Product Not Found", 404));
        }

        // Process brand logo
        let brandLogo = product.brand.logo;
        if (req.files && req.files['logo']) {
            // Delete old logo if exists
            if (product.brand.logo && product.brand.logo.public_id) {
                await cloudinary.v2.uploader.destroy(product.brand.logo.public_id);
            }
            
            const logoFile = req.files['logo'][0];
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
                    url: logoData.url
                };
            } catch (error) {
                // If parsing fails, use the string value as URL and generate a public_id
                brandLogo = {
                    public_id: req.body.brandLogo.split('/').pop().split('.')[0],
                    url: req.body.brandLogo
                };
            }
        }

        // Process product images
        let imagesLink = [];
        const imageOrderChanged = req.body.imageOrderChanged === 'true';
        
        // Keep track of old images to preserve
        const oldImagesToKeep = req.body.oldImages 
            ? (Array.isArray(req.body.oldImages) ? req.body.oldImages : [req.body.oldImages])
            : [];

        // First, handle the old images that should be kept
        imagesLink = product.images.filter(img => oldImagesToKeep.includes(img.url));

        // Delete old images that were removed
        const imagesToDelete = product.images.filter(img => !oldImagesToKeep.includes(img.url));
        for (const img of imagesToDelete) {
            await cloudinary.v2.uploader.destroy(img.public_id);
        }

        // Then handle new images from ImgBB
        if (req.body.images) {
            const newImages = Array.isArray(req.body.images) 
                ? req.body.images.map(img => typeof img === 'string' ? JSON.parse(img) : img)
                : [typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images];
            
            imagesLink = [...imagesLink, ...newImages];
        }

        // Handle image reordering if needed
        if (imageOrderChanged && req.body.imageOrder) {
            const imageOrder = JSON.parse(req.body.imageOrder);
            const orderedImages = [];
            
            for (const imgRef of imageOrder) {
                if (imgRef.startsWith('old-')) {
                    const imgUrl = imgRef.substring(4);
                    const img = imagesLink.find(i => i.url === imgUrl);
                    if (img) orderedImages.push(img);
                } else if (imgRef.startsWith('new-')) {
                    const imgUrl = imgRef.substring(4);
                    const img = imagesLink.find(i => i.url === imgUrl);
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
                ? req.body.specifications.map(spec => typeof spec === 'string' ? JSON.parse(spec) : spec)
                : [typeof req.body.specifications === 'string' ? JSON.parse(req.body.specifications) : req.body.specifications];
        }

        // Parse highlights
        let highlights = [];
        if (req.body.highlights) {
            highlights = Array.isArray(req.body.highlights) ? req.body.highlights : [req.body.highlights];
        }

        // Parse categories
        let categories = [];
        if (req.body.categories) {
            try {
                // First try to parse if it's a JSON string
                categories = typeof req.body.categories === 'string' 
                    ? JSON.parse(req.body.categories)
                    : req.body.categories;
                
                // Ensure it's an array
                categories = Array.isArray(categories) ? categories : [categories];
                
                // Clean up any empty or invalid categories
                categories = categories.filter(cat => cat && typeof cat === 'string' && cat.trim() !== '');
            } catch (error) {
                console.error('Error parsing categories:', error);
                categories = Array.isArray(req.body.categories) ? req.body.categories : [req.body.categories];
            }
        } else if (product.categories) {
            // If no new categories provided, keep existing ones
            categories = product.categories;
        }

        // Update product
        product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price,
                    cuttedPrice: req.body.cuttedPrice,
                    categories: categories,
                    stock: req.body.stock,
                    warranty: req.body.warranty,
                    brand: {
                        name: req.body.brandname,
                        logo: brandLogo
                    },
                    images: imagesLink,
                    highlights,
                    specifications,
                    video_url: req.body.video_url,
                    user: req.user.id
                }
            },
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        // Verify the update
        const updatedProduct = await Product.findById(req.params.id);
        console.log('Updated categories:', updatedProduct.categories);

        res.status(201).json({
            success: true,
            product: updatedProduct
        });
    } catch (error) {
        console.error('Error in updateProduct:', error);
        return next(new ErrorHandler(error.message, 500));
    }
}); 