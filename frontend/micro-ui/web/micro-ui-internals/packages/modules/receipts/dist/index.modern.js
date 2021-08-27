import { LabelFieldPair, CardLabel, Dropdown, Loader, Modal, FormComposer, CloseSvg, CheckBox, SubmitBar, ActionBar, ApplyFilterBar, Card, CardText, LinkButton, Banner as Banner$1, Header, StatusTable, Row, AnnouncementIcon, Table, Label, TextInput, LinkLabel, DatePicker, MobileNumber, DetailsCard, SearchAction, FilterAction, PopUp, ReceiptIcon, EmployeeModuleCard, PrivateRoute } from '@egovernments/digit-ui-react-components';
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, Link, useParams, useLocation, useRouteMatch, Switch } from 'react-router-dom';
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

var Banner = function Banner(_ref) {
  var _config$texts;

  var t = _ref.t,
      config = _ref.config;
  return /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, {
    className: "card-label-smaller",
    style: {
      color: "white"
    }
  }, "."), /*#__PURE__*/React.createElement("span", {
    className: "form-field",
    style: {
      color: "gray"
    }
  }, t(config === null || config === void 0 ? void 0 : (_config$texts = config.texts) === null || _config$texts === void 0 ? void 0 : _config$texts.header)));
};

var configCancelConfig = function configCancelConfig(_ref) {
  var t = _ref.t,
      selectedReason = _ref.selectedReason,
      Reasons = _ref.Reasons,
      selectReason = _ref.selectReason;
  return {
    label: {
      heading: "CR_COMMON_HEADER",
      submit: "CR_CANCEL_RECEIPT_BUTTON"
    },
    form: [{
      body: [{
        label: t("CR_RECEIPT_CANCELLATION_REASON_LABEL"),
        type: "dropdown",
        isMandatory: true,
        name: "reason",
        populators: /*#__PURE__*/React.createElement(Dropdown, {
          isMandatory: true,
          selected: selectedReason,
          optionKey: "name",
          option: Reasons,
          select: selectReason,
          t: t
        })
      }, {
        label: t("CR_MORE_DETAILS_LABEL"),
        type: "text",
        populators: {
          name: "otherDetails"
        },
        disable: (selectedReason === null || selectedReason === void 0 ? void 0 : selectedReason.code) == "OTHER" ? false : true
      }, {
        label: t("CR_ADDITIONAL_PENALTY"),
        type: "text",
        populators: {
          name: "penalty",
          disable: true
        },
        disable: true
      }]
    }]
  };
};

var ReceiptCancelModal = function ReceiptCancelModal(_ref) {
  var _config$label, _config$label2;

  var t = _ref.t,
      closeModal = _ref.closeModal,
      applicationData = _ref.applicationData;
  var history = useHistory();

  var _useState = useState({}),
      config = _useState[0],
      setConfig = _useState[1];

  var _useState2 = useState([]),
      Reasons = _useState2[0],
      setReasons = _useState2[1];

  var _useState3 = useState(""),
      selectedReason = _useState3[0],
      selecteReason = _useState3[1];

  var tenantIds = Digit.ULBService.getCurrentTenantId() || '';
  var tenant = tenantIds.split && tenantIds.split('.')[0] || '';

  var _Digit$Hooks$receipts = Digit.Hooks.receipts.useReceiptsMDMS(tenant, "CancelReceiptReason"),
      isLoading = _Digit$Hooks$receipts.isLoading,
      data = _Digit$Hooks$receipts.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$receipts, ["isLoading", "isError", "errors", "data"]);

  useEffect(function () {
    return setConfig(configCancelConfig({
      t: t,
      selectedReason: selectedReason,
      Reasons: Reasons,
      selectReason: selectReason
    }));
  }, [Reasons, selectedReason]);

  var Heading = function Heading(props) {
    return /*#__PURE__*/React.createElement("h1", {
      className: "heading-m"
    }, props.label);
  };

  function selectReason(e) {
    selecteReason(e);
  }

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

  useEffect(function () {
    setReasons(data === null || data === void 0 ? void 0 : data.dropdownData);
  }, [data]);

  function submit(data) {
    var _applicationData$Paym, _applicationData$Paym2, _applicationData$Paym3, _applicationData$Paym4;

    history.replace("/digit-ui/employee/receipts/response", {
      paymentWorkflow: {
        action: "CANCEL",
        additionalDetails: data.otherDetails,
        paymentId: applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$Paym = applicationData.Payments[0]) === null || _applicationData$Paym === void 0 ? void 0 : _applicationData$Paym.id,
        reason: selectedReason.code,
        tenantId: applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$Paym2 = applicationData.Payments[0]) === null || _applicationData$Paym2 === void 0 ? void 0 : _applicationData$Paym2.tenantId
      },
      key: "UPDATE",
      action: "CANCELLATION",
      businessService: applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$Paym3 = applicationData.Payments[0]) === null || _applicationData$Paym3 === void 0 ? void 0 : (_applicationData$Paym4 = _applicationData$Paym3.paymentDetails[0]) === null || _applicationData$Paym4 === void 0 ? void 0 : _applicationData$Paym4.businessService
    });
  }

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return config !== null && config !== void 0 && config.form ? /*#__PURE__*/React.createElement(Modal, {
    headerBarMain: /*#__PURE__*/React.createElement(Heading, {
      label: t(config === null || config === void 0 ? void 0 : (_config$label = config.label) === null || _config$label === void 0 ? void 0 : _config$label.heading)
    }),
    headerBarEnd: /*#__PURE__*/React.createElement(CloseBtn, {
      onClick: closeModal
    }),
    actionCancelOnSubmit: closeModal,
    actionSaveLabel: t(config === null || config === void 0 ? void 0 : (_config$label2 = config.label) === null || _config$label2 === void 0 ? void 0 : _config$label2.submit),
    actionSaveOnSubmit: function actionSaveOnSubmit() {},
    formId: "modal-action",
    isDisabled: !selectedReason
  }, /*#__PURE__*/React.createElement(FormComposer, {
    config: config === null || config === void 0 ? void 0 : config.form,
    noBoxShadow: true,
    inline: true,
    disabled: true,
    childrenAtTheBottom: true,
    onSubmit: submit,
    formId: "modal-action"
  })) : /*#__PURE__*/React.createElement(Loader, null);
};

var ActionModal = function ActionModal(props) {
  return /*#__PURE__*/React.createElement(ReceiptCancelModal, props);
};

