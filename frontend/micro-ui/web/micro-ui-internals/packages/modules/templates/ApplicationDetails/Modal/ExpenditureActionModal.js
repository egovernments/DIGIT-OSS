import { Loader, Modal, FormComposer, WorkflowModal } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect, Fragment } from "react";
import { configViewBillApproveModal, configViewBillRejectModal, configViewBillCheckModal } from "../config";
import _ from "lodash";

const Heading = (props) => {
  return <h1 className={props.className ? `heading-m ${props.className}` : "heading-m"}>{props.label}</h1>;
};

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const ExpenditureActionModal = ({ t, action, tenantId, state, id, closeModal, submitAction, actionData, applicationData, businessService, moduleCode,applicationDetails,workflowDetails }) => {

  let { loiNumber, estimateNumber } = Digit.Hooks.useQueryParams();
   const [config, setConfig] = useState({});
   const [defaultValues, setDefaultValues] = useState({});
   const [approvers, setApprovers] = useState([]);
   const [selectedApprover, setSelectedApprover] = useState({});
   
   const [department, setDepartment] = useState([]);
   const [selectedDept,setSelectedDept] = useState({})

   const [designation, setDesignation] = useState([]);
   const [selectedDesignation,setSelectedDesignation] = useState({})

   const mdmsConfig = {
    moduleName: "common-masters",
    department : {
      masterName: "Department",
      localePrefix: "COMMON_MASTERS_DEPARTMENT",
    },
    designation : {
      masterName: "Designation",
      localePrefix: "COMMON_MASTERS_DESIGNATION",
    }
   }

  const { isLoading: mdmsLoading, data: mdmsData,isSuccess:mdmsSuccess } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getStateId(),
    mdmsConfig?.moduleName,
    [{name : mdmsConfig?.designation?.masterName}, {name : mdmsConfig?.department?.masterName}, {name : mdmsConfig?.rejectReasons?.masterName}],
    {
      select: (data) => {
        let designationData = _.get(data, `${mdmsConfig?.moduleName}.${mdmsConfig?.designation?.masterName}`, []);
        designationData =  designationData.filter((opt) => opt?.active).map((opt) => ({ ...opt, name: `${mdmsConfig?.designation?.localePrefix}_${opt.code}` }));
        designationData?.map(designation => {designation.i18nKey = designation?.name})

        let departmentData = _.get(data, `${mdmsConfig?.moduleName}.${mdmsConfig?.department?.masterName}`, []);
        departmentData =  departmentData.filter((opt) => opt?.active).map((opt) => ({ ...opt, name: `${mdmsConfig?.department?.localePrefix}_${opt.code}` }));
        departmentData?.map(department => { department.i18nKey = department?.name})

        return {designationData, departmentData};
      },
      enabled: mdmsConfig?.moduleName ? true : false,
    }
  );
  useEffect(() => {
    setDepartment(mdmsData?.departmentData)
    setDesignation(mdmsData?.designationData)
  }, [mdmsData]);


  
  const { isLoading: approverLoading, isError, error, data: employeeDatav1 } = Digit.Hooks.hrms.useHRMSSearch({ designations: selectedDesignation?.code, departments: selectedDept?.code, roles: action?.assigneeRoles?.toString(), isActive: true }, Digit.ULBService.getCurrentTenantId(), null, null, { enabled: action?.action === "CHECK" || action?.action === "TECHNICALSANCATION"});


  employeeDatav1?.Employees.map(emp => emp.nameOfEmp = emp?.user?.name || "NA")
  
  useEffect(() => {
    setApprovers(employeeDatav1?.Employees?.length > 0 ? employeeDatav1?.Employees.filter(emp => emp?.nameOfEmp !== "NA") : [])
  }, [employeeDatav1])
  
  useEffect(() => {
    
    if(action?.action?.includes("CHECK")){
      setConfig(
        configViewBillCheckModal({
          t,
          action,
          businessService,
          approvers,
          selectedApprover,
          setSelectedApprover,
          designation,
          selectedDesignation,
          setSelectedDesignation,
          department,
          selectedDept,
          setSelectedDept,
          approverLoading
        })
      )
    }else if(action?.action?.includes("APPROVE")){
      setConfig(
        configViewBillApproveModal({
          t,
          action
        })
      )
    }
    else if(action?.action?.includes("REJECT")){
      setConfig(
        configViewBillRejectModal({
          t,
          action,
        })
      )
    }
  }, [approvers,designation,department]);

  const dummy_exp_response = {
    CHECK : {
      header: "Bill Forwarded Successfully",
      id: "Bill/2021-22/09/0001",
      info: "Bill ID",
      message: "Bill has been successfully created and forwarded for approval.",
      responseData:{},
      requestData:{}, 
      links : []
    },
    REJECT :  {
      header: "Bill Rejected Successfully",
      id: "Bill/2021-22/09/0001",
      info: "Bill ID",
      message: "Bill has been Rejected.",
      responseData:{},
      requestData:{}, 
      links : []
    },
    APPROVE : {
      header: "Bill Approved Successfully",
      id: "Bill/2021-22/09/0001",
      info: "Bill ID",
      message: "Bill has been approved",
      responseData:{},
      requestData:{}, 
      links : []
    }
  }

  
  function submit (_data) {
    const workflow = {
      action: action?.action,
      comment: _data?.comments,
      response : dummy_exp_response,
      type : "bills",
      assignees: selectedApprover?.uuid ? [selectedApprover?.uuid] : undefined
    }
    submitAction({workflow});
  }

  const cardStyle = () => {
    if(config.label.heading === "Processing Details") {
      return {
        "padding" : "0px"
      }
    }
    return {}
  }

  return (
    <>
     {
        action && config?.form ? 
            <WorkflowModal 
                closeModal={closeModal}
                onSubmit={submit}
                config={config}>
            </WorkflowModal> : 
        mdmsLoading ? 
            <Loader></Loader> : null
     }
  </>)
}

export default ExpenditureActionModal