function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactI18next = require('react-i18next');
var digitUiReactComponents = require('@egovernments/digit-ui-react-components');
var reactDateRange = require('react-date-range');
var recharts = require('recharts');
var reactRouterDom = require('react-router-dom');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }

  var number = Number(dirtyNumber);

  if (isNaN(number)) {
    return number;
  }

  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
  }
}

function toDate(argument) {
  requiredArgs(1, arguments);
  var argStr = Object.prototype.toString.call(argument);

  if (argument instanceof Date || typeof argument === 'object' && argStr === '[object Date]') {
    return new Date(argument.getTime());
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument);
  } else {
    if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule");
      console.warn(new Error().stack);
    }

    return new Date(NaN);
  }
}

function addMonths(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);

  if (isNaN(amount)) {
    return new Date(NaN);
  }

  if (!amount) {
    return date;
  }

  var dayOfMonth = date.getDate();
  var endOfDesiredMonth = new Date(date.getTime());
  endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
  var daysInMonth = endOfDesiredMonth.getDate();

  if (dayOfMonth >= daysInMonth) {
    return endOfDesiredMonth;
  } else {
    date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
    return date;
  }
}

function addMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var timestamp = toDate(dirtyDate).getTime();
  var amount = toInteger(dirtyAmount);
  return new Date(timestamp + amount);
}

var MILLISECONDS_IN_HOUR = 3600000;
function addHours(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_HOUR);
}

function startOfWeek(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var locale = options.locale;
  var localeWeekStartsOn = locale && locale.options && locale.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);

  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }

  var date = toDate(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

var MILLISECONDS_IN_MINUTE = 60000;

function getDateMillisecondsPart(date) {
  return date.getTime() % MILLISECONDS_IN_MINUTE;
}

function getTimezoneOffsetInMilliseconds(dirtyDate) {
  var date = new Date(dirtyDate.getTime());
  var baseTimezoneOffset = Math.ceil(date.getTimezoneOffset());
  date.setSeconds(0, 0);
  var hasNegativeUTCOffset = baseTimezoneOffset > 0;
  var millisecondsPartOfTimezoneOffset = hasNegativeUTCOffset ? (MILLISECONDS_IN_MINUTE + getDateMillisecondsPart(date)) % MILLISECONDS_IN_MINUTE : getDateMillisecondsPart(date);
  return baseTimezoneOffset * MILLISECONDS_IN_MINUTE + millisecondsPartOfTimezoneOffset;
}

function startOfDay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setHours(0, 0, 0, 0);
  return date;
}

var MILLISECONDS_IN_DAY = 86400000;
function differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var startOfDayLeft = startOfDay(dirtyDateLeft);
  var startOfDayRight = startOfDay(dirtyDateRight);
  var timestampLeft = startOfDayLeft.getTime() - getTimezoneOffsetInMilliseconds(startOfDayLeft);
  var timestampRight = startOfDayRight.getTime() - getTimezoneOffsetInMilliseconds(startOfDayRight);
  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY);
}

var MILLISECONDS_IN_MINUTE$1 = 60000;
function addMinutes(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_MINUTE$1);
}

function addSeconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, amount * 1000);
}

function addYears(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMonths(dirtyDate, amount * 12);
}

function isValid(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  return !isNaN(date);
}

function startOfQuarter(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var currentMonth = date.getMonth();
  var month = currentMonth - currentMonth % 3;
  date.setMonth(month, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

function startOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var cleanDate = toDate(dirtyDate);
  var date = new Date(0);
  date.setFullYear(cleanDate.getFullYear(), 0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  date.setFullYear(year + 1, 0, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

function endOfDay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setHours(23, 59, 59, 999);
  return date;
}

function endOfWeek(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var locale = options.locale;
  var localeWeekStartsOn = locale && locale.options && locale.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);

  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }

  var date = toDate(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
  date.setDate(date.getDate() + diff);
  date.setHours(23, 59, 59, 999);
  return date;
}

function endOfQuarter(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var currentMonth = date.getMonth();
  var month = currentMonth - currentMonth % 3 + 3;
  date.setMonth(month, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

function endOfToday() {
  return endOfDay(Date.now());
}

function endOfYesterday() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var day = now.getDate();
  var date = new Date(0);
  date.setFullYear(year, month, day - 1);
  date.setHours(23, 59, 59, 999);
  return date;
}

var formatDistanceLocale = {
  lessThanXSeconds: {
    one: 'less than a second',
    other: 'less than {{count}} seconds'
  },
  xSeconds: {
    one: '1 second',
    other: '{{count}} seconds'
  },
  halfAMinute: 'half a minute',
  lessThanXMinutes: {
    one: 'less than a minute',
    other: 'less than {{count}} minutes'
  },
  xMinutes: {
    one: '1 minute',
    other: '{{count}} minutes'
  },
  aboutXHours: {
    one: 'about 1 hour',
    other: 'about {{count}} hours'
  },
  xHours: {
    one: '1 hour',
    other: '{{count}} hours'
  },
  xDays: {
    one: '1 day',
    other: '{{count}} days'
  },
  aboutXWeeks: {
    one: 'about 1 week',
    other: 'about {{count}} weeks'
  },
  xWeeks: {
    one: '1 week',
    other: '{{count}} weeks'
  },
  aboutXMonths: {
    one: 'about 1 month',
    other: 'about {{count}} months'
  },
  xMonths: {
    one: '1 month',
    other: '{{count}} months'
  },
  aboutXYears: {
    one: 'about 1 year',
    other: 'about {{count}} years'
  },
  xYears: {
    one: '1 year',
    other: '{{count}} years'
  },
  overXYears: {
    one: 'over 1 year',
    other: 'over {{count}} years'
  },
  almostXYears: {
    one: 'almost 1 year',
    other: 'almost {{count}} years'
  }
};
function formatDistance(token, count, options) {
  options = options || {};
  var result;

  if (typeof formatDistanceLocale[token] === 'string') {
    result = formatDistanceLocale[token];
  } else if (count === 1) {
    result = formatDistanceLocale[token].one;
  } else {
    result = formatDistanceLocale[token].other.replace('{{count}}', count);
  }

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'in ' + result;
    } else {
      return result + ' ago';
    }
  }

  return result;
}

function buildFormatLongFn(args) {
  return function (dirtyOptions) {
    var options = dirtyOptions || {};
    var width = options.width ? String(options.width) : args.defaultWidth;
    var format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}

var dateFormats = {
  full: 'EEEE, MMMM do, y',
  long: 'MMMM do, y',
  medium: 'MMM d, y',
  short: 'MM/dd/yyyy'
};
var timeFormats = {
  full: 'h:mm:ss a zzzz',
  long: 'h:mm:ss a z',
  medium: 'h:mm:ss a',
  short: 'h:mm a'
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: '{{date}}, {{time}}',
  short: '{{date}}, {{time}}'
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: 'full'
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: 'full'
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: 'full'
  })
};

var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: 'P'
};
function formatRelative(token, _date, _baseDate, _options) {
  return formatRelativeLocale[token];
}

function buildLocalizeFn(args) {
  return function (dirtyIndex, dirtyOptions) {
    var options = dirtyOptions || {};
    var context = options.context ? String(options.context) : 'standalone';
    var valuesArray;

    if (context === 'formatting' && args.formattingValues) {
      var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      var width = options.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      var _defaultWidth = args.defaultWidth;

      var _width = options.width ? String(options.width) : args.defaultWidth;

      valuesArray = args.values[_width] || args.values[_defaultWidth];
    }

    var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
    return valuesArray[index];
  };
}

var eraValues = {
  narrow: ['B', 'A'],
  abbreviated: ['BC', 'AD'],
  wide: ['Before Christ', 'Anno Domini']
};
var quarterValues = {
  narrow: ['1', '2', '3', '4'],
  abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
  wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter']
};
var monthValues = {
  narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};
var dayValues = {
  narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};
var dayPeriodValues = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  }
};

function ordinalNumber(dirtyNumber, _dirtyOptions) {
  var number = Number(dirtyNumber);
  var rem100 = number % 100;

  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + 'st';

      case 2:
        return number + 'nd';

      case 3:
        return number + 'rd';
    }
  }

  return number + 'th';
}

var localize = {
  ordinalNumber: ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: 'wide'
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: 'wide',
    argumentCallback: function argumentCallback(quarter) {
      return Number(quarter) - 1;
    }
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: 'wide'
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: 'wide'
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: 'wide',
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: 'wide'
  })
};

function buildMatchPatternFn(args) {
  return function (dirtyString, dirtyOptions) {
    var string = String(dirtyString);
    var options = dirtyOptions || {};
    var matchResult = string.match(args.matchPattern);

    if (!matchResult) {
      return null;
    }

    var matchedString = matchResult[0];
    var parseResult = string.match(args.parsePattern);

    if (!parseResult) {
      return null;
    }

    var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    return {
      value: value,
      rest: string.slice(matchedString.length)
    };
  };
}

function buildMatchFn(args) {
  return function (dirtyString, dirtyOptions) {
    var string = String(dirtyString);
    var options = dirtyOptions || {};
    var width = options.width;
    var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    var matchResult = string.match(matchPattern);

    if (!matchResult) {
      return null;
    }

    var matchedString = matchResult[0];
    var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    var value;

    if (Object.prototype.toString.call(parsePatterns) === '[object Array]') {
      value = findIndex(parsePatterns, function (pattern) {
        return pattern.test(matchedString);
      });
    } else {
      value = findKey(parsePatterns, function (pattern) {
        return pattern.test(matchedString);
      });
    }

    value = args.valueCallback ? args.valueCallback(value) : value;
    value = options.valueCallback ? options.valueCallback(value) : value;
    return {
      value: value,
      rest: string.slice(matchedString.length)
    };
  };
}

function findKey(object, predicate) {
  for (var key in object) {
    if (object.hasOwnProperty(key) && predicate(object[key])) {
      return key;
    }
  }
}

function findIndex(array, predicate) {
  for (var key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
}

var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: function valueCallback(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseEraPatterns,
    defaultParseWidth: 'any'
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: 'any',
    valueCallback: function valueCallback(index) {
      return index + 1;
    }
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: 'any'
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseDayPatterns,
    defaultParseWidth: 'any'
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: 'any',
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: 'any'
  })
};

var locale = {
  code: 'en-US',
  formatDistance: formatDistance,
  formatLong: formatLong,
  formatRelative: formatRelative,
  localize: localize,
  match: match,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};

function subMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, -amount);
}

function addLeadingZeros(number, targetLength) {
  var sign = number < 0 ? '-' : '';
  var output = Math.abs(number).toString();

  while (output.length < targetLength) {
    output = '0' + output;
  }

  return sign + output;
}

var formatters = {
  y: function y(date, token) {
    var signedYear = date.getUTCFullYear();
    var year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === 'yy' ? year % 100 : year, token.length);
  },
  M: function M(date, token) {
    var month = date.getUTCMonth();
    return token === 'M' ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },
  d: function d(date, token) {
    return addLeadingZeros(date.getUTCDate(), token.length);
  },
  a: function a(date, token) {
    var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? 'pm' : 'am';

    switch (token) {
      case 'a':
      case 'aa':
      case 'aaa':
        return dayPeriodEnumValue.toUpperCase();

      case 'aaaaa':
        return dayPeriodEnumValue[0];

      case 'aaaa':
      default:
        return dayPeriodEnumValue === 'am' ? 'a.m.' : 'p.m.';
    }
  },
  h: function h(date, token) {
    return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
  },
  H: function H(date, token) {
    return addLeadingZeros(date.getUTCHours(), token.length);
  },
  m: function m(date, token) {
    return addLeadingZeros(date.getUTCMinutes(), token.length);
  },
  s: function s(date, token) {
    return addLeadingZeros(date.getUTCSeconds(), token.length);
  },
  S: function S(date, token) {
    var numberOfDigits = token.length;
    var milliseconds = date.getUTCMilliseconds();
    var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
    return addLeadingZeros(fractionalSeconds, token.length);
  }
};

var MILLISECONDS_IN_DAY$1 = 86400000;
function getUTCDayOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var timestamp = date.getTime();
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
  var startOfYearTimestamp = date.getTime();
  var difference = timestamp - startOfYearTimestamp;
  return Math.floor(difference / MILLISECONDS_IN_DAY$1) + 1;
}

function startOfUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var weekStartsOn = 1;
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function getUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var fourthOfJanuaryOfNextYear = new Date(0);
  fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = new Date(0);
  fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);

  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

function startOfUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getUTCISOWeekYear(dirtyDate);
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setUTCFullYear(year, 0, 4);
  fourthOfJanuary.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCISOWeek(fourthOfJanuary);
  return date;
}

var MILLISECONDS_IN_WEEK = 604800000;
function getUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}

function startOfUTCWeek(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var locale = options.locale;
  var localeWeekStartsOn = locale && locale.options && locale.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);

  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }

  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function getUTCWeekYear(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate, dirtyOptions);
  var year = date.getUTCFullYear();
  var options = dirtyOptions || {};
  var locale = options.locale;
  var localeFirstWeekContainsDate = locale && locale.options && locale.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);

  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
  }

  var firstWeekOfNextYear = new Date(0);
  firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, dirtyOptions);
  var firstWeekOfThisYear = new Date(0);
  firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, dirtyOptions);

  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

function startOfUTCWeekYear(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var locale = options.locale;
  var localeFirstWeekContainsDate = locale && locale.options && locale.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
  var year = getUTCWeekYear(dirtyDate, dirtyOptions);
  var firstWeek = new Date(0);
  firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCWeek(firstWeek, dirtyOptions);
  return date;
}

var MILLISECONDS_IN_WEEK$1 = 604800000;
function getUTCWeek(dirtyDate, options) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK$1) + 1;
}

