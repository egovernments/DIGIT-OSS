import { CardLabel, FormStep, LinkButton, Loader, RadioOrSelect, TextInput } from "@egovernments/digit-ui-react-components";
import isUndefined from "lodash/isUndefined";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Timeline from "../components/TLTimeline";
import { commonTransform, getUniqueItemsFromArray, stringReplaceAll } from "../utils";
import { sortDropdownNames } from "../utils/index";

const SelectAccessoriesDetails = ({ t, config, onSelect, userType, formData }) => {
  let validation = {};
  const [Accessory, setAccessory] = useState(formData?.TadeDetails?.accessories?.Accessory || "");
  const [AccessoryCount, setAccessoryCount] = useState(formData?.TadeDetails?.accessories?.AccessoryCount || "");
  const [UnitOfMeasure, setUnitOfMeasure] = useState(formData?.TadeDetails?.accessories?.UnitOfMeasure || "");
  const [UomValue, setUomValue] = useState(formData?.TadeDetails?.accessories?.UomValue || "");
  const [fields, setFeilds] = useState(
    formData?.TradeDetails && formData?.TradeDetails?.accessories && formData?.TradeDetails?.accessories.length > 0
      ? formData?.TradeDetails?.accessories
      : [{ accessory: "", accessorycount: "", unit: null, uom: null }]
  );
  const [AccCountError, setAccCountError] = useState(null);
  const [AccUOMError, setAccUOMError] = useState(null);
  const TenantId = Digit.ULBService.getCitizenCurrentTenant();

  //const isUpdateProperty = formData?.isUpdateProperty || false;
  //let isEditProperty = formData?.isEditProperty || false;
  let isEditTrade = window.location.href.includes("edit-application");
  let isRenewTrade = window.location.href.includes("renew-trade");
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();

  const { isLoading, data: Data = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", "AccessoryCategory");
  const [accessories, SetAccessories] = useState([]);
  const { data: billingSlabData } = Digit.Hooks.tl.useTradeLicenseBillingslab({ tenantId: TenantId, filters: {} });

  useEffect(() => {
    if (billingSlabData && billingSlabData?.billingSlab && billingSlabData?.billingSlab?.length > 0) {
      const processedData =
        billingSlabData.billingSlab &&
        billingSlabData.billingSlab.reduce(
          (acc, item) => {
            let accessory = { active: true };
            let tradeType = { active: true };
            if (item.accessoryCategory && item.tradeType === null) {
              accessory.code = item.accessoryCategory;
              accessory.uom = item.uom;
              accessory.rate = item.rate;
              item.rate && item.rate > 0 && acc.accessories.push(accessory);
            } else if (item.accessoryCategory === null && item.tradeType) {
              tradeType.code = item.tradeType;
              tradeType.uom = item.uom;
              tradeType.structureType = item.structureType;
              tradeType.licenseType = item.licenseType;
              tradeType.rate = item.rate;
              !isUndefined(item.rate) && item.rate !== null && acc.tradeTypeData.push(tradeType);
            }
            return acc;
          },
          { accessories: [], tradeTypeData: [] }
        );

      const accessories = getUniqueItemsFromArray(processedData.accessories, "code");
      let structureTypes = getUniqueItemsFromArray(processedData.tradeTypeData, "structureType");
      structureTypes = commonTransform(
        {
          StructureType: structureTypes.map((item) => {
            return { code: item.structureType, active: true };
          }),
        },
        "StructureType"
      );
      let licenseTypes = getUniqueItemsFromArray(processedData.tradeTypeData, "licenseType");
      licenseTypes = licenseTypes.map((item) => {
        return { code: item.licenseType, active: true };
      });

      accessories.forEach((data) => {
        data.i18nKey = t(`TRADELICENSE_ACCESSORIESCATEGORY_${stringReplaceAll(data?.code?.toUpperCase(), "-", "_")}`);
      });

      // sessionStorage.setItem("TLlicenseTypes", JSON.stringify(licenseTypes));
      SetAccessories(accessories);
    }
  }, [billingSlabData]);

  function getAccessoryCategoryDropDown() {
    let AccessoryCategoryMenu = [];
    Data &&
      Data?.TradeLicense?.AccessoriesCategory.map((ob) => {
        AccessoryCategoryMenu.push({ i18nKey: `TRADELICENSE_ACCESSORIESCATEGORY_${ob.code.replaceAll("-", "_")}`, code: `${ob.code}` });
      });
    return AccessoryCategoryMenu;
  }
  function handleAdd() {
    const values = [...fields];
    values.push({ accessory: "", accessorycount: "", unit: null, uom: null });
    setFeilds(values);
  }

  function handleRemove(index) {
    const values = [...fields];
    if (values.length != 1) {
      values.splice(index, 1);
      setFeilds(values);
    }
  }

  function selectAccessory(i, value) {
    let acc = [...fields];
    acc[i].accessory = value;
    setAccessory(value);
    setFeilds(acc);
    acc[i].accessorycount = "";
    acc[i].uom = "";
    acc[i].unit = null;
    Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
    setUnitOfMeasure(null);
    Data?.TradeLicense?.AccessoriesCategory.map((ob) => {
      if (value.code === ob.code && ob.uom != null) {
        acc[i].unit = ob.uom;
        setUnitOfMeasure(ob.uom);
      }
    });
  }
  function selectAccessoryCount(i, e) {
    setAccCountError(null);
    if (isNaN(e.target.value)) setAccCountError("TL_ONLY_NUM_ALLOWED");
    let acc = [...fields];
    acc[i].accessorycount = e.target.value;
    setAccessoryCount(e.target.value);
    setFeilds(acc);
  }
  function selectUnitOfMeasure(i, e) {
    let acc = [...fields];
    acc[i].unit = e.target.value;
    setUnitOfMeasure(e.target.value);
    setFeilds(acc);
  }
  function selectUomValue(i, e) {
    setAccUOMError(null);
    if (isNaN(e.target.value)) setAccUOMError("TL_ONLY_NUM_ALLOWED");
    let acc = [...fields];
    acc[i].uom = e.target.value;
    setUomValue(e.target.value);
    setFeilds(acc);
  }

  const goNext = () => {
    let data = formData.TradeDetails;
    let formdata;
    sessionStorage.setItem("VisitedAccessoriesDetails", true);
    formdata = { ...data, accessories: fields };
    onSelect(config.key, formdata);
  };

  function canMoveNext(){
    if(!fields?.[0]?.accessory || !fields?.[0]?.accessorycount || (fields?.[0]?.unit && !fields?.[0]?.uom) || AccCountError || AccUOMError)
    return true
    else 
    return false
  }

  const onSkip = () => onSelect();
  return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline /> : null}
      {isLoading ? (
        <Loader />
      ) : (
        <FormStep
          config={config}
          onSelect={goNext}
          onSkip={onSkip}
          t={t}
          forcedError={t(AccCountError) || t(AccUOMError)}
          isDisabled={canMoveNext()}
        >
          {fields.map((field, index) => {
            return (
              <div key={`${field}-${index}`}>
                <div
                  style={{
                    border: "solid",
                    borderRadius: "5px",
                    padding: "10px",
                    paddingTop: "20px",
                    marginTop: "10px",
                    borderColor: "#f3f3f3",
                    background: "#FAFAFA",
                  }}
                >
                  <CardLabel>{`${t("TL_ACCESSORY_LABEL")}*`}</CardLabel>
                  <LinkButton
                    label={
                      <div>
                        <span>
                          <svg
                            style={{ float: "right", position: "relative", bottom: "32px" }}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z"
                              fill={!(fields.length == 1) ? "#494848" : "#FAFAFA"}
                            />
                          </svg>
                        </span>
                      </div>
                    }
                    style={{ width: "100px", display: "inline" }}
                    onClick={(e) => handleRemove(index)}
                  />
                  {!isLoading ? (
                    <RadioOrSelect
                      t={t}
                      optionKey="i18nKey"
                      isMandatory={config.isMandatory}
                      //options={[{ i18nKey: "a" }, { i18nKey: "a" }, { i18nKey: "a" }, { i18nKey: "a" }, { i18nKey: "a" }, { i18nKey: "a" }]}
                      options={sortDropdownNames(accessories.length !== 0 ? accessories : getAccessoryCategoryDropDown(), "i18nKey", t)}
                      selectedOption={field.accessory}
                      onSelect={(e) => selectAccessory(index, e)}
                      isPTFlow={true}
                    />
                  ) : (
                    <Loader />
                  )}
                  <CardLabel>{`${t("TL_ACCESSORY_COUNT_LABEL")}*`}</CardLabel>
                  <TextInput
                    style={{ background: "#FAFAFA" }}
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="AccessoryCount"
                    value={field.accessorycount}
                    onChange={(e) => selectAccessoryCount(index, e)}
                    disable={(isEditTrade || isRenewTrade) && (formData?.TradeDetails?.accessories.length - 1 < index ? false : field.accessorycount)}
                    /* {...(validation = {
            isRequired: true,
            pattern: "^[a-zA-Z-.`' ]*$",
            type: "text",
            title: t("PT_NAME_ERROR_MESSAGE"),
          })} */
                  />
                  <CardLabel>{`${t("TL_UNIT_OF_MEASURE_LABEL")}`}</CardLabel>
                  <TextInput
                    style={{ background: "#FAFAFA" }}
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="UnitOfMeasure"
                    value={field.unit}
                    onChange={(e) => selectUnitOfMeasure(index, e)}
                    disable={true}
                    /* {...(validation = {
            isRequired: true,
            pattern: "^[a-zA-Z-.`' ]*$",
            type: "text",
            title: t("PT_NAME_ERROR_MESSAGE"),
          })} */
                  />
                  <CardLabel>{`${t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL")}*`}</CardLabel>
                  <TextInput
                    style={{ background: "#FAFAFA" }}
                    t={t}
                    type={"text"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    name="UomValue"
                    value={field.uom}
                    onChange={(e) => selectUomValue(index, e)}
                    disable={
                      isEditTrade || isRenewTrade
                        ? (isEditTrade || isRenewTrade) && (formData?.TradeDetails?.accessories.length - 1 < index ? false : field.uom)
                        : !field.unit
                    }
                    //disable={isUpdateProperty || isEditProperty}
                    {...(validation = {
                      isRequired: true,
                      pattern: "[0-9]+",
                      type: "text",
                      title: t("TL_WRONG_UOM_VALUE_ERROR"),
                    })}
                  />
                </div>
              </div>
            );
          })}
          {/* <hr color="#d6d5d4" className="break-line"></hr> */}
          <div style={{ justifyContent: "center", display: "flex", paddingBottom: "15px", color: "#FF8C00" }}>
            <button type="button" style={{ paddingTop: "10px" }} onClick={() => handleAdd()}>
              {`${t("TL_ADD_MORE_TRADE_ACC")}`}
            </button>
          </div>
        </FormStep>
      )}
    </React.Fragment>
  );
};

export default SelectAccessoriesDetails;
