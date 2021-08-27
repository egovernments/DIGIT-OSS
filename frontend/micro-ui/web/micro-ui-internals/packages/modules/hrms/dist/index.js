function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactRouterDom = require('react-router-dom');
var reactI18next = require('react-i18next');
var digitUiReactComponents = require('@egovernments/digit-ui-react-components');
var reactHookForm = require('react-hook-form');

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
      onPageSizeChange = _ref.onPageSizeChange;
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Table, {
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

var InboxLinks = function InboxLinks(_ref) {
  var businessService = _ref.businessService,
      allLinks = _ref.allLinks,
      headerText = _ref.headerText;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useState = React.useState([]),
      links = _useState[0],
      setLinks = _useState[1];

  var userRoles = Digit.UserService.getUser().info.roles;
  React.useEffect(function () {
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
    return /*#__PURE__*/React__default.createElement("div", {
      className: "header"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "logo"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.PersonIcon, null)), " ", /*#__PURE__*/React__default.createElement("span", {
      className: "text"
    }, t(headerText)));
  };

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    className: "employeeCard filter inboxLinks"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "complaint-links-container"
  }, GetLogo(), /*#__PURE__*/React__default.createElement("div", {
    className: "body"
  }, links.map(function (_ref4, index) {
    var link = _ref4.link,
        text = _ref4.text,
        _ref4$hyperlink = _ref4.hyperlink,
        hyperlink = _ref4$hyperlink === void 0 ? false : _ref4$hyperlink;
    return /*#__PURE__*/React__default.createElement("span", {
      className: "link",
      key: index
    }, hyperlink ? /*#__PURE__*/React__default.createElement("a", {
      href: link
    }, t(text)) : /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: link
    }, t(text)));
  }))));
};

var SearchApplication = function SearchApplication(_ref) {
  var _searchFields$filter;

  var onSearch = _ref.onSearch,
      type = _ref.type,
      onClose = _ref.onClose,
      searchFields = _ref.searchFields,
      searchParams = _ref.searchParams,
      isInboxPage = _ref.isInboxPage;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useForm = reactHookForm.useForm({
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
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.LinkLabel, {
      style: _extends({
        display: "inline"
      }, mobileViewStyles),
      onClick: clearSearch
    }, t("HR_COMMON_CLEAR_SEARCH"));
  };

  return /*#__PURE__*/React__default.createElement("form", {
    onSubmit: handleSubmit(onSubmitInput)
  }, /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "search-container",
    style: {
      width: "auto",
      marginLeft: isInboxPage ? "24px" : "revert"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "search-complaint-container"
  }, (type === "mobile" || mobileView) && /*#__PURE__*/React__default.createElement("div", {
    className: "complaint-header",
    style: {
      display: 'flex',
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React__default.createElement("h2", null, t("ES_COMMON_SEARCH_BY")), /*#__PURE__*/React__default.createElement("span", {
    onClick: onClose
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CloseSvg, null))), /*#__PURE__*/React__default.createElement("div", {
    className: "complaint-input-container",
    style: {
      width: "100%"
    }
  }, searchFields === null || searchFields === void 0 ? void 0 : (_searchFields$filter = searchFields.filter(function (e) {
    return true;
  })) === null || _searchFields$filter === void 0 ? void 0 : _searchFields$filter.map(function (input, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      key: input.name,
      className: "input-fields"
    }, /*#__PURE__*/React__default.createElement("span", {
      className: "mobile-input"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Label, null, input.label), input.type !== "date" ? /*#__PURE__*/React__default.createElement("div", {
      className: "field-container"
    }, input !== null && input !== void 0 && input.componentInFront ? /*#__PURE__*/React__default.createElement("span", {
      className: "citizen-card-input citizen-card-input--front",
      style: {
        flex: "none"
      }
    }, input === null || input === void 0 ? void 0 : input.componentInFront) : null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({}, input, {
      inputRef: register,
      watch: watch,
      shouldUpdate: true
    }))) : /*#__PURE__*/React__default.createElement(reactHookForm.Controller, {
      render: function render(props) {
        return /*#__PURE__*/React__default.createElement(digitUiReactComponents.DatePicker, {
          date: props.value,
          onChange: props.onChange
        });
      },
      name: input.name,
      control: control,
      defaultValue: null
    }), " "));
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "inbox-action-container"
  }, type === "desktop" && !mobileView && /*#__PURE__*/React__default.createElement("span", {
    style: {
      paddingTop: "9px"
    },
    className: "clear-search"
  }, clearAll()), type === "desktop" && !mobileView && /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    style: {
      marginTop: "unset"
    },
    className: "submit-bar-search",
    label: t("ES_COMMON_SEARCH"),
    submit: true
  })))), (type === "mobile" || mobileView) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.ActionBar, {
    className: "clear-search-container"
  }, /*#__PURE__*/React__default.createElement("button", {
    className: "clear-search",
    style: {
      flex: 1
    }
  }, clearAll(mobileView)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("HR_COMMON_SEARCH"),
    style: {
      flex: 1
    },
    submit: true
  }))));
};

