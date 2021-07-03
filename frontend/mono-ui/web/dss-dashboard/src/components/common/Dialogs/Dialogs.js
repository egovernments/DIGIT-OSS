import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { withStyles } from '@material-ui/core/styles';
import styles from './Style';
import { Card } from '@material-ui/core';

class Dialogs extends Component {
    close() {
        this.props.close();
    }
    render() {
        let { classes, needCustomTitle } = this.props;
        return (
            <Dialog fullScreen open={this.props.IsOpen} className={classes.rootDialogue}>
                {needCustomTitle ?
                    <Card style={{overflow: 'initial'}}>
                        <div className={classes.heading} onClick={this.close.bind(this)}>
                            <ArrowBack /> <span className={classes.title}>{this.props.title}</span>
                        </div>
                    </Card>
                    : <h3 className={classes.dialogueHeading}>{this.props.title}</h3>}

                <DialogContent className={classes.innerContainer}>
                    {this.props.children}
                </DialogContent>
                {/* test */}
            </Dialog>
        );
    }
}

export default withStyles(styles)(Dialogs);