import { Card } from "@egovernments/digit-ui-react-components";
import React from "react";
import { ComplaintCard } from "./inbox/ComplaintCard";
import ComplaintsLink from "./inbox/ComplaintLinks";

const MobileInbox = ({ complaints }) => (
  <div style={{ padding: 0 }}>
    <div className="inbox-container">
      <div className="filters-container">
        <ComplaintsLink isMobile={true} />
        <ComplaintCard />
      </div>
    </div>
  </div>
);

export default MobileInbox;
