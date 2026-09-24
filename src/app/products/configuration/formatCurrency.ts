export const formatCurrency = (value: number | string | null | undefined) => {
if(value == null || value == undefined || value == 0) return "₦0.00";

const num = typeof value === "string"
  ? Number(value.replace(/[^0-9.-]+/g, ""))
  : value;

if (isNaN(num)) return "₦0.00";

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(num);
};