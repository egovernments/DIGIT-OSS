import { WorkflowActions, WorkflowTimeline, Card } from "@egovernments/digit-ui-react-components";
import React from "react";

//works-ui/employee/dss/workflow?tenantId=pg.citya&applicationNo=WO/2022-23/000375&businessService=contract-approval-mukta&moduleCode=contract
// /works-ui/employee/dss/workflow?tenantId=pg.citya&applicationNo=ES/2022-23/000874&businessService=mukta-estimate&moduleCode=estimate
// `/works-ui/employee/dss/workflow?tenantId=pg.citya&applicationNo=MR/2022-23/03/19/000631&businessService=muster-roll-approval&moduleCode=attendence`

const WorkflowCompTest = (props) => {
  const { tenantId, businessService, applicationNo, moduleCode } = Digit.Hooks.useQueryParams();

  return (
    <Card>
      <WorkflowTimeline businessService={businessService} applicationNo={applicationNo} tenantId={tenantId} />
      <WorkflowActions
        forcedActionPrefix={"ACTIONS"}
        ActionBarStyle={{}}
        MenuStyle={{}}
        businessService={businessService}
        applicationNo={applicationNo}
        tenantId={tenantId}
        saveAttendanceState={{ displaySave: false, updatePayload: [] }}
        moduleCode={moduleCode}
      />
    </Card>
  );
};

export default WorkflowCompTest;
