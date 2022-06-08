import React from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import _ from 'lodash';
import { Sector } from 'recharts';

const styles = {
  tooltipStyle: {
    backgroundColor: '#3A3A3A',
    padding: 5,
  },
  p: {
    display: 'block',
    margin: 0,
    textAlign: 'left',
    padding: 5,
    fontSize: 12,
  },
};

function increaseColorBrightness(hex, lum) {
  // Validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex.replace(/(.)/g, '$1$1');
  }
  lum = lum || 0;
  // Convert to decimal and change luminosity
  var rgb = '#',
    c;
  for (var i = 0; i < 3; ++i) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ('00' + c).substr(c.length);
  }
  return rgb;
}

const PageLoadingIndicator = () => (
  <div style={{ textAlign: 'center', paddingTop: 10 }}>
    <RefreshIndicator size={40} left={0} top={0} status="loading" style={{ display: 'inline-block', position: 'relative' }} />
  </div>
);

const CustomizedAxisTick = props => {
  const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const { x, y, payload, isMonthNumber } = props;
  let value = isMonthNumber ? MONTH_NAMES[parseInt(payload.value) - 1] : payload.value;

  return (
    <text x={x} y={y + 15} textAnchor="middle" fill="#666">
      {value}
    </text>
  );
};

const CustomizedYAxisLabel = props => {
  const { viewBox, title, posY } = props;
  let yVal = posY || 15;
  return (
    <g transform={`translate(${viewBox.x},${viewBox.y})`}>
      <text x={-(viewBox.height / 2)} y={viewBox.y + yVal} textAnchor="middle" fill="#666" transform="rotate(-90)">
        {title}
      </text>
    </g>
  );
};

const CustomizedLegend = props => {
  const { payload } = props;

  const legends = payload.map((data, idx) => {
    const activeStyle = props.activeIndex == idx ? { fontWeight: 'bold' } : {};

    return (
      <li
        key={idx}
        onClick={e => {
          props.onClickActivePie && props.onClickActivePie(data, idx);
        }}
        className={`recharts-legend-item legend-item-${idx}`}
        style={{ display: 'block', marginRight: 10, cursor: 'pointer' }}
      >
        <svg
          className="recharts-surface"
          width="14"
          height="14"
          viewBox="0 0 32 32"
          version="1.1"
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            marginRight: 4,
          }}
        >
          <path stroke="none" fill={data.color} d="M0,4h32v24h-32z" className="recharts-legend-icon" />
        </svg>
        <span className="recharts-legend-item-text" style={{ fontSize: 12, ...activeStyle }}>{`${data.value} - ${data.payload.value} (${(
          data.payload.percent * 100
        ).toFixed(2)}%)`}</span>
      </li>
    );
  });

  return <ul style={{ padding: 5 }}>{legends}</ul>;
};

const CustomizedLineChartLegend = props => {
  const { colors, legends, legendNameKey } = props;

  const legendsList = legends.map((legend, idx) => {
    return (
      <li key={idx} className={`recharts-legend-item legend-item-${0}`} style={{ display: 'inline-block', marginRight: 10 }}>
        <svg
          className="recharts-surface"
          width="14"
          height="14"
          viewBox="0 0 32 32"
          version="1.1"
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            marginRight: 4,
          }}
        >
          <path stroke="none" fill={colors[idx]} d="M0,4h32v24h-32z" className="recharts-legend-icon" />
        </svg>
        <span className="recharts-legend-item-text">{legend[legendNameKey]}</span>
      </li>
    );
  });

  return <ul style={{ padding: 5, marginLeft: 60 }}>{legendsList}</ul>;
};

const RenderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

  return (
    <g>
      {/* <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text> */}
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
    </g>
  );
};

const getTenantId = () => {
  return localStorage.getItem('tenantId') || 'default';
};

