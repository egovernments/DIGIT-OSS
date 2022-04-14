import { CardLabel, Dropdown, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React from "react";

const WSPlumberDetails = ({ t, config, userType, formData }) => {
  const [plumberDetails, setPlumberDetails] = React.useState({
    plumberName: "",
    plumberMobileNo: "",
    plumberLicenseNo: "",
    plumberProvideBy: { code: "", value: "", i18nKey: "" },
  });

  React.useEffect(() => {
    if (formData && formData.PlumberDetails) {
    }
  });

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_PROVIDED_BY")}</CardLabel>
        <div className="field">
          <Dropdown
            t={t}
            key={config?.key}
            selected={plumberDetails.plumberProvideBy}
            select={(value) => {
              setPlumberDetails({ ...plumberDetails, plumberProvideBy: value });
            }}
          ></Dropdown>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_LICENSE_NUMBER")}</CardLabel>
        <div className="field">
          <TextInput
            key={config.key}
            value={plumberDetails.plumberLicenseNo}
            onChange={(ev) => {
              setPlumberDetails({ ...plumberDetails, plumberLicenseNo: ev.target.value });
            }}
          ></TextInput>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_NAME")}</CardLabel>
        <div className="field">
          <TextInput
            key={config.key}
            value={plumberDetails.plumberName}
            onChange={(ev) => {
              setPlumberDetails({ ...plumberDetails, plumberName: ev.target.value });
            }}
          ></TextInput>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_MOB_NUMBER")}</CardLabel>
        <div className="field">
          <TextInput
            key={config.key}
            value={plumberDetails.plumberMobileNo}
            onChange={(ev) => {
              setPlumberDetails({ ...plumberDetails, plumberMobileNo: ev.target.value });
            }}
          ></TextInput>
        </div>
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default WSPlumberDetails;
