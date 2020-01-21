package org.egov.pt.calculator.service;

import java.math.BigDecimal;
import java.util.*;

import static org.egov.pt.calculator.util.CalculatorConstants.*;
import org.egov.pt.calculator.util.CalculatorUtils;
import org.egov.pt.calculator.web.models.TaxHeadEstimate;
import org.egov.pt.calculator.web.models.collections.Payment;
import org.egov.pt.calculator.web.models.demand.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import net.minidev.json.JSONArray;

/**
 * Deals with the functionality that are performed 
 * 
 * before the time of bill generation(before payment)  
 * 
 * or at the time of bill apportioning(after payment)
 * 
 * @author kavi elrey
 *
 */
@Service
public class PayService {

	@Autowired
	private CalculatorUtils utils;

	@Autowired
	private MasterDataService mDService;
	
	/**
	 * Updates the incoming demand with latest rebate, penalty and interest values if applicable
	 * 
	 * If the demand details are not already present then new demand details will be added
	 * 
	 * @param assessmentYear
	 * @return
	 */

	public Map<String, BigDecimal> applyPenaltyRebateAndInterest(Demand demand, List<Payment> payments,
			List<TaxPeriod> taxPeriods, Map<String, JSONArray> jsonMasterMap) {

			Map<String, BigDecimal> estimates = new HashMap<>();
	
			BigDecimal rebate = BigDecimal.ZERO; 
			rebate= getRebate(demand, jsonMasterMap.get(REBATE_MASTER));
	
			BigDecimal penalty = BigDecimal.ZERO;
			BigDecimal interest = BigDecimal.ZERO;
	
			if (rebate.equals(BigDecimal.ZERO)) {
				interest = getInterestCurrent(demand, payments,taxPeriods, jsonMasterMap.get(INTEREST_MASTER));
			}
	
			estimates.put(PT_TIME_REBATE, rebate.setScale(2, 2).negate());
			estimates.put(PT_TIME_PENALTY, penalty.setScale(2, 2));
			estimates.put(PT_TIME_INTEREST, interest.setScale(2, 2));
			return estimates;

	}

	/**
	 * Returns the Amount of Rebate that can be applied on the given tax amount for
	 * the given period
	 * 
	 * @param taxAmt
	 * @param assessmentYear
	 * @return
	 */
	public BigDecimal getRebate(Demand demand, List<Object> rebateMasterList) {

		BigDecimal rebateAmt = BigDecimal.ZERO;
		BigDecimal taxAmt= BigDecimal.ZERO;
		for ( DemandDetail demandDetail: demand.getDemandDetails()){
			if(demandDetail.getTaxHeadMasterCode().equalsIgnoreCase("PT_TAX")){
				taxAmt = demandDetail.getTaxAmount();
			}
		}

		rebateAmt = taxAmt.multiply(BigDecimal.valueOf(10)).divide(HUNDRED);

		// int currentYear = Calendar.getInstance().get(Calendar.YEAR);
		// int currentMonth = Calendar.getInstance().get(Calendar.MONTH) + 1;
		// String currentFinancialYear = currentMonth < 3 ? (currentYear - 1) + "-" + currentYear : currentYear + "-" + (currentYear + 1);

		// Calendar fromCalendar = Calendar.getInstance();
		// fromCalendar.setTimeInMillis(demand.getTaxPeriodFrom());
		// int fromYear = fromCalendar.get(Calendar.YEAR);
		// Calendar toCalendar = Calendar.getInstance();
		// toCalendar.setTimeInMillis(demand.getTaxPeriodTo());
		// int toYear = fromCalendar.get(Calendar.YEAR);
		// String demandFinancialYear = fromYear+"-"+toYear;
		

		// if(currentFinancialYear.equals(demandFinancialYear)){

		// 	for (Object rebate : rebateMasterList){
		// 		Map<String, Object> rebateMap = (Map<String, Object>) rebate;
		// 		if((long)rebateMap.get("startDate") < Calendar.getInstance().getTimeInMillis() && Calendar.getInstance().getTimeInMillis() < (long)rebateMap.get("endDate"))
		// 			rebateAmt = ((BigDecimal)rebateMap.get("rate")).multiply() 
		// 	}
			
		// }
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
		Map<String, Object> penalty = mDService.getApplicableMaster(assessmentYear, penaltyMasterList);
		if (null == penalty) return penaltyAmt;

		String[] time = getStartTime(assessmentYear,penalty);
		Calendar cal = Calendar.getInstance();
		setDateToCalendar(time, cal);
		Long currentIST = System.currentTimeMillis()+TIMEZONE_OFFSET;

		if (cal.getTimeInMillis() < currentIST)
			penaltyAmt = mDService.calculateApplicables(taxAmt, penalty);

		return penaltyAmt;
	}

