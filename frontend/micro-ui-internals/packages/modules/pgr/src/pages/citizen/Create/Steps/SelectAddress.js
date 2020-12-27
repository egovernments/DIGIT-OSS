import React, { useEffect, useState } from "react";
import { CardLabel, Dropdown, FormStep } from "@egovernments/digit-ui-react-components";

const SelectAddress = ({ t, config, onSelect, value }) => {
  const cities = Digit.Hooks.pgr.useTenants();
  // const city_complaint = Digit.SessionStorage.get("city_complaint");
  // const locality_complaint = Digit.SessionStorage.get("locality_complaint");
  // const selected_localities = Digit.SessionStorage.get("selected_localities");
  const [selectedCity, setSelectedCity] = useState(() => {
    const { city_complaint } = value;
    return city_complaint ? city_complaint : null;
  });
  const [localities, setLocalities] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(() => {
    const { locality_complaint } = value;
    return locality_complaint ? locality_complaint : null;
  });
  // const [selectedLocality, setSelectedLocality] = useState(locality_complaint ? locality_complaint : null);
  //   const __localities = useLocalities({ city: selectedCity });

  useEffect(async () => {
    if (selectedCity) {
      let response = await Digit.LocationService.getLocalities({ tenantId: selectedCity.code });
      let __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
      // console.log("address __localityList", __localityList);
      setLocalities(__localityList);
      // Digit.SessionStorage.set("selected_localities", __localityList);
    }
  }, [selectedCity]);

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
    // Digit.SessionStorage.set("city_complaint", city);
  }

  function selectLocality(locality) {
    setSelectedLocality(locality);
    // Digit.SessionStorage.set("locality_complaint", locality);
  }

  function onSubmit() {
    // const { code: cityCode, name: city } = selectedCity;
    // const { code: localityCode, name: localityName } = selectedLocality;
    onSelect({ city_complaint: selectedCity, locality_complaint: selectedLocality });
    // onSelect({
    //   cityCode,
    //   city,
    //   district: city,
    //   region: city,
    //   localityCode,
    //   localityName,
    //   state: 'Punjab'
    // });
  }

  return (
    <FormStep config={config} onSelect={onSubmit} t={t}>
      <CardLabel>{t("MYCITY_CODE_LABEL")}</CardLabel>
      <Dropdown isMandatory selected={selectedCity} option={cities} select={selectCity} optionKey="code" t={t} />
      {selectedCity && localities && <CardLabel>{t("CS_CREATECOMPLAINT_MOHALLA")}</CardLabel>}
      {selectedCity && localities && (
        <Dropdown isMandatory selected={selectedLocality} optionKey="code" option={localities} select={selectLocality} t={t} />
      )}
    </FormStep>
  );
};

export default SelectAddress;
