import React from "react";
import admin from "./admin/page";

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="min-h-screen bg-linear-60 from-green-100 to-green-200">
			{children}
		</div>
	);
};

export default layout;
