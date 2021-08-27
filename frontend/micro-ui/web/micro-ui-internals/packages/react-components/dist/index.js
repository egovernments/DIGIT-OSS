function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactRouterDom = require('react-router-dom');
var reactI18next = require('react-i18next');
var jsApiLoader = require('@googlemaps/js-api-loader');
var reactTable = require('react-table');
var reactHookForm = require('react-hook-form');

var ActionBar = function ActionBar(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "action-bar-wrap " + props.className,
    style: props.style
  }, props.children);
};

var ActionLinks = function ActionLinks(props) {
  return /*#__PURE__*/React__default.createElement("span", {
    className: "action-link"
  }, props.children);
};

var AppContainer = function AppContainer(props) {
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "app-container",
    style: props.style
  }, props.children));
};

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

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var ApplyFilterBar = function ApplyFilterBar(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React__default.createElement("button", {
    type: props.submit ? "submit" : "button",
    style: _extends({}, props.style),
    className: "button-clear",
    onClick: props.onClear
  }, /*#__PURE__*/React__default.createElement("header", null, props.labelLink)), /*#__PURE__*/React__default.createElement("button", {
    className: "submit-bar",
    type: props.submit ? "submit" : "button",
    style: _extends({}, props.style),
    onClick: props.onSubmit
  }, /*#__PURE__*/React__default.createElement("header", null, props.buttonLink)));
};

var ArrowLeft = function ArrowLeft(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "black",
    className: className,
    width: "19px"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M24 0v24H0V0h24z",
    fill: "none",
    opacity: ".87"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M14 7l-5 5 5 5V7z"
  }));
};

var ArrowDown = function ArrowDown(_ref2) {
  var className = _ref2.className,
      onClick = _ref2.onClick,
      styles = _ref2.styles,
      disable = _ref2.disable;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({}, styles),
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: disable ? "#9E9E9E" : "black",
    className: className,
    onClick: onClick,
    width: "18px",
    height: "18px"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M7 10l5 5 5-5H7z"
  }));
};

var ArrowBack = function ArrowBack(_ref3) {
  var className = _ref3.className,
      onClick = _ref3.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "black",
    className: className,
    onClick: onClick,
    width: "18px",
    height: "18px"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M11.67 3.87L9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"
  }));
};

var ArrowForward = function ArrowForward(_ref4) {
  var className = _ref4.className,
      onClick = _ref4.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "black",
    className: className,
    onClick: onClick,
    width: "18px",
    height: "18px"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z"
  }));
};

var ArrowToFirst = function ArrowToFirst(_ref5) {
  var className = _ref5.className,
      onClick = _ref5.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "18px",
    height: "18px",
    viewBox: "0 0 13 12",
    fill: "black",
    xmlns: "http://www.w3.org/2000/svg",
    className: className,
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M12.41 10.59L7.82 6L12.41 1.41L11 0L5 6L11 12L12.41 10.59ZM0 0H2V12H0V0Z",
    fill: "#505a5f"
  }));
};

var ArrowToLast = function ArrowToLast(_ref6) {
  var className = _ref6.className,
      onClick = _ref6.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "18px",
    height: "18px",
    viewBox: "0 0 13 12",
    fill: "black",
    xmlns: "http://www.w3.org/2000/svg",
    className: className,
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0.589844 1.41L5.17984 6L0.589844 10.59L1.99984 12L7.99984 6L1.99984 0L0.589844 1.41ZM10.9998 0H12.9998V12H10.9998V0Z",
    fill: "#505a5f"
  }));
};

var CameraSvg = function CameraSvg(_ref7) {
  var className = _ref7.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    enableBackground: "new 0 0 24 24",
    className: className,
    viewBox: "0 0 24 24",
    fill: "black",
    width: "46px",
    height: "42px"
  }, /*#__PURE__*/React__default.createElement("rect", {
    fill: "none",
    height: "24",
    width: "24"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M3,4V1h2v3h3v2H5v3H3V6H0V4H3z M6,10V7h3V4h7l1.83,2H21c1.1,0,2,0.9,2,2v12c0,1.1-0.9,2-2,2H5c-1.1,0-2-0.9-2-2V10H6z M13,19c2.76,0,5-2.24,5-5s-2.24-5-5-5s-5,2.24-5,5S10.24,19,13,19z M9.8,14c0,1.77,1.43,3.2,3.2,3.2s3.2-1.43,3.2-3.2 s-1.43-3.2-3.2-3.2S9.8,12.23,9.8,14z"
  }));
};

var DeleteBtn = function DeleteBtn(_ref8) {
  var className = _ref8.className,
      onClick = _ref8.onClick,
      fill = _ref8.fill;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "white",
    className: className,
    onClick: onClick,
    width: "18px",
    height: "18px"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: fill
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
  }));
};

var SuccessSvg = function SuccessSvg(_ref9) {
  var className = _ref9.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#00703C",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
  }));
};

var ErrorSvg = function ErrorSvg(_ref10) {
  var className = _ref10.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#d4351c",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("circle", {
    cx: "12",
    cy: "19",
    r: "2"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M10 3h4v12h-4z"
  }));
};

var StarFilled = function StarFilled(_ref11) {
  var className = _ref11.className,
      id = _ref11.id,
      onClick = _ref11.onClick,
      styles = _ref11.styles,
      _ref11$percentage = _ref11.percentage,
      percentage = _ref11$percentage === void 0 ? 100 : _ref11$percentage;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    enableBackground: "new 0 0 24 24",
    className: className,
    style: styles,
    onClick: onClick,
    viewBox: "0 0 24 24",
    fill: "#F47738",
    width: "48px",
    height: "48px"
  }, /*#__PURE__*/React__default.createElement("linearGradient", {
    id: id,
    x1: "0",
    x2: "1",
    y1: "0",
    y2: "0"
  }, /*#__PURE__*/React__default.createElement("stop", {
    offset: "0%",
    stopColor: "#F47738",
    stopOpacity: 1
  }), /*#__PURE__*/React__default.createElement("stop", {
    offset: percentage + "%",
    stopColor: "#F47738",
    stopOpacity: 1
  }), /*#__PURE__*/React__default.createElement("stop", {
    offset: percentage + "%",
    stopColor: "white",
    stopOpacity: 0
  })), /*#__PURE__*/React__default.createElement("g", null, /*#__PURE__*/React__default.createElement("path", {
    d: "M0,0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M0,0h24v24H0V0z",
    fill: "none"
  })), /*#__PURE__*/React__default.createElement("g", null, /*#__PURE__*/React__default.createElement("path", {
    d: "M12,17.27L18.18,21l-1.64-7.03L22,9.24l-7.19-0.61L12,2L9.19,8.63L2,9.24l5.46,4.73L5.82,21L12,17.27z",
    fill: "url(#" + id + ")",
    stroke: "#F47738",
    strokeWidth: 1
  })));
};

var StarEmpty = function StarEmpty(_ref12) {
  var className = _ref12.className,
      onClick = _ref12.onClick,
      styles = _ref12.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#F47738",
    className: className,
    style: styles,
    width: "48px",
    height: "48px",
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z",
    strokeWidth: 1
  }));
};

var DocumentIcon = function DocumentIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM11 14H4V12H11V14ZM14 10H4V8H14V10ZM14 6H4V4H14V6Z",
    fill: "#F47738"
  }));
};

var DocumentSVG = function DocumentSVG(_ref13) {
  var className = _ref13.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "196",
    height: "196",
    viewBox: "0 0 196 196",
    className: className,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("g", {
    filter: "url(#filter0_d)"
  }, /*#__PURE__*/React__default.createElement("rect", {
    x: "2",
    y: "1",
    width: "192",
    height: "192",
    fill: "url(#pattern0)"
  })), /*#__PURE__*/React__default.createElement("defs", null, /*#__PURE__*/React__default.createElement("filter", {
    id: "filter0_d",
    x: "0",
    y: "0",
    width: "196",
    height: "196",
    filterUnits: "userSpaceOnUse",
    "color-interpolation-filters": "sRGB"
  }, /*#__PURE__*/React__default.createElement("feFlood", {
    "flood-opacity": "0",
    result: "BackgroundImageFix"
  }), /*#__PURE__*/React__default.createElement("feColorMatrix", {
    in: "SourceAlpha",
    type: "matrix",
    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
  }), /*#__PURE__*/React__default.createElement("feOffset", {
    dy: "1"
  }), /*#__PURE__*/React__default.createElement("feGaussianBlur", {
    stdDeviation: "1"
  }), /*#__PURE__*/React__default.createElement("feColorMatrix", {
    type: "matrix",
    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"
  }), /*#__PURE__*/React__default.createElement("feBlend", {
    mode: "normal",
    in2: "BackgroundImageFix",
    result: "effect1_dropShadow"
  }), /*#__PURE__*/React__default.createElement("feBlend", {
    mode: "normal",
    in: "SourceGraphic",
    in2: "effect1_dropShadow",
    result: "shape"
  })), /*#__PURE__*/React__default.createElement("pattern", {
    id: "pattern0",
    patternContentUnits: "objectBoundingBox",
    width: "1",
    height: "1"
  }, /*#__PURE__*/React__default.createElement("use", {
    xlinkHref: "#image0",
    transform: "translate(0 -0.0354478) scale(0.00186567)"
  })), /*#__PURE__*/React__default.createElement("image", {
    id: "image0",
    width: "536",
    height: "574",
    xlinkHref: "data:image/png;base64,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"
  })));
};

var SearchIconSvg = function SearchIconSvg(_ref14) {
  var className = _ref14.className,
      onClick = _ref14.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#f47738",
    className: className,
    width: "24px",
    height: "24px",
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
  }));
};

var CheckSvg = function CheckSvg(_ref15) {
  var className = _ref15.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#F47738",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
  }));
};

var RoundedCheck = function RoundedCheck(_ref16) {
  var className = _ref16.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#FFFFFF",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z"
  }));
};

var Calender = function Calender(_ref17) {
  var className = _ref17.className,
      onClick = _ref17.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "black",
    className: className,
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"
  }));
};

var Phone = function Phone(_ref18) {
  var className = _ref18.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "#f47738",
    viewBox: "0 0 24 24",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
  }));
};

var FilterSvg = function FilterSvg(_ref19) {
  var className = _ref19.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "#f47738",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"
  }));
};

var Close = function Close(_ref20) {
  var className = _ref20.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    focusable: "false",
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
    width: "24",
    height: "24",
    fill: "#9E9E9E",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
  }));
};

var GetApp = function GetApp(_ref22) {
  var className = _ref22.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "#f47738",
    className: className
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
  }));
};

var HamburgerIcon = function HamburgerIcon(_ref23) {
  var styles = _ref23.styles,
      _ref23$color = _ref23.color,
      color = _ref23$color === void 0 ? "#fdfdfd" : _ref23$color;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({}, styles),
    width: "24",
    height: "24",
    focusable: "false",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
    fill: color
  }));
};

var HomeIcon = function HomeIcon(_ref24) {
  var className = _ref24.className,
      styles = _ref24.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    viewBox: "0 0 24 24",
    style: _extends({}, styles)
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
  }));
};
var LanguageIcon = function LanguageIcon(_ref25) {
  var className = _ref25.className,
      styles = _ref25.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    viewBox: "0 0 24 24",
    style: _extends({}, styles)
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"
  }));
};
var LogoutIcon = function LogoutIcon(_ref26) {
  var className = _ref26.className,
      styles = _ref26.styles;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    viewBox: "0 0 24 24",
    style: _extends({}, styles)
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"
  }));
};

var CalendarIcon = function CalendarIcon(props) {
  return /*#__PURE__*/React__default.createElement("svg", _extends({}, props, {
    fill: props.isdisabled ? "#e3e3e3" : "Black",
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"
  }));
};

var SortDown = function SortDown(style) {
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({
      display: "inline-block",
      height: "16px"
    }, style),
    xmlns: "http://www.w3.org/2000/svg",
    enableBackground: "new 0 0 24 24",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React__default.createElement("rect", {
    fill: "none",
    height: "24",
    width: "24"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M19,15l-1.41-1.41L13,18.17V2H11v16.17l-4.59-4.59L5,15l7,7L19,15z"
  }));
};

var SortUp = function SortUp(style) {
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({
      display: "inline-block",
      height: "16px"
    }, style),
    xmlns: "http://www.w3.org/2000/svg",
    enableBackground: "new 0 0 24 24",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React__default.createElement("rect", {
    fill: "none",
    height: "24",
    width: "24"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M5,9l1.41,1.41L11,5.83V22H13V5.83l4.59,4.59L19,9l-7-7L5,9z"
  }));
};

var ArrowRightInbox = function ArrowRightInbox(_ref27) {
  var style = _ref27.style;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "20",
    height: "14",
    viewBox: "0 0 20 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    style: style
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M13 0L11.59 1.41L16.17 6H0V8H16.17L11.58 12.59L13 14L20 7L13 0Z",
    fill: "#F47738"
  }));
};

var ShippingTruck = function ShippingTruck(style) {
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({
      display: "inline-block",
      fontSize: "16px"
    }, style),
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    fill: "white",
    d: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
  }));
};

function CloseSvg(_ref28) {
  var onClick = _ref28.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24",
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
  }));
}

var UpwardArrow = function UpwardArrow(_ref29) {
  var _ref29$color = _ref29.color,
      color = _ref29$color === void 0 ? "#00703C" : _ref29$color,
      _ref29$rotate = _ref29.rotate,
      rotate = _ref29$rotate === void 0 ? 0 : _ref29$rotate,
      _ref29$marginRight = _ref29.marginRight,
      marginRight = _ref29$marginRight === void 0 ? 0 : _ref29$marginRight;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: {
      display: "inline-block",
      verticalAlign: "baseline",
      transform: "rotate(" + rotate + "deg)",
      marginRight: marginRight + "px"
    },
    width: "11",
    height: "16",
    viewBox: "0 0 11 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 5.6L1.10786 6.728L4.71429 3.064V16H6.28571V3.064L9.89214 6.736L11 5.6L5.5 0L0 5.6Z",
    fill: color
  }));
};

var DownwardArrow = function DownwardArrow(props) {
  return /*#__PURE__*/React__default.createElement(UpwardArrow, _extends({}, props, {
    color: "#e54d42",
    rotate: 180
  }));
};

var DownloadIcon = function DownloadIcon(_ref30) {
  var styles = _ref30.styles,
      className = _ref30.className,
      onClick = _ref30.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({}, styles),
    width: "19",
    height: "24",
    viewBox: "0 0 19 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: className,
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M18.8337 8.5H13.5003V0.5H5.50033V8.5H0.166992L9.50033 17.8333L18.8337 8.5ZM0.166992 20.5V23.1667H18.8337V20.5H0.166992Z",
    fill: "#505A5F"
  }));
};

var PrimaryDownlaodIcon = function PrimaryDownlaodIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "#f47738"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
  }));
};

var Ellipsis = function Ellipsis(_ref31) {
  var className = _ref31.className,
      onClick = _ref31.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "4",
    height: "16",
    viewBox: "0 0 4 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: className,
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z",
    fill: "#B1B4B6"
  }));
};

var Poll = function Poll() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 40 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 6C0 2.68629 2.68629 0 6 0H34C37.3137 0 40 2.68629 40 6V34C40 37.3137 37.3137 40 34 40H6C2.68629 40 0 37.3137 0 34V6Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M31.6667 5H8.33333C6.5 5 5 6.5 5 8.33333V31.6667C5 33.5 6.5 35 8.33333 35H31.6667C33.5 35 35 33.5 35 31.6667V8.33333C35 6.5 33.5 5 31.6667 5ZM15 28.3333H11.6667V16.6667H15V28.3333ZM21.6667 28.3333H18.3333V11.6667H21.6667V28.3333ZM28.3333 28.3333H25V21.6667H28.3333V28.3333Z",
    fill: "#F47738"
  }));
};

var Details = function Details() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "22",
    height: "16",
    viewBox: "0 0 22 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5ZM11 13C8.24 13 6 10.76 6 8C6 5.24 8.24 3 11 3C13.76 3 16 5.24 16 8C16 10.76 13.76 13 11 13ZM11 5C9.34 5 8 6.34 8 8C8 9.66 9.34 11 11 11C12.66 11 14 9.66 14 8C14 6.34 12.66 5 11 5Z",
    fill: "#505A5F"
  }));
};

var FilterIcon = function FilterIcon(_ref32) {
  var onClick = _ref32.onClick;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0.666904 2.48016C3.36024 5.9335 8.33357 12.3335 8.33357 12.3335V20.3335C8.33357 21.0668 8.93357 21.6668 9.6669 21.6668H12.3336C13.0669 21.6668 13.6669 21.0668 13.6669 20.3335V12.3335C13.6669 12.3335 18.6269 5.9335 21.3202 2.48016C22.0002 1.60016 21.3736 0.333496 20.2669 0.333496H1.72024C0.613571 0.333496 -0.0130959 1.60016 0.666904 2.48016Z",
    fill: "#505A5F"
  }));
};

var RefreshIcon = function RefreshIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "16",
    height: "22",
    viewBox: "0 0 16 22",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z",
    fill: "#0B0C0C"
  }));
};

var PrintIcon = function PrintIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "20",
    height: "18",
    viewBox: "0 0 20 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M17 5H3C1.34 5 0 6.34 0 8V14H4V18H16V14H20V8C20 6.34 18.66 5 17 5ZM14 16H6V11H14V16ZM17 9C16.45 9 16 8.55 16 8C16 7.45 16.45 7 17 7C17.55 7 18 7.45 18 8C18 8.55 17.55 9 17 9ZM16 0H4V4H16V0Z",
    fill: "#505A5F"
  }));
};

function PropertyHouse(style) {
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({
      display: "inline-block",
      fontSize: "16px"
    }, style),
    width: "24",
    height: "24",
    viewBox: "0 0 40 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M13.6167 9.5L1.66667 17.4667V35H10V21.6667H16.6667V35H25V17.0833L13.6167 9.5Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M16.6667 5V7.51667L20 9.73333L22.8833 11.6667H25V13.0833L28.3333 15.3167V18.3333H31.6667V21.6667H28.3333V25H31.6667V28.3333H28.3333V35H38.3333V5H16.6667ZM31.6667 15H28.3333V11.6667H31.6667V15Z",
    fill: "white"
  }));
}

var InfoBannerIcon = function InfoBannerIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z",
    fill: "#3498DB"
  }));
};

var ShareIcon = function ShareIcon(_ref33) {
  var styles = _ref33.styles,
      className = _ref33.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({}, styles),
    className: className,
    width: "18",
    height: "20",
    viewBox: "0 0 18 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M15 14.08C14.24 14.08 13.56 14.38 13.04 14.85L5.91 10.7C5.96 10.47 6 10.24 6 10C6 9.76 5.96 9.53 5.91 9.3L12.96 5.19C13.5 5.69 14.21 6 15 6C16.66 6 18 4.66 18 3C18 1.34 16.66 0 15 0C13.34 0 12 1.34 12 3C12 3.24 12.04 3.47 12.09 3.7L5.04 7.81C4.5 7.31 3.79 7 3 7C1.34 7 0 8.34 0 10C0 11.66 1.34 13 3 13C3.79 13 4.5 12.69 5.04 12.19L12.16 16.35C12.11 16.56 12.08 16.78 12.08 17C12.08 18.61 13.39 19.92 15 19.92C16.61 19.92 17.92 18.61 17.92 17C17.92 15.39 16.61 14.08 15 14.08Z",
    fill: "#505A5F"
  }));
};

var RupeeIcon = function RupeeIcon(_ref34) {
  var className = _ref34.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "48",
    className: className,
    height: "48",
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("rect", {
    width: "48",
    height: "48",
    rx: "6",
    fill: "#F47738"
  }));
};

var ComplaintIcon = function ComplaintIcon(_ref35) {
  var className = _ref35.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "48",
    height: "48",
    className: className,
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M42.6667 0.666748H5.33335C2.76669 0.666748 0.69002 2.76675 0.69002 5.33342L0.666687 47.3334L10 38.0001H42.6667C45.2334 38.0001 47.3334 35.9001 47.3334 33.3334V5.33342C47.3334 2.76675 45.2334 0.666748 42.6667 0.666748ZM26.3334 21.6667H21.6667V7.66675H26.3334V21.6667ZM26.3334 31.0001H21.6667V26.3334H26.3334V31.0001Z",
    fill: "#F47738"
  }));
};

var DropIcon = function DropIcon(_ref36) {
  var className = _ref36.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "28",
    height: "34",
    viewBox: "0 0 28 34",
    className: className,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M23.4333 10.3332L14 0.916504L4.56663 10.3332C1.96663 12.9332 0.666626 16.3998 0.666626 19.7332C0.666626 23.0665 1.96663 26.5832 4.56663 29.1832C7.16663 31.7832 10.5833 33.0998 14 33.0998C17.4166 33.0998 20.8333 31.7832 23.4333 29.1832C26.0333 26.5832 27.3333 23.0665 27.3333 19.7332C27.3333 16.3998 26.0333 12.9332 23.4333 10.3332ZM3.99996 20.3332C4.01663 16.9998 5.03329 14.8832 6.93329 12.9998L14 5.78317L21.0666 13.0832C22.9666 14.9498 23.9833 16.9998 24 20.3332H3.99996Z",
    fill: "#F47738"
  }));
};

var Person = function Person(style) {
  return /*#__PURE__*/React__default.createElement("svg", {
    style: _extends({
      display: "inline-block",
      fontSize: "16px"
    }, style),
    width: "24",
    height: "24",
    viewBox: "0 0 40 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M13.6167 9.5L1.66667 17.4667V35H10V21.6667H16.6667V35H25V17.0833L13.6167 9.5Z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    fill: "white"
  }));
};

var WhatsappIcon = function WhatsappIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0.0566406 24L1.74364 17.837C0.702641 16.033 0.155641 13.988 0.156641 11.891C0.159641 5.335 5.49464 0 12.0496 0C15.2306 0.001 18.2166 1.24 20.4626 3.488C22.7076 5.736 23.9436 8.724 23.9426 11.902C23.9396 18.459 18.6046 23.794 12.0496 23.794C10.0596 23.793 8.09864 23.294 6.36164 22.346L0.0566406 24ZM6.65364 20.193C8.32964 21.188 9.92964 21.784 12.0456 21.785C17.4936 21.785 21.9316 17.351 21.9346 11.9C21.9366 6.438 17.5196 2.01 12.0536 2.008C6.60164 2.008 2.16664 6.442 2.16464 11.892C2.16364 14.117 2.81564 15.783 3.91064 17.526L2.91164 21.174L6.65364 20.193ZM18.0406 14.729C17.9666 14.605 17.7686 14.531 17.4706 14.382C17.1736 14.233 15.7126 13.514 15.4396 13.415C15.1676 13.316 14.9696 13.266 14.7706 13.564C14.5726 13.861 14.0026 14.531 13.8296 14.729C13.6566 14.927 13.4826 14.952 13.1856 14.803C12.8886 14.654 11.9306 14.341 10.7956 13.328C9.91264 12.54 9.31564 11.567 9.14264 11.269C8.96964 10.972 9.12464 10.811 9.27264 10.663C9.40664 10.53 9.56964 10.316 9.71864 10.142C9.86964 9.97 9.91864 9.846 10.0186 9.647C10.1176 9.449 10.0686 9.275 9.99364 9.126C9.91864 8.978 9.32464 7.515 9.07764 6.92C8.83564 6.341 8.59064 6.419 8.40864 6.41L7.83864 6.4C7.64064 6.4 7.31864 6.474 7.04664 6.772C6.77464 7.07 6.00664 7.788 6.00664 9.251C6.00664 10.714 7.07164 12.127 7.21964 12.325C7.36864 12.523 9.31464 15.525 12.2956 16.812C13.0046 17.118 13.5586 17.301 13.9896 17.438C14.7016 17.664 15.3496 17.632 15.8616 17.556C16.4326 17.471 17.6196 16.837 17.8676 16.143C18.1156 15.448 18.1156 14.853 18.0406 14.729Z",
    fill: "#F47738"
  }));
};

var EmailIcon = function EmailIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "20",
    height: "16",
    viewBox: "0 0 20 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 4L10 9L2 4V2L10 7L18 2V4Z",
    fill: "#F47738"
  }));
};

