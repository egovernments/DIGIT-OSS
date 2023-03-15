import Input from '@material-ui/core/Input';
import { withStyles } from "@material-ui/core/styles";
import { Icon } from "components";
import commonConfig from "config/common";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";
import { List } from "egov-ui-kit/components";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import { getLocale, setLocale, setModule } from "egov-ui-kit/utils/localStorageUtils";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";
import { Screen } from "modules/common";
import queryString from 'query-string';
import React from "react";
import { connect } from "react-redux";
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
    stateId: undefined,
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
  getMDMSData = async (stateId) => {
    let mdmsBody = {

      MdmsCriteria: {
        tenantId: stateId || "pb.amritsar",
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
    }
  };

  componentDidMount = async () => {
    localStorage.clear();
    const values = queryString.parse(this.props.location.search)
    const phone = values.phone;
    const stateId = values.tenantId;
    this.setState({
      phone: phone,
    })
    this.setState({
      stateId: stateId,
    })
    let locale = getQueryArg(window.location.href, "locale") || 'en_IN';
    setLocale(locale);
    setModule('rainmaker-common');
    this.props.fetchLocalizationLabel(getLocale(), commonConfig.tenantId, commonConfig.tenantId);

    const citydata = await this.getMDMSData(stateId);

    const citylistCodeModule = get(citydata, "MdmsRes.tenant.citymodule", []);
    const citylistCode = citylistCodeModule.filter(item => item.module === "PGR.WHATSAPP")[0].tenants
    const citylist = citylistCode.map((item) => {
      return {
        code: item.code,
        label: item.name
      }
    })

    this.setState({
      citylist: citylist,
      data: [...citylist]
    })

  };



  onChangeText = (searchText, citylist) => {
    this.setState({ searchText });
    //logic to like search on items    
    const filterData = citylist.filter(item => item.label.toLowerCase().includes(searchText.toLowerCase()));
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
            {/* <Icon id="back-navigator" action="navigation" name="arrow-back" /> */}
            <Label
              label="CHOOSE CITY"
              color="white"
              fontSize={18}
              bold={true}
              containerStyle={{ marginLeft: 30, marginTop: -2 }}
            />

          </div>

          <div className={`${classes.root} dashboard-search-main-cont`}>
            <Icon action="action" name="search" style={{ marginLeft: 12 }} />
            <Input
              placeholder="Search City"
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
              const number = this.state.phone || commonConfig.whatsappNumber;
              const name = getLocaleLabels(item.primaryText.props.label, item.primaryText.props.label);
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


const mapDispatchToProps = (dispatch) => ({
  fetchLocalizationLabel: (locale, moduleName, tenantId) => dispatch(fetchLocalizationLabel(locale, moduleName, tenantId)),
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(
  (WhatsAppCity)
));