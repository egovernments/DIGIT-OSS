/**
 * Add group separator to value eg. 1000 > 1,000
 */
export const addSeparators = (value, separator = ",") => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

/**
 * Remove prefix, separators and extra decimals from value
 */
export const cleanValue = ({
  value,
  groupSeparator = ",",
  decimalSeparator = ".",
  allowDecimals = true,
  decimalsLimit = 2,
  allowNegativeValue = true,
  disableAbbreviations = false,
  prefix = "",
  transformRawValue = (rawValue) => rawValue,
}) => {
  const transformedValue = transformRawValue(value);

  if (transformedValue === "-") {
    return transformedValue;
  }

  const abbreviations = disableAbbreviations ? [] : ["k", "m", "b"];
  const reg = new RegExp(`((^|\\D)-\\d)|(-${escapeRegExp(prefix)})`);
  const isNegative = reg.test(transformedValue);

  // Is there a digit before the prefix? eg. 1$
  const [prefixWithValue, preValue] = RegExp(`(\\d+)-?${escapeRegExp(prefix)}`).exec(value) || [];
  const withoutPrefix = prefix
    ? prefixWithValue
      ? transformedValue.replace(prefixWithValue, "").concat(preValue)
      : transformedValue.replace(prefix, "")
    : transformedValue;
  const withoutSeparators = removeSeparators(withoutPrefix, groupSeparator);
  const withoutInvalidChars = removeInvalidChars(withoutSeparators, [groupSeparator, decimalSeparator, ...abbreviations]);

  let valueOnly = withoutInvalidChars;

  if (!disableAbbreviations) {
    // disallow letter without number
    if (abbreviations.some((letter) => letter === withoutInvalidChars.toLowerCase())) {
      return "";
    }
    const parsed = parseAbbrValue(withoutInvalidChars, decimalSeparator);
    if (parsed) {
      valueOnly = String(parsed);
    }
  }

  const includeNegative = isNegative && allowNegativeValue ? "-" : "";

  if (decimalSeparator && valueOnly.includes(decimalSeparator)) {
    const [int, decimals] = withoutInvalidChars.split(decimalSeparator);
    const trimmedDecimals = decimalsLimit && decimals ? decimals.slice(0, decimalsLimit) : decimals;
    const includeDecimals = allowDecimals ? `${decimalSeparator}${trimmedDecimals}` : "";

    return `${includeNegative}${int}${includeDecimals}`;
  }

  return `${includeNegative}${valueOnly}`;
};

/**
 * Escape regex char
 *
 * See: https://stackoverflow.com/questions/17885855/use-dynamic-variable-string-as-regex-pattern-in-javascript
 */
