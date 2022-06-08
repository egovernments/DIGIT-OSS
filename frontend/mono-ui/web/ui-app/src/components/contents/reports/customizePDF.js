const roundTotal = total => {
  return Math.round(total * 100) / 100;
};

const prepareBody = resultData => {
  const headers = {
    fila_0: {
      col_1: { text: 'Dumping Ground Name', style: 'tableHeader', rowSpan: 2, alignment: 'center', margin: [0, 8, 0, 0], bold: true },
      col_2: { text: 'Date', style: 'tableHeader', rowSpan: 2, alignment: 'center', margin: [0, 8, 0, 0], bold: true },
      col_3: { text: 'Waste Types', style: 'tableHeader', colSpan: 2, alignment: 'center', bold: true },
    },
    fila_1: {
      col_1: { text: '', style: 'tableHeader', alignment: 'center' },
      col_2: { text: '', style: 'tableHeader', alignment: 'center' },
      col_3: { text: 'Wet Waste', style: 'tableHeader', alignment: 'center', bold: true },
      col_4: { text: 'Dry Waste', style: 'tableHeader', alignment: 'center', bold: true },
    },
  };

  const body = [];

  for (let key in headers) {
    if (headers.hasOwnProperty(key)) {
      const header = headers[key];
      const row = [];
      row.push(header.col_1);
      row.push(header.col_2);
      row.push(header.col_3);
      row.push(header.col_4);
      body.push(row);
    }
  }

  resultData.forEach(resultRow => {
    const transformedResultRow = resultRow.slice(0, resultRow.length - 1).map((element, index) => {
      return { text: element, alignment: index == 0 ? 'left' : 'center' };
    });
    body.push(transformedResultRow);
  });

  const finalRow = [];

  const wetWasteTotal = resultData.reduce((total, resultRow) => {
    return total + parseFloat(resultRow[2]);
  }, 0);

  const dryWasteTotal = resultData.reduce((total, resultRow) => {
    return total + parseFloat(resultRow[3]);
  }, 0);

  finalRow.push({ text: 'Total', colSpan: 2, alignment: 'center' });
  finalRow.push('');
  finalRow.push({ text: roundTotal(wetWasteTotal), alignment: 'center' });
  finalRow.push({ text: roundTotal(dryWasteTotal), alignment: 'center' });

  body.push(finalRow);

  return body;
};

export const customizePdfPrint = (doc, ulbname, logoBase64, headerLogo, waste = 'Dump, Process', reportResult) => {
  //Remove the title created by datatTables
  doc.content.splice(0, 1);

  if (waste == 'false') {
    waste = 'Dump';
  } else if (waste == 'true') {
    waste = 'Process';
  }

  doc['content'] = [
    {
      table: {
        widths: ['auto', '*', 'auto'],
        body: [
          [
            { image: logoBase64, height: 75, width: 75 },
            {
              alignment: 'center',
              stack: [
                { margin: [0, 10, 0, 0], fontSize: 14, bold: true, text: ulbname },
                { margin: [0, 10, 0, 0], fontSize: 14, bold: true, text: 'Solid Waste Management Department' },
              ],
            },
            { alignment: 'right', image: headerLogo, height: 75, width: 75 },
          ],
        ],
      },
      layout: {
        hLineWidth: function() {
          return 0.5;
        },
        vLineWidth: function() {
          return 0.5;
        },
        paddingBottom: function() {
          return 10;
        },
        paddingLeft: function() {
          return 10;
        },
        paddingRight: function() {
          return 10;
        },
        paddingTop: function() {
          return 10;
        },
      },
    },
    { margin: [0, 10, 0, 10], text: [{ text: 'Waste : ', bold: true }, waste] },
    { table: { widths: ['40%', '20%', '10%', '10%'], headerRows: 2, body: prepareBody(reportResult.reportData) } },
    { text: 'Chief Officer', alignment: 'right', bold: true, fontSize: 16, margin: [0, 100, 50, 0] },
    { text: ulbname, alignment: 'right', bold: true, fontSize: 16, margin: [0, 20, 50, 0] },
  ];

  doc['styles'] = {
    header: { fontSize: 28, bold: true },
    bold: { bold: true },
    small: { fontSize: 8 },
  };
};
