package org.egov.tlcalculator;

import org.junit.Test;

import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;

public class testing {


    @Test
    public void name() {
        BigDecimal d1 = new BigDecimal(-34);
        System.out.println(d1.compareTo(BigDecimal.ZERO));

        BigDecimal b1 = new BigDecimal(2);
        BigDecimal b2 = new BigDecimal(5);
        BigDecimal b3 = new BigDecimal(3);

        List<BigDecimal> list = new LinkedList<>();
        list.add(b1);
        list.add(b2);
        list.add(b3);

        BigDecimal max = list.stream().reduce(BigDecimal::max).get();

        System.out.println("max: "+max);

    }
}
