import { CardHeader, Header, Card, StatusTable, Row, Loader, PDFSvg } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

  if (isLoading) {
    return <Loader />
  }

  return (
    <Fragment>
      <Header>{t("ES_TITLE_APPLICATION_DETAILS")}</Header>
      {data?.applicationDetails?.map((detail, index) => {
        return (
          <Card>
            <CardHeader>{t(detail?.title)}</CardHeader>
            <StatusTable>
              {detail?.values?.map((value) => (
                <Row className="border-none" label={t(value?.title)} text={t(value?.value) || t("CS_NA")} />
              ))}
              {detail?.additionalDetails?.documents &&
                <Fragment>
                  <Row className="border-none" label={t(detail?.additionalDetails?.documents?.[0].title)} />
                  {detail?.additionalDetails?.documents?.[0]?.values?.map(() => {
                    <a>
                      <PDFSvg />
                    </a>
                  })}
                </Fragment>
              }
            </StatusTable>
          </Card>
        )
      })}
    </Fragment>
  )
};

export default BpaApplicationDetail;