var CaseIcon = function CaseIcon(_ref37) {
  var className = _ref37.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    className: className,
    width: "24",
    height: "24",
    viewBox: "0 0 34 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M30.3333 6.99967H23.6667V3.66634C23.6667 1.81634 22.1833 0.333008 20.3333 0.333008H13.6667C11.8167 0.333008 10.3333 1.81634 10.3333 3.66634V6.99967H3.66667C1.81667 6.99967 0.350001 8.48301 0.350001 10.333L0.333334 28.6663C0.333334 30.5163 1.81667 31.9997 3.66667 31.9997H30.3333C32.1833 31.9997 33.6667 30.5163 33.6667 28.6663V10.333C33.6667 8.48301 32.1833 6.99967 30.3333 6.99967ZM20.3333 6.99967H13.6667V3.66634H20.3333V6.99967Z",
    fill: "white"
  }));
};

var PersonIcon = function PersonIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 38 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M25.6667 10.3333C28.4334 10.3333 30.65 8.1 30.65 5.33333C30.65 2.56666 28.4334 0.333328 25.6667 0.333328C22.9 0.333328 20.6667 2.56666 20.6667 5.33333C20.6667 8.1 22.9 10.3333 25.6667 10.3333ZM12.3334 10.3333C15.1 10.3333 17.3167 8.1 17.3167 5.33333C17.3167 2.56666 15.1 0.333328 12.3334 0.333328C9.56669 0.333328 7.33335 2.56666 7.33335 5.33333C7.33335 8.1 9.56669 10.3333 12.3334 10.3333ZM12.3334 13.6667C8.45002 13.6667 0.666687 15.6167 0.666687 19.5V23.6667H24V19.5C24 15.6167 16.2167 13.6667 12.3334 13.6667ZM25.6667 13.6667C25.1834 13.6667 24.6334 13.7 24.05 13.75C25.9834 15.15 27.3334 17.0333 27.3334 19.5V23.6667H37.3334V19.5C37.3334 15.6167 29.55 13.6667 25.6667 13.6667Z",
    fill: "white"
  }));
};

var ReceiptIcon = function ReceiptIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z",
    fill: "white"
  }));
};

var AnnouncementIcon = function AnnouncementIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "28",
    height: "28",
    viewBox: "0 0 28 28",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M24.6665 0.666016H3.33317C1.8665 0.666016 0.679837 1.86602 0.679837 3.33268L0.666504 27.3327L5.99984 21.9993H24.6665C26.1332 21.9993 27.3332 20.7993 27.3332 19.3327V3.33268C27.3332 1.86602 26.1332 0.666016 24.6665 0.666016ZM15.3332 12.666H12.6665V4.66602H15.3332V12.666ZM15.3332 17.9993H12.6665V15.3327H15.3332V17.9993Z",
    fill: "#F47738"
  }));
};

var PTIcon = function PTIcon(_ref38) {
  var className = _ref38.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "34",
    height: "30",
    viewBox: "0 0 34 30",
    fill: "none",
    className: className,
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M16.9999 6.66667V0H0.333252V30H33.6666V6.66667H16.9999ZM6.99992 26.6667H3.66659V23.3333H6.99992V26.6667ZM6.99992 20H3.66659V16.6667H6.99992V20ZM6.99992 13.3333H3.66659V10H6.99992V13.3333ZM6.99992 6.66667H3.66659V3.33333H6.99992V6.66667ZM13.6666 26.6667H10.3333V23.3333H13.6666V26.6667ZM13.6666 20H10.3333V16.6667H13.6666V20ZM13.6666 13.3333H10.3333V10H13.6666V13.3333ZM13.6666 6.66667H10.3333V3.33333H13.6666V6.66667ZM30.3333 26.6667H16.9999V23.3333H20.3333V20H16.9999V16.6667H20.3333V13.3333H16.9999V10H30.3333V26.6667ZM26.9999 13.3333H23.6666V16.6667H26.9999V13.3333ZM26.9999 20H23.6666V23.3333H26.9999V20Z",
    fill: "#FFF"
  }));
};

var OBPSIcon = function OBPSIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "34",
    height: "30",
    viewBox: "0 0 34 30",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M30.3333 0H3.66659C1.83325 0 0.333252 1.5 0.333252 3.33333V26.6667C0.333252 28.5 1.83325 30 3.66659 30H30.3333C32.1666 30 33.6666 28.5 33.6666 26.6667V3.33333C33.6666 1.5 32.1666 0 30.3333 0ZM13.6666 23.3333H5.33325V20H13.6666V23.3333ZM13.6666 16.6667H5.33325V13.3333H13.6666V16.6667ZM13.6666 10H5.33325V6.66667H13.6666V10ZM21.6999 20L16.9999 15.2667L19.3499 12.9167L21.6999 15.2833L26.9833 10L29.3499 12.3667L21.6999 20Z",
    fill: "#F47738"
  }));
};

var CitizenTruck = function CitizenTruck(_ref39) {
  var className = _ref39.className;
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 23 19",
    className: className,
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    fill: "#F47738",
    d: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
  }));
};

var EDCRIcon = function EDCRIcon(_ref40) {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "30",
    height: "32",
    viewBox: "0 0 30 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M20 15.3333V5.33333L15 0.333334L10 5.33333V8.66667H0V32H30V15.3333H20ZM6.66667 28.6667H3.33333V25.3333H6.66667V28.6667ZM6.66667 22H3.33333V18.6667H6.66667V22ZM6.66667 15.3333H3.33333V12H6.66667V15.3333ZM16.6667 28.6667H13.3333V25.3333H16.6667V28.6667ZM16.6667 22H13.3333V18.6667H16.6667V22ZM16.6667 15.3333H13.3333V12H16.6667V15.3333ZM16.6667 8.66667H13.3333V5.33333H16.6667V8.66667ZM26.6667 28.6667H23.3333V25.3333H26.6667V28.6667ZM26.6667 22H23.3333V18.6667H26.6667V22Z",
    fill: "#F47738"
  }));
};

var BPAIcon = function BPAIcon(_ref41) {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "32",
    height: "32",
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M23.3333 29.0333H3.33333V8.66667H15V5.33334H3.33333C1.5 5.33334 0 6.83334 0 8.66667V28.6667C0 30.5 1.5 32 3.33333 32H23.3333C25.1667 32 26.6667 30.5 26.6667 28.6667V17H23.3333V29.0333Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M26.6667 0.333336H23.3333V5.33334H18.3333C18.35 5.35 18.3333 8.66667 18.3333 8.66667H23.3333V13.65C23.35 13.6667 26.6667 13.65 26.6667 13.65V8.66667H31.6667V5.33334H26.6667V0.333336Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20 12H6.66666V15.3333H20V12Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M6.66666 17V20.3333H20V17H15H6.66666Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20 22H6.66666V25.3333H20V22Z",
    fill: "#F47738"
  }));
};

var BPAHomeIcon = function BPAHomeIcon(_ref42) {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "34",
    height: "30",
    viewBox: "0 0 34 30",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M30.3333 0H3.66659C1.83325 0 0.333252 1.5 0.333252 3.33333V26.6667C0.333252 28.5 1.83325 30 3.66659 30H30.3333C32.1666 30 33.6666 28.5 33.6666 26.6667V3.33333C33.6666 1.5 32.1666 0 30.3333 0ZM13.6666 23.3333H5.33325V20H13.6666V23.3333ZM13.6666 16.6667H5.33325V13.3333H13.6666V16.6667ZM13.6666 10H5.33325V6.66667H13.6666V10ZM21.6999 20L16.9999 15.2667L19.3499 12.9167L21.6999 15.2833L26.9833 10L29.3499 12.3667L21.6999 20Z",
    fill: "white"
  }));
};

var HelpIcon = function HelpIcon() {
  return /*#__PURE__*/React__default.createElement("svg", {
    width: "24",
    height: "18",
    viewBox: "0 0 24 18",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M22 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H22C23.1 18 23.99 17.1 23.99 16L24 2C24 0.9 23.1 0 22 0ZM8 3C9.66 3 11 4.34 11 6C11 7.66 9.66 9 8 9C6.34 9 5 7.66 5 6C5 4.34 6.34 3 8 3ZM14 15H2V14C2 12 6 10.9 8 10.9C10 10.9 14 12 14 14V15ZM17.85 11H19.49L21 13L19.01 14.99C17.7 14.01 16.73 12.61 16.28 11C16.1 10.36 16 9.69 16 9C16 8.31 16.1 7.64 16.28 7C16.73 5.38 17.7 3.99 19.01 3.01L21 5L19.49 7H17.85C17.63 7.63 17.5 8.3 17.5 9C17.5 9.7 17.63 10.37 17.85 11Z",
    fill: "#F47738"
  }));
};

var BackButton = function BackButton(_ref) {
  var history = _ref.history,
      style = _ref.style,
      isSuccessScreen = _ref.isSuccessScreen;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React__default.createElement("div", {
    className: "back-btn2",
    style: style ? style : {},
    onClick: function onClick() {
      return !isSuccessScreen ? history.goBack() : null;
    }
  }, /*#__PURE__*/React__default.createElement(ArrowLeft, null), /*#__PURE__*/React__default.createElement("p", null, t("CS_COMMON_BACK")));
};

var BackButton$1 = reactRouterDom.withRouter(BackButton);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var b = "function" === typeof Symbol && Symbol.for,
    c = b ? Symbol.for("react.element") : 60103,
    d = b ? Symbol.for("react.portal") : 60106,
    e = b ? Symbol.for("react.fragment") : 60107,
    f = b ? Symbol.for("react.strict_mode") : 60108,
    g = b ? Symbol.for("react.profiler") : 60114,
    h = b ? Symbol.for("react.provider") : 60109,
    k = b ? Symbol.for("react.context") : 60110,
    l = b ? Symbol.for("react.async_mode") : 60111,
    m = b ? Symbol.for("react.concurrent_mode") : 60111,
    n = b ? Symbol.for("react.forward_ref") : 60112,
    p = b ? Symbol.for("react.suspense") : 60113,
    q = b ? Symbol.for("react.suspense_list") : 60120,
    r = b ? Symbol.for("react.memo") : 60115,
    t = b ? Symbol.for("react.lazy") : 60116,
    v = b ? Symbol.for("react.block") : 60121,
    w = b ? Symbol.for("react.fundamental") : 60117,
    x = b ? Symbol.for("react.responder") : 60118,
    y = b ? Symbol.for("react.scope") : 60119;

function z(a) {
  if ("object" === typeof a && null !== a) {
    var u = a.$$typeof;

    switch (u) {
      case c:
        switch (a = a.type, a) {
          case l:
          case m:
          case e:
          case g:
          case f:
          case p:
            return a;

          default:
            switch (a = a && a.$$typeof, a) {
              case k:
              case n:
              case t:
              case r:
              case h:
                return a;

              default:
                return u;
            }

        }

      case d:
        return u;
    }
  }
}

function A(a) {
  return z(a) === m;
}

var AsyncMode = l;
var ConcurrentMode = m;
var ContextConsumer = k;
var ContextProvider = h;
var Element = c;
var ForwardRef = n;
var Fragment = e;
var Lazy = t;
var Memo = r;
var Portal = d;
var Profiler = g;
var StrictMode = f;
var Suspense = p;

var isAsyncMode = function isAsyncMode(a) {
  return A(a) || z(a) === l;
};

var isConcurrentMode = A;

var isContextConsumer = function isContextConsumer(a) {
  return z(a) === k;
};

var isContextProvider = function isContextProvider(a) {
  return z(a) === h;
};

var isElement = function isElement(a) {
  return "object" === typeof a && null !== a && a.$$typeof === c;
};

var isForwardRef = function isForwardRef(a) {
  return z(a) === n;
};

var isFragment = function isFragment(a) {
  return z(a) === e;
};

var isLazy = function isLazy(a) {
  return z(a) === t;
};

var isMemo = function isMemo(a) {
  return z(a) === r;
};

var isPortal = function isPortal(a) {
  return z(a) === d;
};

var isProfiler = function isProfiler(a) {
  return z(a) === g;
};

var isStrictMode = function isStrictMode(a) {
  return z(a) === f;
};

var isSuspense = function isSuspense(a) {
  return z(a) === p;
};

var isValidElementType = function isValidElementType(a) {
  return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v);
};

var typeOf = z;
var reactIs_production_min = {
  AsyncMode: AsyncMode,
  ConcurrentMode: ConcurrentMode,
  ContextConsumer: ContextConsumer,
  ContextProvider: ContextProvider,
  Element: Element,
  ForwardRef: ForwardRef,
  Fragment: Fragment,
  Lazy: Lazy,
  Memo: Memo,
  Portal: Portal,
  Profiler: Profiler,
  StrictMode: StrictMode,
  Suspense: Suspense,
  isAsyncMode: isAsyncMode,
  isConcurrentMode: isConcurrentMode,
  isContextConsumer: isContextConsumer,
  isContextProvider: isContextProvider,
  isElement: isElement,
  isForwardRef: isForwardRef,
  isFragment: isFragment,
  isLazy: isLazy,
  isMemo: isMemo,
  isPortal: isPortal,
  isProfiler: isProfiler,
  isStrictMode: isStrictMode,
  isSuspense: isSuspense,
  isValidElementType: isValidElementType,
  typeOf: typeOf
};

var reactIs_development = createCommonjsModule(function (module, exports) {

  if (process.env.NODE_ENV !== "production") {
    (function () {

      var hasSymbol = typeof Symbol === 'function' && Symbol.for;
      var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
      var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
      var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
      var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
      var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
      var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
      var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
      var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
      var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
      var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
      var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
      var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for('react.suspense_list') : 0xead8;
      var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
      var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
      var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for('react.block') : 0xead9;
      var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for('react.fundamental') : 0xead5;
      var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for('react.responder') : 0xead6;
      var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for('react.scope') : 0xead7;

      function isValidElementType(type) {
        return typeof type === 'string' || typeof type === 'function' || type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
      }

      function typeOf(object) {
        if (typeof object === 'object' && object !== null) {
          var $$typeof = object.$$typeof;

          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;

              switch (type) {
                case REACT_ASYNC_MODE_TYPE:
                case REACT_CONCURRENT_MODE_TYPE:
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                  return type;

                default:
                  var $$typeofType = type && type.$$typeof;

                  switch ($$typeofType) {
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_LAZY_TYPE:
                    case REACT_MEMO_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;

                    default:
                      return $$typeof;
                  }

              }

            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }

        return undefined;
      }

      var AsyncMode = REACT_ASYNC_MODE_TYPE;
      var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
      var ContextConsumer = REACT_CONTEXT_TYPE;
      var ContextProvider = REACT_PROVIDER_TYPE;
      var Element = REACT_ELEMENT_TYPE;
      var ForwardRef = REACT_FORWARD_REF_TYPE;
      var Fragment = REACT_FRAGMENT_TYPE;
      var Lazy = REACT_LAZY_TYPE;
      var Memo = REACT_MEMO_TYPE;
      var Portal = REACT_PORTAL_TYPE;
      var Profiler = REACT_PROFILER_TYPE;
      var StrictMode = REACT_STRICT_MODE_TYPE;
      var Suspense = REACT_SUSPENSE_TYPE;
      var hasWarnedAboutDeprecatedIsAsyncMode = false;

      function isAsyncMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsAsyncMode) {
            hasWarnedAboutDeprecatedIsAsyncMode = true;
            console['warn']('The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
          }
        }
        return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
      }

      function isConcurrentMode(object) {
        return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
      }

      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }

      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }

      function isElement(object) {
        return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }

      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }

      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }

      function isLazy(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }

      function isMemo(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }

      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }

      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }

      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }

      function isSuspense(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }

      exports.AsyncMode = AsyncMode;
      exports.ConcurrentMode = ConcurrentMode;
      exports.ContextConsumer = ContextConsumer;
      exports.ContextProvider = ContextProvider;
      exports.Element = Element;
      exports.ForwardRef = ForwardRef;
      exports.Fragment = Fragment;
      exports.Lazy = Lazy;
      exports.Memo = Memo;
      exports.Portal = Portal;
      exports.Profiler = Profiler;
      exports.StrictMode = StrictMode;
      exports.Suspense = Suspense;
      exports.isAsyncMode = isAsyncMode;
      exports.isConcurrentMode = isConcurrentMode;
      exports.isContextConsumer = isContextConsumer;
      exports.isContextProvider = isContextProvider;
      exports.isElement = isElement;
      exports.isForwardRef = isForwardRef;
      exports.isFragment = isFragment;
      exports.isLazy = isLazy;
      exports.isMemo = isMemo;
      exports.isPortal = isPortal;
      exports.isProfiler = isProfiler;
      exports.isStrictMode = isStrictMode;
      exports.isSuspense = isSuspense;
      exports.isValidElementType = isValidElementType;
      exports.typeOf = typeOf;
    })();
  }
});

var reactIs = createCommonjsModule(function (module) {

  if (process.env.NODE_ENV === 'production') {
    module.exports = reactIs_production_min;
  } else {
    module.exports = reactIs_development;
  }
});

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    }

    var test1 = new String('abc');
    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    }

    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    }

    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
var ReactPropTypesSecret_1 = ReactPropTypesSecret;

var printWarning = function printWarning() {};

if (process.env.NODE_ENV !== 'production') {
  var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
  var loggedTypeFailures = {};
  var has = Function.call.bind(Object.prototype.hasOwnProperty);

  printWarning = function printWarning(text) {
    var message = 'Warning: ' + text;

    if (typeof console !== 'undefined') {
      console.error(message);
    }

    try {
      throw new Error(message);
    } catch (x) {}
  };
}

function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error;

        try {
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.');
            err.name = 'Invariant Violation';
            throw err;
          }

          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
        } catch (ex) {
          error = ex;
        }

        if (error && !(error instanceof Error)) {
          printWarning((componentName || 'React class') + ': type specification of ' + location + ' `' + typeSpecName + '` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a ' + typeof error + '. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).');
        }

        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          loggedTypeFailures[error.message] = true;
          var stack = getStack ? getStack() : '';
          printWarning('Failed ' + location + ' type: ' + error.message + (stack != null ? stack : ''));
        }
      }
    }
  }
}

checkPropTypes.resetWarningCache = function () {
  if (process.env.NODE_ENV !== 'production') {
    loggedTypeFailures = {};
  }
};

var checkPropTypes_1 = checkPropTypes;

var has$1 = Function.call.bind(Object.prototype.hasOwnProperty);

var printWarning$1 = function printWarning() {};

if (process.env.NODE_ENV !== 'production') {
  printWarning$1 = function printWarning(text) {
    var message = 'Warning: ' + text;

    if (typeof console !== 'undefined') {
      console.error(message);
    }

    try {
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

var factoryWithTypeCheckers = function factoryWithTypeCheckers(isValidElement, throwOnDirectAccess) {
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';

  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);

    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  var ANONYMOUS = '<<anonymous>>';
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),
    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    elementType: createElementTypeTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker
  };

  function is(x, y) {
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y;
    } else {
      return x !== x && y !== y;
    }
  }

  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }

  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }

    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret_1) {
        if (throwOnDirectAccess) {
          var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
          err.name = 'Invariant Violation';
          throw err;
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          var cacheKey = componentName + ':' + propName;

          if (!manualPropTypeCallCache[cacheKey] && manualPropTypeWarningCount < 3) {
            printWarning$1('You are manually calling a React.PropTypes validation ' + 'function for the `' + propFullName + '` prop on `' + componentName + '`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.');
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }

      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }

          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }

        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);
    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== expectedType) {
        var preciseType = getPreciseType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }

      var propValue = props[propName];

      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }

      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);

        if (error instanceof Error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];

      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createElementTypeTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];

      if (!reactIs.isValidElementType(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      if (process.env.NODE_ENV !== 'production') {
        if (arguments.length > 1) {
          printWarning$1('Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' + 'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).');
        } else {
          printWarning$1('Invalid argument supplied to oneOf, expected an array.');
        }
      }

      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];

      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
        var type = getPreciseType(value);

        if (type === 'symbol') {
          return String(value);
        }

        return value;
      });
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }

    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }

      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }

      for (var key in propValue) {
        if (has$1(propValue, key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);

          if (error instanceof Error) {
            return error;
          }
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];

      if (typeof checker !== 'function') {
        printWarning$1('Invalid argument supplied to oneOfType. Expected an array of check functions, but ' + 'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.');
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];

        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }

    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }

      for (var key in shapeTypes) {
        var checker = shapeTypes[key];

        if (!checker) {
          continue;
        }

        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);

        if (error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }

      var allKeys = objectAssign({}, props[propName], shapeTypes);

      for (var key in allKeys) {
        var checker = shapeTypes[key];

        if (!checker) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
        }

        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);

        if (error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;

      case 'boolean':
        return !propValue;

      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }

        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);

        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;

          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            while (!(step = iterator.next()).done) {
              var entry = step.value;

              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;

      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    if (propType === 'symbol') {
      return true;
    }

    if (!propValue) {
      return false;
    }

    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  function getPropType(propValue) {
    var propType = typeof propValue;

    if (Array.isArray(propValue)) {
      return 'array';
    }

    if (propValue instanceof RegExp) {
      return 'object';
    }

    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }

    return propType;
  }

  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }

    var propType = getPropType(propValue);

    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }

    return propType;
  }

  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);

    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;

      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;

      default:
        return type;
    }
  }

  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }

    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes_1;
  ReactPropTypes.resetWarningCache = checkPropTypes_1.resetWarningCache;
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};

function emptyFunction() {}

function emptyFunctionWithReset() {}

emptyFunctionWithReset.resetWarningCache = emptyFunction;

var factoryWithThrowingShims = function factoryWithThrowingShims() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      return;
    }

    var err = new Error('Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use PropTypes.checkPropTypes() to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
    err.name = 'Invariant Violation';
    throw err;
  }
  shim.isRequired = shim;

  function getShim() {
    return shim;
  }
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,
    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,
    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
  if (process.env.NODE_ENV !== 'production') {
    var ReactIs = reactIs;
    var throwOnDirectAccess = true;
    module.exports = factoryWithTypeCheckers(ReactIs.isElement, throwOnDirectAccess);
  } else {
    module.exports = factoryWithThrowingShims();
  }
});

var Successful = function Successful(props) {
  var _props$props, _props$props2, _props$props3, _props$props4, _props$props5, _props$props6, _props$props7, _props$props8, _props$props9;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var user_type = Digit.SessionStorage.get("userType");
  return /*#__PURE__*/React__default.createElement("div", {
    className: user_type === "citizen" ? "success-wrap" : "emp-success-wrap",
    style: props.style ? props.style : {}
  }, /*#__PURE__*/React__default.createElement("header", null, props.props.message), /*#__PURE__*/React__default.createElement("div", null, (props === null || props === void 0 ? void 0 : (_props$props = props.props) === null || _props$props === void 0 ? void 0 : _props$props.svg) || /*#__PURE__*/React__default.createElement(SuccessSvg, null), /*#__PURE__*/React__default.createElement("h2", {
    style: props !== null && props !== void 0 && (_props$props2 = props.props) !== null && _props$props2 !== void 0 && _props$props2.infoStyles ? props === null || props === void 0 ? void 0 : (_props$props3 = props.props) === null || _props$props3 === void 0 ? void 0 : _props$props3.infoStyles : {}
  }, props !== null && props !== void 0 && (_props$props4 = props.props) !== null && _props$props4 !== void 0 && _props$props4.complaintNumber ? t("CS_PGR_COMPLAINT_NUMBER") : props.props.info), /*#__PURE__*/React__default.createElement("p", {
    style: props !== null && props !== void 0 && (_props$props5 = props.props) !== null && _props$props5 !== void 0 && _props$props5.applicationNumberStyles ? props === null || props === void 0 ? void 0 : (_props$props6 = props.props) === null || _props$props6 === void 0 ? void 0 : _props$props6.applicationNumberStyles : {}
  }, props !== null && props !== void 0 && (_props$props7 = props.props) !== null && _props$props7 !== void 0 && _props$props7.complaintNumber ? props === null || props === void 0 ? void 0 : (_props$props8 = props.props) === null || _props$props8 === void 0 ? void 0 : _props$props8.complaintNumber : props === null || props === void 0 ? void 0 : (_props$props9 = props.props) === null || _props$props9 === void 0 ? void 0 : _props$props9.applicationNumber)));
};

