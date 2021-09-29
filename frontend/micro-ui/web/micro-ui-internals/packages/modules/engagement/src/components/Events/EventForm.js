import { TextInput, CardLabel, LabelFieldPair, Dropdown, Loader, LocationSearch, CardLabelError } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";

const EventForm = ({ onSelect, config, formData, register, control, errors }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId?.split('.')[0];
  const ulbs = Digit.SessionStorage.get("ENGAGEMENT_TENANTS");
  const userUlbs = ulbs.filter(ulb => ulb?.code === tenantId)
  const { isLoading, data } = Digit.Hooks.useCommonMDMS(state, "mseva", ["EventCategories"]);

  const onChange = (event) => {
    onSelect(config?.key, { ...formData[config?.key], name: event?.target?.value });
  }

  const selectCategory = (data) => {
    onSelect(config?.key, { ...formData[config?.key], eventCategory: data?.code  })
  }

  const selectUlb = (data) => {
    onSelect(config?.key, { ...formData[config?.key], tenantId: data?.code  })
  }

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`EVENTS_ULB_LABEL`)} *`}</CardLabel>
        <div className="field">
          <Controller
            control={control}
            defaultValue={userUlbs?.length === 1 ? userUlbs?.[0] : null}
            name="tenantId"
            rules={{ required: true }}
            render={({ onChange, value }) => <Dropdown option={userUlbs} selected={value} disable={userUlbs?.length === 1} optionKey="code" t={t} select={onChange} />}
          />
          {errors && errors['tenantId'] && <CardLabelError>{t(`EVENTS_TENANT_ERROR_REQUIRED`)}</CardLabelError>}
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`EVENTS_NAME_LABEL`)} *`}</CardLabel>
        <div className="field">
          <Controller
            defaultValue={formData?.name}
            render={({ onChange, ref, value }) => <TextInput value={value} type="text" name="name" onChange={onChange} inputRef={ref} />}
            name="name"
            rules={{ required: true }}
            control={control}
          />
          {errors && errors['name'] && <CardLabelError>{t(`EVENTS_NAME_ERROR_REQUIRED`)}</CardLabelError>}
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`EVENTS_CATEGORY_LABEL`)} *`}</CardLabel>
        <div className="field">
          <Controller
            name="eventCategory"
            control={control}
            defaultValue={formData?.category ? data?.mseva?.EventCategories.filter(category => category.code === formData?.category)?.[0] : null}
            rules={{ required: true }}
            render={({ onChange, ref, value }) => <Dropdown inputRef={ref} option={data?.mseva?.EventCategories} optionKey="code" t={t} select={onChange} selected={value} />}
          />
          {errors && errors['eventCategory'] && <CardLabelError>{t(`EVENTS_CATEGORY_ERROR_REQUIRED`)}</CardLabelError>}
        </div>
      </LabelFieldPair>
    </Fragment>
  )
};

export default EventForm;