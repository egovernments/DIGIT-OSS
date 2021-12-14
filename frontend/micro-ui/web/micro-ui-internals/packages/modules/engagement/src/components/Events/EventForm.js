import { TextInput, CardLabel, LabelFieldPair, Dropdown, Loader, LocationSearch, CardLabelError } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { alphabeticalSortFunctionForTenantsBasedOnName } from "../../utils";
import { useLocation } from "react-router-dom";

const EventForm = ({ onSelect, config, formData, register, control, errors }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId?.split('.')[0];
  const ulbs = Digit.SessionStorage.get("ENGAGEMENT_TENANTS");
  const userInfo = Digit.UserService.getUser().info;
  const userUlbs = ulbs.filter(ulb => userInfo?.roles?.some(role => role?.tenantId === ulb?.code)).sort(alphabeticalSortFunctionForTenantsBasedOnName)
  const getDefaultUlb = () => {
    if (formData?.defaultTenantId) {
      return ulbs?.find(ulb => ulb?.code === formData?.defaultTenantId);
    }
    if(tenantId){
      return ulbs?.find(ulb => ulb?.code === tenantId)
    }
    return userUlbs?.length === 1 ? userUlbs?.[0] : null
  }
  const { isLoading, data } = Digit.Hooks.useCommonMDMS(state, "mseva", ["EventCategories"]);

  const location = useLocation();
  const isInEditFormMode = useMemo(()=>{
    if(location.pathname.includes('/engagement/event/edit-event')) return true;
    return false;
  },[location.pathname])

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
            defaultValue={getDefaultUlb()}
            name="tenantId"
            rules={{ required: true }}
            render={({ onChange, value }) => <Dropdown option={userUlbs} selected={value} disable={isInEditFormMode ? true : userUlbs?.length === 1} optionKey="code" t={t} select={onChange} />}
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
            rules={{ required: true , maxLength:66}}
            control={control}
          />
           {errors && errors?.name && errors?.name?.type==="required" && <CardLabelError>{t(`EVENTS_COMMENTS_ERROR_REQUIRED`)}</CardLabelError>}
          {errors && errors?.name && errors?.name?.type==="maxLength" && <CardLabelError>{t(`EVENTS_MAXLENGTH_66_CHARS_REACHED`)}</CardLabelError>}
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