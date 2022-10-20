package org.egov.land.abm.repo;

import org.egov.land.abm.newservices.entity.NewServiceInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewServiceInfoRepo extends JpaRepository<NewServiceInfo, Long> {

}
