import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TypeSelectCard } from "@egovernments/digit-ui-react-components";
import useComplaintTypes from "../../../../hooks/useComplaintTypes";

const SelectComplaintType = ({ config, onSelect }) => {
  const goNext = () => {
    onSelect("test");
  };
  const [complaintType, setComplaintType] = useState({});
  const textParams = config.texts;
  const inputParams = config.inputs;
  const SessionStorage = Digit.SessionStorage;
  const menu = useComplaintTypes({ stateCode: "pb.amritsar" });

  function selectedValue(value) {
    setComplaintType(value);
    SessionStorage.set("complaintType", value);
  }
  return (
    <TypeSelectCard
      {...textParams}
      {...inputParams}
      {...{ menu: menu }}
      {...{ optionsKey: "name" }}
      {...{ selected: selectedValue }}
      {...{ selectedOption: complaintType }}
      {...{ onSave: goNext }}
    />
  );
};

export default SelectComplaintType;
