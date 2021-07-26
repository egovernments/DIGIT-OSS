import React, { useState } from "react";
import {
  Header,
  Card,
  RadioButtons,
  SubmitBar,
  BackButton,
  CardLabel,
  CardLabelDesc,
  CardSectionHeader,
  InfoBanner,
  Loader,
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { useParams, useHistory, useLocation, Redirect } from "react-router-dom";

export const SelectPaymentType = (props) => {
  const { state = {} } = useLocation();
  const userInfo = Digit.UserService.getUser();

  const { tenantId: __tenantId, authorization } = Digit.Hooks.useQueryParams();
  const paymentAmount = state?.paymentAmount;
  const { t } = useTranslation();
  const history = useHistory();

  const { pathname, search } = useLocation();
  // const menu = ["AXIS"];
  const { consumerCode, businessService } = useParams();
  const tenantId = state?.tenantId || __tenantId || Digit.ULBService.getCurrentTenantId();
  const stateTenant = tenantId.split(".")[0];
  const { control, handleSubmit } = useForm();
  const { data: menu, isLoading } = Digit.Hooks.useCommonMDMS(stateTenant, "DIGIT-UI", "PaymentGateway");
  const { data: paymentdetails, isLoading: paymentLoading } = Digit.Hooks.useFetchPayment({ tenantId: tenantId, consumerCode, businessService }, {});

  const { name, mobileNumber } = state;

  const billDetails = paymentdetails?.Bill ? paymentdetails?.Bill[0] : {};
  console.log({ billDetails, payment: paymentdetails?.Bill });

  const onSubmit = async (d) => {
    // console.log("find submitted data", d);
    const filterData = {
      Transaction: {
        tenantId: tenantId,
        txnAmount: paymentAmount || billDetails.totalAmount,
        module: businessService,
        billId: billDetails.id,
        consumerCode: consumerCode,
        productInfo: "Common Payment",
        gateway: d.paymentType,
        taxAndPayments: [
          {
            billId: billDetails.id,
            amountPaid: paymentAmount || billDetails.totalAmount,
          },
        ],
        user: {
          name: userInfo?.info?.name || name,
          mobileNumber: userInfo?.info?.mobileNumber || mobileNumber,
          tenantId: tenantId,
        },
        // success
        callbackUrl: window.location.href.includes("mcollect")
          ? `${window.location.protocol}//${window.location.host}/digit-ui/citizen/payment/success/${businessService}/${consumerCode}/${tenantId}?workflow=mcollect`
          : `${window.location.protocol}//${window.location.host}/digit-ui/citizen/payment/success/${businessService}/${consumerCode}/${tenantId}`,
        additionalDetails: {
          isWhatsapp: false,
        },
      },
    };

    try {
      const data = await Digit.PaymentService.createCitizenReciept(tenantId, filterData);
      const redirectUrl = data?.Transaction?.redirectUrl;
      window.location = redirectUrl;
    } catch (error) {
      let messageToShow = "CS_PAYMENT_UNKNOWN_ERROR_ON_SERVER";
      console.dir(error);
      console.log(error.response);
      if (error.response?.data?.Errors?.[0]) {
        const { code, message } = error.response?.data?.Errors?.[0];
        messageToShow = t(message);
      }
      window.alert(messageToShow);

      // TODO: add error toast for error.response.data.Errors[0].message
    }
  };

  if (authorization === "true" && !userInfo.access_token) {
    // console.log("find query params", __tenantId, authorization, authorization === "true",!userInfo.access_token, authorization === "true" && !userInfo.access_token)
    // console.log("find encoded url",encodeURI(pathname))
    return <Redirect to={`/digit-ui/citizen/login?from=${encodeURIComponent(pathname + search)}`} />;
  }

  if (isLoading || paymentLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <BackButton>{t("CS_COMMON_BACK")}</BackButton>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Header>{t("PAYMENT_CS_HEADER")}</Header>
        <Card>
          <div className="payment-amount-info">
            <CardLabelDesc className="dark">{t("PAYMENT_CS_TOTAL_AMOUNT_DUE")}</CardLabelDesc>
            <CardSectionHeader> ₹ {paymentAmount || billDetails.totalAmount}</CardSectionHeader>
          </div>
          <CardLabel>{t("PAYMENT_CS_SELECT_METHOD")}</CardLabel>
          {menu?.length && (
            <Controller
              name="paymentType"
              defaultValue={menu[0]}
              control={control}
              render={(props) => <RadioButtons selectedOption={props.value} options={menu} onSelect={props.onChange} />}
            />
          )}
          <SubmitBar label={t("PAYMENT_CS_BUTTON_LABEL")} submit={true} />
        </Card>
      </form>
      <InfoBanner label={t("CS_COMMON_INFO")} text={t("CS_PAYMENT_REDIRECT_NOTICE")} />
    </React.Fragment>
  );
};
