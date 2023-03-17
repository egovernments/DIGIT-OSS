import React, { useEffect, useState } from "react";
import { FormStep, TextInput, LabelFieldPair, CardLabel, Header } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const FstpAddVehicle = ({ onSelect }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [vehicleNumber, setVehicleNumber] = useState("");

  let inputs = {
    texts: {
      // "header": t("ES_FSM_ADD_VEHICLE_LOG"),
      cardText: "",
      submitBarLabel: "CS_COMMON_NEXT",
    },
    inputs: [
      {
        label: t("ES_FSM_VEHICLE_NUMBER"),
        type: "text",
        name: "vehicleNumber",
        validation: {
          // "pattern": "[a-zA-Z0-9 ]{1,20}",
          pattern: `[A-Z]{2}\\s{1}[0-9]{2}\\s{0,1}[A-Z]{1,2}\\s{1}[0-9]{4}`,
          title: t("ES_FSM_VEHICLE_FORMAT_TIP"),
        },
      },
    ],
    key: "vehicleNumber",
  };

  const onSubmit = (data) => {
    history.push(`/digit-ui/employee/fsm/fstp-fsm-request/${data.vehicleNumber.trim()}`);
  };

  function onChange(e) {
    e.target.value.trim().length != 0 ? setVehicleNumber(e.target.value) : null;
  }
  const isMobile = window.Digit.Utils.browser.isMobile();

  return (
    <React.Fragment>
      <div style={!isMobile ? { marginLeft: "20px" } : {}}>
        <Header>{t("ES_FSM_ADD_VEHICLE_LOG")}</Header>
      </div>
      <FormStep
        config={inputs}
        onChange={onChange}
        onSelect={onSubmit}
        t={t}
        isDisabled={!vehicleNumber}
        cardStyle={{ margin: "10px" }}
        textInputStyle={{ maxWidth: "540px" }}
      ></FormStep>
    </React.Fragment>
  );
};

export default FstpAddVehicle;
