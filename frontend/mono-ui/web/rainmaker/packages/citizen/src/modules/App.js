import { LoadingIndicator, Toast } from "components";
import commonConfig from "config/common";
import redirectionLink from "egov-ui-kit/config/smsRedirectionLinks";
import { fetchCurrentLocation, fetchLocalizationLabel, setPreviousRoute, setRoute, toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { logout } from "egov-ui-kit/redux/auth/actions";
import { fetchMDMSData } from "egov-ui-kit/redux/common/actions";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import { addBodyClass, getQueryArg } from "egov-ui-kit/utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import './index.css';
import Router from "./Router";
import routes from "./Routes";
class App extends Component {
  constructor(props) {
    super(props);
    const { pathname: currentPath } = props.location;

    props.history.listen((location, action) => {
      const { pathname: nextPath } = location;
      addBodyClass(nextPath);
      props.toggleSnackbarAndSetText(false, { labelName: "", labelKey: "" }, "success");
    });
    addBodyClass(currentPath);
  }

  componentDidMount = async () => {
    const { fetchLocalizationLabel, fetchCurrentLocation, fetchMDMSData } = this.props;
    const { pathname } = window.location;
    let requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "Department",
              },
              {
                name: "Designation",
              },
              {
                name: "StateInfo",
              },
            ],
          },
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "tenants",
              },
              {
                name: "citymodule",
              },
              {
                name: "tenantInfo",
              },
            ],
          },
        ],
      },
    };
    // can be combined into one mdms call
    fetchLocalizationLabel(getLocale() || "en_IN");
    // current location
    fetchCurrentLocation();
    fetchMDMSData(requestBody);
    pathname.indexOf("/otpLogin") > -1 && this.handleSMSLinks();
  };

  handleSMSLinks = () => {
    const { authenticated, setPreviousRoute, setRoute, userInfo, logout } = this.props;
    const { href } = window.location;
    const mobileNumber = getQueryArg(href, "mobileNo");
    const citizenMobileNo = get(userInfo, "mobileNumber");

    if (authenticated) {
      if (mobileNumber === citizenMobileNo||(mobileNumber&&typeof mobileNumber=="string"&&mobileNumber.includes(citizenMobileNo))) {
        let redirectionURL = redirectionLink(href);
        if (redirectionURL && redirectionURL.includes && redirectionURL.includes('digit-ui')) {
          window.location.href = redirectionURL.startsWith('/digit') ? redirectionURL.split('&')[0] : `/${redirectionURL.split('&')[0]}`;
          return;
        } else {
          setRoute(redirectionURL);
        }
      } else {
        logout()
        setRoute("/user/otp?smsLink=true");
        // setPreviousRoute(redirectionLink(href));
      }
    } else {
      setRoute("/user/otp?smsLink=true");
      let redirectionURL = redirectionLink(href);
      setPreviousRoute(redirectionURL);
    }
    // if (!authenticated) {
    //   setRoute("/user/otp?smsLink=true");
    //   setPreviousRoute(redirectionLink(href));
    // } else {
    //   setRoute(redirectionLink(href));
    // }
  };

  componentWillReceiveProps(nextProps) {
    const { route: nextRoute, authenticated, location } = nextProps;
    const { route: currentRoute, history, setRoute } = this.props;
    if (nextRoute && currentRoute !== nextRoute) {
      history.push(nextRoute);
      setRoute("");
    }
    const isWithoutAuthSelfRedirect = location && location.pathname && location.pathname.includes("openlink");
    const isPrivacyPolicy = location && location.pathname && location.pathname.includes("privacy-policy");
    const isPublicSearch = location && location.pathname && (location.pathname.includes("/withoutAuth/pt-mutation/public-search") || location.pathname.includes("/withoutAuth/wns/public-search") || location.pathname.includes("/withoutAuth/bnd/viewCertificate"));
    const isPublicSearchPay = location && location.pathname && location.pathname.includes("/withoutAuth/egov-common/pay");
    if (nextProps.hasLocalisation !== this.props.hasLocalisation && !authenticated && !getQueryArg("", "smsLink") && !isWithoutAuthSelfRedirect && !isPrivacyPolicy && !isPublicSearch && !isPublicSearchPay) {
      nextProps.hasLocalisation && this.props.history.replace("/language-selection");
    }
  }

  render() {
    const { toast, loading, defaultUrl, hasLocalisation } = this.props;
    let loginScreens = false;
    let logginScreensUrls = ['/citizen/user/login','/citizen/user/otp', '/citizen/forgot-password', '/citizen/language-selection', '/citizen/user/register'];
    if (logginScreensUrls.includes(window.location.pathname)) {
      loginScreens = true;
    }
    let sourceUrl = `${window.location.origin}/citizen`;
     sourceUrl="https://s3.ap-south-1.amazonaws.com/egov-qa-assets";  // changes for the image configured in s3 bucket
    return (
      <div>
            <div style={{minHeight:'calc(100vh - 3em)'}}>
        <Router routes={routes} hasLocalisation={hasLocalisation} defaultUrl={defaultUrl} />
          </div>
        {toast && toast.open && !isEmpty(toast.message) && <Toast open={toast.open} message={toast.message} variant={toast.variant} />}
        {loading && <LoadingIndicator />}
        {!loginScreens && <div style={{ width: '100%', display: 'flex', flexFlow: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img style={{ display: "inline-flex", height: '1.4em' }} className={"jk-footer-image-cursor"} alt={"Powered by DIGIT"} src={`${sourceUrl}/digit-footer.png`} onError={"this.src='./../digit-footer.png'"} onClick={() => {
              window.open('https://www.digit.org/', '_blank').focus();
            }}></img>
          </div>
        </div>}
        {loginScreens && <div style={{ width: '100%', position: 'fixed', bottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img style={{ display: "inline-flex", height: '1em' }} className={"jk-footer-image-cursor"} alt={"Powered by DIGIT"} src={`${sourceUrl}/digit-footer-bw.png`} onError={"this.src='./../digit-footer-bw.png'"} onClick={() => {
              window.open('https://www.digit.org/', '_blank').focus();
            }}></img>
          </div>
        </div>}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { app, auth, common } = state;
  const { authenticated, userInfo, token } = auth || false;
  const { route, toast } = app;
  const { spinner } = common;
  const { stateInfoById } = common || [];
  let hasLocalisation = false;
  let defaultUrl = process.env.REACT_APP_NAME === "Citizen" ? "/user/register" : "/user/login";
  if (stateInfoById && stateInfoById.length > 0) {
    hasLocalisation = stateInfoById[0].hasLocalisation;
    defaultUrl = stateInfoById[0].defaultUrl;
  }
  const props = {};
  const loading = ownProps.loading || spinner;
  if (route && route.length) {
    props.route = route;
  }
  if (toast && toast.open && toast.message && !isEmpty(toast.message)) {
    props.toast = toast;
  }
  return {
    ...props,
    loading,
    hasLocalisation,
    defaultUrl,
    authenticated,
    userInfo,
    token
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocalizationLabel: (locale) => dispatch(fetchLocalizationLabel(locale)),
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
    handleFieldChange: (formKey, fieldKey, value) => dispatch(handleFieldChange(formKey, fieldKey, value)),
    fetchMDMSData: (criteria) => dispatch(fetchMDMSData(criteria)),
    fetchCurrentLocation: () => dispatch(fetchCurrentLocation()),
    setRoute: (route) => dispatch(setRoute(route)),
    setPreviousRoute: (route) => dispatch(setPreviousRoute(route)),
    logout: () => dispatch(logout())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
