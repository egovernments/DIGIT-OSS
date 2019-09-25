import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createJob, setInputFile } from "./actions";
import View from "./view";
import { Redirect } from "react-router-dom";
const getFileSize = file => {
  const size = parseFloat(file.size / 1004).toFixed(2);
  return size;
};

class CreateJob extends Component {
  static propTypes = {
    file: PropTypes.object,
    moduleName: PropTypes.string,
    moduleDefinition: PropTypes.string,
    isLoading: PropTypes.bool,
    jobId: PropTypes.string,
    createJob: PropTypes.func.isRequired,
    setInputFile: PropTypes.func.isRequired
  };

  state = {
    message: "",
    messageBarOpen: false,
    errorMessage: ""
  };

  handleOnChange = (e, maxFileSize) => {
    const file = e.target.files[0];
    let uploadDocument = true;
    let fileSize = getFileSize(file);
    if (fileSize > maxFileSize) {
      alert(`Maximum file size can be ${Math.round(maxFileSize / 1000)} MB`);
      uploadDocument = false;
    }
    if (uploadDocument) this.props.setInputFile(file);
  };

  // set messageBar close
  componentWillReceiveProps(nextProps) {
    const currentJobId = this.props.jobId;
    const nextJobId = nextProps.jobId;
    const nextFileInput = nextProps.file;

    if (currentJobId !== nextJobId) {
      const message = `Job Code : ${nextJobId}`;
      this.setState({ message });
    }

    if (nextFileInput !== null) {
      this.setState({ messageBarOpen: false });
    }
  }

  handleSubmit = e => {
    const { file, moduleName, moduleDefinition } = this.props;
    if (file === null) {
      const errorMessage = "Please choose a file";
      this.setState({ messageBarOpen: true, errorMessage });
      return;
    }
    this.props.createJob(moduleName, moduleDefinition, file);
  };

  showJobs = e => {
    let { history } = this.props;
    // history.push("/view-jobs");
    window.basename =
      process.env.NODE_ENV === "production" ? "/app/v2/uploader" : "";
    window.location.href =
      window.location.origin + window.basename + "/view-jobs";
  };

  render() {
    const { handleSubmit, handleOnChange, showJobs } = this;
    const { isLoading, history } = this.props;
    const { message, messageBarOpen, errorMessage } = this.state;

    return (
      <View
        handleOnChange={handleOnChange}
        handleSubmit={handleSubmit}
        showJobs={showJobs}
        isLoading={isLoading}
        history={history}
        message={message}
        messageBarOpen={messageBarOpen}
        errorMessage={errorMessage}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  createJob: (moduleName, moduleDefinition, file) =>
    dispatch(createJob(moduleName, moduleDefinition, file)),
  setInputFile: file => dispatch(setInputFile(file))
});

const mapStateToProps = (state, ownProps) => ({
  moduleName: state.uploadDefinitions.selectedModule,
  moduleDefinition: state.uploadDefinitions.selectedModuleDefinition,
  file: state.jobCreate.inputFile,
  isLoading: state.jobCreate.isFetching,
  jobId: state.jobCreate.jobId
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateJob);
