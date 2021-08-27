import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react';
import { useHistory, useParams, Redirect, Link, Switch, Route, useLocation, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EmployeeModuleCard, Card, CardHeader, CardText, CardLabelError, RadioButtons, SubmitBar, ImageUploadHandler, LinkButton, TextArea, Banner, RatingCard, FormStep, CardLabel, Dropdown, TypeSelectCard, LocationSearchCard, CardSubHeader, DateWrap, KeyNote, Header, Loader, CheckPoint, TelePhone, Rating, ActionLinks, ConnectingCheckPoints, StatusTable, Row, DisplayPhotos, ImageViewer, Toast, BackButton, PrivateRoute, BreakLine, PopUp, HeaderBar, ActionBar, Menu, Modal, SectionalDropdown, CardLabelDesc, UploadFile, CardSectionHeader, LabelFieldPair, TextInput, Table, CheckBox, CloseSvg, RemoveableTag, ApplyFilterBar, Label, LinkLabel, DetailsCard, SearchAction, FilterAction, BreadCrumb, EmployeeAppContainer, CitizenHomeCard, ComplaintIcon } from '@egovernments/digit-ui-react-components';
import { combineReducers } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import merge from 'lodash.merge';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';

var PGRCard = function PGRCard() {
  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var allLinks = [{
    text: t("ES_PGR_INBOX"),
    link: "/digit-ui/employee/pgr/inbox"
  }, {
    text: t("ES_PGR_NEW_COMPLAINT"),
    link: "/digit-ui/employee/pgr/complaint/create",
    accessTo: ["CSR"]
  }];

  if (!Digit.Utils.pgrAccess()) {
    return null;
  }

  var Icon = function Icon() {
    return /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      height: "24",
      viewBox: "0 0 24 24",
      width: "24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z",
      fill: "white"
    }));
  };

  var propsForCSR = [{
    label: t("ES_PGR_NEW_COMPLAINT"),
    link: "/digit-ui/employee/pgr/complaint/create"
  }];
  var propsForModuleCard = {
    Icon: /*#__PURE__*/React.createElement(Icon, null),
    moduleName: t("ES_PGR_HEADER_COMPLAINT"),
    kpis: [{
      label: t("TOTAL_PGR"),
      link: "/digit-ui/employee/pgr/inbox"
    }, {
      label: t("TOTAL_NEARING_SLA"),
      link: "/digit-ui/employee/pgr/inbox"
    }],
    links: [{
      label: t("ES_PGR_INBOX"),
      link: "/digit-ui/employee/pgr/inbox"
    }].concat(propsForCSR)
  };
  return /*#__PURE__*/React.createElement(EmployeeModuleCard, propsForModuleCard);
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

var FETCH_COMPLAINTS = "FETCH_COMPLAINTS";
var UPDATE_COMPLAINT = "UPDATE_COMPLAINT";
var CREATE_COMPLAINT = "CREATE_COMPLAINT";
var APPLY_INBOX_FILTER = "APPLY_INBOX_FILTER";

function complaintReducer(state, action) {
  if (state === void 0) {
    state = {};
  }

  switch (action.type) {
    case CREATE_COMPLAINT:
      return _extends({}, state, {
        response: action.payload
      });

    case FETCH_COMPLAINTS:
      return _extends({}, state, {
        list: action.payload.complaints
      });

    case UPDATE_COMPLAINT:
      return _extends({}, state, {
        response: action.payload
      });

    case APPLY_INBOX_FILTER:
      return _extends({}, state, {
        response: action.payload.response.instances
      });

    default:
      return state;
  }
}

var getRootReducer = function getRootReducer() {
  return combineReducers({
    complaints: complaintReducer
  });
};

var PGR_EMPLOYEE_COMPLAINT_DETAILS = "/complaint/details/";
var PGR_EMPLOYEE_CREATE_COMPLAINT = "/complaint/create";

var PgrRoutes = {
  ComplaintsPage: "/complaints",
  RatingAndFeedBack: "/rate/:id*",
  ComplaintDetailsPage: "/complaint/details/:id",
  ReasonPage: "/:id",
  UploadPhoto: "/upload-photo/:id",
  AddtionalDetails: "/addional-details/:id",
  CreateComplaint: "/create-complaint",
  ReopenComplaint: "/reopen",
  Response: "/response",
  CreateComplaintStart: "",
  SubType: "/subtype",
  LocationSearch: "/location",
  Pincode: "/pincode",
  Address: "/address",
  Landmark: "/landmark",
  UploadPhotos: "/upload-photos",
  Details: "/details",
  CreateComplaintResponse: "/response"
};
var Employee = {
  Inbox: "/inbox",
  ComplaintDetails: PGR_EMPLOYEE_COMPLAINT_DETAILS,
  CreateComplaint: PGR_EMPLOYEE_CREATE_COMPLAINT,
  Response: "/response",
  Home: "/digit-ui/employee"
};
var getRoute = function getRoute(match, route) {
  return "" + match.path + route;
};

var LOCALIZATION_KEY = {
  CS_COMPLAINT_DETAILS: "CS_COMPLAINT_DETAILS",
  CS_COMMON: "CS_COMMON",
  CS_COMPLAINT: "CS_COMPLAINT",
  CS_FEEDBACK: "CS_FEEDBACK",
  CS_HEADER: "CS_HEADER",
  CS_HOME: "CS_HOME",
  CS_ADDCOMPLAINT: "CS_ADDCOMPLAINT",
  CS_REOPEN: "CS_REOPEN",
  CS_CREATECOMPLAINT: "CS_CREATECOMPLAINT",
  PT_COMMONS: "PT_COMMONS",
  CORE_COMMON: "CORE_COMMON"
};
var LOCALE = {
  MY_COMPLAINTS: "CS_HOME_MY_COMPLAINTS",
  NO_COMPLAINTS: "CS_MYCOMPLAINTS_NO_COMPLAINTS",
  NO_COMPLAINTS_EMPLOYEE: "CS_MYCOMPLAINTS_NO_COMPLAINTS_EMPLOYEE",
  ERROR_LOADING_RESULTS: "CS_COMMON_ERROR_LOADING_RESULTS"
};

var ReasonPage = function ReasonPage(props) {
  var history = useHistory();

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useParams = useParams(),
      id = _useParams.id;

  var _useState = useState(null),
      selected = _useState[0],
      setSelected = _useState[1];

  var _useState2 = useState(true),
      valid = _useState2[0],
      setValid = _useState2[1];

  var onRadioChange = function onRadioChange(value) {
    var reopenDetails = Digit.SessionStorage.get("reopen." + id);
    Digit.SessionStorage.set("reopen." + id, _extends({}, reopenDetails, {
      reason: value
    }));
    setSelected(value);
  };

  function onSave() {
    if (selected === null) {
      setValid(false);
    } else {
      history.push(props.match.path + "/upload-photo/" + id);
    }
  }

  return /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, t(LOCALIZATION_KEY.CS_REOPEN + "_COMPLAINT")), /*#__PURE__*/React.createElement(CardText, null), valid ? null : /*#__PURE__*/React.createElement(CardLabelError, null, t(LOCALIZATION_KEY.CS_ADDCOMPLAINT + "_ERROR_REOPEN_REASON")), /*#__PURE__*/React.createElement(RadioButtons, {
    onSelect: onRadioChange,
    selectedOption: selected,
    options: [t(LOCALIZATION_KEY.CS_REOPEN + "_OPTION_ONE"), t(LOCALIZATION_KEY.CS_REOPEN + "_OPTION_TWO"), t(LOCALIZATION_KEY.CS_REOPEN + "_OPTION_THREE"), t(LOCALIZATION_KEY.CS_REOPEN + "_OPTION_FOUR")]
  }), /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CS_COMMON_NEXT"),
    onSubmit: onSave
  }));
};

var UploadPhoto = function UploadPhoto(props) {
  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var history = useHistory();

  var _useParams = useParams(),
      id = _useParams.id;

  var _useState = useState(null),
      verificationDocuments = _useState[0],
      setVerificationDocuments = _useState[1];

  var _useState2 = useState(true),
      valid = _useState2[0],
      setValid = _useState2[1];

  var handleUpload = function handleUpload(ids) {
    setDocState(ids);
  };

  var setDocState = function setDocState(ids) {
    if (ids !== null && ids !== void 0 && ids.length) {
      var documents = ids.map(function (id) {
        return {
          documentType: "PHOTO",
          fileStoreId: id,
          documentUid: "",
          additionalDetails: {}
        };
      });
      setVerificationDocuments(documents);
    }
  };

  function save() {
    if (verificationDocuments === null) {
      setValid(false);
    } else {
      history.push(props.match.path + "/addional-details/" + id);
    }
  }

  function skip() {
    history.push(props.match.path + "/addional-details/" + id);
  }

  useEffect(function () {
    var reopenDetails = Digit.SessionStorage.get("reopen." + id);
    Digit.SessionStorage.set("reopen." + id, _extends({}, reopenDetails, {
      verificationDocuments: verificationDocuments
    }));
  }, [verificationDocuments, id]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(ImageUploadHandler, {
    header: t(LOCALIZATION_KEY.CS_ADDCOMPLAINT + "_UPLOAD_PHOTO"),
    tenantId: Digit.ULBService.getCurrentTenantId(),
    cardText: "",
    onPhotoChange: handleUpload,
    uploadedImages: null
  }), valid ? null : /*#__PURE__*/React.createElement(CardLabelError, null, t(LOCALIZATION_KEY.CS_ADDCOMPLAINT + "_UPLOAD_ERROR_MESSAGE")), /*#__PURE__*/React.createElement(SubmitBar, {
    label: t(LOCALIZATION_KEY.PT_COMMONS + "_NEXT"),
    onSubmit: save
  }), props.skip ? /*#__PURE__*/React.createElement(LinkButton, {
    label: t(LOCALIZATION_KEY.CORE_COMMON + "_SKIP_CONTINUE"),
    onClick: skip
  }) : null));
};

