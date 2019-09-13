import React from "react";
import PropTypes from "prop-types";
import UploadDefinitionsContainer from "../upload-definitions";
import CardUi from "../components/CardUi";
import ButtonUi from "../components/ButtonUi";
import Snackbar from "material-ui/Snackbar";
import LoadingIndicator from "../components/LoadingIndicator";
import "./style.css";

const CreateJobView = ({
  handleOnChange,
  handleSubmit,
  showJobs,
  message,
  history
}) => {
  return (
    <div>
      <CardUi cardTitle="Upload Definitions">
        <UploadDefinitionsContainer />
      </CardUi>

      <CardUi cardTitle="File Upload">
        <div className="file-input">
          <input
            type="file"
            onChange={e => handleOnChange(e, 5000)}
            accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          />
          Only .xls and .xlsx file allowed. 5MB max file size.
        </div>
      </CardUi>

      <div style={{ textAlign: "center", width: "100%" }} className="col-lg-12">
        <ButtonUi
          style={{ marginRight: "15px" }}
          className={"uploader-primary-button"}
          icon={{ style: { color: "white" }, name: "add" }}
          onClick={handleSubmit}
          label="Create"
          primary={true}
        />
        <ButtonUi
          style={{ marginRight: "15px" }}
          className={"uploader-primary-button"}
          icon={{ style: { color: "white" }, name: "list" }}
          onClick={showJobs}
          label="View Jobs"
          primary={true}
        />
      </div>

      <div className="col-lg-12">
        {message.length ? <h3 className="job-creation-ack">{message}</h3> : ""}
      </div>
    </div>
  );
};

const View = ({
  handleOnChange,
  handleSubmit,
  showJobs,
  message,
  history,
  isLoading,
  messageBarOpen,
  errorMessage
}) => {
  return (
    <div className="common-div-css">
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <Snackbar
            open={messageBarOpen}
            message={errorMessage}
            autoHideDuration={2000}
          />
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <CreateJobView
              history={history}
              handleOnChange={handleOnChange}
              handleSubmit={handleSubmit}
              showJobs={showJobs}
              message={message}
            />
          )}
        </div>
      </div>
    </div>
  );
};

View.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  message: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  history: PropTypes.object,
  messageBarOpen: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string
};

export default View;
