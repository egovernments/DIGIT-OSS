function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactQuery = require('react-query');
var reactRedux = require('react-redux');
var reactRouterDom = require('react-router-dom');
var reactI18next = require('react-i18next');
var digitUiReactComponents = require('@egovernments/digit-ui-react-components');
var redux = require('redux');
var thunk = _interopDefault(require('redux-thunk'));

var CitizenHome = function CitizenHome(_ref) {
  var modules = _ref.modules;
  var ComponentProvider = Digit.Contexts.ComponentProvider;
  var registry = React.useContext(ComponentProvider);
  var paymentModule = modules.filter(function (_ref2) {
    var code = _ref2.code;
    return code === "Payment";
  })[0];
  var moduleArr = modules.filter(function (_ref3) {
    var code = _ref3.code;
    return code !== "Payment";
  });
  var moduleArray = [paymentModule].concat(moduleArr);
  var showQuickPay = moduleArr.some(function (module) {
    return module.code === "QuickPayLinks";
  });
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, moduleArray.map(function (_ref4, index) {
    var code = _ref4.code;

    var Links = Digit.ComponentRegistryService.getComponent(code + "Links") || function () {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
    };

    if (code === "Payment" && !showQuickPay) {
      Links = function Links() {
        return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
      };
    }

    return /*#__PURE__*/React__default.createElement(Links, {
      key: index,
      matchPath: "/digit-ui/citizen/" + code.toLowerCase(),
      userType: "citizen"
    });
  }));
};

var EmployeeHome = function EmployeeHome(_ref5) {
  var modules = _ref5.modules;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "employee-app-container"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "ground-container moduleCardWrapper"
  }, modules.map(function (_ref6, index) {
    var code = _ref6.code;

    var Card = Digit.ComponentRegistryService.getComponent(code + "Card") || function () {
      return /*#__PURE__*/React__default.createElement(React__default.Fragment, null);
    };

    return /*#__PURE__*/React__default.createElement(Card, {
      key: index
    });
  })));
};

var AppHome = function AppHome(_ref7) {
  var userType = _ref7.userType,
      modules = _ref7.modules;

  if (userType === "citizen") {
    return /*#__PURE__*/React__default.createElement(CitizenHome, {
      modules: modules
    });
  }

  return /*#__PURE__*/React__default.createElement(EmployeeHome, {
    modules: modules
  });
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

var loginSteps = [{
  texts: {
    header: "CS_LOGIN_PROVIDE_MOBILE_NUMBER",
    cardText: "CS_LOGIN_TEXT",
    nextText: "CS_COMMONS_NEXT",
    submitBarLabel: "CS_COMMONS_NEXT"
  },
  inputs: [{
    label: "CORE_COMMON_MOBILE_NUMBER",
    type: "text",
    name: "mobileNumber",
    error: "ERR_HRMS_INVALID_MOB_NO",
    validation: {
      required: true,
      minLength: 10,
      maxLength: 10
    }
  }]
}, {
  texts: {
    header: "CS_LOGIN_OTP",
    cardText: "CS_LOGIN_OTP_TEXT",
    nextText: "CS_COMMONS_NEXT",
    submitBarLabel: "CS_COMMONS_NEXT"
  }
}, {
  texts: {
    header: "CS_LOGIN_PROVIDE_NAME",
    cardText: "CS_LOGIN_NAME_TEXT",
    nextText: "CS_COMMONS_NEXT",
    submitBarLabel: "CS_COMMONS_NEXT"
  },
  inputs: [{
    label: "CORE_COMMON_NAME",
    type: "text",
    name: "name",
    validation: {
      required: true
    }
  }]
}];

var SelectMobileNumber = function SelectMobileNumber(_ref) {
  var t = _ref.t,
      onSelect = _ref.onSelect,
      mobileNumber = _ref.mobileNumber,
      onMobileChange = _ref.onMobileChange,
      config = _ref.config;
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    isDisabled: mobileNumber.length !== 10,
    onSelect: onSelect,
    config: config,
    t: t,
    componentInFront: "+91",
    onChange: onMobileChange,
    value: mobileNumber
  });
};

function useInterval(callback, delay) {
  var savedCallback = React.useRef();
  React.useEffect(function () {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(function () {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      var timer = setInterval(tick, delay);
      return function () {
        return clearInterval(timer);
      };
    }
  }, [delay]);
}

var SelectOtp = function SelectOtp(_ref) {
  var config = _ref.config,
      otp = _ref.otp,
      onOtpChange = _ref.onOtpChange,
      onResend = _ref.onResend,
      onSelect = _ref.onSelect,
      t = _ref.t,
      error = _ref.error,
      _ref$userType = _ref.userType,
      userType = _ref$userType === void 0 ? "citizen" : _ref$userType;

  var _useState = React.useState(30),
      timeLeft = _useState[0],
      setTimeLeft = _useState[1];

  useInterval(function () {
    setTimeLeft(timeLeft - 1);
  }, timeLeft > 0 ? 1000 : null);

  var handleResendOtp = function handleResendOtp() {
    onResend();
    setTimeLeft(2);
  };

  if (userType === "employee") {
    return /*#__PURE__*/React__default.createElement(React.Fragment, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.OTPInput, {
      length: 6,
      onChange: onOtpChange,
      value: otp
    }), timeLeft > 0 ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, null, t("CS_RESEND_ANOTHER_OTP") + " " + timeLeft + " " + t("CS_RESEND_SECONDS")) : /*#__PURE__*/React__default.createElement("p", {
      className: "card-text-button",
      onClick: handleResendOtp
    }, t("CS_RESEND_OTP")), !error && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t("CS_INVALID_OTP")));
  }

  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    onSelect: onSelect,
    config: config,
    t: t,
    isDisabled: (otp === null || otp === void 0 ? void 0 : otp.length) !== 6
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.OTPInput, {
    length: 6,
    onChange: onOtpChange,
    value: otp
  }), timeLeft > 0 ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, null, t("CS_RESEND_ANOTHER_OTP") + " " + timeLeft + " " + t("CS_RESEND_SECONDS")) : /*#__PURE__*/React__default.createElement("p", {
    className: "card-text-button",
    onClick: handleResendOtp
  }, t("CS_RESEND_OTP")), !error && /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardLabelError, null, t("CS_INVALID_OTP")));
};

var SelectName = function SelectName(_ref) {
  var config = _ref.config,
      onSelect = _ref.onSelect,
      t = _ref.t;
  return /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormStep, {
    config: config,
    onSelect: onSelect,
    t: t
  });
};

var TYPE_REGISTER = {
  type: "register"
};
var TYPE_LOGIN = {
  type: "login"
};
var DEFAULT_REDIRECT_URL = "/digit-ui/citizen";

var getFromLocation = function getFromLocation(state, searchParams) {
  return (state === null || state === void 0 ? void 0 : state.from) || (searchParams === null || searchParams === void 0 ? void 0 : searchParams.from) || DEFAULT_REDIRECT_URL;
};

