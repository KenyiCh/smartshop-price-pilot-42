
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

export const formatPriceWithCurrency = (price: number): string => {
  return `S/ ${formatPrice(price)}`;
};
