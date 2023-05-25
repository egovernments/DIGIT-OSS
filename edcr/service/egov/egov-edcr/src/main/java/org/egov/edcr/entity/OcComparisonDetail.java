/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) <2015>  eGovernments Foundation
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
package org.egov.edcr.entity;

import java.io.InputStream;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.egov.common.entity.edcr.ScrutinyDetail;
import org.egov.infra.filestore.entity.FileStoreMapper;
import org.egov.infra.persistence.entity.AbstractAuditable;
import org.hibernate.validator.constraints.Length;

@Entity
@Table(name = "EDCR_OC_COMPARISON_DETAIL")
@SequenceGenerator(name = OcComparisonDetail.SEQ_EDCR_OC_COMPARISON_DETAIL, sequenceName = OcComparisonDetail.SEQ_EDCR_OC_COMPARISON_DETAIL, allocationSize = 1)
public class OcComparisonDetail extends AbstractAuditable {

    public static final String SEQ_EDCR_OC_COMPARISON_DETAIL = "SEQ_EDCR_OC_COMPARISON_DETAIL";
    private static final long serialVersionUID = 64L;

    @Id
    @GeneratedValue(generator = SEQ_EDCR_OC_COMPARISON_DETAIL, strategy = GenerationType.SEQUENCE)
    private Long id;

    @Length(min = 1, max = 128)
    private String ocdcrNumber;

    @Length(min = 1, max = 128)
    private String dcrNumber;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "occomparisonreport")
    private FileStoreMapper ocComparisonReport;

    private String status;

    private String tenantId;

    @Transient
    private InputStream output;

    @Transient
    private List<ScrutinyDetail> scrutinyDetails;

    @Transient
    private EdcrApplicationDetail permitDcr;

    @Override
    public Long getId() {
        return id;
    }

    @Override
    protected void setId(final Long id) {
        this.id = id;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOcdcrNumber() {
        return ocdcrNumber;
    }

    public void setOcdcrNumber(String ocdcrNumber) {
        this.ocdcrNumber = ocdcrNumber;
    }

    public String getDcrNumber() {
        return dcrNumber;
    }

    public void setDcrNumber(String dcrNumber) {
        this.dcrNumber = dcrNumber;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public FileStoreMapper getOcComparisonReport() {
        return ocComparisonReport;
    }

    public void setOcComparisonReport(FileStoreMapper ocComparisonReport) {
        this.ocComparisonReport = ocComparisonReport;
    }

    public InputStream getOutput() {
        return output;
    }

    public void setOutput(InputStream output) {
        this.output = output;
    }

    public List<ScrutinyDetail> getScrutinyDetails() {
        return scrutinyDetails;
    }

    public void setScrutinyDetails(List<ScrutinyDetail> scrutinyDetails) {
        this.scrutinyDetails = scrutinyDetails;
    }

    public EdcrApplicationDetail getPermitDcr() {
        return permitDcr;
    }

    public void setPermitDcr(EdcrApplicationDetail permitDcr) {
        this.permitDcr = permitDcr;
    }

}
