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
import "./index.css";

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

class WhatsAppCity extends React.Component {
  state = {
    searchText: "",
    data: [],
    citylist: [],
    phone: undefined,
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
  getMDMSData = async () => {
    let mdmsBody = {

      MdmsCriteria: {
        tenantId: "pb",
        moduleDetails: [
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "citymodule"
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
      return payload;
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount = async () => {
    const values = queryString.parse(this.props.location.search)
    const phone = values.phone;
    this.setState({
      phone: phone,
    })

    const citydata = await this.getMDMSData();
    const citylistCode = get(citydata, "MdmsRes.tenant.citymodule.0.tenants", []);
    const citylist = citylistCode.map((item) => {
      return {
        code: item.code,
        label: "TENANT_TENANTS_" + (item.code).toUpperCase().replace(/[.]/g, "_")
      }
    })

    this.setState({
      citylist: citylist,
    })
  };



  onChangeText = (searchText, citylist) => {
    this.setState({ searchText });
    //logic to like search on items    
    const filterData = citylist.filter(item => get(this.getLocalTextFromCode(item.label),"message",item.label).toLowerCase().includes(searchText.toLowerCase()));


    this.setState({
      data: filterData,
    })
    if (searchText === "") {
      this.setState({
        data: citylist,
      })
    }
  };

  render() {
    const { classes } = this.props;
    const { citylist } = this.state;
    const { onChangeText } = this;


    return (
      <div>
        <div className="search-background">
          <div className="header-iconText">
            <Icon id="back-navigator" action="navigation" name="arrow-back" />
            <Label
              label="WHATSAPP_CHOOSE_CITY"
              color="white"
              fontSize={18}
              bold={true}
              containerStyle={{ marginLeft: 17, marginTop: -2 }}
            />

          </div>

          <div className={`${classes.root} dashboard-search-main-cont`}>
            <Icon action="action" name="search" style={{ marginLeft: 12 }} />
            <Input
              placeholder="WHATSAPP_SEARCH_CITY"
              disableUnderline={true}
              fullWidth={true}
              //className={classes.input}
              inputProps={{
                'aria-label': 'Description',
              }}
              onChange={(e) => {
                onChangeText(e.target.value, citylist);

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


          />
        </Screen>

      </div>
    );
  }
}


export default withStyles(styles)(
  (WhatsAppCity)
);