var dayPeriodEnum = {
  am: 'am',
  pm: 'pm',
  midnight: 'midnight',
  noon: 'noon',
  morning: 'morning',
  afternoon: 'afternoon',
  evening: 'evening',
  night: 'night'
};
var formatters$1 = {
  G: function G(date, token, localize) {
    var era = date.getUTCFullYear() > 0 ? 1 : 0;

    switch (token) {
      case 'G':
      case 'GG':
      case 'GGG':
        return localize.era(era, {
          width: 'abbreviated'
        });

      case 'GGGGG':
        return localize.era(era, {
          width: 'narrow'
        });

      case 'GGGG':
      default:
        return localize.era(era, {
          width: 'wide'
        });
    }
  },
  y: function y(date, token, localize) {
    if (token === 'yo') {
      var signedYear = date.getUTCFullYear();
      var year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize.ordinalNumber(year, {
        unit: 'year'
      });
    }

    return formatters.y(date, token);
  },
  Y: function Y(date, token, localize, options) {
    var signedWeekYear = getUTCWeekYear(date, options);
    var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;

    if (token === 'YY') {
      var twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }

    if (token === 'Yo') {
      return localize.ordinalNumber(weekYear, {
        unit: 'year'
      });
    }

    return addLeadingZeros(weekYear, token.length);
  },
  R: function R(date, token) {
    var isoWeekYear = getUTCISOWeekYear(date);
    return addLeadingZeros(isoWeekYear, token.length);
  },
  u: function u(date, token) {
    var year = date.getUTCFullYear();
    return addLeadingZeros(year, token.length);
  },
  Q: function Q(date, token, localize) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);

    switch (token) {
      case 'Q':
        return String(quarter);

      case 'QQ':
        return addLeadingZeros(quarter, 2);

      case 'Qo':
        return localize.ordinalNumber(quarter, {
          unit: 'quarter'
        });

      case 'QQQ':
        return localize.quarter(quarter, {
          width: 'abbreviated',
          context: 'formatting'
        });

      case 'QQQQQ':
        return localize.quarter(quarter, {
          width: 'narrow',
          context: 'formatting'
        });

      case 'QQQQ':
      default:
        return localize.quarter(quarter, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  q: function q(date, token, localize) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);

    switch (token) {
      case 'q':
        return String(quarter);

      case 'qq':
        return addLeadingZeros(quarter, 2);

      case 'qo':
        return localize.ordinalNumber(quarter, {
          unit: 'quarter'
        });

      case 'qqq':
        return localize.quarter(quarter, {
          width: 'abbreviated',
          context: 'standalone'
        });

      case 'qqqqq':
        return localize.quarter(quarter, {
          width: 'narrow',
          context: 'standalone'
        });

      case 'qqqq':
      default:
        return localize.quarter(quarter, {
          width: 'wide',
          context: 'standalone'
        });
    }
  },
  M: function M(date, token, localize) {
    var month = date.getUTCMonth();

    switch (token) {
      case 'M':
      case 'MM':
        return formatters.M(date, token);

      case 'Mo':
        return localize.ordinalNumber(month + 1, {
          unit: 'month'
        });

      case 'MMM':
        return localize.month(month, {
          width: 'abbreviated',
          context: 'formatting'
        });

      case 'MMMMM':
        return localize.month(month, {
          width: 'narrow',
          context: 'formatting'
        });

      case 'MMMM':
      default:
        return localize.month(month, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  L: function L(date, token, localize) {
    var month = date.getUTCMonth();

    switch (token) {
      case 'L':
        return String(month + 1);

      case 'LL':
        return addLeadingZeros(month + 1, 2);

      case 'Lo':
        return localize.ordinalNumber(month + 1, {
          unit: 'month'
        });

      case 'LLL':
        return localize.month(month, {
          width: 'abbreviated',
          context: 'standalone'
        });

      case 'LLLLL':
        return localize.month(month, {
          width: 'narrow',
          context: 'standalone'
        });

      case 'LLLL':
      default:
        return localize.month(month, {
          width: 'wide',
          context: 'standalone'
        });
    }
  },
  w: function w(date, token, localize, options) {
    var week = getUTCWeek(date, options);

    if (token === 'wo') {
      return localize.ordinalNumber(week, {
        unit: 'week'
      });
    }

    return addLeadingZeros(week, token.length);
  },
  I: function I(date, token, localize) {
    var isoWeek = getUTCISOWeek(date);

    if (token === 'Io') {
      return localize.ordinalNumber(isoWeek, {
        unit: 'week'
      });
    }

    return addLeadingZeros(isoWeek, token.length);
  },
  d: function d(date, token, localize) {
    if (token === 'do') {
      return localize.ordinalNumber(date.getUTCDate(), {
        unit: 'date'
      });
    }

    return formatters.d(date, token);
  },
  D: function D(date, token, localize) {
    var dayOfYear = getUTCDayOfYear(date);

    if (token === 'Do') {
      return localize.ordinalNumber(dayOfYear, {
        unit: 'dayOfYear'
      });
    }

    return addLeadingZeros(dayOfYear, token.length);
  },
  E: function E(date, token, localize) {
    var dayOfWeek = date.getUTCDay();

    switch (token) {
      case 'E':
      case 'EE':
      case 'EEE':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        });

      case 'EEEEE':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        });

      case 'EEEEEE':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        });

      case 'EEEE':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  e: function e(date, token, localize, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;

    switch (token) {
      case 'e':
        return String(localDayOfWeek);

      case 'ee':
        return addLeadingZeros(localDayOfWeek, 2);

      case 'eo':
        return localize.ordinalNumber(localDayOfWeek, {
          unit: 'day'
        });

      case 'eee':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        });

      case 'eeeee':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        });

      case 'eeeeee':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        });

      case 'eeee':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  c: function c(date, token, localize, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;

    switch (token) {
      case 'c':
        return String(localDayOfWeek);

      case 'cc':
        return addLeadingZeros(localDayOfWeek, token.length);

      case 'co':
        return localize.ordinalNumber(localDayOfWeek, {
          unit: 'day'
        });

      case 'ccc':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'standalone'
        });

      case 'ccccc':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'standalone'
        });

      case 'cccccc':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'standalone'
        });

      case 'cccc':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'standalone'
        });
    }
  },
  i: function i(date, token, localize) {
    var dayOfWeek = date.getUTCDay();
    var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    switch (token) {
      case 'i':
        return String(isoDayOfWeek);

      case 'ii':
        return addLeadingZeros(isoDayOfWeek, token.length);

      case 'io':
        return localize.ordinalNumber(isoDayOfWeek, {
          unit: 'day'
        });

      case 'iii':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        });

      case 'iiiii':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        });

      case 'iiiiii':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        });

      case 'iiii':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  a: function a(date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';

    switch (token) {
      case 'a':
      case 'aa':
      case 'aaa':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        });

      case 'aaaaa':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        });

      case 'aaaa':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  b: function b(date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;

    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';
    }

    switch (token) {
      case 'b':
      case 'bb':
      case 'bbb':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        });

      case 'bbbbb':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        });

      case 'bbbb':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  B: function B(date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;

    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }

    switch (token) {
      case 'B':
      case 'BB':
      case 'BBB':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        });

      case 'BBBBB':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        });

      case 'BBBB':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  h: function h(date, token, localize) {
    if (token === 'ho') {
      var hours = date.getUTCHours() % 12;
      if (hours === 0) hours = 12;
      return localize.ordinalNumber(hours, {
        unit: 'hour'
      });
    }

    return formatters.h(date, token);
  },
  H: function H(date, token, localize) {
    if (token === 'Ho') {
      return localize.ordinalNumber(date.getUTCHours(), {
        unit: 'hour'
      });
    }

    return formatters.H(date, token);
  },
  K: function K(date, token, localize) {
    var hours = date.getUTCHours() % 12;

    if (token === 'Ko') {
      return localize.ordinalNumber(hours, {
        unit: 'hour'
      });
    }

    return addLeadingZeros(hours, token.length);
  },
  k: function k(date, token, localize) {
    var hours = date.getUTCHours();
    if (hours === 0) hours = 24;

    if (token === 'ko') {
      return localize.ordinalNumber(hours, {
        unit: 'hour'
      });
    }

    return addLeadingZeros(hours, token.length);
  },
  m: function m(date, token, localize) {
    if (token === 'mo') {
      return localize.ordinalNumber(date.getUTCMinutes(), {
        unit: 'minute'
      });
    }

    return formatters.m(date, token);
  },
  s: function s(date, token, localize) {
    if (token === 'so') {
      return localize.ordinalNumber(date.getUTCSeconds(), {
        unit: 'second'
      });
    }

    return formatters.s(date, token);
  },
  S: function S(date, token) {
    return formatters.S(date, token);
  },
  X: function X(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();

    if (timezoneOffset === 0) {
      return 'Z';
    }

    switch (token) {
      case 'X':
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

      case 'XXXX':
      case 'XX':
        return formatTimezone(timezoneOffset);

      case 'XXXXX':
      case 'XXX':
      default:
        return formatTimezone(timezoneOffset, ':');
    }
  },
  x: function x(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();

    switch (token) {
      case 'x':
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

      case 'xxxx':
      case 'xx':
        return formatTimezone(timezoneOffset);

      case 'xxxxx':
      case 'xxx':
      default:
        return formatTimezone(timezoneOffset, ':');
    }
  },
  O: function O(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();

    switch (token) {
      case 'O':
      case 'OO':
      case 'OOO':
        return 'GMT' + formatTimezoneShort(timezoneOffset, ':');

      case 'OOOO':
      default:
        return 'GMT' + formatTimezone(timezoneOffset, ':');
    }
  },
  z: function z(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();

    switch (token) {
      case 'z':
      case 'zz':
      case 'zzz':
        return 'GMT' + formatTimezoneShort(timezoneOffset, ':');

      case 'zzzz':
      default:
        return 'GMT' + formatTimezone(timezoneOffset, ':');
    }
  },
  t: function t(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = Math.floor(originalDate.getTime() / 1000);
    return addLeadingZeros(timestamp, token.length);
  },
  T: function T(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = originalDate.getTime();
    return addLeadingZeros(timestamp, token.length);
  }
};

function formatTimezoneShort(offset, dirtyDelimiter) {
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;

  if (minutes === 0) {
    return sign + String(hours);
  }

  var delimiter = dirtyDelimiter || '';
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}

function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
  if (offset % 60 === 0) {
    var sign = offset > 0 ? '-' : '+';
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }

  return formatTimezone(offset, dirtyDelimiter);
}

function formatTimezone(offset, dirtyDelimiter) {
  var delimiter = dirtyDelimiter || '';
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
  var minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}

function dateLongFormatter(pattern, formatLong) {
  switch (pattern) {
    case 'P':
      return formatLong.date({
        width: 'short'
      });

    case 'PP':
      return formatLong.date({
        width: 'medium'
      });

    case 'PPP':
      return formatLong.date({
        width: 'long'
      });

    case 'PPPP':
    default:
      return formatLong.date({
        width: 'full'
      });
  }
}

function timeLongFormatter(pattern, formatLong) {
  switch (pattern) {
    case 'p':
      return formatLong.time({
        width: 'short'
      });

    case 'pp':
      return formatLong.time({
        width: 'medium'
      });

    case 'ppp':
      return formatLong.time({
        width: 'long'
      });

    case 'pppp':
    default:
      return formatLong.time({
        width: 'full'
      });
  }
}

function dateTimeLongFormatter(pattern, formatLong) {
  var matchResult = pattern.match(/(P+)(p+)?/);
  var datePattern = matchResult[1];
  var timePattern = matchResult[2];

  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong);
  }

  var dateTimeFormat;

  switch (datePattern) {
    case 'P':
      dateTimeFormat = formatLong.dateTime({
        width: 'short'
      });
      break;

    case 'PP':
      dateTimeFormat = formatLong.dateTime({
        width: 'medium'
      });
      break;

    case 'PPP':
      dateTimeFormat = formatLong.dateTime({
        width: 'long'
      });
      break;

    case 'PPPP':
    default:
      dateTimeFormat = formatLong.dateTime({
        width: 'full'
      });
      break;
  }

  return dateTimeFormat.replace('{{date}}', dateLongFormatter(datePattern, formatLong)).replace('{{time}}', timeLongFormatter(timePattern, formatLong));
}

var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};

var protectedDayOfYearTokens = ['D', 'DD'];
var protectedWeekYearTokens = ['YY', 'YYYY'];
function isProtectedDayOfYearToken(token) {
  return protectedDayOfYearTokens.indexOf(token) !== -1;
}
function isProtectedWeekYearToken(token) {
  return protectedWeekYearTokens.indexOf(token) !== -1;
}
function throwProtectedError(token, format, input) {
  if (token === 'YYYY') {
    throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(format, "`) for formatting years to the input `").concat(input, "`; see: https://git.io/fxCyr"));
  } else if (token === 'YY') {
    throw new RangeError("Use `yy` instead of `YY` (in `".concat(format, "`) for formatting years to the input `").concat(input, "`; see: https://git.io/fxCyr"));
  } else if (token === 'D') {
    throw new RangeError("Use `d` instead of `D` (in `".concat(format, "`) for formatting days of the month to the input `").concat(input, "`; see: https://git.io/fxCyr"));
  } else if (token === 'DD') {
    throw new RangeError("Use `dd` instead of `DD` (in `".concat(format, "`) for formatting days of the month to the input `").concat(input, "`; see: https://git.io/fxCyr"));
  }
}

var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
  requiredArgs(2, arguments);
  var formatStr = String(dirtyFormatStr);
  var options = dirtyOptions || {};
  var locale$1 = options.locale || locale;
  var localeFirstWeekContainsDate = locale$1.options && locale$1.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);

  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
  }

  var localeWeekStartsOn = locale$1.options && locale$1.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);

  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }

  if (!locale$1.localize) {
    throw new RangeError('locale must contain localize property');
  }

  if (!locale$1.formatLong) {
    throw new RangeError('locale must contain formatLong property');
  }

  var originalDate = toDate(dirtyDate);

  if (!isValid(originalDate)) {
    throw new RangeError('Invalid time value');
  }

  var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
  var utcDate = subMilliseconds(originalDate, timezoneOffset);
  var formatterOptions = {
    firstWeekContainsDate: firstWeekContainsDate,
    weekStartsOn: weekStartsOn,
    locale: locale$1,
    _originalDate: originalDate
  };
  var result = formatStr.match(longFormattingTokensRegExp).map(function (substring) {
    var firstCharacter = substring[0];

    if (firstCharacter === 'p' || firstCharacter === 'P') {
      var longFormatter = longFormatters[firstCharacter];
      return longFormatter(substring, locale$1.formatLong, formatterOptions);
    }

    return substring;
  }).join('').match(formattingTokensRegExp).map(function (substring) {
    if (substring === "''") {
      return "'";
    }

    var firstCharacter = substring[0];

    if (firstCharacter === "'") {
      return cleanEscapedString(substring);
    }

    var formatter = formatters$1[firstCharacter];

    if (formatter) {
      if (!options.useAdditionalWeekYearTokens && isProtectedWeekYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, dirtyDate);
      }

      if (!options.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, dirtyDate);
      }

      return formatter(utcDate, substring, locale$1.localize, formatterOptions);
    }

    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError('Format string contains an unescaped latin alphabet character `' + firstCharacter + '`');
    }

    return substring;
  }).join('');
  return result;
}

function cleanEscapedString(input) {
  return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
}

function getDaysInMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  var monthIndex = date.getMonth();
  var lastDayOfMonth = new Date(0);
  lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return lastDayOfMonth.getDate();
}

function getTime(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var timestamp = date.getTime();
  return timestamp;
}

function startOfToday() {
  return startOfDay(Date.now());
}

function startOfYesterday() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var day = now.getDate();
  var date = new Date(0);
  date.setFullYear(year, month, day - 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function subYears(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addYears(dirtyDate, -amount);
}

var FilterContext = React__default.createContext({});

var denominations = ["Cr", "Lac", "Unit"];

var Switch = function Switch(_ref) {
  var onSelect = _ref.onSelect,
      t = _ref.t;

  var _useContext = React.useContext(FilterContext),
      value = _useContext.value;

  return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("div", null, t("ES_DSS_DENOMINATION")), /*#__PURE__*/React__default.createElement("div", {
    className: "switch-wrapper"
  }, denominations.map(function (label, idx) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: idx
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "radio",
      id: label,
      className: "radio-switch",
      name: "unit",
      checked: label === (value === null || value === void 0 ? void 0 : value.denomination),
      onClick: function onClick() {
        return onSelect({
          denomination: label
        });
      }
    }), /*#__PURE__*/React__default.createElement("label", {
      className: "cursorPointer",
      htmlFor: label
    }, label));
  })));
};

function isEndDateFocused(focusNumber) {
  return focusNumber === 1;
}

function isStartDateFocused(focusNumber) {
  return focusNumber === 0;
}

