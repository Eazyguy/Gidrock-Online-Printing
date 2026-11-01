"use client";

import Image from "next/image";

const Header = ({
	isMobile,
	mobileNav,
	setMobileNav,
	collapseNav,
}: {
	isMobile: boolean;
	mobileNav: boolean;
	setMobileNav: React.Dispatch<React.SetStateAction<boolean>>;
	collapseNav: boolean;
}) => {
	console.log(collapseNav);

	return (
		<div>
			{isMobile ? (
				<div className="flex justify-start items-center ms-2 py-5 gap-5">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="40"
						height="40"
						viewBox="0 0 24 24"
						className={"text-green-800"}
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
							"bg-linear-60 from-green-500 via-green-900 to-green-600 rounded-full shadow-lg shadow-gray-900"
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
		</div>
	);
};

export default Header;
