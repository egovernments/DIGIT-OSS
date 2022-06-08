import React, { useEffect, useState } from "react";
import {
  Loader,
  Dropdown,
  RemoveableTag,
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import ServiceCategoryCount from "./ServiceCategoryCount";
import { sortDropdownNames } from "../utils";
import { map } from "lodash";

const ServiceCategory = ({
  onAssignmentChange,
  searchParams,
  businessServices,
  clearCheck,
  setclearCheck,
  selectServiceCatagory,
}) => {
  const { t } = useTranslation();
  const tenantId = window.Digit.ULBService.getCurrentTenantId();
  const stateId = window.Digit.ULBService.getStateId();
  const [moreStatus, showMoreStatus] = useState(false);
  const { data: Menu, isLoading } = window.Digit.Hooks.mcollect.useMCollectMDMS(
    stateId,
    "BillingService",
    "BusinessService",
    "[?(@.type=='Adhoc')]"
  );

  console.log("prasad Menu", Menu);
  const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
      str = str.replace(searcher, replaceWith);
    }
    return str;
  };

  const translateState = (Menu) => {
    Menu?.map((option, index) => {
      let code = stringReplaceAll(option.code, ".", "_");
      code = stringReplaceAll(code, " ", "_");
      code = code.toUpperCase();
      return t(`BILLINGSERVICE_BUSINESSSERVICE_${code}`);
    });
  };

  let menuFirst = [];
  let meuSecond = [];
  Menu?.map((option, index) => {
    if (index < 5) menuFirst.push(option);
    else meuSecond.push(option);
  });

  useEffect(() => {
    Menu?.map((option, index) => {
      let code = stringReplaceAll(option.code, ".", "_");
      code = stringReplaceAll(code, " ", "_");
      code = code.toUpperCase();
      code = `BILLINGSERVICE_BUSINESSSERVICE_${code}`;
      option.code1 = code;
    });
  }, [Menu]);
  if (isLoading) {
    return <Loader />;
  }
  // translateState(option)
  return (
    <div className="status-container">
      <div className="filter-label" style={{ fontWeight: "normal" }}>
        {t("UC_SERVICE_CATEGORY_LABEL")}
      </div>
      <Dropdown
        select={selectServiceCatagory}
        optionKey="code1"
        option={sortDropdownNames(Menu, "code1", t)}
        onAssignmentChange={onAssignmentChange}
        t={t}
        status={{ name: translateState(Menu), code: Menu.code }}
      />
      {/* {menuFirst?.map((option, index) => {
        return (
            <ServiceCategoryCount
              clearCheck={clearCheck}
              setclearCheck={setclearCheck}
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
              clearCheck={clearCheck}
              setclearCheck={setclearCheck}
              key={index}
              onAssignmentChange={onAssignmentChange}
              status={{ name: translateState(option), code: option.code }}
              searchParams={searchParams}
            />
          );
        })}
      <div
        className="filter-button"
        onClick={() => showMoreStatus(!moreStatus)}
      >
        {" "}
        {moreStatus ? t("UC_LESS_LABEL") : t("UC_MORE_LABEL")}{" "}
      </div> */}
    </div>
  );
};

export default ServiceCategory;
