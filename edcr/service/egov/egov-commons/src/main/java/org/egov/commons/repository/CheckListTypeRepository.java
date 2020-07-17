package org.egov.commons.repository;

import java.util.List;

import org.egov.common.entity.bpa.ChecklistType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CheckListTypeRepository extends JpaRepository<ChecklistType, Long> {
	
	List<ChecklistType> findAll();
	
	ChecklistType findByCode(String code);
}
