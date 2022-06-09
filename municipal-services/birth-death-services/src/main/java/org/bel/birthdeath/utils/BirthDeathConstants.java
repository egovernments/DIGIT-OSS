package org.bel.birthdeath.utils;

import org.springframework.stereotype.Component;

@Component
public class BirthDeathConstants {
	public static final String GL_CODE_JSONPATH_CODE = "$.MdmsRes.BillingService.GLCode[?(@.code==\"{}\")]";

	public static final String GL_CODE = "glcode";

	public static final String GL_CODE_MASTER = "GLCode";

	public static final String BILLING_SERVICE = "BillingService";

	public static final String BIRTH_CERT = "BIRTH_CERT";

	public static final String BIRTH_CERT_FEE = "BIRTH_CERT_FEE";

	public static final String DEATH_CERT = "DEATH_CERT";

	public static final String DEATH_CERT_FEE = "DEATH_CERT_FEE";

	public static final String TENANT_EMPTY = "Tenantid cannot be empty";
	public static final String B_MANDATORY_MISSING = "DOB/GENDER is empty";
	public static final String D_MANDATORY_MISSING = "DOD/GENDER is empty";
	public static final String DUPLICATE_REG = "Reg No already exists";
	public static final String DUPLICATE_REG_EXCEL = "Reg No already exists in Excel";
	public static final String HOSPNAME_LARGE = "Hospital name cannot exceed 500 chars";
	public static final String REG_EMPTY = "Reg No cannot be empty";
	public static final String DOB_EMPTY = "DoB cannot be empty";
	public static final String GENDER_EMPTY = "Gender cannot be empty";
	public static final String GENDER_INVALID = "Invalid Gender value";
	public static final String FIRSTNAME_LARGE = "Firstname cannot exceed 200 chars";
	public static final String MIDDLENAME_LARGE = "Middlename cannot exceed 200 chars";
	public static final String LASTNAME_LARGE = "Lastname cannot exceed 200 chars";
	public static final String REGNO_LARGE = "Registration No. cannot exceed 64 chars";
	public static final String F_FIRSTNAME_LARGE = "Father Firstname cannot exceed 200 chars";
	public static final String F_MIDDLENAME_LARGE = "Father Middlename cannot exceed 200 chars";
	public static final String F_LASTNAME_LARGE = "Father Lastname cannot exceed 200 chars";
	public static final String F_EDUCATION_LARGE = "Father Education cannot exceed 100 chars";
	public static final String F_RELIGION_LARGE = "Father Religion cannot exceed 100 chars";
	public static final String F_PROFFESSION_LARGE = "Father Profession cannot exceed 100 chars";
	public static final String F_NATIONALITY_LARGE = "Father Nationality cannot exceed 100 chars";
	public static final String M_EDUCATION_LARGE = "Mother Education cannot exceed 100 chars";
	public static final String M_RELIGION_LARGE = "Mother Religion cannot exceed 100 chars";
	public static final String M_PROFFESSION_LARGE = "Mother Profession cannot exceed 100 chars";
	public static final String M_NATIONALITY_LARGE = "Mother Nationality cannot exceed 100 chars";
	public static final String M_FIRSTNAME_LARGE = "Mother Firstname cannot exceed 200 chars";
	public static final String M_MIDDLENAME_LARGE = "Mother Middlename cannot exceed 200 chars";
	public static final String M_LASTNAME_LARGE = "Mother Lastname cannot exceed 200 chars";
	public static final String F_EMAIL_LARGE = "Father Email cannot exceed 50 chars";
	public static final String M_EMAIL_LARGE = "Mother Email cannot exceed 50 chars";
	public static final String F_MOBILE_LARGE = "Father Mobile cannot exceed 20 chars";
	public static final String M_MOBILE_LARGE = "Mother Mobile cannot exceed 20 chars";
	public static final String F_AADHAR_LARGE = "Father Aadhar cannot exceed 50 chars";
	public static final String M_AADHAR_LARGE = "Mother Aadhar cannot exceed 50 chars";
	public static final String S_EMAIL_LARGE = "Spouse Email cannot exceed 50 chars";
	public static final String S_AADHAR_LARGE = "Spouse Aadhar cannot exceed 50 chars";
	public static final String S_MOBILE_LARGE = "Spouse Mobile cannot exceed 20 chars";
	public static final String INFORMANTNAME_LARGE = "Informants name cannot exceed 200 chars";
	public static final String INFORMANTADDR_LARGE = "Informants Address cannot exceed 1000 chars";
	public static final String PLACEOFBIRTH_LARGE = "Place of Birth cannot exceed 1000 chars";
	public static final String AGE_LARGE = "Age cannot exceed 100 chars";
	public static final String EIDNO_LARGE = "EID No cannot exceed 100 chars";
	public static final String AADHAR_LARGE = "Aadhar No cannot exceed 150 chars";
	public static final String NATIONALITY_LARGE = "Nationality cannot exceed 100 chars";
	public static final String RELIGION_LARGE = "Religion cannot exceed 100 chars";
	public static final String ICDCODE_LARGE = "ICD Code cannot exceed 300 chars";

	public static final String INVALID_DOB = "DOB not valid";
	public static final String INVALID_DOB_RANGE = "DOB not in range";
	public static final String INVALID_DOR = "DOR not valid";
	public static final String INVALID_DOR_RANGE = "DOR not in range";

