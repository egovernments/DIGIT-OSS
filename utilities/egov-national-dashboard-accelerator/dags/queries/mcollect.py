

def extract_mcollect_total_by_categories(metrics, region_bucket):
    metrics['numberOfCategories'] = region_bucket.get('numberOfCategories').get(
        'value') if region_bucket.get('numberOfCategories') else 0
    return metrics

mcollect_total_by_categories = {
    'path': 'dss-collection_v2/_search',
    'name': 'mcollect_total_by_categories',
    'lambda': extract_mcollect_total_by_categories,
    'query': """
   {{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "terms": {{
            "dataObject.tenantId.keyword": [
              "pb.testing",
              "pb"
            ]
          }}
        }},
        {{
          "terms": {{
            "dataObject.paymentDetails.bill.status.keyword": [
              "Cancelled"
            ]
          }}
        }},
        {{
          "terms": {{
            "dataObject.paymentDetails.businessService.keyword": [
              "TL",
              "PT",
              "WS.ONE_TIME_FEE",
              "SW.ONE_TIME_FEE",
              "FSM.TRIP_CHARGES",
              "PT.MUTATION",
              "SW",
              "BPA.LOW_RISK_PERMIT_FEE",
              "BPA.NC_SAN_FEE",
              "BPA.NC_APP_FEE",
              "BPA.NC_OC_APP_FEE"
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
                "numberOfCategories": {{
                  "cardinality": {{
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


def extract_mcollect_todays_collection(metrics, region_bucket):
    status_agg = region_bucket.get('byStatus')
    status_buckets = status_agg.get('buckets')
    all_dims = []
    grouped_by = []
    for status_bucket in status_buckets:
        grouped_by.append({'name': status_bucket.get('key'), 'value': status_bucket.get(
            'status').get('value') if status_bucket.get('status') else 0})
    all_dims.append(
        {'groupBy': 'status', 'buckets': grouped_by})

    paymentMode_agg = region_bucket.get('bypaymentMode')
    paymentMode_buckets = paymentMode_agg.get('buckets')
    grouped_by = []
    for paymentMode_bucket in paymentMode_buckets:
        grouped_by.append({'name': paymentMode_bucket.get('key'), 'value': paymentMode_bucket.get(
            'paymentMode').get('value') if paymentMode_bucket.get('paymentMode') else 0})
    all_dims.append(
        {'groupBy': 'paymentMode', 'buckets': grouped_by})

    category_agg = region_bucket.get('byCategory')
    category_buckets = category_agg.get('buckets')
    grouped_by = []
    for category_bucket in category_buckets:
        grouped_by.append({'name': category_bucket.get('key'), 'value': category_bucket.get(
            'category').get('value') if category_bucket.get('category') else 0})
    all_dims.append(
        {'groupBy': 'category', 'buckets': grouped_by})


    metrics['todaysCollection'] = all_dims
    return metrics

mcollect_todays_collection = {
    'path': 'dss-collection_v2/_search',
    'name': 'mcollect_todays_collection',
    'lambda': extract_mcollect_todays_collection,
    'query': """
  {{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "terms": {{
            "dataObject.tenantId.keyword": [
              "pb.testing",
              "pb"
            ]
          }}
        }},
        {{
          "terms": {{
            "dataObject.paymentDetails.bill.status.keyword": [
              "Cancelled"
            ]
          }}
        }},
        {{
          "terms": {{
            "dataObject.paymentDetails.businessService.keyword": [
              "TL",
              "PT",
              "WS.ONE_TIME_FEE",
              "SW.ONE_TIME_FEE",
              "FSM.TRIP_CHARGES",
              "PT.MUTATION",
              "SW",
              "WS",
              "BPA.LOW_RISK_PERMIT_FEE",
              "BPA.NC_SAN_FEE",
              "BPA.NC_APP_FEE",
              "BPA.NC_OC_APP_FEE"
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
                "bypaymentMode": {{
                  "terms": {{
                    "field": "dataObject.paymentMode.keyword"
                  }},
                  "aggs": {{
                    "paymentMode": {{
                      "sum": {{
                        "field": "dataObject.paymentDetails.totalAmountPaid"
                      }}
                    }}
                  }}
                }},
                "byStatus": {{
                  "terms": {{
                    "field": "dataObject.paymentStatus.keyword"
                  }},
                  "aggs": {{
                    "status": {{
                      "sum": {{
                        "field": "dataObject.paymentDetails.totalAmountPaid"
                      }}
                    }}
                  }}
                }},
                "byCategory": {{
                  "terms": {{
                    "field": "dataObject.paymentDetails.businessService.keyword"
                  }},
                  "aggs": {{
                    "category": {{
                      "sum": {{
                        "field":"dataObject.paymentDetails.totalAmountPaid"
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


def extract_mcollect_receipts(metrics, region_bucket):
    status_agg = region_bucket.get('byStatus')
    status_buckets = status_agg.get('buckets')
    all_dims = []
    grouped_by = []
    for status_bucket in status_buckets:
        grouped_by.append({'name': status_bucket.get('key'), 'value': status_bucket.get(
            'status').get('value') if status_bucket.get('status') else 0})
    all_dims.append(
        {'groupBy': 'status', 'buckets': grouped_by})

    paymentMode_agg = region_bucket.get('byPaymentMode')
    paymentMode_buckets = paymentMode_agg.get('buckets')
    grouped_by = []
    for paymentMode_bucket in paymentMode_buckets:
        grouped_by.append({'name': paymentMode_bucket.get('key'), 'value': paymentMode_bucket.get(
            'paymentMode').get('value') if paymentMode_bucket.get('paymentMode') else 0})
    all_dims.append(
        {'groupBy': 'paymentMode', 'buckets': grouped_by})

    category_agg = region_bucket.get('byCategory')
    category_buckets = category_agg.get('buckets')
    grouped_by = []
    for category_bucket in category_buckets:
        grouped_by.append({'name': category_bucket.get('key'), 'value': category_bucket.get(
            'category').get('value') if category_bucket.get('category') else 0})
    all_dims.append(
        {'groupBy': 'category', 'buckets': grouped_by})


    metrics['numberOfReceipts'] = all_dims
    return metrics

mcollect_receipts = {
    'path': 'dss-collection_v2/_search',
    'name': 'mcollect_receipts',
    'lambda': extract_mcollect_receipts,
    'query': """
  {{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "terms": {{
            "dataObject.tenantId.keyword": [
              "pb.testing",
              "pb"
            ]
          }}
        }},
        {{
          "terms": {{
            "dataObject.paymentDetails.bill.status.keyword": [
              "Cancelled"
            ]
          }}
        }},
        {{
          "terms": {{
            "dataObject.paymentDetails.businessService.keyword": [
              "TL",
              "PT",
              "WS.ONE_TIME_FEE",
              "SW.ONE_TIME_FEE",
              "FSM.TRIP_CHARGES",
              "PT.MUTATION",
              "SW",
              "WS",
              "BPA.LOW_RISK_PERMIT_FEE",
              "BPA.NC_SAN_FEE",
              "BPA.NC_APP_FEE",
              "BPA.NC_OC_APP_FEE"
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
                "byPaymentMode": {{
                  "terms": {{
                    "field": "dataObject.paymentMode.keyword"
                  }},
                  "aggs": {{
                    "paymentMode": {{
                      "value_count": {{
                        "field": "dataObject.paymentDetails.receiptNumber.keyword"
                      }}
                    }}
                  }}
                }},
                "byStatus": {{
                  "terms": {{
                    "field": "dataObject.paymentStatus.keyword"
                  }},
                  "aggs": {{
                    "status": {{
                      "value_count": {{
                        "field": "dataObject.paymentDetails.receiptNumber.keyword"
                      }}
                    }}
                  }}
                }},
                "byCategory": {{
                  "terms": {{
                    "field": "dataObject.paymentDetails.businessService.keyword"
                  }},
                  "aggs": {{
                    "category": {{
                      "value_count": {{
                        "field": "dataObject.paymentDetails.receiptNumber.keyword"
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



def extract_mcollect_challans(metrics, region_bucket):

    all_dims = []
    grouped_by = []

    challanStatus_agg = region_bucket.get('bychallanStatus')
    challanStatus_buckets = challanStatus_agg.get('buckets')
    grouped_by = []
    for challanStatus_bucket in challanStatus_buckets:
        grouped_by.append({'name': challanStatus_bucket.get('key'), 'value': challanStatus_bucket.get(
            'challanStatus').get('value') if challanStatus_bucket.get('challanStatus') else 0})
    all_dims.append(
        {'groupBy': 'challanStatus', 'buckets': grouped_by})

    category_agg = region_bucket.get('byCategory')
    category_buckets = category_agg.get('buckets')
    grouped_by = []
    for category_bucket in category_buckets:
        grouped_by.append({'name': category_bucket.get('key'), 'value': category_bucket.get(
            'category').get('value') if category_bucket.get('category') else 0})
    all_dims.append(
        {'groupBy': 'category', 'buckets': grouped_by})


    metrics['numberOfChallans'] = all_dims
    return metrics

mcollect_challans = {
    'path': 'dss-collection_v2/_search',
    'name': 'mcollect_challans',
    'lambda': extract_mcollect_challans,
    'query': """
  {{
  "size": 0,
  "query": {{
    "bool": {{
      "must_not": [
        {{
          "terms": {{
            "dataObject.tenantId.keyword": [
              "pb.testing",
              "pb"
            ]
          }}
        }},
        {{
          "terms": {{
            "dataObject.paymentDetails.bill.status.keyword": [
              "Cancelled"
            ]
          }}
        }},
        {{
          "terms": {{
            "dataObject.paymentDetails.businessService.keyword": [
              "TL",
              "PT",
              "WS.ONE_TIME_FEE",
              "SW.ONE_TIME_FEE",
              "FSM.TRIP_CHARGES",
              "PT.MUTATION",
              "SW",
              "WS",
              "BPA.LOW_RISK_PERMIT_FEE",
              "BPA.NC_SAN_FEE",
              "BPA.NC_APP_FEE",
              "BPA.NC_OC_APP_FEE"
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
                "bychallanStatus": {{
                  "terms": {{
                    "field": "dataObject.paymentDetails.bill.status.keyword"
                  }},
                  "aggs": {{
                    "challanStatus": {{
                      "value_count": {{
                        "field": "dataObject.paymentDetails.bill.consumerCode.keyword"
                      }}
                    }}
                  }}
                }},
                "byCategory": {{
                  "terms": {{
                    "field": "dataObject.paymentDetails.businessService.keyword"
                  }},
                  "aggs": {{
                    "category": {{
                      "value_count": {{
                        "field": "dataObject.paymentDetails.bill.consumerCode.keyword"
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


mcollect_queries = [mcollect_total_by_categories, mcollect_todays_collection, mcollect_receipts, mcollect_challans]


def empty_mcollect_payload(region, ulb, ward, date):
    return {
        "date": date,
        "module": "MCOLLECT",
        "ward": ward,
        "ulb": ulb,
        "region": region,
        "state": "Punjab",
        "metrics":  {
            "numberOfCategories": 0,
            "todaysCollection": [

            ],
            "numberOfReceipts": [

            ],
            "numberOfChallans": [

            ]
        }
    }
    