import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getAddress } from "../../../utils/index";

const WSConnection = ({ application }) => {
  const { t } = useTranslation();
  let encodeApplicationNo = encodeURI(application.applicationNo);
  return (
    <Card>
      <KeyNote keyValue={t("WS_MYCONNECTIONS_CONSUMER_NO")} note={application?.connectionNo} />
      <KeyNote keyValue={t("WS_SERVICE_NAME_LABEL")} note={t(`WS_APPLICATION_TYPE_${application?.applicationType}`)} />
      <KeyNote
        keyValue={t("WS_CONSUMER_NAME")}
        note={
          application?.connectionHolders?.map((owner) => owner.name).join(",") || application?.property?.owners?.map((owner) => owner.name).join(",")
        }
      />
      <KeyNote keyValue={t("WS_MYCONNECTION_ADDRESS")} note={getAddress(application?.property?.address, t)}
      privacy={{
        uuid:application?.property?.propertyId, 
        fieldName: ["doorNo" , "street" , "landmark"], 
        model: "Property"
       }}  />
      <KeyNote keyValue={t("WS_MYCONNECTIONS_STATUS")} note={t(application?.status)} />
      <Link to={{ pathname: `/digit-ui/citizen/ws/connection/details/${encodeApplicationNo}`, state: { ...application } }}>
        <SubmitBar label={t("WS_VIEW_DETAILS_LABEL")} />
      </Link>
    </Card>
  );
};

export default WSConnection;
