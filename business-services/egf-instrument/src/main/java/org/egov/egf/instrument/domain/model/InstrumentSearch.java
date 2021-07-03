package org.egov.egf.instrument.domain.model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class InstrumentSearch extends Instrument {
    private String ids;
    private String sortBy;
    private Integer pageSize;
    private Integer offset;
    private String instrumentTypes;
    private String financialStatuses;
    private Date transactionFromDate;
    private Date transactionToDate;
    private String receiptIds;
}