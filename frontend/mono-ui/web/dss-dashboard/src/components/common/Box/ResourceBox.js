import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './ResourceBoxStyles';
import BarCharts from '../Charts/BarCharts'


class ResourceBox extends Component {

    render() {
        let classes = this.props.classes;
        return (
            <div className={[classes.container,'resourcebox_chart'].join(' ')}>

                <div className={[classes.item].join(' ')}>
                    <div className={classes.fontLarge} >
                        {this.props.heading}
                    </div>
                    <div className={classes.fontLarge}>
                        {this.props.subheading}
                    </div>
                </div>
                <div className={classes.item1}>
                    <BarCharts data={this.props.graphData} />
                </div>
                
            </div>
        )
    }
}


export default withStyles(styles)(ResourceBox);