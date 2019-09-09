import React from "react";
import { Card, Icon, Button } from "components";
import Label from "utils/translationNode";
import "./index.css";

const Events = ({ events = [] }) => {
  const renderEvent = (event, index) => {
    const { day, month, name, location, time } = event;
    return (
      <Card
        className="home-event"
        key={index}
        id={`home-event-${index}`}
        textChildren={
          <div className="event-card">
            <div className="date">
              <div className="day">
                <Label color="#fff" label={day} />
              </div>
              <div className="month">
                <Label color="#fff" label={month} />
              </div>
            </div>
            <div className="info">
              <div className="event-name">
                <Label label={name} />
              </div>
              <div className="event-location">
                <Icon className="location-icon" action="communication" name="location-on" /> <Label label={location} />
              </div>
              <div className="event-time">
                <Label label={time} />
              </div>
            </div>
          </div>
        }
      />
    );
  };

  return <div>{events.map((event, index) => renderEvent(event, index))}</div>;
};

export default Events;
