import React, { useEffect, useState } from "react";
import { CardLabel, Dropdown, FormStep } from "@egovernments/digit-ui-react-components";
import useTenants from "../../../../hooks/useTenants";

const SelectAddress = ({ t, config, onSelect }) => {
  const cities = useTenants();

  const city_complaint = Digit.SessionStorage.get("city_complaint");
  const locality_complaint = Digit.SessionStorage.get("locality_complaint");
  const selected_localities = Digit.SessionStorage.get("selected_localities");
  const [selectedCity, setSelectedCity] = useState(city_complaint ? city_complaint : null);
  const [localities, setLocalities] = useState(selected_localities ? selected_localities : null);
  const [selectedLocality, setSelectedLocality] = useState(locality_complaint ? locality_complaint : null);
  //   const __localities = useLocalities({ city: selectedCity });

  useEffect(async () => {
    if (selectedCity !== city_complaint) {
      let response = await Digit.LocationService.getLocalities({ tenantId: selectedCity.code || city_complaint.code });
      let __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
      console.log("address __localityList", __localityList);
      setLocalities(__localityList);
      Digit.SessionStorage.set("selected_localities", __localityList);
    }
  }, [selectedCity]);

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
    Digit.SessionStorage.set("city_complaint", city);
  }

  function selectLocality(locality) {
    setSelectedLocality(locality);
    Digit.SessionStorage.set("locality_complaint", locality);
  }

  function onSubmit() {
    onSelect({ locality: selectedLocality, city: selectedCity });
  }

  return (
    <FormStep config={config} onSelect={onSubmit} t={t}>
      <CardLabel>{t("MYCITY_CODE_LABEL")}</CardLabel>
      <Dropdown isMandatory selected={selectedCity} option={cities} select={selectCity} optionKey="name" />
      {selectedCity && localities && <CardLabel>{t("CS_CREATECOMPLAINT_MOHALLA")}</CardLabel>}
      {selectedCity && localities && (
        <Dropdown isMandatory selected={selectedLocality} optionKey="code" option={localities} select={selectLocality} t={t} />
      )}
    </FormStep>
  );
};

export default SelectAddress;