var convertEpochToDate = function convertEpochToDate(dateEpoch) {
  if (dateEpoch) {
    var dateFromApi = new Date(dateEpoch);
    var month = dateFromApi.getMonth() + 1;
    var day = dateFromApi.getDate();
    var year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return day + "/" + month + "/" + year;
  } else {
    return 'NA';
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
var checkForNotNull = function checkForNotNull(value) {
  if (value === void 0) {
    value = "";
  }

  return value && value != null && value != undefined && value != "" ? true : false;
};
var convertDotValues = function convertDotValues(value) {
  if (value === void 0) {
    value = "";
  }

  return checkForNotNull(value) && (value.replaceAll && value.replaceAll(".", "_") || value.replace && stringReplaceAll(value, ".", "_")) || "NA";
};
var convertToLocale = function convertToLocale(value, key) {
  if (value === void 0) {
    value = "";
  }

  if (key === void 0) {
    key = "";
  }

  var convertedValue = convertDotValues(value);

  if (convertedValue == "NA") {
    return "PT_NA";
  }

  return key + "_" + convertedValue;
};
var RECEIPTS_DEFAULT_SERVICE = "PT";
var getDefaultReceiptService = function getDefaultReceiptService() {
  return RECEIPTS_DEFAULT_SERVICE;
};
var getFinancialYears = function getFinancialYears(from, to) {
  var fromDate = new Date(from);
  var toDate = new Date(to);

  if (toDate.getYear() - fromDate.getYear() != 0) {
    return "FY" + (fromDate.getYear() + 1900) + "-" + (toDate.getYear() - 100);
  }

  return fromDate.toLocaleDateString() + "-" + toDate.toLocaleDateString();
};

var ReceiptsFilter = function ReceiptsFilter(_ref) {
  var searchParams = _ref.searchParams,
      onFilterChange = _ref.onFilterChange,
      props = _objectWithoutPropertiesLoose(_ref, ["searchParams", "onFilterChange", "onSearch", "removeParam"]);

  var tenantId = Digit.ULBService.getCurrentTenantId() || '';
  var tenant = tenantId.split && tenantId.split('.')[0] || '';

  var _useState = useState(function () {
    return searchParams;
  }),
      _searchParams = _useState[0],
      setSearchParams = _useState[1];

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var defaultService = getDefaultReceiptService();

  var _useState2 = useState([]),
      status = _useState2[0],
      setStatus = _useState2[1];

  var _useState3 = useState({
    name: "BILLINGSERVICE_BUSINESSSERVICE_" + defaultService,
    code: defaultService
  }),
      service = _useState3[0],
      setService = _useState3[1];

  var _Digit$Hooks$receipts = Digit.Hooks.receipts.useReceiptsMDMS(tenant, "CancelReceiptReasonAndStatus"),
      data = _Digit$Hooks$receipts.data,
      isLoading = _Digit$Hooks$receipts.isLoading,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$receipts, ["data", "isLoading"]);

  var mdmsStatus = (data === null || data === void 0 ? void 0 : data.dropdownDataStatus) || [];
  useEffect(function () {
    if ((service === null || service === void 0 ? void 0 : service.code) != _searchParams.businessServices) {
      setSearchParams({
        businessServices: service === null || service === void 0 ? void 0 : service.code
      });
    }
  }, [service]);
  useEffect(function () {
    if (status) {
      setSearchParams({
        status: status.join(',')
      });
    }
  }, [status]);

  var onCheckBoxClick = function onCheckBoxClick(value) {
    if (status.includes(value)) {
      status.splice(status.findIndex(function (x) {
        return x == value;
      }), 1);
    } else {
      status.push(value);
    }

    setStatus([].concat(status));
  };

  var clearAll = function clearAll() {
    var _props$onClose;

    onFilterChange({
      delete: Object.keys(searchParams)
    }, true);
    setStatus([]);
    setService({
      name: "BILLINGSERVICE_BUSINESSSERVICE_" + defaultService,
      code: defaultService
    });
    props === null || props === void 0 ? void 0 : (_props$onClose = props.onClose) === null || _props$onClose === void 0 ? void 0 : _props$onClose.call(props);
  };

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "filter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "heading"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-label"
  }, t("COMMON_TABLE_FILTERS"), ":"), /*#__PURE__*/React.createElement("div", {
    className: "clearAll",
    onClick: clearAll
  }, t("CR_COMMON_CLEAR_ALL")), props.type === "desktop" && /*#__PURE__*/React.createElement("span", {
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
  }, /*#__PURE__*/React.createElement(CloseSvg, null))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "filter-label"
  }, t("CR_COMMON_TABLE_COL_STATUS")), mdmsStatus.map(function (sta, index) {
    return /*#__PURE__*/React.createElement(CheckBox, {
      key: index + "service",
      label: t(sta === null || sta === void 0 ? void 0 : sta.name),
      value: sta === null || sta === void 0 ? void 0 : sta.code,
      checked: status.includes(sta === null || sta === void 0 ? void 0 : sta.code),
      onChange: function onChange(event) {
        return onCheckBoxClick(event.target.value);
      }
    });
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "filter-label"
  }, t("CR_SERVICE_CATEGORY_LABEL")), /*#__PURE__*/React.createElement(Dropdown, {
    t: t,
    option: (data === null || data === void 0 ? void 0 : data.dropdownData) || null,
    value: service,
    selected: service,
    select: setService,
    optionKey: "name"
  })), props.type !== "mobile" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SubmitBar, {
    onSubmit: function onSubmit() {
      var _props$onClose2;

      onFilterChange(_searchParams);
      props === null || props === void 0 ? void 0 : (_props$onClose2 = props.onClose) === null || _props$onClose2 === void 0 ? void 0 : _props$onClose2.call(props);
    },
    label: t("ACTION_TEST_APPLY")
  })), props.type === "mobile" && /*#__PURE__*/React.createElement(ActionBar, null, /*#__PURE__*/React.createElement(ApplyFilterBar, {
    submit: false,
    labelLink: t("ES_COMMON_CLEAR_ALL"),
    buttonLink: t("ACTION_TEST_APPLY"),
    onSubmit: function onSubmit() {
      var _props$onClose3;

      onFilterChange(_searchParams);
      props === null || props === void 0 ? void 0 : (_props$onClose3 = props.onClose) === null || _props$onClose3 === void 0 ? void 0 : _props$onClose3.call(props);
    },
    onClear: function onClear() {
      var _props$onClose4;

      clearAll();
      props === null || props === void 0 ? void 0 : (_props$onClose4 = props.onClose) === null || _props$onClose4 === void 0 ? void 0 : _props$onClose4.call(props);
    },
    style: {
      flex: 1
    }
  })))))));
};

var printReciept = function printReciept(businessService, consumerCode) {
  try {
    return Promise.resolve(Digit.Utils.downloadReceipt(consumerCode, businessService, 'consolidatedreceipt')).then(function () {});
  } catch (e) {
    return Promise.reject(e);
  }
};

var GetMessage = function GetMessage(type, action, isSuccess, isEmployee, t) {
  return t("CR_APPLY_" + (isSuccess ? "SUCCESS" : "FAILURE") + "_MESSAGE_MAIN");
};

var GetActionMessage = function GetActionMessage(action, isSuccess, isEmployee, t) {
  return GetMessage("ACTION", action, isSuccess, isEmployee, t);
};

