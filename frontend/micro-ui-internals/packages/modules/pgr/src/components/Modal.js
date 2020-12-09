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
} from "@egovernments/digit-ui-react-components";
import useEmployeeFilter from "../hooks/useEmployeeFilter";
const Modal = (props) => {
  const roles = props.employeeRoles.filter((role) => role.action === props.selectedAction);
  console.log("modalllll", roles);
  const useEmployeeData = useEmployeeFilter("pb.amritsar", roles[0].roles);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [comments, setComments] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  console.log("modal", useEmployeeData);
  const employeeData = useEmployeeData
    ? useEmployeeData.map((departmentData) => {
        return { heading: departmentData.department, options: departmentData.employees };
      })
    : null;

  // const uploadFile = useCallback( () => {

  //   }, [file]);

  useEffect(async () => {
    if (file) {
      const response = await Digit.UploadServices.Filestorage(file);
      setUploadedFile(response.data.files[0].fileStoreId);
    }
  }, file);

  function onSelectEmployee(employee) {
    setSelectedEmployee(employee);
  }

  function addComment(e) {
    setComments(e.target.value);
  }

  function selectfile(e) {
    setFile(e.target.files[0]);
  }

  return (
    <PopUp>
      <div className="popup-module">
        <HeaderBar main={props.headerBarMain} end={props.headerBarEnd} />
        <div className="popup-module-main">
          <Card>
            {props.selectedAction === "REJECT" || props.selectedAction === "RESOLVE" ? null : (
              <React.Fragment>
                <CardLabel>Employee Name</CardLabel>
                {employeeData && (
                  <SectionalDropdown selected={selectedEmployee} menuData={employeeData} displayKey="name" select={onSelectEmployee} />
                )}
              </React.Fragment>
            )}
            <CardLabel>Comments</CardLabel>
            <TextArea onChange={addComment} />
            <CardLabel>Supporting Documents</CardLabel>
            <CardLabelDesc>Only .jpg and .pdf files. 5 MB max file size.</CardLabelDesc>
            <UploadFile accept=".jpg , .pdf" onUpload={selectfile} message={uploadedFile ? "1 File Uploaded" : "No File Uploaded"} />
          </Card>
          <div className="popup-module-action-bar">
            <ButtonSelector theme="border" label="Cancel" onSubmit={() => props.onCancel()} />
            <ButtonSelector
              label="Assign"
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
