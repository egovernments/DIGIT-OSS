import React, { Component } from "react";
import { Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";
import { parseInt } from "lodash";

class PropertyInfoCard extends Component {
  render() {
    let { ownerInfo, header, editIcon, backgroundColor = "rgb(242, 242, 242)", items = [], subSection = [], hideSubsectionLabel = false } = this.props;


    var arr = []

    if (subSection.length) {
      for (var key of Object.keys(subSection)) {
        {
      
          arr.push({
            "floor": key,
            "data": subSection[key]
          });


        }
      }
      function compare(a, b) {
        const floorA = parseInt(a.floor);
        const floorB = parseInt(b.floor);
        let comparison = 0;
        if (floorA > floorB) {
          comparison = 1;
        } else if (floorA < floorB) {
          comparison = -1;
        }
        return comparison;


      }
      arr.sort(compare);
    }
    return (
      <div>
        {items && (
          <Card
            style={{ backgroundColor, boxShadow: "none" }}
            className={ownerInfo ? 'pt-info-card-style' : ""}
            textChildren={
              <div>
                <div >
                  {!ownerInfo && <div className="rainmaker-displayInline" style={{ alignItems: "center", marginLeft: "13px", marginTop: 20 }}>
                    {header && (
                      <Label
                        labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                        label={header}
                        fontSize="18px"
                      />
                    )}
                    {{ editIcon } && <span style={{ position: "absolute", right: "25px" }}>{editIcon}</span>}
                  </div>}

                  {items.map((item) => {
                    if (item) {
                      return (
                        <div>
                          <div className={item.key === "Property Type" ? "col-sm-3 col-xs-12 assessment-property-type" : "col-sm-3 col-xs-12"}
                            style={{ marginBottom: 10, marginTop: 5 }}>
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
                        </div>
                      );
                    }
                  })}
                </div>
                {subSection && (
                  <div>
                    {arr && Array.isArray(arr) && arr.length > 0 && Object.values(arr).map((data, index) => {

                      return (
                        <div className="col-sm-12 col-xs-12" style={{ alignItems: "center" }}>
                          {!hideSubsectionLabel && (
                            <Label
                              labelStyle={{
                                letterSpacing: "0.67px",
                                marginTop: 15,
                                color: "rgba(0, 0, 0, 0.87)",
                                fontWeight: "400",
                                lineHeight: "19px",
                              }}
                              label={"PROPERTYTAX_FLOOR_" + arr[index].floor}
                              fontSize="18px"
                            />
                          )}
                          { arr[index].data && arr[index].data.map((unit, index) => {
                            const subUnitHeader = hideSubsectionLabel ? undefined : "Unit - " + (index + 1);
                            return <PropertyInfoCard backgroundColor="white" items={unit} header={subUnitHeader}></PropertyInfoCard>;
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            }
          />
        )}
      </div>
    );
  }
}

export default PropertyInfoCard;
