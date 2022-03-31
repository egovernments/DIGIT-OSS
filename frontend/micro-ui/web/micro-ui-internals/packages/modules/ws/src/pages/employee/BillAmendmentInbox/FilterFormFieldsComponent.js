import React, { Fragment, useMemo } from "react"
import { FilterFormField, Loader, RadioButtons, Localities, RemoveableTag, Dropdown, CheckBox, MultiSelectDropdown } from "@egovernments/digit-ui-react-components";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
// import { businessServiceList } from "../../../utils";

const FilterFormFieldsComponent = ({statuses, isInboxLoading, registerRef, controlFilterForm, setFilterFormValue, filterFormState, getFilterFormValue, applicationTypesOfBPA, loadingApplicationTypesOfBPA,  localitiesForEmployeesCurrentTenant, loadingLocalitiesForEmployeesCurrentTenant}) => {
  const { t } = useTranslation()
  const tenantId = Digit.ULBService.getStateId();
  const availableOptions = [
    { code: "ASSIGNED_TO_ME", name: `${t("ES_INBOX_ASSIGNED_TO_ME")}` },
    { code: "ASSIGNED_TO_ALL", name: `${t("ES_INBOX_ASSIGNED_TO_ALL")}` },
  ];
  const moduleNameOptions = [
    {code: "ws-service", i18nKey: "WS_WS_SERVICE"},
    {code: "sw-service", i18nKey: "WS_SW_SERVICE"},
  ]

  const selectrole = (listOfSelections, props) => {
    const res = listOfSelections.map( (propsData) => {
      const data = propsData[1]
        return data
     })
    return props.onChange(res);
  };

  const selectModuleName = (listOfSelections, props) => {
    debugger
  }
  return <>
    <FilterFormField>
      <Controller
        name="assignee"
        control={controlFilterForm}
        render={(props) => <RadioButtons
          onSelect={(e) => {
            props.onChange(e.code)
          }}
          selectedOption={availableOptions.filter((option) => option.code === props.value)[0]}
          optionsKey="name"
          options={availableOptions}
        />}
      />
    </FilterFormField>
    <FilterFormField>
      <Controller
          name="moduleName"
          control={controlFilterForm}
          render={(props) => {
            const renderRemovableTokens = useMemo(()=>props?.value?.map((moduleName, index) => {
              return (
                <RemoveableTag
                  key={index}
                  text={moduleName.i18nkey}
                  onClick={() => {
                    props.onChange(props?.value?.filter((loc) => loc.code !== moduleName.code))
                  }}
                />
                );
              }),[props?.value])
            return loadingLocalitiesForEmployeesCurrentTenant ? <Loader/> : <>
              <div className="filter-label sub-filter-label">{t("ES_INBOX_LOCALITY")}</div>
              <MultiSelectDropdown
                options={moduleNameOptions}
                optionsKey="i18nkey"
                props={props}
                isPropsNeeded={true}
                onSelect={selectModuleName}
                selected={props?.value}
                defaultLabel={t("ES_BPA_ALL_SELECTED")}
                defaultUnit={t("BPA_SELECTED_TEXT")}
              />
              <div className="tag-container">
                {renderRemovableTokens}
              </div>
            </>
          }
        }
        />
    </FilterFormField>
    <FilterFormField>
      <Controller
          name="locality"
          control={controlFilterForm}
          render={(props) => {
            const renderRemovableTokens = useMemo(()=>props?.value?.map((locality, index) => {
              return (
                <RemoveableTag
                  key={index}
                  text={locality.i18nkey}
                  onClick={() => {
                    props.onChange(props?.value?.filter((loc) => loc.code !== locality.code))
                  }}
                />
                );
              }),[props?.value])
            return loadingLocalitiesForEmployeesCurrentTenant ? <Loader/> : <>
              <div className="filter-label sub-filter-label">{t("ES_INBOX_LOCALITY")}</div>
              <MultiSelectDropdown
                options={localitiesForEmployeesCurrentTenant ? localitiesForEmployeesCurrentTenant : []}
                optionsKey="i18nkey"
                props={props}
                isPropsNeeded={true}
                onSelect={selectrole}
                selected={props?.value}
                defaultLabel={t("ES_BPA_ALL_SELECTED")}
                defaultUnit={t("BPA_SELECTED_TEXT")}
              />
              <div className="tag-container">
                {renderRemovableTokens}
              </div>
            </>
          }
        }
        />
    </FilterFormField>
    <FilterFormField>
      <Controller
        name="applicationStatus"
        control={controlFilterForm}
        render={(props) => {
          function changeItemCheckStatus(value){
            props.onChange(value)
          }
          const renderStatusCheckBoxes = useMemo(()=>statuses?.map( status => {
            return <CheckBox
              onChange={(e) => e.target.checked ? changeItemCheckStatus([...props.value, status?.statusid]) : changeItemCheckStatus(props.value?.filter( id => id !== status?.statusid)) }
              checked={props.value?.includes(status?.statusid)}
              label={`${t(`WF_${status.businessservice}_${status.applicationstatus.split('_').pop()}`)} (${status.count})`}
            />}),[props.value, statuses])
          return <>
            <div className="filter-label sub-filter-label">{t("ACTION_TEST_APPLICATION_STATUS")}</div>
            {isInboxLoading ? <Loader /> : <>{renderStatusCheckBoxes}</>}
          </>
        }}
      />
    </FilterFormField>
  </>
}

export default FilterFormFieldsComponent