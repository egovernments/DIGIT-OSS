import React from "react";
import { FormStep, Banner } from "@egovernments/digit-ui-react-components";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import SubmitComplaint from "../../../../ServiceWrapper/CreateComplaint";
import { QueryCache } from "react-query";

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

const Response = ({ t, config, onSelect, params }) => {
  //object init of class
  let __submitComplaint = new SubmitComplaint("PGR", "pb.amritsar");

  const queryCache = new QueryCache();

  const queryResponse = queryCache.find("createQueryResponse");

  const complaints = useSelector((state) => state["pgr"].complaints);
  // submit call
  __submitComplaint.submit(params);
  return (
    <React.Fragment>
      <h2 onClick={() => console.log("create query response", queryResponse)}>TEST CACHE</h2>
      <FormStep config={config} onSelect={onSelect} t={t}>
        {complaints.response ? <BannerPicker complaints={complaints} /> : null}
      </FormStep>
    </React.Fragment>
  );
};

export default Response;
