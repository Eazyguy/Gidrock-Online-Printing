import Image from "next/image"
import { defaultConfig } from "../../configuration/defaultConfig"
import type { Config, ProductConfiguration } from "../../configuration/types"

type ConfigurationFieldsProps = {
  settings: ProductConfiguration | null
  config: Config | null
  setConfig: React.Dispatch<React.SetStateAction<Config | null>>
  size: Record<string, number | string | null> | null
  preview: string | null
  onThicknessChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSizeChange: (item: string) => void
  onFinishingChange: (item: string) => void
  onQuantityChange: (quantity: number) => void
  onFileChange: (file: File) => void
}

const ConfigurationFields = ({
  settings,
  config,
  setConfig,
  size,
  preview,
  onThicknessChange,
  onSizeChange,
  onFinishingChange,
  onQuantityChange,
  onFileChange,
}: ConfigurationFieldsProps) => (
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

    {config?.thickness !== "Custom" && size && (
      <>
        <p className="text-black font-bold mt-4">Choose paper size</p>
        <div className="text-black flex flex-wrap gap-2 mt-2">
          {Object.keys(size).map((item) => (
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

    {settings?.finishing && config?.size && !Array.isArray(settings.finishing) && (
      <>
        <p className="text-black font-bold mt-4">Choose finishing</p>
        <div className="text-black flex flex-wrap gap-2 mt-2">
          {Object.keys(settings.finishing).map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => onFinishingChange(item)}
              className={`p-2 rounded-full ${
                config?.lamination === item
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
          Enter the width and height in {settings?.type === "measurement" ? "feet (ft)" : "cm"}
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
        <input
          type="number"
          name="quantity"
          className="border mt-2 ms-2 rounded border-green-800 border-2 focus:ring-green-500 focus:ring-2 focus:outline-none w-20 p-1 text-center"
          min={1}
          value={config?.qty ?? 1}
          onChange={(event) => onQuantityChange(Number(event.target.value))}
        />
      </label>
    </div>

    <div className="flex flex-col justify-center w-full">
      <p className="text-black font-bold mt-4 text-center">Upload Design</p>
      <label
        htmlFor="design"
        className="border h-32 w-45 mx-auto border-green-900 rounded flex items-center justify-center cursor-pointer text-black relative"
      >
        {config?.fileName && preview ? (
          <Image src={preview} alt="Uploaded design preview" fill className="object-contain" />
        ) : (
          "Choose file"
        )}
      </label>
      <input
        id="design"
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFileChange(file)
        }}
      />
    </div>

    <label htmlFor="note" className="text-black font-bold text-center mt-8 block">
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
)

export default ConfigurationFields
