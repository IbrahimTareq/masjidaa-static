import getSymbolFromCurrency from "currency-symbol-map";

export const formatCurrency = ({
  amount,
  currency,
  decimals = 0,
}: {
  amount: number;
  currency: string;
  decimals?: number;
}) => {
  return `${currency.toUpperCase()} ${amount.toFixed(decimals)}`;
};

export const formatCurrencyWithSymbol = ({
  amount,
  currency,
  decimals = 0,
}: {
  amount: number;
  currency: string;
  decimals?: number;
}) => {
  return `${getSymbolFromCurrency(currency) || ""}${amount.toFixed(decimals)}`;
};

export const formatAmountToShortFormat = ({ amount }: { amount: number }) => {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (amount >= 1_000) {
    return (amount / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return amount.toString();
};
