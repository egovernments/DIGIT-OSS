import React from "react";
import Label from "egov-ui-kit/utils/translationNode";
import { Card } from "components";
import Grid from "@material-ui/core/Grid";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

const data = [
  {
    code: "pb.jalandhar",
    districtCode: "Bahadur",
    population: "156506",
    malePopulation: "82045",
    femalePopulation: "74671",
    workingPopulation: "37.2",
    literacyRate: "79.2%",
    languagesSpoken: "Punjabi, Hindi, Malayalam",
  },
  {
    code: "pb.amritsar",
    districtCode: "Barnala",
    population: "116449",
    malePopulation: "62554",
    femalePopultion: "53895",
    workingPopulation: "35.01",
    literacyRate: "69.46",
    languagesSpoken: "Hindi, Gujarati, Punjabi",
  },

  {
    code: "pb.patankot",
    districtCode: "Dhanaula",
    population: "19920",
    malePopulation: "10521",
    femalePopulation: "6810",
    workingPopulation: "33.48",
    literacyRate: "62.63",
    languagesSpoken: "Gujarati, Punjabi, Hindi",
  },
  {
    code: "pb.nawanshahr",
    districtCode: "Dhanaula",
    population: "12507",
    malePopulation: "6810",
    femalePopulation: "5697",
    workingPopulation: "33.70",
    literacyRate: "57.41",
    languagesSpoken: "Malayalam, Punjabi, Hindi",
  }
];

class MyCity extends React.Component {
  getTransformedData = (dataObj) => {
    const tenantId = JSON.parse(getUserInfo()).permanentCity;
    const filteredData = dataObj.filter((item) => item.code === tenantId);
    const filteredData1 = filteredData.map((item,index) => ({
      code: `TENANT_TENANTS_${getTransformedLocale(item.code)}`,
      districtCode: `${getTransformedLocale(item.code).toUpperCase()}_${item.districtCode.toUpperCase()}_LABEL`,
      statecode: `MYCITY_${item.code.split(".")[0].toUpperCase()}_LABEL`,
      population: item.population,
      malePopulation: item.malePopulation,
      femalePopulation: item.femalePopultion,
      workingPopulation: item.workingPopulation,
      literacyRate: item.literacyRate,
      languagesSpoken: item.languagesSpoken
    })
    )
    return filteredData1;
  };

  render() {
    const cityData = data && this.getTransformedData(data)[0];
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
                      <Label fontSize={14} color={"rgba(0, 0, 0, 0.87)"} label={item} />
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

export default MyCity;
