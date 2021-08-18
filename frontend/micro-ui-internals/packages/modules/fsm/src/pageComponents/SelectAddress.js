import React, { useEffect, useState } from "react";
import { FormStep, CardLabel, Dropdown, RadioButtons, LabelFieldPair, RadioOrSelect } from "@egovernments/digit-ui-react-components";

const SelectAddress = ({ t, config, onSelect, userType, formData }) => {
  const allCities = Digit.Hooks.fsm.useTenants();
  let tenantId = Digit.ULBService.getCurrentTenantId();

  const { pincode, city } = formData?.address || "";
  const cities =
    userType === "employee"
      ? allCities.filter((city) => city.code === tenantId)
      : pincode
      ? allCities.filter((city) => city?.pincode?.some((pin) => pin == pincode))
      : allCities;

  const [selectedCity, setSelectedCity] = useState(() => formData?.address?.city || null);
  // console.log("find selected locality here", selectedCity)
  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "revenue",
    {
      enabled: !!selectedCity,
    },
    t
  );
  // console.log("find fetchedLocalities here", fetchedLocalities)
  // if (pincode && city) {
  //   const filteredLocalityList = localitiesObj[city?.code].filter((locality) => locality?.pincode?.some((item) => item.toString() == pincode));
  //   localitiesObj[city?.code] = filteredLocalityList.length ? filteredLocalityList : allLocalities[city?.code];
  // }
  const [localities, setLocalities] = useState();
  //   () => {
  //   console.log("find usestate localities here", formData?.address?.pincode, fetchedLocalities)
  // return formData?.address?.pincode ?
  // fetchedLocalities.filter((obj) => obj.pincode?.find((item) => item == formData.address.pincode))
  //  :
  // fetchedLocalities
  // }
  // console.log("find set localities here", localities)
  const [selectedLocality, setSelectedLocality] = useState();

  useEffect(() => {
    if (cities) {
      if (cities.length === 1) {
        setSelectedCity(cities[0]);
      }
    }
  }, [cities]);

  // useEffect(()=>{
  //   console.log("let all know locality is set", selectedLocality)
  // },[selectedLocality])

  useEffect(() => {
    if (selectedCity && fetchedLocalities) {
      let __localityList = fetchedLocalities;
      let filteredLocalityList = [];

      if (formData?.address?.locality) {
        // console.log("find formData inside useEffect", formData?.address)
        setSelectedLocality(formData.address.locality);
      }

      if (formData?.address?.pincode) {
        filteredLocalityList = __localityList.filter((obj) => obj.pincode?.find((item) => item == formData.address.pincode));
        if (!formData?.address?.locality) setSelectedLocality();
      }

      if (userType === "employee") {
        onSelect(config.key, { ...formData[config.key], city: selectedCity });
      }
      setLocalities(() => (filteredLocalityList.length > 0 ? filteredLocalityList : __localityList));
      // console.log("find set localities here", fetchedLocalities, filteredLocalityList.length > 0 ? filteredLocalityList : __localityList )
      if (filteredLocalityList.length === 1) {
        setSelectedLocality(filteredLocalityList[0]);
        if (userType === "employee") {
          onSelect(config.key, { ...formData[config.key], locality: filteredLocalityList[0] });
        }
      }
    }
  }, [selectedCity, formData?.address?.pincode, fetchedLocalities]);

  function selectCity(city) {
    setSelectedLocality(null);
    setLocalities(null);
    setSelectedCity(city);
  }

  function selectLocality(locality) {
    setSelectedLocality(locality);
    if (userType === "employee") {
      onSelect(config.key, { ...formData[config.key], locality: locality });
    }
  }

  function onSubmit() {
    onSelect(config.key, { city: selectedCity, locality: selectedLocality });
  }

  if (userType === "employee") {
    return (
      <div>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">
            {t("MYCITY_CODE_LABEL")}
            {config.isMandatory ? " * " : null}
          </CardLabel>
          <Dropdown
            className="form-field"
            isMandatory
            selected={cities?.length === 1 ? cities[0] : selectedCity}
            disable={cities?.length === 1}
            option={cities}
            select={selectCity}
            optionKey="code"
            t={t}
          />
        </LabelFieldPair>
        <LabelFieldPair>
          <CardLabel className="card-label-smaller">
            {t("CS_CREATECOMPLAINT_MOHALLA")}
            {config.isMandatory ? " * " : null}
          </CardLabel>
          <Dropdown
            className="form-field"
            isMandatory
            selected={selectedLocality}
            option={localities}
            select={selectLocality}
            optionKey="i18nkey"
            t={t}
          />
        </LabelFieldPair>
      </div>
    );
  }
  return (
    <FormStep config={config} onSelect={onSubmit} t={t} isDisabled={selectedLocality ? false : true}>
      <CardLabel>{`${t("MYCITY_CODE_LABEL")} *`}</CardLabel>
      <RadioOrSelect options={cities} selectedOption={selectedCity} optionKey="code" onSelect={selectCity} t={t} />
      {selectedCity && localities && <CardLabel>{`${t("CS_CREATECOMPLAINT_MOHALLA")} *`}</CardLabel>}
      {selectedCity && localities && (
        <RadioOrSelect
          isMandatory={config.isMandatory}
          options={localities}
          selectedOption={selectedLocality}
          optionKey="i18nkey"
          onSelect={selectLocality}
          t={t}
        />
      )}
    </FormStep>
  );
};

export default SelectAddress;