var DateRange = function DateRange(_ref) {
  var values = _ref.values,
      onFilterChange = _ref.onFilterChange,
      t = _ref.t;

  var _useState = React.useState(false),
      isModalOpen = _useState[0],
      setIsModalOpen = _useState[1];

  var _useState2 = React.useState([0, 0]),
      focusedRange = _useState2[0],
      setFocusedRange = _useState2[1];

  var _useState3 = React.useState(values),
      selectionRange = _useState3[0],
      setSelectionRange = _useState3[1];

  var wrapperRef = React.useRef(null);
  React.useEffect(function () {
    var handleClickOutside = function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return function () {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  React.useEffect(function () {
    if (!isModalOpen) {
      var startDate = selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.startDate;
      var endDate = selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.endDate;
      var duration = getDuration(selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.startDate, selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.endDate);
      var title = format(selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.startDate, "MMM d, yyyy") + " - " + format(selectionRange === null || selectionRange === void 0 ? void 0 : selectionRange.endDate, "MMM d, yyyy");
      onFilterChange({
        range: {
          startDate: startDate,
          endDate: endDate,
          duration: duration,
          title: title
        },
        requestDate: {
          startDate: startDate,
          endDate: endDate,
          duration: duration,
          title: title
        }
      });
    }
  }, [selectionRange, isModalOpen]);
  var staticRanges = React.useMemo(function () {
    return reactDateRange.createStaticRanges([{
      label: t("DSS_TODAY"),
      range: function range() {
        return {
          startDate: startOfToday(),
          endDate: endOfToday()
        };
      }
    }, {
      label: t("DSS_YESTERDAY"),
      range: function range() {
        return {
          startDate: startOfYesterday(),
          endDate: endOfYesterday()
        };
      }
    }, {
      label: t("DSS_THIS_WEEK"),
      range: function range() {
        return {
          startDate: startOfWeek(new Date()),
          endDate: endOfWeek(new Date())
        };
      }
    }, {
      label: t('DSS_THIS_MONTH'),
      range: function range() {
        return {
          startDate: startOfMonth(new Date()),
          endDate: endOfMonth(new Date())
        };
      }
    }, {
      label: t('DSS_THIS_QUARTER'),
      range: function range() {
        return {
          startDate: startOfQuarter(new Date()),
          endDate: endOfQuarter(new Date())
        };
      }
    }, {
      label: t('DSS_PREVIOUS_YEAR'),
      range: function range() {
        return {
          startDate: subYears(addMonths(startOfYear(new Date()), 3), 1),
          endDate: subYears(addMonths(endOfYear(new Date()), 3), 1)
        };
      }
    }, {
      label: t('DSS_THIS_YEAR'),
      range: function range() {
        return {
          startDate: addMonths(startOfYear(new Date()), 3),
          endDate: addMonths(endOfYear(new Date()), 3)
        };
      }
    }]);
  }, []);

  var getDuration = function getDuration(startDate, endDate) {
    var noOfDays = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);

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

  var handleSelect = function handleSelect(ranges) {
    var selection = ranges.range1;
    var startDate = selection.startDate,
        endDate = selection.endDate,
        title = selection.title,
        duration = selection.duration;

    if (isStartDateFocused(focusedRange[1])) {
      setSelectionRange(selection);
    }

    if (isEndDateFocused(focusedRange[1])) {
      setSelectionRange({
        title: title,
        duration: duration,
        startDate: startDate,
        endDate: addSeconds(addMinutes(addHours(endDate, 23), 59), 59)
      });
      setIsModalOpen(false);
    }
  };

  return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("div", null, t("ES_DSS_DATE_RANGE")), /*#__PURE__*/React__default.createElement("div", {
    className: "employee-select-wrap",
    ref: wrapperRef
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "select"
  }, /*#__PURE__*/React__default.createElement("input", {
    className: "employee-select-wrap--elipses",
    type: "text",
    value: values !== null && values !== void 0 && values.title ? "" + (values === null || values === void 0 ? void 0 : values.title) : "",
    readOnly: true
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Calender, {
    className: "cursorPointer",
    onClick: function onClick() {
      return setIsModalOpen(function (prevState) {
        return !prevState;
      });
    }
  })), isModalOpen && /*#__PURE__*/React__default.createElement("div", {
    className: "options-card",
    style: {
      overflow: "visible",
      width: "unset",
      maxWidth: "unset"
    }
  }, /*#__PURE__*/React__default.createElement(reactDateRange.DateRangePicker, {
    className: "pickerShadow",
    focusedRange: focusedRange,
    ranges: [selectionRange],
    rangeColors: ["#9E9E9E"],
    onChange: handleSelect,
    onRangeFocusChange: setFocusedRange,
    retainEndDateOnFirstSelection: true,
    showSelectionPreview: true,
    staticRanges: staticRanges,
    inputRanges: []
  }))));
};

var Filters = function Filters(_ref) {
  var t = _ref.t,
      ulbTenants = _ref.ulbTenants,
      isOpen = _ref.isOpen,
      closeFilters = _ref.closeFilters,
      _ref$showDateRange = _ref.showDateRange,
      showDateRange = _ref$showDateRange === void 0 ? true : _ref$showDateRange,
      _ref$showDDR = _ref.showDDR,
      showDDR = _ref$showDDR === void 0 ? true : _ref$showDDR,
      _ref$showUlb = _ref.showUlb,
      showUlb = _ref$showUlb === void 0 ? true : _ref$showUlb,
      _ref$showDenomination = _ref.showDenomination,
      showDenomination = _ref$showDenomination === void 0 ? true : _ref$showDenomination;

  var _useContext = React.useContext(FilterContext),
      value = _useContext.value,
      setValue = _useContext.setValue;

  var _useState = React.useState(function () {
    return ulbTenants === null || ulbTenants === void 0 ? void 0 : ulbTenants.ulb.filter(function (tenant) {
      return value.filters.tenantId.find(function (selectedTenant) {
        return selectedTenant === tenant.code;
      });
    });
  }),
      selected = _useState[0],
      setSelected = _useState[1];

  React.useEffect(function () {
    setSelected(ulbTenants === null || ulbTenants === void 0 ? void 0 : ulbTenants.ulb.filter(function (tenant) {
      return value.filters.tenantId.find(function (selectedTenant) {
        return selectedTenant === tenant.code;
      });
    }));
  }, [value.filters.tenantId]);

  var selectULB = function selectULB(data) {
    var _value$filters;

    var _data = Array.isArray(data) ? data : [data];

    setValue(_extends({}, value, {
      filters: {
        tenantId: [].concat(value === null || value === void 0 ? void 0 : (_value$filters = value.filters) === null || _value$filters === void 0 ? void 0 : _value$filters.tenantId, _data)
      }
    }));
  };

  var removeULB = function removeULB(data) {
    var _value$filters2;

    var _data = Array.isArray(data) ? data : [data];

    setValue(_extends({}, value, {
      filters: _extends({}, value === null || value === void 0 ? void 0 : value.filters, {
        tenantId: [].concat(value === null || value === void 0 ? void 0 : (_value$filters2 = value.filters) === null || _value$filters2 === void 0 ? void 0 : _value$filters2.tenantId).filter(function (tenant) {
          return !_data.find(function (e) {
            return e === tenant;
          });
        })
      })
    }));
  };

  var handleFilterChange = function handleFilterChange(data) {
    setValue(_extends({}, value, data));
  };

  var selectFilters = function selectFilters(e, data) {
    var _e$target = e === null || e === void 0 ? void 0 : e.target,
        checked = _e$target.checked;

    if (checked) selectULB(data.code);else removeULB(data.code);
  };

  var selectDDR = function selectDDR(e, data) {
    var _e$target2 = e === null || e === void 0 ? void 0 : e.target,
        checked = _e$target2.checked;

    if (checked) selectULB(ulbTenants.ulb.filter(function (ulb) {
      return ulb.ddrKey === data.ddrKey;
    }).map(function (ulb) {
      return ulb.code;
    }));else removeULB(ulbTenants.ulb.filter(function (ulb) {
      return ulb.ddrKey === data.ddrKey;
    }).map(function (ulb) {
      return ulb.code;
    }));
  };

  var selectedDDRs = React.useMemo(function () {
    return selected.map(function (ulb) {
      return ulbTenants.ulb.filter(function (e) {
        return e.code === ulb.code;
      })[0];
    }).filter(function (item, i, arr) {
      return i === arr.findIndex(function (t) {
        return t.ddrKey === item.ddrKey;
      });
    });
  }, [selected, ulbTenants]);

  var handleClear = function handleClear() {
    setValue({
      denomination: "Unit",
      range: Digit.Utils.dss.getInitialRange()
    });
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: "filters-wrapper " + (isOpen ? "filters-modal" : "")
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "filter-close",
    onClick: function onClick() {
      return closeFilters();
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CloseSvg, null)), isOpen && /*#__PURE__*/React__default.createElement("div", {
    className: "filter-header"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.FilterIcon, null), /*#__PURE__*/React__default.createElement("p", null, t("DSS_FILTERS")), /*#__PURE__*/React__default.createElement("span", {
    onClick: handleClear
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.RefreshIcon, null))), showDateRange && /*#__PURE__*/React__default.createElement("div", {
    className: "filters-input"
  }, /*#__PURE__*/React__default.createElement(DateRange, {
    onFilterChange: handleFilterChange,
    values: value === null || value === void 0 ? void 0 : value.range,
    t: t
  })), showDDR && /*#__PURE__*/React__default.createElement("div", {
    className: "filters-input"
  }, /*#__PURE__*/React__default.createElement("div", null, t("ES_DSS_DDR")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.MultiSelectDropdown, {
    options: ulbTenants === null || ulbTenants === void 0 ? void 0 : ulbTenants.ddr,
    optionsKey: "ddrKey",
    onSelect: selectDDR,
    selected: selectedDDRs,
    defaultLabel: t("ES_DSS_ALL_DDR_SELECTED"),
    defaultUnit: t("ES_DSS_DDR_SELECTED")
  })), showUlb && /*#__PURE__*/React__default.createElement("div", {
    className: "filters-input"
  }, /*#__PURE__*/React__default.createElement("div", null, t("ES_DSS_ULB")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.MultiSelectDropdown, {
    options: ulbTenants === null || ulbTenants === void 0 ? void 0 : ulbTenants.ulb,
    optionsKey: "ulbKey",
    onSelect: selectFilters,
    selected: selected,
    defaultLabel: t("ES_DSS_ALL_ULB_SELECTED"),
    defaultUnit: t("ES_DSS_DDR_SELECTED")
  })), showDenomination && /*#__PURE__*/React__default.createElement("div", {
    className: "filters-input",
    style: {
      flexBasis: "16%"
    }
  }, /*#__PURE__*/React__default.createElement(Switch, {
    onSelect: handleFilterChange,
    t: t
  })));
};

var renderUnits = function renderUnits(t, denomination) {
  switch (denomination) {
    case "Unit":
      return "(" + t("DSS_UNIT") + ")";

    case "Lac":
      return "(" + t("DSS_LAC") + ")";

    case "Cr":
      return "(" + t("DSS_CR") + ")";
  }
};

var CustomAreaChart = function CustomAreaChart(_ref) {
  var _value$range, _value$range$startDat, _value$range2, _value$range2$endDate, _response$responseDat14, _response$responseDat15, _response$responseDat16;

  var _ref$xDataKey = _ref.xDataKey,
      xDataKey = _ref$xDataKey === void 0 ? "name" : _ref$xDataKey,
      data = _ref.data;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var id = data.id;
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useContext = React.useContext(FilterContext),
      value = _useContext.value;

  var _useState = React.useState(0),
      totalCapacity = _useState[0],
      setTotalCapacity = _useState[1];

  var _useState2 = React.useState(0),
      totalWaste = _useState2[0],
      setTotalWaste = _useState2[1];

  var stateTenant = tenantId.split(".")[0];

  var _Digit$Hooks$useCommo = Digit.Hooks.useCommonMDMS(stateTenant, "FSM", "FSTPPlantInfo", {
    enabled: id === "fsmCapacityUtilization"
  }),
      mdmsData = _Digit$Hooks$useCommo.data;

  var _Digit$Hooks$dss$useG = Digit.Hooks.dss.useGetChart({
    key: id,
    type: "metric",
    tenantId: tenantId,
    requestDate: _extends({}, value === null || value === void 0 ? void 0 : value.requestDate, {
      startDate: value === null || value === void 0 ? void 0 : (_value$range = value.range) === null || _value$range === void 0 ? void 0 : (_value$range$startDat = _value$range.startDate) === null || _value$range$startDat === void 0 ? void 0 : _value$range$startDat.getTime(),
      endDate: value === null || value === void 0 ? void 0 : (_value$range2 = value.range) === null || _value$range2 === void 0 ? void 0 : (_value$range2$endDate = _value$range2.endDate) === null || _value$range2$endDate === void 0 ? void 0 : _value$range2$endDate.getTime()
    }),
    filters: value === null || value === void 0 ? void 0 : value.filters
  }),
      isLoading = _Digit$Hooks$dss$useG.isLoading,
      response = _Digit$Hooks$dss$useG.data;

  React.useEffect(function () {
    if (mdmsData) {
      var _value$filters;

      var fstpPlants = mdmsData;

      if ((value === null || value === void 0 ? void 0 : (_value$filters = value.filters) === null || _value$filters === void 0 ? void 0 : _value$filters.tenantId.length) > 0) {
        fstpPlants = mdmsData.filter(function (plant) {
          var _value$filters2, _value$filters2$tenan;

          return value === null || value === void 0 ? void 0 : (_value$filters2 = value.filters) === null || _value$filters2 === void 0 ? void 0 : (_value$filters2$tenan = _value$filters2.tenantId) === null || _value$filters2$tenan === void 0 ? void 0 : _value$filters2$tenan.some(function (tenant) {
            return plant === null || plant === void 0 ? void 0 : plant.ULBS.includes(tenant);
          });
        });
      }

      var _totalCapacity = fstpPlants.reduce(function (acc, plant) {
        return acc + Number(plant === null || plant === void 0 ? void 0 : plant.PlantOperationalCapacityKLD);
      }, 0);

      setTotalCapacity(_totalCapacity);
    }
  }, [mdmsData, value]);
  React.useEffect(function () {
    if (response) {
      var _response$responseDat, _response$responseDat2, _response$responseDat3, _response$responseDat4, _response$responseDat5, _response$responseDat6, _response$responseDat7;

      var _totalWaste = Math.round(response === null || response === void 0 ? void 0 : (_response$responseDat = response.responseData) === null || _response$responseDat === void 0 ? void 0 : (_response$responseDat2 = _response$responseDat.data) === null || _response$responseDat2 === void 0 ? void 0 : (_response$responseDat3 = _response$responseDat2[0]) === null || _response$responseDat3 === void 0 ? void 0 : (_response$responseDat4 = _response$responseDat3.plots[(response === null || response === void 0 ? void 0 : (_response$responseDat5 = response.responseData) === null || _response$responseDat5 === void 0 ? void 0 : (_response$responseDat6 = _response$responseDat5.data) === null || _response$responseDat6 === void 0 ? void 0 : (_response$responseDat7 = _response$responseDat6[0]) === null || _response$responseDat7 === void 0 ? void 0 : _response$responseDat7.plots.length) - 1]) === null || _response$responseDat4 === void 0 ? void 0 : _response$responseDat4.value);

      setTotalWaste(_totalWaste);
    }
  }, [response]);
  var chartData = React.useMemo(function () {
    var _response$responseDat11, _response$responseDat12, _response$responseDat13;

    if (id !== "fsmCapacityUtilization") {
      var _response$responseDat8, _response$responseDat9, _response$responseDat10;

      return response === null || response === void 0 ? void 0 : (_response$responseDat8 = response.responseData) === null || _response$responseDat8 === void 0 ? void 0 : (_response$responseDat9 = _response$responseDat8.data) === null || _response$responseDat9 === void 0 ? void 0 : (_response$responseDat10 = _response$responseDat9[0]) === null || _response$responseDat10 === void 0 ? void 0 : _response$responseDat10.plots;
    }

    return response === null || response === void 0 ? void 0 : (_response$responseDat11 = response.responseData) === null || _response$responseDat11 === void 0 ? void 0 : (_response$responseDat12 = _response$responseDat11.data) === null || _response$responseDat12 === void 0 ? void 0 : (_response$responseDat13 = _response$responseDat12[0]) === null || _response$responseDat13 === void 0 ? void 0 : _response$responseDat13.plots.map(function (plot) {
      var _plot$name$split = plot === null || plot === void 0 ? void 0 : plot.name.split("-"),
          month = _plot$name$split[0],
          year = _plot$name$split[1];

      var totalDays = getDaysInMonth(Date.parse(month + " 1, " + year));
      var value = Math.round((plot === null || plot === void 0 ? void 0 : plot.value) / (totalCapacity * totalDays) * 100);
      return _extends({}, plot, {
        value: value
      });
    });
  }, [response, totalCapacity]);

  var renderPlot = function renderPlot(plot) {
    if (id === "fsmCapacityUtilization") {
      return Number(plot === null || plot === void 0 ? void 0 : plot.value.toFixed(1));
    }

    var denomination = value.denomination;

    switch (denomination) {
      case "Unit":
        return plot === null || plot === void 0 ? void 0 : plot.value;

      case "Lac":
        return Number((plot.value / 100000).toFixed(2));

      case "Cr":
        return Number((plot.value / 10000000).toFixed(2));
    }
  };

  var tickFormatter = function tickFormatter(value) {
    if (typeof value === "string") {
      return value.replace("-", ", ");
    }

    return value;
  };

  var renderTooltip = function renderTooltip(_ref2) {
    var _payload$;

    var payload = _ref2.payload,
        label = _ref2.label;
    return /*#__PURE__*/React__default.createElement("div", {
      style: {
        margin: "0px",
        padding: "10px",
        backgroundColor: "rgb(255, 255, 255)",
        border: "1px solid rgb(204, 204, 204)",
        whiteSpace: "nowrap"
      }
    }, /*#__PURE__*/React__default.createElement("p", null, tickFormatter(label) + " :" + (id === "fsmTotalCumulativeCollection" ? " ₹" : "") + (payload === null || payload === void 0 ? void 0 : (_payload$ = payload[0]) === null || _payload$ === void 0 ? void 0 : _payload$.value) + (id === "fsmTotalCumulativeCollection" ? (value === null || value === void 0 ? void 0 : value.denomination) !== "Unit" ? value === null || value === void 0 ? void 0 : value.denomination : "" : "%")));
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "85%"
    }
  }, id === "fsmCapacityUtilization" && /*#__PURE__*/React__default.createElement("p", null, t("DSS_FSM_TOTAL_SLUDGE_TREATED"), " - ", totalWaste, " ", t("DSS_KL")), /*#__PURE__*/React__default.createElement(recharts.ResponsiveContainer, {
    width: "99%",
    height: id === "fsmTotalCumulativeCollection" ? 400 : 300
  }, !chartData || (chartData === null || chartData === void 0 ? void 0 : chartData.length) === 0 ? /*#__PURE__*/React__default.createElement("div", {
    className: "no-data"
  }, /*#__PURE__*/React__default.createElement("p", null, t("DSS_NO_DATA"))) : /*#__PURE__*/React__default.createElement(recharts.AreaChart, {
    width: "100%",
    height: "100%",
    data: chartData,
    margin: {
      left: 30,
      top: 10
    }
  }, /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement("linearGradient", {
    id: "colorUv",
    x1: ".5",
    x2: ".5",
    y2: "1"
  }, /*#__PURE__*/React__default.createElement("stop", {
    stopColor: "#048BD0",
    stopOpacity: 0.5
  }), /*#__PURE__*/React__default.createElement("stop", {
    offset: "1",
    stopColor: "#048BD0",
    stopOpacity: 0
  }))), /*#__PURE__*/React__default.createElement(recharts.CartesianGrid, null), /*#__PURE__*/React__default.createElement(recharts.Tooltip, {
    content: renderTooltip
  }), /*#__PURE__*/React__default.createElement(recharts.XAxis, {
    dataKey: xDataKey,
    tick: {
      fontSize: "14px",
      fill: "#505A5F"
    },
    tickFormatter: tickFormatter
  }), /*#__PURE__*/React__default.createElement(recharts.YAxis, {
    label: {
      value: t("DSS_" + (response === null || response === void 0 ? void 0 : (_response$responseDat14 = response.responseData) === null || _response$responseDat14 === void 0 ? void 0 : (_response$responseDat15 = _response$responseDat14.data) === null || _response$responseDat15 === void 0 ? void 0 : (_response$responseDat16 = _response$responseDat15[0]) === null || _response$responseDat16 === void 0 ? void 0 : _response$responseDat16.headerName.replaceAll(" ", "_").toUpperCase())) + " " + (id === "fsmTotalCumulativeCollection" ? renderUnits(t, value.denomination) : "(%)"),
      angle: -90,
      position: "insideLeft",
      dy: 40,
      offset: -10,
      fontSize: "14px",
      fill: "#505A5F"
    },
    tick: {
      fontSize: "14px",
      fill: "#505A5F"
    }
  }), /*#__PURE__*/React__default.createElement(recharts.Area, {
    type: "monotone",
    dataKey: renderPlot,
    stroke: "#048BD0",
    fill: "url(#colorUv)",
    dot: true
  }))));
};

