import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useRouteMatch, useParams, Link, Switch, Route, useLocation, Redirect } from 'react-router-dom';
import { DatePicker, SearchIconSvg, CardLabelError, Loader, StatusTable, Row, CardSectionHeader, RadioButtons, TextInput, Dropdown, Header, FormComposer, Toast, Card, Banner, CardText, ActionBar, SubmitBar, KeyNote, CardSubHeader, BackButton, CardLabelDesc, CardLabel, InfoBanner } from '@egovernments/digit-ui-react-components';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { subFormRegistry } from '@egovernments/digit-ui-libraries';
import { useForm, Controller } from 'react-hook-form';

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

var _iteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";
var _asyncIteratorSymbol = /*#__PURE__*/typeof Symbol !== "undefined" ? Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator")) : "@@asyncIterator";
function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

var useCashPaymentDetails = function useCashPaymentDetails(props, t) {
  var config = [{
    head: t("NOC_PAYMENT_RCPT_DETAILS"),
    headId: "paymentInfo",
    body: [{
      withoutLabel: true,
      type: "custom",
      populators: {
        name: "ManualRecieptDetails",
        customProps: {},
        defaultValue: {
          manualReceiptNumber: "",
          manualReceiptDate: ""
        },
        component: function component(props, customProps) {
          return /*#__PURE__*/React.createElement(CashDetailsComponent, _extends({}, customProps, {
            onChange: props.onChange,
            value: props.value
          }));
        }
      }
    }]
  }];
  return {
    cashConfig: config
  };
};

var CashDetailsComponent = function CashDetailsComponent(_ref) {
  var _props$value, _props$value2;

  var props = _extends({}, _ref);

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState(props === null || props === void 0 ? void 0 : (_props$value = props.value) === null || _props$value === void 0 ? void 0 : _props$value.manualReceiptDate),
      manualReceiptDate = _useState[0],
      setManualReceiptDate = _useState[1];

  var _useState2 = useState(props === null || props === void 0 ? void 0 : (_props$value2 = props.value) === null || _props$value2 === void 0 ? void 0 : _props$value2.manualReceiptNumber),
      manualReceiptNumber = _useState2[0],
      setManualReceiptNumber = _useState2[1];

  useEffect(function () {
    if (props.onChange) {
      var errorObj = {};
      if (!manualReceiptDate) errorObj.manualReceiptDate = "ES_COMMON_MANUAL_RECEIPT_DATE";
      if (!manualReceiptNumber) errorObj.manualReceiptNumber = "ES_COMMON_MANUAL_RECEIPT_NO";
      props.onChange({
        manualReceiptNumber: manualReceiptNumber,
        manualReceiptDate: manualReceiptDate,
        errorObj: errorObj
      });
    }
  }, [manualReceiptDate, manualReceiptNumber]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "label-field-pair"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "card-label"
  }, t("NOC_PAYMENT_RCPT_NO_LABEL")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-container"
  }, /*#__PURE__*/React.createElement("input", {
    className: "employee-card-input",
    value: manualReceiptNumber,
    type: "text",
    name: "instrumentNumber",
    onChange: function onChange(e) {
      return setManualReceiptNumber(e.target.value);
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "label-field-pair"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "card-label"
  }, t("NOC_PAYMENT_RECEIPT_ISSUE_DATE_LABEL"), " "), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-container"
  }, /*#__PURE__*/React.createElement(DatePicker, {
    date: manualReceiptDate,
    onChange: function onChange(d) {
      setManualReceiptDate(d);
    }
  })))));
};

var useCardPaymentDetails = function useCardPaymentDetails(props, t) {
  var config = [{
    head: t("PAYMENT_CARD_HEAD"),
    headId: "paymentInfo",
    body: [{
      withoutLabel: true,
      type: "custom",
      populators: {
        name: "paymentModeDetails",
        customProps: {},
        defaultValue: {},
        component: function component(props, customProps) {
          return /*#__PURE__*/React.createElement(CardDetailsComponent, _extends({
            onChange: props.onChange,
            value: props.value
          }, customProps));
        }
      }
    }]
  }];
  return {
    cardConfig: config
  };
};

var CardDetailsComponent = function CardDetailsComponent(_ref) {
  var _props$value, _props$value2, _props$value3;

  var props = _extends({}, _ref);

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState(props === null || props === void 0 ? void 0 : (_props$value = props.value) === null || _props$value === void 0 ? void 0 : _props$value.last4Digits),
      last4Digits = _useState[0],
      setLast4Digits = _useState[1];

  var _useState2 = useState(props === null || props === void 0 ? void 0 : (_props$value2 = props.value) === null || _props$value2 === void 0 ? void 0 : _props$value2.transactionNumber),
      transactionNumber = _useState2[0],
      setTransactionNumber = _useState2[1];

  var _useState3 = useState(props === null || props === void 0 ? void 0 : (_props$value3 = props.value) === null || _props$value3 === void 0 ? void 0 : _props$value3.reTransanctionNumber),
      reTransanctionNumber = _useState3[0],
      setReTransanctionNumber = _useState3[1];

  useEffect(function () {
    if (props.onChange) {
      var errorObj = {};
      if (!last4Digits) errorObj.last4Digits = "ES_COMMON_LAST_4_DIGITS";
      if (!transactionNumber) errorObj.transactionNumber = "ES_COMMON_TRANSANCTION_NO";
      if (!reTransanctionNumber) errorObj.reTransanctionNumber = "ES_COMMON_RE_TRANSANCTION_NO";
      props.onChange({
        transactionNumber: transactionNumber,
        reTransanctionNumber: reTransanctionNumber,
        instrumentNumber: last4Digits,
        errorObj: errorObj
      });
    }
  }, [last4Digits, transactionNumber, reTransanctionNumber]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "label-field-pair"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "card-label"
  }, t("NOC_PAYMENT_CARD_LAST_DIGITS_LABEL") + " *"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-container"
  }, /*#__PURE__*/React.createElement("input", {
    className: "employee-card-input",
    value: last4Digits,
    type: "text",
    name: "instrumentNumber",
    maxLength: "4",
    minLength: "4",
    required: true,
    onChange: function onChange(e) {
      return setLast4Digits(e.target.value);
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "label-field-pair"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "card-label"
  }, t("NOC_PAYMENT_TRANS_NO_LABEL") + " *"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-container"
  }, /*#__PURE__*/React.createElement("input", {
    className: "employee-card-input",
    value: transactionNumber,
    type: "text",
    name: "instrumentNumber",
    required: true,
    onChange: function onChange(e) {
      return setTransactionNumber(e.target.value);
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "label-field-pair"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "card-label"
  }, t("NOC_PAYMENT_RENTR_TRANS_LABEL") + " *"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-container"
  }, /*#__PURE__*/React.createElement("input", {
    className: "employee-card-input",
    value: reTransanctionNumber,
    type: "text",
    name: "instrumentNumber",
    required: true,
    onChange: function onChange(e) {
      return setReTransanctionNumber(e.target.value);
    }
  })))));
};

var useChequeDetails = function useChequeDetails(props, t) {
  var config = [{
    head: t("PAYMENT_CHEQUE_HEAD"),
    headId: "paymentInfo",
    body: [{
      withoutLabel: true,
      type: "custom",
      populators: {
        name: "paymentModeDetails",
        customProps: {},
        defaultValue: {
          instrumentNumber: "",
          instrumentDate: "",
          ifscCode: "",
          bankName: "",
          bankBranch: ""
        },
        component: function component(props, customProps) {
          return /*#__PURE__*/React.createElement(ChequeDetailsComponent, _extends({
            onChange: props.onChange,
            chequeDetails: props.value
          }, customProps));
        }
      }
    }]
  }];
  return {
    chequeConfig: config
  };
};
var ChequeDetailsComponent = function ChequeDetailsComponent(props) {
  var _props$chequeDetails$, _React$createElement, _React$createElement2;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState(props.chequeDetails.instrumentDate),
      instrumentDate = _useState[0],
      setChequeDate = _useState[1];

  var _useState2 = useState(props.chequeDetails.instrumentNumber),
      instrumentNumber = _useState2[0],
      setChequeNo = _useState2[1];

  var _useState3 = useState(props.chequeDetails.ifscCode),
      ifscCode = _useState3[0],
      setIfsc = _useState3[1];

  var _useState4 = useState(""),
      ifscCodeError = _useState4[0],
      setIfscCodeError = _useState4[1];

  var _useState5 = useState(props.chequeDetails.bankName),
      bankName = _useState5[0],
      setBankName = _useState5[1];

  var _useState6 = useState((_props$chequeDetails$ = props.chequeDetails.bankBranch) === null || _props$chequeDetails$ === void 0 ? void 0 : _props$chequeDetails$.replace("┬á", " ")),
      bankBranch = _useState6[0],
      setBankBranch = _useState6[1];

  useEffect(function () {
    if (props.onChange) {
      var errorObj = {};
      if (!instrumentDate) errorObj.instrumentDate = "ES_COMMON_INSTRUMENT_DATE";
      if (!instrumentNumber) errorObj.instrumentNumber = "ES_COMMON_INSTR_NUMBER";
      if (!ifscCode) errorObj.ifscCode = "ES_COMMON_IFSC";
      props.onChange({
        instrumentDate: instrumentDate,
        instrumentNumber: instrumentNumber,
        ifscCode: ifscCode,
        bankName: bankName,
        bankBranch: bankBranch,
        errorObj: errorObj,
        transactionNumber: instrumentNumber
      });
    }
  }, [bankName, bankBranch, instrumentDate, instrumentNumber]);

  var setBankDetailsFromIFSC = function setBankDetailsFromIFSC() {
    try {
      var _temp3 = _catch(function () {
        return Promise.resolve(window.fetch("https://ifsc.razorpay.com/" + ifscCode)).then(function (res) {
          var _temp = function () {
            if (res.ok) {
              return Promise.resolve(res.json()).then(function (_ref) {
                var BANK = _ref.BANK,
                    BRANCH = _ref.BRANCH;
                setBankName(BANK);
                setBankBranch(BRANCH === null || BRANCH === void 0 ? void 0 : BRANCH.replace("┬á", " "));
              });
            } else setIfscCodeError(t("CS_PAYMENT_INCORRECT_IFSC_CODE_ERROR"));
          }();

          if (_temp && _temp.then) return _temp.then(function () {});
        });
      }, function () {
        setIfscCodeError(t("CS_PAYMENT_INCORRECT_IFSC_CODE_ERROR"));
      });

      return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var handleIFSCChange = function handleIFSCChange(e) {
    setIfsc(e.target.value);
    setIfscCodeError("");
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "label-field-pair"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "card-label"
  }, t("PAYMENT_CHQ_NO_LABEL"), " *"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-container"
  }, /*#__PURE__*/React.createElement("input", {
    className: "employee-card-input",
    value: instrumentNumber,
    type: "text",
    name: "instrumentNumber",
    onChange: function onChange(e) {
      return setChequeNo(e.target.value);
    },
    required: true
  })))), /*#__PURE__*/React.createElement("div", {
    className: "label-field-pair"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "card-label"
  }, t("PAYMENT_CHEQUE_DATE_LABEL"), " *"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-container"
  }, /*#__PURE__*/React.createElement(DatePicker, {
    isRequired: true,
    date: instrumentDate,
    onChange: function onChange(d) {
      setChequeDate(d);
    }
  })))),
  /*#__PURE__*/
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "label-field-pair"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "card-label"
  }, t("PAYMENT_IFSC_CODE_LABEL"), " *"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cheque-date"
  }, /*#__PURE__*/React.createElement("input", {
    value: ifscCode,
    type: "text",
    onChange: handleIFSCChange,
    minlength: "11",
    maxlength: "11",
    required: true
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: setBankDetailsFromIFSC
  }, /*#__PURE__*/React.createElement(SearchIconSvg, null)))))), ifscCodeError && /*#__PURE__*/React.createElement(CardLabelError, {
    style: {
      width: "70%",
      marginLeft: "30%",
      fontSize: "12px",
      marginTop: "-21px"
    }
  }, ifscCodeError), /*#__PURE__*/React.createElement("div", {
    className: "label-field-pair"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "card-label"
  }, t("PAYMENT_BANK_NAME_LABEL")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-container"
  }, /*#__PURE__*/React.createElement("input", (_React$createElement = {
    className: "employee-card-input",
    value: bankName,
    type: "text"
  }, _React$createElement["className"] = "employee-card-input", _React$createElement.readOnly = true, _React$createElement.disabled = true, _React$createElement))))), /*#__PURE__*/React.createElement("div", {
    className: "label-field-pair"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "card-label"
  }, t("PAYMENT_BANK_BRANCH_LABEL")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-container"
  }, /*#__PURE__*/React.createElement("input", (_React$createElement2 = {
    className: "employee-card-input",
    value: bankBranch,
    type: "text"
  }, _React$createElement2["className"] = "employee-card-input", _React$createElement2.readOnly = true, _React$createElement2.disabled = true, _React$createElement2)))))));
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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal;

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
var root = _freeGlobal || freeSelf || Function('return this')();
var _root = root;

var Symbol$1 = _root.Symbol;
var _Symbol = Symbol$1;

var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
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
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

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
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

function hashGet(key) {
  var data = this.__data__;

  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }

  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

