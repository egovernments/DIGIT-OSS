import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { fetchData } from "./citizenSearchResource/citizenFunctions";
import "../utils/index.css";
import PayWnsBillIcon from "../../../../ui-atoms-local/Icons/PayWnsBillIcon/index";
import MyConnectionsIcon from "../../../../ui-atoms-local/Icons/MyConnectionsIcon/index";

const header = getCommonHeader({
    labelKey: "WS_COMMON_HEADER"
}, {
    classes: {
        root: "common-header-cont"
    }
});

const cardItems = [{
    label: {
        labelKey: "WS_COMMON_PAY_WS_BILL_HEADER",
    },
    icon: < PayWnsBillIcon />,
    route: "search"
},
{
    label: {
        labelKey: "WS_MYCONNECTIONS_HEADER",
    },
    icon: < MyConnectionsIcon />,
    route: "my-connections"
}
];

const waterAndSewerageSearchAndResult = {
    uiFramework: "material-ui",
    name: "home",
    moduleName: "egov-wns",
    beforeInitScreen: (action, state, dispatch) => {
        fetchData(action, state, dispatch);
        return action;
    },
    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            moduleName: "egov-wns",
            props: {
                // className: "common-div-css"
            },
            children: {
                header: header,
                applyCard: {
                    uiFramework: "custom-molecules",
                    componentPath: "LandingPage",
                    moduleName: "egov-wns",
                    props: {
                        items: cardItems,
                        history: {}
                    }
                },
                listCard: {
                    uiFramework: "custom-molecules-local",
                    moduleName: "egov-wns",
                    componentPath: "NewConnection",
                    props: {
                        route:"/citizen/wns/apply"
                    }
                },
                listCard1: {
                    uiFramework: "custom-molecules-local",
                    moduleName: "egov-wns",
                    componentPath: "MyApplications",
                    props:{}
                },
                listCard2: {
                    uiFramework: "custom-molecules-local",
                    moduleName: "egov-wns",
                    componentPath: "PastPayments",
                    props: {
                        route: "my-connections"
                    }
                },
                listCard3: {
                    uiFramework: "custom-molecules-local",
                    moduleName: "egov-wns",
                    componentPath: "HowItWorks",
                }
            }
        },  
    }
};

export default waterAndSewerageSearchAndResult;