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
  Loader,
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { usePGRService } from "../Services";

const Modal = (props) => {
  const roles = props.employeeRoles.filter((role) => role.action === props.selectedAction);
  const { complaintDetails } = props;
  const pgr = usePGRService();
  const { isLoading: employeeDataLoading, error, data: useEmployeeData, revalidate: employeeRevalidate } = pgr.useQuery(
    pgr.getEmployeeForAssignment,
    ["pb.amritsar", roles[0].roles, complaintDetails]
  );
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [comments, setComments] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const { t } = useTranslation();

  const fileData = pgr.useFileUpload(file);

  const employeeData =
    useEmployeeData && !employeeDataLoading
      ? useEmployeeData.map((departmentData) => {
          return { heading: departmentData.department, options: departmentData.employees };
        })
      : [];

  function onSelectEmployee(employee) {
    setSelectedEmployee(employee);
  }

  function addComment(e) {
    setComments(e.target.value);
  }

  function selectfile(e) {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    if (fileData.data) {
      setUploadedFile(fileData.data?.data.files[0].fileStoreId);
    }
  }, [fileData.isSuccess]);

  if (employeeDataLoading) {
    return (
      <PopUp>
        <div className="popup-module">
          <Loader />
        </div>
      </PopUp>
    );
  }
  return (
    <PopUp>
      <div className="popup-module">
        <HeaderBar main={props.headerBarMain} end={props.headerBarEnd} />
        <div className="popup-module-main">
          <Card>
            {props.selectedAction === "REJECT" || props.selectedAction === "RESOLVE" ? null : (
              <React.Fragment>
                <CardLabel>{t("CS_COMMON_EMPLOYEE_NAME")}</CardLabel>
                {employeeData && (
                  <SectionalDropdown selected={selectedEmployee} menuData={employeeData} displayKey="name" select={onSelectEmployee} />
                )}
              </React.Fragment>
            )}
            <CardLabel>{t("CS_COMMON_EMPLOYEE_COMMENTS")}</CardLabel>
            <TextArea onChange={addComment} />
            <CardLabel>{t("CS_ACTION_SUPPORTING_DOCUMENTS")}</CardLabel>
            <CardLabelDesc>{t(`TL_UPLOAD_RESTRICTIONS`)}</CardLabelDesc>
            <UploadFile
              accept=".jpg"
              onUpload={selectfile}
              message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
            />
          </Card>
          <div className="popup-module-action-bar">
            <ButtonSelector theme="border" label={t("CS_COMMON_CANCEL")} onSubmit={() => props.onCancel()} />
            <ButtonSelector
              label={t("CS_COMMON_ASSIGN")}
              onSubmit={() => {
                console.log(selectedEmployee, comments, uploadedFile);
                props.onAssign(selectedEmployee, comments, uploadedFile);
              }}
            />
          </div>
        </div>
      </div>
    </PopUp>
  );
};

export default Modal;
