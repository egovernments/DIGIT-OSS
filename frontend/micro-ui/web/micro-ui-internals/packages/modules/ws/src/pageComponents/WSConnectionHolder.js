import { BackButton, CardLabel, FormStep, Loader, MobileNumber, RadioButtons, TextInput, UploadFile, Dropdown, CheckBox } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { stringReplaceAll } from "../utils";
import Timeline from "../components/Timeline";

const ConnectionHolder = ({ t, config, onSelect, userType, formData, ownerIndex }) => {
  let validation = {};
  const [name, setName] = useState(formData?.ConnectionHolderDetails?.name || formData?.formData?.ConnectionHolderDetails?.name || "");
  const [guardian, setguardian] = useState(formData?.ConnectionHolderDetails?.guardian || formData?.formData?.ConnectionHolderDetails?.guardian || "");
  const [gender, setGender] = useState(formData?.ConnectionHolderDetails?.gender || formData?.formData?.ConnectionHolderDetails?.gender);
  const [relationship, setrelationship] = useState(formData?.ConnectionHolderDetails?.relationship || formData?.formData?.ConnectionHolderDetails?.relationship);
  const [mobileNumber, setMobileNumber] = useState(formData?.ConnectionHolderDetails?.mobileNumber || formData?.formData?.ConnectionHolderDetails?.mobileNumber || "");
  const [address, setaddress] = useState(formData?.ConnectionHolderDetails?.address || formData?.formData?.ConnectionHolderDetails?.address || "");
  const [documentId, setdocumentId] = useState(formData?.ConnectionHolderDetails?.documentId || formData?.formData?.ConnectionHolderDetails?.documentId || "");
  const [isOwnerSame, setisOwnerSame] = useState(!(formData?.ConnectionHolderDetails?.isOwnerSame || formData?.formData?.ConnectionHolderDetails?.isOwnerSame) ? false : true);
  const [uploadedFile, setUploadedFile] = useState(formData?.[config.key]?.fileStoreId || null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [dropdownValue, setDropdownValue] = useState(formData?.ConnectionHolderDetails?.documentType || "");
  const [ownerType, setOwnerType] = useState( formData?.ConnectionHolderDetails?.specialCategoryType || {});

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  let dropdownData = [];
  const { data: Documentsob = { } } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Documents");
  const docs = Documentsob?.PropertyTax?.Documents;
  const specialProofIdentity = Array.isArray(docs) && docs.filter((doc) => doc.code.includes("SPECIALCATEGORYPROOF"));
  if (specialProofIdentity.length > 0) {
    dropdownData = specialProofIdentity[0]?.dropdownData;
    dropdownData.forEach((data) => {
      data.i18nKey = stringReplaceAll(data.code, ".", "_");
    });
    dropdownData = dropdownData?.filter((dropdown) => dropdown.parentValue.includes(ownerType?.code));
    if (dropdownData.length == 1 && dropdownValue != dropdownData[0]) {
      setTypeOfDropdownValue(dropdownData[0]);
    }
  }

  const GuardianOptions = [
    { name: "HUSBAND", code: "HUSBAND", i18nKey: "COMMON_MASTERS_OWNERTYPE_HUSBAND" },
    { name: "Father", code: "FATHER", i18nKey: "COMMON_MASTERS_OWNERTYPE_FATHER" },
  ];

  const { isLoading, data: genderTypeData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["GenderType"]);

  const { data: Menu, isLoading : isSpecialcategoryLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerType");
  Menu ? Menu.sort((a, b) => a.name.localeCompare(b.name)) : "";

  let menu = [];
  genderTypeData &&
    genderTypeData["common-masters"].GenderType.filter(data => data.active).map((genderDetails) => {
      menu.push({ i18nKey: `COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
    });


  useEffect(() => {
    (async () => {
      setError(null);
      if (file) {
        if (file.size >= 2000000) {
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

  function selectChecked(e) {
    setisOwnerSame(!isOwnerSame);
  }

  function setTypeOfDropdownValue(dropdownValue) {
    setDropdownValue(dropdownValue);
  }
  function SelectName(e) {
    setName(e.target.value);
  }
  function selectguardian(e) {
    setguardian(e.target.value);
  }
  function setGenderName(value) {
    setGender(value);
  }
  function setRelationshipName(value) {
    setrelationship(value);
  }
  function setMobileNo(e) {
    setMobileNumber(e.target.value);
  }
  function selectaddress(e) {
    setaddress(e.target.value);
  }
  function selectdocumentId(e) {
    setdocumentId(e.target.value);
  }
  function setTypeOfOwner(value) {
    setOwnerType(value);
  }
  function selectfile(e) {
    setFile(e.target.files[0]);
  }


  const goNext = () => {

    if(isOwnerSame == true)
    {
      //need to add property data here from previous screen
      onSelect(config.key, {"property ID":"PT-23-45-677903", isOwnerSame:isOwnerSame});
    }
    else
    {
      let ConnectionDet = { isOwnerSame:isOwnerSame, name: name, mobileNumber: mobileNumber, gender: gender, guardian: guardian, address: address, relationship:relationship,specialCategoryType:ownerType, documentId:documentId, fileStoreId:uploadedFile, documentType:dropdownValue   }
      onSelect(config.key, ConnectionDet);
    }
  };

  const onSkip = () => onSelect();

  return (
    <div>
       <Timeline currentStep={2} />
        {!isLoading ? 
        <FormStep
          config={config}
          onSelect={goNext}
          onSkip={onSkip}
          t={t}
          isDisabled={!isOwnerSame && ( !name || !mobileNumber || !gender)}
        >
        <div>
        <CheckBox
        label={t("WS_CONN_HOLDER_SAME_AS_OWNER_DETAILS")}
        onChange={(e) => selectChecked(e)}
        //value={field.isPrimaryOwner}
        checked={isOwnerSame}
        style={{ paddingBottom: "10px", paddingTop: "10px" }}
        />  
        </div>
        {!isOwnerSame  && <div style={{border:"solid",borderRadius:"5px",padding:"10px",paddingTop:"20px",marginTop:"10px",borderColor:"#f3f3f3",background:"#FAFAFA"}}>
            <CardLabel>{`${t("WS_OWN_DETAIL_NAME")}*`}</CardLabel>
            <TextInput
              t={t}
              type={"text"}
              style={{background:"#FAFAFA"}}
              isMandatory={false}
              optionKey="i18nKey"
              name="name"
              value={name}
              onChange={SelectName}
              //disable={name && !isOpenLinkFlow ? true : false}
              {...(validation = {
                isRequired: true,
                pattern: "^[a-zA-Z-.`' ]*$",
                type: "text",
                title: t("WS_NAME_ERROR_MESSAGE"),
              })}
            />
            <CardLabel>{`${t("WS_OWN_DETAIL_GENDER_LABEL")}*`}</CardLabel>
            <RadioButtons
              t={t}
              options={menu}
              optionsKey="code"
              name="gender"
              value={gender}
              selectedOption={gender}
              onSelect={setGenderName}
              isDependent={true}
              labelKey="COMMON_GENDER"
            //disabled={isUpdateProperty || isEditProperty}
            />
            <CardLabel>{`${t("WS_OWN_MOBILE_NO")}*`}</CardLabel>
            <MobileNumber
              value={mobileNumber}
              name="mobileNumber"
              onChange={(value) => setMobileNo({ target: { value } })}
              style={{background:"#FAFAFA"}}
              //disable={mobileNumber && !isOpenLinkFlow ? true : false}
              {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
            />
            <CardLabel>{t("WS_OWN_DETAIL_GUARDIAN_LABEL")}</CardLabel>
            <TextInput
              t={t}
              type={"text"}
              isMandatory={false}
              optionKey="i18nKey"
              name="guardian"
              value={guardian}
              style={{background:"#FAFAFA"}}
              onChange={selectguardian}
              //disable={editScreen}
              {...(validation = {
                isRequired: true,
                pattern: "^[a-zA-Z-.`' ]*$",
                type: "text",
                title: t("WS_NAME_ERROR_MESSAGE"),
              })}
            />
            <RadioButtons
                t={t}
                optionsKey="i18nKey"
                name="relationship"
                options={GuardianOptions}
                value={relationship}
                selectedOption={relationship}
                onSelect={setRelationshipName}
                isDependent={true}
                labelKey="COMMON_MASTERS_OWNERTYPE"
                //disabled={isUpdateProperty || isEditProperty}
            />
            <CardLabel>{`${t("WS_COMMON_TABLE_COL_ADDRESS")}`}</CardLabel>
            <TextInput
              t={t}
              type={"text"}
              style={{background:"#FAFAFA"}}
              isMandatory={false}
              optionKey="i18nKey"
              name="address"
              value={address}
              onChange={selectaddress}
            />
            <CardLabel>{t("WS_OWN_SPECIAL_CAT_LABEL")}</CardLabel>
            <Dropdown
                className="form-field"
                selected={ownerType}
                //disable={Menu?.length === 1 || editScreen}
                option={Menu}
                select={setTypeOfOwner}
                optionKey="i18nKey"
                t={t}
            />
            {ownerType && Object.entries(ownerType).length>0 && ownerType?.code !== "NONE" && <div>
                <CardLabel>{`${t("WS_DOCUMENT_ID_LABEL")}`}</CardLabel>
                <TextInput
                    t={t}
                    type={"text"}
                    style={{background:"#FAFAFA"}}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="documentId"
                    value={documentId}
                    onChange={selectdocumentId}
                />
                <CardLabel>{`${t("WS_DOCUMENT_TYPE_LABEL")}`}</CardLabel>
                <Dropdown
                    t={t}
                    isMandatory={false}
                    option={dropdownData}
                    selected={dropdownValue}
                    optionKey="i18nKey"
                    select={setTypeOfDropdownValue}
                    //placeholder={t(`PT_MUTATION_SELECT_DOC_LABEL`)}
                    //disable={isUpdateProperty || isEditProperty}
                />
                <UploadFile
                    id={"ptm-doc"}
                    //extraStyleName={"propertyCreate"}
                    accept=".jpg,.png,.pdf"
                    onUpload={selectfile}
                    onDelete={() => {
                    setUploadedFile(null);
                    }}
                    message={uploadedFile ? `1 ${t(`WS_ACTION_FILEUPLOADED`)}` : t(`WS_ACTION_NO_FILEUPLOADED`)}
                    error={error}
                />
            {error ? <div style={{ height: "20px", width: "100%", fontSize: "20px", color: "red", marginTop: "5px" }}>{error}</div> : ""}
            </div>}
          </div>}
        </FormStep> : <Loader /> }
    </div>
  );
};

export default ConnectionHolder;