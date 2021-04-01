package org.egov.common.web.contract;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;

import lombok.Data;

public @Data class ProcessInstanceRequest {

    private RequestInfo requestInfo = new RequestInfo();

    private List<ProcessInstance> processInstances = new ArrayList<ProcessInstance>();

    private ProcessInstance processInstance = new ProcessInstance();

}