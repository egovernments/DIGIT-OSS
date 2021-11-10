import React, { Fragment, useMemo } from "react"
import { FilterFormField, Loader, RadioButtons, Localities, RemoveableTag, Dropdown, CheckBox } from "@egovernments/digit-ui-react-components";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const FilterFormFieldsComponent = ({ statuses, isInboxLoading, registerRef, controlFilterForm, setFilterFormValue, filterFormState, getFilterFormValue, localitiesForEmployeesCurrentTenant, loadingLocalitiesForEmployeesCurrentTenant }) => {
  const { t } = useTranslation();
  const availableOptions = [
    { code: "ASSIGNED_TO_ME", name: `${t("ES_INBOX_ASSIGNED_TO_ME")}` },
    { code: "ASSIGNED_TO_ALL", name: `${t("ES_INBOX_ASSIGNED_TO_ALL")}` },
  ];

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
      <div className="filter-label">{t("ACTION_TEST_APPLICATION_STATUS")}</div>
      <Controller
        name="applicationStatus"
        control={controlFilterForm}
        render={(props) => {
          function changeItemCheckStatus(value) {
            props.onChange(value)
          }
          const renderStatusCheckBoxes = useMemo(() => statuses?.map((status, index) => {
            return <CheckBox
              key={index}
              onChange={(e) => e.target.checked ? changeItemCheckStatus([...props.value, status?.statusid]) : changeItemCheckStatus(props.value?.filter(id => id !== status?.statusid))}
              checked={props.value?.includes(status?.statusid)}
              label={t(`WF_${status.businessservice}_${status.applicationstatus.split('_').pop()}`)}
            />
          }), [props.value, statuses])
          return <>
            {isInboxLoading ? <Loader /> : <>{renderStatusCheckBoxes}</>}
          </>
        }}
      />
    </FilterFormField>
  </>
}

export default FilterFormFieldsComponent