var Error$1 = function Error(props) {
  var _props$props10, _props$props11, _props$props12, _props$props13, _props$props14, _props$props15, _props$props16, _props$props17;

  var _useTranslation2 = reactI18next.useTranslation(),
      t = _useTranslation2.t;

  var user_type = Digit.SessionStorage.get("userType");
  return /*#__PURE__*/React__default.createElement("div", {
    className: user_type === "citizen" ? "error-wrap" : "emp-error-wrap",
    style: props.style ? props.style : {}
  }, /*#__PURE__*/React__default.createElement("header", null, props.props.message), /*#__PURE__*/React__default.createElement(ErrorSvg, null), /*#__PURE__*/React__default.createElement("h2", {
    style: props !== null && props !== void 0 && (_props$props10 = props.props) !== null && _props$props10 !== void 0 && _props$props10.infoStyles ? props === null || props === void 0 ? void 0 : (_props$props11 = props.props) === null || _props$props11 === void 0 ? void 0 : _props$props11.infoStyles : {}
  }, props !== null && props !== void 0 && (_props$props12 = props.props) !== null && _props$props12 !== void 0 && _props$props12.complaintNumber ? t("CS_PGR_COMPLAINT_NUMBER") : props.props.info), /*#__PURE__*/React__default.createElement("p", {
    style: props !== null && props !== void 0 && (_props$props13 = props.props) !== null && _props$props13 !== void 0 && _props$props13.applicationNumberStyles ? props === null || props === void 0 ? void 0 : (_props$props14 = props.props) === null || _props$props14 === void 0 ? void 0 : _props$props14.applicationNumberStyles : {}
  }, props !== null && props !== void 0 && (_props$props15 = props.props) !== null && _props$props15 !== void 0 && _props$props15.complaintNumber ? props === null || props === void 0 ? void 0 : (_props$props16 = props.props) === null || _props$props16 === void 0 ? void 0 : _props$props16.complaintNumber : props === null || props === void 0 ? void 0 : (_props$props17 = props.props) === null || _props$props17 === void 0 ? void 0 : _props$props17.applicationNumber));
};

var Banner = function Banner(props) {
  return props.successful ? /*#__PURE__*/React__default.createElement(Successful, {
    props: props
  }) : /*#__PURE__*/React__default.createElement(Error$1, {
    props: props
  });
};

Banner.propTypes = {
  successful: propTypes.bool.isRequired,
  message: propTypes.any.isRequired,
  complaintNumber: propTypes.any
};
Banner.defaultProps = {
  successful: true
};

var Body = function Body(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "body-container"
  }, props.children);
};

var Breadcrumb = function Breadcrumb(props) {
  var _props$crumbs;

  function isLast(index) {
    return index === props.crumbs.length - 1;
  }

  return /*#__PURE__*/React__default.createElement("ol", {
    className: "bread-crumb"
  }, props === null || props === void 0 ? void 0 : (_props$crumbs = props.crumbs) === null || _props$crumbs === void 0 ? void 0 : _props$crumbs.map(function (crumb, ci) {
    if (!(crumb !== null && crumb !== void 0 && crumb.show)) return;
    return /*#__PURE__*/React__default.createElement("li", {
      key: ci,
      className: "bread-crumb--item"
    }, isLast(ci) || !(crumb !== null && crumb !== void 0 && crumb.path) ? /*#__PURE__*/React__default.createElement("span", {
      style: {
        color: "#0B0C0C"
      }
    }, crumb.content) : /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: crumb.path
    }, crumb.content));
  }));
};

Breadcrumb.propTypes = {
  crumbs: propTypes.array
};
Breadcrumb.defaultProps = {
  successful: true
};

var BreakLine = function BreakLine(_ref) {
  var _ref$style = _ref.style,
      style = _ref$style === void 0 ? {} : _ref$style;
  return /*#__PURE__*/React__default.createElement("hr", {
    color: "#d6d5d4",
    className: "break-line",
    style: style
  });
};

var ButtonSelector = function ButtonSelector(props) {
  var theme = "selector-button-primary";

  switch (props.theme) {
    case "border":
      theme = "selector-button-border";
      break;

    default:
      theme = "selector-button-primary";
      break;
  }

  return /*#__PURE__*/React__default.createElement("button", {
    className: props.isDisabled ? "selector-button-primary-disabled" : theme,
    type: props.type || "submit",
    form: props.formId,
    onClick: props.onSubmit,
    disabled: props.isDisabled,
    style: props.style ? props.style : null
  }, /*#__PURE__*/React__default.createElement("h2", {
    style: props === null || props === void 0 ? void 0 : props.textStyles
  }, props.label));
};

ButtonSelector.propTypes = {
  label: propTypes.string.isRequired,
  theme: propTypes.string,
  onSubmit: propTypes.func
};
ButtonSelector.defaultProps = {
  label: "",
  theme: "",
  onSubmit: undefined
};

var Card = function Card(_ref) {
  var _Digit$UserService$ge;

  var onClick = _ref.onClick,
      style = _ref.style,
      children = _ref.children,
      className = _ref.className,
      ReactRef = _ref.ReactRef,
      props = _objectWithoutPropertiesLoose(_ref, ["onClick", "style", "children", "className", "ReactRef"]);

  var _useLocation = reactRouterDom.useLocation(),
      pathname = _useLocation.pathname;

  var classname = Digit.Hooks.fsm.useRouteSubscription(pathname);
  var info = (_Digit$UserService$ge = Digit.UserService.getUser()) === null || _Digit$UserService$ge === void 0 ? void 0 : _Digit$UserService$ge.info;
  var userType = info === null || info === void 0 ? void 0 : info.type;
  var isEmployee = classname === "employee" || userType === "EMPLOYEE";
  return /*#__PURE__*/React__default.createElement("div", _extends({
    className: (isEmployee ? "employeeCard" : "card") + " " + (className ? className : ""),
    onClick: onClick,
    style: style
  }, props, {
    ref: ReactRef
  }), children);
};

var CardCaption = function CardCaption(props) {
  return /*#__PURE__*/React__default.createElement("label", {
    style: props.style,
    className: "card-caption"
  }, props.children);
};

var CardHeader = function CardHeader(props) {
  return /*#__PURE__*/React__default.createElement("header", {
    className: "card-header"
  }, props.children);
};

var CardLabel = function CardLabel(props) {
  return /*#__PURE__*/React__default.createElement("h2", {
    className: "card-label " + props.className,
    style: props.style
  }, props.children);
};

var CardLabelDesc = function CardLabelDesc(_ref) {
  var children = _ref.children,
      style = _ref.style,
      className = _ref.className;
  return /*#__PURE__*/React__default.createElement("h2", {
    className: "card-label-desc " + (className ? className : ""),
    style: style
  }, children);
};

var CardLabelError = function CardLabelError(props) {
  return /*#__PURE__*/React__default.createElement("h2", {
    className: "card-label-error " + (props !== null && props !== void 0 && props.className ? props === null || props === void 0 ? void 0 : props.className : ""),
    style: props.style
  }, props.children);
};

var CardSectionHeader = function CardSectionHeader(props) {
  return /*#__PURE__*/React__default.createElement("header", {
    id: props.id,
    className: "card-section-header",
    style: props.style
  }, props.children);
};

var CardSubHeader = function CardSubHeader(props) {
  var user_type = Digit.SessionStorage.get("user_type") === "employee" ? true : false;
  return /*#__PURE__*/React__default.createElement("header", {
    className: (user_type ? "employee-card-sub-header" : "card-sub-header") + " " + (props !== null && props !== void 0 && props.className ? props === null || props === void 0 ? void 0 : props.className : ""),
    style: props.style
  }, props.children);
};

var CardText = function CardText(props) {
  return /*#__PURE__*/React__default.createElement("p", {
    className: "card-text " + (props.disable && "disabled") + " " + (props !== null && props !== void 0 && props.className ? props === null || props === void 0 ? void 0 : props.className : ""),
    style: props.style
  }, props.children);
};

var CardText$1 = function CardText(props) {
  return /*#__PURE__*/React__default.createElement("p", {
    className: "card-text-button"
  }, props.children);
};

var CheckBox = function CheckBox(_ref) {
  var onChange = _ref.onChange,
      label = _ref.label,
      value = _ref.value,
      disable = _ref.disable,
      checked = _ref.checked,
      inputRef = _ref.inputRef,
      style = _ref.style,
      props = _objectWithoutPropertiesLoose(_ref, ["onChange", "label", "value", "disable", "ref", "checked", "inputRef", "style"]);

  var userType = Digit.SessionStorage.get("userType");
  var wrkflwStyle = props.styles;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "checkbox-wrap",
    style: wrkflwStyle ? wrkflwStyle : {}
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("input", _extends({
    type: "checkbox",
    className: userType === "employee" ? "input-emp" : "",
    onChange: onChange,
    style: {
      cursor: "pointer"
    },
    value: value || label
  }, props, {
    ref: inputRef,
    disabled: disable,
    checked: checked
  })), /*#__PURE__*/React__default.createElement("p", {
    className: userType === "employee" ? "custom-checkbox-emp" : "custom-checkbox",
    style: disable ? {
      opacity: 0.5
    } : null
  }, /*#__PURE__*/React__default.createElement(CheckSvg, null))), /*#__PURE__*/React__default.createElement("p", {
    className: "label",
    style: style ? style : null
  }, label));
};

CheckBox.propTypes = {
  label: propTypes.string.isRequired,
  onChange: propTypes.func,
  ref: propTypes.func,
  userType: propTypes.string
};
CheckBox.defaultProps = {};

var CitizenHomeCard = function CitizenHomeCard(_ref) {
  var header = _ref.header,
      links = _ref.links,
      state = _ref.state,
      Icon = _ref.Icon;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "CitizenHomeCard"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React__default.createElement("h2", null, header), /*#__PURE__*/React__default.createElement(Icon, null)), /*#__PURE__*/React__default.createElement("div", {
    className: "links"
  }, links.map(function (e, i) {
    return /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      key: i,
      to: {
        pathname: e.link,
        state: state
      }
    }, e.i18nKey);
  })));
};

var CitizenInfoLabel = function CitizenInfoLabel(_ref) {
  var info = _ref.info,
      text = _ref.text,
      _ref$showInfo = _ref.showInfo,
      showInfo = _ref$showInfo === void 0 ? true : _ref$showInfo;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "info-banner-wrap"
  }, showInfo && /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(InfoBannerIcon, null), /*#__PURE__*/React__default.createElement("h2", null, info)), /*#__PURE__*/React__default.createElement("p", null, text));
};

var CheckPoint = function CheckPoint(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: props.isCompleted ? "checkpoint-done" : "checkpoint",
    key: props.keyValue
  }, /*#__PURE__*/React__default.createElement("h2", null), /*#__PURE__*/React__default.createElement("header", null, props.label, props.info ? /*#__PURE__*/React__default.createElement("p", null, props.info) : null, props.customChild ? props.customChild : null));
};
var ConnectingCheckPoints = function ConnectingCheckPoints(props) {
  if (props.children && props.children.length >= 1) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, props.children.map(function (child, index) {
      return props.children.length === ++index ? /*#__PURE__*/React__default.createElement("div", {
        key: index
      }, child) : /*#__PURE__*/React__default.createElement("div", {
        key: index,
        className: "checkpoint-connect-wrap"
      }, child, /*#__PURE__*/React__default.createElement("div", {
        className: "checkpoint-connect"
      }));
    }));
  } else {
    console.warn("ConnectingCheckPoints Components need atleast 2 CheckPoint Components as children");
    return null;
  }
};
CheckPoint.propTypes = {
  isCompleted: propTypes.bool,
  key: propTypes.oneOfType([propTypes.string, propTypes.number]),
  label: propTypes.string,
  info: propTypes.string
};
CheckPoint.defaultProps = {
  isCompleted: false,
  key: 0,
  label: "",
  info: ""
};

var CustomButton = function CustomButton(_ref) {
  var text = _ref.text,
      onClick = _ref.onClick,
      selected = _ref.selected;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("button", {
    tabIndex: "0",
    type: "button",
    className: selected ? "customBtn-selected" : "customBtn",
    onClick: onClick
  }, text));
};

var DatePicker = function DatePicker(props) {
  var dateInp = React.useRef();

  function defaultFormatFunc(date) {
    if (date) {
      var operationDate = typeof date === "string" ? new Date(date) : date;
      var years = operationDate === null || operationDate === void 0 ? void 0 : operationDate.getFullYear();
      var month = (operationDate === null || operationDate === void 0 ? void 0 : operationDate.getMonth()) + 1;

      var _date = operationDate === null || operationDate === void 0 ? void 0 : operationDate.getDate();

      return _date && month && years ? _date + "/" + month + "/" + years : "";
    }

    return "";
  }

  var getDatePrint = function getDatePrint() {
    var _props$formattingFn;

    return (props === null || props === void 0 ? void 0 : (_props$formattingFn = props.formattingFn) === null || _props$formattingFn === void 0 ? void 0 : _props$formattingFn.call(props, props === null || props === void 0 ? void 0 : props.date)) || defaultFormatFunc(props === null || props === void 0 ? void 0 : props.date);
  };

  var selectDate = function selectDate(e) {
    var _props$onChange;

    var date = e.target.value;
    props === null || props === void 0 ? void 0 : (_props$onChange = props.onChange) === null || _props$onChange === void 0 ? void 0 : _props$onChange.call(props, date);
  };

  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      position: "relative",
      width: "100%"
    }
  }, /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("input", {
    type: "text",
    disabled: props.disabled,
    value: getDatePrint() ? getDatePrint() : "",
    readOnly: true,
    className: "employee-card-input " + (props.disabled ? "disabled" : ""),
    style: {
      width: "calc(100%-62px)"
    }
  }), /*#__PURE__*/React__default.createElement(CalendarIcon, {
    isdisabled: props.disabled ? true : false,
    style: {
      right: "6px",
      zIndex: "10",
      top: 6,
      position: "absolute"
    }
  }), /*#__PURE__*/React__default.createElement("input", {
    className: "" + (props.disabled ? "disabled" : ""),
    style: {
      right: "6px",
      zIndex: "100",
      top: 6,
      position: "absolute",
      opacity: 0,
      width: "100%"
    },
    value: props.date ? props.date : "",
    type: "date",
    ref: dateInp,
    disabled: props.disabled,
    onChange: selectDate,
    defaultValue: props.defaultValue,
    min: props.min,
    max: props.max,
    required: props.isRequired || false
  })));
};

DatePicker.propTypes = {
  disabled: propTypes.bool,
  date: propTypes.any,
  min: propTypes.any,
  max: propTypes.any,
  defaultValue: propTypes.any,
  onChange: propTypes.func
};

var DateWrap = function DateWrap(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "date-wrap"
  }, /*#__PURE__*/React__default.createElement(Calender, null), /*#__PURE__*/React__default.createElement("p", null, props.date));
};

DateWrap.propTypes = {
  date: propTypes.any
};
DateWrap.defaultProps = {
  date: 0
};

var DisplayPhotos = function DisplayPhotos(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "photos-wrap"
  }, props.srcs.map(function (source, index) {
    return ++index !== props.srcs.length ? /*#__PURE__*/React__default.createElement("img", {
      key: index,
      src: source,
      alt: "issue thumbnail",
      onClick: function onClick() {
        return props.onClick(source, index);
      }
    }) : /*#__PURE__*/React__default.createElement("img", {
      key: index,
      src: source,
      className: "last",
      alt: "issue thumbnail",
      onClick: function onClick() {
        return props.onClick(source, index);
      }
    });
  }));
};

DisplayPhotos.propTypes = {
  srcs: propTypes.array,
  onClick: propTypes.func
};
DisplayPhotos.defaultProps = {
  srcs: []
};

var TextField = function TextField(props) {
  var _useState = React.useState(props.selectedVal ? props.selectedVal : ""),
      value = _useState[0],
      setValue = _useState[1];

  React.useEffect(function () {
    if (!props.keepNull) props.selectedVal ? setValue(props.selectedVal) : setValue("");else setValue("");
  }, [props.selectedVal, props.forceSet]);

  function inputChange(e) {
    if (props.freeze) return;
    setValue(e.target.value);
    props.setFilter(e.target.value);
  }

  function broadcastToOpen() {
    if (!props.disable) {
      props.dropdownDisplay(true);
    }
  }

  function broadcastToClose() {
    props.dropdownDisplay(false);
  }

  return /*#__PURE__*/React__default.createElement("input", {
    ref: props.inputRef,
    className: "employee-select-wrap--elipses " + (props.disable && "disabled"),
    type: "text",
    value: value,
    autoComplete: props.autoComplete || "on",
    onChange: inputChange,
    onClick: props.onClick,
    onFocus: broadcastToOpen,
    onBlur: function onBlur(e) {
      var _props$onBlur;

      broadcastToClose();
      props === null || props === void 0 ? void 0 : (_props$onBlur = props.onBlur) === null || _props$onBlur === void 0 ? void 0 : _props$onBlur.call(props, e);
    },
    readOnly: props.disable,
    autoFocus: props.autoFocus,
    placeholder: props.placeholder
  });
};

var translateDummy = function translateDummy(text) {
  return text;
};

var Dropdown = function Dropdown(props) {
  var user_type = Digit.SessionStorage.get("userType");

  var _useState2 = React.useState(false),
      dropdownStatus = _useState2[0],
      setDropdownStatus = _useState2[1];

  var _useState3 = React.useState(props.selected ? props.selected : null),
      selectedOption = _useState3[0],
      setSelectedOption = _useState3[1];

  var _useState4 = React.useState(""),
      filterVal = _useState4[0],
      setFilterVal = _useState4[1];

  var _useState5 = React.useState(0),
      forceSet = _useState5[0],
      setforceSet = _useState5[1];

  var optionRef = React.useRef(null);
  var hasCustomSelector = props.customSelector ? true : false;
  var t = props.t || translateDummy;
  React.useEffect(function () {
    setSelectedOption(props.selected);
  }, [props.selected]);

  function dropdownSwitch() {
    if (!props.disable) {
      var _props$onBlur2;

      var current = dropdownStatus;

      if (!current) {
        document.addEventListener("mousedown", handleClick, false);
      }

      setDropdownStatus(!current);
      props === null || props === void 0 ? void 0 : (_props$onBlur2 = props.onBlur) === null || _props$onBlur2 === void 0 ? void 0 : _props$onBlur2.call(props);
    }
  }

  function handleClick(e) {
    if (!optionRef.current || !optionRef.current.contains(e.target)) {
      document.removeEventListener("mousedown", handleClick, false);
      setDropdownStatus(false);
    }
  }

  function dropdownOn(val) {
    var waitForOptions = function waitForOptions() {
      return setTimeout(function () {
        return setDropdownStatus(val);
      }, 500);
    };

    var timerId = waitForOptions();
    return function () {
      clearTimeout(timerId);
    };
  }

  function onSelect(val) {
    if (val !== selectedOption) {
      props.select(val);
      setSelectedOption(val);
      setDropdownStatus(false);
    } else {
      setSelectedOption(val);
      setforceSet(forceSet + 1);
    }
  }

  function setFilter(val) {
    setFilterVal(val);
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: (user_type === "employee" ? "employee-select-wrap" : "select-wrap") + " " + (props !== null && props !== void 0 && props.className ? props === null || props === void 0 ? void 0 : props.className : ""),
    style: _extends({}, props.style)
  }, hasCustomSelector && /*#__PURE__*/React__default.createElement("div", {
    className: props.showArrow ? "cp flex-right column-gap-5" : "cp",
    onClick: dropdownSwitch
  }, props.customSelector, props.showArrow && /*#__PURE__*/React__default.createElement(ArrowDown, {
    onClick: dropdownSwitch,
    className: props.disable && "disabled"
  })), !hasCustomSelector && /*#__PURE__*/React__default.createElement("div", {
    className: (dropdownStatus ? "select-active" : "select") + " " + (props.disable && "disabled"),
    style: props.errorStyle ? {
      border: "1px solid red"
    } : {}
  }, /*#__PURE__*/React__default.createElement(TextField, {
    autoComplete: props.autoComplete,
    setFilter: setFilter,
    forceSet: forceSet,
    keepNull: props.keepNull,
    selectedVal: selectedOption ? props.t ? props.t(props.optionKey ? selectedOption[props.optionKey] : selectedOption) : props.optionKey ? selectedOption[props.optionKey] : selectedOption : null,
    filterVal: filterVal,
    dropdownDisplay: dropdownOn,
    disable: props.disable,
    freeze: props.freeze ? true : false,
    autoFocus: props.autoFocus,
    placeholder: props.placeholder,
    onBlur: props === null || props === void 0 ? void 0 : props.onBlur,
    inputRef: props.ref
  }), /*#__PURE__*/React__default.createElement(ArrowDown, {
    onClick: dropdownSwitch,
    className: "cp",
    disable: props.disable
  })), dropdownStatus ? props.optionKey ? /*#__PURE__*/React__default.createElement("div", {
    className: (hasCustomSelector ? "margin-top-10 display: table" : "") + " options-card",
    style: _extends({}, props.optionCardStyles),
    ref: optionRef
  }, props.option && props.option.filter(function (option) {
    return t(option[props.optionKey]).toUpperCase().indexOf(filterVal.toUpperCase()) > -1;
  }).map(function (option, index) {

    return /*#__PURE__*/React__default.createElement("div", {
      className: "cp profile-dropdown--item display: flex",
      key: index,
      onClick: function onClick() {
        return onSelect(option);
      }
    }, option.icon && /*#__PURE__*/React__default.createElement("span", {
      className: "icon"
    }, " ", option.icon, " "), /*#__PURE__*/React__default.createElement("span", null, " ", props.t ? props.t(option[props.optionKey]) : option[props.optionKey]));
  })) : /*#__PURE__*/React__default.createElement("div", {
    className: "options-card",
    style: props.optionCardStyles,
    ref: optionRef
  }, props.option.filter(function (option) {
    return option.toUpperCase().indexOf(filterVal.toUpperCase()) > -1;
  }).map(function (option, index) {
    return /*#__PURE__*/React__default.createElement("p", {
      key: index,
      onClick: function onClick() {
        return onSelect(option);
      }
    }, option);
  })) : null);
};

Dropdown.propTypes = {
  customSelector: propTypes.any,
  showArrow: propTypes.bool,
  selected: propTypes.any,
  style: propTypes.object,
  option: propTypes.array,
  optionKey: propTypes.any,
  select: propTypes.any,
  t: propTypes.func
};
Dropdown.defaultProps = {
  customSelector: null,
  showArrow: true
};

var Menu = function Menu(_ref) {
  var menu = _ref.menu,
      displayKey = _ref.displayKey,
      onSelect = _ref.onSelect;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "menu"
  }, menu.map(function (item, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "item",
      onClick: function onClick() {
        return onSelect(item);
      },
      key: index
    }, item.icon, /*#__PURE__*/React__default.createElement("span", null, item[displayKey]));
  }));
};

var EllipsisMenu = function EllipsisMenu(_ref2) {
  var menuItems = _ref2.menuItems,
      displayKey = _ref2.displayKey,
      onSelect = _ref2.onSelect;
  var menuRef = React.useRef();

  var _useState = React.useState(false),
      active = _useState[0],
      setActive = _useState[1];

  Digit.Hooks.useClickOutside(menuRef, function () {
    return setActive(false);
  }, active);

  function onItemSelect(item) {
    setActive(false);
    onSelect(item);
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "ellipsis-menu-wrap",
    ref: menuRef
  }, /*#__PURE__*/React__default.createElement(Ellipsis, {
    className: "cursorPointer",
    onClick: function onClick() {
      return setActive(true);
    }
  }), active ? /*#__PURE__*/React__default.createElement(Menu, {
    menu: menuItems,
    displayKey: displayKey,
    onSelect: onItemSelect
  }) : null);
};

var EmployeeAppContainer = function EmployeeAppContainer(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "employee-app-container"
  }, props.children);
};

