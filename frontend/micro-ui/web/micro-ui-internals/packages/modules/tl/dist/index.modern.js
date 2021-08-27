import { Card, CardHeader, CardText, Loader, CardSubHeader, SubmitBar, CitizenInfoLabel, LocationSearchCard, LabelFieldPair, CardLabel, Dropdown, CardLabelError, FormStep, RadioOrSelect, TextInput, CardLabelDesc, UploadFile, RadioButtons, LinkButton, CheckBox, TextArea, DatePicker, StatusTable, Row, Banner, Header, KeyNote, TelePhone, CardSectionHeader, CheckPoint, ConnectingCheckPoints, MobileNumber, Toast, CaseIcon, EmployeeModuleCard, SearchForm, SearchField, Table, CloseSvg, Localities, RemoveableTag, MultiLink, FormComposer, AppContainer, BackButton, PrivateRoute, Label, LinkLabel, ActionBar, DetailsCard, SearchAction, FilterAction, PopUp, Modal, BreakLine, Menu, BreadCrumb, CitizenHomeCard } from '@egovernments/digit-ui-react-components';
import React, { useState, useEffect, Fragment as Fragment$1, useMemo, useCallback, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory, useRouteMatch, Link, useParams, Switch, Route, Redirect } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useQueryClient } from 'react-query';

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

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

var isArray = Array.isArray;
var isArray_1 = isArray;

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

function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

var symbolTag = '[object Symbol]';

function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike_1(value) && _baseGetTag(value) == symbolTag;
}

var isSymbol_1 = isSymbol;

var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

function isKey(value, object) {
  if (isArray_1(value)) {
    return false;
  }

  var type = typeof value;

  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol_1(value)) {
    return true;
  }

  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}

var _isKey = isKey;

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

var Map$1 = _getNative(_root, 'Map');
var _Map = Map$1;

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

var FUNC_ERROR_TEXT = 'Expected a function';

function memoize(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  var memoized = function memoized() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }

    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };

  memoized.cache = new (memoize.Cache || _MapCache)();
  return memoized;
}

memoize.Cache = _MapCache;
var memoize_1 = memoize;

var MAX_MEMOIZE_SIZE = 500;

function memoizeCapped(func) {
  var result = memoize_1(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }

    return key;
  });
  var cache = result.cache;
  return result;
}

var _memoizeCapped = memoizeCapped;

var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = _memoizeCapped(function (string) {
  var result = [];

  if (string.charCodeAt(0) === 46) {
      result.push('');
    }

  string.replace(rePropName, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
  });
  return result;
});
var _stringToPath = stringToPath;

function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }

  return result;
}

var _arrayMap = arrayMap;

var INFINITY = 1 / 0;
var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }

  if (isArray_1(value)) {
    return _arrayMap(value, baseToString) + '';
  }

  if (isSymbol_1(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}

var _baseToString = baseToString;

function toString(value) {
  return value == null ? '' : _baseToString(value);
}

var toString_1 = toString;

function castPath(value, object) {
  if (isArray_1(value)) {
    return value;
  }

  return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
}

var _castPath = castPath;

var INFINITY$1 = 1 / 0;

function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$1 ? '-0' : result;
}

var _toKey = toKey;

function baseGet(object, path) {
  path = _castPath(path, object);
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[_toKey(path[index++])];
  }

  return index && index == length ? object : undefined;
}

var _baseGet = baseGet;

function get(object, path, defaultValue) {
  var result = object == null ? undefined : _baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

var get_1 = get;

var defineProperty = function () {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}();

var _defineProperty = defineProperty;

function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty) {
    _defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

var objectProto$5 = Object.prototype;
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

function assignValue(object, key, value) {
  var objValue = object[key];

  if (!(hasOwnProperty$4.call(object, key) && eq_1(objValue, value)) || value === undefined && !(key in object)) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;

function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

var _isIndex = isIndex;

function baseSet(object, path, value, customizer) {
  if (!isObject_1(object)) {
    return object;
  }

  path = _castPath(path, object);
  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = _toKey(path[index]),
        newValue = value;

    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return object;
    }

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;

      if (newValue === undefined) {
        newValue = isObject_1(objValue) ? objValue : _isIndex(path[index + 1]) ? [] : {};
      }
    }

    _assignValue(nested, key, newValue);
    nested = nested[key];
  }

  return object;
}

var _baseSet = baseSet;

function set(object, path, value) {
  return object == null ? object : _baseSet(object, path, value);
}

var set_1 = set;

var sortDropdownNames = function sortDropdownNames(options, optionkey, locilizationkey) {
  return options.sort(function (a, b) {
    return locilizationkey(a[optionkey]).localeCompare(locilizationkey(b[optionkey]));
  });
};
var getTransaltedLocality = function getTransaltedLocality(data) {
  var _data$tenantId, _data$locality;

  var localityVariable = (data === null || data === void 0 ? void 0 : (_data$tenantId = data.tenantId) === null || _data$tenantId === void 0 ? void 0 : _data$tenantId.replaceAll(".", "_")) || stringReplaceAll(data === null || data === void 0 ? void 0 : data.tenantId, ".", "_");
  return localityVariable.toUpperCase() + "_REVENUE_" + (data === null || data === void 0 ? void 0 : (_data$locality = data.locality) === null || _data$locality === void 0 ? void 0 : _data$locality.code);
};
var getownerarray = function getownerarray(data) {
  var ownerarray = [];
  data === null || data === void 0 ? void 0 : data.owners.owners.map(function (ob) {
    var _data$owners;

    ownerarray.push({
      mobileNumber: ob.mobilenumber,
      name: ob.name,
      fatherOrHusbandName: "",
      relationship: "",
      dob: null,
      gender: ob.gender.code,
      permanentAddress: data === null || data === void 0 ? void 0 : (_data$owners = data.owners) === null || _data$owners === void 0 ? void 0 : _data$owners.permanentAddress
    });
  });
  return ownerarray;
};
var gettradeownerarray = function gettradeownerarray(data) {
  var _data$owners6;

  var tradeownerarray = [];
  var isEditRenew = window.location.href.includes("renew-trade");
  data.tradeLicenseDetail.owners.map(function (oldowner) {
    var _data$owners2;

    data === null || data === void 0 ? void 0 : (_data$owners2 = data.owners) === null || _data$owners2 === void 0 ? void 0 : _data$owners2.owners.map(function (newowner) {
      if (oldowner.id === newowner.id) {
        var _data$owners3;

        if (oldowner.name !== newowner.name || oldowner.gender !== newowner.gender.code || oldowner.mobileNumber !== newowner.mobilenumber || oldowner.permanentAddress !== (data === null || data === void 0 ? void 0 : (_data$owners3 = data.owners) === null || _data$owners3 === void 0 ? void 0 : _data$owners3.permanentAddress)) {
          var _data$owners4;

          if (oldowner.name !== newowner.name) {
            oldowner.name = newowner.name;
          }

          if (oldowner.gender !== newowner.gender.code) {
            oldowner.gender = newowner.gender.code;
          }

          if (oldowner.mobileNumber !== newowner.mobilenumber) {
            oldowner.mobileNumber = newowner.mobilenumber;
          }

          if (oldowner.permanentAddress !== (data === null || data === void 0 ? void 0 : (_data$owners4 = data.owners) === null || _data$owners4 === void 0 ? void 0 : _data$owners4.permanentAddress)) {
            var _data$owners5;

            oldowner.permanentAddress = data === null || data === void 0 ? void 0 : (_data$owners5 = data.owners) === null || _data$owners5 === void 0 ? void 0 : _data$owners5.permanentAddress;
          }

          var found = tradeownerarray.length > 0 ? tradeownerarray.some(function (el) {
            return el.id === oldowner.id;
          }) : false;
          if (!found) tradeownerarray.push(oldowner);
        } else {
          var _found = tradeownerarray.length > 0 ? tradeownerarray.some(function (el) {
            return el.id === oldowner.id;
          }) : false;

          if (!_found) tradeownerarray.push(oldowner);
        }
      }
    });
  });
  !isEditRenew && data.tradeLicenseDetail.owners.map(function (oldowner) {
    var found = tradeownerarray.length > 0 ? tradeownerarray.some(function (el) {
      return el.id === oldowner.id;
    }) : false;
    if (!found) tradeownerarray.push(_extends({}, oldowner, {
      active: false
    }));
  });
  data === null || data === void 0 ? void 0 : (_data$owners6 = data.owners) === null || _data$owners6 === void 0 ? void 0 : _data$owners6.owners.map(function (ob) {
    if (!ob.id) {
      var _data$owners7;

      tradeownerarray.push({
        mobileNumber: ob.mobilenumber,
        name: ob.name,
        fatherOrHusbandName: "",
        relationship: "",
        dob: null,
        gender: ob.gender.code,
        permanentAddress: data === null || data === void 0 ? void 0 : (_data$owners7 = data.owners) === null || _data$owners7 === void 0 ? void 0 : _data$owners7.permanentAddress
      });
    }
  });
  return tradeownerarray;
};
var gettradeunits = function gettradeunits(data) {
  var _data$TradeDetails;

  var tradeunits = [];
  data === null || data === void 0 ? void 0 : (_data$TradeDetails = data.TradeDetails) === null || _data$TradeDetails === void 0 ? void 0 : _data$TradeDetails.units.map(function (ob) {
    tradeunits.push({
      tradeType: ob.tradesubtype.code,
      uom: ob.unit,
      uomValue: ob.uom
    });
  });
  return tradeunits;
};
var gettradeupdateunits = function gettradeupdateunits(data) {
  var TLunits = [];
  var isEditRenew = window.location.href.includes("renew-trade");
  data.tradeLicenseDetail.tradeUnits.map(function (oldunit) {
    data.TradeDetails.units.map(function (newunit) {
      if (oldunit.id === newunit.id) {
        if (oldunit.tradeType !== newunit.tradesubtype.code) {
          oldunit.tradeType = newunit.tradesubtype.code;
          TLunits.push(oldunit);
        } else {
          var found = TLunits.length > 0 ? TLunits.some(function (el) {
            return el.id === oldunit.id;
          }) : false;
          if (!found) TLunits.push(oldunit);
        }
      } else {
        if (!isEditRenew) {
          var _found2 = TLunits.length > 0 ? TLunits.some(function (el) {
            return el.id === oldunit.id;
          }) : false;

          if (!_found2) TLunits.push(_extends({}, oldunit, {
            active: false
          }));
        }
      }
    });
  });
  data.TradeDetails.units.map(function (ob) {
    if (!ob.id) {
      TLunits.push({
        tradeType: ob.tradesubtype.code,
        uom: ob.unit,
        uomValue: ob.uom
      });
    }
  });
  return TLunits;
};
var getaccessories = function getaccessories(data) {
  var _data$TradeDetails2;

  var tradeaccessories = [];
  data === null || data === void 0 ? void 0 : (_data$TradeDetails2 = data.TradeDetails) === null || _data$TradeDetails2 === void 0 ? void 0 : _data$TradeDetails2.accessories.map(function (ob) {
    tradeaccessories.push({
      uom: ob.unit,
      accessoryCategory: ob.accessory.code,
      uomValue: ob.uom,
      count: ob.accessorycount
    });
  });
  return tradeaccessories;
};
var gettradeupdateaccessories = function gettradeupdateaccessories(data) {
  var _data$TradeDetails3, _data$TradeDetails3$i;

  var TLaccessories = [];
  var isEditRenew = window.location.href.includes("renew-trade");

  if (data !== null && data !== void 0 && (_data$TradeDetails3 = data.TradeDetails) !== null && _data$TradeDetails3 !== void 0 && (_data$TradeDetails3$i = _data$TradeDetails3.isAccessories) !== null && _data$TradeDetails3$i !== void 0 && _data$TradeDetails3$i.i18nKey.includes("NO")) {
    var _data$tradeLicenseDet;

    (data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet = data.tradeLicenseDetail) === null || _data$tradeLicenseDet === void 0 ? void 0 : _data$tradeLicenseDet.accessories) && data.tradeLicenseDetail.accessories.map(function (oldunit) {
      TLaccessories.push(_extends({}, oldunit, {
        active: false
      }));
    });
  } else {
    var _data$tradeLicenseDet2;

    (data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet2 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet2 === void 0 ? void 0 : _data$tradeLicenseDet2.accessories) && data.tradeLicenseDetail.accessories.map(function (oldunit) {
      data.TradeDetails.accessories.map(function (newunit) {
        if (oldunit.id === newunit.id) {
          if (oldunit.accessoryCategory !== newunit.accessory.code) {
            oldunit.accessoryCategory = newunit.accessory.code;
            TLaccessories.push(oldunit);
          } else {
            var found = TLaccessories.length > 0 ? TLaccessories.some(function (el) {
              return el.id === oldunit.id;
            }) : false;
            if (!found) TLaccessories.push(oldunit);
          }
        } else {
          if (!isEditRenew) {
            var _found3 = TLaccessories.length > 0 ? TLaccessories.some(function (el) {
              return el.id === oldunit.id;
            }) : false;

            if (!_found3) TLaccessories.push(_extends({}, oldunit, {
              active: false
            }));
          }
        }
      });
    });
    data.TradeDetails.accessories.map(function (ob) {
      if (!ob.id) {
        TLaccessories.push({
          uom: ob.unit,
          accessoryCategory: ob.accessory.code,
          uomValue: ob.uom,
          count: ob.accessorycount
        });
      }
    });
  }

  return TLaccessories;
};
var convertToTrade = function convertToTrade(data) {
  var _data, _data$TradeDetails4, _data2, _data2$address, _data2$address$city, _data3, _data3$address, _data3$address$city, _data4, _data4$address, _data4$address$locali, _data5, _data6, _data6$address, _data7, _data7$address, _data8, _data8$address, _data9, _data9$address, _data10, _data10$TradeDetails, _data11, _data11$TradeDetails, _data12, _data12$TradeDetails, _data13, _data13$TradeDetails, _data14, _data14$ownershipCate, _data15, _data15$TradeDetails;

  if (data === void 0) {
    data = {};
  }

  var Financialyear = sessionStorage.getItem("CurrentFinancialYear");
  var formdata = {
    Licenses: [{
      action: "INITIATE",
      applicationType: "NEW",
      commencementDate: Date.parse((_data = data) === null || _data === void 0 ? void 0 : (_data$TradeDetails4 = _data.TradeDetails) === null || _data$TradeDetails4 === void 0 ? void 0 : _data$TradeDetails4.CommencementDate),
      financialYear: Financialyear ? Financialyear : "2021-22",
      licenseType: "PERMANENT",
      tenantId: (_data2 = data) === null || _data2 === void 0 ? void 0 : (_data2$address = _data2.address) === null || _data2$address === void 0 ? void 0 : (_data2$address$city = _data2$address.city) === null || _data2$address$city === void 0 ? void 0 : _data2$address$city.code,
      tradeLicenseDetail: {
        channel: "CITIZEN",
        address: {
          city: (_data3 = data) === null || _data3 === void 0 ? void 0 : (_data3$address = _data3.address) === null || _data3$address === void 0 ? void 0 : (_data3$address$city = _data3$address.city) === null || _data3$address$city === void 0 ? void 0 : _data3$address$city.code,
          locality: {
            code: (_data4 = data) === null || _data4 === void 0 ? void 0 : (_data4$address = _data4.address) === null || _data4$address === void 0 ? void 0 : (_data4$address$locali = _data4$address.locality) === null || _data4$address$locali === void 0 ? void 0 : _data4$address$locali.code
          },
          tenantId: (_data5 = data) === null || _data5 === void 0 ? void 0 : _data5.tenantId,
          pincode: (_data6 = data) === null || _data6 === void 0 ? void 0 : (_data6$address = _data6.address) === null || _data6$address === void 0 ? void 0 : _data6$address.pincode,
          doorNo: (_data7 = data) === null || _data7 === void 0 ? void 0 : (_data7$address = _data7.address) === null || _data7$address === void 0 ? void 0 : _data7$address.doorNo,
          street: (_data8 = data) === null || _data8 === void 0 ? void 0 : (_data8$address = _data8.address) === null || _data8$address === void 0 ? void 0 : _data8$address.street,
          landmark: (_data9 = data) === null || _data9 === void 0 ? void 0 : (_data9$address = _data9.address) === null || _data9$address === void 0 ? void 0 : _data9$address.landmark
        },
        applicationDocuments: null,
        accessories: (_data10 = data) !== null && _data10 !== void 0 && (_data10$TradeDetails = _data10.TradeDetails) !== null && _data10$TradeDetails !== void 0 && _data10$TradeDetails.accessories ? getaccessories(data) : null,
        owners: getownerarray(data),
        structureType: ((_data11 = data) === null || _data11 === void 0 ? void 0 : (_data11$TradeDetails = _data11.TradeDetails) === null || _data11$TradeDetails === void 0 ? void 0 : _data11$TradeDetails.StructureType.code) !== "IMMOVABLE" ? (_data12 = data) === null || _data12 === void 0 ? void 0 : (_data12$TradeDetails = _data12.TradeDetails) === null || _data12$TradeDetails === void 0 ? void 0 : _data12$TradeDetails.VehicleType.code : (_data13 = data) === null || _data13 === void 0 ? void 0 : (_data13$TradeDetails = _data13.TradeDetails) === null || _data13$TradeDetails === void 0 ? void 0 : _data13$TradeDetails.BuildingType.code,
        subOwnerShipCategory: (_data14 = data) === null || _data14 === void 0 ? void 0 : (_data14$ownershipCate = _data14.ownershipCategory) === null || _data14$ownershipCate === void 0 ? void 0 : _data14$ownershipCate.code,
        tradeUnits: gettradeunits(data)
      },
      tradeName: (_data15 = data) === null || _data15 === void 0 ? void 0 : (_data15$TradeDetails = _data15.TradeDetails) === null || _data15$TradeDetails === void 0 ? void 0 : _data15$TradeDetails.TradeName,
      wfDocuments: [],
      applicationDocuments: [],
      workflowCode: "NewTL"
    }]
  };
  return formdata;
};
var getwfdocuments = function getwfdocuments(data) {
  var wfdoc = [];
  var doc = data ? data.owners.documents : [];
  doc["OwnerPhotoProof"] && wfdoc.push({
    fileName: doc["OwnerPhotoProof"].name,
    fileStoreId: doc["OwnerPhotoProof"].fileStoreId,
    documentType: "OWNERPHOTO",
    tenantId: data === null || data === void 0 ? void 0 : data.tenantId
  });
  doc["ProofOfIdentity"] && wfdoc.push({
    fileName: doc["ProofOfIdentity"].name,
    fileStoreId: doc["ProofOfIdentity"].fileStoreId,
    documentType: "OWNERIDPROOF",
    tenantId: data === null || data === void 0 ? void 0 : data.tenantId
  });
  doc["ProofOfOwnership"] && wfdoc.push({
    fileName: doc["ProofOfOwnership"].name,
    fileStoreId: doc["ProofOfOwnership"].fileStoreId,
    documentType: "OWNERSHIPPROOF",
    tenantId: data === null || data === void 0 ? void 0 : data.tenantId
  });
  return wfdoc;
};
var getEditTradeDocumentUpdate = function getEditTradeDocumentUpdate(data) {
  var updateddocuments = [];
  var doc = data ? data.owners.documents : [];
  data.tradeLicenseDetail.applicationDocuments.map(function (olddoc) {
    if (olddoc.documentType === "OWNERPHOTO" && olddoc.fileStoreId === data.owners.documents["OwnerPhotoProof"].fileStoreId || olddoc.documentType === "OWNERSHIPPROOF" && olddoc.fileStoreId == data.owners.documents["ProofOfOwnership"].fileStoreId || olddoc.documentType === "OWNERIDPROOF" && olddoc.fileStoreId === data.owners.documents["ProofOfIdentity"].fileStoreId) {
      updateddocuments.push(olddoc);
    } else {
      if (olddoc.documentType === "OWNERPHOTO" && olddoc.fileStoreId !== data.owners.documents["OwnerPhotoProof"].fileStoreId) {
        updateddocuments.push({
          fileName: doc["OwnerPhotoProof"].name,
          fileStoreId: doc["OwnerPhotoProof"].fileStoreId,
          documentType: "OWNERPHOTO",
          tenantId: data === null || data === void 0 ? void 0 : data.tenantId
        });
        updateddocuments.push(_extends({}, olddoc, {
          active: "false"
        }));
      }

      if (olddoc.documentType === "OWNERSHIPPROOF" && olddoc.fileStoreId !== data.owners.documents["ProofOfOwnership"].fileStoreId) {
        updateddocuments.push({
          fileName: doc["ProofOfOwnership"].name,
          fileStoreId: doc["ProofOfOwnership"].fileStoreId,
          documentType: "OWNERSHIPPROOF",
          tenantId: data === null || data === void 0 ? void 0 : data.tenantId
        });
        updateddocuments.push(_extends({}, olddoc, {
          active: "false"
        }));
      }

      if (olddoc.documentType === "OWNERIDPROOF" && olddoc.fileStoreId !== data.owners.documents["ProofOfIdentity"].fileStoreId) {
        updateddocuments.push({
          fileName: doc["ProofOfIdentity"].name,
          fileStoreId: doc["ProofOfIdentity"].fileStoreId,
          documentType: "OWNERIDPROOF",
          tenantId: data === null || data === void 0 ? void 0 : data.tenantId
        });
        updateddocuments.push(_extends({}, olddoc, {
          active: "false"
        }));
      }
    }
  });
  return updateddocuments;
};
var getEditRenewTradeDocumentUpdate = function getEditRenewTradeDocumentUpdate(data, datafromflow) {
  var updateddocuments = [];
  var doc = datafromflow ? datafromflow.owners.documents : [];
  data.tradeLicenseDetail.applicationDocuments.map(function (olddoc) {
    if (olddoc.documentType === "OWNERPHOTO" && olddoc.fileStoreId === datafromflow.owners.documents["OwnerPhotoProof"].fileStoreId || olddoc.documentType === "OWNERSHIPPROOF" && olddoc.fileStoreId == datafromflow.owners.documents["ProofOfOwnership"].fileStoreId || olddoc.documentType === "OWNERIDPROOF" && olddoc.fileStoreId === datafromflow.owners.documents["ProofOfIdentity"].fileStoreId) {
      updateddocuments.push(olddoc);
    } else {
      if (olddoc.documentType === "OWNERPHOTO" && olddoc.fileStoreId !== datafromflow.owners.documents["OwnerPhotoProof"].fileStoreId) {
        updateddocuments.push({
          fileName: doc["OwnerPhotoProof"].name,
          fileStoreId: doc["OwnerPhotoProof"].fileStoreId,
          documentType: "OWNERPHOTO",
          tenantId: data === null || data === void 0 ? void 0 : data.tenantId
        });
        updateddocuments.push(_extends({}, olddoc, {
          active: "false"
        }));
      }

      if (olddoc.documentType === "OWNERSHIPPROOF" && olddoc.fileStoreId !== datafromflow.owners.documents["ProofOfOwnership"].fileStoreId) {
        updateddocuments.push({
          fileName: doc["ProofOfOwnership"].name,
          fileStoreId: doc["ProofOfOwnership"].fileStoreId,
          documentType: "OWNERSHIPPROOF",
          tenantId: data === null || data === void 0 ? void 0 : data.tenantId
        });
        updateddocuments.push(_extends({}, olddoc, {
          active: "false"
        }));
      }

      if (olddoc.documentType === "OWNERIDPROOF" && olddoc.fileStoreId !== datafromflow.owners.documents["ProofOfIdentity"].fileStoreId) {
        updateddocuments.push({
          fileName: doc["ProofOfIdentity"].name,
          fileStoreId: doc["ProofOfIdentity"].fileStoreId,
          documentType: "OWNERIDPROOF",
          tenantId: data === null || data === void 0 ? void 0 : data.tenantId
        });
        updateddocuments.push(_extends({}, olddoc, {
          active: "false"
        }));
      }
    }
  });
  return updateddocuments;
};
var convertToUpdateTrade = function convertToUpdateTrade(data, datafromflow, tenantId) {
  var _data16;

  if (data === void 0) {
    data = {};
  }

  var isEdit = window.location.href.includes("renew-trade");
  var formdata1 = {
    Licenses: []
  };
  formdata1.Licenses[0] = _extends({}, data.Licenses[0]);
  formdata1.Licenses[0].action = "APPLY";
  formdata1.Licenses[0].wfDocuments = formdata1.Licenses[0].wfDocuments ? formdata1.Licenses[0].wfDocuments : [], formdata1.Licenses[0].tradeLicenseDetail.applicationDocuments = !isEdit ? formdata1.Licenses[0].tradeLicenseDetail.applicationDocuments ? formdata1.Licenses[0].tradeLicenseDetail.applicationDocuments : getwfdocuments(datafromflow) : getEditRenewTradeDocumentUpdate((_data16 = data) === null || _data16 === void 0 ? void 0 : _data16.Licenses[0], datafromflow), console.info("formdata1", formdata1);
  return formdata1;
};
var stringToBoolean = function stringToBoolean(value) {
  if (value) {
    switch (value.toLowerCase().trim()) {
      case "true":
      case "yes":
      case "1":
        return true;

      case "false":
      case "no":
      case "0":
      case null:
        return false;

      default:
        return Boolean(value);
    }
  } else {
    return Boolean(value);
  }
};
var convertToEditTrade = function convertToEditTrade(data, fy) {
  var _data$TradeDetails5, _data$TradeDetails6, _data$TradeDetails7, _data$ownershipCatego;

  if (fy === void 0) {
    fy = [];
  }

  var currrentFYending = fy.filter(function (item) {
    return item.code === (data === null || data === void 0 ? void 0 : data.financialYear);
  })[0].endingDate;
  var nextFinancialYearForRenewal = fy.filter(function (item) {
    return item.startingDate === currrentFYending;
  })[0].code;
  var isDirectrenewal = stringToBoolean(sessionStorage.getItem("isDirectRenewal"));
  var formdata = {
    Licenses: [{
      id: data === null || data === void 0 ? void 0 : data.id,
      tenantId: data === null || data === void 0 ? void 0 : data.tenantId,
      businessService: data === null || data === void 0 ? void 0 : data.businessService,
      licenseType: data === null || data === void 0 ? void 0 : data.licenseType,
      applicationType: "RENEWAL",
      workflowCode: isDirectrenewal ? "DIRECTRENEWAL" : "EDITRENEWAL",
      licenseNumber: data === null || data === void 0 ? void 0 : data.licenseNumber,
      applicationNumber: data === null || data === void 0 ? void 0 : data.applicationNumber,
      tradeName: data === null || data === void 0 ? void 0 : data.tradeName,
      applicationDate: data === null || data === void 0 ? void 0 : data.applicationDate,
      commencementDate: data === null || data === void 0 ? void 0 : data.commencementDate,
      issuedDate: data === null || data === void 0 ? void 0 : data.issuedDate,
      financialYear: nextFinancialYearForRenewal || "2020-21",
      validFrom: data === null || data === void 0 ? void 0 : data.validFrom,
      validTo: data === null || data === void 0 ? void 0 : data.validTo,
      action: "INITIATE",
      wfDocuments: data === null || data === void 0 ? void 0 : data.wfDocuments,
      status: data === null || data === void 0 ? void 0 : data.status,
      tradeLicenseDetail: {
        address: data.tradeLicenseDetail.address,
        applicationDocuments: data.tradeLicenseDetail.applicationDocuments,
        accessories: isDirectrenewal ? data.tradeLicenseDetail.accessories : gettradeupdateaccessories(data),
        owners: isDirectrenewal ? data.tradeLicenseDetail.owners : gettradeownerarray(data),
        structureType: isDirectrenewal ? data.tradeLicenseDetail.structureType : data !== null && data !== void 0 && (_data$TradeDetails5 = data.TradeDetails) !== null && _data$TradeDetails5 !== void 0 && _data$TradeDetails5.VehicleType ? data === null || data === void 0 ? void 0 : (_data$TradeDetails6 = data.TradeDetails) === null || _data$TradeDetails6 === void 0 ? void 0 : _data$TradeDetails6.VehicleType.code : data === null || data === void 0 ? void 0 : (_data$TradeDetails7 = data.TradeDetails) === null || _data$TradeDetails7 === void 0 ? void 0 : _data$TradeDetails7.BuildingType.code,
        subOwnerShipCategory: data === null || data === void 0 ? void 0 : (_data$ownershipCatego = data.ownershipCategory) === null || _data$ownershipCatego === void 0 ? void 0 : _data$ownershipCatego.code,
        tradeUnits: gettradeupdateunits(data),
        additionalDetail: data.tradeLicenseDetail.additionalDetail,
        auditDetails: data.tradeLicenseDetail.auditDetails,
        channel: data.tradeLicenseDetail.channel,
        id: data.tradeLicenseDetail.id,
        institution: data.tradeLicenseDetail.institution
      },
      calculation: null,
      auditDetails: data === null || data === void 0 ? void 0 : data.auditDetails,
      accountId: data === null || data === void 0 ? void 0 : data.accountId
    }]
  };
  console.log("formdata", formdata);
  return formdata;
};
var convertToResubmitTrade = function convertToResubmitTrade(data) {
  var _data$TradeDetails8, _data$TradeDetails9, _data$TradeDetails10, _data$ownershipCatego2;

  var formdata = {
    Licenses: [{
      id: data === null || data === void 0 ? void 0 : data.id,
      tenantId: data === null || data === void 0 ? void 0 : data.tenantId,
      businessService: data === null || data === void 0 ? void 0 : data.businessService,
      licenseType: data === null || data === void 0 ? void 0 : data.licenseType,
      applicationType: data.applicationType,
      workflowCode: data.workflowCode,
      licenseNumber: data === null || data === void 0 ? void 0 : data.licenseNumber,
      applicationNumber: data === null || data === void 0 ? void 0 : data.applicationNumber,
      tradeName: data === null || data === void 0 ? void 0 : data.tradeName,
      applicationDate: data === null || data === void 0 ? void 0 : data.applicationDate,
      commencementDate: data === null || data === void 0 ? void 0 : data.commencementDate,
      issuedDate: data === null || data === void 0 ? void 0 : data.issuedDate,
      financialYear: data === null || data === void 0 ? void 0 : data.financialYear,
      validFrom: data === null || data === void 0 ? void 0 : data.validFrom,
      validTo: data === null || data === void 0 ? void 0 : data.validTo,
      action: "FORWARD",
      wfDocuments: data === null || data === void 0 ? void 0 : data.wfDocuments,
      status: data === null || data === void 0 ? void 0 : data.status,
      tradeLicenseDetail: {
        address: data.tradeLicenseDetail.address,
        applicationDocuments: getEditTradeDocumentUpdate(data),
        accessories: gettradeupdateaccessories(data),
        owners: gettradeownerarray(data),
        structureType: data !== null && data !== void 0 && (_data$TradeDetails8 = data.TradeDetails) !== null && _data$TradeDetails8 !== void 0 && _data$TradeDetails8.VehicleType ? data === null || data === void 0 ? void 0 : (_data$TradeDetails9 = data.TradeDetails) === null || _data$TradeDetails9 === void 0 ? void 0 : _data$TradeDetails9.VehicleType.code : data === null || data === void 0 ? void 0 : (_data$TradeDetails10 = data.TradeDetails) === null || _data$TradeDetails10 === void 0 ? void 0 : _data$TradeDetails10.BuildingType.code,
        subOwnerShipCategory: data === null || data === void 0 ? void 0 : (_data$ownershipCatego2 = data.ownershipCategory) === null || _data$ownershipCatego2 === void 0 ? void 0 : _data$ownershipCatego2.code,
        tradeUnits: gettradeupdateunits(data),
        additionalDetail: data.tradeLicenseDetail.additionalDetail,
        auditDetails: data.tradeLicenseDetail.auditDetails,
        channel: data.tradeLicenseDetail.channel,
        id: data.tradeLicenseDetail.id,
        institution: data.tradeLicenseDetail.institution
      },
      calculation: null,
      auditDetails: data === null || data === void 0 ? void 0 : data.auditDetails,
      accountId: data === null || data === void 0 ? void 0 : data.accountId
    }]
  };
  return formdata;
};
var convertEpochToDateCitizen = function convertEpochToDateCitizen(dateEpoch) {
  if (dateEpoch) {
    var dateFromApi = new Date(dateEpoch);
    var month = dateFromApi.getMonth() + 1;
    var day = dateFromApi.getDate();
    var year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return day + "/" + month + "/" + year;
  } else {
    return null;
  }
};
var getCommencementDataFormat = function getCommencementDataFormat(date) {
  var newDate = new Date(date).getFullYear().toString() + "-" + (new Date(date).getMonth() + 1).toString() + "-" + new Date(date).getDate().toString();
  return newDate;
};
var pdfDownloadLink = function pdfDownloadLink(documents, fileStoreId, format) {
  if (documents === void 0) {
    documents = {};
  }

  if (fileStoreId === void 0) {
    fileStoreId = "";
  }

  var downloadLink = documents[fileStoreId] || "";
  var differentFormats = (downloadLink === null || downloadLink === void 0 ? void 0 : downloadLink.split(",")) || [];
  var fileURL = "";
  differentFormats.length > 0 && differentFormats.map(function (link) {
    if (!link.includes("large") && !link.includes("medium") && !link.includes("small")) {
      fileURL = link;
    }
  });
  return fileURL;
};
var pdfDocumentName = function pdfDocumentName(documentLink, index) {
  if (documentLink === void 0) {
    documentLink = "";
  }

  if (index === void 0) {
    index = 0;
  }

  var documentName = decodeURIComponent(documentLink.split("?")[0].split("/").pop().slice(13)) || "Document - " + (index + 1);
  return documentName;
};
var convertEpochToDate = function convertEpochToDate(dateEpoch) {
  if (dateEpoch) {
    var dateFromApi = new Date(dateEpoch);
    var month = dateFromApi.getMonth() + 1;
    var day = dateFromApi.getDate();
    var year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return year + "-" + month + "-" + day;
  } else {
    return null;
  }
};
var stringReplaceAll = function stringReplaceAll(str, searcher, replaceWith) {
  if (str === void 0) {
    str = "";
  }

  if (searcher === void 0) {
    searcher = "";
  }

  if (replaceWith === void 0) {
    replaceWith = "";
  }

  if (searcher == "") return str;

  while (str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }

  return str;
};
var getUniqueItemsFromArray = function getUniqueItemsFromArray(data, identifier) {
  var uniqueArray = [];
  var map = new Map();

  for (var _iterator = _createForOfIteratorHelperLoose(data), _step; !(_step = _iterator()).done;) {
    var item = _step.value;

    if (!map.has(item[identifier])) {
      map.set(item[identifier], true);
      uniqueArray.push(item);
    }
  }

  return uniqueArray;
};
var commonTransform = function commonTransform(object, path) {
  var data = get_1(object, path);
  var transformedData = {};
  data.map(function (a) {
    var splitList = a.code.split(".");
    var ipath = "";

    for (var i = 0; i < splitList.length; i += 1) {
      if (i != splitList.length - 1) {
        if (!(splitList[i] in (ipath === "" ? transformedData : get_1(transformedData, ipath)))) {
          set_1(transformedData, ipath === "" ? splitList[i] : ipath + "." + splitList[i], i < splitList.length - 2 ? {} : []);
        }
      } else {
        get_1(transformedData, ipath).push(a);
      }

      ipath = splitList.slice(0, i + 1).join(".");
    }
  });
  set_1(object, path, transformedData);
  return object;
};
var convertDateToEpoch = function convertDateToEpoch(dateString, dayStartOrEnd) {
  if (dayStartOrEnd === void 0) {
    dayStartOrEnd = "dayend";
  }

  try {
    var parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    var DateObj = new Date(Date.UTC(parts[1], parts[2] - 1, parts[3]));
    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());

    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }

    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};
var getQueryStringParams = function getQueryStringParams(query) {
  return query ? (/^[?#]/.test(query) ? query.slice(1) : query).split("&").reduce(function (params, param) {
    var _param$split = param.split("="),
        key = _param$split[0],
        value = _param$split[1];

    params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
    return params;
  }, {}) : {};
};
var getPattern = function getPattern(type) {
  switch (type) {
    case "Name":
      return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i;

    case "MobileNo":
      return /^[6789][0-9]{9}$/i;

    case "Amount":
      return /^[0-9]{0,8}$/i;

    case "NonZeroAmount":
      return /^[1-9][0-9]{0,7}$/i;

    case "DecimalNumber":
      return /^\d{0,8}(\.\d{1,2})?$/i;

    case "Email":
      return /^(?=^.{1,64}$)((([^<>()\[\]\\.,;:\s$*@'"]+(\.[^<>()\[\]\\.,;:\s@'"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/i;

    case "Address":
      return /^[^\$\"<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,500}$/i;

    case "PAN":
      return /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/i;

    case "TradeName":
      return /^[-@.\/#&+\w\s]*$/;

    case "Date":
      return /^[12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/i;

    case "UOMValue":
      return /^(0)*[1-9][0-9]{0,5}$/i;

    case "OperationalArea":
      return /^(0)*[1-9][0-9]{0,6}$/i;

    case "NoOfEmp":
      return /^(0)*[1-9][0-9]{0,6}$/i;

    case "GSTNo":
      return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/i;

    case "DoorHouseNo":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*:;“”‘’]{1,50}$/i;

    case "BuildingStreet":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,64}$/i;

    case "Pincode":
      return /^[1-9][0-9]{5}$/i;

    case "Landline":
      return /^[0-9]{11}$/i;

    case "PropertyID":
      return /^[a-zA-z0-9\s\\/\-]$/i;

    case "ElectricityConnNo":
      return /^.{1,15}$/i;

    case "DocumentNo":
      return /^[0-9]{1,15}$/i;

    case "eventName":
      return /^[^\$\"<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”]{1,65}$/i;

    case "eventDescription":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,500}$/i;

    case "cancelChallan":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,100}$/i;

    case "FireNOCNo":
      return /^[a-zA-Z0-9-]*$/i;

    case "consumerNo":
      return /^[a-zA-Z0-9/-]*$/i;

    case "AadharNo":
      return /^([0-9]){12}$/;

    case "ChequeNo":
      return /^(?!0{6})[0-9]{6}$/;

    case "Comments":
      return /^[^\$\"'<>?\\\\~`!@$%^()+={}\[\]*.:;“”‘’]{1,50}$/i;

    case "OldLicenceNo":
      return /^[a-zA-Z0-9-/]{0,64}$/;
  }
};
var checkForEmployee = function checkForEmployee(role) {
  var _userInfo$info;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var userInfo = Digit.UserService.getUser();
  var rolearray = userInfo === null || userInfo === void 0 ? void 0 : (_userInfo$info = userInfo.info) === null || _userInfo$info === void 0 ? void 0 : _userInfo$info.roles.filter(function (item) {
    if (item.code == role && item.tenantId === tenantId) return true;
  });
  return rolearray === null || rolearray === void 0 ? void 0 : rolearray.length;
};
var convertEpochToDateDMY = function convertEpochToDateDMY(dateEpoch) {
  if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
    return "NA";
  }

  var dateFromApi = new Date(dateEpoch);
  var month = dateFromApi.getMonth() + 1;
  var day = dateFromApi.getDate();
  var year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return day + "/" + month + "/" + year;
};

var TradeLicense = function TradeLicense(_ref) {
  var _Documentsob$TradeLic;

  var t = _ref.t,
      onSelect = _ref.onSelect;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", "TLDocuments"),
      isLoading = _Digit$Hooks$tl$useTr.isLoading,
      _Digit$Hooks$tl$useTr2 = _Digit$Hooks$tl$useTr.data,
      Documentsob = _Digit$Hooks$tl$useTr2 === void 0 ? {} : _Digit$Hooks$tl$useTr2;

  var docs = Documentsob === null || Documentsob === void 0 ? void 0 : (_Documentsob$TradeLic = Documentsob.TradeLicense) === null || _Documentsob$TradeLic === void 0 ? void 0 : _Documentsob$TradeLic.Documents;

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, t("TL_DOC_REQ_SCREEN_HEADER")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CardText, null, t("TL_DOC_REQ_SCREEN_TEXT")), /*#__PURE__*/React.createElement("div", null, isLoading && /*#__PURE__*/React.createElement(Loader, null), Array.isArray(docs) ? docs.map(function (_ref2, index) {
    var code = _ref2.code,
        dropdownData = _ref2.dropdownData;
    return /*#__PURE__*/React.createElement("div", {
      key: index
    }, /*#__PURE__*/React.createElement(CardSubHeader, null, t("TRADELICENSE_" + stringReplaceAll(code, ".", "_") + "_HEADING")), dropdownData.map(function (dropdownData) {
      return /*#__PURE__*/React.createElement(CardText, null, t("TRADELICENSE_" + stringReplaceAll(dropdownData === null || dropdownData === void 0 ? void 0 : dropdownData.code, ".", "_") + "_LABEL"));
    }));
  }) : console.log("error"))), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CS_COMMON_NEXT"),
    onSubmit: onSelect
  }))), /*#__PURE__*/React.createElement(CitizenInfoLabel, {
    info: t("CS_FILE_APPLICATION_INFO_LABEL"),
    text: t("TL_DOCUMENT_SIZE_INFO_MSG")
  }));
};

var TLSelectGeolocation = function TLSelectGeolocation(_ref) {
  var _formData$address, _formData$address2, _defaultConfig$Proper;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData;

  var _useState = useState((formData === null || formData === void 0 ? void 0 : (_formData$address = formData.address) === null || _formData$address === void 0 ? void 0 : _formData$address.pincode) || ""),
      pincode = _useState[0],
      setPincode = _useState[1];

  var _useState2 = useState((formData === null || formData === void 0 ? void 0 : (_formData$address2 = formData.address) === null || _formData$address2 === void 0 ? void 0 : _formData$address2.geoLocation) || {}),
      geoLocation = _useState2[0],
      setGeoLocation = _useState2[1];

  var tenants = Digit.Hooks.tl.useTenants();

  var _useState3 = useState(null),
      pincodeServicability = _useState3[0],
      setPincodeServicability = _useState3[1];

  var isEditProperty = window.location.href.includes("edit-application") || window.location.href.includes("renew-trade");
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$pt$usePr = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "MapConfig"),
      _Digit$Hooks$pt$usePr2 = _Digit$Hooks$pt$usePr.data,
      defaultConfig = _Digit$Hooks$pt$usePr2 === void 0 ? {} : _Digit$Hooks$pt$usePr2;

  var defaultcoord = defaultConfig === null || defaultConfig === void 0 ? void 0 : (_defaultConfig$Proper = defaultConfig.PropertyTax) === null || _defaultConfig$Proper === void 0 ? void 0 : _defaultConfig$Proper.MapConfig;
  var defaultcoord1 = defaultcoord ? defaultcoord[0] : {};

  var onSkip = function onSkip() {
    return onSelect();
  };

  var _onChange = function onChange(code, location) {
    setPincodeServicability(null);
    var foundValue = tenants === null || tenants === void 0 ? void 0 : tenants.find(function (obj) {
      var _obj$pincode;

      return (_obj$pincode = obj.pincode) === null || _obj$pincode === void 0 ? void 0 : _obj$pincode.find(function (item) {
        return item == code;
      });
    });

    if (!foundValue) {
      setPincodeServicability("TL_COMMON_PINCODE_NOT_SERVICABLE");
      setPincode("");
      setGeoLocation({});
    } else {
      setPincode(code);
      setGeoLocation(location);
    }
  };

  return /*#__PURE__*/React.createElement(LocationSearchCard, {
    header: t("TL_GEOLOCATION_HEADER"),
    cardText: t("TL_GEOLOCATION_TEXT"),
    nextText: t("CS_COMMON_NEXT"),
    skipAndContinueText: t("CORE_COMMON_SKIP_CONTINUE"),
    skip: onSkip,
    t: t,
    position: geoLocation,
    onSave: function onSave() {
      return onSelect(config.key, {
        geoLocation: geoLocation,
        pincode: pincode
      });
    },
    onChange: function onChange(code, location) {
      return _onChange(code, location);
    },
    disabled: pincode === "" || isEditProperty,
    forcedError: t(pincodeServicability),
    isPTDefault: true,
    PTdefaultcoord: defaultcoord1
  });
};

var lodash = createCommonjsModule(function (module, exports) {
  (function () {
    var undefined$1;
    var VERSION = '4.17.20';
    var LARGE_ARRAY_SIZE = 200;
    var CORE_ERROR_TEXT = 'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.',
        FUNC_ERROR_TEXT = 'Expected a function';
    var HASH_UNDEFINED = '__lodash_hash_undefined__';
    var MAX_MEMOIZE_SIZE = 500;
    var PLACEHOLDER = '__lodash_placeholder__';
    var CLONE_DEEP_FLAG = 1,
        CLONE_FLAT_FLAG = 2,
        CLONE_SYMBOLS_FLAG = 4;
    var COMPARE_PARTIAL_FLAG = 1,
        COMPARE_UNORDERED_FLAG = 2;
    var WRAP_BIND_FLAG = 1,
        WRAP_BIND_KEY_FLAG = 2,
        WRAP_CURRY_BOUND_FLAG = 4,
        WRAP_CURRY_FLAG = 8,
        WRAP_CURRY_RIGHT_FLAG = 16,
        WRAP_PARTIAL_FLAG = 32,
        WRAP_PARTIAL_RIGHT_FLAG = 64,
        WRAP_ARY_FLAG = 128,
        WRAP_REARG_FLAG = 256,
        WRAP_FLIP_FLAG = 512;
    var DEFAULT_TRUNC_LENGTH = 30,
        DEFAULT_TRUNC_OMISSION = '...';
    var HOT_COUNT = 800,
        HOT_SPAN = 16;
    var LAZY_FILTER_FLAG = 1,
        LAZY_MAP_FLAG = 2,
        LAZY_WHILE_FLAG = 3;
    var INFINITY = 1 / 0,
        MAX_SAFE_INTEGER = 9007199254740991,
        MAX_INTEGER = 1.7976931348623157e+308,
        NAN = 0 / 0;
    var MAX_ARRAY_LENGTH = 4294967295,
        MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
        HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
    var wrapFlags = [['ary', WRAP_ARY_FLAG], ['bind', WRAP_BIND_FLAG], ['bindKey', WRAP_BIND_KEY_FLAG], ['curry', WRAP_CURRY_FLAG], ['curryRight', WRAP_CURRY_RIGHT_FLAG], ['flip', WRAP_FLIP_FLAG], ['partial', WRAP_PARTIAL_FLAG], ['partialRight', WRAP_PARTIAL_RIGHT_FLAG], ['rearg', WRAP_REARG_FLAG]];
    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        asyncTag = '[object AsyncFunction]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        domExcTag = '[object DOMException]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        nullTag = '[object Null]',
        objectTag = '[object Object]',
        promiseTag = '[object Promise]',
        proxyTag = '[object Proxy]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        symbolTag = '[object Symbol]',
        undefinedTag = '[object Undefined]',
        weakMapTag = '[object WeakMap]',
        weakSetTag = '[object WeakSet]';
    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';
    var reEmptyStringLeading = /\b__p \+= '';/g,
        reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
        reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
    var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
        reUnescapedHtml = /[&<>"']/g,
        reHasEscapedHtml = RegExp(reEscapedHtml.source),
        reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
    var reEscape = /<%-([\s\S]+?)%>/g,
        reEvaluate = /<%([\s\S]+?)%>/g,
        reInterpolate = /<%=([\s\S]+?)%>/g;
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        reIsPlainProp = /^\w*$/,
        rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
        reHasRegExpChar = RegExp(reRegExpChar.source);
    var reTrim = /^\s+|\s+$/g,
        reTrimStart = /^\s+/,
        reTrimEnd = /\s+$/;
    var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
        reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
        reSplitDetails = /,? & /;
    var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
    var reEscapeChar = /\\(\\)?/g;
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
    var reFlags = /\w*$/;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsOctal = /^0o[0-7]+$/i;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
    var reNoMatch = /($^)/;
    var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
    var rsAstralRange = "\\ud800-\\udfff",
        rsComboMarksRange = "\\u0300-\\u036f",
        reComboHalfMarksRange = "\\ufe20-\\ufe2f",
        rsComboSymbolsRange = "\\u20d0-\\u20ff",
        rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
        rsDingbatRange = "\\u2700-\\u27bf",
        rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
        rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
        rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
        rsPunctuationRange = "\\u2000-\\u206f",
        rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
        rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
        rsVarRange = "\\ufe0e\\ufe0f",
        rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
    var rsApos = "['\u2019]",
        rsAstral = '[' + rsAstralRange + ']',
        rsBreak = '[' + rsBreakRange + ']',
        rsCombo = '[' + rsComboRange + ']',
        rsDigits = '\\d+',
        rsDingbat = '[' + rsDingbatRange + ']',
        rsLower = '[' + rsLowerRange + ']',
        rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
        rsFitz = "\\ud83c[\\udffb-\\udfff]",
        rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
        rsNonAstral = '[^' + rsAstralRange + ']',
        rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}",
        rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]",
        rsUpper = '[' + rsUpperRange + ']',
        rsZWJ = "\\u200d";
    var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
        rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
        rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
        rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
        reOptMod = rsModifier + '?',
        rsOptVar = '[' + rsVarRange + ']?',
        rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
        rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
        rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
        rsSeq = rsOptVar + reOptMod + rsOptJoin,
        rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq,
        rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
    var reApos = RegExp(rsApos, 'g');
    var reComboMark = RegExp(rsCombo, 'g');
    var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');
    var reUnicodeWord = RegExp([rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')', rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')', rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower, rsUpper + '+' + rsOptContrUpper, rsOrdUpper, rsOrdLower, rsDigits, rsEmoji].join('|'), 'g');
    var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']');
    var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
    var contextProps = ['Array', 'Buffer', 'DataView', 'Date', 'Error', 'Float32Array', 'Float64Array', 'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Map', 'Math', 'Object', 'Promise', 'RegExp', 'Set', 'String', 'Symbol', 'TypeError', 'Uint8Array', 'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap', '_', 'clearTimeout', 'isFinite', 'parseInt', 'setTimeout'];
    var templateCounter = -1;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
    var deburredLetters = {
      '\xc0': 'A',
      '\xc1': 'A',
      '\xc2': 'A',
      '\xc3': 'A',
      '\xc4': 'A',
      '\xc5': 'A',
      '\xe0': 'a',
      '\xe1': 'a',
      '\xe2': 'a',
      '\xe3': 'a',
      '\xe4': 'a',
      '\xe5': 'a',
      '\xc7': 'C',
      '\xe7': 'c',
      '\xd0': 'D',
      '\xf0': 'd',
      '\xc8': 'E',
      '\xc9': 'E',
      '\xca': 'E',
      '\xcb': 'E',
      '\xe8': 'e',
      '\xe9': 'e',
      '\xea': 'e',
      '\xeb': 'e',
      '\xcc': 'I',
      '\xcd': 'I',
      '\xce': 'I',
      '\xcf': 'I',
      '\xec': 'i',
      '\xed': 'i',
      '\xee': 'i',
      '\xef': 'i',
      '\xd1': 'N',
      '\xf1': 'n',
      '\xd2': 'O',
      '\xd3': 'O',
      '\xd4': 'O',
      '\xd5': 'O',
      '\xd6': 'O',
      '\xd8': 'O',
      '\xf2': 'o',
      '\xf3': 'o',
      '\xf4': 'o',
      '\xf5': 'o',
      '\xf6': 'o',
      '\xf8': 'o',
      '\xd9': 'U',
      '\xda': 'U',
      '\xdb': 'U',
      '\xdc': 'U',
      '\xf9': 'u',
      '\xfa': 'u',
      '\xfb': 'u',
      '\xfc': 'u',
      '\xdd': 'Y',
      '\xfd': 'y',
      '\xff': 'y',
      '\xc6': 'Ae',
      '\xe6': 'ae',
      '\xde': 'Th',
      '\xfe': 'th',
      '\xdf': 'ss',
      "\u0100": 'A',
      "\u0102": 'A',
      "\u0104": 'A',
      "\u0101": 'a',
      "\u0103": 'a',
      "\u0105": 'a',
      "\u0106": 'C',
      "\u0108": 'C',
      "\u010A": 'C',
      "\u010C": 'C',
      "\u0107": 'c',
      "\u0109": 'c',
      "\u010B": 'c',
      "\u010D": 'c',
      "\u010E": 'D',
      "\u0110": 'D',
      "\u010F": 'd',
      "\u0111": 'd',
      "\u0112": 'E',
      "\u0114": 'E',
      "\u0116": 'E',
      "\u0118": 'E',
      "\u011A": 'E',
      "\u0113": 'e',
      "\u0115": 'e',
      "\u0117": 'e',
      "\u0119": 'e',
      "\u011B": 'e',
      "\u011C": 'G',
      "\u011E": 'G',
      "\u0120": 'G',
      "\u0122": 'G',
      "\u011D": 'g',
      "\u011F": 'g',
      "\u0121": 'g',
      "\u0123": 'g',
      "\u0124": 'H',
      "\u0126": 'H',
      "\u0125": 'h',
      "\u0127": 'h',
      "\u0128": 'I',
      "\u012A": 'I',
      "\u012C": 'I',
      "\u012E": 'I',
      "\u0130": 'I',
      "\u0129": 'i',
      "\u012B": 'i',
      "\u012D": 'i',
      "\u012F": 'i',
      "\u0131": 'i',
      "\u0134": 'J',
      "\u0135": 'j',
      "\u0136": 'K',
      "\u0137": 'k',
      "\u0138": 'k',
      "\u0139": 'L',
      "\u013B": 'L',
      "\u013D": 'L',
      "\u013F": 'L',
      "\u0141": 'L',
      "\u013A": 'l',
      "\u013C": 'l',
      "\u013E": 'l',
      "\u0140": 'l',
      "\u0142": 'l',
      "\u0143": 'N',
      "\u0145": 'N',
      "\u0147": 'N',
      "\u014A": 'N',
      "\u0144": 'n',
      "\u0146": 'n',
      "\u0148": 'n',
      "\u014B": 'n',
      "\u014C": 'O',
      "\u014E": 'O',
      "\u0150": 'O',
      "\u014D": 'o',
      "\u014F": 'o',
      "\u0151": 'o',
      "\u0154": 'R',
      "\u0156": 'R',
      "\u0158": 'R',
      "\u0155": 'r',
      "\u0157": 'r',
      "\u0159": 'r',
      "\u015A": 'S',
      "\u015C": 'S',
      "\u015E": 'S',
      "\u0160": 'S',
      "\u015B": 's',
      "\u015D": 's',
      "\u015F": 's',
      "\u0161": 's',
      "\u0162": 'T',
      "\u0164": 'T',
      "\u0166": 'T',
      "\u0163": 't',
      "\u0165": 't',
      "\u0167": 't',
      "\u0168": 'U',
      "\u016A": 'U',
      "\u016C": 'U',
      "\u016E": 'U',
      "\u0170": 'U',
      "\u0172": 'U',
      "\u0169": 'u',
      "\u016B": 'u',
      "\u016D": 'u',
      "\u016F": 'u',
      "\u0171": 'u',
      "\u0173": 'u',
      "\u0174": 'W',
      "\u0175": 'w',
      "\u0176": 'Y',
      "\u0177": 'y',
      "\u0178": 'Y',
      "\u0179": 'Z',
      "\u017B": 'Z',
      "\u017D": 'Z',
      "\u017A": 'z',
      "\u017C": 'z',
      "\u017E": 'z',
      "\u0132": 'IJ',
      "\u0133": 'ij',
      "\u0152": 'Oe',
      "\u0153": 'oe',
      "\u0149": "'n",
      "\u017F": 's'
    };
    var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    var htmlUnescapes = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'"
    };
    var stringEscapes = {
      '\\': '\\',
      "'": "'",
      '\n': 'n',
      '\r': 'r',
      "\u2028": 'u2028',
      "\u2029": 'u2029'
    };
    var freeParseFloat = parseFloat,
        freeParseInt = parseInt;
    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function('return this')();
    var freeExports =  exports && !exports.nodeType && exports;
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;

    var nodeUtil = function () {
      try {
        var types = freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        }

        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }();

    var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer,
        nodeIsDate = nodeUtil && nodeUtil.isDate,
        nodeIsMap = nodeUtil && nodeUtil.isMap,
        nodeIsRegExp = nodeUtil && nodeUtil.isRegExp,
        nodeIsSet = nodeUtil && nodeUtil.isSet,
        nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);

        case 1:
          return func.call(thisArg, args[0]);

        case 2:
          return func.call(thisArg, args[0], args[1]);

        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }

      return func.apply(thisArg, args);
    }

    function arrayAggregator(array, setter, iteratee, accumulator) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        var value = array[index];
        setter(accumulator, value, iteratee(value), array);
      }

      return accumulator;
    }

    function arrayEach(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }

      return array;
    }

    function arrayEachRight(array, iteratee) {
      var length = array == null ? 0 : array.length;

      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }

      return array;
    }

    function arrayEvery(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }

      return true;
    }

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

    function arrayIncludes(array, value) {
      var length = array == null ? 0 : array.length;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }

    function arrayIncludesWith(array, value, comparator) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }

      return false;
    }

    function arrayMap(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }

      return result;
    }

    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }

      return array;
    }

    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1,
          length = array == null ? 0 : array.length;

      if (initAccum && length) {
        accumulator = array[++index];
      }

      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }

      return accumulator;
    }

    function arrayReduceRight(array, iteratee, accumulator, initAccum) {
      var length = array == null ? 0 : array.length;

      if (initAccum && length) {
        accumulator = array[--length];
      }

      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }

      return accumulator;
    }

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

    var asciiSize = baseProperty('length');

    function asciiToArray(string) {
      return string.split('');
    }

    function asciiWords(string) {
      return string.match(reAsciiWord) || [];
    }

    function baseFindKey(collection, predicate, eachFunc) {
      var result;
      eachFunc(collection, function (value, key, collection) {
        if (predicate(value, key, collection)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length,
          index = fromIndex + (fromRight ? 1 : -1);

      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }

      return -1;
    }

    function baseIndexOf(array, value, fromIndex) {
      return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
    }

    function baseIndexOfWith(array, value, fromIndex, comparator) {
      var index = fromIndex - 1,
          length = array.length;

      while (++index < length) {
        if (comparator(array[index], value)) {
          return index;
        }
      }

      return -1;
    }

    function baseIsNaN(value) {
      return value !== value;
    }

    function baseMean(array, iteratee) {
      var length = array == null ? 0 : array.length;
      return length ? baseSum(array, iteratee) / length : NAN;
    }

    function baseProperty(key) {
      return function (object) {
        return object == null ? undefined$1 : object[key];
      };
    }

    function basePropertyOf(object) {
      return function (key) {
        return object == null ? undefined$1 : object[key];
      };
    }

    function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
      eachFunc(collection, function (value, index, collection) {
        accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection);
      });
      return accumulator;
    }

    function baseSortBy(array, comparer) {
      var length = array.length;
      array.sort(comparer);

      while (length--) {
        array[length] = array[length].value;
      }

      return array;
    }

    function baseSum(array, iteratee) {
      var result,
          index = -1,
          length = array.length;

      while (++index < length) {
        var current = iteratee(array[index]);

        if (current !== undefined$1) {
          result = result === undefined$1 ? current : result + current;
        }
      }

      return result;
    }

    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }

      return result;
    }

    function baseToPairs(object, props) {
      return arrayMap(props, function (key) {
        return [key, object[key]];
      });
    }

    function baseUnary(func) {
      return function (value) {
        return func(value);
      };
    }

    function baseValues(object, props) {
      return arrayMap(props, function (key) {
        return object[key];
      });
    }

    function cacheHas(cache, key) {
      return cache.has(key);
    }

    function charsStartIndex(strSymbols, chrSymbols) {
      var index = -1,
          length = strSymbols.length;

      while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

      return index;
    }

    function charsEndIndex(strSymbols, chrSymbols) {
      var index = strSymbols.length;

      while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

      return index;
    }

    function countHolders(array, placeholder) {
      var length = array.length,
          result = 0;

      while (length--) {
        if (array[length] === placeholder) {
          ++result;
        }
      }

      return result;
    }

    var deburrLetter = basePropertyOf(deburredLetters);
    var escapeHtmlChar = basePropertyOf(htmlEscapes);

    function escapeStringChar(chr) {
      return '\\' + stringEscapes[chr];
    }

    function getValue(object, key) {
      return object == null ? undefined$1 : object[key];
    }

    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }

    function hasUnicodeWord(string) {
      return reHasUnicodeWord.test(string);
    }

    function iteratorToArray(iterator) {
      var data,
          result = [];

      while (!(data = iterator.next()).done) {
        result.push(data.value);
      }

      return result;
    }

    function mapToArray(map) {
      var index = -1,
          result = Array(map.size);
      map.forEach(function (value, key) {
        result[++index] = [key, value];
      });
      return result;
    }

    function overArg(func, transform) {
      return function (arg) {
        return func(transform(arg));
      };
    }

    function replaceHolders(array, placeholder) {
      var index = -1,
          length = array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];

        if (value === placeholder || value === PLACEHOLDER) {
          array[index] = PLACEHOLDER;
          result[resIndex++] = index;
        }
      }

      return result;
    }

    function setToArray(set) {
      var index = -1,
          result = Array(set.size);
      set.forEach(function (value) {
        result[++index] = value;
      });
      return result;
    }

    function setToPairs(set) {
      var index = -1,
          result = Array(set.size);
      set.forEach(function (value) {
        result[++index] = [value, value];
      });
      return result;
    }

    function strictIndexOf(array, value, fromIndex) {
      var index = fromIndex - 1,
          length = array.length;

      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }

      return -1;
    }

    function strictLastIndexOf(array, value, fromIndex) {
      var index = fromIndex + 1;

      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }

      return index;
    }

    function stringSize(string) {
      return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
    }

    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }

    var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

    function unicodeSize(string) {
      var result = reUnicode.lastIndex = 0;

      while (reUnicode.test(string)) {
        ++result;
      }

      return result;
    }

    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }

    function unicodeWords(string) {
      return string.match(reUnicodeWord) || [];
    }

    var runInContext = function runInContext(context) {
      context = context == null ? root : _.defaults(root.Object(), context, _.pick(root, contextProps));
      var Array = context.Array,
          Date = context.Date,
          Error = context.Error,
          Function = context.Function,
          Math = context.Math,
          Object = context.Object,
          RegExp = context.RegExp,
          String = context.String,
          TypeError = context.TypeError;
      var arrayProto = Array.prototype,
          funcProto = Function.prototype,
          objectProto = Object.prototype;
      var coreJsData = context['__core-js_shared__'];
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var idCounter = 0;

      var maskSrcKey = function () {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
        return uid ? 'Symbol(src)_1.' + uid : '';
      }();

      var nativeObjectToString = objectProto.toString;
      var objectCtorString = funcToString.call(Object);
      var oldDash = root._;
      var reIsNative = RegExp('^' + funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
      var Buffer = moduleExports ? context.Buffer : undefined$1,
          Symbol = context.Symbol,
          Uint8Array = context.Uint8Array,
          allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined$1,
          getPrototype = overArg(Object.getPrototypeOf, Object),
          objectCreate = Object.create,
          propertyIsEnumerable = objectProto.propertyIsEnumerable,
          splice = arrayProto.splice,
          spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined$1,
          symIterator = Symbol ? Symbol.iterator : undefined$1,
          symToStringTag = Symbol ? Symbol.toStringTag : undefined$1;

      var defineProperty = function () {
        try {
          var func = getNative(Object, 'defineProperty');
          func({}, '', {});
          return func;
        } catch (e) {}
      }();

      var ctxClearTimeout = context.clearTimeout !== root.clearTimeout && context.clearTimeout,
          ctxNow = Date && Date.now !== root.Date.now && Date.now,
          ctxSetTimeout = context.setTimeout !== root.setTimeout && context.setTimeout;
      var nativeCeil = Math.ceil,
          nativeFloor = Math.floor,
          nativeGetSymbols = Object.getOwnPropertySymbols,
          nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined$1,
          nativeIsFinite = context.isFinite,
          nativeJoin = arrayProto.join,
          nativeKeys = overArg(Object.keys, Object),
          nativeMax = Math.max,
          nativeMin = Math.min,
          nativeNow = Date.now,
          nativeParseInt = context.parseInt,
          nativeRandom = Math.random,
          nativeReverse = arrayProto.reverse;
      var DataView = getNative(context, 'DataView'),
          Map = getNative(context, 'Map'),
          Promise = getNative(context, 'Promise'),
          Set = getNative(context, 'Set'),
          WeakMap = getNative(context, 'WeakMap'),
          nativeCreate = getNative(Object, 'create');
      var metaMap = WeakMap && new WeakMap();
      var realNames = {};
      var dataViewCtorString = toSource(DataView),
          mapCtorString = toSource(Map),
          promiseCtorString = toSource(Promise),
          setCtorString = toSource(Set),
          weakMapCtorString = toSource(WeakMap);
      var symbolProto = Symbol ? Symbol.prototype : undefined$1,
          symbolValueOf = symbolProto ? symbolProto.valueOf : undefined$1,
          symbolToString = symbolProto ? symbolProto.toString : undefined$1;

      function lodash(value) {
        if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
          if (value instanceof LodashWrapper) {
            return value;
          }

          if (hasOwnProperty.call(value, '__wrapped__')) {
            return wrapperClone(value);
          }
        }

        return new LodashWrapper(value);
      }

      var baseCreate = function () {
        function object() {}

        return function (proto) {
          if (!isObject(proto)) {
            return {};
          }

          if (objectCreate) {
            return objectCreate(proto);
          }

          object.prototype = proto;
          var result = new object();
          object.prototype = undefined$1;
          return result;
        };
      }();

      function baseLodash() {}

      function LodashWrapper(value, chainAll) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__chain__ = !!chainAll;
        this.__index__ = 0;
        this.__values__ = undefined$1;
      }

      lodash.templateSettings = {
        'escape': reEscape,
        'evaluate': reEvaluate,
        'interpolate': reInterpolate,
        'variable': '',
        'imports': {
          '_': lodash
        }
      };
      lodash.prototype = baseLodash.prototype;
      lodash.prototype.constructor = lodash;
      LodashWrapper.prototype = baseCreate(baseLodash.prototype);
      LodashWrapper.prototype.constructor = LodashWrapper;

      function LazyWrapper(value) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__dir__ = 1;
        this.__filtered__ = false;
        this.__iteratees__ = [];
        this.__takeCount__ = MAX_ARRAY_LENGTH;
        this.__views__ = [];
      }

      function lazyClone() {
        var result = new LazyWrapper(this.__wrapped__);
        result.__actions__ = copyArray(this.__actions__);
        result.__dir__ = this.__dir__;
        result.__filtered__ = this.__filtered__;
        result.__iteratees__ = copyArray(this.__iteratees__);
        result.__takeCount__ = this.__takeCount__;
        result.__views__ = copyArray(this.__views__);
        return result;
      }

      function lazyReverse() {
        if (this.__filtered__) {
          var result = new LazyWrapper(this);
          result.__dir__ = -1;
          result.__filtered__ = true;
        } else {
          result = this.clone();
          result.__dir__ *= -1;
        }

        return result;
      }

      function lazyValue() {
        var array = this.__wrapped__.value(),
            dir = this.__dir__,
            isArr = isArray(array),
            isRight = dir < 0,
            arrLength = isArr ? array.length : 0,
            view = getView(0, arrLength, this.__views__),
            start = view.start,
            end = view.end,
            length = end - start,
            index = isRight ? end : start - 1,
            iteratees = this.__iteratees__,
            iterLength = iteratees.length,
            resIndex = 0,
            takeCount = nativeMin(length, this.__takeCount__);

        if (!isArr || !isRight && arrLength == length && takeCount == length) {
          return baseWrapperValue(array, this.__actions__);
        }

        var result = [];

        outer: while (length-- && resIndex < takeCount) {
          index += dir;
          var iterIndex = -1,
              value = array[index];

          while (++iterIndex < iterLength) {
            var data = iteratees[iterIndex],
                iteratee = data.iteratee,
                type = data.type,
                computed = iteratee(value);

            if (type == LAZY_MAP_FLAG) {
              value = computed;
            } else if (!computed) {
              if (type == LAZY_FILTER_FLAG) {
                continue outer;
              } else {
                break outer;
              }
            }
          }

          result[resIndex++] = value;
        }

        return result;
      }

      LazyWrapper.prototype = baseCreate(baseLodash.prototype);
      LazyWrapper.prototype.constructor = LazyWrapper;

      function Hash(entries) {
        var index = -1,
            length = entries == null ? 0 : entries.length;
        this.clear();

        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }

      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }

      function hashDelete(key) {
        var result = this.has(key) && delete this.__data__[key];
        this.size -= result ? 1 : 0;
        return result;
      }

      function hashGet(key) {
        var data = this.__data__;

        if (nativeCreate) {
          var result = data[key];
          return result === HASH_UNDEFINED ? undefined$1 : result;
        }

        return hasOwnProperty.call(data, key) ? data[key] : undefined$1;
      }

      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== undefined$1 : hasOwnProperty.call(data, key);
      }

      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value === undefined$1 ? HASH_UNDEFINED : value;
        return this;
      }

      Hash.prototype.clear = hashClear;
      Hash.prototype['delete'] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;

      function ListCache(entries) {
        var index = -1,
            length = entries == null ? 0 : entries.length;
        this.clear();

        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }

      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }

      function listCacheDelete(key) {
        var data = this.__data__,
            index = assocIndexOf(data, key);

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

      function listCacheGet(key) {
        var data = this.__data__,
            index = assocIndexOf(data, key);
        return index < 0 ? undefined$1 : data[index][1];
      }

      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }

      function listCacheSet(key, value) {
        var data = this.__data__,
            index = assocIndexOf(data, key);

        if (index < 0) {
          ++this.size;
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }

        return this;
      }

      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype['delete'] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;

      function MapCache(entries) {
        var index = -1,
            length = entries == null ? 0 : entries.length;
        this.clear();

        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }

      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          'hash': new Hash(),
          'map': new (Map || ListCache)(),
          'string': new Hash()
        };
      }

      function mapCacheDelete(key) {
        var result = getMapData(this, key)['delete'](key);
        this.size -= result ? 1 : 0;
        return result;
      }

      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }

      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }

      function mapCacheSet(key, value) {
        var data = getMapData(this, key),
            size = data.size;
        data.set(key, value);
        this.size += data.size == size ? 0 : 1;
        return this;
      }

      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype['delete'] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;

      function SetCache(values) {
        var index = -1,
            length = values == null ? 0 : values.length;
        this.__data__ = new MapCache();

        while (++index < length) {
          this.add(values[index]);
        }
      }

      function setCacheAdd(value) {
        this.__data__.set(value, HASH_UNDEFINED);

        return this;
      }

      function setCacheHas(value) {
        return this.__data__.has(value);
      }

      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;

      function Stack(entries) {
        var data = this.__data__ = new ListCache(entries);
        this.size = data.size;
      }

      function stackClear() {
        this.__data__ = new ListCache();
        this.size = 0;
      }

      function stackDelete(key) {
        var data = this.__data__,
            result = data['delete'](key);
        this.size = data.size;
        return result;
      }

      function stackGet(key) {
        return this.__data__.get(key);
      }

      function stackHas(key) {
        return this.__data__.has(key);
      }

      function stackSet(key, value) {
        var data = this.__data__;

        if (data instanceof ListCache) {
          var pairs = data.__data__;

          if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key, value]);
            this.size = ++data.size;
            return this;
          }

          data = this.__data__ = new MapCache(pairs);
        }

        data.set(key, value);
        this.size = data.size;
        return this;
      }

      Stack.prototype.clear = stackClear;
      Stack.prototype['delete'] = stackDelete;
      Stack.prototype.get = stackGet;
      Stack.prototype.has = stackHas;
      Stack.prototype.set = stackSet;

      function arrayLikeKeys(value, inherited) {
        var isArr = isArray(value),
            isArg = !isArr && isArguments(value),
            isBuff = !isArr && !isArg && isBuffer(value),
            isType = !isArr && !isArg && !isBuff && isTypedArray(value),
            skipIndexes = isArr || isArg || isBuff || isType,
            result = skipIndexes ? baseTimes(value.length, String) : [],
            length = result.length;

        for (var key in value) {
          if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == 'length' || isBuff && (key == 'offset' || key == 'parent') || isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || isIndex(key, length)))) {
            result.push(key);
          }
        }

        return result;
      }

      function arraySample(array) {
        var length = array.length;
        return length ? array[baseRandom(0, length - 1)] : undefined$1;
      }

      function arraySampleSize(array, n) {
        return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
      }

      function arrayShuffle(array) {
        return shuffleSelf(copyArray(array));
      }

      function assignMergeValue(object, key, value) {
        if (value !== undefined$1 && !eq(object[key], value) || value === undefined$1 && !(key in object)) {
          baseAssignValue(object, key, value);
        }
      }

      function assignValue(object, key, value) {
        var objValue = object[key];

        if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined$1 && !(key in object)) {
          baseAssignValue(object, key, value);
        }
      }

      function assocIndexOf(array, key) {
        var length = array.length;

        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }

        return -1;
      }

      function baseAggregator(collection, setter, iteratee, accumulator) {
        baseEach(collection, function (value, key, collection) {
          setter(accumulator, value, iteratee(value), collection);
        });
        return accumulator;
      }

      function baseAssign(object, source) {
        return object && copyObject(source, keys(source), object);
      }

      function baseAssignIn(object, source) {
        return object && copyObject(source, keysIn(source), object);
      }

      function baseAssignValue(object, key, value) {
        if (key == '__proto__' && defineProperty) {
          defineProperty(object, key, {
            'configurable': true,
            'enumerable': true,
            'value': value,
            'writable': true
          });
        } else {
          object[key] = value;
        }
      }

      function baseAt(object, paths) {
        var index = -1,
            length = paths.length,
            result = Array(length),
            skip = object == null;

        while (++index < length) {
          result[index] = skip ? undefined$1 : get(object, paths[index]);
        }

        return result;
      }

      function baseClamp(number, lower, upper) {
        if (number === number) {
          if (upper !== undefined$1) {
            number = number <= upper ? number : upper;
          }

          if (lower !== undefined$1) {
            number = number >= lower ? number : lower;
          }
        }

        return number;
      }

      function baseClone(value, bitmask, customizer, key, object, stack) {
        var result,
            isDeep = bitmask & CLONE_DEEP_FLAG,
            isFlat = bitmask & CLONE_FLAT_FLAG,
            isFull = bitmask & CLONE_SYMBOLS_FLAG;

        if (customizer) {
          result = object ? customizer(value, key, object, stack) : customizer(value);
        }

        if (result !== undefined$1) {
          return result;
        }

        if (!isObject(value)) {
          return value;
        }

        var isArr = isArray(value);

        if (isArr) {
          result = initCloneArray(value);

          if (!isDeep) {
            return copyArray(value, result);
          }
        } else {
          var tag = getTag(value),
              isFunc = tag == funcTag || tag == genTag;

          if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
          }

          if (tag == objectTag || tag == argsTag || isFunc && !object) {
            result = isFlat || isFunc ? {} : initCloneObject(value);

            if (!isDeep) {
              return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
            }
          } else {
            if (!cloneableTags[tag]) {
              return object ? value : {};
            }

            result = initCloneByTag(value, tag, isDeep);
          }
        }

        stack || (stack = new Stack());
        var stacked = stack.get(value);

        if (stacked) {
          return stacked;
        }

        stack.set(value, result);

        if (isSet(value)) {
          value.forEach(function (subValue) {
            result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
          });
        } else if (isMap(value)) {
          value.forEach(function (subValue, key) {
            result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
          });
        }

        var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
        var props = isArr ? undefined$1 : keysFunc(value);
        arrayEach(props || value, function (subValue, key) {
          if (props) {
            key = subValue;
            subValue = value[key];
          }

          assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
        });
        return result;
      }

      function baseConforms(source) {
        var props = keys(source);
        return function (object) {
          return baseConformsTo(object, source, props);
        };
      }

      function baseConformsTo(object, source, props) {
        var length = props.length;

        if (object == null) {
          return !length;
        }

        object = Object(object);

        while (length--) {
          var key = props[length],
              predicate = source[key],
              value = object[key];

          if (value === undefined$1 && !(key in object) || !predicate(value)) {
            return false;
          }
        }

        return true;
      }

      function baseDelay(func, wait, args) {
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }

        return setTimeout(function () {
          func.apply(undefined$1, args);
        }, wait);
      }

      function baseDifference(array, values, iteratee, comparator) {
        var index = -1,
            includes = arrayIncludes,
            isCommon = true,
            length = array.length,
            result = [],
            valuesLength = values.length;

        if (!length) {
          return result;
        }

        if (iteratee) {
          values = arrayMap(values, baseUnary(iteratee));
        }

        if (comparator) {
          includes = arrayIncludesWith;
          isCommon = false;
        } else if (values.length >= LARGE_ARRAY_SIZE) {
          includes = cacheHas;
          isCommon = false;
          values = new SetCache(values);
        }

        outer: while (++index < length) {
          var value = array[index],
              computed = iteratee == null ? value : iteratee(value);
          value = comparator || value !== 0 ? value : 0;

          if (isCommon && computed === computed) {
            var valuesIndex = valuesLength;

            while (valuesIndex--) {
              if (values[valuesIndex] === computed) {
                continue outer;
              }
            }

            result.push(value);
          } else if (!includes(values, computed, comparator)) {
            result.push(value);
          }
        }

        return result;
      }

      var baseEach = createBaseEach(baseForOwn);
      var baseEachRight = createBaseEach(baseForOwnRight, true);

      function baseEvery(collection, predicate) {
        var result = true;
        baseEach(collection, function (value, index, collection) {
          result = !!predicate(value, index, collection);
          return result;
        });
        return result;
      }

      function baseExtremum(array, iteratee, comparator) {
        var index = -1,
            length = array.length;

        while (++index < length) {
          var value = array[index],
              current = iteratee(value);

          if (current != null && (computed === undefined$1 ? current === current && !isSymbol(current) : comparator(current, computed))) {
            var computed = current,
                result = value;
          }
        }

        return result;
      }

      function baseFill(array, value, start, end) {
        var length = array.length;
        start = toInteger(start);

        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }

        end = end === undefined$1 || end > length ? length : toInteger(end);

        if (end < 0) {
          end += length;
        }

        end = start > end ? 0 : toLength(end);

        while (start < end) {
          array[start++] = value;
        }

        return array;
      }

      function baseFilter(collection, predicate) {
        var result = [];
        baseEach(collection, function (value, index, collection) {
          if (predicate(value, index, collection)) {
            result.push(value);
          }
        });
        return result;
      }

      function baseFlatten(array, depth, predicate, isStrict, result) {
        var index = -1,
            length = array.length;
        predicate || (predicate = isFlattenable);
        result || (result = []);

        while (++index < length) {
          var value = array[index];

          if (depth > 0 && predicate(value)) {
            if (depth > 1) {
              baseFlatten(value, depth - 1, predicate, isStrict, result);
            } else {
              arrayPush(result, value);
            }
          } else if (!isStrict) {
            result[result.length] = value;
          }
        }

        return result;
      }

      var baseFor = createBaseFor();
      var baseForRight = createBaseFor(true);

      function baseForOwn(object, iteratee) {
        return object && baseFor(object, iteratee, keys);
      }

      function baseForOwnRight(object, iteratee) {
        return object && baseForRight(object, iteratee, keys);
      }

      function baseFunctions(object, props) {
        return arrayFilter(props, function (key) {
          return isFunction(object[key]);
        });
      }

      function baseGet(object, path) {
        path = castPath(path, object);
        var index = 0,
            length = path.length;

        while (object != null && index < length) {
          object = object[toKey(path[index++])];
        }

        return index && index == length ? object : undefined$1;
      }

      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
      }

      function baseGetTag(value) {
        if (value == null) {
          return value === undefined$1 ? undefinedTag : nullTag;
        }

        return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
      }

      function baseGt(value, other) {
        return value > other;
      }

      function baseHas(object, key) {
        return object != null && hasOwnProperty.call(object, key);
      }

      function baseHasIn(object, key) {
        return object != null && key in Object(object);
      }

      function baseInRange(number, start, end) {
        return number >= nativeMin(start, end) && number < nativeMax(start, end);
      }

      function baseIntersection(arrays, iteratee, comparator) {
        var includes = comparator ? arrayIncludesWith : arrayIncludes,
            length = arrays[0].length,
            othLength = arrays.length,
            othIndex = othLength,
            caches = Array(othLength),
            maxLength = Infinity,
            result = [];

        while (othIndex--) {
          var array = arrays[othIndex];

          if (othIndex && iteratee) {
            array = arrayMap(array, baseUnary(iteratee));
          }

          maxLength = nativeMin(array.length, maxLength);
          caches[othIndex] = !comparator && (iteratee || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined$1;
        }

        array = arrays[0];
        var index = -1,
            seen = caches[0];

        outer: while (++index < length && result.length < maxLength) {
          var value = array[index],
              computed = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;

          if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
            othIndex = othLength;

            while (--othIndex) {
              var cache = caches[othIndex];

              if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) {
                continue outer;
              }
            }

            if (seen) {
              seen.push(computed);
            }

            result.push(value);
          }
        }

        return result;
      }

      function baseInverter(object, setter, iteratee, accumulator) {
        baseForOwn(object, function (value, key, object) {
          setter(accumulator, iteratee(value), key, object);
        });
        return accumulator;
      }

      function baseInvoke(object, path, args) {
        path = castPath(path, object);
        object = parent(object, path);
        var func = object == null ? object : object[toKey(last(path))];
        return func == null ? undefined$1 : apply(func, object, args);
      }

      function baseIsArguments(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag;
      }

      function baseIsArrayBuffer(value) {
        return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
      }

      function baseIsDate(value) {
        return isObjectLike(value) && baseGetTag(value) == dateTag;
      }

      function baseIsEqual(value, other, bitmask, customizer, stack) {
        if (value === other) {
          return true;
        }

        if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
          return value !== value && other !== other;
        }

        return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
      }

      function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray(object),
            othIsArr = isArray(other),
            objTag = objIsArr ? arrayTag : getTag(object),
            othTag = othIsArr ? arrayTag : getTag(other);
        objTag = objTag == argsTag ? objectTag : objTag;
        othTag = othTag == argsTag ? objectTag : othTag;
        var objIsObj = objTag == objectTag,
            othIsObj = othTag == objectTag,
            isSameTag = objTag == othTag;

        if (isSameTag && isBuffer(object)) {
          if (!isBuffer(other)) {
            return false;
          }

          objIsArr = true;
          objIsObj = false;
        }

        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack());
          return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
        }

        if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
          var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
              othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

          if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object,
                othUnwrapped = othIsWrapped ? other.value() : other;
            stack || (stack = new Stack());
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
          }
        }

        if (!isSameTag) {
          return false;
        }

        stack || (stack = new Stack());
        return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
      }

      function baseIsMap(value) {
        return isObjectLike(value) && getTag(value) == mapTag;
      }

      function baseIsMatch(object, source, matchData, customizer) {
        var index = matchData.length,
            length = index,
            noCustomizer = !customizer;

        if (object == null) {
          return !length;
        }

        object = Object(object);

        while (index--) {
          var data = matchData[index];

          if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
            return false;
          }
        }

        while (++index < length) {
          data = matchData[index];
          var key = data[0],
              objValue = object[key],
              srcValue = data[1];

          if (noCustomizer && data[2]) {
            if (objValue === undefined$1 && !(key in object)) {
              return false;
            }
          } else {
            var stack = new Stack();

            if (customizer) {
              var result = customizer(objValue, srcValue, key, object, source, stack);
            }

            if (!(result === undefined$1 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
              return false;
            }
          }
        }

        return true;
      }

      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }

        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }

      function baseIsRegExp(value) {
        return isObjectLike(value) && baseGetTag(value) == regexpTag;
      }

      function baseIsSet(value) {
        return isObjectLike(value) && getTag(value) == setTag;
      }

      function baseIsTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
      }

      function baseIteratee(value) {
        if (typeof value == 'function') {
          return value;
        }

        if (value == null) {
          return identity;
        }

        if (typeof value == 'object') {
          return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
        }

        return property(value);
      }

      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }

        var result = [];

        for (var key in Object(object)) {
          if (hasOwnProperty.call(object, key) && key != 'constructor') {
            result.push(key);
          }
        }

        return result;
      }

      function baseKeysIn(object) {
        if (!isObject(object)) {
          return nativeKeysIn(object);
        }

        var isProto = isPrototype(object),
            result = [];

        for (var key in object) {
          if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
            result.push(key);
          }
        }

        return result;
      }

      function baseLt(value, other) {
        return value < other;
      }

      function baseMap(collection, iteratee) {
        var index = -1,
            result = isArrayLike(collection) ? Array(collection.length) : [];
        baseEach(collection, function (value, key, collection) {
          result[++index] = iteratee(value, key, collection);
        });
        return result;
      }

      function baseMatches(source) {
        var matchData = getMatchData(source);

        if (matchData.length == 1 && matchData[0][2]) {
          return matchesStrictComparable(matchData[0][0], matchData[0][1]);
        }

        return function (object) {
          return object === source || baseIsMatch(object, source, matchData);
        };
      }

      function baseMatchesProperty(path, srcValue) {
        if (isKey(path) && isStrictComparable(srcValue)) {
          return matchesStrictComparable(toKey(path), srcValue);
        }

        return function (object) {
          var objValue = get(object, path);
          return objValue === undefined$1 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
        };
      }

      function baseMerge(object, source, srcIndex, customizer, stack) {
        if (object === source) {
          return;
        }

        baseFor(source, function (srcValue, key) {
          stack || (stack = new Stack());

          if (isObject(srcValue)) {
            baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
          } else {
            var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + '', object, source, stack) : undefined$1;

            if (newValue === undefined$1) {
              newValue = srcValue;
            }

            assignMergeValue(object, key, newValue);
          }
        }, keysIn);
      }

      function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
        var objValue = safeGet(object, key),
            srcValue = safeGet(source, key),
            stacked = stack.get(srcValue);

        if (stacked) {
          assignMergeValue(object, key, stacked);
          return;
        }

        var newValue = customizer ? customizer(objValue, srcValue, key + '', object, source, stack) : undefined$1;
        var isCommon = newValue === undefined$1;

        if (isCommon) {
          var isArr = isArray(srcValue),
              isBuff = !isArr && isBuffer(srcValue),
              isTyped = !isArr && !isBuff && isTypedArray(srcValue);
          newValue = srcValue;

          if (isArr || isBuff || isTyped) {
            if (isArray(objValue)) {
              newValue = objValue;
            } else if (isArrayLikeObject(objValue)) {
              newValue = copyArray(objValue);
            } else if (isBuff) {
              isCommon = false;
              newValue = cloneBuffer(srcValue, true);
            } else if (isTyped) {
              isCommon = false;
              newValue = cloneTypedArray(srcValue, true);
            } else {
              newValue = [];
            }
          } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
            newValue = objValue;

            if (isArguments(objValue)) {
              newValue = toPlainObject(objValue);
            } else if (!isObject(objValue) || isFunction(objValue)) {
              newValue = initCloneObject(srcValue);
            }
          } else {
            isCommon = false;
          }
        }

        if (isCommon) {
          stack.set(srcValue, newValue);
          mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
          stack['delete'](srcValue);
        }

        assignMergeValue(object, key, newValue);
      }

      function baseNth(array, n) {
        var length = array.length;

        if (!length) {
          return;
        }

        n += n < 0 ? length : 0;
        return isIndex(n, length) ? array[n] : undefined$1;
      }

      function baseOrderBy(collection, iteratees, orders) {
        if (iteratees.length) {
          iteratees = arrayMap(iteratees, function (iteratee) {
            if (isArray(iteratee)) {
              return function (value) {
                return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
              };
            }

            return iteratee;
          });
        } else {
          iteratees = [identity];
        }

        var index = -1;
        iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
        var result = baseMap(collection, function (value, key, collection) {
          var criteria = arrayMap(iteratees, function (iteratee) {
            return iteratee(value);
          });
          return {
            'criteria': criteria,
            'index': ++index,
            'value': value
          };
        });
        return baseSortBy(result, function (object, other) {
          return compareMultiple(object, other, orders);
        });
      }

      function basePick(object, paths) {
        return basePickBy(object, paths, function (value, path) {
          return hasIn(object, path);
        });
      }

      function basePickBy(object, paths, predicate) {
        var index = -1,
            length = paths.length,
            result = {};

        while (++index < length) {
          var path = paths[index],
              value = baseGet(object, path);

          if (predicate(value, path)) {
            baseSet(result, castPath(path, object), value);
          }
        }

        return result;
      }

      function basePropertyDeep(path) {
        return function (object) {
          return baseGet(object, path);
        };
      }

      function basePullAll(array, values, iteratee, comparator) {
        var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
            index = -1,
            length = values.length,
            seen = array;

        if (array === values) {
          values = copyArray(values);
        }

        if (iteratee) {
          seen = arrayMap(array, baseUnary(iteratee));
        }

        while (++index < length) {
          var fromIndex = 0,
              value = values[index],
              computed = iteratee ? iteratee(value) : value;

          while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
            if (seen !== array) {
              splice.call(seen, fromIndex, 1);
            }

            splice.call(array, fromIndex, 1);
          }
        }

        return array;
      }

      function basePullAt(array, indexes) {
        var length = array ? indexes.length : 0,
            lastIndex = length - 1;

        while (length--) {
          var index = indexes[length];

          if (length == lastIndex || index !== previous) {
            var previous = index;

            if (isIndex(index)) {
              splice.call(array, index, 1);
            } else {
              baseUnset(array, index);
            }
          }
        }

        return array;
      }

      function baseRandom(lower, upper) {
        return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
      }

      function baseRange(start, end, step, fromRight) {
        var index = -1,
            length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
            result = Array(length);

        while (length--) {
          result[fromRight ? length : ++index] = start;
          start += step;
        }

        return result;
      }

      function baseRepeat(string, n) {
        var result = '';

        if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
          return result;
        }

        do {
          if (n % 2) {
            result += string;
          }

          n = nativeFloor(n / 2);

          if (n) {
            string += string;
          }
        } while (n);

        return result;
      }

      function baseRest(func, start) {
        return setToString(overRest(func, start, identity), func + '');
      }

      function baseSample(collection) {
        return arraySample(values(collection));
      }

      function baseSampleSize(collection, n) {
        var array = values(collection);
        return shuffleSelf(array, baseClamp(n, 0, array.length));
      }

      function baseSet(object, path, value, customizer) {
        if (!isObject(object)) {
          return object;
        }

        path = castPath(path, object);
        var index = -1,
            length = path.length,
            lastIndex = length - 1,
            nested = object;

        while (nested != null && ++index < length) {
          var key = toKey(path[index]),
              newValue = value;

          if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            return object;
          }

          if (index != lastIndex) {
            var objValue = nested[key];
            newValue = customizer ? customizer(objValue, key, nested) : undefined$1;

            if (newValue === undefined$1) {
              newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
            }
          }

          assignValue(nested, key, newValue);
          nested = nested[key];
        }

        return object;
      }

      var baseSetData = !metaMap ? identity : function (func, data) {
        metaMap.set(func, data);
        return func;
      };
      var baseSetToString = !defineProperty ? identity : function (func, string) {
        return defineProperty(func, 'toString', {
          'configurable': true,
          'enumerable': false,
          'value': constant(string),
          'writable': true
        });
      };

      function baseShuffle(collection) {
        return shuffleSelf(values(collection));
      }

      function baseSlice(array, start, end) {
        var index = -1,
            length = array.length;

        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }

        end = end > length ? length : end;

        if (end < 0) {
          end += length;
        }

        length = start > end ? 0 : end - start >>> 0;
        start >>>= 0;
        var result = Array(length);

        while (++index < length) {
          result[index] = array[index + start];
        }

        return result;
      }

      function baseSome(collection, predicate) {
        var result;
        baseEach(collection, function (value, index, collection) {
          result = predicate(value, index, collection);
          return !result;
        });
        return !!result;
      }

      function baseSortedIndex(array, value, retHighest) {
        var low = 0,
            high = array == null ? low : array.length;

        if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
          while (low < high) {
            var mid = low + high >>> 1,
                computed = array[mid];

            if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }

          return high;
        }

        return baseSortedIndexBy(array, value, identity, retHighest);
      }

      function baseSortedIndexBy(array, value, iteratee, retHighest) {
        var low = 0,
            high = array == null ? 0 : array.length;

        if (high === 0) {
          return 0;
        }

        value = iteratee(value);
        var valIsNaN = value !== value,
            valIsNull = value === null,
            valIsSymbol = isSymbol(value),
            valIsUndefined = value === undefined$1;

        while (low < high) {
          var mid = nativeFloor((low + high) / 2),
              computed = iteratee(array[mid]),
              othIsDefined = computed !== undefined$1,
              othIsNull = computed === null,
              othIsReflexive = computed === computed,
              othIsSymbol = isSymbol(computed);

          if (valIsNaN) {
            var setLow = retHighest || othIsReflexive;
          } else if (valIsUndefined) {
            setLow = othIsReflexive && (retHighest || othIsDefined);
          } else if (valIsNull) {
            setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
          } else if (valIsSymbol) {
            setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
          } else if (othIsNull || othIsSymbol) {
            setLow = false;
          } else {
            setLow = retHighest ? computed <= value : computed < value;
          }

          if (setLow) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }

        return nativeMin(high, MAX_ARRAY_INDEX);
      }

      function baseSortedUniq(array, iteratee) {
        var index = -1,
            length = array.length,
            resIndex = 0,
            result = [];

        while (++index < length) {
          var value = array[index],
              computed = iteratee ? iteratee(value) : value;

          if (!index || !eq(computed, seen)) {
            var seen = computed;
            result[resIndex++] = value === 0 ? 0 : value;
          }
        }

        return result;
      }

      function baseToNumber(value) {
        if (typeof value == 'number') {
          return value;
        }

        if (isSymbol(value)) {
          return NAN;
        }

        return +value;
      }

      function baseToString(value) {
        if (typeof value == 'string') {
          return value;
        }

        if (isArray(value)) {
          return arrayMap(value, baseToString) + '';
        }

        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : '';
        }

        var result = value + '';
        return result == '0' && 1 / value == -INFINITY ? '-0' : result;
      }

      function baseUniq(array, iteratee, comparator) {
        var index = -1,
            includes = arrayIncludes,
            length = array.length,
            isCommon = true,
            result = [],
            seen = result;

        if (comparator) {
          isCommon = false;
          includes = arrayIncludesWith;
        } else if (length >= LARGE_ARRAY_SIZE) {
          var set = iteratee ? null : createSet(array);

          if (set) {
            return setToArray(set);
          }

          isCommon = false;
          includes = cacheHas;
          seen = new SetCache();
        } else {
          seen = iteratee ? [] : result;
        }

        outer: while (++index < length) {
          var value = array[index],
              computed = iteratee ? iteratee(value) : value;
          value = comparator || value !== 0 ? value : 0;

          if (isCommon && computed === computed) {
            var seenIndex = seen.length;

            while (seenIndex--) {
              if (seen[seenIndex] === computed) {
                continue outer;
              }
            }

            if (iteratee) {
              seen.push(computed);
            }

            result.push(value);
          } else if (!includes(seen, computed, comparator)) {
            if (seen !== result) {
              seen.push(computed);
            }

            result.push(value);
          }
        }

        return result;
      }

      function baseUnset(object, path) {
        path = castPath(path, object);
        object = parent(object, path);
        return object == null || delete object[toKey(last(path))];
      }

      function baseUpdate(object, path, updater, customizer) {
        return baseSet(object, path, updater(baseGet(object, path)), customizer);
      }

      function baseWhile(array, predicate, isDrop, fromRight) {
        var length = array.length,
            index = fromRight ? length : -1;

        while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}

        return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
      }

      function baseWrapperValue(value, actions) {
        var result = value;

        if (result instanceof LazyWrapper) {
          result = result.value();
        }

        return arrayReduce(actions, function (result, action) {
          return action.func.apply(action.thisArg, arrayPush([result], action.args));
        }, result);
      }

      function baseXor(arrays, iteratee, comparator) {
        var length = arrays.length;

        if (length < 2) {
          return length ? baseUniq(arrays[0]) : [];
        }

        var index = -1,
            result = Array(length);

        while (++index < length) {
          var array = arrays[index],
              othIndex = -1;

          while (++othIndex < length) {
            if (othIndex != index) {
              result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
            }
          }
        }

        return baseUniq(baseFlatten(result, 1), iteratee, comparator);
      }

      function baseZipObject(props, values, assignFunc) {
        var index = -1,
            length = props.length,
            valsLength = values.length,
            result = {};

        while (++index < length) {
          var value = index < valsLength ? values[index] : undefined$1;
          assignFunc(result, props[index], value);
        }

        return result;
      }

      function castArrayLikeObject(value) {
        return isArrayLikeObject(value) ? value : [];
      }

      function castFunction(value) {
        return typeof value == 'function' ? value : identity;
      }

      function castPath(value, object) {
        if (isArray(value)) {
          return value;
        }

        return isKey(value, object) ? [value] : stringToPath(toString(value));
      }

      var castRest = baseRest;

      function castSlice(array, start, end) {
        var length = array.length;
        end = end === undefined$1 ? length : end;
        return !start && end >= length ? array : baseSlice(array, start, end);
      }

      var clearTimeout = ctxClearTimeout || function (id) {
        return root.clearTimeout(id);
      };

      function cloneBuffer(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }

        var length = buffer.length,
            result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
        buffer.copy(result);
        return result;
      }

      function cloneArrayBuffer(arrayBuffer) {
        var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array(result).set(new Uint8Array(arrayBuffer));
        return result;
      }

      function cloneDataView(dataView, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
      }

      function cloneRegExp(regexp) {
        var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
        result.lastIndex = regexp.lastIndex;
        return result;
      }

      function cloneSymbol(symbol) {
        return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
      }

      function cloneTypedArray(typedArray, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }

      function compareAscending(value, other) {
        if (value !== other) {
          var valIsDefined = value !== undefined$1,
              valIsNull = value === null,
              valIsReflexive = value === value,
              valIsSymbol = isSymbol(value);
          var othIsDefined = other !== undefined$1,
              othIsNull = other === null,
              othIsReflexive = other === other,
              othIsSymbol = isSymbol(other);

          if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
            return 1;
          }

          if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
            return -1;
          }
        }

        return 0;
      }

      function compareMultiple(object, other, orders) {
        var index = -1,
            objCriteria = object.criteria,
            othCriteria = other.criteria,
            length = objCriteria.length,
            ordersLength = orders.length;

        while (++index < length) {
          var result = compareAscending(objCriteria[index], othCriteria[index]);

          if (result) {
            if (index >= ordersLength) {
              return result;
            }

            var order = orders[index];
            return result * (order == 'desc' ? -1 : 1);
          }
        }

        return object.index - other.index;
      }

      function composeArgs(args, partials, holders, isCurried) {
        var argsIndex = -1,
            argsLength = args.length,
            holdersLength = holders.length,
            leftIndex = -1,
            leftLength = partials.length,
            rangeLength = nativeMax(argsLength - holdersLength, 0),
            result = Array(leftLength + rangeLength),
            isUncurried = !isCurried;

        while (++leftIndex < leftLength) {
          result[leftIndex] = partials[leftIndex];
        }

        while (++argsIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result[holders[argsIndex]] = args[argsIndex];
          }
        }

        while (rangeLength--) {
          result[leftIndex++] = args[argsIndex++];
        }

        return result;
      }

      function composeArgsRight(args, partials, holders, isCurried) {
        var argsIndex = -1,
            argsLength = args.length,
            holdersIndex = -1,
            holdersLength = holders.length,
            rightIndex = -1,
            rightLength = partials.length,
            rangeLength = nativeMax(argsLength - holdersLength, 0),
            result = Array(rangeLength + rightLength),
            isUncurried = !isCurried;

        while (++argsIndex < rangeLength) {
          result[argsIndex] = args[argsIndex];
        }

        var offset = argsIndex;

        while (++rightIndex < rightLength) {
          result[offset + rightIndex] = partials[rightIndex];
        }

        while (++holdersIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result[offset + holders[holdersIndex]] = args[argsIndex++];
          }
        }

        return result;
      }

      function copyArray(source, array) {
        var index = -1,
            length = source.length;
        array || (array = Array(length));

        while (++index < length) {
          array[index] = source[index];
        }

        return array;
      }

      function copyObject(source, props, object, customizer) {
        var isNew = !object;
        object || (object = {});
        var index = -1,
            length = props.length;

        while (++index < length) {
          var key = props[index];
          var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined$1;

          if (newValue === undefined$1) {
            newValue = source[key];
          }

          if (isNew) {
            baseAssignValue(object, key, newValue);
          } else {
            assignValue(object, key, newValue);
          }
        }

        return object;
      }

      function copySymbols(source, object) {
        return copyObject(source, getSymbols(source), object);
      }

      function copySymbolsIn(source, object) {
        return copyObject(source, getSymbolsIn(source), object);
      }

      function createAggregator(setter, initializer) {
        return function (collection, iteratee) {
          var func = isArray(collection) ? arrayAggregator : baseAggregator,
              accumulator = initializer ? initializer() : {};
          return func(collection, setter, getIteratee(iteratee, 2), accumulator);
        };
      }

      function createAssigner(assigner) {
        return baseRest(function (object, sources) {
          var index = -1,
              length = sources.length,
              customizer = length > 1 ? sources[length - 1] : undefined$1,
              guard = length > 2 ? sources[2] : undefined$1;
          customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined$1;

          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            customizer = length < 3 ? undefined$1 : customizer;
            length = 1;
          }

          object = Object(object);

          while (++index < length) {
            var source = sources[index];

            if (source) {
              assigner(object, source, index, customizer);
            }
          }

          return object;
        });
      }

      function createBaseEach(eachFunc, fromRight) {
        return function (collection, iteratee) {
          if (collection == null) {
            return collection;
          }

          if (!isArrayLike(collection)) {
            return eachFunc(collection, iteratee);
          }

          var length = collection.length,
              index = fromRight ? length : -1,
              iterable = Object(collection);

          while (fromRight ? index-- : ++index < length) {
            if (iteratee(iterable[index], index, iterable) === false) {
              break;
            }
          }

          return collection;
        };
      }

      function createBaseFor(fromRight) {
        return function (object, iteratee, keysFunc) {
          var index = -1,
              iterable = Object(object),
              props = keysFunc(object),
              length = props.length;

          while (length--) {
            var key = props[fromRight ? length : ++index];

            if (iteratee(iterable[key], key, iterable) === false) {
              break;
            }
          }

          return object;
        };
      }

      function createBind(func, bitmask, thisArg) {
        var isBind = bitmask & WRAP_BIND_FLAG,
            Ctor = createCtor(func);

        function wrapper() {
          var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
          return fn.apply(isBind ? thisArg : this, arguments);
        }

        return wrapper;
      }

      function createCaseFirst(methodName) {
        return function (string) {
          string = toString(string);
          var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined$1;
          var chr = strSymbols ? strSymbols[0] : string.charAt(0);
          var trailing = strSymbols ? castSlice(strSymbols, 1).join('') : string.slice(1);
          return chr[methodName]() + trailing;
        };
      }

      function createCompounder(callback) {
        return function (string) {
          return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
        };
      }

      function createCtor(Ctor) {
        return function () {
          var args = arguments;

          switch (args.length) {
            case 0:
              return new Ctor();

            case 1:
              return new Ctor(args[0]);

            case 2:
              return new Ctor(args[0], args[1]);

            case 3:
              return new Ctor(args[0], args[1], args[2]);

            case 4:
              return new Ctor(args[0], args[1], args[2], args[3]);

            case 5:
              return new Ctor(args[0], args[1], args[2], args[3], args[4]);

            case 6:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);

            case 7:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
          }

          var thisBinding = baseCreate(Ctor.prototype),
              result = Ctor.apply(thisBinding, args);
          return isObject(result) ? result : thisBinding;
        };
      }

      function createCurry(func, bitmask, arity) {
        var Ctor = createCtor(func);

        function wrapper() {
          var length = arguments.length,
              args = Array(length),
              index = length,
              placeholder = getHolder(wrapper);

          while (index--) {
            args[index] = arguments[index];
          }

          var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
          length -= holders.length;

          if (length < arity) {
            return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined$1, args, holders, undefined$1, undefined$1, arity - length);
          }

          var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
          return apply(fn, this, args);
        }

        return wrapper;
      }

      function createFind(findIndexFunc) {
        return function (collection, predicate, fromIndex) {
          var iterable = Object(collection);

          if (!isArrayLike(collection)) {
            var iteratee = getIteratee(predicate, 3);
            collection = keys(collection);

            predicate = function predicate(key) {
              return iteratee(iterable[key], key, iterable);
            };
          }

          var index = findIndexFunc(collection, predicate, fromIndex);
          return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined$1;
        };
      }

      function createFlow(fromRight) {
        return flatRest(function (funcs) {
          var length = funcs.length,
              index = length,
              prereq = LodashWrapper.prototype.thru;

          if (fromRight) {
            funcs.reverse();
          }

          while (index--) {
            var func = funcs[index];

            if (typeof func != 'function') {
              throw new TypeError(FUNC_ERROR_TEXT);
            }

            if (prereq && !wrapper && getFuncName(func) == 'wrapper') {
              var wrapper = new LodashWrapper([], true);
            }
          }

          index = wrapper ? index : length;

          while (++index < length) {
            func = funcs[index];
            var funcName = getFuncName(func),
                data = funcName == 'wrapper' ? getData(func) : undefined$1;

            if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
              wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
            } else {
              wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
            }
          }

          return function () {
            var args = arguments,
                value = args[0];

            if (wrapper && args.length == 1 && isArray(value)) {
              return wrapper.plant(value).value();
            }

            var index = 0,
                result = length ? funcs[index].apply(this, args) : value;

            while (++index < length) {
              result = funcs[index].call(this, result);
            }

            return result;
          };
        });
      }

      function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
        var isAry = bitmask & WRAP_ARY_FLAG,
            isBind = bitmask & WRAP_BIND_FLAG,
            isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
            isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
            isFlip = bitmask & WRAP_FLIP_FLAG,
            Ctor = isBindKey ? undefined$1 : createCtor(func);

        function wrapper() {
          var length = arguments.length,
              args = Array(length),
              index = length;

          while (index--) {
            args[index] = arguments[index];
          }

          if (isCurried) {
            var placeholder = getHolder(wrapper),
                holdersCount = countHolders(args, placeholder);
          }

          if (partials) {
            args = composeArgs(args, partials, holders, isCurried);
          }

          if (partialsRight) {
            args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
          }

          length -= holdersCount;

          if (isCurried && length < arity) {
            var newHolders = replaceHolders(args, placeholder);
            return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length);
          }

          var thisBinding = isBind ? thisArg : this,
              fn = isBindKey ? thisBinding[func] : func;
          length = args.length;

          if (argPos) {
            args = reorder(args, argPos);
          } else if (isFlip && length > 1) {
            args.reverse();
          }

          if (isAry && ary < length) {
            args.length = ary;
          }

          if (this && this !== root && this instanceof wrapper) {
            fn = Ctor || createCtor(fn);
          }

          return fn.apply(thisBinding, args);
        }

        return wrapper;
      }

      function createInverter(setter, toIteratee) {
        return function (object, iteratee) {
          return baseInverter(object, setter, toIteratee(iteratee), {});
        };
      }

      function createMathOperation(operator, defaultValue) {
        return function (value, other) {
          var result;

          if (value === undefined$1 && other === undefined$1) {
            return defaultValue;
          }

          if (value !== undefined$1) {
            result = value;
          }

          if (other !== undefined$1) {
            if (result === undefined$1) {
              return other;
            }

            if (typeof value == 'string' || typeof other == 'string') {
              value = baseToString(value);
              other = baseToString(other);
            } else {
              value = baseToNumber(value);
              other = baseToNumber(other);
            }

            result = operator(value, other);
          }

          return result;
        };
      }

      function createOver(arrayFunc) {
        return flatRest(function (iteratees) {
          iteratees = arrayMap(iteratees, baseUnary(getIteratee()));
          return baseRest(function (args) {
            var thisArg = this;
            return arrayFunc(iteratees, function (iteratee) {
              return apply(iteratee, thisArg, args);
            });
          });
        });
      }

      function createPadding(length, chars) {
        chars = chars === undefined$1 ? ' ' : baseToString(chars);
        var charsLength = chars.length;

        if (charsLength < 2) {
          return charsLength ? baseRepeat(chars, length) : chars;
        }

        var result = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
        return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join('') : result.slice(0, length);
      }

      function createPartial(func, bitmask, thisArg, partials) {
        var isBind = bitmask & WRAP_BIND_FLAG,
            Ctor = createCtor(func);

        function wrapper() {
          var argsIndex = -1,
              argsLength = arguments.length,
              leftIndex = -1,
              leftLength = partials.length,
              args = Array(leftLength + argsLength),
              fn = this && this !== root && this instanceof wrapper ? Ctor : func;

          while (++leftIndex < leftLength) {
            args[leftIndex] = partials[leftIndex];
          }

          while (argsLength--) {
            args[leftIndex++] = arguments[++argsIndex];
          }

          return apply(fn, isBind ? thisArg : this, args);
        }

        return wrapper;
      }

      function createRange(fromRight) {
        return function (start, end, step) {
          if (step && typeof step != 'number' && isIterateeCall(start, end, step)) {
            end = step = undefined$1;
          }

          start = toFinite(start);

          if (end === undefined$1) {
            end = start;
            start = 0;
          } else {
            end = toFinite(end);
          }

          step = step === undefined$1 ? start < end ? 1 : -1 : toFinite(step);
          return baseRange(start, end, step, fromRight);
        };
      }

      function createRelationalOperation(operator) {
        return function (value, other) {
          if (!(typeof value == 'string' && typeof other == 'string')) {
            value = toNumber(value);
            other = toNumber(other);
          }

          return operator(value, other);
        };
      }

      function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
        var isCurry = bitmask & WRAP_CURRY_FLAG,
            newHolders = isCurry ? holders : undefined$1,
            newHoldersRight = isCurry ? undefined$1 : holders,
            newPartials = isCurry ? partials : undefined$1,
            newPartialsRight = isCurry ? undefined$1 : partials;
        bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
        bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

        if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
          bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
        }

        var newData = [func, bitmask, thisArg, newPartials, newHolders, newPartialsRight, newHoldersRight, argPos, ary, arity];
        var result = wrapFunc.apply(undefined$1, newData);

        if (isLaziable(func)) {
          setData(result, newData);
        }

        result.placeholder = placeholder;
        return setWrapToString(result, func, bitmask);
      }

      function createRound(methodName) {
        var func = Math[methodName];
        return function (number, precision) {
          number = toNumber(number);
          precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);

          if (precision && nativeIsFinite(number)) {
            var pair = (toString(number) + 'e').split('e'),
                value = func(pair[0] + 'e' + (+pair[1] + precision));
            pair = (toString(value) + 'e').split('e');
            return +(pair[0] + 'e' + (+pair[1] - precision));
          }

          return func(number);
        };
      }

      var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY) ? noop : function (values) {
        return new Set(values);
      };

      function createToPairs(keysFunc) {
        return function (object) {
          var tag = getTag(object);

          if (tag == mapTag) {
            return mapToArray(object);
          }

          if (tag == setTag) {
            return setToPairs(object);
          }

          return baseToPairs(object, keysFunc(object));
        };
      }

      function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
        var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;

        if (!isBindKey && typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }

        var length = partials ? partials.length : 0;

        if (!length) {
          bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
          partials = holders = undefined$1;
        }

        ary = ary === undefined$1 ? ary : nativeMax(toInteger(ary), 0);
        arity = arity === undefined$1 ? arity : toInteger(arity);
        length -= holders ? holders.length : 0;

        if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
          var partialsRight = partials,
              holdersRight = holders;
          partials = holders = undefined$1;
        }

        var data = isBindKey ? undefined$1 : getData(func);
        var newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

        if (data) {
          mergeData(newData, data);
        }

        func = newData[0];
        bitmask = newData[1];
        thisArg = newData[2];
        partials = newData[3];
        holders = newData[4];
        arity = newData[9] = newData[9] === undefined$1 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);

        if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
          bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
        }

        if (!bitmask || bitmask == WRAP_BIND_FLAG) {
          var result = createBind(func, bitmask, thisArg);
        } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
          result = createCurry(func, bitmask, arity);
        } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
          result = createPartial(func, bitmask, thisArg, partials);
        } else {
          result = createHybrid.apply(undefined$1, newData);
        }

        var setter = data ? baseSetData : setData;
        return setWrapToString(setter(result, newData), func, bitmask);
      }

      function customDefaultsAssignIn(objValue, srcValue, key, object) {
        if (objValue === undefined$1 || eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key)) {
          return srcValue;
        }

        return objValue;
      }

      function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
        if (isObject(objValue) && isObject(srcValue)) {
          stack.set(srcValue, objValue);
          baseMerge(objValue, srcValue, undefined$1, customDefaultsMerge, stack);
          stack['delete'](srcValue);
        }

        return objValue;
      }

      function customOmitClone(value) {
        return isPlainObject(value) ? undefined$1 : value;
      }

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
            seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined$1;
        stack.set(array, other);
        stack.set(other, array);

        while (++index < arrLength) {
          var arrValue = array[index],
              othValue = other[index];

          if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
          }

          if (compared !== undefined$1) {
            if (compared) {
              continue;
            }

            result = false;
            break;
          }

          if (seen) {
            if (!arraySome(other, function (othValue, othIndex) {
              if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
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

      function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case dataViewTag:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
              return false;
            }

            object = object.buffer;
            other = other.buffer;

          case arrayBufferTag:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
              return false;
            }

            return true;

          case boolTag:
          case dateTag:
          case numberTag:
            return eq(+object, +other);

          case errorTag:
            return object.name == other.name && object.message == other.message;

          case regexpTag:
          case stringTag:
            return object == other + '';

          case mapTag:
            var convert = mapToArray;

          case setTag:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
            convert || (convert = setToArray);

            if (object.size != other.size && !isPartial) {
              return false;
            }

            var stacked = stack.get(object);

            if (stacked) {
              return stacked == other;
            }

            bitmask |= COMPARE_UNORDERED_FLAG;
            stack.set(object, other);
            var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack['delete'](object);
            return result;

          case symbolTag:
            if (symbolValueOf) {
              return symbolValueOf.call(object) == symbolValueOf.call(other);
            }

        }

        return false;
      }

      function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
            objProps = getAllKeys(object),
            objLength = objProps.length,
            othProps = getAllKeys(other),
            othLength = othProps.length;

        if (objLength != othLength && !isPartial) {
          return false;
        }

        var index = objLength;

        while (index--) {
          var key = objProps[index];

          if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
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

          if (!(compared === undefined$1 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
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

      function flatRest(func) {
        return setToString(overRest(func, undefined$1, flatten), func + '');
      }

      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols);
      }

      function getAllKeysIn(object) {
        return baseGetAllKeys(object, keysIn, getSymbolsIn);
      }

      var getData = !metaMap ? noop : function (func) {
        return metaMap.get(func);
      };

      function getFuncName(func) {
        var result = func.name + '',
            array = realNames[result],
            length = hasOwnProperty.call(realNames, result) ? array.length : 0;

        while (length--) {
          var data = array[length],
              otherFunc = data.func;

          if (otherFunc == null || otherFunc == func) {
            return data.name;
          }
        }

        return result;
      }

      function getHolder(func) {
        var object = hasOwnProperty.call(lodash, 'placeholder') ? lodash : func;
        return object.placeholder;
      }

      function getIteratee() {
        var result = lodash.iteratee || iteratee;
        result = result === iteratee ? baseIteratee : result;
        return arguments.length ? result(arguments[0], arguments[1]) : result;
      }

      function getMapData(map, key) {
        var data = map.__data__;
        return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
      }

      function getMatchData(object) {
        var result = keys(object),
            length = result.length;

        while (length--) {
          var key = result[length],
              value = object[key];
          result[length] = [key, value, isStrictComparable(value)];
        }

        return result;
      }

      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : undefined$1;
      }

      function getRawTag(value) {
        var isOwn = hasOwnProperty.call(value, symToStringTag),
            tag = value[symToStringTag];

        try {
          value[symToStringTag] = undefined$1;
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

      var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
        if (object == null) {
          return [];
        }

        object = Object(object);
        return arrayFilter(nativeGetSymbols(object), function (symbol) {
          return propertyIsEnumerable.call(object, symbol);
        });
      };
      var getSymbolsIn = !nativeGetSymbols ? stubArray : function (object) {
        var result = [];

        while (object) {
          arrayPush(result, getSymbols(object));
          object = getPrototype(object);
        }

        return result;
      };
      var getTag = baseGetTag;

      if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
        getTag = function getTag(value) {
          var result = baseGetTag(value),
              Ctor = result == objectTag ? value.constructor : undefined$1,
              ctorString = Ctor ? toSource(Ctor) : '';

          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag;

              case mapCtorString:
                return mapTag;

              case promiseCtorString:
                return promiseTag;

              case setCtorString:
                return setTag;

              case weakMapCtorString:
                return weakMapTag;
            }
          }

          return result;
        };
      }

      function getView(start, end, transforms) {
        var index = -1,
            length = transforms.length;

        while (++index < length) {
          var data = transforms[index],
              size = data.size;

          switch (data.type) {
            case 'drop':
              start += size;
              break;

            case 'dropRight':
              end -= size;
              break;

            case 'take':
              end = nativeMin(end, start + size);
              break;

            case 'takeRight':
              start = nativeMax(start, end - size);
              break;
          }
        }

        return {
          'start': start,
          'end': end
        };
      }

      function getWrapDetails(source) {
        var match = source.match(reWrapDetails);
        return match ? match[1].split(reSplitDetails) : [];
      }

      function hasPath(object, path, hasFunc) {
        path = castPath(path, object);
        var index = -1,
            length = path.length,
            result = false;

        while (++index < length) {
          var key = toKey(path[index]);

          if (!(result = object != null && hasFunc(object, key))) {
            break;
          }

          object = object[key];
        }

        if (result || ++index != length) {
          return result;
        }

        length = object == null ? 0 : object.length;
        return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
      }

      function initCloneArray(array) {
        var length = array.length,
            result = new array.constructor(length);

        if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
          result.index = array.index;
          result.input = array.input;
        }

        return result;
      }

      function initCloneObject(object) {
        return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
      }

      function initCloneByTag(object, tag, isDeep) {
        var Ctor = object.constructor;

        switch (tag) {
          case arrayBufferTag:
            return cloneArrayBuffer(object);

          case boolTag:
          case dateTag:
            return new Ctor(+object);

          case dataViewTag:
            return cloneDataView(object, isDeep);

          case float32Tag:
          case float64Tag:
          case int8Tag:
          case int16Tag:
          case int32Tag:
          case uint8Tag:
          case uint8ClampedTag:
          case uint16Tag:
          case uint32Tag:
            return cloneTypedArray(object, isDeep);

          case mapTag:
            return new Ctor();

          case numberTag:
          case stringTag:
            return new Ctor(object);

          case regexpTag:
            return cloneRegExp(object);

          case setTag:
            return new Ctor();

          case symbolTag:
            return cloneSymbol(object);
        }
      }

      function insertWrapDetails(source, details) {
        var length = details.length;

        if (!length) {
          return source;
        }

        var lastIndex = length - 1;
        details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
        details = details.join(length > 2 ? ', ' : ' ');
        return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
      }

      function isFlattenable(value) {
        return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
      }

      function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER : length;
        return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
      }

      function isIterateeCall(value, index, object) {
        if (!isObject(object)) {
          return false;
        }

        var type = typeof index;

        if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
          return eq(object[index], value);
        }

        return false;
      }

      function isKey(value, object) {
        if (isArray(value)) {
          return false;
        }

        var type = typeof value;

        if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
          return true;
        }

        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
      }

      function isKeyable(value) {
        var type = typeof value;
        return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
      }

      function isLaziable(func) {
        var funcName = getFuncName(func),
            other = lodash[funcName];

        if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
          return false;
        }

        if (func === other) {
          return true;
        }

        var data = getData(other);
        return !!data && func === data[0];
      }

      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }

      var isMaskable = coreJsData ? isFunction : stubFalse;

      function isPrototype(value) {
        var Ctor = value && value.constructor,
            proto = typeof Ctor == 'function' && Ctor.prototype || objectProto;
        return value === proto;
      }

      function isStrictComparable(value) {
        return value === value && !isObject(value);
      }

      function matchesStrictComparable(key, srcValue) {
        return function (object) {
          if (object == null) {
            return false;
          }

          return object[key] === srcValue && (srcValue !== undefined$1 || key in Object(object));
        };
      }

      function memoizeCapped(func) {
        var result = memoize(func, function (key) {
          if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
          }

          return key;
        });
        var cache = result.cache;
        return result;
      }

      function mergeData(data, source) {
        var bitmask = data[1],
            srcBitmask = source[1],
            newBitmask = bitmask | srcBitmask,
            isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
        var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;

        if (!(isCommon || isCombo)) {
          return data;
        }

        if (srcBitmask & WRAP_BIND_FLAG) {
          data[2] = source[2];
          newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
        }

        var value = source[3];

        if (value) {
          var partials = data[3];
          data[3] = partials ? composeArgs(partials, value, source[4]) : value;
          data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
        }

        value = source[5];

        if (value) {
          partials = data[5];
          data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
          data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
        }

        value = source[7];

        if (value) {
          data[7] = value;
        }

        if (srcBitmask & WRAP_ARY_FLAG) {
          data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
        }

        if (data[9] == null) {
          data[9] = source[9];
        }

        data[0] = source[0];
        data[1] = newBitmask;
        return data;
      }

      function nativeKeysIn(object) {
        var result = [];

        if (object != null) {
          for (var key in Object(object)) {
            result.push(key);
          }
        }

        return result;
      }

      function objectToString(value) {
        return nativeObjectToString.call(value);
      }

      function overRest(func, start, transform) {
        start = nativeMax(start === undefined$1 ? func.length - 1 : start, 0);
        return function () {
          var args = arguments,
              index = -1,
              length = nativeMax(args.length - start, 0),
              array = Array(length);

          while (++index < length) {
            array[index] = args[start + index];
          }

          index = -1;
          var otherArgs = Array(start + 1);

          while (++index < start) {
            otherArgs[index] = args[index];
          }

          otherArgs[start] = transform(array);
          return apply(func, this, otherArgs);
        };
      }

      function parent(object, path) {
        return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
      }

      function reorder(array, indexes) {
        var arrLength = array.length,
            length = nativeMin(indexes.length, arrLength),
            oldArray = copyArray(array);

        while (length--) {
          var index = indexes[length];
          array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined$1;
        }

        return array;
      }

      function safeGet(object, key) {
        if (key === 'constructor' && typeof object[key] === 'function') {
          return;
        }

        if (key == '__proto__') {
          return;
        }

        return object[key];
      }

      var setData = shortOut(baseSetData);

      var setTimeout = ctxSetTimeout || function (func, wait) {
        return root.setTimeout(func, wait);
      };

      var setToString = shortOut(baseSetToString);

      function setWrapToString(wrapper, reference, bitmask) {
        var source = reference + '';
        return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
      }

      function shortOut(func) {
        var count = 0,
            lastCalled = 0;
        return function () {
          var stamp = nativeNow(),
              remaining = HOT_SPAN - (stamp - lastCalled);
          lastCalled = stamp;

          if (remaining > 0) {
            if (++count >= HOT_COUNT) {
              return arguments[0];
            }
          } else {
            count = 0;
          }

          return func.apply(undefined$1, arguments);
        };
      }

      function shuffleSelf(array, size) {
        var index = -1,
            length = array.length,
            lastIndex = length - 1;
        size = size === undefined$1 ? length : size;

        while (++index < size) {
          var rand = baseRandom(index, lastIndex),
              value = array[rand];
          array[rand] = array[index];
          array[index] = value;
        }

        array.length = size;
        return array;
      }

      var stringToPath = memoizeCapped(function (string) {
        var result = [];

        if (string.charCodeAt(0) === 46) {
            result.push('');
          }

        string.replace(rePropName, function (match, number, quote, subString) {
          result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
        });
        return result;
      });

      function toKey(value) {
        if (typeof value == 'string' || isSymbol(value)) {
          return value;
        }

        var result = value + '';
        return result == '0' && 1 / value == -INFINITY ? '-0' : result;
      }

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

      function updateWrapDetails(details, bitmask) {
        arrayEach(wrapFlags, function (pair) {
          var value = '_.' + pair[0];

          if (bitmask & pair[1] && !arrayIncludes(details, value)) {
            details.push(value);
          }
        });
        return details.sort();
      }

      function wrapperClone(wrapper) {
        if (wrapper instanceof LazyWrapper) {
          return wrapper.clone();
        }

        var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
        result.__actions__ = copyArray(wrapper.__actions__);
        result.__index__ = wrapper.__index__;
        result.__values__ = wrapper.__values__;
        return result;
      }

      function chunk(array, size, guard) {
        if (guard ? isIterateeCall(array, size, guard) : size === undefined$1) {
          size = 1;
        } else {
          size = nativeMax(toInteger(size), 0);
        }

        var length = array == null ? 0 : array.length;

        if (!length || size < 1) {
          return [];
        }

        var index = 0,
            resIndex = 0,
            result = Array(nativeCeil(length / size));

        while (index < length) {
          result[resIndex++] = baseSlice(array, index, index += size);
        }

        return result;
      }

      function compact(array) {
        var index = -1,
            length = array == null ? 0 : array.length,
            resIndex = 0,
            result = [];

        while (++index < length) {
          var value = array[index];

          if (value) {
            result[resIndex++] = value;
          }
        }

        return result;
      }

      function concat() {
        var length = arguments.length;

        if (!length) {
          return [];
        }

        var args = Array(length - 1),
            array = arguments[0],
            index = length;

        while (index--) {
          args[index - 1] = arguments[index];
        }

        return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
      }

      var difference = baseRest(function (array, values) {
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
      });
      var differenceBy = baseRest(function (array, values) {
        var iteratee = last(values);

        if (isArrayLikeObject(iteratee)) {
          iteratee = undefined$1;
        }

        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), getIteratee(iteratee, 2)) : [];
      });
      var differenceWith = baseRest(function (array, values) {
        var comparator = last(values);

        if (isArrayLikeObject(comparator)) {
          comparator = undefined$1;
        }

        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined$1, comparator) : [];
      });

      function drop(array, n, guard) {
        var length = array == null ? 0 : array.length;

        if (!length) {
          return [];
        }

        n = guard || n === undefined$1 ? 1 : toInteger(n);
        return baseSlice(array, n < 0 ? 0 : n, length);
      }

      function dropRight(array, n, guard) {
        var length = array == null ? 0 : array.length;

        if (!length) {
          return [];
        }

        n = guard || n === undefined$1 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array, 0, n < 0 ? 0 : n);
      }

      function dropRightWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
      }

      function dropWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
      }

      function fill(array, value, start, end) {
        var length = array == null ? 0 : array.length;

        if (!length) {
          return [];
        }

        if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
          start = 0;
          end = length;
        }

        return baseFill(array, value, start, end);
      }

      function findIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;

        if (!length) {
          return -1;
        }

        var index = fromIndex == null ? 0 : toInteger(fromIndex);

        if (index < 0) {
          index = nativeMax(length + index, 0);
        }

        return baseFindIndex(array, getIteratee(predicate, 3), index);
      }

      function findLastIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;

        if (!length) {
          return -1;
        }

        var index = length - 1;

        if (fromIndex !== undefined$1) {
          index = toInteger(fromIndex);
          index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
        }

        return baseFindIndex(array, getIteratee(predicate, 3), index, true);
      }

      function flatten(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, 1) : [];
      }

      function flattenDeep(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, INFINITY) : [];
      }

      function flattenDepth(array, depth) {
        var length = array == null ? 0 : array.length;

        if (!length) {
          return [];
        }

        depth = depth === undefined$1 ? 1 : toInteger(depth);
        return baseFlatten(array, depth);
      }

      function fromPairs(pairs) {
        var index = -1,
            length = pairs == null ? 0 : pairs.length,
            result = {};

        while (++index < length) {
          var pair = pairs[index];
          result[pair[0]] = pair[1];
        }

        return result;
      }

      function head(array) {
        return array && array.length ? array[0] : undefined$1;
      }

      function indexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;

        if (!length) {
          return -1;
        }

        var index = fromIndex == null ? 0 : toInteger(fromIndex);

        if (index < 0) {
          index = nativeMax(length + index, 0);
        }

        return baseIndexOf(array, value, index);
      }

      function initial(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 0, -1) : [];
      }

      var intersection = baseRest(function (arrays) {
        var mapped = arrayMap(arrays, castArrayLikeObject);
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
      });
      var intersectionBy = baseRest(function (arrays) {
        var iteratee = last(arrays),
            mapped = arrayMap(arrays, castArrayLikeObject);

        if (iteratee === last(mapped)) {
          iteratee = undefined$1;
        } else {
          mapped.pop();
        }

        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee, 2)) : [];
      });
      var intersectionWith = baseRest(function (arrays) {
        var comparator = last(arrays),
            mapped = arrayMap(arrays, castArrayLikeObject);
        comparator = typeof comparator == 'function' ? comparator : undefined$1;

        if (comparator) {
          mapped.pop();
        }

        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined$1, comparator) : [];
      });

      function join(array, separator) {
        return array == null ? '' : nativeJoin.call(array, separator);
      }

      function last(array) {
        var length = array == null ? 0 : array.length;
        return length ? array[length - 1] : undefined$1;
      }

      function lastIndexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;

        if (!length) {
          return -1;
        }

        var index = length;

        if (fromIndex !== undefined$1) {
          index = toInteger(fromIndex);
          index = index < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
        }

        return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
      }

      function nth(array, n) {
        return array && array.length ? baseNth(array, toInteger(n)) : undefined$1;
      }

      var pull = baseRest(pullAll);

      function pullAll(array, values) {
        return array && array.length && values && values.length ? basePullAll(array, values) : array;
      }

      function pullAllBy(array, values, iteratee) {
        return array && array.length && values && values.length ? basePullAll(array, values, getIteratee(iteratee, 2)) : array;
      }

      function pullAllWith(array, values, comparator) {
        return array && array.length && values && values.length ? basePullAll(array, values, undefined$1, comparator) : array;
      }

      var pullAt = flatRest(function (array, indexes) {
        var length = array == null ? 0 : array.length,
            result = baseAt(array, indexes);
        basePullAt(array, arrayMap(indexes, function (index) {
          return isIndex(index, length) ? +index : index;
        }).sort(compareAscending));
        return result;
      });

      function remove(array, predicate) {
        var result = [];

        if (!(array && array.length)) {
          return result;
        }

        var index = -1,
            indexes = [],
            length = array.length;
        predicate = getIteratee(predicate, 3);

        while (++index < length) {
          var value = array[index];

          if (predicate(value, index, array)) {
            result.push(value);
            indexes.push(index);
          }
        }

        basePullAt(array, indexes);
        return result;
      }

      function reverse(array) {
        return array == null ? array : nativeReverse.call(array);
      }

      function slice(array, start, end) {
        var length = array == null ? 0 : array.length;

        if (!length) {
          return [];
        }

        if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
          start = 0;
          end = length;
        } else {
          start = start == null ? 0 : toInteger(start);
          end = end === undefined$1 ? length : toInteger(end);
        }

        return baseSlice(array, start, end);
      }

      function sortedIndex(array, value) {
        return baseSortedIndex(array, value);
      }

      function sortedIndexBy(array, value, iteratee) {
        return baseSortedIndexBy(array, value, getIteratee(iteratee, 2));
      }

      function sortedIndexOf(array, value) {
        var length = array == null ? 0 : array.length;

        if (length) {
          var index = baseSortedIndex(array, value);

          if (index < length && eq(array[index], value)) {
            return index;
          }
        }

        return -1;
      }

      function sortedLastIndex(array, value) {
        return baseSortedIndex(array, value, true);
      }

      function sortedLastIndexBy(array, value, iteratee) {
        return baseSortedIndexBy(array, value, getIteratee(iteratee, 2), true);
      }

      function sortedLastIndexOf(array, value) {
        var length = array == null ? 0 : array.length;

        if (length) {
          var index = baseSortedIndex(array, value, true) - 1;

          if (eq(array[index], value)) {
            return index;
          }
        }

        return -1;
      }

      function sortedUniq(array) {
        return array && array.length ? baseSortedUniq(array) : [];
      }

      function sortedUniqBy(array, iteratee) {
        return array && array.length ? baseSortedUniq(array, getIteratee(iteratee, 2)) : [];
      }

      function tail(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 1, length) : [];
      }

      function take(array, n, guard) {
        if (!(array && array.length)) {
          return [];
        }

        n = guard || n === undefined$1 ? 1 : toInteger(n);
        return baseSlice(array, 0, n < 0 ? 0 : n);
      }

      function takeRight(array, n, guard) {
        var length = array == null ? 0 : array.length;

        if (!length) {
          return [];
        }

        n = guard || n === undefined$1 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array, n < 0 ? 0 : n, length);
      }

      function takeRightWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
      }

      function takeWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
      }

      var union = baseRest(function (arrays) {
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
      });
      var unionBy = baseRest(function (arrays) {
        var iteratee = last(arrays);

        if (isArrayLikeObject(iteratee)) {
          iteratee = undefined$1;
        }

        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee, 2));
      });
      var unionWith = baseRest(function (arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == 'function' ? comparator : undefined$1;
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined$1, comparator);
      });

      function uniq(array) {
        return array && array.length ? baseUniq(array) : [];
      }

      function uniqBy(array, iteratee) {
        return array && array.length ? baseUniq(array, getIteratee(iteratee, 2)) : [];
      }

      function uniqWith(array, comparator) {
        comparator = typeof comparator == 'function' ? comparator : undefined$1;
        return array && array.length ? baseUniq(array, undefined$1, comparator) : [];
      }

      function unzip(array) {
        if (!(array && array.length)) {
          return [];
        }

        var length = 0;
        array = arrayFilter(array, function (group) {
          if (isArrayLikeObject(group)) {
            length = nativeMax(group.length, length);
            return true;
          }
        });
        return baseTimes(length, function (index) {
          return arrayMap(array, baseProperty(index));
        });
      }

      function unzipWith(array, iteratee) {
        if (!(array && array.length)) {
          return [];
        }

        var result = unzip(array);

        if (iteratee == null) {
          return result;
        }

        return arrayMap(result, function (group) {
          return apply(iteratee, undefined$1, group);
        });
      }

      var without = baseRest(function (array, values) {
        return isArrayLikeObject(array) ? baseDifference(array, values) : [];
      });
      var xor = baseRest(function (arrays) {
        return baseXor(arrayFilter(arrays, isArrayLikeObject));
      });
      var xorBy = baseRest(function (arrays) {
        var iteratee = last(arrays);

        if (isArrayLikeObject(iteratee)) {
          iteratee = undefined$1;
        }

        return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee, 2));
      });
      var xorWith = baseRest(function (arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == 'function' ? comparator : undefined$1;
        return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined$1, comparator);
      });
      var zip = baseRest(unzip);

      function zipObject(props, values) {
        return baseZipObject(props || [], values || [], assignValue);
      }

      function zipObjectDeep(props, values) {
        return baseZipObject(props || [], values || [], baseSet);
      }

      var zipWith = baseRest(function (arrays) {
        var length = arrays.length,
            iteratee = length > 1 ? arrays[length - 1] : undefined$1;
        iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined$1;
        return unzipWith(arrays, iteratee);
      });

      function chain(value) {
        var result = lodash(value);
        result.__chain__ = true;
        return result;
      }

      function tap(value, interceptor) {
        interceptor(value);
        return value;
      }

      function thru(value, interceptor) {
        return interceptor(value);
      }

      var wrapperAt = flatRest(function (paths) {
        var length = paths.length,
            start = length ? paths[0] : 0,
            value = this.__wrapped__,
            interceptor = function interceptor(object) {
          return baseAt(object, paths);
        };

        if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
          return this.thru(interceptor);
        }

        value = value.slice(start, +start + (length ? 1 : 0));

        value.__actions__.push({
          'func': thru,
          'args': [interceptor],
          'thisArg': undefined$1
        });

        return new LodashWrapper(value, this.__chain__).thru(function (array) {
          if (length && !array.length) {
            array.push(undefined$1);
          }

          return array;
        });
      });

      function wrapperChain() {
        return chain(this);
      }

      function wrapperCommit() {
        return new LodashWrapper(this.value(), this.__chain__);
      }

      function wrapperNext() {
        if (this.__values__ === undefined$1) {
          this.__values__ = toArray(this.value());
        }

        var done = this.__index__ >= this.__values__.length,
            value = done ? undefined$1 : this.__values__[this.__index__++];
        return {
          'done': done,
          'value': value
        };
      }

      function wrapperToIterator() {
        return this;
      }

      function wrapperPlant(value) {
        var result,
            parent = this;

        while (parent instanceof baseLodash) {
          var clone = wrapperClone(parent);
          clone.__index__ = 0;
          clone.__values__ = undefined$1;

          if (result) {
            previous.__wrapped__ = clone;
          } else {
            result = clone;
          }

          var previous = clone;
          parent = parent.__wrapped__;
        }

        previous.__wrapped__ = value;
        return result;
      }

      function wrapperReverse() {
        var value = this.__wrapped__;

        if (value instanceof LazyWrapper) {
          var wrapped = value;

          if (this.__actions__.length) {
            wrapped = new LazyWrapper(this);
          }

          wrapped = wrapped.reverse();

          wrapped.__actions__.push({
            'func': thru,
            'args': [reverse],
            'thisArg': undefined$1
          });

          return new LodashWrapper(wrapped, this.__chain__);
        }

        return this.thru(reverse);
      }

      function wrapperValue() {
        return baseWrapperValue(this.__wrapped__, this.__actions__);
      }

      var countBy = createAggregator(function (result, value, key) {
        if (hasOwnProperty.call(result, key)) {
          ++result[key];
        } else {
          baseAssignValue(result, key, 1);
        }
      });

      function every(collection, predicate, guard) {
        var func = isArray(collection) ? arrayEvery : baseEvery;

        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined$1;
        }

        return func(collection, getIteratee(predicate, 3));
      }

      function filter(collection, predicate) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        return func(collection, getIteratee(predicate, 3));
      }

      var find = createFind(findIndex);
      var findLast = createFind(findLastIndex);

      function flatMap(collection, iteratee) {
        return baseFlatten(map(collection, iteratee), 1);
      }

      function flatMapDeep(collection, iteratee) {
        return baseFlatten(map(collection, iteratee), INFINITY);
      }

      function flatMapDepth(collection, iteratee, depth) {
        depth = depth === undefined$1 ? 1 : toInteger(depth);
        return baseFlatten(map(collection, iteratee), depth);
      }

      function forEach(collection, iteratee) {
        var func = isArray(collection) ? arrayEach : baseEach;
        return func(collection, getIteratee(iteratee, 3));
      }

      function forEachRight(collection, iteratee) {
        var func = isArray(collection) ? arrayEachRight : baseEachRight;
        return func(collection, getIteratee(iteratee, 3));
      }

      var groupBy = createAggregator(function (result, value, key) {
        if (hasOwnProperty.call(result, key)) {
          result[key].push(value);
        } else {
          baseAssignValue(result, key, [value]);
        }
      });

      function includes(collection, value, fromIndex, guard) {
        collection = isArrayLike(collection) ? collection : values(collection);
        fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
        var length = collection.length;

        if (fromIndex < 0) {
          fromIndex = nativeMax(length + fromIndex, 0);
        }

        return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
      }

      var invokeMap = baseRest(function (collection, path, args) {
        var index = -1,
            isFunc = typeof path == 'function',
            result = isArrayLike(collection) ? Array(collection.length) : [];
        baseEach(collection, function (value) {
          result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
        });
        return result;
      });
      var keyBy = createAggregator(function (result, value, key) {
        baseAssignValue(result, key, value);
      });

      function map(collection, iteratee) {
        var func = isArray(collection) ? arrayMap : baseMap;
        return func(collection, getIteratee(iteratee, 3));
      }

      function orderBy(collection, iteratees, orders, guard) {
        if (collection == null) {
          return [];
        }

        if (!isArray(iteratees)) {
          iteratees = iteratees == null ? [] : [iteratees];
        }

        orders = guard ? undefined$1 : orders;

        if (!isArray(orders)) {
          orders = orders == null ? [] : [orders];
        }

        return baseOrderBy(collection, iteratees, orders);
      }

      var partition = createAggregator(function (result, value, key) {
        result[key ? 0 : 1].push(value);
      }, function () {
        return [[], []];
      });

      function reduce(collection, iteratee, accumulator) {
        var func = isArray(collection) ? arrayReduce : baseReduce,
            initAccum = arguments.length < 3;
        return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
      }

      function reduceRight(collection, iteratee, accumulator) {
        var func = isArray(collection) ? arrayReduceRight : baseReduce,
            initAccum = arguments.length < 3;
        return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEachRight);
      }

      function reject(collection, predicate) {
        var func = isArray(collection) ? arrayFilter : baseFilter;
        return func(collection, negate(getIteratee(predicate, 3)));
      }

      function sample(collection) {
        var func = isArray(collection) ? arraySample : baseSample;
        return func(collection);
      }

      function sampleSize(collection, n, guard) {
        if (guard ? isIterateeCall(collection, n, guard) : n === undefined$1) {
          n = 1;
        } else {
          n = toInteger(n);
        }

        var func = isArray(collection) ? arraySampleSize : baseSampleSize;
        return func(collection, n);
      }

      function shuffle(collection) {
        var func = isArray(collection) ? arrayShuffle : baseShuffle;
        return func(collection);
      }

      function size(collection) {
        if (collection == null) {
          return 0;
        }

        if (isArrayLike(collection)) {
          return isString(collection) ? stringSize(collection) : collection.length;
        }

        var tag = getTag(collection);

        if (tag == mapTag || tag == setTag) {
          return collection.size;
        }

        return baseKeys(collection).length;
      }

      function some(collection, predicate, guard) {
        var func = isArray(collection) ? arraySome : baseSome;

        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined$1;
        }

        return func(collection, getIteratee(predicate, 3));
      }

      var sortBy = baseRest(function (collection, iteratees) {
        if (collection == null) {
          return [];
        }

        var length = iteratees.length;

        if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
          iteratees = [];
        } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
          iteratees = [iteratees[0]];
        }

        return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
      });

      var now = ctxNow || function () {
        return root.Date.now();
      };

      function after(n, func) {
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }

        n = toInteger(n);
        return function () {
          if (--n < 1) {
            return func.apply(this, arguments);
          }
        };
      }

      function ary(func, n, guard) {
        n = guard ? undefined$1 : n;
        n = func && n == null ? func.length : n;
        return createWrap(func, WRAP_ARY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, n);
      }

      function before(n, func) {
        var result;

        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }

        n = toInteger(n);
        return function () {
          if (--n > 0) {
            result = func.apply(this, arguments);
          }

          if (n <= 1) {
            func = undefined$1;
          }

          return result;
        };
      }

      var bind = baseRest(function (func, thisArg, partials) {
        var bitmask = WRAP_BIND_FLAG;

        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bind));
          bitmask |= WRAP_PARTIAL_FLAG;
        }

        return createWrap(func, bitmask, thisArg, partials, holders);
      });
      var bindKey = baseRest(function (object, key, partials) {
        var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;

        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bindKey));
          bitmask |= WRAP_PARTIAL_FLAG;
        }

        return createWrap(key, bitmask, object, partials, holders);
      });

      function curry(func, arity, guard) {
        arity = guard ? undefined$1 : arity;
        var result = createWrap(func, WRAP_CURRY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
        result.placeholder = curry.placeholder;
        return result;
      }

      function curryRight(func, arity, guard) {
        arity = guard ? undefined$1 : arity;
        var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
        result.placeholder = curryRight.placeholder;
        return result;
      }

      function debounce(func, wait, options) {
        var lastArgs,
            lastThis,
            maxWait,
            result,
            timerId,
            lastCallTime,
            lastInvokeTime = 0,
            leading = false,
            maxing = false,
            trailing = true;

        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }

        wait = toNumber(wait) || 0;

        if (isObject(options)) {
          leading = !!options.leading;
          maxing = 'maxWait' in options;
          maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
          trailing = 'trailing' in options ? !!options.trailing : trailing;
        }

        function invokeFunc(time) {
          var args = lastArgs,
              thisArg = lastThis;
          lastArgs = lastThis = undefined$1;
          lastInvokeTime = time;
          result = func.apply(thisArg, args);
          return result;
        }

        function leadingEdge(time) {
          lastInvokeTime = time;
          timerId = setTimeout(timerExpired, wait);
          return leading ? invokeFunc(time) : result;
        }

        function remainingWait(time) {
          var timeSinceLastCall = time - lastCallTime,
              timeSinceLastInvoke = time - lastInvokeTime,
              timeWaiting = wait - timeSinceLastCall;
          return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
        }

        function shouldInvoke(time) {
          var timeSinceLastCall = time - lastCallTime,
              timeSinceLastInvoke = time - lastInvokeTime;
          return lastCallTime === undefined$1 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
        }

        function timerExpired() {
          var time = now();

          if (shouldInvoke(time)) {
            return trailingEdge(time);
          }

          timerId = setTimeout(timerExpired, remainingWait(time));
        }

        function trailingEdge(time) {
          timerId = undefined$1;

          if (trailing && lastArgs) {
            return invokeFunc(time);
          }

          lastArgs = lastThis = undefined$1;
          return result;
        }

        function cancel() {
          if (timerId !== undefined$1) {
            clearTimeout(timerId);
          }

          lastInvokeTime = 0;
          lastArgs = lastCallTime = lastThis = timerId = undefined$1;
        }

        function flush() {
          return timerId === undefined$1 ? result : trailingEdge(now());
        }

        function debounced() {
          var time = now(),
              isInvoking = shouldInvoke(time);
          lastArgs = arguments;
          lastThis = this;
          lastCallTime = time;

          if (isInvoking) {
            if (timerId === undefined$1) {
              return leadingEdge(lastCallTime);
            }

            if (maxing) {
              clearTimeout(timerId);
              timerId = setTimeout(timerExpired, wait);
              return invokeFunc(lastCallTime);
            }
          }

          if (timerId === undefined$1) {
            timerId = setTimeout(timerExpired, wait);
          }

          return result;
        }

        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
      }

      var defer = baseRest(function (func, args) {
        return baseDelay(func, 1, args);
      });
      var delay = baseRest(function (func, wait, args) {
        return baseDelay(func, toNumber(wait) || 0, args);
      });

      function flip(func) {
        return createWrap(func, WRAP_FLIP_FLAG);
      }

      function memoize(func, resolver) {
        if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }

        var memoized = function memoized() {
          var args = arguments,
              key = resolver ? resolver.apply(this, args) : args[0],
              cache = memoized.cache;

          if (cache.has(key)) {
            return cache.get(key);
          }

          var result = func.apply(this, args);
          memoized.cache = cache.set(key, result) || cache;
          return result;
        };

        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }

      memoize.Cache = MapCache;

      function negate(predicate) {
        if (typeof predicate != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }

        return function () {
          var args = arguments;

          switch (args.length) {
            case 0:
              return !predicate.call(this);

            case 1:
              return !predicate.call(this, args[0]);

            case 2:
              return !predicate.call(this, args[0], args[1]);

            case 3:
              return !predicate.call(this, args[0], args[1], args[2]);
          }

          return !predicate.apply(this, args);
        };
      }

      function once(func) {
        return before(2, func);
      }

      var overArgs = castRest(function (func, transforms) {
        transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(getIteratee())) : arrayMap(baseFlatten(transforms, 1), baseUnary(getIteratee()));
        var funcsLength = transforms.length;
        return baseRest(function (args) {
          var index = -1,
              length = nativeMin(args.length, funcsLength);

          while (++index < length) {
            args[index] = transforms[index].call(this, args[index]);
          }

          return apply(func, this, args);
        });
      });
      var partial = baseRest(function (func, partials) {
        var holders = replaceHolders(partials, getHolder(partial));
        return createWrap(func, WRAP_PARTIAL_FLAG, undefined$1, partials, holders);
      });
      var partialRight = baseRest(function (func, partials) {
        var holders = replaceHolders(partials, getHolder(partialRight));
        return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined$1, partials, holders);
      });
      var rearg = flatRest(function (func, indexes) {
        return createWrap(func, WRAP_REARG_FLAG, undefined$1, undefined$1, undefined$1, indexes);
      });

      function rest(func, start) {
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }

        start = start === undefined$1 ? start : toInteger(start);
        return baseRest(func, start);
      }

      function spread(func, start) {
        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }

        start = start == null ? 0 : nativeMax(toInteger(start), 0);
        return baseRest(function (args) {
          var array = args[start],
              otherArgs = castSlice(args, 0, start);

          if (array) {
            arrayPush(otherArgs, array);
          }

          return apply(func, this, otherArgs);
        });
      }

      function throttle(func, wait, options) {
        var leading = true,
            trailing = true;

        if (typeof func != 'function') {
          throw new TypeError(FUNC_ERROR_TEXT);
        }

        if (isObject(options)) {
          leading = 'leading' in options ? !!options.leading : leading;
          trailing = 'trailing' in options ? !!options.trailing : trailing;
        }

        return debounce(func, wait, {
          'leading': leading,
          'maxWait': wait,
          'trailing': trailing
        });
      }

      function unary(func) {
        return ary(func, 1);
      }

      function wrap(value, wrapper) {
        return partial(castFunction(wrapper), value);
      }

      function castArray() {
        if (!arguments.length) {
          return [];
        }

        var value = arguments[0];
        return isArray(value) ? value : [value];
      }

      function clone(value) {
        return baseClone(value, CLONE_SYMBOLS_FLAG);
      }

      function cloneWith(value, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
      }

      function cloneDeep(value) {
        return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
      }

      function cloneDeepWith(value, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
      }

      function conformsTo(object, source) {
        return source == null || baseConformsTo(object, source, keys(source));
      }

      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }

      var gt = createRelationalOperation(baseGt);
      var gte = createRelationalOperation(function (value, other) {
        return value >= other;
      });
      var isArguments = baseIsArguments(function () {
        return arguments;
      }()) ? baseIsArguments : function (value) {
        return isObjectLike(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
      };
      var isArray = Array.isArray;
      var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }

      function isArrayLikeObject(value) {
        return isObjectLike(value) && isArrayLike(value);
      }

      function isBoolean(value) {
        return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
      }

      var isBuffer = nativeIsBuffer || stubFalse;
      var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

      function isElement(value) {
        return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
      }

      function isEmpty(value) {
        if (value == null) {
          return true;
        }

        if (isArrayLike(value) && (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
          return !value.length;
        }

        var tag = getTag(value);

        if (tag == mapTag || tag == setTag) {
          return !value.size;
        }

        if (isPrototype(value)) {
          return !baseKeys(value).length;
        }

        for (var key in value) {
          if (hasOwnProperty.call(value, key)) {
            return false;
          }
        }

        return true;
      }

      function isEqual(value, other) {
        return baseIsEqual(value, other);
      }

      function isEqualWith(value, other, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        var result = customizer ? customizer(value, other) : undefined$1;
        return result === undefined$1 ? baseIsEqual(value, other, undefined$1, customizer) : !!result;
      }

      function isError(value) {
        if (!isObjectLike(value)) {
          return false;
        }

        var tag = baseGetTag(value);
        return tag == errorTag || tag == domExcTag || typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value);
      }

      function isFinite(value) {
        return typeof value == 'number' && nativeIsFinite(value);
      }

      function isFunction(value) {
        if (!isObject(value)) {
          return false;
        }

        var tag = baseGetTag(value);
        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
      }

      function isInteger(value) {
        return typeof value == 'number' && value == toInteger(value);
      }

      function isLength(value) {
        return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }

      function isObject(value) {
        var type = typeof value;
        return value != null && (type == 'object' || type == 'function');
      }

      function isObjectLike(value) {
        return value != null && typeof value == 'object';
      }

      var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

      function isMatch(object, source) {
        return object === source || baseIsMatch(object, source, getMatchData(source));
      }

      function isMatchWith(object, source, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return baseIsMatch(object, source, getMatchData(source), customizer);
      }

      function isNaN(value) {
        return isNumber(value) && value != +value;
      }

      function isNative(value) {
        if (isMaskable(value)) {
          throw new Error(CORE_ERROR_TEXT);
        }

        return baseIsNative(value);
      }

      function isNull(value) {
        return value === null;
      }

      function isNil(value) {
        return value == null;
      }

      function isNumber(value) {
        return typeof value == 'number' || isObjectLike(value) && baseGetTag(value) == numberTag;
      }

      function isPlainObject(value) {
        if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
          return false;
        }

        var proto = getPrototype(value);

        if (proto === null) {
          return true;
        }

        var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
        return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
      }

      var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

      function isSafeInteger(value) {
        return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
      }

      var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

      function isString(value) {
        return typeof value == 'string' || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
      }

      function isSymbol(value) {
        return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
      }

      var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

      function isUndefined(value) {
        return value === undefined$1;
      }

      function isWeakMap(value) {
        return isObjectLike(value) && getTag(value) == weakMapTag;
      }

      function isWeakSet(value) {
        return isObjectLike(value) && baseGetTag(value) == weakSetTag;
      }

      var lt = createRelationalOperation(baseLt);
      var lte = createRelationalOperation(function (value, other) {
        return value <= other;
      });

      function toArray(value) {
        if (!value) {
          return [];
        }

        if (isArrayLike(value)) {
          return isString(value) ? stringToArray(value) : copyArray(value);
        }

        if (symIterator && value[symIterator]) {
          return iteratorToArray(value[symIterator]());
        }

        var tag = getTag(value),
            func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
        return func(value);
      }

      function toFinite(value) {
        if (!value) {
          return value === 0 ? value : 0;
        }

        value = toNumber(value);

        if (value === INFINITY || value === -INFINITY) {
          var sign = value < 0 ? -1 : 1;
          return sign * MAX_INTEGER;
        }

        return value === value ? value : 0;
      }

      function toInteger(value) {
        var result = toFinite(value),
            remainder = result % 1;
        return result === result ? remainder ? result - remainder : result : 0;
      }

      function toLength(value) {
        return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
      }

      function toNumber(value) {
        if (typeof value == 'number') {
          return value;
        }

        if (isSymbol(value)) {
          return NAN;
        }

        if (isObject(value)) {
          var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
          value = isObject(other) ? other + '' : other;
        }

        if (typeof value != 'string') {
          return value === 0 ? value : +value;
        }

        value = value.replace(reTrim, '');
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
      }

      function toPlainObject(value) {
        return copyObject(value, keysIn(value));
      }

      function toSafeInteger(value) {
        return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
      }

      function toString(value) {
        return value == null ? '' : baseToString(value);
      }

      var assign = createAssigner(function (object, source) {
        if (isPrototype(source) || isArrayLike(source)) {
          copyObject(source, keys(source), object);
          return;
        }

        for (var key in source) {
          if (hasOwnProperty.call(source, key)) {
            assignValue(object, key, source[key]);
          }
        }
      });
      var assignIn = createAssigner(function (object, source) {
        copyObject(source, keysIn(source), object);
      });
      var assignInWith = createAssigner(function (object, source, srcIndex, customizer) {
        copyObject(source, keysIn(source), object, customizer);
      });
      var assignWith = createAssigner(function (object, source, srcIndex, customizer) {
        copyObject(source, keys(source), object, customizer);
      });
      var at = flatRest(baseAt);

      function create(prototype, properties) {
        var result = baseCreate(prototype);
        return properties == null ? result : baseAssign(result, properties);
      }

      var defaults = baseRest(function (object, sources) {
        object = Object(object);
        var index = -1;
        var length = sources.length;
        var guard = length > 2 ? sources[2] : undefined$1;

        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          length = 1;
        }

        while (++index < length) {
          var source = sources[index];
          var props = keysIn(source);
          var propsIndex = -1;
          var propsLength = props.length;

          while (++propsIndex < propsLength) {
            var key = props[propsIndex];
            var value = object[key];

            if (value === undefined$1 || eq(value, objectProto[key]) && !hasOwnProperty.call(object, key)) {
              object[key] = source[key];
            }
          }
        }

        return object;
      });
      var defaultsDeep = baseRest(function (args) {
        args.push(undefined$1, customDefaultsMerge);
        return apply(mergeWith, undefined$1, args);
      });

      function findKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
      }

      function findLastKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
      }

      function forIn(object, iteratee) {
        return object == null ? object : baseFor(object, getIteratee(iteratee, 3), keysIn);
      }

      function forInRight(object, iteratee) {
        return object == null ? object : baseForRight(object, getIteratee(iteratee, 3), keysIn);
      }

      function forOwn(object, iteratee) {
        return object && baseForOwn(object, getIteratee(iteratee, 3));
      }

      function forOwnRight(object, iteratee) {
        return object && baseForOwnRight(object, getIteratee(iteratee, 3));
      }

      function functions(object) {
        return object == null ? [] : baseFunctions(object, keys(object));
      }

      function functionsIn(object) {
        return object == null ? [] : baseFunctions(object, keysIn(object));
      }

      function get(object, path, defaultValue) {
        var result = object == null ? undefined$1 : baseGet(object, path);
        return result === undefined$1 ? defaultValue : result;
      }

      function has(object, path) {
        return object != null && hasPath(object, path, baseHas);
      }

      function hasIn(object, path) {
        return object != null && hasPath(object, path, baseHasIn);
      }

      var invert = createInverter(function (result, value, key) {
        if (value != null && typeof value.toString != 'function') {
          value = nativeObjectToString.call(value);
        }

        result[value] = key;
      }, constant(identity));
      var invertBy = createInverter(function (result, value, key) {
        if (value != null && typeof value.toString != 'function') {
          value = nativeObjectToString.call(value);
        }

        if (hasOwnProperty.call(result, value)) {
          result[value].push(key);
        } else {
          result[value] = [key];
        }
      }, getIteratee);
      var invoke = baseRest(baseInvoke);

      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }

      function keysIn(object) {
        return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
      }

      function mapKeys(object, iteratee) {
        var result = {};
        iteratee = getIteratee(iteratee, 3);
        baseForOwn(object, function (value, key, object) {
          baseAssignValue(result, iteratee(value, key, object), value);
        });
        return result;
      }

      function mapValues(object, iteratee) {
        var result = {};
        iteratee = getIteratee(iteratee, 3);
        baseForOwn(object, function (value, key, object) {
          baseAssignValue(result, key, iteratee(value, key, object));
        });
        return result;
      }

      var merge = createAssigner(function (object, source, srcIndex) {
        baseMerge(object, source, srcIndex);
      });
      var mergeWith = createAssigner(function (object, source, srcIndex, customizer) {
        baseMerge(object, source, srcIndex, customizer);
      });
      var omit = flatRest(function (object, paths) {
        var result = {};

        if (object == null) {
          return result;
        }

        var isDeep = false;
        paths = arrayMap(paths, function (path) {
          path = castPath(path, object);
          isDeep || (isDeep = path.length > 1);
          return path;
        });
        copyObject(object, getAllKeysIn(object), result);

        if (isDeep) {
          result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
        }

        var length = paths.length;

        while (length--) {
          baseUnset(result, paths[length]);
        }

        return result;
      });

      function omitBy(object, predicate) {
        return pickBy(object, negate(getIteratee(predicate)));
      }

      var pick = flatRest(function (object, paths) {
        return object == null ? {} : basePick(object, paths);
      });

      function pickBy(object, predicate) {
        if (object == null) {
          return {};
        }

        var props = arrayMap(getAllKeysIn(object), function (prop) {
          return [prop];
        });
        predicate = getIteratee(predicate);
        return basePickBy(object, props, function (value, path) {
          return predicate(value, path[0]);
        });
      }

      function result(object, path, defaultValue) {
        path = castPath(path, object);
        var index = -1,
            length = path.length;

        if (!length) {
          length = 1;
          object = undefined$1;
        }

        while (++index < length) {
          var value = object == null ? undefined$1 : object[toKey(path[index])];

          if (value === undefined$1) {
            index = length;
            value = defaultValue;
          }

          object = isFunction(value) ? value.call(object) : value;
        }

        return object;
      }

      function set(object, path, value) {
        return object == null ? object : baseSet(object, path, value);
      }

      function setWith(object, path, value, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return object == null ? object : baseSet(object, path, value, customizer);
      }

      var toPairs = createToPairs(keys);
      var toPairsIn = createToPairs(keysIn);

      function transform(object, iteratee, accumulator) {
        var isArr = isArray(object),
            isArrLike = isArr || isBuffer(object) || isTypedArray(object);
        iteratee = getIteratee(iteratee, 4);

        if (accumulator == null) {
          var Ctor = object && object.constructor;

          if (isArrLike) {
            accumulator = isArr ? new Ctor() : [];
          } else if (isObject(object)) {
            accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
          } else {
            accumulator = {};
          }
        }

        (isArrLike ? arrayEach : baseForOwn)(object, function (value, index, object) {
          return iteratee(accumulator, value, index, object);
        });
        return accumulator;
      }

      function unset(object, path) {
        return object == null ? true : baseUnset(object, path);
      }

      function update(object, path, updater) {
        return object == null ? object : baseUpdate(object, path, castFunction(updater));
      }

      function updateWith(object, path, updater, customizer) {
        customizer = typeof customizer == 'function' ? customizer : undefined$1;
        return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
      }

      function values(object) {
        return object == null ? [] : baseValues(object, keys(object));
      }

      function valuesIn(object) {
        return object == null ? [] : baseValues(object, keysIn(object));
      }

      function clamp(number, lower, upper) {
        if (upper === undefined$1) {
          upper = lower;
          lower = undefined$1;
        }

        if (upper !== undefined$1) {
          upper = toNumber(upper);
          upper = upper === upper ? upper : 0;
        }

        if (lower !== undefined$1) {
          lower = toNumber(lower);
          lower = lower === lower ? lower : 0;
        }

        return baseClamp(toNumber(number), lower, upper);
      }

      function inRange(number, start, end) {
        start = toFinite(start);

        if (end === undefined$1) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }

        number = toNumber(number);
        return baseInRange(number, start, end);
      }

      function random(lower, upper, floating) {
        if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
          upper = floating = undefined$1;
        }

        if (floating === undefined$1) {
          if (typeof upper == 'boolean') {
            floating = upper;
            upper = undefined$1;
          } else if (typeof lower == 'boolean') {
            floating = lower;
            lower = undefined$1;
          }
        }

        if (lower === undefined$1 && upper === undefined$1) {
          lower = 0;
          upper = 1;
        } else {
          lower = toFinite(lower);

          if (upper === undefined$1) {
            upper = lower;
            lower = 0;
          } else {
            upper = toFinite(upper);
          }
        }

        if (lower > upper) {
          var temp = lower;
          lower = upper;
          upper = temp;
        }

        if (floating || lower % 1 || upper % 1) {
          var rand = nativeRandom();
          return nativeMin(lower + rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1))), upper);
        }

        return baseRandom(lower, upper);
      }

      var camelCase = createCompounder(function (result, word, index) {
        word = word.toLowerCase();
        return result + (index ? capitalize(word) : word);
      });

      function capitalize(string) {
        return upperFirst(toString(string).toLowerCase());
      }

      function deburr(string) {
        string = toString(string);
        return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
      }

      function endsWith(string, target, position) {
        string = toString(string);
        target = baseToString(target);
        var length = string.length;
        position = position === undefined$1 ? length : baseClamp(toInteger(position), 0, length);
        var end = position;
        position -= target.length;
        return position >= 0 && string.slice(position, end) == target;
      }

      function escape(string) {
        string = toString(string);
        return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
      }

      function escapeRegExp(string) {
        string = toString(string);
        return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string;
      }

      var kebabCase = createCompounder(function (result, word, index) {
        return result + (index ? '-' : '') + word.toLowerCase();
      });
      var lowerCase = createCompounder(function (result, word, index) {
        return result + (index ? ' ' : '') + word.toLowerCase();
      });
      var lowerFirst = createCaseFirst('toLowerCase');

      function pad(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;

        if (!length || strLength >= length) {
          return string;
        }

        var mid = (length - strLength) / 2;
        return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
      }

      function padEnd(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
      }

      function padStart(string, length, chars) {
        string = toString(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
      }

      function parseInt(string, radix, guard) {
        if (guard || radix == null) {
          radix = 0;
        } else if (radix) {
          radix = +radix;
        }

        return nativeParseInt(toString(string).replace(reTrimStart, ''), radix || 0);
      }

      function repeat(string, n, guard) {
        if (guard ? isIterateeCall(string, n, guard) : n === undefined$1) {
          n = 1;
        } else {
          n = toInteger(n);
        }

        return baseRepeat(toString(string), n);
      }

      function replace() {
        var args = arguments,
            string = toString(args[0]);
        return args.length < 3 ? string : string.replace(args[1], args[2]);
      }

      var snakeCase = createCompounder(function (result, word, index) {
        return result + (index ? '_' : '') + word.toLowerCase();
      });

      function split(string, separator, limit) {
        if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
          separator = limit = undefined$1;
        }

        limit = limit === undefined$1 ? MAX_ARRAY_LENGTH : limit >>> 0;

        if (!limit) {
          return [];
        }

        string = toString(string);

        if (string && (typeof separator == 'string' || separator != null && !isRegExp(separator))) {
          separator = baseToString(separator);

          if (!separator && hasUnicode(string)) {
            return castSlice(stringToArray(string), 0, limit);
          }
        }

        return string.split(separator, limit);
      }

      var startCase = createCompounder(function (result, word, index) {
        return result + (index ? ' ' : '') + upperFirst(word);
      });

      function startsWith(string, target, position) {
        string = toString(string);
        position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
        target = baseToString(target);
        return string.slice(position, position + target.length) == target;
      }

      function template(string, options, guard) {
        var settings = lodash.templateSettings;

        if (guard && isIterateeCall(string, options, guard)) {
          options = undefined$1;
        }

        string = toString(string);
        options = assignInWith({}, options, settings, customDefaultsAssignIn);
        var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
            importsKeys = keys(imports),
            importsValues = baseValues(imports, importsKeys);
        var isEscaping,
            isEvaluating,
            index = 0,
            interpolate = options.interpolate || reNoMatch,
            source = "__p += '";
        var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
        var sourceURL = '//# sourceURL=' + (hasOwnProperty.call(options, 'sourceURL') ? (options.sourceURL + '').replace(/\s/g, ' ') : 'lodash.templateSources[' + ++templateCounter + ']') + '\n';
        string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
          interpolateValue || (interpolateValue = esTemplateValue);
          source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

          if (escapeValue) {
            isEscaping = true;
            source += "' +\n__e(" + escapeValue + ") +\n'";
          }

          if (evaluateValue) {
            isEvaluating = true;
            source += "';\n" + evaluateValue + ";\n__p += '";
          }

          if (interpolateValue) {
            source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
          }

          index = offset + match.length;
          return match;
        });
        source += "';\n";
        var variable = hasOwnProperty.call(options, 'variable') && options.variable;

        if (!variable) {
          source = 'with (obj) {\n' + source + '\n}\n';
        }

        source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;');
        source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '' : 'obj || (obj = {});\n') + "var __t, __p = ''" + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n" : ';\n') + source + 'return __p\n}';
        var result = attempt(function () {
          return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined$1, importsValues);
        });
        result.source = source;

        if (isError(result)) {
          throw result;
        }

        return result;
      }

      function toLower(value) {
        return toString(value).toLowerCase();
      }

      function toUpper(value) {
        return toString(value).toUpperCase();
      }

      function trim(string, chars, guard) {
        string = toString(string);

        if (string && (guard || chars === undefined$1)) {
          return string.replace(reTrim, '');
        }

        if (!string || !(chars = baseToString(chars))) {
          return string;
        }

        var strSymbols = stringToArray(string),
            chrSymbols = stringToArray(chars),
            start = charsStartIndex(strSymbols, chrSymbols),
            end = charsEndIndex(strSymbols, chrSymbols) + 1;
        return castSlice(strSymbols, start, end).join('');
      }

      function trimEnd(string, chars, guard) {
        string = toString(string);

        if (string && (guard || chars === undefined$1)) {
          return string.replace(reTrimEnd, '');
        }

        if (!string || !(chars = baseToString(chars))) {
          return string;
        }

        var strSymbols = stringToArray(string),
            end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
        return castSlice(strSymbols, 0, end).join('');
      }

      function trimStart(string, chars, guard) {
        string = toString(string);

        if (string && (guard || chars === undefined$1)) {
          return string.replace(reTrimStart, '');
        }

        if (!string || !(chars = baseToString(chars))) {
          return string;
        }

        var strSymbols = stringToArray(string),
            start = charsStartIndex(strSymbols, stringToArray(chars));
        return castSlice(strSymbols, start).join('');
      }

      function truncate(string, options) {
        var length = DEFAULT_TRUNC_LENGTH,
            omission = DEFAULT_TRUNC_OMISSION;

        if (isObject(options)) {
          var separator = 'separator' in options ? options.separator : separator;
          length = 'length' in options ? toInteger(options.length) : length;
          omission = 'omission' in options ? baseToString(options.omission) : omission;
        }

        string = toString(string);
        var strLength = string.length;

        if (hasUnicode(string)) {
          var strSymbols = stringToArray(string);
          strLength = strSymbols.length;
        }

        if (length >= strLength) {
          return string;
        }

        var end = length - stringSize(omission);

        if (end < 1) {
          return omission;
        }

        var result = strSymbols ? castSlice(strSymbols, 0, end).join('') : string.slice(0, end);

        if (separator === undefined$1) {
          return result + omission;
        }

        if (strSymbols) {
          end += result.length - end;
        }

        if (isRegExp(separator)) {
          if (string.slice(end).search(separator)) {
            var match,
                substring = result;

            if (!separator.global) {
              separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
            }

            separator.lastIndex = 0;

            while (match = separator.exec(substring)) {
              var newEnd = match.index;
            }

            result = result.slice(0, newEnd === undefined$1 ? end : newEnd);
          }
        } else if (string.indexOf(baseToString(separator), end) != end) {
          var index = result.lastIndexOf(separator);

          if (index > -1) {
            result = result.slice(0, index);
          }
        }

        return result + omission;
      }

      function unescape(string) {
        string = toString(string);
        return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
      }

      var upperCase = createCompounder(function (result, word, index) {
        return result + (index ? ' ' : '') + word.toUpperCase();
      });
      var upperFirst = createCaseFirst('toUpperCase');

      function words(string, pattern, guard) {
        string = toString(string);
        pattern = guard ? undefined$1 : pattern;

        if (pattern === undefined$1) {
          return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
        }

        return string.match(pattern) || [];
      }

      var attempt = baseRest(function (func, args) {
        try {
          return apply(func, undefined$1, args);
        } catch (e) {
          return isError(e) ? e : new Error(e);
        }
      });
      var bindAll = flatRest(function (object, methodNames) {
        arrayEach(methodNames, function (key) {
          key = toKey(key);
          baseAssignValue(object, key, bind(object[key], object));
        });
        return object;
      });

      function cond(pairs) {
        var length = pairs == null ? 0 : pairs.length,
            toIteratee = getIteratee();
        pairs = !length ? [] : arrayMap(pairs, function (pair) {
          if (typeof pair[1] != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }

          return [toIteratee(pair[0]), pair[1]];
        });
        return baseRest(function (args) {
          var index = -1;

          while (++index < length) {
            var pair = pairs[index];

            if (apply(pair[0], this, args)) {
              return apply(pair[1], this, args);
            }
          }
        });
      }

      function conforms(source) {
        return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
      }

      function constant(value) {
        return function () {
          return value;
        };
      }

      function defaultTo(value, defaultValue) {
        return value == null || value !== value ? defaultValue : value;
      }

      var flow = createFlow();
      var flowRight = createFlow(true);

      function identity(value) {
        return value;
      }

      function iteratee(func) {
        return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
      }

      function matches(source) {
        return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
      }

      function matchesProperty(path, srcValue) {
        return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
      }

      var method = baseRest(function (path, args) {
        return function (object) {
          return baseInvoke(object, path, args);
        };
      });
      var methodOf = baseRest(function (object, args) {
        return function (path) {
          return baseInvoke(object, path, args);
        };
      });

      function mixin(object, source, options) {
        var props = keys(source),
            methodNames = baseFunctions(source, props);

        if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
          options = source;
          source = object;
          object = this;
          methodNames = baseFunctions(source, keys(source));
        }

        var chain = !(isObject(options) && 'chain' in options) || !!options.chain,
            isFunc = isFunction(object);
        arrayEach(methodNames, function (methodName) {
          var func = source[methodName];
          object[methodName] = func;

          if (isFunc) {
            object.prototype[methodName] = function () {
              var chainAll = this.__chain__;

              if (chain || chainAll) {
                var result = object(this.__wrapped__),
                    actions = result.__actions__ = copyArray(this.__actions__);
                actions.push({
                  'func': func,
                  'args': arguments,
                  'thisArg': object
                });
                result.__chain__ = chainAll;
                return result;
              }

              return func.apply(object, arrayPush([this.value()], arguments));
            };
          }
        });
        return object;
      }

      function noConflict() {
        if (root._ === this) {
          root._ = oldDash;
        }

        return this;
      }

      function noop() {}

      function nthArg(n) {
        n = toInteger(n);
        return baseRest(function (args) {
          return baseNth(args, n);
        });
      }

      var over = createOver(arrayMap);
      var overEvery = createOver(arrayEvery);
      var overSome = createOver(arraySome);

      function property(path) {
        return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
      }

      function propertyOf(object) {
        return function (path) {
          return object == null ? undefined$1 : baseGet(object, path);
        };
      }

      var range = createRange();
      var rangeRight = createRange(true);

      function stubArray() {
        return [];
      }

      function stubFalse() {
        return false;
      }

      function stubObject() {
        return {};
      }

      function stubString() {
        return '';
      }

      function stubTrue() {
        return true;
      }

      function times(n, iteratee) {
        n = toInteger(n);

        if (n < 1 || n > MAX_SAFE_INTEGER) {
          return [];
        }

        var index = MAX_ARRAY_LENGTH,
            length = nativeMin(n, MAX_ARRAY_LENGTH);
        iteratee = getIteratee(iteratee);
        n -= MAX_ARRAY_LENGTH;
        var result = baseTimes(length, iteratee);

        while (++index < n) {
          iteratee(index);
        }

        return result;
      }

      function toPath(value) {
        if (isArray(value)) {
          return arrayMap(value, toKey);
        }

        return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
      }

      function uniqueId(prefix) {
        var id = ++idCounter;
        return toString(prefix) + id;
      }

      var add = createMathOperation(function (augend, addend) {
        return augend + addend;
      }, 0);
      var ceil = createRound('ceil');
      var divide = createMathOperation(function (dividend, divisor) {
        return dividend / divisor;
      }, 1);
      var floor = createRound('floor');

      function max(array) {
        return array && array.length ? baseExtremum(array, identity, baseGt) : undefined$1;
      }

      function maxBy(array, iteratee) {
        return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseGt) : undefined$1;
      }

      function mean(array) {
        return baseMean(array, identity);
      }

      function meanBy(array, iteratee) {
        return baseMean(array, getIteratee(iteratee, 2));
      }

      function min(array) {
        return array && array.length ? baseExtremum(array, identity, baseLt) : undefined$1;
      }

      function minBy(array, iteratee) {
        return array && array.length ? baseExtremum(array, getIteratee(iteratee, 2), baseLt) : undefined$1;
      }

      var multiply = createMathOperation(function (multiplier, multiplicand) {
        return multiplier * multiplicand;
      }, 1);
      var round = createRound('round');
      var subtract = createMathOperation(function (minuend, subtrahend) {
        return minuend - subtrahend;
      }, 0);

      function sum(array) {
        return array && array.length ? baseSum(array, identity) : 0;
      }

      function sumBy(array, iteratee) {
        return array && array.length ? baseSum(array, getIteratee(iteratee, 2)) : 0;
      }

      lodash.after = after;
      lodash.ary = ary;
      lodash.assign = assign;
      lodash.assignIn = assignIn;
      lodash.assignInWith = assignInWith;
      lodash.assignWith = assignWith;
      lodash.at = at;
      lodash.before = before;
      lodash.bind = bind;
      lodash.bindAll = bindAll;
      lodash.bindKey = bindKey;
      lodash.castArray = castArray;
      lodash.chain = chain;
      lodash.chunk = chunk;
      lodash.compact = compact;
      lodash.concat = concat;
      lodash.cond = cond;
      lodash.conforms = conforms;
      lodash.constant = constant;
      lodash.countBy = countBy;
      lodash.create = create;
      lodash.curry = curry;
      lodash.curryRight = curryRight;
      lodash.debounce = debounce;
      lodash.defaults = defaults;
      lodash.defaultsDeep = defaultsDeep;
      lodash.defer = defer;
      lodash.delay = delay;
      lodash.difference = difference;
      lodash.differenceBy = differenceBy;
      lodash.differenceWith = differenceWith;
      lodash.drop = drop;
      lodash.dropRight = dropRight;
      lodash.dropRightWhile = dropRightWhile;
      lodash.dropWhile = dropWhile;
      lodash.fill = fill;
      lodash.filter = filter;
      lodash.flatMap = flatMap;
      lodash.flatMapDeep = flatMapDeep;
      lodash.flatMapDepth = flatMapDepth;
      lodash.flatten = flatten;
      lodash.flattenDeep = flattenDeep;
      lodash.flattenDepth = flattenDepth;
      lodash.flip = flip;
      lodash.flow = flow;
      lodash.flowRight = flowRight;
      lodash.fromPairs = fromPairs;
      lodash.functions = functions;
      lodash.functionsIn = functionsIn;
      lodash.groupBy = groupBy;
      lodash.initial = initial;
      lodash.intersection = intersection;
      lodash.intersectionBy = intersectionBy;
      lodash.intersectionWith = intersectionWith;
      lodash.invert = invert;
      lodash.invertBy = invertBy;
      lodash.invokeMap = invokeMap;
      lodash.iteratee = iteratee;
      lodash.keyBy = keyBy;
      lodash.keys = keys;
      lodash.keysIn = keysIn;
      lodash.map = map;
      lodash.mapKeys = mapKeys;
      lodash.mapValues = mapValues;
      lodash.matches = matches;
      lodash.matchesProperty = matchesProperty;
      lodash.memoize = memoize;
      lodash.merge = merge;
      lodash.mergeWith = mergeWith;
      lodash.method = method;
      lodash.methodOf = methodOf;
      lodash.mixin = mixin;
      lodash.negate = negate;
      lodash.nthArg = nthArg;
      lodash.omit = omit;
      lodash.omitBy = omitBy;
      lodash.once = once;
      lodash.orderBy = orderBy;
      lodash.over = over;
      lodash.overArgs = overArgs;
      lodash.overEvery = overEvery;
      lodash.overSome = overSome;
      lodash.partial = partial;
      lodash.partialRight = partialRight;
      lodash.partition = partition;
      lodash.pick = pick;
      lodash.pickBy = pickBy;
      lodash.property = property;
      lodash.propertyOf = propertyOf;
      lodash.pull = pull;
      lodash.pullAll = pullAll;
      lodash.pullAllBy = pullAllBy;
      lodash.pullAllWith = pullAllWith;
      lodash.pullAt = pullAt;
      lodash.range = range;
      lodash.rangeRight = rangeRight;
      lodash.rearg = rearg;
      lodash.reject = reject;
      lodash.remove = remove;
      lodash.rest = rest;
      lodash.reverse = reverse;
      lodash.sampleSize = sampleSize;
      lodash.set = set;
      lodash.setWith = setWith;
      lodash.shuffle = shuffle;
      lodash.slice = slice;
      lodash.sortBy = sortBy;
      lodash.sortedUniq = sortedUniq;
      lodash.sortedUniqBy = sortedUniqBy;
      lodash.split = split;
      lodash.spread = spread;
      lodash.tail = tail;
      lodash.take = take;
      lodash.takeRight = takeRight;
      lodash.takeRightWhile = takeRightWhile;
      lodash.takeWhile = takeWhile;
      lodash.tap = tap;
      lodash.throttle = throttle;
      lodash.thru = thru;
      lodash.toArray = toArray;
      lodash.toPairs = toPairs;
      lodash.toPairsIn = toPairsIn;
      lodash.toPath = toPath;
      lodash.toPlainObject = toPlainObject;
      lodash.transform = transform;
      lodash.unary = unary;
      lodash.union = union;
      lodash.unionBy = unionBy;
      lodash.unionWith = unionWith;
      lodash.uniq = uniq;
      lodash.uniqBy = uniqBy;
      lodash.uniqWith = uniqWith;
      lodash.unset = unset;
      lodash.unzip = unzip;
      lodash.unzipWith = unzipWith;
      lodash.update = update;
      lodash.updateWith = updateWith;
      lodash.values = values;
      lodash.valuesIn = valuesIn;
      lodash.without = without;
      lodash.words = words;
      lodash.wrap = wrap;
      lodash.xor = xor;
      lodash.xorBy = xorBy;
      lodash.xorWith = xorWith;
      lodash.zip = zip;
      lodash.zipObject = zipObject;
      lodash.zipObjectDeep = zipObjectDeep;
      lodash.zipWith = zipWith;
      lodash.entries = toPairs;
      lodash.entriesIn = toPairsIn;
      lodash.extend = assignIn;
      lodash.extendWith = assignInWith;
      mixin(lodash, lodash);
      lodash.add = add;
      lodash.attempt = attempt;
      lodash.camelCase = camelCase;
      lodash.capitalize = capitalize;
      lodash.ceil = ceil;
      lodash.clamp = clamp;
      lodash.clone = clone;
      lodash.cloneDeep = cloneDeep;
      lodash.cloneDeepWith = cloneDeepWith;
      lodash.cloneWith = cloneWith;
      lodash.conformsTo = conformsTo;
      lodash.deburr = deburr;
      lodash.defaultTo = defaultTo;
      lodash.divide = divide;
      lodash.endsWith = endsWith;
      lodash.eq = eq;
      lodash.escape = escape;
      lodash.escapeRegExp = escapeRegExp;
      lodash.every = every;
      lodash.find = find;
      lodash.findIndex = findIndex;
      lodash.findKey = findKey;
      lodash.findLast = findLast;
      lodash.findLastIndex = findLastIndex;
      lodash.findLastKey = findLastKey;
      lodash.floor = floor;
      lodash.forEach = forEach;
      lodash.forEachRight = forEachRight;
      lodash.forIn = forIn;
      lodash.forInRight = forInRight;
      lodash.forOwn = forOwn;
      lodash.forOwnRight = forOwnRight;
      lodash.get = get;
      lodash.gt = gt;
      lodash.gte = gte;
      lodash.has = has;
      lodash.hasIn = hasIn;
      lodash.head = head;
      lodash.identity = identity;
      lodash.includes = includes;
      lodash.indexOf = indexOf;
      lodash.inRange = inRange;
      lodash.invoke = invoke;
      lodash.isArguments = isArguments;
      lodash.isArray = isArray;
      lodash.isArrayBuffer = isArrayBuffer;
      lodash.isArrayLike = isArrayLike;
      lodash.isArrayLikeObject = isArrayLikeObject;
      lodash.isBoolean = isBoolean;
      lodash.isBuffer = isBuffer;
      lodash.isDate = isDate;
      lodash.isElement = isElement;
      lodash.isEmpty = isEmpty;
      lodash.isEqual = isEqual;
      lodash.isEqualWith = isEqualWith;
      lodash.isError = isError;
      lodash.isFinite = isFinite;
      lodash.isFunction = isFunction;
      lodash.isInteger = isInteger;
      lodash.isLength = isLength;
      lodash.isMap = isMap;
      lodash.isMatch = isMatch;
      lodash.isMatchWith = isMatchWith;
      lodash.isNaN = isNaN;
      lodash.isNative = isNative;
      lodash.isNil = isNil;
      lodash.isNull = isNull;
      lodash.isNumber = isNumber;
      lodash.isObject = isObject;
      lodash.isObjectLike = isObjectLike;
      lodash.isPlainObject = isPlainObject;
      lodash.isRegExp = isRegExp;
      lodash.isSafeInteger = isSafeInteger;
      lodash.isSet = isSet;
      lodash.isString = isString;
      lodash.isSymbol = isSymbol;
      lodash.isTypedArray = isTypedArray;
      lodash.isUndefined = isUndefined;
      lodash.isWeakMap = isWeakMap;
      lodash.isWeakSet = isWeakSet;
      lodash.join = join;
      lodash.kebabCase = kebabCase;
      lodash.last = last;
      lodash.lastIndexOf = lastIndexOf;
      lodash.lowerCase = lowerCase;
      lodash.lowerFirst = lowerFirst;
      lodash.lt = lt;
      lodash.lte = lte;
      lodash.max = max;
      lodash.maxBy = maxBy;
      lodash.mean = mean;
      lodash.meanBy = meanBy;
      lodash.min = min;
      lodash.minBy = minBy;
      lodash.stubArray = stubArray;
      lodash.stubFalse = stubFalse;
      lodash.stubObject = stubObject;
      lodash.stubString = stubString;
      lodash.stubTrue = stubTrue;
      lodash.multiply = multiply;
      lodash.nth = nth;
      lodash.noConflict = noConflict;
      lodash.noop = noop;
      lodash.now = now;
      lodash.pad = pad;
      lodash.padEnd = padEnd;
      lodash.padStart = padStart;
      lodash.parseInt = parseInt;
      lodash.random = random;
      lodash.reduce = reduce;
      lodash.reduceRight = reduceRight;
      lodash.repeat = repeat;
      lodash.replace = replace;
      lodash.result = result;
      lodash.round = round;
      lodash.runInContext = runInContext;
      lodash.sample = sample;
      lodash.size = size;
      lodash.snakeCase = snakeCase;
      lodash.some = some;
      lodash.sortedIndex = sortedIndex;
      lodash.sortedIndexBy = sortedIndexBy;
      lodash.sortedIndexOf = sortedIndexOf;
      lodash.sortedLastIndex = sortedLastIndex;
      lodash.sortedLastIndexBy = sortedLastIndexBy;
      lodash.sortedLastIndexOf = sortedLastIndexOf;
      lodash.startCase = startCase;
      lodash.startsWith = startsWith;
      lodash.subtract = subtract;
      lodash.sum = sum;
      lodash.sumBy = sumBy;
      lodash.template = template;
      lodash.times = times;
      lodash.toFinite = toFinite;
      lodash.toInteger = toInteger;
      lodash.toLength = toLength;
      lodash.toLower = toLower;
      lodash.toNumber = toNumber;
      lodash.toSafeInteger = toSafeInteger;
      lodash.toString = toString;
      lodash.toUpper = toUpper;
      lodash.trim = trim;
      lodash.trimEnd = trimEnd;
      lodash.trimStart = trimStart;
      lodash.truncate = truncate;
      lodash.unescape = unescape;
      lodash.uniqueId = uniqueId;
      lodash.upperCase = upperCase;
      lodash.upperFirst = upperFirst;
      lodash.each = forEach;
      lodash.eachRight = forEachRight;
      lodash.first = head;
      mixin(lodash, function () {
        var source = {};
        baseForOwn(lodash, function (func, methodName) {
          if (!hasOwnProperty.call(lodash.prototype, methodName)) {
            source[methodName] = func;
          }
        });
        return source;
      }(), {
        'chain': false
      });
      lodash.VERSION = VERSION;
      arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function (methodName) {
        lodash[methodName].placeholder = lodash;
      });
      arrayEach(['drop', 'take'], function (methodName, index) {
        LazyWrapper.prototype[methodName] = function (n) {
          n = n === undefined$1 ? 1 : nativeMax(toInteger(n), 0);
          var result = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();

          if (result.__filtered__) {
            result.__takeCount__ = nativeMin(n, result.__takeCount__);
          } else {
            result.__views__.push({
              'size': nativeMin(n, MAX_ARRAY_LENGTH),
              'type': methodName + (result.__dir__ < 0 ? 'Right' : '')
            });
          }

          return result;
        };

        LazyWrapper.prototype[methodName + 'Right'] = function (n) {
          return this.reverse()[methodName](n).reverse();
        };
      });
      arrayEach(['filter', 'map', 'takeWhile'], function (methodName, index) {
        var type = index + 1,
            isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;

        LazyWrapper.prototype[methodName] = function (iteratee) {
          var result = this.clone();

          result.__iteratees__.push({
            'iteratee': getIteratee(iteratee, 3),
            'type': type
          });

          result.__filtered__ = result.__filtered__ || isFilter;
          return result;
        };
      });
      arrayEach(['head', 'last'], function (methodName, index) {
        var takeName = 'take' + (index ? 'Right' : '');

        LazyWrapper.prototype[methodName] = function () {
          return this[takeName](1).value()[0];
        };
      });
      arrayEach(['initial', 'tail'], function (methodName, index) {
        var dropName = 'drop' + (index ? '' : 'Right');

        LazyWrapper.prototype[methodName] = function () {
          return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
        };
      });

      LazyWrapper.prototype.compact = function () {
        return this.filter(identity);
      };

      LazyWrapper.prototype.find = function (predicate) {
        return this.filter(predicate).head();
      };

      LazyWrapper.prototype.findLast = function (predicate) {
        return this.reverse().find(predicate);
      };

      LazyWrapper.prototype.invokeMap = baseRest(function (path, args) {
        if (typeof path == 'function') {
          return new LazyWrapper(this);
        }

        return this.map(function (value) {
          return baseInvoke(value, path, args);
        });
      });

      LazyWrapper.prototype.reject = function (predicate) {
        return this.filter(negate(getIteratee(predicate)));
      };

      LazyWrapper.prototype.slice = function (start, end) {
        start = toInteger(start);
        var result = this;

        if (result.__filtered__ && (start > 0 || end < 0)) {
          return new LazyWrapper(result);
        }

        if (start < 0) {
          result = result.takeRight(-start);
        } else if (start) {
          result = result.drop(start);
        }

        if (end !== undefined$1) {
          end = toInteger(end);
          result = end < 0 ? result.dropRight(-end) : result.take(end - start);
        }

        return result;
      };

      LazyWrapper.prototype.takeRightWhile = function (predicate) {
        return this.reverse().takeWhile(predicate).reverse();
      };

      LazyWrapper.prototype.toArray = function () {
        return this.take(MAX_ARRAY_LENGTH);
      };

      baseForOwn(LazyWrapper.prototype, function (func, methodName) {
        var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName),
            isTaker = /^(?:head|last)$/.test(methodName),
            lodashFunc = lodash[isTaker ? 'take' + (methodName == 'last' ? 'Right' : '') : methodName],
            retUnwrapped = isTaker || /^find/.test(methodName);

        if (!lodashFunc) {
          return;
        }

        lodash.prototype[methodName] = function () {
          var value = this.__wrapped__,
              args = isTaker ? [1] : arguments,
              isLazy = value instanceof LazyWrapper,
              iteratee = args[0],
              useLazy = isLazy || isArray(value);

          var interceptor = function interceptor(value) {
            var result = lodashFunc.apply(lodash, arrayPush([value], args));
            return isTaker && chainAll ? result[0] : result;
          };

          if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
            isLazy = useLazy = false;
          }

          var chainAll = this.__chain__,
              isHybrid = !!this.__actions__.length,
              isUnwrapped = retUnwrapped && !chainAll,
              onlyLazy = isLazy && !isHybrid;

          if (!retUnwrapped && useLazy) {
            value = onlyLazy ? value : new LazyWrapper(this);
            var result = func.apply(value, args);

            result.__actions__.push({
              'func': thru,
              'args': [interceptor],
              'thisArg': undefined$1
            });

            return new LodashWrapper(result, chainAll);
          }

          if (isUnwrapped && onlyLazy) {
            return func.apply(this, args);
          }

          result = this.thru(interceptor);
          return isUnwrapped ? isTaker ? result.value()[0] : result.value() : result;
        };
      });
      arrayEach(['pop', 'push', 'shift', 'sort', 'splice', 'unshift'], function (methodName) {
        var func = arrayProto[methodName],
            chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
            retUnwrapped = /^(?:pop|shift)$/.test(methodName);

        lodash.prototype[methodName] = function () {
          var args = arguments;

          if (retUnwrapped && !this.__chain__) {
            var value = this.value();
            return func.apply(isArray(value) ? value : [], args);
          }

          return this[chainName](function (value) {
            return func.apply(isArray(value) ? value : [], args);
          });
        };
      });
      baseForOwn(LazyWrapper.prototype, function (func, methodName) {
        var lodashFunc = lodash[methodName];

        if (lodashFunc) {
          var key = lodashFunc.name + '';

          if (!hasOwnProperty.call(realNames, key)) {
            realNames[key] = [];
          }

          realNames[key].push({
            'name': methodName,
            'func': lodashFunc
          });
        }
      });
      realNames[createHybrid(undefined$1, WRAP_BIND_KEY_FLAG).name] = [{
        'name': 'wrapper',
        'func': undefined$1
      }];
      LazyWrapper.prototype.clone = lazyClone;
      LazyWrapper.prototype.reverse = lazyReverse;
      LazyWrapper.prototype.value = lazyValue;
      lodash.prototype.at = wrapperAt;
      lodash.prototype.chain = wrapperChain;
      lodash.prototype.commit = wrapperCommit;
      lodash.prototype.next = wrapperNext;
      lodash.prototype.plant = wrapperPlant;
      lodash.prototype.reverse = wrapperReverse;
      lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;
      lodash.prototype.first = lodash.prototype.head;

      if (symIterator) {
        lodash.prototype[symIterator] = wrapperToIterator;
      }

      return lodash;
    };

    var _ = runInContext();

    if (freeModule) {
        (freeModule.exports = _)._ = _;
        freeExports._ = _;
      } else {
        root._ = _;
      }
  }).call(commonjsGlobal);
});

var TLSelectAddress = function TLSelectAddress(_ref) {
  var _formData$tradeUnits, _formData$tradeUnits$, _formData$tradeUnits$2, _formData$address5;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      userType = _ref.userType,
      formData = _ref.formData,
      setError = _ref.setError,
      formState = _ref.formState,
      clearErrors = _ref.clearErrors;
  var allCities = Digit.Hooks.tl.useTenants();
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("renew-trade");

  var _ref2 = (formData === null || formData === void 0 ? void 0 : formData.address) || "",
      pincode = _ref2.pincode;

  var cities = userType === "employee" ? allCities.filter(function (city) {
    return city.code === tenantId;
  }) : pincode ? allCities.filter(function (city) {
    var _city$pincode;

    return city === null || city === void 0 ? void 0 : (_city$pincode = city.pincode) === null || _city$pincode === void 0 ? void 0 : _city$pincode.some(function (pin) {
      return pin == pincode;
    });
  }) : allCities;

  var _useState = useState(function () {
    var _formData$address;

    return (formData === null || formData === void 0 ? void 0 : (_formData$address = formData.address) === null || _formData$address === void 0 ? void 0 : _formData$address.city) || null;
  }),
      selectedCity = _useState[0],
      setSelectedCity = _useState[1];

  var _Digit$Hooks$useBound = Digit.Hooks.useBoundaryLocalities(selectedCity === null || selectedCity === void 0 ? void 0 : selectedCity.code, "revenue", {
    enabled: !!selectedCity
  }, t),
      fetchedLocalities = _Digit$Hooks$useBound.data;

  var _useState2 = useState(),
      localities = _useState2[0],
      setLocalities = _useState2[1];

  var _useState3 = useState(),
      selectedLocality = _useState3[0],
      setSelectedLocality = _useState3[1];

  var _useState4 = useState(false),
      isErrors = _useState4[0],
      setIsErrors = _useState4[1];

  useEffect(function () {
    if (cities) {
      if (cities.length === 1) {
        setSelectedCity(cities[0]);
      }
    }
  }, [cities]);
  useEffect(function () {
    if (formData !== null && formData !== void 0 && formData.address) {
      var flag = true;
      Object.keys(formData === null || formData === void 0 ? void 0 : formData.address).map(function (dta) {
        if (dta != "key" || (formData === null || formData === void 0 ? void 0 : formData.address[dta]) != undefined || (formData === null || formData === void 0 ? void 0 : formData.address[dta]) != "" || (formData === null || formData === void 0 ? void 0 : formData.address[dta]) != null) ; else {
          if (flag) setSelectedCity(cities[0]);
          flag = false;
        }
      });
    }
  }, [formData === null || formData === void 0 ? void 0 : (_formData$tradeUnits = formData.tradeUnits) === null || _formData$tradeUnits === void 0 ? void 0 : (_formData$tradeUnits$ = _formData$tradeUnits[0]) === null || _formData$tradeUnits$ === void 0 ? void 0 : (_formData$tradeUnits$2 = _formData$tradeUnits$.tradeCategory) === null || _formData$tradeUnits$2 === void 0 ? void 0 : _formData$tradeUnits$2.code]);
  useEffect(function () {
    if (selectedCity && fetchedLocalities) {
      var _formData$address2, _formData$address3;

      var __localityList = fetchedLocalities;
      var filteredLocalityList = [];

      if (formData !== null && formData !== void 0 && (_formData$address2 = formData.address) !== null && _formData$address2 !== void 0 && _formData$address2.locality) {
        setSelectedLocality(formData.address.locality);
      }

      if (formData !== null && formData !== void 0 && (_formData$address3 = formData.address) !== null && _formData$address3 !== void 0 && _formData$address3.pincode) {
        var _formData$address4;

        filteredLocalityList = __localityList.filter(function (obj) {
          var _obj$pincode;

          return (_obj$pincode = obj.pincode) === null || _obj$pincode === void 0 ? void 0 : _obj$pincode.find(function (item) {
            return item == formData.address.pincode;
          });
        });
        if (!(formData !== null && formData !== void 0 && (_formData$address4 = formData.address) !== null && _formData$address4 !== void 0 && _formData$address4.locality)) setSelectedLocality();
      }

      setLocalities(function () {
        return filteredLocalityList.length > 0 ? filteredLocalityList : __localityList;
      });

      if (filteredLocalityList.length === 1) {
        setSelectedLocality(filteredLocalityList[0]);

        if (userType === "employee") {
          onSelect(config.key, _extends({}, formData[config.key], {
            locality: filteredLocalityList[0]
          }));
        }
      }
    }
  }, [selectedCity, formData === null || formData === void 0 ? void 0 : (_formData$address5 = formData.address) === null || _formData$address5 === void 0 ? void 0 : _formData$address5.pincode, fetchedLocalities]);

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
  }

  function selectLocality(locality) {
    var _formData$address6;

    if (formData !== null && formData !== void 0 && (_formData$address6 = formData.address) !== null && _formData$address6 !== void 0 && _formData$address6.locality) {
      formData.address["locality"] = locality;
    }

    setSelectedLocality(locality);

    if (userType === "employee") {
      onSelect(config.key, _extends({}, formData[config.key], {
        locality: locality
      }));
    }
  }

  function onSubmit() {
    onSelect(config.key, {
      city: selectedCity,
      locality: selectedLocality
    });
  }

  var _useForm = useForm(),
      control = _useForm.control,
      localFormState = _useForm.formState,
      watch = _useForm.watch,
      setLocalError = _useForm.setError,
      clearLocalErrors = _useForm.clearErrors,
      trigger = _useForm.trigger;

  var formValue = watch();
  var errors = localFormState.errors;
  var errorStyle = {
    width: "70%",
    marginLeft: "30%",
    fontSize: "12px",
    marginTop: "-21px"
  };
  useEffect(function () {
    trigger();
  }, []);
  useEffect(function () {
    var keys = Object.keys(formValue);
    var part = {};
    keys.forEach(function (key) {
      var _formData$config$key;

      return part[key] = (_formData$config$key = formData[config.key]) === null || _formData$config$key === void 0 ? void 0 : _formData$config$key[key];
    });

    if (userType === "employee") {
      if (!lodash.isEqual(formValue, part)) {
        Object.keys(formValue).map(function (data) {
          if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
            setIsErrors(true);
          }
        });
        onSelect(config.key, _extends({}, formData[config.key], formValue));
        trigger();
      }
    } else {
      if (!lodash.isEqual(formValue, part)) onSelect(config.key, _extends({}, formData[config.key], formValue));
    }

    for (var key in formValue) {
      if (!formValue[key] && !localFormState.errors[key]) {
        setLocalError(key, {
          type: key.toUpperCase() + "_REQUIRED",
          message: key.toUpperCase() + "_REQUIRED"
        });
      } else if (formValue[key] && localFormState.errors[key]) {
        clearLocalErrors([key]);
      }
    }
  }, [formValue]);
  useEffect(function () {
    if (userType === "employee") {
      var _formState$errors$con;

      if (Object.keys(errors).length && !lodash.isEqual(((_formState$errors$con = formState.errors[config.key]) === null || _formState$errors$con === void 0 ? void 0 : _formState$errors$con.type) || {}, errors)) {
        setError(config.key, {
          type: errors
        });
      } else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
        clearErrors(config.key);
      }
    }
  }, [errors]);
  var checkingLocationForRenew = window.location.href.includes("renew-application-details");
  if (window.location.href.includes("edit-application-details")) checkingLocationForRenew = true;

  if (userType === "employee") {
    var _errors$city, _errors$locality2;

    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
      className: "card-label-smaller"
    }, t("MYCITY_CODE_LABEL") + " * :"), /*#__PURE__*/React.createElement(Controller, {
      name: "city",
      defaultValue: (cities === null || cities === void 0 ? void 0 : cities.length) === 1 ? cities[0] : selectedCity,
      control: control,
      rules: {
        required: t("REQUIRED_FIELD")
      },
      render: function render(props) {
        return /*#__PURE__*/React.createElement(Dropdown, {
          className: "form-field",
          selected: props.value,
          disable: true,
          option: cities,
          select: props.onChange,
          optionKey: "code",
          onBlur: props.onBlur,
          t: t
        });
      }
    })), /*#__PURE__*/React.createElement(CardLabelError, {
      style: errorStyle
    }, localFormState.touched.city ? errors === null || errors === void 0 ? void 0 : (_errors$city = errors.city) === null || _errors$city === void 0 ? void 0 : _errors$city.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
      className: "card-label-smaller"
    }, t("TL_LOCALIZATION_LOCALITY") + " * :"), /*#__PURE__*/React.createElement(Controller, {
      name: "locality",
      defaultValue: checkingLocationForRenew ? formData.address.locality : null,
      control: control,
      rules: {
        required: t("REQUIRED_FIELD")
      },
      render: function render(props) {
        var _errors$locality;

        return /*#__PURE__*/React.createElement(Dropdown, {
          className: "form-field",
          selected: props.value,
          option: localities,
          select: props.onChange,
          onBlur: props.onBlur,
          optionKey: "i18nkey",
          t: t,
          disable: checkingLocationForRenew ? true : false,
          errorStyle: localFormState.touched.locality && errors !== null && errors !== void 0 && (_errors$locality = errors.locality) !== null && _errors$locality !== void 0 && _errors$locality.message ? true : false
        });
      }
    })), /*#__PURE__*/React.createElement(CardLabelError, {
      style: errorStyle
    }, localFormState.touched.locality ? errors === null || errors === void 0 ? void 0 : (_errors$locality2 = errors.locality) === null || _errors$locality2 === void 0 ? void 0 : _errors$locality2.message : ""));
  }

  return /*#__PURE__*/React.createElement(FormStep, {
    config: config,
    onSelect: onSubmit,
    t: t,
    isDisabled: selectedLocality ? false : true
  }, /*#__PURE__*/React.createElement(CardLabel, null, t("MYCITY_CODE_LABEL") + "*"), /*#__PURE__*/React.createElement("span", {
    className: "form-pt-dropdown-only"
  }, /*#__PURE__*/React.createElement(RadioOrSelect, {
    options: cities.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    }),
    selectedOption: selectedCity,
    optionKey: "code",
    onSelect: selectCity,
    t: t,
    isDependent: true,
    labelKey: "TENANT_TENANTS",
    disabled: isEdit
  })), selectedCity && localities && /*#__PURE__*/React.createElement(CardLabel, null, t("TL_LOCALIZATION_LOCALITY") + " "), selectedCity && localities && /*#__PURE__*/React.createElement("span", {
    className: "form-pt-dropdown-only"
  }, /*#__PURE__*/React.createElement(RadioOrSelect, {
    dropdownStyle: {
      paddingBottom: "20px"
    },
    isMandatory: config.isMandatory,
    options: localities.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    }),
    selectedOption: selectedLocality,
    optionKey: "i18nkey",
    onSelect: selectLocality,
    t: t,
    labelKey: "",
    disabled: isEdit
  })));
};

var TLSelectPincode = function TLSelectPincode(_ref) {
  var _formData$address3;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData,
      userType = _ref.userType;
  var tenants = Digit.Hooks.tl.useTenants();

  var _useState = useState(function () {
    var _formData$address;

    return (formData === null || formData === void 0 ? void 0 : (_formData$address = formData.address) === null || _formData$address === void 0 ? void 0 : _formData$address.pincode) || "";
  }),
      pincode = _useState[0],
      setPincode = _useState[1];

  var _useLocation = useLocation(),
      pathname = _useLocation.pathname;

  var presentInModifyApplication = pathname.includes("modify");
  var isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("renew-trade");
  var isRenewal = window.location.href.includes("edit-application") || window.location.href.includes("tl/renew-application-details");
  var inputs = [{
    label: "CORE_COMMON_PINCODE",
    type: "text",
    name: "pincode",
    disable: isEdit,
    validation: {
      minlength: 6,
      maxlength: 7,
      pattern: "^[1-9]{1}[0-9]{2}\\s{0,1}[0-9]{3}$",
      max: "9999999",
      title: t("CORE_COMMON_PINCODE_INVALID")
    }
  }];

  var _useState2 = useState(null),
      pincodeServicability = _useState2[0],
      setPincodeServicability = _useState2[1];

  useEffect(function () {
    var _formData$address2;

    if (formData !== null && formData !== void 0 && (_formData$address2 = formData.address) !== null && _formData$address2 !== void 0 && _formData$address2.pincode) {
      setPincode(formData.address.pincode);
    }
  }, [formData === null || formData === void 0 ? void 0 : (_formData$address3 = formData.address) === null || _formData$address3 === void 0 ? void 0 : _formData$address3.pincode]);

  function onChange(e) {
    setPincode(e.target.value);
    setPincodeServicability(null);

    if (userType === "employee") {
      var foundValue = tenants === null || tenants === void 0 ? void 0 : tenants.find(function (obj) {
        var _obj$pincode;

        return (_obj$pincode = obj.pincode) === null || _obj$pincode === void 0 ? void 0 : _obj$pincode.find(function (item) {
          return item.toString() === e.target.value;
        });
      });

      if (foundValue) {
        var city = tenants.filter(function (obj) {
          var _obj$pincode2;

          return (_obj$pincode2 = obj.pincode) === null || _obj$pincode2 === void 0 ? void 0 : _obj$pincode2.find(function (item) {
            return item == e.target.value;
          });
        })[0];
        onSelect(config.key, _extends({}, formData.address, {
          city: city,
          pincode: e.target.value,
          slum: null
        }));
      } else {
        onSelect(config.key, _extends({}, formData.address, {
          pincode: e.target.value
        }));
        setPincodeServicability("TL_COMMON_PINCODE_NOT_SERVICABLE");
      }
    }
  }

  var goNext = function goNext(data) {
    try {
      var foundValue = tenants === null || tenants === void 0 ? void 0 : tenants.find(function (obj) {
        var _obj$pincode3;

        return (_obj$pincode3 = obj.pincode) === null || _obj$pincode3 === void 0 ? void 0 : _obj$pincode3.find(function (item) {
          return item == (data === null || data === void 0 ? void 0 : data.pincode);
        });
      });

      if (foundValue) {
        onSelect(config.key, {
          pincode: pincode
        });
      } else {
        setPincodeServicability("TL_COMMON_PINCODE_NOT_SERVICABLE");
      }

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  if (userType === "employee") {
    return inputs === null || inputs === void 0 ? void 0 : inputs.map(function (input, index) {
      return /*#__PURE__*/React.createElement(LabelFieldPair, {
        key: index
      }, /*#__PURE__*/React.createElement(CardLabel, {
        className: "card-label-smaller"
      }, t(input.label) + ":"), /*#__PURE__*/React.createElement("div", {
        className: "field"
      }, /*#__PURE__*/React.createElement(TextInput, _extends({
        key: input.name,
        value: pincode,
        onChange: onChange,
        disable: isRenewal
      }, input.validation, {
        autoFocus: presentInModifyApplication
      }))));
    });
  }

  var onSkip = function onSkip() {
    return onSelect();
  };

  return /*#__PURE__*/React.createElement(FormStep, {
    t: t,
    config: _extends({}, config, {
      inputs: inputs
    }),
    onSelect: goNext,
    _defaultValues: {
      pincode: pincode
    },
    onChange: onChange,
    onSkip: onSkip,
    forcedError: t(pincodeServicability),
    isDisabled: !pincode || isEdit
  });
};

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

var Proof = function Proof(_ref) {
  var _formData$owners, _formData$owners$docu, _formData$owners$docu2, _formData$owners2, _formData$owners2$doc, _formData$owners3, _formData$owners3$doc, _formData$owners3$doc2, _Documentsob$Property;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;

  var _useState = useState((formData === null || formData === void 0 ? void 0 : (_formData$owners = formData.owners) === null || _formData$owners === void 0 ? void 0 : (_formData$owners$docu = _formData$owners.documents) === null || _formData$owners$docu === void 0 ? void 0 : (_formData$owners$docu2 = _formData$owners$docu.OwnerPhotoProof) === null || _formData$owners$docu2 === void 0 ? void 0 : _formData$owners$docu2.fileStoreId) || null),
      uploadedFile = _useState[0],
      setUploadedFile = _useState[1];

  var _useState2 = useState(formData === null || formData === void 0 ? void 0 : (_formData$owners2 = formData.owners) === null || _formData$owners2 === void 0 ? void 0 : (_formData$owners2$doc = _formData$owners2.documents) === null || _formData$owners2$doc === void 0 ? void 0 : _formData$owners2$doc.OwnerPhotoProof),
      file = _useState2[0],
      setFile = _useState2[1];

  var _useState3 = useState(null),
      error = _useState3[0],
      setError = _useState3[1];

  var cityDetails = Digit.ULBService.getCurrentUlb();

  var _useState4 = useState((formData === null || formData === void 0 ? void 0 : (_formData$owners3 = formData.owners) === null || _formData$owners3 === void 0 ? void 0 : (_formData$owners3$doc = _formData$owners3.documents) === null || _formData$owners3$doc === void 0 ? void 0 : (_formData$owners3$doc2 = _formData$owners3$doc.OwnerPhotoProof) === null || _formData$owners3$doc2 === void 0 ? void 0 : _formData$owners3$doc2.documentType) || null);

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$pt$usePr = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Documents"),
      _Digit$Hooks$pt$usePr2 = _Digit$Hooks$pt$usePr.data,
      Documentsob = _Digit$Hooks$pt$usePr2 === void 0 ? {} : _Digit$Hooks$pt$usePr2;

  var docs = Documentsob === null || Documentsob === void 0 ? void 0 : (_Documentsob$Property = Documentsob.PropertyTax) === null || _Documentsob$Property === void 0 ? void 0 : _Documentsob$Property.Documents;
  var ownerPhotoProof = Array.isArray(docs) && docs.filter(function (doc) {
    return doc.code.includes("ADDRESSPROOF");
  });

  var handleSubmit = function handleSubmit() {
    var fileStoreId = uploadedFile;
    var fileDetails = file;
    if (fileDetails) fileDetails.documentType = "OWNERPHOTO";
    if (fileDetails) fileDetails.fileStoreId = fileStoreId ? fileStoreId : null;
    var owners = formData === null || formData === void 0 ? void 0 : formData.owners;

    if (owners && owners.documents) {
      owners.documents["OwnerPhotoProof"] = fileDetails;
    } else {
      owners["documents"] = [];
      owners.documents["OwnerPhotoProof"] = fileDetails;
    }

    onSelect(config.key, owners);
  };

  var onSkip = function onSkip() {
    return onSelect();
  };

  function selectfile(e) {
    setUploadedFile(null);
    setFile(e.target.files[0]);
  }

  useEffect(function () {
    (function () {
      try {
        setError(null);

        var _temp4 = function () {
          if (file) {
            var _temp5 = function () {
              if (file.size >= 2000000) {
                setError(t("PT_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
              } else {
                var _temp6 = _catch(function () {
                  return Promise.resolve(Digit.UploadServices.Filestorage("property-upload", file, Digit.ULBService.getStateId())).then(function (response) {
                    var _response$data, _response$data$files;

                    if ((response === null || response === void 0 ? void 0 : (_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$files = _response$data.files) === null || _response$data$files === void 0 ? void 0 : _response$data$files.length) > 0) {
                      var _response$data2, _response$data2$files;

                      setUploadedFile(response === null || response === void 0 ? void 0 : (_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : (_response$data2$files = _response$data2.files[0]) === null || _response$data2$files === void 0 ? void 0 : _response$data2$files.fileStoreId);
                    } else {
                      setError(t("PT_FILE_UPLOAD_ERROR"));
                    }
                  });
                }, function (err) {
                  console.error("Modal -> err ", err);
                });

                if (_temp6 && _temp6.then) return _temp6.then(function () {});
              }
            }();

            if (_temp5 && _temp5.then) return _temp5.then(function () {});
          }
        }();

        return _temp4 && _temp4.then ? _temp4.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [file]);
  return /*#__PURE__*/React.createElement(FormStep, {
    config: config,
    onSelect: handleSubmit,
    onSkip: onSkip,
    t: t,
    isDisabled: !uploadedFile || error
  }, /*#__PURE__*/React.createElement(CardLabelDesc, {
    style: {
      fontWeight: "unset"
    }
  }, t("TL_UPLOAD_PHOTO_RESTRICTIONS_TYPES")), /*#__PURE__*/React.createElement(CardLabelDesc, {
    style: {
      fontWeight: "unset"
    }
  }, t("TL_UPLOAD_RESTRICTIONS_SIZE")), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_CATEGORY_DOCUMENT_TYPE")), /*#__PURE__*/React.createElement(UploadFile, {
    extraStyleName: "propertyCreate",
    accept: ".jpg,.png,.pdf",
    onUpload: selectfile,
    onDelete: function onDelete() {
      setUploadedFile(null);
    },
    message: uploadedFile ? "1 " + t("TL_ACTION_FILEUPLOADED") : t("TL_ACTION_NO_FILEUPLOADED"),
    error: error
  }), error ? /*#__PURE__*/React.createElement("div", {
    style: {
      height: "20px",
      width: "100%",
      fontSize: "20px",
      color: "red",
      marginTop: "5px"
    }
  }, error) : "", /*#__PURE__*/React.createElement("div", {
    style: {
      disabled: "true",
      height: "20px",
      width: "100%"
    }
  }));
};

var SelectOwnerShipDetails = function SelectOwnerShipDetails(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      userType = _ref.userType,
      formData = _ref.formData,
      onBlur = _ref.onBlur,
      formState = _ref.formState,
      setError = _ref.setError,
      clearErrors = _ref.clearErrors;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];
  var isEdit = window.location.href.includes("edit-application") || window.location.href.includes("renew-trade");

  var _useState = useState(formData === null || formData === void 0 ? void 0 : formData.ownershipCategory),
      ownershipCategory = _useState[0],
      setOwnershipCategory = _useState[1];

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "TLOwnerShipCategory"),
      OwnerShipCategoryOb = _Digit$Hooks$tl$useTr.data;

  var ownerShipdropDown = [];
  var OwnerShipCategory = {};
  var SubOwnerShipCategory = {};

  var _useLocation = useLocation(),
      url = _useLocation.pathname;

  var editScreen = url.includes("/modify-application/");
  OwnerShipCategoryOb && OwnerShipCategoryOb.length > 0 && OwnerShipCategoryOb.map(function (category) {
    OwnerShipCategory[category.code] = category;
  });
  getOwnerDetails();

  function formDropdown(category) {
    var name = category.name,
        code = category.code;
    return {
      label: name,
      value: code,
      code: code
    };
  }

  function getDropdwonForProperty(ownerShipdropDown) {
    if (userType === "employee") {
      var _ownerShipdropDown$fi, _ownerShipdropDown$fi2;

      var arr = ownerShipdropDown === null || ownerShipdropDown === void 0 ? void 0 : (_ownerShipdropDown$fi = ownerShipdropDown.filter(function (e) {
        return e.code.split(".").length <= 2;
      })) === null || _ownerShipdropDown$fi === void 0 ? void 0 : (_ownerShipdropDown$fi2 = _ownerShipdropDown$fi.splice(0, 4)) === null || _ownerShipdropDown$fi2 === void 0 ? void 0 : _ownerShipdropDown$fi2.map(function (ownerShipDetails) {
        return _extends({}, ownerShipDetails, {
          i18nKey: "COMMON_MASTERS_OWNERSHIPCATEGORY_INDIVIDUAL_" + (ownerShipDetails.value.split(".")[1] ? ownerShipDetails.value.split(".")[1] : ownerShipDetails.value.split(".")[0])
        });
      });
      var finalArr = arr.filter(function (data) {
        return data.code.includes("INDIVIDUAL");
      });
      return finalArr;
    }

    return ownerShipdropDown && ownerShipdropDown.length && ownerShipdropDown.splice(0, 4).map(function (ownerShipDetails) {
      return _extends({}, ownerShipDetails, {
        i18nKey: "PT_OWNERSHIP_" + (ownerShipDetails.value.split(".")[1] ? ownerShipDetails.value.split(".")[1] : ownerShipDetails.value.split(".")[0])
      });
    }).filter(function (ownerShipDetails) {
      return ownerShipDetails.code.includes("INDIVIDUAL");
    });
  }

  function getOwnerDetails() {
    if (OwnerShipCategory && SubOwnerShipCategory) {
      Object.keys(OwnerShipCategory).forEach(function (category) {
        ownerShipdropDown.push(formDropdown(OwnerShipCategory[category]));
      });
    }
  }

  function selectedValue(value) {
    setOwnershipCategory(value);
  }

  var onSkip = function onSkip() {
    return onSelect();
  };

  function goNext() {
    sessionStorage.setItem("ownershipCategory", ownershipCategory === null || ownershipCategory === void 0 ? void 0 : ownershipCategory.value);
    onSelect(config.key, ownershipCategory);
  }

  useEffect(function () {
    if (userType === "employee") {
      if (!ownershipCategory) setError(config.key, {
        type: "required",
        message: t("REQUIRED_FIELD")
      });else clearErrors(config.key);
      goNext();
    }
  }, [ownershipCategory]);
  var dropdownData = getDropdwonForProperty(ownerShipdropDown);

  if (userType === "employee") {
    var _formState$touched, _formState$errors$con, _formState$touched2, _formState$errors$con2;

    var isRenewal = window.location.href.includes("tl/renew-application-details");
    if (window.location.href.includes("tl/edit-application-details")) isRenewal = true;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
      className: "card-label-smaller",
      style: editScreen ? {
        color: "#B1B4B6"
      } : {}
    }, t("TL_NEW_OWNER_DETAILS_OWNERSHIP_TYPE_LABEL") + " * :"), /*#__PURE__*/React.createElement(Dropdown, {
      className: "form-field",
      selected: ownershipCategory,
      errorStyle: (_formState$touched = formState.touched) !== null && _formState$touched !== void 0 && _formState$touched[config.key] && (_formState$errors$con = formState.errors[config.key]) !== null && _formState$errors$con !== void 0 && _formState$errors$con.message ? true : false,
      disable: isRenewal,
      option: dropdownData,
      select: selectedValue,
      optionKey: "i18nKey",
      onBlur: onBlur,
      t: t
    })), (_formState$touched2 = formState.touched) !== null && _formState$touched2 !== void 0 && _formState$touched2[config.key] ? /*#__PURE__*/React.createElement(CardLabelError, {
      style: {
        width: "70%",
        marginLeft: "30%",
        fontSize: "12px",
        marginTop: "-21px"
      }
    }, (_formState$errors$con2 = formState.errors[config.key]) === null || _formState$errors$con2 === void 0 ? void 0 : _formState$errors$con2.message) : null);
  }

  return /*#__PURE__*/React.createElement(FormStep, {
    t: t,
    config: config,
    onSelect: goNext,
    onSkip: onSkip,
    isDisabled: !ownershipCategory
  }, /*#__PURE__*/React.createElement(RadioButtons, {
    isMandatory: config.isMandatory,
    options: dropdownData ? dropdownData : [],
    selectedOption: ownershipCategory,
    optionsKey: "i18nKey",
    onSelect: selectedValue,
    value: ownershipCategory,
    labelKey: "PT_OWNERSHIP",
    isDependent: true,
    disabled: isEdit
  }));
};

var SelectOwnerDetails = function SelectOwnerDetails(_ref) {
  var _formData$owners, _formData$owners2, _formData$owners3, _formData$owners4, _formData$ownershipCa;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;
  var validation = {};
  var isedittrade = window.location.href.includes("edit-application");
  var isrenewtrade = window.location.href.includes("renew-trade");

  var _useState = useState(isedittrade || isrenewtrade ? false : true),
      canmovenext = _useState[0],
      setCanmovenext = _useState[1];

  var _useState2 = useState((formData === null || formData === void 0 ? void 0 : (_formData$owners = formData.owners) === null || _formData$owners === void 0 ? void 0 : _formData$owners.name) || ""),
      setName = _useState2[1];

  var _useState3 = useState(false),
      setisPrimaryOwner = _useState3[1];

  var _useState4 = useState(formData === null || formData === void 0 ? void 0 : (_formData$owners2 = formData.owners) === null || _formData$owners2 === void 0 ? void 0 : _formData$owners2.gender),
      gender = _useState4[0],
      setGender = _useState4[1];

  var _useState5 = useState((formData === null || formData === void 0 ? void 0 : (_formData$owners3 = formData.owners) === null || _formData$owners3 === void 0 ? void 0 : _formData$owners3.mobilenumber) || ""),
      setMobileNumber = _useState5[1];

  var _useState6 = useState((formData === null || formData === void 0 ? void 0 : formData.owners) && (formData === null || formData === void 0 ? void 0 : (_formData$owners4 = formData.owners) === null || _formData$owners4 === void 0 ? void 0 : _formData$owners4.owners) || [{
    name: "",
    gender: "",
    mobilenumber: null,
    isprimaryowner: false
  }]),
      fields = _useState6[0],
      setFeilds = _useState6[1];

  var ismultiple = formData !== null && formData !== void 0 && (_formData$ownershipCa = formData.ownershipCategory) !== null && _formData$ownershipCa !== void 0 && _formData$ownershipCa.code.includes("SINGLEOWNER") ? false : true;
  useEffect(function () {
    fields.map(function (ob) {
      if (ob.name && ob.mobilenumber && ob.gender) {
        setCanmovenext(false);
      } else {
        setCanmovenext(true);
      }
    });
  }, [fields]);

  var _useLocation = useLocation(),
      url = _useLocation.pathname;

  var editScreen = url.includes("/modify-application/");
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$tl$useTL = Digit.Hooks.tl.useTLGenderMDMS(stateId, "common-masters", "GenderType"),
      Menu = _Digit$Hooks$tl$useTL.data;

  var TLmenu = [];
  Menu && Menu.map(function (genders) {
    TLmenu.push({
      i18nKey: "TL_GENDER_" + genders.code,
      code: "" + genders.code
    });
  });

  function handleAdd() {
    var values = [].concat(fields);
    values.push({
      name: "",
      gender: "",
      mobilenumber: null,
      isprimaryowner: false
    });
    setFeilds(values);
    setCanmovenext(true);
  }

  function handleRemove(index) {
    var values = [].concat(fields);

    if (values.length != 1) {
      values.splice(index, 1);
      setFeilds(values);
    }
  }

  function setOwnerName(i, e) {
    var units = [].concat(fields);
    units[i].name = e.target.value;
    setName(e.target.value);
    setFeilds(units);

    if (units[i].gender && units[i].mobilenumber && units[i].name) {
      setCanmovenext(false);
    }
  }

  function setGenderName(i, value) {
    var units = [].concat(fields);
    units[i].gender = value;
    setGender(value);
    setFeilds(units);

    if (units[i].gender && units[i].mobilenumber && units[i].name) {
      setCanmovenext(false);
    }
  }

  function setMobileNo(i, e) {
    var units = [].concat(fields);
    units[i].mobilenumber = e.target.value;
    setMobileNumber(e.target.value);
    setFeilds(units);

    if (units[i].gender && units[i].mobilenumber && units[i].name) {
      setCanmovenext(false);
    }
  }

  function setPrimaryOwner(i, e) {
    var units = [].concat(fields);
    units.map(function (units) {
      units.isprimaryowner = false;
    });
    units[i].isprimaryowner = ismultiple ? e.target.checked : true;
    setisPrimaryOwner(e.target.checked);
    setFeilds(units);
  }

  var _useState7 = useState(null),
      error = _useState7[0],
      setError = _useState7[1];

  useEffect(function () {
    console.log("Error Loged", error);
  }, [error]);

  var goNext = function goNext() {
    setError(null);

    if (ismultiple == true && fields.length == 1) {
      setError("TL_ERROR_MULTIPLE_OWNER");
    } else {
      var owner = formData.owners;
      var ownerStep;
      ownerStep = _extends({}, owner, {
        owners: fields
      });
      onSelect(config.key, ownerStep);
    }
  };

  var onSkip = function onSkip() {
    return onSelect();
  };
  return /*#__PURE__*/React.createElement(FormStep, {
    config: config,
    onSelect: goNext,
    onSkip: onSkip,
    t: t,
    isDisabled: canmovenext,
    forcedError: t(error)
  }, fields.map(function (field, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: field + "-" + index
    }, /*#__PURE__*/React.createElement("div", {
      style: ismultiple ? {
        border: "solid",
        borderRadius: "5px",
        padding: "10px",
        paddingTop: "20px",
        marginTop: "10px",
        borderColor: "#f3f3f3",
        background: "#FAFAFA"
      } : {}
    }, /*#__PURE__*/React.createElement(CardLabel, {
      style: ismultiple ? {
        marginBottom: "-15px"
      } : {}
    }, "" + t("TL_NEW_OWNER_DETAILS_NAME_LABEL")), ismultiple && /*#__PURE__*/React.createElement(LinkButton, {
      label: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("svg", {
        style: {
          float: "right",
          position: "relative",
          bottom: "5px"
        },
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z",
        fill: !(fields.length == 1) ? "#494848" : "#FAFAFA"
      })))),
      style: {
        width: "100px",
        display: "inline"
      },
      onClick: function onClick(e) {
        return handleRemove(index);
      }
    }), /*#__PURE__*/React.createElement(TextInput, _extends({
      style: ismultiple ? {
        background: "#FAFAFA"
      } : {},
      t: t,
      type: "text",
      isMandatory: false,
      optionKey: "i18nKey",
      name: "name",
      value: field.name,
      onChange: function onChange(e) {
        return setOwnerName(index, e);
      }
    }, validation = {
      isRequired: true,
      pattern: "^[a-zA-Z-.`' ]*$",
      type: "text",
      title: t("TL_NAME_ERROR_MESSAGE")
    })), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_NEW_OWNER_DETAILS_GENDER_LABEL")), /*#__PURE__*/React.createElement(RadioButtons, {
      t: t,
      options: TLmenu,
      optionsKey: "code",
      name: "gender",
      value: gender,
      selectedOption: field.gender,
      onSelect: function onSelect(e) {
        return setGenderName(index, e);
      },
      isDependent: true,
      labelKey: "TL_GENDER"
    }), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_MOBILE_NUMBER_LABEL")), /*#__PURE__*/React.createElement("div", {
      className: "field-container"
    }, /*#__PURE__*/React.createElement("span", {
      className: "employee-card-input employee-card-input--front",
      style: {
        marginTop: "-1px"
      }
    }, "+91"), /*#__PURE__*/React.createElement(TextInput, _extends({
      style: ismultiple ? {
        background: "#FAFAFA"
      } : {},
      type: "text",
      t: t,
      isMandatory: false,
      optionKey: "i18nKey",
      name: "mobilenumber",
      value: field.mobilenumber,
      onChange: function onChange(e) {
        return setMobileNo(index, e);
      }
    }, validation = {
      isRequired: true,
      pattern: "[6-9]{1}[0-9]{9}",
      type: "tel",
      title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")
    }))), ismultiple && /*#__PURE__*/React.createElement(CheckBox, {
      label: t("TL_PRIMARY_OWNER_LABEL"),
      onChange: function onChange(e) {
        return setPrimaryOwner(index, e);
      },
      value: field.isprimaryowner,
      checked: field.isprimaryowner,
      style: {
        paddingTop: "10px"
      }
    })));
  }), ismultiple && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      justifyContent: "center",
      display: "flex",
      paddingBottom: "15px",
      color: "#FF8C00"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      paddingTop: "10px"
    },
    onClick: function onClick() {
      return handleAdd();
    }
  }, t("TL_ADD_OWNER_LABEL")))));
};

var SelectOwnerAddress = function SelectOwnerAddress(_ref) {
  var _formData$owners, _formData$ownershipCa;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      userType = _ref.userType,
      formData = _ref.formData;

  var _useState = useState((formData === null || formData === void 0 ? void 0 : (_formData$owners = formData.owners) === null || _formData$owners === void 0 ? void 0 : _formData$owners.permanentAddress) || ""),
      permanentAddress = _useState[0],
      setPermanentAddress = _useState[1];

  var _useState2 = useState(formData.owners.isCorrespondenceAddress),
      isCorrespondenceAddress = _useState2[0],
      setIsCorrespondenceAddress = _useState2[1];

  var isedittrade = window.location.href.includes("edit-application");
  var isrenewtrade = window.location.href.includes("renew-trade");

  var _useLocation = useLocation(),
      url = _useLocation.pathname;

  var editScreen = url.includes("/modify-application/");
  var ismultiple = formData !== null && formData !== void 0 && (_formData$ownershipCa = formData.ownershipCategory) !== null && _formData$ownershipCa !== void 0 && _formData$ownershipCa.code.includes("SINGLEOWNER") ? false : true;

  function setOwnerPermanentAddress(e) {
    setPermanentAddress(e.target.value);
  }

  function setCorrespondenceAddress(e) {
    if (e.target.checked == true) {
      var _formData$address, _formData$address2, _formData$address3, _formData$address4, _formData$address4$lo, _formData$address5, _formData$address5$ci, _formData$address6;

      var obj = {
        doorNo: formData === null || formData === void 0 ? void 0 : (_formData$address = formData.address) === null || _formData$address === void 0 ? void 0 : _formData$address.doorNo,
        street: formData === null || formData === void 0 ? void 0 : (_formData$address2 = formData.address) === null || _formData$address2 === void 0 ? void 0 : _formData$address2.street,
        landmark: formData === null || formData === void 0 ? void 0 : (_formData$address3 = formData.address) === null || _formData$address3 === void 0 ? void 0 : _formData$address3.landmark,
        locality: formData === null || formData === void 0 ? void 0 : (_formData$address4 = formData.address) === null || _formData$address4 === void 0 ? void 0 : (_formData$address4$lo = _formData$address4.locality) === null || _formData$address4$lo === void 0 ? void 0 : _formData$address4$lo.i18nkey,
        city: formData === null || formData === void 0 ? void 0 : (_formData$address5 = formData.address) === null || _formData$address5 === void 0 ? void 0 : (_formData$address5$ci = _formData$address5.city) === null || _formData$address5$ci === void 0 ? void 0 : _formData$address5$ci.code,
        pincode: formData === null || formData === void 0 ? void 0 : (_formData$address6 = formData.address) === null || _formData$address6 === void 0 ? void 0 : _formData$address6.pincode
      };
      var addressDetails = "";

      for (var key in obj) {
        if (key == "pincode") addressDetails += obj[key] ? obj[key] : "";else addressDetails += obj[key] ? t("" + obj[key]) + ", " : "";
      }

      setPermanentAddress(addressDetails);
    } else {
      setPermanentAddress("");
    }

    setIsCorrespondenceAddress(e.target.checked);
  }

  var goNext = function goNext() {
    if (userType === "employee") {
      onSelect(config.key, _extends({}, formData[config.key], {
        permanentAddress: permanentAddress,
        isCorrespondenceAddress: isCorrespondenceAddress
      }));
    } else {
      var ownerDetails = formData.owners;
      ownerDetails["permanentAddress"] = permanentAddress;
      ownerDetails["isCorrespondenceAddress"] = isCorrespondenceAddress;
      onSelect(config.key, ownerDetails);
    }
  };

  useEffect(function () {
    if (userType === "employee") {
      goNext();
    }
  }, [permanentAddress]);

  if (userType === "employee") {
    return /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
      className: "card-label-smaller",
      style: editScreen ? {
        color: "#B1B4B6"
      } : {}
    }, t("PT_OWNERS_ADDRESS")), /*#__PURE__*/React.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React.createElement(TextInput, {
      name: "address",
      onChange: setOwnerPermanentAddress,
      value: permanentAddress,
      disable: editScreen
    })));
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormStep, {
    config: config,
    t: t,
    onSelect: goNext,
    isDisabled: isedittrade || isrenewtrade ? false : !permanentAddress
  }, /*#__PURE__*/React.createElement(TextArea, {
    isMandatory: false,
    optionKey: "i18nKey",
    t: t,
    name: "address",
    onChange: setOwnerPermanentAddress,
    value: permanentAddress
  }), /*#__PURE__*/React.createElement(CheckBox, {
    label: t("TL_COMMON_SAME_AS_TRADE_ADDRESS"),
    onChange: setCorrespondenceAddress,
    value: isCorrespondenceAddress,
    checked: isCorrespondenceAddress || false,
    style: {
      paddingTop: "10px"
    }
  })), ismultiple ? /*#__PURE__*/React.createElement(CitizenInfoLabel, {
    info: t("CS_FILE_APPLICATION_INFO_LABEL"),
    text: t("TL_PRIMARY_ADDR_INFO_MSG")
  }) : "");
};

var SelectProofIdentity = function SelectProofIdentity(_ref) {
  var _formData$owners, _formData$owners$docu, _formData$owners$docu2, _formData$owners2, _formData$owners2$doc, _formData$owners3, _formData$owners3$doc, _formData$owners3$doc2, _Documentsob$Property;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;

  var _useState = useState((formData === null || formData === void 0 ? void 0 : (_formData$owners = formData.owners) === null || _formData$owners === void 0 ? void 0 : (_formData$owners$docu = _formData$owners.documents) === null || _formData$owners$docu === void 0 ? void 0 : (_formData$owners$docu2 = _formData$owners$docu.ProofOfIdentity) === null || _formData$owners$docu2 === void 0 ? void 0 : _formData$owners$docu2.fileStoreId) || null),
      uploadedFile = _useState[0],
      setUploadedFile = _useState[1];

  var _useState2 = useState(formData === null || formData === void 0 ? void 0 : (_formData$owners2 = formData.owners) === null || _formData$owners2 === void 0 ? void 0 : (_formData$owners2$doc = _formData$owners2.documents) === null || _formData$owners2$doc === void 0 ? void 0 : _formData$owners2$doc.ProofOfIdentity),
      file = _useState2[0],
      setFile = _useState2[1];

  var _useState3 = useState(null),
      error = _useState3[0],
      setError = _useState3[1];

  var cityDetails = Digit.ULBService.getCurrentUlb();

  var _useState4 = useState((formData === null || formData === void 0 ? void 0 : (_formData$owners3 = formData.owners) === null || _formData$owners3 === void 0 ? void 0 : (_formData$owners3$doc = _formData$owners3.documents) === null || _formData$owners3$doc === void 0 ? void 0 : (_formData$owners3$doc2 = _formData$owners3$doc.ProofOfIdentity) === null || _formData$owners3$doc2 === void 0 ? void 0 : _formData$owners3$doc2.documentType) || null);

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$pt$usePr = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Documents"),
      _Digit$Hooks$pt$usePr2 = _Digit$Hooks$pt$usePr.data,
      Documentsob = _Digit$Hooks$pt$usePr2 === void 0 ? {} : _Digit$Hooks$pt$usePr2;

  var docs = Documentsob === null || Documentsob === void 0 ? void 0 : (_Documentsob$Property = Documentsob.PropertyTax) === null || _Documentsob$Property === void 0 ? void 0 : _Documentsob$Property.Documents;
  var proofOfIdentity = Array.isArray(docs) && docs.filter(function (doc) {
    return doc.code.includes("ADDRESSPROOF");
  });

  var handleSubmit = function handleSubmit() {
    var fileStoreId = uploadedFile;
    var fileDetails = file;
    if (fileDetails) fileDetails.documentType = "OWNERIDPROOF";
    if (fileDetails) fileDetails.fileStoreId = fileStoreId ? fileStoreId : null;
    var owners = formData === null || formData === void 0 ? void 0 : formData.owners;

    if (owners && owners.documents) {
      owners.documents["ProofOfIdentity"] = fileDetails;
    } else {
      owners["documents"] = [];
      owners.documents["ProofOfIdentity"] = fileDetails;
    }

    onSelect(config.key, owners);
  };

  var onSkip = function onSkip() {
    return onSelect();
  };

  function selectfile(e) {
    setUploadedFile(null);
    setFile(e.target.files[0]);
  }

  useEffect(function () {
    (function () {
      try {
        setError(null);

        var _temp4 = function () {
          if (file) {
            var _temp5 = function () {
              if (file.size >= 2000000) {
                setError(t("PT_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
              } else {
                var _temp6 = _catch(function () {
                  return Promise.resolve(Digit.UploadServices.Filestorage("property-upload", file, Digit.ULBService.getStateId())).then(function (response) {
                    var _response$data, _response$data$files;

                    if ((response === null || response === void 0 ? void 0 : (_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$files = _response$data.files) === null || _response$data$files === void 0 ? void 0 : _response$data$files.length) > 0) {
                      var _response$data2, _response$data2$files;

                      setUploadedFile(response === null || response === void 0 ? void 0 : (_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : (_response$data2$files = _response$data2.files[0]) === null || _response$data2$files === void 0 ? void 0 : _response$data2$files.fileStoreId);
                    } else {
                      setError(t("PT_FILE_UPLOAD_ERROR"));
                    }
                  });
                }, function (err) {
                  console.error("Modal -> err ", err);
                });

                if (_temp6 && _temp6.then) return _temp6.then(function () {});
              }
            }();

            if (_temp5 && _temp5.then) return _temp5.then(function () {});
          }
        }();

        return _temp4 && _temp4.then ? _temp4.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [file]);
  return /*#__PURE__*/React.createElement(FormStep, {
    config: config,
    onSelect: handleSubmit,
    onSkip: onSkip,
    t: t,
    isDisabled: !uploadedFile || error
  }, /*#__PURE__*/React.createElement(CardLabelDesc, {
    style: {
      fontWeight: "unset"
    }
  }, t("TL_UPLOAD_RESTRICTIONS_TYPES")), /*#__PURE__*/React.createElement(CardLabelDesc, {
    style: {
      fontWeight: "unset"
    }
  }, " ", t("TL_UPLOAD_RESTRICTIONS_SIZE")), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_CATEGORY_DOCUMENT_TYPE")), /*#__PURE__*/React.createElement(UploadFile, {
    extraStyleName: "propertyCreate",
    accept: ".jpg,.png,.pdf",
    onUpload: selectfile,
    onDelete: function onDelete() {
      setUploadedFile(null);
    },
    message: uploadedFile ? "1 " + t("TL_ACTION_FILEUPLOADED") : t("TL_ACTION_NO_FILEUPLOADED"),
    error: error
  }), error ? /*#__PURE__*/React.createElement("div", {
    style: {
      height: "20px",
      width: "100%",
      fontSize: "20px",
      color: "red",
      marginTop: "5px"
    }
  }, error) : "", /*#__PURE__*/React.createElement("div", {
    style: {
      disabled: "true",
      height: "20px",
      width: "100%"
    }
  }));
};

var SelectOwnershipProof = function SelectOwnershipProof(_ref) {
  var _formData$owners, _formData$owners$docu, _formData$owners$docu2, _formData$owners2, _formData$owners2$doc, _formData$owners3, _formData$owners3$doc, _formData$owners3$doc2, _Documentsob$Property;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;

  var _useState = useState((formData === null || formData === void 0 ? void 0 : (_formData$owners = formData.owners) === null || _formData$owners === void 0 ? void 0 : (_formData$owners$docu = _formData$owners.documents) === null || _formData$owners$docu === void 0 ? void 0 : (_formData$owners$docu2 = _formData$owners$docu.ProofOfOwnership) === null || _formData$owners$docu2 === void 0 ? void 0 : _formData$owners$docu2.fileStoreId) || null),
      uploadedFile = _useState[0],
      setUploadedFile = _useState[1];

  var _useState2 = useState(formData === null || formData === void 0 ? void 0 : (_formData$owners2 = formData.owners) === null || _formData$owners2 === void 0 ? void 0 : (_formData$owners2$doc = _formData$owners2.documents) === null || _formData$owners2$doc === void 0 ? void 0 : _formData$owners2$doc.ProofOfOwnership),
      file = _useState2[0],
      setFile = _useState2[1];

  var _useState3 = useState(null),
      error = _useState3[0],
      setError = _useState3[1];

  var cityDetails = Digit.ULBService.getCurrentUlb();

  var _useState4 = useState((formData === null || formData === void 0 ? void 0 : (_formData$owners3 = formData.owners) === null || _formData$owners3 === void 0 ? void 0 : (_formData$owners3$doc = _formData$owners3.documents) === null || _formData$owners3$doc === void 0 ? void 0 : (_formData$owners3$doc2 = _formData$owners3$doc.ProofOfOwnership) === null || _formData$owners3$doc2 === void 0 ? void 0 : _formData$owners3$doc2.documentType) || null);

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$pt$usePr = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Documents"),
      _Digit$Hooks$pt$usePr2 = _Digit$Hooks$pt$usePr.data,
      Documentsob = _Digit$Hooks$pt$usePr2 === void 0 ? {} : _Digit$Hooks$pt$usePr2;

  var docs = Documentsob === null || Documentsob === void 0 ? void 0 : (_Documentsob$Property = Documentsob.PropertyTax) === null || _Documentsob$Property === void 0 ? void 0 : _Documentsob$Property.Documents;
  var proofOfOwnership = Array.isArray(docs) && docs.filter(function (doc) {
    return doc.code.includes("ADDRESSPROOF");
  });

  var handleSubmit = function handleSubmit() {
    var fileStoreId = uploadedFile;
    var fileDetails = file;
    if (fileDetails) fileDetails.documentType = "OWNERSHIPPROOF";
    if (fileDetails) fileDetails.fileStoreId = fileStoreId ? fileStoreId : null;
    var owners = formData === null || formData === void 0 ? void 0 : formData.owners;

    if (owners && owners.documents) {
      owners.documents["ProofOfOwnership"] = fileDetails;
    } else {
      owners["documents"] = [];
      owners.documents["ProofOfOwnership"] = fileDetails;
    }

    onSelect(config.key, owners);
  };

  var onSkip = function onSkip() {
    return onSelect();
  };

  function selectfile(e) {
    setUploadedFile(null);
    setFile(e.target.files[0]);
  }

  useEffect(function () {
    (function () {
      try {
        setError(null);

        var _temp4 = function () {
          if (file) {
            var _temp5 = function () {
              if (file.size >= 2000000) {
                setError(t("PT_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
              } else {
                var _temp6 = _catch(function () {
                  return Promise.resolve(Digit.UploadServices.Filestorage("property-upload", file, Digit.ULBService.getStateId())).then(function (response) {
                    var _response$data, _response$data$files;

                    if ((response === null || response === void 0 ? void 0 : (_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$files = _response$data.files) === null || _response$data$files === void 0 ? void 0 : _response$data$files.length) > 0) {
                      var _response$data2, _response$data2$files;

                      setUploadedFile(response === null || response === void 0 ? void 0 : (_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : (_response$data2$files = _response$data2.files[0]) === null || _response$data2$files === void 0 ? void 0 : _response$data2$files.fileStoreId);
                    } else {
                      setError(t("PT_FILE_UPLOAD_ERROR"));
                    }
                  });
                }, function (err) {
                  console.error("Modal -> err ", err);
                });

                if (_temp6 && _temp6.then) return _temp6.then(function () {});
              }
            }();

            if (_temp5 && _temp5.then) return _temp5.then(function () {});
          }
        }();

        return _temp4 && _temp4.then ? _temp4.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [file]);
  return /*#__PURE__*/React.createElement(FormStep, {
    config: config,
    onSelect: handleSubmit,
    onSkip: onSkip,
    t: t,
    isDisabled: !uploadedFile || error
  }, /*#__PURE__*/React.createElement(CardLabelDesc, {
    style: {
      fontWeight: "unset"
    }
  }, t("TL_UPLOAD_OWNERSHIP_RESTRICTIONS_TYPES")), /*#__PURE__*/React.createElement(CardLabelDesc, {
    style: {
      fontWeight: "unset"
    }
  }, t("TL_UPLOAD_RESTRICTIONS_SIZE")), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_CATEGORY_DOCUMENT_TYPE")), /*#__PURE__*/React.createElement(UploadFile, {
    extraStyleName: "propertyCreate",
    accept: ".jpg,.png,.pdf",
    onUpload: selectfile,
    onDelete: function onDelete() {
      setUploadedFile(null);
    },
    message: uploadedFile ? "1 " + t("TL_ACTION_FILEUPLOADED") : t("TL_ACTION_NO_FILEUPLOADED"),
    error: error
  }), error ? /*#__PURE__*/React.createElement("div", {
    style: {
      height: "20px",
      width: "100%",
      fontSize: "20px",
      color: "red",
      marginTop: "5px"
    }
  }, error) : "", /*#__PURE__*/React.createElement("div", {
    style: {
      disabled: "true",
      height: "20px",
      width: "100%"
    }
  }));
};

var SelectTradeName = function SelectTradeName(_ref) {
  var _formData$TradeDetail, _mdmsFinancialYear$so;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;
  var validation = {};

  var onSkip = function onSkip() {
    return onSelect();
  };

  var _useState = useState((_formData$TradeDetail = formData.TradeDetails) === null || _formData$TradeDetail === void 0 ? void 0 : _formData$TradeDetail.TradeName),
      TradeName = _useState[0],
      setTradeName = _useState[1];

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];
  var isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("renew-trade");

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", "FinancialYear"),
      isLoading = _Digit$Hooks$tl$useTr.isLoading,
      _Digit$Hooks$tl$useTr2 = _Digit$Hooks$tl$useTr.data,
      fydata = _Digit$Hooks$tl$useTr2 === void 0 ? {} : _Digit$Hooks$tl$useTr2;

  var mdmsFinancialYear = fydata["egf-master"] ? fydata["egf-master"].FinancialYear.filter(function (y) {
    return y.module === "TL";
  }) : [];
  var FY = mdmsFinancialYear && mdmsFinancialYear.length > 0 && ((_mdmsFinancialYear$so = mdmsFinancialYear.sort(function (x, y) {
    return y.endingDate - x.endingDate;
  })[0]) === null || _mdmsFinancialYear$so === void 0 ? void 0 : _mdmsFinancialYear$so.code);

  function setSelectTradeName(e) {
    setTradeName(e.target.value);
  }

  var goNext = function goNext() {
    sessionStorage.setItem("CurrentFinancialYear", FY);
    onSelect(config.key, {
      TradeName: TradeName
    });
  };

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormStep, {
    config: config,
    onSelect: goNext,
    onSkip: onSkip,
    t: t,
    isDisabled: !TradeName
  }, /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_LOCALIZATION_TRADE_NAME")), /*#__PURE__*/React.createElement(TextInput, _extends({
    t: t,
    isMandatory: false,
    type: "text",
    optionKey: "i18nKey",
    name: "TradeName",
    value: TradeName,
    onChange: setSelectTradeName,
    disable: isEdit
  }, validation = {
    pattern: "^[a-zA-Z-.`' ]*$",
    isRequired: true,
    type: "text",
    title: t("TL_INVALID_TRADE_NAME")
  }))), /*#__PURE__*/React.createElement(CitizenInfoLabel, {
    info: t("CS_FILE_APPLICATION_INFO_LABEL"),
    text: t("TL_LICENSE_ISSUE_YEAR_INFO_MSG") + FY
  }));
};

var SelectStructureType = function SelectStructureType(_ref) {
  var _formData$TradeDetail;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;

  var _useState = useState(formData === null || formData === void 0 ? void 0 : (_formData$TradeDetail = formData.TradeDetails) === null || _formData$TradeDetail === void 0 ? void 0 : _formData$TradeDetail.StructureType),
      StructureType = _useState[0],
      setStructureType = _useState[1];

  var isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("renew-trade");
  var menu = [{
    i18nKey: "TL_COMMON_YES",
    code: "IMMOVABLE"
  }, {
    i18nKey: "TL_COMMON_NO",
    code: "MOVABLE"
  }];

  var onSkip = function onSkip() {
    return onSelect();
  };

  function selectStructuretype(value) {
    setStructureType(value);
  }

  function goNext() {
    sessionStorage.setItem("StructureType", StructureType.i18nKey);
    onSelect(config.key, {
      StructureType: StructureType
    });
  }

  return /*#__PURE__*/React.createElement(FormStep, {
    t: t,
    config: config,
    onSelect: goNext,
    onSkip: onSkip,
    isDisabled: !StructureType
  }, /*#__PURE__*/React.createElement(RadioButtons, {
    t: t,
    optionsKey: "i18nKey",
    isMandatory: config.isMandatory,
    options: menu,
    selectedOption: StructureType,
    onSelect: selectStructuretype,
    disabled: isEdit
  }));
};

var SelectVehicleType = function SelectVehicleType(_ref) {
  var _formData$TradeDetail;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState = useState(formData === null || formData === void 0 ? void 0 : (_formData$TradeDetail = formData.TradeDetails) === null || _formData$TradeDetail === void 0 ? void 0 : _formData$TradeDetail.VehicleType),
      VehicleType = _useState[0],
      setVehicleType = _useState[1];

  var isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("renew-trade");

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "StructureType"),
      _Digit$Hooks$tl$useTr2 = _Digit$Hooks$tl$useTr.data,
      Menu = _Digit$Hooks$tl$useTr2 === void 0 ? {} : _Digit$Hooks$tl$useTr2;

  var menu = [];
  Menu && Menu["common-masters"] && Menu["common-masters"].StructureType.map(function (ob) {
    if (!ob.code.includes("IMMOVABLE")) {
      menu.push({
        i18nKey: "COMMON_MASTERS_STRUCTURETYPE_" + ob.code.replaceAll(".", "_"),
        code: "" + ob.code
      });
    }
  });

  var onSkip = function onSkip() {
    return onSelect();
  };

  function selectVehicleType(value) {
    setVehicleType(value);
  }

  function goNext() {
    onSelect(config.key, {
      VehicleType: VehicleType
    });
  }

  return /*#__PURE__*/React.createElement(FormStep, {
    t: t,
    config: config,
    onSelect: goNext,
    onSkip: onSkip,
    isDisabled: !VehicleType
  }, /*#__PURE__*/React.createElement(RadioButtons, {
    t: t,
    optionsKey: "i18nKey",
    isMandatory: config.isMandatory,
    options: menu,
    selectedOption: VehicleType,
    onSelect: selectVehicleType,
    disable: isEdit
  }));
};

var SelectBuildingType = function SelectBuildingType(_ref) {
  var _formData$TradeDetail;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState = useState(formData === null || formData === void 0 ? void 0 : (_formData$TradeDetail = formData.TradeDetails) === null || _formData$TradeDetail === void 0 ? void 0 : _formData$TradeDetail.BuildingType),
      BuildingType = _useState[0],
      setBuildingType = _useState[1];

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "StructureType"),
      _Digit$Hooks$tl$useTr2 = _Digit$Hooks$tl$useTr.data,
      Menu = _Digit$Hooks$tl$useTr2 === void 0 ? {} : _Digit$Hooks$tl$useTr2;

  var isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("renew-trade");
  var menu = [];
  Menu && Menu["common-masters"] && Menu["common-masters"].StructureType.map(function (ob) {
    if (ob.code.includes("IMMOVABLE")) {
      menu.push({
        i18nKey: "COMMON_MASTERS_STRUCTURETYPE_" + ob.code.replaceAll(".", "_"),
        code: "" + ob.code
      });
    }
  });

  var onSkip = function onSkip() {
    return onSelect();
  };

  function selectBuildingType(value) {
    setBuildingType(value);
  }

  function goNext() {
    onSelect(config.key, {
      BuildingType: BuildingType
    });
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormStep, {
    t: t,
    config: config,
    onSelect: goNext,
    onSkip: onSkip,
    isDisabled: !BuildingType
  }, /*#__PURE__*/React.createElement(RadioButtons, {
    t: t,
    optionsKey: "i18nKey",
    isMandatory: config.isMandatory,
    options: menu,
    selectedOption: BuildingType,
    onSelect: selectBuildingType
  })), /*#__PURE__*/React.createElement(CitizenInfoLabel, {
    info: t("CS_FILE_APPLICATION_INFO_LABEL"),
    text: t("TL_BUILDING_TYPE_INFO_MSG")
  }), isEdit && /*#__PURE__*/React.createElement(CitizenInfoLabel, {
    info: t("CS_FILE_APPLICATION_INFO_LABEL"),
    text: t("Structure type cant be modified")
  }));
};

var SelectCommencementDate = function SelectCommencementDate(_ref) {
  var _formData$TradeDetail;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;

  var _useState = useState(formData === null || formData === void 0 ? void 0 : (_formData$TradeDetail = formData.TradeDetails) === null || _formData$TradeDetail === void 0 ? void 0 : _formData$TradeDetail.CommencementDate),
      CommencementDate = _useState[0],
      setCommencementDate = _useState[1];

  var isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("renew-trade");

  var onSkip = function onSkip() {
    return onSelect();
  };

  function selectCommencementDate(value) {
    setCommencementDate(value);
  }

  function goNext() {
    onSelect(config.key, {
      CommencementDate: CommencementDate
    });
  }

  return /*#__PURE__*/React.createElement(FormStep, {
    t: t,
    config: config,
    onSelect: goNext,
    onSkip: onSkip,
    isDisabled: !CommencementDate
  }, /*#__PURE__*/React.createElement(CardLabel, null, t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL")), /*#__PURE__*/React.createElement(DatePicker, {
    date: CommencementDate,
    name: "CommencementDate",
    onChange: selectCommencementDate,
    disabled: isEdit
  }));
};

var SelectTradeUnits = function SelectTradeUnits(_ref) {
  var _formData$TadeDetails, _formData$TadeDetails2, _formData$TadeDetails3, _formData$TadeDetails4, _formData$TadeDetails5, _formData$TadeDetails6, _formData$TadeDetails7, _formData$TadeDetails8, _formData$TradeDetail;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;
  var validation = {};

  var _useState = useState(""),
      TradeCategory = _useState[0],
      setTradeCategory = _useState[1];

  var _useState2 = useState((formData === null || formData === void 0 ? void 0 : (_formData$TadeDetails = formData.TadeDetails) === null || _formData$TadeDetails === void 0 ? void 0 : (_formData$TadeDetails2 = _formData$TadeDetails.Units) === null || _formData$TadeDetails2 === void 0 ? void 0 : _formData$TadeDetails2.TradeType) || ""),
      setTradeType = _useState2[1];

  var _useState3 = useState((formData === null || formData === void 0 ? void 0 : (_formData$TadeDetails3 = formData.TadeDetails) === null || _formData$TadeDetails3 === void 0 ? void 0 : (_formData$TadeDetails4 = _formData$TadeDetails3.Units) === null || _formData$TadeDetails4 === void 0 ? void 0 : _formData$TadeDetails4.TradeSubType) || ""),
      setTradeSubType = _useState3[1];

  var _useState4 = useState((formData === null || formData === void 0 ? void 0 : (_formData$TadeDetails5 = formData.TadeDetails) === null || _formData$TadeDetails5 === void 0 ? void 0 : (_formData$TadeDetails6 = _formData$TadeDetails5.Units) === null || _formData$TadeDetails6 === void 0 ? void 0 : _formData$TadeDetails6.UnitOfMeasure) || ""),
      setUnitOfMeasure = _useState4[1];

  var _useState5 = useState((formData === null || formData === void 0 ? void 0 : (_formData$TadeDetails7 = formData.TadeDetails) === null || _formData$TadeDetails7 === void 0 ? void 0 : (_formData$TadeDetails8 = _formData$TadeDetails7.Units) === null || _formData$TadeDetails8 === void 0 ? void 0 : _formData$TadeDetails8.UomValue) || ""),
      setUomValue = _useState5[1];

  var _useState6 = useState((formData === null || formData === void 0 ? void 0 : formData.TradeDetails) && (formData === null || formData === void 0 ? void 0 : (_formData$TradeDetail = formData.TradeDetails) === null || _formData$TradeDetail === void 0 ? void 0 : _formData$TradeDetail.units) || [{
    tradecategory: "",
    tradetype: "",
    tradesubtype: "",
    unit: null,
    uom: null
  }]),
      fields = _useState6[0],
      setFeilds = _useState6[1];

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  function handleAdd() {
    var values = [].concat(fields);
    values.push({
      tradecategory: "",
      tradetype: "",
      tradesubtype: "",
      unit: null,
      uom: null
    });
    setFeilds(values);
  }

  function handleRemove(index) {
    var values = [].concat(fields);

    if (values.length != 1) {
      values.splice(index, 1);
      setFeilds(values);
    }
  }

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", "TradeUnits", "[?(@.type=='TL')]"),
      _Digit$Hooks$tl$useTr2 = _Digit$Hooks$tl$useTr.data,
      Data = _Digit$Hooks$tl$useTr2 === void 0 ? {} : _Digit$Hooks$tl$useTr2;

  var TradeCategoryMenu = [];
  Data && Data.TradeLicense && Data.TradeLicense.TradeType.map(function (ob) {
    if (!TradeCategoryMenu.some(function (TradeCategoryMenu) {
      return TradeCategoryMenu.code === "" + ob.code.split(".")[0];
    })) {
      TradeCategoryMenu.push({
        i18nKey: "TRADELICENSE_TRADETYPE_" + ob.code.split(".")[0],
        code: "" + ob.code.split(".")[0]
      });
    }
  });

  function getTradeTypeMenu(TradeCategory) {
    var TradeTypeMenu = [];
    Data && Data.TradeLicense && Data.TradeLicense.TradeType.map(function (ob) {
      if (ob.code.split(".")[0] === TradeCategory.code && !TradeTypeMenu.some(function (TradeTypeMenu) {
        return TradeTypeMenu.code === "" + ob.code.split(".")[1];
      })) {
        TradeTypeMenu.push({
          i18nKey: "TRADELICENSE_TRADETYPE_" + ob.code.split(".")[1],
          code: "" + ob.code.split(".")[1]
        });
      }
    });
    return TradeTypeMenu;
  }

  function getTradeSubTypeMenu(TradeType) {
    var TradeSubTypeMenu = [];
    TradeType && Data && Data.TradeLicense && Data.TradeLicense.TradeType.map(function (ob) {
      if (ob.code.split(".")[1] === TradeType.code && !TradeSubTypeMenu.some(function (TradeSubTypeMenu) {
        return TradeSubTypeMenu.code === "" + ob.code;
      })) {
        TradeSubTypeMenu.push({
          i18nKey: "TL_" + ob.code,
          code: "" + ob.code
        });
      }
    });
    return TradeSubTypeMenu;
  }

  var _useLocation = useLocation(),
      url = _useLocation.pathname;

  var editScreen = url.includes("/modify-application/");

  function selectTradeCategory(i, value) {
    var units = [].concat(fields);
    units[i].tradecategory = value;
    setTradeCategory(value);
    selectTradeType(i, null);
    selectTradeSubType(i, null);
    setFeilds(units);
  }

  function selectTradeType(i, value) {
    var units = [].concat(fields);
    units[i].tradetype = value;
    setTradeType(value);
    selectTradeSubType(i, null);
    setFeilds(units);
  }

  function selectTradeSubType(i, value) {
    var units = [].concat(fields);
    units[i].tradesubtype = value;
    setTradeSubType(value);

    if (value == null) {
      units[i].unit = null;
      setUnitOfMeasure(null);
    }

    Array.from(document.querySelectorAll("input")).forEach(function (input) {
      return input.value = "";
    });
    value && Data && Data.TradeLicense && Data.TradeLicense.TradeType.map(function (ob) {
      if (value.code === ob.code) {
        units[i].unit = ob.uom;
        setUnitOfMeasure(ob.uom);
      }
    });
    setFeilds(units);
  }

  function selectUnitOfMeasure(i, e) {
    var units = [].concat(fields);
    units[i].unit = e.target.value;
    setUnitOfMeasure(e.target.value);
    setFeilds(units);
  }

  function selectUomValue(i, e) {
    var units = [].concat(fields);
    units[i].uom = e.target.value;
    setUomValue(e.target.value);
    setFeilds(units);
  }

  var goNext = function goNext() {
    var units = formData.TradeDetails.Units;
    var unitsdata;
    unitsdata = _extends({}, units, {
      units: fields
    });
    onSelect(config.key, unitsdata);
  };

  var onSkip = function onSkip() {
    return onSelect();
  };
  return /*#__PURE__*/React.createElement(FormStep, {
    config: config,
    onSelect: goNext,
    onSkip: onSkip,
    t: t,
    isDisabled: !fields[0].tradecategory || !fields[0].tradetype || !fields[0].tradesubtype
  }, fields.map(function (field, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: field + "-" + index
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: "solid",
        borderRadius: "5px",
        padding: "10px",
        paddingTop: "20px",
        marginTop: "10px",
        borderColor: "#f3f3f3",
        background: "#FAFAFA"
      }
    }, /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL")), /*#__PURE__*/React.createElement(LinkButton, {
      label: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("svg", {
        style: {
          float: "right",
          position: "relative",
          bottom: "32px"
        },
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z",
        fill: !(fields.length == 1) ? "#494848" : "#FAFAFA"
      })))),
      style: {
        width: "100px",
        display: "inline"
      },
      onClick: function onClick(e) {
        return handleRemove(index);
      }
    }), /*#__PURE__*/React.createElement(RadioButtons, {
      t: t,
      options: TradeCategoryMenu,
      optionsKey: "code",
      name: "TradeCategory",
      value: TradeCategory,
      selectedOption: field === null || field === void 0 ? void 0 : field.tradecategory,
      onSelect: function onSelect(e) {
        return selectTradeCategory(index, e);
      },
      isDependent: true,
      labelKey: "TRADELICENSE_TRADETYPE"
    }), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL")), /*#__PURE__*/React.createElement(Dropdown, {
      t: t,
      optionKey: "i18nKey",
      isMandatory: config.isMandatory,
      option: getTradeTypeMenu(field === null || field === void 0 ? void 0 : field.tradecategory),
      selected: field === null || field === void 0 ? void 0 : field.tradetype,
      select: function select(e) {
        return selectTradeType(index, e);
      }
    }), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL")), /*#__PURE__*/React.createElement("div", {
      className: "form-pt-dropdown-only"
    }, /*#__PURE__*/React.createElement(Dropdown, {
      t: t,
      optionKey: "i18nKey",
      isMandatory: config.isMandatory,
      option: sortDropdownNames(getTradeSubTypeMenu(field === null || field === void 0 ? void 0 : field.tradetype), "i18nKey", t),
      selected: field === null || field === void 0 ? void 0 : field.tradesubtype,
      select: function select(e) {
        return selectTradeSubType(index, e);
      }
    })), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_UNIT_OF_MEASURE_LABEL")), /*#__PURE__*/React.createElement(TextInput, {
      style: {
        background: "#FAFAFA"
      },
      t: t,
      type: "text",
      isMandatory: false,
      optionKey: "i18nKey",
      name: "UnitOfMeasure",
      value: field === null || field === void 0 ? void 0 : field.unit,
      onChange: function onChange(e) {
        return selectUnitOfMeasure(index, e);
      },
      disable: true
    }), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL")), /*#__PURE__*/React.createElement(TextInput, _extends({
      style: {
        background: "#FAFAFA"
      },
      t: t,
      type: "text",
      isMandatory: false,
      optionKey: "i18nKey",
      name: "UomValue",
      value: field === null || field === void 0 ? void 0 : field.uom,
      onChange: function onChange(e) {
        return selectUomValue(index, e);
      },
      disable: !field.unit
    }, validation = {
      isRequired: true,
      pattern: "[0-9]+",
      type: "text",
      title: t("TL_WRONG_UOM_VALUE_ERROR")
    }))));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      justifyContent: "center",
      display: "flex",
      paddingBottom: "15px",
      color: "#FF8C00"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      paddingTop: "10px"
    },
    onClick: function onClick() {
      return handleAdd();
    }
  }, "" + t("TL_ADD_MORE_TRADE_UNITS"))));
};

var SelectAccessories = function SelectAccessories(_ref) {
  var _formData$TradeDetail;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;

  var _useState = useState(formData === null || formData === void 0 ? void 0 : (_formData$TradeDetail = formData.TradeDetails) === null || _formData$TradeDetail === void 0 ? void 0 : _formData$TradeDetail.isAccessories),
      isAccessories = _useState[0],
      setisAccessories = _useState[1];

  var menu = [{
    i18nKey: "TL_COMMON_YES",
    code: "ACCESSORY"
  }, {
    i18nKey: "TL_COMMON_NO",
    code: "NONACCESSORY"
  }];

  var onSkip = function onSkip() {
    return onSelect();
  };

  function selectisAccessories(value) {
    setisAccessories(value);
  }

  function goNext() {
    sessionStorage.setItem("isAccessories", isAccessories.i18nKey);
    onSelect(config.key, {
      isAccessories: isAccessories,
      accessories: []
    });
  }

  return /*#__PURE__*/React.createElement(FormStep, {
    t: t,
    config: config,
    onSelect: goNext,
    onSkip: onSkip,
    isDisabled: !isAccessories
  }, /*#__PURE__*/React.createElement(RadioButtons, {
    t: t,
    optionsKey: "i18nKey",
    isMandatory: config.isMandatory,
    options: menu,
    selectedOption: isAccessories,
    onSelect: selectisAccessories
  }));
};

function isUndefined(value) {
  return value === undefined;
}

var isUndefined_1 = isUndefined;

var SelectAccessoriesDetails = function SelectAccessoriesDetails(_ref) {
  var _formData$TadeDetails, _formData$TadeDetails2, _formData$TadeDetails3, _formData$TadeDetails4, _formData$TadeDetails5, _formData$TadeDetails6, _formData$TadeDetails7, _formData$TadeDetails8, _formData$TradeDetail, _formData$TradeDetail2, _formData$TradeDetail3, _Digit$UserService$ge, _fields$, _fields$2, _fields$3;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;
  var validation = {};

  var _useState = useState((formData === null || formData === void 0 ? void 0 : (_formData$TadeDetails = formData.TadeDetails) === null || _formData$TadeDetails === void 0 ? void 0 : (_formData$TadeDetails2 = _formData$TadeDetails.accessories) === null || _formData$TadeDetails2 === void 0 ? void 0 : _formData$TadeDetails2.Accessory) || ""),
      setAccessory = _useState[1];

  var _useState2 = useState((formData === null || formData === void 0 ? void 0 : (_formData$TadeDetails3 = formData.TadeDetails) === null || _formData$TadeDetails3 === void 0 ? void 0 : (_formData$TadeDetails4 = _formData$TadeDetails3.accessories) === null || _formData$TadeDetails4 === void 0 ? void 0 : _formData$TadeDetails4.AccessoryCount) || ""),
      setAccessoryCount = _useState2[1];

  var _useState3 = useState((formData === null || formData === void 0 ? void 0 : (_formData$TadeDetails5 = formData.TadeDetails) === null || _formData$TadeDetails5 === void 0 ? void 0 : (_formData$TadeDetails6 = _formData$TadeDetails5.accessories) === null || _formData$TadeDetails6 === void 0 ? void 0 : _formData$TadeDetails6.UnitOfMeasure) || ""),
      setUnitOfMeasure = _useState3[1];

  var _useState4 = useState((formData === null || formData === void 0 ? void 0 : (_formData$TadeDetails7 = formData.TadeDetails) === null || _formData$TadeDetails7 === void 0 ? void 0 : (_formData$TadeDetails8 = _formData$TadeDetails7.accessories) === null || _formData$TadeDetails8 === void 0 ? void 0 : _formData$TadeDetails8.UomValue) || ""),
      setUomValue = _useState4[1];

  var _useState5 = useState(formData !== null && formData !== void 0 && formData.TradeDetails && formData !== null && formData !== void 0 && (_formData$TradeDetail = formData.TradeDetails) !== null && _formData$TradeDetail !== void 0 && _formData$TradeDetail.accessories && (formData === null || formData === void 0 ? void 0 : (_formData$TradeDetail2 = formData.TradeDetails) === null || _formData$TradeDetail2 === void 0 ? void 0 : _formData$TradeDetail2.accessories.length) > 0 ? formData === null || formData === void 0 ? void 0 : (_formData$TradeDetail3 = formData.TradeDetails) === null || _formData$TradeDetail3 === void 0 ? void 0 : _formData$TradeDetail3.accessories : [{
    accessory: "",
    accessorycount: "",
    unit: null,
    uom: null
  }]),
      fields = _useState5[0],
      setFeilds = _useState5[1];

  var _useState6 = useState(null),
      AccCountError = _useState6[0],
      setAccCountError = _useState6[1];

  var _useState7 = useState(null),
      AccUOMError = _useState7[0],
      setAccUOMError = _useState7[1];

  var TenantId = (_Digit$UserService$ge = Digit.UserService.getUser()) === null || _Digit$UserService$ge === void 0 ? void 0 : _Digit$UserService$ge.info.permanentCity;
  var isEditTrade = window.location.href.includes("edit-application");
  var isRenewTrade = window.location.href.includes("renew-trade");

  var _useLocation = useLocation(),
      url = _useLocation.pathname;

  var editScreen = url.includes("/modify-application/");
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", "AccessoryCategory"),
      _Digit$Hooks$tl$useTr2 = _Digit$Hooks$tl$useTr.data,
      Data = _Digit$Hooks$tl$useTr2 === void 0 ? {} : _Digit$Hooks$tl$useTr2;

  var _useState8 = useState([]),
      accessories = _useState8[0],
      SetAccessories = _useState8[1];

  var _Digit$Hooks$tl$useTr3 = Digit.Hooks.tl.useTradeLicenseBillingslab({
    tenantId: TenantId,
    filters: {}
  }),
      billingSlabData = _Digit$Hooks$tl$useTr3.data;

  useEffect(function () {
    var _billingSlabData$bill;

    if (billingSlabData && billingSlabData !== null && billingSlabData !== void 0 && billingSlabData.billingSlab && (billingSlabData === null || billingSlabData === void 0 ? void 0 : (_billingSlabData$bill = billingSlabData.billingSlab) === null || _billingSlabData$bill === void 0 ? void 0 : _billingSlabData$bill.length) > 0) {
      var processedData = billingSlabData.billingSlab && billingSlabData.billingSlab.reduce(function (acc, item) {
        var accessory = {
          active: true
        };
        var tradeType = {
          active: true
        };

        if (item.accessoryCategory && item.tradeType === null) {
          accessory.code = item.accessoryCategory;
          accessory.uom = item.uom;
          accessory.rate = item.rate;
          item.rate && item.rate > 0 && acc.accessories.push(accessory);
        } else if (item.accessoryCategory === null && item.tradeType) {
          tradeType.code = item.tradeType;
          tradeType.uom = item.uom;
          tradeType.structureType = item.structureType;
          tradeType.licenseType = item.licenseType;
          tradeType.rate = item.rate;
          !isUndefined_1(item.rate) && item.rate !== null && acc.tradeTypeData.push(tradeType);
        }

        return acc;
      }, {
        accessories: [],
        tradeTypeData: []
      });

      var _accessories = getUniqueItemsFromArray(processedData.accessories, "code");

      var structureTypes = getUniqueItemsFromArray(processedData.tradeTypeData, "structureType");
      structureTypes = commonTransform({
        StructureType: structureTypes.map(function (item) {
          return {
            code: item.structureType,
            active: true
          };
        })
      }, "StructureType");
      var licenseTypes = getUniqueItemsFromArray(processedData.tradeTypeData, "licenseType");
      licenseTypes = licenseTypes.map(function (item) {
        return {
          code: item.licenseType,
          active: true
        };
      });

      _accessories.forEach(function (data) {
        var _data$code;

        data.i18nKey = t("TRADELICENSE_ACCESSORIESCATEGORY_" + stringReplaceAll(data === null || data === void 0 ? void 0 : (_data$code = data.code) === null || _data$code === void 0 ? void 0 : _data$code.toUpperCase(), "-", "_"));
      });

      SetAccessories(_accessories);
    }
  }, [billingSlabData]);

  function getAccessoryCategoryDropDown() {
    var _Data$TradeLicense;

    var AccessoryCategoryMenu = [];
    Data && (Data === null || Data === void 0 ? void 0 : (_Data$TradeLicense = Data.TradeLicense) === null || _Data$TradeLicense === void 0 ? void 0 : _Data$TradeLicense.AccessoriesCategory.map(function (ob) {
      AccessoryCategoryMenu.push({
        i18nKey: "TRADELICENSE_ACCESSORIESCATEGORY_" + ob.code.replaceAll("-", "_"),
        code: "" + ob.code
      });
    }));
    return AccessoryCategoryMenu;
  }

  function handleAdd() {
    var values = [].concat(fields);
    values.push({
      accessory: "",
      accessorycount: "",
      unit: null,
      uom: null
    });
    setFeilds(values);
  }

  function handleRemove(index) {
    var values = [].concat(fields);

    if (values.length != 1) {
      values.splice(index, 1);
      setFeilds(values);
    }
  }

  function selectAccessory(i, value) {
    var _Data$TradeLicense2;

    var acc = [].concat(fields);
    acc[i].accessory = value;
    setAccessory(value);
    setFeilds(acc);
    acc[i].unit = null;
    Array.from(document.querySelectorAll("input")).forEach(function (input) {
      return input.value = "";
    });
    setUnitOfMeasure(null);
    Data === null || Data === void 0 ? void 0 : (_Data$TradeLicense2 = Data.TradeLicense) === null || _Data$TradeLicense2 === void 0 ? void 0 : _Data$TradeLicense2.AccessoriesCategory.map(function (ob) {
      if (value.code === ob.code && ob.uom != null) {
        acc[i].unit = ob.uom;
        setUnitOfMeasure(ob.uom);
      }
    });
  }

  function selectAccessoryCount(i, e) {
    setAccCountError(null);
    if (isNaN(e.target.value)) setAccCountError("TL_ONLY_NUM_ALLOWED");
    var acc = [].concat(fields);
    acc[i].accessorycount = e.target.value;
    setAccessoryCount(e.target.value);
    setFeilds(acc);
  }

  function selectUnitOfMeasure(i, e) {
    var acc = [].concat(fields);
    acc[i].unit = e.target.value;
    setUnitOfMeasure(e.target.value);
    setFeilds(acc);
  }

  function selectUomValue(i, e) {
    setAccUOMError(null);
    if (isNaN(e.target.value)) setAccUOMError("TL_ONLY_NUM_ALLOWED");
    var acc = [].concat(fields);
    acc[i].uom = e.target.value;
    setUomValue(e.target.value);
    setFeilds(acc);
  }

  var goNext = function goNext() {
    var data = formData.TradeDetails.Units;
    var formdata;
    formdata = _extends({}, data, {
      accessories: fields
    });
    onSelect(config.key, formdata);
  };

  var onSkip = function onSkip() {
    return onSelect();
  };

  return /*#__PURE__*/React.createElement(FormStep, {
    config: config,
    onSelect: goNext,
    onSkip: onSkip,
    t: t,
    forcedError: t(AccCountError) || t(AccUOMError),
    isDisabled: !(fields !== null && fields !== void 0 && (_fields$ = fields[0]) !== null && _fields$ !== void 0 && _fields$.accessory) || !(fields !== null && fields !== void 0 && (_fields$2 = fields[0]) !== null && _fields$2 !== void 0 && _fields$2.accessorycount) || !(fields !== null && fields !== void 0 && (_fields$3 = fields[0]) !== null && _fields$3 !== void 0 && _fields$3.uom) || AccCountError || AccUOMError
  }, fields.map(function (field, index) {
    var _formData$TradeDetail4, _formData$TradeDetail5;

    return /*#__PURE__*/React.createElement("div", {
      key: field + "-" + index
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        border: "solid",
        borderRadius: "5px",
        padding: "10px",
        paddingTop: "20px",
        marginTop: "10px",
        borderColor: "#f3f3f3",
        background: "#FAFAFA"
      }
    }, /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_ACCESSORY_LABEL")), /*#__PURE__*/React.createElement(LinkButton, {
      label: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("svg", {
        style: {
          float: "right",
          position: "relative",
          bottom: "32px"
        },
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z",
        fill: !(fields.length == 1) ? "#494848" : "#FAFAFA"
      })))),
      style: {
        width: "100px",
        display: "inline"
      },
      onClick: function onClick(e) {
        return handleRemove(index);
      }
    }), /*#__PURE__*/React.createElement(RadioOrSelect, {
      t: t,
      optionKey: "i18nKey",
      isMandatory: config.isMandatory,
      options: sortDropdownNames(accessories.length !== 0 ? accessories : getAccessoryCategoryDropDown(), "i18nKey", t),
      selectedOption: field.accessory,
      onSelect: function onSelect(e) {
        return selectAccessory(index, e);
      }
    }), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_ACCESSORY_COUNT_LABEL")), /*#__PURE__*/React.createElement(TextInput, {
      style: {
        background: "#FAFAFA"
      },
      t: t,
      type: "text",
      isMandatory: false,
      optionKey: "i18nKey",
      name: "AccessoryCount",
      value: field.accessorycount,
      onChange: function onChange(e) {
        return selectAccessoryCount(index, e);
      },
      disable: (isEditTrade || isRenewTrade) && ((formData === null || formData === void 0 ? void 0 : (_formData$TradeDetail4 = formData.TradeDetails) === null || _formData$TradeDetail4 === void 0 ? void 0 : _formData$TradeDetail4.accessories.length) - 1 < index ? false : field.accessorycount)
    }), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_UNIT_OF_MEASURE_LABEL")), /*#__PURE__*/React.createElement(TextInput, {
      style: {
        background: "#FAFAFA"
      },
      t: t,
      type: "text",
      isMandatory: false,
      optionKey: "i18nKey",
      name: "UnitOfMeasure",
      value: field.unit,
      onChange: function onChange(e) {
        return selectUnitOfMeasure(index, e);
      },
      disable: true
    }), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL")), /*#__PURE__*/React.createElement(TextInput, _extends({
      style: {
        background: "#FAFAFA"
      },
      t: t,
      type: "text",
      isMandatory: false,
      optionKey: "i18nKey",
      name: "UomValue",
      value: field.uom,
      onChange: function onChange(e) {
        return selectUomValue(index, e);
      },
      disable: isEditTrade || isRenewTrade ? (isEditTrade || isRenewTrade) && ((formData === null || formData === void 0 ? void 0 : (_formData$TradeDetail5 = formData.TradeDetails) === null || _formData$TradeDetail5 === void 0 ? void 0 : _formData$TradeDetail5.accessories.length) - 1 < index ? false : field.uom) : !field.unit
    }, validation = {
      isRequired: true,
      pattern: "[0-9]+",
      type: "text",
      title: t("TL_WRONG_UOM_VALUE_ERROR")
    }))));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      justifyContent: "center",
      display: "flex",
      paddingBottom: "15px",
      color: "#FF8C00"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      paddingTop: "10px"
    },
    onClick: function onClick() {
      return handleAdd();
    }
  }, "" + t("TL_ADD_MORE_TRADE_ACC"))));
};

var PDFSvg = function PDFSvg(_ref) {
  var _ref$width = _ref.width,
      width = _ref$width === void 0 ? 20 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === void 0 ? 20 : _ref$height,
      style = _ref.style;
  return /*#__PURE__*/React.createElement("svg", {
    style: style,
    xmlns: "http://www.w3.org/2000/svg",
    width: width,
    height: height,
    viewBox: "0 0 20 20",
    fill: "gray"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"
  }));
};

function TLDocument(_ref2) {
  var _ref2$value = _ref2.value,
      value = _ref2$value === void 0 ? {} : _ref2$value;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _Digit$Hooks$tl$useTL = Digit.Hooks.tl.useTLDocumentSearch({
    value: value
  }, {
    value: value
  }),
      isLoading = _Digit$Hooks$tl$useTL.isLoading,
      data = _Digit$Hooks$tl$useTL.data;

  var documents = [];
  documents.push(value.owners.documents["ProofOfIdentity"]);
  documents.push(value.owners.documents["ProofOfOwnership"]);
  documents.push(value.owners.documents["OwnerPhotoProof"]);

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "19px"
    }
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, documents === null || documents === void 0 ? void 0 : documents.map(function (document, index) {
    var documentLink = pdfDownloadLink(data.pdfFiles, document === null || document === void 0 ? void 0 : document.fileStoreId);
    return /*#__PURE__*/React.createElement("a", {
      target: "_",
      href: documentLink,
      style: {
        minWidth: "100px",
        marginRight: "10px"
      },
      key: index
    }, /*#__PURE__*/React.createElement(PDFSvg, {
      width: 85,
      height: 100,
      style: {
        background: "#f6f6f6",
        padding: "8px"
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: "8px",
        textAlign: "center"
      }
    }, t("TL_" + (document === null || document === void 0 ? void 0 : document.documentType) + "_LABEL")));
  }))));
}

var ActionButton = function ActionButton(_ref) {
  var jumpTo = _ref.jumpTo;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var history = useHistory();

  function routeTo() {
    sessionStorage.setItem("isDirectRenewal", false);
    history.push(jumpTo);
  }

  return /*#__PURE__*/React.createElement(LinkButton, {
    label: t("CS_COMMON_CHANGE"),
    className: "check-page-link-button",
    style: jumpTo.includes("proof-of-identity") ? {
      textAlign: "right",
      marginTop: "-32px"
    } : {},
    onClick: routeTo
  });
};

var getPath = function getPath(path, params) {
  params && Object.keys(params).map(function (key) {
    path = path.replace(":" + key, params[key]);
  });
  return path;
};

var CheckPage = function CheckPage(_ref2) {
  var _address$doorNo, _address$doorNo2, _address$street, _address$street2, _address$locality, _address$pincode, _address$pincode2;

  var onSubmit = _ref2.onSubmit,
      value = _ref2.value;
  var isEdit = window.location.href.includes("renew-trade");

  var _useTranslation2 = useTranslation(),
      t = _useTranslation2.t;

  var history = useHistory();
  var match = useRouteMatch();
  var TradeDetails = value.TradeDetails,
      address = value.address,
      owners = value.owners,
      isEditProperty = value.isEditProperty;

  function getdate(date) {
    var newdate = Date.parse(date);
    return "" + (new Date(newdate).getDate().toString() + "/" + (new Date(newdate).getMonth() + 1).toString() + "/" + new Date(newdate).getFullYear().toString());
  }

  var typeOfApplication = !isEditProperty ? "new-application" : "renew-trade";
  var routeLink = "/digit-ui/citizen/tl/tradelicence/" + typeOfApplication;

  if (window.location.href.includes("edit-application") || window.location.href.includes("renew-trade")) {
    routeLink = "" + getPath(match.path, match.params);
    routeLink = routeLink.replace('/check', '');
  }

  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, t("CS_CHECK_CHECK_YOUR_ANSWERS")), /*#__PURE__*/React.createElement(CardText, null, t("CS_CHECK_CHECK_YOUR_ANSWERS_TEXT")), isEdit && /*#__PURE__*/React.createElement(CitizenInfoLabel, {
    info: t("CS_FILE_APPLICATION_INFO_LABEL"),
    text: t("TL_RENEWAL_INFO_TEXT")
  }), /*#__PURE__*/React.createElement(CardSubHeader, null, t("TL_LOCALIZATION_TRADE_DETAILS")), /*#__PURE__*/React.createElement(StatusTable, null, /*#__PURE__*/React.createElement(Row, {
    label: t("TL_LOCALIZATION_TRADE_NAME"),
    text: t(TradeDetails === null || TradeDetails === void 0 ? void 0 : TradeDetails.TradeName),
    actionButton: /*#__PURE__*/React.createElement(ActionButton, {
      jumpTo: routeLink + "/TradeName"
    })
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("TL_STRUCTURE_TYPE"),
    text: t("TL_" + (TradeDetails === null || TradeDetails === void 0 ? void 0 : TradeDetails.StructureType.code)),
    actionButton: /*#__PURE__*/React.createElement(ActionButton, {
      jumpTo: routeLink + "/structure-type"
    })
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("TL_STRUCTURE_SUB_TYPE"),
    text: t((TradeDetails === null || TradeDetails === void 0 ? void 0 : TradeDetails.StructureType.code) !== "IMMOVABLE" ? TradeDetails === null || TradeDetails === void 0 ? void 0 : TradeDetails.VehicleType.i18nKey : TradeDetails === null || TradeDetails === void 0 ? void 0 : TradeDetails.BuildingType.i18nKey),
    actionButton: /*#__PURE__*/React.createElement(ActionButton, {
      jumpTo: TradeDetails !== null && TradeDetails !== void 0 && TradeDetails.VehicleType ? routeLink + "/vehicle-type" : routeLink + "/Building-type"
    })
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL"),
    text: t(getdate(TradeDetails === null || TradeDetails === void 0 ? void 0 : TradeDetails.CommencementDate)),
    actionButton: /*#__PURE__*/React.createElement(ActionButton, {
      jumpTo: routeLink + "/commencement-date"
    })
  }), TradeDetails.units.map(function (unit, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: index
    }, /*#__PURE__*/React.createElement(CardSubHeader, null, t("TL_UNIT_HEADER"), "-", index + 1), /*#__PURE__*/React.createElement(Row, {
      label: t("TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL"),
      text: t(unit === null || unit === void 0 ? void 0 : unit.tradecategory.i18nKey),
      actionButton: /*#__PURE__*/React.createElement(ActionButton, {
        jumpTo: routeLink + "/units-details"
      })
    }), /*#__PURE__*/React.createElement(Row, {
      label: t("TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL"),
      text: t(unit === null || unit === void 0 ? void 0 : unit.tradetype.i18nKey),
      actionButton: /*#__PURE__*/React.createElement(ActionButton, {
        jumpTo: routeLink + "/units-details"
      })
    }), /*#__PURE__*/React.createElement(Row, {
      label: t("TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL"),
      text: t(unit === null || unit === void 0 ? void 0 : unit.tradesubtype.i18nKey),
      actionButton: /*#__PURE__*/React.createElement(ActionButton, {
        jumpTo: routeLink + "/units-details"
      })
    }), /*#__PURE__*/React.createElement(Row, {
      label: t("TL_UNIT_OF_MEASURE_LABEL"),
      text: "" + (unit !== null && unit !== void 0 && unit.unit ? t(unit === null || unit === void 0 ? void 0 : unit.unit) : t("CS_NA")),
      actionButton: /*#__PURE__*/React.createElement(ActionButton, {
        jumpTo: routeLink + "/units-details"
      })
    }), /*#__PURE__*/React.createElement(Row, {
      label: t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"),
      text: "" + (unit !== null && unit !== void 0 && unit.uom ? t(unit === null || unit === void 0 ? void 0 : unit.uom) : t("CS_NA")),
      actionButton: /*#__PURE__*/React.createElement(ActionButton, {
        jumpTo: routeLink + "/units-details"
      })
    }));
  }), TradeDetails.accessories && TradeDetails.accessories.map(function (acc, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: index
    }, /*#__PURE__*/React.createElement(CardSubHeader, null, t("TL_ACCESSORY_LABEL"), "-", index + 1), /*#__PURE__*/React.createElement(Row, {
      label: t("TL_TRADE_ACC_HEADER"),
      text: t(acc === null || acc === void 0 ? void 0 : acc.accessory.i18nKey),
      actionButton: /*#__PURE__*/React.createElement(ActionButton, {
        jumpTo: routeLink + "/accessories-details"
      })
    }), /*#__PURE__*/React.createElement(Row, {
      label: t("TL_NEW_TRADE_ACCESSORY_COUNT"),
      text: t(acc === null || acc === void 0 ? void 0 : acc.accessorycount),
      actionButton: /*#__PURE__*/React.createElement(ActionButton, {
        jumpTo: routeLink + "/accessories-details"
      })
    }), /*#__PURE__*/React.createElement(Row, {
      label: t("TL_ACC_UOM_LABEL"),
      text: "" + (acc !== null && acc !== void 0 && acc.unit ? t(acc === null || acc === void 0 ? void 0 : acc.unit) : t("CS_NA")),
      actionButton: /*#__PURE__*/React.createElement(ActionButton, {
        jumpTo: routeLink + "/accessories-details"
      })
    }), /*#__PURE__*/React.createElement(Row, {
      label: t("TL_ACC_UOM_VALUE_LABEL"),
      text: "" + (acc !== null && acc !== void 0 && acc.unit ? t(acc === null || acc === void 0 ? void 0 : acc.uom) : t("CS_NA")),
      actionButton: /*#__PURE__*/React.createElement(ActionButton, {
        jumpTo: routeLink + "/accessories-details"
      })
    }));
  }), /*#__PURE__*/React.createElement(CardSubHeader, null, t("TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS")), /*#__PURE__*/React.createElement(Row, {
    label: t("TL_CHECK_ADDRESS"),
    text: (address !== null && address !== void 0 && (_address$doorNo = address.doorNo) !== null && _address$doorNo !== void 0 && _address$doorNo.trim() ? (address === null || address === void 0 ? void 0 : (_address$doorNo2 = address.doorNo) === null || _address$doorNo2 === void 0 ? void 0 : _address$doorNo2.trim()) + ", " : "") + " " + (address !== null && address !== void 0 && (_address$street = address.street) !== null && _address$street !== void 0 && _address$street.trim() ? (address === null || address === void 0 ? void 0 : (_address$street2 = address.street) === null || _address$street2 === void 0 ? void 0 : _address$street2.trim()) + ", " : "") + t(address === null || address === void 0 ? void 0 : (_address$locality = address.locality) === null || _address$locality === void 0 ? void 0 : _address$locality.i18nkey) + ", " + t(address === null || address === void 0 ? void 0 : address.city.code) + " " + (address !== null && address !== void 0 && (_address$pincode = address.pincode) !== null && _address$pincode !== void 0 && _address$pincode.trim() ? "," + (address === null || address === void 0 ? void 0 : (_address$pincode2 = address.pincode) === null || _address$pincode2 === void 0 ? void 0 : _address$pincode2.trim()) : ""),
    actionButton: /*#__PURE__*/React.createElement(ActionButton, {
      jumpTo: routeLink + "/map"
    })
  }), /*#__PURE__*/React.createElement(CardSubHeader, null, t("TL_NEW_OWNER_DETAILS_HEADER")), owners.owners && owners.owners.map(function (owner, index) {
    var _owner$gender;

    return /*#__PURE__*/React.createElement("div", {
      key: index
    }, /*#__PURE__*/React.createElement(CardSubHeader, null, t("TL_PAYMENT_PAID_BY_PLACEHOLDER"), "-", index + 1), /*#__PURE__*/React.createElement(Row, {
      label: t("TL_COMMON_TABLE_COL_OWN_NAME"),
      text: t(owner === null || owner === void 0 ? void 0 : owner.name),
      actionButton: /*#__PURE__*/React.createElement(ActionButton, {
        jumpTo: routeLink + "/owner-details"
      })
    }), /*#__PURE__*/React.createElement(Row, {
      label: t("TL_NEW_OWNER_DETAILS_GENDER_LABEL"),
      text: t(owner === null || owner === void 0 ? void 0 : (_owner$gender = owner.gender) === null || _owner$gender === void 0 ? void 0 : _owner$gender.i18nKey),
      actionButton: /*#__PURE__*/React.createElement(ActionButton, {
        jumpTo: routeLink + "/owner-details"
      })
    }), /*#__PURE__*/React.createElement(Row, {
      label: t("TL_MOBILE_NUMBER_LABEL"),
      text: t(owner === null || owner === void 0 ? void 0 : owner.mobilenumber),
      actionButton: /*#__PURE__*/React.createElement(ActionButton, {
        jumpTo: routeLink + "/owner-details"
      })
    }));
  }), /*#__PURE__*/React.createElement(CardSubHeader, null, t("TL_COMMON_DOCS")), /*#__PURE__*/React.createElement(ActionButton, {
    jumpTo: routeLink + "/proof-of-identity"
  }), /*#__PURE__*/React.createElement("div", null, owners !== null && owners !== void 0 && owners.documents["OwnerPhotoProof"] ? /*#__PURE__*/React.createElement(TLDocument, {
    value: value
  }) : /*#__PURE__*/React.createElement(StatusTable, null, /*#__PURE__*/React.createElement(Row, {
    text: "TL_NO_DOCUMENTS_MSG"
  })))), /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CS_COMMON_SUBMIT"),
    onSubmit: onSubmit
  }));
};

var capitalize = function capitalize(text) {
  return text.substr(0, 1).toUpperCase() + text.substr(1);
};

var ulbCamel = function ulbCamel(ulb) {
  return ulb.toLowerCase().split(" ").map(capitalize).join(" ");
};

var getOwnerDetails = function getOwnerDetails(application, t) {
  var _application$tradeLic, _application$tradeLic2, _application$tradeLic3;

  application.owners = (application === null || application === void 0 ? void 0 : (_application$tradeLic = application.tradeLicenseDetail) === null || _application$tradeLic === void 0 ? void 0 : (_application$tradeLic2 = _application$tradeLic.owners) === null || _application$tradeLic2 === void 0 ? void 0 : _application$tradeLic2.filter(function (owner) {
    return owner.active == true;
  })) || [];

  if ((application === null || application === void 0 ? void 0 : (_application$tradeLic3 = application.tradeLicenseDetail) === null || _application$tradeLic3 === void 0 ? void 0 : _application$tradeLic3.subOwnerShipCategory) == "INDIVIDUAL.SINGLEOWNER") {
    var _application$tradeLic4, _application$tradeLic5, _application$tradeLic6, _application$tradeLic7, _application$tradeLic8, _application$tradeLic9, _application$tradeLic10, _application$tradeLic11, _application$tradeLic12, _application$tradeLic13, _application$tradeLic14, _application$tradeLic15, _application$tradeLic16, _application$tradeLic17;

    return {
      title: t("TL_OWNERSHIP_DETAILS_HEADER"),
      values: [{
        title: t("TL_OWNER_S_NAME_LABEL"),
        value: (application === null || application === void 0 ? void 0 : (_application$tradeLic4 = application.tradeLicenseDetail) === null || _application$tradeLic4 === void 0 ? void 0 : (_application$tradeLic5 = _application$tradeLic4.owners[0]) === null || _application$tradeLic5 === void 0 ? void 0 : _application$tradeLic5.name) || t("CS_NA")
      }, {
        title: t("TL_OWNER_S_MOBILE_NUM_LABEL"),
        value: (application === null || application === void 0 ? void 0 : (_application$tradeLic6 = application.tradeLicenseDetail) === null || _application$tradeLic6 === void 0 ? void 0 : (_application$tradeLic7 = _application$tradeLic6.owners[0]) === null || _application$tradeLic7 === void 0 ? void 0 : _application$tradeLic7.mobileNumber) || t("CS_NA")
      }, {
        title: t("TL_NEW_OWNER_DETAILS_GENDER_LABEL"),
        value: t(application === null || application === void 0 ? void 0 : (_application$tradeLic8 = application.tradeLicenseDetail) === null || _application$tradeLic8 === void 0 ? void 0 : (_application$tradeLic9 = _application$tradeLic8.owners[0]) === null || _application$tradeLic9 === void 0 ? void 0 : _application$tradeLic9.gender) || t("CS_NA")
      }, {
        title: t("TL_NEW_OWNER_DETAILS_EMAIL_LABEL"),
        value: (application === null || application === void 0 ? void 0 : (_application$tradeLic10 = application.tradeLicenseDetail) === null || _application$tradeLic10 === void 0 ? void 0 : (_application$tradeLic11 = _application$tradeLic10.owners[0]) === null || _application$tradeLic11 === void 0 ? void 0 : _application$tradeLic11.emailId) || t("CS_NA")
      }, {
        title: t("TL_OWNER_SPECIAL_CATEGORY"),
        value: application !== null && application !== void 0 && (_application$tradeLic12 = application.tradeLicenseDetail) !== null && _application$tradeLic12 !== void 0 && (_application$tradeLic13 = _application$tradeLic12.owners[0]) !== null && _application$tradeLic13 !== void 0 && _application$tradeLic13.ownerType ? t("COMMON_MASTERS_OWNERTYPE_" + (application === null || application === void 0 ? void 0 : (_application$tradeLic14 = application.tradeLicenseDetail) === null || _application$tradeLic14 === void 0 ? void 0 : (_application$tradeLic15 = _application$tradeLic14.owners[0]) === null || _application$tradeLic15 === void 0 ? void 0 : _application$tradeLic15.ownerType)) : t("CS_NA")
      }, {
        title: t("TL_NEW_OWNER_DETAILS_ADDR_LABEL"),
        value: (application === null || application === void 0 ? void 0 : (_application$tradeLic16 = application.tradeLicenseDetail) === null || _application$tradeLic16 === void 0 ? void 0 : (_application$tradeLic17 = _application$tradeLic16.owners[0]) === null || _application$tradeLic17 === void 0 ? void 0 : _application$tradeLic17.permanentAddress) || t("CS_NA")
      }]
    };
  } else {
    var values = [];
    application === null || application === void 0 ? void 0 : application.tradeLicenseDetail.owners.map(function (owner) {
      var indOwner = [{
        title: t("TL_OWNER_S_NAME_LABEL"),
        value: (owner === null || owner === void 0 ? void 0 : owner.name) || t("CS_NA")
      }, {
        title: t("TL_OWNER_S_MOBILE_NUM_LABEL"),
        value: (owner === null || owner === void 0 ? void 0 : owner.mobileNumber) || t("CS_NA")
      }, {
        title: t("TL_NEW_OWNER_DETAILS_GENDER_LABEL"),
        value: t(owner === null || owner === void 0 ? void 0 : owner.gender) || t("CS_NA")
      }, {
        title: t("TL_NEW_OWNER_DETAILS_EMAIL_LABEL"),
        value: (owner === null || owner === void 0 ? void 0 : owner.emailId) || t("CS_NA")
      }, {
        title: t("TL_OWNER_SPECIAL_CATEGORY"),
        value: owner !== null && owner !== void 0 && owner.ownerType ? t("COMMON_MASTERS_OWNERTYPE_" + (owner === null || owner === void 0 ? void 0 : owner.ownerType)) : t("CS_NA")
      }, {
        title: t("TL_NEW_OWNER_DETAILS_ADDR_LABEL"),
        value: (owner === null || owner === void 0 ? void 0 : owner.permanentAddress) || t("CS_NA")
      }];
      values.push.apply(values, indOwner);
    });
    return {
      title: t("TL_OWNERSHIP_DETAILS_HEADER"),
      values: values
    };
  }
};

var getTradeDetails = function getTradeDetails(application, t) {
  var _application$tradeLic18, _application$tradeLic19, _application$tradeLic20, _application$tradeLic21, _application$tradeLic22, _application$tradeLic23, _application$tradeLic24, _application$tradeLic25, _application$tradeLic26;

  return {
    title: t("TL_COMMON_TR_DETAILS"),
    values: [{
      title: t("TL_APPLICATION_TYPE"),
      value: t("TRADELICENSE_APPLICATIONTYPE_" + (application === null || application === void 0 ? void 0 : application.applicationType)) || t("CS_NA")
    }, {
      title: t("TL_NEW_TRADE_DETAILS_LIC_TYPE_LABEL"),
      value: application !== null && application !== void 0 && application.licenseType ? t("TRADELICENSE_LICENSETYPE_" + (application === null || application === void 0 ? void 0 : application.licenseType)) : t("CS_NA")
    }, {
      title: t("TL_COMMON_TABLE_COL_TRD_NAME"),
      value: (application === null || application === void 0 ? void 0 : application.tradeName) || t("CS_NA")
    }, {
      title: t("reports.tl.fromDate"),
      value: application !== null && application !== void 0 && application.validFrom ? Digit.DateUtils.ConvertTimestampToDate(application === null || application === void 0 ? void 0 : application.validFrom, "dd/MM/yyyy") : t("CS_NA")
    }, {
      title: t("reports.tl.toDate"),
      value: application !== null && application !== void 0 && application.validTo ? Digit.DateUtils.ConvertTimestampToDate(application === null || application === void 0 ? void 0 : application.validTo, "dd/MM/yyyy") : t("CS_NA")
    }, {
      title: t("TL_NEW_TRADE_DETAILS_STRUCT_TYPE_LABEL"),
      value: application !== null && application !== void 0 && (_application$tradeLic18 = application.tradeLicenseDetail) !== null && _application$tradeLic18 !== void 0 && _application$tradeLic18.structureType ? t("COMMON_MASTERS_STRUCTURETYPE_" + (application === null || application === void 0 ? void 0 : (_application$tradeLic19 = application.tradeLicenseDetail) === null || _application$tradeLic19 === void 0 ? void 0 : (_application$tradeLic20 = _application$tradeLic19.structureType) === null || _application$tradeLic20 === void 0 ? void 0 : _application$tradeLic20.split('.')[0])) : t("CS_NA")
    }, {
      title: t("TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_LABEL"),
      value: application !== null && application !== void 0 && (_application$tradeLic21 = application.tradeLicenseDetail) !== null && _application$tradeLic21 !== void 0 && _application$tradeLic21.structureType ? t("COMMON_MASTERS_STRUCTURETYPE_" + stringReplaceAll(application === null || application === void 0 ? void 0 : (_application$tradeLic22 = application.tradeLicenseDetail) === null || _application$tradeLic22 === void 0 ? void 0 : _application$tradeLic22.structureType, ".", "_")) : t("CS_NA")
    }, {
      title: t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL"),
      value: Digit.DateUtils.ConvertTimestampToDate(application === null || application === void 0 ? void 0 : application.commencementDate, "dd/MM/yyyy") || t("CS_NA")
    }, {
      title: t("TL_NEW_GST_NUMBER_LABEL"),
      value: (application === null || application === void 0 ? void 0 : (_application$tradeLic23 = application.tradeLicenseDetail) === null || _application$tradeLic23 === void 0 ? void 0 : (_application$tradeLic24 = _application$tradeLic23.additionalDetail) === null || _application$tradeLic24 === void 0 ? void 0 : _application$tradeLic24.gstNo) || t("CS_NA")
    }, {
      title: t("TL_NEW_OPERATIONAL_SQ_FT_AREA_LABEL"),
      value: (application === null || application === void 0 ? void 0 : (_application$tradeLic25 = application.tradeLicenseDetail) === null || _application$tradeLic25 === void 0 ? void 0 : _application$tradeLic25.operationalArea) || t("CS_NA")
    }, {
      title: t("TL_NEW_NUMBER_OF_EMPLOYEES_LABEL"),
      value: (application === null || application === void 0 ? void 0 : (_application$tradeLic26 = application.tradeLicenseDetail) === null || _application$tradeLic26 === void 0 ? void 0 : _application$tradeLic26.noOfEmployees) || t("CS_NA")
    }]
  };
};

var getAccessoriesDetails = function getAccessoriesDetails(application, t) {
  var _application$tradeLic27, _application$tradeLic28;

  var values = [];
  (_application$tradeLic27 = application.tradeLicenseDetail) === null || _application$tradeLic27 === void 0 ? void 0 : (_application$tradeLic28 = _application$tradeLic27.accessories) === null || _application$tradeLic28 === void 0 ? void 0 : _application$tradeLic28.map(function (accessory) {
    var accessoryCategory = t("CS_NA");

    if (accessory !== null && accessory !== void 0 && accessory.accessoryCategory) {
      accessoryCategory = stringReplaceAll(accessory === null || accessory === void 0 ? void 0 : accessory.accessoryCategory, ".", "_");
      accessoryCategory = t("TRADELICENSE_ACCESSORIESCATEGORY_" + stringReplaceAll(accessoryCategory, "-", "_"));
    }

    var value = [{
      title: t("TL_NEW_TRADE_DETAILS_ACC_LABEL"),
      value: accessoryCategory
    }, {
      title: t("TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"),
      value: (accessory === null || accessory === void 0 ? void 0 : accessory.uom) || t("CS_NA")
    }, {
      title: t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"),
      value: (accessory === null || accessory === void 0 ? void 0 : accessory.uomValue) || t("CS_NA")
    }, {
      title: t("TL_ACCESSORY_COUNT_LABEL"),
      value: (accessory === null || accessory === void 0 ? void 0 : accessory.count) || t("CS_NA")
    }];
    values.push.apply(values, value);
  });
  return {
    title: "",
    values: values
  };
};

var getTradeUnitsDetails = function getTradeUnitsDetails(application, t) {
  var _application$tradeLic29, _application$tradeLic30;

  var values = [];
  (_application$tradeLic29 = application.tradeLicenseDetail) === null || _application$tradeLic29 === void 0 ? void 0 : (_application$tradeLic30 = _application$tradeLic29.tradeUnits) === null || _application$tradeLic30 === void 0 ? void 0 : _application$tradeLic30.map(function (unit) {
    var _unit$tradeType, _unit$tradeType2;

    var tradeSubType = stringReplaceAll(unit === null || unit === void 0 ? void 0 : unit.tradeType, ".", "_");
    tradeSubType = stringReplaceAll(tradeSubType, "-", "_");
    var value = [{
      title: t("TRADELICENSE_TRADECATEGORY_LABEL"),
      value: unit !== null && unit !== void 0 && unit.tradeType ? t("TRADELICENSE_TRADETYPE_" + (unit === null || unit === void 0 ? void 0 : (_unit$tradeType = unit.tradeType) === null || _unit$tradeType === void 0 ? void 0 : _unit$tradeType.split('.')[0])) : t("CS_NA")
    }, {
      title: t("TRADELICENSE_TRADETYPE_LABEL"),
      value: unit !== null && unit !== void 0 && unit.tradeType ? t("TRADELICENSE_TRADETYPE_" + (unit === null || unit === void 0 ? void 0 : (_unit$tradeType2 = unit.tradeType) === null || _unit$tradeType2 === void 0 ? void 0 : _unit$tradeType2.split('.')[1])) : t("CS_NA")
    }, {
      title: t("TL_NEW_TRADE_SUB_TYPE_LABEL"),
      value: tradeSubType ? t("TRADELICENSE_TRADETYPE_" + tradeSubType) : t("CS_NA")
    }, {
      title: t("TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"),
      value: (unit === null || unit === void 0 ? void 0 : unit.uom) || t("CS_NA")
    }, {
      title: t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"),
      value: (unit === null || unit === void 0 ? void 0 : unit.uomValue) || t("CS_NA")
    }, {
      title: "",
      value: ""
    }, {
      title: "",
      value: ""
    }, {
      title: "",
      value: ""
    }];
    values.push.apply(values, value);
  });
  return {
    title: "",
    values: values
  };
};

var getAddressDetails = function getAddressDetails(application, t) {
  var _application$tradeLic31, _application$tradeLic32, _application$tradeLic33, _application$tradeLic34, _application$tradeLic35, _application$tradeLic36, _application$tradeLic37, _application$tradeLic38, _application$tradeLic39;

  return {
    title: "",
    values: [{
      title: t("CORE_COMMON_PINCODE"),
      value: (application === null || application === void 0 ? void 0 : (_application$tradeLic31 = application.tradeLicenseDetail) === null || _application$tradeLic31 === void 0 ? void 0 : (_application$tradeLic32 = _application$tradeLic31.address) === null || _application$tradeLic32 === void 0 ? void 0 : _application$tradeLic32.pincode) || t("CS_NA")
    }, {
      title: t("MYCITY_CODE_LABEL"),
      value: t(application === null || application === void 0 ? void 0 : (_application$tradeLic33 = application.tradeLicenseDetail) === null || _application$tradeLic33 === void 0 ? void 0 : (_application$tradeLic34 = _application$tradeLic33.address) === null || _application$tradeLic34 === void 0 ? void 0 : _application$tradeLic34.city) || t("CS_NA")
    }, {
      title: t("TL_LOCALIZATION_LOCALITY"),
      value: t(getTransaltedLocality(application === null || application === void 0 ? void 0 : (_application$tradeLic35 = application.tradeLicenseDetail) === null || _application$tradeLic35 === void 0 ? void 0 : _application$tradeLic35.address)) || t("CS_NA")
    }, {
      title: t("TL_LOCALIZATION_BUILDING_NO"),
      value: (application === null || application === void 0 ? void 0 : (_application$tradeLic36 = application.tradeLicenseDetail) === null || _application$tradeLic36 === void 0 ? void 0 : (_application$tradeLic37 = _application$tradeLic36.address) === null || _application$tradeLic37 === void 0 ? void 0 : _application$tradeLic37.doorNo) || t("CS_NA")
    }, {
      title: t("TL_LOCALIZATION_STREET_NAME"),
      value: (application === null || application === void 0 ? void 0 : (_application$tradeLic38 = application.tradeLicenseDetail) === null || _application$tradeLic38 === void 0 ? void 0 : (_application$tradeLic39 = _application$tradeLic38.address) === null || _application$tradeLic39 === void 0 ? void 0 : _application$tradeLic39.street) || t("CS_NA")
    }]
  };
};

var getPTAcknowledgementData = function getPTAcknowledgementData(application, tenantInfo, t) {
  try {
    var _application$tradeLic43, _application$tradeLic44;

    var _temp3 = function _temp3() {
      var _tenantInfo$city, _tenantInfo$city2, _application$tradeLic40, _application$tradeLic41, _application$tradeLic42;

      return {
        t: t,
        tenantId: tenantInfo === null || tenantInfo === void 0 ? void 0 : tenantInfo.code,
        title: t(tenantInfo === null || tenantInfo === void 0 ? void 0 : tenantInfo.i18nKey) + " " + ulbCamel(t("ULBGRADE_" + (tenantInfo === null || tenantInfo === void 0 ? void 0 : (_tenantInfo$city = tenantInfo.city) === null || _tenantInfo$city === void 0 ? void 0 : _tenantInfo$city.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")))),
        name: t(tenantInfo === null || tenantInfo === void 0 ? void 0 : tenantInfo.i18nKey) + " " + ulbCamel(t("ULBGRADE_" + (tenantInfo === null || tenantInfo === void 0 ? void 0 : (_tenantInfo$city2 = tenantInfo.city) === null || _tenantInfo$city2 === void 0 ? void 0 : _tenantInfo$city2.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_")))),
        email: "",
        phoneNumber: "",
        details: [getTradeDetails(application, t), getTradeUnitsDetails(application, t), getAccessoriesDetails(application, t), getAddressDetails(application, t), getOwnerDetails(application, t), {
          title: t("TL_COMMON_DOCS"),
          values: (application === null || application === void 0 ? void 0 : (_application$tradeLic40 = application.tradeLicenseDetail) === null || _application$tradeLic40 === void 0 ? void 0 : (_application$tradeLic41 = _application$tradeLic40.applicationDocuments) === null || _application$tradeLic41 === void 0 ? void 0 : _application$tradeLic41.length) > 0 ? application === null || application === void 0 ? void 0 : (_application$tradeLic42 = application.tradeLicenseDetail) === null || _application$tradeLic42 === void 0 ? void 0 : _application$tradeLic42.applicationDocuments.map(function (document, index) {
            var _res;

            var documentLink = pdfDownloadLink((_res = res) === null || _res === void 0 ? void 0 : _res.data, document === null || document === void 0 ? void 0 : document.fileStoreId);
            return {
              title: t("TL_NEW_" + (document === null || document === void 0 ? void 0 : document.documentType) || t("CS_NA")),
              value: pdfDocumentName(documentLink, index) || t("CS_NA")
            };
          }) : []
        }]
      };
    };

    var filesArray = application === null || application === void 0 ? void 0 : (_application$tradeLic43 = application.tradeLicenseDetail) === null || _application$tradeLic43 === void 0 ? void 0 : (_application$tradeLic44 = _application$tradeLic43.applicationDocuments) === null || _application$tradeLic44 === void 0 ? void 0 : _application$tradeLic44.map(function (value) {
      return value === null || value === void 0 ? void 0 : value.fileStoreId;
    });
    var res;

    var _temp4 = function () {
      if (filesArray) {
        return Promise.resolve(Digit.UploadServices.Filefetch(filesArray, application === null || application === void 0 ? void 0 : application.tenantId.split(".")[0])).then(function (_Digit$UploadServices) {
          res = _Digit$UploadServices;
        });
      }
    }();

    return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
  } catch (e) {
    return Promise.reject(e);
  }
};

var GetActionMessage = function GetActionMessage(props) {
  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  if (props.isSuccess) {
    return !window.location.href.includes("renew-trade") ? t("CS_TRADE_APPLICATION_SUCCESS") : t("CS_TRADE_UPDATE_APPLICATION_SUCCESS");
  } else if (props.isLoading) {
    return !window.location.href.includes("renew-trade") ? t("CS_TRADE_APPLICATION_SUCCESS") : t("CS_TRADE_UPDATE_APPLICATION_PENDING");
  } else if (!props.isSuccess) {
    return !window.location.href.includes("renew-trade") ? t("CS_TRADE_APPLICATION_FAILED") : t("CS_TRADE_UPDATE_APPLICATION_FAILED");
  }
};

var BannerPicker = function BannerPicker(props) {
  var _props$data, _props$data$Licenses$;

  return /*#__PURE__*/React.createElement(Banner, {
    message: GetActionMessage(props),
    applicationNumber: (_props$data = props.data) === null || _props$data === void 0 ? void 0 : (_props$data$Licenses$ = _props$data.Licenses[0]) === null || _props$data$Licenses$ === void 0 ? void 0 : _props$data$Licenses$.applicationNumber,
    info: props.isSuccess ? props.t("TL_REF_NO_LABEL") : "",
    successful: props.isSuccess
  });
};

var TLAcknowledgement = function TLAcknowledgement(_ref) {
  var _data$address, _data$address2, _data$address2$city, _data$address3, _data$address4, _data$address4$city, _data$address5, _data$address6, _data$address6$city, _mutation2$data, _mutation2$data$Licen;

  var data = _ref.data,
      onSuccess = _ref.onSuccess;

  var _useTranslation2 = useTranslation(),
      t = _useTranslation2.t;

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("CITIZEN_TL_MUTATION_HAPPENED", false),
      mutationHappened = _Digit$Hooks$useSessi[0],
      setMutationHappened = _Digit$Hooks$useSessi[1];

  var resubmit = window.location.href.includes("edit-application");
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var mutation = Digit.Hooks.tl.useTradeLicenseAPI(data !== null && data !== void 0 && (_data$address = data.address) !== null && _data$address !== void 0 && _data$address.city ? (_data$address2 = data.address) === null || _data$address2 === void 0 ? void 0 : (_data$address2$city = _data$address2.city) === null || _data$address2$city === void 0 ? void 0 : _data$address2$city.code : tenantId, !window.location.href.includes("renew-trade"));
  var mutation1 = Digit.Hooks.tl.useTradeLicenseAPI(data !== null && data !== void 0 && (_data$address3 = data.address) !== null && _data$address3 !== void 0 && _data$address3.city ? (_data$address4 = data.address) === null || _data$address4 === void 0 ? void 0 : (_data$address4$city = _data$address4.city) === null || _data$address4$city === void 0 ? void 0 : _data$address4$city.code : tenantId, false);
  var mutation2 = Digit.Hooks.tl.useTradeLicenseAPI(data !== null && data !== void 0 && (_data$address5 = data.address) !== null && _data$address5 !== void 0 && _data$address5.city ? (_data$address6 = data.address) === null || _data$address6 === void 0 ? void 0 : (_data$address6$city = _data$address6.city) === null || _data$address6$city === void 0 ? void 0 : _data$address6$city.code : tenantId, false);
  var isEdit = window.location.href.includes("renew-trade");

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      storeData = _Digit$Hooks$useStore.data;

  var _ref2 = storeData || {},
      tenants = _ref2.tenants;

  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", "FinancialYear"),
      _Digit$Hooks$tl$useTr2 = _Digit$Hooks$tl$useTr.data,
      fydata = _Digit$Hooks$tl$useTr2 === void 0 ? {} : _Digit$Hooks$tl$useTr2;

  var isDirectRenewal = sessionStorage.getItem("isDirectRenewal") ? stringToBoolean(sessionStorage.getItem("isDirectRenewal")) : null;
  useEffect(function () {
    var onSuccessedit = function onSuccessedit() {
      setMutationHappened(true);
    };

    try {
      if (!resubmit) {
        var _data$address7, _data$address8, _data$address8$city, _formdata$Licenses$;

        var _tenantId = data !== null && data !== void 0 && (_data$address7 = data.address) !== null && _data$address7 !== void 0 && _data$address7.city ? (_data$address8 = data.address) === null || _data$address8 === void 0 ? void 0 : (_data$address8$city = _data$address8.city) === null || _data$address8$city === void 0 ? void 0 : _data$address8$city.code : _tenantId;

        data.tenantId = _tenantId;
        var formdata = !isEdit ? convertToTrade(data) : convertToEditTrade(data, fydata["egf-master"] ? fydata["egf-master"].FinancialYear.filter(function (y) {
          return y.module === "TL";
        }) : []);
        formdata.Licenses[0].tenantId = (formdata === null || formdata === void 0 ? void 0 : (_formdata$Licenses$ = formdata.Licenses[0]) === null || _formdata$Licenses$ === void 0 ? void 0 : _formdata$Licenses$.tenantId) || _tenantId;
        !isEdit ? mutation.mutate(formdata, {
          onSuccess: onSuccess
        }) : fydata["egf-master"] && fydata["egf-master"].FinancialYear.length > 0 ? isDirectRenewal ? mutation2.mutate(formdata, {
          onSuccess: onSuccess
        }) : mutation1.mutate(formdata, {
          onSuccess: onSuccess
        }) : console.log("skipped");
      } else {
        var _data$address9, _data$address10, _data$address10$city, _formdata$Licenses$2;

        var _tenantId2 = data !== null && data !== void 0 && (_data$address9 = data.address) !== null && _data$address9 !== void 0 && _data$address9.city ? (_data$address10 = data.address) === null || _data$address10 === void 0 ? void 0 : (_data$address10$city = _data$address10.city) === null || _data$address10$city === void 0 ? void 0 : _data$address10$city.code : _tenantId2;

        data.tenantId = _tenantId2;

        var _formdata = convertToResubmitTrade(data);

        _formdata.Licenses[0].tenantId = (_formdata === null || _formdata === void 0 ? void 0 : (_formdata$Licenses$2 = _formdata.Licenses[0]) === null || _formdata$Licenses$2 === void 0 ? void 0 : _formdata$Licenses$2.tenantId) || _tenantId2;
        !mutation2.isLoading && !mutation2.isSuccess && !mutationHappened && mutation2.mutate(_formdata, {
          onSuccessedit: onSuccessedit
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [fydata]);
  useEffect(function () {
    if (mutation.isSuccess || mutation1.isSuccess && isEdit && !isDirectRenewal) {
      try {
        var _data$address11, _data$address12, _data$address12$city;

        var _tenantId3 = data !== null && data !== void 0 && (_data$address11 = data.address) !== null && _data$address11 !== void 0 && _data$address11.city ? (_data$address12 = data.address) === null || _data$address12 === void 0 ? void 0 : (_data$address12$city = _data$address12.city) === null || _data$address12$city === void 0 ? void 0 : _data$address12$city.code : Digit.ULBService.getCurrentTenantId();

        var Licenses = !isEdit ? convertToUpdateTrade(mutation.data, data) : convertToUpdateTrade(mutation1.data, data);
        mutation2.mutate(Licenses, {
          onSuccess: onSuccess
        });
      } catch (er) {
        console.info("error in update", er);
      }
    }
  }, [mutation.isSuccess, mutation1.isSuccess]);

  var handleDownloadPdf = function handleDownloadPdf() {
    try {
      var _ref3 = mutation.data || mutation1.data || mutation2.data,
          _ref3$Licenses = _ref3.Licenses,
          Licenses = _ref3$Licenses === void 0 ? [] : _ref3$Licenses;

      var License = Licenses && Licenses[0] || {};
      var tenantInfo = tenants.find(function (tenant) {
        return tenant.code === License.tenantId;
      });
      var res = License;

      var _data = getPTAcknowledgementData(_extends({}, res), tenantInfo, t);

      _data.then(function (ress) {
        return Digit.Utils.pdf.generate(ress);
      });

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return mutation2.isLoading || mutation2.isIdle ? /*#__PURE__*/React.createElement(Loader, null) : /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(BannerPicker, {
    t: t,
    data: mutation2.data,
    isSuccess: mutation2.isSuccess,
    isLoading: mutation2.isIdle || mutation2.isLoading
  }), mutation2.isSuccess && /*#__PURE__*/React.createElement(CardText, null, !isDirectRenewal ? t("TL_FILE_TRADE_RESPONSE") : t("TL_FILE_TRADE_RESPONSE_DIRECT_REN")), !mutation2.isSuccess && /*#__PURE__*/React.createElement(CardText, null, t("TL_FILE_TRADE_FAILED_RESPONSE")), !isEdit && mutation2.isSuccess && /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("TL_DOWNLOAD_ACK_FORM"),
    onSubmit: handleDownloadPdf
  }), mutation2.isSuccess && isEdit && /*#__PURE__*/React.createElement(LinkButton, {
    label: /*#__PURE__*/React.createElement("div", {
      className: "response-download-button"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "#f47738"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
    }))), /*#__PURE__*/React.createElement("span", {
      className: "download-button"
    }, t("TL_DOWNLOAD_ACK_FORM"))),
    onClick: handleDownloadPdf
  }), (mutation2 === null || mutation2 === void 0 ? void 0 : (_mutation2$data = mutation2.data) === null || _mutation2$data === void 0 ? void 0 : (_mutation2$data$Licen = _mutation2$data.Licenses[0]) === null || _mutation2$data$Licen === void 0 ? void 0 : _mutation2$data$Licen.status) === "PENDINGPAYMENT" && /*#__PURE__*/React.createElement(Link, {
    to: {
      pathname: "/digit-ui/citizen/payment/collect/" + mutation2.data.Licenses[0].businessService + "/" + mutation2.data.Licenses[0].applicationNumber,
      state: {
        tenantId: mutation2.data.Licenses[0].tenantId
      }
    }
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("COMMON_MAKE_PAYMENT")
  })), /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/citizen"
  }, /*#__PURE__*/React.createElement(LinkButton, {
    label: t("CORE_COMMON_GO_TO_HOME")
  })));
};

var MyApplications = function MyApplications(_ref) {
  var _Digit$UserService$ge;

  var view = _ref.view;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _ref2 = ((_Digit$UserService$ge = Digit.UserService.getUser()) === null || _Digit$UserService$ge === void 0 ? void 0 : _Digit$UserService$ge.info) || {},
      mobileNumber = _ref2.mobileNumber,
      tenantId = _ref2.tenantId;

  var _ref3 = view === "bills" ? Digit.Hooks.tl.useFetchBill({
    params: {
      businessService: "TL",
      tenantId: tenantId,
      mobileNumber: mobileNumber
    },
    config: {
      enabled: view === "bills"
    }
  }) : Digit.Hooks.tl.useTLSearchApplication({}, {
    enabled: view !== "bills"
  }, t),
      isLoading = _ref3.isLoading,
      data = _ref3.data,
      rest = _objectWithoutPropertiesLoose(_ref3, ["isLoading", "isError", "data", "error"]);

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, null, "" + t("TL_MY_APPLICATIONS_HEADER")), data === null || data === void 0 ? void 0 : data.map(function (application) {
    var _application$raw, _application$raw2, _application$raw3;

    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Card, null, Object.keys(application).filter(function (e) {
      return e !== "raw";
    }).map(function (item) {
      return /*#__PURE__*/React.createElement(KeyNote, {
        keyValue: t(item),
        note: t(application[item])
      });
    }), /*#__PURE__*/React.createElement(Link, {
      to: "/digit-ui/citizen/tl/tradelicence/application/" + (application === null || application === void 0 ? void 0 : (_application$raw = application.raw) === null || _application$raw === void 0 ? void 0 : _application$raw.applicationNumber) + "/" + ((_application$raw2 = application.raw) === null || _application$raw2 === void 0 ? void 0 : _application$raw2.tenantId)
    }, /*#__PURE__*/React.createElement(SubmitBar, {
      label: t((application === null || application === void 0 ? void 0 : (_application$raw3 = application.raw) === null || _application$raw3 === void 0 ? void 0 : _application$raw3.status) != "PENDINGPAYMENT" ? "TL_VIEW_DETAILS" : "TL_VIEW_DETAILS_PAY")
    })), " "));
  }));
};

var TradeLicenseList = function TradeLicenseList(_ref) {
  var _application$tradeLic;

  var application = _ref.application;
  sessionStorage.setItem("isDirectRenewal", true);
  var history = useHistory();
  var owners = application === null || application === void 0 ? void 0 : (_application$tradeLic = application.tradeLicenseDetail) === null || _application$tradeLic === void 0 ? void 0 : _application$tradeLic.owners;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", "FinancialYear"),
      _Digit$Hooks$tl$useTr2 = _Digit$Hooks$tl$useTr.data,
      fydata = _Digit$Hooks$tl$useTr2 === void 0 ? {} : _Digit$Hooks$tl$useTr2;

  var mdmsFinancialYear = fydata["egf-master"] ? fydata["egf-master"].FinancialYear.filter(function (y) {
    return y.module === "TL";
  }) : [];

  var onsubmit = function onsubmit() {
    history.push("/digit-ui/citizen/tl/tradelicence/renew-trade/" + application.licenseNumber + "/" + application.tenantId);
  };

  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(KeyNote, {
    keyValue: t("TL_LOCALIZATION_TRADE_NAME"),
    note: application.tradeName
  }), /*#__PURE__*/React.createElement(KeyNote, {
    keyValue: t("TL_LICENSE_NUMBERL_LABEL"),
    note: application.licenseNumber
  }), /*#__PURE__*/React.createElement(KeyNote, {
    keyValue: t("TL_LOCALIZATION_OWNER_NAME"),
    note: owners.map(function (owners, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: "index"
      }, index == owners.length - 1 ? (owners === null || owners === void 0 ? void 0 : owners.name) + "," : owners.name);
    })
  }), /*#__PURE__*/React.createElement(KeyNote, {
    keyValue: t("TL_LOCALIZATION_LICENSE_STATUS"),
    note: application.status === "APPROVED" ? t("TL_ACTIVE_STATUS_MSG") + " " + convertEpochToDateCitizen(application.validTo) : t("TL_EXPIRED_STATUS_MSG") + convertEpochToDateCitizen(application.validTo) + " " + t("TL_EXPIRED_STATUS_MSG_1")
  }), /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("TL_RENEW_LABEL"),
    onSubmit: onsubmit
  }));
};

var TLWFReason = function TLWFReason(_ref) {
  var headComment = _ref.headComment,
      otherComment = _ref.otherComment;
  return /*#__PURE__*/React.createElement("div", {
    className: "checkpoint-comments-wrap"
  }, /*#__PURE__*/React.createElement("h4", null, headComment), /*#__PURE__*/React.createElement("p", null, otherComment));
};

var TLWFCaption = function TLWFCaption(_ref) {
  var data = _ref.data;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React.createElement("div", null, data.date && /*#__PURE__*/React.createElement("p", null, data.date), /*#__PURE__*/React.createElement("p", null, data.name), data.mobileNumber && /*#__PURE__*/React.createElement(TelePhone, {
    mobile: data.mobileNumber
  }), data.source && /*#__PURE__*/React.createElement("p", null, t("ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_" + data.source.toUpperCase())), data.comment && /*#__PURE__*/React.createElement(TLWFReason, {
    otherComment: data === null || data === void 0 ? void 0 : data.otherComment,
    headComment: data === null || data === void 0 ? void 0 : data.comment
  }));
};

var TLWFApplicationTimeline = function TLWFApplicationTimeline(props) {
  var _props$application, _props$application2, _data$timeline, _data$timeline2, _data$timeline$;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var businessService = (_props$application = props.application) === null || _props$application === void 0 ? void 0 : _props$application.businessService;

  var _Digit$Hooks$useWorkf = Digit.Hooks.useWorkflowDetails({
    tenantId: (_props$application2 = props.application) === null || _props$application2 === void 0 ? void 0 : _props$application2.tenantId,
    id: props.id,
    moduleCode: businessService
  }),
      isLoading = _Digit$Hooks$useWorkf.isLoading,
      data = _Digit$Hooks$useWorkf.data;

  var getTimelineCaptions = function getTimelineCaptions(checkpoint) {
    if (checkpoint.state === "INITIATE") {
      var _props$application3, _props$application3$a, _props$application4, _props$application4$t;

      var caption = {
        date: Digit.DateUtils.ConvertTimestampToDate((_props$application3 = props.application) === null || _props$application3 === void 0 ? void 0 : (_props$application3$a = _props$application3.auditDetails) === null || _props$application3$a === void 0 ? void 0 : _props$application3$a.createdTime),
        source: ((_props$application4 = props.application) === null || _props$application4 === void 0 ? void 0 : (_props$application4$t = _props$application4.tradeLicenseDetail) === null || _props$application4$t === void 0 ? void 0 : _props$application4$t.channel) || ""
      };
      return /*#__PURE__*/React.createElement(TLWFCaption, {
        data: caption
      });
    } else {
      var _props$application5, _checkpoint$assigner;

      var _caption = {
        date: Digit.DateUtils.ConvertTimestampToDate((_props$application5 = props.application) === null || _props$application5 === void 0 ? void 0 : _props$application5.auditDetails.lastModifiedTime),
        name: checkpoint === null || checkpoint === void 0 ? void 0 : (_checkpoint$assigner = checkpoint.assigner) === null || _checkpoint$assigner === void 0 ? void 0 : _checkpoint$assigner.name,
        comment: t(checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.comment)
      };
      return /*#__PURE__*/React.createElement(TLWFCaption, {
        data: _caption
      });
    }
  };

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, !isLoading && /*#__PURE__*/React.createElement(Fragment$1, null, (data === null || data === void 0 ? void 0 : (_data$timeline = data.timeline) === null || _data$timeline === void 0 ? void 0 : _data$timeline.length) > 0 && /*#__PURE__*/React.createElement(CardSectionHeader, {
    style: {
      marginBottom: "16px",
      marginTop: "32px"
    }
  }, t("CS_APPLICATION_DETAILS_APPLICATION_TIMELINE")), data !== null && data !== void 0 && data.timeline && (data === null || data === void 0 ? void 0 : (_data$timeline2 = data.timeline) === null || _data$timeline2 === void 0 ? void 0 : _data$timeline2.length) === 1 ? /*#__PURE__*/React.createElement(CheckPoint, {
    isCompleted: true,
    label: t((data === null || data === void 0 ? void 0 : (_data$timeline$ = data.timeline[0]) === null || _data$timeline$ === void 0 ? void 0 : _data$timeline$.state) && "WF_" + businessService + "_" + data.timeline[0].state || "NA"),
    customChild: getTimelineCaptions(data === null || data === void 0 ? void 0 : data.timeline[0])
  }) : /*#__PURE__*/React.createElement(ConnectingCheckPoints, null, (data === null || data === void 0 ? void 0 : data.timeline) && (data === null || data === void 0 ? void 0 : data.timeline.map(function (checkpoint, index, arr) {
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: index
    }, /*#__PURE__*/React.createElement(CheckPoint, {
      keyValue: index,
      isCompleted: index === 0,
      label: checkpoint.state ? t("WF_NEW" + businessService + "_" + checkpoint.state) : "NA",
      customChild: getTimelineCaptions(checkpoint)
    }));
  })))));
};

var createOwnerDetails = function createOwnerDetails() {
  return {
    name: "",
    mobileNumber: "",
    emailId: "",
    permanentAddress: "",
    ownerType: "",
    gender: "",
    key: Date.now()
  };
};

var TLOwnerDetailsEmployee = function TLOwnerDetailsEmployee(_ref) {
  var _formData$ownershipCa4, _formData$tradeUnits2, _formData$tradeUnits3, _formData$tradeUnits4, _formData$ownershipCa5, _formState$errors, _formState$errors$mul;

  var config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData,
      setError = _ref.setError,
      formState = _ref.formState,
      clearErrors = _ref.clearErrors;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useLocation = useLocation(),
      pathname = _useLocation.pathname;

  var isEditScreen = pathname.includes("/modify-application/");

  var _useState = useState((formData === null || formData === void 0 ? void 0 : formData.owners) || [createOwnerDetails()]),
      owners = _useState[0],
      setOwners = _useState[1];

  var _useState2 = useState({
    index: -1,
    type: ""
  }),
      focusIndex = _useState2[0],
      setFocusIndex = _useState2[1];

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState3 = useState(false),
      isErrors = _useState3[0],
      setIsErrors = _useState3[1];

  var _useState4 = useState((formData === null || formData === void 0 ? void 0 : formData.tradedetils1) || []),
      previousLicenseDetails = _useState4[0],
      setPreviousLicenseDetails = _useState4[1];

  var _Digit$Hooks$pt$usePr = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", ["UsageCategory", "OccupancyType", "Floor", "OwnerType", "OwnerShipCategory", "Documents", "SubOwnerShipCategory", "OwnerShipCategory"]),
      mdmsData = _Digit$Hooks$pt$usePr.data;

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", ["GenderType"]),
      genderTypeData = _Digit$Hooks$tl$useTr.data;

  var addNewOwner = function addNewOwner() {
    var newOwner = createOwnerDetails();
    setOwners(function (prev) {
      return [].concat(prev, [newOwner]);
    });
  };

  var removeOwner = function removeOwner(owner) {
    setOwners(function (prev) {
      return prev.filter(function (o) {
        return o.key != owner.key;
      });
    });
  };

  useEffect(function () {
    var _formData$ownershipCa, _formData$ownershipCa2;

    if ((formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa = formData.ownershipCategory) === null || _formData$ownershipCa === void 0 ? void 0 : _formData$ownershipCa.code) == "INDIVIDUAL.MULTIPLEOWNERS" && owners.length > 1) clearErrors("mulipleOwnerError");
    if ((formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa2 = formData.ownershipCategory) === null || _formData$ownershipCa2 === void 0 ? void 0 : _formData$ownershipCa2.code) == "INDIVIDUAL.MULTIPLEOWNERS" && owners.length == 1) setError("mulipleOwnerError", {
      type: "owner_missing",
      message: "TL_ERROR_MULTIPLE_OWNER"
    });
    var data = owners.map(function (e) {
      return e;
    });
    onSelect(config === null || config === void 0 ? void 0 : config.key, data);
  }, [owners]);
  useEffect(function () {
    onSelect("tradedetils1", previousLicenseDetails);
  }, [previousLicenseDetails]);
  useEffect(function () {
    if (window.location.href.includes("tl/new-application")) {
      var _formData$ownershipCa3;

      setOwners([createOwnerDetails()]);
      if ((formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa3 = formData.ownershipCategory) === null || _formData$ownershipCa3 === void 0 ? void 0 : _formData$ownershipCa3.code) == "INDIVIDUAL.MULTIPLEOWNERS") setError("mulipleOwnerError", {
        type: "owner_missing",
        message: "TL_ERROR_MULTIPLE_OWNER"
      });
    }
  }, [formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa4 = formData.ownershipCategory) === null || _formData$ownershipCa4 === void 0 ? void 0 : _formData$ownershipCa4.code]);
  var isRenewal = window.location.href.includes("tl/renew-application-details");
  if (window.location.href.includes("tl/edit-application-details")) isRenewal = true;
  useEffect(function () {
    var _formData$tradeUnits;

    if ((formData === null || formData === void 0 ? void 0 : (_formData$tradeUnits = formData.tradeUnits) === null || _formData$tradeUnits === void 0 ? void 0 : _formData$tradeUnits.length) > 0 && !isRenewal) {
      var flag = true;
      owners.map(function (data) {
        Object.keys(data).map(function (dta) {
          if (dta != "key" && data[dta]) flag = false;
        });
      });
      formData === null || formData === void 0 ? void 0 : formData.tradeUnits.map(function (data) {
        Object.keys(data).map(function (dta) {
          if (dta != "key" && data[dta] != undefined && data[data] != "" && data[data] != null) ; else {
            if (flag) setOwners([createOwnerDetails()]);
            flag = false;
          }
        });
      });
    }
  }, [formData === null || formData === void 0 ? void 0 : (_formData$tradeUnits2 = formData.tradeUnits) === null || _formData$tradeUnits2 === void 0 ? void 0 : (_formData$tradeUnits3 = _formData$tradeUnits2[0]) === null || _formData$tradeUnits3 === void 0 ? void 0 : (_formData$tradeUnits4 = _formData$tradeUnits3.tradeCategory) === null || _formData$tradeUnits4 === void 0 ? void 0 : _formData$tradeUnits4.code]);
  var commonProps = {
    focusIndex: focusIndex,
    allOwners: owners,
    setFocusIndex: setFocusIndex,
    removeOwner: removeOwner,
    formData: formData,
    formState: formState,
    setOwners: setOwners,
    mdmsData: mdmsData,
    t: t,
    setError: setError,
    clearErrors: clearErrors,
    config: config,
    setIsErrors: setIsErrors,
    isErrors: isErrors,
    isRenewal: isRenewal,
    previousLicenseDetails: previousLicenseDetails,
    setPreviousLicenseDetails: setPreviousLicenseDetails,
    genderTypeData: genderTypeData
  };

  if (isEditScreen) {
    return /*#__PURE__*/React.createElement(React.Fragment, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, owners.map(function (owner, index) {
    return /*#__PURE__*/React.createElement(OwnerForm, _extends({
      key: owner.key,
      index: index,
      owner: owner
    }, commonProps));
  }), (formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa5 = formData.ownershipCategory) === null || _formData$ownershipCa5 === void 0 ? void 0 : _formData$ownershipCa5.code) === "INDIVIDUAL.MULTIPLEOWNERS" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(LinkButton, {
    label: t("TL_NEW_OWNER_DETAILS_ADD_OWN"),
    onClick: addNewOwner,
    style: {
      color: "#F47738",
      width: "fit-content"
    }
  }), /*#__PURE__*/React.createElement(CardLabelError, {
    style: {
      width: "70%",
      marginLeft: "30%",
      fontSize: "12px",
      marginTop: "-24px"
    }
  }, t(((_formState$errors = formState.errors) === null || _formState$errors === void 0 ? void 0 : (_formState$errors$mul = _formState$errors.mulipleOwnerError) === null || _formState$errors$mul === void 0 ? void 0 : _formState$errors$mul.message) || ""))) : null);
};

var OwnerForm = function OwnerForm(_props) {
  var _genderTypeData$commo, _genderTypeData$commo2, _formData$ownershipCa7, _formData$ownershipCa8, _formData$ownershipCa9, _errors$name2, _errors$mobileNumber2, _errors$gender2, _errors$emailId2, _errors$ownerType2, _errors$permanentAddr2;

  var owner = _props.owner,
      focusIndex = _props.focusIndex,
      allOwners = _props.allOwners,
      setFocusIndex = _props.setFocusIndex,
      removeOwner = _props.removeOwner,
      setOwners = _props.setOwners,
      t = _props.t,
      mdmsData = _props.mdmsData,
      formData = _props.formData,
      config = _props.config,
      setError = _props.setError,
      clearErrors = _props.clearErrors,
      formState = _props.formState,
      setIsErrors = _props.setIsErrors,
      isErrors = _props.isErrors,
      isRenewal = _props.isRenewal,
      previousLicenseDetails = _props.previousLicenseDetails,
      setPreviousLicenseDetails = _props.setPreviousLicenseDetails,
      genderTypeData = _props.genderTypeData;

  var _useForm = useForm(),
      control = _useForm.control,
      localFormState = _useForm.formState,
      watch = _useForm.watch,
      trigger = _useForm.trigger;

  var formValue = watch();
  var errors = localFormState.errors;
  var ownerTypesMenu = useMemo(function () {
    var _mdmsData$PropertyTax, _mdmsData$PropertyTax2, _mdmsData$PropertyTax3;

    return (mdmsData === null || mdmsData === void 0 ? void 0 : (_mdmsData$PropertyTax = mdmsData.PropertyTax) === null || _mdmsData$PropertyTax === void 0 ? void 0 : (_mdmsData$PropertyTax2 = _mdmsData$PropertyTax.OwnerType) === null || _mdmsData$PropertyTax2 === void 0 ? void 0 : (_mdmsData$PropertyTax3 = _mdmsData$PropertyTax2.map) === null || _mdmsData$PropertyTax3 === void 0 ? void 0 : _mdmsData$PropertyTax3.call(_mdmsData$PropertyTax2, function (e) {
      return {
        i18nKey: "" + e.code.replaceAll("PROPERTY", "COMMON_MASTERS").replaceAll(".", "_"),
        code: e.code
      };
    })) || [];
  }, [mdmsData]);
  var genderFilterTypeMenu = genderTypeData && ((_genderTypeData$commo = genderTypeData["common-masters"]) === null || _genderTypeData$commo === void 0 ? void 0 : (_genderTypeData$commo2 = _genderTypeData$commo.GenderType) === null || _genderTypeData$commo2 === void 0 ? void 0 : _genderTypeData$commo2.filter(function (e) {
    return e.active;
  }));
  var genderTypeMenu = useMemo(function () {
    var _genderFilterTypeMenu;

    return (genderFilterTypeMenu === null || genderFilterTypeMenu === void 0 ? void 0 : (_genderFilterTypeMenu = genderFilterTypeMenu.map) === null || _genderFilterTypeMenu === void 0 ? void 0 : _genderFilterTypeMenu.call(genderFilterTypeMenu, function (e) {
      return {
        i18nKey: "TL_GENDER_" + e.code,
        code: e.code
      };
    })) || [];
  }, [genderFilterTypeMenu]);
  var isIndividualTypeOwner = useMemo(function () {
    var _formData$ownershipCa6;

    return formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa6 = formData.ownershipCategory) === null || _formData$ownershipCa6 === void 0 ? void 0 : _formData$ownershipCa6.code.includes("INDIVIDUAL");
  }, [formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa7 = formData.ownershipCategory) === null || _formData$ownershipCa7 === void 0 ? void 0 : _formData$ownershipCa7.code]);
  useEffect(function () {
    trigger();
  }, []);
  useEffect(function () {
    var keys = Object.keys(formValue);
    var part = {};
    keys.forEach(function (key) {
      return part[key] = owner[key];
    });

    if (!lodash.isEqual(formValue, part)) {
      Object.keys(formValue).map(function (data) {
        if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
          setIsErrors(true);
        }
      });
      setOwners(function (prev) {
        return prev.map(function (o) {
          return o.key && o.key === owner.key ? _extends({}, o, formValue) : _extends({}, o);
        });
      });
      trigger();
    }
  }, [formValue]);
  useEffect(function () {
    var _formState$errors$con;

    if (Object.keys(errors).length && !lodash.isEqual(((_formState$errors$con = formState.errors[config.key]) === null || _formState$errors$con === void 0 ? void 0 : _formState$errors$con.type) || {}, errors)) {
      setError(config.key, {
        type: errors
      });
    } else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [errors]);
  var errorStyle = {
    width: "70%",
    marginLeft: "30%",
    fontSize: "12px",
    marginTop: "-21px"
  };
  var isMulitpleOwners = false;
  if ((formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa8 = formData.ownershipCategory) === null || _formData$ownershipCa8 === void 0 ? void 0 : _formData$ownershipCa8.code) === "INDIVIDUAL.MULTIPLEOWNERS") isMulitpleOwners = true;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: (formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa9 = formData.ownershipCategory) === null || _formData$ownershipCa9 === void 0 ? void 0 : _formData$ownershipCa9.code) === "INDIVIDUAL.MULTIPLEOWNERS" ? {
      border: "1px solid #D6D5D4",
      padding: "16px",
      marginTop: "8px",
      borderRadius: "4px",
      background: "#FAFAFA"
    } : {}
  }, (allOwners === null || allOwners === void 0 ? void 0 : allOwners.length) > 1 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return removeOwner(owner);
    },
    style: {
      padding: "5px",
      cursor: "pointer",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("svg", {
    style: {
      float: "right",
      position: "relative",
      bottom: "5px"
    },
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z",
    fill: "#494848"
  }))))) : null, /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_OWNER_S_NAME_LABEL") + " * :"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "name",
    defaultValue: owner === null || owner === void 0 ? void 0 : owner.name,
    rules: {
      required: t("REQUIRED_FIELD"),
      validate: {
        pattern: function pattern(val) {
          return /^\w+( +\w+)*$/.test(val) ? true : t("INVALID_NAME");
        }
      }
    },
    render: function render(props) {
      var _errors$name;

      return /*#__PURE__*/React.createElement(TextInput, {
        value: props.value,
        autoFocus: focusIndex.index === (owner === null || owner === void 0 ? void 0 : owner.key) && focusIndex.type === "name",
        errorStyle: localFormState.touched.name && errors !== null && errors !== void 0 && (_errors$name = errors.name) !== null && _errors$name !== void 0 && _errors$name.message ? true : false,
        onChange: function onChange(e) {
          if (e.target.value != (owner === null || owner === void 0 ? void 0 : owner.name) && isRenewal) setPreviousLicenseDetails(_extends({}, previousLicenseDetails, {
            checkForRenewal: true
          }));
          props.onChange(e.target.value);
          setFocusIndex({
            index: owner.key,
            type: "name"
          });
        },
        onBlur: function onBlur(e) {
          setFocusIndex({
            index: -1
          });
          props.onBlur(e);
        },
        style: isMulitpleOwners ? {
          background: "#FAFAFA"
        } : ""
      });
    }
  }))), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.name ? errors === null || errors === void 0 ? void 0 : (_errors$name2 = errors.name) === null || _errors$name2 === void 0 ? void 0 : _errors$name2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_OWNER_S_MOBILE_NUM_LABEL") + " * :"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "mobileNumber",
    defaultValue: owner === null || owner === void 0 ? void 0 : owner.mobileNumber,
    rules: {
      required: t("REQUIRED_FIELD"),
      validate: function validate(v) {
        return /^[6789]\d{9}$/.test(v) ? true : t("INVALID_NUMBER");
      }
    },
    render: function render(props) {
      var _errors$mobileNumber;

      return /*#__PURE__*/React.createElement(MobileNumber, {
        value: props.value,
        autoFocus: focusIndex.index === (owner === null || owner === void 0 ? void 0 : owner.key) && focusIndex.type === "mobileNumber",
        onChange: function onChange(e) {
          if (e != (owner === null || owner === void 0 ? void 0 : owner.mobileNumber) && isRenewal) setPreviousLicenseDetails(_extends({}, previousLicenseDetails, {
            checkForRenewal: true
          }));
          props.onChange(e);
          setFocusIndex({
            index: owner.key,
            type: "mobileNumber"
          });
        },
        labelStyle: {
          marginTop: "unset",
          border: "1px solid #464646",
          borderRight: "none"
        },
        onBlur: props.onBlur,
        errorStyle: localFormState.touched.mobileNumber && errors !== null && errors !== void 0 && (_errors$mobileNumber = errors.mobileNumber) !== null && _errors$mobileNumber !== void 0 && _errors$mobileNumber.message ? true : false,
        style: isMulitpleOwners ? {
          background: "#FAFAFA"
        } : ""
      });
    }
  }))), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.mobileNumber ? errors === null || errors === void 0 ? void 0 : (_errors$mobileNumber2 = errors.mobileNumber) === null || _errors$mobileNumber2 === void 0 ? void 0 : _errors$mobileNumber2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_NEW_OWNER_DETAILS_GENDER_LABEL") + " * :"), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "gender",
    defaultValue: owner === null || owner === void 0 ? void 0 : owner.gender,
    rules: {
      required: t("REQUIRED_FIELD")
    },
    render: function render(props) {
      var _errors$gender;

      return /*#__PURE__*/React.createElement(Dropdown, {
        className: "form-field",
        selected: props.value,
        errorStyle: localFormState.touched.gender && errors !== null && errors !== void 0 && (_errors$gender = errors.gender) !== null && _errors$gender !== void 0 && _errors$gender.message ? true : false,
        select: function select(e) {
          var _owner$gender;

          if ((e === null || e === void 0 ? void 0 : e.code) != (owner === null || owner === void 0 ? void 0 : (_owner$gender = owner.gender) === null || _owner$gender === void 0 ? void 0 : _owner$gender.code) && isRenewal) setPreviousLicenseDetails(_extends({}, previousLicenseDetails, {
            checkForRenewal: true
          }));
          props.onChange(e);
        },
        onBlur: props.onBlur,
        option: genderTypeMenu,
        optionKey: "i18nKey",
        t: t
      });
    }
  })), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.gender ? errors === null || errors === void 0 ? void 0 : (_errors$gender2 = errors.gender) === null || _errors$gender2 === void 0 ? void 0 : _errors$gender2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_NEW_OWNER_DETAILS_EMAIL_LABEL") + " :"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "emailId",
    defaultValue: owner === null || owner === void 0 ? void 0 : owner.emailId,
    rules: {
      validate: function validate(e) {
        return e && getPattern("Email").test(e) || !e ? true : t("INVALID_EMAIL");
      }
    },
    render: function render(props) {
      var _errors$emailId;

      return /*#__PURE__*/React.createElement(TextInput, {
        value: props.value,
        autoFocus: focusIndex.index === (owner === null || owner === void 0 ? void 0 : owner.key) && focusIndex.type === "emailId",
        errorStyle: localFormState.touched.emailId && errors !== null && errors !== void 0 && (_errors$emailId = errors.emailId) !== null && _errors$emailId !== void 0 && _errors$emailId.message ? true : false,
        onChange: function onChange(e) {
          if (e.target.value != (owner === null || owner === void 0 ? void 0 : owner.emailId) && isRenewal) setPreviousLicenseDetails(_extends({}, previousLicenseDetails, {
            checkForRenewal: true
          }));
          props.onChange(e.target.value);
          setFocusIndex({
            index: owner.key,
            type: "emailId"
          });
        },
        labelStyle: {
          marginTop: "unset"
        },
        onBlur: props.onBlur,
        style: isMulitpleOwners ? {
          background: "#FAFAFA"
        } : ""
      });
    }
  }))), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.emailId ? errors === null || errors === void 0 ? void 0 : (_errors$emailId2 = errors.emailId) === null || _errors$emailId2 === void 0 ? void 0 : _errors$emailId2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_OWNER_SPECIAL_CATEGORY") + " :"), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "ownerType",
    defaultValue: owner === null || owner === void 0 ? void 0 : owner.ownerType,
    render: function render(props) {
      var _errors$ownerType;

      return /*#__PURE__*/React.createElement(Dropdown, {
        className: "form-field",
        selected: props.value,
        errorStyle: localFormState.touched.ownerType && errors !== null && errors !== void 0 && (_errors$ownerType = errors.ownerType) !== null && _errors$ownerType !== void 0 && _errors$ownerType.message ? true : false,
        select: function select(e) {
          var _owner$ownerType;

          if ((e === null || e === void 0 ? void 0 : e.code) != (owner === null || owner === void 0 ? void 0 : (_owner$ownerType = owner.ownerType) === null || _owner$ownerType === void 0 ? void 0 : _owner$ownerType.code) && isRenewal) setPreviousLicenseDetails(_extends({}, previousLicenseDetails, {
            checkForRenewal: true
          }));
          props.onChange(e);
        },
        onBlur: props.onBlur,
        option: ownerTypesMenu,
        optionKey: "i18nKey",
        t: t
      });
    }
  })), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.ownerType ? errors === null || errors === void 0 ? void 0 : (_errors$ownerType2 = errors.ownerType) === null || _errors$ownerType2 === void 0 ? void 0 : _errors$ownerType2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_NEW_OWNER_DETAILS_ADDR_LABEL") + " :"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "permanentAddress",
    defaultValue: owner === null || owner === void 0 ? void 0 : owner.permanentAddress,
    render: function render(props) {
      var _errors$permanentAddr;

      return /*#__PURE__*/React.createElement(TextInput, {
        value: props.value,
        autoFocus: focusIndex.index === (owner === null || owner === void 0 ? void 0 : owner.key) && focusIndex.type === "permanentAddress",
        errorStyle: localFormState.touched.permanentAddress && errors !== null && errors !== void 0 && (_errors$permanentAddr = errors.permanentAddress) !== null && _errors$permanentAddr !== void 0 && _errors$permanentAddr.message ? true : false,
        onChange: function onChange(e) {
          if (e.target.value != (owner === null || owner === void 0 ? void 0 : owner.permanentAddress) && isRenewal) setPreviousLicenseDetails(_extends({}, previousLicenseDetails, {
            checkForRenewal: true
          }));
          props.onChange(e.target.value);
          setFocusIndex({
            index: owner.key,
            type: "permanentAddress"
          });
        },
        onBlur: props.onBlur,
        style: isMulitpleOwners ? {
          background: "#FAFAFA"
        } : ""
      });
    }
  }))), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.permanentAddress ? errors === null || errors === void 0 ? void 0 : (_errors$permanentAddr2 = errors.permanentAddress) === null || _errors$permanentAddr2 === void 0 ? void 0 : _errors$permanentAddr2.message : ""))));
};

var defaultFinancialYear = function defaultFinancialYear() {
  var data = convertEpochToDate(Date.now());
  var splitData = data.split("-")[0];
  var year = splitData.slice(2, 4);
  var currentFinancialYear = Number(splitData) + "-" + (Number(year) + 1);
  return {
    code: currentFinancialYear,
    i18nKey: "FY" + currentFinancialYear,
    id: currentFinancialYear === null || currentFinancialYear === void 0 ? void 0 : currentFinancialYear.split('-')[0]
  };
};

var createTradeDetailsDetails = function createTradeDetailsDetails() {
  return {
    financialYear: defaultFinancialYear(),
    licenseType: "",
    structureType: "",
    structureSubType: "",
    commencementDate: "",
    gstNo: "",
    operationalArea: "",
    noOfEmployees: "",
    key: Date.now()
  };
};

var TLTradeDetailsEmployee = function TLTradeDetailsEmployee(_ref) {
  var _formData$tradedetils, _formData$tradedetils2;

  var config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData,
      setError = _ref.setError,
      formState = _ref.formState,
      clearErrors = _ref.clearErrors;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useLocation = useLocation(),
      pathname = _useLocation.pathname;

  var isEditScreen = pathname.includes("/modify-application/");

  var _useState = useState((formData === null || formData === void 0 ? void 0 : formData.tradedetils) || [createTradeDetailsDetails()]),
      tradedetils = _useState[0],
      setTradedetils = _useState[1];

  var _useState2 = useState((formData === null || formData === void 0 ? void 0 : formData.tradedetils1) || []),
      previousLicenseDetails = _useState2[0],
      setPreviousLicenseDetails = _useState2[1];

  var _useState3 = useState([]),
      structureSubTypeOptions = _useState3[0],
      setStructureSubTypeOptions = _useState3[1];

  var _useState4 = useState((formData === null || formData === void 0 ? void 0 : formData.owners) || [createTradeDetailsDetails()]),
      setOwners = _useState4[1];

  var _useState5 = useState({
    index: -1,
    type: ""
  }),
      focusIndex = _useState5[0],
      setFocusIndex = _useState5[1];

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState6 = useState(false),
      isErrors = _useState6[0],
      setIsErrors = _useState6[1];

  var _useState7 = useState([]),
      licenseTypeList = _useState7[0],
      setLicenseTypeList = _useState7[1];

  var _useState8 = useState([]),
      licenseTypeValue = _useState8[0],
      setLicenseTypeValue = _useState8[1];

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "StructureType"),
      menuLoading = _Digit$Hooks$tl$useTr.isLoading,
      _Digit$Hooks$tl$useTr2 = _Digit$Hooks$tl$useTr.data,
      Menu = _Digit$Hooks$tl$useTr2 === void 0 ? {} : _Digit$Hooks$tl$useTr2;

  var _Digit$Hooks$tl$useTr3 = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", ["FinancialYear"]),
      _Digit$Hooks$tl$useTr4 = _Digit$Hooks$tl$useTr3.data,
      FinaceMenu = _Digit$Hooks$tl$useTr4 === void 0 ? {} : _Digit$Hooks$tl$useTr4;

  var _Digit$Hooks$tl$useTr5 = Digit.Hooks.tl.useTradeLicenseBillingslab({
    tenantId: tenantId,
    filters: {}
  }),
      billingSlabData = _Digit$Hooks$tl$useTr5.data;

  var removeOwner = function removeOwner(owner) {
    setOwners(function (prev) {
      return prev.filter(function (o) {
        return o.key != owner.key;
      });
    });
  };

  useEffect(function () {
    var data = tradedetils.map(function (e) {
      return e;
    });
    onSelect(config === null || config === void 0 ? void 0 : config.key, data);
  }, [tradedetils]);
  useEffect(function () {
    onSelect("tradedetils1", previousLicenseDetails);
  }, [previousLicenseDetails]);
  useEffect(function () {
    setOwners([createTradeDetailsDetails()]);
  }, [formData === null || formData === void 0 ? void 0 : (_formData$tradedetils = formData.tradedetils) === null || _formData$tradedetils === void 0 ? void 0 : (_formData$tradedetils2 = _formData$tradedetils[0]) === null || _formData$tradedetils2 === void 0 ? void 0 : _formData$tradedetils2.key]);
  var commonProps = {
    focusIndex: focusIndex,
    allOwners: tradedetils,
    setFocusIndex: setFocusIndex,
    removeOwner: removeOwner,
    formData: formData,
    formState: formState,
    setOwners: setOwners,
    t: t,
    setError: setError,
    clearErrors: clearErrors,
    config: config,
    setTradedetils: setTradedetils,
    FinaceMenu: FinaceMenu,
    setStructureSubTypeOptions: setStructureSubTypeOptions,
    structureSubTypeOptions: structureSubTypeOptions,
    Menu: Menu,
    setIsErrors: setIsErrors,
    isErrors: isErrors,
    billingSlabData: billingSlabData,
    licenseTypeList: licenseTypeList,
    setLicenseTypeList: setLicenseTypeList,
    previousLicenseDetails: previousLicenseDetails,
    setPreviousLicenseDetails: setPreviousLicenseDetails,
    licenseTypeValue: licenseTypeValue,
    setLicenseTypeValue: setLicenseTypeValue,
    menuLoading: menuLoading
  };

  if (isEditScreen) {
    return /*#__PURE__*/React.createElement(React.Fragment, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, tradedetils.map(function (tradedetail, index) {
    return /*#__PURE__*/React.createElement(OwnerForm1, _extends({
      key: tradedetail.key,
      index: index,
      tradedetail: tradedetail
    }, commonProps));
  }));
};

var OwnerForm1 = function OwnerForm1(_props) {
  var _formData$ownershipCa2, _errors$financialYear2, _errors$tradeName2, _errors$structureType2, _errors$structureSubT2, _errors$commencementD, _errors$gstNo2, _errors$operationalAr2, _errors$noOfEmployees2;

  var tradedetail = _props.tradedetail,
      focusIndex = _props.focusIndex,
      setFocusIndex = _props.setFocusIndex,
      t = _props.t,
      formData = _props.formData,
      config = _props.config,
      setError = _props.setError,
      clearErrors = _props.clearErrors,
      formState = _props.formState,
      setTradedetils = _props.setTradedetils,
      FinaceMenu = _props.FinaceMenu,
      setStructureSubTypeOptions = _props.setStructureSubTypeOptions,
      structureSubTypeOptions = _props.structureSubTypeOptions,
      Menu = _props.Menu,
      setIsErrors = _props.setIsErrors,
      isErrors = _props.isErrors,
      billingSlabData = _props.billingSlabData,
      licenseTypeList = _props.licenseTypeList,
      setLicenseTypeList = _props.setLicenseTypeList,
      previousLicenseDetails = _props.previousLicenseDetails,
      setPreviousLicenseDetails = _props.setPreviousLicenseDetails,
      licenseTypeValue = _props.licenseTypeValue,
      setLicenseTypeValue = _props.setLicenseTypeValue,
      menuLoading = _props.menuLoading;

  var _useForm = useForm(),
      control = _useForm.control,
      localFormState = _useForm.formState,
      watch = _useForm.watch,
      setValue = _useForm.setValue,
      trigger = _useForm.trigger,
      getValues = _useForm.getValues;

  var formValue = watch();
  var errors = localFormState.errors;
  useEffect(function () {
    var _billingSlabData$bill;

    if (billingSlabData && billingSlabData !== null && billingSlabData !== void 0 && billingSlabData.billingSlab && (billingSlabData === null || billingSlabData === void 0 ? void 0 : (_billingSlabData$bill = billingSlabData.billingSlab) === null || _billingSlabData$bill === void 0 ? void 0 : _billingSlabData$bill.length) > 0) {
      var processedData = billingSlabData.billingSlab && billingSlabData.billingSlab.reduce(function (acc, item) {
        var accessory = {
          active: true
        };
        var tradeType = {
          active: true
        };

        if (item.accessoryCategory && item.tradeType === null) {
          accessory.code = item.accessoryCategory;
          accessory.uom = item.uom;
          accessory.rate = item.rate;
          item.rate && item.rate > 0 && acc.accessories.push(accessory);
        } else if (item.accessoryCategory === null && item.tradeType) {
          tradeType.code = item.tradeType;
          tradeType.uom = item.uom;
          tradeType.structureType = item.structureType;
          tradeType.licenseType = item.licenseType;
          tradeType.rate = item.rate;
          !isUndefined_1(item.rate) && item.rate !== null && acc.tradeTypeData.push(tradeType);
        }

        return acc;
      }, {
        accessories: [],
        tradeTypeData: []
      });
      var licenseTypes = getUniqueItemsFromArray(processedData.tradeTypeData, "licenseType");
      licenseTypes = licenseTypes.map(function (item) {
        return {
          code: item.licenseType,
          active: true
        };
      });

      if (licenseTypes && licenseTypes.length > 0) {
        licenseTypes.forEach(function (data) {
          data.i18nKey = "TRADELICENSE_LICENSETYPE_" + data.code;
        });
      }
      var _licenseTypeValue = [];

      if (licenseTypes && licenseTypes.length > 0) {
        licenseTypes.map(function (data) {
          if (data.code == "PERMANENT") _licenseTypeValue.push(data);
        });
      }

      setLicenseTypeValue(_licenseTypeValue[0]);
      setLicenseTypeList(licenseTypes);
    }
  }, [billingSlabData]);
  var financialYearOptions = [];
  FinaceMenu && FinaceMenu["egf-master"] && FinaceMenu["egf-master"].FinancialYear.map(function (data) {
    if (data.module == "TL") financialYearOptions.push({
      code: data.name,
      i18nKey: "FY" + data.name,
      id: data.name.split('-')[0]
    });
  });

  if (financialYearOptions && financialYearOptions.length > 0) {
    financialYearOptions.sort(function (a, b) {
      return Number(a.id) - Number(b.id);
    });
  }

  var structureTypeOptions = [];
  structureTypeOptions = Menu && Menu["common-masters"] && Menu["common-masters"].StructureType.map(function (e) {
    var code = e === null || e === void 0 ? void 0 : e.code.split('.')[0];
    return _extends({
      i18nKey: t("COMMON_MASTERS_STRUCTURETYPE_" + stringReplaceAll(code === null || code === void 0 ? void 0 : code.toUpperCase(), ".", "_")),
      label: code
    }, e);
  }) || [];
  var selectedStructureTypeOptions = [];

  if (structureTypeOptions && structureTypeOptions.length > 0) {
    var flags = [],
        l = structureTypeOptions.length,
        i;

    for (i = 0; i < l; i++) {
      var _structureTypeOptions, _structureTypeOptions2;

      if (flags[structureTypeOptions[i].label]) continue;
      flags[structureTypeOptions[i].label] = true;
      selectedStructureTypeOptions.push({
        code: structureTypeOptions[i].label,
        i18nKey: t("COMMON_MASTERS_STRUCTURETYPE_" + stringReplaceAll((_structureTypeOptions = structureTypeOptions[i]) === null || _structureTypeOptions === void 0 ? void 0 : (_structureTypeOptions2 = _structureTypeOptions.label) === null || _structureTypeOptions2 === void 0 ? void 0 : _structureTypeOptions2.toUpperCase(), ".", "_"))
      });
    }
  }

  var isRenewal = window.location.href.includes("renew-application-details");
  if (window.location.href.includes("edit-application-details")) isRenewal = true;
  useEffect(function () {
    var _structureTypeOptions3;

    if (isRenewal && ((_structureTypeOptions3 = structureTypeOptions) === null || _structureTypeOptions3 === void 0 ? void 0 : _structureTypeOptions3.length) > 0 && !menuLoading) {
      var _tradedetail$structur, _tradedetail$structur2;

      var selectedOption = tradedetail === null || tradedetail === void 0 ? void 0 : (_tradedetail$structur = tradedetail.structureType) === null || _tradedetail$structur === void 0 ? void 0 : (_tradedetail$structur2 = _tradedetail$structur.code) === null || _tradedetail$structur2 === void 0 ? void 0 : _tradedetail$structur2.split('.')[0];
      var structureSubTypeOption = [];
      structureTypeOptions.map(function (data) {
        var _data$code;

        if (selectedOption === (data === null || data === void 0 ? void 0 : (_data$code = data.code) === null || _data$code === void 0 ? void 0 : _data$code.split('.')[0])) {
          var _data$code2;

          structureSubTypeOption.push({
            code: data === null || data === void 0 ? void 0 : data.code,
            i18nKey: t("COMMON_MASTERS_STRUCTURETYPE_" + stringReplaceAll(data === null || data === void 0 ? void 0 : (_data$code2 = data.code) === null || _data$code2 === void 0 ? void 0 : _data$code2.toUpperCase(), ".", "_"))
          });
        }
      });
      setStructureSubTypeOptions(structureSubTypeOption);
    }
  }, [tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.structureType, !menuLoading]);
  var isIndividualTypeOwner = useMemo(function () {
    var _formData$ownershipCa;

    return formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa = formData.ownershipCategory) === null || _formData$ownershipCa === void 0 ? void 0 : _formData$ownershipCa.code.includes("INDIVIDUAL");
  }, [formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa2 = formData.ownershipCategory) === null || _formData$ownershipCa2 === void 0 ? void 0 : _formData$ownershipCa2.code]);
  useEffect(function () {
    trigger();
  }, []);
  useEffect(function () {
    var keys = Object.keys(formValue);
    var part = {};
    keys.forEach(function (key) {
      return part[key] = tradedetail[key];
    });
    var _ownerType = {};

    if (!lodash.isEqual(formValue, part)) {
      Object.keys(formValue).map(function (data) {
        if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
          setIsErrors(true);
        }
      });
      setTradedetils(function (prev) {
        return prev.map(function (o) {
          return o.key && o.key === tradedetail.key ? _extends({}, o, formValue, _ownerType) : _extends({}, o);
        });
      });
      trigger();
    }
  }, [formValue]);
  useEffect(function () {
    var _formState$errors$con;

    if (Object.keys(errors).length && !lodash.isEqual(((_formState$errors$con = formState.errors[config.key]) === null || _formState$errors$con === void 0 ? void 0 : _formState$errors$con.type) || {}, errors)) {
      setError(config.key, {
        type: errors
      });
    } else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [errors]);
  var errorStyle = {
    width: "70%",
    marginLeft: "30%",
    fontSize: "12px",
    marginTop: "-21px"
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_FINANCIAL_YEAR_LABEL") + " * :"), /*#__PURE__*/React.createElement(Controller, {
    name: "financialYear",
    rules: {
      required: t("REQUIRED_FIELD")
    },
    defaultValue: tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.financialYear,
    control: control,
    render: function render(props) {
      var _errors$financialYear;

      return /*#__PURE__*/React.createElement(Dropdown, {
        className: "form-field",
        selected: props.value,
        errorStyle: localFormState.touched.financialYear && errors !== null && errors !== void 0 && (_errors$financialYear = errors.financialYear) !== null && _errors$financialYear !== void 0 && _errors$financialYear.message ? true : false,
        option: financialYearOptions,
        select: props.onChange,
        optionKey: "i18nKey",
        onBlur: props.onBlur,
        disable: isRenewal,
        t: t
      });
    }
  })), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.financialYear ? errors === null || errors === void 0 ? void 0 : (_errors$financialYear2 = errors.financialYear) === null || _errors$financialYear2 === void 0 ? void 0 : _errors$financialYear2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_NEW_TRADE_DETAILS_LIC_TYPE_LABEL") + " * :"), /*#__PURE__*/React.createElement(Controller, {
    name: "licenseType",
    defaultValue: tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.licenseType,
    control: control,
    render: function render(props) {
      var _errors$licenseType;

      return /*#__PURE__*/React.createElement(Dropdown, {
        className: "form-field",
        selected: licenseTypeValue,
        disable: true,
        option: licenseTypeList,
        select: props.onChange,
        optionKey: "i18nKey",
        onBlur: props.onBlur,
        t: t,
        errorStyle: localFormState.touched.licenseType && errors !== null && errors !== void 0 && (_errors$licenseType = errors.licenseType) !== null && _errors$licenseType !== void 0 && _errors$licenseType.message ? true : false
      });
    }
  })), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_COMMON_TABLE_COL_TRD_NAME") + " * :"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "tradeName",
    defaultValue: tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.tradeName,
    rules: {
      required: t("REQUIRED_FIELD"),
      validate: {
        pattern: function pattern(val) {
          return /^[-@.\/#&+\w\s]*$/.test(val) ? true : t("INVALID_NAME");
        }
      }
    },
    render: function render(props) {
      var _errors$tradeName;

      return /*#__PURE__*/React.createElement(TextInput, {
        value: props.value,
        autoFocus: focusIndex.index === (tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.key) && focusIndex.type === "name",
        errorStyle: localFormState.touched.tradeName && errors !== null && errors !== void 0 && (_errors$tradeName = errors.tradeName) !== null && _errors$tradeName !== void 0 && _errors$tradeName.message ? true : false,
        onChange: function onChange(e) {
          props.onChange(e.target.value);
          setFocusIndex({
            index: tradedetail.key,
            type: "tradeName"
          });
        },
        onBlur: function onBlur(e) {
          setFocusIndex({
            index: -1
          });
          props.onBlur(e);
        },
        disable: isRenewal
      });
    }
  }))), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.tradeName ? errors === null || errors === void 0 ? void 0 : (_errors$tradeName2 = errors.tradeName) === null || _errors$tradeName2 === void 0 ? void 0 : _errors$tradeName2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_NEW_TRADE_DETAILS_STRUCT_TYPE_LABEL") + " * :"), /*#__PURE__*/React.createElement(Controller, {
    name: "structureType",
    rules: {
      required: t("REQUIRED_FIELD")
    },
    defaultValue: tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.structureType,
    control: control,
    render: function render(props) {
      var _errors$structureType;

      return /*#__PURE__*/React.createElement(Dropdown, {
        className: "form-field",
        selected: props.value,
        disable: isRenewal,
        option: selectedStructureTypeOptions,
        errorStyle: localFormState.touched.structureType && errors !== null && errors !== void 0 && (_errors$structureType = errors.structureType) !== null && _errors$structureType !== void 0 && _errors$structureType.message ? true : false,
        select: function select(e) {
          var _e$code;

          var selectedOption = e === null || e === void 0 ? void 0 : (_e$code = e.code) === null || _e$code === void 0 ? void 0 : _e$code.split('.')[0];
          var structureSubTypeOption = [];
          structureTypeOptions.map(function (data) {
            var _data$code3;

            if (selectedOption === (data === null || data === void 0 ? void 0 : (_data$code3 = data.code) === null || _data$code3 === void 0 ? void 0 : _data$code3.split('.')[0])) {
              var _data$code4;

              structureSubTypeOption.push({
                code: data === null || data === void 0 ? void 0 : data.code,
                i18nKey: t("COMMON_MASTERS_STRUCTURETYPE_" + stringReplaceAll(data === null || data === void 0 ? void 0 : (_data$code4 = data.code) === null || _data$code4 === void 0 ? void 0 : _data$code4.toUpperCase(), ".", "_"))
              });
            }
          });
          setValue("structureSubType", "");
          setStructureSubTypeOptions(structureSubTypeOption);
          props.onChange(e);
        },
        optionKey: "i18nKey",
        onBlur: props.onBlur,
        t: t
      });
    }
  })), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.structureType ? errors === null || errors === void 0 ? void 0 : (_errors$structureType2 = errors.structureType) === null || _errors$structureType2 === void 0 ? void 0 : _errors$structureType2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_LABEL") + " * :"), /*#__PURE__*/React.createElement(Controller, {
    name: "structureSubType",
    rules: {
      required: t("REQUIRED_FIELD")
    },
    defaultValue: tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.structureSubType,
    control: control,
    render: function render(props) {
      var _errors$structureSubT;

      return /*#__PURE__*/React.createElement(Dropdown, {
        className: "form-field",
        selected: getValues("structureSubType"),
        disable: false,
        option: structureSubTypeOptions,
        select: function select(e) {
          var _tradedetail$structur3;

          if ((e === null || e === void 0 ? void 0 : e.code) != (tradedetail === null || tradedetail === void 0 ? void 0 : (_tradedetail$structur3 = tradedetail.structureSubType) === null || _tradedetail$structur3 === void 0 ? void 0 : _tradedetail$structur3.code) && isRenewal) setPreviousLicenseDetails(_extends({}, previousLicenseDetails, {
            checkForRenewal: true
          }));
          props.onChange(e);
        },
        optionKey: "i18nKey",
        onBlur: props.onBlur,
        t: t,
        errorStyle: localFormState.touched.structureSubType && errors !== null && errors !== void 0 && (_errors$structureSubT = errors.structureSubType) !== null && _errors$structureSubT !== void 0 && _errors$structureSubT.message ? true : false
      });
    }
  })), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.structureSubType ? errors === null || errors === void 0 ? void 0 : (_errors$structureSubT2 = errors.structureSubType) === null || _errors$structureSubT2 === void 0 ? void 0 : _errors$structureSubT2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL") + " * :"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "commencementDate",
    rules: {
      required: t("REQUIRED_FIELD")
    },
    defaultValue: tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.commencementDate,
    control: control,
    render: function render(props) {
      return /*#__PURE__*/React.createElement(DatePicker, {
        date: props.value,
        name: "CommencementDate",
        onChange: props.onChange,
        disabled: isRenewal
      });
    }
  }))), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.commencementDate ? errors === null || errors === void 0 ? void 0 : (_errors$commencementD = errors.commencementDate) === null || _errors$commencementD === void 0 ? void 0 : _errors$commencementD.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_NEW_GST_NUMBER_LABEL") + " :"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "gstNo",
    defaultValue: tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.gstNo,
    rules: {
      validate: function validate(e) {
        return e && getPattern("GSTNo").test(e) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG");
      }
    },
    render: function render(props) {
      var _errors$gstNo;

      return /*#__PURE__*/React.createElement(TextInput, {
        value: props.value,
        autoFocus: focusIndex.index === (tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.key) && focusIndex.type === "gstNo",
        errorStyle: localFormState.touched.gstNo && errors !== null && errors !== void 0 && (_errors$gstNo = errors.gstNo) !== null && _errors$gstNo !== void 0 && _errors$gstNo.message ? true : false,
        onChange: function onChange(e) {
          props.onChange(e.target.value);
          setFocusIndex({
            index: tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.key,
            type: "gstNo"
          });
        },
        labelStyle: {
          marginTop: "unset"
        },
        onBlur: props.onBlur,
        disable: isRenewal
      });
    }
  }))), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.gstNo ? errors === null || errors === void 0 ? void 0 : (_errors$gstNo2 = errors.gstNo) === null || _errors$gstNo2 === void 0 ? void 0 : _errors$gstNo2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_NEW_OPERATIONAL_SQ_FT_AREA_LABEL") + " :"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "operationalArea",
    rules: {
      validate: function validate(e) {
        return e && getPattern("OperationalArea").test(e) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG");
      }
    },
    defaultValue: tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.operationalArea,
    control: control,
    render: function render(props) {
      var _errors$operationalAr;

      return /*#__PURE__*/React.createElement(TextInput, {
        onChange: function onChange(e) {
          props.onChange(e.target.value);
          setFocusIndex({
            index: tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.key,
            type: "operationalArea"
          });
        },
        value: props.value,
        autoFocus: focusIndex.index === (tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.key) && focusIndex.type === "operationalArea",
        errorStyle: localFormState.touched.operationalArea && errors !== null && errors !== void 0 && (_errors$operationalAr = errors.operationalArea) !== null && _errors$operationalAr !== void 0 && _errors$operationalAr.message ? true : false,
        onBlur: props.onBlur,
        disable: isRenewal
      });
    }
  }))), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.operationalArea ? errors === null || errors === void 0 ? void 0 : (_errors$operationalAr2 = errors.operationalArea) === null || _errors$operationalAr2 === void 0 ? void 0 : _errors$operationalAr2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_NEW_NUMBER_OF_EMPLOYEES_LABEL") + " :"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "noOfEmployees",
    rules: {
      validate: function validate(e) {
        return e && getPattern("NoOfEmp").test(e) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG");
      }
    },
    defaultValue: tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.noOfEmployees,
    control: control,
    render: function render(props) {
      var _errors$noOfEmployees;

      return /*#__PURE__*/React.createElement(TextInput, {
        onChange: function onChange(e) {
          props.onChange(e.target.value);
          setFocusIndex({
            index: tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.key,
            type: "noOfEmployees"
          });
        },
        value: props.value,
        autoFocus: focusIndex.index === (tradedetail === null || tradedetail === void 0 ? void 0 : tradedetail.key) && focusIndex.type === "noOfEmployees",
        errorStyle: localFormState.touched.noOfEmployees && errors !== null && errors !== void 0 && (_errors$noOfEmployees = errors.noOfEmployees) !== null && _errors$noOfEmployees !== void 0 && _errors$noOfEmployees.message ? true : false,
        onBlur: props.onBlur,
        disable: isRenewal
      });
    }
  }))), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.noOfEmployees ? errors === null || errors === void 0 ? void 0 : (_errors$noOfEmployees2 = errors.noOfEmployees) === null || _errors$noOfEmployees2 === void 0 ? void 0 : _errors$noOfEmployees2.message : ""))));
};

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

function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }

  return array;
}

var _arrayEach = arrayEach;

function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }

    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }

  return object;
}

var _copyObject = copyObject;

function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }

  return result;
}

var _baseTimes = baseTimes;

var argsTag = '[object Arguments]';

function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

var objectProto$6 = Object.prototype;
var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;
var isArguments = _baseIsArguments(function () {
  return arguments;
}()) ? _baseIsArguments : function (value) {
  return isObjectLike_1(value) && hasOwnProperty$5.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
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

var MAX_SAFE_INTEGER$1 = 9007199254740991;

function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var isLength_1 = isLength;

var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
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
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

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

function baseAssign(object, source) {
  return object && _copyObject(source, keys_1(source), object);
}

var _baseAssign = baseAssign;

function nativeKeysIn(object) {
  var result = [];

  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }

  return result;
}

var _nativeKeysIn = nativeKeysIn;

var objectProto$a = Object.prototype;
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }

  var isProto = _isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
      result.push(key);
    }
  }

  return result;
}

var _baseKeysIn = baseKeysIn;

function keysIn(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}

var keysIn_1 = keysIn;

function baseAssignIn(object, source) {
  return object && _copyObject(source, keysIn_1(source), object);
}

var _baseAssignIn = baseAssignIn;

var _cloneBuffer = createCommonjsModule(function (module, exports) {
  var freeExports =  exports && !exports.nodeType && exports;
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer = moduleExports ? _root.Buffer : undefined,
      allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }

    var length = buffer.length,
        result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }

  module.exports = cloneBuffer;
});

function copyArray(source, array) {
  var index = -1,
      length = source.length;
  array || (array = Array(length));

  while (++index < length) {
    array[index] = source[index];
  }

  return array;
}

var _copyArray = copyArray;

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

var objectProto$b = Object.prototype;
var propertyIsEnumerable$1 = objectProto$b.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols ? stubArray_1 : function (object) {
  if (object == null) {
    return [];
  }

  object = Object(object);
  return _arrayFilter(nativeGetSymbols(object), function (symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};
var _getSymbols = getSymbols;

function copySymbols(source, object) {
  return _copyObject(source, _getSymbols(source), object);
}

var _copySymbols = copySymbols;

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

var getPrototype = _overArg(Object.getPrototypeOf, Object);
var _getPrototype = getPrototype;

var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function (object) {
  var result = [];

  while (object) {
    _arrayPush(result, _getSymbols(object));
    object = _getPrototype(object);
  }

  return result;
};
var _getSymbolsIn = getSymbolsIn;

function copySymbolsIn(source, object) {
  return _copyObject(source, _getSymbolsIn(source), object);
}

var _copySymbolsIn = copySymbolsIn;

function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
}

var _baseGetAllKeys = baseGetAllKeys;

function getAllKeys(object) {
  return _baseGetAllKeys(object, keys_1, _getSymbols);
}

var _getAllKeys = getAllKeys;

function getAllKeysIn(object) {
  return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
}

var _getAllKeysIn = getAllKeysIn;

var DataView = _getNative(_root, 'DataView');
var _DataView = DataView;

var Promise$1 = _getNative(_root, 'Promise');
var _Promise = Promise$1;

var Set = _getNative(_root, 'Set');
var _Set = Set;

var WeakMap = _getNative(_root, 'WeakMap');
var _WeakMap = WeakMap;

var mapTag$1 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$1 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';
var dataViewTag$1 = '[object DataView]';
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);
var getTag = _baseGetTag;

if (_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$1 || _Map && getTag(new _Map()) != mapTag$1 || _Promise && getTag(_Promise.resolve()) != promiseTag || _Set && getTag(new _Set()) != setTag$1 || _WeakMap && getTag(new _WeakMap()) != weakMapTag$1) {
  getTag = function getTag(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$1;

        case mapCtorString:
          return mapTag$1;

        case promiseCtorString:
          return promiseTag;

        case setCtorString:
          return setTag$1;

        case weakMapCtorString:
          return weakMapTag$1;
      }
    }

    return result;
  };
}

var _getTag = getTag;

var objectProto$c = Object.prototype;
var hasOwnProperty$9 = objectProto$c.hasOwnProperty;

function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  if (length && typeof array[0] == 'string' && hasOwnProperty$9.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }

  return result;
}

var _initCloneArray = initCloneArray;

var Uint8Array = _root.Uint8Array;
var _Uint8Array = Uint8Array;

function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer;

function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

var _cloneDataView = cloneDataView;

var reFlags = /\w*$/;

function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

var _cloneRegExp = cloneRegExp;

var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

var _cloneSymbol = cloneSymbol;

function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray;

var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1 = '[object Symbol]';
var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';

function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;

  switch (tag) {
    case arrayBufferTag$1:
      return _cloneArrayBuffer(object);

    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);

    case dataViewTag$2:
      return _cloneDataView(object, isDeep);

    case float32Tag$1:
    case float64Tag$1:
    case int8Tag$1:
    case int16Tag$1:
    case int32Tag$1:
    case uint8Tag$1:
    case uint8ClampedTag$1:
    case uint16Tag$1:
    case uint32Tag$1:
      return _cloneTypedArray(object, isDeep);

    case mapTag$2:
      return new Ctor();

    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);

    case regexpTag$1:
      return _cloneRegExp(object);

    case setTag$2:
      return new Ctor();

    case symbolTag$1:
      return _cloneSymbol(object);
  }
}

var _initCloneByTag = initCloneByTag;

var objectCreate = Object.create;

var baseCreate = function () {
  function object() {}

  return function (proto) {
    if (!isObject_1(proto)) {
      return {};
    }

    if (objectCreate) {
      return objectCreate(proto);
    }

    object.prototype = proto;
    var result = new object();
    object.prototype = undefined;
    return result;
  };
}();

var _baseCreate = baseCreate;

function initCloneObject(object) {
  return typeof object.constructor == 'function' && !_isPrototype(object) ? _baseCreate(_getPrototype(object)) : {};
}

var _initCloneObject = initCloneObject;

var mapTag$3 = '[object Map]';

function baseIsMap(value) {
  return isObjectLike_1(value) && _getTag(value) == mapTag$3;
}

var _baseIsMap = baseIsMap;

var nodeIsMap = _nodeUtil && _nodeUtil.isMap;
var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;
var isMap_1 = isMap;

var setTag$3 = '[object Set]';

function baseIsSet(value) {
  return isObjectLike_1(value) && _getTag(value) == setTag$3;
}

var _baseIsSet = baseIsSet;

var nodeIsSet = _nodeUtil && _nodeUtil.isSet;
var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;
var isSet_1 = isSet;

var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;
var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$2 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    objectTag$2 = '[object Object]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$2 = '[object Symbol]',
    weakMapTag$2 = '[object WeakMap]';
var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';
var cloneableTags = {};
cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] = cloneableTags[boolTag$2] = cloneableTags[dateTag$2] = cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] = cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] = cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] = cloneableTags[numberTag$2] = cloneableTags[objectTag$2] = cloneableTags[regexpTag$2] = cloneableTags[setTag$4] = cloneableTags[stringTag$2] = cloneableTags[symbolTag$2] = cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] = cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag$2] = cloneableTags[weakMapTag$2] = false;

function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }

  if (result !== undefined) {
    return result;
  }

  if (!isObject_1(value)) {
    return value;
  }

  var isArr = isArray_1(value);

  if (isArr) {
    result = _initCloneArray(value);

    if (!isDeep) {
      return _copyArray(value, result);
    }
  } else {
    var tag = _getTag(value),
        isFunc = tag == funcTag$2 || tag == genTag$1;

    if (isBuffer_1(value)) {
      return _cloneBuffer(value, isDeep);
    }

    if (tag == objectTag$2 || tag == argsTag$2 || isFunc && !object) {
      result = isFlat || isFunc ? {} : _initCloneObject(value);

      if (!isDeep) {
        return isFlat ? _copySymbolsIn(value, _baseAssignIn(result, value)) : _copySymbols(value, _baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }

      result = _initCloneByTag(value, tag, isDeep);
    }
  }

  stack || (stack = new _Stack());
  var stacked = stack.get(value);

  if (stacked) {
    return stacked;
  }

  stack.set(value, result);

  if (isSet_1(value)) {
    value.forEach(function (subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap_1(value)) {
    value.forEach(function (subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull ? isFlat ? _getAllKeysIn : _getAllKeys : isFlat ? keysIn_1 : keys_1;
  var props = isArr ? undefined : keysFunc(value);
  _arrayEach(props || value, function (subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }

    _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

var _baseClone = baseClone;

var CLONE_DEEP_FLAG$1 = 1,
    CLONE_SYMBOLS_FLAG$1 = 4;

function cloneDeep(value) {
  return _baseClone(value, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$1);
}

var cloneDeep_1 = cloneDeep;

var createUnitDetails = function createUnitDetails() {
  return {
    tradeType: "",
    tradeSubType: "",
    tradeCategory: "",
    uom: "",
    uomValue: "",
    key: Date.now()
  };
};

var TLTradeUnitsEmployee = function TLTradeUnitsEmployee(_ref) {
  var config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData,
      setError = _ref.setError,
      formState = _ref.formState,
      clearErrors = _ref.clearErrors;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useLocation = useLocation(),
      pathname = _useLocation.pathname;

  var isEditScreen = pathname.includes("/modify-application/");

  var _useState = useState((formData === null || formData === void 0 ? void 0 : formData.tradeUnits) || [createUnitDetails()]),
      units = _useState[0],
      setUnits = _useState[1];

  var _useState2 = useState({
    index: -1,
    type: ""
  }),
      focusIndex = _useState2[0],
      setFocusIndex = _useState2[1];

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState3 = useState([]),
      tradeTypeMdmsData = _useState3[0],
      setTradeTypeMdmsData = _useState3[1];

  var _useState4 = useState([]),
      tradeCategoryValues = _useState4[0],
      setTradeCategoryValues = _useState4[1];

  var _useState5 = useState([]),
      tradeTypeOptionsList = _useState5[0],
      setTradeTypeOptionsList = _useState5[1];

  var _useState6 = useState([]),
      tradeSubTypeOptionsList = _useState6[0],
      setTradeSubTypeOptionsList = _useState6[1];

  var _useState7 = useState(false),
      isErrors = _useState7[0],
      setIsErrors = _useState7[1];

  var _useState8 = useState((formData === null || formData === void 0 ? void 0 : formData.tradedetils1) || []),
      previousLicenseDetails = _useState8[0],
      setPreviousLicenseDetails = _useState8[1];

  var isRenewal = window.location.href.includes("tl/renew-application-details");
  if (window.location.href.includes("tl/renew-application-details")) isRenewal = true;

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", "TradeUnits", "[?(@.type=='TL')]"),
      tradeMdmsData = _Digit$Hooks$tl$useTr.data,
      isLoading = _Digit$Hooks$tl$useTr.isLoading;

  var addNewUnits = function addNewUnits() {
    var newUnit = createUnitDetails();
    setUnits(function (prev) {
      return [].concat(prev, [newUnit]);
    });
  };

  var removeUnit = function removeUnit(unit) {
    setUnits(function (prev) {
      return prev.filter(function (o) {
        return o.key != unit.key;
      });
    });
  };

  useEffect(function () {
    var data = units.map(function (e) {
      return e;
    });
    onSelect(config === null || config === void 0 ? void 0 : config.key, data);
  }, [units]);
  useEffect(function () {
    onSelect("tradedetils1", previousLicenseDetails);
  }, [previousLicenseDetails]);
  var commonProps = {
    focusIndex: focusIndex,
    allUnits: units,
    setFocusIndex: setFocusIndex,
    removeUnit: removeUnit,
    formData: formData,
    formState: formState,
    setUnits: setUnits,
    t: t,
    setError: setError,
    clearErrors: clearErrors,
    config: config,
    tradeCategoryValues: tradeCategoryValues,
    tradeTypeOptionsList: tradeTypeOptionsList,
    setTradeTypeOptionsList: setTradeTypeOptionsList,
    tradeTypeMdmsData: tradeTypeMdmsData,
    tradeSubTypeOptionsList: tradeSubTypeOptionsList,
    setTradeSubTypeOptionsList: setTradeSubTypeOptionsList,
    setTradeTypeMdmsData: setTradeTypeMdmsData,
    setTradeCategoryValues: setTradeCategoryValues,
    tradeMdmsData: tradeMdmsData,
    isErrors: isErrors,
    setIsErrors: setIsErrors,
    previousLicenseDetails: previousLicenseDetails,
    setPreviousLicenseDetails: setPreviousLicenseDetails,
    isRenewal: isRenewal,
    isLoading: isLoading
  };

  if (isEditScreen) {
    return /*#__PURE__*/React.createElement(React.Fragment, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, units.map(function (unit, index) {
    return /*#__PURE__*/React.createElement(TradeUnitForm, _extends({
      key: unit.key,
      index: index,
      unit: unit
    }, commonProps));
  }), /*#__PURE__*/React.createElement(LinkButton, {
    label: t("TL_ADD_TRADE_UNIT"),
    onClick: addNewUnits,
    style: {
      color: "#F47738",
      width: "fit-content"
    }
  }));
};

var TradeUnitForm = function TradeUnitForm(_props) {
  var _formData$ownershipCa2, _formData$tradedetils4, _formData$tradedetils5, _formData$tradedetils6, _errors$tradeCategory2, _errors$tradeType2, _errors$tradeSubType2, _unit$tradeSubType, _unit$tradeSubType2, _errors$uom2, _unit$tradeSubType3, _unit$tradeSubType4, _errors$uomValue2;

  var unit = _props.unit,
      focusIndex = _props.focusIndex,
      allUnits = _props.allUnits,
      setFocusIndex = _props.setFocusIndex,
      removeUnit = _props.removeUnit,
      setUnits = _props.setUnits,
      t = _props.t,
      formData = _props.formData,
      config = _props.config,
      setError = _props.setError,
      clearErrors = _props.clearErrors,
      formState = _props.formState,
      tradeCategoryValues = _props.tradeCategoryValues,
      tradeTypeOptionsList = _props.tradeTypeOptionsList,
      setTradeTypeOptionsList = _props.setTradeTypeOptionsList,
      tradeTypeMdmsData = _props.tradeTypeMdmsData,
      tradeSubTypeOptionsList = _props.tradeSubTypeOptionsList,
      setTradeSubTypeOptionsList = _props.setTradeSubTypeOptionsList,
      setTradeTypeMdmsData = _props.setTradeTypeMdmsData,
      setTradeCategoryValues = _props.setTradeCategoryValues,
      tradeMdmsData = _props.tradeMdmsData,
      isErrors = _props.isErrors,
      setIsErrors = _props.setIsErrors,
      previousLicenseDetails = _props.previousLicenseDetails,
      setPreviousLicenseDetails = _props.setPreviousLicenseDetails,
      isRenewal = _props.isRenewal,
      isLoading = _props.isLoading;

  var _useForm = useForm(),
      control = _useForm.control,
      localFormState = _useForm.formState,
      watch = _useForm.watch,
      setValue = _useForm.setValue,
      trigger = _useForm.trigger,
      getValues = _useForm.getValues;

  var formValue = watch();
  var errors = localFormState.errors;
  var isIndividualTypeOwner = useMemo(function () {
    var _formData$ownershipCa;

    return formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa = formData.ownershipCategory) === null || _formData$ownershipCa === void 0 ? void 0 : _formData$ownershipCa.code.includes("INDIVIDUAL");
  }, [formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa2 = formData.ownershipCategory) === null || _formData$ownershipCa2 === void 0 ? void 0 : _formData$ownershipCa2.code]);
  useEffect(function () {
    var _tradeMdmsData$TradeL, _tradeMdmsData$TradeL2, _formData$tradedetils, _formData$tradedetils2, _formData$tradedetils3;

    if ((tradeMdmsData === null || tradeMdmsData === void 0 ? void 0 : (_tradeMdmsData$TradeL = tradeMdmsData.TradeLicense) === null || _tradeMdmsData$TradeL === void 0 ? void 0 : (_tradeMdmsData$TradeL2 = _tradeMdmsData$TradeL.TradeType) === null || _tradeMdmsData$TradeL2 === void 0 ? void 0 : _tradeMdmsData$TradeL2.length) > 0 && formData !== null && formData !== void 0 && (_formData$tradedetils = formData.tradedetils) !== null && _formData$tradedetils !== void 0 && (_formData$tradedetils2 = _formData$tradedetils["0"]) !== null && _formData$tradedetils2 !== void 0 && (_formData$tradedetils3 = _formData$tradedetils2.structureType) !== null && _formData$tradedetils3 !== void 0 && _formData$tradedetils3.code) {
      var _tradeMdmsData$TradeL3, _tradeMdmsData$TradeL4;

      setTradeTypeMdmsData(tradeMdmsData === null || tradeMdmsData === void 0 ? void 0 : (_tradeMdmsData$TradeL3 = tradeMdmsData.TradeLicense) === null || _tradeMdmsData$TradeL3 === void 0 ? void 0 : _tradeMdmsData$TradeL3.TradeType);
      var tradeType = cloneDeep_1(tradeMdmsData === null || tradeMdmsData === void 0 ? void 0 : (_tradeMdmsData$TradeL4 = tradeMdmsData.TradeLicense) === null || _tradeMdmsData$TradeL4 === void 0 ? void 0 : _tradeMdmsData$TradeL4.TradeType);
      var tradeCatogoryList = [];
      tradeType.map(function (data) {
        var _data$code, _data$code2;

        data.code = data === null || data === void 0 ? void 0 : (_data$code = data.code) === null || _data$code === void 0 ? void 0 : _data$code.split('.')[0];
        data.i18nKey = t("TRADELICENSE_TRADETYPE_" + (data === null || data === void 0 ? void 0 : (_data$code2 = data.code) === null || _data$code2 === void 0 ? void 0 : _data$code2.split('.')[0]));
        tradeCatogoryList.push(data);
      });
      var filterTradeCategoryList = getUniqueItemsFromArray(tradeCatogoryList, "code");
      setTradeCategoryValues(filterTradeCategoryList);
    }
  }, [formData === null || formData === void 0 ? void 0 : (_formData$tradedetils4 = formData.tradedetils) === null || _formData$tradedetils4 === void 0 ? void 0 : (_formData$tradedetils5 = _formData$tradedetils4[0]) === null || _formData$tradedetils5 === void 0 ? void 0 : (_formData$tradedetils6 = _formData$tradedetils5.structureType) === null || _formData$tradedetils6 === void 0 ? void 0 : _formData$tradedetils6.code, !isLoading, tradeMdmsData]);
  useEffect(function () {
    trigger();
  }, []);
  useEffect(function () {
    var keys = Object.keys(formValue);
    var part = {};
    keys.forEach(function (key) {
      return part[key] = unit[key];
    });

    var _ownerType = isIndividualTypeOwner ? {} : {
      ownerType: {
        code: "NONE"
      }
    };

    if (!lodash.isEqual(formValue, part)) {
      Object.keys(formValue).map(function (data) {
        if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
          setIsErrors(true);
        }
      });
      setUnits(function (prev) {
        return prev.map(function (o) {
          return o.key && o.key === unit.key ? _extends({}, o, formValue, _ownerType) : _extends({}, o);
        });
      });
      trigger();
    }
  }, [formValue]);
  useEffect(function () {
    var _formState$errors$con;

    if (Object.keys(errors).length && !lodash.isEqual(((_formState$errors$con = formState.errors[config.key]) === null || _formState$errors$con === void 0 ? void 0 : _formState$errors$con.type) || {}, errors)) {
      setError(config.key, {
        type: errors
      });
    } else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [errors]);
  var ckeckingLocation = window.location.href.includes("renew-application-details");
  if (window.location.href.includes("edit-application-details")) ckeckingLocation = true;
  useEffect(function () {
    if ((tradeTypeMdmsData === null || tradeTypeMdmsData === void 0 ? void 0 : tradeTypeMdmsData.length) > 0 && ckeckingLocation && !isLoading) {
      var tradeType = cloneDeep_1(tradeTypeMdmsData);
      var filteredTradeType = tradeType.filter(function (data) {
        var _data$code3, _unit$tradeCategory;

        return (data === null || data === void 0 ? void 0 : (_data$code3 = data.code) === null || _data$code3 === void 0 ? void 0 : _data$code3.split('.')[0]) === (unit === null || unit === void 0 ? void 0 : (_unit$tradeCategory = unit.tradeCategory) === null || _unit$tradeCategory === void 0 ? void 0 : _unit$tradeCategory.code);
      });
      var tradeTypeOptions = [];
      filteredTradeType.map(function (data) {
        var _data$code4, _data$code5, _data$code6;

        data.code = data === null || data === void 0 ? void 0 : (_data$code4 = data.code) === null || _data$code4 === void 0 ? void 0 : _data$code4.split('.')[1];
        data.code = data === null || data === void 0 ? void 0 : (_data$code5 = data.code) === null || _data$code5 === void 0 ? void 0 : _data$code5.split('.')[0];
        data.i18nKey = t("TRADELICENSE_TRADETYPE_" + (data === null || data === void 0 ? void 0 : (_data$code6 = data.code) === null || _data$code6 === void 0 ? void 0 : _data$code6.split('.')[0]));
        tradeTypeOptions.push(data);
      });
      var filterTradeCategoryList = getUniqueItemsFromArray(filteredTradeType, "code");
      setTradeTypeOptionsList(filterTradeCategoryList);
    }
  }, [tradeTypeMdmsData, !isLoading, tradeMdmsData]);
  useEffect(function () {
    if ((tradeTypeMdmsData === null || tradeTypeMdmsData === void 0 ? void 0 : tradeTypeMdmsData.length) > 0 && ckeckingLocation && !isLoading) {
      var tradeType = cloneDeep_1(tradeTypeMdmsData);
      var filteredTradeSubType = tradeType.filter(function (data) {
        var _data$code7, _unit$tradeType;

        return (data === null || data === void 0 ? void 0 : (_data$code7 = data.code) === null || _data$code7 === void 0 ? void 0 : _data$code7.split('.')[1]) === (unit === null || unit === void 0 ? void 0 : (_unit$tradeType = unit.tradeType) === null || _unit$tradeType === void 0 ? void 0 : _unit$tradeType.code);
      });
      var tradeSubTypeOptions = [];
      filteredTradeSubType.map(function (data) {
        var code = stringReplaceAll(data === null || data === void 0 ? void 0 : data.code, "-", "_");
        data.i18nKey = t("TRADELICENSE_TRADETYPE_" + stringReplaceAll(code, ".", "_"));
        tradeSubTypeOptions.push(data);
      });
      var filterTradeSubTypeList = getUniqueItemsFromArray(tradeSubTypeOptions, "code");
      setTradeSubTypeOptionsList(filterTradeSubTypeList);
    }
  }, [tradeTypeMdmsData, !isLoading, tradeMdmsData]);
  var errorStyle = {
    width: "70%",
    marginLeft: "30%",
    fontSize: "12px",
    marginTop: "-21px"
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid #D6D5D4",
      padding: "16px",
      marginTop: "8px",
      background: "#FAFAFA"
    }
  }, (allUnits === null || allUnits === void 0 ? void 0 : allUnits.length) > 1 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return removeUnit(unit);
    },
    style: {
      padding: "5px",
      cursor: "pointer",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("svg", {
    style: {
      float: "right",
      position: "relative",
      bottom: "5px"
    },
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z",
    fill: "#494848"
  }))))) : null, /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TRADELICENSE_TRADECATEGORY_LABEL") + " * :"), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "tradeCategory",
    defaultValue: unit === null || unit === void 0 ? void 0 : unit.tradeCategory,
    rules: {
      required: t("REQUIRED_FIELD")
    },
    render: function render(props) {
      var _errors$tradeCategory;

      return /*#__PURE__*/React.createElement(Dropdown, {
        className: "form-field",
        selected: props.value,
        disable: false,
        option: tradeCategoryValues,
        errorStyle: localFormState.touched.tradeCategory && errors !== null && errors !== void 0 && (_errors$tradeCategory = errors.tradeCategory) !== null && _errors$tradeCategory !== void 0 && _errors$tradeCategory.message ? true : false,
        select: function select(e) {
          var _props$value, _props$value2;

          if ((props === null || props === void 0 ? void 0 : (_props$value = props.value) === null || _props$value === void 0 ? void 0 : _props$value.code) == (e === null || e === void 0 ? void 0 : e.code)) return true;
          if ((e === null || e === void 0 ? void 0 : e.code) != (props === null || props === void 0 ? void 0 : (_props$value2 = props.value) === null || _props$value2 === void 0 ? void 0 : _props$value2.code) && isRenewal) setPreviousLicenseDetails(_extends({}, previousLicenseDetails, {
            checkForRenewal: true
          }));
          var selectedOption = e === null || e === void 0 ? void 0 : e.code;

          if ((tradeTypeMdmsData === null || tradeTypeMdmsData === void 0 ? void 0 : tradeTypeMdmsData.length) > 0) {
            var tradeType = cloneDeep_1(tradeTypeMdmsData);
            var filteredTradeType = tradeType.filter(function (data) {
              var _data$code8;

              return (data === null || data === void 0 ? void 0 : (_data$code8 = data.code) === null || _data$code8 === void 0 ? void 0 : _data$code8.split('.')[0]) === selectedOption;
            });
            var tradeTypeOptions = [];
            filteredTradeType.map(function (data) {
              var _data$code9, _data$code10, _data$code11;

              data.code = data === null || data === void 0 ? void 0 : (_data$code9 = data.code) === null || _data$code9 === void 0 ? void 0 : _data$code9.split('.')[1];
              data.code = data === null || data === void 0 ? void 0 : (_data$code10 = data.code) === null || _data$code10 === void 0 ? void 0 : _data$code10.split('.')[0];
              data.i18nKey = t("TRADELICENSE_TRADETYPE_" + (data === null || data === void 0 ? void 0 : (_data$code11 = data.code) === null || _data$code11 === void 0 ? void 0 : _data$code11.split('.')[0]));
              tradeTypeOptions.push(data);
            });
            var filterTradeCategoryList = getUniqueItemsFromArray(filteredTradeType, "code");
            setValue("tradeType", "");
            setValue("tradeSubType", "");
            setValue("uom", "");
            setValue("uomValue", "");
            setTradeTypeOptionsList(filterTradeCategoryList);
          }

          props.onChange(e);
        },
        optionKey: "i18nKey",
        onBlur: function onBlur(e) {
          setFocusIndex({
            index: -1
          });
          props.onBlur(e);
        },
        t: t
      });
    }
  })), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.tradeCategory ? errors === null || errors === void 0 ? void 0 : (_errors$tradeCategory2 = errors.tradeCategory) === null || _errors$tradeCategory2 === void 0 ? void 0 : _errors$tradeCategory2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TRADELICENSE_TRADETYPE_LABEL") + " * :"), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "tradeType",
    defaultValue: unit === null || unit === void 0 ? void 0 : unit.tradeType,
    rules: {
      required: t("REQUIRED_FIELD")
    },
    render: function render(props) {
      var _errors$tradeType;

      return /*#__PURE__*/React.createElement(Dropdown, {
        className: "form-field",
        selected: getValues("tradeType"),
        disable: false,
        option: unit !== null && unit !== void 0 && unit.tradeCategory ? tradeTypeOptionsList : [],
        errorStyle: localFormState.touched.tradeType && errors !== null && errors !== void 0 && (_errors$tradeType = errors.tradeType) !== null && _errors$tradeType !== void 0 && _errors$tradeType.message ? true : false,
        select: function select(e) {
          var _props$value3, _props$value4;

          if ((props === null || props === void 0 ? void 0 : (_props$value3 = props.value) === null || _props$value3 === void 0 ? void 0 : _props$value3.code) == (e === null || e === void 0 ? void 0 : e.code)) return true;
          if ((e === null || e === void 0 ? void 0 : e.code) != (props === null || props === void 0 ? void 0 : (_props$value4 = props.value) === null || _props$value4 === void 0 ? void 0 : _props$value4.code) && isRenewal) setPreviousLicenseDetails(_extends({}, previousLicenseDetails, {
            checkForRenewal: true
          }));
          var selectedOption = e === null || e === void 0 ? void 0 : e.code;

          if ((tradeTypeMdmsData === null || tradeTypeMdmsData === void 0 ? void 0 : tradeTypeMdmsData.length) > 0) {
            var tradeType = cloneDeep_1(tradeTypeMdmsData);
            var filteredTradeSubType = tradeType.filter(function (data) {
              var _data$code12;

              return (data === null || data === void 0 ? void 0 : (_data$code12 = data.code) === null || _data$code12 === void 0 ? void 0 : _data$code12.split('.')[1]) === selectedOption;
            });
            var tradeSubTypeOptions = [];
            filteredTradeSubType.map(function (data) {
              var code = stringReplaceAll(data === null || data === void 0 ? void 0 : data.code, "-", "_");
              data.i18nKey = t("TRADELICENSE_TRADETYPE_" + stringReplaceAll(code, ".", "_"));
              tradeSubTypeOptions.push(data);
            });
            var filterTradeSubTypeList = getUniqueItemsFromArray(tradeSubTypeOptions, "code");
            setValue("tradeSubType", "");
            setValue("uom", "");
            setValue("uomValue", "");
            setTradeSubTypeOptionsList(filterTradeSubTypeList);
          }

          props.onChange(e);
        },
        optionKey: "i18nKey",
        onBlur: props.onBlur,
        t: t
      });
    }
  })), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.tradeType ? errors === null || errors === void 0 ? void 0 : (_errors$tradeType2 = errors.tradeType) === null || _errors$tradeType2 === void 0 ? void 0 : _errors$tradeType2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_NEW_TRADE_SUB_TYPE_LABEL") + " * :"), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "tradeSubType",
    defaultValue: unit === null || unit === void 0 ? void 0 : unit.tradeSubType,
    rules: {
      required: t("REQUIRED_FIELD")
    },
    render: function render(props) {
      var _errors$tradeSubType;

      return /*#__PURE__*/React.createElement(Dropdown, {
        className: "form-field",
        selected: getValues("tradeSubType"),
        disable: false,
        option: unit !== null && unit !== void 0 && unit.tradeType ? sortDropdownNames(tradeSubTypeOptionsList, "i18nKey", t) : [],
        errorStyle: localFormState.touched.tradeSubType && errors !== null && errors !== void 0 && (_errors$tradeSubType = errors.tradeSubType) !== null && _errors$tradeSubType !== void 0 && _errors$tradeSubType.message ? true : false,
        select: function select(e) {
          var _props$value5, _props$value6;

          if ((props === null || props === void 0 ? void 0 : (_props$value5 = props.value) === null || _props$value5 === void 0 ? void 0 : _props$value5.code) == (e === null || e === void 0 ? void 0 : e.code)) return true;
          if ((e === null || e === void 0 ? void 0 : e.code) != (props === null || props === void 0 ? void 0 : (_props$value6 = props.value) === null || _props$value6 === void 0 ? void 0 : _props$value6.code) && isRenewal) setPreviousLicenseDetails(_extends({}, previousLicenseDetails, {
            checkForRenewal: true
          }));
          setValue("uom", e !== null && e !== void 0 && e.uom ? e === null || e === void 0 ? void 0 : e.uom : "");
          setValue("uomValue", "");
          props.onChange(e);
        },
        optionKey: "i18nKey",
        onBlur: props.onBlur,
        t: t
      });
    }
  })), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, " ", localFormState.touched.tradeSubType ? errors === null || errors === void 0 ? void 0 : (_errors$tradeSubType2 = errors.tradeSubType) === null || _errors$tradeSubType2 === void 0 ? void 0 : _errors$tradeSubType2.message : "", " "), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, unit !== null && unit !== void 0 && (_unit$tradeSubType = unit.tradeSubType) !== null && _unit$tradeSubType !== void 0 && _unit$tradeSubType.uom ? t("TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER") + " * :" : t("TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER") + ":"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "uom",
    defaultValue: unit === null || unit === void 0 ? void 0 : (_unit$tradeSubType2 = unit.tradeSubType) === null || _unit$tradeSubType2 === void 0 ? void 0 : _unit$tradeSubType2.uom,
    render: function render(props) {
      var _errors$uom;

      return /*#__PURE__*/React.createElement(TextInput, {
        value: getValues("uom"),
        autoFocus: focusIndex.index === (unit === null || unit === void 0 ? void 0 : unit.key) && focusIndex.type === "uom",
        errorStyle: localFormState.touched.uom && errors !== null && errors !== void 0 && (_errors$uom = errors.uom) !== null && _errors$uom !== void 0 && _errors$uom.message ? true : false,
        onChange: function onChange(e) {
          props.onChange(e);
          setFocusIndex({
            index: unit.key,
            type: "uom"
          });
        },
        disable: true,
        onBlur: props.onBlur,
        style: {
          background: "#FAFAFA"
        }
      });
    }
  }))), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.uom ? errors === null || errors === void 0 ? void 0 : (_errors$uom2 = errors.uom) === null || _errors$uom2 === void 0 ? void 0 : _errors$uom2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, unit !== null && unit !== void 0 && (_unit$tradeSubType3 = unit.tradeSubType) !== null && _unit$tradeSubType3 !== void 0 && _unit$tradeSubType3.uom ? t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL") + " * :" : t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL") + " :"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "uomValue",
    defaultValue: unit === null || unit === void 0 ? void 0 : unit.uomValue,
    rules: (unit === null || unit === void 0 ? void 0 : (_unit$tradeSubType4 = unit.tradeSubType) === null || _unit$tradeSubType4 === void 0 ? void 0 : _unit$tradeSubType4.uom) && {
      required: t("REQUIRED_FIELD"),
      validate: {
        pattern: function pattern(val) {
          return /^(0)*[1-9][0-9]{0,5}$/.test(val) ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG");
        }
      }
    },
    render: function render(props) {
      var _errors$uomValue, _unit$tradeSubType5;

      return /*#__PURE__*/React.createElement(TextInput, {
        value: getValues("uomValue"),
        autoFocus: focusIndex.index === (unit === null || unit === void 0 ? void 0 : unit.key) && focusIndex.type === "uomValue",
        errorStyle: localFormState.touched.uomValue && errors !== null && errors !== void 0 && (_errors$uomValue = errors.uomValue) !== null && _errors$uomValue !== void 0 && _errors$uomValue.message ? true : false,
        onChange: function onChange(e) {
          if (e.target.value != (unit === null || unit === void 0 ? void 0 : unit.uomValue) && isRenewal) setPreviousLicenseDetails(_extends({}, previousLicenseDetails, {
            checkForRenewal: true
          }));
          props.onChange(e);
          setFocusIndex({
            index: unit.key,
            type: "uomValue"
          });
        },
        disable: !(unit !== null && unit !== void 0 && (_unit$tradeSubType5 = unit.tradeSubType) !== null && _unit$tradeSubType5 !== void 0 && _unit$tradeSubType5.uom),
        onBlur: props.onBlur,
        style: {
          background: "#FAFAFA"
        }
      });
    }
  }))), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, " ", localFormState.touched.uomValue ? errors === null || errors === void 0 ? void 0 : (_errors$uomValue2 = errors.uomValue) === null || _errors$uomValue2 === void 0 ? void 0 : _errors$uomValue2.message : "", " "))));
};

var createAccessoriesDetails = function createAccessoriesDetails() {
  return {
    accessoryCategory: "",
    count: "",
    uom: "",
    uomValue: "",
    key: Date.now()
  };
};

var TLAccessoriesEmployee = function TLAccessoriesEmployee(_ref) {
  var _formData$accessories2, _formData$accessories3, _formData$accessories4;

  var config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData,
      setError = _ref.setError,
      formState = _ref.formState,
      clearErrors = _ref.clearErrors;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useLocation = useLocation(),
      pathname = _useLocation.pathname;

  var isEditScreen = pathname.includes("/modify-application/");

  var _useState = useState((formData === null || formData === void 0 ? void 0 : formData.accessories) || [createAccessoriesDetails()]),
      accessoriesList = _useState[0],
      setAccessoriesList = _useState[1];

  var _useState2 = useState({
    index: -1,
    type: ""
  }),
      focusIndex = _useState2[0],
      setFocusIndex = _useState2[1];

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useState3 = useState([]),
      accessories = _useState3[0],
      SetAccessories = _useState3[1];

  var _useState4 = useState(false),
      isErrors = _useState4[0],
      setIsErrors = _useState4[1];

  var _useState5 = useState(true);

  var _useState6 = useState(""),
      uomvalues = _useState6[0],
      setUomvalues = _useState6[1];

  var isRenewal = window.location.href.includes("renew-application-details");
  if (window.location.href.includes("edit-application-details")) isRenewal = true;

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseBillingslab({
    tenantId: tenantId,
    filters: {}
  }),
      billingSlabData = _Digit$Hooks$tl$useTr.data;

  var addAccessories = function addAccessories() {
    var newAccessor = createAccessoriesDetails();
    setAccessoriesList(function (prev) {
      return [].concat(prev, [newAccessor]);
    });
  };

  var removeAccessor = function removeAccessor(accessor) {
    setAccessoriesList(function (prev) {
      return prev.filter(function (o) {
        return o.key != accessor.key;
      });
    });
  };

  useEffect(function () {
    var data = accessoriesList.map(function (e) {
      return e;
    });
    onSelect(config === null || config === void 0 ? void 0 : config.key, data);
  }, [accessoriesList]);
  useEffect(function () {
    var _formData$accessories;

    if ((formData === null || formData === void 0 ? void 0 : (_formData$accessories = formData.accessories) === null || _formData$accessories === void 0 ? void 0 : _formData$accessories.length) > 0 && !isRenewal) {
      var _flag = true;
      accessoriesList.map(function (data) {
        Object.keys(data).map(function (dta) {
          if (dta != "key" && data[dta]) _flag = false;
        });
      });
      formData === null || formData === void 0 ? void 0 : formData.accessories.map(function (data) {
        Object.keys(data).map(function (dta) {
          if (dta != "key" && data[dta] != undefined && data[data] != "" && data[data] != null) ; else {
            formData.accessories[0].count = 1;
            if (_flag) setAccessoriesList(formData === null || formData === void 0 ? void 0 : formData.accessories);
            formData.accessories[0].count = "";
            setAccessoriesList(formData === null || formData === void 0 ? void 0 : formData.accessories);
            _flag = false;
          }
        });
      });
    }
  }, [formData === null || formData === void 0 ? void 0 : (_formData$accessories2 = formData.accessories) === null || _formData$accessories2 === void 0 ? void 0 : (_formData$accessories3 = _formData$accessories2[0]) === null || _formData$accessories3 === void 0 ? void 0 : (_formData$accessories4 = _formData$accessories3.accessoryCategory) === null || _formData$accessories4 === void 0 ? void 0 : _formData$accessories4.code]);
  var commonProps = {
    focusIndex: focusIndex,
    allAccessoriesList: accessoriesList,
    setFocusIndex: setFocusIndex,
    removeAccessor: removeAccessor,
    formData: formData,
    formState: formState,
    setAccessoriesList: setAccessoriesList,
    t: t,
    setError: setError,
    clearErrors: clearErrors,
    config: config,
    accessories: accessories,
    setIsErrors: setIsErrors,
    isErrors: isErrors,
    SetAccessories: SetAccessories,
    accessoriesList: accessoriesList,
    billingSlabData: billingSlabData,
    setUomvalues: setUomvalues,
    uomvalues: uomvalues,
    isRenewal: isRenewal
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, accessoriesList.map(function (accessor, index) {
    return /*#__PURE__*/React.createElement(AccessoriersForm, _extends({
      key: accessor.key,
      index: index,
      accessor: accessor
    }, commonProps));
  }), /*#__PURE__*/React.createElement(LinkButton, {
    label: "" + t("TL_NEW_TRADE_DETAILS_NEW_ACCESSORIES"),
    onClick: addAccessories,
    style: {
      color: "#F47738",
      width: "fit-content"
    }
  }));
};

var AccessoriersForm = function AccessoriersForm(_props) {
  var _formData$ownershipCa2, _accessor$accessoryCa, _accessor$accessoryCa4, _accessor$accessoryCa5, _accessor$accessoryCa6, _errors$uomValue2, _accessor$accessoryCa9, _accessor$accessoryCa10, _errors$count2;

  var accessor = _props.accessor,
      focusIndex = _props.focusIndex,
      allAccessoriesList = _props.allAccessoriesList,
      setFocusIndex = _props.setFocusIndex,
      removeAccessor = _props.removeAccessor,
      setAccessoriesList = _props.setAccessoriesList,
      t = _props.t,
      formData = _props.formData,
      config = _props.config,
      setError = _props.setError,
      clearErrors = _props.clearErrors,
      formState = _props.formState,
      accessories = _props.accessories,
      setIsErrors = _props.setIsErrors,
      isErrors = _props.isErrors,
      SetAccessories = _props.SetAccessories,
      billingSlabData = _props.billingSlabData,
      setUomvalues = _props.setUomvalues;

  var _useForm = useForm(),
      control = _useForm.control,
      localFormState = _useForm.formState,
      watch = _useForm.watch,
      setValue = _useForm.setValue,
      trigger = _useForm.trigger,
      getValues = _useForm.getValues;

  var formValue = watch();
  var errors = localFormState.errors;
  var isIndividualTypeOwner = useMemo(function () {
    var _formData$ownershipCa;

    return formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa = formData.ownershipCategory) === null || _formData$ownershipCa === void 0 ? void 0 : _formData$ownershipCa.code.includes("INDIVIDUAL");
  }, [formData === null || formData === void 0 ? void 0 : (_formData$ownershipCa2 = formData.ownershipCategory) === null || _formData$ownershipCa2 === void 0 ? void 0 : _formData$ownershipCa2.code]);
  useEffect(function () {
    trigger();
  }, []);
  useEffect(function () {
    trigger();
  }, [accessor === null || accessor === void 0 ? void 0 : (_accessor$accessoryCa = accessor.accessoryCategory) === null || _accessor$accessoryCa === void 0 ? void 0 : _accessor$accessoryCa.uom, formData === null || formData === void 0 ? void 0 : formData.accessories]);
  useEffect(function () {
    var _billingSlabData$bill;

    if (billingSlabData && billingSlabData !== null && billingSlabData !== void 0 && billingSlabData.billingSlab && (billingSlabData === null || billingSlabData === void 0 ? void 0 : (_billingSlabData$bill = billingSlabData.billingSlab) === null || _billingSlabData$bill === void 0 ? void 0 : _billingSlabData$bill.length) > 0) {
      var processedData = billingSlabData.billingSlab && billingSlabData.billingSlab.reduce(function (acc, item) {
        var accessory = {
          active: true
        };
        var tradeType = {
          active: true
        };

        if (item.accessoryCategory && item.tradeType === null) {
          accessory.code = item.accessoryCategory;
          accessory.uom = item.uom;
          accessory.rate = item.rate;
          item.rate && item.rate > 0 && acc.accessories.push(accessory);
        } else if (item.accessoryCategory === null && item.tradeType) {
          tradeType.code = item.tradeType;
          tradeType.uom = item.uom;
          tradeType.structureType = item.structureType;
          tradeType.licenseType = item.licenseType;
          tradeType.rate = item.rate;
          !isUndefined_1(item.rate) && item.rate !== null && acc.tradeTypeData.push(tradeType);
        }

        return acc;
      }, {
        accessories: [],
        tradeTypeData: []
      });

      var _accessories = getUniqueItemsFromArray(processedData.accessories, "code");

      var structureTypes = getUniqueItemsFromArray(processedData.tradeTypeData, "structureType");
      structureTypes = commonTransform({
        StructureType: structureTypes.map(function (item) {
          return {
            code: item.structureType,
            active: true
          };
        })
      }, "StructureType");
      var licenseTypes = getUniqueItemsFromArray(processedData.tradeTypeData, "licenseType");
      licenseTypes = licenseTypes.map(function (item) {
        return {
          code: item.licenseType,
          active: true
        };
      });

      _accessories.forEach(function (data) {
        var _data$code;

        data.i18nKey = t("TRADELICENSE_ACCESSORIESCATEGORY_" + stringReplaceAll(data === null || data === void 0 ? void 0 : (_data$code = data.code) === null || _data$code === void 0 ? void 0 : _data$code.toUpperCase(), "-", "_"));
      });

      SetAccessories(_accessories);
    }
  }, [billingSlabData]);
  useEffect(function () {
    var _formValue$accessoryC;

    var keys = Object.keys(formValue);

    if (!(formValue !== null && formValue !== void 0 && (_formValue$accessoryC = formValue.accessoryCategory) !== null && _formValue$accessoryC !== void 0 && _formValue$accessoryC.uom)) {
      formValue.uomValue = "";
    }

    var part = {};
    keys.forEach(function (key) {
      return part[key] = accessor[key];
    });

    var _ownerType = isIndividualTypeOwner ? {} : {
      ownerType: {
        code: "NONE"
      }
    };

    if (!lodash.isEqual(formValue, part)) {
      Object.keys(formValue).map(function (data) {
        if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
          setIsErrors(true);
        }
      });
      setAccessoriesList(function (prev) {
        return prev.map(function (o) {
          return o.key && o.key === accessor.key ? _extends({}, o, formValue, _ownerType) : _extends({}, o);
        });
      });
      trigger();
    }
  }, [formValue]);
  useEffect(function () {
    var _formState$errors$con;

    if (Object.keys(errors).length && !lodash.isEqual(((_formState$errors$con = formState.errors[config.key]) === null || _formState$errors$con === void 0 ? void 0 : _formState$errors$con.type) || {}, errors)) {
      setError(config.key, {
        type: errors
      });
    } else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [errors]);
  var errorStyle = {
    width: "70%",
    marginLeft: "30%",
    fontSize: "12px",
    marginTop: "-21px"
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid #D6D5D4",
      padding: "16px",
      marginTop: "8px",
      background: "#FAFAFA"
    }
  }, (allAccessoriesList === null || allAccessoriesList === void 0 ? void 0 : allAccessoriesList.length) > 1 ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return removeAccessor(accessor);
    },
    style: {
      padding: "5px",
      cursor: "pointer",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("svg", {
    style: {
      float: "right",
      position: "relative",
      bottom: "5px"
    },
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z",
    fill: "#494848"
  }))))) : null, /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, t("TL_NEW_TRADE_DETAILS_ACC_LABEL") + " :"), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "accessoryCategory",
    defaultValue: accessor === null || accessor === void 0 ? void 0 : accessor.accessoryCategory,
    render: function render(props) {
      return /*#__PURE__*/React.createElement(Dropdown, {
        className: "form-field",
        selected: props.value,
        select: function select(e) {
          var _accessor$accessoryCa2, _accessor$accessoryCa3;

          setValue("uom", e !== null && e !== void 0 && e.uom ? e === null || e === void 0 ? void 0 : e.uom : "");
          if ((e === null || e === void 0 ? void 0 : e.uom) !== (accessor === null || accessor === void 0 ? void 0 : (_accessor$accessoryCa2 = accessor.accessoryCategory) === null || _accessor$accessoryCa2 === void 0 ? void 0 : _accessor$accessoryCa2.uom)) setValue("uomValue", "");
          props.onChange(e);
          setUomvalues(accessor === null || accessor === void 0 ? void 0 : (_accessor$accessoryCa3 = accessor.accessoryCategory) === null || _accessor$accessoryCa3 === void 0 ? void 0 : _accessor$accessoryCa3.uom);
        },
        onBlur: props.onBlur,
        option: sortDropdownNames(accessories, "i18nKey", t) || [],
        optionKey: "i18nKey",
        t: t
      });
    }
  })), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, getValues("uom") ? t("TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER") + " * :" : t("TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER") + " :"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "uom",
    defaultValue: accessor === null || accessor === void 0 ? void 0 : (_accessor$accessoryCa4 = accessor.accessoryCategory) === null || _accessor$accessoryCa4 === void 0 ? void 0 : _accessor$accessoryCa4.uom,
    render: function render(props) {
      return /*#__PURE__*/React.createElement(TextInput, {
        value: getValues("uom"),
        autoFocus: focusIndex.index === (accessor === null || accessor === void 0 ? void 0 : accessor.key) && focusIndex.type === "uom",
        onChange: function onChange(e) {
          props.onChange(e.target.value);
          setFocusIndex({
            index: accessor.key,
            type: "uom"
          });
        },
        disable: true,
        onBlur: props.onBlur,
        style: {
          background: "#FAFAFA"
        }
      });
    }
  }))), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, accessor !== null && accessor !== void 0 && (_accessor$accessoryCa5 = accessor.accessoryCategory) !== null && _accessor$accessoryCa5 !== void 0 && _accessor$accessoryCa5.uom ? t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL") + " * : " : t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL") + " : "), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "uomValue",
    defaultValue: accessor === null || accessor === void 0 ? void 0 : accessor.uomValue,
    rules: (accessor === null || accessor === void 0 ? void 0 : (_accessor$accessoryCa6 = accessor.accessoryCategory) === null || _accessor$accessoryCa6 === void 0 ? void 0 : _accessor$accessoryCa6.uom) && {
      required: t("REQUIRED_FIELD"),
      validate: function validate(e) {
        return e && getPattern("UOMValue").test(e) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG");
      }
    },
    render: function render(props) {
      var _errors$uomValue, _accessor$accessoryCa7, _accessor$accessoryCa8;

      return /*#__PURE__*/React.createElement(TextInput, {
        value: getValues("uomValue"),
        autoFocus: focusIndex.index === (accessor === null || accessor === void 0 ? void 0 : accessor.key) && focusIndex.type === "uomValue",
        errorStyle: localFormState.touched.uomValue && errors !== null && errors !== void 0 && (_errors$uomValue = errors.uomValue) !== null && _errors$uomValue !== void 0 && _errors$uomValue.message ? true : false,
        onChange: function onChange(e) {
          props.onChange(e.target.value);
          setFocusIndex({
            index: accessor.key,
            type: "uomValue"
          });
        },
        disable: getValues("uomValue") ? !(accessor !== null && accessor !== void 0 && (_accessor$accessoryCa7 = accessor.accessoryCategory) !== null && _accessor$accessoryCa7 !== void 0 && _accessor$accessoryCa7.uom) || (accessor === null || accessor === void 0 ? void 0 : accessor.id) : !(accessor !== null && accessor !== void 0 && (_accessor$accessoryCa8 = accessor.accessoryCategory) !== null && _accessor$accessoryCa8 !== void 0 && _accessor$accessoryCa8.uom),
        onBlur: props.onBlur,
        style: {
          background: "#FAFAFA"
        }
      });
    }
  }))), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.uomValue ? errors === null || errors === void 0 ? void 0 : (_errors$uomValue2 = errors.uomValue) === null || _errors$uomValue2 === void 0 ? void 0 : _errors$uomValue2.message : ""), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, accessor !== null && accessor !== void 0 && (_accessor$accessoryCa9 = accessor.accessoryCategory) !== null && _accessor$accessoryCa9 !== void 0 && _accessor$accessoryCa9.code ? t("TL_ACCESSORY_COUNT_LABEL") + " * :" : t("TL_ACCESSORY_COUNT_LABEL") + " : "), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "count",
    defaultValue: accessor === null || accessor === void 0 ? void 0 : accessor.count,
    rules: (accessor === null || accessor === void 0 ? void 0 : (_accessor$accessoryCa10 = accessor.accessoryCategory) === null || _accessor$accessoryCa10 === void 0 ? void 0 : _accessor$accessoryCa10.code) && {
      required: t("REQUIRED_FIELD"),
      validate: function validate(e) {
        return e && getPattern("NoOfEmp").test(e) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG");
      }
    },
    render: function render(props) {
      var _errors$count;

      return /*#__PURE__*/React.createElement(TextInput, {
        value: props.value,
        autoFocus: focusIndex.index === (accessor === null || accessor === void 0 ? void 0 : accessor.key) && focusIndex.type === "count",
        errorStyle: localFormState.touched.count && errors !== null && errors !== void 0 && (_errors$count = errors.count) !== null && _errors$count !== void 0 && _errors$count.message ? true : false,
        onChange: function onChange(e) {
          props.onChange(e.target.value);
          setFocusIndex({
            index: accessor.key,
            type: "count"
          });
        },
        onBlur: props.onBlur,
        disable: accessor === null || accessor === void 0 ? void 0 : accessor.id,
        style: {
          background: "#FAFAFA"
        }
      });
    }
  }))), /*#__PURE__*/React.createElement(CardLabelError, {
    style: errorStyle
  }, localFormState.touched.count ? errors === null || errors === void 0 ? void 0 : (_errors$count2 = errors.count) === null || _errors$count2 === void 0 ? void 0 : _errors$count2.message : ""))));
};

var TLDocumentsEmployee = function TLDocumentsEmployee(_ref) {
  var _formData$documents, _documentsData$TradeL, _tlDocuments$;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData,
      setFormError = _ref.setError,
      clearFormErrors = _ref.clearErrors,
      formState = _ref.formState;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState = useState((formData === null || formData === void 0 ? void 0 : (_formData$documents = formData.documents) === null || _formData$documents === void 0 ? void 0 : _formData$documents.documents) || []),
      documents = _useState[0],
      setDocuments = _useState[1];

  var _useState2 = useState(null),
      error = _useState2[0],
      setError = _useState2[1];

  var _useState3 = useState((formData === null || formData === void 0 ? void 0 : formData.tradedetils1) || []),
      previousLicenseDetails = _useState3[0];

  var action = "create";

  var _useLocation = useLocation(),
      pathname = _useLocation.pathname;

  var isEditScreen = pathname.includes("/modify-application/");
  if (isEditScreen) action = "update";

  var _Digit$Hooks$pt$usePr = Digit.Hooks.pt.usePropertyMDMS(stateId, "TradeLicense", ["documentObj"]),
      isLoading = _Digit$Hooks$pt$usePr.isLoading,
      documentsData = _Digit$Hooks$pt$usePr.data;

  var ckeckingLocation = window.location.href.includes("renew-application-details");
  var tlDocuments = documentsData === null || documentsData === void 0 ? void 0 : (_documentsData$TradeL = documentsData.TradeLicense) === null || _documentsData$TradeL === void 0 ? void 0 : _documentsData$TradeL.documentObj;
  var tlDocumentsList = tlDocuments === null || tlDocuments === void 0 ? void 0 : (_tlDocuments$ = tlDocuments["0"]) === null || _tlDocuments$ === void 0 ? void 0 : _tlDocuments$.allowedDocs;
  var finalTlDocumentsList = [];

  if (tlDocumentsList && tlDocumentsList.length > 0) {
    tlDocumentsList.map(function (data) {
      var _data$applicationType, _data$applicationType2;

      if ((!ckeckingLocation || (previousLicenseDetails === null || previousLicenseDetails === void 0 ? void 0 : previousLicenseDetails.action) == "SENDBACKTOCITIZEN") && data !== null && data !== void 0 && (_data$applicationType = data.applicationType) !== null && _data$applicationType !== void 0 && _data$applicationType.includes("NEW")) {
        finalTlDocumentsList.push(data);
      } else if (ckeckingLocation && (previousLicenseDetails === null || previousLicenseDetails === void 0 ? void 0 : previousLicenseDetails.action) != "SENDBACKTOCITIZEN" && data !== null && data !== void 0 && (_data$applicationType2 = data.applicationType) !== null && _data$applicationType2 !== void 0 && _data$applicationType2.includes("RENEWAL")) {
        finalTlDocumentsList.push(data);
      }
    });
  }

  var goNext = function goNext() {
    onSelect(config.key, {
      documents: documents
    });
  };

  useEffect(function () {
    goNext();
  }, [documents]);

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement("div", null, finalTlDocumentsList === null || finalTlDocumentsList === void 0 ? void 0 : finalTlDocumentsList.map(function (document, index) {
    return /*#__PURE__*/React.createElement(SelectDocument, {
      key: index,
      document: document,
      action: action,
      t: t,
      error: error,
      setError: setError,
      setDocuments: setDocuments,
      documents: documents,
      formData: formData,
      setFormError: setFormError,
      clearFormErrors: clearFormErrors,
      config: config,
      formState: formState
    });
  }), error && /*#__PURE__*/React.createElement(Toast, {
    label: error,
    onClose: function onClose() {
      return setError(null);
    },
    error: true
  }));
};

function SelectDocument(_ref2) {
  var t = _ref2.t,
      doc = _ref2.document,
      setDocuments = _ref2.setDocuments,
      setError = _ref2.setError,
      documents = _ref2.documents,
      formData = _ref2.formData,
      setFormError = _ref2.setFormError,
      clearFormErrors = _ref2.clearFormErrors,
      config = _ref2.config,
      formState = _ref2.formState;
  var filteredDocument = documents === null || documents === void 0 ? void 0 : documents.filter(function (item) {
    return item === null || item === void 0 ? void 0 : item.documentType;
  });
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useState4 = useState(""),
      selectedDocument = _useState4[0],
      setSelectedDocument = _useState4[1];

  var _useState5 = useState(null),
      file = _useState5[0],
      setFile = _useState5[1];

  var _useState6 = useState(function () {
    return (filteredDocument === null || filteredDocument === void 0 ? void 0 : filteredDocument.fileStoreId) || null;
  }),
      uploadedFile = _useState6[0],
      setUploadedFile = _useState6[1];

  function selectfile(e, key) {
    e.target.files[0].documentType = key;
    setSelectedDocument({
      documentType: key
    });
    setFile(e.target.files[0]);
  }

  var _useState7 = useState(false),
      isHidden = _useState7[0];

  var addError = function addError() {
    var _formState$errors, _formState$errors$con;

    var type = (_formState$errors = formState.errors) === null || _formState$errors === void 0 ? void 0 : (_formState$errors$con = _formState$errors[config.key]) === null || _formState$errors$con === void 0 ? void 0 : _formState$errors$con.type;
    if (!Array.isArray(type)) type = [];

    if (!type.includes(doc.documentType)) {
      type.push(doc.documentType);
      setFormError(config.key, {
        type: type
      });
    }
  };

  var removeError = function removeError() {
    var _formState$errors2, _formState$errors2$co;

    var type = (_formState$errors2 = formState.errors) === null || _formState$errors2 === void 0 ? void 0 : (_formState$errors2$co = _formState$errors2[config.key]) === null || _formState$errors2$co === void 0 ? void 0 : _formState$errors2$co.type;
    if (!Array.isArray(type)) type = [];

    if (type.includes(doc === null || doc === void 0 ? void 0 : doc.documentType)) {
      type = type.filter(function (e) {
        return e != (doc === null || doc === void 0 ? void 0 : doc.documentType);
      });

      if (!type.length) {
        clearFormErrors(config.key);
      } else {
        setFormError(config.key, {
          type: type
        });
      }
    }
  };

  useEffect(function () {
    if (selectedDocument !== null && selectedDocument !== void 0 && selectedDocument.documentType) {
      setDocuments(function (prev) {
        var filteredDocumentsByDocumentType = prev === null || prev === void 0 ? void 0 : prev.filter(function (item) {
          return (item === null || item === void 0 ? void 0 : item.documentType) !== (selectedDocument === null || selectedDocument === void 0 ? void 0 : selectedDocument.documentType);
        });

        if ((uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.length) === 0 || uploadedFile === null) {
          return filteredDocumentsByDocumentType;
        }

        var filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType === null || filteredDocumentsByDocumentType === void 0 ? void 0 : filteredDocumentsByDocumentType.filter(function (item) {
          return (item === null || item === void 0 ? void 0 : item.fileStoreId) !== uploadedFile;
        });

        if (selectedDocument !== null && selectedDocument !== void 0 && selectedDocument.id) {
          return [].concat(filteredDocumentsByFileStoreId, [{
            documentType: selectedDocument === null || selectedDocument === void 0 ? void 0 : selectedDocument.documentType,
            fileStoreId: uploadedFile,
            tenantId: tenantId,
            id: selectedDocument === null || selectedDocument === void 0 ? void 0 : selectedDocument.id
          }]);
        } else {
          return [].concat(filteredDocumentsByFileStoreId, [{
            documentType: selectedDocument === null || selectedDocument === void 0 ? void 0 : selectedDocument.documentType,
            fileStoreId: uploadedFile,
            tenantId: tenantId
          }]);
        }
      });
    }

    if (!isHidden) {
      var isRenewal = window.location.href.includes("renew-application-details");

      if (!isRenewal) {
        if (!uploadedFile || !(selectedDocument !== null && selectedDocument !== void 0 && selectedDocument.documentType)) {
          addError();
        } else if (uploadedFile && selectedDocument !== null && selectedDocument !== void 0 && selectedDocument.documentType) {
          removeError();
        }
      }
    } else if (isHidden) {
      removeError();
    }
  }, [uploadedFile, selectedDocument, isHidden]);
  useEffect(function () {
    (function () {
      try {
        setError(null);

        var _temp4 = function () {
          if (file) {
            var _temp5 = function () {
              if (file.size >= 5242880) {
                setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
              } else {
                var _temp6 = _catch(function () {
                  setUploadedFile(null);
                  return Promise.resolve(Digit.UploadServices.Filestorage("TL", file, tenantId === null || tenantId === void 0 ? void 0 : tenantId.split(".")[0])).then(function (response) {
                    var _response$data, _response$data$files;

                    if ((response === null || response === void 0 ? void 0 : (_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$files = _response$data.files) === null || _response$data$files === void 0 ? void 0 : _response$data$files.length) > 0) {
                      var _response$data2, _response$data2$files;

                      setUploadedFile(response === null || response === void 0 ? void 0 : (_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : (_response$data2$files = _response$data2.files[0]) === null || _response$data2$files === void 0 ? void 0 : _response$data2$files.fileStoreId);
                    } else {
                      setError(t("CS_FILE_UPLOAD_ERROR"));
                    }
                  });
                }, function (err) {
                  console.error("Modal -> err ", err);
                  setError(t("CS_FILE_UPLOAD_ERROR"));
                });

                if (_temp6 && _temp6.then) return _temp6.then(function () {});
              }
            }();

            if (_temp5 && _temp5.then) return _temp5.then(function () {});
          }
        }();

        return _temp4 && _temp4.then ? _temp4.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [file]);
  useEffect(function () {
    var _formData$documents2, _formData$documents2$;

    if (doc && (formData === null || formData === void 0 ? void 0 : (_formData$documents2 = formData.documents) === null || _formData$documents2 === void 0 ? void 0 : (_formData$documents2$ = _formData$documents2.documents) === null || _formData$documents2$ === void 0 ? void 0 : _formData$documents2$.length) > 0) {
      for (var i = 0; i < (formData === null || formData === void 0 ? void 0 : (_formData$documents3 = formData.documents) === null || _formData$documents3 === void 0 ? void 0 : (_formData$documents3$ = _formData$documents3.documents) === null || _formData$documents3$ === void 0 ? void 0 : _formData$documents3$.length); i++) {
        var _formData$documents3, _formData$documents3$, _formData$documents4, _formData$documents4$, _formData$documents4$2;

        if ((doc === null || doc === void 0 ? void 0 : doc.documentType) === (formData === null || formData === void 0 ? void 0 : (_formData$documents4 = formData.documents) === null || _formData$documents4 === void 0 ? void 0 : (_formData$documents4$ = _formData$documents4.documents) === null || _formData$documents4$ === void 0 ? void 0 : (_formData$documents4$2 = _formData$documents4$[i]) === null || _formData$documents4$2 === void 0 ? void 0 : _formData$documents4$2.documentType)) {
          var _formData$documents5, _formData$documents5$, _formData$documents5$2, _formData$documents6, _formData$documents6$, _formData$documents6$2, _formData$documents7, _formData$documents7$, _formData$documents7$2;

          setSelectedDocument({
            documentType: formData === null || formData === void 0 ? void 0 : (_formData$documents5 = formData.documents) === null || _formData$documents5 === void 0 ? void 0 : (_formData$documents5$ = _formData$documents5.documents) === null || _formData$documents5$ === void 0 ? void 0 : (_formData$documents5$2 = _formData$documents5$[i]) === null || _formData$documents5$2 === void 0 ? void 0 : _formData$documents5$2.documentType,
            id: formData === null || formData === void 0 ? void 0 : (_formData$documents6 = formData.documents) === null || _formData$documents6 === void 0 ? void 0 : (_formData$documents6$ = _formData$documents6.documents) === null || _formData$documents6$ === void 0 ? void 0 : (_formData$documents6$2 = _formData$documents6$[i]) === null || _formData$documents6$2 === void 0 ? void 0 : _formData$documents6$2.id
          });
          setUploadedFile(formData === null || formData === void 0 ? void 0 : (_formData$documents7 = formData.documents) === null || _formData$documents7 === void 0 ? void 0 : (_formData$documents7$ = _formData$documents7.documents) === null || _formData$documents7$ === void 0 ? void 0 : (_formData$documents7$2 = _formData$documents7$[i]) === null || _formData$documents7$2 === void 0 ? void 0 : _formData$documents7$2.fileStoreId);
        }
      }
    }
  }, [doc]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "24px"
    }
  }, /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller"
  }, (doc === null || doc === void 0 ? void 0 : doc.documentType) != "OLDLICENCENO" ? t("TL_NEW_" + (doc === null || doc === void 0 ? void 0 : doc.documentType.replaceAll(".", "_"))) + " * :" : t("TL_NEW_" + (doc === null || doc === void 0 ? void 0 : doc.documentType.replaceAll(".", "_"))) + " :"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(UploadFile, {
    onUpload: function onUpload(e) {
      selectfile(e, doc === null || doc === void 0 ? void 0 : doc.documentType.replaceAll(".", "_"));
    },
    onDelete: function onDelete() {
      setUploadedFile(null);
    },
    message: uploadedFile ? "1 " + t("CS_ACTION_FILEUPLOADED") : t("CS_ACTION_NO_FILEUPLOADED"),
    textStyles: {
      width: "100%"
    },
    inputStyles: {
      width: "280px"
    },
    buttonType: "button",
    accept: (doc === null || doc === void 0 ? void 0 : doc.documentType) === "OWNERPHOTO" ? "image/*,.jpg,.png" : "image/*,.jpg,.png,.pdf"
  }))));
}

var TLCard = function TLCard() {
  sessionStorage.setItem("breadCrumbUrl", "home");

  if (!Digit.Utils.tlAccess()) {
    return null;
  }

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var inboxSearchParams = {
    limit: 10,
    offset: 0
  };

  var _Digit$Hooks$tl$useIn = Digit.Hooks.tl.useInbox({
    tenantId: tenantId,
    filters: _extends({}, inboxSearchParams),
    config: {}
  }),
      isLoading = _Digit$Hooks$tl$useIn.isLoading,
      inboxData = _Digit$Hooks$tl$useIn.data;

  var _useState = useState(true),
      isStateLocalisation = _useState[0],
      setIsStateLocalisation = _useState[1];

  useEffect(function () {
    if (tenantId && isStateLocalisation) {
      setIsStateLocalisation(false);
      Digit.LocalizationService.getLocale({
        modules: ["rainmaker-" + tenantId],
        locale: Digit.StoreData.getCurrentLanguage(),
        tenantId: "" + tenantId
      });
    }
  }, [tenantId]);
  var links = [{
    count: isLoading ? "-" : inboxData === null || inboxData === void 0 ? void 0 : inboxData.totalCount,
    label: t("ES_COMMON_INBOX"),
    link: "/digit-ui/employee/tl/inbox"
  }, {
    label: t("TL_NEW_APPLICATION"),
    link: "/digit-ui/employee/tl/new-application",
    role: "TL_CEMP"
  }, {
    label: t("TL_SEARCH_APPLICATIONS"),
    link: "/digit-ui/employee/tl/search/application"
  }, {
    label: t("TL_SEARCH_LICENSE"),
    link: "/digit-ui/employee/tl/search/license",
    role: "TL_CEMP"
  }];
  links = links.filter(function (link) {
    return link.role ? checkForEmployee(link.role) : true;
  });
  var propsForModuleCard = {
    Icon: /*#__PURE__*/React.createElement(CaseIcon, null),
    moduleName: t("TL_COMMON_TL"),
    kpis: [{
      count: isLoading ? "-" : inboxData === null || inboxData === void 0 ? void 0 : inboxData.totalCount,
      label: t("TOTAL_TL"),
      link: "/digit-ui/employee/tl/inbox"
    }, {
      label: t("TOTAL_NEARING_SLA"),
      link: "/digit-ui/employee/tl/inbox"
    }],
    links: links
  };
  return /*#__PURE__*/React.createElement(EmployeeModuleCard, propsForModuleCard);
};

var TLInfoLabel = function TLInfoLabel(_ref) {
  var t = _ref.t;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "80%"
    }
  }, /*#__PURE__*/React.createElement(CitizenInfoLabel, {
    info: t("CS_FILE_APPLICATION_INFO_LABEL"),
    text: t("TL_EDIT_INFO_CARD_INFORMATION_DETAILS_LABEL")
  })));
};

var SearchApplication = function SearchApplication(_ref) {
  var tenantId = _ref.tenantId,
      t = _ref.t,
      onSubmit = _ref.onSubmit,
      data = _ref.data;

  var _useForm = useForm({
    defaultValues: {
      offset: 0,
      limit: 10,
      sortBy: "commencementDate",
      sortOrder: "DESC"
    }
  }),
      register = _useForm.register,
      control = _useForm.control,
      handleSubmit = _useForm.handleSubmit,
      setValue = _useForm.setValue,
      getValues = _useForm.getValues,
      reset = _useForm.reset;

  useEffect(function () {
    register("offset", 0);
    register("limit", 10);
    register("sortBy", "commencementDate");
    register("sortOrder", "DESC");
  }, [register]);

  var _Digit$Hooks$tl$useMD = Digit.Hooks.tl.useMDMS.applicationTypes(tenantId),
      applicationTypes = _Digit$Hooks$tl$useMD.data;

  var applicationStatuses = [{
    code: "CANCELLED",
    i18nKey: "WF_NEWTL_CANCELLED"
  }, {
    code: "APPROVED",
    i18nKey: "WF_NEWTL_APPROVED"
  }, {
    code: "EXPIRED",
    i18nKey: "WF_NEWTL_EXPIRED"
  }, {
    code: "APPLIED",
    i18nKey: "WF_NEWTL_APPLIED"
  }, {
    code: "REJECTED",
    i18nKey: "WF_NEWTL_REJECTED"
  }, {
    code: "PENDINGPAYMENT",
    i18nKey: "WF_NEWTL_PENDINGPAYMENT"
  }, {
    code: "FIELDINSPECTION",
    i18nKey: "WF_NEWTL_FIELDINSPECTION"
  }, {
    code: "CITIZENACTIONREQUIRED",
    i18nKey: "WF_NEWTL_CITIZENACTIONREQUIRED"
  }, {
    code: "PENDINGAPPROVAL",
    i18nKey: "WF_NEWTL_PENDINGAPPROVAL"
  }, {
    code: "INITIATED",
    i18nKey: "WF_NEWTL_INITIATED"
  }];

  var GetCell = function GetCell(value) {
    return /*#__PURE__*/React.createElement("span", {
      className: "cell-text"
    }, value);
  };

  var columns = useMemo(function () {
    return [{
      Header: t("TL_COMMON_TABLE_COL_APP_NO"),
      accessor: "applicationNo",
      disableSortBy: true,
      Cell: function Cell(_ref2) {
        var row = _ref2.row;
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
          className: "link"
        }, /*#__PURE__*/React.createElement(Link, {
          to: "/digit-ui/employee/tl/application-details/" + row.original["applicationNumber"]
        }, row.original["applicationNumber"])));
      }
    }, {
      Header: t("TL_COMMON_TABLE_COL_APP_DATE"),
      disableSortBy: true,
      accessor: function accessor(row) {
        return GetCell(row.auditDetails.createdTime ? convertEpochToDateDMY(row.auditDetails.createdTime) : "");
      }
    }, {
      Header: t("TL_APPLICATION_TYPE_LABEL"),
      disableSortBy: true,
      accessor: function accessor(row) {
        return GetCell(t("TL_LOCALIZATION_APPLICATIONTYPE_" + row.applicationType));
      }
    }, {
      Header: t("TL_LICENSE_NUMBERL_LABEL"),
      disableSortBy: true,
      accessor: function accessor(row) {
        return GetCell(row.licenseNumber || "-");
      }
    }, {
      Header: t("TL_LICENSE_YEAR_LABEL"),
      disableSortBy: true,
      accessor: function accessor(row) {
        return GetCell(row.financialYear);
      }
    }, {
      Header: t("TL_COMMON_TABLE_COL_TRD_NAME"),
      disableSortBy: true,
      accessor: function accessor(row) {
        return GetCell(row.tradeName || "");
      }
    }, {
      Header: t("TL_LOCALIZATION_TRADE_OWNER_NAME"),
      accessor: function accessor(row) {
        return GetCell(row.tradeLicenseDetail.owners.map(function (o) {
          return o.name;
        }).join(",") || "");
      },
      disableSortBy: true
    }, {
      Header: t("TL_COMMON_TABLE_COL_STATUS"),
      accessor: function accessor(row) {
        var _row$workflowCode;

        return GetCell(t((row === null || row === void 0 ? void 0 : row.workflowCode) && (row === null || row === void 0 ? void 0 : row.status) && "WF_" + (row === null || row === void 0 ? void 0 : (_row$workflowCode = row.workflowCode) === null || _row$workflowCode === void 0 ? void 0 : _row$workflowCode.toUpperCase()) + "_" + row.status || "NA"));
      },
      disableSortBy: true
    }];
  }, []);
  var onSort = useCallback(function (args) {
    if (args.length === 0) return;
    setValue("sortBy", args.id);
    setValue("sortOrder", args.desc ? "DESC" : "ASC");
  }, []);

  function onPageSizeChange(e) {
    setValue("limit", Number(e.target.value));
    handleSubmit(onSubmit)();
  }

  function nextPage() {
    setValue("offset", getValues("offset") + getValues("limit"));
    handleSubmit(onSubmit)();
  }

  function previousPage() {
    setValue("offset", getValues("offset") - getValues("limit"));
    handleSubmit(onSubmit)();
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SearchForm, {
    onSubmit: onSubmit,
    handleSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement(SearchField, null, /*#__PURE__*/React.createElement("label", null, t("TL_HOME_SEARCH_RESULTS_APP_NO_LABEL")), /*#__PURE__*/React.createElement(TextInput, {
    name: "applicationNumber",
    inputRef: register({})
  })), /*#__PURE__*/React.createElement(SearchField, null, /*#__PURE__*/React.createElement("label", null, t("TL_LOCALIZATION_APPLICATION_TYPE")), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "applicationType",
    render: function render(props) {
      return /*#__PURE__*/React.createElement(Dropdown, {
        selected: props.value,
        select: props.onChange,
        onBlur: props.onBlur,
        option: applicationTypes,
        optionKey: "i18nKey",
        t: t
      });
    }
  })), /*#__PURE__*/React.createElement(SearchField, null, /*#__PURE__*/React.createElement("label", null, t("TL_TRADE_LICENCE_FROM_DATE")), /*#__PURE__*/React.createElement(Controller, {
    render: function render(props) {
      return /*#__PURE__*/React.createElement(DatePicker, {
        date: props.value,
        onChange: props.onChange
      });
    },
    name: "fromDate",
    control: control
  })), /*#__PURE__*/React.createElement(SearchField, null, /*#__PURE__*/React.createElement("label", null, t("TL_TRADE_LICENCE_TO_DATE")), /*#__PURE__*/React.createElement(Controller, {
    render: function render(props) {
      return /*#__PURE__*/React.createElement(DatePicker, {
        date: props.value,
        onChange: props.onChange
      });
    },
    name: "toDate",
    control: control
  })), /*#__PURE__*/React.createElement(SearchField, null, /*#__PURE__*/React.createElement("label", null, t("TL_TRADE_LICENSE_LABEL")), /*#__PURE__*/React.createElement(TextInput, {
    name: "licenseNumbers",
    inputRef: register({})
  })), /*#__PURE__*/React.createElement(SearchField, null, /*#__PURE__*/React.createElement("label", null, t("TL_HOME_SEARCH_RESULTS_APP_STATUS_LABEL")), /*#__PURE__*/React.createElement(Controller, {
    control: control,
    name: "status",
    render: function render(props) {
      return /*#__PURE__*/React.createElement(Dropdown, {
        selected: props.value,
        select: props.onChange,
        onBlur: props.onBlur,
        option: applicationStatuses,
        optionKey: "i18nKey",
        t: t
      });
    }
  })), /*#__PURE__*/React.createElement(SearchField, null, /*#__PURE__*/React.createElement("label", null, t("TL_LOCALIZATION_TRADE_NAME")), /*#__PURE__*/React.createElement(TextInput, {
    name: "tradeName",
    inputRef: register({})
  })), /*#__PURE__*/React.createElement(SearchField, {
    className: "submit"
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("ES_COMMON_SEARCH"),
    submit: true
  }), /*#__PURE__*/React.createElement("p", {
    onClick: function onClick() {
      reset({
        applicationType: "",
        fromDate: "",
        toDate: "",
        licenseNumbers: "",
        status: "",
        tradeName: "",
        offset: 0,
        limit: 10,
        sortBy: "commencementDate",
        sortOrder: "DESC"
      });
      previousPage();
    }
  }, t("ES_COMMON_CLEAR_ALL")))), data !== null && data !== void 0 && data.display ? /*#__PURE__*/React.createElement(Card, {
    style: {
      marginTop: 20
    }
  }, t(data.display).split("\\n").map(function (text, index) {
    return /*#__PURE__*/React.createElement("p", {
      key: index,
      style: {
        textAlign: "center"
      }
    }, text);
  })) : /*#__PURE__*/React.createElement(Table, {
    t: t,
    data: data,
    columns: columns,
    getCellProps: function getCellProps(cellInfo) {
      return {
        style: {
          minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
          padding: "20px 18px",
          fontSize: "16px"
        }
      };
    },
    onPageSizeChange: onPageSizeChange,
    currentPage: getValues("offset") / getValues("limit"),
    onNextPage: nextPage,
    onPrevPage: previousPage,
    pageSizeLimit: getValues("limit"),
    onSort: onSort,
    disableSort: false,
    sortParams: [{
      id: getValues("sortBy"),
      desc: getValues("sortOrder") === "DESC" ? true : false
    }]
  }));
};

var SearchLicense = function SearchLicense(_ref) {
  var t = _ref.t,
      onSubmit = _ref.onSubmit,
      data = _ref.data;
  var applications = {};
  var validation = {};
  var applicationsList = data;
  var newapplicationlist = [];

  if (applicationsList && applicationsList.length > 0) {
    applicationsList.filter(function (response) {
      return response.licenseNumber;
    }).map(function (ob) {
      if (applications[ob.licenseNumber]) {
        if (applications[ob.licenseNumber].applicationDate < ob.applicationDate) applications[ob.licenseNumber] = ob;
      } else applications[ob.licenseNumber] = ob;
    });
    newapplicationlist = Object.values(applications);
    newapplicationlist = newapplicationlist ? newapplicationlist.filter(function (ele) {
      return ele.financialYear != "2021-22" && (ele.status == "EXPIRED" || ele.status == "APPROVED");
    }) : [];
  }

  var _useForm = useForm({
    defaultValues: {
      offset: 0,
      limit: 10,
      sortBy: "commencementDate",
      sortOrder: "DESC",
      status: "APPROVED"
    }
  }),
      register = _useForm.register,
      control = _useForm.control,
      handleSubmit = _useForm.handleSubmit,
      setValue = _useForm.setValue,
      getValues = _useForm.getValues,
      reset = _useForm.reset;

  useEffect(function () {
    register("offset", 0);
    register("limit", 10);
    register("sortBy", "commencementDate");
    register("sortOrder", "DESC");
    register("status", "APPROVED");
  }, [register]);

  var GetCell = function GetCell(value) {
    return /*#__PURE__*/React.createElement("span", {
      className: "cell-text"
    }, value);
  };

  var columns = useMemo(function () {
    return [{
      Header: t("TL_TRADE_LICENSE_LABEL"),
      accessor: "licenseNumber",
      disableSortBy: true,
      Cell: function Cell(_ref2) {
        var row = _ref2.row;
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
          className: "link"
        }, /*#__PURE__*/React.createElement(Link, {
          to: "/digit-ui/employee/tl/application-details/" + row.original["applicationNumber"]
        }, row.original["licenseNumber"])));
      }
    }, {
      Header: t("TL_LOCALIZATION_TRADE_NAME"),
      disableSortBy: true,
      accessor: function accessor(row) {
        return GetCell(row.tradeName || "");
      }
    }, {
      Header: t("ES_APPLICATION_SEARCH_ISSUED_DATE"),
      disableSortBy: true,
      accessor: function accessor(row) {
        return GetCell(row.issuedDate ? convertEpochToDateDMY(row.issuedDate) : "");
      }
    }, {
      Header: t("ES_APPLICATION_SEARCH_VALID_TO"),
      disableSortBy: true,
      accessor: function accessor(row) {
        return GetCell(row.validTo ? convertEpochToDateDMY(row.validTo) : "");
      }
    }, {
      Header: t("TL_HOME_SEARCH_RESULTS__LOCALITY"),
      disableSortBy: true,
      accessor: function accessor(row) {
        var _row$tradeLicenseDeta, _row$tradeLicenseDeta2;

        return GetCell(t(stringReplaceAll((_row$tradeLicenseDeta = row.tradeLicenseDetail.address) === null || _row$tradeLicenseDeta === void 0 ? void 0 : (_row$tradeLicenseDeta2 = _row$tradeLicenseDeta.city) === null || _row$tradeLicenseDeta2 === void 0 ? void 0 : _row$tradeLicenseDeta2.toUpperCase(), ".", "_") + "_REVENUE_" + row.tradeLicenseDetail.address.locality.code) || "");
      }
    }, {
      Header: t("TL_COMMON_TABLE_COL_STATUS"),
      accessor: function accessor(row) {
        var _row$workflowCode;

        return GetCell(t((row === null || row === void 0 ? void 0 : row.workflowCode) && (row === null || row === void 0 ? void 0 : row.status) && "WF_" + (row === null || row === void 0 ? void 0 : (_row$workflowCode = row.workflowCode) === null || _row$workflowCode === void 0 ? void 0 : _row$workflowCode.toUpperCase()) + "_" + row.status || "NA"));
      },
      disableSortBy: true
    }];
  }, []);
  var onSort = useCallback(function (args) {
    if (args.length === 0) return;
    setValue("sortBy", args.id);
    setValue("sortOrder", args.desc ? "DESC" : "ASC");
  }, []);

  function onPageSizeChange(e) {
    setValue("limit", Number(e.target.value));
    handleSubmit(onSubmit)();
  }

  function nextPage() {
    setValue("offset", getValues("offset") + getValues("limit"));
    handleSubmit(onSubmit)();
  }

  function previousPage() {
    setValue("offset", getValues("offset") - getValues("limit"));
    handleSubmit(onSubmit)();
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SearchForm, {
    onSubmit: onSubmit,
    handleSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement(SearchField, null, /*#__PURE__*/React.createElement("label", null, t("TL_TRADE_LICENSE_LABEL")), /*#__PURE__*/React.createElement(TextInput, {
    name: "licenseNumbers",
    inputRef: register({})
  })), /*#__PURE__*/React.createElement(SearchField, null, /*#__PURE__*/React.createElement("label", null, t("TL_TRADE_OWNER_S_NUMBER_LABEL")), /*#__PURE__*/React.createElement(TextInput, _extends({
    name: "mobileNumber",
    inputRef: register({}),
    type: "mobileNumber",
    componentInFront: /*#__PURE__*/React.createElement("div", {
      className: "employee-card-input employee-card-input--front"
    }, "+91"),
    maxlength: 10
  }, validation = {
    pattern: "[6-9]{1}[0-9]{9}",
    type: "tel",
    title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")
  }))), /*#__PURE__*/React.createElement(SearchField, null, /*#__PURE__*/React.createElement("label", null, t("TL_SEARCH_TRADE_LICENSE_ISSUED_FROM")), /*#__PURE__*/React.createElement(Controller, {
    render: function render(props) {
      return /*#__PURE__*/React.createElement(DatePicker, {
        date: props.value,
        onChange: props.onChange
      });
    },
    name: "fromDate",
    control: control
  })), /*#__PURE__*/React.createElement(SearchField, null, /*#__PURE__*/React.createElement("label", null, t("TL_SEARCH_TRADE_LICENSE_ISSUED_TO")), /*#__PURE__*/React.createElement(Controller, {
    render: function render(props) {
      return /*#__PURE__*/React.createElement(DatePicker, {
        date: props.value,
        onChange: props.onChange
      });
    },
    name: "toDate",
    control: control
  })), /*#__PURE__*/React.createElement(SearchField, null, /*#__PURE__*/React.createElement("label", null, t("TL_LOCALIZATION_TRADE_NAME")), /*#__PURE__*/React.createElement(TextInput, {
    name: "tradeName",
    inputRef: register({})
  })), /*#__PURE__*/React.createElement(SearchField, {
    className: "submit"
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("ES_COMMON_SEARCH"),
    submit: true
  }), /*#__PURE__*/React.createElement("p", {
    onClick: function onClick() {
      reset({
        licenseNumbers: "",
        mobileNumber: "",
        fromDate: "",
        toDate: "",
        offset: 0,
        limit: 10,
        sortBy: "commencementDate",
        sortOrder: "DESC",
        status: "APPROVED"
      });
      previousPage();
    }
  }, t("ES_COMMON_CLEAR_ALL")))), data !== null && data !== void 0 && data.display ? /*#__PURE__*/React.createElement(Card, {
    style: {
      marginTop: 20
    }
  }, t(data.display).split("\\n").map(function (text, index) {
    return /*#__PURE__*/React.createElement("p", {
      key: index,
      style: {
        textAlign: "center"
      }
    }, text);
  })) : /*#__PURE__*/React.createElement(Table, {
    t: t,
    data: newapplicationlist,
    columns: columns,
    getCellProps: function getCellProps(cellInfo) {
      return {
        style: {
          minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
          padding: "20px 18px",
          fontSize: "16px"
        }
      };
    },
    onPageSizeChange: onPageSizeChange,
    currentPage: getValues("offset") / getValues("limit"),
    onNextPage: nextPage,
    onPrevPage: previousPage,
    pageSizeLimit: getValues("limit"),
    onSort: onSort,
    disableSort: false,
    sortParams: [{
      id: getValues("sortBy"),
      desc: getValues("sortOrder") === "DESC" ? true : false
    }],
    totalRecords: 100
  }));
};

var Filter = function Filter(_ref) {
  var _searchParams$localit;

  var searchParams = _ref.searchParams,
      onFilterChange = _ref.onFilterChange,
      statuses = _ref.statuses,
      props = _objectWithoutPropertiesLoose(_ref, ["searchParams", "onFilterChange", "defaultSearchParams", "statuses"]);

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState(function () {
    return searchParams;
  }),
      _searchParams = _useState[0],
      setSearchParams = _useState[1];

  var localParamChange = function localParamChange(filterParam) {
    var keys_to_delete = filterParam.delete;

    var _new = _extends({}, _searchParams, filterParam);

    if (keys_to_delete) keys_to_delete.forEach(function (key) {
      return delete _new[key];
    });
    delete filterParam.delete;
    setSearchParams(_extends({}, _new));
  };

  var clearAll = function clearAll() {
    setSearchParams({
      applicationStatus: []
    });
    onFilterChange({
      applicationStatus: []
    });
  };

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var onServiceSelect = function onServiceSelect(e, label) {
    if (e.target.checked) localParamChange({
      applicationStatus: [].concat(_searchParams !== null && _searchParams !== void 0 && _searchParams.applicationStatus ? _searchParams.applicationStatus : [], [label])
    });else localParamChange({
      applicationStatus: _searchParams === null || _searchParams === void 0 ? void 0 : _searchParams.applicationStatus.filter(function (o) {
        return o !== label;
      })
    });
  };

  var selectLocality = function selectLocality(d) {
    localParamChange({
      locality: [].concat((_searchParams === null || _searchParams === void 0 ? void 0 : _searchParams.locality) || [], [d])
    });
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "filter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "heading",
    style: {
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-label",
    style: {
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 22 22",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0.66666 2.48016C3.35999 5.9335 8.33333 12.3335 8.33333 12.3335V20.3335C8.33333 21.0668 8.93333 21.6668 9.66666 21.6668H12.3333C13.0667 21.6668 13.6667 21.0668 13.6667 20.3335V12.3335C13.6667 12.3335 18.6267 5.9335 21.32 2.48016C22 1.60016 21.3733 0.333496 20.2667 0.333496H1.71999C0.613327 0.333496 -0.01334 1.60016 0.66666 2.48016Z",
    fill: "#505A5F"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "8px",
      fontWeight: "normal"
    }
  }, t("ES_COMMON_FILTER_BY"), ":")), /*#__PURE__*/React.createElement("div", {
    className: "clearAll",
    onClick: clearAll
  }, t("ES_COMMON_CLEAR_ALL")), props.type === "desktop" && /*#__PURE__*/React.createElement("span", {
    className: "clear-search",
    onClick: clearAll,
    style: {
      border: "1px solid #e0e0e0",
      padding: "6px"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 16 22",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z",
    fill: "#505A5F"
  }))), props.type === "mobile" && /*#__PURE__*/React.createElement("span", {
    onClick: props.onClose
  }, /*#__PURE__*/React.createElement(CloseSvg, null))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RadioButtons, {
    onSelect: function onSelect(d) {
      return localParamChange({
        uuid: d
      });
    },
    selectedOption: (_searchParams === null || _searchParams === void 0 ? void 0 : _searchParams.uuid) || {
      code: "ASSIGNED_TO_ALL",
      name: "ES_INBOX_ASSIGNED_TO_ALL"
    },
    t: t,
    optionsKey: "name",
    options: [{
      code: "ASSIGNED_TO_ME",
      name: "ES_INBOX_ASSIGNED_TO_ME"
    }, {
      code: "ASSIGNED_TO_ALL",
      name: "ES_INBOX_ASSIGNED_TO_ALL"
    }]
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "filter-label",
    style: {
      fontWeight: "normal"
    }
  }, t("ES_INBOX_LOCALITY"), ":"), /*#__PURE__*/React.createElement(Localities, {
    selectLocality: selectLocality,
    tenantId: tenantId,
    boundaryType: "revenue"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tag-container"
  }, _searchParams === null || _searchParams === void 0 ? void 0 : (_searchParams$localit = _searchParams.locality) === null || _searchParams$localit === void 0 ? void 0 : _searchParams$localit.map(function (locality, index) {
    return /*#__PURE__*/React.createElement(RemoveableTag, {
      key: index,
      text: t("" + locality.i18nkey),
      onClick: function onClick() {
        localParamChange({
          locality: _searchParams === null || _searchParams === void 0 ? void 0 : _searchParams.locality.filter(function (loc) {
            return loc.code !== locality.code;
          })
        });
      }
    });
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "filter-label",
    style: {
      fontWeight: "normal"
    }
  }, t("CS_INBOX_STATUS_FILTER")), statuses.map(function (e, index) {
    var _searchParams$applica;

    var checked = _searchParams === null || _searchParams === void 0 ? void 0 : (_searchParams$applica = _searchParams.applicationStatus) === null || _searchParams$applica === void 0 ? void 0 : _searchParams$applica.includes(e.statusid);
    return /*#__PURE__*/React.createElement(CheckBox, {
      key: index + "service",
      label: t("CS_COMMON_INBOX_" + e.businessservice.toUpperCase()) + " - " + t("WF_NEWTL_" + e.applicationstatus) + " " + ("(" + e.count + ")"),
      value: e.statusid,
      checked: checked,
      onChange: function onChange(event) {
        return onServiceSelect(event, e.statusid);
      }
    });
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubmitBar, {
    disabled: lodash.isEqual(_searchParams, searchParams),
    onSubmit: function onSubmit() {
      return onFilterChange(_searchParams);
    },
    label: t("ES_COMMON_APPLY")
  }))))));
};

var ApplicationDetails = function ApplicationDetails() {
  var _application$applicat, _paymentsHistory$Paym2;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useParams = useParams(),
      id = _useParams.id;

  var _useParams2 = useParams(),
      tenantId = _useParams2.tenantId;

  var history = useHistory();

  var _useState = useState(null),
      bill = _useState[0],
      setBill = _useState[1];

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      storeData = _Digit$Hooks$useStore.data;

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("CITIZEN_TL_MUTATION_HAPPENED", false),
      setMutationHappened = _Digit$Hooks$useSessi[1];

  var _ref = storeData || {},
      tenants = _ref.tenants;

  var multiBoxStyle = {
    border: "groove",
    background: "#FAFAFA",
    borderRadius: "4px",
    paddingInline: "10px",
    marginTop: "10px",
    marginBottom: "10px"
  };
  var multiHeaderStyle = {
    marginBottom: "10px",
    marginTop: "10px",
    color: "#505A5F"
  };

  var _Digit$Hooks$tl$useTL = Digit.Hooks.tl.useTLApplicationDetails({
    tenantId: tenantId,
    applicationNumber: id
  }),
      isLoading = _Digit$Hooks$tl$useTL.isLoading,
      application = _Digit$Hooks$tl$useTL.data,
      errorApplication = _Digit$Hooks$tl$useTL.error;

  useEffect(function () {
    setMutationHappened(false);
  }, []);

  var _Digit$Hooks$tl$useTL2 = Digit.Hooks.tl.useTLPaymentHistory(tenantId, id),
      paymentsHistory = _Digit$Hooks$tl$useTL2.data;

  useEffect(function () {
    if (application) {
      var _application$, _application$2;

      Digit.PaymentService.fetchBill(tenantId, {
        consumerCode: (_application$ = application[0]) === null || _application$ === void 0 ? void 0 : _application$.applicationNumber,
        businessService: (_application$2 = application[0]) === null || _application$2 === void 0 ? void 0 : _application$2.businessService
      }).then(function (res) {
        setBill(res === null || res === void 0 ? void 0 : res.Bill[0]);
      });
    }
  }, [application]);

  var _useState2 = useState(false),
      showOptions = _useState2[0],
      setShowOptions = _useState2[1];

  useEffect(function () {}, [application, errorApplication]);

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  if ((application === null || application === void 0 ? void 0 : (_application$applicat = application.applicationDetails) === null || _application$applicat === void 0 ? void 0 : _application$applicat.length) === 0) {
    history.goBack();
  }

  var handleDownloadPdf = function handleDownloadPdf() {
    try {
      var tenantInfo = tenants.find(function (tenant) {
        var _application$3;

        return tenant.code === ((_application$3 = application[0]) === null || _application$3 === void 0 ? void 0 : _application$3.tenantId);
      });
      var res = application[0];
      var data = getPTAcknowledgementData(_extends({}, res), tenantInfo, t);
      data.then(function (ress) {
        return Digit.Utils.pdf.generate(ress);
      });
      setShowOptions(false);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var downloadPaymentReceipt = function downloadPaymentReceipt() {
    try {
      var _paymentsHistory$Paym;

      var receiptFile = {
        filestoreIds: [(_paymentsHistory$Paym = paymentsHistory.Payments[0]) === null || _paymentsHistory$Paym === void 0 ? void 0 : _paymentsHistory$Paym.fileStoreId]
      };

      var _temp2 = function () {
        var _receiptFile$fileStor;

        if (!(receiptFile !== null && receiptFile !== void 0 && (_receiptFile$fileStor = receiptFile.fileStoreIds) !== null && _receiptFile$fileStor !== void 0 && _receiptFile$fileStor[0])) {
          return Promise.resolve(Digit.PaymentService.generatePdf(tenantId, {
            Payments: [paymentsHistory.Payments[0]]
          }, "tradelicense-receipt")).then(function (newResponse) {
            return Promise.resolve(Digit.PaymentService.printReciept(tenantId, {
              fileStoreIds: newResponse.filestoreIds[0]
            })).then(function (fileStore) {
              window.open(fileStore[newResponse.filestoreIds[0]], "_blank");
              setShowOptions(false);
            });
          });
        } else {
          return Promise.resolve(Digit.PaymentService.printReciept(tenantId, {
            fileStoreIds: receiptFile.filestoreIds[0]
          })).then(function (fileStore) {
            window.open(fileStore[receiptFile.filestoreIds[0]], "_blank");
            setShowOptions(false);
          });
        }
      }();

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var downloadTLcertificate = function downloadTLcertificate() {
    try {
      return Promise.resolve(Digit.PaymentService.generatePdf(tenantId, {
        Licenses: application
      }, "tlcertificate")).then(function (TLcertificatefile) {
        return Promise.resolve(Digit.PaymentService.printReciept(tenantId, {
          fileStoreIds: TLcertificatefile.filestoreIds[0]
        })).then(function (receiptFile) {
          window.open(receiptFile[TLcertificatefile.filestoreIds[0]], "_blank");
          setShowOptions(false);
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var dowloadOptions = (paymentsHistory === null || paymentsHistory === void 0 ? void 0 : (_paymentsHistory$Paym2 = paymentsHistory.Payments) === null || _paymentsHistory$Paym2 === void 0 ? void 0 : _paymentsHistory$Paym2.length) > 0 ? [{
    label: t("TL_CERTIFICATE"),
    onClick: downloadTLcertificate
  }, {
    label: t("CS_COMMON_PAYMENT_RECEIPT"),
    onClick: downloadPaymentReceipt
  }] : [{
    label: t("CS_COMMON_APPLICATION_ACKNOWLEDGEMENT"),
    onClick: handleDownloadPdf
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "cardHeaderWithOptions"
  }, /*#__PURE__*/React.createElement(Header, null, t("CS_TITLE_APPLICATION_DETAILS")), /*#__PURE__*/React.createElement(MultiLink, {
    className: "multilinkWrapper",
    onHeadClick: function onHeadClick() {
      return setShowOptions(!showOptions);
    },
    displayOptions: showOptions,
    options: dowloadOptions
  })), /*#__PURE__*/React.createElement(Card, {
    style: {
      position: "relative"
    }
  }, application === null || application === void 0 ? void 0 : application.map(function (application, index) {
    var _application$tradeLic, _application$tradeLic2, _application$tradeLic3, _application$tradeLic4, _application$tradeLic5, _application$tradeLic6, _application$tradeLic7, _application$tradeLic8, _application$tradeLic9, _application$tradeLic10, _application$tradeLic11, _application$tradeLic12, _application$tradeLic13, _application$tradeLic14, _application$tradeLic15, _application$tradeLic16, _application$tradeLic17, _application$tradeLic18, _application$tradeLic19, _application$tradeLic20, _application$tradeLic21, _application$tradeLic22, _application$tradeLic23, _application$tradeLic24, _application$tradeLic25, _application$tradeLic26, _application$tradeLic27, _application$tradeLic28, _application$tradeLic29, _application$tradeLic30, _application$tradeLic31;

    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "employee-data-table"
    }, /*#__PURE__*/React.createElement(Row, {
      className: "employee-data-table",
      label: t("TL_COMMON_TABLE_COL_APP_NO"),
      text: application === null || application === void 0 ? void 0 : application.applicationNumber,
      textStyle: {
        whiteSpace: "pre",
        border: "none"
      }
    }), /*#__PURE__*/React.createElement(Row, {
      label: t("TL_APPLICATION_CATEGORY"),
      text: t("ACTION_TEST_TRADE_LICENSE"),
      textStyle: {
        whiteSpace: "pre"
      }
    }), /*#__PURE__*/React.createElement(CardSectionHeader, null, t("TL_OWNERSHIP_DETAILS_HEADER")), application === null || application === void 0 ? void 0 : application.tradeLicenseDetail.owners.map(function (ele, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        style: multiBoxStyle
      }, /*#__PURE__*/React.createElement(CardSectionHeader, {
        style: multiHeaderStyle
      }, t("TL_PAYMENT_PAID_BY_PLACEHOLDER") + " - " + (index + 1)), /*#__PURE__*/React.createElement(Row, {
        label: "" + t("TL_COMMON_TABLE_COL_OWN_NAME"),
        text: t(ele.name),
        textStyle: {
          whiteSpace: "pre"
        }
      }), /*#__PURE__*/React.createElement(Row, {
        label: "" + t("TL_NEW_OWNER_DETAILS_GENDER_LABEL"),
        text: t(ele.gender),
        textStyle: {
          whiteSpace: "pre"
        }
      }), /*#__PURE__*/React.createElement(Row, {
        label: "" + t("TL_MOBILE_NUMBER_LABEL"),
        text: t(ele.mobileNumber),
        textStyle: {
          whiteSpace: "pre"
        }
      }));
    }), /*#__PURE__*/React.createElement(Row, {
      style: {
        border: "none"
      },
      label: t("TL_COMMON_TABLE_COL_STATUS"),
      text: t("WF_NEWTL_" + (application === null || application === void 0 ? void 0 : application.status)),
      textStyle: {
        whiteSpace: "pre-wrap",
        width: "70%"
      }
    }), /*#__PURE__*/React.createElement(Row, {
      style: {
        border: "none"
      },
      label: t("TL_COMMON_TABLE_COL_SLA_NAME"),
      text: Math.round((application === null || application === void 0 ? void 0 : application.SLA) / (1000 * 60 * 60 * 24)) + " " + t("TL_SLA_DAYS"),
      textStyle: {
        whiteSpace: "pre"
      }
    }), /*#__PURE__*/React.createElement(Row, {
      style: {
        border: "none"
      },
      label: t("TL_COMMON_TABLE_COL_TRD_NAME"),
      text: application === null || application === void 0 ? void 0 : application.tradeName,
      textStyle: {
        whiteSpace: "pre-wrap",
        width: "70%"
      }
    }), /*#__PURE__*/React.createElement(CardSubHeader, null, t("TL_TRADE_UNITS_HEADER")), application === null || application === void 0 ? void 0 : (_application$tradeLic = application.tradeLicenseDetail) === null || _application$tradeLic === void 0 ? void 0 : (_application$tradeLic2 = _application$tradeLic.tradeUnits) === null || _application$tradeLic2 === void 0 ? void 0 : _application$tradeLic2.map(function (ele, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        style: multiBoxStyle
      }, /*#__PURE__*/React.createElement(CardSectionHeader, {
        style: multiHeaderStyle
      }, t("TL_UNIT_HEADER"), " ", index + 1), /*#__PURE__*/React.createElement(Row, {
        label: t("TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL"),
        text: t("TRADELICENSE_TRADETYPE_" + (ele === null || ele === void 0 ? void 0 : ele.tradeType.split(".")[0])),
        textStyle: {
          whiteSpace: "pre"
        }
      }), /*#__PURE__*/React.createElement(Row, {
        style: {
          border: "none"
        },
        label: t("TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL"),
        text: t("TRADELICENSE_TRADETYPE_" + (ele === null || ele === void 0 ? void 0 : ele.tradeType.split(".")[1])),
        textStyle: {
          whiteSpace: "pre"
        }
      }), /*#__PURE__*/React.createElement(Row, {
        style: {
          border: "none"
        },
        label: t("TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL"),
        text: t("TRADELICENSE_TRADETYPE_" + (ele === null || ele === void 0 ? void 0 : ele.tradeType.split(".")[0]) + "_" + (ele === null || ele === void 0 ? void 0 : ele.tradeType.split(".")[1]) + "_" + (ele === null || ele === void 0 ? void 0 : ele.tradeType.split(".")[2].split("-").join("_"))),
        textStyle: {
          whiteSpace: "pre-wrap",
          width: "70%"
        }
      }));
    }), Array.isArray(application === null || application === void 0 ? void 0 : (_application$tradeLic3 = application.tradeLicenseDetail) === null || _application$tradeLic3 === void 0 ? void 0 : _application$tradeLic3.accessories) && (application === null || application === void 0 ? void 0 : (_application$tradeLic4 = application.tradeLicenseDetail) === null || _application$tradeLic4 === void 0 ? void 0 : _application$tradeLic4.accessories.length) > 0 && /*#__PURE__*/React.createElement(CardSubHeader, {
      style: {
        paddingTop: "7px"
      }
    }, t("TL_NEW_TRADE_DETAILS_HEADER_ACC")), Array.isArray(application === null || application === void 0 ? void 0 : (_application$tradeLic5 = application.tradeLicenseDetail) === null || _application$tradeLic5 === void 0 ? void 0 : _application$tradeLic5.accessories) && (application === null || application === void 0 ? void 0 : (_application$tradeLic6 = application.tradeLicenseDetail) === null || _application$tradeLic6 === void 0 ? void 0 : _application$tradeLic6.accessories.length) > 0 && (application === null || application === void 0 ? void 0 : (_application$tradeLic7 = application.tradeLicenseDetail) === null || _application$tradeLic7 === void 0 ? void 0 : (_application$tradeLic8 = _application$tradeLic7.accessories) === null || _application$tradeLic8 === void 0 ? void 0 : _application$tradeLic8.map(function (ele, index) {
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        style: multiBoxStyle
      }, /*#__PURE__*/React.createElement(CardSectionHeader, {
        style: multiHeaderStyle
      }, t("TL_ACCESSORY_LABEL"), " ", index + 1), /*#__PURE__*/React.createElement(Row, {
        style: {
          border: "none"
        },
        label: t("TL_REVIEWACCESSORY_TYPE_LABEL"),
        text: t("TL_" + (ele === null || ele === void 0 ? void 0 : ele.accessoryCategory.split("-").join("_"))),
        textStyle: {
          whiteSpace: "pre"
        }
      }), /*#__PURE__*/React.createElement(Row, {
        label: t("TL_NEW_TRADE_ACCESSORY_COUNT_LABEL"),
        text: ele === null || ele === void 0 ? void 0 : ele.count,
        textStyle: {
          whiteSpace: "pre"
        }
      }), /*#__PURE__*/React.createElement(Row, {
        label: t("TL_NEW_TRADE_ACCESSORY_UOM_LABEL"),
        text: ele === null || ele === void 0 ? void 0 : ele.uom,
        textStyle: {
          whiteSpace: "pre"
        }
      }), /*#__PURE__*/React.createElement(Row, {
        label: t("TL_NEW_TRADE_ACCESSORY_UOMVALUE_LABEL"),
        text: ele === null || ele === void 0 ? void 0 : ele.uomValue,
        textStyle: {
          whiteSpace: "pre"
        }
      }));
    })), /*#__PURE__*/React.createElement(Row, {
      label: ""
    }), /*#__PURE__*/React.createElement(Row, {
      style: {
        border: "none"
      },
      label: t("TL_NEW_TRADE_ADDRESS_LABEL"),
      text: (application !== null && application !== void 0 && (_application$tradeLic9 = application.tradeLicenseDetail) !== null && _application$tradeLic9 !== void 0 && (_application$tradeLic10 = _application$tradeLic9.address) !== null && _application$tradeLic10 !== void 0 && (_application$tradeLic11 = _application$tradeLic10.doorNo) !== null && _application$tradeLic11 !== void 0 && _application$tradeLic11.trim() ? (application === null || application === void 0 ? void 0 : (_application$tradeLic12 = application.tradeLicenseDetail) === null || _application$tradeLic12 === void 0 ? void 0 : (_application$tradeLic13 = _application$tradeLic12.address) === null || _application$tradeLic13 === void 0 ? void 0 : (_application$tradeLic14 = _application$tradeLic13.doorNo) === null || _application$tradeLic14 === void 0 ? void 0 : _application$tradeLic14.trim()) + ", " : "") + " " + (application !== null && application !== void 0 && (_application$tradeLic15 = application.tradeLicenseDetail) !== null && _application$tradeLic15 !== void 0 && (_application$tradeLic16 = _application$tradeLic15.address) !== null && _application$tradeLic16 !== void 0 && (_application$tradeLic17 = _application$tradeLic16.street) !== null && _application$tradeLic17 !== void 0 && _application$tradeLic17.trim() ? (application === null || application === void 0 ? void 0 : (_application$tradeLic18 = application.tradeLicenseDetail) === null || _application$tradeLic18 === void 0 ? void 0 : (_application$tradeLic19 = _application$tradeLic18.address) === null || _application$tradeLic19 === void 0 ? void 0 : (_application$tradeLic20 = _application$tradeLic19.street) === null || _application$tradeLic20 === void 0 ? void 0 : _application$tradeLic20.trim()) + ", " : "") + t(application === null || application === void 0 ? void 0 : (_application$tradeLic21 = application.tradeLicenseDetail) === null || _application$tradeLic21 === void 0 ? void 0 : (_application$tradeLic22 = _application$tradeLic21.address) === null || _application$tradeLic22 === void 0 ? void 0 : (_application$tradeLic23 = _application$tradeLic22.locality) === null || _application$tradeLic23 === void 0 ? void 0 : _application$tradeLic23.name) + ", " + t(application === null || application === void 0 ? void 0 : (_application$tradeLic24 = application.tradeLicenseDetail) === null || _application$tradeLic24 === void 0 ? void 0 : (_application$tradeLic25 = _application$tradeLic24.address) === null || _application$tradeLic25 === void 0 ? void 0 : _application$tradeLic25.city) + " " + (application !== null && application !== void 0 && (_application$tradeLic26 = application.tradeLicenseDetail) !== null && _application$tradeLic26 !== void 0 && (_application$tradeLic27 = _application$tradeLic26.address) !== null && _application$tradeLic27 !== void 0 && (_application$tradeLic28 = _application$tradeLic27.pincode) !== null && _application$tradeLic28 !== void 0 && _application$tradeLic28.trim() ? "," + (application === null || application === void 0 ? void 0 : (_application$tradeLic29 = application.tradeLicenseDetail) === null || _application$tradeLic29 === void 0 ? void 0 : (_application$tradeLic30 = _application$tradeLic29.address) === null || _application$tradeLic30 === void 0 ? void 0 : (_application$tradeLic31 = _application$tradeLic30.pincode) === null || _application$tradeLic31 === void 0 ? void 0 : _application$tradeLic31.trim()) : ""),
      textStyle: {
        whiteSpace: "pre-wrap",
        width: "70%"
      }
    }), /*#__PURE__*/React.createElement(TLWFApplicationTimeline, {
      application: application,
      id: id
    }), (application === null || application === void 0 ? void 0 : application.status) == "CITIZENACTIONREQUIRED" ? /*#__PURE__*/React.createElement(Link, {
      to: {
        pathname: "/digit-ui/citizen/tl/tradelicence/edit-application/" + (application === null || application === void 0 ? void 0 : application.applicationNumber) + "/" + (application === null || application === void 0 ? void 0 : application.tenantId),
        state: {}
      }
    }, /*#__PURE__*/React.createElement(SubmitBar, {
      label: t("COMMON_EDIT")
    })) : null, (application === null || application === void 0 ? void 0 : application.status) == "PENDINGPAYMENT" ? /*#__PURE__*/React.createElement(Link, {
      to: {
        pathname: "/digit-ui/citizen/payment/collect/" + (application === null || application === void 0 ? void 0 : application.businessService) + "/" + (application === null || application === void 0 ? void 0 : application.applicationNumber),
        state: {
          bill: bill,
          tenantId: tenantId
        }
      }
    }, /*#__PURE__*/React.createElement(SubmitBar, {
      label: t("COMMON_MAKE_PAYMENT")
    })) : null);
  })));
};

var newConfig = [{
  head: "",
  body: [{
    type: "component",
    component: "TLInfoLabel",
    key: "tradedetils1",
    withoutLabel: true,
    hideInCitizen: true
  }]
}, {
  head: "TL_COMMON_TR_DETAILS",
  body: [{
    type: "component",
    component: "TLTradeDetailsEmployee",
    key: "tradedetils",
    withoutLabel: true,
    hideInCitizen: true
  }]
}, {
  head: "TL_TRADE_UNITS_HEADER",
  body: [{
    type: "component",
    component: "TLTradeUnitsEmployee",
    key: "tradeUnits",
    withoutLabel: true,
    hideInCitizen: true
  }]
}, {
  head: "TL_NEW_TRADE_DETAILS_HEADER_ACC",
  body: [{
    type: "component",
    component: "TLAccessoriesEmployee",
    key: "accessories",
    withoutLabel: true,
    hideInCitizen: true
  }]
}, {
  head: "ES_NEW_APPLICATION_LOCATION_DETAILS",
  body: [{
    route: "map",
    component: "TLSelectGeolocation",
    nextStep: "pincode",
    hideInEmployee: true,
    key: "address",
    texts: {
      header: "TL_GEOLOACTION_HEADER",
      cardText: "TL_GEOLOCATION_TEXT",
      nextText: "CS_COMMON_NEXT",
      skipAndContinueText: "CORE_COMMON_SKIP_CONTINUE"
    }
  }, {
    route: "pincode",
    component: "TLSelectPincode",
    texts: {
      headerCaption: "TL_LOCATION_CAPTION",
      header: "TL_PINCODE_HEADER",
      cardText: "TL_PINCODE_TEXT",
      submitBarLabel: "CS_COMMON_NEXT",
      skipText: "CORE_COMMON_SKIP_CONTINUE"
    },
    withoutLabel: true,
    key: "address",
    nextStep: "address",
    type: "component"
  }, {
    route: "address",
    component: "TLSelectAddress",
    withoutLabel: true,
    texts: {
      headerCaption: "TL_LOCATION_CAPTION",
      header: "TL_ADDRESS_HEADER",
      cardText: "TL_ADDRESS_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    key: "address",
    nextStep: "street",
    isMandatory: true,
    type: "component"
  }, {
    type: "component",
    route: "street",
    component: "SelectStreet",
    key: "address",
    withoutLabel: true,
    hideInEmployee: true,
    texts: {
      headerCaption: "TL_LOCATION_CAPTION",
      header: "TL_ADDRESS_HEADER",
      cardText: "TL_STREET_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    inputs: [{
      label: "TL_LOCALIZATION_STREET_NAME",
      type: "text",
      name: "street",
      disable: window.location.href.includes("edit-application") || window.location.href.includes("renew-trade"),
      validation: {
        maxlength: 256,
        title: "CORE_COMMON_STREET_INVALID"
      }
    }, {
      label: "TL_LOCALIZATION_BUILDING_NO",
      type: "text",
      name: "doorNo",
      disable: window.location.href.includes("edit-application") || window.location.href.includes("renew-trade"),
      validation: {
        maxlength: 256,
        title: "CORE_COMMON_DOOR_INVALID"
      }
    }],
    nextStep: "landmark"
  }, {
    type: "component",
    component: "SelectStreet",
    key: "address",
    withoutLabel: true,
    hideInCitizen: true,
    texts: {
      headerCaption: "TL_LOCATION_CAPTION",
      header: "TL_ADDRESS_HEADER",
      cardText: "TL_STREET_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    inputs: [{
      label: "TL_LOCALIZATION_BUILDING_NO",
      type: "text",
      name: "doorNo",
      validation: {
        maxlength: 256,
        title: "CORE_COMMON_DOOR_INVALID"
      }
    }, {
      label: "TL_LOCALIZATION_STREET_NAME",
      type: "text",
      name: "street",
      validation: {
        maxlength: 256,
        title: "CORE_COMMON_STREET_INVALID"
      }
    }]
  }, {
    type: "component",
    route: "landmark",
    component: "SelectLandmark",
    withoutLabel: true,
    texts: {
      headerCaption: "TL_LOCATION_CAPTION",
      header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_PROVIDE_LANDMARK_TITLE",
      cardText: "TL_LANDMARK_TEXT",
      submitBarLabel: "CS_COMMON_NEXT",
      skipText: "CORE_COMMON_SKIP_CONTINUE"
    },
    key: "address",
    nextStep: "owner-ship-details",
    hideInEmployee: true
  }, {
    type: "component",
    route: "proof",
    component: "Proof",
    withoutLabel: true,
    texts: {
      headerCaption: "TL_OWNERS_DETAILS",
      header: "TL_OWNERS_PHOTOGRAPH_HEADER",
      cardText: "",
      nextText: "CS_COMMON_NEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    key: "owners",
    nextStep: null,
    hideInEmployee: true
  }]
}, {
  head: "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT",
  body: [{
    route: "info",
    component: "TradeLicense",
    nextStep: "TradeName",
    hideInEmployee: true,
    key: "tl"
  }, {
    route: "TradeName",
    component: "SelectTradeName",
    texts: {
      headerCaption: "",
      header: "TL_TRADE_NAME_HEADER",
      cardText: "TL_TARDE_NAME_TEXT",
      submitBarLabel: "CS_COMMON_NEXT",
      skipText: ""
    },
    withoutLabel: true,
    key: "TradeDetails",
    nextStep: "structure-type",
    type: "component",
    hideInEmployee: true
  }, {
    type: "component",
    route: "structure-type",
    isMandatory: true,
    component: "SelectStructureType",
    texts: {
      headerCaption: "TL_STRUCTURE_TYPE",
      header: "TL_STRUCTURE_TYPE_HEADER",
      cardText: "TL_STRUCTURE_TYPE_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    key: "TradeDetails",
    withoutLabel: true,
    hideInEmployee: true,
    nextStep: {
      "TL_COMMON_YES": "Building-type",
      "TL_COMMON_NO": "vehicle-type"
    }
  }, {
    type: "component",
    route: "vehicle-type",
    isMandatory: true,
    component: "SelectVehicleType",
    texts: {
      headerCaption: "TL_STRUCTURE_SUBTYPE_CAPTION",
      header: "TL_VEHICLE_TYPE_HEADER",
      cardText: "TL_VEHICLE_TYPE_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    key: "TradeDetails",
    withoutLabel: true,
    hideInEmployee: true,
    nextStep: "commencement-date"
  }, {
    type: "component",
    route: "Building-type",
    isMandatory: true,
    component: "SelectBuildingType",
    texts: {
      headerCaption: "TL_STRUCTURE_SUBTYPE_CAPTION",
      header: "TL_BUILDING_TYPE_HEADER",
      cardText: "TL_BUILDING_TYPE_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    key: "TradeDetails",
    withoutLabel: true,
    hideInEmployee: true,
    nextStep: "commencement-date"
  }, {
    type: "component",
    route: "commencement-date",
    isMandatory: true,
    component: "SelectCommencementDate",
    texts: {
      headerCaption: "",
      header: "TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL",
      cardText: "TL_TRADE_COMM_DATE_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    key: "TradeDetails",
    withoutLabel: true,
    hideInEmployee: true,
    nextStep: "units-details"
  }, {
    isMandatory: true,
    type: "component",
    route: "units-details",
    key: "TradeDetails",
    component: "SelectTradeUnits",
    texts: {
      headerCaption: "",
      header: "TL_TRADE_UNITS_HEADER",
      cardText: "TL_TRADE_UNITS_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    withoutLabel: true,
    nextStep: "isAccessories",
    hideInEmployee: true
  }, {
    type: "component",
    route: "isAccessories",
    isMandatory: true,
    component: "SelectAccessories",
    texts: {
      headerCaption: "",
      header: "TL_ISACCESSORIES_HEADER",
      cardText: "TL_ISACCESSORIES_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    key: "TradeDetails",
    withoutLabel: true,
    hideInEmployee: true,
    nextStep: {
      TL_COMMON_YES: "accessories-details",
      TL_COMMON_NO: "map"
    }
  }, {
    isMandatory: true,
    type: "component",
    route: "accessories-details",
    key: "TradeDetails",
    component: "SelectAccessoriesDetails",
    texts: {
      headerCaption: "",
      header: "TL_TRADE_ACCESSORIES_HEADER",
      cardText: "TL_TRADE_ACCESSORIES_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    withoutLabel: true,
    nextStep: "map",
    hideInEmployee: true
  }]
}, {
  head: "ES_NEW_APPLICATION_OWNERSHIP_DETAILS",
  body: [{
    type: "component",
    route: "owner-ship-details",
    isMandatory: true,
    component: "SelectOwnerShipDetails",
    texts: {
      headerCaption: "TL_TRADE_OWNERSHIP_CAPTION",
      header: "TL_PROVIDE_OWNERSHIP_DETAILS",
      cardText: "TL_PROVIDE_OWNERSHI_DETAILS_SUB_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    key: "ownershipCategory",
    withoutLabel: true,
    nextStep: "owner-details"
  }, {
    isMandatory: true,
    type: "component",
    route: "owner-details",
    key: "owners",
    component: "SelectOwnerDetails",
    texts: {
      headerCaption: "",
      header: "TL_OWNERSHIP_INFO_SUB_HEADER",
      cardText: "TL_OWNER_DETAILS_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    withoutLabel: true,
    nextStep: "owner-address",
    hideInEmployee: true
  }, {
    type: "component",
    route: "owner-address",
    isMandatory: true,
    component: "SelectOwnerAddress",
    texts: {
      headerCaption: "TL_OWNERS_DETAILS",
      header: "TL_OWNERS_ADDRESS",
      cardText: "",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    key: "owners",
    withoutLabel: true,
    nextStep: "proof-of-identity",
    hideInEmployee: true
  }, {
    type: "component",
    route: "proof-of-identity",
    isMandatory: true,
    component: "SelectProofIdentity",
    texts: {
      headerCaption: "TL_OWNERS_DETAILS",
      header: "TL_PROOF_IDENTITY_HEADER",
      cardText: "",
      submitBarLabel: "CS_COMMON_NEXT",
      addMultipleText: "PT_COMMON_ADD_APPLICANT_LABEL"
    },
    key: "owners",
    withoutLabel: true,
    nextStep: "ownership-proof",
    hideInEmployee: true
  }, {
    type: "component",
    route: "ownership-proof",
    isMandatory: true,
    component: "SelectOwnershipProof",
    texts: {
      headerCaption: "TL_OWNERS_DETAILS",
      header: "TL_OWNERSHIP_DOCUMENT",
      cardText: "",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    key: "owners",
    withoutLabel: true,
    nextStep: "proof",
    hideInEmployee: true
  }, {
    type: "component",
    component: "TLOwnerDetailsEmployee",
    key: "owners",
    withoutLabel: true,
    hideInCitizen: true
  }]
}, {
  head: "TL_NEW_APPLICATION_DOCUMENTS_REQUIRED",
  body: [{
    component: "TLDocumentsEmployee",
    withoutLabel: true,
    key: "documents",
    type: "component",
    hideInCitizen: true
  }]
}];

var CreateTradeLicence = function CreateTradeLicence(_ref) {
  var queryClient = useQueryClient();
  var match = useRouteMatch();

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useLocation = useLocation(),
      pathname = _useLocation.pathname;

  var history = useHistory();
  var config = [];

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("PT_CREATE_TRADE", {}),
      params = _Digit$Hooks$useSessi[0],
      setParams = _Digit$Hooks$useSessi[1];

  var goNext = function goNext(skipStep, index, isAddMultiple, key) {
    var currentPath = pathname.split("/").pop(),
        nextPage;

    var _config$find = config.find(function (routeObj) {
      return routeObj.route === currentPath;
    }),
        _config$find$nextStep = _config$find.nextStep,
        nextStep = _config$find$nextStep === void 0 ? {} : _config$find$nextStep;

    if (typeof nextStep == "object" && nextStep != null) {
      if (nextStep[sessionStorage.getItem("isAccessories")] && (nextStep[sessionStorage.getItem("isAccessories")] === "accessories-details" || nextStep[sessionStorage.getItem("isAccessories")] === "map")) {
        nextStep = "" + nextStep[sessionStorage.getItem("isAccessories")];
      } else if (nextStep[sessionStorage.getItem("StructureType")]) {
        nextStep = "" + nextStep[sessionStorage.getItem("StructureType")];
      }
    }

    var redirectWithHistory = history.push;

    if (skipStep) {
      redirectWithHistory = history.replace;
    }

    if (isAddMultiple) {
      nextStep = key;
    }

    if (nextStep === null) {
      return redirectWithHistory(match.path + "/check");
    }

    nextPage = match.path + "/" + nextStep;
    redirectWithHistory(nextPage);
  };

  var createProperty = function createProperty() {
    try {
      history.push(match.path + "/acknowledgement");
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  function handleSelect(key, data, skipStep, index, isAddMultiple) {
    var _extends2;

    if (isAddMultiple === void 0) {
      isAddMultiple = false;
    }

    setParams(_extends({}, params, (_extends2 = {}, _extends2[key] = _extends({}, params[key], data), _extends2)));
    goNext(skipStep, index, isAddMultiple, key);
  }

  var handleSkip = function handleSkip() {};

  var handleMultiple = function handleMultiple() {};

  var onSuccess = function onSuccess() {
    sessionStorage.removeItem("CurrentFinancialYear");
    queryClient.invalidateQueries("TL_CREATE_TRADE");
  };

  newConfig.forEach(function (obj) {
    config = config.concat(obj.body.filter(function (a) {
      return !a.hideInCitizen;
    }));
  });
  config.indexRoute = "info";
  return /*#__PURE__*/React.createElement(Switch, null, config.map(function (routeObj, index) {
    var component = routeObj.component,
        texts = routeObj.texts,
        inputs = routeObj.inputs,
        key = routeObj.key;
    var Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
    return /*#__PURE__*/React.createElement(Route, {
      path: match.path + "/" + routeObj.route,
      key: index
    }, /*#__PURE__*/React.createElement(Component, {
      config: {
        texts: texts,
        inputs: inputs,
        key: key
      },
      onSelect: handleSelect,
      onSkip: handleSkip,
      t: t,
      formData: params,
      onAdd: handleMultiple
    }));
  }), /*#__PURE__*/React.createElement(Route, {
    path: match.path + "/check"
  }, /*#__PURE__*/React.createElement(CheckPage, {
    onSubmit: createProperty,
    value: params
  })), /*#__PURE__*/React.createElement(Route, {
    path: match.path + "/acknowledgement"
  }, /*#__PURE__*/React.createElement(TLAcknowledgement, {
    data: params,
    onSuccess: onSuccess
  })), /*#__PURE__*/React.createElement(Route, null, /*#__PURE__*/React.createElement(Redirect, {
    to: match.path + "/" + config.indexRoute
  })));
};

var getPath$1 = function getPath(path, params) {
  params && Object.keys(params).map(function (key) {
    path = path.replace(":" + key, params[key]);
  });
  return path;
};

var getTradeEditDetails = function getTradeEditDetails(data) {
  var _data$tradeLicenseDet, _data$tradeLicenseDet2, _data$tradeLicenseDet3, _data$tradeLicenseDet4, _data$tradeLicenseDet5, _data$tradeLicenseDet6, _data$tradeLicenseDet7, _data$tradeLicenseDet8, _data$tradeLicenseDet9, _data$tradeLicenseDet10, _data$tradeLicenseDet11, _data$tradeLicenseDet12, _data$tradeLicenseDet13, _data$tradeLicenseDet20, _data$tradeLicenseDet21, _data$tradeLicenseDet22, _data$tradeLicenseDet23, _data$tradeLicenseDet24, _data$tradeLicenseDet25, _data$tradeLicenseDet26, _data$tradeLicenseDet27, _data$tradeLicenseDet28, _data$tradeLicenseDet29, _data$tradeLicenseDet30, _data$tradeLicenseDet31, _data$address, _data$address$localit, _data$tradeLicenseDet32, _data$tradeLicenseDet33, _data$tradeLicenseDet34, _data$tradeLicenseDet35, _data$tradeLicenseDet36, _data$tradeLicenseDet37, _data$tradeLicenseDet38, _data$tradeLicenseDet39, _data$tradeLicenseDet40, _data$tradeLicenseDet41;

  var gettradeaccessories = function gettradeaccessories(tradeacceserioies) {
    var acc = [];
    tradeacceserioies && tradeacceserioies.map(function (ob) {
      acc.push({
        accessory: {
          code: "" + ob.accessoryCategory,
          i18nKey: "TRADELICENSE_ACCESSORIESCATEGORY_" + ob.accessoryCategory.replaceAll("-", "_")
        },
        accessorycount: ob.count,
        unit: "" + ob.uom,
        uom: "" + ob.uomValue,
        id: ob.id
      });
    });
    return acc;
  };

  var gettradeunits = function gettradeunits(tradeunits) {
    var units = [];
    tradeunits && tradeunits.map(function (ob) {
      units.push({
        tradecategory: {
          i18nKey: "TRADELICENSE_TRADETYPE_" + ob.tradeType.split(".")[0],
          code: "" + ob.tradeType.split(".")[0]
        },
        tradesubtype: {
          i18nKey: "TL_" + ob.tradeType,
          code: "" + ob.tradeType
        },
        tradetype: {
          i18nKey: "TRADELICENSE_TRADETYPE_" + ob.tradeType.split(".")[1],
          code: "" + ob.tradeType.split(".")[1]
        },
        unit: ob.uom,
        uom: ob.uomValue,
        id: ob.id
      });
    });
    return units;
  };

  var gettradedocuments = function gettradedocuments(docs) {
    var documents = [];
    docs && docs.map(function (ob) {
      if (ob.documentType.includes("OWNERPHOTO")) {
        documents["OwnerPhotoProof"] = ob;
      } else if (ob.documentType.includes("OWNERIDPROOF")) {
        documents["ProofOfIdentity"] = ob;
      } else if (ob.documentType.includes("OWNERSHIPPROOF")) {
        documents["ProofOfOwnership"] = ob;
      }
    });
    return documents;
  };

  var gettradeowners = function gettradeowners(owner) {
    var ownerarray = [];
    owner && owner.map(function (ob) {
      ownerarray.push({
        gender: {
          code: "" + ob.gender,
          name: "" + (!(ob !== null && ob !== void 0 && ob.gender.includes("FEMALE")) ? "Male" : "Female"),
          value: "" + (!(ob !== null && ob !== void 0 && ob.gender.includes("FEMALE")) ? "Male" : "Female"),
          i18nKey: "TL_GENDER_" + ob.gender
        },
        isprimaryowner: false,
        name: ob.name,
        mobilenumber: ob.mobileNumber,
        permanentAddress: ob.permanentAddress,
        id: ob.id
      });
    });
    return ownerarray;
  };

  data.TradeDetails = {
    BuildingType: {
      code: "" + (data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet = data.tradeLicenseDetail) === null || _data$tradeLicenseDet === void 0 ? void 0 : _data$tradeLicenseDet.structureType),
      i18nKey: "COMMON_MASTERS_STRUCTURETYPE_" + ((_data$tradeLicenseDet2 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet2 === void 0 ? void 0 : _data$tradeLicenseDet2.structureType.replaceAll(".", "_"))
    },
    CommencementDate: getCommencementDataFormat(data === null || data === void 0 ? void 0 : data.commencementDate),
    StructureType: {
      code: "" + ((_data$tradeLicenseDet3 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet3 === void 0 ? void 0 : _data$tradeLicenseDet3.structureType.split(".")[0]),
      i18nKey: "" + ((_data$tradeLicenseDet4 = data.tradeLicenseDetail) !== null && _data$tradeLicenseDet4 !== void 0 && _data$tradeLicenseDet4.structureType.includes("IMMOVABLE") ? "TL_COMMON_YES" : "TL_COMMON_NO")
    },
    TradeName: data === null || data === void 0 ? void 0 : data.tradeName,
    accessories: gettradeaccessories(data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet5 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet5 === void 0 ? void 0 : _data$tradeLicenseDet5.accessories),
    isAccessories: gettradeaccessories(data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet6 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet6 === void 0 ? void 0 : _data$tradeLicenseDet6.accessories).length > 0 ? {
      code: "ACCESSORY",
      i18nKey: "TL_COMMON_YES"
    } : {
      code: "NONACCESSORY",
      i18nKey: "TL_COMMON_NO"
    },
    units: gettradeunits(data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet7 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet7 === void 0 ? void 0 : _data$tradeLicenseDet7.tradeUnits)
  };
  data.address = {};

  if (data !== null && data !== void 0 && (_data$tradeLicenseDet8 = data.tradeLicenseDetail) !== null && _data$tradeLicenseDet8 !== void 0 && (_data$tradeLicenseDet9 = _data$tradeLicenseDet8.address) !== null && _data$tradeLicenseDet9 !== void 0 && (_data$tradeLicenseDet10 = _data$tradeLicenseDet9.geoLocation) !== null && _data$tradeLicenseDet10 !== void 0 && _data$tradeLicenseDet10.latitude && data !== null && data !== void 0 && (_data$tradeLicenseDet11 = data.tradeLicenseDetail) !== null && _data$tradeLicenseDet11 !== void 0 && (_data$tradeLicenseDet12 = _data$tradeLicenseDet11.address) !== null && _data$tradeLicenseDet12 !== void 0 && (_data$tradeLicenseDet13 = _data$tradeLicenseDet12.geoLocation) !== null && _data$tradeLicenseDet13 !== void 0 && _data$tradeLicenseDet13.longitude) {
    var _data$tradeLicenseDet14, _data$tradeLicenseDet15, _data$tradeLicenseDet16, _data$tradeLicenseDet17, _data$tradeLicenseDet18, _data$tradeLicenseDet19;

    data.address.geoLocation = {
      latitude: data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet14 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet14 === void 0 ? void 0 : (_data$tradeLicenseDet15 = _data$tradeLicenseDet14.address) === null || _data$tradeLicenseDet15 === void 0 ? void 0 : (_data$tradeLicenseDet16 = _data$tradeLicenseDet15.geoLocation) === null || _data$tradeLicenseDet16 === void 0 ? void 0 : _data$tradeLicenseDet16.latitude,
      longitude: data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet17 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet17 === void 0 ? void 0 : (_data$tradeLicenseDet18 = _data$tradeLicenseDet17.address) === null || _data$tradeLicenseDet18 === void 0 ? void 0 : (_data$tradeLicenseDet19 = _data$tradeLicenseDet18.geoLocation) === null || _data$tradeLicenseDet19 === void 0 ? void 0 : _data$tradeLicenseDet19.longitude
    };
  } else {
    data.address.geoLocation = {};
  }

  data.address.doorNo = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet20 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet20 === void 0 ? void 0 : (_data$tradeLicenseDet21 = _data$tradeLicenseDet20.address) === null || _data$tradeLicenseDet21 === void 0 ? void 0 : _data$tradeLicenseDet21.doorNo;
  data.address.street = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet22 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet22 === void 0 ? void 0 : (_data$tradeLicenseDet23 = _data$tradeLicenseDet22.address) === null || _data$tradeLicenseDet23 === void 0 ? void 0 : _data$tradeLicenseDet23.street;
  data.address.landmark = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet24 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet24 === void 0 ? void 0 : (_data$tradeLicenseDet25 = _data$tradeLicenseDet24.address) === null || _data$tradeLicenseDet25 === void 0 ? void 0 : _data$tradeLicenseDet25.landmark;
  data.address.pincode = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet26 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet26 === void 0 ? void 0 : (_data$tradeLicenseDet27 = _data$tradeLicenseDet26.address) === null || _data$tradeLicenseDet27 === void 0 ? void 0 : _data$tradeLicenseDet27.pincode;
  data.address.city = {
    code: data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet28 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet28 === void 0 ? void 0 : (_data$tradeLicenseDet29 = _data$tradeLicenseDet28.address) === null || _data$tradeLicenseDet29 === void 0 ? void 0 : _data$tradeLicenseDet29.tenantId
  };
  data.address.locality = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet30 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet30 === void 0 ? void 0 : (_data$tradeLicenseDet31 = _data$tradeLicenseDet30.address) === null || _data$tradeLicenseDet31 === void 0 ? void 0 : _data$tradeLicenseDet31.locality;
  data.address.locality.i18nkey = (data === null || data === void 0 ? void 0 : data.tenantId.replace(".", "_").toUpperCase()) + "_" + "REVENUE" + "_" + (data === null || data === void 0 ? void 0 : (_data$address = data.address) === null || _data$address === void 0 ? void 0 : (_data$address$localit = _data$address.locality) === null || _data$address$localit === void 0 ? void 0 : _data$address$localit.code);
  data.address.locality.doorNo = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet32 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet32 === void 0 ? void 0 : (_data$tradeLicenseDet33 = _data$tradeLicenseDet32.address) === null || _data$tradeLicenseDet33 === void 0 ? void 0 : _data$tradeLicenseDet33.doorNo;
  data.address.locality.landmark = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet34 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet34 === void 0 ? void 0 : (_data$tradeLicenseDet35 = _data$tradeLicenseDet34.address) === null || _data$tradeLicenseDet35 === void 0 ? void 0 : _data$tradeLicenseDet35.landmark;
  data.owners = {
    documents: gettradedocuments(data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet36 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet36 === void 0 ? void 0 : _data$tradeLicenseDet36.applicationDocuments),
    owners: gettradeowners(data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet37 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet37 === void 0 ? void 0 : _data$tradeLicenseDet37.owners),
    permanentAddress: data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet38 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet38 === void 0 ? void 0 : _data$tradeLicenseDet38.owners[0].permanentAddress,
    isCorrespondenceAddress: false
  };
  data.ownershipCategory = {
    code: "" + (data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet39 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet39 === void 0 ? void 0 : _data$tradeLicenseDet39.subOwnerShipCategory),
    i18nKey: "PT_OWNERSHIP_" + (data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet40 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet40 === void 0 ? void 0 : _data$tradeLicenseDet40.subOwnerShipCategory.split(".")[1]),
    value: "" + (data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet41 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet41 === void 0 ? void 0 : _data$tradeLicenseDet41.subOwnerShipCategory)
  };
  return data;
};

var EditTrade = function EditTrade(_ref) {
  var queryClient = useQueryClient();
  var match = useRouteMatch();

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useParams = useParams(),
      licenseNo = _useParams.id,
      tenantId = _useParams.tenantId;

  var _useLocation = useLocation(),
      pathname = _useLocation.pathname;

  var history = useHistory();
  var config = [];
  var application = {};

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("TL_EDIT_TRADE", {}),
      params = _Digit$Hooks$useSessi[0],
      setParams = _Digit$Hooks$useSessi[1];

  var filter1 = {};
  if (licenseNo) filter1.applicationNumber = licenseNo;
  if (tenantId) filter1.tenantId = tenantId;

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseSearch({
    filters: filter1
  }, {
    filters: filter1
  }),
      isLoading = _Digit$Hooks$tl$useTr.isLoading,
      data = _Digit$Hooks$tl$useTr.data;

  var editProperty = window.location.href.includes("edit");
  var tlTrade = JSON.parse(sessionStorage.getItem("tl-trade")) || {};
  useEffect(function () {
    application = (data === null || data === void 0 ? void 0 : data.Licenses) && data.Licenses[0] && data.Licenses[0];

    if (data && application) {
      application = data === null || data === void 0 ? void 0 : data.Licenses[0];

      if (editProperty) {
        application.isEditProperty = true;
      }

      sessionStorage.setItem("tradeInitialObject", JSON.stringify(_extends({}, application)));
      var tradeEditDetails = getTradeEditDetails(application);
      setParams(_extends({}, params, tradeEditDetails));
    }
  }, [data]);

  var goNext = function goNext(skipStep, index, isAddMultiple, key) {
    var currentPath = pathname.split("/").pop(),
        lastchar = currentPath.charAt(currentPath.length - 1),
        nextPage;

    var _config$find = config.find(function (routeObj) {
      return routeObj.route === currentPath;
    }),
        _config$find$nextStep = _config$find.nextStep,
        nextStep = _config$find$nextStep === void 0 ? {} : _config$find$nextStep;

    if (typeof nextStep == "object" && nextStep != null) {
      if (nextStep[sessionStorage.getItem("isAccessories")]) {
        nextStep = "" + nextStep[sessionStorage.getItem("isAccessories")];
      } else if (nextStep[sessionStorage.getItem("StructureType")]) {
        nextStep = "" + nextStep[sessionStorage.getItem("StructureType")];
      }
    }

    var redirectWithHistory = history.push;

    if (skipStep) {
      redirectWithHistory = history.replace;
    }

    if (isAddMultiple) {
      nextStep = key;
    }

    if (nextStep === null) {
      return redirectWithHistory(getPath$1(match.path, match.params) + "/check");
    }

    nextPage = getPath$1(match.path, match.params) + "/" + nextStep;
    redirectWithHistory(nextPage);
  };

  var createProperty = function createProperty() {
    try {
      history.push(getPath$1(match.path, match.params) + "/acknowledgement");
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  function handleSelect(key, data, skipStep, index, isAddMultiple) {
    var _extends2;

    if (isAddMultiple === void 0) {
      isAddMultiple = false;
    }

    setParams(_extends({}, params, (_extends2 = {}, _extends2[key] = _extends({}, params[key], data), _extends2)));
    goNext(skipStep, index, isAddMultiple, key);
  }

  var handleSkip = function handleSkip() {};

  var handleMultiple = function handleMultiple() {};

  var onSuccess = function onSuccess() {
    queryClient.invalidateQueries("TL_EDIT_TRADE");
  };

  newConfig.forEach(function (obj) {
    config = config.concat(obj.body.filter(function (a) {
      return !a.hideInCitizen;
    }));
  });
  config.indexRoute = "check";

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement(Switch, null, config.map(function (routeObj, index) {
    var component = routeObj.component,
        texts = routeObj.texts,
        inputs = routeObj.inputs,
        key = routeObj.key;
    var Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
    return /*#__PURE__*/React.createElement(Route, {
      path: getPath$1(match.path, match.params) + "/" + routeObj.route,
      key: index
    }, /*#__PURE__*/React.createElement(Component, {
      config: {
        texts: texts,
        inputs: inputs,
        key: key
      },
      onSelect: handleSelect,
      onSkip: handleSkip,
      t: t,
      formData: params,
      onAdd: handleMultiple
    }));
  }), /*#__PURE__*/React.createElement(Route, {
    path: getPath$1(match.path, match.params) + "/check"
  }, /*#__PURE__*/React.createElement(CheckPage, {
    onSubmit: createProperty,
    value: params
  })), /*#__PURE__*/React.createElement(Route, {
    path: getPath$1(match.path, match.params) + "/acknowledgement"
  }, /*#__PURE__*/React.createElement(TLAcknowledgement, {
    data: params,
    onSuccess: onSuccess
  })), /*#__PURE__*/React.createElement(Route, null, /*#__PURE__*/React.createElement(Redirect, {
    to: getPath$1(match.path, match.params) + "/" + config.indexRoute
  })));
};

var TLList = function TLList() {
  var _newapplicationlist, _newapplicationlist2;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var userInfo = Digit.UserService.getUser();

  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
      licenseno = _Digit$Hooks$useQuery.LicenseNumber,
      tenantID = _Digit$Hooks$useQuery.tenantId;

  var filter1 = {};
  if (licenseno) filter1.licenseNumbers = licenseno;
  if (licenseno) filter1.tenantId = tenantID;

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseSearch({
    filters: filter1
  }, {}),
      isLoading = _Digit$Hooks$tl$useTr.isLoading,
      data = _Digit$Hooks$tl$useTr.data;

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  var _ref = data || {},
      applicationsList = _ref.Licenses;

  var applications = {};
  applicationsList.filter(function (response) {
    return response.licenseNumber;
  }).map(function (ob) {
    if (applications[ob.licenseNumber]) {
      if (applications[ob.licenseNumber].applicationDate < ob.applicationDate) applications[ob.licenseNumber] = ob;
    } else applications[ob.licenseNumber] = ob;
  });
  var newapplicationlist = Object.values(applications);
  newapplicationlist = newapplicationlist ? newapplicationlist.filter(function (ele) {
    return ele.financialYear != "2021-22" && (ele.status == "EXPIRED" || ele.status == "APPROVED");
  }) : [];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, "" + t("TL_RENEW_TRADE_HEADER")), /*#__PURE__*/React.createElement(CardText, null, "" + t("TL_RENEW_TRADE_TEXT"))), /*#__PURE__*/React.createElement("div", null, ((_newapplicationlist = newapplicationlist) === null || _newapplicationlist === void 0 ? void 0 : _newapplicationlist.length) > 0 && newapplicationlist.map(function (application, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: index
    }, /*#__PURE__*/React.createElement(TradeLicenseList, {
      application: application
    }));
  }), !((_newapplicationlist2 = newapplicationlist) !== null && _newapplicationlist2 !== void 0 && _newapplicationlist2.length) > 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      marginLeft: "16px",
      marginTop: "16px"
    }
  }, t("PT_NO_APPLICATION_FOUND_MSG"))));
};

var getPath$2 = function getPath(path, params) {
  params && Object.keys(params).map(function (key) {
    path = path.replace(":" + key, params[key]);
  });
  return path;
};

var getTradeEditDetails$1 = function getTradeEditDetails(data) {
  var _data$tradeLicenseDet, _data$tradeLicenseDet2, _data$tradeLicenseDet3, _data$tradeLicenseDet4, _data$tradeLicenseDet5, _data$tradeLicenseDet6, _data$tradeLicenseDet7, _data$tradeLicenseDet8, _data$tradeLicenseDet9, _data$tradeLicenseDet10, _data$tradeLicenseDet11, _data$tradeLicenseDet12, _data$tradeLicenseDet13, _data$tradeLicenseDet20, _data$tradeLicenseDet21, _data$tradeLicenseDet22, _data$tradeLicenseDet23, _data$tradeLicenseDet24, _data$tradeLicenseDet25, _data$tradeLicenseDet26, _data$tradeLicenseDet27, _data$tradeLicenseDet28, _data$tradeLicenseDet29, _data$tradeLicenseDet30, _data$tradeLicenseDet31, _data$address, _data$address$localit, _data$tradeLicenseDet32, _data$tradeLicenseDet33, _data$tradeLicenseDet34, _data$tradeLicenseDet35, _data$tradeLicenseDet36, _data$tradeLicenseDet37, _data$tradeLicenseDet38, _data$tradeLicenseDet39, _data$tradeLicenseDet40, _data$tradeLicenseDet41;

  var gettradeaccessories = function gettradeaccessories(tradeacceserioies) {
    var acc = [];
    tradeacceserioies && tradeacceserioies.map(function (ob) {
      acc.push({
        accessory: {
          code: "" + ob.accessoryCategory,
          i18nKey: "TRADELICENSE_ACCESSORIESCATEGORY_" + ob.accessoryCategory.replaceAll("-", "_")
        },
        accessorycount: ob.count,
        unit: "" + ob.uom,
        uom: "" + ob.uomValue,
        id: ob.id
      });
    });
    return acc;
  };

  var gettradeunits = function gettradeunits(tradeunits) {
    var units = [];
    tradeunits && tradeunits.map(function (ob) {
      units.push({
        tradecategory: {
          i18nKey: "TRADELICENSE_TRADETYPE_" + ob.tradeType.split(".")[0],
          code: "" + ob.tradeType.split(".")[0]
        },
        tradesubtype: {
          i18nKey: "TL_" + ob.tradeType,
          code: "" + ob.tradeType
        },
        tradetype: {
          i18nKey: "TRADELICENSE_TRADETYPE_" + ob.tradeType.split(".")[1],
          code: "" + ob.tradeType.split(".")[1]
        },
        unit: ob.uom,
        uom: ob.uomValue,
        id: ob.id
      });
    });
    return units;
  };

  var gettradedocuments = function gettradedocuments(docs) {
    var documents = [];
    docs && docs.map(function (ob) {
      if (ob.documentType.includes("OWNERPHOTO")) {
        documents["OwnerPhotoProof"] = ob;
      } else if (ob.documentType.includes("OWNERIDPROOF")) {
        documents["ProofOfIdentity"] = ob;
      } else if (ob.documentType.includes("OWNERSHIPPROOF")) {
        documents["ProofOfOwnership"] = ob;
      }
    });
    return documents;
  };

  var gettradeowners = function gettradeowners(owner) {
    var ownerarray = [];
    owner && owner.map(function (ob) {
      ownerarray.push({
        gender: {
          code: "" + ob.gender,
          name: "" + (!(ob !== null && ob !== void 0 && ob.gender.includes("FEMALE")) ? "Male" : "Female"),
          value: "" + (!(ob !== null && ob !== void 0 && ob.gender.includes("FEMALE")) ? "Male" : "Female"),
          i18nKey: "TL_GENDER_" + ob.gender
        },
        isprimaryowner: false,
        name: ob.name,
        mobilenumber: ob.mobileNumber,
        permanentAddress: ob.permanentAddress,
        id: ob.id
      });
    });
    return ownerarray;
  };

  data.TradeDetails = {
    BuildingType: {
      code: "" + (data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet = data.tradeLicenseDetail) === null || _data$tradeLicenseDet === void 0 ? void 0 : _data$tradeLicenseDet.structureType),
      i18nKey: "COMMON_MASTERS_STRUCTURETYPE_" + ((_data$tradeLicenseDet2 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet2 === void 0 ? void 0 : _data$tradeLicenseDet2.structureType.replaceAll(".", "_"))
    },
    CommencementDate: getCommencementDataFormat(data === null || data === void 0 ? void 0 : data.commencementDate),
    StructureType: {
      code: "" + ((_data$tradeLicenseDet3 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet3 === void 0 ? void 0 : _data$tradeLicenseDet3.structureType.split(".")[0]),
      i18nKey: "" + ((_data$tradeLicenseDet4 = data.tradeLicenseDetail) !== null && _data$tradeLicenseDet4 !== void 0 && _data$tradeLicenseDet4.structureType.includes("IMMOVABLE") ? "TL_COMMON_YES" : "TL_COMMON_NO")
    },
    TradeName: data === null || data === void 0 ? void 0 : data.tradeName,
    accessories: gettradeaccessories(data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet5 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet5 === void 0 ? void 0 : _data$tradeLicenseDet5.accessories),
    isAccessories: gettradeaccessories(data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet6 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet6 === void 0 ? void 0 : _data$tradeLicenseDet6.accessories).length > 0 ? {
      code: "ACCESSORY",
      i18nKey: "TL_COMMON_YES"
    } : {
      code: "NONACCESSORY",
      i18nKey: "TL_COMMON_NO"
    },
    units: gettradeunits(data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet7 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet7 === void 0 ? void 0 : _data$tradeLicenseDet7.tradeUnits)
  };
  data.address = {};

  if (data !== null && data !== void 0 && (_data$tradeLicenseDet8 = data.tradeLicenseDetail) !== null && _data$tradeLicenseDet8 !== void 0 && (_data$tradeLicenseDet9 = _data$tradeLicenseDet8.address) !== null && _data$tradeLicenseDet9 !== void 0 && (_data$tradeLicenseDet10 = _data$tradeLicenseDet9.geoLocation) !== null && _data$tradeLicenseDet10 !== void 0 && _data$tradeLicenseDet10.latitude && data !== null && data !== void 0 && (_data$tradeLicenseDet11 = data.tradeLicenseDetail) !== null && _data$tradeLicenseDet11 !== void 0 && (_data$tradeLicenseDet12 = _data$tradeLicenseDet11.address) !== null && _data$tradeLicenseDet12 !== void 0 && (_data$tradeLicenseDet13 = _data$tradeLicenseDet12.geoLocation) !== null && _data$tradeLicenseDet13 !== void 0 && _data$tradeLicenseDet13.longitude) {
    var _data$tradeLicenseDet14, _data$tradeLicenseDet15, _data$tradeLicenseDet16, _data$tradeLicenseDet17, _data$tradeLicenseDet18, _data$tradeLicenseDet19;

    data.address.geoLocation = {
      latitude: data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet14 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet14 === void 0 ? void 0 : (_data$tradeLicenseDet15 = _data$tradeLicenseDet14.address) === null || _data$tradeLicenseDet15 === void 0 ? void 0 : (_data$tradeLicenseDet16 = _data$tradeLicenseDet15.geoLocation) === null || _data$tradeLicenseDet16 === void 0 ? void 0 : _data$tradeLicenseDet16.latitude,
      longitude: data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet17 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet17 === void 0 ? void 0 : (_data$tradeLicenseDet18 = _data$tradeLicenseDet17.address) === null || _data$tradeLicenseDet18 === void 0 ? void 0 : (_data$tradeLicenseDet19 = _data$tradeLicenseDet18.geoLocation) === null || _data$tradeLicenseDet19 === void 0 ? void 0 : _data$tradeLicenseDet19.longitude
    };
  } else {
    data.address.geoLocation = {};
  }

  data.address.doorNo = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet20 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet20 === void 0 ? void 0 : (_data$tradeLicenseDet21 = _data$tradeLicenseDet20.address) === null || _data$tradeLicenseDet21 === void 0 ? void 0 : _data$tradeLicenseDet21.doorNo;
  data.address.street = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet22 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet22 === void 0 ? void 0 : (_data$tradeLicenseDet23 = _data$tradeLicenseDet22.address) === null || _data$tradeLicenseDet23 === void 0 ? void 0 : _data$tradeLicenseDet23.street;
  data.address.landmark = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet24 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet24 === void 0 ? void 0 : (_data$tradeLicenseDet25 = _data$tradeLicenseDet24.address) === null || _data$tradeLicenseDet25 === void 0 ? void 0 : _data$tradeLicenseDet25.landmark;
  data.address.pincode = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet26 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet26 === void 0 ? void 0 : (_data$tradeLicenseDet27 = _data$tradeLicenseDet26.address) === null || _data$tradeLicenseDet27 === void 0 ? void 0 : _data$tradeLicenseDet27.pincode;
  data.address.city = {
    code: data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet28 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet28 === void 0 ? void 0 : (_data$tradeLicenseDet29 = _data$tradeLicenseDet28.address) === null || _data$tradeLicenseDet29 === void 0 ? void 0 : _data$tradeLicenseDet29.tenantId
  };
  data.address.locality = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet30 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet30 === void 0 ? void 0 : (_data$tradeLicenseDet31 = _data$tradeLicenseDet30.address) === null || _data$tradeLicenseDet31 === void 0 ? void 0 : _data$tradeLicenseDet31.locality;
  data.address.locality.i18nkey = (data === null || data === void 0 ? void 0 : data.tenantId.replace(".", "_").toUpperCase()) + "_" + "REVENUE" + "_" + (data === null || data === void 0 ? void 0 : (_data$address = data.address) === null || _data$address === void 0 ? void 0 : (_data$address$localit = _data$address.locality) === null || _data$address$localit === void 0 ? void 0 : _data$address$localit.code);
  data.address.locality.doorNo = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet32 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet32 === void 0 ? void 0 : (_data$tradeLicenseDet33 = _data$tradeLicenseDet32.address) === null || _data$tradeLicenseDet33 === void 0 ? void 0 : _data$tradeLicenseDet33.doorNo;
  data.address.locality.landmark = data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet34 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet34 === void 0 ? void 0 : (_data$tradeLicenseDet35 = _data$tradeLicenseDet34.address) === null || _data$tradeLicenseDet35 === void 0 ? void 0 : _data$tradeLicenseDet35.landmark;
  data.owners = {
    documents: gettradedocuments(data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet36 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet36 === void 0 ? void 0 : _data$tradeLicenseDet36.applicationDocuments),
    owners: gettradeowners(data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet37 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet37 === void 0 ? void 0 : _data$tradeLicenseDet37.owners),
    permanentAddress: data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet38 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet38 === void 0 ? void 0 : _data$tradeLicenseDet38.owners[0].permanentAddress,
    isCorrespondenceAddress: false
  };
  data.ownershipCategory = {
    code: "" + (data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet39 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet39 === void 0 ? void 0 : _data$tradeLicenseDet39.subOwnerShipCategory),
    i18nKey: "PT_OWNERSHIP_" + (data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet40 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet40 === void 0 ? void 0 : _data$tradeLicenseDet40.subOwnerShipCategory.split(".")[1]),
    value: "" + (data === null || data === void 0 ? void 0 : (_data$tradeLicenseDet41 = data.tradeLicenseDetail) === null || _data$tradeLicenseDet41 === void 0 ? void 0 : _data$tradeLicenseDet41.subOwnerShipCategory)
  };
  return data;
};

var RenewTrade = function RenewTrade(_ref) {
  var queryClient = useQueryClient();
  var match = useRouteMatch();

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useParams = useParams(),
      licenseNo = _useParams.id,
      tenantId = _useParams.tenantId;

  var _useLocation = useLocation(),
      pathname = _useLocation.pathname;

  var history = useHistory();
  var config = [];
  var application = {};

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("TL_RENEW_TRADE", {}),
      params = _Digit$Hooks$useSessi[0],
      setParams = _Digit$Hooks$useSessi[1];

  var filter1 = {};
  if (licenseNo) filter1.licenseNumbers = licenseNo;
  if (tenantId) filter1.tenantId = tenantId;

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseSearch({
    filters: filter1
  }, {
    filters: filter1
  }),
      isLoading = _Digit$Hooks$tl$useTr.isLoading,
      data = _Digit$Hooks$tl$useTr.data;

  var editProperty = window.location.href.includes("edit");
  var tlTrade = JSON.parse(sessionStorage.getItem("tl-trade")) || {};
  useEffect(function () {
    application = (data === null || data === void 0 ? void 0 : data.Licenses) && data.Licenses[0] && data.Licenses[0];

    if (data && application) {
      application = data === null || data === void 0 ? void 0 : data.Licenses[0];

      if (editProperty) {
        application.isEditProperty = true;
      }

      sessionStorage.setItem("tradeInitialObject", JSON.stringify(_extends({}, application)));
      var tradeEditDetails = getTradeEditDetails$1(application);
      setParams(_extends({}, params, tradeEditDetails));
    }
  }, [data]);

  var goNext = function goNext(skipStep, index, isAddMultiple, key) {
    var currentPath = pathname.split("/").pop(),
        lastchar = currentPath.charAt(currentPath.length - 1),
        nextPage;

    var _config$find = config.find(function (routeObj) {
      return routeObj.route === currentPath;
    }),
        _config$find$nextStep = _config$find.nextStep,
        nextStep = _config$find$nextStep === void 0 ? {} : _config$find$nextStep;

    if (typeof nextStep == "object" && nextStep != null) {
      if (nextStep[sessionStorage.getItem("isAccessories")]) {
        nextStep = "" + nextStep[sessionStorage.getItem("isAccessories")];
      } else if (nextStep[sessionStorage.getItem("StructureType")]) {
        nextStep = "" + nextStep[sessionStorage.getItem("StructureType")];
      }
    }

    var redirectWithHistory = history.push;

    if (skipStep) {
      redirectWithHistory = history.replace;
    }

    if (isAddMultiple) {
      nextStep = key;
    }

    if (nextStep === null) {
      return redirectWithHistory(getPath$2(match.path, match.params) + "/check");
    }

    nextPage = getPath$2(match.path, match.params) + "/" + nextStep;
    redirectWithHistory(nextPage);
  };

  var createProperty = function createProperty() {
    try {
      history.push(getPath$2(match.path, match.params) + "/acknowledgement");
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  function handleSelect(key, data, skipStep, index, isAddMultiple) {
    var _extends2;

    if (isAddMultiple === void 0) {
      isAddMultiple = false;
    }

    setParams(_extends({}, params, (_extends2 = {}, _extends2[key] = _extends({}, params[key], data), _extends2)));
    goNext(skipStep, index, isAddMultiple, key);
  }

  var handleSkip = function handleSkip() {};

  var handleMultiple = function handleMultiple() {};

  var onSuccess = function onSuccess() {
    queryClient.invalidateQueries("TL_RENEW_TRADE");
  };

  newConfig.forEach(function (obj) {
    config = config.concat(obj.body.filter(function (a) {
      return !a.hideInCitizen;
    }));
  });
  config.indexRoute = "check";

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement(Switch, null, config.map(function (routeObj, index) {
    var component = routeObj.component,
        texts = routeObj.texts,
        inputs = routeObj.inputs,
        key = routeObj.key;
    var Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
    return /*#__PURE__*/React.createElement(Route, {
      path: getPath$2(match.path, match.params) + "/" + routeObj.route,
      key: index
    }, /*#__PURE__*/React.createElement(Component, {
      config: {
        texts: texts,
        inputs: inputs,
        key: key
      },
      onSelect: handleSelect,
      onSkip: handleSkip,
      t: t,
      formData: params,
      onAdd: handleMultiple
    }));
  }), /*#__PURE__*/React.createElement(Route, {
    path: getPath$2(match.path, match.params) + "/check"
  }, /*#__PURE__*/React.createElement(CheckPage, {
    onSubmit: createProperty,
    value: params
  })), /*#__PURE__*/React.createElement(Route, {
    path: getPath$2(match.path, match.params) + "/acknowledgement"
  }, /*#__PURE__*/React.createElement(TLAcknowledgement, {
    data: params,
    onSuccess: onSuccess
  })), /*#__PURE__*/React.createElement(Route, null, /*#__PURE__*/React.createElement(Redirect, {
    to: getPath$2(match.path, match.params) + "/" + config.indexRoute
  })));
};

var config = [{
  texts: {
    header: "TL_SEARCH_TRADE_HEADER",
    submitButtonLabel: "ES_COMMON_SEARCH",
    text: "TL_SEARCH_TEXT"
  },
  inputs: [{
    label: "TL_OWNER_MOB_NO_LABEL",
    type: "mobileNumber",
    name: "mobileNumber",
    error: "ERR_INVALID_MOBILE_NUMBER"
  }, {
    label: "TL_TRADE_LICENSE_LABEL",
    type: "text",
    name: "LicenseNum",
    error: "ERR_INVALID_TRADE_LICENSE_NO"
  }]
}];

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
var hasOwnProperty$a = Object.prototype.hasOwnProperty;
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
      if (hasOwnProperty$a.call(from, key)) {
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

var SearchTrade = function SearchTrade(_ref) {
  var _Digit$Hooks$tl$useTe;

  var propsConfig = _ref.config;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var history = useHistory();

  var _useState = useState(false),
      canSubmit = _useState[0],
      setCanSubmit = _useState[1];

  var userInfo = Digit.UserService.getUser();
  var user = userInfo === null || userInfo === void 0 ? void 0 : userInfo.info;
  var defaultMobileno = user.mobileNumber;
  var allCities = (_Digit$Hooks$tl$useTe = Digit.Hooks.tl.useTenants()) === null || _Digit$Hooks$tl$useTe === void 0 ? void 0 : _Digit$Hooks$tl$useTe.sort(function (a, b) {
    var _a$i18nKey, _a$i18nKey$localeComp;

    return a === null || a === void 0 ? void 0 : (_a$i18nKey = a.i18nKey) === null || _a$i18nKey === void 0 ? void 0 : (_a$i18nKey$localeComp = _a$i18nKey.localeCompare) === null || _a$i18nKey$localeComp === void 0 ? void 0 : _a$i18nKey$localeComp.call(_a$i18nKey, b === null || b === void 0 ? void 0 : b.i18nKey);
  });

  var _useState2 = useState(),
      cityCode = _useState2[0],
      setCityCode = _useState2[1];

  useLayoutEffect(function () {
    var getActionBar = function getActionBar() {
      var el = document.querySelector("div.action-bar-wrap");

      if (el) {
        el.style.position = "static";
        el.style.padding = "8px 0";
        el.style.boxShadow = "none";
        el.style.marginBottom = "16px";
      } else {
        setTimeout(function () {
          getActionBar();
        }, 100);
      }
    };

    getActionBar();
  }, []);

  var onTradeSearch = function onTradeSearch(data) {
    try {
      if (!data.mobileNumber && !data.LicenseNum) {
        alert(t("TL_ERROR_NEED_ONE_PARAM"));
      } else {
        history.push("/digit-ui/citizen/tl/tradelicence/renewal-list?mobileNumber=" + (data !== null && data !== void 0 && data.mobileNumber ? data === null || data === void 0 ? void 0 : data.mobileNumber : "") + "&LicenseNumber=" + (data !== null && data !== void 0 && data.LicenseNum ? data === null || data === void 0 ? void 0 : data.LicenseNum : "") + "&tenantId=" + (cityCode ? cityCode : ""));
      }

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var _propsConfig$inputs = propsConfig.inputs,
      mobileNumber = _propsConfig$inputs[0],
      tradelicense = _propsConfig$inputs[1];
  var config = [{
    body: [{
      label: "CORE_COMMON_CITY",
      isMandatory: true,
      type: "custom",
      populators: {
        name: "city",
        defaultValue: null,
        rules: {
          required: true
        },
        customProps: {
          t: t,
          isMendatory: true,
          option: [].concat(allCities),
          optionKey: "i18nKey"
        },
        component: function component(props, customProps) {
          return /*#__PURE__*/React.createElement(Dropdown, _extends({}, customProps, {
            selected: props.value,
            select: function select(d) {
              if (d.code !== cityCode) props.setValue("locality", null);
              props.onChange(d);
            }
          }));
        }
      }
    }, {
      label: mobileNumber.label,
      type: mobileNumber.type,
      populators: {
        name: mobileNumber.name,
        validation: {
          pattern: /^[6-9]{1}[0-9]{9}$ /
        }
      },
      disable: true,
      isMandatory: false
    }, {
      label: tradelicense.label,
      type: tradelicense.type,
      populators: {
        name: tradelicense.name
      },
      isMandatory: false
    }]
  }];

  var onFormValueChange = function onFormValueChange(setValue, data, formState) {
    var _data$mobileNumber$na;

    var mobileNumberLength = data === null || data === void 0 ? void 0 : (_data$mobileNumber$na = data[mobileNumber.name]) === null || _data$mobileNumber$na === void 0 ? void 0 : _data$mobileNumber$na.length;
    var Licenseno = data === null || data === void 0 ? void 0 : data[tradelicense.name];
    var city = data === null || data === void 0 ? void 0 : data.city;

    if ((city === null || city === void 0 ? void 0 : city.code) !== cityCode) {
      setCityCode(city === null || city === void 0 ? void 0 : city.code);
    }

    if (mobileNumberLength > 0 && mobileNumberLength < 10) setCanSubmit(false);else if (!city) setCanSubmit(false);else if (!Licenseno && !mobileNumberLength && !city) setCanSubmit(false);else setCanSubmit(true);
  };

  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "16px"
    }
  }, /*#__PURE__*/React.createElement(FormComposer, {
    onSubmit: onTradeSearch,
    noBoxShadow: true,
    inline: true,
    config: config,
    label: propsConfig.texts.submitButtonLabel,
    heading: propsConfig.texts.header,
    text: propsConfig.texts.text,
    cardStyle: {
      margin: "auto"
    },
    headingStyle: {
      fontSize: "32px",
      marginBottom: "16px",
      fontFamily: "Roboto Condensed,sans-serif"
    },
    isDisabled: !canSubmit,
    defaultValues: {
      mobileNumber: defaultMobileno
    },
    onFormValueChange: onFormValueChange
  }));
};

SearchTrade.propTypes = {
  loginParams: propTypes.any
};
SearchTrade.defaultProps = {
  loginParams: null
};

var SearchTrade$1 = function SearchTrade$1() {
  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useRouteMatch = useRouteMatch(),
      path = _useRouteMatch.path;

  var params = useMemo(function () {
    return config.map(function (step) {
      var texts = {};

      for (var key in step.texts) {
        texts[key] = t(step.texts[key]);
      }

      return _extends({}, step, {
        texts: texts
      });
    }, [config]);
  });
  return /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: "" + path,
    exact: true
  }, /*#__PURE__*/React.createElement(SearchTrade, {
    config: params[0]
  })));
};

var App = function App() {
  var _useRouteMatch = useRouteMatch(),
      path = _useRouteMatch.path,
      match = _objectWithoutPropertiesLoose(_useRouteMatch, ["path", "url"]);

  var isSuccessScreen = window.location.href.includes("acknowledgement");
  return /*#__PURE__*/React.createElement("span", {
    className: "tl-citizen"
  }, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(AppContainer, null, /*#__PURE__*/React.createElement(BackButton, {
    isSuccessScreen: isSuccessScreen
  }, "Back"), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/tradelicence/new-application",
    component: CreateTradeLicence
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/tradelicence/edit-application/:id/:tenantId",
    component: EditTrade
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/tradelicence/renew-trade/:id/:tenantId",
    component: RenewTrade
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/tradelicence/my-application",
    component: MyApplications
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/tradelicence/my-bills",
    component: function component() {
      return /*#__PURE__*/React.createElement(MyApplications, {
        view: "bills"
      });
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/tradelicence/tl-info",
    component: TradeLicense
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/tradelicence/application/:id/:tenantId",
    component: ApplicationDetails
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/tradelicence/renewal-list",
    component: TLList
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/tradelicence/trade-search",
    component: SearchTrade$1
  }))));
};

var InboxLinks = function InboxLinks(_ref) {
  var businessService = _ref.businessService,
      allLinks = _ref.allLinks,
      headerText = _ref.headerText;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState([]),
      links = _useState[0],
      setLinks = _useState[1];

  var userRoles = Digit.UserService.getUser().info.roles;
  useEffect(function () {
    var linksToShow = allLinks.filter(function (e) {
      return e.businessService === businessService;
    }).filter(function (_ref2) {
      var roles = _ref2.roles;
      return roles.some(function (e) {
        return userRoles.map(function (_ref3) {
          var code = _ref3.code;
          return code;
        }).includes(e);
      }) || !roles.length;
    });
    setLinks(linksToShow);
  }, []);

  var GetLogo = function GetLogo() {
    return /*#__PURE__*/React.createElement("div", {
      className: "header"
    }, /*#__PURE__*/React.createElement("span", {
      className: "logo"
    }, /*#__PURE__*/React.createElement(CaseIcon, null)), " ", /*#__PURE__*/React.createElement("span", {
      className: "text"
    }, t(headerText)));
  };

  return /*#__PURE__*/React.createElement(Card, {
    className: "employeeCard filter inboxLinks"
  }, /*#__PURE__*/React.createElement("div", {
    className: "complaint-links-container"
  }, GetLogo(), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, links.map(function (_ref4, index) {
    var link = _ref4.link,
        text = _ref4.text,
        _ref4$hyperlink = _ref4.hyperlink,
        hyperlink = _ref4$hyperlink === void 0 ? false : _ref4$hyperlink;
    return /*#__PURE__*/React.createElement("span", {
      className: "link",
      key: index
    }, hyperlink ? /*#__PURE__*/React.createElement("a", {
      href: link
    }, t(text)) : /*#__PURE__*/React.createElement(Link, {
      to: link
    }, t(text)));
  }))));
};

var ApplicationTable = function ApplicationTable(_ref) {
  var t = _ref.t,
      currentPage = _ref.currentPage,
      columns = _ref.columns,
      data = _ref.data,
      getCellProps = _ref.getCellProps,
      disableSort = _ref.disableSort,
      onSort = _ref.onSort,
      onNextPage = _ref.onNextPage,
      onPrevPage = _ref.onPrevPage,
      onPageSizeChange = _ref.onPageSizeChange,
      pageSizeLimit = _ref.pageSizeLimit,
      sortParams = _ref.sortParams,
      totalRecords = _ref.totalRecords;
  return /*#__PURE__*/React.createElement(Table, {
    t: t,
    data: data,
    currentPage: currentPage,
    columns: columns,
    getCellProps: getCellProps,
    onNextPage: onNextPage,
    onPrevPage: onPrevPage,
    pageSizeLimit: pageSizeLimit,
    disableSort: disableSort,
    onPageSizeChange: onPageSizeChange,
    onSort: onSort,
    sortParams: sortParams,
    totalRecords: totalRecords
  });
};

var fieldComponents = {
  date: DatePicker,
  mobileNumber: MobileNumber
};

var SearchApplication$1 = function SearchApplication(_ref) {
  var _searchFields$filter, _ref3;

  var onSearch = _ref.onSearch,
      type = _ref.type,
      onClose = _ref.onClose,
      searchFields = _ref.searchFields,
      searchParams = _ref.searchParams,
      isInboxPage = _ref.isInboxPage,
      _clearSearch = _ref.clearSearch;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useForm = useForm({
    defaultValues: searchParams
  }),
      handleSubmit = _useForm.handleSubmit,
      reset = _useForm.reset,
      watch = _useForm.watch,
      control = _useForm.control,
      setError = _useForm.setError,
      clearErrors = _useForm.clearErrors,
      formState = _useForm.formState;

  var form = watch();
  var mobileView = innerWidth <= 640;
  useEffect(function () {
    searchFields.forEach(function (_ref2) {
      var pattern = _ref2.pattern,
          name = _ref2.name,
          maxLength = _ref2.maxLength,
          minLength = _ref2.minLength,
          errorMessages = _ref2.errorMessages,
          el = _objectWithoutPropertiesLoose(_ref2, ["pattern", "name", "maxLength", "minLength", "errorMessages"]);

      var value = form[name];
      var error = formState.errors[name];

      if (pattern) {
        if (!new RegExp(pattern).test(value) && !error) setError(name, {
          type: "pattern",
          message: t(errorMessages === null || errorMessages === void 0 ? void 0 : errorMessages.pattern) || t("PATTERN_" + name.toUpperCase() + "_FAILED")
        });else if (new RegExp(pattern).test(value) && (error === null || error === void 0 ? void 0 : error.type) === "pattern") clearErrors([name]);
      }

      if (minLength) {
        if ((value === null || value === void 0 ? void 0 : value.length) < minLength && !error) setError(name, {
          type: "minLength",
          message: t((errorMessages === null || errorMessages === void 0 ? void 0 : errorMessages.minLength) || "MINLENGTH_" + name.toUpperCase() + "_FAILED")
        });else if ((value === null || value === void 0 ? void 0 : value.length) >= minLength && (error === null || error === void 0 ? void 0 : error.type) === "minLength") clearErrors([name]);
      }

      if (maxLength) {
        if ((value === null || value === void 0 ? void 0 : value.length) > maxLength && !error) setError(name, {
          type: "maxLength",
          message: t((errorMessages === null || errorMessages === void 0 ? void 0 : errorMessages.maxLength) || "MAXLENGTH_" + name.toUpperCase() + "_FAILED")
        });else if ((value === null || value === void 0 ? void 0 : value.length) <= maxLength && (error === null || error === void 0 ? void 0 : error.type) === "maxLength") clearErrors([name]);
      }
    });
  }, [form, formState, setError, clearErrors]);

  var onSubmitInput = function onSubmitInput(data) {
    if (data.mobileNumber.length == 0 || data.mobileNumber.length == 10) {
      if (!data.mobileNumber) {
        delete data.mobileNumber;
      }

      data.delete = [];
      searchFields.forEach(function (field) {
        if (!data[field.name]) data.delete.push(field.name);
      });
      onSearch(data);

      if (type === "mobile") {
        onClose();
      }
    }
  };

  function clearSearch() {
    var resetValues = searchFields.reduce(function (acc, field) {
      var _extends2;

      return _extends({}, acc, (_extends2 = {}, _extends2[field === null || field === void 0 ? void 0 : field.name] = "", _extends2));
    }, {});
    reset(resetValues);

    if (isInboxPage) {
      var _newParams = _extends({}, searchParams);

      _newParams.delete = [];
      searchFields.forEach(function (e) {
        _newParams.delete.push(e === null || e === void 0 ? void 0 : e.name);
      });
      onSearch(_extends({}, _newParams));
    } else {
      _clearSearch();
    }
  }

  var clearAll = function clearAll(mobileView) {
    var mobileViewStyles = mobileView ? {
      margin: 0
    } : {};
    return /*#__PURE__*/React.createElement(LinkLabel, {
      style: _extends({
        display: "inline"
      }, mobileViewStyles),
      onClick: clearSearch
    }, t("ES_COMMON_CLEAR_SEARCH"));
  };

  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmitInput)
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "search-container",
    style: {
      width: "auto",
      marginLeft: isInboxPage ? "24px" : "revert"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-complaint-container"
  }, (type === "mobile" || mobileView) && /*#__PURE__*/React.createElement("div", {
    className: "complaint-header"
  }, /*#__PURE__*/React.createElement("h2", null, t("ES_COMMON_SEARCH_BY")), /*#__PURE__*/React.createElement("span", {
    onClick: onClose
  }, /*#__PURE__*/React.createElement(CloseSvg, null))), /*#__PURE__*/React.createElement("div", {
    className: "complaint-input-container",
    style: {
      textAlign: "start"
    }
  }, searchFields === null || searchFields === void 0 ? void 0 : (_searchFields$filter = searchFields.filter(function (e) {
    return true;
  })) === null || _searchFields$filter === void 0 ? void 0 : _searchFields$filter.map(function (input, index) {
    var _formState$dirtyField, _formState$errors, _formState$errors$inp;

    return /*#__PURE__*/React.createElement("div", {
      key: input.name,
      className: "input-fields"
    }, /*#__PURE__*/React.createElement("span", {
      className: "complaint-input"
    }, /*#__PURE__*/React.createElement(Label, null, t(input.label)), !input.type ? /*#__PURE__*/React.createElement(Controller, {
      render: function render(props) {
        return /*#__PURE__*/React.createElement(TextInput, {
          onChange: props.onChange,
          value: props.value
        });
      },
      name: input.name,
      control: control,
      defaultValue: ""
    }) : /*#__PURE__*/React.createElement(Controller, {
      render: function render(props) {
        var Comp = fieldComponents === null || fieldComponents === void 0 ? void 0 : fieldComponents[input.type];
        return /*#__PURE__*/React.createElement(Comp, {
          onChange: props.onChange,
          value: props.value
        });
      },
      name: input.name,
      control: control,
      defaultValue: ""
    })), formState !== null && formState !== void 0 && (_formState$dirtyField = formState.dirtyFields) !== null && _formState$dirtyField !== void 0 && _formState$dirtyField[input.name] ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: "700",
        color: "rgba(212, 53, 28)",
        paddingLeft: "8px",
        marginTop: "-20px",
        fontSize: "12px"
      },
      className: "inbox-search-form-error"
    }, formState === null || formState === void 0 ? void 0 : (_formState$errors = formState.errors) === null || _formState$errors === void 0 ? void 0 : (_formState$errors$inp = _formState$errors[input.name]) === null || _formState$errors$inp === void 0 ? void 0 : _formState$errors$inp.message) : null);
  }), type === "desktop" && !mobileView && !isInboxPage && /*#__PURE__*/React.createElement("div", {
    className: "search-action-wrapper"
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    className: "submit-bar-search",
    label: t("ES_COMMON_SEARCH"),
    disabled: !!Object.keys(formState.errors).length || Object.keys(form).every(function (key) {
      return !(form !== null && form !== void 0 && form[key]);
    }),
    submit: true
  }), /*#__PURE__*/React.createElement("div", {
    style: (_ref3 = {
      width: "100%",
      textAlign: "right"
    }, _ref3["width"] = "240px", _ref3["textAlign"] = "right", _ref3.marginLeft = "96px", _ref3.marginTop = "8px", _ref3)
  }, clearAll())), isInboxPage && /*#__PURE__*/React.createElement("div", {
    className: "search-action-wrapper",
    style: {
      width: "100%"
    }
  }, type === "desktop" && !mobileView && /*#__PURE__*/React.createElement(SubmitBar, {
    className: "submit-bar-search",
    label: t("ES_COMMON_SEARCH"),
    submit: true
  }), type === "desktop" && !mobileView && /*#__PURE__*/React.createElement("span", {
    style: {
      paddingTop: "9px"
    },
    className: "clear-search"
  }, clearAll()))))), (type === "mobile" || mobileView) && /*#__PURE__*/React.createElement(ActionBar, {
    className: "clear-search-container"
  }, /*#__PURE__*/React.createElement("button", {
    className: "clear-search",
    style: {
      flex: 1
    }
  }, clearAll(mobileView)), /*#__PURE__*/React.createElement(SubmitBar, {
    disabled: !!Object.keys(formState.errors).length,
    label: t("ES_COMMON_SEARCH"),
    style: {
      flex: 1
    },
    submit: true
  }))));
};

var DesktopInbox = function DesktopInbox(_ref) {
  var _data$table, _data$table2;

  var filterComponent = _ref.filterComponent,
      isLoading = _ref.isLoading,
      props = _objectWithoutPropertiesLoose(_ref, ["tableConfig", "filterComponent", "columns", "isLoading"]);

  var data = props.data;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState(function () {
    var _Digit$ComponentRegis;

    return (_Digit$ComponentRegis = Digit.ComponentRegistryService) === null || _Digit$ComponentRegis === void 0 ? void 0 : _Digit$ComponentRegis.getComponent(filterComponent);
  }),
      FilterComponent = _useState[0];

  var GetCell = function GetCell(value) {
    return /*#__PURE__*/React.createElement("span", {
      className: "cell-text"
    }, value);
  };

  var GetSlaCell = function GetSlaCell(value) {
    if (isNaN(value)) return /*#__PURE__*/React.createElement("span", {
      className: "sla-cell-success"
    }, "0");
    return value < 0 ? /*#__PURE__*/React.createElement("span", {
      className: "sla-cell-error"
    }, value) : /*#__PURE__*/React.createElement("span", {
      className: "sla-cell-success"
    }, value);
  };

  var inboxColumns = function inboxColumns() {
    return [{
      Header: t("WF_INBOX_HEADER_APPLICATION_NO"),
      Cell: function Cell(_ref2) {
        var row = _ref2.row;
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
          className: "link"
        }, /*#__PURE__*/React.createElement(Link, {
          to: "/digit-ui/employee/tl/application-details/" + row.original["applicationId"]
        }, row.original["applicationId"])));
      }
    }, {
      Header: t("TL_COMMON_TABLE_COL_APP_DATE"),
      accessor: "applicationDate",
      Cell: function Cell(_ref3) {
        var row = _ref3.row;
        var date = convertEpochToDateDMY(row.original.date);
        return GetCell(date);
      }
    }, {
      Header: t("TL_COMMON_TABLE_COL_APP_TYPE"),
      Cell: function Cell(_ref4) {
        var _row$original$busines;

        var row = _ref4.row;
        return GetCell(t(row.original["businessService"] ? "CS_COMMON_INBOX_" + ((_row$original$busines = row.original["businessService"]) === null || _row$original$busines === void 0 ? void 0 : _row$original$busines.toUpperCase()) : "NA"));
      }
    }, {
      Header: t("WF_INBOX_HEADER_LOCALITY"),
      Cell: function Cell(_ref5) {
        var row = _ref5.row;
        return GetCell(t(Digit.Utils.locale.getRevenueLocalityCode(row.original["locality"], row.original["tenantId"])));
      }
    }, {
      Header: t("WF_INBOX_HEADER_STATUS"),
      Cell: function Cell(_ref6) {
        var _row$original$busines2, _row$original;

        var row = _ref6.row;
        return GetCell(t(row.original["businessService"] ? "WF_" + ((_row$original$busines2 = row.original["businessService"]) === null || _row$original$busines2 === void 0 ? void 0 : _row$original$busines2.toUpperCase()) + "_" + ((_row$original = row.original) === null || _row$original === void 0 ? void 0 : _row$original["status"]) : "NA"));
      }
    }, {
      Header: t("WF_INBOX_HEADER_CURRENT_OWNER"),
      Cell: function Cell(_ref7) {
        var _row$original2;

        var row = _ref7.row;
        return GetCell(t("" + ((_row$original2 = row.original) === null || _row$original2 === void 0 ? void 0 : _row$original2.owner)));
      }
    }, {
      Header: t("WF_INBOX_HEADER_SLA_DAYS_REMAINING"),
      Cell: function Cell(_ref8) {
        var row = _ref8.row;
        return GetSlaCell(row.original["sla"]);
      }
    }];
  };

  var result;

  if (props.isLoading) {
    result = /*#__PURE__*/React.createElement(Loader, null);
  } else if ((data === null || data === void 0 ? void 0 : (_data$table = data.table) === null || _data$table === void 0 ? void 0 : _data$table.length) === 0) {
    result = /*#__PURE__*/React.createElement(Card, {
      style: {
        marginTop: 20
      }
    }, t("CS_MYAPPLICATIONS_NO_APPLICATION").split("\\n").map(function (text, index) {
      return /*#__PURE__*/React.createElement("p", {
        key: index,
        style: {
          textAlign: "center"
        }
      }, text);
    }));
  } else if ((data === null || data === void 0 ? void 0 : (_data$table2 = data.table) === null || _data$table2 === void 0 ? void 0 : _data$table2.length) > 0) {
    var _React$createElement;

    result = /*#__PURE__*/React.createElement(ApplicationTable, (_React$createElement = {
      t: t,
      data: data === null || data === void 0 ? void 0 : data.table,
      columns: inboxColumns(),
      getCellProps: function getCellProps(cellInfo) {
        return {
          style: {
            minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
            padding: "20px 18px",
            fontSize: "16px"
          }
        };
      },
      onPageSizeChange: props.onPageSizeChange,
      currentPage: props.currentPage,
      onNextPage: props.onNextPage,
      onPrevPage: props.onPrevPage,
      pageSizeLimit: props.pageSizeLimit,
      onSort: props.onSort,
      disableSort: props.disableSort
    }, _React$createElement["onPageSizeChange"] = props.onPageSizeChange, _React$createElement.sortParams = props.sortParams, _React$createElement.totalRecords = props.totalRecords, _React$createElement));
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "inbox-container"
  }, !props.isSearch && /*#__PURE__*/React.createElement("div", {
    className: "filters-container"
  }, /*#__PURE__*/React.createElement(InboxLinks, {
    parentRoute: props.parentRoute,
    allLinks: [{
      text: "TL_NEW_APPLICATION",
      link: "/digit-ui/employee/tl/new-application",
      businessService: "TL",
      roles: ["TL_CEMP"]
    }, {
      text: "TL_SEARCH_APPLICATIONS",
      link: "/digit-ui/employee/tl/search/application",
      businessService: "TL",
      roles: ["TL_FIELD_INSPECTOR", "TL_APPROVER", "TL_DOC_VERIFIER", "TL_CEMP"]
    }, {
      text: "TL_SEARCH_LICENSE",
      link: "/digit-ui/employee/tl/search/license",
      businessService: "TL",
      roles: ["TL_APPROVER", "TL_DOC_VERIFIER", "TL_FIELD_INSPECTOR"]
    }, {
      text: "TL_RENEWAL_HEADER",
      link: "/digit-ui/employee/tl/search/license",
      businessService: "TL",
      roles: ["TL_CEMP"]
    }, {
      text: "ACTION_TEST_DASHBOARD",
      link: "/digit-ui/employee/dss/dashboard/tradelicence",
      businessService: "TL",
      roles: ["STADMIN"]
    }],
    headerText: t("ACTION_TEST_TRADELICENSE"),
    businessService: props.businessService
  }), /*#__PURE__*/React.createElement("div", null, isLoading ? /*#__PURE__*/React.createElement(Loader, null) : /*#__PURE__*/React.createElement(FilterComponent, {
    defaultSearchParams: props.defaultSearchParams,
    statuses: data.statuses,
    onFilterChange: props.onFilterChange,
    searchParams: props.searchParams,
    type: "desktop"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SearchApplication$1, {
    defaultSearchParams: props.defaultSearchParams,
    onSearch: props.onSearch,
    type: "desktop",
    searchFields: props.searchFields,
    isInboxPage: !(props !== null && props !== void 0 && props.isSearch),
    searchParams: props.searchParams
  }), /*#__PURE__*/React.createElement("div", {
    className: "result",
    style: {
      marginLeft: !(props !== null && props !== void 0 && props.isSearch) ? "24px" : "",
      flex: 1
    }
  }, result)));
};

var SortBy = function SortBy(props) {
  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState(function () {
    var _props$sortParams, _props$sortParams$;

    return (_props$sortParams = props.sortParams) !== null && _props$sortParams !== void 0 && (_props$sortParams$ = _props$sortParams[0]) !== null && _props$sortParams$ !== void 0 && _props$sortParams$.desc ? {
      code: "DESC",
      name: t("ES_INBOX_DATE_LATEST_FIRST")
    } : {
      code: "ASC",
      name: t("ES_INBOX_DATE_LATEST_LAST")
    };
  }),
      selectedOption = _useState[0];

  function clearAll() {}

  function onSort(option) {
    props.onSort([{
      id: "createdTime",
      desc: option.code === "DESC" ? true : false
    }]);
    props.onClose();
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "filter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "heading"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-label"
  }, t("SORT_BY"), ":"), /*#__PURE__*/React.createElement("div", {
    className: "clearAll",
    onClick: clearAll
  }, t("ES_COMMON_CLEAR_ALL")), props.type === "desktop" && /*#__PURE__*/React.createElement("span", {
    className: "clear-search",
    onClick: clearAll
  }, t("ES_COMMON_CLEAR_ALL")), props.type === "mobile" && /*#__PURE__*/React.createElement("span", {
    onClick: props.onClose
  }, /*#__PURE__*/React.createElement(CloseSvg, null))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RadioButtons, {
    onSelect: onSort,
    selectedOption: selectedOption,
    optionsKey: "name",
    options: [{
      code: "DESC",
      name: t("ES_INBOX_DATE_LATEST_FIRST")
    }, {
      code: "ASC",
      name: t("ES_INBOX_DATE_LATEST_LAST")
    }]
  })))));
};

var ApplicationCard = function ApplicationCard(_ref) {
  var _React$createElement;

  var t = _ref.t,
      data = _ref.data,
      onFilterChange = _ref.onFilterChange,
      onSearch = _ref.onSearch,
      onSort = _ref.onSort,
      serviceRequestIdKey = _ref.serviceRequestIdKey,
      isFstpOperator = _ref.isFstpOperator,
      isLoading = _ref.isLoading,
      isSearch = _ref.isSearch,
      searchParams = _ref.searchParams,
      searchFields = _ref.searchFields,
      sortParams = _ref.sortParams,
      linkPrefix = _ref.linkPrefix,
      removeParam = _ref.removeParam;

  var _useState = useState(isSearch ? "SEARCH" : ""),
      type = _useState[0],
      setType = _useState[1];

  var _useState2 = useState(isSearch ? true : false),
      popup = _useState2[0],
      setPopup = _useState2[1];

  var _useState3 = useState(searchParams),
      params = _useState3[0],
      setParams = _useState3[1];

  var _useState4 = useState(sortParams),
      setSortParams = _useState4[1];

  var selectParams = function selectParams(param) {
    setParams(function (o) {
      return _extends({}, o, param);
    });
  };

  var onSearchPara = function onSearchPara(param) {
    onFilterChange(_extends({}, params, param));
    setType("");
    setPopup(false);
  };

  useEffect(function () {
    if (type) setPopup(true);
  }, [type]);

  var handlePopupClose = function handlePopupClose() {
    setPopup(false);
    setType("");
    setParams(searchParams);
    setSortParams(sortParams);
  };

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  var result;

  if (!data || (data === null || data === void 0 ? void 0 : data.length) === 0) {
    result = /*#__PURE__*/React.createElement(Card, {
      style: {
        marginTop: 20
      }
    }, t("CS_MYAPPLICATIONS_NO_APPLICATION").split("\\n").map(function (text, index) {
      return /*#__PURE__*/React.createElement("p", {
        key: index,
        style: {
          textAlign: "center"
        }
      }, text);
    }));
  } else if (data && (data === null || data === void 0 ? void 0 : data.length) > 0) {
    result = /*#__PURE__*/React.createElement(DetailsCard, {
      data: data,
      serviceRequestIdKey: serviceRequestIdKey,
      linkPrefix: linkPrefix ? linkPrefix : "/digit-ui/employee/tl/application-details/"
    });
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "searchBox"
  }, onSearch && /*#__PURE__*/React.createElement(SearchAction, {
    text: "SEARCH",
    handleActionClick: function handleActionClick() {
      setType("SEARCH");
      setPopup(true);
    }
  }), !isSearch && onFilterChange && /*#__PURE__*/React.createElement(FilterAction, {
    text: "FILTER",
    handleActionClick: function handleActionClick() {
      setType("FILTER");
      setPopup(true);
    }
  }), /*#__PURE__*/React.createElement(FilterAction, {
    text: "SORT",
    handleActionClick: function handleActionClick() {
      setType("SORT");
      setPopup(true);
    }
  })), result, popup && /*#__PURE__*/React.createElement(PopUp, null, type === "FILTER" && /*#__PURE__*/React.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React.createElement(Filter, {
    onFilterChange: selectParams,
    onClose: handlePopupClose,
    onSearch: onSearchPara,
    type: "mobile",
    searchParams: params,
    removeParam: removeParam
  })), type === "SORT" && /*#__PURE__*/React.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React.createElement(SortBy, (_React$createElement = {
    type: "mobile",
    sortParams: sortParams,
    onClose: handlePopupClose
  }, _React$createElement["type"] = "mobile", _React$createElement.onSort = onSort, _React$createElement))), type === "SEARCH" && /*#__PURE__*/React.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React.createElement(SearchApplication$1, {
    type: "mobile",
    onClose: handlePopupClose,
    onSearch: onSearch,
    isFstpOperator: isFstpOperator,
    searchParams: searchParams,
    searchFields: searchFields
  }))));
};

var MobileInbox = function MobileInbox(_ref) {
  var data = _ref.data,
      isLoading = _ref.isLoading,
      onSearch = _ref.onSearch,
      onFilterChange = _ref.onFilterChange,
      onSort = _ref.onSort,
      searchParams = _ref.searchParams,
      searchFields = _ref.searchFields,
      linkPrefix = _ref.linkPrefix,
      parentRoute = _ref.parentRoute,
      removeParam = _ref.removeParam,
      sortParams = _ref.sortParams;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var getData = function getData() {
    return data === null || data === void 0 ? void 0 : data.table.map(function (e) {
      var _e$businessService, _e$businessService2, _ref2;

      return _ref2 = {}, _ref2[t("WF_INBOX_HEADER_APPLICATION_NO")] = e === null || e === void 0 ? void 0 : e["applicationId"], _ref2[t("TL_COMMON_TABLE_COL_APP_DATE")] = convertEpochToDateDMY(e === null || e === void 0 ? void 0 : e["date"]), _ref2[t("TL_COMMON_TABLE_COL_APP_TYPE")] = e !== null && e !== void 0 && e["businessService"] ? t("CS_COMMON_INBOX_" + (e === null || e === void 0 ? void 0 : (_e$businessService = e["businessService"]) === null || _e$businessService === void 0 ? void 0 : _e$businessService.toUpperCase())) : t("NA"), _ref2[t("WF_INBOX_HEADER_LOCALITY")] = t(Digit.Utils.locale.getRevenueLocalityCode(e === null || e === void 0 ? void 0 : e["locality"], e === null || e === void 0 ? void 0 : e["tenantId"])), _ref2[t("WF_INBOX_HEADER_STATUS")] = t(e !== null && e !== void 0 && e["businessService"] ? "WF_" + ((_e$businessService2 = e["businessService"]) === null || _e$businessService2 === void 0 ? void 0 : _e$businessService2.toUpperCase()) + "_" + (e === null || e === void 0 ? void 0 : e["status"]) : "NA"), _ref2[t("WF_INBOX_HEADER_CURRENT_OWNER")] = t(e === null || e === void 0 ? void 0 : e.owner), _ref2[t("WF_INBOX_HEADER_SLA_DAYS_REMAINING")] = e === null || e === void 0 ? void 0 : e["sla"], _ref2;
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "inbox-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filters-container"
  }, /*#__PURE__*/React.createElement(InboxLinks, {
    linkPrefix: parentRoute,
    allLinks: [{
      text: "TL_NEW_APPLICATION",
      link: "/digit-ui/employee/tl/new-application",
      businessService: "TL",
      roles: ["TL_CEMP"]
    }, {
      text: "TL_SEARCH_APPLICATIONS",
      link: "/digit-ui/employee/tl/search/application",
      businessService: "TL",
      roles: ["TL_FIELD_INSPECTOR", "TL_APPROVER", "TL_DOC_VERIFIER", "TL_CEMP"]
    }, {
      text: "TL_SEARCH_LICENSE",
      link: "/digit-ui/employee/tl/search/license",
      businessService: "TL",
      roles: ["TL_APPROVER", "TL_DOC_VERIFIER", "TL_FIELD_INSPECTOR"]
    }, {
      text: "TL_RENEWAL_HEADER",
      link: "/digit-ui/employee/tl/search/license",
      businessService: "TL",
      roles: ["TL_CEMP"]
    }, {
      text: "ACTION_TEST_DASHBOARD",
      link: "/digit-ui/employee/dss/dashboard/tradelicence",
      businessService: "TL",
      roles: ["STADMIN"]
    }],
    headerText: t("ACTION_TEST_TRADELICENSE"),
    isMobile: true
  }), /*#__PURE__*/React.createElement(ApplicationCard, {
    t: t,
    data: getData(),
    onFilterChange: onFilterChange,
    serviceRequestIdKey: t("WF_INBOX_HEADER_APPLICATION_NO"),
    isLoading: isLoading,
    onSearch: onSearch,
    onSort: onSort,
    searchParams: searchParams,
    searchFields: searchFields,
    linkPrefix: linkPrefix,
    removeParam: removeParam,
    sortParams: sortParams
  }))));
};

var Inbox = function Inbox(_ref) {
  var _sortParams$, _sortParams$2, _sortParams$3, _sortParams$4;

  var parentRoute = _ref.parentRoute,
      _ref$businessService = _ref.businessService,
      businessService = _ref$businessService === void 0 ? "TL" : _ref$businessService,
      _ref$initialStates = _ref.initialStates,
      initialStates = _ref$initialStates === void 0 ? {} : _ref$initialStates,
      filterComponent = _ref.filterComponent,
      isInbox = _ref.isInbox;
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useState = useState(function () {
    return isInbox ? {} : {
      enabled: false
    };
  }),
      setEnableSearch = _useState[1];

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState2 = useState((initialStates === null || initialStates === void 0 ? void 0 : initialStates.pageOffset) || 0),
      pageOffset = _useState2[0],
      setPageOffset = _useState2[1];

  var _useState3 = useState((initialStates === null || initialStates === void 0 ? void 0 : initialStates.pageSize) || 10),
      pageSize = _useState3[0],
      setPageSize = _useState3[1];

  var _useState4 = useState((initialStates === null || initialStates === void 0 ? void 0 : initialStates.sortParams) || [{
    id: "applicationDate",
    desc: false
  }]),
      sortParams = _useState4[0],
      setSortParams = _useState4[1];

  var _useState5 = useState(function () {
    return (initialStates === null || initialStates === void 0 ? void 0 : initialStates.searchParams) || {};
  }),
      searchParams = _useState5[0],
      setSearchParams = _useState5[1];

  var isMobile = window.Digit.Utils.browser.isMobile();
  var paginationParams = isMobile ? {
    limit: 100,
    offset: 0,
    sortBy: sortParams === null || sortParams === void 0 ? void 0 : (_sortParams$ = sortParams[0]) === null || _sortParams$ === void 0 ? void 0 : _sortParams$.id,
    sortOrder: sortParams !== null && sortParams !== void 0 && (_sortParams$2 = sortParams[0]) !== null && _sortParams$2 !== void 0 && _sortParams$2.desc ? "DESC" : "ASC"
  } : {
    limit: pageSize,
    offset: pageOffset,
    sortBy: sortParams === null || sortParams === void 0 ? void 0 : (_sortParams$3 = sortParams[0]) === null || _sortParams$3 === void 0 ? void 0 : _sortParams$3.id,
    sortOrder: sortParams !== null && sortParams !== void 0 && (_sortParams$4 = sortParams[0]) !== null && _sortParams$4 !== void 0 && _sortParams$4.desc ? "DESC" : "ASC"
  };

  var _Digit$Hooks$tl$useIn = Digit.Hooks.tl.useInbox({
    tenantId: tenantId,
    filters: _extends({}, searchParams, paginationParams, {
      sortParams: sortParams
    }),
    config: {}
  }),
      hookLoading = _Digit$Hooks$tl$useIn.isLoading,
      data = _Digit$Hooks$tl$useIn.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$tl$useIn, ["isFetching", "isLoading", "searchResponseKey", "data", "searchFields"]);

  useEffect(function () {
    setPageOffset(0);
  }, [searchParams]);

  var fetchNextPage = function fetchNextPage() {
    setPageOffset(function (prevState) {
      return prevState + pageSize;
    });
  };

  var fetchPrevPage = function fetchPrevPage() {
    setPageOffset(function (prevState) {
      return prevState - pageSize;
    });
  };

  var handleFilterChange = function handleFilterChange(filterParam) {
    var _new2;

    var keys_to_delete = filterParam === null || filterParam === void 0 ? void 0 : filterParam.delete;
    var _new = {};

    if (isMobile) {
      _new = _extends({}, filterParam);
    } else {
      _new = _extends({}, searchParams, filterParam);
    }

    if (keys_to_delete) keys_to_delete.forEach(function (key) {
      return delete _new[key];
    });
    (_new2 = _new) === null || _new2 === void 0 ? true : delete _new2.delete;
    filterParam === null || filterParam === void 0 ? true : delete filterParam.delete;
    setSearchParams(_extends({}, _new));
    setEnableSearch({
      enabled: true
    });
  };

  var handleSort = useCallback(function (args) {
    if (args.length === 0) return;
    setSortParams(args);
  }, []);

  var handlePageSizeChange = function handlePageSizeChange(e) {
    setPageSize(Number(e.target.value));
  };

  var getSearchFields = function getSearchFields() {
    return [{
      label: t("TL_HOME_SEARCH_RESULTS_APP_NO_LABEL"),
      name: "applicationNumber"
    }, {
      label: t("CORE_COMMON_MOBILE_NUMBER"),
      name: "mobileNumber",
      maxlength: 10,
      pattern: Digit.Utils.getPattern("MobileNo"),
      type: "mobileNumber",
      title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
      componentInFront: "+91"
    }];
  };

  if (isMobile) {
    return /*#__PURE__*/React.createElement(MobileInbox, {
      data: data,
      isLoading: hookLoading,
      searchFields: getSearchFields(),
      onFilterChange: handleFilterChange,
      onSearch: handleFilterChange,
      onSort: handleSort,
      parentRoute: parentRoute,
      searchParams: searchParams,
      sortParams: sortParams
    });
  } else {
    return /*#__PURE__*/React.createElement("div", null, isInbox && /*#__PURE__*/React.createElement(Header, null, t("ES_COMMON_INBOX")), /*#__PURE__*/React.createElement(DesktopInbox, {
      businessService: businessService,
      data: data,
      tableConfig: rest === null || rest === void 0 ? void 0 : rest.tableConfig,
      isLoading: hookLoading,
      defaultSearchParams: initialStates.searchParams,
      isSearch: !isInbox,
      onFilterChange: handleFilterChange,
      searchFields: getSearchFields(),
      onSearch: handleFilterChange,
      onSort: handleSort,
      onNextPage: fetchNextPage,
      onPrevPage: fetchPrevPage,
      currentPage: Math.floor(pageOffset / pageSize),
      pageSizeLimit: pageSize,
      disableSort: false,
      onPageSizeChange: handlePageSizeChange,
      parentRoute: parentRoute,
      searchParams: searchParams,
      sortParams: sortParams,
      totalRecords: Number(data === null || data === void 0 ? void 0 : data.totalCount),
      filterComponent: filterComponent
    }));
  }
};

var NewApplication = function NewApplication() {
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState(false),
      canSubmit = _useState[0],
      setSubmitValve = _useState[1];

  var defaultValues = {};
  var history = useHistory();

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("store-data", null);

  var _Digit$Hooks$useSessi2 = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false),
      setMutationHappened = _Digit$Hooks$useSessi2[1];

  var _Digit$Hooks$useSessi3 = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", {}),
      clearSuccessData = _Digit$Hooks$useSessi3[2];

  var _useState2 = useState(null),
      showToast = _useState2[0],
      setShowToast = _useState2[1];

  var _useState3 = useState(null),
      error = _useState3[0],
      setError = _useState3[1];

  var closeToast = function closeToast() {
    setShowToast(null);
    setError(null);
  };

  useEffect(function () {
    setMutationHappened(false);
    clearSuccessData();
  }, []);

  var onFormValueChange = function onFormValueChange(setValue, formData, formState) {
    setSubmitValve(!Object.keys(formState.errors).length);
  };

  var onSubmit = function onSubmit(data) {
    var _data$accessories, _data$tradeUnits, _data$owners, _data$documents, _data$tradedetils, _data$tradedetils$, _data$tradedetils2, _data$tradedetils2$, _data$tradedetils2$$f, _data$tradedetils3, _data$tradedetils3$, _data$tradedetils4, _data$tradedetils4$, _data$tradedetils5, _data$tradedetils5$, _data$tradedetils6, _data$tradedetils6$, _data$tradedetils6$$s, _data$tradedetils7, _data$tradedetils7$, _data$ownershipCatego, _data$tradedetils8, _data$tradedetils8$, _data$tradedetils8$$l;

    var accessories = [];

    if ((data === null || data === void 0 ? void 0 : (_data$accessories = data.accessories) === null || _data$accessories === void 0 ? void 0 : _data$accessories.length) > 0) {
      data === null || data === void 0 ? void 0 : data.accessories.map(function (data) {
        var _data$accessoryCatego;

        if (data !== null && data !== void 0 && (_data$accessoryCatego = data.accessoryCategory) !== null && _data$accessoryCatego !== void 0 && _data$accessoryCatego.code) {
          var _data$accessoryCatego2, _data$accessoryCatego3;

          accessories.push({
            accessoryCategory: (data === null || data === void 0 ? void 0 : (_data$accessoryCatego2 = data.accessoryCategory) === null || _data$accessoryCatego2 === void 0 ? void 0 : _data$accessoryCatego2.code) || null,
            uom: (data === null || data === void 0 ? void 0 : (_data$accessoryCatego3 = data.accessoryCategory) === null || _data$accessoryCatego3 === void 0 ? void 0 : _data$accessoryCatego3.uom) || null,
            count: Number(data === null || data === void 0 ? void 0 : data.count) || null,
            uomValue: Number(data === null || data === void 0 ? void 0 : data.uomValue) || null
          });
        }
      });
    }
    var tradeUnits = [];

    if ((data === null || data === void 0 ? void 0 : (_data$tradeUnits = data.tradeUnits) === null || _data$tradeUnits === void 0 ? void 0 : _data$tradeUnits.length) > 0) {
      data === null || data === void 0 ? void 0 : data.tradeUnits.map(function (data) {
        var _data$tradeSubType, _data$tradeSubType2;

        tradeUnits.push({
          tradeType: (data === null || data === void 0 ? void 0 : (_data$tradeSubType = data.tradeSubType) === null || _data$tradeSubType === void 0 ? void 0 : _data$tradeSubType.code) || null,
          uom: (data === null || data === void 0 ? void 0 : (_data$tradeSubType2 = data.tradeSubType) === null || _data$tradeSubType2 === void 0 ? void 0 : _data$tradeSubType2.uom) || null,
          uomValue: Number(data === null || data === void 0 ? void 0 : data.uomValue) || null
        });
      });
    }
    var address = {};

    if (data !== null && data !== void 0 && data.address) {
      var _data$address, _data$address$city, _data$address2, _data$address2$locali, _data$address3, _data$address4, _data$address5, _data$address6, _data$address7, _data$address8;

      address.city = (data === null || data === void 0 ? void 0 : (_data$address = data.address) === null || _data$address === void 0 ? void 0 : (_data$address$city = _data$address.city) === null || _data$address$city === void 0 ? void 0 : _data$address$city.code) || null;
      address.locality = {
        code: (data === null || data === void 0 ? void 0 : (_data$address2 = data.address) === null || _data$address2 === void 0 ? void 0 : (_data$address2$locali = _data$address2.locality) === null || _data$address2$locali === void 0 ? void 0 : _data$address2$locali.code) || null
      };
      if (data !== null && data !== void 0 && (_data$address3 = data.address) !== null && _data$address3 !== void 0 && _data$address3.doorNo) address.doorNo = (data === null || data === void 0 ? void 0 : (_data$address4 = data.address) === null || _data$address4 === void 0 ? void 0 : _data$address4.doorNo) || null;
      if (data !== null && data !== void 0 && (_data$address5 = data.address) !== null && _data$address5 !== void 0 && _data$address5.street) address.street = (data === null || data === void 0 ? void 0 : (_data$address6 = data.address) === null || _data$address6 === void 0 ? void 0 : _data$address6.street) || null;
      if (data !== null && data !== void 0 && (_data$address7 = data.address) !== null && _data$address7 !== void 0 && _data$address7.pincode) address.pincode = data === null || data === void 0 ? void 0 : (_data$address8 = data.address) === null || _data$address8 === void 0 ? void 0 : _data$address8.pincode;
    }

    var owners = [];

    if ((data === null || data === void 0 ? void 0 : (_data$owners = data.owners) === null || _data$owners === void 0 ? void 0 : _data$owners.length) > 0) {
      data === null || data === void 0 ? void 0 : data.owners.map(function (data) {
        var _data$gender, _data$gender2, _data$ownerType, _data$ownerType2;

        var obj = {};
        if (data !== null && data !== void 0 && data.dob) obj.dob = convertDateToEpoch(data === null || data === void 0 ? void 0 : data.dob);
        if (data !== null && data !== void 0 && (_data$gender = data.gender) !== null && _data$gender !== void 0 && _data$gender.code) obj.gender = data === null || data === void 0 ? void 0 : (_data$gender2 = data.gender) === null || _data$gender2 === void 0 ? void 0 : _data$gender2.code;
        if (data !== null && data !== void 0 && data.mobileNumber) obj.mobileNumber = Number(data === null || data === void 0 ? void 0 : data.mobileNumber);
        if (data !== null && data !== void 0 && data.name) obj.name = data === null || data === void 0 ? void 0 : data.name;
        if (data !== null && data !== void 0 && data.permanentAddress) obj.permanentAddress = data === null || data === void 0 ? void 0 : data.permanentAddress;
        if (data !== null && data !== void 0 && data.emailId) obj.emailId = data === null || data === void 0 ? void 0 : data.emailId;
        if (data !== null && data !== void 0 && (_data$ownerType = data.ownerType) !== null && _data$ownerType !== void 0 && _data$ownerType.code) obj.ownerType = data === null || data === void 0 ? void 0 : (_data$ownerType2 = data.ownerType) === null || _data$ownerType2 === void 0 ? void 0 : _data$ownerType2.code;
        owners.push(obj);
      });
    }
    var applicationDocuments = (data === null || data === void 0 ? void 0 : (_data$documents = data.documents) === null || _data$documents === void 0 ? void 0 : _data$documents.documents) || [];
    var commencementDate = convertDateToEpoch(data === null || data === void 0 ? void 0 : (_data$tradedetils = data.tradedetils) === null || _data$tradedetils === void 0 ? void 0 : (_data$tradedetils$ = _data$tradedetils["0"]) === null || _data$tradedetils$ === void 0 ? void 0 : _data$tradedetils$.commencementDate);
    var financialYear = data === null || data === void 0 ? void 0 : (_data$tradedetils2 = data.tradedetils) === null || _data$tradedetils2 === void 0 ? void 0 : (_data$tradedetils2$ = _data$tradedetils2["0"]) === null || _data$tradedetils2$ === void 0 ? void 0 : (_data$tradedetils2$$f = _data$tradedetils2$.financialYear) === null || _data$tradedetils2$$f === void 0 ? void 0 : _data$tradedetils2$$f.code;
    var gstNo = (data === null || data === void 0 ? void 0 : (_data$tradedetils3 = data.tradedetils) === null || _data$tradedetils3 === void 0 ? void 0 : (_data$tradedetils3$ = _data$tradedetils3["0"]) === null || _data$tradedetils3$ === void 0 ? void 0 : _data$tradedetils3$.gstNo) || "";
    var noOfEmployees = Number(data === null || data === void 0 ? void 0 : (_data$tradedetils4 = data.tradedetils) === null || _data$tradedetils4 === void 0 ? void 0 : (_data$tradedetils4$ = _data$tradedetils4["0"]) === null || _data$tradedetils4$ === void 0 ? void 0 : _data$tradedetils4$.noOfEmployees) || "";
    var operationalArea = Number(data === null || data === void 0 ? void 0 : (_data$tradedetils5 = data.tradedetils) === null || _data$tradedetils5 === void 0 ? void 0 : (_data$tradedetils5$ = _data$tradedetils5["0"]) === null || _data$tradedetils5$ === void 0 ? void 0 : _data$tradedetils5$.operationalArea) || "";
    var structureType = (data === null || data === void 0 ? void 0 : (_data$tradedetils6 = data.tradedetils) === null || _data$tradedetils6 === void 0 ? void 0 : (_data$tradedetils6$ = _data$tradedetils6["0"]) === null || _data$tradedetils6$ === void 0 ? void 0 : (_data$tradedetils6$$s = _data$tradedetils6$.structureSubType) === null || _data$tradedetils6$$s === void 0 ? void 0 : _data$tradedetils6$$s.code) || "";
    var tradeName = (data === null || data === void 0 ? void 0 : (_data$tradedetils7 = data.tradedetils) === null || _data$tradedetils7 === void 0 ? void 0 : (_data$tradedetils7$ = _data$tradedetils7["0"]) === null || _data$tradedetils7$ === void 0 ? void 0 : _data$tradedetils7$.tradeName) || "";
    var subOwnerShipCategory = (data === null || data === void 0 ? void 0 : (_data$ownershipCatego = data.ownershipCategory) === null || _data$ownershipCatego === void 0 ? void 0 : _data$ownershipCatego.code) || "";
    var licenseType = (data === null || data === void 0 ? void 0 : (_data$tradedetils8 = data.tradedetils) === null || _data$tradedetils8 === void 0 ? void 0 : (_data$tradedetils8$ = _data$tradedetils8["0"]) === null || _data$tradedetils8$ === void 0 ? void 0 : (_data$tradedetils8$$l = _data$tradedetils8$.licenseType) === null || _data$tradedetils8$$l === void 0 ? void 0 : _data$tradedetils8$$l.code) || "PERMANENT";
    var formData = {
      action: "INITIATE",
      applicationType: "NEW",
      workflowCode: "NewTL",
      commencementDate: commencementDate,
      financialYear: financialYear,
      licenseType: licenseType,
      tenantId: tenantId,
      tradeName: tradeName,
      wfDocuments: [],
      tradeLicenseDetail: {
        channel: "COUNTER",
        additionalDetail: {}
      }
    };
    if (gstNo) formData.tradeLicenseDetail.additionalDetail.gstNo = gstNo;
    if (noOfEmployees) formData.tradeLicenseDetail.noOfEmployees = noOfEmployees;
    if (operationalArea) formData.tradeLicenseDetail.operationalArea = operationalArea;
    if ((accessories === null || accessories === void 0 ? void 0 : accessories.length) > 0) formData.tradeLicenseDetail.accessories = accessories;
    if ((tradeUnits === null || tradeUnits === void 0 ? void 0 : tradeUnits.length) > 0) formData.tradeLicenseDetail.tradeUnits = tradeUnits;
    if ((owners === null || owners === void 0 ? void 0 : owners.length) > 0) formData.tradeLicenseDetail.owners = owners;
    if (address) formData.tradeLicenseDetail.address = address;
    if (structureType) formData.tradeLicenseDetail.structureType = structureType;
    if (subOwnerShipCategory) formData.tradeLicenseDetail.subOwnerShipCategory = subOwnerShipCategory;
    Digit.TLService.create({
      Licenses: [formData]
    }, tenantId).then(function (result, err) {
      var _result$Licenses;

      if ((result === null || result === void 0 ? void 0 : (_result$Licenses = result.Licenses) === null || _result$Licenses === void 0 ? void 0 : _result$Licenses.length) > 0) {
        var _result$Licenses2;

        var licenses = result === null || result === void 0 ? void 0 : (_result$Licenses2 = result.Licenses) === null || _result$Licenses2 === void 0 ? void 0 : _result$Licenses2[0];
        licenses.tradeLicenseDetail.applicationDocuments = applicationDocuments;
        licenses.wfDocuments = [];
        licenses.action = "APPLY";
        Digit.TLService.update({
          Licenses: [licenses]
        }, tenantId).then(function (response) {
          var _response$Licenses;

          if ((response === null || response === void 0 ? void 0 : (_response$Licenses = response.Licenses) === null || _response$Licenses === void 0 ? void 0 : _response$Licenses.length) > 0) {
            history.replace("/digit-ui/employee/tl/response", {
              data: response === null || response === void 0 ? void 0 : response.Licenses
            });
          }
        }).catch(function (e) {
          var _e$response, _e$response$data, _e$response$data$Erro;

          setShowToast({
            key: "error"
          });
          setError((e === null || e === void 0 ? void 0 : (_e$response = e.response) === null || _e$response === void 0 ? void 0 : (_e$response$data = _e$response.data) === null || _e$response$data === void 0 ? void 0 : (_e$response$data$Erro = _e$response$data.Errors[0]) === null || _e$response$data$Erro === void 0 ? void 0 : _e$response$data$Erro.message) || null);
        });
      }
    }).catch(function (e) {
      var _e$response2, _e$response2$data, _e$response2$data$Err;

      setShowToast({
        key: "error"
      });
      setError((e === null || e === void 0 ? void 0 : (_e$response2 = e.response) === null || _e$response2 === void 0 ? void 0 : (_e$response2$data = _e$response2.data) === null || _e$response2$data === void 0 ? void 0 : (_e$response2$data$Err = _e$response2$data.Errors[0]) === null || _e$response2$data$Err === void 0 ? void 0 : _e$response2$data$Err.message) || null);
    });
  };

  var configs = [];
  newConfig.map(function (conf) {
    if (conf.head !== "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT" && conf.head) {
      configs.push(conf);
    }
  });

  function checkHead(head) {
    if (head === "ES_NEW_APPLICATION_LOCATION_DETAILS") {
      return "TL_CHECK_ADDRESS";
    } else if (head === "ES_NEW_APPLICATION_OWNERSHIP_DETAILS") {
      return "TL_OWNERSHIP_DETAILS_HEADER";
    } else {
      return head;
    }
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "15px"
    }
  }, /*#__PURE__*/React.createElement(Header, null, t("ES_TITLE_NEW_TRADE_LICESE_APPLICATION"))), /*#__PURE__*/React.createElement(FormComposer, {
    heading: t(""),
    isDisabled: !canSubmit,
    label: t("ES_COMMON_APPLICATION_SUBMIT"),
    config: configs.map(function (config) {
      return _extends({}, config, {
        body: config.body.filter(function (a) {
          return !a.hideInEmployee;
        }),
        head: checkHead(config.head)
      });
    }),
    fieldStyle: {
      marginRight: 0
    },
    onSubmit: onSubmit,
    defaultValues: defaultValues,
    onFormValueChange: onFormValueChange,
    breaklineStyle: {
      border: "0px"
    }
  }), showToast && /*#__PURE__*/React.createElement(Toast, {
    error: (showToast === null || showToast === void 0 ? void 0 : showToast.key) === "error" ? true : false,
    label: error,
    onClose: closeToast
  }));
};

var Search = function Search(_ref) {

  var _useParams = useParams(),
      variant = _useParams.variant;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useState = useState({}),
      payload = _useState[0],
      setPayload = _useState[1];

  var Search = Digit.ComponentRegistryService.getComponent(variant === "license" ? "SearchLicense" : "SearchApplication");

  function onSubmit(_data) {
    var fromDate = new Date(_data === null || _data === void 0 ? void 0 : _data.fromDate);
    fromDate === null || fromDate === void 0 ? void 0 : fromDate.setSeconds((fromDate === null || fromDate === void 0 ? void 0 : fromDate.getSeconds()) - 19800);
    var toDate = new Date(_data === null || _data === void 0 ? void 0 : _data.toDate);
    toDate === null || toDate === void 0 ? void 0 : toDate.setSeconds((toDate === null || toDate === void 0 ? void 0 : toDate.getSeconds()) + 86399 - 19800);

    var data = _extends({}, _data, _data.toDate ? {
      toDate: toDate === null || toDate === void 0 ? void 0 : toDate.getTime()
    } : {}, _data.fromDate ? {
      fromDate: fromDate === null || fromDate === void 0 ? void 0 : fromDate.getTime()
    } : {});

    setPayload(Object.keys(data).filter(function (k) {
      return data[k];
    }).reduce(function (acc, key) {
      var _extends2;

      return _extends({}, acc, (_extends2 = {}, _extends2[key] = typeof data[key] === "object" ? data[key].code : data[key], _extends2));
    }, {}));
  }

  var config = {
    enabled: !!(payload && Object.keys(payload).length > 0)
  };

  var _Digit$Hooks$tl$useSe = Digit.Hooks.tl.useSearch({
    tenantId: tenantId,
    filters: payload,
    config: config
  }),
      searchReult = _Digit$Hooks$tl$useSe.data,
      isLoading = _Digit$Hooks$tl$useSe.isLoading,
      isSuccess = _Digit$Hooks$tl$useSe.isSuccess;

  return /*#__PURE__*/React.createElement(Search, {
    t: t,
    tenantId: tenantId,
    onSubmit: onSubmit,
    data: !isLoading && isSuccess ? searchReult : {
      display: "ES_COMMON_NO_DATA"
    }
  });
};

var Response = function Response(props) {
  var _state$data3, _state$data3$, _state$data4, _state$data4$;

  var location = useLocation();
  var state = props.location.state;

  var _useState = useState({}),
      setParams = _useState[1];

  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams();

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      storeData = _Digit$Hooks$useStore.data;

  var _ref = storeData || {},
      tenants = _ref.tenants;

  useEffect(function () {
    setParams(getQueryStringParams(location.search));
  }, [location]);

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var printReciept = function printReciept() {
    try {
      var Licenses = (state === null || state === void 0 ? void 0 : state.data) || [];
      var license = Licenses && Licenses[0] || {};
      var tenantInfo = tenants.find(function (tenant) {
        return tenant.code === license.tenantId;
      });
      return Promise.resolve(getPTAcknowledgementData(_extends({}, license), tenantInfo, t)).then(function (data) {
        Digit.Utils.pdf.generate(data);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var routeToPaymentScreen = function routeToPaymentScreen() {
    try {
      var _state$data, _state$data$, _state$data2, _state$data2$;

      window.location.assign(window.location.origin + "/digit-ui/employee/payment/collect/TL/" + (state === null || state === void 0 ? void 0 : (_state$data = state.data) === null || _state$data === void 0 ? void 0 : (_state$data$ = _state$data[0]) === null || _state$data$ === void 0 ? void 0 : _state$data$.applicationNumber) + "/" + (state === null || state === void 0 ? void 0 : (_state$data2 = state.data) === null || _state$data2 === void 0 ? void 0 : (_state$data2$ = _state$data2[0]) === null || _state$data2$ === void 0 ? void 0 : _state$data2$.tenantId));
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Banner, {
    message: t("TL_APPLICATION_SUCCESS_MESSAGE_MAIN"),
    applicationNumber: state === null || state === void 0 ? void 0 : (_state$data3 = state.data) === null || _state$data3 === void 0 ? void 0 : (_state$data3$ = _state$data3[0]) === null || _state$data3$ === void 0 ? void 0 : _state$data3$.applicationNumber,
    info: "",
    successful: true
  }), /*#__PURE__*/React.createElement(CardText, null, t("TL_NEW_SUCESS_RESPONSE_NOTIFICATION_LABEL")), /*#__PURE__*/React.createElement("div", {
    className: "primary-label-btn d-grid",
    style: {
      marginLeft: "unset"
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
  })), t("TL_PRINT_APPLICATION_LABEL")), /*#__PURE__*/React.createElement(ActionBar, {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "baseline"
    }
  }, (state === null || state === void 0 ? void 0 : (_state$data4 = state.data) === null || _state$data4 === void 0 ? void 0 : (_state$data4$ = _state$data4[0]) === null || _state$data4$ === void 0 ? void 0 : _state$data4$.status) !== "PENDINGPAYMENT" ? /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/employee",
    style: {
      marginRight: "1rem"
    }
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CORE_COMMON_GO_TO_HOME")
  })) :
  /*#__PURE__*/
  React.createElement("div", {
    onClick: routeToPaymentScreen
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("TL_COLLECT_PAYMENT")
  })))));
};

var configPTApproverApplication = function configPTApproverApplication(_ref) {
  var _action$assigneeRoles;

  var t = _ref.t,
      action = _ref.action,
      approvers = _ref.approvers,
      selectedApprover = _ref.selectedApprover,
      setSelectedApprover = _ref.setSelectedApprover,
      selectFile = _ref.selectFile,
      uploadedFile = _ref.uploadedFile,
      setUploadedFile = _ref.setUploadedFile,
      assigneeLabel = _ref.assigneeLabel,
      businessService = _ref.businessService;
  return {
    label: {
      heading: "WF_" + (action === null || action === void 0 ? void 0 : action.action) + "_APPLICATION",
      submit: "WF_" + businessService + "_" + (action === null || action === void 0 ? void 0 : action.action),
      cancel: "ES_PT_COMMON_CANCEL"
    },
    form: [{
      body: [{
        label: action.isTerminateState ? null : t(assigneeLabel || "WF_ROLE_" + ((_action$assigneeRoles = action.assigneeRoles) === null || _action$assigneeRoles === void 0 ? void 0 : _action$assigneeRoles[0])),
        type: "dropdown",
        populators: action.isTerminateState ? null : /*#__PURE__*/React.createElement(Dropdown, {
          option: approvers,
          autoComplete: "off",
          optionKey: "name",
          id: "fieldInspector",
          select: setSelectedApprover,
          selected: selectedApprover
        })
      }, {
        label: t("ES_PT_ACTION_COMMENTS"),
        type: "textarea",
        populators: {
          name: "comments"
        }
      }, {
        label: "" + t("ES_PT_ATTACH_FILE") + (action.docUploadRequired ? " *" : ""),
        populators: /*#__PURE__*/React.createElement(UploadFile, {
          onUpload: selectFile,
          onDelete: function onDelete() {
            setUploadedFile(null);
          },
          showHint: true,
          hintText: t("PT_ATTACH_RESTRICTIONS_SIZE"),
          message: uploadedFile ? "1 " + t("ES_PT_ACTION_FILEUPLOADED") : t("ES_PT_ACTION_NO_FILEUPLOADED")
        })
      }]
    }]
  };
};

var configPTAssessProperty = function configPTAssessProperty(_ref) {
  var t = _ref.t,
      action = _ref.action,
      financialYears = _ref.financialYears,
      selectedFinancialYear = _ref.selectedFinancialYear,
      setSelectedFinancialYear = _ref.setSelectedFinancialYear;
  return {
    label: {
      heading: "WF_" + action.action + "_APPLICATION",
      submit: "WF_PT.CREATE_" + action.action,
      cancel: "ES_PT_COMMON_CANCEL"
    },
    form: [{
      body: [{
        label: t("ES_PT_FINANCIAL_YEARS"),
        isMandatory: true,
        type: "radio",
        populators: /*#__PURE__*/React.createElement(RadioButtons, {
          options: financialYears,
          optionsKey: "name",
          onSelect: setSelectedFinancialYear,
          selectedOption: selectedFinancialYear
        })
      }]
    }]
  };
};

var configTLApproverApplication = function configTLApproverApplication(_ref) {
  var t = _ref.t,
      action = _ref.action,
      approvers = _ref.approvers,
      selectedApprover = _ref.selectedApprover,
      setSelectedApprover = _ref.setSelectedApprover,
      selectFile = _ref.selectFile,
      uploadedFile = _ref.uploadedFile,
      setUploadedFile = _ref.setUploadedFile,
      businessService = _ref.businessService;
  var checkCondtions = true;
  if ((action === null || action === void 0 ? void 0 : action.action) == "SENDBACKTOCITIZEN") checkCondtions = false;
  if (action.isTerminateState) checkCondtions = false;
  return {
    label: {
      heading: "WF_" + (action === null || action === void 0 ? void 0 : action.action) + "_APPLICATION",
      submit: "WF_" + (businessService === null || businessService === void 0 ? void 0 : businessService.toUpperCase()) + "_" + (action === null || action === void 0 ? void 0 : action.action),
      cancel: "WF_EMPLOYEE_NEWTL_CANCEL"
    },
    form: [{
      body: [{
        label: !checkCondtions ? null : t("WF_ASSIGNEE_NAME_LABEL"),
        placeholder: !checkCondtions ? null : t("WF_ASSIGNEE_NAME_PLACEHOLDER"),
        type: "dropdown",
        populators: !checkCondtions ? null : /*#__PURE__*/React.createElement(Dropdown, {
          option: approvers,
          autoComplete: "off",
          optionKey: "name",
          id: "fieldInspector",
          select: setSelectedApprover,
          selected: selectedApprover
        })
      }, {
        label: t("WF_COMMON_COMMENTS"),
        type: "textarea",
        populators: {
          name: "comments"
        }
      }, {
        label: t("TL_APPROVAL_CHECKLIST_BUTTON_UP_FILE"),
        populators: /*#__PURE__*/React.createElement(UploadFile, {
          onUpload: selectFile,
          onDelete: function onDelete() {
            setUploadedFile(null);
          },
          message: uploadedFile ? "1 " + t("ES_PT_ACTION_FILEUPLOADED") : t("CS_ACTION_NO_FILEUPLOADED")
        })
      }]
    }]
  };
};

var Heading = function Heading(props) {
  return /*#__PURE__*/React.createElement("h1", {
    className: "heading-m"
  }, props.label);
};

var Close = function Close() {
  return /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#FFFFFF"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
  }));
};

var CloseBtn = function CloseBtn(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "icon-bg-secondary",
    onClick: props.onClick
  }, /*#__PURE__*/React.createElement(Close, null));
};

var ActionModal = function ActionModal(_ref) {
  var _action$assigneeRoles, _action$assigneeRoles2;

  var t = _ref.t,
      action = _ref.action,
      tenantId = _ref.tenantId,
      closeModal = _ref.closeModal,
      submitAction = _ref.submitAction,
      applicationData = _ref.applicationData,
      businessService = _ref.businessService,
      moduleCode = _ref.moduleCode;

  var _Digit$Hooks$useEmplo = Digit.Hooks.useEmployeeSearch(tenantId, {
    roles: action === null || action === void 0 ? void 0 : (_action$assigneeRoles = action.assigneeRoles) === null || _action$assigneeRoles === void 0 ? void 0 : (_action$assigneeRoles2 = _action$assigneeRoles.map) === null || _action$assigneeRoles2 === void 0 ? void 0 : _action$assigneeRoles2.call(_action$assigneeRoles, function (e) {
      return {
        code: e
      };
    }),
    isActive: true
  }, {
    enabled: !(action !== null && action !== void 0 && action.isTerminateState)
  }),
      approverData = _Digit$Hooks$useEmplo.data,
      PTALoading = _Digit$Hooks$useEmplo.isLoading;

  var _Digit$Hooks$pt$useMD = Digit.Hooks.pt.useMDMS(tenantId, businessService, "FINANCIAL_YEARLS", {}, {
    details: {
      tenantId: Digit.ULBService.getStateId(),
      moduleDetails: [{
        moduleName: "egf-master",
        masterDetails: [{
          name: "FinancialYear",
          filter: "[?(@.module == 'PT')]"
        }]
      }]
    }
  }),
      financialYearsLoading = _Digit$Hooks$pt$useMD.isLoading,
      financialYearsData = _Digit$Hooks$pt$useMD.data;

  var _useState = useState({}),
      config = _useState[0],
      setConfig = _useState[1];

  var _useState2 = useState({}),
      defaultValues = _useState2[0];

  var _useState3 = useState([]),
      approvers = _useState3[0],
      setApprovers = _useState3[1];

  var _useState4 = useState(null),
      selectedApprover = _useState4[0],
      setSelectedApprover = _useState4[1];

  var _useState5 = useState(null),
      file = _useState5[0],
      setFile = _useState5[1];

  var _useState6 = useState(null),
      uploadedFile = _useState6[0],
      setUploadedFile = _useState6[1];

  var _useState7 = useState(null),
      setError = _useState7[1];

  var _useState8 = useState([]),
      financialYears = _useState8[0],
      setFinancialYears = _useState8[1];

  var _useState9 = useState(null),
      selectedFinancialYear = _useState9[0],
      setSelectedFinancialYear = _useState9[1];

  var _useState10 = useState(false);

  useEffect(function () {
    if (financialYearsData && financialYearsData["egf-master"]) {
      var _financialYearsData$e;

      setFinancialYears((_financialYearsData$e = financialYearsData["egf-master"]) === null || _financialYearsData$e === void 0 ? void 0 : _financialYearsData$e["FinancialYear"]);
    }
  }, [financialYearsData]);
  useEffect(function () {
    var _approverData$Employe;

    setApprovers(approverData === null || approverData === void 0 ? void 0 : (_approverData$Employe = approverData.Employees) === null || _approverData$Employe === void 0 ? void 0 : _approverData$Employe.map(function (employee) {
      var _employee$user;

      return {
        uuid: employee === null || employee === void 0 ? void 0 : employee.uuid,
        name: employee === null || employee === void 0 ? void 0 : (_employee$user = employee.user) === null || _employee$user === void 0 ? void 0 : _employee$user.name
      };
    }));
  }, [approverData]);

  function selectFile(e) {
    setFile(e.target.files[0]);
  }

  useEffect(function () {
    (function () {
      try {
        setError(null);

        var _temp4 = function () {
          if (file) {
            var _temp5 = function () {
              if (file.size >= 5242880) {
                setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
              } else {
                var _temp6 = _catch(function () {
                  return Promise.resolve(Digit.UploadServices.Filestorage("PT", file, tenantId === null || tenantId === void 0 ? void 0 : tenantId.split(".")[0])).then(function (response) {
                    var _response$data, _response$data$files;

                    if ((response === null || response === void 0 ? void 0 : (_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$files = _response$data.files) === null || _response$data$files === void 0 ? void 0 : _response$data$files.length) > 0) {
                      var _response$data2, _response$data2$files;

                      setUploadedFile(response === null || response === void 0 ? void 0 : (_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : (_response$data2$files = _response$data2.files[0]) === null || _response$data2$files === void 0 ? void 0 : _response$data2$files.fileStoreId);
                    } else {
                      setError(t("CS_FILE_UPLOAD_ERROR"));
                    }
                  });
                }, function (err) {
                  console.error("Modal -> err ", err);
                  setError(t("CS_FILE_UPLOAD_ERROR"));
                });

                if (_temp6 && _temp6.then) return _temp6.then(function () {});
              }
            }();

            if (_temp5 && _temp5.then) return _temp5.then(function () {});
          }
        }();

        return _temp4 && _temp4.then ? _temp4.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [file]);

  function submit(data) {
    if (!(action !== null && action !== void 0 && action.showFinancialYearsModal)) {
      var workflow = {
        action: action === null || action === void 0 ? void 0 : action.action,
        comments: data === null || data === void 0 ? void 0 : data.comments,
        businessService: businessService,
        moduleName: moduleCode
      };
      workflow["assignes"] = action !== null && action !== void 0 && action.isTerminateState || !selectedApprover ? [] : [selectedApprover];
      if (uploadedFile) workflow["documents"] = [{
        documentType: (action === null || action === void 0 ? void 0 : action.action) + " DOC",
        fileName: file === null || file === void 0 ? void 0 : file.name,
        fileStoreId: uploadedFile
      }];
      submitAction({
        Property: _extends({}, applicationData, {
          workflow: workflow
        })
      });
    } else {
      submitAction({
        customFunctionToExecute: action === null || action === void 0 ? void 0 : action.customFunctionToExecute,
        Assessment: {
          financialYear: selectedFinancialYear === null || selectedFinancialYear === void 0 ? void 0 : selectedFinancialYear.name,
          propertyId: applicationData === null || applicationData === void 0 ? void 0 : applicationData.propertyId,
          tenantId: tenantId,
          source: applicationData === null || applicationData === void 0 ? void 0 : applicationData.source,
          channel: applicationData === null || applicationData === void 0 ? void 0 : applicationData.channel,
          assessmentDate: Date.now()
        }
      });
    }
  }

  useEffect(function () {
    if (action) {
      if (action !== null && action !== void 0 && action.showFinancialYearsModal) {
        setConfig(configPTAssessProperty({
          t: t,
          action: action,
          financialYears: financialYears,
          selectedFinancialYear: selectedFinancialYear,
          setSelectedFinancialYear: setSelectedFinancialYear
        }));
      } else {
        setConfig(configPTApproverApplication({
          t: t,
          action: action,
          approvers: approvers,
          selectedApprover: selectedApprover,
          setSelectedApprover: setSelectedApprover,
          selectFile: selectFile,
          uploadedFile: uploadedFile,
          setUploadedFile: setUploadedFile,
          businessService: businessService
        }));
      }
    }
  }, [action, approvers, financialYears, selectedFinancialYear, uploadedFile]);
  return action && config.form ? /*#__PURE__*/React.createElement(Modal, {
    headerBarMain: /*#__PURE__*/React.createElement(Heading, {
      label: t(config.label.heading)
    }),
    headerBarEnd: /*#__PURE__*/React.createElement(CloseBtn, {
      onClick: closeModal
    }),
    actionCancelLabel: t(config.label.cancel),
    actionCancelOnSubmit: closeModal,
    actionSaveLabel: t(config.label.submit),
    actionSaveOnSubmit: function actionSaveOnSubmit() {},
    isDisabled: !action.showFinancialYearsModal ? PTALoading || (action === null || action === void 0 ? void 0 : action.docUploadRequired) && !uploadedFile : !selectedFinancialYear,
    formId: "modal-action"
  }, financialYearsLoading ? /*#__PURE__*/React.createElement(Loader, null) : /*#__PURE__*/React.createElement(FormComposer, {
    config: config.form,
    noBoxShadow: true,
    inline: true,
    childrenAtTheBottom: true,
    onSubmit: submit,
    defaultValues: defaultValues,
    formId: "modal-action"
  })) : /*#__PURE__*/React.createElement(Loader, null);
};

var Heading$1 = function Heading(props) {
  return /*#__PURE__*/React.createElement("h1", {
    className: "heading-m"
  }, props.label);
};

var Close$1 = function Close() {
  return /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#FFFFFF"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
  }));
};

var CloseBtn$1 = function CloseBtn(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "icon-bg-secondary",
    onClick: props.onClick
  }, /*#__PURE__*/React.createElement(Close$1, null));
};

var ActionModal$1 = function ActionModal(_ref) {
  var _action$assigneeRoles, _action$assigneeRoles2;

  var t = _ref.t,
      action = _ref.action,
      tenantId = _ref.tenantId,
      closeModal = _ref.closeModal,
      submitAction = _ref.submitAction,
      applicationData = _ref.applicationData,
      businessService = _ref.businessService;

  var _Digit$Hooks$useEmplo = Digit.Hooks.useEmployeeSearch(tenantId, {
    roles: action === null || action === void 0 ? void 0 : (_action$assigneeRoles = action.assigneeRoles) === null || _action$assigneeRoles === void 0 ? void 0 : (_action$assigneeRoles2 = _action$assigneeRoles.map) === null || _action$assigneeRoles2 === void 0 ? void 0 : _action$assigneeRoles2.call(_action$assigneeRoles, function (e) {
      return {
        code: e
      };
    }),
    isActive: true
  }, {
    enabled: !(action !== null && action !== void 0 && action.isTerminateState)
  }),
      approverData = _Digit$Hooks$useEmplo.data;

  var _Digit$Hooks$pt$useMD = Digit.Hooks.pt.useMDMS(tenantId, businessService, "FINANCIAL_YEARLS", {}, {
    details: {
      tenantId: Digit.ULBService.getStateId(),
      moduleDetails: [{
        moduleName: "egf-master",
        masterDetails: [{
          name: "FinancialYear",
          filter: "[?(@.module == 'TL')]"
        }]
      }]
    }
  }),
      financialYearsLoading = _Digit$Hooks$pt$useMD.isLoading,
      financialYearsData = _Digit$Hooks$pt$useMD.data;

  var _useState = useState({}),
      config = _useState[0],
      setConfig = _useState[1];

  var _useState2 = useState({}),
      defaultValues = _useState2[0];

  var _useState3 = useState([]),
      approvers = _useState3[0],
      setApprovers = _useState3[1];

  var _useState4 = useState({}),
      selectedApprover = _useState4[0],
      setSelectedApprover = _useState4[1];

  var _useState5 = useState(null),
      file = _useState5[0],
      setFile = _useState5[1];

  var _useState6 = useState(null),
      uploadedFile = _useState6[0],
      setUploadedFile = _useState6[1];

  var _useState7 = useState(null),
      setError = _useState7[1];

  var _useState8 = useState([]),
      financialYears = _useState8[0],
      setFinancialYears = _useState8[1];

  var _useState9 = useState(null),
      selectedFinancialYear = _useState9[0];

  useEffect(function () {
    if (financialYearsData && financialYearsData["egf-master"]) {
      var _financialYearsData$e;

      setFinancialYears((_financialYearsData$e = financialYearsData["egf-master"]) === null || _financialYearsData$e === void 0 ? void 0 : _financialYearsData$e["FinancialYear"]);
    }
  }, [financialYearsData]);
  useEffect(function () {
    var _approverData$Employe;

    setApprovers(approverData === null || approverData === void 0 ? void 0 : (_approverData$Employe = approverData.Employees) === null || _approverData$Employe === void 0 ? void 0 : _approverData$Employe.map(function (employee) {
      var _employee$user;

      return {
        uuid: employee === null || employee === void 0 ? void 0 : employee.uuid,
        name: employee === null || employee === void 0 ? void 0 : (_employee$user = employee.user) === null || _employee$user === void 0 ? void 0 : _employee$user.name
      };
    }));
  }, [approverData]);

  function selectFile(e) {
    setFile(e.target.files[0]);
  }

  useEffect(function () {
    (function () {
      try {
        setError(null);

        var _temp4 = function () {
          if (file) {
            var _temp5 = function () {
              if (file.size >= 5242880) {
                setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
              } else {
                var _temp6 = _catch(function () {
                  return Promise.resolve(Digit.UploadServices.Filestorage("PT", file, tenantId === null || tenantId === void 0 ? void 0 : tenantId.split(".")[0])).then(function (response) {
                    var _response$data, _response$data$files;

                    if ((response === null || response === void 0 ? void 0 : (_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$files = _response$data.files) === null || _response$data$files === void 0 ? void 0 : _response$data$files.length) > 0) {
                      var _response$data2, _response$data2$files;

                      setUploadedFile(response === null || response === void 0 ? void 0 : (_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : (_response$data2$files = _response$data2.files[0]) === null || _response$data2$files === void 0 ? void 0 : _response$data2$files.fileStoreId);
                    } else {
                      setError(t("CS_FILE_UPLOAD_ERROR"));
                    }
                  });
                }, function (err) {
                  console.error("Modal -> err ", err);
                  setError(t("CS_FILE_UPLOAD_ERROR"));
                });

                if (_temp6 && _temp6.then) return _temp6.then(function () {});
              }
            }();

            if (_temp5 && _temp5.then) return _temp5.then(function () {});
          }
        }();

        return _temp4 && _temp4.then ? _temp4.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [file]);

  function submit(data) {
    applicationData = _extends({}, applicationData, {
      action: action === null || action === void 0 ? void 0 : action.action,
      comment: data === null || data === void 0 ? void 0 : data.comments,
      assignee: !(selectedApprover !== null && selectedApprover !== void 0 && selectedApprover.uuid) ? null : [selectedApprover === null || selectedApprover === void 0 ? void 0 : selectedApprover.uuid],
      wfDocuments: uploadedFile ? [{
        documentType: (action === null || action === void 0 ? void 0 : action.action) + " DOC",
        fileName: file === null || file === void 0 ? void 0 : file.name,
        fileStoreId: uploadedFile
      }] : null
    });
    submitAction({
      Licenses: [applicationData]
    });
  }

  useEffect(function () {
    if (action) {
      setConfig(configTLApproverApplication({
        t: t,
        action: action,
        approvers: approvers,
        selectedApprover: selectedApprover,
        setSelectedApprover: setSelectedApprover,
        selectFile: selectFile,
        uploadedFile: uploadedFile,
        setUploadedFile: setUploadedFile,
        businessService: businessService
      }));
    }
  }, [action, approvers, financialYears, selectedFinancialYear, uploadedFile]);
  return action && config.form ? /*#__PURE__*/React.createElement(Modal, {
    headerBarMain: /*#__PURE__*/React.createElement(Heading$1, {
      label: t(config.label.heading)
    }),
    headerBarEnd: /*#__PURE__*/React.createElement(CloseBtn$1, {
      onClick: closeModal
    }),
    actionCancelLabel: t(config.label.cancel),
    actionCancelOnSubmit: closeModal,
    actionSaveLabel: t(config.label.submit),
    actionSaveOnSubmit: function actionSaveOnSubmit() {},
    formId: "modal-action"
  }, financialYearsLoading ? /*#__PURE__*/React.createElement(Loader, null) : /*#__PURE__*/React.createElement(FormComposer, {
    config: config.form,
    noBoxShadow: true,
    inline: true,
    childrenAtTheBottom: true,
    onSubmit: submit,
    defaultValues: defaultValues,
    formId: "modal-action"
  })) : /*#__PURE__*/React.createElement(Loader, null);
};

var ActionModal$2 = function ActionModal$2(props) {
  if (props !== null && props !== void 0 && props.businessService.includes("PT")) {
    return /*#__PURE__*/React.createElement(ActionModal, props);
  }

  if (props !== null && props !== void 0 && props.businessService.includes("NewTL") || props !== null && props !== void 0 && props.businessService.includes("TL") || props !== null && props !== void 0 && props.businessService.includes("EDITRENEWAL") || props !== null && props !== void 0 && props.businessService.includes("DIRECTRENEWAL")) {
    return /*#__PURE__*/React.createElement(ActionModal$1, props);
  }
};

var Reason = function Reason(_ref) {
  var headComment = _ref.headComment,
      otherComment = _ref.otherComment;
  return /*#__PURE__*/React.createElement("div", {
    className: "checkpoint-comments-wrap"
  }, /*#__PURE__*/React.createElement("h4", null, headComment), /*#__PURE__*/React.createElement("p", null, otherComment));
};

var TLCaption = function TLCaption(_ref) {
  var data = _ref.data;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React.createElement("div", null, data.date && /*#__PURE__*/React.createElement("p", null, data.date), /*#__PURE__*/React.createElement("p", null, data.name), data.mobileNumber && /*#__PURE__*/React.createElement(TelePhone, {
    mobile: data.mobileNumber
  }), data.source && /*#__PURE__*/React.createElement("p", null, t("ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_" + data.source.toUpperCase())), data.comment && /*#__PURE__*/React.createElement(Reason, {
    otherComment: data === null || data === void 0 ? void 0 : data.otherComment,
    headComment: data === null || data === void 0 ? void 0 : data.comment
  }));
};

var PDFSvg$1 = function PDFSvg(_ref) {
  var _ref$width = _ref.width,
      width = _ref$width === void 0 ? 34 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === void 0 ? 34 : _ref$height,
      style = _ref.style;
  return /*#__PURE__*/React.createElement("svg", {
    style: style,
    xmlns: "http://www.w3.org/2000/svg",
    width: width,
    height: height,
    viewBox: "0 0 34 34",
    fill: "gray"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"
  }));
};

function PropertyDocuments(_ref2) {
  var documents = _ref2.documents;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState(function () {
  }),
      filesArray = _useState[0],
      setFilesArray = _useState[1];

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useState2 = useState({}),
      pdfFiles = _useState2[0],
      setPdfFiles = _useState2[1];

  useEffect(function () {
    var _acc;

    var acc = [];
    documents === null || documents === void 0 ? void 0 : documents.forEach(function (element, index, array) {
      acc = [].concat(acc, element.values);
    });
    setFilesArray((_acc = acc) === null || _acc === void 0 ? void 0 : _acc.map(function (value) {
      return value === null || value === void 0 ? void 0 : value.fileStoreId;
    }));
  }, [documents]);
  useEffect(function () {
    Digit.UploadServices.Filefetch(filesArray, tenantId.split(".")[0]).then(function (res) {
      setPdfFiles(res === null || res === void 0 ? void 0 : res.data);
    });
  }, [filesArray]);
  var checkLocation = window.location.href.includes("employee/tl");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "19px"
    }
  }, documents === null || documents === void 0 ? void 0 : documents.map(function (document, index) {
    var _document$values;

    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: index
    }, /*#__PURE__*/React.createElement(CardSubHeader, {
      style: checkLocation ? {
        marginTop: "32px",
        marginBottom: "18px",
        color: "#0B0C0C, 100%",
        fontSize: "24px",
        lineHeight: "30px"
      } : {
        marginTop: "32px",
        marginBottom: "8px",
        color: "#505A5F",
        fontSize: "24px"
      }
    }, t(document === null || document === void 0 ? void 0 : document.title)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap"
      }
    }, document === null || document === void 0 ? void 0 : (_document$values = document.values) === null || _document$values === void 0 ? void 0 : _document$values.map(function (value, index) {
      var _pdfFiles$value$fileS;

      return /*#__PURE__*/React.createElement("a", {
        target: "_",
        href: (_pdfFiles$value$fileS = pdfFiles[value.fileStoreId]) === null || _pdfFiles$value$fileS === void 0 ? void 0 : _pdfFiles$value$fileS.split(",")[0],
        style: {
          minWidth: "160px",
          marginRight: "20px"
        },
        key: index
      }, /*#__PURE__*/React.createElement(PDFSvg$1, {
        width: 140,
        height: 140,
        style: {
          background: "#f6f6f6",
          padding: "8px"
        }
      }), /*#__PURE__*/React.createElement("p", {
        style: checkLocation ? {
          marginTop: "8px",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "16px",
          lineHeight: "19px",
          color: "#505A5F"
        } : {
          marginTop: "8px",
          fontWeight: "bold",
          textAlign: "center"
        }
      }, t(value === null || value === void 0 ? void 0 : value.title)));
    })));
  }));
}

function PropertyFloors(_ref) {
  var floors = _ref.floors;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React.createElement(React.Fragment, null, floors.map(function (floor) {
    var _floor$values;

    return /*#__PURE__*/React.createElement("div", {
      key: t(floor === null || floor === void 0 ? void 0 : floor.title),
      style: {
        marginTop: "19px"
      }
    }, /*#__PURE__*/React.createElement(CardSubHeader, {
      style: {
        marginBottom: "8px",
        color: "#505A5F",
        fontSize: "24px"
      }
    }, t(floor === null || floor === void 0 ? void 0 : floor.title)), floor === null || floor === void 0 ? void 0 : (_floor$values = floor.values) === null || _floor$values === void 0 ? void 0 : _floor$values.map(function (value, index) {
      var _value$values;

      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: index
      }, /*#__PURE__*/React.createElement(CardSectionHeader, {
        style: {
          marginBottom: "16px",
          color: "#505A5F",
          fontSize: "16px",
          marginTop: index !== 0 ? "16px" : "revert"
        }
      }, t(value.title)), /*#__PURE__*/React.createElement(StatusTable, {
        style: {
          position: "relative",
          padding: "8px"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          maxWidth: "640px",
          border: "1px solid #D6D5D4",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: "auto"
        }
      }), value === null || value === void 0 ? void 0 : (_value$values = value.values) === null || _value$values === void 0 ? void 0 : _value$values.map(function (value, index) {
        var _value$values2;

        if (value.map === true && value.value !== "N/A") {
          return /*#__PURE__*/React.createElement(Row, {
            key: t(value.title),
            label: t(value.title),
            text: /*#__PURE__*/React.createElement("img", {
              src: t(value.value),
              alt: ""
            })
          });
        }

        return /*#__PURE__*/React.createElement(Row, {
          key: t(value.title),
          label: t(value.title),
          text: t(value.value) || "N/A",
          last: index === (value === null || value === void 0 ? void 0 : (_value$values2 = value.values) === null || _value$values2 === void 0 ? void 0 : _value$values2.length) - 1,
          caption: value.caption,
          className: "border-none"
        });
      })));
    }));
  }));
}

function PropertyEstimates(_ref) {
  var taxHeadEstimatesCalculation = _ref.taxHeadEstimatesCalculation;
  var taxHeadEstimates = taxHeadEstimatesCalculation.taxHeadEstimates;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "40px"
    }
  }, /*#__PURE__*/React.createElement(StatusTable, null, /*#__PURE__*/React.createElement(Row, {
    label: t("ES_PT_TITLE_TAX_HEADS"),
    text: t("ES_PT_TITLE_AMOUNT"),
    className: "border-none",
    textStyle: {
      fontWeight: "bold"
    }
  }), /*#__PURE__*/React.createElement(BreakLine, {
    style: {
      margin: "16px 0",
      width: "40%"
    }
  }), taxHeadEstimates === null || taxHeadEstimates === void 0 ? void 0 : taxHeadEstimates.map(function (estimate, index) {
    return /*#__PURE__*/React.createElement(Row, {
      key: t(estimate.taxHeadCode),
      label: t(estimate.taxHeadCode),
      text: "\u20B9 " + estimate.estimateAmount || "N/A",
      last: index === (taxHeadEstimates === null || taxHeadEstimates === void 0 ? void 0 : taxHeadEstimates.length) - 1,
      className: "border-none",
      textStyle: {
        color: "#505A5F"
      },
      labelStyle: {
        color: "#505A5F"
      }
    });
  }), /*#__PURE__*/React.createElement(BreakLine, {
    style: {
      margin: "16px 0",
      width: "40%"
    }
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("ES_PT_TITLE_TOTAL_DUE_AMOUNT"),
    text: "\u20B9 " + (taxHeadEstimatesCalculation === null || taxHeadEstimatesCalculation === void 0 ? void 0 : taxHeadEstimatesCalculation.totalAmount) || "N/A",
    className: "border-none",
    textStyle: {
      fontSize: "24px",
      fontWeight: "bold"
    }
  })));
}

function PropertyOwners(_ref) {
  var owners = _ref.owners;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;
  var checkOwnerLength = (owners === null || owners === void 0 ? void 0 : owners.length) || 1;
  var cardStyles = {
    marginTop: "19px"
  };
  var statusTableStyles = {
    position: "relative",
    padding: "8px"
  };

  if ( Number(checkOwnerLength) > 1) {
    cardStyles = {
      marginTop: "19px",
      background: "#FAFAFA",
      border: "1px solid #D6D5D4",
      borderRadius: "4px",
      padding: "8px",
      lineHeight: "19px",
      maxWidth: "600px",
      minWidth: "280px"
    };
  } else if ( !(Number(checkOwnerLength) > 1)) {
    cardStyles = {
      marginTop: "19px",
      lineHeight: "19px",
      maxWidth: "600px",
      minWidth: "280px"
    };
    statusTableStyles = {
      position: "relative",
      marginTop: "19px"
    };
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, owners.map(function (owner, index) {
    var _owner$values;

    return /*#__PURE__*/React.createElement("div", {
      key: t(owner === null || owner === void 0 ? void 0 : owner.title),
      style: cardStyles
    }, /*#__PURE__*/React.createElement(CardSubHeader, {
      style:  Number(checkOwnerLength) > 1 ? {
        marginBottom: "8px",
        paddingBottom: "9px",
        color: "#0B0C0C",
        fontSize: "16px",
        lineHeight: "19px"
      } : {
        marginBottom: "8px",
        color: "#505A5F",
        fontSize: "24px"
      }
    },  Number(checkOwnerLength) > 1 ? t(owner === null || owner === void 0 ? void 0 : owner.title) + " " + (index + 1) : t(owner === null || owner === void 0 ? void 0 : owner.title)), /*#__PURE__*/React.createElement(React.Fragment, {
      key: index
    }, /*#__PURE__*/React.createElement(StatusTable, {
      style: statusTableStyles
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        maxWidth: "640px",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: "auto"
      }
    }), owner === null || owner === void 0 ? void 0 : (_owner$values = owner.values) === null || _owner$values === void 0 ? void 0 : _owner$values.map(function (value, index) {
      var _value$values;

      if (value.map === true && value.value !== "N/A") {
        return /*#__PURE__*/React.createElement(Row, {
          key: t(value.title),
          label: t(value.title),
          text: /*#__PURE__*/React.createElement("img", {
            src: t(value.value),
            alt: ""
          })
        });
      }

      return /*#__PURE__*/React.createElement(Row, {
        key: t(value.title),
        label:  t(value.title) + ":",
        text: t(value.value) || "N/A",
        last: index === (value === null || value === void 0 ? void 0 : (_value$values = value.values) === null || _value$values === void 0 ? void 0 : _value$values.length) - 1,
        caption: value.caption,
        className: "border-none",
        rowContainerStyle:  {
          justifyContent: "space-between",
          fontSize: "16px",
          lineHeight: "19px",
          color: "#0B0C0C"
        } 
      });
    }))));
  }));
}

function TLTradeUnits(_ref) {
  var units = _ref.units;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React.createElement(React.Fragment, null, units.map(function (unit, index) {
    var _unit$values;

    return (
      /*#__PURE__*/
      React.createElement("div", {
        key: t(unit === null || unit === void 0 ? void 0 : unit.title),
        style: {
          marginTop: "19px",
          background: "#FAFAFA",
          border: "1px solid #D6D5D4",
          borderRadius: "4px",
          padding: "8px",
          lineHeight: "19px",
          maxWidth: "600px",
          minWidth: "280px"
        }
      }, /*#__PURE__*/React.createElement(CardSubHeader, {
        style: {
          marginBottom: "9px",
          paddingBottom: "9px",
          color: "#0B0C0C",
          fontSize: "16px",
          lineHeight: "19px"
        }
      }, t(unit === null || unit === void 0 ? void 0 : unit.title) + " " + (index + 1)), /*#__PURE__*/React.createElement(React.Fragment, {
        key: index
      }, /*#__PURE__*/React.createElement(StatusTable, {
        style: {
          position: "relative",
          marginTop: "19px"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          maxWidth: "640px",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: "auto"
        }
      }), unit === null || unit === void 0 ? void 0 : (_unit$values = unit.values) === null || _unit$values === void 0 ? void 0 : _unit$values.map(function (value, index) {
        var _value$values;

        if (value.map === true && value.value !== "N/A") {
          return /*#__PURE__*/React.createElement(Row, {
            key: t(value.title),
            label: t(value.title),
            text: /*#__PURE__*/React.createElement("img", {
              src: t(value.value),
              alt: ""
            })
          });
        }

        return /*#__PURE__*/React.createElement(Row, {
          key: t(value.title),
          label: t(value.title) + ":",
          text: t(value.value) || "NA",
          last: index === (value === null || value === void 0 ? void 0 : (_value$values = value.values) === null || _value$values === void 0 ? void 0 : _value$values.length) - 1,
          caption: value.caption,
          className: "border-none",
          rowContainerStyle: {
            justifyContent: "space-between",
            fontSize: "16px",
            lineHeight: "19px",
            color: "#0B0C0C"
          }
        });
      }))))
    );
  }));
}

function TLTradeAccessories(_ref) {
  var units = _ref.units;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React.createElement(React.Fragment, null, units.map(function (unit, index) {
    var _unit$values;

    return (
      /*#__PURE__*/
      React.createElement("div", {
        key: t(unit === null || unit === void 0 ? void 0 : unit.title),
        style: {
          marginTop: "19px",
          background: "#FAFAFA",
          border: "1px solid #D6D5D4",
          borderRadius: "4px",
          padding: "8px",
          lineHeight: "19px",
          maxWidth: "600px",
          minWidth: "280px"
        }
      }, /*#__PURE__*/React.createElement(CardSubHeader, {
        style: {
          marginBottom: "8px",
          paddingBottom: "9px",
          color: "#0B0C0C",
          fontSize: "16px",
          lineHeight: "19px"
        }
      }, t(unit === null || unit === void 0 ? void 0 : unit.title) + " " + (index + 1)), /*#__PURE__*/React.createElement(React.Fragment, {
        key: index
      }, /*#__PURE__*/React.createElement(StatusTable, {
        style: {
          position: "relative",
          marginTop: "19px"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          maxWidth: "640px",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: "auto"
        }
      }), unit === null || unit === void 0 ? void 0 : (_unit$values = unit.values) === null || _unit$values === void 0 ? void 0 : _unit$values.map(function (value, index) {
        var _value$values;

        if (value.map === true && value.value !== "N/A") {
          return /*#__PURE__*/React.createElement(Row, {
            key: t(value.title),
            label: t(value.title),
            text: /*#__PURE__*/React.createElement("img", {
              src: t(value.value),
              alt: ""
            })
          });
        }

        return /*#__PURE__*/React.createElement(Row, {
          key: t(value.title),
          label: t(value.title) + ":",
          text: t(value.value) || "N/A",
          last: index === (value === null || value === void 0 ? void 0 : (_value$values = value.values) === null || _value$values === void 0 ? void 0 : _value$values.length) - 1,
          caption: value.caption,
          className: "border-none",
          rowContainerStyle: {
            justifyContent: "space-between",
            fontSize: "16px",
            lineHeight: "19px",
            color: "#0B0C0C"
          }
        });
      }))))
    );
  }));
}

function ApplicationDetailsContent(_ref) {
  var _applicationDetails$a, _workflowDetails$data, _workflowDetails$data2, _workflowDetails$data3, _workflowDetails$data4, _workflowDetails$data5, _workflowDetails$data6, _workflowDetails$data7, _workflowDetails$data8, _workflowDetails$data9, _workflowDetails$data10;

  var applicationDetails = _ref.applicationDetails,
      workflowDetails = _ref.workflowDetails,
      isDataLoading = _ref.isDataLoading,
      applicationData = _ref.applicationData,
      timelineStatusPrefix = _ref.timelineStatusPrefix;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var getTimelineCaptions = function getTimelineCaptions(checkpoint) {
    if (checkpoint.state === "OPEN" || checkpoint.status === "INITIATED") {
      var _applicationData$audi;

      var caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$audi = applicationData.auditDetails) === null || _applicationData$audi === void 0 ? void 0 : _applicationData$audi.createdTime),
        source: (applicationData === null || applicationData === void 0 ? void 0 : applicationData.channel) || ""
      };
      return /*#__PURE__*/React.createElement(TLCaption, {
        data: caption
      });
    } else {
      var _Digit$DateUtils, _applicationData$audi2, _checkpoint$assigner, _checkpoint$assigner2;

      var _caption = {
        date: (_Digit$DateUtils = Digit.DateUtils) === null || _Digit$DateUtils === void 0 ? void 0 : _Digit$DateUtils.ConvertTimestampToDate(applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$audi2 = applicationData.auditDetails) === null || _applicationData$audi2 === void 0 ? void 0 : _applicationData$audi2.lastModifiedTime),
        name: checkpoint === null || checkpoint === void 0 ? void 0 : (_checkpoint$assigner = checkpoint.assigner) === null || _checkpoint$assigner === void 0 ? void 0 : _checkpoint$assigner.name,
        mobileNumber: checkpoint === null || checkpoint === void 0 ? void 0 : (_checkpoint$assigner2 = checkpoint.assigner) === null || _checkpoint$assigner2 === void 0 ? void 0 : _checkpoint$assigner2.mobileNumber
      };
      return /*#__PURE__*/React.createElement(TLCaption, {
        data: _caption
      });
    }
  };

  var checkLocation = window.location.href.includes("employee/tl");
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      position: "relative"
    }
  }, applicationDetails === null || applicationDetails === void 0 ? void 0 : (_applicationDetails$a = applicationDetails.applicationDetails) === null || _applicationDetails$a === void 0 ? void 0 : _applicationDetails$a.map(function (detail, index) {
    var _detail$values, _detail$additionalDet, _detail$additionalDet2, _detail$additionalDet3, _detail$additionalDet4, _detail$additionalDet5, _detail$additionalDet6, _detail$additionalDet7, _detail$additionalDet8, _detail$additionalDet9, _detail$additionalDet10, _detail$additionalDet11, _detail$additionalDet12;

    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: index
    }, /*#__PURE__*/React.createElement("div", {
      style: checkLocation ? {
        lineHeight: "19px",
        maxWidth: "600px",
        minWidth: "280px"
      } : {}
    }, index === 0 && !detail.asSectionHeader ? /*#__PURE__*/React.createElement(CardSubHeader, {
      style: {
        marginBottom: "16px"
      }
    }, t(detail.title)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CardSectionHeader, {
      style: index == 0 && checkLocation ? {
        marginBottom: "16px"
      } : {
        marginBottom: "16px",
        marginTop: "32px"
      }
    }, t(detail.title), detail !== null && detail !== void 0 && detail.Component ? /*#__PURE__*/React.createElement(detail.Component, null) : null)), /*#__PURE__*/React.createElement(StatusTable, {
      style: checkLocation ? {
        position: "relative",
        marginTop: "19px"
      } : {}
    }, detail === null || detail === void 0 ? void 0 : (_detail$values = detail.values) === null || _detail$values === void 0 ? void 0 : _detail$values.map(function (value, index) {
      var _detail$values2;

      if (value.map === true && value.value !== "N/A") {
        return /*#__PURE__*/React.createElement(Row, {
          key: t(value.title),
          label: t(value.title),
          text: /*#__PURE__*/React.createElement("img", {
            src: t(value.value),
            alt: ""
          })
        });
      }

      return /*#__PURE__*/React.createElement(Row, {
        key: t(value.title),
        label: t(value.title),
        text: t(value.value) || "N/A",
        last: index === (detail === null || detail === void 0 ? void 0 : (_detail$values2 = detail.values) === null || _detail$values2 === void 0 ? void 0 : _detail$values2.length) - 1,
        caption: value.caption,
        className: "border-none",
        rowContainerStyle: checkLocation ? {
          justifyContent: "space-between",
          fontSize: "16px",
          lineHeight: "19px",
          color: "#0B0C0C"
        } : {}
      });
    }))), (detail === null || detail === void 0 ? void 0 : detail.belowComponent) && /*#__PURE__*/React.createElement(detail.belowComponent, null), (detail === null || detail === void 0 ? void 0 : (_detail$additionalDet = detail.additionalDetails) === null || _detail$additionalDet === void 0 ? void 0 : _detail$additionalDet.floors) && /*#__PURE__*/React.createElement(PropertyFloors, {
      floors: detail === null || detail === void 0 ? void 0 : (_detail$additionalDet2 = detail.additionalDetails) === null || _detail$additionalDet2 === void 0 ? void 0 : _detail$additionalDet2.floors
    }), (detail === null || detail === void 0 ? void 0 : (_detail$additionalDet3 = detail.additionalDetails) === null || _detail$additionalDet3 === void 0 ? void 0 : _detail$additionalDet3.owners) && /*#__PURE__*/React.createElement(PropertyOwners, {
      owners: detail === null || detail === void 0 ? void 0 : (_detail$additionalDet4 = detail.additionalDetails) === null || _detail$additionalDet4 === void 0 ? void 0 : _detail$additionalDet4.owners
    }), (detail === null || detail === void 0 ? void 0 : (_detail$additionalDet5 = detail.additionalDetails) === null || _detail$additionalDet5 === void 0 ? void 0 : _detail$additionalDet5.units) && /*#__PURE__*/React.createElement(TLTradeUnits, {
      units: detail === null || detail === void 0 ? void 0 : (_detail$additionalDet6 = detail.additionalDetails) === null || _detail$additionalDet6 === void 0 ? void 0 : _detail$additionalDet6.units
    }), (detail === null || detail === void 0 ? void 0 : (_detail$additionalDet7 = detail.additionalDetails) === null || _detail$additionalDet7 === void 0 ? void 0 : _detail$additionalDet7.accessories) && /*#__PURE__*/React.createElement(TLTradeAccessories, {
      units: detail === null || detail === void 0 ? void 0 : (_detail$additionalDet8 = detail.additionalDetails) === null || _detail$additionalDet8 === void 0 ? void 0 : _detail$additionalDet8.accessories
    }), (detail === null || detail === void 0 ? void 0 : (_detail$additionalDet9 = detail.additionalDetails) === null || _detail$additionalDet9 === void 0 ? void 0 : _detail$additionalDet9.documents) && /*#__PURE__*/React.createElement(PropertyDocuments, {
      documents: detail === null || detail === void 0 ? void 0 : (_detail$additionalDet10 = detail.additionalDetails) === null || _detail$additionalDet10 === void 0 ? void 0 : _detail$additionalDet10.documents
    }), (detail === null || detail === void 0 ? void 0 : (_detail$additionalDet11 = detail.additionalDetails) === null || _detail$additionalDet11 === void 0 ? void 0 : _detail$additionalDet11.taxHeadEstimatesCalculation) && /*#__PURE__*/React.createElement(PropertyEstimates, {
      taxHeadEstimatesCalculation: detail === null || detail === void 0 ? void 0 : (_detail$additionalDet12 = detail.additionalDetails) === null || _detail$additionalDet12 === void 0 ? void 0 : _detail$additionalDet12.taxHeadEstimatesCalculation
    }));
  }), (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data = workflowDetails.data) === null || _workflowDetails$data === void 0 ? void 0 : (_workflowDetails$data2 = _workflowDetails$data.timeline) === null || _workflowDetails$data2 === void 0 ? void 0 : _workflowDetails$data2.length) > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BreakLine, null), ((workflowDetails === null || workflowDetails === void 0 ? void 0 : workflowDetails.isLoading) || isDataLoading) && /*#__PURE__*/React.createElement(Loader, null), !(workflowDetails !== null && workflowDetails !== void 0 && workflowDetails.isLoading) && !isDataLoading && /*#__PURE__*/React.createElement(Fragment$1, null, /*#__PURE__*/React.createElement(CardSectionHeader, {
    style: {
      marginBottom: "16px",
      marginTop: "32px"
    }
  }, t("ES_APPLICATION_DETAILS_APPLICATION_TIMELINE")), workflowDetails !== null && workflowDetails !== void 0 && (_workflowDetails$data3 = workflowDetails.data) !== null && _workflowDetails$data3 !== void 0 && _workflowDetails$data3.timeline && (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data4 = workflowDetails.data) === null || _workflowDetails$data4 === void 0 ? void 0 : (_workflowDetails$data5 = _workflowDetails$data4.timeline) === null || _workflowDetails$data5 === void 0 ? void 0 : _workflowDetails$data5.length) === 1 ? /*#__PURE__*/React.createElement(CheckPoint, {
    isCompleted: true,
    label: t("" + timelineStatusPrefix + (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data6 = workflowDetails.data) === null || _workflowDetails$data6 === void 0 ? void 0 : (_workflowDetails$data7 = _workflowDetails$data6.timeline[0]) === null || _workflowDetails$data7 === void 0 ? void 0 : _workflowDetails$data7.state)),
    customChild: getTimelineCaptions(workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data8 = workflowDetails.data) === null || _workflowDetails$data8 === void 0 ? void 0 : _workflowDetails$data8.timeline[0])
  }) : /*#__PURE__*/React.createElement(ConnectingCheckPoints, null, (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data9 = workflowDetails.data) === null || _workflowDetails$data9 === void 0 ? void 0 : _workflowDetails$data9.timeline) && (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data10 = workflowDetails.data) === null || _workflowDetails$data10 === void 0 ? void 0 : _workflowDetails$data10.timeline.map(function (checkpoint, index, arr) {
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: index
    }, /*#__PURE__*/React.createElement(CheckPoint, {
      keyValue: index,
      isCompleted: index === 0,
      info: checkpoint.comment,
      label: t("" + timelineStatusPrefix + ((checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.performedAction) === "REOPEN" ? checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.performedAction : checkpoint.state)),
      customChild: getTimelineCaptions(checkpoint)
    }));
  }))))));
}

function ApplicationDetailsToast(_ref) {
  var _showToast$action, _showToast$error, _showToast$error2, _showToast$error3, _showToast$error4, _showToast$error5, _showToast$error6, _showToast$error7, _showToast$error8, _showToast$action2;

  var t = _ref.t,
      showToast = _ref.showToast,
      closeToast = _ref.closeToast,
      businessService = _ref.businessService;

  if (businessService.includes("NewTL") || businessService.includes("TL") || businessService.includes("EDITRENEWAL")) {
    var label = "";

    switch (showToast === null || showToast === void 0 ? void 0 : (_showToast$action = showToast.action) === null || _showToast$action === void 0 ? void 0 : _showToast$action.action) {
      case "SENDBACK":
        label = (showToast === null || showToast === void 0 ? void 0 : showToast.key) === "error" ? showToast === null || showToast === void 0 ? void 0 : (_showToast$error = showToast.error) === null || _showToast$error === void 0 ? void 0 : _showToast$error.message : t("TL_SENDBACK_CHECKLIST_MESSAGE_HEAD");
        break;

      case "FORWARD":
        label = (showToast === null || showToast === void 0 ? void 0 : showToast.key) === "error" ? showToast === null || showToast === void 0 ? void 0 : (_showToast$error2 = showToast.error) === null || _showToast$error2 === void 0 ? void 0 : _showToast$error2.message : t("TL_FORWARD_SUCCESS_MESSAGE_MAIN");
        break;

      case "APPROVE":
        label = (showToast === null || showToast === void 0 ? void 0 : showToast.key) === "error" ? showToast === null || showToast === void 0 ? void 0 : (_showToast$error3 = showToast.error) === null || _showToast$error3 === void 0 ? void 0 : _showToast$error3.message : t("TL_APPROVAL_CHECKLIST_MESSAGE_HEAD");
        break;

      case "SENDBACKTOCITIZEN":
        label = (showToast === null || showToast === void 0 ? void 0 : showToast.key) === "error" ? showToast === null || showToast === void 0 ? void 0 : (_showToast$error4 = showToast.error) === null || _showToast$error4 === void 0 ? void 0 : _showToast$error4.message : t("TL_SENDBACK_TOCITIZEN_CHECKLIST_MESSAGE_HEAD");
        break;

      case "REJECT":
        label = (showToast === null || showToast === void 0 ? void 0 : showToast.key) === "error" ? showToast === null || showToast === void 0 ? void 0 : (_showToast$error5 = showToast.error) === null || _showToast$error5 === void 0 ? void 0 : _showToast$error5.message : t("TL_APPROVAL_REJ_MESSAGE_HEAD");
        break;

      case "RESUBMIT":
        label = (showToast === null || showToast === void 0 ? void 0 : showToast.key) === "error" ? showToast === null || showToast === void 0 ? void 0 : (_showToast$error6 = showToast.error) === null || _showToast$error6 === void 0 ? void 0 : _showToast$error6.message : t("TL_APPLICATION_RESUBMIT_SUCCESS_MESSAGE_MAIN");
        break;

      case "CANCEL":
        label = (showToast === null || showToast === void 0 ? void 0 : showToast.key) === "error" ? showToast === null || showToast === void 0 ? void 0 : (_showToast$error7 = showToast.error) === null || _showToast$error7 === void 0 ? void 0 : _showToast$error7.message : t("TL_TL_CANCELLED_MESSAGE_HEAD");
        break;

      default:
        label = (showToast === null || showToast === void 0 ? void 0 : showToast.key) === "error" ? showToast === null || showToast === void 0 ? void 0 : (_showToast$error8 = showToast.error) === null || _showToast$error8 === void 0 ? void 0 : _showToast$error8.message : "ES_" + businessService + "_" + (showToast === null || showToast === void 0 ? void 0 : (_showToast$action2 = showToast.action) === null || _showToast$action2 === void 0 ? void 0 : _showToast$action2.action) + "_UPDATE_SUCCESS";
    }

    return /*#__PURE__*/React.createElement(React.Fragment, null, showToast && /*#__PURE__*/React.createElement(Toast, {
      error: showToast.key === "error",
      label: label,
      onClose: closeToast
    }));
  } else {
    var _showToast$error9, _showToast$action3;

    var _label = (showToast === null || showToast === void 0 ? void 0 : showToast.key) === "error" ? showToast === null || showToast === void 0 ? void 0 : (_showToast$error9 = showToast.error) === null || _showToast$error9 === void 0 ? void 0 : _showToast$error9.message : "ES_" + businessService + "_" + (showToast === null || showToast === void 0 ? void 0 : (_showToast$action3 = showToast.action) === null || _showToast$action3 === void 0 ? void 0 : _showToast$action3.action) + "_UPDATE_SUCCESS";

    return /*#__PURE__*/React.createElement(React.Fragment, null, showToast && /*#__PURE__*/React.createElement(Toast, {
      error: showToast.key === "error",
      label: t(_label),
      onClose: closeToast
    }));
  }
}

function ApplicationDetailsActionBar(_ref) {
  var _user$info, _user$info$roles, _workflowDetails$data, _workflowDetails$data2, _workflowDetails$data3, _workflowDetails$data4, _workflowDetails$data5;

  var workflowDetails = _ref.workflowDetails,
      displayMenu = _ref.displayMenu,
      onActionSelect = _ref.onActionSelect,
      setDisplayMenu = _ref.setDisplayMenu,
      businessService = _ref.businessService,
      forcedActionPrefix = _ref.forcedActionPrefix;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var user = Digit.UserService.getUser();
  var userRoles = user === null || user === void 0 ? void 0 : (_user$info = user.info) === null || _user$info === void 0 ? void 0 : (_user$info$roles = _user$info.roles) === null || _user$info$roles === void 0 ? void 0 : _user$info$roles.map(function (e) {
    return e.code;
  });
  var actions = workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data = workflowDetails.data) === null || _workflowDetails$data === void 0 ? void 0 : (_workflowDetails$data2 = _workflowDetails$data.actionState) === null || _workflowDetails$data2 === void 0 ? void 0 : (_workflowDetails$data3 = _workflowDetails$data2.nextActions) === null || _workflowDetails$data3 === void 0 ? void 0 : _workflowDetails$data3.filter(function (e) {
    return userRoles.some(function (role) {
      var _e$roles;

      return (_e$roles = e.roles) === null || _e$roles === void 0 ? void 0 : _e$roles.includes(role);
    }) || !e.roles;
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, !(workflowDetails !== null && workflowDetails !== void 0 && workflowDetails.isLoading) && (actions === null || actions === void 0 ? void 0 : actions.length) > 0 && /*#__PURE__*/React.createElement(ActionBar, null, displayMenu && workflowDetails !== null && workflowDetails !== void 0 && (_workflowDetails$data4 = workflowDetails.data) !== null && _workflowDetails$data4 !== void 0 && (_workflowDetails$data5 = _workflowDetails$data4.actionState) !== null && _workflowDetails$data5 !== void 0 && _workflowDetails$data5.nextActions ? /*#__PURE__*/React.createElement(Menu, {
    localeKeyPrefix: forcedActionPrefix || "WF_EMPLOYEE_" + (businessService === null || businessService === void 0 ? void 0 : businessService.toUpperCase()),
    options: actions,
    optionKey: "action",
    t: t,
    onSelect: onActionSelect
  }) : null, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("WF_TAKE_ACTION"),
    onSubmit: function onSubmit() {
      return setDisplayMenu(!displayMenu);
    }
  })));
}

var ApplicationDetails$1 = function ApplicationDetails(props) {
  var _workflowDetails$data;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var state = tenantId.split(".")[0];

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var history = useHistory();

  var _useParams = useParams(),
      applicationNumber = _useParams.id;

  var _useState = useState(false),
      displayMenu = _useState[0],
      setDisplayMenu = _useState[1];

  var _useState2 = useState(null),
      selectedAction = _useState2[0],
      setSelectedAction = _useState2[1];

  var _useState3 = useState(false),
      showModal = _useState3[0],
      setShowModal = _useState3[1];

  var applicationDetails = props.applicationDetails,
      showToast = props.showToast,
      setShowToast = props.setShowToast,
      isLoading = props.isLoading,
      isDataLoading = props.isDataLoading,
      applicationData = props.applicationData,
      mutate = props.mutate,
      workflowDetails = props.workflowDetails,
      businessService = props.businessService,
      closeToast = props.closeToast,
      moduleCode = props.moduleCode,
      timelineStatusPrefix = props.timelineStatusPrefix,
      forcedActionPrefix = props.forcedActionPrefix;
  useEffect(function () {
    if (showToast) {
      workflowDetails.revalidate();
    }
  }, [showToast]);

  function onActionSelect(action) {
    if (action) {
      if (action !== null && action !== void 0 && action.redirectionUrll) {
        var _action$redirectionUr;

        window.location.assign(window.location.origin + "/digit-ui/employee/payment/collect/" + (action === null || action === void 0 ? void 0 : (_action$redirectionUr = action.redirectionUrll) === null || _action$redirectionUr === void 0 ? void 0 : _action$redirectionUr.pathname));
      } else if (!(action !== null && action !== void 0 && action.redirectionUrl)) {
        setShowModal(true);
      } else {
        var _action$redirectionUr2, _action$redirectionUr3;

        history.push({
          pathname: (_action$redirectionUr2 = action.redirectionUrl) === null || _action$redirectionUr2 === void 0 ? void 0 : _action$redirectionUr2.pathname,
          state: _extends({}, (_action$redirectionUr3 = action.redirectionUrl) === null || _action$redirectionUr3 === void 0 ? void 0 : _action$redirectionUr3.state)
        });
      }
    } else console.log("no action found");

    setSelectedAction(action);
    setDisplayMenu(false);
  }

  var queryClient = useQueryClient();

  var closeModal = function closeModal() {
    setSelectedAction(null);
    setShowModal(false);
  };

  var submitAction = function submitAction(data) {
    if (typeof (data === null || data === void 0 ? void 0 : data.customFunctionToExecute) === "function") {
      data === null || data === void 0 ? void 0 : data.customFunctionToExecute(_extends({}, data));
    }

    if (mutate) {
      mutate(data, {
        onError: function onError(error, variables) {
          setShowToast({
            key: "error",
            error: error
          });
          setTimeout(closeToast, 5000);
        },
        onSuccess: function onSuccess(data, variables) {
          setShowToast({
            key: "success",
            action: selectedAction
          });
          setTimeout(closeToast, 5000);
          queryClient.clear();
          queryClient.refetchQueries("APPLICATION_SEARCH");
        }
      });
    }

    closeModal();
  };

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, !isLoading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ApplicationDetailsContent, {
    applicationDetails: applicationDetails,
    workflowDetails: workflowDetails,
    isDataLoading: isDataLoading,
    applicationData: applicationData,
    businessService: businessService,
    timelineStatusPrefix: timelineStatusPrefix
  }), showModal ? /*#__PURE__*/React.createElement(ActionModal$2, {
    t: t,
    action: selectedAction,
    tenantId: tenantId,
    state: state,
    id: applicationNumber,
    applicationData: applicationDetails === null || applicationDetails === void 0 ? void 0 : applicationDetails.applicationData,
    closeModal: closeModal,
    submitAction: submitAction,
    actionData: workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data = workflowDetails.data) === null || _workflowDetails$data === void 0 ? void 0 : _workflowDetails$data.timeline,
    businessService: businessService,
    workflowDetails: workflowDetails,
    moduleCode: moduleCode
  }) : null, /*#__PURE__*/React.createElement(ApplicationDetailsToast, {
    t: t,
    showToast: showToast,
    closeToast: closeToast,
    businessService: businessService
  }), /*#__PURE__*/React.createElement(ApplicationDetailsActionBar, {
    workflowDetails: workflowDetails,
    displayMenu: displayMenu,
    onActionSelect: onActionSelect,
    setDisplayMenu: setDisplayMenu,
    businessService: businessService,
    forcedActionPrefix: forcedActionPrefix
  })) : /*#__PURE__*/React.createElement(Loader, null));
};

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
var boolTag$3 = '[object Boolean]',
    dateTag$3 = '[object Date]',
    errorTag$2 = '[object Error]',
    mapTag$5 = '[object Map]',
    numberTag$3 = '[object Number]',
    regexpTag$3 = '[object RegExp]',
    setTag$5 = '[object Set]',
    stringTag$3 = '[object String]',
    symbolTag$3 = '[object Symbol]';
var arrayBufferTag$3 = '[object ArrayBuffer]',
    dataViewTag$4 = '[object DataView]';
var symbolProto$2 = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf$1 = symbolProto$2 ? symbolProto$2.valueOf : undefined;

function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag$4:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }

      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag$3:
      if (object.byteLength != other.byteLength || !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
        return false;
      }

      return true;

    case boolTag$3:
    case dateTag$3:
    case numberTag$3:
      return eq_1(+object, +other);

    case errorTag$2:
      return object.name == other.name && object.message == other.message;

    case regexpTag$3:
    case stringTag$3:
      return object == other + '';

    case mapTag$5:
      var convert = _mapToArray;

    case setTag$5:
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

    case symbolTag$3:
      if (symbolValueOf$1) {
        return symbolValueOf$1.call(object) == symbolValueOf$1.call(other);
      }

  }

  return false;
}

var _equalByTag = equalByTag;

var COMPARE_PARTIAL_FLAG$2 = 1;
var objectProto$d = Object.prototype;
var hasOwnProperty$b = objectProto$d.hasOwnProperty;

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

    if (!(isPartial ? key in other : hasOwnProperty$b.call(other, key))) {
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

var COMPARE_PARTIAL_FLAG$3 = 1;
var argsTag$3 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    objectTag$3 = '[object Object]';
var objectProto$e = Object.prototype;
var hasOwnProperty$c = objectProto$e.hasOwnProperty;

function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$2 : _getTag(object),
      othTag = othIsArr ? arrayTag$2 : _getTag(other);
  objTag = objTag == argsTag$3 ? objectTag$3 : objTag;
  othTag = othTag == argsTag$3 ? objectTag$3 : othTag;
  var objIsObj = objTag == objectTag$3,
      othIsObj = othTag == objectTag$3,
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
    var objIsWrapped = objIsObj && hasOwnProperty$c.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$c.call(other, '__wrapped__');

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

var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }

  object = Object(object);

  while (index--) {
    var data = matchData[index];

    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }

  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new _Stack();

      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }

      if (!(result === undefined ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack) : result)) {
        return false;
      }
    }
  }

  return true;
}

var _baseIsMatch = baseIsMatch;

function isStrictComparable(value) {
  return value === value && !isObject_1(value);
}

var _isStrictComparable = isStrictComparable;

function getMatchData(object) {
  var result = keys_1(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];
    result[length] = [key, value, _isStrictComparable(value)];
  }

  return result;
}

var _getMatchData = getMatchData;

function matchesStrictComparable(key, srcValue) {
  return function (object) {
    if (object == null) {
      return false;
    }

    return object[key] === srcValue && (srcValue !== undefined || key in Object(object));
  };
}

var _matchesStrictComparable = matchesStrictComparable;

function baseMatches(source) {
  var matchData = _getMatchData(source);

  if (matchData.length == 1 && matchData[0][2]) {
    return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }

  return function (object) {
    return object === source || _baseIsMatch(object, source, matchData);
  };
}

var _baseMatches = baseMatches;

function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

var _baseHasIn = baseHasIn;

function hasPath(object, path, hasFunc) {
  path = _castPath(path, object);
  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = _toKey(path[index]);

    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }

    object = object[key];
  }

  if (result || ++index != length) {
    return result;
  }

  length = object == null ? 0 : object.length;
  return !!length && isLength_1(length) && _isIndex(key, length) && (isArray_1(object) || isArguments_1(object));
}

var _hasPath = hasPath;

function hasIn(object, path) {
  return object != null && _hasPath(object, path, _baseHasIn);
}

var hasIn_1 = hasIn;

var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

function baseMatchesProperty(path, srcValue) {
  if (_isKey(path) && _isStrictComparable(srcValue)) {
    return _matchesStrictComparable(_toKey(path), srcValue);
  }

  return function (object) {
    var objValue = get_1(object, path);
    return objValue === undefined && objValue === srcValue ? hasIn_1(object, path) : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
  };
}

var _baseMatchesProperty = baseMatchesProperty;

function identity(value) {
  return value;
}

var identity_1 = identity;

function baseProperty(key) {
  return function (object) {
    return object == null ? undefined : object[key];
  };
}

var _baseProperty = baseProperty;

function basePropertyDeep(path) {
  return function (object) {
    return _baseGet(object, path);
  };
}

var _basePropertyDeep = basePropertyDeep;

function property(path) {
  return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
}

var property_1 = property;

function baseIteratee(value) {
  if (typeof value == 'function') {
    return value;
  }

  if (value == null) {
    return identity_1;
  }

  if (typeof value == 'object') {
    return isArray_1(value) ? _baseMatchesProperty(value[0], value[1]) : _baseMatches(value);
  }

  return property_1(value);
}

var _baseIteratee = baseIteratee;

function createBaseFor(fromRight) {
  return function (object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];

      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }

    return object;
  };
}

var _createBaseFor = createBaseFor;

var baseFor = _createBaseFor();
var _baseFor = baseFor;

function baseForOwn(object, iteratee) {
  return object && _baseFor(object, iteratee, keys_1);
}

var _baseForOwn = baseForOwn;

function createBaseEach(eachFunc, fromRight) {
  return function (collection, iteratee) {
    if (collection == null) {
      return collection;
    }

    if (!isArrayLike_1(collection)) {
      return eachFunc(collection, iteratee);
    }

    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }

    return collection;
  };
}

var _createBaseEach = createBaseEach;

var baseEach = _createBaseEach(_baseForOwn);
var _baseEach = baseEach;

function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike_1(collection) ? Array(collection.length) : [];
  _baseEach(collection, function (value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

var _baseMap = baseMap;

function baseSortBy(array, comparer) {
  var length = array.length;
  array.sort(comparer);

  while (length--) {
    array[length] = array[length].value;
  }

  return array;
}

var _baseSortBy = baseSortBy;

function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol_1(value);
    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol_1(other);

    if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
      return 1;
    }

    if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
      return -1;
    }
  }

  return 0;
}

var _compareAscending = compareAscending;

function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = _compareAscending(objCriteria[index], othCriteria[index]);

    if (result) {
      if (index >= ordersLength) {
        return result;
      }

      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }

  return object.index - other.index;
}

var _compareMultiple = compareMultiple;

function baseOrderBy(collection, iteratees, orders) {
  if (iteratees.length) {
    iteratees = _arrayMap(iteratees, function (iteratee) {
      if (isArray_1(iteratee)) {
        return function (value) {
          return _baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
        };
      }

      return iteratee;
    });
  } else {
    iteratees = [identity_1];
  }

  var index = -1;
  iteratees = _arrayMap(iteratees, _baseUnary(_baseIteratee));
  var result = _baseMap(collection, function (value, key, collection) {
    var criteria = _arrayMap(iteratees, function (iteratee) {
      return iteratee(value);
    });
    return {
      'criteria': criteria,
      'index': ++index,
      'value': value
    };
  });
  return _baseSortBy(result, function (object, other) {
    return _compareMultiple(object, other, orders);
  });
}

var _baseOrderBy = baseOrderBy;

function orderBy(collection, iteratees, orders, guard) {
  if (collection == null) {
    return [];
  }

  if (!isArray_1(iteratees)) {
    iteratees = iteratees == null ? [] : [iteratees];
  }

  orders = guard ? undefined : orders;

  if (!isArray_1(orders)) {
    orders = orders == null ? [] : [orders];
  }

  return _baseOrderBy(collection, iteratees, orders);
}

var orderBy_1 = orderBy;

var ApplicationDetails$2 = function ApplicationDetails() {
  var _applicationDetails$a, _workflowDetails3, _workflowDetails3$dat, _workflowDetails3$dat2, _userInfo$info, _applicationDetails$a3, _TradeRenewalDate$Tra, _TradeRenewalDate$Tra2, _TradeRenewalDate$Tra3, _applicationDetails$a4, _applicationDetails$a5, _applicationDetails$a6, _workflowDetails$data2, _workflowDetails$data3, _ownerdetails$additio, _applicationDetails$a8, _applicationDetails$a9;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useParams = useParams(),
      applicationNumber = _useParams.id;

  var _useState = useState(null),
      showToast = _useState[0],
      setShowToast = _useState[1];

  var _useState2 = useState("NewTL"),
      businessService = _useState2[0],
      setBusinessService = _useState2[1];

  var _useState3 = useState([]),
      setNumberOfApplications = _useState3[1];

  var _useState4 = useState(false),
      allowedToNextYear = _useState4[0],
      setAllowedToNextYear = _useState4[1];

  sessionStorage.setItem("applicationNumber", applicationNumber);

  var _Digit$Hooks$tl$useAp = Digit.Hooks.tl.useApplicationDetail(t, tenantId, applicationNumber),
      isLoading = _Digit$Hooks$tl$useAp.isLoading,
      applicationDetails = _Digit$Hooks$tl$useAp.data;

  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$tl$useTr = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", ["TradeRenewal"]),
      _Digit$Hooks$tl$useTr2 = _Digit$Hooks$tl$useTr.data,
      TradeRenewalDate = _Digit$Hooks$tl$useTr2 === void 0 ? {} : _Digit$Hooks$tl$useTr2;

  var _Digit$Hooks$tl$useAp2 = Digit.Hooks.tl.useApplicationActions(tenantId),
      mutate = _Digit$Hooks$tl$useAp2.mutate;

  var workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: (applicationDetails === null || applicationDetails === void 0 ? void 0 : applicationDetails.tenantId) || tenantId,
    id: applicationDetails === null || applicationDetails === void 0 ? void 0 : (_applicationDetails$a = applicationDetails.applicationData) === null || _applicationDetails$a === void 0 ? void 0 : _applicationDetails$a.applicationNumber,
    moduleCode: businessService,
    role: "TL_CEMP"
  });

  var closeToast = function closeToast() {
    setShowToast(null);
  };

  useEffect(function () {
    var _applicationDetails$n;

    if ((applicationDetails === null || applicationDetails === void 0 ? void 0 : (_applicationDetails$n = applicationDetails.numOfApplications) === null || _applicationDetails$n === void 0 ? void 0 : _applicationDetails$n.length) > 0) {
      var _applicationDetails$a2, _applicationDetails$n2;

      var financialYear = cloneDeep_1(applicationDetails === null || applicationDetails === void 0 ? void 0 : (_applicationDetails$a2 = applicationDetails.applicationData) === null || _applicationDetails$a2 === void 0 ? void 0 : _applicationDetails$a2.financialYear);
      var financialYearDate = financialYear === null || financialYear === void 0 ? void 0 : financialYear.split('-')[1];
      var finalFinancialYear = "20" + Number(financialYearDate) + "-" + (Number(financialYearDate) + 1);
      var isAllowedToNextYear = applicationDetails === null || applicationDetails === void 0 ? void 0 : (_applicationDetails$n2 = applicationDetails.numOfApplications) === null || _applicationDetails$n2 === void 0 ? void 0 : _applicationDetails$n2.filter(function (data) {
        return data.financialYear == finalFinancialYear;
      });
      if ((isAllowedToNextYear === null || isAllowedToNextYear === void 0 ? void 0 : isAllowedToNextYear.length) > 0) setAllowedToNextYear(false);
      if (!isAllowedToNextYear || (isAllowedToNextYear === null || isAllowedToNextYear === void 0 ? void 0 : isAllowedToNextYear.length) == 0) setAllowedToNextYear(true);
      setNumberOfApplications(applicationDetails === null || applicationDetails === void 0 ? void 0 : applicationDetails.numOfApplications);
    }
  }, [applicationDetails === null || applicationDetails === void 0 ? void 0 : applicationDetails.numOfApplications]);
  useEffect(function () {
    var _workflowDetails, _workflowDetails$data;

    if ((_workflowDetails = workflowDetails) !== null && _workflowDetails !== void 0 && (_workflowDetails$data = _workflowDetails.data) !== null && _workflowDetails$data !== void 0 && _workflowDetails$data.applicationBusinessService) {
      var _workflowDetails2, _workflowDetails2$dat;

      setBusinessService((_workflowDetails2 = workflowDetails) === null || _workflowDetails2 === void 0 ? void 0 : (_workflowDetails2$dat = _workflowDetails2.data) === null || _workflowDetails2$dat === void 0 ? void 0 : _workflowDetails2$dat.applicationBusinessService);
    }
  }, [workflowDetails.data]);

  if (((_workflowDetails3 = workflowDetails) === null || _workflowDetails3 === void 0 ? void 0 : (_workflowDetails3$dat = _workflowDetails3.data) === null || _workflowDetails3$dat === void 0 ? void 0 : (_workflowDetails3$dat2 = _workflowDetails3$dat.processInstances) === null || _workflowDetails3$dat2 === void 0 ? void 0 : _workflowDetails3$dat2.length) > 0) {
    var _get, _workflowDetails4, _workflowDetails4$dat, _workflowDetails5, _workflowDetails5$dat, _workflowDetails6, _workflowDetails6$dat, _workflowDetails6$dat2, _workflowDetails6$dat3;

    var filteredActions = [];
    filteredActions = (_get = get_1((_workflowDetails4 = workflowDetails) === null || _workflowDetails4 === void 0 ? void 0 : (_workflowDetails4$dat = _workflowDetails4.data) === null || _workflowDetails4$dat === void 0 ? void 0 : _workflowDetails4$dat.processInstances[0], "nextActions", [])) === null || _get === void 0 ? void 0 : _get.filter(function (item) {
      return item.action != "ADHOC";
    });
    var actions = orderBy_1(filteredActions, ["action"], ["desc"]);
    if ((!actions || (actions === null || actions === void 0 ? void 0 : actions.length) == 0) && (_workflowDetails5 = workflowDetails) !== null && _workflowDetails5 !== void 0 && (_workflowDetails5$dat = _workflowDetails5.data) !== null && _workflowDetails5$dat !== void 0 && _workflowDetails5$dat.actionState) workflowDetails.data.actionState.nextActions = [];
    (_workflowDetails6 = workflowDetails) === null || _workflowDetails6 === void 0 ? void 0 : (_workflowDetails6$dat = _workflowDetails6.data) === null || _workflowDetails6$dat === void 0 ? void 0 : (_workflowDetails6$dat2 = _workflowDetails6$dat.actionState) === null || _workflowDetails6$dat2 === void 0 ? void 0 : (_workflowDetails6$dat3 = _workflowDetails6$dat2.nextActions) === null || _workflowDetails6$dat3 === void 0 ? void 0 : _workflowDetails6$dat3.forEach(function (data) {
      if (data.action == "RESUBMIT") {
        data.redirectionUrl = {
          pathname: "/digit-ui/employee/tl/edit-application-details/" + applicationNumber,
          state: applicationDetails
        }, data.tenantId = stateId;
      }
    });
  }

  var userInfo = Digit.UserService.getUser();
  var rolearray = userInfo === null || userInfo === void 0 ? void 0 : (_userInfo$info = userInfo.info) === null || _userInfo$info === void 0 ? void 0 : _userInfo$info.roles.filter(function (item) {
    if (item.code == "TL_CEMP" && item.tenantId === tenantId || item.code == "CITIZEN") return true;
  });
  var rolecheck = rolearray.length > 0 ? true : false;
  var validTo = applicationDetails === null || applicationDetails === void 0 ? void 0 : (_applicationDetails$a3 = applicationDetails.applicationData) === null || _applicationDetails$a3 === void 0 ? void 0 : _applicationDetails$a3.validTo;
  var currentDate = Date.now();
  var duration = validTo - currentDate;
  var renewalPeriod = TradeRenewalDate === null || TradeRenewalDate === void 0 ? void 0 : (_TradeRenewalDate$Tra = TradeRenewalDate.TradeLicense) === null || _TradeRenewalDate$Tra === void 0 ? void 0 : (_TradeRenewalDate$Tra2 = _TradeRenewalDate$Tra.TradeRenewal) === null || _TradeRenewalDate$Tra2 === void 0 ? void 0 : (_TradeRenewalDate$Tra3 = _TradeRenewalDate$Tra2[0]) === null || _TradeRenewalDate$Tra3 === void 0 ? void 0 : _TradeRenewalDate$Tra3.renewalPeriod;

  if (rolecheck && ((applicationDetails === null || applicationDetails === void 0 ? void 0 : (_applicationDetails$a4 = applicationDetails.applicationData) === null || _applicationDetails$a4 === void 0 ? void 0 : _applicationDetails$a4.status) === "APPROVED" || (applicationDetails === null || applicationDetails === void 0 ? void 0 : (_applicationDetails$a5 = applicationDetails.applicationData) === null || _applicationDetails$a5 === void 0 ? void 0 : _applicationDetails$a5.status) === "EXPIRED") && duration <= renewalPeriod) {
    var _workflowDetails7;

    if ((_workflowDetails7 = workflowDetails) !== null && _workflowDetails7 !== void 0 && _workflowDetails7.data && allowedToNextYear) {
      var _workflowDetails8, _workflowDetails8$dat, _workflowDetails9, _workflowDetails9$dat, _workflowDetails9$dat2, _workflowDetails9$dat3;

      if (!((_workflowDetails8 = workflowDetails) !== null && _workflowDetails8 !== void 0 && (_workflowDetails8$dat = _workflowDetails8.data) !== null && _workflowDetails8$dat !== void 0 && _workflowDetails8$dat.actionState)) {
        workflowDetails.data.actionState = {};
        workflowDetails.data.actionState.nextActions = [];
      }

      var flagData = (_workflowDetails9 = workflowDetails) === null || _workflowDetails9 === void 0 ? void 0 : (_workflowDetails9$dat = _workflowDetails9.data) === null || _workflowDetails9$dat === void 0 ? void 0 : (_workflowDetails9$dat2 = _workflowDetails9$dat.actionState) === null || _workflowDetails9$dat2 === void 0 ? void 0 : (_workflowDetails9$dat3 = _workflowDetails9$dat2.nextActions) === null || _workflowDetails9$dat3 === void 0 ? void 0 : _workflowDetails9$dat3.filter(function (data) {
        return data.action == "RENEWAL_SUBMIT_BUTTON";
      });

      if (flagData && flagData.length === 0) {
        var _workflowDetails10, _workflowDetails10$da, _workflowDetails10$da2, _workflowDetails10$da3;

        (_workflowDetails10 = workflowDetails) === null || _workflowDetails10 === void 0 ? void 0 : (_workflowDetails10$da = _workflowDetails10.data) === null || _workflowDetails10$da === void 0 ? void 0 : (_workflowDetails10$da2 = _workflowDetails10$da.actionState) === null || _workflowDetails10$da2 === void 0 ? void 0 : (_workflowDetails10$da3 = _workflowDetails10$da2.nextActions) === null || _workflowDetails10$da3 === void 0 ? void 0 : _workflowDetails10$da3.push({
          action: "RENEWAL_SUBMIT_BUTTON",
          redirectionUrl: {
            pathname: "/digit-ui/employee/tl/renew-application-details/" + applicationNumber,
            state: applicationDetails
          },
          tenantId: stateId,
          role: []
        });
      }
    }
  }

  if (rolearray && (applicationDetails === null || applicationDetails === void 0 ? void 0 : (_applicationDetails$a6 = applicationDetails.applicationData) === null || _applicationDetails$a6 === void 0 ? void 0 : _applicationDetails$a6.status) === "PENDINGPAYMENT") {
    var _workflowDetails11, _workflowDetails11$da, _workflowDetails11$da2;

    (_workflowDetails11 = workflowDetails) === null || _workflowDetails11 === void 0 ? void 0 : (_workflowDetails11$da = _workflowDetails11.data) === null || _workflowDetails11$da === void 0 ? void 0 : (_workflowDetails11$da2 = _workflowDetails11$da.nextActions) === null || _workflowDetails11$da2 === void 0 ? void 0 : _workflowDetails11$da2.map(function (data) {
      if (data.action === "PAY") {
        var _workflowDetails12, _applicationDetails$a7;

        workflowDetails = _extends({}, workflowDetails, {
          data: _extends({}, (_workflowDetails12 = workflowDetails) === null || _workflowDetails12 === void 0 ? void 0 : _workflowDetails12.data, {
            actionState: {
              nextActions: [{
                action: data.action,
                redirectionUrll: {
                  pathname: "TL/" + (applicationDetails === null || applicationDetails === void 0 ? void 0 : (_applicationDetails$a7 = applicationDetails.applicationData) === null || _applicationDetails$a7 === void 0 ? void 0 : _applicationDetails$a7.applicationNumber) + "/" + tenantId,
                  state: tenantId
                },
                tenantId: tenantId
              }]
            }
          })
        });
      }
    });
  }
  var wfDocs = (_workflowDetails$data2 = workflowDetails.data) === null || _workflowDetails$data2 === void 0 ? void 0 : (_workflowDetails$data3 = _workflowDetails$data2.timeline) === null || _workflowDetails$data3 === void 0 ? void 0 : _workflowDetails$data3.reduce(function (acc, _ref) {
    var documents = _ref.documents;
    return documents ? [].concat(acc, documents) : acc;
  }, []);
  var ownerdetails = applicationDetails === null || applicationDetails === void 0 ? void 0 : applicationDetails.applicationDetails.find(function (e) {
    return e.title === "ES_NEW_APPLICATION_OWNERSHIP_DETAILS";
  });
  var appdetailsDocuments = ownerdetails === null || ownerdetails === void 0 ? void 0 : (_ownerdetails$additio = ownerdetails.additionalDetails) === null || _ownerdetails$additio === void 0 ? void 0 : _ownerdetails$additio.documents;

  if (appdetailsDocuments && wfDocs !== null && wfDocs !== void 0 && wfDocs.length && !appdetailsDocuments.find(function (e) {
    return e.title === "TL_WORKFLOW_DOCS";
  })) {
    var _wfDocs$map;

    ownerdetails.additionalDetails.documents = [].concat(ownerdetails.additionalDetails.documents, [{
      title: "TL_WORKFLOW_DOCS",
      values: wfDocs === null || wfDocs === void 0 ? void 0 : (_wfDocs$map = wfDocs.map) === null || _wfDocs$map === void 0 ? void 0 : _wfDocs$map.call(wfDocs, function (e) {
        return _extends({}, e, {
          title: e.documentType
        });
      })
    }]);
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "15px"
    }
  }, /*#__PURE__*/React.createElement(Header, null, (applicationDetails === null || applicationDetails === void 0 ? void 0 : (_applicationDetails$a8 = applicationDetails.applicationData) === null || _applicationDetails$a8 === void 0 ? void 0 : _applicationDetails$a8.workflowCode) == "NewTL" && (applicationDetails === null || applicationDetails === void 0 ? void 0 : (_applicationDetails$a9 = applicationDetails.applicationData) === null || _applicationDetails$a9 === void 0 ? void 0 : _applicationDetails$a9.status) !== "APPROVED" ? t("TL_TRADE_APPLICATION_DETAILS_LABEL") : t("TL_TRADE_LICENSE_DETAILS_LABEL"))), /*#__PURE__*/React.createElement(ApplicationDetails$1, {
    applicationDetails: applicationDetails,
    isLoading: isLoading,
    isDataLoading: isLoading,
    applicationData: applicationDetails === null || applicationDetails === void 0 ? void 0 : applicationDetails.applicationData,
    mutate: mutate,
    workflowDetails: workflowDetails,
    businessService: businessService,
    moduleCode: "TL",
    showToast: showToast,
    setShowToast: setShowToast,
    closeToast: closeToast,
    timelineStatusPrefix: "WF_NEWTL_"
  }));
};

var ReNewApplication = function ReNewApplication(props) {
  var _props$location, _props$location$state, _applicationData$fina, _finalFinancialYear, _applicationData$trad, _applicationData$trad2, _applicationData$trad3, _applicationData$trad4, _applicationData$trad5, _applicationData$trad6, _applicationData$trad7, _applicationData$trad8, _applicationData$trad9, _applicationData$trad10, _applicationData$trad11, _applicationData$trad12, _applicationData$trad13, _applicationData$trad14, _applicationData$trad17, _applicationData$trad18, _applicationData$trad21, _applicationData$trad22, _applicationData$trad23, _applicationData$trad24, _applicationData$trad25, _props$location2, _props$location2$stat, _applicationData$trad28, _applicationData$trad29, _applicationData$trad30, _applicationData$trad31, _applicationData$trad32;

  var applicationData = cloneDeep_1(props === null || props === void 0 ? void 0 : (_props$location = props.location) === null || _props$location === void 0 ? void 0 : (_props$location$state = _props$location.state) === null || _props$location$state === void 0 ? void 0 : _props$location$state.applicationData) || {};
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState(false),
      canSubmit = _useState[0],
      setSubmitValve = _useState[1];

  var history = useHistory();

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("store-data", null);

  var _Digit$Hooks$useSessi2 = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false),
      setMutationHappened = _Digit$Hooks$useSessi2[1];

  var _Digit$Hooks$useSessi3 = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", {}),
      clearSuccessData = _Digit$Hooks$useSessi3[2];

  var _useState2 = useState(null),
      showToast = _useState2[0],
      setShowToast = _useState2[1];

  var _useState3 = useState(null),
      error = _useState3[0],
      setError = _useState3[1];

  var financialYear = cloneDeep_1(applicationData === null || applicationData === void 0 ? void 0 : applicationData.financialYear);
  var financialYearDate = applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$fina = applicationData.financialYear) === null || _applicationData$fina === void 0 ? void 0 : _applicationData$fina.split('-')[1];
  var finalFinancialYear = "20" + Number(financialYearDate) + "-" + (Number(financialYearDate) + 1);
  if (window.location.href.includes("edit-application-details")) finalFinancialYear = financialYear;
  var tradeDetails = [{
    tradeName: applicationData === null || applicationData === void 0 ? void 0 : applicationData.tradeName,
    financialYear: {
      code: finalFinancialYear,
      i18nKey: "FY" + finalFinancialYear,
      id: (_finalFinancialYear = finalFinancialYear) === null || _finalFinancialYear === void 0 ? void 0 : _finalFinancialYear.split('-')[0]
    },
    licenseType: "",
    structureType: {
      i18nKey: t("COMMON_MASTERS_STRUCTURETYPE_" + stringReplaceAll(applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad = applicationData.tradeLicenseDetail) === null || _applicationData$trad === void 0 ? void 0 : (_applicationData$trad2 = _applicationData$trad.structureType) === null || _applicationData$trad2 === void 0 ? void 0 : (_applicationData$trad3 = _applicationData$trad2.split('.')[0]) === null || _applicationData$trad3 === void 0 ? void 0 : _applicationData$trad3.toUpperCase(), ".", "_")),
      code: applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad4 = applicationData.tradeLicenseDetail) === null || _applicationData$trad4 === void 0 ? void 0 : (_applicationData$trad5 = _applicationData$trad4.structureType) === null || _applicationData$trad5 === void 0 ? void 0 : _applicationData$trad5.split('.')[0]
    },
    structureSubType: {
      i18nKey: "COMMON_MASTERS_STRUCTURETYPE_" + stringReplaceAll(applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad6 = applicationData.tradeLicenseDetail) === null || _applicationData$trad6 === void 0 ? void 0 : (_applicationData$trad7 = _applicationData$trad6.structureType) === null || _applicationData$trad7 === void 0 ? void 0 : _applicationData$trad7.toUpperCase(), ".", "_"),
      code: applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad8 = applicationData.tradeLicenseDetail) === null || _applicationData$trad8 === void 0 ? void 0 : _applicationData$trad8.structureType
    },
    commencementDate: convertEpochToDate(applicationData === null || applicationData === void 0 ? void 0 : applicationData.commencementDate),
    gstNo: (applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad9 = applicationData.tradeLicenseDetail) === null || _applicationData$trad9 === void 0 ? void 0 : (_applicationData$trad10 = _applicationData$trad9.additionalDetail) === null || _applicationData$trad10 === void 0 ? void 0 : _applicationData$trad10.gstNo) || "",
    operationalArea: (applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad11 = applicationData.tradeLicenseDetail) === null || _applicationData$trad11 === void 0 ? void 0 : _applicationData$trad11.operationalArea) || "",
    noOfEmployees: (applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad12 = applicationData.tradeLicenseDetail) === null || _applicationData$trad12 === void 0 ? void 0 : _applicationData$trad12.noOfEmployees) || "",
    key: Date.now()
  }];

  if ((applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad13 = applicationData.tradeLicenseDetail) === null || _applicationData$trad13 === void 0 ? void 0 : (_applicationData$trad14 = _applicationData$trad13.tradeUnits) === null || _applicationData$trad14 === void 0 ? void 0 : _applicationData$trad14.length) > 0) {
    var _applicationData$trad15, _applicationData$trad16;

    applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad15 = applicationData.tradeLicenseDetail) === null || _applicationData$trad15 === void 0 ? void 0 : (_applicationData$trad16 = _applicationData$trad15.tradeUnits) === null || _applicationData$trad16 === void 0 ? void 0 : _applicationData$trad16.forEach(function (data, index) {
      var tradeType1 = cloneDeep_1(data === null || data === void 0 ? void 0 : data.tradeType);
      var tradeType2 = cloneDeep_1(data === null || data === void 0 ? void 0 : data.tradeType);
      var tradeType3 = cloneDeep_1(data === null || data === void 0 ? void 0 : data.tradeType);
      var code1 = typeof (data === null || data === void 0 ? void 0 : data.tradeType) == "string" && stringReplaceAll(tradeType3, "-", "_");
      if (typeof (data === null || data === void 0 ? void 0 : data.tradeType) == "string") data.tradeCategory = {
        code: tradeType1 === null || tradeType1 === void 0 ? void 0 : tradeType1.split('.')[0],
        i18nKey: "TRADELICENSE_TRADETYPE_" + (tradeType1 === null || tradeType1 === void 0 ? void 0 : tradeType1.split('.')[0])
      };
      if (typeof (data === null || data === void 0 ? void 0 : data.tradeType) == "string") data.tradeSubType = {
        code: tradeType3,
        i18nKey: t("TRADELICENSE_TRADETYPE_" + stringReplaceAll(code1, ".", "_")),
        uom: (data === null || data === void 0 ? void 0 : data.uom) || ""
      };
      if (typeof (data === null || data === void 0 ? void 0 : data.tradeType) == "string") data.tradeType = {
        code: tradeType2 === null || tradeType2 === void 0 ? void 0 : tradeType2.split('.')[1],
        i18nKey: "TRADELICENSE_TRADETYPE_" + (tradeType2 === null || tradeType2 === void 0 ? void 0 : tradeType2.split('.')[1])
      };
      data.uom = data === null || data === void 0 ? void 0 : data.uom;
      data.uomValue = data === null || data === void 0 ? void 0 : data.uomValue;
      data.key = Date.now() + (index + 1) * 20;
    });
  }

  if ((applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad17 = applicationData.tradeLicenseDetail) === null || _applicationData$trad17 === void 0 ? void 0 : (_applicationData$trad18 = _applicationData$trad17.accessories) === null || _applicationData$trad18 === void 0 ? void 0 : _applicationData$trad18.length) > 0) {
    var _applicationData$trad19, _applicationData$trad20;

    applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad19 = applicationData.tradeLicenseDetail) === null || _applicationData$trad19 === void 0 ? void 0 : (_applicationData$trad20 = _applicationData$trad19.accessories) === null || _applicationData$trad20 === void 0 ? void 0 : _applicationData$trad20.forEach(function (data, index) {
      var accessory1 = cloneDeep_1(data === null || data === void 0 ? void 0 : data.accessoryCategory);
      var accessory2 = cloneDeep_1(data === null || data === void 0 ? void 0 : data.accessoryCategory);
      if (typeof (data === null || data === void 0 ? void 0 : data.accessoryCategory) == "string") data.accessoryCategory = {
        code: accessory1,
        i18nKey: "TRADELICENSE_ACCESSORIESCATEGORY_" + stringReplaceAll(accessory1, "-", "_"),
        uom: data === null || data === void 0 ? void 0 : data.uom
      };
      data.uom = data === null || data === void 0 ? void 0 : data.uom;
      data.uomValue = (data === null || data === void 0 ? void 0 : data.uomValue) || "";
      data.count = (data === null || data === void 0 ? void 0 : data.count) || "";
      data.key = Date.now() + (index + 1) * 20;
    });
  }

  applicationData.tradeLicenseDetail.address.locality = _extends({}, applicationData.tradeLicenseDetail.address.locality, {
    i18nkey: (_applicationData$trad21 = applicationData.tradeLicenseDetail.address.locality) === null || _applicationData$trad21 === void 0 ? void 0 : _applicationData$trad21.name
  });
  var ownershipCategory = {
    code: applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad22 = applicationData.tradeLicenseDetail) === null || _applicationData$trad22 === void 0 ? void 0 : _applicationData$trad22.subOwnerShipCategory,
    i18nKey: "COMMON_MASTERS_OWNERSHIPCATEGORY_" + stringReplaceAll(applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad23 = applicationData.tradeLicenseDetail) === null || _applicationData$trad23 === void 0 ? void 0 : _applicationData$trad23.subOwnerShipCategory, ".", "_")
  };

  if ((applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad24 = applicationData.tradeLicenseDetail) === null || _applicationData$trad24 === void 0 ? void 0 : (_applicationData$trad25 = _applicationData$trad24.owners) === null || _applicationData$trad25 === void 0 ? void 0 : _applicationData$trad25.length) > 0) {
    var _applicationData$trad26, _applicationData$trad27;

    applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad26 = applicationData.tradeLicenseDetail) === null || _applicationData$trad26 === void 0 ? void 0 : (_applicationData$trad27 = _applicationData$trad26.owners) === null || _applicationData$trad27 === void 0 ? void 0 : _applicationData$trad27.forEach(function (data, index) {
      if (typeof (data === null || data === void 0 ? void 0 : data.gender) == "string") data.gender = {
        code: data === null || data === void 0 ? void 0 : data.gender,
        i18nKey: "TL_GENDER_" + (data === null || data === void 0 ? void 0 : data.gender)
      };
      if (typeof (data === null || data === void 0 ? void 0 : data.ownerType) == "string") data.ownerType = {
        code: data === null || data === void 0 ? void 0 : data.ownerType,
        i18nKey: data === null || data === void 0 ? void 0 : data.ownerType
      };
      if (!(data !== null && data !== void 0 && data.emailId)) data.emailId = "";
      if (!(data !== null && data !== void 0 && data.permanentAddress)) data.permanentAddress = "";
      data.key = Date.now() + (index + 1) * 20;
    });
  }

  var clonedData = cloneDeep_1(props === null || props === void 0 ? void 0 : (_props$location2 = props.location) === null || _props$location2 === void 0 ? void 0 : (_props$location2$stat = _props$location2.state) === null || _props$location2$stat === void 0 ? void 0 : _props$location2$stat.applicationData);
  clonedData.checkForRenewal = false;
  var defaultValues = {
    tradedetils1: clonedData,
    tradedetils: tradeDetails,
    tradeUnits: applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad28 = applicationData.tradeLicenseDetail) === null || _applicationData$trad28 === void 0 ? void 0 : _applicationData$trad28.tradeUnits,
    accessories: applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad29 = applicationData.tradeLicenseDetail) === null || _applicationData$trad29 === void 0 ? void 0 : _applicationData$trad29.accessories,
    address: (applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad30 = applicationData.tradeLicenseDetail) === null || _applicationData$trad30 === void 0 ? void 0 : _applicationData$trad30.address) || {},
    ownershipCategory: ownershipCategory,
    owners: (applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad31 = applicationData.tradeLicenseDetail) === null || _applicationData$trad31 === void 0 ? void 0 : _applicationData$trad31.owners) || [],
    documents: {
      documents: (applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$trad32 = applicationData.tradeLicenseDetail) === null || _applicationData$trad32 === void 0 ? void 0 : _applicationData$trad32.applicationDocuments) || []
    }
  };

  var closeToast = function closeToast() {
    setShowToast(null);
    setError(null);
  };

  useEffect(function () {
    setMutationHappened(false);
    clearSuccessData();
  }, []);

  var onFormValueChange = function onFormValueChange(setValue, formData, formState) {
    setSubmitValve(!Object.keys(formState.errors).length);
  };

  var onSubmit = function onSubmit(data) {
    var _data$tradedetils, _data$tradedetils2, _data$owners, _data$tradeUnits, _data$accessories, _data$tradedetils6, _data$tradedetils7, _data$tradedetils7$tr, _data$address, _data$address$city, _data$tradedetils8, _data$address2, _data$tradedetils9, _data$address3, _data$documents, _data$tradedetils10, _data$tradedetils10$, _data$tradedetils11, _data$tradedetils11$, _data$tradedetils11$$, _data$tradedetils12, _data$tradedetils12$, _data$tradedetils13, _data$tradedetils13$, _data$tradedetils14, _data$tradedetils14$, _data$tradedetils15, _data$tradedetils15$, _data$tradedetils15$$, _data$tradedetils16, _data$tradedetils16$, _data$ownershipCatego, _data$tradedetils17, _data$tradedetils17$, _data$tradedetils17$$;

    var EDITRENEWAL = data === null || data === void 0 ? void 0 : (_data$tradedetils = data.tradedetils1) === null || _data$tradedetils === void 0 ? void 0 : _data$tradedetils.checkForRenewal;
    var sendBackToCitizen = false;

    if ((data === null || data === void 0 ? void 0 : (_data$tradedetils2 = data.tradedetils1) === null || _data$tradedetils2 === void 0 ? void 0 : _data$tradedetils2.action) == "SENDBACKTOCITIZEN") {
      EDITRENEWAL = false;
      sendBackToCitizen = true;
    }

    if ((data === null || data === void 0 ? void 0 : (_data$owners = data.owners) === null || _data$owners === void 0 ? void 0 : _data$owners.length) > 0) {
      data === null || data === void 0 ? void 0 : data.owners.forEach(function (data) {
        var _data$gender, _data$ownerType;

        data.gender = data === null || data === void 0 ? void 0 : (_data$gender = data.gender) === null || _data$gender === void 0 ? void 0 : _data$gender.code;
        data.ownerType = data === null || data === void 0 ? void 0 : (_data$ownerType = data.ownerType) === null || _data$ownerType === void 0 ? void 0 : _data$ownerType.code;
      });
    }

    var _loop = function _loop(i) {
      var _data$owners4;

      var filteredArray = data === null || data === void 0 ? void 0 : (_data$owners4 = data.owners) === null || _data$owners4 === void 0 ? void 0 : _data$owners4.filter(function (owner) {
        var _data$tradedetils20, _data$tradedetils20$t, _data$tradedetils20$t2;

        return owner.id === (data === null || data === void 0 ? void 0 : (_data$tradedetils20 = data.tradedetils1) === null || _data$tradedetils20 === void 0 ? void 0 : (_data$tradedetils20$t = _data$tradedetils20.tradeLicenseDetail) === null || _data$tradedetils20$t === void 0 ? void 0 : (_data$tradedetils20$t2 = _data$tradedetils20$t.owners[i]) === null || _data$tradedetils20$t2 === void 0 ? void 0 : _data$tradedetils20$t2.id);
      });

      if ((filteredArray === null || filteredArray === void 0 ? void 0 : filteredArray.length) == 0) {
        var _data$tradedetils21, _data$tradedetils21$t;

        var removedOwner = data === null || data === void 0 ? void 0 : (_data$tradedetils21 = data.tradedetils1) === null || _data$tradedetils21 === void 0 ? void 0 : (_data$tradedetils21$t = _data$tradedetils21.tradeLicenseDetail) === null || _data$tradedetils21$t === void 0 ? void 0 : _data$tradedetils21$t.owners[i];
        removedOwner.active = false;
        removedOwner.userActive = false;
        data === null || data === void 0 ? void 0 : data.owners.push(removedOwner);
        EDITRENEWAL = true;
      }
    };

    for (var i = 0; i < (data === null || data === void 0 ? void 0 : (_data$tradedetils3 = data.tradedetils1) === null || _data$tradedetils3 === void 0 ? void 0 : (_data$tradedetils3$tr = _data$tradedetils3.tradeLicenseDetail) === null || _data$tradedetils3$tr === void 0 ? void 0 : (_data$tradedetils3$tr2 = _data$tradedetils3$tr.owners) === null || _data$tradedetils3$tr2 === void 0 ? void 0 : _data$tradedetils3$tr2.length); i++) {
      var _data$tradedetils3, _data$tradedetils3$tr, _data$tradedetils3$tr2;

      _loop(i);
    }

    if ((data === null || data === void 0 ? void 0 : (_data$tradeUnits = data.tradeUnits) === null || _data$tradeUnits === void 0 ? void 0 : _data$tradeUnits.length) > 0) {
      data === null || data === void 0 ? void 0 : data.tradeUnits.forEach(function (data) {
        var _data$tradeSubType, _data$tradeSubType2;

        data.tradeType = (data === null || data === void 0 ? void 0 : (_data$tradeSubType = data.tradeSubType) === null || _data$tradeSubType === void 0 ? void 0 : _data$tradeSubType.code) || null, data.uom = (data === null || data === void 0 ? void 0 : (_data$tradeSubType2 = data.tradeSubType) === null || _data$tradeSubType2 === void 0 ? void 0 : _data$tradeSubType2.uom) || null, data.uomValue = Number(data === null || data === void 0 ? void 0 : data.uomValue) || null;
      });
    }

    var _loop2 = function _loop2(_i) {
      var _data$tradeUnits4;

      var filteredArray = data === null || data === void 0 ? void 0 : (_data$tradeUnits4 = data.tradeUnits) === null || _data$tradeUnits4 === void 0 ? void 0 : _data$tradeUnits4.filter(function (unit) {
        var _data$tradedetils22, _data$tradedetils22$t, _data$tradedetils22$t2;

        return unit.id === (data === null || data === void 0 ? void 0 : (_data$tradedetils22 = data.tradedetils1) === null || _data$tradedetils22 === void 0 ? void 0 : (_data$tradedetils22$t = _data$tradedetils22.tradeLicenseDetail) === null || _data$tradedetils22$t === void 0 ? void 0 : (_data$tradedetils22$t2 = _data$tradedetils22$t.tradeUnits[_i]) === null || _data$tradedetils22$t2 === void 0 ? void 0 : _data$tradedetils22$t2.id);
      });

      if ((filteredArray === null || filteredArray === void 0 ? void 0 : filteredArray.length) == 0) {
        var _data$tradedetils23, _data$tradedetils23$t;

        var removedUnit = data === null || data === void 0 ? void 0 : (_data$tradedetils23 = data.tradedetils1) === null || _data$tradedetils23 === void 0 ? void 0 : (_data$tradedetils23$t = _data$tradedetils23.tradeLicenseDetail) === null || _data$tradedetils23$t === void 0 ? void 0 : _data$tradedetils23$t.tradeUnits[_i];
        removedUnit.active = false;
        data === null || data === void 0 ? void 0 : data.tradeUnits.push(removedUnit);
        EDITRENEWAL = true;
      }
    };

    for (var _i = 0; _i < (data === null || data === void 0 ? void 0 : (_data$tradedetils4 = data.tradedetils1) === null || _data$tradedetils4 === void 0 ? void 0 : (_data$tradedetils4$tr = _data$tradedetils4.tradeLicenseDetail) === null || _data$tradedetils4$tr === void 0 ? void 0 : (_data$tradedetils4$tr2 = _data$tradedetils4$tr.tradeUnits) === null || _data$tradedetils4$tr2 === void 0 ? void 0 : _data$tradedetils4$tr2.length); _i++) {
      var _data$tradedetils4, _data$tradedetils4$tr, _data$tradedetils4$tr2;

      _loop2(_i);
    }

    var accessoriesFlag = false;

    if ((data === null || data === void 0 ? void 0 : (_data$accessories = data.accessories) === null || _data$accessories === void 0 ? void 0 : _data$accessories.length) > 0) {
      var _data$accessories2, _data$accessories3, _data$accessories3$, _data$accessories3$$a, _data$accessories4;

      if ((data === null || data === void 0 ? void 0 : (_data$accessories2 = data.accessories) === null || _data$accessories2 === void 0 ? void 0 : _data$accessories2.length) === 1 && !(data !== null && data !== void 0 && (_data$accessories3 = data.accessories) !== null && _data$accessories3 !== void 0 && (_data$accessories3$ = _data$accessories3[0]) !== null && _data$accessories3$ !== void 0 && (_data$accessories3$$a = _data$accessories3$.accessoryCategory) !== null && _data$accessories3$$a !== void 0 && _data$accessories3$$a.code)) accessoriesFlag = true;
      data === null || data === void 0 ? void 0 : (_data$accessories4 = data.accessories) === null || _data$accessories4 === void 0 ? void 0 : _data$accessories4.forEach(function (data) {
        var accessoryCategory1 = cloneDeep_1(data === null || data === void 0 ? void 0 : data.accessoryCategory);
        var accessoryCategory2 = cloneDeep_1(data === null || data === void 0 ? void 0 : data.accessoryCategory);
        data.accessoryCategory = (accessoryCategory1 === null || accessoryCategory1 === void 0 ? void 0 : accessoryCategory1.code) || null, data.uom = (accessoryCategory2 === null || accessoryCategory2 === void 0 ? void 0 : accessoryCategory2.uom) || null, data.count = Number(data === null || data === void 0 ? void 0 : data.count) || null, data.uomValue = Number(data === null || data === void 0 ? void 0 : data.uomValue) || null;
      });
    }
    if (accessoriesFlag) data.accessories = null;

    var _loop3 = function _loop3(_i2) {
      var _data$accessories7;

      var filteredArrayAcc = data === null || data === void 0 ? void 0 : (_data$accessories7 = data.accessories) === null || _data$accessories7 === void 0 ? void 0 : _data$accessories7.filter(function (unit) {
        var _data$tradedetils24, _data$tradedetils24$t, _data$tradedetils24$t2;

        return unit.id === (data === null || data === void 0 ? void 0 : (_data$tradedetils24 = data.tradedetils1) === null || _data$tradedetils24 === void 0 ? void 0 : (_data$tradedetils24$t = _data$tradedetils24.tradeLicenseDetail) === null || _data$tradedetils24$t === void 0 ? void 0 : (_data$tradedetils24$t2 = _data$tradedetils24$t.accessories[_i2]) === null || _data$tradedetils24$t2 === void 0 ? void 0 : _data$tradedetils24$t2.id);
      });

      if ((filteredArrayAcc === null || filteredArrayAcc === void 0 ? void 0 : filteredArrayAcc.length) == 0) {
        var _data$tradedetils25, _data$tradedetils25$t;

        var removedUnitAcc = data === null || data === void 0 ? void 0 : (_data$tradedetils25 = data.tradedetils1) === null || _data$tradedetils25 === void 0 ? void 0 : (_data$tradedetils25$t = _data$tradedetils25.tradeLicenseDetail) === null || _data$tradedetils25$t === void 0 ? void 0 : _data$tradedetils25$t.accessories[_i2];
        removedUnitAcc.active = false;
        data.accessories = data !== null && data !== void 0 && data.accessories ? data.accessories : [];
        data.accessories.push(removedUnitAcc);
        EDITRENEWAL = true;
      }
    };

    for (var _i2 = 0; _i2 < (data === null || data === void 0 ? void 0 : (_data$tradedetils5 = data.tradedetils1) === null || _data$tradedetils5 === void 0 ? void 0 : (_data$tradedetils5$tr = _data$tradedetils5.tradeLicenseDetail) === null || _data$tradedetils5$tr === void 0 ? void 0 : (_data$tradedetils5$tr2 = _data$tradedetils5$tr.accessories) === null || _data$tradedetils5$tr2 === void 0 ? void 0 : _data$tradedetils5$tr2.length); _i2++) {
      var _data$tradedetils5, _data$tradedetils5$tr, _data$tradedetils5$tr2;

      _loop3(_i2);
    }

    if (data !== null && data !== void 0 && (_data$tradedetils6 = data.tradedetils1) !== null && _data$tradedetils6 !== void 0 && _data$tradedetils6.tradeLicenseDetail && (data === null || data === void 0 ? void 0 : (_data$tradedetils7 = data.tradedetils1) === null || _data$tradedetils7 === void 0 ? void 0 : (_data$tradedetils7$tr = _data$tradedetils7.tradeLicenseDetail) === null || _data$tradedetils7$tr === void 0 ? void 0 : _data$tradedetils7$tr.accessories) == null && data.accessories) {
      EDITRENEWAL = true;
    }

    data.address.city = (data === null || data === void 0 ? void 0 : (_data$address = data.address) === null || _data$address === void 0 ? void 0 : (_data$address$city = _data$address.city) === null || _data$address$city === void 0 ? void 0 : _data$address$city.code) || null;

    if ((data === null || data === void 0 ? void 0 : (_data$tradedetils8 = data.tradedetils1) === null || _data$tradedetils8 === void 0 ? void 0 : _data$tradedetils8.tradeLicenseDetail.address.doorNo) !== (data === null || data === void 0 ? void 0 : (_data$address2 = data.address) === null || _data$address2 === void 0 ? void 0 : _data$address2.doorNo)) {
      EDITRENEWAL = true;
    }

    if ((data === null || data === void 0 ? void 0 : (_data$tradedetils9 = data.tradedetils1) === null || _data$tradedetils9 === void 0 ? void 0 : _data$tradedetils9.tradeLicenseDetail.address.street) !== (data === null || data === void 0 ? void 0 : (_data$address3 = data.address) === null || _data$address3 === void 0 ? void 0 : _data$address3.street)) {
      EDITRENEWAL = true;
    }

    var applicationDocuments = (data === null || data === void 0 ? void 0 : (_data$documents = data.documents) === null || _data$documents === void 0 ? void 0 : _data$documents.documents) || [];
    var commencementDate = convertDateToEpoch(data === null || data === void 0 ? void 0 : (_data$tradedetils10 = data.tradedetils) === null || _data$tradedetils10 === void 0 ? void 0 : (_data$tradedetils10$ = _data$tradedetils10["0"]) === null || _data$tradedetils10$ === void 0 ? void 0 : _data$tradedetils10$.commencementDate);
    var financialYear = data === null || data === void 0 ? void 0 : (_data$tradedetils11 = data.tradedetils) === null || _data$tradedetils11 === void 0 ? void 0 : (_data$tradedetils11$ = _data$tradedetils11["0"]) === null || _data$tradedetils11$ === void 0 ? void 0 : (_data$tradedetils11$$ = _data$tradedetils11$.financialYear) === null || _data$tradedetils11$$ === void 0 ? void 0 : _data$tradedetils11$$.code;
    var gstNo = (data === null || data === void 0 ? void 0 : (_data$tradedetils12 = data.tradedetils) === null || _data$tradedetils12 === void 0 ? void 0 : (_data$tradedetils12$ = _data$tradedetils12["0"]) === null || _data$tradedetils12$ === void 0 ? void 0 : _data$tradedetils12$.gstNo) || "";
    var noOfEmployees = Number(data === null || data === void 0 ? void 0 : (_data$tradedetils13 = data.tradedetils) === null || _data$tradedetils13 === void 0 ? void 0 : (_data$tradedetils13$ = _data$tradedetils13["0"]) === null || _data$tradedetils13$ === void 0 ? void 0 : _data$tradedetils13$.noOfEmployees) || "";
    var operationalArea = Number(data === null || data === void 0 ? void 0 : (_data$tradedetils14 = data.tradedetils) === null || _data$tradedetils14 === void 0 ? void 0 : (_data$tradedetils14$ = _data$tradedetils14["0"]) === null || _data$tradedetils14$ === void 0 ? void 0 : _data$tradedetils14$.operationalArea) || "";
    var structureType = (data === null || data === void 0 ? void 0 : (_data$tradedetils15 = data.tradedetils) === null || _data$tradedetils15 === void 0 ? void 0 : (_data$tradedetils15$ = _data$tradedetils15["0"]) === null || _data$tradedetils15$ === void 0 ? void 0 : (_data$tradedetils15$$ = _data$tradedetils15$.structureSubType) === null || _data$tradedetils15$$ === void 0 ? void 0 : _data$tradedetils15$$.code) || "";
    var tradeName = (data === null || data === void 0 ? void 0 : (_data$tradedetils16 = data.tradedetils) === null || _data$tradedetils16 === void 0 ? void 0 : (_data$tradedetils16$ = _data$tradedetils16["0"]) === null || _data$tradedetils16$ === void 0 ? void 0 : _data$tradedetils16$.tradeName) || "";
    var subOwnerShipCategory = (data === null || data === void 0 ? void 0 : (_data$ownershipCatego = data.ownershipCategory) === null || _data$ownershipCatego === void 0 ? void 0 : _data$ownershipCatego.code) || "";
    var licenseType = (data === null || data === void 0 ? void 0 : (_data$tradedetils17 = data.tradedetils) === null || _data$tradedetils17 === void 0 ? void 0 : (_data$tradedetils17$ = _data$tradedetils17["0"]) === null || _data$tradedetils17$ === void 0 ? void 0 : (_data$tradedetils17$$ = _data$tradedetils17$.licenseType) === null || _data$tradedetils17$$ === void 0 ? void 0 : _data$tradedetils17$$.code) || "PERMANENT";

    if (!EDITRENEWAL || sendBackToCitizen) {
      var _data$tradedetils18, _data$tradedetils19, _data$accessories5, _data$tradeUnits2, _data$owners2;

      var formData = cloneDeep_1(data.tradedetils1);
      formData.action = sendBackToCitizen ? "RESUBMIT" : "INITIATE", formData.applicationType = sendBackToCitizen ? data === null || data === void 0 ? void 0 : (_data$tradedetils18 = data.tradedetils1) === null || _data$tradedetils18 === void 0 ? void 0 : _data$tradedetils18.applicationType : "RENEWAL", formData.workflowCode = sendBackToCitizen ? data === null || data === void 0 ? void 0 : (_data$tradedetils19 = data.tradedetils1) === null || _data$tradedetils19 === void 0 ? void 0 : _data$tradedetils19.workflowCode : "DIRECTRENEWAL", formData.commencementDate = commencementDate;
      formData.financialYear = financialYear;
      formData.licenseType = licenseType;
      formData.tenantId = tenantId;
      formData.tradeName = tradeName;
      if (gstNo) formData.tradeLicenseDetail.additionalDetail.gstNo = gstNo;
      if (noOfEmployees) formData.tradeLicenseDetail.noOfEmployees = noOfEmployees;
      if (operationalArea) formData.tradeLicenseDetail.operationalArea = operationalArea;
      if ((data === null || data === void 0 ? void 0 : (_data$accessories5 = data.accessories) === null || _data$accessories5 === void 0 ? void 0 : _data$accessories5.length) > 0) formData.tradeLicenseDetail.accessories = data === null || data === void 0 ? void 0 : data.accessories;
      if ((data === null || data === void 0 ? void 0 : (_data$tradeUnits2 = data.tradeUnits) === null || _data$tradeUnits2 === void 0 ? void 0 : _data$tradeUnits2.length) > 0) formData.tradeLicenseDetail.tradeUnits = data === null || data === void 0 ? void 0 : data.tradeUnits;
      if ((data === null || data === void 0 ? void 0 : (_data$owners2 = data.owners) === null || _data$owners2 === void 0 ? void 0 : _data$owners2.length) > 0) formData.tradeLicenseDetail.owners = data === null || data === void 0 ? void 0 : data.owners;
      if (structureType) formData.tradeLicenseDetail.structureType = structureType;
      if (subOwnerShipCategory) formData.tradeLicenseDetail.subOwnerShipCategory = subOwnerShipCategory;
      Digit.TLService.update({
        Licenses: [formData]
      }, tenantId).then(function (result, err) {
        var _result$Licenses;

        if ((result === null || result === void 0 ? void 0 : (_result$Licenses = result.Licenses) === null || _result$Licenses === void 0 ? void 0 : _result$Licenses.length) > 0) {
          var _result$Licenses2;

          if ((result === null || result === void 0 ? void 0 : (_result$Licenses2 = result.Licenses) === null || _result$Licenses2 === void 0 ? void 0 : _result$Licenses2.length) > 0) {
            history.replace("/digit-ui/employee/tl/response", {
              data: result === null || result === void 0 ? void 0 : result.Licenses
            });
          }
        }
      }).catch(function (e) {
        var _e$response, _e$response$data, _e$response$data$Erro;

        setShowToast({
          key: "error"
        });
        setError((e === null || e === void 0 ? void 0 : (_e$response = e.response) === null || _e$response === void 0 ? void 0 : (_e$response$data = _e$response.data) === null || _e$response$data === void 0 ? void 0 : (_e$response$data$Erro = _e$response$data.Errors[0]) === null || _e$response$data$Erro === void 0 ? void 0 : _e$response$data$Erro.message) || null);
      });
    } else {
      var _data$accessories6, _data$tradeUnits3, _data$owners3;

      var _formData2 = cloneDeep_1(data.tradedetils1);

      _formData2.action = "INITIATE", _formData2.applicationType = "RENEWAL", _formData2.workflowCode = "EDITRENEWAL", _formData2.commencementDate = commencementDate;
      _formData2.financialYear = financialYear;
      _formData2.licenseType = licenseType;
      _formData2.tenantId = tenantId;
      _formData2.tradeName = tradeName;
      if (gstNo) _formData2.tradeLicenseDetail.additionalDetail.gstNo = gstNo;
      if (noOfEmployees) _formData2.tradeLicenseDetail.noOfEmployees = noOfEmployees;
      if (operationalArea) _formData2.tradeLicenseDetail.operationalArea = operationalArea;
      if ((data === null || data === void 0 ? void 0 : (_data$accessories6 = data.accessories) === null || _data$accessories6 === void 0 ? void 0 : _data$accessories6.length) > 0) _formData2.tradeLicenseDetail.accessories = data === null || data === void 0 ? void 0 : data.accessories;
      if ((data === null || data === void 0 ? void 0 : (_data$tradeUnits3 = data.tradeUnits) === null || _data$tradeUnits3 === void 0 ? void 0 : _data$tradeUnits3.length) > 0) _formData2.tradeLicenseDetail.tradeUnits = data === null || data === void 0 ? void 0 : data.tradeUnits;
      if ((data === null || data === void 0 ? void 0 : (_data$owners3 = data.owners) === null || _data$owners3 === void 0 ? void 0 : _data$owners3.length) > 0) _formData2.tradeLicenseDetail.owners = data === null || data === void 0 ? void 0 : data.owners;
      if (data !== null && data !== void 0 && data.address) _formData2.tradeLicenseDetail.address = data === null || data === void 0 ? void 0 : data.address;
      if (structureType) _formData2.tradeLicenseDetail.structureType = structureType;
      if (subOwnerShipCategory) _formData2.tradeLicenseDetail.subOwnerShipCategory = subOwnerShipCategory;
      if (applicationDocuments) _formData2.tradeLicenseDetail.applicationDocuments = applicationDocuments;
      Digit.TLService.update({
        Licenses: [_formData2]
      }, tenantId).then(function (result, err) {
        var _result$Licenses3;

        if ((result === null || result === void 0 ? void 0 : (_result$Licenses3 = result.Licenses) === null || _result$Licenses3 === void 0 ? void 0 : _result$Licenses3.length) > 0) {
          var _result$Licenses4;

          var licenses = result === null || result === void 0 ? void 0 : (_result$Licenses4 = result.Licenses) === null || _result$Licenses4 === void 0 ? void 0 : _result$Licenses4[0];
          licenses.action = "APPLY";
          Digit.TLService.update({
            Licenses: [licenses]
          }, tenantId).then(function (response) {
            var _response$Licenses;

            if ((response === null || response === void 0 ? void 0 : (_response$Licenses = response.Licenses) === null || _response$Licenses === void 0 ? void 0 : _response$Licenses.length) > 0) {
              history.replace("/digit-ui/employee/tl/response", {
                data: response === null || response === void 0 ? void 0 : response.Licenses
              });
            }
          }).catch(function (e) {
            var _e$response2, _e$response2$data, _e$response2$data$Err;

            setShowToast({
              key: "error"
            });
            setError((e === null || e === void 0 ? void 0 : (_e$response2 = e.response) === null || _e$response2 === void 0 ? void 0 : (_e$response2$data = _e$response2.data) === null || _e$response2$data === void 0 ? void 0 : (_e$response2$data$Err = _e$response2$data.Errors[0]) === null || _e$response2$data$Err === void 0 ? void 0 : _e$response2$data$Err.message) || null);
          });
        }
      }).catch(function (e) {
        var _e$response3, _e$response3$data, _e$response3$data$Err;

        setShowToast({
          key: "error"
        });
        setError((e === null || e === void 0 ? void 0 : (_e$response3 = e.response) === null || _e$response3 === void 0 ? void 0 : (_e$response3$data = _e$response3.data) === null || _e$response3$data === void 0 ? void 0 : (_e$response3$data$Err = _e$response3$data.Errors[0]) === null || _e$response3$data$Err === void 0 ? void 0 : _e$response3$data$Err.message) || null);
      });
    }
  };

  var configs = [];
  newConfig.map(function (conf) {
    if (conf.head !== "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT") {
      configs.push(conf);
    }
  });

  function checkHead(head) {
    if (head === "ES_NEW_APPLICATION_LOCATION_DETAILS") {
      return "TL_CHECK_ADDRESS";
    } else if (head === "ES_NEW_APPLICATION_OWNERSHIP_DETAILS") {
      return "TL_OWNERSHIP_DETAILS_HEADER";
    } else {
      return head;
    }
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "15px"
    }
  }, /*#__PURE__*/React.createElement(Header, null, window.location.href.includes("employee/tl/edit-application-details") ? t("ES_TITLE_RE_NEW_TRADE_LICESE_APPLICATION") : t("ES_TITLE_RENEW_TRADE_LICESE_APPLICATION"))), /*#__PURE__*/React.createElement(FormComposer, {
    heading: "",
    isDisabled: !canSubmit,
    label: t("ES_COMMON_APPLICATION_SUBMIT"),
    config: configs.map(function (config) {
      return _extends({}, config, {
        body: config.body.filter(function (a) {
          return !a.hideInEmployee;
        }),
        head: checkHead(config.head)
      });
    }),
    fieldStyle: {
      marginRight: 0
    },
    onSubmit: onSubmit,
    defaultValues: defaultValues,
    onFormValueChange: onFormValueChange,
    breaklineStyle: {
      border: "0px"
    }
  }), showToast && /*#__PURE__*/React.createElement(Toast, {
    error: (showToast === null || showToast === void 0 ? void 0 : showToast.key) === "error" ? true : false,
    label: error,
    onClose: closeToast
  }));
};

var TLBreadCrumb = function TLBreadCrumb(_ref) {
  var _location$pathname, _location$pathname2, _location$pathname3, _location$pathname4, _location$pathname5, _location$pathname6, _location$pathname7, _location$pathname8, _location$pathname9;

  var location = _ref.location;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var isSearch = location === null || location === void 0 ? void 0 : (_location$pathname = location.pathname) === null || _location$pathname === void 0 ? void 0 : _location$pathname.includes("search");
  var isInbox = location === null || location === void 0 ? void 0 : (_location$pathname2 = location.pathname) === null || _location$pathname2 === void 0 ? void 0 : _location$pathname2.includes("inbox");
  var isApplicationSearch = location === null || location === void 0 ? void 0 : (_location$pathname3 = location.pathname) === null || _location$pathname3 === void 0 ? void 0 : _location$pathname3.includes("search/application");
  var isLicenceSearch = location === null || location === void 0 ? void 0 : (_location$pathname4 = location.pathname) === null || _location$pathname4 === void 0 ? void 0 : _location$pathname4.includes("search/license");
  var isEditApplication = location === null || location === void 0 ? void 0 : (_location$pathname5 = location.pathname) === null || _location$pathname5 === void 0 ? void 0 : _location$pathname5.includes("edit-application-details");
  var isRenewalApplication = location === null || location === void 0 ? void 0 : (_location$pathname6 = location.pathname) === null || _location$pathname6 === void 0 ? void 0 : _location$pathname6.includes("renew-application-details");
  var isApplicationDetails = location === null || location === void 0 ? void 0 : (_location$pathname7 = location.pathname) === null || _location$pathname7 === void 0 ? void 0 : _location$pathname7.includes("tl/application-details");
  var isNewApplication = location === null || location === void 0 ? void 0 : (_location$pathname8 = location.pathname) === null || _location$pathname8 === void 0 ? void 0 : _location$pathname8.includes("tl/new-application");
  var isResponse = location === null || location === void 0 ? void 0 : (_location$pathname9 = location.pathname) === null || _location$pathname9 === void 0 ? void 0 : _location$pathname9.includes("tl/response");

  var _useState = useState(false),
      search = _useState[0],
      setSearch = _useState[1];

  var locationsForTLEmployee = window.location.href;
  var breadCrumbUrl = sessionStorage.getItem("breadCrumbUrl") || "";

  if (locationsForTLEmployee.includes("inbox")) {
    sessionStorage.setItem("breadCrumbUrl", "inbox");
  } else if (locationsForTLEmployee.includes("home")) {
    sessionStorage.setItem("breadCrumbUrl", "home");
  } else if (locationsForTLEmployee.includes("search/license")) {
    if (breadCrumbUrl == "home") sessionStorage.setItem("breadCrumbUrl", "home/license");else if (breadCrumbUrl == "inbox") sessionStorage.setItem("breadCrumbUrl", "inbox/license");else sessionStorage.setItem("breadCrumbUrl", breadCrumbUrl.includes("home/license") ? "home/license" : "inbox/license");
  } else if (locationsForTLEmployee.includes("search/application")) {
    if (breadCrumbUrl == "home") sessionStorage.setItem("breadCrumbUrl", "home/search");else if (breadCrumbUrl == "inbox") sessionStorage.setItem("breadCrumbUrl", "inbox/search");else sessionStorage.setItem("breadCrumbUrl", breadCrumbUrl.includes("home/search") ? "home/search" : "inbox/search");
  } else if (locationsForTLEmployee.includes("new-application")) {
    if (breadCrumbUrl == "home") sessionStorage.setItem("breadCrumbUrl", "home/newApp");else if (breadCrumbUrl == "inbox") sessionStorage.setItem("breadCrumbUrl", "inbox/newApp");
  } else if (locationsForTLEmployee.includes("application-details")) {
    if (breadCrumbUrl == "home/license") sessionStorage.setItem("breadCrumbUrl", "home/license/appDetails");else if (breadCrumbUrl == "inbox/license") sessionStorage.setItem("breadCrumbUrl", "inbox/license/appDetails");else if (breadCrumbUrl == "home/search") sessionStorage.setItem("breadCrumbUrl", "home/search/appDetails");else if (breadCrumbUrl == "inbox/search") sessionStorage.setItem("breadCrumbUrl", "inbox/search/appDetails");else if (breadCrumbUrl == "inbox") sessionStorage.setItem("breadCrumbUrl", "inbox/appDetails");
  } else if (locationsForTLEmployee.includes("renew-application-details")) {
    if (breadCrumbUrl == "inbox/appDetails") sessionStorage.setItem("breadCrumbUrl", "inbox/appDetails/renew");else if (breadCrumbUrl == "home/license/appDetails") sessionStorage.setItem("breadCrumbUrl", "home/license/appDetails/renew");else if (breadCrumbUrl == "inbox/license/appDetails") sessionStorage.setItem("breadCrumbUrl", "inbox/license/appDetails/renew");else if (breadCrumbUrl == "home/search/appDetails") sessionStorage.setItem("breadCrumbUrl", "home/search/appDetails/renew");else if (breadCrumbUrl == "inbox/search/appDetails") sessionStorage.setItem("breadCrumbUrl", "inbox/search/appDetails/renew");
  } else if (locationsForTLEmployee.includes("edit-application-details")) {
    if (breadCrumbUrl == "inbox/appDetails") sessionStorage.setItem("breadCrumbUrl", "inbox/appDetails/renew");else if (breadCrumbUrl == "home/license/appDetails") sessionStorage.setItem("breadCrumbUrl", "home/license/appDetails/edit");else if (breadCrumbUrl == "inbox/license/appDetails") sessionStorage.setItem("breadCrumbUrl", "inbox/license/appDetails/edit");else if (breadCrumbUrl == "home/search/appDetails") sessionStorage.setItem("breadCrumbUrl", "home/search/appDetails/edit");else if (breadCrumbUrl == "inbox/search/appDetails") sessionStorage.setItem("breadCrumbUrl", "inbox/search/appDetails/edit");
  } else if (locationsForTLEmployee.includes("response")) {
    sessionStorage.setItem("breadCrumbUrl", "");
  }

  useEffect(function () {
    if (!search) {
      setSearch(isSearch);
    } else if (isInbox && search) {
      setSearch(false);
    }
  }, [location]);
  var breadCrumbUrls = sessionStorage.getItem("breadCrumbUrl") || "";
  var crumbs = [{
    path: "/digit-ui/employee",
    content: t("ES_COMMON_HOME"),
    show: true
  }, {
    path: "/digit-ui/employee/tl/inbox",
    content: t("ES_TITLE_INBOX"),
    show: breadCrumbUrls.includes("inbox") || isInbox
  }, {
    path: "/digit-ui/employee/tl/search/application",
    content: t("ES_COMMON_SEARCH_APPLICATION"),
    show: isApplicationSearch || breadCrumbUrls.includes("home/search") || breadCrumbUrls.includes("inbox/search")
  }, {
    path: "/digit-ui/employee/tl/search/license",
    content: t("TL_SEARCH_TRADE_HEADER"),
    show: isLicenceSearch || breadCrumbUrls.includes("home/license") || breadCrumbUrls.includes("inbox/license")
  }, {
    path: sessionStorage.getItem("applicationNumber") ? "/digit-ui/employee/tl/application-details/" + sessionStorage.getItem("applicationNumber") : "",
    content: t("TL_DETAILS_HEADER_LABEL"),
    show: isApplicationDetails || breadCrumbUrls.includes("inbox/appDetails") || breadCrumbUrls.includes("home/license/appDetails") || breadCrumbUrls.includes("inbox/license/appDetails") || breadCrumbUrls.includes("home/search/appDetails") || breadCrumbUrls.includes("inbox/search/appDetails")
  }, {
    path: "/digit-ui/employee/tl/new-application",
    content: t("TL_HOME_SEARCH_RESULTS_NEW_APP_BUTTON"),
    show: isNewApplication || breadCrumbUrls.includes("home/newApp") || breadCrumbUrls.includes("inbox/newApp")
  }, {
    content: t("ES_TITLE_RENEW_TRADE_LICESE_APPLICATION"),
    show: isRenewalApplication || breadCrumbUrls.includes("inbox/appDetails/renew") || breadCrumbUrls.includes("home/license/appDetails/renew") || breadCrumbUrls.includes("inbox/license/appDetails/renew") || breadCrumbUrls.includes("home/search/appDetails/renew") || breadCrumbUrls.includes("inbox/search/appDetails/renew")
  }, {
    content: t("ES_TITLE_RE_NEW_TRADE_LICESE_APPLICATION"),
    show: isEditApplication || breadCrumbUrls.includes("inbox/appDetails/edit") || breadCrumbUrls.includes("home/license/appDetails/edit") || breadCrumbUrls.includes("inbox/license/appDetails/edit") || breadCrumbUrls.includes("home/search/appDetails/edit") || breadCrumbUrls.includes("inbox/search/appDetails/edit")
  }, {
    path: "/digit-ui/employee/tl/inbox",
    content: t("ACTION_TEST_RESPONSE"),
    show: isResponse
  }];
  return /*#__PURE__*/React.createElement(BreadCrumb, {
    crumbs: crumbs
  });
};

var EmployeeApp = function EmployeeApp(_ref2) {
  var path = _ref2.path,
      url = _ref2.url;

  var _useTranslation2 = useTranslation(),
      t = _useTranslation2.t;

  var location = useLocation();
  var locationCheck = window.location.href.includes("employee/tl/new-application") || window.location.href.includes("employee/tl/response") || window.location.href.includes("employee/tl/application-details") || window.location.href.includes("employee/tl/edit-application-details") || window.location.href.includes("employee/tl/renew-application-details");
  return /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ground-container",
    style: locationCheck ? {
      width: "100%"
    } : {}
  }, /*#__PURE__*/React.createElement("div", {
    style: locationCheck ? {
      marginLeft: "15px"
    } : {}
  }, /*#__PURE__*/React.createElement(TLBreadCrumb, {
    location: location
  })), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/inbox",
    component: function component() {
      return /*#__PURE__*/React.createElement(Inbox, {
        parentRoute: path,
        businessService: "TL",
        filterComponent: "TL_INBOX_FILTER",
        initialStates: {},
        isInbox: true
      });
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/new-application",
    component: function component() {
      return /*#__PURE__*/React.createElement(NewApplication, {
        parentUrl: url
      });
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/application-details/:id",
    component: function component() {
      return /*#__PURE__*/React.createElement(ApplicationDetails$2, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/renew-application-details/:id",
    component: function component(props) {
      return /*#__PURE__*/React.createElement(ReNewApplication, _extends({}, props, {
        parentRoute: path
      }));
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/edit-application-details/:id",
    component: function component(props) {
      return /*#__PURE__*/React.createElement(ReNewApplication, _extends({}, props, {
        header: t("TL_ACTION_RESUBMIT"),
        parentRoute: path
      }));
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/response",
    component: function component(props) {
      return /*#__PURE__*/React.createElement(Response, _extends({}, props, {
        parentRoute: path
      }));
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/search/:variant",
    component: function component(props) {
      return /*#__PURE__*/React.createElement(Search, _extends({}, props, {
        parentRoute: path
      }));
    }
  }))));
};

var TLModule = function TLModule(_ref) {
  var stateCode = _ref.stateCode,
      userType = _ref.userType,
      tenants = _ref.tenants;

  var _useRouteMatch = useRouteMatch(),
      path = _useRouteMatch.path,
      url = _useRouteMatch.url;

  var moduleCode = "TL";
  var language = Digit.StoreData.getCurrentLanguage();

  var _Digit$Services$useSt = Digit.Services.useStore({
    stateCode: stateCode,
    moduleCode: moduleCode,
    language: language
  });

  Digit.SessionStorage.set("TL_TENANTS", tenants);

  if (userType === "employee") {
    return /*#__PURE__*/React.createElement(EmployeeApp, {
      path: path,
      url: url,
      userType: userType
    });
  } else return /*#__PURE__*/React.createElement(App, null);
};
var TLLinks = function TLLinks(_ref2) {
  var matchPath = _ref2.matchPath;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("PT_CREATE_TRADE", {}),
      clearParams = _Digit$Hooks$useSessi[2];

  useEffect(function () {
    clearParams();
  }, []);
  var links = [{
    link: matchPath + "/tradelicence/new-application",
    i18nKey: t("TL_CREATE_TRADE")
  }, {
    link: matchPath + "/tradelicence/renewal-list",
    i18nKey: t("TL_RENEWAL_HEADER")
  }, {
    link: matchPath + "/tradelicence/my-application",
    i18nKey: t("TL_MY_APPLICATIONS_HEADER")
  }];
  return /*#__PURE__*/React.createElement(CitizenHomeCard, {
    header: t("ACTION_TEST_TRADE_LICENSE"),
    links: links,
    Icon: function Icon() {
      return /*#__PURE__*/React.createElement(CaseIcon, {
        className: "fill-path-primary-main"
      });
    }
  });
};
var componentsToRegister = {
  TLModule: TLModule,
  TLLinks: TLLinks,
  TLCard: TLCard,
  TradeLicense: TradeLicense,
  SelectTradeName: SelectTradeName,
  SelectStructureType: SelectStructureType,
  SelectVehicleType: SelectVehicleType,
  SelectBuildingType: SelectBuildingType,
  SelectCommencementDate: SelectCommencementDate,
  SelectTradeUnits: SelectTradeUnits,
  SelectAccessories: SelectAccessories,
  SelectAccessoriesDetails: SelectAccessoriesDetails,
  TLSelectGeolocation: TLSelectGeolocation,
  TLSelectAddress: TLSelectAddress,
  TLSelectPincode: TLSelectPincode,
  Proof: Proof,
  SelectOwnerShipDetails: SelectOwnerShipDetails,
  SelectOwnerDetails: SelectOwnerDetails,
  SelectOwnerAddress: SelectOwnerAddress,
  SelectProofIdentity: SelectProofIdentity,
  SelectOwnershipProof: SelectOwnershipProof,
  CheckPage: CheckPage,
  TLDocument: TLDocument,
  TLAcknowledgement: TLAcknowledgement,
  TradeLicenseList: TradeLicenseList,
  MyApplications: MyApplications,
  TLOwnerDetailsEmployee: TLOwnerDetailsEmployee,
  TLTradeDetailsEmployee: TLTradeDetailsEmployee,
  TLTradeUnitsEmployee: TLTradeUnitsEmployee,
  TLAccessoriesEmployee: TLAccessoriesEmployee,
  TLDocumentsEmployee: TLDocumentsEmployee,
  SearchApplication: SearchApplication,
  SearchLicense: SearchLicense,
  TL_INBOX_FILTER: Filter,
  TLInfoLabel: TLInfoLabel,
  TLWFApplicationTimeline: TLWFApplicationTimeline
};
var initTLComponents = function initTLComponents() {
  Object.entries(componentsToRegister).forEach(function (_ref3) {
    var key = _ref3[0],
        value = _ref3[1];
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

export { TLLinks, TLModule, initTLComponents };
//# sourceMappingURL=index.modern.js.map
