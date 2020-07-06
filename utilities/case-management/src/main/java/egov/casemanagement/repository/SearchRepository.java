package egov.casemanagement.repository;

import egov.casemanagement.web.models.CaseSearchRequest;
import egov.casemanagement.web.models.ModelCase;

import java.util.List;

public interface SearchRepository {
    public List<ModelCase> searchCases(CaseSearchRequest request);
    List<ModelCase> searchDefaulterCases(String tenantId, Long timestamp);
}
