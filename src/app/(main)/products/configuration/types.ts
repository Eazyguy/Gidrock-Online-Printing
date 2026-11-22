export type Config = {
  thickness: string | null;
  size: string | null;
  lamination: string | null;
  widthFt: number;
  heightFt: number;
  shirtType: string | null;
  qty: number;
  file: File | null;
  fileName: string;
  designs?: ProductDesign[];
  extraNote: string;
  customNote: string;
};

export type ProductDesign = {
  id: string;
  file: File | null;
  fileName: string;
  side: string;
  lamination: string | null;
  file_path?: string | null;
};

export type ProductConfiguration = {
  thickness?: Record<string, Record<string, number | string | null>>;
  finishing?: string[] | Record<string, Record<string, number | string | null>>;
  finishingPrices?: Record<string, number | string | null>;
  pricePerSqFt?: number;
  basePrice?: number;
  size?: string[];
  [key: string]: unknown;
};

export type ConfigurationModalProps = {
  visibility: boolean;
  settings: ProductConfiguration | null;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: string | null;
  config: Config | null;
  setConfig: React.Dispatch<React.SetStateAction<Config | null>>;
};
