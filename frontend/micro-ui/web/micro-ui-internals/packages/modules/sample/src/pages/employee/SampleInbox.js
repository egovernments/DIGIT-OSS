import React,{useState,useEffect,useMemo} from "react";
import { useTranslation } from "react-i18next";
import { Header, InboxSearchComposer, Loader } from "@egovernments/digit-ui-react-components";
import inboxConfig from "../../configs/inboxConfig";
import { useLocation } from 'react-router-dom';

const Inbox = () => {
    const { t } = useTranslation();
    const location = useLocation()
    
    // const configs = inboxConfig();
    const [pageConfig, setPageConfig] = useState(null)
    const tenant = Digit.ULBService.getStateId();
    const { isLoading, data } = Digit.Hooks.useCustomMDMS(
        tenant,
        Digit.Utils.getConfigModuleName(),
        [
            {
                "name": "InboxMusterConfig"
            }
        ]
    );
   
    const configs = data?.[Digit.Utils.getConfigModuleName()]?.InboxMusterConfig?.[0]
   
    const updatedConfig = useMemo(
        () => Digit.Utils.preProcessMDMSConfigInboxSearch(t, pageConfig,"sections.search.uiConfig.fields",{}),
        [data,pageConfig]);

    useEffect(() => {
        setPageConfig(_.cloneDeep(configs))

    }, [data, location])

    if(isLoading || !pageConfig)  return <Loader />
    return (
        <React.Fragment>
            <Header styles={{ fontSize: "32px" }}>{t(updatedConfig?.label)}{location?.state?.count ? <span className="inbox-count">{location?.state?.count}</span> : null}</Header>
            <div className="inbox-search-wrapper">
                <InboxSearchComposer configs={updatedConfig}></InboxSearchComposer>
            </div>
        </React.Fragment>
    )
}

export default Inbox;