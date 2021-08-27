import { Card, PTIcon, Table, CloseSvg, Label, TextInput, DatePicker, SubmitBar, LinkLabel, ActionBar, Loader, DetailsCard, SearchAction, FilterAction, PopUp, ShippingTruck, Header, Modal, FormComposer as FormComposer$1, Menu, StatusTable, Row, Toast, CardSectionHeader, CardLabelError, LabelFieldPair, CardLabel, BreakLine, CardSubHeader, TextArea, Dropdown, Banner, CardText, LinkButton, PrivateRoute, EmployeeModuleCard, CheckBox, FormStep, RadioOrSelect, ResponseComposer, AppContainer, BackButton, CitizenHomeCard } from '@egovernments/digit-ui-react-components';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useHistory, useRouteMatch, useLocation, Switch, Route } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import 'react-query';

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

var _Pact = /*#__PURE__*/function () {
  function _Pact() {}

  _Pact.prototype.then = function (onFulfilled, onRejected) {
    var result = new _Pact();
    var state = this.s;

    if (state) {
      var callback = state & 1 ? onFulfilled : onRejected;

      if (callback) {
        try {
          _settle(result, 1, callback(this.v));
        } catch (e) {
          _settle(result, 2, e);
        }

        return result;
      } else {
        return this;
      }
    }

    this.o = function (_this) {
      try {
        var value = _this.v;

        if (_this.s & 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
        } else if (onRejected) {
          _settle(result, 1, onRejected(value));
        } else {
          _settle(result, 2, value);
        }
      } catch (e) {
        _settle(result, 2, e);
      }
    };

    return result;
  };

  return _Pact;
}();
function _settle(pact, state, value) {
  if (!pact.s) {
    if (value instanceof _Pact) {
      if (value.s) {
        if (state & 1) {
          state = value.s;
        }

        value = value.v;
      } else {
        value.o = _settle.bind(null, pact, state);
        return;
      }
    }

    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
      return;
    }

    pact.s = state;
    pact.v = value;
    var observer = pact.o;

    if (observer) {
      observer(pact);
    }
  }
}
function _isSettledPact(thenable) {
  return thenable instanceof _Pact && thenable.s & 1;
}
function _forTo(array, body, check) {
  var i = -1,
      pact,
      reject;

  function _cycle(result) {
    try {
      while (++i < array.length && (!check || !check())) {
        result = body(i);

        if (result && result.then) {
          if (_isSettledPact(result)) {
            result = result.v;
          } else {
            result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
            return;
          }
        }
      }

      if (pact) {
        _settle(pact, 1, result);
      } else {
        pact = result;
      }
    } catch (e) {
      _settle(pact || (pact = new _Pact()), 2, e);
    }
  }

  _cycle();

  return pact;
}
function _forIn(target, body, check) {
  var keys = [];

  for (var key in target) {
    keys.push(key);
  }

  return _forTo(keys, function (i) {
    return body(keys[i]);
  }, check);
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

var InboxLinks = function InboxLinks(_ref) {

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState([]),
      links = _useState[0],
      setLinks = _useState[1];

  var allLinks = [{
    text: t("UC_GENERATE_NEW_CHALLAN"),
    link: "/digit-ui/employee/mcollect/new-application",
    roles: []
  }];
  useEffect(function () {
    var linksToShow = allLinks;
    setLinks(linksToShow);
  }, []);

  var GetLogo = function GetLogo() {
    return /*#__PURE__*/React.createElement("div", {
      className: "header",
      style: {
        justifyContent: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "logo"
    }, /*#__PURE__*/React.createElement(PTIcon, null)), " ", /*#__PURE__*/React.createElement("span", {
      className: "text"
    }, t("UC_COMMON_HEADER_SEARCH")));
  };

  return /*#__PURE__*/React.createElement(Card, {
    style: {
      paddingRight: 0,
      marginTop: 0
    },
    className: "employeeCard filter inboxLinks"
  }, /*#__PURE__*/React.createElement("div", {
    className: "complaint-links-container"
  }, GetLogo(), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, links.map(function (_ref2, index) {
    var link = _ref2.link,
        text = _ref2.text,
        _ref2$hyperlink = _ref2.hyperlink,
        hyperlink = _ref2$hyperlink === void 0 ? false : _ref2$hyperlink;
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

var SearchApplication = function SearchApplication(_ref) {
  var _searchFields$filter;

  var onSearch = _ref.onSearch,
      type = _ref.type,
      onClose = _ref.onClose,
      searchFields = _ref.searchFields,
      searchParams = _ref.searchParams,
      isInboxPage = _ref.isInboxPage;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useForm = useForm({
    defaultValues: searchParams
  }),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      reset = _useForm.reset,
      watch = _useForm.watch,
      control = _useForm.control;

  var mobileView = innerWidth <= 640;

  var onSubmitInput = function onSubmitInput(data) {
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
  };

  function clearSearch() {
    var resetValues = searchFields.reduce(function (acc, field) {
      var _extends2;

      return _extends({}, acc, (_extends2 = {}, _extends2[field === null || field === void 0 ? void 0 : field.name] = "", _extends2));
    }, {});
    reset(resetValues);

    var _newParams = _extends({}, searchParams);

    _newParams.delete = [];
    searchFields.forEach(function (e) {
      _newParams.delete.push(e === null || e === void 0 ? void 0 : e.name);
    });
    onSearch(_extends({}, _newParams));
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
    }, t("UC_CLEAR_SEARCH_LABEL"));
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
    return /*#__PURE__*/React.createElement("div", {
      key: input.name,
      className: "input-fields"
    }, /*#__PURE__*/React.createElement("span", {
      key: index,
      className: "complaint-input"
    }, "  ", /*#__PURE__*/React.createElement(Label, null, input.label), input.type !== "date" ? /*#__PURE__*/React.createElement("div", {
      className: "field-container"
    }, input !== null && input !== void 0 && input.componentInFront ? /*#__PURE__*/React.createElement("span", {
      className: "citizen-card-input citizen-card-input--front",
      style: {
        flex: "none"
      }
    }, input === null || input === void 0 ? void 0 : input.componentInFront) : null, /*#__PURE__*/React.createElement(TextInput, _extends({}, input, {
      inputRef: register,
      watch: watch,
      shouldUpdate: true
    }))) : /*#__PURE__*/React.createElement(Controller, {
      render: function render(props) {
        return /*#__PURE__*/React.createElement(DatePicker, {
          date: props.value,
          onChange: props.onChange
        });
      },
      name: input.name,
      control: control,
      defaultValue: null
    }), " "));
  }), type === "desktop" && !mobileView && /*#__PURE__*/React.createElement("div", {
    className: "search-action-wrapper",
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    className: "submit-bar-search",
    label: t("UC_SEARCH_LABEL"),
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
    label: t("UC_SEARCH_LABEL"),
    style: {
      flex: 1
    },
    submit: true
  }))));
};

