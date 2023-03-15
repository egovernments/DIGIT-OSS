import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import  styles from './KPIBoxStyles';


class KPIBox extends Component {

    render() {
        let classes = this.props.classes;
        return(
        <div className={classes.KpiBox} onClick={(event) => this.props.redirect(this.props.breachLevel,event)}>
            <div className={classes.KPIItem}>
                <div className={[classes.fontMedium,classes.heading].join(' ')}>
                    {this.props.heading}
                </div>
                <div className={[classes.fontSmall,classes.fontLightGray].join(' ')}>
                     {this.props.subHeading}
                </div>
            </div>
            <div className={[classes.KPIItemSmall, classes.fontLarge].join(' ')}>{this.props.noOFItems}</div>            
        </div>
        )
    }
}


export default withStyles(styles)(KPIBox);