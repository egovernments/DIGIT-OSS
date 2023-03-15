package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Door;
import org.egov.common.entity.edcr.Floor;
import org.egov.common.entity.edcr.TypicalFloor;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDimension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExitWidthExtract extends FeatureExtract {

    private static final Logger LOG = LogManager.getLogger(ExitWidthExtract.class);
    public static final BigDecimal VAL_0_75 = BigDecimal.valueOf(0.75);
    public static final BigDecimal VAL_1_2 = BigDecimal.valueOf(1.2);
    @Autowired
    private LayerNames layerNames;

    @Override
    public PlanDetail extract(PlanDetail pl) {
        if (LOG.isDebugEnabled())
            LOG.debug("Starting of Exit Width Extract......");
        if (!pl.getBlocks().isEmpty())
            for (Block block : pl.getBlocks())
                if (block.getBuilding() != null && !block.getBuilding().getFloors().isEmpty())
                    outside: for (Floor floor : block.getBuilding().getFloors()) {
                        if (!block.getTypicalFloor().isEmpty())
                            for (TypicalFloor tp : block.getTypicalFloor())
                                if (tp.getRepetitiveFloorNos().contains(floor.getNumber()))
                                    for (Floor allFloors : block.getBuilding().getFloors())
                                        if (allFloors.getNumber().equals(tp.getModelFloorNo()))
                                            if (!allFloors.getExitWidthDoor().isEmpty()
                                                    || !allFloors.getExitWidthStair().isEmpty()) {
                                                floor.setExitWidthDoor(allFloors.getExitWidthDoor());
                                                floor.setExitWidthStair(allFloors.getExitWidthStair());
                                                continue outside;
                                            }
						String layerNameExitWidthDoor = String.format(layerNames.getLayerName("LAYER_NAME_EXIT_WIDTH_DOOR"),
                                block.getNumber(),
                                floor.getNumber());
						List<BigDecimal> exitWidthDoors = Util.getListOfDimensionValueByLayer(pl,
								layerNameExitWidthDoor);
                        String layerNameExitWidthStair = String.format(layerNames.getLayerName("LAYER_NAME_EXIT_WIDTH_STAIR"),
                                block.getNumber(),
								floor.getNumber());
						List<BigDecimal> exitWidthStairs = Util.getListOfDimensionValueByLayer(pl,
								layerNameExitWidthStair);

						if (!exitWidthDoors.isEmpty())
							floor.setExitWidthDoor(exitWidthDoors);

						if (!exitWidthStairs.isEmpty())
							floor.setExitWidthStair(exitWidthStairs);

						// Extracting doors by color for version 1.1.1
						List<DXFDimension> dimensions = Util.getDimensionsByLayer(pl.getDoc(), layerNameExitWidthDoor);
						if (!dimensions.isEmpty())
							floor.setDoors(buildDoors(pl, layerNameExitWidthDoor, dimensions));
                    }
        if (LOG.isDebugEnabled())
            LOG.debug("End of Exit Width Extract......");
        return pl;
    }

    @Override
    public PlanDetail validate(PlanDetail pl) {
        return pl;
    }
    
    private List<Door> buildDoors(PlanDetail pl, String layerNameExitWidthDoor, List<DXFDimension> dimensions) {
		Door door;
		List<Door> doors = new ArrayList<>();
		List<BigDecimal> widths;
		Map<Integer, List<DXFDimension>> dimensionsByColor = dimensions.stream()
				.collect(Collectors.groupingBy(DXFDimension::getColor));
		for (Map.Entry<Integer, List<DXFDimension>> dim : dimensionsByColor.entrySet()) {
			door = new Door();
			widths = new ArrayList<>();
			door.setName(layerNameExitWidthDoor);
			door.setColorCode(dim.getKey());
			for (DXFDimension dimension : dim.getValue()) 
				Util.extractDimensionValue(pl, widths, dimension, layerNameExitWidthDoor);
			
			door.setWidths(widths);
			doors.add(door);
		}
		return doors;
	}
  
}
