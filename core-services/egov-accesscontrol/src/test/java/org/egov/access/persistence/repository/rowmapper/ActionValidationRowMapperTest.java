package org.egov.access.persistence.repository.rowmapper;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.sql.ResultSet;
import java.sql.SQLException;

import static org.junit.Assert.assertFalse;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ActionValidationRowMapperTest {
	@Mock
	private ResultSet resultSet;

	@Test
	public void testActionValidationRowMapperShouldReturnTrueIfActionIsValidated() throws SQLException {
		ActionValidationRowMapper actionValidationRowMapper = new ActionValidationRowMapper();
		when(resultSet.getBoolean("exists")).thenReturn(true);
		assert actionValidationRowMapper.mapRow(resultSet, 1).isAllowed();

		when(resultSet.getBoolean("exists")).thenReturn(false);
		assertFalse(actionValidationRowMapper.mapRow(resultSet, 1).isAllowed());
	}
}
