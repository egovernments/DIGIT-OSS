package org.egov.demoutility.querybuilder;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class DemoQueryBuilder {

	@Autowired
	JdbcTemplate jdbcTemplate;

	public long getSequence() {

		String query = "SELECT NEXTVAL ('\"seq_employee_code \"')";

		List<Long> sequence = jdbcTemplate.query(query, new SingleColumnRowMapper<Long>());

		return sequence.get(0);

	}

}
