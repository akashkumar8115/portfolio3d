import React, { useEffect } from 'react'
import { useState } from 'react';
import { IoIosArrowUp } from "react-icons/io";

const ScrollTop = () => {

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {

        if (window.scrollY > 400) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }


    useEffect(() => {

        window.addEventListener("scroll", toggleVisibility);

        return (() => window.removeEventListener("scroll", toggleVisibility));

    }, [])

    return (
        <div>
            <div className={`fixed bottom-[100px] right-9 ${isVisible ? 'opacity-100' : 'opacity-0'} z-50`}>
                <button
                    type="button"
                    onClick={scrollToTop}
                    className="bg-green-600 bg-opacity-40 hover:bg-opacity-100 items-center rounded-full p-2 text-white shadow-sm transition-opacity "
                >
                    <IoIosArrowUp className="text-4xl" />
                </button>
            </div>
        </div>
    )
}

export default ScrollTop