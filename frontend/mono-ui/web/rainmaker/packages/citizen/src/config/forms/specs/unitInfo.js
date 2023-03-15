import { MDMS } from "egov-ui-kit/utils/endPoints";
import commonConfig from '../../common'
const formConfig = {
  name: "unitInfo",
  fields: {
    floor: {
      id: "floor",
      jsonPath: "",
      type: "singleValueList",
      floatingLabelText: "PT_ASSESMENT_INFO_FLOOR",
      hintText: "",
      dropDownData: [],
      numcols: 4,
      value: "",
    },
    occupancy: {
      id: "assessment-occupancy",
      jsonPath: "",
      type: "singleValueList",
      floatingLabelText: "PT_FORM2_OCCUPANCY",
      hintText: "PT_COMMONS_SELECT_PLACEHOLDER",
      value: "Self-Occupied",
      required: true,

      dataFetchConfig: {
        url: MDMS.GET.URL,
        action: MDMS.GET.ACTION,
        queryParams: {},
        requestBody: {
          MdmsCriteria: {
            tenantId: commonConfig.tenantId,
            moduleDetails: [
              {
                moduleName: "PropertyTax",
                masterDetails: [
                  {
                    name: "OccupancyType",
                  },
                ],
              },
            ],
          },
        },
        dataPath: ["MdmsRes.PropertyTax.OccupancyType"],
      },
    },
    builtArea: {
      id: "builtArea",
      jsonPath: "",
      type: "textfield",
      floatingLabelText: "PT_BUILT_AREA",
      hintText: "PT_FORM2_BUILT_UP_AREA_PLACEHOLDER",
      numcols: 4,
    },
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
};

export default formConfig;
