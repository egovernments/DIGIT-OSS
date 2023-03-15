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

package org.egov.egf.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.egov.commons.CFinancialYear;
import org.egov.enums.CloseTypeEnum;
import org.egov.infra.persistence.entity.AbstractAuditable;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.AuditOverrides;
import org.hibernate.envers.Audited;
import org.hibernate.validator.constraints.SafeHtml;

@Entity
@Table(name = "closedperiods")
@SequenceGenerator(name = ClosedPeriod.SEQ, sequenceName = ClosedPeriod.SEQ, allocationSize = 1)
@AuditOverrides({ @AuditOverride(forClass = AbstractAuditable.class, name = "lastModifiedBy"),
        @AuditOverride(forClass = AbstractAuditable.class, name = "lastModifiedDate") })
@Audited
public class ClosedPeriod extends AbstractAuditable {

    private static final long serialVersionUID = 1L;
    public static final String SEQ = "seq_closedperiods";

    @Id
    @GeneratedValue(generator = SEQ, strategy = GenerationType.SEQUENCE)
    private Long id = null;

    private Date startingDate;
    @Transient
    private int fromDate;
    @Transient
    private int toDate;

    private Date endingDate;

    private Boolean isClosed = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "closetype")
    private CloseTypeEnum closeType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "financialYearId", nullable = false)
    private CFinancialYear financialYear;

    @SafeHtml
    @NotNull
    private String remarks;

    public int getFromDate() {
        return fromDate;
    }

    public void setFromDate(int fromDate) {
        this.fromDate = fromDate;
    }

    public int getToDate() {
        return toDate;
    }

    public void setToDate(int toDate) {
        this.toDate = toDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(final String remarks) {
        this.remarks = remarks;
    }

    public Boolean getIsClosed() {
        return isClosed;
    }

    public void setIsClosed(final Boolean isClosed) {
        this.isClosed = isClosed;
    }

    @Override
    public Long getId() {
        return id;
    }

   
    @Override
    public void setId(final Long id) {
        this.id = id;
    }

    public CFinancialYear getFinancialYear() {
        return financialYear;
    }

    public void setFinancialYear(CFinancialYear financialYear) {
        this.financialYear = financialYear;
    }

    public Date getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(final Date startingDate) {
        this.startingDate = startingDate;
    }

    public Date getEndingDate() {
        return endingDate;
    }

    public void setEndingDate(final Date endingDate) {
        this.endingDate = endingDate;
    }

    public CloseTypeEnum getCloseType() {
        return closeType;
    }

    public void setCloseType(CloseTypeEnum closeType) {
        this.closeType = closeType;
    }

    public int compareTo(final ClosedPeriod p) {
        if (p.getFinancialYear().getFinYearRange().compareTo(getFinancialYear().getFinYearRange()) > 0)
            return -1;
        else if (p.getFinancialYear().getFinYearRange().compareTo(getFinancialYear().getFinYearRange()) < 0)
            return 1;
        else
            return 0;
    }
}
