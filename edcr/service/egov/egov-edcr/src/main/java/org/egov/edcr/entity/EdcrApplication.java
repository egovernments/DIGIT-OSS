package org.egov.edcr.entity;

import static javax.persistence.CascadeType.ALL;
import static javax.persistence.FetchType.LAZY;

import java.io.File;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.egov.common.entity.edcr.PlanInformation;
import org.egov.infra.admin.master.entity.User;
import org.egov.infra.persistence.entity.AbstractAuditable;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "EDCR_APPLICATION")
@SequenceGenerator(name = EdcrApplication.SEQ_EDCR_APPLICATION, sequenceName = EdcrApplication.SEQ_EDCR_APPLICATION, allocationSize = 1)
public class EdcrApplication extends AbstractAuditable {
    /*
     * Application number and date.Owner name, contact info,email id, address, Architect name, emailid,contract info.
     */
    public static final String SEQ_EDCR_APPLICATION = "SEQ_EDCR_APPLICATION";
    private static final long serialVersionUID = 61L;

    @Id
    @GeneratedValue(generator = SEQ_EDCR_APPLICATION, strategy = GenerationType.SEQUENCE)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ApplicationType applicationType;

    @NotNull
    @Length(min = 1, max = 128)
    private String applicationNumber;

    @Temporal(value = TemporalType.DATE)
    private Date applicationDate;

    private String status;

    @OneToMany(mappedBy = "application", fetch = LAZY, cascade = ALL)
    @OrderBy("id DESC ")
    private List<EdcrApplicationDetail> edcrApplicationDetails;

    private transient PlanInformation planInformation;

    @Length(min = 1, max = 128)
    private String planPermitNumber;

    @Temporal(value = TemporalType.DATE)
    private Date permitApplicationDate;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "buildingLicensee")
    private User buildingLicensee;

    @Length(min = 1, max = 128)
    private String transactionNumber;

    private String thirdPartyUserCode;

    private String thirdPartyUserTenant;

    private transient MultipartFile dxfFile; // File to be process.

    private transient File savedDxfFile;

    private transient EdcrApplicationDetail savedEdcrApplicationDetail;

    private String applicantName;

    private String occupancy;

    private String serviceType;

    private String amenities;

    private String architectInformation;

    private String projectType;

    private transient String permitDateTemp;

    private transient Map<String, List<Object>> mdmsMasterData;

    private transient String deviationStatus;
    
    @SafeHtml
    private String tenantId;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    protected void setId(Long id) {
        this.id = id;
    }

    public ApplicationType getApplicationType() {
        return applicationType;
    }

    public void setApplicationType(ApplicationType applicationType) {
        this.applicationType = applicationType;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public Date getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(Date applicationDate) {
        this.applicationDate = applicationDate;
    }

    public MultipartFile getDxfFile() {
        return dxfFile;
    }

    public void setDxfFile(MultipartFile dxfFile) {
        this.dxfFile = dxfFile;
    }

    public List<EdcrApplicationDetail> getEdcrApplicationDetails() {
        return edcrApplicationDetails;
    }

    public void setEdcrApplicationDetails(List<EdcrApplicationDetail> edcrApplicationDetails) {
        this.edcrApplicationDetails = edcrApplicationDetails;
    }

    public PlanInformation getPlanInformation() {
        return planInformation;
    }

    public void setPlanInformation(PlanInformation planInformation) {
        this.planInformation = planInformation;
    }

    public String getPlanPermitNumber() {
        return planPermitNumber;
    }

    public void setPlanPermitNumber(String planPermitNumber) {
        this.planPermitNumber = planPermitNumber;
    }

    public Date getPermitApplicationDate() {
        return permitApplicationDate;
    }

    public void setPermitApplicationDate(Date permitApplicationDate) {
        this.permitApplicationDate = permitApplicationDate;
    }

    public User getBuildingLicensee() {
        return buildingLicensee;
    }

    public void setBuildingLicensee(User buildingLicensee) {
        this.buildingLicensee = buildingLicensee;
    }

    public String getTransactionNumber() {
        return transactionNumber;
    }

    public void setTransactionNumber(String transactionNumber) {
        this.transactionNumber = transactionNumber;
    }

    public File getSavedDxfFile() {
        return savedDxfFile;
    }

    public void setSavedDxfFile(File savedDxfFile) {
        this.savedDxfFile = savedDxfFile;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public EdcrApplicationDetail getSavedEdcrApplicationDetail() {
        return savedEdcrApplicationDetail;
    }

    public void setSavedEdcrApplicationDetail(EdcrApplicationDetail savedEdcrApplicationDetail) {
        this.savedEdcrApplicationDetail = savedEdcrApplicationDetail;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getOccupancy() {
        return occupancy;
    }

    public void setOccupancy(String occupancy) {
        this.occupancy = occupancy;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getAmenities() {
        return amenities;
    }

    public String getArchitectInformation() {
        return architectInformation;
    }

    public void setArchitectInformation(String architectInformation) {
        this.architectInformation = architectInformation;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public String getProjectType() {
        return projectType;
    }

    public void setProjectType(String projectType) {
        this.projectType = projectType;
    }

    public String getPermitDateTemp() {
        return permitDateTemp;
    }

    public void setPermitDateTemp(String permitDateTemp) {
        this.permitDateTemp = permitDateTemp;
    }

    public String getThirdPartyUserCode() {
        return thirdPartyUserCode;
    }

    public void setThirdPartyUserCode(String thirdPartyUserCode) {
        this.thirdPartyUserCode = thirdPartyUserCode;
    }

    public String getThirdPartyUserTenant() {
        return thirdPartyUserTenant;
    }

    public void setThirdPartyUserTenant(String thirdPartyUserTenant) {
        this.thirdPartyUserTenant = thirdPartyUserTenant;
    }

    public Map<String, List<Object>> getMdmsMasterData() {
        return mdmsMasterData;
    }

    public void setMdmsMasterData(Map<String, List<Object>> mdmsMasterData) {
        this.mdmsMasterData = mdmsMasterData;
    }

    public String getDeviationStatus() {
        return deviationStatus;
    }

    public void setDeviationStatus(String deviationStatus) {
        this.deviationStatus = deviationStatus;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

}