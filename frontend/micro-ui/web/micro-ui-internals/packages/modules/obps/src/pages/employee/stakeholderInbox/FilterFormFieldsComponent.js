import React, { Fragment, useMemo } from "react"
import { FilterFormField, Loader, RadioButtons, Localities, RemoveableTag, Dropdown, CheckBox } from "@egovernments/digit-ui-react-components";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

const FilterFormFieldsComponent = ({ statuses, isInboxLoading, registerRef, controlFilterForm, setFilterFormValue, filterFormState, getFilterFormValue, localitiesForEmployeesCurrentTenant, loadingLocalitiesForEmployeesCurrentTenant }) => {
  const { t } = useTranslation();
  const availableOptions = [
    { code: "ASSIGNED_TO_ME", name: `${t("ES_INBOX_ASSIGNED_TO_ME")}` },
    { code: "ASSIGNED_TO_ALL", name: `${t("ES_INBOX_ASSIGNED_TO_ALL")}` },
  ];
  const stateId = Digit.ULBService.getStateId();
  const { data: stakeholderServiceTypes, isLoading: stakeholderServiceTypesLoading } = Digit.Hooks.obps.useMDMS(stateId, "StakeholderRegistraition", "TradeTypetoRoleMapping", {
    select: (data) => {
      return data?.StakeholderRegistraition?.TradeTypetoRoleMapping.reduce((accumulator, currentObject) => {
        const identifier = currentObject.tradeType.split(".")[0]
        if (accumulator.find(el => el.i18nKey.includes(identifier))) return accumulator
        else return [...accumulator, {
          role: currentObject.role[0],
          i18nKey: `TRADELICENSE_TRADETYPE_${currentObject.tradeType.split(".")[0]}`,
          tradeType: currentObject.tradeType,
          identifier
        }]
      }, []);
    }
  });
  const selectedBusinessService = useWatch({control: controlFilterForm, name: "businessService", defaultValue: null});
  return <>
    <FilterFormField>
      <Controller
        name="assignee"
        control={controlFilterForm}
        render={(props) => {
          return <RadioButtons
            onSelect={(e) => {
              props.onChange(e.code)
            }}
            selectedOption={availableOptions.filter((option) => option.code === props.value)[0]}
            optionsKey="name"
            name="assignee"
            options={availableOptions}
          />
        }}
      />
    </FilterFormField>
    <FilterFormField>
      <Controller
          name="businessService"
          control={controlFilterForm}
          render={(props) => {
            return stakeholderServiceTypesLoading ? <Loader/> : <>
              <div className="filter-label sub-filter-label" style={{fontSize: "18px", fontWeight: "600"}}>{t("BPA_LICENSE_TYPE")}</div>
                <RadioButtons
                  onSelect={(e) => {
                    setFilterFormValue("applicationStatus",[]);
                    props.onChange(e);
                  }}
                  selectedOption={props.value}
                  optionsKey="i18nKey"
                  options={stakeholderServiceTypes}
                />  
              </>
          }}
      />
    </FilterFormField>
    {selectedBusinessService ? <FilterFormField>
      <div className="filter-label" style={{fontSize: "18px", fontWeight: "600"}}>{t("ACTION_TEST_APPLICATION_STATUS")}</div>
      <Controller
        name="applicationStatus"
        control={controlFilterForm}
        render={(props) => {
          function changeItemCheckStatus(value) {
            props.onChange(value)
          }
          const renderStatusCheckBoxes = useMemo(() => statuses?.filter(e => e.businessservice === selectedBusinessService.identifier)?.map((status, index) => {
            return <CheckBox
              key={index}
              onChange={(e) => e.target.checked ? changeItemCheckStatus([...props.value, status?.statusid]) : changeItemCheckStatus(props.value?.filter(id => id !== status?.statusid))}
              checked={props.value?.includes(status?.statusid)}
              label={`${t(`WF_${status.businessservice}_${status.applicationstatus}`)} (${status.count})`}
            />
          }), [props.value, statuses, selectedBusinessService])
          return <>
            {isInboxLoading ? <Loader /> : <>{renderStatusCheckBoxes}</>}
          </>
        }}
      />
    </FilterFormField> : null}
  </>
}

export default FilterFormFieldsComponent