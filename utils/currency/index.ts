import getSymbolFromCurrency from "currency-symbol-map";

export const formatCurrency = ({
  amount,
  currency,
  locale = "en-US",
  decimals,
  roundDownToWhole = false,
}: {
  amount: number;
  currency: string;
  locale?: string;
  decimals?: number;
  roundDownToWhole?: boolean;
}) => {
  const value = roundDownToWhole ? Math.floor(amount) : amount;

  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    minimumFractionDigits: roundDownToWhole ? 0 : decimals ?? 2,
    maximumFractionDigits: roundDownToWhole ? 0 : decimals ?? 2,
  };

  return new Intl.NumberFormat(locale, options).format(value);
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
