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
package org.egov.egf.contract.model;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.egov.commons.CGeneralLedger;
import org.egov.commons.CVoucherHeader;
import org.hibernate.validator.constraints.SafeHtml;

public class Voucher {

    private Long id;
    @SafeHtml
    private String name;
    @SafeHtml
    private String type;
    @SafeHtml
    private String voucherNumber;
    @SafeHtml
    private String description;
    @SafeHtml
    private String voucherDate;
    @SafeHtml
    private FundContract fund;
    private FunctionContract function;
    private FiscalPeriodContract fiscalPeriod;
    private EgwStatusContract status;
    private Long originalVhId;
    private Long refVhId;
    @SafeHtml
    private String cgvn;
    private Long moduleId;
    @SafeHtml
    private String department;
    @SafeHtml
    private String source;
    private SchemeContract scheme;
    private SubSchemeContract subScheme;
    private FunctionaryContract functionary;
    private FundsourceContract fundsource;
    private List<AccountDetailContract> ledgers = new ArrayList<>(0);
    // this is only to keep standard .As of now this field is not used
    @SafeHtml
    private String tenantId;
    @SafeHtml
    private String serviceName;
    @SafeHtml
    private String referenceDocument;

    public Voucher(final CVoucherHeader vh) {
        final SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy");
        voucherNumber = vh.getVoucherNumber();
        voucherDate = sdf.format(vh.getVoucherDate());
        fund = new FundContract().code(vh.getFundId().getCode());
        id = vh.getId();
        cgvn = vh.getCgvn();
        department = vh.getVouchermis().getDepartmentcode();
        if (vh.getVouchermis().getFunction() != null)
            function = new FunctionContract().code(vh.getVouchermis().getFunction().getCode());
        type = vh.getType();
        name = vh.getName();
        if (vh.getModuleId() != null)
            moduleId = Long.valueOf(vh.getModuleId());
        status = new EgwStatusContract().code(vh.getStatus());
        for (final CGeneralLedger gl : vh.getGeneralLedger())
            getLedgers().add(new AccountDetailContract(gl));
        setServiceName(vh.getVouchermis().getServiceName());
        setReferenceDocument(vh.getVouchermis().getReferenceDocument());
    }

    public Voucher() {
        super();
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(final String tenantId) {
        this.tenantId = tenantId;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(final String type) {
        this.type = type;
    }

    public String getVoucherNumber() {
        return voucherNumber;
    }

    public void setVoucherNumber(final String voucherNumber) {
        this.voucherNumber = voucherNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }

    public String getVoucherDate() {
        return voucherDate;
    }

    public void setVoucherDate(final String voucherDate) {
        this.voucherDate = voucherDate;
    }

    public FundContract getFund() {
        return fund;
    }

    public void setFund(final FundContract fund) {
        this.fund = fund;
    }

    public FunctionContract getFunction() {
        return function;
    }

    public void setFunction(final FunctionContract function) {
        this.function = function;
    }

    public FiscalPeriodContract getFiscalPeriod() {
        return fiscalPeriod;
    }

    public void setFiscalPeriod(final FiscalPeriodContract fiscalPeriod) {
        this.fiscalPeriod = fiscalPeriod;
    }

    public EgwStatusContract getStatus() {
        return status;
    }

    public void setStatus(final EgwStatusContract status) {
        this.status = status;
    }

    public Long getOriginalVhId() {
        return originalVhId;
    }

    public void setOriginalVhId(final Long originalVhId) {
        this.originalVhId = originalVhId;
    }

    public Long getRefVhId() {
        return refVhId;
    }

    public void setRefVhId(final Long refVhId) {
        this.refVhId = refVhId;
    }

    public String getCgvn() {
        return cgvn;
    }

    public void setCgvn(final String cgvn) {
        this.cgvn = cgvn;
    }

    public Long getModuleId() {
        return moduleId;
    }

    public void setModuleId(final Long moduleId) {
        this.moduleId = moduleId;
    }

    public List<AccountDetailContract> getLedgers() {
        return ledgers;
    }

    public void setLedgers(final List<AccountDetailContract> ledgers) {
        this.ledgers = ledgers;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(final String department) {
        this.department = department;
    }

    public Long getId() {
        return id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(final String source) {
        this.source = source;
    }

    public SchemeContract getScheme() {
        return scheme;
    }

    public void setScheme(final SchemeContract scheme) {
        this.scheme = scheme;
    }

    public FunctionaryContract getFunctionary() {
        return functionary;
    }

    public void setFunctionary(final FunctionaryContract functionary) {
        this.functionary = functionary;
    }

    public FundsourceContract getFundsource() {
        return fundsource;
    }

    public void setFundsource(final FundsourceContract fundsource) {
        this.fundsource = fundsource;
    }

    public SubSchemeContract getSubScheme() {
        return subScheme;
    }

    public void setSubScheme(final SubSchemeContract subScheme) {
        this.subScheme = subScheme;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(final String serviceName) {
        this.serviceName = serviceName;
    }

    public String getReferenceDocument() {
        return referenceDocument;
    }

    public void setReferenceDocument(final String referenceDocument) {
        this.referenceDocument = referenceDocument;
    }

}
