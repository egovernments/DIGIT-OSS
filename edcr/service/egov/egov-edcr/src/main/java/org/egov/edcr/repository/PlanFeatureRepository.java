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

package org.egov.edcr.repository;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.entity.edcr.PlanFeature;
import org.egov.edcr.feature.AccessoryBuildingService;
import org.egov.edcr.feature.AdditionalFeature;
import org.egov.edcr.feature.Balcony;
import org.egov.edcr.feature.Basement;
import org.egov.edcr.feature.BathRoom;
import org.egov.edcr.feature.BathRoomWaterClosets;
import org.egov.edcr.feature.BiometricWasteManagement;
import org.egov.edcr.feature.BlockDistancesService;
import org.egov.edcr.feature.BuildingHeight;
import org.egov.edcr.feature.Chimney;
import org.egov.edcr.feature.CommonFeature;
import org.egov.edcr.feature.CompoundWallService;
import org.egov.edcr.feature.ConstructedArea;
import org.egov.edcr.feature.Coverage;
import org.egov.edcr.feature.DepthCuttingService;
import org.egov.edcr.feature.DistanceToRoad;
import org.egov.edcr.feature.DrinageService;
import org.egov.edcr.feature.DxfToPdfConverter;
import org.egov.edcr.feature.ExitWidth;
import org.egov.edcr.feature.Far;
import org.egov.edcr.feature.FireStair;
import org.egov.edcr.feature.FireTenderMovement;
import org.egov.edcr.feature.FootpathService;
import org.egov.edcr.feature.GateService;
import org.egov.edcr.feature.GeneralStair;
import org.egov.edcr.feature.GlassFacadeOpening;
import org.egov.edcr.feature.GovtBuildingDistance;
import org.egov.edcr.feature.GuardRoom;
import org.egov.edcr.feature.HeadRoom;
import org.egov.edcr.feature.HeightOfRoom;
import org.egov.edcr.feature.InfoCommsTechService;
import org.egov.edcr.feature.InteriorOpenSpaceService;
import org.egov.edcr.feature.Kitchen;
import org.egov.edcr.feature.LandUse;
import org.egov.edcr.feature.LiftService;
import org.egov.edcr.feature.LocationPlan;
import org.egov.edcr.feature.MeanOfAccess;
import org.egov.edcr.feature.MezzanineFloorService;
import org.egov.edcr.feature.MonumentDistance;
import org.egov.edcr.feature.NorthDirection;
import org.egov.edcr.feature.OpenStairService;
import org.egov.edcr.feature.OverHangs;
import org.egov.edcr.feature.OverheadElectricalLineService;
import org.egov.edcr.feature.Parapet;
import org.egov.edcr.feature.Parking;
import org.egov.edcr.feature.PetrolFillingStation;
import org.egov.edcr.feature.PlanInfoFeature;
import org.egov.edcr.feature.Plantation;
import org.egov.edcr.feature.PlantationGreenStrip;
import org.egov.edcr.feature.PlotArea;
import org.egov.edcr.feature.PorticoService;
import org.egov.edcr.feature.RainWaterHarvesting;
import org.egov.edcr.feature.RampService;
import org.egov.edcr.feature.RecreationalSpace;
import org.egov.edcr.feature.RecycleWasteWater;
import org.egov.edcr.feature.RiverDistance;
import org.egov.edcr.feature.RoadReserve;
import org.egov.edcr.feature.RoadWidth;
import org.egov.edcr.feature.RoofTank;
import org.egov.edcr.feature.Sanitation;
import org.egov.edcr.feature.SegregatedToilet;
import org.egov.edcr.feature.SegregationOfWaste;
import org.egov.edcr.feature.SepticTank;
import org.egov.edcr.feature.SetBackService;
import org.egov.edcr.feature.Solar;
import org.egov.edcr.feature.SolarWaterHeating;
import org.egov.edcr.feature.SolidLiquidWasteTreatment;
import org.egov.edcr.feature.SpiralStair;
import org.egov.edcr.feature.StairCover;
import org.egov.edcr.feature.SupplyLineUtility;
import org.egov.edcr.feature.SurrenderRoad;
import org.egov.edcr.feature.TerraceUtilityService;
import org.egov.edcr.feature.TravelDistanceToExit;
import org.egov.edcr.feature.VehicleRamp;
import org.egov.edcr.feature.Ventilation;
import org.egov.edcr.feature.Verandah;
import org.egov.edcr.feature.WasteDisposal;
import org.egov.edcr.feature.WaterClosets;
import org.egov.edcr.feature.WaterTankCapacity;
import org.egov.edcr.feature.WaterTreatmentPlant;
import org.egov.edcr.feature.Well;
import org.springframework.stereotype.Service;

@Service
public class PlanFeatureRepository {

