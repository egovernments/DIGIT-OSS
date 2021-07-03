package org.egov.tlcalculator.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tlcalculator.config.TLCalculatorConfigs;
import org.egov.tlcalculator.kafka.broker.TLCalculatorProducer;
import org.egov.tlcalculator.repository.builder.BillingslabQueryBuilder;
import org.egov.tlcalculator.repository.BillingslabRepository;
import org.egov.tlcalculator.repository.ServiceRequestRepository;
import org.egov.tlcalculator.utils.CalculationUtils;
import org.egov.tlcalculator.utils.TLCalculatorConstants;
import org.egov.tlcalculator.web.models.*;
import org.egov.tlcalculator.web.models.enums.CalculationType;
import org.egov.tlcalculator.web.models.FeeAndBillingSlabIds;
import org.egov.tlcalculator.web.models.tradelicense.TradeLicense;
import org.egov.tlcalculator.web.models.demand.Category;
import org.egov.tlcalculator.web.models.demand.TaxHeadEstimate;
import org.egov.tlcalculator.web.models.tradelicense.TradeUnit;
import org.egov.tlcalculator.web.models.tradelicense.EstimatesAndSlabs;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.*;

import static org.egov.tlcalculator.utils.TLCalculatorConstants.businessService_BPA;


@Service
@Slf4j
public class BPACalculationService {


    @Autowired
    private BillingslabRepository repository;

    @Autowired
    private BillingslabQueryBuilder queryBuilder;

    @Autowired
    private TLCalculatorConfigs config;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private CalculationUtils utils;

    @Autowired
    private DemandService demandService;

    @Autowired
    private TLCalculatorProducer producer;

    @Autowired
    private MDMSService mdmsService;

    @Autowired
    private BPABillingSlabService bpaBillingSlabService;

    /**
     * Calculates tax estimates and creates demand
     *
     * @param calculationReq The calculationCriteria request
     * @return List of calculations for all applicationNumbers or tradeLicenses in calculationReq
     */
    public List<Calculation> calculate(CalculationReq calculationReq) {
        String tenantId = calculationReq.getCalulationCriteria().get(0).getTenantId();
        Object mdmsData = mdmsService.mDMSCall(calculationReq.getRequestInfo(), tenantId);
        List<Calculation> calculations = getCalculation(calculationReq.getRequestInfo(),
                calculationReq.getCalulationCriteria(), mdmsData);
        demandService.generateDemand(calculationReq.getRequestInfo(), calculations, mdmsData, businessService_BPA);
        CalculationRes calculationRes = CalculationRes.builder().calculations(calculations).build();
        producer.push(config.getSaveTopic(), calculationRes);
        return calculations;
    }


    /***
     * Calculates tax estimates
     * @param requestInfo The requestInfo of the calculation request
     * @param criterias list of CalculationCriteria containing the tradeLicense or applicationNumber
     * @return List of calculations for all applicationNumbers or tradeLicenses in criterias
     */
    public List<Calculation> getCalculation(RequestInfo requestInfo, List<CalulationCriteria> criterias, Object mdmsData) {
        List<Calculation> calculations = new LinkedList<>();
        for (CalulationCriteria criteria : criterias) {
            TradeLicense license;
            if (criteria.getTradelicense() == null && criteria.getApplicationNumber() != null) {
                license = utils.getTradeLicense(requestInfo, criteria.getApplicationNumber(), criteria.getTenantId());
                criteria.setTradelicense(license);
            }
            EstimatesAndSlabs estimatesAndSlabs = getTaxHeadEstimates(criteria, requestInfo, mdmsData);
            List<TaxHeadEstimate> taxHeadEstimates = estimatesAndSlabs.getEstimates();
            Calculation calculation = new Calculation();
            calculation.setTradeLicense(criteria.getTradelicense());
            calculation.setTenantId(criteria.getTenantId());
            calculation.setTaxHeadEstimates(taxHeadEstimates);
            calculations.add(calculation);
        }
        return calculations;
    }


    /**
     * Creates TacHeadEstimates
     *
     * @param calulationCriteria CalculationCriteria containing the tradeLicense or applicationNumber
     * @param requestInfo        The requestInfo of the calculation request
     * @return TaxHeadEstimates and the billingSlabs used to calculate it
     */
    private EstimatesAndSlabs getTaxHeadEstimates(CalulationCriteria calulationCriteria, RequestInfo requestInfo, Object mdmsData) {
        List<TaxHeadEstimate> estimates = new LinkedList<>();
        EstimatesAndSlabs estimatesAndSlabs = getBaseTax(calulationCriteria, requestInfo, mdmsData);

        estimates.addAll(estimatesAndSlabs.getEstimates());

        estimatesAndSlabs.setEstimates(estimates);

        return estimatesAndSlabs;
    }


    /**
     * Calculates base tax and cretaes its taxHeadEstimate
     *
     * @param calulationCriteria CalculationCriteria containing the tradeLicense or applicationNumber
     * @param requestInfo        The requestInfo of the calculation request
     * @return BaseTax taxHeadEstimate and billingSlabs used to calculate it
     */
    private EstimatesAndSlabs getBaseTax(CalulationCriteria calulationCriteria, RequestInfo requestInfo, Object mdmsData) {
        TradeLicense license = calulationCriteria.getTradelicense();
        EstimatesAndSlabs estimatesAndSlabs = new EstimatesAndSlabs();

        String tradetype = license.getTradeLicenseDetail().getTradeUnits().get(0).getTradeType();
        BillingSlabSearchCriteria searchCriteria = new BillingSlabSearchCriteria();
        searchCriteria.setTenantId(license.getTenantId());
        searchCriteria.setTradeType(tradetype);
        BillingSlab billingSlab = bpaBillingSlabService.search(searchCriteria, requestInfo);
        if (billingSlab == null) {

            throw new CustomException("NO BILLINGSLABFOUND", "No Billing Slab found for " + tradetype);
        }
        TaxHeadEstimate estimate = new TaxHeadEstimate();
        estimate.setEstimateAmount(billingSlab.getRate());
        estimate.setCategory(Category.FEE);
        estimate.setTaxHeadCode(config.getBpabaseTaxHead());
        estimatesAndSlabs.setEstimates(Collections.singletonList(estimate));
        return estimatesAndSlabs;
    }
}