	public static final String DOD_EMPTY = "DoD cannot be empty";
	public static final String INVALID_DOD = "DOD not valid";
	public static final String INVALID_DOD_RANGE = "DOD not in range";
	public static final String S_FIRSTNAME_LARGE = "Spouse Firstname cannot exceed 200 chars";
	public static final String S_MIDDLENAME_LARGE = "Spouse Middlename cannot exceed 200 chars";
	public static final String S_LASTNAME_LARGE = "Spouse Lastname cannot exceed 200 chars";
	public static final String PLACEOFDEATH_LARGE = "Place of Death cannot exceed 1000 chars";

	public static final String PERM_BUILDINGNO = "Building No in Permanent Address cannot exceed 1000 chars";
	public static final String PERM_HOUSENO = "House No in Permanent Address cannot exceed 1000 chars";
	public static final String PERM_STREETNAME = "Street name in Permanent Address cannot exceed 1000 chars";
	public static final String PERM_LOCALITY = "Locality in Permanent Address cannot exceed 1000 chars";
	public static final String PERM_TEHSIL = "Tehsil in Permanent Address cannot exceed 1000 chars";
	public static final String PERM_DISTRICT = "District in Permanent Address cannot exceed 100 chars";
	public static final String PERM_CITY = "City in Permanent Address cannot exceed 100 chars";
	public static final String PERM_STATE = "State in Permanent Address cannot exceed 100 chars";
	public static final String PERM_PINNO = "Pin No in Permanent Address cannot exceed 100 chars";
	public static final String PERM_COUNTRY = "Country in Permanent Address cannot exceed 100 chars";

	public static final String PRESENT_BUILDINGNO = "Building No in Present Address cannot exceed 1000 chars";
	public static final String PRESENT_HOUSENO = "House No in Present Address cannot exceed 1000 chars";
	public static final String PRESENT_STREETNAME = "Street name in Present Address cannot exceed 1000 chars";
	public static final String PRESENT_LOCALITY = "Locality in Present Address cannot exceed 1000 chars";
	public static final String PRESENT_TEHSIL = "Tehsil in Present Address cannot exceed 1000 chars";
	public static final String PRESENT_DISTRICT = "District in Present Address cannot exceed 100 chars";
	public static final String PRESENT_CITY = "City in Present Address cannot exceed 100 chars";
	public static final String PRESENT_STATE = "State in Present Address cannot exceed 100 chars";
	public static final String PRESENT_PINNO = "Pin No in Present Address cannot exceed 100 chars";
	public static final String PRESENT_COUNTRY = "Country in Present Address cannot exceed 100 chars";

	public static final String DATA_ERROR = "Data Error";
	public static final String EXCEL_DATA_ERROR = "Excel Data Error";
	public static final String UPDATE_ERROR = "Id cannot be empty for Updation";

	public static final String PLACE_OF_BIRTH_EMPTY = "Place of birth cannot be empty";

	public static final String FATHER_FIRSTNAME_EMPTY = "Father firstname cannot be empty";

	public static final String FATHER_NATIONALITY_EMPTY = "Father nationality cannot be empty";

	public static final String FATHER_MIDDLE_EMPTY = "Father middlename cannot be empty";

	public static final String FATHER_LASTNAME_EMPTY = "Father lastname cannot be empty";

	public static final String MOTHER_FIRSTNAME_EMPTY = "Mother firstname cannot be empty";

	public static final String MOTHER_MIDDLE_EMPTY = "Mother middlename cannot be empty";

	public static final String MOTHER_LASTNAME_EMPTY = "Mother lastname cannot be empty";

	public static final String MOTHER_NATIONALITY_EMPTY = "Mother nationality cannot be empty";

	public static final String PERMENANT_BUILDING_NO_EMPTY = "Building no cannot be empty";

	public static final String PERMENANT_HOUSE_NO_EMPTY = "House no cannot be empty";

	public static final String PERMENANT_STREET_NAME_EMPTY = "Street name cannot be empty";

	public static final String PERMENANT_LOCALITY_EMPTY = "locality cannot be empty";

	public static final String PERMENANT_TEHSIL_EMPTY = "Tehsil cannot be empty";

	public static final String PERMENANT_DISTRICT_EMPTY = "District cannot be empty";

	public static final String PERMENANT_CITY_EMPTY = "City cannot be empty";

	public static final String PERMENANT_STATE_EMPTY = "State cannot be empty";

	public static final String PERMENANT_PINCODE_EMPTY = "Pincode cannot be empty";

	public static final String PERMENANT_COUNTRY_EMPTY = "Country cannot be empty";

    public static final String NATIONALITY_EMPTY = "Nationality cannot be empty";

	public static final String TENANTID_PREPARED_STMT = " bdtl.tenantid=? ";

	public static final String ID_PREPARED_STMT = " bdtl.id=? ";

	public static final String REGNO_PREPARED_STMT = " bdtl.registrationno=? ";

	public static final String GENDER_PREPARED_STMT = " bdtl.gender=? ";

	public static final String BND_DESCRYPT_KEY = "BndDetail";

	public static final String REPLACE_CONT = "\\w(?=\\w{4})";

	public static final String REPLACE_CONT_ASTERICK = "*";

	public static final String PAYMENT_ERROR_MESSAGE = "Exception while processing payment update ";

	public static final String UPDATE_ERROR_MESSAGE = "UPDATE_ERROR";


}
