import React, { useEffect, useState } from "react";
import {
  FormStep,
  TextInput,
  CardLabel,
  RadioButtons,
  LabelFieldPair,
  Dropdown,
  RadioOrSelect,
  LinkButton,
} from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";
import { sortDropdownNames } from "../utils/index";

const SelectTradeUnits = ({ t, config, onSelect, userType, formData }) => {
  let validation = {};
  const [TradeCategory, setTradeCategory] = useState("");
  const [TradeType, setTradeType] = useState(
    formData?.TadeDetails?.Units?.TradeType || ""
  );
  const [TradeSubType, setTradeSubType] = useState(
    formData?.TadeDetails?.Units?.TradeSubType || ""
  );
  const [UnitOfMeasure, setUnitOfMeasure] = useState(
    formData?.TadeDetails?.Units?.UnitOfMeasure || ""
  );
  const [UomValue, setUomValue] = useState(
    formData?.TadeDetails?.Units?.UomValue || ""
  );
  const [fields, setFeilds] = useState(
    (formData?.TradeDetails && formData?.TradeDetails?.units) || [
      {
        tradecategory: "",
        tradetype: "",
        tradesubtype: "",
        unit: null,
        uom: null,
      },
    ]
  );

  const { data: billingSlabData } =
    window.Digit.Hooks.tl.useTradeLicenseBillingslab(
      {
        tenantId: formData?.address?.city?.code,
        filters: { applicationType: "NEW" },
      },
      {
          select: (d) => {
            const structureType = formData?.TradeDetails?.StructureType?.code?.includes("IMMOVABLE")
                ? formData?.TradeDetails?.BuildingType?.code
                : formData?.TradeDetails?.VehicleType?.code;
          return d?.["billingSlab"]?.filter(
            (e) =>
              e.structureType?.includes(structureType) &&
              e.applicationType === "NEW"
          );
        },
      }
    );
    
    useEffect(() => {
      console.log(
        billingSlabData,
        "billslab"
      );
    }, [billingSlabData]); 

  const tenantId = window.Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];

  function handleAdd() {
    const values = [...fields];
    values.push({
      tradecategory: "",
      tradetype: "",
      tradesubtype: "",
      unit: null,
      uom: null,
    });
    setFeilds(values);
  }

  function handleRemove(index) {
    const values = [...fields];
    if (values.length != 1) {
      values.splice(index, 1);
      setFeilds(values);
    }
  }

  const { isLoading, data: Data = {} } =
    window.Digit.Hooks.tl.useTradeLicenseMDMS(
      stateId,
      "TradeLicense",
      "TradeUnits",
      "[?(@.type=='TL')]"
    );
  let TradeCategoryMenu = [];
  //let TradeTypeMenu = [];

  Data &&
    Data.TradeLicense &&
    Data.TradeLicense.TradeType.map((ob) => {
      if (
        !TradeCategoryMenu.some(
          (TradeCategoryMenu) =>
            TradeCategoryMenu.code === `${ob.code.split(".")[0]}`
        )
      ) {
        TradeCategoryMenu.push({
          i18nKey: `TRADELICENSE_TRADETYPE_${ob.code.split(".")[0]}`,
          code: `${ob.code.split(".")[0]}`,
        });
      }
    });

  function getTradeTypeMenu(TradeCategory) {
    let TradeTypeMenu = [];
    Data &&
      Data.TradeLicense &&
      Data.TradeLicense.TradeType.map((ob) => {
        if (
          ob.code.split(".")[0] === TradeCategory.code &&
          !TradeTypeMenu.some(
            (TradeTypeMenu) => TradeTypeMenu.code === `${ob.code.split(".")[1]}`
          )
        ) {
          TradeTypeMenu.push({
            i18nKey: `TRADELICENSE_TRADETYPE_${ob.code.split(".")[1]}`,
            code: `${ob.code.split(".")[1]}`,
          });
        }
      });
      TradeTypeMenu = TradeTypeMenu.filter((e) => billingSlabData?.some(f=>f?.tradeType?.includes(e.code)));

      console.log(TradeTypeMenu, "TradeTypeMenu");
    return TradeTypeMenu;
  }

  function getTradeSubTypeMenu(TradeType) {
    let TradeSubTypeMenu = [];
    TradeType &&
      Data &&
      Data.TradeLicense &&
      Data.TradeLicense.TradeType.map((ob) => {
        if (
          ob.code.split(".")[1] === TradeType.code &&
          !TradeSubTypeMenu.some(
            (TradeSubTypeMenu) => TradeSubTypeMenu.code === `${ob.code}`
          )
        ) {
          TradeSubTypeMenu.push({
            i18nKey: `TL_${ob.code}`,
            code: `${ob.code}`,
          });
        }
      });
      TradeSubTypeMenu = TradeSubTypeMenu.filter((e) =>
        billingSlabData?.some((f) => f?.tradeType === (e.code))
      );
       console.log(TradeSubTypeMenu, "TradeSubTypeMenu");

    return TradeSubTypeMenu;
  }

  const isUpdateProperty = formData?.isUpdateProperty || false;
  let isEditProperty = formData?.isEditProperty || false;
  const { pathname: url } = useLocation();
  const editScreen = url.includes("/modify-application/");

  function getBillingSlab(index,value){
    let currentBillingSlab;
    if(value?.code){
      currentBillingSlab=billingSlabData.filter((item)=>{
      return item.tradeType===value.code
     })
     let currentFields=[...fields];
     currentFields[index].rate=currentBillingSlab?.[0].rate;
     setFeilds([...currentFields])
    }
  }

  function selectTradeCategory(i, value) {
    let units = [...fields];
    units[i].tradecategory = value;
    setTradeCategory(value);
    selectTradeType(i, null);
    selectTradeSubType(i, null);
    setFeilds(units);
  }
  function selectTradeType(i, value) {
    let units = [...fields];
    units[i].tradetype = value;
    setTradeType(value);
    selectTradeSubType(i, null);
    setFeilds(units);
  }
  function selectTradeSubType(i, value) {
    let units = [...fields];
    units[i].tradesubtype = value;
    getBillingSlab(i,value)
    setTradeSubType(value);
    if (value == null) {
      units[i].unit = null;
      setUnitOfMeasure(null);
    }
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    value &&
      Data &&
      Data.TradeLicense &&
      Data.TradeLicense.TradeType.map((ob) => {
        if (value.code === ob.code) {
          units[i].unit = ob.uom;
          setUnitOfMeasure(ob.uom);
          // setFeilds(units);
        }
      });
    setFeilds(units);
  }
  function selectUnitOfMeasure(i, e) {
    let units = [...fields];
    units[i].unit = e.target.value;
    setUnitOfMeasure(e.target.value);
    setFeilds(units);
  }
  function selectUomValue(i, e) {
    let units = [...fields];
    units[i].uom = e.target.value;
    setUomValue(e.target.value);
    setFeilds(units);
  }

  const goNext = () => {
    let units = formData.TradeDetails.Units;
    let unitsdata;

    unitsdata = {
      ...units,
      units: fields.map((e) => ({
        ...e,
        rate: billingSlabData?.find(
          (f) => f.tradeType === e?.tradesubtype?.code
        ).rate,
      })),
    };
    onSelect(config.key, unitsdata);
  };

  const onSkip = () => onSelect();

  const GuardianOptions = [
    { name: "HUSBAND", code: "HUSBAND", i18nKey: "PT_RELATION_HUSBAND" },
    { name: "Father", code: "FATHER", i18nKey: "PT_RELATION_FATHER" },
    // { name: "Husband/Wife", code: "HUSBANDWIFE", i18nKey: "PT_RELATION_HUSBANDWIFE" },
    // { name: "Other", code: "OTHER", i18nKey: "PT_RELATION_OTHER" },
  ];

  return (
    <FormStep
      config={config}
      onSelect={goNext}
      onSkip={onSkip}
      t={t}
      isDisabled={
        !fields[0].tradecategory ||
        !fields[0].tradetype ||
        !fields[0].tradesubtype
      }
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
              <CardLabel>{`${t(
                "TL_NEW_TRADE_DETAILS_TRADE_CAT_LABEL"
              )}`}</CardLabel>
              <LinkButton
                label={
                  <div>
                    <span>
                      <svg
                        style={{
                          float: "right",
                          position: "relative",
                          bottom: "32px",
                        }}
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
              <RadioButtons
                t={t}
                options={TradeCategoryMenu}
                optionsKey="code"
                name="TradeCategory"
                value={TradeCategory}
                //selectedOption={TradeCategory}
                selectedOption={field?.tradecategory}
                onSelect={(e) => selectTradeCategory(index, e)}
                isDependent={true}
                labelKey="TRADELICENSE_TRADETYPE"
                //disabled={isUpdateProperty || isEditProperty}
              />
              <CardLabel>{`${t(
                "TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL"
              )}`}</CardLabel>
              <Dropdown
                t={t}
                optionKey="i18nKey"
                isMandatory={config.isMandatory}
                //options={[{i18nKey : "a"},{i18nKey : "a"},{i18nKey : "a"},{i18nKey : "a"},{i18nKey : "a"},{i18nKey : "a"}]}
                //option={TradeTypeMenu}
                option={getTradeTypeMenu(field?.tradecategory)}
                //selected={TradeType}
                selected={field?.tradetype}
                select={(e) => selectTradeType(index, e)}
              />
              <CardLabel>{`${t(
                "TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL"
              )}`}</CardLabel>
              <div className={"form-pt-dropdown-only"}>
                <Dropdown
                  t={t}
                  optionKey="i18nKey"
                  isMandatory={config.isMandatory}
                  //option={[{i18nKey : "a"},{i18nKey : "a"},{i18nKey : "a"},{i18nKey : "a"},{i18nKey : "a"},{i18nKey : "a"}]}
                  //option={TradeSubTypeMenu}
                  option={sortDropdownNames(
                    getTradeSubTypeMenu(field?.tradetype),
                    "i18nKey",
                    t
                  )}
                  //selected={TradeSubType}
                  selected={field?.tradesubtype}
                  select={(e) => selectTradeSubType(index, e)}
                />
              </div>
              <CardLabel>{`${t("TL_UNIT_OF_MEASURE_LABEL")}`}</CardLabel>
              <TextInput
                style={{ background: "#FAFAFA" }}
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="UnitOfMeasure"
                //value={UnitOfMeasure}
                value={field?.unit}
                onChange={(e) => selectUnitOfMeasure(index, e)}
                disable={true}
                /* {...(validation = {
            isRequired: true,
            pattern: "^[a-zA-Z-.`' ]*$",
            type: "text",
            title: t("PT_NAME_ERROR_MESSAGE"),
          })} */
              />
              <CardLabel>{`${t(
                "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
              )}`}</CardLabel>
              <TextInput
                style={{ background: "#FAFAFA" }}
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="UomValue"
                //value={UomValue}
                value={field?.uom}
                onChange={(e) => selectUomValue(index, e)}
                disable={!field.unit}
                {...(validation = {
                  isRequired: true,
                  pattern: "[0-9]+",
                  type: "text",
                  title: t("TL_WRONG_UOM_VALUE_ERROR"),
                })}
              />
              <CardLabel>{`${t(
                "TL_UNITRATE"
              )}`}</CardLabel>
              <TextInput
                style={{ background: "#FAFAFA" }}
                t={t}
                type={"text"}
                isMandatory={false}
                optionKey="i18nKey"
                name="TradeAmt"
                value={field?.rate}
                disable={true}
                {...(validation = {
                  isRequired: true,
                  pattern: "/^(0)*[1-9][0-9]{0,5}$/",
                  type: "text",
                  title: t("ERR_DEFAULT_INPUT_FIELD_MSG"),
                })}
              />
            </div>
          </div>
        );
      })}
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
          onClick={() => handleAdd()}
        >
          {`${t("TL_ADD_MORE_TRADE_UNITS")}`}
        </button>
      </div>
    </FormStep>
  );
};

const customize = () => {
  window.Digit.ComponentRegistryService.setComponent(
    "SelectTradeUnits",
    SelectTradeUnits
  );
};

export default customize;
