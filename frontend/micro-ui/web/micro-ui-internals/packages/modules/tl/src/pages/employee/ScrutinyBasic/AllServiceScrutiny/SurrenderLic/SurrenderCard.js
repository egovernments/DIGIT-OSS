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
import SurrenderBasic from "./SurrenderBasic";

const SurrenderScrutiny = (props) => {
  const { id } = useParams();

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
  const [isWarningPop, setWarningPopUp] = useState(false);
  const [showhide19, setShowhide19] = useState("true");
  const [businessService, setBusinessService] = useState("SURREND_OF_LICENSE");
  const [moduleCode, setModuleCode] = useState("TL");
  const [scrutinyDetails, setScrutinyDetails] = useState();
  // const [applicationNumber,setApplicationNumber] = useState("");
  const [applicationDetails, setApplicationDetails] = useState();
  const [workflowDetails, setWorkflowDetails] = useState();
  const [applicationData, setApplicationData] = useState();
  const [additionalDetails, setAdditionalDetails] = useState({});
  const [loiNumberSet, setLOINumberSet] = useState("");
  const [edcDataTreade, setEdcDataTreade] = useState("");
  const [idwDataTreade, setIdwDataTreade] = useState("");
  const [applicationStatus,setApplicationStatus] = useState();

  //   const authToken = Digit.UserService.getUser()?.access_token || null;

  // const [showhide19, setShowhide19] = useState("true");
  const handleshow19 = (e) => {
    const getshow = e.target.value;
    setShowhide19(getshow);
  };
  const handleChange = (e) => {
    this.setState({ isRadioSelected: true });
  };

  const getScrutinyData = async () => {
    console.log("log123... userInfo", authToken);
    let requestInfo = {
      RequestInfo: {
        api_id: "1",
        ver: "1",
        ts: null,
        action: "create",
        did: "",
        key: "",
        msg_id: "",
        requester_id: "",
        authToken: authToken,
        userInfo: userInfo
      },
    };
    try {
      const Resp = await axios.post(`/tl-services/SurrendOfLicenseRequest/_search?applicationNumber=${id}`, requestInfo).then((response) => {
        return response?.data;
      });
        console.log("Response From API1", Resp, Resp?.surrendOfLicense);
      setScrutinyDetails(Resp?.surrendOfLicense?.[0]);

      console.log("devDel1234", Resp?.surrendOfLicense?.[0]);
      const loiNumber = Resp?.surrendOfLicense?.[0]?.loiNumber;
      setApplicationData(Resp?.surrendOfLicense?.[0]);
      setApplicationStatus(Resp?.surrendOfLicense?.[0]?.status);
      setApplicationDetails({
        applicationData: Resp?.surrendOfLicense?.[0],
        workflowCode: Resp?.surrendOfLicense?.[0].businessService,
      });
      // console.log("Loi1234787", userInfo );
      // console.log("Loi1234", loiNumber );
      const loiRequest = {
        requestInfo: {
          api_id: "Rainmaker",
          ver: "1",
          ts: 0,
          action: "_search",
          did: "",
          key: "",
          msg_id: "090909",
          requesterId: "",
          authToken: authToken,
          userInfo: userInfo,
        },
      };

      const Resploi = await axios.post(`/tl-services/v1/_search?loiNumber=${loiNumber}`, loiRequest);
      // console.log("Afterloi", Resploi );
      console.log("EDCR1234", Resploi?.data?.Licenses?.[0]?.tradeLicenseDetail?.EDC);
      setEdcDataTreade(Resploi?.data?.Licenses?.[0]?.tradeLicenseDetail?.EDC);
      setIdwDataTreade(Resploi?.data?.Licenses?.[0]?.tradeLicenseDetail?.IDW);

      // setScrutinyDetails(Resp?.surrendOfLicense?.[0]);

      console.log(setIdwDataTreade);
      // setApplicationData(Resp?.surrendOfLicense?.[0]);
    } catch (error) {
      console.log(error);
    }
  };

  let EditRenewalApplastModifiedTime = Digit.SessionStorage.get("EditRenewalApplastModifiedTime");

  let workflowDetailsTemp = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: id,
    moduleCode: businessService,
    role: "TL_CEMP",
    config: { EditRenewalApplastModifiedTime: EditRenewalApplastModifiedTime },
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
      if (action?.isWarningPopUp) {
        setWarningPopUp(true);
      } else if (action?.redirectionUrll) {
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
  // console.log("logger log1223", action)
  const queryClient = useQueryClient();

  // const closeModal = () => {
  //   setOpen(false)
  //   window.location.href = `/digit-ui/citizen`
  // }
  // const closeModal = () => {
  //   setSelectedAction(null);
  //   setShowModal(false);
  // };

  const closeModal = () => {
    // setTimeout(() => {
      setSelectedAction(null);
      setShowModal(false);
    //   window.location.href = `/digit-ui/employee/tl/servicePlanInbox`;
    // }, 3000);
  };

  const closeWarningPopup = () => {
    setWarningPopUp(false);
  };

  const submitAction = async (data = {}, nocData = false, isOBPS = {}) => {
    let tempdata = data || {};
    tempdata.surrendOfLicense[0].additionalDetails = additionalDetails;
    console.log("logger log1223", tempdata);

    try {
      let body = {
        ...tempdata,

        RequestInfo: {
          api_id: "Rainmaker",
          ver: "1",
          ts: null,
          action: "create",
          did: "",
          key: "",
          msg_id: "",
          requester_id: "",
          authToken: authToken,
        },
      };
      console.log("logger log1223 body", body);
      const response = await axios.post("/tl-services/SurrendOfLicenseRequest/_update", body);
      console.log("Update API Response ====> ", response.data);
      closeModal();
    } catch (error) {
      console.log("Update Error ===> ", error.message);
      closeModal();
    }
    // closeModal();
    // setTimeout(() => {
    //   setShowToast();
    //   window.location.href = `/digit-ui/employee/tl/servicePlanInbox`
    // }, 3000);
  };

  useEffect(() => {
    console.log("logService...wrkflw12", id, workflowDetailsTemp, scrutinyDetails, applicationDetails);
    // console.log("logService...wrkflw12",id,workflowDetailsTemp,scrutinyDetails,applicationDetails,processInstances)
    if (workflowDetailsTemp?.data?.applicationBusinessService) {
      setWorkflowDetails(workflowDetailsTemp);
      setBusinessService(workflowDetailsTemp?.data?.applicationBusinessService);
      console.log("Datapoint1", workflowDetailsTemp?.data?.processInstances);
      // setDataHistory("Datapoint" , workflowDetailsTemp?.data?.processInstances.map((array) => array.map((object))))
      //  = (e) => {
      //   const getshow = e.target.value;
      //   setShowhide19(getshow);
      console.log("Datapoint", workflowDetailsTemp?.data?.processInstances?.[0]);
      //   DetailsofAppliedLand?.dgpsDetails.map((array) => array.map((object) => `${object.latitude},${object.longitude}`).join(":") ).join("|")
      //   let query =  DetailsofAppliedLand?.dgpsDetails.map((array) => array.map((object) => `${object.latitude},${object.longitude}`).join(":") ).join("|")
      //   console.log("Qurey" , query);
      //   window.open(`/digit-ui/WNS/wmsmap.html?latlngs=${query}`,"popup")
      // };
    }
  }, [workflowDetailsTemp?.data]);

  useEffect(() => {
    console.log("ServicePlan12");
    getScrutinyData();
  }, []);

  return (
    <Card>
      <Card.Header class="fw-normal" style={{ top: 5, padding: 5, fontSize: 14, height: 90, lineHeight: 2 }}>
        <div className="row">
          <div className="col-md-3">
            {loiNumberSet}
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
        <SurrenderBasic
          apiResponse={scrutinyDetails}
          histeroyData={workflowDetailsTemp}
          applicationNumber={id}
          refreshScrutinyData={getScrutinyData}
          setAdditionalDetails={setAdditionalDetails}
          applicationStatus={applicationStatus}
        ></SurrenderBasic>
      </Row>
      {/* <Row style={{ top: 10, padding: "10px 22px" }}> */}
      <Row style={{ top: 10, padding: "10px 22px" }}>
        <Card>
          <Card.Header class="fw-normal" style={{ top: 5, padding: 5, fontSize: 20, height: 55, lineHeight: 2 }}>
            <p class="fw-normal text-center">Remarks History </p>
          </Card.Header>
        </Card>
      </Row>

      <Row>

        <div class="col-md-10 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          {showModal ? (
            <ActionModal
              t={t}
              action={selectedAction}
              tenantId={tenantId}
              state={state}
              id={id}
              applicationDetails={applicationDetails}
              applicationData={{
                ...applicationDetails?.applicationData,
                workflowCode: applicationDetails?.applicationData?.workflowCode || "SURREND_OF_LICENSE",
              }}
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
        {/* <Row> */}

        <div class="col-md-12 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          {/* <Button style={{ textAlign: "right" }}> <a href="http://localhost:3000/digit-ui/citizen/obps/Loi" >Generate LOI</a></Button> */}
          {/* <input type="radio" value="No" id="No" onChange1={handleChange} name="Yes" onClick={handleshow19} /> */}
        </div>
        {showhide19 === "Submit" && (
          <div>
            <Button style={{ textAlign: "right" }}>
              {" "}
              <a href="http://localhost:3000/digit-ui/employee/tl/Loi">Generate LOI</a>
            </Button>
          </div>
        )}
      </Row>
      {/* </Row> */}
    </Card>
  );
};

export default SurrenderScrutiny;
