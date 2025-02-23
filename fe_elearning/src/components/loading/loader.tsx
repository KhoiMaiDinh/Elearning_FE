// components/ThreeBodyLoader.tsx
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex items-center flex-col justify-center w-full h-full bg-lightSilver/50 z-50">
      <div className="relative inline-block w-[35px] h-[35px] animate-spin78236">
        <div className="absolute w-[30%] h-full bottom-[5%] left-0 transform rotate-[60deg] origin-[50%_85%]">
          <div
            className="absolute bottom-0 left-0 w-full pb-[100%] bg-[#5D3FD3] rounded-full animate-wobble1"
            style={{ animationDelay: "-0.24s" }} // calc(0.8s * -0.3)
          />
        </div>
        <div className="absolute w-[30%] h-full bottom-[5%] right-0 transform -rotate-[60deg] origin-[50%_85%]">
          <div
            className="absolute bottom-0 left-0 w-full pb-[100%] bg-[#5D3FD3] rounded-full animate-wobble1"
            style={{ animationDelay: "-0.12s" }} // calc(0.8s * -0.15)
          />
        </div>
        <div className="absolute w-[30%] h-full bottom-[-5%] left-0 transform translate-x-[116.666%]">
          <div className="absolute top-0 left-0 w-full pb-[100%] bg-[#5D3FD3] rounded-full animate-wobble2" />
        </div>

        <style jsx>{`
          @keyframes spin78236 {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes wobble1 {
            0%,
            100% {
              transform: translateY(0%) scale(1);
              opacity: 1;
            }
            50% {
              transform: translateY(-66%) scale(0.65);
              opacity: 0.8;
            }
          }

          @keyframes wobble2 {
            0%,
            100% {
              transform: translateY(0%) scale(1);
              opacity: 1;
            }
            50% {
              transform: translateY(66%) scale(0.65);
              opacity: 0.8;
            }
          }

          .animate-spin78236 {
            animation: spin78236 2s infinite linear; // calc(0.8s * 2.5)
          }

          .animate-wobble1 {
            animation: wobble1 0.8s infinite ease-in-out;
          }

          .animate-wobble2 {
            animation: wobble2 0.8s infinite ease-in-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Loader;
