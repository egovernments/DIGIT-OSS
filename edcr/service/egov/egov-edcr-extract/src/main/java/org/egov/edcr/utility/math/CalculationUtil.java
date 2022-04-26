package org.egov.edcr.utility.math;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedList;
import java.util.Queue;

import org.apache.log4j.Logger;

public class CalculationUtil {
	private static final Logger LOG = Logger.getLogger(CalculationUtil.class);
    public static void main(String[] args) {
        //CalculationUtil rc = new CalculationUtil();
        LOG.info(CalculationUtil.process("10 * 20 / 10"));
    }

    public static BigDecimal process(String args) {

        StringBuilder sb = new StringBuilder();
        BigDecimal firstVal;
        BigDecimal secondVal;
        BigDecimal mainVal = BigDecimal.ZERO;
        Queue<String> q = new LinkedList<>();
        String operation = "";
        for (char c : args.toCharArray())
            switch (c) {
            case '/':

                q.add(sb.toString().trim());
                q.add("/");
                break;
            case '*':
                q.add(sb.toString().trim());
                q.add("*");
                break;
            case '+':
                q.add(sb.toString().trim());
                q.add("+");
                break;
            case '-':
                q.add(sb.toString().trim());
                q.add("-");
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '.':
                sb.append(c);
                break;
            default:
            	// No update
            	break;
            }
        while (!q.isEmpty()) {
            firstVal = BigDecimal.valueOf(Double.valueOf(q.remove()));
            operation = q.remove();
            secondVal = BigDecimal.valueOf(Double.valueOf(q.remove()));
            switch (operation) {
            case "/":
                mainVal = firstVal.divide(secondVal, 2, RoundingMode.HALF_UP);
                q.add("" + mainVal.doubleValue());
                break;
            case "*":
                mainVal = firstVal.multiply(secondVal);
                q.add("" + mainVal.doubleValue());
                break;
            case "+":
                mainVal = firstVal.add(secondVal);
                q.add("" + mainVal.doubleValue());
                break;
            case "-":
                mainVal = firstVal.subtract(secondVal);
                q.add("" + mainVal.doubleValue());
                break;
            default:
            	break;

            }
        }

        return mainVal;
    }

}