var EmployeeModuleCard = function EmployeeModuleCard(_ref) {
  var Icon = _ref.Icon,
      moduleName = _ref.moduleName,
      _ref$kpis = _ref.kpis,
      kpis = _ref$kpis === void 0 ? [] : _ref$kpis,
      _ref$links = _ref.links,
      links = _ref$links === void 0 ? [] : _ref$links;
  var checkLocation = window.location.href.includes("citizen");
  return /*#__PURE__*/React__default.createElement("div", {
    className: "employeeCard card-home",
    style: checkLocation ? {
      margin: "0px 16px 24px 16px",
      padding: "0px"
    } : {}
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "complaint-links-container"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "text"
  }, moduleName), /*#__PURE__*/React__default.createElement("span", {
    className: "logo"
  }, Icon)), /*#__PURE__*/React__default.createElement("div", {
    className: "body",
    style: {
      margin: "0px",
      padding: "0px"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "flex-fit"
  }, kpis.map(function (_ref2) {
    var count = _ref2.count,
        label = _ref2.label,
        link = _ref2.link;
    return /*#__PURE__*/React__default.createElement("div", {
      className: "card-count"
    }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", null, count || "-")), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: link
    }, label)));
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "links-wrapper"
  }, links.map(function (_ref3) {
    var count = _ref3.count,
        label = _ref3.label,
        link = _ref3.link;
    return /*#__PURE__*/React__default.createElement("span", {
      className: "link"
    }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: link
    }, label), count ? /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement("span", {
      className: "inbox-total"
    }, count || "-"), /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: link
    }, /*#__PURE__*/React__default.createElement(ArrowRightInbox, null))) : null);
  })))));
};

var GreyOutText = function GreyOutText(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "grey"
  }, props.children);
};

var Hamburger = function Hamburger(_ref) {
  var handleClick = _ref.handleClick,
      color = _ref.color;
  return /*#__PURE__*/React__default.createElement("span", {
    style: {
      marginRight: "10px"
    },
    className: "cp",
    onClick: handleClick
  }, /*#__PURE__*/React__default.createElement(HamburgerIcon, {
    styles: {
      display: "inline"
    },
    color: color
  }));
};

var Header = function Header(props) {
  return /*#__PURE__*/React__default.createElement("header", {
    className: "h1",
    style: props.styles
  }, props.children);
};

var HeaderBar = function HeaderBar(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "header-wrap"
  }, props.start ? /*#__PURE__*/React__default.createElement("div", {
    className: "header-start"
  }, props.start) : null, props.main ? /*#__PURE__*/React__default.createElement("div", {
    className: "header-content"
  }, props.main) : null, props.end ? /*#__PURE__*/React__default.createElement("div", {
    className: "header-end"
  }, props.end) : null);
};

HeaderBar.propTypes = {
  start: propTypes.any,
  main: propTypes.any,
  end: propTypes.any
};
HeaderBar.defaultProps = {
  start: "",
  main: "",
  end: ""
};

var HomeLink = function HomeLink(_ref) {
  var to = _ref.to,
      children = _ref.children;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "home-link"
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: to
  }, children));
};

HomeLink.propTypes = {
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
  children: propTypes.string
};
HomeLink.defaultProps = {
  to: "#",
  children: "Link"
};

var Toast = function Toast(props) {
  if (props.error) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "toast-success",
      style: _extends({
        backgroundColor: "red"
      }, props.style)
    }, /*#__PURE__*/React__default.createElement(RoundedCheck, null), /*#__PURE__*/React__default.createElement("h2", null, props.label));
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "toast-success",
    style: _extends({}, props.style)
  }, /*#__PURE__*/React__default.createElement(RoundedCheck, null), /*#__PURE__*/React__default.createElement("h2", null, props.label), /*#__PURE__*/React__default.createElement(DeleteBtn, {
    fill: "none",
    className: "toast-close-btn",
    onClick: props.onClose
  }));
};

Toast.propTypes = {
  label: propTypes.string,
  onClose: propTypes.func
};
Toast.defaultProps = {
  label: "",
  onClose: undefined
};

var MiniUpload = function MiniUpload(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "upload-img-container"
  }, /*#__PURE__*/React__default.createElement(CameraSvg, {
    className: "upload-camera-img"
  }), /*#__PURE__*/React__default.createElement("input", {
    type: "file",
    id: "miniupload",
    accept: "image/*",
    onChange: function onChange(e) {
      return props.onUpload(e);
    }
  }));
};

var UploadImages = function UploadImages(props) {
  if (props.thumbnails && props.thumbnails.length > 0) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "multi-upload-wrap"
    }, props.thumbnails.map(function (thumbnail, index) {
      return /*#__PURE__*/React__default.createElement("div", {
        key: index
      }, /*#__PURE__*/React__default.createElement(DeleteBtn, {
        onClick: function onClick() {
          return props.onDelete(thumbnail);
        },
        className: "delete",
        fill: "#d4351c"
      }), /*#__PURE__*/React__default.createElement("img", {
        src: thumbnail,
        alt: "uploaded thumbnail"
      }));
    }), props.thumbnails.length < 3 ? /*#__PURE__*/React__default.createElement(MiniUpload, {
      onUpload: props.onUpload
    }) : null);
  } else {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "upload-wrap",
      onClick: function onClick(e) {
        return props.onUpload(e);
      }
    }, /*#__PURE__*/React__default.createElement(CameraSvg, null), /*#__PURE__*/React__default.createElement("input", {
      type: "file",
      id: "upload",
      accept: "image/*",
      onChange: function onChange(e) {
        return props.onUpload(e);
      }
    }));
  }
};

UploadImages.propTypes = {
  thumbnail: propTypes.array,
  onUpload: propTypes.func
};
UploadImages.defaultProps = {
  thumbnail: [],
  onUpload: undefined
};

var ImageUploadHandler = function ImageUploadHandler(props) {
  var _useState = React.useState(null),
      image = _useState[0],
      setImage = _useState[1];

  var _useState2 = React.useState(null),
      uploadedImagesThumbs = _useState2[0],
      setUploadedImagesThumbs = _useState2[1];

  var _useState3 = React.useState(props.uploadedImages),
      uploadedImagesIds = _useState3[0],
      setUploadedImagesIds = _useState3[1];

  var _useState4 = React.useState(1),
      rerender = _useState4[0],
      setRerender = _useState4[1];

  var _useState5 = React.useState(null),
      imageFile = _useState5[0],
      setImageFile = _useState5[1];

  var _useState6 = React.useState(false),
      isDeleting = _useState6[0],
      setIsDeleting = _useState6[1];

  var _useState7 = React.useState(""),
      error = _useState7[0],
      setError = _useState7[1];

  React.useEffect(function () {
    if (image) {
      uploadImage();
    }
  }, [image]);
  React.useEffect(function () {
    if (!isDeleting) {
      (function () {
        try {
          var _temp2 = function () {
            if (uploadedImagesIds !== null) {
              return Promise.resolve(submit()).then(function () {
                setRerender(rerender + 1);
                props.onPhotoChange(uploadedImagesIds);
              });
            }
          }();

          return _temp2 && _temp2.then ? _temp2.then(function () {}) : void 0;
        } catch (e) {
          Promise.reject(e);
        }
      })();
    } else {
      setIsDeleting(false);
    }
  }, [uploadedImagesIds]);
  React.useEffect(function () {
    if (imageFile && imageFile.size > 2097152) {
      setError("File is too large");
    } else {
      setImage(imageFile);
    }
  }, [imageFile]);
  var addUploadedImageIds = React.useCallback(function (imageIdData) {
    if (uploadedImagesIds === null) {
      var arr = [];
    } else {
      arr = uploadedImagesIds;
    }

    return [].concat(arr, [imageIdData.data.files[0].fileStoreId]);
  }, [uploadedImagesIds]);

  function getImage(e) {
    setError(null);
    setImageFile(e.target.files[0]);
  }

  var uploadImage = React.useCallback(function () {
    try {
      return Promise.resolve(Digit.UploadServices.Filestorage("property-upload", image, props.tenantId)).then(function (response) {
        setUploadedImagesIds(addUploadedImageIds(response));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }, [addUploadedImageIds, image]);

  function addImageThumbnails(thumbnailsData) {
    var keys = Object.keys(thumbnailsData.data);
    var index = keys.findIndex(function (key) {
      return key === "fileStoreIds";
    });

    if (index > -1) {
      keys.splice(index, 1);
    }

    var thumbnails = [];
    var newThumbnails = keys.map(function (key) {
      return {
        image: thumbnailsData.data[key].split(",")[2],
        key: key
      };
    });
    setUploadedImagesThumbs([].concat(thumbnails, newThumbnails));
  }

  var submit = React.useCallback(function () {
    try {
      var _temp4 = function () {
        if (uploadedImagesIds !== null && uploadedImagesIds.length > 0) {
          return Promise.resolve(Digit.UploadServices.Filefetch(uploadedImagesIds, props.tenantId)).then(function (res) {
            addImageThumbnails(res);
          });
        }
      }();

      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  }, [uploadedImagesIds]);

  function deleteImage(img) {
    setIsDeleting(true);
    var deleteImageKey = uploadedImagesThumbs.filter(function (o, index) {
      return o.image === img;
    });
    var uploadedthumbs = uploadedImagesThumbs;
    var newThumbsList = uploadedthumbs.filter(function (thumbs) {
      return thumbs != deleteImageKey[0];
    });
    var newUploadedImagesIds = uploadedImagesIds.filter(function (key) {
      return key !== deleteImageKey[0].key;
    });
    setUploadedImagesThumbs(newThumbsList);
    setUploadedImagesIds(newUploadedImagesIds);
    Digit.SessionStorage.set("PGR_CREATE_IMAGES", newUploadedImagesIds);
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, error && /*#__PURE__*/React__default.createElement(Toast, {
    error: true,
    label: error,
    onClose: function onClose() {
      return setError(null);
    }
  }), /*#__PURE__*/React__default.createElement(UploadImages, {
    onUpload: getImage,
    onDelete: deleteImage,
    thumbnails: uploadedImagesThumbs ? uploadedImagesThumbs.map(function (o) {
      return o.image;
    }) : []
  }));
};

var ImageViewer = function ImageViewer(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "image-viewer-wrap"
  }, /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "white",
    width: "18px",
    height: "18px",
    onClick: props.onClose
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
  })), /*#__PURE__*/React__default.createElement("img", {
    src: props.imageSrc
  }));
};

ImageViewer.propTypes = {
  imageSrc: propTypes.string
};
ImageViewer.defaultProps = {
  imageSrc: ""
};

var InfoBanner = function InfoBanner(_ref) {
  var label = _ref.label,
      text = _ref.text;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "info-banner-wrap"
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(InfoBannerIcon, null), /*#__PURE__*/React__default.createElement("h2", null, label)), /*#__PURE__*/React__default.createElement("p", null, text));
};

var KeyNote = function KeyNote(_ref) {
  var keyValue = _ref.keyValue,
      note = _ref.note,
      caption = _ref.caption,
      noteStyle = _ref.noteStyle,
      children = _ref.children;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "key-note-pair"
  }, /*#__PURE__*/React__default.createElement("h3", null, keyValue), /*#__PURE__*/React__default.createElement("p", {
    style: noteStyle
  }, note), /*#__PURE__*/React__default.createElement("p", {
    className: "caption"
  }, caption), children);
};

KeyNote.propTypes = {
  keyValue: propTypes.string,
  note: propTypes.oneOfType([propTypes.string, propTypes.number]),
  noteStyle: propTypes.any
};
KeyNote.defaultProps = {
  keyValue: "",
  note: "",
  noteStyle: {}
};

var Label = function Label(props) {
  return /*#__PURE__*/React__default.createElement("h4", {
    className: "h4"
  }, props.children);
};

var LabelFieldPair = function LabelFieldPair(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    style: _extends({}, props.style),
    className: "label-field-pair"
  }, props.children);
};

var LinkButton = function LinkButton(props) {
  return /*#__PURE__*/React__default.createElement("span", {
    className: "card-link cp " + props.className,
    onClick: props.onClick,
    style: props.style
  }, props.label);
};

LinkButton.propTypes = {
  label: propTypes.any,
  onClick: propTypes.func
};
LinkButton.defaultProps = {};

var LinkLabel = function LinkLabel(props) {
  return /*#__PURE__*/React__default.createElement("label", {
    className: "link-label",
    onClick: props.onClick,
    style: _extends({}, props.style)
  }, props.children);
};

var Loader = function Loader(_ref) {
  var _ref$page = _ref.page,
      page = _ref$page === void 0 ? false : _ref$page;
  return /*#__PURE__*/React__default.createElement("div", {
    className: (page ? "page" : "module") + "-loader"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "loadingio-spinner-rolling-faewnb8ux8"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "ldio-pjg92h09b2o"
  }, /*#__PURE__*/React__default.createElement("div", null))));
};
Loader.propTypes = {
  page: propTypes.bool
};
Loader.defaultProps = {
  page: false
};

var defaultBounds = {};

var updateDefaultBounds = function updateDefaultBounds(center) {
  if (!center.lat || !center.lng) {
    return;
  }

  defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1
  };
};

var GetPinCode = function GetPinCode(places) {
  var _places$address_compo;

  var postalCode = null;
  places === null || places === void 0 ? void 0 : (_places$address_compo = places.address_components) === null || _places$address_compo === void 0 ? void 0 : _places$address_compo.forEach(function (place) {
    var hasPostalCode = place.types.includes("postal_code");
    postalCode = hasPostalCode ? place.long_name : null;
  });
  return postalCode;
};

var getName = function getName(places) {
  var _places$address_compo2;

  var name = "";
  places === null || places === void 0 ? void 0 : (_places$address_compo2 = places.address_components) === null || _places$address_compo2 === void 0 ? void 0 : _places$address_compo2.forEach(function (place) {
    var hasName = place.types.includes("sublocality_level_2") || place.types.includes("sublocality_level_1");

    if (hasName) {
      name = hasName ? place.long_name : null;
    }
  });
  return name;
};

var loadGoogleMaps = function loadGoogleMaps(callback) {
  var _globalConfigs;

  var key = (_globalConfigs = globalConfigs) === null || _globalConfigs === void 0 ? void 0 : _globalConfigs.getConfig("GMAPS_API_KEY");
  var loader = new jsApiLoader.Loader({
    apiKey: key,
    version: "weekly",
    libraries: ["places"]
  });
  loader.load().then(function () {
    if (callback) callback();
  }).catch(function (e) {});
};

var mapStyles = [{
  elementType: "geometry",
  stylers: [{
    color: "#f5f5f5"
  }]
}, {
  elementType: "labels.icon",
  stylers: [{
    visibility: "off"
  }]
}, {
  elementType: "labels.text.fill",
  stylers: [{
    color: "#616161"
  }]
}, {
  elementType: "labels.text.stroke",
  stylers: [{
    color: "#f5f5f5"
  }]
}, {
  featureType: "administrative.land_parcel",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#bdbdbd"
  }]
}, {
  featureType: "poi",
  elementType: "geometry",
  stylers: [{
    color: "#eeeeee"
  }]
}, {
  featureType: "poi",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#757575"
  }]
}, {
  featureType: "poi.park",
  elementType: "geometry",
  stylers: [{
    color: "#e5e5e5"
  }]
}, {
  featureType: "poi.park",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#9e9e9e"
  }]
}, {
  featureType: "road",
  elementType: "geometry",
  stylers: [{
    color: "#ffffff"
  }]
}, {
  featureType: "road.arterial",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#757575"
  }]
}, {
  featureType: "road.highway",
  elementType: "geometry",
  stylers: [{
    color: "#dadada"
  }]
}, {
  featureType: "road.highway",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#616161"
  }]
}, {
  featureType: "road.local",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#9e9e9e"
  }]
}, {
  featureType: "transit.line",
  elementType: "geometry",
  stylers: [{
    color: "#e5e5e5"
  }]
}, {
  featureType: "transit.station",
  elementType: "geometry",
  stylers: [{
    color: "#eeeeee"
  }]
}, {
  featureType: "water",
  elementType: "geometry",
  stylers: [{
    color: "#c9c9c9"
  }]
}, {
  featureType: "water",
  elementType: "labels.text.fill",
  stylers: [{
    color: "#9e9e9e"
  }]
}];

var setLocationText = function setLocationText(location, onChange) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    location: location
  }, function (results, status) {
    if (status === "OK") {
      if (results[0]) {
        var pincode = GetPinCode(results[0]);
        var infoWindowContent = document.getElementById("pac-input");
        infoWindowContent.value = getName(results[0]);

        if (onChange) {
          onChange(pincode, {
            longitude: location.lng,
            latitude: location.lat
          });
        }
      } else {
        console.log("No results found");
      }
    } else {
      console.log("Geocoder failed due to: " + status);
    }
  });
};

var onMarkerDragged = function onMarkerDragged(marker, onChange) {
  if (!marker) return;
  var latLng = marker.latLng;
  var currLat = latLng.lat();
  var currLang = latLng.lng();
  var location = {
    lat: currLat,
    lng: currLang
  };
  setLocationText(location, onChange);
};

var initAutocomplete = function initAutocomplete(onChange, position) {
  var map = new window.google.maps.Map(document.getElementById("map"), {
    center: position,
    zoom: 15,
    mapTypeId: "roadmap",
    styles: mapStyles
  });
  var input = document.getElementById("pac-input");
  updateDefaultBounds(position);
  var options = {
    bounds: defaultBounds,
    componentRestrictions: {
      country: "in"
    },
    fields: ["address_components", "geometry", "icon", "name"],
    origin: position,
    strictBounds: false,
    types: ["address"]
  };
  var searchBox = new window.google.maps.places.Autocomplete(input, options);
  map.addListener("bounds_changed", function () {
    searchBox.setBounds(map.getBounds());
  });
  var markers = [new window.google.maps.Marker({
    map: map,
    title: "a",
    position: position,
    draggable: true,
    clickable: true
  })];
  setLocationText(position, onChange);
  markers[0].addListener("dragend", function (marker) {
    return onMarkerDragged(marker, onChange);
  });
  searchBox.addListener("place_changed", function () {
    var place = searchBox.getPlace();

    if (!place) {
      return;
    }

    var pincode = GetPinCode(place);

    if (pincode) {
      var geometry = place.geometry;
      var geoLocation = {
        latitude: geometry.location.lat(),
        longitude: geometry.location.lng()
      };
      onChange(pincode, geoLocation);
    }

    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];
    var bounds = new window.google.maps.LatLngBounds();

    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }

    markers.push(new window.google.maps.Marker({
      map: map,
      title: place.name,
      position: place.geometry.location,
      draggable: true,
      clickable: true
    }));
    markers[0].addListener("dragend", function (marker) {
      return onMarkerDragged(marker, onChange);
    });

    if (place.geometry.viewport) {
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });
};

var LocationSearch = function LocationSearch(props) {
  React.useEffect(function () {
    var mapScriptCall = function mapScriptCall() {
      try {
        var getLatLng = function getLatLng(position) {
          initAutocomplete(props.onChange, {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        };

        var getLatLngError = function getLatLngError(error) {
          console.log("geo location error", error);
          var defaultLatLong = {};

          if (props !== null && props !== void 0 && props.isPTDefault) {
            var _props$PTdefaultcoord;

            defaultLatLong = (props === null || props === void 0 ? void 0 : (_props$PTdefaultcoord = props.PTdefaultcoord) === null || _props$PTdefaultcoord === void 0 ? void 0 : _props$PTdefaultcoord.defaultConfig) || {
              lat: 31.6160638,
              lng: 74.8978579
            };
          } else {
            defaultLatLong = {
              lat: 31.6160638,
              lng: 74.8978579
            };
          }

          initAutocomplete(props.onChange, defaultLatLong);
        };

        var initMaps = function initMaps() {
          var _props$position, _props$position2, _navigator;

          if ((_props$position = props.position) !== null && _props$position !== void 0 && _props$position.latitude && (_props$position2 = props.position) !== null && _props$position2 !== void 0 && _props$position2.longitude) {
            getLatLng({
              coords: props.position
            });
          } else if ((_navigator = navigator) !== null && _navigator !== void 0 && _navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getLatLng, getLatLngError);
          } else {
            getLatLngError();
          }
        };

        loadGoogleMaps(initMaps);
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };

    mapScriptCall();
  }, []);
  return /*#__PURE__*/React__default.createElement("div", {
    className: "map-wrap"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "map-search-bar-wrap"
  }, /*#__PURE__*/React__default.createElement(SearchIconSvg, {
    className: "map-search-bar-icon"
  }), /*#__PURE__*/React__default.createElement("input", {
    id: "pac-input",
    className: "map-search-bar",
    type: "text",
    placeholder: "Search Address"
  })), /*#__PURE__*/React__default.createElement("div", {
    id: "map",
    className: "map"
  }));
};

var Menu$1 = function Menu(props) {
  var keyPrefix = props.localeKeyPrefix || "CS_ACTION";
  return /*#__PURE__*/React__default.createElement("div", {
    className: "menu-wrap"
  }, props.options.map(function (option, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: index,
      onClick: function onClick() {
        return props.onSelect(option);
      }
    }, /*#__PURE__*/React__default.createElement("p", null, props.t ? props.t(option.forcedName || keyPrefix + "_" + (props.optionKey ? option[props.optionKey] : option)) : option));
  }));
};

Menu$1.propTypes = {
  options: propTypes.array,
  onSelect: propTypes.func
};
Menu$1.defaultProps = {
  options: [],
  onSelect: function onSelect() {}
};

var MobileNumber = function MobileNumber(props) {
  var user_type = Digit.SessionStorage.get("userType");

  var onChange = function onChange(e) {
    var _props$onChange;

    var val = e.target.value;

    if (isNaN(val) || [" ", "e", "E"].some(function (e) {
      return val.includes(e);
    }) || val.length > (props.maxLength || 10)) {
      val = val.slice(0, -1);
    }

    props === null || props === void 0 ? void 0 : (_props$onChange = props.onChange) === null || _props$onChange === void 0 ? void 0 : _props$onChange.call(props, val);
  };

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "field-container"
  }, !props.hideSpan ? /*#__PURE__*/React__default.createElement("span", {
    style: _extends({
      maxWidth: "50px",
      marginTop: "unset"
    }, props.labelStyle),
    className: "citizen-card-input citizen-card-input--front"
  }, "+91") : null, /*#__PURE__*/React__default.createElement("div", {
    className: "text-input " + props.className
  }, /*#__PURE__*/React__default.createElement("input", {
    type: "text",
    name: props.name,
    id: props.id,
    className: (user_type ? "employee-card-input" : "citizen-card-input") + " " + (props.disable && "disabled") + " focus-visible " + (props.errorStyle && "employee-card-input-error"),
    placeholder: props.placeholder,
    onChange: onChange,
    ref: props.inputRef,
    value: props.value,
    style: _extends({}, props.style),
    minLength: props.minlength,
    maxLength: props.maxlength,
    max: props.max,
    pattern: props.pattern,
    min: props.min,
    readOnly: props.disable,
    title: props.title,
    step: props.step,
    autoFocus: props.autoFocus,
    onBlur: props.onBlur,
    autoComplete: "off"
  }))));
};

MobileNumber.propTypes = {
  userType: propTypes.string,
  isMandatory: propTypes.bool,
  name: propTypes.string,
  placeholder: propTypes.string,
  onChange: propTypes.func,
  ref: propTypes.func,
  value: propTypes.any
};
MobileNumber.defaultProps = {
  isMandatory: false
};

var MultiLink = function MultiLink(_ref) {
  var className = _ref.className,
      onHeadClick = _ref.onHeadClick,
      _ref$displayOptions = _ref.displayOptions,
      displayOptions = _ref$displayOptions === void 0 ? false : _ref$displayOptions,
      options = _ref.options,
      label = _ref.label,
      icon = _ref.icon,
      showOptions = _ref.showOptions;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var menuRef = React.useRef();
  var handleOnClick = React.useCallback(function () {
    showOptions === null || showOptions === void 0 ? void 0 : showOptions(false);
  }, []);
  Digit.Hooks.useClickOutside(menuRef, handleOnClick, displayOptions);
  return /*#__PURE__*/React__default.createElement("div", {
    className: className,
    ref: menuRef
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "multilink-labelWrap",
    onClick: onHeadClick
  }, icon ? icon : /*#__PURE__*/React__default.createElement(PrimaryDownlaodIcon, null), /*#__PURE__*/React__default.createElement(LinkButton, {
    label: label || t("CS_COMMON_DOWNLOAD"),
    className: "multilink-link-button"
  })), displayOptions ? /*#__PURE__*/React__default.createElement("div", {
    className: "multilink-optionWrap"
  }, options.map(function (option, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      onClick: function onClick() {
        return option.onClick();
      },
      key: index,
      className: "multilink-option"
    }, option === null || option === void 0 ? void 0 : option.icon, option.label);
  })) : null);
};

