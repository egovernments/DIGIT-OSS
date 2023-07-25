package org.egov.vendor.web.model.hrms;



import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.egov.vendor.web.model.AuditDetails;
import org.egov.vendor.web.model.user.User;
import org.springframework.validation.annotation.Validated;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

@Validated
@AllArgsConstructor
@EqualsAndHashCode
@Getter
@NoArgsConstructor
@Setter
@ToString
@Builder
public class Employee {

    private Long id;

    private String uuid;

    @Size(min = 1, max = 256)
    private String code;

    @NotNull
    private String employeeStatus;

    @NotNull
    private String employeeType;

    private Long dateOfAppointment;

    @Valid
    @NonNull
    @Size(min = 1,max = 50)
    private List<Jurisdiction> jurisdictions = new ArrayList<>();


    @Valid
    @NonNull
    @Size(min = 1)
    private List<Assignment> assignments = new ArrayList<>();

    @Valid
    @Size(max=25)
    private List<ServiceHistory> serviceHistory = new ArrayList<>();


    private Boolean IsActive;

    @Valid
    @Size(max=25)
    private List<EducationalQualification> education = new ArrayList<>();

    @Valid
    @Size(max=25)
    private List<DepartmentalTest> tests = new ArrayList<>();

    @NotNull
    @Size(max = 256)
    private String tenantId;

    @Valid
    @Size(max=50)
    private List<EmployeeDocument> documents = new ArrayList<>();

    @Valid
    private List<DeactivationDetails> deactivationDetails = new ArrayList<>();

    private List<ReactivationDetails> reactivationDetails = new ArrayList<>();

    private AuditDetails auditDetails;

    private Boolean reActivateEmployee;
    
    @Valid
    @NotNull
    private User user;


}
