import React, { Fragment } from "react";
import { TextInput, CardLabel, LabelFieldPair, Dropdown, Loader, LocationSearch, CardLabelError } from "@egovernments/digit-ui-react-components";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { isValid, format, startOfToday } from 'date-fns';

const SelectToDate = ({ onSelect, config, formData, register, control, errors, setError }) => {
  const { t } = useTranslation();
  const isValidDate = (date) => {
    if (!isValid(new Date(formData?.fromDate)) || !isValid(new Date(date))) return false;
    if (new Date(`${formData?.fromDate} ${formData?.fromTime}`) < new Date()) {
      setError('fromDate', { type: 'isValidFromDate' }, { shouldFocus: true });
      return false;
    }
    if (new Date(`${date} ${formData?.toTime}`) < new Date()) return false;
    return new Date(`${formData?.fromDate} ${formData?.fromTime}`) <= new Date(`${date} ${formData?.toTime}`);
  }
  return (
    <Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`EVENTS_TO_DATE_LABEL`)} *`}</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="toDate"
            defaultValue={formData?.toDate}
            rules={{ required: true, validate: { isValidDate: isValidDate }}}
            render={({ onChange, value }) => <TextInput type="date" isRequired={true} onChange={onChange} defaultValue={value} />}
          />
          {errors && errors?.toDate && errors?.toDate?.type === "required" && <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>}
          {errors && errors?.toDate && errors?.toDate?.type === "isValidDate" && <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_INVALID`)}</CardLabelError>}
        </div>
      </LabelFieldPair>
    </Fragment>
  )
};

export default SelectToDate;