var createComplaint = function createComplaint(_ref) {
  var cityCode = _ref.cityCode,
      complaintType = _ref.complaintType,
      description = _ref.description,
      landmark = _ref.landmark,
      city = _ref.city,
      district = _ref.district,
      region = _ref.region,
      state = _ref.state,
      pincode = _ref.pincode,
      localityCode = _ref.localityCode,
      localityName = _ref.localityName,
      uploadedImages = _ref.uploadedImages,
      mobileNumber = _ref.mobileNumber,
      name = _ref.name;
  return function (dispatch, getState) {
    try {
      return Promise.resolve(Digit.Complaint.create({
        cityCode: cityCode,
        complaintType: complaintType,
        description: description,
        landmark: landmark,
        city: city,
        district: district,
        region: region,
        state: state,
        pincode: pincode,
        localityCode: localityCode,
        localityName: localityName,
        uploadedImages: uploadedImages,
        mobileNumber: mobileNumber,
        name: name
      })).then(function (response) {
        console.log("from actions", response);
        dispatch({
          type: CREATE_COMPLAINT,
          payload: response
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

var updateComplaints = function updateComplaints(data) {
  return function (dispatch) {
    try {
      return Promise.resolve(Digit.PGRService.update(data)).then(function (ServiceWrappers) {
        dispatch({
          type: UPDATE_COMPLAINT,
          payload: ServiceWrappers
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

var AddtionalDetails = function AddtionalDetails(props) {
  var history = useHistory();

  var _useParams = useParams(),
      id = _useParams.id;

  var dispatch = useDispatch();
  var appState = useSelector(function (state) {
    return state;
  })["common"];

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var complaintDetails = Digit.Hooks.pgr.useComplaintDetails({
    tenantId: tenantId,
    id: id
  }).complaintDetails;
  useEffect(function () {
    if (appState.complaints) {
      var response = appState.complaints.response;

      if (response && response.responseInfo.status === "successful") {
        history.push(props.match.path + "/response/:" + id);
      }
    }
  }, [appState.complaints, props.history]);
  var updateComplaint = useCallback(function (complaintDetails) {
    try {
      return Promise.resolve(dispatch(updateComplaints(complaintDetails))).then(function () {
        history.push(props.match.path + "/response/" + id);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }, [dispatch]);

  var getUpdatedWorkflow = function getUpdatedWorkflow(reopenDetails, type) {
    switch (type) {
      case "REOPEN":
        return {
          action: "REOPEN",
          comments: reopenDetails.addtionalDetail,
          assignes: [],
          verificationDocuments: reopenDetails.verificationDocuments
        };

      default:
        return "";
    }
  };

  function reopenComplaint() {
    var reopenDetails = Digit.SessionStorage.get("reopen." + id);

    if (complaintDetails) {
      complaintDetails.workflow = getUpdatedWorkflow(reopenDetails, "REOPEN");
      complaintDetails.service.additionalDetail = {
        REOPEN_REASON: reopenDetails.reason
      };
      updateComplaint({
        service: complaintDetails.service,
        workflow: complaintDetails.workflow
      });
    }

    return /*#__PURE__*/React.createElement(Redirect, {
      to: {
        pathname: props.parentRoute + "/response",
        state: {
          complaintDetails: complaintDetails
        }
      }
    });
  }

  function textInput(e) {
    var reopenDetails = Digit.SessionStorage.get("reopen." + id);
    Digit.SessionStorage.set("reopen." + id, _extends({}, reopenDetails, {
      addtionalDetail: e.target.value
    }));
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, t(LOCALIZATION_KEY.CS_ADDCOMPLAINT + "_PROVIDE_ADDITIONAL_DETAILS")), /*#__PURE__*/React.createElement(CardText, null, t(LOCALIZATION_KEY.CS_ADDCOMPLAINT + "_ADDITIONAL_DETAILS_TEXT")), /*#__PURE__*/React.createElement(TextArea, {
    name: "AdditionalDetails",
    onChange: textInput
  }), /*#__PURE__*/React.createElement("div", {
    onClick: reopenComplaint
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t(LOCALIZATION_KEY.CS_HEADER + "_REOPEN_COMPLAINT")
  }))));
};

var GetActionMessage = function GetActionMessage(_ref) {
  var action = _ref.action;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  switch (action) {
    case "REOPEN":
      return t("CS_COMMON_COMPLAINT_REOPENED");

    case "RATE":
      return t("CS_COMMON_THANK_YOU");

    default:
      return t("CS_COMMON_COMPLAINT_SUBMITTED");
  }
};

var BannerPicker = function BannerPicker(_ref2) {
  var response = _ref2.response;
  var complaints = response.complaints;

  var _useTranslation2 = useTranslation(),
      t = _useTranslation2.t;

  if (complaints && complaints.response && complaints.response.responseInfo) {
    return /*#__PURE__*/React.createElement(Banner, {
      message: GetActionMessage(complaints.response.ServiceWrappers[0].workflow),
      complaintNumber: complaints.response.ServiceWrappers[0].service.serviceRequestId,
      successful: true
    });
  } else {
    return /*#__PURE__*/React.createElement(Banner, {
      message: t("CS_COMMON_COMPLAINT_NOT_SUBMITTED"),
      successful: false
    });
  }
};

var TextPicker = function TextPicker(_ref3) {
  var response = _ref3.response;
  var complaints = response.complaints;

  var _useTranslation3 = useTranslation(),
      t = _useTranslation3.t;

  if (complaints && complaints.response && complaints.response.responseInfo) {
    var action = complaints.response.ServiceWrappers[0].workflow.action;
    return action === "RATE" ? /*#__PURE__*/React.createElement(CardText, null, t("CS_COMMON_RATING_SUBMIT_TEXT")) : /*#__PURE__*/React.createElement(CardText, null, t("CS_COMMON_TRACK_COMPLAINT_TEXT"));
  }
};

var Response = function Response(props) {
  var _useTranslation4 = useTranslation(),
      t = _useTranslation4.t;

  var appState = useSelector(function (state) {
    return state;
  })["pgr"];
  return /*#__PURE__*/React.createElement(Card, null, appState.complaints.response && /*#__PURE__*/React.createElement(BannerPicker, {
    response: appState
  }), appState.complaints.response && /*#__PURE__*/React.createElement(TextPicker, {
    response: appState
  }), /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/citizen"
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CORE_COMMON_GO_TO_HOME")
  })));
};

var ReopenComplaint = function ReopenComplaint(_ref) {
  var match = _ref.match,
      parentRoute = _ref.parentRoute;
  return /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    exact: true,
    path: getRoute(match, PgrRoutes.ReasonPage),
    component: function component() {
      return /*#__PURE__*/React.createElement(ReasonPage, {
        match: match
      });
    }
  }), /*#__PURE__*/React.createElement(Route, {
    path: getRoute(match, PgrRoutes.UploadPhoto),
    component: function component() {
      return /*#__PURE__*/React.createElement(UploadPhoto, {
        match: match,
        skip: true
      });
    }
  }), /*#__PURE__*/React.createElement(Route, {
    path: getRoute(match, PgrRoutes.AddtionalDetails),
    component: function component() {
      return /*#__PURE__*/React.createElement(AddtionalDetails, {
        match: match,
        parentRoute: parentRoute
      });
    }
  }), /*#__PURE__*/React.createElement(Route, {
    path: getRoute(match, PgrRoutes.Response),
    component: function component() {
      return /*#__PURE__*/React.createElement(Response, {
        match: match
      });
    }
  }));
};

var SelectRating = function SelectRating(_ref) {
  var parentRoute = _ref.parentRoute;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useParams = useParams(),
      id = _useParams.id;

  var dispatch = useDispatch();
  var history = useHistory();
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var complaintDetails = Digit.Hooks.pgr.useComplaintDetails({
    tenantId: tenantId,
    id: id
  }).complaintDetails;
  var updateComplaint = useCallback(function (complaintDetails) {
    return dispatch(updateComplaints(complaintDetails));
  }, [dispatch]);

  var _useState = useState(false),
      submitError = _useState[0],
      setError = _useState[1];

  function log(data) {
    if (complaintDetails && data.rating > 0) {
      complaintDetails.service.rating = data.rating;
      complaintDetails.service.additionalDetail = data.CS_FEEDBACK_WHAT_WAS_GOOD.join(",");
      complaintDetails.workflow = {
        action: "RATE",
        comments: data.comments,
        verificationDocuments: []
      };
      updateComplaint({
        service: complaintDetails.service,
        workflow: complaintDetails.workflow
      });
      history.push(parentRoute + "/response");
    } else {
      setError(true);
    }
  }

  var config = {
    texts: {
      header: "CS_COMPLAINT_RATE_HELP_TEXT",
      submitBarLabel: "CS_COMMONS_NEXT"
    },
    inputs: [{
      type: "rate",
      maxRating: 5,
      label: t("CS_COMPLAINT_RATE_TEXT"),
      error: submitError ? /*#__PURE__*/React.createElement(CardLabelError, null, t("CS_FEEDBACK_ENTER_RATING_ERROR")) : null
    }, {
      type: "checkbox",
      label: "CS_FEEDBACK_WHAT_WAS_GOOD",
      checkLabels: [t("CS_FEEDBACK_SERVICES"), t("CS_FEEDBACK_RESOLUTION_TIME"), t("CS_FEEDBACK_QUALITY_OF_WORK"), t("CS_FEEDBACK_OTHERS")]
    }, {
      type: "textarea",
      label: t("CS_COMMON_COMMENTS"),
      name: "comments"
    }]
  };
  return /*#__PURE__*/React.createElement(RatingCard, _extends({
    config: config
  }, {
    t: t,
    onSelect: log
  }));
};

var PGR_CITIZEN_CREATE_COMPLAINT = "PGR_CITIZEN_CREATE_COMPLAINT";

var GetActionMessage$1 = function GetActionMessage(_ref) {
  var action = _ref.action;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  switch (action) {
    case "REOPEN":
      return t("CS_COMMON_COMPLAINT_REOPENED");

    case "RATE":
      return t("CS_COMMON_THANK_YOU");

    default:
      return t("CS_COMMON_COMPLAINT_SUBMITTED");
  }
};

var BannerPicker$1 = function BannerPicker(_ref2) {
  var response = _ref2.response;
  var complaints = response.complaints;

  if (complaints && complaints.response && complaints.response.responseInfo) {
    return /*#__PURE__*/React.createElement(Banner, {
      message: GetActionMessage$1(complaints.response.ServiceWrappers[0].workflow),
      complaintNumber: complaints.response.ServiceWrappers[0].service.serviceRequestId,
      successful: true
    });
  } else {
    return /*#__PURE__*/React.createElement(Banner, {
      message: t("CS_COMMON_COMPLAINT_NOT_SUBMITTED"),
      successful: false
    });
  }
};

var Response$1 = function Response(props) {
  var _useTranslation2 = useTranslation(),
      t = _useTranslation2.t;

  var appState = useSelector(function (state) {
    return state;
  })["pgr"];
  return /*#__PURE__*/React.createElement(Card, null, appState.complaints.response && /*#__PURE__*/React.createElement(BannerPicker$1, {
    response: appState
  }), /*#__PURE__*/React.createElement(CardText, null, t("CS_COMMON_TRACK_COMPLAINT_TEXT")), /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/citizen"
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CORE_COMMON_GO_TO_HOME")
  })));
};

var SelectAddress = function SelectAddress(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      value = _ref.value;
  var allCities = Digit.Hooks.pgr.useTenants();
  var cities = value !== null && value !== void 0 && value.pincode ? allCities.filter(function (city) {
    var _city$pincode;

    return city === null || city === void 0 ? void 0 : (_city$pincode = city.pincode) === null || _city$pincode === void 0 ? void 0 : _city$pincode.some(function (pin) {
      return pin == value["pincode"];
    });
  }) : allCities;

  var _useState = useState(function () {
    var city_complaint = value.city_complaint;
    return city_complaint ? city_complaint : null;
  }),
      selectedCity = _useState[0],
      setSelectedCity = _useState[1];

  var _Digit$Hooks$useBound = Digit.Hooks.useBoundaryLocalities(selectedCity === null || selectedCity === void 0 ? void 0 : selectedCity.code, "admin", {
    enabled: !!selectedCity
  }, t),
      fetchedLocalities = _Digit$Hooks$useBound.data;

  var _useState2 = useState(null),
      localities = _useState2[0],
      setLocalities = _useState2[1];

  var _useState3 = useState(function () {
    var locality_complaint = value.locality_complaint;
    return locality_complaint ? locality_complaint : null;
  }),
      selectedLocality = _useState3[0],
      setSelectedLocality = _useState3[1];

  useEffect(function () {
    if (selectedCity && fetchedLocalities) {
      var pincode = value.pincode;

      var __localityList = pincode ? fetchedLocalities.filter(function (city) {
        return city["pincode"] == pincode;
      }) : fetchedLocalities;

      setLocalities(__localityList);
    }
  }, [selectedCity, fetchedLocalities]);

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
  }

  function selectLocality(locality) {
    setSelectedLocality(locality);
  }

  function onSubmit() {
    onSelect({
      city_complaint: selectedCity,
      locality_complaint: selectedLocality
    });
  }

  return /*#__PURE__*/React.createElement(FormStep, {
    config: config,
    onSelect: onSubmit,
    t: t,
    isDisabled: selectedLocality ? false : true
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CardLabel, null, t("MYCITY_CODE_LABEL")), (cities === null || cities === void 0 ? void 0 : cities.length) < 5 ? /*#__PURE__*/React.createElement(RadioButtons, {
    selectedOption: selectedCity,
    options: cities,
    optionsKey: "i18nKey",
    onSelect: selectCity
  }) : /*#__PURE__*/React.createElement(Dropdown, {
    isMandatory: true,
    selected: selectedCity,
    option: cities,
    select: selectCity,
    optionKey: "i18nKey",
    t: t
  }), selectedCity && localities && /*#__PURE__*/React.createElement(CardLabel, null, t("CS_CREATECOMPLAINT_MOHALLA")), selectedCity && localities && /*#__PURE__*/React.createElement(React.Fragment, null, (localities === null || localities === void 0 ? void 0 : localities.length) < 5 ? /*#__PURE__*/React.createElement(RadioButtons, {
    selectedOption: selectedLocality,
    options: localities,
    optionsKey: "i18nkey",
    onSelect: selectLocality
  }) : /*#__PURE__*/React.createElement(Dropdown, {
    isMandatory: true,
    selected: selectedLocality,
    optionKey: "i18nkey",
    option: localities,
    select: selectLocality,
    t: t
  }))));
};

var SelectComplaintType = function SelectComplaintType(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      value = _ref.value;

  var _useState = useState(function () {
    var complaintType = value.complaintType;
    return complaintType ? complaintType : {};
  }),
      complaintType = _useState[0],
      setComplaintType = _useState[1];

  var goNext = function goNext() {
    onSelect({
      complaintType: complaintType
    });
  };

  var textParams = config.texts;
  var menu = Digit.Hooks.pgr.useComplaintTypes({
    stateCode: Digit.ULBService.getCurrentTenantId()
  });

  function selectedValue(value) {
    setComplaintType(value);
  }

  return /*#__PURE__*/React.createElement(TypeSelectCard, _extends({}, textParams, {
    menu: menu
  }, {
    optionsKey: "name"
  }, {
    selected: selectedValue
  }, {
    selectedOption: complaintType
  }, {
    onSave: goNext
  }, {
    t: t
  }, {
    disabled: Object.keys(complaintType).length === 0 || complaintType === null ? true : false
  }));
};

var SelectDetails = function SelectDetails(_ref) {
  var t = _ref.t,
      config = _ref.config,
      _onSelect = _ref.onSelect,
      value = _ref.value;

  var _useState = useState(function () {
    var details = value.details;
    return details ? details : "";
  }),
      details = _useState[0],
      setDetails = _useState[1];

  var onChange = function onChange(event) {
    var value = event.target.value;
    setDetails(value);
  };

  return /*#__PURE__*/React.createElement(FormStep, {
    config: config,
    onChange: onChange,
    onSelect: function onSelect() {
      return _onSelect({
        details: details
      });
    },
    value: details,
    t: t
  });
};

var SelectImages = function SelectImages(_ref) {
  var _value$city_complaint;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      onSkip = _ref.onSkip,
      value = _ref.value;

  var _useState = useState(function () {
    var uploadedImages = value.uploadedImages;
    return uploadedImages ? uploadedImages : null;
  }),
      uploadedImages = _useState[0],
      setUploadedImagesIds = _useState[1];

  var handleUpload = function handleUpload(ids) {
    setUploadedImagesIds(ids);
  };

  var handleSubmit = function handleSubmit() {
    if (!uploadedImages || uploadedImages.length === 0) return onSkip();
    onSelect({
      uploadedImages: uploadedImages
    });
  };

  return /*#__PURE__*/React.createElement(FormStep, {
    config: config,
    onSelect: handleSubmit,
    onSkip: onSkip,
    t: t
  }, /*#__PURE__*/React.createElement(ImageUploadHandler, {
    tenantId: (_value$city_complaint = value.city_complaint) === null || _value$city_complaint === void 0 ? void 0 : _value$city_complaint.code,
    uploadedImages: uploadedImages,
    onPhotoChange: handleUpload
  }));
};

var SelectLandmark = function SelectLandmark(_ref) {
  var t = _ref.t,
      config = _ref.config,
      _onSelect = _ref.onSelect,
      value = _ref.value;

  var _useState = useState(function () {
    var landmark = value.landmark;
    return landmark ? landmark : "";
  }),
      landmark = _useState[0],
      setLandmark = _useState[1];

  function onChange(e) {
    setLandmark(e.target.value);
  }

  var onSkip = function onSkip() {
    return _onSelect();
  };

  return /*#__PURE__*/React.createElement(FormStep, {
    config: config,
    value: landmark,
    onChange: onChange,
    onSelect: function onSelect(data) {
      return _onSelect(data);
    },
    onSkip: onSkip,
    t: t
  });
};

var SelectPincode = function SelectPincode(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      value = _ref.value;
  var tenants = Digit.Hooks.pgr.useTenants();

  var _useState = useState(function () {
    var pincode = value.pincode;
    return pincode;
  }),
      pincode = _useState[0],
      setPincode = _useState[1];

  var isNextDisabled = pincode ? false : true;

  var _useState2 = useState(null),
      pincodeServicability = _useState2[0],
      setPincodeServicability = _useState2[1];

  function onChange(e) {
    setPincode(e.target.value);

    if (!e.target.value) {
      isNextDisabled = true;
    } else {
      isNextDisabled = false;
    }

    setPincodeServicability(null);
  }

  var goNext = function goNext(data) {
    try {
      var foundValue = tenants.find(function (obj) {
        var _obj$pincode;

        return (_obj$pincode = obj.pincode) === null || _obj$pincode === void 0 ? void 0 : _obj$pincode.find(function (item) {
          return item == (data === null || data === void 0 ? void 0 : data.pincode);
        });
      });

      var _temp2 = function () {
        if (foundValue) {
          Digit.SessionStorage.set("city_complaint", foundValue);
          return Promise.resolve(Digit.LocationService.getLocalities(foundValue.code)).then(function (response) {
            var __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);

            var filteredLocalities = __localityList.filter(function (obj) {
              var _obj$pincode2;

              return (_obj$pincode2 = obj.pincode) === null || _obj$pincode2 === void 0 ? void 0 : _obj$pincode2.find(function (item) {
                return item == data.pincode;
              });
            });

            onSelect(_extends({}, data, {
              city_complaint: foundValue
            }));
          });
        } else {
          Digit.SessionStorage.set("city_complaint", undefined);
          Digit.SessionStorage.set("selected_localities", undefined);
          setPincodeServicability("CS_COMMON_PINCODE_NOT_SERVICABLE");
        }
      }();

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var onSkip = function onSkip() {
    return onSelect();
  };

  return /*#__PURE__*/React.createElement(FormStep, {
    t: t,
    config: config,
    onSelect: goNext,
    value: pincode,
    onChange: onChange,
    onSkip: onSkip,
    forcedError: t(pincodeServicability),
    isDisabled: isNextDisabled
  });
};

var SelectSubType = function SelectSubType(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      value = _ref.value;

  var _useState = useState(function () {
    var subType = value.subType;
    return subType ? subType : {};
  }),
      subType = _useState[0],
      setSubType = _useState[1];

  var complaintType = value.complaintType;
  var menu = Digit.Hooks.pgr.useComplaintSubType(complaintType, t);
  console.log("select subtype ", value, complaintType, subType, menu);

  var goNext = function goNext() {
    onSelect({
      subType: subType
    });
  };

  function selectedValue(value) {
    setSubType(value);
  }

  var configNew = _extends({}, config.texts, {
    headerCaption: t("SERVICEDEFS." + complaintType.key.toUpperCase())
  }, {
    menu: menu
  }, {
    optionsKey: "name"
  }, {
    selected: selectedValue
  }, {
    selectedOption: subType
  }, {
    onSave: goNext
  });

  return /*#__PURE__*/React.createElement(TypeSelectCard, _extends({}, configNew, {
    disabled: Object.keys(subType).length === 0 || subType === null ? true : false,
    t: t
  }));
};

var SelectGeolocation = function SelectGeolocation(_ref) {
  var onSelect = _ref.onSelect,
      t = _ref.t;
  var pincode = "";
  return /*#__PURE__*/React.createElement(LocationSearchCard, {
    header: t("CS_ADDCOMPLAINT_SELECT_GEOLOCATION_HEADER"),
    cardText: t("CS_ADDCOMPLAINT_SELECT_GEOLOCATION_TEXT"),
    nextText: t("CS_COMMON_NEXT"),
    skipAndContinueText: t("CS_COMMON_SKIP"),
    skip: function skip() {
      return onSelect();
    },
    onSave: function onSave() {
      return onSelect({
        pincode: pincode
      });
    },
    onChange: function onChange(code) {
      return pincode = code;
    }
  });
};

var config = {
  routes: {
    "complaint-type": {
      component: SelectComplaintType,
      texts: {
        headerCaption: "",
        header: "CS_ADDCOMPLAINT_COMPLAINT_TYPE_PLACEHOLDER",
        cardText: "CS_COMPLAINT_TYPE_TEXT",
        submitBarLabel: "CS_COMMON_NEXT"
      },
      nextStep: "sub-type"
    },
    "sub-type": {
      component: SelectSubType,
      texts: {
        header: "CS_ADDCOMPLAINT_COMPLAINT_SUBTYPE_PLACEHOLDER",
        cardText: "CS_COMPLAINT_SUBTYPE_TEXT",
        submitBarLabel: "CS_COMMON_NEXT"
      },
      nextStep: "map"
    },
    map: {
      component: SelectGeolocation,
      nextStep: "pincode"
    },
    pincode: {
      component: SelectPincode,
      texts: {
        headerCaption: "CS_ADDCOMPLAINT_COMPLAINT_LOCATION",
        header: "CS_FILE_APPLICATION_PINCODE_LABEL",
        cardText: "CS_ADDCOMPLAINT_CHANGE_PINCODE_TEXT",
        submitBarLabel: "CS_COMMON_NEXT",
        skipText: "CORE_COMMON_SKIP_CONTINUE"
      },
      inputs: [{
        label: "CORE_COMMON_PINCODE",
        type: "text",
        name: "pincode",
        validation: {
          minLength: 6,
          maxLength: 7
        },
        error: "CORE_COMMON_PINCODE_INVALID"
      }],
      nextStep: "address"
    },
    address: {
      component: SelectAddress,
      texts: {
        headerCaption: "CS_ADDCOMPLAINT_COMPLAINT_LOCATION",
        header: "CS_ADDCOMPLAINT_PROVIDE_COMPLAINT_ADDRESS",
        cardText: "CS_ADDCOMPLAINT_CITY_MOHALLA_TEXT",
        submitBarLabel: "CS_COMMON_NEXT"
      },
      nextStep: "landmark"
    },
    landmark: {
      component: SelectLandmark,
      texts: {
        headerCaption: "CS_ADDCOMPLAINT_COMPLAINT_LOCATION",
        header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_PROVIDE_LANDMARK_TITLE",
        cardText: "CS_FILE_APPLICATION_PROPERTY_LOCATION_PROVIDE_LANDMARK_TITLE_TEXT",
        submitBarLabel: "CS_COMMON_NEXT",
        skipText: "CORE_COMMON_SKIP_CONTINUE"
      },
      inputs: [{
        label: "CS_ADDCOMPLAINT_LANDMARK",
        type: "textarea",
        name: "landmark"
      }],
      nextStep: "upload-photos"
    },
    "upload-photos": {
      component: SelectImages,
      texts: {
        header: "CS_ADDCOMPLAINT_UPLOAD_PHOTO",
        cardText: "CS_ADDCOMPLAINT_UPLOAD_PHOTO_TEXT",
        submitBarLabel: "CS_COMMON_NEXT",
        skipText: "CORE_COMMON_SKIP_CONTINUE"
      },
      nextStep: "additional-details"
    },
    "additional-details": {
      component: SelectDetails,
      texts: {
        header: "CS_ADDCOMPLAINT_PROVIDE_ADDITIONAL_DETAILS",
        cardText: "CS_ADDCOMPLAINT_ADDITIONAL_DETAILS_TEXT",
        submitBarLabel: "CS_COMMON_NEXT"
      },
      inputs: [{
        label: "CS_ADDCOMPLAINT_ADDITIONAL_DETAILS",
        type: "textarea",
        name: "details"
      }],
      nextStep: null
    }
  },
  indexRoute: "complaint-type"
};

var CreateComplaint = function CreateComplaint() {
  var ComponentProvider = Digit.Contexts.ComponentProvider;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useLocation = useLocation(),
      pathname = _useLocation.pathname;

  var match = useRouteMatch();
  var history = useHistory();
  var registry = useContext(ComponentProvider);
  var dispatch = useDispatch();

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      storeData = _Digit$Hooks$useStore.data,
      isLoading = _Digit$Hooks$useStore.isLoading;

  var _ref = storeData || {},
      stateInfo = _ref.stateInfo;

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage(PGR_CITIZEN_CREATE_COMPLAINT, {}),
      params = _Digit$Hooks$useSessi[0],
      setParams = _Digit$Hooks$useSessi[1];

  var config$1 = useMemo(function () {
    return merge(config, Digit.Customizations.PGR.complaintConfig);
  }, [Digit.Customizations.PGR.complaintConfig]);

  var _useState = useState(params),
      paramState = _useState[0],
      setParamState = _useState[1];

  var _useState2 = useState(""),
      nextStep = _useState2[0],
      setNextStep = _useState2[1];

  var _useState3 = useState(0);

  var client = useQueryClient();
  useEffect(function () {
    setParamState(params);

    if (nextStep === null) {
      submitComplaint();
    } else {
      history.push(match.path + "/" + nextStep);
    }
  }, [params, nextStep]);

  var goNext = function goNext() {
    var currentPath = pathname.split("/").pop();
    var nextStep = config$1.routes[currentPath].nextStep;
    var compType = Digit.SessionStorage.get(PGR_CITIZEN_CREATE_COMPLAINT);

    if (nextStep === "sub-type" && compType.complaintType.key === "Others") {
      setParams(_extends({}, params, {
        complaintType: {
          key: "Others",
          name: t("SERVICEDEFS.OTHERS")
        },
        subType: {
          key: "Others",
          name: t("SERVICEDEFS.OTHERS")
        }
      }));
      nextStep = config$1.routes[nextStep].nextStep;
    }

    setNextStep(nextStep);
  };

  var submitComplaint = function submitComplaint() {
    try {
      var _temp2 = function () {
        if (paramState !== null && paramState !== void 0 && paramState.complaintType) {
          var city_complaint = paramState.city_complaint,
              locality_complaint = paramState.locality_complaint,
              uploadedImages = paramState.uploadedImages,
              complaintType = paramState.complaintType,
              subType = paramState.subType,
              details = paramState.details,
              values = _objectWithoutPropertiesLoose(paramState, ["city_complaint", "locality_complaint", "uploadedImages", "complaintType", "subType", "details"]);

          var cityCode = city_complaint.code,
              city = city_complaint.name;
          var localityCode = locality_complaint.code,
              localityName = locality_complaint.name;

          var _uploadImages = uploadedImages === null || uploadedImages === void 0 ? void 0 : uploadedImages.map(function (url) {
            return {
              documentType: "PHOTO",
              fileStoreId: url,
              documentUid: "",
              additionalDetails: {}
            };
          });

          var data = _extends({}, values, {
            complaintType: subType.key,
            cityCode: cityCode,
            city: city,
            description: details,
            district: city,
            region: city,
            localityCode: localityCode,
            localityName: localityName,
            state: stateInfo.name,
            uploadedImages: _uploadImages
          });

          return Promise.resolve(dispatch(createComplaint(data))).then(function () {
            return Promise.resolve(client.refetchQueries(["complaintsList"])).then(function () {
              history.push(match.path + "/response");
            });
          });
        }
      }();

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var handleSelect = function handleSelect(data) {
    console.log("DATA selected", data);
    setParams(_extends({}, params, data));
    goNext();
  };

  var handleSkip = function handleSkip() {
    goNext();
  };

  if (isLoading) return null;
  return /*#__PURE__*/React.createElement(Switch, null, Object.keys(config$1.routes).map(function (route, index) {
    var _config$routes$route = config$1.routes[route],
        component = _config$routes$route.component,
        texts = _config$routes$route.texts,
        inputs = _config$routes$route.inputs;
    var Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
    return /*#__PURE__*/React.createElement(Route, {
      path: match.path + "/" + route,
      key: index
    }, /*#__PURE__*/React.createElement(Component, {
      config: {
        texts: texts,
        inputs: inputs
      },
      onSelect: handleSelect,
      onSkip: handleSkip,
      value: params,
      t: t
    }));
  }), /*#__PURE__*/React.createElement(Route, {
    path: match.path + "/response"
  }, /*#__PURE__*/React.createElement(Response$1, {
    match: match
  })), /*#__PURE__*/React.createElement(Route, null, /*#__PURE__*/React.createElement(Redirect, {
    to: match.path + "/" + config$1.indexRoute
  })));
};

var Complaint = function Complaint(_ref) {
  var data = _ref.data,
      path = _ref.path;
  var serviceCode = data.serviceCode,
      serviceRequestId = data.serviceRequestId,
      applicationStatus = data.applicationStatus;
  var history = useHistory();

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var handleClick = function handleClick() {
    history.push(path + "/" + serviceRequestId);
  };

  var closedStatus = ["RESOLVED", "REJECTED", "CLOSEDAFTERREJECTION", "CLOSEDAFTERRESOLUTION"];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    onClick: handleClick
  }, /*#__PURE__*/React.createElement(CardSubHeader, null, t("SERVICEDEFS." + serviceCode.toUpperCase())), /*#__PURE__*/React.createElement(DateWrap, {
    date: Digit.DateUtils.ConvertTimestampToDate(data.auditDetails.createdTime)
  }), /*#__PURE__*/React.createElement(KeyNote, {
    keyValue: t(LOCALIZATION_KEY.CS_COMMON + "_COMPLAINT_NO"),
    note: serviceRequestId
  }), /*#__PURE__*/React.createElement("div", {
    className: "status-highlight " + (closedStatus.includes(applicationStatus) ? "success" : "")
  }, /*#__PURE__*/React.createElement("p", null, (closedStatus.includes(applicationStatus) ? t("CS_COMMON_CLOSED") : t("CS_COMMON_OPEN")).toUpperCase())), t(LOCALIZATION_KEY.CS_COMMON + "_" + applicationStatus)));
};

var ComplaintsList = function ComplaintsList(props) {
  var _User$info, _User$info2, _User$info2$userInfo;

  var User = Digit.UserService.getUser();
  var mobileNumber = User.mobileNumber || (User === null || User === void 0 ? void 0 : (_User$info = User.info) === null || _User$info === void 0 ? void 0 : _User$info.mobileNumber) || (User === null || User === void 0 ? void 0 : (_User$info2 = User.info) === null || _User$info2 === void 0 ? void 0 : (_User$info2$userInfo = _User$info2.userInfo) === null || _User$info2$userInfo === void 0 ? void 0 : _User$info2$userInfo.mobileNumber);
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useRouteMatch = useRouteMatch(),
      path = _useRouteMatch.path,
      url = _useRouteMatch.url;

  var _Digit$Hooks$pgr$useC = Digit.Hooks.pgr.useComplaintsListByMobile(tenantId, mobileNumber),
      isLoading = _Digit$Hooks$pgr$useC.isLoading,
      error = _Digit$Hooks$pgr$useC.error,
      data = _Digit$Hooks$pgr$useC.data,
      revalidate = _Digit$Hooks$pgr$useC.revalidate;

  useEffect(function () {
    revalidate();
  }, []);

  if (isLoading) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, null, t(LOCALE.MY_COMPLAINTS)), /*#__PURE__*/React.createElement(Loader, null));
  }

  console.log("complaints list", path, url);
  var complaints = data === null || data === void 0 ? void 0 : data.ServiceWrappers;
  var complaintsList;

  if (error) {
    complaintsList = /*#__PURE__*/React.createElement(Card, null, t(LOCALE.ERROR_LOADING_RESULTS).split("\\n").map(function (text, index) {
      return /*#__PURE__*/React.createElement("p", {
        key: index,
        style: {
          textAlign: "center"
        }
      }, text);
    }));
  } else if (complaints.length === 0) {
    complaintsList = /*#__PURE__*/React.createElement(Card, null, t(LOCALE.NO_COMPLAINTS).split("\\n").map(function (text, index) {
      return /*#__PURE__*/React.createElement("p", {
        key: index,
        style: {
          textAlign: "center"
        }
      }, text);
    }));
  } else {
    complaintsList = complaints.map(function (_ref, index) {
      var service = _ref.service;
      return /*#__PURE__*/React.createElement(Complaint, {
        key: index,
        data: service,
        path: path
      });
    });
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, null, t(LOCALE.MY_COMPLAINTS)), complaintsList);
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

