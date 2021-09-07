import React, { useEffect } from "react";
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
  const localityCode = mutation?.data?.fsm[0].address?.locality?.code;
  const slumCode = mutation?.data?.fsm[0].address?.slumName;
  const slum = Digit.Hooks.fsm.useSlum(mutation?.data?.fsm[0].address?.tenantId, slumCode, localityCode, {
    enabled: slumCode ? true : false,
    retry: slumCode ? true : false,
  });

  useEffect(() => {
    try {
      const { subtype, pitDetail, address, pitType, source } = data;
      const { city, locality, geoLocation, pincode, street, doorNo, landmark, slum } = address;
      const formdata = {
        fsm: {
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
          pitDetail,
          source,
          sanitationtype: pitType?.code,
        },
        workflow: null,
      };
      mutation.mutate(formdata, {
        onSuccess,
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleDownloadPdf = () => {
    const { fsm } = mutation.data;
    const [applicationDetails, ...rest] = fsm;
    const tenantInfo = tenants.find((tenant) => tenant.code === applicationDetails.tenantId);

    const data = getPDFData({ ...applicationDetails, slum }, tenantInfo, t);
    Digit.Utils.pdf.generate(data);
  };

  return mutation.isLoading || mutation.isIdle ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker t={t} data={mutation.data} isSuccess={mutation.isSuccess} isLoading={mutation.isIdle || mutation.isLoading} />
      <CardText>{t("CS_FILE_PROPERTY_RESPONSE")}</CardText>
      {mutation.isSuccess && (
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
