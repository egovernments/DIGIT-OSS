import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {
  LabelContainer,
  DownloadFileContainer
} from "egov-ui-framework/ui-containers";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import "./index.css";

export const getCurrentStatus = status => {
  switch (status) {
    case "INITIATED":
      return "Initiated";
    case "APPLIED":
      return "Pending for Document verification";
    case "FIELDINSPECTION":
      return "Pending for Field inspection";
    case "PENDINGPAYMENT":
      return "Pending payment";
    case "PENDINGAPPROVAL":
      return "Pending approval";
    case "APPROVED":
      return "Approved";
  }
};

const TaskStatusComponents = ({ currentObj, index }) => {
  return (
    <Grid
      container={true}
      spacing={12}
      style={{ paddingLeft: 10, paddingBottom: 20 }}
    >
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 15, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer labelName="Date" labelKey="TL_DATE_LABEL" />
        </Typography>
        <Typography variant="body2">
          <LabelContainer
            labelName={convertEpochToDate(
              get(currentObj, "auditDetails.lastModifiedTime")
            )}
          />
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 15, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer
            labelName="Updated By"
            labelKey="TL_UPDATED_BY_LABEL"
          />
        </Typography>
        <Typography variant="body2">
          <LabelContainer labelName={get(currentObj, "assigner.name")} />
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        style={{ marginTop: 15, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer
            labelName="Status"
            labelKey="TL_COMMON_TABLE_COL_STATUS"
          />
        </Typography>
        <Typography
          variant="body2"
          classes={{
            body2: "body2-word-wrap"
          }}
        >
          <LabelContainer
            labelName={getCurrentStatus(get(currentObj, "state.state"))}
            labelKey={
              currentObj.businessService
                ? `WF_${currentObj.businessService.toUpperCase()}_${get(
                    currentObj,
                    "state.state"
                  )}`
                : ""
            }
          />
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 15, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer
            labelName="Current Owner"
            labelKey="TL_CURRENT_OWNER_LABEL"
          />
        </Typography>
        <Typography
          variant="body2"
          classes={{
            body2: "body2-word-wrap"
          }}
        >
          <LabelContainer
            labelName={
              get(currentObj, "assignes[0].name")
                ? get(currentObj, "assignes[0].name")
                : "NA"
            }
          />
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3} style={{ marginTop: 15 }}>
        <Typography variant="caption">
          <LabelContainer
            labelName="Comments"
            labelKey="TL_APPROVAL_CHECKLIST_COMMENTS_LABEL"
          />
        </Typography>
        <Typography
          variant="body2"
          classes={{
            body2: "body2-word-wrap"
          }}
        >
          <LabelContainer labelName={get(currentObj, "comment")} />
        </Typography>
      </Grid>
      {get(currentObj, "documents") && (
        <DownloadFileContainer
          data={get(currentObj, "documents")}
          className="review-documents"
          backgroundGrey={true}
          // jsonPath={`workflow.ProcessInstances[${index}]`}
          // sourceJsonPath="documents"
        />
      )}
    </Grid>
  );
};

export default TaskStatusComponents;
