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
    label=label?.trim();
    return label && label.toUpperCase().replace(/[.:-\s\/]/g, "_");
};
const getTimeFormat = (epochTime) => {
    epochTime = new Date(epochTime);
    const Period = epochTime.getHours() < 12 ? "AM" : "PM";
    const Format = epochTime.getHours() % 12 > 0 ? epochTime.getHours() % 12 : 12;
    return Format.toString() + ":" + epochTime.toString().split(":")[1] + " " + Period;
  };
  const getDateFormat = (epochTime) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    epochTime = new Date(epochTime);
    const day = epochTime.getDate();
    const Month = epochTime.getMonth();
    return day.toString() + " " + monthNames[Month];
  };
  

const getEventSLA = (item) => {
    const days = (Date.now() - item.auditDetails.lastModifiedTime) / (1000 * 60 * 60 * 24);
    let time;
  let unit;
    if (item.eventType === "EVENTSONGROUND") {
      const disp = getDateFormat(item.eventDetails.fromDate) + " " + getTimeFormat(item.eventDetails.fromDate) + "-" + getDateFormat(item.eventDetails.toDate) + " " + getTimeFormat(item.eventDetails.toDate);
      time="";
      unit=disp;
    } else {
      if (days >= 60){
        time=[Math.floor(days / 30)];
        unit="EV_SLA_MONTH";
      } 
      else if (days >= 30){
        time=[Math.floor(days / 30)];
        unit="EV_SLA_MONTH_ONE";
      } 
      else if (days >= 14){
        time=[Math.floor(days / 7)];
        unit="EV_SLA_WEEK";
      } 
      else if (days >= 7) {
        time=[Math.floor(days / 7)];
        unit="EV_SLA_WEEK_ONE";
      }
      else if (days >= 2){
        time=[Math.floor(days)];
        unit="CS_SLA_DAY";
      } 
      else if (days >= 1){
        time=[Math.floor(days)];
        unit="EV_SLA_DAY_ONE";
    } 
      else if ((days % 1) * 24 >= 2) {
        time=[Math.floor((days % 1) * 24)];
        unit="EV_SLA_TIME";
      }
      else if ((days % 1) * 24 >= 1){
        time=[Math.floor((days % 1) * 24)];
        unit="EV_SLA_TIME_ONE";
      }
      else if ((days % 1) * 24 * 60 >= 2) {
        time=[Math.floor((days % 1) * 24 * 60)];
        unit="EV_SLA_MINUTE";
      }
      else if ((days % 1) * 24 * 60 >= 1) {
        time=[Math.floor((days % 1) * 24 * 60)];
        unit="EV_SLA_MINUTE_ONE";

      }
      else{
        time="";
        unit="CS_SLA_NOW";
      }
    }
  
    return {
        time,unit
    };
  };



const filterAllEvents = async(data, variant) => {
    const filteredEvents = data.filter(e => e.status === "ACTIVE")
    const events = []
    for(const e of filteredEvents){
        const actionDownloadLinks = e?.eventDetails?.documents?.length > 0 && e?.tenantId ? await fetchImageLinksFromFilestoreIds(e?.eventDetails?.documents, e?.tenantId) : []
       const slaDetails=getEventSLA(e);
        events.push({
            ...e,
            timePastAfterEventCreation: slaDetails.time,
            timeApproxiamationInUnits: slaDetails.unit,
            //todo
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
    const isLoggedIn = Digit.UserService.getUser()
    const data = await Digit.EventsServices.Search({tenantId, auth: !!isLoggedIn, ...variant === "events" ? {filter: {eventTypes: "EVENTSONGROUND"}} : {} })
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