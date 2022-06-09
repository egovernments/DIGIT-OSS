import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardLabel, LabelFieldPair, Dropdown, TextInput, LinkButton, CardLabelError, MobileNumber, DatePicker, Loader } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import isUndefined from "lodash/isUndefined";
import { getUniqueItemsFromArray, commonTransform, stringReplaceAll,getPattern, convertEpochToDate } from "../utils";

const defaultFinancialYear = () => {
  const data = convertEpochToDate(Date.now());
  const splitData = data.split("-")[0];
  const year = splitData.slice(2, 4);
  let monthNo = Number(data.split("-")[1]);
  const currentFinancialYear = monthNo < 4?`${Number(splitData)-1}-${Number(year)}`:`${Number(splitData)}-${Number(year) + 1}`;
  return { 
    code: currentFinancialYear, 
    i18nKey: `FY${currentFinancialYear}`, 
    id: currentFinancialYear?.split('-')[0] 
  }
}
const createTradeDetailsDetails = () => ({
  financialYear: defaultFinancialYear(),
  licenseType: "",
  structureType: "",
  structureSubType: "",
  commencementDate: "",
  gstNo: "",
  operationalArea: "",
  noOfEmployees: "",
  key: Date.now()
});

const TLTradeDetailsEmployee = ({ config, onSelect, userType, formData, setError, formState, clearErrors }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isEditScreen = pathname.includes("/modify-application/");
  const [tradedetils, setTradedetils] = useState(formData?.tradedetils || [createTradeDetailsDetails()]);
  const [previousLicenseDetails, setPreviousLicenseDetails] = useState(formData?.tradedetils1 || []);
  const [structureSubTypeOptions, setStructureSubTypeOptions] = useState([]);
  const [owners, setOwners] = useState(formData?.owners || [createTradeDetailsDetails()]);
  const [focusIndex, setFocusIndex] = useState({ index: -1, type: "" });
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [isErrors, setIsErrors] = useState(false);
  const [licenseTypeList, setLicenseTypeList] = useState([]);
  const [licenseTypeValue, setLicenseTypeValue] = useState([]);

  const { isLoading : menuLoading, data: Menu = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "common-masters", "StructureType");

  const { data: FinaceMenu = {} } = Digit.Hooks.tl.useTradeLicenseMDMS(stateId, "egf-master", ["FinancialYear"]);

  const { data: billingSlabData } = Digit.Hooks.tl.useTradeLicenseBillingslab({ tenantId, filters: {} });

  const addNewOwner = () => {
    const newOwner = createTradeDetailsDetails();
    setOwners((prev) => [...prev, newOwner]);
  };

  const removeOwner = (owner) => {
    setOwners((prev) => prev.filter((o) => o.key != owner.key));
  };

  useEffect(() => {
    const data = tradedetils.map((e) => {
      return e;
    });
    onSelect(config?.key, data);
  }, [tradedetils]);

  useEffect(() => {
    onSelect("tradedetils1", previousLicenseDetails);
  }, [previousLicenseDetails]);

  useEffect(() => {
    setOwners([createTradeDetailsDetails()]);
  }, [formData?.tradedetils?.[0]?.key]);


  const commonProps = {
    focusIndex,
    allOwners: tradedetils,
    setFocusIndex,
    removeOwner,
    formData,
    formState,
    setOwners,
    t,
    setError,
    clearErrors,
    config,
    setTradedetils,
    FinaceMenu,
    setStructureSubTypeOptions,
    structureSubTypeOptions,
    Menu,
    setIsErrors,
    isErrors,
    billingSlabData,
    licenseTypeList, 
    setLicenseTypeList,
    previousLicenseDetails, 
    setPreviousLicenseDetails,
    licenseTypeValue,
    setLicenseTypeValue,
    menuLoading
  };

  if (isEditScreen) {
    return <React.Fragment />;
  }

  return (
    <React.Fragment>
      {tradedetils.map((tradedetail, index) => (
        <OwnerForm1 key={tradedetail.key} index={index} tradedetail={tradedetail} {...commonProps} />
      ))}
    </React.Fragment>
  );
};

