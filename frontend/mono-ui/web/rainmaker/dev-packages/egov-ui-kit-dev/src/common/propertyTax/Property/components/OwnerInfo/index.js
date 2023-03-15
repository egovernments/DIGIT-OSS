import { Card } from "components";
import commonConfig from "config/common.js";
import { getRequiredDocuments } from "egov-pt/ui-config/screens/specs/pt-mutation/requiredDocuments/reqDocs";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { httpRequest } from "egov-ui-kit/utils/api";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { MDMS } from "egov-ui-kit/utils/endPoints";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { TransferOwnership, ViewHistory } from "../ActionItems";
import PendingAmountDialog from "../PendingAmountDue";
import PropertyInfoCard from "../PropertyInfoCard";
import TransferOwnerShipDialog from "../TransferOwnerShipDialog";
import ViewHistoryDialog from "../ViewHistory";
import "./index.css";
const locale = getLocale() || "en_IN";
const localizationLabelsData = initLocalizationLabels(locale);

const checkDocument = (owner) => {
  if (owner) {
    if (owner.document && owner.document.documentType && owner.document.documentUid) {
      return owner.document;
    } else if (owner.documents && owner.documents.length > 0 && owner.documents[0].documentType && owner.documents[0].documentUid) {
      return owner.documents[0];
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const getOwnershipTypeInfo = (institution, generalMDMSDataById) => {
  return (
    (institution &&
      institution.type &&
      generalMDMSDataById &&
      generalMDMSDataById["SubOwnerShipCategory"] &&
      generalMDMSDataById["SubOwnerShipCategory"][institution.type] &&
      generalMDMSDataById["SubOwnerShipCategory"][institution.type].name) ||
    "NA"
  );
};

export const getOwnershipTypeInfoCategory = (ownershipCategory, subOwnershipCategory) => {
  return subOwnershipCategory
    ? getTranslatedLabel(`PROPERTYTAX_BILLING_SLAB_${subOwnershipCategory}`, localizationLabelsData)
    : getTranslatedLabel(`PROPERTYTAX_BILLING_SLAB_${ownershipCategory}`, localizationLabelsData);
};

export const getOwnershipInfoUserCategory = (owner, generalMDMSDataById, localizationLabelsData) => {
  return (
    (owner &&
      owner.ownerType &&
      generalMDMSDataById &&
      generalMDMSDataById["OwnerType"] &&
      generalMDMSDataById["OwnerType"][owner.ownerType] &&
      // generalMDMSDataById["OwnerType"][owner.ownerType].name) ||
      getLocaleLabels(
        `COMMON_MASTERS_OWNERTYPE_${generalMDMSDataById["OwnerType"][owner.ownerType].code}`,
        `COMMON_MASTERS_OWNERTYPE_${generalMDMSDataById["OwnerType"][owner.ownerType].code}`
      )) ||
    "NA"
  );
};

export const getOwnerInfo = (latestPropertyDetails, generalMDMSDataById, oldPropertydetails = {}) => {
  const isInstitution =
    latestPropertyDetails.ownershipCategory === "INSTITUTIONALPRIVATE" || latestPropertyDetails.ownershipCategory === "INSTITUTIONALGOVERNMENT";
  let { institution = {}, owners: ownerDetails = [], subOwnershipCategory, ownershipCategory } = latestPropertyDetails || {};
  let owner = [];
  ownerDetails = ownerDetails && Array.isArray(ownerDetails) && ownerDetails.sort((owner1, owner2) => owner1.name.localeCompare(owner2.name));
  if (ownerDetails && ownerDetails.length > 0) {
    owner = ownerDetails[0];
  }
  if (oldPropertydetails && oldPropertydetails.owners) {
    oldPropertydetails.owners =
      oldPropertydetails &&
      oldPropertydetails.owners &&
      Array.isArray(oldPropertydetails.owners) &&
      oldPropertydetails.owners.sort((owner1, owner2) => owner1.name.localeCompare(owner2.name));
  }

  return (
    ownerDetails &&
    ownerDetails.map((owner, index) => {
      return {
        items: [
          isInstitution
            ? {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME_INSTI", localizationLabelsData),
                value: (institution && institution.name) || "NA",
                oldValue: oldPropertydetails && oldPropertydetails.institution && oldPropertydetails.institution.name,
              }
            : {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME", localizationLabelsData),
                value: owner.name || "NA",
                oldValue: oldPropertydetails && oldPropertydetails.owners && oldPropertydetails.owners[index].name,
              },
          isInstitution
            ? {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_DESIGNATION", localizationLabelsData),
                value: institution.designation || "NA",
                oldValue: oldPropertydetails && oldPropertydetails.institution && oldPropertydetails.institution.designation,
              }
            : {
                key: getTranslatedLabel("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME", localizationLabelsData),
                value: owner.fatherOrHusbandName || "NA",
                oldValue:
                  oldPropertydetails &&
                  oldPropertydetails.owners &&
                  Array.isArray(oldPropertydetails.owners) &&
                  oldPropertydetails.owners[index].fatherOrHusbandName,
              },
          isInstitution
            ? {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_TYPE_INSTI", localizationLabelsData),
                value: getOwnershipTypeInfo(institution, generalMDMSDataById),
                oldValue: oldPropertydetails && getOwnershipTypeInfo(oldPropertydetails.institution, generalMDMSDataById),
              }
            : {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_GENDER", localizationLabelsData),
                value:
                  (owner && owner.gender && getLocaleLabels(`PT_FORM3_${owner.gender.toUpperCase()}`, `PT_FORM3_${owner.gender.toUpperCase()}`)) ||
                  getLocaleLabels("NA", "NA"),
                oldValue:
                  oldPropertydetails &&
                  oldPropertydetails.owners &&
                  Array.isArray(oldPropertydetails.owners) &&
                  getLocaleLabels(
                    `PT_FORM3_${oldPropertydetails.owners[index].gender.toUpperCase()}`,
                    `PT_FORM3_${oldPropertydetails.owners[index].gender.toUpperCase()}`
                  ),
                jsonPath: "gender",
              },
          isInstitution
            ? {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_TEL_NO", localizationLabelsData),
                value: owner.altContactNumber || "NA",
                oldValue:
                  oldPropertydetails &&
                  oldPropertydetails.owners &&
                  Array.isArray(oldPropertydetails.owners) &&
                  oldPropertydetails.owners[index].altContactNumber,
              }
            : {
                key: getTranslatedLabel("PT_FORM3_OWNERSHIP_TYPE", localizationLabelsData),
                value: getOwnershipTypeInfoCategory(ownershipCategory, subOwnershipCategory),
                oldValue:
                  oldPropertydetails && getOwnershipTypeInfoCategory(oldPropertydetails.ownershipCategory, oldPropertydetails.subOwnershipCategory),
              },
          isInstitution
            ? {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_MOBILE_NO", localizationLabelsData),
                value: owner.mobileNumber || "NA",
                oldValue:
                  oldPropertydetails &&
                  oldPropertydetails.owners &&
                  Array.isArray(oldPropertydetails.owners) &&
                  oldPropertydetails.owners[index].mobileNumber,
              }
            : {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_MOBILE_NO", localizationLabelsData),
                value: owner.mobileNumber || "NA",
                oldValue:
                  oldPropertydetails &&
                  oldPropertydetails.owners &&
                  Array.isArray(oldPropertydetails.owners) &&
                  oldPropertydetails.owners[index].mobileNumber,
              },
          {
            key: getTranslatedLabel("PT_FORM3_ALT_MOBILE_NO", localizationLabelsData),
            value: owner.alternatemobilenumber || "NA",
            oldValue:
              oldPropertydetails &&
              oldPropertydetails.owners &&
              Array.isArray(oldPropertydetails.owners) &&
              oldPropertydetails.owners[index].alternatemobilenumber,
          },
          {
            key: getTranslatedLabel("PT_OWNERSHIP_INFO_EMAIL_ID", localizationLabelsData),
            value: owner.emailId ? owner.emailId || "NA" : "",
            oldValue:
              oldPropertydetails && oldPropertydetails.owners && Array.isArray(oldPropertydetails.owners) && oldPropertydetails.owners[index].emailId,
          },
          isInstitution
            ? {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_CORR_ADDR", localizationLabelsData),
                value: owner.correspondenceAddress || "NA",
                oldValue:
                  oldPropertydetails &&
                  oldPropertydetails.owners &&
                  Array.isArray(oldPropertydetails.owners) &&
                  oldPropertydetails.owners[index].correspondenceAddress,
              }
            : {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_CORR_ADDR", localizationLabelsData),
                value: owner.permanentAddress || "NA",
                oldValue:
                  oldPropertydetails &&
                  oldPropertydetails.owners &&
                  Array.isArray(oldPropertydetails.owners) &&
                  oldPropertydetails.owners[index].permanentAddress,
              },
          isInstitution
            ? {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME_OF_AUTH", localizationLabelsData),
                value: owner.name || "NA",
                oldValue:
                  oldPropertydetails &&
                  oldPropertydetails.owners &&
                  Array.isArray(oldPropertydetails.owners) &&
                  oldPropertydetails.owners[index].name,
              }
            : {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_USER_CATEGORY", localizationLabelsData),
                value: getOwnershipInfoUserCategory(owner, generalMDMSDataById, localizationLabelsData),
                oldValue:
                  oldPropertydetails &&
                  oldPropertydetails.owners &&
                  Array.isArray(oldPropertydetails.owners) &&
                  getOwnershipInfoUserCategory(oldPropertydetails.owners[index], generalMDMSDataById, localizationLabelsData),
              },
          checkDocument(owner) &&
            (isInstitution
              ? {}
              : {
                  key: getTranslatedLabel("PT_OWNERSHIP_DOCUMENT_TYPE", localizationLabelsData),
                  value: getTranslatedLabel("PT_" + checkDocument(owner).documentType.toUpperCase(), localizationLabelsData) || "NA",
                  oldValue:
                    (oldPropertydetails &&
                      oldPropertydetails.owners &&
                      Array.isArray(oldPropertydetails.owners) &&
                      getTranslatedLabel(
                        "PT_" + checkDocument(oldPropertydetails.owners[index]).documentType.toUpperCase(),
                        localizationLabelsData
                      )) ||
                    "NA",
                }),
          checkDocument(owner) &&
            (isInstitution
              ? {}
              : {
                  key: getTranslatedLabel("PT_OWNERSHIP_DOCUMENT_ID", localizationLabelsData),
                  value: checkDocument(owner).documentUid || "NA",
                  oldValue:
                    (oldPropertydetails &&
                      oldPropertydetails.owners &&
                      Array.isArray(oldPropertydetails.owners) &&
                      checkDocument(oldPropertydetails.owners[index]).documentUid) ||
                    "NA",
                }),
        ],
      };
    })
  );
};
class OwnerInfo extends Component {
  // Static implementation as of now. Need to change
  state = {
    pendingAmountDue: false,
    viewHistory: false,
    docRequired: false,
    ownershipInfo: {},
  };
  openApplyDocsUI = () => {
    this.props.handleField("property", `components.adhocDialog`, "props.open", true);
    this.setState({ docRequired: true });
  };
  componentDidMount = async () => {
    let requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "PropertyTax",
            masterDetails: [
              {
                name: "MutationDocuments",
              },
              {
                name: "UpdateNumber",
              },
            ],
          },
        ],
      },
    };

    try {
      const payload = await httpRequest(MDMS.GET.URL, MDMS.GET.ACTION, [], requestBody);
      const mdmsMutationDocuments = get(payload, "MdmsRes.PropertyTax.MutationDocuments", []);
      this.props.prepareFinalObject("mdmsMutationDocuments", mdmsMutationDocuments);
      this.props.prepareFinalObject("updateNumberConfig", get(payload, "MdmsRes.PropertyTax.UpdateNumber[0]", {}));
      let documentUIChildren = {};
      if (mdmsMutationDocuments && mdmsMutationDocuments.length > 0) {
        documentUIChildren = getRequiredDocuments(mdmsMutationDocuments);
      }
      this.props.prepareFinalObject("mutationDocumentUIChildren", documentUIChildren);
    } catch (e) {
      console.log(e);
    }
  };
  transformData = (property) => {
    const { owners, institution, ownershipCategory } = property;
    let itemKey = [];
    owners.map((item) => {
      let owner = {};
      if (institution) {
        owner = {
          PT_OWNERSHIP_INFO_NAME_INSTI: institution.name || "NA",
          PT_OWNERSHIP_INFO_DESIGNATION: institution.designation || "NA",
          PT_OWNERSHIP_INFO_TYPE_INSTI: institution.type || "NA",
          PT_FORM3_OWNERSHIP_TYPE: getTranslatedLabel(`PROPERTYTAX_BILLING_SLAB_${ownershipCategory.split(".")[0]}`) || "NA",
          PT_OWNERSHIP_INFO_NAME_OF_AUTH: institution.nameOfAuthorizedPerson || "NA",
          PT_OWNERSHIP_INFO_TEL_NO: item.altContactNumber || "NA",
          PT_MUTATION_AUTHORISED_EMAIL: item.emailId || "NA",
          PT_OWNER_MOBILE_NO: item.mobileNumber || "NA",
          PT_OWNERSHIP_INFO_CORR_ADDR: item.correspondenceAddress || "NA",
        };
      } else {
        owner = {
          PT_OWNER_NAME: item.name || "NA",
          PT_GUARDIANS_NAME: item.fatherOrHusbandName || "NA",
          PT_GENDER: item.gender || "NA",
          // "PT_OWNERSHIP_INFO_DOB": convertEpochToDate(item.dob) || "NA",
          PT_OWNER_MOBILE_NO: item.mobileNumber || "NA",
          PT_MUTATION_AUTHORISED_EMAIL: item.emailId || "NA",
          PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY: item.ownerType || "NA",
          PT_OWNERSHIP_INFO_CORR_ADDR: item.permanentAddress || "NA",
        };
        const document = checkDocument(item);
        if (document) {
          owner["PT_OWNERSHIP_DOCUMENT_TYPE"] = getTranslatedLabel("PT_" + document.documentType.toUpperCase(), localizationLabelsData);
          owner["PT_OWNERSHIP_DOCUMENT_ID"] = document.documentUid;
        }
      }
      itemKey.push(owner);
    });
    return itemKey;
  };

  getUniqueList = (list = []) => {
    let newList = [];
    list.map((element) => {
      if (!JSON.stringify(newList).includes(JSON.stringify(element.acknowldgementNumber))) {
        newList.push(element);
      }
    });
    return newList && Array.isArray(newList) && newList.filter((element) => element.creationReason != "UPDATE");
  };
  getPropertyResponse = async (propertyId, tenantId, dialogName) => {
    const queryObject = [
      { key: "propertyIds", value: propertyId },
      { key: "tenantId", value: tenantId },
      { key: "audit", value: true },
    ];
    let ownershipInfo = {};
    try {
      const payload = await httpRequest("property-services/property/_search", "_search", queryObject);
      if (payload && payload.Properties.length > 0) {
        payload.Properties = this.getUniqueList(payload.Properties);
        payload.Properties.map((item) => {
          // let lastModifiedDate = convertEpochToDate(item.auditDetails.lastModifiedTime);
          let lastModifiedDate = item.auditDetails.lastModifiedTime;
          if (!ownershipInfo[lastModifiedDate]) {
            ownershipInfo[lastModifiedDate] = [];
          }
          item.owners = item.owners.filter((owner) => owner.status == "ACTIVE");
          ownershipInfo[lastModifiedDate].push(...this.transformData(item));
        });
        this.setState({ [dialogName]: true, ownershipInfo });
        return true;
      }
    } catch (e) {
      console.log(e);
    }
  };

  openDialog = async (dialogName) => {
    const { properties, waterDetails, sewerDetails } = this.props;
    const { propertyId, tenantId } = properties;
    if (this.props.totalBillAmountDue === 0 && waterDetails.length == 0 && sewerDetails.length == 0 && dialogName !== "viewHistory") {
      if (properties.status != "ACTIVE") {
        this.props.toggleSnackbarAndSetText(true, { labelName: "Property in Workflow", labelKey: "ERROR_PROPERTY_IN_WORKFLOW" }, "error");
      } else {
        // this.openApplyDocsUI();
        this.setState({ docRequired: true });
        // let link = `/pt-mutation/apply-document?consumerCode=${propertyId}&tenantId=${tenantId}`;

        // let moduleName = process.env.REACT_APP_NAME === "Citizen" ? '/citizen' : '/employee';
        // window.location.href =
        //   process.env.NODE_ENV === "production"
        //     ? moduleName + link
        //     : link;
        // this.props.history.push(link);
      }
    } else if (dialogName === "viewHistory") {
      await this.getPropertyResponse(propertyId, tenantId, dialogName);
    } else if (this.props.totalBillAmountDue !== 0 || waterDetails.length > 0 || sewerDetails.length > 0) {
      this.setState({ pendingAmountDue: true });
    } else {
      this.setState({ [dialogName]: true });
    }
  };

  closeDialogue = (dialogName) => {
    this.setState({ [dialogName]: false });
  };

  render() {
    const {
      properties,
      editIcon,
      generalMDMSDataById,
      ownershipTransfer,
      viewHistory,
      totalBillAmountDue,
      waterDetails,
      sewerDetails,
      mdmsMutationDocuments,
      OldProperty,
      updateNumberConfig,
    } = this.props;
    let ownerInfo = [];
    let multipleOwner = false;
    const header = "PT_OWNERSHIP_INFO_SUB_HEADER";
    let oldPropertydetails = "";
    if (OldProperty && Object.keys(OldProperty).length > 0) {
      oldPropertydetails = OldProperty.propertyDetails[0];
      // oldPropertydetails=null;
    }
    if (properties) {
      const { propertyDetails } = properties;
      if (propertyDetails && propertyDetails.length > 0) {
        ownerInfo = oldPropertydetails
          ? getOwnerInfo(propertyDetails[0], generalMDMSDataById, oldPropertydetails)
          : getOwnerInfo(propertyDetails[0], generalMDMSDataById);
        if (ownerInfo.length > 1) {
          multipleOwner = true;
        }
      }
    }

    return (
      <div>
        {ownerInfo && (
          <Card
            style={{ backgroundColor: "rgb(242, 242, 242)", boxShadow: "none" }}
            textChildren={
              <div>
                <div
                  className={editIcon ? "pt-rf-title rainmaker-displayInline" : "pt-rf-title rainmaker-displayInline ownerinfo-header"}
                  style={{ justifyContent: "space-between", margin: "5px 0px 5px 0px" }}
                >
                  <div
                    className={editIcon ? "rainmaker-displayInline" : "rainmaker-displayInline ownerinfo-header"}
                    style={{ alignItems: "center", marginLeft: "13px" }}
                  >
                    {header && (
                      <Label
                        labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                        label={header}
                        fontSize="18px"
                      />
                    )}
                  </div>
                  {{ editIcon } && <span style={{ alignItems: "right" }}>{editIcon}</span>}
                  {/* Transfer ownership button and View History button */}
                  {(viewHistory || ownershipTransfer) && (
                    <div id="pt-header-button-container" className="header-button-container">
                      <ViewHistory viewHistory={viewHistory} openDialog={this.openDialog} />
                      <TransferOwnership ownershipTransfer={ownershipTransfer} openDialog={this.openDialog} />
                    </div>
                  )}
                  {/* ------------------------- */}
                </div>
                <div>
                  {ownerInfo.map((ownerItem, ind) => {
                    return (
                      <div className="col-sm-12 col-xs-12 owner-info-card">
                        {multipleOwner && (
                          <div className="pt-rf-title rainmaker-displayInline" style={{ justifyContent: "space-between", margin: "5px 0px 5px 0px" }}>
                            <div className="rainmaker-displayInline" style={{ alignItems: "center", marginLeft: "13px" }}>
                              {
                                <Label
                                  labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                                  label={"COMMON_OWNER"}
                                  secondaryText={"-" + (ind + 1)}
                                  fontSize="18px"
                                />
                              }
                            </div>
                          </div>
                        )}
                        {ownerItem && (
                          <PropertyInfoCard
                            items={ownerItem.items}
                            additionalKey={{
                              key: getTranslatedLabel("PT_OWNERSHIP_INFO_MOBILE_NO", localizationLabelsData),
                              tenantId: properties.tenantId,
                              key1: getTranslatedLabel("PT_FORM3_ALT_MOBILE_NO", localizationLabelsData),
                              key2: getTranslatedLabel("PT_OWNERSHIP_INFO_CORR_ADDR", localizationLabelsData),
                              key3: getTranslatedLabel("PT_OWNERSHIP_INFO_EMAIL_ID", localizationLabelsData),
                              propertyId: properties.propertyId,
                              updateNumberConfig: updateNumberConfig,
                            }}
                            ownerInfo={ownerInfo}
                            header={header}
                            showEditNumber={viewHistory || ownershipTransfer}
                            editIcon={editIcon}
                          ></PropertyInfoCard>
                        )}
                      </div>
                    );
                  })}
                  {/* <UpdateMobile
                    tenantId={properties.tenantId}
                    propertyId={properties.propertyId}
                    type={"VERIFY"} >
                  </UpdateMobile> */}
                </div>
              </div>
            }
          />
        )}
        {this.state.docRequired && (
          <TransferOwnerShipDialog
            open={this.state.docRequired}
            amount={totalBillAmountDue}
            tenantId={properties.tenantId}
            consumerCode={properties.propertyId}
            documents={mdmsMutationDocuments}
            closeDialogue={() => this.closeDialogue("docRequired")}
            routeUrl={`/pt-mutation/apply?consumerCode=${this.props.properties.propertyId}&tenantId=${this.props.properties.tenantId}`}
          ></TransferOwnerShipDialog>
        )}
        {this.state.pendingAmountDue && (
          <PendingAmountDialog
            open={this.state.pendingAmountDue}
            amount={totalBillAmountDue}
            waterDetails={waterDetails}
            sewerDetails={sewerDetails}
            tenantId={properties.tenantId}
            consumerCode={properties.propertyId}
            closeDialogue={() => this.closeDialogue("pendingAmountDue")}
          ></PendingAmountDialog>
        )}

        {this.state.viewHistory && (
          <ViewHistoryDialog
            open={this.state.viewHistory}
            ownershipInfo={this.state.ownershipInfo}
            closeDialogue={() => this.closeDialogue("viewHistory")}
          ></ViewHistoryDialog>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const mdmsMutationDocuments = get(preparedFinalObject, "mdmsMutationDocuments", []);
  const updateNumberConfig = get(preparedFinalObject, "updateNumberConfig", []);

  return { mdmsMutationDocuments, updateNumberConfig };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleField: (a, b, c, d) => dispatch(handleField(a, b, c, d)),
    prepareFinalObject: (jsonPath, value) => dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OwnerInfo));
