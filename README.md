# Flan - Fandom Merchandise Store

## Overview

**Flan** (Fan + Clan) is a community-driven online gift shop and fan merchandise store based in Bangladesh. We specialize in creating expressive, fandom-exclusive products that bring fanbases together. Our platform offers anime embroidered keychains, fan-specific mufflers, themed night lamps, T-shirts, and other collectibles that help fans express their identity and interests.

Built with modern web technologies, Flan provides an intuitive shopping experience with features like user authentication, product management, order processing, and a community-focused design that celebrates fandom culture.

## Brand Identity

- **Name**: Flan (Fan + Clan)
- **Mission**: Building community through products fans love
- **Style**: Fun, youthful, fandom-centric, minimalistic, modern, bold, and expressive
- **Visual Identity**: Blackish gradient background with red accents, "Flan" logo with F in red and "lan" in white
- **Target Audience**: Anime fans, football fans, pop culture enthusiasts, and youth communities (15-30 years) in Bangladesh

## Features

- **User Authentication**: Secure login/register system with JWT tokens
- **Product Management**: Comprehensive fandom merchandise catalog with categories and search
- **Shopping Cart**: Add/remove items with quantity management
- **Order Processing**: Complete order workflow with payment integration
- **Admin Dashboard**: Full admin panel for managing products, orders, and users
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Multi-language Support**: English and Bengali language support
- **Blog System**: Content management for fandom tips, stories, and community updates
- **Video Integration**: YouTube video integration for product reviews and unboxing
- **Real-time Updates**: Live cart updates and notifications
- **Community Features**: Wishlist, reviews, and social sharing

## Product Categories

### Current Products
- **Anime Embroidered Keychains**: Jet tags featuring popular anime characters
- **Fan-Specific Mufflers**: Football team and sports-themed accessories
- **Anime/Football Night Lamps**: Themed lighting for fans' spaces
- **Fandom T-shirts**: Anime, football, and pop culture themed apparel
- **Collectibles**: Various fandom-specific accessories and merchandise

### Future Products
- Expanded anime merchandise line
- More sports team accessories
- Gaming-themed products
- Custom fan art and personalized items
- Limited edition collectibles

## Technology Stack

- **Frontend**: React.js with Material-UI
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion and GSAP
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **File Upload**: Cloudinary
- **Payment**: Stripe integration
- **Email**: Nodemailer with SMTP

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd flan-website
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
REACT_APP_CLOUDINARY_API_KEY=your_cloudinary_api_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

4. Start the development server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # React components
│   ├── Layouts/        # Layout components (Header, Footer, etc.)
│   ├── Home/           # Home page components
│   ├── Products/       # Product-related components
│   ├── User/           # User authentication components
│   ├── Admin/          # Admin dashboard components
│   ├── Cart/           # Shopping cart components
│   ├── Wishlist/       # Wishlist functionality
│   └── Blogs/          # Blog and content components
├── actions/            # Redux actions
├── reducers/           # Redux reducers
├── utils/              # Utility functions
├── constants/          # Application constants
└── assets/             # Static assets (images, icons, logos)
```

## Key Features

### User Experience
- Intuitive navigation with fandom-focused search functionality
- Product filtering by anime, sports, and pop culture categories
- Wishlist and cart management for favorite items
- Order tracking and history
- User profile management with fandom preferences
- Community reviews and ratings

### Admin Features
- Product CRUD operations for merchandise management
- Order management and fulfillment
- User management and community insights
- Category and brand management for different fandoms
- Blog and content management for community engagement
- Analytics and reporting for business insights

### Technical Features
- Responsive design optimized for mobile users (primary audience)
- Progressive Web App capabilities
- SEO optimization for fandom-related searches
- Performance optimization for smooth browsing
- Security best practices for user data protection

## Design Philosophy

### Visual Identity
- **Color Scheme**: Blackish gradient backgrounds with red accent colors
- **Typography**: Modern, bold fonts that express personality
- **Layout**: Minimalistic design that lets products and fandom content shine
- **User Experience**: Intuitive navigation that feels like browsing a fan community

### Community Focus
- Not just a shop, but a place for fans to find their "clan"
- Emphasis on community building and shared interests
- Social features that encourage fan interaction
- Content that celebrates fandom culture

## Selling Points

- **Fandom-Exclusive Products**: Unique merchandise not found elsewhere
- **Affordable Quality**: High-quality items at accessible prices
- **Community Feel**: A platform that understands and celebrates fan culture
- **Local Focus**: Designed specifically for Bangladesh's youth and fandom communities
- **Express Identity**: Products that help fans showcase their interests and personality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the Flan development team or create an issue in the repository.

---

**Join the Flan community and find your clan!** ⚽🎮
