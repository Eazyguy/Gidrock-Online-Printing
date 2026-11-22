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
  const selectedSizePrice =
    size && config?.size ? Number(size[config.size]) || 0 : 0;
  const finishingRates = settings?.finishing;
  const areaPricePerDesign =
    Number(config?.heightFt ?? 0) *
    Number(config?.widthFt ?? 0) *
    Number(settings?.pricePerSqFt ?? 0);
  const designs = config?.designs ?? [];
  const prices = designs.reduce<PriceBreakdown>(
    (total, design) => {
      const basePrice =
        settings?.type === "measurement"
          ? areaPricePerDesign
          : selectedSizePrice || Number(settings?.basePrice ?? 0);
      let finishingPrice = 0;

      if (design.lamination && Array.isArray(finishingRates)) {
        finishingPrice =
          Number(settings?.finishingPrices?.[design.lamination]) || 0;
      } else if (
        design.lamination &&
        config?.size &&
        finishingRates &&
        !Array.isArray(finishingRates)
      ) {
        finishingPrice =
          Number(finishingRates[design.lamination]?.[config.size]) || 0;
      }

      return {
        size: total.size + (settings?.type === "measurement" ? 0 : basePrice),
        lamination: total.lamination + finishingPrice,
        banner:
          total.banner +
          (settings?.type === "measurement" ? areaPricePerDesign : 0),
      };
    },
    { size: 0, lamination: 0, banner: 0 },
  );

  return {
    prices,
    totalPrice:
      (prices.size + prices.lamination + prices.banner) *
      Number(config?.qty ?? 1),
  };
};
