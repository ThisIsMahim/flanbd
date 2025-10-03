import { useEffect, useState } from "react";

const useDataFetching = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState(6);

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/categories`
        );
        const data = await response.json();
        if (data.success && isMounted) {
          setCategories(data.categories);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch categories", error);
        }
      } finally {
        if (isMounted) setCategoriesLoading(false);
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to get all descendant category names for a given parent category name
  const getAllDescendantCategoryNames = (categories, parentName) => {
    const parent = categories.find((cat) => cat.name === parentName);
    if (!parent) return [];
    const descendants = [parent.name];
    const stack = [parent._id];
    while (stack.length > 0) {
      const currentId = stack.pop();
      const children = categories.filter(
        (cat) =>
          cat.parent &&
          (typeof cat.parent === "object" ? cat.parent._id : cat.parent) ===
            currentId
      );
      for (const child of children) {
        descendants.push(child.name);
        stack.push(child._id);
      }
    }
    return descendants;
  };

  // Updated: now takes categories as an argument
  const getProductsByCategory = (products, categories, categoryName) => {
    if (!products) return [];
    if (categoryName === "all" || categoryName === "All Products")
      return products.filter((product) => product.stock > 0); // Filter out of stock products
    if (!categories) return [];

    // Get all relevant category names (parent + descendants)
    const allCategoryNames = getAllDescendantCategoryNames(
      categories,
      categoryName
    );

    return products.filter((product) => {
      // First check if product is in stock
      if (product.stock <= 0) return false;
      
      let productCategories = [];
      if (Array.isArray(product.categories)) {
        productCategories = product.categories.map((cat) =>
          typeof cat === "object" && cat !== null ? cat.name : cat
        );
      } else if (product.category) {
        productCategories = [product.category];
      }
      if (typeof product.category === "string") {
        productCategories.push(product.category);
      }
      productCategories = [...new Set(productCategories.filter((cat) => cat))];
      // Match if any of the product's categories is in the set of all relevant category names
      return productCategories.some((cat) =>
        allCategoryNames.some(
          (name) => name && cat && cat.toLowerCase() === name.toLowerCase()
        )
      );
    });
  };

  return {
    categories,
    categoriesLoading,
    visibleCategories,
    setVisibleCategories,
    getProductsByCategory,
  };
};

export default useDataFetching;
