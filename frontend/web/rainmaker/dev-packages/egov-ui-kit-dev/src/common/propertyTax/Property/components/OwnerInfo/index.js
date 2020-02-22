import React, { Component } from "react";
import { Card } from "components";
import { withRouter } from "react-router-dom";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "egov-ui-kit/utils/api";
import Label from "egov-ui-kit/utils/translationNode";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import PropertyInfoCard from "../PropertyInfoCard";
import PendingAmountDialog from "../PendingAmountDue";
import ViewHistoryDialog from "../ViewHistory";
import { ViewHistory, TransferOwnership } from "../ActionItems";
import "./index.css";

const locale = getLocale() || "en_IN";
const localizationLabelsData = initLocalizationLabels(locale);

class OwnerInfo extends Component {
  // Static implementation as of now. Need to change
  state = {
    pendingAmountDue: false,
    viewHistory: false,
    ownershipInfo: {}
  };

  transformData = (data, key) => {
    let itemKey = [];
    data.map(item=>{
      itemKey.push({
        "PT_OWNER_NAME": item.name,
        "PT_GUARDIANS_NAME": item.fatherOrHusbandName,
        "PT_GENDER": item.gender,
        "PT_OWNERSHIP_INFO_DOB": convertEpochToDate(item.dob),
        "PT_OWNER_MOBILE_NO": item.mobileNumber,
        "PT_MUTATION_AUTHORISED_EMAIL": item.emailId,
        "PT_MUTATION_TRANSFEROR_SPECIAL_CATEGORY": item.ownerType,
        "PT_OWNERSHIP_INFO_CORR_ADDR": item.correspondenceAddress,
      });
    });
    return itemKey;
  }

  getPropertyResponse = async (propertyId, tenantId, dialogName) => {    
      const queryObject = [
        { key: "propertyIds", value: propertyId },
        { key: "tenantId", value: tenantId },
        { key: "audit", value: true }
      ];
      let ownershipInfo = {};
      try {
        const payload = await httpRequest(
          "property-services/property/_search",
          "_search",
          queryObject
        );
        if (payload && payload.Properties.length > 0) {
          payload.Properties.map((item)=>{
            const lastModifiedDate = convertEpochToDate(item.auditDetails.lastModifiedTime);
            if(!ownershipInfo[lastModifiedDate]){
              ownershipInfo[lastModifiedDate] = [];
            }
            ownershipInfo[lastModifiedDate].push(...this.transformData(item.owners))
          });
          this.setState({ [dialogName]: true, ownershipInfo });
          return true;
        }
      } catch (e) {
        console.log(e);
      }
  }

  openDialog = async (dialogName) => {
    const { properties } = this.props;
    const { propertyId, tenantId } = properties;
    if(this.props.totalBillAmountDue === 0 && dialogName !== "viewHistory"){
      if(properties.status=="INWORKFLOW"){
        alert('Property is in Workflow ...')
      }else{
        this.props.history.push(`/pt-mutation/apply?consumerCode=${propertyId}&tenantId=${tenantId}`);
      }
    } else if (dialogName === "viewHistory") {
      await this.getPropertyResponse(propertyId, tenantId, dialogName);
      
    } else {
      this.setState({ [dialogName]: true });
    }
  };

  closeDialogue = (dialogName) => {
    this.setState({ [dialogName]: false });
  };