var objectProto$4 = Object.prototype;
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? data[key] !== undefined : hasOwnProperty$3.call(data, key);
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
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;
var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;
var isArguments = _baseIsArguments(function () {
  return arguments;
}()) ? _baseIsArguments : function (value) {
  return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') && !propertyIsEnumerable$1.call(value, 'callee');
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
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$5.call(value, key)) && !(skipIndexes && (key == 'length' || isBuff && (key == 'offset' || key == 'parent') || isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || _isIndex(key, length)))) {
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
var hasOwnProperty$6 = objectProto$9.hasOwnProperty;

function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }

  var result = [];

  for (var key in Object(object)) {
    if (hasOwnProperty$6.call(object, key) && key != 'constructor') {
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
var hasOwnProperty$7 = objectProto$a.hasOwnProperty;

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

    if (!(isPartial ? key in other : hasOwnProperty$7.call(other, key))) {
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
var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

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
    var objIsWrapped = objIsObj && hasOwnProperty$8.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$8.call(other, '__wrapped__');

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

var BillDetailsKeyNoteConfig = function BillDetailsKeyNoteConfig() {
  return {
    PT: {
      heading: "ES_BILL_DETAILS_PT_DETAILS_HEADING",
      details: [{
        keyValue: "PT_PROPERTY_ID",
        keyPath: ["consumerCode"],
        fallback: ""
      }, {
        keyValue: "CS_PAYMENT_BILLING_PERIOD",
        keyPath: ["billDetails", function (d) {
          var _d$ = d[0],
              fromPeriod = _d$.fromPeriod,
              toPeriod = _d$.toPeriod;

          if (fromPeriod && toPeriod) {
            var from = new Date(fromPeriod).getFullYear().toString();
            var to = new Date(toPeriod).getFullYear().toString();
            return "FY " + from + "-" + to;
          } else return "N/A";
        }],
        fallback: "N/A"
      }]
    },
    mcollect: {
      heading: "COMMON_PAY_SCREEN_HEADER",
      details: [{
        keyValue: "UC_CHALLAN_NO",
        keyPath: ["consumerCode"],
        fallback: ""
      }]
    },
    TL: {
      heading: "COMMON_PAY_SCREEN_HEADER",
      details: [{
        keyValue: "TL_TRADE_LICENSE_LABEL",
        keyPath: ["consumerCode"],
        fallback: ""
      }]
    }
  };
};

var BillDetailsFormConfig = function BillDetailsFormConfig(props, t) {
  return {
    PT: [{
      head: t("ES_BILL_DETAILS_PT_DETAILS_HEADING"),
      body: [{
        withoutLabel: true,
        type: "custom",
        populators: {
          name: "amount",
          customProps: {
            businessService: "PT",
            consumerCode: props.consumerCode
          },
          component: function component(props, customProps) {
            return /*#__PURE__*/React.createElement(BillDetails, _extends({
              onChange: props.onChange,
              amount: props.value
            }, customProps));
          }
        }
      }]
    }],
    mcollect: [{
      head: t("COMMON_PAY_SCREEN_HEADER"),
      body: [{
        withoutLabel: true,
        type: "custom",
        populators: {
          name: "amount",
          customProps: {
            businessService: props.businessService,
            consumerCode: props.consumerCode
          },
          component: function component(props, customProps) {
            return /*#__PURE__*/React.createElement(BillDetails, _extends({
              onChange: props.onChange,
              amount: props.value
            }, customProps));
          }
        }
      }]
    }],
    TL: [{
      body: [{
        withoutLabel: true,
        type: "custom",
        populators: {
          name: "amount",
          customProps: {
            businessService: "TL",
            consumerCode: props.consumerCode
          },
          component: function component(props, customProps) {
            return /*#__PURE__*/React.createElement(BillDetails, _extends({
              onChange: props.onChange,
              amount: props.value
            }, customProps));
          }
        }
      }]
    }]
  };
};

var BillDetails = function BillDetails(_ref) {
  var _bill$billDetails, _bill$billDetails2, _bill$billDetails2$so, _billDetails$billAcco, _arrears$toFixed, _arrears$toFixed2, _yearWiseBills$filter, _yearWiseBills$filter2, _yearWiseBills$filter3, _yearWiseBills$filter4, _yearWiseBills$filter5, _yearWiseBills$filter6, _yearWiseBills$filter7;

  var businessService = _ref.businessService,
      consumerCode = _ref.consumerCode,
      onChange = _ref.onChange;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
      ModuleWorkflow = _Digit$Hooks$useQuery.workflow;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$Hooks$useFetch = Digit.Hooks.useFetchPayment({
    tenantId: tenantId,
    businessService: businessService,
    consumerCode: consumerCode
  }),
      data = _Digit$Hooks$useFetch.data,
      isLoading = _Digit$Hooks$useFetch.isLoading;

  var _useState = useState(),
      bill = _useState[0],
      setBill = _useState[1];

  var _useState2 = useState(true),
      showDetails = _useState2[0],
      setShowDetails = _useState2[1];

  var yearWiseBills = bill === null || bill === void 0 ? void 0 : (_bill$billDetails = bill.billDetails) === null || _bill$billDetails === void 0 ? void 0 : _bill$billDetails.sort(function (a, b) {
    return b.fromPeriod - a.fromPeriod;
  });
  var billDetails = (yearWiseBills === null || yearWiseBills === void 0 ? void 0 : yearWiseBills[0]) || [];

  var getTotal = function getTotal() {
    return bill !== null && bill !== void 0 && bill.totalAmount ? bill === null || bill === void 0 ? void 0 : bill.totalAmount : 0;
  };

  var arrears = (bill === null || bill === void 0 ? void 0 : (_bill$billDetails2 = bill.billDetails) === null || _bill$billDetails2 === void 0 ? void 0 : (_bill$billDetails2$so = _bill$billDetails2.sort(function (a, b) {
    return b.fromPeriod - a.fromPeriod;
  })) === null || _bill$billDetails2$so === void 0 ? void 0 : _bill$billDetails2$so.reduce(function (total, current, index) {
    return index === 0 ? total : total + current.amount;
  }, 0)) || 0;

  var _Digit$Hooks$useGetPa = Digit.Hooks.useGetPaymentRulesForBusinessServices(tenantId),
      mdmsLoading = _Digit$Hooks$useGetPa.isLoading,
      mdmsBillingData = _Digit$Hooks$useGetPa.data;

  var _useState3 = useState(),
      paymentRules = _useState3[0],
      setPaymentRules = _useState3[1];

  useEffect(function () {
    var _mdmsBillingData$Mdms, _mdmsBillingData$Mdms2;

    var payRestrictiondetails = mdmsBillingData === null || mdmsBillingData === void 0 ? void 0 : (_mdmsBillingData$Mdms = mdmsBillingData.MdmsRes) === null || _mdmsBillingData$Mdms === void 0 ? void 0 : (_mdmsBillingData$Mdms2 = _mdmsBillingData$Mdms.BillingService) === null || _mdmsBillingData$Mdms2 === void 0 ? void 0 : _mdmsBillingData$Mdms2.BusinessService;
    if (payRestrictiondetails !== null && payRestrictiondetails !== void 0 && payRestrictiondetails.length) setPaymentRules(payRestrictiondetails.filter(function (e) {
      return e.code == businessService;
    })[0]);else setPaymentRules({});
  }, [mdmsBillingData]);

  var _ref2 = paymentRules || {},
      minAmountPayable = _ref2.minAmountPayable,
      isAdvanceAllowed = _ref2.isAdvanceAllowed;

  var _useState4 = useState(t("CS_PAYMENT_FULL_AMOUNT")),
      paymentType = _useState4[0],
      setPaymentType = _useState4[1];

  var _useState5 = useState(getTotal()),
      amount = _useState5[0],
      setAmount = _useState5[1];

  var _useState6 = useState(true),
      paymentAllowed = _useState6[0],
      setPaymentAllowed = _useState6[1];

  var _useState7 = useState(""),
      formError = _useState7[0],
      setError = _useState7[1];

  var changeAmount = function changeAmount(value) {
    setAmount(value);
  };

  useEffect(function () {
    ModuleWorkflow === "mcollect" && (billDetails === null || billDetails === void 0 ? void 0 : billDetails.billAccountDetails) && (billDetails === null || billDetails === void 0 ? void 0 : billDetails.billAccountDetails.map(function (ob) {
      if (ob.taxHeadCode.includes("CGST")) ob.order = 3;else if (ob.taxHeadCode.includes("SGST")) ob.order = 4;
    }));
  }, [billDetails === null || billDetails === void 0 ? void 0 : billDetails.billAccountDetails]);
  useEffect(function () {
    var allowPayment = minAmountPayable && amount >= minAmountPayable && !isAdvanceAllowed && amount <= getTotal() && !formError;
    if (paymentType != t("CS_PAYMENT_FULL_AMOUNT")) setPaymentAllowed(allowPayment);else setPaymentAllowed(true);
  }, [paymentType, amount]);
  useEffect(function () {
    if (!bill && data) {
      var requiredBill = data.Bill.filter(function (e) {
        return e.consumerCode == consumerCode;
      })[0];
      setBill(requiredBill);
    }
  }, [data]);
  useEffect(function () {
    if (paymentType !== t("CS_PAYMENT_FULL_AMOUNT")) onChangeAmount(amount.toString());else {
      setError("");
      changeAmount(getTotal());
    }
  }, [paymentType, bill]);
  useEffect(function () {
    if (paymentType !== t("CS_PAYMENT_FULL_AMOUNT")) onChange({
      amount: amount,
      paymentAllowed: paymentAllowed,
      error: formError,
      minAmountPayable: minAmountPayable
    });else onChange({
      amount: getTotal(),
      paymentAllowed: true,
      error: formError,
      minAmountPayable: minAmountPayable
    });
  }, [paymentAllowed, formError, amount, paymentType]);

  var onChangeAmount = function onChangeAmount(value) {
    setError("");

    if (isNaN(value) || value.includes(".")) {
      setError("AMOUNT_INVALID");
    } else if (!isAdvanceAllowed && value > getTotal()) {
      setError("CS_ADVANCED_PAYMENT_NOT_ALLOWED");
    } else if (value < minAmountPayable) {
      setError("CS_CANT_PAY_BELOW_MIN_AMOUNT");
    }

    changeAmount(value);
  };

  if (isLoading || mdmsLoading) return /*#__PURE__*/React.createElement(Loader, null);

  var getFinancialYear = function getFinancialYear(_bill) {
    var fromPeriod = _bill.fromPeriod,
        toPeriod = _bill.toPeriod;
    var from = new Date(fromPeriod).getFullYear().toString();
    var to = new Date(toPeriod).getFullYear().toString();
    return from + "-" + to;
  };

  var thStyle = {
    textAlign: "left",
    borderBottom: "#D6D5D4 1px solid",
    padding: "16px 12px",
    whiteSpace: "break-spaces"
  };
  var tdStyle = {
    textAlign: "left",
    borderBottom: "#D6D5D4 1px solid",
    padding: "8px 10px",
    breakWord: "no-break"
  };
  var config = BillDetailsKeyNoteConfig()[ModuleWorkflow ? ModuleWorkflow : businessService];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(StatusTable, null, bill && config.details.map(function (obj, index) {
    var value = obj.keyPath.reduce(function (acc, key) {
      if (typeof key === "function") acc = key(acc);else acc = acc[key];
      return acc;
    }, bill);
    return /*#__PURE__*/React.createElement(Row, {
      key: index + "bill",
      label: t(obj.keyValue),
      text: value
    });
  })), /*#__PURE__*/React.createElement(StatusTable, {
    style: {
      paddingTop: "46px"
    }
  }, /*#__PURE__*/React.createElement(Row, {
    label: t("ES_PAYMENT_TAXHEADS"),
    textStyle: {
      fontWeight: "bold"
    },
    text: t("ES_PAYMENT_AMOUNT")
  }), /*#__PURE__*/React.createElement("hr", {
    style: {
      width: "40%"
    },
    className: "underline"
  }), billDetails === null || billDetails === void 0 ? void 0 : (_billDetails$billAcco = billDetails.billAccountDetails) === null || _billDetails$billAcco === void 0 ? void 0 : _billDetails$billAcco.sort(function (a, b) {
    return a.order - b.order;
  }).map(function (amountDetails, index) {
    var _amountDetails$amount;

    return /*#__PURE__*/React.createElement(Row, {
      key: index + "taxheads",
      labelStyle: {
        fontWeight: "normal"
      },
      textStyle: {
        textAlign: "right",
        maxWidth: "100px"
      },
      label: t(amountDetails.taxHeadCode),
      text: "₹ " + ((_amountDetails$amount = amountDetails.amount) === null || _amountDetails$amount === void 0 ? void 0 : _amountDetails$amount.toFixed(2))
    });
  }), arrears !== null && arrears !== void 0 && (_arrears$toFixed = arrears.toFixed) !== null && _arrears$toFixed !== void 0 && _arrears$toFixed.call(arrears, 2) ? /*#__PURE__*/React.createElement(Row, {
    labelStyle: {
      fontWeight: "normal"
    },
    textStyle: {
      textAlign: "right",
      maxWidth: "100px"
    },
    label: t("COMMON_ARREARS"),
    text: "₹ " + (arrears === null || arrears === void 0 ? void 0 : (_arrears$toFixed2 = arrears.toFixed) === null || _arrears$toFixed2 === void 0 ? void 0 : _arrears$toFixed2.call(arrears, 2)) || Number(0).toFixed(2)
  }) : null, /*#__PURE__*/React.createElement("hr", {
    style: {
      width: "40%"
    },
    className: "underline"
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CS_PAYMENT_TOTAL_AMOUNT"),
    textStyle: {
      fontWeight: "bold",
      textAlign: "right",
      maxWidth: "100px"
    },
    text: "₹ " + getTotal()
  }), !showDetails && !ModuleWorkflow && businessService !== "TL" && (yearWiseBills === null || yearWiseBills === void 0 ? void 0 : yearWiseBills.length) > 1 && /*#__PURE__*/React.createElement("div", {
    className: "row last"
  }, /*#__PURE__*/React.createElement("h2", null), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      maxWidth: "100px"
    },
    onClick: function onClick() {
      return setShowDetails(true);
    },
    className: "filter-button value"
  }, t("ES_COMMON_VIEW_DETAILS")))), showDetails && (yearWiseBills === null || yearWiseBills === void 0 ? void 0 : yearWiseBills.length) > 1 && !ModuleWorkflow && businessService !== "TL" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "95%",
      display: "inline-block",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      padding: "10px",
      paddingLeft: "unset",
      maxWidth: "95%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: "#EEEEEE",
      boxShadow: "2px 0px 3px 2px #D6D5D4",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: thStyle
  }, t("FINANCIAL_YEAR")))), /*#__PURE__*/React.createElement("tbody", null, yearWiseBills === null || yearWiseBills === void 0 ? void 0 : (_yearWiseBills$filter = yearWiseBills.filter(function (e, ind) {
    return ind > 0;
  })) === null || _yearWiseBills$filter === void 0 ? void 0 : _yearWiseBills$filter.map(function (year_bill, index) {
    return /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", {
      style: tdStyle
    }, getFinancialYear(year_bill)));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: "#EEEEEE",
      overflowX: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, yearWiseBills === null || yearWiseBills === void 0 ? void 0 : (_yearWiseBills$filter2 = yearWiseBills.filter(function (e, ind) {
    return ind > 0;
  })) === null || _yearWiseBills$filter2 === void 0 ? void 0 : (_yearWiseBills$filter3 = _yearWiseBills$filter2[0]) === null || _yearWiseBills$filter3 === void 0 ? void 0 : (_yearWiseBills$filter4 = _yearWiseBills$filter3.billAccountDetails) === null || _yearWiseBills$filter4 === void 0 ? void 0 : (_yearWiseBills$filter5 = _yearWiseBills$filter4.sort(function (a, b) {
    return a.order - b.order;
  })) === null || _yearWiseBills$filter5 === void 0 ? void 0 : _yearWiseBills$filter5.map(function (head, index) {
    return /*#__PURE__*/React.createElement("th", {
      style: _extends({}, thStyle),
      key: index
    }, t(head.taxHeadCode));
  }))), /*#__PURE__*/React.createElement("tbody", null, yearWiseBills === null || yearWiseBills === void 0 ? void 0 : (_yearWiseBills$filter6 = yearWiseBills.filter(function (e, ind) {
    return ind > 0;
  })) === null || _yearWiseBills$filter6 === void 0 ? void 0 : _yearWiseBills$filter6.map(function (year_bill, index) {
    var _year_bill$billAccoun;

    var sorted_tax_heads = year_bill === null || year_bill === void 0 ? void 0 : (_year_bill$billAccoun = year_bill.billAccountDetails) === null || _year_bill$billAccoun === void 0 ? void 0 : _year_bill$billAccoun.sort(function (a, b) {
      return a.order - b.order;
    });
    return /*#__PURE__*/React.createElement("tr", {
      key: index
    }, sorted_tax_heads.map(function (e, i) {
      return /*#__PURE__*/React.createElement("td", {
        style: tdStyle,
        key: i
      }, e.amount);
    }));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      backgroundColor: "#EEEEEE",
      boxShadow: "-2px 0px 3px 2px #D6D5D4",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: thStyle
  }, t("TOTAL_TAX")))), /*#__PURE__*/React.createElement("tbody", null, yearWiseBills === null || yearWiseBills === void 0 ? void 0 : (_yearWiseBills$filter7 = yearWiseBills.filter(function (e, ind) {
    return ind > 0;
  })) === null || _yearWiseBills$filter7 === void 0 ? void 0 : _yearWiseBills$filter7.map(function (year_bill, index) {
    return /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", {
      style: tdStyle
    }, year_bill.amount));
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      float: "right"
    },
    onClick: function onClick() {
      return setShowDetails(false);
    },
    className: "filter-button"
  }, t("ES_COMMON_HIDE_DETAILS"))), " "), (paymentRules === null || paymentRules === void 0 ? void 0 : paymentRules.partPaymentAllowed) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "50px"
    },
    className: "bill-payment-amount"
  }, /*#__PURE__*/React.createElement(CardSectionHeader, null, t("CS_COMMON_PAYMENT_AMOUNT")), /*#__PURE__*/React.createElement(RadioButtons, {
    style: {
      display: "flex"
    },
    innerStyles: {
      padding: "5px"
    },
    selectedOption: paymentType,
    onSelect: setPaymentType,
    options: paymentRules.partPaymentAllowed ? [t("CS_PAYMENT_FULL_AMOUNT"), t("CS_PAYMENT_CUSTOM_AMOUNT")] : [t("CS_PAYMENT_FULL_AMOUNT")]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "payment-amount-front",
    style: {
      border: "1px solid " + (paymentType === t("CS_PAYMENT_FULL_AMOUNT") ? "#9a9a9a" : "black")
    }
  }, "\u20B9"), paymentType !== t("CS_PAYMENT_FULL_AMOUNT") ? /*#__PURE__*/React.createElement(TextInput, {
    style: {
      width: "30%"
    },
    className: "text-indent-xl",
    onChange: function onChange(e) {
      return onChangeAmount(e.target.value);
    },
    value: amount,
    disable: getTotal() === 0
  }) : /*#__PURE__*/React.createElement(TextInput, {
    style: {
      width: "30%"
    },
    className: "text-indent-xl",
    value: getTotal(),
    disable: true
  }), formError === "CS_CANT_PAY_BELOW_MIN_AMOUNT" ? /*#__PURE__*/React.createElement("span", {
    className: "card-label-error"
  }, t(formError), ": ", "₹" + minAmountPayable) : /*#__PURE__*/React.createElement("span", {
    className: "card-label-error"
  }, t(formError)))));
};

