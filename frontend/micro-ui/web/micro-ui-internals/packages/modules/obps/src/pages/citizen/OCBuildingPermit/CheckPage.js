import {
  Card, 
  CardHeader, 
  CardSubHeader, 
  Header, 
  LinkButton, 
  Row, 
  StatusTable, 
  SubmitBar, 
  Table, 
  CardSectionHeader,
  EditIcon,
  PDFSvg
} from "@egovernments/digit-ui-react-components";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import Timeline from "../../../components/Timeline";
import OBPSDocument from "../../../pageComponents/OBPSDocuments";

const CheckPage = ({ onSubmit, value }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
  let user = Digit.UserService.getUser();
  const tenantId = user.info.permanentCity;
  //let tenantId="pb.amritsar";
  let BusinessService;
  if (value.businessService === "BPA_LOW")
    BusinessService = "BPA.LOW_RISK_PERMIT_FEE";
  else if (value.businessService === "BPA")
    BusinessService = "BPA.NC_APP_FEE";
  else if (value.businessService === "BPA_OC")
    BusinessService = "BPA.NC_OC_APP_FEE"

  const { data, address, owners, nocDocuments, documents, additionalDetails, PrevStateDocuments, PrevStateNocDocuments, applicationNo } = value;
  let isEditApplication = window.location.href.includes("editApplication");
  let val;
  var i;
  let improvedDoc =isEditApplication?[...PrevStateDocuments , ...documents.documents]: [...documents.documents];
  improvedDoc.map((ob) => { ob["isNotDuplicate"] = true; })
  improvedDoc.map((ob,index) => {
    val = ob.documentType;
    if(ob.isNotDuplicate == true)
    for(i=index+1; i<improvedDoc.length;i++)
    {
      if(val === improvedDoc[i].documentType)
      improvedDoc[i].isNotDuplicate=false;
    }
  })
  const { data: datafromAPI, isLoading, refetch } = Digit.Hooks.obps.useScrutinyDetails(tenantId, value?.data?.scrutinyNumber, {
    enabled: true
  })
  let consumerCode = value?.applicationNo;
  const fetchBillParams = { consumerCode };



  const { data: paymentDetails } = Digit.Hooks.useFetchBillsForBuissnessService(
    { businessService: BusinessService, ...fetchBillParams, tenantId: tenantId },
    {
      enabled: consumerCode ? true : false,
      retry: false,
    }
  );


  let routeLink = !isEditApplication?`/digit-ui/citizen/obps/bpa/${additionalDetails?.applicationType.toLowerCase()}/${additionalDetails?.serviceType.toLowerCase()}`:`/digit-ui/citizen/obps/editApplication/ocbpa/${value?.tenantId}/${value?.applicationNo}`;

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
    }
  ]

  const accessData = (plot) => {
    const name = plot;
    return (originalRow, rowIndex, columns) => {
      return originalRow[name];
    }
  }


  const tableColumns = useMemo(
    () => {

      return tableHeader.map((ob) => ({
        Header: t(`${ob.name}`),
        accessor: accessData(ob.id),
        id: ob.id,
        //symbol: plot?.symbol,
        //sortType: sortRows,
      }));


    });


  function getFloorData(block) {
    let floors = [];
    block?.building?.floors.map((ob) => {
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

  function getSubOccupancyValues(index) {
    let values = data?.bpaData?.bpaApprovalResponse?.[0]?.landInfo?.unit;
    let returnValue = "";
    if(values?.length > 0) {
      let splitArray = values[index]?.usageCategory?.split(',');
      if(splitArray?.length) {
        const returnValueArray = splitArray.map(data => data ? `${t(`BPA_SUBOCCUPANCYTYPE_${data}`)}` : "NA");
        returnValue = returnValueArray.join(',')
      }
    }
    return returnValue ? returnValue : "NA";
  }

  function routeTo(jumpTo) {
    location.href = jumpTo;
  }

  function getdate(date) {
    let newdate = Date.parse(date);
    return `${new Date(newdate).getDate().toString() + "/" + (new Date(newdate).getMonth() + 1).toString() + "/" + new Date(newdate).getFullYear().toString()
      }`;
  }

  return (
    <React.Fragment>
      <Timeline currentStep={4} />
      <Header>{t("BPA_STEPPER_SUMMARY_HEADER")}</Header>
      <Card style={{paddingRight:"16px"}}>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_APPLICATION_NUMBER_LABEL`)} text={applicationNo?applicationNo:""} />
        </StatusTable>
      </Card>
      <Card>
        <CardHeader>{t(`BPA_BASIC_DETAILS_TITLE`)}</CardHeader>
        <StatusTable>
          <Row className="border-none" label={`${t(`BPA_BASIC_DETAILS_APP_DATE_LABEL`)}`} text={getdate(data?.applicationDate)} />
          <Row className="border-none" label={`${t(`BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL`)}`} text={t(`WF_BPA_${data?.applicationType}`)} />
          <Row className="border-none" label={`${t(`BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL`)}`} text={t(data?.serviceType)} />
          <Row className="border-none" label={`${t(`BPA_BASIC_DETAILS_OCCUPANCY_LABEL`)}`} text={data?.occupancyType} />
          <Row className="border-none" label={`${t(`BPA_BASIC_DETAILS_RISK_TYPE_LABEL`)}`} text={t(`WF_BPA_${data?.riskType}`)} />
          <Row className="border-none" label={`${t(`BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL`)}`} text={data?.applicantName} />
        </StatusTable>
      </Card>
      <Card>
        <CardHeader>{t("BPA_PLOT_DETAILS_TITLE")}</CardHeader>
        <LinkButton
          label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
          style={{ width: "100px", display: "inline" }}
          onClick={() => routeTo(`${routeLink}/plot-details`)}
        />
        <StatusTable>
          <Row className="border-none" label={`${t(`BPA_BOUNDARY_PLOT_AREA_LABEL`)}`} text={`${datafromAPI?.planDetail?.planInformation?.plotArea} sq.ft` || t("CS_NA")} textStyle={{marginLeft:"9px"}}/>
          <Row className="border-none" label={`${t(`BPA_PLOT_NUMBER_LABEL`)}`} text={datafromAPI?.planDetail?.planInformation?.plotNo || t("CS_NA")} />
          <Row className="border-none" label={`${t(`BPA_KHATHA_NUMBER_LABEL`)}`} text={datafromAPI?.planDetail?.planInformation?.khataNo || t("CS_NA")} />
          <Row className="border-none" label={`${t(`BPA_HOLDING_NUMBER_LABEL`)}`} text={data?.holdingNumber || t("CS_NA")} />
          <Row className="border-none" label={`${t(`BPA_BOUNDARY_LAND_REG_DETAIL_LABEL`)}`} text={data?.registrationDetails || t("CS_NA")} />
        </StatusTable>
      </Card>
      <Card>
        <CardHeader>{`${t("BPA_STEPPER_SCRUTINY_DETAILS_HEADER")}`}</CardHeader>
        <CardSubHeader>{`${t("BPA_EDCR_DETAILS")}:`}</CardSubHeader>
        <StatusTable style={{ border: "none" }}>
          <Row className="border-none" label={`${t("BPA_OC_EDCR_NO_LABEL")}`} text={data?.scrutinyNumber?.edcrNumber}></Row>
          <Row className="border-none" label={`${t("BPA_UPLOADED_PLAN_DIAGRAM")}`}></Row>
          <LinkButton
            label={ <PDFSvg style={{background: "#f6f6f6", padding: "8px" }} width="100px" height="100px" viewBox="0 0 25 25" minWidth="100px" /> }
            onClick={() => routeTo(datafromAPI?.updatedDxfFile)}
          />
          <p style={{ marginTop: "8px", textAlign: "Left" }}>{t(`Uploaded Plan.DXF`)}</p>
          <Row className="border-none" label={`${t("BPA_SCRUNTINY_REPORT_OUTPUT")}`} ></Row>
          <LinkButton
            label={ <PDFSvg style={{background: "#f6f6f6", padding: "8px" }} width="100px" height="100px" viewBox="0 0 25 25" minWidth="100px" /> }
            onClick={() => routeTo(datafromAPI?.planReport)}
          />
          <p style={{ marginTop: "8px", textAlign: "Left" }}>{t(`Scrutiny Report.PDF`)}</p>
        </StatusTable>
        <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
        <CardSubHeader>{`${t("BPA_BUILDING_EXTRACT_HEADER")}:`}</CardSubHeader>
        <StatusTable>
          <Row className="border-none" label={`${t("BPA_BUILTUP_AREA_HEADER")}`} text={datafromAPI?.planDetail?.blocks?.[0]?.building?.totalBuitUpArea}></Row>
          <Row className="border-none" label={`${t("BPA_SCRUTINY_DETAILS_NUMBER_OF_FLOORS_LABEL")}`} text={datafromAPI?.planDetail?.blocks?.[0]?.building?.totalFloors}></Row>
          <Row className="border-none" label={`${t("BPA_APPLICATION_HIGH_FROM_GROUND")}`} text={`${datafromAPI?.planDetail?.blocks?.[0]?.building?.declaredBuildingHeight} mtrs`}></Row>
        </StatusTable>
        <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
        <CardSubHeader>{`${t("BPA_OCC_SUBOCC_HEADER")}:`}</CardSubHeader>
        {datafromAPI?.planDetail?.blocks.map((block, index) => (
          <div key={index}>
            <CardSubHeader>{`${t("BPA_BLOCK_SUBHEADER")}-`} {index + 1}</CardSubHeader>
              <StatusTable>
                <Row className="border-none" label={`${t("BPA_SUB_OCCUPANCY_LABEL")}`} text={getSubOccupancyValues(index)}></Row>
              </StatusTable>
            <div style={{ overflow: "scroll" }}>
              <Table
                className="customTable"
                t={t}
                disableSort={false}
                autoSort={true}
                manualPagination={false}
                isPaginationRequired={false}
                initSortId="S N "
                data={getFloorData(block)}
                columns={tableColumns}
                getCellProps={(cellInfo) => {
                  return {
                    style: {},
                  };
                }}
              />
              <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
            </div>
          </div>))}
        <CardSubHeader>{`${t("BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL")}:`}</CardSubHeader>
        <StatusTable style={{ border: "none" }}>
          <Row className="border-none" label={`${t("BPA_APPLICATION_DEMOLITION_AREA_LABEL")}`} text={datafromAPI?.planDetail?.planInformation?.demolitionArea ? `${datafromAPI?.planDetail?.planInformation?.demolitionArea} sq.mtrs` : t("CS_NA")}></Row>
        </StatusTable>
      </Card>
      <Card>
        <CardHeader>{t("BPA_DOCUMENT_DETAILS_LABEL")}</CardHeader>
        <LinkButton
          label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
          style={{ width: "100px", display: "inline" }}
          onClick={() => routeTo(`${routeLink}/document-details`)}
        />
        {improvedDoc.map((doc, index) => (
          <div key={index}>
            {doc.isNotDuplicate && <div><CardSectionHeader>{`${t(doc?.documentType?.split('.').slice(0,2).join('_'))}`}</CardSectionHeader>
            <StatusTable>
              <OBPSDocument value={isEditApplication?[...PrevStateDocuments,...documents.documents]:value} Code={doc?.documentType} index={index} />
              <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
            </StatusTable>
          </div>}
          </div>
        ))}
      </Card>
      <Card>
        <CardHeader>{t("BPA_NOC_DETAILS_SUMMARY")}</CardHeader>
        <LinkButton
          label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
          style={{ width: "100px", display: "inline" }}
          onClick={() => routeTo(`${routeLink}/noc-details`)}
        />
        {nocDocuments && nocDocuments?.NocDetails.map((noc, index) => (
          // <div key={index} style={{ border: "1px solid #D6D5D4", padding: "16px 0px 16px 8px", background: "#FAFAFA", borderRadius: "5px", marginBottom: "24px", maxWidth:"600px" }}>
          <div key={index}>
            <CardSectionHeader style={{marginBottom: "24px"}}>{`${t(`BPA_${noc?.nocType}_HEADER`)}:`}</CardSectionHeader>
            <StatusTable>
              <Row className="border-none" label={t(`BPA_${noc?.nocType}_LABEL`)} text={noc?.applicationNo} />
              <Row className="border-none" label={t(`BPA_NOC_STATUS`)} text={t(`${noc?.applicationStatus}`)} textStyle={noc?.applicationStatus == "APPROVED" || noc?.applicationStatus == "AUTO_APPROVED" ? {color : "#00703C"} : {color: "#D4351C"}} />
              <Row className="border-none" label={t(`BPA_DOCUMENT_DETAILS_LABEL`)} text={""} />
              <OBPSDocument value={isEditApplication?[...PrevStateNocDocuments,...nocDocuments.nocDocuments]:value} Code={noc?.nocType?.split("_")[0]} index={index} isNOC={true}/>
              <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
            </StatusTable>
          </div>
        ))}
        {/* <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} /> */}
        <CardSubHeader>{`${t("BPA_SUMMARY_FEE_EST")}:`}</CardSubHeader>
        <StatusTable>
          {paymentDetails?.Bill[0]?.billDetails[0]?.billAccountDetails.map((bill, index) => (
            <div key={index}>
              <Row className="border-none" label={`${t(`${bill.taxHeadCode}`)}`} text={`₹ ${bill?.amount}`} />
            </div>
          ))}
        </StatusTable>
        <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
        <CardHeader>{t("BPA_COMMON_TOTAL_AMT")}</CardHeader>
        <CardHeader>₹ {paymentDetails?.Bill?.[0]?.billDetails[0]?.amount || "0"}</CardHeader>
        <SubmitBar label={t("CS_COMMON_SUBMIT")} onSubmit={onSubmit} />
      </Card>
    </React.Fragment>
  );
};

export default CheckPage;
