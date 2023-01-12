const useQueryParams = () => {
  const queryString = window.location.search;
  console.log("queryString", queryString);
  const urlParams = new URLSearchParams(queryString);
  const params = {};
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

export default useQueryParams;