var CollectPayment = function CollectPayment(props) {
  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
      ModuleWorkflow = _Digit$Hooks$useQuery.workflow;

  console.log(ModuleWorkflow);

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var history = useHistory();
  var queryClient = useQueryClient();

  var _useRouteMatch = useRouteMatch();

  var _useParams = useParams(),
      consumerCode = _useParams.consumerCode,
      businessService = _useParams.businessService;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$Hooks$useFetch = Digit.Hooks.useFetchPayment({
    tenantId: tenantId,
    consumerCode: consumerCode,
    businessService: businessService
  }),
      paymentdetails = _Digit$Hooks$useFetch.data,
      isLoading = _Digit$Hooks$useFetch.isLoading;

  var bill = paymentdetails !== null && paymentdetails !== void 0 && paymentdetails.Bill ? paymentdetails === null || paymentdetails === void 0 ? void 0 : paymentdetails.Bill[0] : {};

  var _useCardPaymentDetail = useCardPaymentDetails(props, t),
      cardConfig = _useCardPaymentDetail.cardConfig;

  var _useChequeDetails = useChequeDetails(props, t),
      chequeConfig = _useChequeDetails.chequeConfig;

  var _useCashPaymentDetail = useCashPaymentDetails(props, t),
      cashConfig = _useCashPaymentDetail.cashConfig;

  var _useState = useState({}),
      formState = _useState[0],
      setFormState = _useState[1];

  var _useState2 = useState(null),
      toast = _useState2[0],
      setToast = _useState2[1];

  var defaultPaymentModes = [{
    code: "CASH",
    label: t("COMMON_MASTERS_PAYMENTMODE_CASH")
  }, {
    code: "CHEQUE",
    label: t("COMMON_MASTERS_PAYMENTMODE_CHEQUE")
  }, {
    code: "CARD",
    label: t("COMMON_MASTERS_PAYMENTMODE_CREDIT/DEBIT CARD")
  }];
  var formConfigMap = {
    CHEQUE: chequeConfig,
    CARD: cardConfig
  };
  useEffect(function () {
    props.setLink(t("PAYMENT_COLLECT_LABEL"));
  }, []);

  var getPaymentModes = function getPaymentModes() {
    return defaultPaymentModes;
  };

  var paidByMenu = [{
    code: "OWNER",
    name: t("COMMON_OWNER")
  }, {
    code: "OTHER",
    name: t("COMMON_OTHER")
  }];

  var _useState3 = useState((formState === null || formState === void 0 ? void 0 : formState.selectedPaymentMode) || getPaymentModes()[0]),
      selectedPaymentMode = _useState3[0],
      setPaymentMode = _useState3[1];

  var onSubmit = function onSubmit(data) {
    try {
      var _data$amount, _data$amount6, _data$amount7, _data$paymentMode, _data$paymentModeDeta, _recieptRequest$Payme2, _recieptRequest$Payme3, _recieptRequest$Payme4, _recieptRequest$Payme5, _recieptRequest$Payme6;

      bill.totalAmount = Math.round(bill.totalAmount);
      data.paidBy = data.paidBy.code;

      if (BillDetailsFormConfig({
        consumerCode: consumerCode,
        businessService: businessService
      }, t)[ModuleWorkflow ? ModuleWorkflow : businessService] && !(data !== null && data !== void 0 && (_data$amount = data.amount) !== null && _data$amount !== void 0 && _data$amount.paymentAllowed)) {
        var _data$amount2, _data$amount3, _data$amount4, _data$amount5;

        var action = (data === null || data === void 0 ? void 0 : (_data$amount2 = data.amount) === null || _data$amount2 === void 0 ? void 0 : _data$amount2.error) === "CS_CANT_PAY_BELOW_MIN_AMOUNT" ? t(data === null || data === void 0 ? void 0 : (_data$amount3 = data.amount) === null || _data$amount3 === void 0 ? void 0 : _data$amount3.error) + "- " + (data === null || data === void 0 ? void 0 : (_data$amount4 = data.amount) === null || _data$amount4 === void 0 ? void 0 : _data$amount4.minAmountPayable) : t(data === null || data === void 0 ? void 0 : (_data$amount5 = data.amount) === null || _data$amount5 === void 0 ? void 0 : _data$amount5.error);
        setToast({
          key: "error",
          action: action
        });
        return Promise.resolve();
      }

      var ManualRecieptDetails = data.ManualRecieptDetails,
          paymentModeDetails = data.paymentModeDetails,
          rest = _objectWithoutPropertiesLoose(data, ["ManualRecieptDetails", "paymentModeDetails"]);

      var _ref = paymentModeDetails || {},
          errorObj = _ref.errorObj,
          details = _objectWithoutPropertiesLoose(_ref, ["errorObj"]);

      var recieptRequest = {
        Payment: {
          mobileNumber: data.payerMobile,
          paymentDetails: [{
            businessService: businessService,
            billId: bill.id,
            totalDue: bill.totalAmount,
            totalAmountPaid: (data === null || data === void 0 ? void 0 : (_data$amount6 = data.amount) === null || _data$amount6 === void 0 ? void 0 : _data$amount6.amount) || bill.totalAmount
          }],
          tenantId: bill.tenantId,
          totalDue: bill.totalAmount,
          totalAmountPaid: (data === null || data === void 0 ? void 0 : (_data$amount7 = data.amount) === null || _data$amount7 === void 0 ? void 0 : _data$amount7.amount) || bill.totalAmount,
          paymentMode: data.paymentMode.code,
          payerName: data.payerName,
          paidBy: data.paidBy
        }
      };

      if (data.ManualRecieptDetails.manualReceiptDate) {
        recieptRequest.Payment.paymentDetails[0].manualReceiptDate = new Date(ManualRecieptDetails.manualReceiptDate).getTime();
      }

      if (data.ManualRecieptDetails.manualReceiptNumber) {
        recieptRequest.Payment.paymentDetails[0].manualReceiptNumber = ManualRecieptDetails.manualReceiptNumber;
      }

      recieptRequest.Payment.paymentMode = data === null || data === void 0 ? void 0 : (_data$paymentMode = data.paymentMode) === null || _data$paymentMode === void 0 ? void 0 : _data$paymentMode.code;

      if (data.paymentModeDetails) {
        var _recieptRequest$Payme;

        recieptRequest.Payment = _extends({}, recieptRequest.Payment, details);
        delete recieptRequest.Payment.paymentModeDetails;

        if (data.paymentModeDetails.errorObj) {
          var errors = data.paymentModeDetails.errorObj;
          var messages = Object.keys(errors).map(function (e) {
            return t(errors[e]);
          }).join();

          if (messages) {
            setToast({
              key: "error",
              action: messages + " " + t("ES_ERROR_REQUIRED")
            });
            setTimeout(function () {
              return setToast(null);
            }, 5000);
            return Promise.resolve();
          }
        }

        if (data.errorMsg) setToast({
          key: "error",
          action: t(errorMsg)
        });
        recieptRequest.Payment.instrumentDate = new Date(recieptRequest === null || recieptRequest === void 0 ? void 0 : (_recieptRequest$Payme = recieptRequest.Payment) === null || _recieptRequest$Payme === void 0 ? void 0 : _recieptRequest$Payme.instrumentDate).getTime();
        recieptRequest.Payment.transactionNumber = data.paymentModeDetails.transactionNumber;
      }

      if (data !== null && data !== void 0 && (_data$paymentModeDeta = data.paymentModeDetails) !== null && _data$paymentModeDeta !== void 0 && _data$paymentModeDeta.transactionNumber) {
        if (data.paymentModeDetails.transactionNumber !== data.paymentModeDetails.reTransanctionNumber && ["CARD"].includes(data.paymentMode.code)) {
          setToast({
            key: "error",
            action: t("ERR_TRASACTION_NUMBERS_DONT_MATCH")
          });
          setTimeout(function () {
            return setToast(null);
          }, 5000);
          return Promise.resolve();
        }

        delete recieptRequest.Payment.last4Digits;
        delete recieptRequest.Payment.reTransanctionNumber;
      }

      if ((_recieptRequest$Payme2 = recieptRequest.Payment) !== null && _recieptRequest$Payme2 !== void 0 && (_recieptRequest$Payme3 = _recieptRequest$Payme2.instrumentNumber) !== null && _recieptRequest$Payme3 !== void 0 && _recieptRequest$Payme3.length && ((_recieptRequest$Payme4 = recieptRequest.Payment) === null || _recieptRequest$Payme4 === void 0 ? void 0 : (_recieptRequest$Payme5 = _recieptRequest$Payme4.instrumentNumber) === null || _recieptRequest$Payme5 === void 0 ? void 0 : _recieptRequest$Payme5.length) < 6 && (recieptRequest === null || recieptRequest === void 0 ? void 0 : (_recieptRequest$Payme6 = recieptRequest.Payment) === null || _recieptRequest$Payme6 === void 0 ? void 0 : _recieptRequest$Payme6.paymentMode) === "CHEQUE") {
        setToast({
          key: "error",
          action: t("ERR_CHEQUE_NUMBER_LESS_THAN_6")
        });
        setTimeout(function () {
          return setToast(null);
        }, 5000);
        return Promise.resolve();
      }

      var _temp2 = _catch(function () {
        return Promise.resolve(Digit.PaymentService.createReciept(tenantId, recieptRequest)).then(function (resposne) {
          var _resposne$Payments$, _resposne$Payments$$p, _resposne$Payments$2, _resposne$Payments$2$, _resposne$Payments$2$2;

          queryClient.invalidateQueries();
          history.push(props.basePath + "/success/" + businessService + "/" + (resposne === null || resposne === void 0 ? void 0 : (_resposne$Payments$ = resposne.Payments[0]) === null || _resposne$Payments$ === void 0 ? void 0 : (_resposne$Payments$$p = _resposne$Payments$.paymentDetails[0]) === null || _resposne$Payments$$p === void 0 ? void 0 : _resposne$Payments$$p.receiptNumber.replace(/\//g, "%2F")) + "/" + (resposne === null || resposne === void 0 ? void 0 : (_resposne$Payments$2 = resposne.Payments[0]) === null || _resposne$Payments$2 === void 0 ? void 0 : (_resposne$Payments$2$ = _resposne$Payments$2.paymentDetails[0]) === null || _resposne$Payments$2$ === void 0 ? void 0 : (_resposne$Payments$2$2 = _resposne$Payments$2$.bill) === null || _resposne$Payments$2$2 === void 0 ? void 0 : _resposne$Payments$2$2.consumerCode));
        });
      }, function (error) {
        var _setToast, _error$response, _error$response$data, _error$response$data$;

        (_setToast = setToast({
          key: "error",
          action: error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : (_error$response$data = _error$response.data) === null || _error$response$data === void 0 ? void 0 : (_error$response$data$ = _error$response$data.Errors) === null || _error$response$data$ === void 0 ? void 0 : _error$response$data$.map(function (e) {
            return t(e.code);
          })
        })) === null || _setToast === void 0 ? void 0 : _setToast.join(" , ");
        setTimeout(function () {
          return setToast(null);
        }, 5000);
      });

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  useEffect(function () {
    var _document, _document$getElementB, _document2, _document2$querySelec;

    (_document = document) === null || _document === void 0 ? void 0 : (_document$getElementB = _document.getElementById("paymentInfo")) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.scrollIntoView({
      behavior: "smooth"
    });
    (_document2 = document) === null || _document2 === void 0 ? void 0 : (_document2$querySelec = _document2.querySelector("#paymentInfo + .label-field-pair input")) === null || _document2$querySelec === void 0 ? void 0 : _document2$querySelec.focus();
  }, [selectedPaymentMode]);
  var config = [{
    head: !ModuleWorkflow && businessService !== "TL" ? t("COMMON_PAYMENT_HEAD") : "",
    body: [{
      label: t("PAY_TOTAL_AMOUNT"),
      populators: /*#__PURE__*/React.createElement(CardSectionHeader, {
        style: {
          marginBottom: 0,
          textAlign: "right"
        }
      }, " ", "\u20B9 " + (bill === null || bill === void 0 ? void 0 : bill.totalAmount), " ")
    }]
  }, {
    head: t("PAYMENT_PAID_BY_HEAD"),
    body: [{
      label: t("PAYMENT_PAID_BY_LABEL"),
      isMandatory: true,
      type: "custom",
      populators: {
        name: "paidBy",
        customProps: {
          t: t,
          isMendatory: true,
          option: paidByMenu,
          optionKey: "name"
        },
        component: function component(props, customProps) {
          return /*#__PURE__*/React.createElement(Dropdown, _extends({}, customProps, {
            selected: props.value,
            select: function select(d) {
              if (d.name == paidByMenu[0].name) {
                props.setValue("payerName", bill === null || bill === void 0 ? void 0 : bill.payerName);
                props.setValue("payerMobile", bill === null || bill === void 0 ? void 0 : bill.mobileNumber);
              } else {
                props.setValue("payerName", "");
                props.setValue("payerMobile", "");
              }

              props.onChange(d);
            }
          }));
        },
        defaultValue: (formState === null || formState === void 0 ? void 0 : formState.paidBy) || paidByMenu[0]
      }
    }, {
      label: t("PAYMENT_PAYER_NAME_LABEL"),
      isMandatory: true,
      type: "text",
      populators: {
        name: "payerName",
        validation: {
          required: true,
          pattern: /^[A-Za-z]/
        },
        error: t("PAYMENT_INVALID_NAME"),
        defaultValue: (bill === null || bill === void 0 ? void 0 : bill.payerName) || (formState === null || formState === void 0 ? void 0 : formState.payerName) || "",
        className: "payment-form-text-input-correction"
      }
    }, {
      label: t("PAYMENT_PAYER_MOB_LABEL"),
      isMandatory: true,
      type: "text",
      populators: {
        name: "payerMobile",
        validation: {
          required: true,
          pattern: /^[6-9]\d{9}$/
        },
        error: t("PAYMENT_INVALID_MOBILE"),
        className: "payment-form-text-input-correction",
        defaultValue: (bill === null || bill === void 0 ? void 0 : bill.mobileNumber) || (formState === null || formState === void 0 ? void 0 : formState.payerMobile) || ""
      }
    }]
  }, {
    head: t("PAYMENT_MODE_HEAD"),
    body: [{
      withoutLabel: true,
      type: "custom",
      populators: {
        name: "paymentMode",
        customProps: {
          options: getPaymentModes(),
          optionsKey: "label",
          style: {
            display: "flex",
            flexWrap: "wrap"
          },
          innerStyles: {
            minWidth: "33%"
          }
        },
        defaultValue: (formState === null || formState === void 0 ? void 0 : formState.paymentMode) || getPaymentModes()[0],
        component: function component(props, customProps) {
          return /*#__PURE__*/React.createElement(RadioButtons, _extends({
            selectedOption: props.value,
            onSelect: function onSelect(d) {
              props.onChange(d);
            }
          }, customProps));
        }
      }
    }]
  }];

  var getDefaultValues = function getDefaultValues() {
    return {
      payerName: (bill === null || bill === void 0 ? void 0 : bill.payerName) || (formState === null || formState === void 0 ? void 0 : formState.payerName) || "",
      payerMobile: (bill === null || bill === void 0 ? void 0 : bill.mobileNumber) || (formState === null || formState === void 0 ? void 0 : formState.payerMobile) || ""
    };
  };

  var getFormConfig = function getFormConfig() {
    var _formState$paymentMod, _conf;

    if (BillDetailsFormConfig({
      consumerCode: consumerCode,
      businessService: businessService
    }, t)[ModuleWorkflow ? ModuleWorkflow : businessService] || ModuleWorkflow || businessService === "TL") {
      config.splice(0, 1);
    }

    var conf = config.concat(formConfigMap[formState === null || formState === void 0 ? void 0 : (_formState$paymentMod = formState.paymentMode) === null || _formState$paymentMod === void 0 ? void 0 : _formState$paymentMod.code] || []);
    conf = (_conf = conf) === null || _conf === void 0 ? void 0 : _conf.concat(cashConfig);
    return BillDetailsFormConfig({
      consumerCode: consumerCode,
      businessService: businessService
    }, t)[ModuleWorkflow ? ModuleWorkflow : businessService] ? BillDetailsFormConfig({
      consumerCode: consumerCode,
      businessService: businessService
    }, t)[ModuleWorkflow ? ModuleWorkflow : businessService].concat(conf) : conf;
  };

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, null, t("PAYMENT_COLLECT")), /*#__PURE__*/React.createElement(FormComposer, {
    cardStyle: {
      paddingBottom: "100px"
    },
    label: t("PAYMENT_COLLECT_LABEL"),
    config: getFormConfig(),
    onSubmit: onSubmit,
    formState: formState,
    defaultValues: getDefaultValues(),
    isDisabled: bill !== null && bill !== void 0 && bill.totalAmount ? !bill.totalAmount > 0 : true,
    onFormValueChange: function onFormValueChange(setValue, formValue) {
      if (!isEqual_1(formValue.paymentMode, selectedPaymentMode)) {
        setFormState(formValue);
        setPaymentMode(formState.paymentMode);
      }
    }
  }), toast && /*#__PURE__*/React.createElement(Toast, {
    error: toast.key === "error",
    label: t(toast.key === "success" ? "ES_" + businessService.split(".")[0].toLowerCase() + "_" + toast.action + "_UPDATE_SUCCESS" : toast.action),
    onClose: function onClose() {
      return setToast(null);
    },
    style: {
      maxWidth: "670px"
    }
  }));
};

var SuccessfulPayment = function SuccessfulPayment(props) {

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var queryClient = useQueryClient();
  props.setLink(t("PAYMENT_LOCALIZATION_RESPONSE"));

  var _useParams = useParams(),
      consumerCode = _useParams.consumerCode,
      receiptNumber = _useParams.receiptNumber,
      businessService = _useParams.businessService;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  receiptNumber = receiptNumber.replace(/%2F/g, "/");
  useEffect(function () {
    return function () {
      queryClient.clear();
    };
  }, []);

  var getMessage = function getMessage() {
    return t("ES_PAYMENT_COLLECTED");
  };

  var _Digit$Hooks$useCommo = Digit.Hooks.useCommonMDMS(tenantId, "common-masters", "ReceiptKey", {
    select: function select(data) {
      var _data$commonMasters, _data$commonMasters$u, _data$commonMasters$u2;

      return ((_data$commonMasters = data["common-masters"]) === null || _data$commonMasters === void 0 ? void 0 : (_data$commonMasters$u = _data$commonMasters.uiCommonPay) === null || _data$commonMasters$u === void 0 ? void 0 : (_data$commonMasters$u2 = _data$commonMasters$u.filter(function (_ref) {
        var code = _ref.code;
        return businessService === null || businessService === void 0 ? void 0 : businessService.includes(code);
      })[0]) === null || _data$commonMasters$u2 === void 0 ? void 0 : _data$commonMasters$u2.receiptKey) || "consolidatedreceipt";
    }
  }),
      generatePdfKey = _Digit$Hooks$useCommo.data;

  var printCertificate = function printCertificate() {
    try {
      var _tenantId = Digit.ULBService.getCurrentTenantId();

      var state = _tenantId === null || _tenantId === void 0 ? void 0 : _tenantId.split(".")[0];
      return Promise.resolve(Digit.TLService.search({
        applicationNumber: consumerCode,
        tenantId: _tenantId
      })).then(function (applicationDetails) {
        var generatePdfKeyForTL = "tlcertificate";

        var _temp = function () {
          if (applicationDetails) {
            return Promise.resolve(Digit.PaymentService.generatePdf(state, {
              Licenses: applicationDetails === null || applicationDetails === void 0 ? void 0 : applicationDetails.Licenses
            }, generatePdfKeyForTL)).then(function (response) {
              return Promise.resolve(Digit.PaymentService.printReciept(state, {
                fileStoreIds: response.filestoreIds[0]
              })).then(function (fileStore) {
                window.open(fileStore[response.filestoreIds[0]], "_blank");
              });
            });
          }
        }();

        if (_temp && _temp.then) return _temp.then(function () {});
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var printReciept = function printReciept() {
    try {
      var _tenantId2 = Digit.ULBService.getCurrentTenantId();

      var state = _tenantId2 === null || _tenantId2 === void 0 ? void 0 : _tenantId2.split(".")[0];
      return Promise.resolve(Digit.PaymentService.getReciept(_tenantId2, businessService, {
        receiptNumbers: receiptNumber
      })).then(function (payments) {
        var _payments$Payments$;

        function _temp3() {
          return Promise.resolve(Digit.PaymentService.printReciept(state, {
            fileStoreIds: response.filestoreIds[0]
          })).then(function (fileStore) {
            window.open(fileStore[response.filestoreIds[0]], "_blank");
          });
        }

        var response = {
          filestoreIds: [(_payments$Payments$ = payments.Payments[0]) === null || _payments$Payments$ === void 0 ? void 0 : _payments$Payments$.fileStoreId]
        };

        var _temp2 = function () {
          var _payments$Payments$2;

          if (!((_payments$Payments$2 = payments.Payments[0]) !== null && _payments$Payments$2 !== void 0 && _payments$Payments$2.fileStoreId)) {
            return Promise.resolve(Digit.PaymentService.generatePdf(state, {
              Payments: payments.Payments
            }, generatePdfKey)).then(function (_Digit$PaymentService) {
              response = _Digit$PaymentService;
            });
          }
        }();

        return _temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3(_temp2);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Banner, {
    message: getMessage(),
    info: t("PAYMENT_LOCALIZATION_RECIEPT_NO"),
    applicationNumber: receiptNumber,
    successful: true
  }), /*#__PURE__*/React.createElement(CardText, null, t("ES_PAYMENT_SUCCESSFUL_DESCRIPTION")), generatePdfKey ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "primary-label-btn d-grid",
    style: {
      marginLeft: "unset",
      marginRight: "20px"
    },
    onClick: printReciept
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"
  })), t("CS_COMMON_PRINT_RECEIPT")), businessService == "TL" ? /*#__PURE__*/React.createElement("div", {
    className: "primary-label-btn d-grid",
    style: {
      marginLeft: "unset"
    },
    onClick: printCertificate
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"
  })), t("CS_COMMON_PRINT_CERTIFICATE")) : null) : null), /*#__PURE__*/React.createElement(ActionBar, {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/employee"
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CORE_COMMON_GO_TO_HOME")
  }))));
};
var FailedPayment = function FailedPayment(props) {
  props.setLink("Response");

  var _useTranslation2 = useTranslation(),
      t = _useTranslation2.t;

  var _useParams2 = useParams(),
      consumerCode = _useParams2.consumerCode;

  var getMessage = function getMessage() {
    return t("ES_PAYMENT_COLLECTED_ERROR");
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Banner, {
    message: getMessage(),
    complaintNumber: consumerCode,
    successful: false
  }), /*#__PURE__*/React.createElement(CardText, null, t("ES_PAYMENT_FAILED_DETAILS"))), /*#__PURE__*/React.createElement(ActionBar, {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/employee"
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CORE_COMMON_GO_TO_HOME")
  }))));
};

