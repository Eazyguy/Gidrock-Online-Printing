import React from "react";

type Props = {
	label: string;
	type?: string;
	placeholder: string;
	icon?: React.ComponentType<{ className?: string }>;
	value: string;
	onChange: (v: string) => void;
	hint?: string;
	required?: boolean;
	validatePassword?: boolean;
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
	validatePassword = false,
}: Props) => {
	return (
		<div>
			<fieldset className="fieldset w-full">
				<legend className="fieldset-legend text-green-800">{label}</legend>
				<label className="input w-full border-gray-300 bg-white text-gray-900 focus-within:border-green-500 focus-within:outline-0 focus-within:border-2">
					{Icon ? <Icon className="h-4 w-4 text-gray-500" /> : null}
					<input
						type={type}
						placeholder={placeholder}
						value={value}
						required={required}
						onChange={(e) => onChange(e.target.value)}
						className="validator-grow"
						name={type === "email" ? "email" : type === "password" ? "password" : undefined}
						autoComplete={
							type === "email"
								? "email"
								: type === "password"
									? "current-password"
									: type === "tel"
										? "tel"
										: undefined
						}
						pattern={
							type === "password" && validatePassword
								? "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
								: undefined
						}
						title={
							type === "password" && validatePassword
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
