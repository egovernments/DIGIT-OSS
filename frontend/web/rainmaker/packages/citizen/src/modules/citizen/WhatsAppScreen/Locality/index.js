import React from "react";
import { Icon } from "components";
import filter from "lodash/filter";
import isUndefined from "lodash/isUndefined";
import { Screen } from "modules/common";
import { withStyles } from "@material-ui/core/styles";
import Label from "egov-ui-kit/utils/translationNode";
import { httpRequest } from "egov-ui-kit/utils/api";
import { List } from "egov-ui-kit/components";
import Input from '@material-ui/core/Input';
import get from "lodash/get";
import queryString from 'query-string';
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";
import {fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions"; 
import { connect } from "react-redux";
import {

  getLocale
} from "egov-ui-kit/utils/localStorageUtils";
// import "./index.css";

const styles = (theme) => ({
  root: {
    padding: "2px 4px",
    // margin: "0px 8px"
    marginLeft: "8px",
    position: "fixed",
    top: "50px",
    height: "48px",
    zIndex: "1100",
    display: "flex",
    alignItems: "center",
    boxShadow: "0px 2px rgba(0, 0, 0, 0.23)",
    backgroundColor: "#fff",
    borderRadius: "28px",
  },
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: "16px",
  },
});

class WhatsAppLocality extends React.Component {
  state = {
    searchText: "",
    data: [],
    localitylist: [],
    cityname: undefined,
    phone: undefined,
  };

  componentDidMount = async () => {
    const { fetchLocalizationLabel } = this.props;
    const values = queryString.parse(this.props.location.search)
    const cityname = values.tenantId;
    const phone = values.phone;
    fetchLocalizationLabel(getLocale(), cityname ||"pb.amritsar", cityname||"pb.amritsar");
    this.setState({
      phone: phone,
    })
    this.setState({
      cityname: cityname,
    })

    const localitydata = await this.getMDMSData(cityname);
    const localityistCode = get(localitydata, "MdmsRes.egov-location.TenantBoundary", []);
    const localitylist = localityistCode.map((item) => {
      return {
        code: item.name,
        label: (this.state.cityname || "pb.amritsar").toUpperCase().replace(/[.]/g, "_") + "_ADMIN_" + item.code,
      }
    })

    this.setState({
      localitylist: localitylist,
    })
  };


  getMDMSData = async (cityName) => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: cityName || "pb.amritsar",
        moduleDetails: [
          {
            moduleName: "egov-location",
            masterDetails: [
              {
                name: "TenantBoundary", filter: `[?(@.hierarchyType.code == "ADMIN")].boundary.children.*.children.*.children.*`
              }
            ]
          },
        ]
      }
    };
    try {
      const payload = await httpRequest(
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      console.log("aaaa", payload);
      return payload;

    } catch (e) {
      console.log(e);
    }
  };


  getLocalTextFromCode = localCode => {
    return JSON.parse(getLocalization("localization_en_IN")).find(
      item => item.code === localCode
    );
  };

  getListItems = items =>
    items.map((item) => ({
      primaryText: (
        <Label
          label={item.label}
          fontSize="16px"
          color="#484848"
          labelStyle={{ fontWeight: 500 }}
        />
      )

    }));


  onChangeText = (searchText, localitylist, dataSource, params, ) => {
    this.setState({ searchText });
    //logic to like search on items    
    const filterData = localitylist.filter(item => item.code.toLowerCase().includes(searchText.toLowerCase()));


    this.setState({
      data: filterData,
    })
    if (searchText === "") {
      this.setState({
        data: localitylist,
      })
    }
  };

  render() {
    const { classes } = this.props;
    const { localitylist } = this.state;
    const { onChangeText } = this;


    return (
      <div>
        <div className="search-background">
          <div className="header-iconText">
            <Icon id="back-navigator" action="navigation" name="arrow-back" />
            <Label
              label="WHATSAPP_CHOOSE_LOCALITY"
              color="white"
              fontSize={18}
              bold={true}
              containerStyle={{ marginLeft: 17, marginTop: -2 }}
            />

          </div>

          <div className={`${classes.root} dashboard-search-main-cont`}>
            <Icon action="action" name="search" style={{ marginLeft: 12 }} />
            <Input
              placeholder={get(this.getLocalTextFromCode("WHATSAPP_SEARCH_LOCALITY"),"message","Search Locality")}
              disableUnderline={true}
              fullWidth={true}
              //className={classes.input}
              inputProps={{
                'aria-label': 'Description',
              }}
              onChange={(e) => {
                onChangeText(e.target.value, localitylist);

              }}
            />
          </div>
        </div>
        <Screen className="whatsappScreen">
          <List
            items={this.getListItems(this.state.data)}
            primaryTogglesNestedList={true}
            onItemClick={(item, index) => {
              const number = this.state.phone || 919987106368;
              const name=get(this.getLocalTextFromCode(item.primaryText.props.label),"message",item.primaryText.props.label);
              const weblink = "https://api.whatsapp.com/send?phone=" + number + "&text=" + name;
              window.location.href = weblink
            }}
            listItemStyle={{ borderBottom: "1px solid grey" }}
            style={{ marginTop: 66 }}
          />


        </Screen >
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocalizationLabel : (locale, tenantId, moduleValue) => dispatch(fetchLocalizationLabel(locale, tenantId, moduleValue))
  };
};


export default withStyles(styles)(connect(
  null,
  mapDispatchToProps
)
  (WhatsAppLocality)
);
