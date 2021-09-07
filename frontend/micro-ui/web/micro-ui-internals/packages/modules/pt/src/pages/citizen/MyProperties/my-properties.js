import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const MyProperty = ({ application }) => {
  const { t } = useTranslation();
  const address = application?.address;
  const owners = application?.owners;
  return (
    <Card>
      <KeyNote keyValue={t("PT_COMMON_TABLE_COL_PT_ID")} note={application.propertyId} />
      <KeyNote
        keyValue={t("PT_COMMON_TABLE_COL_OWNER_NAME")}
        note={owners.map((owners, index) => (
          <div key="index">{index == owners.length - 1 ? owners?.name + "," : owners.name}</div>
        ))}
      />
      <KeyNote
        keyValue={t("PT_COMMON_COL_ADDRESS")}
        note={
          `${t(address?.locality.name)}, ${t(address?.city)},${t(address?.pincode) ? `${address.pincode}` : " "}` || "CS_APPLICATION_TYPE_PT"
        }
      />
      <KeyNote keyValue={t("PT_COMMON_TABLE_COL_STATUS_LABEL")} note={t("PT_COMMON_" + application.status)} />
      <Link to={`/digit-ui/citizen/pt/property/properties/${application.propertyId}`}>
        <SubmitBar label={t("PT_VIEW_DETAILS")} />
      </Link>
    </Card>
  );
};

export default MyProperty;
