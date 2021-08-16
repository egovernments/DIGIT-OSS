import { FormStep,MultiSelectDropdown, Table, RadioButtons, Card, CardHeader, Loader, MultiLink, Row, SubmitBar, Header, CardSubHeader, StatusTable, CardLabel,LinkButton, CardSectionHeader,RemoveableTag } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState, useMemo } from "react";
import { render } from "react-dom";
import { useTranslation } from "react-i18next";
import { Link, useHistory, useParams } from "react-router-dom";

const ScrutinyDetails = ({ onSelect, userType, formData,config }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [subOccupancy, setsubOccupancy] = useState([]);
  const [subOccupancyOption, setsubOccupancyOption] = useState([]);
  const [floorData, setfloorData] = useState([]);
  let scrutinyNumber=`DCR82021WY7QW`;
  let tenantId="pb.amritsar";
  const { data, isLoading, refetch } = Digit.Hooks.obps.useScrutinyDetails(tenantId,{edcrNumber:"DCR82021WY7QW"}, {
    enabled: true
  })
  console.log(data,"data from api");

  useEffect(() => {
      let floors = [];
    data?.planDetail?.blocks?.[0].building.floors.map((ob) => {
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
    setfloorData(floors);
  },[data])

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
const selectOccupancy = (e, data) => {
  const index = subOccupancy.filter((ele) => ele.code == data.code);
  console.log(index,"index");
    let res = null;
    if (index.length) {
      subOccupancy.splice(subOccupancy.indexOf(index[0]), 1);
      res = [...subOccupancy];
    } else {
      res = [{ ...data }, ...subOccupancy];
    }
    console.log(res);
    setsubOccupancy(res);
};

const onRemove = (index, key) => {
    let afterRemove = subOccupancy.filter((value, i) => {
      return i !== index;
    });
   setsubOccupancy(afterRemove);

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
    console.log("to do");
}

const clearall = () => {
    let res = [];
    setsubOccupancy(res);
}


  return (
    <React.Fragment>
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={false}>
      <CardSubHeader>{t("BPA_EDCR_DETAILS")}</CardSubHeader>
      <StatusTable  style={{border:"none"}}>
      <Row style={{border:"none"}} label="BPA_EDCR_NO_LABEL" text={data?.edcrNumber}></Row>
      <Row 
      label="BPA_UPLOADED_PLAN_DIAGRAM" 
      text={<ActionButton label="BPA_UPLOADED_PLAN" jumpTo={data?.updatedDxfFile} />}>
      </Row>
      <Row
      label="BPA_SCRUNTINY_REPORT_OUTPUT" 
      text={<ActionButton label="BPA_SCRUTINY_REPORT_PDF" jumpTo={data?.planReport} />}>
      </Row>
      </StatusTable>
      <hr style={{borderWidth:"0",color:"gray",height:"2px"}}></hr>
      <CardSubHeader>{t("BPA_BUILDING_EXTRACT_HEADER")}</CardSubHeader>
      <StatusTable  style={{border:"none"}}>
      <Row label="BPA_BUILTUP_AREA_HEADER" text={data?.planDetail?.blocks?.[0]?.building?.totalBuitUpArea}></Row>
      <Row label="BPA_SCRUTINY_DETAILS_NUMBER_OF_FLOORS_LABEL" text={data?.planDetail?.blocks?.[0]?.building?.totalFloors}></Row>
      <Row label="BPA_APPLICATION_HIGH_FROM_GROUND" text={data?.planDetail?.blocks?.[0]?.building?.declaredBuildingHeight}></Row>
      </StatusTable>
      <CardSubHeader>{t("BPA_OCC_SUBOCC_HEADER")}</CardSubHeader>
      <CardSectionHeader className="card-label-smaller">{t("BPA_SUB_OCCUPANCY_LABEL")}</CardSectionHeader>
      <MultiSelectDropdown
              className="form-field"
              isMandatory={true}
              defaultUnit="Selected"
              selected={subOccupancy}
              options={getsuboptions()}
              onSelect={selectOccupancy}
              optionsKey="name"
              t={t}
            />
        <div className="tag-container">
               {subOccupancy.length > 0 &&
                subOccupancy.map((value, index) => (
                  <RemoveableTag key={index} text={`${t(value["name"])}`} onClick={() => onRemove(index,value)} />
                ))}
        </div>
        {subOccupancy && <LinkButton label={"Clear All"} onClick={clearall}/>}
      <div style={{overflow:"scroll"}}>
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
        data={floorData}
        columns={tableColumns}
        getCellProps={(cellInfo) => {
          return {
            style: {},
          };
        }}
      />
      </div>
      <CardSubHeader>{t("BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL")}</CardSubHeader>
      <StatusTable  style={{border:"none"}}>
      <Row label="BPA_APPLICATION_DEMOLITION_AREA_LABEL" text={data?.planDetail?.planInformation?.demolitionArea}></Row>
      </StatusTable>
      </FormStep>
      </React.Fragment>
      
  );


  
};

export default ScrutinyDetails;
