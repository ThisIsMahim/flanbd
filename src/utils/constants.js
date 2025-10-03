// Categories fetched from backend API
const categories = [];

// Fetch categories from backend
const fetchCategories = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/v1/categories`
    );
    const data = await response.json();
    if (data.success) {
      categories.push(...data.categories.map((cat) => cat.name));
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

// Call the fetch function immediately
fetchCategories();

// Export categories (initially empty, will be populated after fetch)
export { categories };

// Product Sliders Offers (unchanged)
export const offerProducts = [
  {
    image: "smart (1).jpg",
    name: "Smart Purifier",
    offer: "From 3,290",
    tag: "Made In Bangladesh Brands",
  },
  {
    image: "smart (2).jpg",
    name: "UV+UF Purifiers",
    offer: "In Focus Now",
    tag: "Buy Now!",
  },
  {
    image: "smart (3).jpg",
    name: "Non-Electric Purifiers",
    offer: "Min 70% Off",
    tag: "Buy Now!",
  },
  {
    image: "smart (4).jpg",
    name: "Wall-Mounted Purifiers",
    offer: "Min 40% Off",
    tag: "Grab Now!",
  },
  // {
  //     image: "https://rukminim1.flixcart.com/image/150/150/ky0g58w0/smartwatch/v/w/p/33-android-ios-id116-plus-fitpro-yes-original-imagacdfj58fqtgf.jpeg",
  //     name: "Footwear(Men's)",
  //     offer: "Min 40% Off",
  //     tag: "Discover Now!",
  // },
  // {
  //     image: "https://rukminim1.flixcart.com/image/150/150/khmbafk0-0/tripod/tripod/6/7/5/professional-3110-tripod-with-mobile-holder-light-aluminum-alloy-original-imafxhcaks7j2tq8.jpeg",
  //     name: "Bags",
  //     offer: "Min 50% Off",
  //     tag: "Great Savings!",
  // },
  // {
  //     image: "https://rukminim1.flixcart.com/image/150/150/kjn6qvk0-0/shoe/d/c/v/ck2669-001nike-12-nike-black-white-smoke-grey-original-imafz5vwe5t53z3t.jpeg",
  //     name: "Groom Costume & Accessories",
  //     offer: "Upto 40% Off",
  //     tag: "Buy Now!",
  // },
  // {
  //     image: "https://rukminim1.flixcart.com/flap/150/150/image/72e01243baf51459.jpg",
  //     name: "Couple Accessories",
  //     offer: "Upto 50% Off",
  //     tag: "Great Savings!",
  // },
  // {
  //     image: "https://rukminim1.flixcart.com/image/150/150/kskotjk0/headphone/p/c/b/nb120-tehalka-28-hours-playtime-neckband-aroma-original-imag6444my9aegkg.jpeg",
  //     name: "Wedding Essentials",
  //     offer: "Min 60% Off",
  //     tag: "Grab Now!",
  // },
];
