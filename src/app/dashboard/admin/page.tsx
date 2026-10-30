"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import AsideNav from "../components/AsideNav";
import MobileNav from "../components/MobileNav";

const admin = () => {
	const [collapseNav, setCollapseNav] = useState<boolean>(false);
	const [isMobile, setIsMobile] = useState<boolean>(false);
	const [mobileNav, setMobileNav] = useState<boolean>(true);

	console.log(collapseNav);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);

		checkMobile();

		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<>
			{isMobile ? (
				<div className="flex justify-start items-center ms-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="40"
						height="40"
						viewBox="0 0 24 24"
						className={!mobileNav && isMobile ? "hidden" : "text-green-800 mt-9"}
						onClick={() => setMobileNav(!mobileNav)}
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
					<Image
						src={"/uu.png"}
						alt="Gidrock online printing"
						width={150}
						height={150}
						className={
							mobileNav
								? "ms-15 absolute bg-linear-60 from-green-500 via-green-900 to-green-600 rounded-full shadow-lg shadow-gray-900 mt-15"
								: "hidden"
						}
					/>
				</div>
			) : (
				<Image
					src={"/uu.png"}
					alt="Gidrock online printing"
					width={150}
					height={150}
					className={
						collapseNav
							? "ms-15 absolute bg-linear-60 from-green-500 via-green-900 to-green-600 rounded-full shadow-lg shadow-gray-900 mt-10"
							: "hidden"
					}
				/>
			)}
			<div className="md:grid grid-cols-1 md:grid-cols-2 ">
				<div className="hidden md:block">
					<AsideNav collapseNav={collapseNav} setCollapseNav={setCollapseNav} />
				</div>
				{isMobile && (
					<div className="absolute top-0">
						<MobileNav mobileNav={mobileNav} setMobileNav={setMobileNav} />
					</div>
				)}
				<main className="w-full min-h-screen"></main>
			</div>
		</>
	);
};

export default admin;