var Login = function Login(_ref) {
  var _location$state5;

  var stateCode = _ref.stateCode,
      _ref$isUserRegistered = _ref.isUserRegistered,
      isUserRegistered = _ref$isUserRegistered === void 0 ? true : _ref$isUserRegistered;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var location = reactRouterDom.useLocation();

  var _useRouteMatch = reactRouterDom.useRouteMatch(),
      path = _useRouteMatch.path;

  var history = reactRouterDom.useHistory();

  var _useState = React.useState(null),
      user = _useState[0],
      setUser = _useState[1];

  var _useState2 = React.useState(null),
      error = _useState2[0],
      setError = _useState2[1];

  var _useState3 = React.useState(true),
      isOtpValid = _useState3[0],
      setIsOtpValid = _useState3[1];

  var _useState4 = React.useState(null);

  var _useState5 = React.useState({}),
      params = _useState5[0],
      setParmas = _useState5[1];

  var _useState6 = React.useState(null),
      errorTO = _useState6[0],
      setErrorTO = _useState6[1];

  var searchParams = Digit.Hooks.useQueryParams();
  React.useEffect(function () {
    var errorTimeout;

    if (error) {
      if (errorTO) {
        clearTimeout(errorTO);
        setErrorTO(null);
      }

      errorTimeout = setTimeout(function () {
        console.log("clearing err");
        setError("");
      }, 5000);
      setErrorTO(errorTimeout);
    }

    return function () {
      errorTimeout && clearTimeout(errorTimeout);
    };
  }, [error]);
  React.useEffect(function () {
    var _location$state;

    if (!user) {
      return;
    }

    Digit.UserService.setUser(user);
    var redirectPath = ((_location$state = location.state) === null || _location$state === void 0 ? void 0 : _location$state.from) || DEFAULT_REDIRECT_URL;
    history.replace(redirectPath);
  }, [user]);
  var stepItems = React.useMemo(function () {
    return loginSteps.map(function (step) {
      var texts = {};

      for (var key in step.texts) {
        texts[key] = t(step.texts[key]);
      }

      return _extends({}, step, {
        texts: texts
      });
    }, [loginSteps]);
  });

  var getUserType = function getUserType() {
    return Digit.UserService.getType();
  };

  var handleOtpChange = function handleOtpChange(otp) {
    setParmas(_extends({}, params, {
      otp: otp
    }));
  };

  var handleMobileChange = function handleMobileChange(event) {
    var value = event.target.value;
    setParmas(_extends({}, params, {
      mobileNumber: value
    }));
  };

  var selectMobileNumber = function selectMobileNumber(mobileNumber) {
    try {
      setParmas(_extends({}, params, mobileNumber));

      var data = _extends({}, mobileNumber, {
        tenantId: stateCode,
        userType: getUserType()
      });

      return Promise.resolve(function () {
        if (isUserRegistered) {
          return Promise.resolve(sendOtp({
            otp: _extends({}, data, TYPE_LOGIN)
          })).then(function (_ref2) {
            var _location$state3;

            var res = _ref2[0],
                err = _ref2[1];

            if (!err) {
              var _location$state2;

              history.replace(path + "/otp", {
                from: getFromLocation(location.state, searchParams),
                role: (_location$state2 = location.state) === null || _location$state2 === void 0 ? void 0 : _location$state2.role
              });
              return;
            } else {
              history.replace("/digit-ui/citizen/register/name", {
                from: getFromLocation(location.state, searchParams)
              });
            }

            if ((_location$state3 = location.state) !== null && _location$state3 !== void 0 && _location$state3.role) {
              setError("User not registered.");
            }
          });
        } else {
          return Promise.resolve(sendOtp({
            otp: _extends({}, data, TYPE_REGISTER)
          })).then(function (_ref3) {
            var res = _ref3[0],
                err = _ref3[1];

            if (!err) {
              history.replace(path + "/otp", {
                from: getFromLocation(location.state, searchParams)
              });
            }
          });
        }
      }());
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var selectName = function selectName(name) {
    try {
      var data = _extends({}, params, {
        tenantId: stateCode,
        userType: getUserType()
      });

      setParmas(_extends({}, params, name));
      history.replace(path + "/otp", {
        from: getFromLocation(location.state, searchParams)
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var selectOtp = function selectOtp() {
    try {
      return Promise.resolve(_catch(function () {
        setIsOtpValid(true);
        var mobileNumber = params.mobileNumber,
            otp = params.otp,
            name = params.name;
        return function () {
          if (isUserRegistered) {
            var requestData = {
              username: mobileNumber,
              password: otp,
              tenantId: stateCode,
              userType: getUserType()
            };
            return Promise.resolve(Digit.UserService.authenticate(requestData)).then(function (_ref4) {
              var _location$state4;

              var ResponseInfo = _ref4.ResponseInfo,
                  info = _ref4.UserRequest,
                  tokens = _objectWithoutPropertiesLoose(_ref4, ["ResponseInfo", "UserRequest"]);

              if ((_location$state4 = location.state) !== null && _location$state4 !== void 0 && _location$state4.role) {
                var roleInfo = info.roles.find(function (userRole) {
                  return userRole.code === location.state.role;
                });

                if (!roleInfo || !roleInfo.code) {
                  setError(t("ES_ERROR_USER_NOT_PERMITTED"));
                  setTimeout(function () {
                    return history.replace(DEFAULT_REDIRECT_URL);
                  }, 5000);
                  return;
                }
              }

              setUser(_extends({
                info: info
              }, tokens));
            });
          } else {
            var _temp2 = function () {
              if (!isUserRegistered) {
                var _requestData = {
                  name: name,
                  username: mobileNumber,
                  otpReference: otp,
                  tenantId: stateCode
                };
                return Promise.resolve(Digit.UserService.registerUser(_requestData, stateCode)).then(function (_ref5) {
                  var ResponseInfo = _ref5.ResponseInfo,
                      info = _ref5.UserRequest,
                      tokens = _objectWithoutPropertiesLoose(_ref5, ["ResponseInfo", "UserRequest"]);

                  setUser(_extends({
                    info: info
                  }, tokens));
                });
              }
            }();

            if (_temp2 && _temp2.then) return _temp2.then(function () {});
          }
        }();
      }, function (err) {
        setIsOtpValid(false);
        console.log(err);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var resendOtp = function resendOtp() {
    try {
      var mobileNumber = params.mobileNumber;
      var data = {
        mobileNumber: mobileNumber,
        tenantId: stateCode,
        userType: getUserType()
      };

      var _temp5 = function () {
        if (!isUserRegistered) {
          return Promise.resolve(sendOtp({
            otp: _extends({}, data, TYPE_REGISTER)
          })).then(function () {});
        } else {
          var _temp6 = function () {
            if (isUserRegistered) {
              return Promise.resolve(sendOtp({
                otp: _extends({}, data, TYPE_LOGIN)
              })).then(function () {});
            }
          }();

          if (_temp6 && _temp6.then) return _temp6.then(function () {});
        }
      }();

      return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var sendOtp = function sendOtp(data) {
    return Promise.resolve(_catch(function () {
      return Promise.resolve(Digit.UserService.sendOtp(data, stateCode)).then(function (res) {
        return [res, null];
      });
    }, function (err) {
      return [null, err];
    }));
  };

  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.AppContainer, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.BackButton, null), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "" + path,
    exact: true
  }, /*#__PURE__*/React__default.createElement(SelectMobileNumber, {
    onSelect: selectMobileNumber,
    config: stepItems[0],
    mobileNumber: params.mobileNumber || "",
    onMobileChange: handleMobileChange,
    showRegisterLink: isUserRegistered && !((_location$state5 = location.state) !== null && _location$state5 !== void 0 && _location$state5.role),
    t: t
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/otp"
  }, /*#__PURE__*/React__default.createElement(SelectOtp, {
    config: _extends({}, stepItems[1], {
      texts: _extends({}, stepItems[1].texts, {
        cardText: stepItems[1].texts.cardText + " " + (params.mobileNumber || "")
      })
    }),
    onOtpChange: handleOtpChange,
    onResend: resendOtp,
    onSelect: selectOtp,
    otp: params.otp,
    error: isOtpValid,
    t: t
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/name"
  }, /*#__PURE__*/React__default.createElement(SelectName, {
    config: stepItems[2],
    onSelect: selectName,
    t: t
  })), error && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: true,
    label: error,
    onClose: function onClose() {
      return setError(null);
    }
  })));
};

var loginConfig = [{
  texts: {
    header: "CORE_COMMON_LOGIN",
    submitButtonLabel: "CORE_COMMON_CONTINUE",
    secondaryButtonLabel: "CORE_COMMON_FORGOT_PASSWORD"
  },
  inputs: [{
    label: "CORE_LOGIN_USERNAME",
    type: "text",
    name: "username",
    error: "ERR_HRMS_INVALID_USER_ID"
  }, {
    label: "CORE_LOGIN_PASSWORD",
    type: "password",
    name: "password",
    error: "ERR_HRMS_WRONG_PASSWORD"
  }, {
    label: "CORE_COMMON_CITY",
    type: "custom",
    name: "city",
    error: "ERR_HRMS_INVALID_CITY"
  }]
}];

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

var Background = function Background(_ref) {
  var children = _ref.children;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "banner"
  }, children);
};

var Header = function Header() {
  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      storeData = _Digit$Hooks$useStore.data,
      isLoading = _Digit$Hooks$useStore.isLoading;

  var _ref = storeData || {},
      stateInfo = _ref.stateInfo;

  if (isLoading) return null;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "bannerHeader"
  }, /*#__PURE__*/React__default.createElement("img", {
    className: "bannerLogo",
    src: stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.logoUrl
  }), /*#__PURE__*/React__default.createElement("p", null, stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.name));
};

var Login$1 = function Login(_ref) {
  var propsConfig = _ref.config,
      t = _ref.t;

  var _Digit$Hooks$useTenan = Digit.Hooks.useTenants(),
      cities = _Digit$Hooks$useTenan.data,
      isLoading = _Digit$Hooks$useTenan.isLoading;

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      isStoreLoading = _Digit$Hooks$useStore.isLoading;

  var _useState = React.useState(null),
      user = _useState[0],
      setUser = _useState[1];

  var _useState2 = React.useState(null),
      showToast = _useState2[0],
      setShowToast = _useState2[1];

  var history = reactRouterDom.useHistory();

  var getUserType = function getUserType() {
    return Digit.UserService.getType();
  };

  React.useEffect(function () {
    var _location$state;

    if (!user) {
      return;
    }

    Digit.UserService.setUser(user);
    var redirectPath = ((_location$state = location.state) === null || _location$state === void 0 ? void 0 : _location$state.from) || "/digit-ui/employee";
    history.replace(redirectPath);
  }, [user]);

  var onLogin = function onLogin(data) {
    try {
      if (!data.city) {
        alert("Please Select City!");
        return Promise.resolve();
      }

      var requestData = _extends({}, data, {
        userType: getUserType()
      });

      requestData.tenantId = data.city.code;
      delete requestData.city;

      var _temp2 = _catch(function () {
        return Promise.resolve(Digit.UserService.authenticate(requestData)).then(function (_ref3) {
          var info = _ref3.UserRequest,
              tokens = _objectWithoutPropertiesLoose(_ref3, ["UserRequest"]);

          setUser(_extends({
            info: info
          }, tokens));
        });
      }, function (err) {
        var _err$response, _err$response$data;

        setShowToast((err === null || err === void 0 ? void 0 : (_err$response = err.response) === null || _err$response === void 0 ? void 0 : (_err$response$data = _err$response.data) === null || _err$response$data === void 0 ? void 0 : _err$response$data.error_description) || "Invalid login credentials!");
        setTimeout(closeToast, 5000);
      });

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var closeToast = function closeToast() {
    setShowToast(null);
  };

  var onForgotPassword = function onForgotPassword() {
    history.push("/digit-ui/employee/user/forgot-password");
  };

  var _propsConfig$inputs = propsConfig.inputs,
      userId = _propsConfig$inputs[0],
      password = _propsConfig$inputs[1],
      city = _propsConfig$inputs[2];
  var config = [{
    body: [{
      label: t(userId.label),
      type: userId.type,
      populators: {
        name: userId.name
      },
      isMandatory: true
    }, {
      label: t(password.label),
      type: password.type,
      populators: {
        name: password.name
      },
      isMandatory: true
    }, {
      label: t(city.label),
      type: city.type,
      populators: {
        name: city.name,
        customProps: {},
        component: function component(props, customProps) {
          return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, _extends({
            option: cities,
            optionKey: "i18nKey",
            select: function select(d) {
              props.onChange(d);
            },
            t: t
          }, customProps));
        }
      },
      isMandatory: true
    }]
  }];
  return isLoading || isStoreLoading ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null) : /*#__PURE__*/React__default.createElement(Background, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormComposer, {
    onSubmit: onLogin,
    noBoxShadow: true,
    inline: true,
    submitInForm: true,
    config: config,
    label: propsConfig.texts.submitButtonLabel,
    secondaryActionLabel: propsConfig.texts.secondaryButtonLabel,
    onSecondayActionClick: onForgotPassword,
    heading: propsConfig.texts.header,
    headingStyle: {
      textAlign: "center"
    },
    cardStyle: {
      margin: "auto",
      minWidth: "400px"
    }
  }, /*#__PURE__*/React__default.createElement(Header, null)), showToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: true,
    label: t(showToast),
    onClose: closeToast
  }));
};

Login$1.propTypes = {
  loginParams: propTypes.any
};
Login$1.defaultProps = {
  loginParams: null
};

var EmployeeLogin = function EmployeeLogin() {
  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useRouteMatch = reactRouterDom.useRouteMatch(),
      path = _useRouteMatch.path;

  var loginParams = React.useMemo(function () {
    return loginConfig.map(function (step) {
      var texts = {};

      for (var key in step.texts) {
        texts[key] = t(step.texts[key]);
      }

      return _extends({}, step, {
        texts: texts
      });
    }, [loginConfig]);
  });
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "" + path,
    exact: true
  }, /*#__PURE__*/React__default.createElement(Login$1, {
    config: loginParams[0],
    t: t
  })));
};