var printReciept = function printReciept(businessService, receiptNumber) {
  try {
    var tenantId = Digit.ULBService.getCurrentTenantId();
    var state = tenantId === null || tenantId === void 0 ? void 0 : tenantId.split(".")[0];
    return Promise.resolve(Digit.PaymentService.getReciept(tenantId, businessService, {
      consumerCodes: receiptNumber
    })).then(function (payments) {
      var _payments$Payments$;

      function _temp2() {
        return Promise.resolve(Digit.PaymentService.printReciept(state, {
          fileStoreIds: response.filestoreIds[0]
        })).then(function (fileStore) {
          window.open(fileStore[response.filestoreIds[0]], "_blank");
        });
      }

      var response = {
        filestoreIds: [(_payments$Payments$ = payments.Payments[0]) === null || _payments$Payments$ === void 0 ? void 0 : _payments$Payments$.fileStoreId]
      };

      var _temp = function () {
        var _payments$Payments$2;

        if (!((_payments$Payments$2 = payments.Payments[0]) !== null && _payments$Payments$2 !== void 0 && _payments$Payments$2.fileStoreId)) {
          return Promise.resolve(Digit.PaymentService.generatePdf(state, {
            Payments: payments.Payments
          }, "consolidatedreceipt")).then(function (_Digit$PaymentService) {
            response = _Digit$PaymentService;
          });
        }
      }();

      return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var getActionButton = function getActionButton(businessService, receiptNumber) {
  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React.createElement("a", {
    href: "javascript:void(0)",
    style: {
      color: "#FE7A51",
      cursor: "pointer"
    },
    onClick: function onClick(value) {
      downloadAndPrintReciept(businessService, receiptNumber);
    }
  }, " ", t("UC_DOWNLOAD_RECEIPT"), " ");
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
var convertEpochToDate = function convertEpochToDate(dateEpoch) {
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
var downloadPdf = function downloadPdf(blob, fileName) {
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(function () {
    return URL.revokeObjectURL(link.href);
  }, 7000);
};
var printPdf = function printPdf(blob) {
  var fileURL = URL.createObjectURL(blob);
  var myWindow = window.open(fileURL);

  if (myWindow != undefined) {
    myWindow.addEventListener("load", function (event) {
      myWindow.focus();
      myWindow.print();
    });
  }
};
var downloadAndPrintChallan = function downloadAndPrintChallan(challanNo, mode) {
  if (mode === void 0) {
    mode = "download";
  }

  try {
    var tenantId = Digit.ULBService.getCurrentTenantId();
    return Promise.resolve(Digit.MCollectService.downloadPdf(challanNo, tenantId)).then(function (response) {
      var responseStatus = parseInt(response.status, 10);

      if (responseStatus === 201 || responseStatus === 200) {
        mode == "print" ? printPdf(new Blob([response.data], {
          type: "application/pdf"
        })) : downloadPdf(new Blob([response.data], {
          type: "application/pdf"
        }), "CHALLAN-" + challanNo + ".pdf");
      }
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var downloadAndPrintReciept = function downloadAndPrintReciept(bussinessService, consumerCode, mode) {
  if (mode === void 0) {
    mode = "download";
  }

  try {
    var tenantId = Digit.ULBService.getCurrentTenantId();
    return Promise.resolve(Digit.MCollectService.receipt_download(bussinessService, consumerCode, tenantId)).then(function (response) {
      var responseStatus = parseInt(response.status, 10);

      if (responseStatus === 201 || responseStatus === 200) {
        var fileName = mode == "print" ? printPdf(new Blob([response.data], {
          type: "application/pdf"
        })) : downloadPdf(new Blob([response.data], {
          type: "application/pdf"
        }), "CHALLAN-" + consumerCode + ".pdf");
      }
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var DesktopInbox = function DesktopInbox(_ref) {
  var filterComponent = _ref.filterComponent,
      props = _objectWithoutPropertiesLoose(_ref, ["tableConfig", "filterComponent", "columns"]);

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

  var convertEpochToDate = function convertEpochToDate(dateEpoch) {
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

  var GetMobCell = function GetMobCell(value) {
    return /*#__PURE__*/React.createElement("span", {
      className: "sla-cell"
    }, value);
  };

  var inboxColumns = function inboxColumns() {
    return [{
      Header: t("UC_CHALLAN_NUMBER"),
      Cell: function Cell(_ref2) {
        var _row$original, _row$original2;

        var row = _ref2.row;
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
          className: "link"
        }, /*#__PURE__*/React.createElement(Link, {
          to: props.parentRoute + "/challansearch/" + ((_row$original = row.original) === null || _row$original === void 0 ? void 0 : _row$original["challanNo"])
        }, (_row$original2 = row.original) === null || _row$original2 === void 0 ? void 0 : _row$original2["challanNo"])));
      },
      mobileCell: function mobileCell(original) {
        return GetMobCell(original === null || original === void 0 ? void 0 : original["challanNo"]);
      }
    }, {
      Header: t("UC_COMMON_TABLE_COL_PAYEE_NAME"),
      Cell: function Cell(_ref3) {
        var _row$original3;

        var row = _ref3.row;
        return GetCell("" + ((_row$original3 = row.original) === null || _row$original3 === void 0 ? void 0 : _row$original3["name"]));
      },
      mobileCell: function mobileCell(original) {
        return GetMobCell(original === null || original === void 0 ? void 0 : original["name"]);
      }
    }, {
      Header: t("UC_SERVICE_CATEGORY_LABEL"),
      Cell: function Cell(_ref4) {
        var _row$original4;

        var row = _ref4.row;
        var code = stringReplaceAll("" + ((_row$original4 = row.original) === null || _row$original4 === void 0 ? void 0 : _row$original4["businessService"]), ".", "_");
        code = code.toUpperCase();
        return GetCell(t("BILLINGSERVICE_BUSINESSSERVICE_" + code));
      },
      mobileCell: function mobileCell(original) {
        return GetMobCell("BILLINGSERVICE_BUSINESSSERVICE_" + (original === null || original === void 0 ? void 0 : original["businessService"]));
      }
    }, {
      Header: t("UC_DUE_DATE"),
      Cell: function Cell(_ref5) {
        var _row$original5, _row$original6;

        var row = _ref5.row;
        var dueDate = ((_row$original5 = row.original) === null || _row$original5 === void 0 ? void 0 : _row$original5.dueDate) === "NA" ? t("CS_NA") : convertEpochToDate((_row$original6 = row.original) === null || _row$original6 === void 0 ? void 0 : _row$original6.dueDate);
        return GetCell(t("" + dueDate));
      },
      mobileCell: function mobileCell(original) {
        return GetMobCell(convertEpochToDate(original === null || original === void 0 ? void 0 : original["dueDate"]));
      }
    }, {
      Header: t("UC_TOTAL_AMOUNT"),
      Cell: function Cell(_ref6) {
        var _row$original7;

        var row = _ref6.row;
        return GetCell(t("" + ((_row$original7 = row.original) === null || _row$original7 === void 0 ? void 0 : _row$original7.totalAmount)));
      },
      mobileCell: function mobileCell(original) {
        return GetMobCell(original === null || original === void 0 ? void 0 : original["totalAmount"]);
      }
    }, {
      Header: t("UC_COMMON_TABLE_COL_STATUS"),
      Cell: function Cell(_ref7) {
        var _row$original9;

        var row = _ref7.row;
        return GetCell(t("" + ((_row$original9 = row.original) === null || _row$original9 === void 0 ? void 0 : _row$original9.applicationStatus)));
      },
      mobileCell: function mobileCell(original) {
        var _original$workflowDat, _original$workflowDat2;

        return GetMobCell(original === null || original === void 0 ? void 0 : (_original$workflowDat = original.workflowData) === null || _original$workflowDat === void 0 ? void 0 : (_original$workflowDat2 = _original$workflowDat.state) === null || _original$workflowDat2 === void 0 ? void 0 : _original$workflowDat2["state"]);
      }
    }, {
      Header: t("UC_TABLE_COL_ACTION"),
      Cell: function Cell(_ref8) {
        var _row$original10, _row$original14;

        var row = _ref8.row;
        var amount = (_row$original10 = row.original) === null || _row$original10 === void 0 ? void 0 : _row$original10.totalAmount;
        var action = "ACTIVE";
        if (amount > 0) action = "COLLECT";

        if (action == "COLLECT") {
          var _row$original11, _row$original12, _row$original13;

          return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
            className: "link"
          }, /*#__PURE__*/React.createElement(Link, {
            to: {
              pathname: "/digit-ui/employee/payment/collect/" + ((_row$original11 = row.original) === null || _row$original11 === void 0 ? void 0 : _row$original11["businessService"]) + "/" + ((_row$original12 = row.original) === null || _row$original12 === void 0 ? void 0 : _row$original12["challanNo"]) + "/tenantId=" + ((_row$original13 = row.original) === null || _row$original13 === void 0 ? void 0 : _row$original13["tenantId"]) + "?workflow=mcollect"
            }
          }, t("UC_" + action))));
        } else if (((_row$original14 = row.original) === null || _row$original14 === void 0 ? void 0 : _row$original14.applicationStatus) == "PAID") {
          var _row$original15, _row$original16;

          return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
            className: "link"
          }, getActionButton((_row$original15 = row.original) === null || _row$original15 === void 0 ? void 0 : _row$original15["businessService"], (_row$original16 = row.original) === null || _row$original16 === void 0 ? void 0 : _row$original16["challanNo"])));
        } else {
          return GetCell(t("CS_NA"));
        }
      },
      mobileCell: function mobileCell(original) {
        var _original$workflowDat3, _original$workflowDat4;

        return GetMobCell(original === null || original === void 0 ? void 0 : (_original$workflowDat3 = original.workflowData) === null || _original$workflowDat3 === void 0 ? void 0 : (_original$workflowDat4 = _original$workflowDat3.state) === null || _original$workflowDat4 === void 0 ? void 0 : _original$workflowDat4["state"]);
      }
    }];
  };

  var result;

  if (props.isLoading || props.isLoader) {
    result = /*#__PURE__*/React.createElement(Loader, null);
  } else if ((data === null || data === void 0 ? void 0 : data.length) === 0) {
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
  } else if ((data === null || data === void 0 ? void 0 : data.length) > 0) {
    var _React$createElement;

    result = /*#__PURE__*/React.createElement(ApplicationTable, (_React$createElement = {
      t: t,
      data: data,
      columns: inboxColumns(),
      getCellProps: function getCellProps(cellInfo) {
        return {
          style: {
            minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
            padding: "20px 18px",
            fontSize: "16px",
            wordBreak: "break-word",
            overflowWrap: 'break-word',
            width: "250px"
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
    businessService: props.businessService
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FilterComponent, {
    defaultSearchParams: props.defaultSearchParams,
    onFilterChange: props.onFilterChange,
    searchParams: props.searchParams,
    type: "desktop"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SearchApplication, {
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

var ApplicationCard = function ApplicationCard(_ref) {
  var t = _ref.t,
      data = _ref.data,
      onFilterChange = _ref.onFilterChange,
      onSearch = _ref.onSearch,
      serviceRequestIdKey = _ref.serviceRequestIdKey,
      isFstpOperator = _ref.isFstpOperator,
      isLoading = _ref.isLoading,
      isSearch = _ref.isSearch,
      searchParams = _ref.searchParams,
      searchFields = _ref.searchFields,
      sortParams = _ref.sortParams,
      linkPrefix = _ref.linkPrefix,
      filterComponent = _ref.filterComponent;

  var _useState = useState(isSearch ? "SEARCH" : ""),
      type = _useState[0],
      setType = _useState[1];

  var _useState2 = useState(isSearch ? true : false),
      popup = _useState2[0],
      setPopup = _useState2[1];

  var _useState3 = useState(sortParams),
      setSortParams = _useState3[1];

  var _useState4 = useState(function () {
    var _Digit$ComponentRegis;

    return (_Digit$ComponentRegis = Digit.ComponentRegistryService) === null || _Digit$ComponentRegis === void 0 ? void 0 : _Digit$ComponentRegis.getComponent(filterComponent);
  }),
      FilterComp = _useState4[0];

  var _useState5 = useState(searchParams),
      searchFilterParams = _useState5[0],
      setSearchFilterParams = _useState5[1];

  var onSearchFilter = function onSearchFilter(params) {
    onFilterChange(params, true);
    setPopup(false);
  };

  useEffect(function () {
    if (type) setPopup(true);
  }, [type]);

  var handlePopupClose = function handlePopupClose() {
    setPopup(false);
    setType("");
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
      linkPrefix: linkPrefix ? linkPrefix : "/digit-ui/employee/mcollect/challansearch/"
    });
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "searchBox"
  }, onSearch && /*#__PURE__*/React.createElement(SearchAction, {
    text: "SEARCH",
    handleActionClick: function handleActionClick() {
      setType("SEARCH");
      setSearchFilterParams({
        businessService: [],
        status: []
      });
      setPopup(true);
    }
  }), !isSearch && onFilterChange && /*#__PURE__*/React.createElement(FilterAction, {
    text: "FILTER",
    handleActionClick: function handleActionClick() {
      setType("FILTER");
      setSearchFilterParams({
        businessService: [],
        status: []
      });
      setPopup(true);
    }
  })), result, popup && /*#__PURE__*/React.createElement(PopUp, null, type === "FILTER" && /*#__PURE__*/React.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React.createElement(FilterComp, {
    onFilterChange: onSearchFilter,
    Close: handlePopupClose,
    type: "mobile",
    searchParams: searchFilterParams
  })), type === "SEARCH" && /*#__PURE__*/React.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React.createElement(SearchApplication, {
    type: "mobile",
    onClose: handlePopupClose,
    onSearch: onSearch,
    isFstpOperator: isFstpOperator,
    searchParams: searchFilterParams,
    searchFields: searchFields
  }))));
};

var InboxLinks$1 = function InboxLinks(_ref) {
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
    var linksToShow = allLinks ? allLinks.filter(function (e) {
      return e.businessService === businessService;
    }).filter(function (_ref2) {
      var roles = _ref2.roles;
      return roles.some(function (e) {
        return userRoles.map(function (_ref3) {
          var code = _ref3.code;
          return code;
        }).includes(e);
      }) || !roles.length;
    }) : [];
    setLinks(linksToShow);
  }, []);

  var GetLogo = function GetLogo() {
    return /*#__PURE__*/React.createElement("div", {
      className: "header",
      style: {
        justifyContent: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "logo"
    }, /*#__PURE__*/React.createElement(ShippingTruck, null)), " ", /*#__PURE__*/React.createElement("span", {
      className: "text"
    }, t(headerText)));
  };

  return /*#__PURE__*/React.createElement(Card, {
    style: {
      paddingRight: 0,
      marginTop: 0
    },
    className: "employeeCard filter"
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

var MobileInbox = function MobileInbox(_ref) {
  var data = _ref.data,
      isLoading = _ref.isLoading,
      isSearch = _ref.isSearch,
      searchFields = _ref.searchFields,
      onFilterChange = _ref.onFilterChange,
      onSearch = _ref.onSearch,
      onSort = _ref.onSort,
      parentRoute = _ref.parentRoute,
      searchParams = _ref.searchParams,
      sortParams = _ref.sortParams,
      linkPrefix = _ref.linkPrefix,
      filterComponent = _ref.filterComponent;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var GetMobCell = function GetMobCell(value) {
    return /*#__PURE__*/React.createElement("span", {
      className: "sla-cell"
    }, value);
  };

  var convertEpochToDate = function convertEpochToDate(dateEpoch) {
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

  var inboxColumns = function inboxColumns(props) {
    return [{
      Header: t("UC_CHALLAN_NUMBER"),
      mobileCell: function mobileCell(original) {
        return GetMobCell(original === null || original === void 0 ? void 0 : original["challanNo"]);
      }
    }, {
      Header: t("UC_COMMON_TABLE_COL_PAYEE_NAME"),
      mobileCell: function mobileCell(original) {
        return GetMobCell(original === null || original === void 0 ? void 0 : original["name"]);
      }
    }, {
      Header: t("UC_SERVICE_CATEGORY_LABEL"),
      mobileCell: function mobileCell(original) {
        var code = stringReplaceAll("" + (original === null || original === void 0 ? void 0 : original["businessService"]), ".", "_");
        code = code.toUpperCase();
        return GetMobCell(t("BILLINGSERVICE_BUSINESSSERVICE_" + code));
      }
    }, {
      Header: t("UC_DUE_DATE"),
      mobileCell: function mobileCell(original) {
        return GetMobCell((original === null || original === void 0 ? void 0 : original.dueDate) === "NA" ? t("CS_NA") : convertEpochToDate(original === null || original === void 0 ? void 0 : original.dueDate));
      }
    }, {
      Header: t("UC_TOTAL_AMOUNT"),
      mobileCell: function mobileCell(original) {
        return GetMobCell(original === null || original === void 0 ? void 0 : original["totalAmount"]);
      }
    }, {
      Header: t("UC_COMMON_TABLE_COL_STATUS"),
      mobileCell: function mobileCell(original) {
        return GetMobCell(original === null || original === void 0 ? void 0 : original.applicationStatus);
      }
    }, {
      Header: t("UC_TABLE_COL_ACTION"),
      mobileCell: function mobileCell(original) {
        var amount = original === null || original === void 0 ? void 0 : original.totalAmount;
        var action = "ACTIVE";
        if (amount > 0) action = "COLLECT";

        if (action == "COLLECT") {
          return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
            className: "link"
          }, /*#__PURE__*/React.createElement(Link, {
            to: {
              pathname: "/digit-ui/employee/payment/collect/" + (original === null || original === void 0 ? void 0 : original["businessService"]) + "/" + (original === null || original === void 0 ? void 0 : original["challanNo"]) + "/tenantId=" + (original === null || original === void 0 ? void 0 : original["tenantId"]) + "?workflow=mcollect"
            }
          }, t("UC_" + action))));
        } else if ((original === null || original === void 0 ? void 0 : original.applicationStatus) == "PAID") {
          return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
            className: "link"
          }, /*#__PURE__*/React.createElement(Link, null, /*#__PURE__*/React.createElement("a", {
            href: "javascript:void(0)",
            style: {
              color: "#FE7A51",
              cursor: "pointer"
            },
            onClick: function onClick(value) {
              printReciept(original === null || original === void 0 ? void 0 : original["businessService"], original === null || original === void 0 ? void 0 : original["challanNo"]);
            }
          }, " ", t("UC_DOWNLOAD_RECEIPT"), " "))));
        } else {
          return GetMobCell(t("CS_NA"));
        }
      }
    }];
  };

  var serviceRequestIdKey = function serviceRequestIdKey(original) {
    var _original$t, _original$t$props;

    return original === null || original === void 0 ? void 0 : (_original$t = original[t("UC_CHALLAN_NUMBER")]) === null || _original$t === void 0 ? void 0 : (_original$t$props = _original$t.props) === null || _original$t$props === void 0 ? void 0 : _original$t$props.children;
  };

  var getData = function getData() {
    return data === null || data === void 0 ? void 0 : data.map(function (dataObj) {
      var obj = {};
      var columns = inboxColumns();
      columns.forEach(function (el) {
        if (el.mobileCell) obj[el.Header] = el.mobileCell(dataObj);
      });
      return obj;
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
  }, !isSearch && /*#__PURE__*/React.createElement(InboxLinks$1, {
    linkPrefix: parentRoute,
    allLinks: [{
      text: t("UC_GENERATE_NEW_CHALLAN"),
      link: "/digit-ui/employee/mcollect/new-application",
      roles: []
    }],
    headerText: t("ACTION_TEST_MCOLLECT"),
    isMobile: true
  }), /*#__PURE__*/React.createElement(ApplicationCard, {
    t: t,
    data: getData(),
    onFilterChange: onFilterChange,
    isLoading: isLoading,
    isSearch: isSearch,
    onSearch: onSearch,
    onSort: onSort,
    searchParams: searchParams,
    searchFields: searchFields,
    linkPrefix: linkPrefix,
    sortParams: sortParams,
    serviceRequestIdKey: serviceRequestIdKey,
    filterComponent: filterComponent
  }))));
};

var Inbox = function Inbox(_ref) {
  var _sortParams$, _sortParams$2, _data$challans5, _rest$data;

  var parentRoute = _ref.parentRoute,
      _ref$businessService = _ref.businessService,
      businessService = _ref$businessService === void 0 ? "PT" : _ref$businessService,
      _ref$initialStates = _ref.initialStates,
      initialStates = _ref$initialStates === void 0 ? {} : _ref$initialStates,
      filterComponent = _ref.filterComponent,
      isInbox = _ref.isInbox;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var isMcollectAppChanged = Digit.SessionStorage.get("isMcollectAppChanged");

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState(initialStates.pageOffset || 0),
      pageOffset = _useState[0],
      setPageOffset = _useState[1];

  var _useState2 = useState(initialStates.pageSize || 10),
      pageSize = _useState2[0],
      setPageSize = _useState2[1];

  var _useState3 = useState(initialStates.sortParams || [{
    id: "createdTime",
    desc: false
  }]),
      sortParams = _useState3[0],
      setSortParams = _useState3[1];

  var _useState4 = useState(function () {
    return initialStates.searchParams || {};
  }),
      searchParams = _useState4[0],
      setSearchParams = _useState4[1];

  var _useState5 = useState({}),
      businessIdToOwnerMappings = _useState5[0],
      setBusinessIdToOwnerMappings = _useState5[1];

  var _useState6 = useState(true),
      isLoader = _useState6[0],
      setIsLoader = _useState6[1];

  var isMobile = window.Digit.Utils.browser.isMobile();
  var paginationParams = isMobile ? {
    limit: 100,
    offset: 0,
    sortOrder: sortParams !== null && sortParams !== void 0 && (_sortParams$ = sortParams[0]) !== null && _sortParams$ !== void 0 && _sortParams$.desc ? "DESC" : "ASC"
  } : {
    limit: pageSize,
    offset: pageOffset,
    sortOrder: sortParams !== null && sortParams !== void 0 && (_sortParams$2 = sortParams[0]) !== null && _sortParams$2 !== void 0 && _sortParams$2.desc ? "DESC" : "ASC"
  };

  var _Digit$Hooks$mcollect = Digit.Hooks.mcollect.useMCollectSearch({
    tenantId: tenantId,
    filters: _extends({}, searchParams, paginationParams),
    isMcollectAppChanged: isMcollectAppChanged
  }),
      hookLoading = _Digit$Hooks$mcollect.isLoading,
      data = _Digit$Hooks$mcollect.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$mcollect, ["isLoading", "isError", "error", "data"]);

  useEffect(function () {
    var _data$challans, _data$challans2;

    if (!hookLoading && !(data !== null && data !== void 0 && (_data$challans = data.challans) !== null && _data$challans !== void 0 && _data$challans.length) > 0) setIsLoader(false);else if (hookLoading || data !== null && data !== void 0 && (_data$challans2 = data.challans) !== null && _data$challans2 !== void 0 && _data$challans2.length) setIsLoader(true);
  }, [hookLoading, data]);
  var formedData = [];
  var res;
  var businessIdToOwnerMapping = {};
  useEffect(function () {
    var _data$challans4;

    var fetchMyAPI = function fetchMyAPI() {
      try {
        var _data$challans3;

        var _temp3 = function _temp3() {
          setIsLoader(false);
          setBusinessIdToOwnerMappings(businessIdToOwnerMapping);
        };

        var businessIds = [];
        var businessServiceMap = {};
        var challanNumbers = [];
        var challanNums = [];
        data === null || data === void 0 ? void 0 : (_data$challans3 = data.challans) === null || _data$challans3 === void 0 ? void 0 : _data$challans3.forEach(function (item) {
          challanNums = businessServiceMap[item.businessService] || [];
          challanNumbers = challanNums;
          challanNums.push(item.challanNo);
          businessServiceMap[item.businessService] = challanNums;
        });
        var processInstanceArray = [];

        var _temp4 = _forIn(businessServiceMap, function (key) {
          var consumerCodes = businessServiceMap[key].toString();
          return Promise.resolve(Digit.PaymentService.fetchBill(tenantId, {
            consumerCode: consumerCodes,
            businessService: key
          })).then(function (_Digit$PaymentService) {
            res = _Digit$PaymentService;
            processInstanceArray = processInstanceArray.concat(res.Bill);
            businessIdToOwnerMapping = {};
            processInstanceArray.filter(function (record) {
              return record.businessService;
            }).forEach(function (item) {
              var _item$billDetails$;

              businessIdToOwnerMapping[item.consumerCode] = {
                businessService: item.businessService,
                totalAmount: item.totalAmount || 0,
                dueDate: item === null || item === void 0 ? void 0 : (_item$billDetails$ = item.billDetails[0]) === null || _item$billDetails$ === void 0 ? void 0 : _item$billDetails$.expiryDate
              };
            });
          });
        });

        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
      } catch (e) {
        return Promise.reject(e);
      }
    };

    if (data !== null && data !== void 0 && data.challans && (data === null || data === void 0 ? void 0 : (_data$challans4 = data.challans) === null || _data$challans4 === void 0 ? void 0 : _data$challans4.length) > 0) {
      setIsLoader(true);
      fetchMyAPI();
    }
  }, [data]);
  data === null || data === void 0 ? void 0 : (_data$challans5 = data.challans) === null || _data$challans5 === void 0 ? void 0 : _data$challans5.map(function (data) {
    var _data$citizen, _businessIdToOwnerMap, _businessIdToOwnerMap2;

    formedData.push({
      challanNo: data === null || data === void 0 ? void 0 : data.challanNo,
      name: data === null || data === void 0 ? void 0 : (_data$citizen = data.citizen) === null || _data$citizen === void 0 ? void 0 : _data$citizen.name,
      applicationStatus: data === null || data === void 0 ? void 0 : data.applicationStatus,
      businessService: data === null || data === void 0 ? void 0 : data.businessService,
      totalAmount: ((_businessIdToOwnerMap = businessIdToOwnerMappings[data.challanNo]) === null || _businessIdToOwnerMap === void 0 ? void 0 : _businessIdToOwnerMap.totalAmount) || 0,
      dueDate: ((_businessIdToOwnerMap2 = businessIdToOwnerMappings[data.challanNo]) === null || _businessIdToOwnerMap2 === void 0 ? void 0 : _businessIdToOwnerMap2.dueDate) || "NA",
      tenantId: data === null || data === void 0 ? void 0 : data.tenantId
    });
  });
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
    var keys_to_delete = filterParam.delete;
    var _new = {};

    if (isMobile) {
      _new = _extends({}, filterParam);
    } else {
      _new = _extends({}, searchParams, filterParam);
    }

    if (keys_to_delete) keys_to_delete.forEach(function (key) {
      return delete _new[key];
    });
    delete _new.delete;
    delete filterParam.delete;
    setSearchParams(_extends({}, _new));
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
      label: t("UC_CHALLAN_NUMBER"),
      name: "challanNo"
    }, {
      label: t("UC_MOBILE_NUMBER_LABEL"),
      name: "mobileNumber",
      maxlength: 10,
      pattern: "[6-9][0-9]{9}",
      title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
      componentInFront: "+91"
    }];
  };

  if ((rest === null || rest === void 0 ? void 0 : (_rest$data = rest.data) === null || _rest$data === void 0 ? void 0 : _rest$data.length) !== null) {
    if (isMobile) {
      return /*#__PURE__*/React.createElement(MobileInbox, {
        data: formedData,
        isLoading: hookLoading,
        isSearch: !isInbox,
        searchFields: getSearchFields(),
        onFilterChange: handleFilterChange,
        onSearch: handleFilterChange,
        onSort: handleSort,
        parentRoute: parentRoute,
        searchParams: searchParams,
        sortParams: sortParams,
        tableConfig: rest === null || rest === void 0 ? void 0 : rest.tableConfig,
        filterComponent: filterComponent
      });
    } else {
      var _data$;

      return /*#__PURE__*/React.createElement("div", null, isInbox && /*#__PURE__*/React.createElement(Header, null, t("UC_SEARCH_MCOLLECT_HEADER")), /*#__PURE__*/React.createElement(DesktopInbox, {
        businessService: businessService,
        data: formedData,
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
        totalRecords: Number(data === null || data === void 0 ? void 0 : (_data$ = data[0]) === null || _data$ === void 0 ? void 0 : _data$.totalCount),
        filterComponent: filterComponent,
        isLoader: isLoader
      }));
    }
  }
};

var configMCollectRejectApplication = function configMCollectRejectApplication(_ref) {
  var t = _ref.t;
  return {
    label: {
      heading: "CANCEL_CHALLAN_HEADER",
      submit: "CANCEL_YES",
      cancel: "CANCEL_NO"
    },
    form: [{
      body: [{
        label: t("CANCEL_COMMENT_LABEL"),
        type: "textarea",
        populators: {
          name: "comments"
        }
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
  var t = _ref.t,
      action = _ref.action,
      closeModal = _ref.closeModal,
      submitAction = _ref.submitAction,
      applicationData = _ref.applicationData,
      billData = _ref.billData;

  var _useState = useState({}),
      config = _useState[0],
      setConfig = _useState[1];

  var _useState2 = useState({}),
      defaultValues = _useState2[0];

  function submit(data) {
    var bdata = [];
    billData === null || billData === void 0 ? void 0 : billData.map(function (bill) {
      bdata.push({
        taxHeadCode: bill === null || bill === void 0 ? void 0 : bill.taxHeadCode,
        amount: bill === null || bill === void 0 ? void 0 : bill.amount
      });
    });
    submitAction({
      Challan: _extends({}, applicationData, {
        applicationStatus: "CANCELLED",
        amount: bdata
      })
    });
  }

  useEffect(function () {
    switch (action) {
      case "CANCEL_CHALLAN":
        return setConfig(configMCollectRejectApplication({
          t: t,
          action: action
        }));

      default:
        console.log("default case");
        break;
    }
  }, [action]);
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
    formId: "modal-action"
  }, /*#__PURE__*/React.createElement(FormComposer$1, {
    config: config.form,
    noBoxShadow: true,
    inline: true,
    childrenAtTheBottom: true,
    onSubmit: submit,
    defaultValues: defaultValues,
    formId: "modal-action"
  })) : /*#__PURE__*/React.createElement(Loader, null);
};

var ActionModal$1 = function ActionModal$1(props) {
  return /*#__PURE__*/React.createElement(ActionModal, props);
};

var EmployeeChallan = function EmployeeChallan(props) {
  var _data$challans, _challanDetails$busin, _challanDetails$addre, _challanDetails$addre2, _challanDetails$addre3, _challanDetails$addre4;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useParams = useParams(),
      challanno = _useParams.challanno;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useState = useState([]),
      challanBillDetails = _useState[0],
      setChallanBillDetails = _useState[1];

  var _useState2 = useState(0),
      totalDueAmount = _useState2[0],
      setTotalDueAmount = _useState2[1];

  var _useState3 = useState(false),
      displayMenu = _useState3[0],
      setDisplayMenu = _useState3[1];

  var _useState4 = useState(false),
      showModal = _useState4[0],
      setShowModal = _useState4[1];

  var _useState5 = useState(null),
      selectedAction = _useState5[0],
      setSelectedAction = _useState5[1];

  var history = useHistory();

  var _useRouteMatch = useRouteMatch(),
      url = _useRouteMatch.url;

  var _useState6 = useState(false),
      isDisplayDownloadMenu = _useState6[0],
      setIsDisplayDownloadMenu = _useState6[1];

  var _useState7 = useState(null),
      showToast = _useState7[0],
      setShowToast = _useState7[1];

  useEffect(function () {
    switch (selectedAction) {
      case "CANCEL_CHALLAN":
        return setShowModal(true);

      case "UPDATE_CHALLAN":
        return history.push("/digit-ui/employee/mcollect/modify-challan/" + challanno);

      case "BUTTON_PAY":
        return history.push("/digit-ui/employee/payment/collect/" + (challanDetails === null || challanDetails === void 0 ? void 0 : challanDetails.businessService) + "/" + challanno + "/tenantId=" + tenantId + "?workflow=mcollect");

      default:
        console.log("default case");
        break;
    }
  }, [selectedAction]);

  function onActionSelect(action) {
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  var closeModal = function closeModal() {
    setSelectedAction(null);
    setShowModal(false);
  };

  var submitAction = function submitAction(data) {
    Digit.MCollectService.update({
      Challan: data === null || data === void 0 ? void 0 : data.Challan
    }, tenantId).then(function (result) {
      if (result.challans && result.challans.length > 0) {
        var challan = result.challans[0];
        var LastModifiedTime = Digit.SessionStorage.set("isMcollectAppChanged", challan.challanNo);
        history.push("/digit-ui/employee/mcollect/acknowledgement?purpose=challan&status=success&tenantId=" + (challan === null || challan === void 0 ? void 0 : challan.tenantId) + "&serviceCategory=" + challan.businessService + "&challanNumber=" + challan.challanNo + "&applicationStatus=" + challan.applicationStatus, {
          from: url
        });
      }
    }).catch(function (e) {
      var _e$response, _e$response$data;

      return setShowToast({
        key: true,
        label: e === null || e === void 0 ? void 0 : (_e$response = e.response) === null || _e$response === void 0 ? void 0 : (_e$response$data = _e$response.data) === null || _e$response$data === void 0 ? void 0 : _e$response$data.Errors[0].message
      });
    });
    closeModal();
  };

  var isMcollectAppChanged = Digit.SessionStorage.get("isMcollectAppChanged");

  var _Digit$Hooks$mcollect = Digit.Hooks.mcollect.useMCollectSearch({
    tenantId: tenantId,
    filters: {
      challanNo: challanno
    },
    isMcollectAppChanged: isMcollectAppChanged
  }),
      data = _Digit$Hooks$mcollect.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$mcollect, ["isLoading", "isError", "error", "data"]);

  var challanDetails = data === null || data === void 0 ? void 0 : (_data$challans = data.challans) === null || _data$challans === void 0 ? void 0 : _data$challans.filter(function (item) {
    return item.challanNo === challanno;
  })[0];
  var billDetails = [];
  useEffect(function () {
    var _data$challans2;

    var fetchMyAPI = function fetchMyAPI() {
      try {
        var _data$challans$, _data$challans$2;

        billDetails = [];
        return Promise.resolve(Digit.PaymentService.searchBill(tenantId, {
          consumerCode: data === null || data === void 0 ? void 0 : (_data$challans$ = data.challans[0]) === null || _data$challans$ === void 0 ? void 0 : _data$challans$.challanNo,
          service: data === null || data === void 0 ? void 0 : (_data$challans$2 = data.challans[0]) === null || _data$challans$2 === void 0 ? void 0 : _data$challans$2.businessService
        })).then(function (res) {
          var _res$Bill$, _res$Bill$$billDetail, _res$Bill$$billDetail2, _res$Bill$2;

          res === null || res === void 0 ? void 0 : (_res$Bill$ = res.Bill[0]) === null || _res$Bill$ === void 0 ? void 0 : (_res$Bill$$billDetail = _res$Bill$.billDetails[0]) === null || _res$Bill$$billDetail === void 0 ? void 0 : (_res$Bill$$billDetail2 = _res$Bill$$billDetail.billAccountDetails) === null || _res$Bill$$billDetail2 === void 0 ? void 0 : _res$Bill$$billDetail2.map(function (bill) {
            billDetails.push(bill);
          });
          setTotalDueAmount(res === null || res === void 0 ? void 0 : (_res$Bill$2 = res.Bill[0]) === null || _res$Bill$2 === void 0 ? void 0 : _res$Bill$2.totalAmount);
          billDetails && billDetails.map(function (ob) {
            if (ob.taxHeadCode.includes("CGST")) ob.order = 3;else if (ob.taxHeadCode.includes("SGST")) ob.order = 4;
          });
          billDetails.sort(function (a, b) {
            return a.order - b.order;
          });
          setChallanBillDetails(billDetails);
        });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    if (data !== null && data !== void 0 && data.challans && (data === null || data === void 0 ? void 0 : (_data$challans2 = data.challans) === null || _data$challans2 === void 0 ? void 0 : _data$challans2.length) > 0) {
      fetchMyAPI();
    }
  }, [data]);
  var workflowActions = ["CANCEL_CHALLAN", "UPDATE_CHALLAN", "BUTTON_PAY"];

  function onDownloadActionSelect(action) {
    action == "CHALLAN" ? downloadAndPrintChallan(challanno) : downloadAndPrintReciept(challanDetails === null || challanDetails === void 0 ? void 0 : challanDetails.businessService, challanno);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      fontFamily: "calibri",
      color: "#FF0000",
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(Header, null, "" + t("CHALLAN_DETAILS"), " "), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("TL_DOWNLOAD"),
    onSubmit: function onSubmit() {
      return setIsDisplayDownloadMenu(!isDisplayDownloadMenu);
    }
  }), isDisplayDownloadMenu ? /*#__PURE__*/React.createElement("div", {
    style: {
      boxShadow: "0 8px 10px 1px rgb(0 0 0 / 14%), 0 3px 14px 2px rgb(0 0 0 / 12%), 0 5px 5px -3px rgb(0 0 0 / 20%)",
      height: "auto",
      backgroundColor: "#fff",
      textAlign: "left",
      marginBottom: "4px",
      width: "240px",
      padding: "0px 10px",
      lineHeight: "30px",
      cursor: "pointer",
      position: "absolute",
      color: "black",
      fontSize: "18px"
    }
  }, /*#__PURE__*/React.createElement(Menu, {
    localeKeyPrefix: "UC",
    options: (challanDetails === null || challanDetails === void 0 ? void 0 : challanDetails.applicationStatus) === "PAID" ? ["CHALLAN", "RECEIPT"] : ["CHALLAN"],
    t: t,
    onSelect: onDownloadActionSelect
  })) : null)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(StatusTable, {
    style: {
      padding: "10px 0px"
    }
  }, /*#__PURE__*/React.createElement(Row, {
    label: t("UC_CHALLAN_NO") + ":",
    text: challanno
  }), /*#__PURE__*/React.createElement("hr", {
    style: {
      width: "35%",
      border: "1px solid #D6D5D4",
      marginTop: "1rem",
      marginBottom: "1rem"
    }
  }), challanBillDetails === null || challanBillDetails === void 0 ? void 0 : challanBillDetails.map(function (data) {
    return /*#__PURE__*/React.createElement(Row, {
      label: t(stringReplaceAll(data === null || data === void 0 ? void 0 : data.taxHeadCode, ".", "_")),
      text: "\u20B9" + (data === null || data === void 0 ? void 0 : data.amount) || 0,
      textStyle: {
        whiteSpace: "pre"
      }
    });
  }), /*#__PURE__*/React.createElement("hr", {
    style: {
      width: "35%",
      border: "1px solid #D6D5D4",
      marginTop: "1rem",
      marginBottom: "1rem"
    }
  }), /*#__PURE__*/React.createElement(Row, {
    label: /*#__PURE__*/React.createElement("b", {
      style: {
        padding: "10px 0px"
      }
    }, t("UC_TOTAL_DUE_AMOUT_LABEL")),
    text: "\u20B9" + totalDueAmount,
    textStyle: {
      fontSize: "24px",
      padding: "10px 0px",
      fontWeight: "700"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "24px",
      padding: "10px 0px",
      fontWeight: "700"
    }
  }, t("UC_SERVICE_DETAILS_LABEL")), /*#__PURE__*/React.createElement(StatusTable, null, /*#__PURE__*/React.createElement(Row, {
    label: t("UC_SERVICE_CATEGORY_LABEL") + ":",
    text: "" + t("BILLINGSERVICE_BUSINESSSERVICE_" + stringReplaceAll(challanDetails === null || challanDetails === void 0 ? void 0 : (_challanDetails$busin = challanDetails.businessService) === null || _challanDetails$busin === void 0 ? void 0 : _challanDetails$busin.toUpperCase(), ".", "_") || t("CS_NA")),
    textStyle: {
      whiteSpace: "pre"
    }
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("UC_FROM_DATE_LABEL") + ":",
    text: convertEpochToDate(challanDetails === null || challanDetails === void 0 ? void 0 : challanDetails.taxPeriodFrom) || t("CS_NA")
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("UC_TO_DATE_LABEL") + ":",
    text: convertEpochToDate(challanDetails === null || challanDetails === void 0 ? void 0 : challanDetails.taxPeriodTo) || t("CS_NA")
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("UC_COMMENT_LABEL") + ":",
    text: "" + ((challanDetails === null || challanDetails === void 0 ? void 0 : challanDetails.description) || t("CS_NA"))
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CS_INBOX_STATUS_FILTER") + ":",
    text: t("UC_" + ((challanDetails === null || challanDetails === void 0 ? void 0 : challanDetails.applicationStatus) || t("CS_NA")))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "24px",
      padding: "10px 0px",
      fontWeight: "700"
    }
  }, t("UC_CONSUMER_DETAILS_LABEL")), /*#__PURE__*/React.createElement(StatusTable, null, /*#__PURE__*/React.createElement(Row, {
    label: t("UC_CONS_NAME_LABEL") + ":",
    text: (challanDetails === null || challanDetails === void 0 ? void 0 : challanDetails.citizen.name) || t("CS_NA")
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("UC_MOBILE_NUMBER") + ":",
    text: (challanDetails === null || challanDetails === void 0 ? void 0 : challanDetails.citizen.mobileNumber) || t("CS_NA")
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("UC_DOOR_NO_LABEL") + ":",
    text: (challanDetails === null || challanDetails === void 0 ? void 0 : challanDetails.address.doorNo) || t("CS_NA")
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("UC_BUILDING_NAME_LABEL") + ":",
    text: (challanDetails === null || challanDetails === void 0 ? void 0 : challanDetails.address.buildingName) || t("CS_NA")
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("UC_STREET_NAME_LABEL") + ":",
    text: (challanDetails === null || challanDetails === void 0 ? void 0 : challanDetails.address.street) || t("CS_NA")
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("UC_MOHALLA_LABEL") + ":",
    text: "" + t(stringReplaceAll(challanDetails === null || challanDetails === void 0 ? void 0 : (_challanDetails$addre = challanDetails.address) === null || _challanDetails$addre === void 0 ? void 0 : (_challanDetails$addre2 = _challanDetails$addre.tenantId) === null || _challanDetails$addre2 === void 0 ? void 0 : _challanDetails$addre2.toUpperCase(), ".", "_") + "_REVENUE_" + (challanDetails === null || challanDetails === void 0 ? void 0 : (_challanDetails$addre3 = challanDetails.address) === null || _challanDetails$addre3 === void 0 ? void 0 : (_challanDetails$addre4 = _challanDetails$addre3.locality) === null || _challanDetails$addre4 === void 0 ? void 0 : _challanDetails$addre4.code) || t("CS_NA"))
  })))), showModal ? /*#__PURE__*/React.createElement(ActionModal$1, {
    t: t,
    action: selectedAction,
    applicationData: challanDetails,
    billData: challanBillDetails,
    closeModal: closeModal,
    submitAction: submitAction
  }) : null, showToast && /*#__PURE__*/React.createElement(Toast, {
    error: showToast.key,
    label: t(showToast.label),
    onClose: function onClose() {
      return setShowToast(null);
    }
  }), (challanDetails === null || challanDetails === void 0 ? void 0 : challanDetails.applicationStatus) == "ACTIVE" && /*#__PURE__*/React.createElement(ActionBar, null, displayMenu && workflowActions ? /*#__PURE__*/React.createElement(Menu, {
    localeKeyPrefix: "UC",
    options: workflowActions,
    t: t,
    onSelect: onActionSelect
  }) : null, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("ES_COMMON_TAKE_ACTION"),
    onSubmit: function onSubmit() {
      return setDisplayMenu(!displayMenu);
    }
  })));
};

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

