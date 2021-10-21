import { CardHeader, Header, Toast, Card, StatusTable, Row, Loader, Menu, PDFSvg, SubmitBar, LinkButton, ActionBar, CheckBox } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import BPAApplicationTimeline from "./BPAApplicationTimeline";
import DocumentDetails from "../../../components/DocumentDetails";
import ActionModal from "./Modal";
import OBPSDocument from "../../../pageComponents/OBPSDocuments";
import SubOccupancyTable from "../../../../../templates/ApplicationDetails/components/SubOccupancyTable";


const BpaApplicationDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const queryClient = useQueryClient();
  const [showToast, setShowToast] = useState(null);
  const [isTocAccepted, setIsTocAccepted] = useState(false); 
  const [displayMenu, setDisplayMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [appDetails, setAppDetails] = useState({});
  const history = useHistory();
  sessionStorage.setItem("bpaApplicationDetails", false);
  let isFromSendBack = false;
  const { data, isLoading } = Digit.Hooks.obps.useBPADetailsPage(tenantId, { applicationNo: id });
  const mutation = Digit.Hooks.obps.useObpsAPI(data?.applicationData?.tenantId, false);
  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: data?.applicationData?.tenantId,
    id: id,
    moduleCode: "OBPS",
    config: {
      enabled: !!data
    }
  });

  useEffect(() => {
    const workflow = { action: selectedAction }
    switch (selectedAction) {
      case "APPROVE":
      case "SEND_TO_ARCHITECT":
        setShowModal(true);
    }
  }, [selectedAction]);

  const closeToast = () => {
    setShowToast(null);
  };

  const downloadDiagram = (val) => {
    location.href = val;
  }

  const handleChange = () => {

  }

  const closeModal = () => {
    setSelectedAction(null);
    setShowModal(false);
  };

  function onActionSelect(action) {
    if(action === "FORWARD") {
      history.replace(`/digit-ui/citizen/obps/sendbacktocitizen/ocbpa/${data?.applicationData?.tenantId}/${data?.applicationData?.applicationNo}/check`, { data: data?.applicationData, edcrDetails: data?.edcrDetails });
    }
    setSelectedAction(action);
    setDisplayMenu(false);
  }

  const submitAction = (workflow) => {
    mutation.mutate(
      { BPA: { ...data?.applicationData, workflow } },
      {
        onError: (error, variables) => {
          // console.log("find error here",error)
          setShowToast({ key: "error", action: error });
          setTimeout(closeToast, 5000);
        },
        onSuccess: (data, variables) => {
          setShowToast({ key: "success", action: selectedAction });
          setTimeout(closeToast, 5000);
          queryClient.invalidateQueries("BPA_DETAILS_PAGE");
          queryClient.invalidateQueries("workFlowDetails");
        },
      }
    );
  }

  if (workflowDetails?.data?.processInstances?.[0]?.action === "SEND_BACK_TO_CITIZEN") {
      if(isTocAccepted) setIsTocAccepted(true);
      isFromSendBack = true;
      const userInfo = Digit.UserService.getUser();
      const rolearray = userInfo?.info?.roles;
      if(rolearray?.length !== 1) {
        workflowDetails = {
          ...workflowDetails,
          data: {
            ...workflowDetails?.data,
            actionState: {
              nextActions: [],
            },
          },
          data: {
            ...workflowDetails?.data,
            nextActions: []
          }
        };
      }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <Fragment>
      <Header>{t("CS_TITLE_APPLICATION_DETAILS")}</Header>
      {data?.applicationDetails?.map((detail, index, arr) => {
        return (
          <Card key={index} style={detail?.title === ""?{marginTop:"-8px"}:{}}>
            <CardHeader>{t(detail?.title)}</CardHeader>
            <StatusTable>
              {!(detail?.additionalDetails?.noc) && detail?.values?.map((value) => (
                <Row className="border-none" label={t(value?.title)} text={t(value?.value) || t("CS_NA")} />
              ))}
              {detail?.additionalDetails?.owners && detail?.additionalDetails?.owners.map((owner,index) => (
                <div key={index}>
                <Row className="border-none" label={`${t("Owner")} - ${index+1}`} />
                {owner?.values.map((value) =>(
                  <Row className="border-none" label={t(value?.title)} text={t(value?.value) || t("CS_NA")} />
                ))}
                </div>
              ))}
              {!(detail?.additionalDetails?.FIdocuments) && !(detail?.additionalDetails?.subOccupancyTableDetails) && detail?.additionalDetails?.values && detail?.additionalDetails?.values?.map((value) => (
                <Row className="border-none" label={t(value?.title)} text={t(value?.value) || t("CS_NA")} />
              ))}
              {detail?.additionalDetails?.FIdocuments && detail?.additionalDetails?.values && detail?.additionalDetails?.values?.map((doc,index) => (
              <div key={index}>
                {doc.isNotDuplicate && <div> 
                <StatusTable>
                <Row label={t(doc?.documentType)}></Row>
                <OBPSDocument value={detail?.additionalDetails?.values} Code={doc?.documentType} index={index}/> 
                <hr style={{color:"#cccccc",backgroundColor:"#cccccc",height:"2px",marginTop:"20px",marginBottom:"20px"}}/>
                </StatusTable>
                </div>}
             </div>
          )) }
              {detail?.additionalDetails?.subOccupancyTableDetails && <SubOccupancyTable edcrDetails={detail?.additionalDetails} />}
        {detail?.additionalDetails?.noc && detail?.additionalDetails?.noc.map((nocob, ind) => (
        <div key={ind}>
        <StatusTable>
        <Row className="border-none" label={t(`BPA_${nocob?.values?.[0]?.documentType.replaceAll(".","_")}_HEADER`)}></Row>
        <Row className="border-none" label={t(`${detail?.values?.[0]?.title}`)} textStyle={{marginLeft:"10px"}} text={detail?.values?.[0]?.value} />
        <Row className="border-none" label={t(`${nocob?.title}`)}></Row>
        </StatusTable>
        {nocob?.values && nocob?.values.map((noc,index)=> (
        <div key={index}>
        <StatusTable>
        <OBPSDocument value={nocob?.values} Code={noc?.documentType?.split("_")[0]} index={index} isNOC={true}/> 
        </StatusTable>
        </div>
        ))
        }
        </div>
      ))}
              {detail?.additionalDetails?.obpsDocuments?.[0]?.values && (
                <Fragment>
                  <Row className="border-none" label={t(detail?.additionalDetails?.obpsDocuments?.[0].title)} />
                  <DocumentDetails documents={detail?.additionalDetails?.obpsDocuments?.[0]?.values} />
                </Fragment>
              )}
              {detail?.additionalDetails?.scruntinyDetails &&
                // <DocumentDetails documents={detail?.additionalDetails?.scruntinyDetails} />
                detail?.additionalDetails?.scruntinyDetails.map((scrutiny) => (
                  <Fragment>
                    <Row className="border-none" label={t(scrutiny?.title)} />
                    <LinkButton onClick={() => downloadDiagram(scrutiny?.value)} label={<PDFSvg />}></LinkButton>
                  </Fragment>
                ))}
            </StatusTable>
            {index === arr.length - 1 && (
              <Fragment>
                <BPAApplicationTimeline application={data?.applicationData} id={id} />
                {!workflowDetails?.isLoading && workflowDetails?.data?.nextActions?.length > 0 && !isFromSendBack && (
                  <CheckBox
                    styles={{ margin: "20px 0 40px" }}
                    checked={isTocAccepted}
                    label={t(`BPA_TERMS_AND_CONDITIONS`)}
                    onChange={() => setIsTocAccepted(!isTocAccepted)}
                  />
                )}
                {!workflowDetails?.isLoading && workflowDetails?.data?.nextActions?.length > 0 && (
                  <div style={{ position: "relative" }}>
                    {displayMenu && workflowDetails?.data?.nextActions ? (
                      <Menu
                        style={{ left: "0px", bottom: "37px" }}
                        localeKeyPrefix={"CS_BPA"}
                        options={workflowDetails?.data?.nextActions.map((action) => action.action)}
                        t={t}
                        onSelect={onActionSelect}
                      />
                    ) : null}
                    <SubmitBar disabled={isFromSendBack ? !isFromSendBack : !isTocAccepted} label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
                  </div>
                )}
              </Fragment>
            )}
          </Card>
        );
      })}
      {showModal ? (
        <ActionModal
          t={t}
          action={selectedAction}
          tenantId={tenantId}
          // state={state}
          id={id}
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
    </Fragment>
  );
};

export default BpaApplicationDetail;