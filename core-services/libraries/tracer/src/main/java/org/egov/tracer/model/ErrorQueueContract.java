package org.egov.tracer.model;

import lombok.*;

import java.util.List;

@Setter
@Getter
@ToString
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ErrorQueueContract {

    private String id;
	private String source;
	private Object body;
	private Long ts;
	private ErrorRes errorRes;
	private List<StackTraceElement> exception;
	//private String couse;
	private String message;
	//private Exception exception;
    private String correlationId;

}