var DesktopInbox = function DesktopInbox(_ref) {
  var _props$data;

  var filterComponent = _ref.filterComponent,
      props = _objectWithoutPropertiesLoose(_ref, ["tableConfig", "filterComponent"]);

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var tenantIds = Digit.SessionStorage.get("HRMS_TENANTS");

  var GetCell = function GetCell(value) {
    return /*#__PURE__*/React__default.createElement("span", {
      className: "cell-text"
    }, t(value));
  };

  var GetSlaCell = function GetSlaCell(value) {
    return value == "INACTIVE" ? /*#__PURE__*/React__default.createElement("span", {
      className: "sla-cell-error"
    }, t(value) || "") : /*#__PURE__*/React__default.createElement("span", {
      className: "sla-cell-success"
    }, t(value) || "");
  };

  var data = props === null || props === void 0 ? void 0 : (_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.Employees;

  var _useState = React.useState(function () {
    var _Digit$ComponentRegis;

    return (_Digit$ComponentRegis = Digit.ComponentRegistryService) === null || _Digit$ComponentRegis === void 0 ? void 0 : _Digit$ComponentRegis.getComponent(filterComponent);
  }),
      FilterComponent = _useState[0];

  var columns = React__default.useMemo(function () {
    return [{
      Header: t("HR_EMP_ID_LABEL"),
      disableSortBy: true,
      Cell: function Cell(_ref2) {
        var row = _ref2.row;
        return /*#__PURE__*/React__default.createElement("span", {
          className: "link"
        }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
          to: "/digit-ui/employee/hrms/details/" + row.original.tenantId + "/" + row.original.code
        }, row.original.code));
      }
    }, {
      Header: t("HR_EMP_NAME_LABEL"),
      disableSortBy: true,
      Cell: function Cell(_ref3) {
        var _row$original, _row$original$user;

        var row = _ref3.row;
        return GetCell("" + ((_row$original = row.original) === null || _row$original === void 0 ? void 0 : (_row$original$user = _row$original.user) === null || _row$original$user === void 0 ? void 0 : _row$original$user.name));
      }
    }, {
      Header: t("HR_ROLE_NO_LABEL"),
      Cell: function Cell(_ref4) {
        var _row$original2, _row$original2$user, _row$original3, _row$original3$user;

        var row = _ref4.row;
        return /*#__PURE__*/React__default.createElement("div", {
          className: "tooltip"
        }, " ", GetCell("" + ((_row$original2 = row.original) === null || _row$original2 === void 0 ? void 0 : (_row$original2$user = _row$original2.user) === null || _row$original2$user === void 0 ? void 0 : _row$original2$user.roles.length)), /*#__PURE__*/React__default.createElement("span", {
          className: "tooltiptext",
          style: {
            whiteSpace: "nowrap"
          }
        }, (_row$original3 = row.original) === null || _row$original3 === void 0 ? void 0 : (_row$original3$user = _row$original3.user) === null || _row$original3$user === void 0 ? void 0 : _row$original3$user.roles.map(function (ele, index) {
          return /*#__PURE__*/React__default.createElement("span", null, index + 1 + ". " + t("ACCESSCONTROL_ROLES_ROLES_" + ele.code), " ", /*#__PURE__*/React__default.createElement("br", null), " ");
        })));
      },
      disableSortBy: true
    }, {
      Header: t("HR_DESG_LABEL"),
      disableSortBy: true,
      Cell: function Cell(_ref5) {
        var _row$original4, _row$original4$assign, _row$original4$assign2;

        var row = _ref5.row;
        return GetCell("" + (t("COMMON_MASTERS_DESIGNATION_" + ((_row$original4 = row.original) === null || _row$original4 === void 0 ? void 0 : (_row$original4$assign = _row$original4.assignments) === null || _row$original4$assign === void 0 ? void 0 : (_row$original4$assign2 = _row$original4$assign.sort(function (a, b) {
          return new Date(a.fromDate) - new Date(b.fromDate);
        })[0]) === null || _row$original4$assign2 === void 0 ? void 0 : _row$original4$assign2.designation)) || ""));
      }
    }, {
      Header: t("HR_DEPT_LABEL"),
      disableSortBy: true,
      Cell: function Cell(_ref6) {
        var _row$original5, _row$original5$assign, _row$original5$assign2;

        var row = _ref6.row;
        return GetCell("" + (t("COMMON_MASTERS_DEPARTMENT_" + ((_row$original5 = row.original) === null || _row$original5 === void 0 ? void 0 : (_row$original5$assign = _row$original5.assignments) === null || _row$original5$assign === void 0 ? void 0 : (_row$original5$assign2 = _row$original5$assign.sort(function (a, b) {
          return new Date(a.fromDate) - new Date(b.fromDate);
        })[0]) === null || _row$original5$assign2 === void 0 ? void 0 : _row$original5$assign2.department)) || ""));
      }
    }, {
      Header: t("HR_STATUS_LABEL"),
      disableSortBy: true,
      Cell: function Cell(_ref7) {
        var _row$original6;

        var row = _ref7.row;
        return GetSlaCell("" + ((_row$original6 = row.original) !== null && _row$original6 !== void 0 && _row$original6.isActive ? "ACTIVE" : "INACTIVE"));
      }
    }];
  }, []);
  var result;

  if (props.isLoading) {
    result = /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  } else if ((data === null || data === void 0 ? void 0 : data.length) === 0) {
    result = /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
      style: {
        marginTop: 20
      }
    }, t("COMMON_TABLE_NO_RECORD_FOUND").split("\\n").map(function (text, index) {
      return /*#__PURE__*/React__default.createElement("p", {
        key: index,
        style: {
          textAlign: "center"
        }
      }, text);
    }));
  } else if ((data === null || data === void 0 ? void 0 : data.length) > 0) {
    var _React$createElement;

    result = /*#__PURE__*/React__default.createElement(ApplicationTable, (_React$createElement = {
      t: t,
      data: data,
      columns: columns,
      getCellProps: function getCellProps(cellInfo) {
        return {
          style: {
            maxWidth: cellInfo.column.Header == t("HR_EMP_ID_LABEL") ? "150px" : "",
            padding: "20px 18px",
            fontSize: "16px",
            minWidth: "150px"
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
  }, !props.isSearch && /*#__PURE__*/React__default.createElement("div", {
    className: "filters-container"
  }, /*#__PURE__*/React__default.createElement(InboxLinks, {
    parentRoute: props.parentRoute,
    allLinks: [{
      text: "HR_COMMON_CREATE_EMPLOYEE_HEADER",
      link: "/digit-ui/employee/hrms/create",
      businessService: "hrms",
      roles: ["HRMS_ADMIN"]
    }],
    headerText: "HRMS",
    businessService: props.businessService
  }), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(FilterComponent, {
    defaultSearchParams: props.defaultSearchParams,
    onFilterChange: props.onFilterChange,
    searchParams: props.searchParams,
    type: "desktop",
    tenantIds: tenantIds
  }))), /*#__PURE__*/React__default.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React__default.createElement(SearchApplication, {
    defaultSearchParams: props.defaultSearchParams,
    onSearch: props.onSearch,
    type: "desktop",
    tenantIds: tenantIds,
    searchFields: props.searchFields,
    isInboxPage: !(props !== null && props !== void 0 && props.isSearch),
    searchParams: props.searchParams
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "result",
    style: {
      marginLeft: !(props !== null && props !== void 0 && props.isSearch) ? "24px" : "",
      flex: 1
    }
  }, result)));
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
var convertEpochFormateToDate = function convertEpochFormateToDate(dateEpoch) {
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
var getCityThatUserhasAccess = function getCityThatUserhasAccess(cities) {
  var _userInfo$info, _Digit$Utils, _Digit$Utils$hrmsRole;

  if (cities === void 0) {
    cities = [];
  }

  var userInfo = Digit.UserService.getUser();
  var roleObject = {};
  userInfo === null || userInfo === void 0 ? void 0 : (_userInfo$info = userInfo.info) === null || _userInfo$info === void 0 ? void 0 : _userInfo$info.roles.map(function (roleData) {
    roleObject[roleData === null || roleData === void 0 ? void 0 : roleData.code] = roleObject[roleData === null || roleData === void 0 ? void 0 : roleData.code] ? [].concat(roleObject[roleData === null || roleData === void 0 ? void 0 : roleData.code], [roleData === null || roleData === void 0 ? void 0 : roleData.tenantId]) : [roleData === null || roleData === void 0 ? void 0 : roleData.tenantId];
  });
  var tenant = Digit.ULBService.getCurrentTenantId();

  if (roleObject[(_Digit$Utils = Digit.Utils) === null || _Digit$Utils === void 0 ? void 0 : (_Digit$Utils$hrmsRole = _Digit$Utils.hrmsRoles) === null || _Digit$Utils$hrmsRole === void 0 ? void 0 : _Digit$Utils$hrmsRole[0]].includes(tenant === null || tenant === void 0 ? void 0 : tenant.split('.')[0])) {
    return cities;
  }

  return cities.filter(function (city) {
    var _roleObject$Digit$Uti, _Digit$Utils2, _Digit$Utils2$hrmsRol;

    return (_roleObject$Digit$Uti = roleObject[(_Digit$Utils2 = Digit.Utils) === null || _Digit$Utils2 === void 0 ? void 0 : (_Digit$Utils2$hrmsRol = _Digit$Utils2.hrmsRoles) === null || _Digit$Utils2$hrmsRol === void 0 ? void 0 : _Digit$Utils2$hrmsRol[0]]) === null || _roleObject$Digit$Uti === void 0 ? void 0 : _roleObject$Digit$Uti.includes(city === null || city === void 0 ? void 0 : city.code);
  });
};

var Filter = function Filter(_ref) {
  var _searchParams$filters, _getCityThatUserhasAc, _data$MdmsRes, _data$MdmsRes$common, _data$MdmsRes$ACCESSC;

  var searchParams = _ref.searchParams,
      onFilterChange = _ref.onFilterChange,
      props = _objectWithoutPropertiesLoose(_ref, ["searchParams", "onFilterChange", "onSearch", "removeParam"]);

  var _useState = React.useState((searchParams === null || searchParams === void 0 ? void 0 : (_searchParams$filters = searchParams.filters) === null || _searchParams$filters === void 0 ? void 0 : _searchParams$filters.role) || {
    role: []
  }),
      filters = _useState[0],
      onSelectFilterRoles = _useState[1];

  var _useState2 = React.useState(function () {
    return searchParams;
  }),
      _searchParams = _useState2[0],
      setSearchParams = _useState2[1];

  var _useState3 = React.useState(null),
      selectedRoles = _useState3[0],
      onSelectFilterRolessetSelectedRole = _useState3[1];

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var tenantIds = Digit.SessionStorage.get("HRMS_TENANTS");

  function onSelectRoles(value, type) {
    if (!ifExists(filters.role, value)) {
      onSelectFilterRoles(_extends({}, filters, {
        role: [].concat(filters.role, [value])
      }));
    }
  }

  var onRemove = function onRemove(index, key) {
    var _extends2;

    var afterRemove = filters[key].filter(function (value, i) {
      return i !== index;
    });
    onSelectFilterRoles(_extends({}, filters, (_extends2 = {}, _extends2[key] = afterRemove, _extends2)));
  };

  React.useEffect(function () {
    if (filters.role.length > 1) {
      onSelectFilterRolessetSelectedRole({
        name: filters.role.length + " selected"
      });
    } else {
      onSelectFilterRolessetSelectedRole(filters.role[0]);
    }
  }, [filters.role]);

  var _useState4 = React.useState(function () {
    return tenantIds.filter(function (ele) {
      var _ref2;

      return ele.code == ((_ref2 = (searchParams === null || searchParams === void 0 ? void 0 : searchParams.tenantId) != undefined ? {
        code: searchParams === null || searchParams === void 0 ? void 0 : searchParams.tenantId
      } : {
        code: Digit.ULBService.getCurrentTenantId()
      }) === null || _ref2 === void 0 ? void 0 : _ref2.code);
    })[0];
  }),
      tenantId = _useState4[0],
      settenantId = _useState4[1];

  var _Digit$Hooks$hrms$use = Digit.Hooks.hrms.useHrmsMDMS(tenantId ? tenantId.code : searchParams === null || searchParams === void 0 ? void 0 : searchParams.tenantId, "egov-hrms", "HRMSRolesandDesignation"),
      data = _Digit$Hooks$hrms$use.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$hrms$use, ["isLoading", "isError", "errors", "data"]);

  var _useState5 = React.useState(function () {
    return {
      departments: null
    };
  }),
      departments = _useState5[0],
      setDepartments = _useState5[1];

  var _useState6 = React.useState(function () {
    return {
      roles: null
    };
  }),
      roles = _useState6[0],
      setRoles = _useState6[1];

  var _useState7 = React.useState(function () {
    return {
      isActive: true
    };
  }),
      isActive = _useState7[0],
      setIsactive = _useState7[1];

  React.useEffect(function () {
    if (tenantId.code) {
      setSearchParams(_extends({}, _searchParams, {
        tenantId: tenantId.code
      }));
    }
  }, [tenantId]);
  React.useEffect(function () {
    if (filters.role && filters.role.length > 0) {
      var res = [];
      filters.role.forEach(function (ele) {
        res.push(ele.code);
      });
      setSearchParams(_extends({}, _searchParams, {
        roles: [].concat(res).join(",")
      }));

      if (filters.role && filters.role.length > 1) {
        var _res = [];
        filters.role.forEach(function (ele) {
          _res.push(ele.code);
        });
        setSearchParams(_extends({}, _searchParams, {
          roles: [].concat(_res).join(",")
        }));
      }
    }
  }, [filters.role]);
  React.useEffect(function () {
    if (departments) {
      setSearchParams(_extends({}, _searchParams, {
        departments: departments.code
      }));
    }
  }, [departments]);
  React.useEffect(function () {
    if (roles) {
      setSearchParams(_extends({}, _searchParams, {
        roles: roles.code
      }));
    }
  }, [roles]);

  var ifExists = function ifExists(list, key) {
    return list === null || list === void 0 ? void 0 : list.filter(function (object) {
      return object.code === key.code;
    }).length;
  };

  React.useEffect(function () {
    if (isActive) {
      setSearchParams(_extends({}, _searchParams, {
        isActive: isActive.code
      }));
    }
  }, [isActive]);

  var clearAll = function clearAll() {
    var _props$onClose;

    onFilterChange({
      delete: Object.keys(searchParams)
    });
    settenantId(tenantIds.filter(function (ele) {
      return ele.code == Digit.ULBService.getCurrentTenantId();
    })[0]);
    setDepartments(null);
    setRoles(null);
    setIsactive(null);
    props === null || props === void 0 ? void 0 : (_props$onClose = props.onClose) === null || _props$onClose === void 0 ? void 0 : _props$onClose.call(props);
    onSelectFilterRoles({
      role: []
    });
  };

  var GetSelectOptions = function GetSelectOptions(lable, options, selected, _select, optionKey, onRemove, key) {
    var _ref3, _filters$role, _filters$role2;

    selected = selected || (_ref3 = {}, _ref3[optionKey] = " ", _ref3.code = "", _ref3);
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
      className: "filter-label"
    }, lable), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
      option: options,
      selected: selected,
      select: function select(value) {
        return _select(value, key);
      },
      optionKey: optionKey
    }), /*#__PURE__*/React__default.createElement("div", {
      className: "tag-container"
    }, (filters === null || filters === void 0 ? void 0 : (_filters$role = filters.role) === null || _filters$role === void 0 ? void 0 : _filters$role.length) > 0 && (filters === null || filters === void 0 ? void 0 : (_filters$role2 = filters.role) === null || _filters$role2 === void 0 ? void 0 : _filters$role2.map(function (value, index) {
      return /*#__PURE__*/React__default.createElement(digitUiReactComponents.RemoveableTag, {
        key: index,
        text: value[optionKey].slice(0, 22) + " ...",
        onClick: function onClick() {
          return onRemove(index, key);
        }
      });
    }))));
  };

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    className: "filter"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-card"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "heading"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-label",
    style: {
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React__default.createElement("span", null, /*#__PURE__*/React__default.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 22 22",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0.66666 2.48016C3.35999 5.9335 8.33333 12.3335 8.33333 12.3335V20.3335C8.33333 21.0668 8.93333 21.6668 9.66666 21.6668H12.3333C13.0667 21.6668 13.6667 21.0668 13.6667 20.3335V12.3335C13.6667 12.3335 18.6267 5.9335 21.32 2.48016C22 1.60016 21.3733 0.333496 20.2667 0.333496H1.71999C0.613327 0.333496 -0.01334 1.60016 0.66666 2.48016Z",
    fill: "#505A5F"
  }))), /*#__PURE__*/React__default.createElement("span", null, t("HR_COMMON_FILTER"), ":"), " "), /*#__PURE__*/React__default.createElement("div", {
    className: "clearAll",
    onClick: clearAll
  }, t("HR_COMMON_CLEAR_ALL")), props.type === "desktop" && /*#__PURE__*/React__default.createElement("span", {
    className: "clear-search",
    onClick: clearAll,
    style: {
      border: "1px solid #e0e0e0",
      padding: "6px"
    }
  }, /*#__PURE__*/React__default.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 16 22",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M8 5V8L12 4L8 0V3C3.58 3 0 6.58 0 11C0 12.57 0.46 14.03 1.24 15.26L2.7 13.8C2.25 12.97 2 12.01 2 11C2 7.69 4.69 5 8 5ZM14.76 6.74L13.3 8.2C13.74 9.04 14 9.99 14 11C14 14.31 11.31 17 8 17V14L4 18L8 22V19C12.42 19 16 15.42 16 11C16 9.43 15.54 7.97 14.76 6.74Z",
    fill: "#505A5F"
  }))), props.type === "mobile" && /*#__PURE__*/React__default.createElement("span", {
    onClick: props.onClose
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CloseSvg, null))), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-label"
  }, t("HR_ULB_LABEL")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    option: [].concat((_getCityThatUserhasAc = getCityThatUserhasAccess(tenantIds)) === null || _getCityThatUserhasAc === void 0 ? void 0 : _getCityThatUserhasAc.sort(function (x, y) {
      var _x$name;

      return x === null || x === void 0 ? void 0 : (_x$name = x.name) === null || _x$name === void 0 ? void 0 : _x$name.localeCompare(y === null || y === void 0 ? void 0 : y.name);
    }).map(function (city) {
      return _extends({}, city, {
        i18text: Digit.Utils.locale.getCityLocale(city.code)
      });
    })),
    selected: tenantId,
    select: settenantId,
    optionKey: "i18text",
    t: t
  })), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-label"
  }, t("HR_COMMON_TABLE_COL_DEPT")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    option: Digit.Utils.locale.convertToLocaleData(data === null || data === void 0 ? void 0 : (_data$MdmsRes = data.MdmsRes) === null || _data$MdmsRes === void 0 ? void 0 : (_data$MdmsRes$common = _data$MdmsRes["common-masters"]) === null || _data$MdmsRes$common === void 0 ? void 0 : _data$MdmsRes$common.Department, 'COMMON_MASTERS_DEPARTMENT'),
    selected: departments,
    select: setDepartments,
    optionKey: "i18text",
    t: t
  })), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", null, GetSelectOptions(t("HR_COMMON_TABLE_COL_ROLE"), Digit.Utils.locale.convertToLocaleData(data === null || data === void 0 ? void 0 : (_data$MdmsRes$ACCESSC = data.MdmsRes["ACCESSCONTROL-ROLES"]) === null || _data$MdmsRes$ACCESSC === void 0 ? void 0 : _data$MdmsRes$ACCESSC.roles, 'ACCESSCONTROL_ROLES_ROLES', t), selectedRoles, onSelectRoles, "i18text", onRemove, "role"))), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "filter-label"
  }, t("HR_EMP_STATUS_LABEL")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioButtons, {
    onSelect: setIsactive,
    selected: isActive,
    selectedOption: isActive,
    optionsKey: "name",
    options: [{
      code: true,
      name: t("HR_ACTIVATE_HEAD")
    }, {
      code: false,
      name: t("HR_DEACTIVATE_HEAD")
    }]
  }), props.type !== "mobile" && /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    onSubmit: function onSubmit() {
      return onFilterChange(_searchParams);
    },
    label: t("HR_COMMON_APPLY")
  })))))), props.type === "mobile" && /*#__PURE__*/React__default.createElement(digitUiReactComponents.ActionBar, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.ApplyFilterBar, {
    submit: false,
    labelLink: t("ES_COMMON_CLEAR_ALL"),
    buttonLink: t("ES_COMMON_FILTER"),
    onClear: clearAll,
    onSubmit: function onSubmit() {
      var _props$onClose2;

      onFilterChange(_searchParams);
      props === null || props === void 0 ? void 0 : (_props$onClose2 = props.onClose) === null || _props$onClose2 === void 0 ? void 0 : _props$onClose2.call(props);
    },
    style: {
      flex: 1
    }
  })));
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

  var onSearchPara = function onSearchPara(param) {
    onFilterChange(_extends({}, params, param));
    setType("");
    setPopup(false);
    onSearch();
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

  if (isLoading) {
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
  }), !isSearch && onFilterChange && /*#__PURE__*/React__default.createElement(digitUiReactComponents.FilterAction, {
    text: "FILTER",
    handleActionClick: function handleActionClick() {
      setType("FILTER");
      setPopup(true);
    }
  })), result, popup && /*#__PURE__*/React__default.createElement(digitUiReactComponents.PopUp, null, type === "FILTER" && /*#__PURE__*/React__default.createElement("div", {
    className: "popup-module"
  }, /*#__PURE__*/React__default.createElement(Filter, {
    onFilterChange: onFilterChange,
    onClose: handlePopupClose,
    onSearch: onSearchPara,
    type: "mobile",
    searchParams: params,
    removeParam: removeParam
  })), type === "SEARCH" && /*#__PURE__*/React__default.createElement("div", {
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

var MobileInbox = function MobileInbox(_ref) {
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
      filterComponent = _ref.filterComponent;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var GetCell = function GetCell(value) {
    return /*#__PURE__*/React__default.createElement("span", {
      className: "cell-text"
    }, t(value));
  };

  var GetSlaCell = function GetSlaCell(value) {
    return value == "INACTIVE" ? /*#__PURE__*/React__default.createElement("span", {
      className: "sla-cell-error"
    }, t(value) || "") : /*#__PURE__*/React__default.createElement("span", {
      className: "sla-cell-success"
    }, t(value) || "");
  };

  var getData = function getData() {
    var _data$Employees;

    return data === null || data === void 0 ? void 0 : (_data$Employees = data.Employees) === null || _data$Employees === void 0 ? void 0 : _data$Employees.map(function (original) {
      var _original$user, _original$user2, _original$assignments, _original$assignments2, _original$assignments3, _original$assignments4, _ref2;

      return _ref2 = {}, _ref2[t("HR_EMP_ID_LABEL")] = original === null || original === void 0 ? void 0 : original.code, _ref2[t("HR_EMP_NAME_LABEL")] = GetCell((original === null || original === void 0 ? void 0 : (_original$user = original.user) === null || _original$user === void 0 ? void 0 : _original$user.name) || ""), _ref2[t("HR_ROLE_NO_LABEL")] = GetCell((original === null || original === void 0 ? void 0 : (_original$user2 = original.user) === null || _original$user2 === void 0 ? void 0 : _original$user2.roles.length) || ""), _ref2[t("HR_DESG_LABEL")] = GetCell(t("COMMON_MASTERS_DESIGNATION_" + (original === null || original === void 0 ? void 0 : (_original$assignments = original.assignments) === null || _original$assignments === void 0 ? void 0 : (_original$assignments2 = _original$assignments.sort(function (a, b) {
        return new Date(a.fromDate) - new Date(b.fromDate);
      })[0]) === null || _original$assignments2 === void 0 ? void 0 : _original$assignments2.designation))), _ref2[t("HR_DEPT_LABEL")] = GetCell(t("COMMON_MASTERS_DEPARTMENT_" + (original === null || original === void 0 ? void 0 : (_original$assignments3 = original.assignments) === null || _original$assignments3 === void 0 ? void 0 : (_original$assignments4 = _original$assignments3.sort(function (a, b) {
        return new Date(a.fromDate) - new Date(b.fromDate);
      })[0]) === null || _original$assignments4 === void 0 ? void 0 : _original$assignments4.department))), _ref2[t("HR_STATUS_LABEL")] = GetSlaCell(original !== null && original !== void 0 && original.isActive ? "ACTIVE" : "INACTIVE"), _ref2;
    });
  };

  var serviceRequestIdKey = function serviceRequestIdKey(original) {
    return (searchParams === null || searchParams === void 0 ? void 0 : searchParams.tenantId) + "/" + (original === null || original === void 0 ? void 0 : original[t("HR_EMP_ID_LABEL")]);
  };

  return /*#__PURE__*/React__default.createElement("div", {
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "inbox-container"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "filters-container"
  }, /*#__PURE__*/React__default.createElement(ApplicationCard, {
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
    filterComponent: filterComponent,
    serviceRequestIdKey: serviceRequestIdKey
  }))));
};

var Inbox = function Inbox(_ref) {
  var _sortParams$, _sortParams$2;

  var parentRoute = _ref.parentRoute,
      _ref$businessService = _ref.businessService,
      businessService = _ref$businessService === void 0 ? "HRMS" : _ref$businessService,
      _ref$initialStates = _ref.initialStates,
      initialStates = _ref$initialStates === void 0 ? {} : _ref$initialStates,
      filterComponent = _ref.filterComponent,
      isInbox = _ref.isInbox;
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$Hooks$hrms$use = Digit.Hooks.hrms.useHRMSCount(tenantId),
      isLoading = _Digit$Hooks$hrms$use.isLoading,
      res = _Digit$Hooks$hrms$use.data;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useState = React.useState(initialStates.pageOffset || 0),
      pageOffset = _useState[0],
      setPageOffset = _useState[1];

  var _useState2 = React.useState(initialStates.pageSize || 10),
      pageSize = _useState2[0],
      setPageSize = _useState2[1];

  var _useState3 = React.useState(initialStates.sortParams || [{
    id: "createdTime",
    desc: false
  }]),
      sortParams = _useState3[0],
      setSortParams = _useState3[1];

  var _useState4 = React.useState(undefined),
      totalRecords = _useState4[0];

  var _useState5 = React.useState(function () {
    return initialStates.searchParams || {};
  }),
      searchParams = _useState5[0],
      setSearchParams = _useState5[1];

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
  var isupdate = Digit.SessionStorage.get("isupdate");

  var _Digit$Hooks$hrms$use2 = Digit.Hooks.hrms.useHRMSSearch(searchParams, tenantId, paginationParams, isupdate),
      hookLoading = _Digit$Hooks$hrms$use2.isLoading,
      data = _Digit$Hooks$hrms$use2.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$hrms$use2, ["isLoading", "isError", "error", "data"]);

  React.useEffect(function () {}, [res]);
  React.useEffect(function () {}, [hookLoading, rest]);
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

    var _new = _extends({}, searchParams, filterParam);

    if (keys_to_delete) keys_to_delete.forEach(function (key) {
      return delete _new[key];
    });
    delete _new.delete;
    setSearchParams(_extends({}, _new));
  };

  var handleSort = React.useCallback(function (args) {
    if (args.length === 0) return;
    setSortParams(args);
  }, []);

  var handlePageSizeChange = function handlePageSizeChange(e) {
    setPageSize(Number(e.target.value));
  };

  var getSearchFields = function getSearchFields() {
    return [{
      label: t("HR_NAME_LABEL"),
      name: "names"
    }, {
      label: t("HR_MOB_NO_LABEL"),
      name: "phone",
      maxlength: 10,
      pattern: "[6-9][0-9]{9}",
      title: t("ES_SEARCH_APPLICATION_MOBILE_INVALID"),
      componentInFront: "+91"
    }, {
      label: t("HR_EMPLOYEE_ID_LABEL"),
      name: "codes"
    }];
  };

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  if ((data === null || data === void 0 ? void 0 : data.length) !== null) {
    if (isMobile) {
      return /*#__PURE__*/React__default.createElement(MobileInbox, {
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
        tableConfig: rest === null || rest === void 0 ? void 0 : rest.tableConfig,
        onPrevPage: fetchPrevPage,
        currentPage: Math.floor(pageOffset / pageSize),
        pageSizeLimit: pageSize,
        disableSort: false,
        onPageSizeChange: handlePageSizeChange,
        parentRoute: parentRoute,
        searchParams: searchParams,
        sortParams: sortParams,
        totalRecords: totalRecords,
        linkPrefix: '/digit-ui/employee/hrms/details/',
        filterComponent: filterComponent
      });
    } else {
      return /*#__PURE__*/React__default.createElement("div", null, isInbox && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, null, t("HR_HOME_SEARCH_RESULTS_HEADING")), /*#__PURE__*/React__default.createElement(DesktopInbox, {
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

var HRMSCard = function HRMSCard() {
  var _data$EmployeCount, _data$EmployeCount2;

  var ADMIN = Digit.Utils.hrmsAccess();

  if (!ADMIN) {
    return null;
  }

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _Digit$Hooks$hrms$use = Digit.Hooks.hrms.useHRMSCount(tenantId),
      isLoading = _Digit$Hooks$hrms$use.isLoading,
      data = _Digit$Hooks$hrms$use.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$hrms$use, ["isLoading", "isError", "error", "data"]);

  var propsForModuleCard = {
    Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.PersonIcon, null),
    moduleName: t("ACTION_TEST_HRMS"),
    kpis: [{
      count: isLoading ? "-" : data === null || data === void 0 ? void 0 : (_data$EmployeCount = data.EmployeCount) === null || _data$EmployeCount === void 0 ? void 0 : _data$EmployeCount.totalEmployee,
      label: t("TOTAL_EMPLOYEES"),
      link: "/digit-ui/employee/hrms/inbox"
    }, {
      count: isLoading ? "-" : data === null || data === void 0 ? void 0 : (_data$EmployeCount2 = data.EmployeCount) === null || _data$EmployeCount2 === void 0 ? void 0 : _data$EmployeCount2.activeEmployee,
      label: t("ACTIVE_EMPLOYEES"),
      link: "/digit-ui/employee/hrms/inbox"
    }],
    links: [{
      label: t("HR_HOME_SEARCH_RESULTS_HEADING"),
      link: "/digit-ui/employee/hrms/inbox"
    }, {
      label: t("HR_COMMON_CREATE_EMPLOYEE_HEADER"),
      link: "/digit-ui/employee/hrms/create"
    }]
  };
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.EmployeeModuleCard, propsForModuleCard);
};

var newConfig = [{
  head: "Personal Details",
  body: [{
    type: "component",
    component: "SelectEmployeeName",
    key: "SelectEmployeeName",
    withoutLabel: true
  }, {
    type: "component",
    component: "SelectEmployeePhoneNumber",
    key: "SelectEmployeePhoneNumber",
    withoutLabel: true
  }, {
    type: "component",
    component: "SelectEmployeeGender",
    key: "SelectEmployeeGender",
    withoutLabel: true
  }, {
    type: "component",
    component: "SelectDateofBirthEmployment",
    key: "SelectDateofBirthEmployment",
    withoutLabel: true
  }, {
    type: "component",
    component: "SelectEmployeeEmailId",
    key: "SelectEmployeeEmailId",
    withoutLabel: true
  }, {
    type: "component",
    component: "SelectEmployeeCorrespondenceAddress",
    key: "SelectEmployeeCorrespondenceAddress",
    withoutLabel: true
  }]
}, {
  head: "HR_NEW_EMPLOYEE_FORM_HEADER",
  body: [{
    type: "component",
    component: "SelectEmployeeType",
    key: "SelectEmployeeType",
    withoutLabel: true
  }, {
    type: "component",
    component: "SelectDateofEmployment",
    key: "SelectDateofEmployment",
    withoutLabel: true
  }, {
    type: "component",
    component: "SelectEmployeeId",
    key: "SelectEmployeeId",
    withoutLabel: true
  }, {
    type: "component",
    component: "Banner",
    key: "Banner1",
    withoutLabel: true,
    texts: {
      headerCaption: "Info",
      header: "HR_EMP_ID_MESSAGE"
    }
  }]
}, {
  head: "HR_JURISDICTION_DETAILS_HEADER",
  body: [{
    type: "component",
    isMandatory: true,
    component: "Jurisdictions",
    key: "Jurisdictions",
    withoutLabel: true
  }]
}, {
  head: "HR_ASSIGN_DET_HEADER",
  body: [{
    type: "component",
    component: "HRBanner",
    key: "Banner2",
    withoutLabel: true,
    texts: {
      nosideText: true,
      headerCaption: "Info",
      header: "HR_ASSIGN_DET_SUB_HEADER"
    }
  }, {
    type: "component",
    component: "Assignments",
    key: "Assignments",
    withoutLabel: true
  }]
}];

var CreateEmployee = function CreateEmployee() {
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useState = React.useState(false),
      canSubmit = _useState[0],
      setSubmitValve = _useState[1];

  var _useState2 = React.useState(null),
      mobileNumber = _useState2[0],
      setMobileNumber = _useState2[1];

  var _useState3 = React.useState(null),
      showToast = _useState3[0],
      setShowToast = _useState3[1];

  var _useState4 = React.useState(false),
      phonecheck = _useState4[0],
      setPhonecheck = _useState4[1];

  var _useState5 = React.useState(false),
      checkfield = _useState5[0],
      setcheck = _useState5[1];

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_HAPPENED", false),
      setMutationHappened = _Digit$Hooks$useSessi[1];

  var _Digit$Hooks$useSessi2 = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_ERROR_DATA", false),
      clearError = _Digit$Hooks$useSessi2[2];

  var _Digit$Hooks$useSessi3 = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_SUCCESS_DATA", false),
      clearSuccessData = _Digit$Hooks$useSessi3[2];

  React.useEffect(function () {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  var checkMailNameNum = function checkMailNameNum(formData) {
    var _formData$SelectEmplo, _formData$SelectEmplo2, _formData$SelectEmplo3;

    var email = (formData === null || formData === void 0 ? void 0 : (_formData$SelectEmplo = formData.SelectEmployeeEmailId) === null || _formData$SelectEmplo === void 0 ? void 0 : _formData$SelectEmplo.emailId) || '';
    var name = (formData === null || formData === void 0 ? void 0 : (_formData$SelectEmplo2 = formData.SelectEmployeeName) === null || _formData$SelectEmplo2 === void 0 ? void 0 : _formData$SelectEmplo2.employeeName) || '';
    var address = (formData === null || formData === void 0 ? void 0 : (_formData$SelectEmplo3 = formData.SelectEmployeeCorrespondenceAddress) === null || _formData$SelectEmplo3 === void 0 ? void 0 : _formData$SelectEmplo3.correspondenceAddress) || '';
    var validEmail = email.length == 0 ? true : email.match(Digit.Utils.getPattern('Email'));
    return validEmail && name.match(Digit.Utils.getPattern('Name')) && address.match(Digit.Utils.getPattern('Address'));
  };

  React.useEffect(function () {
    if (mobileNumber && mobileNumber.length == 10 && mobileNumber.match(Digit.Utils.getPattern('MobileNo'))) {
      setShowToast(null);
      Digit.HRMSService.search(tenantId, null, {
        phone: mobileNumber
      }).then(function (result, err) {
        if (result.Employees.length > 0) {
          setShowToast({
            key: true,
            label: "ERR_HRMS_USER_EXIST_MOB"
          });
          setPhonecheck(false);
        } else {
          setPhonecheck(true);
        }
      });
    } else {
      setPhonecheck(false);
    }
  }, [mobileNumber]);
  var defaultValues = {
    Jurisdictions: [{
      id: undefined,
      key: 1,
      hierarchy: null,
      boundaryType: null,
      boundary: {
        code: tenantId
      },
      roles: []
    }]
  };

  var onFormValueChange = function onFormValueChange(setValue, formData) {
    var _formData$SelectEmplo4, _formData$SelectDateo, _formData$SelectEmplo7, _formData$SelectEmplo8, _formData$SelectEmplo9, _formData$SelectEmplo10, _formData$SelectEmplo11;

    if (formData !== null && formData !== void 0 && (_formData$SelectEmplo4 = formData.SelectEmployeePhoneNumber) !== null && _formData$SelectEmplo4 !== void 0 && _formData$SelectEmplo4.mobileNumber) {
      var _formData$SelectEmplo5;

      setMobileNumber(formData === null || formData === void 0 ? void 0 : (_formData$SelectEmplo5 = formData.SelectEmployeePhoneNumber) === null || _formData$SelectEmplo5 === void 0 ? void 0 : _formData$SelectEmplo5.mobileNumber);
    } else {
      var _formData$SelectEmplo6;

      setMobileNumber(formData === null || formData === void 0 ? void 0 : (_formData$SelectEmplo6 = formData.SelectEmployeePhoneNumber) === null || _formData$SelectEmplo6 === void 0 ? void 0 : _formData$SelectEmplo6.mobileNumber);
    }

    for (var i = 0; i < (formData === null || formData === void 0 ? void 0 : (_formData$Jurisdictio = formData.Jurisdictions) === null || _formData$Jurisdictio === void 0 ? void 0 : _formData$Jurisdictio.length); i++) {
      var _formData$Jurisdictio, _key$roles;

      var key = formData === null || formData === void 0 ? void 0 : formData.Jurisdictions[i];

      if (!(key !== null && key !== void 0 && key.boundary && key !== null && key !== void 0 && key.boundaryType && key !== null && key !== void 0 && key.hierarchy && key !== null && key !== void 0 && key.tenantId && (key === null || key === void 0 ? void 0 : (_key$roles = key.roles) === null || _key$roles === void 0 ? void 0 : _key$roles.length) > 0)) {
        setcheck(false);
        break;
      } else {
        setcheck(true);
      }
    }

    var setassigncheck = false;

    for (var _i = 0; _i < (formData === null || formData === void 0 ? void 0 : (_formData$Assignments = formData.Assignments) === null || _formData$Assignments === void 0 ? void 0 : _formData$Assignments.length); _i++) {
      var _formData$Assignments, _formData$Assignments2, _formData$Assignments3;

      var _key = formData === null || formData === void 0 ? void 0 : formData.Assignments[_i];

      if (!(_key.department && _key.designation && _key.fromDate && (formData !== null && formData !== void 0 && formData.Assignments[_i].toDate || formData !== null && formData !== void 0 && (_formData$Assignments2 = formData.Assignments[_i]) !== null && _formData$Assignments2 !== void 0 && _formData$Assignments2.isCurrentAssignment))) {
        setassigncheck = false;
        break;
      } else if ((formData === null || formData === void 0 ? void 0 : formData.Assignments[_i].toDate) == null && (formData === null || formData === void 0 ? void 0 : (_formData$Assignments3 = formData.Assignments[_i]) === null || _formData$Assignments3 === void 0 ? void 0 : _formData$Assignments3.isCurrentAssignment) == false) {
        setassigncheck = false;
        break;
      } else {
        setassigncheck = true;
      }
    }

    if (formData !== null && formData !== void 0 && (_formData$SelectDateo = formData.SelectDateofEmployment) !== null && _formData$SelectDateo !== void 0 && _formData$SelectDateo.dateOfAppointment && formData !== null && formData !== void 0 && (_formData$SelectEmplo7 = formData.SelectEmployeeCorrespondenceAddress) !== null && _formData$SelectEmplo7 !== void 0 && _formData$SelectEmplo7.correspondenceAddress && formData !== null && formData !== void 0 && (_formData$SelectEmplo8 = formData.SelectEmployeeGender) !== null && _formData$SelectEmplo8 !== void 0 && _formData$SelectEmplo8.gender.code && formData !== null && formData !== void 0 && (_formData$SelectEmplo9 = formData.SelectEmployeeName) !== null && _formData$SelectEmplo9 !== void 0 && _formData$SelectEmplo9.employeeName && formData !== null && formData !== void 0 && (_formData$SelectEmplo10 = formData.SelectEmployeeType) !== null && _formData$SelectEmplo10 !== void 0 && _formData$SelectEmplo10.code && formData !== null && formData !== void 0 && (_formData$SelectEmplo11 = formData.SelectEmployeePhoneNumber) !== null && _formData$SelectEmplo11 !== void 0 && _formData$SelectEmplo11.mobileNumber && checkfield && setassigncheck && phonecheck && checkMailNameNum(formData)) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  };

  var navigateToAcknowledgement = function navigateToAcknowledgement(Employees) {
    history.replace("/digit-ui/employee/hrms/response", {
      Employees: Employees,
      key: "CREATE",
      action: "CREATE"
    });
  };

  var onSubmit = function onSubmit(data) {
    var _data$Jurisdictions, _data$SelectEmployeeI, _data$SelectEmployeeI2, _data$SelectDateofEmp, _data$SelectEmployeeT, _data$SelectEmployeeP, _data$SelectEmployeeN, _data$SelectEmployeeC, _data$SelectEmployeeE, _data$SelectEmployeeE2, _data$SelectEmployeeG, _data$SelectDateofBir, _data$SelectEmployeeI3, _data$SelectEmployeeI4, _data$SelectEmployeeI5;

    if (data.Jurisdictions.filter(function (juris) {
      return juris.tenantId == tenantId;
    }).length == 0) {
      setShowToast({
        key: true,
        label: "ERR_BASE_TENANT_MANDATORY"
      });
      return;
    }

    if (!Object.values(data.Jurisdictions.reduce(function (acc, sum) {
      if (sum && sum !== null && sum !== void 0 && sum.tenantId) {
        acc[sum.tenantId] = acc[sum.tenantId] ? acc[sum.tenantId] + 1 : 1;
      }

      return acc;
    }, {})).every(function (s) {
      return s == 1;
    })) {
      setShowToast({
        key: true,
        label: "ERR_INVALID_JURISDICTION"
      });
      return;
    }

    var roles = data === null || data === void 0 ? void 0 : (_data$Jurisdictions = data.Jurisdictions) === null || _data$Jurisdictions === void 0 ? void 0 : _data$Jurisdictions.map(function (ele) {
      var _ele$roles;

      return (_ele$roles = ele.roles) === null || _ele$roles === void 0 ? void 0 : _ele$roles.map(function (item) {
        item["tenantId"] = ele.boundary;
        return item;
      });
    });
    var mappedroles = [].concat.apply([], roles);
    var Employees = [{
      tenantId: tenantId,
      employeeStatus: "EMPLOYED",
      assignments: data === null || data === void 0 ? void 0 : data.Assignments,
      code: data !== null && data !== void 0 && (_data$SelectEmployeeI = data.SelectEmployeeId) !== null && _data$SelectEmployeeI !== void 0 && _data$SelectEmployeeI.code ? data === null || data === void 0 ? void 0 : (_data$SelectEmployeeI2 = data.SelectEmployeeId) === null || _data$SelectEmployeeI2 === void 0 ? void 0 : _data$SelectEmployeeI2.code : undefined,
      dateOfAppointment: new Date(data === null || data === void 0 ? void 0 : (_data$SelectDateofEmp = data.SelectDateofEmployment) === null || _data$SelectDateofEmp === void 0 ? void 0 : _data$SelectDateofEmp.dateOfAppointment).getTime(),
      employeeType: data === null || data === void 0 ? void 0 : (_data$SelectEmployeeT = data.SelectEmployeeType) === null || _data$SelectEmployeeT === void 0 ? void 0 : _data$SelectEmployeeT.code,
      jurisdictions: data === null || data === void 0 ? void 0 : data.Jurisdictions,
      user: {
        mobileNumber: data === null || data === void 0 ? void 0 : (_data$SelectEmployeeP = data.SelectEmployeePhoneNumber) === null || _data$SelectEmployeeP === void 0 ? void 0 : _data$SelectEmployeeP.mobileNumber,
        name: data === null || data === void 0 ? void 0 : (_data$SelectEmployeeN = data.SelectEmployeeName) === null || _data$SelectEmployeeN === void 0 ? void 0 : _data$SelectEmployeeN.employeeName,
        correspondenceAddress: data === null || data === void 0 ? void 0 : (_data$SelectEmployeeC = data.SelectEmployeeCorrespondenceAddress) === null || _data$SelectEmployeeC === void 0 ? void 0 : _data$SelectEmployeeC.correspondenceAddress,
        emailId: data !== null && data !== void 0 && (_data$SelectEmployeeE = data.SelectEmployeeEmailId) !== null && _data$SelectEmployeeE !== void 0 && _data$SelectEmployeeE.emailId ? data === null || data === void 0 ? void 0 : (_data$SelectEmployeeE2 = data.SelectEmployeeEmailId) === null || _data$SelectEmployeeE2 === void 0 ? void 0 : _data$SelectEmployeeE2.emailId : undefined,
        gender: data === null || data === void 0 ? void 0 : (_data$SelectEmployeeG = data.SelectEmployeeGender) === null || _data$SelectEmployeeG === void 0 ? void 0 : _data$SelectEmployeeG.gender.code,
        dob: new Date(data === null || data === void 0 ? void 0 : (_data$SelectDateofBir = data.SelectDateofBirthEmployment) === null || _data$SelectDateofBir === void 0 ? void 0 : _data$SelectDateofBir.dob).getTime(),
        roles: mappedroles,
        tenantId: tenantId
      },
      serviceHistory: [],
      education: [],
      tests: []
    }];

    if (data !== null && data !== void 0 && (_data$SelectEmployeeI3 = data.SelectEmployeeId) !== null && _data$SelectEmployeeI3 !== void 0 && _data$SelectEmployeeI3.code && (data === null || data === void 0 ? void 0 : (_data$SelectEmployeeI4 = data.SelectEmployeeId) === null || _data$SelectEmployeeI4 === void 0 ? void 0 : (_data$SelectEmployeeI5 = _data$SelectEmployeeI4.code) === null || _data$SelectEmployeeI5 === void 0 ? void 0 : _data$SelectEmployeeI5.trim().length) > 0) {
      var _data$SelectEmployeeI6;

      Digit.HRMSService.search(tenantId, null, {
        codes: data === null || data === void 0 ? void 0 : (_data$SelectEmployeeI6 = data.SelectEmployeeId) === null || _data$SelectEmployeeI6 === void 0 ? void 0 : _data$SelectEmployeeI6.code
      }).then(function (result, err) {
        if (result.Employees.length > 0) {
          setShowToast({
            key: true,
            label: "ERR_HRMS_USER_EXIST_ID"
          });
          return;
        } else {
          navigateToAcknowledgement(Employees);
        }
      });
    } else {
      navigateToAcknowledgement(Employees);
    }
  };

  var config = newConfig;
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormComposer, {
    defaultValues: defaultValues,
    heading: t("HR_COMMON_CREATE_EMPLOYEE_HEADER"),
    config: config,
    onSubmit: onSubmit,
    onFormValueChange: onFormValueChange,
    isDisabled: !canSubmit,
    label: t("HR_COMMON_BUTTON_SUBMIT")
  }), showToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: showToast.key,
    label: t(showToast.label),
    onClose: function onClose() {
      setShowToast(null);
    }
  }));
};