var Map = _getNative(_root, 'Map');
var _Map = Map;

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

var setServiceCategory = function setServiceCategory(businessServiceData, dispatch, state, setCategory) {

  String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
  };

  var nestedServiceData = {};
  businessServiceData.forEach(function (item) {
    if (item.code.includes("BILLINGSERVICE_BUSINESSSERVICE_")) {
      var str = item.code.replace("BILLINGSERVICE_BUSINESSSERVICE_", "");
      var frags = str.split("_");

      for (var i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].toLowerCase().slice(1);
      }

      frags[0] = frags[0].toUpperCase();
      item.code = frags.join("_");
      item.code = item.code.replaceAt(item.code.indexOf("_"), ".");
    }

    if (item.code && item.code.indexOf(".") > 0) {
      if (nestedServiceData[item.code.split(".")[0]]) {
        var child = get_1(nestedServiceData, item.code.split(".")[0] + ".child", []);
        child.push(item);
        set_1(nestedServiceData, item.code.split(".")[0] + ".child", child);
      } else {
        set_1(nestedServiceData, item.code.split(".")[0] + ".code", item.code.split(".")[0]);
        set_1(nestedServiceData, item.code.split(".")[0] + ".child[0]", item);
      }
    } else {
      set_1(nestedServiceData, "" + item.code, item);
    }
  });
  var serviceCategories = Object.values(nestedServiceData).filter(function (item) {
    return item.code;
  });
  return serviceCategories;
};

