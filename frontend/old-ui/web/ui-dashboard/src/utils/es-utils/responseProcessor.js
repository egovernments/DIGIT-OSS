export const checkStatus = (res) => {
  if (res.status !== 200) {
    throw res;
  }
  return res;
};

export const processElasticResponse = (res, baseQueries) => {
  const { responses } = res.data;
  // const queryArr = finalQuery
  //   .split('\n')
  //   .filter((ele, index) => index % 2 !== 0)
  //   .map(ele => JSON.parse(ele));

  const parsedResponse = {};
  baseQueries.forEach((ele, index) => {
    const { query } = ele;
    const output = {};
    if (Object.hasOwnProperty.call(query, 'size')) {
      output.count = responses[index].hits.total;
      if (query.size > 0) output.elements = responses[index].hits.hits;
    }
    if (Object.hasOwnProperty.call(query, 'aggs')) {
      output.aggregations = responses[index].aggregations[Object.keys(query.aggs)[0]].buckets;
    }

    parsedResponse[ele.name] = output;
  });
  return parsedResponse;
};
