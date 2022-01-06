package org.egov.vendor.web.model.hrms;


import org.egov.vendor.web.model.AuditDetails;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Validated
@EqualsAndHashCode(exclude = {"auditDetails"})
@AllArgsConstructor
@Getter
@NoArgsConstructor
@Setter
@ToString
@Builder
public class EmployeeDocument {

	private String id;

	private String documentName;

	private  String documentId;

	private EmployeeDocumentReferenceType referenceType;

	private String referenceId;
	
	private String tenantId;

	private AuditDetails auditDetails;

	public enum EmployeeDocumentReferenceType {
		HEADER("HEADER"), ASSIGNMENT("ASSIGNMENT"), JURISDICTION("JURISDICTION"), SERVICE("SERVICE"), 
		EDUCATION("EDUCATION"), TEST("TEST"), DEACTIVATION("DEACTIVATION");

		private String value;

		EmployeeDocumentReferenceType(String value) {
			this.value = value;
		}

		@Override
		@JsonValue
		public String toString() {
			return name();
		}

		@JsonCreator
		public static EmployeeDocumentReferenceType fromValue(String passedValue) {
			for (EmployeeDocumentReferenceType obj : EmployeeDocumentReferenceType.values()) {
				if (String.valueOf(obj.value).equals(passedValue.toUpperCase())) {
					return obj;
				}
			}
			return null;
		}
	}

}
