export const formatChartData = data =>
  data.map(item => ({
    name: item.key,
    value: item.doc_count,
  }));

export const calcSlaBreachPerc = (slaBreached, openComplaints) => {
  const withinSla = openComplaints - slaBreached;
  if (withinSla > 0) {
    const perc = slaBreached / withinSla;
    return `${(perc * 100).toFixed(2)}%`;
  }
  return '-';
};

export const formatComplaintsOpenClosed = (data) => {
  const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const finalData = {};
  data.forEach((element) => {
    const temp = element.by_date_range.buckets
      .slice(element.by_date_range.buckets.length - 5)
      .map(item => ({
        month: MONTH_NAMES[new Date(item.key_as_string).getMonth()],
        [element.key_as_string === 'true' ? 'closed' : 'open']: item.doc_count,
      }));

    if (element.key_as_string === 'true') finalData.closed = temp;
    else finalData.open = temp;
  });

  return finalData;
};

export const extractUniqItems = items => items.map(item => item.key);
