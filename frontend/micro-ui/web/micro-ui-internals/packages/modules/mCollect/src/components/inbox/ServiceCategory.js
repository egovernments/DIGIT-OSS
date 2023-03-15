import React, { useState, useMemo, useEffect } from "react";
import { Loader, MultiSelectDropdown, RemoveableTag } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import ServiceCategoryCount from "./ServiceCategoryCount";

const ServiceCategory = ({ onAssignmentChange, searchParams, selectedCategory,setSearchParams, setselectedCategories, businessServices,clearCheck,setclearCheck }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  const [moreStatus, showMoreStatus] = useState(false);
  const { data: Menu, isLoading } = Digit.Hooks.mcollect.useMCollectMDMS(stateId, "BillingService", "BusinessService", "[?(@.type=='Adhoc')]");
  let newMenu = [];
  const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
      str = str.replace(searcher, replaceWith);
    }
    return str;
  };

  Menu && Menu.map((ob) =>{
    newMenu.push({...ob,i18nKey:`BILLINGSERVICE_BUSINESSSERVICE_${stringReplaceAll(ob?.code,".","_").toUpperCase()}`})
  })

  const onRemove = (category) => {
    let newbussinessService = searchParams?.businessService.filter((ob) => ob !== category.code);
    let newCategories = [];
    newbussinessService?.map((bs) => {
      newCategories.push({"code":bs, "i18nKey":`BILLINGSERVICE_BUSINESSSERVICE_${stringReplaceAll(bs,".","_").toUpperCase()}`});
    })
    setSearchParams({...searchParams, businessService:[...newbussinessService]});
    setselectedCategories([...newCategories]);
  }

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
      <MultiSelectDropdown
              className="form-field"
              isMandatory={true}
              defaultUnit="Selected"
              selected={selectedCategory}
              options={newMenu}
              onSelect={onAssignmentChange}
              optionsKey="i18nKey"
              t={t}
              ServerStyle={{width:"100%",overflowY:"scroll",overflowX:"hidden"}}
      />
      <div className="tag-container">
      {selectedCategory?.map((value,index) => (
        <div >
        <RemoveableTag key={index} text={`${t(value["i18nKey"])}`} onClick={() => onRemove(value)} />
        </div>
      )) }
      </div>

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
      <div className="filter-button" onClick={() => showMoreStatus(!moreStatus)}>
        {" "}
        {moreStatus ? t("UC_LESS_LABEL") : t("UC_MORE_LABEL")}{" "}
      </div>  */}
    </div>
    
  );
};

export default ServiceCategory;
