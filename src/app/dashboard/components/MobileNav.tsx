import { dashNavLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const MobileNav = ({
	mobileNav,
	setMobileNav,
}: {
	mobileNav: boolean;
	setMobileNav: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const pathName = usePathname();

	return (
		<>
			<aside
				className={`${mobileNav ? "w-0 " : " h-[calc(100vh-60px)] w-60 mt-2 rounded"} border-gray-800 h-[calc(100vh-60px)] border-y-0 bg-linear-to-t overflow-hidden from-green-50 via-white to-green-900 xs:hidden lg:block shadow-lg shadow-gray-900 relative transition-all duration-200`}
			>
				<Image
					src={"/uu.png"}
					alt="Gidrock online printing"
					width={150}
					height={150}
					className="mt-2 mx-auto"
				/>

				<nav className="w-full">
					<ul className="flex flex-col item mt-5 gap-1 text-green-900 font-bold">
						{dashNavLinks.map((item) => {
							const isActive = pathName.includes(item.label);
							return (
								<Link
									className={`text-lg py-2 hover:scale-105 hover:transition group relative ${isActive || item.label == "Overview" ? "bg-green-700 text-white hover:text-gray-300" : "hover:text-green-700"} ${mobileNav ? "ps-2" : "ps-5"}`}
									href={item.href}
									key={item.label}
								>
									<span>{item.icon}</span>
									<span
										className={
											mobileNav
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
						mobileNav
							? "hidden"
							: "text-green-900 rounded-full w-full p-0.5 border text-sm text-center underline cursor-pointer absolute bottom-5"
					}
					onClick={() => setMobileNav(!mobileNav)}
				>
					&lt; &lt; Click to collapse
				</div>
			</aside>
		</>
	);
};

export default MobileNav;