var middleWare_1 = function middleWare_1(data, _break, _next) {
  try {
    data.a = "a";
    return Promise.resolve(_next(data));
  } catch (e) {
    return Promise.reject(e);
  }
};

var middleWare_2 = function middleWare_2(data, _break, _next) {
  try {
    data.b = "b";
    return Promise.resolve(_next(data));
  } catch (e) {
    return Promise.reject(e);
  }
};

var middleWare_3 = function middleWare_3(data, _break, _next) {
  try {
    var _temp5 = function _temp5() {
      return Promise.resolve(_next(data));
    };

    data.c = "c";

    var _temp6 = function () {
      if (data.b === "b") {
        var _temp7 = _catch(function () {
          return Promise.resolve(window.fetch("https://ifsc.razorpay.com/hdfc0000090")).then(function (res) {
            console.log(res.ok);

            var _temp = function () {
              if (res.ok) {
                return Promise.resolve(res.json()).then(function (_ref) {
                  var BANK = _ref.BANK,
                      BRANCH = _ref.BRANCH;
                  data.BANKFROMMiddleWare = BANK;
                });
              } else alert("Wrong IFSC Code");
            }();

            if (_temp && _temp.then) return _temp.then(function () {});
          });
        }, function (er) {
          console.log(er);
          alert("Something Went Wrong !");
        });

        if (_temp7 && _temp7.then) return _temp7.then(function () {});
      }
    }();

    return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(_temp5) : _temp5(_temp6));
  } catch (e) {
    return Promise.reject(e);
  }
};

