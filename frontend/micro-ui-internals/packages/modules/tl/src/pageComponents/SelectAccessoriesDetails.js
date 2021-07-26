import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, RadioOrSelect, LinkButton } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import {sortDropdownNames} from "../utils/index";

const SelectAccessoriesDetails = ({ t, config, onSelect, userType, formData }) => {
  let validation = {};
  const [Accessory, setAccessory] = useState(formData?.TadeDetails?.accessories?.Accessory || "");
  const [AccessoryCount, setAccessoryCount] = useState(formData?.TadeDetails?.accessories?.AccessoryCount || "");
  const [UnitOfMeasure, setUnitOfMeasure] = useState(formData?.TadeDetails?.accessories?.UnitOfMeasure || "");
  const [UomValue, setUomValue] = useState(formData?.TadeDetails?.accessories?.UomValue || "");
  const [fields, setFeilds] = useState(
    formData?.TradeDetails && formData?.TradeDetails?.accessories && formData?.TradeDetails?.accessories.length>0? (formData?.TradeDetails?.accessories) : [{ accessory: "", accessorycount: "", unit: null, uom: null }]
  );

  //const isUpdateProperty = formData?.isUpdateProperty || false;
  //let isEditProperty = formData?.isEditProperty || false;
  let isEditTrade = window.location.href.includes("edit-application");
  let isRenewTrade = window.location.href.includes("renew-trade");
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];

  const { isLoading, data: Data = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "TradeLicense", "AccessoryCategory");

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
    if(values.length!=1){
    values.splice(index,1);
    setFeilds(values);
    }
  }

  function selectAccessory(i, value) {
    let acc = [...fields];
    acc[i].accessory = value;
    setAccessory(value);
    setFeilds(acc);
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
    let acc = [...fields];
    acc[i].uom = e.target.value;
    setUomValue(e.target.value);
    setFeilds(acc);
  }

  const goNext = () => {
    let data = formData.TradeDetails.Units;
    let formdata;

    formdata = { ...data, accessories: fields };
    // debugger;
    onSelect(config.key, formdata);
  };

  const onSkip = () => onSelect();

  return (
    <FormStep
      config={config}
      onSelect={goNext}
      onSkip={onSkip}
      t={t}
      isDisabled={!fields?.[0]?.accessory || !fields?.[0]?.accessorycount || !fields?.[0]?.uom}
    >
      {fields.map((field, index) => {
        return (
          <div key={`${field}-${index}`}>
            <div style={{border:"solid",borderRadius:"5px",padding:"10px",paddingTop:"20px",marginTop:"10px",borderColor:"#f3f3f3"}}>
            <CardLabel>{`${t("TL_ACCESSORY_LABEL")}`}</CardLabel>
            <LinkButton
            label={
            <div>
            <span>
            <svg style={{float:"right", position:"relative",bottom:"32px"  }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill="#494848"/>
            </svg>
            </span>
            </div>
            }
              style={{ width: "100px", display:"inline" }}
              onClick={(e) => handleRemove(index)}
           />
            <RadioOrSelect
              t={t}
              optionKey="i18nKey"
              isMandatory={config.isMandatory}
              //options={[{ i18nKey: "a" }, { i18nKey: "a" }, { i18nKey: "a" }, { i18nKey: "a" }, { i18nKey: "a" }, { i18nKey: "a" }]}
              options={sortDropdownNames(getAccessoryCategoryDropDown(),"i18nKey",t)}
              selectedOption={field.accessory}
              onSelect={(e) => selectAccessory(index, e)}
            />
            <CardLabel>{`${t("TL_ACCESSORY_COUNT_LABEL")}`}</CardLabel>
            <TextInput
              t={t}
              type={"text"}
              isMandatory={false}
              optionKey="i18nKey"
              name="AccessoryCount"
              value={field.accessorycount}
              onChange={(e) => selectAccessoryCount(index, e)}
              disable={(isEditTrade || isRenewTrade) && (formData?.TradeDetails?.accessories.length-1<index?false:field.accessorycount)}
              /* {...(validation = {
            isRequired: true,
            pattern: "^[a-zA-Z-.`' ]*$",
            type: "text",
            title: t("PT_NAME_ERROR_MESSAGE"),
          })} */
            />
            <CardLabel>{`${t("TL_UNIT_OF_MEASURE_LABEL")}`}</CardLabel>
            <TextInput
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
            <CardLabel>{`${t("TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL")}`}</CardLabel>
            <TextInput
              t={t}
              type={"text"}
              isMandatory={false}
              optionKey="i18nKey"
              name="UomValue"
              value={field.uom}
              onChange={(e) => selectUomValue(index, e)}
              disable={(isEditTrade || isRenewTrade)?((isEditTrade || isRenewTrade) && (formData?.TradeDetails?.accessories.length-1<index?false:field.uom)):!field.unit}
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
        <button type="button" style={{paddingTop:"10px"}} onClick={() => handleAdd()}>
          {`${t("TL_ADD_MORE_TRADE_ACC")}`}
        </button>
      </div>
    </FormStep>
  );
};

export default SelectAccessoriesDetails;
