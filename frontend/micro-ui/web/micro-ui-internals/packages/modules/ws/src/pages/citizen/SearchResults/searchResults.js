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
  const { mobileNumber, consumerNumber, oldconsumerNumber, tenantId, propertyId, locality, doorNumber, consumerName } = Digit.Hooks.useQueryParams();
  let filters = {};
  if (mobileNumber) filters.mobileNumber = mobileNumber;
  if (consumerNumber) filters.connectionNumber = consumerNumber;
  if (oldconsumerNumber) filters.oldConnectionNumber = oldconsumerNumber;
  if (propertyId) filters.propertyId = propertyId;
  if (locality !== "undefined") filters.locality = locality;
  if (doorNumber) filters.doorNumber = doorNumber;
  if (consumerName) filters.consumerName = consumerName;

  filters = {...filters , searchType:"CONNECTION"}
  const Waterresult = Digit.Hooks.ws.useWaterSearch({ tenantId, filters:{...filters},BusinessService:"WS", t });
  const Sewarageresult = Digit.Hooks.ws.useSewarageSearch({ tenantId, filters:{...filters},BusinessService:"SW",t });

  if (Waterresult?.isLoading || Sewarageresult?.isLoading || Waterresult == undefined || Sewarageresult == undefined) {
    return <Loader />;
  }

  const onSubmit = (data) => {
    history.push(`/digit-ui/citizen/payment/my-bills/${data?.ConsumerNumber.split("/")[0]}/${stringReplaceAll(data?.ConsumerNumber,"/","+")}?workflow=WNS&tenantId=${tenantId}`);
  };

  const payment = {};

  const searchResults = Waterresult && Sewarageresult ? Waterresult.concat(Sewarageresult) : [];

  return (
    <div style={{ marginTop: "16px" }}>
      <div >
        {header && (
          <Header style={{ marginLeft: "8px" }}>
            {t(header)} ({searchResults?.length})
          </Header>
        )}
        <ResponseComposer data={searchResults} template={template} actionButtonLabel={actionButtonLabel} onSubmit={onSubmit} />
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
