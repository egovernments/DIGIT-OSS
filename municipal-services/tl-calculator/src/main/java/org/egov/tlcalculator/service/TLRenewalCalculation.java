package org.egov.tlcalculator.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.*;
import org.egov.tlcalculator.config.TLCalculatorConfigs;
import org.egov.tlcalculator.repository.ServiceRequestRepository;
import org.egov.tlcalculator.utils.CalculationUtils;
import org.egov.tlcalculator.utils.TLCalculatorConstants;
import org.egov.tlcalculator.web.models.CalulationCriteria;
import org.egov.tlcalculator.web.models.demand.Category;
import org.egov.tlcalculator.web.models.demand.TaxHeadEstimate;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Slf4j
public class TLRenewalCalculation {
    @Autowired
    private MDMSService mdmsService;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ServiceRequestRepository repository;

    @Autowired
    private CalculationUtils calculatorUtils;

    @Autowired
    private TLCalculatorConfigs config;


    public List<TaxHeadEstimate> tlRenewalCalculation(RequestInfo requestInfo, CalulationCriteria calulationCriteria, Object mdmsData, BigDecimal taxAmt){
        Map<String, JSONArray> timeBasedExemptionMasterMap = new HashMap<>();
        TaxHeadEstimate estimateRebate = new TaxHeadEstimate();
        TaxHeadEstimate estimatePenalty = new TaxHeadEstimate();
        List<TaxHeadEstimate> estimateList = new ArrayList<>();
        String tenantId = calulationCriteria.getTenantId();
        setPropertyMasterValues(requestInfo, tenantId,timeBasedExemptionMasterMap);
        String financialyear = calulationCriteria.getTradelicense().getFinancialYear();

        BigDecimal rebate = getRebate(taxAmt, financialyear,timeBasedExemptionMasterMap.get(TLCalculatorConstants.REBATE_MASTER));
        BigDecimal penalty = BigDecimal.ZERO;

        if (rebate.equals(BigDecimal.ZERO)) {
            penalty = getPenalty(taxAmt, financialyear, timeBasedExemptionMasterMap.get(TLCalculatorConstants.PENANLTY_MASTER));
        }

        estimateRebate.setCategory(Category.REBATE);
        estimateRebate.setEstimateAmount(rebate.setScale(2, 2).negate());
        estimateRebate.setTaxHeadCode(config.getTimeRebateTaxHead());
        estimateList.add(estimateRebate);

        estimatePenalty.setCategory(Category.PENALTY);
        estimatePenalty.setEstimateAmount(penalty.setScale(2, 2));
        estimatePenalty.setTaxHeadCode(config.getTimePenaltyTaxHead());
        estimateList.add(estimatePenalty);


        return estimateList;
    }


    /**
     * Returns the Amount of Rebate that can be applied on the given tax amount for
     * the given period
     *
     * @param taxAmt
     * @param financialyear
     * @return
     */
    public BigDecimal getRebate(BigDecimal taxAmt, String financialyear, JSONArray rebateMasterList) {

        BigDecimal rebateAmt = BigDecimal.ZERO;
        Map<String, Object> rebate = getApplicableMaster(financialyear, rebateMasterList);
        System.out.println("Rebate Object---->"+rebate);
        if (null == rebate) return rebateAmt;

        String[] time = ((String) rebate.get(TLCalculatorConstants.ENDING_DATE_APPLICABLES)).split("/");
        Calendar cal = Calendar.getInstance();
        setDateToCalendar(financialyear, time, cal);

        System.out.println("cal.getTimeInMillis--->"+cal.getTimeInMillis());
        System.out.println("System.currentTimeMillis--->"+System.currentTimeMillis());

        if (cal.getTimeInMillis() > System.currentTimeMillis())
            rebateAmt = calculateApplicables(taxAmt, rebate);
        System.out.println("rebateAmt rate--->"+rebateAmt);
        return rebateAmt;
    }


    /**
     * Returns the Amount of penalty that has to be applied on the given tax amount for the given period
     *
     * @param taxAmt
     * @param assessmentYear
     * @return
     */
    public BigDecimal getPenalty(BigDecimal taxAmt, String assessmentYear, JSONArray penaltyMasterList) {

        BigDecimal penaltyAmt = BigDecimal.ZERO;
        Map<String, Object> penalty = getApplicableMaster(assessmentYear, penaltyMasterList);
        if (null == penalty) return penaltyAmt;

        String[] time = getStartTime(assessmentYear,penalty);
        Calendar cal = Calendar.getInstance();
        setDateToCalendar(time, cal);
        Long currentIST = System.currentTimeMillis()+TLCalculatorConstants.TIMEZONE_OFFSET;

        if (cal.getTimeInMillis() < currentIST)
            penaltyAmt = calculateApplicables(taxAmt, penalty);

        return penaltyAmt;
    }

