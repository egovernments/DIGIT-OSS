import { EditIcon, Header, LinkLabel, Loader, Modal } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";
import OwnerHistory from "./PropertyMutation/ownerHistory";

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const PropertyDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id: applicationNumber } = useParams();
  const [showToast, setShowToast] = useState(null);
  const [appDetailsToShow, setAppDetailsToShow] = useState({});
  const [enableAudit, setEnableAudit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateNo, setShowUpdateNo] = useState(false);
  const PT_CEMP = Digit.UserService.hasAccess(["PT_CEMP"]) || false;
  const [businessService, setBusinessService] = useState("PT.CREATE");
  const history = useHistory();
  sessionStorage.setItem("propertyIdinPropertyDetail", applicationNumber);
  // const isMobile = window.Digit.Utils.browser.isMobile();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 780);

  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.pt.useApplicationDetail(t, tenantId, applicationNumber);
  const { data: fetchBillData, isLoading: fetchBillLoading, revalidate } = Digit.Hooks.useFetchBillsForBuissnessService({
    businessService: "PT",
    consumerCode: applicationNumber,
  });

  const { isLoading: auditDataLoading, isError: isAuditError, data: auditData } = Digit.Hooks.pt.usePropertySearch(
    {
      tenantId,
      filters: { propertyIds: applicationNumber, audit: true },
    },
    {
      enabled: enableAudit,
      select: (data) =>
        data.Properties.filter((e) => e.status === "ACTIVE")?.sort((a, b) => b.auditDetails.lastModifiedTime - a.auditDetails.lastModifiedTime),
    }
  );
  const mutation = Digit.Hooks.pt.usePropertyAPI(tenantId, false);

  const { data: UpdateNumberConfig } = Digit.Hooks.useCommonMDMS(Digit.ULBService.getStateId(), "PropertyTax", ["UpdateNumber"], {
    select: (data) => {
      return data?.PropertyTax?.UpdateNumber?.[0];
    },
    retry: false,
    enable: false,
  });

  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth <= 780 && !isMobile) {
        setIsMobile(true);
      } else if (window.innerWidth > 780 && isMobile) {
        setIsMobile(false);
      }
    }

    window.addEventListener("resize", () => {
      onResize();
    });

    return () => {
      window.removeEventListener("resize", () => {
        onResize()
      });
    };
  });


  useEffect(() => {
    if (applicationDetails && !enableAudit) {
      setAppDetailsToShow(_.cloneDeep(applicationDetails));
      if (applicationDetails?.applicationData?.status !== "ACTIVE") {
        setEnableAudit(true);
      }
    }
  }, [applicationDetails]);

  useEffect(() => {
    if (enableAudit && auditData?.length && Object.keys(appDetailsToShow).length) {
      const lastActiveProperty = auditData?.[0];
      lastActiveProperty.owners = lastActiveProperty?.owners?.filter((owner) => owner.status == "ACTIVE");
      if (lastActiveProperty) {
        let applicationDetails = appDetailsToShow?.transformToAppDetailsForEmployee({ property: lastActiveProperty, t });
        setAppDetailsToShow({ ...appDetailsToShow, applicationDetails });
      }
    }
  }, [auditData, enableAudit, applicationDetails]);

  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: applicationDetails?.tenantId || tenantId,
    id: applicationDetails?.applicationData?.acknowldgementNumber,
    moduleCode: "PT.UPDATE",
    role: "PT_CEMP",
  });

  const closeToast = () => {
    setShowToast(null);
  };

  useEffect(() => {
    if (workflowDetails?.data?.applicationBusinessService) {
      setBusinessService(workflowDetails?.data?.applicationBusinessService);
    }
  }, [workflowDetails.data]);

  if (appDetailsToShow?.applicationDetails) {
    appDetailsToShow.applicationDetails = appDetailsToShow?.applicationDetails?.map((e) => {
      if (e.title === "PT_OWNERSHIP_INFO_SUB_HEADER") {
        if (applicationDetails?.applicationData?.status === "ACTIVE") {
          e.additionalDetails.owners.map((owner, ind) => {
            owner.values.map((value) => {
              if (value.title == "PT_OWNERSHIP_INFO_MOBILE_NO") {
                value.textStyle = { display: "flex" };
                value.caption = (
                  <span
                    onClick={() => {
                      setShowModal((prev) => !prev);
                      setShowUpdateNo({
                        name: appDetailsToShow?.applicationData?.owners[ind]?.name,
                        mobileNumber: appDetailsToShow?.applicationData?.owners[ind]?.mobileNumber,
                        index: ind,
                      });
                    }}
                    style={{ cursor: "pointer", display: "inline-flex", paddingLeft: "20px" }}
                  >
                    <EditIcon />
                  </span>
                );
              }
            });
          });
        }
        return {
          ...e,
          Component: () => (
            <LinkLabel
              onClick={() => {
                setShowModal((prev) => !prev);
              }}
              style={{ display: "inline", marginLeft: "25px" }}
            >
              {t("PT_VIEW_HISTORY")}
            </LinkLabel>
          ),
        };
      }
      return e;
    });
  }
  useEffect(() => {
    if (appDetailsToShow?.applicationDetails?.[0]?.values?.[1].title !== "PT_TOTAL_DUES") {
      appDetailsToShow?.applicationDetails?.unshift({
        title: " ",
        asSectionHeader: true,
        belowComponent: () => (
          <LinkLabel
            onClick={() => history.push({ pathname: `/digit-ui/employee/pt/ptsearch/payment-details/${applicationNumber}` })}
            style={isMobile ? { marginTop: "15px", marginLeft: "0px" } : { marginTop: "15px" }}
          >
            {t("PT_VIEW_PAYMENT")}
          </LinkLabel>
        ),
        values: [
          {
            title: "PT_PROPERTY_PTUID",
            value: applicationNumber,
          },
          {
            title: "PT_TOTAL_DUES",
            value: fetchBillData?.Bill[0]?.totalAmount ? `₹ ${fetchBillData?.Bill[0]?.totalAmount}` : "N/A",
          },
        ],
      });
    }
    return () => {
      if (appDetailsToShow?.applicationDetails?.[0]?.values?.[1].title == "PT_TOTAL_DUES" && !(sessionStorage.getItem("revalidateddone") === "done")) {
        appDetailsToShow?.applicationDetails.shift();
        sessionStorage.setItem("revalidateddone", "done");
        revalidate();
      }
    };
  }, [fetchBillData, appDetailsToShow]);

  if (applicationDetails?.applicationData?.status === "ACTIVE") {
    workflowDetails = {
      ...workflowDetails,
      data: {
        ...workflowDetails?.data,
        actionState: {
          nextActions: PT_CEMP
            ? [
              {
                action: "ASSESS_PROPERTY",
                forcedName: "PT_ASSESS",
                showFinancialYearsModal: true,
                customFunctionToExecute: (data) => {
                  delete data.customFunctionToExecute;
                  history.replace({ pathname: `/digit-ui/employee/pt/ptsearch/assessment-details/${applicationNumber}`, state: { ...data } });
                },
                tenantId: Digit.ULBService.getStateId(),
              },
              {
                action: !fetchBillData?.Bill[0]?.totalAmount ? "MUTATE_PROPERTY" : "PT_TOTALDUES_PAY",
                forcedName: "PT_OWNERSHIP_TRANSFER",
                AmountDueForPay: fetchBillData?.Bill[0]?.totalAmount,
                isWarningPopUp: !fetchBillData?.Bill[0]?.totalAmount ? false : true,
                redirectionUrl: {
                  pathname: !fetchBillData?.Bill[0]?.totalAmount
                    ? `/digit-ui/employee/pt/property-mutate-docs-required/${applicationNumber}`
                    : `/digit-ui/employee/payment/collect/PT/${applicationNumber}`,
                  // state: { workflow: { action: "OPEN", moduleName: "PT", businessService } },
                  state: null,
                },
                tenantId: Digit.ULBService.getStateId(),
              },
            ]
            : [],
        },
      },
    };
  }

  if (appDetailsToShow?.applicationData?.status === "ACTIVE" && PT_CEMP) {
    if (businessService == "PT.CREATE") setBusinessService("PT.UPDATE");
    if (!workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "UPDATE")) {
      workflowDetails?.data?.actionState?.nextActions?.push({
        action: "UPDATE",
        redirectionUrl: {
          pathname: `/digit-ui/employee/pt/modify-application/${applicationNumber}`,
          state: { workflow: { action: "OPEN", moduleName: "PT", businessService: "PT.UPDATE" } },
        },
        tenantId: Digit.ULBService.getStateId(),
      });
    }
  }

  if (fetchBillLoading) {
    return <Loader />;
  }
  const UpdatePropertyNumberComponent = Digit?.ComponentRegistryService?.getComponent("EmployeeUpdateOwnerNumber");
  return (
    <div>
      <Header>{t("PT_PROPERTY_INFORMATION")}</Header>
      <ApplicationDetailsTemplate
        applicationDetails={appDetailsToShow}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={appDetailsToShow?.applicationData}
        mutate={null}
        workflowDetails={appDetailsToShow?.applicationData?.status === "ACTIVE" ? workflowDetails : {}}
        businessService="PT"
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
        showTimeLine={false}
        timelineStatusPrefix={"ES_PT_COMMON_STATUS_"}
        forcedActionPrefix={"WF_EMPLOYEE_PT.CREATE"}
      />
      {showModal ? (
        <Modal
          headerBarMain={<h1 className="heading-m">{showUpdateNo ? t("PTUPNO_HEADER") : t("PT_OWNER_HISTORY")}</h1>}
          headerBarEnd={
            <CloseBtn
              onClick={() => {
                setShowModal(false);
                setShowUpdateNo(false);
              }}
            />
          }
          hideSubmit={true}
          isDisabled={false}
          popupStyles={showUpdateNo ? { width: isMobile ? "473px" : "50%"} : { width: "75%"}}
        >
          {showUpdateNo && (
            <UpdatePropertyNumberComponent
              showPopup={setShowModal}
              name={showUpdateNo?.name}
              UpdateNumberConfig={UpdateNumberConfig}
              mobileNumber={showUpdateNo?.mobileNumber}
              t={t}
              onValidation={(data, showToast) => {
                let newProp = { ...appDetailsToShow?.applicationData };
                newProp.owners[showUpdateNo?.index].mobileNumber = data.mobileNumber;
                newProp.creationReason = "UPDATE";
                newProp.workflow = null;
                let newDocObj = { ...data };
                delete newDocObj.mobileNumber;
                newProp.documents = [
                  ...newProp.documents,
                  ...Object.keys(newDocObj).map((key) => ({
                    documentType: key,
                    documentUid: newDocObj[key],
                    fileStoreId: newDocObj[key],
                  })),
                ];
                mutation.mutate(
                  {
                    Property: newProp,
                  },
                  {
                    onError: {},
                    onSuccess: async (successRes) => {
                      showToast();
                      setTimeout(() => {
                        window.location.reload();
                      }, 3000);
                    },
                  }
                );
              }}
            ></UpdatePropertyNumberComponent>
          )}
          {!showUpdateNo && <OwnerHistory propertyId={applicationNumber} userType={"employee"} />}
        </Modal>
      ) : null}
    </div>
  );
};

export default PropertyDetails;
