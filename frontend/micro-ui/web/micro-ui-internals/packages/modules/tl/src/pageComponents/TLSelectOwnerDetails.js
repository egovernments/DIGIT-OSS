import React, { useEffect, useState, useMemo, useReducer } from "react";
import {
  FormStep,
  TextInput,
  CardLabel,
  RadioButtons,
  LabelFieldPair,
  Dropdown,
  CheckBox,
  LinkButton,
  CardHeader,
  Loader,
} from "@egovernments/digit-ui-react-components";

import Timeline from "../components/TLTimeline";

const TLSelectOwnerDetails = ({ t, config, onSelect, userType, formData }) => {
  let { ownershipCategory: { code: keyToSearchOwnershipSubtype } = {} } = formData;
  const typeOfOwner = useMemo(() => {
    if (formData?.ownershipCategory?.code.includes("SINGLEOWNER")) return "SINGLEOWNER";
    if (formData?.ownershipCategory?.code.includes("INSTITUTIONAL")) return "INSTITUTIONAL";
    else return "MULTIOWNER";
  }, [formData?.ownershipCategory]);
  const storedOwnerData = formData?.owners?.owners;
  const initFn = (initData) => {
    switch (typeOfOwner) {
      case "SINGLEOWNER":
        return [
          {
            name: initData?.[0]?.name || "",
            gender: initData?.[0]?.gender,
            mobilenumber: initData?.[0]?.mobilenumber,
            isprimaryowner: true,
            fatherOrHusbandName: initData?.[0]?.fatherOrHusbandName || "",
            // subOwnerShipCategory: formData?.subOwnerShipCategory || "",
            // designation: formData?.institution?.designation || "",
            // altContactNumber: initData?.[0]?.altContactNumber || "",
            emailId: initData?.[0]?.emailId || "",
            relationship: initData?.[0]?.relationship || "",
            id: initData?.[0]?.id || "",
            uuid: initData?.[0]?.uuid || "",
          },
        ];
      case "MULTIOWNER":
        return initData?.length > 1
          ? initData?.map((owner) => ({
              name: owner?.name || "",
              gender: owner?.gender,
              mobilenumber: owner?.mobilenumber,
              isprimaryowner: owner?.isprimaryowner,
              fatherOrHusbandName: owner?.fatherOrHusbandName || "",
              emailId: initData?.emailId || "",
              relationship: owner?.relationship || "",
              id: owner.id || "",
              uuid: owner.uuid || "",
            }))
          : [
              {
                name: null,
                gender: null,
                mobilenumber: null,
                isprimaryowner: true,
                fatherOrHusbandName: null,
                emailId: null,
                relationship: null,
              },
            ];
      case "INSTITUTIONAL":
        return [
          {
            name: initData?.[0]?.name || "",
            // gender: initData?.gender,
            mobilenumber: initData?.[0]?.mobilenumber,
            // isprimaryowner: true,
            institutionName: initData?.[0]?.institutionName || "",
            subOwnerShipCategory: initData?.[0]?.subOwnerShipCategory || "",
            designation: initData?.[0]?.designation || "",
            altContactNumber: initData?.[0]?.altContactNumber || "",
            emailId: initData?.[0]?.emailId || "",
            id: initData?.[0]?.id || "",
            uuid: initData?.[0]?.uuid || "",
            // relationship: initData?.[0]?.relationship || "",
          },
        ];
    }
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD_NEW_OWNER":
        return [
          ...state,
          {
            name: "",
            gender: null,
            mobilenumber: null,
            relationship: "",
            fatherOrHusbandName: "",
            emailId: "",
            isprimaryowner: false,
          },
        ];
      case "REMOVE_THIS_OWNER":
        return state.filter((e, i) => i !== action?.payload?.index);
      case "SET_PRIMARY_OWNER":
        if (action?.payload?.index >= 0) {
          return state?.map((ownerData, i) => {
            if (i === action?.payload?.index) {
              return { ...ownerData, isprimaryowner: true };
            } else {
              return { ...ownerData, isprimaryowner: false };
            }
          });
        } else {
          return state;
        }
      case "EDIT_CURRENT_OWNER_PROPERTY":
        return state?.map((data, __index) => {
          if (__index === action.payload.index) {
            return { ...data, [action.payload.key]: action.payload.value };
          } else {
            return data;
          }
        });
    }
  };

  const [formState, dispatch] = useReducer(reducer, storedOwnerData, initFn);

  const relationshipMenu = [
    {
      code: "FATHER",
      i18nKey: "COMMON_RELATION_FATHER",
    },
    {
      code: "HUSBAND",
      i18nKey: "COMMON_RELATION_HUSBAND",
    },
  ];

  const stateId = Digit.ULBService.getStateId();
  const isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("/renew-trade/");

  const { data: Menu, isLoading: isGenderLoading } = Digit.Hooks.tl.useTLGenderMDMS(stateId, "common-masters", "GenderType");
  if (isEdit) keyToSearchOwnershipSubtype = keyToSearchOwnershipSubtype.split(".")[0];
  const { data: institutionOwnershipTypeOptions } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "TradeOwnershipSubType", {
    keyToSearchOwnershipSubtype,
  });

  let TLmenu = [];
  Menu &&
    Menu?.map((genders) => {
      TLmenu.push({ i18nKey: `TL_GENDER_${genders.code}`, code: `${genders.code}` });
    });

  function handleTextInputField(index, e, key) {
    dispatch({ type: "EDIT_CURRENT_OWNER_PROPERTY", payload: { index, key, value: e.target.value } });
  }

  function handleRadioButtonInput(index, value, key) {
    dispatch({ type: "EDIT_CURRENT_OWNER_PROPERTY", payload: { index, key, value } });
  }
  function handleDropdownInputField(index, value, key) {
    dispatch({ type: "EDIT_CURRENT_OWNER_PROPERTY", payload: { index, key, value } });
  }

  const [error, setError] = useState(null);

  function checkMandatoryFieldsForEachOwner(ownersData) {
    if (typeOfOwner === "INSTITUTIONAL") {
      if (ownersData[0]?.name && ownersData[0]?.subOwnerShipCategory && ownersData[0]?.mobilenumber) {
        setError("TL_ERROR_FILL_ALL_MANDATORY_DETAILS");
        return false;
      } else return true;
    } else if (typeOfOwner === "SINGLEOWNER") {
      if (ownersData[0]?.name && ownersData[0]?.gender && ownersData[0]?.mobilenumber) {
        setError("TL_ERROR_FILL_ALL_MANDATORY_DETAILS");
        return false;
      } else return true;
    } else if (typeOfOwner === "MULTIOWNER") {
      return ownersData.reduce((acc, ownerData) => {
        if (ownerData?.name && ownerData?.gender && ownerData?.mobilenumber) {
          setError("TL_ERROR_FILL_ALL_MANDATORY_DETAILS");
          return false;
        }
      }, true);
    }
  }

  const goNext = () => {
    if (!checkMandatoryFieldsForEachOwner(formState)) {
      let owner = formData.owners;
      let ownerStep;
      ownerStep = { ...owner, owners: formState };
      onSelect(config.key, ownerStep);
    }
  };

  const onSkip = () => onSelect();

  if (typeOfOwner === "INSTITUTIONAL") {
    return (
      <React.Fragment>
        {window.location.href.includes("/citizen") ? <Timeline currentStep={2} /> : null}
        <FormStep config={config} onSelect={goNext} onSkip={onSkip} t={t} isDisabled={false} forcedError={t(error)}>
          {formState?.map((field, index) => {
            return (
              <div key={`${field}-${index}`}>
                <div>
                  <CardLabel>{`${t("TL_INSTITUTION_NAME_LABEL")}*`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    name="institutionName"
                    value={field.institutionName}
                    ValidationRequired={true}
                    onChange={(e) => handleTextInputField(index, e, "institutionName")}
                    //disable={isUpdateProperty || isEditProperty}
                    {...{
                      validation: {
                        isRequired: true,
                        pattern: "^[a-z0-9]+( [a-z0-9]+)*$",
                        type: "text",
                        title: t("TL_NAME_ERROR_MESSAGE"),
                      },
                    }}
                  />
                  <CardLabel>{`${t("TL_INSTITUTION_TYPE_LABEL")}*`}</CardLabel>
                  <Dropdown
                    t={t}
                    option={institutionOwnershipTypeOptions}
                    selected={field.subOwnerShipCategory}
                    select={(value) => {
                      handleDropdownInputField(index, value, "subOwnerShipCategory");
                    }}
                    optionKey="i18nKey"
                  />
                  <CardHeader>{t("TL_AUTHORIZED_PERSON_DETAILS")}</CardHeader>
                  <CardLabel>{`${t("TL_NEW_OWNER_DETAILS_NAME_LABEL")}`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    name="name"
                    value={field.name}
                    onChange={(e) => handleTextInputField(index, e, "name")}
                    ValidationRequired={true}
                    {...{
                      validation: {
                        // isRequired: true,
                        pattern: "^[a-z0-9]+( [a-z0-9]+)*$",
                        type: "text",
                        title: t("TL_NAME_ERROR_MESSAGE"),
                      },
                    }}
                  />
                  <CardLabel>{`${t("TL_NEW_OWNER_DESIG_LABEL")}`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    name="designation"
                    value={field.designation}
                    onChange={(e) => handleTextInputField(index, e, "designation")}
                    ValidationRequired={true}
                    //disable={isUpdateProperty || isEditProperty}
                    {...{
                      validation: {
                        // isRequired: true,
                        pattern: "^[a-z0-9]+( [a-z0-9]+)*$",
                        type: "text",
                        title: t("TL_NAME_ERROR_MESSAGE"),
                      },
                    }}
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
                      name="mobilenumber"
                      value={field.mobilenumber}
                      onChange={(e) => handleTextInputField(index, e, "mobilenumber")}
                      ValidationRequired={true}
                      //disable={isUpdateProperty || isEditProperty}
                      {...{
                        validation: {
                          isRequired: true,
                          pattern: "[6-9]{1}[0-9]{9}",
                          type: "tel",
                          title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
                        },
                      }}
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
                      name="altContactNumber"
                      value={field.altContactNumber}
                      onChange={(e) => handleTextInputField(index, e, "altContactNumber")}
                      ValidationRequired={true}
                      //disable={isUpdateProperty || isEditProperty}
                      {...{
                        validation: {
                          // isRequired: true,
                          pattern: "[0][1-9][0-9]{9}|[1-9][0-9]{9}",
                          type: "tel",
                          title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
                        },
                      }}
                    />
                  </div>
                  <CardLabel>{`${t("NOC_APPLICANT_EMAIL_LABEL")}`}</CardLabel>
                  <TextInput
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    name="emailId"
                    value={field.emailId}
                    onChange={(e) => handleTextInputField(index, e, "emailId")}
                    ValidationRequired={true}
                    //disable={isUpdateProperty || isEditProperty}
                    {...{
                      validation: {
                        // isRequired: true,
                        // pattern: getPattern("Email"),
                        type: "text",
                        title: t("TL_EMAIL_ERROR_MESSAGE"),
                      },
                    }}
                  />
                </div>
              </div>
            );
          })}
        </FormStep>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline currentStep={2} /> : null}
      <FormStep config={config} onSelect={goNext} onSkip={onSkip} t={t} isDisabled={false} forcedError={t(error)}>
        {formState?.map((field, index) => {
          return (
            <div key={`${field}-${index}`}>
              <div
                style={
                  typeOfOwner === "MULTIOWNER"
                    ? {
                        border: "solid",
                        borderRadius: "5px",
                        padding: "10px",
                        paddingTop: "20px",
                        marginTop: "10px",
                        borderColor: "#f3f3f3",
                        background: "#FAFAFA",
                      }
                    : {}
                }
              >
                <CardLabel style={{}}>{`${t(
                  "TL_NEW_OWNER_DETAILS_NAME_LABEL"
                )}*`}</CardLabel>
                {typeOfOwner === "MULTIOWNER" && (
                  <LinkButton
                    label={
                      <div>
                        <span>
                          <svg
                            style={{ float: "right", position: "relative", bottom: "5px" }}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z"
                              fill={!(formState.length == 1) ? "#494848" : "#FAFAFA"}
                            />
                          </svg>
                        </span>
                      </div>
                    }
                    style={{ width: "100px", display: "inline" }}
                    onClick={(e) => dispatch({ type: "REMOVE_THIS_OWNER", payload: { index } })}
                  />
                )}
                <TextInput
                  style={typeOfOwner === "MULTIOWNER" ? { background: "#FAFAFA" } : {}}
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  optionKey="i18nKey"
                  name="name"
                  value={field.name}
                  onChange={(e) => handleTextInputField(index, e, "name")}
                  ValidationRequired={true}
                  //disable={isUpdateProperty || isEditProperty}
                  {...{
                    validation: {
                      isRequired: true,
                      pattern: "[a-zA-Z][a-zA-Z ]+[a-zA-Z]$",
                      type: "text",
                      title: t("TL_NAME_ERROR_MESSAGE"),
                    },
                  }}
                />
                <CardLabel>{`${t("TL_NEW_OWNER_DETAILS_GENDER_LABEL")}*`}</CardLabel>
                {!isGenderLoading ? (
                  <RadioButtons
                    t={t}
                    options={TLmenu}
                    optionsKey="i18nKey"
                    name={`gender-${index}`}
                    selectedOption={field.gender}
                    onSelect={(e) => handleRadioButtonInput(index, e, "gender")}
                    labelKey=""
                    isPTFlow={true}
                    //disabled={isUpdateProperty || isEditProperty}
                  />
                ) : (
                  <Loader />
                )}
                <CardLabel>{`${t("TL_MOBILE_NUMBER_LABEL")}*`}</CardLabel>
                <div className="field-container">
                  <span className="employee-card-input employee-card-input--front" style={{ marginTop: "-1px" }}>
                    +91
                  </span>
                  <TextInput
                    style={typeOfOwner === "MULTIOWNER" ? { background: "#FAFAFA",maxWidth:"500px" } : {maxWidth:"500px"}}
                    type={"text"}
                    t={t}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="mobilenumber"
                    value={field.mobilenumber}
                    onChange={(e) => handleTextInputField(index, e, "mobilenumber")}
                    ValidationRequired={true}
                    //disable={isUpdateProperty || isEditProperty}
                    {...{
                      validation: {
                        isRequired: true,
                        pattern: "[6-9]{1}[0-9]{9}",
                        type: "tel",
                        title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
                      },
                    }}
                  />
                </div>
                <CardLabel>{`${t("TL_NEW_OWNER_DETAILS_GUARDIAN_LABEL")}*`}</CardLabel>
                <TextInput
                  style={typeOfOwner === "MULTIOWNER" ? { background: "#FAFAFA" } : {}}
                  t={t}
                  type={"text"}
                  isMandatory={false}
                  name="fatherOrHusbandName"
                  value={field.fatherOrHusbandName}
                  onChange={(e) => handleTextInputField(index, e, "fatherOrHusbandName")}
                  ValidationRequired={true}
                  //disable={isUpdateProperty || isEditProperty}
                  {...{
                    validation: {
                      isRequired: true,
                      pattern: "[a-zA-Z][a-zA-Z ]+[a-zA-Z]$",
                      type: "text",
                      title: t("TL_NAME_ERROR_MESSAGE"),
                    },
                  }}
                />
                <CardLabel>{`${t("TL_RELATIONSHIP_WITH_GUARDIAN_LABEL")}*`}</CardLabel>
                <RadioButtons
                  t={t}
                  options={relationshipMenu}
                  optionsKey="i18nKey"
                  name={`relationship-${index}`}
                  value={field.relationship}
                  selectedOption={field.relationship}
                  onSelect={(e) => handleRadioButtonInput(index, e, "relationship")}
                  labelKey=""
                  isPTFlow={true}
                />
                {typeOfOwner === "MULTIOWNER" && (
                  <CheckBox
                    label={t("TL_PRIMARY_OWNER_LABEL")}
                    onChange={(e) => dispatch({ type: "SET_PRIMARY_OWNER", payload: { index } })}
                    value={field.isprimaryowner}
                    checked={field.isprimaryowner}
                    style={{ paddingTop: "10px" }}
                    name={`multiowner-checkbox-${index}`}
                    //disable={isUpdateProperty || isEditProperty}
                  />
                )}
              </div>
            </div>
          );
        })}
        {typeOfOwner === "MULTIOWNER" && (
          <div>
            {/* <hr color="#d6d5d4" className="break-line"></hr> */}
            <div style={{ justifyContent: "center", display: "flex", paddingBottom: "15px", color: "#FF8C00" }}>
              <button type="button" style={{ paddingTop: "10px" }} onClick={() => dispatch({ type: "ADD_NEW_OWNER" })}>
                {t("TL_ADD_OWNER_LABEL")}
              </button>
            </div>
          </div>
        )}
      </FormStep>
    </React.Fragment>
  );
};

export default TLSelectOwnerDetails;