var config = [{
  texts: {
    header: "CORE_COMMON_FORGOT_PASSWORD_LABEL",
    submitButtonLabel: "CORE_COMMON_CHANGE_PASSWORD"
  },
  inputs: [{
    label: "CORE_LOGIN_USERNAME",
    type: "text",
    name: "userName",
    error: "ERR_HRMS_INVALID_USERNAME"
  }, {
    label: "CORE_LOGIN_NEW_PASSWORD",
    type: "password",
    name: "newPassword",
    error: "CORE_COMMON_REQUIRED_ERRMSG"
  }, {
    label: "CORE_LOGIN_CONFIRM_NEW_PASSWORD",
    type: "password",
    name: "confirmPassword",
    error: "CORE_COMMON_REQUIRED_ERRMSG"
  }]
}];

var ChangePasswordComponent = function ChangePasswordComponent(_ref) {
  var propsConfig = _ref.config,
      t = _ref.t;

  var _useState = React.useState(null),
      user = _useState[0];

  var _Digit$Hooks$useQuery = Digit.Hooks.useQueryParams(),
      mobileNumber = _Digit$Hooks$useQuery.mobile_number,
      tenantId = _Digit$Hooks$useQuery.tenantId;

  var history = reactRouterDom.useHistory();

  var _useState2 = React.useState(""),
      otp = _useState2[0],
      setOtp = _useState2[1];

  var _useState3 = React.useState(true),
      isOtpValid = _useState3[0];

  var _useState4 = React.useState(null),
      showToast = _useState4[0],
      setShowToast = _useState4[1];

  var getUserType = function getUserType() {
    return Digit.UserService.getType();
  };

  React.useEffect(function () {
    var _location$state;

    if (!user) {
      return;
    }

    Digit.UserService.setUser(user);
    var redirectPath = ((_location$state = location.state) === null || _location$state === void 0 ? void 0 : _location$state.from) || "/digit-ui/employee";
    history.replace(redirectPath);
  }, [user]);

  var closeToast = function closeToast() {
    setShowToast(null);
  };

  var onResendOTP = function onResendOTP() {
    try {
      var _temp3 = function _temp3() {
        setTimeout(closeToast, 5000);
      };

      var requestData = {
        otp: {
          mobileNumber: mobileNumber,
          userType: getUserType().toUpperCase(),
          type: "passwordreset",
          tenantId: tenantId
        }
      };

      var _temp4 = _catch(function () {
        return Promise.resolve(Digit.UserService.sendOtp(requestData, tenantId)).then(function () {
          setShowToast(t("ES_OTP_RESEND"));
        });
      }, function (err) {
        var _err$response, _err$response$data;

        setShowToast((err === null || err === void 0 ? void 0 : (_err$response = err.response) === null || _err$response === void 0 ? void 0 : (_err$response$data = _err$response.data) === null || _err$response$data === void 0 ? void 0 : _err$response$data.error_description) || t("ES_INVALID_LOGIN_CREDENTIALS"));
      });

      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var onChangePassword = function onChangePassword(data) {
    try {
      return Promise.resolve(_catch(function () {
        if (data.newPassword !== data.confirmPassword) {
          return setShowToast(t("ERR_PASSWORD_DO_NOT_MATCH"));
        }

        var requestData = _extends({}, data, {
          otpReference: otp,
          tenantId: tenantId,
          type: getUserType().toUpperCase()
        });

        return Promise.resolve(Digit.UserService.changePassword(requestData, tenantId)).then(function (response) {
          console.log({
            response: response
          });
          navigateToLogin();
        });
      }, function (err) {
        var _err$response2, _err$response2$data, _err$response2$data$e, _err$response2$data$e2, _err$response2$data$e3;

        setShowToast((err === null || err === void 0 ? void 0 : (_err$response2 = err.response) === null || _err$response2 === void 0 ? void 0 : (_err$response2$data = _err$response2.data) === null || _err$response2$data === void 0 ? void 0 : (_err$response2$data$e = _err$response2$data.error) === null || _err$response2$data$e === void 0 ? void 0 : (_err$response2$data$e2 = _err$response2$data$e.fields) === null || _err$response2$data$e2 === void 0 ? void 0 : (_err$response2$data$e3 = _err$response2$data$e2[0]) === null || _err$response2$data$e3 === void 0 ? void 0 : _err$response2$data$e3.message) || t("ES_SOMETHING_WRONG"));
        setTimeout(closeToast, 5000);
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var navigateToLogin = function navigateToLogin() {
    history.replace("/digit-ui/employee/login");
  };

  var _propsConfig$inputs = propsConfig.inputs,
      username = _propsConfig$inputs[0],
      password = _propsConfig$inputs[1],
      confirmPassword = _propsConfig$inputs[2];
  var config = [{
    body: [{
      label: t(username.label),
      type: username.type,
      populators: {
        name: username.name
      },
      isMandatory: true
    }, {
      label: t(password.label),
      type: password.type,
      populators: {
        name: password.name
      },
      isMandatory: true
    }, {
      label: t(confirmPassword.label),
      type: confirmPassword.type,
      populators: {
        name: confirmPassword.name
      },
      isMandatory: true
    }]
  }];
  return /*#__PURE__*/React__default.createElement(Background, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormComposer, {
    onSubmit: onChangePassword,
    noBoxShadow: true,
    inline: true,
    submitInForm: true,
    config: config,
    label: propsConfig.texts.submitButtonLabel,
    cardStyle: {
      maxWidth: "400px",
      margin: "auto"
    }
  }, /*#__PURE__*/React__default.createElement(Header, null), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardSubHeader, {
    style: {
      textAlign: "center"
    }
  }, " ", propsConfig.texts.header, " "), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardText, null, t("CS_LOGIN_OTP_TEXT") + " " + mobileNumber), /*#__PURE__*/React__default.createElement(SelectOtp, {
    t: t,
    userType: "employee",
    otp: otp,
    onOtpChange: setOtp,
    error: isOtpValid,
    onResend: onResendOTP
  })), showToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: true,
    label: t(showToast),
    onClose: closeToast
  }));
};

ChangePasswordComponent.propTypes = {
  loginParams: propTypes.any
};
ChangePasswordComponent.defaultProps = {
  loginParams: null
};

var EmployeeChangePassword = function EmployeeChangePassword() {
  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useRouteMatch = reactRouterDom.useRouteMatch(),
      path = _useRouteMatch.path;

  var params = React.useMemo(function () {
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
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "" + path,
    exact: true
  }, /*#__PURE__*/React__default.createElement(ChangePasswordComponent, {
    config: params[0],
    t: t
  })));
};

var loginConfig$1 = [{
  texts: {
    header: "ES_FORGOT_PASSWORD",
    description: "ES_FORGOT_PASSWORD_DESC",
    submitButtonLabel: "CORE_COMMON_CONTINUE"
  },
  inputs: [{
    label: "CORE_COMMON_MOBILE_NUMBER",
    type: "text",
    name: "mobileNumber",
    error: "ERR_HRMS_INVALID_MOBILE_NUMBER"
  }, {
    label: "CORE_COMMON_CITY",
    type: "custom",
    name: "city",
    error: "ERR_HRMS_INVALID_CITY"
  }]
}];

var ForgotPassword = function ForgotPassword(_ref) {
  var propsConfig = _ref.config,
      t = _ref.t;

  var _Digit$Hooks$useTenan = Digit.Hooks.useTenants(),
      cities = _Digit$Hooks$useTenan.data,
      isLoading = _Digit$Hooks$useTenan.isLoading;

  var _useState = React.useState(null),
      user = _useState[0];

  var history = reactRouterDom.useHistory();

  var _useState2 = React.useState(null),
      showToast = _useState2[0],
      setShowToast = _useState2[1];

  var getUserType = function getUserType() {
    return Digit.UserService.getType();
  };

  React.useEffect(function () {
    var _location$state;

    if (!user) {
      return;
    }

    Digit.UserService.setUser(user);
    var redirectPath = ((_location$state = location.state) === null || _location$state === void 0 ? void 0 : _location$state.from) || "/digit-ui/employee";
    history.replace(redirectPath);
  }, [user]);

  var closeToast = function closeToast() {
    setShowToast(null);
  };

  var onForgotPassword = function onForgotPassword(data) {
    try {
      if (!data.city) {
        alert("Please Select City!");
        return Promise.resolve();
      }

      var requestData = {
        otp: _extends({}, data, {
          userType: getUserType().toUpperCase(),
          type: "passwordreset",
          tenantId: data.city.code
        })
      };

      var _temp2 = _catch(function () {
        return Promise.resolve(Digit.UserService.sendOtp(requestData, data.city.code)).then(function () {
          history.push("/digit-ui/employee/user/change-password?mobile_number=" + data.mobileNumber + "&tenantId=" + data.city.code);
        });
      }, function (err) {
        var _err$response, _err$response$data, _err$response$data$er, _err$response$data$er2, _err$response$data$er3;

        setShowToast((err === null || err === void 0 ? void 0 : (_err$response = err.response) === null || _err$response === void 0 ? void 0 : (_err$response$data = _err$response.data) === null || _err$response$data === void 0 ? void 0 : (_err$response$data$er = _err$response$data.error) === null || _err$response$data$er === void 0 ? void 0 : (_err$response$data$er2 = _err$response$data$er.fields) === null || _err$response$data$er2 === void 0 ? void 0 : (_err$response$data$er3 = _err$response$data$er2[0]) === null || _err$response$data$er3 === void 0 ? void 0 : _err$response$data$er3.message) || "Invalid login credentials!");
        setTimeout(closeToast, 5000);
      });

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var navigateToLogin = function navigateToLogin() {
    history.replace("/digit-ui/employee/login");
  };

  var _propsConfig$inputs = propsConfig.inputs,
      userId = _propsConfig$inputs[0],
      city = _propsConfig$inputs[1];
  var config = [{
    body: [{
      label: t(userId.label),
      type: userId.type,
      populators: {
        name: userId.name,
        componentInFront: "+91"
      },
      isMandatory: true
    }, {
      label: t(city.label),
      type: city.type,
      populators: {
        name: city.name,
        customProps: {},
        component: function component(props, customProps) {
          return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, _extends({
            option: cities,
            optionKey: "name",
            id: city.name,
            select: function select(d) {
              props.onChange(d);
            }
          }, customProps));
        }
      },
      isMandatory: true
    }]
  }];

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null);
  }

  return /*#__PURE__*/React__default.createElement(Background, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.FormComposer, {
    onSubmit: onForgotPassword,
    noBoxShadow: true,
    inline: true,
    submitInForm: true,
    config: config,
    label: propsConfig.texts.submitButtonLabel,
    secondaryActionLabel: propsConfig.texts.secondaryButtonLabel,
    onSecondayActionClick: navigateToLogin,
    heading: propsConfig.texts.header,
    description: propsConfig.texts.description,
    headingStyle: {
      textAlign: "center"
    },
    cardStyle: {
      maxWidth: "400px",
      margin: "auto"
    }
  }, /*#__PURE__*/React__default.createElement(Header, null)), showToast && /*#__PURE__*/React__default.createElement(digitUiReactComponents.Toast, {
    error: true,
    label: t(showToast),
    onClose: closeToast
  }));
};

