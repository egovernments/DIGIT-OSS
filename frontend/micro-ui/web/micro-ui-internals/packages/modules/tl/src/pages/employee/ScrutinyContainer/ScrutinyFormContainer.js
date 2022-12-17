import axios from "axios";
import { size } from "lodash";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Card, Row, Col } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useHistory, useParams } from "react-router-dom";
import ApplicationDetailsActionBar from "../../../../../templates/ApplicationDetails/components/ApplicationDetailsActionBar";
import ActionModal from "../../../../../templates/ApplicationDetails/Modal";
// import { commoncolor, primarycolor } from "../../constants";
import ScrutitnyForms from "../ScrutinyBasic/ScutinyBasic";
// import { useSearchParams } from "react-router-dom";

const ScrutinyFormcontainer = (props) => {
  // const [ApplicantFormshow, SetApplicantForm] = useState(true);
  // const [PurposeFormshow, SetPurposeForm] = useState(false);
  // const [LandScheduleFormshow, SetLandScheduleForm] = useState(false);
  // const [AppliedDetailsFormshow, SetAppliedDetailsForm] = useState(false);
  // const [FeesChargesFormshow, SetFeesChargesForm] = useState(false);

  const { id } = useParams();

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
  const [businessService, setBusinessService] = useState("NewTL");
  const [moduleCode, setModuleCode] = useState("TL");
  const [scrutinyDetails, setScrutinyDetails] = useState();
  const [applicationNumber, setApplicationNumber] = useState("");
  const [applicationDetails, setApplicationDetails] = useState();
  const [workflowDetails, setWorkflowDetails] = useState();

  const getScrutinyData = async () => {
    try {
      const Resp = await axios.get(`/tl-services/new/licenses/_get?id=${id}`).then((response) => {
        return response?.data;
      });
      console.log("Response From API1", Resp);
      setScrutinyDetails(Resp);
      setApplicationNumber(Resp?.applicationNumber);
      // setApplicationNumber("HR-TL-2022-12-07-000498");
    } catch (error) {
      console.log(error);
    }
  };

  let EditRenewalApplastModifiedTime = Digit.SessionStorage.get("EditRenewalApplastModifiedTime");

  let workflowDetailsTemp = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: applicationNumber,
    moduleCode: businessService,
    role: "TL_CEMP",
    config: { EditRenewalApplastModifiedTime: EditRenewalApplastModifiedTime },
  });

  const { isLoading, isError, data: applicationDetailsTemp, error } = Digit.Hooks.tl.useApplicationDetail(t, tenantId, applicationNumber);

  const {
    // isLoading: updatingApplication,
    // isError: updateApplicationError,
    // data: updateResponse,
    // error: updateError,
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

  const queryClient = useQueryClient();

  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
  };

  const closeWarningPopup = () => {
    setWarningPopUp(false);
  };

  const submitAction = async (data, nocData = false, isOBPS = {}) => {
    console.log("log123...upDate", data, nocData, isOBPS);
    setIsEnableLoader(true);
    if (typeof data?.customFunctionToExecute === "function") {
      data?.customFunctionToExecute({ ...data });
    }
    if (nocData !== false && nocMutation) {
      const nocPrmomises = nocData?.map((noc) => {
        return nocMutation?.mutateAsync(noc);
      });
      try {
        setIsEnableLoader(true);
        const values = await Promise.all(nocPrmomises);
        values &&
          values.map((ob) => {
            Digit.SessionStorage.del(ob?.Noc?.[0]?.nocType);
          });
      } catch (err) {
        setIsEnableLoader(false);
        let errorValue = err?.response?.data?.Errors?.[0]?.code
          ? t(err?.response?.data?.Errors?.[0]?.code)
          : err?.response?.data?.Errors?.[0]?.message || err;
        closeModal();
        setShowToast({ key: "error", error: { message: errorValue } });
        setTimeout(closeToast, 5000);
        return;
      }
    }
    if (mutate) {
      setIsEnableLoader(true);
      console.log("log123...mutate", mutate);
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

    closeModal();
  };

  useEffect(() => {
    console.log("log123...", applicationDetailsTemp);
    if (applicationDetailsTemp) {
      setApplicationDetails(applicationDetailsTemp);
    }
  }, [applicationDetailsTemp]);

  useEffect(() => {
    console.log("log123...", id, workflowDetailsTemp, applicationNumber, scrutinyDetails, applicationDetails);
    if (workflowDetailsTemp?.data?.applicationBusinessService) {
      setWorkflowDetails(workflowDetailsTemp);
      setBusinessService(workflowDetailsTemp?.data?.applicationBusinessService);
    }
  }, [workflowDetailsTemp?.data]);

  useEffect(() => {
    getScrutinyData();
  }, []);

  return (
    <Card>
      {/* <Row style={{ top: 25, padding: 5 }}>
        <div className="ml-auto">
          <h2>Application : 181</h2>
        </div>
      </Row> */}
      <Row style={{ top: 30, padding: 10 }}>
        <ScrutitnyForms apiResponse={scrutinyDetails} applicationNumber={applicationNumber} refreshScrutinyData={getScrutinyData}></ScrutitnyForms>
      </Row>
      <Row style={{ top: 30, padding: "10px 22px" }}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Card>
            <Card.Header style={{ fontSize: "17px", lineHeight: "18px", margin: "0px 15px" }}>
              <Card.Title className="m-0" style={{ fontFamily: "Roboto", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
                Summary
              </Card.Title>
            </Card.Header>
            <Col xs={12} md={12}>
              <Form.Label style={{ margin: 5 }}></Form.Label>
              <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                placeholder="Enter the Final Comments"
                autoFocus
                // onChange={(e) => {
                //   setDeveloperRemarks({ data: e.target.value });

                // }}
                rows="3"
              />
            </Col>
          </Card>
          {/* <div class="card">
            <h5 class="card-header">Featured</h5>
            <div class="card-body">
              <h5 class="card-title">Special title treatment</h5>
              <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
              <a href="#" class="btn btn-primary">
                Go somewhere
              </a>
            </div>
          </div> */}
        </Form.Group>
        {/* <div class="col-md-6 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
          <Button style={{ textAlign: "right" }}>Submit</Button>
        </div> */}
        <Row>
          <div class="col-md-2 bg-light text-left" style={{ position: "relative", marginBottom: 30 }}>
            <Button style={{ textAlign: "right" }}>Attach Documents</Button>
          </div>
          <div class="col-md-10 bg-light text-right" style={{ position: "relative", marginBottom: 30 }}>
            {/* <Button style={{ textAlign: "right" }} value="Submit" id="Submit" onChange1={handleChange} name="Submit" onClick={handleshow19}>Submit</Button> */}

            {showModal ? (
              <ActionModal
                t={t}
                action={selectedAction}
                tenantId={tenantId}
                state={state}
                id={applicationNumber}
                applicationDetails={applicationDetails}
                applicationData={applicationDetails?.applicationData}
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
            {/* <ApplicationDetailsToast t={t} showToast={showToast} closeToast={closeToast} businessService={businessService} /> */}
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
        </Row>
        <Row>
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
      </Row>
    </Card>
  );
};

export default ScrutinyFormcontainer;
