import { FormComposer, Loader, Dropdown, Localities } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useRouteMatch } from "react-router-dom";
import { newConfig } from "../../config/Create/config";
import _, { create, unset } from "lodash";

const CreatePropertyForm = ({ onSelect, userType, redirectUrl }) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const tenants = Digit.Hooks.pt.useTenants();
  const { t } = useTranslation();
  const [canSubmit, setCanSubmit] = useState(false);
  const defaultValues = { };
  const history = useHistory();
  const match = useRouteMatch();

  const allCities = Digit.Hooks.pt.useTenants()?.sort((a, b) => a?.i18nKey?.localeCompare?.(b?.i18nKey));
  
  const [formValue, setFormValue] = useState();
  const [cityCode, setCityCode] = useState();
  
  // delete
  // const [_formData, setFormData,_clear] = Digit.Hooks.useSessionStorage("store-data",null);
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_MUTATION_SUCCESS_DATA", { });
  const { data: commonFields, isLoading } = Digit.Hooks.pt.useMDMS(Digit.ULBService.getStateId(), "PropertyTax", "CommonFieldsConfig");
  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const onSubmit = async () => {
    if(onSelect) {
      onSelect('cptNewProperty', { property: formValue });
    } else {
      if(userType === 'employee') {
        history.push(`${match.path}/save-property?redirectToUrl=${redirectUrl}`, {
          data: formValue,
        });
      } else {
        history.replace(`/digit-ui/citizen/commonPt/property/citizen-otp`,
          {
            // from: getFromLocation(location.state, searchParams),
            mobileNumber: formValue?.owners?.mobileNumber,
            redirectBackTo: '/digit-ui/citizen/commonPt/property/new-application/save-property',
            redirectData: formValue,
          }
        );
      }
    }
  };

  const onFormValueChange = (setValue, data, formState) => {
    const city = data?.locationDet?.city;
    const locality = data?.locationDet?.locality;

    if (city?.code !== cityCode) {
      setCityCode(city?.code);
    }

    if (!_.isEqual(data, formValue)) {
      // if (data?.city.code !== formValue?.city?.code) setValue("locality", null);
      setFormValue(data);
    }

    if (!locality) {
      setCanSubmit(false);
      return;
    }

    setCanSubmit(true);
  };

  return (
    <FormComposer
      onSubmit={onSubmit}
      noBoxShadow
      inline
      config={newConfig}
      label={t('SUBMIT')}
      heading={t('CREATE_PROP_ON_NEW_CONN')}
      text={t('CREATE_PROP_ON_NEW_CONN')}
      headingStyle={{ fontSize: "32px", marginBottom: "16px", fontFamily: "Roboto Condensed,sans-serif" }}
      // headingStyle={{ fontSize: "32px", marginBottom: "16px" }}
      isDisabled={!canSubmit}
      onFormValueChange={onFormValueChange}
    />
  );
};

export default CreatePropertyForm;
