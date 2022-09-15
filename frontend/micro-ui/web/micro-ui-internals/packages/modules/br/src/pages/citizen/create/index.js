import { FormComposer, Loader } from "@egovernments/digit-ui-react-components";
import React, {  useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { newConfig } from "../../../components/config/config";

const Create = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const history = useHistory();
  

  const onSubmit = (data) => {
    let roles = data?.Jurisdictions?.map((ele) => {
      return ele.roles?.map((item) => {
        item["tenantId"] = ele.boundary;
        return item;
      });
    });

    const mappedroles = [].concat.apply([], roles);
    
    
let Users ={
  BirthRegistrationApplications :[
    {
          
          babyFirstName: data?.BrSelectName?.babyFirstName,
          babyLastName: data?.BrSelectName?.babyLastName,
          doctorName: data?.BrSelectName?.doctorName,
          hospitalName: data?.BrSelectName?.hospitalName,
          placeOfBirth: data?.BrSelectName?.placeOfBirth,
          tenantId: tenantId,
          address: {
            tenantId: tenantId,
            locality:{

            },
          },
          fatherOfApplicant:{
            tenantId: tenantId,
            name:data?.BrSelectFather?.name,
            userName:"91300114",
            mobileNumber:"9230011254",
            emailId:data?.BRSelectEmailId?.emailId,
            permanentAddress:data?.BrSelectAddress?.permanentAddress,
            permanentCity:data?.BrSelectAddress?.permanentCity,
            correspondenceCity:data?.SelectCorrespondenceAddress?.correspondenceCity,
            correspondenceAddress:data?.SelectCorrespondenceAddress?.correspondenceAddress,
            roles: mappedroles,

          },
          motherOfApplicant:{
            tenantId: tenantId,
            name:data?.BrSelectMother?.name,
            userName:"92300114",
            mobileNumber:"9230051254",
            roles: mappedroles,
          },
          workflow:{
            action:"APPLY",
            assignes:[],
            verificationDocuments:[
              {
                additionalDetails:{}
              }
            ]
          }
        }
      
    ]
  }
  
     
      /* use customiseCreateFormData hook to make some chnages to the Employee object */
     Digit.BRService.create(Users, tenantId).then((result,err)=>{
       let getdata = {...data , get: result }
      
       console.log("daaaa",getdata);
     })
     .catch((err) => {
     console.log(err);
    });

    history.push("/digit-ui/citizen/br/response");
 console.log("geting!!",data)
    
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
