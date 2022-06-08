import React from "react";
import { useTranslation } from "react-i18next";
import { CheckBox } from "@egovernments/digit-ui-react-components";

const ServiceCategoryCount = ({ status, searchParams, onAssignmentChange, businessServices,clearCheck,setclearCheck }) => {
  const { t } = useTranslation();
  return (
    <CheckBox
      onChange={(e) => onAssignmentChange(e, status)}
      checked={(() => {
        //IIFE
        if(!clearCheck)
        return searchParams?.applicationStatus.some((e) => e.code === status.code);
        else
        { setclearCheck(false);
          return false;
        }
      })()}
      label={`${t(status.name)}`}
      styles={{ marginBottom: "10px" }}
    />
  );
};

export default ServiceCategoryCount;
