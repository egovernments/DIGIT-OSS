package org.egov.pt.calculator.web.models;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request object for Assessment
 * 
 * 
 * @author kavi elrey
 *
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentRequest {

	private RequestInfo requestInfo;
	
	private List<Assessment> assessments;
}
