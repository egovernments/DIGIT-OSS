import React from "react";
import { connect } from "react-redux";
import { searchUser } from "egov-ui-kit/redux/auth/actions";
import { fetchComplaintCategories } from "egov-ui-kit/redux/complaints/actions";
import { fetchpgrConstants } from "egov-ui-kit/redux/common/actions";
import { fetchUiCommonConfig, fetchUiCommonConstants } from "egov-ui-kit/redux/app/actions";
import commonConfig from "config/common";
import { fetchGeneralMDMSData } from "egov-ui-kit/redux/common/actions";
import { getAccessToken } from "egov-ui-kit/utils/localStorageUtils";
import { generalMDMSDataRequestObj, getGeneralMDMSDataDropdownName } from "egov-ui-kit/utils/commons";

const withData = (Component) => {
  class Wrapper extends React.Component {
    componentDidMount() {
      const { searchUser, fetchComplaintCategories, authenticated, fetchpgrConstants, fetchUiCommonConfig, fetchUiCommonConstants, fetchGeneralMDMSData } = this.props;
      if (getAccessToken()) {
        
        searchUser();
        fetchUiCommonConstants();
/*         fetchpgrConstants();
        fetchUiCommonConfig();
        fetchComplaintCategories();
       fetchGeneralMDMSData(); 
        */
       
      }
    }

    render() {
      const { searchUser, fetchCurrentLocation, fetchComplaintCategories, ...rest } = this.props;
      return <Component {...rest} />;
    }
  }

  const mapStateToProps = ({ auth }) => {
    const { authenticated } = auth;
    return { authenticated };
  };

  const mapDispatchToProps = (dispatch) => {
    let requestBody = generalMDMSDataRequestObj(commonConfig.tenantId);
    return {
      fetchComplaintCategories: () => dispatch(fetchComplaintCategories()),
      searchUser: () => dispatch(searchUser()),
      fetchpgrConstants: () => dispatch(fetchpgrConstants()),
      fetchUiCommonConfig: () => dispatch(fetchUiCommonConfig()),
      fetchUiCommonConstants: () => dispatch(fetchUiCommonConstants()),
      fetchGeneralMDMSData: () => dispatch(fetchGeneralMDMSData(requestBody, "PropertyTax", getGeneralMDMSDataDropdownName())),
    };
  };

  return connect(
    null,
    mapDispatchToProps
  )(Wrapper);
};

export default withData;
