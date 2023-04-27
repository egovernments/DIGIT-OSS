import axios from "axios";
import { size } from "lodash";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import ApplicationDetailsActionBar from "../../../../../../../templates/ApplicationDetails/components/ApplicationDetailsActionBar";


import ActionModal from "../../../../../../../templates/ApplicationDetails/Modal/index";

import LayoutBasic from "./LayoutPlanBaisc";

const LayoutPlanScritny = (props) => {


const {id} = useParams();

const userInfo = Digit.UserService.getUser()?.info || {};
const authToken = Digit.UserService.getUser()?.access_token || null;
  // const applicationNumber = "HR-TL-2022-12-07-000498"

  // let applicationNumber = "";
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const { t } = useTranslation();
  const history = useHistory();
  
  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEnableLoader, setIsEnableLoader] = useState(false);
  const [isWarningPop, setWarningPopUp ] = useState(false);
  const [showhide19, setShowhide19] = useState("true");
  const [businessService, setBusinessService] = useState("REVISED_LAYOUT_PLAN");
  const [moduleCode,setModuleCode] = useState("TL")
  const [ scrutinyDetails, setScrutinyDetails] = useState();
  const [status , setStatus] = useState();
  // const [applicationNumber,setApplicationNumber] = useState("");
  const [applicationDetails, setApplicationDetails] = useState();
  const [workflowDetails, setWorkflowDetails] = useState();
  const [applicationData,setApplicationData] = useState();

  const handleshow19 = (e) => {
    const getshow = e.target.value;
    setShowhide19(getshow);
  };
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };


  const getScrutinyData = async () => {
    console.log("log123... userInfo",authToken);
    let requestInfo = {
        
      "RequestInfo": {
        "apiId": "Rainmaker",
        "ver": "v1",
        "ts": 0,
        "action": "_search",
        "did": "",
        "key": "",
        "msgId": "090909",
        "requesterId": "",
        authToken: authToken,
        userInfo: userInfo
    }
    };
    try {
      const Resp = await axios.post(`/tl-services/revisedPlan/_search?applicationNumber=${id}`, requestInfo).then((response) => {
        return response?.data;
      });
    //   console.log("Response From API1", Resp, Resp?.Licenses[0]?.applicationNumber,Resp);
      setScrutinyDetails(Resp?.revisedPlan?.[0]);
      setStatus(Resp?.revisedPlan?.[0]?.status);

      console.log("transfer001822",Resp?.revisedPlan?.[0]);
      setApplicationData(Resp?.revisedPlan?.[0]);
      setApplicationDetails({
        applicationData: Resp?.revisedPlan?.[0],
        workflowCode: Resp?.revisedPlan?.[0].businessService
      })
    } catch (error) {
      console.log(error);
    }
  };

  let EditRenewalApplastModifiedTime = Digit.SessionStorage.get("EditRenewalApplastModifiedTime");

  let workflowDetailsTemp = Digit.Hooks.useWorkflowDetails({
    tenantId:  tenantId,
    id: id,
    moduleCode: businessService,
    role: "TL_CEMP",
    config:{EditRenewalApplastModifiedTime:EditRenewalApplastModifiedTime},
  });
  
  // const applicationDetailsTemp = Digit.Hooks.tl.useApplicationDetail(t, tenantId, id);
  



  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.tl.useApplicationActions(tenantId);


  function onActionSelect(action) {
    if (action) {
      if(action?.isWarningPopUp){
        setWarningPopUp(true);
      }
      else if (action?.redirectionUrll) {
        window.location.assign(`${window.location.origin}/digit-ui/employee/payment/collect/${action?.redirectionUrll?.pathname}`);
      } else if (!action?.redirectionUrl) {
        setShowModal(true);
      } else {
        history.push({
          pathname: action.redirectionUrl?.pathname,
          state: { ...action.redirectionUrl?.state },
        });
      }
    } 
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  const queryClient = useQueryClient();


  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
  };

  const closeWarningPopup = () => {
    setWarningPopUp(false);
  }

  const submitAction = async (data, nocData = false, isOBPS = {}) => {

    console.log("logger log1223", data)

    try{
      let body = {
        ...data,
        RequestInfo: {
          api_id: "1",
          ver: "1",
          ts: null,
          action: "create",
          did: "",
          key: "",
          msg_id: "",
          requester_id: "",
          authToken: authToken ,
          userInfo: userInfo
      }
      }
      const response = await axios.post("/tl-services/revisedPlan/_update",body);
      console.log("Update API Response ====> ", response.data);
    } catch (error) {
      console.log("Update Error ===> ", error.message)
    }

    closeModal();
    // setTimeout(() => {
     
    //   window.location.href = `/digit-ui/employee/tl/TranferInbox`
    //   }, 3000);
  };

  


  useEffect(() => {
    console.log("log123...wrkflw",id,workflowDetailsTemp,scrutinyDetails,applicationDetails)
    if (workflowDetailsTemp?.data?.applicationBusinessService) {
      setWorkflowDetails(workflowDetailsTemp);
      setBusinessService(workflowDetailsTemp?.data?.applicationBusinessService);
    }
  }, [workflowDetailsTemp?.data]);
  
 

  useEffect(()=>{
    console.log("Akash124")
    getScrutinyData();
  },[])


  return (
    <Card>
      
      <Card.Header className="head-application" >
        <div className="row fw-normal">
          <div className="col-sm-2">
            <b><p className="head-font">Application Number:</p></b>
            <b><p className="head-font">{id}</p></b>
          </div>
          <div className="col-sm-2">
            <b><p className="head-font">Service Id: </p></b>
            <b><p className="head-font">
              {applicationData?.businessService}
              {/* Licence */}
            </p></b>
          </div>
          <div className="col-sm-2">
            <b><p className="head-font">TCP Application Number:</p></b>
            {/* {item.name.substring(0, 4)} */}
            <b><p className="head-font">{applicationData?.tcpApplicationNumber}</p></b>
          </div>
          <div className="col-sm-2">
            <b><p className="head-font">TCP Case Number:</p></b>
            <b><p className="head-font">{applicationData?.tcpCaseNumber}</p></b>
          </div>
          <div className="col-sm-2">
            <b><p className="head-font">TCP Dairy Number: </p></b>
            <b><p className="head-font">{applicationData?.tcpDairyNumber}</p></b>

          </div>
          {/* <div className="col-sm-2">
            <Button style={{ textAlign: "right" }} value="Submit" id="Submit" onChange1={handleChange} name="Submit" onClick={handleshow19}>Views PDF</Button>
          </div> */}
        </div>
      </Card.Header>
      <Row style={{ top: 10, padding: 10 }}>
      
         <LayoutBasic
          histeroyData={workflowDetailsTemp}
         apiResponse={scrutinyDetails}
         applicationNumber={id}
         refreshScrutinyData={getScrutinyData}
         applicationStatus={status}
         ></LayoutBasic>
      </Row>
      {/* {JSON.stringify(scrutinyDetails)} */}
      <Row style={{ top: 10, padding: "10px 22px" }}>

        {/* <Row> */}
        
          <div class="col-md-10 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
           {showModal ? (
            <ActionModal
              t={t}
              action={selectedAction}
              tenantId={tenantId}
              state={state}
              id={id}
              applicationDetails={applicationDetails}
              applicationData={{...applicationDetails?.applicationData,workflowCode:applicationDetails?.applicationData?.workflowCode || "REVISED_LAYOUT_PLAN"}}
              closeModal={closeModal}
              submitAction={submitAction}
              actionData={workflowDetails?.data?.timeline}
              businessService={businessService}
              workflowDetails={workflowDetails}
              moduleCode={moduleCode}
            />
          ) : null}
          {isWarningPop ? (
            <ApplicationDetailsWarningPopup 
            action={selectedAction}
            workflowDetails={workflowDetails}
            businessService={businessService}
            isWarningPop={isWarningPop}
            closeWarningPopup={closeWarningPopup}
            />
          ) : null}
          
          <ApplicationDetailsActionBar
            workflowDetails={workflowDetails}
            displayMenu={displayMenu}
            onActionSelect={onActionSelect}
            setDisplayMenu={setDisplayMenu}
            businessService={businessService}
            ActionBarStyle={{}}
            MenuStyle={{}}
          />
   </div>
          
        {/* </Row> */}
        <Row>
          
          <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          {/* <Button style={{ textAlign: "right" }}> <a href="http://localhost:3000/digit-ui/citizen/obps/Loi" >Generate LOI</a></Button> */}
          {/* <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow19} /> */}
          </div>
          {showhide19 === "Submit" && (
                     <div>
                       <Button style={{ textAlign: "right" }}> <a href="http://localhost:3000/digit-ui/employee/tl/Loi" >Generate LOI</a></Button>
                     </div>
                        )}
                        
                    
        </Row>
      </Row>
    </Card>
  );
};

export default LayoutPlanScritny;



