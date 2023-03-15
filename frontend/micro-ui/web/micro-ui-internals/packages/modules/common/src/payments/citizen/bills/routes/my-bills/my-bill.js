import React from "react";
import { useTranslation } from "react-i18next";
import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link, useHistory } from "react-router-dom";

// import { getKeyNotesConfig } from "./keynotesConfig";

const MyBill = ({ bill, currentPath, businessService, getKeyNotesConfig }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onSubmit = () => {
    history.push(`${currentPath}/${bill.consumerCode}`, { tenantId:bill?.tenantId });
  };

  return (
    <React.Fragment>
      {typeof getKeyNotesConfig === "function" && (
        <Card>
          {getKeyNotesConfig(businessService, t)["my-bill"].map((obj, index) => {
            const value = obj.keyPath.reduce((acc, key) => {
              if (typeof key === "function") acc = key(acc);
              else acc = acc[key];
              return acc;
            }, bill);
            return <KeyNote key={index + obj.keyValue} keyValue={t(obj.keyValue)} note={value || obj.fallback} noteStyle={obj.noteStyle || {}} />;
          })}
          <SubmitBar disabled={!bill.totalAmount?.toFixed(2)} onSubmit={onSubmit} label={t("CS_MY_APPLICATION_VIEW_DETAILS")} />
        </Card>
      )}
    </React.Fragment>
  );
};

export default MyBill;
