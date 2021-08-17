import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, LabelFieldPair, Dropdown, CheckBox, LinkButton, Loader } from "@egovernments/digit-ui-react-components";
import { stringReplaceAll } from "../utils";
import Timeline from "../components/Timeline";

const OwnerDetails = ({ t, config, onSelect, userType, formData }) => {
    let validation = {};
    let isedittrade = window.location.href.includes("edit-application");
    let isrenewtrade = window.location.href.includes("renew-trade");
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = tenantId.split(".")[0];
    const [canmovenext, setCanmovenext] = useState(isedittrade || isrenewtrade ? false : true);
    const [ownershipCategoryList, setOwnershipCategoryList] = useState([]);
    const [genderList, setGenderList] = useState([]);
    const [ownershipCategory, setOwnershipCategory] = useState(formData?.owners?.ownershipCategory);
    const [name, setName] = useState(formData?.owners?.name || "");
    const [isPrimaryOwner, setisPrimaryOwner] = useState(false);
    const [gender, setGender] = useState(formData?.owners?.gender);
    const [mobileNumber, setMobileNumber] = useState(formData?.owners?.mobileNumber || "");
    const ismultiple = ownershipCategory?.code.includes("MULTIPLEOWNERS") ? true : false;
    const [fields, setFeilds] = useState(
        (formData?.owners && formData?.owners?.owners) || [{ name: "", gender: "", mobileNumber: null, isPrimaryOwner: true }]
    );

    useEffect(() => {
        fields.map((ob) => {
            if (ob.name && ob.mobileNumber && ob.gender) {
                setCanmovenext(false);
            }
            else {
                setCanmovenext(true);
            }
        })
    }, [fields])

    const { isLoading, data: ownerShipCategories } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["OwnerShipCategory"]);
    const { data: genderTypeData } = Digit.Hooks.obps.useMDMS(stateId, "common-masters", ["GenderType"]);

    useEffect(() => {
        const ownershipCategoryLists = ownerShipCategories?.["common-masters"]?.OwnerShipCategory;
        if (ownershipCategoryLists && ownershipCategoryLists?.length > 0) {
            const finalOwnershipCategoryList = ownershipCategoryLists.filter(data => data?.code?.includes("INDIVIDUAL"));
            finalOwnershipCategoryList.forEach(data => {
                data.i18nKey = `COMMON_MASTERS_OWNERSHIPCATEGORY_${stringReplaceAll(data?.code, ".", "_")}`
            });
            setOwnershipCategoryList(finalOwnershipCategoryList);
        }
    }, [ownerShipCategories]);


    useEffect(() => {
        const gendeTypeMenu = genderTypeData?.["common-masters"]?.GenderType || [];
        if (gendeTypeMenu && gendeTypeMenu?.length > 0) {
            const genderFilterTypeMenu = gendeTypeMenu.filter(data => data.active);
            genderFilterTypeMenu.forEach(data => {
                data.i18nKey = `COMMON_GENDER_${data.code}`;
            });
            setGenderList(genderFilterTypeMenu)
        }
    }, [genderTypeData]);


    function selectedValue(value) {
        setOwnershipCategory(value);
    }

    function handleAdd() {
        const values = [...fields];
        values.push({ name: "", gender: "", mobileNumber: null, isPrimaryOwner: false });
        setFeilds(values);
        setCanmovenext(true);

    }

    function handleRemove(index) {
        const values = [...fields];
        if (values.length != 1) {
            values.splice(index, 1);
            setFeilds(values);
        }

    }

    function setOwnerName(i, e) {
        let units = [...fields];
        units[i].name = e.target.value;
        setName(e.target.value);
        setFeilds(units);
        if (units[i].gender && units[i].mobileNumber && units[i].name) {
            setCanmovenext(false);
        }
    }

    function setGenderName(i, value) {
        let units = [...fields];
        units[i].gender = value;
        setGender(value);
        setFeilds(units);
        if (units[i].gender && units[i].mobileNumber && units[i].name) {
            setCanmovenext(false);
        }
    }
    function setMobileNo(i, e) {
        let units = [...fields];
        units[i].mobileNumber = e.target.value;
        setMobileNumber(e.target.value);
        setFeilds(units);
        if (units[i].gender && units[i].mobileNumber && units[i].name) {
            setCanmovenext(false);
        }
    }
    function setPrimaryOwner(i, e) {
        let units = [...fields];
        units.map((units) => {
            units.isPrimaryOwner = false;
        });
        units[i].isPrimaryOwner = ismultiple ? e.target.checked : true;
        setisPrimaryOwner(e.target.checked);
        setFeilds(units);
    }
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Error Loged", error);
    }, [error]);

    const goNext = () => {
        setError(null);
        if (ismultiple == true && fields.length == 1) {
            setError("TL_ERROR_MULTIPLE_OWNER");
        }
        else {
            debugger;
            let owner = formData.owners;
            let ownerStep;
            ownerStep = { ...owner, owners: fields, ownershipCategory: ownershipCategory };
            onSelect(config.key, ownerStep);
        }
    };

    const onSkip = () => onSelect();

    // if (isLoading) {
    //     return <Loader />
    // }

    return (
        <FormStep config={config} onSelect={goNext} onSkip={onSkip} t={t} isDisabled={canmovenext || !ownershipCategory} forcedError={t(error)}>
            <Timeline currentStep={2} />
            {!isLoading ?
                <div>
                    <div>
                        <CardLabel>{`${t("BPA_TYPE_OF_OWNER_LABEL")}`}</CardLabel>
                        <RadioButtons
                            isMandatory={config.isMandatory}
                            options={ownershipCategoryList}
                            selectedOption={ownershipCategory}
                            optionsKey="i18nKey"
                            onSelect={selectedValue}
                            value={ownershipCategory}
                            labelKey="PT_OWNERSHIP"
                            isDependent={true}
                        />
                    </div>
                    {fields.map((field, index) => {
                        return (
                            <div key={`${field}-${index}`}>
                                <div style={{ border: "solid", borderRadius: "5px", padding: "10px", paddingTop: "20px", marginTop: "10px", borderColor: "#f3f3f3", background: "#FAFAFA" }}>
                                    <CardLabel style={ismultiple ? { marginBottom: "-15px" } : {}}>{`${t("CORE_COMMON_NAME")}`}</CardLabel>
                                    {ismultiple && <LinkButton
                                        label={
                                            <div >
                                                <span>
                                                    <svg style={{ float: "right", position: "relative", bottom: "5px" }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill={!(fields.length == 1) ? "#494848" : "#FAFAFA"} />
                                                    </svg>
                                                </span>
                                            </div>
                                        }
                                        style={{ width: "100px", display: "inline", background: "black" }}
                                        onClick={(e) => handleRemove(index)}
                                    />}
                                    <TextInput
                                        style={ismultiple ? { background: "#FAFAFA" } : {}}
                                        t={t}
                                        type={"text"}
                                        isMandatory={false}
                                        optionKey="i18nKey"
                                        name="name"
                                        value={field.name}
                                        onChange={(e) => setOwnerName(index, e)}
                                        {...(validation = {
                                            isRequired: true,
                                            pattern: "^[a-zA-Z-.`' ]*$",
                                            type: "text",
                                            title: t("TL_NAME_ERROR_MESSAGE"),
                                        })}
                                    />
                                    <CardLabel>{`${t("BPA_APPLICANT_GENDER_LABEL")}`}</CardLabel>
                                    <RadioButtons
                                        t={t}
                                        options={genderList}
                                        optionsKey="code"
                                        name="gender"
                                        value={gender}
                                        selectedOption={field.gender}
                                        onSelect={(e) => setGenderName(index, e)}
                                        isDependent={true}
                                        labelKey="COMMON_GENDER"
                                    />
                                    <CardLabel>{`${t("CORE_COMMON_MOBILE_NUMBER")}`}</CardLabel>
                                    <div className="field-container">
                                        <span className="employee-card-input employee-card-input--front" style={{ marginTop: "-1px" }}>
                                            +91
                                        </span>
                                        <TextInput
                                            style={ismultiple ? { background: "#FAFAFA" } : {}}
                                            type={"text"}
                                            t={t}
                                            isMandatory={false}
                                            optionKey="i18nKey"
                                            name="mobileNumber"
                                            value={field.mobileNumber}
                                            onChange={(e) => setMobileNo(index, e)}
                                            {...(validation = {
                                                isRequired: true,
                                                pattern: "[6-9]{1}[0-9]{9}",
                                                type: "tel",
                                                title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
                                            })}
                                        />
                                    </div>
                                    {ismultiple && (
                                        <CheckBox
                                            label={t("BPA_IS_PRIMARY_OWNER_LABEL")}
                                            onChange={(e) => setPrimaryOwner(index, e)}
                                            value={field.isPrimaryOwner}
                                            checked={field.isPrimaryOwner}
                                            style={{ paddingTop: "10px" }}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {ismultiple ? (
                        <div>
                            <div style={{ display: "flex", paddingBottom: "15px", color: "#FF8C00" }}>
                                <button type="button" style={{ paddingTop: "10px" }} onClick={() => handleAdd()}>
                                    {t("BPA_ADD_OWNER")}
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div> : <Loader />
            }
        </FormStep>
    );
};

export default OwnerDetails;
