import React, { useState } from "react";
import {
    FormStep,
    TextInput,
    CardLabel,
    Toast
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";

const WSSewerageConnectionDetails = ({ t, config, userType, onSelect, formData }) => {
    const [proposedWaterClosets, setProposedWaterClosets] = useState(formData?.sewerageConnectionDetails?.proposedWaterClosets || "");
    const [proposedToilets, setProposedToilets] = useState(formData?.sewerageConnectionDetails?.proposedToilets || "");
    const [isDisableForNext, setIsDisableForNext] = useState(false);
    const [showToast, setShowToast] = useState(null);
    const [error, setError] = useState(null);
    let validation = {};

    function onAdd() { }

    function setNumberOfProposedWaterClosets(e) {
        setProposedWaterClosets(e.target.value);
    }

    function setNumberOfProposedToilets(e) {
        setProposedToilets(e.target.value);
    }

    const onSkip = () => onSelect();

    const handleSubmit = () => {

        if ((!(formData?.SewerageConnectionResult && formData?.SewerageConnectionResult?.SewerageConnections?.[0]?.id) || formData?.isModifyConnection) && formData?.serviceName?.code === "SEWERAGE") {
            setIsDisableForNext(true);
            let payload = {};
            if(formData?.isModifyConnection)
            {
              payload = {
                "SewerageConnection":{...formData?.SewerageConnectionResult?.SewerageConnections?.[0],
                  "processInstance": {
                    "action": "INITIATE"
                },
                "channel": "CITIZEN"
                }
              }
            }
            else{
            payload = {
              "SewerageConnection": {
                "water": false,
                "sewerage": true,
                "property": {...formData?.cpt?.details},
                "proposedTaps": null,
                "proposedPipeSize": null,
                "proposedWaterClosets": parseInt(proposedWaterClosets),
                "proposedToilets": parseInt(proposedToilets),
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
                "service": "Sewerage",
                "roadCuttingArea": null,
                "noOfTaps": null,
                "noOfWaterClosets": null,
                "noOfToilets": null,
                "propertyId": formData?.cptId?.id || formData?.cpt?.details?.propertyId,
                "additionalDetails": {
                    "initialMeterReading": null,
                    "detailsProvidedBy": "",
                    "locality": formData?.cpt?.details?.address?.locality?.code,
                },
                "tenantId": formData?.cpt?.details?.tenantId,
                "processInstance": {
                    "action": "INITIATE"
                },
                "channel": "CITIZEN"
            }
            }
          }
      
            Digit.WSService.create(payload, "SEWERAGE")
              .then((result, err) => {
                setIsDisableForNext(false);
                let data = {...formData, SewerageConnectionResult: result, sewerageConnectionDetails : {proposedWaterClosets : proposedWaterClosets, proposedToilets : proposedToilets}  }
                //1, units
                onSelect("", data, "", true);
      
              })
              .catch((e) => {
                setIsDisableForNext(false);
                setShowToast({ key: "error" });
                setError(e?.response?.data?.Errors[0]?.message || null);
              });
          }
          else if ((!(formData?.SewerageConnectionResult && formData?.SewerageConnectionResult?.SewerageConnection?.id) && !(formData?.WaterConnectionResult && formData?.WaterConnectionResult?.WaterConnection?.id) || formData?.isModifyConnection) && formData?.serviceName?.code === "BOTH"){
            setIsDisableForNext(true);
            let payload1 = {};
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
             payload1 = {
                "WaterConnection": {
                  "water": true,
                  "sewerage": true,
                  "property": {...formData?.cpt?.details},
                  "proposedTaps": formData?.waterConectionDetails?.proposedTaps,
                  "proposedPipeSize": formData?.waterConectionDetails?.proposedPipeSize?.code,
                  "proposedWaterClosets": parseInt(proposedWaterClosets),
                  "proposedToilets": parseInt(proposedToilets),
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
                  "service": "Water and Sewerage",
                  "roadCuttingArea": null,
                  "noOfTaps": null,
                  "noOfWaterClosets": null,
                  "noOfToilets": null,
                  "propertyId": formData?.cptId?.id || formData?.cpt?.details?.propertyId,
                  "additionalDetails": {
                      "initialMeterReading": null,
                      "detailsProvidedBy": "",
                      "locality": formData?.cpt?.details?.address?.locality?.code,
                  },
                  "tenantId": formData?.cpt?.details?.tenantId,
                  "processInstance": {
                      "action": "INITIATE"
                  },
                  "channel": "CITIZEN"
              }
              }
            }
              
            let payload2 = {};
            if(formData?.isModifyConnection)
              {
                payload2 = {
                  "SewerageConnection":{...formData?.SewerageConnectionResult?.SewerageConnections?.[0],
                    "processInstance": {
                      "action": "INITIATE"
                  },
                  "channel": "CITIZEN"
                  }
                }
              }
            else{
            payload2 = {
              "SewerageConnection": {
                "water": true,
                "sewerage": true,
                "property": {...formData?.cpt?.details},
                "proposedTaps": formData?.waterConectionDetails?.proposedTaps,
                "proposedPipeSize": formData?.waterConectionDetails?.proposedPipeSize?.code,
                "proposedWaterClosets": parseInt(proposedWaterClosets),
                "proposedToilets": parseInt(proposedToilets),
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
                "service": "Water and Sewerage",
                "roadCuttingArea": null,
                "noOfTaps": null,
                "noOfWaterClosets": null,
                "noOfToilets": null,
                "propertyId": formData?.cptId?.id || formData?.cpt?.details?.propertyId,
                "additionalDetails": {
                    "initialMeterReading": null,
                    "detailsProvidedBy": "",
                    "locality": formData?.cpt?.details?.address?.locality?.code,
                },
                "tenantId": formData?.cpt?.details?.tenantId,
                "processInstance": {
                    "action": "INITIATE"
                },
                "channel": "CITIZEN"
            }
            }
          }

            Digit.WSService.create(payload1, "WATER")
            .then((result1, err) => {
                Digit.WSService.create(payload2, "SEWERAGE")
                .then((result2, err) => {
                  setIsDisableForNext(false);
                  let data = {...formData,WaterConnectionResult: result1, SewerageConnectionResult: result2, sewerageConnectionDetails : {proposedWaterClosets : proposedWaterClosets, proposedToilets : proposedToilets}  }
                  //1, units
                  onSelect("", data, "", true);
        
                })
                .catch((e) => {
                  setIsDisableForNext(false);
                  setShowToast({ key: "error" });
                  setError(e?.response?.data?.Errors[0]?.message || null);
                });
             })
        .catch((e) => {
          setIsDisableForNext(false);
          setShowToast({ key: "error" });
          setError(e?.response?.data?.Errors[0]?.message || null);
        });
          }
          else {
            let details = {};
            details.proposedWaterClosets = proposedWaterClosets;
            details.proposedToilets = proposedToilets;
            onSelect(config.key, details);
          }
    };

    return (
        <div>
            {userType === "citizen" && (<Timeline currentStep={2} />)}
            <FormStep
                t={t}
                config={config}
                onSelect={handleSubmit}
                onSkip={onSkip}
                isDisabled={!proposedWaterClosets || !proposedToilets || isDisableForNext}
                onAdd={onAdd}
            >
                <CardLabel>{t("WS_NO_OF_WATER_CLOSETS")}*</CardLabel>
                <TextInput
                    type={"number"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    t={t}
                    name="proposedWaterClosets"
                    onChange={setNumberOfProposedWaterClosets}
                    value={proposedWaterClosets}
                    {...(validation = {
                        isRequired: true,
                        pattern: "^[1-9]+[0-9]*$",
                        title: t("ERR_DEFAULT_INPUT_FIELD_MSG"),
                    })}
                />
                <CardLabel>{t("WS_SERV_DETAIL_NO_OF_TOILETS")}*</CardLabel>
                <TextInput
                    type={"number"}
                    isMandatory={false}
                    optionKey="i18nKey"
                    t={t}
                    name="proposedToilets"
                    onChange={setNumberOfProposedToilets}
                    value={proposedToilets}
                    {...(validation = {
                        isRequired: true,
                        pattern: "^[1-9]+[0-9]*$",
                        title: t("ERR_DEFAULT_INPUT_FIELD_MSG"),
                    })}
                />
            </FormStep>
            {showToast && <Toast error={showToast?.key === "error" ? true : false} label={error} isDleteBtn={true} onClose={() => { setShowToast(null); setError(null); }} />}
        </div>
    );
}

export default WSSewerageConnectionDetails;