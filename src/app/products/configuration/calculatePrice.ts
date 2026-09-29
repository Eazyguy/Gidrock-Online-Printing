import type { Config, ProductConfiguration } from "./types";

type PriceBreakdown = {
	size: number;
	lamination: number;
	banner: number;
};

export const calculateConfigurationPrice = (
	config: Config | null,
	settings: ProductConfiguration | null,
	size: Record<string, number | string | null> | null,
) => {
	const sizePrice = size && config?.size ? Number(size[config.size]) || 0 : 0;
	const finishingRates = settings?.finishing;
	const finishingPrice =
		config?.lamination &&
		config.size &&
		finishingRates &&
		!Array.isArray(finishingRates)
			? Number(finishingRates[config.lamination]?.[config.size]) || 0
			: 0;
	const areaPrice =
		Number(config?.heightFt ?? 0) *
		Number(config?.widthFt ?? 0) *
		Number(settings?.pricePerSqFt ?? 0);
	const prices: PriceBreakdown = {
		size: sizePrice,
		lamination: finishingPrice,
		banner: areaPrice,
	};

	return {
		prices,
		totalPrice:
			(prices.size + prices.lamination + prices.banner) * Number(config?.qty ?? 1),
	};
};
