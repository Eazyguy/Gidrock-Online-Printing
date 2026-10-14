"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "./CartContext";
import Preloader from "./Preloader";

const GlobalPreloader = () => {
	const pathName = usePathname();
	const { isNavigating, stopNav } = useCartStore();

	useEffect(() => {
		stopNav();
	}, [pathName, stopNav]);

	return <Preloader show={isNavigating} />;
};

export default GlobalPreloader;
