import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import { withStyles } from "@material-ui/core/styles";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,
  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { UploadSingleFile } from "../../ui-molecules-local";

const themeStyles = theme => ({
  documentContainer: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px"
  },
  documentCard: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px"
  },
  documentSubCard: {
    backgroundColor: "#F2F2F2",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "10px",
    border: "#d6d6d6",
    borderStyle: "solid",
    borderWidth: "1px"
  },
  documentIcon: {
    backgroundColor: "#FFFFFF",
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "rgba(0, 0, 0, 0.8700000047683716)",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontWeight: 400,
    letterSpacing: "0.83px",
    lineHeight: "24px",
    marginTop: "12px"
  },
  documentSuccess: {
    borderRadius: "100%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#39CB74",
    color: "white"
  },
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px"
  },
  input: {
    display: "none"
  },
  iconDiv: {
    display: "flex",
    alignItems: "center"
  },
  descriptionDiv: {
    // display: "flex",
    // alignItems: "center",
    marginTop: "30px",
    paddingRight: "20px"
  },
  formControl: {
    minWidth: 250,
    padding: "0px"
  },
  fileUploadDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    // paddingTop: "5px"
  }
});

const styles = {
  documentTitle: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "0.67px",
    lineHeight: "19px",
    paddingBottom: "5px"
  },
  documentName: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "0.67px",
    lineHeight: "19px"
  },
  dropdownLabel: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "12px"
  }
};

const requiredIcon = (
  <sup style={{ color: "#5b5b5b", fontSize: "12px", paddingLeft: "5px" }}>*</sup>
);

class CheckList extends Component {
  state = {
    uploadedDocIndex: 0,
    checkListUploaRedux : []
  };

  componentDidMount = () => {
    const {
      documentsList,
      prepareFinalObject
    } = this.props;
    const { checkListUploaRedux } = this.state;
    let index = 0;
    documentsList.forEach(docType => {
      docType.cards &&
        docType.cards.forEach(card => {
          if (card.subCards) {
            card.subCards.forEach(subCard => {
              let oldDocType = get(
                checkListUploaRedux,
                `[${index}].documentType`
              );
              let oldDocCode = get(
                checkListUploaRedux,
                `[${index}].documentCode`
              );
              let oldDocSubCode = get(
                checkListUploaRedux,
                `[${index}].documentSubCode`
              );
              if (
                oldDocType != docType.code ||
                oldDocCode != card.name ||
                oldDocSubCode != subCard.name
              ) {
                checkListUploaRedux[index] = {
                  question: docType.code,
                  // documentCode: card.name,
                  // documentSubCode: subCard.name
                };
              }
              index++;
            });
          } else {
            let oldDocType = get(
              checkListUploaRedux,
              `[${index}].documentType`
            );
            let oldDocCode = get(
              checkListUploaRedux,
              `[${index}].documentCode`
            );
            if (oldDocType != docType.code || oldDocCode != card.name) {
              checkListUploaRedux[index] = {
                question: docType.code,
                documentCode: card.name,
                isDocumentRequired: card.required,
                isDocumentTypeRequired: card.dropDownValues
                  ? card.dropDownValues.required
                  : false
              };
            }
            index++;
          }
        });
    });
    this.setState({ ...this.state, "checkListUploaRedux":checkListUploaRedux});
  };

  prepareDocumentsInEmployee = async (checkListDocuments, bpaDetails) => {
    let documnts = [];
    if (checkListDocuments) {
      Object.keys(checkListDocuments).forEach(function (key) {
        if (checkListDocuments && checkListDocuments[key]) {
          documnts.push(checkListDocuments[key]);
        }
      });
    }
    let finalQstn = [];
    if (documnts && documnts.length > 0) {
      documnts.forEach(documents => {
        if (documents && documents.dropDownValues && documents.dropDownValues.value) {
          let qstns = {};
          if(documents.remarks) qstns.remarks = documents.remarks;
          qstns.question = documents.question;
          qstns.value = documents.dropDownValues.value;

          if(bpaDetails.additionalDetails) {
            finalQstn.push(qstns);
          }
        }
      });
      this.props.dispatch(prepareFinalObject(this.props.jsonPath, finalQstn));
    }
  }

  distinct = (value, index, self) => {
    return self.indexOf(value) === index
 };

  handleDocument = async (file, fileStoreId) => {
    let { uploadedDocIndex, checkListUploaRedux } = this.state;
    const { prepareFinalObject, bpaDetails } = this.props;
    const fileUrl = await getFileUrlFromAPI(fileStoreId);

    let checkListDocuments = {
      ...checkListUploaRedux,
      [uploadedDocIndex]: {
        ...checkListUploaRedux[uploadedDocIndex],
        documents: [
          {
            fileName: file.name,
            fileStoreId,
            fileUrl: Object.values(fileUrl)[0]
          }
        ]
      }
    }
    this.setState({ ...this.state, "checkListUploaRedux": checkListDocuments});  
  
    let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true

    if(isEmployee) {
      this.prepareDocumentsInEmployee(checkListDocuments, bpaDetails);
      }

  };