	/**
	 * Returns the Amount of penalty that has to be applied on the given tax amount for the given period
	 * If paid after April 1st full year interest on the amount is caluculated
	 * 
	 * @param taxAmt
	 * @param assessmentYear
	 * @return
	 */
	private BigDecimal getInterestCurrent(Demand demand, List<Payment> payments, List<TaxPeriod> taxPeriods,
			JSONArray jsonArray) {

		BigDecimal interestAmt = BigDecimal.ZERO;

		for (TaxPeriod taxPeriod : taxPeriods) {
			BigDecimal interestPerTaxPeriod = BigDecimal.ZERO;
			if (taxPeriod.getFromDate() > demand.getTaxPeriodFrom()) {
				BigDecimal taxAmt = getTaxAmountToCalculateInterestOnApplicables(taxPeriod.getFromDate(), demand, payments);
				BigDecimal interestRateForTaxperiod = utils.getInterestRateForTaxperiod(taxPeriod.getFinancialYear(), jsonArray);
				interestPerTaxPeriod = taxAmt.multiply(interestRateForTaxperiod.divide(HUNDRED));
			}
			interestAmt = interestAmt.add(interestPerTaxPeriod);
		}

		return interestAmt;
	}

	/**
	 * Calculates the tax amount on which interest need to be calculated. 
	 * TODO: check below
	 */
	private BigDecimal getTaxAmountToCalculateInterestOnApplicables(Long fromDate, Demand demand,
			List<Payment> payments) {

		if (payments == null || CollectionUtils.isEmpty(payments))
			return utils.getTaxAmtFromDemandForApplicablesGeneration(demand);
		else {

			BigDecimal taxAmt = BigDecimal.ZERO;
			BigDecimal amtPaid = BigDecimal.ZERO;

			List<BillAccountDetail> billAccountDetails = new LinkedList<>();

			payments.forEach(payment -> {
				if (payment.getTransactionDate() < fromDate) {
					payment.getPaymentDetails().forEach(paymentDetail -> {
						if (paymentDetail.getBusinessService().equalsIgnoreCase(SERVICE_FIELD_VALUE_PT)) {
							paymentDetail.getBill().getBillDetails().forEach(billDetail -> {
								billAccountDetails.addAll(billDetail.getBillAccountDetails());
							});
						}
					});
				}
			});

			for (BillAccountDetail detail : billAccountDetails) {
				if (TAXES_TO_BE_CONSIDERD.contains(detail.getTaxHeadCode())) {
					taxAmt = taxAmt.add(detail.getAmount());
					amtPaid = amtPaid.add(detail.getAdjustedAmount());
				}
			}
			return taxAmt.subtract(amtPaid);
		}
	}

