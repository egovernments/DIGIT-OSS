/* method to get date from epoch */
export const convertEpochToDate = (dateEpoch) => {
    // Returning NA in else case because new Date(null) returns Current date from calender
    if (dateEpoch) {
        const dateFromApi = new Date(dateEpoch);
        let month = dateFromApi.getMonth() + 1;
        let day = dateFromApi.getDate();
        let year = dateFromApi.getFullYear();
        month = (month > 9 ? "" : "0") + month;
        day = (day > 9 ? "" : "0") + day;
        return `${day}/${month}/${year}`;
    } else {
        return 'NA';
    }
};
export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
        str = str.replace(searcher, replaceWith);
    }
    return str;
};

/*   method to check not null  if not returns false*/
export const checkForNotNull = (value = "") => {
    return value && value != null && value != undefined && value != "" ? true : false;
};

export const convertDotValues = (value = "") => {
    return (
        (checkForNotNull(value) && ((value.replaceAll && value.replaceAll(".", "_")) || (value.replace && stringReplaceAll(value, ".", "_")))) || "NA"
    );
};

export const convertToLocale = (value = "", key = "") => {
    let convertedValue = convertDotValues(value);
    if (convertedValue == "NA") {
        return "PT_NA";
    }
    return `${key}_${convertedValue}`;
};

const RECEIPTS_DEFAULT_SERVICE = "PT";

export const getDefaultReceiptService = () => {
    return RECEIPTS_DEFAULT_SERVICE;
}

export const getFinancialYears = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (toDate.getYear() - fromDate.getYear() != 0) {
      return `FY${fromDate.getYear() + 1900}-${toDate.getYear() - 100}`;
    }
    return `${fromDate.toLocaleDateString()}-${toDate.toLocaleDateString()}`;
  }