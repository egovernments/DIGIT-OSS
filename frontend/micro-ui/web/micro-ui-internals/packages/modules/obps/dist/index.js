function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactI18next = require('react-i18next');
var reactRouterDom = require('react-router-dom');
var digitUiReactComponents = require('@egovernments/digit-ui-react-components');
var reactQuery = require('react-query');
require('react-dom');

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

var newConfig = [{
  head: "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT",
  body: [{
    route: "docs-required",
    component: "DocsRequired",
    key: "data",
    nextStep: "basic-details"
  }, {
    route: "basic-details",
    component: "BasicDetails",
    key: "data",
    nextStep: "plot-details"
  }, {
    route: "plot-details",
    component: "PlotDetails",
    key: "data",
    nextStep: "scrutiny-details",
    texts: {
      headerCaption: "BPA_SCRUTINY_DETAILS",
      header: "BPA_PLOT_DETAILS_TITLE",
      cardText: "",
      submitBarLabel: "CS_COMMON_NEXT",
      skipAndContinueText: ""
    },
    inputs: [{
      label: "BPA_BOUNDARY_HOLDING_NO_LABEL",
      type: "text",
      validation: {
        required: true
      },
      name: "holdingNumber"
    }, {
      label: "BPA_BOUNDARY_LAND_REG_DETAIL_LABEL",
      type: "text",
      validation: {
        required: true
      },
      name: "registrationDetails"
    }]
  }, {
    route: "scrutiny-details",
    component: "ScrutinyDetails",
    nextStep: "location",
    hideInEmployee: true,
    key: "subOccupancy",
    texts: {
      headerCaption: "BPA_STEPPER_SCRUTINY_DETAILS_HEADER",
      header: "BPA_STEPPER_SCRUTINY_DETAILS_HEADER",
      cardText: "",
      submitBarLabel: "next",
      skipAndContinueText: ""
    }
  }, {
    route: "location",
    component: "LocationDetails",
    nextStep: "owner-details",
    hideInEmployee: true,
    key: "address",
    texts: {
      headerCaption: "BPA_STEPPER_SCRUTINY_DETAILS_HEADER",
      header: "BPA_NEW_TRADE_DETAILS_HEADER_DETAILS",
      cardText: "",
      submitBarLabel: "next",
      skipAndContinueText: ""
    }
  }, {
    route: "owner-details",
    component: "OwnerDetails",
    nextStep: "document-details",
    key: "owners",
    texts: {
      headerCaption: "BPA_OWNER_AND_DOCUMENT_DETAILS_LABEL",
      header: "BPA_APPLICANT_DETAILS_HEADER",
      submitBarLabel: "CS_COMMON_NEXT"
    }
  }, {
    route: "document-details",
    component: "DocumentDetails",
    nextStep: "noc-details",
    key: "documents",
    texts: {
      headerCaption: "BPA_OWNER_AND_DOCUMENT_DETAILS_LABEL",
      header: "BPA_DOCUMENT_DETAILS_LABEL",
      submitBarLabel: "CS_COMMON_NEXT"
    }
  }, {
    route: "noc-details",
    component: "NOCDetails",
    nextStep: null,
    key: "nocDocuments",
    texts: {
      headerCaption: "BPA_NOC_DETAILS_SUMMARY",
      header: "",
      submitBarLabel: "CS_COMMON_NEXT"
    }
  }]
}];

var actions = ['BPA_STEPPER_SCRUTINY_DETAILS_HEADER', 'BPA_OWNER_AND_DOCUMENT_DETAILS_LABEL', 'BPA_NOC_DETAILS_SUMMARY', 'BPA_STEPPER_SUMMARY_HEADER'];

var Timeline = function Timeline(_ref) {
  var _ref$currentStep = _ref.currentStep,
      currentStep = _ref$currentStep === void 0 ? 1 : _ref$currentStep;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React__default.createElement("div", {
    className: "timeline-container"
  }, actions.map(function (action, index, arr) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "timeline-checkpoint",
      key: index
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "timeline-content"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "circle " + (index <= currentStep - 1 && 'active')
    }, index + 1), /*#__PURE__*/React__default.createElement("span", {
      className: "secondary-color"
    }, t(action))), index < arr.length - 1 && /*#__PURE__*/React__default.createElement("span", {
      className: "line " + (index < currentStep - 1 && 'active')
    }));
  }));
};

var getPattern = function getPattern(type) {
  switch (type) {
    case "Name":
      return /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i;
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
var uuidv4 = function uuidv4() {
  return require("uuid/v4")();
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
var convertToNocObject = function convertToNocObject(data, datafromflow) {
  var _datafromflow$nocDocu;

  var formData = {
    Noc: data
  };
  var doc = datafromflow === null || datafromflow === void 0 ? void 0 : (_datafromflow$nocDocu = datafromflow.nocDocuments) === null || _datafromflow$nocDocu === void 0 ? void 0 : _datafromflow$nocDocu.nocDocuments.filter(function (n) {
    return n.documentType.includes(data.nocType.split("_")[0]);
  }).map(function (noc) {
    return {
      "fileName": (noc === null || noc === void 0 ? void 0 : noc.fileName) || "",
      "name": (noc === null || noc === void 0 ? void 0 : noc.name) || "",
      "fileStoreId": noc === null || noc === void 0 ? void 0 : noc.fileStoreId,
      "fileUrl": "",
      "isClickable": true,
      "link": "",
      "title": noc === null || noc === void 0 ? void 0 : noc.documentType,
      "documentType": noc === null || noc === void 0 ? void 0 : noc.documentType,
      "additionalDetails": {}
    };
  });
  formData.Noc.documents = doc;
  return formData;
};
var getDocumentforBPA = function getDocumentforBPA(docs) {
  var document = [];
  docs && docs.map(function (ob) {
    document.push({
      "documentType": ob.documentType,
      "fileStoreId": ob.fileStoreId,
      "fileStore": ob.fileStoreId,
      "fileName": "",
      "fileUrl": "",
      "additionalDetails": {}
    });
  });
  return document;
};
var getunitforBPA = function getunitforBPA(units) {
  var unit = [];
  units && units.map(function (ob, index) {
    unit.push({
      "blockIndex": index,
      "usageCategory": ob.usageCategory,
      "floorNo": ob.floorNo,
      "unitType": ob.unitType,
      "id": ob.id
    });
  });
  return unit;
};
var convertToBPAObject = function convertToBPAObject(data) {
  var _data$landInfo, _data$landInfo$addres, _data$landInfo$addres2, _data$landInfo2, _data$documents;

  data.landInfo.owners.map(function (owner, index) {
    var _owner$gender;

    data.landInfo.owners[index].gender = owner === null || owner === void 0 ? void 0 : (_owner$gender = owner.gender) === null || _owner$gender === void 0 ? void 0 : _owner$gender.code;
  });
  data.landInfo.address.city = data === null || data === void 0 ? void 0 : (_data$landInfo = data.landInfo) === null || _data$landInfo === void 0 ? void 0 : (_data$landInfo$addres = _data$landInfo.address) === null || _data$landInfo$addres === void 0 ? void 0 : (_data$landInfo$addres2 = _data$landInfo$addres.city) === null || _data$landInfo$addres2 === void 0 ? void 0 : _data$landInfo$addres2.code;
  data.landInfo.unit = getunitforBPA(data === null || data === void 0 ? void 0 : (_data$landInfo2 = data.landInfo) === null || _data$landInfo2 === void 0 ? void 0 : _data$landInfo2.unit);
  var formData = {
    "BPA": {
      "id": data === null || data === void 0 ? void 0 : data.id,
      "applicationNo": data === null || data === void 0 ? void 0 : data.applicationNo,
      "approvalNo": data === null || data === void 0 ? void 0 : data.approvalNo,
      "accountId": data === null || data === void 0 ? void 0 : data.accountId,
      "edcrNumber": data === null || data === void 0 ? void 0 : data.edcrNumber,
      "riskType": data === null || data === void 0 ? void 0 : data.riskType,
      "businessService": data === null || data === void 0 ? void 0 : data.businessService,
      "landId": data === null || data === void 0 ? void 0 : data.landId,
      "tenantId": data === null || data === void 0 ? void 0 : data.tenantId,
      "approvalDate": data === null || data === void 0 ? void 0 : data.approvalDate,
      "applicationDate": data === null || data === void 0 ? void 0 : data.applicationDate,
      "status": "INITIATED",
      "documents": getDocumentforBPA(data === null || data === void 0 ? void 0 : (_data$documents = data.documents) === null || _data$documents === void 0 ? void 0 : _data$documents.documents),
      "landInfo": data === null || data === void 0 ? void 0 : data.landInfo,
      "workflow": {
        "action": "SEND_TO_CITIZEN",
        "assignes": null,
        "comments": null,
        "varificationDocuments": null
      },
      "auditDetails": data === null || data === void 0 ? void 0 : data.auditDetails,
      "additionalDetails": null,
      "applicationType": "BUILDING_PLAN_SCRUTINY",
      "serviceType": "NEW_CONSTRUCTION",
      "occupancyType": "A"
    }
  };
  return formData;
};

var PDFSvg = function PDFSvg(_ref) {
  var _ref$width = _ref.width,
      width = _ref$width === void 0 ? 20 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === void 0 ? 20 : _ref$height,
      style = _ref.style;
  return /*#__PURE__*/React__default.createElement("svg", {
    style: style,
    xmlns: "http://www.w3.org/2000/svg",
    width: width,
    height: height,
    viewBox: "0 0 20 20",
    fill: "gray"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"
  }));
};

function OBPSDocument(_ref2) {
  var _ref2$value = _ref2.value,
      value = _ref2$value === void 0 ? {} : _ref2$value,
      Code = _ref2.Code,
      index = _ref2.index;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _Digit$Hooks$obps$use = Digit.Hooks.obps.useOBPSDocumentSearch({
    value: value
  }, {
    value: value
  }, Code, index),
      isLoading = _Digit$Hooks$obps$use.isLoading,
      data = _Digit$Hooks$obps$use.data;

  var documents = [];

  if (Code == "NOC") {
    var _value$nocDocuments;

    documents.push(value === null || value === void 0 ? void 0 : (_value$nocDocuments = value.nocDocuments) === null || _value$nocDocuments === void 0 ? void 0 : _value$nocDocuments.nocDocuments[index]);
  } else {
    var _value$documents;

    value === null || value === void 0 ? void 0 : (_value$documents = value.documents) === null || _value$documents === void 0 ? void 0 : _value$documents.documents.filter(function (doc) {
      return doc.documentType.includes(Code);
    }).map(function (ob) {
      documents.push(ob);
    });
  }

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      marginTop: "19px"
    }
  }, /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, documents === null || documents === void 0 ? void 0 : documents.map(function (document, index) {
    var documentLink = pdfDownloadLink(data.pdfFiles, document === null || document === void 0 ? void 0 : document.fileStoreId);
    return /*#__PURE__*/React__default.createElement("a", {
      target: "_",
      href: documentLink,
      style: {
        minWidth: "100px",
        marginRight: "10px"
      },
      key: index
    }, /*#__PURE__*/React__default.createElement(PDFSvg, {
      width: 85,
      height: 100,
      style: {
        background: "#f6f6f6",
        padding: "8px"
      }
    }), /*#__PURE__*/React__default.createElement("p", {
      style: {
        marginTop: "8px",
        textAlign: "center"
      }
    }, t("BPA_" + (document === null || document === void 0 ? void 0 : document.documentType) + "_LABEL")));
  }))));
}

