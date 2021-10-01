import { useQuery, useMutation } from "react-query";

const tsToDate = (ts) => {
    const plus0 = num => `0${num.toString()}`.slice(-2)
    const d = new Date(ts)
    const month = d.toLocaleString("default", {month: 'short'}).toUpperCase()
    const date = plus0(d.getDate())
    const hour = plus0(d.getHours())
    const minute = plus0(d.getMinutes())

    return {
        month,
        date,
        hour,
        minute
    }
}

const isEqual = (from, to) => from === to ? from : `${from} - ${to}` 

const timeStampBreakdown = (fromTS, toTS) => {
    const fromDateTime = tsToDate(fromTS)
    const toDateTime = tsToDate(toTS)
    return {
        onGroundEventMonth: isEqual(fromDateTime.month, toDateTime.month),
        onGroundEventDate: isEqual(fromDateTime.date, toDateTime.date),
        onGroundEventTimeRange: `${fromDateTime.hour}:${fromDateTime.minute} - ${toDateTime.hour}:${toDateTime.minute}`
    }
}

const getTransformedLocale = label => {
    if (typeof label === "number") return label;
    return label && label.toUpperCase().replace(/[.:-\s\/]/g, "_");
};

const filterAllEvents = (data, variant) => data
.filter(e => e.status === "ACTIVE")
.map((e => ({
        ...e,
        timePastAfterEventCreation: Math.round((new Date().getTime() - e?.auditDetails?.createdTime)/86400000),
        timeApproxiamationInUnits: "CS_SLA_DAY",
        eventNotificationText: e?.description,
        header: getTransformedLocale(e?.name),
        eventType: e?.eventType,
        actions: e?.actions?.actionUrls,
        ...variant === "events" || e?.eventType === "EVENTSONGROUND" ? timeStampBreakdown(e?.eventDetails?.fromDate, e?.eventDetails?.toDate) : {},
    })))

const variantBasedFilter = (variant, data) =>{
    switch(variant){
        case "whats-new":
            return filterAllEvents(data.events, variant).filter( i => i?.actions?.length )
        case "events":
            return filterAllEvents(data.events, variant)
        default:
            return filterAllEvents(data.events, variant)
    }
}

const useEvents = ({tenantId, variant, config={}}) => useQuery(
    ["EVENTS_SEARCH", tenantId, variant],
    () => Digit.EventsServices.Search({tenantId, ...variant === "events" ? {filter: {eventTypes: "EVENTSONGROUND"}} : {} }), 
    { 
        select: (data) => variantBasedFilter(variant, data),
        ...config
    } )

const useClearNotifications = () => useMutation(({tenantId}) => Digit.EventsServices.ClearNotification({tenantId}))

const useNotificationCount = ({tenantId, config={}}) => useQuery(
    ["NOTIFICATION_COUNT", tenantId],
    () => Digit.EventsServices.NotificationCount({tenantId}),
    {
        ...config
    })

export { useEvents, useClearNotifications, useNotificationCount }