ForgotPassword.propTypes = {
  loginParams: propTypes.any
};
ForgotPassword.defaultProps = {
  loginParams: null
};

var EmployeeForgotPassword = function EmployeeForgotPassword() {
  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useRouteMatch = reactRouterDom.useRouteMatch(),
      path = _useRouteMatch.path;

  var params = React.useMemo(function () {
    return loginConfig$1.map(function (step) {
      var texts = {};

      for (var key in step.texts) {
        texts[key] = t(step.texts[key]);
      }

      return _extends({}, step, {
        texts: texts
      });
    }, [loginConfig$1]);
  });
  console.log({
    params: params
  });
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "" + path,
    exact: true
  }, /*#__PURE__*/React__default.createElement(ForgotPassword, {
    config: params[0],
    t: t
  })));
};

var LanguageSelection = function LanguageSelection() {
  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      storeData = _Digit$Hooks$useStore.data,
      isLoading = _Digit$Hooks$useStore.isLoading;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();

  var _ref = storeData || {},
      languages = _ref.languages,
      stateInfo = _ref.stateInfo;

  var selectedLanguage = Digit.StoreData.getCurrentLanguage();

  var _useState = React.useState(selectedLanguage),
      selected = _useState[0],
      setselected = _useState[1];

  var handleChangeLanguage = function handleChangeLanguage(language) {
    setselected(language.value);
    Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
  };

  var handleSubmit = function handleSubmit(event) {
    history.push("/digit-ui/employee/user/login");
  };

  if (isLoading) return null;
  return /*#__PURE__*/React__default.createElement(Background, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Card, {
    className: "bannerCard"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "bannerHeader"
  }, /*#__PURE__*/React__default.createElement("img", {
    className: "bannerLogo",
    src: stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.logoUrl
  }), /*#__PURE__*/React__default.createElement("p", null, stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.name)), /*#__PURE__*/React__default.createElement("div", {
    className: "language-selector",
    style: {
      justifyContent: "space-between",
      marginBottom: "24px"
    }
  }, languages.map(function (language, index) {
    return /*#__PURE__*/React__default.createElement("div", {
      className: "language-button-container",
      key: index
    }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CustomButton, {
      selected: language.value === selected,
      text: language.label,
      onClick: function onClick() {
        return handleChangeLanguage(language);
      }
    }));
  })), /*#__PURE__*/React__default.createElement(digitUiReactComponents.SubmitBar, {
    style: {
      width: "100%"
    },
    label: t("CORE_COMMON_CONTINUE"),
    onSubmit: handleSubmit
  })));
};

var getTenants = function getTenants(codes, tenants) {
  return tenants.filter(function (tenant) {
    return codes.map(function (item) {
      return item.code;
    }).includes(tenant.code);
  });
};

var AppModules = function AppModules(_ref) {
  var stateCode = _ref.stateCode,
      userType = _ref.userType,
      modules = _ref.modules,
      appTenants = _ref.appTenants;
  var ComponentProvider = Digit.Contexts.ComponentProvider;

  var _useRouteMatch = reactRouterDom.useRouteMatch(),
      path = _useRouteMatch.path;

  var appRoutes = modules.map(function (_ref2, index) {
    var code = _ref2.code,
        tenants = _ref2.tenants;
    var Module = Digit.ComponentRegistryService.getComponent(code + "Module");
    return /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
      key: index,
      path: path + "/" + code.toLowerCase()
    }, /*#__PURE__*/React__default.createElement(Module, {
      stateCode: stateCode,
      moduleCode: code,
      userType: userType,
      tenants: getTenants(tenants, appTenants)
    }));
  });
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, appRoutes, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/login"
  }, /*#__PURE__*/React__default.createElement(EmployeeLogin, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/forgot-password"
  }, /*#__PURE__*/React__default.createElement(EmployeeForgotPassword, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/change-password"
  }, " ", /*#__PURE__*/React__default.createElement(EmployeeChangePassword, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, null, /*#__PURE__*/React__default.createElement(AppHome, {
    userType: userType,
    modules: modules
  })));
};

var ChangeLanguage = function ChangeLanguage(prop) {
  var isDropdown = prop.dropdown || false;

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      storeData = _Digit$Hooks$useStore.data,
      isLoading = _Digit$Hooks$useStore.isLoading;

  var _ref = storeData || {},
      languages = _ref.languages,
      stateInfo = _ref.stateInfo;

  var selectedLanguage = Digit.StoreData.getCurrentLanguage();

  var _useState = React.useState(selectedLanguage),
      selected = _useState[0],
      setselected = _useState[1];

  var handleChangeLanguage = function handleChangeLanguage(language) {
    setselected(language.value);
    Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
  };

  if (isLoading) return null;

  if (isDropdown) {
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
      option: languages,
      selected: languages.find(function (language) {
        return language.value === selectedLanguage;
      }),
      optionKey: "label",
      select: handleChangeLanguage,
      freeze: true,
      customSelector: /*#__PURE__*/React__default.createElement("label", {
        className: "cp"
      }, languages.find(function (language) {
        return language.value === selected;
      }).label)
    }));
  } else {
    return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement("div", {
      style: {
        marginBottom: "5px"
      }
    }, "Language"), /*#__PURE__*/React__default.createElement("div", {
      className: "language-selector"
    }, languages.map(function (language, index) {
      return /*#__PURE__*/React__default.createElement("div", {
        className: "language-button-container",
        key: index
      }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CustomButton, {
        selected: language.value === selected,
        text: language.label,
        onClick: function onClick() {
          return handleChangeLanguage(language);
        }
      }));
    })));
  }
};

var TextToImg = function TextToImg(props) {
  return /*#__PURE__*/React__default.createElement("span", {
    className: "user-img-txt",
    onClick: props.toggleMenu,
    title: props.name
  }, props.name[0].toUpperCase());
};

var TopBar = function TopBar(_ref) {
  var _cityDetails$city, _userDetails$info, _userDetails$info2, _userDetails$info2$us;

  var t = _ref.t,
      stateInfo = _ref.stateInfo,
      toggleSidebar = _ref.toggleSidebar,
      handleLogout = _ref.handleLogout,
      userDetails = _ref.userDetails,
      CITIZEN = _ref.CITIZEN,
      cityDetails = _ref.cityDetails,
      mobileView = _ref.mobileView,
      userOptions = _ref.userOptions,
      handleUserDropdownSelection = _ref.handleUserDropdownSelection,
      logoUrl = _ref.logoUrl;

  var updateSidebar = function updateSidebar() {
    if (!Digit.clikOusideFired) {
      toggleSidebar(true);
    } else {
      Digit.clikOusideFired = false;
    }
  };

  if (CITIZEN) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.TopBar, {
      img: stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.logoUrlWhite,
      isMobile: true,
      toggleSidebar: updateSidebar,
      logoUrl: stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.logoUrlWhite,
      onLogout: handleLogout,
      userDetails: userDetails
    });
  }

  return /*#__PURE__*/React__default.createElement("div", {
    className: "topbar"
  }, mobileView ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Hamburger, {
    handleClick: toggleSidebar,
    color: "#9E9E9E"
  }) : null, /*#__PURE__*/React__default.createElement("img", {
    className: "city",
    src: cityDetails === null || cityDetails === void 0 ? void 0 : cityDetails.logoId
  }), /*#__PURE__*/React__default.createElement("p", {
    className: "ulb",
    style: mobileView ? {
      fontSize: "14px",
      display: "inline-block"
    } : {}
  }, t(cityDetails === null || cityDetails === void 0 ? void 0 : cityDetails.i18nKey).toUpperCase(), " ", t("ULBGRADE_" + (cityDetails === null || cityDetails === void 0 ? void 0 : (_cityDetails$city = cityDetails.city) === null || _cityDetails$city === void 0 ? void 0 : _cityDetails$city.ulbGrade.toUpperCase().replace(" ", "_").replace(".", "_"))).toUpperCase()), !mobileView && /*#__PURE__*/React__default.createElement("div", {
    className: mobileView ? "right" : "flex-right right w-80 column-gap-15"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "left"
  }, /*#__PURE__*/React__default.createElement(ChangeLanguage, {
    dropdown: true
  })), (userDetails === null || userDetails === void 0 ? void 0 : userDetails.access_token) && /*#__PURE__*/React__default.createElement("div", {
    className: "left"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    option: userOptions,
    optionKey: "name",
    select: handleUserDropdownSelection,
    showArrow: false,
    freeze: true,
    style: mobileView ? {
      right: 0
    } : {},
    optionCardStyles: {
      overflow: "revert"
    },
    customSelector: /*#__PURE__*/React__default.createElement(TextToImg, {
      name: (userDetails === null || userDetails === void 0 ? void 0 : (_userDetails$info = userDetails.info) === null || _userDetails$info === void 0 ? void 0 : _userDetails$info.name) || (userDetails === null || userDetails === void 0 ? void 0 : (_userDetails$info2 = userDetails.info) === null || _userDetails$info2 === void 0 ? void 0 : (_userDetails$info2$us = _userDetails$info2.userInfo) === null || _userDetails$info2$us === void 0 ? void 0 : _userDetails$info2$us.name) || "Employee"
    })
  })), /*#__PURE__*/React__default.createElement("img", {
    className: "state",
    src: logoUrl
  })));
};

var SideBarMenu = function SideBarMenu(t, closeSidebar, isEmployee) {
  return [{
    type: "link",
    text: t("COMMON_BOTTOM_NAVIGATION_HOME"),
    link: isEmployee ? "/digit-ui/employee/" : "/digit-ui/citizen/",
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.HomeIcon, {
      className: "icon"
    }),
    populators: {
      onClick: closeSidebar
    }
  }, {
    type: "component",
    action: /*#__PURE__*/React__default.createElement(ChangeLanguage, null),
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.LanguageIcon, {
      className: "icon"
    })
  }];
};

