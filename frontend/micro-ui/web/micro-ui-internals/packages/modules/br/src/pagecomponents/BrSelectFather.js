import React from "react";
import { LabelFieldPair, CardLabel, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import { useLocation } from "react-router-dom";

const BrSelectFather = ({ t, config, onSelect, formData = {}, userType, register, errors }) => {
  const { pathname: url } = useLocation();
  const inputs = [
    {
      label: "Father Name",
      type: "text",
      name: "name",
      validation: {
        isRequired: true,
        pattern: Digit.Utils.getPattern('Name'),
        title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
      },
      isMandatory: true,
    },
    // {
    //   label: "Father UserName",
    //   type: "text",
    //   name: "userName",
    //   validation: {
    //     isRequired: true,
    //     pattern: Digit.Utils.getPattern('Name'),
    //     title: t("CORE_COMMON_APPLICANT_NAME_INVALID"),
    //   },
    //   isMandatory: true,
    // },
    // {
    //   label: t("Father Mobile Number"),
    //   isMandatory: true,
    //   type: "number",
    //   name: "mobileNumber",
     
    // },
  
  ];

  function setValue(value, input) {
    onSelect(config.key, { ...formData[config.key], [input]: value });
  }

  return (
    <div>
      {inputs?.map((input, index) => {
        let currentValue=formData && formData[config.key] && formData[config.key][input.name]||'';
        return(<React.Fragment key={index}>
          {errors[input.name] && <CardLabelError>{t(input.error)}</CardLabelError>}
          <LabelFieldPair>
            <CardLabel className="card-label-smaller">
              {t(input.label)}
              {input.isMandatory ? " * " : null}
            </CardLabel>
            <div className="field">
              <TextInput
                key={input.name}
                value={formData && formData[config.key] ? formData[config.key][input.name] : undefined}
                onChange={(e) => setValue(e.target.value, input.name)}
                disable={false}
                defaultValue={undefined}
                {...input.validation}
              />
              
            {currentValue&&currentValue.length>0&&!currentValue.match(Digit.Utils.getPattern('Name'))&&<CardLabelError style={{ width: "100%", marginTop: '-15px', fontSize: '16px', marginBottom: '12px'}}>{t("CORE_COMMON_APPLICANT_NAME_INVALID")}</CardLabelError>}
            </div>
          </LabelFieldPair>
        </React.Fragment>
      )})}
    </div>
  );
};

export default BrSelectFather;
