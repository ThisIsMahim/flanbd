import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Loader = ({ title = "Loading..." }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-transparent">
      <div className="w-[200px] h-[200px] flex items-center justify-center">
        <DotLottieReact
          src="https://lottie.host/372c77ed-b511-468b-8150-c23e882b1ee8/JWw5HavC5E.lottie"
          loop
          autoplay
          className="w-full h-full"
          style={{
            filter: "brightness(0) saturate(100%) invert(17%) sepia(13%) saturate(1200%) hue-rotate(170deg) brightness(90%)"
          }}
        />
      </div>
      <h2 className="mt-8 text-2xl font-bold text-white uppercase tracking-widest animate-pulse">
        {title}
      </h2>
    </div>
  );
};

export default Loader;