var EditForm = function EditForm(_ref) {
  var _data$user, _data$user2, _data$user3, _data$user4, _data$user5, _data$user6, _data$user7;

  var tenantId = _ref.tenantId,
      data = _ref.data;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();

  var _useState = React.useState(false),
      canSubmit = _useState[0],
      setSubmitValve = _useState[1];

  var _useState2 = React.useState(null),
      showToast = _useState2[0],
      setShowToast = _useState2[1];

  var _useState3 = React.useState(null),
      mobileNumber = _useState3[0],
      setMobileNumber = _useState3[1];

  var _useState4 = React.useState(false),
      phonecheck = _useState4[0],
      setPhonecheck = _useState4[1];

  var _useState5 = React.useState(false),
      checkfield = _useState5[0],
      setcheck = _useState5[1];

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_ERROR_DATA", false),
      clearError = _Digit$Hooks$useSessi[2];

  var _Digit$Hooks$useSessi2 = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_HAPPENED", false),
      setMutationHappened = _Digit$Hooks$useSessi2[1];

  var _Digit$Hooks$useSessi3 = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_SUCCESS_DATA", false),
      clearSuccessData = _Digit$Hooks$useSessi3[2];

  React.useEffect(function () {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);
  React.useEffect(function () {
    if (mobileNumber && mobileNumber.length == 10 && mobileNumber.match(Digit.Utils.getPattern('MobileNo'))) {
      setShowToast(null);

      if (data.user.mobileNumber == mobileNumber) {
        setPhonecheck(true);
      } else {
        Digit.HRMSService.search(tenantId, null, {
          phone: mobileNumber
        }).then(function (result, err) {
          if (result.Employees.length > 0) {
            setShowToast({
              key: true,
              label: "ERR_HRMS_USER_EXIST_MOB"
            });
            setPhonecheck(false);
          } else {
            setPhonecheck(true);
          }
        });
      }
    } else {
      setPhonecheck(false);
    }
  }, [mobileNumber]);
  var defaultValues = {
    tenantId: tenantId,
    employeeStatus: "EMPLOYED",
    employeeType: data === null || data === void 0 ? void 0 : data.code,
    SelectEmployeePhoneNumber: {
      mobileNumber: data === null || data === void 0 ? void 0 : (_data$user = data.user) === null || _data$user === void 0 ? void 0 : _data$user.mobileNumber
    },
    SelectEmployeeId: {
      code: data === null || data === void 0 ? void 0 : data.code
    },
    SelectEmployeeName: {
      employeeName: data === null || data === void 0 ? void 0 : (_data$user2 = data.user) === null || _data$user2 === void 0 ? void 0 : _data$user2.name
    },
    SelectEmployeeEmailId: {
      emailId: data === null || data === void 0 ? void 0 : (_data$user3 = data.user) === null || _data$user3 === void 0 ? void 0 : _data$user3.emailId
    },
    SelectEmployeeCorrespondenceAddress: {
      correspondenceAddress: data === null || data === void 0 ? void 0 : (_data$user4 = data.user) === null || _data$user4 === void 0 ? void 0 : _data$user4.correspondenceAddress
    },
    SelectDateofEmployment: {
      dateOfAppointment: convertEpochToDate(data === null || data === void 0 ? void 0 : data.dateOfAppointment)
    },
    SelectEmployeeType: {
      code: data === null || data === void 0 ? void 0 : data.employeeType,
      active: true
    },
    SelectEmployeeGender: {
      gender: {
        code: data === null || data === void 0 ? void 0 : (_data$user5 = data.user) === null || _data$user5 === void 0 ? void 0 : _data$user5.gender,
        name: "COMMON_GENDER_" + (data === null || data === void 0 ? void 0 : (_data$user6 = data.user) === null || _data$user6 === void 0 ? void 0 : _data$user6.gender)
      }
    },
    SelectDateofBirthEmployment: {
      dob: convertEpochToDate(data === null || data === void 0 ? void 0 : (_data$user7 = data.user) === null || _data$user7 === void 0 ? void 0 : _data$user7.dob)
    },
    Jurisdictions: data === null || data === void 0 ? void 0 : data.jurisdictions.map(function (ele, index) {
      var _data$user8;

      return Object.assign({}, ele, {
        key: index,
        hierarchy: {
          code: ele.hierarchy,
          name: ele.hierarchy
        },
        boundaryType: {
          label: ele.boundaryType
        },
        boundary: {
          code: ele.boundary
        },
        roles: data === null || data === void 0 ? void 0 : (_data$user8 = data.user) === null || _data$user8 === void 0 ? void 0 : _data$user8.roles.filter(function (item) {
          return item.tenantId == ele.boundary;
        })
      });
    }),
    Assignments: data === null || data === void 0 ? void 0 : data.assignments.map(function (ele, index) {
      return Object.assign({}, ele, {
        key: index,
        fromDate: convertEpochToDate(ele.fromDate),
        toDate: convertEpochToDate(ele.toDate),
        isCurrentAssignment: ele.isCurrentAssignment,
        designation: {
          code: ele.designation,
          i18key: "COMMON_MASTERS_DESIGNATION_" + ele.designation
        },
        department: {
          code: ele.department,
          i18key: "COMMON_MASTERS_DEPARTMENT_" + ele.department
        }
      });
    })
  };

  var checkMailNameNum = function checkMailNameNum(formData) {
    var _formData$SelectEmplo, _formData$SelectEmplo2, _formData$SelectEmplo3;

    var email = (formData === null || formData === void 0 ? void 0 : (_formData$SelectEmplo = formData.SelectEmployeeEmailId) === null || _formData$SelectEmplo === void 0 ? void 0 : _formData$SelectEmplo.emailId) || '';
    var name = (formData === null || formData === void 0 ? void 0 : (_formData$SelectEmplo2 = formData.SelectEmployeeName) === null || _formData$SelectEmplo2 === void 0 ? void 0 : _formData$SelectEmplo2.employeeName) || '';
    var address = (formData === null || formData === void 0 ? void 0 : (_formData$SelectEmplo3 = formData.SelectEmployeeCorrespondenceAddress) === null || _formData$SelectEmplo3 === void 0 ? void 0 : _formData$SelectEmplo3.correspondenceAddress) || '';
    var validEmail = email.length == 0 ? true : email.match(Digit.Utils.getPattern('Email'));
    return validEmail && name.match(Digit.Utils.getPattern('Name')) && address.match(Digit.Utils.getPattern('Address'));
  };

  var onFormValueChange = function onFormValueChange(setValue, formData) {
    var _formData$SelectEmplo4, _formData$SelectDateo, _formData$SelectEmplo7, _formData$SelectEmplo8, _formData$SelectEmplo9, _formData$SelectEmplo10;

    if (formData !== null && formData !== void 0 && (_formData$SelectEmplo4 = formData.SelectEmployeePhoneNumber) !== null && _formData$SelectEmplo4 !== void 0 && _formData$SelectEmplo4.mobileNumber) {
      var _formData$SelectEmplo5;

      setMobileNumber(formData === null || formData === void 0 ? void 0 : (_formData$SelectEmplo5 = formData.SelectEmployeePhoneNumber) === null || _formData$SelectEmplo5 === void 0 ? void 0 : _formData$SelectEmplo5.mobileNumber);
    } else {
      var _formData$SelectEmplo6;

      setMobileNumber(formData === null || formData === void 0 ? void 0 : (_formData$SelectEmplo6 = formData.SelectEmployeePhoneNumber) === null || _formData$SelectEmplo6 === void 0 ? void 0 : _formData$SelectEmplo6.mobileNumber);
    }

    for (var i = 0; i < (formData === null || formData === void 0 ? void 0 : (_formData$Jurisdictio = formData.Jurisdictions) === null || _formData$Jurisdictio === void 0 ? void 0 : _formData$Jurisdictio.length); i++) {
      var _formData$Jurisdictio, _key$roles;

      var key = formData === null || formData === void 0 ? void 0 : formData.Jurisdictions[i];

      if (!(key !== null && key !== void 0 && key.boundary && key !== null && key !== void 0 && key.boundaryType && key !== null && key !== void 0 && key.hierarchy && key !== null && key !== void 0 && key.tenantId && (key === null || key === void 0 ? void 0 : (_key$roles = key.roles) === null || _key$roles === void 0 ? void 0 : _key$roles.length) > 0)) {
        setcheck(false);
        break;
      } else {
        setcheck(true);
      }
    }

    var setassigncheck = false;

    for (var _i = 0; _i < (formData === null || formData === void 0 ? void 0 : (_formData$Assignments = formData.Assignments) === null || _formData$Assignments === void 0 ? void 0 : _formData$Assignments.length); _i++) {
      var _formData$Assignments, _formData$Assignments2, _formData$Assignments3;

      var _key = formData === null || formData === void 0 ? void 0 : formData.Assignments[_i];

      if (!(_key.department && _key.designation && _key.fromDate && (formData !== null && formData !== void 0 && formData.Assignments[_i].toDate || formData !== null && formData !== void 0 && (_formData$Assignments2 = formData.Assignments[_i]) !== null && _formData$Assignments2 !== void 0 && _formData$Assignments2.isCurrentAssignment))) {
        setassigncheck = false;
        break;
      } else if ((formData === null || formData === void 0 ? void 0 : formData.Assignments[_i].toDate) == null && (formData === null || formData === void 0 ? void 0 : (_formData$Assignments3 = formData.Assignments[_i]) === null || _formData$Assignments3 === void 0 ? void 0 : _formData$Assignments3.isCurrentAssignment) == false) {
        setassigncheck = false;
        break;
      } else {
        setassigncheck = true;
      }
    }

    if (formData !== null && formData !== void 0 && (_formData$SelectDateo = formData.SelectDateofEmployment) !== null && _formData$SelectDateo !== void 0 && _formData$SelectDateo.dateOfAppointment && formData !== null && formData !== void 0 && (_formData$SelectEmplo7 = formData.SelectEmployeeCorrespondenceAddress) !== null && _formData$SelectEmplo7 !== void 0 && _formData$SelectEmplo7.correspondenceAddress && formData !== null && formData !== void 0 && (_formData$SelectEmplo8 = formData.SelectEmployeeGender) !== null && _formData$SelectEmplo8 !== void 0 && _formData$SelectEmplo8.gender.code && formData !== null && formData !== void 0 && (_formData$SelectEmplo9 = formData.SelectEmployeeName) !== null && _formData$SelectEmplo9 !== void 0 && _formData$SelectEmplo9.employeeName && formData !== null && formData !== void 0 && (_formData$SelectEmplo10 = formData.SelectEmployeePhoneNumber) !== null && _formData$SelectEmplo10 !== void 0 && _formData$SelectEmplo10.mobileNumber && checkfield && setassigncheck && phonecheck && checkMailNameNum(formData)) {
      setSubmitValve(true);
    } else {
      setSubmitValve(false);
    }
  };

  var onSubmit = function onSubmit(input) {
    var _input$Jurisdictions, _input$SelectDateofEm, _input$SelectEmployee, _input$SelectEmployee2, _input$SelectEmployee3, _input$SelectEmployee4, _input$SelectEmployee5, _input$SelectDateofBi, _input$SelectEmployee6, _input$SelectEmployee7, _input$SelectEmployee8;

    if (input.Jurisdictions.filter(function (juris) {
      return juris.tenantId == tenantId && juris.isActive !== false;
    }).length == 0) {
      setShowToast({
        key: true,
        label: "ERR_BASE_TENANT_MANDATORY"
      });
      return;
    }

    if (!Object.values(input.Jurisdictions.reduce(function (acc, sum) {
      if (sum && sum !== null && sum !== void 0 && sum.tenantId) {
        acc[sum.tenantId] = acc[sum.tenantId] ? acc[sum.tenantId] + 1 : 1;
      }

      return acc;
    }, {})).every(function (s) {
      return s == 1;
    })) {
      setShowToast({
        key: true,
        label: "ERR_INVALID_JURISDICTION"
      });
      return;
    }

    var roles = input === null || input === void 0 ? void 0 : (_input$Jurisdictions = input.Jurisdictions) === null || _input$Jurisdictions === void 0 ? void 0 : _input$Jurisdictions.map(function (ele) {
      var _ele$roles;

      return (_ele$roles = ele.roles) === null || _ele$roles === void 0 ? void 0 : _ele$roles.map(function (item) {
        item["tenantId"] = ele.boundary;
        return item;
      });
    });
    var requestdata = Object.assign({}, data);
    roles = [].concat.apply([], roles);
    requestdata.assignments = input === null || input === void 0 ? void 0 : input.Assignments;
    requestdata.dateOfAppointment = Date.parse(input === null || input === void 0 ? void 0 : (_input$SelectDateofEm = input.SelectDateofEmployment) === null || _input$SelectDateofEm === void 0 ? void 0 : _input$SelectDateofEm.dateOfAppointment);
    requestdata.code = input !== null && input !== void 0 && (_input$SelectEmployee = input.SelectEmployeeId) !== null && _input$SelectEmployee !== void 0 && _input$SelectEmployee.code ? input === null || input === void 0 ? void 0 : (_input$SelectEmployee2 = input.SelectEmployeeId) === null || _input$SelectEmployee2 === void 0 ? void 0 : _input$SelectEmployee2.code : undefined;
    requestdata.jurisdictions = input === null || input === void 0 ? void 0 : input.Jurisdictions;
    requestdata.user.emailId = input !== null && input !== void 0 && (_input$SelectEmployee3 = input.SelectEmployeeEmailId) !== null && _input$SelectEmployee3 !== void 0 && _input$SelectEmployee3.emailId ? input === null || input === void 0 ? void 0 : (_input$SelectEmployee4 = input.SelectEmployeeEmailId) === null || _input$SelectEmployee4 === void 0 ? void 0 : _input$SelectEmployee4.emailId : undefined;
    requestdata.user.gender = input === null || input === void 0 ? void 0 : (_input$SelectEmployee5 = input.SelectEmployeeGender) === null || _input$SelectEmployee5 === void 0 ? void 0 : _input$SelectEmployee5.gender.code;
    requestdata.user.dob = Date.parse(input === null || input === void 0 ? void 0 : (_input$SelectDateofBi = input.SelectDateofBirthEmployment) === null || _input$SelectDateofBi === void 0 ? void 0 : _input$SelectDateofBi.dob);
    requestdata.user.mobileNumber = input === null || input === void 0 ? void 0 : (_input$SelectEmployee6 = input.SelectEmployeePhoneNumber) === null || _input$SelectEmployee6 === void 0 ? void 0 : _input$SelectEmployee6.mobileNumber;
    requestdata["user"]["name"] = input === null || input === void 0 ? void 0 : (_input$SelectEmployee7 = input.SelectEmployeeName) === null || _input$SelectEmployee7 === void 0 ? void 0 : _input$SelectEmployee7.employeeName;
    requestdata.user.correspondenceAddress = input === null || input === void 0 ? void 0 : (_input$SelectEmployee8 = input.SelectEmployeeCorrespondenceAddress) === null || _input$SelectEmployee8 === void 0 ? void 0 : _input$SelectEmployee8.correspondenceAddress;
    requestdata.user.roles = roles;
    var Employees = [requestdata];
    history.replace("/digit-ui/employee/hrms/response", {
      Employees: Employees,
      key: "UPDATE",
      action: "UPDATE"
    });
  };

  var configs = newConfig;
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormComposer, {
    heading: t("HR_COMMON_EDIT_EMPLOYEE_HEADER"),
    isDisabled: !canSubmit,
    label: t("HR_COMMON_BUTTON_SUBMIT"),
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
  }), " ", showToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: showToast.key,
    label: t(showToast.label),
    onClose: function onClose() {
      setShowToast(null);
    }
  }));
};

