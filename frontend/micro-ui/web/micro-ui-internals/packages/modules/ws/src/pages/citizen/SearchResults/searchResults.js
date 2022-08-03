import React from "react";
import { Header, ResponseComposer, Loader } from "@egovernments/digit-ui-react-components";
import PropTypes from "prop-types";
import Axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {stringReplaceAll} from "../../../utils/index";

const ChallanSearchResults = ({ template, header, actionButtonLabel }) => {
  
  const { t } = useTranslation();
  const history = useHistory();
  const { mobileNumber, consumerNumber, oldconsumerNumber, tenantId, propertyId, locality, doorNumber, consumerName, PToffset } = Digit.Hooks.useQueryParams();
  let filters = {};

  let OfsetForSearch = PToffset;
  let t1;
  let off;
  if (!isNaN(parseInt(OfsetForSearch))) {
    off = OfsetForSearch;
    t1 = parseInt(OfsetForSearch) + 5;
  } else {
    t1 = 5;
  }

  let filter1 = !isNaN(parseInt(OfsetForSearch))
  ? { limit: "5", sortOrder: "ASC", sortBy: "createdTime", offset: off }
  : { limit: "5", sortOrder: "ASC", sortBy: "createdTime", offset: "0" };

  if (mobileNumber) filters.mobileNumber = mobileNumber;
  if (consumerNumber) filters.connectionNumber = consumerNumber;
  if (oldconsumerNumber) filters.oldConnectionNumber = oldconsumerNumber;
  if (propertyId) filters.propertyId = propertyId;
  if (locality !== "undefined") filters.locality = locality;
  if (doorNumber) filters.doorNo = doorNumber;
  if (consumerName) filters.ownerName = consumerName;
  if (locality || ( searchQuery && searchQuery.locality ) ){
    filters.limit = filter1.limit;
    filters.sortOrder = filter1.sortOrder;
    filters.sortBy = filter1.sortBy;
    filters.offset = filter1.offset;
  }


  filters = {...filters , searchType:"CONNECTION"}
  const { isLoading: isWSLoading, data: Waterresult } = Digit.Hooks.ws.useWaterSearch({ tenantId, filters: { ...filters }, BusinessService: "WS", t }, { privacy: Digit.Utils.getPrivacyObject() });
  const { isLoading: isSWLoading, data: Sewarageresult } = Digit.Hooks.ws.useSewarageSearch({ tenantId, filters: { ...filters }, BusinessService: "SW", t }, { privacy: Digit.Utils.getPrivacyObject() });
 
  if (isWSLoading || isSWLoading ) {
    return <Loader />;
  }

  const onSubmit = (data) => {
    history.push(`/digit-ui/citizen/payment/my-bills/${data?.ConsumerNumber.split("/")[0]}/${stringReplaceAll(data?.ConsumerNumber,"/","+")}?workflow=WNS&tenantId=${tenantId}&ConsumerName=${data?.ConsumerName}`);
  };

  const payment = {};

  const searchResults = Waterresult && Sewarageresult ? Waterresult.concat(Sewarageresult) : (Waterresult? Waterresult : (Sewarageresult? Sewarageresult : []));

  return (
    <div style={{ marginTop: "16px" }}>
      <div >
        {header && (
          <Header style={{ marginLeft: "8px" }}>
            {t(header)} ({searchResults?.length})
          </Header>
        )}
        <ResponseComposer data={searchResults} template={template} actionButtonLabel={actionButtonLabel} onSubmit={onSubmit} />
        {!searchResults?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("WS_NO_APP_FOUND_MSG")}</p>}
        {searchResults?.length !== 0 && (searchResults?.length == 5 || searchResults?.length == 50) && (locality || ( searchQuery && searchQuery.locality )) && (
          <div>
            <p style={{ marginLeft: "16px", marginTop: "16px" }}>
              {t("WS_LOAD_MORE_MSG")}{" "}
              <span className="link">{<Link to={`/digit-ui/citizen/ws/search-results?doorNumber=${doorNumber}&consumerName=${consumerName}&tenantId=${tenantId?.split(".")[0]}&locality=${locality.code}&PToffset=${t1}`}>{t("PT_COMMON_CLICK_HERE")}</Link>}</span>
            </p>
          </div>
        )}
        <p style={{ marginLeft: "16px", marginTop: "16px" }}>
        {t("WS_WANT_TO_ADD_NEW_CONNECTION")}{" "}
        <span className="link" style={{ display: "block" }}>
          <Link to="/digit-ui/citizen/ws/create-application/search-property">{t("WS_CLICK_HERE_TO_APPLY")}</Link>
        </span>
        </p>
      </div>
    </div>
  );
};

ChallanSearchResults.propTypes = {
  template: PropTypes.any,
  header: PropTypes.string,
  actionButtonLabel: PropTypes.string,
};

ChallanSearchResults.defaultProps = {
  template: [],
  header: null,
  actionButtonLabel: null,
};

export default ChallanSearchResults;
