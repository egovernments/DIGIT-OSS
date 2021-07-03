/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
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
package org.egov.commons;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.egov.infra.persistence.entity.AbstractAuditable;
import org.egov.infra.persistence.validator.annotation.DateFormat;
import org.egov.infra.persistence.validator.annotation.Unique;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.SafeHtml;

@Entity
@Table(name = "fiscalperiod")
@Unique(id = "id", tableName = "fiscalperiod", fields = { "name" }, columnName = { "name" }, enableDfltMsg = true)
@SequenceGenerator(name = CFiscalPeriod.SEQ_CFISCALPERIOD, sequenceName = CFiscalPeriod.SEQ_CFISCALPERIOD, allocationSize = 1)
public class CFiscalPeriod extends AbstractAuditable {

    private static final long serialVersionUID = -5166451072153556422L;

    public static final String SEQ_CFISCALPERIOD = "SEQ_FISCALPERIOD";

    @Id
    @GeneratedValue(generator = SEQ_CFISCALPERIOD, strategy = GenerationType.SEQUENCE)
    private Long id;

    private Integer type = 0;

    @Length(min = 1, max = 25)
    @NotNull
    @SafeHtml
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "financialyearid", updatable = false)
    private CFinancialYear cFinancialYear;

    private Integer parentId = 0;

    @NotNull
    @DateFormat
    private Date startingDate;

    @NotNull
    @DateFormat
    private Date endingDate;

    private Boolean isActive;

    private Boolean isActiveForPosting;

    private Boolean isClosed;

    public Date getEndingDate() {
        return endingDate;
    }

    @Override
    public Long getId() {
        return id;
    }

    public Integer getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public Integer getParentId() {
        return parentId;
    }

    public Date getStartingDate() {
        return startingDate;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public Boolean getIsActiveForPosting() {
        return isActiveForPosting;
    }

    public Boolean getIsClosed() {
        return isClosed;
    }

    @Override
    public void setId(final Long id) {
        this.id = id;
    }

    public void setType(final Integer type) {
        this.type = type;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public CFinancialYear getcFinancialYear() {
        return cFinancialYear;
    }

    public void setcFinancialYear(final CFinancialYear cFinancialYear) {
        this.cFinancialYear = cFinancialYear;
    }

    public void setParentId(final Integer parentId) {
        this.parentId = parentId;
    }

    public void setStartingDate(final Date startingDate) {
        this.startingDate = startingDate;
    }

    public void setEndingDate(final Date endingDate) {
        this.endingDate = endingDate;
    }

    public void setIsActive(final Boolean isActive) {
        this.isActive = isActive;
    }

    public void setIsActiveForPosting(final Boolean isActiveForPosting) {
        this.isActiveForPosting = isActiveForPosting;
    }

    public void setIsClosed(final Boolean isClosed) {
        this.isClosed = isClosed;
    }

}
