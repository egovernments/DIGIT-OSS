#ulb counts
#TL
tl = {
    'module' : 'TL',
    'path': 'tlindex-v1-enriched/_search',
    'name': 'tl_ulbs',
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
            "Data.tradelicense.@timestamp": {{
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
    "totalApplications": {{
      "value_count": {{
        "field": "Data.tradelicense.licenseNumber.keyword"
      }}
    }},
    "applicationsIssuedWithinSLA": {{
      "filter": {{
        "bool": {{
          "must": [
            {{
              "script": {{
                "script": {{
                  "source": "doc['Data.tradelicense.auditDetails.lastModifiedTime'].value-doc['Data.tradelicense.auditDetails.createdTime'].value<params.threshold",
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
        "withinsla": {{
          "value_count": {{
            "field": "Data.tradelicense.licenseNumber.keyword"
          }}
        }}
      }}
    }},
      "ulbs": {{
        "terms": {{
          "field": "Data.tradelicense.tenantId.keyword",
          "size": 1000
        }}
      }}
    }}
  }}


    """
}

#PT
pt = {
    'module' : 'PT',
    'path': 'property-services/_search',
    'name': 'pt_ulbs',
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
    "totalApplications": {{
      "value_count": {{
        "field": "Data.propertyId.keyword"
      }}
    }},
    "applicationsIssuedWithinSLA": {{
      "filter": {{
        "bool": {{
          "must": [
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
        "withinsla": {{
          "value_count": {{
            "field": "Data.propertyId.keyword"
          }}
        }}
      }}
    }},
    "ulbs": {{
      "terms": {{
        "field": "Data.tenantId.keyword",
        "size": 1000
      }}
    }}
  }}
}}


    """

}

#FIRENOC
firenoc = {
    'module' : 'FIRENOC',
    'path': 'firenoc-services/_search',
    'name': 'firenoc_ulbs',
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
    "applicationsIssuedWithinSLA": {{
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
        "withinsla": {{
          "value_count": {{
            "field": "Data.fireNOCDetails.applicationNumber.keyword"
          }}
        }}
      }}
    }},
    "totalApplications": {{
      "value_count": {{
        "field": "Data.fireNOCDetails.applicationNumber.keyword"
      }}
    }},
    "ulbs": {{
      "terms": {{
        "field": "Data.tenantId.keyword",
        "size": 1000
      }}
    }}
  }}
}}


    """

}

#PGR
pgr = {
    'module' : 'PGR',
    'path': 'pgrindex-v1-enriched/_search',
    'name': 'pgr_ulbs',
    'query': """
{{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "term": {{
            "Data.addressDetail.auditDetails.createdBy": "pb.testing"
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
    "applicationsIssuedWithinSLA": {{
      "filter": {{
        "bool": {{
          "must": [
            {{
              "script": {{
                "script": {{
                  "source": "doc['Data.addressDetail.auditDetails.lastModifiedTime'].value-doc['Data.addressDetail.auditDetails.createdTime'].value<params.threshold",
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
        "withinsla": {{
          "value_count": {{
            "field": "Data.dateOfComplaint"
          }}
        }}
      }}
    }},
    "totalApplications": {{
      "value_count": {{
        "field": "Data.dateOfComplaint"
      }}
    }},
    "ulbs": {{
      "terms": {{
        "field": "Data.tenantId.keyword",
        "size": 1000
      }}
    }}
  }}
}}

    """
}

#WS
ws = {
    'module' : 'WS',
    'path': 'water-services-enriched/_search',
    'name': 'ws_ulbs',
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
    "applicationsIssuedWithinSLA": {{
      "filter": {{
        "bool": {{
          "must": [
            {{
              "terms": {{
                "Data.applicationStatus.keyword": [
                  "CONNECTION_ACTIVATED",
                  "REJECTED"
                ]
              }}
            }},
            {{
              "script": {{
                "script": {{
                  "source": "doc['Data.history.auditDetails.lastModifiedTime'].value - doc['Data.history.auditDetails.createdTime'].value < params.threshold",
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
        "withinsla": {{
          "value_count": {{
            "field": "Data.id.keyword"
          }}
        }}
      }}
    }},
    "totalApplications": {{
      "value_count": {{
        "field": "Data.id.keyword"
      }}
    }},
    "ulbs": {{
      "terms": {{
        "field": "Data.tenantId.keyword",
        "size": 1000
      }}
    }}
  }}
}}

    """

}

#SW
sw = {
    'module' : 'SW',
    'path': 'sewerage-services-enriched/_search',
    'name': 'sw_ulbs',
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
    "applicationsIssuedWithinSLA": {{
      "filter": {{
        "bool": {{
          "must": [
            {{
              "terms": {{
                "Data.applicationStatus.keyword": [
                  "CONNECTION_ACTIVATED",
                  "REJECTED"
                ]
              }}
            }},
            {{
              "script": {{
                "script": {{
                  "source": "doc['Data.history.auditDetails.lastModifiedTime'].value - doc['Data.history.auditDetails.createdTime'].value < params.threshold",
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
        "withinsla": {{
          "value_count": {{
            "field": "Data.id.keyword"
          }}
        }}
      }}
    }},
    "totalApplications": {{
      "value_count": {{
        "field": "Data.id.keyword"
      }}
    }},
    "ulbs": {{
      "terms": {{
        "field": "Data.tenantId.keyword",
        "size": 1000
      }}
    }}
  }}
}}


    """

}

#wsapplication
wsapplications = {
    'module' : 'WSAPPLICATIONS',
    'path': 'wsapplications/_search',
    'name': 'wsapplications_ulbs',
    'query': """
{{
  "size": 0,
  "query": {{
    "bool":{{
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
            "@timestamp": {{
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
    "applicationsIssuedWithinSLA": {{
      "filter": {{
        "script": {{
          "script": {{
            "params": {{
              "threshold": 172800000
            }},
            "lang": "painless",
            "source": "new Date().getTime() * 1000- doc['createddate'].date.getMillis()  < params.threshold"
          }}
        }}
      }},
      "aggs": {{
        "withinsla": {{
          "value_count": {{
            "field": "id.keyword"
          }}
        }}
      }}
    }},
    "totalApplications": {{
      "value_count": {{
        "field": "applicationnumber.keyword"
      }}
    }},
    "ulbs": {{
      "terms": {{
        "field": "cityname.keyword",
        "size": 1000
      }}
    }}
  }}
}}



    """

}

#water remove for QA as not there in Punjab
common_queries = [tl, pt,sw, pgr,ws,firenoc,wsapplications]

def empty_common_payload(region, ulb, ward, date):
    return {
        "date": date,
        "module": "COMMON",
        "ward": ward,
        "ulb": ulb,
        "region": region,
        "uuid":"11b0e02b-0145-4de2-bc42-c97b96264807",
        "state": "Punjab",
        "metrics": {
            "status":"Live",
            "onboardedUlbsCount":0,
            "totalCitizensCount":0,
            "totalLiveUlbsCount":0,
            "totalUlbCount":0,
            "slaAchievement":0,
            "liveUlbsCount":[
                {
                    "groupBy": "serviceModuleCode",
                    "buckets": [
                        {
                            "name": "PT",
                            "value": 0
                        },
                        {
                            "name": "TL",
                            "value": 0
                        },
                        {
                            "name": "FIRENOC",
                            "value": 0
                        },
                        {
                            "name": "PGR",
                            "value": 0
                        },
                        {
                            "name": "WS",
                            "value": 0
                        }
                    ]
                }
            ]
        }
    }