var digitImg = "data:image/png;base64,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" + "4ffyGJt9D+/HMAAAAASUVORK5CYII=";

var powered = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR4AAAA2CAYAAAARQfY5AAAACXBIWX" + "MAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABFBSURBVHgB7Z1hct" + "s2FoAfICdNnR+rnqDMCeqcoMoJKu/MzthOG8mzB0hygtonSHqAndDdjpPZzuwqJ4hygnhPEPUG2h" + "+bet2IWLwHWhaJBxKgRUlO8M2kriiRBEHg4b2HhweASCQSiUQikU8dAZFIJIj+/qMUhBgUj2aHo9" + "O/p7Bk+geD9/pPUryVeDB6lY7hBiMhEolEVsxWf//7PojOM2iCgsnCpzOQ2W9wMRuPfj09g0gkEn" + "GwpVXGLpRVOV9E4bweKK1A3ZKoHk60PnjchuoZiURuPm2ZWom+9Au0T/sHPwwhEolEFmjbx5MYAf" + "ToR4hEIpGcLcfxqXbg/AQ+KOhqc+1r/XenZHotII608IHR6c/HEIlEPnucgkcLiSMIpL837IFU6K" + "jesb/Vwmdv+PamTwNGIpHrs1RTC4XK6PTkvhYyvGYj1QuIRCKfPa34eEan6ZHDVEto+j4SiXzWtO" + "dcvi2PSnE+OZ3HEIlEPmu2oCVGaTrVDuUTbXYVZ7QE5/8Jo98fduHOeZc+nN+ZjkbpFCIW/b295P" + "L/R69eTWBFzN/PNd/Nqsv/KbSrdb3zUFoTPMQfcgS3VHkqvfvng79+/c/Tv/0GnlCDuDsbQia/0z" + "raDiilG8cX5sttBf2HgylkMAaRvYasM9a+pon3tfcfPdezcn8qHPwgnoY0uv7BgRamtwqanPZ1HU" + "IAeQT5d4WDavZ69PKXkfc1rHqC7lUZaWnRGf3LZiejV7+MIYC68umJgwSEeqzvO5y/H3w3B4Mz4/" + "dbb/md99z7vkfPJUC7AFTialebGgzrVWdKP4MSP/n0C7Y/QPa2yfNTm5DKDqXJxHG7gueuNrUu7M" + "NZNrun/9QKHlOpuuBKPaGoaFzSqpgf0pQ+NhzZ1w860ZpWGjB1jy+quOBve/ZW/zcFb7aG+j/DxS" + "O60k+CZvBEB8tQ8n9tvfY5leppO3usOz7WU9dZT2a2cQdkZ9jfH2BjPPQW0kLiucPSMXyHI13fWu" + "iq53TMvm8XfJ4BryHUkXf5MTreLJacQAOu2hY8cf5ooV3p+/2o73e4SbOy3nWGVoZuG/r3R7X9wi" + "wbHxYPSmyXKYQiM123Ylg4pt0vug4PWw0gRHMLGkIj0bZ6V9kweBITNzR4TxK3DqHG9kH5LQQhvr" + "MvkfUgjJ515Hc9UtVAz4j1pJ95cbSrRQCGPrzb3T8cwDUwwaHiOTQEy6+F4Bu6Rkj58T1L9b5JcO" + "q8zsLaFt7vzaYEw+r2/SK8zqhfvCOh6yKTnIbdpVCZUIRg+pGiwbRVwdMfDkMa0pzd/UcDParpxt" + "hwDZnBNJQ64XO7w1W098xbfv3E/kZ4d+j+X4Y4khfrSqvHdeZe/0Cf10Gh07ieukpkaX9/2GymUW" + "HD0gKvIbkq/oaEYGN0Z9r/wVuAzO/ZuM7080pmoFklJlZuCM3YgS/Vv1xf5hrdxPpCZEFthOpZMf" + "5cJWmQanfJxPlH1pEsZee96xTsTEqIlP0SbVUQh1rlvaf9BgL/6c/3UQXmZ9DqhQ9pZcLSLMgPBT" + "6ImeuFJN7X2Jr17INZpZllnkk3IG7EUzBCM0T7qr6iOtJ/6bNSJ+zFhHrhpR1a57ECA4XlGdWpqd" + "eps/wuAWB8EruX77m+/PKZ94hsfA4J+91l+zJt6p65p3hqtY8wzawNFvsV1m/qVe5L9HtDs8t9ea" + "aehf9ASkiuTcPZpWncro9HCE7wTF2O5XlnYs7RlflUFzotfzE6Tc/AOB1TLbSO9PllVRidnhi4+A" + "BcZLqTC9krHFIXu/pPvQkhtVNPOS7rew3BmHYfO+PKc7hOi8JX2X6IXHPCY2NdR7o8dO5i5+nW1l" + "E9qX5H/n4tXgCw77lQ/j39jgVpScVzBV1vDBXkC5aH1heOegMz8uOx50Yr1JqGuJYWvlyMgOb8dP" + "h5DFjuveEw15BKwlI81t+lrI8skynjFCZzy/v9Cjmw+oXK5gKtNY2H7Egh7ZidTL11ntRR+PvE/o" + "KciCnUYAIXmahpkvAVq+S5Tq5ED2rI1cmK30lflbxXvLd2wP1KApW/r3mWpHR4qstcm5mOBHUmdq" + "0vsI6a2PEIOl31LJ5vo3QKAF2uuvdMHUU/J5Q1Ka/yS9s/Y4ROfb29TEd0X16zXgej0cuTWuc61S" + "f3vmmwyZ44zpmw2pKnueXsF+rKrdGeqXXXpdKyzqvLwjIVIY5zrcYLEj6siimdTsG8kxcbshT1Dm" + "ZbnbQ7Q7/az8X6d0SdU1lyU5RPfWd4TCdjIssD7XhC8ZpoJdyAhO/ZU3CZ5+TKr5zv2CGs9aBDwm" + "4CvvdVIihMohVQ+H3wL0f+vpkBWQyc7TNjTH1fc4szs9BnuVDPSxc8+CD9h4NnrBAxU2kpeyJf2I" + "nRYgKZ0Usp+xaS6hHRsmvrPfmoThYukR1b9/1yNqy8BuffUcLp32E7UFW9usDI8jKhdjze92Vab0" + "ouQIK27HRs8p5vk5OyLOh33IKe0T4z9bpKs+TIheMI1onSQjo0uJGrLxzwth0+yi86KXPUc3aLqW" + "slCv1rKYKHhI2e/qapxrvqvXOasmq04EZB5VhsWoMZmRQjsStGdG4aUcx2XD+nGbuyOomqpHXfGn" + "OL8e+QWu+EfanB9ZQ71cudzt+pjtRqZgy3suEyrpOHaoxLh7twxxkZ37OOCO3LaIJS/4H1MoFAqL" + "64PqFYP6xr0sVXK+4xx8aLH1zO5STPbu8JRnx28v91/catSlMnvlBcBbC/9yuSblRCFUdwQdOgvF" + "C8ozvhBY0ICyMmdXJ+RP/fxx6IzuIR8tijw65w33wUrhiheoVPqvaZe8yxMTQhU/8uTwBkcIH+kx" + "TaAmM7ym0kEyfQBJW91cKj2BHMYDFePGTMWWVpQtUC/hOEYtZEuU+4XQozPaBJ1Sv9Hs9/4jolXw" + "Ruh4aUzNkqjScJ+FfFlPwAVao0N+1uzIcJNOUOcCp04lLFWQ2gSnW3lg/kTnNz30Uh04UveQc0H7" + "/j7oTs7zF3UtN6EszI2eJUca4l2u/6HILMnTmCmaoX8hvr2NbHxDqmrjGo3VQydqY0cf7ebstItb" + "lV7hcI06bbnU53T/cV4afdJ3ANzCJVTDpfqthb9Jlv6Pa0+qXqPmZ+XRxplTHV6L4PB2cFM0wofB" + "n26Er+HUv2j8EFdaBO8ZiCaXVMRhXiG+ZYAm3xX133t6yjU9jOMJwfwhG2WZipr+yfSWZgW7u5tH" + "JIIz+w3Hhdl0a+sNC76AYx5tbYcZuedeTcbvttCB7jX9Ed0X/OX9ijrFjCtCVeQ5UEz1aF4EEfjV" + "DFrX6YSqblHIuah9HOrn5D8Qqyt3iK/mf7t2z/zlmlkObrKbEyAFwHa4HgEul87FqCk+pxDeWXDb" + "Wsm88ESoOx3O5gnfGuAPR9SlUSPLy5lfeLpHi+duCPTqxrV+RcFk8hjDP4oDtgs1QCjHqvfoM2ED" + "OnKZGPCBMoVB6jFchOyU4uSX9chnFRCNpyBV/1Cp9URYyTuVECNxkpElgHOPgIiDQA26zuEyXfp6" + "M9y5K/zRxk/WgVOZcDp2evg1kFvCGg539BtcxjcUoCtVc4peQc5c2toubEOjyV/LycnZEbAsZMlf" + "NqceaWtYZt6grzaNfH48syzKplwamWxjlMQiEXGMnCt1PWpCz7i8ozarZ/Z9oo5QIGk4klOkoz8R" + "ZWybLLL8TEPgZNtPDIJZkcW0soSuYW0y8Q50C6GYJHKT2jVFZ5hH88iRvbrMo6k8oz2Gl1SnFhKp" + "HiUApl5SsXA7AuCv6ipKCeltd4Zcqjw6sJlFVD3WlDk46tDXrP1tHJCspvC571L/RcFwkEQubWQ8" + "zfVND0i+YWN1FSEQjb9oZ+fgi2YSRwXbip21n16MdPqy+okOW4B0flsgFYizl6rLI1NrN24KbwcW" + "tiHVvJoksU2OX7tuhE31BcGQi8soGySygWggllKbDVRLU72/RmCB4uvuCauZnzmBcLrxB5u5ITE5" + "3N5BipStZVvo4yQsuaFTOMobZcgXEYm8ZdPnVJ3Xq2a8NruT347GDimcBzdo9bQpEvsWEXhdaYzx" + "shePIp5LBApTq2+IVq4ANXybimpbyerC5ZV/k62lFNSxLsuKUznyDAVuppheTLHCbWF9vOnEbLwR" + "FMGrQ85FOAm3XK/GaPXXmrzCaeTF+riUbfDI0H4daRSBW2aHERfu3Xic+p/Dom+a29KLT6etzLoh" + "w9llrq49/JEUwnEuoGbRnErReSzd+zB651Rxn8cTN8Y2VEU/8UkzmRTf3rYCGfztX52tyy+kUpro" + "1hgwQPu2Bv6DKZqnCmQAhZ02QLgz6TY2QMwdchp3LxmUKm0WdsvqF+U62HTMiqXEXLhl2MC73G6V" + "dh/r5r7stldBSPQ808s5uGR8qUVgkfaJx9QnX8255JE1zUuNHcCjSzkI0RPCQhuQLfUi9CGodxoL" + "G5d9KgNU12B6ld+Oa4Tlr4bNKFuqOea6DfcsmoZHj6UrM7BWYjlC9WlcTc+Z4bpl81Sc91+R8Onl" + "W2E2P2WmZqnjfKH5PNL4F1QoI6MM80nwQtaCsoxwp3u87/ED9BDZuj8SAzNr0DJqf2Ej7OPL7YUb" + "Ow1BG5MKiYAcu8tp5xZnO7pEkMC59exC+5fU6+0wLWVa59YdL0wZvWHb0I/567QeUnTW2AaXKHdA" + "BTsWyrd5WLgLnkYfo8H6E7zzMVsBFAq2CeaQ/hQ/UhKZ1wYn2pGmQFUDWpRGqyZ16yUYLHnRlPv2" + "xsVA6V2jRC3XicOy74bWZmwfmd5t8FqKhVPpwGAXvOeroUPrpBujpwqa7KZmx3FbtnmvKzwme+ZU" + "1l+R/qDod5n6yFulANJsNiU5fm276Y2Ub7fpjqodlWS+2CwkdrfM5yY3/ZZt8zkgYnjwOfAVl5Dc" + "ibEUC4wOj05yf9/UddJhteYkyCAW7CdjaP/VHUWHe09O7yDU8ch2bJuzqVyV9iOAs028bsjorIec" + "NsdphB8EKhr6HcqBJskLjYlTbtW4wKr6ork3t4F1YEpknR7znhsx7iFjLqyF1+aWs1l7mTKwQnLW" + "XZGx5Ssngb3CjwTb57qBmxBSXB11PFnfa1wBBMtHeSfxrSBodsuWXXeX7DJHv5BewV6/OvpFdf2y" + "xTK2f08uehY0RHEtKAjIo9JJ+JMwqV8jUfQVNuO7SakFkoqNiryGPvLOc10XS4TUnP3YLL+JOGUF" + "dXVwnPJ7BCat5zWPmFX+5kehdZRSZMs26wl997x7of1ZWq9WG0iqABothu6sp9xdS3rpxkzskQ7w" + "F5IwUPgpoP7Q3UJKu/8ek8uJbQgYr0j40Wc3IqqJ+fyAWWb3R6sktmS9PdD5R2BP4u7q9a6FxC79" + "m9L1o9JufTg6ANAdDEQO0u/J4jrCutTXjfqwUm+U4h94PLT78PqyuOfCC1r5EJb4G8sYIHIROJtj" + "LRD+RTyaYRPs070hiWQVm7CZyFmsONEnV7Z3lCAlblm7j5NcYpjdoonF+mT1bh16kiFwQPck3Ep1" + "NMLzct9Nnihb3nfLsabTbU1Rm2KxrITnaprnDN2fqge+Mz62e/5ym0pzQ4Yb+4ptC5gtX6x+DJjc" + "pSQlv2Um6V7MqvoeSU/D1Z2NTgpwxbT4ScAKrDS2t87WBiZbS5wJU/053sXD/DkoUlxUGZe3YL9/" + "sAo3ULZh+cfUOR+TOGJaN9Sm8K8TvoNtCDgO/5N0rwRCKR9ZOHrbwvHMwoxXHqeYnNNrUikcgGwu" + "+LPoaQS0AkEokEUYqCVuFujih4IpGIN/xOtuER0NHHE4lEvGCXJFHCLz27FkjUeCKRSC20LINb8y" + "Wa7QK7cUsmIpHIeukfHOgp+a0+fVCUInYnj4gugvFDv0Oj5UhR8EQikSKZ7ILMt7OpcsbMxNOmMU" + "7R1IpEIg0Qx6N/pM0WOGv+D0SMWAJo82FCAAAAAElFTkSuQmCC";

var defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO4AAADUCAMAAACs0e/bAAAAM1BMVEXK0eL" + "/" + "/" + "/" + "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";

var Profile = function Profile(_ref) {
  var info = _ref.info;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "profile-section"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "imageloader imageloader-loaded"
  }, /*#__PURE__*/React__default.createElement("img", {
    className: "img-responsive img-circle img-Profile",
    src: defaultImage
  })), /*#__PURE__*/React__default.createElement("div", {
    id: "profile-name",
    className: "label-container name-Profile"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "label-text"
  }, " ", info.name, " ")), /*#__PURE__*/React__default.createElement("div", {
    id: "profile-location",
    className: "label-container loc-Profile"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "label-text"
  }, " ", info === null || info === void 0 ? void 0 : info.mobileNumber, " ")), info.emailId && /*#__PURE__*/React__default.createElement("div", {
    id: "profile-emailid",
    className: "label-container loc-Profile"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "label-text"
  }, " ", info.emailId, " ")));
};

var PoweredBy = function PoweredBy() {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "digit-footer"
  }, /*#__PURE__*/React__default.createElement("img", {
    src: powered,
    alt: "Powered by"
  }), /*#__PURE__*/React__default.createElement("img", {
    src: digitImg,
    alt: "DIGIT"
  }));
};

var CitizenSideBar = function CitizenSideBar(_ref2) {
  var isOpen = _ref2.isOpen,
      toggleSidebar = _ref2.toggleSidebar,
      onLogout = _ref2.onLogout,
      _ref2$isEmployee = _ref2.isEmployee,
      isEmployee = _ref2$isEmployee === void 0 ? false : _ref2$isEmployee;

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      storeData = _Digit$Hooks$useStore.data,
      isFetched = _Digit$Hooks$useStore.isFetched;

  var _ref3 = storeData || {},
      stateInfo = _ref3.stateInfo;

  var user = Digit.UserService.getUser();

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var closeSidebar = function closeSidebar() {
    Digit.clikOusideFired = true;
    toggleSidebar(false);
  };

  var menuItems = [].concat(SideBarMenu(t, closeSidebar, isEmployee));
  var profileItem;

  if (isFetched && user && user.access_token) {
    profileItem = /*#__PURE__*/React__default.createElement(Profile, {
      info: user.info,
      stateName: stateInfo.name
    });
    menuItems = [].concat(menuItems, [{
      text: t("CORE_COMMON_LOGOUT"),
      icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.LogoutIcon, {
        className: "icon"
      }),
      populators: {
        onClick: onLogout
      }
    }]);
  }

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.NavBar, {
    open: isOpen,
    profileItem: profileItem,
    menuItems: menuItems,
    onClose: closeSidebar,
    Footer: /*#__PURE__*/React__default.createElement(PoweredBy, null)
  }));
};

var EmployeeSideBar = function EmployeeSideBar() {
  return /*#__PURE__*/React__default.createElement("div", {
    className: "sidebar"
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.Link, {
    to: "/digit-ui/employee"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "actions active"
  }, /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    fill: "white"
  })))), /*#__PURE__*/React__default.createElement("a", {
    href: "/employee"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M8.17 5.7L1 10.48V21h5v-8h4v8h5V10.25z",
    fill: "white"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M17 7h2v2h-2z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M10 3v1.51l2 1.33L13.73 7H15v.85l2 1.34V11h2v2h-2v2h2v2h-2v4h6V3H10zm9 6h-2V7h2v2z",
    fill: "white"
  })))), /*#__PURE__*/React__default.createElement("a", {
    href: "/employee"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z",
    fill: "white"
  })))), /*#__PURE__*/React__default.createElement("a", {
    href: "/employee"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    height: "24",
    viewBox: "0 0 24 24",
    width: "24"
  }, /*#__PURE__*/React__default.createElement("path", {
    d: "M24 0H0v24h24z",
    fill: "none"
  }), /*#__PURE__*/React__default.createElement("path", {
    d: "M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z",
    fill: "white"
  })))));
};

var SideBar = function SideBar(_ref) {
  var CITIZEN = _ref.CITIZEN,
      isSidebarOpen = _ref.isSidebarOpen,
      toggleSidebar = _ref.toggleSidebar,
      handleLogout = _ref.handleLogout,
      mobileView = _ref.mobileView,
      userDetails = _ref.userDetails;
  if (CITIZEN) return /*#__PURE__*/React__default.createElement(CitizenSideBar, {
    isOpen: isSidebarOpen,
    isMobile: true,
    toggleSidebar: toggleSidebar,
    onLogout: handleLogout
  });else {
    if (!mobileView && userDetails !== null && userDetails !== void 0 && userDetails.access_token) return /*#__PURE__*/React__default.createElement(EmployeeSideBar, {
      mobileView: mobileView,
      userDetails: userDetails
    });else return /*#__PURE__*/React__default.createElement(CitizenSideBar, {
      isOpen: isSidebarOpen,
      isMobile: true,
      toggleSidebar: toggleSidebar,
      onLogout: handleLogout,
      isEmployee: true
    });
  }
};

var TopBarSideBar = function TopBarSideBar(_ref) {
  var t = _ref.t,
      stateInfo = _ref.stateInfo,
      userDetails = _ref.userDetails,
      CITIZEN = _ref.CITIZEN,
      cityDetails = _ref.cityDetails,
      mobileView = _ref.mobileView,
      handleUserDropdownSelection = _ref.handleUserDropdownSelection,
      logoUrl = _ref.logoUrl,
      _ref$showSidebar = _ref.showSidebar,
      showSidebar = _ref$showSidebar === void 0 ? true : _ref$showSidebar;

  var _useState = React.useState(false),
      isSidebarOpen = _useState[0],
      toggleSidebar = _useState[1];

  var handleLogout = function handleLogout() {
    toggleSidebar(false);
    Digit.UserService.logout();
  };

  var userOptions = [{
    name: t("CORE_COMMON_LOGOUT"),
    icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.LogoutIcon, {
      className: "icon"
    }),
    func: handleLogout
  }];
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(TopBar, {
    t: t,
    stateInfo: stateInfo,
    toggleSidebar: toggleSidebar,
    isSidebarOpen: isSidebarOpen,
    handleLogout: handleLogout,
    userDetails: userDetails,
    CITIZEN: CITIZEN,
    cityDetails: cityDetails,
    mobileView: mobileView,
    userOptions: userOptions,
    handleUserDropdownSelection: handleUserDropdownSelection,
    logoUrl: logoUrl
  }), showSidebar && /*#__PURE__*/React__default.createElement(SideBar, {
    t: t,
    CITIZEN: CITIZEN,
    isSidebarOpen: isSidebarOpen,
    toggleSidebar: toggleSidebar,
    handleLogout: handleLogout,
    mobileView: mobileView,
    userDetails: userDetails
  }));
};

