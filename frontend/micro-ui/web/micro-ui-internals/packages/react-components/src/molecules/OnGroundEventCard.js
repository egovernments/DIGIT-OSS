import React from "react"
import EventCalendarView from "../atoms/EventCalendarView"
import { MapMarker, Clock } from "../atoms/svgindex"

const OnGroundEventCard = ({onClick = () => null, name, id, eventDetails, onGroundEventMonth="MAR", onGroundEventDate="12 - 16", onGroundEventName="To the moon", onGroundEventLocation="Moon", onGroundEventTimeRange="10:00 am - 1:00 pm", eventCategory, showEventCatergory }) => {
    
    const onEventCardClick = () => onClick(id)

    return <div className="OnGroundEventCard" onClick={onEventCardClick}>
        <EventCalendarView {...{onGroundEventMonth, onGroundEventDate}} />
        <div className="EventDetails">
            <h2>{name}</h2>
            {!showEventCatergory ? <div className="EventLocation">
                <MapMarker />
                <p>{eventDetails?.address}</p>
            </div>: null}
            {!showEventCatergory ? <div className="EventTime">
                <Clock />
                <p>{onGroundEventTimeRange}</p>
            </div> : null}
            {showEventCatergory ? <div className="EventCategory">
                <p>{eventCategory}</p>
            </div> : null}
        </div>
    </div>
}

export default OnGroundEventCard