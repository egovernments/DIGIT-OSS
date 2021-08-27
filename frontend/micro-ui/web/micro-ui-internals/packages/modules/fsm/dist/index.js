function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var digitUiReactComponents = require('@egovernments/digit-ui-react-components');
var React = require('react');
var React__default = _interopDefault(React);
var reactI18next = require('react-i18next');
var reactRouterDom = require('react-router-dom');
var reactHookForm = require('react-hook-form');
var reactQuery = require('react-query');
require('react-table');
var TimePicker = _interopDefault(require('react-time-picker'));

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

var FSMCard = function FSMCard() {
  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  var COLLECTOR = Digit.UserService.hasAccess("FSM_COLLECTOR") || false;
  var FSM_ADMIN = Digit.UserService.hasAccess("FSM_ADMIN") || false;
  var FSM_EDITOR = Digit.UserService.hasAccess("FSM_EDITOR_EMP") || false;
  var FSM_CREATOR = Digit.UserService.hasAccess("FSM_CREATOR_EMP") || false;
  var isFSTPOperator = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;

  var _useState = React.useState("-"),
      total = _useState[0],
      setTotal = _useState[1];

  var tenantId = Digit.ULBService.getCurrentTenantId();

  if (!Digit.Utils.fsmAccess()) {
    return null;
  }

  var config = {
    enabled: isFSTPOperator ? true : false,
    select: function select(data) {
      var _data$vehicleTrip$red;

      var info = data.vehicleTrip.reduce(function (info, trip) {
        var totalVol = trip.tripDetails.reduce(function (vol, details) {
          return details.volume + vol;
        }, 0);
        info[t("ES_READY_FOR_DISPOSAL")] += totalVol / 1000;
        return info;
      }, (_data$vehicleTrip$red = {}, _data$vehicleTrip$red[t("ES_READY_FOR_DISPOSAL")] = 0, _data$vehicleTrip$red));
      info[t("ES_READY_FOR_DISPOSAL")] = "(" + info[t("ES_READY_FOR_DISPOSAL")] + " KL)";
      return info;
    }
  };

  var _Digit$Hooks$fsm$useV = Digit.Hooks.fsm.useVehicleSearch({
    tenantId: tenantId,
    filters: {
      applicationStatus: "WAITING_FOR_DISPOSAL"
    },
    config: config
  }),
      info = _Digit$Hooks$fsm$useV.data,
      isSuccess = _Digit$Hooks$fsm$useV.isSuccess;

  var filters = {
    sortBy: "createdTime",
    sortOrder: "DESC",
    total: true
  };

  var getUUIDFilter = function getUUIDFilter() {
    if (FSM_EDITOR || FSM_CREATOR || COLLECTOR || FSM_ADMIN) return {
      uuid: {
        code: "ASSIGNED_TO_ALL",
        name: t("ES_INBOX_ASSIGNED_TO_ALL")
      }
    };else return {
      uuid: {
        code: "ASSIGNED_TO_ME",
        name: t("ES_INBOX_ASSIGNED_TO_ME")
      }
    };
  };

  var _Digit$Hooks$fsm$useI = Digit.Hooks.fsm.useInbox(tenantId, _extends({}, filters, {
    limit: 10,
    offset: 0
  }, getUUIDFilter()), {
    enabled: !isFSTPOperator ? true : false
  }),
      inbox = _Digit$Hooks$fsm$useI.data;

  React.useEffect(function () {
    if (inbox) {
      var _total = (inbox === null || inbox === void 0 ? void 0 : inbox.totalCount) || 0;

      setTotal(_total);
    }
  }, [inbox]);
  var propsForFSTPO = {
    Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.ShippingTruck, null),
    moduleName: t("ES_TITLE_VEHICLE_LOG"),
    kpis: isSuccess ? Object.keys(info).map(function (key, index) {
      return {
        label: t(key),
        count: t(info[key]),
        link: "/digit-ui/employee/fsm/fstp-inbox"
      };
    }) : [],
    links: [{
      label: t("ES_COMMON_INBOX"),
      link: "/digit-ui/employee/fsm/fstp-inbox"
    }]
  };

  if (isFSTPOperator && isSuccess) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.EmployeeModuleCard, propsForFSTPO);
  }

  var linksForSomeFSMEmployees = !DSO && !COLLECTOR && !FSM_EDITOR ? [{
    label: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
    link: "/digit-ui/employee/fsm/new-application"
  }] : [];
  var propsForModuleCard = {
    Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.ShippingTruck, null),
    moduleName: t("ES_TITLE_FAECAL_SLUDGE_MGMT"),
    kpis: [{
      count: total,
      label: t("TOTAL_FSM"),
      link: "/digit-ui/employee/fsm/inbox"
    }, {
      label: t("TOTAL_NEARING_SLA"),
      link: "/digit-ui/employee/fsm/inbox"
    }],
    links: [{
      count: total,
      label: t("ES_COMMON_INBOX"),
      link: "/digit-ui/employee/fsm/inbox"
    }].concat(linksForSomeFSMEmployees)
  };
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.EmployeeModuleCard, propsForModuleCard);
};

var CheckSlum = function CheckSlum(_ref) {
  var _formData$address, _formData$address2, _formData$address2$lo;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId === null || tenantId === void 0 ? void 0 : tenantId.split(".")[0];

  var _useState = React.useState(formData === null || formData === void 0 ? void 0 : (_formData$address = formData.address) === null || _formData$address === void 0 ? void 0 : _formData$address.slumArea),
      slumArea = _useState[0],
      setSlumArea = _useState[1];

  var locality = formData === null || formData === void 0 ? void 0 : (_formData$address2 = formData.address) === null || _formData$address2 === void 0 ? void 0 : (_formData$address2$lo = _formData$address2.locality) === null || _formData$address2$lo === void 0 ? void 0 : _formData$address2$lo.code.split("_")[3];

  var onSkip = function onSkip() {
    return onSelect();
  };

  function goNext() {
    onSelect(config.key, {
      slumArea: slumArea
    });
  }

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    t: t,
    config: config,
    onSelect: goNext,
    onSkip: onSkip,
    isDisabled: !slumArea
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioOrSelect, {
    isMandatory: config.isMandatory,
    options: [{
      code: true,
      i18nKey: "CS_COMMON_YES"
    }, {
      code: false,
      i18nKey: "CS_COMMON_NO"
    }],
    selectedOption: slumArea,
    optionKey: "i18nKey",
    onSelect: setSlumArea
  }));
};

var SelectAddress = function SelectAddress(_ref) {
  var _formData$address5;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      userType = _ref.userType,
      formData = _ref.formData;
  var allCities = Digit.Hooks.fsm.useTenants();
  var tenantId = Digit.ULBService.getCurrentTenantId();

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

  var _useState = React.useState(function () {
    var _formData$address;

    return (formData === null || formData === void 0 ? void 0 : (_formData$address = formData.address) === null || _formData$address === void 0 ? void 0 : _formData$address.city) || Digit.SessionStorage.get("fsm.file.address.city") || null;
  }),
      selectedCity = _useState[0],
      setSelectedCity = _useState[1];

  var _Digit$Hooks$useBound = Digit.Hooks.useBoundaryLocalities(selectedCity === null || selectedCity === void 0 ? void 0 : selectedCity.code, "revenue", {
    enabled: !!selectedCity
  }, t),
      fetchedLocalities = _Digit$Hooks$useBound.data;

  var _useState2 = React.useState(),
      localities = _useState2[0],
      setLocalities = _useState2[1];

  var _useState3 = React.useState(),
      selectedLocality = _useState3[0],
      setSelectedLocality = _useState3[1];

  React.useEffect(function () {
    if (cities) {
      if (cities.length === 1) {
        setSelectedCity(cities[0]);
      }
    }
  }, [cities]);
  React.useEffect(function () {
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

      if (userType === "employee") {
        onSelect(config.key, _extends({}, formData[config.key], {
          city: selectedCity
        }));
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
    Digit.SessionStorage.set("fsm.file.address.city", city);
    setSelectedCity(city);
  }

  function selectLocality(locality) {
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

  if (userType === "employee") {
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      className: "card-label-smaller"
    }, t("MYCITY_CODE_LABEL"), config.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
      className: "form-field",
      isMandatory: true,
      selected: (cities === null || cities === void 0 ? void 0 : cities.length) === 1 ? cities[0] : selectedCity,
      disable: (cities === null || cities === void 0 ? void 0 : cities.length) === 1,
      option: cities,
      select: selectCity,
      optionKey: "code",
      t: t
    })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      className: "card-label-smaller"
    }, t("CS_CREATECOMPLAINT_MOHALLA"), config.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
      className: "form-field",
      isMandatory: true,
      selected: selectedLocality,
      option: localities,
      select: selectLocality,
      optionKey: "i18nkey",
      t: t
    })));
  }

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    config: config,
    onSelect: onSubmit,
    t: t,
    isDisabled: selectedLocality ? false : true
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, t("MYCITY_CODE_LABEL") + " *"), /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioOrSelect, {
    options: cities,
    selectedOption: selectedCity,
    optionKey: "i18nKey",
    onSelect: selectCity,
    t: t
  }), selectedCity && localities && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, t("CS_CREATECOMPLAINT_MOHALLA") + " *"), selectedCity && localities && /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioOrSelect, {
    isMandatory: config.isMandatory,
    options: localities,
    selectedOption: selectedLocality,
    optionKey: "i18nkey",
    onSelect: selectLocality,
    t: t
  }));
};

var SelectChannel = function SelectChannel(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData;
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useLocation = reactRouterDom.useLocation(),
      url = _useLocation.pathname;

  var editScreen = url.includes("/modify-application/");

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(tenantId, "FSM", "EmployeeApplicationChannel"),
      channelMenu = _Digit$Hooks$fsm$useM.data;

  var _useState = React.useState(formData === null || formData === void 0 ? void 0 : formData.channel),
      channel = _useState[0],
      setChannel = _useState[1];

  function selectChannel(value) {
    setChannel(value);
    onSelect(config.key, value);
  }

  return channelMenu ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    option: channelMenu,
    optionKey: "i18nKey",
    id: "channel",
    selected: channel,
    select: selectChannel,
    t: t,
    disable: editScreen,
    autoFocus: !editScreen
  }) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
};

var SelectGeolocation = function SelectGeolocation(_ref) {
  var _formData$address, _formData$address2;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData;

  var _useState = React.useState((formData === null || formData === void 0 ? void 0 : (_formData$address = formData.address) === null || _formData$address === void 0 ? void 0 : _formData$address.pincode) || ""),
      pincode = _useState[0],
      setPincode = _useState[1];

  var _useState2 = React.useState((formData === null || formData === void 0 ? void 0 : (_formData$address2 = formData.address) === null || _formData$address2 === void 0 ? void 0 : _formData$address2.geoLocation) || {}),
      geoLocation = _useState2[0],
      setGeoLocation = _useState2[1];

  var tenants = Digit.Hooks.fsm.useTenants();

  var _useState3 = React.useState(null),
      pincodeServicability = _useState3[0],
      setPincodeServicability = _useState3[1];

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
      setPincodeServicability("CS_COMMON_PINCODE_NOT_SERVICABLE");
      setPincode("");
      setGeoLocation({});
    } else {
      setPincode(code);
      setGeoLocation(location);
    }
  };

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.LocationSearchCard, {
    header: t("CS_ADDCOMPLAINT_SELECT_GEOLOCATION_HEADER"),
    cardText: t("CS_ADDCOMPLAINT_SELECT_GEOLOCATION_TEXT"),
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
    disabled: pincode === "",
    forcedError: t(pincodeServicability)
  });
};

var SelectLandmark = function SelectLandmark(_ref) {
  var _formData$address2;

  var t = _ref.t,
      config = _ref.config,
      _onSelect = _ref.onSelect,
      formData = _ref.formData,
      userType = _ref.userType;

  var _useState = React.useState(),
      landmark = _useState[0],
      setLandmark = _useState[1];

  var _useState2 = React.useState(""),
      error = _useState2[0],
      setError = _useState2[1];

  var inputs = [{
    label: "ES_NEW_APPLICATION_LOCATION_LANDMARK",
    type: "textarea",
    name: "landmark",
    validation: {
      maxLength: 1024
    }
  }];
  React.useEffect(function () {
    var _formData$address;

    setLandmark(formData === null || formData === void 0 ? void 0 : (_formData$address = formData.address) === null || _formData$address === void 0 ? void 0 : _formData$address.landmark);
  }, [formData === null || formData === void 0 ? void 0 : (_formData$address2 = formData.address) === null || _formData$address2 === void 0 ? void 0 : _formData$address2.landmark]);

  function onChange(e) {
    if (e.target.value.length > 1024) {
      setError("CS_COMMON_LANDMARK_MAX_LENGTH");
    } else {
      setError(null);
      setLandmark(e.target.value);

      if (userType === "employee") {

        _onSelect(config.key, _extends({}, formData[config.key], {
          landmark: e.target.value
        }));
      }
    }
  }

  if (userType === "employee") {
    return inputs === null || inputs === void 0 ? void 0 : inputs.map(function (input, index) {
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, {
        key: index
      }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
        className: "card-label-smaller"
      }, t(input.label), config.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextArea, _extends({
        className: "form-field",
        id: input.name,
        value: landmark,
        onChange: onChange,
        name: input.name || ""
      }, input.validation)));
    });
  }

  var onSkip = function onSkip() {
    return _onSelect();
  };

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    config: _extends({}, config, {
      inputs: inputs
    }),
    value: landmark,
    onChange: onChange,
    onSelect: function onSelect(data) {
      return _onSelect(config.key, _extends({}, formData[config.key], data));
    },
    onSkip: onSkip,
    t: t,
    forcedError: t(error)
  });
};

var SelectName = function SelectName(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData,
      errors = _ref.errors;

  var _useLocation = reactRouterDom.useLocation(),
      url = _useLocation.pathname;

  var editScreen = url.includes("/modify-application/");
  var inputs = [{
    label: "ES_NEW_APPLICATION_APPLICANT_NAME",
    type: "text",
    name: "applicantName",
    validation: {
      isRequired: true,
      pattern: "^[a-zA-Z]+( [a-zA-Z]+)*$",
      title: t("CORE_COMMON_APPLICANT_NAME_INVALID")
    },
    isMandatory: true
  }, {
    label: "ES_NEW_APPLICATION_APPLICANT_MOBILE_NO",
    type: "text",
    name: "mobileNumber",
    validation: {
      isRequired: true,
      pattern: "[6-9]{1}[0-9]{9}",
      type: "tel",
      title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID")
    },
    isMandatory: true
  }];

  function setValue(value, input) {
    var _extends2;

    onSelect(config.key, _extends({}, formData[config.key], (_extends2 = {}, _extends2[input] = value, _extends2)));
    console.log("find value here", value, input, formData);
  }

  return /*#__PURE__*/React__default.createElement("div", null, inputs === null || inputs === void 0 ? void 0 : inputs.map(function (input, index) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, errors[input.name] && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t(input.error)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      className: "card-label-smaller"
    }, t(input.label), input.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
      key: input.name,
      value: formData && formData[config.key] ? formData[config.key][input.name] : null,
      onChange: function onChange(e) {
        return setValue(e.target.value, input.name);
      },
      disable: editScreen
    }, input.validation)))));
  }));
};

var SelectPincode = function SelectPincode(_ref) {
  var _formData$address3;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData,
      userType = _ref.userType;
  var tenants = Digit.Hooks.fsm.useTenants();

  var _useState = React.useState(function () {
    var _formData$address;

    return (formData === null || formData === void 0 ? void 0 : (_formData$address = formData.address) === null || _formData$address === void 0 ? void 0 : _formData$address.pincode) || "";
  }),
      pincode = _useState[0],
      setPincode = _useState[1];

  var _useLocation = reactRouterDom.useLocation(),
      pathname = _useLocation.pathname;

  var presentInModifyApplication = pathname.includes("modify");
  var inputs = [{
    label: "CORE_COMMON_PINCODE",
    type: "text",
    name: "pincode",
    validation: {
      minlength: 6,
      maxlength: 6,
      pattern: "^[1-9][0-9]*",
      max: "9999999",
      title: t("CORE_COMMON_PINCODE_INVALID")
    }
  }];

  var _useState2 = React.useState(null),
      pincodeServicability = _useState2[0],
      setPincodeServicability = _useState2[1];

  React.useEffect(function () {
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
        setPincodeServicability("CS_COMMON_PINCODE_NOT_SERVICABLE");
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
        setPincodeServicability("CS_COMMON_PINCODE_NOT_SERVICABLE");
      }

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  if (userType === "employee") {
    return inputs === null || inputs === void 0 ? void 0 : inputs.map(function (input, index) {
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, {
        key: index
      }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
        className: "card-label-smaller"
      }, t(input.label), config.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
        className: "field"
      }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
        key: input.name,
        value: pincode,
        onChange: onChange
      }, input.validation, {
        autoFocus: presentInModifyApplication
      }))));
    });
  }

  var onSkip = function onSkip() {
    return onSelect();
  };

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
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
    isDisabled: !pincode
  });
};

var SelectPitType = function SelectPitType(_ref) {
  var t = _ref.t,
      formData = _ref.formData,
      config = _ref.config,
      onSelect = _ref.onSelect,
      userType = _ref.userType;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState = React.useState(formData === null || formData === void 0 ? void 0 : formData.pitType),
      pitType = _useState[0],
      setPitType = _useState[1];

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PitType"),
      sanitationMenu = _Digit$Hooks$fsm$useM.data,
      isLoading = _Digit$Hooks$fsm$useM.isLoading;

  var selectPitType = function selectPitType(value) {
    setPitType(value);

    if (userType === "employee") {
      onSelect(config.key, value);
      onSelect("pitDetail", null);
    }
  };

  var onSkip = function onSkip() {
    onSelect();
  };

  var onSubmit = function onSubmit() {
    onSelect(config.key, pitType);
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  if (userType === "employee") {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
      isMandatory: true,
      option: sanitationMenu,
      optionKey: "i18nKey",
      select: selectPitType,
      selected: pitType,
      t: t
    });
  }

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    config: config,
    onSelect: onSubmit,
    onSkip: onSkip,
    isDisabled: !pitType,
    t: t
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, t("CS_FILE_APPLICATION_PIT_TYPE_LABEL")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioOrSelect, {
    isMandatory: config.isMandatory,
    options: sanitationMenu,
    selectedOption: pitType,
    optionKey: "i18nKey",
    onSelect: selectPitType,
    t: t
  }));
};

var SelectPropertySubtype = function SelectPropertySubtype(_ref) {
  var config = _ref.config,
      onSelect = _ref.onSelect,
      t = _ref.t,
      userType = _ref.userType,
      formData = _ref.formData;

  var select = function select(items) {
    return items.map(function (item) {
      return _extends({}, item, {
        i18nKey: t(item.i18nKey)
      });
    });
  };

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PropertySubtype", {
    select: select
  }),
      propertySubtypesDataLoading = _Digit$Hooks$fsm$useM.isLoading,
      propertySubtypesData = _Digit$Hooks$fsm$useM.data;

  var _useState = React.useState(),
      subtype = _useState[0],
      setSubtype = _useState[1];

  var _useState2 = React.useState([]),
      subtypeOptions = _useState2[0],
      setSubtypeOptions = _useState2[1];

  var _ref2 = formData || {},
      propertyType = _ref2.propertyType;

  React.useEffect(function () {
    if (!propertySubtypesDataLoading && propertySubtypesData) {
      var preFillSubtype = propertySubtypesData === null || propertySubtypesData === void 0 ? void 0 : propertySubtypesData.filter(function (subType) {
        var _formData$subtype;

        return subType.code === ((formData === null || formData === void 0 ? void 0 : (_formData$subtype = formData.subtype) === null || _formData$subtype === void 0 ? void 0 : _formData$subtype.code) || (formData === null || formData === void 0 ? void 0 : formData.subtype));
      })[0];

      if (typeof propertyType === "string" && (preFillSubtype === null || preFillSubtype === void 0 ? void 0 : preFillSubtype.code.split(".")[0]) === propertyType || (preFillSubtype === null || preFillSubtype === void 0 ? void 0 : preFillSubtype.code.split(".")[0]) === (propertyType === null || propertyType === void 0 ? void 0 : propertyType.code)) {
        setSubtype(preFillSubtype);
      } else {
        setSubtype(null);
      }
    }
  }, [propertyType, formData === null || formData === void 0 ? void 0 : formData.subtype, propertySubtypesData]);
  React.useEffect(function () {
    if (!propertySubtypesDataLoading && propertyType) {
      var subTypes = propertySubtypesData.filter(function (item) {
        return item.propertyType === ((propertyType === null || propertyType === void 0 ? void 0 : propertyType.code) || propertyType);
      });
      setSubtypeOptions(subTypes);
    }
  }, [propertyType, propertySubtypesDataLoading, propertySubtypesData]);

  var selectedValue = function selectedValue(value) {
    setSubtype(value);
  };

  var goNext = function goNext() {
    onSelect(config.key, subtype);
  };

  function selectedSubType(value) {
    onSelect(config.key, value.code);
  }

  if (propertySubtypesDataLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  if (userType === "employee") {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
      option: subtypeOptions,
      optionKey: "i18nKey",
      id: "propertySubType",
      selected: subtype,
      select: selectedSubType,
      t: t
    });
  } else {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
      config: config,
      onSelect: goNext,
      isDisabled: !subtype,
      t: t
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, t("CS_FILE_APPLICATION_PROPERTY_SUBTYPE_LABEL") + " *"), /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioOrSelect, {
      options: subtypeOptions,
      selectedOption: subtype,
      optionKey: "i18nKey",
      onSelect: selectedValue,
      t: t
    }));
  }
};

var SelectPropertyType = function SelectPropertyType(_ref) {
  var config = _ref.config,
      onSelect = _ref.onSelect,
      t = _ref.t,
      userType = _ref.userType,
      formData = _ref.formData;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var select = function select(items) {
    return items.map(function (item) {
      return _extends({}, item, {
        i18nKey: t(item.i18nKey)
      });
    });
  };

  var propertyTypesData = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PropertyType", {
    select: select
  });

  var _useState = React.useState(),
      propertyType = _useState[0],
      setPropertyType = _useState[1];

  React.useEffect(function () {
    if (!propertyTypesData.isLoading && propertyTypesData.data) {
      var preFilledPropertyType = propertyTypesData.data.filter(function (propertyType) {
        var _formData$propertyTyp;

        return propertyType.code === ((formData === null || formData === void 0 ? void 0 : (_formData$propertyTyp = formData.propertyType) === null || _formData$propertyTyp === void 0 ? void 0 : _formData$propertyTyp.code) || (formData === null || formData === void 0 ? void 0 : formData.propertyType));
      })[0];
      setPropertyType(preFilledPropertyType);
    }
  }, [formData === null || formData === void 0 ? void 0 : formData.propertyType, propertyTypesData.data]);

  var goNext = function goNext() {
    onSelect(config.key, propertyType);
  };

  function selectedValue(value) {
    setPropertyType(value);
  }

  function selectedType(value) {
    onSelect(config.key, value.code);
  }

  if (propertyTypesData.isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  if (userType === "employee") {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
      option: propertyTypesData.data,
      optionKey: "i18nKey",
      id: "propertyType",
      selected: propertyType,
      select: selectedType,
      t: t
    });
  } else {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
      config: config,
      onSelect: goNext,
      isDisabled: !propertyType,
      t: t
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, null, t("CS_FILE_APPLICATION_PROPERTY_LABEL") + " *"), /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioOrSelect, {
      options: propertyTypesData.data,
      selectedOption: propertyType,
      optionKey: "i18nKey",
      onSelect: selectedValue,
      t: t
    })), propertyType && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CitizenInfoLabel, {
      info: t("CS_FILE_APPLICATION_INFO_LABEL"),
      text: t("CS_FILE_APPLICATION_INFO_TEXT", propertyType)
    }));
  }
};

var SelectSlumName = function SelectSlumName(_ref) {
  var _formData$address, _formData$address2, _formData$address4, _formData$address6, _formData$address9, _formData$address9$lo;

  var config = _ref.config,
      onSelect = _ref.onSelect,
      t = _ref.t,
      userType = _ref.userType,
      formData = _ref.formData;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _useState = React.useState(),
      slum = _useState[0],
      setSlum = _useState[1];

  var slumTenantId = formData !== null && formData !== void 0 && (_formData$address = formData.address) !== null && _formData$address !== void 0 && _formData$address.city ? formData === null || formData === void 0 ? void 0 : (_formData$address2 = formData.address) === null || _formData$address2 === void 0 ? void 0 : _formData$address2.city.code : tenantId;

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(slumTenantId, "FSM", "Slum"),
      slumData = _Digit$Hooks$fsm$useM.data,
      slumDataLoading = _Digit$Hooks$fsm$useM.isLoading;

  var _useState2 = React.useState(),
      slumMenu = _useState2[0],
      setSlumMenu = _useState2[1];

  React.useEffect(function () {
    var _formData$address3, _formData$address3$sl;

    if (userType !== "employee" && (formData === null || formData === void 0 ? void 0 : (_formData$address3 = formData.address) === null || _formData$address3 === void 0 ? void 0 : (_formData$address3$sl = _formData$address3.slumArea) === null || _formData$address3$sl === void 0 ? void 0 : _formData$address3$sl.code) === false) onSelect(config.key, {}, true);
  }, [formData === null || formData === void 0 ? void 0 : (_formData$address4 = formData.address) === null || _formData$address4 === void 0 ? void 0 : _formData$address4.slumArea]);
  React.useEffect(function () {
    if (slumMenu && formData !== null && formData !== void 0 && formData.address) {
      var preSelectedSlum = slumMenu.filter(function (slum) {
        var _formData$address5;

        return slum.code === (formData === null || formData === void 0 ? void 0 : (_formData$address5 = formData.address) === null || _formData$address5 === void 0 ? void 0 : _formData$address5.slum);
      })[0];
      setSlum(preSelectedSlum);
    }
  }, [formData === null || formData === void 0 ? void 0 : (_formData$address6 = formData.address) === null || _formData$address6 === void 0 ? void 0 : _formData$address6.slum, slumMenu]);
  React.useEffect(function () {
    var _formData$address7, _formData$address7$lo;

    var locality = formData === null || formData === void 0 ? void 0 : (_formData$address7 = formData.address) === null || _formData$address7 === void 0 ? void 0 : (_formData$address7$lo = _formData$address7.locality) === null || _formData$address7$lo === void 0 ? void 0 : _formData$address7$lo.code;

    if (userType === "employee" && !slumDataLoading && slumData) {
      var _formData$address8;

      var optionalSlumData = slumData[locality] ? [{
        code: null,
        active: true,
        name: "Not residing in slum area",
        i18nKey: "ES_APPLICATION_NOT_SLUM_AREA"
      }].concat(slumData[locality]) : [{
        code: null,
        active: true,
        name: "Not residing in slum area",
        i18nKey: "ES_APPLICATION_NOT_SLUM_AREA"
      }].concat(Object.keys(slumData).map(function (key) {
        return slumData[key];
      }).reduce(function (prev, curr) {
        return [].concat(prev, curr);
      }));
      setSlumMenu(optionalSlumData);

      if (!(formData !== null && formData !== void 0 && (_formData$address8 = formData.address) !== null && _formData$address8 !== void 0 && _formData$address8.slum)) {
        setSlum({
          code: null,
          active: true,
          name: "Not residing in slum area",
          i18nKey: "ES_APPLICATION_NOT_SLUM_AREA"
        });
        onSelect(config.key, _extends({}, formData[config.key], {
          slum: null
        }));
      }
    }

    if (userType !== "employee" && !slumDataLoading && slumData) {
      var allSlum = Object.keys(slumData).map(function (key) {
        return slumData[key];
      }).reduce(function (prev, curr) {
        return [].concat(prev, curr);
      });
      slumData[locality] ? setSlumMenu(slumData[locality]) : setSlumMenu(allSlum);
    }
  }, [slumDataLoading, formData === null || formData === void 0 ? void 0 : (_formData$address9 = formData.address) === null || _formData$address9 === void 0 ? void 0 : (_formData$address9$lo = _formData$address9.locality) === null || _formData$address9$lo === void 0 ? void 0 : _formData$address9$lo.code]);

  function selectSlum(value) {
    setSlum(value);
    onSelect(config.key, _extends({}, formData[config.key], {
      slum: value.code
    }));
  }

  function onSkip() {
    onSelect();
  }

  function goNext() {
    onSelect(config.key, _extends({}, formData[config.key], {
      slum: slum.code,
      slumData: slum
    }));
  }

  if (slumDataLoading) return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  return userType === "employee" ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "card-label-smaller"
  }, t("ES_NEW_APPLICATION_SLUM_NAME")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    t: t,
    option: slumMenu,
    className: "form-field",
    optionKey: "i18nKey",
    id: "slum",
    selected: slum,
    select: selectSlum
  })) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    t: t,
    config: config,
    onSelect: goNext,
    onSkip: onSkip
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    t: t,
    option: slumMenu,
    optionKey: "i18nKey",
    id: "i18nKey",
    selected: slum,
    select: setSlum
  }));
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

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

