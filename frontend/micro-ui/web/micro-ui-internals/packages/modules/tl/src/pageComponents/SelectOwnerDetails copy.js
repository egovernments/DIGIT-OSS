import React, { useEffect, useState, useMemo } from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, CheckBox, LinkButton, CardHeader } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { getPattern } from "../utils";

const SelectOwnerDetails = ({ t, config, onSelect, userType, formData }) => {
  const {ownershipCategory:{code: keyToSearchOwnershipSubtype}={}} = formData
  let validation = {};
  let isedittrade = window.location.href.includes("edit-application");
  let isrenewtrade = window.location.href.includes("renew-trade");
  const [canmovenext, setCanmovenext] = useState(isedittrade || isrenewtrade?false:true); 
  const [name, setName] = useState(formData?.owners?.name || "");
  
  const [isPrimaryOwner, setisPrimaryOwner] = useState(false);
  const [gender, setGender] = useState(formData?.owners?.gender);
  const [mobilenumber, setMobileNumber] = useState(formData?.owners?.mobilenumber || "");
  const [fields, setFeilds] = useState(
    (formData?.owners && formData?.owners?.owners) || [{ name: "", gender: "", mobilenumber: null, isprimaryowner: false }]
  );
  const [isInstitutional, setInstitutional] = useState(false)
  const ismultiple = useMemo(() => {
    if (formData?.ownershipCategory?.code.includes("SINGLEOWNER")) return false
    if (formData?.ownershipCategory?.code.includes("INSTITUTIONAL")) {
      setInstitutional(true)
      return false
    }
    else return true
  },[formData?.ownershipCategory]);
  const relationshipMenu = [{
    code: "FATHER",
    i18nKey: "COMMON_RELATION_FATHER"
  }, {
    code: "HUSBAND",
    i18nKey: "COMMON_RELATION_HUSBAND"
  }]
  useEffect(() => {
    fields.map((ob) => {
      if(isInstitutional){
        if(ob.institutionName && ob.mobilenumber){
          setCanmovenext(false);
        }
        else{
          setCanmovenext(true);
        }
      }
      else{
        if(ob.name && ob.mobilenumber && ob.gender){
          setCanmovenext(false);
        }
        else{
          setCanmovenext(true);
        }
      }
    })
  },[fields])


  const isUpdateProperty = formData?.isUpdateProperty || false;
  let isEditProperty = formData?.isEditProperty || false;
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const {data: Menu} = Digit.Hooks.tl.useTLGenderMDMS(stateId, "common-masters", "GenderType");

  
  let TLmenu = [];
    Menu &&
      Menu.map((genders) => {
        TLmenu.push({i18nKey: `TL_GENDER_${genders.code}`, code: `${genders.code}`})
    });

  function handleAdd() {
    const values = [...fields];
    values.push({ name: "", gender: "", mobilenumber: null, isprimaryowner: false });
    setFeilds(values);
    setCanmovenext(true);
    
  }

  function handleRemove(index) {
    const values = [...fields];
    if(values.length !=1)
    {values.splice(index,1);
    setFeilds(values);}
   
  }

  function setOwnerName(i, e) {
    let units = [...fields];
    units[i].name = e.target.value;
    setName(e.target.value);
    setFeilds(units);
    if(units[i].gender && units[i].mobilenumber && units[i].name){
      setCanmovenext(false);}
  }

  function setGenderName(i, value) {
    let units = [...fields];
    units[i].gender = value;
    setGender(value);
    setFeilds(units);
    if(units[i].gender && units[i].mobilenumber && units[i].name){
    setCanmovenext(false);}
  }
  function setRelationShip(i, value) {
    let units = [...fields];
    units[i].relationship = value;
    setRelationshipStatus(value)
    setFeilds(units);
    if(units[i].gender && units[i].mobilenumber && units[i].name && units[i].relationship && units[i].fatherOrHusbandName){
      setCanmovenext(false);
    }
  }
  function setMobileNo(i, e) {
    let units = [...fields];
    units[i].mobilenumber = e.target.value;
    setMobileNumber(e.target.value);
    setFeilds(units);
    if(units[i].gender && units[i].mobilenumber && units[i].name){
      setCanmovenext(false);}
  }
  function setPrimaryOwner(i, e) {
    let units = [...fields];
    units.map((units) => {
      units.isprimaryowner = false;
    });
    units[i].isprimaryowner = ismultiple ? e.target.checked : true;
    setisPrimaryOwner(e.target.checked);
    setFeilds(units);
  }
  const [error, setError] = useState(null);

 

  const goNext = () => {
    setError(null);
    if(ismultiple == true && fields.length==1)
    {
      setError("TL_ERROR_MULTIPLE_OWNER");
    }
    else{
    let owner = formData.owners;
    let ownerStep;
    ownerStep = { ...owner, owners: fields };
    onSelect(config.key, ownerStep);
    }
  };

  const onSkip = () => onSelect();
  // As Ticket RAIN-2619 other option in gender and gaurdian will be enhance , dont uncomment it
  const options = [
    { name: "Female", value: "FEMALE", code: "FEMALE" },
    { name: "Male", value: "MALE", code: "MALE" },
    { name: "Transgender", value: "TRANSGENDER", code: "TRANSGENDER" },
    { name: "OTHERS", value: "OTHERS", code: "OTHERS" },
    // { name: "Other", value: "OTHER", code: "OTHER" },
  ];

  const { data: institutionOwnershipTypeOptions } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "TradeOwnershipSubType",{ keyToSearchOwnershipSubtype });
  const [institutionName, setInstitutionName] = useState(formData?.owners?.[0]?.fatherOrHusbandName || "");
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState(formData?.owners?.[0]?.fatherOrHusbandName || "");
  const [institutionType, setInstitutionType] = useState(formData?.subOwnerShipCategory || "");
  const [authroizedDesignation, setAuthroizedDesignation] = useState(formData?.institution?.designation || "")
  const [altContactNo, setAltContactNo] = useState(formData?.owners?.[0]?.altContactNumber || "")
  const [emailId, setEmailId] = useState(formData?.owners?.[0]?.emailId || "")
  const [relationship, setRelationshipStatus] = useState()

  function setInstitutionNameHandler(i, e){
    let units = [...fields];
    units[i].institutionName = e.target.value;
    setInstitutionName(e.target.value)
    setFeilds(units);
    if(units[i].mobilenumber && units[i].institutionName && units[i].institutionType){
      setCanmovenext(false);
    }
  }
  function setFatherOrHusbandNameHandler(i, e){
    let units = [...fields];
    units[i].fatherOrHusbandName = e.target.value;
    setFatherOrHusbandName(e.target.value)
    setFeilds(units);
    if(units[i].mobilenumber && units[i].institutionName && units[i].institutionType  && units[i].relationship && units[i].fatherOrHusbandName){
      setCanmovenext(false);
    }
  }
  function setInstitutionTypeHandler(i, value){
    let units = [...fields];
    units[i].fatherOrHusbandName = value;
    setInstitutionType(value)
    setFeilds(units);
    if(units[i].mobilenumber && units[i].institutionName && units[i].fatherOrHusbandName){
      setCanmovenext(false);
    }
  }
  function setAltContactNoHandler(i, e){
    let units = [...fields];
    units[i].altContactNo = e.target.value;
    setAltContactNo(e.target.value)
    setFeilds(units);
    if(units[i].mobilenumber && units[i].institutionName && units[i].institutionType){
      setCanmovenext(false);
    }
  }
  function setAuthroizedDesignationHandler(i, e){
    let units = [...fields];
    units[i].designation = e.target.value;
    setAuthroizedDesignation(e.target.value)
    setFeilds(units);
    if(units[i].mobilenumber && units[i].institutionName && units[i].institutionType){
      setCanmovenext(false);
    }
  }
  function setEmailIdHandler(i, e){
    let units = [...fields];
    units[i].emailId = e.target.value;
    setEmailId(e.target.value)
    setFeilds(units);
    if(units[i].mobilenumber && units[i].institutionName && units[i].institutionType){
      setCanmovenext(false);
    }
  }

  // useEffect(() => {
  //   if( institutionName && institutionType && mobilenumber && institutionName !== "" && institutionType !== "" && mobilenumber !== "" ){
  //     setCanmovenext(false)
  //   } else{
  //     setCanmovenext(true)
  //   }
  // },[institutionName, institutionType, mobilenumber])

  if(isInstitutional === true && ismultiple === false){
    return (
      <FormStep config={config} onSelect={goNext} onSkip={onSkip} t={t} isDisabled={canmovenext} forcedError={t(error)}>
        {fields.map((field, index) => {
          return (
            <div key={`${field}-${index}`}>
              <div>
              <CardLabel>{`${t("TL_INSTITUTION_NAME_LABEL")}*`}</CardLabel>
              <TextInput
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="institutionName"
                value={field.institutionName}
                onChange={(e) => setInstitutionNameHandler(index, e)}
                //disable={isUpdateProperty || isEditProperty}
                {...(validation = {
                  isRequired: true,
                  pattern: "^[a-zA-Z-.`' ]*$",
                  type: "text",
                  title: t("TL_NAME_ERROR_MESSAGE"),
                })}
              />
              <CardLabel>{`${t("TL_INSTITUTION_TYPE_LABEL")}*`}</CardLabel>
              <Dropdown
                t={t}
                option={institutionOwnershipTypeOptions}
                selected={institutionType}
                select={value => {
                  setInstitutionTypeHandler(index, value)
                }
                }
                optionKey="i18nKey"
                // value={field.subOwnerShipCategory}
                // onChange={(e) => setInstitutionName(index, e)}
              />
              <CardHeader>{t("TL_AUTHORIZED_PERSON_DETAILS")}</CardHeader>
              <CardLabel>{`${t("TL_NEW_OWNER_DETAILS_NAME_LABEL")}`}</CardLabel>
              <TextInput
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="name"
                value={field.name}
                onChange={(e) => setOwnerName(index, e)}
                //disable={isUpdateProperty || isEditProperty}
                {...(validation = {
                  // isRequired: true,
                  pattern: "^[a-zA-Z-.`' ]*$",
                  type: "text",
                  title: t("TL_NAME_ERROR_MESSAGE"),
                })}
              />
              <CardLabel>{`${t("TL_NEW_OWNER_DESIG_LABEL")}`}</CardLabel>
              <TextInput
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="designation"
                value={field.designation}
                onChange={(e) => setAuthroizedDesignationHandler(index, e)}
                //disable={isUpdateProperty || isEditProperty}
                {...(validation = {
                  // isRequired: true,
                  pattern: "^[a-zA-Z-.`' ]*$",
                  type: "text",
                  title: t("TL_NAME_ERROR_MESSAGE"),
                })}
              />
              <CardLabel>{`${t("TL_MOBILE_NUMBER_LABEL")}*`}</CardLabel>
              <div className="field-container">
                <span className="employee-card-input employee-card-input--front" style={{ marginTop: "-1px" }}>
                  +91
                </span>
                <TextInput
                  type={"text"}
                  t={t}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="mobilenumber"
                  value={field.mobilenumber}
                  onChange={(e) => setMobileNo(index, e)}
                  //disable={isUpdateProperty || isEditProperty}
                  {...(validation = {
                    isRequired: true,
                    pattern: "[6-9]{1}[0-9]{9}",
                    type: "tel",
                    title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
                  })}
                />
              </div>
              <CardLabel>{`${t("TL_TELEPHONE_NUMBER_LABEL")}`}</CardLabel>
              <div className="field-container">
                <span className="employee-card-input employee-card-input--front" style={{ marginTop: "-1px" }}>
                  +91
                </span>
                <TextInput
                  type={"text"}
                  t={t}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="telephone"
                  value={field.telephone}
                  onChange={(e) => setAltContactNoHandler(index, e)}
                  //disable={isUpdateProperty || isEditProperty}
                  {...(validation = {
                    // isRequired: true,
                    pattern: "[6-9]{1}[0-9]{9}",
                    type: "tel",
                    title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
                  })}
                />
              </div>
              <CardLabel>{`${t("NOC_APPLICANT_EMAIL_LABEL")}`}</CardLabel>
              <TextInput
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="emailId"
                value={field.emailId}
                onChange={(e) => setEmailIdHandler(index, e)}
                //disable={isUpdateProperty || isEditProperty}
                {...(validation = {
                  // isRequired: true,
                  // pattern: getPattern("Email"),
                  type: "text",
                  title: t("TL_EMAIL_ERROR_MESSAGE"),
                })}
              />
            </div>
            </div>
          );
        })}
      </FormStep>
    )
  }

  return (
    <FormStep config={config} onSelect={goNext} onSkip={onSkip} t={t} isDisabled={canmovenext} forcedError={t(error)}>
      {fields.map((field, index) => {
        return (
          <div key={`${field}-${index}`}>
            <div style={ismultiple ? {border:"solid",borderRadius:"5px",padding:"10px",paddingTop:"20px",marginTop:"10px",borderColor:"#f3f3f3",background:"#FAFAFA"}:{}}>
            <CardLabel style={ismultiple?{marginBottom:"-15px"}: {}}>{`${t("TL_NEW_OWNER_DETAILS_NAME_LABEL")}`}</CardLabel>
           {ismultiple && <LinkButton
            label={
            <div >
            <span>
            <svg style={{float:"right", position:"relative",bottom:"5px"  }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill={!(fields.length == 1)?"#494848":"#FAFAFA"}/>
            </svg>
            </span>
            </div>
            }
              style={{ width: "100px", display:"inline" }}
              onClick={(e) => handleRemove(index)}
           />}
            <TextInput
              style={ismultiple?{background:"#FAFAFA"}:{}}
              t={t}
              type={"text"}
              isMandatory={false}
              optionKey="i18nKey"
              name="name"
              value={field.name}
              onChange={(e) => setOwnerName(index, e)}
              //disable={isUpdateProperty || isEditProperty}
              {...(validation = {
                isRequired: true,
                pattern: "^[a-zA-Z-.`' ]*$",
                type: "text",
                title: t("TL_NAME_ERROR_MESSAGE"),
              })}
            />
            <CardLabel>{`${t("TL_NEW_OWNER_DETAILS_GENDER_LABEL")}`}</CardLabel>
            <RadioButtons
              t={t}
              options={TLmenu}
              optionsKey="code"
              name="gender"
              value={gender}
              selectedOption={field.gender}
              onSelect={(e) => setGenderName(index, e)}
              isDependent={true}
              labelKey="TL_GENDER"
              //disabled={isUpdateProperty || isEditProperty}
            />
            <CardLabel>{`${t("TL_MOBILE_NUMBER_LABEL")}`}</CardLabel>
            <div className="field-container">
              <span className="employee-card-input employee-card-input--front" style={{ marginTop: "-1px" }}>
                +91
              </span>
              <TextInput
                style={ismultiple?{background:"#FAFAFA"}:{}}
                type={"text"}
                t={t}
                isMandatory={false}
                optionKey="i18nKey"
                name="mobilenumber"
                value={field.mobilenumber}
                onChange={(e) => setMobileNo(index, e)}
                //disable={isUpdateProperty || isEditProperty}
                {...(validation = {
                  isRequired: true,
                  pattern: "[6-9]{1}[0-9]{9}",
                  type: "tel",
                  title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
                })}
              />
            </div>
            <CardLabel>{`${t("TL_NEW_OWNER_DETAILS_GUARDIAN_LABEL")}`}</CardLabel>
            <TextInput
              style={ismultiple?{background:"#FAFAFA"}:{}}
              t={t}
              type={"text"}
              isMandatory={true}
              name="fatherOrHusbandName"
              value={field.fatherOrHusbandName}
              onChange={(e) => setFatherOrHusbandNameHandler(index, e)}
              //disable={isUpdateProperty || isEditProperty}
              {...(validation = {
                isRequired: true,
                pattern: "^[a-zA-Z-.`' ]*$",
                type: "text",
                title: t("TL_NAME_ERROR_MESSAGE"),
              })}
            />
            <RadioButtons
              t={t}
              options={relationshipMenu}
              optionsKey="i18nKey"
              name="relationship"
              value={relationship}
              selectedOption={field.relationship}
              onSelect={(e) => setRelationShip(index, e)}
              labelKey=""
            />
            {ismultiple && (
              <CheckBox
                label={t("TL_PRIMARY_OWNER_LABEL")}
                onChange={(e) => setPrimaryOwner(index, e)}
                value={field.isprimaryowner}
                checked={field.isprimaryowner}
                style={{ paddingTop: "10px" }}
                //disable={isUpdateProperty || isEditProperty}
              />
            )}
          </div>
          </div>
        );
      })}
      {ismultiple && (
        <div>
          {/* <hr color="#d6d5d4" className="break-line"></hr> */}
          <div style={{ justifyContent: "center", display: "flex", paddingBottom: "15px", color: "#FF8C00" }}>
            <button type="button" style={{paddingTop:"10px"}} onClick={() => handleAdd()}>
              {t("TL_ADD_OWNER_LABEL")}
            </button>
          </div>
        </div>
      )}
    </FormStep>
  );
};

export default SelectOwnerDetails;
