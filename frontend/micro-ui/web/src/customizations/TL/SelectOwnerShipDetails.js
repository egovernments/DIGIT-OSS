import React, { useState, useEffect, useMemo } from "react";
import {
  FormStep,
  RadioOrSelect,
  RadioButtons,
  LabelFieldPair,
  Dropdown,
  CardLabel,
  CardLabelError,
} from "@egovernments/digit-ui-react-components";
import { cardBodyStyle } from "../utils";
import { useLocation } from "react-router-dom";

const SelectOwnerShipDetails = ({
  t,
  config,
  onSelect,
  userType,
  formData,
  onBlur,
  formState,
  setError,
  clearErrors,
}) => {
  const selectedValue = formData?.[config.key]?.code;

  const stateId = window.Digit.ULBService.getStateId();

  const { isLoading, data: Menu } = window.Digit.Hooks.tl.useTradeLicenseMDMS(
    stateId,
    "common-masters",
    ["OwnerShipCategory"],
    "",
    { select: (d) => d["common-masters"]["OwnerShipCategory"] }
  );

  const [mainOwnerShipType, setMainOwnership] = useState();

  const [ownership, setOwnerShip] = useState();

  const ownserShipTypeMenu = useMemo(() => {
    let obj = {};
    Menu?.forEach((e) => {
      let val = e.code.split(".")[0];
      obj[val] = val;
    });
    return Object.keys(obj).map((e) => ({ code: e }));
  }, [Menu]);

  const subOwnerShipMenu = useMemo(
    () =>
      Menu?.filter((e) => e.code?.split(".")[0] === mainOwnerShipType?.code),
    [mainOwnerShipType]
  );

  let isRenewal = window.location.href.includes("tl/renew-application-details");
  if (window.location.href.includes("tl/edit-application-details")) isRenewal = true;

  useEffect(() => {
    if (
      ownership?.code &&
      !ownership?.code?.includes(mainOwnerShipType?.code)
    ) {
      setOwnerShip(null);
    } else if (selectedValue) {
      setOwnerShip({ code: selectedValue });
    }
  }, [mainOwnerShipType]);

  useEffect(() => {
    if (selectedValue?.includes(mainOwnerShipType?.code)) {
      setOwnerShip(subOwnerShipMenu?.find((o) => selectedValue === o.code));
    }
  }, [subOwnerShipMenu]);

  useEffect(() => {
    if (Menu?.length) {
      setMainOwnership(
        ownserShipTypeMenu.find((o) => selectedValue?.split(".")[0] === o?.code)
      );
    }
  }, [Menu]);

  useEffect(() => {
    if (userType === "employee")
      onSelect(config.key, { code: ownership?.code });
  }, [ownership]);

  console.log(selectedValue, ownership, subOwnerShipMenu, formData,"selectedValue");

  const goNext = (data) => {
    onSelect(config.key, { code: ownership?.code });
  };

  if (userType === "employee") {
    return (
      <React.Fragment>
        <LabelFieldPair>
          <CardLabel
            className="card-label-smaller"
            style={{ color: "#B1B4B6" }}
          >
            {`${t("TL_NEW_OWNER_DETAILS_OWNERSHIP_TYPE_LABEL")} * :`}
          </CardLabel>
          <div className="field">
            <RadioOrSelect
              options={ownserShipTypeMenu || []}
              onSelect={setMainOwnership}
              optionKey={"code"}
              selectedOption={mainOwnerShipType}
              t={t}
              isDependent={false}
              disabled={isRenewal}
            />
          </div>
        </LabelFieldPair>
        <LabelFieldPair>
            <CardLabel>{t("TL_SUBOWNERSHIP_TYPE")}</CardLabel>
          <div className="field">
            <Dropdown
              option={subOwnerShipMenu || []}
              select={setOwnerShip}
              optionKey={"code"}
              selected={ownership}
              t={t}
              disable={isRenewal}
            />
          </div>
        </LabelFieldPair>
      </React.Fragment>
    );
  }

  return (
    <FormStep
      t={t}
      config={config}
      onSelect={goNext}
      isDisabled={!ownership?.code}
    >
      <CardLabel>{t("TL_OWNERSHIP_TYPE")}</CardLabel>
      <RadioOrSelect
        options={ownserShipTypeMenu || []}
        onSelect={setMainOwnership}
        optionKey={"code"}
        selectedOption={mainOwnerShipType}
        t={t}
        isDependent={false}
        disabled={false}
      />
      {subOwnerShipMenu?.length ? (
        <React.Fragment>
          <CardLabel>{t("TL_SUBOWNERSHIP_TYPE")}</CardLabel>
          <RadioOrSelect
            options={subOwnerShipMenu || []}
            onSelect={setOwnerShip}
            optionKey={"code"}
            selectedOption={ownership}
            t={t}
            isDependent={false}
            disabled={false}
          />
        </React.Fragment>
      ) : null}
    </FormStep>
  );
};

const customize = () => {
  window.Digit.ComponentRegistryService.setComponent(
    "SelectOwnerShipDetails",
    SelectOwnerShipDetails
  );
};

export default customize;
