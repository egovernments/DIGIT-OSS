const useQueryParams = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const params = {};
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

export default useQueryParams;
