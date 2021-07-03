import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './StatusBoxStyles';

class StatusBox extends Component {

    render() {
        let classes = this.props.classes;
        return (
            <div className={classes.container}>
                <div className={classes.row}>
                    <div className={[classes.indicatorBox,classes[`${this.props.data.color}`]].join(' ')}></div>
                    <div className={classes.heading}>{this.props.data.count}</div>
                </div>
                <div className={classes.desc}>{this.props.data.name}</div>
            </div>

        );
    }
}

export default withStyles(styles)(StatusBox);