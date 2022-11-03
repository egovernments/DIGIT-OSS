import { FormComposer, Header, Loader, Toast } from "@egovernments/digit-ui-react-components";
import cloneDeep from "lodash/cloneDeep";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useHistory } from "react-router-dom";
import { newConfig as newConfigLocal } from "../../../config/wsActivationConfig";
import { stringReplaceAll, convertDateToEpochNew, convertEpochToDates } from "../../../utils";
import * as func from "../../../utils";
import _ from "lodash";

const ActivateConnection = () => {
    const { t } = useTranslation();
    let { state } = useLocation();
    state = state ? JSON.parse(state) : {};
    const history = useHistory();
    let filters = func.getQueryStringParams(location.search);
    const [canSubmit, setSubmitValve] = useState(false);
    const [isEnableLoader, setIsEnableLoader] = useState(false);
    const [showToast, setShowToast] = useState(null);
    const [appDetails, setAppDetails] = useState({});
    const [isAppDetailsPage, setIsAppDetailsPage] = useState(false);

    const [config, setConfig] = React.useState({ head: "", body: [] });

    const stateId = Digit.ULBService.getStateId();
    let tenantId = Digit.ULBService.getCurrentTenantId();
    tenantId ? tenantId : Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code;
    let { data: newConfig, isLoading } = Digit.Hooks.ws.useWSConfigMDMS.WSActivationConfig(stateId, {});
    let details = cloneDeep(state?.data); 
    let { isLoading: isappdetailsLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useWSDetailsPage(t, tenantId, details?.applicationNo, details?.serviceType,{ privacy: Digit.Utils.getPrivacyObject() });
    details = cloneDeep(applicationDetails);
    state = {data : {...applicationDetails?.applicationData}}
    const {
        isLoading: updatingApplication,
        isError: updateApplicationError,
        data: updateResponse,
        error: updateError,
        mutate,
    } = Digit.Hooks.ws.useWSApplicationActions(filters?.service);

    const waterSourceSubDataWithClone = state?.data?.waterSource ? cloneDeep(state?.data?.waterSource) : "";
    const waterSourceSubDataWithUS = waterSourceSubDataWithClone ? stringReplaceAll(waterSourceSubDataWithClone?.toUpperCase(), " ", "_") : "";
    const waterSourceSubDataWithCma = waterSourceSubDataWithUS ? stringReplaceAll(waterSourceSubDataWithUS?.toUpperCase(), ".", "_") : "";
    const connectionDetails = filters?.service === "WATER" ? {
        connectionType: state?.data?.connectionType ? {
            code: state?.data?.connectionType, i18nKey: `WS_CONNECTIONTYPE_${stringReplaceAll(state?.data?.connectionType?.toUpperCase(), " ", "_")}`
        } : "",
        waterSource: state?.data?.waterSource ? {
            code: state?.data?.waterSource, i18nKey: `WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(state?.data?.waterSource?.split('.')[0]?.toUpperCase(), " ", "_")}`
        } : "",
        sourceSubData: state?.data?.waterSource ? {
            code: state?.data?.waterSource, i18nKey: `WS_SERVICES_MASTERS_WATERSOURCE_${waterSourceSubDataWithCma}`
        } : "",
        pipeSize: state?.data?.pipeSize ? {
            code: state?.data?.pipeSize, i18nKey: state?.data?.pipeSize
        } : "",
        noOfTaps: state?.data?.noOfTaps || "",
        formDetails: details
    } : {
        noOfWaterClosets: state?.data?.noOfWaterClosets || "",
        noOfToilets: state?.data?.noOfToilets || "",
        formDetails: details
    };

    const plumberDetails = [{
        plumberName: state?.data?.plumberInfo?.[0]?.name || "",
        plumberMobileNo: state?.data?.plumberInfo?.[0]?.mobileNumber || "",
        plumberLicenseNo: state?.data?.plumberInfo?.[0]?.licenseNo || "",
        detailsProvidedBy: state?.data?.additionalDetails?.detailsProvidedBy ? {
            i18nKey: `WS_PLUMBER_${state?.data?.additionalDetails?.detailsProvidedBy?.toUpperCase()}`, code: state?.data?.additionalDetails?.detailsProvidedBy
        } : "",
        applicationNo: state?.data?.applicationNo,
        key: Date.now(),
    }];

    const activationDetails = state?.data?.connectionType?.toUpperCase() === "METERED" ? [{
        meterId: state?.data?.meterId || "",
        meterInstallationDate: state?.data?.meterInstallationDate ? convertEpochToDates(state?.data?.meterInstallationDate) : null,
        meterInitialReading: state?.data?.additionalDetails?.initialMeterReading || "",
        connectionExecutionDate: state?.data?.connectionExecutionDate ? convertEpochToDates(state?.data?.connectionExecutionDate) : null,
    }] : [{
        connectionExecutionDate: state?.data?.connectionExecutionDate ? convertEpochToDates(state?.data?.connectionExecutionDate) : null
    }];

    const defaultValues = {
        formDetails: details,
        connectionDetails: [connectionDetails],
        plumberDetails: plumberDetails,
        activationDetails: activationDetails
    };
    useEffect(() => {
        if(!isappdetailsLoading){
        setAppDetails(details);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            // const config = newConfigLocal.find((conf) => conf.hideInCitizen);
            const config = newConfig.find((conf) => conf.hideInCitizen);
            setConfig(config);
        }
    }, [newConfig]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isAppDetailsPage) window.location.href = `${window.location.origin}/digit-ui/employee/ws/application-details?applicationNumber=${filters?.applicationNumber}&service=${filters?.service}`
        }, 3000);
        return () => clearTimeout(timer);
      }, [isAppDetailsPage]);

    const onFormValueChange = (setValue, formData, formState) => {
        if (Object.keys(formState.errors).length > 0 && Object.keys(formState.errors).length == 1 && formState.errors["owners"] && Object.values(formState.errors["owners"].type).filter((ob) => ob.type === "required").length == 0 && Object.getPrototypeOf(formState.errors) === Object.prototype) setSubmitValve(true);
        else setSubmitValve(!(Object.keys(formState.errors).length));
    };

    const getConvertedDate = async (dateOfTime) => {
        let dateOfReplace = stringReplaceAll(dateOfTime, "/", "-");
        let formattedDate = "";
        if (dateOfReplace.split("-")[2] > 1900) {
            formattedDate = `${dateOfReplace.split("-")[2]}-${dateOfReplace.split("-")[1]}-${dateOfReplace.split("-")[0]}`;
        } else {
            formattedDate = `${dateOfReplace.split("-")[0]}-${dateOfReplace.split("-")[2]}-${dateOfReplace.split("-")[1]}`;
        }
        const convertedDate = await convertDateToEpochNew(formattedDate);
        return convertedDate;
    }

    const closeToast = () => {
        setShowToast(null);
        // history.push(`/digit-ui/employee/ws/application-details?applicationNumber=${filters?.applicationNumber}&service=${filters?.service}`, {});
    };

    const closeToastOfError = () => { setShowToast(null); };

    const onSubmit = async (data) => {
        if(!canSubmit){
            setShowToast({ warning: true, message: "PLEASE_FILL_MANDATORY_DETAILS" });
            setTimeout(() => {
              setShowToast(false);
            }, 3000);
          }
          else{
        const formDetails = cloneDeep(data);
        const formData = Object.keys(appDetails)?.length > 0 ? { ...appDetails } : {...details?.applicationData};

        if (formDetails?.connectionDetails?.[0]?.connectionType?.code) formData.connectionType = formDetails?.connectionDetails?.[0]?.connectionType?.code;
        if (formDetails?.connectionDetails?.[0]?.waterSource?.code) formData.waterSource = formDetails?.connectionDetails?.[0]?.sourceSubData?.code;
        if (formDetails?.connectionDetails?.[0]?.pipeSize?.size) formData.pipeSize = formDetails?.connectionDetails?.[0]?.pipeSize?.size;
        if (formDetails?.connectionDetails?.[0]?.noOfTaps) formData.noOfTaps = formDetails?.connectionDetails?.[0]?.noOfTaps;

        if (formDetails?.connectionDetails?.[0]?.noOfWaterClosets) formData.noOfWaterClosets = formDetails?.connectionDetails?.[0]?.noOfWaterClosets;
        if (formDetails?.connectionDetails?.[0]?.noOfToilets) formData.noOfToilets = formDetails?.connectionDetails?.[0]?.noOfToilets;

        if (formDetails?.plumberDetails?.[0]?.detailsProvidedBy?.code) formData.additionalDetails.detailsProvidedBy = formDetails?.plumberDetails?.[0]?.detailsProvidedBy?.code;
        if (!formData?.plumberInfo?.[0] && formDetails?.plumberDetails?.detailsProvidedBy?.code == "ULB") formData.plumberInfo = [{}];
        if (formDetails?.plumberDetails?.[0]?.plumberName) formData.plumberInfo[0].name = formDetails?.plumberDetails?.[0]?.plumberName;
        if (formDetails?.plumberDetails?.[0]?.plumberLicenseNo) formData.plumberInfo[0].licenseNo = formDetails?.plumberDetails?.[0]?.plumberLicenseNo;
        if (formDetails?.plumberDetails?.[0]?.plumberMobileNo) formData.plumberInfo[0].mobileNumber = formDetails?.plumberDetails?.[0]?.plumberMobileNo;

        if (formDetails?.activationDetails?.[0]?.meterId) formData.meterId = formDetails?.activationDetails?.[0]?.meterId;
        if (formDetails?.activationDetails?.[0]?.meterInstallationDate) formData.meterInstallationDate = await getConvertedDate(formDetails?.activationDetails?.[0]?.meterInstallationDate);
        if (formDetails?.activationDetails?.[0]?.meterInitialReading) formData.additionalDetails.initialMeterReading = formDetails?.activationDetails?.[0]?.meterInitialReading;
        if (formDetails?.activationDetails?.[0]?.connectionExecutionDate) formData.connectionExecutionDate = await getConvertedDate(formDetails?.activationDetails?.[0]?.connectionExecutionDate);

        formData.comment = formDetails?.comments?.comments || "";
        formData.action = filters?.action;
        formData.wfDocuments = data?.supportingDocuments?.[0]?.fileStoreId
        ? [
          {
            documentType: "Document - 1",
            fileStoreId: data?.supportingDocuments?.[0]?.fileStoreId
          },
        ]
        : [],
        formData.processInstance = {
            action: filters?.action,
            comment: formDetails?.comments?.comments || "",
            documents: data?.supportingDocuments?.[0]?.fileStoreId
              ? [
                {
                  documentType: "Document - 1",
                  fileStoreId: data?.supportingDocuments?.[0]?.fileStoreId,
                },
              ]
              : []
        }

        const reqDetails = filters?.service == "WATER" ? { WaterConnection: formData } : { SewerageConnection: formData }

        if (mutate) {
            // setIsEnableLoader(true);
            mutate(reqDetails, {
                onError: (error, variables) => {
                    // setIsEnableLoader(false);
                    setShowToast({ key: "error", message: error?.message ? error.message : error });
                    setTimeout(closeToastOfError, 5000);
                },
                onSuccess: (data, variables) => {
                    // setIsEnableLoader(false);
                    setShowToast({ key: false, message: "WS_ACTIVATE_SUCCESS_MESSAGE_MAIN" });
                    setIsAppDetailsPage(true);
                    // setTimeout(closeToast(), 5000);
                    // setTimeout(closeToastForSucsss(), 5000)
                },
            });
        }
    }
    };


    if (isEnableLoader || isLoading || isappdetailsLoading) { //updatingApplication || 
        return <Loader />;
    }

    return (
        <React.Fragment>
            <div style={{ marginLeft: "15px" }}>
                <Header>{t(config.head)}</Header>
            </div>
            <FormComposer
                config={config.body}
                userType={"employee"}
                defaultValues={defaultValues}
                onSubmit={onSubmit}
                label={t("WF_EMPLOYEE_NEWSW1_ACTIVATE_CONNECTION")}
                onFormValueChange={onFormValueChange}
                // isDisabled={!canSubmit}
            ></FormComposer>
            {showToast && <Toast error={showToast.key} label={t(showToast?.message)} warning={showToast?.warning} onClose={closeToast} />}
        </React.Fragment>
    );
};

export default ActivateConnection;