var asyncData = {
  a: ["1", "2", "3"],
  b: ["4", "5", "6"],
  c: ["7", "8", "9"],
  j: ["10", "11", "12"],
  k: ["22", "45"],
  l: ["456"]
};
var testForm = {
  addedFields: [],
  middlewares: [{
    middleWare_1: middleWare_1
  }, {
    middleWare_2: middleWare_2
  }, {
    middleWare_3: middleWare_3
  }],
  state: {
    firstDDoptions: ["a", "b", "c"],
    secondDDoptions: asyncData.a,
    thirdDDoptions: ["d", "e", "f"]
  },
  fields: [{
    label: "first",
    name: "pehla",
    defaultValue: "b",
    customProps: function customProps(state) {
      return {
        isMendatory: true,
        option: state.firstDDoptions
      };
    },
    component: function component(props, customProps) {
      return /*#__PURE__*/React.createElement(Dropdown, _extends({
        select: function select(d) {
          props.setState({
            secondDDoptions: asyncData[d]
          });
          props.setValue("doosra", "");
          props.onChange(d);
        },
        selected: props.value
      }, customProps));
    },
    validations: {}
  }, {
    label: "second",
    name: "doosra",
    customProps: function customProps(state) {
      return {
        isMendatory: true,
        option: state.secondDDoptions
      };
    },
    defaultValue: function defaultValue(state) {
      return state.secondDDoptions[1];
    },
    component: function component(props, customProps) {
      return /*#__PURE__*/React.createElement(Dropdown, _extends({
        select: function select(d) {
          props.onChange(d);
        },
        selected: props.value
      }, customProps));
    }
  }, {
    label: "third",
    name: "teesra",
    customProps: function customProps(state) {
      return {
        isMendatory: true,
        option: state.thirdDDoptions
      };
    },
    defaultValue: "d",
    component: function component(props, customProps) {
      return /*#__PURE__*/React.createElement(Dropdown, _extends({
        select: function select(d) {
          props.onChange(d);
        },
        selected: props.value
      }, customProps));
    }
  }, {
    label: "IFSC",
    name: "ifsc",
    customProps: {
      isMendatory: true,
      setBankDetailsFromIFSC: function (props) {
        try {
          var _temp10 = _catch(function () {
            return Promise.resolve(window.fetch("https://ifsc.razorpay.com/" + props.getValues("ifsc"))).then(function (res) {
              console.log(res.ok);

              var _temp8 = function () {
                if (res.ok) {
                  return Promise.resolve(res.json()).then(function (_ref2) {
                    var BANK = _ref2.BANK,
                        BRANCH = _ref2.BRANCH;
                    props.setValue("bank", BANK);
                    props.setValue("branch", BRANCH);
                  });
                } else alert("Wrong IFSC Code");
              }();

              if (_temp8 && _temp8.then) return _temp8.then(function () {});
            });
          }, function (er) {
            console.log(er);
            alert("Something Went Wrong !");
          });

          return Promise.resolve(_temp10 && _temp10.then ? _temp10.then(function () {}) : void 0);
        } catch (e) {
          return Promise.reject(e);
        }
      }
    },
    defaultValue: "",
    component: function component(props, customProps) {
      return /*#__PURE__*/React.createElement("div", {
        className: "ifsc-field"
      }, /*#__PURE__*/React.createElement("input", {
        value: props.value,
        type: "text",
        onChange: function onChange(e) {
          props.setState({
            ifsc: e.target.value
          });
          props.onChange(e.target.value);
        }
      }), /*#__PURE__*/React.createElement("button", {
        type: "button",
        onClick: function onClick() {
          customProps.setBankDetailsFromIFSC(props);
        }
      }, /*#__PURE__*/React.createElement(SearchIconSvg, null)));
    }
  }, {
    label: "Bank",
    name: "bank",
    defaultValue: "d",
    component: function component(props, customProps) {
      return /*#__PURE__*/React.createElement("input", {
        readOnly: true,
        value: props.value
      });
    }
  }, {
    label: "Branch",
    name: "branch",
    defaultValue: "d",
    component: function component(props, customProps) {
      return /*#__PURE__*/React.createElement("input", {
        readOnly: true,
        value: props.value
      });
    }
  }]
};

subFormRegistry.addSubForm("testForm", testForm);

var EmployeePayment = function EmployeePayment(_ref) {
  var stateCode = _ref.stateCode,
      cityCode = _ref.cityCode,
      moduleCode = _ref.moduleCode;

  var _useRouteMatch = useRouteMatch(),
      currentPath = _useRouteMatch.path;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState(null),
      link = _useState[0],
      setLink = _useState[1];

  var commonProps = {
    stateCode: stateCode,
    cityCode: cityCode,
    moduleCode: moduleCode,
    setLink: setLink
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "breadcrumb"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/employee"
  }, t("ES_COMMON_HOME")), "/", link), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: currentPath + "/collect/:businessService/:consumerCode"
  }, /*#__PURE__*/React.createElement(CollectPayment, _extends({}, commonProps, {
    basePath: currentPath
  }))), /*#__PURE__*/React.createElement(Route, {
    path: currentPath + "/success/:businessService/:receiptNumber/:consumerCode"
  }, /*#__PURE__*/React.createElement(SuccessfulPayment, commonProps)), /*#__PURE__*/React.createElement(Route, {
    path: currentPath + "/failure"
  }, /*#__PURE__*/React.createElement(FailedPayment, commonProps))));
};

var MyBill = function MyBill(_ref) {
  var _bill$totalAmount;

  var bill = _ref.bill,
      currentPath = _ref.currentPath,
      businessService = _ref.businessService,
      getKeyNotesConfig = _ref.getKeyNotesConfig;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var history = useHistory();

  var onSubmit = function onSubmit() {
    history.push(currentPath + "/" + bill.consumerCode, {
      bill: bill
    });
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, typeof getKeyNotesConfig === "function" && /*#__PURE__*/React.createElement(Card, null, getKeyNotesConfig(businessService, t)["my-bill"].map(function (obj, index) {
    var value = obj.keyPath.reduce(function (acc, key) {
      if (typeof key === "function") acc = key(acc);else acc = acc[key];
      return acc;
    }, bill);
    return /*#__PURE__*/React.createElement(KeyNote, {
      key: index + obj.keyValue,
      keyValue: t(obj.keyValue),
      note: value || obj.fallback,
      noteStyle: obj.noteStyle || {}
    });
  }), /*#__PURE__*/React.createElement(SubmitBar, {
    disabled: !((_bill$totalAmount = bill.totalAmount) !== null && _bill$totalAmount !== void 0 && _bill$totalAmount.toFixed(2)),
    onSubmit: onSubmit,
    label: t("CS_MY_APPLICATION_VIEW_DETAILS")
  })));
};

var BillList = function BillList(_ref) {
  var billsList = _ref.billsList,
      currentPath = _ref.currentPath,
      businessService = _ref.businessService;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var history = useHistory();
  var consumerCodes = billsList.map(function (bill) {
    return bill.consumerCode;
  });
  var searchResult = Digit.Hooks.useApplicationsForBusinessServiceSearch({
    filters: {
      consumerCodes: consumerCodes.join()
    },
    businessService: businessService
  });
  var keyForConsumerCode = searchResult.key;

  var _useState = useState([]),
      applicationList = _useState[0],
      setApplicationList = _useState[1];

  var _useState2 = useState(function () {
    var _Digit$ComponentRegis;

    return (_Digit$ComponentRegis = Digit.ComponentRegistryService) === null || _Digit$ComponentRegis === void 0 ? void 0 : _Digit$ComponentRegis.getComponent("getBillDetailsConfigWithBusinessService");
  }),
      getKeyNotesConfig = _useState2[0];

  var billableApplicationsObj = useMemo(function () {
    return {};
  }, []);
  var billsListObj = useMemo(function () {
    return {};
  }, []);
  useEffect(function () {
    if (searchResult.data) searchResult.refetch();
  }, []);
  useEffect(function () {
    if (searchResult.data) {
      var billableApps = searchResult.data.filter(function (property) {
        return consumerCodes.includes(property[keyForConsumerCode]);
      });
      var billableIDs = billableApps.map(function (e) {
        return e[keyForConsumerCode];
      });
      billableApps.forEach(function (app) {
        billableApplicationsObj[app[keyForConsumerCode]] = app;
      });
      billsList.forEach(function (bill) {
        billsListObj[bill.consumerCode] = bill;
      });
      var newBillsList = billableIDs.map(function (e) {
        return _extends({}, billsListObj[e], billableApplicationsObj[e]);
      });
      setApplicationList(newBillsList);
    }
  }, [searchResult.data, getKeyNotesConfig]);

  if (searchResult.isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "static"
  }, /*#__PURE__*/React.createElement("div", {
    className: "static-wrapper"
  }, /*#__PURE__*/React.createElement(Header, null, t("CS_TITLE_MY_BILLS") + (" (" + applicationList.length + ")")), (applicationList === null || applicationList === void 0 ? void 0 : applicationList.length) > 0 && getKeyNotesConfig && applicationList.map(function (bill, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: index
    }, /*#__PURE__*/React.createElement(MyBill, {
      bill: bill,
      currentPath: currentPath,
      businessService: businessService,
      getKeyNotesConfig: getKeyNotesConfig
    }));
  }), !(applicationList !== null && applicationList !== void 0 && applicationList.length) > 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      paddingLeft: "16px"
    }
  }, t("CS_BILLS_TEXT_NO_BILLS_FOUND"))), businessService === "PT" && /*#__PURE__*/React.createElement("p", {
    style: {
      paddingLeft: "16px",
      paddingTop: "16px",
      position: "fixed",
      bottom: "40px",
      backgroundColor: "#e3e3e3",
      textAlign: "left",
      width: "100%"
    }
  }, t("PT_TEXT_NOT_ABLE_TO_FIND_THE_PROPERTY"), /*#__PURE__*/React.createElement("span", {
    className: "link"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/citizen/pt/property/citizen-search"
  }, t("PT_COMMON_CLICK_HERE"))))));
};

var styles = {
  root: {
    width: "100%",
    marginTop: "2px",
    overflowX: "auto",
    boxShadow: "none"
  },
  table: {
    minWidth: 700,
    backgroundColor: "rgba(250, 250, 250, var(--bg-opacity))"
  },
  cell: {
    maxWidth: "4em",
    minWidth: "1em",
    border: "1px solid #e8e7e6",
    padding: "4px 5px",
    fontSize: "0.8em",
    textAlign: "left",
    lineHeight: "1.5em"
  },
  cellHeader: {
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  cellLeft: {},
  cellRight: {}
};

var ArrearTable = function ArrearTable(_ref) {
  var _ref$className = _ref.className,
      className = _ref$className === void 0 ? "table" : _ref$className,
      _ref$headers = _ref.headers,
      headers = _ref$headers === void 0 ? [] : _ref$headers,
      _ref$values = _ref.values,
      values = _ref$values === void 0 ? [] : _ref$values,
      _ref$arrears = _ref.arrears,
      arrears = _ref$arrears === void 0 ? 0 : _ref$arrears;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: styles.root
  }, /*#__PURE__*/React.createElement("table", {
    className: className,
    style: styles.table
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: _extends({}, styles.cell, styles.cellLeft, styles.cellHeader)
  }, t("CS_BILL_PERIOD")), headers.map(function (header, ind) {
    var styleRight = headers.length == ind + 1 ? styles.cellRight : {};
    return /*#__PURE__*/React.createElement("th", {
      style: _extends({}, styles.cell, styleRight, styles.cellHeader),
      key: ind
    }, t(header));
  }))), /*#__PURE__*/React.createElement("tbody", null, Object.values(values).map(function (row, ind) {
    return /*#__PURE__*/React.createElement("tr", {
      key: ind
    }, /*#__PURE__*/React.createElement("td", {
      style: _extends({}, styles.cell, styles.cellLeft),
      component: "th",
      scope: "row"
    }, Object.keys(values)[ind]), headers.map(function (header, i) {
      var styleRight = headers.length == i + 1 ? styles.cellRight : {};
      return /*#__PURE__*/React.createElement("td", {
        style: _extends({}, styles.cell, {
          textAlign: "left"
        }, styleRight, {
          whiteSpace: "pre"
        }),
        key: i,
        numeric: true
      }, "\u20B9", row[header] && row[header]["value"] || "0");
    }));
  }), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: _extends({}, styles.cell, styles.cellLeft)
  }), headers.map(function (header, ind) {
    if (ind == headers.length - 1) {
      return /*#__PURE__*/React.createElement("td", {
        style: _extends({}, styles.cell, styles.cellRight, {
          textAlign: "left",
          fontWeight: "700",
          whiteSpace: "pre"
        }),
        key: ind,
        numeric: true
      }, arrears);
    } else if (ind == headers.length - 2) {
      return /*#__PURE__*/React.createElement("td", {
        style: _extends({}, styles.cell, {
          textAlign: "left"
        }),
        key: ind,
        numeric: true
      }, t("COMMON_ARREARS_TOTAL"));
    } else {
      return /*#__PURE__*/React.createElement("td", {
        style: styles.cell,
        key: ind,
        numeric: true
      });
    }
  }))))));
};

var styles$1 = {
  buttonStyle: {
    display: "flex",
    justifyContent: 'flex-end',
    color: '#f47738'
  },
  headerStyle: {
    marginTop: '10px',
    fontSize: '16px',
    fontWeight: '700',
    lineHeight: '24px',
    color: ' rgba(11, 12, 12, var(--text-opacity))'
  }
};

var ArrearSummary = function ArrearSummary(_ref) {
  var _bill$billDetails, _sortedBillDetails, _arrears$toFixed;

  var _ref$bill = _ref.bill,
      bill = _ref$bill === void 0 ? {} : _ref$bill;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var formatTaxHeaders = function formatTaxHeaders(billDetail) {
    if (billDetail === void 0) {
      billDetail = {};
    }

    var formattedFees = {};
    var _billDetail = billDetail,
        _billDetail$billAccou = _billDetail.billAccountDetails,
        billAccountDetails = _billDetail$billAccou === void 0 ? [] : _billDetail$billAccou;
    billAccountDetails.map(function (taxHead) {
      formattedFees[taxHead.taxHeadCode] = {
        value: taxHead.amount,
        order: taxHead.order
      };
    });
    formattedFees['TL_COMMON_TOTAL_AMT'] = {
      value: billDetail.amount,
      order: 10
    };
    return formattedFees;
  };

  var getFinancialYears = function getFinancialYears(from, to) {
    var fromDate = new Date(from);
    var toDate = new Date(to);

    if (toDate.getYear() - fromDate.getYear() != 0) {
      return "FY" + (fromDate.getYear() + 1900) + "-" + (toDate.getYear() - 100);
    }

    return fromDate.toLocaleDateString() + "-" + toDate.toLocaleDateString();
  };

  var fees = {};
  var sortedBillDetails = (bill === null || bill === void 0 ? void 0 : (_bill$billDetails = bill.billDetails) === null || _bill$billDetails === void 0 ? void 0 : _bill$billDetails.sort(function (a, b) {
    return b.fromPeriod - a.fromPeriod;
  })) || [];
  sortedBillDetails = [].concat(sortedBillDetails);
  var arrears = ((_sortedBillDetails = sortedBillDetails) === null || _sortedBillDetails === void 0 ? void 0 : _sortedBillDetails.reduce(function (total, current, index) {
    return index === 0 ? total : total + current.amount;
  }, 0)) || 0;
  var arrearsAmount = "\u20B9 " + ((arrears === null || arrears === void 0 ? void 0 : (_arrears$toFixed = arrears.toFixed) === null || _arrears$toFixed === void 0 ? void 0 : _arrears$toFixed.call(arrears, 0)) || Number(0).toFixed(0));
  sortedBillDetails.shift();
  sortedBillDetails.map(function (bill) {
    var fee = formatTaxHeaders(bill);
    fees[getFinancialYears(bill.fromPeriod, bill.toPeriod)] = fee;
  });
  var head = {};
  fees ? Object.keys(fees).map(function (key, ind) {
    Object.keys(fees[key]).map(function (key1) {
      head[key1] = fees[key] && fees[key][key1] && fees[key][key1].order || 0;
    });
  }) : "NA";
  var keys = [];
  keys = Object.keys(head);
  keys.sort(function (x, y) {
    return head[x] - head[y];
  });

  var _useState = useState(false),
      showArrear = _useState[0],
      setShowArrear = _useState[1];

  if (arrears == 0 || arrears < 0) {
    return /*#__PURE__*/React.createElement("span", null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: styles$1.headerStyle
  }, t('CS_ARREARS_DETAILS')), showArrear && /*#__PURE__*/React.createElement(ArrearTable, {
    headers: [].concat(keys),
    values: fees,
    arrears: arrearsAmount
  }), !showArrear && /*#__PURE__*/React.createElement("div", {
    style: styles$1.buttonStyle
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      setShowArrear(true);
    }
  }, t("CS_SHOW_CARD"))), showArrear && /*#__PURE__*/React.createElement("div", {
    style: styles$1.buttonStyle
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: function onClick() {
      setShowArrear(false);
    }
  }, t("CS_HIDE_CARD"))));
};

