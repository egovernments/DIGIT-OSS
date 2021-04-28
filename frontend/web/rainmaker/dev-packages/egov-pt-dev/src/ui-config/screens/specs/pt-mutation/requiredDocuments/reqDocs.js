import { getBreak, getCommonContainer, getCommonHeader, getCommonParagraph, getCommonTitle } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getCommonGrayCard, getLabelOnlyValue } from "../../utils";
import { footer } from "./footer";

const styles = {
  header: {
    color: "gba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "20px",
    fontWeight: 500,
    lineHeight: "28px",
    paddingLeft: "5px"
  },
  subHeader: {
    color: "gba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "19px"
  },
  docs: {
    color: "rgba(0, 0, 0, 0.6)",
    fontFamily: "Roboto",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "17px",
    paddingBottom: "24px"
  },
  description: {
    fontFamily: "Roboto",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: "12px",
    fontWeight: 400,
    letterSpacing: "0.6px",
    lineHeight: "14px"
  }
};

const header = getCommonHeader(
  {
    labelName: "Required Documents-PT",
    labelKey: "PT_REQ_DOCS_HEADER"
  },
  {
    style: styles.header
  }
);

const generateDocument = item => {
  // Add header to individual grey cards
  let subHeader =
    item.code &&
    getCommonTitle(
      {
        labelKey: getTransformedLocale(`PT_${item.code}_HEADING`)
      },
      {
        style: styles.subHeader
      }
    );

  // Add documents in individual grey cards
  let docs = {};
  if (item.hasOwnProperty("dropdownData")) {
    item.dropdownData = item.dropdownData.filter(item => {
      return item.active;
    });
    docs = item.dropdownData.reduce((obj, doc) => {
      obj[doc.code] = getLabelOnlyValue(
        {
          labelKey: getTransformedLocale(`PT_${doc.code}_LABEL`)
        },
        {
          style: styles.docs
        }
      );
      return obj;
    }, {});
  } else if (item.hasOwnProperty("options")) {
    item.options = item.options.filter(item => {
      return item.active;
    });
    docs = item.options.reduce((obj, doc) => {
      obj[doc.code] = getLabelOnlyValue(
        {
          labelKey: getTransformedLocale(`PT_${doc.code}_LABEL`)
        },
        {
          style: styles.docs
        }
      );
      return obj;
    }, {});
  }

  // Add description to individual grey cards
  let subParagraph = item.description
    ? getCommonParagraph(
      {
        labelKey: getTransformedLocale(`PT_${item.description}_NOTE`)
      },
      {
        style: styles.description
      }
    )
    : {};

  let subParagraph1 = getCommonParagraph(
    {
      labelKey: getTransformedLocale('ONE_OF_THESE_DOC_NEEDED')
    },
    {
      style: styles.description
    }
  )

  return getCommonGrayCard({
    subHeader: subHeader,
    break: getBreak(),
    subParagraph1: subParagraph1,
    break1: getBreak(),
    docs: getCommonContainer({ ...docs }),
    subParagraph: subParagraph
  });
};

export const getRequiredDocuments = documents => {
  let doc = documents.map(item => {
    return generateDocument(item);
  });
  return getCommonContainer(
    {
      header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
          className: "fixedHeader"
        },
        children: {
          header
        }
      },
      documents: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          ...doc
        },
        props: {
          id: "documents-div"
        }
      },
      footer: {
        uiFramework: "custom-atoms",
        props: {
          className: "footerSticky",
        },
        componentPath: "Container",
        children: {
          footer
        }
      }
    },
    {
      style: {
        // paddingBottom: 75
      }
    }
  );
};
