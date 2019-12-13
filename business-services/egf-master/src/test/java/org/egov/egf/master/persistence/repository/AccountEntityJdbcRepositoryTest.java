package org.egov.egf.master.persistence.repository;

import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountEntity;
import org.egov.egf.master.domain.model.AccountEntitySearch;
import org.egov.egf.master.persistence.entity.AccountEntityEntity;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNull;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@Ignore
public class AccountEntityJdbcRepositoryTest {

    private AccountEntityJdbcRepository accountEntityJdbcRepository;
    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Before
    public void setUp() throws Exception {
        accountEntityJdbcRepository = new AccountEntityJdbcRepository(namedParameterJdbcTemplate);
    }

    @Test
    @Sql(scripts = {"/sql/clearAccountEntity.sql"})
    public void test_create() {

        AccountEntityEntity accountEntity = AccountEntityEntity.builder().id("1").code("code").name("name").active(true)
                .accountDetailTypeId(getAccountDetaialType().getId()).description("entity").build();
        accountEntity.setTenantId("default");
        AccountEntityEntity actualResult = accountEntityJdbcRepository.create(accountEntity);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_accountEntity",
                new AccountEntityResultExtractor());
        Map<String, Object> row = result.get(0);
        assertThat(row.get("id")).isEqualTo(actualResult.getId());
        assertThat(row.get("name")).isEqualTo(actualResult.getName());
        assertThat(row.get("code")).isEqualTo(actualResult.getCode());
        assertThat(row.get("accountDetailTypeId")).isEqualTo(actualResult.getAccountDetailTypeId());

    }

    @Test(expected = DataIntegrityViolationException.class)
    @Sql(scripts = {"/sql/clearAccountEntity.sql"})
    public void test_create_with_tenantId_null() {

        AccountEntityEntity accountEntity = AccountEntityEntity.builder().code("code").name("name").active(true)
                .accountDetailTypeId(getAccountDetaialType().getId()).description("entity").build();
        accountEntityJdbcRepository.create(accountEntity);

    }

    @Test
    @Sql(scripts = {"/sql/clearAccountEntity.sql", "/sql/insertAccountEntity.sql"})
    public void test_update() {

        AccountEntityEntity accountEntity = AccountEntityEntity.builder().code("codeU").name("nameU").active(true).id("1")
                .accountDetailTypeId(getAccountDetaialType().getId()).description("entity").build();
        accountEntity.setTenantId("default");
        AccountEntityEntity actualResult = accountEntityJdbcRepository.update(accountEntity);

        List<Map<String, Object>> result = namedParameterJdbcTemplate.query("SELECT * FROM egf_accountEntity",
                new AccountEntityResultExtractor());
        Map<String, Object> row = result.get(0);
        assertThat(row.get("id")).isEqualTo(actualResult.getId());
        assertThat(row.get("name")).isEqualTo(actualResult.getName());
        assertThat(row.get("code")).isEqualTo(actualResult.getCode());

    }

    @Test
    @Sql(scripts = {"/sql/clearAccountEntity.sql", "/sql/insertAccountEntity.sql"})
    public void test_search() {

        Pagination<AccountEntity> page = (Pagination<AccountEntity>) accountEntityJdbcRepository.search(getAccountEntitySearch());
        assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
        assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
        assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

    }

    @Test
    @Sql(scripts = {"/sql/clearAccountEntity.sql", "/sql/insertAccountEntity.sql"})
    public void test_search_with_no_parameter() {

        Pagination<AccountEntity> page = (Pagination<AccountEntity>) accountEntityJdbcRepository.search(new AccountEntitySearch());
        assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
        assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
        assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

    }

    @Test
    @Sql(scripts = {"/sql/clearAccountEntity.sql", "/sql/insertAccountEntity.sql"})
    public void test_find_by_id() {

        AccountEntityEntity accountEntityEntity = AccountEntityEntity.builder().id("1").build();
        accountEntityEntity.setTenantId("default");
        AccountEntityEntity result = accountEntityJdbcRepository.findById(accountEntityEntity);
        assertThat(result.getId()).isEqualTo("1");
        assertThat(result.getName()).isEqualTo("name");
        assertThat(result.getCode()).isEqualTo("code");

    }

    @Test
    @Sql(scripts = {"/sql/clearAccountEntity.sql", "/sql/insertAccountEntity.sql"})
    public void test_find_by_invalid_id_should_return_null() {

        AccountEntityEntity accountEntityEntity = AccountEntityEntity.builder().id("5").build();
        accountEntityEntity.setTenantId("default");
        AccountEntityEntity result = accountEntityJdbcRepository.findById(accountEntityEntity);
        assertNull(result);

    }

    @Test(expected = InvalidDataException.class)
    @Sql(scripts = {"/sql/clearAccountEntity.sql", "/sql/insertAccountEntity.sql"})
    public void test_search_invalid_sort_option() {

        AccountEntitySearch search = getAccountEntitySearch();
        search.setSortBy("desc");
        accountEntityJdbcRepository.search(search);

    }

    @Test
    @Sql(scripts = {"/sql/clearAccountEntity.sql", "/sql/insertAccountEntity.sql"})
    public void test_search_without_pagesize_offset_sortby() {

        AccountEntitySearch search = getAccountEntitySearch();
        search.setSortBy(null);
        search.setPageSize(null);
        search.setOffset(null);
        Pagination<AccountEntity> page = (Pagination<AccountEntity>) accountEntityJdbcRepository.search(getAccountEntitySearch());
        assertThat(page.getPagedData().get(0).getName()).isEqualTo("name");
        assertThat(page.getPagedData().get(0).getCode()).isEqualTo("code");
        assertThat(page.getPagedData().get(0).getActive()).isEqualTo(true);

    }

    private AccountEntitySearch getAccountEntitySearch() {
        AccountEntitySearch accountEntitySearch = new AccountEntitySearch();
        accountEntitySearch.setId("1");
        accountEntitySearch.setName("name");
        accountEntitySearch.setCode("code");
        accountEntitySearch.setActive(true);
        accountEntitySearch.setAccountDetailType(getAccountDetaialType());
        accountEntitySearch.setDescription("entity");
        accountEntitySearch.setPageSize(500);
        accountEntitySearch.setOffset(0);
        accountEntitySearch.setSortBy("name desc");
        return accountEntitySearch;
    }

    private AccountDetailType getAccountDetaialType() {

        AccountDetailType accountDetailType = AccountDetailType.builder().id("1").name("name").tableName("table")
                .fullyQualifiedName("abc/table").build();
        accountDetailType.setTenantId("default");
        return accountDetailType;
    }

    class AccountEntityResultExtractor implements ResultSetExtractor<List<Map<String, Object>>> {
        @Override
        public List<Map<String, Object>> extractData(ResultSet resultSet) throws SQLException, DataAccessException {
            List<Map<String, Object>> rows = new ArrayList<>();
            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<String, Object>() {
                    {
                        put("id", resultSet.getString("id"));
                        put("name", resultSet.getString("name"));
                        put("code", resultSet.getString("code"));
                        put("active", resultSet.getBoolean("active"));
                        put("accountDetailTypeId", resultSet.getString("accountDetailTypeId"));
                        put("createdBy", resultSet.getString("createdBy"));
                        put("createdDate", resultSet.getString("createdDate"));
                        put("lastModifiedBy", resultSet.getString("lastModifiedBy"));
                        put("lastModifiedDate", resultSet.getString("lastModifiedDate"));
                        put("description", resultSet.getString("description"));

                    }
                };

                rows.add(row);
            }
            return rows;
        }
    }
}