var CustomLabel = function CustomLabel(_ref) {
  var x = _ref.x,
      y = _ref.y,
      name = _ref.name,
      stroke = _ref.stroke,
      value = _ref.value;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("text", {
    x: x,
    y: y,
    dx: -65,
    dy: 10,
    fill: stroke,
    width: "30"
  }, value + "%"), /*#__PURE__*/React__default.createElement("text", {
    x: x,
    y: y,
    dx: -170,
    dy: 10
  }, t(name)));
};

var CustomBarChart = function CustomBarChart(_ref2) {
  var _value$range, _value$range$startDat, _value$range2, _value$range2$endDate;

  var _ref2$xDataKey = _ref2.xDataKey,
      xDataKey = _ref2$xDataKey === void 0 ? "value" : _ref2$xDataKey,
      _ref2$xAxisType = _ref2.xAxisType,
      xAxisType = _ref2$xAxisType === void 0 ? "number" : _ref2$xAxisType,
      _ref2$yAxisType = _ref2.yAxisType,
      yAxisType = _ref2$yAxisType === void 0 ? "category" : _ref2$yAxisType,
      _ref2$yDataKey = _ref2.yDataKey,
      yDataKey = _ref2$yDataKey === void 0 ? "name" : _ref2$yDataKey,
      _ref2$hideAxis = _ref2.hideAxis,
      hideAxis = _ref2$hideAxis === void 0 ? true : _ref2$hideAxis,
      _ref2$layout = _ref2.layout,
      layout = _ref2$layout === void 0 ? "vertical" : _ref2$layout,
      _ref2$fillColor = _ref2.fillColor,
      fillColor = _ref2$fillColor === void 0 ? "#00703C" : _ref2$fillColor,
      _ref2$showGrid = _ref2.showGrid,
      showGrid = _ref2$showGrid === void 0 ? false : _ref2$showGrid,
      _ref2$showDrillDown = _ref2.showDrillDown,
      showDrillDown = _ref2$showDrillDown === void 0 ? false : _ref2$showDrillDown,
      data = _ref2.data,
      title = _ref2.title;
  var id = data.id;

  var _useTranslation2 = reactI18next.useTranslation(),
      t = _useTranslation2.t;

  var history = reactRouterDom.useHistory();

  var _useContext = React.useContext(FilterContext),
      value = _useContext.value;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$Hooks$dss$useG = Digit.Hooks.dss.useGetChart({
    key: id,
    type: "metric",
    tenantId: tenantId,
    requestDate: _extends({}, value === null || value === void 0 ? void 0 : value.requestDate, {
      startDate: value === null || value === void 0 ? void 0 : (_value$range = value.range) === null || _value$range === void 0 ? void 0 : (_value$range$startDat = _value$range.startDate) === null || _value$range$startDat === void 0 ? void 0 : _value$range$startDat.getTime(),
      endDate: value === null || value === void 0 ? void 0 : (_value$range2 = value.range) === null || _value$range2 === void 0 ? void 0 : (_value$range2$endDate = _value$range2.endDate) === null || _value$range2$endDate === void 0 ? void 0 : _value$range2$endDate.getTime()
    }),
    filters: value === null || value === void 0 ? void 0 : value.filters
  }),
      isLoading = _Digit$Hooks$dss$useG.isLoading,
      response = _Digit$Hooks$dss$useG.data;

  var chartData = React.useMemo(function () {
    var _response$responseDat, _response$responseDat2;

    if (!response) return null;
    return response === null || response === void 0 ? void 0 : (_response$responseDat = response.responseData) === null || _response$responseDat === void 0 ? void 0 : (_response$responseDat2 = _response$responseDat.data) === null || _response$responseDat2 === void 0 ? void 0 : _response$responseDat2.map(function (bar) {
      var _bar$plots, _bar$plots2;

      return {
        name: t(bar === null || bar === void 0 ? void 0 : (_bar$plots = bar.plots) === null || _bar$plots === void 0 ? void 0 : _bar$plots[0].name),
        value: bar === null || bar === void 0 ? void 0 : (_bar$plots2 = bar.plots) === null || _bar$plots2 === void 0 ? void 0 : _bar$plots2[0].value
      };
    });
  }, [response]);

  var goToDrillDownCharts = function goToDrillDownCharts() {
    var _response$responseDat3, _value$filters;

    history.push("/digit-ui/employee/dss/drilldown?chart=" + (response === null || response === void 0 ? void 0 : (_response$responseDat3 = response.responseData) === null || _response$responseDat3 === void 0 ? void 0 : _response$responseDat3.drillDownChartId) + "&ulb=" + (value === null || value === void 0 ? void 0 : (_value$filters = value.filters) === null || _value$filters === void 0 ? void 0 : _value$filters.tenantId) + "&title=" + title);
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  if ((chartData === null || chartData === void 0 ? void 0 : chartData.length) === 0) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "no-data"
    }, /*#__PURE__*/React__default.createElement("p", null, t("DSS_NO_DATA")));
  }

  return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(recharts.ResponsiveContainer, {
    width: "99%",
    height: 320
  }, /*#__PURE__*/React__default.createElement(recharts.BarChart, {
    width: "100%",
    height: "100%",
    data: chartData,
    layout: layout,
    maxBarSize: 10,
    margin: {
      left: 170
    },
    barGap: 70
  }, showGrid && /*#__PURE__*/React__default.createElement(recharts.CartesianGrid, null), /*#__PURE__*/React__default.createElement(recharts.XAxis, {
    hide: hideAxis,
    dataKey: xDataKey,
    type: xAxisType,
    domain: [0, 100]
  }), /*#__PURE__*/React__default.createElement(recharts.YAxis, {
    dataKey: yDataKey,
    hide: hideAxis,
    type: yAxisType,
    padding: {
      right: 40
    }
  }), /*#__PURE__*/React__default.createElement(recharts.Bar, {
    dataKey: xDataKey,
    fill: fillColor,
    background: {
      fill: "#D6D5D4",
      radius: 10
    },
    label: /*#__PURE__*/React__default.createElement(CustomLabel, {
      stroke: fillColor
    }),
    radius: [10, 10, 10, 10]
  }))), showDrillDown && /*#__PURE__*/React__default.createElement("p", {
    className: "showMore",
    onClick: goToDrillDownCharts
  }, t("DSS_SHOW_MORE")));
};

var barColors = ["#048BD0", "#FBC02D", "#8E29BF"];

var CustomHorizontalBarChart = function CustomHorizontalBarChart(_ref) {
  var _value$range, _value$range$startDat, _value$range2, _value$range2$endDate, _response$responseDat3, _response$responseDat4;

  var data = _ref.data,
      _ref$xAxisType = _ref.xAxisType,
      xAxisType = _ref$xAxisType === void 0 ? "category" : _ref$xAxisType,
      _ref$yAxisType = _ref.yAxisType,
      yAxisType = _ref$yAxisType === void 0 ? "number" : _ref$yAxisType,
      _ref$xDataKey = _ref.xDataKey,
      xDataKey = _ref$xDataKey === void 0 ? "name" : _ref$xDataKey,
      _ref$yDataKey = _ref.yDataKey,
      yDataKey = _ref$yDataKey === void 0 ? "" : _ref$yDataKey,
      _ref$yAxisLabel = _ref.yAxisLabel,
      yAxisLabel = _ref$yAxisLabel === void 0 ? "" : _ref$yAxisLabel,
      _ref$layout = _ref.layout,
      layout = _ref$layout === void 0 ? "horizontal" : _ref$layout,
      title = _ref.title,
      _ref$showDrillDown = _ref.showDrillDown,
      showDrillDown = _ref$showDrillDown === void 0 ? false : _ref$showDrillDown;
  var id = data.id;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();

  var _useContext = React.useContext(FilterContext),
      value = _useContext.value;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$Hooks$dss$useG = Digit.Hooks.dss.useGetChart({
    key: id,
    type: "metric",
    tenantId: tenantId,
    requestDate: _extends({}, value === null || value === void 0 ? void 0 : value.requestDate, {
      startDate: value === null || value === void 0 ? void 0 : (_value$range = value.range) === null || _value$range === void 0 ? void 0 : (_value$range$startDat = _value$range.startDate) === null || _value$range$startDat === void 0 ? void 0 : _value$range$startDat.getTime(),
      endDate: value === null || value === void 0 ? void 0 : (_value$range2 = value.range) === null || _value$range2 === void 0 ? void 0 : (_value$range2$endDate = _value$range2.endDate) === null || _value$range2$endDate === void 0 ? void 0 : _value$range2$endDate.getTime()
    }),
    filters: value === null || value === void 0 ? void 0 : value.filters
  }),
      isLoading = _Digit$Hooks$dss$useG.isLoading,
      response = _Digit$Hooks$dss$useG.data;

  var constructChartData = function constructChartData(data) {
    var result = {};

    for (var i = 0; i < (data === null || data === void 0 ? void 0 : data.length); i++) {
      var row = data[i];

      for (var j = 0; j < row.plots.length; j++) {
        var _extends2;

        var plot = row.plots[j];
        result[plot.name] = _extends({}, result[plot.name], (_extends2 = {}, _extends2[row.headerName] = plot.value, _extends2));
      }
    }

    return Object.keys(result).map(function (key) {
      return _extends({
        name: key
      }, result[key]);
    });
  };

  var goToDrillDownCharts = function goToDrillDownCharts() {
    var _response$responseDat, _value$filters;

    history.push("/digit-ui/employee/dss/drilldown?chart=" + (response === null || response === void 0 ? void 0 : (_response$responseDat = response.responseData) === null || _response$responseDat === void 0 ? void 0 : _response$responseDat.drillDownChartId) + "&ulb=" + (value === null || value === void 0 ? void 0 : (_value$filters = value.filters) === null || _value$filters === void 0 ? void 0 : _value$filters.tenantId) + "&title=" + title);
  };

  var tooltipFormatter = function tooltipFormatter(value, name) {
    if (id === "fsmMonthlyWasteCal") {
      return [Math.round((value + Number.EPSILON) * 100) / 100 + " " + t("DSS_KL"), name];
    }

    return [Math.round((value + Number.EPSILON) * 100) / 100, name];
  };

  var chartData = React.useMemo(function () {
    var _response$responseDat2;

    return constructChartData(response === null || response === void 0 ? void 0 : (_response$responseDat2 = response.responseData) === null || _response$responseDat2 === void 0 ? void 0 : _response$responseDat2.data);
  }, [response]);

  var renderLegend = function renderLegend(value) {
    return /*#__PURE__*/React__default.createElement("span", {
      style: {
        fontSize: "14px",
        color: "#505A5F"
      }
    }, value);
  };

  var tickFormatter = function tickFormatter(value) {
    if (typeof value === "string") {
      return value.replace("-", ", ");
    }

    return value;
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  var bars = response === null || response === void 0 ? void 0 : (_response$responseDat3 = response.responseData) === null || _response$responseDat3 === void 0 ? void 0 : (_response$responseDat4 = _response$responseDat3.data) === null || _response$responseDat4 === void 0 ? void 0 : _response$responseDat4.map(function (bar) {
    return bar === null || bar === void 0 ? void 0 : bar.headerName;
  });
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(recharts.ResponsiveContainer, {
    width: "99%",
    height: 300
  }, (chartData === null || chartData === void 0 ? void 0 : chartData.length) === 0 ? /*#__PURE__*/React__default.createElement("div", {
    className: "no-data"
  }, /*#__PURE__*/React__default.createElement("p", null, t("DSS_NO_DATA"))) : /*#__PURE__*/React__default.createElement(recharts.BarChart, {
    width: "100%",
    height: "100%",
    layout: layout,
    data: chartData,
    barGap: 14,
    barSize: 15
  }, /*#__PURE__*/React__default.createElement(recharts.CartesianGrid, null), /*#__PURE__*/React__default.createElement(recharts.YAxis, {
    dataKey: yDataKey,
    type: yAxisType,
    tick: {
      fontSize: "14px",
      fill: "#505A5F"
    },
    label: {
      value: yAxisLabel,
      angle: -90,
      position: "insideLeft",
      dy: 50,
      fontSize: "14px",
      fill: "#505A5F"
    },
    unit: id === "fsmCapacityUtilization" ? "%" : ""
  }), /*#__PURE__*/React__default.createElement(recharts.XAxis, {
    dataKey: xDataKey,
    type: xAxisType,
    tick: {
      fontSize: "14px",
      fill: "#505A5F"
    },
    tickFormatter: tickFormatter
  }), bars === null || bars === void 0 ? void 0 : bars.map(function (bar, id) {
    return /*#__PURE__*/React__default.createElement(recharts.Bar, {
      key: id,
      dataKey: bar,
      fill: barColors[id],
      stackId: id > 1 ? 1 : id
    });
  }), /*#__PURE__*/React__default.createElement(recharts.Legend, {
    formatter: renderLegend,
    iconType: "circle"
  }), /*#__PURE__*/React__default.createElement(recharts.Tooltip, {
    cursor: false,
    formatter: tooltipFormatter
  }))), showDrillDown && /*#__PURE__*/React__default.createElement("p", {
    className: "showMore",
    onClick: goToDrillDownCharts
  }, t("DSS_SHOW_MORE")));
};

