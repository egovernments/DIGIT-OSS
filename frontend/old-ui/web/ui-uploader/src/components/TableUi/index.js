import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import { getDateFromEpoch } from "../../utils";
import FlatButton from "material-ui/FlatButton";
import MUIDataTable from "mui-datatables";

const TableUi = ({ tableSchema, tableBody, styles = {} }) => {
  const renderTableCell = (fieldType, row, fieldKey) => {
    const field = row[fieldKey];

    switch (fieldType) {
      case "label":
        return field;
      case "time":
        return getDateFromEpoch(field);
      case "hyperlink":
        const { href, label } = field;
        const buttonProps = { label, href };
        if (href) {
          buttonProps.target = "_blank";
          buttonProps.primary = true;
        } else {
          buttonProps.disabled = true;
        }
        return <FlatButton {...buttonProps} />;
      default:
        break;
    }
  };

  const renderTableHeader = () => {
    return (
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          {tableSchema.map((row, index) => {
            return (
              <TableHeaderColumn
                style={{ ...row.style, color: "#484848", fontWeight: 900 }}
                key={index}
              >
                {row.label}
              </TableHeaderColumn>
            );
          })}
        </TableRow>
      </TableHeader>
    );
  };

  const renderTableBody = () => {
    return (
      <TableBody displayRowCheckbox={false}>
        {tableBody.map((row, index) => {
          return (
            <TableRow key={index}>
              {tableSchema.map(schema => {
                const fieldKey = schema.key;
                const fieldType = schema.fieldType;
                const style = schema.style;
                return (
                  <TableRowColumn style={style} key={index}>
                    {renderTableCell(fieldType, row, fieldKey)}
                  </TableRowColumn>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    );
  };

  const columns = ["Name", "Company", "City", "State"];

  const data = [
    ["Joe James", "Test Corp", "Yonkers", "NY"],
    ["John Walsh", "Test Corp", "Hartford", "CT"],
    ["Bob Herm", "Test Corp", "Tampa", "FL"],
    ["James Houston", "Test Corp", "Dallas", "TX"]
  ];

  return (
    <div>
      <Table>
        {renderTableHeader()}
        {renderTableBody()}
      </Table>
      {/* <MUIDataTable title={"Employee List"} data={data} columns={columns} /> */}
    </div>
  );
};

TableUi.propTypes = {
  tableSchema: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      fieldType: PropTypes.string.isRequired
    }).isRequired
  ),
  tableBody: PropTypes.arrayOf(PropTypes.object).isRequired,
  styles: PropTypes.object
};

export default TableUi;