var BannerPicker = function BannerPicker(props) {
  var _props$data, _props$data$Payments, _props$data$Payments$;

  return /*#__PURE__*/React.createElement(Banner$1, {
    message: GetActionMessage(props.action, props.isSuccess, props.isEmployee, props.t),
    applicationNumber: props === null || props === void 0 ? void 0 : (_props$data = props.data) === null || _props$data === void 0 ? void 0 : (_props$data$Payments = _props$data.Payments) === null || _props$data$Payments === void 0 ? void 0 : (_props$data$Payments$ = _props$data$Payments[0]) === null || _props$data$Payments$ === void 0 ? void 0 : _props$data$Payments$.paymentDetails[0].receiptNumber,
    info: props.isSuccess ? props.t("CR_RECEIPT_NUMBER") : "",
    successful: props.isSuccess
  });
};

var ReceiptAcknowledgement = function ReceiptAcknowledgement(props) {
  var _mutation$data, _successData$Payments;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var state = props.location.state;
  var mutation = Digit.Hooks.receipts.useReceiptsUpdate(tenantId, state === null || state === void 0 ? void 0 : state.businessService);

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("EMPLOYEE_RECEIPT_MUTATION_HAPPENED", false),
      mutationHappened = _Digit$Hooks$useSessi[0],
      setMutationHappened = _Digit$Hooks$useSessi[1];

  var _Digit$Hooks$useSessi2 = Digit.Hooks.useSessionStorage("EMPLOYEE_RECEIPT_ERROR_DATA", false),
      errorInfo = _Digit$Hooks$useSessi2[0],
      setErrorInfo = _Digit$Hooks$useSessi2[1];

  var _Digit$Hooks$useSessi3 = Digit.Hooks.useSessionStorage("EMPLOYEE_RECEIPT_MUTATION_SUCCESS_DATA", false),
      successData = _Digit$Hooks$useSessi3[0],
      setsuccessData = _Digit$Hooks$useSessi3[1];

  useEffect(function () {
    if (mutation.data) setsuccessData(mutation.data);
  }, [mutation.data]);

  var onError = function onError(error, variables) {
    var _error$response, _error$response$data, _error$response$data$;

    setErrorInfo((error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : (_error$response$data = _error$response.data) === null || _error$response$data === void 0 ? void 0 : (_error$response$data$ = _error$response$data.Errors[0]) === null || _error$response$data$ === void 0 ? void 0 : _error$response$data$.code) || 'ERROR');
    setMutationHappened(true);
  };

  useEffect(function () {
    var onSuccess = function onSuccess() {
      setMutationHappened(true);
    };

    if (state.key === "UPDATE" && !mutationHappened && !errorInfo) {
      mutation.mutate({
        paymentWorkflows: [state.paymentWorkflow]
      }, {
        onError: onError,
        onSuccess: onSuccess
      });
    }
  }, []);

  var DisplayText = function DisplayText(action, isSuccess, isEmployee, t) {
    if (!isSuccess) {
      var _mutation$error, _mutation$error$respo, _mutation$error$respo2;

      return (mutation === null || mutation === void 0 ? void 0 : (_mutation$error = mutation.error) === null || _mutation$error === void 0 ? void 0 : (_mutation$error$respo = _mutation$error.response) === null || _mutation$error$respo === void 0 ? void 0 : (_mutation$error$respo2 = _mutation$error$respo.data) === null || _mutation$error$respo2 === void 0 ? void 0 : _mutation$error$respo2.Errors[0].code) || errorInfo;
    } else {
      Digit.SessionStorage.set("isupdate", Math.floor(100000 + Math.random() * 900000));
      return t('CR_APPLY_FORWARD_SUCCESS');
    }
  };

  if (mutation.isLoading || mutation.isIdle && !mutationHappened) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  var Payment = (mutation === null || mutation === void 0 ? void 0 : (_mutation$data = mutation.data) === null || _mutation$data === void 0 ? void 0 : _mutation$data.Payments[0]) || (successData === null || successData === void 0 ? void 0 : (_successData$Payments = successData.Payments) === null || _successData$Payments === void 0 ? void 0 : _successData$Payments[0]);
  var isSuccess = !successData ? mutation === null || mutation === void 0 ? void 0 : mutation.isSuccess : true;
  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(BannerPicker, {
    t: t,
    data: (mutation === null || mutation === void 0 ? void 0 : mutation.data) || successData,
    action: state.action,
    isSuccess: isSuccess,
    isLoading: mutation.isIdle && !mutationHappened || (mutation === null || mutation === void 0 ? void 0 : mutation.isLoading),
    isEmployee: props.parentRoute.includes("employee")
  }), /*#__PURE__*/React.createElement(CardText, null, t(DisplayText(state.action, isSuccess, props.parentRoute.includes("employee"), t), t)), isSuccess && /*#__PURE__*/React.createElement(CardText, null, /*#__PURE__*/React.createElement(LinkButton, {
    label: /*#__PURE__*/React.createElement("div", {
      className: "response-download-button"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "18",
      viewBox: "0 0 20 18",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M17 5H3C1.34 5 0 6.34 0 8V14H4V18H16V14H20V8C20 6.34 18.66 5 17 5ZM14 16H6V11H14V16ZM17 9C16.45 9 16 8.55 16 8C16 7.45 16.45 7 17 7C17.55 7 18 7.45 18 8C18 8.55 17.55 9 17 9ZM16 0H4V4H16V0Z",
      fill: "#F47738"
    }))), /*#__PURE__*/React.createElement("span", {
      className: "download-button"
    }, t("COMMON_TABLE_PRINT"))),
    style: {
      width: "100px"
    },
    onClick: function onClick() {
      var _Payment$paymentDetai, _Payment$paymentDetai2, _Payment$paymentDetai3;

      printReciept(Payment === null || Payment === void 0 ? void 0 : (_Payment$paymentDetai = Payment.paymentDetails[0]) === null || _Payment$paymentDetai === void 0 ? void 0 : _Payment$paymentDetai.businessService, Payment === null || Payment === void 0 ? void 0 : (_Payment$paymentDetai2 = Payment.paymentDetails[0]) === null || _Payment$paymentDetai2 === void 0 ? void 0 : (_Payment$paymentDetai3 = _Payment$paymentDetai2.bill) === null || _Payment$paymentDetai3 === void 0 ? void 0 : _Payment$paymentDetai3.consumerCode);
    }
  })), /*#__PURE__*/React.createElement(ActionBar, null, /*#__PURE__*/React.createElement(Link, {
    to: "" + (props.parentRoute.includes("employee") ? "/digit-ui/employee" : "/digit-ui/citizen")
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CORE_COMMON_GO_TO_HOME")
  }))));
};

