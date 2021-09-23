import { CardHeader, Header, Card, StatusTable, Row, Loader, PDFSvg, SubmitBar, LinkButton } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BPAApplicationTimeline from "./BPAApplicationTimeline";
import DocumentDetails from "../../../components/DocumentDetails";

const BpaApplicationDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const [appDetails, setAppDetails] = useState({});
  const { data, isLoading } = Digit.Hooks.obps.useBPADetailsPage(tenantId, { applicationNo: id });
  const workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: tenantId,
    id: id,
    moduleCode: "BPA",
  });

  const downloadDiagram = (val) => {
    location.href = val;
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
              {detail?.additionalDetails?.documents?.[0]?.values && (
                <Fragment>
                  <Row className="border-none" label={t(detail?.additionalDetails?.documents?.[0].title)} />
                  <DocumentDetails documents={detail?.additionalDetails?.documents?.[0]?.values} />
                </Fragment>
              )}
              {detail?.additionalDetails?.scruntinyDetails &&
                // <DocumentDetails documents={detail?.additionalDetails?.scruntinyDetails} />
                detail?.additionalDetails?.scruntinyDetails.map((scrutiny) => (
                  <Fragment>
                    <Row className="border-none" label={t(scrutiny?.title)} />
                    <LinkButton onClick={() => downloadDiagram(scrutiny?.value)} label={<PDFSvg />}>
                    </LinkButton>
                  </Fragment>
                ))
              }
            </StatusTable>
            {index === arr.length - 1 && (
              <Fragment>
                <BPAApplicationTimeline application={data?.applicationData} id={id} />
                <SubmitBar label={t("COMMON_MAKE_PAYMENT")} />
              </Fragment>
            )}
          </Card>
        );
      })}
    </Fragment>
  )
};

export default BpaApplicationDetail;