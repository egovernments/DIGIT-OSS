import { Icon } from "egov-ui-kit/components";
import { httpRequest } from "egov-ui-kit/utils/api";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import Label from "egov-ui-kit/utils/translationNode";
import React from "react";
import './index.css';
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
    "RequestInfo": {
        "apiId": "Rainmaker",
        "ver": ".01",
        "ts": "",
        "action": "_create",
        "did": "1",
        "key": "",
        "msgId": `20170310130900|${localStorage.getItem("locale")}`,
        "authToken": auth
    }
})

const VerifyButton = (type, openDialog) => {
    switch (type) {
        case "UPDATE":
            return <span><button className="button-verify" style={{ "float": "none", display: "flex" }} onClick={() => openDialog()}> <Icon style={editIconStyle} action="image" name="edit" /> <Label label="PT_EDIT"></Label></button>
            </span>;
        case "VERIFIED":
            return <span><button className="button-verify" style={{ "float": "none" }} onClick={() => openDialog()}>  LINK</button>
            </span>;
        default:
            return <button onClick={() => openDialog()}>Verify Mobile</button>;
    }
}
export default class UpdateMobile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            propertyId: "",
            tenantId: "",
            property: {},
            invalidNumber: false,
            propertyNumbers: {}
        }
    }

    componentDidMount = async () => {
        this.loadProperty();
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        const { propertyId = "", tenantId = "" } = this.props;
        const { propertyId: prevPropertyId = "", tenantId: prevTenantId = "" } = prevProps;

        if (propertyId != prevPropertyId || tenantId != prevTenantId) {
            this.loadProperty();
        }
    }

    loadProperty = async () => {
        const { propertyId = "", tenantId = "", number, updateNumberConfig } = this.props;
        let queryParams = [{ key: "propertyIds", value: propertyId },
        { key: "tenantId", value: tenantId }]
        if (propertyId !== "" && tenantId !== "") {
            const propertyResponse = await httpRequest(`property-services/property/_search`, "search", queryParams, {});
            this.setState({ property: propertyResponse.Properties[0] });
            const { owners = [] } = propertyResponse.Properties[0];
            let propertyNumbers = {};
            owners && owners.filter(owner => owner.status == "ACTIVE");
            owners && owners.map(owner => {
                if (process.env.REACT_APP_NAME !== "Citizen") {
                    if ((number == updateNumberConfig.invalidNumber) || !number.match(updateNumberConfig['invalidPattern'])) {
                        this.setState({ invalidNumber: true });
                    }
                }
                if (owner.mobileNumber == number) {
                    if (((number == updateNumberConfig.invalidNumber) || !number.match(updateNumberConfig['invalidPattern']) && number == JSON.parse(getUserInfo()).mobileNumber)) {
                        this.setState({ invalidNumber: true });
                    }
                    propertyNumbers = {
                        "id": owner.id,
                        "uuid": owner.uuid,
                        "name": owner.name,
                        "mobileNumber": owner.mobileNumber,
                        "type": "owner"
                    };
                }
            })
            this.setState({ propertyNumbers: propertyNumbers })
        }
    }

    toggleDialog = () => {
        this.setState({ open: !this.state.open });
    }

    canShowEditOption = () => {
        if (window.location.href.includes('/property-tax/property') || window.location.href.includes('/property-tax/my-properties/property')) {
            if (process.env.REACT_APP_NAME === "Citizen") {
                let userInfo = JSON.parse(getUserInfo()) || {};
                if (userInfo.mobileNumber && userInfo.mobileNumber == this.props.number) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    render() {

        const { property = {}, propertyNumbers = {} } = this.state;
        return property && property.status == "ACTIVE" && <div>
            {this.canShowEditOption() && VerifyButton(this.props.type, this.toggleDialog)}
            {this.state.open && <UpdateMobileDialog
                open={this.state.open}
                documents={this.props.updateNumberConfig.documents}
                loadProperty={this.loadProperty}
                property={property}
                propertyNumbers={propertyNumbers}
                closeDialog={() => this.toggleDialog()}>
            </UpdateMobileDialog>}
            {this.state.invalidNumber && this.canShowEditOption() && <WarningPopup
                open={this.state.invalidNumber ? true : false}
                closeDialog={() => this.setState({ invalidNumber: false })}
                updateNum={() => { this.setState({ invalidNumber: false }); this.toggleDialog(); }}>
            </WarningPopup>}
        </div>

    }
}
