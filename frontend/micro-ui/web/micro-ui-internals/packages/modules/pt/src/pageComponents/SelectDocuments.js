import React, { useEffect, useState } from "react";
import {
  CardLabel,
  LabelFieldPair,
  Dropdown,
  UploadFile,
  Toast,
  Loader,
  CardHeader,
  CardSectionHeader,
} from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const SelectDocuments = ({ t, config, onSelect, userType, formData, setError: setFormError, clearErrors: clearFormErrors, formState }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [documents, setDocuments] = useState(formData?.documents?.documents || []);
  const [error, setError] = useState(null);

  let action = "create";

  const { pathname } = useLocation();
  const isEditScreen = pathname.includes("/modify-application/");
  const isMutation = pathname.includes("/property-mutate/");

  if (isEditScreen) action = "update";

  const propertyInitialValues = JSON.parse(sessionStorage.getItem("PropertyInitials"));

  const { isLoading, data } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", [
    "UsageCategory",
    "OccupancyType",
    "Floor",
    "OwnerType",
    "OwnerShipCategory",
    "Documents",
    "SubOwnerShipCategory",
    "OwnerShipCategory",
    "MutationDocuments",
  ]);


  const mutationDocs = data?.PropertyTax?.MutationDocuments;
  const commonDocs = data?.PropertyTax?.Documents;

  const propertyTaxDocuments = isMutation
    ? mutationDocs?.map?.((doc) => commonDocs.find((e) => doc.code === e.code) || doc)
    : data?.PropertyTax?.Documents;

  const goNext = () => {
    onSelect(config.key, { documents, propertyTaxDocumentsLength: propertyTaxDocuments?.length });
  };

  useEffect(() => {
    goNext();
  }, [documents]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {isMutation ? <CardSectionHeader>{t("PT_MUTATION_DOCUMENTS_HEADER")} </CardSectionHeader> : null}
      {propertyTaxDocuments?.map((document, index) => {
        // if (document.code === "OWNER.SPECIALCATEGORYPROOF") {
        //   if (formData?.owners?.every((user) => user.ownerType.code === "NONE" || !user.ownerType?.code)) {
        //     return null;
        //   }
        // }
        return (
          <SelectDocument
            key={index}
            document={document}
            action={action}
            t={t}
            id={`pt-document-${index}`}
            error={error}
            setError={setError}
            setDocuments={setDocuments}
            documents={documents}
            formData={formData}
            setFormError={setFormError}
            clearFormErrors={clearFormErrors}
            config={config}
            formState={formState}
            propertyInitialValues={propertyInitialValues}
          />
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
  id,
  propertyInitialValues,
}) {
  const filteredDocument = documents?.filter((item) => item?.documentType?.includes(doc?.code))[0];
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [selectedDocument, setSelectedDocument] = useState(
    filteredDocument
      ? { ...filteredDocument, active: filteredDocument?.status === "ACTIVE", code: filteredDocument?.documentType }
      : doc?.dropdownData?.length === 1
      ? doc?.dropdownData[0]
      : {}
  );
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(() => filteredDocument?.fileStoreId || null);

  const handleSelectDocument = (value) => setSelectedDocument(value);

  function selectfile(e) {
    setFile(e.target.files[0]);
  }
  const { dropdownData } = doc;
  const { dropdownFilter, enabledActions, filterCondition } = doc?.additionalDetails || {};
  var dropDownData = dropdownData;
  // let hideInput = false;
  const [isHidden, setHidden] = useState(false);

  const addError = () => {
    let type = formState.errors?.[config.key]?.type;
    if (!Array.isArray(type)) type = [];
    if (!type.includes(doc.code)) {
      type.push(doc.code);
      setFormError(config.key, { type });
    }
  };

  const removeError = () => {
    let type = formState.errors?.[config.key]?.type;
    if (!Array.isArray(type)) type = [];
    if (type.includes(doc?.code)) {
      type = type.filter((e) => e != doc?.code);
      if (!type.length) {
        clearFormErrors(config.key);
      } else {
        setFormError(config.key, { type });
      }
    }
  };

  useEffect(() => {
    if (selectedDocument?.code) {
      setDocuments((prev) => {
        const filteredDocumentsByDocumentType = prev?.filter((item) => item?.documentType !== selectedDocument?.code);

        if (uploadedFile?.length === 0 || uploadedFile === null) {
          return filteredDocumentsByDocumentType;
        }

        const filteredDocumentsByFileStoreId = filteredDocumentsByDocumentType?.filter((item) => item?.fileStoreId !== uploadedFile);
        return [
          ...filteredDocumentsByFileStoreId,
          {
            documentType: selectedDocument?.code,
            fileStoreId: uploadedFile,
            documentUid: uploadedFile,
          },
        ];
      });
    }
    if (!isHidden) {
      if (!uploadedFile || !selectedDocument?.code) {
        addError();
      } else if (uploadedFile && selectedDocument?.code) {
        removeError();
      }
    } else if (isHidden) {
      removeError();
    }
  }, [uploadedFile, selectedDocument, isHidden]);

  useEffect(() => {
    if (action === "update") {
      const originalDoc = formData?.originalData?.documents?.filter((e) => e.documentType.includes(doc?.code))[0];
      const docType = dropDownData
        .filter((e) => e.code === originalDoc?.documentType)
        .map((e) => ({ ...e, i18nKey: e?.code?.replaceAll(".", "_") }))[0];
      if (!docType) setHidden(true);
      else {
        setSelectedDocument(docType);
        setUploadedFile(originalDoc?.fileStoreId);
      }
    } else if (action === "create") {
    }
  }, []);

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 5242880) {
          setError(t("CS_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
          // if (!formState.errors[config.key]) setFormError(config.key, { type: doc?.code });
        } else {
          try {
            setUploadedFile(null);
            const response = await Digit.UploadServices.Filestorage("PT", file, Digit.ULBService.getStateId());
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

  useEffect(() => {
    if (isHidden) setUploadedFile(null);
  }, [isHidden]);

  useEffect(() => {
    if (doc.code === "OWNER.TRANSFERREASONDOCUMENT") {
      if (selectedDocument?.code?.split(".")[2] !== formData?.additionalDetails?.reasonForTransfer?.code) {
        setSelectedDocument(null);
        setUploadedFile(null);
      }
    }
  }, [formData?.additionalDetails?.reasonForTransfer?.code]);

  if (filterCondition) {
    const { filterValue, jsonPath, onArray, arrayAttribute, formDataPath, formArrayAttrPath } = filterCondition;
    if (action === "create") {
      const value = formDataPath?.reduce((acc, key) => {
        if (key.charAt(0).toUpperCase() + key.slice(1) === "PropertyType") return acc["PropertyType"];
        return acc?.[key];
      }, formData);

      let hideInput;
      if (value) {
        if (onArray) {
          const valueArr = value?.map((e) => formArrayAttrPath.reduce((acc, f) => acc?.[f], e) || e);
          hideInput = valueArr?.every((e) => filterValue.includes(e));
        } else {
          hideInput = filterValue?.includes(value);
        }
        if (hideInput !== isHidden) setHidden(hideInput);
        if (hideInput) return null;
      }
    }

    if (action === "update") {
      const a = fromRawData ? jsonPath : jsonPath?.split("Properties[0].propertyDetails[0].")[1];
      const keyArr = a?.split(".")?.map((e) => (e.includes("[") ? e.split("[")[1]?.split("]")[0] : e));
      const value = keyArr.reduce((acc, curr) => acc[curr], formData?.originalData);
      const formDataValue = formDataPath?.reduce((acc, key) => {
        if (key.charAt(0).toUpperCase() + key.slice(1) === "PropertyType") return acc["PropertyType"];
        return acc?.[key];
      }, formData);
      let hideInput;
      if (value) {
        if (onArray) {
          if (enabledActions?.[action].disableUpload) {
            hideInput = value?.every((e) => filterValue?.includes(e[arrayAttribute]));
          } else {
            const valueArr = formDataValue?.map((e) => formArrayAttrPath.reduce((acc, f) => acc?.[f], e) || e);
            hideInput = valueArr?.every((e) => filterValue?.includes(e));
          }
        } else hideInput = filterValue?.includes(value);
        if (hideInput !== isHidden) setHidden(hideInput);
        if (hideInput) return null;
      }
    }
  }

  if (dropdownFilter) {
    const { formDataPath, formArrayAttrPath, onArray, parentJsonpath, arrayAttribute, parentArrayJsonPath } = dropdownFilter;
    if (["create", "update"].includes(action)) {
      if (enabledActions?.[action].disableUpload) {
        if (onArray) {
          const keyForArr = parentArrayJsonPath?.split("Properties[0].propertyDetails[0].")[1].split(".");
          const arr = keyForArr.reduce((acc, key) => acc[key], formData?.originalData);
          const valueMap = arr.map((val) => parentJsonpath.split(".").reduce((acc, key) => acc[key], val));
          dropDownData = dropdownData.filter((e) => e.parentValue.some((val) => valueMap.includes(val)));
        } else {
          const keyForArr = parentJsonpath?.split("Properties[0].propertyDetails[0].")[1].split(".");
          const value = keyForArr.reduce((acc, key) => acc[key], formData?.originalData);
          dropDownData = dropdownData.filter((e) => e.parentValue.includes(value));
        }
      } else {
        const arr = formDataPath;
        const value = arr?.reduce((acc, key) => acc?.[key], formData);
        const attrForFormArray = formArrayAttrPath;
        if (value) {
          if (!onArray) {
            dropDownData = dropdownData.filter((e) => e.parentValue.includes(value));
          } else {
            const valueMap = value.map((e) => attrForFormArray?.reduce((acc, key) => acc[key], e) || e);
            dropDownData = dropdownData.filter((e) => e.parentValue.some((val) => valueMap.includes(val)));
          }
        }
      }
    }
  }
  if (dropDownData?.length === 0) {
    removeError();
    return null;
  }

  if (doc.code === "OWNER.TRANSFERREASONDOCUMENT") {
    dropDownData = dropDownData.filter((e) => e.code?.split(".")[2] === formData?.additionalDetails?.reasonForTransfer?.code);
  }

  return (
    <div style={{ marginBottom: "24px" }}>
      {doc?.hasDropdown ? (
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">{t(doc?.code.replaceAll(".", "_")) + "  *"}</CardLabel>
          <Dropdown
            className="form-field"
            selected={selectedDocument}
            disable={dropDownData?.length === 0 || (propertyInitialValues?.documents && propertyInitialValues?.documents.length>0 && propertyInitialValues?.documents.filter((document) => document.documentType.includes(doc?.code)).length>0? enabledActions?.[action].disableDropdown : false)}
            option={dropDownData.map((e) => ({ ...e, i18nKey: e.code?.replaceAll(".", "_") }))}
            select={handleSelectDocument}
            optionKey="i18nKey"
            t={t}
          />
        </LabelFieldPair>
      ) : null}
      <LabelFieldPair>
        <CardLabel className="card-label-smaller"></CardLabel>
        <div className="field">
          <UploadFile
            onUpload={selectfile}
            onDelete={() => {
              setUploadedFile(null);
            }}
            id={id}
            message={uploadedFile ? `1 ${t(`CS_ACTION_FILEUPLOADED`)}` : t(`CS_ACTION_NO_FILEUPLOADED`)}
            textStyles={{ width: "100%" }}
            inputStyles={{ width: "280px" }}
            disabled={(propertyInitialValues?.documents && propertyInitialValues?.documents.length>0 && propertyInitialValues?.documents.filter((document) => document.documentType.includes(doc?.code)).length>0? enabledActions?.[action].disableUpload : false) || !selectedDocument?.code}
            buttonType="button"
            error={!uploadedFile}
          />
        </div>
      </LabelFieldPair>
    </div>
  );
}

export default SelectDocuments;