var forwardRef = React.forwardRef;
var FormComposer = forwardRef(function (props, ref) {
  var setFormData = props.setFormData;

  var _useForm = useForm(),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      errors = _useForm.errors,
      setValue = _useForm.setValue;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  function onSubmit(data) {
    props.onSubmit(data);
  }

  useEffect(function () {
    if (setFormData) {
      var entries = Object.keys(setFormData);
      setFormData && entries.map(function (entry) {
        return setValue("" + entry, "" + (setFormData["" + entry] == null ? "" : setFormData["" + entry]));
      });
    }
  }, [setFormData]);

  if (setFormData) {
    setValue("name", "" + setFormData["name"]);
    setValue("mobileNumber", "" + setFormData["mobileNumber"]);
    setValue("doorNo", "" + setFormData["doorNo"]);
    setValue("buildingName", "" + setFormData["buildingName"]);
    setValue("street", "" + setFormData["street"]);
    setValue("pincode", "" + (setFormData["pincode"] === null ? "" : setFormData["pincode"]));
    setValue("comments", "" + setFormData["comments"]);
  }

  var fieldSelector = function fieldSelector(type, populators) {
    switch (type) {
      case "text":
        return /*#__PURE__*/React.createElement("div", {
          className: "field-container"
        }, populators.componentInFront ? populators.componentInFront : null, /*#__PURE__*/React.createElement(TextInput, _extends({
          className: "field desktop-w-full"
        }, populators, {
          inputRef: register(populators.validation)
        })));

      case "textarea":
        return /*#__PURE__*/React.createElement(TextArea, _extends({
          className: "field desktop-w-full",
          name: populators.name || ""
        }, populators, {
          inputRef: register(populators.validation)
        }));

      case "custom":
        return /*#__PURE__*/React.createElement(TaxForm, _extends({
          register: register
        }, populators, {
          errors: errors
        }));

      default:
        return populators.dependency !== false ? populators : null;
    }
  };

  var formFields = useMemo(function () {
    var _props$config;

    return (_props$config = props.config) === null || _props$config === void 0 ? void 0 : _props$config.map(function (section, index, array) {
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: index
      }, /*#__PURE__*/React.createElement(CardSectionHeader, null, section.head), section.body.map(function (field, index) {
        var _field$populators;

        return /*#__PURE__*/React.createElement(React.Fragment, {
          key: index
        }, errors[field.populators.name] && ((_field$populators = field.populators) !== null && _field$populators !== void 0 && _field$populators.validate ? errors[field.populators.validate] : true) && /*#__PURE__*/React.createElement(CardLabelError, null, field.populators.error), field.label ? /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, null, field.label, field.isMandatory ? " * " : null), /*#__PURE__*/React.createElement("div", {
          className: "field"
        }, fieldSelector(field.type, field.populators))) : /*#__PURE__*/React.createElement("div", {
          className: "field"
        }, fieldSelector(field.type, field.populators)));
      }), array.length - 1 === index ? null : /*#__PURE__*/React.createElement(BreakLine, null));
    });
  }, [props.config, errors]);
  var isDisabled = props.isDisabled || false;
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardSubHeader, null, props.heading), formFields, props.children, /*#__PURE__*/React.createElement(ActionBar, null, /*#__PURE__*/React.createElement(SubmitBar, {
    disabled: isDisabled,
    label: t(props.label),
    submit: "submit"
  }))));
});

var sortDropdownNames = function sortDropdownNames(options, optionkey, locilizationkey) {
  return options.sort(function (a, b) {
    return locilizationkey(a[optionkey]).localeCompare(locilizationkey(b[optionkey]));
  });
};

