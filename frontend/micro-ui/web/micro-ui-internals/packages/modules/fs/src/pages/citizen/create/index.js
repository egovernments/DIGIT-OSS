import { FormComposer } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

import { newConfig } from "../../../components/config/config";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const Create = () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const { t } = useTranslation();
    const configs = newConfig ? newConfig : newConfig;
    const history = useHistory();

    const onSubmit = (data) => {

        let Users = [
            {

                user: {
                    babyFirstName: data?.BrSelectName?.babyFirstName,
                    babyLastName: data?.BrSelectName?.babyLastName,
                    fatherName: data?.BrSelectName?.fatherName,
                    motherName: data?.BrSelectName?.motherName,
                    gender: data?.BrSelectGender?.gender,
                    doctorName: data?.BrSelectName?.doctorName,
                    hospitalName: data?.BrSelectName?.hospitalName,
                    placeOfBirth: data?.BrSelectName?.placeOfBirth,
                    applicantMobileNumber: data?.BRSelectPhoneNumber?.applicantMobileNumber,
                    altMobileNumber: data?.BRSelectPhoneNumber?.altMobileNumber,
                    emailId: data?.BRSelectEmailId?.emailId,
                    permanentAddress: data?.BrSelectAddress?.permanentAddress,
                    permanentCity: data?.BrSelectAddress?.permanentCity,
                    correspondenceCity: data?.SelectCorrespondenceAddress?.correspondenceCity,
                    correspondenceAddress: data?.SelectCorrespondenceAddress?.correspondenceAddress,
                    bloodGroup: data?.SelectCorrespondenceAddress?.bloodGroup,
                    tenantId: tenantId,
                },

            },
        ];
        /* use customiseCreateFormData hook to make some chnages to the Employee object */
        Digit.BRService.create(Users, tenantId).then((result, err) => {
            let getdata = { ...data, get: result }
            onSelect("", getdata, "", true);
            console.log("daaaa", getdata);
        })
            .catch((e) => {
                console.log("err");
            });

        history.push("/digit-ui/citizen/br/response");

        console.log("getting data", Users)

    };

    return (
        <FormComposer
            heading={t("Create Farmer Survey")}
            label={t("ES_COMMON_APPLICATION_SUBMIT")}
            config={configs.map((config) => {
                return {
                    ...config,
                    body: config.body.filter((a) => !a.hideInEmployee),
                };
            })}
            fieldStyle={{ marginRight: 0 }}
        />
    );
};

export default Create;