var BillSumary = function BillSumary(_ref) {
  var _arrears$toFixed;

  var billAccountDetails = _ref.billAccountDetails,
      total = _ref.total,
      arrears = _ref.arrears;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
      ModuleWorkflow = _Digit$Hooks$useQuery.workflow;

  useEffect(function () {
    ModuleWorkflow === "mcollect" && billAccountDetails && billAccountDetails.map(function (ob) {
      if (ob.taxHeadCode.includes("CGST")) ob.order = 3;else if (ob.taxHeadCode.includes("SGST")) ob.order = 4;
    });
  }, [billAccountDetails]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "bill-summary"
  }, billAccountDetails.sort(function (a, b) {
    return a.order - b.order;
  }).map(function (amountDetails, index) {
    var _amountDetails$amount;

    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "bill-account-details"
    }, /*#__PURE__*/React.createElement("div", {
      className: "label"
    }, t(amountDetails.taxHeadCode)), /*#__PURE__*/React.createElement("div", {
      className: "value"
    }, "\u20B9 ", (_amountDetails$amount = amountDetails.amount) === null || _amountDetails$amount === void 0 ? void 0 : _amountDetails$amount.toFixed(2)));
  }), /*#__PURE__*/React.createElement("div", {
    className: "bill-account-details"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, t("COMMON_ARREARS")), /*#__PURE__*/React.createElement("div", {
    className: "value"
  }, "\u20B9 ", (arrears === null || arrears === void 0 ? void 0 : (_arrears$toFixed = arrears.toFixed) === null || _arrears$toFixed === void 0 ? void 0 : _arrears$toFixed.call(arrears, 2)) || Number(0).toFixed(2))), /*#__PURE__*/React.createElement("hr", {
    className: "underline"
  }), /*#__PURE__*/React.createElement("div", {
    className: "amount-details"
  }, /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, t("CS_PAYMENT_TOTAL_AMOUNT")), /*#__PURE__*/React.createElement("div", {
    className: "value"
  }, "\u20B9 ", Number(total)))));
};

var BillDetails$1 = function BillDetails(_ref) {
  var _Digit$UserService$ge, _bill$billDetails, _bill$billDetails$sor, _bill$billDetails2, _bill$billDetails2$so;

  var paymentRules = _ref.paymentRules,
      businessService = _ref.businessService;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var history = useHistory();

  var _useLocation = useLocation(),
      state = _useLocation.state,
      location = _objectWithoutPropertiesLoose(_useLocation, ["state"]);

  var _useParams = useParams(),
      consumerCode = _useParams.consumerCode;

  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
      wrkflow = _Digit$Hooks$useQuery.workflow,
      _tenantId = _Digit$Hooks$useQuery.tenantId;

  var _useState = useState(state === null || state === void 0 ? void 0 : state.bill),
      bill = _useState[0],
      setBill = _useState[1];

  var tenantId = (state === null || state === void 0 ? void 0 : state.tenantId) || _tenantId || ((_Digit$UserService$ge = Digit.UserService.getUser().info) === null || _Digit$UserService$ge === void 0 ? void 0 : _Digit$UserService$ge.tenantId);

  var _ref2 = state !== null && state !== void 0 && state.bill ? {
    isLoading: false
  } : Digit.Hooks.useFetchPayment({
    tenantId: tenantId,
    businessService: businessService,
    consumerCode: consumerCode
  }),
      data = _ref2.data,
      isLoading = _ref2.isLoading;

  var minAmountPayable = paymentRules.minAmountPayable,
      isAdvanceAllowed = paymentRules.isAdvanceAllowed;
  var billDetails = (bill === null || bill === void 0 ? void 0 : (_bill$billDetails = bill.billDetails) === null || _bill$billDetails === void 0 ? void 0 : (_bill$billDetails$sor = _bill$billDetails.sort(function (a, b) {
    return b.fromPeriod - a.fromPeriod;
  })) === null || _bill$billDetails$sor === void 0 ? void 0 : _bill$billDetails$sor[0]) || [];
  var Arrears = (bill === null || bill === void 0 ? void 0 : (_bill$billDetails2 = bill.billDetails) === null || _bill$billDetails2 === void 0 ? void 0 : (_bill$billDetails2$so = _bill$billDetails2.sort(function (a, b) {
    return b.fromPeriod - a.fromPeriod;
  })) === null || _bill$billDetails2$so === void 0 ? void 0 : _bill$billDetails2$so.reduce(function (total, current, index) {
    return index === 0 ? total : total + current.amount;
  }, 0)) || 0;

  var _Digit$Hooks$useAppli = Digit.Hooks.useApplicationsForBusinessServiceSearch({
    businessService: businessService
  }, {
    enabled: false
  }),
      label = _Digit$Hooks$useAppli.label;

  var getBillingPeriod = function getBillingPeriod() {
    var fromPeriod = billDetails.fromPeriod,
        toPeriod = billDetails.toPeriod;

    if (fromPeriod && toPeriod) {
      var from, to;

      if (wrkflow === "mcollect") {
        from = new Date(fromPeriod).getDate().toString() + " " + Digit.Utils.date.monthNames[new Date(fromPeriod).getMonth() + 1].toString() + " " + new Date(fromPeriod).getFullYear().toString();
        to = new Date(toPeriod).getDate() + " " + Digit.Utils.date.monthNames[new Date(toPeriod).getMonth() + 1] + " " + new Date(toPeriod).getFullYear();
        return from + " - " + to;
      }

      from = new Date(billDetails.fromPeriod).getFullYear().toString();
      to = new Date(billDetails.toPeriod).getFullYear().toString();
      return "FY " + from + "-" + to;
    } else return "N/A";
  };

  var getBillBreakDown = function getBillBreakDown() {
    return (billDetails === null || billDetails === void 0 ? void 0 : billDetails.billAccountDetails) || [];
  };

  var getTotal = function getTotal() {
    return (bill === null || bill === void 0 ? void 0 : bill.totalAmount) || 0;
  };

  var _useState2 = useState(t("CS_PAYMENT_FULL_AMOUNT")),
      paymentType = _useState2[0],
      setPaymentType = _useState2[1];

  var _useState3 = useState(getTotal()),
      amount = _useState3[0],
      setAmount = _useState3[1];

  var _useState4 = useState(true),
      paymentAllowed = _useState4[0],
      setPaymentAllowed = _useState4[1];

  var _useState5 = useState(""),
      formError = _useState5[0],
      setError = _useState5[1];

  useEffect(function () {
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
  }, []);
  useEffect(function () {
    if (paymentType == t("CS_PAYMENT_FULL_AMOUNT")) setAmount(getTotal());
  }, [paymentType, bill]);
  useEffect(function () {
    var allowPayment = minAmountPayable && amount >= minAmountPayable && !isAdvanceAllowed && amount <= getTotal() && !formError;
    if (paymentType != t("CS_PAYMENT_FULL_AMOUNT")) setPaymentAllowed(allowPayment);else setPaymentAllowed(true);
  }, [paymentType, amount]);
  useEffect(function () {
    if (!bill && data) {
      var requiredBill = data.Bill.filter(function (e) {
        return e.consumerCode == consumerCode;
      })[0];
      setBill(requiredBill);
    }
  }, [isLoading]);

  var onSubmit = function onSubmit() {
    var paymentAmount = paymentType === t("CS_PAYMENT_FULL_AMOUNT") ? getTotal() : amount;

    if (window.location.href.includes("mcollect")) {
      history.push("/digit-ui/citizen/payment/collect/" + businessService + "/" + consumerCode + "?workflow=mcollect", {
        paymentAmount: paymentAmount,
        tenantId: billDetails.tenantId
      });
    } else if (businessService === "PT") {
      history.push("/digit-ui/citizen/payment/collect/" + businessService + "/" + consumerCode, {
        paymentAmount: paymentAmount,
        tenantId: billDetails.tenantId,
        name: bill.payerName,
        mobileNumber: bill.mobileNumber
      });
    } else {
      history.push("/digit-ui/citizen/payment/collect/" + businessService + "/" + consumerCode, {
        paymentAmount: paymentAmount,
        tenantId: billDetails.tenantId
      });
    }
  };

  var onChangeAmount = function onChangeAmount(value) {
    setError("");

    if (isNaN(value) || value.includes(".")) {
      setError("AMOUNT_INVALID");
    } else if (!isAdvanceAllowed && value > getTotal()) {
      setError("CS_ADVANCED_PAYMENT_NOT_ALLOWED");
    } else if (value < minAmountPayable) {
      setError("CS_CANT_PAY_BELOW_MIN_AMOUNT");
    }

    setAmount(value);
  };

  if (isLoading) return /*#__PURE__*/React.createElement(Loader, null);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, null, t("CS_PAYMENT_BILL_DETAILS")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(KeyNote, {
    keyValue: t(label),
    note: consumerCode
  }), /*#__PURE__*/React.createElement(KeyNote, {
    keyValue: t("CS_PAYMENT_BILLING_PERIOD"),
    note: getBillingPeriod()
  }), /*#__PURE__*/React.createElement(BillSumary, {
    billAccountDetails: getBillBreakDown(),
    total: getTotal(),
    businessService: businessService,
    arrears: Arrears
  }), /*#__PURE__*/React.createElement(ArrearSummary, {
    bill: bill
  })), /*#__PURE__*/React.createElement("div", {
    className: "bill-payment-amount"
  }, /*#__PURE__*/React.createElement("hr", {
    className: "underline"
  }), /*#__PURE__*/React.createElement(CardSubHeader, null, t("CS_COMMON_PAYMENT_AMOUNT")), /*#__PURE__*/React.createElement(RadioButtons, {
    selectedOption: paymentType,
    onSelect: setPaymentType,
    options: paymentRules.partPaymentAllowed ? [t("CS_PAYMENT_FULL_AMOUNT"), t("CS_PAYMENT_CUSTOM_AMOUNT")] : [t("CS_PAYMENT_FULL_AMOUNT")]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "payment-amount-front",
    style: {
      border: "1px solid " + (paymentType === t("CS_PAYMENT_FULL_AMOUNT") ? "#9a9a9a" : "black")
    }
  }, "\u20B9"), paymentType !== t("CS_PAYMENT_FULL_AMOUNT") ? /*#__PURE__*/React.createElement(TextInput, {
    className: "text-indent-xl",
    onChange: function onChange(e) {
      return onChangeAmount(e.target.value);
    },
    value: amount,
    disable: getTotal() === 0
  }) : /*#__PURE__*/React.createElement(TextInput, {
    className: "text-indent-xl",
    value: getTotal(),
    onChange: function onChange() {},
    disable: true
  }), formError === "CS_CANT_PAY_BELOW_MIN_AMOUNT" ? /*#__PURE__*/React.createElement("span", {
    className: "card-label-error"
  }, t(formError), ": ", "₹" + minAmountPayable) : /*#__PURE__*/React.createElement("span", {
    className: "card-label-error"
  }, t(formError))), /*#__PURE__*/React.createElement(SubmitBar, {
    disabled: !paymentAllowed || getTotal() == 0,
    onSubmit: onSubmit,
    label: t("CS_COMMON_PROCEED_TO_PAY")
  }))));
};

var BillRoutes = function BillRoutes(_ref) {
  var billsList = _ref.billsList,
      paymentRules = _ref.paymentRules,
      businessService = _ref.businessService;

  var _useRouteMatch = useRouteMatch(),
      currentPath = _useRouteMatch.url,
      match = _objectWithoutPropertiesLoose(_useRouteMatch, ["url"]);

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BackButton, null), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: "" + currentPath,
    component: function component() {
      return /*#__PURE__*/React.createElement(BillList, {
        billsList: billsList,
        currentPath: currentPath,
        paymentRules: paymentRules,
        businessService: businessService
      });
    }
  }), /*#__PURE__*/React.createElement(Route, {
    path: currentPath + "/:consumerCode",
    component: function component() {
      return /*#__PURE__*/React.createElement(BillDetails$1, {
        paymentRules: paymentRules,
        businessService: businessService
      });
    }
  })));
};

