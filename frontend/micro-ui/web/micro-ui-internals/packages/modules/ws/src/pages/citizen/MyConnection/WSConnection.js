import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getAddress } from "../../../utils/index";
import _ from "lodash";

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
        uuid:application?.property?.owners?.[0]?.uuid, 
        fieldName: ["doorNo" , "street" , "landmark"], 
        model: "Property",showValue: true,
        loadData: {
          serviceName: "/property-services/property/_search",
          requestBody: {},
          requestParam: { tenantId : application?.tenantId, propertyIds : application?.property?.propertyId },
          jsonPath: "Properties[0].address.street",
          isArray: false,
          d: (res) => {
            let resultString = (_.get(res,"Properties[0].address.doorNo") ?  `${_.get(res,"Properties[0].address.doorNo")}, ` : "") + (_.get(res,"Properties[0].address.street")? `${_.get(res,"Properties[0].address.street")}, ` : "") + (_.get(res,"Properties[0].address.landmark") ? `${_.get(res,"Properties[0].address.landmark")}`:"")
            return resultString;
          }
        },
       }}  />
      <KeyNote keyValue={t("WS_MYCONNECTIONS_STATUS")} note={t(application?.status)} />
      <Link to={{ pathname: `/digit-ui/citizen/ws/connection/details/${encodeApplicationNo}`, state: { ...application } }}>
        <SubmitBar label={t("WS_VIEW_DETAILS_LABEL")} />
      </Link>
    </Card>
  );
};

export default WSConnection;
