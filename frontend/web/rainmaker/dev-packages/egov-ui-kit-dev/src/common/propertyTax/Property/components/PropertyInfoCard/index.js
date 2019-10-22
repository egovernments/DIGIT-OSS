
import React, { Component } from "react";
import HistoryIcon from "@material-ui/icons/History";
import { Card, Button, Dialog } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import PendingAmountDialog from "../PendingAmountDue";
import ViewHistoryDialog from "../ViewHistory";

const labelStyle = { 
  letterSpacing: 1.2,
  fontWeight: "600",
  lineHeight: "40px",
}
const buttonStyle = {
  lineHeight: "35px",
  height: "40px",
  backgroundColor: "rgb(242, 242, 242)",
  boxShadow: "none",
  border: "1px solid rgb(254, 122, 81)",
  borderRadius: "2px",
  outline: "none",
  alignItems: "right"
}

const viewHistory = {
  color: "rgba(0, 0, 0, 0.6)",
  fontFamily: "Roboto",
  fontSize: "14px",
  fontWeight: 500,
  letterSpacing: "0.58px",
  lineHeight: "17px",
  textAlign: "left",
  cursor: "pointer",
  paddingRight: "20px"
}

class PropertyInfoCard extends Component {
  state = {
    amount: "4500.00",
    pendingAmountDue: false,
    viewHistory: false
  }
  openDialog = (dialogName) => {
    this.setState({[dialogName]: true});
  }

  closeDialogue = (dialogName)=>{
    this.setState({[dialogName]: false});
  }

  render(){
    const { editIcon, header, backgroundColor = 'rgb(242, 242, 242)', items = [], subSection = [] ,hideSubsectionLabel=false, ownershipTransfer=false } = this.props;

    return (
      <div>
        {items && <Card style={{ backgroundColor ,boxShadow:'none'}}
        textChildren={
          <div >
            <div className="pt-rf-title rainmaker-displayInline" style={{ justifyContent: "space-between", margin: '5px 0px 5px 0px' }}>
              <div className="rainmaker-displayInline" style={{ alignItems: "center", marginLeft: '13px' }}>
                {header&&<Label
                  labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                  label={header}
                  fontSize="18px"
                />}
              </div>
              {{ editIcon } && <span style={{ alignItems: "right" }} >{editIcon}</span>}
              {/* Transfer ownership button and View History button */}
              <div style={{display:"flex"}}>
                  {/* {ownershipTransfer && <div onClick={() => { this.openDialog("viewHistory") }}><HistoryIcon style={{position: "relative", top: "7px", right: "2px", cursor: "pointer"}}/><Label buttonLabel={true} label="PT_VIEW_HISTORY" color="rgb(0, 0, 0, 0.6)" height="40px" labelStyle={viewHistory}/></div>} */}

                  {ownershipTransfer && <Button className="transfer-ownership" label={<Label buttonLabel={true} label="PT_OWNERSHIP_TRANSFER" color="rgb(254, 122, 81)" fontSize="16px" height="40px" labelStyle={labelStyle} />} buttonStyle={buttonStyle} onClick={() => { this.openDialog("pendingAmountDue") }}></Button>}
              </div>
              {/* ------------------------- */}
            </div>
            <div>
              {items.map(
                (item) => {
                  return (<div>
                    <div className="col-sm-3 col-xs-12" style={{ marginBottom: 10, marginTop: 5 }}>
                      <div className="col-sm-12 col-xs-12" style={{ padding: "5px 0px 0px 0px" }}>
                        <Label
                          labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "1.375em" }}
                          label={item.key ? item.key : "NA"}
                          fontSize="12px"
                        />
                      </div>
                      <div className="col-sm-12 col-xs-12" style={{ padding: "5px 0px 0px 0px" }}>
                        <Label
                          labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                          label={item.value ? item.value : "NA"}
                          fontSize="16px"
                        />
                      </div>
                    </div>
                  </div>)
                }
              )}
            </div>
            {subSection &&
              <div>
                {subSection.map((units, unitIndex) => {
                  return <div className="col-sm-12 col-xs-12" style={{ alignItems: "center" }}>
                    {!hideSubsectionLabel&&<Label
                      labelStyle={{ letterSpacing: "0.67px", marginTop: 15, color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                      label={'PROPERTYTAX_FLOOR_'+unitIndex}
                      fontSize="18px"
                    />}
                    {units.map((unit, index) => {
                      const subUnitHeader=hideSubsectionLabel?undefined:"Unit - " + (index + 1);
                      return <PropertyInfoCard backgroundColor='white' items={unit} header={subUnitHeader}></PropertyInfoCard>
                    })}
                  </div>
                })}
              </div>
            }
          </div>
        }
      />}
      {this.state.pendingAmountDue && (<PendingAmountDialog open={this.state.pendingAmountDue} amount={this.state.amount} closeDialogue={()=>this.closeDialogue("pendingAmountDue")}></PendingAmountDialog>)}

      {this.state.viewHistory && (<ViewHistoryDialog open={this.state.viewHistory} amount={this.state.amount} closeDialogue={()=>this.closeDialogue("viewHistory")}></ViewHistoryDialog>)}
      </div>
    );

  }
}

export default PropertyInfoCard;
