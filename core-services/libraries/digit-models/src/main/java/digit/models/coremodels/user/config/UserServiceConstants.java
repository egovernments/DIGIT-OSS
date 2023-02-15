package digit.models.coremodels.user.config;

public class UserServiceConstants {

    public static final String EMAIL_UPDATION_CODE = "EMAIL_UPDATED";

    public static final String INVALID_USER_REQUEST = "UserRequest is Invalid";

    public static final String ROLECODE_MISSING_CODE = "egs_001";
    public static final String ROLECODE_MISSING_FIELD = "roles";
    public static final String ROLECODE_MISSING_MESSAGE = "Atleast One Role Is Required.";
    public static final String USER_CLIENT_ID = "egov-user-client";
    public static final String IP_HEADER_NAME = "x-real-ip";


    public static final String PATTERN_NAME = "^[^\\\\$\\\"<>?\\\\\\\\~`!@#$%^()+={}\\\\[\\\\]*,:;“”‘’]*$";


    public static final String PATTERN_GENDER = "^[a-zA-Z ]*$";
    public static final String PATTERN_MOBILE = "(^$|[0-9]{10})";
    public static final String PATTERN_CITY = "^[a-zA-Z. ]*$";
    public static final String PATTERN_TENANT = "^[a-zA-Z. ]*$";
    public static final String PATTERN_PINCODE = "^[1-9][0-9]{5}$";
}