var CheckPage = function CheckPage(_ref) {
  var _value$data, _datafromAPI$planDeta, _datafromAPI$planDeta2, _datafromAPI$planDeta3, _datafromAPI$planDeta4, _datafromAPI$planDeta5, _datafromAPI$planDeta6, _data$scrutinyNumber, _datafromAPI$planDeta7, _datafromAPI$planDeta8, _datafromAPI$planDeta9, _datafromAPI$planDeta10, _datafromAPI$planDeta11, _datafromAPI$planDeta12, _datafromAPI$planDeta13, _datafromAPI$planDeta14, _datafromAPI$planDeta15, _datafromAPI$planDeta16, _datafromAPI$planDeta17, _datafromAPI$planDeta18, _datafromAPI$planDeta19, _datafromAPI$planDeta20, _datafromAPI$planDeta21, _address$city, _address$locality, _paymentDetails$Bill$, _paymentDetails$Bill$2, _paymentDetails$Bill, _paymentDetails$Bill$3, _paymentDetails$Bill$4;

  var onSubmit = _ref.onSubmit,
      value = _ref.value;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();
  var match = reactRouterDom.useRouteMatch();
  var user = Digit.UserService.getUser();
  var tenantId = user.info.permanentCity;
  var BusinessService;
  if (value.businessService === "BPA_LOW") BusinessService = "BPA.LOW_RISK_PERMIT_FEE";else if (value.businessService === "BPA") BusinessService = "BPA.NC_SAN_FEE";
  var data = value.data,
      address = value.address,
      owners = value.owners,
      nocDocuments = value.nocDocuments;

  var _Digit$Hooks$obps$use = Digit.Hooks.obps.useScrutinyDetails(tenantId, value === null || value === void 0 ? void 0 : (_value$data = value.data) === null || _value$data === void 0 ? void 0 : _value$data.scrutinyNumber, {
    enabled: true
  }),
      datafromAPI = _Digit$Hooks$obps$use.data;

  var consumerCode = value === null || value === void 0 ? void 0 : value.applicationNo;
  var fetchBillParams = {
    consumerCode: consumerCode
  };

  var _Digit$Hooks$useFetch = Digit.Hooks.useFetchBillsForBuissnessService(_extends({
    businessService: BusinessService
  }, fetchBillParams, {
    tenantId: tenantId
  }), {
    enabled: consumerCode ? true : false,
    retry: false
  }),
      paymentDetails = _Digit$Hooks$useFetch.data;

  var routeLink = "/digit-ui/citizen/obps/new-building-permit";
  var tableHeader = [{
    name: "BPA_TABLE_COL_FLOOR",
    id: "Floor"
  }, {
    name: "BPA_TABLE_COL_LEVEL",
    id: "Level"
  }, {
    name: "BPA_TABLE_COL_OCCUPANCY",
    id: "Occupancy"
  }, {
    name: "BPA_TABLE_COL_BUILDUPAREA",
    id: "BuildupArea"
  }, {
    name: "BPA_TABLE_COL_FLOORAREA",
    id: "FloorArea"
  }, {
    name: "BPA_TABLE_COL_CARPETAREA",
    id: "CarpetArea"
  }];

  var accessData = function accessData(plot) {
    var name = plot;
    return function (originalRow, rowIndex, columns) {
      return originalRow[name];
    };
  };

  var tableColumns = React.useMemo(function () {
    return tableHeader.map(function (ob) {
      return {
        Header: t("" + ob.name),
        accessor: accessData(ob.id),
        id: ob.id
      };
    });
  });

  function getFloorData(block) {
    var _block$building;

    var floors = [];
    block === null || block === void 0 ? void 0 : (_block$building = block.building) === null || _block$building === void 0 ? void 0 : _block$building.floors.map(function (ob) {
      var _ob$occupancies, _ob$occupancies$, _ob$occupancies2, _ob$occupancies2$, _ob$occupancies3, _ob$occupancies3$, _ob$occupancies4, _ob$occupancies4$;

      floors.push({
        Floor: t("BPA_FLOOR_NAME_" + ob.number),
        Level: ob.number,
        Occupancy: t("" + ((_ob$occupancies = ob.occupancies) === null || _ob$occupancies === void 0 ? void 0 : (_ob$occupancies$ = _ob$occupancies[0]) === null || _ob$occupancies$ === void 0 ? void 0 : _ob$occupancies$.type)),
        BuildupArea: (_ob$occupancies2 = ob.occupancies) === null || _ob$occupancies2 === void 0 ? void 0 : (_ob$occupancies2$ = _ob$occupancies2[0]) === null || _ob$occupancies2$ === void 0 ? void 0 : _ob$occupancies2$.builtUpArea,
        FloorArea: ((_ob$occupancies3 = ob.occupancies) === null || _ob$occupancies3 === void 0 ? void 0 : (_ob$occupancies3$ = _ob$occupancies3[0]) === null || _ob$occupancies3$ === void 0 ? void 0 : _ob$occupancies3$.floorArea) || 0,
        CarpetArea: ((_ob$occupancies4 = ob.occupancies) === null || _ob$occupancies4 === void 0 ? void 0 : (_ob$occupancies4$ = _ob$occupancies4[0]) === null || _ob$occupancies4$ === void 0 ? void 0 : _ob$occupancies4$.CarpetArea) || 0,
        key: t("BPA_FLOOR_NAME_" + ob.number)
      });
    });
    return floors;
  }

  function routeTo(jumpTo) {
    location.href = jumpTo;
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Timeline, {
    currentStep: 4
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, null, t("BPA_STEPPER_SUMMARY_HEADER")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("BPA_BASIC_DETAILS_TITLE")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_APP_DATE_LABEL"),
    text: data === null || data === void 0 ? void 0 : data.applicationDate
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"),
    text: t("WF_BPA_" + (data === null || data === void 0 ? void 0 : data.appliactionType))
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"),
    text: t(data === null || data === void 0 ? void 0 : data.serviceType)
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_OCCUPANCY_LABEL"),
    text: data === null || data === void 0 ? void 0 : data.occupancyType
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_RISK_TYPE_LABEL"),
    text: t("WF_BPA_" + (data === null || data === void 0 ? void 0 : data.riskType))
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL"),
    text: data === null || data === void 0 ? void 0 : data.applicantName
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_SPECIAL_CATEGORY_LABEL"),
    text: 'None'
  }))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("BPA_PLOT_DETAILS_TITLE")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
      style: {
        marginTop: "-10px",
        float: "right",
        position: "relative",
        bottom: "32px"
      },
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M9.126 5.125L11.063 3.188L14.81 6.935L12.873 8.873L9.126 5.125ZM17.71 2.63L15.37 0.289999C15.1826 0.103748 14.9292 -0.000793457 14.665 -0.000793457C14.4008 -0.000793457 14.1474 0.103748 13.96 0.289999L12.13 2.12L15.88 5.87L17.71 4C17.8844 3.81454 17.9815 3.56956 17.9815 3.315C17.9815 3.06044 17.8844 2.81546 17.71 2.63ZM5.63 8.63L0 14.25V18H3.75L9.38 12.38L12.873 8.873L9.126 5.125L5.63 8.63Z",
      fill: "#F47738"
    })))),
    style: {
      width: "100px",
      display: "inline"
    },
    onClick: function onClick() {
      return routeTo(routeLink + "/plot-details");
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BOUNDARY_PLOT_AREA_LABEL"),
    text: datafromAPI === null || datafromAPI === void 0 ? void 0 : (_datafromAPI$planDeta = datafromAPI.planDetail) === null || _datafromAPI$planDeta === void 0 ? void 0 : (_datafromAPI$planDeta2 = _datafromAPI$planDeta.planInformation) === null || _datafromAPI$planDeta2 === void 0 ? void 0 : _datafromAPI$planDeta2.plotArea
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BOUNDARY_PLOT_NO_LABEL"),
    text: datafromAPI === null || datafromAPI === void 0 ? void 0 : (_datafromAPI$planDeta3 = datafromAPI.planDetail) === null || _datafromAPI$planDeta3 === void 0 ? void 0 : (_datafromAPI$planDeta4 = _datafromAPI$planDeta3.planInformation) === null || _datafromAPI$planDeta4 === void 0 ? void 0 : _datafromAPI$planDeta4.plotNo
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BOUNDARY_KHATA_NO_LABEL"),
    text: datafromAPI === null || datafromAPI === void 0 ? void 0 : (_datafromAPI$planDeta5 = datafromAPI.planDetail) === null || _datafromAPI$planDeta5 === void 0 ? void 0 : (_datafromAPI$planDeta6 = _datafromAPI$planDeta5.planInformation) === null || _datafromAPI$planDeta6 === void 0 ? void 0 : _datafromAPI$planDeta6.khataNo
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("Holding Number"),
    text: data === null || data === void 0 ? void 0 : data.holdingNumber
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("Land Registration details"),
    text: data === null || data === void 0 ? void 0 : data.registrationDetails
  }))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("BPA_STEPPER_SCRUTINY_DETAILS_HEADER")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("BPA_EDCR_DETAILS")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, {
    style: {
      border: "none"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_EDCR_NO_LABEL",
    text: data === null || data === void 0 ? void 0 : (_data$scrutinyNumber = data.scrutinyNumber) === null || _data$scrutinyNumber === void 0 ? void 0 : _data$scrutinyNumber.edcrNumber
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_UPLOADED_PLAN_DIAGRAM"
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
      style: {
        background: "#f6f6f6",
        padding: "8px"
      },
      xmlns: "http://www.w3.org/2000/svg",
      width: 85,
      height: 100,
      viewBox: "0 0 20 20",
      fill: "gray"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"
    })))),
    onClick: function onClick() {
      return routeTo(datafromAPI === null || datafromAPI === void 0 ? void 0 : datafromAPI.updatedDxfFile);
    }
  }), /*#__PURE__*/React__default.createElement("p", {
    style: {
      marginTop: "8px",
      textAlign: "Left"
    }
  }, t("Uploaded Plan.DXF")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_SCRUNTINY_REPORT_OUTPUT"
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
      style: {
        background: "#f6f6f6",
        padding: "8px"
      },
      xmlns: "http://www.w3.org/2000/svg",
      width: 85,
      height: 100,
      viewBox: "0 0 20 20",
      fill: "gray"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"
    })))),
    onClick: function onClick() {
      return routeTo(datafromAPI === null || datafromAPI === void 0 ? void 0 : datafromAPI.planReport);
    }
  }), /*#__PURE__*/React__default.createElement("p", {
    style: {
      marginTop: "8px",
      textAlign: "Left"
    }
  }, t("Scrutiny Report.PDF"))), /*#__PURE__*/React__default.createElement("hr", {
    style: {
      color: "#cccccc",
      backgroundColor: "#cccccc",
      height: "2px",
      marginTop: "20px",
      marginBottom: "20px"
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("BPA_BUILDING_EXTRACT_HEADER")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_BUILTUP_AREA_HEADER",
    text: datafromAPI === null || datafromAPI === void 0 ? void 0 : (_datafromAPI$planDeta7 = datafromAPI.planDetail) === null || _datafromAPI$planDeta7 === void 0 ? void 0 : (_datafromAPI$planDeta8 = _datafromAPI$planDeta7.blocks) === null || _datafromAPI$planDeta8 === void 0 ? void 0 : (_datafromAPI$planDeta9 = _datafromAPI$planDeta8[0]) === null || _datafromAPI$planDeta9 === void 0 ? void 0 : (_datafromAPI$planDeta10 = _datafromAPI$planDeta9.building) === null || _datafromAPI$planDeta10 === void 0 ? void 0 : _datafromAPI$planDeta10.totalBuitUpArea
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_SCRUTINY_DETAILS_NUMBER_OF_FLOORS_LABEL",
    text: datafromAPI === null || datafromAPI === void 0 ? void 0 : (_datafromAPI$planDeta11 = datafromAPI.planDetail) === null || _datafromAPI$planDeta11 === void 0 ? void 0 : (_datafromAPI$planDeta12 = _datafromAPI$planDeta11.blocks) === null || _datafromAPI$planDeta12 === void 0 ? void 0 : (_datafromAPI$planDeta13 = _datafromAPI$planDeta12[0]) === null || _datafromAPI$planDeta13 === void 0 ? void 0 : (_datafromAPI$planDeta14 = _datafromAPI$planDeta13.building) === null || _datafromAPI$planDeta14 === void 0 ? void 0 : _datafromAPI$planDeta14.totalFloors
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_APPLICATION_HIGH_FROM_GROUND",
    text: datafromAPI === null || datafromAPI === void 0 ? void 0 : (_datafromAPI$planDeta15 = datafromAPI.planDetail) === null || _datafromAPI$planDeta15 === void 0 ? void 0 : (_datafromAPI$planDeta16 = _datafromAPI$planDeta15.blocks) === null || _datafromAPI$planDeta16 === void 0 ? void 0 : (_datafromAPI$planDeta17 = _datafromAPI$planDeta16[0]) === null || _datafromAPI$planDeta17 === void 0 ? void 0 : (_datafromAPI$planDeta18 = _datafromAPI$planDeta17.building) === null || _datafromAPI$planDeta18 === void 0 ? void 0 : _datafromAPI$planDeta18.declaredBuildingHeight
  })), /*#__PURE__*/React__default.createElement("hr", {
    style: {
      color: "#cccccc",
      backgroundColor: "#cccccc",
      height: "2px",
      marginTop: "20px",
      marginBottom: "20px"
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("BPA_OCC_SUBOCC_HEADER")), datafromAPI === null || datafromAPI === void 0 ? void 0 : (_datafromAPI$planDeta19 = datafromAPI.planDetail) === null || _datafromAPI$planDeta19 === void 0 ? void 0 : _datafromAPI$planDeta19.blocks.map(function (block, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: index
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("Block"), " ", index + 1), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSectionHeader, {
      className: "card-label-smaller"
    }, t("BPA_SUB_OCCUPANCY_LABEL")), /*#__PURE__*/React__default.createElement("div", {
      style: {
        overflow: "scroll"
      }
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Table, {
      className: "customTable",
      t: t,
      disableSort: false,
      autoSort: true,
      manualPagination: false,
      isPaginationRequired: false,
      initSortId: "S N ",
      data: getFloorData(block),
      columns: tableColumns,
      getCellProps: function getCellProps(cellInfo) {
        return {
          style: {}
        };
      }
    }), /*#__PURE__*/React__default.createElement("hr", {
      style: {
        color: "#cccccc",
        backgroundColor: "#cccccc",
        height: "2px",
        marginTop: "20px",
        marginBottom: "20px"
      }
    })));
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, {
    style: {
      border: "none"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_APPLICATION_DEMOLITION_AREA_LABEL",
    text: datafromAPI === null || datafromAPI === void 0 ? void 0 : (_datafromAPI$planDeta20 = datafromAPI.planDetail) === null || _datafromAPI$planDeta20 === void 0 ? void 0 : (_datafromAPI$planDeta21 = _datafromAPI$planDeta20.planInformation) === null || _datafromAPI$planDeta21 === void 0 ? void 0 : _datafromAPI$planDeta21.demolitionArea
  }))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("BPA_NEW_TRADE_DETAILS_HEADER_DETAILS")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
      style: {
        marginTop: "-10px",
        float: "right",
        position: "relative",
        bottom: "32px"
      },
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M9.126 5.125L11.063 3.188L14.81 6.935L12.873 8.873L9.126 5.125ZM17.71 2.63L15.37 0.289999C15.1826 0.103748 14.9292 -0.000793457 14.665 -0.000793457C14.4008 -0.000793457 14.1474 0.103748 13.96 0.289999L12.13 2.12L15.88 5.87L17.71 4C17.8844 3.81454 17.9815 3.56956 17.9815 3.315C17.9815 3.06044 17.8844 2.81546 17.71 2.63ZM5.63 8.63L0 14.25V18H3.75L9.38 12.38L12.873 8.873L9.126 5.125L5.63 8.63Z",
      fill: "#F47738"
    })))),
    style: {
      width: "100px",
      display: "inline"
    },
    onClick: function onClick() {
      return routeTo(routeLink + "/location");
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_DETAILS_PIN_LABEL",
    text: address === null || address === void 0 ? void 0 : address.pincode
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_CITY_LABEL",
    text: address === null || address === void 0 ? void 0 : (_address$city = address.city) === null || _address$city === void 0 ? void 0 : _address$city.name
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_LOC_MOHALLA_LABEL",
    text: address === null || address === void 0 ? void 0 : (_address$locality = address.locality) === null || _address$locality === void 0 ? void 0 : _address$locality.name
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_DETAILS_SRT_NAME_LABEL",
    text: address === null || address === void 0 ? void 0 : address.street
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "ES_NEW_APPLICATION_LOCATION_LANDMARK",
    text: address === null || address === void 0 ? void 0 : address.landmark
  }))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("BPA_APPLICANT_DETAILS_HEADER")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
      style: {
        marginTop: "-10px",
        float: "right",
        position: "relative",
        bottom: "32px"
      },
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M9.126 5.125L11.063 3.188L14.81 6.935L12.873 8.873L9.126 5.125ZM17.71 2.63L15.37 0.289999C15.1826 0.103748 14.9292 -0.000793457 14.665 -0.000793457C14.4008 -0.000793457 14.1474 0.103748 13.96 0.289999L12.13 2.12L15.88 5.87L17.71 4C17.8844 3.81454 17.9815 3.56956 17.9815 3.315C17.9815 3.06044 17.8844 2.81546 17.71 2.63ZM5.63 8.63L0 14.25V18H3.75L9.38 12.38L12.873 8.873L9.126 5.125L5.63 8.63Z",
      fill: "#F47738"
    })))),
    style: {
      width: "100px",
      display: "inline"
    },
    onClick: function onClick() {
      return routeTo(routeLink + "/owner-details");
    }
  }), (owners === null || owners === void 0 ? void 0 : owners.owners) && (owners === null || owners === void 0 ? void 0 : owners.owners.map(function (ob, index) {
    var _ob$gender;

    return /*#__PURE__*/React__default.createElement("div", {
      key: index
    }, owners.owners.length > 1 && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("COMMON_OWNER"), " ", index + 1), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      className: "border-none",
      label: "CORE_COMMON_NAME",
      text: ob === null || ob === void 0 ? void 0 : ob.name
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      className: "border-none",
      label: "BPA_APPLICANT_GENDER_LABEL",
      text: t(ob === null || ob === void 0 ? void 0 : (_ob$gender = ob.gender) === null || _ob$gender === void 0 ? void 0 : _ob$gender.i18nKey)
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      className: "border-none",
      label: "CORE_COMMON_MOBILE_NUMBER",
      text: ob === null || ob === void 0 ? void 0 : ob.mobileNumber
    })));
  }))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("BPA_DOCUMENT_DETAILS_LABEL")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
      style: {
        marginTop: "-10px",
        float: "right",
        position: "relative",
        bottom: "32px"
      },
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M9.126 5.125L11.063 3.188L14.81 6.935L12.873 8.873L9.126 5.125ZM17.71 2.63L15.37 0.289999C15.1826 0.103748 14.9292 -0.000793457 14.665 -0.000793457C14.4008 -0.000793457 14.1474 0.103748 13.96 0.289999L12.13 2.12L15.88 5.87L17.71 4C17.8844 3.81454 17.9815 3.56956 17.9815 3.315C17.9815 3.06044 17.8844 2.81546 17.71 2.63ZM5.63 8.63L0 14.25V18H3.75L9.38 12.38L12.873 8.873L9.126 5.125L5.63 8.63Z",
      fill: "#F47738"
    })))),
    style: {
      width: "100px",
      display: "inline"
    },
    onClick: function onClick() {
      return routeTo(routeLink + "/document-details");
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("BPA_APP_DET_LABEL")), /*#__PURE__*/React__default.createElement(OBPSDocument, {
    value: value,
    Code: "APPL"
  }), /*#__PURE__*/React__default.createElement("hr", {
    style: {
      color: "#cccccc",
      backgroundColor: "#cccccc",
      height: "2px",
      marginTop: "20px",
      marginBottom: "20px"
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("BPA_BUILDING_PLAN_DIAG")), /*#__PURE__*/React__default.createElement(OBPSDocument, {
    value: value,
    Code: "BPD"
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("BPA_NOC_DETAILS_SUMMARY")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
      style: {
        marginTop: "-10px",
        float: "right",
        position: "relative",
        bottom: "32px"
      },
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M9.126 5.125L11.063 3.188L14.81 6.935L12.873 8.873L9.126 5.125ZM17.71 2.63L15.37 0.289999C15.1826 0.103748 14.9292 -0.000793457 14.665 -0.000793457C14.4008 -0.000793457 14.1474 0.103748 13.96 0.289999L12.13 2.12L15.88 5.87L17.71 4C17.8844 3.81454 17.9815 3.56956 17.9815 3.315C17.9815 3.06044 17.8844 2.81546 17.71 2.63ZM5.63 8.63L0 14.25V18H3.75L9.38 12.38L12.873 8.873L9.126 5.125L5.63 8.63Z",
      fill: "#F47738"
    })))),
    style: {
      width: "100px",
      display: "inline"
    },
    onClick: function onClick() {
      return routeTo(routeLink + "/noc-details");
    }
  }), nocDocuments === null || nocDocuments === void 0 ? void 0 : nocDocuments.NocDetails.map(function (noc, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: index
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSectionHeader, null, t("BPA_" + (noc === null || noc === void 0 ? void 0 : noc.nocType) + "_HEADER")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      className: "border-none",
      label: "BPA_" + (noc === null || noc === void 0 ? void 0 : noc.nocType) + "_LABEL",
      text: noc === null || noc === void 0 ? void 0 : noc.applicationNo
    }), /*#__PURE__*/React__default.createElement(OBPSDocument, {
      value: value,
      Code: "NOC",
      index: index
    })));
  }), /*#__PURE__*/React__default.createElement("hr", {
    style: {
      color: "#cccccc",
      backgroundColor: "#cccccc",
      height: "2px",
      marginTop: "20px",
      marginBottom: "20px"
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("BPA_SUMMARY_FEE_EST")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, paymentDetails === null || paymentDetails === void 0 ? void 0 : (_paymentDetails$Bill$ = paymentDetails.Bill[0]) === null || _paymentDetails$Bill$ === void 0 ? void 0 : (_paymentDetails$Bill$2 = _paymentDetails$Bill$.billDetails[0]) === null || _paymentDetails$Bill$2 === void 0 ? void 0 : _paymentDetails$Bill$2.billAccountDetails.map(function (bill, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: index
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      className: "border-none",
      label: "" + bill.taxHeadCode,
      text: "\u20B9 " + (bill === null || bill === void 0 ? void 0 : bill.amount)
    }));
  })), /*#__PURE__*/React__default.createElement("hr", {
    style: {
      color: "#cccccc",
      backgroundColor: "#cccccc",
      height: "2px",
      marginTop: "20px",
      marginBottom: "20px"
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("BPA_COMMON_TOTAL_AMT")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, "\u20B9 ", paymentDetails === null || paymentDetails === void 0 ? void 0 : (_paymentDetails$Bill = paymentDetails.Bill) === null || _paymentDetails$Bill === void 0 ? void 0 : (_paymentDetails$Bill$3 = _paymentDetails$Bill[0]) === null || _paymentDetails$Bill$3 === void 0 ? void 0 : (_paymentDetails$Bill$4 = _paymentDetails$Bill$3.billDetails[0]) === null || _paymentDetails$Bill$4 === void 0 ? void 0 : _paymentDetails$Bill$4.amount), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("CS_COMMON_SUBMIT"),
    onSubmit: onSubmit
  })));
};

var GetActionMessage = function GetActionMessage(props) {
  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  if (props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("CS_BPA_APPLICATION_SUCCESS") : t("CS_PROPERTY_UPDATE_APPLICATION_SUCCESS");
  } else if (props.isLoading) {
    return !window.location.href.includes("edit-application") ? t("CS_BPA_APPLICATION_PENDING") : t("CS_PROPERTY_UPDATE_APPLICATION_PENDING");
  } else if (!props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("CS_BPA_APPLICATION_FAILED") : t("CS_PROPERTY_UPDATE_APPLICATION_FAILED");
  }
};

var BannerPicker = function BannerPicker(props) {
  var _props$data;

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Banner, {
    message: GetActionMessage(props),
    applicationNumber: (_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.BPA[0].applicationNo,
    info: props.isSuccess ? props.t("BPA_STAKEHOLDER_NO") : "",
    successful: props.isSuccess
  });
};

var OBPSAcknowledgement = function OBPSAcknowledgement(_ref) {
  var _data$address, _data$address2, _data$address2$city, _data$address3, _data$address4, _data$address4$city;

  var data = _ref.data,
      onSuccess = _ref.onSuccess;

  var _useTranslation2 = reactI18next.useTranslation(),
      t = _useTranslation2.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var mutation = Digit.Hooks.obps.useObpsAPI(data !== null && data !== void 0 && (_data$address = data.address) !== null && _data$address !== void 0 && _data$address.city ? (_data$address2 = data.address) === null || _data$address2 === void 0 ? void 0 : (_data$address2$city = _data$address2.city) === null || _data$address2$city === void 0 ? void 0 : _data$address2$city.code : tenantId, true);
  var mutation1 = Digit.Hooks.obps.useObpsAPI(data !== null && data !== void 0 && (_data$address3 = data.address) !== null && _data$address3 !== void 0 && _data$address3.city ? (_data$address4 = data.address) === null || _data$address4 === void 0 ? void 0 : (_data$address4$city = _data$address4.city) === null || _data$address4$city === void 0 ? void 0 : _data$address4$city.code : tenantId, false);

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData();

  React.useEffect(function () {
    try {
      var _data$address5, _data$address6, _data$address6$city, _data$nocDocuments;

      var _tenantId = data !== null && data !== void 0 && (_data$address5 = data.address) !== null && _data$address5 !== void 0 && _data$address5.city ? (_data$address6 = data.address) === null || _data$address6 === void 0 ? void 0 : (_data$address6$city = _data$address6.city) === null || _data$address6$city === void 0 ? void 0 : _data$address6$city.code : _tenantId;

      data.tenantId = _tenantId;
      var formdata = {};
      data === null || data === void 0 ? void 0 : (_data$nocDocuments = data.nocDocuments) === null || _data$nocDocuments === void 0 ? void 0 : _data$nocDocuments.NocDetails.map(function (noc) {
        formdata = convertToNocObject(noc, data);
        mutation.mutate(formdata, {
          onSuccess: onSuccess
        });
      });
      formdata = convertToBPAObject(data);
      mutation1.mutate(formdata, {
        onSuccess: onSuccess
      });
    } catch (err) {
      console.log(err, "inside ack");
    }
  }, []);

  return mutation1.isLoading || mutation1.isIdle ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(BannerPicker, {
    t: t,
    data: mutation1.data,
    isSuccess: mutation1.isSuccess,
    isLoading: mutation1.isIdle || mutation1.isLoading
  }), mutation1.isSuccess && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, null, t("CS_FILE_OBPS_RESPONSE")), !mutation1.isSuccess && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, null, t("CS_FILE_PROPERTY_FAILED_RESPONSE")), mutation1.isSuccess && /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("MAKE PAYMENT")
  }), /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: "/digit-ui/citizen"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: t("CORE_COMMON_GO_TO_HOME")
  })));
};

