import type { MaterialCategory } from "@/types";

export const MATERIAL_CATEGORY_OPTIONS: {
  value: MaterialCategory;
  label: string;
}[] = [
  { value: "albanileria", label: "Albañilería" },
  { value: "ceramica", label: "Cerámica" },
  { value: "fontaneria", label: "Fontanería" },
  { value: "electricidad", label: "Electricidad" },
  { value: "pintura", label: "Pintura" },
  { value: "carpinteria", label: "Carpintería" },
  { value: "ferreteria", label: "Ferretería" },
  { value: "aislamiento", label: "Aislamiento" },
  { value: "cubiertas", label: "Cubiertas" },
  { value: "yesos", label: "Yesos" },
  { value: "hormigon", label: "Hormigón" },
  { value: "otro", label: "Otro" },
];

export const MATERIAL_CATEGORY_LABELS: Record<MaterialCategory, string> =
  Object.fromEntries(
    MATERIAL_CATEGORY_OPTIONS.map(({ value, label }) => [value, label]),
  ) as Record<MaterialCategory, string>;
