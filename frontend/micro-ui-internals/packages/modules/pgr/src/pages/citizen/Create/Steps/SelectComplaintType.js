import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import useComplaintTypes from "../../../../hooks/useComplaintTypes";

const SelectComplaintType = ({ t, config, onSelect }) => {
  const goNext = () => {
    onSelect(complaintType);
  };
  const __initComplaintType__ = Digit.SessionStorage.get("complaintType");
  const [complaintType, setComplaintType] = useState(__initComplaintType__ ? __initComplaintType__ : {});
  const textParams = config.texts;
  const SessionStorage = Digit.SessionStorage;
  const menu = useComplaintTypes({ stateCode: "pb.amritsar" });

  function selectedValue(value) {
    setComplaintType(value);
    SessionStorage.set("complaintType", value);
  }
  return (
    <TypeSelectCard
      {...textParams}
      {...{ menu: menu }}
      {...{ optionsKey: "name" }}
      {...{ selected: selectedValue }}
      {...{ selectedOption: complaintType }}
      {...{ onSave: goNext }}
      {...{ t }}
    />
  );
};

export default SelectComplaintType;
