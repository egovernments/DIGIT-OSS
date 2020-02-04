import React from "react";
import { Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";

class DemandCollectionInfo extends React.Component {
  render() {
    const { editIcon,demandProperties=[] } = this.props;
    const header = "PT_DEMAND_AND_COLLECTION";
    return (
      <Card
        style={{ backgroundColor: "rgb(242, 242, 242)", boxShadow: "none" }}
        textChildren={
          <div>
            <div className="pt-rf-title rainmaker-displayInline" style={{ justifyContent: "space-between", margin: "5px 0px 5px 0px" }}>
              <div className="rainmaker-displayInline" style={{ alignItems: "center", marginLeft: "13px" }}>
                {header && (
                  <Label
                    labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                    label={header}
                    fontSize="18px"
                  />
                )}
              </div>
              {{ editIcon } && <span style={{ alignItems: "right" }}>{editIcon}</span>}
            </div>
            {demandProperties[0].propertyDetails[0].demand.map((demand, index) => {
              return demand ? (
                <div>
                {Object.keys(demand.demand).map((datas, ind) => {
                    return (
                      <div>
                      <div>
                      <div className="col-sm-12 col-xs-12" style={{ padding: "5px 0px 0px 15px" }}>
                       <b>{datas}</b>
                       </div>
                        {demand.demand[datas].map((data, ind) => {
                          if(Object.keys(data).length==2){
                            data['PT_COLLECTED']='';
                          }
                          return data['PT_DEMAND']!=""? (
                            <div>
                              {Object.keys(data).map((d, i) => {
                                return (
                                  <div className="col-sm-4 col-xs-12" style={{ marginBottom: 10, marginTop: 5 }}>
                                    <div className="col-sm-12 col-xs-12" style={{ padding: "5px 0px 0px 0px" }}>
                                      <Label
                                        labelStyle={{
                                          letterSpacing: "0.67px",
                                          color: "rgba(0, 0, 0, 0.54)",
                                          fontWeight: "400",
                                          lineHeight: "1.375em",
                                        }}
                                        label={d !='' ? d : "NA"}
                                        fontSize="12px"
                                      />
                                    </div>
                                    <div className="col-sm-12 col-xs-12" style={{ padding: "5px 0px 0px 0px" }}>
                                      <Label
                                        labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                                        label={data[d] !='' ? data[d] : "0"}
                                        fontSize="16px"
                                      />
                                    </div>

                                  </div>
                                );
                              })}
                            </div>
                          ):null;
                        })}
                        </div>
                        <br />
                        <br />
                      </div>

                    );
                  })}
                  </div>

              ):null;
            })}
          </div>
        }
      />
    );
  }
}
export default DemandCollectionInfo;
