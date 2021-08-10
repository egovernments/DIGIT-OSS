package org.egov.edcr.repository.es;

import org.egov.edcr.entity.es.EdcrIndex;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EdcrIndexRepository extends ElasticsearchRepository<EdcrIndex, String> {

}
