


import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import PropTypes from 'prop-types';
import React from 'react';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
        boxShadow: 'none'
    },
    table: {
        minWidth: 700,
    },
    cell: {
        textAlign: 'left',
        padding: '4px 10px'
    }
});

function ArrearTable(props) {
    const { classes, headers = [], values = [], arrears = 0 } = props;

    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.cell} style={{ fontSize: 'medium', textAlign: 'left' }} ><LabelContainer
                            labelName={'CS_BILL_PERIOD'}
                            labelKey={'CS_BILL_PERIOD'}
                            style={{ fontSize: 'medium' }}
                        /></TableCell>
                        {headers.map((header, ind) => {
                            return (<TableCell className={classes.cell} key={ind}  ><LabelContainer
                                labelName={header}
                                labelKey={header}
                                style={{ fontSize: 'medium' }}
                            /></TableCell>)

                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(values).map((row, ind) => (
                        <TableRow key={ind}>
                            <TableCell className={classes.cell} component="th" scope="row" style={{ textAlign: 'left' }}>{Object.keys(values)[ind]}</TableCell>
                            {headers.map((header, i) => {
                                return (<TableCell className={classes.cell} key={i} >{row[header] && row[header]['value'] || '0'}</TableCell>)
                            })}
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell className={classes.cell} style={{ textAlign: 'left' }}></TableCell>
                        {headers.map((header, ind) => {
                            if (ind == headers.length - 1) {
                                return (<TableCell className={classes.cell} key={ind} >{parseInt(arrears)}</TableCell>)
                            } else if (ind == headers.length - 2) {
                                return (<TableCell className={classes.cell} key={ind} ><LabelContainer
                                    labelName={'COMMON_ARREARS_TOTAL'}
                                    labelKey={'COMMON_ARREARS_TOTAL'}
                                /></TableCell>)
                            }
                            else {
                                return (<TableCell className={classes.cell} key={ind} ></TableCell>)
                            }
                        })}
                    </TableRow>
                </TableBody>
            </Table>
        </Paper>
    );
}

ArrearTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ArrearTable);