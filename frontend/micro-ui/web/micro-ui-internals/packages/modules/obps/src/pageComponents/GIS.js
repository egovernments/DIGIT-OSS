import React, { useState } from "react";
import { LocationSearchCard, LinkButton, Card } from "@egovernments/digit-ui-react-components";

const GIS = ({ t, config, onSelect, formData = {},handleRemove,onSave }) => {
  const [pincode, setPincode] = useState(formData?.address?.pincode || "");
  const [geoLocation, setGeoLocation] = useState(formData?.address?.geoLocation || {});
  const tenants = Digit.Hooks.obps.useTenants();
  const [pincodeServicability, setPincodeServicability] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  let Webview = !Digit.Utils.browser.isMobile();
  const onSkip = () => onSelect();
  const onChange = (code, location, place) => {
    setPincodeServicability(null);
    const foundValue = tenants?.find((obj) => obj.pincode?.find((item) => item == code));
    if (!foundValue) {
      setPincodeServicability("BPA_COMMON_PINCODE_NOT_SERVICABLE");
      setPincode("");
      setGeoLocation({});
      setPlaceName("");
    } else {
      setPincode(code);
      setGeoLocation(location);
      setPlaceName(place);
    }
  };

  return (
    <div style={{position:"fixed",background:"#00000050",width:"100%",height:"100vh",top:"0",left:"0"}}>
    <div style={{position:"relative",marginTop:"60px"}}>
    {/* <svg style={{float:"left", position:"relative",bottom:"32px",marginTop:Webview?"62px":"57px",marginLeft:Webview?"26%":"20px"}} width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.9999 9.66666C12.0533 9.66666 9.66658 12.0533 9.66658 15C9.66658 17.9467 12.0533 20.3333 14.9999 20.3333C17.9466 20.3333 20.3333 17.9467 20.3333 15C20.3333 12.0533 17.9466 9.66666 14.9999 9.66666ZM26.9199 13.6667C26.3066 8.10666 21.8933 3.69333 16.3333 3.07999V0.333328H13.6666V3.07999C8.10658 3.69333 3.69325 8.10666 3.07992 13.6667H0.333252V16.3333H3.07992C3.69325 21.8933 8.10658 26.3067 13.6666 26.92V29.6667H16.3333V26.92C21.8933 26.3067 26.3066 21.8933 26.9199 16.3333H29.6666V13.6667H26.9199ZM14.9999 24.3333C9.83992 24.3333 5.66658 20.16 5.66658 15C5.66658 9.83999 9.83992 5.66666 14.9999 5.66666C20.1599 5.66666 24.3333 9.83999 24.3333 15C24.3333 20.16 20.1599 24.3333 14.9999 24.3333Z" fill="#505A5F"/>
            </svg> */}
    <div style={Webview?{marginLeft:"25%", marginRight:"25%"}:{}}>
    <LocationSearchCard
      style={{position:"relative",marginTop:"100px",marginBottom:"-100px"}}
      header={t("BPA_GIS_LABEL")}
      cardText={t("")}
      nextText={t("BPA_PIN_LOCATION_LABEL")}
      //skipAndContinueText={t("CORE_COMMON_SKIP_CONTINUE")}
      skip={onSkip}
      t={t}
      position={geoLocation}
      //onSave={() => onSelect("address", { geoLocation, pincode })}
      //onSave={() => selectPincode(pincode)}
      onSave={() => onSave(geoLocation,pincode,placeName)}
      onChange={(code, location, place) => onChange(code, location, place)}
      disabled={pincode === ""}
      forcedError={t(pincodeServicability)}
      isPlaceRequired={true}
      handleRemove={handleRemove}
      Webview={Webview}
      isPopUp={true}
    />
    </div>
    </div>
    </div>
  );
};

export default GIS;
