import React, { Component } from "react";
import { Card,Grid } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import PendingAmountDialog from "../PendingAmountDue";
import ViewHistoryDialog from "../ViewHistory";
import { getTranslatedLabel} from "egov-ui-kit/utils/commons"
import {ViewHistory, TransferOwnership} from "../ActionItems";
import { from } from "rxjs";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";

const locale = getLocale() || "en_IN";
const localizationLabelsData = initLocalizationLabels(locale);

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
    const { editIcon, header, backgroundColor = 'rgb(242, 242, 242)', items = [], subSection = [] ,hideSubsectionLabel=false, ownershipTransfer=false, viewHistory=false } = this.props;

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
              {(viewHistory || ownershipTransfer) && <div style={{ display: "flex" }}>
                  {/* <ViewHistory viewHistory={viewHistory} openDialog={this.openDialog} /> */}
                  {/* <TransferOwnership ownershipTransfer={ownershipTransfer} openDialog={this.openDialog} /> */}
              </div>}
              {/* ------------------------- */}
            </div>
            <div>
              {items.map(
                (item) => {
                  return (<div>
                    <div className=" col-md-4 col-sm-6 col-xs-12" style={{ marginBottom: 10, marginTop: 5, minHeight:60 }}>
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
                          fontSize="15px"
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
                      const subUnitHeader=hideSubsectionLabel?undefined:`${getTranslatedLabel("PT_PROPERTY_UNIT", localizationLabelsData)} - ` + (index + 1);
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
