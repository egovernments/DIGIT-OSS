import { Icon } from "egov-ui-kit/components";
import { httpRequest } from "egov-ui-kit/utils/api";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import Label from "egov-ui-kit/utils/translationNode";
import React from "react";
import "./index.css";
import UpdateMobileDialog from "./updateMobileDialog";
import WarningPopup from "./warningPopup";

const editIconStyle = {
  fill: "#767676",
  width: 19,
  height: 20,
  marginRight: 8,
  fill: "#fe7a51",
};

export const getRequestInfo = (auth = null) => ({
  RequestInfo: {
    apiId: "Rainmaker",
    ver: ".01",
    ts: "",
    action: "_create",
    did: "1",
    key: "",
    msgId: `20170310130900|${localStorage.getItem("locale")}`,
    authToken: auth,
  },
});

const VerifyButton = (type, openDialog) => {
  switch (type) {
    case "UPDATE":
      return (
        <span>
          <button className="button-verify" style={{ float: "none", display: "flex", height: "20px" }} onClick={() => openDialog()}>
            {" "}
            <Icon style={editIconStyle} action="image" name="edit" /> <Label label="PT_EDIT"></Label>
          </button>
        </span>
      );
    case "VERIFIED":
      return (
        <span>
          <button className="button-verify" style={{ float: "none" }} onClick={() => openDialog()}>
            {" "}
            LINK
          </button>
        </span>
      );
    default:
      return <span></span>;
  }
};
export default class UpdateMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      propertyId: "",
      tenantId: "",
      property: {},
      skipped: false,
      loading: false,
      loaded: false,
      invalidNumber: false,
      propertyNumbers: {},
    };
  }

  componentDidMount = async () => {
    this.loadProperty();
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    const { propertyId = "", tenantId = "", isAlternate } = this.props;
    const { propertyId: prevPropertyId = "", tenantId: prevTenantId = "" } = prevProps;

    /* if (propertyId != prevPropertyId || tenantId != prevTenantId) { */
    !this.state.loading && !this.state.loaded && this.loadProperty();
    // }

    if (this.props.type == "WARNING" && this.props.showWarning == true && prevProps.showWarning == false) {
      let { owners = [] } = this.state.property;
      let propertyNumbers = {};
      owners = owners && owners.filter((owner) => owner.status == "ACTIVE");

      if (this.props.number === "NA") {
        owners
          .filter((owner) => owner.alternatemobilenumber == null)
          .map((owner, index) => {
            if (index == 0) {
              propertyNumbers = {
                id: owner.id,
                uuid: owner.uuid,
                name: owner.name,
                mobileNumber: "NA",
                type: "owner",
              };
            }
          });
      }

      owners &&
        owners.map((owner) => {
          let numb = isAlternate ? owner.alternatemobilenumber : owner.mobileNumber;
          if (numb == this.props.number) {
            propertyNumbers = {
              id: owner.id,
              uuid: owner.uuid,
              name: owner.name,
              mobileNumber: numb,
              type: "owner",
            };
          }
        });

      this.setState({
        invalidNumber: true,
        propertyNumbers: propertyNumbers,
        loading: false,
        loaded: true,
      });
    }
  };

  getProperty = async (queryParams, propertyId) => {
    if (window && window.propertyResponse && window.propertyResponse[propertyId]) {
      return window.propertyResponse[propertyId];
    } else {
      let property = await httpRequest(`property-services/property/_search`, "search", queryParams, {});
      window.propertyResponse = window.propertyResponse || {};
      window.propertyResponse[propertyId] = property;
      return window.propertyResponse[propertyId];
    }
  };
  componentWillUnmount = () => {
    this.setState({
      loading: false,
      loaded: false,
    });
    window.propertyResponse = {};
  };

  loadProperty = async () => {
    this.setState({ loading: true });
    const { propertyId = "", tenantId = "", number, updateNumberConfig, isAlternate } = this.props;
    let queryParams = [
      { key: "propertyIds", value: propertyId },
      { key: "tenantId", value: tenantId },
    ];
    if (propertyId !== "" && tenantId !== "") {
      const propertyResponse = await this.getProperty(queryParams, propertyId);
      this.setState({ property: propertyResponse.Properties[0] });
      let { owners = [] } = propertyResponse.Properties[0];
      let propertyNumbers = {};
      owners = owners && owners.filter((owner) => owner.status == "ACTIVE");
      owners &&
        owners.map((owner) => {
          let numb = isAlternate ? owner.alternatemobilenumber : owner.mobileNumber;

          if (this.props.number === "NA") {
            owners
              .filter((owner) => owner.alternatemobilenumber == null)
              .map((owner, index) => {
                if (index == 0) {
                  propertyNumbers = {
                    id: owner.id,
                    uuid: owner.uuid,
                    name: owner.name,
                    mobileNumber: "NA",
                    type: "owner",
                  };
                }
              });
          }

          if (process.env.REACT_APP_NAME !== "Citizen") {
            if (number == updateNumberConfig.invalidNumber || !number.match(updateNumberConfig["invalidPattern"])) {
              /* !this.state.skipped&&this.setState({ invalidNumber: true }); */
            }
          }
          if (numb == number) {
            if (
              number == updateNumberConfig.invalidNumber ||
              (!number.match(updateNumberConfig["invalidPattern"]) && number == JSON.parse(getUserInfo()).mobileNumber)
            ) {
              /* !this.state.skipped&&this.setState({ invalidNumber: true }); */
            }
            propertyNumbers = {
              id: owner.id,
              uuid: owner.uuid,
              name: owner.name,
              mobileNumber: numb,
              type: "owner",
            };
          }
        });
      this.setState({
        propertyNumbers: propertyNumbers,
        loading: false,
        loaded: true,
      });
    }
  };

  toggleDialog = () => {
    this.setState({ open: !this.state.open });
  };

  canShowEditOption = () => {
    // const {isAlternate}=this.props;
    if (window.location.href.includes("/property-tax/property") || window.location.href.includes("/property-tax/my-properties/property")) {
      if (process.env.REACT_APP_NAME === "Citizen") {
        let userInfo = JSON.parse(getUserInfo()) || {};
        if (userInfo.mobileNumber && userInfo.mobileNumber == this.props.number) {
          return true;
        } else if (
          userInfo.mobileNumber &&
          this.props.number === "NA" &&
          this.state.property &&
          this.state.property.owners &&
          this.state.property.owners.findIndex((owner) => owner.status == "ACTIVE" && owner.mobileNumber == userInfo.mobileNumber) !== -1
        ) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  render() {
    const { propertyId = "", tenantId = "", closeDue, isAlternate = false } = this.props;
    const { property = {}, propertyNumbers = {} } = this.state;
    return (
      property &&
      property.status == "ACTIVE" && (
        <div>
          {this.canShowEditOption() && VerifyButton(this.props.type, this.toggleDialog)}
          {this.state.open && (
            <UpdateMobileDialog
              open={this.state.open}
              isAlternate={isAlternate}
              documents={this.props.updateNumberConfig.documents}
              loadProperty={this.loadProperty}
              property={property}
              propertyNumbers={propertyNumbers}
              closeDialog={() => {
                this.toggleDialog();
                closeDue && closeDue();
              }}
            ></UpdateMobileDialog>
          )}
          {this.state.invalidNumber && this.canShowEditOption() && (
            <WarningPopup
              propertyId={propertyId}
              tenantId={tenantId}
              closeDue={closeDue}
              open={this.state.invalidNumber ? true : false}
              closeDialog={() => {
                this.setState({ invalidNumber: false, skipped: true });
                closeDue && closeDue();
              }}
              updateNum={() => {
                this.setState({ invalidNumber: false });
                this.toggleDialog();
              }}
            ></WarningPopup>
          )}
        </div>
      )
    );
  }
}
