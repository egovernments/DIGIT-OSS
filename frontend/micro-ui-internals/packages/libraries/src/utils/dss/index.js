const amountFormatter = (value, denomination) => {
  const currencyFormatter = new Intl.NumberFormat("en-IN", { currency: "INR" });
  switch (denomination) {
    case "Lac":
      return `₹ ${currencyFormatter.format((value / 100000).toFixed(2) || 0)} Lac`;
    case "Cr":
      return `₹ ${currencyFormatter.format((value / 10000000).toFixed(2) || 0)} Cr`;
    case "Unit":
      return `₹ ${currencyFormatter.format(value.toFixed(2) || 0)}`;
  }
};

export const formatter = (value, symbol, unit, commaSeparated = false) => {
  switch (symbol) {
    case "amount":
      return amountFormatter(value, unit);
    case "number":
      if (!commaSeparated) {
        return parseInt(value);
      }
      const Nformatter = new Intl.NumberFormat("en-IN");
      return Nformatter.format(Math.round(value));
    case "percentage":
      const Pformatter = new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 });
      return `${Pformatter.format(value.toFixed(2))} %`;
  }
};

export const getDuration = (startDate, endDate) => {
  let noOfDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
  if (noOfDays > 91) {
    return "month";
  }
  if (noOfDays < 90 && noOfDays >= 14) {
    return "week";
  }
  if (noOfDays <= 14) {
    return "day";
  }
};