var MyBills = function MyBills(_ref) {
  var _Digit$UserService$ge, _location$state, _location$state2;

  var stateCode = _ref.stateCode;

  var _useParams = useParams(),
      businessService = _useParams.businessService;

  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
      _tenantId = _Digit$Hooks$useQuery.tenantId;

  var _Digit$Services$useSt = Digit.Services.useStore({
    stateCode: stateCode,
    moduleCode: businessService,
    language: Digit.StoreData.getCurrentLanguage()
  });

  var history = useHistory();

  var _useRouteMatch = useRouteMatch(),
      url = _useRouteMatch.url;

  var location = useLocation();

  var _ref2 = ((_Digit$UserService$ge = Digit.UserService.getUser()) === null || _Digit$UserService$ge === void 0 ? void 0 : _Digit$UserService$ge.info) || (location === null || location === void 0 ? void 0 : location.state) || {
    tenantId: _tenantId
  } || {},
      tenantId = _ref2.tenantId;

  if (!tenantId && !(location !== null && location !== void 0 && (_location$state = location.state) !== null && _location$state !== void 0 && _location$state.fromSearchResults)) {
    history.replace("/digit-ui/citizen/login", {
      from: url
    });
  }

  var _Digit$Hooks$useFetch = Digit.Hooks.useFetchCitizenBillsForBuissnessService({
    businessService: businessService
  }, {
    refetchOnMount: true,
    enabled: !(location !== null && location !== void 0 && (_location$state2 = location.state) !== null && _location$state2 !== void 0 && _location$state2.fromSearchResults)
  }),
      data = _Digit$Hooks$useFetch.data;

  var _Digit$Hooks$useGetPa = Digit.Hooks.useGetPaymentRulesForBusinessServices(tenantId),
      mdmsLoading = _Digit$Hooks$useGetPa.isLoading,
      mdmsBillingData = _Digit$Hooks$useGetPa.data;

  var billsList = (data === null || data === void 0 ? void 0 : data.Bill) || [];

  var getPaymentRestrictionDetails = function getPaymentRestrictionDetails() {
    var _mdmsBillingData$Mdms, _mdmsBillingData$Mdms2;

    var payRestrictiondetails = mdmsBillingData === null || mdmsBillingData === void 0 ? void 0 : (_mdmsBillingData$Mdms = mdmsBillingData.MdmsRes) === null || _mdmsBillingData$Mdms === void 0 ? void 0 : (_mdmsBillingData$Mdms2 = _mdmsBillingData$Mdms.BillingService) === null || _mdmsBillingData$Mdms2 === void 0 ? void 0 : _mdmsBillingData$Mdms2.BusinessService;
    if (payRestrictiondetails !== null && payRestrictiondetails !== void 0 && payRestrictiondetails.length) return payRestrictiondetails.filter(function (e) {
      return e.code == businessService;
    })[0];else return {};
  };

  var getProps = function getProps() {
    return {
      billsList: billsList,
      paymentRules: getPaymentRestrictionDetails(),
      businessService: businessService
    };
  };

  if (mdmsLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BillRoutes, getProps()));
};

var SelectPaymentType = function SelectPaymentType(props) {
  var _useLocation = useLocation(),
      _useLocation$state = _useLocation.state,
      state = _useLocation$state === void 0 ? {} : _useLocation$state;

  var userInfo = Digit.UserService.getUser();

  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
      __tenantId = _Digit$Hooks$useQuery.tenantId,
      authorization = _Digit$Hooks$useQuery.authorization;

  var paymentAmount = state === null || state === void 0 ? void 0 : state.paymentAmount;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var history = useHistory();

  var _useLocation2 = useLocation(),
      pathname = _useLocation2.pathname,
      search = _useLocation2.search;

  var _useParams = useParams(),
      consumerCode = _useParams.consumerCode,
      businessService = _useParams.businessService;

  var tenantId = (state === null || state === void 0 ? void 0 : state.tenantId) || __tenantId || Digit.ULBService.getCurrentTenantId();
  var stateTenant = tenantId.split(".")[0];

  var _useForm = useForm(),
      control = _useForm.control,
      handleSubmit = _useForm.handleSubmit;

  var _Digit$Hooks$useCommo = Digit.Hooks.useCommonMDMS(stateTenant, "DIGIT-UI", "PaymentGateway"),
      menu = _Digit$Hooks$useCommo.data,
      isLoading = _Digit$Hooks$useCommo.isLoading;

  var _Digit$Hooks$useFetch = Digit.Hooks.useFetchPayment({
    tenantId: tenantId,
    consumerCode: consumerCode,
    businessService: businessService
  }, {}),
      paymentdetails = _Digit$Hooks$useFetch.data,
      paymentLoading = _Digit$Hooks$useFetch.isLoading;

  var name = state.name,
      mobileNumber = state.mobileNumber;
  var billDetails = paymentdetails !== null && paymentdetails !== void 0 && paymentdetails.Bill ? paymentdetails === null || paymentdetails === void 0 ? void 0 : paymentdetails.Bill[0] : {};

  var onSubmit = function onSubmit(d) {
    try {
      var _userInfo$info, _userInfo$info2;

      var filterData = {
        Transaction: {
          tenantId: tenantId,
          txnAmount: paymentAmount || billDetails.totalAmount,
          module: businessService,
          billId: billDetails.id,
          consumerCode: consumerCode,
          productInfo: "Common Payment",
          gateway: d.paymentType,
          taxAndPayments: [{
            billId: billDetails.id,
            amountPaid: paymentAmount || billDetails.totalAmount
          }],
          user: {
            name: (userInfo === null || userInfo === void 0 ? void 0 : (_userInfo$info = userInfo.info) === null || _userInfo$info === void 0 ? void 0 : _userInfo$info.name) || name,
            mobileNumber: (userInfo === null || userInfo === void 0 ? void 0 : (_userInfo$info2 = userInfo.info) === null || _userInfo$info2 === void 0 ? void 0 : _userInfo$info2.mobileNumber) || mobileNumber,
            tenantId: tenantId
          },
          callbackUrl: window.location.href.includes("mcollect") ? window.location.protocol + "//" + window.location.host + "/digit-ui/citizen/payment/success/" + businessService + "/" + consumerCode + "/" + tenantId + "?workflow=mcollect" : window.location.protocol + "//" + window.location.host + "/digit-ui/citizen/payment/success/" + businessService + "/" + consumerCode + "/" + tenantId,
          additionalDetails: {
            isWhatsapp: false
          }
        }
      };

      var _temp2 = _catch(function () {
        return Promise.resolve(Digit.PaymentService.createCitizenReciept(tenantId, filterData)).then(function (data) {
          var _data$Transaction;

          var redirectUrl = data === null || data === void 0 ? void 0 : (_data$Transaction = data.Transaction) === null || _data$Transaction === void 0 ? void 0 : _data$Transaction.redirectUrl;
          window.location = redirectUrl;
        });
      }, function (error) {
        var _error$response, _error$response$data, _error$response$data$;

        var messageToShow = "CS_PAYMENT_UNKNOWN_ERROR_ON_SERVER";
        console.dir(error);
        console.log(error.response);

        if ((_error$response = error.response) !== null && _error$response !== void 0 && (_error$response$data = _error$response.data) !== null && _error$response$data !== void 0 && (_error$response$data$ = _error$response$data.Errors) !== null && _error$response$data$ !== void 0 && _error$response$data$[0]) {
          var _error$response2, _error$response2$data, _error$response2$data2;

          var _error$response$data$2 = (_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : (_error$response2$data = _error$response2.data) === null || _error$response2$data === void 0 ? void 0 : (_error$response2$data2 = _error$response2$data.Errors) === null || _error$response2$data2 === void 0 ? void 0 : _error$response2$data2[0],
              code = _error$response$data$2.code,
              message = _error$response$data$2.message;

          messageToShow = t(message);
        }

        window.alert(messageToShow);
      });

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  if (authorization === "true" && !userInfo.access_token) {
    return /*#__PURE__*/React.createElement(Redirect, {
      to: "/digit-ui/citizen/login?from=" + encodeURIComponent(pathname + search)
    });
  }

  if (isLoading || paymentLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BackButton, null, t("CS_COMMON_BACK")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement(Header, null, t("PAYMENT_CS_HEADER")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "payment-amount-info"
  }, /*#__PURE__*/React.createElement(CardLabelDesc, {
    className: "dark"
  }, t("PAYMENT_CS_TOTAL_AMOUNT_DUE")), /*#__PURE__*/React.createElement(CardSectionHeader, null, " \u20B9 ", paymentAmount || billDetails.totalAmount)), /*#__PURE__*/React.createElement(CardLabel, null, t("PAYMENT_CS_SELECT_METHOD")), (menu === null || menu === void 0 ? void 0 : menu.length) && /*#__PURE__*/React.createElement(Controller, {
    name: "paymentType",
    defaultValue: menu[0],
    control: control,
    render: function render(props) {
      return /*#__PURE__*/React.createElement(RadioButtons, {
        selectedOption: props.value,
        options: menu,
        onSelect: props.onChange
      });
    }
  }), /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("PAYMENT_CS_BUTTON_LABEL"),
    submit: true
  }))), /*#__PURE__*/React.createElement(InfoBanner, {
    label: t("CS_COMMON_INFO"),
    text: t("CS_PAYMENT_REDIRECT_NOTICE")
  }));
};