var NewBuildingPermit = function NewBuildingPermit() {
  var queryClient = reactQuery.useQueryClient();

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useRouteMatch = reactRouterDom.useRouteMatch(),
      path = _useRouteMatch.path;

  var _useLocation = reactRouterDom.useLocation(),
      pathname = _useLocation.pathname,
      state = _useLocation.state;

  var history = reactRouterDom.useHistory();
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("BUILDING_PERMIT", state !== null && state !== void 0 && state.edcrNumber ? {
    data: {
      scrutinyNumber: {
        edcrNumber: state === null || state === void 0 ? void 0 : state.edcrNumber
      }
    }
  } : {}),
      params = _Digit$Hooks$useSessi[0],
      setParams = _Digit$Hooks$useSessi[1],
      clearParams = _Digit$Hooks$useSessi[2];

  var goNext = function goNext(skipStep) {
    var currentPath = pathname.split("/").pop();

    var _config$find = config.find(function (routeObj) {
      return routeObj.route === currentPath;
    }),
        nextStep = _config$find.nextStep;

    var redirectWithHistory = history.push;

    if (nextStep === null) {
      return redirectWithHistory(path + "/check");
    }

    redirectWithHistory(path + "/" + nextStep);
  };

  var onSuccess = function onSuccess() {
    queryClient.invalidateQueries("PT_CREATE_PROPERTY");
  };

  var createApplication = function createApplication() {
    try {
      history.push(path + "/acknowledgement");
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var handleSelect = function handleSelect(key, data, skipStep, isFromCreateApi) {
    var _extends2;

    if (isFromCreateApi) setParams(data);else setParams(_extends({}, params, (_extends2 = {}, _extends2[key] = _extends({}, params[key], data), _extends2)));
    goNext();
  };

  var handleSkip = function handleSkip() {};

  var config = [];
  newConfig.forEach(function (obj) {
    config = config.concat(obj.body.filter(function (a) {
      return !a.hideInCitizen;
    }));
  });
  config.indexRoute = "docs-required";
  React.useEffect(function () {
    if (sessionStorage.getItem("isPermitApplication") && sessionStorage.getItem("isPermitApplication") == "true") {
      clearParams();
      sessionStorage.setItem("isPermitApplication", false);
    }
  }, []);
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, config.map(function (routeObj, index) {
    var component = routeObj.component,
        texts = routeObj.texts,
        inputs = routeObj.inputs,
        key = routeObj.key;
    var Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
    return /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
      path: path + "/" + routeObj.route,
      key: index
    }, /*#__PURE__*/React__default.createElement(Component, {
      config: {
        texts: texts,
        inputs: inputs,
        key: key
      },
      onSelect: handleSelect,
      onSkip: handleSkip,
      t: t,
      formData: params
    }));
  }), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/check"
  }, /*#__PURE__*/React__default.createElement(CheckPage, {
    onSubmit: createApplication,
    value: params
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/acknowledgement"
  }, /*#__PURE__*/React__default.createElement(OBPSAcknowledgement, {
    data: params,
    onSuccess: onSuccess
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
    to: path + "/" + config.indexRoute
  })));
};

var newConfig$1 = [{
  head: "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT",
  body: [{
    route: "home",
    component: "EDCRForm",
    nextStep: "",
    hideInEmployee: true,
    key: "ScrutinyDetails",
    texts: {
      headerCaption: "",
      header: "EDCR_COMMON_APPL_NEW",
      cardText: "BPA_PROVIDE_REQ_FOR_NEW_BPA",
      submitBarLabel: "EDCR_SCRUTINY_SUBMIT_BUTTON",
      skipText: "EDCR_CLEAR_FORM"
    }
  }]
}];

var EDCRAcknowledgement = function EDCRAcknowledgement(props) {
  var _props$data;

  sessionStorage.setItem("isPermitApplication", true);
  var edcrData = props === null || props === void 0 ? void 0 : (_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data[0];

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();

  var printReciept = function printReciept() {
    try {
      var win = window.open(edcrData.planReport, '_blank');

      if (win) {
        win.focus();
      }

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var routeToBPAScreen = function routeToBPAScreen() {
    try {
      history.push("/digit-ui/citizen/obps/new-building-permit/docs-required", {
        edcrNumber: edcrData === null || edcrData === void 0 ? void 0 : edcrData.edcrNumber
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return /*#__PURE__*/React__default.createElement("div", null, edcrData.status == "Accepted" ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    style: {
      padding: "0px"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Banner, {
    message: t("EDCR_ACKNOWLEDGEMENT_SUCCESS_MESSAGE_LABEL"),
    applicationNumber: edcrData === null || edcrData === void 0 ? void 0 : edcrData.applicationNumber,
    info: t("EDCR_ACKNOWLEDGEMENT_SUCCESS_SUB_MESSAGE_LABEL"),
    successful: true,
    infoStyles: {
      fontSize: "18px",
      lineHeight: "21px",
      fontWeight: "bold",
      textAlign: "center",
      padding: "0px 15px"
    },
    applicationNumberStyles: {
      fontSize: "24px",
      lineHeight: "28px",
      fontWeight: "bold",
      marginTop: "10px"
    },
    style: {
      padding: "10px"
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, {
    style: {
      padding: "0px 8px"
    }
  }, t("EDCR_ACKNOWLEDGEMENT_SUCCESS_MESSAGE_TEXT_LABEL")), /*#__PURE__*/React__default.createElement("div", {
    className: "primary-label-btn d-grid",
    style: {
      marginLeft: "unset",
      marginBottom: "10px",
      padding: "0px 8px"
    },
    onClick: printReciept
  }, /*#__PURE__*/React__default.createElement("svg", {
    width: "20",
    height: "23",
    viewBox: "0 0 20 23",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M19.3334 8H14V0H6.00002V8H0.666687L10 17.3333L19.3334 8ZM0.666687 20V22.6667H19.3334V20H0.666687Z",
    fill: "#F47738"
  })), t("EDCR_DOWNLOAD_SCRUTINY_REPORT_LABEL")), /*#__PURE__*/React__default.createElement("div", {
    onClick: routeToBPAScreen,
    style: {
      padding: "0px 8px"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("BPA_APPLY_FOR_BPA_LABEL")
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: "/digit-ui/citizen"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: t("CORE_COMMON_GO_TO_HOME")
  }))) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    style: {
      padding: "0px"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Banner, {
    message: t("EDCR_ACKNOWLEDGEMENT_REJECTED_MESSAGE_LABEL"),
    applicationNumber: edcrData === null || edcrData === void 0 ? void 0 : edcrData.applicationNumber,
    info: t("EDCR_ACKNOWLEDGEMENT_SUCCESS_SUB_MESSAGE_LABEL"),
    successful: false,
    infoStyles: {
      fontSize: "18px",
      lineHeight: "21px",
      fontWeight: "bold",
      textAlign: "center",
      padding: "0px 15px"
    },
    applicationNumberStyles: {
      fontSize: "24px",
      lineHeight: "28px",
      fontWeight: "bold",
      marginTop: "10px"
    },
    style: {
      padding: "10px"
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, {
    style: {
      padding: "0px 8px"
    }
  }, t("EDCR_ACKNOWLEDGEMENT_REJECTED_MESSAGE_TEXT_LABEL")), /*#__PURE__*/React__default.createElement("div", {
    className: "primary-label-btn d-grid",
    style: {
      marginLeft: "unset",
      marginBottom: "10px",
      padding: "0px 8px"
    },
    onClick: printReciept
  }, /*#__PURE__*/React__default.createElement("svg", {
    width: "20",
    height: "23",
    viewBox: "0 0 20 23",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M19.3334 8H14V0H6.00002V8H0.666687L10 17.3333L19.3334 8ZM0.666687 20V22.6667H19.3334V20H0.666687Z",
    fill: "#F47738"
  })), t("EDCR_DOWNLOAD_SCRUTINY_REPORT_LABEL")), /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: "/digit-ui/citizen"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("CORE_COMMON_GO_TO_HOME")
  }))));
};

var CreateEDCR = function CreateEDCR(_ref) {
  var queryClient = reactQuery.useQueryClient();
  var match = reactRouterDom.useRouteMatch();

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useLocation = reactRouterDom.useLocation();

  var history = reactRouterDom.useHistory();
  var config = [];

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("EDCR_CREATE", {}),
      params = _Digit$Hooks$useSessi[0],
      setParams = _Digit$Hooks$useSessi[1];

  var _useState = React.useState(null),
      isShowToast = _useState[0],
      setIsShowToast = _useState[1];

  function handleSelect(key, data, skipStep, index) {
    var _loggedInuserInfo$inf, _loggedInuserInfo$inf2, _data$tenantId;

    var loggedInuserInfo = Digit.UserService.getUser();
    var userInfo = {
      id: loggedInuserInfo === null || loggedInuserInfo === void 0 ? void 0 : (_loggedInuserInfo$inf = loggedInuserInfo.info) === null || _loggedInuserInfo$inf === void 0 ? void 0 : _loggedInuserInfo$inf.uuid,
      tenantId: loggedInuserInfo === null || loggedInuserInfo === void 0 ? void 0 : (_loggedInuserInfo$inf2 = loggedInuserInfo.info) === null || _loggedInuserInfo$inf2 === void 0 ? void 0 : _loggedInuserInfo$inf2.tenantId
    };
    var edcrRequest = {
      transactionNumber: "",
      edcrNumber: "",
      planFile: null,
      tenantId: "",
      RequestInfo: {
        apiId: "",
        ver: "",
        ts: "",
        action: "",
        did: "",
        authToken: "",
        key: "",
        msgId: "",
        correlationId: "",
        userInfo: userInfo
      }
    };
    var applicantName = data === null || data === void 0 ? void 0 : data.applicantName;
    var file = data === null || data === void 0 ? void 0 : data.file;
    var tenantId = data === null || data === void 0 ? void 0 : (_data$tenantId = data.tenantId) === null || _data$tenantId === void 0 ? void 0 : _data$tenantId.code;
    var transactionNumber = uuidv4();
    var appliactionType = "BUILDING_PLAN_SCRUTINY";
    var applicationSubType = "NEW_CONSTRUCTION";
    edcrRequest = _extends({}, edcrRequest, {
      tenantId: tenantId
    });
    edcrRequest = _extends({}, edcrRequest, {
      transactionNumber: transactionNumber
    });
    edcrRequest = _extends({}, edcrRequest, {
      applicantName: applicantName
    });
    edcrRequest = _extends({}, edcrRequest, {
      appliactionType: appliactionType
    });
    edcrRequest = _extends({}, edcrRequest, {
      applicationSubType: applicationSubType
    });
    var bodyFormData = new FormData();
    bodyFormData.append("edcrRequest", JSON.stringify(edcrRequest));
    bodyFormData.append("planFile", file);
    Digit.EDCRService.create({
      data: bodyFormData
    }, tenantId).then(function (result, err) {
      var _result$data;

      if (result !== null && result !== void 0 && (_result$data = result.data) !== null && _result$data !== void 0 && _result$data.edcrDetail) {
        var _result$data2, _result$data3;

        setParams(result === null || result === void 0 ? void 0 : (_result$data2 = result.data) === null || _result$data2 === void 0 ? void 0 : _result$data2.edcrDetail);
        history.replace("/digit-ui/citizen/obps/edcrscrutiny/apply/acknowledgement", {
          data: result === null || result === void 0 ? void 0 : (_result$data3 = result.data) === null || _result$data3 === void 0 ? void 0 : _result$data3.edcrDetail
        });
      }
    }).catch(function (e) {
      var _e$response, _e$response$data;

      setIsShowToast({
        key: true,
        label: e === null || e === void 0 ? void 0 : (_e$response = e.response) === null || _e$response === void 0 ? void 0 : (_e$response$data = _e$response.data) === null || _e$response$data === void 0 ? void 0 : _e$response$data.errorCode
      });
    });
  }

  var handleSkip = function handleSkip() {};

  var handleMultiple = function handleMultiple() {};

  var onSuccess = function onSuccess() {
    sessionStorage.removeItem("CurrentFinancialYear");
    queryClient.invalidateQueries("TL_CREATE_TRADE");
  };

  newConfig$1.forEach(function (obj) {
    config = config.concat(obj.body.filter(function (a) {
      return !a.hideInCitizen;
    }));
  });
  config.indexRoute = "home";
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, config.map(function (routeObj, index) {
    var component = routeObj.component,
        texts = routeObj.texts,
        inputs = routeObj.inputs,
        key = routeObj.key;
    var Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
    return /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
      path: match.path + "/" + routeObj.route,
      key: index
    }, /*#__PURE__*/React__default.createElement(Component, {
      config: {
        texts: texts,
        inputs: inputs,
        key: key
      },
      onSelect: handleSelect,
      onSkip: handleSkip,
      t: t,
      formData: params,
      onAdd: handleMultiple,
      isShowToast: isShowToast
    }));
  }), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: match.path + "/acknowledgement"
  }, /*#__PURE__*/React__default.createElement(EDCRAcknowledgement, {
    data: params,
    onSuccess: onSuccess
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
    to: match.path + "/" + config.indexRoute
  })));
};

var newConfig$2 = [{
  head: "ES_NEW_APPLICATION_PROPERTY_ASSESSMENT",
  body: [{
    route: "docs-required",
    component: "OCEDCRDocsRequired",
    key: "data",
    nextStep: ""
  }]
}];

var CreateOCEDCR = function CreateOCEDCR(_ref) {
  var queryClient = reactQuery.useQueryClient();
  var match = reactRouterDom.useRouteMatch();

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useLocation = reactRouterDom.useLocation(),
      pathname = _useLocation.pathname;

  var _useRouteMatch = reactRouterDom.useRouteMatch(),
      path = _useRouteMatch.path;

  var history = reactRouterDom.useHistory();
  var config = [];

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("EDCR_CREATE", {}),
      params = _Digit$Hooks$useSessi[0],
      setParams = _Digit$Hooks$useSessi[1];

  var _useState = React.useState(null),
      isShowToast = _useState[0];

  var goNext = function goNext(skipStep) {
    var currentPath = pathname.split("/").pop();

    var _config$find = config.find(function (routeObj) {
      return routeObj.route === currentPath;
    }),
        nextStep = _config$find.nextStep;

    var redirectWithHistory = history.push;

    if (nextStep === null) {
      return redirectWithHistory(path + "/check");
    }

    redirectWithHistory(path + "/" + nextStep);
  };

  var handleSelect = function handleSelect(key, data, skipStep, isFromCreateApi) {
    var _extends2;

    debugger;
    if (isFromCreateApi) setParams(data);else setParams(_extends({}, params, (_extends2 = {}, _extends2[key] = _extends({}, params[key], data), _extends2)));
    if (!skipStep) goNext();
  };

  var handleSkip = function handleSkip() {};

  var handleMultiple = function handleMultiple() {};

  newConfig$2.forEach(function (obj) {
    config = config.concat(obj.body.filter(function (a) {
      return !a.hideInCitizen;
    }));
  });
  config.forEach(function (data) {
    var _params$ScrutinyDetai, _params$ScrutinyDetai2;

    if ((data === null || data === void 0 ? void 0 : data.component) == "OCeDCRScrutiny" && params !== null && params !== void 0 && (_params$ScrutinyDetai = params.ScrutinyDetails) !== null && _params$ScrutinyDetai !== void 0 && _params$ScrutinyDetai.edcrNumber) {
      data.texts.submitBarLabel = "CS_COMMON_NEXT";
    } else if ((data === null || data === void 0 ? void 0 : data.component) == "OCeDCRScrutiny" && !(params !== null && params !== void 0 && (_params$ScrutinyDetai2 = params.ScrutinyDetails) !== null && _params$ScrutinyDetai2 !== void 0 && _params$ScrutinyDetai2.edcrNumber)) {
      data.texts.submitBarLabel = "";
    }
  });
  config.indexRoute = "home";
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, config.map(function (routeObj, index) {
    var component = routeObj.component,
        texts = routeObj.texts,
        inputs = routeObj.inputs,
        key = routeObj.key;
    var Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
    return /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
      path: match.path + "/" + routeObj.route,
      key: index
    }, /*#__PURE__*/React__default.createElement(Component, {
      config: {
        texts: texts,
        inputs: inputs,
        key: key
      },
      onSelect: handleSelect,
      onSkip: handleSkip,
      t: t,
      formData: params,
      onAdd: handleMultiple,
      isShowToast: isShowToast
    }));
  }), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: match.path + "/acknowledgement"
  }), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
    to: match.path + "/" + config.indexRoute
  })));
};

