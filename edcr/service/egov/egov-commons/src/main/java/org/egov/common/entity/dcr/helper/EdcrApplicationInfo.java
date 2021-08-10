/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2018>  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.common.entity.dcr.helper;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.entity.edcr.Plan;
import org.egov.infra.filestore.entity.FileStoreMapper;

public class EdcrApplicationInfo implements Serializable {

    private static final long serialVersionUID = 1235517727309489685L;
    // E-Dcr Application related
    private Long eDcrApplicationId;
    private String applicationNumber;
    private String dcrNumber;
    private String planPermitNumber;
    private String applicationDate;
    private String createdDate;
    private Long planDetailFileStore;
    private Long planDetailId;
    private String projectType;
    private String applicationType;
    // E-Dcr Document related
    private Long eDcrDocId;
    private FileStoreMapper reportOutput;
    private FileStoreMapper dxfFile;
    private String eDcrPlanFilestatus;
    // E-Dcr Plan Info related
    private Long planInformationId;
    private BigDecimal plotArea;
    private String ownerName;
    private String occupancy;
    private String serviceType;
    private String amenities;
    private String architectInformation;
    private Boolean crzZoneArea;
    // To handle error
    private ErrorDetail errorDetail;

    private Plan plan;

    private Map<String, List<FileStoreMapper>> planScrutinyPdfs = new LinkedHashMap<>();

    public Long geteDcrApplicationId() {
        return eDcrApplicationId;
    }

    public void seteDcrApplicationId(Long eDcrApplicationId) {
        this.eDcrApplicationId = eDcrApplicationId;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public String getDcrNumber() {
        return dcrNumber;
    }

    public void setDcrNumber(String dcrNumber) {
        this.dcrNumber = dcrNumber;
    }

    public String getPlanPermitNumber() {
        return planPermitNumber;
    }

    public void setPlanPermitNumber(String planPermitNumber) {
        this.planPermitNumber = planPermitNumber;
    }

    public String getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(String applicationDate) {
        this.applicationDate = applicationDate;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public Long getPlanDetailFileStore() {
        return planDetailFileStore;
    }

    public void setPlanDetailFileStore(Long planDetailFileStore) {
        this.planDetailFileStore = planDetailFileStore;
    }

    public Long getPlanDetailId() {
        return planDetailId;
    }

    public void setPlanDetailId(Long planDetailId) {
        this.planDetailId = planDetailId;
    }

    public String getProjectType() {
        return projectType;
    }

    public void setProjectType(String projectType) {
        this.projectType = projectType;
    }

	public String getApplicationType() {
		return applicationType;
	}

	public void setApplicationType(String applicationType) {
		this.applicationType = applicationType;
	}
	
    public Long geteDcrDocId() {
        return eDcrDocId;
    }

    public void seteDcrDocId(Long eDcrDocId) {
        this.eDcrDocId = eDcrDocId;
    }

    public FileStoreMapper getReportOutput() {
        return reportOutput;
    }

    public void setReportOutput(FileStoreMapper reportOutput) {
        this.reportOutput = reportOutput;
    }

    public FileStoreMapper getDxfFile() {
        return dxfFile;
    }

    public void setDxfFile(FileStoreMapper dxfFile) {
        this.dxfFile = dxfFile;
    }

    public String geteDcrPlanFilestatus() {
        return eDcrPlanFilestatus;
    }

    public void seteDcrPlanFilestatus(String eDcrPlanFilestatus) {
        this.eDcrPlanFilestatus = eDcrPlanFilestatus;
    }

    public Long getPlanInformationId() {
        return planInformationId;
    }

    public void setPlanInformationId(Long planInformationId) {
        this.planInformationId = planInformationId;
    }

    public BigDecimal getPlotArea() {
        return plotArea;
    }

    public void setPlotArea(BigDecimal plotArea) {
        this.plotArea = plotArea;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
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

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public String getArchitectInformation() {
        return architectInformation;
    }

    public void setArchitectInformation(String architectInformation) {
        this.architectInformation = architectInformation;
    }

    public Boolean getCrzZoneArea() {
        return crzZoneArea;
    }

    public void setCrzZoneArea(Boolean crzZoneArea) {
        this.crzZoneArea = crzZoneArea;
    }

    public ErrorDetail getErrorDetail() {
        return errorDetail;
    }

    public void setErrorDetail(ErrorDetail errorDetail) {
        this.errorDetail = errorDetail;
    }

    public Plan getPlan() {
		return plan;
	}

	public void setPlan(Plan plan) {
		this.plan = plan;
	}

	public Map<String, List<FileStoreMapper>> getPlanScrutinyPdfs() {
        return planScrutinyPdfs;
    }

    public void setPlanScrutinyPdfs(Map<String, List<FileStoreMapper>> planScrutinyPdfs) {
        this.planScrutinyPdfs = planScrutinyPdfs;
    }
}
