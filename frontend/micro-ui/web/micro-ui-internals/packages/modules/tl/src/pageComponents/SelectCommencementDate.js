import React, { useState } from "react";
import { CardLabel, DatePicker, TypeSelectCard } from "@egovernments/digit-ui-react-components";
import { FormStep, RadioOrSelect, RadioButtons } from "@egovernments/digit-ui-react-components";

const SelectCommencementDate = ({ t, config, onSelect, userType, formData }) => {
  const [CommencementDate, setCommencementDate] = useState(formData?.TradeDetails?.CommencementDate);
  const isEdit = window.location.href.includes("/edit-application/")||window.location.href.includes("renew-trade");

  const onSkip = () => onSelect();

  function selectCommencementDate(value) {
    setCommencementDate(value);
  }

  function goNext() {
    onSelect(config.key, { CommencementDate });
  }
  return (
    <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip} isDisabled={!CommencementDate}>
      <CardLabel>{t("TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL")}</CardLabel>
      <DatePicker date={CommencementDate} name="CommencementDate" onChange={selectCommencementDate} disabled={isEdit} />
    </FormStep>
  );
};
export default SelectCommencementDate;
