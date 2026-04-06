import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addItemsToCart } from "../../actions/cartAction";
import { removeFromSaveForLater } from "../../actions/saveForLaterAction";
import { LanguageContext } from "../../utils/LanguageContext";
import { useSnackbar } from "notistack";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const SaveForLaterItem = ({ product, name, price, cuttedPrice, image }) => {
  const { language } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const t = (eng, ben) => (language === "english" ? eng : ben);

  const moveToCartHandler = () => {
    dispatch(addItemsToCart(product, 1));
    dispatch(removeFromSaveForLater(product));
    enqueueSnackbar(t("Moved to cart", "কার্টে সরানো হয়েছে"), { variant: "success" });
  };

  const removeHandler = () => {
    dispatch(removeFromSaveForLater(product));
    enqueueSnackbar(t("Removed from saved", "সংরক্ষণ তালিকা থেকে সরানো হয়েছে"), { variant: "info" });
  };

  return (
    <div className="cart-item-row" style={{ opacity: 0.75 }}>
      <div className="cart-item-image">
        <Link to={`/product/${product}`}>
          <img src={image} alt={name} />
        </Link>
      </div>

      <div className="cart-item-info">
        <h3>
          <Link to={`/product/${product}`}>
            {name}
          </Link>
        </h3>

        <div className="cart-item-meta">
          <span>{t("Saved for later", "পরে কেনার জন্য সংরক্ষিত")}</span>
        </div>

        <div className="cart-item-actions">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="cart-item-save" onClick={moveToCartHandler}>
              <ShoppingCartOutlinedIcon sx={{ fontSize: 14 }} />
              {t("Move to cart", "কার্টে নিন")}
            </button>
            <button className="cart-item-remove" onClick={removeHandler}>
              <DeleteOutlineIcon sx={{ fontSize: 14 }} />
              {t("Remove", "সরান")}
            </button>
          </div>
        </div>
      </div>

      <div className="cart-item-price">
        <span className="price-current">৳{price.toLocaleString()}</span>
        {cuttedPrice > price && (
          <span className="price-original">৳{cuttedPrice.toLocaleString()}</span>
        )}
      </div>
    </div>
  );
};

export default SaveForLaterItem;
