import React from "react";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";
import { Receipt } from "egov-ui-kit/components";

const AssessmentInfoTable = ({ items, tableHeaderItems }) => {
  console.log("items,headeritems", items, tableHeaderItems);
  return (
    <div className="clearfix" style={{ marginBottom: 15 }}>
      <div style={{ marginTop: -5 }}>
        <Receipt receiptItems={tableHeaderItems} />
      </div>
      {/* <div className="col-sm-12 col-xs-12" style={{ marginTop: -10 }}>
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
      </div> */}
      <div>
        {items.values.map((value, index) => {
          return (
            <div>
              <div>
                <div className="receipt-displayInline">
                  <div style={{ marginLeft: "13px" }}>
                    {/* <Icon action={item.iconAction} name={item.iconName} color="#767676" /> */}
                    <Label
                      labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                      label={value.value[0] ? value.value[0] : "NA"}
                      fontSize="16px"
                    />
                  </div>
                </div>
              </div>
              <div style={{ margin: "25px" }}>
                <div style={{ backgroundColor: "white", paddingBottom: "5px" }} className="row">
                  {value.value.map((nestedValue, nestedIndex) => {
                    return (
                      <div>
                        {nestedIndex != 0 && (
                          <div className="col-sm-3 col-xs-12" style={{ marginBottom: 10 }}>
                            <div className="col-sm-12 col-xs-12" style={{ padding: "5px 0px 0px 0px" }}>
                              <Label
                                labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "1.375em" }}
                                label={items.header[nestedIndex] ? items.header[nestedIndex] : "NA"}
                                fontSize="12px"
                              />
                            </div>
                            <div className="col-sm-12 col-xs-12" style={{ padding: "5px 0px 0px 0px" }}>
                              <Label
                                labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                                label={nestedValue ? nestedValue : "NA"}
                                fontSize="16px"
                              />
                            </div>
                          </div>
                        )}
                        {nestedIndex == 0 && (
                          // <div  style={{ justifyContent: "space-between", alignItems: "center", display:'flex' ,margin:"10px 10px 10px "}}>
                          <div className="receipt-displayInline">
                            <div style={{ marginLeft: "13px" }}>
                              {/* <Icon action={item.iconAction} name={item.iconName} color="#767676" /> */}
                              <Label
                                labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                                label={nestedValue ? 'Unit - 1' : "NA"}
                                fontSize="14px"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* {items.header.map((value, index) => {
          return (
            <div className="col-sm-3 col-xs-12" style={{ marginBottom: 10 }}>
              <div className="col-sm-12 col-xs-12" style={{ padding: 0 }}>
                {console.log(value,index,'Jagan-----')}
                {console.log(items.header[index],items.values[0].value[index],"----")}
                <Label
                  labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "1.375em" }}
                  label={items.header[index]}
                  fontSize="12px"
                />
              </div>
              <div className="col-sm-12 col-xs-12" style={{ padding: "5px 0px 0px 0px" }}>
                <Label
                  labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                  label={items.values[0].value[index]}
                  fontSize="16px"
                />
              </div>
            </div>
          );
        })} */}
      </div>
    </div>
  );
};

export default AssessmentInfoTable;