var canCancelReceipt = function canCancelReceipt(Receipt) {
  var _Receipt, _Receipt2, _Receipt3, _Receipt4;

  if (Receipt === void 0) {
    Receipt = {};
  }

  return ((_Receipt = Receipt) === null || _Receipt === void 0 ? void 0 : _Receipt.paymentStatus) !== "CANCELLED" && ((_Receipt2 = Receipt) === null || _Receipt2 === void 0 ? void 0 : _Receipt2.paymentStatus) !== "DEPOSITED" && (((_Receipt3 = Receipt) === null || _Receipt3 === void 0 ? void 0 : _Receipt3.instrumentStatus) == "APPROVED" || ((_Receipt4 = Receipt) === null || _Receipt4 === void 0 ? void 0 : _Receipt4.instrumentStatus) == "REMITTED");
};

var ReceiptDetails = function ReceiptDetails() {
  var _data$Payments, _data$Payments2, _PaymentReceipt$payme, _PaymentReceipt$payme2, _PaymentReceipt$payme3, _PaymentReceipt$payme4, _PaymentReceipt$payme5, _PaymentReceipt$payme6, _PaymentReceipt$payme7, _PaymentReceipt$payme8, _PaymentReceipt$payme9, _PaymentReceipt$payme10, _PaymentReceipt$payme11, _PaymentReceipt$payme12, _PaymentReceipt$payme13;

  var _useState = useState(false),
      showModal = _useState[0],
      setShowModal = _useState[1];

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useParams = useParams(),
      receiptId = _useParams.id,
      businessService = _useParams.service;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var isupdate = Digit.SessionStorage.get("isupdate");

  var _Digit$Hooks$receipts = Digit.Hooks.receipts.useReceiptsSearch({
    receiptNumbers: decodeURIComponent(receiptId),
    businessServices: businessService
  }, tenantId, {}, isupdate),
      isLoading = _Digit$Hooks$receipts.isLoading,
      data = _Digit$Hooks$receipts.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$receipts, ["isLoading", "isError", "error", "data"]);

  var cancelReceipt = function cancelReceipt() {
    setShowModal(true);
  };

  var closeModal = function closeModal() {
    setShowModal(false);
  };

  var submitAction = function submitAction(data) {};

  useEffect(function () {
    return function () {
      rest === null || rest === void 0 ? void 0 : rest.revalidate();
    };
  }, []);

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("EMPLOYEE_RECEIPT_MUTATION_HAPPENED", false),
      setMutationHappened = _Digit$Hooks$useSessi[1];

  var _Digit$Hooks$useSessi2 = Digit.Hooks.useSessionStorage("EMPLOYEE_RECEIPT_MUTATION_SUCCESS_DATA", false),
      clearSuccessData = _Digit$Hooks$useSessi2[2];

  var _Digit$Hooks$useSessi3 = Digit.Hooks.useSessionStorage("EMPLOYEE_RECEIPT_ERROR_DATA", false),
      clearError = _Digit$Hooks$useSessi3[2];

  useEffect(function () {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  var PaymentReceipt = !isLoading && (data === null || data === void 0 ? void 0 : (_data$Payments = data.Payments) === null || _data$Payments === void 0 ? void 0 : _data$Payments.length) > 0 ? data.Payments[0] : {};
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "30%",
      fontFamily: "calibri",
      color: "#FF0000"
    }
  }, /*#__PURE__*/React.createElement(Header, null, t("CR_RECEIPT_SUMMARY"))), !isLoading && (data === null || data === void 0 ? void 0 : (_data$Payments2 = data.Payments) === null || _data$Payments2 === void 0 ? void 0 : _data$Payments2.length) > 0 ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(StatusTable, null, /*#__PURE__*/React.createElement(Row, {
    label: t("CR_RECEIPT_NUMBER"),
    text: (PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : (_PaymentReceipt$payme = PaymentReceipt.paymentDetails[0]) === null || _PaymentReceipt$payme === void 0 ? void 0 : _PaymentReceipt$payme.receiptNumber) || "NA",
    textStyle: {
      whiteSpace: "pre"
    }
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CR_RECEIPT_CONSUMER_NUMBER"),
    text: (PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : (_PaymentReceipt$payme2 = PaymentReceipt.paymentDetails[0]) === null || _PaymentReceipt$payme2 === void 0 ? void 0 : (_PaymentReceipt$payme3 = _PaymentReceipt$payme2.bill) === null || _PaymentReceipt$payme3 === void 0 ? void 0 : _PaymentReceipt$payme3.consumerCode) || "NA",
    textStyle: {
      whiteSpace: "pre"
    }
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CR_RECEIPT_PAYMENT_DATE"),
    text: convertEpochToDate(PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : (_PaymentReceipt$payme4 = PaymentReceipt.paymentDetails[0]) === null || _PaymentReceipt$payme4 === void 0 ? void 0 : _PaymentReceipt$payme4.receiptDate) || "NA"
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CR_RECEIPT_PAYER_NAME"),
    text: (PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : PaymentReceipt.payerName) || "NA"
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CR_RECEIPT_PAYER_NUMBER"),
    text: (PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : PaymentReceipt.mobileNumber) || "NA"
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CR_RECEIPT_SERVICE_TYPE"),
    text: t(convertToLocale(PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : (_PaymentReceipt$payme5 = PaymentReceipt.paymentDetails[0]) === null || _PaymentReceipt$payme5 === void 0 ? void 0 : _PaymentReceipt$payme5.businessService, 'BILLINGSERVICE_BUSINESSSERVICE')) || "NA"
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CR_RECEIPT_BILL_PERIOD"),
    text: getFinancialYears(PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : (_PaymentReceipt$payme6 = PaymentReceipt.paymentDetails[0]) === null || _PaymentReceipt$payme6 === void 0 ? void 0 : (_PaymentReceipt$payme7 = _PaymentReceipt$payme6.bill) === null || _PaymentReceipt$payme7 === void 0 ? void 0 : (_PaymentReceipt$payme8 = _PaymentReceipt$payme7.billDetails[0]) === null || _PaymentReceipt$payme8 === void 0 ? void 0 : _PaymentReceipt$payme8.fromPeriod, PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : (_PaymentReceipt$payme9 = PaymentReceipt.paymentDetails[0]) === null || _PaymentReceipt$payme9 === void 0 ? void 0 : (_PaymentReceipt$payme10 = _PaymentReceipt$payme9.bill) === null || _PaymentReceipt$payme10 === void 0 ? void 0 : (_PaymentReceipt$payme11 = _PaymentReceipt$payme10.billDetails[0]) === null || _PaymentReceipt$payme11 === void 0 ? void 0 : _PaymentReceipt$payme11.toPeriod) || "NA"
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CR_RECEIPT_AMOUNT"),
    text: '₹' + (PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : PaymentReceipt.totalAmountPaid) || "NA"
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CR_RECEIPT_PENDING_AMOUNT"),
    text: '₹' + (PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : PaymentReceipt.totalDue) || "₹0"
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CR_RECEIPT_PAYMENT_MODE"),
    text: PaymentReceipt !== null && PaymentReceipt !== void 0 && PaymentReceipt.paymentMode ? t("COMMON_MASTERS_PAYMENTMODE_" + (PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : PaymentReceipt.paymentMode)) || "NA" : "NA"
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CR_RECEIPT_TXN_ID"),
    text: (PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : PaymentReceipt.transactionNumber) || "NA"
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CR_RECEIPT_G8_RECEIPT_NO"),
    text: (PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : (_PaymentReceipt$payme12 = PaymentReceipt.paymentDetails[0]) === null || _PaymentReceipt$payme12 === void 0 ? void 0 : _PaymentReceipt$payme12.manualReceiptNumber) || "NA"
  }), /*#__PURE__*/React.createElement(Row, {
    label: t("CR_RECEIPT_G8_RECEIPT_DATE"),
    text: convertEpochToDate(PaymentReceipt === null || PaymentReceipt === void 0 ? void 0 : (_PaymentReceipt$payme13 = PaymentReceipt.paymentDetails[0]) === null || _PaymentReceipt$payme13 === void 0 ? void 0 : _PaymentReceipt$payme13.manualReceiptDate) || "NA"
  })))) : null, showModal ? /*#__PURE__*/React.createElement(ActionModal, {
    t: t,
    tenantId: tenantId,
    applicationData: data,
    closeModal: closeModal,
    submitAction: submitAction
  }) : null, /*#__PURE__*/React.createElement(ActionBar, null, canCancelReceipt(PaymentReceipt) && /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CR_CANCEL_RECEIPT_BUTTON"),
    onSubmit: function onSubmit() {
      return cancelReceipt();
    }
  })));
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
    }, /*#__PURE__*/React.createElement(AnnouncementIcon, null)), " ", /*#__PURE__*/React.createElement("span", {
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
      columns = _ref.columns,
      data = _ref.data,
      getCellProps = _ref.getCellProps,
      onNextPage = _ref.onNextPage,
      onPrevPage = _ref.onPrevPage,
      currentPage = _ref.currentPage,
      totalRecords = _ref.totalRecords,
      pageSizeLimit = _ref.pageSizeLimit,
      onPageSizeChange = _ref.onPageSizeChange,
      onLastPage = _ref.onLastPage,
      onFirstPage = _ref.onFirstPage;
  return /*#__PURE__*/React.createElement(Table, {
    t: t,
    data: data,
    manualPagination: true,
    columns: columns,
    getCellProps: getCellProps,
    onNextPage: onNextPage,
    onPrevPage: onPrevPage,
    currentPage: currentPage,
    totalRecords: totalRecords,
    onLastPage: onLastPage,
    onFirstPage: onFirstPage,
    onPageSizeChange: onPageSizeChange,
    pageSizeLimit: pageSizeLimit
  });
};

var fieldComponents = {
  date: DatePicker,
  mobileNumber: MobileNumber
};

var SearchApplication = function SearchApplication(_ref) {
  var _searchFields$filter, _ref3;

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
    {
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

    var _newParams = _extends({}, searchParams);

    _newParams.delete = [];
    searchFields.forEach(function (e) {
      _newParams.delete.push(e === null || e === void 0 ? void 0 : e.name);
    });
    onSearch(_extends({}, _newParams), true);

    if (type === "mobile") {
      onClose();
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
    }, t("CR_RESET_BUTTON"));
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
    className: "complaint-header",
    style: {
      display: 'flex',
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("h2", null, t("ES_COMMON_SEARCH_BY")), /*#__PURE__*/React.createElement("span", {
    onClick: onClose
  }, /*#__PURE__*/React.createElement(CloseSvg, null))), /*#__PURE__*/React.createElement("div", {
    className: "complaint-input-container",
    style: {
      width: "100%"
    }
  }, searchFields === null || searchFields === void 0 ? void 0 : (_searchFields$filter = searchFields.filter(function (e) {
    return true;
  })) === null || _searchFields$filter === void 0 ? void 0 : _searchFields$filter.map(function (input, index) {
    var _formState$dirtyField, _formState$errors, _formState$errors$inp;

    return /*#__PURE__*/React.createElement("div", {
      key: input.name,
      className: "input-fields"
    }, /*#__PURE__*/React.createElement("span", {
      className: "mobile-input"
    }, /*#__PURE__*/React.createElement(Label, null, t(input.label)), !input.type ? /*#__PURE__*/React.createElement(Controller, {
      render: function render(props) {
        return /*#__PURE__*/React.createElement("div", {
          className: "field-container"
        }, input !== null && input !== void 0 && input.componentInFront ? /*#__PURE__*/React.createElement("span", {
          className: "employee-card-input employee-card-input--front",
          style: {
            flex: "none"
          }
        }, input === null || input === void 0 ? void 0 : input.componentInFront) : null, /*#__PURE__*/React.createElement(TextInput, _extends({}, input, {
          inputRef: register,
          watch: watch,
          shouldUpdate: true
        })));
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
    label: t("CR_SEARCH_BUTTON"),
    submit: true
  }), /*#__PURE__*/React.createElement("div", {
    style: (_ref3 = {
      width: "100%",
      textAlign: "right"
    }, _ref3["width"] = "240px", _ref3["textAlign"] = "right", _ref3.marginLeft = "96px", _ref3.marginTop = "8px", _ref3)
  }, clearAll()))), isInboxPage && /*#__PURE__*/React.createElement("div", {
    className: "inbox-action-container"
  }, type === "desktop" && !mobileView && /*#__PURE__*/React.createElement("span", {
    style: {
      paddingTop: "9px"
    },
    className: "clear-search"
  }, clearAll()), type === "desktop" && !mobileView && /*#__PURE__*/React.createElement(SubmitBar, {
    style: {
      marginTop: "unset"
    },
    className: "submit-bar-search",
    label: t("CR_SEARCH_BUTTON"),
    submit: true
  })))), (type === "mobile" || mobileView) && /*#__PURE__*/React.createElement(ActionBar, {
    className: "clear-search-container"
  }, /*#__PURE__*/React.createElement("button", {
    className: "clear-search",
    style: {
      flex: 1
    }
  }, clearAll(mobileView)), /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CR_SEARCH_BUTTON"),
    style: {
      flex: 1
    },
    submit: true
  }))));
};

