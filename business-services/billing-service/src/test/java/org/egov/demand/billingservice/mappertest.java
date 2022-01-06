package org.egov.demand.billingservice;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.postgresql.util.PGobject;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

public class mappertest {

	@Test
	public void name() throws SQLException {


		List L = new LinkedList();

		L.add(new BigDecimal(1));
		L.add(2);

		System.out.println(L.get(1).getClass());

	}





}
