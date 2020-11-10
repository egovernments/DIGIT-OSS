import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardSubHeader,
  CardText,
  CardLabel,
  Dropdown,
  SubmitBar,
  // RadioButtons,
} from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchLocalities } from "../../redux/actions";
import { useTranslation } from "react-i18next";

const Address = (props) => {
  const SessionStorage = Digit.SessionStorage;
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const [rerender, setRerender] = useState(1);
  const appState = useSelector((state) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const cities = [];
  var localities = [];

  useEffect(()=>{
    if(SessionStorage.get("city_complaint")){
      setSelectedCity(SessionStorage.get("city_complaint"));
    }
  },[])

  useEffect(() => {
    appState.cities.map((city) => cities.push(city.name));
    if (appState.localities.localityList) {
      appState.localities.localityList.map((locality) =>
        localities.push(locality.name)
      );
    }
    // if (appState.localities.city) {
    //   setSelectedCity(appState.localities.city);
    // }
  }, [localities, cities]);

  async function selectCity(city) {
    setSelectedCity(city)
    const SessionStorage = Digit.SessionStorage;
    SessionStorage.set("city_complaint",city);
    await dispatch(fetchLocalities(city));
  }
  function selectLocalities(locality) {
    let localityDetails = appState.localities.localityList.find(
      (o) => o.name === locality
    );
    setSelectedLocality(localityDetails);
  }

  function save() {
    props.save(selectedCity, selectedLocality);
  }
  return (
    <Card>
      <CardSubHeader>{t("CS_ADDCOMPLAINT_COMPLAINT_LOCATION")}</CardSubHeader>
      <CardHeader>{t("CS_ADDCOMPLAINT_PROVIDE_COMPLAINT_ADDRESS")}</CardHeader>
      <CardText>
        {/* Choose the locality/mohalla of the complaint from the list given below. */}
        {t("CS_CHOOSE_CITY_MOHALLA_TEXT")}
      </CardText>
      <CardLabel>{t("MYCITY_CODE_LABEL")} *</CardLabel>
      <Dropdown
        isMandatory
        selected={selectedCity}
        option={cities}
        select={selectCity}
      />
      <CardLabel>{t("CS_CREATECOMPLAINT_MOHALLA")} *</CardLabel>
      {/* <RadioButtons options={["Ajit Nagar", "Patel Nagar"]}/> */}
      <Dropdown isMandatory option={localities} select={selectLocalities} />
      <Link to="/create-complaint/landmark" onClick={save}>
        <SubmitBar label={t("PT_COMMONS_NEXT")} />
      </Link>
      {/* <p onClick={() =>console.log(selectedCity, selectedLocality)}>state display</p> */}
    </Card>
  );
};

export default Address;
