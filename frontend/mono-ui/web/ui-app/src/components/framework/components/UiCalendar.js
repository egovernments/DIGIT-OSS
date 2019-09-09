import React from 'react';
import { translate } from '../../common/common';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { connect } from 'react-redux';
import _ from 'lodash';

BigCalendar.momentLocalizer(moment);

const Event = ({ event }) => {
  return (
    <span>
      <strong>{event.title}</strong>
      {event.desc && ':  ' + event.desc}
    </span>
  );
};

const EventAgenda = ({ event }) => {
  return (
    <span>
      <em style={{ color: 'blue' }}>{event.title}</em>
      <p>{event.desc}</p>
    </span>
  );
};

const UiCalendar = props => {
  const renderCalendar = () => {
    const { item } = props;
    let allViews = Object.keys(BigCalendar.Views).map(k => {
      return BigCalendar.Views[k];
    });
    switch (props.ui) {
      case 'google':
        return (
          <div>
            <BigCalendar
              events={getValue(item.jsonPath)}
              views={allViews}
              step={60}
              defaultDate={new Date()}
              components={{
                event: Event,
                agenda: {
                  event: EventAgenda,
                },
              }}
            />
          </div>
        );
    }
  };

  const getValue = item => {
    var eventsObj = [];
    var edata = props.getVal(item);
    if (edata && edata.length > 0) {
      edata.map((v, i) => {
        var hearingTimeDate = new Date();
        if (v.nextHearingDate && v.nextHearingTime) {
          var timeDate = new Date(parseInt(v.nextHearingTime));
          var dataDate = new Date(v.nextHearingDate);
          hearingTimeDate = timeDate.setDate(dataDate.getDate());
        } else {
          hearingTimeDate = v.nextHearingDate ? v.nextHearingDate : new Date();
        }
        eventsObj.push({
          title: 'Case' + v.caseNo,
          start: new Date(hearingTimeDate),
          end: new Date(hearingTimeDate),
          desc: v.departmentConcernPerson,
        });
      });
    }

    return eventsObj;
  };

  return renderCalendar();
};

export default UiCalendar;
