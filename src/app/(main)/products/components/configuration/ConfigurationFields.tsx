import { useEffect, useState } from "react";
import { defaultConfig } from "../../configuration/defaultConfig";
import type { Config, ProductConfiguration } from "../../configuration/types";
import DesignUploader from "../DesignUploader";

type ConfigurationFieldsProps = {
  settings: ProductConfiguration | null;
  config: Config | null;
  setConfig: React.Dispatch<React.SetStateAction<Config | null>>;
  size: Record<string, number | string | null> | null;
  onThicknessChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSizeChange: (item: string) => void;
  onQuantityChange: (quantity: number) => void;
  selectedProduct: string | null;
};

const QuantityInput = ({
  quantity,
  onQuantityChange,
}: {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}) => {
  const [value, setValue] = useState(String(quantity));

  useEffect(() => {
    setValue(String(quantity));
  }, [quantity]);

  return (
    <input
      type="text"
      inputMode="numeric"
      name="quantity"
      aria-label="Quantity"
      className="mt-2 ms-2 rounded border-green-800 border-2 focus:ring-green-500 focus:ring-2 focus:outline-none w-20 p-1 text-center"
      value={value}
      onChange={(event) => {
        const nextValue = event.target.value.replace(/\D/g, "");
        setValue(nextValue);
        const nextQuantity = Number(nextValue);
        if (Number.isSafeInteger(nextQuantity) && nextQuantity > 0) {
          onQuantityChange(nextQuantity);
        }
      }}
      onBlur={() => {
        const nextQuantity = Number(value);
        const normalizedQuantity =
          Number.isSafeInteger(nextQuantity) && nextQuantity > 0
            ? nextQuantity
            : 1;
        setValue(String(normalizedQuantity));
        onQuantityChange(normalizedQuantity);
      }}
    />
  );
};

const ConfigurationFields = ({
  settings,
  config,
  setConfig,
  size,
  onThicknessChange,
  onSizeChange,
  onQuantityChange,
  selectedProduct,
}: ConfigurationFieldsProps) => {
  const sizeOptions = size ? Object.keys(size) : (settings?.size ?? []);
  const finishingOptions = Array.isArray(settings?.finishing)
    ? settings.finishing
    : settings?.finishing
      ? Object.keys(settings.finishing)
      : [];

  return (
    <>
      {settings?.thickness && (
        <>
          <label className="text-black font-bold block mt-4">
            Choose thickness
          </label>
          <div className="text-black flex flex-wrap gap-2 mt-2">
            {Object.keys(settings.thickness).map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="thickness"
                  value={item}
                  checked={config?.thickness === item}
                  onChange={onThicknessChange}
                  className="sr-only peer"
                />
                <div className="p-3 rounded-full bg-green-800 text-white peer-checked:bg-green-600 peer-checked:border-white peer-checked:border-2">
                  {item}
                </div>
              </label>
            ))}
          </div>
        </>
      )}

      {config?.thickness !== "Custom" && sizeOptions.length > 0 && (
        <>
          <p className="text-black font-bold mt-4">Choose paper size</p>
          <div className="text-black flex flex-wrap gap-2 mt-2">
            {sizeOptions.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => onSizeChange(item)}
                className={`p-2 rounded-full ${
                  config?.size === item
                    ? "bg-green-900 border-2 border-white"
                    : "bg-green-700"
                } text-white`}
              >
                {item}
              </button>
            ))}
          </div>
        </>
      )}

      {(settings?.type === "measurement" || config?.size === "custom") && (
        <div className="flex flex-col mt-5">
          <p className="text-black font-bold">
            Enter the width and height in{" "}
            {settings?.type === "measurement" ? "feet (ft)" : "cm"}
          </p>
          <div className="flex gap-3 text-black items-center">
            <label className="text-black font-bold">
              Width:
              <input
                type="number"
                name="width"
                className="border mt-4 outline-none transition-all p-1 ms-2 rounded border-green-800 border-2 focus:ring-green-500 focus:ring-2 focus:outline-none w-20 text-center"
                min={1}
                value={config?.widthFt || ""}
                onChange={(event) =>
                  setConfig((previous) => ({
                    ...(previous ?? defaultConfig()),
                    widthFt: Number(event.target.value),
                  }))
                }
              />
            </label>
            <span className="text-center mt-4">X</span>
            <label className="text-black font-bold">
              Height:
              <input
                type="number"
                name="height"
                className="border mt-4 outline-none transition-all p-1 ms-2 rounded border-green-800 border-2 focus:ring-green-500 focus:ring-2 focus:outline-none w-20 text-center"
                min={1}
                value={config?.heightFt || ""}
                onChange={(event) =>
                  setConfig((previous) => ({
                    ...(previous ?? defaultConfig()),
                    heightFt: Number(event.target.value),
                  }))
                }
              />
            </label>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <label className="text-black font-bold flex flex-col items-center">
          Quantity:
          <QuantityInput
            quantity={config?.qty ?? 1}
            onQuantityChange={onQuantityChange}
          />
        </label>
      </div>
      <DesignUploader
        product={selectedProduct}
        selectedSizes={config?.size}
        widthFt={config?.widthFt}
        heightFt={config?.heightFt}
        files={config?.designs ?? []}
        sides={
          selectedProduct?.toLowerCase() === "shirt printing"
            ? ["front", "back", "side"]
            : ["card", "fliers and posters", "brochures"].some((product) =>
                  selectedProduct?.toLowerCase().startsWith(product),
                )
              ? ["front", "back"]
              : ["front"]
        }
        finishingOptions={finishingOptions}
        onFilesChange={(designs) => {
          const file = designs[0]?.file ?? null;
          setConfig((prev) => ({
            ...(prev ?? defaultConfig()),
            file,
            fileName: file?.name ?? "",
            designs,
          }));
        }}
      />

      <label
        htmlFor="note"
        className="text-black font-bold text-center mt-8 block"
      >
        Any other information
      </label>
      <textarea
        name="note"
        id="note"
        value={config?.extraNote ?? ""}
        onChange={(event) =>
          setConfig((previous) => ({
            ...(previous ?? defaultConfig()),
            extraNote: event.target.value,
          }))
        }
        className="w-full h-[120px] rounded-xl border border-zinc-500 border-2 bg-green-100 mt-2 mx-auto px-3.5 py-3 text-[14px] leading-6 shadow-sm focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 focus:outline-none field-sizing-content text-black"
      />
    </>
  );
};

export default ConfigurationFields;
