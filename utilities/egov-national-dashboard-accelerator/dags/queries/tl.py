
#queries for the TL module
def extract_tl_license_issued_by_boundary(metrics, region_bucket):
    metrics['todaysApplications'] = region_bucket.get('todaysApplications').get(
        'value') if region_bucket.get('todaysApplications') else 0
    return metrics

tl_license_issued_by_boundary = {'path': 'tlindex-v1-enriched/_search',
                                 'name': 'tl_license_issued_by_boundary',
                                 'lambda': extract_tl_license_issued_by_boundary,
                                 'query':
                                     """
    {{
      "size": 0,
        "query": {{
            "bool": {{
              "must_not": [
                {{
                  "term": {{
                    "Data.tradelicense.tenantId.keyword": "pb.testing"
                  }}
                }}
              ],
              "must": [
                {{
                  "range": {{
                    "Data.tradelicense.applicationDate": {{
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
                    "field": "Data.tradelicense.tenantId.keyword",
                    "size":10000
                  }},
                             "aggs": {{
             "region": {{
              "terms": {{
              "field": "Data.tenantData.city.districtName.keyword",
              "size":10000
              }},
    
                        "aggs": {{
                          "todaysApplications": {{
                            "value_count": {{
                              "field": "Data.tradelicense.applicationNumber.keyword"
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


def extract_tl_collection_adhoc_penalty(metrics, region_bucket):
    metrics['adhocPenalty'] = region_bucket.get('adhocPenalty').get('aggrFilter').get('amount').get(
        'value') if region_bucket.get('adhocPenalty').get('aggrFilter').get('amount').get('value') else 0
    return metrics

tl_collection_adhoc_penalty = {
    'path': 'dss-collection_v2/_search',
    'name': 'tl_collection_adhoc_penalty',
    'lambda': extract_tl_collection_adhoc_penalty,
    'query': """
{{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "term": {{
            "domainobject.tenantId.keyword": "pb.testing"
          }}
        }}
      ],
          "must": [
            {{
                "range": {{
                    "dataObject.paymentDetails.receiptDate": {{
                    "gte": {0},
                    "lte": {1},
                    "format": "epoch_millis"
                }}
              }}
            }},
            {{
          "term": {{
            "dataObject.paymentDetails.businessService.keyword": {{
              "value": "TL"
            }}
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
            "field": "dataObject.tenantId.keyword",
            "size":10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "dataObject.tenantData.city.districtName.keyword",
                "size":10000
              }},
              "aggs": {{
                "adhocPenalty": {{
                  "nested": {{
                    "path": "dataObject.paymentDetails.bill.billDetails.billAccountDetails"
                  }},
                  "aggs": {{
                    "aggrFilter": {{
                      "filter": {{
                        "terms": {{
                          "dataObject.paymentDetails.bill.billDetails.billAccountDetails.taxHeadCode.keyword": [
                            "TL_ADHOC_PENALTY"
                          ]
                        }}
                      }},
                      "aggs": {{
                        "amount" : {{
                          "sum": {{
                            "field": "dataObject.paymentDetails.bill.billDetails.billAccountDetails.amount"
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


def extract_tl_collection_adhoc_rebate(metrics, region_bucket):
    metrics['adhocRebate'] = region_bucket.get('adhocRebate').get('aggrFilter').get('amount').get(
        'value') if region_bucket.get('adhocRebate').get('aggrFilter').get('amount').get('value') else 0
    return metrics


tl_collection_adhoc_rebate = {'path': 'dss-collection_v2/_search',
                              'name': 'tl_collection_adhoc_rebate',
                              'lambda': extract_tl_collection_adhoc_rebate,
                              'query': """
{{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "term": {{
            "domainobject.tenantId.keyword": "pb.testing"
          }}
        }}
      ],
          "must": [
            {{
                "range": {{
                    "dataObject.paymentDetails.receiptDate": {{
                "gte": {0},
                "lte": {1},
                    "format": "epoch_millis"
                }}
              }}
            }},
            {{
          "term": {{
            "dataObject.paymentDetails.businessService.keyword": {{
              "value": "TL"
            }}
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
            "field": "dataObject.tenantId.keyword",
            "size":10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "dataObject.tenantData.city.districtName.keyword",
                "size":10000
              }},
              "aggs": {{
                "adhocRebate": {{
                  "nested": {{
                    "path": "dataObject.paymentDetails.bill.billDetails.billAccountDetails"
                  }},
                  "aggs": {{
                    "aggrFilter": {{
                      "filter": {{
                        "terms": {{
                          "dataObject.paymentDetails.bill.billDetails.billAccountDetails.taxHeadCode.keyword": [
                            "TL_ADHOC_REBATE"
                          ]
                        }}
                      }},
                      "aggs": {{
                        "amount" : {{
                          "sum": {{
                            "field": "dataObject.paymentDetails.bill.billDetails.billAccountDetails.amount"
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


def extract_tl_collection_tax(metrics, region_bucket):
    metrics['tlTax'] = region_bucket.get('tlTax').get('aggrFilter').get('amount').get(
        'value') if region_bucket.get('tlTax').get('aggrFilter').get('amount').get('value') else 0
    return metrics


tl_collection_tax = {'path': 'dss-collection_v2/_search',
                     'name': 'tl_collection_tax',
                     'lambda': extract_tl_collection_tax,

                     'query': """

{{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "term": {{
            "domainobject.tenantId.keyword": "pb.testing"
          }}
        }}
      ],
          "must": [
            {{
                "range": {{
                    "dataObject.paymentDetails.receiptDate": {{
                "gte": {0},
                "lte": {1},
                    "format": "epoch_millis"
                }}
              }}
            }},
            {{
          "term": {{
            "dataObject.paymentDetails.businessService.keyword": {{
              "value": "TL"
            }}
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
            "field": "dataObject.tenantId.keyword",
            "size":10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "dataObject.tenantData.city.districtName.keyword",
                "size":10000
              }},
              "aggs": {{
                "tlTax": {{
                  "nested": {{
                    "path": "dataObject.paymentDetails.bill.billDetails.billAccountDetails"
                  }},
                  "aggs": {{
                    "aggrFilter": {{
                      "filter": {{
                        "terms": {{
                          "dataObject.paymentDetails.bill.billDetails.billAccountDetails.taxHeadCode.keyword": [
                            "TL_TAX"
                          ]
                        }}
                      }},
                      "aggs": {{
                        "amount" : {{
                          "sum": {{
                            "field": "dataObject.paymentDetails.bill.billDetails.billAccountDetails.amount"
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


def extract_tl_todays_trade_licenses(metrics, region_bucket):
    status_agg = region_bucket.get('Status')
    status_buckets = status_agg.get('buckets')
    grouped_by = []
    for status_bucket in status_buckets:
        grouped_by.append({'name': status_bucket.get('key'), 'value': status_bucket.get(
            'todaysTradeLicenses').get('value') if status_bucket.get('todaysTradeLicenses') else 0})
    metrics['todaysTradeLicenses'] = [
        {'groupBy': 'status', 'buckets': grouped_by}]
    return metrics


tl_todays_trade_licenses = {'path': 'tlindex-v1-enriched/_search',
                            'name': 'tl_todays_trade_licenses',
                            'lambda': extract_tl_todays_trade_licenses,
                            'query': """
{{
  "size":0 ,
    "query": {{
        "bool": {{
          "must_not": [
            {{
              "term": {{
                "Data.tradelicense.tenantId.keyword": "pb.testing"
              }}
            }}
          ],
      "must": [
            {{
                "range": {{
                    "Data.tradelicense.issuedDate": {{
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
                "field": "Data.tradelicense.tenantId.keyword",
                "size":10000
              }},
        "aggs": {{
         "region": {{
          "terms": {{
          "field": "Data.tenantData.city.districtName.keyword",
          "size":10000
          }},
            "aggs": {{
                      "Status": {{
                        "terms": {{
                          "field": "Data.tradelicense.status.keyword"
                        }},
                        "aggs": {{
                          "todaysTradeLicenses": {{
                           "cardinality": {{
                             "field": "Data.tradelicense.licenseNumber.keyword"
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


def extract_tl_total_transactions(metrics, region_bucket):
    metrics['transactions'] = region_bucket.get('transactions').get(
        'value') if region_bucket.get('transactions') else 0
    return metrics


tl_total_transactions = {'path': 'dss-collection_v2/_search',
                         'name': 'tl_total_transactions',
                         'lambda': extract_tl_total_transactions,
                         'query': """
{{
  "size":0,
  "query": {{	
        "bool": {{
          "must_not": [
            {{
              "term": {{
                "dataObject.tenantId.keyword": "pb.testing"
              }}
            }},
            {{
              "terms": {{
                "dataObject.paymentDetails.bill.status.keyword": [
                  "Cancelled"
                ]
              }}
            }}
          ],
        "must": [
            {{
                "range": {{
                    "dataObject.paymentDetails.receiptDate": {{
                    "gte": {0},
                    "lte": {1},
                    "format": "epoch_millis"
                }}
              }}
            }},
            {{
          "term": {{
            "dataObject.paymentDetails.businessService.keyword": {{
              "value": "TL"
            }}
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
                "field": "dataObject.tenantId.keyword",
                "size":10000
              }},
        "aggs": {{
         "region": {{
            "terms": {{
              "field": "dataObject.tenantData.city.districtName.keyword",
              "size":10000
            }},
                  "aggs": {{
                    "transactions": {{
                      "value_count": {{
                        "field": "dataObject.transactionNumber.keyword"
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


def extract_applications_moved_today(metrics, region_bucket):
    status_agg = region_bucket.get('applicationsMovedToday')
    status_buckets = status_agg.get('buckets')
    grouped_by = []
    for status_bucket in status_buckets:
        grouped_by.append({'name': status_bucket.get('key'), 'value': status_bucket.get(
            'applicationsMovedToday').get('value') if status_bucket.get('applicationsMovedToday') else 0})
    metrics['applicationsMovedToday'] = [
        {'groupBy': 'status', 'buckets': grouped_by}]
    return metrics


tl_applications_moved_today = {'path': 'tlindex-v1-enriched/_search',
                               'name': 'tl_applications_moved_today',
                               'lambda': extract_applications_moved_today,
                               'query': """
{{
  "size":0,
   "query": {{
        "bool": {{
          "must_not": [
            {{
              "term": {{
                "Data.tradelicense.tenantId.keyword": "pb.testing"
              }}
            }}
          ],
      "must": [
            {{
                "range": {{
                    "Data.history.auditDetails.createdTime": {{
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
                "field": "Data.tradelicense.tenantId.keyword",
                "size":10000
              }},
        "aggs": {{
         "region": {{
          "terms": {{
          "field": "Data.tenantData.city.districtName.keyword",
          "size":10000
          }},
          "aggs": {{
            "applicationsMovedToday": {{
              "terms": {{
                "field": "Data.history.state.applicationStatus.keyword"
              }},
              "aggs": {{
                "applicationsMovedToday": {{
                  "value_count": {{
                    "field": "Data.tradelicense.applicationNumber.keyword"
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





def extract_collections_by_trade_category(metrics, region_bucket):
    tradeType_agg = region_bucket.get('tradeType')
    tradeType_buckets = tradeType_agg.get('buckets')
    grouped_by = []
    for tradeType_bucket in tradeType_buckets:
        grouped_by.append({'name': tradeType_bucket.get('key'), 'value': tradeType_bucket.get(
            'todaysCollection').get('value') if tradeType_bucket.get('todaysCollection') else 0})
    metrics['todaysCollection'] = [{'groupBy': 'tradeType', 'buckets': grouped_by}]
    return metrics


tl_collections_by_trade_category = {'path': 'dss-collection_v2/_search',
                                    'name': 'tl_collections_by_trade_category',
                                    'lambda': extract_collections_by_trade_category,
                                    'query': """
{{
  "size": 0,
    "query": {{
        "bool": {{
          "must_not": [
            {{
              "term": {{
                "dataObject.tenantId.keyword": "pb.testing"
              }}
            }},
            {{
              "terms": {{
                "dataObject.paymentDetails.bill.status.keyword": [
                  "Cancelled"
                ]
              }}
            }}
          ],
          "must": [
            {{
              "term": {{
                "dataObject.paymentDetails.businessService.keyword": "TL"
              }}
            }},
            {{liveUlbsCount
              "range": {{
                      "dataObject.paymentDetails.receiptDate": {{
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
         "region_buckets": {{
            "terms": {{
              "field": "dataObject.tenantData.city.districtCode.keyword",
              "size":10000
            }},
          "aggs": {{
            "ulb_buckets": {{
              "terms": {{
                "field": "dataObject.tenantId.keyword",
                "size":10000
              }},
              "aggs": {{
                "ward_buckets": {{
                  "terms": {{
                    "field": "domainObject.ward.name.keyword",
                    "size":10000
                  }},
                "aggs": {{
                    "byTradeType": {{
                      "terms": {{
                       "field": "domainObject.tradelicense.calculation.tradeLicense.tradeLicenseDetail.tradeUnits.tradeType.keyword",
                        "size":1
                      }},
                  "aggs": {{
                    "Total Collection": {{
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


def extract_todays_license_by_sla(metrics, region_bucket):
    metrics['todaysLicenseIssuedWithinSLA'] = region_bucket.get('todaysLicenseIssuedWithinSLA').get(
        'doc_count') if region_bucket.get('todaysLicenseIssuedWithinSLA') else 0
    return metrics


tl_license_issued_within_sla = {'path': 'tlindex-v1-enriched/_search',
                                'name': 'tl_license_issued_within_sla',
                                'lambda': extract_todays_license_by_sla,
                                'query': """
{{
  "size": 0, 
  "query" :{{
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
          "ward": {{
            "terms": {{
              "field": "Data.ward.name.keyword",
              "size":10000
            }},
   "aggs": {{
      "ulb": {{
        "terms": {{
          "field": "Data.tradelicense.tenantId.keyword",
          "size":10000
        }},
  "aggs": {{
   "region": {{
    "terms": {{
    "field": "Data.tenantData.city.districtName.keyword",
    "size":10000
    }},
      "aggs": {{
            "todaysLicenseIssuedWithinSLA": {{
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


def extract_tl_todays_collection_by_trade_type(metrics, region_bucket):
    preval = 0
    tt_agg = region_bucket.get('tradeType')
    tt_buckets = tt_agg.get('buckets')
    grouped_by = []
    for tt_bucket in tt_buckets:
        if preval != tt_bucket.get('todaysCollection').get('value'):
            grouped_by.append({'name': tt_bucket.get('key'), 'value': tt_bucket.get(
                'todaysCollection').get('value') if tt_bucket.get('todaysCollection') else 0})
            metrics['todaysCollection'] = [
                {'groupBy': 'tradeType', 'buckets': grouped_by}]
        preval = tt_bucket.get(
            'todaysCollection').get('value')
    return metrics


tl_todays_collection_by_trade_type = {'path': 'dss-collection_v2/_search',
                                      'name': 'tl_todays_collection_by_trade_type',
                                      'lambda': extract_tl_todays_collection_by_trade_type,
                                      'query':
                                          """
         {{
           "size": 0,
           "query": {{
             "bool": {{
               "must_not": [
                 {{
                   "term": {{
                     "dataObject.tenantId.keyword": "pb.testing"
                   }}
                 }},
                 {{
                   "terms": {{
                     "dataObject.paymentDetails.bill.status.keyword": [
                       "Cancelled"
                     ]
                   }}
                 }}
               ],
               "must": [
                 {{
                   "term": {{
                     "dataObject.paymentDetails.businessService.keyword": "TL"
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
               "filter": {{
                 "exists": {{
                   "field": "domainObject.tradelicense.tradeLicenseDetail.tradeUnits.tradeType"
                 }}
               }}
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
                     "field": "dataObject.tenantId.keyword",
                     "size":10000
                   }},
                   "aggs": {{
                     "region": {{
                       "terms": {{
                         "field": "dataObject.tenantData.city.districtName.keyword",
                         "size":10000
                       }},
                       "aggs": {{
                         "tradeType": {{
                           "terms": {{
                             "field": "domainObject.tradelicense.tradeLicenseDetail.tradeUnits.tradeType.keyword"
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



tl_queries = [tl_license_issued_by_boundary, tl_collection_adhoc_penalty,
              tl_collection_adhoc_rebate, tl_collection_tax, tl_todays_trade_licenses, tl_total_transactions, tl_license_issued_within_sla, tl_todays_collection_by_trade_type]

#the default payload for TL
def empty_tl_payload(region, ulb, ward, date):
    return {
        "date": date,
        "module": "TL",
        "ward": ward,
        "ulb": ulb,
        "region": region,
        "state": "Punjab",
        "metrics": {
            "transactions": 0,
            "todaysApplications": 0,
            "tlTax": 0,
            "adhocPenalty": 0,
            "adhocRebate": 0,
            "todaysLicenseIssuedWithinSLA": 0,
            "todaysCollection": [
                {
                    "groupBy": "tradeType",
                    "buckets": [

                    ]
                }
            ],
            "todaysTradeLicenses": [
                {
                    "groupBy": "status",
                    "buckets": [

                    ]
                }
            ],
            "applicationsMovedToday": [
                {
                    "groupBy": "status",
                    "buckets": [
                        {
                            "name": "FIELDINSPECTION",
                            "value": 0
                        },
                        {
                            "name": "INITIATED",
                            "value": 0
                        },
                        {
                            "name": "REJECTED",
                            "value": 0
                        }
                    ]
                }
            ]
        }
    }