var SelectStreet = function SelectStreet(_ref) {
  var t = _ref.t,
      config = _ref.config,
      _onSelect = _ref.onSelect,
      userType = _ref.userType,
      formData = _ref.formData,
      formState = _ref.formState,
      setError = _ref.setError,
      clearErrors = _ref.clearErrors;

  var onSkip = function onSkip() {
    return _onSelect();
  };

  var _useState = React.useState({
    index: -1,
    type: ""
  }),
      focusIndex = _useState[0],
      setFocusIndex = _useState[1];

  var _useForm = reactHookForm.useForm(),
      control = _useForm.control,
      localFormState = _useForm.formState,
      watch = _useForm.watch,
      trigger = _useForm.trigger;

  var formValue = watch();
  var errors = localFormState.errors;
  var checkLocation = window.location.href.includes("tl/new-application") || window.location.href.includes("tl/renew-application-details");
  var isRenewal = window.location.href.includes("edit-application") || window.location.href.includes("tl/renew-application-details");
  var inputs;

  if (window.location.href.includes("tl")) {
    inputs = config.inputs;
    config.inputs[0].disable = window.location.href.includes("edit-application");
    config.inputs[1].disable = window.location.href.includes("edit-application");
  } else {
    inputs = [{
      label: "PT_PROPERTY_ADDRESS_STREET_NAME",
      type: "text",
      name: "street",
      validation: {
        pattern: "[a-zA-Z0-9 ]{1,255}",
        title: t("CORE_COMMON_STREET_INVALID")
      }
    }, {
      label: "PT_PROPERTY_ADDRESS_HOUSE_NO",
      type: "text",
      name: "doorNo",
      validation: {
        pattern: "[A-Za-z0-9#,/ -]{1,63}",
        title: t("CORE_COMMON_DOOR_INVALID")
      }
    }];
  }

  var convertValidationToRules = function convertValidationToRules(_ref2) {
    var validation = _ref2.validation,
        name = _ref2.name,
        messages = _ref2.messages;

    if (validation) {
      var _ref3 = validation || {},
          valPattern = _ref3.pattern,
          maxlength = _ref3.maxlength,
          minlength = _ref3.minlength,
          valReq = _ref3.required;

      var pattern = function pattern(value) {
        if (valPattern) {
          var _RegExp;

          if (valPattern instanceof RegExp) return valPattern.test(value) ? true : (messages === null || messages === void 0 ? void 0 : messages.pattern) || name.toUpperCase() + "_PATTERN";else if (typeof valPattern === "string") return (_RegExp = new RegExp(valPattern)) !== null && _RegExp !== void 0 && _RegExp.test(value) ? true : (messages === null || messages === void 0 ? void 0 : messages.pattern) || name.toUpperCase() + "_PATTERN";
        }

        return true;
      };

      var maxLength = function maxLength(value) {
        return maxlength ? (value === null || value === void 0 ? void 0 : value.length) <= maxlength ? true : (messages === null || messages === void 0 ? void 0 : messages.maxlength) || name.toUpperCase() + "_MAXLENGTH" : true;
      };

      var minLength = function minLength(value) {
        return minlength ? (value === null || value === void 0 ? void 0 : value.length) >= minlength ? true : (messages === null || messages === void 0 ? void 0 : messages.minlength) || name.toUpperCase() + "_MINLENGTH" : true;
      };

      var required = function required(value) {
        return valReq ? !!value ? true : (messages === null || messages === void 0 ? void 0 : messages.required) || name.toUpperCase() + "_REQUIRED" : true;
      };

      return {
        pattern: pattern,
        required: required,
        minLength: minLength,
        maxLength: maxLength
      };
    }

    return {};
  };

  React.useEffect(function () {
    trigger();
  }, []);
  React.useEffect(function () {
    if (userType === "employee") {
      var _formState$errors$con;

      if (Object.keys(errors).length && !lodash.isEqual(((_formState$errors$con = formState.errors[config.key]) === null || _formState$errors$con === void 0 ? void 0 : _formState$errors$con.type) || {}, errors)) setError(config.key, {
        type: errors
      });else if (!Object.keys(errors).length && formState.errors[config.key]) clearErrors(config.key);
    }
  }, [errors]);
  React.useEffect(function () {
    var keys = Object.keys(formValue);
    var part = {};
    keys.forEach(function (key) {
      var _formData$config$key;

      return part[key] = (_formData$config$key = formData[config.key]) === null || _formData$config$key === void 0 ? void 0 : _formData$config$key[key];
    });

    if (!lodash.isEqual(formValue, part)) {
      _onSelect(config.key, _extends({}, formData[config.key], formValue));

      trigger();
    }
  }, [formValue]);

  if (userType === "employee") {
    var _inputs;

    return (_inputs = inputs) === null || _inputs === void 0 ? void 0 : _inputs.map(function (input, index) {
      var _formData$address;

      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, {
        key: index
      }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
        className: "card-label-smaller"
      }, !checkLocation ? t(input.label) : t(input.label) + ":", config.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
        className: "field"
      }, /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
        control: control,
        defaultValue: formData === null || formData === void 0 ? void 0 : (_formData$address = formData.address) === null || _formData$address === void 0 ? void 0 : _formData$address[input.name],
        name: input.name,
        rules: {
          validate: convertValidationToRules(input)
        },
        render: function render(_props) {
          return /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
            id: input.name,
            key: input.name,
            value: _props.value,
            onChange: function onChange(e) {
              setFocusIndex({
                index: index
              });

              _props.onChange(e.target.value);
            },
            onBlur: _props.onBlur,
            autoFocus: (focusIndex === null || focusIndex === void 0 ? void 0 : focusIndex.index) == index
          }, input.validation));
        }
      })));
    });
  }

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    config: _extends({}, config, {
      inputs: inputs
    }),
    _defaultValues: {
      street: formData === null || formData === void 0 ? void 0 : formData.address.street,
      doorNo: formData === null || formData === void 0 ? void 0 : formData.address.doorNo
    },
    onSelect: function onSelect(data) {
      return _onSelect(config.key, data);
    },
    onSkip: onSkip,
    t: t
  });
};

var isConventionalSpecticTank = function isConventionalSpecticTank(tankDimension) {
  return tankDimension === "lbd";
};

var SelectTankSize = function SelectTankSize(_ref) {
  var _formData$pitType;

  var config = _ref.config,
      onSelect = _ref.onSelect,
      t = _ref.t,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData,
      userType = _ref.userType;
  var tankDimension = formData === null || formData === void 0 ? void 0 : (_formData$pitType = formData.pitType) === null || _formData$pitType === void 0 ? void 0 : _formData$pitType.dimension;

  var _useState = React.useState(true),
      disable = _useState[0],
      setDisable = _useState[1];

  var _useState2 = React.useState(),
      size = _useState2[0],
      setSize = _useState2[1];

  React.useEffect(function () {
    if (!(formData !== null && formData !== void 0 && formData.pitType) && userType !== "employee") {
      onSelect(config.key, {}, true);
    }
  }, []);
  React.useEffect(function () {
    if (isConventionalSpecticTank(tankDimension)) {
      var _formData$pitDetail;

      setSize(_extends({}, formData === null || formData === void 0 ? void 0 : formData.pitDetail, {
        diameter: 0
      }, (formData === null || formData === void 0 ? void 0 : (_formData$pitDetail = formData.pitDetail) === null || _formData$pitDetail === void 0 ? void 0 : _formData$pitDetail.length) === 0 && {
        height: 0
      }));
    } else {
      var _formData$pitDetail2;

      setSize(_extends({}, formData === null || formData === void 0 ? void 0 : formData.pitDetail, {
        length: 0,
        width: 0
      }, (formData === null || formData === void 0 ? void 0 : (_formData$pitDetail2 = formData.pitDetail) === null || _formData$pitDetail2 === void 0 ? void 0 : _formData$pitDetail2.diameter) === 0 && {
        height: 0
      }));
    }
  }, [tankDimension]);
  React.useEffect(function () {
    var pitDetailValues = size ? Object.values(size).filter(function (value) {
      return value > 0;
    }) : null;

    if (isConventionalSpecticTank(tankDimension) && (pitDetailValues === null || pitDetailValues === void 0 ? void 0 : pitDetailValues.length) >= 3) {
      setDisable(false);
    } else if (!isConventionalSpecticTank(tankDimension) && (pitDetailValues === null || pitDetailValues === void 0 ? void 0 : pitDetailValues.length) >= 2) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [size]);

  var handleChange = function handleChange(event) {
    var _event$target = event.target,
        name = _event$target.name,
        value = _event$target.value;

    if (!isNaN(value)) {
      setSize(function (prev) {
        var _extends2;

        return _extends({}, prev, (_extends2 = {}, _extends2[name] = value, _extends2));
      });

      if (userType === "employee") {
        var _extends3;

        setTimeout(onSelect(config.key, _extends({}, size, (_extends3 = {}, _extends3[name] = value, _extends3))));
      }
    }
  };

  var handleSubmit = function handleSubmit() {
    onSelect(config.key, size);
  };

  var onSkip = function onSkip() {
    return onSelect();
  };

  if (userType === "employee") {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.PitDimension, {
      sanitationType: formData.pitType,
      size: size,
      handleChange: handleChange,
      t: t,
      disable: !(formData !== null && formData !== void 0 && formData.pitType)
    });
  }

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    config: config,
    onSkip: onSkip,
    onSelect: handleSubmit,
    isDisabled: disable,
    t: t
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.PitDimension, {
    sanitationType: formData.pitType,
    size: size,
    handleChange: handleChange,
    t: t
  }));
};

var getPropertyTypeLocale = function getPropertyTypeLocale(value) {
  return "PROPERTYTYPE_MASTERS_" + (value === null || value === void 0 ? void 0 : value.split(".")[0]);
};
var getPropertySubtypeLocale = function getPropertySubtypeLocale(value) {
  return "PROPERTYTYPE_MASTERS_" + value;
};
var getVehicleType = function getVehicleType(vehicle, t) {
  return (vehicle === null || vehicle === void 0 ? void 0 : vehicle.i18nKey) && (vehicle === null || vehicle === void 0 ? void 0 : vehicle.capacity) && t(vehicle.i18nKey) + " - " + vehicle.capacity + " " + t("CS_COMMON_CAPACITY_LTRS") || null;
};

var SelectTripData = function SelectTripData(_ref) {
  var _formData$tripData, _formData$tripData2, _formData$tripData3, _formData$tripData4, _formData$tripData9, _formData$tripData9$v;

  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var state = (tenantId === null || tenantId === void 0 ? void 0 : tenantId.split(".")[0]) || "pb";

  var _useState = React.useState(formData === null || formData === void 0 ? void 0 : (_formData$tripData = formData.tripData) === null || _formData$tripData === void 0 ? void 0 : _formData$tripData.vehicleType),
      vehicle = _useState[0],
      setVehicle = _useState[1];

  var _useState2 = React.useState(false),
      billError = _useState2[0],
      setError = _useState2[1];

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(state, "Vehicle", "VehicleType", {
    staleTime: Infinity
  }),
      isVehicleMenuLoading = _Digit$Hooks$fsm$useM.isLoading,
      vehicleData = _Digit$Hooks$fsm$useM.data;

  var _Digit$Hooks$fsm$useD = Digit.Hooks.fsm.useDsoSearch(tenantId),
      dsoData = _Digit$Hooks$fsm$useD.data,
      isDsoLoading = _Digit$Hooks$fsm$useD.isLoading;

  var _useState3 = React.useState([]),
      vehicleMenu = _useState3[0],
      setVehicleMenu = _useState3[1];

  React.useEffect(function () {
    if (dsoData && vehicleData) {
      var allVehicles = dsoData.reduce(function (acc, curr) {
        return curr.vehicles ? [].concat(acc, curr.vehicles.map(function (dsoVehicle) {
          return dsoVehicle.type;
        })) : acc;
      }, []);

      var __vehicleMenu = allVehicles.map(function (vehicle) {
        return vehicleData.filter(function (data) {
          return data.code === vehicle;
        })[0];
      }).filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      }).filter(function (i) {
        return i;
      });

      setVehicleMenu(__vehicleMenu);
    }
  }, [dsoData, vehicleData]);
  var inputs = [{
    label: "ES_NEW_APPLICATION_PAYMENT_NO_OF_TRIPS",
    type: "text",
    name: "noOfTrips",
    error: t("ES_NEW_APPLICATION_NO_OF_TRIPS_INVALID"),
    validation: {
      isRequired: true
    },
    default: formData === null || formData === void 0 ? void 0 : (_formData$tripData2 = formData.tripData) === null || _formData$tripData2 === void 0 ? void 0 : _formData$tripData2.noOfTrips,
    disable: true,
    isMandatory: true
  }, {
    label: "ES_NEW_APPLICATION_AMOUNT_PER_TRIP",
    type: "text",
    name: "amountPerTrip",
    error: t("ES_NEW_APPLICATION_AMOUNT_INVALID"),
    validation: {
      isRequired: true,
      pattern: "[0-9]{1,10}",
      title: t("ES_APPLICATION_BILL_SLAB_ERROR")
    },
    default: formData === null || formData === void 0 ? void 0 : (_formData$tripData3 = formData.tripData) === null || _formData$tripData3 === void 0 ? void 0 : _formData$tripData3.amountPerTrip,
    disable: true,
    isMandatory: true
  }, {
    label: "ES_PAYMENT_DETAILS_TOTAL_AMOUNT",
    type: "text",
    name: "amount",
    validation: {
      isRequired: true,
      title: t("ES_APPLICATION_BILL_SLAB_ERROR")
    },
    default: formData === null || formData === void 0 ? void 0 : (_formData$tripData4 = formData.tripData) === null || _formData$tripData4 === void 0 ? void 0 : _formData$tripData4.amount,
    disable: true,
    isMandatory: true
  }];

  function selectVehicle(value) {
    setVehicle(value);
    onSelect(config.key, _extends({}, formData[config.key], {
      vehicleType: value
    }));
    console.log("find value here", value, formData);
  }

  function setValue(object) {
    onSelect(config.key, _extends({}, formData[config.key], object));
  }

  React.useEffect(function () {
    (function () {
      try {
        var _formData$tripData5;

        if ((formData === null || formData === void 0 ? void 0 : (_formData$tripData5 = formData.tripData) === null || _formData$tripData5 === void 0 ? void 0 : _formData$tripData5.vehicleType) !== vehicle) {
          var _formData$tripData6;

          setVehicle(formData === null || formData === void 0 ? void 0 : (_formData$tripData6 = formData.tripData) === null || _formData$tripData6 === void 0 ? void 0 : _formData$tripData6.vehicleType);
        }

        var _temp2 = function () {
          var _formData$tripData7, _formData$tripData7$v;

          if (formData !== null && formData !== void 0 && formData.propertyType && formData !== null && formData !== void 0 && formData.subtype && formData !== null && formData !== void 0 && formData.address && formData !== null && formData !== void 0 && (_formData$tripData7 = formData.tripData) !== null && _formData$tripData7 !== void 0 && (_formData$tripData7$v = _formData$tripData7.vehicleType) !== null && _formData$tripData7$v !== void 0 && _formData$tripData7$v.code) {
            var _formData$tripData8;

            var _formData$tripData$ve = formData === null || formData === void 0 ? void 0 : (_formData$tripData8 = formData.tripData) === null || _formData$tripData8 === void 0 ? void 0 : _formData$tripData8.vehicleType,
                capacity = _formData$tripData$ve.capacity;

            var slumDetails = formData.address.slum;
            var slum = slumDetails ? "YES" : "NO";
            return Promise.resolve(Digit.FSMService.billingSlabSearch(tenantId, {
              propertyType: formData === null || formData === void 0 ? void 0 : formData.subtype,
              capacity: capacity,
              slum: slum
            })).then(function (billingDetails) {
              var _billingDetails$billi;

              var billSlab = (billingDetails === null || billingDetails === void 0 ? void 0 : (_billingDetails$billi = billingDetails.billingSlab) === null || _billingDetails$billi === void 0 ? void 0 : _billingDetails$billi.length) && (billingDetails === null || billingDetails === void 0 ? void 0 : billingDetails.billingSlab[0]);

              if (billSlab !== null && billSlab !== void 0 && billSlab.price) {
                console.log("find bill slab here", billSlab.price);
                setValue({
                  amountPerTrip: billSlab.price,
                  amount: billSlab.price * formData.tripData.noOfTrips
                });
                setError(false);
              } else {
                setValue({
                  amountPerTrip: "",
                  amount: ""
                });
                setError(true);
              }
            });
          }
        }();

        return _temp2 && _temp2.then ? _temp2.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [formData === null || formData === void 0 ? void 0 : formData.propertyType, formData === null || formData === void 0 ? void 0 : formData.subtype, formData === null || formData === void 0 ? void 0 : formData.address, formData === null || formData === void 0 ? void 0 : (_formData$tripData9 = formData.tripData) === null || _formData$tripData9 === void 0 ? void 0 : (_formData$tripData9$v = _formData$tripData9.vehicleType) === null || _formData$tripData9$v === void 0 ? void 0 : _formData$tripData9$v.code]);
  return isVehicleMenuLoading && isDsoLoading ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null) : /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "card-label-smaller"
  }, t("ES_NEW_APPLICATION_LOCATION_VEHICLE_REQUESTED") + " * "), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    className: "form-field",
    isMandatory: true,
    option: vehicleMenu === null || vehicleMenu === void 0 ? void 0 : vehicleMenu.map(function (vehicle) {
      return _extends({}, vehicle, {
        label: getVehicleType(vehicle, t)
      });
    }),
    optionKey: "label",
    id: "vehicle",
    selected: vehicle,
    select: selectVehicle,
    t: t
  })), inputs === null || inputs === void 0 ? void 0 : inputs.map(function (input, index) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, {
      key: index
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      className: "card-label-smaller"
    }, t(input.label), input.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
      key: input.name,
      value: input.default ? input.default : formData && formData[config.key] ? formData[config.key][input.name] : null
    }, input.validation, {
      disable: input.disable
    }))));
  }), billError ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, {
    style: {
      width: "100%",
      textAlign: "center"
    }
  }, t("ES_APPLICATION_BILL_SLAB_ERROR")) : null);
};

var getSlumName = function getSlumName(application, t) {
  var _application$slum, _application$slum2;

  if (application !== null && application !== void 0 && application.slumName) {
    return t(application.slumName);
  }

  return application !== null && application !== void 0 && (_application$slum = application.slum) !== null && _application$slum !== void 0 && _application$slum.i18nKey ? t("" + (application === null || application === void 0 ? void 0 : (_application$slum2 = application.slum) === null || _application$slum2 === void 0 ? void 0 : _application$slum2.i18nKey)) : "N/A";
};

var getApplicationVehicleType = function getApplicationVehicleType(application, t) {
  if (application !== null && application !== void 0 && application.vehicleMake && application !== null && application !== void 0 && application.vehicleCapacity) {
    return getVehicleType({
      i18nKey: application === null || application === void 0 ? void 0 : application.vehicleMake,
      capacity: application === null || application === void 0 ? void 0 : application.vehicleCapacity
    }, t);
  }

  return application !== null && application !== void 0 && application.pdfVehicleType ? application === null || application === void 0 ? void 0 : application.pdfVehicleType : "N/A";
};

var getAmountPerTrip = function getAmountPerTrip(amountPerTrip) {
  if (!amountPerTrip) return "N/A";
  return amountPerTrip !== 0 ? "\u20B9 " + amountPerTrip : "N/A";
};

var getTotalAmount = function getTotalAmount(totalAmount) {
  if (!totalAmount) return "N/A";
  return totalAmount !== 0 ? "\u20B9 " + totalAmount : "N/A";
};

var getPDFData = function getPDFData(application, tenantInfo, t) {
  var _JSON$parse, _tenantInfo$city, _application$auditDet, _application$citizen, _application$citizen2, _application$address, _application$address2, _application$tenantId, _application$address3, _application$address4, _application$address5, _application$address6, _application$address7, _application$pitDetai, _application$pitDetai2, _application$pitDetai3, _application$pitDetai4, _application$pitDetai5, _application$pitDetai6, _application$pitDetai7, _application$pitDetai8;

  var address = application.address,
      additionalDetails = application.additionalDetails;
  var amountPerTrip = (application === null || application === void 0 ? void 0 : application.amountPerTrip) || (additionalDetails === null || additionalDetails === void 0 ? void 0 : additionalDetails.tripAmount) || ((_JSON$parse = JSON.parse(address === null || address === void 0 ? void 0 : address.additionalDetails)) === null || _JSON$parse === void 0 ? void 0 : _JSON$parse.tripAmount);
  var totalAmount = (application === null || application === void 0 ? void 0 : application.totalAmount) || amountPerTrip * (application === null || application === void 0 ? void 0 : application.noOfTrips);
  return {
    t: t,
    tenantId: tenantInfo === null || tenantInfo === void 0 ? void 0 : tenantInfo.code,
    name: t(tenantInfo === null || tenantInfo === void 0 ? void 0 : tenantInfo.i18nKey) + " " + t("ULBGRADE_" + (tenantInfo === null || tenantInfo === void 0 ? void 0 : (_tenantInfo$city = tenantInfo.city) === null || _tenantInfo$city === void 0 ? void 0 : _tenantInfo$city.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_"))),
    email: tenantInfo === null || tenantInfo === void 0 ? void 0 : tenantInfo.emailId,
    phoneNumber: tenantInfo === null || tenantInfo === void 0 ? void 0 : tenantInfo.contactNumber,
    heading: t("PDF_HEADER_DESLUDGING_REQUEST_ACKNOWLEDGEMENT"),
    details: [{
      title: t("CS_TITLE_APPLICATION_DETAILS"),
      values: [{
        title: t("CS_MY_APPLICATION_APPLICATION_NO"),
        value: application === null || application === void 0 ? void 0 : application.applicationNo
      }, {
        title: t("CS_APPLICATION_DETAILS_APPLICATION_DATE"),
        value: Digit.DateUtils.ConvertTimestampToDate(application === null || application === void 0 ? void 0 : (_application$auditDet = application.auditDetails) === null || _application$auditDet === void 0 ? void 0 : _application$auditDet.createdTime, "dd/MM/yyyy")
      }, {
        title: t("CS_APPLICATION_DETAILS_APPLICATION_CHANNEL"),
        value: t("ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_" + (application === null || application === void 0 ? void 0 : application.source)) || "N/A"
      }]
    }, {
      title: t("CS_APPLICATION_DETAILS_APPLICANT_DETAILS"),
      values: [{
        title: t("CS_APPLICATION_DETAILS_APPLICANT_NAME"),
        value: (application === null || application === void 0 ? void 0 : (_application$citizen = application.citizen) === null || _application$citizen === void 0 ? void 0 : _application$citizen.name) || "N/A"
      }, {
        title: t("CS_APPLICATION_DETAILS_APPLICANT_MOBILE"),
        value: (application === null || application === void 0 ? void 0 : (_application$citizen2 = application.citizen) === null || _application$citizen2 === void 0 ? void 0 : _application$citizen2.mobileNumber) || "N/A"
      }]
    }, {
      title: t("CS_APPLICATION_DETAILS_PROPERTY_DETAILS"),
      values: [{
        title: t("CS_APPLICATION_DETAILS_PROPERTY_TYPE"),
        value: t(getPropertyTypeLocale(application === null || application === void 0 ? void 0 : application.propertyUsage)) || "N/A"
      }, {
        title: t("CS_APPLICATION_DETAILS_PROPERTY_SUB_TYPE"),
        value: t(getPropertySubtypeLocale(application === null || application === void 0 ? void 0 : application.propertyUsage)) || "N/A"
      }]
    }, {
      title: t("CS_APPLICATION_DETAILS_PROPERTY_LOCATION_DETAILS"),
      values: [{
        title: t("CS_APPLICATION_DETAILS_PINCODE"),
        value: (application === null || application === void 0 ? void 0 : (_application$address = application.address) === null || _application$address === void 0 ? void 0 : _application$address.pincode) || "N/A"
      }, {
        title: t("CS_APPLICATION_DETAILS_CITY"),
        value: (application === null || application === void 0 ? void 0 : (_application$address2 = application.address) === null || _application$address2 === void 0 ? void 0 : _application$address2.city) || "N/A"
      }, {
        title: t("CS_APPLICATION_DETAILS_MOHALLA"),
        value: t((application === null || application === void 0 ? void 0 : (_application$tenantId = application.tenantId) === null || _application$tenantId === void 0 ? void 0 : _application$tenantId.toUpperCase().split(".").join("_")) + "_REVENUE_" + (application === null || application === void 0 ? void 0 : (_application$address3 = application.address) === null || _application$address3 === void 0 ? void 0 : (_application$address4 = _application$address3.locality) === null || _application$address4 === void 0 ? void 0 : _application$address4.code)) || "N/A"
      }, {
        title: t("CS_APPLICATION_DETAILS_SLUM_NAME"),
        value: getSlumName(application, t)
      }, {
        title: t("CS_APPLICATION_DETAILS_STREET"),
        value: (application === null || application === void 0 ? void 0 : (_application$address5 = application.address) === null || _application$address5 === void 0 ? void 0 : _application$address5.street) || "N/A"
      }, {
        title: t("CS_APPLICATION_DETAILS_DOOR_NO"),
        value: (application === null || application === void 0 ? void 0 : (_application$address6 = application.address) === null || _application$address6 === void 0 ? void 0 : _application$address6.doorNo) || "N/A"
      }, {
        title: t("CS_APPLICATION_DETAILS_LANDMARK"),
        value: (application === null || application === void 0 ? void 0 : (_application$address7 = application.address) === null || _application$address7 === void 0 ? void 0 : _application$address7.landmark) || "N/A"
      }]
    }, {
      title: t("CS_APPLICATION_DETAILS_PIT_DETAILS"),
      values: [{
        title: t("CS_APPLICATION_DETAILS_PIT_TYPE"),
        value: application !== null && application !== void 0 && application.sanitationtype ? t("PITTYPE_MASTERS_" + (application === null || application === void 0 ? void 0 : application.sanitationtype)) : "N/A"
      }, {
        title: t("CS_APPLICATION_DETAILS_DIMENSION"),
        value: application !== null && application !== void 0 && (_application$pitDetai = application.pitDetail) !== null && _application$pitDetai !== void 0 && _application$pitDetai.height && (application === null || application === void 0 ? void 0 : (_application$pitDetai2 = application.pitDetail) === null || _application$pitDetai2 === void 0 ? void 0 : _application$pitDetai2.height) !== null ? application !== null && application !== void 0 && (_application$pitDetai3 = application.pitDetail) !== null && _application$pitDetai3 !== void 0 && _application$pitDetai3.length ? (application === null || application === void 0 ? void 0 : (_application$pitDetai4 = application.pitDetail) === null || _application$pitDetai4 === void 0 ? void 0 : _application$pitDetai4.length) + "m * " + (application === null || application === void 0 ? void 0 : (_application$pitDetai5 = application.pitDetail) === null || _application$pitDetai5 === void 0 ? void 0 : _application$pitDetai5.width) + "m * " + (application === null || application === void 0 ? void 0 : (_application$pitDetai6 = application.pitDetail) === null || _application$pitDetai6 === void 0 ? void 0 : _application$pitDetai6.height) + "m                                  (" + t("CS_COMMON_LENGTH") + " x " + t("CS_COMMON_BREADTH") + " x " + t("CS_COMMON_DEPTH") + ")" : (application === null || application === void 0 ? void 0 : (_application$pitDetai7 = application.pitDetail) === null || _application$pitDetai7 === void 0 ? void 0 : _application$pitDetai7.diameter) + "m * " + (application === null || application === void 0 ? void 0 : (_application$pitDetai8 = application.pitDetail) === null || _application$pitDetai8 === void 0 ? void 0 : _application$pitDetai8.height) + "m                                  (" + t("CS_COMMON_DIAMETER") + " x " + t("CS_COMMON_DEPTH") + ")" : "N/A"
      }, {
        title: t("ES_FSM_ACTION_VEHICLE_TYPE"),
        value: getApplicationVehicleType(application, t)
      }, {
        title: t("CS_APPLICATION_DETAILS_TRIPS"),
        value: (application === null || application === void 0 ? void 0 : application.noOfTrips) || "N/A"
      }, {
        title: t("CS_APPLICATION_DETAILS_AMOUNT_PER_TRIP"),
        value: getAmountPerTrip(amountPerTrip)
      }, {
        title: t("CS_APPLICATION_DETAILS_AMOUNT_DUE"),
        value: getTotalAmount(totalAmount)
      }]
    }]
  };
};

var Reason = function Reason(_ref) {
  var headComment = _ref.headComment,
      otherComment = _ref.otherComment;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "checkpoint-comments-wrap"
  }, /*#__PURE__*/React__default.createElement("h4", null, headComment), /*#__PURE__*/React__default.createElement("p", null, otherComment));
};

var Username = function Username(_ref) {
  var _data$Employees, _data$Employees$, _data$Employees$$assi, _data$Employees$$assi2, _data$Employees2, _data$Employees2$, _data$Employees2$$ass, _data$Employees2$$ass2, _assigner$roles;

  var assigner = _ref.assigner;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useState = React.useState(null);

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$Hooks$useEmplo = Digit.Hooks.useEmployeeSearch(tenantId, {
    uuids: assigner === null || assigner === void 0 ? void 0 : assigner.uuid
  }, {
    enabled: Digit.UserService.getType() === "employee" && (assigner === null || assigner === void 0 ? void 0 : assigner.type) === "EMPLOYEE"
  }),
      data = _Digit$Hooks$useEmplo.data;

  return /*#__PURE__*/React__default.createElement("p", null, assigner === null || assigner === void 0 ? void 0 : assigner.name, " ", data !== null && data !== void 0 && (_data$Employees = data.Employees) !== null && _data$Employees !== void 0 && (_data$Employees$ = _data$Employees[0]) !== null && _data$Employees$ !== void 0 && (_data$Employees$$assi = _data$Employees$.assignments) !== null && _data$Employees$$assi !== void 0 && (_data$Employees$$assi2 = _data$Employees$$assi[0]) !== null && _data$Employees$$assi2 !== void 0 && _data$Employees$$assi2.designation ? "(" + t("COMMON_MASTERS_DESIGNATION_" + (data === null || data === void 0 ? void 0 : (_data$Employees2 = data.Employees) === null || _data$Employees2 === void 0 ? void 0 : (_data$Employees2$ = _data$Employees2[0]) === null || _data$Employees2$ === void 0 ? void 0 : (_data$Employees2$$ass = _data$Employees2$.assignments) === null || _data$Employees2$$ass === void 0 ? void 0 : (_data$Employees2$$ass2 = _data$Employees2$$ass[0]) === null || _data$Employees2$$ass2 === void 0 ? void 0 : _data$Employees2$$ass2.designation)) + ")" : "", (assigner === null || assigner === void 0 ? void 0 : assigner.type) === "CITIZEN" && assigner !== null && assigner !== void 0 && (_assigner$roles = assigner.roles) !== null && _assigner$roles !== void 0 && _assigner$roles.some(function (role) {
    return role.code === "FSM_DSO";
  }) ? "(DSO)" : "");
};

var TLCaption = function TLCaption(_ref) {
  var data = _ref.data;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React__default.createElement("div", null, data.date && /*#__PURE__*/React__default.createElement("p", null, data.date), /*#__PURE__*/React__default.createElement(Username, {
    assigner: data.name
  }), data.mobileNumber && /*#__PURE__*/React__default.createElement(digitUiReactComponents.TelePhone, {
    mobile: data.mobileNumber
  }), data.source && /*#__PURE__*/React__default.createElement("p", null, t("ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_" + data.source.toUpperCase())), data.comment && /*#__PURE__*/React__default.createElement(Reason, {
    otherComment: data === null || data === void 0 ? void 0 : data.otherComment,
    headComment: data === null || data === void 0 ? void 0 : data.comment
  }));
};