var BPACitizenHomeScreen = function BPACitizenHomeScreen(_ref) {
  var userInfo = Digit.UserService.getUser();
  var userRoles = userInfo.info.roles.map(function (roleData) {
    return roleData.code;
  });

  if (!userRoles.includes("BPA_ARCHITECT")) {
    alert("Please login with Architect role");
    return true;
  }

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateCode = tenantId.split(".")[0];
  var moduleCode = "bpareg";
  var language = Digit.StoreData.getCurrentLanguage();

  var _Digit$Services$useSt = Digit.Services.useStore({
    stateCode: stateCode,
    moduleCode: moduleCode,
    language: language
  });

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("BPA_HOME_CREATE", {}),
      clearParams = _Digit$Hooks$useSessi[2];

  React.useEffect(function () {
    clearParams();
  }, []);
  var homeDetails = [{
    Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.BPAHomeIcon, null),
    moduleName: t("ACTION_TEST_BPA_STAKE_HOLDER_HOME"),
    name: "employeeCard",
    kpis: [{
      count: 0,
      label: t("BPA_PDF_TOTAL")
    }, {
      count: 0,
      label: t("TOTAL_NEARING_SLA")
    }],
    links: [{
      label: t("ES_COMMON_INBOX"),
      link: ""
    }]
  }, {
    title: t("ACTION_TEST_EDCR_SCRUTINY"),
    Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.EDCRIcon, {
      className: "fill-path-primary-main"
    }),
    links: [{
      link: "edcrscrutiny/apply",
      i18nKey: t("BPA_SCRUTINY_TITLE")
    }, {
      link: "edcrscrutiny/oc-apply",
      i18nKey: t("BPA_HOME_BUILDING_PLAN_SCRUTINY_OC_LABEL")
    }]
  }, {
    title: t("ACTION_TEST_BPA_STAKE_HOLDER_HOME"),
    Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.BPAIcon, {
      className: "fill-path-primary-main"
    }),
    links: [{
      link: "new-building-permit",
      i18nKey: t("BPA_PERMIT_NEW_CONSTRUCTION_LABEL")
    }, {
      link: "",
      i18nKey: t("BPA_OC_FOR_NEW_BUILDING_CONSTRUCTION_LABEL")
    }]
  }];
  var homeScreen = homeDetails.map(function (data) {
    if (data.name == "employeeCard") {
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.EmployeeModuleCard, data);
    } else {
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.CitizenHomeCard, {
        header: data.title,
        links: data.links,
        Icon: function Icon() {
          return data.Icon;
        }
      });
    }
  });
  sessionStorage.setItem("isPermitApplication", true);
  return homeScreen;
};

var App = function App(_ref) {
  var path = _ref.path;
  var location = reactRouterDom.useLocation();

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, !location.pathname.includes("response") && /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, null, t("CS_COMMON_BACK")), /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/home",
    component: BPACitizenHomeScreen
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/edcrscrutiny/apply",
    component: CreateEDCR
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/edcrscrutiny/oc-apply",
    component: CreateOCEDCR
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/new-building-permit",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(NewBuildingPermit, null);
    }
  })));
};

var EDCRForm = function EDCRForm(_ref) {
  var _formData$Scrutiny, _formData$Scrutiny$, _formData$Scrutiny2, _formData$Scrutiny2$, _formData$owners, _formData$owners$docu;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData,
      isShowToast = _ref.isShowToast;

  var _useLocation = reactRouterDom.useLocation();

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState = React.useState([]),
      citymoduleList = _useState[0],
      setCitymoduleList = _useState[1];

  var _useState2 = React.useState(formData === null || formData === void 0 ? void 0 : (_formData$Scrutiny = formData.Scrutiny) === null || _formData$Scrutiny === void 0 ? void 0 : (_formData$Scrutiny$ = _formData$Scrutiny[0]) === null || _formData$Scrutiny$ === void 0 ? void 0 : _formData$Scrutiny$.applicantName),
      name = _useState2[0],
      setName = _useState2[1];

  var _useState3 = React.useState(formData === null || formData === void 0 ? void 0 : (_formData$Scrutiny2 = formData.Scrutiny) === null || _formData$Scrutiny2 === void 0 ? void 0 : (_formData$Scrutiny2$ = _formData$Scrutiny2[0]) === null || _formData$Scrutiny2$ === void 0 ? void 0 : _formData$Scrutiny2$.tenantIdData),
      tenantIdData = _useState3[0],
      setTenantIdData = _useState3[1];

  var _useState4 = React.useState(function () {
    var _formData$Scrutiny3, _formData$Scrutiny3$, _formData$Scrutiny3$$;

    return (formData === null || formData === void 0 ? void 0 : (_formData$Scrutiny3 = formData.Scrutiny) === null || _formData$Scrutiny3 === void 0 ? void 0 : (_formData$Scrutiny3$ = _formData$Scrutiny3[0]) === null || _formData$Scrutiny3$ === void 0 ? void 0 : (_formData$Scrutiny3$$ = _formData$Scrutiny3$.proofIdentity) === null || _formData$Scrutiny3$$ === void 0 ? void 0 : _formData$Scrutiny3$$.fileStoreId) || null;
  }),
      uploadedFile = _useState4[0],
      setUploadedFile = _useState4[1];

  var _useState5 = React.useState(formData === null || formData === void 0 ? void 0 : (_formData$owners = formData.owners) === null || _formData$owners === void 0 ? void 0 : (_formData$owners$docu = _formData$owners.documents) === null || _formData$owners$docu === void 0 ? void 0 : _formData$owners$docu.proofIdentity),
      file = _useState5[0],
      setFile = _useState5[1];

  var _useState6 = React.useState(null),
      error = _useState6[0];

  var _useState7 = React.useState(""),
      uploadMessage = _useState7[0],
      setUploadMessage = _useState7[1];

  var _useState8 = React.useState(null),
      setShowToast = _useState8[1];

  var validation = {};

  function setApplicantName(e) {
    setName(e.target.value);
  }

  function setTypeOfTenantID(value) {
    setTenantIdData(value);
  }

  function selectfile(e) {
    setUploadedFile(e.target.files[0]);
    setFile(e.target.files[0]);
  }

  var onSkip = function onSkip() {
    setUploadMessage("NEED TO DELETE");
  };

  var _Digit$Hooks$obps$use = Digit.Hooks.obps.useMDMS(stateId, "tenant", ["citymodule"]),
      isLoading = _Digit$Hooks$obps$use.isLoading,
      citymodules = _Digit$Hooks$obps$use.data;

  React.useEffect(function () {
    var _citymodules$tenant, _citymodules$tenant$c;

    if ((citymodules === null || citymodules === void 0 ? void 0 : (_citymodules$tenant = citymodules.tenant) === null || _citymodules$tenant === void 0 ? void 0 : (_citymodules$tenant$c = _citymodules$tenant.citymodule) === null || _citymodules$tenant$c === void 0 ? void 0 : _citymodules$tenant$c.length) > 0) {
      var _citymodules$tenant2, _citymodules$tenant2$, _list$, _list$$tenants, _list$2, _list$3, _list$4;

      var list = citymodules === null || citymodules === void 0 ? void 0 : (_citymodules$tenant2 = citymodules.tenant) === null || _citymodules$tenant2 === void 0 ? void 0 : (_citymodules$tenant2$ = _citymodules$tenant2.citymodule) === null || _citymodules$tenant2$ === void 0 ? void 0 : _citymodules$tenant2$.filter(function (data) {
        return data.code == "BPAAPPLY";
      });
      list === null || list === void 0 ? void 0 : (_list$ = list[0]) === null || _list$ === void 0 ? void 0 : (_list$$tenants = _list$.tenants) === null || _list$$tenants === void 0 ? void 0 : _list$$tenants.forEach(function (data) {
        var _data$code;

        data.i18nKey = "TENANT_TENANTS_" + stringReplaceAll(data === null || data === void 0 ? void 0 : (_data$code = data.code) === null || _data$code === void 0 ? void 0 : _data$code.toUpperCase(), ".", "_");
      });
      if (Array.isArray(list === null || list === void 0 ? void 0 : (_list$2 = list[0]) === null || _list$2 === void 0 ? void 0 : _list$2.tenants)) list === null || list === void 0 ? void 0 : (_list$3 = list[0]) === null || _list$3 === void 0 ? void 0 : _list$3.tenants.reverse();
      setCitymoduleList(list === null || list === void 0 ? void 0 : (_list$4 = list[0]) === null || _list$4 === void 0 ? void 0 : _list$4.tenants);
    }
  }, [citymodules]);
  React.useEffect(function () {
    if (uploadMessage) {
      setName("");
      setTenantIdData("");
      setUploadedFile(null);
      setFile("");
      setUploadMessage("");
    }
  }, [uploadMessage]);

  function onAdd() {
    setUploadMessage("NEED TO DELETE");
  }

  var handleSubmit = function handleSubmit() {
    var data = {};
    data.tenantId = tenantIdData;
    data.applicantName = name;
    data.file = file;
    onSelect(config.key, data);
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    t: t,
    config: config,
    onSelect: handleSubmit,
    onSkip: onSkip,
    isDisabled: !tenantIdData || !name || !file,
    onAdd: onAdd,
    isMultipleAllow: true
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, t("EDCR_SCRUTINY_CITY") + "*"), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    t: t,
    isMandatory: false,
    option: citymoduleList,
    selected: tenantIdData,
    optionKey: "i18nKey",
    select: setTypeOfTenantID,
    uploadMessage: uploadMessage
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, t("EDCR_SCRUTINY_NAME_LABEL") + "*"), /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
    isMandatory: false,
    optionKey: "i18nKey",
    t: t,
    name: "applicantName",
    onChange: setApplicantName,
    uploadMessage: uploadMessage,
    value: name
  }, validation = {
    isRequired: true,
    pattern: getPattern("Name"),
    title: t("BPA_INVALID_NAME")
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, t("EDCR_BUILDINGPLAN") + "*"), /*#__PURE__*/React__default.createElement(digitUiReactComponents.UploadFile, {
    extraStyleName: "propertyCreate",
    accept: ".dxf",
    onUpload: selectfile,
    onDelete: function onDelete() {
      setUploadedFile(null);
    },
    message: uploadedFile ? "1 " + t("PT_ACTION_FILEUPLOADED") : t("ES_NO_FILE_SELECTED_LABEL"),
    error: error,
    uploadMessage: uploadMessage
  }), /*#__PURE__*/React__default.createElement("div", {
    style: {
      disabled: "true",
      height: "30px",
      width: "100%",
      fontSize: "14px"
    }
  }, t("EDCR_UPLOAD_FILE_LIMITS_LABEL")), isShowToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: isShowToast.key,
    label: t(isShowToast.label),
    onClose: function onClose() {
      return setShowToast(null);
    }
  }));
};

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

function addMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var timestamp = toDate(dirtyDate).getTime();
  var amount = toInteger(dirtyAmount);
  return new Date(timestamp + amount);
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

function isValid(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  return !isNaN(date);
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

var MILLISECONDS_IN_DAY = 86400000;
function getUTCDayOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var timestamp = date.getTime();
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
  var startOfYearTimestamp = date.getTime();
  var difference = timestamp - startOfYearTimestamp;
  return Math.floor(difference / MILLISECONDS_IN_DAY) + 1;
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

var BasicDetails = function BasicDetails(_ref) {
  var _formData$data, _formData$data2, _formData$data3, _data$planDetail5, _data$planDetail5$pla, _mdmsData$BPA2, _data$planDetail6, _data$planDetail6$plo, _data$planDetail7, _data$planDetail8, _data$planDetail8$pla;

  var formData = _ref.formData,
      onSelect = _ref.onSelect,
      config = _ref.config;

  var _useState = React.useState(formData === null || formData === void 0 ? void 0 : (_formData$data = formData.data) === null || _formData$data === void 0 ? void 0 : _formData$data.scrutinyNumber),
      scrutinyNumber = _useState[0],
      setScrutinyNumber = _useState[1];

  var _useState2 = React.useState(formData !== null && formData !== void 0 && (_formData$data2 = formData.data) !== null && _formData$data2 !== void 0 && _formData$data2.scrutinyNumber ? true : false),
      isDisabled = _useState2[0];

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var state = tenantId.split(".")[0];

  var _Digit$Hooks$obps$use = Digit.Hooks.obps.useMDMS(state, "BPA", ["RiskTypeComputation"]),
      isMdmsLoading = _Digit$Hooks$obps$use.isMdmsLoading,
      mdmsData = _Digit$Hooks$obps$use.data;

  var _Digit$Hooks$obps$use2 = Digit.Hooks.obps.useScrutinyDetails("pb.amritsar", scrutinyNumber, {
    enabled: formData !== null && formData !== void 0 && (_formData$data3 = formData.data) !== null && _formData$data3 !== void 0 && _formData$data3.scrutinyNumber ? true : false
  }),
      data = _Digit$Hooks$obps$use2.data,
      refetch = _Digit$Hooks$obps$use2.refetch;

  var handleKeyPress = function handleKeyPress(event) {
    if (event.key === "Enter") {
      refetch();
    }
  };

  var handleSubmit = function handleSubmit(event) {
    var _data$planDetail, _data$planDetail$plan, _data$planDetail2, _data$planDetail2$pla, _mdmsData$BPA, _data$planDetail3, _data$planDetail3$plo, _data$planDetail4;

    onSelect(config === null || config === void 0 ? void 0 : config.key, {
      scrutinyNumber: scrutinyNumber,
      applicantName: data === null || data === void 0 ? void 0 : (_data$planDetail = data.planDetail) === null || _data$planDetail === void 0 ? void 0 : (_data$planDetail$plan = _data$planDetail.planInformation) === null || _data$planDetail$plan === void 0 ? void 0 : _data$planDetail$plan.applicantName,
      occupancyType: data === null || data === void 0 ? void 0 : (_data$planDetail2 = data.planDetail) === null || _data$planDetail2 === void 0 ? void 0 : (_data$planDetail2$pla = _data$planDetail2.planInformation) === null || _data$planDetail2$pla === void 0 ? void 0 : _data$planDetail2$pla.occupancy,
      applicationType: data === null || data === void 0 ? void 0 : data.appliactionType,
      serviceType: data === null || data === void 0 ? void 0 : data.applicationSubType,
      applicationDate: data === null || data === void 0 ? void 0 : data.applicationDate,
      riskType: Digit.Utils.obps.calculateRiskType(mdmsData === null || mdmsData === void 0 ? void 0 : (_mdmsData$BPA = mdmsData.BPA) === null || _mdmsData$BPA === void 0 ? void 0 : _mdmsData$BPA.RiskTypeComputation, data === null || data === void 0 ? void 0 : (_data$planDetail3 = data.planDetail) === null || _data$planDetail3 === void 0 ? void 0 : (_data$planDetail3$plo = _data$planDetail3.plot) === null || _data$planDetail3$plo === void 0 ? void 0 : _data$planDetail3$plo.area, data === null || data === void 0 ? void 0 : (_data$planDetail4 = data.planDetail) === null || _data$planDetail4 === void 0 ? void 0 : _data$planDetail4.blocks)
    });
  };

  if (isMdmsLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Timeline, null), /*#__PURE__*/React__default.createElement("div", {
    className: "obps-search"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Label, null, t("OBPS_SEARCH_EDCR_NUMBER")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, {
    className: "searchInput",
    onKeyPress: handleKeyPress,
    onChange: function onChange(event) {
      return setScrutinyNumber({
        edcrNumber: event.target.value
      });
    },
    value: scrutinyNumber === null || scrutinyNumber === void 0 ? void 0 : scrutinyNumber.edcrNumber,
    signature: true,
    signatureImg: /*#__PURE__*/React__default.createElement(digitUiReactComponents.SearchIconSvg, {
      className: "signature-img",
      onClick: function onClick() {
        return refetch();
      }
    }),
    disable: isDisabled,
    style: {
      marginBottom: "10px"
    }
  })), data && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardCaption, null, t("BPA_SCRUTINY_DETAILS")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("BPA_BASIC_DETAILS_TITLE")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_APP_DATE_LABEL"),
    text: data !== null && data !== void 0 && data.applicationDate ? format(new Date(data === null || data === void 0 ? void 0 : data.applicationDate), 'dd/MM/yyyy') : data === null || data === void 0 ? void 0 : data.applicationDate
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"),
    text: t("WF_BPA_" + (data === null || data === void 0 ? void 0 : data.appliactionType))
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"),
    text: t(data === null || data === void 0 ? void 0 : data.applicationSubType)
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_OCCUPANCY_LABEL"),
    text: data === null || data === void 0 ? void 0 : (_data$planDetail5 = data.planDetail) === null || _data$planDetail5 === void 0 ? void 0 : (_data$planDetail5$pla = _data$planDetail5.planInformation) === null || _data$planDetail5$pla === void 0 ? void 0 : _data$planDetail5$pla.occupancy
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_RISK_TYPE_LABEL"),
    text: t("WF_BPA_" + Digit.Utils.obps.calculateRiskType(mdmsData === null || mdmsData === void 0 ? void 0 : (_mdmsData$BPA2 = mdmsData.BPA) === null || _mdmsData$BPA2 === void 0 ? void 0 : _mdmsData$BPA2.RiskTypeComputation, data === null || data === void 0 ? void 0 : (_data$planDetail6 = data.planDetail) === null || _data$planDetail6 === void 0 ? void 0 : (_data$planDetail6$plo = _data$planDetail6.plot) === null || _data$planDetail6$plo === void 0 ? void 0 : _data$planDetail6$plo.area, data === null || data === void 0 ? void 0 : (_data$planDetail7 = data.planDetail) === null || _data$planDetail7 === void 0 ? void 0 : _data$planDetail7.blocks))
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL"),
    text: data === null || data === void 0 ? void 0 : (_data$planDetail8 = data.planDetail) === null || _data$planDetail8 === void 0 ? void 0 : (_data$planDetail8$pla = _data$planDetail8.planInformation) === null || _data$planDetail8$pla === void 0 ? void 0 : _data$planDetail8$pla.applicantName
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BASIC_DETAILS_SPECIAL_CATEGORY_LABEL"),
    text: 'None'
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("CS_COMMON_NEXT"),
    onSubmit: handleSubmit
  })));
};

var DocsRequired = function DocsRequired(_ref) {
  var _data$, _data$$docTypes;

  var onSelect = _ref.onSelect;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var state = tenantId.split(".")[0];
  var history = reactRouterDom.useHistory();

  var _Digit$Hooks$obps$use = Digit.Hooks.obps.useMDMS(state, "BPA", "DocumentTypes"),
      data = _Digit$Hooks$obps$use.data,
      isLoading = _Digit$Hooks$obps$use.isLoading;

  var goNext = function goNext() {
    var _history$location, _history$location$sta;

    if (history !== null && history !== void 0 && (_history$location = history.location) !== null && _history$location !== void 0 && (_history$location$sta = _history$location.state) !== null && _history$location$sta !== void 0 && _history$location$sta.edcrNumber) {
      var _history$location2, _history$location2$st;

      onSelect("edcrNumber", {
        edcrNumber: history === null || history === void 0 ? void 0 : (_history$location2 = history.location) === null || _history$location2 === void 0 ? void 0 : (_history$location2$st = _history$location2.state) === null || _history$location2$st === void 0 ? void 0 : _history$location2$st.edcrNumber
      });
    } else {
      onSelect();
    }
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("OBPS_NEW_BUILDING_PERMIT")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CitizenInfoLabel, {
    text: t("OBPS_DOCS_REQUIRED_TIME"),
    showInfo: false
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, {
    style: {
      color: "#0B0C0C",
      marginTop: "12px"
    }
  }, t("OBPS_NEW_BUILDING_PERMIT_DESCRIPTION")), isLoading ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null) : /*#__PURE__*/React__default.createElement(React.Fragment, null, data === null || data === void 0 ? void 0 : (_data$ = data[0]) === null || _data$ === void 0 ? void 0 : (_data$$docTypes = _data$.docTypes) === null || _data$$docTypes === void 0 ? void 0 : _data$$docTypes.map(function (doc, index) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      style: {
        fontWeight: 700
      },
      key: index
    }, index + 1 + ". " + t(doc === null || doc === void 0 ? void 0 : doc.code.replace('.', '_')));
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("CS_COMMON_NEXT"),
    onSubmit: goNext
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CitizenInfoLabel, {
    text: t("OBPS_DOCS_FILE_SIZE")
  }));
};

