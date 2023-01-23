import React from "react"

const EventCalendarView = ({onGroundEventMonth, onGroundEventDate}) => {
    return <div className="EventCalendarView">
        <div className="MonthViewInEventCalendar">
            <h2>{onGroundEventMonth}</h2>
        </div>
        <div className="DateViewInEventCalendar">
            <h2>{onGroundEventDate}</h2>
        </div>
    </div>
}

export default EventCalendarView