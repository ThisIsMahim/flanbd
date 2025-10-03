import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../actions/wishlistAction";
import { getDiscount } from "../../../utils/functions";
import OptimizedImg from "../../common/OptimizedImg";

const Product = (props) => {
  const { _id, name, images, ratings, numOfReviews, price, cuttedPrice } =
    props;

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { wishlistItems } = useSelector((state) => state.wishlist);

  const itemInWishlist = wishlistItems.some((i) => i.product === _id);

  const addToWishlistHandler = () => {
    if (itemInWishlist) {
      dispatch(removeFromWishlist(_id));
      enqueueSnackbar("Remove From Wishlist", { variant: "success" });
    } else {
      dispatch(addToWishlist(_id));
      enqueueSnackbar("Added To Wishlist", { variant: "success" });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 px-3 py-3 relative rounded-lg transition-all duration-300 h-full bg-[rgb(255,255,255)] border border-[--border-light] hover:border-[--primary-blue-light] hover:translate-y-[-4px] shadow-md hover:shadow-lg">
      {/* <!-- image & product title --> */}
      <Link
        to={`/product/${_id}`}
        className="flex flex-col items-center text-center group w-full"
      >
        <div className="w-full overflow-visible rounded-md p-1 bg-[rgb(255,255,255)] flex items-center justify-center" style={{height: 'auto', minHeight: '60px'}}>
          <OptimizedImg
            draggable={false}
            className="transform group-hover:scale-105 transition-transform duration-300"
            style={{ maxHeight: 'none', maxWidth: '60%', width: 'auto', height: 'auto', objectFit: 'contain' }}
            src={images[0].url}
            alt={name}
            quality="80"
            format="auto"
            placeholder="blur"
          />
        </div>
        <h2 className="text-sm mt-4 group-hover:text-[--primary-blue-dark] font-medium line-clamp-2 h-10 group-hover:text-[#1172c0]">
          {name.length > 50 ? `${name.substring(0, 50)}...` : name}
        </h2>
      </Link>
      {/* <!-- image & product title --> */}

      {/* <!-- product description --> */}
      <div className="flex flex-col gap-2 items-center w-full mt-2">
        {/* <!-- rating badge --> */}
        <span className="text-sm text-[--primary-blue-dark] font-medium flex gap-2 items-center">
          <span className="text-xs px-1.5 py-0.5 bg-[--primary-blue-dark] rounded-sm text-[#1172c0] flex items-center gap-0.5">
            {ratings.toFixed(1)}{" "}
            <StarIcon
              sx={{ fontSize: "14px", color: "var(--primary-blue-dark)" }}
            />
          </span>
          <span>({numOfReviews.toLocaleString()})</span>
        </span>
        {/* <!-- rating badge --> */}

        {/* <!-- price container --> */}
        <div className="flex items-center gap-1.5 text-md font-medium mt-1">
          <span className="text-[--text-dark] font-bold">
            ৳{price.toLocaleString()}
          </span>
          <span className="text-gray-500 line-through text-xs">
            ৳{cuttedPrice.toLocaleString()}
          </span>
          <span className="text-xs px-2 py-0.5 bg-[--glass-bg] text-[--primary-blue-dark] rounded-full font-medium">
            {getDiscount(price, cuttedPrice)}% off
          </span>
        </div>
        {/* <!-- price container --> */}
      </div>
      
      {/* pass selected color to quick view via parent handler if provided elsewhere */}
      {/* <!-- product description --> */}

      {/* <!-- wishlist badge --> */}
      <span
        onClick={addToWishlistHandler}
        className={`
                    ${
                      itemInWishlist
                        ? "text-red-500 bg-red-50"
                        : "text-gray-300 bg-white hover:text-red-500 hover:bg-red-50"
                    } 
                    absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all duration-300
                `}
      >
        <FavoriteIcon sx={{ fontSize: "18px" }} />
      </span>
      {/* <!-- wishlist badge --> */}
    </div>
  );
};

export default Product;
