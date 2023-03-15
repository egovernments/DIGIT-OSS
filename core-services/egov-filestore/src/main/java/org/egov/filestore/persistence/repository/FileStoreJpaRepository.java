package org.egov.filestore.persistence.repository;

import org.egov.filestore.persistence.entity.Artifact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileStoreJpaRepository extends JpaRepository<Artifact, Long> {
	Artifact findByFileStoreIdAndTenantId(String fileStoreId, String tenantId);

	List<Artifact> findByTagAndTenantId(String tag, String tenantId);
	
	@Query(value = "SELECT * FROM eg_filestoremap T WHERE T.tenantId = (?1) AND T.fileStoreId IN (?2)",nativeQuery = true)
	List<Artifact> findByTenantIdAndFileStoreIdList(String tenantId, List<String> fileStoreIds);
	
	
	//value = "SELECT * FROM table WHERE property=(?1)", nativeQuery = true
}
