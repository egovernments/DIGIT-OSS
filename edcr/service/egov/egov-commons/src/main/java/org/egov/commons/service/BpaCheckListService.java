/*
 *    eGov  SmartCity eGovernance suite aims to improve the internal efficiency,transparency,
 *    accountability and the service delivery of the government  organizations.
 *
 *     Copyright (C) 2017  eGovernments Foundation
 *
 *     The updated version of eGov suite of products as by eGovernments Foundation
 *     is available at http://www.egovernments.org
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see http://www.gnu.org/licenses/ or
 *     http://www.gnu.org/licenses/gpl.html .
 *
 *     In addition to the terms of the GPL license to be adhered to in using this
 *     program, the following additional terms are to be complied with:
 *
 *         1) All versions of this program, verbatim or modified must carry this
 *            Legal Notice.
 *            Further, all user interfaces, including but not limited to citizen facing interfaces,
 *            Urban Local Bodies interfaces, dashboards, mobile applications, of the program and any
 *            derived works should carry eGovernments Foundation logo on the top right corner.
 *
 *            For the logo, please refer http://egovernments.org/html/logo/egov_logo.png.
 *            For any further queries on attribution, including queries on brand guidelines,
 *            please contact contact@egovernments.org
 *
 *         2) Any misrepresentation of the origin of the material is prohibited. It
 *            is required that all modified versions of this material be marked in
 *            reasonable ways as different from the original version.
 *
 *         3) This license does not grant any rights to any user of the program
 *            with regards to rights under trademark law for use of the trade names
 *            or trademarks of eGovernments Foundation.
 *
 *   In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 *
 */

package org.egov.commons.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.apache.commons.lang.StringUtils;
import org.egov.common.entity.bpa.Checklist;
import org.egov.common.entity.bpa.ChecklistType;
import org.egov.common.entity.bpa.SearchChecklist;
import org.egov.commons.repository.bpa.BpaCheckListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;

@Service
@Transactional(readOnly = true)
public class BpaCheckListService {

	@Autowired
    private BpaCheckListRepository bpaCheckListRepository;
	
	public List<Checklist> findAll(){
		return bpaCheckListRepository.findAll();	
	}
	
	public void validateCreateChecklists(final Checklist checkList, final BindingResult errors) {
		int i=0;
		for (Checklist checklist : checkList.getChecklistTemp()) {
			if (checkIsChecklistAlreadyEnter(checklist.getChecklistType(), checklist.getDescription())) {
				errors.rejectValue("checklistTemp[" + i + "]description", "msg.checklist.exists");
			}
			i++;
		}
	}
    
	public boolean checkIsChecklistAlreadyEnter(final ChecklistType checkListType ,final String description) {
		if (bpaCheckListRepository.findByChecklistTypeAndDescription(checkListType, description) != null)
			return true;
		else
			return false;
	}
	
    @Transactional
    public List<Checklist> save(final List<Checklist> checklists) {
    	 Random rand = new Random(); 
		for (Checklist checklist : checklists){
			checklist.setCode(StringUtils.substring(checklist.getChecklistType().getCode(), 0, 3).concat("-").concat(String.valueOf(rand.nextInt(100))));
		}
        return bpaCheckListRepository.save(checklists);
    }

    @Transactional
	public List<SearchChecklist> search(SearchChecklist searchRequest) {
		List<SearchChecklist> list = new ArrayList<>();
		List<Checklist> checklists =bpaCheckListRepository.findByChecklistType(searchRequest.getChecklistType());
		for(Checklist checklist : checklists){
			SearchChecklist result = new SearchChecklist();
			result.setChecklistType(checklist.getChecklistType());
			result.setDescription(checklist.getDescription());
			list.add(result);
		}
		return list;
	}
    
    public List<Checklist> findByChecklistType(ChecklistType checklistType){
    	return bpaCheckListRepository.findByChecklistType(checklistType);
    }

}