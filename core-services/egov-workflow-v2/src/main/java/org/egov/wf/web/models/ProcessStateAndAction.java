package org.egov.wf.web.models;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class ProcessStateAndAction {
/*Contains the action object to be performed, the currentState and resultantState
   to avoid multiple iterations*/

    private ProcessInstance processInstanceFromRequest = null;

    private ProcessInstance processInstanceFromDb;

    private Action action = null;

    private State currentState = null;

    private State resultantState = null;

}
