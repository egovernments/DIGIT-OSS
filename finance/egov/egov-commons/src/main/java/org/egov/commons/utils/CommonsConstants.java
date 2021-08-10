package org.egov.commons.utils;

public interface CommonsConstants {
    
    public static final String alphaNumericwithspecialchar = "[0-9a-zA-Z-& :,/.()@]+";
    public static final String alphaNumericwithspecialcharForContraWOAndSupplierName = "[a-zA-Z0-9 @#&/\\\\()-.*,\":]+";
    public static final String alphaNumericwithoutspecialchar = "[0-9a-zA-Z/]+";
    public static final String numericwithoutspecialchar = "[0-9-]+";
    public static final String ALPHANUMERICWITHALLSPECIALCHAR = "[0-9a-zA-Z_@./#&+-/!(){}\",^$%*|=;:<>?`~ ]+";
    public static final int AMOUNT_SCALE = 2;// scale value for BigDecimal
                            
    

}