export const escapeRegExp = (stringToGoIntoTheRegex) => {
  return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

export const fixedDecimalValue = (value, decimalSeparator, fixedDecimalLength) => {
  if (fixedDecimalLength && value.length > 1) {
    if (value.includes(decimalSeparator)) {
      const [int, decimals] = value.split(decimalSeparator);
      if (decimals.length > fixedDecimalLength) {
        return `${int}${decimalSeparator}${decimals.slice(0, fixedDecimalLength)}`;
      }
    }

    const reg = value.length > fixedDecimalLength ? new RegExp(`(\\d+)(\\d{${fixedDecimalLength}})`) : new RegExp(`(\\d)(\\d+)`);

    const match = value.match(reg);
    if (match) {
      const [, int, decimals] = match;
      return `${int}${decimalSeparator}${decimals}`;
    }
  }

  return value;
};

/**
 * Format value with decimal separator, group separator and prefix
 */
export const formatValue = (options) => {
  const { value: _value, decimalSeparator, intlConfig, decimalScale, prefix = "", suffix = "" } = options;

  if (_value === "" || _value === undefined) {
    return "";
  }

  if (_value === "-") {
    return "-";
  }

  const isNegative = new RegExp(`^\\d?-${prefix ? `${escapeRegExp(prefix)}?` : ""}\\d`).test(_value);

  const value = decimalSeparator !== "." ? replaceDecimalSeparator(_value, decimalSeparator, isNegative) : _value;

  const defaultNumberFormatOptions = {
    minimumFractionDigits: decimalScale || 0,
    maximumFractionDigits: 20,
  };

  const numberFormatter = intlConfig
    ? new Intl.NumberFormat(
        intlConfig.locale,
        intlConfig.currency
          ? {
              ...defaultNumberFormatOptions,
              style: "currency",
              currency: intlConfig.currency,
            }
          : defaultNumberFormatOptions
      )
    : new Intl.NumberFormat(undefined, defaultNumberFormatOptions);

  const parts = numberFormatter.formatToParts(Number(value));

  let formatted = replaceParts(parts, options);

  // Does intl formatting add a suffix?
  const intlSuffix = getSuffix(formatted, { ...options });

  // Include decimal separator if user input ends with decimal separator
  const includeDecimalSeparator = _value.slice(-1) === decimalSeparator ? decimalSeparator : "";

  const [, decimals] = value.match(RegExp("\\d+\\.(\\d+)")) || [];

  // Keep original decimal padding if no decimalScale
  if (decimalScale === undefined && decimals && decimalSeparator) {
    if (formatted.includes(decimalSeparator)) {
      formatted = formatted.replace(RegExp(`(\\d+)(${escapeRegExp(decimalSeparator)})(\\d+)`, "g"), `$1$2${decimals}`);
    } else {
      if (intlSuffix && !suffix) {
        formatted = formatted.replace(intlSuffix, `${decimalSeparator}${decimals}${intlSuffix}`);
      } else {
        formatted = `${formatted}${decimalSeparator}${decimals}`;
      }
    }
  }

  if (suffix && includeDecimalSeparator) {
    return `${formatted}${includeDecimalSeparator}${suffix}`;
  }

  if (intlSuffix && includeDecimalSeparator) {
    return formatted.replace(intlSuffix, `${includeDecimalSeparator}${intlSuffix}`);
  }

  if (intlSuffix && suffix) {
    return formatted.replace(intlSuffix, `${includeDecimalSeparator}${suffix}`);
  }

  return [formatted, includeDecimalSeparator, suffix].join("");
};

/**
 * Before converting to Number, decimal separator has to be .
 */
const replaceDecimalSeparator = (value, decimalSeparator, isNegative) => {
  let newValue = value;
  if (decimalSeparator && decimalSeparator !== ".") {
    newValue = newValue.replace(RegExp(escapeRegExp(decimalSeparator), "g"), ".");
    if (isNegative && decimalSeparator === "-") {
      newValue = `-${newValue.slice(1)}`;
    }
  }
  return newValue;
};

const replaceParts = (parts, { prefix, groupSeparator, decimalSeparator, decimalScale, disableGroupSeparators = false }) => {
  return parts
    .reduce(
      (prev, { type, value }, i) => {
        if (i === 0 && prefix) {
          if (type === "minusSign") {
            return [value, prefix];
          }

          if (type === "currency") {
            return [...prev, prefix];
          }

          return [prefix, value];
        }

        if (type === "currency") {
          return prefix ? prev : [...prev, value];
        }

        if (type === "group") {
          return !disableGroupSeparators ? [...prev, groupSeparator !== undefined ? groupSeparator : value] : prev;
        }

        if (type === "decimal") {
          if (decimalScale !== undefined && decimalScale === 0) {
            return prev;
          }

          return [...prev, decimalSeparator !== undefined ? decimalSeparator : value];
        }

        if (type === "fraction") {
          return [...prev, decimalScale !== undefined ? value.slice(0, decimalScale) : value];
        }

        return [...prev, value];
      },
      [""]
    )
    .join("");
};

const defaultConfig = {
  currencySymbol: "",
  groupSeparator: "",
  decimalSeparator: "",
  prefix: "",
  suffix: "",
};

/**
 * Get locale config from input or default
 */
//tried locale hardcoded
export const getLocaleConfig = (intlConfig) => {
  const { locale, currency } = intlConfig || {};

  const numberFormatter = locale ? new Intl.NumberFormat(locale, currency ? { currency, style: "currency" } : undefined) : new Intl.NumberFormat();

  return numberFormatter.formatToParts(1000.1).reduce((prev, curr, i) => {
    if (curr.type === "currency") {
      if (i === 0) {
        return { ...prev, currencySymbol: curr.value, prefix: curr.value };
      } else {
        return { ...prev, currencySymbol: curr.value, suffix: curr.value };
      }
    }
    if (curr.type === "group") {
      return { ...prev, groupSeparator: curr.value };
    }
    if (curr.type === "decimal") {
      return { ...prev, decimalSeparator: curr.value };
    }

    return prev;
  }, defaultConfig);
};

export const getSuffix = (value, { groupSeparator = ",", decimalSeparator = "." }) => {
  const suffixReg = new RegExp(`\\d([^${escapeRegExp(groupSeparator)}${escapeRegExp(decimalSeparator)}0-9]+)`);
  const suffixMatch = value.match(suffixReg);
  return suffixMatch ? suffixMatch[1] : undefined;
};

export const isNumber = (input) => RegExp(/\d/, "gi").test(input);

export const padTrimValue = (value, decimalSeparator = ".", decimalScale) => {
  if (decimalScale === undefined || value === "" || value === undefined) {
    return value;
  }

  if (!value.match(/\d/g)) {
    return "";
  }

  const [int, decimals] = value.split(decimalSeparator);

  if (decimalScale === 0) {
    return int;
  }

  let newValue = decimals || "";

  if (newValue.length < decimalScale) {
    while (newValue.length < decimalScale) {
      newValue += "0";
    }
  } else {
    newValue = newValue.slice(0, decimalScale);
  }

  return `${int}${decimalSeparator}${newValue}`;
};

/**
 * Abbreviate number eg. 1000 = 1k
 *
 * Source: https://stackoverflow.com/a/9345181
 */
export const abbrValue = (value, decimalSeparator = ".", _decimalPlaces = 10) => {
  if (value > 999) {
    let valueLength = ("" + value).length;
    const p = Math.pow;
    const d = p(10, _decimalPlaces);
    valueLength -= valueLength % 3;

    const abbrValue = Math.round((value * d) / p(10, valueLength)) / d + " kMGTPE"[valueLength / 3];
    return abbrValue.replace(".", decimalSeparator);
  }

  return String(value);
};

const abbrMap = { k: 1000, m: 1000000, b: 1000000000 };

/**
 * Parse a value with abbreviation e.g 1k = 1000
 */
export const parseAbbrValue = (value, decimalSeparator = ".") => {
  const reg = new RegExp(`(\\d+(${escapeRegExp(decimalSeparator)}\\d*)?)([kmb])$`, "i");
  const match = value.match(reg);

  if (match) {
    const [, digits, , abbr] = match;
    const multiplier = abbrMap[abbr.toLowerCase()];

    return Number(digits.replace(decimalSeparator, ".")) * multiplier;
  }

  return undefined;
};

/**
 * Remove invalid characters
 */
export const removeInvalidChars = (value, validChars) => {
  const chars = escapeRegExp(validChars.join(""));
  const reg = new RegExp(`[^\\d${chars}]`, "gi");
  return value.replace(reg, "");
};

/**
 * Remove group separator from value eg. 1,000 > 1000
 */
export const removeSeparators = (value, separator = ",") => {
  const reg = new RegExp(escapeRegExp(separator), "g");
  return value.replace(reg, "");
};

/**
 * Based on the last key stroke and the cursor position, update the value
 * and reposition the cursor to the right place
 */
export const repositionCursor = ({ selectionStart, value, lastKeyStroke, stateValue, groupSeparator }) => {
  let cursorPosition = selectionStart;
  let modifiedValue = value;
  if (stateValue && cursorPosition) {
    const splitValue = value.split("");
    // if cursor is to right of groupSeparator and backspace pressed, delete the character to the left of the separator and reposition the cursor
    if (lastKeyStroke === "Backspace" && stateValue[cursorPosition] === groupSeparator) {
      splitValue.splice(cursorPosition - 1, 1);
      cursorPosition -= 1;
    }
    // if cursor is to left of groupSeparator and delete pressed, delete the character to the right of the separator and reposition the cursor
    if (lastKeyStroke === "Delete" && stateValue[cursorPosition] === groupSeparator) {
      splitValue.splice(cursorPosition, 1);
      cursorPosition += 1;
    }
    modifiedValue = splitValue.join("");
    return { modifiedValue, cursorPosition };
  }

  return { modifiedValue, cursorPosition: selectionStart };
};

export const getIntlConfig = (prefix = "") => {
  const currencyMatch = Object.keys(CURRENCY_MAP).filter((e) => prefix.includes(e));
  if (currencyMatch && currencyMatch?.length > 0) {
    return CURRENCY_MAP[currencyMatch[0]];
  } else {
    CURRENCY_MAP["₹"];
  }
};

const CURRENCY_MAP = {
  "￥": {
    locale: "ja-JP",
    currency: "JPY",
  },
  "₹": {
    locale: "en-IN",
    currency: "INR",
  },
  "£": {
    locale: "en-GB",
    currency: "GBP",
  },
  "€": {
    locale: "de-DE",
    currency: "EUR",
  },
  $: {
    locale: "en-US",
    currency: "USD",
  },
};