var COLORS = ["#048BD0", "#FBC02D", "#8E29BF", "#EA8A3B", "#0BABDE", "#FFBB28", "#FF8042"];

var CustomPieChart = function CustomPieChart(_ref) {
  var _value$range, _value$range$startDat, _value$range2, _value$range2$endDate, _response$responseDat4, _response$responseDat5, _response$responseDat6;

  var _ref$dataKey = _ref.dataKey,
      dataKey = _ref$dataKey === void 0 ? "value" : _ref$dataKey,
      data = _ref.data;
  var id = data.id;
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useContext = React.useContext(FilterContext),
      value = _useContext.value;

  var _Digit$Hooks$dss$useG = Digit.Hooks.dss.useGetChart({
    key: id,
    type: "metric",
    tenantId: tenantId,
    requestDate: _extends({}, value === null || value === void 0 ? void 0 : value.requestDate, {
      startDate: value === null || value === void 0 ? void 0 : (_value$range = value.range) === null || _value$range === void 0 ? void 0 : (_value$range$startDat = _value$range.startDate) === null || _value$range$startDat === void 0 ? void 0 : _value$range$startDat.getTime(),
      endDate: value === null || value === void 0 ? void 0 : (_value$range2 = value.range) === null || _value$range2 === void 0 ? void 0 : (_value$range2$endDate = _value$range2.endDate) === null || _value$range2$endDate === void 0 ? void 0 : _value$range2$endDate.getTime()
    }),
    filters: value === null || value === void 0 ? void 0 : value.filters
  }),
      isLoading = _Digit$Hooks$dss$useG.isLoading,
      response = _Digit$Hooks$dss$useG.data;

  var chartData = React.useMemo(function () {
    var _response$responseDat, _response$responseDat2, _response$responseDat3;

    if (!response) return null;

    var compareFn = function compareFn(a, b) {
      return b.value - a.value;
    };

    return response === null || response === void 0 ? void 0 : (_response$responseDat = response.responseData) === null || _response$responseDat === void 0 ? void 0 : (_response$responseDat2 = _response$responseDat.data) === null || _response$responseDat2 === void 0 ? void 0 : (_response$responseDat3 = _response$responseDat2[0]) === null || _response$responseDat3 === void 0 ? void 0 : _response$responseDat3.plots.sort(compareFn).reduce(function (acc, plot, index) {
      if (index < 4) acc = acc.concat(plot);else if (index === 4) acc = acc.concat({
        label: null,
        name: "DSS.OTHERS",
        value: plot === null || plot === void 0 ? void 0 : plot.value,
        symbol: "amount"
      });else acc[4].value += plot === null || plot === void 0 ? void 0 : plot.value;
      return acc;
    }, []);
  }, [response]);

  var renderLegend = function renderLegend(value) {
    return /*#__PURE__*/React__default.createElement("span", {
      style: {
        fontSize: "14px",
        color: "#505A5F"
      }
    }, t("PROPERTYTYPE_MASTERS_" + value));
  };

  var renderCustomLabel = function renderCustomLabel(args) {
    var endAngle = args.endAngle,
        startAngle = args.startAngle,
        x = args.x,
        cx = args.cx,
        y = args.y,
        cy = args.cy,
        percent = args.percent,
        name = args.name;
    var diffAngle = endAngle - startAngle;

    if (diffAngle < 7) {
      return null;
    }

    return /*#__PURE__*/React__default.createElement("text", {
      x: x,
      cx: cx,
      y: y,
      cy: cy,
      percent: percent,
      name: name,
      fill: "#505A5F",
      alignmentBaseline: "middle",
      className: "recharts-pie-label-text",
      fontSize: "14px",
      textAnchor: x > cx ? "start" : "end"
    }, (percent * 100).toFixed(0) + "%");
  };

  var renderTooltip = function renderTooltip(_ref2) {
    var _payload$, _payload$2, _payload$3, _payload$3$payload, _payload$3$payload$pa;

    var payload = _ref2.payload;
    return /*#__PURE__*/React__default.createElement("div", {
      style: {
        margin: "0px",
        padding: "10px",
        backgroundColor: "rgb(255, 255, 255)",
        border: "1px solid rgb(204, 204, 204)",
        whiteSpace: "nowrap"
      }
    }, /*#__PURE__*/React__default.createElement("p", {
      className: "recharts-tooltip-label"
    }, t("PROPERTYTYPE_MASTERS_" + (payload === null || payload === void 0 ? void 0 : (_payload$ = payload[0]) === null || _payload$ === void 0 ? void 0 : _payload$.name)) + ": " + Digit.Utils.dss.formatter(payload === null || payload === void 0 ? void 0 : (_payload$2 = payload[0]) === null || _payload$2 === void 0 ? void 0 : _payload$2.value, payload === null || payload === void 0 ? void 0 : (_payload$3 = payload[0]) === null || _payload$3 === void 0 ? void 0 : (_payload$3$payload = _payload$3.payload) === null || _payload$3$payload === void 0 ? void 0 : (_payload$3$payload$pa = _payload$3$payload.payload) === null || _payload$3$payload$pa === void 0 ? void 0 : _payload$3$payload$pa.symbol, value === null || value === void 0 ? void 0 : value.denomination, false)));
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  if ((chartData === null || chartData === void 0 ? void 0 : chartData.length) === 0) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "no-data"
    }, /*#__PURE__*/React__default.createElement("p", null, t("DSS_NO_DATA")));
  }

  return /*#__PURE__*/React__default.createElement(recharts.ResponsiveContainer, {
    width: "99%",
    height: 340
  }, /*#__PURE__*/React__default.createElement(recharts.PieChart, null, /*#__PURE__*/React__default.createElement(recharts.Pie, {
    data: chartData,
    dataKey: dataKey,
    cy: 130,
    innerRadius: 70,
    outerRadius: 90,
    margin: {
      top: 5
    },
    fill: "#8884d8",
    label: renderCustomLabel,
    labelLine: false,
    isAnimationActive: false
  }, response === null || response === void 0 ? void 0 : (_response$responseDat4 = response.responseData) === null || _response$responseDat4 === void 0 ? void 0 : (_response$responseDat5 = _response$responseDat4.data) === null || _response$responseDat5 === void 0 ? void 0 : (_response$responseDat6 = _response$responseDat5[0]) === null || _response$responseDat6 === void 0 ? void 0 : _response$responseDat6.plots.map(function (entry, index) {
    return /*#__PURE__*/React__default.createElement(recharts.Cell, {
      key: "cell-",
      fill: COLORS[index % COLORS.length]
    });
  })), /*#__PURE__*/React__default.createElement(recharts.Tooltip, {
    content: renderTooltip
  }), /*#__PURE__*/React__default.createElement(recharts.Legend, {
    layout: "horizontal",
    align: "bottom",
    iconType: "circle",
    formatter: renderLegend
  })));
};

var InsightView = function InsightView(_ref) {
  var rowValue = _ref.rowValue,
      insight = _ref.insight;
  return /*#__PURE__*/React__default.createElement("span", null, rowValue, " ", insight >= 0 ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.UpwardArrow, null) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.DownwardArrow, null), " ", Math.abs(insight) + "%");
};

var calculateFSTPCapacityUtilization = function calculateFSTPCapacityUtilization(value, totalCapacity, numberOfDays) {
  if (numberOfDays === void 0) {
    numberOfDays = 1;
  }

  if (value === undefined) return value;
  return Math.round(value / (totalCapacity * numberOfDays) * 100);
};