var EmployeeApp = function EmployeeApp(_ref) {
  var stateInfo = _ref.stateInfo,
      userDetails = _ref.userDetails,
      CITIZEN = _ref.CITIZEN,
      cityDetails = _ref.cityDetails,
      mobileView = _ref.mobileView,
      handleUserDropdownSelection = _ref.handleUserDropdownSelection,
      logoUrl = _ref.logoUrl,
      DSO = _ref.DSO,
      stateCode = _ref.stateCode,
      modules = _ref.modules,
      appTenants = _ref.appTenants,
      sourceUrl = _ref.sourceUrl;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useRouteMatch = reactRouterDom.useRouteMatch(),
      path = _useRouteMatch.path;

  return /*#__PURE__*/React__default.createElement("div", {
    class: "employee"
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/user"
  }, /*#__PURE__*/React__default.createElement(TopBarSideBar, {
    t: t,
    stateInfo: stateInfo,
    userDetails: userDetails,
    CITIZEN: CITIZEN,
    cityDetails: cityDetails,
    mobileView: mobileView,
    handleUserDropdownSelection: handleUserDropdownSelection,
    logoUrl: logoUrl,
    showSidebar: false
  }), /*#__PURE__*/React__default.createElement("div", {
    class: "loginContainer",
    style: {
      '--banner-url': "url(" + (stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.bannerUrl) + ")"
    }
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/user/login"
  }, /*#__PURE__*/React__default.createElement(EmployeeLogin, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/user/forgot-password"
  }, /*#__PURE__*/React__default.createElement(EmployeeForgotPassword, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/user/change-password"
  }, " ", /*#__PURE__*/React__default.createElement(EmployeeChangePassword, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/user/language-selection"
  }, /*#__PURE__*/React__default.createElement(LanguageSelection, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
    to: path + "/user/language-selection"
  }))))), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, null, /*#__PURE__*/React__default.createElement(TopBarSideBar, {
    t: t,
    stateInfo: stateInfo,
    userDetails: userDetails,
    CITIZEN: CITIZEN,
    cityDetails: cityDetails,
    mobileView: mobileView,
    handleUserDropdownSelection: handleUserDropdownSelection,
    logoUrl: logoUrl
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "main " + (DSO ? "m-auto" : "")
  }, /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(AppModules, {
    stateCode: stateCode,
    userType: "employee",
    modules: modules,
    appTenants: appTenants
  })), /*#__PURE__*/React__default.createElement("div", {
    className: "employee-home-footer"
  }, /*#__PURE__*/React__default.createElement("img", {
    src: sourceUrl + "/digit-footer.png",
    style: {
      height: "1.1em",
      cursor: "pointer"
    },
    onClick: function onClick() {
      window.open("https://www.digit.org/", "_blank").focus();
    }
  }))))));
};

var Home = function Home() {
  var _Digit$SessionStorage, _Digit$UserService;

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();
  var tenantId = (_Digit$SessionStorage = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")) === null || _Digit$SessionStorage === void 0 ? void 0 : _Digit$SessionStorage.code;

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      _Digit$Hooks$useStore2 = _Digit$Hooks$useStore.data;

  _Digit$Hooks$useStore2 = _Digit$Hooks$useStore2 === void 0 ? {} : _Digit$Hooks$useStore2;
  var stateInfo = _Digit$Hooks$useStore2.stateInfo,
      isLoading = _Digit$Hooks$useStore.isLoading;

  var _Digit$Hooks$useEvent = Digit.Hooks.useEvents({
    tenantId: tenantId
  }),
      EventsData = _Digit$Hooks$useEvent.data,
      EventsDataLoading = _Digit$Hooks$useEvent.isLoading;

  if (!((_Digit$UserService = Digit.UserService) !== null && _Digit$UserService !== void 0 && _Digit$UserService.getUser())) {
    history.push("/digit-ui/citizen/login?from=" + encodeURIComponent(window.location.pathname + window.location.search));
  }

  if (!tenantId) {
    history.push("/digit-ui/citizen/select-language");
  }

  var allCitizenServicesProps = {
    header: t("DASHBOARD_CITIZEN_SERVICES_LABEL"),
    sideOption: {
      name: t("DASHBOARD_VIEW_ALL_LABEL"),
      onClick: function onClick() {
        return history.push("/digit-ui/citizen/all-services");
      }
    },
    options: [{
      name: t("ES_PGR_HEADER_COMPLAINT"),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.ComplaintIcon, null),
      onClick: function onClick() {
        return history.push("/digit-ui/citizen/pgr/complaints");
      }
    }, {
      name: t("MODULE_PT"),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.PTIcon, {
        className: "fill-path-primary-main"
      }),
      onClick: function onClick() {
        return history.push("/digit-ui/citizen/pt/property/my-properties");
      }
    }, {
      name: t("MODULE_TL"),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.CaseIcon, {
        className: "fill-path-primary-main"
      }),
      onClick: function onClick() {
        return history.push("/digit-ui/citizen/tl/tradelicence/my-application");
      }
    }, {
      name: t("ACTION_TEST_WATER_AND_SEWERAGE"),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.DropIcon, null),
      onClick: function onClick() {
        return history.push("/digit-ui/citizen/all-services");
      }
    }]
  };
  var allInfoAndUpdatesProps = {
    header: t("CS_COMMON_DASHBOARD_INFO_UPDATES"),
    sideOption: {
      name: t("DASHBOARD_VIEW_ALL_LABEL"),
      onClick: function onClick() {
        return console.log("view all");
      }
    },
    options: [{
      name: t("CS_HEADER_MYCITY"),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.HomeIcon, null)
    }, {
      name: t("EVENTS_EVENTS_HEADER"),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.Calender, null)
    }, {
      name: t("CS_COMMON_DOCUMENTS"),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.DocumentIcon, null)
    }, {
      name: t("CS_COMMON_HELP"),
      Icon: /*#__PURE__*/React__default.createElement(digitUiReactComponents.HelpIcon, null)
    }]
  };
  return isLoading ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null) : /*#__PURE__*/React__default.createElement("div", {
    className: "HomePageWrapper"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "BannerWithSearch"
  }, /*#__PURE__*/React__default.createElement("img", {
    src: stateInfo === null || stateInfo === void 0 ? void 0 : stateInfo.bannerUrl
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "Search"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.StandaloneSearchBar, {
    placeholder: t("CS_COMMON_SEARCH_PLACEHOLDER")
  }))), /*#__PURE__*/React__default.createElement("div", {
    className: "ServicesSection"
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardBasedOptions, allCitizenServicesProps), /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardBasedOptions, allInfoAndUpdatesProps)), EventsDataLoading ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null) : /*#__PURE__*/React__default.createElement("div", {
    className: "WhatsNewSection"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "headSection"
  }, /*#__PURE__*/React__default.createElement("h2", null, t("DASHBOARD_WHATS_NEW_LABEL")), /*#__PURE__*/React__default.createElement("p", null, t("DASHBOARD_VIEW_ALL_LABEL"))), /*#__PURE__*/React__default.createElement(digitUiReactComponents.WhatsNewCard, EventsData === null || EventsData === void 0 ? void 0 : EventsData[0])));
};

var LanguageSelection$1 = function LanguageSelection() {
  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      _Digit$Hooks$useStore2 = _Digit$Hooks$useStore.data;

  _Digit$Hooks$useStore2 = _Digit$Hooks$useStore2 === void 0 ? {} : _Digit$Hooks$useStore2;
  var languages = _Digit$Hooks$useStore2.languages,
      stateInfo = _Digit$Hooks$useStore2.stateInfo,
      isLoading = _Digit$Hooks$useStore.isLoading;
  var selectedLanguage = Digit.StoreData.getCurrentLanguage();
  var texts = React.useMemo(function () {
    return {
      header: t("CS_COMMON_CHOOSE_LANGUAGE"),
      submitBarLabel: t("CS_COMMON_SUBMIT")
    };
  }, [t]);
  var RadioButtonProps = React.useMemo(function () {
    return {
      options: languages,
      optionsKey: "label",
      additionalWrapperClass: "reverse-radio-selection-wrapper",
      onSelect: function onSelect(language) {
        return Digit.LocalizationService.changeLanguage(language.value, stateInfo.code);
      },
      selectedOption: languages === null || languages === void 0 ? void 0 : languages.filter(function (i) {
        return i.value === selectedLanguage;
      })[0]
    };
  }, [selectedLanguage, languages]);

  function onSubmit() {
    history.push("/digit-ui/citizen/select-location");
  }

  return isLoading ? /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, null) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.PageBasedInput, {
    texts: texts,
    onSubmit: onSubmit
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("CS_COMMON_CHOOSE_LANGUAGE")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioButtons, RadioButtonProps));
};

var LocationSelection = function LocationSelection() {
  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var history = reactRouterDom.useHistory();

  var _Digit$Hooks$useTenan = Digit.Hooks.useTenants(),
      cities = _Digit$Hooks$useTenan.data,
      isLoading = _Digit$Hooks$useTenan.isLoading;

  var _useState = React.useState(function () {
    return Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY");
  }),
      selectedCity = _useState[0],
      setSelectedCity = _useState[1];

  var texts = React.useMemo(function () {
    return {
      header: t("CS_COMMON_CHOOSE_LOCATION"),
      submitBarLabel: t("CS_COMMON_SUBMIT")
    };
  }, [t]);

  function selectCity(city) {
    setSelectedCity(city);
  }

  var RadioButtonProps = React.useMemo(function () {
    return {
      options: cities,
      optionsKey: "i18nKey",
      additionalWrapperClass: "reverse-radio-selection-wrapper",
      onSelect: selectCity,
      selectedOption: selectedCity
    };
  }, [cities, t, selectedCity]);

  function onSubmit() {
    Digit.SessionStorage.set("CITIZEN.COMMON.HOME.CITY", selectedCity);
    history.push("/digit-ui/citizen");
  }

  return isLoading ? /*#__PURE__*/React__default.createElement("loader", null) : /*#__PURE__*/React__default.createElement(digitUiReactComponents.PageBasedInput, {
    texts: texts,
    onSubmit: onSubmit
  }, /*#__PURE__*/React__default.createElement(digitUiReactComponents.CardHeader, null, t("CS_COMMON_CHOOSE_LOCATION")), /*#__PURE__*/React__default.createElement(digitUiReactComponents.Dropdown, {
    className: "form-field",
    selected: selectedCity,
    option: cities,
    select: selectCity,
    optionKey: "i18nKey",
    t: t
  }), /*#__PURE__*/React__default.createElement(digitUiReactComponents.RadioButtons, RadioButtonProps));
};