var MultiSelectDropdown = function MultiSelectDropdown(_ref) {
  var options = _ref.options,
      optionsKey = _ref.optionsKey,
      _ref$selected = _ref.selected,
      selected = _ref$selected === void 0 ? [] : _ref$selected,
      onSelect = _ref.onSelect,
      _ref$defaultLabel = _ref.defaultLabel,
      defaultLabel = _ref$defaultLabel === void 0 ? "" : _ref$defaultLabel,
      _ref$defaultUnit = _ref.defaultUnit,
      defaultUnit = _ref$defaultUnit === void 0 ? "" : _ref$defaultUnit,
      _ref$BlockNumber = _ref.BlockNumber,
      BlockNumber = _ref$BlockNumber === void 0 ? 1 : _ref$BlockNumber,
      _ref$isOBPSMultiple = _ref.isOBPSMultiple,
      isOBPSMultiple = _ref$isOBPSMultiple === void 0 ? false : _ref$isOBPSMultiple;

  var _useState = React.useState(false),
      active = _useState[0],
      setActive = _useState[1];

  var _useState2 = React.useState(),
      searchQuery = _useState2[0],
      setSearchQuery = _useState2[1];

  var dropdownRef = React.useRef();

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  Digit.Hooks.useClickOutside(dropdownRef, function () {
    return setActive(false);
  }, active);

  function onSearch(e) {
    setSearchQuery(e.target.value);
  }

  var MenuItem = function MenuItem(_ref2) {
    var option = _ref2.option,
        index = _ref2.index;
    return /*#__PURE__*/React__default.createElement("div", {
      key: index
    }, /*#__PURE__*/React__default.createElement("input", {
      type: "checkbox",
      value: option[optionsKey],
      checked: selected.find(function (selectedOption) {
        return selectedOption[optionsKey] === option[optionsKey];
      }) ? true : false,
      onChange: function onChange(e) {
        return isOBPSMultiple ? onSelect(e, option, BlockNumber) : onSelect(e, option);
      }
    }), /*#__PURE__*/React__default.createElement("div", {
      className: "custom-checkbox"
    }, /*#__PURE__*/React__default.createElement(CheckSvg, null)), /*#__PURE__*/React__default.createElement("p", {
      className: "label"
    }, t(option[optionsKey] && typeof option[optionsKey] == "string" && option[optionsKey])));
  };

  var Menu = function Menu() {
    var filteredOptions = (searchQuery === null || searchQuery === void 0 ? void 0 : searchQuery.length) > 0 ? options.filter(function (option) {
      return t(option[optionsKey] && typeof option[optionsKey] == "string" && option[optionsKey].toUpperCase()).toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0;
    }) : options;
    return filteredOptions.map(function (option, index) {
      return /*#__PURE__*/React__default.createElement(MenuItem, {
        option: option,
        key: index,
        index: index
      });
    });
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: "multi-select-dropdown-wrap",
    ref: dropdownRef
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "master" + (active ? "-active" : "")
  }, /*#__PURE__*/React__default.createElement("input", {
    className: "cursorPointer",
    type: "text",
    onFocus: function onFocus() {
      return setActive(true);
    },
    value: searchQuery,
    onChange: onSearch
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "label"
  }, /*#__PURE__*/React__default.createElement("p", null, selected.length > 0 ? selected.length + " " + defaultUnit : defaultLabel), /*#__PURE__*/React__default.createElement(ArrowDown, null))), active ? /*#__PURE__*/React__default.createElement("div", {
    className: "server"
  }, /*#__PURE__*/React__default.createElement(Menu, null)) : null);
};

var MenuItem = function MenuItem(_ref) {
  var item = _ref.item;
  var itemComponent;

  if (item.type === "component") {
    itemComponent = item.action;
  } else {
    itemComponent = item.text;
  }

  var Item = function Item() {
    return /*#__PURE__*/React__default.createElement("span", _extends({
      className: "menu-item"
    }, item.populators), (item === null || item === void 0 ? void 0 : item.icon) && item.icon, /*#__PURE__*/React__default.createElement("div", {
      className: "menu-label"
    }, itemComponent));
  };

  if (item.type === "external-link") {
    return /*#__PURE__*/React__default.createElement("a", {
      href: item.link
    }, /*#__PURE__*/React__default.createElement(Item, null));
  }

  if (item.type === "link") {
    return /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: item.link
    }, /*#__PURE__*/React__default.createElement(Item, null));
  }

  return /*#__PURE__*/React__default.createElement(Item, null);
};

var NavBar = function NavBar(_ref2) {
  var open = _ref2.open,
      profileItem = _ref2.profileItem,
      menuItems = _ref2.menuItems,
      onClose = _ref2.onClose,
      Footer = _ref2.Footer;
  var node = React.useRef();
  Digit.Hooks.useClickOutside(node, open ? onClose : null, open);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    style: {
      position: "fixed",
      height: "100%",
      width: "100%",
      top: "0px",
      left: "" + (open ? "0px" : "-100%"),
      opacity: "1",
      backgroundColor: "rgba(0, 0, 0, 0.54)",
      willChange: "opacity",
      transform: "translateZ(0px)",
      transition: "left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
      zIndex: "1200",
      pointerzevents: "auto"
    }
  }), /*#__PURE__*/React__default.createElement("div", {
    ref: node,
    style: {
      display: "flex",
      flexDirection: "column",
      marginTop: "56px",
      height: "calc(100vh - 56px)",
      position: "fixed",
      top: 0,
      left: 0,
      transition: "transform 0.3s ease-in-out",
      background: "#fff",
      zIndex: "1999",
      width: "300px",
      transform: "" + (open ? "translateX(0)" : "translateX(-450px)"),
      boxShadow: "rgb(0 0 0 / 16%) 8px 0px 16px"
    }
  }, profileItem, /*#__PURE__*/React__default.createElement("div", {
    className: "drawer-list"
  }, menuItems.map(function (item, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: index
    }, /*#__PURE__*/React__default.createElement(MenuItem, {
      item: item
    }));
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "side-bar-footer"
  }, Footer))));
};

var BACKSPACE = 8;

var SingleInput = function SingleInput(_ref) {
  var isFocus = _ref.isFocus,
      onChange = _ref.onChange,
      onFocus = _ref.onFocus,
      value = _ref.value,
      rest = _objectWithoutPropertiesLoose(_ref, ["isFocus", "onChange", "onFocus", "value"]);

  var inputRef = React.useRef();
  React.useEffect(function () {
    if (isFocus) {
      inputRef.current.focus();
    }
  }, [isFocus]);
  return /*#__PURE__*/React__default.createElement("input", _extends({
    className: "input-otp",
    maxLength: 1,
    onChange: onChange,
    onFocus: onFocus,
    ref: inputRef,
    type: "number",
    value: value ? value : ""
  }, rest));
};

var OTPInput = function OTPInput(props) {
  var _useState = React.useState(0),
      activeInput = _useState[0],
      setActiveInput = _useState[1];

  if (!props.length) {
    console.warn("OTPInput Component requires length prop");
  }

  var isInputValueValid = function isInputValueValid(value) {
    return typeof value === "string" && value.trim().length === 1;
  };

  var changeCodeAtFocus = function changeCodeAtFocus(value) {
    var onChange = props.onChange;
    var otp = getOtpValue();
    otp[activeInput] = value[0];
    var otpValue = otp.join("");
    onChange(otpValue);
  };

  var focusNextInput = function focusNextInput() {
    setActiveInput(function (activeInput) {
      return Math.min(activeInput + 1, props.length - 1);
    });
  };

  var focusPrevInput = function focusPrevInput() {
    setActiveInput(function (activeInput) {
      return Math.max(activeInput - 1, 0);
    });
  };

  var getOtpValue = function getOtpValue() {
    return props.value ? props.value.toString().split("") : [];
  };

  var handleKeyDown = function handleKeyDown(event) {
    if (event.keyCode === BACKSPACE || event.key === "Backspace") {
      event.preventDefault();
      changeCodeAtFocus("");
      focusPrevInput();
    }
  };

  function inputChange(event) {
    var value = event.target.value;
    changeCodeAtFocus(value);

    if (isInputValueValid(value)) {
      focusNextInput();
    }
  }

  var OTPStack = [];
  var otp = getOtpValue();

  var _loop = function _loop(i) {
    OTPStack.push( /*#__PURE__*/React__default.createElement(SingleInput, {
      key: i,
      isFocus: activeInput === i,
      onChange: inputChange,
      onKeyDown: handleKeyDown,
      onFocus: function onFocus(e) {
        setActiveInput(i);
        e.target.select();
      },
      value: otp[i]
    }));
  };

  for (var i = 0; i < props.length; i++) {
    _loop(i);
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "input-otp-wrap"
  }, OTPStack);
};

OTPInput.propTypes = {
  length: propTypes.number
};
OTPInput.defaultProps = {
  length: 0
};

var PopUp = function PopUp(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "popup-wrap"
  }, props.children);
};

var PrivateRoute = function PrivateRoute(_ref) {
  var Component = _ref.component,
      rest = _objectWithoutPropertiesLoose(_ref, ["component", "roles"]);

  return /*#__PURE__*/React__default.createElement(reactRouterDom.Route, _extends({}, rest, {
    render: function render(props) {
      var user = Digit.UserService.getUser();

      if (!user || !user.access_token) {
        return /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
          to: {
            pathname: "/digit-ui/citizen/login",
            state: {
              from: props.location.pathname + props.location.search
            }
          }
        });
      }

      return /*#__PURE__*/React__default.createElement(Component, props);
    }
  }));
};

function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

function eq(value, other) {
  return value === other || value !== value && other !== other;
}

var eq_1 = eq;

function assocIndexOf(array, key) {
  var length = array.length;

  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }

  return -1;
}

var _assocIndexOf = assocIndexOf;

var arrayProto = Array.prototype;
var splice = arrayProto.splice;

function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }

  var lastIndex = data.length - 1;

  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }

  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);
  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }

  return this;
}

var _listCacheSet = listCacheSet;

function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;
var _ListCache = ListCache;

function stackClear() {
  this.__data__ = new _ListCache();
  this.size = 0;
}

var _stackClear = stackClear;

function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);
  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal;

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
var root = _freeGlobal || freeSelf || Function('return this')();
var _root = root;

var Symbol$1 = _root.Symbol;
var _Symbol = Symbol$1;

var objectProto = Object.prototype;
var hasOwnProperty$1 = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

function getRawTag(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }

  return result;
}

var _getRawTag = getRawTag;

var objectProto$1 = Object.prototype;
var nativeObjectToString$1 = objectProto$1.toString;

function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }

  return symToStringTag$1 && symToStringTag$1 in Object(value) ? _getRawTag(value) : _objectToString(value);
}

var _baseGetTag = baseGetTag;

function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }

  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

var coreJsData = _root['__core-js_shared__'];
var _coreJsData = coreJsData;

var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();

function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}

var _isMasked = isMasked;

var funcProto = Function.prototype;
var funcToString = funcProto.toString;

function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}

    try {
      return func + '';
    } catch (e) {}
  }

  return '';
}

var _toSource = toSource;

var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;
var funcToString$1 = funcProto$1.toString;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }

  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

var Map = _getNative(_root, 'Map');
var _Map = Map;

var nativeCreate = _getNative(Object, 'create');
var _nativeCreate = nativeCreate;

function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

var HASH_UNDEFINED = '__lodash_hash_undefined__';
var objectProto$3 = Object.prototype;
var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

function hashGet(key) {
  var data = this.__data__;

  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }

  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

var objectProto$4 = Object.prototype;
var hasOwnProperty$4 = objectProto$4.hasOwnProperty;

function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? data[key] !== undefined : hasOwnProperty$4.call(data, key);
}

var _hashHas = hashHas;

var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = _nativeCreate && value === undefined ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;
var _Hash = Hash;

function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash(),
    'map': new (_Map || _ListCache)(),
    'string': new _Hash()
  };
}

var _mapCacheClear = mapCacheClear;

function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

var _isKeyable = isKeyable;

function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

var _getMapData = getMapData;

function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;
var _MapCache = MapCache;

var LARGE_ARRAY_SIZE = 200;

function stackSet(key, value) {
  var data = this.__data__;

  if (data instanceof _ListCache) {
    var pairs = data.__data__;

    if (!_Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }

    data = this.__data__ = new _MapCache(pairs);
  }

  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;
var _Stack = Stack;

var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$2);

  return this;
}

var _setCacheAdd = setCacheAdd;

function setCacheHas(value) {
  return this.__data__.has(value);
}

var _setCacheHas = setCacheHas;

function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;
  this.__data__ = new _MapCache();

  while (++index < length) {
    this.add(values[index]);
  }
}

SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
SetCache.prototype.has = _setCacheHas;
var _SetCache = SetCache;

function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }

  return false;
}

var _arraySome = arraySome;

function cacheHas(cache, key) {
  return cache.has(key);
}

var _cacheHas = cacheHas;

var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }

  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);

  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }

  var index = -1,
      result = true,
      seen = bitmask & COMPARE_UNORDERED_FLAG ? new _SetCache() : undefined;
  stack.set(array, other);
  stack.set(other, array);

  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }

    if (compared !== undefined) {
      if (compared) {
        continue;
      }

      result = false;
      break;
    }

    if (seen) {
      if (!_arraySome(other, function (othValue, othIndex) {
        if (!_cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }

  stack['delete'](array);
  stack['delete'](other);
  return result;
}

var _equalArrays = equalArrays;

var Uint8Array = _root.Uint8Array;
var _Uint8Array = Uint8Array;

function mapToArray(map) {
  var index = -1,
      result = Array(map.size);
  map.forEach(function (value, key) {
    result[++index] = [key, value];
  });
  return result;
}

var _mapToArray = mapToArray;

function setToArray(set) {
  var index = -1,
      result = Array(set.size);
  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

var _setToArray = setToArray;

var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';
var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }

      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if (object.byteLength != other.byteLength || !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }

      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      return eq_1(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      return object == other + '';

    case mapTag:
      var convert = _mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
      convert || (convert = _setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }

      var stacked = stack.get(object);

      if (stacked) {
        return stacked == other;
      }

      bitmask |= COMPARE_UNORDERED_FLAG$1;
      stack.set(object, other);
      var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }

  }

  return false;
}

var _equalByTag = equalByTag;

function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }

  return array;
}

var _arrayPush = arrayPush;

var isArray = Array.isArray;
var isArray_1 = isArray;

function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];

    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }

  return result;
}

var _arrayFilter = arrayFilter;

function stubArray() {
  return [];
}

var stubArray_1 = stubArray;

var objectProto$5 = Object.prototype;
var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols ? stubArray_1 : function (object) {
  if (object == null) {
    return [];
  }

  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function (symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};
var _getSymbols = getSymbols;

function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }

  return result;
}

var _baseTimes = baseTimes;

function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

var argsTag = '[object Arguments]';

function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

var objectProto$6 = Object.prototype;
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;
var isArguments = _baseIsArguments(function () {
  return arguments;
}()) ? _baseIsArguments : function (value) {
  return isObjectLike_1(value) && hasOwnProperty$5.call(value, 'callee') && !propertyIsEnumerable$1.call(value, 'callee');
};
var isArguments_1 = isArguments;

function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
  var freeExports =  exports && !exports.nodeType && exports;
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer = moduleExports ? _root.Buffer : undefined;
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
  var isBuffer = nativeIsBuffer || stubFalse_1;
  module.exports = isBuffer;
});

var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;

function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

var _isIndex = isIndex;

var MAX_SAFE_INTEGER$1 = 9007199254740991;

function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var isLength_1 = isLength;

var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    objectTag = '[object Object]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    weakMapTag = '[object WeakMap]';
var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] = typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] = typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] = typedArrayTags[objectTag] = typedArrayTags[regexpTag$1] = typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] = typedArrayTags[weakMapTag] = false;

function baseIsTypedArray(value) {
  return isObjectLike_1(value) && isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
  var freeExports =  exports && !exports.nodeType && exports;
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && _freeGlobal.process;

  var nodeUtil = function () {
    try {
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }();

  module.exports = nodeUtil;
});

var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;
var isTypedArray_1 = isTypedArray;

var objectProto$7 = Object.prototype;
var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$6.call(value, key)) && !(skipIndexes && (key == 'length' || isBuff && (key == 'offset' || key == 'parent') || isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || _isIndex(key, length)))) {
      result.push(key);
    }
  }

  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

var objectProto$8 = Object.prototype;

function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$8;
  return value === proto;
}

var _isPrototype = isPrototype;

function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

var nativeKeys = _overArg(Object.keys, Object);
var _nativeKeys = nativeKeys;

var objectProto$9 = Object.prototype;
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }

  var result = [];

  for (var key in Object(object)) {
    if (hasOwnProperty$7.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }

  return result;
}

var _baseKeys = baseKeys;

function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

var COMPARE_PARTIAL_FLAG$2 = 1;
var objectProto$a = Object.prototype;
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }

  var index = objLength;

  while (index--) {
    var key = objProps[index];

    if (!(isPartial ? key in other : hasOwnProperty$8.call(other, key))) {
      return false;
    }
  }

  var objStacked = stack.get(object);
  var othStacked = stack.get(other);

  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }

  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;

  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }

    if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }

    skipCtor || (skipCtor = key == 'constructor');
  }

  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    if (objCtor != othCtor && 'constructor' in object && 'constructor' in other && !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }

  stack['delete'](object);
  stack['delete'](other);
  return result;
}

var _equalObjects = equalObjects;

var DataView = _getNative(_root, 'DataView');
var _DataView = DataView;

var Promise$1 = _getNative(_root, 'Promise');
var _Promise = Promise$1;

var Set = _getNative(_root, 'Set');
var _Set = Set;

var WeakMap = _getNative(_root, 'WeakMap');
var _WeakMap = WeakMap;

var mapTag$2 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$2 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';
var dataViewTag$2 = '[object DataView]';
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);
var getTag = _baseGetTag;

if (_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2 || _Map && getTag(new _Map()) != mapTag$2 || _Promise && getTag(_Promise.resolve()) != promiseTag || _Set && getTag(new _Set()) != setTag$2 || _WeakMap && getTag(new _WeakMap()) != weakMapTag$1) {
  getTag = function getTag(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$2;

        case mapCtorString:
          return mapTag$2;

        case promiseCtorString:
          return promiseTag;

        case setCtorString:
          return setTag$2;

        case weakMapCtorString:
          return weakMapTag$1;
      }
    }

    return result;
  };
}

var _getTag = getTag;

var COMPARE_PARTIAL_FLAG$3 = 1;
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    objectTag$2 = '[object Object]';
var objectProto$b = Object.prototype;
var hasOwnProperty$9 = objectProto$b.hasOwnProperty;

function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$1 : _getTag(object),
      othTag = othIsArr ? arrayTag$1 : _getTag(other);
  objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
  othTag = othTag == argsTag$2 ? objectTag$2 : othTag;
  var objIsObj = objTag == objectTag$2,
      othIsObj = othTag == objectTag$2,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer_1(object)) {
    if (!isBuffer_1(other)) {
      return false;
    }

    objIsArr = true;
    objIsObj = false;
  }

  if (isSameTag && !objIsObj) {
    stack || (stack = new _Stack());
    return objIsArr || isTypedArray_1(object) ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack) : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }

  if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
    var objIsWrapped = objIsObj && hasOwnProperty$9.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$9.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new _Stack());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }

  if (!isSameTag) {
    return false;
  }

  stack || (stack = new _Stack());
  return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

var _baseIsEqualDeep = baseIsEqualDeep;

function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }

  if (value == null || other == null || !isObjectLike_1(value) && !isObjectLike_1(other)) {
    return value !== value && other !== other;
  }

  return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

var _baseIsEqual = baseIsEqual;

function isEqual(value, other) {
  return _baseIsEqual(value, other);
}

var isEqual_1 = isEqual;

var RadioButtons = function RadioButtons(props) {
  var _props$options;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var selected = props.selectedOption;

  function selectOption(value) {
    selected = value;
    props.onSelect(value);
  }

  return /*#__PURE__*/React__default.createElement("div", {
    style: props.style,
    className: "radio-wrap " + (props === null || props === void 0 ? void 0 : props.additionalWrapperClass)
  }, props === null || props === void 0 ? void 0 : (_props$options = props.options) === null || _props$options === void 0 ? void 0 : _props$options.map(function (option, ind) {
    if (props !== null && props !== void 0 && props.optionsKey && !(props !== null && props !== void 0 && props.isDependent)) {
      return /*#__PURE__*/React__default.createElement("div", {
        style: props.innerStyles,
        key: ind
      }, /*#__PURE__*/React__default.createElement("span", {
        className: "radio-btn-wrap"
      }, /*#__PURE__*/React__default.createElement("input", {
        className: "radio-btn",
        type: "radio",
        value: option,
        checked: isEqual_1(selected, option) ? 1 : 0,
        onChange: function onChange() {
          return selectOption(option);
        },
        disabled: props === null || props === void 0 ? void 0 : props.disabled
      }), /*#__PURE__*/React__default.createElement("span", {
        className: "radio-btn-checkmark"
      })), /*#__PURE__*/React__default.createElement("label", null, t(option[props.optionsKey])));
    } else if (props !== null && props !== void 0 && props.optionsKey && props !== null && props !== void 0 && props.isDependent) {
      var _selected;

      return /*#__PURE__*/React__default.createElement("div", {
        style: props.innerStyles,
        key: ind
      }, /*#__PURE__*/React__default.createElement("span", {
        className: "radio-btn-wrap"
      }, /*#__PURE__*/React__default.createElement("input", {
        className: "radio-btn",
        type: "radio",
        value: option,
        checked: ((_selected = selected) === null || _selected === void 0 ? void 0 : _selected.code) === option.code ? 1 : 0,
        onChange: function onChange() {
          return selectOption(option);
        },
        disabled: props === null || props === void 0 ? void 0 : props.disabled
      }), /*#__PURE__*/React__default.createElement("span", {
        className: "radio-btn-checkmark"
      })), /*#__PURE__*/React__default.createElement("label", null, t(props.labelKey ? props.labelKey + "_" + option.code : option.code)));
    } else {
      return /*#__PURE__*/React__default.createElement("div", {
        style: props.innerStyles,
        key: ind
      }, /*#__PURE__*/React__default.createElement("span", {
        className: "radio-btn-wrap"
      }, /*#__PURE__*/React__default.createElement("input", {
        className: "radio-btn",
        type: "radio",
        value: option,
        checked: selected === option ? 1 : 0,
        onChange: function onChange() {
          return selectOption(option);
        },
        disabled: props === null || props === void 0 ? void 0 : props.disabled
      }), /*#__PURE__*/React__default.createElement("span", {
        className: "radio-btn-checkmark"
      })), /*#__PURE__*/React__default.createElement("label", null, t(option)));
    }
  }));
};

RadioButtons.propTypes = {
  selectedOption: propTypes.any,
  onSelect: propTypes.func,
  options: propTypes.any,
  optionsKey: propTypes.string,
  innerStyles: propTypes.any,
  style: propTypes.any
};
RadioButtons.defaultProps = {};

var Rating = function Rating(props) {
  var stars = [];
  var star = React.useRef(null);

  for (var i = 1; i <= props.maxRating; i++) {
    if (i - props.currentRating <= 0) {
      (function () {
        var index = i;
        stars.push( /*#__PURE__*/React__default.createElement(StarFilled, {
          key: i,
          id: props.id + "gradient" + i,
          className: "rating-star",
          styles: props.starStyles,
          onClick: function onClick(e) {
            return props.onFeedback(e, star, index);
          }
        }));
      })();
    } else if (i - props.currentRating > 0 && i - props.currentRating < 1) {
      (function () {
        var index = i;
        stars.push( /*#__PURE__*/React__default.createElement(StarFilled, {
          key: i,
          id: props.id + "gradient" + i,
          className: "rating-star",
          styles: props.starStyles,
          onClick: function onClick(e) {
            return props.onFeedback(e, star, index);
          },
          percentage: Math.round((props.currentRating - parseInt(props.currentRating)) * 100)
        }));
      })();
    } else {
      (function () {
        var index = i;
        stars.push( /*#__PURE__*/React__default.createElement(StarEmpty, {
          key: i,
          className: "rating-star",
          styles: props.starStyles,
          onClick: function onClick(e) {
            return props.onFeedback(e, star, index);
          }
        }));
      })();
    }
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "" + (props.withText ? "rating-with-text" : "rating-star-wrap"),
    style: _extends({}, props.styles)
  }, props.text ? props.text : "", " ", stars);
};

