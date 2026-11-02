"use client";

import { useState, useEffect } from "react";
import Header from "./admin/sections/Header";
import AsideNav from "./components/AsideNav";
import MobileNav from "./components/MobileNav";

const layout = ({ children }: { children: React.ReactNode }) => {
	const [collapseNav, setCollapseNav] = useState<boolean>(false);
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const [mobileNav, setMobileNav] = useState<boolean>(true);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);

		checkMobile();

		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<div className="min-h-screen bg-linear-60 from-green-100 to-green-200">
			<Header
				isMobile={isMobile}
				mobileNav={mobileNav}
				setMobileNav={setMobileNav}
				collapseNav={collapseNav}
			/>
			<div className="md:flex">
				{isMobile ? (
					<div className="absolute top-0">
						<MobileNav mobileNav={mobileNav} setMobileNav={setMobileNav} />
					</div>
				) : (
					<div
						className={`hidden md:block ${collapseNav ? "md:w-12 min-h-screen pt-5 mt-0 rounded-none" : " h-[calc(100vh-60px)] w-60 mt-2 rounded"} border-gray-800 h-[calc(100vh-60px)] border-y-0 bg-linear-to-t from-green-50 via-white to-green-900 xs:hidden lg:block shadow-lg shadow-gray-900 relative transition-all duration-200 `}
					>
						<AsideNav collapseNav={collapseNav} setCollapseNav={setCollapseNav} />
					</div>
				)}

				<main className="w-full min-h-screen flex-1 px-5 mb-20 md:mt-25">
					{children}
				</main>
			</div>
		</div>
	);
};

export default layout;