    public List<PlanFeature> getFeatures() {
        ArrayList<PlanFeature> features = new ArrayList<>();

        PlanFeature pf = new PlanFeature(PlanInfoFeature.class);
        features.add(pf);

        pf = new PlanFeature(Far.class);
        features.add(pf);

        pf = new PlanFeature(Coverage.class);
        features.add(pf);

        pf = new PlanFeature(RoadReserve.class);
        features.add(pf);
        
        pf = new PlanFeature(SetBackService.class);
        features.add(pf);

        pf = new PlanFeature(MezzanineFloorService.class);
        features.add(pf);

        pf = new PlanFeature(Parking.class);
        features.add(pf);

        pf = new PlanFeature(MonumentDistance.class);
        features.add(pf);

        pf = new PlanFeature(BlockDistancesService.class);
        features.add(pf);

        pf = new PlanFeature(GovtBuildingDistance.class);
        features.add(pf);

        pf = new PlanFeature(LandUse.class);
        features.add(pf);

        pf = new PlanFeature(RiverDistance.class);
        features.add(pf);

        pf = new PlanFeature(SepticTank.class);
        features.add(pf);

        pf = new PlanFeature(Plantation.class);
        features.add(pf);

        pf = new PlanFeature(GuardRoom.class);
        features.add(pf);

        pf = new PlanFeature(SpiralStair.class);
        features.add(pf);

        pf = new PlanFeature(FireStair.class);
        features.add(pf);

        pf = new PlanFeature(Balcony.class);
        features.add(pf);

        pf = new PlanFeature(PlantationGreenStrip.class);
        features.add(pf);

        pf = new PlanFeature(RoofTank.class);
        features.add(pf);

        pf = new PlanFeature(StairCover.class);
        features.add(pf);

        pf = new PlanFeature(Chimney.class);
        features.add(pf);

        pf = new PlanFeature(HeightOfRoom.class);
        features.add(pf);

        pf = new PlanFeature(Kitchen.class);
        features.add(pf);

        pf = new PlanFeature(BathRoom.class);
        features.add(pf);

        pf = new PlanFeature(BathRoomWaterClosets.class);
        features.add(pf);

        pf = new PlanFeature(WaterClosets.class);
        features.add(pf);

        pf = new PlanFeature(Parapet.class);
        features.add(pf);

        pf = new PlanFeature(LiftService.class);
        features.add(pf);

        pf = new PlanFeature(GeneralStair.class);
        features.add(pf);

        pf = new PlanFeature(RampService.class);
        features.add(pf);

        pf = new PlanFeature(CommonFeature.class);
        features.add(pf);

        pf = new PlanFeature(Basement.class);
        features.add(pf);

        pf = new PlanFeature(SolarWaterHeating.class);
        features.add(pf);

        pf = new PlanFeature(SegregationOfWaste.class);
        features.add(pf);

        pf = new PlanFeature(Solar.class);
        features.add(pf);

        pf = new PlanFeature(ExitWidth.class);
        features.add(pf);

        pf = new PlanFeature(SegregatedToilet.class);
        features.add(pf);

        pf = new PlanFeature(Sanitation.class);
        features.add(pf);

        pf = new PlanFeature(MeanOfAccess.class);
        features.add(pf);

        pf = new PlanFeature(BuildingHeight.class);
        features.add(pf);

        pf = new PlanFeature(DistanceToRoad.class);
        features.add(pf);

        pf = new PlanFeature(WasteDisposal.class);
        features.add(pf);

        pf = new PlanFeature(WaterTreatmentPlant.class);
        features.add(pf);

        pf = new PlanFeature(RecycleWasteWater.class);
        features.add(pf);

        pf = new PlanFeature(Well.class);
        features.add(pf);

        pf = new PlanFeature(BiometricWasteManagement.class);
        features.add(pf);

        pf = new PlanFeature(SolidLiquidWasteTreatment.class);
        features.add(pf);

        pf = new PlanFeature(OverheadElectricalLineService.class);
        features.add(pf);

        pf = new PlanFeature(RainWaterHarvesting.class);
        features.add(pf);

        pf = new PlanFeature(RecreationalSpace.class);
        features.add(pf);

        pf = new PlanFeature(TravelDistanceToExit.class);
        features.add(pf);

        pf = new PlanFeature(AdditionalFeature.class);
        features.add(pf);

        pf = new PlanFeature(FireTenderMovement.class);
        features.add(pf);

        pf = new PlanFeature(SurrenderRoad.class);
        features.add(pf);

        pf = new PlanFeature(WaterTankCapacity.class);
        features.add(pf);

        pf = new PlanFeature(NorthDirection.class);
        features.add(pf);

        pf = new PlanFeature(LocationPlan.class);
        features.add(pf);

        pf = new PlanFeature(HeadRoom.class);
        features.add(pf);

        pf = new PlanFeature(OverHangs.class);
        features.add(pf);

        pf = new PlanFeature(AccessoryBuildingService.class);
        features.add(pf);

        pf = new PlanFeature(DepthCuttingService.class);
        features.add(pf);

        pf = new PlanFeature(PetrolFillingStation.class);
        features.add(pf);

        pf = new PlanFeature(OpenStairService.class);
        features.add(pf);

        pf = new PlanFeature(Ventilation.class);
        features.add(pf);
        
        pf = new PlanFeature(VehicleRamp.class);
        features.add(pf);
        
        pf = new PlanFeature(Verandah.class);
        features.add(pf);
                
        pf = new PlanFeature(InteriorOpenSpaceService.class);
        features.add(pf);
        
        pf = new PlanFeature(CompoundWallService.class);
        features.add(pf);
        
        pf = new PlanFeature(RoadWidth.class);
        features.add(pf);
        
        pf = new PlanFeature(PlotArea.class);
        features.add(pf);
        
        pf = new PlanFeature(TerraceUtilityService.class);
        features.add(pf);
        
        pf = new PlanFeature(GateService.class);
        features.add(pf);

        pf = new PlanFeature(ConstructedArea.class);
        features.add(pf);
        
        pf = new PlanFeature(FootpathService.class);
        features.add(pf);
        
        pf = new PlanFeature(DrinageService.class);
        features.add(pf);
        
        pf = new PlanFeature(SupplyLineUtility.class);
        features.add(pf);
        
        pf = new PlanFeature(GlassFacadeOpening.class);
        features.add(pf);

        pf = new PlanFeature(PorticoService.class);
        features.add(pf);
        
        pf = new PlanFeature(InfoCommsTechService.class);
        features.add(pf);
        
        pf = new PlanFeature(DxfToPdfConverter.class);
        features.add(pf);
        
        
        return features;
    }

}
