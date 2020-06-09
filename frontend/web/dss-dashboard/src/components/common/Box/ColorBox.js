import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import styles from './ColorBoxStyle';
import Grid from '@material-ui/core/Grid';



class ColorBox extends Component {
    render() {
        const { classes } = this.props;
        return (
            <Grid container spacing={24} className={classes.box} onClick={() => this.props.redirect(this.props.STATUS)}>
                <Grid item lg={2} sm={2}>
                    <Paper className={[classes.root, (this.props.STATUS) ? classes[`${this.props.STATUS}`] : ''].join(' ')} elevation={1}>
                    </Paper>
                </Grid>
                <Grid item lg={2} sm={2}>
                    <div className={[classes.KPIItemSmall, classes.fontLarge].join(' ')}>{this.props.noOFItems}</div>
                </Grid>
                <Grid item lg={12} sm={12}>
                    <div className={[classes.fontMedium, classes.heading].join(' ')}>
                        {this.props.heading}
                    </div>
                </Grid>
            </Grid>

        );
    }

}
ColorBox.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ColorBox);