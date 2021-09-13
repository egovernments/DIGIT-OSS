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
  Toast
 } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState, useMemo } from "react";
import { render } from "react-dom";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";
import Timeline from "../components/Timeline";

const ScrutinyDetails = ({ onSelect, userType, formData,config }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [subOccupancy, setsubOccupancy] = useState([]);
  const [subOccupancyObject, setsubOccupancyObject] = useState(formData?.subOccupancy || formData?.landInfo?.unit || {});
  const [subOccupancyOption, setsubOccupancyOption] = useState([]);
  const [floorData, setfloorData] = useState([]);
  let scrutinyNumber=`DCR82021WY7QW`;
  let user = Digit.UserService.getUser();
  const tenantId = user.info.permanentCity;
  const checkingUrl = window.location.href.includes("building_oc_plan_scrutiny");
  const [showToast, setShowToast] = useState(null);
  //let tenantId="pb.amritsar";
  const { data, isLoading, refetch } = Digit.Hooks.obps.useScrutinyDetails(tenantId,formData?.data?.scrutinyNumber, {
    enabled: true
  })
  console.log(data,"data from api");

 
  function getFloorData(block){
    let floors = [];
    block?.building?.floors.map((ob) => {
        floors.push({
            Floor:t(`BPA_FLOOR_NAME_${ob.number}`),
            Level:ob.number,
            Occupancy:t(`${ob.occupancies?.[0]?.type}`),
            BuildupArea:ob.occupancies?.[0]?.builtUpArea,
            FloorArea:ob.occupancies?.[0]?.floorArea || 0,
            CarpetArea:ob.occupancies?.[0]?.CarpetArea || 0,
            key:t(`BPA_FLOOR_NAME_${ob.number}`),
        });
    });
    return floors;
  }

  function getsuboptions(){
    let suboccoption = [];
   data &&  data?.planDetail?.mdmsMasterData?.SubOccupancyType.map((ob) => {
        suboccoption.push({code:ob.code,name:ob.name,i18nKey:`BPA_SUBOCCUPANCYTYPE_${ob.code.replaceAll("-","_")}`});
    });
    return suboccoption;
  }
 

const ActionButton = ({ label, jumpTo }) => {
    const { t } = useTranslation();
    const history = useHistory();
    function routeTo() {
        location.href=jumpTo;
    }
    return <LinkButton label={t(label)}  onClick={routeTo} />;
  };

const tableHeader = [
    {
        name:"BPA_TABLE_COL_FLOOR",
        id:"Floor",
    },
    {
        name:"BPA_TABLE_COL_LEVEL",
        id:"Level",
    },
    {
        name:"BPA_TABLE_COL_OCCUPANCY",
        id:"Occupancy",
    },
    {
        name:"BPA_TABLE_COL_BUILDUPAREA",
        id:"BuildupArea",
    },
    {
        name:"BPA_TABLE_COL_FLOORAREA",
        id:"FloorArea",
    },
    {
        name:"BPA_TABLE_COL_CARPETAREA",
        id:"CarpetArea",
    }
]
const selectOccupancy = (e, data,num) => {
  let blocks = subOccupancyObject;
  const index = subOccupancyObject[`Block_${num}`]?subOccupancyObject[`Block_${num}`].filter((ele) => ele.code == data.code):[];
  let subOccupancy1=subOccupancyObject[`Block_${num}`]?subOccupancyObject[`Block_${num}`]:[];
    let res = null;
    if (index.length) {
      subOccupancy1.splice(subOccupancy1.indexOf(index[0]), 1);
      res = [...subOccupancy1];
    } else {
      res = [{ ...data }, ...subOccupancy1];
    }
    blocks[`Block_${num}`]=res;
    setsubOccupancy(res);
    setsubOccupancyObject(blocks);
};

const onRemove = (index, key,num) => {
    let afterRemove = subOccupancyObject[`Block_${num}`].filter((value, i) => {
      return i !== index;
    });
   setsubOccupancy(afterRemove);
   let temp = subOccupancyObject;
   temp[`Block_${num}`]=afterRemove;
   setsubOccupancyObject(temp);
  };


  const accessData = (plot) => {
    const name = plot;
    return (originalRow, rowIndex, columns) => { 
      return originalRow[name];
    }
  }

  const tableColumns = useMemo(
    () => {
      
      return tableHeader.map((ob)=> ({
        Header:t(`${ob.name}`),
        accessor: accessData(ob.id),
        id: ob.id,
        //symbol: plot?.symbol,
        //sortType: sortRows,
      }));

          
    });

const onSkip = () => {
}
  const goNext = () => {
    if (checkingUrl) {
      if (!formData?.id) {
        let payload = {};
        payload.edcrNumber = formData?.edcrNumber?.edcrNumber ? formData?.edcrNumber?.edcrNumber : formData?.data?.scrutinyNumber?.edcrNumber;
        payload.riskType = formData?.data?.riskType;
        payload.applicationType = formData?.data?.applicationType;
        payload.serviceType = formData?.data?.serviceType;

        const userInfo = Digit.UserService.getUser();
        const accountId = userInfo?.info?.uuid;
        payload.tenantId = formData?.data?.bpaData?.bpaApprovalResponse?.[0]?.landInfo?.tenantId;
        payload.workflow = { action: "INITIATE" };
        payload.accountId = accountId;
        payload.documents = null;

        // Additonal details
        payload.additionalDetails = {};
        if (formData?.data?.holdingNumber) payload.additionalDetails.holdingNo = formData?.data?.holdingNumber;
        if (formData?.data?.registrationDetails) payload.additionalDetails.registrationDetails = formData?.data?.registrationDetails;

        //For LandInfo
        payload.landInfo = formData?.data?.bpaData?.bpaApprovalResponse?.[0].landInfo || {};

        // create BPA call
        Digit.OBPSService.create({ BPA: payload }, tenantId)
          .then((result, err) => {
            if (result?.BPA?.length > 0) {
              result.BPA[0].data = formData.data;
              onSelect("", result.BPA[0], "", true);
            }
          })
          .catch((e) => {
            setShowToast({key: "true", message: e?.response?.data?.Errors[0]?.message || null});
          });
      } else {
        onSelect("", formData, "", true);
      }
    } else {
      onSelect(config.key, subOccupancyObject);
    }
  }

const clearall = (num) => {
    let res = [];
    let temp = subOccupancyObject;
    temp[`Block_${num}`]=res;
    setsubOccupancy(res);
    setsubOccupancyObject(temp);
}

  function getSubOccupancyValues(index) {
    let values = formData?.data?.bpaData?.bpaApprovalResponse?.[0]?.landInfo?.unit;
    let returnValue = "";
    if (values?.length > 0) {
      let splitArray = values[index]?.usageCategory?.split(',');
      if (splitArray?.length) {
        const returnValueArray = splitArray.map(data => data ? `${t(`BPA_SUBOCCUPANCYTYPE_${data}`)}` : "NA");
        returnValue = returnValueArray.join(',')
      }
    }
    return returnValue ? returnValue : "NA";
  }


  return (
    <React.Fragment>
    <Timeline currentStep={checkingUrl ? 2 : 1} flow= {checkingUrl ? "OCBPA" : ""}/>
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} /* isDisabled={Object.keys(subOccupancyObject).length === 0} */>
      <CardSubHeader>{t("BPA_EDCR_DETAILS")}</CardSubHeader>
      <StatusTable  style={{border:"none"}}>
      <Row className="border-none" style={{border:"none"}} label={checkingUrl ? t("BPA_OC_EDCR_NO_LABEL") : t("BPA_EDCR_NO_LABEL")} text={data?.edcrNumber}></Row>
      <Row className="border-none" 
      label={t("BPA_UPLOADED_PLAN_DIAGRAM")} 
      text={<ActionButton label={t("BPA_UPLOADED_PLAN")} jumpTo={data?.updatedDxfFile} />}>
      </Row>
      <Row className="border-none" 
      label={t("BPA_SCRUNTINY_REPORT_OUTPUT")} 
      text={<ActionButton label={t("BPA_SCRUTINY_REPORT_PDF")} jumpTo={data?.planReport} />}>
      </Row>
      </StatusTable>
      <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
      <CardSubHeader>{t("BPA_BUILDING_EXTRACT_HEADER")}</CardSubHeader>
      <StatusTable  style={{border:"none"}}>
      <Row className="border-none" label={t("BPA_BUILTUP_AREA_HEADER")} text={data?.planDetail?.blocks?.[0]?.building?.totalBuitUpArea}></Row>
      <Row className="border-none" label={t("BPA_SCRUTINY_DETAILS_NUMBER_OF_FLOORS_LABEL")} text={data?.planDetail?.blocks?.[0]?.building?.totalFloors}></Row>
      <Row className="border-none" label={t("BPA_HEIGHT_FROM_GROUND_LEVEL")} text={`${data?.planDetail?.blocks?.[0]?.building?.declaredBuildingHeight} mtrs`}></Row>
      </StatusTable>
      <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
      <CardSubHeader>{t("BPA_OCC_SUBOCC_HEADER")}</CardSubHeader>
      {data?.planDetail?.blocks.map((block,index)=>(
      <div key={index}>
      <CardSubHeader>{t("BPA_BLOCK_SUBHEADER")} {index+1}</CardSubHeader>
      { !checkingUrl ? <CardSectionHeader style={{fontWeight: "normal"}} className="card-label-smaller">{t("BPA_SUB_OCCUPANCY_LABEL")}</CardSectionHeader> : null }
      { !checkingUrl ? <MultiSelectDropdown
              BlockNumber={block.number}
              className="form-field"
              isMandatory={true}
              defaultUnit="Selected"
              selected={subOccupancyObject[`Block_${block.number}`]}
              //selected={subOccupancy}
              options={getsuboptions()}
              onSelect={selectOccupancy}
              isOBPSMultiple={true}
              optionsKey="name"
              t={t}
            /> : null }
        { !checkingUrl ? <div className="tag-container">
               {subOccupancyObject[`Block_${block.number}`] && subOccupancyObject[`Block_${block.number}`].length > 0 &&
                subOccupancyObject[`Block_${block.number}`].map((value, index) => (
                  <RemoveableTag key={index} text={`${t(value["name"])}`} onClick={() => onRemove(index,value,block.number)} />
                ))}
        </div> : null }
        { !checkingUrl ? (subOccupancyObject[`Block_${block.number}`] && subOccupancyObject[`Block_${block.number}`].length>0 ) && <LinkButton style={{textAlign:"left"}} label={"Clear All"} onClick={() => clearall(block.number)}/>: null}
      <div style={{overflow:"scroll"}}>
      { checkingUrl ? <StatusTable>
        <Row className="border-none" label={`${t("BPA_SUB_OCCUPANCY_LABEL")}:`} text={getSubOccupancyValues(index)}></Row>
      </StatusTable>: null }
      <Table
        className="customTable"
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
      <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
      </div>
      </div>))}
      <CardSubHeader>{t("BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL")}</CardSubHeader>
      <StatusTable  style={{border:"none"}}>
      <Row label={t("BPA_APPLICATION_DEMOLITION_AREA_LABEL")} text={data?.planDetail?.planInformation?.demolitionArea?`${data?.planDetail?.planInformation?.demolitionArea} sq.mtrs`:t("CS_NA")}></Row>
      </StatusTable>
      </FormStep>
      {showToast && <Toast
        error={true}
        label={t(showToast?.message)}
        isDleteBtn={true}
        onClose={closeToast}
      />
      }
      </React.Fragment>
      
  );


  
};

export default ScrutinyDetails;
