import React, { useEffect, useState } from "react";
import { CardLabel, LabelFieldPair, Dropdown, TextInput, LinkButton } from "@egovernments/digit-ui-react-components";
import { stringReplaceAll } from "../utils";

const Units = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [units, setUnits] = useState(
    formData?.units || [
      {
        key: 1,
        floorNo: null,
        occupancyType: null,
        tenantId,
        usageCategory: null,
        builtUpArea: "",
      },
    ]
  );
  const stateId = tenantId.split(".")[0];
  const [focusIndex, setFocusIndex] = useState(-1);

  const { data: floordata } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "Floor") || {};
  let floorlist = [];
  floorlist = floordata?.PropertyTax?.Floor;
  let i;
  let floorListData = [];

  function getfloorlistdata(floorlist) {
    for (i = 0; Array.isArray(floorlist) && i < floorlist.length; i++) {
      floorListData.push({ i18nKey: "PROPERTYTAX_FLOOR_" + stringReplaceAll(floorlist[i].code,"-", "_"), code: floorlist[i].code });
    }
    return floorListData;
  }

  const selfOccupiedData = [
    {
      //i18nKey: "Yes, It is fully Self Occupied",
      i18nKey: "PT_YES_IT_IS_SELFOCCUPIED",
      code: "SELFOCCUPIED",
    },
    {
      //i18nKey: "Partially rented out",
      i18nKey: "PT_PARTIALLY_RENTED_OUT",
      code: "RENTED",
    },
    {
      //i18nKey: "Fully rented out",
      i18nKey: "PT_FULLY_RENTED_OUT",
      code: "RENTED",
    },
  ];

  const { data: Menu = {} } = Digit.Hooks.pt.usePropertyMDMS(stateId, "PropertyTax", "UsageCategory") || {};

  let subusageoption = [];
  subusageoption = Menu?.PropertyTax?.UsageCategory || [];

  let x;
  let subUsageOptionData = [];

  function getSubUsagedata(subusageoption) {
    for (x = 0; x < subusageoption.length; x++) {
      if (
        Array.isArray(subusageoption) &&
        subusageoption.length > 0 &&
        subusageoption[x].code.split(".")[1] == formData?.usageCategoryMajor?.i18nKey.split("_")[3] &&
        subusageoption[x].code.split(".").length == 4
      ) {
        subUsageOptionData.push({
          i18nKey:
            "COMMON_PROPSUBUSGTYPE_NONRESIDENTIAL_" +
            subusageoption[x].code.split(".")[1] +
            "_" +
            subusageoption[x].code.split(".")[subusageoption[x].code.split(".").length - 1],
          code: subusageoption[x].code,
        });
      }
    }
    return subUsageOptionData;
  }

  function goNext() {
    const unitsData = units?.map((unit) => ({
      occupancyType: unit?.occupancyType?.code,
      floorNo: unit?.floorNo?.code,
      constructionDetail: {
        builtUpArea: unit?.builtUpArea,
      },
      tenantId: unit?.tenantId,
      usageCategory: unit?.usageCategory?.code,
    }));
    onSelect(config.key, unitsData);
  }

  const handleAddUnit = () => {
    setUnits((prev) => [
      ...prev,
      {
        key: prev.length + 1,
        floorNo: null,
        occupancyType: null,
        tenantId,
        usageCategory: null,
        builtUpArea: "",
      },
    ]);
  };

  useEffect(() => {
    goNext();
  }, [units]);

  return (
    <div>
      {units?.map((unit, index) => (
        <Unit
          t={t}
          key={unit.key}
          unit={unit}
          setUnits={setUnits}
          index={index}
          focusIndex={focusIndex}
          setFocusIndex={setFocusIndex}
          getfloorlistdata={getfloorlistdata}
          floorlist={floorlist}
          getSubUsagedata={getSubUsagedata}
          subusageoption={subusageoption}
          selfOccupiedData={selfOccupiedData}
        />
      ))}
      <LinkButton label="Add Unit" onClick={handleAddUnit} style={{ color: "orange" }}></LinkButton>
    </div>
  );
};

function Unit({
  t,
  unit,
  setUnits,
  index,
  focusIndex,
  setFocusIndex,
  getfloorlistdata,
  floorlist,
  getSubUsagedata,
  subusageoption,
  selfOccupiedData,
}) {
  const selectFloorNumber = (value) => {
    setUnits((pre) => pre.map((item) => (item.key === unit.key ? { ...item, floorNo: value } : item)));
  };

  const selectSelfOccupied = (value) => {
    setUnits((pre) => pre.map((item) => (item.key === unit.key ? { ...item, occupancyType: value } : item)));
  };

  const selectSubUsageType = (value) => {
    console.log("%c 🐑: selectSubUsageType -> value ", "font-size:16px;background-color:#928c29;color:white;", value);
    setUnits((pre) => pre.map((item) => (item.key === unit.key ? { ...item, usageCategory: value } : item)));
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <div className="label-field-pair">
        <h2 className="card-label card-label-smaller" style={{ color: "#505A5F" }}>
          Unit {unit?.key}
        </h2>
      </div>
      <div style={{ border: "1px solid #E3E3E3", padding: "16px", marginTop: "8px" }}>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">Floor Number:</CardLabel>
          <Dropdown
            className="form-field"
            selected={unit?.floorNo}
            disable={false}
            option={getfloorlistdata(floorlist) || []}
            select={selectFloorNumber}
            optionKey="i18nKey"
            t={t}
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">Unit Sub Usage:</CardLabel>
          <Dropdown
            className="form-field"
            selected={unit?.usageCategory}
            disable={getSubUsagedata(subusageoption)?.length === 1}
            option={getSubUsagedata(subusageoption)}
            select={selectSubUsageType}
            optionKey="i18nKey"
            t={t}
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">Unit Occupancy Type:</CardLabel>
          <Dropdown
            className="form-field"
            selected={unit?.occupancyType}
            disable={selfOccupiedData?.length === 1}
            option={selfOccupiedData}
            select={selectSelfOccupied}
            optionKey="i18nKey"
            t={t}
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">Unit Build Up Area</CardLabel>
          <div className="field">
            <TextInput
              type="text"
              name="unit-area"
              onChange={(e) => {
                setUnits((pre) => pre.map((item) => (item.key === unit.key ? { ...item, builtUpArea: e.target.value } : item)));
                setFocusIndex(index);
              }}
              value={unit?.builtUpArea}
              autoFocus={focusIndex === index}
            />
          </div>
        </LabelFieldPair>
      </div>
    </div>
  );
}

export default Units;
