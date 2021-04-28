import React from "react";
import "./index.css";
import Receipt from "egov-ui-kit/components/Receipt";

const AssessmentInfoTable = ({ items, tableHeaderItems }) => {
  return (
    <div className="clearfix" style={{ marginBottom: 15 }}>
      <div style={{ marginTop: -5 }}>
        <Receipt receiptItems={tableHeaderItems} />
      </div>
      <div className="col-sm-12 col-xs-12" style={{ marginTop: -10 }}>
        <div className="custom-table-pt-container table-responsive">
          <table className="custom-table-pt table table-bordered">
            <thead>
              <tr className="active">
                {items.header.map((header, index) => {
                  return <th key={index}>{header}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {items.values.map((value, index) => {
                return (
                  <tr key={index}>
                    {value.value.map((nestedValue, nestedIndex) => {
                      return <td key={nestedIndex}>{nestedValue}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssessmentInfoTable;
