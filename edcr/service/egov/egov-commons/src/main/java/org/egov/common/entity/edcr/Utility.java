/*
 * eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) <2019>  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *      Further, all user interfaces, including but not limited to citizen facing interfaces,
 *         Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *         derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *      For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *      For any further queries on attribution, including queries on brand guidelines,
 *         please contact contact@egovernments.org
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.common.entity.edcr;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Utility extends Measurement {
    private static final long serialVersionUID = 16L;
    private List<WasteDisposal> wasteDisposalUnits = new ArrayList<>();
    private List<WasteWaterRecyclePlant> wasteWaterRecyclePlant = new ArrayList<>();
    private List<LiquidWasteTreatementPlant> liquidWasteTreatementPlant = new ArrayList<>();
    private List<WellUtility> wells = new ArrayList<>();
    private List<RoadOutput> wellDistance = new ArrayList<>();
    private List<RainWaterHarvesting> rainWaterHarvest = new ArrayList<>();
    private List<Solar> solar = new ArrayList<>();
    private BigDecimal rainWaterHarvestingTankCapacity;
    private List<BiometricWasteTreatment> biometricWasteTreatment = new ArrayList<>();
    private List<SolidLiqdWasteTrtmnt> solidLiqdWasteTrtmnt = new ArrayList<>();
    private List<Measurement> solarWaterHeatingSystems = new ArrayList<>();
    private List<Measurement> segregationOfWaste = new ArrayList<>();
    private BigDecimal waterTankCapacity;
    private SupplyLine supplyLine;

    public void setBiometricWasteTreatment(List<BiometricWasteTreatment> biometricWasteTreatment) {
        this.biometricWasteTreatment = biometricWasteTreatment;
    }

    public List<BiometricWasteTreatment> getBiometricWasteTreatment() {

        return biometricWasteTreatment;
    }

    public void addBiometricWasteTreatment(BiometricWasteTreatment biometricWasteTrtmnt) {
        biometricWasteTreatment.add(biometricWasteTrtmnt);
    }

    public BigDecimal getRainWaterHarvestingTankCapacity() {
        return rainWaterHarvestingTankCapacity;
    }

    public void setRainWaterHarvestingTankCapacity(BigDecimal rainWaterHarvestingTankCapacity) {
        this.rainWaterHarvestingTankCapacity = rainWaterHarvestingTankCapacity;
    }

    public List<WasteDisposal> getWasteDisposalUnits() {
        return wasteDisposalUnits;
    }

    public List<LiquidWasteTreatementPlant> getLiquidWasteTreatementPlant() {
        return liquidWasteTreatementPlant;
    }

    public void addLiquidWasteTreatementPlant(LiquidWasteTreatementPlant lqWastTrtPlant) {
        liquidWasteTreatementPlant.add(lqWastTrtPlant);

    }

    public void addWasteDisposal(WasteDisposal wasteDisposal) {
        wasteDisposalUnits.add(wasteDisposal);
    }

    public void addWasteWaterRecyclePlant(WasteWaterRecyclePlant waterRecyclePlant) {
        wasteWaterRecyclePlant.add(waterRecyclePlant);

    }

    public List<WasteWaterRecyclePlant> getWasteWaterRecyclePlant() {
        return wasteWaterRecyclePlant;
    }

    public void addWells(WellUtility wellUtility) {
        wells.add(wellUtility);

    }

    public List<WellUtility> getWells() {
        return wells;
    }

    public List<RoadOutput> getWellDistance() {
        return wellDistance;
    }

    public void setWellDistance(List<RoadOutput> wellDistance) {
        this.wellDistance = wellDistance;
    }

    public void addSolar(Solar solarsystem) {
        solar.add(solarsystem);

    }

    public List<Solar> getSolar() {
        return solar;
    }

    public List<RainWaterHarvesting> getRainWaterHarvest() {
        return rainWaterHarvest;
    }

    public void addRainWaterHarvest(RainWaterHarvesting rwh) {
        rainWaterHarvest.add(rwh);

    }

    public List<SolidLiqdWasteTrtmnt> getSolidLiqdWasteTrtmnt() {
        return solidLiqdWasteTrtmnt;
    }

    public void addSolidLiqdWasteTrtmnt(SolidLiqdWasteTrtmnt solidLiqdWasteTrtmnt) {
        this.solidLiqdWasteTrtmnt.add(solidLiqdWasteTrtmnt);
    }

    public List<Measurement> getSolarWaterHeatingSystems() {
        return solarWaterHeatingSystems;
    }

    public void setSolarWaterHeatingSystems(List<Measurement> solarWaterHeatingSystems) {
        this.solarWaterHeatingSystems = solarWaterHeatingSystems;
    }

    public void setWasteDisposalUnits(List<WasteDisposal> wasteDisposalUnits) {
        this.wasteDisposalUnits = wasteDisposalUnits;
    }

    public void setWasteWaterRecyclePlant(List<WasteWaterRecyclePlant> wasteWaterRecyclePlant) {
        this.wasteWaterRecyclePlant = wasteWaterRecyclePlant;
    }

    public void setLiquidWasteTreatementPlant(List<LiquidWasteTreatementPlant> liquidWasteTreatementPlant) {
        this.liquidWasteTreatementPlant = liquidWasteTreatementPlant;
    }

    public void setWells(List<WellUtility> wells) {
        this.wells = wells;
    }

    public void setRainWaterHarvest(List<RainWaterHarvesting> rainWaterHarvest) {
        this.rainWaterHarvest = rainWaterHarvest;
    }

    public void setSolar(List<Solar> solar) {
        this.solar = solar;
    }

    public void setSolidLiqdWasteTrtmnt(List<SolidLiqdWasteTrtmnt> solidLiqdWasteTrtmnt) {
        this.solidLiqdWasteTrtmnt = solidLiqdWasteTrtmnt;
    }

    public List<Measurement> getSegregationOfWaste() {
        return segregationOfWaste;
    }

    public void setSegregationOfWaste(List<Measurement> segregationOfWaste) {
        this.segregationOfWaste = segregationOfWaste;
    }

    public BigDecimal getWaterTankCapacity() {
        return waterTankCapacity;
    }

    public void setWaterTankCapacity(BigDecimal waterTankCapacity) {
        this.waterTankCapacity = waterTankCapacity;
    }

    public SupplyLine getSupplyLine() {
        return supplyLine;
    }

    public void setSupplyLine(SupplyLine supplyLine) {
        this.supplyLine = supplyLine;
    }

}
