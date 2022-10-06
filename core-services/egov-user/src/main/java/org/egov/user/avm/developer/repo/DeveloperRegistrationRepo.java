package org.egov.user.avm.developer.repo;


import org.egov.user.avm.developer.entity.DeveloperRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeveloperRegistrationRepo extends JpaRepository<DeveloperRegistration, Long>{

	public boolean existsById(Long id);
	public DeveloperRegistration findById(Long id);
}
