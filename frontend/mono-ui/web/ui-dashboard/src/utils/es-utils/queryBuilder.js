import ndjson from 'ndjson';
import cloneDeep from 'lodash/cloneDeep';
import { COMPLAINT_IDX_QRY } from '../../constants/queries';

const buildMultiSearchQuery = (query) => {
  let finalQuery = '';
  const serialize = ndjson.serialize();
  serialize.on('data', (line) => {
    finalQuery += line;
  });

  query.forEach((item) => {
    serialize.write(COMPLAINT_IDX_QRY);
    serialize.write(item);
  });
  serialize.end();
  return finalQuery;
};

export const buildFilterQuery = query => buildMultiSearchQuery(query.map(ele => ele.query));

export const buildDashboardQuery = (baseQuery, constraints) => {
  const finalFilter = [];
  const baseQueryObj = cloneDeep(baseQuery);

  Object.keys(constraints).forEach((item) => {
    if (constraints[item]) {
      finalFilter.push({
        match: {
          [item]: constraints[item],
        },
      });
    }
  });

  const finalQuery = baseQuery.map((item, index) => {
    if (finalFilter.length > 0) {
      if (!Object.prototype.hasOwnProperty.call(item.query, 'query')) {
        baseQueryObj[index].query.query = {
          bool: {
            must: [],
          },
        };
      }

      baseQueryObj[index].query.query.bool.must = baseQueryObj[index].query.query.bool.must.concat(finalFilter);
    }
    return baseQueryObj[index].query;
  });
  return buildMultiSearchQuery(finalQuery);
};
