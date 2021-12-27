const fetch = require('node-fetch');
const config = require('../../../env-variables');

async function getQuery(query, variables, operationName = null) {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
    headers: {
      'x-hasura-admin-secret': config.hasuraAdminSecret,
    },
  };

  const response = await fetch(config.hasuraUrl, options);
  const data = await response.json();

  return data.data;
}

module.exports = { getQuery };
