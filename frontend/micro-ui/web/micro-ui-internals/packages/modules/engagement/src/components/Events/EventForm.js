import { TextInput, CardLabel, LabelFieldPair, Dropdown, Loader, LocationSearch } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

const EventForm = ({ onSelect, config, formData }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId?.split('.')[0];
  const ulbs = Digit.SessionStorage.get("ENGAGEMENT_TENANTS");
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
        <CardLabel className="card-label-smaller">{`${t(`EVENTS_ULB_LABEL`)}`}</CardLabel>
        <div className="field">
          <Dropdown option={ulbs} optionKey="code" t={t} select={selectUlb} />
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`EVENTS_NAME_LABEL`)}`}</CardLabel>
        <div className="field">
          <TextInput type="text" name="name" onChange={onChange} />
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`EVENTS_CATEGORY_LABEL`)}`}</CardLabel>
        <div className="field">
          <Dropdown option={data?.mseva?.EventCategories} optionKey="code" t={t} select={selectCategory} />
        </div>
      </LabelFieldPair>
    </Fragment>
  )
};

export default EventForm;