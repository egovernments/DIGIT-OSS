import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SubmitBar, ActionBar, Menu } from "@egovernments/digit-ui-react-components";

import axios from "axios";
import { Button } from "react-bootstrap";
// import Button from '@mui/material/Button';

function ApplicationDetailsActionBar({ workflowDetails, displayMenu, onActionSelect, ApplicationNumber, setDisplayMenu, businessService, forcedActionPrefix,ActionBarStyle={},MenuStyle={} }) {

  const { t } = useTranslation();

  const [isSingleButton,setIsSingleButton] = useState(false)
  const [isMenuBotton,setIsMenuBotton] = useState(false)
  const [actions,setActions] = useState([]);
  
  const authToken = Digit.UserService.getUser()?.access_token || null;
  
  useEffect(()=>{

    let user = Digit.UserService.getUser();
    const userRoles = user?.info?.roles?.map((e) => e.code);

    let tempAction = workflowDetails?.data?.actionState?.nextActions?.filter((e) => {
      return userRoles.some((role) => e.roles?.includes(role)) || !e.roles;
    })
    console.log("log wrkflw",workflowDetails,tempAction,userRoles)
    setActions(tempAction);

  },[workflowDetails])

  useEffect(()=>{
    console.log("log actions",workflowDetails,actions)

    if (window.location.href.includes("/obps") || window.location.href.includes("/noc")) {
      const userInfos = sessionStorage.getItem("Digit.citizen.userRequestObject");
      const userInfo = userInfos ? JSON.parse(userInfos) : {};
      let user = userInfo?.value;
    }

    if (((window.location.href.includes("/obps") || window.location.href.includes("/noc")) && actions?.length == 1) || (actions?.[0]?.redirectionUrl?.pathname.includes("/pt/property-details/")) && actions?.length == 1) {
      setIsMenuBotton(false)
      setIsSingleButton(true)
    } else if (actions?.length > 0) {
      setIsMenuBotton(true)
      setIsSingleButton(false)
    }
  },[actions])

  // const shoot = () => {
  //   alert("Great Shot!");
  // }
 
  const shoot = async (e) => {
    const payload = {

        "RequestInfo": {

            "apiId": "Rainmaker",

            "ver": ".01",

            "ts": null,

            "action": "_update",

            "did": "1",

            "key": "",

            "msgId": "20170310130900|en_IN",

            "authToken": authToken

        }
    }
    const Resp = await axios.post(`/tl-services/loi/report/_create?applicationNumber=${ApplicationNumber}`, payload, { responseType: "arraybuffer" })

    // console.log("loggerNew...", Resp.data, userInfo)

    const pdfBlob = new Blob([Resp.data], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);

    console.log("logger123456...", pdfBlob, pdfUrl);

};

  return (
    <React.Fragment>
      
      {!workflowDetails?.isLoading && isMenuBotton && !isSingleButton && (
        <ActionBar style={{...ActionBarStyle}}>
          {displayMenu && workflowDetails?.data?.actionState?.nextActions ? (
            <Menu
              localeKeyPrefix={forcedActionPrefix || `WF_EMPLOYEE_${businessService?.toUpperCase()}`}
              options={actions}
              optionKey={"action"}
              t={t}
              onSelect={onActionSelect}
              style={MenuStyle}
            />
          ) : null}

         
                      { businessService === "NewTL" && 
            <Button 
             className="submit-bar submit-bar-take-action"
             onClick={shoot} >
               {t("WF_PDF_ACTION")}
            </Button>
                }
          
         
      
          <SubmitBar style={{marginLeft: 20}} label={t("WF_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
         
         

        </ActionBar>
      )}
      {!workflowDetails?.isLoading && !isMenuBotton && isSingleButton && (
        <ActionBar style={{...ActionBarStyle}}>
          <button
              style={{ color: "#FFFFFF", fontSize: "19px" }}
              className={"submit-bar abc"}
              name={actions?.[0]?.action}
              value={actions?.[0]?.action}
              onClick={(e) => { onActionSelect(actions?.[0] || {})}}>
              {t(`${forcedActionPrefix || `WF_EMPLOYEE_${businessService?.toUpperCase()}`}_${actions?.[0]?.action}`)}
            </button>
        </ActionBar>
      )}
    </React.Fragment>
  );
}

export default ApplicationDetailsActionBar;
