import "server-only";

import crypto from "crypto";

export const createCancellationToken = (gid: string, secretKey: string) =>
	crypto
		.createHmac("sha256", secretKey)
		.update(`cancel-order:${gid}`)
		.digest("hex");

export const isValidCancellationToken = (
	gid: string,
	token: unknown,
	secretKey: string,
) => {
	if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
		return false;
	}

	const expectedToken = Buffer.from(
		createCancellationToken(gid, secretKey),
		"hex",
	);
	const receivedToken = Buffer.from(token, "hex");

	return (
		expectedToken.length === receivedToken.length &&
		crypto.timingSafeEqual(expectedToken, receivedToken)
	);
};
