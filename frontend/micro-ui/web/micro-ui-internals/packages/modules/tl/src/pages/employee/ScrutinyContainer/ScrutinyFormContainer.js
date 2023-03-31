import axios from "axios";
import { size } from "lodash";
import React, { useState, useEffect, useContext } from "react";
import { Container } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import ApplicationDetailsActionBar from "../../../../../templates/ApplicationDetails/components/ApplicationDetailsActionBar";
import ActionModal from "../../../../../templates/ApplicationDetails/Modal";
import { ScrutinyRemarksContext } from "../../../../context/remarks-data-context";
import jsPDF from 'jspdf'
import ScrutitnyForms from "../ScrutinyBasic/ScutinyBasic";



const ScrutinyFormcontainer = (props) => {


  // const [ApplicantFormshow, SetApplicantForm] = useState(true);
  // const [PurposeFormshow, SetPurposeForm] = useState(false);
  // const [LandScheduleFormshow, SetLandScheduleForm] = useState(false);
  // const [AppliedDetailsFormshow, SetAppliedDetailsForm] = useState(false);
  // const [FeesChargesFormshow, SetFeesChargesForm] = useState(false);

  const { id } = useParams();

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const { t } = useTranslation();
  const history = useHistory();

  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEnableLoader, setIsEnableLoader] = useState(false);
  const [isWarningPop, setWarningPopUp] = useState(false);
  const [showhide19, setShowhide19] = useState("true");
  const [businessService, setBusinessServices] = useState("NewTL");
  const [moduleCode, setModuleCode] = useState("TL")
  const [scrutinyDetails, setScrutinyDetails] = useState();
  const [feeandchargesData, SetFeeandchargesData] = useState();
  const [status , setStatus] = useState();

  const [applicationDetails, setApplicationDetails] = useState();
  const [lastUpdate, SetLastUpdate] = useState();
  const [workflowDetails, setWorkflowDetails] = useState();
  const [applicationData, setApplicationData] = useState();
  const { setBusinessService } = useContext(ScrutinyRemarksContext)

  const authToken = Digit.UserService.getUser()?.access_token || null;
  const userInfo = Digit.UserService.getUser()?.info || {};


  const handleshow19 = async (e) => {
    const payload = {

      "RequestInfo": {

        "apiId": "Rainmaker",

        "ver": ".01",

        "ts": null,

        "action": "_update",

        "did": "1",

        "key": "",

        "msgId": "20170310130900|en_IN",

        "authToken": ""

      }
    }
    const Resp = await axios.post(`/tl-services/new/license/pdf?applicationNumber=${id}`, payload, { responseType: "arraybuffer" })

    console.log("logger12345...", Resp.data, userInfo)

    const pdfBlob = new Blob([Resp.data], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl);

    console.log("logger123456...", pdfBlob, pdfUrl);

  };
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };


  const getScrutinyData = async () => {
    console.log("log123... userInfo", authToken);
    let requestInfo = {
      "RequestInfo": {
        "apiId": "Rainmaker",
        "msgId": "1669293303096|en_IN",
        "authToken": authToken

      }
    }
    try {
      const Resp = await axios.post(`/tl-services/v1/_search?tenantId=hr&applicationNumber=${id}`, requestInfo).then((response) => {
        return response?.data;
      });
      console.log("Response From API1", Resp, Resp?.Licenses[0]?.applicationNumber, Resp?.Licenses[0]?.tradeLicenseDetail?.additionalDetail[0]);
      setScrutinyDetails(Resp?.Licenses[0]?.tradeLicenseDetail?.additionalDetail[0]);

      console.log("devDel123", Resp?.Licenses[0])
      setApplicationData(Resp?.Licenses[0]);
      console.log("devDel1236", Resp?.Licenses[0]?.businessService)
      setBusinessService(Resp?.Licenses[0]?.businessService);
      setStatus(Resp?.Licenses[0]?.status);
      console.log("devStatus", Resp?.Licenses[0]?.status);

    } catch (error) {
      console.log(error);
    }
    let requestFiled = {

      RequestInfo: {
        apiId: "Rainmaker",
        ver: "v1",
        ts: 0,
        action: "_search",
        did: "",
        key: "",
        msgId: "090909",
        requesterId: "",
        authToken: authToken,
        // userInfo: userInfo

      },
      MdmsCriteria : {
        tenantId: "hr",
        moduleDetails: [
            {
                moduleName : "ACCESSCONTROL_ROLESACCESS",
                tenantId: "hr",
                masterDetails: [
                    {
                        "name": "rolesaccess",
                        "filter": "[?(@.role=='Patwari')]"
                    }
                ]
            }
        ]
    }
    }
    console.log("TCPaccess123", requestFiled)
    // return;

    try {
      const Resp = await axios.post(`/egov-mdms-service/v1/_search`, requestFiled).then((response) => {
        return response?.data;
      });
      // setApplicationData(Resp?.Licenses[0]);
      // SetLastUpdate(Resp?.Licenses[0]);
  console.log("FileddataName" , Resp);

    } catch (error) {
      console.log(error);
  
    }
    const applicationNo = id
    console.log("applicationNo", applicationNo);
    const feeAndChargesData = {


      "RequestInfo": {
        "apiId": "Rainmaker",
        "msgId": "1669293303096|en_IN",
        userInfo: userInfo,
        "authToken": authToken,


      },
      applicationNo: applicationNo,
    }
    const feeandchargesRespon = await axios.post(`/tl-calculator/v1/_getPaymentEstimate`, feeAndChargesData)
    SetFeeandchargesData(feeandchargesRespon?.data);
    console.log("Datafee", feeandchargesRespon);


  };
  // console.log("Data334", feeandchargesData);
  let EditRenewalApplastModifiedTime = Digit.SessionStorage.get("EditRenewalApplastModifiedTime");

  let workflowDetailsTemp = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: id,
    moduleCode: businessService,
    role: "TL_CEMP",
    config: { EditRenewalApplastModifiedTime: EditRenewalApplastModifiedTime },
  });

  const applicationDetailsTemp = Digit.Hooks.tl.useApplicationDetail(t, tenantId, id);
 




  const {

    mutate,
  } = Digit.Hooks.tl.useApplicationActions(tenantId);


  function onActionSelect(action) {
    if (action) {
      if (action?.isWarningPopUp) {
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

    // setTimeout(() => {
     

    //   window.location.href = `/digit-ui/employee/tl/inbox`
    // }, 3000);
  };

  const closeWarningPopup = () => {
    setWarningPopUp(false);
  }

  const [open, setOpen] = useState(false)

    // const handleClickOpen = () => {
    //     setOpen(true);
    //   };

    

  const submitAction = async (data, nocData = false, isOBPS = {}) => {
  
    setIsEnableLoader(true);
    if (typeof data?.customFunctionToExecute === "function") {
      data?.customFunctionToExecute({ ...data });
    }
    if (nocData !== false && nocMutation) {
      const nocPrmomises = nocData?.map(noc => {
        return nocMutation?.mutateAsync(noc)
      })
      try {
        setIsEnableLoader(true);
        const values = await Promise.all(nocPrmomises);
        values && values.map((ob) => {
          Digit.SessionStorage.del(ob?.Noc?.[0]?.nocType);
        })
      }
      catch (err) {
        setIsEnableLoader(false);
        let errorValue = err?.response?.data?.Errors?.[0]?.code ? t(err?.response?.data?.Errors?.[0]?.code) : err?.response?.data?.Errors?.[0]?.message || err;
        closeModal();
        setShowToast({ key: "error", error: { message: errorValue } });
        setTimeout(closeToast, 5000);
        return;
      }
    }

    



    if (mutate) {
      console.log("TCPac234",)
   
      setIsEnableLoader(true);
      mutate(data, {
        onError: (error, variables) => {
          setIsEnableLoader(false);
          setShowToast({ key: "error", error });
          setTimeout(closeToast, 5000);
        },
        onSuccess: (data, variables) => {
          setIsEnableLoader(false);
          if (isOBPS?.bpa) {
            data.selectedAction = selectedAction;
            history.replace(`/digit-ui/employee/obps/response`, { data: data });
          }
          if (isOBPS?.isStakeholder) {
            data.selectedAction = selectedAction;
            history.push(`/digit-ui/employee/obps/stakeholder-response`, { data: data });
          }
          if (isOBPS?.isNoc) {
            history.push(`/digit-ui/employee/noc/response`, { data: data });
          }
          setShowToast({ key: "success", action: selectedAction });
          setTimeout(closeToast, 5000);
          queryClient.clear();
          queryClient.refetchQueries("APPLICATION_SEARCH");
        },
      });
    }
    if (data.Licenses[0].action === "APPROVE_SITE_VERIFICATION") {

      let requesttoloi = {
        "RequestInfo": {
          "apiId": "Rainmaker",
          "msgId": "1669293303096|en_IN",
          "authToken": authToken
  
        }
      }
      try {
        const Resp = await axios.post(`/tl-services/v1/_search?tenantId=hr&applicationNumber=${id}`, requesttoloi).then((response) => {
          return response?.data;
        });
        console.log("AfterLoiUpdate", Resp, Resp?.Licenses);
        
  
      } catch (error) {
        console.log(error);
      }


      let requestInfo = {

        RequestInfo: {
          apiId: "Rainmaker",
          ver: "v1",
          ts: 0,
          action: "_search",
          did: "",
          key: "",
          msgId: "090909",
          requesterId: "",
          authToken: authToken,
          userInfo: userInfo

        }
      }
      console.log("TCPaccess", requestInfo)
      // return;

      try {
        const Resp = await axios.post(`/tl-services/new/getDeptToken?applicationNumber=${id}`, requestInfo).then((response) => {
          return response?.data;
        });
        // setApplicationData(Resp?.Licenses[0]);
        SetLastUpdate(Resp?.Licenses[0]);
    console.log("updateLicenses" , Resp?.Licenses[0]?.tcpLoiNumber);

      } catch (error) {
        console.log(error);
    
      }
     
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
      const Resp = await axios.post(`/tl-services/loi/report/_create?applicationNumber=${id}&userId=${userInfo?.id}&hqUserId=2247`, payload, { responseType: "arraybuffer" })

      console.log("logger12345...", Resp.data, userInfo)

      const pdfBlob = new Blob([Resp.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);

      console.log("logger123456...", pdfBlob, pdfUrl);




    }

    // closeModal();

    setTimeout(() => {
      closeModal()
      window.location.href = `/digit-ui/employee/tl/inbox`
      }, 3000);
  };

  useEffect(() => {
    console.log("log123...applicationDetailsAPI", applicationDetailsTemp)
   

  
    if (applicationDetailsTemp?.data) {
      setApplicationDetails(applicationDetailsTemp?.data)
      
    }
  }, [applicationDetailsTemp?.data])


  useEffect(() => {
    console.log("log123...wrkflw", id, workflowDetailsTemp, scrutinyDetails, applicationDetails)
    if (workflowDetailsTemp?.data?.applicationBusinessService) {
      setWorkflowDetails(workflowDetailsTemp);
      setBusinessServices(workflowDetailsTemp?.data?.applicationBusinessService);

    }
  }, [workflowDetailsTemp?.data]);


  useEffect(() => {
    getScrutinyData();
  }, [])

  console.log("meri update34" , lastUpdate)
  return (
    <Card className="formColorEmp">
      <Card.Header className="head-application" >
        <div className="row fw-normal">
          <div className="col-sm-2">
            <b><p className="head-font">Application Number:</p></b>
            <b><p className="head-font">{id}</p></b>
          </div>
          <div className="col-sm-2">
            <b><p className="head-font">Service Id: </p></b>
            <b><p className="head-font">
              {/* {applicationData?.businessService} ask to renuka */}
              Licence
              </p></b>
          </div>
          <div className="col-sm-2">
            <b><p className="head-font">TCP Application Number:</p></b>
            {/* {item.name.substring(0, 4)} */}
            <b><p className="head-font">{applicationData?.tcpApplicationNumber}</p></b>
          </div>
          <div className="col-sm-2">
            <b><p className="head-font">TCP Case Number:</p></b>
            <b><p className="head-font">{applicationData?.tcpCaseNumber.substring(0, 7)}</p></b>
          </div>
          <div className="col-sm-2">
            <b><p className="head-font">TCP Dairy Number: </p></b>
            <b><p className="head-font">{applicationData?.tcpDairyNumber}</p></b>
           
          </div>
          <div className="col-sm-2">
          <Button style={{ textAlign: "right" }} value="Submit" id="Submit" onChange1={handleChange} name="Submit" onClick={handleshow19}>Views PDF</Button>
            </div>
        </div>
      </Card.Header>
      <Row >
        <div className="formlist">
          <ScrutitnyForms
            feeandcharges={feeandchargesData}
            histeroyData={workflowDetailsTemp}
            apiResponse={scrutinyDetails}
            applicationNumber={id}
            applicationStatus={status}
            refreshScrutinyData={getScrutinyData}
          ></ScrutitnyForms>
        </div>

      </Row>
      <Row style={{ top: 30, padding: "10px 22px" }}>


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
              applicationData={{ ...applicationDetails?.applicationData, workflowCode: applicationDetails?.applicationData?.workflowCode || "NewTL" }}
              closeModal={closeModal}
              submitAction={submitAction}
              actionData={workflowDetails?.data?.timeline}
              businessService={businessService}
              tcpLoiNumber={lastUpdate}
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
            // forcedActionPrefix={forcedActionPrefix}
            ActionBarStyle={{}}
            MenuStyle={{}}
          />


        </div>

        {/* </Row> */}
        <Row>

          {/* <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 20 }}>
            
          </div> */}
          {/* {showhide19 === "Submit" && ( */}
          {/* <div>
            <Button style={{ textAlign: "right" }}> <a href="http://localhost:3000/digit-ui/employee/tl/Loi" >Generate LOI</a></Button>
          </div> */}
          {/* )} */}
          
          {/* ////////////////////done////////////////////////////////// */}
          {/* <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">
    Patwari_HQ Remarks
    </DialogTitle>
    <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p>Your Service Plan is submitted successfully <span><CheckCircleOutlineIcon style={{color: 'blue', variant: 'filled'}}/></span></p>
            <p>Please Note down your Application Number <span style={{padding: '5px', color: 'blue'}}>Patwari_HQ Remarks</span> for further assistance</p>
          </DialogContentText>
    </DialogContent>
    <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
    </DialogActions>

    </Dialog> */}


        </Row>
      </Row>
    </Card>
  );
};

export default ScrutinyFormcontainer;
