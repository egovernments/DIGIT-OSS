import React from "react";
import { useForm } from "react-hook-form";
import { InputCard } from "@egovernments/digit-ui-react-components";

const SelectComplaintType = ({ config, onSelect }) => {
  const goNext = () => {
    onSelect("test");
  };
  return (
    <InputCard {...config} onNext={goNext}>
      <h1>test</h1>
    </InputCard>
  );
};

export default SelectComplaintType;
