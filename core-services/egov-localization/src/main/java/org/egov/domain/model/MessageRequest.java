package org.egov.domain.model;

import org.egov.common.contract.request.RequestInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRequest {

	private RequestInfo RequestInfo;

	private MessageSearchCriteria messageSearchCriteria;
}