var ReceiptsDesktopInbox = function ReceiptsDesktopInbox(_ref) {
  var _props$data;

  var filterComponent = _ref.filterComponent,
      props = _objectWithoutPropertiesLoose(_ref, ["tableConfig", "filterComponent"]);

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var tenantIds = Digit.SessionStorage.get("HRMS_TENANTS");

  var GetCell = function GetCell(value) {
    return /*#__PURE__*/React.createElement("span", {
      className: "cell-text"
    }, t(value));
  };

  var GetDateCell = function GetDateCell(value) {
    var date = new Date(value);
    return /*#__PURE__*/React.createElement("span", {
      className: "cell-text"
    }, date === null || date === void 0 ? void 0 : date.toLocaleDateString());
  };

  var GetSlaCell = function GetSlaCell(value, t, prefix) {
    if (prefix === void 0) {
      prefix = '';
    }

    return value == "CANCELLED" ? /*#__PURE__*/React.createElement("span", {
      className: "sla-cell-error"
    }, t("" + prefix + value) || "") : /*#__PURE__*/React.createElement("span", {
      className: "sla-cell-success"
    }, t("" + prefix + value) || "");
  };

  var data = props === null || props === void 0 ? void 0 : (_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.Payments;

  var _useState = useState(function () {
    var _Digit$ComponentRegis;

    return (_Digit$ComponentRegis = Digit.ComponentRegistryService) === null || _Digit$ComponentRegis === void 0 ? void 0 : _Digit$ComponentRegis.getComponent(filterComponent);
  }),
      FilterComponent = _useState[0];

  var columns = React.useMemo(function () {
    return [{
      Header: t("CR_COMMON_TABLE_COL_RECEIPT_NO"),
      disableSortBy: true,
      Cell: function Cell(_ref2) {
        var _row$original, _row$original$payment, _row$original2, _row$original2$paymen, _row$original3, _row$original3$paymen;

        var row = _ref2.row;
        return /*#__PURE__*/React.createElement("span", {
          className: "link"
        }, /*#__PURE__*/React.createElement(Link, {
          to: "/digit-ui/employee/receipts/details/" + ((_row$original = row.original) === null || _row$original === void 0 ? void 0 : (_row$original$payment = _row$original.paymentDetails[0]) === null || _row$original$payment === void 0 ? void 0 : _row$original$payment.businessService) + "/" + encodeURIComponent((_row$original2 = row.original) === null || _row$original2 === void 0 ? void 0 : (_row$original2$paymen = _row$original2.paymentDetails[0]) === null || _row$original2$paymen === void 0 ? void 0 : _row$original2$paymen.receiptNumber)
        }, (_row$original3 = row.original) === null || _row$original3 === void 0 ? void 0 : (_row$original3$paymen = _row$original3.paymentDetails[0]) === null || _row$original3$paymen === void 0 ? void 0 : _row$original3$paymen.receiptNumber));
      }
    }, {
      Header: t("CR_COMMON_TABLE_COL_DATE"),
      disableSortBy: true,
      Cell: function Cell(_ref3) {
        var _row$original4;

        var row = _ref3.row;
        return GetDateCell((_row$original4 = row.original) === null || _row$original4 === void 0 ? void 0 : _row$original4.transactionDate);
      }
    }, {
      Header: t("CR_COMMON_TABLE_CONSUMERCODE"),
      disableSortBy: true,
      Cell: function Cell(_ref4) {
        var _row$original5, _row$original5$paymen, _row$original5$paymen2;

        var row = _ref4.row;
        return GetCell("" + ((_row$original5 = row.original) === null || _row$original5 === void 0 ? void 0 : (_row$original5$paymen = _row$original5.paymentDetails[0]) === null || _row$original5$paymen === void 0 ? void 0 : (_row$original5$paymen2 = _row$original5$paymen.bill) === null || _row$original5$paymen2 === void 0 ? void 0 : _row$original5$paymen2.consumerCode));
      }
    }, {
      Header: t("CR_COMMON_TABLE_COL_PAYEE_NAME"),
      disableSortBy: true,
      Cell: function Cell(_ref5) {
        var _row$original6;

        var row = _ref5.row;
        return GetCell("" + ((_row$original6 = row.original) === null || _row$original6 === void 0 ? void 0 : _row$original6.payerName));
      }
    }, {
      Header: t("CR_SERVICE_TYPE_LABEL"),
      disableSortBy: true,
      Cell: function Cell(_ref6) {
        var _row$original7, _row$original7$paymen;

        var row = _ref6.row;
        return GetCell("" + t("BILLINGSERVICE_BUSINESSSERVICE_" + ((_row$original7 = row.original) === null || _row$original7 === void 0 ? void 0 : (_row$original7$paymen = _row$original7.paymentDetails[0]) === null || _row$original7$paymen === void 0 ? void 0 : _row$original7$paymen.businessService)));
      }
    }, {
      Header: t("CR_COMMON_TABLE_COL_STATUS"),
      disableSortBy: true,
      Cell: function Cell(_ref7) {
        var _row$original8;

        var row = _ref7.row;
        return GetSlaCell("" + ((_row$original8 = row.original) === null || _row$original8 === void 0 ? void 0 : _row$original8.paymentStatus), t, 'RC_');
      }
    }];
  }, []);
  var result;

  if (props.isLoading) {
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
      columns: columns,
      getCellProps: function getCellProps(cellInfo) {
        return {
          style: {
            maxWidth: cellInfo.column.Header === t("HR_EMP_ID_LABEL") ? "140px" : "",
            padding: "20px 18px",
            fontSize: "16px"
          }
        };
      },
      onPageSizeChange: props.onPageSizeChange,
      currentPage: props.currentPage,
      onNextPage: props.onNextPage,
      onPrevPage: props.onPrevPage,
      onLastPage: props.onLastPage,
      onFirstPage: props.onFirstPage,
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
      text: "CR_COMMON_DASHBOARD_HEADER",
      link: "/digit-ui/employee/receipts/inprogress",
      businessService: "receipts",
      roles: ["CR_PT"]
    }, {
      text: "CR_COMMON_REPORTS_HEADER",
      link: "/digit-ui/employee/receipts/inprogress",
      businessService: "receipts",
      roles: ["CR_PT"]
    }],
    headerText: t("ACTION_TEST_RECEIPTS"),
    businessService: props.businessService
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FilterComponent, {
    defaultSearchParams: props.defaultSearchParams,
    onFilterChange: props.onFilterChange,
    searchParams: props.searchParams,
    type: "desktop",
    tenantIds: tenantIds
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SearchApplication, {
    defaultSearchParams: props.defaultSearchParams,
    onSearch: props.onSearch,
    type: "desktop",
    tenantIds: tenantIds,
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
      defaultSearchParams = _ref.defaultSearchParams;

  var _useState = useState(isSearch ? "SEARCH" : ""),
      type = _useState[0],
      setType = _useState[1];

  var _useState2 = useState(isSearch ? true : false),
      popup = _useState2[0],
      setPopup = _useState2[1];

  var _useState3 = useState(searchParams),
      setParams = _useState3[1];

  var _useState4 = useState(sortParams),
      setSortParams = _useState4[1];

  useEffect(function () {
    if (type) setPopup(true);
  }, [type]);
  var DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;

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
      linkPrefix: linkPrefix ? linkPrefix : DSO ? "/digit-ui/employee/fsm/application-details/" : "/digit-ui/employee/fsm/"
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
  })), result, popup && /*#__PURE__*/React.createElement(PopUp, null, type === "FILTER" && /*#__PURE__*/React.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React.createElement(ReceiptsFilter, {
    defaultSearchParams: defaultSearchParams,
    onFilterChange: onFilterChange,
    searchParams: searchParams,
    type: "mobile",
    onClose: handlePopupClose
  })), type === "SEARCH" && /*#__PURE__*/React.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React.createElement(SearchApplication, {
    type: "mobile",
    onClose: handlePopupClose,
    onSearch: onSearch,
    isFstpOperator: isFstpOperator,
    searchParams: searchParams,
    searchFields: searchFields
  }))));
};

