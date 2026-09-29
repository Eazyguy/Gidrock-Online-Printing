import type { Config } from "@/app/products/configuration/types"

export type CartItem = {
  id: string
  product: string | null
  config: Config | null
  price?: number
}