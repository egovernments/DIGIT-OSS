package org.egov.land.calcutaor;

import java.io.FileNotFoundException;
import java.io.IOException;

import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Calculator implements CalculatorFees {

	// @Autowired static UpdateJson updateJosn;

	public static float areaInSqmtr(float arce) {
		return (AREA * arce);
	}

	public static FeesTypeCalculationDto feesTypeCalculation(float arce, String feeType, String potenialZone,
			String purposepurposename, String colonyType) throws FileNotFoundException, IOException, ParseException {

		UpdateJson updateJosn = new UpdateJson();

		FeesType feesType = updateJosn.readPurposeJson(feeType, potenialZone, purposepurposename, colonyType);
		System.out.println("far value size : " + feesType.getFarValue().size());
		FeesTypeCalculationDto feesTypeCalculationDto = new FeesTypeCalculationDto();
		feesTypeCalculationDto.setFarValue(feesType.getFarValue());

	
		float area1 = (PERCENTAGE1 * arce);
		float area2 = PERCENTAGE2 * arce;

		/* main form fee */
		switch (feeType) {
		/* scruitny fee start */
		case "scrutinyFeeCharges": {
			switch (potenialZone) {
			/* potenialZone fee start */
			case "Hyper": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setScrutinyFeeChargesCal((areaInSqmtr(arce) * PERCENTAGE1 * 10
							+ areaInSqmtr(arce) * PERCENTAGE2 * feesType.getScrutinyFeeCharges() * 10));
					;
					break;
				case "ddjay":
					feesTypeCalculationDto.setScrutinyFeeChargesCal((PERCENTAGE1 * 10 * areaInSqmtr(arce)
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "itColony":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((PERCENTAGE1 * areaInSqmtr(arce) * 2.5f * 10
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 0.1f));

					break;
				case "groupHousing":

					feesTypeCalculationDto
							.setScrutinyFeeChargesCal((areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 1 * 10));

					break;
				case "commPlotted":

					feesTypeCalculationDto
							.setScrutinyFeeChargesCal((areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "todCommercial":

					feesTypeCalculationDto.setScrutinyFeeChargesCal(
							(float) (1 * areaInSqmtr(arce) * 10 * feesType.getScrutinyFeeCharges()));

					break;
				case "todGroupHousing":

					feesTypeCalculationDto.setScrutinyFeeChargesCal(
							(float) (1 * areaInSqmtr(arce) * 10 * feesType.getScrutinyFeeCharges()));

					break;
				case "nilp":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((float) (PERCENTAGE1 * areaInSqmtr(arce) * 1.25 * 10
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setScrutinyFeeChargesCal(
							(float) (PART1 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10
									+ PART2 * AREA * 1.75 * 10 + PART3 * AREA * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((float) ((float) 2
							* (PERCENTAGE1 * areaInSqmtr(arce) * 10 + PERCENTAGE2 * areaInSqmtr(arce) * 1.75 * 10)));

					break;
				/* colonyType fee end */

				}
				break;

				/* potenialZone fee end */
			}

			case "High I": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setScrutinyFeeChargesCal(areaInSqmtr(arce) * PERCENTAGE1 * 10
							+ areaInSqmtr(arce) * PERCENTAGE2 * feesType.getScrutinyFeeCharges() * 10);
					break;
				case "ddjay":
					feesTypeCalculationDto.setScrutinyFeeChargesCal(PERCENTAGE1 * 10 * areaInSqmtr(arce)
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10);
					break;
				case "itColony":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((PERCENTAGE1 * areaInSqmtr(arce) * 2.5f * 10
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 0.1f));

					break;
				case "groupHousing":

					feesTypeCalculationDto
							.setScrutinyFeeChargesCal((areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 1 * 10));

					break;
				case "commPlotted":

					feesTypeCalculationDto
							.setScrutinyFeeChargesCal((areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "todCommercial":

					feesTypeCalculationDto.setScrutinyFeeChargesCal(
							(float) (1 * areaInSqmtr(arce) * 10 * feesType.getScrutinyFeeCharges()));

					break;
				case "nilp":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((float) (PERCENTAGE1 * areaInSqmtr(arce) * 1.25 * 10
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setScrutinyFeeChargesCal(
							(float) (PART1 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10
									+ PART2 * AREA * 1.75 * 10 + PART3 * AREA * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((float) ((float) 2
							* (PERCENTAGE1 * areaInSqmtr(arce) * 10 + PERCENTAGE2 * areaInSqmtr(arce) * 1.75 * 10)));

					break;
				/* colonyType fee end */
				}

				break;
			}
			case "High II": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setScrutinyFeeChargesCal(areaInSqmtr(arce) * PERCENTAGE1 * 10
							+ areaInSqmtr(arce) * PERCENTAGE2 * feesType.getScrutinyFeeCharges() * 10);
					break;
				case "ddjay":
					feesTypeCalculationDto.setScrutinyFeeChargesCal(PERCENTAGE1 * 10 * areaInSqmtr(arce)
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10);
					break;
				case "itColony":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((PERCENTAGE1 * areaInSqmtr(arce) * 2.5f * 10
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 0.1f));

					break;
				case "groupHousing":

					feesTypeCalculationDto
							.setScrutinyFeeChargesCal((areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 1 * 10));

					break;
				case "commPlotted":

					feesTypeCalculationDto
							.setScrutinyFeeChargesCal((areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "todCommercial":

					feesTypeCalculationDto.setScrutinyFeeChargesCal(
							(float) (1 * areaInSqmtr(arce) * 10 * feesType.getScrutinyFeeCharges()));

					break;
				case "nilp":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((float) (PERCENTAGE1 * areaInSqmtr(arce) * 1.25 * 10
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setScrutinyFeeChargesCal(
							(float) (PART1 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10
									+ PART2 * AREA * 1.75 * 10 + PART3 * AREA * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((float) ((float) 2
							* (PERCENTAGE1 * areaInSqmtr(arce) * 10 + PERCENTAGE2 * areaInSqmtr(arce) * 1.75 * 10)));

					break;
				/* colonyType fee end */
				}

				break;
			}
			case "Medium": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setScrutinyFeeChargesCal(areaInSqmtr(arce) * PERCENTAGE1 * 10
							+ areaInSqmtr(arce) * PERCENTAGE2 * feesType.getScrutinyFeeCharges() * 10);

					break;
				case "ddjay":
					feesTypeCalculationDto.setScrutinyFeeChargesCal(PERCENTAGE1 * 10 * areaInSqmtr(arce)
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10);
					break;
				case "itColony":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((PERCENTAGE1 * areaInSqmtr(arce) * 2.5f * 10
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 0.1f));

					break;
				case "groupHousing":

					feesTypeCalculationDto
							.setScrutinyFeeChargesCal((areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 1 * 10));

					break;
				case "commPlotted":

					feesTypeCalculationDto
							.setScrutinyFeeChargesCal((areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "todCommercial":

					feesTypeCalculationDto.setScrutinyFeeChargesCal(
							(float) (1 * areaInSqmtr(arce) * 10 * feesType.getScrutinyFeeCharges()));

					break;
				case "nilp":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((float) (PERCENTAGE1 * areaInSqmtr(arce) * 1.25 * 10
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setScrutinyFeeChargesCal(
							(float) (PART1 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10
									+ PART2 * AREA * 1.75 * 10 + PART3 * AREA * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((float) ((float) 2
							* (PERCENTAGE1 * areaInSqmtr(arce) * 10 + PERCENTAGE2 * areaInSqmtr(arce) * 1.75 * 10)));

					break;
				/* colonyType fee end */
				}

				break;
			}
			case "Low I": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setScrutinyFeeChargesCal(areaInSqmtr(arce) * PERCENTAGE1 * 10
							+ areaInSqmtr(arce) * PERCENTAGE2 * feesType.getScrutinyFeeCharges() * 10);
					break;
				case "ddjay":
					feesTypeCalculationDto.setScrutinyFeeChargesCal(PERCENTAGE1 * 10 * areaInSqmtr(arce)
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10);
					break;
				case "itColony":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((PERCENTAGE1 * areaInSqmtr(arce) * 2.5f * 10
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 0.1f));

					break;
				case "groupHousing":

					feesTypeCalculationDto
							.setScrutinyFeeChargesCal((areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 1 * 10));

					break;
				case "commPlotted":

					feesTypeCalculationDto
							.setScrutinyFeeChargesCal((areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "todCommercial":

					feesTypeCalculationDto.setScrutinyFeeChargesCal(
							(float) (1 * areaInSqmtr(arce) * 10 * feesType.getScrutinyFeeCharges()));

					break;
				case "nilp":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((float) (PERCENTAGE1 * areaInSqmtr(arce) * 1.25 * 10
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setScrutinyFeeChargesCal(
							(float) (PART1 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10
									+ PART2 * AREA * 1.75 * 10 + PART3 * AREA * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((float) ((float) 2
							* (PERCENTAGE1 * areaInSqmtr(arce) * 10 + PERCENTAGE2 * areaInSqmtr(arce) * 1.75 * 10)));

					break;
				/* colonyType fee end */
				}

				break;
			}
			case "Low II": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setScrutinyFeeChargesCal(areaInSqmtr(arce) * PERCENTAGE1 * 10
							+ areaInSqmtr(arce) * PERCENTAGE2 * feesType.getScrutinyFeeCharges() * 10);
					break;
				case "ddjay":
					feesTypeCalculationDto.setScrutinyFeeChargesCal(PERCENTAGE1 * 10 * areaInSqmtr(arce)
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10);
					break;
				case "itColony":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((PERCENTAGE1 * areaInSqmtr(arce) * 2.5f * 10
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 0.1f));

					break;
				case "groupHousing":

					feesTypeCalculationDto
							.setScrutinyFeeChargesCal((areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 1 * 10));

					break;
				case "commPlotted":

					feesTypeCalculationDto
							.setScrutinyFeeChargesCal((areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "todCommercial":

					feesTypeCalculationDto.setScrutinyFeeChargesCal(
							(float) (1 * areaInSqmtr(arce) * 10 * feesType.getScrutinyFeeCharges()));

					break;
				case "nilp":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((float) (PERCENTAGE1 * areaInSqmtr(arce) * 1.25 * 10
							+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setScrutinyFeeChargesCal(
							(float) (PART1 * areaInSqmtr(arce) * feesType.getScrutinyFeeCharges() * 10
									+ PART2 * AREA * 1.75 * 10 + PART3 * AREA * feesType.getScrutinyFeeCharges() * 10));

					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setScrutinyFeeChargesCal((float) ((float) 2
							* (PERCENTAGE1 * areaInSqmtr(arce) * 10 + PERCENTAGE2 * areaInSqmtr(arce) * 1.75 * 10)));

					break;
				/* colonyType fee end */
				}

				break;
			}

			}

		}
		/* scruitny fee end */

		/* license fee start */

		case "licenseFeeCharges": {
			switch (potenialZone) {
			/* potenialZone fee start */
			case "Hyper": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":

					feesTypeCalculationDto.setLicenseFeeChargesCal((area1 * RATE) + (area2 * RATE1));
					break;
				case "ddjay":
					feesTypeCalculationDto.setLicenseFeeChargesCal((area1 * RATE) + (area2 * RATE1));
					break;
				case "itColony":

					feesTypeCalculationDto.setLicenseFeeChargesCal(area1 * 250000 + area2 * 27000000);

					break;
				case "groupHousing":

					feesTypeCalculationDto.setLicenseFeeChargesCal((float) (0.995 * 4000000 + 0.005 * 27000000));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setLicenseFeeChargesCal(27000000);

					break;
				case "todCommercial":

					feesTypeCalculationDto
							.setLicenseFeeChargesCal((float) (34000000 * feesType.getLicenseFeeCharges() / 1.75));

					break;
				case "todGroupHousing":

					feesTypeCalculationDto
							.setLicenseFeeChargesCal((float) (4000000 * 0.995 * feesType.getLicenseFeeCharges() / 1.75
									+ 34000000 * 0.005 * feesType.getLicenseFeeCharges() / 1.75));

					break;
				case "nilp":

					feesTypeCalculationDto.setLicenseFeeChargesCal((area1 * 4000000 * 5 / 7 + area2 * 34000000));

					break;
				case "industrialColony":

					feesTypeCalculationDto
							.setLicenseFeeChargesCal((float) (PART1 * 250000 + PART2 * 4000000 + PART3 * 27000000));

					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setLicenseFeeChargesCal((float) 2 * (area1 * 1250000 + area2 * 34000000));

					break;

				/* colonyType fee end */
				}

				break;
				/* potenialZone fee end */
			}

			case "High I": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setLicenseFeeChargesCal((area1 * 950000) + (area2 * 27000000));
					break;
				case "ddjay":
					feesTypeCalculationDto.setLicenseFeeChargesCal(area1 * 950000 * feesType.getLicenseFeeCharges()
							+ area2 * 27000000 * feesType.getLicenseFeeCharges());

					break;
				case "itColony":

					feesTypeCalculationDto.setLicenseFeeChargesCal(area1 * 125000 + area2 * 23500000);

					break;
				case "groupHousing":

					feesTypeCalculationDto.setLicenseFeeChargesCal((float) (0.995 * 1900000 + 0.005 * 23500000));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setLicenseFeeChargesCal(23500000);

					break;
				case "nilp":

					feesTypeCalculationDto.setLicenseFeeChargesCal((area1 * 1900000 * 5 / 7 + area2 * 27000000));

					break;
				case "industrialColony":

					feesTypeCalculationDto
							.setLicenseFeeChargesCal((float) (PART1 * 125000 + PART2 * 1900000 + PART3 * 23500000));

					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setLicenseFeeChargesCal((float) 2 * (area1 * 950000 + area2 * 27000000));

					break;

				/* colonyType fee end */
				}

				break;
			}
			case "High II": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":

					feesTypeCalculationDto.setLicenseFeeChargesCal((area1 * 950000) + (area2 * 21000000));
					break;
				case "ddjay":
					feesTypeCalculationDto.setLicenseFeeChargesCal(area1 * 950000 * feesType.getLicenseFeeCharges()
							+ area2 * 27000000 * feesType.getLicenseFeeCharges());
					break;
				case "itColony":

					feesTypeCalculationDto.setLicenseFeeChargesCal(area1 * 125000 + area2 * 14000000);

					break;

				case "groupHousing":

					feesTypeCalculationDto.setLicenseFeeChargesCal((float) (0.995 * 1900000 + 0.005 * 14000000));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setLicenseFeeChargesCal(14000000);

					break;
				case "nilp":

					feesTypeCalculationDto.setLicenseFeeChargesCal((area1 * 1900000 * 5 / 7 + area2 * 27000000));

					break;
				case "industrialColony":

					feesTypeCalculationDto
							.setLicenseFeeChargesCal((float) (PART1 * 125000 + PART2 * 1900000 + PART3 * 14000000));

					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setLicenseFeeChargesCal((float) 2 * (area1 * 950000 + area2 * 21000000));

					break;

				/* colonyType fee end */
				}

				break;
			}
			case "Medium": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setLicenseFeeChargesCal((area1 * 625000) + (area2 * 9500000));
					break;
				case "ddjay":
					feesTypeCalculationDto.setLicenseFeeChargesCal(10000);
					break;
				case "itColony":

					feesTypeCalculationDto.setLicenseFeeChargesCal(area1 * 62500 + area2 * 6250000);

					break;

				case "groupHousing":

					feesTypeCalculationDto.setLicenseFeeChargesCal((float) (0.995 * 950000 + 0.005 * 6250000));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setLicenseFeeChargesCal(6250000);

					break;
				case "nilp":

					feesTypeCalculationDto.setLicenseFeeChargesCal((area1 * 950000 * 5 / 7 + area2 * 9500000));

					break;
				case "industrialColony":

					feesTypeCalculationDto
							.setLicenseFeeChargesCal((float) (PART1 * 62500 + PART2 * 950000 + PART3 * 6250000));

					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setLicenseFeeChargesCal((float) 2 * (area1 * 625000 + area2 * 9500000));

					break;

				/* colonyType fee end */
				}

				break;
			}
			case "Low I": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setLicenseFeeChargesCal((area1 * 125000) + (area2 * 1900000));
					break;
				case "ddjay":
					feesTypeCalculationDto.setLicenseFeeChargesCal(10000);
					break;
				case "itColony":

					feesTypeCalculationDto.setLicenseFeeChargesCal(area1 * 12500 + area2 * 1250000);

					break;
				case "groupHousing":

					feesTypeCalculationDto.setLicenseFeeChargesCal((float) (0.995 * 250000 + 0.005 * 1250000));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setLicenseFeeChargesCal(1250000);

					break;
				case "nilp":

					feesTypeCalculationDto.setLicenseFeeChargesCal((area1 * 250000 * 5 / 7 + area2 * 1900000));

					break;
				case "industrialColony":

					feesTypeCalculationDto
							.setLicenseFeeChargesCal((float) (PART1 * 12500 + PART2 * 250000 + PART3 * 1250000));

					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setLicenseFeeChargesCal((float) 2 * (area1 * 125000 + area2 * 1900000));

					break;
				/* colonyType fee end */
				}

				break;
			}
			case "Low II": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setLicenseFeeChargesCal((area1 * 125000) + (area2 * 1900000));
					break;
				case "ddjay":
					feesTypeCalculationDto.setLicenseFeeChargesCal(10000);
					break;
				case "itColony":

					feesTypeCalculationDto.setLicenseFeeChargesCal(area1 * 12500 + area2 * 1250000);

					break;
				case "groupHousing":

					feesTypeCalculationDto.setLicenseFeeChargesCal((float) (0.995 * 250000 + 0.005 * 1250000));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setLicenseFeeChargesCal(1250000);

					break;
				case "nilp":

					feesTypeCalculationDto.setLicenseFeeChargesCal((area1 * 250000 * 5 / 7 + area2 * 1900000));

					break;
				case "industrialColony":

					feesTypeCalculationDto
							.setLicenseFeeChargesCal((float) (PART1 * 12500 + PART2 * 250000 + PART3 * 1250000));

					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setLicenseFeeChargesCal((float) 2 * (area1 * 125000 + area2 * 1900000));

					break;
				/* colonyType fee end */
				}

				break;
			}

			}

			/* license fee end */
		}
		/* externalDevelopmentCharges fee start */

		case "externalDevelopmentCharges": {
			switch (potenialZone) {
			/* potenialZone fee start */
			case "Hyper": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) ((area1 * 104.096 * 100000) + (area2 * 486.13 * 100000)));

					break;
				case "ddjay":
					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (area1 * 104.096 * 100000 + area2 * 486.13 * 100000));

					break;
				case "itColony":

					feesTypeCalculationDto
							.setExternalDevelopmentChargesCal(area1 * 347.682f * 100000 + area2 * 416.385f * 100000);

					break;
				case "groupHousing":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (0.995 * 312.289 * 100000 + PERCENTAGE2 * 416.385 * 100000));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal((float) (arce * 416.385 * 100000));

					break;
				case "todCommercial":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							((float) (arce * 486.13 * 100000 * feesType.getExternalDevelopmentCharges() / 1.75)));

					break;
				case "todGroupHousing":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (0.995 * arce * 416.385 * 100000 * feesType.getLicenseFeeCharges() / 1.75
									+ 0.005 * arce * 486.13 * 100000 * feesType.getLicenseFeeCharges() / 1.75));

					break;
				case "nilp":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (PERCENTAGE1 * 312.289 * 100000 * 5 / 7 + PERCENTAGE2 * 486.13 * 100000));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (PART1 * 208.192 * 100000 + PART2 * 416.385 * 100000 + PART3 * 416.385 * 100000));

					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (0.1 * (area1 * 104.096 * 100000 + area2 * 486.13 * 100000)));

					break;

				/* colonyType fee end */
				}

				break;
				/* potenialZone fee end */
			}

			case "High I": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (area1 * 93.687 * 100000 + PERCENTAGE2 * 437.517 * 100000));

					break;
				case "ddjay":
					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) ((area1 * 93.687 * 100000 + area2 * 437.517 * 100000)
									* feesType.getExternalDevelopmentCharges()));

					break;
				case "itColony":

					feesTypeCalculationDto
							.setExternalDevelopmentChargesCal(area1 * 312.914f * 100000 + area2 * 374.747f * 100000);

					break;
				case "groupHousing":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (0.995 * 281.06 * 100000 + PERCENTAGE2 * 374.747 * 100000));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal((float) (arce * 374.747 * 100000));

					break;
				case "nilp":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (PERCENTAGE1 * 281.06 * 100000 * 5 / 7 + PERCENTAGE2 * 437.517 * 100000));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (PART1 * 187.374 * 100000 + PART2 * 374.747 * 100000 + PART3 * 374.747 * 100000));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (0.1 * (area1 * 93.687 * 100000 + PERCENTAGE2 * 437.517 * 100000)));

					break;
				/* colonyType fee end */
				}

				break;
			}
			case "High II": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (area1 * 72.867 * 100000 + PERCENTAGE2 * 340.291 * 100000));
					break;
				case "ddjay":
					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) ((area1 * 72.867 * 100000 + area2 * 340.291 * 100000)
									* feesType.getExternalDevelopmentCharges()));

					break;
				case "itColony":

					feesTypeCalculationDto
							.setExternalDevelopmentChargesCal(area1 * 243.377f * 100000 + area2 * 291.47f * 100000);

					break;
				case "groupHousing":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (0.995 * 187.373 * 100000 + PERCENTAGE2 * 249.831 * 100000));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal((float) (arce * 291.47 * 100000));

					break;
				case "nilp":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (PERCENTAGE1 * 218.602 * 100000 * 5 / 7 + PERCENTAGE2 * 340.291 * 100000));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (PART1 * 145.734 * 100000 + PART2 * 291.47 * 100000 + PART3 * 291.47 * 100000));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (0.1 * (area1 * 72.867 * 100000 + PERCENTAGE2 * 340.291 * 100000)));

					break;

				/* colonyType fee end */
				}

				break;
			}
			case "Medium": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (area1 * 62.458 * 100000 + PERCENTAGE2 * 291.678 * 100000));
					break;
				case "ddjay":
					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) ((area1 * 62.458 * 100000 + area2 * 291.678 * 100000) * 0.5));

					break;
				case "itColony":

					feesTypeCalculationDto
							.setExternalDevelopmentChargesCal(area1 * 208.069f * 100000 + area2 * 249.833f * 100000);

					break;
				case "groupHousing":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (0.995 * 187.373 * 100000 + PERCENTAGE2 * 249.831 * 100000));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal((float) (arce * 249.831 * 100000));

					break;
				case "nilp":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (PERCENTAGE1 * 187.373 * 100000 * 5 / 7 + PERCENTAGE2 * 291.678 * 100000));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (PART1 * 124.916 * 100000 + PART2 * 249.831 * 100000 + PART3 * 249.831 * 100000));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (0.1 * (area1 * 62.458 * 100000 + PERCENTAGE2 * 291.678 * 100000)));
					break;

				/* colonyType fee end */
				}

				break;
			}
			case "Low I": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (area1 * 52.048 * 100000 + PERCENTAGE2 * 243.065f * 100000));

					break;
				case "ddjay":
					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) ((area1 * 52.048 * 100000 + area2 * 243.065 * 100000) * 0.25));

					break;
				case "itColony":

					feesTypeCalculationDto
							.setExternalDevelopmentChargesCal(area1 * 173.841f * 100000 + area2 * 208.193f * 100000);

					break;
				case "groupHousing":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (0.995 * 156.145 * 100000 + PERCENTAGE2 * 208.193 * 100000));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal((float) (arce * 208.193 * 100000));

					break;
				case "nilp":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (PERCENTAGE1 * 156.145 * 100000 * 5 / 7 + PERCENTAGE2 * 243.065 * 100000));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (PART1 * 104.096 * 100000 + PART2 * 208.193 * 100000 + PART3 * 208.193 * 100000));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (0.1 * (area1 * 52.048 * 100000 + PERCENTAGE2 * 243.065 * 100000)));
					break;

				/* colonyType fee end */
				}

				break;
			}
			case "Low II": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (area1 * 41.639 * 100000 + PERCENTAGE2 * 194.452 * 100000));

					break;
				case "ddjay":
					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) ((area1 * 41.639 * 100000 + area2 * 194.452 * 100000) * 0.25));

					break;
				case "itColony":

					feesTypeCalculationDto
							.setExternalDevelopmentChargesCal(area1 * 139.073f * 100000 + area2 * 166.554f * 100000);

					break;
				case "groupHousing":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (0.995 * 124.916 * 100000 + PERCENTAGE2 * 166.554 * 100000));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal((float) (arce * 166.554 * 100000));

					break;
				case "nilp":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (PERCENTAGE1 * 124.916 * 100000 * 5 / 7 + PERCENTAGE2 * 194.452 * 100000));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (PART1 * 83.278 * 100000 + PART2 * 166.554 * 100000 + PART3 * 166.554 * 100000));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setExternalDevelopmentChargesCal(
							(float) (0.1 * (area1 * 41.639 * 100000 + PERCENTAGE2 * 194.452 * 100000)));
					break;
				/* colonyType fee end */
				}

				break;
			}

			}

			/* externalDevelopmentCharges fee end */
		}
		/* conversionCharges fee start */

		case "conversionCharges": {
			switch (potenialZone) {
			/* potenialZone fee start */
			case "Hyper": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setConversionChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 158) + (PERCENTAGE2 * areaInSqmtr(arce) * 1470));

					break;
				case "ddjay":
					feesTypeCalculationDto.setConversionChargesCal(
							PERCENTAGE1 * areaInSqmtr(arce) * 158 + PERCENTAGE2 * areaInSqmtr(arce) * 1470);

					break;
				case "itColony":

					feesTypeCalculationDto.setConversionChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 100) + (PERCENTAGE2 * areaInSqmtr(arce) * 1260));

					break;
				case "groupHousing":

					feesTypeCalculationDto.setConversionChargesCal(
							(float) (0.995 * areaInSqmtr(arce) * 158 + 0.005 * areaInSqmtr(arce) * 1260));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setConversionChargesCal((float) (1 * areaInSqmtr(arce) * 1260));

					break;
				case "todCommercial":

					feesTypeCalculationDto.setConversionChargesCal(
							((float) (1470 * areaInSqmtr(arce) * feesType.getConversionCharges() / 1.75)));

					break;
				case "todGroupHousing":

					feesTypeCalculationDto.setConversionChargesCal(
							((float) (0.995 * 158 * areaInSqmtr(arce) * feesType.getConversionCharges() / 1.75
									+ 0.005 * 1470 * areaInSqmtr(arce) * feesType.getConversionCharges() / 1.75)));

					break;
				case "nilp":

					feesTypeCalculationDto
							.setConversionChargesCal((float) (PERCENTAGE1 * 158 * 5 / 7 * areaInSqmtr(arce)
									+ PERCENTAGE2 * areaInSqmtr(arce) * 1470));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setConversionChargesCal((float) (PART1 * areaInSqmtr(arce) * 100
							+ PART2 * areaInSqmtr(arce) * 158 + PART3 * areaInSqmtr(arce) * 1260));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setConversionChargesCal((float) (2
							* (PERCENTAGE1 * areaInSqmtr(arce) * 158 + PERCENTAGE2 * areaInSqmtr(arce) * 1470)));
					break;

				/* colonyType fee end */
				}

				break;
				/* potenialZone fee end */
			}

			case "High I": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setConversionChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 125) + (PERCENTAGE2 * areaInSqmtr(arce) * 1225));

					break;
				case "ddjay":
					feesTypeCalculationDto.setConversionChargesCal(
							PERCENTAGE1 * 125 * areaInSqmtr(arce) * feesType.getConversionCharges()
									+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getConversionCharges() * 1225);

					break;
				case "itColony":

					feesTypeCalculationDto.setConversionChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 80) + (PERCENTAGE2 * areaInSqmtr(arce) * 1050));

					break;
				case "groupHousing":

					feesTypeCalculationDto.setConversionChargesCal(
							(float) (0.995 * areaInSqmtr(arce) * 125 + 0.005 * areaInSqmtr(arce) * 1050));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setConversionChargesCal((float) (1 * areaInSqmtr(arce) * 1050));

					break;
				case "nilp":

					feesTypeCalculationDto
							.setConversionChargesCal((float) (PERCENTAGE1 * 125 * 5 / 7 * areaInSqmtr(arce)
									+ PERCENTAGE2 * areaInSqmtr(arce) * 1225));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setConversionChargesCal((float) (PART1 * areaInSqmtr(arce) * 80
							+ PART2 * areaInSqmtr(arce) * 125 + PART3 * areaInSqmtr(arce) * 1050));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setConversionChargesCal((float) (2
							* (PERCENTAGE1 * areaInSqmtr(arce) * 125 + PERCENTAGE2 * areaInSqmtr(arce) * 1225)));
					break;

				/* colonyType fee end */
				}

				break;
			}
			case "High II": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setConversionChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 125) + (PERCENTAGE2 * areaInSqmtr(arce) * 1225));
					break;
				case "ddjay":
					feesTypeCalculationDto.setConversionChargesCal(
							(PERCENTAGE1 * 125 * areaInSqmtr(arce) * feesType.getConversionCharges()
									+ PERCENTAGE2 * areaInSqmtr(arce) * feesType.getConversionCharges() * 1225));

					break;
				case "itColony":

					feesTypeCalculationDto.setConversionChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 80) + (PERCENTAGE2 * areaInSqmtr(arce) * 1050));

					break;
				case "groupHousing":

					feesTypeCalculationDto.setConversionChargesCal(
							(float) (0.995 * areaInSqmtr(arce) * 125 + 0.005 * areaInSqmtr(arce) * 1050));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setConversionChargesCal((float) (1 * areaInSqmtr(arce) * 1050));

					break;
				case "nilp":

					feesTypeCalculationDto
							.setConversionChargesCal((float) (PERCENTAGE1 * 125 * 5 / 7 * areaInSqmtr(arce)
									+ PERCENTAGE2 * areaInSqmtr(arce) * 1225));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setConversionChargesCal((float) (PART1 * areaInSqmtr(arce) * 80
							+ PART2 * areaInSqmtr(arce) * 125 + PART3 * areaInSqmtr(arce) * 1050));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setConversionChargesCal((float) (2
							* (PERCENTAGE1 * areaInSqmtr(arce) * 125 + PERCENTAGE2 * areaInSqmtr(arce) * 1225)));
					break;

				/* colonyType fee end */
				}

				break;
			}
			case "Medium": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setConversionChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 80) + (PERCENTAGE2 * areaInSqmtr(arce) * 700));

					break;
				case "ddjay":
					feesTypeCalculationDto.setConversionChargesCal(0);
					break;
				case "itColony":

					feesTypeCalculationDto.setConversionChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 50) + (PERCENTAGE2 * areaInSqmtr(arce) * 600));

					break;
				case "groupHousing":

					feesTypeCalculationDto.setConversionChargesCal(
							(float) (0.995 * areaInSqmtr(arce) * 80 + 0.005 * areaInSqmtr(arce) * 600));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setConversionChargesCal((float) (1 * areaInSqmtr(arce) * 600));

					break;
				case "nilp":

					feesTypeCalculationDto.setConversionChargesCal((float) (PERCENTAGE1 * 80 * 5 / 7 * areaInSqmtr(arce)
							+ PERCENTAGE2 * areaInSqmtr(arce) * 700));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setConversionChargesCal((float) (PART1 * areaInSqmtr(arce) * 50
							+ PART2 * areaInSqmtr(arce) * 80 + PART3 * areaInSqmtr(arce) * 600));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setConversionChargesCal((float) (2
							* (PERCENTAGE1 * areaInSqmtr(arce) * 80 + PERCENTAGE2 * areaInSqmtr(arce) * 700)));
					break;

				/* colonyType fee end */
				}

				break;
			}
			case "Low I": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setConversionChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 20) + (PERCENTAGE2 * areaInSqmtr(arce) * 175));

					break;
				case "ddjay":
					feesTypeCalculationDto.setConversionChargesCal(0);
					break;
				case "itColony":

					feesTypeCalculationDto.setConversionChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 30) + (PERCENTAGE2 * areaInSqmtr(arce) * 150));

					break;
				case "groupHousing":

					feesTypeCalculationDto.setConversionChargesCal(
							(float) (0.995 * areaInSqmtr(arce) * 20 + 0.005 * areaInSqmtr(arce) * 150));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setConversionChargesCal((float) (1 * areaInSqmtr(arce) * 150));

					break;
				case "nilp":

					feesTypeCalculationDto.setConversionChargesCal((float) (PERCENTAGE1 * 20 * 5 / 7 * areaInSqmtr(arce)
							+ PERCENTAGE2 * areaInSqmtr(arce) * 175));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setConversionChargesCal((float) (PART1 * areaInSqmtr(arce) * 30
							+ PART2 * areaInSqmtr(arce) * 20 + PART3 * areaInSqmtr(arce) * 150));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setConversionChargesCal((float) (2
							* (PERCENTAGE1 * areaInSqmtr(arce) * 20 + PERCENTAGE2 * areaInSqmtr(arce) * 175)));
					break;

				/* colonyType fee end */
				}

				break;
			}
			case "Low II": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setConversionChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 20) + (PERCENTAGE2 * areaInSqmtr(arce) * 175));
					break;
				case "ddjay":
					feesTypeCalculationDto.setConversionChargesCal(0);
					break;
				case "itColony":

					feesTypeCalculationDto.setConversionChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 30) + (PERCENTAGE2 * areaInSqmtr(arce) * 150));

					break;
				case "groupHousing":

					feesTypeCalculationDto.setConversionChargesCal(
							(float) (0.995 * areaInSqmtr(arce) * 20 + 0.005 * areaInSqmtr(arce) * 150));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setConversionChargesCal((float) (1 * areaInSqmtr(arce) * 150));

					break;
				case "nilp":

					feesTypeCalculationDto.setConversionChargesCal((float) (PERCENTAGE1 * 20 * 5 / 7 * areaInSqmtr(arce)
							+ PERCENTAGE2 * areaInSqmtr(arce) * 175));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setConversionChargesCal((float) (PART1 * areaInSqmtr(arce) * 30
							+ PART2 * areaInSqmtr(arce) * 20 + PART3 * areaInSqmtr(arce) * 150));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setConversionChargesCal((float) (2
							* (PERCENTAGE1 * areaInSqmtr(arce) * 20 + PERCENTAGE2 * areaInSqmtr(arce) * 175)));
					break;
				/* colonyType fee end */
				}

				break;
			}

			}

			/* conversionCharges fee end */
		}

		/* stateInfrastructureDevelopmentCharges fee start */

		case "stateInfrastructureDevelopmentCharges": {

			switch (potenialZone) {
			/* potenialZone fee start */

			case "Hyper": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 500) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 1000));

					break;
				case "ddjay":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * 500 * areaInSqmtr(arce) + PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 1000));
					break;
				case "itColony":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 250 * 2.5f) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 150 * 10));

					break;
				case "groupHousing":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(float) (0.995 * areaInSqmtr(arce) * 625 * 1.75 + 0.005 * areaInSqmtr(arce) * 1000
									* feesType.getStateInfrastructureDevelopmentCharges()));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (1 * areaInSqmtr(arce)
							* 1000 * feesType.getStateInfrastructureDevelopmentCharges()));

					break;
				case "todCommercial":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							((float) (1000 * areaInSqmtr(arce) * feesType.getStateInfrastructureDevelopmentCharges())));

					break;
				case "todGroupHousing":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(((float) (0.995 * 625
							* areaInSqmtr(arce) * feesType.getStateInfrastructureDevelopmentCharges()
							+ 0.005 * 1000 * areaInSqmtr(arce) * feesType.getStateInfrastructureDevelopmentCharges())));

					break;
				case "nilp":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (PERCENTAGE1 * 625
							* areaInSqmtr(arce) * feesType.getStateInfrastructureDevelopmentCharges() * 5 / 7
							+ feesType.getStateInfrastructureDevelopmentCharges() * PERCENTAGE2 * areaInSqmtr(arce)
									* 1000));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (PART1
							* areaInSqmtr(arce) * 250 * feesType.getStateInfrastructureDevelopmentCharges()
							+ PART2 * areaInSqmtr(arce) * 625 * 1.75
							+ PART3 * areaInSqmtr(arce) * 1000 * feesType.getStateInfrastructureDevelopmentCharges()));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 500) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 1000));
					break; 
				/* colonyType fee end */
				}

				break;
				/* potenialZone fee end */
			}

			case "High I": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 375) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 750));

					break;
				case "ddjay":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(float) (PERCENTAGE1 * 375 * areaInSqmtr(arce) * 0.75 + PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 750 * 0.75));

					break;
				case "itColony":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 190 * 2.5f) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 7.5f));

					break;
				case "groupHousing":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(float) (0.995 * areaInSqmtr(arce) * 460 * 1.75 + 0.005 * areaInSqmtr(arce) * 750
									* feesType.getStateInfrastructureDevelopmentCharges()));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (1 * areaInSqmtr(arce)
							* 750 * feesType.getStateInfrastructureDevelopmentCharges()));

					break;
				case "nilp":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (PERCENTAGE1 * 460
							* areaInSqmtr(arce) * feesType.getStateInfrastructureDevelopmentCharges() * 5 / 7
							+ feesType.getStateInfrastructureDevelopmentCharges() * PERCENTAGE2 * areaInSqmtr(arce)
									* 750));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (PART1
							* areaInSqmtr(arce) * 190 * feesType.getStateInfrastructureDevelopmentCharges()
							+ PART2 * areaInSqmtr(arce) * 460 * 1.75
							+ PART3 * areaInSqmtr(arce) * 750 * feesType.getStateInfrastructureDevelopmentCharges()));
					break;
				case "lowDensityEcoFriendly":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 375) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 750));
					break; 
				/* colonyType fee end */
				}

				break;
			}
			case "High II": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 375) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 750));
					break;
				case "ddjay":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(float) (PERCENTAGE1 * 375 * areaInSqmtr(arce) * 0.75 + PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 750 * 0.75));

					break;
				case "itColony":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 190 * 2.5f) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 7.5f));

					break;
				case "groupHousing":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(float) (0.995 * areaInSqmtr(arce) * 460 * 1.75 + 0.005 * areaInSqmtr(arce) * 750
									* feesType.getStateInfrastructureDevelopmentCharges()));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (1 * areaInSqmtr(arce)
							* 750 * feesType.getStateInfrastructureDevelopmentCharges()));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (PART1
							* areaInSqmtr(arce) * 190 * feesType.getStateInfrastructureDevelopmentCharges()
							+ PART2 * areaInSqmtr(arce) * 460 * 1.75
							+ PART3 * areaInSqmtr(arce) * 750 * feesType.getStateInfrastructureDevelopmentCharges()));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 375) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 750));
					break; 
				/* colonyType fee end */
				}

				break;
			}
			case "Medium": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 250) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 500));

					break;
				case "ddjay":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(0);
					break;
				case "itColony":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 125 * 2.5f) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 5));

					break;
				case "groupHousing":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(float) (0.995 * areaInSqmtr(arce) * 320 * 1.75 + 0.005 * areaInSqmtr(arce) * 500
									* feesType.getStateInfrastructureDevelopmentCharges()));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (1 * areaInSqmtr(arce)
							* 500 * feesType.getStateInfrastructureDevelopmentCharges()));

					break;
				case "nilp":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (PERCENTAGE1 * 320
							* areaInSqmtr(arce) * feesType.getStateInfrastructureDevelopmentCharges() * 5 / 7
							+ feesType.getStateInfrastructureDevelopmentCharges() * PERCENTAGE2 * areaInSqmtr(arce)
									* 500));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (PART1
							* areaInSqmtr(arce) * 125 * feesType.getStateInfrastructureDevelopmentCharges()
							+ PART2 * areaInSqmtr(arce) * 320 * 1.75
							+ PART3 * areaInSqmtr(arce) * 500 * feesType.getStateInfrastructureDevelopmentCharges()));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 250) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 500));

					break; 
				/* colonyType fee end */
				}

				break;
			}
			case "Low I": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 70) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 190));

					break;
				case "ddjay":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(0);
					break;
				case "itColony":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 35 * 2.5f) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 1.9f));

					break;
				case "groupHousing":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(float) (0.995 * areaInSqmtr(arce) * 90 * 1.75 + 0.005 * areaInSqmtr(arce) * 190
									* feesType.getStateInfrastructureDevelopmentCharges()));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (1 * areaInSqmtr(arce)
							* 190 * feesType.getStateInfrastructureDevelopmentCharges()));

					break;
				case "nilp":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (PERCENTAGE1 * 90
							* areaInSqmtr(arce) * feesType.getStateInfrastructureDevelopmentCharges() * 5 / 7
							+ feesType.getStateInfrastructureDevelopmentCharges() * PERCENTAGE2 * areaInSqmtr(arce)
									* 190));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (PART1
							* areaInSqmtr(arce) * 35 * feesType.getStateInfrastructureDevelopmentCharges()
							+ PART2 * areaInSqmtr(arce) * 90 * 1.75
							+ PART3 * areaInSqmtr(arce) * 190 * feesType.getStateInfrastructureDevelopmentCharges()));
					break;
				case "lowDensityEcoFriendly":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 70) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 190));
					break; 
				/* colonyType fee end */
				}

				break;
			}
			case "Low II": {

				switch (colonyType) {
				/* colonyType fee start */
				case "plotted":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 70) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 190));
					break;
				case "ddjay":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(0);
					break;
				case "itColony":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 35 * 2.5f) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 1.9f));

					break;
				case "groupHousing":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(float) (0.995 * areaInSqmtr(arce) * 90 * 1.75 + 0.005 * areaInSqmtr(arce) * 190
									* feesType.getStateInfrastructureDevelopmentCharges()));

					break;
				case "commPlotted":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (1 * areaInSqmtr(arce)
							* 190 * feesType.getStateInfrastructureDevelopmentCharges()));

					break;
				case "nilp":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (PERCENTAGE1 * 90
							* areaInSqmtr(arce) * feesType.getStateInfrastructureDevelopmentCharges() * 5 / 7
							+ feesType.getStateInfrastructureDevelopmentCharges() * PERCENTAGE2 * areaInSqmtr(arce)
									* 190));

					break;
				case "industrialColony":

					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal((float) (PART1
							* areaInSqmtr(arce) * 35 * feesType.getStateInfrastructureDevelopmentCharges()
							+ PART2 * areaInSqmtr(arce) * 90 * 1.75
							+ PART3 * areaInSqmtr(arce) * 190 * feesType.getStateInfrastructureDevelopmentCharges()));
					break;
				case "lowDensityEcoFriendly":
					feesTypeCalculationDto.setStateInfrastructureDevelopmentChargesCal(
							(PERCENTAGE1 * areaInSqmtr(arce) * 70) + (PERCENTAGE2 * areaInSqmtr(arce)
									* feesType.getStateInfrastructureDevelopmentCharges() * 190));
					break; 
				/* colonyType fee end */
				}

				break;
			}

			}

		}
		}

		return feesTypeCalculationDto;

	}
}