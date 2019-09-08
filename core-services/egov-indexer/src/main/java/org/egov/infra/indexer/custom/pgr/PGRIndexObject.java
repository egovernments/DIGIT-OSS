package org.egov.infra.indexer.custom.pgr;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class PGRIndexObject {
	
	List<ServiceIndexObject> serviceRequests = new ArrayList<>();

}
