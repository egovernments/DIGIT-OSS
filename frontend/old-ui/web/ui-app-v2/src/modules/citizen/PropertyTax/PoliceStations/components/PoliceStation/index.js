import React from "react";
import { Card, Icon, Divider, Ratings, Image } from "components";
import Label from "utils/translationNode";
import stationImg from "assets/images/police-station.png";
import "./index.css";

const Events = ({ stations = [] }) => {
  const renderEvent = (event, index) => {
    const { name, distance, ratings } = event;
    return (
      <Card
        className="col-xs-12 home-event"
        style={{ margin: "8px 0px" }}
        key={index}
        id={`home-event-${index}`}
        textChildren={
          <div className="police-station-card row">
            <div style={{ backgroundImage: `url(${stationImg})` }} className="station-image-cont">
              {/* <Image source={stationImg} /> */}
            </div>
            <div className="police-station-info-cont">
              <div className="police-station-name-cont">
                <Label label={name} />
                <Divider className="reciept-divider" inset={true} lineStyle={{ marginLeft: 0, marginRight: 0 }} />
              </div>
              <div className="police-station-rating-cont">
                <Label label={ratings} containerStyle={{ marginRight: 5, marginTop: 2 }} />
                <Ratings
                  color2="#fe7a51"
                  edit={false}
                  value={ratings}
                  id="feedback-ratings"
                  className="feedback-ratings"
                  size={18}
                  count={5}
                  half={false}
                />
              </div>
              <div className="police-station-location-cont">
                <Icon className="location-icon" action="communication" name="location-on" /> <Label label={distance} />
              </div>
            </div>
          </div>
        }
      />
    );
  };

  return <div>{stations.map((event, index) => renderEvent(event, index))}</div>;
};

export default Events;
