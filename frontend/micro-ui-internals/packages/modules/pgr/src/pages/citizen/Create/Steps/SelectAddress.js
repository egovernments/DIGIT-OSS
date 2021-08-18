import React, { useEffect, useState, useRef } from "react";
import { CardLabel, Dropdown, FormStep, RadioButtons } from "@egovernments/digit-ui-react-components";

const SelectAddress = ({ t, config, onSelect, value }) => {
  const allCities = Digit.Hooks.pgr.useTenants();
  const cities = value?.pincode ? allCities.filter((city) => city?.pincode?.some((pin) => pin == value["pincode"])) : allCities;
  // console.log("find cities here", cities.filter(city => city.pincode.some( pin => pin == value["pincode"])),value["pincode"], cities );
  // const localitiesObj = useSelector((state) => state.common.localities);

  // const city_complaint = Digit.SessionStorage.get("city_complaint");
  // const locality_complaint = Digit.SessionStorage.get("locality_complaint");
  // const selected_localities = Digit.SessionStorage.get("selected_localities");
  const [selectedCity, setSelectedCity] = useState(() => {
    const { city_complaint } = value;
    return city_complaint ? city_complaint : null;
  });
  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    selectedCity?.code,
    "admin",
    {
      enabled: !!selectedCity,
    },
    t
  );
  const [localities, setLocalities] = useState(null);
  // console.log("find localities here", localities);

  const [selectedLocality, setSelectedLocality] = useState(() => {
    const { locality_complaint } = value;
    return locality_complaint ? locality_complaint : null;
  });

  // const [selectedLocality, setSelectedLocality] = useState(locality_complaint ? locality_complaint : null);
  //   const __localities = useLocalities({ city: selectedCity });

  useEffect(() => {
    if (selectedCity && fetchedLocalities) {
      // console.log("find the selected city data here", selectedCity, value, fetchedLocalities)
      //let response = await Digit.LocationService.getLocalities({ tenantId: selectedCity.code });
      //let __localityList = Digit.LocalityService.get(response.TenantBoundary[0]);
      // console.log("find pincode here", pincode, "find localities", localitiesObj[city_complaint.code].filter( city => city["pincode"] == pincode ))
      const { pincode } = value;
      let __localityList = pincode ? fetchedLocalities.filter((city) => city["pincode"] == pincode) : fetchedLocalities;
      // console.log("address __localityList", __localityList);
      setLocalities(__localityList);
      // Digit.SessionStorage.set("selected_localities", __localityList);
    }
  }, [selectedCity, fetchedLocalities]);

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
    <FormStep config={config} onSelect={onSubmit} t={t} isDisabled={selectedLocality ? false : true}>
      <div>
        <CardLabel>{t("MYCITY_CODE_LABEL")}</CardLabel>
        {cities?.length < 5 ? (
          <RadioButtons selectedOption={selectedCity} options={cities} optionsKey="name" onSelect={selectCity} />
        ) : (
          <Dropdown isMandatory selected={selectedCity} option={cities} select={selectCity} optionKey="i18nKey" t={t} />
        )}
        {selectedCity && localities && <CardLabel>{t("CS_CREATECOMPLAINT_MOHALLA")}</CardLabel>}
        {selectedCity && localities && (
          <React.Fragment>
            {localities?.length < 5 ? (
              <RadioButtons selectedOption={selectedLocality} options={localities} optionsKey="name" onSelect={selectLocality} />
            ) : (
              <Dropdown isMandatory selected={selectedLocality} optionKey="i18nkey" option={localities} select={selectLocality} t={t} />
            )}
          </React.Fragment>
        )}
      </div>
    </FormStep>
  );
};

export default SelectAddress;
