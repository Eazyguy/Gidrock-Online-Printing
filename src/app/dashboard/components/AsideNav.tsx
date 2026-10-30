import { dashNavLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const AsideNav = ({
	collapseNav,
	setCollapseNav,
}: {
	collapseNav: boolean;
	setCollapseNav: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const pathName = usePathname();

	return (
		<>
			<aside
				className={`${collapseNav ? "md:w-12 min-h-screen pt-5 mt-0 rounded-none" : " h-[calc(100vh-60px)] w-60 mt-2 rounded"} border-gray-800 h-[calc(100vh-60px)] border-y-0 bg-linear-to-t from-green-50 via-white to-green-900 xs:hidden lg:block shadow-lg shadow-gray-900 relative transition-all duration-200 `}
			>
				{collapseNav ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="36"
						height="36"
						viewBox="0 0 24 24"
						className="text-white"
						onClick={() => setCollapseNav(!collapseNav)}
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
				) : (
					<Image
						src={"/uu.png"}
						alt="Gidrock online printing"
						width={150}
						height={150}
						className="mt-2 mx-auto"
					/>
				)}
				<nav className="w-full">
					<ul className="flex flex-col item mt-5 gap-1 text-green-900 font-bold">
						{dashNavLinks.map((item) => {
							const isActive = pathName.includes(item.label);
							return (
								<Link
									className={`text-lg py-2 hover:scale-105 hover:transition group relative ${isActive || item.label == "Overview" ? "bg-green-700 text-white hover:text-gray-300" : "hover:text-green-700"} ${collapseNav ? "ps-2" : "ps-5"}`}
									href={item.href}
									key={item.label}
								>
									<span>{item.icon}</span>
									<span
										className={
											collapseNav
												? "hidden absolute group-hover:inline group-hover:left-8 text-sm bg-green-800 group-hover:text-white rounded p-0.5 top-"
												: ""
										}
									>
										{item.label}
									</span>
								</Link>
							);
						})}
					</ul>
				</nav>
				<div
					className={
						collapseNav
							? "hidden"
							: "text-green-900 rounded-full w-full p-0.5 border text-sm text-center underline cursor-pointer absolute bottom-5"
					}
					onClick={() => setCollapseNav(!collapseNav)}
				>
					&lt; &lt; Click to collapse
				</div>
			</aside>
		</>
	);
};

export default AsideNav;