var ApplicationTimeline = function ApplicationTimeline(props) {
  var _props$application, _data$timeline, _data$timeline2, _data$timeline$;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _Digit$Hooks$useWorkf = Digit.Hooks.useWorkflowDetails({
    tenantId: (_props$application = props.application) === null || _props$application === void 0 ? void 0 : _props$application.tenantId,
    id: props.id,
    moduleCode: "FSM"
  }),
      isLoading = _Digit$Hooks$useWorkf.isLoading,
      data = _Digit$Hooks$useWorkf.data;

  var getTimelineCaptions = function getTimelineCaptions(checkpoint) {
    var _checkpoint$comment;

    var __comment = checkpoint === null || checkpoint === void 0 ? void 0 : (_checkpoint$comment = checkpoint.comment) === null || _checkpoint$comment === void 0 ? void 0 : _checkpoint$comment.split("~");

    var reason = __comment ? __comment[0] : null;
    var reason_comment = __comment ? __comment[1] : null;

    if (checkpoint.status === "CREATED") {
      var _checkpoint$auditDeta, _props$application2;

      var caption = {
        date: checkpoint === null || checkpoint === void 0 ? void 0 : (_checkpoint$auditDeta = checkpoint.auditDetails) === null || _checkpoint$auditDeta === void 0 ? void 0 : _checkpoint$auditDeta.created,
        source: ((_props$application2 = props.application) === null || _props$application2 === void 0 ? void 0 : _props$application2.source) || ""
      };
      return /*#__PURE__*/React__default.createElement(TLCaption, {
        data: caption
      });
    } else if (checkpoint.status === "PENDING_APPL_FEE_PAYMENT" || checkpoint.status === "ASSING_DSO" || checkpoint.status === "PENDING_DSO_APPROVAL" || checkpoint.status === "DSO_REJECTED" || checkpoint.status === "CANCELED" || checkpoint.status === "REJECTED") {
      var _checkpoint$auditDeta2;

      var _caption = {
        date: checkpoint === null || checkpoint === void 0 ? void 0 : (_checkpoint$auditDeta2 = checkpoint.auditDetails) === null || _checkpoint$auditDeta2 === void 0 ? void 0 : _checkpoint$auditDeta2.created,
        name: checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.assigner,
        comment: reason ? t("ES_ACTION_REASON_" + reason) : null,
        otherComment: reason_comment ? reason_comment : null
      };
      return /*#__PURE__*/React__default.createElement(TLCaption, {
        data: _caption
      });
    } else if (checkpoint.status === "CITIZEN_FEEDBACK_PENDING") {
      return /*#__PURE__*/React__default.createElement(React.Fragment, null, (data === null || data === void 0 ? void 0 : data.nextActions.length) > 0 && /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
        to: "/digit-ui/citizen/fsm/rate/" + props.id
      }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.ActionLinks, null, t("CS_FSM_RATE")))));
    } else if (checkpoint.status === "DSO_INPROGRESS") {
      var _props$application3, _props$application3$d, _props$application4;

      var _caption2 = {
        name: checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.assigner,
        mobileNumber: (_props$application3 = props.application) === null || _props$application3 === void 0 ? void 0 : (_props$application3$d = _props$application3.dsoDetails) === null || _props$application3$d === void 0 ? void 0 : _props$application3$d.mobileNumber,
        date: t("CS_FSM_EXPECTED_DATE") + " " + Digit.DateUtils.ConvertTimestampToDate((_props$application4 = props.application) === null || _props$application4 === void 0 ? void 0 : _props$application4.possibleServiceDate)
      };
      return /*#__PURE__*/React__default.createElement(TLCaption, {
        data: _caption2
      });
    } else if (checkpoint.status === "COMPLETED") {
      return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Rating, {
        withText: true,
        text: t("CS_FSM_YOU_RATED"),
        currentRating: checkpoint.rating
      }), /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
        to: "/digit-ui/citizen/fsm/rate-view/" + props.id
      }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.ActionLinks, null, t("CS_FSM_RATE_VIEW"))));
    }
  };

  var showNextActions = function showNextActions(nextAction) {
    switch (nextAction === null || nextAction === void 0 ? void 0 : nextAction.action) {
      case "PAY":
        return /*#__PURE__*/React__default.createElement("div", {
          style: {
            marginTop: "24px"
          }
        }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
          to: {
            pathname: "/digit-ui/citizen/payment/collect/FSM.TRIP_CHARGES/" + props.id + "/?tenantId=" + props.application.tenantId,
            state: {
              tenantId: props.application.tenantId
            }
          }
        }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
          label: t("CS_APPLICATION_DETAILS_MAKE_PAYMENT")
        })));

      case "SUBMIT_FEEDBACK":
        return /*#__PURE__*/React__default.createElement("div", {
          style: {
            marginTop: "24px"
          }
        }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
          to: "/digit-ui/citizen/fsm/rate/" + props.id
        }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
          label: t("CS_APPLICATION_DETAILS_RATE")
        })));
    }
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, !isLoading && /*#__PURE__*/React__default.createElement(React.Fragment, null, (data === null || data === void 0 ? void 0 : (_data$timeline = data.timeline) === null || _data$timeline === void 0 ? void 0 : _data$timeline.length) > 0 && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSectionHeader, {
    style: {
      marginBottom: "16px",
      marginTop: "32px"
    }
  }, t("CS_APPLICATION_DETAILS_APPLICATION_TIMELINE")), data !== null && data !== void 0 && data.timeline && (data === null || data === void 0 ? void 0 : (_data$timeline2 = data.timeline) === null || _data$timeline2 === void 0 ? void 0 : _data$timeline2.length) === 1 ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CheckPoint, {
    isCompleted: true,
    label: t("CS_COMMON_" + (data === null || data === void 0 ? void 0 : (_data$timeline$ = data.timeline[0]) === null || _data$timeline$ === void 0 ? void 0 : _data$timeline$.status)),
    customChild: getTimelineCaptions(data === null || data === void 0 ? void 0 : data.timeline[0])
  }) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.ConnectingCheckPoints, null, (data === null || data === void 0 ? void 0 : data.timeline) && (data === null || data === void 0 ? void 0 : data.timeline.map(function (checkpoint, index, arr) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CheckPoint, {
      keyValue: index,
      isCompleted: index === 0,
      label: t("CS_COMMON_" + checkpoint.status),
      customChild: getTimelineCaptions(checkpoint)
    }));
  })))), data && showNextActions(data === null || data === void 0 ? void 0 : data.nextActions[0]));
};

var ApplicationDetails = function ApplicationDetails() {
  var _application$applicat, _paymentsHistory$Paym2, _application$applicat2;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useParams = reactRouterDom.useParams(),
      id = _useParams.id;

  var history = reactRouterDom.useHistory();

  var _useLocation = reactRouterDom.useLocation(),
      locState = _useLocation.state;

  var tenantId = (locState === null || locState === void 0 ? void 0 : locState.tenantId) || Digit.ULBService.getCurrentTenantId();
  var state = tenantId === null || tenantId === void 0 ? void 0 : tenantId.split(".")[0];

  var _Digit$Hooks$fsm$useA = Digit.Hooks.fsm.useApplicationDetail(t, tenantId, id, {}, "CITIZEN"),
      isLoading = _Digit$Hooks$fsm$useA.isLoading,
      application = _Digit$Hooks$fsm$useA.data;

  var _Digit$Hooks$fsm$useP = Digit.Hooks.fsm.usePaymentHistory(tenantId, id),
      paymentsHistory = _Digit$Hooks$fsm$useP.data;

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      storeData = _Digit$Hooks$useStore.data;

  var _ref = storeData || {},
      tenants = _ref.tenants;

  var _useState = React.useState(false),
      showOptions = _useState[0],
      setShowOptions = _useState[1];

  if (isLoading || !application) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  if ((application === null || application === void 0 ? void 0 : (_application$applicat = application.applicationDetails) === null || _application$applicat === void 0 ? void 0 : _application$applicat.length) === 0) {
    history.goBack();
  }

  var handleDownloadPdf = function handleDownloadPdf() {
    try {
      var tenantInfo = tenants.find(function (tenant) {
        return tenant.code === (application === null || application === void 0 ? void 0 : application.tenantId);
      });
      var data = getPDFData(_extends({}, application === null || application === void 0 ? void 0 : application.pdfData), tenantInfo, t);
      Digit.Utils.pdf.generate(data);
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
          return Promise.resolve(Digit.PaymentService.generatePdf(state, {
            Payments: [paymentsHistory.Payments[0]]
          }, "fsm-receipt")).then(function (newResponse) {
            return Promise.resolve(Digit.PaymentService.printReciept(state, {
              fileStoreIds: newResponse.filestoreIds[0]
            })).then(function (fileStore) {
              window.open(fileStore[newResponse.filestoreIds[0]], "_blank");
              setShowOptions(false);
            });
          });
        } else {
          return Promise.resolve(Digit.PaymentService.printReciept(state, {
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

  var dowloadOptions = (paymentsHistory === null || paymentsHistory === void 0 ? void 0 : (_paymentsHistory$Paym2 = paymentsHistory.Payments) === null || _paymentsHistory$Paym2 === void 0 ? void 0 : _paymentsHistory$Paym2.length) > 0 ? [{
    label: t("CS_COMMON_APPLICATION_ACKNOWLEDGEMENT"),
    onClick: handleDownloadPdf
  }, {
    label: t("CS_COMMON_PAYMENT_RECEIPT"),
    onClick: downloadPaymentReceipt
  }] : [{
    label: t("CS_COMMON_APPLICATION_ACKNOWLEDGEMENT"),
    onClick: handleDownloadPdf
  }];
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "cardHeaderWithOptions"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, null, t("CS_FSM_APPLICATION_DETAIL_TITLE_APPLICATION_DETAILS")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.MultiLink, {
    className: "multilinkWrapper",
    onHeadClick: function onHeadClick() {
      return setShowOptions(!showOptions);
    },
    displayOptions: showOptions,
    options: dowloadOptions
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    style: {
      position: "relative"
    }
  }, application === null || application === void 0 ? void 0 : (_application$applicat2 = application.applicationDetails) === null || _application$applicat2 === void 0 ? void 0 : _application$applicat2.map(function (_ref2, index) {
    var title = _ref2.title,
        value = _ref2.value,
        child = _ref2.child,
        caption = _ref2.caption,
        map = _ref2.map;
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.KeyNote, {
      key: index,
      keyValue: t(title),
      note: t(value) || (!map || !child) && "N/A",
      caption: t(caption)
    }, child && typeof child === "object" ? React__default.createElement(child.element, _extends({}, child)) : child);
  }), /*#__PURE__*/React__default.createElement(ApplicationTimeline, {
    application: application === null || application === void 0 ? void 0 : application.pdfData,
    id: id
  })));
};

var MyApplication = function MyApplication(_ref) {
  var _application$applicat;

  var application = _ref.application;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.KeyNote, {
    keyValue: t("CS_FSM_APPLICATION_APPLICATION_NO"),
    note: application.applicationNo
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.KeyNote, {
    keyValue: t("CS_FSM_APPLICATION_SERVICE_CATEGORY"),
    note: application.serviceCategory || t("CS_TITLE_FSM")
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.KeyNote, {
    keyValue: t("CS_FSM_APPLICATION_TYPE"),
    note: t("CS_FSM_APPLICATION_TYPE_" + ((_application$applicat = application.applicationType) === null || _application$applicat === void 0 ? void 0 : _application$applicat.toUpperCase().replace(" ", "_"))) || t("CS_FSM_APPLICATION_TYPE_DESLUDGING")
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.KeyNote, {
    keyValue: t("CS_FSM_APPLICATION_DETAIL_STATUS"),
    note: t("CS_COMMON_" + application.applicationStatus)
  }), /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: {
      pathname: "/digit-ui/citizen/fsm/application-details/" + application.applicationNo,
      state: {
        tenantId: application.tenantId
      }
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("CS_COMMON_VIEW")
  })));
};

var MyApplications = function MyApplications() {
  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$UserService$ge = Digit.UserService.getUser(),
      userInfo = _Digit$UserService$ge.info;

  var _Digit$Hooks$fsm$useS = Digit.Hooks.fsm.useSearchAll(tenantId, {
    uuid: userInfo.uuid,
    limit: 100
  }),
      isLoading = _Digit$Hooks$fsm$useS.isLoading,
      _Digit$Hooks$fsm$useS2 = _Digit$Hooks$fsm$useS.data;

  _Digit$Hooks$fsm$useS2 = _Digit$Hooks$fsm$useS2 === void 0 ? {} : _Digit$Hooks$fsm$useS2;
  var _Digit$Hooks$fsm$useS3 = _Digit$Hooks$fsm$useS2.data;
  _Digit$Hooks$fsm$useS3 = _Digit$Hooks$fsm$useS3 === void 0 ? {} : _Digit$Hooks$fsm$useS3;
  var applicationsList = _Digit$Hooks$fsm$useS3.table;

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, null, t("CS_FSM_APPLICATION_TITLE_MY_APPLICATION")), (applicationsList === null || applicationsList === void 0 ? void 0 : applicationsList.length) > 0 && applicationsList.map(function (application, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: index
    }, /*#__PURE__*/React__default.createElement(MyApplication, {
      application: application
    }));
  }));
};

var _ref;

var newConfig = [{
  head: "ES_NEW_APPLICATION_PROPERTY_DETAILS",
  body: [{
    label: "ES_NEW_APPLICATION_PROPERTY_TYPE",
    isMandatory: true,
    type: "component",
    route: "property-type",
    key: "propertyType",
    component: "SelectPropertyType",
    texts: {
      headerCaption: "",
      header: "CS_FILE_APPLICATION_PROPERTY_LABEL",
      cardText: "CS_FILE_APPLICATION_PROPERTY_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    nextStep: "property-subtype"
  }, {
    label: "ES_NEW_APPLICATION_PROPERTY_SUB-TYPE",
    isMandatory: true,
    type: "component",
    route: "property-subtype",
    key: "subtype",
    component: "SelectPropertySubtype",
    texts: {
      headerCaption: "",
      header: "CS_FILE_APPLICATION_PROPERTY_SUBTYPE_LABEL",
      cardText: "CS_FILE_APPLICATION_PROPERTY_SUBTYPE_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    nextStep: "map"
  }]
}, {
  head: "ES_NEW_APPLICATION_LOCATION_DETAILS",
  body: [{
    route: "map",
    component: "SelectGeolocation",
    nextStep: "pincode",
    hideInEmployee: true,
    key: "address"
  }, {
    route: "pincode",
    component: "SelectPincode",
    texts: {
      headerCaption: "",
      header: "CS_FILE_APPLICATION_PINCODE_LABEL",
      cardText: "CS_FILE_APPLICATION_PINCODE_TEXT",
      submitBarLabel: "CS_COMMON_NEXT",
      skipText: "CORE_COMMON_SKIP_CONTINUE"
    },
    withoutLabel: true,
    key: "address",
    nextStep: "address",
    type: "component"
  }, {
    route: "address",
    component: "SelectAddress",
    withoutLabel: true,
    texts: {
      headerCaption: "CS_FILE_APPLICATION_PROPERTY_LOCATION_LABEL",
      header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_ADDRESS_TEXT",
      cardText: "CS_FILE_APPLICATION_PROPERTY_LOCATION_CITY_MOHALLA_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    key: "address",
    nextStep: "check-slum",
    isMandatory: true,
    type: "component"
  }, (_ref = {
    type: "component",
    route: "check-slum",
    isMandatory: true,
    component: "CheckSlum",
    texts: {
      header: "ES_NEW_APPLICATION_SLUM_CHECK",
      submitBarLabel: "CS_COMMON_NEXT"
    }
  }, _ref["component"] = "CheckSlum", _ref.key = "address", _ref.withoutLabel = true, _ref.nextStep = "slum-details", _ref.hideInEmployee = true, _ref), {
    type: "component",
    route: "slum-details",
    isMandatory: true,
    component: "SelectSlumName",
    texts: {
      header: "CS_NEW_APPLICATION_SLUM_NAME",
      cardText: "CS_NEW_APPLICATION_SLUM_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    withoutLabel: true,
    key: "address",
    nextStep: "street"
  }, {
    type: "component",
    route: "street",
    component: "SelectStreet",
    key: "address",
    withoutLabel: true,
    texts: {
      headerCaption: "CS_FILE_APPLICATION_PROPERTY_LOCATION_LABEL",
      header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_ADDRESS_TEXT",
      cardText: "CS_FILE_APPLICATION_PROPERTY_LOCATION_STREET_DOOR_NO_LABEL",
      submitBarLabel: "CS_COMMON_NEXT",
      skipText: "CORE_COMMON_SKIP_CONTINUE"
    },
    nextStep: "landmark"
  }, {
    type: "component",
    route: "landmark",
    component: "SelectLandmark",
    withoutLabel: true,
    texts: {
      headerCaption: "CS_FILE_APPLICATION_PROPERTY_LOCATION_LABEL",
      header: "CS_FILE_APPLICATION_PROPERTY_LOCATION_PROVIDE_LANDMARK_TITLE",
      cardText: "CS_FILE_APPLICATION_PROPERTY_LOCATION_PROVIDE_LANDMARK_TEXT",
      submitBarLabel: "CS_COMMON_NEXT",
      skipText: "CORE_COMMON_SKIP_CONTINUE"
    },
    key: "address",
    nextStep: "pit-type"
  }]
}, {
  head: "CS_CHECK_PIT_SEPTIC_TANK_DETAILS",
  body: [{
    label: "ES_NEW_APPLICATION_PIT_TYPE",
    isMandatory: false,
    type: "component",
    route: "pit-type",
    key: "pitType",
    component: "SelectPitType",
    texts: {
      header: "CS_FILE_PROPERTY_PIT_TYPE",
      cardText: "CS_FILE_PROPERTY_PIT_TYPE_TEXT",
      submitBarLabel: "CS_COMMON_NEXT",
      skipText: "CORE_COMMON_SKIP_CONTINUE"
    },
    nextStep: "tank-size"
  }, {
    route: "tank-size",
    component: "SelectTankSize",
    isMandatory: false,
    texts: {
      headerCaption: "",
      header: "CS_FILE_APPLICATION_PIT_SEPTIC_TANK_SIZE_TITLE",
      cardText: "CS_FILE_APPLICATION_PIT_SEPTIC_TANK_SIZE_TEXT",
      submitBarLabel: "CS_COMMON_NEXT"
    },
    type: "component",
    key: "pitDetail",
    nextStep: null,
    label: "ES_NEW_APPLICATION_PIT_DIMENSION"
  }]
}];

var ActionButton = function ActionButton(_ref) {
  var jumpTo = _ref.jumpTo;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();

  function routeTo() {
    history.push(jumpTo);
  }

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: t("CS_COMMON_CHANGE"),
    className: "check-page-link-button",
    onClick: routeTo
  });
};

var CheckPage = function CheckPage(_ref2) {
  var _address$doorNo, _address$doorNo2, _address$street, _address$street2, _address$locality, _address$landmark, _address$landmark2, _address$slumArea, _address$slumData;

  var onSubmit = _ref2.onSubmit,
      value = _ref2.value;

  var _useTranslation2 = reactI18next.useTranslation(),
      t = _useTranslation2.t;

  var history = reactRouterDom.useHistory();
  var address = value.address,
      propertyType = value.propertyType,
      subtype = value.subtype,
      pitType = value.pitType,
      pitDetail = value.pitDetail;
  var pitDetailValues = pitDetail ? Object.values(pitDetail).filter(function (value) {
    return !!value;
  }) : null;
  var pitMeasurement = pitDetailValues === null || pitDetailValues === void 0 ? void 0 : pitDetailValues.reduce(function (previous, current, index, array) {
    if (index === array.length - 1) {
      return previous + current + "m";
    } else {
      return previous + current + "m x ";
    }
  }, "");
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("CS_CHECK_CHECK_YOUR_ANSWERS")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, null, t("CS_CHECK_CHECK_YOUR_ANSWERS_TEXT")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, null, t("CS_CHECK_PROPERTY_DETAILS")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("CS_CHECK_PROPERTY_TYPE"),
    text: t(propertyType.i18nKey),
    actionButton: /*#__PURE__*/React__default.createElement(ActionButton, {
      jumpTo: "/digit-ui/citizen/fsm/new-application/property-type"
    })
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("CS_CHECK_PROPERTY_SUB_TYPE"),
    text: t(subtype.i18nKey),
    actionButton: /*#__PURE__*/React__default.createElement(ActionButton, {
      jumpTo: "/digit-ui/citizen/fsm/new-application/property-subtype"
    })
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("CS_CHECK_ADDRESS"),
    text: (address !== null && address !== void 0 && (_address$doorNo = address.doorNo) !== null && _address$doorNo !== void 0 && _address$doorNo.trim() ? (address === null || address === void 0 ? void 0 : (_address$doorNo2 = address.doorNo) === null || _address$doorNo2 === void 0 ? void 0 : _address$doorNo2.trim()) + ", " : "") + " " + (address !== null && address !== void 0 && (_address$street = address.street) !== null && _address$street !== void 0 && _address$street.trim() ? (address === null || address === void 0 ? void 0 : (_address$street2 = address.street) === null || _address$street2 === void 0 ? void 0 : _address$street2.trim()) + ", " : "") + t(address === null || address === void 0 ? void 0 : (_address$locality = address.locality) === null || _address$locality === void 0 ? void 0 : _address$locality.i18nkey) + ", " + t(address === null || address === void 0 ? void 0 : address.city.code),
    actionButton: /*#__PURE__*/React__default.createElement(ActionButton, {
      jumpTo: "/digit-ui/citizen/fsm/new-application/pincode"
    })
  }), (address === null || address === void 0 ? void 0 : (_address$landmark = address.landmark) === null || _address$landmark === void 0 ? void 0 : _address$landmark.trim()) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("CS_CHECK_LANDMARK"),
    text: address === null || address === void 0 ? void 0 : (_address$landmark2 = address.landmark) === null || _address$landmark2 === void 0 ? void 0 : _address$landmark2.trim(),
    actionButton: /*#__PURE__*/React__default.createElement(ActionButton, {
      jumpTo: "/digit-ui/citizen/fsm/new-application/landmark"
    })
  }), (address === null || address === void 0 ? void 0 : (_address$slumArea = address.slumArea) === null || _address$slumArea === void 0 ? void 0 : _address$slumArea.code) === true && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("CS_APPLICATION_DETAILS_SLUM_NAME"),
    text: t(address === null || address === void 0 ? void 0 : (_address$slumData = address.slumData) === null || _address$slumData === void 0 ? void 0 : _address$slumData.i18nKey),
    actionButton: /*#__PURE__*/React__default.createElement(ActionButton, {
      jumpTo: "/digit-ui/citizen/fsm/new-application/slum-details"
    })
  }), pitType && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("CS_CHECK_PIT_TYPE"),
    text: t(pitType.i18nKey),
    actionButton: /*#__PURE__*/React__default.createElement(ActionButton, {
      jumpTo: "/digit-ui/citizen/fsm/new-application/pit-type"
    })
  }), pitMeasurement && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("CS_CHECK_SIZE"),
    text: [pitMeasurement, {
      value: (pitDetailValues === null || pitDetailValues === void 0 ? void 0 : pitDetailValues.length) === 3 ? t("CS_COMMON_LENGTH") + " x " + t("CS_COMMON_BREADTH") + " x " + t("CS_COMMON_DEPTH") : t("CS_COMMON_DIAMETER") + " x " + t("CS_COMMON_DEPTH"),
      className: "card-text",
      style: {
        fontSize: "16px"
      }
    }],
    actionButton: /*#__PURE__*/React__default.createElement(ActionButton, {
      jumpTo: "/digit-ui/citizen/fsm/new-application/tank-size"
    })
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("CS_COMMON_SUBMIT"),
    onSubmit: onSubmit
  }));
};

var GetActionMessage = function GetActionMessage() {
  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  return t("CS_FILE_DESLUDGING_APPLICATION_SUCCESS");
};

var BannerPicker = function BannerPicker(props) {
  var _props$data;

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Banner, {
    message: GetActionMessage(),
    applicationNumber: (_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.fsm[0].applicationNo,
    info: props.t("CS_FILE_DESLUDGING_APPLICATION_NO"),
    successful: props.isSuccess
  });
};

var Response = function Response(_ref) {
  var _data$address, _data$address2, _data$address2$city, _mutation$data, _mutation$data$fsm$0$, _mutation$data$fsm$0$2, _mutation$data2, _mutation$data2$fsm$, _mutation$data3, _mutation$data3$fsm$;

  var data = _ref.data,
      onSuccess = _ref.onSuccess;

  var _useTranslation2 = reactI18next.useTranslation(),
      t = _useTranslation2.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var mutation = Digit.Hooks.fsm.useDesludging(data !== null && data !== void 0 && (_data$address = data.address) !== null && _data$address !== void 0 && _data$address.city ? (_data$address2 = data.address) === null || _data$address2 === void 0 ? void 0 : (_data$address2$city = _data$address2.city) === null || _data$address2$city === void 0 ? void 0 : _data$address2$city.code : tenantId);

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      storeData = _Digit$Hooks$useStore.data;

  var _ref2 = storeData || {},
      tenants = _ref2.tenants;

  var localityCode = mutation === null || mutation === void 0 ? void 0 : (_mutation$data = mutation.data) === null || _mutation$data === void 0 ? void 0 : (_mutation$data$fsm$0$ = _mutation$data.fsm[0].address) === null || _mutation$data$fsm$0$ === void 0 ? void 0 : (_mutation$data$fsm$0$2 = _mutation$data$fsm$0$.locality) === null || _mutation$data$fsm$0$2 === void 0 ? void 0 : _mutation$data$fsm$0$2.code;
  var slumCode = mutation === null || mutation === void 0 ? void 0 : (_mutation$data2 = mutation.data) === null || _mutation$data2 === void 0 ? void 0 : (_mutation$data2$fsm$ = _mutation$data2.fsm[0].address) === null || _mutation$data2$fsm$ === void 0 ? void 0 : _mutation$data2$fsm$.slumName;
  var slum = Digit.Hooks.fsm.useSlum(mutation === null || mutation === void 0 ? void 0 : (_mutation$data3 = mutation.data) === null || _mutation$data3 === void 0 ? void 0 : (_mutation$data3$fsm$ = _mutation$data3.fsm[0].address) === null || _mutation$data3$fsm$ === void 0 ? void 0 : _mutation$data3$fsm$.tenantId, slumCode, localityCode, {
    enabled: slumCode ? true : false,
    retry: slumCode ? true : false
  });
  React.useEffect(function () {
    try {
      var subtype = data.subtype,
          pitDetail = data.pitDetail,
          address = data.address,
          pitType = data.pitType,
          source = data.source;
      var city = address.city,
          locality = address.locality,
          geoLocation = address.geoLocation,
          pincode = address.pincode,
          street = address.street,
          doorNo = address.doorNo,
          landmark = address.landmark,
          _slum = address.slum;
      var formdata = {
        fsm: {
          tenantId: city.code,
          additionalDetails: {},
          propertyUsage: subtype.code,
          address: {
            tenantId: city.code,
            additionalDetails: null,
            street: street === null || street === void 0 ? void 0 : street.trim(),
            doorNo: doorNo === null || doorNo === void 0 ? void 0 : doorNo.trim(),
            landmark: landmark === null || landmark === void 0 ? void 0 : landmark.trim(),
            slumName: _slum,
            city: city.name,
            pincode: pincode,
            locality: {
              code: locality.code,
              name: locality.name
            },
            geoLocation: {
              latitude: geoLocation === null || geoLocation === void 0 ? void 0 : geoLocation.latitude,
              longitude: geoLocation === null || geoLocation === void 0 ? void 0 : geoLocation.longitude,
              additionalDetails: {}
            }
          },
          pitDetail: pitDetail,
          source: source,
          sanitationtype: pitType === null || pitType === void 0 ? void 0 : pitType.code
        },
        workflow: null
      };
      mutation.mutate(formdata, {
        onSuccess: onSuccess
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  var handleDownloadPdf = function handleDownloadPdf() {
    var fsm = mutation.data.fsm;
    var applicationDetails = fsm[0],
        rest = fsm.slice(1);
    var tenantInfo = tenants.find(function (tenant) {
      return tenant.code === applicationDetails.tenantId;
    });
    var data = getPDFData(_extends({}, applicationDetails, {
      slum: slum
    }), tenantInfo, t);
    Digit.Utils.pdf.generate(data);
  };

  return mutation.isLoading || mutation.isIdle ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(BannerPicker, {
    t: t,
    data: mutation.data,
    isSuccess: mutation.isSuccess,
    isLoading: mutation.isIdle || mutation.isLoading
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, null, t("CS_FILE_PROPERTY_RESPONSE")), mutation.isSuccess && /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: /*#__PURE__*/React__default.createElement("div", {
      className: "response-download-button"
    }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "#f47738"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
    }))), /*#__PURE__*/React__default.createElement("span", {
      className: "download-button"
    }, t("CS_COMMON_DOWNLOAD"))),
    onClick: handleDownloadPdf,
    className: "w-full"
  }), /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: "/digit-ui/citizen"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("CORE_COMMON_GO_TO_HOME")
  })));
};

var FileComplaint = function FileComplaint(_ref) {
  var parentRoute = _ref.parentRoute;
  var queryClient = reactQuery.useQueryClient();
  var match = reactRouterDom.useRouteMatch();

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useLocation = reactRouterDom.useLocation(),
      pathname = _useLocation.pathname;

  var history = reactRouterDom.useHistory();
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];
  var config = [];

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("FSM_CITIZEN_FILE_PROPERTY", {}),
      params = _Digit$Hooks$useSessi[0],
      setParams = _Digit$Hooks$useSessi[1],
      clearParams = _Digit$Hooks$useSessi[2];

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "CommonFieldsConfig"),
      commonFields = _Digit$Hooks$fsm$useM.data,
      isLoading = _Digit$Hooks$fsm$useM.isLoading;

  var goNext = function goNext(skipStep) {
    var currentPath = pathname.split("/").pop();

    var _config$find = config.find(function (routeObj) {
      return routeObj.route === currentPath;
    }),
        nextStep = _config$find.nextStep;

    var redirectWithHistory = history.push;

    if (skipStep) {
      redirectWithHistory = history.replace;
    }

    if (nextStep === null) {
      return redirectWithHistory(parentRoute + "/new-application/check");
    }

    redirectWithHistory(match.path + "/" + nextStep);
  };

  var submitComplaint = function submitComplaint() {
    try {
      history.push(parentRoute + "/new-application/response");
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  function handleSelect(key, data, skipStep) {
    var _extends2;

    setParams(_extends({}, params, (_extends2 = {}, _extends2[key] = _extends({}, params[key], data), _extends2), {
      source: "ONLINE"
    }));
    goNext(skipStep);
  }

  var handleSkip = function handleSkip() {};

  var handleSUccess = function handleSUccess() {
    clearParams();
    queryClient.invalidateQueries("FSM_CITIZEN_SEARCH");
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  commonFields.forEach(function (obj) {
    config = config.concat(obj.body.filter(function (a) {
      return !a.hideInCitizen;
    }));
  });
  config.indexRoute = "property-type";
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
      formData: params
    }));
  }), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: match.path + "/check"
  }, /*#__PURE__*/React__default.createElement(CheckPage, {
    onSubmit: submitComplaint,
    value: params
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: match.path + "/response"
  }, /*#__PURE__*/React__default.createElement(Response, {
    data: params,
    onSuccess: handleSUccess
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
    to: match.path + "/" + config.indexRoute
  })));
};

