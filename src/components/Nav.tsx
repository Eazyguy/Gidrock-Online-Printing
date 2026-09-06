"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav
      data-text-bright
      data-bg="green"
      className="fixed left-1/2 top-0 z-50 mx-0 mt-2 h-16 w-[95vw] max-w-[1440px] -translate-x-1/2 rounded-full border border-white/50 bg-gradient-to-r from-green-700 to-green-800 p-4 shadow-[0_10px_20px_-10px_black] backdrop-blur-md shadow-black/20 dark:bg-gradient-to-r dark:from-green-800 dark:via-green-700 dark:to-green-900 md:flex md:items-center"
    >
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
        className="absolute left-4 top-4 z-20 flex h-8 w-8 items-center justify-center md:hidden"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            className="text-white"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            className="text-white"
          >
            <g fill="currentColor" strokeWidth="0.5">
              <path d="M8 6.983a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2zM7 12a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1m1 3.017a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z" />
              <path
                fillRule="evenodd"
                d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10m-2 0a8 8 0 1 1-16 0a8 8 0 0 1 16 0"
                clipRule="evenodd"
              />
            </g>
          </svg>
        )}
      </button>

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center px-3 py-2 md:static md:left-auto md:top-auto md:translate-x-0 md:translate-y-0">
        <div data-info="BRAND ICON"> <Image 
        src={"/uu.png"}
        width={150}
        height={75}
        alt=""
        /> </div>
        <span className="ml-2 mr-4 text-[clamp(1.1rem,calc(2vw_+_0.1rem),2rem)] font-bold text-stone-800">
          
        </span>
      </div>

      <ul
        data-info="MENU ITEMS"
        className={`${
          isOpen ? "flex" : "hidden"
        } absolute left-1/2 top-full z-10 mt-2 w-[calc(100%-2rem)] -translate-x-1/2 list-none flex-col rounded-[16px] border border-white/30 bg-green-800 p-4 shadow-lg transition-all md:static md:mt-0 md:w-auto md:translate-x-1 md:flex md:flex-row md:items-center md:justify-center md:gap-x-4 md:gap-x-8 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:mx-auto`}
      >
        <li className="w-full md:w-auto">
          <a href="#top" onClick={closeMenu} className="block text-[clamp(1rem,calc(2vw_+_0.1rem),1.3rem)] text-white transition hover:text-emerald-200 md:text-inherit">
            Home
          </a>
        </li>
        <li className="w-full md:w-auto md:mx-2">
          <a href="#about" onClick={closeMenu} className="mt-4 block text-[clamp(1rem,calc(2vw_+_0.1rem),1.3rem)] text-white transition hover:text-emerald-200 md:mt-0 md:text-inherit">
            About
          </a>
        </li>
        <li className="w-full md:w-auto md:mx-2">
          <a href="#product" onClick={closeMenu} className="mt-4 block text-[clamp(1rem,calc(2vw_+_0.1rem),1.3rem)] text-white transition hover:text-emerald-200 md:mt-0 md:text-inherit">
            Product
          </a>
        </li>
        <li className="w-full md:w-auto md:mx-2">
          <a href="#contact" onClick={closeMenu} className="mt-4 block text-[clamp(1rem,calc(2vw_+_0.1rem),1.3rem)] text-white transition hover:text-emerald-200 md:mt-0 md:text-inherit">
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;