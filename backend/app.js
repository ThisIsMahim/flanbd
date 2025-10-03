const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorMiddleware = require("./middlewares/error");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Config
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "config/config.env" });
}

// Enable CORS with specific options
const corsOptions = {
  origin: [
    // "https://demo.eyegearsbd.com",
    "http://localhost:3000", // for development
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Added PATCH here
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      // "https://demo.eyegearsbd.com",
      "https://flanbd.store",
      
    ],
    credentials: true,
  })
);
app.options("*", cors(corsOptions)); // Enable pre-flight for all routes

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

// Lightweight response cache with ETag/304 for public GET endpoints
const cache = require("./middlewares/cache");

// Routes
const user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const userMessageRoutes = require("./routes/userMessageRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const blogRoutes = require("./routes/blogRoutes");
const videosRouter = require("./routes/videos");
const brandRoutes = require("./routes/brandRoutes");
const slidersRoute = require("./routes/sliderRoutes");
const reviewScreenshotsRoutes = require("./routes/reviewScreenshots");
const trustedCompaniesRoutes = require("./routes/trustedCompanies");
const bannerTextRoutes = require("./routes/bannerTextRoutes");
const fraudCheckerRoutes = require("./routes/fraudCheckerRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");

// Public cached endpoints (short TTLs; tune per route if needed)
app.use("/api/v1/categories", cache({ ttlMs: 5 * 60_000 }));
app.use("/api/brands", cache({ ttlMs: 10 * 60_000 }));
app.use("/api/sliders", cache({ ttlMs: 10 * 60_000 }));

app.use("/api/v1", categoryRoutes);
app.use("/api", brandRoutes);
app.use("/api", slidersRoute);

app.use("/api/v1", user);
app.use("/api/usermessages", userMessageRoutes);
app.use("/api", blogRoutes);
// Heavily hit product endpoints
app.use("/api/v1/products", cache({ ttlMs: 60_000 }));
app.use("/api/v1/product", cache({ ttlMs: 60_000 }));
app.use("/api/v1", product);
app.use("/api/videos", cache({ ttlMs: 5 * 60_000 }));
app.use("/api/videos", videosRouter);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use("/api/review-screenshots", reviewScreenshotsRoutes);
app.use("/api/trusted-companies", trustedCompaniesRoutes);
app.use("/api/v1/banner-text", bannerTextRoutes);
app.use("/api/v1/fraud-checker", fraudCheckerRoutes);
app.use("/api/v1", testimonialRoutes);
// app.use('/api/v1', categoryRoutes);

// Error middleware
app.use(errorMiddleware);

module.exports = app;
