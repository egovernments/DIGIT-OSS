import { CardLabel, CheckBox, Dropdown, FormStep, Loader, MobileNumber, RadioButtons, TextInput, UploadFile,LabelFieldPair,TextArea,SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import Timeline from "../components/Timeline";
import { stringReplaceAll } from "../utils";

const WSDisConnectionForm = ({ t, config, onSelect, userType, formData, ownerIndex }) => {
    console.log(config,"config2222222222222222222222")
  let validation = {};
  
  const [disconnectionData, setDisconnectionData] = useState({
      type: formData?.WSDisConnectionForm?.type || "",
      date: formData?.WSDisConnectionForm?.date || "",
      reason: formData?.WSDisConnectionForm?.reason || "",
  })



//   const [name, setName] = useState(formData?.ConnectionHolderDetails?.name || formData?.formData?.ConnectionHolderDetails?.name || "");
//   const [guardian, setguardian] = useState(formData?.ConnectionHolderDetails?.guardian || formData?.formData?.ConnectionHolderDetails?.guardian || "");
//   const [gender, setGender] = useState(formData?.ConnectionHolderDetails?.gender || formData?.formData?.ConnectionHolderDetails?.gender);
//   const [relationship, setrelationship] = useState(formData?.ConnectionHolderDetails?.relationship || formData?.formData?.ConnectionHolderDetails?.relationship);
//   const [mobileNumber, setMobileNumber] = useState(formData?.ConnectionHolderDetails?.mobileNumber || formData?.formData?.ConnectionHolderDetails?.mobileNumber || "");
//   const [address, setaddress] = useState(formData?.ConnectionHolderDetails?.address || formData?.formData?.ConnectionHolderDetails?.address || "");
//   const [documentId, setdocumentId] = useState(formData?.ConnectionHolderDetails?.documentId || formData?.formData?.ConnectionHolderDetails?.documentId || "");
//   const [isOwnerSame, setisOwnerSame] = useState((formData?.ConnectionHolderDetails?.isOwnerSame == false || formData?.formData?.ConnectionHolderDetails?.isOwnerSame == false) ? false : true);
//   const [uploadedFile, setUploadedFile] = useState(formData?.[config.key]?.fileStoreId || null);
//   const [file, setFile] = useState(null);
//   const [error, setError] = useState(null);
//   const [dropdownValue, setDropdownValue] = useState(formData?.ConnectionHolderDetails?.documentType || "");
//   const [ownerType, setOwnerType] = useState( formData?.ConnectionHolderDetails?.specialCategoryType || {});

  const tenantId = Digit.ULBService.getCurrentTenantId();
//   const stateId = Digit.ULBService.getStateId();
//   let dropdownData = [];
//   const { data: Documentsob = { } } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Documents");
//   const docs = Documentsob?.PropertyTax?.Documents;
//   const specialProofIdentity = Array.isArray(docs) && docs.filter((doc) => doc.code.includes("SPECIALCATEGORYPROOF"));


//   if (specialProofIdentity.length > 0) {
//     dropdownData = specialProofIdentity[0]?.dropdownData;
//     dropdownData.forEach((data) => {
//       data.i18nKey = stringReplaceAll(data.code, ".", "_");
//     });
//     dropdownData = dropdownData?.filter((dropdown) => dropdown.parentValue.includes(ownerType?.code));
//     if (dropdownData.length == 1 && dropdownValue != dropdownData[0]) {
//       setTypeOfDropdownValue(dropdownData[0]);
//     }
//   }

//   const GuardianOptions = [
//     { name: "Father", code: "FATHER", i18nKey: "COMMON_MASTERS_OWNERTYPE_FATHER" },
//     { name: "HUSBAND", code: "HUSBAND", i18nKey: "COMMON_MASTERS_OWNERTYPE_HUSBAND" },
//   ];

//   const { isLoading, data: genderTypeData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["GenderType"]);

//   const { data: Menu, isLoading : isSpecialcategoryLoading } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "OwnerType");
//   Menu ? Menu.sort((a, b) => a.name.localeCompare(b.name)) : "";

  let menu = [
    { i18nKey: 'WS_PERMANENT', code: `permanent`, value: `permanent` },
    { i18nKey: 'WS_TEMPORARY', code: `temporary`, value: `temporary` }
  ];
//   genderTypeData &&
//     genderTypeData["common-masters"].GenderType.filter(data => data.active).map((genderDetails) => {
//       menu.push({ i18nKey: `COMMON_GENDER_${genderDetails.code}`, code: `${genderDetails.code}`, value: `${genderDetails.code}` });
//     });


//   useEffect(() => {
//     (async () => {
//       setError(null);
//       if (file) {
//         if (file.size >= 2000000) {
//           setError(t("PT_MAXIMUM_UPLOAD_SIZE_EXCEEDED"));
//         } else {
//           try {
//             const response = await Digit.UploadServices.Filestorage("property-upload", file, Digit.ULBService.getStateId());
//             if (response?.data?.files?.length > 0) {
//               setUploadedFile(response?.data?.files[0]?.fileStoreId);
//             } else {
//               setError(t("PT_FILE_UPLOAD_ERROR"));
//             }
//           } catch (err) {
//             // console.error("Modal -> err ", err);
//             setError(t("PT_FILE_UPLOAD_ERROR"));
//           }
//         }
//       }
//     })();
//   }, [file]);






const goNext = () => {
  onSelect("DocsReq", "");
}


  const onSkip = () => onSelect();
  const filedChange = () => {

  }

  return (
    <div>
       {userType === "citizen" && (<Timeline currentStep={2} />)}
        {/* {!isLoading ?  */}
        <FormStep
          config={config}
          // onSelect={goNext}
          onSkip={onSkip}
          t={t}       
        >
         
        <div style={{padding:"10px",paddingTop:"20px",marginTop:"10px"}}>
        <CardLabel>{t("WS_APPLICATION_FORM")}</CardLabel>
        <CardLabel>
          {t('WS_CUSTOMER_NUMBER')}
          <span style={{float:'right'}}>PG-WS-2021-09-29-006024</span>
        </CardLabel>
        
        <CardLabel>{`${t("WS_DISCONNECTION_TYPE")}*`}</CardLabel>
          <RadioButtons
              t={t}
              options={menu}
              optionsKey="code"
              name="type"
              value={disconnectionData.type}
            //   selectedOption={disconnectionData.type}
              onSelect={filedChange}
              isDependent={true}
              labelKey="WS_DISCONNECTION_TYPE"
          />
          
        <CardLabel>{`${t("WS_DISCONEECTION_DATE")}*`}</CardLabel>
            <TextInput
              t={t}
              type={"text"}
              style={{background:"#FAFAFA"}}
              isMandatory={false}
              optionKey="i18nKey"
              name="date"
              value={disconnectionData.date}
              onChange={filedChange}
            />


          <LabelFieldPair>
              <CardLabel>{t("WS_DISCONNECTION_REASON")}</CardLabel>              
                <TextArea
                  isMandatory={false}
                  optionKey="i18nKey"
                  t={t}
                  name={"reason"}
                  onChange={filedChange}
                  value={disconnectionData.reason}
                  // onChange={(e) => {
                  //   if (!(ownerDetails?.[index]?.isCoresAddr === true)) {
                  //     updateState("permanentAddress", index, e.target.value);
                  //   }
                  // }}
                />              
          </LabelFieldPair>
          <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={goNext} />

          </div>
        </FormStep>
        
         {/* : <Loader /> } */}
    </div>
  );
};

export default WSDisConnectionForm;