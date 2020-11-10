import React from "react";
import {
  Card,
  Banner,
  CardText,
  SubmitBar,
} from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const GetActionMessage = ({ action }) => {
  if (action === "REOPEN") {
    return "Complaint Reopened";
  } else {
    return "Complaint Submitted";
  }
};

const BannerPicker = ({ response }) => {
  const { complaints } = response;
  if (complaints && complaints.response && complaints.response.responseInfo) {
    return (
      <Banner
        message={GetActionMessage(
          complaints.response.ServiceWrappers[0].workflow
        )}
        complaintNumber={
          complaints.response.ServiceWrappers[0].service.serviceRequestId
        }
        successful={true}
      />
    );
  } else {
    return <Banner message="Complaint Not Submitted" successful={false} />;
  }
};

const Response = (props) => {
  const appState = useSelector((state) => state);
  return (
    <Card>
      {appState.complaints.response && <BannerPicker response={appState} />}
      <CardText>
        The notification along with complaint number is sent to your registered
        mobile number. You can track the complaint status using mobile or web
        app.
      </CardText>
      <Link to="/create-complaint">
        <SubmitBar label="Go back to home page" />
      </Link>
    </Card>
  );
};

export default Response;
