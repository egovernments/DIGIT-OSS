import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import toolbarStyles from './UiTableHeaderStyle'
import { convertLabelValue } from '../../../utils/commons';

class UiTableHead extends Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    // const { classes, onSelectAllClick, Globfilter, order, orderBy, numSelected, rowCount, columnData, needHash, needCheckBox } = this.props;
    const { classes, Globfilter, order, orderBy, columnData, needHash,strings={} } = this.props;
    return (
      <TableHead className={classes.root}>
        <TableRow>
          {/* {
            needCheckBox ?
              <TableCell
                style={{ width: this.props.width ? this.props.width : 'auto' }}>
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={numSelected > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                />
              </TableCell>
              :
              null
          }*/}
          {
            needHash ?
              <TableCell style={{ width: this.props.width ? this.props.width : 'auto' }}>
                <span>#</span>
              </TableCell>
              :
             null
          } 

          {columnData.map((column, idx) => {

            return (
              <TableCell
                key={column.id}
                // stickyHeader={column.stickyHeader}
                align={(column.numeric === true) ? 'left' : 'left'}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
                style={{ width: this.props.width ? this.props.width : 'auto' }}
              >
                {
                  idx !== -1 ? <TableSortLabel
                    style={{ flexDirection: "row" }}
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >

                    {convertLabelValue(column.label,strings)+ (column.colType === 'amount' ? ' (In ' + Globfilter['Denomination'] + ')' : ' ')}
                  </TableSortLabel>
                    :
                    <span>{convertLabelValue(column.label,strings) }</span>
                }
              </TableCell>
            );
          }, this)}
          {/* <TableCell style={{ width: this.props.width ? this.props.width : 'auto', minWidth: 100 }}>
            {searchComponent}
          </TableCell> */}
        </TableRow>
      </TableHead>
    );
  }
}


export default withStyles(toolbarStyles)(UiTableHead);