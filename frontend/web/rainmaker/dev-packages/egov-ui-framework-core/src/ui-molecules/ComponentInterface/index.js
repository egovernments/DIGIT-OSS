import React from "react";
import { connect } from "react-redux";
import LinearProgress from "../../ui-atoms/LinearSpinner";
import Loadable from "react-loadable";
import Item from "../../ui-atoms/Layout/Item";
import remoteComponents from "ui-config/commonConfig/remote-component-paths";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { getModuleName } from "./moduleConfig";

class ComponentInterface extends React.Component {
  constructor(props) {
    super(props);
    this.state = { module: null,error: null, errorInfo: null };
  }
  componentDidMount() {
    const { componentPath, uiFramework, moduleName } = this.props;
    let LoadableComponent = null;
    const selfRunning =
      process.env.REACT_APP_SELF_RUNNING === "true" ? true : false;
    switch (uiFramework) {
      // case "carbon":
      //   LoadableComponent = Loadable({
      //     loader: () =>
      //       import("carbon-components-react").then(
      //         module => module[componentPath]
      //       ),
      //     loading: () => <LinearProgress />
      //   });
      //   break;
      case "custom-atoms":
        LoadableComponent = Loadable({
          loader: () =>
            import("../../ui-atoms").then(module => module[componentPath]),
          loading: () => <LinearProgress />
        });
        break;
      case "custom-molecules":
        LoadableComponent = Loadable({
          loader: () =>
            import("../../ui-molecules").then(module => module[componentPath]),
          loading: () => <LinearProgress />
        });
        break;
      case "custom-containers":
        LoadableComponent = Loadable({
          loader: () =>
            import("../../ui-containers").then(module => module[componentPath]),
          loading: () => <LinearProgress />
        });
        break;
      case "custom-atoms-local":
        LoadableComponent = Loadable({
          loader: () =>
            !selfRunning
              ? remoteComponents(moduleName, "ui-atoms-local").then(
                  module => module[componentPath]
                )
              : import("ui-atoms-local").then(module => module[componentPath]),
          loading: () => <LinearProgress />
        });
        break;
      case "custom-molecules-local":
        LoadableComponent = Loadable({
          loader: () =>
            !selfRunning
              ? remoteComponents(moduleName, "ui-molecules-local").then(
                  module => module[componentPath]
                )
              : import("ui-molecules-local").then(
                  module => module[componentPath]
                ),
          loading: () => <LinearProgress />
        });
        break;

      case "custom-containers-local":
        LoadableComponent = Loadable({
          loader: () =>
            !selfRunning
              ? remoteComponents(moduleName, "ui-containers-local").then(
                  module => module[componentPath]
                )
              : import("ui-containers-local").then(
                  module => module[componentPath]
                ),
          loading: () => <LinearProgress />
        });
        break;
      case "material-ui":
        LoadableComponent = Loadable({
          loader: () =>
            import("@material-ui/core").then(module => module[componentPath]),
          loading: () => <LinearProgress />
        });
        break;
    }
    this.setState({ module: LoadableComponent });
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }

  render() {
    const { module: Component } = this.state; // Assigning to new variable names @see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    let {
      id,
      uiFramework,
      props,
      children,
      gridDefination,
      visible = true,
      roleDefination = {},
      applicationStatus,
      menu,
      bpaTradeType
    } = this.props;

    if (this.state.errorInfo) {
      // Error path
      console.error("Egov-ui-framework-error",this.state.error && this.state.error.toString());
      console.error("Egov-ui-framework-errorInfo",this.state.errorInfo.componentStack);
      console.error("Egov-ui-framework-component-details",this.props);


       return null;
    }
    
    if (visible && !isEmpty(roleDefination)) {
      const splitList = get(roleDefination, "rolePath").split(".");
      const localdata = JSON.parse(localStorageGet(splitList[0]));
      const localRoles = get(
        localdata,
        splitList.slice(1).join("."),
        localdata
      );
      const roleCodes =
        localRoles &&
        localRoles.map(elem => {
          return get(elem, "code");
        });
      if (get(roleDefination, "roles")) {
        const roles = get(roleDefination, "roles");
        let found = roles.some(elem => roleCodes.includes(elem));
        visible = found;
      } else if (get(roleDefination, "path")) {
        let isApplicable =
          menu &&
          menu.find(item => {
            return item.navigationURL == get(roleDefination, "path");
          });
        visible = isApplicable ? isApplicable : false;
      } else if (get(roleDefination, "action")) {
        const businessServiceData = JSON.parse(
          localStorageGet("businessServiceData")
        );
        const data = find(businessServiceData, {
          businessService: getModuleName(window.location.pathname, bpaTradeType)
        });
        const filteredData =
          data &&
          data.states &&
          data.states.reduce((res, curr) => {
            if (
              curr &&
              curr.actions &&
              curr.applicationStatus === applicationStatus &&
              curr.actions.filter(item =>
                item.roles.some(elem => roleCodes.includes(elem))
              ).length > 0
            ) {
              const filteredAction = curr.actions.filter(item =>
                item.roles.some(elem => roleCodes.includes(elem))
              );

              filteredAction.forEach(item => res.push(item.action));
            }
            return res;
          }, []);
        const actions = filteredData;
        let found =
          actions && actions.length > 0
            ? actions.includes(get(roleDefination, "action"))
            : false;
        visible = found;
      }
    }

    if (gridDefination) {
      return (
        Component &&
        visible && (
          <Item {...gridDefination}>
            <Component id={`${uiFramework}-${id}`} {...props}>
              {children && children}
            </Component>
          </Item>
        )
      );
    } else {
      return (
        Component &&
        visible && (
          <Component id={`${uiFramework}-${id}`} {...props}>
            {children && children}
          </Component>
        )
      );
    }
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const menu = get(state.app, "menu", []);
  const { preparedFinalObject } = screenConfiguration;
  const moduleName = getModuleName(window.location.pathname);
  let jsonPath = "";
  if (moduleName === "FIRENOC") {
    jsonPath = "FireNOCs[0].fireNOCDetails.status";
  } else if (moduleName === "NewTL") {
    jsonPath = "Licenses[0].status";
  } else if ((moduleName === "BPA") || (moduleName === "BPA_LOW") || (moduleName === "BPA_OC")) {
    jsonPath = "BPA.status";
  } else {
    jsonPath = "Licenses[0].status";
  }
  const applicationStatus = get(preparedFinalObject, jsonPath);
  let bpaTradeType = "";
  if (window.location.pathname.includes("bpastakeholder")) {
    bpaTradeType = get(
      preparedFinalObject,
      "Licenses[0].tradeLicenseDetail.tradeUnits[0].tradeType",
      ""
    );
  }
  return { applicationStatus, menu, bpaTradeType };
};

export default connect(
  mapStateToProps,
  null
)(ComponentInterface);