var getTenants$1 = function getTenants(codes, tenants) {
  return tenants.filter(function (tenant) {
    return codes.map(function (item) {
      return item.code;
    }).includes(tenant.code);
  });
};

var Home$1 = function Home$1(_ref) {
  var stateInfo = _ref.stateInfo,
      userDetails = _ref.userDetails,
      CITIZEN = _ref.CITIZEN,
      cityDetails = _ref.cityDetails,
      mobileView = _ref.mobileView,
      handleUserDropdownSelection = _ref.handleUserDropdownSelection,
      logoUrl = _ref.logoUrl,
      stateCode = _ref.stateCode,
      modules = _ref.modules,
      appTenants = _ref.appTenants,
      sourceUrl = _ref.sourceUrl,
      pathname = _ref.pathname;
  var classname = Digit.Hooks.fsm.useRouteSubscription(pathname);

  var _useTranslation = reactI18next.useTranslation(),
      t = _useTranslation.t;

  var _useRouteMatch = reactRouterDom.useRouteMatch(),
      path = _useRouteMatch.path;

  var appRoutes = modules.map(function (_ref2, index) {
    var code = _ref2.code,
        tenants = _ref2.tenants;
    var Module = Digit.ComponentRegistryService.getComponent(code + "Module");
    return /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
      key: index,
      path: path + "/" + code.toLowerCase()
    }, /*#__PURE__*/React__default.createElement(Module, {
      stateCode: stateCode,
      moduleCode: code,
      userType: "citizen",
      tenants: getTenants$1(tenants, appTenants)
    }));
  });
  return /*#__PURE__*/React__default.createElement("div", {
    className: classname
  }, /*#__PURE__*/React__default.createElement(TopBarSideBar, {
    t: t,
    stateInfo: stateInfo,
    userDetails: userDetails,
    CITIZEN: CITIZEN,
    cityDetails: cityDetails,
    mobileView: mobileView,
    handleUserDropdownSelection: handleUserDropdownSelection,
    logoUrl: logoUrl
  }), /*#__PURE__*/React__default.createElement("div", {
    className: "main center-container mb-25"
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    exact: true,
    path: path
  }, /*#__PURE__*/React__default.createElement(Home, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    exact: true,
    path: path + "/select-language"
  }, /*#__PURE__*/React__default.createElement(LanguageSelection$1, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    exact: true,
    path: path + "/select-location"
  }, /*#__PURE__*/React__default.createElement(LocationSelection, null)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/all-services"
  }, /*#__PURE__*/React__default.createElement(AppHome, {
    userType: "citizen",
    modules: modules
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/login"
  }, " ", /*#__PURE__*/React__default.createElement(Login, {
    stateCode: stateCode
  })), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: path + "/register"
  }, /*#__PURE__*/React__default.createElement(Login, {
    stateCode: stateCode,
    isUserRegistered: false
  })), appRoutes)), /*#__PURE__*/React__default.createElement("div", {
    className: "citizen-home-footer"
  }, /*#__PURE__*/React__default.createElement("img", {
    src: sourceUrl + "/digit-footer.png",
    style: {
      height: "1.2em",
      cursor: "pointer"
    },
    onClick: function onClick() {
      window.open("https://www.digit.org/", "_blank").focus();
    }
  })));
};

var DigitApp = function DigitApp(_ref) {
  var _userDetails$info;

  var stateCode = _ref.stateCode,
      modules = _ref.modules,
      appTenants = _ref.appTenants,
      logoUrl = _ref.logoUrl;
  var history = reactRouterDom.useHistory();

  var _useLocation = reactRouterDom.useLocation(),
      pathname = _useLocation.pathname;

  var innerWidth = window.innerWidth;
  var cityDetails = Digit.ULBService.getCurrentUlb();
  var userDetails = Digit.UserService.getUser();

  var _Digit$Hooks$useStore = Digit.Hooks.useStore.getInitData(),
      storeData = _Digit$Hooks$useStore.data;

  var _ref2 = storeData || {},
      stateInfo = _ref2.stateInfo;

  var CITIZEN = (userDetails === null || userDetails === void 0 ? void 0 : (_userDetails$info = userDetails.info) === null || _userDetails$info === void 0 ? void 0 : _userDetails$info.type) === "CITIZEN" || !window.location.pathname.split("/").includes("employee") ? true : false;
  var DSO = Digit.UserService.hasAccess(["FSM_DSO"]);
  React.useEffect(function () {
    if (!(pathname !== null && pathname !== void 0 && pathname.includes("application-details"))) {
      if (!(pathname !== null && pathname !== void 0 && pathname.includes("inbox"))) {
        Digit.SessionStorage.del("fsm/inbox/searchParams");
      }

      if (pathname !== null && pathname !== void 0 && pathname.includes("search")) {
        Digit.SessionStorage.del("fsm/search/searchParams");
      }
    }

    if (!(pathname !== null && pathname !== void 0 && pathname.includes("dss"))) {
      Digit.SessionStorage.del("DSS_FILTERS");
    }
  }, [pathname]);
  history.listen(function () {
    var _window;

    (_window = window) === null || _window === void 0 ? void 0 : _window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  });

  var handleUserDropdownSelection = function handleUserDropdownSelection(option) {
    option.func();
  };

  var mobileView = innerWidth <= 640;
  var sourceUrl = window.location.origin + "/citizen";
  var commonProps = {
    stateInfo: stateInfo,
    userDetails: userDetails,
    CITIZEN: CITIZEN,
    cityDetails: cityDetails,
    mobileView: mobileView,
    handleUserDropdownSelection: handleUserDropdownSelection,
    logoUrl: logoUrl,
    DSO: DSO,
    stateCode: stateCode,
    modules: modules,
    appTenants: appTenants,
    sourceUrl: sourceUrl,
    pathname: pathname
  };
  return /*#__PURE__*/React__default.createElement(reactRouterDom.Switch, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "/digit-ui/employee"
  }, /*#__PURE__*/React__default.createElement(EmployeeApp, commonProps)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, {
    path: "/digit-ui/citizen"
  }, /*#__PURE__*/React__default.createElement(Home$1, commonProps)), /*#__PURE__*/React__default.createElement(reactRouterDom.Route, null, /*#__PURE__*/React__default.createElement(reactRouterDom.Redirect, {
    to: "/digit-ui/citizen"
  })));
};

var commonReducer = function commonReducer(defaultData) {
  return function (state, action) {
    if (state === void 0) {
      state = defaultData;
    }

    switch (action.type) {
      case "LANGUAGE_SELECT":
        return _extends({}, state, {
          selectedLanguage: action.payload
        });

      default:
        return state;
    }
  };
};

var getRootReducer = function getRootReducer(defaultStore, moduleReducers) {
  return redux.combineReducers(_extends({
    common: commonReducer(defaultStore)
  }, moduleReducers));
};

var middleware = [thunk];
var composeEnhancers = typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : redux.compose;
var enhancer = composeEnhancers(redux.applyMiddleware.apply(void 0, middleware));

var getStore = function getStore(defaultStore, moduleReducers) {
  if (moduleReducers === void 0) {
    moduleReducers = {};
  }

  return redux.createStore(getRootReducer(defaultStore, moduleReducers), enhancer);
};

var DigitUIWrapper = function DigitUIWrapper(_ref) {
  var _initData$stateInfo;

  var stateCode = _ref.stateCode,
      enabledModules = _ref.enabledModules,
      moduleReducers = _ref.moduleReducers;

  var _Digit$Hooks$useInitS = Digit.Hooks.useInitStore(stateCode, enabledModules),
      isLoading = _Digit$Hooks$useInitS.isLoading,
      initData = _Digit$Hooks$useInitS.data;

  if (isLoading) {
    return /*#__PURE__*/React__default.createElement(digitUiReactComponents.Loader, {
      page: true
    });
  }

  var i18n = reactI18next.getI18n();
  return /*#__PURE__*/React__default.createElement(reactRedux.Provider, {
    store: getStore(initData, moduleReducers(initData))
  }, /*#__PURE__*/React__default.createElement(reactRouterDom.BrowserRouter, null, /*#__PURE__*/React__default.createElement(digitUiReactComponents.Body, null, /*#__PURE__*/React__default.createElement(DigitApp, {
    initData: initData,
    stateCode: stateCode,
    modules: initData === null || initData === void 0 ? void 0 : initData.modules,
    appTenants: initData.tenants,
    logoUrl: initData === null || initData === void 0 ? void 0 : (_initData$stateInfo = initData.stateInfo) === null || _initData$stateInfo === void 0 ? void 0 : _initData$stateInfo.logoUrl
  }))));
};

var DigitUI = function DigitUI(_ref2) {
  var stateCode = _ref2.stateCode,
      registry = _ref2.registry,
      enabledModules = _ref2.enabledModules,
      moduleReducers = _ref2.moduleReducers;
  var userType = Digit.UserService.getType();
  var queryClient = new reactQuery.QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 15 * 60 * 1000,
        cacheTime: 30 * 60 * 1000
      }
    }
  });
  var ComponentProvider = Digit.Contexts.ComponentProvider;
  var DSO = Digit.UserService.hasAccess(["FSM_DSO"]);
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(reactQuery.QueryClientProvider, {
    client: queryClient
  }, /*#__PURE__*/React__default.createElement(ComponentProvider.Provider, {
    value: registry
  }, /*#__PURE__*/React__default.createElement(DigitUIWrapper, {
    stateCode: stateCode,
    enabledModules: enabledModules,
    moduleReducers: moduleReducers
  }))));
};

exports.DigitUI = DigitUI;
//# sourceMappingURL=index.js.map
