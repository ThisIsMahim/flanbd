import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="flex items-center flex-col gap-2 m-4 py-3">
      <div className="w-40 h-40 flex items-center justify-center rounded-full bg-[#f6faff] p-4 mb-1">
        <div className="relative">
          {/* Notebook style SVG icon */}
          <svg
            width="100"
            height="100"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="12"
              y="8"
              width="40"
              height="48"
              rx="4"
              fill="#fff"
              stroke="#8b8b8b"
              strokeWidth="2"
            />
            <rect
              x="16"
              y="12"
              width="32"
              height="40"
              rx="2"
              fill="#f3f3f3"
              stroke="#d1d5db"
              strokeWidth="1.5"
            />
            <line
              x1="20"
              y1="18"
              x2="44"
              y2="18"
              stroke="#b0b0b0"
              strokeWidth="1.2"
            />
            <line
              x1="20"
              y1="24"
              x2="44"
              y2="24"
              stroke="#b0b0b0"
              strokeWidth="1.2"
            />
            <line
              x1="20"
              y1="30"
              x2="44"
              y2="30"
              stroke="#b0b0b0"
              strokeWidth="1.2"
            />
            <line
              x1="20"
              y1="36"
              x2="44"
              y2="36"
              stroke="#b0b0b0"
              strokeWidth="1.2"
            />
            <line
              x1="20"
              y1="42"
              x2="44"
              y2="42"
              stroke="#b0b0b0"
              strokeWidth="1.2"
            />
            <circle cx="16" cy="16" r="1.5" fill="#8b8b8b" />
            <circle cx="16" cy="22" r="1.5" fill="#8b8b8b" />
            <circle cx="16" cy="28" r="1.5" fill="#8b8b8b" />
            <circle cx="16" cy="34" r="1.5" fill="#8b8b8b" />
            <circle cx="16" cy="40" r="1.5" fill="#8b8b8b" />
          </svg>
          {/* <span className="text-gray-700 font-medium text-base text-center block absolute w-full bottom-0">
            Empty Cart
          </span> */}
        </div>
      </div>

      <h2 className="text-xl font-semibold text-[var(--text-dark)] mt-1">
        Your cart is empty!
      </h2>

      <p className="text-gray-600 text-center text-sm max-w-xs mb-2">
        You haven't added anything to your cart yet. Start shopping and add your
        favorite items to your cart!
      </p>

      <Link
        to="/products"
        className="bg-[var(--button-bg)] hover:bg-[var(--button-hover)] flex items-center justify-center gap-2 text-white px-6 py-2 rounded-md text-sm shadow-md hover:shadow-lg transition-all duration-300"
      >
        <span>Shop Now</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-1 group-hover:translate-x-1 transition-transform"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};

export default EmptyCart;