	/**
	 * Apportions the amount paid to the bill account details based on the tax head
	 * codes priority
	 * 
	 * The Anonymous comparator uses the priority map to decide the precedence
	 * 
	 * Once the list is sorted based on precedence the amount will apportioned
	 * appropriately
	 * 
	 * @param billAccountDetails
	 * @param amtPaid
	 */
	private void apportionBillAccountDetails(List<BillAccountDetail> billAccountDetails, BigDecimal amtPaid) {

		Collections.sort(billAccountDetails, new Comparator<BillAccountDetail>() {
			final Map<String, Integer> taxHeadpriorityMap = utils.getTaxHeadApportionPriorityMap();

			@Override
			public int compare(BillAccountDetail arg0, BillAccountDetail arg1) {
				String taxHead0 = arg0.getTaxHeadCode();
				String taxHead1 = arg1.getTaxHeadCode();

				Integer value0 = taxHeadpriorityMap.get(MAX_PRIORITY_VALUE);
				Integer value1 = taxHeadpriorityMap.get(MAX_PRIORITY_VALUE);

				if (null != taxHeadpriorityMap.get(taxHead0))
					value0 = taxHeadpriorityMap.get(taxHead0);

				if (null != taxHeadpriorityMap.get(taxHead1))
					value1 = taxHeadpriorityMap.get(taxHead1);

				return value0 - value1;
			}
		});

		/*
		 * amtRemaining is the total amount left to apportioned if amtRemaining is zero
		 * then break the for loop
		 * 
		 * if the amountToBePaid is greater then amtRemaining then set amtRemaining to
		 * collectedAmount(creditAmount)
		 * 
		 * if the amtRemaining is Greater than amountToBeCollected then subtract
		 * amtToBecollected from amtRemaining and set the same to
		 * collectedAmount(creditAmount)
		 */
		BigDecimal amtRemaining = amtPaid;
		for (BillAccountDetail billAccountDetail : billAccountDetails) {
			if (BigDecimal.ZERO.compareTo(amtRemaining) < 0) {
				BigDecimal amtToBePaid = billAccountDetail.getAmount();
				if (amtToBePaid.compareTo(amtRemaining) >= 0) {
					billAccountDetail.setAdjustedAmount(amtRemaining);
					amtRemaining = BigDecimal.ZERO;
				} else if (amtToBePaid.compareTo(amtRemaining) < 0) {
					billAccountDetail.setAdjustedAmount(amtToBePaid);
					amtRemaining = amtRemaining.subtract(amtToBePaid);
				}
			} else break;
		}
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

	/**
	 * Decimal is ceiled for all the tax heads
	 * 
	 * if the decimal is greater than 0.5 upper bound will be applied
	 * 
	 * else if decimal is lesser than 0.5 lower bound is applied
	 * 
	 */
	public TaxHeadEstimate roundOfDecimals(BigDecimal creditAmount, BigDecimal debitAmount) {

		BigDecimal roundOffPos = BigDecimal.ZERO;
		BigDecimal roundOffNeg = BigDecimal.ZERO;

		BigDecimal result = creditAmount.add(debitAmount);
		BigDecimal roundOffAmount = result.setScale(2, 2);
		BigDecimal reminder = roundOffAmount.remainder(BigDecimal.ONE);

		if (reminder.doubleValue() >= 0.5)
			roundOffPos = roundOffPos.add(BigDecimal.ONE.subtract(reminder));
		else if (reminder.doubleValue() < 0.5)
			roundOffNeg = roundOffNeg.add(reminder).negate();

		if (roundOffPos.doubleValue() > 0)
			return TaxHeadEstimate.builder().estimateAmount(roundOffPos)
					.taxHeadCode(PT_ROUNDOFF).build();
		else if (roundOffNeg.doubleValue() < 0)
			return TaxHeadEstimate.builder().estimateAmount(roundOffNeg)
					.taxHeadCode(PT_ROUNDOFF).build();
		else
			return null;
	}

	public TaxHeadEstimate roundOffDecimals(BigDecimal amount,BigDecimal totalRoundOffAmount) {

		BigDecimal roundOff = BigDecimal.ZERO;

		BigDecimal roundOffAmount = amount.setScale(2, 2);
		BigDecimal reminder = roundOffAmount.remainder(BigDecimal.ONE);

		if (reminder.doubleValue() >= 0.5)
			roundOff = roundOff.add(BigDecimal.ONE.subtract(reminder));
		else if (reminder.doubleValue() < 0.5)
			roundOff = roundOff.add(reminder).negate();

		if(roundOff.doubleValue() != 0)
			roundOff = roundOff.subtract(totalRoundOffAmount);


		if (roundOff.doubleValue() != 0)
			return TaxHeadEstimate.builder().estimateAmount(roundOff)
					.taxHeadCode(PT_ROUNDOFF).build();
		else
			return null;
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
		String financialYearOfApplicableEntry = ((String) interestMap.get(FROMFY_FIELD_NAME)).split("-")[0];
		Integer diffInYear = Integer.valueOf(assessmentYear.split("-")[0]) - Integer.valueOf(financialYearOfApplicableEntry);
		String startDay = ((String) interestMap.get(STARTING_DATE_APPLICABLES));
		Integer yearOfStartDayInApplicableEntry = Integer.valueOf((startDay.split("/")[2]));
		startDay = startDay.replace(String.valueOf(yearOfStartDayInApplicableEntry),String.valueOf(yearOfStartDayInApplicableEntry+diffInYear));
		String[] time = startDay.split("/");
		return time;
	}



	/**
	 * Calculates the interest based on the given parameters
	 * @param numberOfDaysInMillies Time for which interest has to be calculated
	 * @param applicableAmount The amount on which interest is applicable
	 * @param interestMap The interest master data
	 * @return interest calculated
	 */
	private BigDecimal calculateInterest(long numberOfYears,BigDecimal applicableAmount,Map<String, Object> interestMap){
		BigDecimal interestAmt;
		BigDecimal noOfDays = BigDecimal.valueOf(numberOfYears);
		if(BigDecimal.ONE.compareTo(noOfDays) <= 0) noOfDays = noOfDays.add(BigDecimal.ONE);
		interestAmt = mDService.calculateApplicables(applicableAmount, interestMap);
		return interestAmt.multiply(noOfDays.divide(BigDecimal.valueOf(365), 6, 5));
	}




}