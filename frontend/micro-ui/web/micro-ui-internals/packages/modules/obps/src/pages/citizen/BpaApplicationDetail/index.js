import { CardHeader, Header, Toast, Card, StatusTable, Row, Loader, Menu, PDFSvg, SubmitBar, LinkButton, ActionBar, CheckBox } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import BPAApplicationTimeline from "./BPAApplicationTimeline";
import DocumentDetails from "../../../components/DocumentDetails";
import ActionModal from "./Modal";


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
  const { data, isLoading } = Digit.Hooks.obps.useBPADetailsPage(tenantId, { applicationNo: id });
  const mutation = Digit.Hooks.obps.useObpsAPI(data?.applicationData?.tenantId, false);
  const workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: data?.applicationData?.tenantId,
    id: id,
    moduleCode: "BPA",
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
      history.replace(`/digit-ui/citizen/obps/sendbacktocitizen/bpa/${data?.applicationData?.tenantId}/${data?.applicationData?.applicationNo}/check`, { data: data?.applicationData });
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

  if (isLoading) {
    return <Loader />
  }

  return (
    <Fragment>
      <Header>{t("ES_TITLE_APPLICATION_DETAILS")}</Header>
      {data?.applicationDetails?.map((detail, index, arr) => {
        return (
          <Card key={index}>
            <CardHeader>{t(detail?.title)}</CardHeader>
            <StatusTable>
              {detail?.values?.map((value) => (
                <Row className="border-none" label={t(value?.title)} text={t(value?.value) || t("CS_NA")} />
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
                {!workflowDetails?.isLoading && workflowDetails?.data?.nextActions?.length > 0 && (
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
                    <SubmitBar disabled={!isTocAccepted} label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
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