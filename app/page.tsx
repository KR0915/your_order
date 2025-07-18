"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // 1秒後にボタンと文字をアニメーション表示
    const timer = setTimeout(() => {
      setShow(true);
      setAnimate(false);
      setTimeout(() => setPulse(true), 1200);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    router.push("/question-flow");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <h1
          className={
            "text-[3.5rem] sm:text-[5rem] font-black leading-[1.05] mb-4 text-white" +
            (animate || show ? " animate-title-x " : "")
          }
          style={{
            minHeight: "5rem",
            WebkitTextStroke: "3px #fff",
            color: "transparent",
            WebkitTextFillColor: "#fff",
          }}
        >
          Your Order
        </h1>
        {show && (
          <button
            onClick={handleClick}
            className={
              "mt-6 px-8 py-3 rounded-full bg-orange-500 text-white font-black text-xl shadow-lg transition hover:scale-105" +
              (animate || show ? " animate-title-x " : "") +
              (pulse && !animate ? " animate-pulse-custom" : "")
            }
          >
            食べ物を選ぶ
          </button>
        )}
      </div>
      <style>{`
        .animate-title-x {
          animation: slideInX 1.2s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes slideInX {
          0% {
            opacity: 0;
            transform: translateX(-80px) scale(0.8);
          }
          60% {
            opacity: 1;
            transform: translateX(8px) scale(1.08);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .animate-pulse-custom {
          animation: pulseCustom 1.6s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
        @keyframes pulseCustom {
          0%, 100% { transform: scale(1);}
          50% { transform: scale(1.12);}
        }
      `}</style>
    </div>
  );
}