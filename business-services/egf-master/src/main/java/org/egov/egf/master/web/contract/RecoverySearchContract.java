package org.egov.egf.master.web.contract;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data

public class RecoverySearchContract extends RecoveryContract {

    private String sortBy;

    private Integer pageSize;

    private Integer offset;

    private List<Long> ids = new ArrayList<Long>();

}