var CreateChallen = function CreateChallen(_ref) {
  var _getCities$;

  var ChallanData = _ref.ChallanData;
  var childRef = useRef();
  var history = useHistory();

  var _useRouteMatch = useRouteMatch(),
      url = _useRouteMatch.url;

  var defaultval;
  var isEdit = false;

  if (url.includes("modify-challan")) {
    isEdit = true;
  }

  var lastModTime = ChallanData ? ChallanData[0].auditDetails.lastModifiedTime : null;

  var _ref2 = ChallanData ? Digit.Hooks.useFetchBillsForBuissnessService({
    businessService: ChallanData[0].businessService,
    consumerCode: ChallanData[0].challanNo
  }, {
    lastModTime: lastModTime
  }) : {},
      fetchBillData = _ref2.data;

  var cities = Digit.Hooks.mcollect.usemcollectTenants();

  var getCities = function getCities() {
    return (cities === null || cities === void 0 ? void 0 : cities.filter(function (e) {
      return e.code === Digit.ULBService.getCurrentTenantId();
    })) || [];
  };

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _Digit$Hooks$useBound = Digit.Hooks.useBoundaryLocalities((_getCities$ = getCities()[0]) === null || _getCities$ === void 0 ? void 0 : _getCities$.code, "admin", {
    enabled: !!getCities()[0]
  }, t),
      fetchedLocalities = _Digit$Hooks$useBound.data;

  var handlePincode = function handlePincode(event) {
    var value = event.target.value;
    setPincode(value);

    if (!value) {
      setPincodeNotValid(false);
    }
  };

  var isPincodeValid = function isPincodeValid() {
    return !pincodeNotValid;
  };

  function selectLocality(locality) {
    setSelectedLocality(locality);
  }

  function setcategories(category) {
    setcategoriesType(null);
    setSelectedcategories(category);
  }

  function ChangesetToDate(value) {
    if (new Date(fromDate) < new Date(value)) {
      setToDate(value);
    }
  }

  function setcategoriesType(categoryType) {
    setselectedCategoryType(categoryType);
  }

  function humanize(str) {
    var frags = str.split("_");

    for (var i = 0; i < frags.length; i++) {
      frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
    }

    return frags.join("_");
  }

  var _useState = useState(null),
      showToast = _useState[0],
      setShowToast = _useState[1];

  var _useState2 = useState(true),
      canSubmit = _useState2[0],
      setSubmitValve = _useState2[1];

  var _useState3 = useState(fetchedLocalities),
      localities = _useState3[0],
      setLocalities = _useState3[1];

  var _useState4 = useState([]),
      categoires = _useState4[0],
      setAPIcategories = _useState4[1];

  var _useState5 = useState([]),
      categoiresType = _useState5[0],
      setAPIcategoriesType = _useState5[1];

  var _useState6 = useState(null),
      selectedCategory = _useState6[0],
      setSelectedcategories = _useState6[1];

  var _useState7 = useState(null),
      selectedCategoryType = _useState7[0],
      setselectedCategoryType = _useState7[1];

  var _useState8 = useState([]),
      TaxHeadMaster = _useState8[0],
      setAPITaxHeadMaster = _useState8[1];

  var _useState9 = useState([]),
      TaxHeadMasterFields = _useState9[0],
      setTaxHeadMasterFields = _useState9[1];

  var _useState10 = useState(null),
      selectedLocality = _useState10[0],
      setSelectedLocality = _useState10[1];

  var _useState11 = useState(false),
      pincodeNotValid = _useState11[0],
      setPincodeNotValid = _useState11[1];

  var _useState12 = useState(""),
      fromDate = _useState12[0],
      setFromDate = _useState12[1];

  var _useState13 = useState(""),
      toDate = _useState13[0],
      setToDate = _useState13[1];

  var tenantId = window.Digit.SessionStorage.get("Employee.tenantId");

  var _useState14 = useState(""),
      pincode = _useState14[0],
      setPincode = _useState14[1];

  var _useState15 = useState(getCities()[0] ? getCities()[0] : null),
      selectedCity = _useState15[0],
      setSelectedCity = _useState15[1];

  var selectCity = function selectCity(city) {
    return Promise.resolve();
  };

  if (isEdit == true && fetchBillData && ChallanData[0]) {
    defaultval = {
      name: ChallanData[0].citizen.name,
      mobileNumber: ChallanData[0].citizen.mobileNumber,
      doorNo: ChallanData[0].address.doorNo,
      buildingName: ChallanData[0].address.buildingName,
      street: ChallanData[0].address.street,
      pincode: ChallanData[0].address.pincode,
      ADVT_HOARDINGS_CGST: "10",
      comments: ChallanData[0].description
    };

    if (fetchBillData.Bill[0].billDetails[0].billAccountDetails.length > 0) {
      fetchBillData.Bill[0].billDetails[0].billAccountDetails.map(function (ele) {
        return defaultval["" + ele.taxHeadCode.replaceAll(".", "_")] = "" + ele.amount;
      });
    }
  }

  useEffect(function () {
    if (isEdit && ChallanData[0] && fetchBillData) {
      var setlocalit = localities && localities.filter(function (el) {
        return el["code"] == ChallanData[0].address.locality.code;
      });
      localities && setSelectedLocality(setlocalit[0]);
      var setcategory = categoires.filter(function (el) {
        return el["code"] == "BILLINGSERVICE_BUSINESSSERVICE_" + ChallanData[0].businessService.split(".")[0];
      });
      setSelectedcategories(setcategory[0]);
      var setcategorytype = categoiresType.filter(function (el) {
        return el["code"] == "BILLINGSERVICE_BUSINESSSERVICE_" + ChallanData[0].businessService.replaceAll(".", "_").toUpperCase();
      });
      setselectedCategoryType(setcategorytype[0]);
    }
  }, [fetchBillData, ChallanData, categoires]);
  useEffect(function () {
    if (isEdit && ChallanData[0] && fetchBillData) {
      var setcategorytype = categoiresType.filter(function (el) {
        return el["code"] == "BILLINGSERVICE_BUSINESSSERVICE_" + ChallanData[0].businessService.replaceAll(".", "_").toUpperCase();
      });
      setselectedCategoryType(setcategorytype[0]);
    }
  }, [categoiresType]);
  useEffect(function () {
    if (isEdit && ChallanData[0] && fetchBillData && !fromDate && !toDate) {
      var fromdate = ChallanData[0] ? new Date(ChallanData[0].taxPeriodFrom).getFullYear().toString() + "-" + (new Date(ChallanData[0].taxPeriodFrom).getMonth() + 1) + "-" + new Date(ChallanData[0].taxPeriodFrom).getDate() : null;
      ChallanData[0] && setFromDate(fromdate);
      var todate = ChallanData[0] ? new Date(ChallanData[0].taxPeriodTo).getFullYear().toString() + "-" + (new Date(ChallanData[0].taxPeriodTo).getMonth() + 1) + "-" + new Date(ChallanData[0].taxPeriodTo).getDate() : null;
      ChallanData[0] && setToDate(todate);
    }
  });
  useEffect(function () {
    setAPIcategoriesType(selectedCategory !== null && selectedCategory !== void 0 && selectedCategory.child ? selectedCategory.child.map(function (ele) {
      if (!ele.code.includes("BILLINGSERVICE_BUSINESSSERVICE_")) {
        ele.code = "BILLINGSERVICE_BUSINESSSERVICE_" + ele.code.split(".").join("_").toUpperCase();
      }

      return ele;
    }) : []);
  }, [selectedCategory]);
  useEffect(function () {
    var selectedCatBusinesService = selectedCategoryType ? stringReplaceAll(selectedCategoryType === null || selectedCategoryType === void 0 ? void 0 : selectedCategoryType.businessService.split(".")[1], " ", "_") : "";
    setTaxHeadMasterFields(TaxHeadMaster.filter(function (ele) {
      var temp = selectedCategory.code.replace("BILLINGSERVICE_BUSINESSSERVICE_", "");
      return selectedCategoryType && selectedCategoryType.code.split(temp + "_")[1] && (ele.service == temp + "." + humanize(selectedCategoryType.code.split(temp + "_")[1].toLowerCase()) || ele.service == temp + "." + selectedCatBusinesService);
    }));
  }, [selectedCategoryType]);
  useEffect(function () {
    setLocalities(fetchedLocalities);
  }, [fetchedLocalities]);
  useEffect(function () {
    Digit.MDMSService.getPaymentRules(tenantId, "[?(@.type=='Adhoc')]").then(function (value) {
      setAPIcategories(setServiceCategory(value.MdmsRes.BillingService.BusinessService).map(function (ele) {
        ele.code = "BILLINGSERVICE_BUSINESSSERVICE_" + stringReplaceAll(ele.code.toUpperCase(), " ", "_");
        return ele;
      }));
      setAPITaxHeadMaster(value.MdmsRes.BillingService.TaxHeadMaster);
    });
  }, [tenantId]);
  useEffect(function () {
    if (selectedCategory && selectedCategoryType && fromDate != "" && toDate != "" && selectedLocality != null) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  }, [selectedCategory, selectedCategoryType, selectedLocality, fromDate, toDate]);
  useEffect(function () {
    var city = cities ? cities.find(function (obj) {
      var _obj$pincode;

      return (_obj$pincode = obj.pincode) === null || _obj$pincode === void 0 ? void 0 : _obj$pincode.find(function (item) {
        return item == pincode;
      });
    }) : [];

    if (city !== null && city !== void 0 && city.code) {
      setPincodeNotValid(false);
      setSelectedCity(city);
      setSelectedLocality(null);
      var __localityList = fetchedLocalities;

      var __filteredLocalities = __localityList.filter(function (city) {
        return city["pincode"] == pincode;
      });

      setLocalities(__filteredLocalities);
    } else if (pincode === "" || pincode === null) {
      setPincodeNotValid(false);
      setLocalities(fetchedLocalities);
    } else {
      setPincodeNotValid(true);
    }
  }, [pincode]);

  var onSubmit = function onSubmit(data) {
    TaxHeadMasterFields.map(function (ele) {
      return {
        taxHeadCode: ele.code,
        amount: data[ele.code.split(".").join("_")]
      };
    });
    var Challan = {};

    if (!isEdit) {
      var temp = selectedCategory.code.replace("BILLINGSERVICE_BUSINESSSERVICE_", "");
      Challan = {
        citizen: {
          name: data.name,
          mobileNumber: data.mobileNumber
        },
        businessService: selectedCategoryType ? temp + "." + stringReplaceAll(selectedCategoryType === null || selectedCategoryType === void 0 ? void 0 : selectedCategoryType.businessService.split(".")[1], " ", "_") : "",
        consumerType: temp,
        description: data.comments,
        taxPeriodFrom: Date.parse(fromDate),
        taxPeriodTo: Date.parse(toDate),
        tenantId: tenantId,
        address: {
          buildingName: data.buildingName,
          doorNo: data.doorNo,
          street: data.street,
          locality: {
            code: selectedLocality.code
          }
        },
        amount: TaxHeadMasterFields.map(function (ele) {
          return {
            taxHeadCode: ele.code,
            amount: data[ele.code.split(".").join("_")] ? data[ele.code.split(".").join("_")] : 0
          };
        })
      };
    } else {
      Challan = {
        accountId: ChallanData[0].accountId,
        citizen: ChallanData[0].citizen,
        applicationStatus: ChallanData[0].applicationStatus,
        auditDetails: ChallanData[0].auditDetails,
        id: ChallanData[0].id,
        businessService: ChallanData[0].businessService,
        challanNo: ChallanData[0].challanNo,
        consumerType: selectedCategory === null || selectedCategory === void 0 ? void 0 : selectedCategory.code,
        description: data.comments,
        taxPeriodFrom: Date.parse(fromDate),
        taxPeriodTo: Date.parse(toDate),
        tenantId: tenantId,
        address: ChallanData[0].address,
        amount: TaxHeadMasterFields.map(function (ele) {
          return {
            taxHeadCode: ele.code,
            amount: data[ele.code.split(".").join("_")] ? data[ele.code.split(".").join("_")] : 0
          };
        })
      };
    }

    if (isEdit) {
      Digit.MCollectService.update({
        Challan: Challan
      }, tenantId).then(function (result, err) {
        if (result.challans && result.challans.length > 0) {
          var challan = result.challans[0];
          var LastModifiedTime = Digit.SessionStorage.set("isMcollectAppChanged", challan.auditDetails.lastModifiedTime);
          Digit.MCollectService.generateBill(challan.challanNo, tenantId, challan.businessService, "challan").then(function (response) {
            if (response.Bill && response.Bill.length > 0) {
              history.push("/digit-ui/employee/mcollect/acknowledgement?purpose=challan&status=success&tenantId=" + tenantId + "&billNumber=" + response.Bill[0].billNumber + "&serviceCategory=" + response.Bill[0].businessService + "&challanNumber=" + response.Bill[0].consumerCode + "&isEdit=" + true, {
                from: url
              });
            }
          });
        }
      }).catch(function (e) {
        var _e$response, _e$response$data;

        return setShowToast({
          key: true,
          label: e === null || e === void 0 ? void 0 : (_e$response = e.response) === null || _e$response === void 0 ? void 0 : (_e$response$data = _e$response.data) === null || _e$response$data === void 0 ? void 0 : _e$response$data.Errors[0].message
        });
      });
    } else {
      Digit.MCollectService.create({
        Challan: Challan
      }, tenantId).then(function (result, err) {
        if (result.challans && result.challans.length > 0) {
          var challan = result.challans[0];
          Digit.MCollectService.generateBill(challan.challanNo, tenantId, challan.businessService, "challan").then(function (response) {
            if (response.Bill && response.Bill.length > 0) {
              history.push("/digit-ui/employee/mcollect/acknowledgement?purpose=challan&status=success&tenantId=" + tenantId + "&billNumber=" + response.Bill[0].billNumber + "&serviceCategory=" + response.Bill[0].businessService + "&challanNumber=" + response.Bill[0].consumerCode, {
                from: url
              });
            }
          });
        }
      }).catch(function (e) {
        var _e$response2, _e$response2$data;

        return setShowToast({
          key: true,
          label: e === null || e === void 0 ? void 0 : (_e$response2 = e.response) === null || _e$response2 === void 0 ? void 0 : (_e$response2$data = _e$response2.data) === null || _e$response2$data === void 0 ? void 0 : _e$response2$data.Errors[0].message
        });
      });
    }
  };

  function setconfig() {
    var config = [{
      head: t("CONSUMERDETAILS"),
      body: [{
        label: t("UC_CONS_NAME_LABEL"),
        isMandatory: true,
        type: "text",
        populators: {
          name: "name",
          disable: isEdit,
          validation: {
            required: true,
            pattern: /^[A-Za-z]/
          },
          error: t("CS_ADDCOMPLAINT_NAME_ERROR")
        }
      }, {
        label: t("UC_MOBILE_NUMBER"),
        isMandatory: true,
        type: "text",
        populators: {
          name: "mobileNumber",
          disable: isEdit,
          validation: {
            required: true,
            pattern: /^[6-9]\d{9}$/
          },
          componentInFront: /*#__PURE__*/React.createElement("div", {
            className: "employee-card-input employee-card-input--front"
          }, "+91"),
          error: t("CORE_COMMON_MOBILE_ERROR")
        }
      }, {
        label: t("UC_DOOR_NO_LABEL"),
        type: "text",
        populators: {
          name: "doorNo",
          disable: isEdit
        }
      }, {
        label: t("UC_BLDG_NAME_LABEL"),
        type: "text",
        populators: {
          name: "buildingName",
          disable: isEdit
        }
      }, {
        label: t("UC_SRT_NAME_LABEL"),
        type: "text",
        populators: {
          name: "street",
          disable: isEdit
        }
      }, {
        label: t("UC_PINCODE_LABEL"),
        type: "text",
        populators: {
          name: "pincode",
          disable: isEdit,
          validation: {
            pattern: /^[1-9][0-9]{5}$/,
            validate: isPincodeValid
          },
          error: t("UC_PINCODE_INVALID"),
          onChange: handlePincode
        }
      }, {
        label: t("UC_MOHALLA_LABEL"),
        type: "dropdown",
        isMandatory: true,
        name: "Mohalla",
        dependency: localities ? true : false,
        populators: /*#__PURE__*/React.createElement(Dropdown, {
          isMandatory: true,
          selected: selectedLocality,
          disable: isEdit,
          optionKey: "i18nkey",
          id: "locality",
          option: localities,
          select: selectLocality,
          t: t
        })
      }]
    }, {
      head: t("SERVICEDETAILS"),
      body: [{
        label: t("UC_CITY_LABEL"),
        isMandatory: true,
        type: "dropdown",
        name: "city",
        populators: /*#__PURE__*/React.createElement(Dropdown, {
          isMandatory: true,
          selected: selectedCity,
          freeze: true,
          disable: true,
          option: getCities(),
          id: "city",
          select: selectCity,
          optionKey: "i18nKey",
          t: t
        })
      }, {
        label: t("UC_SERVICE_CATEGORY_LABEL"),
        type: "dropdown",
        isMandatory: true,
        name: "category",
        populators: /*#__PURE__*/React.createElement(Dropdown, {
          isMandatory: true,
          selected: selectedCategory,
          optionKey: "code",
          disable: isEdit,
          id: "businessService",
          option: sortDropdownNames(categoires, "code", t),
          select: setcategories,
          t: t
        })
      }, {
        label: t("UC_SERVICE_TYPE_LABEL"),
        type: "dropdown",
        isMandatory: true,
        name: "categoryType",
        dependency: selectedCategory ? true : false,
        populators: /*#__PURE__*/React.createElement(Dropdown, {
          isMandatory: true,
          selected: selectedCategoryType,
          disable: isEdit,
          optionKey: "code",
          id: "businessService",
          option: sortDropdownNames(categoiresType, "code", t),
          select: setcategoriesType,
          t: t
        })
      }, {
        label: t("UC_FROM_DATE_LABEL"),
        type: "date",
        name: "fromDate",
        isMandatory: true,
        populators: /*#__PURE__*/React.createElement(DatePicker, {
          date: fromDate ? fromDate : "",
          onChange: setFromDate
        })
      }, {
        label: t("UC_TO_DATE_LABEL"),
        type: "date",
        name: "toDate",
        disable: fromDate == "" ? true : false,
        isMandatory: true,
        dependency: fromDate ? true : false,
        populators: /*#__PURE__*/React.createElement(DatePicker, {
          date: toDate ? toDate : "",
          min: fromDate,
          onChange: ChangesetToDate
        })
      }]
    }];

    if (TaxHeadMasterFields.length > 0 && config.length > 0) {
      var tempConfig = config;

      if (config[1].head == "Service Details" | config[1].head == t("SERVICEDETAILS")) {
        var temp = TaxHeadMasterFields.map(function (ele) {
          return {
            label: t(ele.name.split(".").join("_")),
            isMandatory: ele.isRequired,
            type: "text",
            populators: {
              name: ele.code.split(".").join("_"),
              validation: {
                required: ele.isRequired,
                pattern: /^(0|[1-9][0-9]*)$/
              },
              error: t("UC_COMMON_FIELD_ERROR"),
              componentInFront: /*#__PURE__*/React.createElement("div", {
                className: "employee-card-input employee-card-input--front"
              }, "\u20B9")
            }
          };
        });

        if (temp.length > 0) {
          tempConfig[1].body = [].concat(tempConfig[1].body, temp);
        }
      }

      return tempConfig;
    } else {
      return config;
    }
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FormComposer, {
    ref: childRef,
    heading: isEdit ? t("UC_UPDATE_CHALLAN") : t("UC_COMMON_HEADER"),
    config: setconfig(),
    onSubmit: onSubmit,
    setFormData: defaultval,
    isDisabled: !canSubmit,
    label: isEdit ? t("UC_UPDATE_CHALLAN") : t("UC_ECHALLAN")
  }), showToast && /*#__PURE__*/React.createElement(Toast, {
    error: showToast.key,
    label: t(showToast.label),
    onClose: function onClose() {
      return setShowToast(null);
    }
  }));
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