const OwnerForm1 = (_props) => {
  const {
    tradedetail,
    index,
    focusIndex,
    allOwners,
    setFocusIndex,
    removeOwner,
    setOwners,
    t,
    formData,
    config,
    setError,
    clearErrors,
    formState,
    setTradedetils,
    FinaceMenu,
    setStructureSubTypeOptions,
    structureSubTypeOptions,
    Menu,
    setIsErrors,
    isErrors,
    billingSlabData,
    licenseTypeList, 
    setLicenseTypeList,
    previousLicenseDetails, 
    setPreviousLicenseDetails,
    licenseTypeValue,
    setLicenseTypeValue,
    menuLoading
  } = _props;

  const { control, formState: localFormState, watch, setError: setLocalError, clearErrors: clearLocalErrors, setValue, trigger, getValues } = useForm();
  const formValue = watch();
  const { errors } = localFormState;

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
                        !isUndefined(item.rate) &&
                            item.rate !== null &&
                            acc.tradeTypeData.push(tradeType);
                    }
                    return acc;
                },
                { accessories: [], tradeTypeData: [] }
            );
        let licenseTypes = getUniqueItemsFromArray(
            processedData.tradeTypeData,
            "licenseType"
        );
        licenseTypes = licenseTypes.map(item => {
            return { code: item.licenseType, active: true };
        });
        if (licenseTypes && licenseTypes.length > 0) {
          licenseTypes.forEach(data => {
            data.i18nKey = `TRADELICENSE_LICENSETYPE_${data.code}`
          })
        };
        
        let licenseTypeValue = [];
        if (licenseTypes && licenseTypes.length > 0) {
          licenseTypes.map(data =>{
            if(data.code == "PERMANENT") licenseTypeValue.push(data);
          });
        }
        setLicenseTypeValue(licenseTypeValue[0]);
        setLicenseTypeList(licenseTypes);
    }
}, [billingSlabData]);



  let financialYearOptions = [];
  FinaceMenu && FinaceMenu["egf-master"] &&
    FinaceMenu["egf-master"].FinancialYear.map(data => { if (data.module == "TL") financialYearOptions.push({ code: data.name, i18nKey: `FY${data.name}`, id: data.name.split('-')[0] }) });
    
  if (financialYearOptions && financialYearOptions.length > 0) { financialYearOptions.sort(function (a, b) { return Number(a.id) - Number(b.id);});}

  let structureTypeOptions = [];
  // let structureSubTypeOptions = [];
  // let optionsOfStructureType = []
  structureTypeOptions = Menu && Menu["common-masters"] &&
    Menu["common-masters"].StructureType.map((e) => {
      let code = e?.code.split('.')[0];
      return ({ i18nKey: t(`COMMON_MASTERS_STRUCTURETYPE_${stringReplaceAll(code?.toUpperCase(), ".", "_")}`), label: code, ...e })
    }) || [];

  let selectedStructureTypeOptions = [];
  if (structureTypeOptions && structureTypeOptions.length > 0) {
    var flags = [], output = [], l = structureTypeOptions.length, i;
    for (i = 0; i < l; i++) {
      if (flags[structureTypeOptions[i].label]) continue;
      flags[structureTypeOptions[i].label] = true;
      selectedStructureTypeOptions.push({
        code: structureTypeOptions[i].label,
        i18nKey: t(`COMMON_MASTERS_STRUCTURETYPE_${stringReplaceAll(structureTypeOptions[i]?.label?.toUpperCase(), ".", "_")}`)
      });
    }
  }

  let isRenewal = window.location.href.includes("renew-application-details");
  if (window.location.href.includes("edit-application-details")) isRenewal = true;


  useEffect(() => {
    if (isRenewal && structureTypeOptions?.length > 0 && !menuLoading) {
      let selectedOption = tradedetail?.structureType?.code?.split('.')[0];
      let structureSubTypeOption = [];
      structureTypeOptions.map(data => {
        if (selectedOption === data?.code?.split('.')[0]) {
          structureSubTypeOption.push({
            code: data?.code,
            i18nKey: t(`COMMON_MASTERS_STRUCTURETYPE_${stringReplaceAll(data?.code?.toUpperCase(), ".", "_")}`),
          })
        }
      });
      // setValue("structureSubType", "");
      setStructureSubTypeOptions(structureSubTypeOption);
    }
}, [tradedetail?.structureType, !menuLoading]);


  const isIndividualTypeOwner = useMemo(() => formData?.ownershipCategory?.code.includes("INDIVIDUAL"), [formData?.ownershipCategory?.code]);

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    const keys = Object.keys(formValue);
    const part = {};
    keys.forEach((key) => (part[key] = tradedetail[key]));
    let _ownerType = {};
    if (!_.isEqual(formValue, part)) {
      Object.keys(formValue).map(data => {
        if (data != "key" && formValue[data] != undefined && formValue[data] != "" && formValue[data] != null && !isErrors) {
          setIsErrors(true);
        }
      });
      setTradedetils((prev) => prev.map((o) => {
        return (o.key && o.key === tradedetail.key ? { ...o, ...formValue, ..._ownerType } : { ...o })
      }));
      trigger();
    }
  }, [formValue]);



  useEffect(() => {
    if (Object.keys(errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, errors)) {
      setError(config.key, { type: errors });
    }
    else if (!Object.keys(errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }
  }, [errors]);

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };
  return (
    <React.Fragment>
      <div style={{ marginBottom: "16px" }}>
        <div>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_FINANCIAL_YEAR_LABEL")} * `}</CardLabel>
            <Controller
              name="financialYear"
              rules={{ required: t("REQUIRED_FIELD") }}
              defaultValue={tradedetail?.financialYear}
              control={control}
              render={(props) => (
                <Dropdown
                  className="form-field"
                  selected={props.value}
                  errorStyle={(localFormState.touched.financialYear && errors?.financialYear?.message) ? true : false}
                  // disable={financialYearOptions?.length === 1}
                  option={financialYearOptions}
                  select={props.onChange}
                  optionKey="i18nKey"
                  onBlur={props.onBlur}
                  disable={isRenewal}
                  t={t}
                />
              )}
            />
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.financialYear ? errors?.financialYear?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_LIC_TYPE_LABEL")} * `}</CardLabel>
            <Controller
              name="licenseType"
              defaultValue={tradedetail?.licenseType}
              control={control}
              render={(props) => (
                <Dropdown
                  className="form-field"
                  selected={licenseTypeValue} //{licenseTypeList[1]}
                  disable={true}
                  option={licenseTypeList}
                  select={props.onChange}
                  optionKey="i18nKey"
                  onBlur={props.onBlur}
                  t={t}
                  errorStyle={(localFormState.touched.licenseType && errors?.licenseType?.message) ? true : false}
                />
              )}
            />
          </LabelFieldPair>

          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_COMMON_TABLE_COL_TRD_NAME")} * `}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name={"tradeName"}
                defaultValue={tradedetail?.tradeName}
                rules={{ required: t("REQUIRED_FIELD"), validate: { pattern: (val) => (/^[-@.\/#&+\w\s]*$/.test(val) ? true : t("INVALID_NAME")) } }}
                render={(props) => (
                  <TextInput
                    value={props.value}
                    autoFocus={focusIndex.index === tradedetail?.key && focusIndex.type === "name"}
                    errorStyle={(localFormState.touched.tradeName && errors?.tradeName?.message) ? true : false}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: tradedetail.key, type: "tradeName" });
                    }}
                    onBlur={(e) => {
                      setFocusIndex({ index: -1 });
                      props.onBlur(e);
                    }}
                    disable={isRenewal}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.tradeName ? errors?.tradeName?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_STRUCT_TYPE_LABEL")} * `}</CardLabel>
            <Controller
              name="structureType"
              rules={{ required: t("REQUIRED_FIELD") }}
              defaultValue={tradedetail?.structureType}
              control={control}
              render={(props) => (
                <Dropdown
                  className="form-field"
                  selected={props.value}
                  disable={isRenewal}
                  option={selectedStructureTypeOptions}
                  errorStyle={(localFormState.touched.structureType && errors?.structureType?.message) ? true : false}
                  select={(e) => {
                    let selectedOption = e?.code?.split('.')[0];
                    let structureSubTypeOption = [];
                    structureTypeOptions.map(data => {
                      if (selectedOption === data?.code?.split('.')[0]) {
                        structureSubTypeOption.push({
                          code: data?.code,
                          i18nKey: t(`COMMON_MASTERS_STRUCTURETYPE_${stringReplaceAll(data?.code?.toUpperCase(), ".", "_")}`),
                        })
                      }
                    });
                    setValue("structureSubType", "");
                    setStructureSubTypeOptions(structureSubTypeOption);
                    props.onChange(e);
                  }}
                  optionKey="i18nKey"
                  onBlur={props.onBlur}
                  t={t}
                />
              )}
            />
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.structureType ? errors?.structureType?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_STRUCT_SUB_TYPE_LABEL")} * `}</CardLabel>
            <Controller
              name="structureSubType"
              rules={{ required: t("REQUIRED_FIELD") }}
              defaultValue={tradedetail?.structureSubType}
              control={control}
              render={(props) => (
                <Dropdown
                  className="form-field"
                  selected={getValues("structureSubType")}
                  disable={false}
                  option={structureSubTypeOptions}
                  select={(e) => {
                    if(e?.code != tradedetail?.structureSubType?.code && isRenewal) setPreviousLicenseDetails({ ...previousLicenseDetails, checkForRenewal: true});
                    props.onChange(e)
                  }}
                  optionKey="i18nKey"
                  onBlur={props.onBlur}
                  t={t}
                  errorStyle={(localFormState.touched.structureSubType && errors?.structureSubType?.message) ? true : false}
                />
              )}
            />
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.structureSubType ? errors?.structureSubType?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL")} * `}</CardLabel>
            <div className="field">
              <Controller
                name="commencementDate"
                rules={{ required: t("REQUIRED_FIELD") }}
                defaultValue={tradedetail?.commencementDate}
                control={control}
                render={(props) => (
                  <DatePicker
                    date={props.value}
                    // date={CommencementDate} 
                    name="CommencementDate"
                    onChange={props.onChange}
                    disabled={isRenewal}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.commencementDate ? errors?.commencementDate?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_GST_NUMBER_LABEL")} `}</CardLabel>
            <div className="field">
              <Controller
                control={control}
                name="gstNo"
                defaultValue={tradedetail?.gstNo}
                rules={{ validate: (e) => ((e && getPattern("GSTNo").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) }}
                render={(props) => (
                  <TextInput
                    value={props.value}
                    autoFocus={focusIndex.index === tradedetail?.key && focusIndex.type === "gstNo"}
                    errorStyle={(localFormState.touched.gstNo && errors?.gstNo?.message) ? true : false}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: tradedetail?.key, type: "gstNo" });
                    }}
                    labelStyle={{ marginTop: "unset" }}
                    onBlur={props.onBlur}
                    disable={isRenewal}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.gstNo ? errors?.gstNo?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_OPERATIONAL_SQ_FT_AREA_LABEL")} `}</CardLabel>
            <div className="field">
              <Controller
                name="operationalArea"
                rules={{ validate: (e) => ((e && getPattern("OperationalArea").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) }}
                defaultValue={tradedetail?.operationalArea}
                control={control}
                render={(props) => (
                  <TextInput
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: tradedetail?.key, type: "operationalArea" });
                    }}
                    value={props.value}
                    autoFocus={focusIndex.index === tradedetail?.key && focusIndex.type === "operationalArea"}
                    errorStyle={(localFormState.touched.operationalArea && errors?.operationalArea?.message) ? true : false}
                    onBlur={props.onBlur}
                    disable={isRenewal}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.operationalArea ? errors?.operationalArea?.message : ""}</CardLabelError>
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">{`${t("TL_NEW_NUMBER_OF_EMPLOYEES_LABEL")} `}</CardLabel>
            <div className="field">
              <Controller
                name="noOfEmployees"
                rules={{ validate: (e) => ((e && getPattern("NoOfEmp").test(e)) || !e ? true : t("ERR_DEFAULT_INPUT_FIELD_MSG")) }}
                defaultValue={tradedetail?.noOfEmployees}
                control={control}
                render={(props) => (
                  <TextInput
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFocusIndex({ index: tradedetail?.key, type: "noOfEmployees" });
                    }}
                    value={props.value}
                    autoFocus={focusIndex.index === tradedetail?.key && focusIndex.type === "noOfEmployees"}
                    errorStyle={(localFormState.touched.noOfEmployees && errors?.noOfEmployees?.message) ? true : false}
                    onBlur={props.onBlur}
                    disable={isRenewal}
                  />
                )}
              />
            </div>
          </LabelFieldPair>
          <CardLabelError style={errorStyle}>{localFormState.touched.noOfEmployees ? errors?.noOfEmployees?.message : ""}</CardLabelError>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TLTradeDetailsEmployee;