Rating.propTypes = {
  maxRating: propTypes.number,
  currentRating: propTypes.number,
  onFeedback: propTypes.func
};
Rating.defaultProps = {
  maxRating: 5,
  id: '0',
  currentRating: 0,
  onFeedback: function onFeedback() {}
};

var RoundedLabel = function RoundedLabel(_ref) {
  var count = _ref.count;
  return count ? /*#__PURE__*/React__default.createElement("div", {
    className: "roundedLabel"
  }, count) : /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
};

var TextField$1 = function TextField(props) {
  var _useState = React.useState(props.selectedVal ? props.selectedVal : ""),
      value = _useState[0],
      setValue = _useState[1];

  React.useEffect(function () {
    props.selectedVal ? setValue(props.selectedVal) : null;
  }, [props.selectedVal]);

  function inputChange(e) {
    setValue(e.target.value);
    props.setFilter(e.target.value);
  }

  return /*#__PURE__*/React__default.createElement("input", {
    type: "text",
    value: value,
    onChange: inputChange,
    onClick: props.onClick
  });
};

var SectionalDropdown = function SectionalDropdown(props) {
  var _useState2 = React.useState(false),
      dropdownStatus = _useState2[0],
      setDropdownStatus = _useState2[1];

  var _useState3 = React.useState(props.selected ? props.selected : null),
      selectedOption = _useState3[0],
      setSelectedOption = _useState3[1];

  var _useState4 = React.useState(""),
      filterVal = _useState4[0],
      setFilterVal = _useState4[1];

  React.useEffect(function () {
    setSelectedOption(props.selected);
  }, [props.selected]);

  function dropdownSwitch() {
    var current = dropdownStatus;
    setDropdownStatus(!current);
  }

  function dropdownOn() {
    setDropdownStatus(true);
  }

  function onSelect(selectedOption) {
    props.select(selectedOption);
    setSelectedOption(selectedOption);
    setDropdownStatus(false);
  }

  function setFilter(val) {
    setFilterVal(val);
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "sect-dropdown-wrap",
    style: _extends({}, props.style)
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "sect-dropdown-input-wrap"
  }, /*#__PURE__*/React__default.createElement(TextField$1, {
    setFilter: setFilter,
    selectedVal: selectedOption ? props.t ? props.t(props.displayKey ? selectedOption[props.displayKey] : selectedOption) : props.displayKey ? selectedOption[props.displayKey] : selectedOption : null,
    filterVal: filterVal,
    onClick: dropdownOn
  }), /*#__PURE__*/React__default.createElement(ArrowDown, {
    onClick: dropdownSwitch
  })), dropdownStatus ? /*#__PURE__*/React__default.createElement("div", {
    className: "sect-dropdown-card"
  }, props.menuData.filter(function (subMenu) {
    return subMenu.options.filter(function (option) {
      return option[props.displayKey].toUpperCase().includes(filterVal.toUpperCase());
    });
  }).map(function (subMenu, index) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, /*#__PURE__*/React__default.createElement("h1", null, subMenu.heading), subMenu.options.map(function (option, index) {
      return /*#__PURE__*/React__default.createElement("p", {
        key: index,
        onClick: function onClick() {
          return onSelect(option);
        }
      }, props.t ? props.t(option[props.displayKey]) : option[props.displayKey]);
    }));
  })) : null);
};

var LastRow = function LastRow(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    styles: props.rowContainerStyle,
    className: "row-last"
  }, /*#__PURE__*/React__default.createElement("h2", null, props.label), /*#__PURE__*/React__default.createElement("p", null, props.text));
};
var Row = function Row(props) {
  var value = props.text;
  var valueStyle = props.textStyle || {};
  var labelStyle = props.labelStyle || {};

  if (Array.isArray(props.text)) {
    value = props.text.map(function (val, index) {
      if (val !== null && val !== void 0 && val.className) {
        return /*#__PURE__*/React__default.createElement("p", {
          className: val === null || val === void 0 ? void 0 : val.className,
          style: val === null || val === void 0 ? void 0 : val.style,
          key: index
        }, val === null || val === void 0 ? void 0 : val.value);
      }

      return /*#__PURE__*/React__default.createElement("p", {
        key: index
      }, val);
    });
  }

  return /*#__PURE__*/React__default.createElement("div", {
    style: props.rowContainerStyle,
    className: (props.last ? "row last" : "row") + " " + ((props === null || props === void 0 ? void 0 : props.className) || "")
  }, /*#__PURE__*/React__default.createElement("h2", {
    style: labelStyle
  }, props.label), /*#__PURE__*/React__default.createElement("div", {
    className: "value",
    style: valueStyle
  }, value, props.caption && /*#__PURE__*/React__default.createElement("div", {
    className: "caption"
  }, props.caption)), props.actionButton ? /*#__PURE__*/React__default.createElement("div", {
    className: "action-button"
  }, props.actionButton) : null);
};
var MediaRow = function MediaRow(props) {
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("h2", null, props.label), /*#__PURE__*/React__default.createElement("span", null, props.children));
};
var StatusTable = function StatusTable(props) {
  var employee = Digit.SessionStorage.get("user_type") === "employee" ? true : false;

  if (props.dataObject) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: employee ? "employee-data-table" : "data-table",
      style: props.style
    }, Object.keys(props.dataObject).map(function (name, index) {
      if (++index === Object.keys(props.dataObject).length) {
        return /*#__PURE__*/React__default.createElement(LastRow, {
          key: index,
          label: name,
          text: props.dataObject[name]
        });
      }

      return /*#__PURE__*/React__default.createElement(Row, {
        key: index,
        label: name,
        text: props.dataObject[name]
      });
    }));
  } else {
    return /*#__PURE__*/React__default.createElement("div", {
      className: employee ? "employee-data-table" : "data-table",
      style: props.style
    }, props.children);
  }
};

var SubmitBar = function SubmitBar(props) {
  return /*#__PURE__*/React__default.createElement("button", {
    disabled: props.disabled ? true : false,
    className: (props.disabled ? "submit-bar-disabled" : "submit-bar") + " " + (props.className ? props.className : ""),
    type: props.submit ? "submit" : "button",
    style: _extends({}, props.style),
    onClick: props.onSubmit
  }, /*#__PURE__*/React__default.createElement("header", null, props.label));
};

SubmitBar.propTypes = {
  submit: propTypes.any,
  style: propTypes.object,
  label: propTypes.string,
  onSubmit: propTypes.func
};
SubmitBar.defaultProps = {};

var StandaloneSearchBar = function StandaloneSearchBar(_ref) {
  var placeholder = _ref.placeholder;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "StandaloneSearchBar"
  }, /*#__PURE__*/React__default.createElement(SearchIconSvg, null), /*#__PURE__*/React__default.createElement("input", {
    type: "text",
    placeholder: placeholder
  }));
};

var noop = function noop() {};

var Table = function Table(_ref) {
  var _ref$className = _ref.className,
      className = _ref$className === void 0 ? "table" : _ref$className,
      t = _ref.t,
      data = _ref.data,
      columns = _ref.columns,
      getCellProps = _ref.getCellProps,
      _ref$currentPage = _ref.currentPage,
      currentPage = _ref$currentPage === void 0 ? 0 : _ref$currentPage,
      _ref$pageSizeLimit = _ref.pageSizeLimit,
      pageSizeLimit = _ref$pageSizeLimit === void 0 ? 10 : _ref$pageSizeLimit,
      _ref$disableSort = _ref.disableSort,
      disableSort = _ref$disableSort === void 0 ? true : _ref$disableSort,
      _ref$autoSort = _ref.autoSort,
      autoSort = _ref$autoSort === void 0 ? false : _ref$autoSort,
      _ref$initSortId = _ref.initSortId,
      initSortId = _ref$initSortId === void 0 ? "" : _ref$initSortId,
      _ref$onSearch = _ref.onSearch,
      onSearch = _ref$onSearch === void 0 ? false : _ref$onSearch,
      _ref$manualPagination = _ref.manualPagination,
      manualPagination = _ref$manualPagination === void 0 ? true : _ref$manualPagination,
      totalRecords = _ref.totalRecords,
      onNextPage = _ref.onNextPage,
      onPrevPage = _ref.onPrevPage,
      globalSearch = _ref.globalSearch,
      _ref$onSort = _ref.onSort,
      onSort = _ref$onSort === void 0 ? noop : _ref$onSort,
      onPageSizeChange = _ref.onPageSizeChange,
      onLastPage = _ref.onLastPage,
      onFirstPage = _ref.onFirstPage,
      _ref$isPaginationRequ = _ref.isPaginationRequired,
      isPaginationRequired = _ref$isPaginationRequ === void 0 ? true : _ref$isPaginationRequ,
      _ref$sortParams = _ref.sortParams,
      sortParams = _ref$sortParams === void 0 ? [] : _ref$sortParams;

  var _useTable = reactTable.useTable({
    columns: columns,
    data: data,
    initialState: {
      pageIndex: currentPage,
      pageSize: pageSizeLimit,
      sortBy: autoSort ? [{
        id: initSortId,
        desc: false
      }] : sortParams
    },
    pageCount: totalRecords > 0 ? Math.ceil(totalRecords / pageSizeLimit) : -1,
    manualPagination: manualPagination,
    disableMultiSort: false,
    disableSortBy: disableSort,
    manualSortBy: autoSort ? false : true,
    autoResetPage: false,
    autoResetSortBy: false,
    disableSortRemove: true,
    disableGlobalFilter: onSearch === false ? true : false,
    globalFilter: globalSearch || "text",
    useControlledState: function useControlledState(state) {
      return React__default.useMemo(function () {
        return _extends({}, state, {
          pageIndex: manualPagination ? currentPage : state.pageIndex
        });
      });
    }
  }, reactTable.useGlobalFilter, reactTable.useSortBy, reactTable.usePagination, reactTable.useRowSelect),
      getTableProps = _useTable.getTableProps,
      getTableBodyProps = _useTable.getTableBodyProps,
      headerGroups = _useTable.headerGroups,
      rows = _useTable.rows,
      prepareRow = _useTable.prepareRow,
      page = _useTable.page,
      canPreviousPage = _useTable.canPreviousPage,
      canNextPage = _useTable.canNextPage,
      nextPage = _useTable.nextPage,
      previousPage = _useTable.previousPage,
      setPageSize = _useTable.setPageSize,
      setGlobalFilter = _useTable.setGlobalFilter,
      _useTable$state = _useTable.state,
      pageSize = _useTable$state.pageSize,
      sortBy = _useTable$state.sortBy;

  React.useEffect(function () {
    onSort(sortBy);
  }, [onSort, sortBy]);
  React.useEffect(function () {
    return setGlobalFilter(onSearch);
  }, [onSearch, setGlobalFilter]);
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("table", _extends({
    className: className
  }, getTableProps()), /*#__PURE__*/React__default.createElement("thead", null, headerGroups.map(function (headerGroup) {
    return /*#__PURE__*/React__default.createElement("tr", headerGroup.getHeaderGroupProps(), headerGroup.headers.map(function (column) {
      return /*#__PURE__*/React__default.createElement("th", _extends({}, column.getHeaderProps(column.getSortByToggleProps()), {
        style: {
          verticalAlign: "top"
        }
      }), column.render("Header"), /*#__PURE__*/React__default.createElement("span", null, column.isSorted ? column.isSortedDesc ? /*#__PURE__*/React__default.createElement(SortDown, null) : /*#__PURE__*/React__default.createElement(SortUp, null) : ""));
    }));
  })), /*#__PURE__*/React__default.createElement("tbody", getTableBodyProps(), page.map(function (row, i) {
    prepareRow(row);
    return /*#__PURE__*/React__default.createElement("tr", row.getRowProps(), row.cells.map(function (cell) {
      return /*#__PURE__*/React__default.createElement("td", cell.getCellProps([getCellProps(cell)]), cell.column.link ? /*#__PURE__*/React__default.createElement("a", {
        style: {
          color: "#1D70B8"
        },
        href: cell.column.to
      }, cell.render("Cell")) : /*#__PURE__*/React__default.createElement(React__default.Fragment, null, " ", cell.render("Cell"), " "));
    }));
  }))), isPaginationRequired && /*#__PURE__*/React__default.createElement("div", {
    className: "pagination"
  }, t("CS_COMMON_ROWS_PER_PAGE") + " :", /*#__PURE__*/React__default.createElement("select", {
    className: "cp",
    value: pageSize,
    style: {
      marginRight: "15px"
    },
    onChange: manualPagination ? onPageSizeChange : function (e) {
      return setPageSize(Number(e.target.value));
    }
  }, [10, 20, 30, 40, 50].map(function (pageSize) {
    return /*#__PURE__*/React__default.createElement("option", {
      key: pageSize,
      value: pageSize
    }, pageSize);
  })), /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("span", null, currentPage * pageSizeLimit + 1, "-", (currentPage + 1) * pageSizeLimit > totalRecords ? totalRecords : (currentPage + 1) * pageSizeLimit, " ", totalRecords ? "of " + totalRecords : ""), " "), canPreviousPage && manualPagination && onFirstPage && /*#__PURE__*/React__default.createElement(ArrowToFirst, {
    onClick: function onClick() {
      return manualPagination && onFirstPage();
    },
    className: "cp"
  }), canPreviousPage && /*#__PURE__*/React__default.createElement(ArrowBack, {
    onClick: function onClick() {
      return manualPagination ? onPrevPage() : previousPage();
    },
    className: "cp"
  }), rows.length == pageSizeLimit && canNextPage && /*#__PURE__*/React__default.createElement(ArrowForward, {
    onClick: function onClick() {
      return manualPagination ? onNextPage() : nextPage();
    },
    className: "cp"
  }), rows.length == pageSizeLimit && canNextPage && manualPagination && onLastPage && /*#__PURE__*/React__default.createElement(ArrowToLast, {
    onClick: function onClick() {
      return manualPagination && onLastPage();
    },
    className: "cp"
  })));
};

var TelePhone = function TelePhone(_ref) {
  var mobile = _ref.mobile,
      text = _ref.text;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, text, /*#__PURE__*/React__default.createElement("div", {
    className: "telephone"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "call"
  }, /*#__PURE__*/React__default.createElement("a", {
    href: "tel:" + mobile
  }, mobile), /*#__PURE__*/React__default.createElement(Phone, null))));
};

TelePhone.propTypes = {
  mobile: propTypes.any,
  text: propTypes.string
};
TelePhone.defaultProps = {
  mobile: "",
  text: ""
};

var TextArea = function TextArea(props) {
  var user_type = Digit.SessionStorage.get("userType");
  return /*#__PURE__*/React__default.createElement("textarea", {
    name: props.name,
    ref: props.inputRef,
    style: props.style,
    id: props.id,
    value: props.value,
    onChange: props.onChange,
    className: (user_type ? "employee-card-textarea" : "card-textarea") + " " + (props.disable && "disabled") + " " + (props !== null && props !== void 0 && props.className ? props === null || props === void 0 ? void 0 : props.className : ""),
    minLength: props.minLength,
    maxLength: props.maxLength,
    autoComplete: "off"
  });
};

TextArea.propTypes = {
  userType: propTypes.string,
  name: propTypes.string.isRequired,
  ref: propTypes.func,
  value: propTypes.string,
  onChange: propTypes.func,
  id: propTypes.string
};
TextArea.defaultProps = {
  ref: undefined,
  onChange: undefined
};

var TextInput = function TextInput(props) {
  var user_type = Digit.SessionStorage.get("userType");

  var _useState = React.useState(),
      date = _useState[0],
      setDate = _useState[1];

  var data = props !== null && props !== void 0 && props.watch ? {
    fromDate: props === null || props === void 0 ? void 0 : props.watch("fromDate"),
    toDate: props === null || props === void 0 ? void 0 : props.watch("toDate")
  } : {};

  var handleDate = function handleDate(event) {
    var value = event.target.value;
    setDate(getDDMMYYYY(value));
  };

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "text-input " + props.className
  }, props.isMandatory ? /*#__PURE__*/React__default.createElement("input", {
    type: props.type || "text",
    name: props.name,
    id: props.id,
    className: (user_type ? "employee-card-input-error" : "card-input-error") + " " + (props.disable && "disabled"),
    placeholder: props.placeholder,
    onChange: function onChange(event) {
      if (props !== null && props !== void 0 && props.onChange) {
        props === null || props === void 0 ? void 0 : props.onChange(event);
      }

      if (props.type === "date") {
        handleDate(event);
      }
    },
    ref: props.inputRef,
    value: props.value,
    style: _extends({}, props.style),
    defaultValue: props.defaultValue,
    minLength: props.minlength,
    maxLength: props.maxlength,
    max: props.max,
    pattern: props.pattern,
    min: props.min,
    readOnly: props.disable,
    title: props.title,
    step: props.step,
    autoFocus: props.autoFocus,
    onBlur: props.onBlur,
    autoComplete: "off"
  }) : /*#__PURE__*/React__default.createElement("input", {
    type: props.type || "text",
    name: props.name,
    id: props.id,
    className: (user_type ? "employee-card-input" : "citizen-card-input") + " " + (props.disable && "disabled") + " focus-visible " + (props.errorStyle && "employee-card-input-error"),
    placeholder: props.placeholder,
    onChange: function onChange(event) {
      if (props !== null && props !== void 0 && props.onChange) {
        props === null || props === void 0 ? void 0 : props.onChange(event);
      }

      if (props.type === "date") {
        handleDate(event);
      }
    },
    ref: props.inputRef,
    value: props.value,
    style: _extends({}, props.style),
    defaultValue: props.defaultValue,
    minLength: props.minlength,
    maxLength: props.maxlength,
    max: props.max,
    required: props.isRequired || props.type === "date" && (props.name === "fromDate" ? data.toDate : data.fromDate),
    pattern: props.pattern,
    min: props.min,
    readOnly: props.disable,
    title: props.title,
    step: props.step,
    autoFocus: props.autoFocus,
    onBlur: props.onBlur,
    onKeyPress: props.onKeyPress,
    autoComplete: "off"
  }), props.type === "date" && /*#__PURE__*/React__default.createElement(DatePicker$1, _extends({}, props, {
    date: date,
    setDate: setDate,
    data: data
  })), props.signature ? props.signatureImg : null));
};

TextInput.propTypes = {
  userType: propTypes.string,
  isMandatory: propTypes.bool,
  name: propTypes.string,
  placeholder: propTypes.string,
  onChange: propTypes.func,
  ref: propTypes.func,
  value: propTypes.any
};
TextInput.defaultProps = {
  isMandatory: false
};

function DatePicker$1(props) {
  React.useEffect(function () {
    if (props !== null && props !== void 0 && props.shouldUpdate) {
      props === null || props === void 0 ? void 0 : props.setDate(getDDMMYYYY(props === null || props === void 0 ? void 0 : props.data[props.name]));
    }
  }, [props === null || props === void 0 ? void 0 : props.data]);
  React.useEffect(function () {
    props.setDate(getDDMMYYYY(props === null || props === void 0 ? void 0 : props.defaultValue));
  }, []);
  return /*#__PURE__*/React__default.createElement("input", {
    type: "text",
    className: (props.disable && "disabled") + " card-date-input",
    name: props.name,
    id: props.id,
    placeholder: props.placeholder,
    defaultValue: props.date,
    readOnly: true
  });
}

function getDDMMYYYY(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-In").split(",")[0];
}

var TopBar = function TopBar(_ref) {
  var img = _ref.img,
      isMobile = _ref.isMobile,
      toggleSidebar = _ref.toggleSidebar;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "navbar"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "center-container"
  }, isMobile && /*#__PURE__*/React__default.createElement(Hamburger, {
    handleClick: toggleSidebar
  }), /*#__PURE__*/React__default.createElement("img", {
    className: "city",
    id: "topbar-logo",
    crossOrigin: "anonymous",
    src: img || "https://cdn.jsdelivr.net/npm/@egovernments/digit-ui-css@1.0.7/img/m_seva_white_logo.png",
    alt: "mSeva"
  })));
};

TopBar.propTypes = {
  img: propTypes.string
};
TopBar.defaultProps = {
  img: undefined
};

var getCitizenStyles = function getCitizenStyles(value) {
  var citizenStyles = {};

  if (value == "propertyCreate") {
    citizenStyles = {
      textStyles: {
        whiteSpace: "nowrap",
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis"
      },
      tagStyles: {
        width: "90%"
      },
      inputStyles: {
        width: "44%"
      },
      buttonStyles: {
        height: "auto",
        minHeight: "2rem",
        width: "40%"
      },
      tagContainerStyles: {
        width: "60%"
      }
    };
  } else {
    citizenStyles = {
      textStyles: {},
      tagStyles: {},
      inputStyles: {},
      buttonStyles: {},
      tagContainerStyles: {}
    };
  }

  return citizenStyles;
};

var UploadFile = function UploadFile(props) {
  var _extraStyles, _extraStyles2, _extraStyles3, _extraStyles4, _inpRef$current$files, _inpRef$current$files2, _extraStyles5;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var inpRef = React.useRef();

  var _useState = React.useState(false),
      hasFile = _useState[0],
      setHasFile = _useState[1];

  var extraStyles = {};

  var handleChange = function handleChange() {
    if (inpRef.current.files[0]) setHasFile(true);else setHasFile(false);
  };

  switch (props.extraStyleName) {
    case "propertyCreate":
      extraStyles = getCitizenStyles("propertyCreate");
      break;

    default:
      extraStyles = getCitizenStyles("");
  }

  var handleDelete = function handleDelete() {
    inpRef.current.value = "";
    props.onDelete();
  };

  if (props.uploadMessage && inpRef.current.value) {
    handleDelete();
    setHasFile(false);
  }

  React.useEffect(function () {
    return handleChange();
  }, [props.message]);
  var showHint = (props === null || props === void 0 ? void 0 : props.showHint) || false;
  return /*#__PURE__*/React__default.createElement(React.Fragment, null, showHint && /*#__PURE__*/React__default.createElement("p", {
    className: "cell-text"
  }, t(props === null || props === void 0 ? void 0 : props.hintText)), /*#__PURE__*/React__default.createElement("div", {
    className: "upload-file " + (props.disabled ? " disabled" : "")
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(ButtonSelector, {
    theme: "border",
    label: t("CS_COMMON_CHOOSE_FILE"),
    style: _extends({}, extraStyles ? (_extraStyles = extraStyles) === null || _extraStyles === void 0 ? void 0 : _extraStyles.buttonStyles : {}, props.disabled ? {
      display: "none"
    } : {}),
    textStyles: props === null || props === void 0 ? void 0 : props.textStyles,
    type: props.buttonType
  }), !hasFile || props.error ? /*#__PURE__*/React__default.createElement("h2", {
    className: "file-upload-status"
  }, props.message) : /*#__PURE__*/React__default.createElement("div", {
    className: "tag-container",
    style: extraStyles ? (_extraStyles2 = extraStyles) === null || _extraStyles2 === void 0 ? void 0 : _extraStyles2.tagContainerStyles : null
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "tag",
    style: extraStyles ? (_extraStyles3 = extraStyles) === null || _extraStyles3 === void 0 ? void 0 : _extraStyles3.tagStyles : null
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "text",
    style: extraStyles ? (_extraStyles4 = extraStyles) === null || _extraStyles4 === void 0 ? void 0 : _extraStyles4.textStyles : null
  }, (_inpRef$current$files = inpRef.current.files[0]) === null || _inpRef$current$files === void 0 ? void 0 : (_inpRef$current$files2 = _inpRef$current$files.name) === null || _inpRef$current$files2 === void 0 ? void 0 : _inpRef$current$files2.slice(0, 20)), /*#__PURE__*/React__default.createElement("span", {
    onClick: function onClick() {
      return handleDelete();
    }
  }, /*#__PURE__*/React__default.createElement(Close, {
    className: "close"
  }))))), /*#__PURE__*/React__default.createElement("input", {
    className: props.disabled ? "disabled" : "",
    style: extraStyles ? _extends({}, (_extraStyles5 = extraStyles) === null || _extraStyles5 === void 0 ? void 0 : _extraStyles5.inputStyles, props === null || props === void 0 ? void 0 : props.inputStyles) : _extends({}, props === null || props === void 0 ? void 0 : props.inputStyles),
    ref: inpRef,
    type: "file",
    name: "file",
    accept: props.accept,
    disabled: props.disabled,
    onChange: function onChange(e) {
      return props.onUpload(e);
    }
  })));
};

