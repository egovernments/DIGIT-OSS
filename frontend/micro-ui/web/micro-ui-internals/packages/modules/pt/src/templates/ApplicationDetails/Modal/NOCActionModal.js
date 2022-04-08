import { Loader, Modal, FormComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";

import { configNOCApproverApplication } from "../config";
import * as predefinedConfig from "../config";

const Heading = (props) => {
  return <h1 style={{marginLeft:"22px"}} className="heading-m BPAheading-m">{props.label}</h1>;
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

const ActionModal = ({ t, action, tenantId, state, id, closeModal, submitAction, actionData, applicationData, businessService, moduleCode }) => {
    const mutation = Digit.Hooks.obps.useObpsAPI(
        applicationData?.landInfo?.address?.city ? applicationData?.landInfo?.address?.city : tenantId,
        true
      ); 
  const { data: approverData, isLoading: PTALoading } = Digit.Hooks.useEmployeeSearch(
    tenantId,
    {
      roles: action?.assigneeRoles?.map?.((e) => ({ code: e })),
      isActive: true,
    },
    { enabled: !action?.isTerminateState }
  );
  const { isLoading: financialYearsLoading, data: financialYearsData } = Digit.Hooks.pt.useMDMS(
    tenantId,
    businessService,
    "FINANCIAL_YEARLS",
    {},
    {
      details: {
        tenantId: Digit.ULBService.getStateId(),
        moduleDetails: [{ moduleName: "egf-master", masterDetails: [{ name: "FinancialYear", filter: "[?(@.module == 'TL')]" }] }],
      },
    }
  );

  const queryClient = useQueryClient();
  const [config, setConfig] = useState({});
  const [defaultValues, setDefaultValues] = useState({});
  const [approvers, setApprovers] = useState([]);
  const [selectedApprover, setSelectedApprover] = useState({});
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState(null);
  const mobileView = Digit.Utils.browser.isMobile() ? true : false;
  const history = useHistory();


  useEffect(() => {
    if (financialYearsData && financialYearsData["egf-master"]) {
      setFinancialYears(financialYearsData["egf-master"]?.["FinancialYear"]);
    }
  }, [financialYearsData]);

  useEffect(() => {
    setApprovers(approverData?.Employees?.map((employee) => ({ uuid: employee?.uuid, name: employee?.user?.name })));
  }, [approverData]);

  function selectFile(e) {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 5242880) {
          setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            const response = await Digit.UploadServices.Filestorage("NOC", file, tenantId);
            if (response?.data?.files?.length > 0) {
              setUploadedFile(response?.data?.files[0]?.fileStoreId);
            } else {
              setError(t("CS_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            setError(t("CS_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  const getInspectionDocs = (docs) => {
    let refinedDocs = [];
    docs && docs.map((doc,ind) => {
      refinedDocs.push({
        "documentType":(doc.documentType+"_"+doc.documentType.split("_")[1]).replaceAll("_","."),
        "fileStoreId":doc.fileStoreId,
        "fileStore":doc.fileStoreId,
        "fileName":"",
        "dropDownValues": {
          "value": (doc.documentType+"_"+doc.documentType.split("_")[1]).replaceAll("_","."),
      }
      })
    })
    return refinedDocs;
  }

  const getQuestion = (data) => {
    let refinedQues = [];
    var i;
    for(i=0; i<data?.questionLength; i++)
    {
      refinedQues.push({
        "remarks": data[`Remarks_${i}`],
        "question": data?.questionList[i].question,
        "value": data[`question_${i}`].code,
      })
    }
    return refinedQues;
  }

  const getfeildInspection = () => {
    let formdata = JSON.parse(sessionStorage.getItem("INSPECTION_DATA"));
    let inspectionOb = [];
    formdata && formdata.map((ob,ind) => {
      inspectionOb.push({
        docs: getInspectionDocs(ob.Documents),
        date: ob.InspectionDate,
        questions: getQuestion(ob),
        time: "10:00",
      })
    })
    let fieldinspection_pending = [ ...inspectionOb];
    return fieldinspection_pending;
  }

  // useEffect(() => {

  //   if(mutation.isSuccess && !mutation.isLoading)
  //   {
  //       history.replace(`/digit-ui/employee/noc/response`, { data: mutation?.data?.Noc[0] });

  //   }
  // },[mutation.isSuccess])


  const onSuccess = () => {
    //clearParams();
    //history.replace(`/digit-ui/employee/noc/response`, { data: applicationData });
    queryClient.invalidateQueries("PT_CREATE_PROPERTY");
  };


  function submit(data) {
      let enteredDocs = JSON.parse(sessionStorage.getItem("NewNOCDocs"));
      let newDocs = applicationData?.documents?.length > 0 ? [...applicationData?.documents] : [];
        enteredDocs.map((d,index) => {
            newDocs.push(d);
        })
    let workflow = { action: action?.action, comments: data?.comments, businessService, moduleName: moduleCode };
    applicationData = {
      ...applicationData,
       workflow:{
        action: action?.action,
        comment: data?.comments ? data?.comments : null,
        assignee: !selectedApprover?.uuid ? null : [selectedApprover?.uuid],
        documents: uploadedFile
        ? [
          {
            documentType: action?.action + " DOC",
            fileName: file?.name,
            fileStoreId: uploadedFile,
          },
        ]
        : null,
      },
      documents: newDocs,
    };


    submitAction({
      Noc: applicationData,
    }, false, {isNoc: true});
  }

  useEffect(() => {
    if (action) {
      setConfig(
        configNOCApproverApplication({
          t,
          action,
          approvers,
          selectedApprover,
          setSelectedApprover,
          selectFile,
          uploadedFile,
          setUploadedFile,
          businessService,
          assigneeLabel: "WF_ASSIGNEE_NAME_LABEL"
        })
      );
    }
  }, [action, approvers, financialYears, selectedFinancialYear, uploadedFile]);

  return action && config.form ? (
    <Modal
      headerBarMain={<Heading label={t(config.label.heading)} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t(config.label.cancel)}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config.label.submit)}
      actionSaveOnSubmit={() => { }}
      formId="modal-action"
      isOBPSFlow={true}
      popupStyles={mobileView?{width:"720px"}:{}}
      style={!mobileView?{height: "45px", width:"107px",paddingLeft:"0px",paddingRight:"0px"}:{height:"45px",width:"44%"}}
      popupModuleMianStyles={mobileView?{paddingLeft:"5px"}: {}}
    >
      {financialYearsLoading ? (
        <Loader />
      ) : (
        <FormComposer
          config={config.form}
          cardStyle={{marginLeft:"0px",marginRight:"0px", marginTop:"-25px"}}
          className="BPAemployeeCard"
          noBoxShadow
          inline
          childrenAtTheBottom
          onSubmit={submit}
          defaultValues={defaultValues}
          formId="modal-action"
        />
      )}
    </Modal>
  ) : (
    <Loader />
  );
};

export default ActionModal;