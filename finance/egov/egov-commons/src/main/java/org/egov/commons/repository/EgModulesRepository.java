package org.egov.commons.repository;

import java.util.List;

import org.egov.commons.EgModules;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
@Repository
public interface EgModulesRepository extends JpaRepository<EgModules, Integer>{
    @Query(value = "SELECT egm FROM EgModules egm where egm.name=:name")
    List<EgModules> findEgModulesByName(@Param("name") String name);
}
