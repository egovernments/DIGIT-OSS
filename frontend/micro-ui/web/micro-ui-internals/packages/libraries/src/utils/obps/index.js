export const calculateRiskType = (riskTypes, plotArea, blocks) => {
  const buildingHeight = blocks?.reduce((acc, block) => {
    return Math.max(acc, block.building.buildingHeight)
  }, Number.NEGATIVE_INFINITY);

  const risk = riskTypes?.find(riskType => {
    if (riskType.riskType === "HIGH" && (plotArea > riskType?.fromPlotArea || buildingHeight >= riskType?.fromBuildingHeight)) {
      return true;
    }

    if (riskType.riskType === "MEDIUM" && ((plotArea >= riskType?.fromPlotArea && plotArea <= riskType?.toPlotArea) || 
    (buildingHeight >= riskType?.fromBuildingHeight && buildingHeight <= riskType?.toBuildingHeight))) {
      return true;
    }

    if (riskType?.riskType === "LOW" && plotArea < riskType.toPlotArea && buildingHeight < riskType.toBuildingHeight) {
      return true;
    }

    return false;
  })
  return risk?.riskType;
}