var RateView = function RateView(props) {
  var _data$timeline$, _data$timeline$2;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useParams = reactRouterDom.useParams(),
      applicationNos = _useParams.id;

  var _Digit$Hooks$fsm$useS = Digit.Hooks.fsm.useSearch(tenantId, {
    applicationNos: applicationNos
  }),
      isLoading = _Digit$Hooks$fsm$useS.isLoading,
      isSuccess = _Digit$Hooks$fsm$useS.isSuccess,
      application = _Digit$Hooks$fsm$useS.data;

  var _Digit$Hooks$useWorkf = Digit.Hooks.useWorkflowDetails({
    tenantId: application === null || application === void 0 ? void 0 : application.tenantId,
    id: applicationNos,
    moduleCode: "FSM",
    config: {
      enabled: isSuccess && !!application
    }
  }),
      isWorkflowLoading = _Digit$Hooks$useWorkf.isLoading,
      data = _Digit$Hooks$useWorkf.data;

  if (isLoading || isWorkflowLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("CS_RATE_HELP_US")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.KeyNote, {
    keyValue: t("CS_FSM_YOU_RATED")
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Rating, {
    currentRating: data === null || data === void 0 ? void 0 : (_data$timeline$ = data.timeline[0]) === null || _data$timeline$ === void 0 ? void 0 : _data$timeline$.rating
  })), application.additionalDetails.CheckList.map(function (checklist) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.KeyNote, {
      keyValue: t(checklist.code),
      note: checklist.value.split(",").map(function (val) {
        return t(val);
      }).join(", ")
    });
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.KeyNote, {
    keyValue: t("CS_COMMON_COMMENTS"),
    note: (data === null || data === void 0 ? void 0 : (_data$timeline$2 = data.timeline[0]) === null || _data$timeline$2 === void 0 ? void 0 : _data$timeline$2.comment) || "N/A"
  }));
};

var SelectRating = function SelectRating(_ref) {
  var _checklistData$FSM;

  var parentRoute = _ref.parentRoute;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var history = reactRouterDom.useHistory();

  var _useParams = reactRouterDom.useParams(),
      applicationNos = _useParams.id;

  var _Digit$Hooks$fsm$useS = Digit.Hooks.fsm.useSearch(tenantId, {
    applicationNos: applicationNos
  }),
      application = _Digit$Hooks$fsm$useS.data;

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(tenantId, "FSM", "Checklist"),
      isLoading = _Digit$Hooks$fsm$useM.isLoading,
      checklistData = _Digit$Hooks$fsm$useM.data;

  var mutation = Digit.Hooks.fsm.useApplicationUpdate(tenantId);

  var _useState = React.useState({}),
      answers = _useState[0],
      setAnswers = _useState[1];

  function handleSubmit(data) {
    var rating = data.rating,
        comments = data.comments;

    var allAnswers = _extends({}, data, answers);

    var checklist = Object.keys(allAnswers).reduce(function (acc, key) {
      if (key === "comments" || key === "rating") {
        return acc;
      }

      acc.push({
        code: key,
        value: Array.isArray(allAnswers[key]) ? allAnswers[key].join(",") : allAnswers[key]
      });
      return acc;
    }, []);
    application.additionalDetails = {
      CheckList: checklist
    };
    history.push(parentRoute + "/response", {
      applicationData: application,
      key: "update",
      action: "RATE",
      actionData: {
        rating: rating,
        comments: comments
      }
    });
  }

  var handleSelect = function handleSelect(key) {
    return function (value) {
      var _extends2;

      setAnswers(_extends({}, answers, (_extends2 = {}, _extends2[key] = value, _extends2)));
    };
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  var inputs = checklistData === null || checklistData === void 0 ? void 0 : (_checklistData$FSM = checklistData.FSM) === null || _checklistData$FSM === void 0 ? void 0 : _checklistData$FSM.CheckList.map(function (item) {
    return {
      type: item.type === "SINGLE_SELECT" ? "radio" : "checkbox",
      checkLabels: item.options,
      onSelect: item.type === "SINGLE_SELECT" ? handleSelect(item.code) : null,
      selectedOption: item.type === "SINGLE_SELECT" ? answers[item.code] : null,
      name: item.code,
      label: item.code === "SPILLAGE" ? t("CS_FSM_APPLICATION_RATE_HELP_TEXT") : item.code
    };
  });
  var config = {
    texts: {
      header: t("CS_FSM_APPLICATION_RATE_TEXT"),
      submitBarLabel: t("CS_COMMON_SUBMIT")
    },
    inputs: [{
      type: "rate",
      maxRating: 5
    }].concat(inputs, [{
      type: "textarea",
      label: t("CS_COMMON_COMMENTS"),
      name: "comments"
    }])
  };
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.RatingCard, {
    config: config,
    t: t,
    onSelect: handleSubmit
  });
};

var ApplicationAudit = function ApplicationAudit(_ref) {
  var _auditResponse$fsmAud, _auditResponse$fsmAud2, _auditResponse$fsmAud3;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useParams = reactRouterDom.useParams(),
      id = _useParams.id;

  var tenantId = Digit.UserService.getUser().info.tenantId;

  var _Digit$Hooks$fsm$useA = Digit.Hooks.fsm.useApplicationAudit(tenantId, {
    applicationNo: id
  }),
      auditResponse = _Digit$Hooks$fsm$useA.data,
      isLoading = _Digit$Hooks$fsm$useA.isLoading;

  var columns = React__default.useMemo(function () {
    return [{
      Header: t("ES_AUDIT_WHEN"),
      accessor: "when"
    }, {
      Header: t("ES_AUDIT_WHO"),
      accessor: "who"
    }, {
      Header: t("ES_AUDIT_WHAT"),
      accessor: "what"
    }];
  }, []);
  var whenList = auditResponse === null || auditResponse === void 0 ? void 0 : (_auditResponse$fsmAud = auditResponse.fsmAudit) === null || _auditResponse$fsmAud === void 0 ? void 0 : _auditResponse$fsmAud.map(function (e) {
    return new Date(e.when).toLocaleString();
  });
  var uuids = auditResponse === null || auditResponse === void 0 ? void 0 : (_auditResponse$fsmAud2 = auditResponse.fsmAudit) === null || _auditResponse$fsmAud2 === void 0 ? void 0 : _auditResponse$fsmAud2.map(function (e) {
    return e.who;
  });
  var userList = Digit.Hooks.useUserSearch(null, {
    uuid: uuids
  }, {}, {
    enabled: uuids ? true : false
  });

  var getUserFromUUID = function getUserFromUUID(uuid) {
    var _userList$data;

    var fetchedUsers = userList === null || userList === void 0 ? void 0 : (_userList$data = userList.data) === null || _userList$data === void 0 ? void 0 : _userList$data.user;
    if (fetchedUsers !== null && fetchedUsers !== void 0 && fetchedUsers.length) return fetchedUsers.filter(function (e) {
      return e.uuid === uuid;
    })[0];else return null;
  };

  var getWhat = function getWhat(what) {
    var keys = Object.keys(what);
    return keys.map(function (key, i) {
      return /*#__PURE__*/React__default.createElement("p", {
        key: i
      }, /*#__PURE__*/React__default.createElement("span", null, key), " : ", /*#__PURE__*/React__default.createElement("span", null, what[key]));
    });
  };

  var data = auditResponse === null || auditResponse === void 0 ? void 0 : (_auditResponse$fsmAud3 = auditResponse.fsmAudit) === null || _auditResponse$fsmAud3 === void 0 ? void 0 : _auditResponse$fsmAud3.map(function (el, index) {
    var user = getUserFromUUID(el.who);
    return {
      when: whenList[index],
      who: (user === null || user === void 0 ? void 0 : user.name) + " (" + (user === null || user === void 0 ? void 0 : user.type) + ")",
      what: index === 0 ? /*#__PURE__*/React__default.createElement("p", null, "New Request", " ", /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
        to: "/digit-ui/employee/fsm/application-details/" + id
      }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
        label: t("ES_VIEW_APPLICATION"),
        style: {
          color: "#1671ba",
          marginLeft: "8px"
        }
      }))) : /*#__PURE__*/React__default.createElement(React__default.Fragment, null, getWhat(el.what))
    };
  });
  if (isLoading || userList.isLoading) return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      overflow: "auto"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, null, t("ES_TITLE_APPLICATION_AUDIT")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Table, {
    t: t,
    data: data || [],
    columns: columns,
    getCellProps: function getCellProps(cellInfo) {
      return {
        style: {
          padding: "20px 18px",
          fontSize: "16px"
        }
      };
    }
  }));
};

function getFilteredDsoData(dsoData, vehicle) {
  return dsoData === null || dsoData === void 0 ? void 0 : dsoData.filter(function (e) {
    var _e$vehicles;

    return (_e$vehicles = e.vehicles) === null || _e$vehicles === void 0 ? void 0 : _e$vehicles.find(function (veh) {
      return (veh === null || veh === void 0 ? void 0 : veh.type) == (vehicle === null || vehicle === void 0 ? void 0 : vehicle.code);
    });
  });
}

var configAssignDso = function configAssignDso(_ref) {
  var t = _ref.t,
      dsoData = _ref.dsoData,
      dso = _ref.dso,
      selectDSO = _ref.selectDSO,
      vehicleMenu = _ref.vehicleMenu,
      vehicle = _ref.vehicle,
      selectVehicle = _ref.selectVehicle,
      action = _ref.action;
  return {
    label: {
      heading: "ES_FSM_ACTION_TITLE_" + action,
      submit: "CS_COMMON_" + action,
      cancel: "CS_COMMON_CLOSE"
    },
    form: [{
      body: [{
        label: t("ES_FSM_ACTION_VEHICLE_TYPE"),
        isMandatory: true,
        type: "dropdown",
        populators: /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
          option: vehicleMenu,
          autoComplete: "off",
          optionKey: "i18nKey",
          id: "vehicle",
          selected: vehicle,
          select: selectVehicle,
          disable: vehicle ? true : false,
          t: t
        })
      }, {
        label: t("ES_FSM_ACTION_DSO_NAME"),
        isMandatory: true,
        type: "dropdown",
        populators: /*#__PURE__*/React__default.createElement(React__default.Fragment, null, getFilteredDsoData(dsoData, vehicle) && !getFilteredDsoData(dsoData, vehicle).length ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t("ES_COMMON_NO_DSO_AVAILABLE_WITH_SUCH_VEHICLE")) : null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
          option: getFilteredDsoData(dsoData, vehicle),
          autoComplete: "off",
          optionKey: "displayName",
          id: "dso",
          selected: dso,
          select: selectDSO
        }))
      }, {
        label: t("ES_FSM_ACTION_VEHICLE_CAPACITY_IN_LTRS"),
        isMandatory: true,
        type: "text",
        populators: {
          name: "capacity",
          validation: {
            required: true
          }
        },
        disable: true
      }, {
        label: t("ES_FSM_ACTION_SERVICE_DATE"),
        isMandatory: true,
        type: "custom",
        populators: {
          name: "date",
          validation: {
            required: true
          },
          customProps: {
            min: Digit.Utils.date.getDate()
          },
          defaultValue: Digit.Utils.date.getDate(),
          component: function component(props, customProps) {
            return /*#__PURE__*/React__default.createElement(digitUiReactComponents.DatePicker, _extends({
              onChange: props.onChange,
              date: props.value
            }, customProps));
          }
        }
      }]
    }]
  };
};

var configCompleteApplication = function configCompleteApplication(_ref) {
  var t = _ref.t,
      vehicle = _ref.vehicle,
      _ref$applicationCreat = _ref.applicationCreatedTime,
      applicationCreatedTime = _ref$applicationCreat === void 0 ? 0 : _ref$applicationCreat,
      action = _ref.action;
  return {
    label: {
      heading: "ES_FSM_ACTION_TITLE_" + action,
      submit: "CS_COMMON_" + action,
      cancel: "CS_COMMON_CLOSE"
    },
    form: [{
      body: [{
        label: t("ES_FSM_ACTION_DESLUGED_DATE_LABEL"),
        isMandatory: true,
        type: "custom",
        populators: {
          name: "desluged",
          validation: {
            required: true
          },
          defaultValue: Digit.Utils.date.getDate(),
          customProps: {
            min: Digit.Utils.date.getDate(applicationCreatedTime),
            max: Digit.Utils.date.getDate()
          },
          component: function component(props, customProps) {
            return /*#__PURE__*/React__default.createElement(digitUiReactComponents.DatePicker, _extends({
              onChange: props.onChange,
              date: props.value
            }, customProps));
          }
        }
      }, {
        label: t("ES_FSM_ACTION_WASTE_VOLUME_LABEL"),
        type: "number",
        isMandatory: true,
        populators: {
          name: "wasteCollected",
          validation: {
            required: true,
            validate: function validate(value) {
              return parseInt(value) <= parseInt(vehicle.capacity);
            }
          },
          error: t("ES_FSM_ACTION_INVALID_WASTE_VOLUME") + " " + (vehicle === null || vehicle === void 0 ? void 0 : vehicle.capacity) + " " + t("CS_COMMON_LITRES")
        }
      }]
    }]
  };
};

function getFilteredDsoData$1(dsoData, vehicle) {
  return dsoData === null || dsoData === void 0 ? void 0 : dsoData.filter(function (e) {
    var _e$vehicles;

    return (_e$vehicles = e.vehicles) === null || _e$vehicles === void 0 ? void 0 : _e$vehicles.find(function (veh) {
      return (veh === null || veh === void 0 ? void 0 : veh.type) == (vehicle === null || vehicle === void 0 ? void 0 : vehicle.code);
    });
  });
}

var configReassignDSO = function configReassignDSO(_ref) {
  var t = _ref.t,
      dsoData = _ref.dsoData,
      dso = _ref.dso,
      selectDSO = _ref.selectDSO,
      vehicleMenu = _ref.vehicleMenu,
      vehicle = _ref.vehicle,
      selectVehicle = _ref.selectVehicle,
      reassignReasonMenu = _ref.reassignReasonMenu,
      reassignReason = _ref.reassignReason,
      selectReassignReason = _ref.selectReassignReason,
      action = _ref.action,
      showReassignReason = _ref.showReassignReason;
  return {
    label: {
      heading: "ES_FSM_ACTION_TITLE_" + action,
      submit: "CS_COMMON_" + action,
      cancel: "CS_COMMON_CLOSE"
    },
    form: [{
      body: [].concat(showReassignReason ? [{
        label: t("ES_FSM_ACTION_REASSIGN_REASON"),
        type: "dropdown",
        isMandatory: true,
        populators: /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
          option: reassignReasonMenu,
          optionKey: "i18nKey",
          id: "reassign-reason",
          selected: reassignReason,
          select: selectReassignReason,
          t: t
        })
      }] : [], [{
        label: t("ES_FSM_ACTION_VEHICLE_TYPE"),
        isMandatory: vehicle ? false : true,
        type: "dropdown",
        populators: /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
          option: vehicleMenu,
          autoComplete: "off",
          optionKey: "i18nKey",
          id: "vehicle",
          selected: vehicle,
          select: selectVehicle,
          disable: vehicle ? true : false,
          t: t
        })
      }, {
        label: t("ES_FSM_ACTION_DSO_NAME"),
        isMandatory: true,
        type: "dropdown",
        populators: /*#__PURE__*/React__default.createElement(React__default.Fragment, null, getFilteredDsoData$1(dsoData, vehicle) && !getFilteredDsoData$1(dsoData, vehicle).length ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t("ES_COMMON_NO_DSO_AVAILABLE_WITH_SUCH_VEHICLE")) : null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
          option: getFilteredDsoData$1(dsoData, vehicle),
          autoComplete: "off",
          optionKey: "displayName",
          id: "dso",
          selected: dso,
          select: selectDSO
        }))
      }, {
        label: t("ES_FSM_ACTION_VEHICLE_CAPACITY_IN_LTRS"),
        type: "text",
        populators: {
          name: "capacity",
          validation: {
            required: true
          }
        },
        disable: true
      }, {
        label: t("ES_FSM_ACTION_SERVICE_DATE"),
        isMandatory: true,
        type: "custom",
        populators: {
          name: "date",
          validation: {
            required: true
          },
          customProps: {
            min: Digit.Utils.date.getDate()
          },
          defaultValue: Digit.Utils.date.getDate(),
          component: function component(props, customProps) {
            return /*#__PURE__*/React__default.createElement(digitUiReactComponents.DatePicker, _extends({
              onChange: props.onChange,
              date: props.value
            }, customProps));
          }
        }
      }])
    }]
  };
};

var configRejectApplication = function configRejectApplication(_ref) {
  var t = _ref.t,
      rejectMenu = _ref.rejectMenu,
      setReason = _ref.setReason,
      reason = _ref.reason,
      action = _ref.action;
  return {
    label: {
      heading: "ES_FSM_ACTION_TITLE_" + action,
      submit: "CS_COMMON_" + action,
      cancel: "CS_COMMON_CLOSE"
    },
    form: [{
      body: [{
        label: t("ES_FSM_ACTION_" + action.toUpperCase() + "_REASON"),
        type: "dropdown",
        populators: /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
          t: t,
          option: rejectMenu,
          id: "reason",
          optionKey: "i18nKey",
          selected: reason,
          select: setReason
        }),
        isMandatory: true
      }, {
        label: t("ES_FSM_ACTION_COMMENTS"),
        type: "textarea",
        populators: {
          name: "comments"
        }
      }]
    }]
  };
};

var configAcceptDso = function configAcceptDso(_ref) {
  var t = _ref.t,
      selectVehicleNo = _ref.selectVehicleNo,
      vehicleNoList = _ref.vehicleNoList,
      vehicleNo = _ref.vehicleNo,
      action = _ref.action;
  return {
    label: {
      heading: "ES_FSM_ACTION_TITLE_" + action,
      submit: "CS_COMMON_" + action,
      cancel: "CS_COMMON_CLOSE"
    },
    form: [{
      body: [{
        label: t("ES_FSM_ACTION_VEHICLE_REGISTRATION_NO"),
        isMandatory: true,
        type: "dropdown",
        populators: /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
          option: vehicleNoList,
          autoComplete: "off",
          optionKey: "registrationNumber",
          id: "vehicle",
          select: selectVehicleNo,
          selected: vehicleNo
        })
      }, {
        label: t("ES_FSM_ACTION_VEHICLE_CAPACITY_IN_LTRS"),
        isMandatory: true,
        type: "text",
        populators: {
          name: "capacity",
          validation: {
            required: true
          }
        },
        disable: true
      }]
    }]
  };
};

var Heading = function Heading(props) {
  return /*#__PURE__*/React__default.createElement("h1", {
    className: "heading-m"
  }, props.label);
};

var Close = function Close() {
  return /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "#FFFFFF"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0V0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
  }));
};

var CloseBtn = function CloseBtn(props) {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "icon-bg-secondary",
    onClick: props.onClick
  }, /*#__PURE__*/React__default.createElement(Close, null));
};

var ActionModal = function ActionModal(_ref) {
  var t = _ref.t,
      action = _ref.action,
      tenantId = _ref.tenantId,
      id = _ref.id,
      closeModal = _ref.closeModal,
      submitAction = _ref.submitAction,
      actionData = _ref.actionData;

  var _Digit$Hooks$fsm$useD = Digit.Hooks.fsm.useDsoSearch(tenantId),
      dsoData = _Digit$Hooks$fsm$useD.data,
      isDsoLoading = _Digit$Hooks$fsm$useD.isLoading,
      isDsoSuccess = _Digit$Hooks$fsm$useD.isSuccess;

  var _Digit$Hooks$fsm$useS = Digit.Hooks.fsm.useSearch(tenantId, {
    applicationNos: id
  }, {
    staleTime: Infinity,
    select: function select(details) {
      var additionalDetails = details.additionalDetails;

      var parseTillObject = function parseTillObject(str) {
        if (typeof str === "object") return str;else return parseTillObject(JSON.parse(str));
      };

      additionalDetails = parseTillObject(additionalDetails);
      return _extends({}, details, {
        additionalDetails: additionalDetails
      });
    }
  }),
      isSuccess = _Digit$Hooks$fsm$useS.isSuccess,
      applicationData = _Digit$Hooks$fsm$useS.data;

  var client = reactQuery.useQueryClient();
  var stateCode = tenantId.split(".")[0];

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(stateCode, "Vehicle", "VehicleType", {
    staleTime: Infinity
  }),
      vehicleList = _Digit$Hooks$fsm$useM.data,
      isVehicleDataLoaded = _Digit$Hooks$fsm$useM.isSuccess;

  var _useState = React.useState([]),
      setDsoList = _useState[1];

  var _useState2 = React.useState([]),
      vehicleNoList = _useState2[0],
      setVehicleNoList = _useState2[1];

  var _useState3 = React.useState({}),
      config = _useState3[0],
      setConfig = _useState3[1];

  var _useState4 = React.useState(null),
      dso = _useState4[0],
      setDSO = _useState4[1];

  var _useState5 = React.useState(null),
      vehicleNo = _useState5[0],
      setVehicleNo = _useState5[1];

  var _useState6 = React.useState([]),
      vehicleMenu = _useState6[0],
      setVehicleMenu = _useState6[1];

  var _useState7 = React.useState(null),
      vehicle = _useState7[0],
      setVehicle = _useState7[1];

  var _useState8 = React.useState({
    capacity: vehicle === null || vehicle === void 0 ? void 0 : vehicle.capacity,
    wasteCollected: vehicle === null || vehicle === void 0 ? void 0 : vehicle.capacity
  }),
      defaultValues = _useState8[0],
      setDefautValue = _useState8[1];

  var _Digit$Hooks$fsm$useM2 = Digit.Hooks.fsm.useMDMS(stateCode, "FSM", "Reason", {
    staleTime: Infinity
  }, ["ReassignReason", "RejectionReason", "DeclineReason", "CancelReason"]),
      Reason = _Digit$Hooks$fsm$useM2.data,
      isReasonLoading = _Digit$Hooks$fsm$useM2.isLoading;

  var _useState9 = React.useState(null),
      reassignReason = _useState9[0],
      selectReassignReason = _useState9[1];

  var _useState10 = React.useState(null),
      rejectionReason = _useState10[0],
      setRejectionReason = _useState10[1];

  var _useState11 = React.useState(null),
      declineReason = _useState11[0],
      setDeclineReason = _useState11[1];

  var _useState12 = React.useState(null),
      cancelReason = _useState12[0],
      selectCancelReason = _useState12[1];

  var _useState13 = React.useState(false),
      formValve = _useState13[0],
      setFormValve = _useState13[1];

  React.useEffect(function () {
    if (isSuccess && isVehicleDataLoaded) {
      var _vehicleList$filter = vehicleList.filter(function (item) {
        return item.code === applicationData.vehicleType;
      }),
          _vehicle = _vehicleList$filter[0];

      setVehicleMenu([_vehicle]);
      setVehicle(_vehicle);
      setDefautValue({
        capacity: _vehicle === null || _vehicle === void 0 ? void 0 : _vehicle.capacity,
        wasteCollected: _vehicle === null || _vehicle === void 0 ? void 0 : _vehicle.capacity
      });
    }
  }, [isVehicleDataLoaded, isSuccess]);
  React.useEffect(function () {
    if (vehicle && isDsoSuccess) {
      var _dsoList = dsoData.filter(function (dso) {
        var _dso$vehicles;

        return dso === null || dso === void 0 ? void 0 : (_dso$vehicles = dso.vehicles) === null || _dso$vehicles === void 0 ? void 0 : _dso$vehicles.find(function (dsoVehicle) {
          return dsoVehicle.type === vehicle.code;
        });
      });

      setDsoList(_dsoList);
    }
  }, [vehicle, isDsoSuccess]);
  React.useEffect(function () {
    if (isSuccess && isDsoSuccess && applicationData.dsoId) {
      var _dso$vehicles2;

      var _dsoData$filter = dsoData.filter(function (dso) {
        return dso.id === applicationData.dsoId;
      }),
          _dso = _dsoData$filter[0];

      var _vehicleNoList = _dso === null || _dso === void 0 ? void 0 : (_dso$vehicles2 = _dso.vehicles) === null || _dso$vehicles2 === void 0 ? void 0 : _dso$vehicles2.filter(function (vehicle) {
        return vehicle.type === applicationData.vehicleType;
      });

      setVehicleNoList(_vehicleNoList);
    }
  }, [isSuccess, isDsoSuccess]);
  React.useEffect(function () {
    var _actionData$0$comment, _actionData$;

    reassignReason || actionData && actionData[0] && ((_actionData$0$comment = actionData[0].comment) === null || _actionData$0$comment === void 0 ? void 0 : _actionData$0$comment.length) > 0 && ((_actionData$ = actionData[0]) === null || _actionData$ === void 0 ? void 0 : _actionData$.status) === "DSO_REJECTED" ? setFormValve(true) : setFormValve(false);
  }, [reassignReason]);
  React.useEffect(function () {
    setFormValve(rejectionReason ? true : false);
  }, [rejectionReason]);
  React.useEffect(function () {
    setFormValve(declineReason ? true : false);
  }, [declineReason]);
  React.useEffect(function () {
    setFormValve(cancelReason ? true : false);
  }, [cancelReason]);

  function selectDSO(dsoDetails) {
    setDSO(dsoDetails);
  }

  function selectVehicleNo(vehicleNo) {
    setVehicleNo(vehicleNo);
  }

  function selectVehicle(value) {
    setVehicle(value);
    setDefautValue({
      capacity: value === null || value === void 0 ? void 0 : value.capacity,
      wasteCollected: value === null || value === void 0 ? void 0 : value.capacity
    });
  }

  function addCommentToWorkflow(state, workflow, data) {
    workflow.comments = data.comments ? state.code + "~" + data.comments : state.code;
  }

  function submit(data) {
    var workflow = {
      action: action
    };
    if (dso) applicationData.dsoId = dso.id;
    if (vehicleNo && action === "ACCEPT") applicationData.vehicleId = vehicleNo.id;
    if (vehicleNo && action === "DSO_ACCEPT") applicationData.vehicleId = vehicleNo.id;
    if (vehicle && action === "ASSIGN") applicationData.vehicleType = vehicle.code;
    if (data.date) applicationData.possibleServiceDate = new Date("" + data.date).getTime();
    if (data.desluged) applicationData.completedOn = new Date(data.desluged).getTime();
    if (data.wasteCollected) applicationData.wasteCollected = data.wasteCollected;
    if (reassignReason) addCommentToWorkflow(reassignReason, workflow, data);
    if (rejectionReason) addCommentToWorkflow(rejectionReason, workflow, data);
    if (declineReason) addCommentToWorkflow(declineReason, workflow, data);
    if (cancelReason) addCommentToWorkflow(cancelReason, workflow, data);
    submitAction({
      fsm: applicationData,
      workflow: workflow
    });
  }

  React.useEffect(function () {
    var _actionData$0$comment2, _actionData$2, _actionData$0$comment3, _actionData$3, _applicationData$audi;

    switch (action) {
      case "DSO_ACCEPT":
      case "ACCEPT":
        setFormValve(vehicleNo ? true : false);
        return setConfig(configAcceptDso({
          t: t,
          dsoData: dsoData,
          dso: dso,
          vehicle: vehicle,
          vehicleNo: vehicleNo,
          vehicleNoList: vehicleNoList,
          selectVehicleNo: selectVehicleNo,
          action: action
        }));

      case "ASSIGN":
      case "GENERATE_DEMAND":
      case "FSM_GENERATE_DEMAND":
        setFormValve(dso && vehicle ? true : false);
        return setConfig(configAssignDso({
          t: t,
          dsoData: dsoData,
          dso: dso,
          selectDSO: selectDSO,
          vehicleMenu: vehicleMenu,
          vehicle: vehicle,
          selectVehicle: selectVehicle,
          action: action
        }));

      case "REASSIGN":
      case "REASSING":
      case "FSM_REASSING":
        dso && vehicle && (reassignReason || actionData && actionData[0] && ((_actionData$0$comment2 = actionData[0].comment) === null || _actionData$0$comment2 === void 0 ? void 0 : _actionData$0$comment2.length) > 0 && ((_actionData$2 = actionData[0]) === null || _actionData$2 === void 0 ? void 0 : _actionData$2.status) === "DSO_REJECTED") ? setFormValve(true) : setFormValve(false);
        return setConfig(configReassignDSO({
          t: t,
          dsoData: dsoData,
          dso: dso,
          selectDSO: selectDSO,
          vehicleMenu: vehicleMenu,
          vehicle: vehicle,
          selectVehicle: selectVehicle,
          reassignReasonMenu: Reason === null || Reason === void 0 ? void 0 : Reason.ReassignReason,
          reassignReason: reassignReason,
          selectReassignReason: selectReassignReason,
          action: action,
          showReassignReason: actionData && actionData[0] && ((_actionData$0$comment3 = actionData[0].comment) === null || _actionData$0$comment3 === void 0 ? void 0 : _actionData$0$comment3.length) > 0 && ((_actionData$3 = actionData[0]) === null || _actionData$3 === void 0 ? void 0 : _actionData$3.status) === "DSO_REJECTED" ? false : true
        }));

      case "COMPLETE":
      case "COMPLETED":
        setFormValve(true);
        return setConfig(configCompleteApplication({
          t: t,
          vehicle: vehicle,
          applicationCreatedTime: applicationData === null || applicationData === void 0 ? void 0 : (_applicationData$audi = applicationData.auditDetails) === null || _applicationData$audi === void 0 ? void 0 : _applicationData$audi.createdTime,
          action: action
        }));

      case "SUBMIT":
      case "FSM_SUBMIT":
        return history.push("/digit-ui/employee/fsm/modify-application/" + applicationNumber);

      case "DECLINE":
      case "DSO_REJECT":
        setFormValve(declineReason ? true : false);
        return setConfig(configRejectApplication({
          t: t,
          rejectMenu: Reason === null || Reason === void 0 ? void 0 : Reason.DeclineReason,
          setReason: setDeclineReason,
          reason: declineReason,
          action: action
        }));

      case "REJECT":
      case "SENDBACK":
        setFormValve(rejectionReason ? true : false);
        return setConfig(configRejectApplication({
          t: t,
          rejectMenu: Reason === null || Reason === void 0 ? void 0 : Reason.RejectionReason,
          setReason: setRejectionReason,
          reason: rejectionReason,
          action: action
        }));

      case "CANCEL":
        setFormValve(cancelReason ? true : false);
        return setConfig(configRejectApplication({
          t: t,
          rejectMenu: Reason === null || Reason === void 0 ? void 0 : Reason.CancelReason,
          setReason: selectCancelReason,
          reason: cancelReason,
          action: action
        }));

      case "PAY":
      case "ADDITIONAL_PAY_REQUEST":
      case "FSM_PAY":
        return history.push("/digit-ui/employee/payment/collect/FSM.TRIP_CHARGES/" + applicationNumber);

      default:
        console.log("default case");
        break;
    }
  }, [action, isDsoLoading, dso, vehicleMenu, rejectionReason, vehicleNo, vehicleNoList, Reason]);
  return action && config.form && !isDsoLoading && !isReasonLoading && isVehicleDataLoaded ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Modal, {
    headerBarMain: /*#__PURE__*/React__default.createElement(Heading, {
      label: t(config.label.heading)
    }),
    headerBarEnd: /*#__PURE__*/React__default.createElement(CloseBtn, {
      onClick: closeModal
    }),
    actionCancelLabel: t(config.label.cancel),
    actionCancelOnSubmit: closeModal,
    actionSaveLabel: t(config.label.submit),
    actionSaveOnSubmit: function actionSaveOnSubmit() {},
    formId: "modal-action",
    isDisabled: !formValve
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormComposer, {
    config: config.form,
    noBoxShadow: true,
    inline: true,
    childrenAtTheBottom: true,
    onSubmit: submit,
    defaultValues: defaultValues,
    formId: "modal-action"
  })) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
};

