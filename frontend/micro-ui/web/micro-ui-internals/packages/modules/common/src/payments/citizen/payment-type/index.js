import React, { useEffect, useState } from "react";
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
  Toast,
  CardText,
} from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { useParams, useHistory, useLocation, Redirect } from "react-router-dom";
import { stringReplaceAll } from "../bills/routes/bill-details/utils";
import { Form } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
export const SelectPaymentType = (props) => {
  const { state = {} } = useLocation();
  const userInfo = Digit.UserService.getUser();
  const [showToast, setShowToast] = useState(null);
  const [bankValue, setBankValue] = useState("");
  const { tenantId: __tenantId, authorization, workflow: wrkflow } = Digit.Hooks.useQueryParams();
  const paymentAmount = state?.paymentAmount;
  const { t } = useTranslation();

  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });
  const { pathname, search } = useLocation();
  // const menu = ["AXIS"];
  const { consumerCode, businessService } = useParams();
  const tenantId = state?.tenantId || __tenantId || Digit.ULBService.getCurrentTenantId();
  const stateTenant = Digit.ULBService.getStateId();
  const { data: menu, isLoading } = Digit.Hooks.useCommonMDMS(stateTenant, "DIGIT-UI", "PaymentGateway");
  const { data: paymentdetails, isLoading: paymentLoading } = Digit.Hooks.useFetchPayment(
    { tenantId: tenantId, consumerCode: wrkflow === "WNS" ? stringReplaceAll(consumerCode, "+", "/") : consumerCode, businessService },
    {}
  );
  const [selected, setSelected] = React.useState("");
  const [getRemarks, setRemarks] = React.useState("");
  const changeSelectOptionHandler = (event) => setSelected(event.target.value);

  const netBanking = [
    { name: "Choose...", value: "" },
    { name: "IDBI", value: "0300997" },
    { name: "PNB", value: "0300999" },
  ];
  const onlineNeft = [
    { name: "Choose...", value: "" },
    { name: "IDBI", value: "0300997" },
  ];
  const offlineChallan = [
    { name: "Choose...", value: "" },
    { name: "IDBI", value: "1603" },
    ,
    { name: "PNB", value: "1600" },
    ,
    { name: "CBI", value: "1604" },
  ];
  let type = null;
  let options = null;
  if (selected === "101") {
    type = netBanking;
  } else if (selected === "102") {
    type = onlineNeft;
  } else if (selected === "103") {
    type = offlineChallan;
  }
  if (type) {
    options = type.map((el, index) => (
      <option key={`key${index}`} value={el?.value}>
        {el?.name}
      </option>
    ));
  }
  useEffect(() => {
    if (paymentdetails?.Bill && paymentdetails.Bill.length == 0) {
      setShowToast({ key: true, label: "CS_BILL_NOT_FOUND" });
    }
  }, [paymentdetails]);

  useEffect(() => {
    localStorage.setItem("BillPaymentEnabled", "true");
  }, []);

  const { name, mobileNumber } = state;

  const billDetails = paymentdetails?.Bill ? paymentdetails?.Bill[0] : {};

  const onSubmit = async (d) => {
    console.log("userInfo", userInfo);
    console.log(d);
    const filterData = {
      Transaction: {
        tenantId: tenantId,
        txnAmount: paymentAmount || billDetails.totalAmount,
        bank: bankValue,
        ptype: selected,
        remarks: getRemarks,
        address: "haryana",
        module: businessService,
        billId: billDetails.id,
        consumerCode: wrkflow === "WNS" ? stringReplaceAll(consumerCode, "+", "/") : consumerCode,
        productInfo: "Common Payment",
        gateway: d.paymentType,
        taxAndPayments: [
          {
            billId: billDetails.id,
            amountPaid: paymentAmount || billDetails.totalAmount,
          },
        ],
        user: {
          name: name || userInfo?.info?.name,
          mobileNumber: mobileNumber || userInfo?.info?.mobileNumber,
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
      console.log("data====", data);
      // window.location.replace(redirectUrl);
      console.log("redirectUrl", redirectUrl);
      // window.location = redirectUrl;
    } catch (error) {
      let messageToShow = "CS_PAYMENT_UNKNOWN_ERROR_ON_SERVER";
      if (error.response?.data?.Errors?.[0]) {
        const { code, message } = error.response?.data?.Errors?.[0];
        messageToShow = code;
      }
      setShowToast({ key: true, label: t(messageToShow) });
    }
  };

  if (authorization === "true" && !userInfo.access_token) {
    localStorage.clear();
    sessionStorage.clear();
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
          <div className="payment-amount-info" style={{ marginBottom: "26px" }}>
            <CardLabel className="dark">{t("PAYMENT_CS_TOTAL_AMOUNT_DUE")}</CardLabel>
            <CardSectionHeader> ₹ {paymentAmount || Intl?.NumberFormat("en-IN")?.format(billDetails?.totalAmount)}</CardSectionHeader>
          </div>
          <Row>
            <div className="col col-6">
              <div>
                <Form.Label>
                  <h2>Payment mode</h2>
                </Form.Label>
                <select className="form-control" onChange={changeSelectOptionHandler} {...register("pmode")}>
                  <option>Choose...</option>
                  <option value="101">Net banking/Debit card/Credit card</option>
                  <option value="102">Online NEFT/RTGS</option>
                  <option value="103">Offline Challan</option>
                </select>
              </div>
            </div>
            <div className="col col-6">
              <div>
                <Form.Label>
                  <h2>Payment Aggregator</h2>
                </Form.Label>
                <select className="form-control" onChange={(e) => setBankValue(e?.target?.value)} id="submit" {...register("bank")}>
                  {
                    /** This is where we have used our options variable */
                    options
                  }
                </select>
              </div>
            </div>
          </Row>
          <br></br>
          <div>
            <CardLabel>{t("PAYMENT_CS_SELECT_METHOD")}</CardLabel>
            {menu?.length && (
              <Controller
                name="paymentType"
                defaultValue={menu[0]}
                control={control}
                render={(props) => <RadioButtons selectedOption={props.value} options={menu} onSelect={props.onChange} />}
              />
            )}
            <div>
              <div>
                <label>
                  <h2>Enter Remarks</h2>
                </label>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Enter remarks"
                {...register("remarks")}
                onChange={(e) => setRemarks(e?.target?.value)}
              />
              {errors?.remarks && errors?.remarks?.message}
            </div>
            <div style={{ marginTop: "5px" }}>
              {/* <Button style={{ textAlign: "right" }}> Generate LOI</Button> */}

              {!showToast && bankValue && selected && <SubmitBar type="submit" label={t("PAYMENT_CS_BUTTON_LABEL")} submit={true} />}
            </div>
            {/* )} */}
          </div>
        </Card>
      </form>
      <InfoBanner label={t("CS_COMMON_INFO")} text={t("CS_PAYMENT_REDIRECT_NOTICE")} />
      {showToast && (
        <Toast
          error={showToast.key}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </React.Fragment>
  );
};
