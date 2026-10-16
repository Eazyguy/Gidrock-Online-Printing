export type FormProps = {
	form: {
		name: string;
		phoneNumber: string;
		email: string;
		address: string;
		state: string;
		localGovernment: string;
		delivery: string;
	};
	setForm: React.Dispatch<React.SetStateAction<FormProps["form"]>>;
	lgas: lgas;
	uploadStatus: "idle" | "uploading" | "completed" | "failed";
	setUploadStatus: React.Dispatch<
		React.SetStateAction<FormProps["uploadStatus"]>
	>;
	handleCheckout: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export type lgas = {
	state: string;
	lgas: string[];
};

export type uploadStatus = "idle" | "uploading" | "completed" | "failed";

export type setUploadStatus = React.Dispatch<
	React.SetStateAction<uploadStatus>
>;

export type handleCheckout = (e: React.MouseEvent<HTMLButtonElement>) => void;

export type setProgress = React.Dispatch<React.SetStateAction<number>>;