var EditEmpolyee = function EditEmpolyee(_ref) {
  var isupdate = Digit.SessionStorage.get("isupdate");

  var _useParams = reactRouterDom.useParams(),
      employeeId = _useParams.id;

  var _useParams2 = reactRouterDom.useParams(),
      tenantId = _useParams2.tenantId;

  var _Digit$Hooks$hrms$use = Digit.Hooks.hrms.useHRMSSearch({
    codes: employeeId
  }, tenantId, isupdate),
      isLoading = _Digit$Hooks$hrms$use.isLoading,
      data = _Digit$Hooks$hrms$use.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$hrms$use, ["isLoading", "isError", "error", "data"]);

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(EditForm, {
    data: data === null || data === void 0 ? void 0 : data.Employees[0],
    tenantId: tenantId
  });
};

var cleanup = function cleanup(payload) {
  if (payload) {
    return Object.keys(payload).reduce(function (acc, key) {
      if (payload[key] === undefined) {
        return acc;
      }

      acc[key] = typeof payload[key] === "object" ? cleanup(payload[key]) : payload[key];
      return acc;
    }, {});
  }
};

var Jurisdictions = function Jurisdictions(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useState = React.useState([]),
      inactiveJurisdictions = _useState[0],
      setInactiveJurisdictions = _useState[1];

  var _ref2 = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation") || {},
      _ref2$data = _ref2.data,
      data = _ref2$data === void 0 ? {} : _ref2$data,
      isLoading = _ref2.isLoading;

  var _useState2 = React.useState((formData === null || formData === void 0 ? void 0 : formData.Jurisdictions) || [{
    id: undefined,
    key: 1,
    hierarchy: null,
    boundaryType: null,
    boundary: null,
    roles: []
  }]),
      jurisdictions = _useState2[0],
      setjurisdictions = _useState2[1];

  React.useEffect(function () {
    var jurisdictionsData = jurisdictions === null || jurisdictions === void 0 ? void 0 : jurisdictions.map(function (jurisdiction) {
      var _jurisdiction$hierarc, _jurisdiction$boundar, _jurisdiction$boundar2, _jurisdiction$boundar3;

      var res = {
        id: jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.id,
        hierarchy: jurisdiction === null || jurisdiction === void 0 ? void 0 : (_jurisdiction$hierarc = jurisdiction.hierarchy) === null || _jurisdiction$hierarc === void 0 ? void 0 : _jurisdiction$hierarc.code,
        boundaryType: jurisdiction === null || jurisdiction === void 0 ? void 0 : (_jurisdiction$boundar = jurisdiction.boundaryType) === null || _jurisdiction$boundar === void 0 ? void 0 : _jurisdiction$boundar.label,
        boundary: jurisdiction === null || jurisdiction === void 0 ? void 0 : (_jurisdiction$boundar2 = jurisdiction.boundary) === null || _jurisdiction$boundar2 === void 0 ? void 0 : _jurisdiction$boundar2.code,
        tenantId: jurisdiction === null || jurisdiction === void 0 ? void 0 : (_jurisdiction$boundar3 = jurisdiction.boundary) === null || _jurisdiction$boundar3 === void 0 ? void 0 : _jurisdiction$boundar3.code,
        auditDetails: jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.auditDetails
      };
      res = cleanup(res);

      if (jurisdiction !== null && jurisdiction !== void 0 && jurisdiction.roles) {
        res["roles"] = jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.roles.map(function (ele) {
          delete ele.description;
          return ele;
        });
      }

      return res;
    });
    onSelect(config.key, [].concat(jurisdictionsData, inactiveJurisdictions).filter(function (value) {
      return Object.keys(value).length !== 0;
    }));
  }, [jurisdictions]);

  var reviseIndexKeys = function reviseIndexKeys() {
    setjurisdictions(function (prev) {
      return prev.map(function (unit, index) {
        return _extends({}, unit, {
          key: index
        });
      });
    });
  };

  var handleAddUnit = function handleAddUnit() {
    setjurisdictions(function (prev) {
      return [].concat(prev, [{
        key: prev.length + 1,
        hierarchy: null,
        boundaryType: null,
        boundary: null,
        roles: []
      }]);
    });
  };

  var handleRemoveUnit = function handleRemoveUnit(unit) {
    var _FormData$errors, _FormData$errors$Juri;

    if (unit.id) {
      var _unit$hierarchy, _unit$boundaryType, _unit$boundary, _unit$boundary2;

      var res = {
        id: unit === null || unit === void 0 ? void 0 : unit.id,
        hierarchy: unit === null || unit === void 0 ? void 0 : (_unit$hierarchy = unit.hierarchy) === null || _unit$hierarchy === void 0 ? void 0 : _unit$hierarchy.code,
        boundaryType: unit === null || unit === void 0 ? void 0 : (_unit$boundaryType = unit.boundaryType) === null || _unit$boundaryType === void 0 ? void 0 : _unit$boundaryType.label,
        boundary: unit === null || unit === void 0 ? void 0 : (_unit$boundary = unit.boundary) === null || _unit$boundary === void 0 ? void 0 : _unit$boundary.code,
        tenantId: unit === null || unit === void 0 ? void 0 : (_unit$boundary2 = unit.boundary) === null || _unit$boundary2 === void 0 ? void 0 : _unit$boundary2.code,
        auditDetails: unit === null || unit === void 0 ? void 0 : unit.auditDetails,
        isdeleted: true,
        isActive: false
      };
      res = cleanup(res);

      if (unit !== null && unit !== void 0 && unit.roles) {
        res["roles"] = unit === null || unit === void 0 ? void 0 : unit.roles.map(function (ele) {
          delete ele.description;
          return ele;
        });
      }

      setInactiveJurisdictions([].concat(inactiveJurisdictions, [res]));
    }

    setjurisdictions(function (prev) {
      return prev.filter(function (el) {
        return el.key !== unit.key;
      });
    });

    if (((_FormData$errors = FormData.errors) === null || _FormData$errors === void 0 ? void 0 : (_FormData$errors$Juri = _FormData$errors.Jurisdictions) === null || _FormData$errors$Juri === void 0 ? void 0 : _FormData$errors$Juri.type) == unit.key) {
      clearErrors("Jurisdictions");
    }

    reviseIndexKeys();
  };

  var hierarchylist = [];
  var boundaryTypeoption = [];

  var _useState3 = React.useState(-1),
      focusIndex = _useState3[0],
      setFocusIndex = _useState3[1];

  function gethierarchylistdata() {
    var _data$MdmsRes;

    return data === null || data === void 0 ? void 0 : (_data$MdmsRes = data.MdmsRes) === null || _data$MdmsRes === void 0 ? void 0 : _data$MdmsRes["egov-location"]["TenantBoundary"].map(function (ele) {
      return ele.hierarchyType;
    });
  }

  function getboundarydata() {
    return [];
  }

  function getroledata() {
    var _data$MdmsRes2;

    return data === null || data === void 0 ? void 0 : (_data$MdmsRes2 = data.MdmsRes) === null || _data$MdmsRes2 === void 0 ? void 0 : _data$MdmsRes2["ACCESSCONTROL-ROLES"].roles.map(function (role) {
      return {
        code: role.code,
        name: 'ACCESSCONTROL_ROLES_ROLES_' + role.code
      };
    });
  }

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement("div", null, jurisdictions === null || jurisdictions === void 0 ? void 0 : jurisdictions.map(function (jurisdiction, index) {
    return /*#__PURE__*/React__default.createElement(Jurisdiction, {
      t: t,
      formData: formData,
      jurisdictions: jurisdictions,
      key: index,
      keys: jurisdiction.key,
      data: data,
      jurisdiction: jurisdiction,
      setjurisdictions: setjurisdictions,
      index: index,
      focusIndex: focusIndex,
      setFocusIndex: setFocusIndex,
      gethierarchylistdata: gethierarchylistdata,
      hierarchylist: hierarchylist,
      boundaryTypeoption: boundaryTypeoption,
      getboundarydata: getboundarydata,
      getroledata: getroledata,
      handleRemoveUnit: handleRemoveUnit
    });
  }), /*#__PURE__*/React__default.createElement("label", {
    onClick: handleAddUnit,
    className: "link-label",
    style: {
      width: "12rem"
    }
  }, t("HR_ADD_JURISDICTION")));
};