var Option = function Option(_ref) {
  var name = _ref.name,
      Icon = _ref.Icon,
      onClick = _ref.onClick,
      className = _ref.className;
  return /*#__PURE__*/React__default.createElement("div", {
    className: className || "CardBasedOptionsMainChildOption",
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "ChildOptionImageWrapper"
  }, Icon), /*#__PURE__*/React__default.createElement("p", {
    className: "ChildOptionName"
  }, name));
};

var CardBasedOptions = function CardBasedOptions(_ref2) {
  var header = _ref2.header,
      sideOption = _ref2.sideOption,
      options = _ref2.options;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "CardBasedOptions"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "headContent"
  }, /*#__PURE__*/React__default.createElement("h2", null, header), /*#__PURE__*/React__default.createElement("p", {
    onClick: sideOption.onClick
  }, sideOption.name)), /*#__PURE__*/React__default.createElement("div", {
    className: "mainContent"
  }, options.map(function (props, index) {
    return /*#__PURE__*/React__default.createElement(Option, _extends({
      key: index
    }, props));
  })));
};

var WhatsNewCard = function WhatsNewCard(_ref) {
  var header = _ref.header,
      eventNotificationText = _ref.eventNotificationText,
      timePastAfterEventCreation = _ref.timePastAfterEventCreation,
      timeApproxiamationInUnits = _ref.timeApproxiamationInUnits;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React__default.createElement("div", {
    className: "WhatsNewCard"
  }, /*#__PURE__*/React__default.createElement("h2", null, t(header)), /*#__PURE__*/React__default.createElement("p", null, eventNotificationText), /*#__PURE__*/React__default.createElement("p", null, timePastAfterEventCreation + (" " + t(timeApproxiamationInUnits))));
};

var FormComposer = function FormComposer(props) {
  var _useForm = reactHookForm.useForm({
    defaultValues: props.defaultValues
  }),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      setValue = _useForm.setValue,
      getValues = _useForm.getValues,
      watch = _useForm.watch,
      control = _useForm.control,
      formState = _useForm.formState,
      errors = _useForm.errors,
      setError = _useForm.setError,
      clearErrors = _useForm.clearErrors;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var formData = watch();
  React.useEffect(function () {
    props.getFormAccessors && props.getFormAccessors({
      setValue: setValue,
      getValues: getValues
    });
  }, []);

  function onSubmit(data) {
    props.onSubmit(data);
  }

  function onSecondayActionClick(data) {
    props.onSecondayActionClick();
  }

  React.useEffect(function () {
    props.onFormValueChange && props.onFormValueChange(setValue, formData, formState);
  }, [formData]);

  var fieldSelector = function fieldSelector(type, populators, isMandatory, disable, component, config) {
    if (disable === void 0) {
      disable = false;
    }

    switch (type) {
      case "text":
      case "date":
      case "number":
      case "password":
        return /*#__PURE__*/React__default.createElement("div", {
          className: "field-container"
        }, populators.componentInFront ? /*#__PURE__*/React__default.createElement("span", {
          className: "component-in-front " + (disable && "disabled")
        }, populators.componentInFront) : null, /*#__PURE__*/React__default.createElement(TextInput, _extends({
          className: "field"
        }, populators, {
          inputRef: register(populators.validation),
          isRequired: isMandatory,
          type: type,
          disable: disable,
          watch: watch
        })));

      case "textarea":
        return /*#__PURE__*/React__default.createElement(TextArea, _extends({
          className: "field",
          name: (populators === null || populators === void 0 ? void 0 : populators.name) || ""
        }, populators, {
          inputRef: register(populators.validation),
          disable: disable
        }));

      case "mobileNumber":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement(MobileNumber, {
              className: "field",
              onChange: props.onChange,
              value: props.value,
              disable: disable
            });
          },
          defaultValue: populators.defaultValue,
          name: populators === null || populators === void 0 ? void 0 : populators.name,
          control: control
        });

      case "custom":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return populators.component(_extends({}, props, {
              setValue: setValue
            }), populators.customProps);
          },
          defaultValue: populators.defaultValue,
          name: populators === null || populators === void 0 ? void 0 : populators.name,
          control: control
        });

      case "component":
        var Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement(Component, {
              userType: "employee",
              t: t,
              setValue: setValue,
              onSelect: setValue,
              config: config,
              data: formData,
              formData: formData,
              register: register,
              errors: errors,
              props: props,
              setError: setError,
              clearErrors: clearErrors,
              formState: formState,
              onBlur: props.onBlur
            });
          },
          name: config.key,
          control: control
        });

      default:
        return (populators === null || populators === void 0 ? void 0 : populators.dependency) !== false ? populators : null;
    }
  };

  var formFields = React.useMemo(function () {
    var _props$config;

    return (_props$config = props.config) === null || _props$config === void 0 ? void 0 : _props$config.map(function (section, index, array) {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, section.head && /*#__PURE__*/React__default.createElement(CardSectionHeader, {
        id: section.headId
      }, t(section.head)), section.body.map(function (field, index) {
        var _field$populators, _field$populators2, _field$populators3, _field$populators4, _field$populators5, _field$populators6;

        if (props.inline) return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
          key: index
        }, !field.withoutLabel && /*#__PURE__*/React__default.createElement(CardLabel, {
          style: {
            marginBottom: props.inline ? "8px" : "revert"
          },
          className: field !== null && field !== void 0 && field.disable ? "disabled" : ""
        }, t(field.label), field.isMandatory ? " * " : null), errors && errors[(_field$populators = field.populators) === null || _field$populators === void 0 ? void 0 : _field$populators.name] && Object.keys(errors[(_field$populators2 = field.populators) === null || _field$populators2 === void 0 ? void 0 : _field$populators2.name]).length ? /*#__PURE__*/React__default.createElement(CardLabelError, null, field.populators.error) : null, /*#__PURE__*/React__default.createElement("div", {
          style: field.withoutLabel ? {
            width: "100%"
          } : {},
          className: "field"
        }, fieldSelector(field.type, field.populators, field.isMandatory, field === null || field === void 0 ? void 0 : field.disable, field === null || field === void 0 ? void 0 : field.component, field), (field === null || field === void 0 ? void 0 : field.description) && /*#__PURE__*/React__default.createElement(CardLabel, {
          style: _extends({
            marginTop: "-24px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#505A5F"
          }, field === null || field === void 0 ? void 0 : field.descriptionStyles)
        }, t(field.description))));
        return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(LabelFieldPair, {
          key: index
        }, !field.withoutLabel && /*#__PURE__*/React__default.createElement(CardLabel, {
          style: {
            marginBottom: props.inline ? "8px" : "revert"
          }
        }, t(field.label), field.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
          style: field.withoutLabel ? _extends({
            width: "100%"
          }, props === null || props === void 0 ? void 0 : props.fieldStyle) : {},
          className: "field"
        }, fieldSelector(field.type, field.populators, field.isMandatory, field === null || field === void 0 ? void 0 : field.disable, field === null || field === void 0 ? void 0 : field.component, field))), field !== null && field !== void 0 && (_field$populators3 = field.populators) !== null && _field$populators3 !== void 0 && _field$populators3.name && errors && errors[field === null || field === void 0 ? void 0 : (_field$populators4 = field.populators) === null || _field$populators4 === void 0 ? void 0 : _field$populators4.name] && Object.keys(errors[field === null || field === void 0 ? void 0 : (_field$populators5 = field.populators) === null || _field$populators5 === void 0 ? void 0 : _field$populators5.name]).length ? /*#__PURE__*/React__default.createElement(CardLabelError, {
          style: {
            width: "70%",
            marginLeft: "30%",
            fontSize: "12px",
            marginTop: "-21px"
          }
        }, field === null || field === void 0 ? void 0 : (_field$populators6 = field.populators) === null || _field$populators6 === void 0 ? void 0 : _field$populators6.error) : null);
      }), !props.noBreakLine && (array.length - 1 === index ? null : /*#__PURE__*/React__default.createElement(BreakLine, {
        style: props !== null && props !== void 0 && props.breaklineStyle ? props === null || props === void 0 ? void 0 : props.breaklineStyle : {}
      })));
    });
  }, [props.config, formData]);

  var getCardStyles = function getCardStyles() {
    var styles = props.cardStyle || {};
    if (props.noBoxShadow) styles = _extends({}, styles, {
      boxShadow: "none"
    });
    return styles;
  };

  var isDisabled = props.isDisabled || false;
  return /*#__PURE__*/React__default.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    id: props.formId
  }, /*#__PURE__*/React__default.createElement(Card, {
    style: getCardStyles()
  }, !props.childrenAtTheBottom && props.children, props.heading && /*#__PURE__*/React__default.createElement(CardSubHeader, {
    style: _extends({}, props.headingStyle)
  }, " ", props.heading, " "), props.description && /*#__PURE__*/React__default.createElement(CardLabelDesc, null, " ", props.description, " "), props.text && /*#__PURE__*/React__default.createElement(CardText, null, props.text), formFields, props.childrenAtTheBottom && props.children, props.submitInForm && /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: t(props.label),
    submit: "submit",
    className: "w-full"
  }), props.secondaryActionLabel && /*#__PURE__*/React__default.createElement("div", {
    className: "primary-label-btn",
    style: {
      margin: "20px auto 0 auto"
    },
    onClick: onSecondayActionClick
  }, props.secondaryActionLabel), !props.submitInForm && props.label && /*#__PURE__*/React__default.createElement(ActionBar, null, /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: t(props.label),
    submit: "submit",
    disabled: isDisabled
  }))));
};

var Modal = function Modal(_ref) {
  var headerBarMain = _ref.headerBarMain,
      headerBarEnd = _ref.headerBarEnd,
      popupStyles = _ref.popupStyles,
      children = _ref.children,
      actionCancelLabel = _ref.actionCancelLabel,
      actionCancelOnSubmit = _ref.actionCancelOnSubmit,
      actionSaveLabel = _ref.actionSaveLabel,
      actionSaveOnSubmit = _ref.actionSaveOnSubmit,
      error = _ref.error,
      setError = _ref.setError,
      formId = _ref.formId,
      isDisabled = _ref.isDisabled,
      hideSubmit = _ref.hideSubmit;
  React.useEffect(function () {
    document.body.style.overflowY = 'hidden';
    return function () {
      document.body.style.overflowY = 'auto';
    };
  }, []);
  return /*#__PURE__*/React__default.createElement(PopUp, null, /*#__PURE__*/React__default.createElement("div", {
    className: "popup-module",
    style: popupStyles
  }, /*#__PURE__*/React__default.createElement(HeaderBar, {
    main: headerBarMain,
    end: headerBarEnd
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "popup-module-main"
  }, children, /*#__PURE__*/React__default.createElement("div", {
    className: "popup-module-action-bar"
  }, actionCancelLabel ? /*#__PURE__*/React__default.createElement(ButtonSelector, {
    theme: "border",
    label: actionCancelLabel,
    onSubmit: actionCancelOnSubmit
  }) : null, !hideSubmit ? /*#__PURE__*/React__default.createElement(ButtonSelector, {
    label: actionSaveLabel,
    onSubmit: actionSaveOnSubmit,
    formId: formId,
    isDisabled: isDisabled
  }) : null))), error && /*#__PURE__*/React__default.createElement(Toast, {
    label: error,
    onClose: function onClose() {
      return setError(null);
    },
    error: true
  }));
};

var ResponseComposer = function ResponseComposer(_ref) {
  var data = _ref.data,
      template = _ref.template,
      actionButtonLabel = _ref.actionButtonLabel,
      _onSubmit = _ref.onSubmit;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React__default.createElement("div", null, data.map(function (result, i) {
    return /*#__PURE__*/React__default.createElement(Card, {
      key: i,
      className: "box-shadow-none"
    }, template.map(function (field, j) {
      return /*#__PURE__*/React__default.createElement(KeyNote, {
        key: i + "" + j,
        keyValue: t(field.label),
        note: field.notePrefix ? field.notePrefix + result[field.key] : result[field.key],
        noteStyle: field.noteStyle
      });
    }), actionButtonLabel && /*#__PURE__*/React__default.createElement(SubmitBar, {
      submit: false,
      label: t(actionButtonLabel),
      onSubmit: function onSubmit() {
        _onSubmit(result);
      }
    }));
  }));
};

ResponseComposer.propTypes = {
  data: propTypes.array,
  template: propTypes.array,
  actionButtonLabel: propTypes.string,
  onSubmit: propTypes.func
};
ResponseComposer.defaultProps = {
  data: [],
  template: [],
  actionButtonLabel: "",
  onSubmit: function onSubmit() {}
};

var CityMohalla = function CityMohalla(_ref) {
  var header = _ref.header,
      subHeader = _ref.subHeader,
      cardText = _ref.cardText,
      cardLabelCity = _ref.cardLabelCity,
      cardLabelMohalla = _ref.cardLabelMohalla,
      nextText = _ref.nextText,
      selectedCity = _ref.selectedCity,
      cities = _ref.cities,
      localities = _ref.localities,
      selectCity = _ref.selectCity,
      selectLocalities = _ref.selectLocalities,
      onSave = _ref.onSave,
      selectedLocality = _ref.selectedLocality;
  return /*#__PURE__*/React__default.createElement(Card, null, /*#__PURE__*/React__default.createElement(CardSubHeader, null, subHeader), /*#__PURE__*/React__default.createElement(CardHeader, null, header), /*#__PURE__*/React__default.createElement(CardText, null, cardText), /*#__PURE__*/React__default.createElement(CardLabel, null, cardLabelCity, "* "), /*#__PURE__*/React__default.createElement(Dropdown, {
    isMandatory: true,
    selected: selectedCity,
    option: cities,
    select: selectCity
  }), /*#__PURE__*/React__default.createElement(CardLabel, null, cardLabelMohalla, " *"), /*#__PURE__*/React__default.createElement(Dropdown, {
    isMandatory: true,
    selected: selectedLocality,
    option: localities,
    select: selectLocalities
  }), /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: nextText,
    onSubmit: onSave
  }));
};

CityMohalla.propTypes = {
  header: propTypes.string,
  subHeader: propTypes.string,
  cardText: propTypes.string,
  cardLabelCity: propTypes.string,
  cardLabelMohalla: propTypes.string,
  nextText: propTypes.string,
  selectedCity: propTypes.string,
  cities: propTypes.array,
  localities: propTypes.array,
  selectCity: propTypes.string,
  selectedLocality: propTypes.string,
  selectLocalities: propTypes.func,
  onSave: propTypes.func
};
CityMohalla.defaultProps = {
  header: "",
  subHeader: "",
  cardText: "",
  cardLabelCity: "",
  cardLabelMohalla: "",
  nextText: "",
  selectedCity: "",
  cities: [],
  localities: [],
  selectCity: "",
  selectedLocality: "",
  selectLocalities: undefined,
  onSave: undefined
};

var ArrowRight = function ArrowRight(_ref) {
  var to = _ref.to;
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: to
  }, /*#__PURE__*/React__default.createElement("svg", {
    style: {
      display: "inline",
      height: "24px"
    },
    xmlns: "http://www.w3.org/2000/svg",
    width: "32",
    height: "32",
    viewBox: "0 0 32 32",
    fill: "none"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z",
    fill: "#F47738"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M16 5.33325L14.12 7.21325L21.56 14.6666H5.33337V17.3333H21.56L14.12 24.7866L16 26.6666L26.6667 15.9999L16 5.33325Z",
    fill: "white"
  })));
};

var DashboardBox = function DashboardBox(_ref2) {
  var _ref2$t = _ref2.t,
      t = _ref2$t === void 0 ? function (val) {
    return val;
  } : _ref2$t,
      svgIcon = _ref2.svgIcon,
      header = _ref2.header,
      info = _ref2.info,
      links = _ref2.links;
  var mobileView = innerWidth <= 640;
  var employeeCardStyles = mobileView ? {
    width: "96vw",
    margin: "8px auto"
  } : {
    width: "328px"
  };
  return /*#__PURE__*/React__default.createElement("div", {
    className: "employeeCard card-home",
    style: _extends({
      padding: 0
    }, employeeCardStyles)
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "complaint-links-container"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "logo"
  }, svgIcon), /*#__PURE__*/React__default.createElement("span", {
    className: "text"
  }, t(header))), /*#__PURE__*/React__default.createElement("div", {
    className: "body "
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "employeeCard-info-box"
  }, Object.keys(info).map(function (key, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: index,
      className: "employeeCard-info-data"
    }, /*#__PURE__*/React__default.createElement("span", null, t(info[key])), /*#__PURE__*/React__default.createElement("span", {
      style: {
        fontWeight: "bold"
      }
    }, t(key)));
  }))), /*#__PURE__*/React__default.createElement("hr", {
    className: "underline"
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "body"
  }, links.map(function (link, index) {
    return /*#__PURE__*/React__default.createElement("span", {
      key: index,
      className: "link"
    }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: link.pathname
    }, /*#__PURE__*/React__default.createElement("span", null, t(link.label))), !isNaN(link.total) && /*#__PURE__*/React__default.createElement("span", {
      className: "inbox-total"
    }, link.total), /*#__PURE__*/React__default.createElement(ArrowRight, {
      to: link.pathname
    }));
  }))));
};

var Details$1 = function Details(_ref) {
  var label = _ref.label,
      name = _ref.name;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "detail"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "label"
  }, /*#__PURE__*/React__default.createElement("h2", null, label)), /*#__PURE__*/React__default.createElement("span", {
    className: "name"
  }, name));
};

var DetailsCard = function DetailsCard(_ref2) {
  var data = _ref2.data,
      serviceRequestIdKey = _ref2.serviceRequestIdKey,
      linkPrefix = _ref2.linkPrefix,
      handleSelect = _ref2.handleSelect,
      selectedItems = _ref2.selectedItems,
      keyForSelected = _ref2.keyForSelected;

  if (linkPrefix && serviceRequestIdKey) {
    return /*#__PURE__*/React__default.createElement("div", null, data.map(function (object, itemIndex) {
      return /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
        key: itemIndex,
        to: "" + linkPrefix + (typeof serviceRequestIdKey === "function" ? serviceRequestIdKey(object) : object[serviceRequestIdKey])
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "details-container"
      }, Object.keys(object).map(function (name, index) {
        return /*#__PURE__*/React__default.createElement(Details$1, {
          label: name,
          name: object[name],
          key: index
        });
      })));
    }));
  }

  return /*#__PURE__*/React__default.createElement("div", null, data.map(function (object, itemIndex) {
    if (serviceRequestIdKey && linkPrefix) {
      return /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
        key: itemIndex,
        to: "" + linkPrefix + (typeof serviceRequestIdKey === "function" ? serviceRequestIdKey(object) : object[serviceRequestIdKey])
      }, /*#__PURE__*/React__default.createElement("div", {
        className: "details-container"
      }, Object.keys(object).map(function (name, index) {
        return /*#__PURE__*/React__default.createElement(Details$1, {
          label: name,
          name: object[name],
          key: index
        });
      })));
    }

    return /*#__PURE__*/React__default.createElement("div", {
      key: itemIndex,
      style: {
        border: selectedItems !== null && selectedItems !== void 0 && selectedItems.includes(object[keyForSelected]) ? "2px solid #f47738" : "2px solid #fff"
      },
      className: "details-container",
      onClick: function onClick() {
        return handleSelect(object);
      }
    }, Object.keys(object).map(function (name, index) {
      return /*#__PURE__*/React__default.createElement(Details$1, {
        label: name,
        name: object[name],
        key: index
      });
    }));
  }));
};

DetailsCard.propTypes = {
  data: propTypes.array
};
DetailsCard.defaultProps = {
  data: []
};

var FilterAction = function FilterAction(_ref) {
  var text = _ref.text,
      handleActionClick = _ref.handleActionClick,
      props = _objectWithoutPropertiesLoose(_ref, ["text", "handleActionClick"]);

  return /*#__PURE__*/React__default.createElement("div", {
    className: "searchAction",
    onClick: handleActionClick
  }, /*#__PURE__*/React__default.createElement(RoundedLabel, {
    count: props.filterCount
  }), /*#__PURE__*/React__default.createElement(FilterSvg, null), " ", /*#__PURE__*/React__default.createElement("span", {
    className: "searchText"
  }, text));
};

var InputCard = function InputCard(_ref) {
  var t = _ref.t,
      children = _ref.children,
      _ref$texts = _ref.texts,
      texts = _ref$texts === void 0 ? {} : _ref$texts,
      _ref$submit = _ref.submit,
      submit = _ref$submit === void 0 ? false : _ref$submit,
      onNext = _ref.onNext,
      onSkip = _ref.onSkip,
      isDisable = _ref.isDisable,
      onAdd = _ref.onAdd,
      _ref$isMultipleAllow = _ref.isMultipleAllow,
      isMultipleAllow = _ref$isMultipleAllow === void 0 ? false : _ref$isMultipleAllow,
      _ref$cardStyle = _ref.cardStyle,
      cardStyle = _ref$cardStyle === void 0 ? {} : _ref$cardStyle;
  return /*#__PURE__*/React__default.createElement(Card, {
    style: cardStyle
  }, texts.headerCaption && /*#__PURE__*/React__default.createElement(CardCaption, null, t(texts.headerCaption)), /*#__PURE__*/React__default.createElement(CardHeader, null, t(texts.header)), /*#__PURE__*/React__default.createElement(CardText, null, t(texts.cardText)), children, texts.submitBarLabel ? /*#__PURE__*/React__default.createElement(SubmitBar, {
    disabled: isDisable,
    submit: submit,
    label: t(texts.submitBarLabel),
    onSubmit: onNext
  }) : null, texts.skipText ? /*#__PURE__*/React__default.createElement(LinkButton, {
    label: t(texts.skipText),
    onClick: onSkip
  }) : null, isMultipleAllow && texts.addMultipleText ? /*#__PURE__*/React__default.createElement(LinkButton, {
    label: t(texts.addMultipleText),
    onClick: onAdd
  }) : null);
};

InputCard.propTypes = {
  text: propTypes.object,
  submit: propTypes.bool,
  onNext: propTypes.func,
  onSkip: propTypes.func,
  onAdd: propTypes.func,
  t: propTypes.func
};
InputCard.defaultProps = {
  texts: {},
  submit: false,
  onNext: undefined,
  onSkip: undefined,
  onAdd: undefined,
  t: function t(value) {
    return value;
  }
};

