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
import Spinner from "../../../components/Loader";

import { Dialog, stepIconClasses } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


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
  const [loader, setLoader] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEnableLoader, setIsEnableLoader] = useState(false);
  const [isWarningPop, setWarningPopUp] = useState(false);
  const [showhide19, setShowhide19] = useState("true");
  const [businessService, setBusinessServices] = useState("NewTL");
  const [moduleCode, setModuleCode] = useState("TL")
  const [scrutinyDetails, setScrutinyDetails] = useState();
  const [additionalDocResponData, SetAdditionalDocResponData] = useState();
  const [status, setStatus] = useState();
  const [open1, setOpen1] = useState(false);
  const [applicationDetails, setApplicationDetails] = useState();
  const [lastUpdate, SetLastUpdate] = useState();
  const [workflowDetails, setWorkflowDetails] = useState();
  const [applicationData, setApplicationData] = useState();
  const [tcpApplicationNumber, setTcpApplicationNumber] = useState();
  const [mDMSData, setMDMSData] = useState();
  const [dataProfrma, setDataProfrma] = useState([]);
  const [profrmaData, setProfrmaData] = useState([]);
  const [profrmaDataID, setProfrmaDataID] = useState([]);
  const [mDmsUpdate, SetMDmsUpdate] = useState();
  const { setBusinessService } = useContext(ScrutinyRemarksContext)

  const authToken = Digit.UserService.getUser()?.access_token || null;
  const userInfo = Digit.UserService.getUser()?.info || {};
  const userRolesArray = userInfo?.roles.filter((user) => user.code);
  const filterDataRole = userRolesArray?.map((e) => e.code)
  let user = Digit.UserService.getUser();
  const userRoles = user?.info?.roles?.map((e) => e.code);
  const showRemarksSection = userRoles.includes("DTCP_HR")

  console.log("rolename", filterDataRole);
  console.log("userRolesArray", userRolesArray);
  const roleCodeUseAPi = userRolesArray.map((object) => `${object.code}`)

  let query = userRolesArray.map((object) => `@.role=='${object.code}'`).join("|| ")
  console.log("Qurey", query);
  console.log("roleCodeUseAPi", roleCodeUseAPi);
  console.log("showRemarksSection", showRemarksSection);

 


  const handleshow19 = async (e) => {
    setLoader(true);
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
    setLoader(false);
  };
  const handleChange = (e) => {

    this.setState({ isRadioSelected: true });
  };


  const getScrutinyData = async () => {
    setLoader(true);
    console.log("log123... userInfo", authToken);
    let requestInfo = {
      "RequestInfo": {
        "apiId": "Rainmaker",
        "msgId": "1669293303096|en_IN",
        "authToken": authToken

      }

    }
    let requestFiled = {}
    let requestProfrma = {}
    // let dataProfrmaFiled = {}
    try {
      const Resp = await axios.post(`/tl-services/v1/_search?tenantId=hr&applicationNumber=${id}`, requestInfo).then((response) => {
        return response?.data;
      });
      setLoader(false);
      console.log("Response From API1", Resp, Resp?.Licenses[0]?.applicationNumber, Resp?.Licenses[0]?.tradeLicenseDetail?.additionalDetail[0]);
      setScrutinyDetails(Resp?.Licenses[0]?.tradeLicenseDetail?.additionalDetail[0]);

      console.log("devDel123", Resp?.Licenses[0])
      setApplicationData(Resp?.Licenses[0]);
      setTcpApplicationNumber(Resp?.Licenses[0]?.tcpApplicationNumber);
      console.log("devDel1236", Resp?.Licenses[0]?.businessService)
      setBusinessService(Resp?.Licenses[0]?.businessService);
      setStatus(Resp?.Licenses[0]?.status);
      console.log("devStatus", Resp?.Licenses[0]?.status);

      const additionalDoc = {



        "RequestInfo": {

          "apiId": "Rainmaker",

          "ver": "v1",

          "ts": 0,

          "action": "_search",

          "did": "",

          "key": "",

          "msgId": "090909",

          "requesterId": "",

          "authToken": authToken,

          "userInfo": userInfo

        },

      }

      const additionalDocRespon = await axios.post(`/tl-services/_additionalDocuments/_search?licenceNumber=${Resp?.Licenses[0]?.tcpApplicationNumber}&businessService=NewTL`, additionalDoc)
      SetAdditionalDocResponData(additionalDocRespon?.data);
      console.log("Datafee", additionalDocRespon);



      //     dataProfrmaFiled = {

      // "RequestInfo": {
      //   "apiId": "Rainmaker",
      //   "msgId": "1669293303096|en_IN",
      //   "authToken": authToken

      // },

      //     }




      requestFiled = {

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


        },
        MdmsCriteria: {
          tenantId: "hr",
          moduleDetails: [
            {
              moduleName: "ACCESSCONTROL_ROLESACCESS",
              tenantId: "hr",
              masterDetails: [
                {
                  "name": "rolesaccess",
                  "filter": `[?(${query})]`,
                },
                {
                  "name": "rolesaccess",
                  "filter": `[?(@.applicationStatus =='${Resp?.Licenses[0]?.status}')]`
                }
              ]
            }
          ]
        }
      }

      requestProfrma = {

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
          correlationId: null,

        },
        MdmsCriteria: {
          tenantId: "hr",
          moduleDetails: [
            {
              moduleName: "common-masters",
              tenantId: "hr",
              masterDetails: [
                //   {

                //     "name": "PerformaNewLicence",

                //     "filter":`[?(${query})]`,

                // },
                // {
                //   "name": "PerformaNewLicence",
                //   "filter": `[?(@.applicationStatus =='${Resp?.Licenses[0]?.status}')]`
                // }
                {

                  "name": "PerformaNewLicence",

                  "filter": `[?((${query}) && @.applicationStatus =='${Resp?.Licenses[0]?.status}')]`

                },



                // {
                //   "name": "PerformaNewLicence",
                //   "filter": `[?(@.applicationStatus =='PENDING_AT_PATWARI_HQ_PRELIM')]`
                // }

              ]
            }
          ]
        }
      }
    } catch (error) {
      console.log(error);
    }

    console.log("TCPaccess123", requestFiled)
    // let requestProfrma = {status}
    try {
      const Resp = await axios.post(`/egov-mdms-service/v1/_search`, requestFiled).then((response) => {
        return response?.data;
      });
      setMDMSData(Resp?.MdmsRes?.ACCESSCONTROL_ROLESACCESS?.rolesaccess);

      console.log("FileddataName12", mDMSData);


    }
    catch (error) {
      console.log(error);

    }

    console.log("TCPaccessrequestProfrma123", requestProfrma)
    try {
      const Resp = await axios.post(`/egov-mdms-service/v1/_search`, requestProfrma).then((response) => {
        return response?.data;
      });
      setDataProfrma(Resp?.MdmsRes);
      console.log("FileddataNamemDMSDataProfrma", dataProfrma, Resp);

    } catch (error) {
      console.log(error);

    }



    // } catch (error) {
    //   console.log(error);

    // }




    // try {
    //   const Resp = await axios.post(`/egov-mdms-service/v1/_search`, requestFiled).then((response) => {
    //     return response?.data;
    //   });
    //   setMDMSData(Resp?.MdmsRes?.ACCESSCONTROL_ROLESACCESS?.rolesaccess);
    //   console.log("FileddataName", mDMSData);

    // } catch (error) {
    //   console.log(error);

    // }
    // const applicationNo = id
    // console.log("applicationNo", applicationNo);
    const dataProfrmaFiled = {


      "RequestInfo": {

        "apiId": "Rainmaker",

        "authToken": authToken,

        "userInfo": userInfo,

        "msgId": "1684320117934|en_IN"

      },

    }

    const dataProfrmaFiledRespon = await axios.post(`/tl-services/_performaScrutiny/_search?applicationNumber=${id}&userId=${userInfo?.id}`, dataProfrmaFiled)
    setProfrmaData(dataProfrmaFiledRespon?.data?.PerformaScruitny?.[0]?.additionalDetails);
    setProfrmaDataID(dataProfrmaFiledRespon?.data?.PerformaScruitny?.[0]);
    console.log("FileddataNamemDMSprofrmaData", dataProfrmaFiledRespon, profrmaDataID);


    const additionalDoc = {



      "RequestInfo": {

        "apiId": "Rainmaker",

        "ver": "v1",

        "ts": 0,

        "action": "_search",

        "did": "",

        "key": "",

        "msgId": "090909",

        "requesterId": "",

        "authToken": authToken,

        "userInfo": userInfo

      },

    }

    const additionalDocRespon = await axios.post(`/tl-services/_additionalDocuments/_search?licenceNumber=${Resp?.Licenses[0]?.tcpApplicationNumber}&businessService=NewTL`, additionalDoc)
    SetAdditionalDocResponData(additionalDocRespon?.data);
    console.log("Datafee", additionalDocRespon);


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

  const handleClickOpen = () => {
      setOpen(true);
    };



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
        setTimeout(closeToast, 3000);
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
          setTimeout(closeToast, 3000);
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
          setTimeout(closeToast, 3000);
          queryClient.clear();
          queryClient.refetchQueries("APPLICATION_SEARCH");
        },
      });
     
    }
    if (data.Licenses[0].action === "APPROVED_WITH_LOI") {
      setLoader(true);
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

        setLoader(false);
      } catch (error) {
        setLoader(false);
        console.log(error);
      }

      // if (showRemarksSection==="DTCP_HR")
      // {
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
        setLoader(false);
        SetLastUpdate(Resp?.Licenses[0]);
        console.log("updateLicenses", Resp?.Licenses[0]?.tcpLoiNumber);

      } catch (error) {
        console.log(error);
        setLoader(false);
      }
      // }

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
      const Resp = await axios.post(`/tl-services/loi/report/_create?applicationNumber=${id}`, payload, { responseType: "arraybuffer" })

      console.log("logger12345...", Resp.data, userInfo)

      const pdfBlob = new Blob([Resp.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl);

      console.log("logger123456...", pdfBlob, pdfUrl);




    }

    closeModal(); 

    setTimeout(() => {
      closeModal()
      setOpen1(true);
      // window.location.href = `/digit-ui/employee/tl/inbox`
    }, 2000);
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

  const handalfinal = () => {
    setOpen1(false);
    window.location.href = `/digit-ui/employee/tl/inbox`
 }

  console.log("meri update34", lastUpdate)
  return (
    <Card className="formColorEmp" style={{marginTop:"40px"}}>
      {loader && <Spinner></Spinner>}
      <div style={{
            position: "fixed",
            top: "89px",
            width: "100%",
            left:"0",
            paddingLeft: "62px",
            zIndex: 9
      }}>
        <Card className="head-application1">
          <div className="d-flex justify-content-between">
            <div className="px-3">
              <b><p className="head-font">Application Number:</p></b>
              <b><p className="head-font">{id}</p></b>
            </div>
            <div className="px-3">
              <b><p className="head-font">Service Id: </p></b>
              <b><p className="head-font">
                {/* {applicationData?.businessService} ask to renuka */}
                Licence
              </p></b>
            </div>
            <div className="px-3">
              <b><p className="head-font">TCP Application Number:</p></b>
              {/* {item.name.substring(0, 4)} */}
              <b><p className="head-font">{applicationData?.tcpApplicationNumber.substring(7, 20)}</p></b>
            </div>
            <div className="px-3">
              <b><p className="head-font">TCP Case Number:</p></b>
              <b><p className="head-font">{applicationData?.tcpCaseNumber.substring(0, 7)}</p></b>
            </div>
            <div className="px-3">
              <b><p className="head-font">TCP Diary Number: </p></b>
              <b><p className="head-font">{applicationData?.tcpDairyNumber}</p></b>

            </div>
            <div className="px-3">
              <Button style={{ textAlign: "right" }} value="Submit" id="Submit" onChange1={handleChange} name="Submit" onClick={handleshow19}>View PDF</Button>
            </div>
          </div>
        </Card>
      </div>
      <Row >
        <div className="formlist">
          <ScrutitnyForms
            additionalDocResponData={additionalDocResponData}
            histeroyData={workflowDetailsTemp}
            apiResponse={scrutinyDetails}
            applicationNumber={id}
            applicationStatus={status}
            refreshScrutinyData={getScrutinyData}
            mDMSData={mDMSData}
            dataMDMS={dataProfrma}
            dataProfrmaFileds={profrmaData}
            profrmaID={profrmaDataID}
            applicationimp={applicationData}
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
            ApplicationNumber={id}
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


    {/* {Dialog Box} */}
           {/* <Dialog open1={open1} onClose={submitAction} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" style={{
    textAlign: "center",
    color: "#ffff",
    backgroundColor: "#000000b0"}}>
          <DialogTitle id="alert-dialog-title" style={{ fontSize: "xx-large", background: "#000000b0" , color: "#ffff"}}>Application Submission</DialogTitle>
          <DialogContent style={{ background: "#000000b0"}}>
            <DialogContentText id="alert-dialog-description" style={{textAlign: "center", color: "#ffff" , fontSize: "x-large"}}>
              <p ><CheckCircleIcon style={{fontSize: "-webkit-xxx-large;"}}></CheckCircleIcon></p>
              <p>
                Thank You {" "}
                
              </p>
              <p>
                Application was been submitted successfully !!<span style={{ padding: "5px", color: "blue" }}></span> 
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handalfinal} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog> */}

<Dialog open={open1} onClose={submitAction} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" style={{
    textAlign: "center",
    color: "#ffff",
    backgroundColor: "#000000b0"}}>
          <DialogTitle id="alert-dialog-title" style={{ fontSize: "xx-large", background: "#000000b0" , color: "#ffff"}}>File sent successfully</DialogTitle>
          <DialogContent style={{ background: "#000000b0"}}>
            <DialogContentText id="alert-dialog-description" style={{textAlign: "center", color: "#ffff" , fontSize: "x-large"}}>
              <p ><CheckCircleIcon style={{fontSize: "-webkit-xxx-large;"}}></CheckCircleIcon></p>
              <p>
                Thank You {" "}
                {/* <span>
                  <CheckCircleOutlineIcon style={{ color: "blue", variant: "filled" }} />
                </span> */}
              </p>
              {/* <p>
                The File sent successfully !!<span style={{ padding: "5px", color: "blue" }}></span> 
              </p> */}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handalfinal} autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>

        </Row>
      </Row>
    </Card>
  );
};

export default ScrutinyFormcontainer;
