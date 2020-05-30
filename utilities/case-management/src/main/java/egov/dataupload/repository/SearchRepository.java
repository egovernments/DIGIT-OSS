package egov.dataupload.repository;

import egov.dataupload.web.models.CaseSearchRequest;
import egov.dataupload.web.models.ModelCase;

import java.util.List;

public interface SearchRepository {
    public List<ModelCase> searchCases(CaseSearchRequest request);
}
