import { useQuery } from "react-query";

const useEvents = ({tenantId, config}) => useQuery(
    ["EVENTS_NOTIFICATION_SEARCH", tenantId],
    () => Digit.EventsServices.Search({tenantId}) , 
    { 
        select: (data) => data.events.filter(e => e.status === "ACTIVE").map((e => ({
            ...e,
            timePastAfterEventCreation: Math.round((new Date().getTime() - e?.auditDetails?.createdTime)/86400000),
            timeApproxiamationInUnits: "CS_SLA_DAY",
            eventNotificationText: e?.description,
            header: `ACTION_TEST_${e?.name}`
        }))),
        ...config
    } )

export default useEvents