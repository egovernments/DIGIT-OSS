import React from 'react';
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import CardLabelError from "../atoms/CardLabelError";
import LabelFieldPair from '../atoms/LabelFieldPair';
import CardLabel from "../atoms/CardLabel";
import TextInput from "../atoms/TextInput";
import TextArea from "../atoms/TextArea";
import CustomDropdown from './CustomDropdown';
import MobileNumber from '../atoms/MobileNumber';
import DateRangeNew from './DateRangeNew';
import MultiUploadWrapper from "./MultiUploadWrapper";
import MultiSelectDropdown from '../atoms/MultiSelectDropdown';
import LocationDropdownWrapper from './LocationDropdownWrapper';
import WorkflowStatusFilter from './WorkflowStatusFilter';
import ApiDropdown from './ApiDropdown';
const RenderFormFields = ({data,...props}) => {
  
    const { t } = useTranslation();
    const { fields, control, formData, errors, register, setValue, getValues, setError, clearErrors, apiDetails} = props
    
    const fieldSelector = (type, populators, isMandatory, disable = false, component, config) => {
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        let customValidations = config?.additionalValidation ? Digit?.Customizations?.[apiDetails?.masterName]?.[apiDetails?.moduleName]?.additionalValidations(config?.additionalValidation?.type, formData, config?.additionalValidation?.keys) : null
        const customRules = customValidations ? { validate: customValidations} : {}
        switch (type) {
            case "date":
            case "text":
            case "number":
            case "password":
            case "time":
                return (
                    <Controller
                        defaultValue={formData?.[populators.name]}
                        render={({ onChange, ref, value }) => (
                        <TextInput
                            value={formData?.[populators.name]}
                            type={type}
                            name={populators.name}
                            onChange={onChange}
                            inputRef={ref}
                            errorStyle={errors?.[populators.name]}
                            max={populators.max}
                            disable={disable}
                            style={type === "date" ? { paddingRight: "3px" } : ""}
                            maxlength={populators?.validation?.maxlength}
                            minlength={populators?.validation?.minlength}
                        />
                        )}
                        name={populators.name}
                        rules={{required: isMandatory, ...populators.validation, ...customRules }}
                        control={control}
                    />
                );
    
            case "textarea":
            return (
              <Controller
                defaultValue={formData?.[populators.name]}
                render={({ onChange, ref, value }) => (
                  <TextArea
                    className="field"
                    value={formData?.[populators.name]}
                    type={type}
                    name={populators.name}
                    onChange={onChange}
                    inputRef={ref}
                    disable={disable}
                    errorStyle={errors?.[populators.name]}
                  />
                )}
                name={populators.name}
                rules={{ required: isMandatory, ...populators.validation }}
                control={control}
              />
            );
            case "mobileNumber":
            return (
              <Controller
                render={(props) => (
                  <MobileNumber
                    inputRef={props.ref}
                    className="field fullWidth"
                    onChange={props.onChange}
                    value={props.value}
                    disable={disable}
                    {...props}
                    errorStyle={errors?.[populators.name]}
                  />
                )}
                defaultValue={populators.defaultValue}
                name={populators?.name}
                rules={{ required: isMandatory, ...populators.validation }}
                control={control}
              />
            );
            case "multiupload":
                return (
                  <Controller
                    name={`${populators.name}`}
                    control={control}
                    rules={{ required: false }}
                    render={({ onChange, ref, value = [] }) => {
                      function getFileStoreData(filesData) {
                        const numberOfFiles = filesData.length;
                        let finalDocumentData = [];
                        if (numberOfFiles > 0) {
                          filesData.forEach((value) => {
                            finalDocumentData.push({
                              fileName: value?.[0],
                              fileStoreId: value?.[1]?.fileStoreId?.fileStoreId,
                              documentType: value?.[1]?.file?.type,
                            });
                          });
                        }
                        onChange(numberOfFiles>0?filesData:[]);
                      }
                      return (
                        <MultiUploadWrapper
                          t={t}
                          module="works"
                          tenantId={Digit.ULBService.getCurrentTenantId()}
                          getFormState={getFileStoreData}
                          showHintBelow={populators?.showHintBelow ? true : false}
                          setuploadedstate={value}
                          allowedFileTypesRegex={populators.allowedFileTypes}
                          allowedMaxSizeInMB={populators.allowedMaxSizeInMB}
                          hintText={populators.hintText}
                          maxFilesAllowed={populators.maxFilesAllowed}
                          extraStyleName={{ padding: "0.5rem" }}
                          customClass={populators?.customClass}
                        />
                      );
                    }}
                  />
                );
            case "custom":
                return (
                <Controller
                    render={(props) => populators.component({ ...props, setValue }, populators.customProps)}
                    defaultValue={populators.defaultValue}
                    name={populators?.name}
                    control={control}
                />
                );

            case "radio":
            case "dropdown":
                return (
                <Controller
                    render={(props) => (
                    <CustomDropdown
                        t={t}
                        label={config?.label}
                        type={type}
                        onBlur={props.onBlur}
                        value={props.value}
                        inputRef={props.ref}
                        onChange={props.onChange}
                        config={populators}
                        disable={config?.disable}
                        errorStyle={errors?.[populators.name]}
                    />
                    )}
                    rules={{ required: isMandatory, ...populators.validation }}
                    defaultValue={formData?.[populators.name]}
                    name={populators?.name}
                    control={control}
                  />
                );
            
            case "multiselectdropdown":
              return (
                <Controller
                  name={`${populators.name}`}
                  control={control}
                  defaultValue={formData?.[populators.name]}
                  rules={{ required: populators?.isMandatory }}
                  render={(props) => {
                    return (
                      <div style={{ display: "grid", gridAutoFlow: "row" }}>
                        <MultiSelectDropdown
                          options={populators?.options}
                          optionsKey={populators?.optionsKey}
                          props={props}
                          isPropsNeeded={true}
                          onSelect={(e) => {
                            props.onChange(e?.map(row=>{return row?.[1] ? row[1] : null}).filter(e=>e))
                          }}
                          selected={props?.value}
                          defaultLabel={t(populators?.defaultText)}
                          defaultUnit={t(populators?.selectedText)}
                          config={populators}
                        />
                      </div>
                    );
                  }}
                />
              );

          case "locationdropdown":
            return (
              <Controller
                name={`${populators.name}`}
                control={control}
                defaultValue={formData?.[populators.name]}
                rules={{ required: populators?.isMandatory, ...populators.validation }}
                render={(props) => {
                  return (
                    <div style={{ display: "grid", gridAutoFlow: "row" }}>
                      <LocationDropdownWrapper
                        props={props}
                        populators={populators}
                        formData={formData}
                        inputRef={props.ref}
                        errors={errors}
                        setValue={setValue}
                      />
                    </div>
                  );
                }}
              />
            );

            case "apidropdown":
            return (
              <Controller
                name={`${populators.name}`}
                control={control}
                defaultValue={formData?.[populators.name]}
                rules={{ required: populators?.isMandatory, ...populators.validation }}
                render={(props) => {
                  return (
                    <div style={{ display: "grid", gridAutoFlow: "row" }}>
                      <ApiDropdown
                        props={props}
                        populators={populators}
                        formData={formData}
                        inputRef={props.ref}
                        errors={errors}
                      />
                    </div>
                  );
                }}
              />
            );


            case "workflowstatesfilter":
            return (
              <Controller
                name={`${populators.name}`}
                control={control}
                defaultValue={formData?.[populators.name]}
                rules={{ required: populators?.isMandatory }}
                render={(props) => {
                  return (
                    <div style={{ display: "grid", gridAutoFlow: "row" }}>
                      <WorkflowStatusFilter
                        inboxResponse={data}
                        props={props}
                        populators={populators}
                        t={t}
                        formData={formData}
                      />
                    </div>
                  );
                }}
              />
            );
            case "dateRange":
              return (
                <Controller
                  render={(props) => (
                    <DateRangeNew
                      t={t}
                      values={formData?.[populators.name]?.range}
                      name={populators.name}
                      onFilterChange={props.onChange}
                      inputRef={props.ref}
                      errorStyle={errors?.[populators.name]}
                    />                  
                  )}
                  rules={{ required: isMandatory, ...populators.validation }}
                  defaultValue={formData?.[populators.name]}
                  name={populators?.name}
                  control={control}
                />
              );

            case "component":
            return (
              <Controller
                render={(props) => (
                  <Component
                    userType={"employee"}
                    t={t}
                    setValue={setValue}
                    onSelect={setValue}
                    config={config}
                    data={formData}
                    formData={formData}
                    register={register}
                    errors={errors}
                    props={props}
                    setError={setError}
                    clearErrors={clearErrors}
                    onBlur={props.onBlur}
                    control={control}
                    getValues={getValues}
                  />
                )}
                name={config?.key}
                control={control}
              />
            );
                    
            default:
                return populators?.dependency !== false ? populators : null;
        }
    };

    return (
      <React.Fragment>
        {fields?.map((item, index) => {
          return (
            <LabelFieldPair key={index}>
                { item.label && (
                  <CardLabel style={{...props.labelStyle,marginBottom:"0.4rem"}}>
                    {t(item.label)}{ item?.isMandatory ? " * " : null }
                  </CardLabel>) 
                }

                { fieldSelector(item.type, item.populators, item.isMandatory, item?.disable, item?.component, item) }
                
                { item?.populators?.name && errors && errors[item?.populators?.name] && Object.keys(errors[item?.populators?.name]).length ? (
                  <CardLabelError style={{ fontSize: "12px", marginTop: "-20px" }}>
                    {t(item?.populators?.error)}
                  </CardLabelError> ) : null
                }
            </LabelFieldPair>
          )
        })}
      </React.Fragment>
    )
}

export default RenderFormFields;