var ApplicationDetails$1 = function ApplicationDetails(props) {
  var _workflowDetails$data, _workflowDetails$data2, _workflowDetails$data3, _workflowDetails$data4, _workflowDetails$data5, _workflowDetails$data6, _workflowDetails$data7, _workflowDetails$data8, _workflowDetails$data9, _workflowDetails$data10, _workflowDetails$data11, _workflowDetails$data12, _workflowDetails$data13;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var state = tenantId.split(".")[0];

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();
  var queryClient = reactQuery.useQueryClient();

  var _useParams = reactRouterDom.useParams(),
      applicationNumber = _useParams.id;

  var _useState = React.useState(false),
      displayMenu = _useState[0],
      setDisplayMenu = _useState[1];

  var _useState2 = React.useState(null),
      selectedAction = _useState2[0],
      setSelectedAction = _useState2[1];

  var _useState3 = React.useState({});

  var _useState4 = React.useState(false),
      showModal = _useState4[0],
      setShowModal = _useState4[1];

  var _useState5 = React.useState(null),
      showToast = _useState5[0],
      setShowToast = _useState5[1];

  var DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;

  var _Digit$Hooks$fsm$useA = Digit.Hooks.fsm.useApplicationDetail(t, tenantId, applicationNumber),
      isLoading = _Digit$Hooks$fsm$useA.isLoading,
      applicationDetails = _Digit$Hooks$fsm$useA.data;

  var _Digit$Hooks$fsm$useS = Digit.Hooks.fsm.useSearch(tenantId, {
    applicationNos: applicationNumber
  }, {
    staleTime: Infinity
  }),
      isDataLoading = _Digit$Hooks$fsm$useS.isLoading,
      applicationData = _Digit$Hooks$fsm$useS.data;

  var _Digit$Hooks$fsm$useA2 = Digit.Hooks.fsm.useApplicationActions(tenantId),
      mutate = _Digit$Hooks$fsm$useA2.mutate;

  var workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: (applicationDetails === null || applicationDetails === void 0 ? void 0 : applicationDetails.tenantId) || tenantId,
    id: applicationNumber,
    moduleCode: "FSM",
    role: "FSM_EMPLOYEE",
    serviceData: applicationDetails
  });
  React.useEffect(function () {
    if (showToast) {
      workflowDetails.revalidate();
    }
  }, [showToast]);

  function onActionSelect(action) {
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  React.useEffect(function () {
    switch (selectedAction) {
      case "DSO_ACCEPT":
      case "ACCEPT":
      case "ASSIGN":
      case "GENERATE_DEMAND":
      case "FSM_GENERATE_DEMAND":
      case "REASSIGN":
      case "COMPLETE":
      case "COMPLETED":
      case "CANCEL":
      case "SENDBACK":
      case "DSO_REJECT":
      case "REJECT":
      case "DECLINE":
      case "REASSING":
        return setShowModal(true);

      case "SUBMIT":
      case "FSM_SUBMIT":
        return history.push("/digit-ui/employee/fsm/modify-application/" + applicationNumber);

      case "PAY":
      case "FSM_PAY":
      case "ADDITIONAL_PAY_REQUEST":
        return history.push("/digit-ui/employee/payment/collect/FSM.TRIP_CHARGES/" + applicationNumber);

      default:
        console.log("default case");
        break;
    }
  }, [selectedAction]);

  var closeModal = function closeModal() {
    setSelectedAction(null);
    setShowModal(false);
  };

  var closeToast = function closeToast() {
    setShowToast(null);
  };

  var submitAction = function submitAction(data) {
    mutate(data, {
      onError: function onError(error, variables) {
        setShowToast({
          key: "error",
          action: error
        });
        setTimeout(closeToast, 5000);
      },
      onSuccess: function onSuccess(data, variables) {
        setShowToast({
          key: "success",
          action: selectedAction
        });
        setTimeout(closeToast, 5000);
        queryClient.invalidateQueries("FSM_CITIZEN_SEARCH");
        var inbox = queryClient.getQueryData("FUNCTION_RESET_INBOX");
        inbox === null || inbox === void 0 ? void 0 : inbox.revalidate();
      }
    });
    closeModal();
  };

  var getTimelineCaptions = function getTimelineCaptions(checkpoint) {
    var _checkpoint$comment;

    var __comment = checkpoint === null || checkpoint === void 0 ? void 0 : (_checkpoint$comment = checkpoint.comment) === null || _checkpoint$comment === void 0 ? void 0 : _checkpoint$comment.split("~");

    var reason = __comment ? __comment[0] : null;
    var reason_comment = __comment ? __comment[1] : null;

    if (checkpoint.status === "CREATED") {
      var _checkpoint$auditDeta;

      var caption = {
        date: checkpoint === null || checkpoint === void 0 ? void 0 : (_checkpoint$auditDeta = checkpoint.auditDetails) === null || _checkpoint$auditDeta === void 0 ? void 0 : _checkpoint$auditDeta.created,
        name: checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.assigner,
        mobileNumber: applicationData === null || applicationData === void 0 ? void 0 : applicationData.citizen.mobileNumber,
        source: (applicationData === null || applicationData === void 0 ? void 0 : applicationData.source) || ""
      };
      return /*#__PURE__*/React__default.createElement(TLCaption, {
        data: caption
      });
    } else if (checkpoint.status === "PENDING_APPL_FEE_PAYMENT" || checkpoint.status === "ASSING_DSO" || checkpoint.status === "PENDING_DSO_APPROVAL" || checkpoint.status === "DSO_REJECTED" || checkpoint.status === "CANCELED" || checkpoint.status === "REJECTED") {
      var _checkpoint$auditDeta2;

      var _caption = {
        date: checkpoint === null || checkpoint === void 0 ? void 0 : (_checkpoint$auditDeta2 = checkpoint.auditDetails) === null || _checkpoint$auditDeta2 === void 0 ? void 0 : _checkpoint$auditDeta2.created,
        name: checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.assigner,
        comment: reason ? t("ES_ACTION_REASON_" + reason) : null,
        otherComment: reason_comment ? reason_comment : null
      };
      return /*#__PURE__*/React__default.createElement(TLCaption, {
        data: _caption
      });
    } else if (checkpoint.status === "DSO_INPROGRESS") {
      var _checkpoint$assigner;

      var _caption2 = {
        name: checkpoint === null || checkpoint === void 0 ? void 0 : checkpoint.assigner,
        mobileNumber: checkpoint === null || checkpoint === void 0 ? void 0 : (_checkpoint$assigner = checkpoint.assigner) === null || _checkpoint$assigner === void 0 ? void 0 : _checkpoint$assigner.mobileNumber,
        date: t("CS_FSM_EXPECTED_DATE") + " " + Digit.DateUtils.ConvertTimestampToDate(applicationData === null || applicationData === void 0 ? void 0 : applicationData.possibleServiceDate)
      };
      return /*#__PURE__*/React__default.createElement(TLCaption, {
        data: _caption2
      });
    } else if (checkpoint.status === "COMPLETED") {
      return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Rating, {
        withText: true,
        text: t("ES_FSM_YOU_RATED"),
        currentRating: checkpoint.rating
      }), /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
        to: "/digit-ui/employee/fsm/rate-view/" + applicationNumber
      }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.ActionLinks, null, t("CS_FSM_RATE_VIEW"))));
    }
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, !isLoading ? /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    style: {
      position: "relative"
    }
  }, applicationDetails === null || applicationDetails === void 0 ? void 0 : applicationDetails.applicationDetails.map(function (detail, index) {
    var _detail$values;

    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, index === 0 ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, {
      style: {
        marginBottom: "16px"
      }
    }, t(detail.title)) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSectionHeader, {
      style: {
        marginBottom: "16px",
        marginTop: "32px"
      }
    }, t(detail.title)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, detail === null || detail === void 0 ? void 0 : (_detail$values = detail.values) === null || _detail$values === void 0 ? void 0 : _detail$values.map(function (value, index) {
      var _detail$values2;

      if (value.map === true && value.value !== "N/A") {
        return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
          key: t(value.title),
          label: t(value.title),
          text: /*#__PURE__*/React__default.createElement("img", {
            src: t(value.value),
            alt: ""
          })
        });
      }

      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
        key: t(value.title),
        label: t(value.title),
        text: t(value.value) || "N/A",
        last: index === (detail === null || detail === void 0 ? void 0 : (_detail$values2 = detail.values) === null || _detail$values2 === void 0 ? void 0 : _detail$values2.length) - 1,
        caption: value.caption,
        className: "border-none"
      });
    })));
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.BreakLine, null), ((workflowDetails === null || workflowDetails === void 0 ? void 0 : workflowDetails.isLoading) || isDataLoading) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null), !(workflowDetails !== null && workflowDetails !== void 0 && workflowDetails.isLoading) && !isDataLoading && /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSectionHeader, {
    style: {
      marginBottom: "16px",
      marginTop: "32px"
    }
  }, t("ES_APPLICATION_DETAILS_APPLICATION_TIMELINE")), workflowDetails !== null && workflowDetails !== void 0 && (_workflowDetails$data = workflowDetails.data) !== null && _workflowDetails$data !== void 0 && _workflowDetails$data.timeline && (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data2 = workflowDetails.data) === null || _workflowDetails$data2 === void 0 ? void 0 : (_workflowDetails$data3 = _workflowDetails$data2.timeline) === null || _workflowDetails$data3 === void 0 ? void 0 : _workflowDetails$data3.length) === 1 ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CheckPoint, {
    isCompleted: true,
    label: t("CS_COMMON_" + (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data4 = workflowDetails.data) === null || _workflowDetails$data4 === void 0 ? void 0 : (_workflowDetails$data5 = _workflowDetails$data4.timeline[0]) === null || _workflowDetails$data5 === void 0 ? void 0 : _workflowDetails$data5.status)),
    customChild: getTimelineCaptions(workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data6 = workflowDetails.data) === null || _workflowDetails$data6 === void 0 ? void 0 : _workflowDetails$data6.timeline[0])
  }) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.ConnectingCheckPoints, null, (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data7 = workflowDetails.data) === null || _workflowDetails$data7 === void 0 ? void 0 : _workflowDetails$data7.timeline) && (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data8 = workflowDetails.data) === null || _workflowDetails$data8 === void 0 ? void 0 : _workflowDetails$data8.timeline.map(function (checkpoint, index, arr) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CheckPoint, {
      keyValue: index,
      isCompleted: index === 0,
      label: t("CS_COMMON_FSM_" + checkpoint.status),
      customChild: getTimelineCaptions(checkpoint)
    }));
  }))))), showModal ? /*#__PURE__*/React__default.createElement(ActionModal, {
    t: t,
    action: selectedAction,
    tenantId: tenantId,
    state: state,
    id: applicationNumber,
    closeModal: closeModal,
    submitAction: submitAction,
    actionData: workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data9 = workflowDetails.data) === null || _workflowDetails$data9 === void 0 ? void 0 : _workflowDetails$data9.timeline
  }) : null, showToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: showToast.key === "error" ? true : false,
    label: t(showToast.key === "success" ? "ES_FSM_" + showToast.action + "_UPDATE_SUCCESS" : showToast.action),
    onClose: closeToast
  }), !(workflowDetails !== null && workflowDetails !== void 0 && workflowDetails.isLoading) && (workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data10 = workflowDetails.data) === null || _workflowDetails$data10 === void 0 ? void 0 : (_workflowDetails$data11 = _workflowDetails$data10.nextActions) === null || _workflowDetails$data11 === void 0 ? void 0 : _workflowDetails$data11.length) > 0 && /*#__PURE__*/React__default.createElement(digitUiReactComponents.ActionBar, null, displayMenu && workflowDetails !== null && workflowDetails !== void 0 && (_workflowDetails$data12 = workflowDetails.data) !== null && _workflowDetails$data12 !== void 0 && _workflowDetails$data12.nextActions ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Menu, {
    localeKeyPrefix: "ES_FSM",
    options: workflowDetails === null || workflowDetails === void 0 ? void 0 : (_workflowDetails$data13 = workflowDetails.data) === null || _workflowDetails$data13 === void 0 ? void 0 : _workflowDetails$data13.nextActions.map(function (action) {
      return action.action;
    }),
    t: t,
    onSelect: onActionSelect
  }) : null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("ES_COMMON_TAKE_ACTION"),
    onSubmit: function onSubmit() {
      return setDisplayMenu(!displayMenu);
    }
  }))) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null));
};

var DsoDashboard = function DsoDashboard() {
  var _inbox$statuses$filte3, _inbox$statuses$filte4;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useState = React.useState("-"),
      total = _useState[0],
      setTotal = _useState[1];

  var _useState2 = React.useState(true),
      loader = _useState2[0],
      setLoader = _useState2[1];

  var _useState3 = React.useState(false),
      isDsoLoaded = _useState3[0],
      setIsDsoLoaded = _useState3[1];

  var filters = {
    limit: 10,
    offset: 0,
    uuid: {
      code: "ASSIGNED_TO_ME",
      name: t("ES_INBOX_ASSIGNED_TO_ME")
    },
    sortBy: "createdTime",
    sortOrder: "DESC",
    total: true
  };

  var _Digit$Hooks$fsm$useV = Digit.Hooks.fsm.useVendorDetail(),
      vendorDetails = _Digit$Hooks$fsm$useV.data;

  React.useEffect(function () {
    if (vendorDetails !== null && vendorDetails !== void 0 && vendorDetails.vendor) {
      var vendor = vendorDetails.vendor;
      Digit.UserService.setExtraRoleDetails(vendor[0]);
      setIsDsoLoaded(true);
    }
  }, [vendorDetails]);

  var _Digit$Hooks$fsm$useI = Digit.Hooks.fsm.useInbox(tenantId, _extends({}, filters), {
    enabled: isDsoLoaded
  }, true),
      inbox = _Digit$Hooks$fsm$useI.data;

  var info = React.useMemo(function () {
    var _inbox$statuses$filte, _inbox$statuses$filte2, _ref;

    return _ref = {}, _ref[t("ES_COMPLETION_PENDING")] = (inbox === null || inbox === void 0 ? void 0 : (_inbox$statuses$filte = inbox.statuses.filter(function (e) {
      return e.applicationstatus === "DSO_INPROGRESS";
    })[0]) === null || _inbox$statuses$filte === void 0 ? void 0 : _inbox$statuses$filte.count) || 0, _ref[t("ES_VEHICLE_ASSIGNMENT_PENDING")] = (inbox === null || inbox === void 0 ? void 0 : (_inbox$statuses$filte2 = inbox.statuses.filter(function (e) {
      return e.applicationstatus === "PENDING_DSO_APPROVAL";
    })[0]) === null || _inbox$statuses$filte2 === void 0 ? void 0 : _inbox$statuses$filte2.count) || 0, _ref;
  }, [inbox === null || inbox === void 0 ? void 0 : inbox.totalCount]);
  var links = React.useMemo(function () {
    return [{
      link: "/digit-ui/citizen/fsm/inbox",
      label: t("ES_TITLE_INBOX"),
      count: total
    }];
  }, [total]);
  React.useEffect(function () {
    if (inbox) {
      var _total = (inbox === null || inbox === void 0 ? void 0 : inbox.totalCount) || 0;

      setTotal(_total);
      if (Object.keys(info).length) setLoader(false);
    }
  }, [info, inbox]);

  if (loader) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  var propsForModuleCard = {
    Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.ShippingTruck, null),
    moduleName: t("ES_TITLE_FAECAL_SLUDGE_MGMT"),
    kpis: [{
      count: (inbox === null || inbox === void 0 ? void 0 : (_inbox$statuses$filte3 = inbox.statuses.filter(function (e) {
        return e.applicationstatus === "DSO_INPROGRESS";
      })[0]) === null || _inbox$statuses$filte3 === void 0 ? void 0 : _inbox$statuses$filte3.count) || 0,
      label: t("ES_COMPLETION_PENDING"),
      link: "/digit-ui/citizen/fsm/inbox"
    }, {
      count: (inbox === null || inbox === void 0 ? void 0 : (_inbox$statuses$filte4 = inbox.statuses.filter(function (e) {
        return e.applicationstatus === "PENDING_DSO_APPROVAL";
      })[0]) === null || _inbox$statuses$filte4 === void 0 ? void 0 : _inbox$statuses$filte4.count) || 0,
      label: t("ES_VEHICLE_ASSIGNMENT_PENDING"),
      link: "/digit-ui/citizen/fsm/inbox"
    }],
    links: links
  };
  return /*#__PURE__*/React__default.createElement("div", {
    className: "ground-container moduleCardWrapper"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.EmployeeModuleCard, propsForModuleCard));
};

var isConventionalSpecticTank$1 = function isConventionalSpecticTank(tankDimension) {
  return tankDimension === "lbd";
};

var EditForm = function EditForm(_ref) {
  var tenantId = _ref.tenantId,
      applicationData = _ref.applicationData,
      channelMenu = _ref.channelMenu,
      vehicleMenu = _ref.vehicleMenu,
      sanitationMenu = _ref.sanitationMenu;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();

  var _useState = React.useState(false),
      canSubmit = _useState[0],
      setSubmitValve = _useState[1];

  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "CommonFieldsConfig"),
      commonFields = _Digit$Hooks$fsm$useM.data,
      isLoading = _Digit$Hooks$fsm$useM.isLoading;

  var _Digit$Hooks$fsm$useM2 = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PreFieldsConfig"),
      preFields = _Digit$Hooks$fsm$useM2.data,
      isApplicantConfigLoading = _Digit$Hooks$fsm$useM2.isLoading;

  var _Digit$Hooks$fsm$useM3 = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PostFieldsConfig"),
      postFields = _Digit$Hooks$fsm$useM3.data,
      isTripConfigLoading = _Digit$Hooks$fsm$useM3.isLoading;

  var defaultValues = {
    channel: channelMenu.filter(function (channel) {
      return channel.code === applicationData.source;
    })[0],
    applicationData: {
      applicantName: applicationData.citizen.name,
      mobileNumber: applicationData.citizen.mobileNumber
    },
    tripData: {
      noOfTrips: applicationData.noOfTrips,
      amountPerTrip: applicationData.additionalDetails.tripAmount,
      amount: applicationData.noOfTrips * applicationData.additionalDetails.tripAmount || undefined,
      vehicleType: vehicleMenu.filter(function (vehicle) {
        return (vehicle === null || vehicle === void 0 ? void 0 : vehicle.code) === (applicationData === null || applicationData === void 0 ? void 0 : applicationData.vehicleType);
      }).map(function (vehicle) {
        return _extends({}, vehicle, {
          label: getVehicleType(vehicle, t)
        });
      })[0]
    },
    propertyType: applicationData.propertyUsage.split(".")[0],
    subtype: applicationData.propertyUsage,
    address: {
      pincode: applicationData.address.pincode,
      locality: _extends({}, applicationData.address.locality, {
        i18nkey: applicationData.tenantId.toUpperCase().split(".").join("_") + "_REVENUE_" + applicationData.address.locality.code
      }),
      slum: applicationData.address.slumName,
      street: applicationData.address.street,
      doorNo: applicationData.address.doorNo,
      landmark: applicationData.address.landmark
    },
    pitType: sanitationMenu.filter(function (type) {
      return type.code === applicationData.sanitationtype;
    })[0],
    pitDetail: applicationData.pitDetail
  };

  var onFormValueChange = function onFormValueChange(setValue, formData) {
    var _formData$address, _formData$address$loc, _formData$tripData, _formData$tripData2;

    if (formData !== null && formData !== void 0 && formData.propertyType && formData !== null && formData !== void 0 && formData.subtype && formData !== null && formData !== void 0 && (_formData$address = formData.address) !== null && _formData$address !== void 0 && (_formData$address$loc = _formData$address.locality) !== null && _formData$address$loc !== void 0 && _formData$address$loc.code && formData !== null && formData !== void 0 && (_formData$tripData = formData.tripData) !== null && _formData$tripData !== void 0 && _formData$tripData.vehicleType && formData !== null && formData !== void 0 && (_formData$tripData2 = formData.tripData) !== null && _formData$tripData2 !== void 0 && _formData$tripData2.amountPerTrip) {
      setSubmitValve(true);
      var pitDetailValues = formData !== null && formData !== void 0 && formData.pitDetail ? Object.values(formData === null || formData === void 0 ? void 0 : formData.pitDetail).filter(function (value) {
        return value > 0;
      }) : null;

      if (formData !== null && formData !== void 0 && formData.pitType) {
        var _formData$pitType, _formData$pitType2;

        if (pitDetailValues === null || (pitDetailValues === null || pitDetailValues === void 0 ? void 0 : pitDetailValues.length) === 0) {
          setSubmitValve(true);
        } else if (isConventionalSpecticTank$1(formData === null || formData === void 0 ? void 0 : (_formData$pitType = formData.pitType) === null || _formData$pitType === void 0 ? void 0 : _formData$pitType.dimension) && (pitDetailValues === null || pitDetailValues === void 0 ? void 0 : pitDetailValues.length) >= 3) {
          setSubmitValve(true);
        } else if (!isConventionalSpecticTank$1(formData === null || formData === void 0 ? void 0 : (_formData$pitType2 = formData.pitType) === null || _formData$pitType2 === void 0 ? void 0 : _formData$pitType2.dimension) && (pitDetailValues === null || pitDetailValues === void 0 ? void 0 : pitDetailValues.length) >= 2) {
          setSubmitValve(true);
        } else setSubmitValve(false);
      }
    } else {
      setSubmitValve(false);
    }
  };

  var onSubmit = function onSubmit(data) {
    var _data$pitType, _data$address, _data$address2, _data$address2$street, _data$address3, _data$address3$doorNo, _data$address4, _data$address5, _data$address5$landma, _data$address6, _data$address6$city, _data$address8, _data$address8$locali, _data$address9, _data$address9$locali, _data$address10, _data$address11, _data$address12, _data$address13;

    var applicationChannel = data.channel;
    var sanitationtype = data === null || data === void 0 ? void 0 : (_data$pitType = data.pitType) === null || _data$pitType === void 0 ? void 0 : _data$pitType.code;
    var pitDimension = data === null || data === void 0 ? void 0 : data.pitDetail;
    var pincode = data === null || data === void 0 ? void 0 : (_data$address = data.address) === null || _data$address === void 0 ? void 0 : _data$address.pincode;
    var street = data === null || data === void 0 ? void 0 : (_data$address2 = data.address) === null || _data$address2 === void 0 ? void 0 : (_data$address2$street = _data$address2.street) === null || _data$address2$street === void 0 ? void 0 : _data$address2$street.trim();
    var doorNo = data === null || data === void 0 ? void 0 : (_data$address3 = data.address) === null || _data$address3 === void 0 ? void 0 : (_data$address3$doorNo = _data$address3.doorNo) === null || _data$address3$doorNo === void 0 ? void 0 : _data$address3$doorNo.trim();
    var slum = data === null || data === void 0 ? void 0 : (_data$address4 = data.address) === null || _data$address4 === void 0 ? void 0 : _data$address4.slum;
    var landmark = data === null || data === void 0 ? void 0 : (_data$address5 = data.address) === null || _data$address5 === void 0 ? void 0 : (_data$address5$landma = _data$address5.landmark) === null || _data$address5$landma === void 0 ? void 0 : _data$address5$landma.trim();
    var noOfTrips = data.tripData.noOfTrips;
    var amount = data.tripData.amountPerTrip;
    var cityCode = data === null || data === void 0 ? void 0 : (_data$address6 = data.address) === null || _data$address6 === void 0 ? void 0 : (_data$address6$city = _data$address6.city) === null || _data$address6$city === void 0 ? void 0 : _data$address6$city.code;
    var localityCode = data === null || data === void 0 ? void 0 : (_data$address8 = data.address) === null || _data$address8 === void 0 ? void 0 : (_data$address8$locali = _data$address8.locality) === null || _data$address8$locali === void 0 ? void 0 : _data$address8$locali.code;
    var localityName = data === null || data === void 0 ? void 0 : (_data$address9 = data.address) === null || _data$address9 === void 0 ? void 0 : (_data$address9$locali = _data$address9.locality) === null || _data$address9$locali === void 0 ? void 0 : _data$address9$locali.name;
    var propertyUsage = data === null || data === void 0 ? void 0 : data.subtype;
    var height = pitDimension.height,
        length = pitDimension.length,
        width = pitDimension.width,
        diameter = pitDimension.diameter;

    var formData = _extends({}, applicationData, {
      sanitationtype: sanitationtype,
      source: applicationChannel.code,
      additionalDetails: _extends({}, applicationData.additionalDetails, {
        tripAmount: amount
      }),
      propertyUsage: propertyUsage,
      vehicleType: data.tripData.vehicleType.code,
      noOfTrips: noOfTrips,
      pitDetail: _extends({}, applicationData.pitDetail, {
        distanceFromRoad: data.distanceFromRoad,
        height: height,
        length: length,
        width: width,
        diameter: diameter
      }),
      address: _extends({}, applicationData.address, {
        tenantId: cityCode,
        landmark: landmark,
        doorNo: doorNo,
        street: street,
        pincode: pincode,
        slumName: slum,
        locality: _extends({}, applicationData.address.locality, {
          code: localityCode,
          name: localityName
        }),
        geoLocation: _extends({}, applicationData.address.geoLocation, {
          latitude: data !== null && data !== void 0 && (_data$address10 = data.address) !== null && _data$address10 !== void 0 && _data$address10.latitude ? data === null || data === void 0 ? void 0 : (_data$address11 = data.address) === null || _data$address11 === void 0 ? void 0 : _data$address11.latitude : applicationData.address.geoLocation.latitude,
          longitude: data !== null && data !== void 0 && (_data$address12 = data.address) !== null && _data$address12 !== void 0 && _data$address12.longitude ? data === null || data === void 0 ? void 0 : (_data$address13 = data.address) === null || _data$address13 === void 0 ? void 0 : _data$address13.longitude : applicationData.address.geoLocation.longitude
        })
      })
    });

    delete formData["responseInfo"];
    window.Digit.SessionStorage.set("propertyType", null);
    window.Digit.SessionStorage.set("subType", null);
    Digit.SessionStorage.set("city_property", null);
    Digit.SessionStorage.set("selected_localities", null);
    Digit.SessionStorage.set("locality_property", null);
    history.replace("/digit-ui/employee/fsm/response", {
      applicationData: formData,
      key: "update",
      action: "SUBMIT"
    });
  };

  if (isLoading || isTripConfigLoading || isApplicantConfigLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  var configs = [].concat(preFields, commonFields, postFields);
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormComposer, {
    heading: t("ES_TITLE_MODIFY_DESULDGING_APPLICATION"),
    isDisabled: !canSubmit,
    label: t("ES_FSM_APPLICATION_UPDATE"),
    config: configs.map(function (config) {
      return _extends({}, config, {
        body: config.body.filter(function (a) {
          return !a.hideInEmployee;
        })
      });
    }),
    fieldStyle: {
      marginRight: 0
    },
    onSubmit: onSubmit,
    defaultValues: defaultValues,
    onFormValueChange: onFormValueChange
  });
};

var EditApplication = function EditApplication(_ref) {
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var state = (tenantId === null || tenantId === void 0 ? void 0 : tenantId.split(".")[0]) || "pb";

  var _useParams = reactRouterDom.useParams(),
      applicationNumber = _useParams.id;

  var userInfo = Digit.UserService.getUser();

  var _Digit$Hooks$fsm$useS = Digit.Hooks.fsm.useSearch(tenantId, {
    applicationNos: applicationNumber,
    uuid: userInfo.uuid
  }, {
    staleTime: Infinity
  }),
      applicationLoading = _Digit$Hooks$fsm$useS.isLoading,
      applicationData = _Digit$Hooks$fsm$useS.data;

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(state, "Vehicle", "VehicleType", {
    staleTime: Infinity
  }),
      isVehicleMenuLoading = _Digit$Hooks$fsm$useM.isLoading,
      vehicleMenu = _Digit$Hooks$fsm$useM.data;

  var _Digit$Hooks$fsm$useM2 = Digit.Hooks.fsm.useMDMS(tenantId, "FSM", "ApplicationChannel"),
      isChannelMenuLoading = _Digit$Hooks$fsm$useM2.isLoading,
      channelMenu = _Digit$Hooks$fsm$useM2.data;

  var _Digit$Hooks$fsm$useM3 = Digit.Hooks.fsm.useMDMS(state, "FSM", "PitType"),
      sanitationMenu = _Digit$Hooks$fsm$useM3.data,
      sanitationTypeloading = _Digit$Hooks$fsm$useM3.isLoading;

  return applicationData && !applicationLoading && vehicleMenu && !isVehicleMenuLoading && channelMenu && !isChannelMenuLoading && !sanitationTypeloading && sanitationMenu ? /*#__PURE__*/React__default.createElement(EditForm, {
    applicationData: applicationData,
    vehicleMenu: vehicleMenu,
    channelMenu: channelMenu,
    sanitationMenu: sanitationMenu,
    tenantId: tenantId
  }) : null;
};