function Jurisdiction(_ref3) {
  var t = _ref3.t,
      data = _ref3.data,
      jurisdiction = _ref3.jurisdiction,
      jurisdictions = _ref3.jurisdictions,
      setjurisdictions = _ref3.setjurisdictions,
      gethierarchylistdata = _ref3.gethierarchylistdata,
      handleRemoveUnit = _ref3.handleRemoveUnit,
      hierarchylist = _ref3.hierarchylist,
      getroledata = _ref3.getroledata,
      roleoption = _ref3.roleoption,
      index = _ref3.index;

  var _useState4 = React.useState([]),
      BoundaryType = _useState4[0],
      selectBoundaryType = _useState4[1];

  var _useState5 = React.useState([]),
      Boundary = _useState5[0],
      selectboundary = _useState5[1];

  React.useEffect(function () {
    var _data$MdmsRes3;

    selectBoundaryType(data === null || data === void 0 ? void 0 : (_data$MdmsRes3 = data.MdmsRes) === null || _data$MdmsRes3 === void 0 ? void 0 : _data$MdmsRes3["egov-location"]["TenantBoundary"].filter(function (ele) {
      var _ele$hierarchyType, _jurisdiction$hierarc2;

      return (ele === null || ele === void 0 ? void 0 : (_ele$hierarchyType = ele.hierarchyType) === null || _ele$hierarchyType === void 0 ? void 0 : _ele$hierarchyType.code) == (jurisdiction === null || jurisdiction === void 0 ? void 0 : (_jurisdiction$hierarc2 = jurisdiction.hierarchy) === null || _jurisdiction$hierarc2 === void 0 ? void 0 : _jurisdiction$hierarc2.code);
    }).map(function (item) {
      return _extends({}, item.boundary, {
        i18text: Digit.Utils.locale.convertToLocale(item.boundary.label, 'EGOV_LOCATION_BOUNDARYTYPE')
      });
    }));
  }, [jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.hierarchy, data === null || data === void 0 ? void 0 : data.MdmsRes]);
  var tenant = Digit.ULBService.getCurrentTenantId();
  React.useEffect(function () {
    var _data$MdmsRes4, _data$MdmsRes4$tenant;

    selectboundary(data === null || data === void 0 ? void 0 : (_data$MdmsRes4 = data.MdmsRes) === null || _data$MdmsRes4 === void 0 ? void 0 : (_data$MdmsRes4$tenant = _data$MdmsRes4.tenant) === null || _data$MdmsRes4$tenant === void 0 ? void 0 : _data$MdmsRes4$tenant.tenants.filter(function (city) {
      return city.code != tenant.split('.')[0];
    }).map(function (city) {
      return _extends({}, city, {
        i18text: Digit.Utils.locale.getCityLocale(city.code)
      });
    }));
  }, [jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.boundaryType, data === null || data === void 0 ? void 0 : data.MdmsRes]);
  React.useEffect(function () {
    if ((Boundary === null || Boundary === void 0 ? void 0 : Boundary.length) > 0) {
      selectedboundary(Boundary === null || Boundary === void 0 ? void 0 : Boundary.filter(function (ele) {
        var _jurisdiction$boundar4;

        return ele.code == (jurisdiction === null || jurisdiction === void 0 ? void 0 : (_jurisdiction$boundar4 = jurisdiction.boundary) === null || _jurisdiction$boundar4 === void 0 ? void 0 : _jurisdiction$boundar4.code);
      })[0]);
    }
  }, [Boundary]);

  var selectHierarchy = function selectHierarchy(value) {
    setjurisdictions(function (pre) {
      return pre.map(function (item) {
        return item.key === jurisdiction.key ? _extends({}, item, {
          hierarchy: value
        }) : item;
      });
    });
  };

  var selectboundaryType = function selectboundaryType(value) {
    setjurisdictions(function (pre) {
      return pre.map(function (item) {
        return item.key === jurisdiction.key ? _extends({}, item, {
          boundaryType: value
        }) : item;
      });
    });
  };

  var selectedboundary = function selectedboundary(value) {
    setjurisdictions(function (pre) {
      return pre.map(function (item) {
        return item.key === jurisdiction.key ? _extends({}, item, {
          boundary: value
        }) : item;
      });
    });
  };

  var selectrole = function selectrole(e, data) {
    var index = jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.roles.filter(function (ele) {
      return ele.code == data.code;
    });
    var res = null;

    if (index.length) {
      jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.roles.splice(jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.roles.indexOf(index[0]), 1);
      res = jurisdiction.roles;
    } else {
      res = [_extends({}, data)].concat(jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.roles);
    }

    setjurisdictions(function (pre) {
      return pre.map(function (item) {
        return item.key === jurisdiction.key ? _extends({}, item, {
          roles: res
        }) : item;
      });
    });
  };

  var onRemove = function onRemove(index, key) {
    var afterRemove = jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.roles.filter(function (value, i) {
      return i !== index;
    });
    setjurisdictions(function (pre) {
      return pre.map(function (item) {
        return item.key === jurisdiction.key ? _extends({}, item, {
          roles: afterRemove
        }) : item;
      });
    });
  };

  return /*#__PURE__*/React__default.createElement("div", {
    key: jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.keys,
    style: {
      marginBottom: "16px"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    style: {
      border: "1px solid #E3E3E3",
      padding: "16px",
      marginTop: "8px"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement("div", {
    className: "label-field-pair",
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React__default.createElement("h2", {
    className: "card-label card-label-smaller",
    style: {
      color: "#505A5F"
    }
  }, t("HR_JURISDICTION"), " ", index + 1)), jurisdictions.length > 1 ? /*#__PURE__*/React__default.createElement("div", {
    onClick: function onClick() {
      return handleRemoveUnit(jurisdiction);
    },
    style: {
      marginBottom: "16px",
      padding: "5px",
      cursor: "pointer",
      textAlign: "right"
    }
  }, "X") : null), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    isMandatory: true,
    className: "card-label-smaller"
  }, t("HR_HIERARCHY_LABEL") + " * "), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    className: "form-field",
    selected: jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.hierarchy,
    disable: false,
    isMandatory: true,
    option: gethierarchylistdata(hierarchylist) || [],
    select: selectHierarchy,
    optionKey: "code",
    t: t
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "card-label-smaller"
  }, t("HR_BOUNDARY_TYPE_LABEL") + " * "), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    className: "form-field",
    isMandatory: true,
    selected: jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.boundaryType,
    disable: (BoundaryType === null || BoundaryType === void 0 ? void 0 : BoundaryType.length) === 0,
    option: BoundaryType,
    select: selectboundaryType,
    optionKey: "i18text",
    t: t
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "card-label-smaller"
  }, t("HR_BOUNDARY_LABEL") + " * "), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    className: "form-field",
    isMandatory: true,
    selected: jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.boundary,
    disable: (Boundary === null || Boundary === void 0 ? void 0 : Boundary.length) === 0,
    option: Boundary,
    select: selectedboundary,
    optionKey: "i18text",
    t: t
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "card-label-smaller"
  }, t("HR_COMMON_TABLE_COL_ROLE"), " *"), /*#__PURE__*/React__default.createElement("div", {
    className: "form-field"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.MultiSelectDropdown, {
    className: "form-field",
    isMandatory: true,
    defaultUnit: "Selected",
    selected: jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.roles,
    options: getroledata(roleoption),
    onSelect: selectrole,
    optionsKey: "name",
    t: t
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "tag-container"
  }, (jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.roles.length) > 0 && (jurisdiction === null || jurisdiction === void 0 ? void 0 : jurisdiction.roles.map(function (value, index) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.RemoveableTag, {
      key: index,
      text: t(value["name"]).slice(0, 22) + " ...",
      onClick: function onClick() {
        return onRemove(index);
      }
    });
  })))))));
}

var Assignments = function Assignments(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      formData = _ref.formData;
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _ref2 = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "HRMSRolesandDesignation") || {},
      _ref2$data = _ref2.data,
      data = _ref2$data === void 0 ? {} : _ref2$data,
      isLoading = _ref2.isLoading;

  var _useState = React.useState(null),
      currentassignemtDate = _useState[0],
      setCurrentAssiginmentDate = _useState[1];

  var _useState2 = React.useState((formData === null || formData === void 0 ? void 0 : formData.Assignments) || [{
    key: 1,
    fromDate: undefined,
    toDate: undefined,
    isCurrentAssignment: false,
    department: null,
    designation: null
  }]),
      assignments = _useState2[0],
      setassignments = _useState2[1];

  var reviseIndexKeys = function reviseIndexKeys() {
    setassignments(function (prev) {
      return prev.map(function (unit, index) {
        return _extends({}, unit, {
          key: index
        });
      });
    });
  };

  var handleAddUnit = function handleAddUnit() {
    setassignments(function (prev) {
      return [].concat(prev, [{
        key: prev.length + 1,
        fromDate: undefined,
        toDate: undefined,
        isCurrentAssignment: false,
        department: null,
        designation: null
      }]);
    });
  };

  var handleRemoveUnit = function handleRemoveUnit(unit) {
    var _FormData$errors, _FormData$errors$Assi;

    setassignments(function (prev) {
      return prev.filter(function (el) {
        return el.key !== unit.key;
      });
    });

    if (((_FormData$errors = FormData.errors) === null || _FormData$errors === void 0 ? void 0 : (_FormData$errors$Assi = _FormData$errors.Assignments) === null || _FormData$errors$Assi === void 0 ? void 0 : _FormData$errors$Assi.type) == unit.key) {
      clearErrors("Jurisdictions");
    }

    reviseIndexKeys();
  };

  React.useEffect(function () {
    var promises = assignments === null || assignments === void 0 ? void 0 : assignments.map(function (assignment) {
      var _assignment$departmen, _assignment$designati;

      return assignment ? cleanup({
        id: assignment === null || assignment === void 0 ? void 0 : assignment.id,
        position: assignment === null || assignment === void 0 ? void 0 : assignment.position,
        govtOrderNumber: assignment === null || assignment === void 0 ? void 0 : assignment.govtOrderNumber,
        tenantid: assignment === null || assignment === void 0 ? void 0 : assignment.tenantid,
        auditDetails: assignment === null || assignment === void 0 ? void 0 : assignment.auditDetails,
        fromDate: assignment !== null && assignment !== void 0 && assignment.fromDate ? new Date(assignment === null || assignment === void 0 ? void 0 : assignment.fromDate).getTime() : undefined,
        toDate: assignment !== null && assignment !== void 0 && assignment.toDate ? new Date(assignment === null || assignment === void 0 ? void 0 : assignment.toDate).getTime() : undefined,
        isCurrentAssignment: assignment === null || assignment === void 0 ? void 0 : assignment.isCurrentAssignment,
        department: assignment === null || assignment === void 0 ? void 0 : (_assignment$departmen = assignment.department) === null || _assignment$departmen === void 0 ? void 0 : _assignment$departmen.code,
        designation: assignment === null || assignment === void 0 ? void 0 : (_assignment$designati = assignment.designation) === null || _assignment$designati === void 0 ? void 0 : _assignment$designati.code
      }) : [];
    });
    Promise.all(promises).then(function (results) {
      onSelect(config.key, results.filter(function (value) {
        return Object.keys(value).length !== 0;
      }));
    });
    assignments.map(function (ele) {
      if (ele.isCurrentAssignment) {
        setCurrentAssiginmentDate(ele.fromDate);
      }
    });
  }, [assignments]);
  var department = [];
  var designation = [];

  var _useState3 = React.useState(-1),
      focusIndex = _useState3[0],
      setFocusIndex = _useState3[1];

  function getdepartmentdata() {
    var _data$MdmsRes, _data$MdmsRes$common;

    return data === null || data === void 0 ? void 0 : (_data$MdmsRes = data.MdmsRes) === null || _data$MdmsRes === void 0 ? void 0 : (_data$MdmsRes$common = _data$MdmsRes["common-masters"]) === null || _data$MdmsRes$common === void 0 ? void 0 : _data$MdmsRes$common.Department.map(function (ele) {
      ele["i18key"] = t("COMMON_MASTERS_DEPARTMENT_" + ele.code);
      return ele;
    });
  }

  function getdesignationdata() {
    var _data$MdmsRes2, _data$MdmsRes2$common;

    return data === null || data === void 0 ? void 0 : (_data$MdmsRes2 = data.MdmsRes) === null || _data$MdmsRes2 === void 0 ? void 0 : (_data$MdmsRes2$common = _data$MdmsRes2["common-masters"]) === null || _data$MdmsRes2$common === void 0 ? void 0 : _data$MdmsRes2$common.Designation.map(function (ele) {
      ele["i18key"] = t("COMMON_MASTERS_DESIGNATION_" + ele.code);
      return ele;
    });
  }

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement("div", null, assignments === null || assignments === void 0 ? void 0 : assignments.map(function (assignment, index) {
    return /*#__PURE__*/React__default.createElement(Assignment, {
      t: t,
      key: index,
      keys: index.key,
      formData: formData,
      assignment: assignment,
      setassignments: setassignments,
      index: index,
      focusIndex: focusIndex,
      setFocusIndex: setFocusIndex,
      getdepartmentdata: getdepartmentdata,
      department: department,
      designation: designation,
      getdesignationdata: getdesignationdata,
      assignments: assignments,
      handleRemoveUnit: handleRemoveUnit,
      setCurrentAssiginmentDate: setCurrentAssiginmentDate,
      currentassignemtDate: currentassignemtDate
    });
  }), /*#__PURE__*/React__default.createElement("label", {
    onClick: handleAddUnit,
    className: "link-label",
    style: {
      width: "12rem"
    }
  }, t("HR_ADD_ASSIGNMENT")));
};

function Assignment(_ref3) {
  var _formData$SelectDateo;

  var t = _ref3.t,
      assignment = _ref3.assignment,
      assignments = _ref3.assignments,
      setassignments = _ref3.setassignments,
      index = _ref3.index,
      focusIndex = _ref3.focusIndex,
      setFocusIndex = _ref3.setFocusIndex,
      getdepartmentdata = _ref3.getdepartmentdata,
      department = _ref3.department,
      formData = _ref3.formData,
      handleRemoveUnit = _ref3.handleRemoveUnit,
      designation = _ref3.designation,
      getdesignationdata = _ref3.getdesignationdata,
      setCurrentAssiginmentDate = _ref3.setCurrentAssiginmentDate,
      currentassignemtDate = _ref3.currentassignemtDate;

  var selectDepartment = function selectDepartment(value) {
    setassignments(function (pre) {
      return pre.map(function (item) {
        return item.key === assignment.key ? _extends({}, item, {
          department: value
        }) : item;
      });
    });
  };

  var selectDesignation = function selectDesignation(value) {
    setassignments(function (pre) {
      return pre.map(function (item) {
        return item.key === assignment.key ? _extends({}, item, {
          designation: value
        }) : item;
      });
    });
  };

  var onAssignmentChange = function onAssignmentChange(value) {
    setassignments(function (pre) {
      return pre.map(function (item) {
        return item.key === assignment.key ? _extends({}, item, {
          isCurrentAssignment: value
        }) : _extends({}, item, {
          isCurrentAssignment: false
        });
      });
    });

    if (value) {
      setassignments(function (pre) {
        return pre.map(function (item) {
          return item.key === assignment.key ? _extends({}, item, {
            toDate: null
          }) : item;
        });
      });
      assignments.map(function (ele) {
        if (ele.key == assignment.key) {
          setCurrentAssiginmentDate(ele.fromDate);
        }
      });
    } else {
      setCurrentAssiginmentDate(null);
    }
  };

  return /*#__PURE__*/React__default.createElement("div", {
    key: index + 1,
    style: {
      marginBottom: "16px"
    }
  }, /*#__PURE__*/React__default.createElement("div", {
    style: {
      border: "1px solid #E3E3E3",
      padding: "16px",
      marginTop: "8px"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement("div", {
    className: "label-field-pair",
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React__default.createElement("h2", {
    className: "card-label card-label-smaller",
    style: {
      color: "#505A5F"
    }
  }, t("HR_ASSIGNMENT"), " ", index + 1)), assignments.length > 1 && !(assignment !== null && assignment !== void 0 && assignment.id) && !(assignment !== null && assignment !== void 0 && assignment.isCurrentAssignment) ? /*#__PURE__*/React__default.createElement("div", {
    onClick: function onClick() {
      return handleRemoveUnit(assignment);
    },
    style: {
      marginBottom: "16px",
      padding: "5px",
      cursor: "pointer",
      textAlign: "right"
    }
  }, "X") : null), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: assignment !== null && assignment !== void 0 && assignment.id ? "card-label-smaller disabled" : "card-label-smaller"
  }, " ", t("HR_ASMT_FROM_DATE_LABEL") + " * ", " "), /*#__PURE__*/React__default.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.DatePicker, {
    type: "date",
    name: "fromDate",
    max: currentassignemtDate ? currentassignemtDate : convertEpochToDate(new Date()),
    min: formData === null || formData === void 0 ? void 0 : (_formData$SelectDateo = formData.SelectDateofEmployment) === null || _formData$SelectDateo === void 0 ? void 0 : _formData$SelectDateo.dateOfAppointment,
    disabled: assignment !== null && assignment !== void 0 && assignment.id ? true : false,
    onChange: function onChange(e) {
      setassignments(function (pre) {
        return pre.map(function (item) {
          return item.key === assignment.key ? _extends({}, item, {
            fromDate: e
          }) : item;
        });
      });
      setFocusIndex(index);
    },
    date: assignment === null || assignment === void 0 ? void 0 : assignment.fromDate,
    autoFocus: focusIndex === index
  }))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: assignment !== null && assignment !== void 0 && assignment.isCurrentAssignment ? "card-label-smaller disabled" : "card-label-smaller"
  }, t("HR_ASMT_TO_DATE_LABEL"), assignment !== null && assignment !== void 0 && assignment.isCurrentAssignment ? "" : " * ", " "), /*#__PURE__*/React__default.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.DatePicker, {
    type: "date",
    name: "toDate",
    min: assignment === null || assignment === void 0 ? void 0 : assignment.fromDate,
    max: currentassignemtDate ? currentassignemtDate : convertEpochToDate(new Date()),
    disabled: assignment === null || assignment === void 0 ? void 0 : assignment.isCurrentAssignment,
    onChange: function onChange(e) {
      setassignments(function (pre) {
        return pre.map(function (item) {
          return item.key === assignment.key ? _extends({}, item, {
            toDate: e
          }) : item;
        });
      });
      setFocusIndex(index);
    },
    date: assignment === null || assignment === void 0 ? void 0 : assignment.toDate,
    autoFocus: focusIndex === index
  }))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "card-label-smaller",
    style: {
      color: "white"
    }
  }, "."), /*#__PURE__*/React__default.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CheckBox, {
    onChange: function onChange(e) {
      return onAssignmentChange(e.target.checked);
    },
    checked: assignment === null || assignment === void 0 ? void 0 : assignment.isCurrentAssignment,
    label: t("HR_CURRENTLY_ASSIGNED_HERE_SWITCH_LABEL")
  }))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: assignment !== null && assignment !== void 0 && assignment.id ? "card-label-smaller disabled" : "card-label-smaller"
  }, " ", t("HR_DEPT_LABEL") + " * "), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    className: "form-field",
    selected: assignment === null || assignment === void 0 ? void 0 : assignment.department,
    disable: assignment !== null && assignment !== void 0 && assignment.id ? true : false,
    optionKey: "i18key",
    option: getdepartmentdata(department) || [],
    select: selectDepartment,
    t: t
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: assignment !== null && assignment !== void 0 && assignment.id ? "card-label-smaller disabled" : "card-label-smaller"
  }, t("HR_DESG_LABEL") + " * "), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    className: "form-field",
    selected: assignment === null || assignment === void 0 ? void 0 : assignment.designation,
    disable: assignment !== null && assignment !== void 0 && assignment.id ? true : false,
    option: getdesignationdata(designation) || [],
    select: selectDesignation,
    optionKey: "i18key",
    t: t
  }))));
}