var PlotDetails = function PlotDetails(_ref) {
  var _formData$data, _data$planDetail, _data$planDetail$plan, _data$planDetail2, _data$planDetail2$pla, _data$planDetail3, _data$planDetail3$pla;

  var formData = _ref.formData,
      onSelect = _ref.onSelect,
      config = _ref.config;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useState = React.useState("");

  var _useState2 = React.useState("");

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$Hooks$obps$use = Digit.Hooks.obps.useScrutinyDetails("pb.amritsar", formData === null || formData === void 0 ? void 0 : (_formData$data = formData.data) === null || _formData$data === void 0 ? void 0 : _formData$data.scrutinyNumber),
      data = _Digit$Hooks$obps$use.data,
      isLoading = _Digit$Hooks$obps$use.isLoading;

  var handleSubmit = function handleSubmit(data) {
    onSelect(config === null || config === void 0 ? void 0 : config.key, _extends({}, data));
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Timeline, null), /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    config: config,
    onSelect: handleSubmit,
    childrenAtTheBottom: false,
    t: t,
    _defaultValues: formData === null || formData === void 0 ? void 0 : formData.data
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BOUNDARY_PLOT_AREA_LABEL"),
    text: data === null || data === void 0 ? void 0 : (_data$planDetail = data.planDetail) === null || _data$planDetail === void 0 ? void 0 : (_data$planDetail$plan = _data$planDetail.planInformation) === null || _data$planDetail$plan === void 0 ? void 0 : _data$planDetail$plan.plotArea
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BOUNDARY_PLOT_NO_LABEL"),
    text: data === null || data === void 0 ? void 0 : (_data$planDetail2 = data.planDetail) === null || _data$planDetail2 === void 0 ? void 0 : (_data$planDetail2$pla = _data$planDetail2.planInformation) === null || _data$planDetail2$pla === void 0 ? void 0 : _data$planDetail2$pla.plotNo
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: t("BPA_BOUNDARY_KHATA_NO_LABEL"),
    text: data === null || data === void 0 ? void 0 : (_data$planDetail3 = data.planDetail) === null || _data$planDetail3 === void 0 ? void 0 : (_data$planDetail3$pla = _data$planDetail3.planInformation) === null || _data$planDetail3$pla === void 0 ? void 0 : _data$planDetail3$pla.khataNo
  }))));
};

var ScrutinyDetails = function ScrutinyDetails(_ref) {
  var _formData$landInfo, _formData$data, _data$planDetail2, _data$planDetail2$blo, _data$planDetail2$blo2, _data$planDetail2$blo3, _data$planDetail3, _data$planDetail3$blo, _data$planDetail3$blo2, _data$planDetail3$blo3, _data$planDetail4, _data$planDetail4$blo, _data$planDetail4$blo2, _data$planDetail4$blo3, _data$planDetail5, _data$planDetail6, _data$planDetail6$pla;

  var onSelect = _ref.onSelect,
      formData = _ref.formData,
      config = _ref.config;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();

  var _useState = React.useState([]),
      setsubOccupancy = _useState[1];

  var _useState2 = React.useState((formData === null || formData === void 0 ? void 0 : formData.subOccupancy) || (formData === null || formData === void 0 ? void 0 : (_formData$landInfo = formData.landInfo) === null || _formData$landInfo === void 0 ? void 0 : _formData$landInfo.unit) || {}),
      subOccupancyObject = _useState2[0],
      setsubOccupancyObject = _useState2[1];

  var _useState3 = React.useState([]);

  var _useState4 = React.useState([]);
  var user = Digit.UserService.getUser();
  var tenantId = user.info.permanentCity;

  var _Digit$Hooks$obps$use = Digit.Hooks.obps.useScrutinyDetails(tenantId, formData === null || formData === void 0 ? void 0 : (_formData$data = formData.data) === null || _formData$data === void 0 ? void 0 : _formData$data.scrutinyNumber, {
    enabled: true
  }),
      data = _Digit$Hooks$obps$use.data;

  console.log(data, "data from api");

  function getFloorData(block) {
    var _block$building;

    var floors = [];
    block === null || block === void 0 ? void 0 : (_block$building = block.building) === null || _block$building === void 0 ? void 0 : _block$building.floors.map(function (ob) {
      var _ob$occupancies, _ob$occupancies$, _ob$occupancies2, _ob$occupancies2$, _ob$occupancies3, _ob$occupancies3$, _ob$occupancies4, _ob$occupancies4$;

      floors.push({
        Floor: t("BPA_FLOOR_NAME_" + ob.number),
        Level: ob.number,
        Occupancy: t("" + ((_ob$occupancies = ob.occupancies) === null || _ob$occupancies === void 0 ? void 0 : (_ob$occupancies$ = _ob$occupancies[0]) === null || _ob$occupancies$ === void 0 ? void 0 : _ob$occupancies$.type)),
        BuildupArea: (_ob$occupancies2 = ob.occupancies) === null || _ob$occupancies2 === void 0 ? void 0 : (_ob$occupancies2$ = _ob$occupancies2[0]) === null || _ob$occupancies2$ === void 0 ? void 0 : _ob$occupancies2$.builtUpArea,
        FloorArea: ((_ob$occupancies3 = ob.occupancies) === null || _ob$occupancies3 === void 0 ? void 0 : (_ob$occupancies3$ = _ob$occupancies3[0]) === null || _ob$occupancies3$ === void 0 ? void 0 : _ob$occupancies3$.floorArea) || 0,
        CarpetArea: ((_ob$occupancies4 = ob.occupancies) === null || _ob$occupancies4 === void 0 ? void 0 : (_ob$occupancies4$ = _ob$occupancies4[0]) === null || _ob$occupancies4$ === void 0 ? void 0 : _ob$occupancies4$.CarpetArea) || 0,
        key: t("BPA_FLOOR_NAME_" + ob.number)
      });
    });
    return floors;
  }

  function getsuboptions() {
    var _data$planDetail, _data$planDetail$mdms;

    var suboccoption = [];
    data && (data === null || data === void 0 ? void 0 : (_data$planDetail = data.planDetail) === null || _data$planDetail === void 0 ? void 0 : (_data$planDetail$mdms = _data$planDetail.mdmsMasterData) === null || _data$planDetail$mdms === void 0 ? void 0 : _data$planDetail$mdms.SubOccupancyType.map(function (ob) {
      suboccoption.push({
        code: ob.code,
        name: ob.name,
        i18nKey: "BPA_SUBOCCUPANCYTYPE_" + ob.code.replaceAll("-", "_")
      });
    }));
    return suboccoption;
  }

  var ActionButton = function ActionButton(_ref2) {
    var label = _ref2.label,
        jumpTo = _ref2.jumpTo;

    var _useTranslation2 = reactI18next.useTranslation(),
        t = _useTranslation2.t;

    var history = reactRouterDom.useHistory();

    function routeTo() {
      location.href = jumpTo;
    }

    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
      label: t(label),
      onClick: routeTo
    });
  };

  var tableHeader = [{
    name: "BPA_TABLE_COL_FLOOR",
    id: "Floor"
  }, {
    name: "BPA_TABLE_COL_LEVEL",
    id: "Level"
  }, {
    name: "BPA_TABLE_COL_OCCUPANCY",
    id: "Occupancy"
  }, {
    name: "BPA_TABLE_COL_BUILDUPAREA",
    id: "BuildupArea"
  }, {
    name: "BPA_TABLE_COL_FLOORAREA",
    id: "FloorArea"
  }, {
    name: "BPA_TABLE_COL_CARPETAREA",
    id: "CarpetArea"
  }];

  var selectOccupancy = function selectOccupancy(e, data, num) {
    var blocks = subOccupancyObject;
    var index = subOccupancyObject["Block_" + num] ? subOccupancyObject["Block_" + num].filter(function (ele) {
      return ele.code == data.code;
    }) : [];
    var subOccupancy1 = subOccupancyObject["Block_" + num] ? subOccupancyObject["Block_" + num] : [];
    var res = null;

    if (index.length) {
      subOccupancy1.splice(subOccupancy1.indexOf(index[0]), 1);
      res = [].concat(subOccupancy1);
    } else {
      res = [_extends({}, data)].concat(subOccupancy1);
    }

    blocks["Block_" + num] = res;
    setsubOccupancy(res);
    setsubOccupancyObject(blocks);
  };

  var onRemove = function onRemove(index, key, num) {
    var afterRemove = subOccupancyObject["Block_" + num].filter(function (value, i) {
      return i !== index;
    });
    setsubOccupancy(afterRemove);
    var temp = subOccupancyObject;
    temp["Block_" + num] = afterRemove;
    setsubOccupancyObject(temp);
  };

  var accessData = function accessData(plot) {
    var name = plot;
    return function (originalRow, rowIndex, columns) {
      return originalRow[name];
    };
  };

  var tableColumns = React.useMemo(function () {
    return tableHeader.map(function (ob) {
      return {
        Header: t("" + ob.name),
        accessor: accessData(ob.id),
        id: ob.id
      };
    });
  });

  var onSkip = function onSkip() {};

  var goNext = function goNext() {
    onSelect(config.key, subOccupancyObject);
  };

  var clearall = function clearall(num) {
    var res = [];
    var temp = subOccupancyObject;
    temp["Block_" + num] = res;
    setsubOccupancy(res);
    setsubOccupancyObject(temp);
  };

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(Timeline, null), /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    t: t,
    config: config,
    onSelect: goNext,
    onSkip: onSkip,
    isDisabled: !subOccupancyObject
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("BPA_EDCR_DETAILS")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, {
    style: {
      border: "none"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    style: {
      border: "none"
    },
    label: "BPA_EDCR_NO_LABEL",
    text: data === null || data === void 0 ? void 0 : data.edcrNumber
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_UPLOADED_PLAN_DIAGRAM",
    text: /*#__PURE__*/React__default.createElement(ActionButton, {
      label: "BPA_UPLOADED_PLAN",
      jumpTo: data === null || data === void 0 ? void 0 : data.updatedDxfFile
    })
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_SCRUNTINY_REPORT_OUTPUT",
    text: /*#__PURE__*/React__default.createElement(ActionButton, {
      label: "BPA_SCRUTINY_REPORT_PDF",
      jumpTo: data === null || data === void 0 ? void 0 : data.planReport
    })
  })), /*#__PURE__*/React__default.createElement("hr", {
    style: {
      color: "#cccccc",
      backgroundColor: "#cccccc",
      height: "2px",
      marginTop: "20px",
      marginBottom: "20px"
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("BPA_BUILDING_EXTRACT_HEADER")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, {
    style: {
      border: "none"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_BUILTUP_AREA_HEADER",
    text: data === null || data === void 0 ? void 0 : (_data$planDetail2 = data.planDetail) === null || _data$planDetail2 === void 0 ? void 0 : (_data$planDetail2$blo = _data$planDetail2.blocks) === null || _data$planDetail2$blo === void 0 ? void 0 : (_data$planDetail2$blo2 = _data$planDetail2$blo[0]) === null || _data$planDetail2$blo2 === void 0 ? void 0 : (_data$planDetail2$blo3 = _data$planDetail2$blo2.building) === null || _data$planDetail2$blo3 === void 0 ? void 0 : _data$planDetail2$blo3.totalBuitUpArea
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_SCRUTINY_DETAILS_NUMBER_OF_FLOORS_LABEL",
    text: data === null || data === void 0 ? void 0 : (_data$planDetail3 = data.planDetail) === null || _data$planDetail3 === void 0 ? void 0 : (_data$planDetail3$blo = _data$planDetail3.blocks) === null || _data$planDetail3$blo === void 0 ? void 0 : (_data$planDetail3$blo2 = _data$planDetail3$blo[0]) === null || _data$planDetail3$blo2 === void 0 ? void 0 : (_data$planDetail3$blo3 = _data$planDetail3$blo2.building) === null || _data$planDetail3$blo3 === void 0 ? void 0 : _data$planDetail3$blo3.totalFloors
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    className: "border-none",
    label: "BPA_APPLICATION_HIGH_FROM_GROUND",
    text: data === null || data === void 0 ? void 0 : (_data$planDetail4 = data.planDetail) === null || _data$planDetail4 === void 0 ? void 0 : (_data$planDetail4$blo = _data$planDetail4.blocks) === null || _data$planDetail4$blo === void 0 ? void 0 : (_data$planDetail4$blo2 = _data$planDetail4$blo[0]) === null || _data$planDetail4$blo2 === void 0 ? void 0 : (_data$planDetail4$blo3 = _data$planDetail4$blo2.building) === null || _data$planDetail4$blo3 === void 0 ? void 0 : _data$planDetail4$blo3.declaredBuildingHeight
  })), /*#__PURE__*/React__default.createElement("hr", {
    style: {
      color: "#cccccc",
      backgroundColor: "#cccccc",
      height: "2px",
      marginTop: "20px",
      marginBottom: "20px"
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("BPA_OCC_SUBOCC_HEADER")), data === null || data === void 0 ? void 0 : (_data$planDetail5 = data.planDetail) === null || _data$planDetail5 === void 0 ? void 0 : _data$planDetail5.blocks.map(function (block, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: index
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("Block"), " ", index + 1), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSectionHeader, {
      className: "card-label-smaller"
    }, t("BPA_SUB_OCCUPANCY_LABEL")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.MultiSelectDropdown, {
      BlockNumber: block.number,
      className: "form-field",
      isMandatory: true,
      defaultUnit: "Selected",
      selected: subOccupancyObject["Block_" + block.number],
      options: getsuboptions(),
      onSelect: selectOccupancy,
      isOBPSMultiple: true,
      optionsKey: "name",
      t: t
    }), /*#__PURE__*/React__default.createElement("div", {
      className: "tag-container"
    }, subOccupancyObject["Block_" + block.number] && subOccupancyObject["Block_" + block.number].length > 0 && subOccupancyObject["Block_" + block.number].map(function (value, index) {
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.RemoveableTag, {
        key: index,
        text: "" + t(value["name"]),
        onClick: function onClick() {
          return onRemove(index, value, block.number);
        }
      });
    })), subOccupancyObject["Block_" + block.number] && /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
      label: "Clear All",
      onClick: function onClick() {
        return clearall(block.number);
      }
    }), /*#__PURE__*/React__default.createElement("div", {
      style: {
        overflow: "scroll"
      }
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Table, {
      className: "customTable",
      t: t,
      disableSort: false,
      autoSort: true,
      manualPagination: false,
      isPaginationRequired: false,
      initSortId: "S N ",
      data: getFloorData(block),
      columns: tableColumns,
      getCellProps: function getCellProps(cellInfo) {
        return {
          style: {}
        };
      }
    }), /*#__PURE__*/React__default.createElement("hr", {
      style: {
        color: "#cccccc",
        backgroundColor: "#cccccc",
        height: "2px",
        marginTop: "20px",
        marginBottom: "20px"
      }
    })));
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, {
    style: {
      border: "none"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: "BPA_APPLICATION_DEMOLITION_AREA_LABEL",
    text: data === null || data === void 0 ? void 0 : (_data$planDetail6 = data.planDetail) === null || _data$planDetail6 === void 0 ? void 0 : (_data$planDetail6$pla = _data$planDetail6.planInformation) === null || _data$planDetail6$pla === void 0 ? void 0 : _data$planDetail6$pla.demolitionArea
  }))));
};

