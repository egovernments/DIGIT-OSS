import { VerifyMobile } from "components";
import React, { Component } from "react";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

class LinkComponent extends Component {


  render() {
    const consumerCode = getQueryArg(window.location.href, "consumerCode");
    const tenantId = getQueryArg(window.location.href, "tenantId");
   const businessService=localStorage.getItem("pay-businessService");
    return businessService=="PT"&&<VerifyMobile tenantId={tenantId}
      propertyId={consumerCode}
      type="LINKNUM"></VerifyMobile>
  }
}
export default LinkComponent;