var SelectEmployeeId = function SelectEmployeeId(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData,
      errors = _ref.errors;

  var _useLocation = reactRouterDom.useLocation();

  var isEdit = window.location.pathname.includes("/edit/");
  var inputs = [{
    label: "HR_EMP_ID_LABEL",
    type: "text",
    name: "code",
    validation: {
      title: t("CORE_COMMON_APPLICANT_NAME_INVALID")
    }
  }];

  function setValue(value, input) {
    var _extends2;

    onSelect(config.key, _extends({}, formData[config.key], (_extends2 = {}, _extends2[input] = value, _extends2)));
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
      value: formData && formData[config.key] ? formData[config.key][input.name] : undefined,
      onChange: function onChange(e) {
        return setValue(e.target.value, input.name);
      },
      disable: isEdit,
      defaultValue: undefined
    }, input.validation)))));
  }));
};

var SelectDateofEmployment = function SelectDateofEmployment(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData,
      errors = _ref.errors;

  var _useLocation = reactRouterDom.useLocation();

  var inputs = [{
    label: "HR_APPOINTMENT_DATE_LABEL",
    type: "date",
    name: "dateOfAppointment",
    validation: {
      isRequired: true,
      title: t("CORE_COMMON_APPLICANT_NAME_INVALID")
    },
    isMandatory: true
  }];

  function setValue(value, input) {
    var _extends2;

    onSelect(config.key, _extends({}, formData[config.key], (_extends2 = {}, _extends2[input] = value, _extends2)));
  }

  return /*#__PURE__*/React__default.createElement("div", null, inputs === null || inputs === void 0 ? void 0 : inputs.map(function (input, index) {
    var _formData$SelectDateo;

    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, errors[input.name] && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t(input.error)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      className: "card-label-smaller"
    }, t(input.label), input.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.DatePicker, _extends({
      key: input.name,
      min: formData === null || formData === void 0 ? void 0 : (_formData$SelectDateo = formData.SelectDateofBirthEmployment) === null || _formData$SelectDateo === void 0 ? void 0 : _formData$SelectDateo.dob,
      max: convertEpochToDate(new Date()),
      date: formData && formData[config.key] ? formData[config.key][input.name] : undefined,
      onChange: function onChange(e) {
        return setValue(e, input.name);
      },
      disable: false
    }, input.validation, {
      defaultValue: undefined
    })))));
  }));
};

var SelectEmployeeType = function SelectEmployeeType(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData;
  var tenantId = Digit.ULBService.getCurrentTenantId();

  var _useLocation = reactRouterDom.useLocation(),
      url = _useLocation.pathname;

  var editScreen = url.includes("/modify-application/");

  var _ref2 = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "EmployeeType") || {},
      _ref2$data = _ref2.data,
      EmployeeTypes = _ref2$data === void 0 ? [] : _ref2$data,
      isLoading = _ref2.isLoading;

  var _useState = React.useState(formData === null || formData === void 0 ? void 0 : formData.SelectEmployeeType),
      employeeType = _useState[0],
      setemployeeType = _useState[1];

  function SelectEmployeeType(value) {
    setemployeeType(value);
  }

  React.useEffect(function () {
    onSelect(config.key, employeeType);
  }, [employeeType]);
  var inputs = [{
    label: "HR_EMPLOYMENT_TYPE_LABEL",
    type: "text",
    name: "EmployeeType",
    validation: {
      isRequired: true
    },
    isMandatory: true
  }];

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return inputs === null || inputs === void 0 ? void 0 : inputs.map(function (input, index) {
    var _EmployeeTypes$egovH;

    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, {
      key: index
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      className: "card-label-smaller"
    }, t(input.label), input.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
      className: "form-field",
      selected: employeeType,
      option: EmployeeTypes === null || EmployeeTypes === void 0 ? void 0 : (_EmployeeTypes$egovH = EmployeeTypes["egov-hrms"]) === null || _EmployeeTypes$egovH === void 0 ? void 0 : _EmployeeTypes$egovH.EmployeeType,
      select: SelectEmployeeType,
      optionKey: "code",
      defaultValue: undefined,
      t: t
    }));
  });
};

var SelectEmployeePhoneNumber = function SelectEmployeePhoneNumber(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData;

  var _useLocation = reactRouterDom.useLocation();

  var _useState = React.useState(false),
      iserror = _useState[0],
      setError = _useState[1];

  var isMobile = window.Digit.Utils.browser.isMobile();
  var inputs = [{
    label: t("HR_MOB_NO_LABEL"),
    isMandatory: true,
    type: "text",
    name: "mobileNumber",
    populators: {
      validation: {
        required: true,
        pattern: /^[6-9]\d{9}$/
      },
      componentInFront: /*#__PURE__*/React__default.createElement("div", {
        className: "employee-card-input employee-card-input--front"
      }, "+91"),
      error: t("CORE_COMMON_MOBILE_ERROR")
    }
  }];

  function setValue(value, input) {
    var _extends2;

    onSelect(config.key, _extends({}, formData[config.key], (_extends2 = {}, _extends2[input] = value, _extends2)));
  }

  function validate(value, input) {
    setError(!input.populators.validation.pattern.test(value));
  }

  return /*#__PURE__*/React__default.createElement("div", null, inputs === null || inputs === void 0 ? void 0 : inputs.map(function (input, index) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      className: "card-label-smaller"
    }, t(input.label), input.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
      className: "field-container",
      style: {
        width: isMobile ? "100%" : "50%",
        display: "block"
      }
    }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
      style: {
        display: "flex"
      }
    }, /*#__PURE__*/React__default.createElement("div", {
      className: "employee-card-input employee-card-input--front"
    }, "+91"), /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
      className: "field desktop-w-full",
      key: input.name,
      value: formData && formData[config.key] ? formData[config.key][input.name] : undefined,
      onChange: function onChange(e) {
        setValue(e.target.value, input.name, validate(e.target.value, input));
      },
      disable: false,
      defaultValue: undefined,
      onBlur: function onBlur(e) {
        return validate(e.target.value, input);
      }
    }, input.validation))), /*#__PURE__*/React__default.createElement("div", null, iserror ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, {
      style: {
        width: "100%"
      }
    }, t(input.populators.error)) : /*#__PURE__*/React__default.createElement("span", {
      style: {
        color: "gray",
        width: "100%",
        border: "none",
        background: "none",
        justifyContent: "end"
      }
    }, t("HR_MOBILE_NO_CHECK")))))));
  }));
};

var SelectEmployeeName = function SelectEmployeeName(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData,
      errors = _ref.errors;

  var _useLocation = reactRouterDom.useLocation();

  var inputs = [{
    label: "HR_EMP_NAME_LABEL",
    type: "text",
    name: "employeeName",
    validation: {
      isRequired: true,
      pattern: Digit.Utils.getPattern('Name'),
      title: t("CORE_COMMON_APPLICANT_NAME_INVALID")
    },
    isMandatory: true
  }];

  function setValue(value, input) {
    var _extends2;

    onSelect(config.key, _extends({}, formData[config.key], (_extends2 = {}, _extends2[input] = value, _extends2)));
  }

  return /*#__PURE__*/React__default.createElement("div", null, inputs === null || inputs === void 0 ? void 0 : inputs.map(function (input, index) {
    var currentValue = formData && formData[config.key] && formData[config.key][input.name] || '';
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, errors[input.name] && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t(input.error)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      className: "card-label-smaller"
    }, t(input.label), input.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
      key: input.name,
      value: formData && formData[config.key] ? formData[config.key][input.name] : undefined,
      onChange: function onChange(e) {
        return setValue(e.target.value, input.name);
      },
      disable: false,
      defaultValue: undefined
    }, input.validation)), currentValue && currentValue.length > 0 && !currentValue.match(Digit.Utils.getPattern('Name')) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, {
      style: {
        width: "100%",
        marginTop: '-15px',
        fontSize: '16px',
        marginBottom: '12px'
      }
    }, t("CORE_COMMON_APPLICANT_NAME_INVALID")))));
  }));
};

var SelectEmployeeEmailId = function SelectEmployeeEmailId(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData,
      errors = _ref.errors;

  var _useLocation = reactRouterDom.useLocation();

  var inputs = [{
    label: "HR_EMAIL_LABEL",
    type: "email",
    name: "emailId",
    validation: {
      title: t("CORE_COMMON_APPLICANT_NAME_INVALID")
    }
  }];

  function setValue(value, input) {
    var _extends2;

    onSelect(config.key, _extends({}, formData[config.key], (_extends2 = {}, _extends2[input] = value, _extends2)));
  }

  return /*#__PURE__*/React__default.createElement("div", null, inputs === null || inputs === void 0 ? void 0 : inputs.map(function (input, index) {
    var currentValue = formData && formData[config.key] && formData[config.key][input.name] || '';
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, errors[input.name] && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t(input.error)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      className: "card-label-smaller"
    }, t(input.label), input.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
      type: input.type,
      key: input.name,
      value: formData && formData[config.key] ? formData[config.key][input.name] : undefined,
      onChange: function onChange(e) {
        return setValue(e.target.value, input.name);
      },
      disable: false,
      defaultValue: undefined
    }, input.validation)), currentValue && currentValue.length > 0 && !currentValue.match(Digit.Utils.getPattern('Email')) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, {
      style: {
        width: "100%",
        marginTop: '-15px',
        fontSize: '16px',
        marginBottom: '12px'
      }
    }, t("CS_PROFILE_EMAIL_ERRORMSG")))));
  }));
};

var SelectEmployeeCorrespondenceAddress = function SelectEmployeeCorrespondenceAddress(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData,
      errors = _ref.errors;

  var _useLocation = reactRouterDom.useLocation();

  var inputs = [{
    label: "HR_CORRESPONDENCE_ADDRESS_LABEL",
    type: "text",
    name: "correspondenceAddress",
    validation: {
      pattern: Digit.Utils.getPattern('Address'),
      isRequired: true,
      title: t("CORE_COMMON_APPLICANT_NAME_INVALID")
    },
    isMandatory: true
  }];

  function setValue(value, input) {
    var _extends2;

    onSelect(config.key, _extends({}, formData[config.key], (_extends2 = {}, _extends2[input] = value, _extends2)));
  }

  return /*#__PURE__*/React__default.createElement("div", null, inputs === null || inputs === void 0 ? void 0 : inputs.map(function (input, index) {
    var currentValue = formData && formData[config.key] && formData[config.key][input.name] || '';
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, errors[input.name] && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t(input.error)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      className: "card-label-smaller"
    }, t(input.label), input.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.TextInput, _extends({
      key: input.name,
      value: formData && formData[config.key] ? formData[config.key][input.name] : undefined,
      onChange: function onChange(e) {
        return setValue(e.target.value, input.name);
      },
      disable: false,
      defaultValue: undefined
    }, input.validation)), currentValue && currentValue.length > 0 && !currentValue.match(Digit.Utils.getPattern('Address')) && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, {
      style: {
        width: "100%",
        marginTop: '-15px',
        fontSize: '16px',
        marginBottom: '12px'
      }
    }, t("CORE_COMMON_APPLICANT_ADDRESS_INVALID")))));
  }));
};

var SelectEmployeeGender = function SelectEmployeeGender(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData,
      errors = _ref.errors;

  var _useLocation = reactRouterDom.useLocation();

  var inputs = [{
    label: "HR_GENDER_LABEL",
    type: "text",
    name: "gender",
    validation: {
      isRequired: true,
      title: t("CORE_COMMON_APPLICANT_NAME_INVALID")
    },
    isMandatory: true
  }];
  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];

  var _Digit$Hooks$hrms$use = Digit.Hooks.hrms.useHRMSGenderMDMS(stateId, "common-masters", "GenderType"),
      Menu = _Digit$Hooks$hrms$use.data;

  var HRMenu = [];
  Menu && Menu.map(function (comGender) {
    HRMenu.push({
      name: "COMMON_GENDER_" + comGender.code,
      code: "" + comGender.code
    });
  });

  function setValue(value, input) {
    var _extends2;

    onSelect(config.key, _extends({}, formData[config.key], (_extends2 = {}, _extends2[input] = value, _extends2)));
  }

  return /*#__PURE__*/React__default.createElement("div", null, inputs === null || inputs === void 0 ? void 0 : inputs.map(function (input, index) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, errors[input.name] && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t(input.error)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      className: "card-label-smaller"
    }, t(input.label), input.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioButtons, _extends({
      style: {
        display: "flex",
        justifyContent: "space-between"
      },
      options: HRMenu,
      key: input.name,
      optionsKey: "name",
      selectedOption: formData && formData[config.key] ? formData[config.key][input.name] : null,
      onSelect: function onSelect(e) {
        return setValue(e, input.name);
      },
      disable: false,
      defaultValue: undefined,
      t: t
    }, input.validation)))));
  }));
};

var SelectDateofBirthEmployment = function SelectDateofBirthEmployment(_ref) {
  var t = _ref.t,
      config = _ref.config,
      onSelect = _ref.onSelect,
      _ref$formData = _ref.formData,
      formData = _ref$formData === void 0 ? {} : _ref$formData,
      errors = _ref.errors;

  var _useLocation = reactRouterDom.useLocation();

  var inputs = [{
    label: "HR_BIRTH_DATE_LABEL",
    type: "date",
    name: "dob",
    validation: {
      isRequired: true,
      title: t("CORE_COMMON_APPLICANT_NAME_INVALID")
    },
    isMandatory: true
  }];

  function setValue(value, input) {
    var _extends2;

    onSelect(config.key, _extends({}, formData[config.key], (_extends2 = {}, _extends2[input] = value, _extends2)));
  }

  return /*#__PURE__*/React__default.createElement("div", null, inputs === null || inputs === void 0 ? void 0 : inputs.map(function (input, index) {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, {
      key: index
    }, errors[input.name] && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t(input.error)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
      className: "card-label-smaller"
    }, t(input.label), input.isMandatory ? " * " : null), /*#__PURE__*/React__default.createElement("div", {
      className: "field"
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.DatePicker, _extends({
      key: input.name,
      date: formData && formData[config.key] ? formData[config.key][input.name] : undefined,
      onChange: function onChange(e) {
        return setValue(e, input.name);
      },
      disable: false,
      max: convertEpochToDate(new Date().setFullYear(new Date().getFullYear() - 18)),
      defaultValue: undefined
    }, input.validation)))));
  }));
};

var GetMessage = function GetMessage(type, action, isSuccess, isEmployee, t) {
  return t("EMPLOYEE_RESPONSE_" + (action ? action : "CREATE") + "_" + type + (isSuccess ? "" : "_ERROR"));
};

var GetActionMessage = function GetActionMessage(action, isSuccess, isEmployee, t) {
  return GetMessage("ACTION", action, isSuccess, isEmployee, t);
};

var GetLabel = function GetLabel(action, isSuccess, isEmployee, t) {
  if (isSuccess) {
    return t("HR_EMPLOYEE_ID_LABEL");
  }
};

var BannerPicker = function BannerPicker(props) {
  var _props$data, _props$data$Employees, _props$data$Employees2;

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Banner, {
    message: GetActionMessage(props.action, props.isSuccess, props.isEmployee, props.t),
    applicationNumber: props.isSuccess ? props === null || props === void 0 ? void 0 : (_props$data = props.data) === null || _props$data === void 0 ? void 0 : (_props$data$Employees = _props$data.Employees) === null || _props$data$Employees === void 0 ? void 0 : (_props$data$Employees2 = _props$data$Employees[0]) === null || _props$data$Employees2 === void 0 ? void 0 : _props$data$Employees2.code : '',
    info: GetLabel(props.action, props.isSuccess, props.isEmployee, props.t),
    successful: props.isSuccess
  });
};

var Response = function Response(props) {
  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var stateId = tenantId.split(".")[0];
  var state = props.location.state;

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_HAPPENED", false),
      mutationHappened = _Digit$Hooks$useSessi[0],
      setMutationHappened = _Digit$Hooks$useSessi[1];

  var _Digit$Hooks$useSessi2 = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_SUCCESS_DATA", false),
      successData = _Digit$Hooks$useSessi2[0],
      setsuccessData = _Digit$Hooks$useSessi2[1];

  var _Digit$Hooks$useSessi3 = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_ERROR_DATA", false),
      errorInfo = _Digit$Hooks$useSessi3[0],
      setErrorInfo = _Digit$Hooks$useSessi3[1];

  var mutation = state.key === "UPDATE" ? Digit.Hooks.hrms.useHRMSUpdate(tenantId) : Digit.Hooks.hrms.useHRMSCreate(tenantId);

  var onError = function onError(error, variables) {
    var _error$response, _error$response$data, _error$response$data$;

    setErrorInfo((error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : (_error$response$data = _error$response.data) === null || _error$response$data === void 0 ? void 0 : (_error$response$data$ = _error$response$data.Errors[0]) === null || _error$response$data$ === void 0 ? void 0 : _error$response$data$.code) || 'ERROR');
    setMutationHappened(true);
  };

  React.useEffect(function () {
    if (mutation.data) setsuccessData(mutation.data);
  }, [mutation.data]);
  React.useEffect(function () {
    var onSuccess = function onSuccess() {
      setMutationHappened(true);
    };

    if (!mutationHappened) {
      if (state.key === "UPDATE") {
        mutation.mutate({
          Employees: state.Employees
        }, {
          onError: onError,
          onSuccess: onSuccess
        });
      } else {
        mutation.mutate(state, {
          onSuccess: onSuccess
        });
      }
    }
  }, []);

  var DisplayText = function DisplayText(action, isSuccess, isEmployee, t) {
    if (!isSuccess) {
      var _mutation$error, _mutation$error$respo, _mutation$error$respo2;

      return (mutation === null || mutation === void 0 ? void 0 : (_mutation$error = mutation.error) === null || _mutation$error === void 0 ? void 0 : (_mutation$error$respo = _mutation$error.response) === null || _mutation$error$respo === void 0 ? void 0 : (_mutation$error$respo2 = _mutation$error$respo.data) === null || _mutation$error$respo2 === void 0 ? void 0 : _mutation$error$respo2.Errors[0].code) || errorInfo;
    } else {
      Digit.SessionStorage.set("isupdate", Math.floor(100000 + Math.random() * 900000));
      return state.key === "CREATE" ? "HRMS_CREATE_EMPLOYEE_INFO" : "";
    }
  };

  if (mutation.isLoading || mutation.isIdle && !mutationHappened) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(BannerPicker, {
    t: t,
    data: (mutation === null || mutation === void 0 ? void 0 : mutation.data) || successData,
    action: state.action,
    isSuccess: !successData ? mutation === null || mutation === void 0 ? void 0 : mutation.isSuccess : true,
    isLoading: mutation.isIdle && !mutationHappened || (mutation === null || mutation === void 0 ? void 0 : mutation.isLoading),
    isEmployee: props.parentRoute.includes("employee")
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, null, t(DisplayText(state.action, mutation.isSuccess || !!successData, props.parentRoute.includes("employee")), t)), /*#__PURE__*/React__default.createElement(digitUiReactComponents.ActionBar, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: "" + (props.parentRoute.includes("employee") ? "/digit-ui/employee" : "/digit-ui/citizen")
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("CORE_COMMON_GO_TO_HOME")
  }))));
};

