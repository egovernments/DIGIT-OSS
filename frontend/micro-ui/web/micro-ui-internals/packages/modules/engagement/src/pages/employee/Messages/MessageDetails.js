import React, { Fragment, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header, Card, CardSectionHeader, PDFSvg, Loader, StatusTable, Menu, ActionBar, SubmitBar, Modal, CardText } from "@egovernments/digit-ui-react-components";
import ApplicationDetailsTemplate from "../../../../../templates/ApplicationDetails";
import { format } from "date-fns";

const Heading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
};

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const DocumentDetails = ({ t, data, documents, paymentDetails }) => {
  return (
    <Fragment>
      {data?.map((document, index) => (
        <Fragment>
          <div style={{maxWidth: "940px", padding: "8px", borderRadius: "4px", border: "1px solid #D6D5D4", background: "#FAFAFA", marginBottom: "32px"}}>
            <div style={{fontSize: "16px", fontWeight: 700}}>{t(`BPA_${document?.documentType}`)}</div>
            <a target="_" href={documents[document.fileStoreId]?.split(",")[0]}>
              <PDFSvg />
            </a>
            <span> {decodeURIComponent( documents[document.fileStoreId].split(",")[0].split("?")[0].split("/").pop().slice(13))} </span>
          </div>
        </Fragment>
      ))}
      {/* <div>
        <CardSectionHeader>{`${t("BPA_FEE_DETAILS_LABEL")}`}</CardSectionHeader>
        <StatusTable>
          <Row className="border-none"  key={`${t(`BPAREG_FEES`)}:`} label={`${t(`BPAREG_FEES`)}:`} text={paymentDetails?.Payments?.[0]?.totalAmountPaid} />
          <Row className="border-none"  key={`${t(`BPA_STATUS_LABEL`)}:`} label={`${t(`PAID`)}:`} text={paymentDetails?.Payments?.[0]?.totalAmountPaid ? (t("WF_BPA_PAID")) : "NA"} textStyle={paymentDetails?.Payments?.[0]?.totalAmountPaid ? {color: "green"}: {}} />
        </StatusTable>
      </div> */}
    </Fragment>
  );
}

const MessageDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const tenantId = Digit.ULBService.getCurrentTenantId();


  const { isLoading, data } = Digit.Hooks.events.useEventDetails(tenantId, { ids: id }, {
    select: (data) => {
      const details = [{
        title: "",
        asSectionHeader: true,
        values: [
          { title: "EVENTS_ULB_LABEL", value: data?.tenantId },
          { title: "EVENTS_NAME_LABEL", value: data?.name },
          { title: "PUBLIC_BRDCST_TITLE_LABEL", value: data?.description },
          { title: "EVENTS_FROM_DATE_LABEL", value: format(new Date(data?.eventDetails?.fromDate), 'dd/MM/yyyy') },
          { title: "EVENTS_TO_DATE_LABEL", value: format(new Date(data?.eventDetails?.toDate), 'dd/MM/yyyy') },
          { title: "CS_COMMON_DOCUMENTS", belowComponent: () => <DocumentDetails t={t} data={data?.eventDetails?.documents} documents={data?.uploadedFilesData?.data} /> }
        ]
      }]
      return {
        applicationData: data,
        applicationDetails: details,
        tenantId: tenantId
      }
    }
  });

  function onActionSelect(action) {
    // setSelectedAction(action);
    if (action === "EDIT") {
      history.push(`/digit-ui/employee/engagement/messages/inbox/edit/${id}`)
    }
    if (action === "DELETE") {
      setShowModal(true);
    }
    setDisplayMenu(false);
  }

  const handleDelete = () => {
    const finalData = (({ uploadedFilesData, ...ogData }) => ogData)(data?.applicationData)
    const details = {
      events: [
        {
          ...finalData,
          status: "CANCELLED",
        },
      ],
    };
    history.push("/digit-ui/employee/engagement/messages/response?delete=true", details);
  };

  return (
    <Fragment>
      <div>
        <Header>{t("ES_TITLE_APPLICATION_DETAILS")}</Header>
      </div>
      <ApplicationDetailsTemplate
        applicationDetails={data}
        isLoading={isLoading}
        isDataLoading={isLoading}
        // workflowDetails={workflowDetails}
        // businessService={
        //   workflowDetails?.data?.applicationBusinessService
        //     ? workflowDetails?.data?.applicationBusinessService
        //     : data?.applicationData?.businessService
        // }
      />
      <ActionBar>
        {displayMenu ? (
          <Menu
            localeKeyPrefix={"ES_PUBLIC_BRDCST"}
            options={['EDIT', 'DELETE']}
            t={t}
            onSelect={onActionSelect}
          />
        ) : null}
        <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
      </ActionBar>
      {showModal &&
        <Modal
        headerBarMain={<Heading label={t('PUBLIC_BRDCST_DELETE_POPUP_HEADER')} />}
        headerBarEnd={<CloseBtn onClick={() => setShowModal(false)} />}
        actionCancelLabel={t("CS_COMMON_CANCEL")}
        actionCancelOnSubmit={() => setShowModal(false)}
        actionSaveLabel={t('PUBLIC_BRDCST_DELETE')}
        actionSaveOnSubmit={handleDelete}
        >
          <Card style={{ boxShadow: "none" }}>
            <CardText>{t(`PUBLIC_BRDCST_DELETE_TEXT`)}</CardText>
          </Card>
        </Modal>
      }
    </Fragment>
  );
};

export default MessageDetails;