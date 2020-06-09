import React from "react";
import PropertyTaxIcon from '../../../images/property-tax.svg'
import DashBoardIcon from '../../../images/dashboards.svg'
import ComplaintsIcon from '../../../images/complaints.svg'
import TradeIcon from '../../../images/trade-license.svg'
import WaterSewerage from '../../../images/water_sewerage.svg'
import Style from './Styles'
import { withStyles } from '@material-ui/core/styles';

import SVG from 'react-inlinesvg';

class Icon extends React.Component {
    constructor(props) {
        super(props);

    }

    renderIcons(type) {
        let { classes } = this.props;

        switch (type.toLowerCase()) {
            case 'overview':
            case 'dss_overview':
                return <SVG src={DashBoardIcon} fill="white" className={classes.icon} style={{ width: '40px', height: '40px', color: 'white' }}></SVG>
            case 'property tax':
            case 'dss_property_tax':
                return <SVG src={PropertyTaxIcon} fill="white" className={classes.icon} style={{ width: '40px', height: '40px' }}></SVG>
            case 'trade license':
            case 'dss_trade_licence':
                return <SVG src={TradeIcon} fill="white" className={classes.icon} style={{ width: '40px', height: '40px' }}></SVG>
            case 'complains':
            case 'dss_complains':
                return <SVG src={ComplaintsIcon} fill="white" className={classes.icon} style={{ width: '40px', height: '40px' }}></SVG>
            case 'water sewerage':
            case 'dss_water_sewerage':
                return <SVG src={WaterSewerage} fill="white" className={classes.icon} style={{ width: '40px', height: '40px' }}></SVG>
            default:
                return <div></div>

        }


    }

    render() {
        return (
            <div>{this.renderIcons(this.props.type)}</div>
        )
    }
}

export default withStyles(Style)(Icon);