var PendingAtLME = function PendingAtLME(_ref) {
  var name = _ref.name,
      isCompleted = _ref.isCompleted,
      mobile = _ref.mobile,
      text = _ref.text;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  return name && mobile ? /*#__PURE__*/React.createElement(CheckPoint, {
    isCompleted: isCompleted,
    customChild: /*#__PURE__*/React.createElement(TelePhone, {
      mobile: mobile,
      text: text + " " + name
    })
  }) : /*#__PURE__*/React.createElement(CheckPoint, {
    label: t("CS_COMMON_PENDINGATLME")
  });
};

var PendingForAssignment = function PendingForAssignment(_ref) {
  var isCompleted = _ref.isCompleted,
      text = _ref.text;
  return /*#__PURE__*/React.createElement(CheckPoint, {
    isCompleted: isCompleted,
    label: text
  });
};

var StarRated = function StarRated(_ref) {
  var text = _ref.text,
      rating = _ref.rating;
  return /*#__PURE__*/React.createElement(Rating, {
    text: text,
    withText: true,
    currentRating: rating,
    maxRating: 5,
    onFeedback: function onFeedback() {}
  });
};

var Resolved = function Resolved(_ref) {
  var action = _ref.action,
      nextActions = _ref.nextActions,
      rating = _ref.rating,
      serviceRequestId = _ref.serviceRequestId,
      reopenDate = _ref.reopenDate,
      isCompleted = _ref.isCompleted;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  if (action === "RESOLVE") {
    var actions = nextActions && nextActions.map(function (action, index) {
      if (action && action !== "COMMENT") {
        return /*#__PURE__*/React.createElement(Link, {
          key: index,
          to: "/digit-ui/citizen/pgr/" + action.toLowerCase() + "/" + serviceRequestId
        }, /*#__PURE__*/React.createElement(ActionLinks, null, t("CS_COMMON_" + action)));
      }
    });
    return /*#__PURE__*/React.createElement(CheckPoint, {
      isCompleted: isCompleted,
      label: t("CS_COMMON_COMPLAINT_RESOLVED"),
      customChild: /*#__PURE__*/React.createElement("div", null, actions)
    });
  } else if (action === "RATE" && rating) {
    return /*#__PURE__*/React.createElement(CheckPoint, {
      isCompleted: isCompleted,
      label: t("CS_COMMON_COMPLAINT_RESOLVED"),
      customChild: /*#__PURE__*/React.createElement(StarRated, {
        text: t("CS_ADDCOMPLAINT_YOU_RATED"),
        rating: rating
      })
    });
  } else if (action === "REOPEN") {
    return /*#__PURE__*/React.createElement(CheckPoint, {
      isCompleted: isCompleted,
      label: t("CS_COMMON_COMPLAINT_REOPENED"),
      info: reopenDate
    });
  } else {
    var _actions = nextActions && nextActions.map(function (action, index) {
      if (action && action !== "COMMENT") {
        return /*#__PURE__*/React.createElement(Link, {
          key: index,
          to: "/digit-ui/citizen/pgr/" + action.toLowerCase() + "/" + serviceRequestId
        }, /*#__PURE__*/React.createElement(ActionLinks, null, t("CS_COMMON_" + action)));
      }
    });

    return /*#__PURE__*/React.createElement(CheckPoint, {
      isCompleted: isCompleted,
      label: t("CS_COMMON_COMPLAINT_RESOLVED"),
      customChild: /*#__PURE__*/React.createElement("div", null, _actions)
    });
  }
};

