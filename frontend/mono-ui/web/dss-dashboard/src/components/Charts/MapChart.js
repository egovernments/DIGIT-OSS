import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import style from './styles';

const INDIA_TOPO_JSON = require('./india.topo.json');

const PROJECTION_CONFIG = { scale: 200, center: [88.9629, 20.5937] };

// Red Variants
const COLOR_RANGE = [
    '#54D140',
    '#298CFF',
    '#be3d26',
    '#F47738',
    '#ff5533'
];

const DEFAULT_COLOR = '#EEE';

const geographyStyle = {
    default: {
        outline: 'none',
        stroke: "white",
        strokeWidth: "0.5",
        strokeOpacity: "0.9"
    },
    hover: {
        outline: 'none',
        stroke: "white",
        strokeWidth: "0.5",
        strokeOpacity: "0.9"
    },
    pressed: {
        outline: 'none',
        stroke: "white",
        strokeWidth: "0.5",
        strokeOpacity: "0.9"
    }
};

class MapChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tooltipContent: ""
        }
    }

    onMouseEnter(geo, current = { value: 'NA' }, event) {
        this.setState({ tooltipContent: `${geo.properties.name}: ${current.value} ULBs` })
    };

    onMouseLeave(geo, current = { value: 'NA' }, event) {
        this.setState({ tooltipContent: `` });
    };

    render() {
        console.log("Projection Config: " + PROJECTION_CONFIG);

        const data = [
            { id: 'AP', state: 'Andhra Pradesh', value: 1 },
            { id: 'AR', state: 'Arunachal Pradesh', value: 2 },
            { id: 'AS', state: 'Assam', value: 3 },
            { id: 'BR', state: 'Bihar', value: 4 },
            { id: 'CT', state: 'Chhattisgarh', value: 5 },
            { id: 'GA', state: 'Goa', value: 6 },
            { id: 'GJ', state: 'Gujarat', value: 7 },
            { id: 'HR', state: 'Haryana', value: 8 },
            { id: 'HP', state: 'Himachal Pradesh', value: 9 },
            { id: 'JH', state: 'Jharkhand', value: 10 },
            { id: 'KA', state: 'Karnataka', value: 11 },
            { id: 'KL', state: 'Kerala', value: 12 },
            { id: 'MP', state: 'Madhya Pradesh', value: 13 },
            { id: 'MH', state: 'Maharashtra', value: 14 },
            { id: 'MN', state: 'Manipur', value: 15 },
            { id: 'ML', state: 'Meghalaya', value: 16 },
            { id: 'MZ', state: 'Mizoram', value: 17 },
            { id: 'NL', state: 'Nagaland', value: 18 },
            { id: 'OR', state: 'Odisha', value: 19 },
            { id: 'PB', state: 'Punjab', value: 20 },
            { id: 'RJ', state: 'Rajasthan', value: 21 },
            { id: 'SK', state: 'Sikkim', value: 22 },
            { id: 'TN', state: 'Tamil Nadu', value: 23 },
            { id: 'TG', state: 'Telangana', value: 24 },
            { id: 'TR', state: 'Tripura', value: 25 },
            { id: 'UT', state: 'Uttarakhand', value: 26 },
            { id: 'UP', state: 'Uttar Pradesh', value: 27 },
            { id: 'WB', state: 'West Bengal', value: 17 },
            { id: 'WB', state: 'West Bengal', value: 17 },
            { id: 'AN', state: 'Andaman and Nicobar Islands', value: 28 },
            { id: 'CH', state: 'Chandigarh', value: 29 },
            { id: 'DN', state: 'Dadra and Nagar Haveli', value: 19 },
            { id: 'DD', state: 'Daman and Diu', value: 20 },
            { id: 'DL', state: 'Delhi', value: 59 },
            { id: 'JK', state: 'Jammu and Kashmir', value: 25 },
            { id: 'LA', state: 'Ladakh', value: 30 },
            { id: 'LD', state: 'Lakshadweep', value: 31 },
            { id: 'PY', state: 'Puducherry', value: 32 }
        ];

        const colorScale = scaleQuantile()
            .domain(data.map(d => d.value))
            .range(COLOR_RANGE);

        const gradientData = {
            fromColor: COLOR_RANGE[0],
            toColor: COLOR_RANGE[COLOR_RANGE.length - 1],
            min: 0,
            max: data.reduce((max, item) => (item.value > max ? item.value : max), 0)
        };

        return (
            <div className="full-width-height container">
                <ReactTooltip>{this.state.tooltipContent}</ReactTooltip>
                <div style={{ height: "90%", width: "100%" }}>
                    <ComposableMap
                        projectionConfig={PROJECTION_CONFIG}
                        projection="geoMercator"
                        width={"220"}
                        height={"200"}
                        data-tip=""
                    >
                        <Geographies geography={INDIA_TOPO_JSON}>
                            {({ geographies }) =>
                                geographies.map(geo => {
                                    const current = data.find(s => s.id === geo.id);
                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={current ? colorScale(current.value) : DEFAULT_COLOR}
                                            style={geographyStyle}
                                            onMouseEnter={(event) => this.onMouseEnter(geo, current, event)}
                                            onMouseLeave={(event) => this.onMouseLeave(geo, current, event)}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ComposableMap>
                </div>
            </div>
        );
    }
}

// export default App;
const mapStateToProps = (state) => {
    return {
        GFilterData: state.GFilterData,
        chartsGData: state.chartsData,
        strings: state.lang
    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
    }, dispatch)
}
export default withStyles(style)(connect(mapStateToProps, mapDispatchToProps)(MapChart));
