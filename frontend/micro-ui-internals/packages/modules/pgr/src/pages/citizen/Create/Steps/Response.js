import React from "react";
import { FormStep, Banner } from "@egovernments/digit-ui-react-components";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const GetActionMessage = ({ action }) => {
  const { t } = useTranslation();
  if (action === "REOPEN") {
    return t(`CS_COMMON_COMPLAINT_REOPENED`);
  } else {
    return t(`CS_COMMON_COMPLAINT_SUBMITTED`);
  }
};

const BannerPicker = ({ complaints }) => {
  const { t } = useTranslation();
  if (complaints && complaints.response && complaints.response.responseInfo) {
    return (
      <Banner
        message={GetActionMessage(complaints.response.ServiceWrappers[0].workflow)}
        complaintNumber={complaints.response.ServiceWrappers[0].service.serviceRequestId}
        successful={true}
      />
    );
  } else {
    return <Banner message={t("CS_COMMON_COMPLAINT_NOT_SUBMITTED")} successful={false} />;
  }
};

const Response = ({ t, config, onSelect }) => {
  const complaints = useSelector((state) => state["pgr"].complaints);
  return (
    <FormStep config={config} onSelect={onSelect} t={t}>
      {complaints.response ? <BannerPicker complaints={complaints} /> : null}
    </FormStep>
  );
};

export default Response;
