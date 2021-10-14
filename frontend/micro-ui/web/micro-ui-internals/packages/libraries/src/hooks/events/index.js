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

const fetchImageLinksFromFilestoreIds = async (filesArray, tenantId) => {
    const ids = filesArray?.map(file => file.fileStoreId) 
    const res = await Digit.UploadServices.Filefetch(ids, tenantId);
    if (res.data.fileStoreIds && res.data.fileStoreIds.length !== 0) {
        return res.data.fileStoreIds.map((o, index) => ({
          actionUrl: o.url.split(",")[0],
          code: "VIEW_ATTACHMENT"
        }));
    } else {
      return [];
    }
  };

const getTransformedLocale = label => {
    if (typeof label === "number") return label;
    return label && label.toUpperCase().replace(/[.:-\s\/]/g, "_");
};

const filterAllEvents = async(data, variant) => {
    const filteredEvents = data.filter(e => e.status === "ACTIVE")
    const events = []
    for(const e of filteredEvents){
        const actionDownloadLinks = e?.eventDetails?.documents?.length > 0 && e?.tenantId ? await fetchImageLinksFromFilestoreIds(e?.eventDetails?.documents, e?.tenantId) : []
        events.push({
            ...e,
            timePastAfterEventCreation: Math.round((new Date().getTime() - e?.auditDetails?.createdTime)/86400000),
            timeApproxiamationInUnits: "CS_SLA_DAY",
            eventNotificationText: e?.description,
            header: e?.eventType === "SYSTEMGENERATED" ? getTransformedLocale(e?.name) : e?.name,
            eventType: e?.eventType,
            actions: [...(e?.actions?.actionUrls ? e?.actions?.actionUrls : []), ...actionDownloadLinks],
            ...variant === "events" || e?.eventType === "EVENTSONGROUND" ? timeStampBreakdown(e?.eventDetails?.fromDate, e?.eventDetails?.toDate) : {},
        })
    }
    return events
}

const variantBasedFilter = async(variant, data) =>{
    switch(variant){
        case "whats-new":
            const allWhatsNewEvents = await filterAllEvents(data.events, variant)
            return allWhatsNewEvents.filter( i => i?.actions?.length )
        case "events":
            return await filterAllEvents(data.events, variant)
        default:
            return await filterAllEvents(data.events, variant)
    }
}

const getEventsData = async (variant, tenantId) => {
    const data = await Digit.EventsServices.Search({tenantId, ...variant === "events" ? {filter: {eventTypes: "EVENTSONGROUND"}} : {} })
    const allEventsData = await variantBasedFilter(variant, data)
    return allEventsData
}

const useEvents = ({tenantId, variant, config={}}) => useQuery(
    ["EVENTS_SEARCH", tenantId, variant],
    () => getEventsData(variant, tenantId),
    { 
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