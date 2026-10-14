import React from "react";
import Image from "next/image";

const Preloader = ({ show }: { show: boolean }) => {
	if (!show) return null;
	return (
		<div className="fixed inset-0 z-9999 bg-white flex items-center justify-center">
			<div className="animate-pulse-scale">
				<Image
					src={"/uu.png"}
					width={16}
					height={16}
					alt="loading ..."
					className="object-contain"
				/>
			</div>
		</div>
	);
};

export default Preloader;
