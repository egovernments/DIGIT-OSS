import React, { useState } from "react";
import {
    FormStep,
    RadioOrSelect,
    CardLabel,
    TextInput,
    MobileNumber,
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";

const WSPlumberPreference = ({ t, config, onSelect, userType, formData }) => {

    const [plumberPreference, setPlumberPreference] = useState(formData?.plumberPreference?.plumberPreference || {
        i18nKey: "WS_I_WOULD_PREFER_FROM_MUNICIPAL_OFFICE",
        code: "ULB"
    });
    const [licenseNo, setlicenseNo] = useState(formData?.plumberPreference?.licenseNo || "");
    const [plumberName, setPlumberName] = useState(formData?.plumberPreference?.plumberName || "");
    const [plumberMobileNumber, setplumberMobileNumber] = useState(formData?.plumberPreference?.plumberMobileNumber || "");
    let validation = {}

    const plumberPreferenceList = [
        {
            i18nKey: "WS_I_WOULD_PREFER_FROM_MUNICIPAL_OFFICE",
            code: "ULB"
        },
        {
            i18nKey: "WS_I_WILL_ARRAGE_THE_PLUMBER_MYSELF",
            code: "Self"
        }
    ];

    function onAdd() { }

    function onPlumberPreferenceSelect(value) {
        setPlumberPreference(value);
    }

    function SelectlicenseNo(e) {
        setlicenseNo(e.target.value);
      }

    function SelectPlumberName(e) {
        setPlumberName(e.target.value);
      }
    
    function setMobileNo(e) {
        setplumberMobileNumber(e.target.value);
      }

    const onSkip = () => onSelect();

    const handleSubmit = () => {
        let plumberDetails = {
            plumberPreference : plumberPreference,
            licenseNo : licenseNo,
            plumberName : plumberName,
            plumberMobileNumber : plumberMobileNumber,
        }
        onSelect(config.key, plumberDetails);
    };

    return (
        <div>
            {userType === "citizen" && (<Timeline currentStep={2} />)}
            <FormStep
                t={t}
                config={config}
                onSelect={handleSubmit}
                onSkip={onSkip}
                isDisabled={!plumberPreference}
                onAdd={onAdd}
            >
                <RadioOrSelect
                    name="plumberPreference"
                    options={plumberPreferenceList}
                    selectedOption={plumberPreference}
                    optionKey="i18nKey"
                    onSelect={onPlumberPreferenceSelect}
                    t={t}
                />
                {plumberPreference && plumberPreference?.code === "Self" && <div
                  style={{
                    border: "solid",
                    borderRadius: "5px",
                    padding: "10px",
                    paddingTop: "20px",
                    marginTop: "10px",
                    borderColor: "#f3f3f3",
                    background: "#FAFAFA",
                  }}
                >
                    <CardLabel>{`${t("WS_PLUMBER_LICENSE_NO")}*`}</CardLabel>
                        <TextInput
                        t={t}
                        type={"text"}
                        style={{background:"#FAFAFA"}}
                        isMandatory={false}
                        optionKey="i18nKey"
                        name="licenseNo"
                        value={licenseNo}
                        onChange={SelectlicenseNo}
                        />
                    <CardLabel>{`${t("WS_PLUMBER_NAME")}*`}</CardLabel>
                        <TextInput
                        t={t}
                        type={"text"}
                        style={{background:"#FAFAFA"}}
                        isMandatory={false}
                        optionKey="i18nKey"
                        name="plumberName"
                        value={plumberName}
                        onChange={SelectPlumberName}
                        //disable={name && !isOpenLinkFlow ? true : false}
                        {...(validation = {
                            isRequired: true,
                            pattern: "^[a-zA-Z-.`' ]*$",
                            type: "text",
                            title: t("WS_NAME_ERROR_MESSAGE"),
                        })}
                        />
                    <CardLabel>{`${t("WS_PLUMBER_MOBILE_NO")}*`}</CardLabel>
                        <MobileNumber
                        value={plumberMobileNumber}
                        name="plumberMobileNumber"
                        onChange={(value) => setMobileNo({ target: { value } })}
                        style={{background:"#FAFAFA"}}
                        //disable={mobileNumber && !isOpenLinkFlow ? true : false}
                        {...{ required: true, pattern: "[6-9]{1}[0-9]{9}", type: "tel", title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID") }}
                        />
                </div>}
            </FormStep>
        </div>
    );
}

export default WSPlumberPreference;