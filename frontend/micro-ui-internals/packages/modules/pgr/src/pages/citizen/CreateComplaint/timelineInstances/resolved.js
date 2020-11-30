import { ActionLinks } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

//const GetTranslatedAction = (action, t) => t(`CS_COMMON_${action}`);

const Resolved = ({ nextActions, serviceRequestId, path, text }) => {
  //let nextAction = await Digit.workflowService.getNextAction("pb", key);
  let actions = nextActions.map(({ action }, index) => (
    <Link key={index} to={`${path}/${action.toLowerCase()}/${serviceRequestId}`}>
      <ActionLinks>{action}</ActionLinks>
    </Link>
  ));
  return (
    <div>
      {text} <div>{actions}</div>
    </div>
  );
};

export default Resolved;
