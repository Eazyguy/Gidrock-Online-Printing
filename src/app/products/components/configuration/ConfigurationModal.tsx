"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "../../configuration/formatCurrency"
import { calculateConfigurationPrice } from "../../configuration/calculatePrice"
import { defaultConfig } from "../../configuration/defaultConfig"
import type { ConfigurationModalProps } from "../../configuration/types"
import { useCart } from "@/components/CartContext"
import ConfigurationFields from "./ConfigurationFields"

const ConfigurationModal = ({
  visibility,
  settings,
  setVisibility,
  selectedProduct,
  config,
  setConfig,
}: ConfigurationModalProps) => {
  const { addItem } = useCart()
  const [size, setSize] = useState<Record<string, number | string | null> | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!config?.file) {
      setPreview(null)
      return
    }

    const previewUrl = URL.createObjectURL(config.file)
    setPreview(previewUrl)
    return () => URL.revokeObjectURL(previewUrl)
  }, [config?.file])

  const { totalPrice } = calculateConfigurationPrice(config, settings, size)

  const handleThickness = (event: React.ChangeEvent<HTMLInputElement>) => {
    const thickness = event.target.value
    if (!settings?.thickness) return

    if (config?.thickness === thickness) {
      setConfig((previous) => ({
        ...(previous ?? defaultConfig()),
        thickness: null,
        size: null,
      }))
      setSize(null)
      return
    }

    setConfig((previous) => ({
      ...(previous ?? defaultConfig()),
      thickness,
      size: null,
    }))
    setSize(settings.thickness[thickness] ?? null)
  }

  const handleSize = (selectedSize: string) => {
    setConfig((previous) => ({
      ...(previous ?? defaultConfig()),
      size: selectedSize,
    }))
  }

  const handleFinishing = (finishing: string) => {
    setConfig((previous) => ({
      ...(previous ?? defaultConfig()),
      lamination: previous?.lamination === finishing ? null : finishing,
    }))
  }

  const handleQuantity = (quantity: number) => {
    setConfig((previous) => ({
      ...(previous ?? defaultConfig()),
      qty: Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1,
    }))
  }

  const handleFileChange = (file: File) => {
    setConfig((previous) => ({
      ...(previous ?? defaultConfig()),
      file,
      fileName: file.name,
    }))
  }

  if (!visibility) return null

  return (
    <form
      className="bg-green-200 p-3 border border-green-800 border-2 rounded-lg fixed z-45 bottom-0 w-[90%] md:w-[500px] right-1 mx-5 max-h-[90vh] overflow-y-auto"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex justify-between items-center">
        <p className="text-black text-2xl">Configure product</p>
        <button
          type="button"
          onClick={() => {
            setVisibility(false)
            setSize(null)
          }}
          className="text-black text-2xl font-bold"
          aria-label="Close configuration"
        >
          ×
        </button>
      </div>

      {selectedProduct && (
        <p className="text-black font-bold mt-2">Product: {selectedProduct}</p>
      )}

      <ConfigurationFields
        settings={settings}
        config={config}
        setConfig={setConfig}
        size={size}
        preview={preview}
        onThicknessChange={handleThickness}
        onSizeChange={handleSize}
        onFinishingChange={handleFinishing}
        onQuantityChange={handleQuantity}
        onFileChange={handleFileChange}
      />

      <p className="text-2xl text-black mt-5">Summary</p>
      <div className="bg-green-100 rounded p-3 mt-2 text-black">
        <p><strong>Product:</strong> {selectedProduct ?? "Not selected"}</p>
        <p><strong>Thickness:</strong> {config?.thickness ?? "Not selected"}</p>
        <p><strong>Size:</strong> {config?.size ?? "Not selected"}</p>
        <p><strong>Finishing:</strong> {config?.lamination ?? "Not selected"}</p>
        <p><strong>Quantity:</strong> {config?.qty ?? 1}</p>
        <p><strong>File:</strong> {config?.fileName || "No file"}</p>
      </div>

      <p className="text-black text-center text-xl mt-3">Amount:</p>
      <p className="text-black text-center text-3xl">{formatCurrency(totalPrice)}</p>

      <div className="w-full flex justify-center mt-4">
        <button
          type="button"
          className="bg-green-800 text-white rounded px-3 py-2"
          onClick={() =>
            addItem(
              { product: selectedProduct, config, price: totalPrice },
              config?.file ?? undefined
            )
          }
        >
          Add to Cart
        </button>
      </div>
    </form>
  )
}

export default ConfigurationModal