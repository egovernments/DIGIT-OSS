import React from "react";
import PropTypes from "prop-types";
import { Image, Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { connect } from "react-redux";
import get from "lodash/get";
import set from "lodash/set";
import "./index.scss";

const logoStyle = {
    height: "61px",
    width: "60px",
  };

class pdfHeader extends React.Component {
    getLogoUrl = (tenantId) => {
        const {cities} = this.props
        const filteredCity = cities && cities.length > 0 && cities.filter(item => item.code === tenantId);
        return filteredCity ? get(filteredCity[0] , "logoId") : "" ;
      }  
    render(){
        const { properties ,cities} = this.props;
        let logoUrl="";
        let corpCity="";
        let ulbGrade="";
        if(get(properties,"tenantId")) {
             logoUrl =get(properties,"tenantId") ?  this.getLogoUrl(get(properties,"tenantId")) : "";
            corpCity = `TENANT_TENANTS_${get(properties,"tenantId").toUpperCase().replace(/[.:-\s\/]/g, "_")}`;
            const selectedCityObject = cities && cities.length > 0 && cities.filter(item => item.code === get(properties,"tenantId"));
            ulbGrade = selectedCityObject ? `ULBGRADE_${get(selectedCityObject[0] ,"city.ulbGrade")}` : "MUNICIPAL CORPORATION";
          }    
    return (
        <div className="pdf-header" id="pdf-header">
                  <Card
                    style={{ display : "flex" , backgroundColor : "rgb(242, 242, 242)" , minHeight: "120px" , alignItems: "center" ,paddingLeft :"10px"}}
                    textChildren={
                      <div style={{display : "flex" }}>
                        {/* <Image  id="image-id" style={logoStyle} source={logoUrl} /> */}
                        <div style={{marginLeft : 30}}>
                          <div style={{display:"flex" , marginBottom : 5}}>
                            <Label label={corpCity} fontSize="20px" fontWeight="500" color="rgba(0, 0, 0, 0.87)" containerStyle={{marginRight : 10 ,textTransform: "uppercase"}}/>
                            <Label label={ulbGrade} fontSize="20px" fontWeight="500" color="rgba(0, 0, 0, 0.87)" />
                          </div>
                          <Label label={"PT_MUTATION_PDF_SUBHEADER"} fontSize="16px" fontWeight="500" />
                        </div>
                      </div>
                    }
                  />
                  <div style={{display : "flex" , justifyContent : "space-between"}}>
                    <div style={{display : "flex"}}>
                      <Label label="PT_PROPERTY_ID" color="rgba(0, 0, 0, 0.87)" fontSize="20px" containerStyle={{marginRight : 10}}/>
                      <Label label={`: ${get(properties,"propertyId")}`} fontSize="20px"/>
                    </div>
                    {/* <div style={{display : "flex"}}>
                      <Label label="Property ID :" color="rgba(0, 0, 0, 0.87)" fontSize="20px"/>
                      <Label label="PT-JLD-2018-09-145323" fontSize="20px"/>
                    </div> */}
                    {/* <div style={{display : "flex"}}>
                      <Label label="PDF_STATIC_LABEL_CONSOLIDATED_BILL_DATE" color="rgba(0, 0, 0, 0.87)" fontSize="20px"/>
                      <Label label="PT-JLD-2018-09-145323" fontSize="20px"/>
                    </div> */}
                  </div>
                </div>
    
       
      );
    }
}


const mapStateToProps = state => {
    const { screenConfiguration } = state;
    const { cities } = state.common || [];
    const {  preparedFinalObject } = screenConfiguration;
    const {Properties}=preparedFinalObject;
    const properties=Properties[0];
    return { properties,cities,preparedFinalObject, state };
  };

export default connect(mapStateToProps)(pdfHeader);

