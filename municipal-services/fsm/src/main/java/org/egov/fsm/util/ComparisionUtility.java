package org.egov.fsm.util;

import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.fsm.web.model.FSMAudit;
import org.springframework.stereotype.Component;

import com.cedarsoftware.util.GraphComparator;

@Component
public class ComparisionUtility {
	public List<FSMAudit> compareData(FSMAuditUtil fsm, List<FSMAuditUtil> auditList) {
		FSMAuditUtil source = fsm;
		List<FSMAudit> auditDataList = new LinkedList<FSMAudit>();
		auditDataList.add(prepareFSMInfo(fsm));
		for (FSMAuditUtil target : auditList) {
			List<GraphComparator.Delta> deltas = GraphComparator.compare(target, source, new GraphComparator.ID() {
				@Override
				public Object getId(Object o) {
					return "id";
				}
			});
			auditDataList.add(prepareAuditInfo(deltas, source.getModifiedBy(), source.getModifiedTime()));
			source = target;
		}
		return auditDataList;
	}

	public FSMAudit prepareAuditInfo(List<GraphComparator.Delta> deltas, String name, Long time) {
		FSMAudit audit = new FSMAudit();
		audit.setWho(name);
		audit.setWhen(time);
		Map<String, Object> dataChangeMap = new LinkedHashMap<>(0);
		deltas.forEach(delta -> {
			dataChangeMap.put(delta.getFieldName(), delta.getTargetValue());
		});
		audit.setWhat(dataChangeMap);
		return audit;
	}
	
	public FSMAudit prepareFSMInfo(FSMAuditUtil fsm) {
		FSMAudit audit = new FSMAudit();
		Map<String, Object> fsmMap = new LinkedHashMap<>(0);
		fsmMap.put("fsmApplicationId", fsm.getId());
		audit.setWho(fsm.getCreatedBy());
		audit.setWhen(fsm.getCreatedTime());
		audit.setWhat(fsmMap);
		return audit;
	}

}
