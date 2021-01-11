import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardSubHeader,
  StatusTable,
  Row,
  SubmitBar,
  Loader,
  CardSectionHeader,
  ConnectingCheckPoints,
  CheckPoint,
  ActionBar,
  Menu,
  LinkButton,
  Dropdown,
} from "@egovernments/digit-ui-react-components";

import { useHistory } from "react-router-dom";
import Modal from "../../components/Modal";

const workflowDetails = {
  data: {
    nextActions: [{ action: "GENERATE_DEMAND" }, { action: "MODIFY_APPLICATION" }, { action: "REJECT_APPLICATION" }],
  },
};

const ApplicationDetails = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [vehicle, setVehicle] = useState(null);
  const [vehicleMenu, setVehicleMenu] = useState([
    { key: "Type A", name: "Type A" },
    { key: "Type B", name: "Type B" },
  ]);

  function selectVehicle(value) {
    setVehicle(value);
  }

  const config = [
    {
      body: [
        {
          label: t("ES_VEHICLE_TYPE"),
          type: "dropdown",
          populators: <Dropdown option={vehicleMenu} optionKey="name" id="channel" selected={vehicle} select={selectVehicle} />,
        },
      ],
    },
  ];

  function onActionSelect(action) {
    setSelectedAction(action);
    setDisplayMenu(false);
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

  useEffect(() => {
    console.log("action selected", selectedAction);
    switch (selectedAction) {
      case "GENERATE_DEMAND":
        return setShowModal(true);
      case "MODIFY_APPLICATION":
        return history.push("/digit-ui/employee/fsm/modify-application");
      default:
        console.log("default case");
        break;
    }
  }, [selectedAction]);

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

  const closeModal = () => {
    setShowModal(false);
    setSelectedAction(null);
  };

  const handleGenerateDemand = (data) => {
    closeModal();
    console.log("%c 🍓: handleGenerateDemand -> data ", "font-size:16px;background-color:#582dc7;color:white;", {
      ...data,
      vehicle,
    });
    setVehicle(null);
  };

  const applicationDetails = {
    details: [
      {
        title: t("ES_TITLE_APPLICATION_DETAILS"),
        values: [{ title: t("ES_APPLICATION_NO"), value: "FSM-277373" }],
      },
      {
        title: t("ES_TITLE_APPLICATION_DETAILS"),
        values: [
          { title: t("ES_APPLICATION_DETAILS_APPLICANT_NAME"), value: "Nawal Kishore" },
          { title: t("ES_APPLICATION_DETAILS_APPLICANT_MOBILE_NO"), value: "+91 9645234533" },
          { title: t("ES_APPLICATION_DETAILS_SLUM_NAME"), value: "Jagbandhu huda" },
        ],
      },
      {
        title: t("ES_APPLICATION_DETAILS_PROPERTY_DETAILS"),
        values: [
          { title: t("ES_APPLICATION_DETAILS_PROPERTY_TYPE"), value: "Commercial" },
          { title: t("ES_APPLICATION_DETAILS_PROPERTY_SUB-TYPE"), value: "Shopping Mail" },
        ],
      },
      {
        title: t("ES_APPLICATION_DETAILS_LOCATION_DETAILS"),
        values: [
          { title: t("ES_APPLICATION_DETAILS_LOCATION_LOCALITY"), value: "Alakapuri" },
          { title: t("ES_APPLICATION_DETAILS_LOCATION_CITY"), value: "Berhampur" },
          { title: t("ES_APPLICATION_DETAILS_LOCATION_PINCODE"), value: "345123" },
          { title: t("ES_APPLICATION_DETAILS_LOCATION_LANDMARK"), value: "SBI Bank" },
          { title: t("ES_APPLICATION_DETAILS_LOCATION_GEOLOCATION"), value: "" },
        ],
      },
    ],
  };

  const timeline = [
    {
      label: t("ES_TIMELINE_PENDING_FOR_DEMAND_GENERATION"),
      caption: [""],
    },
    {
      label: t("ES_COMMON_APPLICATION_SUBMITTED"),
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

  return (
    <React.Fragment>
      {Object.keys(applicationDetails).length > 0 ? (
        <React.Fragment>
          <Card style={{ position: "relative" }}>
            <LinkButton
              label={<span style={{ color: "#f47738", marginLeft: "8px" }}>{t("ES_APPLICATION_DETAILS_VIEW_AUDIT_TRAIL")}</span>}
              style={{ position: "absolute", top: 0, right: 20 }}
              onClick={() => {}}
            />
            {applicationDetails.details.map((detail, index) => (
              <React.Fragment key={index}>
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

            <CardSectionHeader style={{ marginBottom: "16px", marginTop: "32px" }}>
              {t("ES_APPLICATION_DETAILS_APPLICATION_TIMELINE")}
            </CardSectionHeader>
            {timeline && timeline.length > 0 ? (
              <ConnectingCheckPoints>
                {timeline.map((value, index) => {
                  return (
                    <React.Fragment key={index}>
                      <CheckPoint
                        keyValue={index}
                        isCompleted={index === 0 ? true : false}
                        label={value.label}
                        customChild={getTimelineCaptions(value)}
                      />
                    </React.Fragment>
                  );
                })}
              </ConnectingCheckPoints>
            ) : (
              <Loader />
            )}
          </Card>
          {showModal ? <Modal closeModal={closeModal} onSubmit={handleGenerateDemand} config={config} /> : null}
          <ActionBar>
            {displayMenu && workflowDetails?.data?.nextActions ? (
              <Menu options={workflowDetails?.data?.nextActions.map((action) => action.action)} t={t} onSelect={onActionSelect} />
            ) : null}
            <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
          </ActionBar>
        </React.Fragment>
      ) : (
        <Loader />
      )}
    </React.Fragment>
  );
};

export default ApplicationDetails;
