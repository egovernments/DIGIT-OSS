import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Card,
  Header,
  CardSubHeader,
  StatusTable,
  Row,
  TextArea,
  SubmitBar,
  DisplayPhotos,
  ImageViewer,
  Loader,
  CardSectionHeader,
  ConnectingCheckPoints,
  CheckPoint,
  ActionBar,
  Menu,
  LinkButton,
} from "@egovernments/digit-ui-react-components";

const applicationDetails = {
  details: [
    {
      title: "Application Details",
      values: [{ title: "Application No.", value: "FSM-277373" }],
    },
    {
      title: "Applicant Details",
      values: [
        { title: "Applicant Name", value: "Nawal Kishore" },
        { title: "Applicant Mobile No.", value: "+91 9645234533" },
        { title: "Slum Name", value: "Jagbandhu huda" },
      ],
    },
    {
      title: "Property Details",
      values: [
        { title: "Property Type", value: "Commercial" },
        { title: "Property Sub-Type", value: "Shopping Mail" },
      ],
    },
    {
      title: "Property Location Details",
      values: [
        { title: "Locality", value: "Alakapuri" },
        { title: "City", value: "Berhampur" },
        { title: "Pincode", value: "345123" },
        { title: "Landmark", value: "SBI Bank" },
        { title: "Geolocation", value: "" },
      ],
    },
  ],
};

const timeline = [
  {
    label: "Pending for Demand Generation",
    caption: [""],
  },
  {
    label: "Application Submitted",
    caption: [
      {
        date: "12/08/2020",
        name: "Nawal Kishore",
        mobileNumber: "+91 4534234512",
        source: "Filed Via Mobile App",
      },
    ],
  },
];

const workflowDetails = {
  data: {
    nextActions: [{ action: "GENERATE_DEMAND" }, { action: "MODIFY_APPLICATION" }, { action: "REJECT_APPLICATION" }],
  },
};

const ApplicationDetails = (props) => {
  const { t } = useTranslation();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  function onActionSelect(action) {
    setSelectedAction(action);
  }

  const TLCaption = ({ data }) => {
    const { t } = useTranslation();
    return (
      <div>
        {data.date && <p>{data.date}</p>}
        <p>{data.name}</p>
        <p>{data.mobileNumber}</p>
        {data.source && <p>{t("ES_COMMON_FILED_VIA_" + data.source.toUpperCase())}</p>}
      </div>
    );
  };

  const getTimelineCaptions = (checkpoint) => {
    if (checkpoint.status === "COMPLAINT_FILED" && complaintDetails?.audit) {
      const caption = {
        date: Digit.DateUtils.ConvertTimestampToDate(complaintDetails.audit.details.createdTime),
        name: complaintDetails.audit.citizen.name,
        mobileNumber: complaintDetails.audit.citizen.mobileNumber,
        source: complaintDetails.audit.source,
      };
      return <TLCaption data={caption} />;
    }
    return checkpoint.caption && checkpoint.caption.length !== 0 ? <TLCaption data={checkpoint.caption[0]} /> : null;
  };

  return (
    <React.Fragment>
      {Object.keys(applicationDetails).length > 0 ? (
        <React.Fragment>
          <Card style={{ position: "relative" }}>
            <LinkButton
              label={<span style={{ color: "#f47738", marginLeft: "8px" }}>VIEW AUDIT TRAIL</span>}
              style={{ position: "absolute", top: 0, right: 20 }}
              onClick={() => Digit.Utils.pdf.generate(data)}
            />
            {applicationDetails.details.map((detail, index) => (
              <React.Fragment>
                {index === 0 ? (
                  <CardSubHeader style={{ marginBottom: "16px" }}>{detail.title}</CardSubHeader>
                ) : (
                  <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>{detail.title}</CardSectionHeader>
                )}
                <StatusTable>
                  {detail.values.map((value, index) => (
                    <Row key={value.title} label={value.title} text={value.value} last={index === detail.values.length - 1} />
                  ))}
                </StatusTable>
              </React.Fragment>
            ))}

            <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>Application Timeline</CardSectionHeader>
            {timeline && timeline.length > 0 ? (
              <ConnectingCheckPoints>
                {timeline.map((value, index) => {
                  return (
                    <CheckPoint key={index} isCompleted={index === 0 ? true : false} label={value.label} customChild={getTimelineCaptions(value)} />
                  );
                })}
              </ConnectingCheckPoints>
            ) : (
              <Loader />
            )}
          </Card>
          <ActionBar>
            {displayMenu && workflowDetails?.data?.nextActions ? (
              <Menu options={workflowDetails?.data?.nextActions.map((action) => action.action)} t={t} onSelect={onActionSelect} />
            ) : null}
            <SubmitBar label="Take Action" onSubmit={() => setDisplayMenu(!displayMenu)} />
          </ActionBar>
        </React.Fragment>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

export default ApplicationDetails;
