import React, { useEffect, useState } from "react";
import { Card, Banner, CardText, SubmitBar, LinkButton } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components";
import getPDFData from "../../../getPDFData";

const GetActionMessage = () => {
  const { t } = useTranslation();
  return t("CS_FILE_DESLUDGING_APPLICATION_SUCCESS");
};

const BannerPicker = (props) => {
  return (
    <Banner
      message={GetActionMessage()}
      applicationNumber={props.data?.fsm[0].applicationNo}
      info={props.t("CS_FILE_DESLUDGING_APPLICATION_NO")}
      successful={props.isSuccess}
    />
  );
};

const Response = ({ data, onSuccess }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const mutation = Digit.Hooks.fsm.useDesludging(data?.address?.city ? data.address?.city?.code : tenantId);
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);
  const [paymentPreference, setPaymentPreference] = useState(null);
  const [advancePay, setAdvancePay] = useState(null);
  const [zeroPay, setZeroPay] = useState(null);

  const Data = mutation?.data || successData;
  const localityCode = Data?.fsm?.[0].address?.locality?.code;
  const slumCode = Data?.fsm?.[0].address?.slumName;
  const slum = Digit.Hooks.fsm.useSlum(Data?.fsm?.[0].address?.tenantId, slumCode, localityCode, {
    enabled: slumCode ? true : false,
    retry: slumCode ? true : false,
  });

  const onError = (error, variables) => {
    setErrorInfo(error?.response?.data?.Errors[0]?.code || "ERROR");
    setMutationHappened(true);
  };
  useEffect(() => {
    if (mutation.data) setsuccessData(mutation.data);
  }, [mutation.data]);

  useEffect(() => {
    if (!mutationHappened && !errorInfo) {
      try {
        const amount = Digit.SessionStorage.get("total_amount");
        const amountPerTrip = Digit.SessionStorage.get("amount_per_trip");
        const { subtype, pitDetail, address, pitType, source, selectGender, selectPaymentPreference, selectTripNo } = data;
        const { city, locality, geoLocation, pincode, street, doorNo, landmark, slum } = address;
        setPaymentPreference(selectPaymentPreference?.code);
        const advanceAmount = amount === 0 ? null : selectPaymentPreference?.advanceAmount;
        amount === 0 ? setZeroPay(true) : setZeroPay(false);
        advanceAmount === 0 ? setAdvancePay(true) : setAdvancePay(false);
        const formdata = {
          fsm: {
            citizen: {
              gender: selectGender?.code,
            },
            tenantId: city.code,
            additionalDetails: {},
            propertyUsage: subtype.code,
            address: {
              tenantId: city.code,
              additionalDetails: null,
              street: street?.trim(),
              doorNo: doorNo?.trim(),
              landmark: landmark?.trim(),
              slumName: slum,
              city: city.name,
              pincode,
              locality: {
                code: locality.code,
                name: locality.name,
              },
              geoLocation: {
                latitude: geoLocation?.latitude,
                longitude: geoLocation?.longitude,
                additionalDetails: {},
              },
            },
            pitDetail: {
              additionalDetails: {
                fileStoreId: {
                  CITIZEN: pitDetail?.images,
                },
              },
            },
            source,
            sanitationtype: pitType?.code,
            paymentPreference: amount === 0 ? null : selectPaymentPreference?.paymentType ? selectPaymentPreference?.paymentType?.code : null,
            noOfTrips: selectTripNo ? selectTripNo?.tripNo?.code : 1,
            vehicleCapacity: selectTripNo ? selectTripNo?.vehicleCapacity?.capacity : "",
            additionalDetails: {
              totalAmount: amount,
              tripAmount: amountPerTrip,
            },
            advanceAmount,
          },
          workflow: null,
        };
        mutation.mutate(formdata, {
          onError,
          onSuccess: () => {
            setMutationHappened(true);
            onSuccess();
          },
        });
        sessionStorage.removeItem("Digit.total_amount");
      } catch (err) {}
    }
  }, []);

  const handleDownloadPdf = () => {
    const { fsm } = Data;
    const [applicationDetails, ...rest] = fsm;
    const tenantInfo = tenants.find((tenant) => tenant.code === applicationDetails.tenantId);

    const data = getPDFData({ ...applicationDetails, slum }, tenantInfo, t);
    Digit.Utils.pdf.generate(data);
  };
  const isSuccess = !successData ? mutation?.isSuccess : true;

  return mutation.isLoading || (mutation.isIdle && !mutationHappened) ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker t={t} data={Data} isSuccess={isSuccess} isLoading={(mutation.isIdle && !mutationHappened) || mutation?.isLoading} />
      <CardText>
        {t((paymentPreference && paymentPreference == "POST_PAY") || advancePay ? "CS_FILE_PROPERTY_RESPONSE_POST_PAY" : zeroPay ? "CS_FSM_RESPONSE_CREATE_DISPLAY_ZERO_PAY" : "CS_FILE_PROPERTY_RESPONSE")}
      </CardText>
      {isSuccess && (
        <LinkButton
          label={
            <div className="response-download-button">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f47738">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
              </span>
              <span className="download-button">{t("CS_COMMON_DOWNLOAD")}</span>
            </div>
          }
          onClick={handleDownloadPdf}
          className="w-full"
        />
      )}
      <Link to={`/digit-ui/citizen`}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default Response;