var GetDateCell = function GetDateCell(value) {
  var date = new Date(value);
  return /*#__PURE__*/React.createElement("span", {
    className: "sla-cell"
  }, date === null || date === void 0 ? void 0 : date.toLocaleDateString());
};

var GetCell = function GetCell(value) {
  return /*#__PURE__*/React.createElement("span", {
    className: "sla-cell"
  }, value);
};

var ReceiptsMobileInbox = function ReceiptsMobileInbox(_ref) {
  var data = _ref.data,
      isLoading = _ref.isLoading,
      isSearch = _ref.isSearch,
      searchFields = _ref.searchFields,
      onFilterChange = _ref.onFilterChange,
      onSearch = _ref.onSearch,
      onSort = _ref.onSort,
      searchParams = _ref.searchParams,
      sortParams = _ref.sortParams,
      linkPrefix = _ref.linkPrefix,
      filterComponent = _ref.filterComponent,
      defaultSearchParams = _ref.defaultSearchParams;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var getData = function getData() {
    var _data$Payments;

    return data === null || data === void 0 ? void 0 : (_data$Payments = data.Payments) === null || _data$Payments === void 0 ? void 0 : _data$Payments.map(function (original) {
      var _original$paymentDeta, _original$paymentDeta2, _original$paymentDeta3, _original$paymentDeta4, _ref2;

      return _ref2 = {}, _ref2[t("CR_COMMON_TABLE_COL_RECEIPT_NO")] = original === null || original === void 0 ? void 0 : (_original$paymentDeta = original.paymentDetails[0]) === null || _original$paymentDeta === void 0 ? void 0 : _original$paymentDeta.receiptNumber, _ref2[t("CR_COMMON_TABLE_COL_DATE")] = GetDateCell((original === null || original === void 0 ? void 0 : original.transactionDate) || ""), _ref2[t("CR_COMMON_TABLE_CONSUMERCODE")] = GetCell((original === null || original === void 0 ? void 0 : (_original$paymentDeta2 = original.paymentDetails[0]) === null || _original$paymentDeta2 === void 0 ? void 0 : (_original$paymentDeta3 = _original$paymentDeta2.bill) === null || _original$paymentDeta3 === void 0 ? void 0 : _original$paymentDeta3.consumerCode) || ""), _ref2[t("CR_COMMON_TABLE_COL_PAYEE_NAME")] = GetCell(original === null || original === void 0 ? void 0 : original.payerName), _ref2[t("CR_SERVICE_TYPE_LABEL")] = GetCell(t("BILLINGSERVICE_BUSINESSSERVICE_" + (original === null || original === void 0 ? void 0 : (_original$paymentDeta4 = original.paymentDetails[0]) === null || _original$paymentDeta4 === void 0 ? void 0 : _original$paymentDeta4.businessService))), _ref2[t("CR_COMMON_TABLE_COL_STATUS")] = GetCell(t("RC_" + (original === null || original === void 0 ? void 0 : original.paymentStatus))), _ref2;
    });
  };

  var serviceRequestIdKey = function serviceRequestIdKey(original) {
    return (searchParams === null || searchParams === void 0 ? void 0 : searchParams.businessServices) + "/" + encodeURIComponent(original === null || original === void 0 ? void 0 : original[t("CR_COMMON_TABLE_COL_RECEIPT_NO")]);
  };

  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "inbox-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filters-container"
  }, /*#__PURE__*/React.createElement(ApplicationCard, {
    t: t,
    data: getData(),
    onFilterChange: onFilterChange,
    isLoading: isLoading,
    isSearch: isSearch,
    onSearch: onSearch,
    onSort: onSort,
    defaultSearchParams: defaultSearchParams,
    searchParams: searchParams,
    searchFields: searchFields,
    linkPrefix: linkPrefix,
    sortParams: sortParams,
    filterComponent: filterComponent,
    serviceRequestIdKey: serviceRequestIdKey
  }))));
};