var OwnerDetails = function OwnerDetails(_ref) {
  var _formData$owners, _formData$owners2, _formData$owners3, _formData$owners4, _formData$owners5;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;
  var validation = {};
  var isedittrade = window.location.href.includes("edit-application");
  var isrenewtrade = window.location.href.includes("renew-trade");
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState = React.useState(isedittrade || isrenewtrade ? false : true),
      canmovenext = _useState[0],
      setCanmovenext = _useState[1];

  var _useState2 = React.useState([]),
      ownershipCategoryList = _useState2[0],
      setOwnershipCategoryList = _useState2[1];

  var _useState3 = React.useState([]),
      genderList = _useState3[0],
      setGenderList = _useState3[1];

  var _useState4 = React.useState(formData === null || formData === void 0 ? void 0 : (_formData$owners = formData.owners) === null || _formData$owners === void 0 ? void 0 : _formData$owners.ownershipCategory),
      ownershipCategory = _useState4[0],
      setOwnershipCategory = _useState4[1];

  var _useState5 = React.useState((formData === null || formData === void 0 ? void 0 : (_formData$owners2 = formData.owners) === null || _formData$owners2 === void 0 ? void 0 : _formData$owners2.name) || ""),
      setName = _useState5[1];

  var _useState6 = React.useState(false),
      setisPrimaryOwner = _useState6[1];

  var _useState7 = React.useState(formData === null || formData === void 0 ? void 0 : (_formData$owners3 = formData.owners) === null || _formData$owners3 === void 0 ? void 0 : _formData$owners3.gender),
      gender = _useState7[0],
      setGender = _useState7[1];

  var _useState8 = React.useState((formData === null || formData === void 0 ? void 0 : (_formData$owners4 = formData.owners) === null || _formData$owners4 === void 0 ? void 0 : _formData$owners4.mobileNumber) || ""),
      setMobileNumber = _useState8[1];

  var ismultiple = ownershipCategory !== null && ownershipCategory !== void 0 && ownershipCategory.code.includes("MULTIPLEOWNERS") ? true : false;

  var _useState9 = React.useState((formData === null || formData === void 0 ? void 0 : formData.owners) && (formData === null || formData === void 0 ? void 0 : (_formData$owners5 = formData.owners) === null || _formData$owners5 === void 0 ? void 0 : _formData$owners5.owners) || [{
    name: "",
    gender: "",
    mobileNumber: null,
    isPrimaryOwner: true
  }]),
      fields = _useState9[0],
      setFeilds = _useState9[1];

  React.useEffect(function () {
    fields.map(function (ob) {
      if (ob.name && ob.mobileNumber && ob.gender) {
        setCanmovenext(false);
      } else {
        setCanmovenext(true);
      }
    });
  }, [fields]);

  var _Digit$Hooks$obps$use = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["OwnerShipCategory"]),
      isLoading = _Digit$Hooks$obps$use.isLoading,
      ownerShipCategories = _Digit$Hooks$obps$use.data;

  var _Digit$Hooks$obps$use2 = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["GenderType"]),
      genderTypeData = _Digit$Hooks$obps$use2.data;

  React.useEffect(function () {
    var _ownerShipCategories$;

    var ownershipCategoryLists = ownerShipCategories === null || ownerShipCategories === void 0 ? void 0 : (_ownerShipCategories$ = ownerShipCategories["common-masters"]) === null || _ownerShipCategories$ === void 0 ? void 0 : _ownerShipCategories$.OwnerShipCategory;

    if (ownershipCategoryLists && (ownershipCategoryLists === null || ownershipCategoryLists === void 0 ? void 0 : ownershipCategoryLists.length) > 0) {
      var finalOwnershipCategoryList = ownershipCategoryLists.filter(function (data) {
        var _data$code;

        return data === null || data === void 0 ? void 0 : (_data$code = data.code) === null || _data$code === void 0 ? void 0 : _data$code.includes("INDIVIDUAL");
      });
      finalOwnershipCategoryList.forEach(function (data) {
        data.i18nKey = "COMMON_MASTERS_OWNERSHIPCATEGORY_" + stringReplaceAll(data === null || data === void 0 ? void 0 : data.code, ".", "_");
      });
      setOwnershipCategoryList(finalOwnershipCategoryList);
    }
  }, [ownerShipCategories]);
  React.useEffect(function () {
    var _genderTypeData$commo;

    var gendeTypeMenu = (genderTypeData === null || genderTypeData === void 0 ? void 0 : (_genderTypeData$commo = genderTypeData["common-masters"]) === null || _genderTypeData$commo === void 0 ? void 0 : _genderTypeData$commo.GenderType) || [];

    if (gendeTypeMenu && (gendeTypeMenu === null || gendeTypeMenu === void 0 ? void 0 : gendeTypeMenu.length) > 0) {
      var genderFilterTypeMenu = gendeTypeMenu.filter(function (data) {
        return data.active;
      });
      genderFilterTypeMenu.forEach(function (data) {
        data.i18nKey = "COMMON_GENDER_" + data.code;
      });
      setGenderList(genderFilterTypeMenu);
    }
  }, [genderTypeData]);

  function selectedValue(value) {
    setOwnershipCategory(value);
  }

  function handleAdd() {
    var values = [].concat(fields);
    values.push({
      name: "",
      gender: "",
      mobileNumber: null,
      isPrimaryOwner: false
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

    if (units[i].gender && units[i].mobileNumber && units[i].name) {
      setCanmovenext(false);
    }
  }

  function setGenderName(i, value) {
    var units = [].concat(fields);
    units[i].gender = value;
    setGender(value);
    setFeilds(units);

    if (units[i].gender && units[i].mobileNumber && units[i].name) {
      setCanmovenext(false);
    }
  }

  function setMobileNo(i, e) {
    var units = [].concat(fields);
    units[i].mobileNumber = e.target.value;
    setMobileNumber(e.target.value);
    setFeilds(units);

    if (units[i].gender && units[i].mobileNumber && units[i].name) {
      setCanmovenext(false);
    }
  }

  function setPrimaryOwner(i, e) {
    var units = [].concat(fields);
    units.map(function (units) {
      units.isPrimaryOwner = false;
    });
    units[i].isPrimaryOwner = ismultiple ? e.target.checked : true;
    setisPrimaryOwner(e.target.checked);
    setFeilds(units);
  }

  var _useState10 = React.useState(null),
      error = _useState10[0],
      setError = _useState10[1];

  React.useEffect(function () {
    console.log("Error Loged", error);
  }, [error]);

  function getusageCategoryAPI(arr) {
    var usageCat = "";
    arr.map(function (ob, i) {
      usageCat = usageCat + (i !== 0 ? "," : "") + ob.code;
    });
    return usageCat;
  }

  function getUnitsForAPI(ob) {
    var units = [];

    if (ob) {
      var result = Object.entries(ob);
      result.map(function (unit, index) {
        units.push({
          blockIndex: index,
          floorNo: unit[0].split("_")[1],
          unitType: "Block",
          usageCategory: getusageCategoryAPI(unit[1])
        });
      });
    }

    return units;
  }

  function getBlockIds(arr) {
    var blockId = {};
    arr.map(function (ob, ind) {
      blockId["Block_" + ob.floorNo] = ob.id;
    });
    return blockId;
  }

  var goNext = function goNext() {
    setError(null);

    if (ismultiple == true && fields.length == 1) {
      setError("TL_ERROR_MULTIPLE_OWNER");
    } else {
      var owner = formData.owners;
      var ownerStep;
      ownerStep = _extends({}, owner, {
        owners: fields,
        ownershipCategory: ownershipCategory
      });

      if (!(formData !== null && formData !== void 0 && formData.id)) {
        var _ownerStep, _ownerStep$owners, _formData$edcrNumber, _formData$edcrNumber2, _formData$data, _formData$data$scruti, _formData$data2, _formData$data3, _formData$data4, _userInfo$info, _formData$address, _formData$address$cit, _formData$data5, _formData$data6, _formData$data7, _formData$data8, _formData$address2, _formData$address2$ci, _formData$address3, _formData$address3$ci, _formData$address4, _formData$address4$lo, _formData$address5, _formData$address5$lo, _formData$address6, _formData$address7, _formData$address8, _formData$address9, _formData$address10, _formData$address11, _formData$address12, _formData$address13, _formData$address14, _formData$address14$c;

        var conversionOwners = [];
        (_ownerStep = ownerStep) === null || _ownerStep === void 0 ? void 0 : (_ownerStep$owners = _ownerStep.owners) === null || _ownerStep$owners === void 0 ? void 0 : _ownerStep$owners.map(function (owner) {
          conversionOwners.push({
            name: owner.name,
            mobileNumber: owner.mobileNumber,
            isPrimaryOwner: owner.isPrimaryOwner,
            gender: owner.gender.code,
            fatherOrHusbandName: "NAME"
          });
        });
        var payload = {};
        payload.edcrNumber = formData !== null && formData !== void 0 && (_formData$edcrNumber = formData.edcrNumber) !== null && _formData$edcrNumber !== void 0 && _formData$edcrNumber.edcrNumber ? formData === null || formData === void 0 ? void 0 : (_formData$edcrNumber2 = formData.edcrNumber) === null || _formData$edcrNumber2 === void 0 ? void 0 : _formData$edcrNumber2.edcrNumber : formData === null || formData === void 0 ? void 0 : (_formData$data = formData.data) === null || _formData$data === void 0 ? void 0 : (_formData$data$scruti = _formData$data.scrutinyNumber) === null || _formData$data$scruti === void 0 ? void 0 : _formData$data$scruti.edcrNumber;
        payload.riskType = formData === null || formData === void 0 ? void 0 : (_formData$data2 = formData.data) === null || _formData$data2 === void 0 ? void 0 : _formData$data2.riskType;
        payload.applicationType = formData === null || formData === void 0 ? void 0 : (_formData$data3 = formData.data) === null || _formData$data3 === void 0 ? void 0 : _formData$data3.applicationType;
        payload.serviceType = formData === null || formData === void 0 ? void 0 : (_formData$data4 = formData.data) === null || _formData$data4 === void 0 ? void 0 : _formData$data4.serviceType;
        var userInfo = Digit.UserService.getUser();
        var accountId = userInfo === null || userInfo === void 0 ? void 0 : (_userInfo$info = userInfo.info) === null || _userInfo$info === void 0 ? void 0 : _userInfo$info.uuid;
        payload.tenantId = formData === null || formData === void 0 ? void 0 : (_formData$address = formData.address) === null || _formData$address === void 0 ? void 0 : (_formData$address$cit = _formData$address.city) === null || _formData$address$cit === void 0 ? void 0 : _formData$address$cit.code;
        payload.workflow = {
          action: "INITIATE"
        };
        payload.accountId = accountId;
        payload.documents = null;
        payload.additionalDetails = {};
        if (formData !== null && formData !== void 0 && (_formData$data5 = formData.data) !== null && _formData$data5 !== void 0 && _formData$data5.holdingNumber) payload.additionalDetails.holdingNo = formData === null || formData === void 0 ? void 0 : (_formData$data6 = formData.data) === null || _formData$data6 === void 0 ? void 0 : _formData$data6.holdingNumber;
        if (formData !== null && formData !== void 0 && (_formData$data7 = formData.data) !== null && _formData$data7 !== void 0 && _formData$data7.registrationDetails) payload.additionalDetails.registrationDetails = formData === null || formData === void 0 ? void 0 : (_formData$data8 = formData.data) === null || _formData$data8 === void 0 ? void 0 : _formData$data8.registrationDetails;
        payload.landInfo = {};
        payload.landInfo.address = {};
        if (formData !== null && formData !== void 0 && (_formData$address2 = formData.address) !== null && _formData$address2 !== void 0 && (_formData$address2$ci = _formData$address2.city) !== null && _formData$address2$ci !== void 0 && _formData$address2$ci.code) payload.landInfo.address.city = formData === null || formData === void 0 ? void 0 : (_formData$address3 = formData.address) === null || _formData$address3 === void 0 ? void 0 : (_formData$address3$ci = _formData$address3.city) === null || _formData$address3$ci === void 0 ? void 0 : _formData$address3$ci.code;
        if (formData !== null && formData !== void 0 && (_formData$address4 = formData.address) !== null && _formData$address4 !== void 0 && (_formData$address4$lo = _formData$address4.locality) !== null && _formData$address4$lo !== void 0 && _formData$address4$lo.code) payload.landInfo.address.locality = {
          code: formData === null || formData === void 0 ? void 0 : (_formData$address5 = formData.address) === null || _formData$address5 === void 0 ? void 0 : (_formData$address5$lo = _formData$address5.locality) === null || _formData$address5$lo === void 0 ? void 0 : _formData$address5$lo.code
        };
        if (formData !== null && formData !== void 0 && (_formData$address6 = formData.address) !== null && _formData$address6 !== void 0 && _formData$address6.pincode) payload.landInfo.address.pincode = formData === null || formData === void 0 ? void 0 : (_formData$address7 = formData.address) === null || _formData$address7 === void 0 ? void 0 : _formData$address7.pincode;
        if (formData !== null && formData !== void 0 && (_formData$address8 = formData.address) !== null && _formData$address8 !== void 0 && _formData$address8.Landmark) payload.landInfo.address.landmark = formData === null || formData === void 0 ? void 0 : (_formData$address9 = formData.address) === null || _formData$address9 === void 0 ? void 0 : _formData$address9.Landmark;
        if (formData !== null && formData !== void 0 && (_formData$address10 = formData.address) !== null && _formData$address10 !== void 0 && _formData$address10.street) payload.landInfo.address.street = formData === null || formData === void 0 ? void 0 : (_formData$address11 = formData.address) === null || _formData$address11 === void 0 ? void 0 : _formData$address11.street;
        if (formData !== null && formData !== void 0 && (_formData$address12 = formData.address) !== null && _formData$address12 !== void 0 && _formData$address12.geoLocation) payload.landInfo.address.geoLocation = formData === null || formData === void 0 ? void 0 : (_formData$address13 = formData.address) === null || _formData$address13 === void 0 ? void 0 : _formData$address13.geoLocation;
        payload.landInfo.owners = conversionOwners;
        payload.landInfo.ownershipCategory = ownershipCategory.code;
        payload.landInfo.tenantId = formData === null || formData === void 0 ? void 0 : (_formData$address14 = formData.address) === null || _formData$address14 === void 0 ? void 0 : (_formData$address14$c = _formData$address14.city) === null || _formData$address14$c === void 0 ? void 0 : _formData$address14$c.code;
        payload.landInfo.unit = getUnitsForAPI(formData === null || formData === void 0 ? void 0 : formData.subOccupancy);
        Digit.OBPSService.create({
          BPA: payload
        }, tenantId).then(function (result, err) {
          var _result$BPA;

          if ((result === null || result === void 0 ? void 0 : (_result$BPA = result.BPA) === null || _result$BPA === void 0 ? void 0 : _result$BPA.length) > 0) {
            var _result$BPA2, _result$BPA2$, _result$BPA2$$landInf, _result$BPA2$$landInf2, _result$BPA3, _result$BPA3$, _result$BPA3$$landInf, _result$BPA4, _result$BPA4$, _result$BPA4$$landInf;

            result === null || result === void 0 ? void 0 : (_result$BPA2 = result.BPA) === null || _result$BPA2 === void 0 ? void 0 : (_result$BPA2$ = _result$BPA2[0]) === null || _result$BPA2$ === void 0 ? void 0 : (_result$BPA2$$landInf = _result$BPA2$.landInfo) === null || _result$BPA2$$landInf === void 0 ? void 0 : (_result$BPA2$$landInf2 = _result$BPA2$$landInf.owners) === null || _result$BPA2$$landInf2 === void 0 ? void 0 : _result$BPA2$$landInf2.forEach(function (owner) {
              owner.gender = {
                code: owner.gender,
                active: true,
                i18nKey: "COMMON_GENDER_" + owner.gender
              };
            });
            result.BPA[0].owners = _extends({}, owner, {
              owners: result === null || result === void 0 ? void 0 : (_result$BPA3 = result.BPA) === null || _result$BPA3 === void 0 ? void 0 : (_result$BPA3$ = _result$BPA3[0]) === null || _result$BPA3$ === void 0 ? void 0 : (_result$BPA3$$landInf = _result$BPA3$.landInfo) === null || _result$BPA3$$landInf === void 0 ? void 0 : _result$BPA3$$landInf.owners,
              ownershipCategory: ownershipCategory
            });
            result.BPA[0].address = result === null || result === void 0 ? void 0 : (_result$BPA4 = result.BPA) === null || _result$BPA4 === void 0 ? void 0 : (_result$BPA4$ = _result$BPA4[0]) === null || _result$BPA4$ === void 0 ? void 0 : (_result$BPA4$$landInf = _result$BPA4$.landInfo) === null || _result$BPA4$$landInf === void 0 ? void 0 : _result$BPA4$$landInf.address;
            result.BPA[0].address.city = formData.address.city;
            result.BPA[0].address.locality = formData.address.locality;
            result.BPA[0].data = formData.data;
            result.BPA[0].BlockIds = getBlockIds(result.BPA[0].landInfo.unit);
            result.BPA[0].subOccupancy = formData === null || formData === void 0 ? void 0 : formData.subOccupancy;
            onSelect("", result.BPA[0], "", true);
          }
        }).catch(function (e) {});
      } else {
        onSelect(config.key, ownerStep);
      }
    }
  };

  var onSkip = function onSkip() {
    return onSelect();
  };

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    config: config,
    onSelect: goNext,
    onSkip: onSkip,
    t: t,
    isDisabled: canmovenext || !ownershipCategory,
    forcedError: t(error)
  }, /*#__PURE__*/React__default.createElement(Timeline, {
    currentStep: 2
  }), !isLoading ? /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, "" + t("BPA_TYPE_OF_OWNER_LABEL")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioButtons, {
    isMandatory: config.isMandatory,
    options: ownershipCategoryList,
    selectedOption: ownershipCategory,
    optionsKey: "i18nKey",
    onSelect: selectedValue,
    value: ownershipCategory,
    labelKey: "PT_OWNERSHIP",
    isDependent: true
  })), fields.map(function (field, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: field + "-" + index
    }, /*#__PURE__*/React__default.createElement("div", {
      style: {
        border: "solid",
        borderRadius: "5px",
        padding: "10px",
        paddingTop: "20px",
        marginTop: "10px",
        borderColor: "#f3f3f3",
        background: "#FAFAFA"
      }
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      style: ismultiple ? {
        marginBottom: "-15px"
      } : {}
    }, "" + t("CORE_COMMON_NAME")), ismultiple && /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
      label: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
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
      }, /*#__PURE__*/React__default.createElement("path", {
        d: "M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z",
        fill: !(fields.length == 1) ? "#494848" : "#FAFAFA"
      })))),
      style: {
        width: "100px",
        display: "inline",
        background: "black"
      },
      onClick: function onClick(e) {
        return handleRemove(index);
      }
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
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
    })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, "" + t("BPA_APPLICANT_GENDER_LABEL")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioButtons, {
      t: t,
      options: genderList,
      optionsKey: "code",
      name: "gender",
      value: gender,
      selectedOption: field.gender,
      onSelect: function onSelect(e) {
        return setGenderName(index, e);
      },
      isDependent: true,
      labelKey: "COMMON_GENDER"
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, "" + t("CORE_COMMON_MOBILE_NUMBER")), /*#__PURE__*/React__default.createElement("div", {
      className: "field-container"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "employee-card-input employee-card-input--front",
      style: {
        marginTop: "-1px"
      }
    }, "+91"), /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
      style: ismultiple ? {
        background: "#FAFAFA"
      } : {},
      type: "text",
      t: t,
      isMandatory: false,
      optionKey: "i18nKey",
      name: "mobileNumber",
      value: field.mobileNumber,
      onChange: function onChange(e) {
        return setMobileNo(index, e);
      }
    }, validation = {
      isRequired: true,
      pattern: "[6-9]{1}[0-9]{9}",
      type: "tel",
      title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")
    }))), ismultiple && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CheckBox, {
      label: t("BPA_IS_PRIMARY_OWNER_LABEL"),
      onChange: function onChange(e) {
        return setPrimaryOwner(index, e);
      },
      value: field.isPrimaryOwner,
      checked: field.isPrimaryOwner,
      style: {
        paddingTop: "10px"
      }
    })));
  }), ismultiple ? /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex",
      paddingBottom: "15px",
      color: "#FF8C00"
    }
  }, /*#__PURE__*/React__default.createElement("button", {
    type: "button",
    style: {
      paddingTop: "10px"
    },
    onClick: function onClick() {
      return handleAdd();
    }
  }, t("BPA_ADD_OWNER")))) : null) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null));
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