var FSMLink = function FSMLink(_ref) {
  var parentRoute = _ref.parentRoute;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var allLinks = [{
    text: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
    link: "/digit-ui/employee/fsm/new-application",
    accessTo: ["FSM_CREATOR_EMP"]
  }, {
    text: t("ES_TITILE_SEARCH_APPLICATION"),
    link: parentRoute + "/search"
  }];

  var _useState = React.useState([]),
      links = _useState[0],
      setLinks = _useState[1];

  var roles = Digit.UserService.getUser().info.roles;

  var hasAccess = function hasAccess(accessTo) {
    return roles.filter(function (role) {
      return accessTo.includes(role.code);
    }).length;
  };

  React.useEffect(function () {
    var linksToShow = [];
    allLinks.forEach(function (link) {
      if (link.accessTo) {
        if (hasAccess(link.accessTo)) {
          linksToShow.push(link);
        }
      } else {
        linksToShow.push(link);
      }
    });
    setLinks(linksToShow);
  }, []);

  var GetLogo = function GetLogo() {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "header"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "logo"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.ShippingTruck, null)), " ", /*#__PURE__*/React__default.createElement("span", {
      className: "text"
    }, t("ES_TITLE_FAECAL_SLUDGE_MGMT")));
  };

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    style: {
      paddingRight: 0,
      marginTop: 0
    },
    className: "employeeCard filter"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "complaint-links-container"
  }, GetLogo(), /*#__PURE__*/React__default.createElement("div", {
    className: "body"
  }, links.map(function (_ref2, index) {
    var link = _ref2.link,
        text = _ref2.text,
        _ref2$hyperlink = _ref2.hyperlink,
        hyperlink = _ref2$hyperlink === void 0 ? false : _ref2$hyperlink;
    return /*#__PURE__*/React__default.createElement("span", {
      className: "link",
      key: index
    }, hyperlink ? /*#__PURE__*/React__default.createElement("a", {
      href: link
    }, text) : /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: link
    }, text));
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
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Table, {
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

var StatusCount = function StatusCount(_ref) {
  var _statusMap$filter, _statusMap$filter$;

  var status = _ref.status,
      fsmfilters = _ref.fsmfilters,
      onAssignmentChange = _ref.onAssignmentChange,
      statusMap = _ref.statusMap;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var count = statusMap === null || statusMap === void 0 ? void 0 : (_statusMap$filter = statusMap.filter(function (e) {
    return (e === null || e === void 0 ? void 0 : e.applicationstatus) === status.code;
  })) === null || _statusMap$filter === void 0 ? void 0 : (_statusMap$filter$ = _statusMap$filter[0]) === null || _statusMap$filter$ === void 0 ? void 0 : _statusMap$filter$.count;
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.CheckBox, {
    onChange: function onChange(e) {
      return onAssignmentChange(e, status);
    },
    checked: (fsmfilters === null || fsmfilters === void 0 ? void 0 : fsmfilters.applicationStatus.filter(function (e) {
      return e.name === status.name;
    }).length) !== 0 ? true : false,
    label: t(status.name) + " (" + (count || 0) + ")"
  });
};

var Status = function Status(_ref) {
  var onAssignmentChange = _ref.onAssignmentChange,
      fsmfilters = _ref.fsmfilters,
      mergedRoleDetails = _ref.mergedRoleDetails,
      statusMap = _ref.statusMap;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _Digit$Hooks$fsm$useA = Digit.Hooks.fsm.useApplicationStatus(true, true, statusMap),
      applicationsWithCount = _Digit$Hooks$fsm$useA.data,
      isLoading = _Digit$Hooks$fsm$useA.isLoading;

  var _useState = React.useState(false),
      moreStatus = _useState[0],
      showMoreStatus = _useState[1];

  var finalApplicationWithCount = mergedRoleDetails.statuses.map(function (roleDetails) {
    return applicationsWithCount === null || applicationsWithCount === void 0 ? void 0 : applicationsWithCount.filter(function (application) {
      return application.code === roleDetails;
    })[0];
  }).filter(function (status) {
    return status === null || status === void 0 ? void 0 : status.code;
  });
  var moreApplicationWithCount = applicationsWithCount === null || applicationsWithCount === void 0 ? void 0 : applicationsWithCount.filter(function (application) {
    return !finalApplicationWithCount.find(function (listedApplication) {
      return listedApplication.code === application.code;
    });
  });

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return (finalApplicationWithCount === null || finalApplicationWithCount === void 0 ? void 0 : finalApplicationWithCount.length) > 0 ? /*#__PURE__*/React__default.createElement("div", {
    className: "status-container"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-label"
  }, t("ES_INBOX_STATUS")), finalApplicationWithCount === null || finalApplicationWithCount === void 0 ? void 0 : finalApplicationWithCount.map(function (option, index) {
    return /*#__PURE__*/React__default.createElement(StatusCount, {
      key: index,
      onAssignmentChange: onAssignmentChange,
      status: option,
      fsmfilters: fsmfilters,
      statusMap: statusMap
    });
  }), moreStatus ? moreApplicationWithCount === null || moreApplicationWithCount === void 0 ? void 0 : moreApplicationWithCount.map(function (option, index) {
    return /*#__PURE__*/React__default.createElement(StatusCount, {
      key: index,
      onAssignmentChange: onAssignmentChange,
      status: option,
      fsmfilters: fsmfilters,
      statusMap: statusMap
    });
  }) : null, mergedRoleDetails.fixed === false ? /*#__PURE__*/React__default.createElement("div", {
    className: "filter-button",
    onClick: function onClick() {
      return showMoreStatus(!moreStatus);
    }
  }, " ", moreStatus ? t("ES_COMMON_LESS") : t("ES_COMMON_MORE"), " ") : null) : null;
};

var AssignedTo = function AssignedTo(_ref) {
  var onFilterChange = _ref.onFilterChange,
      searchParams = _ref.searchParams,
      paginationParms = _ref.paginationParms,
      tenantId = _ref.tenantId,
      t = _ref.t;

  var _Digit$Hooks$fsm$useI = Digit.Hooks.fsm.useInbox(tenantId, _extends({}, searchParams, paginationParms, {
    fromDate: searchParams !== null && searchParams !== void 0 && searchParams.fromDate ? new Date(searchParams === null || searchParams === void 0 ? void 0 : searchParams.fromDate).getTime() : undefined,
    toDate: searchParams !== null && searchParams !== void 0 && searchParams.toDate ? new Date(searchParams === null || searchParams === void 0 ? void 0 : searchParams.toDate).getTime() : undefined,
    total: true,
    uuid: {
      code: "ASSIGNED_TO_ALL",
      name: t("ES_INBOX_ASSIGNED_TO_ALL")
    }
  })),
      AssignedToAll = _Digit$Hooks$fsm$useI.data;

  var availableOptions = [{
    code: "ASSIGNED_TO_ME",
    name: t("ES_INBOX_ASSIGNED_TO_ME") + " (0)"
  }, {
    code: "ASSIGNED_TO_ALL",
    name: t("ES_INBOX_ASSIGNED_TO_ALL") + " (" + ((AssignedToAll === null || AssignedToAll === void 0 ? void 0 : AssignedToAll.totalCount) || 0) + ")"
  }];
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioButtons, {
    onSelect: function onSelect(d) {
      return onFilterChange({
        uuid: {
          code: d.code
        }
      });
    },
    selectedOption: availableOptions.filter(function (option) {
      var _searchParams$uuid;

      return option.code === (searchParams === null || searchParams === void 0 ? void 0 : (_searchParams$uuid = searchParams.uuid) === null || _searchParams$uuid === void 0 ? void 0 : _searchParams$uuid.code);
    })[0],
    optionsKey: "name",
    options: availableOptions
  }));
};

var Filter = function Filter(_ref) {
  var _mergedRoleDetails$st, _mergedRoleDetails$st2, _props$applications;

  var searchParams = _ref.searchParams,
      paginationParms = _ref.paginationParms,
      onFilterChange = _ref.onFilterChange,
      onSearch = _ref.onSearch,
      props = _objectWithoutPropertiesLoose(_ref, ["searchParams", "paginationParms", "onFilterChange", "onSearch", "removeParam"]);

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  var isFstpOperator = Digit.UserService.hasAccess("FSTP") || false;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var state = tenantId.split(".")[0];

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(state, "DIGIT-UI", "RoleStatusMapping"),
      roleStatuses = _Digit$Hooks$fsm$useM.data,
      isRoleStatusFetched = _Digit$Hooks$fsm$useM.isFetched;

  var userInfo = Digit.UserService.getUser();
  var userRoles = userInfo.info.roles.map(function (roleData) {
    return roleData.code;
  });
  var userRoleDetails = roleStatuses === null || roleStatuses === void 0 ? void 0 : roleStatuses.filter(function (roleDetails) {
    return userRoles.filter(function (role) {
      return role === roleDetails.userRole;
    })[0];
  });
  var mergedRoleDetails = userRoleDetails === null || userRoleDetails === void 0 ? void 0 : userRoleDetails.reduce(function (merged, details) {
    return {
      fixed: (details === null || details === void 0 ? void 0 : details.fixed) && (merged === null || merged === void 0 ? void 0 : merged.fixed),
      statuses: [].concat(merged === null || merged === void 0 ? void 0 : merged.statuses, details === null || details === void 0 ? void 0 : details.statuses).filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      }),
      zeroCheck: (details === null || details === void 0 ? void 0 : details.zeroCheck) || (merged === null || merged === void 0 ? void 0 : merged.zeroCheck)
    };
  }, {
    statuses: []
  });

  var selectLocality = function selectLocality(d) {
    onFilterChange({
      locality: [].concat(searchParams === null || searchParams === void 0 ? void 0 : searchParams.locality, [d])
    });
  };

  var onStatusChange = function onStatusChange(e, type) {
    if (e.target.checked) onFilterChange({
      applicationStatus: [].concat(searchParams === null || searchParams === void 0 ? void 0 : searchParams.applicationStatus, [type])
    });else onFilterChange({
      applicationStatus: searchParams === null || searchParams === void 0 ? void 0 : searchParams.applicationStatus.filter(function (option) {
        return type.name !== option.name;
      })
    });
  };

  var clearAll = function clearAll() {
    var _props$onClose;

    onFilterChange({
      applicationStatus: [],
      locality: [],
      uuid: {
        code: "ASSIGNED_TO_ME",
        name: "Assigned to Me"
      }
    });
    props === null || props === void 0 ? void 0 : (_props$onClose = props.onClose) === null || _props$onClose === void 0 ? void 0 : _props$onClose.call(props);
  };

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, (!DSO && !isFstpOperator && searchParams || (mergedRoleDetails === null || mergedRoleDetails === void 0 ? void 0 : (_mergedRoleDetails$st = mergedRoleDetails.statuses) === null || _mergedRoleDetails$st === void 0 ? void 0 : _mergedRoleDetails$st.length) > 0) && /*#__PURE__*/React__default.createElement("div", {
    className: "filter",
    style: {
      marginTop: isFstpOperator ? "-0px" : "revert"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-card"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "heading"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-label"
  }, t("ES_COMMON_FILTER_BY"), ":"), /*#__PURE__*/React__default.createElement("div", {
    className: "clearAll",
    onClick: clearAll
  }, t("ES_COMMON_CLEAR_ALL")), props.type === "desktop" && /*#__PURE__*/React__default.createElement("span", {
    className: "clear-search",
    onClick: clearAll
  }, t("ES_COMMON_CLEAR_ALL")), props.type === "mobile" && /*#__PURE__*/React__default.createElement("span", {
    onClick: props.onClose
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CloseSvg, null))), /*#__PURE__*/React__default.createElement("div", null, !DSO && !isFstpOperator && searchParams && /*#__PURE__*/React__default.createElement(AssignedTo, {
    onFilterChange: onFilterChange,
    searchParams: searchParams,
    paginationParms: paginationParms,
    tenantId: tenantId,
    t: t
  }), /*#__PURE__*/React__default.createElement("div", null)), (mergedRoleDetails === null || mergedRoleDetails === void 0 ? void 0 : (_mergedRoleDetails$st2 = mergedRoleDetails.statuses) === null || _mergedRoleDetails$st2 === void 0 ? void 0 : _mergedRoleDetails$st2.length) > 0 ? /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-label"
  }, t("ES_INBOX_LOCALITY")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Localities, {
    selectLocality: selectLocality,
    tenantId: tenantId,
    boundaryType: "revenue"
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "tag-container"
  }, searchParams === null || searchParams === void 0 ? void 0 : searchParams.locality.map(function (locality, index) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.RemoveableTag, {
      key: index,
      text: locality.i18nkey,
      onClick: function onClick() {
        onFilterChange({
          locality: searchParams === null || searchParams === void 0 ? void 0 : searchParams.locality.filter(function (loc) {
            return loc.code !== locality.code;
          })
        });
      }
    });
  }))) : null, /*#__PURE__*/React__default.createElement("div", null, isRoleStatusFetched && mergedRoleDetails ? /*#__PURE__*/React__default.createElement(Status, {
    onAssignmentChange: onStatusChange,
    fsmfilters: searchParams,
    mergedRoleDetails: mergedRoleDetails,
    statusMap: props === null || props === void 0 ? void 0 : (_props$applications = props.applications) === null || _props$applications === void 0 ? void 0 : _props$applications.statuses
  }) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null)))), props.type === "mobile" && /*#__PURE__*/React__default.createElement(digitUiReactComponents.ActionBar, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.ApplyFilterBar, {
    submit: false,
    labelLink: t("ES_COMMON_CLEAR_ALL"),
    buttonLink: t("ES_COMMON_FILTER"),
    onClear: clearAll,
    onSubmit: function onSubmit() {
      if (props.type === "mobile") onSearch({
        delete: ["applicationNos"]
      });else onSearch();
    },
    style: {
      flex: 1
    }
  })));
};

var DropdownStatus = function DropdownStatus(_ref) {
  var onAssignmentChange = _ref.onAssignmentChange,
      value = _ref.value,
      applicationStatuses = _ref.applicationStatuses,
      areApplicationStatus = _ref.areApplicationStatus;
  return areApplicationStatus ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    option: applicationStatuses,
    optionKey: "name",
    selected: value,
    select: onAssignmentChange
  }) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
};

var SearchApplication = function SearchApplication(_ref) {
  var onSearch = _ref.onSearch,
      type = _ref.type,
      onClose = _ref.onClose,
      searchFields = _ref.searchFields,
      searchParams = _ref.searchParams,
      isInboxPage = _ref.isInboxPage;
  var storedSearchParams = isInboxPage ? Digit.SessionStorage.get("fsm/inbox/searchParams") : Digit.SessionStorage.get("fsm/search/searchParams");

  var _Digit$Hooks$fsm$useA = Digit.Hooks.fsm.useApplicationStatus(),
      applicationStatuses = _Digit$Hooks$fsm$useA.data,
      areApplicationStatus = _Digit$Hooks$fsm$useA.isFetched;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useForm = reactHookForm.useForm({
    defaultValues: storedSearchParams || searchParams
  }),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      reset = _useForm.reset,
      watch = _useForm.watch,
      control = _useForm.control;

  var _useState = React.useState(false),
      error = _useState[0],
      setError = _useState[1];

  var mobileView = innerWidth <= 640;
  var FSTP = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;
  var watchSearch = watch(["applicationNos", "mobileNumber"]);

  var onSubmitInput = function onSubmitInput(data) {
    if (!data.mobileNumber) {
      delete data.mobileNumber;
    }

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

    if (isInboxPage) {
      Digit.SessionStorage.del("fsm/inbox/searchParams");
    } else {
      Digit.SessionStorage.del("fsm/search/searchParams");
    }

    onSearch({});
  }

  var clearAll = function clearAll(mobileView) {
    var mobileViewStyles = mobileView ? {
      margin: 0
    } : {};
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkLabel, {
      style: _extends({
        display: "inline"
      }, mobileViewStyles),
      onClick: clearSearch
    }, t("ES_COMMON_CLEAR_SEARCH"));
  };

  var searchValidation = function searchValidation(data) {
    if (FSTP) return null;
    watchSearch.applicationNos || watchSearch.mobileNumber ? setError(false) : setError(true);
    return watchSearch.applicationNos || watchSearch.mobileNumber ? true : false;
  };

  var getFields = function getFields(input) {
    switch (input.type) {
      case "date":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement(digitUiReactComponents.DatePicker, {
              date: props.value,
              onChange: props.onChange
            });
          },
          name: input.name,
          control: control,
          defaultValue: null
        });

      case "status":
        return /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
          render: function render(props) {
            return /*#__PURE__*/React__default.createElement(DropdownStatus, {
              onAssignmentChange: props.onChange,
              value: props.value,
              applicationStatuses: applicationStatuses,
              areApplicationStatus: areApplicationStatus
            });
          },
          name: input.name,
          control: control,
          defaultValue: null
        });

      default:
        return /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({}, input, {
          inputRef: register
        }, register(input.name, {
          validate: searchValidation
        }), {
          watch: watch,
          shouldUpdate: true
        }));
    }
  };

  return /*#__PURE__*/React__default.createElement("form", {
    onSubmit: handleSubmit(onSubmitInput)
  }, /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "search-container",
    style: {
      width: "auto",
      marginLeft: FSTP ? "" : isInboxPage ? "24px" : "revert"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "search-complaint-container"
  }, (type === "mobile" || mobileView) && /*#__PURE__*/React__default.createElement("div", {
    className: "complaint-header"
  }, /*#__PURE__*/React__default.createElement("h2", null, t("ES_COMMON_SEARCH_BY")), /*#__PURE__*/React__default.createElement("span", {
    onClick: onClose
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CloseSvg, null))), /*#__PURE__*/React__default.createElement("div", {
    className: "complaint-input-container",
    style: {
      width: "100%"
    }
  }, searchFields === null || searchFields === void 0 ? void 0 : searchFields.map(function (input, index) {
    return /*#__PURE__*/React__default.createElement("span", {
      key: index,
      className: index === 0 ? "complaint-input" : "mobile-input"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Label, null, input.label), getFields(input), " ");
  }), type === "desktop" && !mobileView && /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    className: "submit-bar-search",
    label: t("ES_COMMON_SEARCH"),
    submit: true
  })), error ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, {
    className: "search-error-label"
  }, t("ES_SEARCH_APPLICATION_ERROR")) : null, type === "desktop" && !mobileView && /*#__PURE__*/React__default.createElement("span", {
    className: "clear-search"
  }, clearAll()))), (type === "mobile" || mobileView) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.ActionBar, {
    className: "clear-search-container"
  }, /*#__PURE__*/React__default.createElement("button", {
    className: "clear-search",
    style: {
      flex: 1
    }
  }, clearAll(mobileView)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("ES_COMMON_SEARCH"),
    style: {
      flex: 1
    },
    submit: true
  }))));
};

var DesktopInbox = function DesktopInbox(props) {
  var _props$data, _props$data$table, _props$data2, _props$data2$table;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;

  var GetCell = function GetCell(value) {
    return /*#__PURE__*/React__default.createElement("span", {
      className: "cell-text"
    }, value);
  };

  var FSTP = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;

  var GetSlaCell = function GetSlaCell(value) {
    if (isNaN(value)) return /*#__PURE__*/React__default.createElement("span", {
      className: "sla-cell-success"
    }, "0");
    return value < 0 ? /*#__PURE__*/React__default.createElement("span", {
      className: "sla-cell-error"
    }, value) : /*#__PURE__*/React__default.createElement("span", {
      className: "sla-cell-success"
    }, value);
  };

  var columns = React__default.useMemo(function () {
    if (props.isSearch) {
      return [{
        Header: t("ES_INBOX_APPLICATION_NO"),
        accessor: "applicationNo",
        disableSortBy: true,
        Cell: function Cell(_ref) {
          var row = _ref.row;
          return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", {
            className: "link"
          }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
            to: props.parentRoute + "/" + (DSO ? "dso-application-details" : "application-details") + "/" + row.original["applicationNo"]
          }, row.original["applicationNo"])));
        }
      }, {
        Header: t("ES_APPLICATION_DETAILS_APPLICANT_NAME"),
        disableSortBy: true,
        accessor: function accessor(row) {
          var _row$citizen;

          return GetCell(((_row$citizen = row.citizen) === null || _row$citizen === void 0 ? void 0 : _row$citizen.name) || "");
        }
      }, {
        Header: t("ES_APPLICATION_DETAILS_APPLICANT_MOBILE_NO"),
        disableSortBy: true,
        accessor: function accessor(row) {
          var _row$citizen2;

          return GetCell(((_row$citizen2 = row.citizen) === null || _row$citizen2 === void 0 ? void 0 : _row$citizen2.mobileNumber) || "");
        }
      }, {
        Header: t("ES_APPLICATION_DETAILS_PROPERTY_TYPE"),
        accessor: function accessor(row) {
          var key = t("PROPERTYTYPE_MASTERS_" + row.propertyUsage.split(".")[0]);
          return key;
        },
        disableSortBy: true
      }, {
        Header: t("ES_APPLICATION_DETAILS_PROPERTY_SUB-TYPE"),
        accessor: function accessor(row) {
          var key = t("PROPERTYTYPE_MASTERS_" + row.propertyUsage);
          return key;
        },
        disableSortBy: true
      }, {
        Header: t("ES_INBOX_LOCALITY"),
        accessor: function accessor(row) {
          return GetCell(t(Digit.Utils.locale.getRevenueLocalityCode(row.address.locality.code, row.tenantId)));
        },
        disableSortBy: true
      }, {
        Header: t("ES_INBOX_STATUS"),
        accessor: function accessor(row) {
          return GetCell(t("CS_COMMON_FSM_" + row.applicationStatus));
        },
        disableSortBy: true
      }];
    }

    switch (props.userRole) {
      case "FSM_EMP_FSTPO":
        return [{
          Header: t("ES_INBOX_VEHICLE_LOG"),
          accessor: "applicationNo",
          Cell: function Cell(_ref2) {
            var row = _ref2.row;
            return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", {
              className: "link"
            }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
              to: "/digit-ui/employee/fsm/fstp-operator-details/" + row.original["applicationNo"]
            }, row.original["applicationNo"])));
          }
        }, {
          Header: t("ES_INBOX_VEHICLE_NO"),
          accessor: function accessor(row) {
            var _row$vehicle;

            return (_row$vehicle = row.vehicle) === null || _row$vehicle === void 0 ? void 0 : _row$vehicle.registrationNumber;
          }
        }, {
          Header: t("ES_INBOX_DSO_NAME"),
          accessor: function accessor(row) {
            return row.dsoName + " - " + row.tripOwner.name;
          }
        }, {
          Header: t("ES_INBOX_WASTE_COLLECTED"),
          accessor: function accessor(row) {
            var _row$tripDetails$;

            return (_row$tripDetails$ = row.tripDetails[0]) === null || _row$tripDetails$ === void 0 ? void 0 : _row$tripDetails$.volume;
          }
        }];

      default:
        return [{
          Header: t("CS_FILE_DESLUDGING_APPLICATION_NO"),
          Cell: function Cell(_ref3) {
            var row = _ref3.row;
            return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("span", {
              className: "link"
            }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
              to: props.parentRoute + "/" + (DSO ? "dso-application-details" : "application-details") + "/" + row.original["applicationNo"]
            }, row.original["applicationNo"])));
          }
        }, {
          Header: t("ES_INBOX_APPLICATION_DATE"),
          accessor: "createdTime",
          Cell: function Cell(_ref4) {
            var row = _ref4.row;
            return GetCell(row.original.createdTime.getDate() + "/" + (row.original.createdTime.getMonth() + 1) + "/" + row.original.createdTime.getFullYear());
          }
        }, {
          Header: t("ES_INBOX_LOCALITY"),
          Cell: function Cell(_ref5) {
            var row = _ref5.row;
            return GetCell(t(Digit.Utils.locale.getRevenueLocalityCode(row.original["locality"], row.original["tenantId"])));
          }
        }, {
          Header: t("ES_INBOX_STATUS"),
          Cell: function Cell(row) {
            return GetCell(t("CS_COMMON_FSM_" + row.row.original["status"]));
          }
        }, {
          Header: t("ES_INBOX_SLA_DAYS_REMAINING"),
          Cell: function Cell(_ref6) {
            var row = _ref6.row;
            return GetSlaCell(row.original["sla"]);
          }
        }];
    }
  }, []);
  var result;

  if (props.isLoading) {
    result = /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  } else if (props.isSearch && !props.shouldSearch || (props === null || props === void 0 ? void 0 : (_props$data = props.data) === null || _props$data === void 0 ? void 0 : (_props$data$table = _props$data.table) === null || _props$data$table === void 0 ? void 0 : _props$data$table.length) === 0) {
    result = /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
      style: {
        marginTop: 20
      }
    }, t("CS_MYAPPLICATIONS_NO_APPLICATION").split("\\n").map(function (text, index) {
      return /*#__PURE__*/React__default.createElement("p", {
        key: index,
        style: {
          textAlign: "center"
        }
      }, text);
    }));
  } else if ((props === null || props === void 0 ? void 0 : (_props$data2 = props.data) === null || _props$data2 === void 0 ? void 0 : (_props$data2$table = _props$data2.table) === null || _props$data2$table === void 0 ? void 0 : _props$data2$table.length) > 0) {
    var _React$createElement;

    result = /*#__PURE__*/React__default.createElement(ApplicationTable, (_React$createElement = {
      t: t,
      data: props.data.table,
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
      onPageSizeChange: props.onPageSizeChange,
      currentPage: props.currentPage,
      onNextPage: props.onNextPage,
      onPrevPage: props.onPrevPage,
      pageSizeLimit: props.pageSizeLimit,
      onSort: props.onSort,
      disableSort: props.disableSort
    }, _React$createElement["onPageSizeChange"] = props.onPageSizeChange, _React$createElement.sortParams = props.sortParams, _React$createElement.totalRecords = props.totalRecords, _React$createElement));
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "inbox-container"
  }, props.userRole !== "FSM_EMP_FSTPO" && !props.isSearch && /*#__PURE__*/React__default.createElement("div", {
    className: "filters-container"
  }, /*#__PURE__*/React__default.createElement(FSMLink, {
    parentRoute: props.parentRoute
  }), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Filter, {
    searchParams: props.searchParams,
    paginationParms: props.paginationParms,
    applications: props.data,
    onFilterChange: props.onFilterChange,
    type: "desktop"
  }))), /*#__PURE__*/React__default.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React__default.createElement(SearchApplication, {
    onSearch: props.onSearch,
    type: "desktop",
    searchFields: props.searchFields,
    isInboxPage: !(props !== null && props !== void 0 && props.isSearch),
    searchParams: props.searchParams
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "result",
    style: {
      marginLeft: FSTP ? "" : !(props !== null && props !== void 0 && props.isSearch) ? "24px" : "",
      flex: 1
    }
  }, result)));
};

var SortBy = function SortBy(props) {
  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useState = React.useState(function () {
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

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "filter"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-card"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "heading"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-label"
  }, t("SORT_BY"), ":"), /*#__PURE__*/React__default.createElement("div", {
    className: "clearAll",
    onClick: clearAll
  }, t("ES_COMMON_CLEAR_ALL")), props.type === "desktop" && /*#__PURE__*/React__default.createElement("span", {
    className: "clear-search",
    onClick: clearAll
  }, t("ES_COMMON_CLEAR_ALL")), props.type === "mobile" && /*#__PURE__*/React__default.createElement("span", {
    onClick: props.onClose
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CloseSvg, null))), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioButtons, {
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
  var _mergedRoleDetails$st, _React$createElement;

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

  var _useState = React.useState(isSearch ? "SEARCH" : ""),
      type = _useState[0],
      setType = _useState[1];

  var _useState2 = React.useState(isSearch ? true : false),
      popup = _useState2[0],
      setPopup = _useState2[1];

  var _useState3 = React.useState(searchParams),
      params = _useState3[0],
      setParams = _useState3[1];

  var _useState4 = React.useState(sortParams),
      setSortParams = _useState4[1];

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var state = tenantId.split(".")[0];

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(state, "DIGIT-UI", "RoleStatusMapping"),
      roleStatuses = _Digit$Hooks$fsm$useM.data,
      isRoleStatusFetched = _Digit$Hooks$fsm$useM.isFetched;

  var userInfo = Digit.UserService.getUser();
  var userRoles = userInfo.info.roles.map(function (roleData) {
    return roleData.code;
  });
  var userRoleDetails = roleStatuses === null || roleStatuses === void 0 ? void 0 : roleStatuses.filter(function (roleDetails) {
    return userRoles.filter(function (role) {
      return role === roleDetails.userRole;
    })[0];
  });
  var mergedRoleDetails = userRoleDetails === null || userRoleDetails === void 0 ? void 0 : userRoleDetails.reduce(function (merged, details) {
    return {
      fixed: (details === null || details === void 0 ? void 0 : details.fixed) && (merged === null || merged === void 0 ? void 0 : merged.fixed),
      statuses: [].concat(merged === null || merged === void 0 ? void 0 : merged.statuses, details === null || details === void 0 ? void 0 : details.statuses).filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
      }),
      zeroCheck: (details === null || details === void 0 ? void 0 : details.zeroCheck) || (merged === null || merged === void 0 ? void 0 : merged.zeroCheck)
    };
  }, {
    statuses: []
  });

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

  React.useEffect(function () {
    if (type) setPopup(true);
  }, [type]);
  var DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;

  var handlePopupClose = function handlePopupClose() {
    setPopup(false);
    setType("");
    setParams(searchParams);
    setSortParams(sortParams);
  };

  if (isLoading || !isRoleStatusFetched) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  var result;

  if (!data || (data === null || data === void 0 ? void 0 : data.length) === 0) {
    result = /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
      style: {
        marginTop: 20
      }
    }, t("CS_MYAPPLICATIONS_NO_APPLICATION").split("\\n").map(function (text, index) {
      return /*#__PURE__*/React__default.createElement("p", {
        key: index,
        style: {
          textAlign: "center"
        }
      }, text);
    }));
  } else if (data && (data === null || data === void 0 ? void 0 : data.length) > 0) {
    result = /*#__PURE__*/React__default.createElement(digitUiReactComponents.DetailsCard, {
      data: data,
      serviceRequestIdKey: serviceRequestIdKey,
      linkPrefix: linkPrefix ? linkPrefix : DSO ? "/digit-ui/employee/fsm/application-details/" : "/digit-ui/employee/fsm/"
    });
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "searchBox"
  }, onSearch && /*#__PURE__*/React__default.createElement(digitUiReactComponents.SearchAction, {
    text: "SEARCH",
    handleActionClick: function handleActionClick() {
      setType("SEARCH");
      setPopup(true);
    }
  }), !isSearch && onFilterChange && (!DSO && !isFstpOperator && searchParams || (mergedRoleDetails === null || mergedRoleDetails === void 0 ? void 0 : (_mergedRoleDetails$st = mergedRoleDetails.statuses) === null || _mergedRoleDetails$st === void 0 ? void 0 : _mergedRoleDetails$st.length) > 0) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.FilterAction, {
    text: "FILTER",
    handleActionClick: function handleActionClick() {
      setType("FILTER");
      setPopup(true);
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.FilterAction, {
    text: "SORT",
    handleActionClick: function handleActionClick() {
      setType("SORT");
      setPopup(true);
    }
  })), result, popup && /*#__PURE__*/React__default.createElement(digitUiReactComponents.PopUp, null, type === "FILTER" && /*#__PURE__*/React__default.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React__default.createElement(Filter, {
    onFilterChange: selectParams,
    onClose: handlePopupClose,
    onSearch: onSearchPara,
    type: "mobile",
    searchParams: params,
    removeParam: removeParam
  })), type === "SORT" && /*#__PURE__*/React__default.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React__default.createElement(SortBy, (_React$createElement = {
    type: "mobile",
    sortParams: sortParams,
    onClose: handlePopupClose
  }, _React$createElement["type"] = "mobile", _React$createElement.onSort = onSort, _React$createElement))), type === "SEARCH" && /*#__PURE__*/React__default.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React__default.createElement(SearchApplication, {
    type: "mobile",
    onClose: handlePopupClose,
    onSearch: onSearch,
    isFstpOperator: isFstpOperator,
    searchParams: searchParams,
    searchFields: searchFields
  }))));
};

