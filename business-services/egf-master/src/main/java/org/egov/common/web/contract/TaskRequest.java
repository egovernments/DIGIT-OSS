package org.egov.common.web.contract;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.web.contract.TaskContract;

import lombok.Data;

public @Data class TaskRequest {

    private RequestInfo requestInfo = new RequestInfo();

    private List<TaskContract> tasks = new ArrayList<TaskContract>();

    private TaskContract task = new TaskContract();

}