  removeDocument = remDocIndex => {
    const { prepareFinalObject } = this.props;
    prepareFinalObject(
      `checkListUploaRedux.${remDocIndex}.documents`,
      undefined
    );
    this.forceUpdate();
  };

  handleChange = (key, event) => {
    const { prepareFinalObject, bpaDetails } = this.props;
    const { checkListUploaRedux } = this.state;
    let checkListDocuments = {
      ...checkListUploaRedux,
      [key]: {
        ...checkListUploaRedux[key],
        dropDownValues: { value: event.target.value }
      }
    };
    this.setState({ ...this.state, "checkListUploaRedux": checkListDocuments });


    let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true

    if(isEmployee) {
      this.prepareDocumentsInEmployee(checkListDocuments, bpaDetails);
    }
       
  };

  handleFieldChange = (key, event) => {
    const { prepareFinalObject, bpaDetails } = this.props;
    const { checkListUploaRedux } = this.state;
    let checkListDocuments = {
      ...checkListUploaRedux,
      [key]: {
        ...checkListUploaRedux[key],
        remarks: event.target.value
      }
    };
    this.setState({ ...this.state, "checkListUploaRedux" : checkListDocuments});

    let isEmployee = process.env.REACT_APP_NAME === "Citizen" ? false : true

    if(isEmployee) {
      this.prepareDocumentsInEmployee(checkListDocuments, bpaDetails);
    }
       
  };

  getUploadCard = (card, key) => {
    const { classes } = this.props;
    const { checkListUploaRedux } = this.state;
    let jsonPath = (checkListUploaRedux[key] && checkListUploaRedux[key].dropDownValues) ? checkListUploaRedux[key].dropDownValues.value : "";
    let jsonPathForRemarks = (checkListUploaRedux[key] && checkListUploaRedux[key].remarks) ? checkListUploaRedux[key].remarks : "";
    return (
      <Grid container={true}>
        <Grid item={true} xs={2} sm={1} className={classes.iconDiv}>
          {checkListUploaRedux[key] && checkListUploaRedux[key].documents ? (
            <div className={classes.documentSuccess}>
              <Icon>
                <i class="material-icons">done</i>
              </Icon>
            </div>
          ) : (
              <div className={classes.documentIcon}>
                <span>{key + 1}</span>
              </div>
            )}
        </Grid>
        <Grid
          item={true}
          xs={10}
          sm={5}
          md={4}
          align="left"
          className={classes.descriptionDiv}
        >
          <LabelContainer
            labelKey={getTransformedLocale(card.name)}
            style={styles.documentName}
          />
          {card.required && requiredIcon}
        </Grid>
        <Grid item={true} xs={12} sm={6} md={4}>
          {card.dropDownValues && (
            <TextFieldContainer
              select={true}
              label={{ labelKey: getTransformedLocale(card.dropDownValues.label) }}
              placeholder={{ labelKey: getTransformedLocale(card.dropDownValues.label) }}
              data={card.dropDownValues.menu}
              optionValue="code"
              optionLabel="label"
              required={card.required}
              onChange={event => this.handleChange(key, event)}
              value={jsonPath}
            />
          )}
        </Grid>
        <Grid
          item={true}
          xs={12}
          sm={12}
          md={3}
          className={classes.fileUploadDiv}
        >
        <TextFieldContainer
              select={false}
              label={{ labelKey: getTransformedLocale("BPA_ENTER_REMARKS") }}
              placeholder={{ labelKey: getTransformedLocale("BPA_ENTER_REMARKS") }}
              value={jsonPathForRemarks}
              onChange={event => this.handleFieldChange(key, event)}              
            />
          
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes, documentsList } = this.props;
    let index = 0;
    return (
      <div>
        {documentsList &&
          documentsList.map(container => {
            return (
              <div>
                {container.cards.map(card => {
                  return (
                    <div className={classes.documentContainer}>
                      {card.hasSubCards && (
                        <LabelContainer
                          labelKey={card.name}
                          style={styles.documentTitle}
                        />
                      )}
                      {card.hasSubCards &&
                        card.subCards.map(subCard => {
                          return (
                            <div className={classes.documentSubCard}>
                              {this.getUploadCard(subCard, index++)}
                            </div>
                          );
                        })}
                      {!card.hasSubCards && (
                        <div>{this.getUploadCard(card, index++)}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    );
  }
}

CheckList.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { moduleName } = screenConfiguration;
  const bpaDetails = get(
    screenConfiguration.preparedFinalObject,
    "BPA",
    {}
  )
  return { moduleName, bpaDetails };
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
  };
};

export default withStyles(themeStyles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CheckList)
);
