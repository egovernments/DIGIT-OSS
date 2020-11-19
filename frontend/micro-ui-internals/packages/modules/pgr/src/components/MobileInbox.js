import { Card } from "@egovernments/digit-ui-react-components";
import React from "react";
import ComplaintsLink from "./inbox/ComplaintLinks";

const MobileInbox = ({ complaints }) => (
  <Card>
    <div className="inbox-container">
      <div className="filters-container">
        <ComplaintsLink isMobile={true} />
      </div>
    </div>
  </Card>
);

export default MobileInbox;
