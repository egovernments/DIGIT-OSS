import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair, Dropdown, UploadFile, Toast, Loader, MultiUploadWrapper } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const OBPSDocumentsEmp = ({ t, config, onSelect, userType, formData, setError: setFormError, clearErrors: clearFormErrors, formState, index: indexx, setFieldReports, documentList }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [documents, setDocuments] = useState(formData?.FeildReports?.[indexx]?.Documents || []);
  const [error, setError] = useState(null);
  const [previousLicenseDetails, setPreviousLicenseDetails] = useState(formData?.tradedetils1 || []);

  let action = "create";

  const { pathname } = useLocation();
  const isEditScreen = pathname.includes("/modify-application/");

  if (isEditScreen) action = "update";

  const { isLoading, data: documentsData } = Digit.Hooks.pt.usePropertyMDMS(stateId, "TradeLicense", ["documentObj"]);

  const ckeckingLocation = window.location.href.includes("renew-application-details");

  const tlDocuments = documentsData?.TradeLicense?.documentObj;
  const tlDocumentsList = tlDocuments?.["0"]?.allowedDocs;

  let finalTlDocumentsList = [];
  documentList && documentList.map((doc) => {
    finalTlDocumentsList.push({ documentType: doc.code, code: doc.code });
  })

  const goNext = () => {
    let data = formData;
    data && data?.FieldReports && data?.FieldReports.length > 0 && documents?.length > 0 ? data.FieldReports[indexx] = { ...data.FieldReports[indexx], Documents: documents } : "";
    data && data?.FieldReports && data?.FieldReports.length > 0 && documents.length > 0 ? setFieldReports(data.FieldReports) : "";
  };

  useEffect(() => {
    goNext();
  }, [documents]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {finalTlDocumentsList?.map((document, index) => {
        return (
          <div >
          <SelectDocument
            key={index}
            document={document}
            action={action}
            t={t}
            id={`obps-doc-${index}`}
            error={error}
            setError={setError}
            setDocuments={setDocuments}
            documents={documents}
            formData={formData}
            setFormError={setFormError}
            clearFormErrors={clearFormErrors}
            config={config}
            formState={formState}
            stateId={stateId}
          />
          </div>
        );
      })}
      {error && <Toast label={error} onClose={() => setError(null)} error />}
    </div>
  );
};

function SelectDocument({
  t,
  document: doc,
  setDocuments,
  error,
  setError,
  documents,
  action,
  formData,
  setFormError,
  clearFormErrors,
  config,
  formState,
  fromRawData,
  key,
  id,
  stateId={stateId}
}) {
  const filteredDocument = documents?.filter((item) => item?.documentType);
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [selectedDocument, setSelectedDocument] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(() => filteredDocument?.fileStoreId || null);
  const [isHidden, setHidden] = useState(false);
  const [newArray, setnewArray] = useState([]);
  const allowedFileTypes = /(.*?)(jpg|jpeg|png|image|pdf)$/i;

  function selectfile(e, key) {
    e && setSelectedDocument({ documentType: key });
    e && setFile(e.file);
    e && setUploadedFile(e?.fileStoreId?.fileStoreId);
  }

  function getData(e, key) {
    let data = Object.fromEntries(e);
    let newArr = Object.values(data);
    setnewArray(newArr);
    if (documents && newArr && documents.filter(ob => ob.documentType === key).length > newArr.length) {
      setDocuments(documents.filter(ob => ob.documentType !== key));
    }

    newArr && newArr.map((ob) => {
      ob.file.documentType = key;
      selectfile(ob, key);
    })
  }

  const addError = () => {
    let type = formState.errors?.[config.key]?.type;
    if (!Array.isArray(type)) type = [];
    if (!type.includes(doc.documentType)) {
      type.push(doc.documentType);
      setFormError(config.key, { type });
    }
  };

  const removeError = () => {
    let type = formState.errors?.[config.key]?.type;
    if (!Array.isArray(type)) type = [];
    if (type.includes(doc?.documentType)) {
      type = type.filter((e) => e != doc?.documentType);
      if (!type.length) {
        clearFormErrors(config.key);
      } else {
        setFormError(config.key, { type });
      }
    }
  };

  useEffect(() => {
    if (selectedDocument?.documentType && ((documents.filter((ob) => ob.documentType === selectedDocument?.documentType)).length == 0 || ((newArray.filter((ob) => ob?.file?.documentType === selectedDocument?.documentType)).length) !== (documents.filter((ob) => ob.documentType === selectedDocument?.documentType)).length)) {
      setDocuments((prev) => {
        if (uploadedFile?.length === 0 || uploadedFile === null) {
          return prev;
        }
        const filteredDocumentsByFileStoreId = prev?.filter((item) => item?.fileStoreId !== uploadedFile);
        const filteredDocumentByDocumentType = prev?.filter((item) => item?.documentType !== selectedDocument?.documentType);
        if (selectedDocument?.id) {
          return [
            ...filteredDocumentsByFileStoreId,
            {
              documentType: selectedDocument?.documentType,
              fileStoreId: uploadedFile,
              tenantId: tenantId,
              id: selectedDocument?.id
            },
          ];
        } 
        else{
        let UniqueDocTypeTempArray =[];
        newArray.map((ob) => {
          UniqueDocTypeTempArray.push( 
            //...filteredDocumentsByFileStoreId,
            {
              documentType: selectedDocument?.documentType,
              fileStoreId: ob?.fileStoreId?.fileStoreId,
              tenantId: ob?.fileStoreId?.tenantId,
            },
          );
          })
          return [...filteredDocumentByDocumentType, ...UniqueDocTypeTempArray];
        }
      });
    }

    if (!isHidden) {
      const isRenewal = window.location.href.includes("renew-application-details");
      if (!isRenewal) {
        if (!uploadedFile || !selectedDocument?.documentType) {
          addError();
        } else if (uploadedFile && selectedDocument?.documentType) {
          removeError();
        }
      }
    } else if (isHidden) {
      removeError();
    }
  }, [uploadedFile, selectedDocument, isHidden]);

  useEffect(() => {
    if (doc && formData?.documents?.documents?.length > 0) {
      for (let i = 0; i < formData?.documents?.documents?.length; i++) {
        if (doc?.documentType === formData?.documents?.documents?.[i]?.documentType) {
          setSelectedDocument({ documentType: formData?.documents?.documents?.[i]?.documentType, id: formData?.documents?.documents?.[i]?.id });
          setUploadedFile(formData?.documents?.documents?.[i]?.fileStoreId);
        }
      }
    }
  }, [doc])
  return (
    <div style={{ marginBottom: "24px" }}>
      <LabelFieldPair style={{width :"100%"}}>
        <CardLabel className="card-label-smaller" style={{width :"100%"}}>
          {doc?.documentType != "OLDLICENCENO" ?
            `${t(`${doc?.documentType.replaceAll(".", "_")}`)}*` :
            `${t(`${doc?.documentType.replaceAll(".", "_")}`)}`}
        </CardLabel>
        <div className="field" style={{ width: "100%" }}>
          <MultiUploadWrapper
            module="BPA"
            tenantId={stateId}
            getFormState={e => getData(e, doc?.documentType.replaceAll(".", "_"))}
            t={t}
            allowedFileTypesRegex={allowedFileTypes}
            allowedMaxSizeInMB={5}
            acceptFiles= "image/*, .pdf, .png, .jpeg, .jpg"
          />
        </div>
      </LabelFieldPair>
    </div>
  );
}

export default OBPSDocumentsEmp;
