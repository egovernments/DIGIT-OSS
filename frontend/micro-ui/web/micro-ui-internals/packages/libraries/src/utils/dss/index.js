import { addMonths, endOfYear, format, startOfYear, subYears,subSeconds,endOfToday, addDays, startOfDay, endOfDay, differenceInDays } from "date-fns";
import { getFilterValue, getParsedRequest } from "./dynamicRequestGenerator";

const amountFormatter = (value, denomination, t) => {
  const currencyFormatter = new Intl.NumberFormat("en-IN", { currency: "INR" });

  switch (denomination) {
    case "Lac":
      return `₹ ${currencyFormatter.format((value / 100000).toFixed(2) || 0)} ${t("ES_DSS_LAC")}`;
    case "Cr":
      return `₹ ${currencyFormatter.format((value / 10000000).toFixed(2) || 0)} ${t("ES_DSS_CR")}`;
    case "Unit":
      return `₹ ${currencyFormatter.format(value?.toFixed(2) || 0)}`;
    default:
      return "";
  }
};

export const formatter = (value, symbol, unit, commaSeparated = true, t) => {
  if (!value && value !== 0) return "";
  switch (symbol) {
    case "amount":
      return amountFormatter(value, unit, t);
    //this case needs to be removed as backend should handle case sensitiviy from their end
    case "Amount":
      return amountFormatter(value, unit, t);
    case "number":
      if (!commaSeparated) {
        return parseInt(value);
      }
      const Nformatter = new Intl.NumberFormat("en-IN");
      return Nformatter.format(value);
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

export const getDatesBackFromToday = (numberOfDays) => {
  const endDate = endOfDay(new Date());
  const startDate = startOfDay(addDays(new Date(), - (numberOfDays-1)));
  const title = `${format(startDate, "MMM d, yy")} - ${format(endDate, "MMM d, yy")}`;
  const duration = Digit.Utils.dss.getDuration(startDate, endDate);
  return { startDate, endDate, title, duration };
};

export const getDateDiffrenence = (startDate, endDate) => {
  return differenceInDays(startDate, endDate);
}

export const getDefaultFinacialYear = () => {
  const currDate = new Date().getMonth();
  if (currDate < 3) {
    return {
      startDate: subYears(addMonths(startOfYear(new Date()), 3), 1),
      endDate: endOfToday(new Date()),
        //    endDate: subYears(addMonths(endOfYear(new Date()), 3), 1), RAIN-5752 : to keep date till current date and not a financial year

    };
  } else {
    return {
      startDate: addMonths(startOfYear(new Date()), 3),
      endDate: endOfToday(new Date()),
//            endDate: addMonths(endOfYear(new Date()), 3),

    };
  }
};

/* Used in DSS to get the current module id */
export const getCurrentModuleName=()=>{
 const allPaths= window.location.pathname.split('/');
 return allPaths[allPaths.length-1];
}

/* Used in DSS to get the filtered ulbs for selected city */
export const checkSelected = (e, selectedDDRs) => {
  if (!selectedDDRs || selectedDDRs?.length == 0) {
    return true;
  } else if (selectedDDRs.find((ddr) => ddr.ddrKey == e.ddrKey)) {
    return true;
  } else {
    return false;
  }
};


/* Used in DSS to get the filtered ulbs for selected city for global filter*/
export const getCitiesAvailable = (e, selectedDDRs) => {
  if (!selectedDDRs || selectedDDRs?.length == 0) {
    return true;
  } else if (selectedDDRs.find((ddr) => ddr == e.ddrKey)) {
    return true;
  } else {
    return false;
  }
};

export const getCustomFiltersDynamicValues = async (filterConfig, dynamicValues) => {
  if (filterConfig && dynamicValues) {
    filterConfig = filterConfig.map((filter) => {
      if (filter?.source?.type == 'request') {
        filter.source = getParsedRequest(filter.source, dynamicValues);
      }
      return filter;
    })
  }
  return filterConfig;
}

export const getFilterOptionsForConfig = async (filterConfig) => {
  let filtersData = {};
  if (filterConfig) {
    let requests = [];
    filterConfig.forEach((filter) => {
      if (filter?.source) {
        requests.push(getFilterValue(filter))
      }
    })
    await Promise.all(requests).then((res) => {
      if (res && res.length) {
        res.forEach((filterRes) => {
          if (filterRes?.id && filterRes?.values)
            filtersData[filterRes.id] = filterRes?.values;
        })
      }
    });
  }
  return filtersData;
}