var ApplicationLinks = function ApplicationLinks(_ref) {
  var linkPrefix = _ref.linkPrefix;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var allLinks = [{
    text: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
    link: "/digit-ui/employee/fsm/new-application",
    accessTo: ["FSM_CREATOR_EMP"]
  }, {
    text: t("ES_TITILE_SEARCH_APPLICATION"),
    link: linkPrefix + "/search"
  }];

  var _useState = React.useState([]),
      links = _useState[0],
      setLinks = _useState[1];

  var roles = Digit.UserService.getUser().info.roles;

  var hasAccess = function hasAccess(accessTo) {
    return roles.filter(function (role) {
      return accessTo.includes(role.code);
    }).length;
  };

  React.useEffect(function () {
    var linksToShow = [];
    allLinks.forEach(function (link) {
      if (link.accessTo) {
        if (hasAccess(link.accessTo)) {
          linksToShow.push(link);
        }
      } else {
        linksToShow.push(link);
      }
    });
    setLinks(linksToShow);
  }, []);

  var GetLogo = function GetLogo() {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "header"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "text"
    }, t("ES_TITLE_FAECAL_SLUDGE_MGMT")), /*#__PURE__*/React__default.createElement("span", {
      className: "logo"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.ShippingTruck, null)), " ");
  };

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    className: "employeeCard filter"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "complaint-links-container"
  }, GetLogo(), /*#__PURE__*/React__default.createElement("div", {
    className: "body"
  }, links.map(function (_ref2, index) {
    var link = _ref2.link,
        text = _ref2.text;
    return /*#__PURE__*/React__default.createElement("span", {
      className: "link",
      key: index
    }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: link
    }, text));
  }))));
};

var GetSlaCell = function GetSlaCell(value) {
  if (isNaN(value)) return /*#__PURE__*/React__default.createElement("span", {
    className: "sla-cell-success"
  }, "0");
  return value < 0 ? /*#__PURE__*/React__default.createElement("span", {
    className: "sla-cell-error"
  }, value) : /*#__PURE__*/React__default.createElement("span", {
    className: "sla-cell-success"
  }, value);
};

var GetCell = function GetCell(value) {
  return /*#__PURE__*/React__default.createElement("span", {
    className: "sla-cell"
  }, value);
};

var MobileInbox = function MobileInbox(_ref) {
  var data = _ref.data,
      vehicleLog = _ref.vehicleLog,
      isLoading = _ref.isLoading,
      isSearch = _ref.isSearch,
      onSearch = _ref.onSearch,
      onFilterChange = _ref.onFilterChange,
      onSort = _ref.onSort,
      searchParams = _ref.searchParams,
      searchFields = _ref.searchFields,
      linkPrefix = _ref.linkPrefix,
      parentRoute = _ref.parentRoute,
      removeParam = _ref.removeParam,
      sortParams = _ref.sortParams;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var getData = function getData() {
    if (isSearch) {
      var _data$table;

      return data === null || data === void 0 ? void 0 : (_data$table = data.table) === null || _data$table === void 0 ? void 0 : _data$table.map(function (_ref2) {
        var _ref3;

        var applicationNo = _ref2.applicationNo,
            applicationStatus = _ref2.applicationStatus,
            propertyUsage = _ref2.propertyUsage,
            tenantId = _ref2.tenantId,
            address = _ref2.address,
            citizen = _ref2.citizen;
        return _ref3 = {}, _ref3[t("ES_INBOX_APPLICATION_NO")] = applicationNo, _ref3[t("ES_APPLICATION_DETAILS_APPLICANT_NAME")] = GetCell((citizen === null || citizen === void 0 ? void 0 : citizen.name) || ""), _ref3[t("ES_APPLICATION_DETAILS_APPLICANT_MOBILE_NO")] = GetCell((citizen === null || citizen === void 0 ? void 0 : citizen.mobileNumber) || ""), _ref3[t("ES_APPLICATION_DETAILS_PROPERTY_TYPE")] = GetCell(t("PROPERTYTYPE_MASTERS_" + propertyUsage.split(".")[0])), _ref3[t("ES_APPLICATION_DETAILS_PROPERTY_SUB-TYPE")] = GetCell(t("PROPERTYTYPE_MASTERS_" + propertyUsage)), _ref3[t("ES_INBOX_LOCALITY")] = GetCell(t(Digit.Utils.locale.getRevenueLocalityCode(address.locality.code, tenantId))), _ref3[t("ES_INBOX_STATUS")] = GetCell(t("CS_COMMON_FSM_" + applicationStatus)), _ref3;
      });
    } else {
      return data === null || data === void 0 ? void 0 : data.map(function (_ref4) {
        var _ref5;

        var locality = _ref4.locality,
            applicationNo = _ref4.applicationNo,
            createdTime = _ref4.createdTime,
            tenantId = _ref4.tenantId,
            status = _ref4.status,
            sla = _ref4.sla;
        return _ref5 = {}, _ref5[t("ES_INBOX_APPLICATION_NO")] = applicationNo, _ref5[t("ES_INBOX_APPLICATION_DATE")] = createdTime.getDate() + "/" + (createdTime.getMonth() + 1) + "/" + createdTime.getFullYear(), _ref5[t("ES_INBOX_LOCALITY")] = GetCell(t(Digit.Utils.locale.getRevenueLocalityCode(locality, tenantId))), _ref5[t("ES_INBOX_STATUS")] = GetCell(t("CS_COMMON_" + status)), _ref5[t("ES_INBOX_SLA_DAYS_REMAINING")] = GetSlaCell(sla), _ref5;
      });
    }
  };

  var DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  var isFstpOperator = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;
  var fstpOperatorData = vehicleLog === null || vehicleLog === void 0 ? void 0 : vehicleLog.map(function (vehicle) {
    var _vehicle$vehicle, _vehicle$tripDetails$, _ref6;

    return _ref6 = {}, _ref6[t("ES_INBOX_VEHICLE_LOG")] = vehicle === null || vehicle === void 0 ? void 0 : vehicle.applicationNo, _ref6[t("ES_INBOX_VEHICLE_NO")] = vehicle === null || vehicle === void 0 ? void 0 : (_vehicle$vehicle = vehicle.vehicle) === null || _vehicle$vehicle === void 0 ? void 0 : _vehicle$vehicle.registrationNumber, _ref6[t("ES_INBOX_DSO_NAME")] = vehicle === null || vehicle === void 0 ? void 0 : vehicle.tripOwner.displayName, _ref6[t("ES_INBOX_WASTE_COLLECTED")] = vehicle === null || vehicle === void 0 ? void 0 : (_vehicle$tripDetails$ = vehicle.tripDetails[0]) === null || _vehicle$tripDetails$ === void 0 ? void 0 : _vehicle$tripDetails$.volume, _ref6;
  });
  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "inbox-container"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filters-container"
  }, !isFstpOperator && !isSearch && /*#__PURE__*/React__default.createElement(ApplicationLinks, {
    linkPrefix: parentRoute,
    isMobile: true
  }), /*#__PURE__*/React__default.createElement(ApplicationCard, {
    t: t,
    data: isFstpOperator ? fstpOperatorData : getData(),
    onFilterChange: !isFstpOperator ? onFilterChange : false,
    serviceRequestIdKey: isFstpOperator ? t("ES_INBOX_VEHICLE_LOG") : DSO ? t("ES_INBOX_APPLICATION_NO") : t("ES_INBOX_APPLICATION_NO"),
    isFstpOperator: isFstpOperator,
    isLoading: isLoading,
    isSearch: isSearch,
    onSearch: onSearch,
    onSort: onSort,
    searchParams: searchParams,
    searchFields: searchFields,
    linkPrefix: linkPrefix,
    removeParam: removeParam,
    sortParams: sortParams
  }))));
};

var config = {
  select: function select(response) {
    return {
      totalCount: response === null || response === void 0 ? void 0 : response.totalCount,
      vehicleLog: response === null || response === void 0 ? void 0 : response.vehicleTrip.map(function (trip) {
        var owner = trip.tripOwner;
        var displayName = owner.name + (owner.userName ? "- " + owner.userName : "");

        var tripOwner = _extends({}, owner, {
          displayName: displayName
        });

        return _extends({}, trip, {
          tripOwner: tripOwner
        });
      })
    };
  }
};

var FstpInbox = function FstpInbox() {
  var _searchParams$registr, _searchParams$name, _searchParams$registr2, _vehicles$vehicle, _vehicles$vehicle$, _searchParams$name2, _dsoData$;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useState = React.useState({
    applicationStatus: "WAITING_FOR_DISPOSAL"
  }),
      searchParams = _useState[0],
      setSearchParams = _useState[1];

  var _useState2 = React.useState(0),
      pageOffset = _useState2[0],
      setPageOffset = _useState2[1];

  var _useState3 = React.useState(10),
      pageSize = _useState3[0],
      setPageSize = _useState3[1];

  var _Digit$Hooks$fsm$useV = Digit.Hooks.fsm.useVehiclesSearch({
    tenantId: tenantId,
    filters: {
      registrationNumber: searchParams === null || searchParams === void 0 ? void 0 : searchParams.registrationNumber
    },
    config: {
      enabled: (searchParams === null || searchParams === void 0 ? void 0 : (_searchParams$registr = searchParams.registrationNumber) === null || _searchParams$registr === void 0 ? void 0 : _searchParams$registr.length) > 0
    }
  }),
      vehicles = _Digit$Hooks$fsm$useV.data;

  var _Digit$Hooks$fsm$useD = Digit.Hooks.fsm.useDsoSearch(tenantId, {
    name: searchParams === null || searchParams === void 0 ? void 0 : searchParams.name
  }, {
    enabled: (searchParams === null || searchParams === void 0 ? void 0 : (_searchParams$name = searchParams.name) === null || _searchParams$name === void 0 ? void 0 : _searchParams$name.length) > 1
  }),
      dsoData = _Digit$Hooks$fsm$useD.data;

  var filters = {
    vehicleIds: vehicles !== undefined && (searchParams === null || searchParams === void 0 ? void 0 : (_searchParams$registr2 = searchParams.registrationNumber) === null || _searchParams$registr2 === void 0 ? void 0 : _searchParams$registr2.length) > 0 ? (vehicles === null || vehicles === void 0 ? void 0 : (_vehicles$vehicle = vehicles.vehicle) === null || _vehicles$vehicle === void 0 ? void 0 : (_vehicles$vehicle$ = _vehicles$vehicle[0]) === null || _vehicles$vehicle$ === void 0 ? void 0 : _vehicles$vehicle$.id) || "null" : "",
    tripOwnerIds: dsoData !== undefined && (searchParams === null || searchParams === void 0 ? void 0 : (_searchParams$name2 = searchParams.name) === null || _searchParams$name2 === void 0 ? void 0 : _searchParams$name2.length) > 0 ? (dsoData === null || dsoData === void 0 ? void 0 : (_dsoData$ = dsoData[0]) === null || _dsoData$ === void 0 ? void 0 : _dsoData$.ownerId) || "null" : "",
    applicationStatus: searchParams === null || searchParams === void 0 ? void 0 : searchParams.applicationStatus
  };

  var _Digit$Hooks$fsm$useV2 = Digit.Hooks.fsm.useVehicleSearch({
    tenantId: tenantId,
    filters: filters,
    config: config,
    options: {
      searchWithDSO: true
    }
  }),
      isLoading = _Digit$Hooks$fsm$useV2.isLoading,
      _Digit$Hooks$fsm$useV3 = _Digit$Hooks$fsm$useV2.data;

  _Digit$Hooks$fsm$useV3 = _Digit$Hooks$fsm$useV3 === void 0 ? {} : _Digit$Hooks$fsm$useV3;
  var totalCount = _Digit$Hooks$fsm$useV3.totalCount,
      vehicleLog = _Digit$Hooks$fsm$useV3.vehicleLog;

  var onSearch = function onSearch(params) {
    if (params === void 0) {
      params = {};
    }

    setSearchParams(_extends({
      applicationStatus: "WAITING_FOR_DISPOSAL"
    }, params));
  };

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

  var handlePageSizeChange = function handlePageSizeChange(e) {
    setPageSize(Number(e.target.value));
  };

  var handleFilterChange = function handleFilterChange() {};

  var searchFields = [{
    label: t("ES_FSTP_OPERATOR_VEHICLE_NO"),
    name: "registrationNumber"
  }, {
    label: t("ES_FSTP_DSO_NAME"),
    name: "name"
  }];
  var isMobile = window.Digit.Utils.browser.isMobile();

  if (isMobile) {
    return /*#__PURE__*/React__default.createElement(MobileInbox, {
      onFilterChange: handleFilterChange,
      vehicleLog: vehicleLog,
      isLoading: isLoading,
      userRole: "FSM_EMP_FSTPO",
      linkPrefix: "/digit-ui/employee/fsm/fstp-operator-details/",
      onSearch: onSearch,
      searchFields: searchFields
    });
  } else {
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, null, t("ES_COMMON_INBOX")), /*#__PURE__*/React__default.createElement(DesktopInbox, {
      data: {
        table: vehicleLog
      },
      isLoading: isLoading,
      userRole: "FSM_EMP_FSTPO",
      onFilterChange: handleFilterChange,
      searchFields: searchFields,
      onSearch: onSearch,
      onNextPage: fetchNextPage,
      onPrevPage: fetchPrevPage,
      currentPage: Math.floor(pageOffset / pageSize),
      pageSizeLimit: pageSize,
      onPageSizeChange: handlePageSizeChange,
      totalRecords: totalCount || 0
    }));
  }
};

var CustomTimePicker = function CustomTimePicker(_ref) {
  var name = _ref.name,
      value = _ref.value,
      _onChange = _ref.onChange;
  var timeFormat = new Date().toLocaleTimeString();

  if (timeFormat.includes("AM") || timeFormat.includes("PM")) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, {
      name: name,
      type: "time",
      value: value,
      onChange: function onChange(event) {
        return _onChange(event.target.value);
      },
      className: "custom-time-picker"
    });
  }

  return /*#__PURE__*/React__default.createElement(TimePicker, {
    name: name,
    onChange: _onChange,
    value: value,
    locale: "en-US",
    disableClock: false,
    clearIcon: null
  });
};

var config$1 = {
  select: function select(data) {
    return data.vehicleTrip[0];
  }
};

var FstpOperatorDetails = function FstpOperatorDetails() {
  var _vehicle$vehicle;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();
  var queryClient = reactQuery.useQueryClient();
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useParams = reactRouterDom.useParams(),
      applicationNos = _useParams.id;

  var _useState = React.useState({
    applicationNos: applicationNos
  }),
      filters = _useState[0];

  var _useState2 = React.useState(false),
      isVehicleSearchCompleted = _useState2[0],
      setIsVehicleSearchCompleted = _useState2[1];

  var _useState3 = React.useState({}),
      searchParams = _useState3[0],
      setSearchParams = _useState3[1];

  var _useState4 = React.useState(null),
      showToast = _useState4[0],
      setShowToast = _useState4[1];

  var _useState5 = React.useState(null),
      wasteCollected = _useState5[0],
      setWasteCollected = _useState5[1];

  var _useState6 = React.useState({}),
      errors = _useState6[0],
      setErrors = _useState6[1];

  var _useState7 = React.useState(null),
      tripStartTime = _useState7[0],
      setTripStartTime = _useState7[1];

  var _useState8 = React.useState(function () {
    var today = new Date();
    var hour = (today.getHours() < 10 ? "0" : "") + today.getHours();
    var minutes = (today.getMinutes() < 10 ? "0" : "") + today.getMinutes();
    return hour + ":" + minutes;
  }),
      tripTime = _useState8[0],
      setTripTime = _useState8[1];

  var _Digit$Hooks$fsm$useV = Digit.Hooks.fsm.useVehicleSearch({
    tenantId: tenantId,
    filters: filters,
    config: config$1
  }),
      isLoading = _Digit$Hooks$fsm$useV.isLoading,
      isSuccess = _Digit$Hooks$fsm$useV.isSuccess,
      vehicle = _Digit$Hooks$fsm$useV.data;

  var _Digit$Hooks$fsm$useS = Digit.Hooks.fsm.useSearchAll(tenantId, searchParams, null, {
    enabled: !!isVehicleSearchCompleted
  }),
      isSearchLoading = _Digit$Hooks$fsm$useS.isLoading,
      isIdle = _Digit$Hooks$fsm$useS.isIdle,
      _Digit$Hooks$fsm$useS2 = _Digit$Hooks$fsm$useS.data;

  _Digit$Hooks$fsm$useS2 = _Digit$Hooks$fsm$useS2 === void 0 ? {} : _Digit$Hooks$fsm$useS2;
  var _Digit$Hooks$fsm$useS3 = _Digit$Hooks$fsm$useS2.data;
  _Digit$Hooks$fsm$useS3 = _Digit$Hooks$fsm$useS3 === void 0 ? {} : _Digit$Hooks$fsm$useS3;
  var tripDetails = _Digit$Hooks$fsm$useS3.table;
  var mutation = Digit.Hooks.fsm.useVehicleUpdate(tenantId);
  React.useEffect(function () {
    if (isSuccess) {
      setWasteCollected(vehicle.vehicle.tankCapacity);

      var _applicationNos = vehicle.tripDetails.map(function (tripData) {
        return tripData.referenceNo;
      }).join(",");

      setSearchParams({
        applicationNos: _applicationNos
      });
      setIsVehicleSearchCompleted(true);
    }
  }, [isSuccess]);

  var handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    var wasteCombined = tripDetails.reduce(function (acc, trip) {
      return acc + trip.volume;
    }, 0);

    if (!wasteCollected || wasteCollected > wasteCombined || wasteCollected > vehicle.vehicle.tankCapacity) {
      setErrors({
        wasteRecieved: "ES_FSTP_INVALID_WASTE_AMOUNT"
      });
      return;
    }

    if (tripStartTime === null) {
      setErrors({
        tripStartTime: "ES_FSTP_INVALID_START_TIME"
      });
      return;
    }

    if (tripTime === null) {
      setErrors({
        tripTime: "ES_FSTP_INVALID_TRIP_TIME"
      });
      return;
    }

    if (tripStartTime === tripTime || tripStartTime > tripTime) {
      setErrors({
        tripTime: "ES_FSTP_INVALID_TRIP_TIME"
      });
      return;
    }

    setErrors({});
    var d = new Date();
    var timeStamp = Date.parse(new Date(d.toString().split(":")[0].slice(0, -2) + tripTime)) / 1000;
    var tripStartTimestamp = Date.parse(new Date(d.toString().split(":")[0].slice(0, -2) + tripStartTime)) / 1000;
    vehicle.tripStartTime = tripStartTimestamp;
    vehicle.fstpEntryTime = tripStartTimestamp;
    vehicle.tripEndTime = timeStamp;
    vehicle.fstpExitTime = timeStamp;
    vehicle.volumeCarried = wasteCollected;
    var details = {
      vehicleTrip: vehicle,
      workflow: {
        action: "DISPOSE"
      }
    };
    mutation.mutate(details, {
      onSuccess: handleSuccess
    });
  };

  var closeToast = function closeToast() {
    setShowToast(null);
  };

  var handleSuccess = function handleSuccess() {
    queryClient.invalidateQueries("FSM_VEHICLE_DATA");
    setShowToast({
      key: "success",
      action: "ES_FSM_DISPOSE_UPDATE_SUCCESS"
    });
    setTimeout(function () {
      closeToast();
      history.push("/digit-ui/employee/fsm/fstp-inbox");
    }, 5000);
  };

  var handleChange = function handleChange(event) {
    var _event$target = event.target,
        name = _event$target.name,
        value = _event$target.value;

    if (name === "tripTime") {
      setTripTime(value);
    } else if (name === "wasteRecieved") {
      setWasteCollected(value);
    }
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  var vehicleData = [{
    title: t("ES_INBOX_VEHICLE_LOG"),
    value: vehicle.applicationNo
  }, {
    title: t("ES_INBOX_DSO_NAME"),
    value: vehicle.tripOwner.name
  }, {
    title: t("ES_INBOX_VEHICLE_NO"),
    value: (_vehicle$vehicle = vehicle.vehicle) === null || _vehicle$vehicle === void 0 ? void 0 : _vehicle$vehicle.registrationNumber
  }, {
    title: "" + t("ES_VEHICLE CAPACITY"),
    value: vehicle.vehicle.tankCapacity
  }];
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, vehicleData.map(function (row, index) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      key: row.title,
      label: row.title,
      text: row.value || "N/A",
      last: false
    });
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t(errors.tripStartTime)), /*#__PURE__*/React__default.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    key: t("ES_VEHICLE_IN_TIME"),
    label: t("ES_VEHICLE_IN_TIME") + " * ",
    rowContainerStyle: {
      marginBottom: "32px"
    },
    text: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(CustomTimePicker, {
      name: "tripStartTime",
      onChange: setTripStartTime,
      value: tripStartTime
    }))
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t(errors.wasteRecieved)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    key: t("ES_VEHICLE_SEPTAGE_DUMPED"),
    label: t("ES_VEHICLE_SEPTAGE_DUMPED") + " * ",
    text: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, {
      type: "number",
      name: "wasteRecieved",
      value: wasteCollected,
      onChange: handleChange,
      style: {
        width: "100%",
        maxWidth: "200px"
      }
    }))
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t(errors.tripTime)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    key: t("ES_VEHICLE_OUT_TIME"),
    label: t("ES_VEHICLE_OUT_TIME") + " * ",
    text: /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(CustomTimePicker, {
      name: "tripTime",
      onChange: setTripTime,
      value: tripTime
    }))
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.ActionBar, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("ES_COMMON_SUBMIT"),
    submit: true
  }))))), /*#__PURE__*/React__default.createElement("h2", {
    style: {
      fontWeight: "bold",
      fontSize: "16px",
      marginLeft: "8px",
      marginTop: "16px"
    }
  }, t("ES_FSTP_OPERATOR_DETAILS_WASTE_GENERATORS")), isSearchLoading || isIdle ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, tripDetails.map(function (trip, index) {
    var _trip$tenantId, _trip$tenantId$toUppe, _trip$tenantId$toUppe2, _trip$address, _trip$address$localit;

    return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      key: index,
      label: t("CS_FILE_DESLUDGING_APPLICATION_NO"),
      text: trip.applicationNo
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      key: index,
      label: t("ES_INBOX_LOCALITY"),
      text: t((trip === null || trip === void 0 ? void 0 : (_trip$tenantId = trip.tenantId) === null || _trip$tenantId === void 0 ? void 0 : (_trip$tenantId$toUppe = _trip$tenantId.toUpperCase()) === null || _trip$tenantId$toUppe === void 0 ? void 0 : (_trip$tenantId$toUppe2 = _trip$tenantId$toUppe.split(".")) === null || _trip$tenantId$toUppe2 === void 0 ? void 0 : _trip$tenantId$toUppe2.join("_")) + "_REVENUE_" + (trip === null || trip === void 0 ? void 0 : (_trip$address = trip.address) === null || _trip$address === void 0 ? void 0 : (_trip$address$localit = _trip$address.locality) === null || _trip$address$localit === void 0 ? void 0 : _trip$address$localit.code))
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      key: index,
      label: t("ES_USAGE"),
      text: t("PROPERTYTYPE_MASTERS_" + trip.propertyUsage)
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      key: index,
      label: t("ES_WASTE_RECIEVED"),
      text: vehicle.tripDetails[index].volume
    }));
  }))), showToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: showToast.key === "error" ? true : false,
    label: t(showToast.key === "success" ? showToast.action : "ES_FSM_DISPOSE_UPDATE_FAILURE"),
    onClose: closeToast
  }));
};

