package org.egov.edcr.utility;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class DcrConstants {
    public static final String SITALAREA = "SITALAREA";
    public static final String SHORTESTDISTINCTTOROAD = "Shortest Distance to road ";
    public static final String NOTIFIED_SHORTESTDISTINCTTOROAD = "Notified road, Shortest Distance ";
    public static final String NOTIFIED_SHORTESTDISTINCTTOROADFROMCENTER = "Notified road distance from road center ";
    public static final String NONNOTIFIED_SHORTESTDISTINCTTOROADFROMCENTER = "Non Notified road distance from road center ";
    public static final String CULDESAC_SHORTESTDISTINCTTOROADFROMCENTER = "Cul-de-sac road distance from road center ";
    public static final String LANE_SHORTESTDISTINCTTOROADFROMCENTER = "Lane road distance from road center ";

    public static final String LANE_SHORTESTDISTINCTTOROAD = "Lane road, Shortest Distance ";
    public static final String NONNOTIFIED_SHORTESTDISTINCTTOROAD = "Non notified road,Shortest Distance ";
    public static final String CULD_SAC_SHORTESTDISTINCTTOROAD = "Cul-de-sac road,Shortest Distance ";

    public static final String RULE23 = "RULE23";
    public static final String RULE25 = "RULE25";
    public static final String RULE26 = "RULE26";
    public static final String RULE30 = "RULE30";
    public static final String RULE31 = "RULE31";
    public static final String RULE32 = "RULE32";
    public static final String RULE33 = "RULE33";
    public static final String RULE60 = "RULE60";
    public static final String RULE61 = "RULE61";
    public static final String RULE62 = "RULE62";
    public static final String RULE24 = "RULE24";
    public static final String RULE34 = "RULE34";
    public static final String RULE_55 = "RULE55";
    public static final String RULE_54 = "RULE54";
    public static final String RULE104 = "RULE104";
    public static final String RULE109 = "RULE109";
    public static final String RULE47 = "RULE47";
    public static final String RULE114 = "RULE114";
    public static final String RULE39 = "RULE39";

    public static final String OBJECTDEFINED_DESC = " Defined in the plan.";
    public static final String WASTEDISPOSAL_DEFINED_KEY = "WASTEDISPOSAL_DEFINED";
    public static final String OBJECTNOTDEFINED_DESC = " Not defined in the plan.";
    public static final String EXPECTEDRESULT = "msg.result.expected.actual";

    public static final String OBJECTDEFINED = "msg.object.defined";
    public static final String OBJECTNOTDEFINED = "msg.error.not.defined";
    public static final String WRONGHEIGHTDEFINED = "msg.wrong.height.defined";
    public static final String HEIGHTNOTDEFINED = "msg.height.notdefined";
    public static final String MORETHANONEPOLYLINEDEFINED = "msg.morethanOne.polylines.defined";
    public static final String WASTEDISPOSAL = "Waste disposal";
    public static final String CRZZONE = "CRZ Zone";
    public static final String ROAD = "Road";
    public static final String PARKINGSLOT_UNIT = "Parking slot or Units ";
    public static final String PARKINGSLOT = "Parking slot";
    public static final String DAPARKING_UNIT = "DA Parking slot or Units ";
    public static final String DIST_FROM_DA_TO_ENTRANCE = "Distance between DA parking area and main entrance ";
    public static final String TWO_WHEELER_PARKING_SLOT = "Two Wheeler Parking slot or Units ";
    public static final String LOAD_UNLOAD_AREA = "Loading/Unloading area ";
    public static final String SMALL_PLOT_VIOLATION = "Maximum number of floors allowed are less than or equal to 3";

    public static final String PLOT_AREA = "Plot Area ";
    public static final String BUILDING_HEIGHT_DESC = "Building height";
    public static final String BUILDING_FOOT_PRINT = "Building foot print";
    public static final String FRONT_YARD_DESC = "Front Setback";
    public static final String REAR_YARD_DESC = "Rear Setback";
    public static final String SIDE_YARD1_DESC = "Side Setback 1";
    public static final String SIDE_YARD2_DESC = "Side Setback 2";
    public static final String BSMT_FRONT_YARD_DESC = "Basement Front Setback";
    public static final String BSMT_REAR_YARD_DESC = "Basement Rear Setback";
    public static final String BSMT_SIDE_YARD1_DESC = "Basement Side Setback 1";
    public static final String BSMT_SIDE_YARD2_DESC = "Basement Side Setback 2";
    public static final String BSMT_SIDE_YARD_DESC = "Basement Side Setback";
    public static final String SIDE_YARD_DESC = "Side Setback";
    public static final String BASEMENT = "Basement";
    public static final String NON_BASEMENT = "Non Basement";
    public static final String VOLTAGE = "Voltage";
    public static final String CANOPY_DISTANCE = "Distance from canopy/retail dispensing unit of petrol filling station to plot boundary";
    public static final String ELECTRICLINE_DISTANCE = "Horizontal/Vertical line distance from electric line ";
    public static final String HORIZONTAL_ELECTRICLINE_DISTANCE = " Minimum Horizontal line distance from electric line ";
    public static final String VERTICAL_ELECTRICLINE_DISTANCE = " Minimum Vertical line distance from electric line ";
    public static final String MAXIMUM_NUMBEROF_FLOOR = "Maximum Number of floor ";
    public static final String IN_METER = "(MTR)";
    public static final String IN_KV = "(KV)";
    public static final String FILESTORE_MODULECODE = "Digit DCR";
    public static final String SEQ_ECDR_APPLICATIONNO = "SEQ_ECDR_APPLICATIONNO";
    public static final String APPLICATION_MODULE_TYPE = "Digit DCR";
    public static final String BLOCKS_DISTANCE = "Distance between block %s and block %s";
    public static final String BLOCK_BUILDING_HEIGHT = "Block %s building height";
    public static final String BLOCK_BUILDING_OCCUPANCY = "Block %s building occupany";
    public static final String EXIT_WIDTH_DOORSTAIRWAYS = "exit stairway/doorway width for block %s floor %s";
    public static final String WELL_ERROR_COLOUR_CODE_DISTANCE_FROMROAD = "msg.error.color.well";
    public static final String WASTE_DISPOSAL_ERROR_COLOUR_CODE_DISTANCE_FROMBOUNDARY = "msg.error.color.wastedisposal";
    public static final String RAINWATER_HARVESTING = "Rain Water Harvesting";
    public static final String IN_LITRE = " L ";
    public static final String BIOMETRIC_WASTE_TREATMENT = "Biomedical Waste Treatment";
    public static final String MEZZANINE_HALL = "Hall enclosing mezzanine floor %s in floor %s,block %s";
    public static final String TRAVEL_DIST_EXIT = "Maximum travel distance to emergency exit";
    public static final String RAMP = "DA Ramp for block %s";
    public static final String RAMP_SLOPE = "DA Ramp %s slope for block %s";
    public static final String HORIZONTAL_ELINE_DISTANCE_NOC = "NOC from Chief Electrical Inspector or an"
            + " officer authorized by him shall be obtained as minimum horizontal line distance from electric"
            + " line %s is not satisfied as per rule";
    public static final String HORIZONTAL_ELINE_DISTANCE_NOC_HLINE_NOT_DEFINED = "NOC from Chief Electrical Inspector or an"
            + " officer authorized by him shall be obtained as minimum horizontal line distance from electric"
            + " line %s is not defined in plan as per rule";
    public static final String ACCESSORRY_BLK_HGHT = "Height of accessory block %s";
    public static final String SHORTESTDISTANCETOROAD = "Minimum distance from accessory block to road";
    public static final String ACCESSORRY_BLK_DIST_FRM_PLOT_BNDRY = "Accessory block %s distance from plot boundary";

    // ----- names

    public static Integer FLOOR_COLOUR_CODE = 10;

    public static final int DECIMALDIGITS = 10;
    public static final int DECIMALDIGITS_MEASUREMENTS = 2;

    public static final String BUILDING_EXTERIOR_WALL = "BUILDING_EXTERIOR_WALL";
    public static final String OCCUPANCY = "Occupancy";
    public static final String BUILDING_HEIGHT = "BUILDING_HEIGHT";
    public static final String BUILDING_TOP_MOST_HEIGHT = "BUILDING_TOP_MOST_HEIGHT";
    public static final String MAX_HEIGHT_CAL = "MAX_HEIGHT_CAL";
    public static final String SECURITY_ZONE = "Building in Security Zone";

    public static final String IN_METER_SQR = "(MTRSQ)";
    public static final String RESIDENTIAL = "RESIDENTIAL";
    public static final String TOTAL_FLOOR_AREA = "TOTAL_FLOOR_AREA";
    public static final String NOC = "NOC";

    public static final String FAR_DEDUCT = "FAR_DEDUCT";
    public static final String FLOOR_AREA = "FLOOR_AREA";
    public static final String FAR = "FAR";
    public static final String COVERAGE = "COVERAGE";
    public static final String COVERAGE_DEDUCT = "COVERAGE DEDUCT";
    public static final RoundingMode ROUNDMODE_MEASUREMENTS = RoundingMode.HALF_UP;
    public static final String YES = "YES";
    public static final String NO = "NO";
    public static final String NA = "NA";
    public static final String PLAN_DETAIL = "Plan Detail";

    public static final String SHORTESTDISTINACETOBUILDINGFOOTPRINT = "Shortest distance between the building foot print from wider road end ";
    public static final String SHADE = "Shades or Overhangs";
    public static final String PLOT_BOUNDARY = "Plot boundary";

    public static final String DIST_CL_ROAD = "Distance from center line road to building";
    public static final String LANE_1 = "Lane Distance";
    public static final String CULD_DE_SAC = "culd de sac";
    public static final String OPEN_STAIR_DESC = "Open Stair ";

    public static final String HABITABLE_ROOM = "Habitable Room";

    public static final String ERROR_CODE_PLAN_NOT_EXIST = "EDCR - 01";
    public static final String ERROR_MSG_PLAN_NOT_EXIST = "Dear applicant with entered E-DCR number there is no application detail found, please make sure you are using approved plan E-DCR number.";
    public static final String HORIZONTAL_ELECTRICLINE_DISTANCE_NOC = "NOC from Chief Electrical Inspector or an officer authorized by him shall be obtained. ";
    public static final String NOTIFIED_ROAD = "Notified road, ";
    public static final String NONNOTIFIED_ROAD = "Non Notified road, ";
    public static final String CULDESAC_ROAD = "Cul-de-sac road, ";
    public static final String LANE_ROAD = "Lane road, ";
    public static final String LEVEL = ", Level ";
    public static final String OFBLOCK = " of Block ";
    public static final String FOROCCUPANCY = " for occupancy ";
    public static final String MEAN_OF_ACCESS = "Mean Of Access";
    public static final String SQMTRS = "m2";
    public static final String WELL_DISTANCE_FROMBOUNDARY = "Minimum distance from the well ";
    public static final String WASTE_DISPOSAL_DISTANCE_FROMBOUNDARY = "Minimum distance from the waste disposal ";
    public static final String RAINWATER_HARVES_TANKCAPACITY = "Rain Water Harvesting system storage tank capacity ";
    public static final String SOLAR_SYSTEM = "Solar assisted water heating/lighting system ";
    public static final String HEIGHT_OF_BUILDING = "Height of Building";
    public static final String FIRE_ESCAPE_STAIRS = "Fire Stair";
    public static final String GENERAL_STAIRS = "General Stair";
    public static final String RECREATIONSPACE_DESC = "Recreation space not defined";

    public static final String EDCR_ELEVATION = "EDCR_ELEVATION";
    public static final String EDCR_FLOOR_PLAN = "EDCR_FLOOR_PLAN";
    public static final String EDCR_SECTION = "EDCR_SECTION";
    public static final String EDCR_SITE_PLAN = "EDCR_SITE_PLAN";
    public static final String EDCR_PARKING_PLAN = "EDCR_PARKING_PLAN";
    public static final String EDCR_SERVICE_PLAN = "EDCR_SERVICE_PLAN";

    public static final String EDCR_DXF_PDF = "EDCR_DXF_PDF";
    public static final String DXF_PDF_CONVERSION_ENABLED = "DXF_PDF_CONVERSION_ENABLED";

    public static final String EXISTING = "Existing";
    public static final String PROPOSED = "Proposed";

    public static final int ONE_DECIMALDIGITS_MEASUREMENTS = 1;
    public static final int THREE_DECIMALDIGITS_MEASUREMENTS = 3;
    
    public static final BigDecimal DIMENSION_MARKING_LINE = BigDecimal.valueOf(0.20);
    public static final String DIMENSION_LINES_STANDARD = "Dimension lines standard";
    public static final String DIMENSION_EDITED = "Dimension edited";
    public static final String STRICTLY_VALIDATE_DIMENSION = "EDCR_STRICTLY_VALIDATE_DIMENSION";
    public static final String STRICTLY_VALIDATE_BLDG_HGHT_DIMENSION = "EDCR_STRICTLY_VALIDATE_BLDG_HEIGHT_DIMENSION";
    public static final String MDMS_STRICTLY_VALIDATE_DIMENSION = "STRICTLY_VALIDATE_DIMENSION";
    public static final String MDMS_STRICTLY_VALIDATE_BLDG_HGHT_DIMENSION = "STRICTLY_VALIDATE_BLDG_HEIGHT_DIMENSION";
    public static final String MDMS_EDCR_MODULE = "EDCR";
    public static final String PORTICO_DISTANCETO_EXTERIORWALL = "Block %s Portico %s Portico distance to exteriorwall";
    public static final String PDF_EXT = "application/pdf";

}