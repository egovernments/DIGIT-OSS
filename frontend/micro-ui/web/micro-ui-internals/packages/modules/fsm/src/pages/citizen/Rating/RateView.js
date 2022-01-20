import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Card, CardLabel, CardHeader, KeyNote, Loader, Rating } from "@egovernments/digit-ui-react-components";

const RateView = (props) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  let { id: applicationNos } = useParams();
  const { isError, isLoading, isSuccess, error, data: application } = Digit.Hooks.fsm.useSearch(tenantId, { applicationNos });
  const { isLoading: isWorkflowLoading, data } = Digit.Hooks.useWorkflowDetails({
    tenantId: application?.tenantId,
    id: applicationNos,
    moduleCode: "FSM",
    config: { enabled: isSuccess && !!application },
  });

  if (isLoading || isWorkflowLoading) {
    return <Loader />;
  }

  return (
    <Card>
      <CardHeader>{t("CS_RATE_HELP_US")}</CardHeader>
      <KeyNote keyValue={t("CS_FSM_YOU_RATED")}>
        <Rating currentRating={data?.timeline[0]?.rating} />
      </KeyNote>
      {application.additionalDetails.CheckList.map((checklist) => (
        <KeyNote
          keyValue={t(checklist.code)}
          note={checklist.value
            .split(",")
            .map((val) => t(val))
            .join(", ")}
        />
      ))}
      <KeyNote keyValue={t("CS_COMMON_COMMENTS")} note={data?.timeline[0]?.wfComment?.[0] || "N/A"} />
    </Card>
  );
};

export default RateView;
