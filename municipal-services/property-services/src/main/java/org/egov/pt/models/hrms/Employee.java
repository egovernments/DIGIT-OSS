package org.egov.pt.models.hrms;

import java.util.ArrayList;
import java.util.List;

import org.egov.pt.models.Locality;
import org.egov.pt.models.user.User;

import lombok.Data;

@Data
public class Employee {

	  private Long id;

	    private String uuid;

	    private String code;

	    private String employeeStatus;

	    private String employeeType;

	    private Long dateOfAppointment;

	    private List<Locality> jurisdictions = new ArrayList<>();

	    private List<Object> assignments = new ArrayList<>();

	    private List<Object> serviceHistory = new ArrayList<>();


	    private Boolean IsActive;

	    private List<String> education = new ArrayList<>();

	    private List<String> tests = new ArrayList<>();

	    private String tenantId;

	    private List<String> documents = new ArrayList<>();

	    private List<String> deactivationDetails = new ArrayList<>();

	    private List<String> reactivationDetails = new ArrayList<>();

	    private Object auditDetails;

	    private Boolean reActivateEmployee;
	    
	    private User user;
}
