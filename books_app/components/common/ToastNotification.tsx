"use client";

import React, { useEffect, useState } from "react";
import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiInformationCircle } from "react-icons/hi";

// トーストの種類（色やアイコンの設定）
const toastStyles = {
  success: {
    bg: "bg-green-100 text-green-500",
    icon: <HiCheck className="h-5 w-5" />,
  },
  error: {
    bg: "bg-red-100 text-red-500",
    icon: <HiExclamation className="h-5 w-5" />,
  },
  info: {
    bg: "bg-blue-100 text-blue-500",
    icon: <HiInformationCircle className="h-5 w-5" />,
  },
};

type ToastProps = {
  className?: string;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
};

const ToastNotification: React.FC<ToastProps> = ({ className = "", message, type = "info", onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  return (
    <div
      className={`${className} transition-transform duration-500 ${isVisible ? "ease-in translate-x-0 opacity-100" : "ease-out translate-x-[150%] opacity-0"}`}
    >
      <Toast className="dark:bg-white">
        <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toastStyles[type].bg}`}>
          {toastStyles[type].icon}
        </div>
        <div className="ml-3 text-sm font-normal">{message}</div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex h-8 w-8"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 500);
          }}
        >
          ✖
        </button>
      </Toast>
    </div>
  );
};

export default ToastNotification;
