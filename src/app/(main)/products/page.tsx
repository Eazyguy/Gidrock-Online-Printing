"use client";

import { services } from "@/constants";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import Configuration from "@/app/(main)/products/components/Configuration";
import { defaultConfig } from "@/app/(main)/products/configuration/defaultConfig";
import type {
  Config,
  ProductConfiguration,
} from "@/app/(main)/products/configuration/types";
import { supabase } from "@/supabase-client";
import { formatCurrency } from "./configuration/formatCurrency";

const normalizeProductKey = (key: string) =>
  key.trim().toLocaleLowerCase().replace(/\s+/g, " ");

const Products = () => {
  const [visibility, setVisibility] = useState(false);
  const [settings, setSettings] = useState<ProductConfiguration | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [productSettings, setProductSettings] = useState<
    Record<string, ProductConfiguration>
  >({});
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settingsError, setSettingsError] = useState("");

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("product_pricing")
          .select("product_key, settings");

        if (!active) return;
        if (error) {
          setSettingsError(`Could not load product prices: ${error.message}`);
          return;
        }

        setProductSettings(
          Object.fromEntries(
            data.map((row) => [normalizeProductKey(row.product_key), row.settings]),
          ),
        );
      } catch (error) {
        if (active) {
          const reason = error instanceof Error ? error.message : String(error);
          setSettingsError(`Could not load product prices: ${reason}`);
        }
      } finally {
        if (active) setLoadingSettings(false);
      }
    };

    void loadSettings();
    return () => {
      active = false;
    };
  }, []);

  const handleConfigure = (productName: string) => {
    const productSetting = productSettings[normalizeProductKey(productName)];
    if (!productSetting) {
      setSettingsError(
        `Pricing is not configured for ${productName}. Please refresh the page and try again. If the issue continues, ask an administrator to check product settings.`,
      );
      return;
    }

    setSettingsError("");
    setSelectedProduct(productName);
    setSettings(productSetting);
    setConfig(defaultConfig());
    setVisibility(true);
  };

  const getStartingPrice = (productSetting?: ProductConfiguration) => {
    if (!productSetting) return "Price unavailable";
    if (productSetting.type === "measurement") {
      return `${formatCurrency(Number(productSetting.pricePerSqFt ?? 0))} / sq ft`;
    }
    if (typeof productSetting.basePrice === "number") {
      return formatCurrency(productSetting.basePrice);
    }

    const prices = Object.values(productSetting.thickness ?? {}).flatMap(
      (rates) =>
        Object.values(rates)
          .map(Number)
          .filter((price) => Number.isFinite(price) && price > 0),
    );
    return prices.length
      ? formatCurrency(Math.min(...prices))
      : "Price on request";
  };

  return (
    <div className="background">
      <div className="my-20" />

      <Configuration
        visibility={visibility}
        setVisibility={setVisibility}
        selectedProduct={selectedProduct}
        settings={settings}
        config={config}
        setConfig={setConfig}
      />

      <h2 className="text-black text-4xl">Select Products</h2>

      <p className="text-gray-800">
        Choose how you want your design to be printed
      </p>
      {settingsError && (
        <p className="mt-3 text-center text-sm text-red-700" role="alert">
          {settingsError}
        </p>
      )}
      {loadingSettings && (
        <p className="mt-3 text-center text-sm text-gray-700" role="status">
          Loading product prices…
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-4">
        {services.map((item) => (
          <div
            key={item.title}
            data-id={item.title}
            className={`border border-green-200 rounded-lg bg-green-400 p-2 ${loadingSettings ? "cursor-wait" : "cursor-pointer"}`}
            onClick={() => !loadingSettings && handleConfigure(item.title)}
          >
            <div className="relative w-full h-30">
              <Image
                src={item.image}
                fill
                alt={item.title}
                className="object-cover rounded"
              />
            </div>

            <p className="text-lg text-black text-center font-bold">
              {item.title}
            </p>

            <p className="text-sm text-gray-800 text-center">
              {item.description}
            </p>

            <p className="text-sm text-center text-gray-900 font-bold mt-2">
              Starting from
              <br />
              <span className="bg-green-100 rounded-full p-1 mt-2 text-green-900 font-bold">
                {getStartingPrice(
                  productSettings[normalizeProductKey(item.title)],
                )}
              </span>
            </p>

            <p className="text-center mt-2 underline text-green-900">
              Click to select and configure
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
