export const toggleWater = (onFieldChange, value) => {
  onFieldChange(
    "apply",
    "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.pipeSize",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfTaps",
    "visible",
    value
  );
}

export const toggleSewerage = (onFieldChange, value) => {
  onFieldChange(
    "apply",
    "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfToilets",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfWaterClosets",
    "visible",
    value
  );
}