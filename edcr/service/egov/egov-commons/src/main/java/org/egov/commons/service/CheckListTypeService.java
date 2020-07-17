package org.egov.commons.service;

import java.util.List;

import org.egov.common.entity.bpa.ChecklistType;
import org.egov.commons.repository.CheckListTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CheckListTypeService {

	@Autowired
	private CheckListTypeRepository checkListTypeRepository;

	public List<ChecklistType> findAll() {
		return checkListTypeRepository.findAll();
	}

	public ChecklistType findByCode(String code) {
		return checkListTypeRepository.findByCode(code);
	}
}
