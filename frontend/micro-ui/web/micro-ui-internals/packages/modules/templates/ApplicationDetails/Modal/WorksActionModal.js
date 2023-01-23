import { Loader, Modal, FormComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { configApproveModal, configRejectModal, configCheckModal } from "../config";

import cloneDeep from "lodash/cloneDeep";


const Heading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
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

const convertDateToEpochNew = (dateString, dayStartOrEnd = "dayend") => {
  //example input format : "2018-10-02"
  try {
    const parts = dateString.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    const DateObj = new Date(Date.UTC(parts[1], parts[3] - 1, parts[2]));

    DateObj.setMinutes(DateObj.getMinutes() + DateObj.getTimezoneOffset());
    if (dayStartOrEnd === "dayend") {
      DateObj.setHours(DateObj.getHours() + 24);
      DateObj.setSeconds(DateObj.getSeconds() - 1);
    }
    return DateObj.getTime();
  } catch (e) {
    return dateString;
  }
};


const WorksActionModal = ({ t, action, tenantId, state, id, closeModal, submitAction, actionData, applicationData, businessService, moduleCode,applicationDetails,workflowDetails }) => {
  //here according to the action selected render appropriate modal

  // const { data: approverData, isLoading: PTALoading } = Digit.Hooks.useEmployeeSearch(
  //   tenantId,
  //   {
  //     roles: action?.assigneeRoles?.map?.((e) => ({ code: e })),
  //     isActive: true,
  //   },
  //   { enabled: !action?.isTerminateState }
  // );
  let { loiNumber, estimateNumber } = Digit.Hooks.useQueryParams();
   const [config, setConfig] = useState({});
   const [approvers, setApprovers] = useState([]);
   const [selectedApprover, setSelectedApprover] = useState({});
   
   const [department, setDepartment] = useState([]);
   const [selectedDept,setSelectedDept] = useState({})

   const [rejectionReason, setRejectionReason] = useState([]);
   const [selectedReason,setSelectedReason] = useState([])

   const [designation, setDesignation] = useState([]);
   const [selectedDesignation,setSelectedDesignation] = useState({})

  //get approverDept,designation,approver(hrms),rejectionReason

  const rejectReasons = [
    {
      name: "Estimate Details are incorrect"
    },
    {
      name: "Financial Details are incorrect"
    },
    {
      name: "Agreement Details are incorrect"
    },
    {
      name: "Vendor Details are incorrect"
    },
    {
      name: "Attachments provided are wrong"
    },
    {
      name: "Others"
    },
  ]

  const { isLoading: mdmsLoading, data: mdmsData,isSuccess:mdmsSuccess } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getCurrentTenantId(),
    "common-masters",
    [
      {
        "name": "Designation"
      },
      {
        "name": "Department"
      }
    ]
  );

  mdmsData?.["common-masters"]?.Designation?.map(designation => {
    designation.i18nKey = `ES_COMMON_DESIGNATION_${designation?.name}`
  })

  mdmsData?.["common-masters"]?.Department?.map(department => {
    department.i18nKey = `ES_COMMON_${department?.code}`
  })
  // const { data: approverData, isLoading: approverLoading } = Digit.Hooks.useEmployeeSearch(
  //   tenantId,
  //   {
  //     roles: action?.assigneeRoles?.map?.((e) => ({ code: e })),
  //     isActive: true,
  //   },
  //   { enabled: !action?.isTerminateState }
  // );
    
  
  // const { isLoading: approverLoading, isError,isSuccess:approverSuccess, error, data: employeeDatav1 } = Digit.Hooks.hrms.useHRMSSearch({ Designation: selectedDesignation?.code, Department: selectedDept?.code }, Digit.ULBService.getCurrentTenantId(), null, null, { enabled: !!(selectedDept?.code && selectedDesignation?.code) });
  // employeeDatav1?.Employees.map(emp => emp.nameOfEmp = emp.user.name)

  
  // useEffect(() => {
    
  //   setApprovers(approverData?.Employees?.map((employee) => ({ uuid: employee?.uuid, name: employee?.user?.name })));
  // }, [approverData]);

  useEffect(() => {
    
    //setApprovers(approverData?.Employees?.map((employee) => ({ uuid: employee?.uuid, name: employee?.user?.name })));
    //setApprovers(employeeDatav1?.Employees?.length > 0 ? employeeDatav1?.Employees : [])
    setDepartment(mdmsData?.["common-masters"]?.Department)
    setDesignation(mdmsData?.["common-masters"]?.Designation)
    setRejectionReason(rejectReasons)
  }, [mdmsData]);


  
  const { isLoading: approverLoading, isError, error, data: employeeDatav1 } = Digit.Hooks.hrms.useHRMSSearch({ designations: selectedDesignation?.code, departments: selectedDept?.code, roles: action?.assigneeRoles?.toString(), isActive: true }, Digit.ULBService.getCurrentTenantId(), null, null, { enabled: action?.action === "CHECK" || action?.action === "TECHNICALSANCATION"});


  employeeDatav1?.Employees.map(emp => emp.nameOfEmp = emp?.user?.name || "NA")
  
  useEffect(() => {
    setApprovers(employeeDatav1?.Employees?.length > 0 ? employeeDatav1?.Employees.filter(emp => emp?.nameOfEmp !== "NA") : [])
  }, [employeeDatav1])
  
  
  // if (employeeDatav1?.Employees?.length > 0) {
  //   setApprovers(employeeDatav1?.Employees)
  // }

  useEffect(() => {
    
    if(action?.action?.includes("CHECK") || action?.action?.includes("TECHNICALSANCATION")){
      setConfig(
        configCheckModal({
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
    }else if(action?.action?.includes("APPROVE") || action?.action?.includes("ADMINSANCTION")){
      setConfig(
        configApproveModal({
          t,
          action
        })
      )
    }
    else if(action?.action?.includes("REJECT")){
      setConfig(
        configRejectModal({
          t,
          action,
          rejectReasons,
          selectedReason,
          setSelectedReason,
          loiNumber,
          department,
          estimateNumber
        })
      )
    }
  }, [approvers,designation,department]);

  
  function submit (_data) {
    //make the update object here and call submitAction 
    //if the action is reject then you need to make a search call and get creater's uuid
    const workflow = {
      action: action?.action,
      comment: _data?.comments,
      assignees: selectedApprover?.uuid ? [selectedApprover?.uuid] : undefined
    }

    if(action?.action.includes("REJECT")) {
      workflow.assignee = [applicationData?.auditDetails?.createdBy]
    }

    Object.keys(workflow).forEach(key => {
      if (workflow[key] === undefined) {
        delete workflow[key];
      }
    });
    {estimateNumber ? submitAction({estimate:applicationData,workflow}) :
    submitAction({letterOfIndent:applicationData,workflow})}
    
  }

  // if(mdmsLoading || approverLoading ) {
  //   return <Loader />
  // } 



  

  return action && config?.form  ? (
    <Modal
      headerBarMain={<Heading label={t(config.label.heading)} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t(config.label.cancel)}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config.label.submit)}
      actionSaveOnSubmit={() => { }}
      formId="modal-action"
    >
      {mdmsLoading ? (
        <Loader />
      ) : (
        <FormComposer
          config={config.form}
          noBoxShadow
          inline
          childrenAtTheBottom
          onSubmit={submit}
          defaultValues={{}}
          formId="modal-action"
        />
      )}
    </Modal>
  ) : (
    <Loader />
  );
}

export default WorksActionModal