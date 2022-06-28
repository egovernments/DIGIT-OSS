import commonConfig from "config/common.js";
import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getBusinessServiceMdmsData, getModuleName } from "egov-ui-kit/utils/commons";
import { getLocale, getTenantId, setModule } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
import { searchApplications } from "./publicSearchResource/search-resources";
import { searchApplicationResult } from "./publicSearchResource/searchApplicationResult";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;
const tenant = getTenantId();

const getMDMSData = async dispatch => {
    const mdmsBody = {
        MdmsCriteria: {
            tenantId: commonConfig.tenantId,
            moduleDetails: [
                {
                    moduleName: "tenant",
                    masterDetails: [
                        {
                            name: "tenants"
                        },
                        { name: "citymodule" }
                    ]
                }
            ]
        }
    };
    try {
        const payload = await httpRequest(
            "post",
            "/egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody
        );
        payload.MdmsRes.tenant.tenants = payload.MdmsRes.tenant.citymodule[1].tenants;
        dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
        await getBusinessServiceMdmsData(dispatch, commonConfig.tenantId, "wns");
    } catch (e) {
    }
};
const screenConfig = {
    uiFramework: "material-ui",
    name: "public-search",

    beforeInitScreen: (action, state, dispatch) => {
        setModule(getModuleName());
        const tenantId = getTenantId();
        // dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
        getMDMSData(dispatch);

        return action;
    },

    components: {
        div: {
            uiFramework: "custom-atoms",
            componentPath: "Form",
            props: {
                className: "public-domain-search, public-domain-search-position",
                id: "search",
            },
            children: {
                searchApplications,
                breakAfterSearch3: getBreak(),
                searchApplicationResult,
                breakAfterSearch4: getBreak()
            }
        }
    }
};

export default screenConfig;