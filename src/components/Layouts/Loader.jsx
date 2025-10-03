import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loader = ({ title = "Loading..." }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--primary-bg)",
      }}
    >
      <div
        style={{
          width: 200,
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DotLottieReact
          src="https://lottie.host/372c77ed-b511-468b-8150-c23e882b1ee8/JWw5HavC5E.lottie"
          loop
          autoplay
          style={{
            width: "100%",
            height: "100%",
            filter:
              "brightness(0) saturate(100%) invert(17%) sepia(13%) saturate(1200%) hue-rotate(170deg) brightness(90%)",
          }}
        />
      </div>
      <h2
        style={{
          marginTop: 32,
          fontSize: 24,
          fontWeight: 500,
          color: "var(--primary-blue-dark)",
        }}
      >
        {title}
      </h2>
    </div>
  );
};

export default Loader;
