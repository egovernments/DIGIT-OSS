import {
    Card, CardHeader, CardSubHeader, CardText,
    CitizenInfoLabel, Header, LinkButton, Row, StatusTable, SubmitBar, Table, CardSectionHeader, EditIcon, PDFSvg, Loader
  } from "@egovernments/digit-ui-react-components";
  import React,{ useMemo }  from "react";
  import { useTranslation } from "react-i18next";
  import { useHistory, useRouteMatch } from "react-router-dom";
  import Timeline from "../../../components/Timeline";
  import { convertEpochToDateDMY, stringReplaceAll, getOrderDocuments } from "../../../utils";
  import DocumentsPreview from "../../../../../templates/ApplicationDetails/components/DocumentsPreview";

  const CheckPage = ({ onSubmit, value }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const match = useRouteMatch();
    let user = Digit.UserService.getUser();
    const tenantId = user?.info?.permanentCity || value?.tenantId ||Digit.ULBService.getCurrentTenantId() ;
    let BusinessService;
    if(value.businessService === "BPA_LOW")
    BusinessService="BPA.LOW_RISK_PERMIT_FEE";
    else if(value.businessService === "BPA")
    BusinessService="BPA.NC_APP_FEE";

    const { data, address, owners, nocDocuments, documents, additionalDetails, subOccupancy,PrevStateDocuments,PrevStateNocDocuments,applicationNo } = value;
    const isEditApplication = window.location.href.includes("editApplication");
    
      // for application documents
      let improvedDoc = [];
      PrevStateDocuments?.map(preDoc => { improvedDoc.push({...preDoc, module: "OBPS"}) });
      documents?.documents?.map(appDoc => { improvedDoc.push({...appDoc, module: "OBPS"}) });

      //for NOC documents 
      PrevStateNocDocuments?.map(preNocDoc => { improvedDoc.push({...preNocDoc, module: "NOC"}) });
      nocDocuments?.nocDocuments?.map(nocDoc => { improvedDoc.push({...nocDoc, module: "NOC"}) });

      const { data: pdfDetails, isLoading:pdfLoading, error } = Digit.Hooks.useDocumentSearch( improvedDoc, { enabled: improvedDoc?.length > 0 ? true : false});
      
      let applicationDocs = [], nocAppDocs = [];
      if (pdfDetails?.pdfFiles?.length > 0) {  
        pdfDetails?.pdfFiles?.map(pdfAppDoc => {
          if (pdfAppDoc?.module == "OBPS") applicationDocs.push(pdfAppDoc);
          if (pdfAppDoc?.module == "NOC") nocAppDocs.push(pdfAppDoc);
        });
      }

    const { data:datafromAPI, isLoading, refetch } = Digit.Hooks.obps.useScrutinyDetails(tenantId,value?.data?.scrutinyNumber, {
        enabled: value?.data?.scrutinyNumber?true:false,
      })
    let consumerCode=value?.applicationNo;
    const fetchBillParams = { consumerCode };

    function getdate(date) {
      let newdate = Date.parse(date);
      return `${new Date(newdate).getDate().toString() + "/" + (new Date(newdate).getMonth() + 1).toString() + "/" + new Date(newdate).getFullYear().toString()
        }`;
    }



      const {data:paymentDetails} = Digit.Hooks.useFetchBillsForBuissnessService(
        { businessService: BusinessService, ...fetchBillParams, tenantId: tenantId },
        {
          enabled: consumerCode ? true : false,
          retry: false,
        }
      );

      const sendbacktocitizenApp = window.location.href.includes("sendbacktocitizen");
      let routeLink = `/digit-ui/citizen/obps/bpa/${additionalDetails?.applicationType.toLowerCase()}/${additionalDetails?.serviceType.toLowerCase()}`;
      if (isEditApplication) routeLink = `/digit-ui/citizen/obps/editApplication/bpa/${value?.tenantId}/${value?.applicationNo}`;
      if( sendbacktocitizenApp ) routeLink = `/digit-ui/citizen/obps/sendbacktocitizen/bpa/${value?.tenantId}/${value?.applicationNo}`;

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

      function routeTo(jumpTo) {
        location.href=jumpTo;
    }

    function getBlockSubOccupancy(index){
      let subOccupancyString = "";
      let returnValueArray = [];
      subOccupancy && subOccupancy[`Block_${index+1}`] && subOccupancy[`Block_${index+1}`].map((ob) => {
        // subOccupancyString += `${t(ob.i18nKey)}, `;
        returnValueArray.push(`${t(stringReplaceAll(ob?.i18nKey?.toUpperCase(), "-", "_"))}`);
      })
      return returnValueArray?.length ? returnValueArray.join(', ') : "NA"
      // return subOccupancyString;
    }

    if (pdfLoading || isLoading) {
      return <Loader />
    }


    return (
    <React.Fragment>
    <Timeline currentStep={4} />
    <Header styles={{marginLeft: "10px"}}>{t("BPA_STEPPER_SUMMARY_HEADER")}</Header>
    <Card style={{paddingRight:"16px"}}>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_APPLICATION_NUMBER_LABEL`)} text={applicationNo?applicationNo:""} />
        </StatusTable>
    </Card>
    <Card style={{paddingRight:"16px"}}>
    <CardHeader>{t(`BPA_BASIC_DETAILS_TITLE`)}</CardHeader>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APP_DATE_LABEL`)} text={convertEpochToDateDMY(Number(data?.applicationDate))} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL`)} text={t(`WF_BPA_${data?.applicationType}`)}/>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL`)} text={t(data?.serviceType)} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_OCCUPANCY_LABEL`)} text={data?.occupancyType}/>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_RISK_TYPE_LABEL`)} text={t(`WF_BPA_${data?.riskType}`)} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL`)} text={data?.applicantName} />
        </StatusTable>
    </Card>
    <Card style={{paddingRight:"16px"}}>
    <StatusTable>
    <CardHeader>{t("BPA_PLOT_DETAILS_TITLE")}</CardHeader>
    <LinkButton
          label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
          style={{ width: "100px", display:"inline" }}
          onClick={() => routeTo(`${routeLink}/plot-details`)}
        />
          <Row className="border-none" textStyle={{paddingLeft:"12px"}} label={t(`BPA_BOUNDARY_PLOT_AREA_LABEL`)} text={datafromAPI?.planDetail?.planInformation?.plotArea ? `${datafromAPI?.planDetail?.planInformation?.plotArea} ${t(`BPA_SQ_FT_LABEL`)}` : t("CS_NA")} />
          <Row className="border-none" label={t(`BPA_PLOT_NUMBER_LABEL`)} text={datafromAPI?.planDetail?.planInformation?.plotNo || t("CS_NA")} />
          <Row className="border-none" label={t(`BPA_KHATHA_NUMBER_LABEL`)} text={datafromAPI?.planDetail?.planInformation?.khataNo || t("CS_NA")}/>
          <Row className="border-none" label={t(`BPA_HOLDING_NUMBER_LABEL`)} text={data?.holdingNumber || t("CS_NA")} />
          <Row className="border-none" label={t(`BPA_BOUNDARY_LAND_REG_DETAIL_LABEL`)} text={data?.registrationDetails || t("CS_NA")} />
    </StatusTable>
    </Card>
    <Card style={{paddingRight:"16px"}}>
    <CardHeader>{t("BPA_STEPPER_SCRUTINY_DETAILS_HEADER")}</CardHeader>
    <CardSubHeader style={{fontSize: "20px"}}>{t("BPA_EDCR_DETAILS")}</CardSubHeader>
    <StatusTable  style={{border:"none"}}>
      <Row className="border-none" label={t("BPA_EDCR_NO_LABEL")} text={data?.scrutinyNumber?.edcrNumber}></Row>
      <CardSubHeader>{t("BPA_UPLOADED_PLAN_DIAGRAM")}</CardSubHeader>
      <LinkButton
        label={ <PDFSvg /> }
          onClick={() => routeTo(datafromAPI?.updatedDxfFile)}
       />
       <p style={{ marginTop: "8px", marginBottom: "20px", textAlign:"Left", fontSize: "16px", lineHeight: "19px", color: "#505A5F", fontWeight: "400" }}>{t(`BPA_UPLOADED_PLAN_DXF`)}</p>
      <CardSubHeader>{t("BPA_SCRUNTINY_REPORT_OUTPUT")}</CardSubHeader>
      <LinkButton
        label={ <PDFSvg /> }
          onClick={() => routeTo(datafromAPI?.planReport)}
       />
       <p style={{ marginTop: "8px", marginBottom: "20px", textAlign:"Left", fontSize: "16px", lineHeight: "19px", color: "#505A5F", fontWeight: "400" }}>{t(`BPA_SCRUTINY_REPORT_PDF`)}</p>
      </StatusTable>
      <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
      <CardSubHeader style={{fontSize: "20px"}}>{t("BPA_BUILDING_EXTRACT_HEADER")}</CardSubHeader>
      <StatusTable>
      <Row className="border-none" label={t("BPA_TOTAL_BUILT_UP_AREA_HEADER")} text={`${datafromAPI?.planDetail?.blocks?.[0]?.building?.totalBuitUpArea} ${t("BPA_SQ_MTRS_LABEL")}`}></Row>
      <Row className="border-none" label={t("BPA_SCRUTINY_DETAILS_NUMBER_OF_FLOORS_LABEL")} text={datafromAPI?.planDetail?.blocks?.[0]?.building?.totalFloors}></Row>
      <Row className="border-none" label={t("BPA_HEIGHT_FROM_GROUND_LEVEL_FROM_MUMTY")} text={`${datafromAPI?.planDetail?.blocks?.[0]?.building?.declaredBuildingHeight} ${t("BPA_MTRS_LABEL")}`}></Row>
      </StatusTable>
      <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
      <CardSubHeader style={{fontSize: "20px"}}>{t("BPA_OCC_SUBOCC_HEADER")}</CardSubHeader>
      {datafromAPI?.planDetail?.blocks.map((block,index)=>(
      <div key={index} style={datafromAPI?.planDetail?.blocks?.length > 1 ?{ marginTop: "19px", background: "#FAFAFA", border: "1px solid #D6D5D4", borderRadius: "4px", padding: "8px", lineHeight: "19px", maxWidth: "960px", minWidth: "280px" } : {}}>
      <CardSubHeader style={{marginTop:"15px", fontSize: "18px"}}>{t("BPA_BLOCK_SUBHEADER")} {index+1}</CardSubHeader>
      <StatusTable >
      <Row className="border-none" textStyle={{wordBreak:"break-word"}} label={t("BPA_SUB_OCCUPANCY_LABEL")} text={getBlockSubOccupancy(index) === ""?t("CS_NA"):getBlockSubOccupancy(index)}></Row>
      </StatusTable>
      <div style={{overflow:"scroll"}}>
      <Table
        className="customTable table-fixed-first-column table-border-style"
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
      </div>
      </div>))}
      <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
      <CardSubHeader style={{fontSize: "20px"}}>{t("BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL")}</CardSubHeader>
      <StatusTable  style={{border:"none"}}>
      <Row className="border-none" label={t("BPA_APPLICATION_DEMOLITION_AREA_LABEL")} text={datafromAPI?.planDetail?.planInformation?.demolitionArea ? `${datafromAPI?.planDetail?.planInformation?.demolitionArea} ${t("BPA_SQ_MTRS_LABEL")}` : t("CS_NA")}></Row>
      </StatusTable>
      </Card>
      <Card style={{paddingRight:"16px"}}>
      <StatusTable>
      <CardHeader>{t("BPA_NEW_TRADE_DETAILS_HEADER_DETAILS")}</CardHeader>
          <LinkButton
            label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
            style={{ width: "100px", display: "inline" }}
            onClick={() => routeTo(`${routeLink}/location`)}
          />
          <Row className="border-none" textStyle={{paddingLeft:"12px"}} label={t(`BPA_DETAILS_PIN_LABEL`)} text={address?.pincode || t("CS_NA")} />
          <Row className="border-none" label={t(`BPA_CITY_LABEL`)} text={address?.city?.name || t("CS_NA")} />
          <Row className="border-none" label={t(`BPA_LOC_MOHALLA_LABEL`)} text={address?.locality?.name || t("CS_NA")} />
          <Row className="border-none" label={t(`BPA_DETAILS_SRT_NAME_LABEL`)} text={address?.street || t("CS_NA")} />
          <Row className="border-none" label={t(`ES_NEW_APPLICATION_LOCATION_LANDMARK`)} text={address?.landmark || t("CS_NA")} />
      </StatusTable>
      </Card>
      <Card style={{paddingRight:"16px"}}>
      <StatusTable>
        <CardHeader>{t("BPA_APPLICANT_DETAILS_HEADER")}</CardHeader>
          <LinkButton
            label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
            style={{ width: "100px", display: "inline" }}
            onClick={() => routeTo(`${routeLink}/owner-details`)}
          />
        {owners?.owners && owners?.owners.map((ob,index) =>(
        <div key={index} style={owners?.owners?.length > 1 ?{ marginTop: "19px", background: "#FAFAFA", border: "1px solid #D6D5D4", borderRadius: "4px", padding: "8px", lineHeight: "19px", maxWidth: "960px", minWidth: "280px" } : {}}>
        {owners.owners.length > 1 && <CardSubHeader>{t("COMMON_OWNER")} {index+1}</CardSubHeader>}
        <StatusTable>
        <Row className="border-none" textStyle={index==0 && owners.owners.length == 1 ?{paddingLeft:"12px"}:{}} label={t(`CORE_COMMON_NAME`)} text={ob?.name} />
        <Row className="border-none" label={t(`BPA_APPLICANT_GENDER_LABEL`)} text={t(ob?.gender?.i18nKey)} />
        <Row className="border-none" label={t(`CORE_COMMON_MOBILE_NUMBER`)} text={ob?.mobileNumber} /> 
        <Row className="border-none" label={t(`BPA_IS_PRIMARY_OWNER_LABEL`)} text={`${ob?.isPrimaryOwner}`} /> 
        </StatusTable>
        </div>))}
        </StatusTable>
      </Card>
      <Card style={{paddingRight:"16px"}}>
      <StatusTable>
        <CardHeader>{t("BPA_DOCUMENT_DETAILS_LABEL")}</CardHeader>
          <LinkButton
            label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
            style={{ width: "100px", display: "inline" }}
            onClick={() => routeTo(`${routeLink}/document-details`)}
          />
        {<DocumentsPreview documents={getOrderDocuments(applicationDocs)} svgStyles = {{}} isSendBackFlow = {false} isHrLine = {true} titleStyles ={{fontSize: "18px", lineHeight: "24px", "fontWeight": 700, marginBottom: "10px"}}/>}
        </StatusTable>
      </Card>
      <Card style={{paddingRight:"16px"}}>
      <StatusTable>
      <CardHeader>{t("BPA_NOC_DETAILS_SUMMARY")}</CardHeader>
          <LinkButton
            label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
            style={{ width: "100px", display: "inline" }}
            onClick={() => routeTo(`${routeLink}/noc-details`)}
          />
      {nocDocuments && nocDocuments?.NocDetails.map((noc, index) => (
        <div key={`noc-${index}`} style={nocDocuments?.NocDetails?.length > 1 ?{ marginTop: "19px", background: "#FAFAFA", border: "1px solid #D6D5D4", borderRadius: "4px", padding: "8px", lineHeight: "19px", maxWidth: "960px", minWidth: "280px" } : {}}>
        <CardSectionHeader style={{marginBottom: "24px"}}>{`${t(`BPA_${noc?.nocType}_HEADER`)}`}</CardSectionHeader>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_${noc?.nocType}_LABEL`)} text={noc?.applicationNo} />
          <Row className="border-none" label={t(`BPA_NOC_STATUS`)} text={t(`${noc?.applicationStatus}`)} textStyle={noc?.applicationStatus == "APPROVED" || noc?.applicationStatus == "AUTO_APPROVED" ? {color : "#00703C"} : {color: "#D4351C"}} />
          {noc?.additionalDetails?.SubmittedOn ? <Row className="border-none" label={`${t("BPA_NOC_SUBMISSION_DATE")}`} text={noc?.additionalDetails?.SubmittedOn ? convertEpochToDateDMY(Number(noc?.additionalDetails?.SubmittedOn)) : "NA"} /> : null }
          {noc?.nocNo ? <Row className="border-none" label={`${t("BPA_APPROVAL_NUMBER_LABEL")}`} text={noc?.nocNo || "NA"} /> : null }
          {(noc?.applicationStatus === "APPROVED" || noc?.applicationStatus === "REJECTED" || noc?.applicationStatus === "AUTO_APPROVED" || noc?.applicationStatus === "AUTO_REJECTED") ? <Row className="border-none" label={`${t("BPA_APPROVED_REJECTED_ON_LABEL")}`} text= {convertEpochToDateDMY(Number(noc?.auditDetails?.lastModifiedTime))} /> : null }
          <Row className="border-none" label={t(`BPA_DOCUMENT_DETAILS_LABEL`)} text={""} />
          {<DocumentsPreview documents={getOrderDocuments(nocAppDocs?.filter(data => data?.documentType?.includes(noc?.nocType?.split("_")?.[0])), true)} svgStyles = {{}} isSendBackFlow = {false} isHrLine = {true} titleStyles ={{fontSize: "18px", lineHeight: "24px", "fontWeight": 700, marginBottom: "10px"}}/>}
        </StatusTable>
      </div>
      ))}
      </StatusTable>
      </Card>
      <Card style={{paddingRight:"16px"}}>
      <CardSubHeader>{t("BPA_SUMMARY_FEE_EST")}</CardSubHeader> 
      <StatusTable>
      {paymentDetails?.Bill[0]?.billDetails[0]?.billAccountDetails.map((bill,index)=>(
        <div key={index}>
          <Row className="border-none" label={t(`${bill.taxHeadCode}`)} text={`₹ ${bill?.amount}`} />
        </div>
      ))}
       <Row className="border-none" label={t(`BPA_COMMON_TOTAL_AMT`)} text={`₹ ${paymentDetails?.Bill?.[0]?.billDetails[0]?.amount || "0"}`} />
       </StatusTable>
      <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
      <CardHeader>{t("BPA_COMMON_TOTAL_AMT")}</CardHeader> 
      <CardHeader>₹ {paymentDetails?.Bill?.[0]?.billDetails[0]?.amount || "0"}</CardHeader> 
      <SubmitBar label={t("BPA_SEND_TO_CITIZEN_LABEL")} onSubmit={onSubmit} />
      </Card>
    </React.Fragment>
    );
  };
  
  export default CheckPage;
  