var ReceiptInbox = function ReceiptInbox(_ref) {
  var _sortParams$, _sortParams$2;

  var parentRoute = _ref.parentRoute,
      _ref$businessService = _ref.businessService,
      businessService = _ref$businessService === void 0 ? "receipts" : _ref$businessService,
      _ref$initialStates = _ref.initialStates,
      initialStates = _ref$initialStates === void 0 ? {} : _ref$initialStates,
      filterComponent = _ref.filterComponent,
      isInbox = _ref.isInbox;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var isupdate = Digit.SessionStorage.get("isupdate");

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

  var _useState4 = useState(0),
      totalRecords = _useState4[0],
      setTotalRecords = _useState4[1];

  var _useState5 = useState(function () {
    return initialStates.searchParams || {};
  }),
      searchParams = _useState5[0],
      setSearchParams = _useState5[1];

  var _Digit$Hooks$receipts = Digit.Hooks.receipts.useReceiptsSearch(_extends({}, searchParams, {
    isCountRequest: true
  }), tenantId, [], isupdate),
      countData = _Digit$Hooks$receipts.data,
      rest1 = _objectWithoutPropertiesLoose(_Digit$Hooks$receipts, ["isLoading", "data"]);

  var isMobile = window.Digit.Utils.browser.isMobile();
  var paginationParams = isMobile ? {
    limit: 100,
    offset: pageOffset,
    sortOrder: sortParams !== null && sortParams !== void 0 && (_sortParams$ = sortParams[0]) !== null && _sortParams$ !== void 0 && _sortParams$.desc ? "DESC" : "ASC"
  } : {
    limit: pageSize,
    offset: pageOffset,
    sortOrder: sortParams !== null && sortParams !== void 0 && (_sortParams$2 = sortParams[0]) !== null && _sortParams$2 !== void 0 && _sortParams$2.desc ? "DESC" : "ASC"
  };

  var _Digit$Hooks$receipts2 = Digit.Hooks.receipts.useReceiptsSearch(searchParams, tenantId, paginationParams, isupdate),
      hookLoading = _Digit$Hooks$receipts2.isLoading,
      data = _Digit$Hooks$receipts2.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$receipts2, ["isLoading", "isError", "error", "data"]);
  useEffect(function () {
    return function () {
      rest === null || rest === void 0 ? void 0 : rest.revalidate();
    };
  }, []);
  useEffect(function () {
    setTotalRecords(countData === null || countData === void 0 ? void 0 : countData.Count);
  }, [countData]);
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

  var fetchLastPage = function fetchLastPage() {
    setPageOffset(function (prevState) {
      return (countData === null || countData === void 0 ? void 0 : countData.Count) && Math.ceil((countData === null || countData === void 0 ? void 0 : countData.Count) / 10) * 10 - pageSize;
    });
  };

  var fetchFirstPage = function fetchFirstPage() {
    setPageOffset(function (prevState) {
      return 0;
    });
  };

  var handleFilterChange = function handleFilterChange(filterParam, reset) {
    if (reset === void 0) {
      reset = false;
    }

    if (!reset) {
      var keys_to_delete = filterParam.delete;

      var _new = _extends({}, searchParams, filterParam);

      if (keys_to_delete) keys_to_delete.forEach(function (key) {
        return delete _new[key];
      });
      delete _new.delete;
      setSearchParams(_extends({}, _new));
    } else {
      setSearchParams(_extends({}, initialStates.searchParams));
    }
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
      label: t("CR_CONSUMER_NO_LABEL"),
      name: "consumerCodes"
    }, {
      label: t("CR_RECEPIT_NO_LABEL"),
      name: "receiptNumbers"
    }, {
      label: t("CR_MOBILE_NO_LABEL"),
      name: "mobileNumber",
      maxlength: 10,
      pattern: "[6-9][0-9]{9}",
      title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
      componentInFront: "+91"
    }];
  };

  if ((data === null || data === void 0 ? void 0 : data.length) !== null) {
    if (isMobile) {
      return /*#__PURE__*/React.createElement(ReceiptsMobileInbox, {
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
        totalRecords: totalRecords,
        linkPrefix: '/digit-ui/employee/receipts/details/',
        filterComponent: filterComponent
      });
    } else {
      return /*#__PURE__*/React.createElement("div", null, isInbox && /*#__PURE__*/React.createElement(Header, null, t("CR_SEARCH_COMMON_HEADER")), /*#__PURE__*/React.createElement(ReceiptsDesktopInbox, {
        businessService: businessService,
        data: data,
        isLoading: hookLoading,
        defaultSearchParams: initialStates.searchParams,
        isSearch: !isInbox,
        onFilterChange: handleFilterChange,
        searchFields: getSearchFields(),
        onSearch: handleFilterChange,
        onSort: handleSort,
        onNextPage: fetchNextPage,
        onPrevPage: fetchPrevPage,
        onLastPage: fetchLastPage,
        onFirstPage: fetchFirstPage,
        currentPage: Math.floor(pageOffset / pageSize),
        pageSizeLimit: pageSize,
        disableSort: false,
        onPageSizeChange: handlePageSizeChange,
        parentRoute: parentRoute,
        searchParams: searchParams,
        sortParams: sortParams,
        totalRecords: totalRecords,
        filterComponent: filterComponent
      }));
    }
  }
};

