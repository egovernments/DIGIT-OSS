import React from "react";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import "./index.css";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import digitLogo from "egov-ui-kit/assets/images/Digit_logo.png";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";

const getUlbGradeLabel = (ulbGrade) => {
  if (ulbGrade) {
    let ulbWiseHeaderName = ulbGrade.toUpperCase();
    if (ulbWiseHeaderName.indexOf(" ") > 0) {
      ulbWiseHeaderName = ulbWiseHeaderName.split(" ").join("_");
    }
    return "ULBGRADE" + "_" + ulbWiseHeaderName;
  }
};

const withoutAuthorization = (redirectionUrl) => (Component) => {
  class Wrapper extends React.Component {
    componentDidMount() {
      if (this.props.authenticated) {
        this.props.history.push(redirectionUrl);
      }
    }
    render() {
      const { isOpenLink, ulbLogo, defaultTitle, ulbName } = this.props;

      return (
        <div>
          {/* FIXME need to move appbar as new component */}
          {isOpenLink ? (
            <div className="rainmaker-header-cont" style={{ position: "relative" }}>
              <div>
                <AppBar className="rainmaker-header">
                  <div className="citizen-header-logo-label">
                    <div className="citizen-header-logo">
                      <img src={ulbLogo ? ulbLogo : pbLogo} onError={(event) => event.target.setAttribute("src", pbLogo)} />
                    </div>
                    <div className="rainmaker-displayInline">
                      <Label
                        containerStyle={{ marginLeft: "10px" }}
                        className="screenHeaderLabelStyle appbar-municipal-label"
                        label={ulbName && `TENANT_TENANTS_${ulbName.toUpperCase().replace(/[.]/g, "_")}`}
                      />
                      <Label containerStyle={{ marginLeft: "4px" }} className="screenHeaderLabelStyle appbar-municipal-label" label={defaultTitle} />
                    </div>
                    <div style={{ position: "absolute", right: "12px", top: "12px" }}>
                      <img src={digitLogo} />
                    </div>
                  </div>
                </AppBar>
              </div>
              <div>
                <Component {...this.props} />
              </div>
            </div>
          ) : (
            <Component {...this.props} />
          )}
          )
        </div>
      );
    }
  }
  const mapStateToProps = (state) => {
    const { authenticated } = state.auth;
    let { stateInfoById } = state.common || [];
    let hasLocalisation = false;
    let defaultUrl = process.env.REACT_APP_NAME === "Citizen" ? "/user/register" : "/user/login";
    let isOpenLink = window.location.pathname.includes("openlink");
    const cities = state.common.cities || [];
    const tenantId = getTenantId() || process.env.REACT_APP_DEFAULT_TENANT_ID;
    const userTenant = cities && cities.filter((item) => item.code === tenantId);
    const ulbGrade = userTenant && get(userTenant[0], "city.ulbGrade");
    const ulbName = userTenant && get(userTenant[0], "code");
    const defaultTitle = ulbGrade && getUlbGradeLabel(ulbGrade);
    const ulbLogo = userTenant.length > 0 ? get(userTenant[0], "logoId") : "https://s3.ap-south-1.amazonaws.com/pb-egov-assets/pb.amritsar/logo.png";
    if (stateInfoById && stateInfoById.length > 0) {
      hasLocalisation = stateInfoById[0].hasLocalisation;
      defaultUrl = stateInfoById[0].defaultUrl;
    }
    return { authenticated, hasLocalisation, defaultUrl, isOpenLink, ulbLogo, ulbName, defaultTitle };
  };
  return connect(mapStateToProps)(Wrapper);
};

export default withoutAuthorization;
