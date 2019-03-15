/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.infra.microservice.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

public class Assignment {

    private String id;

    @NotNull
    private Long position;

    private Long fund;

    private Long functionary;

    private Long function;

    @NotNull
    private String department;

    @NotNull
    private String designation;

    @Valid
    private List<HODDepartment> hod = new ArrayList<HODDepartment>();

    @NotNull
    private Boolean isPrimary;

    private float fromDate;

    private float toDate;

    private Long grade;

    private String govtOrderNumber;

    private List<String> documents = new ArrayList<String>();

    private Long createdBy;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date createdDate;

    private Long lastModifiedBy;

    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private Date lastModifiedDate;

    private String employeeName;

    private String tenantId;

    public Assignment() {
    }

    public Assignment(String id, Long position, Long fund, Long functionary, Long function, String department,
            String designation, List<HODDepartment> hod, Boolean isPrimary, float fromDate, float toDate, Long grade,
            String govtOrderNumber, List<String> documents, Long createdBy, Date createdDate, Long lastModifiedBy,
            Date lastModifiedDate, String tenantId) {
        this.id = id;
        this.position = position;
        this.fund = fund;
        this.functionary = functionary;
        this.function = function;
        this.department = department;
        this.designation = designation;
        this.hod = hod;
        this.isPrimary = isPrimary;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.grade = grade;
        this.govtOrderNumber = govtOrderNumber;
        this.documents = documents;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.lastModifiedBy = lastModifiedBy;
        this.lastModifiedDate = lastModifiedDate;
        this.tenantId = tenantId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getPosition() {
        return position;
    }

    public void setPosition(Long position) {
        this.position = position;
    }

    public Long getFund() {
        return fund;
    }

    public void setFund(Long fund) {
        this.fund = fund;
    }

    public Long getFunctionary() {
        return functionary;
    }

    public void setFunctionary(Long functionary) {
        this.functionary = functionary;
    }

    public Long getFunction() {
        return function;
    }

    public void setFunction(Long function) {
        this.function = function;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public List<HODDepartment> getHod() {
        return hod;
    }

    public void setHod(List<HODDepartment> hod) {
        this.hod = hod;
    }

    public Boolean getIsPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }

    public float getFromDate() {
        return fromDate;
    }

    public void setFromDate(float fromDate) {
        this.fromDate = fromDate;
    }

    public float getToDate() {
        return toDate;
    }

    public void setToDate(float toDate) {
        this.toDate = toDate;
    }

    public Long getGrade() {
        return grade;
    }

    public void setGrade(Long grade) {
        this.grade = grade;
    }

    public String getGovtOrderNumber() {
        return govtOrderNumber;
    }

    public void setGovtOrderNumber(String govtOrderNumber) {
        this.govtOrderNumber = govtOrderNumber;
    }

    public List<String> getDocuments() {
        return documents;
    }

    public void setDocuments(List<String> documents) {
        this.documents = documents;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(Long lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public Date getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Date lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    // @Override
    // public int hashCode() {
    // final int prime = 31;
    // int result = 1;
    // result = prime * result + ((createdBy == null) ? 0 : createdBy.hashCode());
    // result = prime * result + ((createdDate == null) ? 0 : createdDate.hashCode());
    // result = prime * result + ((department == null) ? 0 : department.hashCode());
    // result = prime * result + ((designation == null) ? 0 : designation.hashCode());
    // result = prime * result + ((documents == null) ? 0 : documents.hashCode());
    // result = prime * result + ((fromDate == null) ? 0 : fromDate.hashCode());
    // result = prime * result + ((function == null) ? 0 : function.hashCode());
    // result = prime * result + ((functionary == null) ? 0 : functionary.hashCode());
    // result = prime * result + ((fund == null) ? 0 : fund.hashCode());
    // result = prime * result + ((govtOrderNumber == null) ? 0 : govtOrderNumber.hashCode());
    // result = prime * result + ((grade == null) ? 0 : grade.hashCode());
    // result = prime * result + ((hod == null) ? 0 : hod.hashCode());
    // result = prime * result + ((id == null) ? 0 : id.hashCode());
    // result = prime * result + ((isPrimary == null) ? 0 : isPrimary.hashCode());
    // result = prime * result + ((lastModifiedBy == null) ? 0 : lastModifiedBy.hashCode());
    // result = prime * result + ((lastModifiedDate == null) ? 0 : lastModifiedDate.hashCode());
    // result = prime * result + ((position == null) ? 0 : position.hashCode());
    // result = prime * result + ((tenantId == null) ? 0 : tenantId.hashCode());
    // result = prime * result + ((toDate == null) ? 0 : toDate.hashCode());
    // return result;
    // }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Assignment other = (Assignment) obj;
        if (createdBy == null) {
            if (other.createdBy != null)
                return false;
        } else if (!createdBy.equals(other.createdBy))
            return false;
        if (createdDate == null) {
            if (other.createdDate != null)
                return false;
        } else if (!createdDate.equals(other.createdDate))
            return false;
        if (department == null) {
            if (other.department != null)
                return false;
        } else if (!department.equals(other.department))
            return false;
        if (designation == null) {
            if (other.designation != null)
                return false;
        } else if (!designation.equals(other.designation))
            return false;
        if (documents == null) {
            if (other.documents != null)
                return false;
        } else if (!documents.equals(other.documents))
            return false;
        if (fromDate == 0) {
            if (other.fromDate != 0)
                return false;
        } else if (fromDate != other.fromDate)
            return false;
        if (function == null) {
            if (other.function != null)
                return false;
        } else if (!function.equals(other.function))
            return false;
        if (functionary == null) {
            if (other.functionary != null)
                return false;
        } else if (!functionary.equals(other.functionary))
            return false;
        if (fund == null) {
            if (other.fund != null)
                return false;
        } else if (!fund.equals(other.fund))
            return false;
        if (govtOrderNumber == null) {
            if (other.govtOrderNumber != null)
                return false;
        } else if (!govtOrderNumber.equals(other.govtOrderNumber))
            return false;
        if (grade == null) {
            if (other.grade != null)
                return false;
        } else if (!grade.equals(other.grade))
            return false;
        if (hod == null) {
            if (other.hod != null)
                return false;
        } else if (!hod.equals(other.hod))
            return false;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        if (isPrimary == null) {
            if (other.isPrimary != null)
                return false;
        } else if (!isPrimary.equals(other.isPrimary))
            return false;
        if (lastModifiedBy == null) {
            if (other.lastModifiedBy != null)
                return false;
        } else if (!lastModifiedBy.equals(other.lastModifiedBy))
            return false;
        if (lastModifiedDate == null) {
            if (other.lastModifiedDate != null)
                return false;
        } else if (!lastModifiedDate.equals(other.lastModifiedDate))
            return false;
        if (position == null) {
            if (other.position != null)
                return false;
        } else if (!position.equals(other.position))
            return false;
        if (tenantId == null) {
            if (other.tenantId != null)
                return false;
        } else if (!tenantId.equals(other.tenantId))
            return false;
        if (toDate == 0) {
            if (other.toDate != 0)
                return false;
        } else if (toDate != other.toDate)
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Assignment [id=" + id + ", position=" + position + ", fund=" + fund + ", functionary=" + functionary
                + ", function=" + function + ", department=" + department + ", designation=" + designation + ", hod="
                + hod + ", isPrimary=" + isPrimary + ", fromDate=" + fromDate + ", toDate=" + toDate + ", grade="
                + grade + ", govtOrderNumber=" + govtOrderNumber + ", documents=" + documents + ", createdBy="
                + createdBy + ", createdDate=" + createdDate + ", lastModifiedBy=" + lastModifiedBy
                + ", lastModifiedDate=" + lastModifiedDate + ", tenantId=" + tenantId + "]";
    }

}