import { CardLabel, CheckBox, Dropdown, FormStep, Loader, MobileNumber, RadioButtons, TextInput, UploadFile,LabelFieldPair,TextArea,SubmitBar, CitizenInfoLabel, CardHeader } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import DisconnectTimeline from "../components/DisconnectTimeline";
import { stringReplaceAll } from "../utils";

const WSDisConnectionForm = ({ t, config, onSelect, userType, formData, ownerIndex }) => {
  let validation = {};
  const storedData = formData?.WSDisConnectionForm?.WSDisConnectionForm||formData?.WSDisConnectionForm
  
  const [disconnectionData, setDisconnectionData] = useState({
      type: storedData.type || "",
      date: storedData.date || "",
      reason: storedData.reason || "",
  })

  useEffect(() =>{
    setDisconnectionData({
      type:storedData.type||"",
      date: storedData.date || "",
      reason: storedData.reason || "",
    });
  },[]);




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
    { i18nKey: 'WS_PERMANENT', code: `type`, value: `PERMANENT` },
    { i18nKey: 'WS_TEMPORARY', code: `type`, value: `TEMPORARY` }
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






// const goNext = () => {
//   onSelect("DocsReq", "");
// }
const handleSubmit = () => onSelect(config.key, { WSDisConnectionForm: disconnectionData });

  const onSkip = () => onSelect();
  const filedChange = (val) => {
    const oldData = {...disconnectionData};
    oldData[val.code]=val;
    setDisconnectionData(oldData);
  }

  return (
    <div>
       {userType === "citizen" && (<DisconnectTimeline currentStep={1} />)}
        {/* {!isLoading ?  */}
        <FormStep
          config={config}
          onSelect={handleSubmit}
          onSkip={onSkip}
          t={t}       
        >
         
        <div style={{padding:"10px",paddingTop:"20px",marginTop:"10px"}}>
        <CardHeader>{t("WS_APPLICATION_FORM")}</CardHeader>
        <CardLabel>
          {t('WS_CONSUMER_NUMBER')} 
          <span style={{float:'right'}}>PG-WS-2021-09-29-006024</span>
        </CardLabel>
        
        <CardLabel>{t("WS_DISCONNECTION_TYPE")}</CardLabel>
          <RadioButtons
              t={t}
              options={menu}
              optionsKey="i18nKey"
              value={disconnectionData.type?.value}
              selectedOption={disconnectionData.type}
              isMandatory={false}
              onSelect={filedChange}
              labelKey="WS_DISCONNECTION_TYPE"
          />
          
        <CardLabel>{t("WS_DISCONNECTION_DATE")}</CardLabel>
            <TextInput
              t={t}
              type={"text"}
              style={{background:"#FAFAFA"}}
              isMandatory={false}
              optionKey="i18nKey"
              name="date"
              value={disconnectionData?.date?.value}
              onChange={(e) => filedChange({code:"date" , value:e.target.value})}

            />


          <LabelFieldPair>
              <CardLabel>{t("WS_DISCONNECTION_REASON")}</CardLabel>              
                <TextArea
                  isMandatory={false}
                  optionKey="i18nKey"
                  t={t}
                  name={"reason"}
                  value={disconnectionData.reason?.value}
                  onChange={(e) => filedChange({code:"reason" , value:e.target.value})}
                />              
          </LabelFieldPair>
          <SubmitBar label={t(`CS_COMMON_NEXT`)} submit={true} />
        </div>
        </FormStep>
        <CitizenInfoLabel style={{ margin: "0px" }} textStyle={{ color: "#0B0C0C" }} text={t(`WS_DISONNECT_APPL_INFO`)} />
        
         {/* : <Loader /> } */}
    </div>
  );
};

export default WSDisConnectionForm;