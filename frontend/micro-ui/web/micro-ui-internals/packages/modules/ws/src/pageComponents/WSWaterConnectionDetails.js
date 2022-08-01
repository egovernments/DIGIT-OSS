import { CardLabel, Dropdown, FormStep, Loader, RadioOrSelect, TextInput, Toast } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import Timeline from "../components/Timeline";

const WSWaterConnectionDetails = ({ t, config, userType, onSelect, formData }) => {
  const tenantId = Digit.ULBService.getStateId();
  const [proposedTaps, setProposedTaps] = useState(formData?.waterConectionDetails?.proposedTaps || "");
  const [proposedPipeSize, setProposedPipeSize] = useState(formData?.waterConectionDetails?.proposedPipeSize || "");
  const [isDisableForNext, setIsDisableForNext] = useState(false);
  const [showToast, setShowToast] = useState(null);
  const [error, setError] = useState(null);
  const [proposedPipeSizeList, setProposedPipeSizeList] = useState([]);
  let validation = {};
  const { isLoading: wsServiceCalculationLoading, data: wsServiceCalculation } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSServicesCalculation(tenantId);

  useEffect(() => {
    if (wsServiceCalculation?.PipeSize?.length > 0) {
      let pipeLists = [];
      wsServiceCalculation?.PipeSize?.forEach((type) => {
        pipeLists.push({
          i18nKey: `${type.size} ${t("WS_INCHES_LABEL")}`,
          code: type.size,
          id: type.id,
          size: type.size,
        });
      });
      setProposedPipeSizeList(pipeLists);
    }
  }, [wsServiceCalculation]);

  function onAdd() {}

  function setNumberOfProposedTaps(e) {
    setProposedTaps(e.target.value);
  }

  function setProposedPipeSizeSelect(value) {
    setProposedPipeSize(value);
  }

  const onSkip = () => onSelect();

  const handleSubmit = () => {

    if (!(formData?.WaterConnectionResult && formData?.WaterConnectionResult?.WaterConnection?.[0]?.id) && formData?.serviceName?.code === "WATER" || formData?.isModifyConnection) {
      setIsDisableForNext(true);
      let payload = {};
      if(formData?.isModifyConnection)
      {
        payload = {
          "WaterConnection":{...formData?.WaterConnectionResult?.WaterConnection?.[0],
            "processInstance": {
              "action": "INITIATE"
          },
          "channel": "CITIZEN"
          }
        }
      }
      else{
      payload = {
        "WaterConnection": {
          "water": true,
          "sewerage": false,
          "property": {...formData?.cpt?.details},
          "proposedTaps": proposedTaps,
          "proposedPipeSize": proposedPipeSize?.code,
          "proposedWaterClosets": null,
          "proposedToilets": null,
          "connectionHolders": formData?.ConnectionHolderDetails?.isOwnerSame ? null : [{
            correspondenceAddress: formData?.ConnectionHolderDetails?.address,
            fatherOrHusbandName: formData?.ConnectionHolderDetails?.guardian,
            gender: formData?.ConnectionHolderDetails?.gender?.code,
            mobileNumber: formData?.ConnectionHolderDetails?.mobileNumber,
            name: formData?.ConnectionHolderDetails?.name,
            ownerType: formData?.ConnectionHolderDetails?.specialCategoryType?.code || "NONE",
            relationship: formData?.ConnectionHolderDetails?.relationship?.code,
            sameAsPropertyAddress: false,
          }],
          "service": "Water",
          "roadCuttingArea": null,
          "noOfTaps": null,
          "noOfWaterClosets": null,
          "noOfToilets": null,
          "propertyId": formData?.cptId?.id || formData?.cpt?.details?.propertyId,
          "additionalDetails": {
              "initialMeterReading": null,
              "detailsProvidedBy": "",
              "locality": formData?.cpt?.details?.address?.locality?.code
          },
          "tenantId": formData?.cpt?.details?.tenantId,
          "processInstance": {
              "action": "INITIATE"
          },
          "channel": "CITIZEN"
      }
      }
    }

      Digit.WSService.create(payload, "WATER")
        .then((result, err) => {
          setIsDisableForNext(false);
          let data = {...formData, WaterConnectionResult: result, waterConectionDetails : {proposedTaps : proposedTaps, proposedPipeSize : proposedPipeSize}  }
          //1, units
          onSelect("", data, "", true);

        })
        .catch((e) => {
          setIsDisableForNext(false);
          setShowToast({ key: "error" });
          setError(e?.response?.data?.Errors[0]?.message || null);
        });
    }
    else {
     
    let details = {};
    details.proposedTaps = proposedTaps;
    details.proposedPipeSize = proposedPipeSize;
    onSelect(config.key, details);

    }
  };

  return (
    <div>
      {userType === "citizen" && <Timeline currentStep={2} />}
      {!wsServiceCalculationLoading ? (
        <FormStep t={t} config={config} onSelect={handleSubmit} onSkip={onSkip} isDisabled={!proposedTaps || !proposedPipeSize || isDisableForNext} onAdd={onAdd}>
          <CardLabel>{t("WS_NO_OF_TAPS_PROPOSED")}*</CardLabel>
          <TextInput
            isMandatory={false}
            optionKey="i18nKey"
            t={t}
            name="proposedTaps"
            onChange={setNumberOfProposedTaps}
            value={proposedTaps}
            {...(validation = {
              isRequired: true,
              pattern: "^[1-9]+[0-9]*$",
              title: t("ERR_DEFAULT_INPUT_FIELD_MSG"),
              type: "text",
            })}
          />
          <CardLabel>{t("WS_PROPOSED_PIPE_SIZE")}*</CardLabel>
          <RadioOrSelect
            name="proposedPipeSize"
            options={proposedPipeSizeList}
            selectedOption={proposedPipeSize}
            optionKey="i18nKey"
            onSelect={setProposedPipeSizeSelect}
            t={t}
          />
          {/* <CardLabel>{t("WS_NO_OF_PROPOSED_WATER_CLOSETS")}:</CardLabel>
          <TextInput></TextInput>

          <CardLabel>{t("WS_NO_OF_PROPOSED_TOILETS")}:</CardLabel> */}
        </FormStep>
      ) : (
        <Loader />
      )}
      {showToast && <Toast error={showToast?.key === "error" ? true : false} label={error} isDleteBtn={true} onClose={() => { setShowToast(null); setError(null); }} />}
    </div>
  );
};

export default WSWaterConnectionDetails;