    /**
     * Method to enrich the property Master data Map
     *
     * @param requestInfo
     * @param tenantId
     */
    public void setPropertyMasterValues(RequestInfo requestInfo, String tenantId, Map<String, JSONArray> timeBasedExemptionMasterMap) {

        MdmsResponse response = mapper.convertValue(repository.fetchResult(calculatorUtils.getMdmsSearchUrl(),
                getPropertyModuleRequest(requestInfo, tenantId)), MdmsResponse.class);
        Map<String, JSONArray> res = response.getMdmsRes().get("PropertyTax");
        System.out.println("MDMS--->"+res.toString());
        for (Map.Entry<String, JSONArray> entry : res.entrySet())
            timeBasedExemptionMasterMap.put(entry.getKey(), entry.getValue());
    }

    /**
     * Methods provides all the usage category master for property tax module
     */
    public MdmsCriteriaReq getPropertyModuleRequest(RequestInfo requestInfo, String tenantId) {

        List<MasterDetail> details = new ArrayList<>();
        details.add(MasterDetail.builder().name(TLCalculatorConstants.REBATE_MASTER).build());
        details.add(MasterDetail.builder().name(TLCalculatorConstants.PENANLTY_MASTER).build());

        ModuleDetail mdDtl = ModuleDetail.builder().masterDetails(details)
                .moduleName("PropertyTax").build();
        MdmsCriteria mdmsCriteria = MdmsCriteria.builder().moduleDetails(Arrays.asList(mdDtl)).tenantId(tenantId)
                .build();
        return MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();
    }

    /**
     * Returns the 'APPLICABLE' master object from the list of inputs
     *
     * filters the Input based on their effective financial year and starting day
     *
     * If an object is found with effective year same as assessment year that master entity will be returned
     *
     * If exact match is not found then the entity with latest effective financial year which should be lesser than the assessment year
     *
     * NOTE : applicable points to single object  out of all the entries for a given master which fits the period of the property being assessed
     *
     * @param assessmentYear
     * @param masterList
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getApplicableMaster(String assessmentYear, List<Object> masterList) {

        Map<String, Object> objToBeReturned = null;
        String maxYearFromTheList = "0";
        Long maxStartTime = 0l;

        for (Object object : masterList) {

            Map<String, Object> objMap = (Map<String, Object>) object;
            String objFinYear = ((String) objMap.get(TLCalculatorConstants.FROMFY_FIELD_NAME)).split("-")[0];
            if(!objMap.containsKey(TLCalculatorConstants.STARTING_DATE_APPLICABLES)){
                if (objFinYear.compareTo(assessmentYear.split("-")[0]) == 0)
                    return  objMap;

                else if (assessmentYear.split("-")[0].compareTo(objFinYear) > 0 && maxYearFromTheList.compareTo(objFinYear) <= 0) {
                    maxYearFromTheList = objFinYear;
                    objToBeReturned = objMap;
                }
            }
            else{
                String objStartDay = ((String) objMap.get(TLCalculatorConstants.STARTING_DATE_APPLICABLES));
                if (assessmentYear.split("-")[0].compareTo(objFinYear) >= 0 && maxYearFromTheList.compareTo(objFinYear) <= 0) {
                    maxYearFromTheList = objFinYear;
                    Long startTime = getStartDayInMillis(objStartDay);
                    Long currentTime = System.currentTimeMillis();
                    if(startTime < currentTime && maxStartTime < startTime){
                        objToBeReturned = objMap;
                        maxStartTime = startTime;
                    }
                }
            }
        }
        return objToBeReturned;
    }

    /**
     * Converts startDay to epoch
     * @param startDay StartDay of applicable
     * @return
     */
    private Long getStartDayInMillis(String startDay){

        Long startTime = null;
        try{
            SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy");
            Date date = df.parse(startDay);
            startTime = date.getTime();
        }
        catch (ParseException e) {
            throw new CustomException("INVALID STARTDAY","The startDate of the penalty cannot be parsed");
        }

        return startTime;
    }

    /**
     * Sets the date in to calendar based on the month and date value present in the time array
     *
     * @param assessmentYear
     * @param time
     * @param cal
     */
    private void setDateToCalendar(String assessmentYear, String[] time, Calendar cal) {

        cal.clear();
        Integer day = Integer.valueOf(time[0]);
        Integer month = Integer.valueOf(time[1])-1;
        // One is subtracted because calender reads january as 0
        Integer year = Integer.valueOf(assessmentYear.split("-")[0]);
        if (month < 3) year += 1;
        cal.set(year, month, day);
    }



