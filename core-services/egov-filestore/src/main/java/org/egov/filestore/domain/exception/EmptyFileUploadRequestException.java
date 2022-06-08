package org.egov.filestore.domain.exception;

public class EmptyFileUploadRequestException extends RuntimeException {

	private static final long serialVersionUID = 469769329321629532L;
	private static final String MESSAGE = "No files present in upload request for module: %s, tag: %s, tenantId: %s";

	public EmptyFileUploadRequestException(String module, String tag, String tenantId) {
		super(String.format(MESSAGE, module, tag, tenantId));
	}
}
