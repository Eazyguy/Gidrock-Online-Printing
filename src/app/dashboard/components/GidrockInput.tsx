import React from "react";

type Props = {
	label: string;
	type?: string;
	placeholder: string;
	icon?: any;
	value: string;
	onChange: (v: string) => void;
	hint?: string;
	required?: boolean;
};

const GidrockInput = ({
	label,
	type = "text",
	placeholder,
	icon: Icon,
	value,
	onChange,
	hint = "Please enter a valid value",
	required = true,
}: Props) => {
	return (
		<div>
			<fieldset className="fieldset w-full">
				<legend className="fieldset-legend text-green-800">{label}</legend>
				<label className="input w-full focus-within:border-green-500 focus-within:outline-0 focus-within:border-2">
					<Icon className="h-4 w-4 text-gray-500" />
					<input
						type={type}
						placeholder={placeholder}
						value={value}
						required={required}
						onChange={(e) => onChange(e.target.value)}
						className="validator-grow"
						pattern={
							type == "password" ? "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" : undefined
						}
						title={
							type == "password"
								? "Must be 8+ characters, with number and uppercase"
								: undefined
						}
					/>
				</label>

				<p className="validator-hint text-green-950">{hint}</p>
			</fieldset>
		</div>
	);
};

export default GidrockInput;
