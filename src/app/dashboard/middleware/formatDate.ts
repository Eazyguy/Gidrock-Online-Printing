export const formatDate = (timestamp = Date.now()) => {
	const date = new Date(timestamp);

	const day = date.getDate();
	const month = date.toLocaleString("en-GB", { month: "long" });
	const year = date.getFullYear();

	// add st, nd, rd, th
	const suffix = (d: number) => {
		if (d > 3 && d < 21) return "th";
		switch (d % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	};
	return `${day}${suffix(day)} ${month} ${year}`;
};
