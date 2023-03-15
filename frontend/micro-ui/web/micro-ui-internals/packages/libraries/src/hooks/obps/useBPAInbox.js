import useInbox from "../useInbox"

const useBPAInbox = ({ tenantId, filters, config={} }) => {
    const { filterForm, searchForm , tableForm } = filters;
    const user = Digit.UserService.getUser();
    let { moduleName, businessService, applicationStatus, locality, assignee, applicationType } = filterForm;
    const { mobileNumber, applicationNo } = searchForm;
    const { sortBy, limit, offset, sortOrder } = tableForm;
    let applicationNumber = "";
    if (window.location.href.includes("stakeholder-inbox")) moduleName = "BPAREG";
    if (moduleName == "BPAREG") {
      applicationNumber = applicationNo;
      tenantId = Digit.ULBService.getStateId();
    }
    if(applicationType === "BUILDING_OC_PLAN_SCRUTINY" && (window.location.href.includes("obps/inbox") || window.location.href.includes("obps/bpa/inbox"))) {
      businessService = "BPA_OC"
    }

    let _filters = {
        tenantId,
        processSearchCriteria: {
          assignee : assignee === "ASSIGNED_TO_ME"?user?.info?.uuid:"",
          moduleName: moduleName !== "BPAREG"  ? "bpa-services" : "BPAREG", 
          businessService: moduleName !== "BPAREG"  ? (businessService ? [businessService] : ["BPA_LOW", "BPA", "BPA_OC"] ) : (businessService ? [businessService.identifier] : ["ARCHITECT","BUILDER","ENGINEER","STRUCTURALENGINEER", "TOWNPLANNER", "SUPERVISOR"]),
          ...(applicationStatus?.length > 0 ? {status: applicationStatus} : {}),
        },
        moduleSearchCriteria: {
          ...(mobileNumber ? {mobileNumber}: {}),
          ...(!applicationNumber ? applicationNo ? {applicationNo} : {} : (applicationNumber ? {applicationNumber} : {})),
          ...(applicationNumber ? {applicationNumber} : {}),
          ...(sortOrder ? {sortOrder} : {}),
          ...(sortBy ? {sortBy} : {}),
          // ...(applicationType?.length > 0 ? {applicationType: applicationType.map((item) => item.code).join(",")} : {}),
          ...(applicationType && applicationType?.length > 0 ? {applicationType} : {}),
          ...(locality?.length > 0 ? {locality: locality.map((item) => item.code.split("_").pop()).join(",")} : {}),
        },
        limit
    }

    if (!applicationNo) {
      _filters = { ..._filters, offset}
    }

    return useInbox({tenantId, filters: _filters, config:{
        select: (data) =>({
          statuses: data.statusMap, 
          table: data?.items.map( application => ({
              applicationId: application.businessObject.applicationNo || application.businessObject.applicationNumber,
              date: application.businessObject.auditDetails.createdTime,
              businessService: application?.ProcessInstance?.businessService,
              applicationType: application?.businessObject?.additionalDetails?.applicationType ? `WF_BPA_${application?.businessObject?.additionalDetails?.applicationType}` : "-",
              locality: `${application.businessObject?.tenantId?.toUpperCase()?.split(".")?.join("_")}_REVENUE_${application.businessObject?.landInfo?.address?.locality?.code?.toUpperCase()}`,
              status: application?.ProcessInstance?.state?.state,
              state:  application?.ProcessInstance?.state?.state,
              owner: application?.ProcessInstance?.assignes?.[0]?.name || "NA",
              sla: application?.businessObject?.status.match(/^(APPROVED)$/) ? "CS_NA" : Math.round(application.ProcessInstance?.businesssServiceSla / (24 * 60 * 60 * 1000))
          })),
          totalCount: data.totalCount,
          nearingSlaCount: data?.nearingSlaCount
        }), 
        ...config 
      }
    })
}

export default useBPAInbox
