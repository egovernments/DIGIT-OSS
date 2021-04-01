package org.egov.id.model;

import org.springframework.stereotype.Service;

/**
 * <h1>ResponseInfoFactory</h1>
 * 
 * @author Narendra
 *
 */
@Service
public class ResponseInfoFactory {
	public ResponseInfo createResponseInfoFromRequestInfo(RequestInfo requestInfo, Boolean success) {
		String apiId = requestInfo.getApiId();
		String ver = requestInfo.getVer();
		Long ts = requestInfo.getTs();
		String resMsgId = "uief87324"; // FIXME : Hard-coded
		String msgId = requestInfo.getMsgId();
		ResponseStatusEnum responseStatus = success ? ResponseStatusEnum.SUCCESSFUL : ResponseStatusEnum.FAILED;
		return new ResponseInfo(apiId, ver, ts, resMsgId, msgId, responseStatus);
	}
}
