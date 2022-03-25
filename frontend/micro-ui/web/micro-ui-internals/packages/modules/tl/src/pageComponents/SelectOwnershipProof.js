import { CardLabel, CardLabelDesc, FormStep, UploadFile } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import Timeline from "../components/TLTimeline";

const SelectOwnershipProof = ({ t, config, onSelect, userType, formData }) => {
  const [uploadedFile, setUploadedFile] = useState(formData?.owners?.documents?.ProofOfOwnership?.fileStoreId || null);
  const [file, setFile] = useState(formData?.owners?.documents?.ProofOfOwnership);
  const [error, setError] = useState(null);
  const cityDetails = Digit.ULBService.getCurrentUlb();
  let acceptFormat = ".jpg,.png,.pdf,.jpeg"

  const [dropdownValue, setDropdownValue] = useState(formData?.owners?.documents?.ProofOfOwnership?.documentType || null);
  //let dropdownData = [];
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const { data: Documentsob = { } } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Documents");
  const docs = Documentsob?.PropertyTax?.Documents;
  const proofOfOwnership = Array.isArray(docs) && docs.filter((doc) => doc.code.includes("ADDRESSPROOF"));
  // if (proofOfOwnership.length > 0) {
  //   dropdownData = proofOfOwnership[0]?.dropdownData;
  //   dropdownData.forEach((data) => {
  //     data.i18nKey = stringReplaceAll(data.code, ".", "_");
  //   });
  // }

  // function setTypeOfDropdownValue(dropdownValue) {
  //   setDropdownValue(dropdownValue);
  // }

  const handleSubmit = () => {
    let fileStoreId = uploadedFile;
    let fileDetails = file;
    if (fileDetails) fileDetails.documentType = "OWNERSHIPPROOF";
    if (fileDetails) fileDetails.fileStoreId = fileStoreId ? fileStoreId : null;
    let owners = formData?.owners;
    if (owners && owners.documents) {
      owners.documents["ProofOfOwnership"] = fileDetails;
    } else {
      owners["documents"] = [];
      owners.documents["ProofOfOwnership"] = fileDetails;
    }
    onSelect(config.key, owners);
  };
  const onSkip = () => onSelect();

  function selectfile(e) {
    setUploadedFile(null);
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    (async () => {
      setError(null);
      if (file&& file?.type) {
        if(!(acceptFormat?.split(",")?.includes(`.${file?.type?.split("/")?.pop()}`)))
        {
          setError(t("PT_UPLOAD_FORMAT_NOT_SUPPORTED"));
        }
        else if (file.size >= 2000000) {
          setError(t("PT_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
        } else {
          try {
            const response = await Digit.UploadServices.Filestorage("property-upload", file, Digit.ULBService.getStateId());
            if (response?.data?.files?.length > 0) {
              setUploadedFile(response?.data?.files[0]?.fileStoreId);
            } else {
              setError(t("PT_FILE_UPLOAD_ERROR"));
            }
          } catch (err) {
          }
        }
      }
    })();
  }, [file]);

  return (
    <React.Fragment>
    {window.location.href.includes("/citizen") ? <Timeline currentStep={3}/> : null}
    <FormStep config={config} onSelect={handleSubmit} onSkip={onSkip} t={t} isDisabled={!uploadedFile || error}>
      <CardLabelDesc style={{ fontWeight: "unset" }}>{t(`TL_UPLOAD_OWNERSHIP_RESTRICTIONS_TYPES`)}</CardLabelDesc>
      <CardLabelDesc style={{ fontWeight: "unset" }}>{t(`TL_UPLOAD_RESTRICTIONS_SIZE`)}</CardLabelDesc>
      <CardLabel>{`${t("TL_CATEGORY_DOCUMENT_TYPE")}`}</CardLabel>
      {/* <Dropdown
        t={t}
        isMandatory={false}
        option={dropdownData}
        selected={dropdownValue}
        optionKey="i18nKey"
        select={setTypeOfDropdownValue}
        //placeholder={t(`PT_MUTATION_SELECT_DOC_LABEL`)}
      /> */}
      <UploadFile
        id={"tl-doc"}
        extraStyleName={"propertyCreate"}
        accept=".jpg,.png,.pdf"
        onUpload={selectfile}
        onDelete={() => {
          setUploadedFile(null);
        }}
        message={uploadedFile ? `1 ${t(`TL_ACTION_FILEUPLOADED`)}` : t(`TL_ACTION_NO_FILEUPLOADED`)}
        error={error}
      />
      {error ? <div style={{ height: "20px", width: "100%", fontSize: "20px", color: "red", marginTop: "5px" }}>{error}</div> : ""}
      <div style={{ disabled: "true", height: "20px", width: "100%" }}></div>
    </FormStep>
    </React.Fragment>
  );
};

export default SelectOwnershipProof;
