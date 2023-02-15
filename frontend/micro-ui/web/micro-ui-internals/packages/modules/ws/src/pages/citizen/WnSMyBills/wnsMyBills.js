import React from "react";
import { Header, ResponseComposer, Loader } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import Axios from "axios";
import { useHistory, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {stringReplaceAll} from "../../../utils/index";
import WSInfoLabel from "../../../pageComponents/WSInfoLabel";

const WNSMyBills = ({ template, header, actionButtonLabel }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const { tenantId: _tenantId } = Digit.Hooks.useQueryParams();
  let { tenantId } = Digit.UserService.getUser()?.info || location?.state || { tenantId: _tenantId } || {};
   tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.UserService.getUser()?.info?.permanentCity || tenantId
  if (!tenantId && !location?.state?.fromSearchResults) {
    history.replace(`/digit-ui/citizen/login`, { from: url });
  }
  let filters = {};
  const { mobileNumber } = Digit.UserService.getUser()?.info || {};

  filters = {...filters , searchType:"CONNECTION"}

  const params = { mobileNumber, ...filters };
  const Waterresult = Digit.Hooks.ws.useMyBillsWaterSearch({ tenantId, filters:{...params},BusinessService:"WS", t }, 
  {
    privacy: Digit.Utils.getPrivacyObject(),
  });
  const Sewarageresult = Digit.Hooks.ws.useMyBillsSewarageSearch({ tenantId, filters:{...params},BusinessService:"SW",t },
  {
    privacy: Digit.Utils.getPrivacyObject(),
  });

  if (Waterresult?.isLoading || Sewarageresult?.isLoading || Waterresult == undefined || Sewarageresult == undefined) {
    return <Loader />;
  }

  const onSubmit = (data) => {
    history.push(`/digit-ui/citizen/payment/my-bills/${data?.ConsumerNumber.split("/")[0]}/${stringReplaceAll(data?.ConsumerNumber,"/","+")}?workflow=WNS&tenantId=${tenantId}&ConsumerName=${data?.ConsumerName}`);
  };

  const payment = {};

  let searchResults = Waterresult && Sewarageresult ? Waterresult.concat(Sewarageresult) : [];
  searchResults = searchResults?.filter((ob) => ob?.AmountDue && ob?.AmountDue !== "0");

  return (
    <div style={{ marginTop: "16px" }}>
      <div>
        {header && (
          <Header style={{ marginLeft: 10, marginTop: 10 }}>
            {t(header)} ({searchResults?.length})
          </Header>
        )}
         <WSInfoLabel t={t} /> 
        <ResponseComposer data={searchResults} template={template} actionButtonLabel={actionButtonLabel} onSubmit={onSubmit} />
      </div>
      {!searchResults?.length > 0 && <p style={{ paddingLeft: "16px" }}>{t("CS_BILLS_TEXT_NO_BILLS_FOUND")}</p>}
    </div>
  );
};

WNSMyBills.propTypes = {
  template: PropTypes.any,
  header: PropTypes.string,
  actionButtonLabel: PropTypes.string,
};

WNSMyBills.defaultProps = {
  template: [],
  header: null,
  actionButtonLabel: null,
};

export default WNSMyBills;
