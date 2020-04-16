import React from "react";
import { connect } from "react-redux";
// import AppBar from "@material-ui/core/AppBar";
import "./index.css";
import {
  getLocale,
  getTenantId,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import digitLogo from "egov-ui-kit/assets/images/Digit_logo.png";
import get from "lodash/get";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import Header from "egov-ui-kit/common/common/Header";

const getUlbGradeLabel = ulbGrade => {
  if (ulbGrade) {
    let ulbWiseHeaderName = ulbGrade.toUpperCase();
    if (ulbWiseHeaderName.indexOf(" ") > 0) {
      ulbWiseHeaderName = ulbWiseHeaderName.split(" ").join("_");
    }
    return "ULBGRADE" + "_" + ulbWiseHeaderName;
  }
};

class HeaderContainer extends React.Component {
  state = {
    languageSelected: getLocale(),
    toggleMenu: false
  };
  style = {
    headerStyle: {
      marginLeft: "-16px",
      paddingTop: "1px"
    }
  };

  onLanguageChange = (event, index, value) => {
    //const {setRote} = this.props;
    this.setState({ languageSelected: value });
    let tenantId = getTenantId();

    // if (process.env.REACT_APP_NAME === "Citizen") {
    //   const tenantInfo = getQueryArg(window.location.href, "tenantId");
    //   const userInfo = JSON.parse(getUserInfo());
    //   tenantId = userInfo && userInfo.permanentCity;
    //   tenantId = tenantInfo ? tenantInfo : tenantId;
    // }
    this.props.fetchLocalizationLabel(value, tenantId, tenantId);
  };

  render() {
    const {
      msevaLogo,
      defaultTitle,
      ulbName,
      hasLocalisation,
      languages,
      fetchLocalizationLabel,
      ...rest
    } = this.props;
    const options = { isHomeScreen: true, hideBackButton: true };
    const { style } = this;
    return (
      <Header
        hasLocalisation={true}
        className={"rainmaker-header"}
        options={options}
        role={"employee"}
        isUserSetting={false}
        headerStyle={style.headerStyle}
        msevaLogo={msevaLogo}
        defaultTitle={defaultTitle}
        {...rest}
      />
    );
  }
}

export default HeaderContainer;
