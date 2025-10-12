import { useSnackbar } from "notistack";
import { useContext, useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction";
import { saveForLater } from "../../actions/saveForLaterAction";
import { LanguageContext } from "../../utils/LanguageContext";
import { getDeliveryDate, getDiscount } from "../../utils/functions";
import gsap from "gsap";
// import { LanguageContext } from '../../../utils/LanguageContext';

const CartItem = ({
  product,
  name,
  seller,
  price,
  cuttedPrice,
  image,
  stock,
  quantity,
  inCart,
}) => {
  const { language } = useContext(LanguageContext);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [pendingRemove, setPendingRemove] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    if (showRemoveModal && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [showRemoveModal]);

  const confirmRemove = (id) => {
    setPendingRemove(id);
    setShowRemoveModal(true);
  };

  const handleRemoveConfirmed = () => {
    removeCartItem(pendingRemove);
    setShowRemoveModal(false);
    setPendingRemove(false);
  };

  const handleRemoveCancelled = () => {
    setShowRemoveModal(false);
    setPendingRemove(false);
  };

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (quantity >= stock) {
      enqueueSnackbar(
        language === "english"
          ? "Maximum Order Quantity"
          : "সর্বোচ্চ অর্ডার পরিমাণ",
        { variant: "warning" }
      );
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (quantity <= 1) {
      // Instead of returning, trigger remove modal
      confirmRemove(id);
      return;
    }
    dispatch(addItemsToCart(id, newQty));
  };

  const removeCartItem = (id) => {
    dispatch(removeItemsFromCart(id));
    enqueueSnackbar(
      language === "english"
        ? "Product Removed From Cart"
        : "পণ্য কার্ট থেকে সরানো হয়েছে",
      { variant: "success" }
    );
  };

  const saveForLaterHandler = (id) => {
    dispatch(saveForLater(id));
    removeCartItem(id);
    enqueueSnackbar(
      language === "english" ? "Saved For Later" : "পরে কেনার জন্য সংরক্ষিত",
      { variant: "success" }
    );
  };

  return (
    <div
      className="flex flex-col gap-3 py-5 px-2 sm:px-6 mb-4 bg-[var(--primary-bg)] rounded-xl border border-[var(--border-light)] overflow-hidden"
      key={product}
    >
      <Link
        to={`/product/${product}`}
        className="flex flex-col sm:flex-row gap-5 items-stretch w-full group"
      >
        {/* <!-- product image --> */}
        <div className="w-full sm:w-1/6 h-28 flex-shrink-0 flex items-center justify-center bg-white rounded-lg shadow-sm border border-[var(--border-light)]">
          <img
            draggable="false"
            className="h-full w-full object-contain rounded-md"
            src={image}
            alt={name}
          />
        </div>
        {/* <!-- product image --> */}

        {/* <!-- description --> */}
        <div className="flex flex-col sm:gap-5 w-full pr-6">
          {/* <!-- product title --> */}
          <div className="flex flex-col sm:flex-row justify-between items-start pr-5 gap-1 sm:gap-0">
            <div className="flex flex-col gap-0.5 sm:w-3/5">
              <p className="text-lg font-semibold text-[var(--primary-blue-dark)] transition-colors">
                {name.length > 42 ? `${name.substring(0, 42)}...` : name}
              </p>
              <span className="text-xs text-gray-500 mt-0.5">
                {language === "english" ? "Made by:" : "বিক্রেতা:"}{" "}
                <span className="text-[var(--primary-blue-light)] font-medium">
                  Flanbd
                </span>
              </span>
            </div>

            <div className="flex flex-col sm:gap-2 items-end">
              <p className="text-sm text-[var(--primary-blue-dark)] font-medium flex items-center gap-1">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block mr-1"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="var(--primary-blue-light)"
                  />
                  <path
                    d="M8 12l2.5 2.5L16 9"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {language === "english" ? "Delivery by" : "ডেলিভারি হবে"}{" "}
                {getDeliveryDate()}
              </p>
              <span className="text-xs text-gray-500">
                {language === "english"
                  ? "7 Days Replacement Policy"
                  : "৭ দিনের প্রতিস্থাপন নীতি"}
              </span>
            </div>
          </div>
          {/* <!-- product title --> */}

          {/* <!-- price desc --> */}
          <div className="flex items-baseline gap-2 text-xl font-bold mt-2">
            <span className="text-[var(--primary-blue-dark)]">
              ৳{(price * quantity).toLocaleString()}
            </span>
            <span className="text-sm text-gray-400 line-through font-normal ml-1">
              ৳{(cuttedPrice * quantity).toLocaleString()}
            </span>
            <span className="text-sm font-semibold ml-2 px-2 py-0.5 rounded bg-[var(--primary-blue-light)] text-white">
              {getDiscount(price, cuttedPrice)}%{" "}
              {language === "english" ? "off" : "ছাড়"}
            </span>
          </div>
          {/* <!-- price desc --> */}
        </div>
        {/* <!-- description --> */}
      </Link>

      {/* <!-- save for later --> */}
      <div className="flex justify-between pr-4 sm:pr-0 sm:justify-start sm:gap-6 mt-2">
        {/* <!-- quantity --> */}
        <div className="flex gap-1 items-center bg-white rounded-full px-2 py-1 border border-[var(--primary-blue-light)] shadow-sm">
          <span
            onClick={() => decreaseQuantity(product, quantity)}
            className="w-7 h-7 text-3xl font-light bg-gray-50 rounded-full border flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--primary-blue-light)] hover:text-white"
          >
            <p>-</p>
          </span>
          <input
            className="w-11 border-none outline-none text-center rounded-sm py-0.5 text-gray-700 font-bold text-sm qtyInput bg-transparent"
            value={quantity}
            disabled
          />
          <span
            onClick={() => increaseQuantity(product, quantity, stock)}
            className="w-7 h-7 text-xl font-light bg-gray-50 rounded-full border flex items-center justify-center cursor-pointer transition-colors hover:bg-[var(--primary-blue-light)] hover:text-white"
          >
            +
          </span>
        </div>
        {/* <!-- quantity --> */}
        {inCart && (
          <>
            <button
              onClick={() => saveForLaterHandler(product)}
              className="sm:ml-4 font-medium text-white hover:text-[var(--primary-blue-light)] transition-colors px-3 py-1 rounded"
            >
              {language === "english"
                ? "SAVE FOR LATER"
                : "পরে কেনার জন্য সংরক্ষণ"}
            </button>
            <button
              onClick={() => confirmRemove(product)}
              className="font-medium text-white hover:text-white hover:bg-[var(--primary-blue-dark)] transition-colors px-3 py-1 rounded"
            >
              {language === "english" ? "REMOVE" : "সরান"}
            </button>
          </>
        )}
      </div>
      {/* <!-- save for later --> */}

      {/* Remove confirmation modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl p-6 min-w-[300px] max-w-xs flex flex-col items-center"
            style={{ pointerEvents: "auto" }}
          >
            <svg
              width="48"
              height="48"
              fill="none"
              viewBox="0 0 24 24"
              className="mb-2"
            >
              <circle cx="12" cy="12" r="12" fill="var(--primary-blue-light)" />
              <path
                d="M8 15l8-8M8 8l8 8"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-lg font-semibold text-[var(--primary-blue-dark)] mb-2 text-center">
              {language === "english"
                ? "Remove this product from cart?"
                : "এই পণ্যটি কার্ট থেকে সরাতে চান?"}
            </p>
            <p className="text-sm text-gray-600 mb-4 text-center">
              {language === "english"
                ? "Do you really wish to remove this product?"
                : "আপনি কি সত্যিই এই পণ্যটি সরাতে চান?"}
            </p>
            <div className="flex gap-3 w-full justify-center">
              <button
                onClick={handleRemoveConfirmed}
                className="bg-[var(--primary-blue-dark)] hover:bg-[var(--primary-blue-light)] text-white font-medium px-4 py-2 rounded transition-colors"
              >
                {language === "english" ? "Yes, remove" : "হ্যাঁ, সরান"}
              </button>
              <button
                onClick={handleRemoveCancelled}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-4 py-2 rounded transition-colors"
              >
                {language === "english" ? "Cancel" : "বাতিল"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
