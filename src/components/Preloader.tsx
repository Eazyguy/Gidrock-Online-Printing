import Image from "next/image";

const Preloader = ({ show }: { show: boolean }) => {
	if (!show) return null;
	return (
		<div className="fixed inset-0 z-9999 bg-gray-600/80 flex items-center justify-center">
			<div className="animate-pulse-scale">
				<Image
					src={"/uu.png"}
					width={150}
					height={150}
					alt="loading ..."
					className="object-contain"
				/>
			</div>
		</div>
	);
};

export default Preloader;
