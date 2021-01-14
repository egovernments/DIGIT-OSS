import React, { useEffect, useState, useCallback } from "react";
import {
  PopUp,
  HeaderBar,
  Card,
  CardLabel,
  SectionalDropdown,
  TextArea,
  CardLabelDesc,
  UploadFile,
  ButtonSelector,
  Toast,
  Dropdown,
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
const Modal = (props) => {
  const roles = props.employeeRoles.filter((role) => role.action === props.selectedAction);
  const { complaintDetails } = props;
  console.log("modalllll", roles);
  const tenantId = window.Digit.SessionStorage.get("Employee.tenantId");
  const useEmployeeData = Digit.Hooks.pgr.useEmployeeFilter(tenantId, roles[0].roles, complaintDetails);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [comments, setComments] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const cityDetails = Digit.ULBService.getCurrentUlb();
  const [selectedReopenReason, setSelectedReopenReason] = useState(null);

  console.log("modal", useEmployeeData);
  const employeeData = useEmployeeData
    ? useEmployeeData.map((departmentData) => {
        return { heading: departmentData.department, options: departmentData.employees };
      })
    : null;
  const reopenReasonMenu = [t(`CS_REOPEN_OPTION_ONE`), t(`CS_REOPEN_OPTION_TWO`), t(`CS_REOPEN_OPTION_THREE`), t(`CS_REOPEN_OPTION_FOUR`)];
  // const uploadFile = useCallback( () => {

  //   }, [file]);

  useEffect(async () => {
    setError(null);
    if (file) {
      if (file.size >= 5242880) {
        setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
      } else {
        try {
          // TODO: change module in file storage
          const response = await Digit.UploadServices.Filestorage("property-upload", file, cityDetails.code);
          if (response?.data?.files?.length > 0) {
            setUploadedFile(response?.data?.files[0]?.fileStoreId);
          } else {
            setError(t("CS_FILE_UPLOAD_ERROR"));
          }
        } catch (err) {
          console.error("Modal -> err ", err);
          setError(t("CS_FILE_UPLOAD_ERROR"));
        }
      }
    }
  }, [file]);

  function onSelectEmployee(employee) {
    setSelectedEmployee(employee);
  }

  function addComment(e) {
    setComments(e.target.value);
  }

  function selectfile(e) {
    setFile(e.target.files[0]);
  }

  function onSelectReopenReason(reason) {
    setSelectedReopenReason(reason);
  }

  return (
    <PopUp>
      <div className="popup-module">
        <HeaderBar main={props.headerBarMain} end={props.headerBarEnd} />
        <div className="popup-module-main">
          <Card>
            {props.selectedAction === "REJECT" || props.selectedAction === "RESOLVE" || props.selectedAction === "REOPEN" ? null : (
              <React.Fragment>
                <CardLabel>{t("CS_COMMON_EMPLOYEE_NAME")}</CardLabel>
                {employeeData && (
                  <SectionalDropdown selected={selectedEmployee} menuData={employeeData} displayKey="name" select={onSelectEmployee} />
                )}
              </React.Fragment>
            )}
            {props.selectedAction === "REOPEN" ? (
              <React.Fragment>
                <CardLabel>{t("CS_REOPEN_COMPLAINT")}</CardLabel>
                <Dropdown selected={selectedReopenReason} option={reopenReasonMenu} select={onSelectReopenReason} />
              </React.Fragment>
            ) : null}
            <CardLabel>{t("CS_COMMON_EMPLOYEE_COMMENTS")}</CardLabel>
            <TextArea name="comment" onChange={addComment} value={comments} />
            <CardLabel>{t("CS_ACTION_SUPPORTING_DOCUMENTS")}</CardLabel>
            <CardLabelDesc>{t(`TL_UPLOAD_RESTRICTIONS`)}</CardLabelDesc>
            <UploadFile
              accept=".jpg"
              onUpload={selectfile}
              onDelete={() => {
                setUploadedFile(null);
              }}
              message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
            />
          </Card>
          <div className="popup-module-action-bar">
            <ButtonSelector theme="border" label={t("CS_COMMON_CANCEL")} onSubmit={() => props.onCancel()} />
            <ButtonSelector
              label={props.actionLabel}
              onSubmit={() => {
                console.log(selectedEmployee, comments, uploadedFile);
                props.onAssign(selectedEmployee, comments, uploadedFile);
              }}
            />
          </div>
        </div>
      </div>
      {error && <Toast label={error} onClose={() => setError(null)} error />}
    </PopUp>
  );
};

export default Modal;
