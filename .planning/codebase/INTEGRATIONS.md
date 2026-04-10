# Integrations

## Backend API
- **Direct Integration**: Axios configured to talk to a backend URL (configurable via env).
- **Credentials**: `withCredentials: true` enabled for cross-origin authentication.

## Third-Party Services
- **Tawk.to**: Live chat support (code present in `App.js`, currently commented out).
- **Google Fonts**: Loaded via `WebFontLoader` (Lato family).
- **Vercel**: Deployment configuration in `vercel.json`.

## Payment Gateways (Inferred from context)
- **bKash**: Popular mobile payment in Bangladesh.
- **Nagad**: Mobile payment service.
- **Cash on Delivery (COD)**: Manual order processing.

## Content Management
- **Blog Support**: Custom blog implementation within the `src/Blogs` directory.
- **Slider Management**: Admin-controlled sliders for the homepage.