var SuccessfulPayment$1 = function SuccessfulPayment(props) {
  var _data$payments, _data$payments$Paymen, _data$payments$Paymen2, _data$payments2, _reciept_data$payment3, _reciept_data$payment4, _reciept_data$payment5, _reciept_data$payment6, _reciept_data$payment7, _reciept_data$payment8, _reciept_data$payment9, _reciept_data$payment10;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var queryClient = useQueryClient();

  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
      egId = _Digit$Hooks$useQuery.eg_pg_txnid,
      workflw = _Digit$Hooks$useQuery.workflow;

  var _useState = useState(false),
      printing = _useState[0],
      setPrinting = _useState[1];

  var _useState2 = useState(false),
      allowFetchBill = _useState2[0],
      setallowFetchBill = _useState2[1];

  var _useParams = useParams(),
      business_service = _useParams.businessService,
      consumerCode = _useParams.consumerCode,
      tenantId = _useParams.tenantId;

  var _Digit$Hooks$usePayme = Digit.Hooks.usePaymentUpdate({
    egId: egId
  }, business_service, {
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false
  }),
      isLoading = _Digit$Hooks$usePayme.isLoading,
      data = _Digit$Hooks$usePayme.data,
      isError = _Digit$Hooks$usePayme.isError;

  var _Digit$Hooks$useAppli = Digit.Hooks.useApplicationsForBusinessServiceSearch({
    businessService: business_service
  }, {
    enabled: false
  }),
      label = _Digit$Hooks$useAppli.label;

  var _Digit$Hooks$useRecie = Digit.Hooks.useRecieptSearch({
    tenantId: tenantId,
    businessService: business_service,
    receiptNumbers: data === null || data === void 0 ? void 0 : (_data$payments = data.payments) === null || _data$payments === void 0 ? void 0 : (_data$payments$Paymen = _data$payments.Payments) === null || _data$payments$Paymen === void 0 ? void 0 : (_data$payments$Paymen2 = _data$payments$Paymen[0]) === null || _data$payments$Paymen2 === void 0 ? void 0 : _data$payments$Paymen2.paymentDetails[0].receiptNumber
  }, {
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    select: function select(dat) {
      return dat.Payments[0];
    },
    enabled: allowFetchBill
  }),
      reciept_data = _Digit$Hooks$useRecie.data,
      recieptDataLoading = _Digit$Hooks$useRecie.isLoading;

  var _Digit$Hooks$useCommo = Digit.Hooks.useCommonMDMS(tenantId, "common-masters", "ReceiptKey", {
    select: function select(data) {
      var _data$commonMasters, _data$commonMasters$u, _data$commonMasters$u2;

      return ((_data$commonMasters = data["common-masters"]) === null || _data$commonMasters === void 0 ? void 0 : (_data$commonMasters$u = _data$commonMasters.uiCommonPay) === null || _data$commonMasters$u === void 0 ? void 0 : (_data$commonMasters$u2 = _data$commonMasters$u.filter(function (_ref) {
        var code = _ref.code;
        return business_service === null || business_service === void 0 ? void 0 : business_service.includes(code);
      })[0]) === null || _data$commonMasters$u2 === void 0 ? void 0 : _data$commonMasters$u2.receiptKey) || "consolidatedreceipt";
    },
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false
  }),
      generatePdfKey = _Digit$Hooks$useCommo.data;

  var payments = data === null || data === void 0 ? void 0 : data.payments;
  useEffect(function () {
    return function () {
      queryClient.clear();
    };
  }, []);
  useEffect(function () {
    if (data && data.txnStatus && data.txnStatus !== "FAILURE") {
      setallowFetchBill(true);
    }
  }, [data]);

  if (isLoading || recieptDataLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  var applicationNo = data === null || data === void 0 ? void 0 : data.applicationNo;
  var isMobile = window.Digit.Utils.browser.isMobile();

  if (isError || !payments || !payments.Payments || payments.Payments.length === 0 || data.txnStatus === "FAILURE") {
    return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Banner, {
      message: t("CITIZEN_FAILURE_COMMON_PAYMENT_MESSAGE"),
      info: t("CS_PAYMENT_TRANSANCTION_ID"),
      applicationNumber: egId,
      successful: false
    }), /*#__PURE__*/React.createElement(CardText, null, t("CS_PAYMENT_FAILURE_MESSAGE")), business_service !== "PT" ? /*#__PURE__*/React.createElement(Link, {
      to: "/digit-ui/citizen"
    }, /*#__PURE__*/React.createElement(SubmitBar, {
      label: t("CORE_COMMON_GO_TO_HOME")
    })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Link, {
      to: applicationNo && "/digit-ui/citizen/payment/my-bills/" + business_service + "/" + applicationNo || "/digit-ui/citizen"
    }, /*#__PURE__*/React.createElement(SubmitBar, {
      label: t("CS_PAYMENT_TRY_AGAIN")
    })), /*#__PURE__*/React.createElement("div", {
      className: "link",
      style: isMobile ? {
        marginTop: "8px",
        width: "100%",
        textAlign: "center"
      } : {
        marginTop: "8px"
      }
    }, /*#__PURE__*/React.createElement(Link, {
      to: "/digit-ui/citizen"
    }, t("CORE_COMMON_GO_TO_HOME")))));
  }

  var paymentData = data === null || data === void 0 ? void 0 : (_data$payments2 = data.payments) === null || _data$payments2 === void 0 ? void 0 : _data$payments2.Payments[0];
  var transactionDate = paymentData.transactionDate;

  var printCertificate = function printCertificate() {
    try {
      var state = tenantId;
      return Promise.resolve(Digit.TLService.search({
        applicationNumber: consumerCode,
        tenantId: tenantId
      })).then(function (applicationDetails) {
        var generatePdfKeyForTL = "tlcertificate";

        var _temp = function () {
          if (applicationDetails) {
            return Promise.resolve(Digit.PaymentService.generatePdf(state, {
              Licenses: applicationDetails === null || applicationDetails === void 0 ? void 0 : applicationDetails.Licenses
            }, generatePdfKeyForTL)).then(function (response) {
              return Promise.resolve(Digit.PaymentService.printReciept(state, {
                fileStoreIds: response.filestoreIds[0]
              })).then(function (fileStore) {
                window.open(fileStore[response.filestoreIds[0]], "_blank");
              });
            });
          }
        }();

        if (_temp && _temp.then) return _temp.then(function () {});
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var printReciept = function printReciept() {
    try {
      var _payments$Payments$;

      var _temp4 = function _temp4() {
        return Promise.resolve(Digit.PaymentService.printReciept(state, {
          fileStoreIds: response.filestoreIds[0]
        })).then(function (fileStore) {
          if (fileStore && fileStore[response.filestoreIds[0]]) {
            window.open(fileStore[response.filestoreIds[0]], "_blank");
          }

          setPrinting(false);
        });
      };

      if (printing) return Promise.resolve();
      setPrinting(true);

      var _tenantId = paymentData === null || paymentData === void 0 ? void 0 : paymentData.tenantId;

      var state = _tenantId === null || _tenantId === void 0 ? void 0 : _tenantId.split(".")[0];
      var response = {
        filestoreIds: [(_payments$Payments$ = payments.Payments[0]) === null || _payments$Payments$ === void 0 ? void 0 : _payments$Payments$.fileStoreId]
      };

      var _temp5 = function () {
        if (!(paymentData !== null && paymentData !== void 0 && paymentData.fileStoreId)) {
          return Promise.resolve(Digit.PaymentService.generatePdf(state, {
            Payments: [payments.Payments[0]]
          }, generatePdfKey)).then(function (_Digit$PaymentService) {
            response = _Digit$PaymentService;
          });
        }
      }();

      return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(_temp4) : _temp4(_temp5));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var getBillingPeriod = function getBillingPeriod(billDetails) {
    var _ref2 = billDetails || {},
        taxPeriodFrom = _ref2.taxPeriodFrom,
        taxPeriodTo = _ref2.taxPeriodTo,
        fromPeriod = _ref2.fromPeriod,
        toPeriod = _ref2.toPeriod;

    if (taxPeriodFrom && taxPeriodTo) {
      var from = new Date(taxPeriodFrom).getFullYear().toString();
      var to = new Date(taxPeriodTo).getFullYear().toString();
      return "FY " + from + "-" + to;
    } else if (fromPeriod && toPeriod) {
      if (workflw === "mcollect") {
        _from = new Date(fromPeriod).getDate().toString() + " " + Digit.Utils.date.monthNames[new Date(fromPeriod).getMonth() + 1].toString() + " " + new Date(fromPeriod).getFullYear().toString();
        _to = new Date(toPeriod).getDate() + " " + Digit.Utils.date.monthNames[new Date(toPeriod).getMonth() + 1] + " " + new Date(toPeriod).getFullYear();
        return _from + " - " + _to;
      }

      var _from = new Date(fromPeriod).getFullYear().toString();

      var _to = new Date(toPeriod).getFullYear().toString();

      return "FY " + _from + "-" + _to;
    } else return "N/A";
  };

  var bannerText;

  if (workflw) {
    bannerText = "CITIZEN_SUCCESS_UC_PAYMENT_MESSAGE";
  } else {
    bannerText = "CITIZEN_SUCCESS_" + (paymentData === null || paymentData === void 0 ? void 0 : paymentData.paymentDetails[0].businessService.replace(/\./g, "_")) + "_PAYMENT_MESSAGE";
  }

  var rowContainerStyle = {
    padding: "4px 0px",
    justifyContent: "space-between"
  };
  var ommitRupeeSymbol = ["PT"].includes(business_service);
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Banner, {
    svg: /*#__PURE__*/React.createElement("svg", {
      className: "payment-svg",
      xmlns: "http://www.w3.org/2000/svg",
      width: "40",
      height: "40",
      viewBox: "0 0 40 40",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20 0C8.96 0 0 8.96 0 20C0 31.04 8.96 40 20 40C31.04 40 40 31.04 40 20C40 8.96 31.04 0 20 0ZM16 30L6 20L8.82 17.18L16 24.34L31.18 9.16L34 12L16 30Z",
      fill: "white"
    })),
    message: t("CS_COMMON_PAYMENT_COMPLETE"),
    info: t("CS_COMMON_RECIEPT_NO"),
    applicationNumber: paymentData === null || paymentData === void 0 ? void 0 : paymentData.paymentDetails[0].receiptNumber,
    successful: true
  }), /*#__PURE__*/React.createElement(CardText, null, t(bannerText + "_DETAIL")), /*#__PURE__*/React.createElement(StatusTable, null, /*#__PURE__*/React.createElement(Row, {
    rowContainerStyle: rowContainerStyle,
    last: true,
    label: t(label),
    text: applicationNo
  }), (business_service === "PT" || workflw) && /*#__PURE__*/React.createElement(Row, {
    rowContainerStyle: rowContainerStyle,
    last: true,
    label: t("CS_PAYMENT_BILLING_PERIOD"),
    text: getBillingPeriod(reciept_data === null || reciept_data === void 0 ? void 0 : (_reciept_data$payment3 = reciept_data.paymentDetails[0]) === null || _reciept_data$payment3 === void 0 ? void 0 : (_reciept_data$payment4 = _reciept_data$payment3.bill) === null || _reciept_data$payment4 === void 0 ? void 0 : _reciept_data$payment4.billDetails[0])
  }), (business_service === "PT" || workflw) && /*#__PURE__*/React.createElement(Row, {
    rowContainerStyle: rowContainerStyle,
    last: true,
    label: t("CS_PAYMENT_AMOUNT_PENDING"),
    text: (reciept_data === null || reciept_data === void 0 ? void 0 : (_reciept_data$payment5 = reciept_data.paymentDetails) === null || _reciept_data$payment5 === void 0 ? void 0 : (_reciept_data$payment6 = _reciept_data$payment5[0]) === null || _reciept_data$payment6 === void 0 ? void 0 : _reciept_data$payment6.totalDue) - (reciept_data === null || reciept_data === void 0 ? void 0 : (_reciept_data$payment7 = reciept_data.paymentDetails) === null || _reciept_data$payment7 === void 0 ? void 0 : (_reciept_data$payment8 = _reciept_data$payment7[0]) === null || _reciept_data$payment8 === void 0 ? void 0 : _reciept_data$payment8.totalAmountPaid)
  }), /*#__PURE__*/React.createElement(Row, {
    rowContainerStyle: rowContainerStyle,
    last: true,
    label: t("CS_PAYMENT_TRANSANCTION_ID"),
    text: egId
  }), /*#__PURE__*/React.createElement(Row, {
    rowContainerStyle: rowContainerStyle,
    last: true,
    label: t(ommitRupeeSymbol ? "CS_PAYMENT_AMOUNT_PAID_WITHOUT_SYMBOL" : "CS_PAYMENT_AMOUNT_PAID"),
    text: "₹ " + (reciept_data === null || reciept_data === void 0 ? void 0 : (_reciept_data$payment9 = reciept_data.paymentDetails) === null || _reciept_data$payment9 === void 0 ? void 0 : (_reciept_data$payment10 = _reciept_data$payment9[0]) === null || _reciept_data$payment10 === void 0 ? void 0 : _reciept_data$payment10.totalAmountPaid)
  }), (business_service !== "PT" || workflw) && /*#__PURE__*/React.createElement(Row, {
    rowContainerStyle: rowContainerStyle,
    last: true,
    label: t("CS_PAYMENT_TRANSANCTION_DATE"),
    text: transactionDate && new Date(transactionDate).toLocaleDateString("in")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex"
    }
  }, business_service == "TL" ? /*#__PURE__*/React.createElement("div", {
    className: "primary-label-btn d-grid",
    style: {
      marginLeft: "unset",
      marginRight: "20px",
      marginTop: "15px",
      marginBottom: "15px"
    },
    onClick: printReciept
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24px",
    viewBox: "0 0 24 24",
    width: "24px",
    fill: "#f47738"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z"
  })), t("TL_RECEIPT")) : null, business_service == "TL" ? /*#__PURE__*/React.createElement("div", {
    className: "primary-label-btn d-grid",
    style: {
      marginLeft: "unset",
      marginTop: "15px"
    },
    onClick: printCertificate
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24px",
    viewBox: "0 0 24 24",
    width: "24px",
    fill: "#f47738"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z"
  })), t("TL_CERTIFICATE")) : null), !(business_service == "TL") && /*#__PURE__*/React.createElement(SubmitBar, {
    onSubmit: printReciept,
    label: t("COMMON_DOWNLOAD_RECEIPT")
  }), !(business_service == "TL") && /*#__PURE__*/React.createElement("div", {
    className: "link",
    style: isMobile ? {
      marginTop: "8px",
      width: "100%",
      textAlign: "center"
    } : {
      marginTop: "8px"
    }
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/citizen"
  }, t("CORE_COMMON_GO_TO_HOME"))), business_service == "TL" && /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/citizen"
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CORE_COMMON_GO_TO_HOME")
  })));
};
var FailedPayment$1 = function FailedPayment(props) {

  var _useTranslation2 = useTranslation(),
      t = _useTranslation2.t;

  var _useParams2 = useParams(),
      consumerCode = _useParams2.consumerCode;

  var getMessage = function getMessage() {
    return "Failure !";
  };

  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Banner, {
    message: getMessage(),
    complaintNumber: consumerCode,
    successful: false
  }), /*#__PURE__*/React.createElement(CardText, null, t("ES_COMMON_TRACK_COMPLAINT_TEXT")));
};

var CitizenPayment = function CitizenPayment(_ref) {
  var stateCode = _ref.stateCode,
      cityCode = _ref.cityCode,
      moduleCode = _ref.moduleCode;

  var _useRouteMatch = useRouteMatch(),
      currentPath = _useRouteMatch.path;

  var commonProps = {
    stateCode: stateCode,
    cityCode: cityCode,
    moduleCode: moduleCode
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: currentPath + "/my-bills/:businessService"
  }, /*#__PURE__*/React.createElement(MyBills, {
    stateCode: stateCode
  })), /*#__PURE__*/React.createElement(Route, {
    path: currentPath + "/collect/:businessService/:consumerCode"
  }, /*#__PURE__*/React.createElement(SelectPaymentType, _extends({}, commonProps, {
    stateCode: stateCode,
    basePath: currentPath
  }))), /*#__PURE__*/React.createElement(Route, {
    path: currentPath + "/success/:businessService/:consumerCode/:tenantId"
  }, /*#__PURE__*/React.createElement(SuccessfulPayment$1, commonProps)), /*#__PURE__*/React.createElement(Route, {
    path: currentPath + "/failure"
  }, /*#__PURE__*/React.createElement(FailedPayment$1, commonProps))));
};

var getKeyNotesConfig = function getKeyNotesConfig(businessService, t) {
  var businessId = businessService === null || businessService === void 0 ? void 0 : businessService.toLowerCase().split(".")[0];

  switch (businessId) {
    case "pt":
      return {
        "my-bill": [{
          keyValue: "CS_COMMON_AMOUNT_DUE",
          keyPath: [function (d) {
            var _d$billDetails$;

            var overdueBy = new Date().getTime() - new Date((_d$billDetails$ = d.billDetails[0]) === null || _d$billDetails$ === void 0 ? void 0 : _d$billDetails$.toPeriod).getTime();
            var days = Math.floor(overdueBy / (86400 * 1000));
            return /*#__PURE__*/React.createElement(React.Fragment, null, "₹" + d["totalAmount"], days >= 0 ? /*#__PURE__*/React.createElement("span", {
              className: "card-label-error",
              style: {
                fontSize: "16px",
                fontWeight: "normal"
              }
            }, " ( " + t("CS_PAYMENT_OVERDUE") + " " + days + " " + t(days === 1 ? "CS_COMMON_DAY" : "CS_COMMON_DAYS") + ")") : null);
          }],
          fallback: "N/A",
          noteStyle: {
            fontWeight: "bold",
            fontSize: "24px",
            paddingTop: "5px"
          }
        }, {
          keyValue: "PT_PROPERTY_ID",
          keyPath: ["propertyId"],
          fallback: ""
        }, {
          keyValue: "CS_OWNER_NAME",
          keyPath: ["owners", 0, "name"],
          fallback: "ES_TITLE_FSM"
        }, {
          keyValue: "PT_PROPERTY_ADDRESS",
          keyPath: ["address", "locality", "name"],
          fallback: "CS_APPLICATION_TYPE_DESLUDGING"
        }, {
          keyValue: "CS_PAYMENT_BILLING_PERIOD",
          keyPath: ["billDetails", function (d) {
            console.log(d, "in bill details");
            var _d$ = d[0],
                fromPeriod = _d$.fromPeriod,
                toPeriod = _d$.toPeriod;

            if (fromPeriod && toPeriod) {
              var from = new Date(fromPeriod).getFullYear().toString();
              var to = new Date(toPeriod).getFullYear().toString();
              return "FY " + from + "-" + to;
            } else return "N/A";
          }],
          fallback: "N/A"
        }, {
          keyValue: "PT_DUE_DATE",
          keyPath: ["billDetails", function (d) {
            var _d$2, _d$3;

            if (!((_d$2 = d[0]) !== null && _d$2 !== void 0 && _d$2.toPeriod)) return "N/A";
            var date = new Date((_d$3 = d[0]) === null || _d$3 === void 0 ? void 0 : _d$3.toPeriod);
            var month = Digit.Utils.date.monthNames[date.getMonth()];
            return date.getDate() + " " + month + " " + date.getFullYear();
          }],
          fallback: "N/A"
        }],
        response: []
      };

    case "fsm":
      return {
        "my-bill": [{
          keyValue: "CS_COMMON_AMOUNT_DUE",
          keyPath: ["totalAmount", function (d) {
            return d.toFixed(2);
          }, function (d) {
            return "₹" + d;
          }],
          fallback: "N/A",
          noteStyle: {
            fontWeight: "bold",
            fontSize: "24px",
            paddingTop: "5px"
          }
        }],
        response: []
      };
  }
};

var PaymentModule = function PaymentModule(_ref) {
  var stateCode = _ref.stateCode,
      cityCode = _ref.cityCode,
      _ref$moduleCode = _ref.moduleCode,
      moduleCode = _ref$moduleCode === void 0 ? "Payment" : _ref$moduleCode,
      userType = _ref.userType;

  var _useRouteMatch = useRouteMatch(),
      path = _useRouteMatch.path,
      url = _useRouteMatch.url;

  var store = {
    data: {}
  };

  if (Object.keys(store).length === 0) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  var getPaymentHome = function getPaymentHome() {
    if (userType === "citizen") return /*#__PURE__*/React.createElement(CitizenPayment, {
      stateCode: stateCode,
      moduleCode: moduleCode,
      cityCode: cityCode,
      path: path,
      url: url
    });else return /*#__PURE__*/React.createElement(EmployeePayment, {
      stateCode: stateCode,
      cityCode: cityCode,
      moduleCode: moduleCode
    });
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, getPaymentHome());
};
var PaymentLinks = function PaymentLinks(_ref2) {

  var _useTranslation = useTranslation();

  return null;
};
var paymentConfigs = {
  getBillDetailsConfigWithBusinessService: getKeyNotesConfig
};

export { PaymentLinks, PaymentModule, paymentConfigs };
//# sourceMappingURL=index.modern.js.map
