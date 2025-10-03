import React from "react";
import Backdrop from "@mui/material/Backdrop";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const BackdropLoader = ({ title = "Loading..." }) => {
  return (
    <Backdrop
      sx={{
        zIndex: 1500,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
      }}
      open={true}
    >
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
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
            style={{ width: "100%", height: "100%" }}
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
    </Backdrop>
  );
};

export default BackdropLoader;