var Inbox = function Inbox(_ref) {
  var _sortParams$, _sortParams$2, _sortParams$3, _sortParams$4, _applications$table, _searchParams$applica;

  var parentRoute = _ref.parentRoute,
      _ref$isSearch = _ref.isSearch,
      isSearch = _ref$isSearch === void 0 ? false : _ref$isSearch,
      _ref$isInbox = _ref.isInbox,
      isInbox = _ref$isInbox === void 0 ? false : _ref$isInbox;
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var userInfo = Digit.UserService.getUser();
  var userRoles = userInfo.info.roles;
  var DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  var isFSTPOperator = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var queryClient = reactQuery.useQueryClient();

  var _useState = React.useState(false),
      shouldSearch = _useState[0],
      setShouldSearch = _useState[1];

  var _useState2 = React.useState(0),
      pageOffset = _useState2[0],
      setPageOffset = _useState2[1];

  var _useState3 = React.useState(10),
      pageSize = _useState3[0],
      setPageSize = _useState3[1];

  var _useState4 = React.useState([{
    id: "createdTime",
    desc: false
  }]),
      sortParams = _useState4[0],
      setSortParams = _useState4[1];

  var searchParamsKey = isInbox ? "fsm/inbox/searchParams" : "fsm/search/searchParams";
  var searchParamsValue = isInbox ? {
    applicationStatus: [],
    locality: [],
    uuid: DSO || isFSTPOperator ? {
      code: "ASSIGNED_TO_ME",
      name: t("ES_INBOX_ASSIGNED_TO_ME")
    } : {
      code: "ASSIGNED_TO_ALL",
      name: t("ES_INBOX_ASSIGNED_TO_ALL")
    }
  } : {};

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage(searchParamsKey, searchParamsValue),
      searchParams = _Digit$Hooks$useSessi[0],
      setSearchParams = _Digit$Hooks$useSessi[1];

  React.useEffect(function () {
    onSearch(searchParams);
  }, []);
  var isMobile = window.Digit.Utils.browser.isMobile();
  var paginationParms = isMobile ? {
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

  var _Digit$Hooks$fsm$useI = Digit.Hooks.fsm.useInbox(tenantId, _extends({}, searchParams, paginationParms, {
    fromDate: searchParams !== null && searchParams !== void 0 && searchParams.fromDate ? new Date(searchParams === null || searchParams === void 0 ? void 0 : searchParams.fromDate).getTime() : undefined,
    toDate: searchParams !== null && searchParams !== void 0 && searchParams.toDate ? new Date(searchParams === null || searchParams === void 0 ? void 0 : searchParams.toDate).getTime() : undefined
  }), {
    enabled: isInbox
  }, DSO ? true : false),
      applications = _Digit$Hooks$fsm$useI.data,
      isLoading = _Digit$Hooks$fsm$useI.isLoading,
      isIdle = _Digit$Hooks$fsm$useI.isIdle;

  var _Digit$Hooks$fsm$useS = Digit.Hooks.fsm.useSearchAll(tenantId, _extends({
    limit: pageSize,
    offset: pageOffset
  }, searchParams, {
    applicationStatus: searchParams === null || searchParams === void 0 ? void 0 : (_searchParams$applica = searchParams.applicationStatus) === null || _searchParams$applica === void 0 ? void 0 : _searchParams$applica.code,
    fromDate: searchParams !== null && searchParams !== void 0 && searchParams.fromDate ? new Date(searchParams === null || searchParams === void 0 ? void 0 : searchParams.fromDate).getTime() : undefined,
    toDate: searchParams !== null && searchParams !== void 0 && searchParams.toDate ? new Date(searchParams === null || searchParams === void 0 ? void 0 : searchParams.toDate).getTime() : undefined
  }), null, {
    enabled: shouldSearch && isSearch
  }),
      isSearchLoading = _Digit$Hooks$fsm$useS.isLoading,
      _Digit$Hooks$fsm$useS2 = _Digit$Hooks$fsm$useS.data;

  _Digit$Hooks$fsm$useS2 = _Digit$Hooks$fsm$useS2 === void 0 ? {} : _Digit$Hooks$fsm$useS2;
  var data = _Digit$Hooks$fsm$useS2.data,
      totalCount = _Digit$Hooks$fsm$useS2.totalCount;
  React.useEffect(function () {
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

    var _new = _extends({}, searchParams);

    if (keys_to_delete) keys_to_delete.forEach(function (key) {
      return delete _new[key];
    });
    setSearchParams(_extends({}, _new, filterParam));
  };

  var handleSort = React.useCallback(function (args) {
    if ((args === null || args === void 0 ? void 0 : args.length) === 0) return;
    setSortParams(args);
  }, []);

  var handlePageSizeChange = function handlePageSizeChange(e) {
    setPageSize(Number(e.target.value));
  };

  var onSearch = function onSearch(params) {
    if (params === void 0) {
      params = {};
    }

    if (isSearch) {
      var _Object$keys;

      if (((_Object$keys = Object.keys(params)) === null || _Object$keys === void 0 ? void 0 : _Object$keys.length) === 0) {
        setShouldSearch(false);
        queryClient.resetQueries("FSM_CITIZEN_SEARCH");
      } else {
        setShouldSearch(true);
      }

      setSearchParams(_extends({}, params));
    } else {
      setSearchParams(function (_ref2) {
        var applicationStatus = _ref2.applicationStatus,
            locality = _ref2.locality,
            uuid = _ref2.uuid;
        return _extends({
          applicationStatus: applicationStatus,
          locality: locality,
          uuid: uuid
        }, params);
      });
    }
  };

  var removeParam = function removeParam(params) {
    if (params === void 0) {
      params = {};
    }

    var _search = _extends({}, searchParams);

    Object.keys(params).forEach(function (key) {
      return delete _search[key];
    });
    setSearchParams(_search);
  };

  var getSearchFields = function getSearchFields(userRoles) {
    if (isSearch) {
      return [{
        label: t("ES_SEARCH_APPLICATION_APPLICATION_NO"),
        name: "applicationNos"
      }, {
        label: t("ES_SEARCH_APPLICATION_MOBILE_NO"),
        name: "mobileNumber",
        maxlength: 10,
        pattern: "[6-9][0-9]{9}",
        title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID")
      }, {
        label: t("ES_INBOX_STATUS"),
        name: "applicationStatus",
        type: "status"
      }, {
        label: t("ES_SEARCH_FROM_DATE"),
        name: "fromDate",
        type: "date"
      }, {
        label: t("ES_SEARCH_TO_DATE"),
        name: "toDate",
        type: "date"
      }];
    }

    if (userRoles.find(function (role) {
      return role.code === "FSM_EMP_FSTPO";
    })) {
      return [{
        label: t("ES_FSTP_OPERATOR_VEHICLE_NO"),
        name: "vehicleNo"
      }, {
        label: t("ES_FSTP_DSO_NAME"),
        name: "name"
      }];
    } else {
      return [{
        label: t("ES_SEARCH_APPLICATION_APPLICATION_NO"),
        name: "applicationNos"
      }, {
        label: t("ES_SEARCH_APPLICATION_MOBILE_NO"),
        name: "mobileNumber",
        maxlength: 10
      }];
    }
  };

  if ((applications === null || applications === void 0 ? void 0 : (_applications$table = applications.table) === null || _applications$table === void 0 ? void 0 : _applications$table.length) !== null) {
    if (isMobile) {
      return /*#__PURE__*/React__default.createElement(MobileInbox, {
        data: isInbox ? applications === null || applications === void 0 ? void 0 : applications.table : data,
        isLoading: isInbox ? isLoading || isIdle : isSearchLoading,
        isSearch: isSearch,
        searchFields: getSearchFields(userRoles),
        onFilterChange: handleFilterChange,
        onSearch: onSearch,
        onSort: handleSort,
        parentRoute: parentRoute,
        searchParams: searchParams,
        sortParams: sortParams,
        removeParam: removeParam,
        linkPrefix: parentRoute + "/" + (DSO ? "dso-application-details" : "application-details") + "/"
      });
    } else {
      return /*#__PURE__*/React__default.createElement("div", null, !isSearch && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, null, t("ES_COMMON_INBOX"), Number(applications === null || applications === void 0 ? void 0 : applications.totalCount) ? /*#__PURE__*/React__default.createElement("p", {
        className: "inbox-count"
      }, Number(applications === null || applications === void 0 ? void 0 : applications.totalCount)) : null), /*#__PURE__*/React__default.createElement(DesktopInbox, {
        data: isInbox ? applications : data,
        isLoading: isInbox ? isLoading || isIdle : isSearchLoading,
        isSearch: isSearch,
        shouldSearch: shouldSearch,
        onFilterChange: handleFilterChange,
        searchFields: getSearchFields(userRoles),
        onSearch: onSearch,
        onSort: handleSort,
        onNextPage: fetchNextPage,
        onPrevPage: fetchPrevPage,
        currentPage: Math.floor(pageOffset / pageSize),
        pageSizeLimit: pageSize,
        disableSort: false,
        searchParams: searchParams,
        onPageSizeChange: handlePageSizeChange,
        parentRoute: parentRoute,
        paginationParms: paginationParms,
        sortParams: sortParams,
        totalRecords: isInbox ? Number(applications === null || applications === void 0 ? void 0 : applications.totalCount) : totalCount
      }));
    }
  }
};

var isConventionalSpecticTank$2 = function isConventionalSpecticTank(tankDimension) {
  return tankDimension === "lbd";
};

var NewApplication = function NewApplication(_ref) {
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "CommonFieldsConfig"),
      commonFields = _Digit$Hooks$fsm$useM.data,
      isLoading = _Digit$Hooks$fsm$useM.isLoading;

  var _Digit$Hooks$fsm$useM2 = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PreFieldsConfig"),
      preFields = _Digit$Hooks$fsm$useM2.data,
      isApplicantConfigLoading = _Digit$Hooks$fsm$useM2.isLoading;

  var _Digit$Hooks$fsm$useM3 = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "PostFieldsConfig"),
      postFields = _Digit$Hooks$fsm$useM3.data,
      isTripConfigLoading = _Digit$Hooks$fsm$useM3.isLoading;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();

  var _useState = React.useState(false),
      canSubmit = _useState[0],
      setSubmitValve = _useState[1];

  var defaultValues = {
    tripData: {
      noOfTrips: 1,
      amountPerTrip: null,
      amount: null
    }
  };

  var onFormValueChange = function onFormValueChange(setValue, formData) {
    var _formData$address, _formData$address$loc, _formData$tripData, _formData$tripData2;

    if (formData !== null && formData !== void 0 && formData.propertyType && formData !== null && formData !== void 0 && formData.subtype && formData !== null && formData !== void 0 && (_formData$address = formData.address) !== null && _formData$address !== void 0 && (_formData$address$loc = _formData$address.locality) !== null && _formData$address$loc !== void 0 && _formData$address$loc.code && formData !== null && formData !== void 0 && (_formData$tripData = formData.tripData) !== null && _formData$tripData !== void 0 && _formData$tripData.vehicleType && formData !== null && formData !== void 0 && formData.channel && formData !== null && formData !== void 0 && (_formData$tripData2 = formData.tripData) !== null && _formData$tripData2 !== void 0 && _formData$tripData2.amountPerTrip) {
      setSubmitValve(true);
      var pitDetailValues = formData !== null && formData !== void 0 && formData.pitDetail ? Object.values(formData === null || formData === void 0 ? void 0 : formData.pitDetail).filter(function (value) {
        return value > 0;
      }) : null;

      if (formData !== null && formData !== void 0 && formData.pitType) {
        var _formData$pitType, _formData$pitType2;

        if (pitDetailValues === null || (pitDetailValues === null || pitDetailValues === void 0 ? void 0 : pitDetailValues.length) === 0) {
          setSubmitValve(true);
        } else if (isConventionalSpecticTank$2(formData === null || formData === void 0 ? void 0 : (_formData$pitType = formData.pitType) === null || _formData$pitType === void 0 ? void 0 : _formData$pitType.dimension) && (pitDetailValues === null || pitDetailValues === void 0 ? void 0 : pitDetailValues.length) >= 3) {
          setSubmitValve(true);
        } else if (!isConventionalSpecticTank$2(formData === null || formData === void 0 ? void 0 : (_formData$pitType2 = formData.pitType) === null || _formData$pitType2 === void 0 ? void 0 : _formData$pitType2.dimension) && (pitDetailValues === null || pitDetailValues === void 0 ? void 0 : pitDetailValues.length) >= 2) {
          setSubmitValve(true);
        } else setSubmitValve(false);
      }
    } else {
      setSubmitValve(false);
    }
  };

  var onSubmit = function onSubmit(data) {
    var _data$pitType, _data$address, _data$address2, _data$address2$street, _data$address3, _data$address3$doorNo, _data$address4, _data$address5, _data$address5$landma, _data$address6, _data$address6$city, _data$address7, _data$address7$city, _data$address8, _data$address8$city, _data$address9, _data$address9$locali, _data$address10, _data$address10$local, _data$tripData, _data$tripData$vehicl, _data$address11, _data$address12;

    console.log("find submit data", data);
    var applicationChannel = data.channel;
    var sanitationtype = data === null || data === void 0 ? void 0 : (_data$pitType = data.pitType) === null || _data$pitType === void 0 ? void 0 : _data$pitType.code;
    var pitDimension = data === null || data === void 0 ? void 0 : data.pitDetail;
    var applicantName = data.applicationData.applicantName;
    var mobileNumber = data.applicationData.mobileNumber;
    var pincode = data === null || data === void 0 ? void 0 : (_data$address = data.address) === null || _data$address === void 0 ? void 0 : _data$address.pincode;
    var street = data === null || data === void 0 ? void 0 : (_data$address2 = data.address) === null || _data$address2 === void 0 ? void 0 : (_data$address2$street = _data$address2.street) === null || _data$address2$street === void 0 ? void 0 : _data$address2$street.trim();
    var doorNo = data === null || data === void 0 ? void 0 : (_data$address3 = data.address) === null || _data$address3 === void 0 ? void 0 : (_data$address3$doorNo = _data$address3.doorNo) === null || _data$address3$doorNo === void 0 ? void 0 : _data$address3$doorNo.trim();
    var slum = data === null || data === void 0 ? void 0 : (_data$address4 = data.address) === null || _data$address4 === void 0 ? void 0 : _data$address4.slum;
    var landmark = data === null || data === void 0 ? void 0 : (_data$address5 = data.address) === null || _data$address5 === void 0 ? void 0 : (_data$address5$landma = _data$address5.landmark) === null || _data$address5$landma === void 0 ? void 0 : _data$address5$landma.trim();
    var noOfTrips = data.tripData.noOfTrips;
    var amount = data.tripData.amountPerTrip;
    var cityCode = data === null || data === void 0 ? void 0 : (_data$address6 = data.address) === null || _data$address6 === void 0 ? void 0 : (_data$address6$city = _data$address6.city) === null || _data$address6$city === void 0 ? void 0 : _data$address6$city.code;
    var city = data === null || data === void 0 ? void 0 : (_data$address7 = data.address) === null || _data$address7 === void 0 ? void 0 : (_data$address7$city = _data$address7.city) === null || _data$address7$city === void 0 ? void 0 : _data$address7$city.name;
    var state = data === null || data === void 0 ? void 0 : (_data$address8 = data.address) === null || _data$address8 === void 0 ? void 0 : (_data$address8$city = _data$address8.city) === null || _data$address8$city === void 0 ? void 0 : _data$address8$city.state;
    var localityCode = data === null || data === void 0 ? void 0 : (_data$address9 = data.address) === null || _data$address9 === void 0 ? void 0 : (_data$address9$locali = _data$address9.locality) === null || _data$address9$locali === void 0 ? void 0 : _data$address9$locali.code;
    var localityName = data === null || data === void 0 ? void 0 : (_data$address10 = data.address) === null || _data$address10 === void 0 ? void 0 : (_data$address10$local = _data$address10.locality) === null || _data$address10$local === void 0 ? void 0 : _data$address10$local.name;
    var formData = {
      fsm: {
        citizen: {
          name: applicantName,
          mobileNumber: mobileNumber
        },
        tenantId: tenantId,
        sanitationtype: sanitationtype,
        source: applicationChannel.code,
        additionalDetails: {
          tripAmount: amount
        },
        propertyUsage: data === null || data === void 0 ? void 0 : data.subtype,
        vehicleType: data === null || data === void 0 ? void 0 : (_data$tripData = data.tripData) === null || _data$tripData === void 0 ? void 0 : (_data$tripData$vehicl = _data$tripData.vehicleType) === null || _data$tripData$vehicl === void 0 ? void 0 : _data$tripData$vehicl.code,
        pitDetail: _extends({}, pitDimension, {
          distanceFromRoad: data === null || data === void 0 ? void 0 : data.distanceFromRoad
        }),
        address: {
          tenantId: cityCode,
          landmark: landmark,
          doorNo: doorNo,
          street: street,
          city: city,
          state: state,
          pincode: pincode,
          slumName: slum,
          locality: {
            code: localityCode,
            name: localityName
          },
          geoLocation: {
            latitude: data === null || data === void 0 ? void 0 : (_data$address11 = data.address) === null || _data$address11 === void 0 ? void 0 : _data$address11.latitude,
            longitude: data === null || data === void 0 ? void 0 : (_data$address12 = data.address) === null || _data$address12 === void 0 ? void 0 : _data$address12.longitude
          }
        },
        noOfTrips: noOfTrips
      },
      workflow: null
    };
    window.Digit.SessionStorage.set("propertyType", null);
    window.Digit.SessionStorage.set("subType", null);
    Digit.SessionStorage.set("city_property", null);
    Digit.SessionStorage.set("selected_localities", null);
    Digit.SessionStorage.set("locality_property", null);
    history.push("/digit-ui/employee/fsm/response", formData);
  };

  if (isLoading || isTripConfigLoading || isApplicantConfigLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  var configs = [].concat(preFields, commonFields, postFields);
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormComposer, {
    heading: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
    isDisabled: !canSubmit,
    label: t("ES_COMMON_APPLICATION_SUBMIT"),
    config: configs.map(function (config) {
      return _extends({}, config, {
        body: config.body.filter(function (a) {
          return !a.hideInEmployee;
        })
      });
    }),
    fieldStyle: {
      marginRight: 0
    },
    onSubmit: onSubmit,
    defaultValues: defaultValues,
    onFormValueChange: onFormValueChange
  });
};

var GetMessage = function GetMessage(type, action, isSuccess, isEmployee, t) {
  return t((isEmployee ? "E" : "C") + "S_FSM_RESPONSE_" + (action ? action : "CREATE") + "_" + type + (isSuccess ? "" : "_ERROR"));
};

var GetActionMessage$1 = function GetActionMessage(action, isSuccess, isEmployee, t) {
  return GetMessage("ACTION", action, isSuccess, isEmployee, t);
};

var GetLabel = function GetLabel(action, isSuccess, isEmployee, t) {
  return GetMessage("LABEL", action, isSuccess, isEmployee, t);
};

var DisplayText = function DisplayText(action, isSuccess, isEmployee, t) {
  return GetMessage("DISPLAY", action, isSuccess, isEmployee, t);
};

var BannerPicker$1 = function BannerPicker(props) {
  var _props$data, _props$data2, _props$data3;

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Banner, {
    message: GetActionMessage$1(((_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.fsm[0].applicationStatus) || props.action, props.isSuccess, props.isEmployee, props.t),
    applicationNumber: (_props$data2 = props.data) === null || _props$data2 === void 0 ? void 0 : _props$data2.fsm[0].applicationNo,
    info: GetLabel(((_props$data3 = props.data) === null || _props$data3 === void 0 ? void 0 : _props$data3.fsm[0].applicationStatus) || props.action, props.isSuccess, props.isEmployee, props.t),
    successful: props.isSuccess
  });
};

var Response$1 = function Response(props) {
  var _mutation$data, _mutation$data$fsm$0$, _mutation$data$fsm$0$2, _mutation$data2, _mutation$data2$fsm$, _mutation$data3, _mutation$data3$fsm$, _state$applicationDat, _state$applicationDat2;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var queryClient = reactQuery.useQueryClient();
  var paymentAccess = Digit.UserService.hasAccess("FSM_COLLECTOR");
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];
  var state = props.location.state;
  var mutation = state.key === "update" ? Digit.Hooks.fsm.useApplicationActions(tenantId) : Digit.Hooks.fsm.useDesludging(tenantId);

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      storeData = _Digit$Hooks$useStore.data;

  var _ref = storeData || {},
      tenants = _ref.tenants;

  var localityCode = mutation === null || mutation === void 0 ? void 0 : (_mutation$data = mutation.data) === null || _mutation$data === void 0 ? void 0 : (_mutation$data$fsm$0$ = _mutation$data.fsm[0].address) === null || _mutation$data$fsm$0$ === void 0 ? void 0 : (_mutation$data$fsm$0$2 = _mutation$data$fsm$0$.locality) === null || _mutation$data$fsm$0$2 === void 0 ? void 0 : _mutation$data$fsm$0$2.code;
  var slumCode = mutation === null || mutation === void 0 ? void 0 : (_mutation$data2 = mutation.data) === null || _mutation$data2 === void 0 ? void 0 : (_mutation$data2$fsm$ = _mutation$data2.fsm[0].address) === null || _mutation$data2$fsm$ === void 0 ? void 0 : _mutation$data2$fsm$.slumName;
  var slum = Digit.Hooks.fsm.useSlum(mutation === null || mutation === void 0 ? void 0 : (_mutation$data3 = mutation.data) === null || _mutation$data3 === void 0 ? void 0 : (_mutation$data3$fsm$ = _mutation$data3.fsm[0]) === null || _mutation$data3$fsm$ === void 0 ? void 0 : _mutation$data3$fsm$.tenantId, slumCode, localityCode, {
    enabled: slumCode ? true : false,
    retry: slumCode ? true : false
  });

  var _Digit$Hooks$fsm$useM = Digit.Hooks.fsm.useMDMS(stateId, "Vehicle", "VehicleType", {
    staleTime: Infinity
  }),
      vehicleMenu = _Digit$Hooks$fsm$useM.data;

  var vehicle = vehicleMenu === null || vehicleMenu === void 0 ? void 0 : vehicleMenu.find(function (vehicle) {
    var _mutation$data4, _mutation$data4$fsm$;

    return (mutation === null || mutation === void 0 ? void 0 : (_mutation$data4 = mutation.data) === null || _mutation$data4 === void 0 ? void 0 : (_mutation$data4$fsm$ = _mutation$data4.fsm[0]) === null || _mutation$data4$fsm$ === void 0 ? void 0 : _mutation$data4$fsm$.vehicleType) === (vehicle === null || vehicle === void 0 ? void 0 : vehicle.code);
  });
  var pdfVehicleType = getVehicleType(vehicle, t);

  var handleDownloadPdf = function handleDownloadPdf() {
    var fsm = mutation.data.fsm;
    var applicationDetails = fsm[0],
        rest = fsm.slice(1);
    var tenantInfo = tenants.find(function (tenant) {
      return tenant.code === applicationDetails.tenantId;
    });
    var data = getPDFData(_extends({}, applicationDetails, {
      slum: slum,
      pdfVehicleType: pdfVehicleType
    }), tenantInfo, t);
    Digit.Utils.pdf.generate(data);
  };

  React.useEffect(function () {
    var onSuccess = function onSuccess() {
      queryClient.clear();
    };

    if (state.key === "update") {
      mutation.mutate({
        fsm: state.applicationData,
        workflow: _extends({
          action: state.action
        }, state.actionData)
      }, {
        onSuccess: onSuccess
      });
    } else {
      mutation.mutate(state, {
        onSuccess: onSuccess
      });
    }
  }, []);

  if (mutation.isLoading || mutation.isIdle) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(BannerPicker$1, {
    t: t,
    data: mutation.data,
    action: state.action,
    isSuccess: mutation.isSuccess,
    isLoading: mutation.isIdle || mutation.isLoading,
    isEmployee: props.parentRoute.includes("employee")
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, null, DisplayText(state.action, mutation.isSuccess, props.parentRoute.includes("employee"), t)), mutation.isSuccess && /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkButton, {
    label: /*#__PURE__*/React__default.createElement("div", {
      className: "response-download-button"
    }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "#f47738"
    }, /*#__PURE__*/React__default.createElement("path", {
      d: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
    }))), /*#__PURE__*/React__default.createElement("span", {
      className: "download-button"
    }, t("CS_COMMON_DOWNLOAD"))),
    style: {
      width: "100px"
    },
    onClick: handleDownloadPdf
  }), /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: "" + (props.parentRoute.includes("employee") ? "/digit-ui/employee" : "/digit-ui/citizen")
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("CORE_COMMON_GO_TO_HOME")
  })), props.parentRoute.includes("employee") && (state !== null && state !== void 0 && (_state$applicationDat = state.applicationData) !== null && _state$applicationDat !== void 0 && _state$applicationDat.applicationNo || mutation.isSuccess && mutation.data.fsm[0].applicationNo) && paymentAccess && mutation.isSuccess ? /*#__PURE__*/React__default.createElement("div", {
    className: "secondary-action"
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: "/digit-ui/employee/payment/collect/FSM.TRIP_CHARGES/" + ((state === null || state === void 0 ? void 0 : (_state$applicationDat2 = state.applicationData) === null || _state$applicationDat2 === void 0 ? void 0 : _state$applicationDat2.applicationNo) || mutation.data.fsm[0].applicationNo)
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("ES_COMMON_PAY")
  }))) : null);
};

var FsmBreadCrumb = function FsmBreadCrumb(_ref) {
  var _location$pathname, _location$pathname2, _location$pathname3, _location$pathname4;

  var location = _ref.location;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var DSO = Digit.UserService.hasAccess(["FSM_DSO"]);
  var isApplicationDetails = location === null || location === void 0 ? void 0 : (_location$pathname = location.pathname) === null || _location$pathname === void 0 ? void 0 : _location$pathname.includes("application-details");
  var isInbox = location === null || location === void 0 ? void 0 : (_location$pathname2 = location.pathname) === null || _location$pathname2 === void 0 ? void 0 : _location$pathname2.includes("inbox");
  var isFsm = location === null || location === void 0 ? void 0 : (_location$pathname3 = location.pathname) === null || _location$pathname3 === void 0 ? void 0 : _location$pathname3.includes("fsm");
  var isSearch = location === null || location === void 0 ? void 0 : (_location$pathname4 = location.pathname) === null || _location$pathname4 === void 0 ? void 0 : _location$pathname4.includes("search");

  var _useState = React.useState(false),
      search = _useState[0],
      setSearch = _useState[1];

  React.useEffect(function () {
    if (!search) {
      setSearch(isSearch);
    } else if (isInbox && search) {
      setSearch(false);
    }
  }, [location]);
  var crumbs = [{
    path: DSO ? "/digit-ui/citizen/fsm/dso-dashboard" : "/digit-ui/employee",
    content: t("ES_COMMON_HOME"),
    show: isFsm
  }, {
    path: "/digit-ui/employee/fsm/inbox",
    content: isInbox || isApplicationDetails || search ? t("ES_TITLE_INBOX") : "FSM",
    show: isFsm
  }, {
    path: "/digit-ui/employee/fsm/search",
    content: t("ES_TITILE_SEARCH_APPLICATION"),
    show: search
  }, {
    content: t("ES_TITLE_APPLICATION_DETAILS"),
    show: isApplicationDetails
  }];
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.BreadCrumb, {
    crumbs: crumbs
  });
};

var EmployeeApp = function EmployeeApp(_ref2) {
  var path = _ref2.path,
      url = _ref2.url,
      userType = _ref2.userType;
  var location = reactRouterDom.useLocation();
  React.useEffect(function () {
    var _location$pathname5;

    if (!(location !== null && location !== void 0 && (_location$pathname5 = location.pathname) !== null && _location$pathname5 !== void 0 && _location$pathname5.includes("application-details"))) {
      var _location$pathname6, _location$pathname7;

      if (!(location !== null && location !== void 0 && (_location$pathname6 = location.pathname) !== null && _location$pathname6 !== void 0 && _location$pathname6.includes("inbox"))) {
        Digit.SessionStorage.del("fsm/inbox/searchParams");
      } else if (!(location !== null && location !== void 0 && (_location$pathname7 = location.pathname) !== null && _location$pathname7 !== void 0 && _location$pathname7.includes("search"))) {
        Digit.SessionStorage.del("fsm/search/searchParams");
      }
    }
  }, [location]);
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "ground-container"
  }, /*#__PURE__*/React__default.createElement(FsmBreadCrumb, {
    location: location
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    exact: true,
    path: path + "/",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(FSMLinks, {
        matchPath: path,
        userType: userType
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/inbox",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(Inbox, {
        parentRoute: path,
        isInbox: true
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/fstp-inbox",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(FstpInbox, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/new-application",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(NewApplication, {
        parentUrl: url
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/modify-application/:id",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(EditApplication, null);
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/application-details/:id",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(ApplicationDetails$1, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/fstp-operator-details/:id",
    component: FstpOperatorDetails
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/response",
    component: function component(props) {
      return /*#__PURE__*/React__default.createElement(Response$1, _extends({}, props, {
        parentRoute: path
      }));
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/application-audit/:id",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(ApplicationAudit, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/search",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(Inbox, {
        parentRoute: path,
        isSearch: true
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/rate-view/:id",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(RateView, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/mark-for-disposal",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(MarkForDisposal, {
        parentRoute: path
      });
    }
  }))));
};

var CitizenApp = function CitizenApp(_ref3) {
  var path = _ref3.path;
  var location = reactRouterDom.useLocation();

  var _useTranslation2 = reactI18next.useTranslation(),
      t = _useTranslation2.t;

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, !location.pathname.includes("/new-application/response") && /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, null, t("CS_COMMON_BACK")), /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/inbox",
    component: function component() {
      return Digit.UserService.hasAccess(["FSM_DSO"]) ? /*#__PURE__*/React__default.createElement(Inbox, {
        parentRoute: path,
        isInbox: true
      }) : /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
        to: "/digit-ui/citizen"
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/search",
    component: function component() {
      return Digit.UserService.hasAccess(["FSM_DSO"]) ? /*#__PURE__*/React__default.createElement(Inbox, {
        parentRoute: path,
        isSearch: true
      }) : /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
        to: "/digit-ui/citizen"
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/new-application",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(FileComplaint, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/my-applications",
    component: MyApplications
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/dso-application-details/:id",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(ApplicationDetails$1, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/application-details/:id",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(ApplicationDetails, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/rate/:id",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(SelectRating, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/rate-view/:id",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(RateView, {
        parentRoute: path
      });
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/response",
    component: function component(props) {
      return /*#__PURE__*/React__default.createElement(Response$1, _extends({
        parentRoute: path
      }, props));
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
    path: path + "/dso-dashboard",
    component: function component() {
      return /*#__PURE__*/React__default.createElement(DsoDashboard, {
        parentRoute: path
      });
    }
  })));
};

var FSMModule = function FSMModule(_ref4) {
  var stateCode = _ref4.stateCode,
      userType = _ref4.userType,
      tenants = _ref4.tenants;
  var moduleCode = "FSM";

  var _useRouteMatch = reactRouterDom.useRouteMatch(),
      path = _useRouteMatch.path,
      url = _useRouteMatch.url;

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

  Digit.SessionStorage.set("FSM_TENANTS", tenants);

  if (userType === "citizen") {
    return /*#__PURE__*/React__default.createElement(CitizenApp, {
      path: path
    });
  } else {
    return /*#__PURE__*/React__default.createElement(EmployeeApp, {
      path: path,
      url: url,
      userType: userType
    });
  }
};

var FSMLinks = function FSMLinks(_ref5) {
  var matchPath = _ref5.matchPath,
      userType = _ref5.userType;

  var _useTranslation3 = reactI18next.useTranslation(),
      t = _useTranslation3.t;

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("FSM_CITIZEN_FILE_PROPERTY", {}),
      clearParams = _Digit$Hooks$useSessi[2];

  React.useEffect(function () {
    clearParams();
  }, []);
  var roleBasedLoginRoutes = [{
    role: "FSM_DSO",
    from: "/digit-ui/citizen/fsm/dso-dashboard",
    dashoardLink: "CS_LINK_DSO_DASHBOARD",
    loginLink: "CS_LINK_LOGIN_DSO"
  }];

  if (userType === "citizen") {
    var links = [{
      link: matchPath + "/new-application",
      i18nKey: t("CS_HOME_APPLY_FOR_DESLUDGING")
    }, {
      link: matchPath + "/my-applications",
      i18nKey: t("CS_HOME_MY_APPLICATIONS")
    }];
    roleBasedLoginRoutes.map(function (_ref6) {
      var role = _ref6.role,
          from = _ref6.from,
          loginLink = _ref6.loginLink,
          dashoardLink = _ref6.dashoardLink;
      if (Digit.UserService.hasAccess(role)) links.push({
        link: from,
        i18nKey: t(dashoardLink)
      });else links.push({
        link: "/digit-ui/citizen/login",
        state: {
          role: "FSM_DSO",
          from: from
        },
        i18nKey: t(loginLink)
      });
    });
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.CitizenHomeCard, {
      header: t("CS_HOME_FSM_SERVICES"),
      links: links,
      Icon: digitUiReactComponents.CitizenTruck
    });
  } else {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "employee-app-container"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "ground-container"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "employeeCard"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "complaint-links-container"
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "header"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "logo"
    }, /*#__PURE__*/React__default.createElement("svg", {
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
    }))), /*#__PURE__*/React__default.createElement("span", {
      className: "text"
    }, t("ES_TITLE_FSM"))), /*#__PURE__*/React__default.createElement("div", {
      className: "body"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "link"
    }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: matchPath + "/inbox"
    }, t("ES_TITLE_INBOX"))), /*#__PURE__*/React__default.createElement("span", {
      className: "link"
    }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: matchPath + "/new-application/"
    }, t("ES_TITLE_NEW_DESULDGING_APPLICATION"))))))));
  }
};

var componentsToRegister = {
  SelectPropertySubtype: SelectPropertySubtype,
  SelectPropertyType: SelectPropertyType,
  SelectAddress: SelectAddress,
  SelectStreet: SelectStreet,
  SelectLandmark: SelectLandmark,
  SelectPincode: SelectPincode,
  SelectTankSize: SelectTankSize,
  SelectPitType: SelectPitType,
  SelectGeolocation: SelectGeolocation,
  SelectSlumName: SelectSlumName,
  CheckSlum: CheckSlum,
  FSMCard: FSMCard,
  FSMModule: FSMModule,
  FSMLinks: FSMLinks,
  SelectChannel: SelectChannel,
  SelectName: SelectName,
  SelectTripData: SelectTripData
};
var initFSMComponents = function initFSMComponents() {
  Object.entries(componentsToRegister).forEach(function (_ref7) {
    var key = _ref7[0],
        value = _ref7[1];
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

exports.initFSMComponents = initFSMComponents;
//# sourceMappingURL=index.js.map