const CustomTooltip = props => {
  const { active } = props;
  if (active) {
    const sortByDataValue = payload => {
      //let sortedPayload = [];
      if (!payload || payload.length === 0) return [];

      let sortedDatas = _.orderBy(payload[0].payload.data, ['count'], ['desc']);
      return sortedDatas.map(data => {
        for (let i = 0; i < payload.length; i++) {
          let isMatchesName = _.get(payload[i], `payload.${payload[i].name}`) === data.name;
          if (isMatchesName) return payload[i];
        }
      });
    };

    const { payload, label } = props;

    sortByDataValue(payload);

    const payloadSorted = sortByDataValue(payload);

    const labels = payloadSorted.map((area, idx) => {
      let labelName = _.get(area, `payload.${area.name}`);
      return <p key={idx} className="label" style={{ ...styles.p, color: area.color }}>{`${labelName} : ${area.value}`}</p>;
    });

    return (
      <div className="custom-tooltip" style={styles.tooltipStyle}>
        {labels}
      </div>
    );
  }
  return null;
};

const extractManipulateCityAndWardsPath = (wardResponse, kmlText, cityLatLng, color, totalComplaints) => {
  const removeZDepth = latOrLonval => {
    return (latOrLonval && parseFloat(`${latOrLonval}`.replace(/\d+\s/, ''))) || undefined;
  };

  const convertCoordinatesToPolygonPaths = coordinatesStr => {
    var coordinates = _.chunk(coordinatesStr.split(','), 2);
    return _.transform(
      coordinates,
      function(latLngArry, coordinate) {
        if (coordinate[1] !== undefined && coordinate[0] !== undefined)
          latLngArry.push({
            lat: removeZDepth(coordinate[1]),
            lng: removeZDepth(coordinate[0]),
          });
        return true;
      },
      []
    );
  };

  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(kmlText, 'text/xml');
  let placeMarks = xmlDoc.getElementsByTagName('Placemark');

  let wardsPolygons = [];

  for (let i = 0; i < placeMarks.length; i++) {
    let placeMark = placeMarks[i];
    let boundaryCode = placeMark.getElementsByTagName('name')[0].innerHTML;
    let fillColorStyle = { fillColor: '#FFFFFF', fillOpacity: 0 };

    let wardObj = _.find(wardResponse, function(ward) {
      return ward.boundary == boundaryCode;
    });
    let wardName;
    let noOfComplaints;
    if (wardObj) {
      wardName = wardObj.boundaryName;
      noOfComplaints = wardObj.count;

      let percentage = parseInt(wardObj.count / totalComplaints * 100);
      let fillColor = color;
      let opacityVal = 0.75;

      if (percentage < 10) {
        fillColor = increaseColorBrightness(color, 40 * 0.01);
        opacityVal = 0.25;
      } else if (percentage < 30) {
        fillColor = increaseColorBrightness(color, 30 * 0.01);
        opacityVal = 0.4;
      } else if (percentage < 50) {
        fillColor = increaseColorBrightness(color, 20 * 0.01);
        opacityVal = 0.5;
      } else if (percentage < 80) {
        fillColor = increaseColorBrightness(color, 10 * 0.01);
        opacityVal = 0.65;
      }

      fillColorStyle = { fillColor: fillColor, fillOpacity: opacityVal };
    }

    let ward = {
      name: wardName,
      boundaryCode: boundaryCode,
      noOfComplaints: noOfComplaints || 0,
      style: {
        strokeWeight: 2,
        strokeColor: color || '#FF0000',
        strokeOpacity: 0.8,
        ...fillColorStyle,
      },
      polygons: [],
    };
    let coordinatesStr = placeMark.getElementsByTagName('coordinates');
    for (let j = 0; j < coordinatesStr.length; j++) {
      let coordinateStr = coordinatesStr[j].innerHTML;
      ward.polygons.push(convertCoordinatesToPolygonPaths(coordinateStr));
    }
    wardsPolygons.push(ward);
  }
  return {
    kml: kmlText,
    wardsPolygons,
    cityLatLng,
    openBoundaryInfoWindow: undefined,
  };
};

export {
  PageLoadingIndicator,
  CustomizedAxisTick,
  CustomizedYAxisLabel,
  getTenantId,
  CustomTooltip,
  CustomizedLegend,
  RenderActiveShape,
  extractManipulateCityAndWardsPath,
  CustomizedLineChartLegend,
};
