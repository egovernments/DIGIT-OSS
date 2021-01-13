import React, { useEffect, useState, Fragment } from "react";
import { FormStep, CardLabel, Dropdown } from "@egovernments/digit-ui-react-components";
import { useSelector } from "react-redux";

const SelectAddress = ({ t, config, onSelect, value }) => {
  const cities = Digit.Hooks.fsm.useTenants();
  const localitiesObj = useSelector((state) => state.common.localities);
  const [selectedCity, setSelectedCity] = useState(() => {
    const { city_complaint } = value;
    return city_complaint ? city_complaint : null;
  });
  const [localities, setLocalities] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(() => {
    const { locality_complaint } = value;
    return locality_complaint ? locality_complaint : null;
  });

  useEffect(() => {
    if (selectedCity) {
      let __localityList = localitiesObj[selectedCity.code];
      let filteredLocalityList = [];
      if (value.pincode) {
        filteredLocalityList = __localityList.filter((obj) => obj.pincode?.find((item) => item == value.pincode));
      }
      setLocalities(() => (filteredLocalityList.length > 0 ? filteredLocalityList : __localityList));
    }
  }, [selectedCity, value.pincode]);

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
  }

  function selectLocality(locality) {
    setSelectedLocality(locality);
  }

  function onSubmit() {
    onSelect({ city_complaint: selectedCity, locality_complaint: selectedLocality });
  }

  return (
    <FormStep config={config} onSelect={onSubmit} t={t} isDisabled={selectedLocality ? false : true}>
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
