import Label from "egov-ui-kit/components/Label";
import { httpRequest } from "egov-ui-kit/utils/api";
import React from "react";
import ViewMobileDialog from ".";
import { VerifyIcon } from "./ListItems";



const VerifyButton = (type,openDialog) => {
    switch (type) {
        case "VERIFY":
            return <span><VerifyIcon /><span onClick={() => openDialog()}>VERIFY</span></span>;
        case "LINKNUM":
            return <div style={{    display: "flex",
                flexDirection: "row",
                height: "60px",
                alignItems: "center",
                background: "#FE7A511F",color: "#FE7A51"}}>
                <Label label="Link and Verify citizen’s mobile no. to send notifications and updates on this property" fontSize="16px"  labelStyle={{color: "#FE7A51" ,fontWeight : '400'}} />
                <button type="button" style={{ width: "130px", height: "42px", background: "#FE7A51", color: "white", borderRadius: "2px" ,marginLeft:"10px"}} onClick={() => openDialog()} >LINK MOBILE NO.</button>
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
    loadProperty = async () => {
        const {propertyId="",tenantId=""}=this.props;
        let queryParams = [{ key: "propertyIds", value:propertyId },
        { key: "tenantId", value: tenantId}]
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
    toggleDialog = () => {
        this.setState({ open: !this.state.open });
    }

    render() {
        return (<div>
            {VerifyButton(this.props.type,this.toggleDialog)}
            {this.state.open && <ViewMobileDialog open={this.state.open} loadProperty={this.loadProperty} property={this.state.property} propertyNumbers={this.state.propertyNumbers} closeDialog={() => this.toggleDialog()}></ViewMobileDialog>}
        </div>)

    }
}