var Rejected = function Rejected(_ref) {
  var action = _ref.action,
      nextActions = _ref.nextActions,
      rating = _ref.rating,
      serviceRequestId = _ref.serviceRequestId,
      reopenDate = _ref.reopenDate,
      isCompleted = _ref.isCompleted;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  if (action === "REJECTED") {
    var actions = nextActions && nextActions.map(function (action, index) {
      if (action && action !== "COMMENT") {
        return /*#__PURE__*/React.createElement(Link, {
          key: index,
          to: "/digit-ui/citizen/pgr/" + action.toLowerCase() + "/" + serviceRequestId
        }, /*#__PURE__*/React.createElement(ActionLinks, null, t("CS_COMMON_" + action)));
      }
    });
    return /*#__PURE__*/React.createElement(CheckPoint, {
      isCompleted: isCompleted,
      label: t("CS_COMMON_COMPLAINT_REJECTED"),
      customChild: /*#__PURE__*/React.createElement("div", null, actions)
    });
  } else if (action === "RATE" && rating) {
    return /*#__PURE__*/React.createElement(CheckPoint, {
      isCompleted: isCompleted,
      label: t("CS_COMMON_COMPLAINT_REJECTED"),
      customChild: /*#__PURE__*/React.createElement(StarRated, {
        text: t("CS_ADDCOMPLAINT_YOU_RATED"),
        rating: rating
      })
    });
  } else if (action === "REOPEN") {
    return /*#__PURE__*/React.createElement(CheckPoint, {
      isCompleted: isCompleted,
      label: t("CS_COMMON_COMPLAINT_REOPENED"),
      info: reopenDate
    });
  } else {
    var _actions = nextActions && nextActions.map(function (action, index) {
      if (action && action !== "COMMENT") {
        return /*#__PURE__*/React.createElement(Link, {
          key: index,
          to: "/digit-ui/citizen/pgr/" + action.toLowerCase() + "/" + serviceRequestId
        }, /*#__PURE__*/React.createElement(ActionLinks, null, t("CS_COMMON_" + action)));
      }
    });

    return /*#__PURE__*/React.createElement(CheckPoint, {
      isCompleted: isCompleted,
      label: t("CS_COMMON_COMPLAINT_REJECTED"),
      customChild: /*#__PURE__*/React.createElement("div", null, _actions)
    });
  }
};

var TimeLine = function TimeLine(_ref) {
  var data = _ref.data,
      serviceRequestId = _ref.serviceRequestId,
      complaintWorkflow = _ref.complaintWorkflow,
      rating = _ref.rating;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var timeline = data.timeline;
  useEffect(function () {
    var auditDetails = timeline === null || timeline === void 0 ? void 0 : timeline.filter(function (status, index, array) {
      if (index === array.length - 1 && status.status === "PENDINGFORASSIGNMENT") {
        return true;
      } else {
        return false;
      }
    });
    timeline === null || timeline === void 0 ? void 0 : timeline.push({
      auditDetails: {
        created: auditDetails.created,
        lastModified: auditDetails.lastModified
      },
      performedAction: "FILED",
      status: "COMPLAINT_FILED"
    });
  }, [timeline]);

  var getCheckPoint = function getCheckPoint(_ref2) {
    var status = _ref2.status,
        caption = _ref2.caption,
        auditDetails = _ref2.auditDetails,
        timeLineActions = _ref2.timeLineActions,
        index = _ref2.index;
    var isCurrent = 0 === index;

    switch (status) {
      case "PENDINGFORREASSIGNMENT":
        return /*#__PURE__*/React.createElement(CheckPoint, {
          isCompleted: isCurrent,
          key: index,
          label: t("CS_COMMON_PENDINGFORASSIGNMENT")
        });

      case "PENDINGFORASSIGNMENT":
        return /*#__PURE__*/React.createElement(PendingForAssignment, {
          key: index,
          isCompleted: isCurrent,
          text: t("CS_COMMON_PENDINGFORASSIGNMENT")
        });

      case "PENDINGFORASSIGNMENT_AFTERREOPEN":
        return /*#__PURE__*/React.createElement(PendingForAssignment, {
          isCompleted: isCurrent,
          key: index,
          text: t("CS_COMMON_PENDINGFORASSIGNMENT")
        });

      case "PENDINGATLME":
        var _ref3 = caption && caption.length > 0 ? caption[0] : {
          name: "",
          mobileNumber: ""
        },
            name = _ref3.name,
            mobileNumber = _ref3.mobileNumber;

        var assignedTo = "" + t("CS_COMMON_COMPLAINT_ASSIGNED_TO");
        return /*#__PURE__*/React.createElement(PendingAtLME, {
          isCompleted: isCurrent,
          key: index,
          name: name,
          mobile: mobileNumber,
          text: assignedTo
        });

      case "RESOLVED":
        return /*#__PURE__*/React.createElement(Resolved, {
          key: index,
          isCompleted: isCurrent,
          action: complaintWorkflow.action,
          nextActions: index <= 1 && timeLineActions,
          rating: index <= 1 && rating,
          serviceRequestId: serviceRequestId,
          reopenDate: Digit.DateUtils.ConvertTimestampToDate(auditDetails.lastModifiedTime)
        });

      case "REJECTED":
        return /*#__PURE__*/React.createElement(Rejected, {
          key: index,
          isCompleted: isCurrent,
          action: complaintWorkflow.action,
          nextActions: index <= 1 && timeLineActions,
          rating: index <= 1 && rating,
          serviceRequestId: serviceRequestId,
          reopenDate: Digit.DateUtils.ConvertTimestampToDate(auditDetails.lastModifiedTime)
        });

      case "CLOSEDAFTERRESOLUTION":
        return /*#__PURE__*/React.createElement(CheckPoint, {
          isCompleted: isCurrent,
          key: index,
          label: t("CS_COMMON_CLOSEDAFTERRESOLUTION")
        });

      case "COMPLAINT_FILED":
        return /*#__PURE__*/React.createElement(CheckPoint, {
          isCompleted: isCurrent,
          key: index,
          label: t("CS_COMMON_COMPLAINT_FILED"),
          info: auditDetails.created
        });

      default:
        return /*#__PURE__*/React.createElement(CheckPoint, {
          isCompleted: isCurrent,
          key: index,
          label: t("CS_COMMON_" + status)
        });
    }
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CardSubHeader, null, t(LOCALIZATION_KEY.CS_COMPLAINT_DETAILS + "_COMPLAINT_TIMELINE")), timeline && timeline.length > 0 ? /*#__PURE__*/React.createElement(ConnectingCheckPoints, null, timeline.map(function (_ref4, index, array) {
    var status = _ref4.status,
        caption = _ref4.caption,
        auditDetails = _ref4.auditDetails,
        timeLineActions = _ref4.timeLineActions,
        performedAction = _ref4.performedAction;
    return getCheckPoint({
      status: status,
      caption: caption,
      auditDetails: auditDetails,
      timeLineActions: timeLineActions,
      index: index,
      array: array,
      performedAction: performedAction
    });
  })) : /*#__PURE__*/React.createElement(Loader, null));
};

var WorkflowComponent = function WorkflowComponent(_ref) {
  var complaintDetails = _ref.complaintDetails,
      id = _ref.id,
      getWorkFlow = _ref.getWorkFlow;
  var tenantId = complaintDetails.service.tenantId;
  var workFlowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: id,
    moduleCode: "PGR"
  });
  useEffect(function () {
    getWorkFlow(workFlowDetails.data);
  }, [workFlowDetails.data]);
  useEffect(function () {
    workFlowDetails.revalidate();
  }, []);
  return !workFlowDetails.isLoading && /*#__PURE__*/React.createElement(TimeLine, {
    data: workFlowDetails.data,
    serviceRequestId: id,
    complaintWorkflow: complaintDetails.workflow,
    rating: complaintDetails.audit.rating
  });
};

