package org.egov.boundary.web.contract;

import org.egov.common.contract.request.User;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class RequestInfo {
	
  private String apiId;
  private String ver;
  private Long ts;
  private String action;
  private String did;
  private String key;
  private String msgId;
  private User userInfo;

}
