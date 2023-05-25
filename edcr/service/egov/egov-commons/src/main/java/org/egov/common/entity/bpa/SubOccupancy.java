/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2018  eGovernments Foundation
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
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
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
 *
 */

package org.egov.common.entity.bpa;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.egov.infra.persistence.entity.AbstractAuditable;
import org.hibernate.validator.constraints.Length;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name = "EGBPA_SUB_OCCUPANCY")
@SequenceGenerator(name = SubOccupancy.SEQ_OCCUPANCY, sequenceName = SubOccupancy.SEQ_OCCUPANCY, allocationSize = 1)
@JsonIdentityInfo(generator = ObjectIdGenerators.UUIDGenerator.class, property = "@id")
@JsonIgnoreProperties({ "createdBy", "lastModifiedBy" })
public class SubOccupancy extends AbstractAuditable {

    public static final String SEQ_OCCUPANCY = "SEQ_EGBPA_SUB_OCCUPANCY";
    private static final long serialVersionUID = -1928622582218032380L;

    @Id
    @GeneratedValue(generator = SEQ_OCCUPANCY, strategy = GenerationType.SEQUENCE)
    private Long id;

    @OneToMany(mappedBy = "subOccupancy", cascade = CascadeType.ALL)
    private List<Usage> usages = new ArrayList<>();

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "occupancy")
    private Occupancy occupancy;

    @NotNull
    @Length(min = 1, max = 128)
    @Column(name = "code", unique = true)
    private String code;

    @NotNull
    @Length(min = 1, max = 256)
    private String name;

    @Length(min = 1, max = 1024)
    private String description;

    private Boolean isActive;

    private BigDecimal maxCoverage;

    private BigDecimal minFar;

    private BigDecimal maxFar;

    private Integer orderNumber;

    private Integer colorCode;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    protected void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Boolean getIsactive() {
        return isActive;
    }

    public void setIsactive(Boolean isactive) {
        this.isActive = isactive;
    }

    public Integer getOrderNumber() {
        return orderNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getMaxCoverage() {
        return maxCoverage;
    }

    public void setMaxCoverage(BigDecimal maxCoverage) {
        this.maxCoverage = maxCoverage;
    }

    public BigDecimal getMinFar() {
        return minFar;
    }

    public void setMinFar(BigDecimal minFar) {
        this.minFar = minFar;
    }

    public BigDecimal getMaxFar() {
        return maxFar;
    }

    public void setMaxFar(BigDecimal maxFar) {
        this.maxFar = maxFar;
    }

    public void setOrderNumber(Integer orderNumber) {
        this.orderNumber = orderNumber;
    }

    public Occupancy getOccupancy() {
        return occupancy;
    }

    public void setOccupancy(Occupancy occupancy) {
        this.occupancy = occupancy;
    }

    public List<Usage> getUsages() {
        return usages;
    }

    public void setUsages(List<Usage> usages) {
        this.usages = usages;
    }

    public Integer getColorCode() {
        return colorCode;
    }

    public void setColorCode(Integer colorCode) {
        this.colorCode = colorCode;
    }

}