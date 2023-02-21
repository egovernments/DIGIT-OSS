
import axios from "axios";
import { size } from "lodash";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import ApplicationDetailsActionBar from "../../../../../../templates/ApplicationDetails/components/ApplicationDetailsActionBar";
import ActionModal from "../../../../../../templates/ApplicationDetails/Modal";
// import ScrutitnyForms from "../ScrutinyBasic/ScutinyBasic";
import ElecticalBase from "./ElectricalscrutinyBase";

const ElectricalScrutiny = (props) => {


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
  const [businessService, setBusinessService] = useState("ELECTRICAL_PLAN");
  const [moduleCode,setModuleCode] = useState("TL")
  const [ scrutinyDetails, setScrutinyDetails] = useState();
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
            "api_id": "1",
            "ver": "1",
            "ts": null,
            "action": "create",
            "did": "",
            "key": "",
            "msg_id": "",
            "requester_id": "",
            "authToken": authToken
        }
    }
    try {
      const Resp = await axios.post(`/tl-services/electric/plan/_get?applicationNumber=${id}`,requestInfo).then((response) => {
        return response?.data;
      });
    //   console.log("Response From API1", Resp, Resp?.Licenses[0]?.applicationNumber,Resp);
      setScrutinyDetails(Resp?.electricPlanResponse?.[0]);

      console.log("devDel123",Resp?.electricPlanResponse?.[0]);
      setApplicationData(Resp?.electricPlanResponse?.[0]);
      setApplicationDetails({
        applicationData: Resp?.electricPlanResponse?.[0],
        workflowCode: Resp?.electricPlanResponse?.[0].businessService
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
          authToken: authToken
      }
      }
      const response = await axios.post("/tl-services/electric/plan/_update",body);
      console.log("Update API Response ====> ", response.data);
    } catch (error) {
      console.log("Update Error ===> ", error.message)
    }

    closeModal();
  };

  // useEffect(()=>{
  //   console.log("log123...applicationDetailsAPI",applicationDetailsTemp)
  //   if(applicationDetailsTemp?.data){
  //     setApplicationDetails(applicationDetailsTemp?.data)
  //   }
  // },[applicationDetailsTemp?.data])


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
      <Card.Header class="fw-normal" style={{ top: 5, padding: 5 , fontSize: 14 ,height:90, lineHeight:2 }}>
        <div className="row">
          <div className="col-md-3">
            <p>Application Number:</p>
            <p class="fw-normal">{id}</p>
          </div>
          <div className="col-md-2">
            <p>Service Id: </p>
            <p class="fw-normal">{applicationData?.businessService}</p>
          </div>
          <div className="col-md-3">
            <p>TCP Application Number:</p>
            <p class="fw-normal">{applicationData?.tcpApplicationNumber}</p>
          </div>
          <div className="col-md-2">
            <p>TCP Case Number:</p>
            <p class="fw-normal">{applicationData?.tcpCaseNumber}</p>
          </div>
          <div className="col-md-2">
            <p>TCP Dairy Number: </p>
            <p class="fw-normal">{applicationData?.tcpDairyNumber}</p>
          </div>
        </div>
      </Card.Header>
      <Row style={{ top: 10, padding: 10 }}>
      
         <ElecticalBase
          histeroyData={workflowDetailsTemp}
         apiResponse={scrutinyDetails}
         applicationNumber={id}
         refreshScrutinyData={getScrutinyData}
         ></ElecticalBase>
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
              applicationData={{...applicationDetails?.applicationData,workflowCode:applicationDetails?.applicationData?.workflowCode || "ELECTRICAL_PLAN"}}
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

export default ElectricalScrutiny;

