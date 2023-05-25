package org.egov.edcr.service;

import org.egov.edcr.entity.Amendment;
import org.springframework.stereotype.Service;

@Service
public class AmendmentService {
    protected Amendment getAmendments() {
        return new Amendment();
    }

}
