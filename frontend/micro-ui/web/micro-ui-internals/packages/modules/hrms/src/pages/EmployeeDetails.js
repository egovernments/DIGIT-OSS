import { ActionBar, Card, CardSubHeader, DocumentSVG, Header, Loader, Menu, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import ActionModal from "../components/Modal";
import { convertEpochFormateToDate, pdfDownloadLink } from "../components/Utils";

const Details = () => {
  const activeworkflowActions = ["DEACTIVATE_EMPLOYEE_HEAD", "COMMON_EDIT_EMPLOYEE_HEADER"];
  const deactiveworkflowActions = ["ACTIVATE_EMPLOYEE_HEAD"];
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const { id: employeeId } = useParams();
  const { tenantId: tenantId } = useParams()
  const history = useHistory();
  const [displayMenu, setDisplayMenu] = useState(false);
  const isupdate = Digit.SessionStorage.get("isupdate");
  const { isLoading, isError, error, data, ...rest } = Digit.Hooks.hrms.useHRMSSearch({ codes: employeeId }, tenantId, null, isupdate);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_ERROR_DATA", false);
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_HRMS_MUTATION_SUCCESS_DATA", false);
  const isMobile = window.Digit.Utils.browser.isMobile();

  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  function onActionSelect(action) {
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
  };
  const handleDownload = async (document) => {
    const res = await Digit.UploadServices.Filefetch([document?.documentId], Digit.ULBService.getStateId());
    let documentLink = pdfDownloadLink(res.data, document?.documentId);
    window.open(documentLink, "_blank");
  };

  const submitAction = (data) => { };

  useEffect(() => {
    switch (selectedAction) {
      case "DEACTIVATE_EMPLOYEE_HEAD":
        return setShowModal(true);
      case "ACTIVATE_EMPLOYEE_HEAD":
        return setShowModal(true);
      case "COMMON_EDIT_EMPLOYEE_HEADER":
        return history.push(`/digit-ui/employee/hrms/edit/${tenantId}/${employeeId}`);
      default:
        break;
    }
  }, [selectedAction]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <div style={isMobile ? {marginLeft: "-12px", fontFamily: "calibri", color: "#FF0000"} :{ marginLeft: "15px", fontFamily: "calibri", color: "#FF0000" }}>
        <Header>{t("HR_NEW_EMPLOYEE_FORM_HEADER")}</Header>
      </div>
      {!isLoading && data?.Employees.length > 0 ? (
        <div>
          <Card>
            <StatusTable>
              <Row
                label={<CardSubHeader className="card-section-header">{t("HR_EMP_STATUS_LABEL")} </CardSubHeader>}
                text={
                  data?.Employees?.[0]?.isActive ? <div className="sla-cell-success"> {t("ACTIVE")} </div> : <div className="sla-cell-error">{t("INACTIVE")}</div>
                }
                textStyle={{ fontWeight: "bold", maxWidth: "6.5rem" }}
              />
            </StatusTable>
            <CardSubHeader className="card-section-header">{t("HR_PERSONAL_DETAILS_FORM_HEADER")} </CardSubHeader>
            <StatusTable>
              <Row label={t("HR_NAME_LABEL")} text={data?.Employees?.[0]?.user?.name || "NA"} textStyle={{ whiteSpace: "pre" }} />
              <Row label={t("HR_MOB_NO_LABEL")} text={data?.Employees?.[0]?.user?.mobileNumber || "NA"} textStyle={{ whiteSpace: "pre" }} />
              <Row label={t("HR_GENDER_LABEL")} text={t(data?.Employees?.[0]?.user?.gender) || "NA"} />
              <Row label={t("HR_EMAIL_LABEL")} text={data?.Employees?.[0]?.user?.emailId || "NA"} />
              <Row label={t("HR_CORRESPONDENCE_ADDRESS_LABEL")} text={data?.Employees?.[0]?.user?.correspondenceAddress || "NA"} />
            </StatusTable>
            <CardSubHeader className="card-section-header">{t("HR_NEW_EMPLOYEE_FORM_HEADER")}</CardSubHeader>
            <StatusTable>
              <Row label={t("HR_EMPLOYMENT_TYPE_LABEL")} text={t(data?.Employees?.[0]?.employeeType ? `EGOV_HRMS_EMPLOYEETYPE_${data?.Employees?.[0]?.employeeType}` : "NA")} textStyle={{ whiteSpace: "pre" }} />
              <Row
                label={t("HR_APPOINTMENT_DATE_LABEL")}
                text={convertEpochFormateToDate(data?.Employees?.[0]?.dateOfAppointment) || "NA"}
                textStyle={{ whiteSpace: "pre" }}
              />
              <Row label={t("HR_EMPLOYEE_ID_LABEL")} text={data?.Employees?.[0]?.code} />
            </StatusTable>
            {data?.Employees?.[0]?.isActive == false ? (
              <StatusTable>
                <Row
                  label={t("HR_EFFECTIVE_DATE")}
                  text={convertEpochFormateToDate(
                    data?.Employees?.[0]?.deactivationDetails?.sort((a, b) => new Date(a.effectiveFrom) - new Date(b.effectiveFrom))[0]?.effectiveFrom
                  )}
                />
                <Row
                  label={t("HR_DEACTIVATION_REASON")}
                  text={
                    t("EGOV_HRMS_DEACTIVATIONREASON_" + data?.Employees?.[0]?.deactivationDetails?.sort((a, b) => new Date(a.effectiveFrom) - new Date(b.effectiveFrom))[0]
                      .reasonForDeactivation) || "NA"
                  }
                />
                  <Row
                  label={t("HR_REMARKS")}
                  text={
                   data?.Employees?.[0]?.deactivationDetails?.sort((a, b) => new Date(a.effectiveFrom) - new Date(b.effectiveFrom))[0].remarks || "NA"
                  }
                />
                
                <Row
                  label={t("HR_ORDER_NO")}
                  text={data?.Employees?.[0]?.deactivationDetails?.sort((a, b) => new Date(a.effectiveFrom) - new Date(b.effectiveFrom))[0]?.orderNo || "NA"}
                />
              </StatusTable>
            ) : null}

            {data?.Employees?.[0]?.documents ? <StatusTable style={{ marginBottom: "40px" }}>
              <Row label={t("TL_APPROVAL_UPLOAD_HEAD")} text={""} />
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {data?.Employees?.[0]?.documents?.map((document, index) => {
                  return (
                    <a onClick={() => handleDownload(document)} style={{ minWidth: "160px", marginRight: "20px" }} key={index}>
                      <DocumentSVG width={85} height={100} style={{ background: "#f6f6f6", padding: "8px", marginLeft: "15px" }} />
                      <p style={{ marginTop: "8px", maxWidth: "196px", }}>{document.documentName}</p>
                    </a>
                  );
                })}
              </div>
            </StatusTable>
              : null}
            {data?.Employees?.[0]?.jurisdictions.length > 0 ? (
              <CardSubHeader className="card-section-header">{t("HR_JURIS_DET_HEADER")}</CardSubHeader>
            ) : null}

            {data?.Employees?.[0]?.jurisdictions?.length > 0
              ? data?.Employees?.[0]?.jurisdictions.map((element, index) => {
                return (
                  <StatusTable
                    key={index}
                    style={{
                      maxWidth: "640px",
                      border: "1px solid rgb(214, 213, 212)",
                      inset: "0px",
                      width: "auto",
                      padding: ".2rem",
                      marginBottom: "2rem",
                    }}
                  >
                    <div style={{ paddingBottom: "2rem" }}>
                      {" "}
                      {t("HR_JURISDICTION")} {index + 1}
                    </div>
                    <Row label={t("HR_HIERARCHY_LABEL")} text={t(element?.hierarchy ? `EGOV_LOCATION_TENANTBOUNDARY_${element?.hierarchy}` : "NA")} textStyle={{ whiteSpace: "pre" }} />
                    <Row label={t("HR_BOUNDARY_TYPE_LABEL")} text={t(Digit.Utils.locale.convertToLocale(element?.boundaryType, 'EGOV_LOCATION_BOUNDARYTYPE'))} textStyle={{ whiteSpace: "pre" }} />
                    <Row label={t("HR_BOUNDARY_LABEL")} text={t(element?.boundary)} />
                    <Row
                      label={t("HR_ROLE_LABEL")}
                      text={data?.Employees?.[0]?.user.roles.filter((ele) => ele.tenantId == element?.boundary).map((ele) => t(`ACCESSCONTROL_ROLES_ROLES_` + ele?.code))}
                    />
                  </StatusTable>
                );
              })
              : null}
            {data?.Employees?.[0]?.assignments.length > 0 ? (
              <CardSubHeader className="card-section-header">{t("HR_ASSIGN_DET_HEADER")}</CardSubHeader>
            ) : null}
            {data?.Employees?.[0]?.assignments.map((element, index) => (
              <StatusTable
                key={index}
                style={{
                  maxWidth: "640px",
                  border: "1px solid rgb(214, 213, 212)",
                  inset: "0px",
                  width: "auto",
                  padding: ".2rem",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ paddingBottom: "2rem" }}>
                  {t("HR_ASSIGNMENT")} {index + 1}
                </div>
                <Row label={t("HR_ASMT_FROM_DATE_LABEL")} text={convertEpochFormateToDate(element?.fromDate)} textStyle={{ whiteSpace: "pre" }} />
                <Row
                  label={t("HR_ASMT_TO_DATE_LABEL")}
                  text={element?.isCurrentAssignment ? "Currently Working Here" : convertEpochFormateToDate(element?.toDate)}
                  textStyle={{ whiteSpace: "pre" }}
                />
                <Row label={t("HR_DEPT_LABEL")} text={t("COMMON_MASTERS_DEPARTMENT_" + element?.department)} />
                <Row label={t("HR_DESG_LABEL")} text={t("COMMON_MASTERS_DESIGNATION_" + element?.designation)} />
              </StatusTable>
            ))}
          </Card>
        </div>
      ) : null}
      {showModal ? (
        <ActionModal t={t} action={selectedAction} tenantId={tenantId} applicationData={data} closeModal={closeModal} submitAction={submitAction} />
      ) : null}
      <ActionBar>
        {displayMenu && data ? (
          <Menu
            localeKeyPrefix="HR"
            options={data?.Employees?.[0]?.isActive ? activeworkflowActions : deactiveworkflowActions}
            t={t}
            onSelect={onActionSelect}
          />
        ) : null}
        <SubmitBar label={t("HR_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
      </ActionBar>
    </React.Fragment>
  );
};

export default Details;