var ComplaintDetailsPage = function ComplaintDetailsPage(props) {
  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useParams = useParams(),
      id = _useParams.id;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$Hooks$pgr$useC = Digit.Hooks.pgr.useComplaintDetails({
    tenantId: tenantId,
    id: id
  }),
      isLoading = _Digit$Hooks$pgr$useC.isLoading,
      isError = _Digit$Hooks$pgr$useC.isError,
      complaintDetails = _Digit$Hooks$pgr$useC.complaintDetails,
      revalidate = _Digit$Hooks$pgr$useC.revalidate;

  var _useState = useState(null),
      imageZoom = _useState[0],
      setImageZoom = _useState[1];

  var _useState2 = useState(""),
      comment = _useState2[0],
      setComment = _useState2[1];

  var _useState3 = useState(false),
      toast = _useState3[0],
      setToast = _useState3[1];

  var _useState4 = useState(null),
      commentError = _useState4[0],
      setCommentError = _useState4[1];

  var _useState5 = useState(true),
      disableComment = _useState5[0],
      setDisableComment = _useState5[1];

  var _useState6 = useState(false),
      loader = _useState6[0],
      setLoader = _useState6[1];

  useEffect(function () {
    (function () {
      try {
        var _temp2 = function () {
          if (complaintDetails) {
            setLoader(true);
            return Promise.resolve(revalidate()).then(function () {
              setLoader(false);
            });
          }
        }();

        return _temp2 && _temp2.then ? _temp2.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, []);

  function zoomImage(imageSource, index) {
    setImageZoom(complaintDetails.images[index - 1]);
  }

  function onCloseImageZoom() {
    setImageZoom(null);
  }

  var onWorkFlowChange = function onWorkFlowChange(data) {
    var _timeline$0$timeLineA;

    var timeline = data === null || data === void 0 ? void 0 : data.timeline;
    timeline && (_timeline$0$timeLineA = timeline[0].timeLineActions) !== null && _timeline$0$timeLineA !== void 0 && _timeline$0$timeLineA.filter(function (e) {
      return e === "COMMENT";
    }).length ? setDisableComment(false) : setDisableComment(true);
  };

  var submitComment = function submitComment() {
    try {
      var _exit2 = false;

      var _temp5 = function _temp5(_result) {
        if (_exit2) return _result;
        setToast(true);
        setTimeout(function () {
          setToast(false);
        }, 30000);
      };

      var detailsToSend = _extends({}, complaintDetails);

      delete detailsToSend.audit;
      delete detailsToSend.details;
      detailsToSend.workflow = {
        action: "COMMENT",
        comments: comment
      };

      var _tenantId = Digit.ULBService.getCurrentTenantId();

      var _temp6 = _catch(function () {
        setCommentError(null);
        return Promise.resolve(Digit.PGRService.update(detailsToSend, _tenantId)).then(function (res) {
          if (res.ServiceWrappers.length) setComment("");else throw true;
        });
      }, function () {
        setCommentError(true);
      });

      return Promise.resolve(_temp6 && _temp6.then ? _temp6.then(_temp5) : _temp5(_temp6));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  if (isLoading || loader) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  if (isError) {
    return /*#__PURE__*/React.createElement("h2", null, "Error");
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Header, null, t(LOCALIZATION_KEY.CS_HEADER + "_COMPLAINT_SUMMARY")), Object.keys(complaintDetails).length > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardSubHeader, null, t("SERVICEDEFS." + complaintDetails.audit.serviceCode.toUpperCase())), /*#__PURE__*/React.createElement(StatusTable, null, Object.keys(complaintDetails.details).map(function (flag, index, arr) {
    return /*#__PURE__*/React.createElement(Row, {
      key: index,
      label: t(flag),
      text: Array.isArray(complaintDetails.details[flag]) ? complaintDetails.details[flag].map(function (val) {
        return typeof val === "object" ? t(val === null || val === void 0 ? void 0 : val.code) : t(val);
      }) : t(complaintDetails.details[flag]) || "N/A",
      last: index === arr.length - 1
    });
  })), complaintDetails.thumbnails && complaintDetails.thumbnails.length !== 0 ? /*#__PURE__*/React.createElement(DisplayPhotos, {
    srcs: complaintDetails.thumbnails,
    onClick: function onClick(source, index) {
      return zoomImage(source, index);
    }
  }) : null, imageZoom ? /*#__PURE__*/React.createElement(ImageViewer, {
    imageSrc: imageZoom,
    onClose: onCloseImageZoom
  }) : null), /*#__PURE__*/React.createElement(Card, null, (complaintDetails === null || complaintDetails === void 0 ? void 0 : complaintDetails.service) && /*#__PURE__*/React.createElement(WorkflowComponent, {
    getWorkFlow: onWorkFlowChange,
    complaintDetails: complaintDetails,
    id: id
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardSubHeader, null, t(LOCALIZATION_KEY.CS_COMMON + "_COMMENTS")), /*#__PURE__*/React.createElement(TextArea, {
    value: comment,
    onChange: function onChange(e) {
      return setComment(e.target.value);
    },
    name: ""
  }), /*#__PURE__*/React.createElement(SubmitBar, {
    disabled: disableComment || comment.length < 1,
    onSubmit: submitComment,
    label: t("CS_PGR_SEND_COMMENT")
  })), toast && /*#__PURE__*/React.createElement(Toast, {
    error: commentError,
    label: !commentError ? t("CS_COMPLAINT_COMMENT_SUCCESS") : t("CS_COMPLAINT_COMMENT_ERROR"),
    onClose: function onClose() {
      return setToast(false);
    }
  }), " ") : /*#__PURE__*/React.createElement(Loader, null));
};

var App = function App() {
  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useRouteMatch = useRouteMatch(),
      path = _useRouteMatch.path,
      url = _useRouteMatch.url,
      match = _objectWithoutPropertiesLoose(_useRouteMatch, ["path", "url"]);

  var location = useLocation();
  return /*#__PURE__*/React.createElement(React.Fragment, null, !location.pathname.includes("/response") && /*#__PURE__*/React.createElement(BackButton, null, t("CS_COMMON_BACK")), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/create-complaint",
    component: CreateComplaint
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/complaints",
    exact: true,
    component: ComplaintsList
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/complaints/:id*",
    component: ComplaintDetailsPage
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/reopen",
    component: function component() {
      return /*#__PURE__*/React.createElement(ReopenComplaint, {
        match: _extends({}, match, {
          url: url,
          path: path + "/reopen"
        }),
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/rate/:id*",
    component: function component() {
      return /*#__PURE__*/React.createElement(SelectRating, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: path + "/response",
    component: function component() {
      return /*#__PURE__*/React.createElement(Response, {
        match: _extends({}, match, {
          url: url,
          path: path
        })
      });
    }
  })));
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

var Heading = function Heading(props) {
  return /*#__PURE__*/React.createElement("h1", {
    className: "heading-m"
  }, props.label);
};

var CloseBtn = function CloseBtn(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "icon-bg-secondary",
    onClick: props.onClick
  }, /*#__PURE__*/React.createElement(Close, null));
};

var TLCaption = function TLCaption(_ref) {
  var data = _ref.data;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React.createElement("div", null, data.date && /*#__PURE__*/React.createElement("p", null, data.date), /*#__PURE__*/React.createElement("p", null, data.name), /*#__PURE__*/React.createElement("p", null, data.mobileNumber), data.source && /*#__PURE__*/React.createElement("p", null, t("ES_COMMON_FILED_VIA_" + data.source.toUpperCase())));
};

var ComplaintDetailsModal = function ComplaintDetailsModal(_ref2) {
  var _workflowDetails$data, _workflowDetails$data2, _roles$;

  var workflowDetails = _ref2.workflowDetails,
      complaintDetails = _ref2.complaintDetails,
      close = _ref2.close,
      popup = _ref2.popup,
      selectedAction = _ref2.selectedAction,
      onAssign = _ref2.onAssign,
      tenantId = _ref2.tenantId,
      t = _ref2.t;
  var employeeRoles = workflowDetails !== null && workflowDetails !== void 0 && (_workflowDetails$data = workflowDetails.data) !== null && _workflowDetails$data !== void 0 && _workflowDetails$data.nextActions ? workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data2 = workflowDetails.data) === null || _workflowDetails$data2 === void 0 ? void 0 : _workflowDetails$data2.nextActions : null;
  var roles = employeeRoles.filter(function (role) {
    return role.action === selectedAction;
  });
  var useEmployeeData = Digit.Hooks.pgr.useEmployeeFilter(tenantId, (_roles$ = roles[0]) === null || _roles$ === void 0 ? void 0 : _roles$.roles, complaintDetails);
  var employeeData = useEmployeeData ? useEmployeeData.map(function (departmentData) {
    return {
      heading: departmentData.department,
      options: departmentData.employees
    };
  }) : null;

  var _useState = useState(null),
      selectedEmployee = _useState[0],
      setSelectedEmployee = _useState[1];

  var _useState2 = useState(""),
      comments = _useState2[0],
      setComments = _useState2[1];

  var _useState3 = useState(null),
      file = _useState3[0],
      setFile = _useState3[1];

  var _useState4 = useState(null),
      uploadedFile = _useState4[0],
      setUploadedFile = _useState4[1];

  var _useState5 = useState(null),
      error = _useState5[0],
      setError = _useState5[1];

  var cityDetails = Digit.ULBService.getCurrentUlb();

  var _useState6 = useState(null),
      selectedReopenReason = _useState6[0],
      setSelectedReopenReason = _useState6[1];

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
                  return Promise.resolve(Digit.UploadServices.Filestorage("property-upload", file, cityDetails.code)).then(function (response) {
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
  var reopenReasonMenu = [t("CS_REOPEN_OPTION_ONE"), t("CS_REOPEN_OPTION_TWO"), t("CS_REOPEN_OPTION_THREE"), t("CS_REOPEN_OPTION_FOUR")];

  function onSelectEmployee(employee) {
    setSelectedEmployee(employee);
  }

  function addComment(e) {
    setComments(e.target.value);
  }

  function selectfile(e) {
    setFile(e.target.files[0]);
  }

  function onSelectReopenReason(reason) {
    setSelectedReopenReason(reason);
  }

  return /*#__PURE__*/React.createElement(Modal, {
    headerBarMain: /*#__PURE__*/React.createElement(Heading, {
      label: selectedAction === "ASSIGN" || selectedAction === "REASSIGN" ? t("CS_ACTION_ASSIGN") : selectedAction === "REJECT" ? t("CS_ACTION_REJECT") : selectedAction === "REOPEN" ? t("CS_COMMON_REOPEN") : t("CS_COMMON_RESOLVE")
    }),
    headerBarEnd: /*#__PURE__*/React.createElement(CloseBtn, {
      onClick: function onClick() {
        return close(popup);
      }
    }),
    actionCancelLabel: t("CS_COMMON_CANCEL"),
    actionCancelOnSubmit: function actionCancelOnSubmit() {
      return close(popup);
    },
    actionSaveLabel: selectedAction === "ASSIGN" || selectedAction === "REASSIGN" ? t("CS_COMMON_ASSIGN") : selectedAction === "REJECT" ? t("CS_COMMON_REJECT") : selectedAction === "REOPEN" ? t("CS_COMMON_REOPEN") : t("CS_COMMON_RESOLVE"),
    actionSaveOnSubmit: function actionSaveOnSubmit() {
      onAssign(selectedEmployee, comments, uploadedFile);
    },
    error: error,
    setError: setError
  }, /*#__PURE__*/React.createElement(Card, null, selectedAction === "REJECT" || selectedAction === "RESOLVE" || selectedAction === "REOPEN" ? null : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CardLabel, null, t("CS_COMMON_EMPLOYEE_NAME")), employeeData && /*#__PURE__*/React.createElement(SectionalDropdown, {
    selected: selectedEmployee,
    menuData: employeeData,
    displayKey: "name",
    select: onSelectEmployee
  })), selectedAction === "REOPEN" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CardLabel, null, t("CS_REOPEN_COMPLAINT")), /*#__PURE__*/React.createElement(Dropdown, {
    selected: selectedReopenReason,
    option: reopenReasonMenu,
    select: onSelectReopenReason
  })) : null, /*#__PURE__*/React.createElement(CardLabel, null, t("CS_COMMON_EMPLOYEE_COMMENTS")), /*#__PURE__*/React.createElement(TextArea, {
    name: "comment",
    onChange: addComment,
    value: comments
  }), /*#__PURE__*/React.createElement(CardLabel, null, t("CS_ACTION_SUPPORTING_DOCUMENTS")), /*#__PURE__*/React.createElement(CardLabelDesc, null, t("CS_UPLOAD_RESTRICTIONS")), /*#__PURE__*/React.createElement(UploadFile, {
    accept: ".jpg",
    onUpload: selectfile,
    onDelete: function onDelete() {
      setUploadedFile(null);
    },
    message: uploadedFile ? "1 " + t("CS_ACTION_FILEUPLOADED") : t("CS_ACTION_NO_FILEUPLOADED")
  })));
};

var ComplaintDetails = function ComplaintDetails(props) {
  var _complaintDetails$thu, _workflowDetails$data3, _workflowDetails$data4, _workflowDetails$data5, _workflowDetails$data6, _workflowDetails$data7, _workflowDetails$data8, _workflowDetails$data9, _workflowDetails$data10, _workflowDetails$data11, _workflowDetails$data12, _workflowDetails$data13;

  var onAssign = function onAssign(selectedEmployee, comments, uploadedFile) {
    try {
      setPopup(false);
      return Promise.resolve(Digit.Complaint.assign(complaintDetails, selectedAction, selectedEmployee, comments, uploadedFile, tenantId)).then(function (response) {
        console.log("find response complaint assign here", response);
        setAssignResponse(response);
        setToast(true);
        setLoader(true);
        return Promise.resolve(refreshData()).then(function () {
          setLoader(false);
          setRerender(rerender + 1);
          setTimeout(function () {
            return setToast(false);
          }, 10000);
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var _useParams = useParams(),
      id = _useParams.id;

  var _useTranslation2 = useTranslation(),
      t = _useTranslation2.t;

  var _useState7 = useState(false),
      fullscreen = _useState7[0],
      setFullscreen = _useState7[1];

  var _useState8 = useState(null),
      imageZoom = _useState8[0],
      setImageZoom = _useState8[1];

  var _useState9 = useState(false),
      toast = _useState9[0],
      setToast = _useState9[1];

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$Hooks$pgr$useC = Digit.Hooks.pgr.useComplaintDetails({
    tenantId: tenantId,
    id: id
  }),
      isLoading = _Digit$Hooks$pgr$useC.isLoading,
      complaintDetails = _Digit$Hooks$pgr$useC.complaintDetails,
      revalidateComplaintDetails = _Digit$Hooks$pgr$useC.revalidate;

  var workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: id,
    moduleCode: "PGR",
    role: "EMPLOYEE"
  });

  var _useState10 = useState(false),
      displayMenu = _useState10[0],
      setDisplayMenu = _useState10[1];

  var _useState11 = useState(false),
      popup = _useState11[0],
      setPopup = _useState11[1];

  var _useState12 = useState(null),
      selectedAction = _useState12[0],
      setSelectedAction = _useState12[1];

  var _useState13 = useState(null),
      assignResponse = _useState13[0],
      setAssignResponse = _useState13[1];

  var _useState14 = useState(false),
      loader = _useState14[0],
      setLoader = _useState14[1];

  var _useState15 = useState(1),
      rerender = _useState15[0],
      setRerender = _useState15[1];

  var client = useQueryClient();

  useEffect(function () {
    try {
      var _Digit, _Digit$WorkflowServic;

      return Promise.resolve((_Digit = Digit) === null || _Digit === void 0 ? void 0 : (_Digit$WorkflowServic = _Digit.WorkflowService) === null || _Digit$WorkflowServic === void 0 ? void 0 : _Digit$WorkflowServic.getByBusinessId(tenantId, id)).then(function (assignWorkflow) {
        console.log("assign", assignWorkflow);
      });
    } catch (e) {
      Promise.reject(e);
    }
  }, [complaintDetails]);

  var refreshData = function refreshData() {
    try {
      return Promise.resolve(client.refetchQueries(["fetchInboxData"])).then(function () {
        return Promise.resolve(workflowDetails.revalidate()).then(function () {
          return Promise.resolve(revalidateComplaintDetails()).then(function () {});
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  useEffect(function () {
    (function () {
      try {
        var _temp8 = function () {
          if (complaintDetails) {
            setLoader(true);
            return Promise.resolve(refreshData()).then(function () {
              setLoader(false);
            });
          }
        }();

        return _temp8 && _temp8.then ? _temp8.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, []);

  function close(state) {
    switch (state) {
      case fullscreen:
        setFullscreen(!fullscreen);
        break;

      case popup:
        setPopup(!popup);
        break;

      default:
        console.log(state);
        break;
    }
  }

  function zoomImage(imageSource, index) {
    setImageZoom(complaintDetails.images[index - 1]);
  }

  function onCloseImageZoom() {
    setImageZoom(null);
  }

  function onActionSelect(action) {
    setSelectedAction(action);

    switch (action) {
      case "ASSIGN":
        setPopup(true);
        setDisplayMenu(false);
        break;

      case "REASSIGN":
        setPopup(true);
        setDisplayMenu(false);
        break;

      case "RESOLVE":
        setPopup(true);
        setDisplayMenu(false);
        break;

      case "REJECT":
        setPopup(true);
        setDisplayMenu(false);
        break;

      case "REOPEN":
        setPopup(true);
        setDisplayMenu(false);
        break;

      default:
        console.log("action not known");
        setDisplayMenu(false);
    }
  }

  function closeToast() {
    setToast(false);
  }

  if (isLoading || workflowDetails.isLoading || loader) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  if (workflowDetails.isError) return /*#__PURE__*/React.createElement(React.Fragment, null, workflowDetails.error);

  var getTimelineCaptions = function getTimelineCaptions(checkpoint) {
    if (checkpoint.status === "COMPLAINT_FILED" && complaintDetails !== null && complaintDetails !== void 0 && complaintDetails.audit) {
      var caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(complaintDetails.audit.details.createdTime),
        name: complaintDetails.audit.citizen.name,
        mobileNumber: complaintDetails.audit.citizen.mobileNumber,
        source: complaintDetails.audit.source
      };
      return /*#__PURE__*/React.createElement(TLCaption, {
        data: caption
      });
    }

    return checkpoint.caption && checkpoint.caption.length !== 0 ? /*#__PURE__*/React.createElement(TLCaption, {
      data: checkpoint.caption[0]
    }) : null;
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardSubHeader, null, t("CS_HEADER_COMPLAINT_SUMMARY")), /*#__PURE__*/React.createElement(CardLabel, null, t("CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS")), isLoading ? /*#__PURE__*/React.createElement(Loader, null) : /*#__PURE__*/React.createElement(StatusTable, null, complaintDetails && Object.keys(complaintDetails === null || complaintDetails === void 0 ? void 0 : complaintDetails.details).map(function (k, i, arr) {
    return /*#__PURE__*/React.createElement(Row, {
      key: k,
      label: t(k),
      text: Array.isArray(complaintDetails === null || complaintDetails === void 0 ? void 0 : complaintDetails.details[k]) ? complaintDetails === null || complaintDetails === void 0 ? void 0 : complaintDetails.details[k].map(function (val) {
        return typeof val === "object" ? t(val === null || val === void 0 ? void 0 : val.code) : t(val);
      }) : t(complaintDetails === null || complaintDetails === void 0 ? void 0 : complaintDetails.details[k]) || "N/A",
      last: arr.length - 1 === i
    });
  }),  null ), complaintDetails !== null && complaintDetails !== void 0 && complaintDetails.thumbnails && (complaintDetails === null || complaintDetails === void 0 ? void 0 : (_complaintDetails$thu = complaintDetails.thumbnails) === null || _complaintDetails$thu === void 0 ? void 0 : _complaintDetails$thu.length) !== 0 ? /*#__PURE__*/React.createElement(DisplayPhotos, {
    srcs: complaintDetails === null || complaintDetails === void 0 ? void 0 : complaintDetails.thumbnails,
    onClick: function onClick(source, index) {
      return zoomImage(source, index);
    }
  }) : null, /*#__PURE__*/React.createElement(BreakLine, null), (workflowDetails === null || workflowDetails === void 0 ? void 0 : workflowDetails.isLoading) && /*#__PURE__*/React.createElement(Loader, null), !(workflowDetails !== null && workflowDetails !== void 0 && workflowDetails.isLoading) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CardSubHeader, null, t("CS_COMPLAINT_DETAILS_COMPLAINT_TIMELINE")), workflowDetails !== null && workflowDetails !== void 0 && (_workflowDetails$data3 = workflowDetails.data) !== null && _workflowDetails$data3 !== void 0 && _workflowDetails$data3.timeline && (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data4 = workflowDetails.data) === null || _workflowDetails$data4 === void 0 ? void 0 : (_workflowDetails$data5 = _workflowDetails$data4.timeline) === null || _workflowDetails$data5 === void 0 ? void 0 : _workflowDetails$data5.length) === 1 ? /*#__PURE__*/React.createElement(CheckPoint, {
    isCompleted: true,
    label: t("CS_COMMON_" + (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data6 = workflowDetails.data) === null || _workflowDetails$data6 === void 0 ? void 0 : (_workflowDetails$data7 = _workflowDetails$data6.timeline[0]) === null || _workflowDetails$data7 === void 0 ? void 0 : _workflowDetails$data7.status))
  }) : /*#__PURE__*/React.createElement(ConnectingCheckPoints, null, (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data8 = workflowDetails.data) === null || _workflowDetails$data8 === void 0 ? void 0 : _workflowDetails$data8.timeline) && (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data9 = workflowDetails.data) === null || _workflowDetails$data9 === void 0 ? void 0 : _workflowDetails$data9.timeline.map(function (checkpoint, index, arr) {
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: index
    }, /*#__PURE__*/React.createElement(CheckPoint, {
      keyValue: index,
      isCompleted: index === 0,
      label: t("CS_COMMON_" + checkpoint.status),
      customChild: getTimelineCaptions(checkpoint)
    }));
  }))))), fullscreen ? /*#__PURE__*/React.createElement(PopUp, null, /*#__PURE__*/React.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React.createElement(HeaderBar, {
    main: /*#__PURE__*/React.createElement(Heading, {
      label: "Complaint Geolocation"
    }),
    end: /*#__PURE__*/React.createElement(CloseBtn, {
      onClick: function onClick() {
        return close(fullscreen);
      }
    })
  }), /*#__PURE__*/React.createElement("div", {
    className: "popup-module-main"
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://via.placeholder.com/912x568"
  })))) : null, imageZoom ? /*#__PURE__*/React.createElement(ImageViewer, {
    imageSrc: imageZoom,
    onClose: onCloseImageZoom
  }) : null, popup ? /*#__PURE__*/React.createElement(ComplaintDetailsModal, {
    workflowDetails: workflowDetails,
    complaintDetails: complaintDetails,
    close: close,
    popup: popup,
    selectedAction: selectedAction,
    onAssign: onAssign,
    tenantId: tenantId,
    t: t
  }) : null, toast && /*#__PURE__*/React.createElement(Toast, {
    label: t(assignResponse ? "CS_ACTION_" + selectedAction + "_TEXT" : "CS_ACTION_ASSIGN_FAILED"),
    onClose: closeToast
  }), !(workflowDetails !== null && workflowDetails !== void 0 && workflowDetails.isLoading) && (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data10 = workflowDetails.data) === null || _workflowDetails$data10 === void 0 ? void 0 : (_workflowDetails$data11 = _workflowDetails$data10.nextActions) === null || _workflowDetails$data11 === void 0 ? void 0 : _workflowDetails$data11.length) > 0 && /*#__PURE__*/React.createElement(ActionBar, null, displayMenu && workflowDetails !== null && workflowDetails !== void 0 && (_workflowDetails$data12 = workflowDetails.data) !== null && _workflowDetails$data12 !== void 0 && _workflowDetails$data12.nextActions ? /*#__PURE__*/React.createElement(Menu, {
    options: workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data13 = workflowDetails.data) === null || _workflowDetails$data13 === void 0 ? void 0 : _workflowDetails$data13.nextActions.map(function (action) {
      return action.action;
    }),
    t: t,
    onSelect: onActionSelect
  }) : null, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("WF_TAKE_ACTION"),
    onSubmit: function onSubmit() {
      return setDisplayMenu(!displayMenu);
    }
  })));
};

