import {
  FormStep,
  MultiSelectDropdown,
  Table,
  Row,
  CardSubHeader,
  StatusTable,
  LinkButton,
  CardSectionHeader,
  RemoveableTag,
  Toast,
  Loader,
} from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState, useMemo } from "react";
import { render } from "react-dom";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";
import Timeline from "../components/Timeline";
import { stringReplaceAll } from "../utils";

const ScrutinyDetails = ({ onSelect, userType, formData, config }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [subOccupancy, setsubOccupancy] = useState([]);
  const [subOccupancyObject, setsubOccupancyObject] = useState(formData?.subOccupancy || formData?.landInfo?.unit || {});
  const [subOccupancyOption, setsubOccupancyOption] = useState([]);
  const [floorData, setfloorData] = useState([]);
  let scrutinyNumber = `DCR82021WY7QW`;
  let user = Digit.UserService.getUser();
  const tenantId = user?.info?.permanentCity || Digit.ULBService.getCurrentTenantId();
  const checkingFlow = formData?.uiFlow?.flow;
  const [showToast, setShowToast] = useState(null);
  const stateCode = Digit.ULBService.getStateId();
  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.obps.useMDMS(stateCode, "BPA", ["SubOccupancyType"]);
  const { data, isLoading, refetch } = Digit.Hooks.obps.useScrutinyDetails(tenantId, formData?.data?.scrutinyNumber, {
    enabled: true,
  });


  function getFloorData(block) {
    let floors = [];
    block?.building?.floors?.map((ob) => {
      floors.push({
        Floor: t(`BPA_FLOOR_NAME_${ob.number}`),
        Level: ob.number,
        Occupancy: t(`${ob.occupancies?.[0]?.type}`),
        BuildupArea: ob.occupancies?.[0]?.builtUpArea,
        FloorArea: ob.occupancies?.[0]?.floorArea || 0,
        CarpetArea: ob.occupancies?.[0]?.CarpetArea || 0,
        key: t(`BPA_FLOOR_NAME_${ob.number}`),
      });
    });
    return floors;
  }

  function getsuboptions() {
    let suboccoption = [];
    // data &&
      // data?.planDetail?.mdmsMasterData?.SubOccupancyType?.map((ob) => {
        mdmsData?.BPA?.SubOccupancyType?.map((ob) => {
        suboccoption.push({ code: ob.code, name: ob.name, i18nKey: `BPA_SUBOCCUPANCYTYPE_${stringReplaceAll(ob?.code?.toUpperCase(), "-", "_")}` });
      });
    return Digit.Utils.locale.sortDropdownNames(suboccoption,'i18nKey',t);
  }

  const ActionButton = ({ label, jumpTo }) => {
    const { t } = useTranslation();
    const history = useHistory();
    function routeTo() {
      location.href = jumpTo;
    }
    return <LinkButton label={t(label)} onClick={routeTo} />;
  };

  const tableHeader = [
    {
      name: "BPA_TABLE_COL_FLOOR",
      id: "Floor",
    },
    {
      name: "BPA_TABLE_COL_LEVEL",
      id: "Level",
    },
    {
      name: "BPA_TABLE_COL_OCCUPANCY",
      id: "Occupancy",
    },
    {
      name: "BPA_TABLE_COL_BUILDUPAREA",
      id: "BuildupArea",
    },
    {
      name: "BPA_TABLE_COL_FLOORAREA",
      id: "FloorArea",
    },
    {
      name: "BPA_TABLE_COL_CARPETAREA",
      id: "CarpetArea",
    },
  ];
  const selectOccupancy = (e, data, num) => {
    let blocks = subOccupancyObject;
    let newSubOccupancy = [];
    e &&
      e?.map((ob) => {
        newSubOccupancy.push(ob?.[1]);
      });
    blocks[`Block_${num}`] = newSubOccupancy;
    setsubOccupancy(newSubOccupancy);
    setsubOccupancyObject(blocks);
  };

  const onRemove = (index, key, num) => {
    let afterRemove = subOccupancyObject[`Block_${num}`].filter((value, i) => {
      return i !== index;
    });
    setsubOccupancy(afterRemove);
    let temp = subOccupancyObject;
    temp[`Block_${num}`] = afterRemove;
    setsubOccupancyObject(temp);
  };

  const accessData = (plot) => {
    const name = plot;
    return (originalRow, rowIndex, columns) => {
      return originalRow[name];
    };
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const tableColumns = useMemo(() => {
    return tableHeader?.map((ob) => ({
      Header: t(`${ob.name}`),
      accessor: accessData(ob.id),
      id: ob.id,
      //symbol: plot?.symbol,
      //sortType: sortRows,
    }));
  });

  const onSkip = () => onSelect();

  const goNext = () => {
    if (checkingFlow === "OCBPA") {
      if (!formData?.id) {
        let payload = {};
        payload.edcrNumber = formData?.edcrNumber?.edcrNumber ? formData?.edcrNumber?.edcrNumber : formData?.data?.scrutinyNumber?.edcrNumber;
        payload.riskType = formData?.data?.riskType;
        payload.applicationType = formData?.data?.applicationType;
        payload.serviceType = formData?.data?.serviceType;

        const userInfo = Digit.UserService.getUser();
        const accountId = userInfo?.info?.uuid;
        payload.tenantId = formData?.data?.bpaData?.bpaApprovalResponse?.[0]?.landInfo?.tenantId;
        payload.workflow = { action: "INITIATE", assignes : [userInfo?.info?.uuid] };
        payload.accountId = accountId;
        payload.documents = null;

        // Additonal details
        payload.additionalDetails = {};
        if (formData?.data?.holdingNumber) payload.additionalDetails.holdingNo = formData?.data?.holdingNumber;
        if (formData?.data?.registrationDetails) payload.additionalDetails.registrationDetails = formData?.data?.registrationDetails;
        if (formData?.data?.applicationType) payload.additionalDetails.applicationType = formData?.data?.applicationType;
        if (formData?.data?.serviceType) payload.additionalDetails.serviceType = formData?.data?.serviceType;

        //For LandInfo
        payload.landInfo = formData?.data?.bpaData?.bpaApprovalResponse?.[0].landInfo || {};

        let nameOfAchitect = sessionStorage.getItem("BPA_ARCHITECT_NAME");
        let parsedArchitectName = nameOfAchitect ? JSON.parse(nameOfAchitect) : "ARCHITECT";
        payload.additionalDetails.typeOfArchitect = parsedArchitectName;
        // create BPA call
        Digit.OBPSService.create({ BPA: payload }, tenantId)
          .then((result, err) => {
            if (result?.BPA?.length > 0) {
              result.BPA[0].data = formData.data;
              result.BPA[0].uiFlow = formData?.uiFlow;
              onSelect("", result.BPA[0], "", true);
            }
          })
          .catch((e) => {
            setShowToast({ key: "true", message: e?.response?.data?.Errors[0]?.message || null });
          });
      } else {
        onSelect("", formData, "", true);
      }
    } else {
      onSelect(config.key, subOccupancyObject);
    }
  };

  const clearall = (num) => {
    let res = [];
    let temp = subOccupancyObject;
    temp[`Block_${num}`] = res;
    setsubOccupancy(res);
    setsubOccupancyObject(temp);
  };

  function getSubOccupancyValues(index) {
    let values = formData?.data?.bpaData?.bpaApprovalResponse?.[0]?.landInfo?.unit;
    let returnValue = "";
    if (values?.length > 0) {
      let splitArray = values[index]?.usageCategory?.split(",");
      if (splitArray?.length) {
        const returnValueArray = splitArray?.map((data) =>
          data ? `${t(`BPA_SUBOCCUPANCYTYPE_${stringReplaceAll(data?.toUpperCase(), "-", "_")}`)}` : "NA"
        );
        returnValue = returnValueArray.join(", ");
      }
    }
    return returnValue ? returnValue : "NA";
  }

  if (isMdmsLoading) return <Loader /> 

  return (
    <React.Fragment>
      <Timeline currentStep={checkingFlow === "OCBPA" ? 2 : 1} flow={checkingFlow === "OCBPA" ? "OCBPA" : ""} />
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} /* isDisabled={Object.keys(subOccupancyObject).length === 0} */>
        <CardSubHeader style={{ fontSize: "20px" }}>{t("BPA_EDCR_DETAILS")}</CardSubHeader>
        <StatusTable style={{ border: "none" }}>
          <Row
            className="border-none"
            style={{ border: "none" }}
            label={checkingFlow === "OCBPA" ? t("BPA_OC_EDCR_NO_LABEL") : t("BPA_EDCR_NO_LABEL")}
            text={data?.edcrNumber}
            labelStyle={{wordBreak: "break-all"}} 
            textStyle={{wordBreak: "break-all"}}
          ></Row>
          <Row
            className="border-none"
            label={t("BPA_UPLOADED_PLAN_DIAGRAM")}
            text={<ActionButton label={t("BPA_UPLOADED_PLAN_DXF")} jumpTo={data?.updatedDxfFile} />}
          ></Row>
          <Row
            className="border-none"
            label={t("BPA_SCRUNTINY_REPORT_OUTPUT")}
            text={<ActionButton label={t("BPA_SCRUTINY_REPORT_PDF")} jumpTo={data?.planReport} />}
          ></Row>
        </StatusTable>
        <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
        <CardSubHeader style={{ fontSize: "20px" }}>
          {checkingFlow === "OCBPA" ? t("BPA_ACTUAL_BUILDING_EXTRACT_HEADER") : t("BPA_BUILDING_EXTRACT_HEADER")}
        </CardSubHeader>
        <StatusTable style={{ border: "none" }}>
          <Row
            className="border-none"
            label={t("BPA_TOTAL_BUILT_UP_AREA_HEADER")}
            text={
              data?.planDetail?.blocks?.[0]?.building?.totalBuitUpArea
                ? `${data?.planDetail?.blocks?.[0]?.building?.totalBuitUpArea} ${t("BPA_SQ_MTRS_LABEL")}`
                : t("NA")
            }
          ></Row>
          <Row
            className="border-none"
            label={t("BPA_SCRUTINY_DETAILS_NUMBER_OF_FLOORS_LABEL")}
            text={data?.planDetail?.blocks?.[0]?.building?.totalFloors}
          ></Row>
          <Row
            className="border-none"
            label={t("BPA_HEIGHT_FROM_GROUND_LEVEL_FROM_MUMTY")}
            text={
              data?.planDetail?.blocks?.[0]?.building?.declaredBuildingHeight
                ? `${data?.planDetail?.blocks?.[0]?.building?.declaredBuildingHeight} ${t("BPA_MTRS_LABEL")}`
                : t("NA")
            }
          ></Row>
        </StatusTable>
        <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
        <CardSubHeader style={{ fontSize: "20px" }}>{t("BPA_OCC_SUBOCC_HEADER")}</CardSubHeader>
        {data?.planDetail?.blocks?.map((block, index) => (
          <div key={index} style={{ marginTop: "20px" }}>
            <CardSubHeader style={{ fontSize: "18px" }}>
              {t("BPA_BLOCK_SUBHEADER")} {index + 1}
            </CardSubHeader>
            {!(checkingFlow === "OCBPA") ? (
              <CardSectionHeader style={{ fontWeight: "normal" }} className="card-label-smaller">
                {t("BPA_SUB_OCCUPANCY_LABEL")}
              </CardSectionHeader>
            ) : null}
            {!(checkingFlow === "OCBPA") ? (
              <MultiSelectDropdown
                BlockNumber={block.number}
                className="form-field"
                isMandatory={true}
                defaultUnit="Selected"
                selected={subOccupancyObject[`Block_${block.number}`]}
                //selected={subOccupancy}
                options={getsuboptions()}
                onSelect={(e) => selectOccupancy(e, data, block.number)}
                isOBPSMultiple={true}
                optionsKey="i18nKey"
                ServerStyle={{ width: "100%", overflowX: "hidden"}}
                t={t}
              />
            ) : null}
            {!(checkingFlow === "OCBPA") ? (
              <div className="tag-container">
                {subOccupancyObject[`Block_${block.number}`] &&
                  subOccupancyObject[`Block_${block.number}`].length > 0 &&
                  subOccupancyObject[`Block_${block.number}`]?.map((value, index) => (
                    <RemoveableTag key={index} text={`${t(value["i18nKey"])}`} onClick={() => onRemove(index, value, block.number)} />
                  ))}
              </div>
            ) : null}
            {!(checkingFlow === "OCBPA")
              ? subOccupancyObject[`Block_${block.number}`] &&
                subOccupancyObject[`Block_${block.number}`].length > 0 && (
                  <LinkButton style={{ textAlign: "left" }} label={"Clear All"} onClick={() => clearall(block.number)} />
                )
              : null}
            <div style={{ marginTop: "20px" }}>
              {checkingFlow === "OCBPA" ? (
                <StatusTable>
                  <Row className="border-none" label={`${t("BPA_SUB_OCCUPANCY_LABEL")}`} text={getSubOccupancyValues(index)}></Row>
                </StatusTable>
              ) : null}
              <div style={{ overflowX: "scroll" }}>
                <Table
                  className="customTable table-fixed-first-column table-border-style"
                  t={t}
                  disableSort={false}
                  autoSort={true}
                  manualPagination={false}
                  isPaginationRequired={false}
                  //globalSearch={filterValue}
                  initSortId="S N "
                  //onSearch={onSearch}
                  //data={[{Floor:"ground floor",Level:1,Occupancy:"self",BuildupArea:440,FloorArea:400,CarpetArea:380,key:"ground floor"},{Floor:"first floor",Level:1,Occupancy:"self",BuildupArea:450,FloorArea:410,CarpetArea:390,key:"first floor"},{Floor:"second floor",Level:1,Occupancy:"self",BuildupArea:400,FloorArea:350,CarpetArea:300,key:"second floor"}]}
                  data={getFloorData(block)}
                  columns={tableColumns}
                  getCellProps={(cellInfo) => {
                    return {
                      style: {},
                    };
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
        <CardSubHeader style={{ fontSize: "20px" }}>{t("BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL")}</CardSubHeader>
        <StatusTable style={{ border: "none" }}>
          <Row
            label={t("BPA_APPLICATION_DEMOLITION_AREA_LABEL")}
            text={
              data?.planDetail?.planInformation?.demolitionArea
                ? `${data?.planDetail?.planInformation?.demolitionArea} ${t("BPA_SQ_MTRS_LABEL")}`
                : t("CS_NA")
            }
          ></Row>
        </StatusTable>
      </FormStep>
      {showToast && <Toast error={true} label={t(showToast?.message)} isDleteBtn={true} onClose={closeToast} />}
    </React.Fragment>
  );
};

export default ScrutinyDetails;