var FormStep = function FormStep(_ref) {
  var _config$inputs;

  var t = _ref.t,
      children = _ref.children,
      config = _ref.config,
      onSelect = _ref.onSelect,
      onSkip = _ref.onSkip,
      value = _ref.value,
      onChange = _ref.onChange,
      isDisabled = _ref.isDisabled,
      _ref$_defaultValues = _ref._defaultValues,
      _defaultValues = _ref$_defaultValues === void 0 ? {} : _ref$_defaultValues,
      forcedError = _ref.forcedError,
      componentInFront = _ref.componentInFront,
      onAdd = _ref.onAdd,
      _ref$cardStyle = _ref.cardStyle,
      cardStyle = _ref$cardStyle === void 0 ? {} : _ref$cardStyle,
      _ref$isMultipleAllow = _ref.isMultipleAllow,
      isMultipleAllow = _ref$isMultipleAllow === void 0 ? false : _ref$isMultipleAllow,
      _ref$showErrorBelowCh = _ref.showErrorBelowChildren,
      showErrorBelowChildren = _ref$showErrorBelowCh === void 0 ? false : _ref$showErrorBelowCh,
      _ref$childrenAtTheBot = _ref.childrenAtTheBottom,
      childrenAtTheBottom = _ref$childrenAtTheBot === void 0 ? true : _ref$childrenAtTheBot;

  var _useForm = reactHookForm.useForm({
    defaultValues: _defaultValues
  }),
      register = _useForm.register,
      errors = _useForm.errors,
      handleSubmit = _useForm.handleSubmit;

  var goNext = function goNext(data) {
    onSelect(data);
  };

  var isDisable = isDisabled ? true : config.canDisable && Object.keys(errors).filter(function (i) {
    return errors[i];
  }).length;
  var inputs = (_config$inputs = config.inputs) === null || _config$inputs === void 0 ? void 0 : _config$inputs.map(function (input, index) {
    if (input.type === "text") {
      var _input$validation, _input$validation2;

      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, /*#__PURE__*/React__default.createElement(CardLabel, null, t(input.label)), errors[input.name] && /*#__PURE__*/React__default.createElement(CardLabelError, null, t(input.error)), /*#__PURE__*/React__default.createElement("div", {
        className: "field-container"
      }, componentInFront ? /*#__PURE__*/React__default.createElement("span", {
        className: "citizen-card-input citizen-card-input--front"
      }, componentInFront) : null, /*#__PURE__*/React__default.createElement(TextInput, {
        key: index,
        name: input.name,
        value: value,
        onChange: onChange,
        minlength: input.validation.minlength,
        maxlength: input.validation.maxlength,
        pattern: (_input$validation = input.validation) === null || _input$validation === void 0 ? void 0 : _input$validation.pattern,
        title: (_input$validation2 = input.validation) === null || _input$validation2 === void 0 ? void 0 : _input$validation2.title,
        inputRef: register(input.validation),
        isMandatory: errors[input.name],
        disable: input.disable ? input.disable : false
      })));
    }

    if (input.type === "textarea") return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, /*#__PURE__*/React__default.createElement(CardLabel, null, t(input.label)), /*#__PURE__*/React__default.createElement(TextArea, {
      key: index,
      name: input.name,
      value: value,
      onChange: onChange,
      inputRef: register(input.validation),
      maxLength: "1024"
    }));
  });
  return /*#__PURE__*/React__default.createElement("form", {
    onSubmit: handleSubmit(goNext)
  }, /*#__PURE__*/React__default.createElement(InputCard, _extends({
    isDisable: isDisable,
    isMultipleAllow: isMultipleAllow
  }, config, {
    cardStyle: cardStyle,
    submit: true
  }, {
    onSkip: onSkip,
    onAdd: onAdd
  }, {
    t: t
  }), !childrenAtTheBottom && children, inputs, forcedError && !showErrorBelowChildren && /*#__PURE__*/React__default.createElement(CardLabelError, null, t(forcedError)), childrenAtTheBottom && children, forcedError && showErrorBelowChildren && /*#__PURE__*/React__default.createElement(CardLabelError, null, t(forcedError))));
};

FormStep.propTypes = {
  config: propTypes.shape({}),
  onSelect: propTypes.func,
  onSkip: propTypes.func,
  onAdd: propTypes.func,
  t: propTypes.func
};
FormStep.defaultProps = {
  config: {},
  onSelect: undefined,
  onSkip: undefined,
  onAdd: undefined,
  t: function t(value) {
    return value;
  }
};

var Localities = function Localities(_ref) {
  var selectLocality = _ref.selectLocality,
      tenantId = _ref.tenantId,
      boundaryType = _ref.boundaryType,
      keepNull = _ref.keepNull,
      selected = _ref.selected,
      optionCardStyles = _ref.optionCardStyles,
      style = _ref.style,
      disable = _ref.disable,
      disableLoader = _ref.disableLoader,
      sortFn = _ref.sortFn;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _Digit$Hooks$useBound = Digit.Hooks.useBoundaryLocalities(tenantId, boundaryType, {
    enabled: !disable
  }, t),
      tenantlocalties = _Digit$Hooks$useBound.data,
      isLoading = _Digit$Hooks$useBound.isLoading;

  if (isLoading && !disableLoader) {
    return /*#__PURE__*/React__default.createElement(Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(Dropdown, {
    option: sortFn ? tenantlocalties === null || tenantlocalties === void 0 ? void 0 : tenantlocalties.sort(sortFn) : tenantlocalties,
    keepNull: keepNull === false ? false : true,
    selected: selected,
    select: selectLocality,
    optionCardStyles: optionCardStyles,
    optionKey: "i18nkey",
    style: style,
    disable: !(tenantlocalties !== null && tenantlocalties !== void 0 && tenantlocalties.length) || disable
  });
};

var LocationSearchCard = function LocationSearchCard(_ref) {
  var header = _ref.header,
      cardText = _ref.cardText,
      nextText = _ref.nextText,
      t = _ref.t,
      skipAndContinueText = _ref.skipAndContinueText,
      forcedError = _ref.forcedError,
      skip = _ref.skip,
      onSave = _ref.onSave,
      onChange = _ref.onChange,
      position = _ref.position,
      disabled = _ref.disabled,
      _ref$cardBodyStyle = _ref.cardBodyStyle,
      cardBodyStyle = _ref$cardBodyStyle === void 0 ? {} : _ref$cardBodyStyle,
      isPTDefault = _ref.isPTDefault,
      PTdefaultcoord = _ref.PTdefaultcoord;
  var isDisabled =  disabled;

  var onLocationChange = function onLocationChange(val, location) {
    isDisabled = val ? false : true;
    onChange(val, location);
  };

  return /*#__PURE__*/React__default.createElement(Card, null, /*#__PURE__*/React__default.createElement(CardHeader, null, header), /*#__PURE__*/React__default.createElement("div", {
    style: cardBodyStyle
  }, /*#__PURE__*/React__default.createElement(CardText, null, cardText), /*#__PURE__*/React__default.createElement(LocationSearch, {
    onChange: onLocationChange,
    position: position,
    isPTDefault: isPTDefault,
    PTdefaultcoord: PTdefaultcoord
  }), forcedError && /*#__PURE__*/React__default.createElement(CardLabelError, null, t(forcedError))), /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: nextText,
    onSubmit: onSave,
    disabled: isDisabled
  }), skip ? /*#__PURE__*/React__default.createElement(LinkButton, {
    onClick: skip,
    label: skipAndContinueText
  }) : null);
};

LocationSearchCard.propTypes = {
  header: propTypes.string,
  cardText: propTypes.string,
  nextText: propTypes.string,
  skipAndContinueText: propTypes.string,
  skip: propTypes.func,
  onSave: propTypes.func,
  onChange: propTypes.func,
  position: propTypes.any,
  isPTDefault: propTypes.any,
  PTdefaultcoord: propTypes.any
};
LocationSearchCard.defaultProps = {
  header: "",
  cardText: "",
  nextText: "",
  skipAndContinueText: "",
  skip: function skip() {},
  onSave: null,
  onChange: function onChange() {},
  position: undefined,
  isPTDefault: false,
  PTdefaultcoord: {}
};

var DimentionInput = function DimentionInput(_ref) {
  var name = _ref.name,
      value = _ref.value,
      onChange = _ref.onChange,
      disable = _ref.disable;
  return /*#__PURE__*/React__default.createElement(TextInput, {
    type: "number",
    name: name,
    value: value,
    onChange: onChange,
    disable: disable,
    pattern: "[0-9]{1,2}",
    min: "0.1",
    max: "99.9",
    step: "0.1"
  });
};

var PitDimension = function PitDimension(_ref2) {
  var sanitationType = _ref2.sanitationType,
      t = _ref2.t,
      _ref2$size = _ref2.size,
      size = _ref2$size === void 0 ? {} : _ref2$size,
      handleChange = _ref2.handleChange,
      _ref2$disable = _ref2.disable,
      disable = _ref2$disable === void 0 ? false : _ref2$disable;
  return (sanitationType === null || sanitationType === void 0 ? void 0 : sanitationType.dimension) === "dd" ? /*#__PURE__*/React__default.createElement("div", {
    className: "inputWrapper"
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(DimentionInput, {
    name: "diameter",
    value: size["diameter"] || "",
    onChange: handleChange,
    disable: disable
  }), /*#__PURE__*/React__default.createElement(CardText, {
    style: {
      textAlign: "center"
    },
    disable: disable
  }, t("CS_FILE_PROPERTY_DIAMETER"))), /*#__PURE__*/React__default.createElement("span", null, "x"), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(DimentionInput, {
    name: "height",
    value: size["height"] || "",
    onChange: handleChange,
    disable: disable
  }), /*#__PURE__*/React__default.createElement(CardText, {
    style: {
      textAlign: "center"
    },
    disable: disable
  }, t("CS_FILE_PROPERTY_HEIGHT")))) : /*#__PURE__*/React__default.createElement("div", {
    className: "inputWrapper"
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(DimentionInput, {
    name: "length",
    value: size["length"] || "",
    onChange: handleChange,
    disable: disable
  }), /*#__PURE__*/React__default.createElement(CardText, {
    style: {
      textAlign: "center"
    },
    disable: disable
  }, t("CS_FILE_PROPERTY_LENGTH"))), /*#__PURE__*/React__default.createElement("span", null, "x"), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(DimentionInput, {
    name: "width",
    value: size["width"] || "",
    onChange: handleChange,
    disable: disable
  }), /*#__PURE__*/React__default.createElement(CardText, {
    style: {
      textAlign: "center"
    },
    disable: disable
  }, t("CS_FILE_PROPERTY_WIDTH"))), /*#__PURE__*/React__default.createElement("span", null, "x"), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(DimentionInput, {
    name: "height",
    value: size["height"] || "",
    onChange: handleChange,
    disable: disable
  }), /*#__PURE__*/React__default.createElement(CardText, {
    style: {
      textAlign: "center"
    },
    disable: disable
  }, t("CS_FILE_PROPERTY_HEIGHT"))));
};

var RadioOrSelect = function RadioOrSelect(_ref) {
  var options = _ref.options,
      onSelect = _ref.onSelect,
      optionKey = _ref.optionKey,
      selectedOption = _ref.selectedOption,
      isMandatory = _ref.isMandatory,
      t = _ref.t,
      _ref$dropdownStyle = _ref.dropdownStyle,
      dropdownStyle = _ref$dropdownStyle === void 0 ? {} : _ref$dropdownStyle,
      _ref$isDependent = _ref.isDependent,
      isDependent = _ref$isDependent === void 0 ? false : _ref$isDependent,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      optionCardStyles = _ref.optionCardStyles;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, (options === null || options === void 0 ? void 0 : options.length) < 5 ? /*#__PURE__*/React__default.createElement(RadioButtons, {
    selectedOption: selectedOption,
    options: options,
    optionsKey: optionKey,
    isDependent: isDependent,
    disabled: disabled,
    onSelect: onSelect,
    t: t
  }) : /*#__PURE__*/React__default.createElement(Dropdown, {
    isMandatory: isMandatory,
    selected: selectedOption,
    style: dropdownStyle,
    optionKey: optionKey,
    option: options,
    select: onSelect,
    t: t,
    disable: disabled,
    optionCardStyles: optionCardStyles
  }));
};

var RatingCard = function RatingCard(_ref) {
  var _config$inputs;

  var config = _ref.config,
      onSelect = _ref.onSelect,
      t = _ref.t;

  var _useForm = reactHookForm.useForm(),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit;

  var _useState = React.useState(""),
      comments = _useState[0],
      setComments = _useState[1];

  var _useState2 = React.useState(0),
      rating = _useState2[0],
      setRating = _useState2[1];

  var onSubmit = function onSubmit(data) {
    data.rating = rating;
    onSelect(data);
  };

  var feedback = function feedback(e, ref, index) {
    setRating(index);
  };

  var segments = (_config$inputs = config.inputs) === null || _config$inputs === void 0 ? void 0 : _config$inputs.map(function (input, index) {
    if (input.type === "rate") {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, /*#__PURE__*/React__default.createElement(CardLabel, null, t(input.label)), input === null || input === void 0 ? void 0 : input.error, /*#__PURE__*/React__default.createElement(Rating, {
        currentRating: rating,
        maxRating: input.maxRating,
        onFeedback: function onFeedback(e, ref, i) {
          return feedback(e, ref, i);
        }
      }));
    }

    if (input.type === "checkbox") {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, /*#__PURE__*/React__default.createElement(CardLabel, null, t(input.label)), input.checkLabels && input.checkLabels.map(function (label, index) {
        return /*#__PURE__*/React__default.createElement(CheckBox, {
          key: index,
          name: input.label,
          label: t(label),
          value: label,
          inputRef: register
        });
      }));
    }

    if (input.type === "radio") {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, /*#__PURE__*/React__default.createElement(CardLabel, null, t(input.label)), /*#__PURE__*/React__default.createElement(RadioButtons, {
        options: input.checkLabels,
        onSelect: input.onSelect,
        selectedOption: input.selectedOption,
        t: t
      }));
    }

    if (input.type === "textarea") {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
        key: index
      }, /*#__PURE__*/React__default.createElement(CardLabel, null, t(input.label)), /*#__PURE__*/React__default.createElement(TextArea, {
        name: input.name,
        value: comments,
        onChange: function onChange(e) {
          return setComments(e.target.value);
        },
        inputRef: register
      }));
    }
  });
  return /*#__PURE__*/React__default.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React__default.createElement(Card, null, /*#__PURE__*/React__default.createElement(CardHeader, null, t(config.texts.header)), segments, /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: t(config.texts.submitBarLabel),
    submit: true
  })));
};

RatingCard.propTypes = {
  config: propTypes.object,
  onSubmit: propTypes.func,
  t: propTypes.func
};
RatingCard.defaultProps = {
  config: {},
  onSubmit: undefined,
  t: function t(value) {
    return value;
  }
};

var RemoveableTag = function RemoveableTag(_ref) {
  var text = _ref.text,
      onClick = _ref.onClick;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "tag"
  }, /*#__PURE__*/React__default.createElement("span", {
    className: "text"
  }, text), /*#__PURE__*/React__default.createElement("span", {
    onClick: onClick
  }, /*#__PURE__*/React__default.createElement(Close, {
    className: "close"
  })));
};

var SearchAction = function SearchAction(_ref) {
  var text = _ref.text,
      handleActionClick = _ref.handleActionClick;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "searchAction",
    onClick: handleActionClick
  }, /*#__PURE__*/React__default.createElement(SearchIconSvg, null), " ", /*#__PURE__*/React__default.createElement("span", {
    className: "searchText"
  }, text));
};

var SearchField = function SearchField(_ref) {
  var children = _ref.children,
      className = _ref.className;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "form-field " + (className || "")
  }, children);
};
var SearchForm = function SearchForm(_ref2) {
  var children = _ref2.children,
      onSubmit = _ref2.onSubmit,
      handleSubmit = _ref2.handleSubmit;
  return /*#__PURE__*/React__default.createElement("form", {
    className: "search-form-wrapper",
    onSubmit: handleSubmit(onSubmit)
  }, children);
};

var TextInputCard = function TextInputCard(_ref) {
  var header = _ref.header,
      subHeader = _ref.subHeader,
      cardText = _ref.cardText,
      cardLabel = _ref.cardLabel,
      nextText = _ref.nextText,
      skipAndContinueText = _ref.skipAndContinueText,
      skip = _ref.skip,
      onSave = _ref.onSave,
      onSkip = _ref.onSkip,
      textInput = _ref.textInput;
  return /*#__PURE__*/React__default.createElement(Card, null, /*#__PURE__*/React__default.createElement(CardSubHeader, null, subHeader), /*#__PURE__*/React__default.createElement(CardHeader, null, header), /*#__PURE__*/React__default.createElement(CardText, null, cardText), /*#__PURE__*/React__default.createElement(CardLabel, null, cardLabel), /*#__PURE__*/React__default.createElement(TextInput, {
    onChange: textInput
  }), /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: nextText,
    onSubmit: onSave
  }), skip ? /*#__PURE__*/React__default.createElement(LinkButton, {
    label: skipAndContinueText,
    onClick: onSkip
  }) : null);
};

TextInputCard.propTypes = {
  header: propTypes.string,
  subHeader: propTypes.string,
  cardText: propTypes.string,
  cardLabel: propTypes.string,
  nextText: propTypes.string,
  skipAndContinueText: propTypes.string,
  skip: propTypes.bool,
  onSave: propTypes.func,
  onSkip: propTypes.func,
  textInput: propTypes.string
};
TextInputCard.defaultProps = {
  header: "",
  subHeader: "",
  cardText: "",
  cardLabel: "",
  nextText: "",
  skipAndContinueText: "",
  skip: true,
  onSave: undefined,
  onSkip: undefined,
  textInput: ""
};

var TypeSelectCard = function TypeSelectCard(_ref) {
  var t = _ref.t,
      headerCaption = _ref.headerCaption,
      header = _ref.header,
      cardText = _ref.cardText,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      submitBarLabel = _ref.submitBarLabel,
      selectedOption = _ref.selectedOption,
      menu = _ref.menu,
      optionsKey = _ref.optionsKey,
      selected = _ref.selected,
      onSave = _ref.onSave;
  return /*#__PURE__*/React__default.createElement(Card, null, /*#__PURE__*/React__default.createElement(CardCaption, null, t(headerCaption)), /*#__PURE__*/React__default.createElement(CardHeader, null, t(header)), /*#__PURE__*/React__default.createElement(CardText, null, t(cardText)), menu ? /*#__PURE__*/React__default.createElement(RadioButtons, {
    selectedOption: selectedOption,
    options: menu,
    optionsKey: optionsKey,
    onSelect: selected
  }) : null, /*#__PURE__*/React__default.createElement(SubmitBar, {
    disabled: disabled,
    label: t(submitBarLabel),
    onSubmit: onSave
  }));
};

TypeSelectCard.propTypes = {
  headerCaption: propTypes.string,
  header: propTypes.string,
  cardText: propTypes.string,
  submitBarLabel: propTypes.string,
  selectedOption: propTypes.any,
  menu: propTypes.any,
  optionsKey: propTypes.string,
  selected: propTypes.func,
  onSave: propTypes.func,
  t: propTypes.func
};
TypeSelectCard.defaultProps = {};

var PageBasedInput = function PageBasedInput(_ref) {
  var children = _ref.children,
      texts = _ref.texts,
      onSubmit = _ref.onSubmit;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "PageBasedInputWrapper"
  }, /*#__PURE__*/React__default.createElement(Card, null, children), /*#__PURE__*/React__default.createElement("div", {
    className: "SubmitBar"
  }, /*#__PURE__*/React__default.createElement(SubmitBar, {
    label: texts.submitBarLabel,
    onSubmit: onSubmit
  })));
};

exports.ActionBar = ActionBar;
exports.ActionLinks = ActionLinks;
exports.AnnouncementIcon = AnnouncementIcon;
exports.AppContainer = AppContainer;
exports.ApplyFilterBar = ApplyFilterBar;
exports.ArrowDown = ArrowDown;
exports.ArrowLeft = ArrowLeft;
exports.ArrowRightInbox = ArrowRightInbox;
exports.BPAHomeIcon = BPAHomeIcon;
exports.BPAIcon = BPAIcon;
exports.BackButton = BackButton$1;
exports.Banner = Banner;
exports.Body = Body;
exports.BreadCrumb = Breadcrumb;
exports.BreakLine = BreakLine;
exports.ButtonSelector = ButtonSelector;
exports.Calender = Calender;
exports.Card = Card;
exports.CardBasedOptions = CardBasedOptions;
exports.CardCaption = CardCaption;
exports.CardHeader = CardHeader;
exports.CardLabel = CardLabel;
exports.CardLabelDesc = CardLabelDesc;
exports.CardLabelError = CardLabelError;
exports.CardSectionHeader = CardSectionHeader;
exports.CardSubHeader = CardSubHeader;
exports.CardText = CardText;
exports.CardTextButton = CardText$1;
exports.CaseIcon = CaseIcon;
exports.CheckBox = CheckBox;
exports.CheckPoint = CheckPoint;
exports.CitizenHomeCard = CitizenHomeCard;
exports.CitizenInfoLabel = CitizenInfoLabel;
exports.CitizenTruck = CitizenTruck;
exports.CityMohalla = CityMohalla;
exports.CloseSvg = CloseSvg;
exports.ComplaintIcon = ComplaintIcon;
exports.ConnectingCheckPoints = ConnectingCheckPoints;
exports.CustomButton = CustomButton;
exports.DashboardBox = DashboardBox;
exports.DatePicker = DatePicker;
exports.DateWrap = DateWrap;
exports.Details = Details;
exports.DetailsCard = DetailsCard;
exports.DisplayPhotos = DisplayPhotos;
exports.DocumentIcon = DocumentIcon;
exports.DocumentSVG = DocumentSVG;
exports.DownloadIcon = DownloadIcon;
exports.DownwardArrow = DownwardArrow;
exports.DropIcon = DropIcon;
exports.Dropdown = Dropdown;
exports.EDCRIcon = EDCRIcon;
exports.Ellipsis = Ellipsis;
exports.EllipsisMenu = EllipsisMenu;
exports.EmailIcon = EmailIcon;
exports.EmployeeAppContainer = EmployeeAppContainer;
exports.EmployeeModuleCard = EmployeeModuleCard;
exports.FilterAction = FilterAction;
exports.FilterIcon = FilterIcon;
exports.FormComposer = FormComposer;
exports.FormStep = FormStep;
exports.GetApp = GetApp;
exports.GreyOutText = GreyOutText;
exports.Hamburger = Hamburger;
exports.Header = Header;
exports.HeaderBar = HeaderBar;
exports.HelpIcon = HelpIcon;
exports.HomeIcon = HomeIcon;
exports.HomeLink = HomeLink;
exports.ImageUploadHandler = ImageUploadHandler;
exports.ImageViewer = ImageViewer;
exports.InfoBanner = InfoBanner;
exports.InputCard = InputCard;
exports.KeyNote = KeyNote;
exports.Label = Label;
exports.LabelFieldPair = LabelFieldPair;
exports.LanguageIcon = LanguageIcon;
exports.LastRow = LastRow;
exports.LinkButton = LinkButton;
exports.LinkLabel = LinkLabel;
exports.Loader = Loader;
exports.Localities = Localities;
exports.LocationSearch = LocationSearch;
exports.LocationSearchCard = LocationSearchCard;
exports.LogoutIcon = LogoutIcon;
exports.MediaRow = MediaRow;
exports.Menu = Menu$1;
exports.MobileNumber = MobileNumber;
exports.Modal = Modal;
exports.MultiLink = MultiLink;
exports.MultiSelectDropdown = MultiSelectDropdown;
exports.NavBar = NavBar;
exports.OBPSIcon = OBPSIcon;
exports.OTPInput = OTPInput;
exports.PTIcon = PTIcon;
exports.PageBasedInput = PageBasedInput;
exports.Person = Person;
exports.PersonIcon = PersonIcon;
exports.PitDimension = PitDimension;
exports.Poll = Poll;
exports.PopUp = PopUp;
exports.PrintIcon = PrintIcon;
exports.PrivateRoute = PrivateRoute;
exports.PropertyHouse = PropertyHouse;
exports.RadioButtons = RadioButtons;
exports.RadioOrSelect = RadioOrSelect;
exports.Rating = Rating;
exports.RatingCard = RatingCard;
exports.ReceiptIcon = ReceiptIcon;
exports.RefreshIcon = RefreshIcon;
exports.RemoveableTag = RemoveableTag;
exports.ResponseComposer = ResponseComposer;
exports.RoundedLabel = RoundedLabel;
exports.Row = Row;
exports.RupeeIcon = RupeeIcon;
exports.SearchAction = SearchAction;
exports.SearchField = SearchField;
exports.SearchForm = SearchForm;
exports.SearchIconSvg = SearchIconSvg;
exports.SectionalDropdown = SectionalDropdown;
exports.ShareIcon = ShareIcon;
exports.ShippingTruck = ShippingTruck;
exports.SortDown = SortDown;
exports.SortUp = SortUp;
exports.StandaloneSearchBar = StandaloneSearchBar;
exports.StatusTable = StatusTable;
exports.SubmitBar = SubmitBar;
exports.Table = Table;
exports.TelePhone = TelePhone;
exports.TextArea = TextArea;
exports.TextInput = TextInput;
exports.TextInputCard = TextInputCard;
exports.Toast = Toast;
exports.TopBar = TopBar;
exports.TypeSelectCard = TypeSelectCard;
exports.UploadFile = UploadFile;
exports.UploadImages = UploadImages;
exports.UpwardArrow = UpwardArrow;
exports.WhatsNewCard = WhatsNewCard;
exports.WhatsappIcon = WhatsappIcon;
//# sourceMappingURL=index.js.map