var HRBanner = function HRBanner(_ref) {
  var _config$texts, _config$texts2, _config$texts3;

  var t = _ref.t,
      config = _ref.config;
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.LabelFieldPair, null, (config === null || config === void 0 ? void 0 : (_config$texts = config.texts) === null || _config$texts === void 0 ? void 0 : _config$texts.nosideText) !== true && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabel, {
    className: "card-label-smaller",
    style: {
      color: "white"
    }
  }, "."), /*#__PURE__*/React__default.createElement("span", {
    className: "form-field",
    style: (config === null || config === void 0 ? void 0 : (_config$texts2 = config.texts) === null || _config$texts2 === void 0 ? void 0 : _config$texts2.nosideText) !== true ? {
      color: "gray"
    } : {
      color: "gray",
      width: "100%",
      marginTop: "-20px"
    }
  }, t(config === null || config === void 0 ? void 0 : (_config$texts3 = config.texts) === null || _config$texts3 === void 0 ? void 0 : _config$texts3.header)));
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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

function eq(value, other) {
  return value === other || value !== value && other !== other;
}

var eq_1 = eq;

var objectProto$3 = Object.prototype;
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

function assignValue(object, key, value) {
  var objValue = object[key];

  if (!(hasOwnProperty$2.call(object, key) && eq_1(objValue, value)) || value === undefined && !(key in object)) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

var isArray = Array.isArray;
var isArray_1 = isArray;

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
var objectProto$4 = Object.prototype;
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

function hashGet(key) {
  var data = this.__data__;

  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }

  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

var objectProto$5 = Object.prototype;
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

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

function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

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

var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;

function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

var _isIndex = isIndex;

var INFINITY$1 = 1 / 0;

function toKey(value) {
  if (typeof value == 'string' || isSymbol_1(value)) {
    return value;
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$1 ? '-0' : result;
}

var _toKey = toKey;

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

var configEmployeeActiveApplication = function configEmployeeActiveApplication(_ref) {
  var _employees$deactivati, _employees$deactivati2;

  var t = _ref.t,
      selectFile = _ref.selectFile,
      uploadedFile = _ref.uploadedFile,
      setUploadedFile = _ref.setUploadedFile,
      selectedReason = _ref.selectedReason,
      Reasons = _ref.Reasons,
      selectReason = _ref.selectReason,
      _ref$employees = _ref.employees,
      employees = _ref$employees === void 0 ? {} : _ref$employees;
  employees.deactivationDetails = employees === null || employees === void 0 ? void 0 : (_employees$deactivati = employees.deactivationDetails) === null || _employees$deactivati === void 0 ? void 0 : _employees$deactivati.sort(function (y, x) {
    var _x$auditDetails, _y$auditDetails;

    return (x === null || x === void 0 ? void 0 : (_x$auditDetails = x.auditDetails) === null || _x$auditDetails === void 0 ? void 0 : _x$auditDetails.createdDate) - (y === null || y === void 0 ? void 0 : (_y$auditDetails = y.auditDetails) === null || _y$auditDetails === void 0 ? void 0 : _y$auditDetails.createdDate);
  });
  return {
    label: {
      heading: "HR_ACTIVATE_EMPLOYEE_HEAD",
      submit: "HR_ACTIVATE_EMPLOYEE_HEAD"
    },
    form: [{
      body: [{
        label: t("HR_ACTIVATION_REASON"),
        type: "dropdown",
        isMandatory: true,
        name: "reasonForDeactivation",
        populators: /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
          isMandatory: true,
          selected: selectedReason,
          optionKey: "i18key",
          option: Reasons,
          select: selectReason,
          t: t
        })
      }, {
        label: t("HR_ORDER_NO"),
        type: "text",
        populators: {
          name: "orderNo"
        }
      }, {
        label: t("HR_EFFECTIVE_DATE"),
        type: "date",
        isMandatory: true,
        disable: true,
        populators: {
          error: t("HR_EFFECTIVE_DATE_INVALID"),
          name: "effectiveFrom",
          min: convertEpochToDate(employees === null || employees === void 0 ? void 0 : (_employees$deactivati2 = employees.deactivationDetails) === null || _employees$deactivati2 === void 0 ? void 0 : _employees$deactivati2[0].effectiveFrom),
          max: convertEpochToDate(new Date().toJSON().slice(0, 10).replace(/-/g, "/")),
          defaultValue: convertEpochToDate(new Date().toJSON().slice(0, 10).replace(/-/g, "/"))
        }
      }, {
        label: t("HR_APPROVAL_UPLOAD_HEAD"),
        populators: /*#__PURE__*/React__default.createElement("div", {
          style: {
            marginBottom: "2rem"
          }
        }, /*#__PURE__*/React__default.createElement("span", null, t("TL_APPROVAL_UPLOAD_SUBHEAD")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.UploadFile, {
          accept: "image/*, .pdf, .png, .jpeg",
          onUpload: selectFile,
          onDelete: function onDelete() {
            setUploadedFile(null);
          },
          message: uploadedFile ? "1 " + t("HR_ACTION_FILEUPLOADED") : t("HR_ACTION_NO_FILEUPLOADED")
        }))
      }, {
        label: t("HR_REMARKS"),
        type: "text",
        populators: {
          name: "remarks"
        }
      }]
    }]
  };
};

var configEmployeeApplication = function configEmployeeApplication(_ref) {
  var t = _ref.t,
      selectFile = _ref.selectFile,
      uploadedFile = _ref.uploadedFile,
      setUploadedFile = _ref.setUploadedFile,
      selectedReason = _ref.selectedReason,
      Reasons = _ref.Reasons,
      selectReason = _ref.selectReason;
  return {
    label: {
      heading: "HR_DEACTIVATE_EMPLOYEE_HEAD",
      submit: "HR_DEACTIVATE_EMPLOYEE_HEAD"
    },
    form: [{
      body: [{
        label: t("HR_DEACTIVATION_REASON"),
        type: "dropdown",
        isMandatory: true,
        name: "reasonForDeactivation",
        populators: /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
          isMandatory: true,
          selected: selectedReason,
          optionKey: "i18key",
          option: Reasons,
          select: selectReason,
          t: t
        })
      }, {
        label: t("HR_ORDER_NO"),
        type: "text",
        populators: {
          name: "orderNo"
        }
      }, {
        label: t("HR_EFFECTIVE_DATE"),
        type: "date",
        isMandatory: true,
        disable: true,
        populators: {
          error: t("HR_EFFECTIVE_DATE_INVALID"),
          name: "effectiveFrom",
          min: convertEpochToDate(new Date().toJSON().slice(0, 10).replace(/-/g, "/")),
          max: convertEpochToDate(new Date().toJSON().slice(0, 10).replace(/-/g, "/")),
          defaultValue: convertEpochToDate(new Date().toJSON().slice(0, 10).replace(/-/g, "/"))
        }
      }, {
        label: t("HR_APPROVAL_UPLOAD_HEAD"),
        populators: /*#__PURE__*/React__default.createElement("div", {
          style: {
            marginBottom: "2rem"
          }
        }, /*#__PURE__*/React__default.createElement("span", null, t("TL_APPROVAL_UPLOAD_SUBHEAD")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.UploadFile, {
          accept: "image/*, .pdf, .png, .jpeg",
          onUpload: selectFile,
          onDelete: function onDelete() {
            setUploadedFile(null);
          },
          message: uploadedFile ? "1 " + t("HR_ACTION_FILEUPLOADED") : t("HR_ACTION_NO_FILEUPLOADED")
        }))
      }, {
        label: t("HR_REMARKS"),
        type: "text",
        populators: {
          name: "remarks"
        }
      }]
    }]
  };
};

var EmployeeAction = function EmployeeAction(_ref) {
  var _config$label, _config$label2;

  var t = _ref.t,
      action = _ref.action,
      tenantId = _ref.tenantId,
      closeModal = _ref.closeModal,
      applicationData = _ref.applicationData;
  var history = reactRouterDom.useHistory();

  var _useState = React.useState({}),
      config = _useState[0],
      setConfig = _useState[1];

  var _useState2 = React.useState(null),
      file = _useState2[0],
      setFile = _useState2[1];

  var _useState3 = React.useState(null),
      uploadedFile = _useState3[0],
      setUploadedFile = _useState3[1];

  var _useState4 = React.useState(null),
      setError = _useState4[1];

  var _useState5 = React.useState([]),
      Reasons = _useState5[0],
      setReasons = _useState5[1];

  var _useState6 = React.useState(""),
      selectedReason = _useState6[0],
      selecteReason = _useState6[1];

  var _Digit$Hooks$hrms$use = Digit.Hooks.hrms.useHrmsMDMS(tenantId, "egov-hrms", "DeactivationReason"),
      data = _Digit$Hooks$hrms$use.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$hrms$use, ["isLoading", "isError", "errors", "data"]);

  React.useEffect(function () {
    switch (action) {
      case "DEACTIVATE_EMPLOYEE_HEAD":
        return setConfig(configEmployeeApplication({
          t: t,
          action: action,
          selectFile: selectFile,
          uploadedFile: uploadedFile,
          setUploadedFile: setUploadedFile,
          selectedReason: selectedReason,
          Reasons: Reasons,
          selectReason: selectReason
        }));

      case "ACTIVATE_EMPLOYEE_HEAD":
        return setConfig(configEmployeeActiveApplication({
          t: t,
          action: action,
          selectFile: selectFile,
          uploadedFile: uploadedFile,
          setUploadedFile: setUploadedFile,
          selectedReason: selectedReason,
          Reasons: Reasons,
          selectReason: selectReason,
          employees: (applicationData === null || applicationData === void 0 ? void 0 : applicationData.Employees[0]) || {}
        }));
    }
  }, [action, uploadedFile, Reasons]);

  var Heading = function Heading(props) {
    return /*#__PURE__*/React__default.createElement("h1", {
      className: "heading-m"
    }, props.label);
  };

  function selectReason(e) {
    selecteReason(e);
  }

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

  function selectFile(e) {
    setFile(e.target.files[0]);
  }

  React.useEffect(function () {
    var _data$egovHrms;

    setReasons(data === null || data === void 0 ? void 0 : (_data$egovHrms = data["egov-hrms"]) === null || _data$egovHrms === void 0 ? void 0 : _data$egovHrms.DeactivationReason.map(function (ele) {
      ele["i18key"] = "EGOV_HRMS_DEACTIVATIONREASON_" + ele.code;
      return ele;
    }));
  }, [data]);
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
                  return Promise.resolve(Digit.UploadServices.Filestorage("HRMS", file, tenantId === null || tenantId === void 0 ? void 0 : tenantId.split(".")[0])).then(function (response) {
                    var _response$data, _response$data$files;

                    if ((response === null || response === void 0 ? void 0 : (_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$files = _response$data.files) === null || _response$data$files === void 0 ? void 0 : _response$data$files.length) > 0) {
                      var _response$data2, _response$data2$files;

                      setUploadedFile(response === null || response === void 0 ? void 0 : (_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : (_response$data2$files = _response$data2.files[0]) === null || _response$data2$files === void 0 ? void 0 : _response$data2$files.fileStoreId);
                    } else {
                      setError(t("CS_FILE_UPLOAD_ERROR"));
                    }
                  });
                }, function () {
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
    data.effectiveFrom = new Date(data.effectiveFrom).getTime();
    data.reasonForDeactivation = selectedReason.code;
    var Employees = [].concat(applicationData.Employees);

    if (action !== "ACTIVATE_EMPLOYEE_HEAD") {
      var _Date;

      if (file) {
        var documents = {
          referenceType: "DEACTIVATION",
          documentId: uploadedFile,
          documentName: file.name
        };
        applicationData.Employees[0]["documents"].push(documents);
      }

      set_1(Employees[0], 'deactivationDetails[0].effectiveFrom', (_Date = new Date()) === null || _Date === void 0 ? void 0 : _Date.getTime());
      set_1(Employees[0], 'deactivationDetails[0].orderNo', data === null || data === void 0 ? void 0 : data.orderNo);
      set_1(Employees[0], 'deactivationDetails[0].reasonForDeactivation', data === null || data === void 0 ? void 0 : data.reasonForDeactivation);
      set_1(Employees[0], 'deactivationDetails[0].remarks', data === null || data === void 0 ? void 0 : data.remarks);
      Employees[0].isActive = false;
      history.replace("/digit-ui/employee/hrms/response", {
        Employees: Employees,
        key: "UPDATE",
        action: "DEACTIVATION"
      });
    } else {
      var _Date2;

      if (file) {
        var _documents = {
          referenceType: "ACTIVATION",
          documentId: uploadedFile,
          documentName: file.name
        };
        applicationData.Employees[0]["documents"].push(_documents);
      }

      set_1(Employees[0], 'reactivationDetails[0].effectiveFrom', (_Date2 = new Date()) === null || _Date2 === void 0 ? void 0 : _Date2.getTime());
      set_1(Employees[0], 'reactivationDetails[0].orderNo', data === null || data === void 0 ? void 0 : data.orderNo);
      set_1(Employees[0], 'reactivationDetails[0].reasonForDeactivation', data === null || data === void 0 ? void 0 : data.reasonForDeactivation);
      set_1(Employees[0], 'reactivationDetails[0].remarks', data === null || data === void 0 ? void 0 : data.remarks);
      Employees[0].isActive = true;
      history.replace("/digit-ui/employee/hrms/response", {
        Employees: Employees,
        key: "UPDATE",
        action: "ACTIVATION"
      });
    }
  }

  return action && config !== null && config !== void 0 && config.form ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Modal, {
    headerBarMain: /*#__PURE__*/React__default.createElement(Heading, {
      label: t(config === null || config === void 0 ? void 0 : (_config$label = config.label) === null || _config$label === void 0 ? void 0 : _config$label.heading)
    }),
    headerBarEnd: /*#__PURE__*/React__default.createElement(CloseBtn, {
      onClick: closeModal
    }),
    actionCancelOnSubmit: closeModal,
    actionSaveLabel: t(config === null || config === void 0 ? void 0 : (_config$label2 = config.label) === null || _config$label2 === void 0 ? void 0 : _config$label2.submit),
    actionSaveOnSubmit: function actionSaveOnSubmit() {},
    formId: "modal-action",
    isDisabled: !selectedReason
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormComposer, {
    config: config === null || config === void 0 ? void 0 : config.form,
    noBoxShadow: true,
    inline: true,
    disabled: true,
    childrenAtTheBottom: true,
    onSubmit: submit,
    formId: "modal-action"
  })) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
};

var ActionModal = function ActionModal(props) {
  return /*#__PURE__*/React__default.createElement(EmployeeAction, props);
};

