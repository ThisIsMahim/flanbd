// Node 25+ compatibility fix for older dependencies (buffer-equal-constant-time)
const buffer = require('buffer');
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = function() {};
  buffer.SlowBuffer.prototype = buffer.Buffer.prototype;
}

const mongoose = require('mongoose');
require('dotenv').config({ path: 'backend/.env' });
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const Slider = require('../models/Slider');
const TrustedCompany = require('../models/TrustedCompany');
const ReviewScreenshot = require('../models/ReviewScreenshot');

// Use the local URI fallback directly for the script if Atlas fails
const seedData = async () => {
    const ATLAS_URI = process.env.MONGO_URI;
    const LOCAL_URI = "mongodb://localhost:27017/flanbd";

    try {
        console.log("⏳ Attempting to connect to MongoDB (Atlas)...");
        await mongoose.connect(ATLAS_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("✅ Connected to Atlas. Starting seed process...");
    } catch (error) {
        console.warn(`⚠️  Atlas Connection Failed: ${error.message}`);
        console.log("🔄 Falling back to Local MongoDB...");
        try {
            await mongoose.connect(LOCAL_URI);
            console.log("✅ Connected to Localhost. Starting seed process...");
        } catch (localError) {
            console.error(`❌ Both Atlas and Localhost failed: ${localError.message}`);
            process.exit(1);
        }
    }
    
    try {
        // 1. Create or Force Admin User
        let admin = await User.findOne({ email: "admin@flan.com" });
        if (!admin) {
            admin = await User.create({
                name: "Flan Admin",
                email: "admin@flan.com",
                password: "password123",
                gender: "Male",
                role: "admin"
            });
            console.log("👤 Admin user created.");
        } else {
            // Force admin role if user already exists
            admin.role = "admin";
            await admin.save();
            console.log("👤 Existing admin user updated with admin role.");
        }

        // 2. Clear existing dynamic content (Optional - commented out for safety)
        // await Category.deleteMany();
        // await Product.deleteMany();
        // await Slider.deleteMany();
        // await TrustedCompany.deleteMany();
        // await ReviewScreenshot.deleteMany();

        // 3. Seed Categories
        const categoriesData = [
            { name: "Anime Keychains", subtext: "Embroidered jet tags", order: 1, icon: "https://img.icons8.com/color/96/naruto.png" },
            { name: "Fandom T-shirts", subtext: "Exclusive designs", order: 2, icon: "https://img.icons8.com/color/96/t-shirt.png" },
            { name: "Night Lamps", subtext: "Themed lighting", order: 3, icon: "https://img.icons8.com/color/96/lamp.png" },
            { name: "Mufflers", subtext: "Club & Team specific", order: 4, icon: "https://img.icons8.com/color/96/scarf.png" }
        ];

        const categories = [];
        for (const cat of categoriesData) {
            let category = await Category.findOne({ name: cat.name });
            if (!category) {
                category = await Category.create(cat);
                console.log(`📂 Category created: ${cat.name}`);
            }
            categories.push(category);
        }

        // 4. Seed Products
        const productsData = [
            {
                name: "Naruto Uzumaki Jet Tag",
                description: "Premium embroidered keychain featuring the Hidden Leaf symbol and Naruto's signature design. Durable and high-quality for fandom expression.",
                highlights: ["High-quality embroidery", "Double-sided design", "Durable metal ring"],
                specifications: [{ title: "Material", description: "Hard-wearing Fabric" }, { title: "Size", description: "13cm x 3cm" }],
                price: 250,
                cuttedPrice: 350,
                images: [{ public_id: "p1", url: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?q=80&w=800" }],
                brand: { name: "Flan Crafts", logo: { public_id: "b1", url: "https://img.icons8.com/color/96/brand.png" } },
                categories: [categories[0]._id],
                stock: 50,
                user: admin._id
            },
            {
                name: "Jujutsu Kaisen Gojo T-Shirt",
                description: "Over-sized black t-shirt with Gojo Satoru 'Unlimited Void' back print. 100% cotton, 180 GSM, breathable and premium.",
                highlights: ["100% Organic Cotton", "Premium 180 GSM", "Screen printed design"],
                specifications: [{ title: "Fit", description: "Oversized" }, { title: "Color", description: "Black" }],
                price: 1200,
                cuttedPrice: 1500,
                images: [{ public_id: "p2", url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800" }],
                brand: { name: "Flan Apparel", logo: { public_id: "b1", url: "https://img.icons8.com/color/96/brand.png" } },
                categories: [categories[1]._id],
                stock: 20,
                user: admin._id
            },
            {
                name: "Luffy Gear 5 Night Lamp",
                description: "Multi-color switching acrylic night lamp featuring Luffy Gear 5 transformation. Perfect for your gaming or work desk.",
                highlights: ["7 Color cycle", "Touch control", "USB Powered"],
                specifications: [{ title: "Material", description: "Acrylic & ABS" }, { title: "Voltage", description: "5V" }],
                price: 1800,
                cuttedPrice: 2200,
                images: [{ public_id: "p3", url: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800" }],
                brand: { name: "Flan Decor", logo: { public_id: "b1", url: "https://img.icons8.com/color/96/brand.png" } },
                categories: [categories[2]._id],
                stock: 15,
                user: admin._id
            }
        ];

        for (const prod of productsData) {
            const exists = await Product.findOne({ name: prod.name });
            if (!exists) {
                await Product.create(prod);
                console.log(`🎁 Product created: ${prod.name}`);
            }
        }

        // 5. Seed Sliders (Home Hero)
        const slidersData = [
            {
                title: "New Anime Collection",
                subtitle: "Exclusive embroidered keychains and apparel.",
                imageUrl: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1200",
                features: ["Free Shipping", "Premium Quality"],
                language: "english"
            },
            {
                title: "Flash Sale: Up to 30% OFF",
                subtitle: "Grab yours before they vanish!",
                imageUrl: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1200",
                features: ["Limited Slots", "Best Deals"],
                language: "english"
            }
        ];

        for (const s of slidersData) {
            const exists = await Slider.findOne({ title: s.title });
            if (!exists) {
                await Slider.create(s);
                console.log(`🖼️ Slider created: ${s.title}`);
            }
        }

        // 6. Seed Trusted Partners
        const partnersData = [
            { name: "Pathao", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Pathao_logo.png", order: 1 },
            { name: "SSL Commerz", logo: "https://securepay.sslcommerz.com/gw/images/manual/category_02.png", order: 2 },
            { name: "Steadfast", logo: "https://steadfast.com.bd/assets/web/images/logo.png", order: 3 }
        ];

        for (const p of partnersData) {
            const exists = await TrustedCompany.findOne({ name: p.name });
            if (!exists) {
                await TrustedCompany.create(p);
                console.log(`🤝 Partner created: ${p.name}`);
            }
        }

        // 7. Seed Reviews
        const reviewsData = [
            { url: "https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=400", order: 1 },
            { url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=400", order: 2 },
            { url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400", order: 3 }
        ];

        for (const r of reviewsData) {
            const exists = await ReviewScreenshot.findOne({ url: r.url });
            if (!exists) {
                await ReviewScreenshot.create(r);
                console.log(`⭐ Review screenshot added.`);
            }
        }

        console.log("🏁 Database seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedData();