var DocumentDetails = function DocumentDetails(_ref) {
  var _formData$documents;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState = React.useState((formData === null || formData === void 0 ? void 0 : (_formData$documents = formData.documents) === null || _formData$documents === void 0 ? void 0 : _formData$documents.documents) || []),
      documents = _useState[0],
      setDocuments = _useState[1];

  var _useState2 = React.useState(null),
      error = _useState2[0],
      setError = _useState2[1];

  var _useState3 = React.useState([]),
      bpaTaxDocuments = _useState3[0],
      setBpaTaxDocuments = _useState3[1];

  var _useState4 = React.useState(true),
      enableSubmit = _useState4[0],
      setEnableSubmit = _useState4[1];

  var _useState5 = React.useState(false),
      checkRequiredFields = _useState5[0],
      setCheckRequiredFields = _useState5[1];

  var _Digit$Hooks$obps$use = Digit.Hooks.obps.useMDMS(stateId, "BPA", ["DocTypeMapping"]),
      bpaDocsLoading = _Digit$Hooks$obps$use.isLoading,
      bpaDocs = _Digit$Hooks$obps$use.data;

  var _Digit$Hooks$obps$use2 = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["DocumentType"]),
      commonDocsLoading = _Digit$Hooks$obps$use2.isLoading,
      commonDocs = _Digit$Hooks$obps$use2.data;

  React.useEffect(function () {
    var _bpaDocs$BPA, _filtredBpaDocs, _filtredBpaDocs$, _filtredBpaDocs$$docT;

    var filtredBpaDocs = [];

    if (bpaDocs !== null && bpaDocs !== void 0 && (_bpaDocs$BPA = bpaDocs.BPA) !== null && _bpaDocs$BPA !== void 0 && _bpaDocs$BPA.DocTypeMapping) {
      var _bpaDocs$BPA2, _bpaDocs$BPA2$DocType;

      filtredBpaDocs = bpaDocs === null || bpaDocs === void 0 ? void 0 : (_bpaDocs$BPA2 = bpaDocs.BPA) === null || _bpaDocs$BPA2 === void 0 ? void 0 : (_bpaDocs$BPA2$DocType = _bpaDocs$BPA2.DocTypeMapping) === null || _bpaDocs$BPA2$DocType === void 0 ? void 0 : _bpaDocs$BPA2$DocType.filter(function (data) {
        return data.WFState == "INITIATED" && data.RiskType == "LOW" && data.ServiceType == "NEW_CONSTRUCTION" && data.applicationType == "BUILDING_PLAN_SCRUTINY";
      });
    }

    var documentsList = [];
    (_filtredBpaDocs = filtredBpaDocs) === null || _filtredBpaDocs === void 0 ? void 0 : (_filtredBpaDocs$ = _filtredBpaDocs[0]) === null || _filtredBpaDocs$ === void 0 ? void 0 : (_filtredBpaDocs$$docT = _filtredBpaDocs$.docTypes) === null || _filtredBpaDocs$$docT === void 0 ? void 0 : _filtredBpaDocs$$docT.forEach(function (doc) {
      var _commonDocs$commonMa, _commonDocs$commonMa$;

      var code = doc.code;
      doc.dropdownData = [];
      commonDocs === null || commonDocs === void 0 ? void 0 : (_commonDocs$commonMa = commonDocs["common-masters"]) === null || _commonDocs$commonMa === void 0 ? void 0 : (_commonDocs$commonMa$ = _commonDocs$commonMa.DocumentType) === null || _commonDocs$commonMa$ === void 0 ? void 0 : _commonDocs$commonMa$.forEach(function (value) {
        var values = value.code.slice(0, code.length);

        if (code === values) {
          doc.hasDropdown = true;
          value.i18nKey = value.code;
          doc.dropdownData.push(value);
        }
      });
      documentsList.push(doc);
    });
    setBpaTaxDocuments(documentsList);
  }, [!bpaDocsLoading, !commonDocsLoading]);

  var handleSubmit = function handleSubmit() {
    var document = formData.documents;
    var documentStep;
    documentStep = _extends({}, document, {
      documents: documents
    });
    onSelect(config.key, documentStep);
  };

  var onSkip = function onSkip() {
    return onSelect();
  };

  function onAdd() {}

  React.useEffect(function () {
    var count = 0;
    bpaTaxDocuments.map(function (doc) {
      var isRequired = false;
      documents.map(function (data) {
        if (doc.required && doc.code == data.documentType.split('.')[0] + "." + data.documentType.split('.')[1]) {
          isRequired = true;
        }
      });

      if (!isRequired && doc.required) {
        count = count + 1;
      }
    });
    if ((count == "0" || count == 0) && documents.length > 0) setEnableSubmit(false);else setEnableSubmit(true);
  }, [documents, checkRequiredFields]);
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Timeline, {
    currentStep: 2
  }), !bpaDocsLoading ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    t: t,
    config: config,
    onSelect: handleSubmit,
    onSkip: onSkip,
    isDisabled: enableSubmit,
    onAdd: onAdd
  }, bpaTaxDocuments === null || bpaTaxDocuments === void 0 ? void 0 : bpaTaxDocuments.map(function (document, index) {
    return /*#__PURE__*/React__default.createElement(SelectDocument, {
      key: index,
      document: document,
      t: t,
      error: error,
      setError: setError,
      setDocuments: setDocuments,
      documents: documents,
      setCheckRequiredFields: setCheckRequiredFields
    });
  }), error && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    label: error,
    onClose: function onClose() {
      return setError(null);
    },
    error: true
  })) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null));
};

function SelectDocument(_ref2) {
  var _doc$dropdownData;

  var t = _ref2.t,
      doc = _ref2.document,
      setDocuments = _ref2.setDocuments,
      error = _ref2.error,
      setError = _ref2.setError,
      documents = _ref2.documents,
      setCheckRequiredFields = _ref2.setCheckRequiredFields;
  var filteredDocument = documents === null || documents === void 0 ? void 0 : documents.filter(function (item) {
    var _item$documentType;

    return item === null || item === void 0 ? void 0 : (_item$documentType = item.documentType) === null || _item$documentType === void 0 ? void 0 : _item$documentType.includes(doc === null || doc === void 0 ? void 0 : doc.code);
  })[0];
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useState6 = React.useState(filteredDocument ? _extends({}, filteredDocument, {
    active: true,
    code: filteredDocument === null || filteredDocument === void 0 ? void 0 : filteredDocument.documentType,
    i18nKey: filteredDocument === null || filteredDocument === void 0 ? void 0 : filteredDocument.documentType
  }) : (doc === null || doc === void 0 ? void 0 : (_doc$dropdownData = doc.dropdownData) === null || _doc$dropdownData === void 0 ? void 0 : _doc$dropdownData.length) === 1 ? doc === null || doc === void 0 ? void 0 : doc.dropdownData[0] : {}),
      selectedDocument = _useState6[0],
      setSelectedDocument = _useState6[1];

  var _useState7 = React.useState(null),
      file = _useState7[0],
      setFile = _useState7[1];

  var _useState8 = React.useState(function () {
    return (filteredDocument === null || filteredDocument === void 0 ? void 0 : filteredDocument.fileStoreId) || null;
  }),
      uploadedFile = _useState8[0],
      setUploadedFile = _useState8[1];

  var handleSelectDocument = function handleSelectDocument(value) {
    return setSelectedDocument(value);
  };

  function selectfile(e) {
    setFile(e.target.files[0]);
  }

  React.useEffect(function () {
    if (selectedDocument !== null && selectedDocument !== void 0 && selectedDocument.code) {
      setDocuments(function (prev) {
        var filteredDocumentsByDocumentType = prev === null || prev === void 0 ? void 0 : prev.filter(function (item) {
          return (item === null || item === void 0 ? void 0 : item.documentType) !== (selectedDocument === null || selectedDocument === void 0 ? void 0 : selectedDocument.code);
        });

        if ((uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.length) === 0 || uploadedFile === null) {
          return filteredDocumentsByDocumentType;
        }

        var filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType === null || filteredDocumentsByDocumentType === void 0 ? void 0 : filteredDocumentsByDocumentType.filter(function (item) {
          return (item === null || item === void 0 ? void 0 : item.fileStoreId) !== uploadedFile;
        });
        return [].concat(filteredDocumentsByFileStoreId, [{
          documentType: selectedDocument === null || selectedDocument === void 0 ? void 0 : selectedDocument.code,
          fileStoreId: uploadedFile,
          documentUid: uploadedFile
        }]);
      });
    }
  }, [uploadedFile, selectedDocument]);
  React.useEffect(function () {
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
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      marginBottom: "24px"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, doc !== null && doc !== void 0 && doc.required ? t(doc === null || doc === void 0 ? void 0 : doc.code) + " *" : "" + t(doc === null || doc === void 0 ? void 0 : doc.code)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    t: t,
    isMandatory: false,
    option: doc === null || doc === void 0 ? void 0 : doc.dropdownData,
    selected: selectedDocument,
    optionKey: "i18nKey",
    select: handleSelectDocument
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.UploadFile, {
    extraStyleName: "propertyCreate",
    accept: ".jpg,.png,.pdf",
    onUpload: selectfile,
    onDelete: function onDelete() {
      setUploadedFile(null);
      setCheckRequiredFields(true);
    },
    message: uploadedFile ? "1 " + t("CS_ACTION_FILEUPLOADED") : t("CS_ACTION_NO_FILEUPLOADED"),
    error: error
  }));
}

var NOCDetails = function NOCDetails(_ref) {
  var _formData$nocDocument;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState = React.useState((formData === null || formData === void 0 ? void 0 : (_formData$nocDocument = formData.nocDocuments) === null || _formData$nocDocument === void 0 ? void 0 : _formData$nocDocument.nocDocuments) || []),
      nocDocuments = _useState[0],
      setNocDocuments = _useState[1];

  var _useState2 = React.useState(null),
      error = _useState2[0],
      setError = _useState2[1];

  var _useState3 = React.useState([]),
      nocTaxDocuments = _useState3[0],
      setNocTaxDocuments = _useState3[1];

  var _useState4 = React.useState(true),
      enableSubmit = _useState4[0],
      setEnableSubmit = _useState4[1];

  var _useState5 = React.useState(false),
      checkRequiredFields = _useState5[0],
      setCheckRequiredFields = _useState5[1];

  var _useState6 = React.useState(formData === null || formData === void 0 ? void 0 : formData.applicationNo),
      sourceRefId = _useState6[0];

  var _useState7 = React.useState([]),
      nocDatils = _useState7[0],
      setNocDetails = _useState7[1];

  var _useState8 = React.useState([]),
      nocDocumentTypeMaping = _useState8[0],
      setNocDocumentTypeMaping = _useState8[1];

  var _useState9 = React.useState([]),
      commonDocMaping = _useState9[0],
      setCommonDocMaping = _useState9[1];

  var _Digit$Hooks$obps$use = Digit.Hooks.obps.useNocDetails(formData === null || formData === void 0 ? void 0 : formData.tenantId, {
    sourceRefId: sourceRefId
  }),
      data = _Digit$Hooks$obps$use.data;

  var _Digit$Hooks$obps$use2 = Digit.Hooks.obps.useMDMS(stateId, "NOC", ["DocumentTypeMapping"]),
      nocDocsLoading = _Digit$Hooks$obps$use2.isLoading,
      nocDocs = _Digit$Hooks$obps$use2.data;

  var _Digit$Hooks$obps$use3 = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["DocumentType"]),
      commonDocs = _Digit$Hooks$obps$use3.data;

  React.useEffect(function () {
    setNocDetails(data);
  }, [data]);
  React.useEffect(function () {
    var _nocDocs$NOC;

    setNocDocumentTypeMaping(nocDocs === null || nocDocs === void 0 ? void 0 : (_nocDocs$NOC = nocDocs.NOC) === null || _nocDocs$NOC === void 0 ? void 0 : _nocDocs$NOC.DocumentTypeMapping);
  }, [nocDocs]);
  React.useEffect(function () {
    var _commonDocs$commonMa;

    setCommonDocMaping(commonDocs === null || commonDocs === void 0 ? void 0 : (_commonDocs$commonMa = commonDocs["common-masters"]) === null || _commonDocs$commonMa === void 0 ? void 0 : _commonDocs$commonMa.DocumentType);
  }, [commonDocs]);
  React.useEffect(function () {
    if (nocDatils !== null && nocDatils !== void 0 && nocDatils.length && nocDocumentTypeMaping !== null && nocDocumentTypeMaping !== void 0 && nocDocumentTypeMaping.length) {
      var documents = [];
      nocDatils.map(function (noc) {
        var _filteredData$, _filteredData$$docTyp;

        var filteredData = nocDocumentTypeMaping.filter(function (data) {
          return data.applicationType === noc.applicationType && data.nocType === noc.nocType;
        });

        if (filteredData !== null && filteredData !== void 0 && (_filteredData$ = filteredData[0]) !== null && _filteredData$ !== void 0 && (_filteredData$$docTyp = _filteredData$.docTypes) !== null && _filteredData$$docTyp !== void 0 && _filteredData$$docTyp[0]) {
          filteredData[0].docTypes[0].nocType = filteredData[0].nocType;
          filteredData[0].docTypes[0].additionalDetails = {
            submissionDetails: noc.additionalDetails,
            applicationStatus: noc.applicationStatus,
            appNumberLink: noc.applicationNo,
            nocNo: noc.nocNo
          };
          documents.push(filteredData[0].docTypes[0]);
        }
      });
      var documentsList = [];

      if (documents && documents.length > 0) {
        documents.map(function (doc) {
          var code = doc.documentType;
          doc.dropdownData = [];
          commonDocMaping.forEach(function (value) {
            var values = value.code.slice(0, code.length);

            if (code === values) {
              doc.hasDropdown = true;
              doc.dropdownData.push(value);
            }
          });
          documentsList.push(doc);
        });
      }

      documentsList.forEach(function (data) {
        data.code = data.documentType;
        data.dropdownData.forEach(function (dpData) {
          dpData.i18nKey = dpData.code;
        });
      });
      setNocTaxDocuments(documentsList);
    }
  }, [nocDatils, nocDocumentTypeMaping, commonDocMaping]);

  var handleSubmit = function handleSubmit() {
    var nocDocument = formData.nocDocuments;
    var nocDocumentStep;
    nocDocumentStep = _extends({}, nocDocument, {
      nocDocuments: nocDocuments,
      NocDetails: nocDatils,
      nocTaxDocuments: nocTaxDocuments
    });
    onSelect(config.key, nocDocumentStep);
  };

  var onSkip = function onSkip() {
    return onSelect();
  };

  function onAdd() {}

  React.useEffect(function () {
    var count = 0;
    nocTaxDocuments.map(function (doc) {
      var isRequired = false;
      nocDocuments.map(function (data) {
        if (doc.required && doc.code == data.documentType.split('.')[0] + "." + data.documentType.split('.')[1]) {
          isRequired = true;
        }
      });

      if (!isRequired && doc.required) {
        count = count + 1;
      }
    });
    if ((count == "0" || count == 0) && nocDocuments.length > 0) setEnableSubmit(false);else setEnableSubmit(true);
  }, [nocDocuments, checkRequiredFields]);
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Timeline, {
    currentStep: 3
  }), !nocDocsLoading ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    t: t,
    config: config,
    onSelect: handleSubmit,
    onSkip: onSkip,
    isDisabled: enableSubmit,
    onAdd: onAdd
  }, nocTaxDocuments === null || nocTaxDocuments === void 0 ? void 0 : nocTaxDocuments.map(function (document, index) {
    return /*#__PURE__*/React__default.createElement(SelectDocument$1, {
      key: index,
      document: document,
      t: t,
      error: error,
      setError: setError,
      setNocDocuments: setNocDocuments,
      nocDocuments: nocDocuments,
      setCheckRequiredFields: setCheckRequiredFields
    });
  }), error && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    label: error,
    onClose: function onClose() {
      return setError(null);
    },
    error: true
  })) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null));
};

function SelectDocument$1(_ref2) {
  var _doc$dropdownData, _doc$additionalDetail;

  var t = _ref2.t,
      doc = _ref2.document,
      setNocDocuments = _ref2.setNocDocuments,
      error = _ref2.error,
      setError = _ref2.setError,
      nocDocuments = _ref2.nocDocuments,
      setCheckRequiredFields = _ref2.setCheckRequiredFields;
  var filteredDocument = nocDocuments === null || nocDocuments === void 0 ? void 0 : nocDocuments.filter(function (item) {
    var _item$documentType;

    return item === null || item === void 0 ? void 0 : (_item$documentType = item.documentType) === null || _item$documentType === void 0 ? void 0 : _item$documentType.includes(doc === null || doc === void 0 ? void 0 : doc.code);
  })[0];
  var tenantId = Digit.ULBService.getCurrentTenantId(doc);

  var _useState10 = React.useState(doc === null || doc === void 0 ? void 0 : (_doc$dropdownData = doc.dropdownData) === null || _doc$dropdownData === void 0 ? void 0 : _doc$dropdownData[0]),
      selectedDocument = _useState10[0];

  var _useState11 = React.useState(null),
      file = _useState11[0],
      setFile = _useState11[1];

  var _useState12 = React.useState(function () {
    return (filteredDocument === null || filteredDocument === void 0 ? void 0 : filteredDocument.fileStoreId) || null;
  }),
      uploadedFile = _useState12[0],
      setUploadedFile = _useState12[1];

  function selectfile(e) {
    setFile(e.target.files[0]);
  }

  React.useEffect(function () {
    if (selectedDocument !== null && selectedDocument !== void 0 && selectedDocument.code) {
      setNocDocuments(function (prev) {
        var filteredDocumentsByDocumentType = prev === null || prev === void 0 ? void 0 : prev.filter(function (item) {
          return (item === null || item === void 0 ? void 0 : item.documentType) !== (selectedDocument === null || selectedDocument === void 0 ? void 0 : selectedDocument.code);
        });

        if ((uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.length) === 0 || uploadedFile === null) {
          return filteredDocumentsByDocumentType;
        }

        var filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType === null || filteredDocumentsByDocumentType === void 0 ? void 0 : filteredDocumentsByDocumentType.filter(function (item) {
          return (item === null || item === void 0 ? void 0 : item.fileStoreId) !== uploadedFile;
        });
        return [].concat(filteredDocumentsByFileStoreId, [{
          documentType: selectedDocument === null || selectedDocument === void 0 ? void 0 : selectedDocument.code,
          fileStoreId: uploadedFile,
          documentUid: uploadedFile
        }]);
      });
    }
  }, [uploadedFile, selectedDocument]);
  React.useEffect(function () {
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
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      border: "1px solid #D6D5D4",
      padding: "16px 0px 16px 8px",
      background: "#FAFAFA",
      borderRadius: "5px",
      marginBottom: "24px"
    }
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("h1", {
    style: {
      color: "#0B0C0C",
      lineHeight: "37px",
      fontWeight: "700",
      fontSize: "32px",
      fontFamily: "Roboto Condensed",
      paddingBottom: "24px"
    }
  }, t("BPA_" + (doc === null || doc === void 0 ? void 0 : doc.nocType) + "_HEADER")), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex",
      paddingBottom: "24px"
    }
  }, /*#__PURE__*/React__default.createElement("h1", {
    style: {
      color: "#0B0C0C",
      lineHeight: "19px",
      fontWeight: "700",
      fontSize: "16px",
      fontFamily: "Roboto",
      marginRight: "10px",
      width: "120px"
    }
  }, t("BPA_" + (doc === null || doc === void 0 ? void 0 : doc.nocType) + "_LABEL")), /*#__PURE__*/React__default.createElement("h1", null, doc === null || doc === void 0 ? void 0 : (_doc$additionalDetail = doc.additionalDetails) === null || _doc$additionalDetail === void 0 ? void 0 : _doc$additionalDetail.appNumberLink))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.UploadFile, {
    extraStyleName: "propertyCreate",
    accept: ".jpg,.png,.pdf",
    onUpload: selectfile,
    onDelete: function onDelete() {
      setUploadedFile(null);
      setCheckRequiredFields(true);
    },
    message: uploadedFile ? "1 " + t("CS_ACTION_FILEUPLOADED") : t("CS_ACTION_NO_FILEUPLOADED"),
    error: error
  }));
}

