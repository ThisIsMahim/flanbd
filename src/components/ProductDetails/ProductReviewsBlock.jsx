import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { 
  Rating, 
  Avatar, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Box,
  Typography,
  Divider
} from "@mui/material";
import { newReview, clearErrors, getProductDetails } from "../../actions/productAction";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import RateReviewIcon from '@mui/icons-material/RateReview';

const ProductReviewsBlock = ({ product }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [viewAll, setViewAll] = useState(false);

  const { success, error: reviewError } = useSelector((state) => state.newReview);
  const { isAuthenticated } = useSelector((state) => state.user);

  const reviewSubmitHandler = () => {
    if (rating === 0) {
      enqueueSnackbar("Please select a rating", { variant: "warning" });
      return;
    }
    
    // Using plain object for JSON submission
    const reviewData = {
      rating,
      comment,
      productId: product._id
    };

    dispatch(newReview(reviewData));
    setOpen(false);
  };

  useEffect(() => {
    if (reviewError) {
      enqueueSnackbar(reviewError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Review Submitted Successfully", { variant: "success" });
      dispatch({ type: NEW_REVIEW_RESET });
      // Refresh product to show new review and updated rating
      dispatch(getProductDetails(product._id));
      // Clear form
      setRating(0);
      setComment("");
    }
  }, [dispatch, reviewError, success, enqueueSnackbar, product._id]);

  if (!product) return null;

  const reviews = product.reviews || [];
  const displayedReviews = viewAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="product-reviews-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <h2 className="text-6xl font-black text-primary leading-none">
              {product.ratings?.toFixed(1) || 0}
            </h2>
            <div className="mt-2">
              <Rating value={product.ratings || 0} precision={0.5} readOnly size="medium" />
              <p className="text-xs text-muted mt-1 font-bold uppercase tracking-wider">
                {product.numOfReviews || 0} Reviews
              </p>
            </div>
          </div>
          <Divider orientation="vertical" flexItem sx={{ height: 60, alignSelf: 'center' }} />
          <div className="hidden sm:block">
            <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 200 }}>
              Based on verified purchases from our community members.
            </Typography>
          </div>
        </div>

        <button 
          className="btn-add-cart" 
          style={{ width: 'auto', padding: '0.75rem 2rem' }}
          onClick={() => isAuthenticated ? setOpen(true) : enqueueSnackbar("Please login to write a review", { variant: "info" })}
        >
          <RateReviewIcon fontSize="small" />
          Write a Review
        </button>
      </div>

      {reviews.length > 0 ? (
        <div className="flex flex-col gap-6">
          {displayedReviews.map((rev, i) => (
            <div
              key={i}
              className="review-card"
              style={{
                padding: '2rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar sx={{ bgcolor: 'var(--accent)', color: '#fff', width: 48, height: 48, fontWeight: 700 }}>
                    {rev.name?.charAt(0) || 'U'}
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-primary text-lg">{rev.name}</h4>
                    <Rating value={rev.rating} readOnly size="small" precision={0.5} />
                  </div>
                </div>
                <span className="text-xs text-muted font-medium bg-subtle px-3 py-1 rounded-full uppercase tracking-tighter">Verified Buyer</span>
              </div>
              <p className="text-secondary leading-relaxed text-base italic">
                "{rev.comment}"
              </p>
            </div>
          ))}

          {reviews.length > 3 && (
            <button
              onClick={() => setViewAll(!viewAll)}
              className="secondary-action-btn mt-4 self-center"
            >
              {viewAll ? "Show Less" : `View All ${reviews.length} Reviews`}
            </button>
          )}
        </div>
      ) : (
        <Box 
          sx={{ 
            p: 8, 
            textAlign: 'center', 
            bgcolor: 'var(--bg-subtle)', 
            borderRadius: 'var(--radius-2xl)',
            border: '2px dashed var(--border)'
          }}
        >
          <Typography variant="h6" color="textPrimary" fontWeight={700} gutterBottom>
            No reviews yet
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Be the first to share your experience with this product!
          </Typography>
          <button 
            className="secondary-action-btn justify-center w-full"
            onClick={() => isAuthenticated ? setOpen(true) : enqueueSnackbar("Please login to write a review", { variant: "info" })}
          >
            Start writing
          </button>
        </Box>
      )}

      {/* Review Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>
          Share Your Experience
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 2 }}>
            <div>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>Overall Rating</Typography>
              <Rating
                size="large"
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
              />
            </div>
            <TextField
              label="Your Review"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? How was the quality?"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit" sx={{ fontWeight: 700 }}>Cancel</Button>
          <Button 
            onClick={reviewSubmitHandler} 
            variant="contained" 
            sx={{ 
              bgcolor: '#FF1837', 
              '&:hover': { bgcolor: '#E01530' },
              fontWeight: 800,
              px: 4,
              borderRadius: 2
            }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductReviewsBlock;