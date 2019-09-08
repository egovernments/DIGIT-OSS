package org.egov.persistence.repository;

import org.egov.persistence.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageJpaRepository extends JpaRepository<Message, Long> {
	@Query("select m from Message m where m.tenantId = :tenantId and m.locale = :locale")
	List<Message> find(@Param("tenantId") String tenantId, @Param("locale") String locale);

	@Query("select m from Message m where m.tenantId = :tenantId and m.locale = :locale and m.module = :module")
	List<Message> find(@Param("tenantId") String tenantId, @Param("locale") String locale,
			@Param("module") String module);

	@Query("select m from Message m where m.tenantId = :tenantId and m.locale = :locale and m.module = :module and m.code in :codes")
	List<Message> find(@Param("tenantId") String tenantId, @Param("locale") String locale,
			@Param("module") String module, @Param("codes") List<String> codes);

	@Query("select m.id from Message m where m.tenantId = :tenantId and m.locale = :locale and m.module = :module and m.code = :code)")
	List<Message> find(@Param("tenantId") String tenantId, @Param("locale") String locale,
			@Param("module") String module, @Param("code") String code);
}
