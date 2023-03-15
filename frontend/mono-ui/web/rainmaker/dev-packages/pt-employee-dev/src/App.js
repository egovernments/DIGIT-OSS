import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Toast } from "components";
import { addBodyClass } from "egov-ui-kit/utils/commons";
import {
  fetchCurrentLocation,
  fetchLocalizationLabel,
  toggleSnackbarAndSetText,
  setRoute
} from "egov-ui-kit/redux/app/actions";
import { fetchMDMSData } from "egov-ui-kit/redux/common/actions";
import Router from "./Router";
import commonConfig from "config/common";
// import logoMseva from "egov-ui-kit/assets/images/logo-white.png";
import routes from "./Routes";
//import ActionMenu from "egov-ui-kit/common/common/ActionMenu";
import { LoadingIndicator } from "components";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";

class App extends Component {
  constructor(props) {
    super(props);
    const { pathname: currentPath } = props.location;

    props.history.listen((location, action) => {
      const { pathname: nextPath } = location;
      addBodyClass(nextPath);
      props.toggleSnackbarAndSetText(false, "");
    });

    addBodyClass(currentPath);
  }

  componentDidMount() {
    const {
      fetchLocalizationLabel,
      fetchCurrentLocation,
      fetchMDMSData
    } = this.props;
    let requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "Department"
              },
              {
                name: "Designation"
              }
            ]
          },
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "tenants"
              },
              {
                name: "citymodule"
              }
            ]
          }
        ]
      }
    };
    // can be combined into one mdms call
    fetchLocalizationLabel(getLocale() || "en_IN");
    // current location
    fetchCurrentLocation();
    fetchMDMSData(requestBody);
  }

  componentWillReceiveProps(nextProps) {
    const { route: nextRoute } = nextProps;
    const { route: currentRoute, history, setRoute } = this.props;
    if (nextRoute && currentRoute !== nextRoute) {
      history.push(nextRoute);
      setRoute("");
    }
  }

  render() {
    const { toast, loading } = this.props;
    return (
      <div>
        <Router routes={routes} />
        {toast && toast.open && !isEmpty(toast.message) && (
          <Toast
            open={toast.open}
            message={toast.message}
            error={toast.error}
          />
        )}
        {loading && <LoadingIndicator />}
        {/* <CommonShareContainer componentId="rainmaker-common-share" /> */}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { route, toast } = state.app;
  const props = {};
  const { spinner } = state.common;
  const loading = ownProps.loading || spinner;
  if (route && route.length) {
    props.route = route;
  }
  if (toast && toast.open && toast.message && !isEmpty(toast.message)) {
    props.toast = toast;
  }
  return {
    ...props,
    loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchLocalizationLabel: locale => dispatch(fetchLocalizationLabel(locale)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    fetchMDMSData: criteria => dispatch(fetchMDMSData(criteria)),
    fetchCurrentLocation: () => dispatch(fetchCurrentLocation()),
    setRoute: route => dispatch(setRoute(route))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
