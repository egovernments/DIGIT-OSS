package org.egov.domain.model;

import org.egov.common.contract.request.RequestInfo;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@Builder
@EqualsAndHashCode
public class MessageRequest {

	private RequestInfo RequestInfo;

	private MessageSearchCriteria messageSearchCriteria;
}
