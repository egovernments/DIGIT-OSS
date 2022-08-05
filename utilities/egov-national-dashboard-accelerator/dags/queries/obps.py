def extract_obps_ocIssued(metrics, region_bucket):
    metrics['ocIssued'] = region_bucket.get('ocIssued').get(
        'value') if region_bucket.get('ocIssued') else 0
    return metrics

obps_ocIssued = {
    'path': 'bpa-index/_search',
    'name': 'obps_ocIssued',
    'lambda': extract_obps_ocIssued,
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
                "Data.status.keyword": "APPROVED"
              }}
            }},
            {{
              "terms": {{
                "Data.businessService.keyword": [
                  "BPA_OC"
                ]
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
                        "field": "Data.landInfo.address.locality.name.keyword",
                        "size":10000
                    }},
                    "aggs": {{
                        "ocIssued": {{
                        "value_count": {{
                            "field": "Data.applicationNo.keyword"
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


def extract_obps_permitsIssued_by_riskType_occupancyType_subOccupancyType(metrics, region_bucket):
    allDims = []
    grouped_by = []

    riskType_agg = region_bucket.get('byRiskType')
    riskType_buckets = riskType_agg.get('buckets')
    grouped_by = []
    for riskType_bucket in riskType_buckets:
        grouped_by.append({'name': riskType_bucket.get('key'), 'value': riskType_bucket.get(
            'permitsIssued').get('value') if riskType_bucket.get('permitsIssued') else 0})
    allDims.append(
        {'groupBy': 'riskType', 'buckets': grouped_by})


    occupancyType_agg = region_bucket.get('byoccupancyType')
    occupancyType_buckets = occupancyType_agg.get('buckets')
    grouped_by = []
    for occupancyType_bucket in occupancyType_buckets:
        grouped_by.append({'name': occupancyType_bucket.get('key'), 'value': occupancyType_bucket.get(
            'permitsIssued').get('value') if occupancyType_bucket.get('permitsIssued') else 0})
    allDims.append(
        {'groupBy': 'occupancyType', 'buckets': grouped_by})


    subOccupancyType_agg = region_bucket.get('bysubOccupancyType')
    subOccupancyType_buckets = subOccupancyType_agg.get('buckets')
    grouped_by = []
    for subOccupancyType_bucket in subOccupancyType_buckets:
        grouped_by.append({'name': subOccupancyType_bucket .get('key'), 'value': subOccupancyType_bucket .get(
            'permitsIssued').get('value') if subOccupancyType_bucket.get('permitsIssued') else 0})
    allDims.append(
        {'groupBy': 'subOccupancyType', 'buckets': grouped_by})

    metrics['permitsIssued'] = allDims


    return metrics

obps_permitsIssued_by_riskType_occupancyType_subOccupancyType = {
    'path': 'bpa-index/_search',
    'name': 'obps_permitsIssued_by_riskType_occupancyType_subOccupancyType',
    'lambda': extract_obps_permitsIssued_by_riskType_occupancyType_subOccupancyType,
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
          "terms": {{
            "Data.businessService.keyword": [
              "BPA",
              "BPA_LOW"
            ]
          }}
        }},
        {{
          "term": {{
            "Data.status.keyword": "APPROVED"
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
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "byRiskType": {{
                  "terms": {{
                    "field": "Data.riskType.keyword"
                  }},
                  "aggs": {{
                    "permitsIssued": {{
                      "value_count": {{
                        "field": "Data.riskType.keyword"
                      }}
                    }}
                  }}
                }},
                "byOccupancyType": {{
                  "terms": {{
                    "field": "Data.landInfo.unit.occupancyType.keyword"
                  }},
                  "aggs": {{
                    "permitsIssued": {{
                      "value_count": {{
                        "field": "Data.landInfo.unit.occupancyType.keyword"
                      }}
                    }}
                  }}
                }},
                "bysubOccupancyType": {{
                  "terms": {{
                    "field": "Data.landInfo.ownershipCategory.keyword"
                  }},
                  "aggs": {{
                    "permitsIssued": {{
                      "value_count": {{
                        "field": "Data.landInfo.ownershipCategory.keyword"
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


def extract_obps_averageDaysToIssuePermit(metrics, region_bucket):
    metrics['averageDaysToIssuePermit'] = region_bucket.get('averageDaysToIssuePermit').get(
        'value') if region_bucket.get('averageDaysToIssuePermit') else 0
    return metrics

obps_averageDaysToIssuePermit = {
    'path': 'bpa-index/_search',
    'name': 'obps_averageDaysToIssuePermit',
    'lambda': extract_obps_averageDaysToIssuePermit,
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
        {
          "terms": {{
            "Data.businessService.keyword": [
              "BPA",
              "BPA_LOW"
            ]
          }}
        }},
        {{
          "term": {{
            "Data.status.keyword": "APPROVED"
          }}
        }},
        {{
          "range": {{
            "Data.@timestamp": {{
              "gte": 1646677800000,
              "lte": 1646764199000,
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
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "averageDaysToIssuePermit": {{
                  "avg": {{
                    "script": {{
                      "source": "(doc['Data.auditDetails.lastModifiedTime'].value-doc['Data.auditDetails.createdTime'].value)/(86400*1000)"
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


def extract_obps_averageDaysToIssueOC(metrics, region_bucket):
    metrics['averageDaysToIssueOC'] = region_bucket.get('averageDaysToIssueOC').get(
        'value') if region_bucket.get('averageDaysToIssueOC') else 0
    return metrics

obps_averageDaysToIssueOC = {
    'path': 'bpa-index/_search',
    'name': 'obps_averageDaysToIssueOC',
    'lambda': extract_obps_averageDaysToIssueOC,
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
        {
          "terms": {{
            "Data.businessService.keyword": [
              "BPA_OC"
            ]
          }}
        }},
        {{
          "term": {{
            "Data.status.keyword": "APPROVED"
          }}
        }},
        {{
          "range": {{
            "Data.@timestamp": {{
              "gte": 1646677800000,
              "lte": 1646764199000,
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
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "averageDaysToIssueOC": {{
                  "avg": {{
                    "script": {{
                      "source": "(doc['Data.auditDetails.lastModifiedTime'].value-doc['Data.auditDetails.createdTime'].value)/(86400*1000)"
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


def extract_obps_slaCompliancePermit(metrics, region_bucket):
    metrics['slaCompliancePermit'] = region_bucket.get('slaCompliancePermit').get(
        'doc_count') if region_bucket.get('slaCompliancePermit') else 0
    return metrics

obps_slaCompliancePermit = {
    'path': 'bpa-index/_search',
    'name': 'obps_slaCompliancePermit',
    'lambda': extract_obps_slaCompliancePermit,
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
          "terms": {{
            "Data.businessService.keyword": [
              "BPA",
              "BPA_LOW"
            ]
          }}
        }},
        {{
          "term": {{
            "Data.status.keyword": "APPROVED"
          }}
        }},
        {
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
          },
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              },
              "aggs": {{
                "slaCompliancePermit": {{
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


def extract_obps_slaComplianceOC(metrics, region_bucket):
    metrics['slaComplianceOC'] = region_bucket.get('slaComplianceOC').get(
        'doc_count') if region_bucket.get('slaComplianceOC') else 0
    return metrics

obps_slaComplianceOC = {
    'path': 'bpa-index/_search',
    'name': 'obps_slaComplianceOC',
    'lambda': extract_obps_slaComplianceOC,
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
          "terms": {{
            "Data.businessService.keyword": [
               "BPA_OC"
            ]
          }}
        }},
        {{
          "term": {{
            "Data.status.keyword": "APPROVED"
          }}
        }},
        {
          "range": {{
            "Data.@timestamp": {{
              "gte": 1646677800000,
              "lte": 1646764199000,
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
          },
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              },
              "aggs": {{
                "slaCompliancePermit": {{
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


def extract_obps_ocSubmitted(metrics, region_bucket):
    metrics['ocSubmitted'] = region_bucket.get('ocSubmitted').get(
        'value') if region_bucket.get('ocSubmitted') else 0
    return metrics

obps_ocSubmitted = {
    'path': 'bpa-index/_search',
    'name': 'obps_ocSubmitted',
    'lambda': extract_obps_ocSubmitted,
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
          "terms": {{
            "Data.businessService.keyword": [
              "BPA_OC"
            ]
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
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "ocSubmitted": {{
                  "value_count": {{
                    "field": "Data.applicationNo.keyword"
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


def extract_obps_applicationsSubmitted(metrics, region_bucket):
    metrics['applicationSubmitted'] = region_bucket.get('applicationSubmitted').get(
        'value') if region_bucket.get('applicationSubmitted') else 0
    return metrics

obps_applicationsSubmitted = {
    'path': 'bpa-index/_search',
    'name': 'obps_applicationsSubmitted',
    'lambda': extract_obps_applicationsSubmitted,
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
          "terms": {{
            "Data.businessService.keyword": [
              "BPA",
              "BPA_LOW"
            ]
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
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "applicationSubmitted": {{
                  "value_count": {{
                    "field": "Data.applicationNo.keyword"
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


def extract_obps_landAreaAppliedInSystemForBPA(metrics, region_bucket):
    metrics['landAreaAppliedInSystemForBPA'] = region_bucket.get('landAreaAppliedInSystemForBPA').get(
        'value') if region_bucket.get('landAreaAppliedInSystemForBPA') else 0
    return metrics

obps_landAreaAppliedInSystemForBPA = {
    'path': 'bpa-index/_search',
    'name': 'obps_landAreaAppliedInSystemForBPA',
    'lambda': extract_obps_landAreaAppliedInSystemForBPA,
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
            "terms": {{
              "Data.businessService.keyword": [
                "BPA_OC",
                "BPA",
                "BPA_LOW"
              ]
            }}
          }},
          {{
            "term": {{
              "Data.status.keyword": "APPROVED"
            }}
          }},
          {{
            "exists": {{
              "field": "Data.plotAreaApproved"
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
          "ulb":  {{
            "terms": {{
              "field": "Data.tenantId.keyword",
              "size":10000
            }},
            "aggs": {{
              "region": {{
                "terms": {{
                  "field": "Data.landInfo.address.locality.name.keyword",
                  "size":10000
                }},
                "aggs": {{
                  "landAreaAppliedInSystemForBPA": {{
                    "sum": {{
                      "field": "Data.plotArea"
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


def extract_obps_applicationsWithDeviation(metrics, region_bucket):
    metrics['applicationsWithDeviation'] = region_bucket.get('applicationsWithDeviation').get(
        'value') if region_bucket.get('applicationsWithDeviation') else 0
    return metrics

obps_applicationsWithDeviation = {
    'path': 'bpa-index/_search',
    'name': 'obps_applicationsWithDeviation',
    'lambda': extract_obps_applicationsWithDeviation,
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
          "terms": {{
            "Data.businessService.keyword": [
              "BPA",
              "BPA_LOW"
            ]
          }}
        }},
        {{
          "term": {{
            "Data.status.keyword": "APPROVED"
          }}
        }},
        {{
          "exists": {{
            "field": "Data.plotAreaApproved"
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
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "applicationsWithDeviation": {{
                  "avg": {{
                    "script": {{
                      "source": "Math.round(((doc['Data.plotAreaApproved'].value-doc['Data.plotArea'].value)*100)/(doc['Data.plotArea'].value))"
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


def extract_obps_ocWithDeviation(metrics, region_bucket):
    metrics['ocWithDeviation'] = region_bucket.get('ocWithDeviation').get(
        'value') if region_bucket.get('ocWithDeviation') else 0
    return metrics

obps_ocWithDeviation = {
    'path': 'bpa-index/_search',
    'name': 'obps_ocWithDeviation',
    'lambda': extract_obps_ocWithDeviation,
    'query': """

 {{
  "size": 0,
  "query":  {{
    "bool":  {{
      "must_not": [
         {{
          "term":  {{
            "Data.tenantId.keyword": "pb.testing"
          }}
        }}
      ],
      "must": [
         {{
          "range":  {{
            "Data.@timestamp":  {{
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
    "ward":  {{
      "terms":  {{
        "field": "Data.ward.name.keyword",
        "size":10000
      }},
      "aggs":  {{
        "ulb":  {{
          "terms":  {{
            "field": "Data.tenantId.keyword",
            "size":10000
          }},
          "aggs":  {{
            "region":  {{
              "terms":  {{
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "applicationsWithDeviation":  {{
                  "filter":  {{
                    "bool":  {{
                      "must": [
                         {{
                          "terms":  {{
                            "Data.businessService.keyword": [
                              "BPA_OC"
                            ]
                          }}
                        }},
                         {{
                          "term":  {{
                            "Data.status.keyword": "APPROVED"
                          }}
                        }},
                         {{
                          "exists":  {{
                            "field": "Data.plotAreaApproved"
                          }}
                        }},
                        {{
                          "script":  {{
                            "script":  {{
                              "source": "(doc['Data.plotAreaApproved'].value-doc['Data.plotArea'].value)>params.threshold",
                              "lang": "painless",
                              "params":  {{
                                "threshold": 0
                              }}
                            }}
                          }}
                        }}
                      ]
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


def extract_obps_averageDeviation(metrics, region_bucket):
    metrics['averageDeviation'] = region_bucket.get('extract_obps_averageDeviation').get(
        'value') if region_bucket.get('averageDeviation') else 0
    return metrics

obps_averageDeviation = {
    'path': 'bpa-index/_search',
    'name': 'obps_averageDeviation',
    'lambda': extract_obps_averageDeviation,
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
          "terms": {{
            "Data.businessService.keyword": [
              "BPA_OC",
              "BPA",
              "BPA_LOW"
            ]
          }}
        }},
        {{
          "term": {{
            "Data.status.keyword": "APPROVED"
          }}
        }},
        {{
          "exists": {{
            "field": "Data.plotAreaApproved"
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
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "deviation": {{
                  "avg": {{
                    "script": {{
                      "source": "Math.round(((doc['Data.plotAreaApproved'].value-doc['Data.plotArea'].value)*100)/(doc['Data.plotArea'].value))"
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


def extract_obps_todaysClosedApplicationsPermit(metrics, region_bucket):
    metrics['todaysClosedApplicationsPermit'] = region_bucket.get('extract_obps_todaysClosedApplicationsPermit').get(
        'value') if region_bucket.get('todaysClosedApplicationsPermit') else 0
    return metrics

obps_todaysClosedApplicationsPermit = {
    'path': 'bpa-index/_search',
    'name': 'obps_todaysClosedApplicationsPermit',
    'lambda': extract_obps_todaysClosedApplicationsPermit,
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
            "Data.status.keyword": [
              "APPROVED",
              "CANCELED",
              "REJECTED"
            ]
          }}
        }},
        {{
          "terms": {{
            "Data.businessService.keyword": [
              "BPA",
              "BPA_LOW"
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
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "todaysClosedApplicationsPermit": {{
                      "value_count": {{
                        "field": "Data.applicationNo.keyword"
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


def extract_obps_todaysClosedApplicationsOC(metrics, region_bucket):
    metrics['todaysClosedApplicationsOC '] = region_bucket.get('extract_obps_todaysClosedApplicationsOC ').get(
        'value') if region_bucket.get('todaysClosedApplicationsOC ') else 0
    return metrics

obps_todaysClosedApplicationsOC = {
    'path': 'bpa-index/_search',
    'name': 'obps_todaysClosedApplicationsOC',
    'lambda': extract_obps_todaysClosedApplicationsOC,
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
            "Data.status.keyword": [
              "APPROVED",
              "CANCELED",
              "REJECTED"
            ]
          }}
        }},
        {{
          "terms": {{
            "Data.businessService.keyword": [
              "BPA_OC"
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
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "todaysClosedApplicationsPermit": {{
                      "value_count": {{
                        "field": "Data.applicationNo.keyword"
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


def extract_obps_todaysCompletedApplicationsWithinSLAPermit(metrics, region_bucket):
    metrics['todaysCompletedApplicationsWithinSLAPermit'] = region_bucket.get('extract_obps_todaysCompletedApplicationsWithinSLAPermit').get(
        'value') if region_bucket.get('todaysCompletedApplicationsWithinSLAPermit') else 0
    return metrics

obps_todaysCompletedApplicationsWithinSLAPermit = {
    'path': 'bpa-index/_search',
    'name': 'obps_todaysCompletedApplicationsWithinSLAPermit',
    'lambda': extract_obps_todaysCompletedApplicationsWithinSLAPermit,
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
            "Data.status.keyword": [
              "APPROVED"
            ]
          }}
        }},
        {{
          "terms": {{
            "Data.businessService.keyword": [
              "BPA",
              "BPA_LOW"
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
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "todaysCompletedApplicationsWithinSLAOC": {{
                      "value_count": {{
                        "field": "Data.applicationNo.keyword"
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



def extract_obps_todaysCompletedApplicationsWithinSLAOC(metrics, region_bucket):
    metrics['todaysCompletedApplicationsWithinSLAOC'] = region_bucket.get('extract_obps_todaysCompletedApplicationsWithinSLAOC').get(
        'value') if region_bucket.get('todaysCompletedApplicationsWithinSLAOC') else 0
    return metrics

obps_todaysCompletedApplicationsWithinSLAOC= {
    'path': 'bpa-index/_search',
    'name': 'obps_todaysCompletedApplicationsWithinSLAOC',
    'lambda': extract_obps_todaysCompletedApplicationsWithinSLAOC,
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
            "Data.status.keyword": [
              "APPROVED"
            ]
          }}
        }},
        {{
          "terms": {{
            "Data.businessService.keyword": [
              "BPA_OC"
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
                "field": "Data.landInfo.address.locality.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "todaysCompletedApplicationsWithinSLAOC": {{
                      "value_count": {{
                        "field": "Data.applicationNo.keyword"
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


def extract_obps_todaysCollection_by_paymentMode(metrics, region_bucket):
    paymentMode_agg = region_bucket.get('paymentMode')
    paymentMode_buckets = paymentMode_agg.get('buckets')
    todaysCollection = { 'groupBy' : 'applicationType', 'buckets' : []}


    for paymentMode_bucket in paymentMode_buckets:
        paymentMode_name = paymentMode_bucket.get('key')
        todaysCollection['buckets'].append( { 'name' : paymentMode_name, 'value' : paymentMode_bucket.get('todaysCollection').get('value') if paymentMode_bucket.get('todaysCollection') else 0})

    metrics['todaysCollection'] = [todaysCollection]


    return metrics

obps_todaysCollection_by_paymentMode = {
    'path': 'dss-collection_v2/_search',
    'name': 'obps_todaysCollection_by_paymentMode',
    'lambda': extract_obps_todaysCollection_by_paymentMode,
    'query': """

{{
  "size": 0,
  "query": {{
    "bool": {{
      "must": [
        {{
          "terms": {{
            "dataObject.paymentDetails.businessService.keyword": [
              "BPA.LOW_RISK_PERMIT_FEE",
              "BPA.NC_APP_FEE",
              "BPA.NC_SAN_FEE",
              "BPA.NC_OC_APP_FEE"
            ]
          }}
        }},
        {{
          "range": {{
            "dataObject.paymentDetails.receiptDate": {{
              "gte": 1646677800000,
              "lte": 1646764199000,
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
        }},
        {{
          "term": {{
            "dataObject.paymentStatus.keyword": "Cancelled"
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


obps_queries = [obps_ocIssued, obps_permitsIssued_by_riskType_occupancyType_subOccupancyType, obps_averageDaysToIssuePermit, obps_averageDaysToIssueOC,
                obps_slaCompliancePermit,obps_slaComplianceOC,obps_ocSubmitted,obps_applicationsSubmitted,obps_landAreaAppliedInSystemForBPA,obps_applicationsWithDeviation,
                obps_ocWithDeviation, obps_averageDeviation,obps_todaysClosedApplicationsOC,obps_todaysClosedApplicationsPermit, obps_todaysCollection_by_paymentMode]


def empty_obps_payload(region, ulb, ward, date):
    return {
        "date": date,
        "module": "MCOLLECT",
        "ward": ward,
        "ulb": ulb,
        "region": region,
        "state": "Punjab",
        "metrics": {
            "ocPlansScrutinized": 120,
            "plansScrutinized": 540,
            "ocSubmitted": 50,
            "applicationsSubmitted": 50,
            "ocIssued": 19,
            "landAreaAppliedInSystemForBPA": 25000,
            "averageDaysToIssuePermit": 10,
            "averageDaysToIssueOC": 8,
            "todaysClosedApplicationsOC":10 ,
            "todaysCompletedApplicationsWithinSLAOC":5 ,
            "todaysClosedApplicationsPermit": 20,
            "todaysCompletedApplicationsWithinSLAPermit":10,
            "slaComplianceOC": 20,
            "slaCompliancePermit": 40,
            "applicationsWithDeviation": 20,
            "averageDeviation": 10,
            "ocWithDeviation": 30,
            "todaysCollection": [
                {
                    "groupBy": "paymentMode",
                    "buckets": [
                        {
                            "name": "UPI",
                            "value": 10000
                        },
                        {
                            "name": "DEBIT.CARD",
                            "value": 15000
                        },
                        {
                            "name": "CREDIT.CARD",
                            "value": 8500
                        }
                    ]
                }
            ],
            "permitsIssued": [
                {
                    "groupBy": "riskType",
                    "buckets": [
                        {
                            "name": "LOW",
                            "value": 150
                        },
                        {
                            "name": "MEDIUM",
                            "value": 300
                        },
                        {
                            "name": "HIGH",
                            "value": 600
                        }
                    ]
                } ,
                {
                    "groupBy": "occupancyType",
                    "buckets": [
                        {
                            "name": "RESIDENTIAL",
                            "value": 150
                        },
                        {
                            "name": "INSTITUTIONAL",
                            "value": 180
                        }
                    ]
                },
                {
                    "groupBy": "subOccupancyType",
                    "buckets": [
                        {
                            "name": "RESIDENTIAL.INDIVIDUAL",
                            "value": 50
                        },
                        {
                            "name": "RESIDENTIAL.SHARED",
                            "value": 20
                        },
                        {
                            "name": "INSITUTIONAL.SHARED",
                            "value": 120
                        }
                    ]
                }
            ]
        }
    }