import { FormComposer, Loader } from "@egovernments/digit-ui-react-components";
import React, {  useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { newConfig } from "../../../components/config/config";

const Create = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [canSubmit, setSubmitValve] = useState(false);
  const { t } = useTranslation();
  const history = useHistory();
  

// const payload = {
//   user: {
//     firstname: data?.BrSelectName?.firstName,
//     lastname: data?.BrSelectName?.lastName,
//     fathername: data?.BrSelectName?.fatherName,
//     mothername: data?.BrSelectName?.motherName,
//     tenantId: tenantId,
//   },
// }


// const createuser = ((payload)=>{
// Digit.BRService.create(data , tenantId)


// })

  const onSubmit = (data) => {

    let Users = [
      {
        tenantId: tenantId,
        employeeStatus: "EMPLOYED",
      
        user: {
          firstname: data?.BrSelectName?.firstName,
          lastname: data?.BrSelectName?.lastName,
          fathername: data?.BrSelectName?.fatherName,
          mothername: data?.BrSelectName?.motherName,
          tenantId: tenantId,
        },
        serviceHistory: [],
        education: [],
        tests: [],
      },
    ];
      /* use customiseCreateFormData hook to make some chnages to the Employee object */
     
   
    console.log("getting data",Users)
   
  };
 
  
  /* use newConfig instead of commonFields for local development in case needed */

  const configs = newConfig?newConfig:newConfig;

  return (
    <FormComposer
    heading={t("Create Birth Registration")}
    label={t("ES_COMMON_APPLICATION_SUBMIT")}
    config={configs.map((config) => {
      return {
        ...config,
        body: config.body.filter((a) => !a.hideInEmployee),
      };
    })}
    onSubmit={onSubmit}
    fieldStyle={{ marginRight: 0 }}
  />
  );
};

export default Create;
