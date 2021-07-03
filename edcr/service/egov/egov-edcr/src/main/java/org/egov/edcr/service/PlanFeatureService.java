package org.egov.edcr.service;

import java.util.List;

import org.egov.common.entity.edcr.PlanFeature;
import org.egov.edcr.repository.PlanFeatureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlanFeatureService {

    @Autowired
    private PlanFeatureRepository featureRepository;

    public List<PlanFeature> getFeatures() {
        return featureRepository.getFeatures();

    }

}
