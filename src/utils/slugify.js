// Utility helpers for generating SEO-friendly slugs for product routes

export const slugify = (input) => {
  if (!input) return "";
  return String(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
};

export const generateProductSlug = (product) => {
  if (!product) return "";
  // Prefer name-only slug for cleaner URLs
  const base = slugify(product.name || "product");
  return base;
};