var CustomTable = function CustomTable(_ref2) {
  var _value$range, _value$range2, _filterStack, _filterStack2, _ref3, _value$range3, _value$range3$startDa, _value$range4, _value$range4$endDate, _filterStack3, _filterStack4, _ref4;

  var data = _ref2.data,
      onSearch = _ref2.onSearch,
      setChartData = _ref2.setChartData;
  var id = data.id;

  var _useState = React.useState(id),
      chartKey = _useState[0],
      setChartKey = _useState[1];

  var _useState2 = React.useState([{
    id: chartKey
  }]),
      filterStack = _useState2[0],
      setFilterStack = _useState2[1];

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useContext = React.useContext(FilterContext),
      value = _useContext.value,
      fstpMdmsData = _useContext.fstpMdmsData;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var dssTenants = Digit.SessionStorage.get("DSS_TENANTS");
  var lastYearDate = {
    startDate: subYears(value === null || value === void 0 ? void 0 : (_value$range = value.range) === null || _value$range === void 0 ? void 0 : _value$range.startDate, 1).getTime(),
    endDate: subYears(value === null || value === void 0 ? void 0 : (_value$range2 = value.range) === null || _value$range2 === void 0 ? void 0 : _value$range2.endDate, 1).getTime(),
    interval: "month",
    title: ""
  };

  var _Digit$Hooks$dss$useG = Digit.Hooks.dss.useGetChart({
    key: chartKey,
    type: "metric",
    tenantId: tenantId,
    requestDate: _extends({}, lastYearDate),
    filters: id === chartKey ? value === null || value === void 0 ? void 0 : value.filters : (_ref3 = {}, _ref3[(_filterStack = filterStack[filterStack.length - 1]) === null || _filterStack === void 0 ? void 0 : _filterStack.filterKey] = (_filterStack2 = filterStack[filterStack.length - 1]) === null || _filterStack2 === void 0 ? void 0 : _filterStack2.filterValue, _ref3)
  }),
      isRequestLoading = _Digit$Hooks$dss$useG.isLoading,
      lastYearResponse = _Digit$Hooks$dss$useG.data;

  var _Digit$Hooks$dss$useG2 = Digit.Hooks.dss.useGetChart({
    key: chartKey,
    type: "metric",
    tenantId: tenantId,
    requestDate: _extends({}, value === null || value === void 0 ? void 0 : value.requestDate, {
      startDate: value === null || value === void 0 ? void 0 : (_value$range3 = value.range) === null || _value$range3 === void 0 ? void 0 : (_value$range3$startDa = _value$range3.startDate) === null || _value$range3$startDa === void 0 ? void 0 : _value$range3$startDa.getTime(),
      endDate: value === null || value === void 0 ? void 0 : (_value$range4 = value.range) === null || _value$range4 === void 0 ? void 0 : (_value$range4$endDate = _value$range4.endDate) === null || _value$range4$endDate === void 0 ? void 0 : _value$range4$endDate.getTime()
    }),
    filters: id === chartKey ? value === null || value === void 0 ? void 0 : value.filters : (_ref4 = {}, _ref4[(_filterStack3 = filterStack[filterStack.length - 1]) === null || _filterStack3 === void 0 ? void 0 : _filterStack3.filterKey] = (_filterStack4 = filterStack[filterStack.length - 1]) === null || _filterStack4 === void 0 ? void 0 : _filterStack4.filterValue, _ref4)
  }),
      isLoading = _Digit$Hooks$dss$useG2.isLoading,
      response = _Digit$Hooks$dss$useG2.data;

  var tableData = React.useMemo(function () {
    var _response$responseDat, _response$responseDat2;

    if (!response || !lastYearResponse) return;
    return response === null || response === void 0 ? void 0 : (_response$responseDat = response.responseData) === null || _response$responseDat === void 0 ? void 0 : (_response$responseDat2 = _response$responseDat.data) === null || _response$responseDat2 === void 0 ? void 0 : _response$responseDat2.map(function (rows, id) {
      var _lastYearResponse$res, _lastYearResponse$res2, _rows$plots;

      var lyData = lastYearResponse === null || lastYearResponse === void 0 ? void 0 : (_lastYearResponse$res = lastYearResponse.responseData) === null || _lastYearResponse$res === void 0 ? void 0 : (_lastYearResponse$res2 = _lastYearResponse$res.data) === null || _lastYearResponse$res2 === void 0 ? void 0 : _lastYearResponse$res2.find(function (lyRow) {
        return (lyRow === null || lyRow === void 0 ? void 0 : lyRow.headerName) === (rows === null || rows === void 0 ? void 0 : rows.headerName);
      });
      return rows === null || rows === void 0 ? void 0 : (_rows$plots = rows.plots) === null || _rows$plots === void 0 ? void 0 : _rows$plots.reduce(function (acc, row, currentIndex) {
        var _lyData$plots, _lyData$plots$current;

        var cellValue = (row === null || row === void 0 ? void 0 : row.value) !== null ? row === null || row === void 0 ? void 0 : row.value : (row === null || row === void 0 ? void 0 : row.label) || "";
        var prevData = lyData === null || lyData === void 0 ? void 0 : (_lyData$plots = lyData.plots) === null || _lyData$plots === void 0 ? void 0 : (_lyData$plots$current = _lyData$plots[currentIndex]) === null || _lyData$plots$current === void 0 ? void 0 : _lyData$plots$current.value;
        var insight = null;

        if ((row === null || row === void 0 ? void 0 : row.name) === "CapacityUtilization" && chartKey !== "fsmVehicleLogReportByVehicleNo") {
          var range = value.range;
          var startDate = range.startDate,
              endDate = range.endDate;
          var numberOfDays = differenceInCalendarDays(endDate, startDate) + 1;
          var ulbs = dssTenants.filter(function (tenant) {
            var _tenant$city;

            return (tenant === null || tenant === void 0 ? void 0 : (_tenant$city = tenant.city) === null || _tenant$city === void 0 ? void 0 : _tenant$city.ddrName) === rows.headerName || (tenant === null || tenant === void 0 ? void 0 : tenant.code) === rows.headerName;
          }).map(function (tenant) {
            return tenant.code;
          });
          var totalCapacity = fstpMdmsData === null || fstpMdmsData === void 0 ? void 0 : fstpMdmsData.filter(function (plant) {
            return ulbs.find(function (ulb) {
              return plant.ULBS.includes(ulb);
            });
          }).reduce(function (acc, plant) {
            return acc + Number(plant.PlantOperationalCapacityKLD);
          }, 0);
          cellValue = calculateFSTPCapacityUtilization(cellValue, totalCapacity, numberOfDays);
          prevData = calculateFSTPCapacityUtilization(prevData, totalCapacity, numberOfDays);
        }

        if ((row === null || row === void 0 ? void 0 : row.name) === "CapacityUtilization" && chartKey === "fsmVehicleLogReportByVehicleNo") {
          var tankCapcity = rows === null || rows === void 0 ? void 0 : rows.plots.find(function (plot) {
            return (plot === null || plot === void 0 ? void 0 : plot.name) === "TankCapacity";
          });
          cellValue = calculateFSTPCapacityUtilization(cellValue, tankCapcity === null || tankCapcity === void 0 ? void 0 : tankCapcity.value);
          prevData = calculateFSTPCapacityUtilization(prevData, tankCapcity === null || tankCapcity === void 0 ? void 0 : tankCapcity.value);
        }

        if ((row.symbol === "number" || row.symbol === "percentage" || row.symbol === "amount") && row.name !== "CitizenAverageRating" && row.name !== "TankCapacity" && lyData !== undefined) {
          if (prevData === cellValue) insight = 0;else insight = prevData === 0 ? 100 : Math.round((cellValue - prevData) / prevData * 100);
        }

        if (typeof cellValue === "number" && !Number.isInteger(cellValue)) {
          cellValue = Math.round((cellValue + Number.EPSILON) * 100) / 100;
        }

        acc[t("DSS_HEADER_" + (row === null || row === void 0 ? void 0 : row.name.toUpperCase()))] = insight !== null ? {
          value: cellValue,
          insight: insight
        } : (row === null || row === void 0 ? void 0 : row.name) === "S.N." ? id + 1 : cellValue;
        acc['key'] = rows.headerName;
        return acc;
      }, {});
    });
  }, [response, lastYearResponse]);
  React.useEffect(function () {
    if (tableData) {
      var result = tableData.map(function (row) {
        return Object.keys(row).reduce(function (acc, key) {
          var _row$key;

          if (key === "key") return acc;
          acc[key] = typeof row[key] === 'object' ? (_row$key = row[key]) === null || _row$key === void 0 ? void 0 : _row$key.value : row[key];
          return acc;
        }, {});
      });
      setChartData(result);
    }
  }, [tableData]);
  var filterValue = React.useCallback(function (rows, id, filterValue) {
    if (filterValue === void 0) {
      filterValue = "";
    }

    return rows.filter(function (row) {
      var res = Object.keys(row.values).find(function (key) {
        if (typeof row.values[key] === 'object') {
          return Object.keys(row.values[key]).find(function (id) {
            var _filterValue2;

            if (id === 'insight') {
              var _filterValue;

              return String(Math.abs(row.values[key][id]) + '%').toLowerCase().startsWith((_filterValue = filterValue) === null || _filterValue === void 0 ? void 0 : _filterValue.toLowerCase());
            }

            return String(row.values[key][id]).toLowerCase().startsWith((_filterValue2 = filterValue) === null || _filterValue2 === void 0 ? void 0 : _filterValue2.toLowerCase());
          });
        }

        return String(row.values[key]).toLowerCase().split(' ').some(function (str) {
          var _filterValue3;

          return str.startsWith((_filterValue3 = filterValue) === null || _filterValue3 === void 0 ? void 0 : _filterValue3.toLowerCase());
        });
      });
      return res;
    });
  }, []);

  var renderUnits = function renderUnits(denomination) {
    switch (denomination) {
      case "Unit":
        return "(₹)";

      case "Lac":
        return "(Lac)";

      case "Cr":
        return "(Cr)";
    }
  };

  var renderHeader = function renderHeader(plot) {
    var code = "DSS_HEADER_" + (plot === null || plot === void 0 ? void 0 : plot.name.toUpperCase());

    if ((plot === null || plot === void 0 ? void 0 : plot.symbol) === "amount") {
      return t(code) + " " + renderUnits(value === null || value === void 0 ? void 0 : value.denomination);
    }

    return t(code);
  };

  var getDrilldownCharts = function getDrilldownCharts(value, filterKey, label) {
    var _response$responseDat3, _response$responseDat4;

    if (response !== null && response !== void 0 && (_response$responseDat3 = response.responseData) !== null && _response$responseDat3 !== void 0 && _response$responseDat3.drillDownChartId && (response === null || response === void 0 ? void 0 : (_response$responseDat4 = response.responseData) === null || _response$responseDat4 === void 0 ? void 0 : _response$responseDat4.drillDownChartId) !== "none") {
      var _response$responseDat5, _response$responseDat6;

      var currentValue = value;

      if (filterKey === "tenantId") {
        currentValue = dssTenants.filter(function (tenant) {
          var _tenant$city2;

          return (tenant === null || tenant === void 0 ? void 0 : (_tenant$city2 = tenant.city) === null || _tenant$city2 === void 0 ? void 0 : _tenant$city2.ddrName) === value || (tenant === null || tenant === void 0 ? void 0 : tenant.code) === value;
        }).map(function (tenant) {
          return tenant === null || tenant === void 0 ? void 0 : tenant.code;
        });
        if (currentValue === undefined) return;
      }

      setFilterStack([].concat(filterStack, [{
        id: response === null || response === void 0 ? void 0 : (_response$responseDat5 = response.responseData) === null || _response$responseDat5 === void 0 ? void 0 : _response$responseDat5.drillDownChartId,
        name: value,
        filterKey: filterKey,
        filterValue: currentValue,
        label: label
      }]));
      setChartKey(response === null || response === void 0 ? void 0 : (_response$responseDat6 = response.responseData) === null || _response$responseDat6 === void 0 ? void 0 : _response$responseDat6.drillDownChartId);
    }
  };

  var sortRows = React.useCallback(function (rowA, rowB, columnId) {
    var firstCell = rowA.values[columnId];
    var secondCell = rowB.values[columnId];
    var value1, value2;
    value1 = typeof firstCell === "object" ? firstCell === null || firstCell === void 0 ? void 0 : firstCell.value : firstCell;
    value2 = typeof secondCell === "object" ? secondCell === null || secondCell === void 0 ? void 0 : secondCell.value : secondCell;
    return String(value1).localeCompare(String(value2), undefined, {
      numeric: true
    });
  }, []);

  var accessData = function accessData(plot) {
    var name = t("DSS_HEADER_" + (plot === null || plot === void 0 ? void 0 : plot.name.toUpperCase()));
    return function (originalRow, rowIndex, columns) {
      var cellValue = originalRow[name];

      if ((plot === null || plot === void 0 ? void 0 : plot.symbol) === "amount") {
        return typeof cellValue === "object" ? {
          value: convertDenomination(cellValue === null || cellValue === void 0 ? void 0 : cellValue.value),
          insight: cellValue === null || cellValue === void 0 ? void 0 : cellValue.insight
        } : String(convertDenomination(cellValue));
      }

      return originalRow[name];
    };
  };

  var tableColumns = React.useMemo(function () {
    var _response$responseDat7, _response$responseDat8, _columns$plots;

    var columns = response === null || response === void 0 ? void 0 : (_response$responseDat7 = response.responseData) === null || _response$responseDat7 === void 0 ? void 0 : (_response$responseDat8 = _response$responseDat7.data) === null || _response$responseDat8 === void 0 ? void 0 : _response$responseDat8.find(function (row) {
      return !!row;
    });
    return columns === null || columns === void 0 ? void 0 : (_columns$plots = columns.plots) === null || _columns$plots === void 0 ? void 0 : _columns$plots.filter(function (plot) {
      return (plot === null || plot === void 0 ? void 0 : plot.name) !== 'TankCapacity';
    }).map(function (plot) {
      return {
        Header: renderHeader(plot),
        accessor: accessData(plot),
        id: plot === null || plot === void 0 ? void 0 : plot.name.replaceAll(".", " "),
        symbol: plot === null || plot === void 0 ? void 0 : plot.symbol,
        sortType: sortRows,
        Cell: function Cell(args) {
          var _response$responseDat9, _response$responseDat10;

          var cellValue = args.value,
              column = args.column,
              row = args.row;

          if (typeof cellValue === "object") {
            return /*#__PURE__*/React__default.createElement(InsightView, {
              insight: cellValue === null || cellValue === void 0 ? void 0 : cellValue.insight,
              rowValue: cellValue === null || cellValue === void 0 ? void 0 : cellValue.value
            });
          }

          var filter = response === null || response === void 0 ? void 0 : (_response$responseDat9 = response.responseData) === null || _response$responseDat9 === void 0 ? void 0 : _response$responseDat9.filter.find(function (elem) {
            return elem.column === column.id;
          });

          if ((response === null || response === void 0 ? void 0 : (_response$responseDat10 = response.responseData) === null || _response$responseDat10 === void 0 ? void 0 : _response$responseDat10.drillDownChartId) !== "none" && filter !== undefined) {
            return /*#__PURE__*/React__default.createElement("span", {
              style: {
                color: "#F47738",
                cursor: "pointer"
              },
              onClick: function onClick() {
                return getDrilldownCharts(cellValue, filter === null || filter === void 0 ? void 0 : filter.key, t("DSS_HEADER_" + (plot === null || plot === void 0 ? void 0 : plot.name.toUpperCase())));
              }
            }, t(cellValue));
          }

          if (column.id === "CitizenAverageRating") {
            return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Rating, {
              id: row.id,
              currentRating: Math.round(cellValue * 10) / 10,
              styles: {
                width: "unset",
                marginBottom: 0
              },
              starStyles: {
                width: "25px"
              }
            });
          }

          return String(t(cellValue));
        }
      };
    });
  }, [response, value === null || value === void 0 ? void 0 : value.denomination, value === null || value === void 0 ? void 0 : value.range]);

  var convertDenomination = function convertDenomination(val) {
    var denomination = value.denomination;

    switch (denomination) {
      case "Unit":
        return val;

      case "Lac":
        return Number((val / 100000).toFixed(2));

      case "Cr":
        return Number((val / 10000000).toFixed(2));
    }
  };

  var removeULB = function removeULB(id) {
    var _nextState;

    var nextState = filterStack.filter(function (filter, index) {
      return index < id;
    });
    setFilterStack(nextState);
    setChartKey((_nextState = nextState[nextState.length - 1]) === null || _nextState === void 0 ? void 0 : _nextState.id);
  };

  if (isLoading || isRequestLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  if (!tableColumns || !tableData) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "no-data"
    }, /*#__PURE__*/React__default.createElement("p", null, t("DSS_NO_DATA")));
  }

  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "100%",
      overflowX: "auto"
    }
  }, filterStack.length > 1 && /*#__PURE__*/React__default.createElement("div", {
    className: "tag-container"
  }, /*#__PURE__*/React__default.createElement("span", {
    style: {
      marginTop: "20px"
    }
  }, t("DSS_FILTERS_APPLIED"), ": "), filterStack.map(function (filter, id) {
    return id > 0 ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.RemoveableTag, {
      key: id,
      text: (filter === null || filter === void 0 ? void 0 : filter.label) + ": " + t(filter === null || filter === void 0 ? void 0 : filter.name),
      onClick: function onClick() {
        return removeULB(id);
      }
    }) : null;
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Table, {
    className: "customTable",
    t: t,
    disableSort: false,
    autoSort: true,
    manualPagination: false,
    globalSearch: filterValue,
    initSortId: "S N ",
    onSearch: onSearch,
    data: tableData,
    totalRecords: tableData === null || tableData === void 0 ? void 0 : tableData.length,
    columns: tableColumns,
    getCellProps: function getCellProps(cellInfo) {
      return {
        style: {}
      };
    }
  }));
};

var SearchImg = function SearchImg() {
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.SearchIconSvg, {
    className: "signature-img"
  });
};

var GenericChart = function GenericChart(_ref) {
  var header = _ref.header,
      subHeader = _ref.subHeader,
      className = _ref.className,
      caption = _ref.caption,
      children = _ref.children,
      _ref$showHeader = _ref.showHeader,
      showHeader = _ref$showHeader === void 0 ? true : _ref$showHeader,
      _ref$showSearch = _ref.showSearch,
      showSearch = _ref$showSearch === void 0 ? false : _ref$showSearch,
      _ref$showDownload = _ref.showDownload,
      showDownload = _ref$showDownload === void 0 ? false : _ref$showDownload,
      onChange = _ref.onChange;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useState = React.useState(null),
      chartData = _useState[0],
      setChartData = _useState[1];

  var chart = React.useRef();
  var menuItems = [{
    code: "image",
    i18nKey: t("ES_COMMON_DOWNLOAD_IMAGE"),
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.DownloadIcon, null)
  }, {
    code: "shareImage",
    i18nKey: t("ES_DSS_SHARE_IMAGE"),
    target: "mail",
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.EmailIcon, null)
  }, {
    code: "shareImage",
    i18nKey: t("ES_DSS_SHARE_IMAGE"),
    target: "whatsapp",
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.WhatsappIcon, null)
  }];

  function download(data) {
    setTimeout(function () {
      switch (data.code) {
        case "pdf":
          return Digit.Download.PDF(chart, t(header));

        case "image":
          return Digit.Download.Image(chart, t(header));

        case "sharePdf":
          return Digit.ShareFiles.PDF(tenantId, chart, t(header), data.target);

        case "shareImage":
          return Digit.ShareFiles.Image(tenantId, chart, t(header), data.target);
      }
    }, 500);
  }

  var handleExcelDownload = function handleExcelDownload() {
    return Digit.Download.Excel(chartData, t(header));
  };

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    className: "chart-item " + className,
    ReactRef: chart
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "chartHeader " + (showSearch && "column-direction")
  }, /*#__PURE__*/React__default.createElement("div", null, showHeader && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    style: {
      fontWeight: "bold"
    }
  }, "" + t(header)), subHeader && /*#__PURE__*/React__default.createElement("p", {
    style: {
      color: "#505A5F",
      fontWeight: 700
    }
  }, subHeader)), /*#__PURE__*/React__default.createElement("div", {
    className: "sideContent"
  }, showSearch && /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, {
    className: "searchInput",
    placeholder: "Search",
    signature: true,
    signatureImg: /*#__PURE__*/React__default.createElement(SearchImg, null),
    onChange: onChange
  }), showDownload && /*#__PURE__*/React__default.createElement(digitUiReactComponents.DownloadIcon, {
    className: "mrlg cursorPointer",
    onClick: handleExcelDownload
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.EllipsisMenu, {
    menuItems: menuItems,
    displayKey: "i18nKey",
    onSelect: function onSelect(data) {
      return download(data);
    }
  }))), caption && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardCaption, null, caption), React__default.cloneElement(children, {
    setChartData: setChartData
  }));
};

