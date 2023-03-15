import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import styles from './BoxStyles';

class Box extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Paper className={[classes.root, (this.props.kpiBlock) ? classes.kpiBlock : '',  (this.props.STATUS) ? classes[`${this.props.STATUS}`] : ''].join(' ')} elevation={1}>
                {this.props.children}
            </Paper>
        );
    }

}

Box.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Box);