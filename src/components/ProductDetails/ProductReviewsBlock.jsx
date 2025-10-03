import React, { useState } from "react";
import { Rating } from "@mui/material";

const ProductReviewsBlock = ({ product }) => {
  const [viewAll, setViewAll] = useState(false);
  if (!product) return null;
  return (
    <div className="mt-8">
      <div className="flex items-center border-b pb-2 mb-4">
        <h2 className="text-2xl font-bold text-[var(--primary-blue-light)] flex items-center">
          {product?.ratings?.toFixed(1) || 0}
        </h2>
        <p className="text-lg text-[var(--primary-blue-dark)] ml-2">
          ({product?.numOfReviews || 0}) Reviews
        </p>
      </div>
      {product?.reviews?.length > 0 ? (
        <>
          {(viewAll ? product.reviews : product.reviews.slice(0, 3)).map((rev, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 py-4 px-0 border-b last:border-b-0"
            >
              <Rating
                name={`read-only-rating-${i}`}
                value={rev.rating}
                readOnly
                size="small"
                precision={0.5}
              />
              <p className="text-[var(--primary-blue-dark)]">{rev.comment}</p>
              <span className="text-sm text-[var(--primary-blue-light)]">by {rev.name}</span>
            </div>
          ))}
          {product.reviews.length > 3 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setViewAll(!viewAll)}
                className="w-auto m-2 rounded-full py-2 px-4 bg-[var(--primary-blue-light)] text-white font-bold hover:bg-[var(--primary-blue-dark)] hover:text-white"
              >
                {viewAll ? "View Less Reviews" : "View All Reviews"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="py-4 px-0 text-[var(--primary-blue-light)]">
          No reviews yet. Be the first to rate this product!
        </p>
      )}
    </div>
  );
};

export default ProductReviewsBlock; 