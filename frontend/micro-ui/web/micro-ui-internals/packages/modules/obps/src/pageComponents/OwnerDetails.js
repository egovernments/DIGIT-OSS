import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CardLabel, RadioButtons, RadioOrSelect, LabelFieldPair, Dropdown, CheckBox, LinkButton, Loader, Toast, SearchIcon, DeleteIcon } from "@egovernments/digit-ui-react-components";
import { stringReplaceAll, getPattern, convertDateTimeToEpoch, convertDateToEpoch } from "../utils";
import Timeline from "../components/Timeline";
import cloneDeep from "lodash/cloneDeep";
import { getDocShareholding } from "../pages/citizen/NewLicense/docView/docView.help";
import Visibility from "@mui/icons-material/Visibility";
import FileUpload from "@mui/icons-material/FileUpload";
import axios from "axios";
import Spinner from "../components/Loader";
import CusToaster from "../components/Toaster";
import { useForm } from "react-hook-form";

const OwnerDetails = ({ t, config, onSelect, userType, formData }) => {
    let validation = {};
    sessionStorage.removeItem("currentPincode");
    let isedittrade = window.location.href.includes("edit-application");
    let isrenewtrade = window.location.href.includes("renew-trade");
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const stateId = Digit.ULBService.getStateId();
    const [canmovenext, setCanmovenext] = useState(isedittrade || isrenewtrade ? false : true);
    const [ownershipCategoryList, setOwnershipCategoryList] = useState([]);
    const [genderList, setGenderList] = useState([]);
    const [ownershipCategory, setOwnershipCategory] = useState(formData?.owners?.ownershipCategory);
    const [name, setName] = useState(formData?.owners?.name || "");
    const [isPrimaryOwner, setisPrimaryOwner] = useState(false);
    const [gender, setGender] = useState(formData?.owners?.gender);
    const [mobileNumber, setMobileNumber] = useState(formData?.owners?.mobileNumber || "");
    const [showToast, setShowToast] = useState(null);
    const [isDisable, setIsDisable] = useState(false);
    let Webview = !Digit.Utils.browser.isMobile();
    const ismultiple = ownershipCategory?.code.includes("MULTIPLEOWNERS") ? true : false;
    const [fields, setFeilds] = useState(
        (formData?.owners && formData?.owners?.owners) || [{ name: "", gender: "", mobileNumber: null, isPrimaryOwner: true }]
    );
    const [email, setEmail] = useState("");

    useEffect(() => {
        var flag = 0;
        fields.map((ob) => {
            if (ob.isPrimaryOwner)
                flag = 1;
            if (ob.name && ob.mobileNumber && ob.gender) {
                setCanmovenext(false);
            }
            else {
                setCanmovenext(true);
            }
        })
        if (!canmovenext && ownershipCategory && !(ownershipCategory?.code.includes("SINGLEOWNER"))) {
            if (flag == 1)
                setCanmovenext(false);
            else
                setCanmovenext(true);
        }
    }, [fields])

    useEffect(() => {
        const values = cloneDeep(fields);
        if (ownershipCategory && !ismultiple && values?.length > 1) setFeilds([{ ...values[0], isPrimaryOwner: true }]);
    }, [ownershipCategory])

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

    // useEffect(() => {
    //     if(showToast) {
    //         setTimeout(closeToast, 5000);
    //     }
    // },[showToast]);

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
            if (values.length == 1) {
                values[0] = { ...values[0], isPrimaryOwner: true }
            }
            setFeilds(values);
        }

    }

    function setOwnerName(i, e) {
        let units = [...fields];
        units[i].name = e.target.value;
        setName(e.target.value);
        setFeilds(units);
        if (units[i].gender && units[i].mobileNumber && units[i].name && units[i].email) {
            setCanmovenext(false);
        }
    }

    function setOwnerEmail(i, e) {
        let units = [...fields];
        units[i].email = e.target.value;
        setEmail(e.target.value);
        setFeilds(units);
        if (units[i].gender && units[i].mobileNumber && units[i].name && units[i].email) {
            console.log("log12345...",units, canmovenext )
            setCanmovenext(false);
        }
    }

    function setGenderName(i, value) {
        let units = [...fields];
        units[i].gender = value;
        setGender(value);
        setFeilds(units);
        if (units[i].gender && units[i].mobileNumber && units[i].name && units[i].email) {
            setCanmovenext(false);
        }
    }
    function setMobileNo(i, e) {
        let units = [...fields];
        units[i].mobileNumber = e.target.value;
        setMobileNumber(e.target.value);
        setFeilds(units);
        if (units[i].gender && units[i].mobileNumber && units[i].name && units[i].email) {
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


    function getusageCategoryAPI(arr) {
        let usageCat = ""
        console.log("wfwefwefwefwef0",arr)
        arr?.map((ob, i) => {
            usageCat = usageCat + (i !== 0 ? "," : "") + ob.code;
        });
        return usageCat;
    }

    function getUnitsForAPI(subOccupancyData) {
        const ob = subOccupancyData?.subOccupancy?.subOccupancy;
        const blocksDetails = subOccupancyData?.data?.edcrDetails?.planDetail?.blocks || [];
        let units = [];
        if (ob) {
            let result = Object.entries(ob);
            console.log("resultsssssss",result,ob)
            result?.map((unit, index) => {
                units.push({
                    blockIndex: index,
                    floorNo: unit[0].split("_")[1],
                    unitType: "Block",
                    occupancyType: blocksDetails?.[index]?.building?.occupancies?.[0]?.typeHelper?.type?.code || "A",
                    usageCategory: getusageCategoryAPI(unit[1]),
                });
            })
        }
        return units;
    }

    function getBlockIds(arr) {
        let blockId = {};
        arr.map((ob, ind) => {
            blockId[`Block_${ob.floorNo}`] = ob.id;
        });
        return blockId;
    }

    const closeToast = () => {
        setShowToast(null);
    };

    const getOwnerDetails = async (indexValue, eData) => {
        const ownersCopy = cloneDeep(fields);
        const ownerNo = ownersCopy?.[indexValue]?.mobileNumber || "";
        setShowToast(null);


        if (!ownerNo.match(getPattern("MobileNo"))) {
            setShowToast({ key: "true", error: true, message: "ERR_MOBILE_NUMBER_INCORRECT" });
            return;
        }

        if (ownerNo === ownersCopy?.[indexValue]?.userName) {
            setShowToast({ key: "true", error: true, message: "ERR_OWNER_ALREADY_ADDED_TOGGLE_MSG" });
            return;
        }

        const matchingOwnerIndex = ownersCopy.findIndex(item => item.userName === ownerNo);

        if (matchingOwnerIndex > -1) {
            setShowToast({ key: "true", error: true, message: "ERR_OWNER_ALREADY_ADDED" });
            return;
        } else {
            const usersResponse = await Digit.UserService.userSearch(Digit.ULBService.getStateId(), { userName: fields?.[indexValue]?.mobileNumber }, {});
            if (usersResponse?.user?.length === 0) {
                setShowToast({ key: "true", warning: true, message: "ERR_MOBILE_NUMBER_NOT_REGISTERED" });
                return;
            } else {
                const userData = usersResponse?.user?.[0];
                userData.gender = userData.gender ? { code: userData.gender, active: true, i18nKey: `COMMON_GENDER_${userData.gender}` } : "";
                if (userData?.dob) userData.dob = convertDateToEpoch(userData?.dob);
                if (userData?.createdDate) {
                    userData.createdDate = convertDateTimeToEpoch(userData?.createdDate);
                    userData.lastModifiedDate = convertDateTimeToEpoch(userData?.lastModifiedDate);
                    userData.pwdExpiryDate = convertDateTimeToEpoch(userData?.pwdExpiryDate);
                }

                let values = [...ownersCopy];
                if (values[indexValue]) { values[indexValue] = userData; values[indexValue].isPrimaryOwner = fields[indexValue]?.isPrimaryOwner || false; }
                setFeilds(values);
                if (values[indexValue]?.mobileNumber && values[indexValue]?.name && values[indexValue]?.gender?.code) setCanmovenext(true);
                else setCanmovenext(false);
            }
        }
    }

    const goNext = () => {
        setError(null);
        console.log("log12345...", formData)
        if (ismultiple == true && fields.length == 1) {
            window.scrollTo(0, 0);
            setError("BPA_ERROR_MULTIPLE_OWNER");
        }
        else {
            let owner = formData.owners;
            let ownerStep;
            ownerStep = { ...owner, owners: fields, ownershipCategory: ownershipCategory, documents: getValues() };
            console.log("log12345...123", ownerStep,getValues(),formData,!formData?.id)

            if (!formData?.id) {
                setIsDisable(true);
                //for owners conversion
                let conversionOwners = [];
                ownerStep?.owners?.map(owner => {
                    conversionOwners.push({
                        ...owner,
                        name: owner.name,
                        mobileNumber: owner.mobileNumber,
                        isPrimaryOwner: owner.isPrimaryOwner,
                        gender: owner.gender.code,
                        fatherOrHusbandName: "NAME"
                    })
                });
                let payload = {};
                payload.edcrNumber = formData?.edcrNumber?.edcrNumber ? formData?.edcrNumber?.edcrNumber : formData?.data?.scrutinyNumber?.edcrNumber;
                payload.riskType = formData?.riskType || formData?.subOccupancy?.riskType ;
                payload.applicationType = formData?.data?.applicationType || formData?.applicationType;
                payload.serviceType = formData?.data?.serviceType || formData?.serviceType;

                const userInfo = Digit.UserService.getUser();
                const accountId = userInfo?.info?.uuid;
                payload.tenantId = formData?.address?.city?.code;
                payload.workflow = { action: "INITIATE" };
                payload.accountId = accountId;
                payload.documents = null;

                // Additonal details
                payload.additionalDetails = {};
                if (formData?.data?.holdingNumber) payload.additionalDetails.holdingNo = formData?.data?.holdingNumber;
                if (formData?.data?.registrationDetails) payload.additionalDetails.registrationDetails = formData?.data?.registrationDetails;
                if (formData?.data?.applicationType) payload.additionalDetails.applicationType = formData?.data?.applicationType;
                if (formData?.data?.serviceType) payload.additionalDetails.serviceType = formData?.data?.serviceType;
                //For LandInfo
                payload.landInfo = {};
                //For Address
                payload.landInfo.address = {};
                if (formData?.address?.city?.code) payload.landInfo.address.city = formData?.address?.city?.code;
                if (formData?.address?.locality?.code) payload.landInfo.address.locality = { code: formData?.address?.locality?.code };
                if (formData?.address?.pincode) payload.landInfo.address.pincode = formData?.address?.pincode;
                if (formData?.address?.landmark) payload.landInfo.address.landmark = formData?.address?.landmark;
                if (formData?.address?.street) payload.landInfo.address.street = formData?.address?.street;
                if (formData?.address?.geoLocation) payload.landInfo.address.geoLocation = formData?.address?.geoLocation;

                payload.landInfo.owners = conversionOwners;
                payload.landInfo.ownershipCategory = ownershipCategory.code;
                payload.landInfo.tenantId = formData?.address?.city?.code;
                payload.subOccupancy = formData?.subOccupancy;
                payload.ownerDocs = {
                    formBRSI: getValues()?.formBRSI,
                    formBRSII: getValues()?.formBRSII,
                    formBRSV : getValues()?.formBRSV,
                    anAfidavitFromOwner : getValues()?.anAfidavitFromOwner,
                    certificateRegardingTheFunctionality : getValues()?.certificateRegardingTheFunctionality,
                    copyOfZoningPlan : getValues()?.copyOfZoningPlan,
                    ownershipDocuments : getValues()?.ownershipDocuments,
                    siteReport : getValues()?.siteReport,
                    structuralStabilityCertificate : getValues()?.structuralStabilityCertificate,
                    copyOfSaleDeed : getValues()?.copyOfSaleDeed,
                    copyOfApprovedZoning : getValues()?.copyOfApprovedZoning,
                    copyOfAffidavitClarifying : getValues()?.copyOfAffidavitClarifying

                }
                //for units
                const blockOccupancyDetails = formData;
                payload.landInfo.unit = getUnitsForAPI(blockOccupancyDetails);

                let nameOfAchitect = sessionStorage.getItem("BPA_ARCHITECT_NAME");
                let parsedArchitectName = nameOfAchitect ? JSON.parse(nameOfAchitect) : "ARCHITECT";
                payload.additionalDetails.typeOfArchitect = parsedArchitectName;
                // create BPA 
                console.log("payload123...")
                Digit.OBPSService.create({ BPA: payload }, tenantId)
                    .then((result, err) => {
                        if (result?.BPA?.length > 0) {
                            result?.BPA?.[0]?.landInfo?.owners?.forEach(owner => {
                                owner.gender = { code: owner.gender, active: true, i18nKey: `COMMON_GENDER_${owner.gender}` }
                            });
                            result.BPA[0].owners = { ...owner, owners: result?.BPA?.[0]?.landInfo?.owners, ownershipCategory: ownershipCategory };
                            result.BPA[0].address = result?.BPA?.[0]?.landInfo?.address;
                            result.BPA[0].address.city = formData.address.city;
                            result.BPA[0].address.locality = formData.address.locality;
                            result.BPA[0].placeName = formData?.address?.placeName;
                            result.BPA[0].data = formData.data;
                            result.BPA[0].BlockIds = getBlockIds(result.BPA[0].landInfo.unit);
                            result.BPA[0].subOccupancy = formData?.subOccupancy;
                            result.BPA[0].uiFlow = formData?.uiFlow;
                            setIsDisable(false);
                            onSelect("", result.BPA[0], "", true);
                        }
                    })
                    .catch((e) => {
                        setIsDisable(false);
                        setShowToast({ key: "true", error: true, message: e?.response?.data?.Errors[0]?.message });
                    });
            } else {
                onSelect(config.key, ownerStep);
            }
        }
    };

    const onSkip = () => onSelect();

    // if (isLoading) {
    //     return <Loader />
    // }



    const documentsList = [
        {
            label: t("Form BRS – I "),
            fileName: "formBRSI",
            selectorKey: "formBRSIFile",
        },
        {
            label: t("Form BRS - II "),
            fileName: "formBRSII",
            selectorKey: "formBRSIIFile",
        },
        {
            label: t("Form BRS -V (A1) (up to 16.5 M Ht "),
            fileName: "formBRSV",
            selectorKey: "formBRSVFile",
        },
        {
            label: t(`An Affidavit from the Owner for
            ownership and Technical Person that they
            have understood the provisions of the
            zoning plan/Haryana Building Code 2017
            (whichever is applicable) and shall not
            deviate from the same`),
            fileName: "anAfidavitFromOwner",
            selectorKey: "anAfidavitFromOwnerFile",
        },
        {
            label: t(`Certificate regarding the functionality of
            services as obtained from colonizer by
            owner/Technical Person`),
            fileName: "certificateRegardingTheFunctionality",
            selectorKey: "certificateRegardingTheFunctionalityFile",
        },
        {
            label: t(` Copy of Zoning plan/Verification of
            boundary duly verified by the colonizer`),
            fileName: "copyOfZoningPlan",
            selectorKey: "copyOfZoningPlanFile",
        },
        {
            label: t(`Ownership documents duly verified by
            the Technical Person`),
            fileName: "ownershipDocuments",
            selectorKey: "ownershipDocumentsFile",
        },
        {
            label: t(`Site report w.r.t. any construction at the
            applied site and on adjoining plots`),
            fileName: "siteReport",
            selectorKey: "siteReportFile",
        },
        {
            label: t(`Structural Stability Certificate as
            applicable from Haryana Building code
            2017`),
            fileName: "structuralStabilityCertificate",
            selectorKey: "structuralStabilityCertificateFile",
        },
        {
            label: t(`Copy of sale deed/Allotment Letter`),
            fileName: "copyOfSaleDeed",
            selectorKey: "copyOfSaleDeedFile",
        },
        {
            label: t(`Copy of approved zoning plan certified by
            the Technical Person`),
            fileName: "copyOfApprovedZoning",
            selectorKey: "copyOfApprovedZoningFile",
        },
        {
            label: t(`Copy of affidavit clarifying the status of
            roof right`),
            fileName: "copyOfAffidavitClarifying",
            selectorKey: "copyOfAffidavitClarifyingFile",
        },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        getValues,
        setValue,
    } = useForm({});

    const [fileStoreId, setFileStoreId] = useState({});
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showToastError, setShowToastError] = useState({ label: "", error: false, success: false });
    const [loader, setLoader] = useState(false);


    const uploadFile = async (file, fieldName) => {
        if (selectedFiles.includes(file.name)) {
            setShowToastError({ label: "Duplicate File", error: true, success: false });
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("tenantId", "hr");
        formData.append("module", "property-upload");
        formData.append("tag", "tag-property");
        setLoader(true);
        try {
            const Resp = await axios.post("/filestore/v1/files", formData, {});
            setValue(fieldName, Resp?.data?.files?.[0]?.fileStoreId);
            setFileStoreId({ ...fileStoreId, [fieldName]: Resp?.data?.files?.[0]?.fileStoreId });
            // setDocId(Resp?.data?.files?.[0]?.fileStoreId);
            // if (fieldName === "uploadBg") {
            //   setValue("uploadBgFileName", file.name);
            // }
            // if (fieldName === "tcpSubmissionReceived") {
            //   setValue("tcpSubmissionReceivedFileName", file.name);
            // }
            setSelectedFiles([...selectedFiles, file.name]);
            // console.log("Submit Error ====> ", err.message);

            setLoader(false);
            setShowToastError({ label: "File Uploaded Successfully", error: false, success: true });
        } catch (error) {
            console.log("Submit Error ====> ", error.message);
            setLoader(false);
            setShowToastError({ label: error.message, error: true, success: false });
        }
    };

    return (
        <div>
            <Timeline currentStep={2} />
            <FormStep config={config} onSelect={goNext} onSkip={onSkip} t={t} isDisabled={canmovenext || !ownershipCategory || isDisable} forcedError={t(error)}>

                {loader && <Spinner />}

                {showToastError && (
                    <CusToaster
                        label={showToastError?.label}
                        success={showToastError?.success}
                        error={showToastError?.error}
                        onClose={() => {
                            setShowToastError({ label: "", success: false, error: false });
                        }}
                    />
                )}

                {!isLoading ?
                    <div style={{ marginBottom: "10px" }}>
                        <div>
                            <CardLabel>{`${t("BPA_TYPE_OF_OWNER_LABEL")} *`}</CardLabel>
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
                                        <CardLabel style={{ marginBottom: "-15px" }}>{`${t("CORE_COMMON_MOBILE_NUMBER")} *`}</CardLabel>
                                        {ismultiple && <LinkButton
                                            label={<DeleteIcon style={{ float: "right", position: "relative", bottom: "5px" }} fill={!(fields.length == 1) ? "#494848" : "#FAFAFA"} />}
                                            style={{ width: "100px", display: "inline", background: "black" }}
                                            onClick={(e) => handleRemove(index)}
                                        />}
                                        <div style={{ marginTop: "30px" }}>
                                            <div className="field-container">
                                                <div style={{ position: "relative", zIndex: "100", left: "35px", marginTop: "-24.5px", marginLeft: Webview ? "-25px" : "-25px" }}>+91</div>
                                                <TextInput
                                                    style={{ background: "#FAFAFA", padding: "0px 35px" }}
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
                                                <div style={{ position: "relative", zIndex: "100", right: "35px", marginTop: "-24px", marginRight: Webview ? "-20px" : "-20px" }} onClick={(e) => getOwnerDetails(index, e)}> <SearchIcon /> </div>
                                            </div>
                                        </div>

                                        <CardLabel>{`${t("CORE_COMMON_EMAIL")} *`}</CardLabel>
                                        <TextInput
                                            style={{ background: "#FAFAFA" }}
                                            t={t}
                                            type={"text"}
                                            isMandatory={false}
                                            optionKey="i18nKey"
                                            name="name"
                                            value={field.email}
                                            onChange={(e) => setOwnerEmail(index, e)}
                                            {...(validation = {
                                                isRequired: true,
                                                pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
                                                type: "text",
                                                title: t("TL_EMAIL_ERROR_MESSAGE"),
                                            })}
                                        />


                                        <CardLabel>{`${t("CORE_COMMON_NAME")} *`}</CardLabel>
                                        <TextInput
                                            style={{ background: "#FAFAFA" }}
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
                                        <CardLabel>{`${t("BPA_APPLICANT_GENDER_LABEL")} *`}</CardLabel>
                                        <RadioOrSelect
                                            name="gender"
                                            options={genderList}
                                            selectedOption={field.gender}
                                            optionKey="i18nKey"
                                            onSelect={(e) => setGenderName(index, e)}
                                            t={t}
                                        />
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


                        <div className="row-12 mt-3">
                            {/* {showhide === "COD" && ( */}
                            <div className="card">
                                <div className="table table-bordered table-responsive">
                                    {/* <caption>List of users</caption> */}
                                    <thead>
                                        <tr>
                                            <th class="fw-normal">{t("SR_NO")}</th>
                                            <th class="fw-normal">{t("FIELD_NAME")}</th>
                                            <th class="fw-normal">{t("UPLOAD_DOCUMENTS")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {documentsList.map((item, index) => (
                                            <tr key={index}>
                                                <th class="fw-normal">{index + 1}</th>
                                                <td>{item.label}</td>

                                                {watch(item.fileName) ? (
                                                    <td>
                                                        <div className="d-flex justify-content-center">
                                                            <label title="Upload Document" for={item.selectorKey}>
                                                                {" "}
                                                                <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={item.selectorKey} />
                                                            </label>
                                                            <input
                                                                id={item.selectorKey}
                                                                type="file"
                                                                placeholder=""
                                                                className="form-control d-none"
                                                                onChange={(e) => uploadFile(e.target.files[0], item.fileName)}
                                                            ></input>

                                                            {watch(item.fileName) && (
                                                                <a onClick={() => getDocShareholding(watch(item.fileName), setLoader)} className="btn btn-sm ">
                                                                    <Visibility color="info" className="icon" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </td>
                                                ) : (
                                                    <td>
                                                        <div className="d-flex justify-content-center">
                                                            <label title="Upload Document" for={item.selectorKey}>
                                                                {" "}
                                                                <FileUpload style={{ cursor: "pointer" }} color="info" className="icon" for={item.selectorKey} />
                                                            </label>
                                                            <input
                                                                id={item.selectorKey}
                                                                type="file"
                                                                placeholder=""
                                                                className="form-control d-none"
                                                                {...register(item.selectorKey, { required: "This Document is required" })}
                                                                onChange={(e) => uploadFile(e.target.files[0], item.fileName)}
                                                            ></input>

                                                            {watch(item.fileName) && (
                                                                <a onClick={() => getDocShareholding(watch(item.fileName), setLoader)} className="btn btn-sm "></a>
                                                            )}
                                                        </div>

                                                        <h3 className="error-message" style={{ color: "red" }}>
                                                            {errors?.[item.selectorKey] && errors?.[item.selectorKey]?.message}
                                                        </h3>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </div>
                            </div>

                        </div>
                    </div> : <Loader />
                }


            </FormStep>
            {showToast && <Toast
                error={showToast?.error}
                warning={showToast?.warning}
                label={t(showToast?.message)}
                isDleteBtn={true}
                onClose={closeToast}
            />
            }



        </div>
    );
};

export default OwnerDetails;
