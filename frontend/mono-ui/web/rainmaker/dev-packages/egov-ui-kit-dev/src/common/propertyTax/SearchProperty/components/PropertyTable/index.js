import React from "react";
import Button from "egov-ui-kit/components/Button";
import Card from "egov-ui-kit/components/Card";
import TableUi from "egov-ui-kit/components/Tables";
import Label from "egov-ui-kit/utils/translationNode";

const columnData = [
  {
    id: "applicationNo",
    numeric: false,
    disablePadding: false,
    label: "PT_PROPERTY_APPLICATION_NUMBER"
  },
  {
    id: "propertyId",
    numeric: false,
    disablePadding: false,
    label: "PT_SEARCHPROPERTY_TABEL_PID"
  },
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "PT_SEARCHPROPERTY_TABEL_OWNERNAME"
  },
  {
    id: "applicationType",
    numeric: false,
    disablePadding: true,
    label: "PT_SEARCHPROPERTY_TABEL_APPLICATIONTYPE"
  },
  // {
  //   id: "guardianName",
  //   numeric: false,
  //   disablePadding: true,
  //   label: "PT_SEARCHPROPERTY_TABEL_GUARDIANNAME"
  // },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "PT_SEARCHPROPERTY_TABEL_APPLICATIONDATE"
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "PT_SEARCHPROPERTY_TABEL_STATUS"
  }
];

const PropertyTable = ({ tableData=[], onActionClick, sortOnObject }) => {
  return (
    <div className="form-without-button-cont-generic">
      <Card
        textChildren={
          <div>
            <Label
            secondaryText={'('+tableData.length+')'}
              label="PT_SEARCH_PROPERTY_TABLE_HEADERS"
              className="property-search-table-heading"
              fontSize={16}
              labelStyle={{
                fontFamily: "Roboto",
                fontSize: "16px",
                fontWeight: 500,
                letterSpacing: "0px",
                textAlign: "left",
                color: "#484848",
              }}
            />
            <TableUi
              sortOnObject={sortOnObject}
              rowCheckBox={false}
              orderby={"index"}
              columnData={columnData}
              rowData={tableData}
              ActionOnRow={<Button className={"search-table-assess-pay-btn"} label={"PT_PAYMENT_ASSESS_AND_PAY"} onClick={onActionClick} />}
            />
          </div>
        }
      />
    </div>
  );
};

export default PropertyTable;
