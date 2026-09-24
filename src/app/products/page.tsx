"use client"

import { services } from "@/constants"
import Image from "next/image"
import { useState } from "react"
import Configuration, {
  type Config,
  type ProductConfiguration,
} from "@/app/products/components/Configuration"
import { DATA } from "@/app/products/configuration"

const defaultConfig: Config = {
  thickness: null,
  size: null,
  lamination: null,

  widthFt: 0,
  heightFt: 0,

  shirtType: null,

  qty: 1,

  file: null,
  fileName: "",

  extraNote: "",
  customNote: "",
}

const resolveSettings = (
  productName: string
): ProductConfiguration | null => {
  const normalized = productName.trim().toLowerCase()

  switch (normalized) {
    case "card":
      return DATA.card

    case "fliers and posters":
      return DATA.fliers

    case "banners":
      return DATA.Banner

    case "stickers & labels":
      return DATA["Stickers & Labels"]

    case "shirt printing":
      return DATA["Shirt Printing"]

    case "award":
      return DATA.Award

    case "bronchures":
      return DATA.Brochure

    default:
      return null
  }
}

const Products = () => {
  const [visibility, setVisibility] = useState(false)

  const [settings, setSettings] =
    useState<ProductConfiguration | null>(null)

  const [selectedProduct, setSelectedProduct] =
    useState<string | null>(null)

  const [config, setConfig] = useState<Config | null>(null)

  const handleConfigure = (productName: string) => {
    const productSettings = resolveSettings(productName)

    setSelectedProduct(productName)
    setSettings(productSettings)
    setConfig({ ...defaultConfig })
    setVisibility(true)
  }

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

      <h2 className="text-black text-4xl">
        Select Products
      </h2>

      <p className="text-gray-800">
        Choose how you want your design to be printed
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
        {services.map((item) => (
          <div
            key={item.title}
            data-id={item.title}
            className="border border-green-200 rounded-lg bg-green-400 p-2 cursor-pointer"
            onClick={() => handleConfigure(item.title)}
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
                {item.price}
              </span>
            </p>

            <p className="text-center mt-2 underline text-green-900">
              Click to select and configure
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products

