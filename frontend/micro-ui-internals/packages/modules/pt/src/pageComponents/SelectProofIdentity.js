import React, { useState, useEffect } from "react";
import { FormStep, UploadFile, CardLabelDesc, Dropdown, CardLabel } from "@egovernments/digit-ui-react-components";
import { stringReplaceAll } from "../utils";

const SelectProofIdentity = ({ t, config, onSelect, userType, formData }) => {
  let index = window.location.href.charAt(window.location.href.length - 1);
  const [uploadedFile, setUploadedFile] = useState(formData?.owners[index]?.documents?.proofIdentity?.fileStoreId || null);
  const [file, setFile] = useState(formData?.owners[index]?.documents?.proofIdentity);
  const [error, setError] = useState(null);
  const cityDetails = Digit.ULBService.getCurrentUlb();
  const onSkip = () => onSelect();

  const [dropdownValue, setDropdownValue] = useState(formData?.owners[index]?.documents?.proofIdentity?.documentType);
  let dropdownData = [];
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const { data: Documentsob = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Documents");
  const docs = Documentsob?.PropertyTax?.Documents;
  const proofIdentity = Array.isArray(docs) && docs.filter((doc) => doc.code.includes("IDENTITYPROOF"));
  if (proofIdentity.length > 0) {
    dropdownData = proofIdentity[0]?.dropdownData;
    dropdownData.forEach((data) => {
      data.i18nKey = stringReplaceAll(data.code, ".", "_");
    });
  }

  function setTypeOfDropdownValue(dropdownValue) {
    setDropdownValue(dropdownValue);
  }

  function selectfile(e) {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 2000000) {
          setError(t("PT_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            // TODO: change module in file storage
            const response = await Digit.UploadServices.Filestorage("property-upload", file, "pb");
            if (response?.data?.files?.length > 0) {
              setUploadedFile(response?.data?.files[0]?.fileStoreId);
            } else {
              setError(t("PT_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
            console.error("Modal -> err ", err);
            // setError(t("PT_FILE_UPLOAD_ERROR"));
          }
        }
      }
    })();
  }, [file]);

  const [multipleownererror, setmultipleownererror] = useState(null);

  const handleSubmit = () => {
    setmultipleownererror(null);
    if (formData?.ownershipCategory?.code === "INDIVIDUAL.MULTIPLEOWNERS" && index === "0") {
      setmultipleownererror("PT_MULTI_OWNER_ADD_ERR_MSG");
    } else {
      let fileStoreId = uploadedFile;
      let fileDetails = file;
      if (fileDetails) {
        fileDetails.documentType = dropdownValue;
        fileDetails.fileStoreId = fileStoreId ? fileStoreId : null;
      }
      let ownerDetails = formData.owners && formData.owners[index];
      if (ownerDetails && ownerDetails.documents) {
        ownerDetails.documents["proofIdentity"] = fileDetails;
      } else {
        ownerDetails["documents"] = [];
        ownerDetails.documents["proofIdentity"] = fileDetails;
      }

      onSelect(config.key, ownerDetails, "", index);
    }
    // onSelect(config.key, { specialProofIdentity: fileDetails }, "", index);
  };

  function onAdd() {
    let newIndex = parseInt(index) + 1;
    let fileStoreId = uploadedFile;
    let fileDetails = file;
    if (fileDetails) {
      fileDetails.documentType = dropdownValue;
      fileDetails.fileStoreId = fileStoreId ? fileStoreId : null;
    }
    let ownerDetails = formData.owners && formData.owners[index];
    if (ownerDetails && ownerDetails.documents) {
      ownerDetails.documents["proofIdentity"] = fileDetails;
    } else {
      ownerDetails["documents"] = [];
      ownerDetails.documents["proofIdentity"] = fileDetails;
    }
    onSelect("owner-details", {}, false, newIndex, true);
  }
  return (
    <FormStep
      t={t}
      config={config}
      onSelect={handleSubmit}
      onSkip={onSkip}
      forcedError={t(multipleownererror)}
      isDisabled={multipleownererror || !uploadedFile || !dropdownValue || error}
      onAdd={onAdd}
      isMultipleAllow={formData?.ownershipCategory?.value == "INDIVIDUAL.MULTIPLEOWNERS"}
    >
      <CardLabelDesc>{t(`PT_UPLOAD_RESTRICTIONS_TYPES`)}</CardLabelDesc>
      <CardLabelDesc>{t(`PT_UPLOAD_RESTRICTIONS_SIZE`)}</CardLabelDesc>
      <CardLabel>{`${t("PT_CATEGORY_DOCUMENT_TYPE")}`}</CardLabel>
      <Dropdown
        t={t}
        isMandatory={false}
        option={dropdownData}
        selected={dropdownValue}
        optionKey="i18nKey"
        select={setTypeOfDropdownValue}
        placeholder={t(`PT_MUTATION_SELECT_DOC_LABEL`)}
      />
      <UploadFile
        extraStyleName={"propertyCreate"}
        accept=".jpg,.png,.pdf"
        onUpload={selectfile}
        onDelete={() => {
          setUploadedFile(null);
        }}
        message={uploadedFile ? `1 ${t(`PT_ACTION_FILEUPLOADED`)}` : t(`PT_ACTION_NO_FILEUPLOADED`)}
        error={error}
      />
      {error ? <div style={{ height: "20px", width: "100%", fontSize: "20px", color: "red", marginTop: "5px" }}>{error}</div> : ""}
      <div style={{ disabled: "true", height: "20px", width: "100%" }}></div>
    </FormStep>
  );
};

export default SelectProofIdentity;
