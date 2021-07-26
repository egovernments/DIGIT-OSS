import React, { useState } from "react";
import { Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import ServiceCategoryCount from "./ServiceCategoryCount";

const ServiceCategory = ({ onAssignmentChange, searchParams, businessServices }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = tenantId.split(".")[0];
  const [moreStatus, showMoreStatus] = useState(false);
  const { data: Menu, isLoading } = Digit.Hooks.mcollect.useMCollectMDMS(stateId, "BillingService", "BusinessService", "[?(@.type=='Adhoc')]");

  const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
      str = str.replace(searcher, replaceWith);
    }
    return str;
  };

  const translateState = (option) => {
    let code = stringReplaceAll(option.code, ".", "_");
    code = stringReplaceAll(code, " ", "_");
    code = code.toUpperCase();
    return t(`BILLINGSERVICE_BUSINESSSERVICE_${code}`);
  };

  let menuFirst = [];
  let meuSecond = [];
  Menu?.map((option, index) => {
    if (index < 5) menuFirst.push(option);
    else meuSecond.push(option);
  });

  if (isLoading) {
    return <Loader />;
  }
  // translateState(option)
  return (
    <div className="status-container">
      <div className="filter-label" style={{ fontWeight: "normal" }}>
        {t("UC_SERVICE_CATEGORY_LABEL")}
      </div>

      {menuFirst?.map((option, index) => {
        return (
          <ServiceCategoryCount
            key={index}
            onAssignmentChange={onAssignmentChange}
            status={{ name: translateState(option), code: option.code }}
            searchParams={searchParams}
          />
        );
      })}
      {moreStatus &&
        meuSecond?.map((option, index) => {
          return (
            <ServiceCategoryCount
              key={index}
              onAssignmentChange={onAssignmentChange}
              status={{ name: translateState(option), code: option.code }}
              searchParams={searchParams}
            />
          );
        })}
      <div className="filter-button" onClick={() => showMoreStatus(!moreStatus)}>
        {" "}
        {moreStatus ? t("UC_LESS_LABEL") : t("UC_MORE_LABEL")}{" "}
      </div>
    </div>
  );
};

export default ServiceCategory;
