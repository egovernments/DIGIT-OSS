/*
 * package org.egov.egf.instrument.web.mapper; import static org.junit.Assert.assertEquals; import java.util.ArrayList; import
 * java.util.List; import org.egov.common.contract.request.User; import org.egov.egf.instrument.domain.model.InstrumentType;
 * import org.egov.egf.instrument.domain.model.InstrumentTypeProperty; import
 * org.egov.egf.instrument.domain.model.InstrumentTypeSearch; import org.egov.egf.instrument.domain.model.TransactionType; import
 * org.egov.egf.instrument.web.contract.InstrumentTypeContract; import
 * org.egov.egf.instrument.web.contract.InstrumentTypePropertyContract; import
 * org.egov.egf.instrument.web.contract.InstrumentTypeSearchContract; import
 * org.egov.egf.instrument.web.contract.TransactionTypeContract; import org.egov.egf.master.web.contract.FinancialStatusContract;
 * import org.junit.Before; import org.junit.Test; import org.junit.runner.RunWith; import org.mockito.InjectMocks; import
 * org.mockito.runners.MockitoJUnitRunner;
 * @RunWith(MockitoJUnitRunner.class) public class InstrumentTypeMapperTest {
 * @InjectMocks private InstrumentTypeMapper instrumentTypeMapper;
 * @Before public void setup() { instrumentTypeMapper = new InstrumentTypeMapper(); }
 * @Test public void test_to_domain() { InstrumentType expectedDomain = instrumentTypeMapper.toDomain(contract());
 * assertEquals(expectedDomain.getId(), domain().getId()); assertEquals(expectedDomain.getActive(), domain().getActive());
 * assertEquals(expectedDomain.getDescription(), domain().getDescription()); assertEquals(expectedDomain.getName(),
 * domain().getName()); assertEquals(expectedDomain.getInstrumentTypeProperties().get(0).getId(),
 * domain().getInstrumentTypeProperties().get(0).getId());
 * assertEquals(expectedDomain.getInstrumentTypeProperties().get(0).getReconciledOncreate(),
 * domain().getInstrumentTypeProperties().get(0).getReconciledOncreate());
 * assertEquals(expectedDomain.getInstrumentTypeProperties().get(0).getStatusOnCreate().getCode(),
 * domain().getInstrumentTypeProperties().get(0).getStatusOnCreate().getCode());
 * assertEquals(expectedDomain.getInstrumentTypeProperties().get(0).getStatusOnReconcile().getCode(),
 * domain().getInstrumentTypeProperties().get(0).getStatusOnReconcile().getCode());
 * assertEquals(expectedDomain.getInstrumentTypeProperties().get(0).getStatusOnUpdate().getCode(),
 * domain().getInstrumentTypeProperties().get(0).getStatusOnUpdate().getCode());
 * assertEquals(expectedDomain.getInstrumentTypeProperties().get(0).getTransactionType(),
 * domain().getInstrumentTypeProperties().get(0).getTransactionType()); assertEquals(expectedDomain.getCreatedBy().getId(),
 * domain().getCreatedBy().getId()); assertEquals(expectedDomain.getLastModifiedBy().getId(),
 * domain().getLastModifiedBy().getId()); assertEquals(expectedDomain.getTenantId(), domain().getTenantId()); }
 * @Test public void test_to_contract() { InstrumentTypeContract expectedContract = instrumentTypeMapper.toContract(domain());
 * assertEquals(expectedContract.getId(), contract().getId()); assertEquals(expectedContract.getActive(), contract().getActive());
 * assertEquals(expectedContract.getDescription(), contract().getDescription()); assertEquals(expectedContract.getName(),
 * contract().getName()); assertEquals(expectedContract.getInstrumentTypeProperties().get(0).getId(),
 * contract().getInstrumentTypeProperties().get(0).getId());
 * assertEquals(expectedContract.getInstrumentTypeProperties().get(0).getReconciledOncreate(),
 * contract().getInstrumentTypeProperties().get(0).getReconciledOncreate());
 * assertEquals(expectedContract.getInstrumentTypeProperties().get(0).getStatusOnCreate().getCode(),
 * contract().getInstrumentTypeProperties().get(0).getStatusOnCreate().getCode());
 * assertEquals(expectedContract.getInstrumentTypeProperties().get(0).getStatusOnReconcile().getCode(),
 * contract().getInstrumentTypeProperties().get(0).getStatusOnReconcile().getCode());
 * assertEquals(expectedContract.getInstrumentTypeProperties().get(0).getStatusOnUpdate().getCode(),
 * contract().getInstrumentTypeProperties().get(0).getStatusOnUpdate().getCode());
 * assertEquals(expectedContract.getInstrumentTypeProperties().get(0).getTransactionType(),
 * contract().getInstrumentTypeProperties().get(0).getTransactionType()); assertEquals(expectedContract.getCreatedBy().getId(),
 * contract().getCreatedBy().getId()); assertEquals(expectedContract.getLastModifiedBy().getId(),
 * contract().getLastModifiedBy().getId()); assertEquals(expectedContract.getTenantId(), contract().getTenantId()); }
 * @Test public void test_to_search_domain() { InstrumentTypeSearch expectedSearchDomain =
 * instrumentTypeMapper.toSearchDomain(searchContract()); assertEquals(expectedSearchDomain.getId(), searchDomain().getId());
 * assertEquals(expectedSearchDomain.getActive(), searchDomain().getActive()); assertEquals(expectedSearchDomain.getDescription(),
 * searchDomain().getDescription()); assertEquals(expectedSearchDomain.getName(), searchDomain().getName());
 * assertEquals(expectedSearchDomain.getInstrumentTypeProperties().get(0).getId(),
 * searchDomain().getInstrumentTypeProperties().get(0).getId());
 * assertEquals(expectedSearchDomain.getInstrumentTypeProperties().get(0).getReconciledOncreate(),
 * searchDomain().getInstrumentTypeProperties().get(0).getReconciledOncreate());
 * assertEquals(expectedSearchDomain.getInstrumentTypeProperties().get(0).getStatusOnCreate().getCode(),
 * searchDomain().getInstrumentTypeProperties().get(0).getStatusOnCreate().getCode());
 * assertEquals(expectedSearchDomain.getInstrumentTypeProperties().get(0).getStatusOnReconcile().getCode(),
 * searchDomain().getInstrumentTypeProperties().get(0).getStatusOnReconcile().getCode());
 * assertEquals(expectedSearchDomain.getInstrumentTypeProperties().get(0).getStatusOnUpdate().getCode(),
 * searchDomain().getInstrumentTypeProperties().get(0).getStatusOnUpdate().getCode());
 * assertEquals(expectedSearchDomain.getInstrumentTypeProperties().get(0).getTransactionType(),
 * searchDomain().getInstrumentTypeProperties().get(0).getTransactionType());
 * assertEquals(expectedSearchDomain.getCreatedBy().getId(), searchDomain().getCreatedBy().getId());
 * assertEquals(expectedSearchDomain.getLastModifiedBy().getId(), searchDomain().getLastModifiedBy().getId());
 * assertEquals(expectedSearchDomain.getTenantId(), searchDomain().getTenantId());
 * assertEquals(expectedSearchDomain.getPageSize(), searchDomain().getPageSize()); assertEquals(expectedSearchDomain.getOffset(),
 * searchDomain().getOffset()); }
 * @Test public void test_to_search_contract() { InstrumentTypeSearchContract expectedSearchContract =
 * instrumentTypeMapper.toSearchContract(searchDomain()); assertEquals(expectedSearchContract.getId(), searchContract().getId());
 * assertEquals(expectedSearchContract.getActive(), searchContract().getActive());
 * assertEquals(expectedSearchContract.getDescription(), searchContract().getDescription());
 * assertEquals(expectedSearchContract.getName(), searchContract().getName());
 * assertEquals(expectedSearchContract.getInstrumentTypeProperties().get(0).getId(),
 * searchContract().getInstrumentTypeProperties().get(0).getId());
 * assertEquals(expectedSearchContract.getInstrumentTypeProperties().get(0).getReconciledOncreate(),
 * searchContract().getInstrumentTypeProperties().get(0).getReconciledOncreate());
 * assertEquals(expectedSearchContract.getInstrumentTypeProperties().get(0).getStatusOnCreate().getCode(),
 * searchContract().getInstrumentTypeProperties().get(0).getStatusOnCreate().getCode());
 * assertEquals(expectedSearchContract.getInstrumentTypeProperties().get(0).getStatusOnReconcile().getCode(),
 * searchContract().getInstrumentTypeProperties().get(0).getStatusOnReconcile().getCode());
 * assertEquals(expectedSearchContract.getInstrumentTypeProperties().get(0).getStatusOnUpdate().getCode(),
 * searchContract().getInstrumentTypeProperties().get(0).getStatusOnUpdate().getCode());
 * assertEquals(expectedSearchContract.getInstrumentTypeProperties().get(0).getTransactionType(),
 * searchContract().getInstrumentTypeProperties().get(0).getTransactionType());
 * assertEquals(expectedSearchContract.getCreatedBy().getId(), searchContract().getCreatedBy().getId());
 * assertEquals(expectedSearchContract.getLastModifiedBy().getId(), searchContract().getLastModifiedBy().getId());
 * assertEquals(expectedSearchContract.getTenantId(), searchContract().getTenantId());
 * assertEquals(expectedSearchContract.getPageSize(), searchContract().getPageSize());
 * assertEquals(expectedSearchContract.getOffset(), searchContract().getOffset()); } public InstrumentType domain() {
 * InstrumentType instrumentType = new InstrumentType(); instrumentType.setId("id"); instrumentType.setActive(true);
 * instrumentType.setDescription("description"); instrumentType.setName("name"); List<InstrumentTypeProperty>
 * instrumentTypeProperties = new ArrayList<>();
 * instrumentTypeProperties.add(InstrumentTypeProperty.builder().id("id").reconciledOncreate(true)
 * .statusOnCreate(FinancialStatusContract.builder().code("Create").build())
 * .statusOnReconcile(FinancialStatusContract.builder().code("Reconcile").build())
 * .statusOnUpdate(FinancialStatusContract.builder().code("Update").build()) .transactionType(TransactionType.Credit).build());
 * instrumentType.setInstrumentTypeProperties(instrumentTypeProperties);
 * instrumentType.setCreatedBy(User.builder().id(1l).build()); instrumentType.setLastModifiedBy(User.builder().id(1l).build());
 * instrumentType.setTenantId("tenantId"); return instrumentType; } public InstrumentTypeContract contract() {
 * InstrumentTypeContract contract = new InstrumentTypeContract(); contract.setId("id"); contract.setActive(true);
 * contract.setDescription("description"); contract.setName("name"); List<InstrumentTypePropertyContract> instrumentTypeProperties
 * = new ArrayList<>(); instrumentTypeProperties.add(InstrumentTypePropertyContract.builder().id("id").reconciledOncreate(true)
 * .statusOnCreate(FinancialStatusContract.builder().code("Create").build())
 * .statusOnReconcile(FinancialStatusContract.builder().code("Reconcile").build())
 * .statusOnUpdate(FinancialStatusContract.builder().code("Update").build())
 * .transactionType(TransactionTypeContract.Credit).build()); contract.setInstrumentTypeProperties(instrumentTypeProperties);
 * contract.setCreatedBy(User.builder().id(1l).build()); contract.setLastModifiedBy(User.builder().id(1l).build());
 * contract.setTenantId("tenantId"); return contract; } public InstrumentTypeSearch searchDomain() { InstrumentTypeSearch
 * instrumentTypeSearch = new InstrumentTypeSearch(); instrumentTypeSearch.setId("id"); instrumentTypeSearch.setActive(true);
 * instrumentTypeSearch.setDescription("description"); instrumentTypeSearch.setName("name"); List<InstrumentTypeProperty>
 * instrumentTypeProperties = new ArrayList<>();
 * instrumentTypeProperties.add(InstrumentTypeProperty.builder().id("id").reconciledOncreate(true)
 * .statusOnCreate(FinancialStatusContract.builder().code("Create").build())
 * .statusOnReconcile(FinancialStatusContract.builder().code("Reconcile").build())
 * .statusOnUpdate(FinancialStatusContract.builder().code("Update").build()) .transactionType(TransactionType.Credit).build());
 * instrumentTypeSearch.setInstrumentTypeProperties(instrumentTypeProperties);
 * instrumentTypeSearch.setCreatedBy(User.builder().id(1l).build());
 * instrumentTypeSearch.setLastModifiedBy(User.builder().id(1l).build()); instrumentTypeSearch.setTenantId("tenantId");
 * instrumentTypeSearch.setPageSize(1); instrumentTypeSearch.setOffset(1); return instrumentTypeSearch; } public
 * InstrumentTypeSearchContract searchContract() { InstrumentTypeSearchContract contract = new InstrumentTypeSearchContract();
 * contract.setId("id"); contract.setActive(true); contract.setDescription("description"); contract.setName("name");
 * List<InstrumentTypePropertyContract> instrumentTypeProperties = new ArrayList<>();
 * instrumentTypeProperties.add(InstrumentTypePropertyContract.builder().id("id").reconciledOncreate(true)
 * .statusOnCreate(FinancialStatusContract.builder().code("Create").build())
 * .statusOnReconcile(FinancialStatusContract.builder().code("Reconcile").build())
 * .statusOnUpdate(FinancialStatusContract.builder().code("Update").build())
 * .transactionType(TransactionTypeContract.Credit).build()); contract.setInstrumentTypeProperties(instrumentTypeProperties);
 * contract.setCreatedBy(User.builder().id(1l).build()); contract.setLastModifiedBy(User.builder().id(1l).build());
 * contract.setTenantId("tenantId"); contract.setPageSize(1); contract.setOffset(1); return contract; } }
 */