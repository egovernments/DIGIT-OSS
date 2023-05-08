
import logging


def extract_ws_collection_by_payment_channel_type(metrics, region_bucket):
  all_dims = []
  grouped_by = []

  
  channel_agg = region_bucket.get('byPaymentChannelType')  
  channel_buckets = channel_agg.get('buckets')
  grouped_by = []
  for channel_bucket in channel_buckets:  
      grouped_by.append({'name': channel_bucket.get('key'), 'value': channel_bucket.get(
            'todaysCollection').get('value') if channel_bucket.get('todaysCollection') else 0})
      all_dims.append(
        {'groupBy': 'paymentChannelType', 'buckets': grouped_by})
  
  channel_agg = region_bucket.get('byUsageType')  
  usage_type_buckets = channel_agg.get('buckets')
  grouped_by = []
  for usage_type_bucket in usage_type_buckets:
      grouped_by.append({'name': usage_type_bucket.get('key'), 'value': usage_type_bucket.get(
            'todaysCollection').get('value') if usage_type_bucket.get('todaysCollection') else 0})
      all_dims.append(
        {'groupBy': 'usageType', 'buckets': grouped_by})

  channel_agg = region_bucket.get('byConnectionType')  
  usage_type_buckets = channel_agg.get('buckets')
  grouped_by = []
  for usage_type_bucket in usage_type_buckets:
      grouped_by.append({'name': usage_type_bucket.get('key'), 'value': usage_type_bucket.get(
            'todaysCollection').get('value') if usage_type_bucket.get('todaysCollection') else 0})
      all_dims.append(
        {'groupBy': 'connectionType', 'buckets': grouped_by})

  channel_agg = region_bucket.get('byTaxHeads')  
  usage_type_buckets = channel_agg.get('buckets')
  grouped_by = []
  for usage_type_bucket in usage_type_buckets:
      grouped_by.append({'name': usage_type_bucket.get('key'), 'value': usage_type_bucket.get(
            'todaysCollection').get('value') if usage_type_bucket.get('todaysCollection') else 0})
      all_dims.append(
        {'groupBy': 'taxHeads', 'buckets': grouped_by})
  
  metrics['todaysCollection'] = all_dims
  return metrics

