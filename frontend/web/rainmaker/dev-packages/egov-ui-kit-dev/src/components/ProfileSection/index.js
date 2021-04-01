import React from "react";
import PropTypes from "prop-types";
import { getTenantId, setTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getTransformedLocale, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import Image from "../Image";
import DropDown from "../DropDown";
import Label from "../Label";
import Icon from "../Icon";
import { connect } from "react-redux";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import LogoutDialog from "../../common/common/Header/components/LogoutDialog";
import "./index.css";

const style = {
  label: {
    color: "#5F5C57",
    fontSize: "14px",
    paddingRight: "0px",
    lineHeight: "20px",
  },

  listStyle: {
    display: "block",
  },
  listInnerDivStyle: {
    padding: "10px",
    display: "flex",
    alignItems: "center",
  },
  baseTenantStyle: {
    marginRight: "30px",
    width: "120px",
    marginBottom: "24px",
  },
};
class ProfileSection extends React.Component {
  state = {
    tenantSelected: getTenantId(),
    tempTenantSelected: getTenantId(),
    open: false,
  };

  handleTenantChange = () => {
    let tenantSelected = this.state.tempTenantSelected;
    this.setState({ ...this.state, tenantSelected: tenantSelected });
    setTenantId(tenantSelected);
    this.props.setRoute("/");
  };

  onTenantChange = (event, index, value) => {
    if (location.pathname.includes("/inbox")) {
      this.setState({ ...this.state, tenantSelected: value });
      setTenantId(value);
      this.props.setRoute("/");
    } else {
      this.setState({ ...this.state, open: true, tempTenantSelected: value });
    }
  };

  handleClose = () => {
    this.setState({ ...this.state, open: false });
  };

  render() {
    const {
      imgStyle,
      cardStyles,
      nameStyle,
      locationStyle,
      emailIdStyle,
      name,
      location,
      addIconName,
      imgSrc,
      addIconStyle,
      onClickAddPic,
      emailId,
      className,
    } = this.props;
    const { tenantSelected, open } = this.state;
    const userInfo = getUserInfo();
    const roles = JSON.parse(getUserInfo()).roles;
    let tenantIdsList =
      roles &&
      roles.map((role) => {
        return role.tenantId;
      });
    tenantIdsList = [...new Set(tenantIdsList)];
    tenantIdsList = tenantIdsList.map((tenantId) => {
      return { value: tenantId, label: getLocaleLabels(tenantId, "TENANT_TENANTS_" + getTransformedLocale(tenantId)) };
    });
    return (
      <div className="profileSection" style={cardStyles}>
        <div className="profileContainer" style={{ textAlign: "center" }}>
          <Image id="profile-photo" className="img-Profile" circular={true} style={imgStyle} source={imgSrc} />
          {addIconName && (
            <div style={addIconStyle}>
              <Icon id="profile-upload-icon" action="image" name={addIconName} onClick={onClickAddPic} color={"#ffffff"} />
            </div>
          )}
          {name && (
            <Label
              id="profile-name"
              className="name-Profile"
              label={name}
              style={nameStyle}
              labelStyle={{ letterSpacing: 0.6 }}
              dark={true}
              bold={true}
            />
          )}
          {process.env.REACT_APP_NAME === "Employee" && (
            <DropDown
              className="tenant-dropdown"
              onChange={this.onTenantChange}
              listStyle={style.listStyle}
              style={style.baseTenantStyle}
              labelStyle={style.label}
              dropDownData={tenantIdsList}
              value={tenantSelected}
              iconStyle={{ right: "-15px", top: "-7px",fill: "#484848" }}
              underlineStyle={{ borderBottom: "none" }}
            />
          )}
          {process.env.REACT_APP_NAME === "Citizen" && location && <Label id="profile-location" className="loc-Profile" labelPosition="after" label={location} style={locationStyle} />}
          {emailId && <Label id="profile-emailid" className="loc-Profile" label={emailId} style={emailIdStyle} />}
          <LogoutDialog
            logoutPopupOpen={open}
            closeLogoutDialog={this.handleClose}
            logout={this.handleTenantChange}
            oktext={"CORE_CHANGE_TENANT_OK"}
            canceltext={"CORE_CHANGE_TENANT_CANCEL"}
            title={"CORE_CHANGE_TENANT"}
            body={"CORE_CHANGE_TENANT_DESCRIPTION"}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setRoute: (route) => dispatch(setRoute(route)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ProfileSection);

ProfileSection.propTypes = {
  style: PropTypes.object,
  cardStyles: PropTypes.object,
  nameStyle: PropTypes.object,
  locationStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  onClickAddPic: PropTypes.func,
};
