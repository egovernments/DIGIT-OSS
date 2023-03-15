import React from "react";
import PropTypes from "prop-types";
import CardUi from "../components/CardUi";
import ButtonUi from "../components/ButtonUi";
import JobStatusFilter from "./UserJobsStatusFilter";
import DateFilter from "./UserJobsDateFilter";
import UserJobsCodeFilter from "./UserJobsCodeFilter";
import RequesterNamesFilter from "./RequesterNamesFilter";
import RequesterFileNamesFilter from "./RequesterFileNamesFilter";
import Grid from "@material-ui/core/Grid";
import Snackbar from "material-ui/Snackbar";

const FiltersView = ({
  handleApplyFilter,
  handleResetFilter,
  message,
  messageBarOpen,
  errorMessage
}) => {
  return (
    <div>
      <CardUi cardTitle="Uploader- Search Jobs">
        <Grid container="true" sm="12" spacing={16}>
          {/* <div
            className="row"
            style={{
              marginTop: "16px",
              paddingBottom: "8px"
            }}
          > */}
          <Snackbar
            open={messageBarOpen}
            message={errorMessage}
            autoHideDuration={2000}
          />

          <Grid sm="4">
            <UserJobsCodeFilter />
          </Grid>
          <Grid item="true" sm="4">
            <RequesterFileNamesFilter />
          </Grid>
          <Grid item="true" sm="4">
            <RequesterNamesFilter />
          </Grid>
          {/* </div> */}

          {/* <div
            className="row"
            style={{
              marginTop: "16px",
              paddingBottom: "8px"
            }}
          > */}

          <DateFilter />

          <Grid item="true" sm="4">
            <JobStatusFilter />
          </Grid>
        </Grid>
        <div
          className="row"
          style={{
            marginTop: "16px",
            paddingBottom: "8px"
          }}
        >
          <div
            style={{ textAlign: "center", width: "100%", margin: "15px 0px" }}
          >
            <ButtonUi
              onClick={handleApplyFilter}
              className={"uploader-primary-button"}
              style={{ marginRight: "15px" }}
              type="button"
              primary={true}
              label="Filter"
              icon={{ style: { color: "white" }, name: "search" }}
            />
            <ButtonUi
              onClick={handleResetFilter}
              type="button"
              label="Reset"
              icon={{ style: { color: "black" }, name: "backspace" }}
            />
          </div>
        </div>
      </CardUi>
    </div>
  );
};

FiltersView.propTypes = {
  handleApplyFilter: PropTypes.func.isRequired,
  handleResetFilter: PropTypes.func.isRequired
};

export default FiltersView;
