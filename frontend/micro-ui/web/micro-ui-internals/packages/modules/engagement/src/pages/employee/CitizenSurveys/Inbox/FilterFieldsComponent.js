import React, { Fragment, useMemo } from "react"
import { FilterFormField, Loader, Dropdown} from "@egovernments/digit-ui-react-components";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const FilterFormFieldsComponent = ({statuses, isInboxLoading, registerRef, controlFilterForm, setFilterFormValue, filterFormState, getFilterFormValue, localitiesForEmployeesCurrentTenant, loadingLocalitiesForEmployeesCurrentTenant}) => {
  const { t } = useTranslation()
   /**
     * ToDo how to display default value correctly ask @egov-saurabh
     */
  
  return <>
    <FilterFormField>
      <Controller
          name="status"
          control={controlFilterForm}
          render={({ref, onChange, value}) => {
            return <>
              <div className="filter-label">{t("CS_SURVEY_STATUS")}</div>
              <Dropdown inputRef={ref} option={statuses} optionKey="code" t={t} select={onChange}
                selected={value}
                />
            </>
          }
        }
        />
    </FilterFormField>
  </>
}

export default FilterFormFieldsComponent