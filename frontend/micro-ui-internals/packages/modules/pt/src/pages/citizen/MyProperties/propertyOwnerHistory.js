import { Card, CardSubHeader, Header, Loader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { propertyCardBodyStyle, convertEpochToDate } from "../../../utils";
import TransferDetails from "./TransferDetails";
import { useParams } from "react-router-dom";

const propertyOwnerHistory = ({ userType, propertyId: propertyIdFromProp }) => {
  const { t } = useTranslation();
  const { propertyIds } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const audit = true;
  const { isLoading, isError, error, data } = Digit.Hooks.pt.usePropertySearch({
    tenantId,
    filters: { propertyIds: userType === "employee" ? propertyIdFromProp : propertyIds, audit },
  });

  let properties = data?.Properties || " ";
  let ownershipInfo = {};
  const getUniqueList = (list = []) => {
    let newList = [];
    list.map((element) => {
      if (!JSON.stringify(newList).includes(JSON.stringify(element.acknowldgementNumber))) {
        newList.push(element);
      }
    });
    return newList && Array.isArray(newList) && newList.filter((element) => element.creationReason != "UPDATE");
  };
  const transformData = (property) => {
    const { owners, institution, ownershipCategory } = property;
    let itemKey = [];
    owners.map((item) => {
      let owner = {};
      if (institution) {
        owner = {
          PT_COMMON_INSTITUTION_NAME: institution.name || "NA",
          PT_TYPE_OF_INSTITUTION: institution.type || "NA",
          PT_OWNER_NAME: institution.nameOfAuthorizedPerson || "NA",
          PT_COMMON_AUTHORISED_PERSON_DESIGNATION: institution.designation || "NA",
          PT_FORM3_MOBILE_NUMBER: item.mobileNumber || "NA",
          PT_OWNERSHIP_INFO_TEL_PHONE_NO: item.altContactNumber || "NA",
          PT_FORM3_EMAIL_ID: item.emailId || "NA",
          PT_OWNERSHIP_INFO_CORR_ADDR: item.correspondenceAddress || "NA",
          PT_FORM3_OWNERSHIP_TYPE: t(`PROPERTYTAX_BILLING_SLAB_${ownershipCategory.split(".")[0]}`) || "NA",
        };
      } else {
        owner = {
          PT_OWNER_NAME: item.name || "NA",
          PT_FORM3_GENDER: item.gender || "NA",
          PT_FORM3_MOBILE_NUMBER: item.mobileNumber || "NA",
          PT_FORM3_GUARDIAN_NAME: item.fatherOrHusbandName || "NA",
          PT_FORM3_RELATIONSHIP: item.relationship || "NA",
          PT_SPECIAL_OWNER_CATEGORY: item.ownerType || "NA",
          PT_MUTATION_AUTHORISED_EMAIL: item.emailId || "NA",
          PT_OWNERSHIP_INFO_CORR_ADDR: item.permanentAddress || "NA",
        };
      }
      itemKey.push(owner);
    });
    return itemKey;
  };

  if (properties && Array.isArray(properties) && properties.length > 0) {
    let ownerProperty = properties[0];
    properties = properties.filter((data) => data.status == "ACTIVE");
    if (properties.length === 0) {
      properties.push(ownerProperty);
    }
    properties = getUniqueList(properties);
    properties &&
      properties.length > 0 &&
      properties.map((indProperty) => {
        let lastModifiedDate = indProperty.auditDetails.lastModifiedTime;
        indProperty.owners = indProperty.owners.filter((owner) => owner.status == "ACTIVE");
        if (!ownershipInfo[lastModifiedDate]) {
          ownershipInfo[lastModifiedDate] = [];
        }
        ownershipInfo[lastModifiedDate].push(...transformData(indProperty));
      });
  }

  if (isLoading) {
    return <Loader />;
  }

  if (propertyIdFromProp) {
    return (
      <React.Fragment>
        <Card>
          <div>
            {Object.keys(ownershipInfo).map((key, index, arr) => {
              const date = convertEpochToDate(Number(key));
              return (
                <div className="historyContent">
                  <div style={{ display: "flex" }}>
                    <div className="historyCheckpoint zIndex"></div>
                    {index !== Object.keys(ownershipInfo).length - 1 ? (
                      <div className="rowContainerStyles">
                        <CardSubHeader className="historyTableDateLabel bottomMargin"> {t("PT_DATE_OF_TRANSFER")} </CardSubHeader>
                        <CardSubHeader className="historyTableDate bottomMargin">{date}</CardSubHeader>
                      </div>
                    ) : null}
                  </div>
                  <TransferDetails
                    data={ownershipInfo[key]}
                    wrapperStyles="wrapperStyles"
                    containerStyles="containerStyles"
                    rowContainerStyles={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                    tableStyles={{
                      display: "grid",
                      gridAutoRows: "min-content",
                      gridTemplateColumns: "repeat(5, minmax(100px, 1fr))",
                    }}
                  />
                  {index !== arr.length - 1 && <div className="checkpoint-connect" style={{ marginLeft: 0, top: "4px" }}></div>}
                </div>
              );
            })}
          </div>
        </Card>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Card>
        <Header>{t("PT_OWNER_HISTORY")}</Header>
        <div>
          {Object.keys(ownershipInfo).map((key) => {
            const date = convertEpochToDate(Number(key));
            return (
              <div style={{ padding: "10px" }}>
                <div className="historyCheckpoint"></div>
                <CardSubHeader className="historyTableDateLabel smallText"> {t("PT_DATE_OF_TRANSFER")} </CardSubHeader>
                <CardSubHeader className="historyTableDate smallText">&nbsp;-&nbsp;{date}</CardSubHeader>
                <TransferDetails data={ownershipInfo[key]} wrapperStyles="wrapperStyles leftBorder" showHorizontalBar={true} />
              </div>
            );
          })}
        </div>
      </Card>
    </React.Fragment>
  );
};

export default propertyOwnerHistory;