  getOwnerInfo = (latestPropertyDetails, generalMDMSDataById) => {
    const isInstitution =
      latestPropertyDetails.ownershipCategory === "INSTITUTIONALPRIVATE" || latestPropertyDetails.ownershipCategory === "INSTITUTIONALGOVERNMENT";
    const { institution={}, owners: ownerDetails = [], subOwnershipCategory , ownershipCategory } = latestPropertyDetails || {};
    let owner = [];
    if (ownerDetails && ownerDetails.length > 0) {
      owner = ownerDetails[0];
    }
    return (
      ownerDetails &&
      ownerDetails.map((owner) => {
        return {
          items: [
            isInstitution
              ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME_INSTI", localizationLabelsData),
                  value: (institution && institution.name) || "NA",
                }
              : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME", localizationLabelsData),
                  value: owner.name || "NA",
                },
            isInstitution
              ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_DESIGNATION", localizationLabelsData),
                  value: institution.designation || "NA",
                }
              : {
                  key: getTranslatedLabel("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME", localizationLabelsData),
                  value: owner.fatherOrHusbandName || "NA",
                },
            isInstitution
              ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_TYPE_INSTI", localizationLabelsData),
                  value:
                    (institution &&
                      institution.type &&
                      generalMDMSDataById &&
                      generalMDMSDataById["SubOwnerShipCategory"] &&
                      generalMDMSDataById["SubOwnerShipCategory"][institution.type]&&
                      generalMDMSDataById["SubOwnerShipCategory"][institution.type].name) ||
                    "NA",
                }
              : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_GENDER", localizationLabelsData),
                  value: owner.gender || "NA",
                },
            isInstitution
              ? {
                  key: getTranslatedLabel("PT_FORM3_OWNERSHIP_TYPE", localizationLabelsData),
                  value:
                    (institution &&
                      institution.type &&
                      generalMDMSDataById &&
                      generalMDMSDataById["OwnerShipCategory"] &&
                      generalMDMSDataById["OwnerShipCategory"][latestPropertyDetails.ownershipCategory]&&
                      generalMDMSDataById["OwnerShipCategory"][latestPropertyDetails.ownershipCategory].name) ||
                    "NA",
                }
              : {
                  key: getTranslatedLabel("PT_FORM3_OWNERSHIP_TYPE", localizationLabelsData),
                  value: getTranslatedLabel(`PROPERTYTAX_BILLING_SLAB_${subOwnershipCategory}`) || getTranslatedLabel(`PROPERTYTAX_BILLING_SLAB_${ownershipCategory}`)
                    // (institution &&
                    //   institution.type &&
                    //   generalMDMSDataById &&
                    //   generalMDMSDataById["SubOwnerShipCategory"] &&
                    //   generalMDMSDataById["SubOwnerShipCategory"][latestPropertyDetails.ownershipCategory].name) ||
                    // "NA",
                },
            isInstitution
              ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME_OF_AUTH", localizationLabelsData),
                  value: owner.name || "NA",
                }
              : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_MOBILE_NO", localizationLabelsData),
                  value: owner.mobileNumber || "NA",
                },
            isInstitution
              ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_TEL_NO", localizationLabelsData),
                  value: owner.altContactNumber || "NA",
                }
              : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_EMAIL_ID", localizationLabelsData),
                  value: owner.emailId || "NA",
                },
            isInstitution
              ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_MOBILE_NO", localizationLabelsData),
                  value: owner.mobileNumber || "NA",
                }
              : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_USER_CATEGORY", localizationLabelsData),
                  value:
                    (owner &&
                      owner.ownerType &&
                      generalMDMSDataById &&
                      generalMDMSDataById["OwnerType"] &&
                      generalMDMSDataById["OwnerType"][owner.ownerType]&&
                      generalMDMSDataById["OwnerType"][owner.ownerType].name) ||
                    "NA",
                },
            isInstitution
              ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_CORR_ADDR", localizationLabelsData),
                  value: owner.correspondenceAddress || "NA",
                }
              : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_CORR_ADDR", localizationLabelsData),
                  value: owner.permanentAddress || "NA",
                },
                isInstitution
                  ? {
                    }
                  : {
                      key: getTranslatedLabel("PT_OWNERSHIP_DOCUMENT_TYPE", localizationLabelsData),
                      value:owner&&owner.documents&&owner.documents.length>0&&owner.documents[0].documentType? getTranslatedLabel("PT_"+(owner.documents[0].documentType).toUpperCase(),localizationLabelsData) || "NA" : "NA",
                    },
                    isInstitution
                  ? {
                    }
                  : {
                      key: getTranslatedLabel("PT_OWNERSHIP_DOCUMENT_ID", localizationLabelsData),
                      value:owner&&owner.documents&&owner.documents.length>0&&owner.documents[0].documentType? owner.documents[0].documentUid || "NA":"NA",
                    },
          ],
        };
      })
    );
  };

  render() {
    const { properties, editIcon, generalMDMSDataById, ownershipTransfer, viewHistory, totalBillAmountDue } = this.props;
    let ownerInfo = [];
    let multipleOwner = false;
    const header = "PT_OWNERSHIP_INFO_SUB_HEADER";
    if (properties) {
      const { propertyDetails } = properties;
      if (propertyDetails && propertyDetails.length > 0) {
        ownerInfo = this.getOwnerInfo(propertyDetails[0], generalMDMSDataById);
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
                <div className={editIcon ? "pt-rf-title rainmaker-displayInline" : "pt-rf-title rainmaker-displayInline ownerinfo-header"} style={{ justifyContent: "space-between", margin: "5px 0px 5px 0px" }}>
                  <div className={editIcon ? "rainmaker-displayInline" : "rainmaker-displayInline ownerinfo-header"} style={{ alignItems: "center", marginLeft: "13px" }}>
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
                    <div  id= "pt-header-button-container" className="header-button-container">
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
                        {ownerItem && <PropertyInfoCard items={ownerItem.items} ownerInfo={ownerInfo} header={header} editIcon={editIcon}></PropertyInfoCard>}
                      </div>
                    );
                  })}
                </div>
              </div>
            }
          />
        )}

        {this.state.pendingAmountDue && (
          <PendingAmountDialog
            open={this.state.pendingAmountDue}
            amount={totalBillAmountDue}
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

export default withRouter(OwnerInfo);
