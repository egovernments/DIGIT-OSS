import commonConfig from "config/common.js";
import { Icon } from "egov-ui-kit/components";
import { httpRequest } from "egov-ui-kit/utils/api";
import Label from "egov-ui-kit/utils/translationNode";
import { get } from "lodash";
import React from "react";
import AlternateMobileDialog from "./alternateMobileDialog";
import './index.css';


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
            return <span><button className="button-verify" style={{ "float": "none", "display": "flex", "height": "20px" }} onClick={() => openDialog()}> <Icon style={editIconStyle} action="image" name="edit" /> <Label label="PT_EDIT"></Label></button>
            </span>;
        case "VERIFIED":
            return <span><button className="button-verify" style={{ "float": "none" }} onClick={() => openDialog()}>  LINK</button>
            </span>;
        case "LINKNUM":
            return <div className="text-alter-link">
                <Label label="PT_SEC_LINK_NO_TEXT" fontSize="16px" labelStyle={{ color: "#FE7A51", fontWeight: '400' }} />
                <button type="button" className={"button-alter-link"} onClick={() => openDialog()} ><Label label="PT_SEC_LINK_NO_BTN"></Label></button>
            </div>;
        default:
            return <span></span>;
    }
}
export default class AlternateMobile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            propertyId: "",
            tenantId: "",
            showWarning: false,
            documents: [],
            property: {},
            propertyNumbers: {}
        }
    }

    componentDidMount = async () => {
        this.loadProperty();
        let resp = await this.getMDMS();
        this.setState({ documents: get(resp, "MdmsRes.PropertyTax.UpdateNumber[0].documents", []) });
    }

    getMDMS = async () => {
        if (window && window.mdmsResponse && window.mdmsResponse['doc']) {
            return window.mdmsResponse['doc'];
        } else {
            let mdmsResp = await httpRequest(`egov-mdms-service/v1/_search`, "search", [], {
                "MdmsCriteria": {
                    "tenantId": commonConfig.tenantId,
                    "moduleDetails": [
                        {
                            "moduleName": "PropertyTax",
                            "masterDetails": [
                                {
                                    "name": "UpdateNumber"
                                }
                            ]
                        }
                    ]
                }
            });
            window.mdmsResponse = window.mdmsResponse || {};
            window.mdmsResponse['doc'] = mdmsResp;
            return window.mdmsResponse['doc'];
        }
    }

    getProperty = async (queryParams, propertyId,cache=false) => {
        if (window && window.propertyResponse && window.propertyResponse[propertyId] && !cache) {
            return window.propertyResponse[propertyId];
        } else {
            let customRequestInfo ={};
if(window.location.pathname.includes('withoutAuth')){
    customRequestInfo={
        apiId: "Rainmaker",
        ver: ".01",
        ts: "",
        action: "_search",
        did: "1",
        key: "",
        authToken:cache?cache:null
      };
      if(!cache){
        queryParams.push({ key: "locality", value: localStorage.getItem("pt-searched-locality") });
      }
    
}
    
            let property = await httpRequest(`property-services/property/_search`, "search", queryParams, {},[],customRequestInfo);
            window.propertyResponse = window.propertyResponse || {};
            window.propertyResponse[propertyId] = property;
            return window.propertyResponse[propertyId];
        }
    }

    componentWillUnmount = () => {
        window.propertyResponse = {};
    }

    setProperty =async (auth=false)=>{

        const { propertyId = "", tenantId = "" } = this.props;
        let queryParams = [{ key: "propertyIds", value: propertyId },
        { key: "tenantId", value: tenantId }]
        const propertyResponse = await this.getProperty(queryParams, propertyId,auth);
        this.setState({ property: propertyResponse.Properties[0] });
    }

    loadProperty = async () => {
        const { propertyId = "", tenantId = "" } = this.props;
        let queryParams = [{ key: "propertyIds", value: propertyId },
        { key: "tenantId", value: tenantId }]
        let propertyNumbers = {};
        if (propertyId !== "" && tenantId !== "") {
            const propertyResponse = await this.getProperty(queryParams, propertyId);
            this.setState({ property: propertyResponse.Properties[0] });
            let { owners = [] } = propertyResponse.Properties[0];
            let newOwner = owners.find(owner => owner.status == "ACTIVE") || {};
            propertyNumbers = {
                "id": newOwner.id,
                "uuid": newOwner.uuid,
                "name": newOwner.name,
                "mobileNumber": window.location.pathname.includes('withoutAuth')?localStorage.getItem('pay-bill-mobile'): newOwner.mobileNumber,
                "type": "owner"
            };
            /* this.setState({ propertyNumbers: propertyNumbers, showWarning: true }); */
            this.setState({ propertyNumbers: propertyNumbers, showWarning: !owners.some(owner => owner.alternatemobilenumber && owner.status == "ACTIVE") });
        }
    }

    toggleDialog = () => {
        this.setState({ open: !this.state.open });
    }

    render() {
        const { property = {}, showWarning, propertyNumbers, open, documents } = this.state;
        const isWithoutAuth = window.location.href.includes('withoutAuth');
        return property && property.status == "ACTIVE" && isWithoutAuth && <div>
            {showWarning && VerifyButton(this.props.type, this.toggleDialog)}
            {open && <AlternateMobileDialog
                open={open}
                documents={documents}
                setProperty={this.setProperty}
                propertyNumbers={propertyNumbers}
                property={property}
                closeDialog={() => { this.toggleDialog(); }}
            ></AlternateMobileDialog>}
        </div>
    }
}
