import React from "react";
import { Dialog, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";

const CalculationDetails = ({ open, closeDialogue, data }) => {
  return (
    <Dialog
      open={open}
      children={[
        <div style={{ margin: 16 }}>
          <Label label="PT_CALCULATION_DETAILS" color="#484848" fontSize="20px" />
          <div style={{ margin: "20px 0px" }}>
            <Label dark={true} label="PT_CALCULATION_LOGIC" containerStyle={{ marginBottom: 5 }} />
            <Label label="PT_CALCULATION_LOGIC_TEXT" />
          </div>
          <div className="clearfix">
            <Label containerStyle={{ marginBottom: 5 }} dark={true} label="PT_CHARGE_SLABS" />
            {data.map((item) => {
              return (
                <div className="col-xs-10 padding-0" style={{ marginBottom: 5 }}>
                  <div className="col-xs-6 padding-0">
                    <Label label={item.label} />
                  </div>
                  <div className="col-xs-6 padding-0">
                    <Label label={item.value} dark={true} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-right" style={{ marginTop: 10 }}>
            <Button
              label={<Label buttonLabel={true} label="PT_OK" fontSize="12px" />}
              primary={true}
              style={{
                height: 40,
                lineHeight: "auto",
                minWidth: "150px",
              }}
              onClick={closeDialogue}
            />
          </div>
        </div>,
      ]}
      bodyStyle={{ backgroundColor: "#ffffff" }}
      isClose={true}
      handleClose={closeDialogue}
      onRequestClose={closeDialogue}
      contentStyle={{ width: "35%" }}
      contentClassName="claculation-details-content"
    />
  );
};

export default CalculationDetails;