var MetricData = function MetricData(_ref) {
  var _data$insight;

  var t = _ref.t,
      data = _ref.data,
      code = _ref.code;

  var _useContext = React.useContext(FilterContext),
      value = _useContext.value;

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("p", {
    className: "heading-m",
    style: {
      textAlign: "right",
      paddingTop: "0px"
    }
  }, code === "citizenAvgRating" ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Rating, {
    currentRating: Math.round((data === null || data === void 0 ? void 0 : data.headerValue) * 10) / 10,
    styles: {
      width: "unset"
    },
    starStyles: {
      width: "25px"
    }
  }) : Digit.Utils.dss.formatter(data === null || data === void 0 ? void 0 : data.headerValue, data === null || data === void 0 ? void 0 : data.headerSymbol, value === null || value === void 0 ? void 0 : value.denomination, true) + " " + (code === "totalSludgeTreated" ? t("DSS_KL") : "")), (data === null || data === void 0 ? void 0 : data.insight) && /*#__PURE__*/React__default.createElement("div", null, (data === null || data === void 0 ? void 0 : (_data$insight = data.insight) === null || _data$insight === void 0 ? void 0 : _data$insight.indicator) === "upper_green" ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.UpwardArrow, {
    marginRight: 9
  }) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.DownwardArrow, {
    marginRight: 9
  }), /*#__PURE__*/React__default.createElement("p", {
    className: "" + (data === null || data === void 0 ? void 0 : data.insight.colorCode)
  }, data === null || data === void 0 ? void 0 : data.insight.value.replace(/[+-]/g, ""))));
};

var MetricChartRow = function MetricChartRow(_ref2) {
  var _value$range, _value$range$startDat, _value$range2, _value$range2$endDate, _response$responseDat, _response$responseDat2, _response$responseDat3;

  var data = _ref2.data;
  var id = data.id,
      chartType = data.chartType;
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useContext2 = React.useContext(FilterContext),
      value = _useContext2.value;

  var _Digit$Hooks$dss$useG = Digit.Hooks.dss.useGetChart({
    key: id,
    type: chartType,
    tenantId: tenantId,
    requestDate: _extends({}, value === null || value === void 0 ? void 0 : value.requestDate, {
      startDate: value === null || value === void 0 ? void 0 : (_value$range = value.range) === null || _value$range === void 0 ? void 0 : (_value$range$startDat = _value$range.startDate) === null || _value$range$startDat === void 0 ? void 0 : _value$range$startDat.getTime(),
      endDate: value === null || value === void 0 ? void 0 : (_value$range2 = value.range) === null || _value$range2 === void 0 ? void 0 : (_value$range2$endDate = _value$range2.endDate) === null || _value$range2$endDate === void 0 ? void 0 : _value$range2$endDate.getTime()
    }),
    filters: value === null || value === void 0 ? void 0 : value.filters
  }),
      isLoading = _Digit$Hooks$dss$useG.isLoading,
      response = _Digit$Hooks$dss$useG.data;

  if (isLoading) {
    return false;
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React__default.createElement("div", null, t(data.name)), /*#__PURE__*/React__default.createElement(MetricData, {
    t: t,
    data: response === null || response === void 0 ? void 0 : (_response$responseDat = response.responseData) === null || _response$responseDat === void 0 ? void 0 : (_response$responseDat2 = _response$responseDat.data) === null || _response$responseDat2 === void 0 ? void 0 : _response$responseDat2[0],
    code: response === null || response === void 0 ? void 0 : (_response$responseDat3 = response.responseData) === null || _response$responseDat3 === void 0 ? void 0 : _response$responseDat3.visualizationCode
  }));
};

var MetricChart = function MetricChart(_ref3) {
  var data = _ref3.data;
  var charts = data.charts;
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, charts.map(function (chart, index) {
    return /*#__PURE__*/React__default.createElement(MetricChartRow, {
      data: chart,
      key: index
    });
  }));
};

var Chart = function Chart(_ref) {
  var _response$responseDat, _response$responseDat2, _response$responseDat3;

  var data = _ref.data;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var id = data.id,
      chartType = data.chartType;
  var requestDate = {
    startDate: getTime(startOfMonth(new Date())),
    endDate: getTime(endOfMonth(new Date())),
    interval: "month",
    title: ""
  };

  var _Digit$Hooks$dss$useG = Digit.Hooks.dss.useGetChart({
    key: id,
    type: chartType,
    tenantId: tenantId,
    requestDate: requestDate
  }),
      isLoading = _Digit$Hooks$dss$useG.isLoading,
      response = _Digit$Hooks$dss$useG.data;

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "blocks"
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("p", null, t(data === null || data === void 0 ? void 0 : data.name)), /*#__PURE__*/React__default.createElement("p", null, response === null || response === void 0 ? void 0 : (_response$responseDat = response.responseData) === null || _response$responseDat === void 0 ? void 0 : (_response$responseDat2 = _response$responseDat.data) === null || _response$responseDat2 === void 0 ? void 0 : (_response$responseDat3 = _response$responseDat2[0]) === null || _response$responseDat3 === void 0 ? void 0 : _response$responseDat3.headerValue)));
};

var Summary = function Summary(_ref2) {
  var data = _ref2.data;

  var _useTranslation2 = reactI18next.useTranslation(),
      t = _useTranslation2.t;

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    style: {
      flexBasis: "100%"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "summary-wrapper"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Poll, null), /*#__PURE__*/React__default.createElement("div", {
    className: "wrapper-child"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "blocks"
  }, /*#__PURE__*/React__default.createElement("p", null, t(data === null || data === void 0 ? void 0 : data.name))), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex"
    }
  }, data.charts.map(function (chart, key) {
    return /*#__PURE__*/React__default.createElement(Chart, {
      data: chart,
      key: key
    });
  }))), /*#__PURE__*/React__default.createElement("div", {
    className: "wrapper-child"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "blocks cell-text",
    style: {
      justifyContent: "space-around"
    }
  }, /*#__PURE__*/React__default.createElement("p", {
    style: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Details, null), /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: "/digit-ui/employee/dss/dashboard"
  }, "View Details")), /*#__PURE__*/React__default.createElement("p", {
    style: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrintIcon, null), "Print")))));
};

var index = 1;

var Layout = function Layout(_ref) {
  var rowData = _ref.rowData;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useContext = React.useContext(FilterContext),
      value = _useContext.value;

  var _useState = React.useState(""),
      searchQuery = _useState[0],
      onSearch = _useState[1];

  var renderChart = function renderChart(chart, title) {
    switch (chart.chartType) {
      case "table":
        return /*#__PURE__*/React__default.createElement(CustomTable, {
          data: chart,
          onSearch: searchQuery,
          title: title
        });

      case "donut":
        return /*#__PURE__*/React__default.createElement(CustomPieChart, {
          data: chart,
          title: title
        });

      case "line":
        return /*#__PURE__*/React__default.createElement(CustomAreaChart, {
          data: chart,
          title: title
        });

      case "horizontalBar":
        return /*#__PURE__*/React__default.createElement(CustomHorizontalBarChart, {
          data: chart,
          xAxisType: "number",
          yAxisType: "category",
          layout: "vertical",
          yDataKey: "name",
          xDataKey: "",
          showDrillDown: true,
          title: title
        });

      case "bar":
        return /*#__PURE__*/React__default.createElement(CustomHorizontalBarChart, {
          data: chart,
          title: title,
          yAxisLabel: t("DSS_WASTE_RECIEVED") + " " + t("DSS_WASTE_UNIT")
        });
    }
  };

  var renderVisualizer = function renderVisualizer(visualizer, key) {
    var _value$filters, _value$filters$tenant, _visualizer$charts, _visualizer$charts2, _visualizer$charts3, _visualizer$charts4, _visualizer$charts5, _visualizer$charts6, _value$filters2, _value$filters2$tenan, _visualizer$charts7, _visualizer$charts8, _visualizer$charts9, _React$createElement;

    switch (visualizer.vizType) {
      case "metric-collection":
        return /*#__PURE__*/React__default.createElement(GenericChart, {
          header: visualizer.name,
          className: "metricsTable",
          key: key
        }, /*#__PURE__*/React__default.createElement(MetricChart, {
          data: visualizer
        }));

      case "chart":
        if ((value === null || value === void 0 ? void 0 : (_value$filters = value.filters) === null || _value$filters === void 0 ? void 0 : (_value$filters$tenant = _value$filters.tenantId) === null || _value$filters$tenant === void 0 ? void 0 : _value$filters$tenant.length) === 0 && ((visualizer === null || visualizer === void 0 ? void 0 : (_visualizer$charts = visualizer.charts) === null || _visualizer$charts === void 0 ? void 0 : _visualizer$charts[0].id) === "fsmTopDsoByPerformance" || (visualizer === null || visualizer === void 0 ? void 0 : (_visualizer$charts2 = visualizer.charts) === null || _visualizer$charts2 === void 0 ? void 0 : _visualizer$charts2[0].id) === "fsmBottomDsoByPerformance")) return null;
        return /*#__PURE__*/React__default.createElement(GenericChart, {
          key: key,
          header: visualizer.name,
          showDownload: (visualizer === null || visualizer === void 0 ? void 0 : (_visualizer$charts3 = visualizer.charts) === null || _visualizer$charts3 === void 0 ? void 0 : _visualizer$charts3[0].chartType) === "table",
          showSearch: (visualizer === null || visualizer === void 0 ? void 0 : (_visualizer$charts4 = visualizer.charts) === null || _visualizer$charts4 === void 0 ? void 0 : _visualizer$charts4[0].chartType) === "table",
          className: (visualizer === null || visualizer === void 0 ? void 0 : (_visualizer$charts5 = visualizer.charts) === null || _visualizer$charts5 === void 0 ? void 0 : _visualizer$charts5[0].chartType) === "table" && "fullWidth",
          onChange: function onChange(e) {
            return onSearch(e.target.value);
          }
        }, renderChart(visualizer === null || visualizer === void 0 ? void 0 : (_visualizer$charts6 = visualizer.charts) === null || _visualizer$charts6 === void 0 ? void 0 : _visualizer$charts6[0], visualizer.name));

      case "performing-metric":
        if ((value === null || value === void 0 ? void 0 : (_value$filters2 = value.filters) === null || _value$filters2 === void 0 ? void 0 : (_value$filters2$tenan = _value$filters2.tenantId) === null || _value$filters2$tenan === void 0 ? void 0 : _value$filters2$tenan.length) > 0 && ((visualizer === null || visualizer === void 0 ? void 0 : (_visualizer$charts7 = visualizer.charts) === null || _visualizer$charts7 === void 0 ? void 0 : _visualizer$charts7[0].id) === "fsmTopUlbByPerformance" || (visualizer === null || visualizer === void 0 ? void 0 : (_visualizer$charts8 = visualizer.charts) === null || _visualizer$charts8 === void 0 ? void 0 : _visualizer$charts8[0].id) === "fsmBottomUlbByPerformance")) return null;
        return /*#__PURE__*/React__default.createElement(GenericChart, {
          header: visualizer.name,
          subHeader: "(" + t("DSS_SLA_ACHIEVED") + ")",
          key: key
        }, /*#__PURE__*/React__default.createElement(CustomBarChart, {
          data: visualizer === null || visualizer === void 0 ? void 0 : (_visualizer$charts9 = visualizer.charts) === null || _visualizer$charts9 === void 0 ? void 0 : _visualizer$charts9[0],
          fillColor: index++ % 2 ? "#00703C" : "#D4351C",
          title: visualizer.name,
          showDrillDown: true
        }));

      case "collection":
      case "module":
        return /*#__PURE__*/React__default.createElement(Summary, (_React$createElement = {
          key: key,
          ttile: visualizer.name,
          data: visualizer
        }, _React$createElement["key"] = key, _React$createElement));
    }
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: "chart-row"
  }, rowData.vizArray.map(function (chart, key) {
    return renderVisualizer(chart, key);
  }));
};

var key = 'DSS_FILTERS';

var getInitialRange = function getInitialRange() {
  var _data$range, _data$range2, _data$range3, _data$range4, _data$filters;

  var data = Digit.SessionStorage.get(key);
  var startDate = data !== null && data !== void 0 && (_data$range = data.range) !== null && _data$range !== void 0 && _data$range.startDate ? new Date(data === null || data === void 0 ? void 0 : (_data$range2 = data.range) === null || _data$range2 === void 0 ? void 0 : _data$range2.startDate) : addMonths(startOfYear(new Date()), 3);
  var endDate = data !== null && data !== void 0 && (_data$range3 = data.range) !== null && _data$range3 !== void 0 && _data$range3.endDate ? new Date(data === null || data === void 0 ? void 0 : (_data$range4 = data.range) === null || _data$range4 === void 0 ? void 0 : _data$range4.endDate) : endOfToday();
  var title = format(startDate, "MMM d, yyyy") + " - " + format(endDate, "MMM d, yyyy");
  var duration = Digit.Utils.dss.getDuration(startDate, endDate);
  var denomination = (data === null || data === void 0 ? void 0 : data.denomination) || "Unit";
  var tenantId = (data === null || data === void 0 ? void 0 : (_data$filters = data.filters) === null || _data$filters === void 0 ? void 0 : _data$filters.tenantId) || [];
  return {
    startDate: startDate,
    endDate: endDate,
    title: title,
    duration: duration,
    denomination: denomination,
    tenantId: tenantId
  };
};

