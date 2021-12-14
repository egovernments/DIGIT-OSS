import { TextInput, CardLabel, LabelFieldPair, Dropdown, Loader, LocationSearch, CardLabelError, TextArea, MultiUploadWrapper } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { isValid } from 'date-fns';
import compareAsc from 'date-fns/compareAsc';
import { convertDateToMaximumPossibleValue } from "../../utils";


const allowedFileTypes = /(.*?)(jpg|jpeg|png|image|pdf|msword|openxmlformats-officedocument)$/i;

const MessageForm = ({ onSelect, config, formData, register, control, errors, setError }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = tenantId?.split('.')[0];
  const ulbs = Digit.SessionStorage.get("ENGAGEMENT_TENANTS");
  const { isLoading, data } = Digit.Hooks.useCommonMDMS(state, "mseva", ["EventCategories"]);

  const stateId = Digit.ULBService.getStateId()
  const userUlbs = ulbs.filter(ulb => ulb?.code === tenantId);

  const isValidFromDate = (date) => {
    const fromDate = convertDateToMaximumPossibleValue(new Date(`${formData?.fromDate}`)) // make it maximum possible value
    const todaysDate = new Date();
    if (!isValid(fromDate)) return false;
    if (fromDate.getTime() < todaysDate.getTime()) {
      setError('fromDate', { type: 'isValidFromDate' }, { shouldFocus: true });
      return false;
    }
    return true;
  }

  const isValidToDate = (date) => {
    const fromDate = convertDateToMaximumPossibleValue(new Date(`${formData?.fromDate}`))
    const toDate = convertDateToMaximumPossibleValue(new Date(`${formData?.toDate}`));
    const todaysDate = new Date();
    if (!isValid(toDate)) return false;
    if (toDate.getTime() < todaysDate.getTime() || (toDate.getTime() < fromDate.getTime())) {
      setError('toDate', { type: 'isValidToDate' }, { shouldFocus: true });
      return false;
    }
    return true;
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
        <CardLabel className="card-label-smaller">{`${t(`PUBLIC_BRDCST_TITLE_LABEL`)} *`}</CardLabel>
        <div className="field">
          <Controller
            defaultValue={formData?.name}
            render={({ onChange, ref, value }) => <TextInput value={value} type="text" name="name" onChange={onChange} inputRef={ref} />}
            name="name"
            rules={{ required: true, maxLength: 66 }}
            control={control}
          />
          {errors && errors?.name && errors?.name?.type === "required" && <CardLabelError>{t(`EVENTS_COMMENTS_ERROR_REQUIRED`)}</CardLabelError>}
          {errors && errors?.name && errors?.name?.type === "maxLength" && <CardLabelError>{t(`EVENTS_MAXLENGTH_66_CHARS_REACHED`)}</CardLabelError>}
        </div>
      </LabelFieldPair>
      <LabelFieldPair style={{ marginBottom: "24px" }}>
        <CardLabel className="card-label-smaller">{`${t(`EVENTS_COMMENTS_LABEL`)} *`}</CardLabel>
        <div className="field">
          <Controller
            name="description"
            control={control}
            defaultValue={formData?.category ? data?.mseva?.EventCategories.filter(category => category.code === formData?.category)?.[0] : null}
            rules={{ required: true, maxLength: 500 }}
            render={({ onChange, ref, value }) => <TextArea inputRef={ref} value={value} name="description" onChange={onChange} hintText={t('PUBLIC_BRDCST_MSG_LENGTH')} />}
          />
          {errors && errors?.description && errors?.description?.type === "required" && <CardLabelError>{t(`EVENTS_COMMENTS_ERROR_REQUIRED`)}</CardLabelError>}
          {errors && errors?.description && errors?.description?.type === "maxLength" && <CardLabelError>{t(`EVENTS_MAXLENGTH_REACHED`)}</CardLabelError>}
        </div>
      </LabelFieldPair>
      <LabelFieldPair style={{ marginBottom: "24px" }}>
        <CardLabel className="card-label-smaller">{`${t(`EVENTS_ATTACHMENT_LABEL`)}`}</CardLabel>
        <div className="field">
          <Controller
            name="documents"
            control={control}
            // defaultValue={formData?.category ? data?.mseva?.EventCategories.filter(category => category.code === formData?.category)?.[0] : null}
            rules={{ required: false }}
            render={({ onChange, ref, value = [] }) => {
              function getFileStoreData(filesData) {
                const numberOfFiles = filesData.length
                let finalDocumentData = []
                if (numberOfFiles > 0) {
                  filesData.forEach(value => {
                    finalDocumentData.push({
                      fileName: value?.[0],
                      fileStoreId: value?.[1]?.fileStoreId?.fileStoreId,
                      documentType: value?.[1]?.file?.type
                    })
                  })
                }
                onChange(finalDocumentData)
              }
              return <MultiUploadWrapper
                t={t}
                module="engagement"
                tenantId={stateId}
                getFormState={getFileStoreData}
                showHintBelow={true}
                setuploadedstate={value}
                allowedFileTypesRegex={allowedFileTypes}
                allowedMaxSizeInMB={5}
                hintText={t("DOCUMENTS_ATTACH_RESTRICTIONS_SIZE")}
              />
            }
            }
          />
          {/* {errors && errors['description'] && <CardLabelError>{t(`EVENTS_COMMENTS_ERROR_REQUIRED`)}</CardLabelError>} */}
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`PUBLIC_BRDCST_FROM_DATE_LABEL`)} *`}</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="fromDate"
            defaultValue={formData?.fromDate}
            rules={{ required: true, validate: { isValidFromDate } }}
            render={({ onChange, value }) => <TextInput type="date" isRequired={true} onChange={onChange} defaultValue={value} />}
          />
          {errors && errors?.fromDate && errors?.fromDate?.type === "required" && <CardLabelError>{t(`EVENTS_FROM_DATE_ERROR_REQUIRED`)}</CardLabelError>}
          {errors && errors?.fromDate && errors?.fromDate?.type === "isValidFromDate" && <CardLabelError>{t(`EVENTS_FROM_DATE_ERROR_INVALID`)}</CardLabelError>}
        </div>
      </LabelFieldPair>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{`${t(`PUBLIC_BRDCST_TO_DATE_LABEL`)} *`}</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="toDate"
            defaultValue={formData?.toDate}
            rules={{ required: true, validate: { isValidToDate } }}
            render={({ onChange, value }) => <TextInput type="date" isRequired={true} onChange={onChange} defaultValue={value} />}
          />
          {errors && errors?.toDate && errors?.toDate?.type === "required" && <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>}
          {errors && errors?.toDate && errors?.toDate?.type === "isValidToDate" && <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_INVALID`)}</CardLabelError>}
        </div>
      </LabelFieldPair>
    </Fragment>
  )
};

export default MessageForm;