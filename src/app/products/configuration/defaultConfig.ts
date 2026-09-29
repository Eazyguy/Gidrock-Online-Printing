import type { Config } from "./types"

export const defaultConfig = (): Config => ({
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