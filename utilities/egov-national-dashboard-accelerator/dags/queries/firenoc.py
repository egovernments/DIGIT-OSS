
import logging
def extract_firenoc_bundle_metrics(metrics, region_bucket):
    department_agg = region_bucket.get('department')
    department_buckets = department_agg.get('buckets')

    actualNOCIssued = { 'groupBy' : 'department', 'buckets' : []}
    provisionalNOCIssued = { 'groupBy' : 'department', 'buckets' : []}
    slaComplianceProvisional = { 'groupBy' : 'department', 'buckets' : []}
    slaComplianceActual = { 'groupBy' : 'department', 'buckets' : []}
    avgDaysToIssueActualNOC = { 'groupBy' : 'department', 'buckets' : []}
    avgDaysToIssueProvisionalNOC = { 'groupBy' : 'department', 'buckets' : []}
    todaysApplications = { 'groupBy' : 'department', 'buckets' : []}


    for department_bucket in department_buckets:
        val = 0
        department_name = department_bucket.get('key')
        actualNOCIssued['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('actualNOCIssued').get('actualNOCIssued').get('value') if department_bucket.get('actualNOCIssued') else 0})
        provisionalNOCIssued['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('provisionalNOCIssued').get('provisionalNOCIssued').get('value') if department_bucket.get('provisionalNOCIssued') else 0})
        slaComplianceProvisional['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('slaComplianceProvisional').get('slaComplianceProvisional').get('value') if department_bucket.get('slaComplianceProvisional') else 0})
        slaComplianceActual['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('slaComplianceActual').get('slaComplianceActual').get('value') if department_bucket.get('slaComplianceActual') else 0})
        val = 0 if  department_bucket.get('avgDaysToIssueActualNOC').get('avgDaysToIssueActualNOC').get('value') == None else department_bucket.get('avgDaysToIssueActualNOC').get('avgDaysToIssueActualNOC').get('value')
        avgDaysToIssueActualNOC['buckets'].append( { 'name' : department_name, 'value' : val if department_bucket.get('avgDaysToIssueActualNOC') else 0})
        val = 0 if  department_bucket.get('avgDaysToIssueProvisionalNOC').get('avgDaysToIssueProvisionalNOC').get('value') == None else department_bucket.get('avgDaysToIssueProvisionalNOC').get('avgDaysToIssueProvisionalNOC').get('value')
        avgDaysToIssueProvisionalNOC['buckets'].append( { 'name' : department_name, 'value' : val if department_bucket.get('avgDaysToIssueProvisionalNOC') else 0})
        todaysApplications['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('todaysApplications').get('value') if department_bucket.get('todaysApplications') else 0})



    if metrics['actualNOCIssued'] and len(metrics['actualNOCIssued']) > 0:
        metrics['actualNOCIssued'].append(actualNOCIssued)
    else:
        metrics['actualNOCIssued'] = [actualNOCIssued]

    if metrics['provisionalNOCIssued'] and len(metrics['provisionalNOCIssued']) > 0:
        metrics['provisionalNOCIssued'].append(provisionalNOCIssued)
    else:
        metrics['provisionalNOCIssued'] = [provisionalNOCIssued]

    if metrics['slaComplianceActual'] and len(metrics['slaComplianceActual']) > 0:
        metrics['slaComplianceActual'].append(slaComplianceActual)
    else:
        metrics['slaComplianceActual'] = [slaComplianceActual]

    if metrics['slaComplianceProvisional'] and len(metrics['slaComplianceProvisional']) > 0:
        metrics['slaComplianceProvisional'].append(slaComplianceProvisional)
    else:
        metrics['slaComplianceProvisional'] = [slaComplianceProvisional]

    if metrics['avgDaysToIssueActualNOC'] and len(metrics['avgDaysToIssueActualNOC']) > 0:
        metrics['avgDaysToIssueActualNOC'].append(avgDaysToIssueActualNOC)
    else:
        metrics['avgDaysToIssueActualNOC'] = [avgDaysToIssueActualNOC]

    if metrics['avgDaysToIssueProvisionalNOC'] and len(metrics['avgDaysToIssueProvisionalNOC']) > 0:
        metrics['avgDaysToIssueProvisionalNOC'].append(avgDaysToIssueProvisionalNOC)
    else:
        metrics['avgDaysToIssueProvisionalNOC'] = [avgDaysToIssueProvisionalNOC]

    if metrics['todaysApplications'] and len(metrics['todaysApplications']) > 0:
        metrics['todaysApplications'].append(todaysApplications)
    else:
        metrics['todaysApplications'] = [todaysApplications]



    return metrics

firenoc_bundle_metrics = {
    'path': 'firenoc-services/_search',
    'name': 'firenoc_bundle_metrics',
    'lambda': extract_firenoc_bundle_metrics,
    'query': """
   
    {{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "term": {{
            "Data.tenantId.keyword": "pb.testing"
          }}
        }}
      ],
      "must": [
        {{
          "range": {{
            "Data.@timestamp": {{
              "gte": {0},
              "lte": {1},
              "format": "epoch_millis"
            }}
          }}
        }}
      ]
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "Data.ward.name.keyword",
        "size":10000
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "Data.tenantId.keyword",
            "size":10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "Data.tenantData.city.districtName.keyword",
                "size":10000
              }},
              "aggs": {{
                "department": {{
                  "terms": {{
                    "field": "Data.Department.keyword"
                  }},
                  "aggs": {{
                    "todaysApplications": {{
                      "value_count": {{
                        "field": "Data.fireNOCDetails.applicationNumber.keyword"
                      }}
                    }},
                    "provisionalNOCIssued": {{
                      "filter": {{
                        "bool": {{
                          "must": [
                            {{
                              "term": {{
                                "Data.fireNOCDetails.fireNOCType.keyword": "PROVISIONAL"
                              }}
                            }}
                          ]
                        }}
                      }},
                      "aggs": {{
                        "provisionalNOCIssued": {{
                          "value_count": {{
                            "field": "Data.fireNOCDetails.applicationNumber.keyword"
                          }}
                        }}
                      }}
                    }},
                    "actualNOCIssued": {{
                      "filter": {{
                        "bool": {{
                          "must": [
                            {{
                              "term": {{
                                "Data.fireNOCDetails.fireNOCType.keyword": "NEW"
                              }}
                            }}
                          ]
                        }}
                      }},
                      "aggs": {{
                        "actualNOCIssued": {{
                          "value_count": {{
                            "field": "Data.fireNOCDetails.applicationNumber.keyword"
                          }}
                        }}
                      }}
                    }},
                    "avgDaysToIssueProvisionalNOC": {{
                      "filter": {{
                        "bool": {{
                          "must": [
                            {{
                              "term": {{
                                "Data.fireNOCDetails.fireNOCType.keyword": "PROVISIONAL"
                              }}
                            }},
                            {{
                              "term": {{
                                "Data.fireNOCDetails.status.keyword": "APPROVED"
                              }}
                            }}
                          ]
                        }}
                      }},
                      "aggs": {{
                        "avgDaysToIssueProvisionalNOC": {{
                          "avg": {{
                            "script": {{
                              "source": "(doc['Data.auditDetails.lastModifiedTime'].value-doc['Data.auditDetails.createdTime'].value)/(86400*1000)"
                            }}
                          }}
                        }}
                      }}
                    }},
                    "avgDaysToIssueActualNOC": {{
                      "filter": {{
                        "bool": {{
                          "must": [
                            {{
                              "term": {{
                                "Data.fireNOCDetails.fireNOCType.keyword": "NEW"
                              }}
                            }},
                            {{
                              "term": {{
                                "Data.fireNOCDetails.status.keyword": "APPROVED"
                              }}
                            }}
                          ]
                        }}
                      }},
                      "aggs": {{
                        "avgDaysToIssueActualNOC": {{
                          "avg": {{
                            "script": {{
                              "source": "(doc['Data.auditDetails.lastModifiedTime'].value-doc['Data.auditDetails.createdTime'].value)/(86400*1000)"
                            }}
                          }}
                        }}
                      }}
                    }},
                    "slaComplianceActual": {{
                      "filter": {{
                        "bool": {{
                          "must": [
                            {{
                              "term": {{
                                "Data.fireNOCDetails.fireNOCType.keyword": "NEW"
                              }}
                            }},
                            {{
                              "term": {{
                                "Data.fireNOCDetails.status.keyword": "APPROVED"
                              }}
                            }},
                            {{
                              "script": {{
                                "script": {{
                                  "source": "doc['Data.auditDetails.lastModifiedTime'].value-doc['Data.auditDetails.createdTime'].value<params.threshold",
                                  "lang": "painless",
                                  "params": {{
                                    "threshold": 172800000
                                  }}
                                }}
                              }}
                            }}
                          ]
                        }}
                      }},
                      "aggs": {{
                        "slaComplianceActual": {{
                          "value_count": {{
                            "field": "Data.fireNOCDetails.applicationNumber.keyword"
                          }}
                        }}
                      }}
                    }},
                    "slaComplianceProvisional": {{
                      "filter": {{
                        "bool": {{
                          "must": [
                            {{
                              "term": {{
                                "Data.fireNOCDetails.fireNOCType.keyword": "PROVISIONAL"
                              }}
                            }},
                            {{
                              "term": {{
                                "Data.fireNOCDetails.status.keyword": "APPROVED"
                              }}
                            }},
                            {{
                              "script": {{
                                "script": {{
                                  "source": "doc['Data.auditDetails.lastModifiedTime'].value-doc['Data.auditDetails.createdTime'].value<params.threshold",
                                  "lang": "painless",
                                  "params": {{
                                    "threshold": 172800000
                                  }}
                                }}
                              }}
                            }}
                          ]
                        }}
                      }},
                    "aggs": {{
                        "slaComplianceProvisional": {{
                          "value_count": {{
                            "field": "Data.fireNOCDetails.applicationNumber.keyword"
                          }}
                        }}
                      }}
                    }}
                  }}
                }}
              }}
            }}
          }}
        }}
      }}
    }}
  }}
}}



    """
}


def extract_firenoc_issued_by_usage_type(metrics, region_bucket):
    usagetype_agg = region_bucket.get('usageType')
    usagetype_buckets = usagetype_agg.get('buckets')
    actualNOCIssued = { 'groupBy' : 'usageType', 'buckets' : []}


    for usagetype_bucket in usagetype_buckets:
        usagetype_name = usagetype_bucket.get('key')
        actualNOCIssued['buckets'].append( { 'name' : usagetype_name, 'value' : usagetype_bucket.get('actualNOCIssued').get('value') if usagetype_bucket.get('actualNOCIssued') else 0})

    if metrics['actualNOCIssued'] and len(metrics['actualNOCIssued']) > 0:
        metrics['actualNOCIssued'].append(actualNOCIssued)
    else:
        metrics['actualNOCIssued'] = [actualNOCIssued]


    return metrics

firenoc_issued_by_usage_type = {
    'path': 'firenoc-services/_search',
    'name': 'firenoc_issued_by_usage_type',
    'lambda': extract_firenoc_issued_by_usage_type,
    'query': """
  {{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "term": {{
            "Data.tenantId.keyword": "pb.testing"
          }}
        }}
      ],
      "must": [
        {{
          "term": {{
            "Data.fireNOCDetails.fireNOCType.keyword": "NEW"
          }}
        }},
        {{
          "range": {{
            "Data.@timestamp": {{
               "gte": {0},
              "lte": {1},
              "format": "epoch_millis"
            }}
          }}
        }}
      ]
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "Data.ward.name.keyword",
        "size":10000
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "Data.tenantId.keyword",
            "size":10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "Data.tenantData.city.districtName.keyword",
                "size":10000
              }},
              "aggs": {{
                "usageType": {{
                  "terms": {{
                    "field": "Data.fireNOCDetails.buildings.usageType.keyword"
                  }},
                  "aggs": {{
                    "actualNOCIssued": {{
                      "cardinality": {{
                        "field": "Data.id.keyword"
                      }}
                    }}
                  }}
                }}
              }}
            }}
          }}
        }}
      }}
    }}
  }}
}}



    """
}


def extract_firenoc_issued_today_by_type(metrics, region_bucket):
    type_agg = region_bucket.get('type')
    type_buckets = type_agg.get('buckets')
    nocIssuedToday = { 'groupBy' : 'type', 'buckets' : []}


    for type_bucket in type_buckets:
        type_name = type_bucket.get('key')
        nocIssuedToday['buckets'].append( { 'name' : type_name, 'value' : type_bucket.get('nocIssuedToday').get('value') if type_bucket.get('nocIssuedToday') else 0})

        metrics['nocIssuedToday'] = [nocIssuedToday]


    return metrics

firenoc_issued_today_by_type = {
    'path': 'firenoc-services/_search',
    'name': 'firenoc_issued_today_by_type',
    'lambda': extract_firenoc_issued_today_by_type,
    'query': """
   {{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "term": {{
            "Data.tenantId.keyword": "pb.testing"
          }}
        }}
      ],
      "must": [
        {{
          "range": {{
            "Data.@timestamp": {{
              "gte": {0},
              "lte": {1},
              "format": "epoch_millis"
            }}
          }}
        }}
      ]
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "Data.ward.name.keyword",
        "size":10000
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "Data.tenantId.keyword",
            "size":10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "Data.tenantData.city.districtName.keyword",
                "size":10000
              }},
              "aggs": {{
                "type": {{
                  "terms": {{
                    "field": "Data.fireNOCDetails.fireNOCType.keyword"
                  }},
                  "aggs": {{
                    "nocIssuedToday": {{
                      "cardinality": {{
                        "field": "Data.id.keyword"
                      }}
                    }}
                  }}
                }}
              }}
            }}
          }}
        }}
      }}
    }}
  }}
}}
    """
}


def extract_firenoc_applications_today_by_type(metrics, region_bucket):
    applicationType_agg = region_bucket.get('applicationType')
    applicationType_buckets = applicationType_agg.get('buckets')
    todaysApplications = { 'groupBy' : 'applicationType', 'buckets' : []}


    for applicationType_bucket in applicationType_buckets:
        applicationType_name = applicationType_bucket.get('key')
        todaysApplications['buckets'].append( { 'name' : applicationType_name, 'value' : applicationType_bucket.get('todaysApplications').get('value') if applicationType_bucket.get('todaysApplications') else 0})

    if metrics['todaysApplications'] and len(metrics['todaysApplications']) > 0:
        metrics['todaysApplications'].append(todaysApplications)
    else:
        metrics['todaysApplications'] = [todaysApplications]


    return metrics

firenoc_applications_today_by_type = {
    'path': 'firenoc-services/_search',
    'name': 'firenoc_applications_today_by_type',
    'lambda': extract_firenoc_applications_today_by_type,
    'query': """
   {{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "term": {{
            "Data.tenantId.keyword": "pb.testing"
          }}
        }}
      ],
      "must": [
        {{
          "range": {{
            "Data.@timestamp": {{
              "gte": {0},
              "lte": {1},
              "format": "epoch_millis"
            }}
          }}
        }}
      ]
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "Data.ward.name.keyword",
        "size":10000
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "Data.tenantId.keyword",
            "size":10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "Data.tenantData.city.districtName.keyword",
                "size":10000
              }},
              "aggs": {{
                "applicationType": {{
                  "terms": {{
                    "field": "Data.fireNOCDetails.fireNOCType.keyword"
                  }},
                  "aggs": {{
                    "todaysApplications": {{
                      "value_count": {{
                        "field": "Data.fireNOCDetails.applicationNumber.keyword"
                      }}
                    }}
                  }}
                }}
              }}
            }}
          }}
        }}
      }}
    }}
  }}
}}


    """
}


def extract_firenoc_applications_closed(metrics, region_bucket):
    metrics['todaysClosedApplications'] = region_bucket.get('todaysClosedApplications').get(
        'value') if region_bucket.get('todaysClosedApplications') else 0
    return metrics

firenoc_applications_closed = {
    'path': 'firenoc-services/_search',
    'name': 'firenoc_applications_closed',
    'lambda': extract_firenoc_applications_closed,
    'query': """
  {{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "term": {{
            "Data.tenantId.keyword": "pb.testing"
          }}
        }}
      ],
      "must": [
        {{
          "range": {{
            "Data.@timestamp": {{
              "gte": {0},
              "lte": {1},
              "format": "epoch_millis"
            }}
          }}
        }},
        {{
          "terms": {{
            "Data.fireNOCDetails.status.keyword": [
              "APPROVED",
              "CANCELED",
              "REJECTED"
            ]
          }}
        }}
      ]
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "Data.ward.name.keyword",
        "size":10000
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "Data.tenantId.keyword",
            "size":10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "Data.tenantData.city.districtName.keyword",
                "size":10000
              }},
              "aggs": {{
                "todaysClosedApplications": {{
                  "value_count": {{
                    "field": "Data.fireNOCDetails.applicationNumber.keyword"
                  }}
                }}
              }}
            }}
          }}
        }}
      }}
    }}
  }}
}}



    """
}


def extract_firenoc_applications_completed_within_sla(metrics, region_bucket):
    val = 0 if  region_bucket.get('todaysCompletedApplicationsWithinSLA').get('value') == None else region_bucket.get('todaysCompletedApplicationsWithinSLA').get('value')
    metrics['todaysCompletedApplicationsWithinSLA'] = val
    return metrics

firenoc_applications_completed_within_sla = {
    'path': 'firenoc-services/_search',
    'name': 'firenoc_applications_completed_within_sla',
    'lambda': extract_firenoc_applications_completed_within_sla,
    'query': """
  {{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "term": {{
            "Data.tenantId.keyword": "pb.testing"
          }}
        }}
      ],
      "must": [
        {{
          "range": {{
            "Data.@timestamp": {{
              "gte": {0},
              "lte": {1},
              "format": "epoch_millis"
            }}
          }}
        }},
        {{
          "script": {{
            "script": {{
              "source": "doc['Data.auditDetails.lastModifiedTime'].value-doc['Data.auditDetails.createdTime'].value<params.threshold",
              "lang": "painless",
              "params": {{
                "threshold": 172800000
              }}
            }}
          }}
        }}
      ]
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "Data.ward.name.keyword",
        "size":10000
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "Data.tenantId.keyword",
            "size":10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "Data.tenantData.city.districtName.keyword",
                "size":10000
              }},
              "aggs": {{
                "todaysCompletedApplicationsWithinSLA": {{
                  "filter": {{
                    "bool": {{
                      "must": [
                        {{
                          "terms": {{
                            "Data.fireNOCDetails.status.keyword": [
                              "APPROVED",
             		               "CANCELED",
                               "REJECTED"
                            ]
                          }}
                        }}
                      ]
                    }}
                  }},
                  "aggs": {{
                    "todaysCompletedApplicationsWithinSLA": {{
                      "value_count": {{
                        "field": "Data.fireNOCDetails.applicationNumber.keyword"
                      }}
                    }}
                  }}
                }}
              }}
            }}
          }}
        }}
      }}
    }}
  }}
}}



    """
}


def extract_firenoc_collections_by_department(metrics, region_bucket):

    department_agg = region_bucket.get('department')
    department_buckets = department_agg.get('buckets')
    all_dims = []
    grouped_by = []
    for department_bucket in department_buckets:
        grouped_by.append({'name': department_bucket.get('key'), 'value': department_bucket.get(
            'todaysCollection').get('value') if department_bucket.get('todaysCollection') else 0})
    all_dims.append(
        {'groupBy': 'department', 'buckets': grouped_by})

    paymentmode_agg = region_bucket.get('paymentmode')
    paymentmode_buckets = paymentmode_agg.get('buckets')
    grouped_by = []
    for paymentmode_bucket in paymentmode_buckets:
        grouped_by.append({'name': paymentmode_bucket.get('key'), 'value': paymentmode_bucket.get(
            'todaysCollection').get('value') if paymentmode_bucket.get('todaysCollection') else 0})
    all_dims.append(
        {'groupBy': 'paymentMode', 'buckets': grouped_by})

    metrics['todaysCollection'] = all_dims

    return metrics

firenoc_collections_by_department = {
    'path': 'dss-collection_v2/_search',
    'name': 'firenoc_collections_by_department',
    'lambda': extract_firenoc_collections_by_department,
    'query': """
  {{
  "size": 0,
  "query": {{
    "bool": {{
      "must": [
        {{
          "terms": {{
            "dataObject.paymentDetails.businessService.keyword": [
              "FIRENOC"
            ]
          }}
        }},
        {{
          "range": {{
            "dataObject.paymentDetails.receiptDate": {{
              "gte": {0},
              "lte": {1},
              "format": "epoch_millis"
            }}
          }}
        }}
      ],
      "must_not": [
        {{
          "term": {{
            "dataObject.tenantId.keyword": "pb.testing"
          }}
        }}
      ]
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "domainObject.ward.name.keyword",
        "size":10000
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "domainObject.tenantId.keyword",
            "size":10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "dataObject.tenantData.city.districtName.keyword",
                "size":10000
              }},
              "aggs": {{
                "paymentmode": {{
                  "terms": {{
                    "field": "dataObject.paymentMode.keyword"
                  }},
                  "aggs": {{
                    "todaysCollection": {{
                      "sum": {{
                        "field": "dataObject.paymentDetails.totalAmountPaid"
                      }}
                      }}
                      }}
                      }},
                "department": {{
                  "terms": {{
                    "field": "domainObject.Department.keyword"
                  }},
                  "aggs": {{
                    "todaysCollection": {{
                      "sum": {{
                        "field": "dataObject.paymentDetails.totalAmountPaid"
                      }}
                    }}
                  }}
                }}
              }}
            }}
          }}
        }}
      }}
    }}
  }}
}}
    """
}


firenoc_queries = [firenoc_bundle_metrics, firenoc_issued_by_usage_type,firenoc_applications_today_by_type,firenoc_issued_today_by_type, firenoc_applications_closed,
                   firenoc_applications_completed_within_sla, firenoc_collections_by_department]


def empty_firenoc_payload(region, ulb, ward, date):
    return {
        "date": date,
        "module": "FIRENOC",
        "ward": ward,
        "ulb": ulb,
        "region": region,
        "state": "Punjab",
        "metrics":  {
            "todaysClosedApplications": 0,
            "todaysCompletedApplicationsWithinSLA":0,
            "todaysApplications": [

            ],
            "todaysCollection": [

            ],
            "nocIssuedToday": [

            ],
            "provisionalNOCIssued": [

            ],
            "actualNOCIssued": [

            ],
            "avgDaysToIssueProvisionalNOC": [

            ],
            "slaComplianceActual": [

            ],
            "slaComplianceProvisional": [

            ],
            "avgDaysToIssueActualNOC": [

            ]
        }
    }