var GIS = function GIS(_ref) {
  var _formData$address, _formData$address2;

  var t = _ref.t,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData,
      handleRemove = _ref.handleRemove,
      _onSave = _ref.onSave;

  var _useState = React.useState((formData === null || formData === void 0 ? void 0 : (_formData$address = formData.address) === null || _formData$address === void 0 ? void 0 : _formData$address.pincode) || ""),
      pincode = _useState[0],
      setPincode = _useState[1];

  var _useState2 = React.useState((formData === null || formData === void 0 ? void 0 : (_formData$address2 = formData.address) === null || _formData$address2 === void 0 ? void 0 : _formData$address2.geoLocation) || {}),
      geoLocation = _useState2[0],
      setGeoLocation = _useState2[1];

  var tenants = Digit.Hooks.tl.useTenants();

  var _useState3 = React.useState(null),
      pincodeServicability = _useState3[0],
      setPincodeServicability = _useState3[1];

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

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
      setPincodeServicability("BP_COMMON_PINCODE_NOT_SERVICABLE");
      setPincode("");
      setGeoLocation({});
    } else {
      setPincode(code);
      setGeoLocation(location);
    }
  };

  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      position: "fixed",
      background: "#00000050",
      width: "100%",
      height: "100vh",
      top: "0",
      left: "0"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    style: {
      position: "relative",
      marginTop: "60px"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
      style: {
        float: "left",
        position: "relative",
        bottom: "32px",
        marginTop: "57px",
        marginLeft: "20px",
        marginRight: "4px"
      },
      width: "24",
      height: "24",
      viewBox: "0 0 30 30",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M14.9999 9.66666C12.0533 9.66666 9.66658 12.0533 9.66658 15C9.66658 17.9467 12.0533 20.3333 14.9999 20.3333C17.9466 20.3333 20.3333 17.9467 20.3333 15C20.3333 12.0533 17.9466 9.66666 14.9999 9.66666ZM26.9199 13.6667C26.3066 8.10666 21.8933 3.69333 16.3333 3.07999V0.333328H13.6666V3.07999C8.10658 3.69333 3.69325 8.10666 3.07992 13.6667H0.333252V16.3333H3.07992C3.69325 21.8933 8.10658 26.3067 13.6666 26.92V29.6667H16.3333V26.92C21.8933 26.3067 26.3066 21.8933 26.9199 16.3333H29.6666V13.6667H26.9199ZM14.9999 24.3333C9.83992 24.3333 5.66658 20.16 5.66658 15C5.66658 9.83999 9.83992 5.66666 14.9999 5.66666C20.1599 5.66666 24.3333 9.83999 24.3333 15C24.3333 20.16 20.1599 24.3333 14.9999 24.3333Z",
      fill: "#505A5F"
    })), /*#__PURE__*/React__default.createElement("svg", {
      style: {
        float: "right",
        position: "relative",
        bottom: "32px",
        marginTop: "60px",
        marginRight: "5px"
      },
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z",
      fill: "#0B0C0C"
    })))),
    style: {
      width: "100px",
      display: "inline"
    },
    onClick: function onClick(e) {
      return handleRemove();
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LocationSearchCard, {
    style: {
      position: "relative",
      marginTop: "100px",
      marginBottom: "-100px"
    },
    header: t("BPA_GIS_LABEL"),
    cardText: t(""),
    nextText: t("BPA_PIN_LOCATION_LABEL"),
    skip: onSkip,
    t: t,
    position: geoLocation,
    onSave: function onSave() {
      return _onSave(geoLocation, pincode);
    },
    onChange: function onChange(code, location) {
      return _onChange(code, location);
    },
    disabled: pincode === "",
    forcedError: t(pincodeServicability)
  })));
};

var LocationDetails = function LocationDetails(_ref) {
  var _formData, _formData$address, _formData2, _formData2$address, _formData3, _formData3$Scrutiny, _formData3$Scrutiny$, _formData5, _formData5$address, _formData6, _formData6$address, _formData7, _formData11;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      userType = _ref.userType,
      formData = _ref.formData;
  var currCity = JSON.parse(sessionStorage.getItem("currentCity")) || {};
  var currPincode = sessionStorage.getItem("currentPincode");
  var currLocality = JSON.parse(sessionStorage.getItem("currentLocality")) || {};
  var allCities = Digit.Hooks.obps.useTenants();

  var _useLocation = reactRouterDom.useLocation();

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState = React.useState(false),
      isOpen = _useState[0],
      setIsOpen = _useState[1];

  var _useState2 = React.useState(currPincode || ((_formData = formData) === null || _formData === void 0 ? void 0 : (_formData$address = _formData.address) === null || _formData$address === void 0 ? void 0 : _formData$address.pincode) || ""),
      pincode = _useState2[0],
      setPincode = _useState2[1];

  var _useState3 = React.useState(((_formData2 = formData) === null || _formData2 === void 0 ? void 0 : (_formData2$address = _formData2.address) === null || _formData2$address === void 0 ? void 0 : _formData2$address.geolocation) || ""),
      geoLocation = _useState3[0],
      setgeoLocation = _useState3[1];

  var _useState4 = React.useState((_formData3 = formData) === null || _formData3 === void 0 ? void 0 : (_formData3$Scrutiny = _formData3.Scrutiny) === null || _formData3$Scrutiny === void 0 ? void 0 : (_formData3$Scrutiny$ = _formData3$Scrutiny[0]) === null || _formData3$Scrutiny$ === void 0 ? void 0 : _formData3$Scrutiny$.tenantIdData);

  var _useState5 = React.useState(function () {
    var _formData4, _formData4$address;

    return currCity || ((_formData4 = formData) === null || _formData4 === void 0 ? void 0 : (_formData4$address = _formData4.address) === null || _formData4$address === void 0 ? void 0 : _formData4$address.city) || null;
  }),
      selectedCity = _useState5[0],
      setSelectedCity = _useState5[1];

  var _useState6 = React.useState(((_formData5 = formData) === null || _formData5 === void 0 ? void 0 : (_formData5$address = _formData5.address) === null || _formData5$address === void 0 ? void 0 : _formData5$address.street) || ""),
      street = _useState6[0],
      setStreet = _useState6[1];

  var _useState7 = React.useState(((_formData6 = formData) === null || _formData6 === void 0 ? void 0 : (_formData6$address = _formData6.address) === null || _formData6$address === void 0 ? void 0 : _formData6$address.landmark) || ""),
      landmark = _useState7[0],
      setLandmark = _useState7[1];

  var _useState8 = React.useState(allCities),
      cities = _useState8[0],
      setcitiesopetions = _useState8[1];
  formData = {
    address: _extends({}, (_formData7 = formData) === null || _formData7 === void 0 ? void 0 : _formData7.address)
  };
  React.useEffect(function () {
    if (!selectedCity || !localities) {
      cities = userType === "employee" ? allCities.filter(function (city) {
        return city.code === tenantId;
      }) : pincode ? allCities.filter(function (city) {
        var _city$pincode;

        return city === null || city === void 0 ? void 0 : (_city$pincode = city.pincode) === null || _city$pincode === void 0 ? void 0 : _city$pincode.some(function (pin) {
          return pin == pincode;
        });
      }) : allCities;
      setcitiesopetions(cities);
    }
  }, [pincode]);
  React.useEffect(function () {
    if (cities) {
      if (cities.length === 1) {
        setSelectedCity(cities[0]);
        sessionStorage.setItem("currentCity", JSON.stringify(cities[0]));
      }
    }
  }, [cities]);

  var _Digit$Hooks$useBound = Digit.Hooks.useBoundaryLocalities(selectedCity === null || selectedCity === void 0 ? void 0 : selectedCity.code, "revenue", {
    enabled: !!selectedCity
  }, t),
      fetchedLocalities = _Digit$Hooks$useBound.data;

  var _useState9 = React.useState(),
      localities = _useState9[0],
      setLocalities = _useState9[1];

  var _useState10 = React.useState(),
      selectedLocality = _useState10[0],
      setSelectedLocality = _useState10[1];

  React.useEffect(function () {
    if (selectedCity && fetchedLocalities) {
      var _formData8, _formData8$address, _formData9, _formData9$address;

      var __localityList = fetchedLocalities;
      var filteredLocalityList = [];

      if ((_formData8 = formData) !== null && _formData8 !== void 0 && (_formData8$address = _formData8.address) !== null && _formData8$address !== void 0 && _formData8$address.locality) {
        setSelectedLocality(formData.address.locality);
      }

      if ((_formData9 = formData) !== null && _formData9 !== void 0 && (_formData9$address = _formData9.address) !== null && _formData9$address !== void 0 && _formData9$address.pincode || pincode) {
        var _formData10, _formData10$address;

        filteredLocalityList = __localityList.filter(function (obj) {
          var _obj$pincode;

          return (_obj$pincode = obj.pincode) === null || _obj$pincode === void 0 ? void 0 : _obj$pincode.find(function (item) {
            return item == pincode;
          });
        });
        if (!((_formData10 = formData) !== null && _formData10 !== void 0 && (_formData10$address = _formData10.address) !== null && _formData10$address !== void 0 && _formData10$address.locality)) setSelectedLocality();
      }

      setLocalities(function () {
        return filteredLocalityList.length > 0 ? filteredLocalityList : __localityList;
      });

      if (filteredLocalityList.length === 1) {
        setSelectedLocality(filteredLocalityList[0]);
        sessionStorage.setItem("currLocality", JSON.stringify(filteredLocalityList[0]));
      }
    }
  }, [selectedCity, (_formData11 = formData) === null || _formData11 === void 0 ? void 0 : _formData11.pincode, fetchedLocalities]);

  var handleGIS = function handleGIS() {
    setIsOpen(!isOpen);
  };

  var handleRemove = function handleRemove() {
    setIsOpen(!isOpen);
  };

  var handleSubmit = function handleSubmit() {
    var address = {};
    address.pincode = pincode;
    address.city = selectedCity;
    address.locality = selectedLocality;
    address.street = street;
    address.landmark = landmark;
    address.geoLocation = geoLocation;
    onSelect(config.key, address);
  };

  function onSave(geoLocation, pincode) {
    selectPincode(pincode);
    setgeoLocation(geoLocation);
  }

  function selectPincode(e) {
    formData.address["pincode"] = typeof e === 'object' && e !== null ? e.target.value : e;
    setPincode(typeof e === 'object' && e !== null ? e.target.value : e);
    sessionStorage.setItem("currentPincode", typeof e === 'object' && e !== null ? e.target.value : e);
    sessionStorage.setItem("currentCity", JSON.stringify({}));
    sessionStorage.setItem("currLocality", JSON.stringify({}));
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(null);
  }

  function selectStreet(e) {
    setStreet(e.target.value);
  }

  function selectLandmark(e) {
    setLandmark(e.target.value);
  }

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
    sessionStorage.setItem("currentCity", JSON.stringify(city));
    formData.address["city"] = city;
  }

  function selectLocality(locality) {
    var _formData12, _formData12$address;

    if ((_formData12 = formData) !== null && _formData12 !== void 0 && (_formData12$address = _formData12.address) !== null && _formData12$address !== void 0 && _formData12$address.locality) {
      formData.address["locality"] = locality;
    }

    setSelectedLocality(locality);
    sessionStorage.setItem("currLocality", JSON.stringify(locality));
  }

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    t: t,
    config: config,
    onSelect: handleSubmit,
    isDisabled: !pincode || !selectedCity || !selectedLocality,
    isMultipleAllow: true
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, "" + t("BPA_GIS_LABEL")), /*#__PURE__*/React__default.createElement("div", {
    style: {}
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, {
    style: {},
    isMandatory: false,
    optionKey: "i18nKey",
    t: t,
    name: "gis",
    value: geoLocation
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
      style: {
        float: "right",
        position: "relative",
        bottom: "32px",
        marginTop: "-20px",
        marginRight: "5px"
      },
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M11 7C8.79 7 7 8.79 7 11C7 13.21 8.79 15 11 15C13.21 15 15 13.21 15 11C15 8.79 13.21 7 11 7ZM19.94 10C19.48 5.83 16.17 2.52 12 2.06V0H10V2.06C5.83 2.52 2.52 5.83 2.06 10H0V12H2.06C2.52 16.17 5.83 19.48 10 19.94V22H12V19.94C16.17 19.48 19.48 16.17 19.94 12H22V10H19.94ZM11 18C7.13 18 4 14.87 4 11C4 7.13 7.13 4 11 4C14.87 4 18 7.13 18 11C18 14.87 14.87 18 11 18Z",
      fill: "#505A5F"
    })))),
    style: {},
    onClick: function onClick(e) {
      return handleGIS();
    }
  })), isOpen && /*#__PURE__*/React__default.createElement(GIS, {
    t: t,
    onSelect: onSelect,
    formData: formData,
    handleRemove: handleRemove,
    onSave: onSave
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, "" + t("BPA_DETAILS_PIN_LABEL")), !isOpen && /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, {
    isMandatory: false,
    optionKey: "i18nKey",
    type: "text",
    t: t,
    name: "pincode",
    onChange: selectPincode,
    value: pincode
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, "" + t("BPA_CITY_LABEL")), !isOpen && /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioOrSelect, {
    options: cities.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    }),
    selectedOption: selectedCity,
    optionKey: "code",
    onSelect: selectCity,
    t: t,
    isDependent: true,
    labelKey: "TENANT_TENANTS"
  }), !isOpen && selectedCity && localities && /*#__PURE__*/React__default.createElement("span", {
    className: "form-pt-dropdown-only"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, "" + t("BPA_LOC_MOHALLA_LABEL")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioOrSelect, {
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
    labelKey: ""
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, "" + t("BPA_DETAILS_SRT_NAME_LABEL")), !isOpen && /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, {
    style: {},
    isMandatory: false,
    optionKey: "i18nKey",
    t: t,
    name: "street",
    onChange: selectStreet,
    value: street
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, "" + t("ES_NEW_APPLICATION_LOCATION_LANDMARK")), !isOpen && /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, {
    style: {},
    isMandatory: false,
    optionKey: "i18nKey",
    t: t,
    name: "landmark",
    onChange: selectLandmark,
    value: landmark
  }));
};

var OCEDCRDocsRequired = function OCEDCRDocsRequired(_ref) {
  var onSelect = _ref.onSelect;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var data = [{
    code: "BPA_PERMIT_NUMBER_OC_SCRUTINY_LABEL"
  }, {
    code: "BPA_PERMIT_DATE_LABEL"
  }, {
    code: "BPA_OC_PLAN_DXF_FILE"
  }];

  var goNext = function goNext() {
    onSelect();
  };

  return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("BPA_OC_FOR_NEW_BUILDING_CONSTRUCTION_LABEL")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CitizenInfoLabel, {
    text: t("OBPS_OCEDCR_DOCS_REQUIRED_TIME"),
    showInfo: false
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, {
    style: {
      color: "#0B0C0C",
      marginTop: "12px"
    }
  }, t("OBPS_OCEDCR_BUILDING_PERMIT_DESCRIPTION")), /*#__PURE__*/React__default.createElement(React.Fragment, null, data === null || data === void 0 ? void 0 : data.map(function (doc, index) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      style: {
        fontWeight: 700
      },
      key: index
    }, /*#__PURE__*/React__default.createElement("div", {
      style: {
        display: "flex"
      }
    }, /*#__PURE__*/React__default.createElement("div", null, index + 1 + ".", "\xA0"), /*#__PURE__*/React__default.createElement("div", null, " " + t(doc === null || doc === void 0 ? void 0 : doc.code.replace('.', '_')))));
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("CS_COMMON_NEXT"),
    onSubmit: goNext
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CitizenInfoLabel, {
    info: t("CS_FILE_APPLICATION_INFO_LABEL"),
    text: t("OBPS_OC_DOCS_FILE_SIZE")
  }));
};

var OBPSModule = function OBPSModule(_ref) {
  var stateCode = _ref.stateCode,
      userType = _ref.userType,
      tenants = _ref.tenants;
  var moduleCode = "bpa";

  var _useRouteMatch = reactRouterDom.useRouteMatch(),
      path = _useRouteMatch.path;

  var language = Digit.StoreData.getCurrentLanguage();

  var _Digit$Services$useSt = Digit.Services.useStore({
    stateCode: stateCode,
    moduleCode: moduleCode,
    language: language
  }),
      isLoading = _Digit$Services$useSt.isLoading;

  Digit.SessionStorage.set("OBPS_TENANTS", tenants);

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  if (userType === "citizen") {
    return /*#__PURE__*/React__default.createElement(App, {
      path: path,
      stateCode: stateCode
    });
  }
};

var OBPSLinks = function OBPSLinks(_ref2) {
  var matchPath = _ref2.matchPath;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var links = [{
    link: matchPath + "/tradelicence/new-application",
    i18nKey: t("BPA_CITIZEN_HOME_VIEW_APP_BY_CITIZEN_LABEL")
  }, {
    link: matchPath + "/tradelicence/renewal-list",
    i18nKey: t("BPA_CITIZEN_HOME_REGISTER_ARCHITECT_BUILDER_LABEL")
  }, {
    link: matchPath + "/home",
    i18nKey: t("BPA_CITIZEN_HOME_ARCHITECT_LOGIN_LABEL")
  }];
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.CitizenHomeCard, {
    header: t("ACTION_TEST_BUILDING_PLAN_APPROVAL"),
    links: links,
    Icon: function Icon() {
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.OBPSIcon, null);
    }
  });
};

var componentsToRegister = {
  OBPSModule: OBPSModule,
  OBPSLinks: OBPSLinks,
  BPACitizenHomeScreen: BPACitizenHomeScreen,
  EDCRForm: EDCRForm,
  BasicDetails: BasicDetails,
  DocsRequired: DocsRequired,
  PlotDetails: PlotDetails,
  ScrutinyDetails: ScrutinyDetails,
  OwnerDetails: OwnerDetails,
  DocumentDetails: DocumentDetails,
  NOCDetails: NOCDetails,
  LocationDetails: LocationDetails,
  GIS: GIS,
  OCEDCRDocsRequired: OCEDCRDocsRequired
};
var initOBPSComponents = function initOBPSComponents() {
  Object.entries(componentsToRegister).forEach(function (_ref3) {
    var key = _ref3[0],
        value = _ref3[1];
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

exports.initOBPSComponents = initOBPSComponents;
//# sourceMappingURL=index.js.map
