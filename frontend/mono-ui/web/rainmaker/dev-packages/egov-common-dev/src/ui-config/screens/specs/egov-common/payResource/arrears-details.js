import { getCommonGrayCard } from "egov-ui-framework/ui-config/screens/specs/utils";


const arrearsCard = getCommonGrayCard({

  arrearCard: {
    uiFramework: "custom-containers-local",
    componentPath: "ArrearsCardContainer",
    moduleName:"egov-common",
    props: {
      estimate: {
      }
    }
  }
});

export default arrearsCard;