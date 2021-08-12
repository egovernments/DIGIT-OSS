import { httpRequest } from "egov-ui-kit/utils/api";
import Label from "egov-ui-kit/utils/translationNode";
import React from "react";
import ViewMobileDialog from ".";
import './index.css';
import { SuccessIcon, VerifyIcon } from "./ListItems";


const VerifyButton = (type, openDialog) => {
    switch (type) {
        case "VERIFY":
            return <span><button className="button-verify" style={{ "float": "none" }} onClick={() => openDialog()}> <VerifyIcon /> <Label label="PT_SEC_VERIFY_BTN"></Label></button>
            </span>;
        case "VERIFIED":
            return <span><button className="button-verify" style={{ "float": "none" }} onClick={() => openDialog()}> <SuccessIcon /> LINK</button>
            </span>;
        case "LINKNUM":
            return <div className="text-verify-link">
                <Label label="PT_SEC_LINK_NO_TEXT" fontSize="16px" labelStyle={{ color: "#FE7A51", fontWeight: '400' }} />
                <button type="button" className={"button-verify-link"} onClick={() => openDialog()} ><Label label="PT_SEC_LINK_NO_BTN"></Label></button>
            </div>;
        case "VERIFIED":
            return <button onClick={() => openDialog()}>Verify Mobile</button>;
        case "SIMPLEBUTTON":
            return <button onClick={() => openDialog()}>Verify Mobile</button>;
        default:
            return <button onClick={() => openDialog()}>Verify Mobile</button>;
    }
}

export default class VerifyMobile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            propertyId: "",
            tenantId: "",
            property: {},
            propertyNumbers: []
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
        const { propertyId = "", tenantId = "" } = this.props;
        let queryParams = [{ key: "propertyIds", value: propertyId },
        { key: "tenantId", value: tenantId }]
        if (propertyId !== "" && tenantId !== "") {

            const propertyResponse = await httpRequest(`property-services/property/_search`, "search", queryParams, {});
            this.setState({ property: propertyResponse.Properties[0] });
            const { owners = [], alternateMobileNumberDetails = [] } = propertyResponse.Properties[0];
            let propertyNumbers = [];
            owners && owners.map(owner => {
                propertyNumbers.push({
                    "id": owner.id,
                    "uuid": owner.uuid,
                    "name": owner.name,
                    "mobileNumber": owner.mobileNumber,
                    "type": "owner"
                })
            })
            alternateMobileNumberDetails && alternateMobileNumberDetails.map(alter => {
                propertyNumbers.push({
                    ...alter,
                    "type": "alter"
                })
            })
            this.setState({ propertyNumbers: propertyNumbers })

        }
    }
    toggleDialog = () => {
        this.setState({ open: !this.state.open });
    }

    render() {

        const { property = {}, propertyNumbers = [] } = this.state;
        return property && property.status == "ACTIVE" && <div>
            {VerifyButton(this.props.type, this.toggleDialog)}
            {this.state.open && <ViewMobileDialog open={this.state.open}
                loadProperty={this.loadProperty}
                property={property}
                propertyNumbers={propertyNumbers}
                closeDialog={() => this.toggleDialog()}></ViewMobileDialog>}
        </div>

    }
}
