import { CardLabel, DatePicker, LabelFieldPair, TextInput } from "@egovernments/digit-ui-react-components";
import React from "react";

const WSActivationDetails = ({ t, config, userType, formData, onSelect }) => {
  const [activationDetails, setActivationDetails] = React.useState({
    meterId: "",
    meterInstallationDate: "",
    meterInitialReading: "",
    connectionExecutionDate: "",
  });

  React.useEffect(() => {
    if (formData) {
    }
  });

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller" style={{fontWeight: "700"}}>{`${t(`WS_METER_ID`)}`}</CardLabel>
        <div className="field">
          <TextInput
            t={t}
            type="text"
            optionKey="i18nKey"
            name="meterId"
            value={activationDetails.meterId}
            onChange={(ev) => {
              setActivationDetails({ ...activationDetails, meterId: ev.target.value });
            }}
          ></TextInput>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller" style={{fontWeight: "700"}}>{`${t(`WS_METER_INSTALLATION_DATE`)}`}</CardLabel>
        <div className="field">
          <DatePicker
            date={activationDetails.meterInstallationDate}
            onChange={(date) => {
              setActivationDetails({ ...activationDetails, meterInstallationDate: date });
            }}
          ></DatePicker>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller" style={{fontWeight: "700"}}>{`${t(`WS_INIT_METER_READING`)}`}</CardLabel>
        <div className="field">
          <TextInput
            value={activationDetails.meterInitialReading}
            onChange={(ev) => {
              setActivationDetails({ ...activationDetails, meterInitialReading: ev.target.value });
            }}
          ></TextInput>
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller" style={{fontWeight: "700"}}>{`${t(`WS_CONN_EXEC_DATE`)}`}</CardLabel>
        <div className="field">
          <DatePicker
            date={activationDetails.connectionExecutionDate}
            onChange={(date) => {
              setActivationDetails({ ...activationDetails, connectionExecutionDate: date });
            }}
          ></DatePicker>
        </div>
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default WSActivationDetails;