var FormComposer = function FormComposer(props) {
  var _useForm = useForm(),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      errors = _useForm.errors;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  function onSubmit(data) {
    props.onSubmit(data);
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
        }, errors[field.populators.name] && ((_field$populators = field.populators) !== null && _field$populators !== void 0 && _field$populators.validate ? errors[field.populators.validate] : true) && /*#__PURE__*/React.createElement(CardLabelError, null, field.populators.error), /*#__PURE__*/React.createElement(LabelFieldPair, null, /*#__PURE__*/React.createElement(CardLabel, null, field.label, field.isMandatory ? " * " : null), /*#__PURE__*/React.createElement("div", {
          className: "field"
        }, fieldSelector(field.type, field.populators))));
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
};

var CreateComplaint$1 = function CreateComplaint(_ref) {
  var _getCities$;

  var selectedType = function selectedType(value) {
    try {
      var _temp3 = function () {
        if (value.key !== complaintType.key) {
          var _temp4 = function () {
            if (value.key === "Others") {
              setSubType({
                name: ""
              });
              setComplaintType(value);
              setSubTypeMenu([{
                key: "Others",
                name: t("SERVICEDEFS.OTHERS")
              }]);
            } else {
              setSubType({
                name: ""
              });
              setComplaintType(value);
              return Promise.resolve(serviceDefinitions.getSubMenu(tenantId, value, t)).then(function (_serviceDefinitions$g) {
                setSubTypeMenu(_serviceDefinitions$g);
              });
            }
          }();

          if (_temp4 && _temp4.then) return _temp4.then(function () {});
        }
      }();

      return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var parentUrl = _ref.parentUrl;
  var cities = Digit.Hooks.pgr.useTenants();

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var getCities = function getCities() {
    return (cities === null || cities === void 0 ? void 0 : cities.filter(function (e) {
      return e.code === Digit.ULBService.getCurrentTenantId();
    })) || [];
  };

  var _useState = useState({}),
      complaintType = _useState[0],
      setComplaintType = _useState[1];

  var _useState2 = useState([]),
      subTypeMenu = _useState2[0],
      setSubTypeMenu = _useState2[1];

  var _useState3 = useState({}),
      subType = _useState3[0],
      setSubType = _useState3[1];

  var _useState4 = useState(""),
      pincode = _useState4[0],
      setPincode = _useState4[1];

  var _useState5 = useState(getCities()[0] ? getCities()[0] : null),
      selectedCity = _useState5[0],
      setSelectedCity = _useState5[1];

  var _Digit$Hooks$useBound = Digit.Hooks.useBoundaryLocalities((_getCities$ = getCities()[0]) === null || _getCities$ === void 0 ? void 0 : _getCities$.code, "admin", {
    enabled: !!getCities()[0]
  }, t),
      fetchedLocalities = _Digit$Hooks$useBound.data;

  var _useState6 = useState(fetchedLocalities),
      localities = _useState6[0],
      setLocalities = _useState6[1];

  var _useState7 = useState(null),
      selectedLocality = _useState7[0],
      setSelectedLocality = _useState7[1];

  var _useState8 = useState(false),
      canSubmit = _useState8[0],
      setSubmitValve = _useState8[1];

  var _useState9 = useState(false),
      pincodeNotValid = _useState9[0],
      setPincodeNotValid = _useState9[1];

  var _useState10 = useState({});

  var tenantId = window.Digit.SessionStorage.get("Employee.tenantId");
  var menu = Digit.Hooks.pgr.useComplaintTypes({
    stateCode: tenantId
  });
  var dispatch = useDispatch();
  var match = useRouteMatch();
  var history = useHistory();
  var serviceDefinitions = Digit.GetServiceDefinitions;
  var client = useQueryClient();
  useEffect(function () {
    if (complaintType !== null && complaintType !== void 0 && complaintType.key && subType !== null && subType !== void 0 && subType.key && selectedCity !== null && selectedCity !== void 0 && selectedCity.code && selectedLocality !== null && selectedLocality !== void 0 && selectedLocality.code) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  }, [complaintType, subType, selectedCity, selectedLocality]);
  useEffect(function () {
    setLocalities(fetchedLocalities);
  }, [fetchedLocalities]);
  useEffect(function () {
    var _getCities$2;

    var city = cities.find(function (obj) {
      var _obj$pincode;

      return (_obj$pincode = obj.pincode) === null || _obj$pincode === void 0 ? void 0 : _obj$pincode.find(function (item) {
        return item == pincode;
      });
    });

    if ((city === null || city === void 0 ? void 0 : city.code) === ((_getCities$2 = getCities()[0]) === null || _getCities$2 === void 0 ? void 0 : _getCities$2.code)) {
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

  function selectedSubType(value) {
    setSubType(value);
  }

  var selectCity = function selectCity(city) {
    return Promise.resolve();
  };

  function selectLocality(locality) {
    setSelectedLocality(locality);
  }

  var onSubmit = function onSubmit(data) {
    try {
      if (!canSubmit) return Promise.resolve();
      console.log("submit data", data, subType, selectedCity, selectedLocality);
      var cityCode = selectedCity.code;
      var city = selectedCity.city.name;
      var district = selectedCity.city.name;
      var region = selectedCity.city.name;
      var localityCode = selectedLocality.code;
      var localityName = selectedLocality.name;
      var landmark = data.landmark;
      var key = subType.key;
      var _complaintType = key;
      var mobileNumber = data.mobileNumber;
      var name = data.name;

      var formData = _extends({}, data, {
        cityCode: cityCode,
        city: city,
        district: district,
        region: region,
        localityCode: localityCode,
        localityName: localityName,
        landmark: landmark,
        complaintType: _complaintType,
        mobileNumber: mobileNumber,
        name: name
      });

      return Promise.resolve(dispatch(createComplaint(formData))).then(function () {
        return Promise.resolve(client.refetchQueries(["fetchInboxData"])).then(function () {
          history.push(parentUrl + "/response");
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

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

  var config = [{
    head: t("ES_CREATECOMPLAINT_PROVIDE_COMPLAINANT_DETAILS"),
    body: [{
      label: t("ES_CREATECOMPLAINT_MOBILE_NUMBER"),
      isMandatory: true,
      type: "text",
      populators: {
        name: "mobileNumber",
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
      label: t("ES_CREATECOMPLAINT_COMPLAINT_NAME"),
      isMandatory: true,
      type: "text",
      populators: {
        name: "name",
        validation: {
          required: true,
          pattern: /^[A-Za-z]/
        },
        error: t("CS_ADDCOMPLAINT_NAME_ERROR")
      }
    }]
  }, {
    head: t("CS_COMPLAINT_DETAILS_COMPLAINT_DETAILS"),
    body: [{
      label: t("CS_COMPLAINT_DETAILS_COMPLAINT_TYPE"),
      isMandatory: true,
      type: "dropdown",
      populators: /*#__PURE__*/React.createElement(Dropdown, {
        option: menu,
        optionKey: "name",
        id: "complaintType",
        selected: complaintType,
        select: selectedType
      })
    }, {
      label: t("CS_COMPLAINT_DETAILS_COMPLAINT_SUBTYPE"),
      isMandatory: true,
      type: "dropdown",
      menu: _extends({}, subTypeMenu),
      populators: /*#__PURE__*/React.createElement(Dropdown, {
        option: subTypeMenu,
        optionKey: "name",
        id: "complaintSubType",
        selected: subType,
        select: selectedSubType
      })
    }]
  }, {
    head: t("CS_ADDCOMPLAINT_LOCATION"),
    body: [{
      label: t("CORE_COMMON_PINCODE"),
      type: "text",
      populators: {
        name: "pincode",
        validation: {
          pattern: /^[1-9][0-9]{5}$/,
          validate: isPincodeValid
        },
        error: t("CORE_COMMON_PINCODE_INVALID"),
        onChange: handlePincode
      }
    }, {
      label: t("CS_COMPLAINT_DETAILS_CITY"),
      isMandatory: true,
      type: "dropdown",
      populators: /*#__PURE__*/React.createElement(Dropdown, {
        isMandatory: true,
        selected: selectedCity,
        freeze: true,
        option: getCities(),
        id: "city",
        select: selectCity,
        optionKey: "i18nKey",
        t: t
      })
    }, {
      label: t("CS_CREATECOMPLAINT_MOHALLA"),
      type: "dropdown",
      isMandatory: true,
      dependency: selectedCity && localities ? true : false,
      populators: /*#__PURE__*/React.createElement(Dropdown, {
        isMandatory: true,
        selected: selectedLocality,
        optionKey: "i18nkey",
        id: "locality",
        option: localities,
        select: selectLocality,
        t: t
      })
    }, {
      label: t("CS_COMPLAINT_DETAILS_LANDMARK"),
      type: "textarea",
      populators: {
        name: "landmark"
      }
    }]
  }, {
    head: t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS"),
    body: [{
      label: t("CS_COMPLAINT_DETAILS_ADDITIONAL_DETAILS"),
      type: "textarea",
      populators: {
        name: "description"
      }
    }]
  }];
  return /*#__PURE__*/React.createElement(FormComposer, {
    heading: t("ES_CREATECOMPLAINT_NEW_COMPLAINT"),
    config: config,
    onSubmit: onSubmit,
    isDisabled: !canSubmit,
    label: t("CS_ADDCOMPLAINT_ADDITIONAL_DETAILS_SUBMIT_COMPLAINT")
  });
};

var ComplaintsLink = function ComplaintsLink(_ref) {

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var allLinks = [{
    text: "ES_PGR_NEW_COMPLAINT",
    link: "/digit-ui/employee/pgr/complaint/create",
    accessTo: ["CSR"]
  }];

  var _useState = useState([]),
      links = _useState[0],
      setLinks = _useState[1];

  useEffect(function () {
    var linksToShow = [];
    allLinks.forEach(function (link) {
      if (link.accessTo) {
        if (Digit.UserService.hasAccess(link.accessTo)) {
          linksToShow.push(link);
        }
      } else {
        linksToShow.push(link);
      }
    });
    setLinks(linksToShow);
  }, []);

  var GetLogo = function GetLogo() {
    return /*#__PURE__*/React.createElement("div", {
      className: "header"
    }, /*#__PURE__*/React.createElement("span", {
      className: "logo"
    }, /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      height: "24",
      viewBox: "0 0 24 24",
      width: "24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z",
      fill: "white"
    }))), " ", /*#__PURE__*/React.createElement("span", {
      className: "text"
    }, t("ES_PGR_HEADER_COMPLAINT")));
  };

  return /*#__PURE__*/React.createElement(Card, {
    className: "employeeCard filter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "complaint-links-container"
  }, GetLogo(), /*#__PURE__*/React.createElement("div", {
    className: "body"
  }, links.map(function (_ref2, index) {
    var link = _ref2.link,
        text = _ref2.text;
    return /*#__PURE__*/React.createElement("span", {
      className: "link",
      key: index
    }, /*#__PURE__*/React.createElement(Link, {
      to: link
    }, t(text)));
  }))));
};

var ComplaintTable = function ComplaintTable(_ref) {
  var t = _ref.t,
      columns = _ref.columns,
      data = _ref.data,
      getCellProps = _ref.getCellProps,
      onNextPage = _ref.onNextPage,
      onPrevPage = _ref.onPrevPage,
      currentPage = _ref.currentPage,
      totalRecords = _ref.totalRecords,
      pageSizeLimit = _ref.pageSizeLimit,
      onPageSizeChange = _ref.onPageSizeChange;
  return /*#__PURE__*/React.createElement(Table, {
    t: t,
    data: data,
    columns: columns,
    getCellProps: getCellProps,
    onNextPage: onNextPage,
    onPrevPage: onPrevPage,
    currentPage: currentPage,
    totalRecords: totalRecords,
    onPageSizeChange: onPageSizeChange,
    pageSizeLimit: pageSizeLimit
  });
};

var Status = function Status(_ref) {
  var _pgrfilters$applicati;

  var complaints = _ref.complaints,
      onAssignmentChange = _ref.onAssignmentChange,
      pgrfilters = _ref.pgrfilters;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var complaintsWithCount = Digit.Hooks.pgr.useComplaintStatusCount(complaints);
  var hasFilters = pgrfilters === null || pgrfilters === void 0 ? void 0 : (_pgrfilters$applicati = pgrfilters.applicationStatus) === null || _pgrfilters$applicati === void 0 ? void 0 : _pgrfilters$applicati.length;
  return /*#__PURE__*/React.createElement("div", {
    className: "status-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-label"
  }, t("ES_PGR_FILTER_STATUS")), complaintsWithCount.length === 0 && /*#__PURE__*/React.createElement(Loader, null), complaintsWithCount.map(function (option, index) {
    return /*#__PURE__*/React.createElement(CheckBox, {
      key: index,
      onChange: function onChange(e) {
        return onAssignmentChange(e, option);
      },
      checked: hasFilters ? pgrfilters.applicationStatus.filter(function (e) {
        return e.code === option.code;
      }).length !== 0 ? true : false : false,
      label: option.name + " (" + (option.count || 0) + ")"
    });
  }));
};

var pgrQuery = {};
var wfQuery = {};

var Filter = function Filter(props) {
  var _searchParams$filters, _searchParams$filters2, _searchParams$filters3, _searchParams$filters4, _searchParams$filters5, _searchParams$filters6, _searchParams$filters7;

  var uuid = Digit.UserService.getUser().info.uuid;
  var searchParams = props.searchParams;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var isAssignedToMe = searchParams !== null && searchParams !== void 0 && (_searchParams$filters = searchParams.filters) !== null && _searchParams$filters !== void 0 && (_searchParams$filters2 = _searchParams$filters.wfFilters) !== null && _searchParams$filters2 !== void 0 && _searchParams$filters2.assignee && searchParams !== null && searchParams !== void 0 && (_searchParams$filters3 = searchParams.filters) !== null && _searchParams$filters3 !== void 0 && (_searchParams$filters4 = _searchParams$filters3.wfFilters) !== null && _searchParams$filters4 !== void 0 && (_searchParams$filters5 = _searchParams$filters4.assignee[0]) !== null && _searchParams$filters5 !== void 0 && _searchParams$filters5.code ? true : false;
  var assignedToOptions = useMemo(function () {
    return [{
      code: "ASSIGNED_TO_ME",
      name: t("ASSIGNED_TO_ME")
    }, {
      code: "ASSIGNED_TO_ALL",
      name: t("ASSIGNED_TO_ALL")
    }];
  }, [t]);

  var _useState = useState(isAssignedToMe ? assignedToOptions[0] : assignedToOptions[1]),
      selectAssigned = _useState[0],
      setSelectedAssigned = _useState[1];

  useEffect(function () {
    return setSelectedAssigned(isAssignedToMe ? assignedToOptions[0] : assignedToOptions[1]);
  }, [t]);

  var _useState2 = useState(null),
      selectedComplaintType = _useState2[0],
      setSelectedComplaintType = _useState2[1];

  var _useState3 = useState(null),
      selectedLocality = _useState3[0],
      setSelectedLocality = _useState3[1];

  var _useState4 = useState((searchParams === null || searchParams === void 0 ? void 0 : (_searchParams$filters6 = searchParams.filters) === null || _searchParams$filters6 === void 0 ? void 0 : _searchParams$filters6.pgrfilters) || {
    serviceCode: [],
    locality: [],
    applicationStatus: []
  }),
      pgrfilters = _useState4[0],
      setPgrFilters = _useState4[1];

  var _useState5 = useState((searchParams === null || searchParams === void 0 ? void 0 : (_searchParams$filters7 = searchParams.filters) === null || _searchParams$filters7 === void 0 ? void 0 : _searchParams$filters7.wfFilters) || {
    assignee: [{
      code: uuid
    }]
  }),
      wfFilters = _useState5[0],
      setWfFilters = _useState5[1];

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$Hooks$useBound = Digit.Hooks.useBoundaryLocalities(tenantId, "admin", {}, t),
      localities = _Digit$Hooks$useBound.data;

  var serviceDefs = Digit.Hooks.pgr.useServiceDefs(tenantId, "PGR");

  var onRadioChange = function onRadioChange(value) {
    setSelectedAssigned(value);
    uuid = value.code === "ASSIGNED_TO_ME" ? uuid : "";
    setWfFilters(_extends({}, wfFilters, {
      assignee: [{
        code: uuid
      }]
    }));
  };

  useEffect(function () {
    var _wfFilters$assignee;

    var count = 0;

    for (var property in pgrfilters) {
      if (Array.isArray(pgrfilters[property])) {
        count += pgrfilters[property].length;
        var params = pgrfilters[property].map(function (prop) {
          return prop.code;
        }).join();

        if (params) {
          pgrQuery[property] = params;
        } else {
          var _pgrQuery;

          (_pgrQuery = pgrQuery) === null || _pgrQuery === void 0 ? true : delete _pgrQuery[property];
        }
      }
    }

    for (var _property in wfFilters) {
      if (Array.isArray(wfFilters[_property])) {
        var _params = wfFilters[_property].map(function (prop) {
          return prop.code;
        }).join();

        if (_params) {
          wfQuery[_property] = _params;
        } else {
          wfQuery = {};
        }
      }
    }

    count += (wfFilters === null || wfFilters === void 0 ? void 0 : (_wfFilters$assignee = wfFilters.assignee) === null || _wfFilters$assignee === void 0 ? void 0 : _wfFilters$assignee.length) || 0;

    if (props.type !== "mobile") {
      handleFilterSubmit();
    }

    Digit.inboxFilterCount = count;
  }, [pgrfilters, wfFilters]);

  var ifExists = function ifExists(list, key) {
    return list.filter(function (object) {
      return object.code === key.code;
    }).length;
  };

  function applyFiltersAndClose() {
    handleFilterSubmit();
    props.onClose();
  }

  function complaintType(_type) {
    var type = {
      i18nKey: t("SERVICEDEFS." + _type.serviceCode.toUpperCase()),
      code: _type.serviceCode
    };

    if (!ifExists(pgrfilters.serviceCode, type)) {
      setPgrFilters(_extends({}, pgrfilters, {
        serviceCode: [].concat(pgrfilters.serviceCode, [type])
      }));
    }
  }

  function onSelectLocality(value, type) {
    if (!ifExists(pgrfilters.locality, value)) {
      setPgrFilters(_extends({}, pgrfilters, {
        locality: [].concat(pgrfilters.locality, [value])
      }));
    }
  }

  useEffect(function () {
    if (pgrfilters.serviceCode.length > 1) {
      setSelectedComplaintType({
        i18nKey: pgrfilters.serviceCode.length + " selected"
      });
    } else {
      setSelectedComplaintType(pgrfilters.serviceCode[0]);
    }
  }, [pgrfilters.serviceCode]);
  useEffect(function () {
    if (pgrfilters.locality.length > 1) {
      setSelectedLocality({
        name: pgrfilters.locality.length + " selected"
      });
    } else {
      setSelectedLocality(pgrfilters.locality[0]);
    }
  }, [pgrfilters.locality]);

  var onRemove = function onRemove(index, key) {
    var _extends2;

    var afterRemove = pgrfilters[key].filter(function (value, i) {
      return i !== index;
    });
    setPgrFilters(_extends({}, pgrfilters, (_extends2 = {}, _extends2[key] = afterRemove, _extends2)));
  };

  var handleAssignmentChange = function handleAssignmentChange(e, type) {
    if (e.target.checked) {
      setPgrFilters(_extends({}, pgrfilters, {
        applicationStatus: [].concat(pgrfilters.applicationStatus, [{
          code: type.code
        }])
      }));
    } else {
      var filteredStatus = pgrfilters.applicationStatus.filter(function (value) {
        return value.code !== type.code;
      });
      setPgrFilters(_extends({}, pgrfilters, {
        applicationStatus: filteredStatus
      }));
    }
  };

  function clearAll() {
    var pgrReset = {
      serviceCode: [],
      locality: [],
      applicationStatus: []
    };
    var wfRest = {
      assigned: [{
        code: []
      }]
    };
    setPgrFilters(pgrReset);
    setWfFilters(wfRest);
    pgrQuery = {};
    wfQuery = {};
    setSelectedAssigned("");
    setSelectedComplaintType(null);
    setSelectedLocality(null);
  }

  var handleFilterSubmit = function handleFilterSubmit() {
    props.onFilterChange({
      pgrQuery: pgrQuery,
      wfQuery: wfQuery,
      wfFilters: wfFilters,
      pgrfilters: pgrfilters
    });
  };

  var GetSelectOptions = function GetSelectOptions(lable, options, selected, _select, optionKey, onRemove, key) {
    var _ref;

    if (selected === void 0) {
      selected = null;
    }

    selected = selected || (_ref = {}, _ref[optionKey] = " ", _ref.code = "", _ref);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "filter-label"
    }, lable), /*#__PURE__*/React.createElement(Dropdown, {
      option: options,
      selected: selected,
      select: function select(value) {
        return _select(value, key);
      },
      optionKey: optionKey
    }), /*#__PURE__*/React.createElement("div", {
      className: "tag-container"
    }, pgrfilters[key].length > 0 && pgrfilters[key].map(function (value, index) {
      return /*#__PURE__*/React.createElement(RemoveableTag, {
        key: index,
        text: value[optionKey].slice(0, 22) + " ...",
        onClick: function onClick() {
          return onRemove(index, key);
        }
      });
    })));
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "filter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "heading"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filter-label"
  }, t("ES_COMMON_FILTER_BY"), ":"), /*#__PURE__*/React.createElement("div", {
    className: "clearAll",
    onClick: clearAll
  }, t("ES_COMMON_CLEAR_ALL")), props.type === "desktop" && /*#__PURE__*/React.createElement("span", {
    className: "clear-search",
    onClick: clearAll
  }, t("ES_COMMON_CLEAR_ALL")), props.type === "mobile" && /*#__PURE__*/React.createElement("span", {
    onClick: props.onClose
  }, /*#__PURE__*/React.createElement(CloseSvg, null))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(RadioButtons, {
    onSelect: onRadioChange,
    selectedOption: selectAssigned,
    optionsKey: "name",
    options: assignedToOptions
  }), /*#__PURE__*/React.createElement("div", null, GetSelectOptions(t("CS_COMPLAINT_DETAILS_COMPLAINT_SUBTYPE"), serviceDefs, selectedComplaintType, complaintType, "i18nKey", onRemove, "serviceCode")), /*#__PURE__*/React.createElement("div", null, GetSelectOptions(t("CS_PGR_LOCALITY"), localities, selectedLocality, onSelectLocality, "i18nkey", onRemove, "locality")), /*#__PURE__*/React.createElement(Status, {
    complaints: props.complaints,
    onAssignmentChange: handleAssignmentChange,
    pgrfilters: pgrfilters
  })))), /*#__PURE__*/React.createElement(ActionBar, null, props.type === "mobile" && /*#__PURE__*/React.createElement(ApplyFilterBar, {
    labelLink: t("ES_COMMON_CLEAR_ALL"),
    buttonLink: t("ES_COMMON_FILTER"),
    onClear: clearAll,
    onSubmit: applyFiltersAndClose
  })));
};

