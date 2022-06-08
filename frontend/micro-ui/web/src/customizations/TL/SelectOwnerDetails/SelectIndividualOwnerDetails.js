import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FormStep,
  TextInput,
  CardLabel,
  RadioOrSelect,
  MobileNumber,
  DatePicker,
  LinkButton,
} from "@egovernments/digit-ui-react-components";

import { useForm, Controller } from "react-hook-form";

import _ from "lodash";
import { getPattern } from "../../utils";

const newOwner = {
  mobileNumber: "",
  name: "",
  fatherOrHusbandName: "",
  relationship: "",
  gender: "",
  DOB: "",
  email: "",
  pan: "",
  correspondenceAddress: "",
  tradeRelationship: "",
};

const SelectIndividualOwner = ({ t, config, onSelect, userType, formData }) => {
  let ismultiple = formData?.ownershipCategory?.code?.includes("SINGLEOWNER")
    ? false
    : true;

  const [owners, setOwners] = useState(() => {
    return formData?.[config.key]?.owners?.length
      ? formData?.[config.key]?.owners
      : [newOwner];
  });

  useEffect(() => {
    if (!ismultiple && owners.length > 1) {
      setOwners([owners[0]]);
    }
  }, [owners]);

  const setOwner = (index, owner) => {
    setOwners(owners?.map((e, i) => (index === i ? owner : e)));
  };

  const addOwner = () => {
    setOwners([...owners, newOwner]);
  };

  const deleteOwner = (index) => {
    setOwners(
      owners.filter((e, i) => {
        console.log(index, i, e, index == i ? "deleted" : "", "index");
        return index != i;
      })
    );
  };

  const goNext = () => {
    onSelect(config.key, {
      owners: owners?.map((e) => {
        const { errors, ...o } = e;
        return o;
      }),
    });
  };

  return (
    <FormStep
      config={config}
      onSelect={goNext}
      isDisabled={
        owners?.filter?.((e) => Object.keys(e?.errors || {}).length)?.length
      }
      t={t}
    >
      {owners?.map((_owner, i) => {
        const { ...owner } = _owner;
        return (
          <IndividualOwnerForm
            {...{
              t,
              config,
              onSelect,
              userType,
              formData,
              setOwner,
              owner,
              owners,
              deleteOwner,
            }}
            ownerIndex={i}
            key={i}
          />
        );
      })}
      {ismultiple && (
        <div>
          {/* <hr color="#d6d5d4" className="break-line"></hr> */}
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              paddingBottom: "15px",
              color: "#FF8C00",
            }}
          >
            <button
              type="button"
              style={{ paddingTop: "10px" }}
              onClick={() => addOwner()}
            >
              {t("TL_ADD_OWNER_LABEL")}
            </button>
          </div>
        </div>
      )}
    </FormStep>
  );
};

