package org.egov.enc.repository;

import org.egov.enc.models.AsymmetricKey;
import org.egov.enc.models.SymmetricKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class KeyRepository {

    private JdbcTemplate jdbcTemplate;

    private static final String selectSymmetricKeyQuery = "SELECT * FROM eg_enc_symmetric_keys";
    private static final String selectAsymmetricKeyQuery = "SELECT * FROM eg_enc_asymmetric_keys";

    private static final String insertSymmetricKeyQuery = "INSERT INTO eg_enc_symmetric_keys (key_id, secret_key, " +
            "initial_vector, active, tenant_id) VALUES (? ,?, ?, ?, ?)";
    private static final String insertAsymmetricKeyQuery = "INSERT INTO eg_enc_asymmetric_keys (key_id, public_key, " +
            "private_key, active, tenant_id) VALUES (? ,?, ?, ?, ?)";

    private static final String deactivateSymmetricKeyQuery = "UPDATE eg_enc_symmetric_keys SET active='false'";
    private static final String deactivateAsymmetricKeyQuery = "UPDATE eg_enc_asymmetric_keys SET active='false'";

    private static final String deactivateSymmetricKeyForGivenTenantQuery = "UPDATE eg_enc_symmetric_keys SET " +
            "active='false' WHERE active='true' AND tenant_id=?";
    private static final String deactivateAsymmetricKeyForGivenTenantQuery = "UPDATE eg_enc_asymmetric_keys SET " +
            "active='false' WHERE active='true' AND tenant_id=?";

    private static final String distinctTenantIdsQuery = "SELECT DISTINCT tenant_id FROM eg_enc_symmetric_keys WHERE active='true'";


    @Autowired
    public KeyRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int insertSymmetricKey(SymmetricKey symmetricKey) {
        return jdbcTemplate.update(insertSymmetricKeyQuery,
                symmetricKey.getKeyId(),
                symmetricKey.getSecretKey(),
                symmetricKey.getInitialVector(),
                symmetricKey.isActive(),
                symmetricKey.getTenantId()
        );
    }

    public int insertAsymmetricKey(AsymmetricKey asymmetricKey) {
        return jdbcTemplate.update(insertAsymmetricKeyQuery,
                asymmetricKey.getKeyId(),
                asymmetricKey.getPublicKey(),
                asymmetricKey.getPrivateKey(),
                asymmetricKey.isActive(),
                asymmetricKey.getTenantId()
        );
    }

    public int deactivateSymmetricKeyForGivenTenant(String tenantId) {
        return jdbcTemplate.update(deactivateSymmetricKeyForGivenTenantQuery, tenantId);
    }

    public int deactivateAsymmetricKeyForGivenTenant(String tenantId) {
        return jdbcTemplate.update(deactivateAsymmetricKeyForGivenTenantQuery, tenantId);
    }

    public int deactivateSymmetricKeys() {
        return jdbcTemplate.update(deactivateSymmetricKeyQuery);
    }

    public int deactivateAsymmetricKeys() {
        return jdbcTemplate.update(deactivateAsymmetricKeyQuery);
    }

    public List<SymmetricKey> fetchSymmetricKeys() {
        return jdbcTemplate.query(selectSymmetricKeyQuery, new BeanPropertyRowMapper<>(SymmetricKey.class));
    }

    public List<AsymmetricKey> fetchAsymmtericKeys() {
        return jdbcTemplate.query(selectAsymmetricKeyQuery, new BeanPropertyRowMapper<>(AsymmetricKey.class));
    }

    public List<String> fetchDistinctTenantIds() {
        return jdbcTemplate.queryForList(distinctTenantIdsQuery, String.class);
    }

}
