import React, { useState } from "react";
import { FormStep, LabelFieldPair, CardLabel, Loader } from "@egovernments/digit-ui-react-components";
import Timeline from "../../components/Timeline";

const PropertyDetails = ({ t, config, onSelect, userType, formData }) => {
  const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code;

  const { 
    isLoading,
    isError,
    error,
    data: propertyDetails
  } = Digit.Hooks.pt.usePropertySearch(
    { 
      filters: 
      { propertyIds: formData?.cptId?.id }, tenantId: tenantId 
    }, 
    { filters: 
      { propertyIds: formData?.cptId?.id }, tenantId: tenantId 
    }
  );

  const onSkip = () => onSelect();

  const goNext = () => {
    sessionStorage.setItem("cpt", propertyDetails?.Properties[0]);
    onSelect('cpt', {details: propertyDetails?.Properties[0]});
  }

  let propertyAddress = '';
  if(propertyDetails && propertyDetails?.Properties.length){
    if(propertyDetails?.Properties[0]?.address?.doorNo) {
      propertyAddress += propertyDetails?.Properties[0]?.address?.doorNo;
      if(propertyDetails?.Properties[0]?.address?.street) {
        propertyAddress += ', ';
      }
    }
    if(propertyDetails?.Properties[0]?.address?.street) {
      propertyAddress += propertyDetails?.Properties[0]?.address?.street;
      if(propertyDetails?.Properties[0]?.address?.landmark) {
        propertyAddress += ', ';
      }
    }
    if(propertyDetails?.Properties[0]?.address?.landmark) {
      propertyAddress += propertyDetails?.Properties[0]?.address?.landmark;
      if(propertyDetails?.Properties[0]?.address?.locality?.code) {
        propertyAddress += ', ';
      }
    }
    if(propertyDetails?.Properties[0]?.address?.locality?.code) {
      propertyAddress += propertyDetails?.Properties[0]?.address?.locality?.code && t(Digit.Utils.pt.getMohallaLocale(propertyDetails?.Properties[0]?.address?.locality?.code,propertyDetails?.Properties[0]?.tenantId));
      if(propertyDetails?.Properties[0]?.address?.city) {
        propertyAddress += ', ';
      }
    }
    if(propertyDetails?.Properties[0]?.address?.city) {
      propertyAddress += propertyDetails?.Properties[0]?.tenantId&& t(Digit.Utils.pt.getCityLocale(propertyDetails?.Properties[0]?.tenantId));
      if(propertyDetails?.Properties[0]?.address?.pincode) {
        propertyAddress += ', ';
      }
    }
    if(propertyDetails?.Properties[0]?.address?.pincode) {
      propertyAddress += propertyDetails?.Properties[0]?.address?.pincode;
    }
  }

  if(isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      {userType === "citizen" && (<Timeline currentStep={2} businessService={"WS"} />)}
      <FormStep t={t} config={config} onSelect={goNext} onSkip={onSkip}>
       {
          propertyDetails && propertyDetails?.Properties.length && (
            <React.Fragment>
              <header className="card-section-header" style={{marginBottom: 0, marginTop: '20px'}}>{t('PT_DETAILS')}</header>
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{`${t(`PROPERTY_ID`)}:`}</CardLabel>
                <div className="field">
                  <p>{propertyDetails?.Properties[0]?.propertyId}</p>
                </div>
              </LabelFieldPair>
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{`${t(`OWNER_NAME`)}:`}</CardLabel>
                <div className="field">
                  <p>{propertyDetails?.Properties[0]?.owners[0]?.name}</p>
                </div>
              </LabelFieldPair>
              <LabelFieldPair>
                <CardLabel className="card-label-smaller">{`${t(`PROPERTY_ADDRESS`)}:`}</CardLabel>
                <div className="field">
                  <p>{propertyAddress}</p>
                </div>
              </LabelFieldPair>

              <button
                className="submit-bar"
                type="button"
                style={{color:"white"}}
                onClick={goNext}
              >
                {`${t("CS_COMMON_NEXT")}`}
              </button>
            </React.Fragment>
          )
        }
      </FormStep>
    </React.Fragment>
  );
};
export default PropertyDetails;
