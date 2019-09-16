import React from "react";
import Label from "egov-ui-kit/utils/translationNode";
import { Card } from "components";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";

const data = [
  {
    code: "pb.jalandhar",
    districtCode: "Barnala",
    population: "156506",
    malePopulation: "82045",
    femalePopultion: "74671",
    workingPopulation: "37.2",
    literacyRate: "79.2%",
    languagesSpoken: ["PN", "HN", "EN"],
  },
  {
    code: "pb.amritsar",
    districtCode: "Bahadaur",
    population: "116449",
    malePopulation: "62554",
    femalePopultion: "53895",
    workingPopulation: "35.01",
    literacyRate: "69.46",
    languagesSpoken: ["PN", "GR", "HN"],
  },

  {
    code: "pb.patankot",
    districtCode: "Dhanaula",
    population: "19920",
    malePopulation: "10521",
    femalePopultion: "6810",
    workingPopulation: "33.48",
    literacyRate: "62.63",
    languagesSpoken: ["GR", "PN", "HN"],
  },
  {
    code: "pb.nawanshahr",
    districtCode: "Dhanaula",
    population: "12507",
    malePopulation: "6810",
    femalePopultion: "5697",
    workingPopulation: "33.70",
    literacyRate: "57.41",
    languagesSpoken: ["HN", "PN", "EN"],
  },
];

class MyCity extends React.Component {
  state = {
    currentTenant: "",
  };

  componentWillReceiveProps = (nextProps) => {
    if (!get(this.props, "userInfo.permanentCity")) {
      if (get(nextProps, "userInfo.permanentCity")) {
        const tenantId = JSON.parse(getUserInfo()).permanentCity;
        this.setState({
          currentTenant: tenantId,
        });
      }
    }
  };

  getTransformedData = (dataObj) => {
    const data = dataObj.map((item, index) => ({
      code: `TENANT_TENANTS_${getTransformedLocale(item.code)}`,
      districtCode: `${getTransformedLocale(item.code).toUpperCase()}_${item.districtCode.toUpperCase()}_LABEL`,
      statecode: `MYCITY_${item.code.split(".")[0].toUpperCase()}_LABEL`,
      population: item.population,
      malePopulation: item.malePopulation,
      femalePopulation: item.femalePopultion,
      workingPopulation: item.workingPopulation,
      literacyRate: item.literacyRate,
      languagesSpoken: item.languagesSpoken,
    }));
    return data[0];
  };

  render() {
    const tenantId = JSON.parse(getUserInfo()).permanentCity;
    const { tenantInfo } = this.props;
    const filteredData = tenantInfo && tenantInfo.filter((item) => item.code === tenantId);
    const cityData = filteredData && this.getTransformedData(filteredData);
    return (
      <Card
        style={{ margin: "90px 8px" }}
        textChildren={
          <Grid xs={12} container={true}>
            {cityData &&
              Object.values(cityData).map((item, index) => {
                return (
                  <Grid xs={12} container={true} style={{ marginBottom: "17px" }}>
                    <Grid xs={6}>
                      <Label fontSize={14} color={"rgba(0, 0, 0, 0.60"} label={`MYCITY_${Object.keys(cityData)[index].toUpperCase()}_LABEL`} />
                    </Grid>
                    <Grid xs={6}>
                      {index === Object.values(cityData).length - 1 ? (
                        <div className="rainmaker-displayInline">
                          {item &&
                            item.map((language, index) => {
                              return (
                                <div  className="rainmaker-displayInline">
                                  <Label fontSize={14} color={"rgba(0, 0, 0, 0.87)"} label={`LANGUAGE_${language}`} />
                                  {index !== item.length-1 && <span>, </span>}
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <Label fontSize={14} color={"rgba(0, 0, 0, 0.87)"} label={item} />
                      )}
                    </Grid>
                  </Grid>
                );
              })}
          </Grid>
        }
      />
    );
  }
}

const mapStateToProps = (state) => {
  const tenantInfo = get(state.common, "tenantInfo", []);
  const userInfo = get(state.auth, "userInfo");
  return { tenantInfo, userInfo };
};

export default connect(
  mapStateToProps,
  null
)(MyCity);