ws_collection_by_payment_channel_type = {'path': 'dss-collection_v2/_search',
                                 'name': 'ws_collection_by_payment_channel_type',
                                 'lambda': extract_ws_collection_by_payment_channel_type,
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
          "terms": {{
            "dataObject.paymentDetails.businessService.keyword": [
              "WS",
              "WS.ONE_TIME_FEE",
              "SW.ONE_TIME_FEE",
              "SW"
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
                "byUsageType": {{
                  "terms": {{
                    "field": "domainObject.propertyUsageType.keyword"
                  }},
                  "aggs": {{
                    "todaysCollection": {{
                      "sum": {{
                        "field": "dataObject.paymentDetails.totalAmountPaid"
                      }}
                    }}
                  }}
                }},
                "byConnectionType": {{
                  "terms": {{
                    "field": "domainObject.connectionType.keyword"
                  }},
                  "aggs": {{
                    "todaysCollection": {{
                      "sum": {{
                        "field": "dataObject.paymentDetails.totalAmountPaid"
                      }}
                    }}
                  }}
                }},
                "byPaymentChannelType": {{
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
                "byTaxHeads": {{
                  "nested": {{
                    "path": "dataObject.paymentDetails.bill.billDetails.billAccountDetails"
                  }},
                  "aggs": {{
                    "tags_name_terms": {{
                      "terms": {{
                        "field": "dataObject.paymentDetails.bill.billDetails.billAccountDetails.taxHeadCode.keyword"
                      }},
                      "aggs": {{
                        "todaysCollection": {{
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


def extract_ws_total_transactions(metrics, region_bucket):
    status_agg = region_bucket.get('transactions')
    status_buckets = status_agg.get('buckets')
    grouped_by = []
    for status_bucket in status_buckets:
        grouped_by.append({'name': status_bucket.get('key'), 'value': status_bucket.get(
            'transactions').get('value') if status_bucket.get('transactions') else 0})
    metrics['transactions'] = [
        {'groupBy': 'status', 'buckets': grouped_by}]
    return metrics

ws_total_transactions = {'path': 'dss-collection_v2/_search',
                         'name': 'ws_total_transactions',
                         'lambda': extract_ws_total_transactions,
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
          "terms": {{
            "dataObject.paymentDetails.businessService.keyword": [
              "WS",
              "WS.ONE_TIME_FEE",
              "SW.ONE_TIME_FEE",
              "SW"
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
      ]
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "domainObject.ward.name.keyword"
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "dataObject.tenantId.keyword"
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "dataObject.tenantData.city.districtName.keyword"
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

def extract_ws_water_connectioncreated_by_channel_and_connection_type(metrics, region_bucket):
  all_dims = metrics['connectionCreated'] if metrics.get(
      'connectionCreated') else []

  #get new metrics from region_bucket
  channel_agg = region_bucket.get('channelType')
  channel_buckets = channel_agg.get('buckets')
  grouped_by_channel = {}
  for channel_bucket in channel_buckets:
      grouped_by_channel[channel_bucket.get('key')] = channel_bucket.get(
          'connectionCreated').get('value') if channel_bucket.get('connectionCreated') else 0

  grouped_by_connection = {}
  channel_agg = region_bucket.get('connectionType')
  channel_buckets = channel_agg.get('buckets')
  for channel_bucket in channel_buckets:
      grouped_by_connection[channel_bucket.get('key')] = channel_bucket.get(
          'connectionCreated').get('value') if channel_bucket.get('connectionCreated') else 0

  for dim in all_dims:
    if dim and dim.get('groupBy') == 'channelType':
      buckets = dim.get('buckets')
      if buckets and len(buckets) > 0:
        for bucket in buckets:
          if bucket.get('name') and grouped_by_channel.get(bucket.get('name')):
            grouped_by_channel[bucket.get('name')] = grouped_by_channel[bucket.get(
                'name')] + bucket.get('value')
          else:
            grouped_by_channel[bucket.get('name')] = bucket.get('value')
    if dim and dim.get('groupBy') == 'connectionType':
      buckets = dim.get('buckets')
      if buckets and len(buckets) > 0:
        for bucket in buckets:
          if bucket.get('name') and grouped_by_channel.get(bucket.get('name')):
            grouped_by_connection[bucket.get('name')] = grouped_by_connection[bucket.get(
                'name')] + bucket.get('value')
          else:
            grouped_by_connection[bucket.get('name')] = bucket.get('value')


    all_dims = []
    buckets = []
    for k in grouped_by_connection.keys():
      buckets.append({ 'name': k, 'value': grouped_by_connection[k]})

    all_dims.append({ 'groupBy' : 'ConnectionType', 'buckets' : buckets}) 
    buckets = []
    for k in grouped_by_channel.keys():
      buckets.append({ 'name': k, 'value': grouped_by_channel[k]})
  
    all_dims.append({ 'groupBy' : 'ChannelType', 'buckets' : buckets}) 
      
  
    metrics['connectionsCreated'] = all_dims
    return metrics
  
ws_water_connectioncreated__by_channel_and_connection_type = {
    'path': 'water-services-enriched/_search',
    'name': 'ws_water_connectioncreated__by_channel_and_connection_type',
    'lambda': extract_ws_water_connectioncreated_by_channel_and_connection_type,
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
        }},
        {{
          "term": {{
            "Data.applicationStatus.keyword": "REJECTED"
          }}
        }}
      ],
      "must": [
        {{
          "term": {{
            "Data.applicationStatus.keyword": "CONNECTION_ACTIVATED"
          }}
        }},
        {{
          "range": {{
            "Data.connectionExecutionDate": {{
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
                "channelType": {{
                  "terms": {{
                    "field": "Data.channel.keyword"
                  }},
                  "aggs": {{
                    "connectionCreated": {{
                      "value_count": {{
                        "field": "Data.id.keyword"
                      }}
                    }}
                  }}
                }},
                "connectionType": {{
                  "terms": {{
                    "field": "Data.connectionType.keyword"
                  }},
                  "aggs": {{
                    "connectionCreated": {{
                      "value_count": {{
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


def extract_ws_sewerage_connectioncreated_by_channel_and_connection_type(metrics, region_bucket):
  all_dims = metrics['connectionCreated'] if metrics.get(
      'connectionCreated') else []

  #get new metrics from region_bucket
  channel_agg = region_bucket.get('channelType')
  channel_buckets = channel_agg.get('buckets')
  grouped_by_channel = {}
  for channel_bucket in channel_buckets:
      grouped_by_channel[channel_bucket.get('key')] = channel_bucket.get(
          'connectionCreated').get('value') if channel_bucket.get('connectionCreated') else 0

  grouped_by_connection = {}
  channel_agg = region_bucket.get('connectionType')
  channel_buckets = channel_agg.get('buckets')
  for channel_bucket in channel_buckets:
      grouped_by_connection[channel_bucket.get('key')] = channel_bucket.get(
          'connectionCreated').get('value') if channel_bucket.get('connectionCreated') else 0

  for dim in all_dims:
    if dim and dim.get('groupBy') == 'channelType':
      buckets = dim.get('buckets')
      if buckets and len(buckets) > 0:
        for bucket in buckets:
          if bucket.get('name') and grouped_by_channel.get(bucket.get('name')):
            grouped_by_channel[bucket.get('name')] = grouped_by_channel[bucket.get(
                'name')] + bucket.get('value')
          else:
            grouped_by_channel[bucket.get('name')] = bucket.get('value')
    if dim and dim.get('groupBy') == 'connectionType':
      buckets = dim.get('buckets')
      if buckets and len(buckets) > 0:
        for bucket in buckets:
          if bucket.get('name') and grouped_by_channel.get(bucket.get('name')):
            grouped_by_connection[bucket.get('name')] = grouped_by_connection[bucket.get(
                'name')] + bucket.get('value')
          else:
            grouped_by_connection[bucket.get('name')] = bucket.get('value')


    all_dims = []
    buckets = []
    for k in grouped_by_connection.keys():
      buckets.append({ 'name': k, 'value': grouped_by_connection[k]})

    all_dims.append({ 'groupBy' : 'ConnectionType', 'buckets' : buckets}) 
    buckets = []
    for k in grouped_by_channel.keys():
      buckets.append({ 'name': k, 'value': grouped_by_channel[k]})
  
    all_dims.append({ 'groupBy' : 'ChannelType', 'buckets' : buckets}) 
      
  
    metrics['connectionsCreated'] = all_dims
    return metrics

ws_sewerage_connectioncreated_by_channel_and_connection_type = {
                              'path': 'sewerage-services-enriched/_search',
                              'name': 'ws_sewerage_connectioncreated_by_channel_and_connection_type',
                              'lambda': extract_ws_sewerage_connectioncreated_by_channel_and_connection_type,
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
        }},
        {{
          "term": {{
            "Data.applicationStatus.keyword": "REJECTED"
          }}
        }}
      ],
      "must": [
        {{
          "term": {{
            "Data.applicationStatus.keyword": "CONNECTION_ACTIVATED"
          }}
        }},
        {{
          "range": {{
            "Data.connectionExecutionDate": {{
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
                "channelType": {{
                  "terms": {{
                    "field": "Data.channel.keyword"
                  }},
                  "aggs": {{
                    "connectionCreated": {{
                      "value_count": {{
                        "field": "Data.id.keyword"
                      }}
                    }}
                  }}
                }},
                "connectionType": {{
                  "terms": {{
                    "field": "Data.connectionType.keyword"
                  }},
                  "aggs": {{
                    "connectionCreated": {{
                      "value_count": {{
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


def extract_ws_water_todays_applications(metrics, region_bucket):
    todaysTotalApplications = region_bucket.get('todaysTotalApplications').get(
        'value') if region_bucket.get('todaysTotalApplications') else 0

    metrics['todaysTotalApplications'] =  metrics['todaysTotalApplications']  + todaysTotalApplications if  metrics.get('todaysTotalApplications') else todaysTotalApplications 
    return metrics

ws_water_todays_applications = {
                     'path': 'water-services-enriched/_search',
                     'name': 'ws_water_todaysapplication',
                     'lambda': extract_ws_water_todays_applications,
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
                    "todaysTotalApplications": {{
                      "value_count": {{
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

"""
 }


def extract_ws_sewerage_todays_application(metrics, region_bucket):
    todaysTotalApplications = region_bucket.get('todaysTotalApplications').get(
        'value') if region_bucket.get('todaysTotalApplications') else 0

    metrics['todaysTotalApplications'] =  metrics['todaysTotalApplications']  + todaysTotalApplications if  metrics.get('todaysTotalApplications') else todaysTotalApplications 
    return metrics

ws_sewerage_todays_application = {
                            'path': 'sewerage-services-enriched/_search',
                            'name': 'ws_sewerage_todaysapplication',
                            'lambda': extract_ws_sewerage_todays_application,
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
                    "todaysTotalApplications": {{
                      "value_count": {{
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

"""
                            }


def extract_ws_water_todays_closed_applications(metrics, region_bucket):
    todaysClosedApplications = region_bucket.get('todaysClosedApplications').get(
        'value') if region_bucket.get('todaysClosedApplications') else 0

    metrics['todaysClosedApplications'] =  metrics['todaysClosedApplications']  + todaysClosedApplications if  metrics.get('todaysClosedApplications') else todaysClosedApplications 
  
    return metrics

ws_water_todays_closed_applications = {
                         'path': 'water-services-enriched/_search',
                         'name': 'ws_water_todays_closed_applications',
                         'lambda': extract_ws_water_todays_closed_applications,
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
                "Data.applicationStatus.keyword": [
                  "CONNECTION_ACTIVATED",
                  "REJECTED"
                ]
              }}
            }},
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



"""
}


def extract_ws_sewerage_todays_closed_applications(metrics, region_bucket):
    todaysClosedApplications = region_bucket.get('todaysClosedApplications').get(
        'value') if region_bucket.get('todaysClosedApplications') else 0

    metrics['todaysClosedApplications'] =  metrics['todaysClosedApplications']  + todaysClosedApplications if  metrics.get('todaysClosedApplications') else todaysClosedApplications
    return metrics

ws_sewerage_todays_closed_applications = {
                        'path': 'sewerage-services-enriched/_search',
                         'name': 'ws_sewerage_todays_closed_applications',
                         'lambda': extract_ws_sewerage_todays_closed_applications,
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
                "Data.applicationStatus.keyword": [
                  "CONNECTION_ACTIVATED",
                  "REJECTED"
                ]
              }}
            }},
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

"""
}


def extract_ws_water_pending_connections(metrics, region_bucket):
  if metrics['pendingConnections'] == None:
      all_dims = []
  else:
      all_dims = metrics['pendingConnections']

  #get new metrics from region_bucket
  duration_agg = region_bucket.get('0to3Days')
  duration_buckets = duration_agg.get('buckets')
  grouped_by_0to3= {}
  for duration_bucket in duration_buckets:
      grouped_by_0to3['0to3Days'] = duration_bucket.get('doc_count') if duration_bucket.get('doc_count') else 0

  
  duration_agg = region_bucket.get('3to7Days')
  duration_buckets = duration_agg.get('buckets')
  grouped_by_3to7 = {}
  for duration_bucket in duration_buckets:
      grouped_by_3to7['3to7Days'] = duration_bucket.get('doc_count') if duration_bucket.get('doc_count') else 0

  duration_agg = region_bucket.get('7to15Days')
  duration_buckets = duration_agg.get('buckets')
  grouped_by_7to15 = {}
  for duration_bucket in duration_buckets:
      grouped_by_7to15['7to15Days'] = duration_bucket.get('doc_count') if duration_bucket.get('doc_count') else 0

  duration_agg = region_bucket.get('MoreThan15Days')
  duration_buckets = duration_agg.get('buckets')
  grouped_by_MoreThan15 = {}
  for duration_bucket in duration_buckets:
      grouped_by_MoreThan15['MoreThan15Days'] = duration_bucket.get('doc_count') if duration_bucket.get('doc_count') else 0

  for dim in all_dims:
    if dim and dim.get('groupBy') == '0to3Days':
      buckets = dim.get('buckets')
      if buckets and len(buckets) > 0:
        for bucket in buckets:
          if bucket.get('nvalueame') and grouped_by_0to3.get(bucket.get('name')):
            grouped_by_0to3[bucket.get('name')] = grouped_by_0to3[bucket.get(
                'name')] + bucket.get('doc_count')
          else:
            grouped_by_0to3[bucket.get('name')] = bucket.get('doc_count')

    if dim and dim.get('gro]upBy') == '3to7Days':
      buckets = dim.get('buckets')
      if buckets and len(buckets) > 0:
        for bucket in buckets:
          if bucket.get('name') and grouped_by_3to7.get(bucket.get('name')):
            grouped_by_3to7[bucket.get('name')] = grouped_by_3to7[bucket.get(
                'name')] + bucket.get('doc_count')
          else:
            grouped_by_3to7[bucket.get('name')] = bucket.get('doc_count')

    if dim and dim.get('groupBy') == '7to15Days':
      buckets = dim.get('buckets')
      if buckets and len(buckets) > 0:
        for bucket in buckets:
          if bucket.get('name') and grouped_by_7to15.get(bucket.get('name')):
            grouped_by_7to15[bucket.get('name')] = grouped_by_7to15[bucket.get(
                'name')] + bucket.get('doc_count')
          else:
            grouped_by_7to15[bucket.get('name')] = bucket.get('doc_count')
    

    if dim and dim.get('gro]upBy') == 'MoreThan15Days':
      buckets = dim.get('buckets')
      if buckets and len(buckets) > 0:
        for bucket in buckets:
          if bucket.get('name') and grouped_by_MoreThan15.get(bucket.get('name')):
            grouped_by_MoreThan15[bucket.get('name')] = grouped_by_MoreThan15[bucket.get(
                'name')] + bucket.get('doc_count')
          else:
            grouped_by_MoreThan15[bucket.get('name')] = bucket.get('doc_count')


    all_dims = []
    buckets = []
    for k in grouped_by_0to3.keys():
      buckets.append({ 'name': k, 'value': grouped_by_0to3[k]})

    all_dims.append({ 'groupBy' : '0to3Days', 'buckets' : buckets}) 

    buckets = []
    for k in grouped_by_3to7.keys():
      buckets.append({ 'name': k, 'value': grouped_by_3to7[k]})
    all_dims.append({ 'groupBy' : '3to7Days', 'buckets' : buckets}) 

    buckets = []
    for k in grouped_by_7to15.keys():
      buckets.append({ 'name': k, 'value': grouped_by_7to15[k]})
  
    all_dims.append({ 'groupBy' : '7to15Days', 'buckets' : buckets}) 
      
    buckets = []
    for k in grouped_by_MoreThan15.keys():
      buckets.append({ 'name': k, 'value': grouped_by_MoreThan15[k]})
  
    all_dims.append({ 'groupBy' : 'MoreThan15Days', 'buckets' : buckets}) 

    metrics['pendingConnections'] = all_dims
    return metrics

ws_water_pending_connections = {
                         'path': 'water-services-enriched/_search',
                         'name': 'ws_water_pending_connections',
                         'lambda': extract_ws_water_pending_connections,
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
        }},
         {{
          "terms":  {{
            "Data.applicationStatus.keyword": [
              "REJECTED",
              "CONNECTION_ACTIVATED"
            ]
          }}
        }}
      ],
      "must":[
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
  "aggs":  {{
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
                "field": "Data.tenantData.city.districtName.keyword",
                "size":10000
              }},
              "aggs":  {{
                "0to3Days":  {{
                  "date_range":  {{
                    "field": "Data.@timestamp",
                    "ranges": [
                      {{
                        "from": "now-3d/d",
                        "to": "now"
                      }}
                    ],
                    "format": "dd-MM-yyyy"
                  }}
                }},
                "3to7Days": {{
                  "date_range": {{
                    "field": "Data.@timestamp",
                    "ranges": [
                      {{
                        "from": "now-7d/d",
                        "to": "now-3d"
                      }}
                    ],
                    "format": "dd-MM-yyyy"
                  }}
                }},
                "7to15Days": {{
                  "date_range": {{
                    "field": "Data.@timestamp",
                    "ranges": [
                      {{
                        "from": "now-15d",
                        "to": "now-7d"
                      }}
                    ],
                    "format": "dd-MM-yyyy"
                  }}
                }},
                "MoreThan15Days": {{
                  "date_range": {{
                    "field": "Data.@timestamp",
                    "ranges": [
                      {{
                        "from": "now-2y",
                        "to": "now-15d"
                      }}
                    ],
                    "format": "dd-MM-yyyy"
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


def extract_ws_sewerage_pending_connections(metrics, region_bucket):
  if metrics['pendingConnections'] == None:
      all_dims = []
  else:
      all_dims = metrics['pendingConnections']

  #get new metrics from region_bucket
  duration_agg = region_bucket.get('0to3Days')
  duration_buckets = duration_agg.get('buckets')
  grouped_by_0to3= {}
  for duration_bucket in duration_buckets:
      grouped_by_0to3['0to3Days'] = duration_bucket.get('doc_count') if duration_bucket.get('doc_count') else 0

  
  duration_agg = region_bucket.get('3to7Days')
  duration_buckets = duration_agg.get('buckets')
  grouped_by_3to7 = {}
  for duration_bucket in duration_buckets:
      grouped_by_3to7['3to7Days'] = duration_bucket.get('doc_count') if duration_bucket.get('doc_count') else 0

  duration_agg = region_bucket.get('7to15Days')
  duration_buckets = duration_agg.get('buckets')
  grouped_by_7to15 = {}
  for duration_bucket in duration_buckets:
      grouped_by_7to15['7to15Days'] = duration_bucket.get('doc_count') if duration_bucket.get('doc_count') else 0

  duration_agg = region_bucket.get('MoreThan15Days')
  duration_buckets = duration_agg.get('buckets')
  grouped_by_MoreThan15 = {}
  for duration_bucket in duration_buckets:
      grouped_by_MoreThan15['MoreThan15Days'] = duration_bucket.get('doc_count') if duration_bucket.get('doc_count') else 0

  for dim in all_dims:
    if dim and dim.get('groupBy') == '0to3Days':
      buckets = dim.get('buckets')
      if buckets and len(buckets) > 0:
        for bucket in buckets:
          if bucket.get('nvalueame') and grouped_by_0to3.get(bucket.get('name')):
            grouped_by_0to3[bucket.get('name')] = grouped_by_0to3[bucket.get(
                'name')] + bucket.get('doc_count')
          else:
            grouped_by_0to3[bucket.get('name')] = bucket.get('doc_count')

    if dim and dim.get('gro]upBy') == '3to7Days':
      buckets = dim.get('buckets')
      if buckets and len(buckets) > 0:
        for bucket in buckets:
          if bucket.get('name') and grouped_by_3to7.get(bucket.get('name')):
            grouped_by_3to7[bucket.get('name')] = grouped_by_3to7[bucket.get(
                'name')] + bucket.get('doc_count')
          else:
            grouped_by_3to7[bucket.get('name')] = bucket.get('doc_count')

    if dim and dim.get('groupBy') == '7to15Days':
      buckets = dim.get('buckets')
      if buckets and len(buckets) > 0:
        for bucket in buckets:
          if bucket.get('name') and grouped_by_7to15.get(bucket.get('name')):
            grouped_by_7to15[bucket.get('name')] = grouped_by_7to15[bucket.get(
                'name')] + bucket.get('doc_count')
          else:
            grouped_by_7to15[bucket.get('name')] = bucket.get('doc_count')
    

    if dim and dim.get('gro]upBy') == 'MoreThan15Days':
      buckets = dim.get('buckets')
      if buckets and len(buckets) > 0:
        for bucket in buckets:
          if bucket.get('name') and grouped_by_MoreThan15.get(bucket.get('name')):
            grouped_by_MoreThan15[bucket.get('name')] = grouped_by_MoreThan15[bucket.get(
                'name')] + bucket.get('doc_count')
          else:
            grouped_by_MoreThan15[bucket.get('name')] = bucket.get('doc_count')


    all_dims = []
    buckets = []
    for k in grouped_by_0to3.keys():
      buckets.append({ 'name': k, 'value': grouped_by_0to3[k]})

    all_dims.append({ 'groupBy' : '0to3Days', 'buckets' : buckets}) 

    buckets = []
    for k in grouped_by_3to7.keys():
      buckets.append({ 'name': k, 'value': grouped_by_3to7[k]})
    all_dims.append({ 'groupBy' : '3to7Days', 'buckets' : buckets}) 

    buckets = []
    for k in grouped_by_7to15.keys():
      buckets.append({ 'name': k, 'value': grouped_by_7to15[k]})
  
    all_dims.append({ 'groupBy' : '7to15Days', 'buckets' : buckets}) 
      
    buckets = []
    for k in grouped_by_MoreThan15.keys():
      buckets.append({ 'name': k, 'value': grouped_by_MoreThan15[k]})
  
    all_dims.append({ 'groupBy' : 'MoreThan15Days', 'buckets' : buckets}) 

    metrics['pendingConnections'] = all_dims
    return metrics

ws_sewerage_pending_connections = {
                         'path': 'sewerage-services-enriched/_search',
                         'name': 'ws_sewerage_pending_connections',
                         'lambda': extract_ws_sewerage_pending_connections,
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
        }},
         {{
          "terms":  {{
            "Data.applicationStatus.keyword": [
              "REJECTED",
              "CONNECTION_ACTIVATED"
            ]
          }}
        }}
      ],
      "must":[
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
  "aggs":  {{
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
                "field": "Data.tenantData.city.districtName.keyword",
                "size":10000
              }},
              "aggs":  {{
                "0to3Days":  {{
                  "date_range":  {{
                    "field": "Data.@timestamp",
                    "ranges": [
                      {{
                        "from": "now-3d/d",
                        "to": "now"
                      }}
                    ],
                    "format": "dd-MM-yyyy"
                  }}
                }},
                "3to7Days": {{
                  "date_range": {{
                    "field": "Data.@timestamp",
                    "ranges": [
                      {{
                        "from": "now-7d/d",
                        "to": "now-3d"
                      }}
                    ],
                    "format": "dd-MM-yyyy"
                  }}
                }},
                "7to15Days": {{
                  "date_range": {{
                    "field": "Data.@timestamp",
                    "ranges": [
                      {{
                        "from": "now-15d",
                        "to": "now-7d"
                      }}
                    ],
                    "format": "dd-MM-yyyy"
                  }}
                }},
                "MoreThan15Days": {{
                  "date_range": {{
                    "field": "Data.@timestamp",
                    "ranges": [
                      {{
                        "from": "now-2y",
                        "to": "now-15d"
                      }}
                    ],
                    "format": "dd-MM-yyyy"
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


def extract_ws_water_todays_completed_application_withinSLA(metrics, region_bucket):
  todaysCompletedApplicationsWithinSLA = region_bucket.get('todaysCompletedApplicationsWithinSLA').get(
        'doc_count') if region_bucket.get('todaysCompletedApplicationsWithinSLA') else 0
  
  if metrics['todaysCompletedApplicationsWithinSLA'] == None:
     logging.info('None')
     metrics['todaysCompletedApplicationsWithinSLA'] =   todaysCompletedApplicationsWithinSLA 
  else:
     metrics['todaysCompletedApplicationsWithinSLA'] =  metrics['todaysCompletedApplicationsWithinSLA']  + todaysCompletedApplicationsWithinSLA 
  
  return metrics

ws_water_todays_completed_application_withinSLA = {
                         'path': 'water-services-enriched/_search',
                         'name': 'ws_water_todays_completed_application_withinSLA',
                         'lambda': extract_ws_water_todays_completed_application_withinSLA,
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


def extract_ws_sewearge_todays_completed_application_withinSLA(metrics, region_bucket):
  todaysCompletedApplicationsWithinSLA = region_bucket.get('todaysCompletedApplicationsWithinSLA').get(
        'doc_count') if region_bucket.get('todaysCompletedApplicationsWithinSLA') else 0

  metrics['todaysCompletedApplicationsWithinSLA'] =  metrics['todaysCompletedApplicationsWithinSLA']  + todaysCompletedApplicationsWithinSLA if  metrics['todaysCompletedApplicationsWithinSLA'] else todaysCompletedApplicationsWithinSLA 
  
  return metrics

ws_sewerage_todays_completed_application_withinSLA = {
                         'path': 'sewerage-services-enriched/_search',
                         'name': 'ws_sewerage_todays_completed_application_withinSLA',
                         'lambda': extract_ws_sewearge_todays_completed_application_withinSLA,
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


def extract_ws_water_sla_compliance(metrics, region_bucket):
  slaCompliance = region_bucket.get('slaCompliance').get(
        'value') if region_bucket.get('slaCompliance') else 0
  metrics['slaCompliance'] =  metrics['slaCompliance']  + slaCompliance if  metrics.get('slaCompliance') else slaCompliance
  return metrics

ws_water_sla_compliance = {
                         'path': 'water-services-enriched/_search',
                         'name': 'ws_water_sla_compliance',
                         'lambda': extract_ws_water_sla_compliance,
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
                "TotalApplication": {{
                  "value_count": {{
                    "field": "Data.tenantId.keyword"
                  }}
                }},
                "todaysCompletedApplicationsWithinSLA": {{
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
                    "count": {{
                      "value_count": {{
                        "field": "Data.tenantId.keyword"
                      }}
                    }}
                  }}
                }},
                "slaCompliance": {{
                  "bucket_script": {{
                    "buckets_path": {{
                      "closed": "todaysCompletedApplicationsWithinSLA>count",
                      "total": "TotalApplication"
                    }},
                    "script": "params.closed / params.total * 100"
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


def extract_ws_sewerage_sla_compliance(metrics, region_bucket):
  slaCompliance = region_bucket.get('slaCompliance').get(
        'value') if region_bucket.get('slaCompliance') else 0
  metrics['slaCompliance'] =  metrics['slaCompliance']  + slaCompliance if  metrics.get('slaCompliance') else slaCompliance
  return metrics

ws_sewerage_sla_compliance = {
                         'path': 'sewerage-services-enriched/_search',
                         'name': 'ws_sewerage_sla_compliance',
                         'lambda': extract_ws_sewerage_sla_compliance,
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
                "TotalApplication": {{
                  "value_count": {{
                    "field": "Data.tenantId.keyword"
                  }}
                }},
                "todaysCompletedApplicationsWithinSLA": {{
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
                    "count": {{
                      "value_count": {{
                        "field": "Data.tenantId.keyword"
                      }}
                    }}
                  }}
                }},
                "slaCompliance": {{
                  "bucket_script": {{
                    "buckets_path": {{
                      "closed": "todaysCompletedApplicationsWithinSLA>count",
                      "total": "TotalApplication"
                    }},
                    "script": "params.closed / params.total * 100"
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


def extract_ws_water_connections(metrics, region_bucket):
  all_dims = []
  grouped_by = []
  
  channel_agg = region_bucket.get('byMeterType') 
  if channel_agg != None:
    channel_buckets = channel_agg.get('buckets')
    grouped_by = []
    for channel_bucket in channel_buckets:  
      grouped_by.append({'name': channel_bucket.get('key'), 'value': channel_bucket.get(
              'waterConnections').get('value') if channel_bucket.get('waterConnections') else 0})
      all_dims.append(
          {'groupBy': 'meterType', 'buckets': grouped_by})

  channel_agg = region_bucket.get('byChannelType')  
  if channel_agg != None:
    channel_buckets = channel_agg.get('buckets')
    grouped_by = []
    for channel_bucket in channel_buckets:
      key = channel_bucket.get('key') if channel_bucket.get('key') == "" else " "
      grouped_by.append({'name': key, 'value': channel_bucket.get(
              'waterConnections').get('value') if channel_bucket.get('waterConnections') else 0})
      all_dims.append(
          {'groupBy': 'channelType', 'buckets': grouped_by})

  channel_agg = region_bucket.get('byUsageType') 
  if channel_agg != None: 
    channel_buckets = channel_agg.get('buckets')
    grouped_by = []
    for channel_bucket in channel_buckets:  
      grouped_by.append({'name': channel_bucket.get('key'), 'value': channel_bucket.get(
              'waterConnections').get('value') if channel_bucket.get('waterConnections') else 0})
      all_dims.append(
          {'groupBy': 'usageType', 'buckets': grouped_by})


  metrics['waterConnections'] = all_dims
  return metrics

ws_water_connections = {
                            'path': 'water-services-enriched/_search',
                            'name': 'ws_water_connections',
                            'lambda': extract_ws_water_connections,
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
        }},
        {{
          "term": {{
            "Data.applicationStatus.keyword": "REJECTED"
          }}
        }}
      ],
      "must": [
        {{
          "term": {{
            "Data.applicationStatus.keyword": "CONNECTION_ACTIVATED"
          }}
        }},
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
                    "byChannelType": {{
                      "terms": {{
                        "field": "Data.channel.keyword"
                      }},
                      "aggs": {{
                        "waterConnections": {{
                          "value_count": {{
                            "field": "Data.applicationNo.keyword"
                          }}
                        }}
                      }}
                    }},
                    "byUsageType": {{
                      "terms": {{
                        "field": "Data.propertyUsageType.keyword"
                      }},
                    "aggs": {{
                        "waterConnections": {{
                          "value_count": {{
                            "field": "Data.applicationNo.keyword"
                          }}
                        }}
                      }}
                  }},
                    "byMeterType": {{
                      "terms": {{
                        "field": "Data.connectionType.keyword"
                      }},
                    "aggs": {{
                        "waterConnections": {{
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
  }}
}}





"""
                            }


def extract_ws_sewerage_connections(metrics, region_bucket):
  all_dims = []
  grouped_by = []

  channel_agg = region_bucket.get('byChannelType')  
  channel_buckets = channel_agg.get('buckets')
  grouped_by = []
  for channel_bucket in channel_buckets:  
    grouped_by.append({'name': channel_bucket.get('key'), 'value': channel_bucket.get(
            'sewerageConnections').get('value') if channel_bucket.get('sewerageConnections') else 0})
    all_dims.append(
        {'groupBy': 'channelType', 'buckets': grouped_by})

  channel_agg = region_bucket.get('byUsageType')  
  channel_buckets = channel_agg.get('buckets')
  grouped_by = []
  for channel_bucket in channel_buckets:  
    grouped_by.append({'name': channel_bucket.get('key'), 'value': channel_bucket.get(
            'sewerageConnections').get('value') if channel_bucket.get('sewerageConnections') else 0})
    all_dims.append(
        {'groupBy': 'usageType', 'buckets': grouped_by})


  metrics['sewerageConnections'] = all_dims
  return metrics

ws_sewerage_connections = {
                            'path': 'sewerage-services-enriched/_search',
                            'name': 'ws_water_connections',
                            'lambda': extract_ws_water_connections,
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
        }},
        {{
          "term": {{
            "Data.applicationStatus.keyword": "REJECTED"
          }}
        }}
      ],
      "must": [
        {{
          "term": {{
            "Data.applicationStatus.keyword": "CONNECTION_ACTIVATED"
          }}
        }},
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
                "byChannelType": {{
                  "terms": {{
                    "field": "Data.channel.keyword"
                  }},
                  "aggs": {{
                    "sewerageConnections": {{
                      "value_count": {{
                        "field": "Data.applicationNo.keyword"
                      }}
                    }}
                  }}
                }},
                "byUsageType": {{
                  "terms": {{
                    "field": "Data.propertyUsageType.keyword"
                  }},
                  "aggs": {{
                    "sewerageConnections": {{
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
  }}
}}







"""
                            }



ws_digit_queries = [ws_collection_by_payment_channel_type, ws_water_connectioncreated__by_channel_and_connection_type,ws_sewerage_connectioncreated_by_channel_and_connection_type,
              ws_water_todays_applications, ws_sewerage_todays_application, ws_water_todays_closed_applications, ws_sewerage_todays_closed_applications, 
              ws_water_pending_connections, ws_sewerage_pending_connections,
              ws_water_todays_completed_application_withinSLA, ws_sewerage_todays_completed_application_withinSLA,ws_water_sla_compliance, ws_sewerage_sla_compliance, ws_water_connections,
              ws_sewerage_connections,ws_total_transactions]


def empty_ws_digit_payload(region, ulb, ward, date):
    return {
        "date": date,
        "module": "WS",
        "ward": ward,
        "ulb": ulb,
        "region": region,
        "state": "Punjab",
        "metrics": {
            "transactions": 0,
            "connectionsCreated": [
                
            ],
            "todaysCollection": [
               
            ],
            "sewerageConnections": [
              
            ],
            "waterConnections": [
               
            ],
            "pendingConnections": [
              
            ],
             "slaCompliance": 0,
             "todaysTotalApplications": 0, 
             "todaysClosedApplications": 0, 
             "todaysCompletedApplicationsWithinSLA": 0 
        }
    }