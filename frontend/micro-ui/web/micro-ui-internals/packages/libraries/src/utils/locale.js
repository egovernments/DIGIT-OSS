/**
 * Custom utils related for all locale related items
 *
 * @author jagankumar-egov
 *
 * @example
 *  Digit.Utils.locale. ** ()
 *
 *
 */

export const getLocalityCode = (locality, tenantId) => {
  if (typeof locality === "string") return locality.includes("_") ? locality : `${tenantId.replace(".", "_").toUpperCase()}_ADMIN_${locality}`;
  else if (locality.code) return locality.code.includes("_") ? locality : `${tenantId.replace(".", "_").toUpperCase()}_ADMIN_${locality.code}`;
};

export const getRevenueLocalityCode = (locality, tenantId) => {
  if (typeof locality === "string") return locality.includes("_") ? locality : `${tenantId.replace(".", "_").toUpperCase()}_REVENUE_${locality}`;
  else if (locality.code) return locality.code.includes("_") ? locality : `${tenantId.replace(".", "_").toUpperCase()}_REVENUE_${locality.code}`;
};

export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher === "") return str;
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
  let convertedValue = convertDotValues(value)?.toUpperCase();
  if (convertedValue == "NA") {
    return "COMMON_NA";
  }
  return `${key}_${convertedValue}`;
};

export const getMohallaLocale = (value = "", tenantId = "") => {
  let convertedValue = convertDotValues(tenantId);
  if (convertedValue == "NA" || !checkForNotNull(value)) {
    return "COMMON_NA";
  }
  convertedValue = convertedValue.toUpperCase();
  return convertToLocale(value, `${convertedValue}_REVENUE`);
};

export const getCityLocale = (value = "") => {
  let convertedValue = convertDotValues(value);
  if (convertedValue == "NA" || !checkForNotNull(value)) {
    return "COMMON_NA";
  }
  convertedValue = convertedValue.toUpperCase();
  return convertToLocale(convertedValue, `TENANT_TENANTS`);
};

/* to convert the dropdown data to locale data */
export const convertToLocaleData = (dropdownValues = [], key = "", t) => {
  return dropdownValues.map((ele) => {
    ele["i18text"] = convertToLocale(ele.code, key);
    if (t) {
      ele["i18text"] = t(ele["i18text"]);
    }
    return ele;
  });
};

/**
 * Custom util to format the code for localisation
 *
 * @author jagankumar-egov
 *
 * @example
 *  Digit.Utils.locale.getTransformedLocale(
 *                                          code)
 *
 * @returns {Array} Returns the Array of object
 */
export const getTransformedLocale = (label) => {
  if (typeof label === "number") return label;
  label = label?.trim();
  return label && label.toUpperCase().replace(/[.:-\s\/]/g, "_");
};

/**
 * Custom util to sort the dropdowns based on Alphabeticaly order by localising the codes
 *
 * @author jagankumar-egov
 *
 * @example
 *  Digit.Utils.locale.sortDropdownNames(
 *                                        options,
 *                                        optionKey,
 *                                        t)
 *
 * @returns {Array} Returns the Array of object
 */
export const sortDropdownNames = (options = [], optionkey = "i18nKey", t) => {
  return options?.sort((a, b) => t(a?.[optionkey])?.localeCompare?.(t(b?.[optionkey])));
};