var MCollectAcknowledgement = function MCollectAcknowledgement() {
  var location = useLocation();

  var _useState = useState({}),
      params = _useState[0],
      setParams = _useState[1];

  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
      isEdit = _Digit$Hooks$useQuery.isEdit;

  useEffect(function () {
    setParams(getQueryStringParams(location.search));
  }, [location]);

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var printReciept = function printReciept() {
    try {
      var challanNo = params === null || params === void 0 ? void 0 : params.challanNumber;
      downloadAndPrintChallan(challanNo, "print");
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return /*#__PURE__*/React.createElement("div", null, (params === null || params === void 0 ? void 0 : params.applicationStatus) === "CANCELLED" ? /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Banner, {
    message: t("UC_BILL_CANCELLED_SUCCESS_MESSAGE"),
    applicationNumber: params === null || params === void 0 ? void 0 : params.challanNumber,
    info: t("UC_CHALLAN_NO"),
    successful: true
  }), /*#__PURE__*/React.createElement(CardText, null, t("UC_BILL_CANCELLED_SUCCESS_SUB_MESSAGE")),  /*#__PURE__*/React.createElement("div", {
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
  })), t("UC_PRINT_CHALLAN_LABEL")) , /*#__PURE__*/React.createElement(ActionBar, {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/employee",
    style: {
      marginRight: "1rem"
    }
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CORE_COMMON_GO_TO_HOME")
  })))) : /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Banner, {
    message: !isEdit ? t("UC_BILL_GENERATED_SUCCESS_MESSAGE") : t("UC_BILL_UPDATED_SUCCESS_MESSAGE"),
    applicationNumber: params === null || params === void 0 ? void 0 : params.challanNumber,
    info: t("UC_CHALLAN_NO"),
    successful: true
  }), /*#__PURE__*/React.createElement(CardText, null, t("UC_BILL_GENERATION_MESSAGE_SUB")),  /*#__PURE__*/React.createElement("div", {
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
  })), t("UC_PRINT_CHALLAN_LABEL")) , /*#__PURE__*/React.createElement(ActionBar, {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "baseline"
    }
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/employee",
    style: {
      marginRight: "1rem"
    }
  }, /*#__PURE__*/React.createElement(LinkButton, {
    style: {
      color: "#FF8C00"
    },
    label: t("CORE_COMMON_GO_TO_HOME")
  })), /*#__PURE__*/React.createElement(Link, {
    to: {
      pathname: "/digit-ui/employee/payment/collect/" + (params === null || params === void 0 ? void 0 : params.serviceCategory) + "/" + (params === null || params === void 0 ? void 0 : params.challanNumber) + "/tenantId=" + (params === null || params === void 0 ? void 0 : params.tenantId) + "?workflow=mcollect"
    }
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("UC_BUTTON_PAY")
  })))));
};

var EditChallan = function EditChallan() {
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useTranslation = useTranslation();

  var _useParams = useParams(),
      challanNo = _useParams.challanNo;

  var isMcollectAppChanged = Digit.SessionStorage.get("isMcollectAppChanged");

  var _Digit$Hooks$mcollect = Digit.Hooks.mcollect.useMCollectSearch({
    tenantId: tenantId,
    filters: {
      challanNo: challanNo
    },
    isMcollectAppChanged: isMcollectAppChanged
  }),
      isLoading = _Digit$Hooks$mcollect.isLoading,
      result = _Digit$Hooks$mcollect.data;

  return result && !isLoading ? /*#__PURE__*/React.createElement(CreateChallen, {
    ChallanData: result === null || result === void 0 ? void 0 : result.challans,
    tenantId: tenantId
  }) : null;
};

var EmployeeApp = function EmployeeApp(_ref) {
  var path = _ref.path,
      userType = _ref.userType;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var location = useLocation();
  var mobileView = innerWidth <= 640;
  var inboxInitialState = {
    searchParams: {
      status: [],
      businessService: []
    }
  };

  var combineTaxDueInSearchData = function combineTaxDueInSearchData(searchData, _break, _next) {
    try {
      var _temp3 = function _temp3() {
        return _next(returnData);
      };

      var returnData;
      var tenantId = Digit.ULBService.getCurrentTenantId();
      var businessService = ["PT"].join();
      var consumerCode = searchData.map(function (e) {
        return e.propertyId;
      }).join();

      var _temp4 = _catch(function () {
        return Promise.resolve(Digit.PaymentService.fetchBill(tenantId, {
          consumerCode: consumerCode,
          businessService: businessService
        })).then(function (res) {
          var obj = {};
          res.Bill.forEach(function (e) {
            obj[e.consumerCode] = e.totalAmount;
          });
          returnData = searchData.map(function (e) {
            return _extends({}, e, {
              due_tax: "₹ " + (obj[e.propertyId] || 0)
            });
          });
        });
      }, function (er) {
        var _er$response, _err$Errors;

        var err = er === null || er === void 0 ? void 0 : (_er$response = er.response) === null || _er$response === void 0 ? void 0 : _er$response.data;

        if (["EG_BS_BILL_NO_DEMANDS_FOUND", "EMPTY_DEMANDS"].includes(err === null || err === void 0 ? void 0 : (_err$Errors = err.Errors) === null || _err$Errors === void 0 ? void 0 : _err$Errors[0].code)) {
          returnData = searchData.map(function (e) {
            return _extends({}, e, {
              due_tax: "₹ " + 0
            });
          });
        }
      });

      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var searchMW = [{
    combineTaxDueInSearchData: combineTaxDueInSearchData
  }];
  return /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ground-container",
    style: {
      padding: "10px 0px 0px 30px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "breadcrumb",
    style: {
      marginLeft: mobileView ? "2vw" : "revert"
    }
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/employee",
    style: {
      cursor: "pointer",
      color: "#666"
    }
  }, t("ES_COMMON_HOME")), " ", "/ ", /*#__PURE__*/React.createElement("span", null, location.pathname === "/digit-ui/employee/mcollect/inbox" ? t("UC_SEARCH_HEADER") : t("UC_COMMON_HEADER_SEARCH"))), /*#__PURE__*/React.createElement(PrivateRoute, {
    exact: true,
    path: path + "/",
    component: function component() {
      return /*#__PURE__*/React.createElement(MCollectLinks, {
        matchPath: path,
        userType: userType
      });
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/inbox",
    component: function component() {
      return /*#__PURE__*/React.createElement(Inbox, {
        parentRoute: path,
        businessService: "PT",
        filterComponent: "MCOLLECT_INBOX_FILTER",
        initialStates: inboxInitialState,
        isInbox: true
      });
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/new-application",
    component: function component() {
      return /*#__PURE__*/React.createElement(CreateChallen, null);
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/search",
    component: function component() {
      return /*#__PURE__*/React.createElement(Inbox, {
        parentRoute: path,
        businessService: "PT",
        middlewareSearch: searchMW,
        initialStates: inboxInitialState,
        isInbox: false
      });
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/acknowledgement",
    component: function component() {
      return /*#__PURE__*/React.createElement(MCollectAcknowledgement, null);
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/challansearch/:challanno",
    component: function component() {
      return /*#__PURE__*/React.createElement(EmployeeChallan, null);
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/modify-challan/:challanNo",
    component: function component() {
      return /*#__PURE__*/React.createElement(EditChallan, null);
    }
  }), " ")));
};

var MCollectCard = function MCollectCard() {
  var _data$ChallanCount;

  if (!Digit.Utils.mCollectAccess()) {
    return null;
  }

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$Hooks$mcollect = Digit.Hooks.mcollect.useMCollectCount(tenantId),
      isLoading = _Digit$Hooks$mcollect.isLoading,
      data = _Digit$Hooks$mcollect.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$mcollect, ["isLoading", "isError", "error", "data"]);

  var propsForModuleCard = {
    Icon: /*#__PURE__*/React.createElement(PTIcon, null),
    moduleName: t("UC_COMMON_HEADER_SEARCH"),
    kpis: [{
      count: isLoading ? "-" : data === null || data === void 0 ? void 0 : (_data$ChallanCount = data.ChallanCount) === null || _data$ChallanCount === void 0 ? void 0 : _data$ChallanCount.totalChallan,
      label: t("TOTAL_CHALLANS")
    }],
    links: [{
      label: t("UC_SEARCH_CHALLAN_LABEL"),
      link: "/digit-ui/employee/mcollect/inbox"
    }, {
      label: t("UC_GENERATE_NEW_CHALLAN"),
      link: "/digit-ui/employee/mcollect/new-application"
    }]
  };
  return /*#__PURE__*/React.createElement(EmployeeModuleCard, propsForModuleCard);
};

var StatusCount = function StatusCount(_ref) {
  var status = _ref.status,
      searchParams = _ref.searchParams,
      onAssignmentChange = _ref.onAssignmentChange,
      clearCheck = _ref.clearCheck,
      setclearCheck = _ref.setclearCheck;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  return /*#__PURE__*/React.createElement(CheckBox, {
    onChange: function onChange(e) {
      return onAssignmentChange(e, status);
    },
    checked: function () {
      if (!clearCheck) return searchParams === null || searchParams === void 0 ? void 0 : searchParams.applicationStatus.some(function (e) {
        return e.code === status.code;
      });else {
        setclearCheck(false);
        return false;
      }
    }(),
    label: "" + t(status.name)
  });
};

var Status = function Status(_ref) {
  var _data$mCollect;

  var onAssignmentChange = _ref.onAssignmentChange,
      searchParams = _ref.searchParams,
      clearCheck = _ref.clearCheck,
      setclearCheck = _ref.setclearCheck;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$mcollect = Digit.Hooks.mcollect.useMCollectMDMS(stateId, "mCollect", "applicationStatus"),
      data = _Digit$Hooks$mcollect.data,
      isLoading = _Digit$Hooks$mcollect.isLoading;

  var applicationStatus = (data === null || data === void 0 ? void 0 : (_data$mCollect = data.mCollect) === null || _data$mCollect === void 0 ? void 0 : _data$mCollect.applicationStatus) || [];

  var translateState = function translateState(state) {
    return "" + (state.code || "ACTIVE");
  };

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "status-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-label",
    style: {
      fontWeight: "normal"
    }
  }, t("UC_COMMON_TABLE_COL_STATUS")), applicationStatus === null || applicationStatus === void 0 ? void 0 : applicationStatus.map(function (option, index) {
    return /*#__PURE__*/React.createElement(StatusCount, {
      key: index,
      clearCheck: clearCheck,
      setclearCheck: setclearCheck,
      onAssignmentChange: onAssignmentChange,
      status: {
        name: translateState(option),
        code: option.code
      },
      searchParams: searchParams
    });
  }));
};

var ServiceCategoryCount = function ServiceCategoryCount(_ref) {
  var status = _ref.status,
      searchParams = _ref.searchParams,
      onAssignmentChange = _ref.onAssignmentChange,
      clearCheck = _ref.clearCheck,
      setclearCheck = _ref.setclearCheck;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React.createElement(CheckBox, {
    onChange: function onChange(e) {
      return onAssignmentChange(e, status);
    },
    checked: function () {
      if (!clearCheck) return searchParams === null || searchParams === void 0 ? void 0 : searchParams.applicationStatus.some(function (e) {
        return e.code === status.code;
      });else {
        setclearCheck(false);
        return false;
      }
    }(),
    label: "" + t(status.name),
    styles: {
      marginBottom: "10px"
    }
  });
};

var ServiceCategory = function ServiceCategory(_ref) {
  var onAssignmentChange = _ref.onAssignmentChange,
      searchParams = _ref.searchParams,
      clearCheck = _ref.clearCheck,
      setclearCheck = _ref.setclearCheck;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState = useState(false),
      moreStatus = _useState[0],
      showMoreStatus = _useState[1];

  var _Digit$Hooks$mcollect = Digit.Hooks.mcollect.useMCollectMDMS(stateId, "BillingService", "BusinessService", "[?(@.type=='Adhoc')]"),
      Menu = _Digit$Hooks$mcollect.data,
      isLoading = _Digit$Hooks$mcollect.isLoading;

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

  var translateState = function translateState(option) {
    var code = stringReplaceAll(option.code, ".", "_");
    code = stringReplaceAll(code, " ", "_");
    code = code.toUpperCase();
    return t("BILLINGSERVICE_BUSINESSSERVICE_" + code);
  };

  var menuFirst = [];
  var meuSecond = [];
  Menu === null || Menu === void 0 ? void 0 : Menu.map(function (option, index) {
    if (index < 5) menuFirst.push(option);else meuSecond.push(option);
  });

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "status-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-label",
    style: {
      fontWeight: "normal"
    }
  }, t("UC_SERVICE_CATEGORY_LABEL")), menuFirst === null || menuFirst === void 0 ? void 0 : menuFirst.map(function (option, index) {
    return /*#__PURE__*/React.createElement(ServiceCategoryCount, {
      clearCheck: clearCheck,
      setclearCheck: setclearCheck,
      key: index,
      onAssignmentChange: onAssignmentChange,
      status: {
        name: translateState(option),
        code: option.code
      },
      searchParams: searchParams
    });
  }), moreStatus && (meuSecond === null || meuSecond === void 0 ? void 0 : meuSecond.map(function (option, index) {
    return /*#__PURE__*/React.createElement(ServiceCategoryCount, {
      clearCheck: clearCheck,
      setclearCheck: setclearCheck,
      key: index,
      onAssignmentChange: onAssignmentChange,
      status: {
        name: translateState(option),
        code: option.code
      },
      searchParams: searchParams
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "filter-button",
    onClick: function onClick() {
      return showMoreStatus(!moreStatus);
    }
  }, " ", moreStatus ? t("UC_LESS_LABEL") : t("UC_MORE_LABEL"), " "));
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

var Filter = function Filter(_ref) {
  var searchParams = _ref.searchParams,
      onFilterChange = _ref.onFilterChange,
      defaultSearchParams = _ref.defaultSearchParams,
      props = _objectWithoutPropertiesLoose(_ref, ["searchParams", "onFilterChange", "defaultSearchParams"]);

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState(function () {
    return searchParams;
  }),
      _searchParams = _useState[0],
      setSearchParams = _useState[1];

  var _useState2 = useState(false),
      clearCheck = _useState2[0],
      setclearCheck = _useState2[1];

  var localParamChange = function localParamChange(filterParam) {
    setclearCheck(false);
    var keys_to_delete = filterParam.delete;

    var _new = _extends({}, _searchParams, filterParam);

    if (keys_to_delete) keys_to_delete.forEach(function (key) {
      return delete _new[key];
    });
    delete filterParam.delete;
    setSearchParams(_extends({}, _new));
  };

  var clearAll = function clearAll() {
    setSearchParams(defaultSearchParams);
    onFilterChange(defaultSearchParams);
    setclearCheck(true);
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
  }, t("UC_FILTERS_LABEL"), ":")), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement(CloseSvg, null))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Status, {
    _searchParams: _searchParams,
    businessServices: _searchParams.services,
    clearCheck: clearCheck,
    setclearCheck: setclearCheck,
    onAssignmentChange: function onAssignmentChange(e, status) {
      if (e.target.checked) localParamChange({
        status: [].concat(_searchParams === null || _searchParams === void 0 ? void 0 : _searchParams.status, [status === null || status === void 0 ? void 0 : status.code])
      });else localParamChange({
        status: _searchParams === null || _searchParams === void 0 ? void 0 : _searchParams.status.filter(function (e) {
          return e !== (status === null || status === void 0 ? void 0 : status.code);
        })
      });
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ServiceCategory, {
    _searchParams: _searchParams,
    setclearCheck: setclearCheck,
    businessServices: _searchParams.services,
    clearCheck: clearCheck,
    onAssignmentChange: function onAssignmentChange(e, businessService) {
      if (e.target.checked) localParamChange({
        businessService: [].concat(_searchParams === null || _searchParams === void 0 ? void 0 : _searchParams.businessService, [businessService === null || businessService === void 0 ? void 0 : businessService.code])
      });else localParamChange({
        businessService: _searchParams === null || _searchParams === void 0 ? void 0 : _searchParams.businessService.filter(function (e) {
          return e !== (businessService === null || businessService === void 0 ? void 0 : businessService.code);
        })
      });
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubmitBar, {
    disabled: lodash.isEqual(_searchParams, searchParams),
    onSubmit: function onSubmit() {
      return onFilterChange(_searchParams);
    },
    label: t("ES_COMMON_APPLY")
  }))))));
};

