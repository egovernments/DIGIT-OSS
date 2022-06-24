import React, { useReducer } from "react";
import {
  SearchAction,
} from "@egovernments/digit-ui-react-components";
const MobileSearchApplication = ({ t, tenantId}) => {
  function activateModal(state, action) {
    switch (action.type) {
      case "set":
        return action.payload;
      case "remove":
        return false;
      default:
        break;    }
  }
  const [ setActiveMobileModal] = useReducer(activateModal, false);
  return (
    <React.Fragment>
      <div className="searchBox">
        <SearchAction
          text={t("ES_COMMON_SEARCH")}
          handleActionClick={() => setActiveMobileModal({ type: "set", payload: "SearchFormComponent" })}
          {...{tenantId, t}} 
        />
      </div>
    </React.Fragment>
  )
}
export default MobileSearchApplication