var ReceiptsCard = function ReceiptsCard() {
  if (!Digit.Utils.receiptsAccess()) {
    return null;
  }

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var searchParams = {
    tenantId: tenantId,
    businessServices: getDefaultReceiptService(),
    isCountRequest: true
  };

  var _Digit$Hooks$receipts = Digit.Hooks.receipts.useReceiptsSearch(searchParams, tenantId, [], false),
      isLoading = _Digit$Hooks$receipts.isLoading,
      data = _Digit$Hooks$receipts.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$receipts, ["isLoading", "isError", "error", "data"]);

  var propsForModuleCard = {
    Icon: /*#__PURE__*/React.createElement(ReceiptIcon, null),
    moduleName: t("ACTION_TEST_RECEIPTS"),
    kpis: [{
      count: isLoading ? "-" : data === null || data === void 0 ? void 0 : data.Count,
      label: t("CR_TOTAL_RECEIPTS"),
      link: "/digit-ui/employee/receipts/inbox"
    }],
    links: [{
      count: isLoading ? "-" : data === null || data === void 0 ? void 0 : data.Count,
      label: t("CR_SEARCH_COMMON_HEADER"),
      link: "/digit-ui/employee/receipts/inbox"
    }]
  };
  return /*#__PURE__*/React.createElement(EmployeeModuleCard, propsForModuleCard);
};

var ReceiptsModule = function ReceiptsModule(_ref) {
  var _state$common;

  var stateCode = _ref.stateCode,
      userType = _ref.userType;
  var moduleCode = "RECEIPTS";
  var state = useSelector(function (state) {
    return state;
  });
  var language = state === null || state === void 0 ? void 0 : (_state$common = state.common) === null || _state$common === void 0 ? void 0 : _state$common.selectedLanguage;

  var _Digit$Services$useSt = Digit.Services.useStore({
    stateCode: stateCode,
    moduleCode: moduleCode,
    language: language
  });

  var mobileView = innerWidth <= 640;
  var location = useLocation();

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var inboxInitialState = {
    searchParams: {
      tenantId: tenantId,
      businessServices: getDefaultReceiptService()
    }
  };

  var _useRouteMatch = useRouteMatch(),
      path = _useRouteMatch.path;

  if (userType === "employee") {
    return /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "ground-container"
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
    }, t("ES_COMMON_HOME")), " ", "/ ", /*#__PURE__*/React.createElement("span", null, location.pathname === "/digit-ui/employee/receipts/inbox" ? t("CR_COMMON_HEADER") : t("CR_COMMON_HEADER"))), /*#__PURE__*/React.createElement(PrivateRoute, {
      path: path + "/inbox",
      component: function component() {
        return /*#__PURE__*/React.createElement(ReceiptInbox, {
          parentRoute: path,
          businessService: "receipts",
          filterComponent: "RECEIPTS_INBOX_FILTER",
          initialStates: inboxInitialState,
          isInbox: true
        });
      }
    }), /*#__PURE__*/React.createElement(PrivateRoute, {
      path: path + "/inprogress",
      component: function component(props) {
        return /*#__PURE__*/React.createElement("h2", null, t("CR_RECEIPTS_SCREENS_UNDER_CONSTRUCTION"));
      }
    }), /*#__PURE__*/React.createElement(PrivateRoute, {
      path: path + "/response",
      component: function component(props) {
        return /*#__PURE__*/React.createElement(ReceiptAcknowledgement, _extends({}, props, {
          parentRoute: path
        }));
      }
    }), /*#__PURE__*/React.createElement(PrivateRoute, {
      path: path + "/details/:service/:id",
      component: function component() {
        return /*#__PURE__*/React.createElement(ReceiptDetails, null);
      }
    }))));
  } else return null;
};
var componentsToRegister = {
  ReceiptsModule: ReceiptsModule,
  ReceiptsCard: ReceiptsCard,
  ActionModal: ActionModal,
  Banner: Banner,
  RECEIPTS_INBOX_FILTER: function RECEIPTS_INBOX_FILTER(props) {
    return /*#__PURE__*/React.createElement(ReceiptsFilter, props);
  }
};
var initReceiptsComponents = function initReceiptsComponents() {
  Object.entries(componentsToRegister).forEach(function (_ref2) {
    var key = _ref2[0],
        value = _ref2[1];
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

export { ReceiptsModule, initReceiptsComponents };
//# sourceMappingURL=index.modern.js.map
