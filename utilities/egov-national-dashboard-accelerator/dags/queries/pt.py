
import logging


def extract_pt_closed_applications(metrics, region_bucket):
  metrics['todaysClosedApplications'] = region_bucket.get('todaysClosedApplications').get(
        'value') if region_bucket.get('todaysClosedApplications') else 0
  return metrics
  
pt_closed_applications = {'path': 'property-services/_search',
                                  'name': 'pt_closed_applications',
                                  'lambda': extract_pt_closed_applications,
                                  'query':
                                 """

{{
  "size": 0,
    "query": {{
        "bool": {{
          "must_not": [
            {{
              "term": {{
                "Data.tenantId.keyword": "uk.testing"
              }}
            }}
          ],
          "must" : [
               {{
                "terms": {{
                  "Data.status.keyword": [
                    "closed",
                    "resolved"
                  ]
                }}
                }},
            {{
               "range":{{
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
                                "todaysClosedApplications": {{
                                  "value_count": {{
                                    "field": "Data.propertyId.keyword"
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


def extract_pt_total_applications(metrics, region_bucket):
  metrics['todaysTotalApplications'] = region_bucket.get('todaysTotalApplications').get('value')  if region_bucket.get('todaysTotalApplications')  else 0
  return metrics

pt_total_applications = {'path': 'property-application/_search',
                                 'name': 'pt_total_applications',
                                 'lambda': extract_pt_total_applications,
                                 'query':
                                 """
{{
  "size": 0,
    "query": {{
        "bool": {{
          "must_not": [
            {{
              "term": {{
                "Data.tenantId.keyword": "uk.testing"
              }}
            }}
          ],
        "must" : [
            {{
               "range":{{
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
                      "todaysTotalApplications" : {{
                        "value_count": {{
                          "field": "Data.propertyId.keyword"
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

def extract_pt_no_of_properties_paid(metrics, region_bucket):
    logging.info
    metrics['noOfPropertiesPaidToday'] = region_bucket.get('noOfPropertiesPaidToday').get('value')  if region_bucket.get('noOfPropertiesPaidToday')  else 0
    return metrics

pt_no_of_properties_paid = {'path': 'dss-collection_v2/_search',
                         'name': 'pt_no_of_properties_paid',
                         'lambda': extract_pt_no_of_properties_paid,
                         'query':
                             """
{{
            "size": 0,
              "query": {{
                  "bool": {{
                    "must_not": [
                      {{
                        "term": {{
                          "dataObject.tenantId.keyword": "uk.testing"
                        }}
                      }},
                      {{
                        "terms": {{
                          "dataObject.paymentDetails.bill.status.keyword": [
                            "CANCELLED"
                          ]
                        }}
                      }}
                    ],
                    "must" : [
                              {{
                         "range":{{
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
                        "value": "PT"
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
                              "noOfPropertiesPaidToday": {{
                                "value_count": {{
                                  "field": "dataObject.paymentDetails.businessService.keyword"
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

def extract_pt_collection_transactions_by_usage(metrics, region_bucket):
  groupby_transactions = []
  groupby_collections = []
  collections = []
  transactions = []

  if region_bucket.get('byUsageType'):
    usage_buckets = region_bucket.get('byUsageType').get('buckets')
    for usage_bucket in usage_buckets:
      usage = usage_bucket.get('key')
      transaction_value = usage_bucket.get('transactions').get('value') if usage_bucket.get('transactions') else 0
      groupby_transactions.append({ 'name' : usage.upper(), 'value' : transaction_value})
      collection_value = usage_bucket.get('todaysCollection').get("amount").get('value') if usage_bucket.get('todaysCollection').get("amount") else 0
      groupby_collections.append({ 'name' : usage.upper(), 'value' : collection_value})
  
 

  collections.append({ 'groupBy': 'usageCategory', 'buckets' : groupby_collections})
  transactions.append({ 'groupBy': 'usageCategory', 'buckets' : groupby_transactions})
  metrics['todaysCollection'] = collections
  metrics['transactions'] = transactions
  
  
  return metrics

pt_collection_transactions_by_usage = {'path': 'dss-collection_v2/_search',
                                 'name': 'pt_collection_transactions_by_usage',
                                 'lambda': extract_pt_collection_transactions_by_usage,
                                 'query':
                                 """
{{
  "size": 0,
    "query": {{
        "bool": {{
          "must_not": [
            {{
              "term": {{
                "dataObject.tenantId.keyword": "uk.testing"
              }}
            }},
            {{
              "terms": {{
                "dataObject.paymentDetails.bill.status.keyword": [
                      "CANCELLED"
                ]
              }}
            }}
          ],
          "must" : [
                    {{
               "range":{{
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
              "value": "PT"
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
                    "byUsageType": {{
                      "terms": {{
                        "field": "domainObject.usageCategory.keyword"
                      }},
                      "aggs": {{
                        "todaysCollection": {{
                                "nested": {{
                "path": "dataObject.paymentDetails.bill.billDetails.billAccountDetails"
                 }},
                         "aggs": {{
                    "amount": {{
                      "sum": {{
                        "field": "dataObject.paymentDetails.bill.billDetails.billAccountDetails.adjustedAmount"
                      }}
                    }}
                  }}
                        }},
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
}}
}}


"""
                                 }

def extract_pt_collection_taxes(metrics, region_bucket):
  groupby_rebate = []
  groupby_penalty = []
  groupby_interest = []
  groupby_propertytax = []
  rebate=  []
  penalty =  []
  interest = []
  propertytax = []

  if region_bucket.get('byUsageType'):
    usage_buckets = region_bucket.get('byUsageType').get('buckets')
    for usage_bucket in usage_buckets:
      usage = usage_bucket.get('key')
      interest_value = usage_bucket.get('interest').get('aggrFilter').get('amount').get('value') if usage_bucket.get('interest').get('aggrFilter').get('amount') else 0
      groupby_interest.append({ 'name' : usage.upper(), 'value' : interest_value})
      penalty_value = usage_bucket.get('penalty').get('aggrFilter').get('amount').get('value') if usage_bucket.get('penalty').get('aggrFilter').get('amount') else 0
      groupby_penalty.append({ 'name' : usage.upper(), 'value' : penalty_value})
      rebate_value = usage_bucket.get('rebate').get('aggrFilter').get('amount').get('value') if usage_bucket.get('rebate').get('aggrFilter').get('amount') else 0
      groupby_rebate.append({ 'name' : usage.upper(), 'value' : rebate_value})
      propertytax_value = usage_bucket.get('propertyTax').get('aggrFilter').get('amount').get('value') if usage_bucket.get('propertyTax').get('aggrFilter').get('amount') else 0
      groupby_propertytax.append({ 'name' : usage.upper(), 'value' : propertytax_value})

  
 

  interest.append({ 'groupBy': 'usageCategory', 'buckets' : groupby_interest})
  penalty.append({ 'groupBy': 'usageCategory', 'buckets' : groupby_penalty})
  rebate.append({ 'groupBy': 'usageCategory', 'buckets' : groupby_rebate})
  propertytax.append({ 'groupBy': 'usageCategory', 'buckets' : groupby_propertytax})
  metrics['interest'] = interest
  metrics['penalty'] = penalty
  metrics['rebate'] = rebate
  metrics['propertyTax'] = propertytax

  
  
  return metrics

pt_collection_taxes = {'path': 'dss-collection_v2/_search',
                                 'name': 'pt_collection_taxes',
                                 'lambda': extract_pt_collection_taxes,
                                 'query':
                                 """
{{
  "size": 0,
    "query": {{
        "bool": {{
          "must_not": [
            {{
              "term": {{
                "dataObject.tenantId.keyword": "uk.testing"
              }}
            }},
            {{
              "terms": {{
                "dataObject.paymentDetails.bill.status.keyword": [
                          "CANCELLED"
                ]
              }}
            }}
          ],
          "must": [
            {{
                   "range":{{
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
              "value": "PT"
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
                      "byUsageType":{{
                        "terms": {{
                          "field": "domainObject.usageCategory.keyword"
                        }},
                    "aggs" : {{
                    "propertyTax": {{
                      "nested": {{
                        "path": "dataObject.paymentDetails.bill.billDetails.billAccountDetails"
                      }},
                      "aggs": {{
                        "aggrFilter": {{
                          "filter": {{
                            "terms": {{
                              "dataObject.paymentDetails.bill.billDetails.billAccountDetails.taxHeadCode.keyword": [
                                "PT_TAX",
                                "PT_ROUNDOFF",
                                "PT_ADVANCE_CARRYFORWARD",
                                "FIRENOC_FEES",
                                "PT_DECIMAL_CEILING_CREDIT",
                                "PT_DECIMAL_CEILING_DEBIT"
                              ]
                            }}
                          }},
                          "aggs": {{
                            "amount": {{
                              "sum": {{
                                "field": "dataObject.paymentDetails.bill.billDetails.billAccountDetails.adjustedAmount"
                              }}
                            }}
                          }}
                        }}
                      }}
          }},
                    "rebate": {{
                      "nested": {{
                        "path": "dataObject.paymentDetails.bill.billDetails.billAccountDetails"
                      }},
                      "aggs": {{
                        "aggrFilter": {{
                          "filter": {{
                            "terms": {{
                              "dataObject.paymentDetails.bill.billDetails.billAccountDetails.taxHeadCode.keyword": [
                                "PT_TIME_REBATE",
                               "PT_ADHOC_REBATE",
                               "PT_UNIT_USAGE_EXEMPTION",
                                "PT_OWNER_EXEMPTION"
                              ]
                            }}
                          }},
                          "aggs": {{
                            "amount": {{
                              "sum": {{
                                "field": "dataObject.paymentDetails.bill.billDetails.billAccountDetails.adjustedAmount"
                              }}
                            }}
                          }}
                        }}
                      }}
                    }},
                    "penalty": {{
                      "nested": {{
                        "path": "dataObject.paymentDetails.bill.billDetails.billAccountDetails"
                      }},
                      "aggs": {{
                        "aggrFilter": {{
                          "filter": {{
                            "terms": {{
                              "dataObject.paymentDetails.bill.billDetails.billAccountDetails.taxHeadCode.keyword": [
                                "PT_TIME_PENALTY",
                                "PT_ADHOC_PENALTY"
                              ]
                            }}
                          }},
                          "aggs": {{
                            "amount": {{
                              "sum": {{
                                "field": "dataObject.paymentDetails.bill.billDetails.billAccountDetails.adjustedAmount"
                              }}
                            }}
                          }}
                        }}
                      }}
                    }},
                    "interest": {{
                      "nested": {{
                        "path": "dataObject.paymentDetails.bill.billDetails.billAccountDetails"
                      }},
                      "aggs": {{
                        "aggrFilter": {{
                          "filter": {{
                            "terms": {{
                              "dataObject.paymentDetails.bill.billDetails.billAccountDetails.taxHeadCode.keyword": [
                                "PT_TIME_INTEREST"
                              ]
                            }}
                          }},
                          "aggs": {{
                            "amount": {{
                              "sum": {{
                                "field": "dataObject.paymentDetails.bill.billDetails.billAccountDetails.adjustedAmount"
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
  }}
}}



"""
                                 }

def extract_pt_collection_cess(metrics, region_bucket):
  groupby_transactions = []
  groupby_collections = []
  collections =  []
  transactions = []
  if region_bucket.get('byUsageType'):
    usage_buckets = region_bucket.get('byUsageType').get('buckets')
    for usage_bucket in usage_buckets:
      usage = usage_bucket.get('key')
      transaction_value = usage_bucket.get('all_matching_docs').get('buckets').get('all').get('cess').get('value') if usage_bucket.get('all_matching_docs').get('buckets').get('all').get('cess').get('value')  else 0
      groupby_transactions.append({ 'name' : usage.upper(), 'value' : transaction_value})

  

  collections.append({ 'groupBy': 'usageCategory', 'buckets' : groupby_transactions})
  metrics['cess'] = collections
  
  
  return metrics

pt_collection_cess = {'path': 'dss-collection_v2/_search',
                                 'name': 'pt_collection_cess',
                                 'lambda': extract_pt_collection_cess,
                                 'query':
                                 """
{{
  "size": 0,
    "query": {{
        "bool": {{
          "must_not": [
            {{
              "term": {{
                "dataObject.tenantId.keyword": "uk.testing"
              }}
            }},
            {{
              "terms": {{
                "dataObject.paymentDetails.bill.status.keyword": [
                          "CANCELLED"
                ]
              }}
            }}
          ],
          "must": [
            {{
                   "range":{{
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
              "value": "PT"
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
                    "byUsageType": {{
                      "terms": {{
                        "field": "domainObject.usageCategory.keyword"
                      }},
                    "aggs": {{
                      "all_matching_docs": {{
                        "filters": {{
                          "filters": {{
                            "all": {{
                              "match_all": {{   }}
                            }}
                          }}
                        }},
                      "aggs": {{
                        "CancerCess": {{
                                          "nested": {{
                                            "path": "dataObject.paymentDetails.bill.billDetails.billAccountDetails"
                                          }},
                                          "aggs": {{
                                            "aggrFilter": {{
                                              "filter": {{
                                                "terms": {{
                                                  "dataObject.paymentDetails.bill.billDetails.billAccountDetails.taxHeadCode.keyword": [
                                                    "PT_CANCER_CESS"
                                                  ]
                                                }}
                                              }},
                                              "aggs": {{
                                                "value": {{
                                                  "sum": {{
                                                    "field": "dataObject.paymentDetails.bill.billDetails.billAccountDetails.adjustedAmount"
                                                  }}
                                                }}
                                              }}
                                            }}
                                          }}
                                        }},
                        "FireCess": {{
                                          "nested": {{
                                            "path": "dataObject.paymentDetails.bill.billDetails.billAccountDetails"
                                          }},
                                          "aggs": {{
                                            "aggrFilter": {{
                                              "filter": {{
                                                "terms": {{
                                                  "dataObject.paymentDetails.bill.billDetails.billAccountDetails.taxHeadCode.keyword": [
                                                    "PT_FIRE_CESS"
                                                  ]
                                                }}
                                              }},
                                              "aggs": {{
                                                "value": {{
                                                  "sum": {{
                                                    "field": "dataObject.paymentDetails.bill.billDetails.billAccountDetails.adjustedAmount"
                                                  }}
                                                }}
                                              }}
                                            }}
                                          }}
                                        }},
                           "cess": {{
                          "bucket_script": {{
                            "buckets_path": {{
                              "closed": "FireCess>aggrFilter>value",
                              "total": "CancerCess>aggrFilter>value"
                            }},
                            "script": "params.closed + params.total"
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


def extract_pt_assessed_properties(metrics, region_bucket):
  groupby_assessedproperties = []
  assessedproperties = []

  if region_bucket.get('byUsageType'):
    usage_buckets = region_bucket.get('byUsageType').get('buckets')
    for usage_bucket in usage_buckets:
      usage = usage_bucket.get('key')
      transaction_value = usage_bucket.get('assessedProperties').get('value') if usage_bucket.get('assessedProperties') else 0
      groupby_assessedproperties.append({ 'name' : usage.upper(), 'value' : transaction_value})
  

  assessedproperties.append({ 'groupBy': 'usageCategory', 'buckets' : groupby_assessedproperties})
  metrics['assessedProperties'] = assessedproperties

  return metrics

pt_assessed_properties = {'path':'property-services/_search',
                                 'name': 'pt_assessed_properties_by_usage',
                                 'lambda': extract_pt_assessed_properties,
                                 'query':
                                 """
{{
  "size": 0,
    "query": {{
        "bool": {{
          "must_not": [
            {{
              "term": {{
                "Data.tenantId.keyword": "uk.testing"
              }}
            }}
          ],
          "must": [
            {{
                   "range":{{
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
   "aggs" : {{
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
                    "byUsageType": {{
                      "terms": {{
                        "field": "Data.usageCategory.keyword"
                        }},
                "aggs": {{	
                  "assessedProperties": {{
                    "value_count": {{
                      "field": "Data.propertyId.keyword"
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


 
def extract_pt_properties_registered_by_year(metrics, region_bucket):
  fy_agg = region_bucket.get('financialYear')
  fy_buckets = fy_agg.get('buckets')
  grouped_by = []
  for fy_bucket in fy_buckets:
      grouped_by.append({'name': fy_bucket.get('key'), 'value': fy_bucket.get(
          'propertiesRegistered').get('value') if fy_bucket.get('propertiesRegistered') else 0})
  metrics['propertiesRegistered'] = [
      {'groupBy': 'financialYear', 'buckets': grouped_by}]
  return metrics
  
pt_properties_registered_by_year = {'path': 'property-assessments/_search',
                                 'name': 'pt_properties_registered_by_year',
                                 'lambda': extract_pt_properties_registered_by_year,
                                 'query':
                                 """

{{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "term": {{
            "Data.tenantId.keyword": "uk.testing"
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
        "field": "Data.ward.locality.name.keyword",
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
                "field": "Data.tenantData.city.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "financialYear": {{
                  "terms": {{
                    "field": "Data.financialYear.keyword"
                  }},
                  "aggs": {{
                    "propertiesRegistered": {{
                      "cardinality": {{
                        "field": "Data.propertyId.keyword"
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


def extract_pt_properties_assessments(metrics, region_bucket):
  metrics['assessments'] = region_bucket.get('assesments').get(
        'value') if region_bucket.get('assesments') else 0
  logging.info("PT total Assessment")
  logging.info(metrics)
  return metrics
  
pt_properties_assessments = {'path': 'property-assessments/_search',
                                 'name': 'pt_properties_assessments',
                                 'lambda': extract_pt_properties_assessments,
                                 'query':
                                 """

{{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "term": {{
            "Data.tenantId.keyword": "uk.testing"
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
        "field": "Data.ward.locality.name.keyword",
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
                "field": "Data.tenantData.city.name.keyword",
                "size":10000
              }},
              "aggs": {{
                "assesments": {{
                  "value_count": {{
                    "field": "Data.assessmentNumber.keyword"
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



pt_queries = [pt_closed_applications, pt_total_applications,
              pt_collection_transactions_by_usage, pt_collection_taxes, pt_collection_cess, 
              pt_assessed_properties,pt_properties_registered_by_year,pt_properties_assessments,
              pt_no_of_properties_paid]


#the default payload for PT
def empty_pt_payload(region, ulb, ward, date):
    return {
            "date": date,
            "module": "PT",
            "ward": ward,
            "ulb": ulb,
            "region": region,
            "state": "Uttrakhand",
            "metrics": {
                "assessments": 0,
                "todaysTotalApplications": 0,
                "todaysClosedApplications" : 0,
                "noOfPropertiesPaidToday": 0,
                "propertiesRegistered": [
                    {
                        "groupBy": "financialYear",
                        "buckets": [
                            {
                                "name": "2018-19",
                                "value": 0
                            },
                            {
                                "name": "2019-20",
                                "value": 0
                            },
                            {
                                "name": "2020-21",
                                "value": 0
                            }
                        ]
                    }
                ],
                "assessedProperties": [
                   {
                        "groupBy": "usageCategory",
                        "buckets": [
                            {
                                "name": "RESIDENTIAL",
                                "value": 0
                            },
                            {
                                "name": "COMMERCIAL",
                                "value": 0
                            },
                            {
                                "name": "INDUSTRIAL",
                                "value": 0
                            }
                        ]
                    }
                ],
                "transactions": [
                    {
                        "groupBy": "usageCategory",
                        "buckets": [
                            {
                                "name": "RESIDENTIAL",
                                "value": 0
                            },
                            {
                                "name": "COMMERCIAL",
                                "value": 0
                            },
                            {
                                "name": "INDUSTRIAL",
                                "value": 0
                            }
                        ]
                    }
                ],
                "todaysCollection": [
                  {
                        "groupBy": "usageCategory",
                        "buckets": [
                            {
                                "name": "RESIDENTIAL",
                                "value": 0
                            },
                            {
                                "name": "COMMERCIAL",
                                "value": 0
                            },
                            {
                                "name": "INDUSTRIAL",
                                "value": 0
                            }
                        ]
                    }
                ],
                "propertyTax": [
                    {
                        "groupBy": "usageCategory",
                        "buckets": [
                            {
                                "name": "RESIDENTIAL",
                                "value": 0
                            },
                            {
                                "name": "COMMERCIAL",
                                "value": 0
                            },
                            {
                                "name": "INDUSTRIAL",
                                "value": 0
                            }
                        ]
                    }
                ],
                "cess": [
                    {
                        "groupBy": "usageCategory",
                        "buckets": [
                            {
                                "name": "RESIDENTIAL",
                                "value": 0
                            },
                            {
                                "name": "COMMERCIAL",
                                "value": 0
                            },
                            {
                                "name": "INDUSTRIAL",
                                "value": 0
                            }
                        ]
                    }
                ],
                "rebate": [
                    {
                        "groupBy": "usageCategory",
                        "buckets": [
                            {
                                "name": "RESIDENTIAL",
                                "value": 0
                            },
                            {
                                "name": "COMMERCIAL",
                                "value": 0
                            },
                            {
                                "name": "INDUSTRIAL",
                                "value": 0
                            }
                        ]
                    }
                ],
                "penalty": [
                    {
                        "groupBy": "usageCategory",
                        "buckets": [
                            {
                                "name": "RESIDENTIAL",
                                "value": 0
                            },
                            {
                                "name": "COMMERCIAL",
                                "value": 0
                            },
                            {
                                "name": "INDUSTRIAL",
                                "value": 0
                            }
                        ]
                    }
                ],
                "interest": [
                    {
                        "groupBy": "usageCategory",
                        "buckets": [
                            {
                                "name": "RESIDENTIAL",
                                "value": 0
                            },
                            {
                                "name": "COMMERCIAL",
                                "value": 0
                            },
                            {
                                "name": "INDUSTRIAL",
                                "value": 0
                            }
                        ]
                    }
                ]
            }
        }
