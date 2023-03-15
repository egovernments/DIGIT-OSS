class Workbook {
    constructor() {
        if (!(this instanceof Workbook))
            return new Workbook();
        this.SheetNames = [];
        this.Sheets = {};
    }
}

const download = (url, name) => {
    var a = window.document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click(); // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    document.body.removeChild(a);
}


function s2ab(s) {
    const buf = new ArrayBuffer(s.length)

    const view = new Uint8Array(buf)

    for (let i = 0; i !== s.length; ++i)
        view[i] = s.charCodeAt(i) & 0xFF

    return buf
}

export default (data, name, needseprate) => {
    let sname = name.length > 30 ? name.substring(0, 28) + "..." : name 
    import ('xlsx').then(XLSX => {
        const wb = new Workbook()
        let ws = null;
        if (!needseprate) {
            ws = XLSX.utils.json_to_sheet(data)

            wb.SheetNames.push(sname || '')
            wb.Sheets[sname || ''] = ws
        } else {
            for (var i = 0; i < Object.keys(data).length; i++) {
                ws = XLSX.utils.json_to_sheet(data[Object.keys(data)[i]])
                wb.SheetNames.push(Object.keys(data)[i])
                wb.Sheets[Object.keys(data)[i]] = ws
            }
        }

        const wbout = XLSX.write(wb, {
            bookType: 'xlsx',
            bookSST: true,
            type: 'binary'
        })


        let url = window.URL.createObjectURL(new Blob([s2ab(wbout)], {
            type: 'application/octet-stream'
        }))

        download(url, `${sname}.xlsx`)
    })
}