$(document)
    .ready(
        function () {

            $('#btnSearch').click(function() {
                var isValid = false;
                $('#buildingPlanScrutinyReport').find(':input',':select',':textarea').each(function() {
                    if($(this).val()) {
                        isValid =true;
                        return false;
                    } else
                        isValid =false;
                });
                if(isValid) {
                    callAjaxSearch();
                } else {
                    bootbox.alert("Please enter at least one input value to search");
                    return false;
                }
            });

            function callAjaxSearch() {
                $('.report-section').removeClass('display-hide');
                $("#planScrutinyId")
                    .dataTable(
                        {
                            processing: true,
                            serverSide: true,
                            sort: true,
                            filter: true,
                            "searching": false,
                            responsive: true,
                            "order": [[4, 'desc']],
                            ajax: {
                                url: "/edcr/reports/buildingplan-scrutinyreport",
                                type: "POST",
                                beforeSend: function () {
                                    $('.loader-class')
                                        .modal(
                                            'show',
                                            {
                                                backdrop: 'static'
                                            });
                                },
                                data: function (args) {
                                    return {
                                        "args": JSON.stringify(args),
                                        "buildingLicenceeType": $("#buildingLicenceeType").val(),
                                        "buildingLicenceeName": $("#buildingLicenceeName").val(),
                                        "bpaApplicationNumber": $("#bpaApplicationNumber").val(),
                                        "buildingPlanScrutinyNumber": $("#buildingPlanScrutinyNumber").val(),
                                        "fromDate": $("#fromDate").val(),
                                        "toDate": $("#toDate").val(),
                                        "status": $("#status").val()
                                    };
                                },
                                complete: function () {
                                    $('.loader-class').modal(
                                        'hide');
                                }
                            },
                            "bDestroy": true,
                            "sDom": "<'row'<'col-xs-12 hidden col-right'f>r>t<'row'<'col-xs-3'i><'col-xs-3 col-right'l><'col-xs-3 col-right'<'export-data'T>><'col-xs-3 text-right'p>>",
                            "oTableTools": {
                                "sSwfPath": "../../../../../../egi/resources/global/swf/copy_csv_xls_pdf.swf",
                                "aButtons": [
                                    {
                                        "sExtends": "pdf",
                                        "sPdfMessage": "",
                                        "sTitle": "Report for Building Plan Scrutiny",
                                        "sPdfOrientation": "landscape"
                                    },
                                    {
                                        "sExtends": "xls",
                                        "sPdfMessage": "Report for Building Plan Scrutiny",
                                        "sTitle": "Report for Building Plan Scrutiny"
                                    },
                                    {
                                        "sExtends": "print",
                                        "sTitle": "Report for Building Plan Scrutiny"
                                    }]
                            },
                            aaSorting: [],
                            columns: [
                                {
                                    "data": null,
                                    render: function (data, type, row, meta) {
                                        return meta.row
                                            + meta.settings._iDisplayStart
                                            + 1;
                                    },
                                    "sClass": "text-center"
                                },
                                {
                                    "data": "applicationNumber",
                                    "sClass": "text-left"
                                },
                                {
                                    "data": "applicantName",
                                    "sClass": "text-left"
                                },
                                {
                                    "data": null,
                                    "sClass": "text-left",
                                    "render": function (
                                            data, type,
                                            row, meta) {
                                            return row.buildingPlanScrutinyNumber ==='N/A' ? row.buildingPlanScrutinyNumber : '<a onclick="openPopup(\'/bpa/application/view/details/by-dcr-number/'
                                                + row.buildingPlanScrutinyNumber
                                                + '\')" href="javascript:void(0);">'
                                                + row.buildingPlanScrutinyNumber
                                                + '</a>';
                                        }
                                },

                                {
                                    "data": "uploadedDateAndTime",
                                    "sClass": "text-left",
                                    render: function (data) {
                                        return data.split("-").reverse().join("/");
                                    }
                                },
                                {
                                    "data": null,
                                    "sClass": "text-center",
                                    "render": function (
                                        data, type,
                                        row, meta) {
                                        return '<a href="/egi/downloadfile?fileStoreId='
                                            + row.dxfFileStoreId
                                            + '&moduleName=Digit DCR&toSave=true">'
                                            + row.dxfFileName
                                            + '</a>';
                                    }
                                },
                                {
                                    "data": null,
                                    "sClass": "text-center",
                                    "render": function (
                                        data, type,
                                        row, meta) {
                                        if (row.reportOutputFileStoreId != 'N/A') {
                                            return '<a href="/egi/downloadfile?fileStoreId='
                                                + row.reportOutputFileStoreId
                                                + '&moduleName=Digit DCR&toSave=true">'
                                                + row.reportOutputFileName
                                                + '</a>';
                                        }
                                        else {
                                            return "N/A";
                                        }
                                    }
                                },
                                {
                                    "data": "status",
                                    "sClass": "text-left"
                                },
                                {
                                    "data": "buildingLicenceeName",
                                    "sClass": "text-left"
                                }
                            ]
                        });
            }


            $("#buildingLicenceeType").change(function () {
                getLicenceeNameByType();
            });

            function getLicenceeNameByType() {
                $.ajax({
                    async: false,
                    crossDomain: true,
                    url: '/bpa/rest/getStakeHolderNameAndIdByType/' + $('#buildingLicenceeType').val(),
                    type: "GET",
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {
                        $('#buildingLicenceeName').html("");
                        $('#buildingLicenceeName').append("<option value=''>Select</option>");
                        console.log("success" + response);
                        $.each(response, function (index, value) {
                            $('#buildingLicenceeName').append($('<option>').text(value.name).attr('value', value.id));
                        });
                        $('#buildingLicenceeName').trigger('change');
                    },
                    error: function (response) {
                        console.log("Error occurred, while getting building licencee names from type !!!!!!!");
                        $('#buildingLicenceeName').html("");
                        $('#buildingLicenceeName').append("<option value=''>Select</option>");
                    }
                });
            }

        });

function openPopup(url) {
    window.open(url, 'window', 'scrollbars=yes,resizable=yes,height=700,width=800,status=yes');
}

function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}
