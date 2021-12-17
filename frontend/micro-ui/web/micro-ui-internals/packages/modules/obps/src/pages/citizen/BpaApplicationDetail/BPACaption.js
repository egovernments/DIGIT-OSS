import React from "react";
import { useTranslation } from "react-i18next";
import { TelePhone } from "@egovernments/digit-ui-react-components";
import BPAReason from "./BPAReason";

const BPACaption = ({ data }) => {
  const { t } = useTranslation();
  return (
    <div>
      {data.date && <p>{data.date}</p>}
      <p>{data.name}</p>
      {data.mobileNumber && <TelePhone mobile={data.mobileNumber} />}
      {data.source && <p>{t("ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_" + data.source.toUpperCase())}</p>}
      {/* //TODO: please find a better way to display in checkpoints */}
      {data.comment && <BPAReason otherComment={data?.otherComment} headComment={data?.comment}></BPAReason>}
    </div>
  );
}

export default BPACaption;