    /**
     * Method to calculate exmeption based on the Amount and exemption map
     *
     * @param applicableAmount
     * @param config
     * @return
     */
    public BigDecimal calculateApplicables(BigDecimal applicableAmount, Object config) {

        BigDecimal currentApplicable = BigDecimal.ZERO;

        if (null == config)
            return currentApplicable;

        @SuppressWarnings("unchecked")
        Map<String, Object> configMap = (Map<String, Object>) config;

        BigDecimal rate = null != configMap.get(TLCalculatorConstants.RATE_FIELD_NAME)
                ? BigDecimal.valueOf(((Number) configMap.get(TLCalculatorConstants.RATE_FIELD_NAME)).doubleValue())
                : null;

        BigDecimal maxAmt = null != configMap.get(TLCalculatorConstants.MAX_AMOUNT_FIELD_NAME)
                ? BigDecimal.valueOf(((Number) configMap.get(TLCalculatorConstants.MAX_AMOUNT_FIELD_NAME)).doubleValue())
                : null;

        BigDecimal minAmt = null != configMap.get(TLCalculatorConstants.MIN_AMOUNT_FIELD_NAME)
                ? BigDecimal.valueOf(((Number) configMap.get(TLCalculatorConstants.MIN_AMOUNT_FIELD_NAME)).doubleValue())
                : null;

        BigDecimal flatAmt = null != configMap.get(TLCalculatorConstants.FLAT_AMOUNT_FIELD_NAME)
                ? BigDecimal.valueOf(((Number) configMap.get(TLCalculatorConstants.FLAT_AMOUNT_FIELD_NAME)).doubleValue())
                : BigDecimal.ZERO;

        if (null == rate)
            currentApplicable = flatAmt.compareTo(applicableAmount) > 0 ? applicableAmount : flatAmt;
        else {
            currentApplicable = applicableAmount.multiply(rate.divide(TLCalculatorConstants.HUNDRED));

            if (null != maxAmt && BigDecimal.ZERO.compareTo(maxAmt) < 0 && currentApplicable.compareTo(maxAmt) > 0)
                currentApplicable = maxAmt;
            else if (null != minAmt && currentApplicable.compareTo(minAmt) < 0)
                currentApplicable = minAmt;
        }
        return currentApplicable;
    }

    /**
     * Fetch the fromFY and take the starting year of financialYear
     * calculate the difference between the start of assessment financial year and fromFY
     * Add the difference in year to the year in the starting day
     * eg: Assessment year = 2017-18 and interestMap fetched from master due to fallback have fromFY = 2015-16
     * and startingDay = 01/04/2016. Then diff = 2017-2015 = 2
     * Therefore the starting day will be modified from 01/04/2016 to 01/04/2018
     * @param assessmentYear Year of the assessment
     * @param interestMap The applicable master data
     * @return list of string with 0'th element as day, 1'st as month and 2'nd as year
     */
    private String[] getStartTime(String assessmentYear,Map<String, Object> interestMap){
        String financialYearOfApplicableEntry = ((String) interestMap.get(TLCalculatorConstants.FROMFY_FIELD_NAME)).split("-")[0];
        Integer diffInYear = Integer.valueOf(assessmentYear.split("-")[0]) - Integer.valueOf(financialYearOfApplicableEntry);
        String startDay = ((String) interestMap.get(TLCalculatorConstants.STARTING_DATE_APPLICABLES));
        Integer yearOfStartDayInApplicableEntry = Integer.valueOf((startDay.split("/")[2]));
        startDay = startDay.replace(String.valueOf(yearOfStartDayInApplicableEntry),String.valueOf(yearOfStartDayInApplicableEntry+diffInYear));
        String[] time = startDay.split("/");
        return time;
    }

    /**
     * Overloaded method
     * Sets the date in to calendar based on the month and date value present in the time array*
     * @param time
     * @param cal
     */
    private void setDateToCalendar(String[] time, Calendar cal) {

        cal.clear();
        TimeZone timeZone = TimeZone.getTimeZone("Asia/Kolkata");
        cal.setTimeZone(timeZone);
        Integer day = Integer.valueOf(time[0]);
        Integer month = Integer.valueOf(time[1])-1;
        // One is subtracted because calender reads january as 0
        Integer year = Integer.valueOf(time[2]);
        cal.set(year, month, day);
    }



}
