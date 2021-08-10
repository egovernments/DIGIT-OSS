package org.egov.edcr.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.egov.common.entity.dcr.helper.EdcrApplicationInfo;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Building;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.FloorDescription;
import org.egov.common.entity.edcr.Occupancy;
import org.egov.common.entity.edcr.OccupancyType;
import org.egov.common.entity.edcr.Plan;
import org.egov.common.entity.edcr.PlanInformation;
import org.egov.edcr.entity.EdcrApplicationDetail;
import org.egov.edcr.entity.OcComparisonDetail;
import org.egov.edcr.repository.EdcrApplicationDetailRepository;
import org.egov.edcr.repository.OcComparisonDetailRepository;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class OcComparisonDetailService {

    public static final String FLOOR_DESC = "floorDesc";
    public static final String FLOOR_NO = "floorNo";

    @Autowired
    private OcComparisonDetailRepository ocComparisonDetailRepository;

    @PersistenceContext
    private EntityManager entityManager;

    private Session getCurrentSession() {
        return entityManager.unwrap(Session.class);
    }

    public void save(OcComparisonDetail ocComparisonDetail) {
        ocComparisonDetailRepository.save(ocComparisonDetail);
    }
    
    public void saveAndFlush(OcComparisonDetail ocComparisonDetail) {
        ocComparisonDetailRepository.saveAndFlush(ocComparisonDetail);
    }

    public void saveAll(List<OcComparisonDetail> ocComparisonDetails) {
        ocComparisonDetailRepository.save(ocComparisonDetails);
    }

    public OcComparisonDetail findByDcrNumber(final String dcrNumber) {
        return ocComparisonDetailRepository.findByDcrNumber(dcrNumber);
    }

    public OcComparisonDetail findByOcDcrNumber(final String ocdcrNumber) {
        return ocComparisonDetailRepository.findByOcdcrNumber(ocdcrNumber);
    }

    public OcComparisonDetail findByOcDcrNoAndDcrNumber(final String ocdcrNumber, String dcrNumber) {
        return ocComparisonDetailRepository.findByOcdcrNumberAndDcrNumber(ocdcrNumber, dcrNumber);
    }

    public OcComparisonDetail findByOcDcrNoAndDcrNumberAndTenant(final String ocdcrNumber, String dcrNumber, String tenantId) {
        return ocComparisonDetailRepository.findByOcdcrNumberAndDcrNumberAndTenantId(ocdcrNumber, dcrNumber, tenantId);
    }

}
