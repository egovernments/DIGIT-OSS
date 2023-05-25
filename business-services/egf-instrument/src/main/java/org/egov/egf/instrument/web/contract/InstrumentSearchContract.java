package org.egov.egf.instrument.web.contract;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class InstrumentSearchContract extends InstrumentContract {
    private String ids;
    private String sortBy;
    private Integer pageSize;
    private Integer offset;
    private String instrumentTypes;
    private String receiptIds;
    private String financialStatuses;
    private Date transactionFromDate;
    private Date transactionToDate;
}