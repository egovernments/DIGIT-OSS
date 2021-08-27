import { Loader, PrivateRoute } from '@egovernments/digit-ui-react-components';
import React from 'react';
import 'react-i18next';
import { useRouteMatch, useLocation, Switch } from 'react-router-dom';

var EmployeeApp = function EmployeeApp(_ref) {
  var path = _ref.path;
  var location = useLocation();
  return /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ground-container"
  }, /*#__PURE__*/React.createElement(PrivateRoute, {
    exact: true,
    path: path + "/",
    component: function component() {
      return /*#__PURE__*/React.createElement("div", null, "Engagement");
    }
  }))));
};

var EngagementModule = function EngagementModule(_ref2) {
  var stateCode = _ref2.stateCode,
      userType = _ref2.userType,
      tenants = _ref2.tenants;
  var moduleCode = "Engagement";

  var _useRouteMatch = useRouteMatch(),
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
    return /*#__PURE__*/React.createElement(Loader, null);
  }

  Digit.SessionStorage.set("ENGAGEMENT_TENANTS", tenants);

  if (userType === "citizen") {
    return null;
  } else {
    return /*#__PURE__*/React.createElement(EmployeeApp, {
      path: path,
      url: url,
      userType: userType
    });
  }
};

var componentsToRegister = {
  EngagementModule: EngagementModule
};
var initEngagementComponents = function initEngagementComponents() {
  Object.entries(componentsToRegister).forEach(function (_ref4) {
    var key = _ref4[0],
        value = _ref4[1];
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};

export { initEngagementComponents };
//# sourceMappingURL=index.modern.js.map