var config = [{
  texts: {
    header: "UC_SEARCH_CHALLAN_LABEL",
    submitBarLabel: "UC_SEARCH_LABEL",
    cardText: "UC_HOME_SEARCH_RESULTS_DESC"
  },
  inputs: [{
    label: "UC_SEARCH_MOBILE_NO_LABEL",
    type: "mobileNumber",
    name: "mobileNumber",
    error: "CORE_COMMON_PHONENO_INVALIDMSG"
  }, {
    label: "UC_CHALLAN_NO",
    type: "number",
    name: "ChallanNo",
    error: "UC_WRONG_CHALLAN_NO"
  }, {
    label: "UC_SERVICE_CATEGORY_LABEL",
    type: "any",
    name: "ServiceCategory",
    error: "UC_INVALID_SERVICE_CATEGORY"
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
var hasOwnProperty$5 = Object.prototype.hasOwnProperty;
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
      if (hasOwnProperty$5.call(from, key)) {
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

var bind = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    return fn.apply(thisArg, args);
  };
};

var toString$1 = Object.prototype.toString;

function isArray$1(val) {
  return toString$1.call(val) === '[object Array]';
}

function isUndefined(val) {
  return typeof val === 'undefined';
}

function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

function isArrayBuffer(val) {
  return toString$1.call(val) === '[object ArrayBuffer]';
}

function isFormData(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData;
}

function isArrayBufferView(val) {
  var result;

  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
  }

  return result;
}

function isString(val) {
  return typeof val === 'string';
}

function isNumber(val) {
  return typeof val === 'number';
}

function isObject$1(val) {
  return val !== null && typeof val === 'object';
}

function isPlainObject(val) {
  if (toString$1.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

function isDate(val) {
  return toString$1.call(val) === '[object Date]';
}

function isFile(val) {
  return toString$1.call(val) === '[object File]';
}

function isBlob(val) {
  return toString$1.call(val) === '[object Blob]';
}

function isFunction$1(val) {
  return toString$1.call(val) === '[object Function]';
}

function isStream(val) {
  return isObject$1(val) && isFunction$1(val.pipe);
}

function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' || navigator.product === 'NativeScript' || navigator.product === 'NS')) {
    return false;
  }

  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function forEach(obj, fn) {
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  if (typeof obj !== 'object') {
    obj = [obj];
  }

  if (isArray$1(obj)) {
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

function merge() {
  var result = {};

  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray$1(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }

  return result;
}

function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }

  return content;
}

var utils = {
  isArray: isArray$1,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject$1,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction$1,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};

function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

var buildURL = function buildURL(url, params, paramsSerializer) {
  if (!params) {
    return url;
  }

  var serializedParams;

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];
    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }

        parts.push(encode(key) + '=' + encode(v));
      });
    });
    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

function InterceptorManager() {
  this.handlers = [];
}

InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

var InterceptorManager_1 = InterceptorManager;

var transformData = function transformData(data, headers, fns) {
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });
  return data;
};

var isCancel = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

var enhanceError = function enhanceError(error, config, code, request, response) {
  error.config = config;

  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: this.config,
      code: this.code
    };
  };

  return error;
};

var createError = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

var settle = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;

  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
  }
};

var cookies = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
  return {
    write: function write(name, value, expires, path, domain, secure) {
      var cookie = [];
      cookie.push(name + '=' + encodeURIComponent(value));

      if (utils.isNumber(expires)) {
        cookie.push('expires=' + new Date(expires).toGMTString());
      }

      if (utils.isString(path)) {
        cookie.push('path=' + path);
      }

      if (utils.isString(domain)) {
        cookie.push('domain=' + domain);
      }

      if (secure === true) {
        cookie.push('secure');
      }

      document.cookie = cookie.join('; ');
    },
    read: function read(name) {
      var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return match ? decodeURIComponent(match[3]) : null;
    },
    remove: function remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  };
}() : function nonStandardBrowserEnv() {
  return {
    write: function write() {},
    read: function read() {
      return null;
    },
    remove: function remove() {}
  };
}();

var isAbsoluteURL = function isAbsoluteURL(url) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

var combineURLs = function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
};

var buildFullPath = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }

  return requestedURL;
};

var ignoreDuplicateOf = ['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent'];

var parseHeaders = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) {
    return parsed;
  }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }

      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });
  return parsed;
};

var isURLSameOrigin = utils.isStandardBrowserEnv() ? function standardBrowserEnv() {
  var msie = /(msie|trident)/i.test(navigator.userAgent);
  var urlParsingNode = document.createElement('a');
  var originURL;

  function resolveURL(url) {
    var href = url;

    if (msie) {
      urlParsingNode.setAttribute('href', href);
      href = urlParsingNode.href;
    }

    urlParsingNode.setAttribute('href', href);
    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
  }

  originURL = resolveURL(window.location.href);
  return function isURLSameOrigin(requestURL) {
    var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
  };
}() : function nonStandardBrowserEnv() {
  return function isURLSameOrigin() {
    return true;
  };
}();

var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type'];
    }

    if ((utils.isBlob(requestData) || utils.isFile(requestData)) && requestData.type) {
      delete requestHeaders['Content-Type'];
    }

    var request = new XMLHttpRequest();

    if (config.auth) {
      var username = config.auth.username || '';
      var password = unescape(encodeURIComponent(config.auth.password)) || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
    request.timeout = config.timeout;

    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };
      settle(resolve, reject, response);
      request = null;
    };

    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));
      request = null;
    };

    request.onerror = function handleError() {
      reject(createError('Network Error', config, null, request));
      request = null;
    };

    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';

      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }

      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED', request));
      request = null;
    };

    if (utils.isStandardBrowserEnv()) {
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          delete requestHeaders[key];
        } else {
          request.setRequestHeader(key, val);
        }
      });
    }

    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    request.send(requestData);
  });
};

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;

  if (typeof XMLHttpRequest !== 'undefined') {
    adapter = xhr;
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    adapter = xhr;
  }

  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),
  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
      return data;
    }

    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }

    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }

    return data;
  }],
  transformResponse: [function transformResponse(data) {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {}
    }

    return data;
  }],
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};
defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});
var defaults_1 = defaults;

function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

var dispatchRequest = function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = config.headers || {};
  config.data = transformData(config.data, config.headers, config.transformRequest);
  config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
  utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
    delete config.headers[method];
  });
  var adapter = config.adapter || defaults_1.adapter;
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData(response.data, response.headers, config.transformResponse);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      if (reason && reason.response) {
        reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
      }
    }

    return Promise.reject(reason);
  });
};

var mergeConfig = function mergeConfig(config1, config2) {
  config2 = config2 || {};
  var config = {};
  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = ['baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer', 'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName', 'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress', 'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent', 'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }

    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });
  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);
  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });
  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });
  var axiosKeys = valueFromConfig2Keys.concat(mergeDeepPropertiesKeys).concat(defaultToConfig2Keys).concat(directMergeKeys);
  var otherKeys = Object.keys(config1).concat(Object.keys(config2)).filter(function filterAxiosKeys(key) {
    return axiosKeys.indexOf(key) === -1;
  });
  utils.forEach(otherKeys, mergeDeepProperties);
  return config;
};

function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager_1(),
    response: new InterceptorManager_1()
  };
}

Axios.prototype.request = function request(config) {
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  Axios.prototype[method] = function (url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url
    }));
  };
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  Axios.prototype[method] = function (url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});
var Axios_1 = Axios;

function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;
var Cancel_1 = Cancel;

function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });
  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      return;
    }

    token.reason = new Cancel_1(message);
    resolvePromise(token.reason);
  });
}

CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

var CancelToken_1 = CancelToken;

var spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

function createInstance(defaultConfig) {
  var context = new Axios_1(defaultConfig);
  var instance = bind(Axios_1.prototype.request, context);
  utils.extend(instance, Axios_1.prototype, context);
  utils.extend(instance, context);
  return instance;
}

var axios = createInstance(defaults_1);
axios.Axios = Axios_1;

axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

axios.Cancel = Cancel_1;
axios.CancelToken = CancelToken_1;
axios.isCancel = isCancel;

axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;
var axios_1 = axios;
var _default = axios;
axios_1.default = _default;

var axios$1 = axios_1;

axios$1.interceptors.response.use(function (res) {
  return res;
}, function (err) {
  var _err$response, _err$response$data;

  var isEmployee = window.location.pathname.split("/").includes("employee");

  if (err !== null && err !== void 0 && (_err$response = err.response) !== null && _err$response !== void 0 && (_err$response$data = _err$response.data) !== null && _err$response$data !== void 0 && _err$response$data.Errors) {
    for (var _iterator = _createForOfIteratorHelperLoose(err.response.data.Errors), _step; !(_step = _iterator()).done;) {
      var error = _step.value;

      if (error.message.includes("InvalidAccessTokenException")) {
        window.location.href = (isEmployee ? "/employee/user/login" : "/digit-ui/citizen/login") + ("?from=" + encodeURIComponent(window.location.pathname + window.location.search));
      }
    }
  }

  throw err;
});

window.Digit = window.Digit || {};
window.Digit = _extends({}, window.Digit, {
  RequestCache: window.Digit.RequestCache || {}
});

var SearchChallan = function SearchChallan(_ref) {
  var _Digit$Hooks$mcollect;

  var propsConfig = _ref.config,
      formData = _ref.formData;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var validation = {};
  var history = useHistory();
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useState = useState((formData === null || formData === void 0 ? void 0 : formData.mobileNumber) || ""),
      mobileNumber = _useState[0],
      setMobileNumber = _useState[1];

  var _useState2 = useState((formData === null || formData === void 0 ? void 0 : formData.challanNo) || ""),
      challanNo = _useState2[0],
      setchallanNumber = _useState2[1];

  var _useState3 = useState((formData === null || formData === void 0 ? void 0 : formData.Servicecateogry) || ""),
      Servicecateogry = _useState3[0],
      setServicecateogry = _useState3[1];

  var _useState4 = useState((formData === null || formData === void 0 ? void 0 : formData.city) || ""),
      city = _useState4[0],
      setcity = _useState4[1];

  var allCities = (_Digit$Hooks$mcollect = Digit.Hooks.mcollect.usemcollectTenants()) === null || _Digit$Hooks$mcollect === void 0 ? void 0 : _Digit$Hooks$mcollect.sort(function (a, b) {
    var _a$i18nKey, _a$i18nKey$localeComp;

    return a === null || a === void 0 ? void 0 : (_a$i18nKey = a.i18nKey) === null || _a$i18nKey === void 0 ? void 0 : (_a$i18nKey$localeComp = _a$i18nKey.localeCompare) === null || _a$i18nKey$localeComp === void 0 ? void 0 : _a$i18nKey$localeComp.call(_a$i18nKey, b === null || b === void 0 ? void 0 : b.i18nKey);
  });

  var _useState5 = useState(null),
      mobileNumberError = _useState5[0],
      setmobileNumberError = _useState5[1];

  var _Digit$Hooks$mcollect2 = Digit.Hooks.mcollect.useMCollectMDMS(tenantId, "BillingService", "BusinessService"),
      Menu = _Digit$Hooks$mcollect2.data,
      isLoading = _Digit$Hooks$mcollect2.isLoading;

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  var onChallanSearch = function onChallanSearch(data) {
    try {
      if (!mobileNumber && !challanNo && !Servicecateogry && !city) {
        return Promise.resolve(alert("Provide at least one parameter"));
      } else if (!Servicecateogry) {
        return Promise.resolve(alert("Please Provide Service Category"));
      } else if (!city.code) {
        return Promise.resolve(alert("Please Provide City"));
      } else {
        history.push("/digit-ui/citizen/mcollect/search-results?mobileNumber=" + mobileNumber + "&challanNo=" + challanNo + "&Servicecategory=" + (Servicecateogry ? Servicecateogry.code.split("_")[Servicecateogry.code.split("_").length - 1] : "") + "&tenantId=" + city.code);
      }

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var SCMenu = [];
  Menu && Menu.map(function (searchcat) {
    if (searchcat.billGineiURL) {
      SCMenu.push({
        i18nKey: "" + searchcat.i18nKey.toUpperCase().replaceAll(".", "_"),
        code: searchcat.i18nKey
      });
    }
  });

  function setMobileNo(e) {
    setmobileNumberError(null);
    var validation = "^\\d{10}$";

    if (!e.target.value.match(validation)) {
      setmobileNumberError("CORE_COMMON_PHONENO_INVALIDMSG");
    }

    setMobileNumber(e.target.value);
  }

  function setchallanNo(e) {
    setchallanNumber(e.target.value);
  }

  function setServicecateogryvalue(value) {
    setServicecateogry(value);
  }

  function selectCity(value) {
    setcity(value);
  }

  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "16px"
    }
  }, /*#__PURE__*/React.createElement(FormStep, {
    config: propsConfig,
    label: propsConfig.texts.submitButtonLabel,
    heading: propsConfig.texts.header,
    text: propsConfig.texts.text,
    cardStyle: {
      margin: "auto"
    },
    headingStyle: {
      fontSize: "32px",
      marginBottom: "16px"
    },
    onSelect: onChallanSearch,
    componentInFront: /*#__PURE__*/React.createElement("div", {
      className: "employee-card-input employee-card-input--front"
    }, "+91"),
    isDisabled: !Servicecateogry || !city.code,
    forcedError: t(mobileNumberError),
    t: t
  }, /*#__PURE__*/React.createElement(CardLabel, null, t("UC_CITY_LABEL") + "*"), /*#__PURE__*/React.createElement(RadioOrSelect, {
    className: "form-field",
    isMandatory: true,
    value: city,
    options: allCities,
    onSelect: selectCity,
    optionKey: "code",
    t: t
  }), /*#__PURE__*/React.createElement(CardLabel, null, t("UC_SERVICE_CATEGORY_LABEL") + "*"), Menu && /*#__PURE__*/React.createElement(RadioOrSelect, _extends({
    t: t,
    optionKey: "i18nKey",
    name: "Servicecategory",
    options: SCMenu,
    value: Servicecateogry,
    selectedOption: Servicecateogry,
    onSelect: setServicecateogryvalue
  }, validation = {
    isRequired: true,
    title: t("please enter service category")
  })), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("UC_SEARCH_MOBILE_NO_LABEL")), /*#__PURE__*/React.createElement("div", {
    className: "field-container"
  }, /*#__PURE__*/React.createElement("span", {
    className: "employee-card-input employee-card-input--front",
    style: {
      marginTop: "-1px"
    }
  }, "+91"), /*#__PURE__*/React.createElement(TextInput, _extends({
    type: "mobileNumber",
    t: t,
    isMandatory: false,
    optionKey: "i18nKey",
    name: "mobileNumber",
    value: mobileNumber,
    onChange: setMobileNo
  }, validation = {
    isRequired: false,
    pattern: "[6-9]{1}[0-9]{9}",
    type: "tel",
    title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")
  }))), /*#__PURE__*/React.createElement(CardLabel, null, "" + t("UC_CHALLAN_NO")), /*#__PURE__*/React.createElement(TextInput, {
    t: t,
    type: "any",
    isMandatory: false,
    optionKey: "i18nKey",
    name: "ChallanNo",
    value: challanNo,
    onChange: setchallanNo
  })));
};

