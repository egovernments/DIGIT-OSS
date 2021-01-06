import React, { useEffect } from "react";
import { Card, Banner, CardText, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components";

const GetActionMessage = () => {
  const { t } = useTranslation();
  return t("CS_FILE_DESLUDGING_APPLICATION_SUCCESS");
};

const BannerPicker = (props) => {
  return <Banner message={GetActionMessage()} complaintNumber={props.data?.fsm[0].applicationNo} successful={props.isSuccess} />;
};

const Response = ({ data, onSuccess }) => {
  const { t } = useTranslation();
  const mutation = Digit.Hooks.fsm.useDesludging("pb.amritsar");
  useEffect(() => {
    try {
      const { propertyType, landmark, pincode, pitDetail, city_complaint, locality_complaint } = data;
      const formdata = {
        fsm: {
          tenantId: "pb.amritsar",
          additionalDetails: {},
          propertyUsage: propertyType,
          address: {
            tenantId: "pb.amritsar",
            additionalDetails: null,
            landmark,
            city: city_complaint.name,
            pincode,
            locality: {
              code: locality_complaint.code.split("_").pop(),
              name: locality_complaint.name,
            },
            geoLocation: {
              latitude: locality_complaint.latitude,
              longitude: locality_complaint.longitude,
              additionalDetails: {},
            },
          },
          pitDetail,
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

  return mutation.isLoading || mutation.isIdle ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker data={mutation.data} isSuccess={mutation.isSuccess} isLoading={mutation.isIdle || mutation.isLoading} />
      <CardText>{t("CS_COMMON_TRACK_COMPLAINT_TEXT")}</CardText>
      <Link to={`/digit-ui/citizen`}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default Response;
