package egov.casemanagement.service;

import egov.casemanagement.web.models.CaseCreateRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CaseValidator {

    void validateCreateCase(CaseCreateRequest caseCreateRequest){
        //Validate here

        Map<String,String> errorMap = new HashMap<>();

        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);

        return;
    }

}
