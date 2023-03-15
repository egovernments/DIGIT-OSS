package org.egov.id.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * <h1>InvalidIDFormatException</h1>
 * 
 * @author Pavan Kumar kamma
 *
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InvalidIDFormatException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	private String customMsg;

	private RequestInfo requestInfo;
}
