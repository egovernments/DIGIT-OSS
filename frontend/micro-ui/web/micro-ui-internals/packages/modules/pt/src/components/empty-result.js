import { SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const EmptyResultInbox = (props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const addNewProprty = () => {
    history.push("/digit-ui/employee/pt/new-application");
  };

  return (
    <React.Fragment>
      {props.data ? (
        <React.Fragment>
          <div style={{ textAlign: "center", marginTop: "50px", marginBottom: "24px" }}>{t("PT_NO_MATCHING_PROPERTY_FOUND")}</div>
          <div style={{ textAlign: "center" }}>
            <SubmitBar onSubmit={addNewProprty} label={t("PT_ADD_NEW_PROPERTY_BUTTON")} />
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default EmptyResultInbox;
