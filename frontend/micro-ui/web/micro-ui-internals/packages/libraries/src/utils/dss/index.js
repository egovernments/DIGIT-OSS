import { addMonths, endOfYear, format, startOfYear, subYears } from "date-fns";

const amountFormatter = (value, denomination) => {
  const currencyFormatter = new Intl.NumberFormat("en-IN", { currency: "INR" });
  switch (denomination) {
    case "Lac":
      return `₹ ${currencyFormatter.format((value / 100000).toFixed(2) || 0)} Lac`;
    case "Cr":
      return `₹ ${currencyFormatter.format((value / 10000000).toFixed(2) || 0)} Cr`;
    case "Unit":
      return `₹ ${currencyFormatter.format(value?.toFixed(2) || 0)}`;
    default:
      return "";
  }
};

export const formatter = (value, symbol, unit, commaSeparated = false) => {
  if (!value && value !== 0) return "";
  switch (symbol) {
    case "amount":
      return amountFormatter(value, unit);
    //this case needs to be removed as backend should handle case sensitiviy from their end
    case "Amount":
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
    default:
      return "";
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

export const getInitialRange = () => {
  const startDate = addMonths(startOfYear(new Date()), 3);
  const endDate = addMonths(endOfYear(new Date()), 3);
  const title = `${format(startDate, "MMM d, yy")} - ${format(endDate, "MMM d, yy")}`;
  const duration = Digit.Utils.dss.getDuration(startDate, endDate);
  return { startDate, endDate, title, duration };
};

export const getDefaultFinacialYear = () => {
  const currDate = new Date().getMonth();
  if (currDate < 3) {
    return {
      startDate: subYears(addMonths(startOfYear(new Date()), 3), 1),
      endDate: subYears(addMonths(endOfYear(new Date()), 3), 1),
    };
  } else {
    return {
      startDate: addMonths(startOfYear(new Date()), 3),
      endDate: addMonths(endOfYear(new Date()), 3),
    };
  }
};