SearchChallan.propTypes = {
  loginParams: propTypes.any
};
SearchChallan.defaultProps = {
  loginParams: null
};

var SearchChallan$1 = function SearchChallan$1() {
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
  }, /*#__PURE__*/React.createElement(SearchChallan, {
    config: params[0]
  })));
};

var config$1 = [{
  texts: {
    header: "CS_SEARCH_RESULTS",
    actionButtonLabel: "CS_VIEW_DETAILS"
  },
  labels: [{
    label: "UC_AMOUNT_DUE_LABEL",
    key: "total_due",
    noteStyle: {
      fontSize: "24px",
      fontWeight: "bold"
    },
    notePrefix: "₹ "
  }, {
    label: "UC_CHALLAN_NO",
    key: "ChannelNo"
  }, {
    label: "UC_SERVICE_CATEGORY_LABEL",
    key: "ServiceCategory"
  }, {
    label: "UC_OWNER_NAME_LABEL",
    key: "OwnerName"
  }, {
    label: "UC_DUE_DATE",
    key: "bil_due__date"
  }]
}];

var ChallanSearchResults = function ChallanSearchResults(_ref) {
  var _result$data2, _result$data2$Bills;

  var template = _ref.template,
      header = _ref.header,
      actionButtonLabel = _ref.actionButtonLabel;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var history = useHistory();

  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
      mobileNumber = _Digit$Hooks$useQuery.mobileNumber,
      challanNo = _Digit$Hooks$useQuery.challanNo,
      Servicecategory = _Digit$Hooks$useQuery.Servicecategory,
      tenantId = _Digit$Hooks$useQuery.tenantId;

  var filters = {};
  if (mobileNumber) filters.mobileNumber = mobileNumber;
  if (challanNo) filters.consumerCode = challanNo;
  if (Servicecategory) filters.businesService = Servicecategory;
  var result = Digit.Hooks.mcollect.useMcollectSearchBill({
    tenantId: tenantId,
    filters: filters
  });

  if (result.isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  var onSubmit = function onSubmit(data) {
    history.push("/digit-ui/citizen/payment/my-bills/" + (data === null || data === void 0 ? void 0 : data.businesService) + "/" + (data === null || data === void 0 ? void 0 : data.ChannelNo) + "?workflow=mcollect");
  };
  var searchResults = result === null || result === void 0 ? void 0 : (_result$data2 = result.data) === null || _result$data2 === void 0 ? void 0 : (_result$data2$Bills = _result$data2.Bills) === null || _result$data2$Bills === void 0 ? void 0 : _result$data2$Bills.map(function (bill) {
    return {
      businesService: bill.businessService,
      total_due: bill.status === "PAID" ? 0 : bill.totalAmount,
      OwnerName: bill.payerName || t("CS_NA"),
      bil_due__date: "" + (new Date(bill.billDetails[0].expiryDate).getDate().toString() + "/" + (new Date(bill.billDetails[0].expiryDate).getMonth() + 1).toString() + "/" + new Date(bill.billDetails[0].expiryDate).getFullYear().toString()),
      ChannelNo: (bill === null || bill === void 0 ? void 0 : bill.consumerCode) || t("CS_NA"),
      ServiceCategory: bill.businessService ? bill.businessService.split(".")[bill.businessService.split(".").length - 1] : t("CS_NA")
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement(Header, {
    style: {
      marginLeft: "8px"
    }
  }, t(header), " (", searchResults === null || searchResults === void 0 ? void 0 : searchResults.length, ")"), /*#__PURE__*/React.createElement(ResponseComposer, {
    data: searchResults,
    template: template,
    actionButtonLabel: actionButtonLabel,
    onSubmit: onSubmit
  })));
};

ChallanSearchResults.propTypes = {
  template: propTypes.any,
  header: propTypes.string,
  actionButtonLabel: propTypes.string
};
ChallanSearchResults.defaultProps = {
  template: [],
  header: null,
  actionButtonLabel: null
};

var CitizenSearchResults = function CitizenSearchResults() {
  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useRouteMatch = useRouteMatch(),
      path = _useRouteMatch.path;

  var params = useMemo(function () {
    return config$1.map(function (step) {
      var texts = {};

      for (var key in step.texts) {
        texts[key] = t(step.texts[key]);
      }

      return _extends({}, step, {
        texts: texts
      });
    }, [config$1]);
  });
  return /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: "" + path,
    exact: true
  }, /*#__PURE__*/React.createElement(ChallanSearchResults, {
    template: params[0].labels,
    header: params[0].texts.header,
    actionButtonLabel: params[0].texts.actionButtonLabel,
    t: t
  })));
};

var config$2 = [{
  texts: {
    header: "CS_SEARCH_RESULTS",
    actionButtonLabel: "CS_VIEW_DETAILS"
  },
  labels: [{
    label: "UC_AMOUNT_DUE_LABEL",
    key: "total_due",
    noteStyle: {
      fontSize: "24px",
      fontWeight: "bold"
    },
    notePrefix: "₹ "
  }, {
    label: "UC_CHALLAN_NO",
    key: "ChannelNo"
  }, {
    label: "UC_SERVICE_CATEGORY_LABEL",
    key: "ServiceCategory"
  }, {
    label: "UC_BILLING_PERIOD_LABEL",
    key: "BillingPeriod"
  }, {
    label: "UC_OWNER_NAME_LABEL",
    key: "OwnerName"
  }, {
    label: "UC_DUE_DATE",
    key: "bil_due__date"
  }]
}];

var MyChallanResult = function MyChallanResult(_ref) {
  var _userInfo$info, _userInfo$info2, _result$data, _result$data$Bills;

  var template = _ref.template,
      header = _ref.header,
      actionButtonLabel = _ref.actionButtonLabel;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var history = useHistory();
  var filters = {};
  var userInfo = Digit.UserService.getUser();
  var tenantId = userInfo === null || userInfo === void 0 ? void 0 : (_userInfo$info = userInfo.info) === null || _userInfo$info === void 0 ? void 0 : _userInfo$info.tenantId;
  filters.mobileNumber = userInfo === null || userInfo === void 0 ? void 0 : (_userInfo$info2 = userInfo.info) === null || _userInfo$info2 === void 0 ? void 0 : _userInfo$info2.mobileNumber;
  var result = Digit.Hooks.mcollect.useMcollectSearchBill({
    tenantId: tenantId,
    filters: filters
  });

  var onSubmit = function onSubmit(data) {
    history.push("/digit-ui/citizen/payment/my-bills/" + (data === null || data === void 0 ? void 0 : data.businesService) + "/" + (data === null || data === void 0 ? void 0 : data.ChannelNo) + "?workflow=mcollect");
  };

  function getBillingPeriod(fromPeriod, toPeriod) {
    if (fromPeriod && toPeriod) {
      var from = new Date(fromPeriod).getDate() + " " + Digit.Utils.date.monthNames[new Date(fromPeriod).getMonth() + 1] + " " + new Date(fromPeriod).getFullYear();
      var to = new Date(toPeriod).getDate() + " " + Digit.Utils.date.monthNames[new Date(toPeriod).getMonth() + 1] + " " + new Date(toPeriod).getFullYear();
      return from + " - " + to;
    } else return "N/A";
  }

  var searchResults = result === null || result === void 0 ? void 0 : (_result$data = result.data) === null || _result$data === void 0 ? void 0 : (_result$data$Bills = _result$data.Bills) === null || _result$data$Bills === void 0 ? void 0 : _result$data$Bills.map(function (bill) {
    return {
      businesService: bill.businessService,
      total_due: bill.status === "PAID" ? 0 : bill.totalAmount,
      OwnerName: bill.payerName || t("CS_NA"),
      BillingPeriod: getBillingPeriod(bill.billDetails[0].fromPeriod, bill.billDetails[0].toPeriod),
      bil_due__date: "" + (new Date(bill.billDetails[0].expiryDate).getDate().toString() + "/" + (new Date(bill.billDetails[0].expiryDate).getMonth() + 1).toString() + "/" + new Date(bill.billDetails[0].expiryDate).getFullYear().toString()),
      ChannelNo: (bill === null || bill === void 0 ? void 0 : bill.consumerCode) || t("CS_NA"),
      ServiceCategory: bill.businessService ? bill.businessService.split(".")[bill.businessService.split(".").length - 1] : t("CS_NA")
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement(Header, {
    style: {
      marginLeft: "8px"
    }
  }, t(header), " (", searchResults === null || searchResults === void 0 ? void 0 : searchResults.length, ")"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ResponseComposer, {
    data: searchResults,
    template: template,
    actionButtonLabel: actionButtonLabel,
    onSubmit: onSubmit
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "16px",
      marginTop: "16px",
      marginBottom: "46px"
    }
  }, /*#__PURE__*/React.createElement("p", null, t("UC_NOT_ABLE_TO_FIND_BILL_MSG"), " "), /*#__PURE__*/React.createElement("p", {
    className: "link"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/citizen/mcollect/search"
  }, t("UC_CLICK_HERE_TO_SEARCH_LINK")))));
};

MyChallanResult.propTypes = {
  template: propTypes.any,
  header: propTypes.string,
  actionButtonLabel: propTypes.string
};
MyChallanResult.defaultProps = {
  template: [],
  header: null,
  actionButtonLabel: null
};

var MyChallans = function MyChallans() {
  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useRouteMatch = useRouteMatch(),
      path = _useRouteMatch.path;

  var params = useMemo(function () {
    return config$2.map(function (step) {
      var texts = {};

      for (var key in step.texts) {
        texts[key] = t(step.texts[key]);
      }

      return _extends({}, step, {
        texts: texts
      });
    }, [config$2]);
  });
  return /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: "" + path,
    exact: true
  }, /*#__PURE__*/React.createElement(MyChallanResult, {
    template: params[0].labels,
    header: params[0].texts.header,
    actionButtonLabel: params[0].texts.actionButtonLabel,
    t: t
  })));
};

var App = function App() {
  var _useRouteMatch = useRouteMatch(),
      path = _useRouteMatch.path,
      match = _objectWithoutPropertiesLoose(_useRouteMatch, ["path", "url"]);

  return /*#__PURE__*/React.createElement("span", {
    className: "mcollect-citizen"
  }, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(AppContainer, null, /*#__PURE__*/React.createElement(BackButton, {
    style: {
      top: "55px"
    }
  }, "Back"), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/search",
    component: SearchChallan$1
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/search-results",
    component: CitizenSearchResults
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/My-Challans",
    component: MyChallans
  }))));
};

var MCollectModule = function MCollectModule(_ref) {
  var stateCode = _ref.stateCode,
      userType = _ref.userType,
      tenants = _ref.tenants;
  var moduleCode = "UC";
  var language = Digit.StoreData.getCurrentLanguage();

  var _Digit$Services$useSt = Digit.Services.useStore({
    stateCode: stateCode,
    moduleCode: moduleCode,
    language: language
  }),
      isLoading = _Digit$Services$useSt.isLoading;

  Digit.SessionStorage.set("MCollect_TENANTS", tenants);

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  var _useRouteMatch = useRouteMatch(),
      path = _useRouteMatch.path,
      url = _useRouteMatch.url;

  if (userType === "employee") {
    return /*#__PURE__*/React.createElement(EmployeeApp, {
      path: path,
      url: url,
      userType: userType
    });
  } else return /*#__PURE__*/React.createElement(App, null);
};
var MCollectLinks = function MCollectLinks(_ref2) {
  var matchPath = _ref2.matchPath;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("PT_CREATE_PROPERTY112", {}),
      clearParams = _Digit$Hooks$useSessi[2];

  useEffect(function () {
    clearParams();
  }, []);
  var links = [{
    link: matchPath + "/search",
    i18nKey: t("UC_SEARCH_AND_PAY")
  }, {
    link: matchPath + "/My-Challans",
    i18nKey: t("UC_MY_CHALLANS")
  }];
  return /*#__PURE__*/React.createElement(CitizenHomeCard, {
    header: t("ACTION_TEST_MCOLLECT"),
    links: links,
    Icon: function Icon() {
      return /*#__PURE__*/React.createElement(PTIcon, {
        className: "fill-path-primary-main"
      });
    }
  });
};
var componentsToRegister = {
  MCollectCard: MCollectCard,
  MCollectModule: MCollectModule,
  MCollectLinks: MCollectLinks,
  MCOLLECT_INBOX_FILTER: function MCOLLECT_INBOX_FILTER(props) {
    return /*#__PURE__*/React.createElement(Filter, props);
  }
};
var initMCollectComponents = function initMCollectComponents() {
  Object.entries(componentsToRegister).forEach(function (_ref3) {
    var key = _ref3[0],
        value = _ref3[1];
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

export { MCollectLinks, MCollectModule, initMCollectComponents };
//# sourceMappingURL=index.modern.js.map
