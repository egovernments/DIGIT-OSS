
import logging


def extract_ws_collection_by_payment_channel_type(metrics, region_bucket):
    groupby_usage = []
    groupby_channel = []
    collection = []

    if region_bucket.get('byChannel'):
        channel_buckets = region_bucket.get('byChannel').get('buckets')
        for channel_bucket in channel_buckets:
            channel = channel_bucket.get('key')
            value = channel_bucket.get('byChannel').get('value') if channel_bucket.get('byChannel') else 0
            groupby_channel.append({ 'name' : channel, 'value' : value})

    if region_bucket.get('byUsageType'):
        usage_type_buckets = region_bucket.get('byUsageType').get('buckets')
        for usage_type_bucket in usage_type_buckets:
            usage_type = usage_type_bucket.get('key')
            value = usage_type_bucket.get('byUsageType').get('value') if usage_type_bucket.get('byUsageType') else 0
            groupby_usage.append({ 'name' : usage_type, 'value' : value})


    collection.append({ 'groupBy': 'usageType', 'buckets' : groupby_usage})
    collection.append({ 'groupBy': 'paymentChannelType', 'buckets' : groupby_channel})
    metrics['todaysCollection'] = collection


    return metrics

ws_collection_by_payment_channel_type = {'path': 'receipts-consumers/_search',
                                         'name': 'ws_collection_by_payment_channel_type',
                                         'lambda': extract_ws_collection_by_payment_channel_type,
                                         'query':
                                             """
            {{
            "size":0,
            "query": {{
                    "bool": {{
                          "must_not": [
                            {{
                              "term": {{
                                "status": "Cancelled"
                              }}
                            }}
                          ],
                      "must": [
                        {{
                          "range": {{
                            "receiptdate": {{
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
                            "field": "block.keyword",
                            "size":10000
                          }},
                    "aggs": {{
                        "ulb": {{
                          "terms": {{
                            "field": "cityname.keyword",
                            "size":10000
                          }},
                          "aggs": {{
                            "region": {{
                              "terms": {{
                                "field": "districtname.keyword",
                                "size":10000
                                 }},
                               "aggs": {{
                                  "byUsageType": {{
                                    "terms": {{
                                      "field": "consumertype.keyword"
                                    }},
                                      "aggs": {{
                                          "byUsageType": {{
                                            "sum":{{
                                            "field": "totalamount"
                                          }}
                                        }}
                                      }}
                                     }},
                                  "byChannel": {{
                                    "terms": {{
                                      "field": "channel.keyword"
                                    }},
                                      "aggs": {{
                                        "byChannel": {{
                                          "sum": {{
                                            "field": "totalamount"
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


def extract_ws_collection_by_tax_head_connection_type(metrics, region_bucket):
    groupby_tax_heads = []
    collection = metrics.get('todaysCollection') if metrics.get('todaysCollection') else []

    tax_head = region_bucket.get('INTEREST')
    value = region_bucket.get('INTEREST').get('todaysCollection').get('value') if region_bucket.get('INTEREST').get('todaysCollection') else 0
    groupby_tax_heads.append({ 'name' : tax_head, 'value' : value})

    tax_head = region_bucket.get('ADVANCE')
    value = region_bucket.get('ADVANCE').get('todaysCollection').get('value') if region_bucket.get('ADVANCE').get('todaysCollection') else 0
    groupby_tax_heads.append({ 'name' : tax_head, 'value' : value})

    tax_head = region_bucket.get('CURRENT.CHARGES')
    value = region_bucket.get('CURRENT.CHARGES').get('todaysCollection').get('value') if region_bucket.get('CURRENT.CHARGES').get('todaysCollection') else 0
    groupby_tax_heads.append({ 'name' : tax_head, 'value' : value})

    tax_head = region_bucket.get('ARREAR.CHARGES')
    value = region_bucket.get('ARREAR.CHARGES').get('todaysCollection').get('value') if region_bucket.get('ARREAR.CHARGES').get('todaysCollection') else 0
    groupby_tax_heads.append({ 'name' : tax_head, 'value' : value})

    tax_head = region_bucket.get('LATE.CHARGES')
    value = region_bucket.get('LATE.CHARGES').get('todaysCollection').get('value') if region_bucket.get('LATE.CHARGES').get('todaysCollection') else 0
    groupby_tax_heads.append({ 'name' : tax_head, 'value' : value})


    collection.append({ 'groupBy': 'taxHeads', 'buckets' : groupby_tax_heads})
    metrics['todaysCollection'] = collection


    return metrics

ws_collection_by_tax_head_connection_type = {
    'path': 'demandbillconsumers/_search',
    'name': 'ws_collection_by_tax_head_connection_type',
    'lambda': extract_ws_collection_by_tax_head_connection_type,
    'query': """
{{
  "size": 0,
  "query": {{
    "bool": {{
      "must": [
        {{
          "range": {{
            "billdate": {{
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
        "field": "block.keyword",
        "size":10000
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "cityname.keyword",
            "size":10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "districtname.keyword",
                "size":10000
              }},
              "aggs": {{
                "LATE.CHARGES": {{
                  "filter": {{
                    "term": {{
                      "billgenerated": true
                    }}
                  }},
                  "aggs": {{
                    "todaysCollection": {{
                      "sum": {{
                        "field": "penaltycollection"
                      }}
                    }}
                  }}
                }},
                "INTEREST": {{
                  "filter": {{
                    "term": {{
                      "billgenerated": true
                    }}
                  }},
                  "aggs": {{
                    "todaysCollection": {{
                      "sum": {{
                        "field": "interestcollection"
                      }}
                    }}
                  }}
                }},
                "ADVANCE": {{
                  "filter": {{
                    "term": {{
                      "billgenerated": true
                    }}
                  }},
                  "aggs": {{
                    "todaysCollection": {{
                      "sum": {{
                        "field": "advancecollection"
                      }}
                    }}
                  }}
                }},
                "CURRENT.CHARGES": {{
                  "filter": {{
                    "term": {{
                      "billgenerated": true
                    }}
                  }},
                  "aggs": {{
                    "todaysCollection": {{
                      "sum": {{
                        "field": "currentcharges"
                      }}
                    }}
                  }}
                }},
                "ARREAR.CHARGES": {{
                  "filter": {{
                    "term": {{
                      "billgenerated": true
                    }}
                  }},
                  "aggs": {{
                    "todaysCollection": {{
                      "sum": {{
                        "field": "arrearcharges"
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


def extract_ws_pending_connections(metrics, region_bucket):

    all_dims = metrics['pendingConnections'] if metrics.get('pendingConnections') else []
    logging.info("before consolidation-1")
    #get new metrics from region_bucket
    duration_agg = region_bucket.get('0to3Days')
    duration_buckets = duration_agg.get('buckets')
    grouped_by_0to3= []
    for duration_bucket in duration_buckets:
        grouped_by_0to3.append({ 'name' : "0to3Days", 'value' : duration_bucket.get('doc_count') if duration_bucket.get('doc_count') else 0})
    logging.info("value -0t03 {0}".format(duration_bucket.get('doc_count')))

    duration_agg = region_bucket.get('3to7Days')
    duration_buckets = duration_agg.get('buckets')
    grouped_by_3to7 = []
    for duration_bucket in duration_buckets:
        grouped_by_3to7.append({ 'name' : "3to7Days", 'value' : duration_bucket.get('doc_count') if duration_bucket.get('doc_count') else 0})
    logging.info("value -3to7 {0}".format(duration_bucket.get('doc_count')))

    duration_agg = region_bucket.get('7to15Days')
    duration_buckets = duration_agg.get('buckets')
    grouped_by_7to15 = []
    for duration_bucket in duration_buckets:
        grouped_by_7to15.append({ 'name' : "7to15Days", 'value' : duration_bucket.get('doc_count') if duration_bucket.get('doc_count') else 0})
    logging.info("value -7to15 {0}".format(duration_bucket.get('doc_count')))

    duration_agg = region_bucket.get('MoreThan15Days')
    duration_buckets = duration_agg.get('buckets')
    grouped_by_MoreThan15 = []
    for duration_bucket in duration_buckets:
        grouped_by_MoreThan15.append({ 'name' : "MoreThan15Days", 'value' : duration_bucket.get('doc_count') if duration_bucket.get('doc_count') else 0})
    logging.info("value -morethan15 {0}".format(duration_bucket.get('doc_count')))

    logging.info("before consolidation -2")

    all_dims.append({ 'groupBy' : 'duration', 'buckets' : grouped_by_0to3})
    all_dims.append({ 'groupBy': 'duration', 'buckets' : grouped_by_3to7})
    all_dims.append({ 'groupBy' : 'duration', 'buckets' : grouped_by_7to15})
    all_dims.append({ 'groupBy': 'duration', 'buckets' : grouped_by_MoreThan15})
    metrics['pendingConnections'] = all_dims
    logging.info("before consolidation -4")
    return metrics
    # for dim in all_dims:
    #   if dim and dim.get('groupBy') == '0to3Days':
    #     buckets = dim.get('buckets')
    #     if buckets and len(buckets) > 0:
    #       for bucket in buckets:
    #         if bucket.get('name') and grouped_by_0to3.get(bucket.get('name')):
    #           grouped_by_0to3[bucket.get('name')] = grouped_by_0to3[bucket.get(
    #               'name')] + bucket.get('doc_count')
    #         else:
    #           grouped_by_0to3[bucket.get('name')] = bucket.get('doc_count')

    #   if dim and dim.get('groupBy') == '3to7Days':
    #     buckets = dim.get('buckets')
    #     if buckets and len(buckets) > 0:
    #       for bucket in buckets:
    #         if bucket.get('name') and gouped_by_3to7.get(bucket.get('name')):
    #           grouped_by_3to7[bucket.get('name')] = grouped_by_3to7[bucket.get(
    #               'name')] + bucket.get('doc_count')
    #         else:
    #           grouped_by_3to7[bucket.get('name')] = bucket.get('doc_count')

    #   if dim and dim.get('groupBy') == '7to15Days':
    #     buckets = dim.get('buckets')
    #     if buckets and len(buckets) > 0:
    #       for bucket in buckets:
    #         if bucket.get('name') and grouped_by_7to15.get(bucket.get('name')):
    #           grouped_by_7to15[bucket.get('name')] = grouped_by_7to15[bucket.get(
    #               'name')] + bucket.get('doc_count')
    #         else:
    #           grouped_by_7to15[bucket.get('name')] = bucket.get('doc_count')


    #   if dim and dim.get('groupBy') == 'MoreThan15Days':
    #     buckets = dim.get('buckets')
    #     if buckets and len(buckets) > 0:
    #       for bucket in buckets:
    #         if bucket.get('name') and grouped_by_MoreThan15.get(bucket.get('name')):
    #           grouped_by_MoreThan15[bucket.get('name')] = grouped_by_MoreThan15[bucket.get(
    #               'name')] + bucket.get('doc_count')
    #         else:
    #           grouped_by_MoreThan15[bucket.get('name')] = bucket.get('doc_count')

    #   logging.info("before consolidation-3")
    #   all_dims = []
    #   buckets = []
    #   for k in grouped_by_0to3.keys():
    #     logging.info(grouped_by_0to3[k])
    #     buckets.append({ 'name': k, 'value': grouped_by_0to3[k]})

    #   all_dims.append({ 'groupBy' : 'duration', 'buckets' : buckets})

    #   buckets = []
    #   for k in grouped_by_3to7.keys():
    #     logging.info(grouped_by_3to7[k])
    #     buckets.append({ 'name': k, 'value': grouped_by_3to7[k]})
    #   all_dims.append({ 'groupBy' : 'duration', 'buckets' : buckets})

    #   buckets = []
    #   for k in grouped_by_7to15.keys():
    #     logging.info(grouped_by_7to15[k])
    #     buckets.append({ 'name': k, 'value': grouped_by_7to15[k]})

    #   all_dims.append({ 'groupBy' : 'duration', 'buckets' : buckets})

    #   buckets = []
    #   for k in grouped_by_MoreThan15.keys():
    #     logging.info(grouped_by_MoreThan15[k])
    #     buckets.append({ 'name': k, 'value': grouped_by_MoreThan15[k]})

    #   all_dims.append({ 'groupBy' : 'duration', 'buckets' : buckets})

    #   metrics['pendingConnections'] = all_dims
    #   return metrics


    # return metrics

ws_pending_connections = {'path': 'wsapplications/_search',
                          'name': 'ws_pending_connections',
                          'lambda': extract_ws_pending_connections,
                          'query': """

{{
  "size": 0,
    "query": {{
        "bool": {{
          "must": [
            {{
              "terms": {{
                "servicetype.keyword": [
                  "Water Charges",
                  "Sewerage Charges"
                ]
              }}
            }},
            {{
              "terms": {{
                "applicationstatus.keyword": [
                  "Created",
                  "Rejected",
                  "Verified",
                  "verified"
                ]
              }}
            }},
            {{
                   "range": {{
                      "createddate": {{
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
                  "field": "block.keyword",
                  "size":10000
                }},
              "aggs": {{
                "ulb": {{
                  "terms": {{
                    "field": "cityname.keyword",
                    "size":10000
                  }},
                "aggs": {{
                  "region": {{
                    "terms": {{
                      "field": "districtname.keyword",
                      "size":10000
                    }},
                    "aggs": {{
        "0to3Days": {{
          "date_range": {{
            "field": "applicationdate",
            "ranges": [
              {{
                "from": "now-3d/d",
                "to": "now"
              }}
            ]
          }}
        }},
        "3to7Days": {{
          "date_range": {{
            "field": "applicationdate",
            "ranges": [
              {{
                "from": "now-1w",
                "to": "now-3d/d"
              }}
            ]
          }}
        }},
        "7to15Days": {{
          "date_range": {{
            "field": "applicationdate",
            "ranges": [
              {{
                "from": "now-15d",
                "to": "now-1w"
              }}
            ]
          }}
        }},
        "MoreThan15Days": {{
          "date_range": {{
            "field": "applicationdate",
            "ranges": [
              {{
                "from": "now-2y",
                "to": "now-15d"
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


	
"""
                          }


def extract_ws_sewerage_connections(metrics, region_bucket):
    groupby_usage = []
    groupby_channel = []
    collection =  []

    if region_bucket.get('sewerageConnectionsbyChannelType'):
        channel_buckets = region_bucket.get('sewerageConnectionsbyChannelType').get('buckets')
        for channel_bucket in channel_buckets:
            channel = channel_bucket.get('key')
            value = channel_bucket.get('sewerageConnectionsbyChannelType').get('value') if channel_bucket.get('sewerageConnectionsbyChannelType') else 0
            groupby_channel.append({ 'name' : channel, 'value' : value})

    if region_bucket.get('sewerageConnectionsbyUsageType'):
        usage_type_buckets = region_bucket.get('sewerageConnectionsbyUsageType').get('buckets')
        for usage_type_bucket in usage_type_buckets:
            usage_type = usage_type_bucket.get('key')
            value = usage_type_bucket.get('sewerageConnectionsbyUsageType').get('value') if usage_type_bucket.get('sewerageConnectionsbyUsageType') else 0
            groupby_usage.append({ 'name' : usage_type, 'value' : value})


    collection.append({ 'groupBy': 'usageType', 'buckets' : groupby_usage})
    collection.append({ 'groupBy': 'channelType', 'buckets' : groupby_channel})
    metrics['sewerageConnections'] = collection


    return metrics

ws_sewerage_connections = {'path': 'wsapplications/_search',
                           'name': 'ws_sewerage_connections',
                           'lambda': extract_ws_sewerage_connections,

                           'query': """
{{
  "size": 10,
    "query": {{
        "bool": {{
          "must_not": [
            {{
              "term": {{
                "applicationstatus.keyword": "Cancelled"
              }}
            }}
          ],
          "must": [
            {{
              "terms": {{
                "servicetype.keyword": [
                  "Sewerage Charges"
                ]
              }}
            }},
            {{
              "terms": {{
                "connectionstatus.keyword": [
                  "ACTIVE"
                ]
              }}
            }},
            {{
                   "range": {{
                      "createddate": {{
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
                  "field": "block.keyword",
                  "size":10000
                }},
            "aggs": {{
              "ulb": {{
                "terms": {{
                  "field": "cityname.keyword",
                  "size":10000
                }},
              "aggs": {{
                "region": {{
                  "terms": {{
                    "field": "districtname.keyword",
                    "size":10000
                  }},
                  "aggs": {{
                    "sewerageConnectionsbyChannelType": {{
                      "terms": {{
                        "field": "channel.keyword"
                      }},
                      "aggs": {{
                        "sewerageConnectionsbyChannelType": {{
                          "value_count": {{
                            "field": "applicationnumber.keyword"
                          }}
                        }}
                      }}
                    }},
                    "sewerageConnectionsbyUsageType": {{
                      "terms": {{
                        "field": "usage.keyword",
                        "size":10000
                      }},
                    "aggs": {{
                        "sewerageConnectionsbyUsageType": {{
                          "value_count": {{
                            "field": "applicationnumber.keyword"
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


def extract_ws_water_connections(metrics, region_bucket):
    groupby_usage = []
    groupby_channel = []
    groupby_meter = []
    collection =  []

    if region_bucket.get('waterConnectionsbyChannelType'):
        channel_buckets = region_bucket.get('waterConnectionsbyChannelType').get('buckets')
        for channel_bucket in channel_buckets:
            channel = channel_bucket.get('key')
            value = channel_bucket.get('waterConnectionsbyChannelType').get('value') if channel_bucket.get('waterConnectionsbyChannelType') else 0
            groupby_channel.append({ 'name' : channel, 'value' : value})

    if region_bucket.get('waterConnectionsbyUsageType'):
        usage_type_buckets = region_bucket.get('waterConnectionsbyUsageType').get('buckets')
        for usage_type_bucket in usage_type_buckets:
            usage_type = usage_type_bucket.get('key')
            value = usage_type_bucket.get('waterConnectionsbyUsageType').get('value') if usage_type_bucket.get('waterConnectionsbyUsageType') else 0
            groupby_usage.append({ 'name' : usage_type, 'value' : value})

    if region_bucket.get('waterConnectionsbyMeterType'):
        meter_type_buckets = region_bucket.get('waterConnectionsbyMeterType').get('buckets')
        for meter_type_bucket in meter_type_buckets:
            meter_type = meter_type_bucket.get('key')
            value = meter_type_bucket.get('waterConnectionsbyMeterType').get('value') if meter_type_bucket.get('waterConnectionsbyMeterType') else 0
            groupby_meter.append({ 'name' : meter_type, 'value' : value})


    collection.append({ 'groupBy': 'usageType', 'buckets' : groupby_usage})
    collection.append({ 'groupBy': 'channelType', 'buckets' : groupby_channel})
    collection.append({ 'groupBy': 'meterType', 'buckets' : groupby_meter})
    metrics['waterConnections'] = collection


    return metrics

ws_water_connections = {'path': 'wsapplications/_search',
                        'name': 'ws_water_connections',
                        'lambda': extract_ws_water_connections,
                        'query': """

 {{
    "size": 20,
      "query": {{
          "bool": {{
            "must_not": [
              {{
                "term": {{
                  "applicationstatus.keyword": "Cancelled"
                }}
              }}
            ],
            "must": [
              {{
                "terms": {{
                  "servicetype.keyword": [
                    "Water Charges"
                  ]
                }}
              }},
              {{
                "terms": {{
                  "connectionstatus.keyword": [
                    "ACTIVE"
                  ]
                }}
              }},
              {{
                   "range": {{
                      "createddate": {{
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
                    "field": "block.keyword",
                    "size":10000
                  }},
              "aggs": {{
                "ulb": {{
                  "terms": {{
                    "field": "cityname.keyword",
                    "size":10000
                  }},
                "aggs": {{
                  "region": {{
                    "terms": {{
                      "field": "districtname.keyword",
                      "size":10000
                    }},
                    "aggs": {{
                      "waterConnectionsbyChannelType": {{
                        "terms": {{
                          "field": "channel.keyword"
                        }},
                        "aggs": {{
                          "waterConnectionsbyChannelType": {{
                            "value_count": {{
                              "field": "applicationnumber.keyword"
                            }}
                          }}
                        }}
                      }},
                      "waterConnectionsbyUsageType": {{
                        "terms": {{
                          "field": "usage.keyword"
                        }},
                      "aggs": {{
                          "waterConnectionsbyUsageType": {{
                            "value_count": {{
                              "field": "applicationnumber.keyword"
                            }}
                          }}
                        }}
                    }},
                    "waterConnectionsbyMeterType": {{
                        "terms": {{
                          "field": "connectiontype.keyword"
                        }},
                        "aggs": {{
                          "waterConnectionsbyMeterType": {{
                            "value_count": {{
                              "field": "applicationnumber.keyword"
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


def extract_ws_todays_applications(metrics, region_bucket):
    metrics['todaysTotalApplications'] = region_bucket.get('todaysTotalApplications').get(
        'value') if region_bucket.get('todaysTotalApplications') else 0
    return metrics

ws_todays_applications = {'path': 'wsapplications/_search',
                          'name': 'ws_todays_applications',
                          'lambda': extract_ws_todays_applications,
                          'query': """

 {{
    "size": 0,
    "query":{{
      "bool": {{
        "must": [
          {{
             "range": {{
                "applicationdate": {{
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
                "field": "block.keyword",
                "size":10000
              }},
          "aggs": {{
            "ulb": {{
              "terms": {{
                "field": "cityname.keyword",
                "size":10000
              }},
            "aggs": {{
              "region": {{
                "terms": {{
                  "field": "districtname.keyword",
                  "size":10000
                }},
                "aggs": {{
                  "todaysTotalApplications": {{
                    "value_count": {{
                      "field": "applicationnumber.keyword"
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


def extract_ws_closed_applications(metrics, region_bucket):
    metrics['todaysClosedApplications'] = region_bucket.get('todaysClosedApplications').get(
        'value') if region_bucket.get('todaysClosedApplications') else 0
    return metrics

ws_closed_applications = {'path': 'wsapplications/_search',
                          'name': 'ws_closed_applications',
                          'lambda': extract_ws_closed_applications,
                          'query': """

 {{
    "size": 0,
          "query": {{
          "bool": {{
            "must": [
              {{
                "range": {{
                "createddate": {{
                "gte": {0},
                "lte": {1},
                "format": "epoch_millis"
                }}
          }}
              }},
               {{
              "terms": {{
                "Data.connectionstatus.keyword": [
                  "INPROGRESS"
                ]
              }}
            }}
            ]
          }}
        }},
            "aggs": {{
                "ward": {{
                  "terms": {{
                    "field": "block.keyword",
                    "size":10000
                  }},
              "aggs": {{
                "ulb": {{
                  "terms": {{
                    "field": "cityname.keyword",
                    "size":10000
                  }},
                "aggs": {{
                  "region": {{
                    "terms": {{
                      "field": "districtname.keyword",
                      "size":10000
                    }},
                    "aggs": {{
                      "todaysClosedApplications": {{
                        "value_count": {{
                          "field": "applicationnumber.keyword"
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


def extract_ws_connections_created_by_connection_type(metrics, region_bucket):
    groupby_connection_type = []
    collection = metrics.get('connectionsCreated') if metrics.get('connectionsCreated') else []

    if region_bucket.get('meteredconnectionCreated'):
        created_buckets = region_bucket.get('meteredconnectionCreated').get('meteredconnectionCreated')
        if created_buckets:
            groupby_connection_type.append({'name' : 'WATER.METERED', 'value' : created_buckets.get('value') if created_buckets else 0})

    if region_bucket.get('sewerageconnectionCreated'):
        created_buckets = region_bucket.get('sewerageconnectionCreated').get('sewerageconnectionCreated')
        if created_buckets:
            groupby_connection_type.append({'name' : 'SEWERAGE', 'value' : created_buckets.get('value') if created_buckets else 0})

    if region_bucket.get('non-meteredconnectionCreated'):
        created_buckets = region_bucket.get('non-meteredconnectionCreated').get('non-meteredconnectionCreated')
        if created_buckets:
            groupby_connection_type.append({'name' : 'WATER.NONMETERED', 'value' : created_buckets.get('value') if created_buckets else 0})

    collection.append({ 'groupBy': 'connectionType', 'buckets' : groupby_connection_type})
    metrics['connectionsCreated'] = collection

    return metrics

ws_connections_created_by_connection_type = {'path': 'wsapplications/_search',
                                             'name': 'ws_connections_created_by_connection_type',
                                             'lambda': extract_ws_connections_created_by_connection_type,
                                             'query': """
 {{
    "size": 0,
      "query": {{
          "bool": {{
            "must": [
              {{
                "terms": {{
                  "servicetype.keyword": [
                    "Water Charges",
                     "Sewerage Charges"
                  ]
                }}
              }},
              {{
                "terms": {{
                  "connectionstatus.keyword": [
                    "ACTIVE"
                  ]
                }}
              }},
                {{
                "range": {{
                  "createddate": {{
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
                    "field": "block.keyword",
                    "size":10000
                  }},
              "aggs": {{
                "ulb": {{
                  "terms": {{
                    "field": "cityname.keyword",
                    "size":10000
                  }},
                "aggs": {{
                  "region": {{
                    "terms": {{
                      "field": "districtname.keyword",
                      "size":10000
                    }},
                    "aggs": {{
                      "meteredconnectionCreated": {{
                        "filter": {{
                          "term": {{
                            "connectiontype.keyword": "Metered"
                          }}
                        }},
                        "aggs": {{
                          "meteredconnectionCreated": {{
                            "value_count": {{
                              "field": "applicationnumber.keyword"
                            }}
                          }}
                        }}
                      }},
                      "non-meteredconnectionCreated": {{
                        "filter": {{
                            "term" : {{ "connectiontype.keyword" : "Non-Metered" }}
                             }},
                              "aggs": {{
                                "non-meteredconnectionCreated": {{
                                  "value_count": {{
                                    "field": "applicationnumber.keyword"
                                  }}
                                }}
                              }}
                      }},
                      "sewerageconnectionCreated": {{
                        "filter": {{
                          "term": {{
                            "servicetype.keyword": "Sewerage Charges"
                          }}
                        }},
                        "aggs": {{
                          "sewerageconnectionCreated": {{
                            "value_count": {{
                              "field": "applicationnumber.keyword"
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


def extract_ws_connections_created_by_channel_type(metrics, region_bucket):
    groupby_channel = []
    collection = metrics.get('connectionsCreated') if metrics.get('connectionsCreated') else []

    if region_bucket.get('channelType'):
        channel_buckets = region_bucket.get('channelType').get('buckets')
        for channel_bucket in channel_buckets:
            channel = channel_bucket.get('key')
            value = channel_bucket.get('count').get('value') if channel_bucket.get('count') else 0
            groupby_channel.append({ 'name' : channel, 'value' : value})


    collection.append({ 'groupBy': 'channelType', 'buckets' : groupby_channel})
    metrics['connectionsCreated'] = collection

    return metrics

ws_connections_created_by_channel_type = {'path': 'wsapplications/_search',
                                          'name': 'ws_connections_created_by_channel_type',
                                          'lambda': extract_ws_connections_created_by_channel_type,
                                          'query': """
  {{
    "size": 0,
      "query": {{
          "bool": {{
            "must_not": [
              {{
                "term": {{
                  "applicationstatus.keyword": "Cancelled"
                }}
              }}
            ],
            "must": [
              {{
                "terms": {{
                  "servicetype.keyword": [
                    "Water Charges",
                    "Sewerage Charges"
                  ]
                }}
              }},
              {{
                "terms": {{
                  "connectionstatus.keyword": [
                    "ACTIVE"
                  ]
                }}
              }},
             {{
                "range": {{
                  "createddate": {{
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
                    "field": "block.keyword",
                    "size":10000
                  }},
              "aggs": {{
                "ulb": {{
                  "terms": {{
                    "field": "cityname.keyword",
                    "size":10000
                  }},
                "aggs": {{
                  "region": {{
                    "terms": {{
                      "field": "districtname.keyword",
                      "size":10000
                    }},
                    "aggs": {{
                      "channelType": {{
                        "terms": {{
                          "field": "channel.keyword",
                          "size":10000
                        }},
                      "aggs": {{
                        "count": {{
                          "value_count": {{
                            "field": "applicationnumber.keyword"
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
    metrics['transactions'] = region_bucket.get('transactions').get(
        'value') if region_bucket.get('transactions') else 0
    return metrics


ws_total_transactions = {'path': 'dss-collection_v2/_search',
                         'name': 'ws_total_transactions',
                         'lambda': extract_ws_total_transactions,
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
                   "range":{{
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
        "ulb" :{{
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
            "aggs":{{
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


def extract_ws_todays_completed_applications_withinSLA(metrics, region_bucket):
    val = 0 if region_bucket.get('todaysCompletedApplicationsWithinSLA').get('value') == None else region_bucket.get('todaysCompletedApplicationsWithinSLA').get('value')
    metrics['todaysCompletedApplicationsWithinSLA'] = val
    metrics['todaysCompletedApplicationsWithinSLA'] = val
    return metrics

ws_todays_completed_application_withinSLA = {'path': 'wsapplications/_search',
                                             'name': 'ws_todays_completed_application_withinSLA',
                                             'lambda': extract_ws_todays_completed_applications_withinSLA,
                                             'query': """

{{
  "size": 0,
  "query": {{
    "bool": {{
      "must": [
        {{
          "range": {{
            "createddate": {{
              "gte": {0},
              "lte": {1},
              "format": "epoch_millis"
            }}
          }}
        }}
      ],
      "filter": {{
        "terms": {{
          "connectionstatus.keyword": [
            "INPROGRESS"
          ]
        }}
      }}
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "block.keyword",
        "size":10000
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "cityname.keyword",
            "size":10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "districtname.keyword",
                "size":10000
              }},
              "aggs": {{
                "todaysCompletedApplicationsWithinSLA": {{
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

def extract_ws_todays_sla_compliance(metrics, region_bucket):
    metrics['todaysCompletedApplicationsWithinSLA'] = region_bucket.get('slaCompliance').get(
        'value') if region_bucket.get('slaCompliance') else 0
    return metrics

ws_todays_sla_compliance = {'path': 'wsapplications/_search',
                            'name': 'ws_todays_sla_compliance',
                            'lambda': extract_ws_todays_sla_compliance,
                            'query': """
{{
  "size": 0,
  "query": {{
    "bool": {{
      "must": [
        {{
          "range": {{
            "createddate": {{
              "gte": {0},
              "lte": {1},
              "format": "epoch_millis"
            }}
          }}
        }}
      ],
      "filter": {{
        "terms": {{
          "connectionstatus.keyword": [
            "INPROGRESS"
          ]
        }}
      }}
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "block.keyword",
        "size":10000
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "cityname.keyword",
            "size":10000
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "districtname.keyword",
                "size":10000
              }},
              "aggs": {{
                "TotalApplication": {{
                  "value_count": {{
                    "field": "applicationnumber.keyword"
                  }}
                }},
                "todaysCompletedApplicationsWithinSLA": {{
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
                    "count": {{
                      "value_count": {{
                        "field": "id.keyword"
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

ws_queries = [ws_collection_by_payment_channel_type,
              ws_connections_created_by_connection_type,
              ws_pending_connections,
              ws_sewerage_connections,
              ws_water_connections,
              ws_todays_applications,
              ws_closed_applications,
              ws_connections_created_by_channel_type,
              ws_connections_created_by_connection_type,
              ws_total_transactions,
              ws_todays_sla_compliance,
              ws_todays_completed_application_withinSLA]

#the default payload for WS
def empty_ws_payload(region, ulb, ward, date):
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