var SearchComplaint = function SearchComplaint(_ref) {
  var _searchParams$search, _searchParams$search2;

  var onSearch = _ref.onSearch,
      type = _ref.type,
      onClose = _ref.onClose,
      searchParams = _ref.searchParams;

  var _useState = useState((searchParams === null || searchParams === void 0 ? void 0 : (_searchParams$search = searchParams.search) === null || _searchParams$search === void 0 ? void 0 : _searchParams$search.serviceRequestId) || ""),
      complaintNo = _useState[0],
      setComplaintNo = _useState[1];

  var _useState2 = useState((searchParams === null || searchParams === void 0 ? void 0 : (_searchParams$search2 = searchParams.search) === null || _searchParams$search2 === void 0 ? void 0 : _searchParams$search2.mobileNumber) || ""),
      mobileNo = _useState2[0],
      setMobileNo = _useState2[1];

  var _useForm = useForm(),
      register = _useForm.register,
      errors = _useForm.errors,
      handleSubmit = _useForm.handleSubmit,
      reset = _useForm.reset;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var onSubmitInput = function onSubmitInput(data) {
    if (!Object.keys(errors).filter(function (i) {
      return errors[i];
    }).length) {
      if (data.serviceRequestId !== "") {
        onSearch({
          serviceRequestId: data.serviceRequestId
        });
      } else if (data.mobileNumber !== "") {
        onSearch({
          mobileNumber: data.mobileNumber
        });
      } else {
        onSearch({});
      }

      if (type === "mobile") {
        onClose();
      }
    }
  };

  function clearSearch() {
    reset();
    onSearch({});
    setComplaintNo("");
    setMobileNo("");
  }

  var clearAll = function clearAll() {
    return /*#__PURE__*/React.createElement(LinkLabel, {
      className: "clear-search-label",
      onClick: clearSearch
    }, t("ES_COMMON_CLEAR_SEARCH"));
  };

  function setComplaint(e) {
    setComplaintNo(e.target.value);
  }

  function setMobile(e) {
    setMobileNo(e.target.value);
  }

  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmitInput),
    style: {
      marginLeft: "24px"
    }
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "search-container",
    style: {
      width: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-complaint-container"
  }, type === "mobile" && /*#__PURE__*/React.createElement("div", {
    className: "complaint-header"
  }, /*#__PURE__*/React.createElement("h2", null, " ", t("CS_COMMON_SEARCH_BY"), ":"), /*#__PURE__*/React.createElement("span", {
    onClick: onClose
  }, /*#__PURE__*/React.createElement(CloseSvg, null))), /*#__PURE__*/React.createElement("div", {
    className: "complaint-input-container"
  }, /*#__PURE__*/React.createElement("span", {
    className: "complaint-input"
  }, /*#__PURE__*/React.createElement(Label, null, t("CS_COMMON_COMPLAINT_NO"), "."), /*#__PURE__*/React.createElement(TextInput, {
    name: "serviceRequestId",
    value: complaintNo,
    onChange: setComplaint,
    inputRef: register({
      pattern: /(?!^$)([^\s])/
    }),
    style: {
      marginBottom: "8px"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "mobile-input"
  }, /*#__PURE__*/React.createElement(Label, null, t("CS_COMMON_MOBILE_NO"), "."), /*#__PURE__*/React.createElement(TextInput, {
    name: "mobileNumber",
    value: mobileNo,
    onChange: setMobile,
    inputRef: register({
      pattern: /^[6-9]\d{9}$/
    })
  })), type === "desktop" && /*#__PURE__*/React.createElement(SubmitBar, {
    style: {
      marginTop: 32,
      marginLeft: "16px",
      width: "calc( 100% - 16px )"
    },
    label: t("ES_COMMON_SEARCH"),
    submit: true,
    disabled: Object.keys(errors).filter(function (i) {
      return errors[i];
    }).length
  })), type === "desktop" && /*#__PURE__*/React.createElement("span", {
    className: "clear-search"
  }, clearAll()))), type === "mobile" && /*#__PURE__*/React.createElement(ActionBar, null, /*#__PURE__*/React.createElement(SubmitBar, {
    label: "Search",
    submit: true
  }))));
};

var DesktopInbox = function DesktopInbox(_ref) {
  var _ref7;

  var data = _ref.data,
      onFilterChange = _ref.onFilterChange,
      onSearch = _ref.onSearch,
      isLoading = _ref.isLoading,
      searchParams = _ref.searchParams,
      onNextPage = _ref.onNextPage,
      onPrevPage = _ref.onPrevPage,
      currentPage = _ref.currentPage,
      pageSizeLimit = _ref.pageSizeLimit,
      onPageSizeChange = _ref.onPageSizeChange,
      totalRecords = _ref.totalRecords;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var GetCell = function GetCell(value) {
    return /*#__PURE__*/React.createElement("span", {
      className: "cell-text"
    }, value);
  };

  var GetSlaCell = function GetSlaCell(value) {
    return value < 0 ? /*#__PURE__*/React.createElement("span", {
      className: "sla-cell-error"
    }, value || "") : /*#__PURE__*/React.createElement("span", {
      className: "sla-cell-success"
    }, value || "");
  };

  var columns = React.useMemo(function () {
    return [{
      Header: t("CS_COMMON_COMPLAINT_NO"),
      Cell: function Cell(_ref2) {
        var row = _ref2.row;
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
          className: "link"
        }, /*#__PURE__*/React.createElement(Link, {
          to: "/digit-ui/employee/pgr/complaint/details/" + row.original["serviceRequestId"]
        }, row.original["serviceRequestId"])), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
          className: "complain-no-cell-text"
        }, t("SERVICEDEFS." + row.original["complaintSubType"].toUpperCase())));
      }
    }, {
      Header: t("WF_INBOX_HEADER_LOCALITY"),
      Cell: function Cell(_ref3) {
        var row = _ref3.row;
        return GetCell(t(Digit.Utils.locale.getLocalityCode(row.original["locality"], row.original["tenantId"])));
      }
    }, {
      Header: t("CS_COMPLAINT_DETAILS_CURRENT_STATUS"),
      Cell: function Cell(_ref4) {
        var row = _ref4.row;
        return GetCell(t("CS_COMMON_" + row.original["status"]));
      }
    }, {
      Header: t("WF_INBOX_HEADER_CURRENT_OWNER"),
      Cell: function Cell(_ref5) {
        var row = _ref5.row;
        return GetCell(row.original["taskOwner"]);
      }
    }, {
      Header: t("WF_INBOX_HEADER_SLA_DAYS_REMAINING"),
      Cell: function Cell(_ref6) {
        var row = _ref6.row;
        return GetSlaCell(row.original["sla"]);
      }
    }];
  }, [t]);
  var result;

  if (isLoading) {
    result = /*#__PURE__*/React.createElement(Loader, null);
  } else if (data && data.length === 0) {
    result = /*#__PURE__*/React.createElement(Card, {
      style: {
        marginTop: 20
      }
    }, t(LOCALE.NO_COMPLAINTS_EMPLOYEE).split("\\n").map(function (text, index) {
      return /*#__PURE__*/React.createElement("p", {
        key: index,
        style: {
          textAlign: "center"
        }
      }, text);
    }));
  } else if (data.length > 0) {
    result = /*#__PURE__*/React.createElement(ComplaintTable, {
      t: t,
      data: data,
      columns: columns,
      getCellProps: function getCellProps(cellInfo) {
        return {
          style: {
            minWidth: cellInfo.column.Header === t("CS_COMMON_COMPLAINT_NO") ? "240px" : "",
            padding: "20px 18px",
            fontSize: "16px"
          }
        };
      },
      onNextPage: onNextPage,
      onPrevPage: onPrevPage,
      totalRecords: totalRecords,
      onPageSizeChagne: onPageSizeChange,
      currentPage: currentPage,
      pageSizeLimit: pageSizeLimit
    });
  } else {
    result = /*#__PURE__*/React.createElement(Card, {
      style: {
        marginTop: 20
      }
    }, t(LOCALE.ERROR_LOADING_RESULTS).split("\\n").map(function (text, index) {
      return /*#__PURE__*/React.createElement("p", {
        key: index,
        style: {
          textAlign: "center"
        }
      }, text);
    }));
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "inbox-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filters-container"
  }, /*#__PURE__*/React.createElement(ComplaintsLink, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Filter, {
    complaints: data,
    onFilterChange: onFilterChange,
    type: "desktop",
    searchParams: searchParams
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(SearchComplaint, {
    onSearch: onSearch,
    type: "desktop"
  }), /*#__PURE__*/React.createElement("div", {
    style: (_ref7 = {
      marginTop: "24px"
    }, _ref7["marginTop"] = "24px", _ref7.marginLeft = "24px", _ref7.flex = 1, _ref7)
  }, result)));
};

