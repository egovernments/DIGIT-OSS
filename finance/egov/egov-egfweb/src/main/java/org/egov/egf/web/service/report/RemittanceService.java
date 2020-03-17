package org.egov.egf.web.service.report;

import java.util.List;

import org.egov.model.remittance.RemittanceReportModel;

public interface RemittanceService {
    List<RemittanceReportModel> getRemittanceColectionsReports(RemittanceReportModel model);
}
