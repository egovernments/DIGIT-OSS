package org.egov.hrms.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.hrms.web.contract.UserRequest;
import org.egov.hrms.web.contract.UserResponse;

import java.util.Map;

public interface UserService {

    UserResponse createUser(UserRequest userRequest);

    UserResponse updateUser(UserRequest userRequest);

    UserResponse getUser(RequestInfo requestInfo, Map<String, Object> userSearchCriteria);
}
