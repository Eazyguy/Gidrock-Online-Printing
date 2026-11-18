import React from "react";

type Props = {
	checked: boolean;
	onChange: (v: boolean) => void;
	label?: string;
};

const GidrockSwitch = ({ checked, onChange, label }: Props) => {
	return (
		<label className="flex cursor-pointer items-center gap-2">
			<input
				type="checkbox"
				className="toggle bg-green-600"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
			/>
			{/**show label if passed */}
			{label && <span className="text-sm font-bold text-green-900">{label}</span>}
		</label>
	);
};

export default GidrockSwitch;