var Details = function Details() {
  var _data$Employees, _data$Employees$, _data$Employees2, _data$Employees2$, _data$Employees2$$use, _data$Employees3, _data$Employees3$, _data$Employees3$$use, _data$Employees4, _data$Employees4$, _data$Employees4$$use, _data$Employees5, _data$Employees5$, _data$Employees5$$use, _data$Employees6, _data$Employees6$, _data$Employees6$$use, _data$Employees7, _data$Employees7$, _data$Employees8, _data$Employees8$, _data$Employees9, _data$Employees9$, _data$Employees10, _data$Employees10$, _data$Employees11, _data$Employees11$, _data$Employees12, _data$Employees12$, _data$Employees12$$de, _data$Employees12$$de2, _data$Employees13, _data$Employees13$, _data$Employees13$$de, _data$Employees14, _data$Employees14$, _data$Employees14$$de, _data$Employees15, _data$Employees15$, _data$Employees15$$de, _data$Employees15$$de2, _data$Employees16, _data$Employees16$, _data$Employees17, _data$Employees17$, _data$Employees17$$do, _data$Employees18, _data$Employees18$, _data$Employees19, _data$Employees19$, _data$Employees19$$ju, _data$Employees20, _data$Employees20$, _data$Employees22, _data$Employees22$, _data$Employees23, _data$Employees23$, _data$Employees24, _data$Employees24$;

  var activeworkflowActions = ["DEACTIVATE_EMPLOYEE_HEAD", "COMMON_EDIT_EMPLOYEE_HEADER"];
  var deactiveworkflowActions = ["ACTIVATE_EMPLOYEE_HEAD"];

  var _useState = React.useState(null),
      selectedAction = _useState[0],
      setSelectedAction = _useState[1];

  var _useState2 = React.useState(false),
      showModal = _useState2[0],
      setShowModal = _useState2[1];

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useParams = reactRouterDom.useParams(),
      employeeId = _useParams.id;

  var _useParams2 = reactRouterDom.useParams(),
      tenantId = _useParams2.tenantId;

  var history = reactRouterDom.useHistory();

  var _useState3 = React.useState(false),
      displayMenu = _useState3[0],
      setDisplayMenu = _useState3[1];

  var isupdate = Digit.SessionStorage.get("isupdate");

  var _Digit$Hooks$hrms$use = Digit.Hooks.hrms.useHRMSSearch({
    codes: employeeId
  }, tenantId, null, isupdate),
      isLoading = _Digit$Hooks$hrms$use.isLoading,
      data = _Digit$Hooks$hrms$use.data,
      rest = _objectWithoutPropertiesLoose(_Digit$Hooks$hrms$use, ["isLoading", "isError", "error", "data"]);

  var _Digit$Hooks$useSessi = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_ERROR_DATA", false),
      clearError = _Digit$Hooks$useSessi[2];

  var _Digit$Hooks$useSessi2 = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_HAPPENED", false),
      setMutationHappened = _Digit$Hooks$useSessi2[1];

  var _Digit$Hooks$useSessi3 = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_SUCCESS_DATA", false),
      clearSuccessData = _Digit$Hooks$useSessi3[2];

  React.useEffect(function () {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  function onActionSelect(action) {
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  var closeModal = function closeModal() {
    setSelectedAction(null);
    setShowModal(false);
  };

  var handleDownload = function handleDownload(document) {
    try {
      return Promise.resolve(Digit.UploadServices.Filefetch([document === null || document === void 0 ? void 0 : document.documentId], document.tenantId.split(".")[0])).then(function (res) {
        var documentLink = pdfDownloadLink(res.data, document === null || document === void 0 ? void 0 : document.documentId);
        window.open(documentLink, "_blank");
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var submitAction = function submitAction(data) {};

  React.useEffect(function () {
    switch (selectedAction) {
      case "DEACTIVATE_EMPLOYEE_HEAD":
        return setShowModal(true);

      case "ACTIVATE_EMPLOYEE_HEAD":
        return setShowModal(true);

      case "COMMON_EDIT_EMPLOYEE_HEADER":
        return history.push("/digit-ui/employee/hrms/edit/" + tenantId + "/" + employeeId);
    }
  }, [selectedAction]);

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
    style: {
      width: "30%",
      fontFamily: "calibri",
      color: "#FF0000"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Header, null, t("HR_NEW_EMPLOYEE_FORM_HEADER"))), !isLoading && (data === null || data === void 0 ? void 0 : data.Employees.length) > 0 ? /*#__PURE__*/React__default.createElement("div", {
    style: {
      maxHeight: "calc(100vh - 12em)"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, {
      className: "card-section-header"
    }, t("HR_EMP_STATUS_LABEL"), " "),
    text: data !== null && data !== void 0 && (_data$Employees = data.Employees) !== null && _data$Employees !== void 0 && (_data$Employees$ = _data$Employees[0]) !== null && _data$Employees$ !== void 0 && _data$Employees$.isActive ? /*#__PURE__*/React__default.createElement("div", {
      className: "sla-cell-success"
    }, " ", t("ACTIVE"), " ") : /*#__PURE__*/React__default.createElement("div", {
      className: "sla-cell-error"
    }, t("INACTIVE")),
    textStyle: {
      fontWeight: "bold",
      maxWidth: "6.5rem"
    }
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, {
    className: "card-section-header"
  }, t("HR_PERSONAL_DETAILS_FORM_HEADER"), " "), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("HR_NAME_LABEL"),
    text: (data === null || data === void 0 ? void 0 : (_data$Employees2 = data.Employees) === null || _data$Employees2 === void 0 ? void 0 : (_data$Employees2$ = _data$Employees2[0]) === null || _data$Employees2$ === void 0 ? void 0 : (_data$Employees2$$use = _data$Employees2$.user) === null || _data$Employees2$$use === void 0 ? void 0 : _data$Employees2$$use.name) || "NA",
    textStyle: {
      whiteSpace: "pre"
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("HR_MOB_NO_LABEL"),
    text: (data === null || data === void 0 ? void 0 : (_data$Employees3 = data.Employees) === null || _data$Employees3 === void 0 ? void 0 : (_data$Employees3$ = _data$Employees3[0]) === null || _data$Employees3$ === void 0 ? void 0 : (_data$Employees3$$use = _data$Employees3$.user) === null || _data$Employees3$$use === void 0 ? void 0 : _data$Employees3$$use.mobileNumber) || "NA",
    textStyle: {
      whiteSpace: "pre"
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("HR_GENDER_LABEL"),
    text: t(data === null || data === void 0 ? void 0 : (_data$Employees4 = data.Employees) === null || _data$Employees4 === void 0 ? void 0 : (_data$Employees4$ = _data$Employees4[0]) === null || _data$Employees4$ === void 0 ? void 0 : (_data$Employees4$$use = _data$Employees4$.user) === null || _data$Employees4$$use === void 0 ? void 0 : _data$Employees4$$use.gender) || "NA"
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("HR_EMAIL_LABEL"),
    text: (data === null || data === void 0 ? void 0 : (_data$Employees5 = data.Employees) === null || _data$Employees5 === void 0 ? void 0 : (_data$Employees5$ = _data$Employees5[0]) === null || _data$Employees5$ === void 0 ? void 0 : (_data$Employees5$$use = _data$Employees5$.user) === null || _data$Employees5$$use === void 0 ? void 0 : _data$Employees5$$use.emailId) || "NA"
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("HR_CORRESPONDENCE_ADDRESS_LABEL"),
    text: (data === null || data === void 0 ? void 0 : (_data$Employees6 = data.Employees) === null || _data$Employees6 === void 0 ? void 0 : (_data$Employees6$ = _data$Employees6[0]) === null || _data$Employees6$ === void 0 ? void 0 : (_data$Employees6$$use = _data$Employees6$.user) === null || _data$Employees6$$use === void 0 ? void 0 : _data$Employees6$$use.correspondenceAddress) || "NA"
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, {
    className: "card-section-header"
  }, t("HR_NEW_EMPLOYEE_FORM_HEADER")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("HR_EMPLOYMENT_TYPE_LABEL"),
    text: t(data !== null && data !== void 0 && (_data$Employees7 = data.Employees) !== null && _data$Employees7 !== void 0 && (_data$Employees7$ = _data$Employees7[0]) !== null && _data$Employees7$ !== void 0 && _data$Employees7$.employeeType ? "EGOV_HRMS_EMPLOYEETYPE_" + (data === null || data === void 0 ? void 0 : (_data$Employees8 = data.Employees) === null || _data$Employees8 === void 0 ? void 0 : (_data$Employees8$ = _data$Employees8[0]) === null || _data$Employees8$ === void 0 ? void 0 : _data$Employees8$.employeeType) : "NA"),
    textStyle: {
      whiteSpace: "pre"
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("HR_APPOINTMENT_DATE_LABEL"),
    text: convertEpochFormateToDate(data === null || data === void 0 ? void 0 : (_data$Employees9 = data.Employees) === null || _data$Employees9 === void 0 ? void 0 : (_data$Employees9$ = _data$Employees9[0]) === null || _data$Employees9$ === void 0 ? void 0 : _data$Employees9$.dateOfAppointment) || "NA",
    textStyle: {
      whiteSpace: "pre"
    }
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("HR_EMPLOYEE_ID_LABEL"),
    text: data === null || data === void 0 ? void 0 : (_data$Employees10 = data.Employees) === null || _data$Employees10 === void 0 ? void 0 : (_data$Employees10$ = _data$Employees10[0]) === null || _data$Employees10$ === void 0 ? void 0 : _data$Employees10$.code
  })), (data === null || data === void 0 ? void 0 : (_data$Employees11 = data.Employees) === null || _data$Employees11 === void 0 ? void 0 : (_data$Employees11$ = _data$Employees11[0]) === null || _data$Employees11$ === void 0 ? void 0 : _data$Employees11$.isActive) == false ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("HR_EFFECTIVE_DATE"),
    text: convertEpochFormateToDate(data === null || data === void 0 ? void 0 : (_data$Employees12 = data.Employees) === null || _data$Employees12 === void 0 ? void 0 : (_data$Employees12$ = _data$Employees12[0]) === null || _data$Employees12$ === void 0 ? void 0 : (_data$Employees12$$de = _data$Employees12$.deactivationDetails) === null || _data$Employees12$$de === void 0 ? void 0 : (_data$Employees12$$de2 = _data$Employees12$$de.sort(function (a, b) {
      return new Date(a.effectiveFrom) - new Date(b.effectiveFrom);
    })[0]) === null || _data$Employees12$$de2 === void 0 ? void 0 : _data$Employees12$$de2.effectiveFrom)
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("HR_DEACTIVATION_REASON"),
    text: t("EGOV_HRMS_DEACTIVATIONREASON_" + (data === null || data === void 0 ? void 0 : (_data$Employees13 = data.Employees) === null || _data$Employees13 === void 0 ? void 0 : (_data$Employees13$ = _data$Employees13[0]) === null || _data$Employees13$ === void 0 ? void 0 : (_data$Employees13$$de = _data$Employees13$.deactivationDetails) === null || _data$Employees13$$de === void 0 ? void 0 : _data$Employees13$$de.sort(function (a, b) {
      return new Date(a.effectiveFrom) - new Date(b.effectiveFrom);
    })[0].reasonForDeactivation)) || "NA"
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("HR_REMARKS"),
    text: (data === null || data === void 0 ? void 0 : (_data$Employees14 = data.Employees) === null || _data$Employees14 === void 0 ? void 0 : (_data$Employees14$ = _data$Employees14[0]) === null || _data$Employees14$ === void 0 ? void 0 : (_data$Employees14$$de = _data$Employees14$.deactivationDetails) === null || _data$Employees14$$de === void 0 ? void 0 : _data$Employees14$$de.sort(function (a, b) {
      return new Date(a.effectiveFrom) - new Date(b.effectiveFrom);
    })[0].remarks) || "NA"
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("HR_ORDER_NO"),
    text: (data === null || data === void 0 ? void 0 : (_data$Employees15 = data.Employees) === null || _data$Employees15 === void 0 ? void 0 : (_data$Employees15$ = _data$Employees15[0]) === null || _data$Employees15$ === void 0 ? void 0 : (_data$Employees15$$de = _data$Employees15$.deactivationDetails) === null || _data$Employees15$$de === void 0 ? void 0 : (_data$Employees15$$de2 = _data$Employees15$$de.sort(function (a, b) {
      return new Date(a.effectiveFrom) - new Date(b.effectiveFrom);
    })[0]) === null || _data$Employees15$$de2 === void 0 ? void 0 : _data$Employees15$$de2.orderNo) || "NA"
  })) : null, data !== null && data !== void 0 && (_data$Employees16 = data.Employees) !== null && _data$Employees16 !== void 0 && (_data$Employees16$ = _data$Employees16[0]) !== null && _data$Employees16$ !== void 0 && _data$Employees16$.documents ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, {
    style: {
      marginBottom: "40px"
    }
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
    label: t("TL_APPROVAL_UPLOAD_HEAD"),
    text: ""
  }), /*#__PURE__*/React__default.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap"
    }
  }, data === null || data === void 0 ? void 0 : (_data$Employees17 = data.Employees) === null || _data$Employees17 === void 0 ? void 0 : (_data$Employees17$ = _data$Employees17[0]) === null || _data$Employees17$ === void 0 ? void 0 : (_data$Employees17$$do = _data$Employees17$.documents) === null || _data$Employees17$$do === void 0 ? void 0 : _data$Employees17$$do.map(function (document, index) {
    return /*#__PURE__*/React__default.createElement("a", {
      onClick: function onClick() {
        return handleDownload(document);
      },
      style: {
        minWidth: "160px",
        marginRight: "20px"
      },
      key: index
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.DocumentSVG, {
      width: 85,
      height: 100,
      style: {
        background: "#f6f6f6",
        padding: "8px",
        marginLeft: "15px"
      }
    }), /*#__PURE__*/React__default.createElement("p", {
      style: {
        marginTop: "8px",
        maxWidth: "196px"
      }
    }, document.documentName));
  }))) : null, (data === null || data === void 0 ? void 0 : (_data$Employees18 = data.Employees) === null || _data$Employees18 === void 0 ? void 0 : (_data$Employees18$ = _data$Employees18[0]) === null || _data$Employees18$ === void 0 ? void 0 : _data$Employees18$.jurisdictions.length) > 0 ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, {
    className: "card-section-header"
  }, t("HR_JURIS_DET_HEADER")) : null, (data === null || data === void 0 ? void 0 : (_data$Employees19 = data.Employees) === null || _data$Employees19 === void 0 ? void 0 : (_data$Employees19$ = _data$Employees19[0]) === null || _data$Employees19$ === void 0 ? void 0 : (_data$Employees19$$ju = _data$Employees19$.jurisdictions) === null || _data$Employees19$$ju === void 0 ? void 0 : _data$Employees19$$ju.length) > 0 ? data === null || data === void 0 ? void 0 : (_data$Employees20 = data.Employees) === null || _data$Employees20 === void 0 ? void 0 : (_data$Employees20$ = _data$Employees20[0]) === null || _data$Employees20$ === void 0 ? void 0 : _data$Employees20$.jurisdictions.map(function (element, index) {
    var _data$Employees21, _data$Employees21$;

    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, {
      key: index,
      style: {
        maxWidth: "640px",
        border: "1px solid rgb(214, 213, 212)",
        inset: "0px",
        width: "auto",
        padding: ".2rem",
        marginBottom: "2rem"
      }
    }, /*#__PURE__*/React__default.createElement("div", {
      style: {
        paddingBottom: "2rem"
      }
    }, " ", t("HR_JURISDICTION"), " ", index + 1), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      label: t("HR_HIERARCHY_LABEL"),
      text: t(element !== null && element !== void 0 && element.hierarchy ? "EGOV_LOCATION_TENANTBOUNDARY_" + (element === null || element === void 0 ? void 0 : element.hierarchy) : "NA"),
      textStyle: {
        whiteSpace: "pre"
      }
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      label: t("HR_BOUNDARY_TYPE_LABEL"),
      text: t(Digit.Utils.locale.convertToLocale(element === null || element === void 0 ? void 0 : element.boundaryType, 'EGOV_LOCATION_BOUNDARYTYPE')),
      textStyle: {
        whiteSpace: "pre"
      }
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      label: t("HR_BOUNDARY_LABEL"),
      text: t(element === null || element === void 0 ? void 0 : element.boundary)
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      label: t("HR_ROLE_LABEL"),
      text: data === null || data === void 0 ? void 0 : (_data$Employees21 = data.Employees) === null || _data$Employees21 === void 0 ? void 0 : (_data$Employees21$ = _data$Employees21[0]) === null || _data$Employees21$ === void 0 ? void 0 : _data$Employees21$.user.roles.filter(function (ele) {
        return ele.tenantId == (element === null || element === void 0 ? void 0 : element.boundary);
      }).map(function (ele) {
        return t("ACCESSCONTROL_ROLES_ROLES_" + (ele === null || ele === void 0 ? void 0 : ele.code));
      })
    }));
  }) : null, (data === null || data === void 0 ? void 0 : (_data$Employees22 = data.Employees) === null || _data$Employees22 === void 0 ? void 0 : (_data$Employees22$ = _data$Employees22[0]) === null || _data$Employees22$ === void 0 ? void 0 : _data$Employees22$.assignments.length) > 0 ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, {
    className: "card-section-header"
  }, t("HR_ASSIGN_DET_HEADER")) : null, data === null || data === void 0 ? void 0 : (_data$Employees23 = data.Employees) === null || _data$Employees23 === void 0 ? void 0 : (_data$Employees23$ = _data$Employees23[0]) === null || _data$Employees23$ === void 0 ? void 0 : _data$Employees23$.assignments.map(function (element, index) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.StatusTable, {
      key: index,
      style: {
        maxWidth: "640px",
        border: "1px solid rgb(214, 213, 212)",
        inset: "0px",
        width: "auto",
        padding: ".2rem",
        marginBottom: "2rem"
      }
    }, /*#__PURE__*/React__default.createElement("div", {
      style: {
        paddingBottom: "2rem"
      }
    }, t("HR_ASSIGNMENT"), " ", index + 1), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      label: t("HR_ASMT_FROM_DATE_LABEL"),
      text: convertEpochFormateToDate(element === null || element === void 0 ? void 0 : element.fromDate),
      textStyle: {
        whiteSpace: "pre"
      }
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      label: t("HR_ASMT_TO_DATE_LABEL"),
      text: element !== null && element !== void 0 && element.isCurrentAssignment ? "Currently Working Here" : convertEpochFormateToDate(element === null || element === void 0 ? void 0 : element.toDate),
      textStyle: {
        whiteSpace: "pre"
      }
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      label: t("HR_DEPT_LABEL"),
      text: t("COMMON_MASTERS_DEPARTMENT_" + (element === null || element === void 0 ? void 0 : element.department))
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Row, {
      label: t("HR_DESG_LABEL"),
      text: t("COMMON_MASTERS_DESIGNATION_" + (element === null || element === void 0 ? void 0 : element.designation))
    }));
  }))) : null, showModal ? /*#__PURE__*/React__default.createElement(ActionModal, {
    t: t,
    action: selectedAction,
    tenantId: tenantId,
    applicationData: data,
    closeModal: closeModal,
    submitAction: submitAction
  }) : null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.ActionBar, null, displayMenu && data ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Menu, {
    localeKeyPrefix: "HR",
    options: data !== null && data !== void 0 && (_data$Employees24 = data.Employees) !== null && _data$Employees24 !== void 0 && (_data$Employees24$ = _data$Employees24[0]) !== null && _data$Employees24$ !== void 0 && _data$Employees24$.isActive ? activeworkflowActions : deactiveworkflowActions,
    t: t,
    onSelect: onActionSelect
  }) : null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    label: t("HR_COMMON_TAKE_ACTION"),
    onSubmit: function onSubmit() {
      return setDisplayMenu(!displayMenu);
    }
  })));
};

var HRMSModule = function HRMSModule(_ref) {
  var stateCode = _ref.stateCode,
      userType = _ref.userType,
      tenants = _ref.tenants;
  var moduleCode = "HR";
  var language = Digit.StoreData.getCurrentLanguage();

  var _Digit$Services$useSt = Digit.Services.useStore({
    stateCode: stateCode,
    moduleCode: moduleCode,
    language: language
  });

  var mobileView = innerWidth <= 640;
  var location = reactRouterDom.useLocation();

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var tenantId = Digit.ULBService.getCurrentTenantId();
  var inboxInitialState = {
    searchParams: {
      tenantId: tenantId
    }
  };
  Digit.SessionStorage.set("HRMS_TENANTS", tenants);

  var _useRouteMatch = reactRouterDom.useRouteMatch(),
      path = _useRouteMatch.path;

  if (!Digit.Utils.hrmsAccess()) {
    return null;
  }

  if (userType === "employee") {
    return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
      className: "ground-container"
    }, /*#__PURE__*/React__default.createElement("p", {
      className: "breadcrumb",
      style: {
        marginLeft: mobileView ? "2vw" : "revert"
      }
    }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
      to: "/digit-ui/employee",
      style: {
        cursor: "pointer",
        color: "#666"
      }
    }, t("HR_COMMON_BUTTON_HOME")), " ", "/ ", /*#__PURE__*/React__default.createElement("span", null, location.pathname === "/digit-ui/employee/hrms/inbox" ? t("HR_COMMON_HEADER") : t("HR_COMMON_HEADER"))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
      path: path + "/inbox",
      component: function component() {
        return /*#__PURE__*/React__default.createElement(Inbox, {
          parentRoute: path,
          businessService: "hrms",
          filterComponent: "HRMS_INBOX_FILTER",
          initialStates: inboxInitialState,
          isInbox: true
        });
      }
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
      path: path + "/create",
      component: function component() {
        return /*#__PURE__*/React__default.createElement(CreateEmployee, null);
      }
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
      path: path + "/response",
      component: function component(props) {
        return /*#__PURE__*/React__default.createElement(Response, _extends({}, props, {
          parentRoute: path
        }));
      }
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
      path: path + "/details/:tenantId/:id",
      component: function component() {
        return /*#__PURE__*/React__default.createElement(Details, null);
      }
    }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.PrivateRoute, {
      path: path + "/edit/:tenantId/:id",
      component: function component() {
        return /*#__PURE__*/React__default.createElement(EditEmpolyee, null);
      }
    }))));
  } else return null;
};
var componentsToRegister = {
  HRMSCard: HRMSCard,
  Details: Details,
  SelectEmployeeEmailId: SelectEmployeeEmailId,
  SelectEmployeeName: SelectEmployeeName,
  SelectEmployeeId: SelectEmployeeId,
  Jurisdictions: Jurisdictions,
  Assignments: Assignments,
  ActionModal: ActionModal,
  HRBanner: HRBanner,
  SelectEmployeePhoneNumber: SelectEmployeePhoneNumber,
  SelectDateofEmployment: SelectDateofEmployment,
  SelectEmployeeType: SelectEmployeeType,
  SelectEmployeeCorrespondenceAddress: SelectEmployeeCorrespondenceAddress,
  SelectEmployeeGender: SelectEmployeeGender,
  SelectDateofBirthEmployment: SelectDateofBirthEmployment,
  HRMSModule: HRMSModule,
  HRMS_INBOX_FILTER: function HRMS_INBOX_FILTER(props) {
    return /*#__PURE__*/React__default.createElement(Filter, props);
  }
};
var initHRMSComponents = function initHRMSComponents() {
  Object.entries(componentsToRegister).forEach(function (_ref2) {
    var key = _ref2[0],
        value = _ref2[1];
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

exports.HRMSModule = HRMSModule;
exports.initHRMSComponents = initHRMSComponents;
//# sourceMappingURL=index.js.map