const IndividualOwnerForm = ({
  t,
  config,
  onSelect,
  userType,
  formData,
  owner,
  setOwner,
  ownerIndex,
  owners,
  deleteOwner,
}) => {
  const stateId = window.Digit.ULBService.getStateId();
  const { data: genderMenu } = window.Digit.Hooks.tl.useTLGenderMDMS(
    stateId,
    "common-masters",
    "GenderType",
    {}
  );

  let ismultiple = formData?.ownershipCategory?.code?.includes("SINGLEOWNER")
    ? false
    : true;

  const defaultValues = {
    mobileNumber: owner?.mobileNumber,
    name: owner?.name,
    fatherOrHusbandName: owner?.fatherOrHusbandName,
    relationship: owner?.relationship,
    gender: owner?.gender,
    DOB: owner?.DOB,
    email: owner?.email,
    pan: owner?.pan,
    correspondenceAddress: owner?.correspondenceAddress,
    tradeRelationship: owner?.tradeRelationship,
  };

  const [_formValue, setFormValue] = useState(defaultValues);

  const TradeRelationshipMenu = [
    { i18nKey: "TL_PROPRIETOR", code: "PROPRIETOR" },
    { i18nKey: "TL_PARTNER", code: "PARTNER" },
    { i18nKey: "TL_DIRECTOR", code: "DIRECTOR" },
    { i18nKey: "TL_AUTHORIZEDSIGNATORY", code: "AUTHORIZEDSIGNATORY" },
  ];

  const relationshipMenu = [
    { i18nKey: "TL_FATHER", code: "FATHER" },
    { i18nKey: "TL_HUSBAND", code: "HUSBAND" },
  ];

  const { control, setError, setValue, formState, watch, trigger } = useForm({
    defaultValues,
  });

  const { errors } = formState;

  const formValue = watch();
  useEffect(() => {
    const keys = Object.keys(formValue);
    const part = {};
    keys.forEach((key) => (part[key] = _formValue[key]));
    if (!_.isEqual(formValue, part)) {
      trigger();
      setFormValue(formValue);
      setOwner(ownerIndex, { ...formValue, errors });
    }
  }, [formValue]);

  useEffect(() => {
    if (owner) {
      Object.keys(owners[ownerIndex])?.forEach((key) => {
        if (key !== "errors") setValue(key, owners[ownerIndex]?.[key]);
      });
    }
  }, [owner]);

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    setOwner(ownerIndex, { ...formValue, errors });
  }, [errors]);

  return (
    <div
      style={
        ismultiple
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
      {ismultiple && (
        <LinkButton
          label={
            <div>
              <span>
                <svg
                  style={{
                    float: "right",
                    position: "relative",
                    bottom: "5px",
                  }}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z"
                    fill={!(owners.length == 1) ? "#494848" : "#FAFAFA"}
                  />
                </svg>
              </span>
            </div>
          }
          style={{ width: "100px", display: "inline" }}
          onClick={(e) => deleteOwner(ownerIndex)}
        />
      )}
     
      <CardLabel>{t("TL_OWNER_NAME") + "*"}</CardLabel>
      <div className="field-container">
        <Controller
          name="name"
          rules={{ required: t("REQUIRED_FIELD"), validate: { pattern: (val) => (/^[^{0-9}^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,._:;“”‘’]+$/.test(val) ? true : t("INVALID_NAME")) } }}
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              onBlur={onBlur}
            />
          )}
        />
      </div>
      <CardLabel>{t("TL_MOBILE_NUMBER_LABEL") + "*"}</CardLabel>
      <Controller
        name="mobileNumber"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <MobileNumber onChange={onChange} value={value} />
        )}
      />
      <CardLabel>{t("TL_FATHER_HUSBAND_NAME_LABEL") + "*"}</CardLabel>
      <div className="field-container">
        <Controller
          name="fatherOrHusbandName"
          rules={{ required: true, pattern: getPattern("Name") }}
          control={control}
          render={({ onChange, onBlur, value }) => (
            <TextInput
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        />
      </div>

      <CardLabel>{t("TL_RELATIONSHIP") + "*"}</CardLabel>
      <Controller
        name="relationship"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <RadioOrSelect
            options={relationshipMenu || []}
            onSelect={onChange}
            selectedOption={value}
            optionKey={"i18nKey"}
            onBlur={onBlur}
            t={t}
          />
        )}
      />

      <CardLabel>{t("TL_GENDER_LABEL") + "*"}</CardLabel>
      <Controller
        name="gender"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <RadioOrSelect
            options={genderMenu || []}
            onSelect={onChange}
            selectedOption={value}
            optionKey={"i18nKey"}
            onBlur={onBlur}
            t={t}
          />
        )}
      />

      <CardLabel>{t("TL_EMAIL_LABEL")}</CardLabel>
      <Controller
        name="email"
        rules={{ pattern: getPattern("Email") }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <div className="field-container">
            <TextInput
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        )}
      />

      <CardLabel>{t("TL_PAN_NO_LABEL")}</CardLabel>
      <Controller
        name="pan"
        rules={{ pattern: getPattern("PAN") }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <TextInput value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      />

      <CardLabel>{t("TL_DATE_OF_BIRTH_LABEL") + "*"}</CardLabel>
      <Controller
        name="DOB"
        rules={{ required: true }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <DatePicker onChange={onChange} date={value} />
        )}
      />

      <CardLabel>{t("TL_CORRESPONDENCE_ADDRESS_LABEL") + "*"}</CardLabel>
      <Controller
        name="correspondenceAddress"
        rules={{ required: true, pattern: getPattern("Address") }}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <div className="field-container">
            <TextInput
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        )}
      />

      <CardLabel>{t("TL_TRADE_RELATIONSHIP")}</CardLabel>
      <Controller
        name="tradeRelationship"
        rules={{}}
        control={control}
        render={({ onChange, onBlur, value }) => (
          <RadioOrSelect
            options={TradeRelationshipMenu || []}
            onSelect={onChange}
            selectedOption={value}
            optionKey={"i18nKey"}
            onBlur={onBlur}
            t={t}
          />
        )}
      />
    </div>
  );
};

export default SelectIndividualOwner;
