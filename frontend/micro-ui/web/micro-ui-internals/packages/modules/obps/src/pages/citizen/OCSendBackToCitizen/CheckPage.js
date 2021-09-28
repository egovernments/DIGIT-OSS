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
  PDFSvg,
  Toast
} from "@egovernments/digit-ui-react-components";
import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import Timeline from "../../../components/Timeline";
import OBPSDocument from "../../../pageComponents/OBPSDocuments";
import ActionModal from "../BpaApplicationDetail/Modal";
import { convertToBPAObject } from "../../../utils";
import cloneDeep from "lodash/cloneDeep";
import { useQueryClient } from "react-query";

const CheckPage = ({ onSubmit, value }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const match = useRouteMatch();
  let user = Digit.UserService.getUser(), BusinessService;
  const tenantId = user.info.permanentCity;
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const datafromAPI = value?.data?.edcrDetails;
  const queryClient = useQueryClient();
  const { data, address, owners, nocDocuments, documents, additionalDetails, subOccupancy } = value;

  let routeLink = `/digit-ui/citizen/obps/sendbacktocitizen/bpa/${value?.tenantId}/${value?.applicationNo}`;
  if (data?.uiFlow?.flow === "OCBPA") routeLink = `/digit-ui/citizen/obps/sendbacktocitizen/ocbpa/${value?.tenantId}/${value?.applicationNo}`;
  if (value.businessService === "BPA_LOW") BusinessService = "BPA.LOW_RISK_PERMIT_FEE";
  else if (value.businessService === "BPA") BusinessService = "BPA.NC_APP_FEE";

  const { data: reciept_data, isLoading: recieptDataLoading } = Digit.Hooks.useRecieptSearch(
    {
      tenantId: value?.tenantId,
      businessService: "BPA.NC_APP_FEE",
      consumerCodes: value?.applicationNo,
    },
    {}
  );

  const mutation = Digit.Hooks.obps.useObpsAPI(value?.tenantId, false);

  const workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: value?.tenantId,
    id: value?.applicationNo,
    moduleCode: "OBPS",
    config: {
      enabled: !!value
    }
  });

  const closeToast = () => {
    setShowToast(null);
  };

  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
  };

  const submitAction = (workflow) => {
    let bpaData = cloneDeep(value);
    bpaData.assignee = [];
    const isOCBPS = (data?.uiFlow?.flow === "OCBPA") ? true : false;
    const formdata = convertToBPAObject(bpaData, isOCBPS, true);
    mutation.mutate(
      { BPA: { ...formdata?.BPA, workflow } },
      {
        onError: (error, variables) => {
          setShowModal(false);
          setShowToast({ key: "error", action: error?.response?.data?.Errors[0]?.message || error });
          setTimeout(closeToast, 5000);
        },
        onSuccess: (data, variables) => {
          setShowModal(false);
          setShowToast({ key: "success", action: selectedAction });
          setTimeout(closeToast, 5000);
          queryClient.invalidateQueries("BPA_DETAILS_PAGE");
          queryClient.invalidateQueries("workFlowDetails");
          history.replace(`/digit-ui/citizen/obps/sendbacktocitizen/ocbpa/${value?.tenantId}/${value?.applicationNo}/acknowledgement`, { data: value?.applicationNo });
        },
      }
    );
  }

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
  ];

  const accessData = (plot) => {
    const name = plot;
    return (originalRow, rowIndex, columns) => {
      return originalRow[name];
    }
  };

  const tableColumns = useMemo(
    () => {
      return tableHeader.map((ob) => ({
        Header: t(`${ob.name}`),
        accessor: accessData(ob.id),
        id: ob.id
      }));
    });

  function onActionSelect(action = "FORWARD") {
    setSelectedAction("FORWARD");
    setShowModal(true);
  }

  function getdate(date) {
    let newdate = Date.parse(date);
    return `${new Date(newdate).getDate().toString() + "/" + (new Date(newdate).getMonth() + 1).toString() + "/" + new Date(newdate).getFullYear().toString()
      }`;
  }

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

  function routeTo(jumpTo) {
    location.href = jumpTo;
  }

  function getBlockSubOccupancy(index) {
    let subOccupancyString = "";
    subOccupancy[`Block_${index + 1}`] && subOccupancy[`Block_${index + 1}`].map((ob) => {
      subOccupancyString += `${t(ob.i18nKey)}, `;
    })
    return subOccupancyString;
  }

  useEffect(() => {
    const workflow = { action: selectedAction }
    switch (selectedAction) {
      case "FORWARD":
        setShowModal(true);
    }
  }, [selectedAction]);

  return (
    <React.Fragment>
      <Timeline currentStep={4} />
      <Header>{t("BPA_STEPPER_SUMMARY_HEADER")}</Header>
      <Card>
        <CardHeader>{t(`BPA_BASIC_DETAILS_TITLE`)}</CardHeader>
        <StatusTable>
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APP_DATE_LABEL`)} text={getdate(data?.applicationDate)} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL`)} text={t(`WF_BPA_${data?.applicationType}`)} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL`)} text={t(data?.serviceType)} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_OCCUPANCY_LABEL`)} text={data?.occupancyType} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_RISK_TYPE_LABEL`)} text={t(`WF_BPA_${data?.riskType}`)} />
          <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL`)} text={data?.applicantName} />
        </StatusTable>
      </Card>
      <Card>
        <CardHeader>{t("BPA_PLOT_DETAILS_TITLE")}</CardHeader>
        <StatusTable>
          <Row className="border-none" textStyle={{ marginLeft: "9px" }} label={t(`BPA_BOUNDARY_PLOT_AREA_LABEL`)} text={datafromAPI?.planDetail?.planInformation?.plotArea || t("CS_NA")} />
          <Row className="border-none" label={t(`BPA_BOUNDARY_PLOT_NO_LABEL`)} text={datafromAPI?.planDetail?.planInformation?.plotNo || t("CS_NA")} />
          <Row className="border-none" label={t(`BPA_BOUNDARY_KHATA_NO_LABEL`)} text={datafromAPI?.planDetail?.planInformation?.khataNo || t("CS_NA")} />
          <Row className="border-none" label={t(`Holding Number`)} text={data?.holdingNumber || t("CS_NA")} />
          <Row className="border-none" label={t(`Land Registration details`)} text={data?.registrationDetails || t("CS_NA")} />
        </StatusTable>
      </Card>
      <Card>
        <CardHeader>{t("BPA_STEPPER_SCRUTINY_DETAILS_HEADER")}</CardHeader>
        <CardSubHeader>{t(data?.uiFlow?.flow === "OCBPA" ? "BPA_OC_EDCR_NO_LABEL" : "BPA_EDCR_DETAILS")}:</CardSubHeader>
        <StatusTable style={{ border: "none" }}>
          <Row className="border-none" label={t("BPA_EDCR_NO_LABEL")} text={data?.scrutinyNumber?.edcrNumber}></Row>
          <CardSubHeader>{t("BPA_UPLOADED_PLAN_DIAGRAM")}:</CardSubHeader>
          <LinkButton
            label={<PDFSvg style={{ background: "#f6f6f6", padding: "8px" }} width="80px" height="75px" />}
            onClick={() => routeTo(datafromAPI?.updatedDxfFile)}
          />
          <p style={{ marginTop: "8px", textAlign: "Left" }}>{t(`Uploaded Plan.DXF`)}</p>
          <CardSubHeader>{t("BPA_SCRUNTINY_REPORT_OUTPUT")}:</CardSubHeader>
          <LinkButton
            label={<PDFSvg style={{ background: "#f6f6f6", padding: "8px" }} width="80px" height="75px" />}
            onClick={() => routeTo(datafromAPI?.planReport)}
          />
          <p style={{ marginTop: "8px", textAlign: "Left" }}>{t(`Scrutiny Report.PDF`)}</p>
        </StatusTable>
        <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
        <CardSubHeader>{t("BPA_BUILDING_EXTRACT_HEADER")}</CardSubHeader>
        <StatusTable>
          <Row className="border-none" label={t("BPA_BUILTUP_AREA_HEADER")} text={datafromAPI?.planDetail?.blocks?.[0]?.building?.totalBuitUpArea}></Row>
          <Row className="border-none" label={t("BPA_SCRUTINY_DETAILS_NUMBER_OF_FLOORS_LABEL")} text={datafromAPI?.planDetail?.blocks?.[0]?.building?.totalFloors}></Row>
          <Row className="border-none" label={t("BPA_HEIGHT_FROM_GROUND_LEVEL")} text={`${datafromAPI?.planDetail?.blocks?.[0]?.building?.declaredBuildingHeight} mtrs`}></Row>
        </StatusTable>
        <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
        <CardSubHeader>{t("BPA_OCC_SUBOCC_HEADER")}:</CardSubHeader>
        {datafromAPI?.planDetail?.blocks.map((block, index) => (
          <div key={index}>
            <CardSubHeader>{t("BPA_BLOCK_SUBHEADER")} {index + 1}</CardSubHeader>
            <StatusTable >
              <Row className="border-none" label={t("BPA_SUB_OCCUPANCY_LABEL")} text={getBlockSubOccupancy(index) === "" ? t("CS_NA") : getBlockSubOccupancy(index)}></Row>
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
        <CardSubHeader>{t("BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL")}:</CardSubHeader>
        <StatusTable style={{ border: "none" }}>
          <Row className="border-none" label={t("BPA_APPLICATION_DEMOLITION_AREA_LABEL")} text={datafromAPI?.planDetail?.planInformation?.demolitionArea ? `${datafromAPI?.planDetail?.planInformation?.demolitionArea} sq.mtrs` : t("CS_NA")}></Row>
        </StatusTable>
      </Card>
      {data?.uiFlow?.flow === "OCBPA" ? <div>
        <Card>
          <CardHeader>{t("BPA_NEW_TRADE_DETAILS_HEADER_DETAILS")}</CardHeader>
          <StatusTable>
            <Row className="border-none" textStyle={{ marginLeft: "9px" }} label={t(`BPA_DETAILS_PIN_LABEL`)} text={address?.pincode || t("CS_NA")} />
            <Row className="border-none" label={t(`BPA_CITY_LABEL`)} text={address?.city?.name || t("CS_NA")} />
            <Row className="border-none" label={t(`BPA_LOC_MOHALLA_LABEL`)} text={address?.locality?.name || t("CS_NA")} />
            <Row className="border-none" label={t(`BPA_DETAILS_SRT_NAME_LABEL`)} text={address?.street || t("CS_NA")} />
            <Row className="border-none" label={t(`ES_NEW_APPLICATION_LOCATION_LANDMARK`)} text={address?.landmark || t("CS_NA")} />
          </StatusTable>
        </Card>
        <Card>
          <CardHeader>{t("BPA_APPLICANT_DETAILS_HEADER")}</CardHeader>
          {owners?.owners && owners?.owners.map((ob, index) => (
            <div key={index}>
              {owners.owners.length > 1 && <CardSubHeader>{t("COMMON_OWNER")} {index + 1}</CardSubHeader>}
              <StatusTable>
                <Row className="border-none" textStyle={index == 0 && owners.owners.length == 1 ? { marginLeft: "9px" } : {}} label={t(`CORE_COMMON_NAME`)} text={ob?.name} />
                <Row className="border-none" label={t(`BPA_APPLICANT_GENDER_LABEL`)} text={t(ob?.gender?.i18nKey)} />
                <Row className="border-none" label={t(`CORE_COMMON_MOBILE_NUMBER`)} text={ob?.mobileNumber} />
              </StatusTable>
            </div>))}
        </Card>
      </div> : null}
      <Card>
        <CardHeader>{t("BPA_DOCUMENT_DETAILS_LABEL")}</CardHeader>
        <LinkButton
          label={<EditIcon style={{ marginTop: "-10px", float: "right", position: "relative", bottom: "32px" }} />}
          style={{ width: "100px", display: "inline" }}
          onClick={() => routeTo(`${routeLink}/document-details`)}
        />
        {documents?.documents.map((doc, index) => (
          <div key={index}>
            <CardSectionHeader>{t(doc?.documentType)}</CardSectionHeader>
            <StatusTable>
              <OBPSDocument value={value} Code={doc?.documentType} index={index} />
              <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
            </StatusTable>
          </div>
        ))}
      </Card>
      <Card>
        <CardHeader>{t("BPA_NOC_DETAILS_SUMMARY")}</CardHeader>
        {nocDocuments && nocDocuments?.NocDetails.map((noc, index) => (
          <div key={index}>
            <CardSectionHeader>{t(`BPA_${noc?.nocType}_HEADER`)}:</CardSectionHeader>
            <StatusTable>
              <Row className="border-none" label={t(`BPA_${noc?.nocType}_LABEL`)} textStyle={{ marginLeft: "10px" }} text={noc?.applicationNo} />
              <OBPSDocument value={value} Code={noc?.nocType?.split("_")[0]} index={index} isNOC={true} />
            </StatusTable>
          </div>
        ))}
        <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
        <StatusTable>
          <Row className="border-none" label={t(`BPA_TOTAL_AMOUNT_PAID_LABEL`)} text={`₹ ${reciept_data?.Payments?.[0]?.totalAmountPaid || "0"}`} />
        </StatusTable>
        <SubmitBar label={t("BPA_COMMON_BUTTON_SUBMIT")} onSubmit={onActionSelect} />
      </Card>
      {showModal ? (
        <ActionModal
          t={t}
          action={selectedAction}
          tenantId={tenantId}
          id={value?.applicationNo}
          closeModal={closeModal}
          submitAction={submitAction}
          actionData={workflowDetails?.data?.timeline}
        />
      ) : null}
      {showToast && (
        <Toast
          error={showToast.key === "error" ? true : false}
          label={t(showToast.key === "success" ? `ES_OBPS_${showToast.action}_UPDATE_SUCCESS` : showToast.action)}
          onClose={closeToast}
        />
      )}
    </React.Fragment>
  );
};

export default CheckPage;
