package org.egov.edcr.feature;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.egov.common.entity.edcr.Block;
import org.egov.common.entity.edcr.Measurement;
import org.egov.common.entity.edcr.Passage;
import org.egov.edcr.entity.blackbox.PlanDetail;
import org.egov.edcr.service.LayerNames;
import org.egov.edcr.utility.Util;
import org.kabeja.dxf.DXFDimension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PassageServiceExtract extends FeatureExtract {
	@Autowired
	private LayerNames layerNames;
	private static final Logger LOG = Logger.getLogger(PassageServiceExtract.class);

	@Override
	public PlanDetail extract(PlanDetail planDetail) {
		
		String LAYER_PASSAGE="LAYER_NAME_PASSAGE";
		String LAYER_PASSAGESTAIR="LAYER_NAME_PASSAGE_STAIR";
		List<Block> blocks = planDetail.getBlocks();
		Map<String, Integer> passageColors = planDetail.getSubFeatureColorCodesMaster().get("Passage");
		Map<String, Integer> passageStairColors = planDetail.getSubFeatureColorCodesMaster().get("PassageStair");

		List<BigDecimal> passageHeights = new ArrayList<>();
		List<BigDecimal> passageStairHeights = new ArrayList<>();
		List<BigDecimal> passagePolylines = new ArrayList<>();
		List<BigDecimal> passageStairPolylines = new ArrayList<>();

		for (Block block : blocks)
			if (block.getBuilding() != null) {

				List<DXFDimension> passageDimension = Util.getDimensionsByLayer(planDetail.getDoc(),
						layerNames.getLayerName(LAYER_PASSAGE));
				List<DXFDimension> passageStairDimension = Util.getDimensionsByLayer(planDetail.getDoc(),
						layerNames.getLayerName(LAYER_PASSAGESTAIR));

				if (!passageDimension.isEmpty()) {
					for (DXFDimension dim : passageDimension) {
						passageColors.entrySet().stream().forEach(sub -> {
							if (sub.getKey().equalsIgnoreCase("PassageHeight")
									&& sub.getValue().equals(Integer.valueOf(dim.getColor()))) {
								passageHeights.addAll(buildDimension(planDetail, dim, sub,
										layerNames.getLayerName(LAYER_PASSAGE)));
							} else if (sub.getKey().equalsIgnoreCase("PassageDimension")
									&& sub.getValue().equals(Integer.valueOf(dim.getColor()))) {
								passagePolylines.addAll(buildDimension(planDetail, dim, sub,
										layerNames.getLayerName(LAYER_PASSAGE)));
							}

						});
					}
				}
				if (!passageStairDimension.isEmpty()) {
					for (DXFDimension dim : passageStairDimension) {
						passageStairColors.entrySet().stream().forEach(sub -> {
							if (sub.getKey().equalsIgnoreCase("StairHeight")
									&& sub.getValue().equals(Integer.valueOf(dim.getColor()))) {
								passageStairHeights.addAll(buildDimension(planDetail, dim, sub,
										layerNames.getLayerName(LAYER_PASSAGESTAIR)));
							} else if (sub.getKey().equalsIgnoreCase("StairDimension")
									&& sub.getValue().equals(Integer.valueOf(dim.getColor()))) {
								passageStairPolylines.addAll(buildDimension(planDetail, dim, sub,
										layerNames.getLayerName(LAYER_PASSAGESTAIR)));
							}
						});
					}
				}

				if (passagePolylines != null && !passagePolylines.isEmpty()
						|| passageStairPolylines != null && !passageStairPolylines.isEmpty()
						|| passageHeights != null && !passageHeights.isEmpty()
						|| passageStairHeights != null && passageStairHeights.isEmpty()) {
					Passage passage = new Passage();
					passage.setPassageDimensions(passagePolylines);
					passage.setPassageStairDimensions(passageStairPolylines);
					passage.setPassageHeight(passageHeights);
					passage.setPassageStairHeight(passageStairHeights);
					block.getBuilding().setPassage(passage);
				}
			}

		return planDetail;
	}

	@Override
	public PlanDetail validate(PlanDetail planDetail) {
		return planDetail;
	}

	private List<BigDecimal> buildDimension(PlanDetail pl, DXFDimension dim, Entry<String, Integer> sub,
			String layerName) {
		List<BigDecimal> values = new ArrayList<>();
		LOG.info("****Passage -" + sub.getKey() + "- Dimension---->>>" + values);
		Util.extractDimensionValue(pl, values, dim, layerName);
		return values.isEmpty() ? (Arrays.asList(BigDecimal.ZERO)) : values;
	}
}
