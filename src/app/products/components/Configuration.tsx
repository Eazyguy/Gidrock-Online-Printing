
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Numans } from "next/font/google"
import { formatCurrency } from "../configuration/formatCurrency"

export type Config = {
  thickness: string | null
  size: string | null
  lamination: string | null

  widthFt: number
  heightFt: number

  shirtType: string | null

  qty: number

  file: File | null
  fileName: string

  extraNote: string
  customNote: string
}

export type ProductConfiguration = {
  thickness?: Record<
    string,
    Record<string, number | string | null>
  >
  finishing?:
    | string[]
    | Record<string, Record<string, number | string | null>>
  pricePerSqFt?: number
  [key: string]: unknown
}

type ModalProp = {
  visibility: boolean

  settings: ProductConfiguration | null

  setVisibility: React.Dispatch<
    React.SetStateAction<boolean>
  >

  selectedProduct: string | null

  config: Config | null

  setConfig: React.Dispatch<
    React.SetStateAction<Config | null>
  >
}

const defaultConfig = (): Config => ({
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
})

const Configuration = ({
  visibility,
  settings,
  setVisibility,
  selectedProduct,
  config,
  setConfig,
}: ModalProp) => {
  const [size, setSize] =
    useState<Record<string, number | string | null> | null>(
      null
    )
  const [file, setFile] = useState<File|null>(null) 
  const [preview, setPreview] = useState<string | null>(null)
  const [prices, setPrices] = useState<Record<string, number>>({
    size:0,
    lamination: 0,
    banner: 0
  })
  const [totalPrice, setTotalPrice] = useState(0)

  const handleThickness = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const thickness = event.target.value

    if (!settings?.thickness) {
      return
    }

    const nextSize = settings.thickness[thickness]
    

    console.log(nextSize)

    /*
      Toggle thickness:

      If the same thickness is clicked again,
      remove the selection.

      Otherwise select the new thickness.
    */
    if (config?.thickness === thickness) {
      setConfig((prev) => ({
        ...(prev ?? defaultConfig()),
        thickness: null,
        size: null,
      }))

      setSize(null)
      setPrices(prev=> ({
        ...prev,
        size: 0
      }))
      return
    }

    setConfig((prev) => ({
      ...(prev ?? defaultConfig()),
      thickness,
      size: null,
    }))

    setSize(nextSize ?? null)

  }

  const handleSize = (item: string) => {
    setConfig((prev) => ({
      ...(prev ?? defaultConfig()),
      size: item,
    }))

  }

  const handleFinishing = (item: string) => {
    setConfig((prev) => ({
      ...(prev ?? defaultConfig()),
      lamination:
        prev?.lamination === item ? null : item,
    }))
  }

 const handleQuantity = (item: number) => {
    setConfig((prev) => ({
      ...(prev ?? defaultConfig()),
      qty:
        prev?.qty === item ? 1 : item,
    }))
  }

  useEffect(() => {
    const sizePrice =
      size && config?.size ? Number(size[config.size]) || 0 : 0
    const finishingRates = settings?.finishing
    const finishingPrice =
      config?.lamination && config.size && finishingRates && !Array.isArray(finishingRates)
        ? Number(finishingRates[config.lamination]?.[config.size]) || 0
        : 0
    const areaPrice =
      Number(config?.heightFt ?? 0) *
      Number(config?.widthFt ?? 0) *
      Number(settings?.pricePerSqFt ?? 0)
    const nextPrices = {
      size: sizePrice,
      lamination: finishingPrice,
      banner: areaPrice,
    }

    setPrices(nextPrices)
    setTotalPrice(
      (nextPrices.size + nextPrices.lamination + nextPrices.banner) *
        Number(config?.qty ?? 1)
    )
  }, [
    config?.size,
    config?.lamination,
    config?.heightFt,
    config?.widthFt,
    config?.qty,
    settings?.finishing,
    settings?.pricePerSqFt,
    size,
  ])

  if (!visibility) {
    return null
  }
  

  return (
    <form
      className="
        bg-green-200
        p-3
        border
        border-green-800
        border-2
        rounded-lg
        fixed
        z-45
        bottom-0
        w-[90%]
        md:w-[500px]
        right-1
        mx-5
        max-h-[90vh]
        overflow-y-auto
      "
      onSubmit={(event) => event.preventDefault()}
    >
      {/* HEADER */}

      <div className="flex justify-between items-center">
        <p className="text-black text-2xl">
          Configure product
        </p>

        <button
          type="button"
          onClick={() => {
            setVisibility(false)
            setSize(null)
            }}
          className="text-black text-2xl font-bold"
        >
          ×
        </button>
      </div>

      {/* SELECTED PRODUCT */}

      {selectedProduct && (
        <p className="text-black font-bold mt-2">
          Product: {selectedProduct}
        </p>
      )}

      {/* THICKNESS */}

      {settings?.thickness && (
        <>
          <label className="text-black font-bold block mt-4">
            Choose thickness
          </label>

          <div className="text-black flex flex-wrap gap-2 mt-2">
            {Object.keys(settings.thickness).map(
              (item) => (
                <label
                  key={item}
                  className="cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="thickness"
                    value={item}
                    checked={config?.thickness === item}
                    onChange={handleThickness}
                    className="sr-only peer"
                  />

                  <div
                    className="
                      p-3
                      rounded-full
                      bg-green-800
                      text-white

                      peer-checked:bg-green-600
                      peer-checked:border-white
                      peer-checked:border-2
                    "
                  >
                    {item}
                  </div>
                </label>
              )
            )}
          </div>
        </>
      )}

      {/* PAPER SIZE */}

      {config?.thickness !== "Custom" &&  size && (
        <>
          <p className="text-black font-bold mt-4">
            Choose paper size
          </p>

          <div className="text-black flex flex-wrap gap-2 mt-2">
            {Object.keys(size).map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => handleSize(item)}
                className={`
                  p-2
                  rounded-full
                  ${
                    config?.size === item
                      ? "bg-green-900 border-2 border-white"
                      : "bg-green-700"
                  }
                  text-white
                `}
              >
                {item}
              </button>
            ))}
          </div>
        </>
      )}

      {/* FINISHING */}

      {settings?.finishing && config?.size && (
          <>
            <p className="text-black font-bold mt-4">
              Choose finishing
            </p>

            <div className="text-black flex flex-wrap gap-2 mt-2">
              {Object.keys(settings.finishing).map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() =>
                    handleFinishing(item)
                  }
                  className={`
                    p-2
                    rounded-full
                    ${
                      config?.lamination === item
                        ? "bg-green-900 border-2 border-white"
                        : "bg-green-700"
                    }
                    text-white
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </>
        )}

        {/**Width and Height for banner,flier and custom*/}
        {settings?.type == "measurement" || config?.size == "custom"? 
          (<div className="flex flex-col mt-5">
          <p className="text-black font-bold">Enter the width and height in {settings?.type == "measurement"?'feet(ft)':'cm'}</p>
          <div className="flex gap-3 text-black items-center">
        <label htmlFor="quantity" className="text-black font-bold"> Width: 
          <input 
          type="number" name="quantity" id="quantit" className="border mt-4 outline-none transition-all p-1 ms-2 rounded border-green-800 border-2 focus:ring-green-500 focus:ring-2 focus:outline-none w-20 text-center" 
          min={1}
          onChange={(e)=>{
            const value = e.target.value
            setConfig((prev) => ({
           ...(prev ?? defaultConfig()),
          widthFt:
        prev?.widthFt === Number(value) ? 0 : Number(value),
    }))
          }}/>
        </label>

        <span className="text-center mt-4">X</span>

        <label htmlFor="quantity" className="text-black font-bold"> Height: 
          <input 
          type="number" name="quantity" id="quantit" className="border mt-4 outline-none transition-all p-1 ms-2 rounded border-green-800 border-2 focus:ring-green-500 focus:ring-2 focus:outline-none w-20 text-center" 
          min={1}
          onChange={(e)=>{
            const value = e.target.value
            setConfig((prev) => ({
           ...(prev ?? defaultConfig()),
          heightFt:
        prev?.heightFt === Number(value) ? 0 : Number(value),
    }))
          }}/>
        </label>
        </div>
        </div>
        ):""}

      {/**Quantity */}
      
        <div className="flex justify-center mt-6">
        <label htmlFor="quantity" className="text-black font-bold flex flex-col items-center"> Quantity:<br/>
          <input 
          type="number" name="quantity" id="quantit" className="border mt-2 outline-none transition-all p-1 ms-2 rounded border-green-800 border-2 focus:ring-green-500 focus:ring-2 focus:outline-none w-20 text-center" 
          min={1}
          onChange={(e)=>{
            const value = e.target.value
            handleQuantity(Number(value))
          }}/>
        </label>
        </div>

      {/* UPLOAD */}

      <div className="flex flex-col justify-center w-full">
        <p className="text-black font-bold mt-4 text-center">
          Upload Design
        </p>

        <label
          htmlFor="design"
          className="
            border
            h-32
            w-45
            mx-auto
            border-green-900
            rounded
            flex
            items-center
            justify-center
            cursor-pointer
            text-black
            relative
          "
        >
          {config?.fileName && preview ? <Image src={preview} alt="" fill/>: "Choose file"}
        </label>

        <input
          id="design"
          type="file"
          className="hidden"
          onChange={(event) => {
            const file =
              event.target.files?.[0] ?? null

            if(!file) return 

            setConfig((prev) => ({
              ...(prev ?? defaultConfig()),
              file,
              fileName: file?.name ?? "",
            })     
            )
            setPreview(URL.createObjectURL(file))
          }
          }
        />
        </div>
        
        {/*Note*/}
        <p className="text-black font-bold text-center mt-8">Any Other information</p>
      <textarea 
      name="note" 
      id="note" 
      value={config?.extraNote}
      onChange={(e)=>setConfig(prev=>({
        ...(prev ?? defaultConfig()),
        extraNote: e.target.value
      }))}
      className="w-full h-[120px] rounded-xl border border-zinc-500 border-2 bg-green-100 mt-2 mx-auto px-3.5 py-3 text-[14px] leading-6 shadow-sm focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10 focus:outline-none field-sizing-content text-black"></textarea>

      {/* SUMMARY */}

      <p className="text-2xl text-black mt-5">
        Summary
      </p>

      <div className="bg-green-100 rounded p-3 mt-2 text-black">
        <p>
          <strong>Product:</strong>{" "}
          {selectedProduct ?? "Not selected"}
        </p>

        <p>
          <strong>Thickness:</strong>{" "}
          {config?.thickness ?? "Not selected"}
        </p>

        <p>
          <strong>Size:</strong>{" "}
          {config?.size ?? "Not selected"}
        </p>

        <p>
          <strong>Finishing:</strong>{" "}
          {config?.lamination ?? "Not selected"}
        </p>

        <p>
          <strong>Quantity:</strong>{" "}
          {config?.qty ?? 1}
        </p>

        <p>
          <strong>File:</strong>{" "}
          {config?.fileName || "No file"}
        </p>
      </div>

      {/** PRICE */}
      <p className="text-black text-center text-xl mt-3">Amount:</p>
      <p className="text-black text-center text-3xl">{formatCurrency(totalPrice)}</p>

      {/* ADD TO CART */}

      <div className="w-full flex justify-center mt-4">
        <button
          type="button"
          className="bg-green-800 text-white rounded px-3 py-2"
          onClick={() => {
            console.log("Adding to cart:", {
              product: selectedProduct,
              config,
            })
          }}
        >
          Add to Cart
        </button>
      </div>
    </form>
  )
}

export default Configuration
