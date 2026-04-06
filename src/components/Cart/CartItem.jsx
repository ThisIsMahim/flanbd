import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import { saveForLater } from "../../actions/saveForLaterAction";
import { LanguageContext } from "../../utils/LanguageContext";
import { useSnackbar } from "notistack";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const CartItem = ({ product, name, price, cuttedPrice, image, stock, quantity, inCart }) => {
  const { language } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const t = (eng, ben) => (language === "english" ? eng : ben);

  const handleQtyChange = (newQty) => {
    if (newQty > stock) return;
    if (newQty < 1) {
      dispatch(removeItemsFromCart(product));
      return;
    }
    dispatch(addItemsToCart(product, newQty));
  };

  const removeHandler = () => {
    dispatch(removeItemsFromCart(product));
    enqueueSnackbar(t("Product removed", "পণ্য সরানো হয়েছে"), { variant: "info" });
  };

  const saveLaterHandler = () => {
    dispatch(saveForLater(product));
    dispatch(removeItemsFromCart(product));
    enqueueSnackbar(t("Saved for later", "পরে কেনার জন্য সংরক্ষিত"), { variant: "success" });
  };

  return (
    <div className="cart-item-row">
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
          <span>{t("Sold by:", "বিক্রেতা:")} Flanbd</span>
          {stock < 5 && <span className="text-accent" style={{ marginLeft: '0.5rem' }}>({t(`Only ${stock} left`, `মাত্র ${stock}টি বাকি`)})</span>}
        </div>

        <div className="cart-item-actions">
          <div className="qty-control">
            <button className="qty-btn" onClick={() => handleQtyChange(quantity - 1)}>−</button>
            <span className="qty-value">{quantity}</span>
            <button className="qty-btn" onClick={() => handleQtyChange(quantity + 1)} disabled={quantity >= stock}>+</button>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {inCart && (
              <button className="cart-item-save" onClick={saveLaterHandler}>
                <FavoriteBorderIcon sx={{ fontSize: 14 }} />
                {t("Save for later", "পরে কেনুন")}
              </button>
            )}
            <button className="cart-item-remove" onClick={removeHandler}>
              <DeleteOutlineIcon sx={{ fontSize: 14 }} />
              {t("Remove", "সরান")}
            </button>
          </div>
        </div>
      </div>

      <div className="cart-item-price">
        <span className="price-current">৳{(price * quantity).toLocaleString()}</span>
        {cuttedPrice > price && (
          <span className="price-original">৳{(cuttedPrice * quantity).toLocaleString()}</span>
        )}
      </div>
    </div>
  );
};

export default CartItem;
