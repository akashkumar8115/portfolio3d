"use client";

import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

export default function ScrollTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className={`fixed bottom-[100px] right-9 z-50 transition-opacity ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="rounded-full bg-sky-500 p-2 text-white shadow-lg transition hover:bg-sky-600"
        aria-label="Scroll to top"
      >
        <IoIosArrowUp className="text-4xl" />
      </button>
    </div>
  );
}