var DashBoard = function DashBoard(_ref) {
  var _dashboardConfig$8, _filters$filters2, _filters$filters3, _filters$filters3$ten, _dashboardConfig$9;

  var stateCode = _ref.stateCode;
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useState = React.useState(function () {
    var _getInitialRange = getInitialRange(),
        startDate = _getInitialRange.startDate,
        endDate = _getInitialRange.endDate,
        title = _getInitialRange.title,
        duration = _getInitialRange.duration,
        denomination = _getInitialRange.denomination,
        tenantId = _getInitialRange.tenantId;

    return {
      denomination: denomination,
      range: {
        startDate: startDate,
        endDate: endDate,
        title: title,
        duration: duration
      },
      requestDate: {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        interval: duration,
        title: title
      },
      filters: {
        tenantId: tenantId
      }
    };
  }),
      filters = _useState[0],
      setFilters = _useState[1];

  var _useState2 = React.useState(false),
      isFilterModalOpen = _useState2[0],
      setIsFilterModalOpen = _useState2[1];

  var _useParams = reactRouterDom.useParams(),
      moduleCode = _useParams.moduleCode;

  var language = Digit.StoreData.getCurrentLanguage();

  var _Digit$Services$useSt = Digit.Services.useStore({
    stateCode: stateCode,
    moduleCode: moduleCode,
    language: language
  }),
      localizationLoading = _Digit$Services$useSt.isLoading;

  var _Digit$Hooks$dss$useM = Digit.Hooks.dss.useMDMS(stateCode, "dss-dashboard", "DssDashboard");

  var _Digit$Hooks$dss$useD = Digit.Hooks.dss.useDashboardConfig(moduleCode),
      response = _Digit$Hooks$dss$useD.data,
      isLoading = _Digit$Hooks$dss$useD.isLoading;

  var _Digit$Hooks$useModul = Digit.Hooks.useModuleTenants("FSM"),
      ulbTenants = _Digit$Hooks$useModul.data,
      isUlbLoading = _Digit$Hooks$useModul.isLoading;

  var _Digit$Hooks$useCommo = Digit.Hooks.useCommonMDMS(stateCode, "FSM", "FSTPPlantInfo"),
      isMdmsLoading = _Digit$Hooks$useCommo.isLoading,
      mdmsData = _Digit$Hooks$useCommo.data;

  var _useState3 = React.useState(false),
      showOptions = _useState3[0],
      setShowOptions = _useState3[1];

  var handleFilters = function handleFilters(data) {
    Digit.SessionStorage.set(key, data);
    setFilters(data);
  };

  var fullPageRef = React.useRef();
  var provided = React.useMemo(function () {
    return {
      value: filters,
      setValue: handleFilters,
      ulbTenants: ulbTenants,
      fstpMdmsData: mdmsData
    };
  }, [filters, isUlbLoading, isMdmsLoading]);

  var handlePrint = function handlePrint() {
    var _dashboardConfig$;

    return Digit.Download.PDF(fullPageRef, t(dashboardConfig === null || dashboardConfig === void 0 ? void 0 : (_dashboardConfig$ = dashboardConfig[0]) === null || _dashboardConfig$ === void 0 ? void 0 : _dashboardConfig$.name));
  };

  var removeULB = function removeULB(id) {
    var _filters$filters;

    handleFilters(_extends({}, filters, {
      filters: _extends({}, filters === null || filters === void 0 ? void 0 : filters.filters, {
        tenantId: [].concat(filters === null || filters === void 0 ? void 0 : (_filters$filters = filters.filters) === null || _filters$filters === void 0 ? void 0 : _filters$filters.tenantId).filter(function (tenant, index) {
          return index !== id;
        })
      })
    }));
  };

  var handleClear = function handleClear() {
    handleFilters(_extends({}, filters, {
      filters: _extends({}, filters === null || filters === void 0 ? void 0 : filters.filters, {
        tenantId: []
      })
    }));
  };

  var dashboardConfig = response === null || response === void 0 ? void 0 : response.responseData;
  var shareOptions = navigator.share ? [{
    label: t("ES_DSS_SHARE_PDF"),
    onClick: function onClick() {
      setShowOptions(!showOptions);
      setTimeout(function () {
        var _dashboardConfig$2;

        Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig === null || dashboardConfig === void 0 ? void 0 : (_dashboardConfig$2 = dashboardConfig[0]) === null || _dashboardConfig$2 === void 0 ? void 0 : _dashboardConfig$2.name));
      }, 500);
    }
  }, {
    label: t("ES_DSS_SHARE_IMAGE"),
    onClick: function onClick() {
      setShowOptions(!showOptions);
      setTimeout(function () {
        var _dashboardConfig$3;

        Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig === null || dashboardConfig === void 0 ? void 0 : (_dashboardConfig$3 = dashboardConfig[0]) === null || _dashboardConfig$3 === void 0 ? void 0 : _dashboardConfig$3.name));
      }, 500);
    }
  }] : [{
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.EmailIcon, null),
    label: t("ES_DSS_SHARE_PDF"),
    onClick: function onClick() {
      setShowOptions(!showOptions);
      setTimeout(function () {
        var _dashboardConfig$4;

        Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig === null || dashboardConfig === void 0 ? void 0 : (_dashboardConfig$4 = dashboardConfig[0]) === null || _dashboardConfig$4 === void 0 ? void 0 : _dashboardConfig$4.name), "mail");
      }, 500);
    }
  }, {
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.WhatsappIcon, null),
    label: t("ES_DSS_SHARE_PDF"),
    onClick: function onClick() {
      setShowOptions(!showOptions);
      setTimeout(function () {
        var _dashboardConfig$5;

        Digit.ShareFiles.PDF(tenantId, fullPageRef, t(dashboardConfig === null || dashboardConfig === void 0 ? void 0 : (_dashboardConfig$5 = dashboardConfig[0]) === null || _dashboardConfig$5 === void 0 ? void 0 : _dashboardConfig$5.name), "whatsapp");
      }, 500);
    }
  }, {
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.EmailIcon, null),
    label: t("ES_DSS_SHARE_IMAGE"),
    onClick: function onClick() {
      setShowOptions(!showOptions);
      setTimeout(function () {
        var _dashboardConfig$6;

        Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig === null || dashboardConfig === void 0 ? void 0 : (_dashboardConfig$6 = dashboardConfig[0]) === null || _dashboardConfig$6 === void 0 ? void 0 : _dashboardConfig$6.name), "mail");
      }, 500);
    }
  }, {
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.WhatsappIcon, null),
    label: t("ES_DSS_SHARE_IMAGE"),
    onClick: function onClick() {
      setShowOptions(!showOptions);
      setTimeout(function () {
        var _dashboardConfig$7;

        Digit.ShareFiles.Image(tenantId, fullPageRef, t(dashboardConfig === null || dashboardConfig === void 0 ? void 0 : (_dashboardConfig$7 = dashboardConfig[0]) === null || _dashboardConfig$7 === void 0 ? void 0 : _dashboardConfig$7.name), "whatsapp");
      }, 500);
    }
  }];

  if (isLoading || isUlbLoading || localizationLoading || isMdmsLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(FilterContext.Provider, {
    value: provided
  }, /*#__PURE__*/React__default.createElement("div", {
    ref: fullPageRef
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "options"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, {
    styles: {
      marginBottom: "0px"
    }
  }, t(dashboardConfig === null || dashboardConfig === void 0 ? void 0 : (_dashboardConfig$8 = dashboardConfig[0]) === null || _dashboardConfig$8 === void 0 ? void 0 : _dashboardConfig$8.name)), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "mrlg"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.MultiLink, {
    className: "multilink-block-wrapper",
    label: t("ES_DSS_SHARE"),
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.ShareIcon, {
      className: "mrsm"
    }),
    showOptions: function showOptions(e) {
      return setShowOptions(e);
    },
    onHeadClick: function onHeadClick(e) {
      return setShowOptions(e !== undefined ? e : !showOptions);
    },
    displayOptions: showOptions,
    options: shareOptions
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "mrsm",
    onClick: handlePrint
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.DownloadIcon, {
    className: "mrsm"
  }), t("ES_DSS_DOWNLOAD")))), /*#__PURE__*/React__default.createElement(Filters, {
    t: t,
    ulbTenants: ulbTenants,
    isOpen: isFilterModalOpen,
    closeFilters: function closeFilters() {
      return setIsFilterModalOpen(false);
    }
  }), (filters === null || filters === void 0 ? void 0 : (_filters$filters2 = filters.filters) === null || _filters$filters2 === void 0 ? void 0 : _filters$filters2.tenantId.length) > 0 && /*#__PURE__*/React__default.createElement("div", {
    className: "tag-container"
  }, filters === null || filters === void 0 ? void 0 : (_filters$filters3 = filters.filters) === null || _filters$filters3 === void 0 ? void 0 : (_filters$filters3$ten = _filters$filters3.tenantId) === null || _filters$filters3$ten === void 0 ? void 0 : _filters$filters3$ten.map(function (filter, id) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.RemoveableTag, {
      key: id,
      text: t("DSS_HEADER_ULB") + ": " + t(filter),
      onClick: function onClick() {
        return removeULB(id);
      }
    });
  }), /*#__PURE__*/React__default.createElement("p", {
    className: "clearText cursorPointer",
    onClick: handleClear
  }, t("DSS_FILTER_CLEAR"))), /*#__PURE__*/React__default.createElement("div", {
    className: "options-m"
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.FilterIcon, {
    onClick: function onClick() {
      return setIsFilterModalOpen(!isFilterModalOpen);
    },
    style: true
  })), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.MultiLink, {
    className: "multilink-block-wrapper",
    label: t("ES_DSS_SHARE"),
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.ShareIcon, {
      className: "mrsm"
    }),
    showOptions: function showOptions(e) {
      return setShowOptions(e);
    },
    onHeadClick: function onHeadClick(e) {
      return setShowOptions(e !== undefined ? e : !showOptions);
    },
    displayOptions: showOptions,
    options: shareOptions
  })), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.DownloadIcon, null), t("ES_DSS_DOWNLOAD"))), dashboardConfig === null || dashboardConfig === void 0 ? void 0 : (_dashboardConfig$9 = dashboardConfig[0]) === null || _dashboardConfig$9 === void 0 ? void 0 : _dashboardConfig$9.visualizations.map(function (row, key) {
    return /*#__PURE__*/React__default.createElement(Layout, {
      rowData: row,
      key: key
    });
  })));
};

var DSSCard = function DSSCard() {
  var _useTranslation = reactI18next.useTranslation();

  var ADMIN = Digit.UserService.hasAccess("FSM_ADMIN") || Digit.UserService.hasAccess("EMPLOYEE ADMIN") || false;
  return /*#__PURE__*/React__default.createElement(React.Fragment, null,  null);
};

var key$1 = 'DSS_FILTERS';

var getInitialRange$1 = function getInitialRange() {
  var _data$range, _data$range2, _data$range3, _data$range4, _data$filters;

  var data = Digit.SessionStorage.get(key$1);
  var startDate = data !== null && data !== void 0 && (_data$range = data.range) !== null && _data$range !== void 0 && _data$range.startDate ? new Date(data === null || data === void 0 ? void 0 : (_data$range2 = data.range) === null || _data$range2 === void 0 ? void 0 : _data$range2.startDate) : addMonths(startOfYear(new Date()), 3);
  var endDate = data !== null && data !== void 0 && (_data$range3 = data.range) !== null && _data$range3 !== void 0 && _data$range3.endDate ? new Date(data === null || data === void 0 ? void 0 : (_data$range4 = data.range) === null || _data$range4 === void 0 ? void 0 : _data$range4.endDate) : addMonths(endOfYear(new Date()), 3);
  var title = format(startDate, "MMM d, yyyy") + " - " + format(endDate, "MMM d, yyyy");
  var duration = Digit.Utils.dss.getDuration(startDate, endDate);
  var denomination = (data === null || data === void 0 ? void 0 : data.denomination) || "Unit";
  var tenantId = (data === null || data === void 0 ? void 0 : (_data$filters = data.filters) === null || _data$filters === void 0 ? void 0 : _data$filters.tenantId) || [];
  return {
    startDate: startDate,
    endDate: endDate,
    title: title,
    duration: duration,
    denomination: denomination,
    tenantId: tenantId
  };
};

var DrillDown = function DrillDown() {
  var _filters$filters2, _filters$filters3, _filters$filters3$ten;

  var _useState = React.useState(""),
      searchQuery = _useState[0],
      onSearch = _useState[1];

  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
      chart = _Digit$Hooks$useQuery.chart,
      title = _Digit$Hooks$useQuery.title;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useState2 = React.useState(function () {
    var _getInitialRange = getInitialRange$1(),
        startDate = _getInitialRange.startDate,
        endDate = _getInitialRange.endDate,
        title = _getInitialRange.title,
        duration = _getInitialRange.duration,
        tenantId = _getInitialRange.tenantId;

    return {
      range: {
        startDate: startDate,
        endDate: endDate,
        title: title,
        duration: duration
      },
      requestDate: {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        interval: duration,
        title: title
      },
      filters: {
        tenantId: tenantId
      }
    };
  }),
      filters = _useState2[0],
      setFilters = _useState2[1];

  var handleFilters = function handleFilters(data) {
    Digit.SessionStorage.set(key$1, data);
    setFilters(data);
  };

  var _Digit$Hooks$useModul = Digit.Hooks.useModuleTenants("FSM"),
      ulbTenants = _Digit$Hooks$useModul.data,
      isUlbLoading = _Digit$Hooks$useModul.isLoading;

  var provided = React.useMemo(function () {
    return {
      value: filters,
      setValue: handleFilters
    };
  }, [filters]);

  var removeULB = function removeULB(id) {
    var _filters$filters;

    handleFilters(_extends({}, filters, {
      filters: _extends({}, filters === null || filters === void 0 ? void 0 : filters.filters, {
        tenantId: [].concat(filters === null || filters === void 0 ? void 0 : (_filters$filters = filters.filters) === null || _filters$filters === void 0 ? void 0 : _filters$filters.tenantId).filter(function (tenant, index) {
          return index !== id;
        })
      })
    }));
  };

  var handleClear = function handleClear() {
    handleFilters(_extends({}, filters, {
      filters: _extends({}, filters === null || filters === void 0 ? void 0 : filters.filters, {
        tenantId: []
      })
    }));
  };

  if (isUlbLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(FilterContext.Provider, {
    value: provided
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, null, t(title)), /*#__PURE__*/React__default.createElement(Filters, {
    t: t,
    ulbTenants: ulbTenants,
    showDenomination: false,
    showDDR: false
  }), (filters === null || filters === void 0 ? void 0 : (_filters$filters2 = filters.filters) === null || _filters$filters2 === void 0 ? void 0 : _filters$filters2.tenantId.length) > 0 && /*#__PURE__*/React__default.createElement("div", {
    className: "tag-container"
  }, filters === null || filters === void 0 ? void 0 : (_filters$filters3 = filters.filters) === null || _filters$filters3 === void 0 ? void 0 : (_filters$filters3$ten = _filters$filters3.tenantId) === null || _filters$filters3$ten === void 0 ? void 0 : _filters$filters3$ten.map(function (filter, id) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.RemoveableTag, {
      key: id,
      text: t("DSS_HEADER_ULB") + ": " + t(filter),
      onClick: function onClick() {
        return removeULB(id);
      }
    });
  }), /*#__PURE__*/React__default.createElement("p", {
    className: "clearText cursorPointer",
    onClick: handleClear
  }, t("DSS_FILTER_CLEAR"))), /*#__PURE__*/React__default.createElement(GenericChart, {
    header: title,
    showDownload: true,
    showSearch: true,
    className: "fullWidth",
    onChange: function onChange(e) {
      return onSearch(e.target.value);
    },
    showHeader: false
  }, /*#__PURE__*/React__default.createElement(CustomTable, {
    data: {
      id: chart
    },
    onSearch: searchQuery
  })));
};

var DssBreadCrumb = function DssBreadCrumb(_ref) {
  var location = _ref.location;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var crumbs = [{
    path: "/digit-ui/employee",
    content: t("ES_COMMON_HOME"),
    show: true
  }, {
    path: "/digit-ui/employee/dss/dashboard/fsm",
    content: t("ES_COMMON_DSS"),
    show: true
  }, {
    path: "/digit-ui/employee/dss/drilldown",
    content: t("ES_COMMON_DSS_DRILL"),
    show: location.pathname.includes("drilldown") ? true : false
  }];
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.BreadCrumb, {
    crumbs: crumbs
  });
};

var Routes = function Routes(_ref2) {
  var path = _ref2.path,
      stateCode = _ref2.stateCode;
  var location = reactRouterDom.useLocation();
  return /*#__PURE__*/React__default.createElement("div", {
    className: "chart-wrapper"
  }, /*#__PURE__*/React__default.createElement(DssBreadCrumb, {
    location: location
  }), /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/dashboard/:moduleCode",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(DashBoard, {
        stateCode: stateCode
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/drilldown",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(DrillDown, null);
    }
  })));
};

var DSSModule = function DSSModule(_ref3) {
  var stateCode = _ref3.stateCode,
      userType = _ref3.userType,
      tenants = _ref3.tenants;
  var moduleCode = "DSS";

  var _useRouteMatch = reactRouterDom.useRouteMatch(),
      path = _useRouteMatch.path;

  var language = Digit.StoreData.getCurrentLanguage();

  var _Digit$Services$useSt = Digit.Services.useStore({
    stateCode: stateCode,
    moduleCode: moduleCode,
    language: language
  }),
      isLoading = _Digit$Services$useSt.isLoading;

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  Digit.SessionStorage.set("DSS_TENANTS", tenants);

  if (userType !== "citizen") {
    return /*#__PURE__*/React__default.createElement(Routes, {
      path: path,
      stateCode: stateCode
    });
  }
};

var componentsToRegister = {
  DSSModule: DSSModule,
  DSSCard: DSSCard
};
var initDSSComponents = function initDSSComponents() {
  Object.entries(componentsToRegister).forEach(function (_ref4) {
    var key = _ref4[0],
        value = _ref4[1];
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

exports.initDSSComponents = initDSSComponents;
//# sourceMappingURL=index.js.map