var ComplaintCard = function ComplaintCard(_ref) {
  var data = _ref.data,
      onFilterChange = _ref.onFilterChange,
      onSearch = _ref.onSearch,
      serviceRequestIdKey = _ref.serviceRequestIdKey,
      searchParams = _ref.searchParams;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _useState = useState(false),
      popup = _useState[0],
      setPopup = _useState[1];

  var _useState2 = useState(null),
      selectedComponent = _useState2[0],
      setSelectedComponent = _useState2[1];

  var _useState3 = useState(Digit.inboxFilterCount || 1),
      filterCount = _useState3[0];

  var handlePopupAction = function handlePopupAction(type) {
    if (type === "SEARCH") {
      setSelectedComponent( /*#__PURE__*/React.createElement(SearchComplaint, {
        type: "mobile",
        onClose: handlePopupClose,
        onSearch: onSearch,
        searchParams: searchParams
      }));
    } else if (type === "FILTER") {
      setSelectedComponent( /*#__PURE__*/React.createElement(Filter, {
        complaints: data,
        onFilterChange: onFilterChange,
        onClose: handlePopupClose,
        type: "mobile",
        searchParams: searchParams
      }));
    }

    setPopup(true);
  };

  var handlePopupClose = function handlePopupClose() {
    setPopup(false);
    setSelectedComponent(null);
  };

  var result;

  if (data && (data === null || data === void 0 ? void 0 : data.length) === 0) {
    result = /*#__PURE__*/React.createElement(Card, {
      style: {
        marginTop: 20
      }
    }, t(LOCALE.NO_COMPLAINTS_EMPLOYEE).split("\\n").map(function (text, index) {
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
      linkPrefix: "/digit-ui/employee/pgr/complaint/details/"
    });
  } else {
    result = /*#__PURE__*/React.createElement(Card, {
      style: {
        marginTop: 20
      }
    }, t(LOCALE.ERROR_LOADING_RESULTS).split("\\n").map(function (text, index) {
      return /*#__PURE__*/React.createElement("p", {
        key: index,
        style: {
          textAlign: "center"
        }
      }, text);
    }));
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "searchBox"
  }, /*#__PURE__*/React.createElement(SearchAction, {
    text: "SEARCH",
    handleActionClick: function handleActionClick() {
      return handlePopupAction("SEARCH");
    }
  }), /*#__PURE__*/React.createElement(FilterAction, {
    filterCount: filterCount,
    text: "FILTER",
    handleActionClick: function handleActionClick() {
      return handlePopupAction("FILTER");
    }
  })), result, popup && /*#__PURE__*/React.createElement(PopUp, null, /*#__PURE__*/React.createElement("div", {
    className: "popup-module"
  }, selectedComponent)));
};

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
    t$1 = b ? Symbol.for("react.lazy") : 60116,
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
              case t$1:
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
var Lazy = t$1;
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
  return z(a) === t$1;
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
  return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === typeof a && null !== a && (a.$$typeof === t$1 || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v);
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

var GetSlaCell = function GetSlaCell(value) {
  return value < 0 ? /*#__PURE__*/React.createElement("span", {
    className: "sla-cell-error"
  }, value) : /*#__PURE__*/React.createElement("span", {
    className: "sla-cell-success"
  }, value);
};

var MobileInbox = function MobileInbox(_ref) {
  var data = _ref.data,
      onFilterChange = _ref.onFilterChange,
      onSearch = _ref.onSearch,
      isLoading = _ref.isLoading,
      searchParams = _ref.searchParams;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var localizedData = data === null || data === void 0 ? void 0 : data.map(function (_ref2) {
    var _ref3;

    var locality = _ref2.locality,
        tenantId = _ref2.tenantId,
        serviceRequestId = _ref2.serviceRequestId,
        complaintSubType = _ref2.complaintSubType,
        sla = _ref2.sla,
        status = _ref2.status,
        taskOwner = _ref2.taskOwner;
    return _ref3 = {}, _ref3[t("CS_COMMON_COMPLAINT_NO")] = serviceRequestId, _ref3[t("CS_ADDCOMPLAINT_COMPLAINT_SUB_TYPE")] = t("SERVICEDEFS." + complaintSubType.toUpperCase()), _ref3[t("WF_INBOX_HEADER_LOCALITY")] = t(Digit.Utils.locale.getLocalityCode(locality, tenantId)), _ref3[t("CS_COMPLAINT_DETAILS_CURRENT_STATUS")] = t("CS_COMMON_" + status), _ref3[t("WF_INBOX_HEADER_CURRENT_OWNER")] = taskOwner, _ref3[t("WF_INBOX_HEADER_SLA_DAYS_REMAINING")] = GetSlaCell(sla), _ref3;
  });
  var result;

  if (isLoading) {
    result = /*#__PURE__*/React.createElement(Loader, null);
  } else {
    result = /*#__PURE__*/React.createElement(ComplaintCard, {
      data: localizedData,
      onFilterChange: onFilterChange,
      serviceRequestIdKey: t("CS_COMMON_COMPLAINT_NO"),
      onSearch: onSearch,
      searchParams: searchParams
    });
  }

  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "inbox-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "filters-container"
  }, /*#__PURE__*/React.createElement(ComplaintsLink, {
    isMobile: true
  }), result)));
};

MobileInbox.propTypes = {
  data: propTypes.any,
  onFilterChange: propTypes.func,
  onSearch: propTypes.func,
  isLoading: propTypes.bool,
  searchParams: propTypes.any
};
MobileInbox.defaultProps = {
  onFilterChange: function onFilterChange() {},
  searchParams: {}
};

var Inbox = function Inbox() {
  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var uuid = Digit.UserService.getUser().info.uuid;

  var _useState = useState(0),
      pageOffset = _useState[0],
      setPageOffset = _useState[1];

  var _useState2 = useState(10),
      pageSize = _useState2[0],
      setPageSize = _useState2[1];

  var _useState3 = useState(0),
      totalRecords = _useState3[0],
      setTotalRecords = _useState3[1];

  var _useState4 = useState({
    filters: {
      wfFilters: {
        assignee: [{
          code: uuid
        }]
      }
    },
    search: "",
    sort: {}
  }),
      searchParams = _useState4[0],
      setSearchParams = _useState4[1];

  useEffect(function () {
    try {
      var _searchParams$filters, _searchParams$filters2, _searchParams$filters3;

      var applicationStatus = searchParams === null || searchParams === void 0 ? void 0 : (_searchParams$filters = searchParams.filters) === null || _searchParams$filters === void 0 ? void 0 : (_searchParams$filters2 = _searchParams$filters.pgrfilters) === null || _searchParams$filters2 === void 0 ? void 0 : (_searchParams$filters3 = _searchParams$filters2.applicationStatus) === null || _searchParams$filters3 === void 0 ? void 0 : _searchParams$filters3.map(function (e) {
        return e.code;
      }).join(",");
      return Promise.resolve(Digit.PGRService.count(tenantId, (applicationStatus === null || applicationStatus === void 0 ? void 0 : applicationStatus.length) > 0 ? {
        applicationStatus: applicationStatus
      } : {})).then(function (response) {
        if (response !== null && response !== void 0 && response.count) {
          setTotalRecords(response.count);
        }
      });
    } catch (e) {
      Promise.reject(e);
    }
  }, [searchParams]);

  var fetchNextPage = function fetchNextPage() {
    setPageOffset(function (prevState) {
      return prevState + 10;
    });
  };

  var fetchPrevPage = function fetchPrevPage() {
    setPageOffset(function (prevState) {
      return prevState - 10;
    });
  };

  var handlePageSizeChange = function handlePageSizeChange(e) {
    setPageSize(Number(e.target.value));
  };

  var handleFilterChange = function handleFilterChange(filterParam) {
    console.log("handleFilterChange", _extends({}, searchParams, {
      filters: filterParam
    }));
    setSearchParams(_extends({}, searchParams, {
      filters: filterParam
    }));
  };

  var onSearch = function onSearch(params) {
    if (params === void 0) {
      params = "";
    }

    setSearchParams(_extends({}, searchParams, {
      search: params
    }));
  };

  var _Digit$Hooks$pgr$useI = Digit.Hooks.pgr.useInboxData(_extends({}, searchParams, {
    offset: pageOffset,
    limit: pageSize
  })),
      complaints = _Digit$Hooks$pgr$useI.data,
      isLoading = _Digit$Hooks$pgr$useI.isLoading;

  var isMobile = Digit.Utils.browser.isMobile();

  if ((complaints === null || complaints === void 0 ? void 0 : complaints.length) !== null) {
    if (isMobile) {
      return /*#__PURE__*/React.createElement(MobileInbox, {
        data: complaints,
        isLoading: isLoading,
        onFilterChange: handleFilterChange,
        onSearch: onSearch,
        searchParams: searchParams
      });
    } else {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, null, t("ES_COMMON_INBOX")), /*#__PURE__*/React.createElement(DesktopInbox, {
        data: complaints,
        isLoading: isLoading,
        onFilterChange: handleFilterChange,
        onSearch: onSearch,
        searchParams: searchParams,
        onNextPage: fetchNextPage,
        onPrevPage: fetchPrevPage,
        onPageSizeChange: handlePageSizeChange,
        currentPage: Math.floor(pageOffset / pageSize),
        totalRecords: totalRecords,
        pageSizeLimit: pageSize
      }));
    }
  } else {
    return /*#__PURE__*/React.createElement(Loader, null);
  }
};

var GetActionMessage$2 = function GetActionMessage(_ref) {
  var action = _ref.action;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  if (action === "REOPEN") {
    return t("CS_COMMON_COMPLAINT_REOPENED");
  } else {
    return t("CS_COMMON_COMPLAINT_SUBMITTED");
  }
};

var BannerPicker$2 = function BannerPicker(_ref2) {
  var response = _ref2.response;
  var complaints = response.complaints;

  if (complaints && complaints.response && complaints.response.responseInfo) {
    return /*#__PURE__*/React.createElement(Banner, {
      message: GetActionMessage$2(complaints.response.ServiceWrappers[0].workflow),
      complaintNumber: complaints.response.ServiceWrappers[0].service.serviceRequestId,
      successful: true
    });
  } else {
    return /*#__PURE__*/React.createElement(Banner, {
      message: t("CS_COMMON_COMPLAINT_NOT_SUBMITTED"),
      successful: false
    });
  }
};

var Response$2 = function Response(props) {
  var _useTranslation2 = useTranslation(),
      t = _useTranslation2.t;

  var _useRouteMatch = useRouteMatch();

  var appState = useSelector(function (state) {
    return state;
  })["pgr"];
  return /*#__PURE__*/React.createElement(Card, null, appState.complaints.response && /*#__PURE__*/React.createElement(BannerPicker$2, {
    response: appState
  }), /*#__PURE__*/React.createElement(CardText, null, t("ES_COMMON_TRACK_COMPLAINT_TEXT")), /*#__PURE__*/React.createElement(Link, {
    to: "/digit-ui/employee"
  }, /*#__PURE__*/React.createElement(SubmitBar, {
    label: t("CORE_COMMON_GO_TO_HOME")
  })));
};

var Complaint$1 = function Complaint() {
  var _useState = useState(false);

  var _useState2 = useState(false);

  var match = useRouteMatch();

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var breadcrumConfig = {
    home: {
      content: t("CS_COMMON_HOME"),
      path: Employee.Home
    },
    inbox: {
      content: t("CS_COMMON_INBOX"),
      path: match.url + Employee.Inbox
    },
    createComplaint: {
      content: t("CS_PGR_CREATE_COMPLAINT"),
      path: match.url + Employee.CreateComplaint
    },
    complaintDetails: {
      content: t("CS_PGR_COMPLAINT_DETAILS"),
      path: match.url + Employee.ComplaintDetails + ":id"
    },
    response: {
      content: t("CS_PGR_RESPONSE"),
      path: match.url + Employee.Response
    }
  };

  var location = useLocation().pathname;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ground-container"
  }, !location.includes(Employee.Response) && /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: match.url + Employee.CreateComplaint,
    component: function component() {
      return /*#__PURE__*/React.createElement(BreadCrumb, {
        crumbs: [breadcrumConfig.home, breadcrumConfig.createComplaint]
      });
    }
  }), /*#__PURE__*/React.createElement(Route, {
    path: match.url + Employee.ComplaintDetails + ":id",
    component: function component() {
      return /*#__PURE__*/React.createElement(BreadCrumb, {
        crumbs: [breadcrumConfig.home, breadcrumConfig.inbox, breadcrumConfig.complaintDetails]
      });
    }
  }), /*#__PURE__*/React.createElement(Route, {
    path: match.url + Employee.Inbox,
    component: function component() {
      return /*#__PURE__*/React.createElement(BreadCrumb, {
        crumbs: [breadcrumConfig.home, breadcrumConfig.inbox]
      });
    }
  }), /*#__PURE__*/React.createElement(Route, {
    path: match.url + Employee.Response,
    component: /*#__PURE__*/React.createElement(BreadCrumb, {
      crumbs: [breadcrumConfig.home, breadcrumConfig.response]
    })
  })), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: match.url + Employee.CreateComplaint,
    component: function component() {
      return /*#__PURE__*/React.createElement(CreateComplaint$1, {
        parentUrl: match.url
      });
    }
  }), /*#__PURE__*/React.createElement(Route, {
    path: match.url + Employee.ComplaintDetails + ":id*",
    component: function component() {
      return /*#__PURE__*/React.createElement(ComplaintDetails, null);
    }
  }), /*#__PURE__*/React.createElement(Route, {
    path: match.url + Employee.Inbox,
    component: Inbox
  }), /*#__PURE__*/React.createElement(Route, {
    path: match.url + Employee.Response,
    component: Response$2
  }))));
};

var App$1 = function App() {
  return /*#__PURE__*/React.createElement(EmployeeAppContainer, null, /*#__PURE__*/React.createElement(Complaint$1, null));
};

var PGRReducers = getRootReducer;

var PGRModule = function PGRModule(_ref) {
  var stateCode = _ref.stateCode,
      userType = _ref.userType,
      tenants = _ref.tenants;
  var moduleCode = "PGR";
  var language = Digit.StoreData.getCurrentLanguage();

  var _Digit$Services$useSt = Digit.Services.useStore({
    stateCode: stateCode,
    moduleCode: moduleCode,
    language: language
  }),
      isLoading = _Digit$Services$useSt.isLoading;

  if (isLoading) {
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  Digit.SessionStorage.set("PGR_TENANTS", tenants);

  if (userType === "citizen") {
    return /*#__PURE__*/React.createElement(App, null);
  } else {
    return /*#__PURE__*/React.createElement(App$1, null);
  }
};

var PGRLinks = function PGRLinks(_ref2) {
  var matchPath = _ref2.matchPath;

  var _useTranslation = useTranslation(),
      t = _useTranslation.t;

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage(PGR_CITIZEN_CREATE_COMPLAINT, {}),
      clearParams = _Digit$Hooks$useSessi[2];

  useEffect(function () {
    clearParams();
  }, []);
  var links = [{
    link: matchPath + "/create-complaint/complaint-type",
    i18nKey: t("CS_COMMON_FILE_A_COMPLAINT")
  }, {
    link: matchPath + "/complaints",
    i18nKey: t(LOCALE.MY_COMPLAINTS)
  }];
  return /*#__PURE__*/React.createElement(CitizenHomeCard, {
    header: t("CS_COMMON_HOME_COMPLAINTS"),
    links: links,
    Icon: ComplaintIcon
  });
};

var componentsToRegister = {
  PGRModule: PGRModule,
  PGRLinks: PGRLinks,
  PGRCard: PGRCard
};
var initPGRComponents = function initPGRComponents() {
  Object.entries(componentsToRegister).forEach(function (_ref3) {
    var key = _ref3[0],
        value = _ref3[1];
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

export { PGRReducers, initPGRComponents };
//# sourceMappingURL=index.modern.js.map
