import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default class Tables extends React.Component{
    constructor(props){
      super(props);  
    }
    
    click(){
      this.props.callBack(1);
    }
    render(){
       return (
        <Paper className="root">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>  
                { this.props.tableData.tableHead.map((d,i)=>             
                   <TableCell align="left">{d}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              { this.props.tableData.datasets.map(row => (
                <TableRow key={row[0]} onClick={this.click.bind(this)}>
                    {row.map((d,i)=>                       
                        <TableCell align="left">{d}</TableCell>
                    )}                             
                </TableRow>
              ))}
            </TableBody>            
          </Table>
        </Paper>
      );
    }
}