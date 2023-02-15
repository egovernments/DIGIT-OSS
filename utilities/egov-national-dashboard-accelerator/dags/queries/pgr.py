
import logging
uuid = []
def extract_pgr_closed_complaints(metrics, region_bucket):
    department_agg = region_bucket.get('department')
    department_buckets = department_agg.get('buckets')
    todaysClosedComplaints = { 'groupBy' : 'department', 'buckets' : []}


    for department_bucket in department_buckets:
        department_name = department_bucket.get('key')
        todaysClosedComplaints['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('closedComplaints').get('value') if department_bucket.get('closedComplaints') else 0})

        metrics['todaysClosedComplaints'] = [todaysClosedComplaints]


    return metrics

pgr_closed_complaints = {
    'path': 'pgrindex-v1-enriched/_search',
    'name': 'pgr_closed_complaints',
    'lambda': extract_pgr_closed_complaints,
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
                    "Data.dateOfComplaint": {{
                    "gte": {0},
                    "lte": {1},
                    "format": "epoch_millis"
                }}
              }}
            }}
            ],
          "filter" :{{
              "terms": {{
                "Data.status.keyword": [
                    "closed",
                    "rejected",
                    "resolved"
                ]
              }}
            }}
        }}
      }},
        "aggs": {{
        "ward": {{
          "terms": {{
            "field": "Data.complaintWard.name.keyword",
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
                  "field": "Data.department.keyword"
                }},
                       "aggs": {{
                          	"closedComplaints": {{
                            "value_count": {{
                              "field": "Data.dateOfComplaint"
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


def extract_pgr_resolved_complaints(metrics, region_bucket):
    department_agg = region_bucket.get('department')
    department_buckets = department_agg.get('buckets')
    todaysResolvedComplaints = { 'groupBy' : 'department', 'buckets' : []}


    for department_bucket in department_buckets:
        department_name = department_bucket.get('key')
        todaysResolvedComplaints['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('resolvedComplaints').get('value') if department_bucket.get('resolvedComplaints') else 0})

        metrics['todaysResolvedComplaints'] = [todaysResolvedComplaints]


    return metrics

pgr_resolved_complaints = {
    'path': 'pgrindex-v1-enriched/_search',
    'name': 'pgr_resolved_complaints',
    'lambda': extract_pgr_resolved_complaints,
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
            "Data.dateOfComplaint": {{
              "gte": {0},
              "lte": {1},
              "format": "epoch_millis"
            }}
          }}
        }}
      ],
      "filter": {{
        "terms": {{
          "Data.status.keyword": [
            "resolved"
          ]
        }}
      }}
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "Data.complaintWard.name.keyword",
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
                    "field": "Data.department.keyword"
                  }},
                  "aggs": {{
                    "resolvedComplaints": {{
                      "value_count": {{
                        "field": "Data.dateOfComplaint"
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


def extract_pgr_unique_citizens(metrics, region_bucket):
    uuid_agg = region_bucket.get('uuid')
    uuid_buckets = uuid_agg.get('buckets')
    for uuid_bucket in uuid_buckets:
        uuid_name = uuid_bucket.get('key')
        if uuid_name in uuid:
            value = 0
            logging.info("exists {0}".format(uuid_name))
        else:
            value = uuid_bucket.get('uniqueCitizens').get('value')
            metrics['uniqueCitizens'] += value
            uuid.append(uuid_name)
    return metrics

pgr_unique_citizens = {
    'path': 'pgrindex-v1-enriched/_search',
    'name': 'pgr_unique_citizens',
    'lambda': extract_pgr_unique_citizens,
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
        "must":[
            {{
               "range": {{
                    "Data.dateOfComplaint": {{
                    "gte": {0},
                    "lte": {1},
                    "format": "epoch_millis"
                }}
              }}
            }}]
          }}
        }},
        "aggs": {{
              "ward": {{
                "terms": {{
                  "field": "Data.complaintWard.name.keyword",
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
                "uuid": {{
                  "terms": {{
                    "field": "Data.citizen.uuid.keyword",
                    "size": 1000
                  }},  
            "aggs": {{
              "uniqueCitizens": {{
                "cardinality": {{
                  "field": "Data.citizen.uuid.keyword"
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


def extract_pgr_sla_achieved(metrics, region_bucket):
    department_agg = region_bucket.get('department')
    department_buckets = department_agg.get('buckets')
    slaAchievement = { 'groupBy' : 'department', 'buckets' : []}


    for department_bucket in department_buckets:
        department_name = department_bucket.get('key')
        value = 0
        value = department_bucket.get('all_matching_docs').get('buckets').get('all').get('slaAchievement').get('value')
        slaAchievement['buckets'].append( { 'name' : department_name, 'value' :value})

    metrics['slaAchievement'] = [slaAchievement]


    return metrics


pgr_sla_achieved = {
    'path': 'pgrindex-v1-enriched/_search',

    'name': 'pgr_sla_achieved',
    'lambda': extract_pgr_sla_achieved,
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
            "Data.dateOfComplaint": {{
              "gte": {0},
              "lte": {1},
              "format": "epoch_millis"
            }}
          }}
        }},
        {{
          "range": {{
            "Data.slaHours": {{
              "gte": 0,
              "lte": 360
            }}
          }}
        }}
      ]
    }}
  }},
  "aggs": {{
    "ward": {{
      "terms": {{
        "field": "Data.complaintWard.name.keyword"
      }},
      "aggs": {{
        "ulb": {{
          "terms": {{
            "field": "Data.tenantId.keyword"
          }},
          "aggs": {{
            "region": {{
              "terms": {{
                "field": "Data.tenantData.city.districtName.keyword"
              }},
              "aggs": {{
                "department": {{
                  "terms": {{
                    "field": "Data.department.keyword"
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
                        "totalComplaints": {{
                          "value_count": {{
                            "field": "Data.dateOfComplaint"
                          }}
                        }},
                        "slaAchieved": {{
                          "value_count": {{
                            "field": "Data.slaHours"
                          }}
                        }},
                        "slaAchievement": {{
                          "bucket_script": {{
                            "buckets_path": {{
                              "closed": "slaAchieved",
                              "total": "totalComplaints"
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
      }}
    }}
  }}
}}



    """
}


def extract_pgr_completion_rate(metrics, region_bucket):

    department_agg = region_bucket.get('department')
    department_buckets = department_agg.get('buckets')
    completionRate = { 'groupBy' : 'department', 'buckets' : []}

    for department_bucket in department_buckets:
        department_name = department_bucket.get('key')
        value = 0
        value = department_bucket.get('all_matching_docs').get('buckets').get('all').get('completionRate').get('value')
        completionRate['buckets'].append( { 'name' : department_name, 'value' :value})

    metrics['completionRate'] = [completionRate]
    return metrics

pgr_completion_rate = {
    'path': 'pgrindex-v1-enriched/_search',

    'name': 'pgr_completion_rate',
    'lambda': extract_pgr_completion_rate,
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
            "Data.dateOfComplaint": {{
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
        "field": "Data.complaintWard.name.keyword",
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
                    "field": "Data.department.keyword",
                    "size":10000
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
                        "totalComplaints": {{
                          "value_count": {{
                            "field": "Data.dateOfComplaint"
                          }}
                        }},
                        "closedComplaints": {{
                          "filter": {{
                            "terms": {{
                              "Data.status.keyword": [
                                "closed",
                                "resolved",
                                "rejected"
                              ]
                            }}
                          }},
                          "aggs": {{
                            "complaints": {{
                              "value_count": {{
                                "field": "Data.dateOfComplaint"
                              }}
                            }}
                          }}
                        }},
                        "completionRate": {{
                          "bucket_script": {{
                            "buckets_path": {{
                              "closed": "closedComplaints>complaints",
                              "total": "totalComplaints"
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
      }}
    }}
  }}
}}



    """
}


def extract_pgr_todays_complaints(metrics, region_bucket):
    status_agg = region_bucket.get('Complaints By Status')
    status_buckets = status_agg.get('buckets')
    allDims = []
    grouped_by = []
    for status_bucket in status_buckets:
        grouped_by.append({'name': status_bucket.get('key'), 'value': status_bucket.get(
            'byStatus').get('value') if status_bucket.get('byStatus') else 0})
    allDims.append(
        {'groupBy': 'status', 'buckets': grouped_by})

    channel_agg = region_bucket.get('Complaints By Channels')
    channel_buckets = channel_agg.get('buckets')
    grouped_by = []
    for channel_bucket in channel_buckets:
        grouped_by.append({'name': channel_bucket.get('key'), 'value': channel_bucket.get(
            'byChannel').get('value') if channel_bucket.get('byChannel') else 0})
    allDims.append(
        {'groupBy': 'channel', 'buckets': grouped_by})

    department_agg = region_bucket.get('Complaints By Department')
    department_buckets = department_agg.get('buckets')
    grouped_by = []
    for department_bucket in department_buckets:
        grouped_by.append({'name': department_bucket.get('key'), 'value': department_bucket.get(
            'byDepartment').get('value') if department_bucket.get('byDepartment') else 0})
    allDims.append(
        {'groupBy': 'department', 'buckets': grouped_by})

    category_agg = region_bucket.get('Complaints By Category')
    category_buckets = category_agg.get('buckets')
    grouped_by = []
    for category_bucket in category_buckets:
        grouped_by.append({'name': category_bucket.get('key'), 'value': category_bucket.get(
            'byCategory').get('value') if category_bucket.get('byCategory') else 0})
    allDims.append(
        {'groupBy': 'category', 'buckets': grouped_by})


    metrics['todaysComplaints'] = allDims
    return metrics

pgr_todays_complaints = {
    'path': 'pgrindex-v1-enriched/_search',

    'name': 'pgr_todays_complaints',
    'lambda': extract_pgr_todays_complaints,
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
        "must":[
            {{
               "range": {{
                    "Data.dateOfComplaint": {{
                    "gte": {0},
                    "lte": {1},
                    "format": "epoch_millis"
                }}
              }}
            }}]
        }}
      }},
       "aggs": {{
            "ward": {{
              "terms": {{
                "field": "Data.complaintWard.name.keyword",
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
                    "Complaints By Status": {{
                        "terms": {{
                          "field": "Data.status.keyword"
                        }},
                        "aggs": {{
                          "byStatus": {{
                            "value_count": {{
                              "field": "Data.dateOfComplaint"
                            }}
                          }}
                        }}
                      }},
                  "Complaints By Channels": {{
                      "terms": {{
                        "field": "Data.source.keyword"
                      }},
                      "aggs": {{
                        "byChannel": {{
                          "value_count": {{
                            "field": "Data.dateOfComplaint"
                          }}
                        }}
                      }}
                    }},
                  "Complaints By Department": {{
                  "terms": {{
                    "field": "Data.department.keyword"
                  }},
                    "aggs": {{
                      "byDepartment": {{
                        "value_count": {{
                          "field": "Data.dateOfComplaint"
                        }}
                      }}
                    }}
                   }},
                 "Complaints By Category": {{
                    "terms": {{
                              "field": "Data.complainCategory.keyword"
                          }},
                    "aggs": {{
                      "byCategory": {{
                        "value_count": {{
                          "field": "Data.dateOfComplaint"
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


def extract_pgr_status(metrics, region_bucket):
    department_agg = region_bucket.get('department')

    department_buckets = department_agg.get('buckets') if department_agg.get('buckets') else []
    todaysReopenedComplaints = { 'groupBy' : 'department', 'buckets' : []}
    todaysOpenComplaints = { 'groupBy' : 'department', 'buckets' : []}
    todaysAssignedComplaints = { 'groupBy' : 'department', 'buckets' : []}
    todaysRejectedComplaints = { 'groupBy' : 'department', 'buckets' : []}
    todaysReassignedComplaints = { 'groupBy' : 'department', 'buckets' : []}
    todaysReassignRequestedComplaints = { 'groupBy' : 'department', 'buckets' : []}
    for department_bucket in department_buckets:
        department_name = department_bucket.get('key')
        todaysReopenedComplaints['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('todaysReopenedComplaints').get('todaysReopenedComplaints').get('value') if department_bucket.get('todaysReopenedComplaints') else 0})
        todaysOpenComplaints['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('todaysOpenComplaints').get('todaysOpenComplaints').get('value') if department_bucket.get('todaysOpenComplaints') else 0})
        todaysAssignedComplaints['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('todaysAssignedComplaints').get('todaysAssignedComplaints').get('value') if department_bucket.get('todaysAssignedComplaints') else 0})
        todaysRejectedComplaints['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('todaysRejectedComplaints').get('todaysRejectedComplaints').get('value') if department_bucket.get('todaysRejectedComplaints') else 0})
        todaysReassignedComplaints['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('todaysReassignedComplaints').get('todaysReassignedComplaints').get('value') if department_bucket.get('todaysReassignedComplaints') else 0})
        todaysReassignRequestedComplaints['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('todaysReassignRequestedComplaints').get('todaysReassignRequestedComplaints').get('value') if department_bucket.get('todaysReassignRequestedComplaints') else 0})


    metrics['todaysReopenedComplaints'] = [todaysReopenedComplaints]
    metrics['todaysOpenComplaints'] = [todaysOpenComplaints]
    metrics['todaysAssignedComplaints'] = [todaysAssignedComplaints]
    metrics['todaysRejectedComplaints'] = [todaysRejectedComplaints]
    metrics['todaysReassignedComplaints'] = [todaysReassignedComplaints]
    metrics['todaysReassignRequestedComplaints'] = [todaysReassignRequestedComplaints]


    return metrics

pgr_status = {

    'path': 'pgrindex-v1-enriched/_search',

    'name': 'pgr_status',
    'lambda': extract_pgr_status,
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
            "Data.dateOfComplaint": {{
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
        "field": "Data.complaintWard.name.keyword",
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
                    "field": "Data.department.keyword"
                  }},
                  "aggs": {{
                    "todaysRejectedComplaints": {{
                      "filter": {{
                        "terms": {{
                          "Data.status.keyword": [
                            "rejected"
                          ]
                        }}
                      }},
                      "aggs": {{
                        "todaysRejectedComplaints": {{
                          "value_count": {{
                            "field": "Data.tenantId.keyword"
                          }}
                        }}
                      }}
                    }},
                    "todaysOpenComplaints": {{
                      "filter": {{
                        "terms": {{
                          "Data.status.keyword": [
                            "open"
                          ]
                        }}
                      }},
                      "aggs": {{
                        "todaysOpenComplaints": {{
                          "value_count": {{
                            "field": "Data.tenantId.keyword"
                          }}
                        }}
                      }}
                    }},
                    "todaysAssignedComplaints": {{
                      "filter": {{
                        "terms": {{
                          "Data.status.keyword": [
                            "assign",
                            "assigned"
                          ]
                        }}
                      }},
                      "aggs": {{
                        "todaysAssignedComplaints": {{
                          "value_count": {{
                            "field": "Data.tenantId.keyword"
                          }}
                        }}
                      }}
                    }},
                    "todaysReopenedComplaints": {{
                      "filter": {{
                        "terms": {{
                          "Data.actionHistory.actions.action.keyword": [
                            "reopen"
                          ]
                        }}
                      }},
                      "aggs": {{
                        "todaysReopenedComplaints": {{
                          "value_count": {{
                            "field": "Data.tenantId.keyword"
                          }}
                        }}
                      }}
                    }},
                    "todaysReassignRequestedComplaints": {{
                      "filter": {{
                        "terms": {{
                          "Data.status.keyword": [
                            "reassignrequested"
                          ]
                        }}
                      }},
                      "aggs": {{
                        "todaysReassignRequestedComplaints": {{
                          "value_count": {{
                            "field": "Data.tenantId.keyword"
                          }}
                        }}
                      }}
                    }},
                    "todaysReassignedComplaints": {{
                      "filter": {{
                        "terms": {{
                          "Data.status.keyword": [
                            "reassign"
                          ]
                        }}
                      }},
                      "aggs": {{
                        "todaysReassignedComplaints": {{
                          "value_count": {{
                            "field": "Data.tenantId.keyword"
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


def extract_pgr_avg_solution_time(metrics, region_bucket):
    department_agg = region_bucket.get('department')
    department_buckets = department_agg.get('buckets') if department_agg.get('buckets') else []
    averageSolutionTime = { 'groupBy' : 'department', 'buckets' : []}

    for department_bucket in department_buckets:
        department_name = department_bucket.get('key')
        averageSolutionTime['buckets'].append( { 'name' : department_name, 'value' : department_bucket.get('averageSolutionTime').get('value') if department_bucket.get('averageSolutionTime') else 0})


    metrics['averageSolutionTime'] = [averageSolutionTime]

    return metrics


pgr_avg_solution_time = {

    'path': 'pgrindex-v1-enriched/_search',

    'name': 'pgr_avg_solution_time',
    'lambda': extract_pgr_avg_solution_time,
    'query': """
   {{
    "size":0,
    "query": {{
          "bool": {{
            "must_not": [
              {{
                "term": {{
                  "Data.tenantId.keyword": "pb.testing"
                }}
              }}
            ],
          "must":[
              {{
                 "range": {{
                      "Data.dateOfComplaint": {{
                      "gte": {0},
                      "lte": {1},
                      "format": "epoch_millis"
                  }}
                }}
              }}]
          }}
      }},
    "aggs": {{
          "ward": {{
            "terms": {{
              "field": "Data.complaintWard.name.keyword",
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
                  "aggs":{{
                     "department": {{
                       "terms": {{
                      "field": "Data.department.keyword"
                       }}, 
                          "aggs": {{
                            "averageSolutionTime": {{
                            "avg": {{
                              "script": {{
                                "source": "(doc['Data.addressDetail.auditDetails.lastModifiedTime'].value - doc['Data.addressDetail.auditDetails.createdTime'].value)/(3600*1000)"
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

pgr_queries = [pgr_closed_complaints, pgr_resolved_complaints, pgr_unique_citizens, pgr_sla_achieved, pgr_completion_rate, pgr_todays_complaints, pgr_status, pgr_avg_solution_time]


def empty_pgr_payload(region, ulb, ward, date):
    return {
        "date": date,
        "module": "PGR",
        "ward": ward,
        "ulb": ulb,
        "region": region,
        "state": "Punjab",
        "metrics":  {
            "todaysClosedComplaints": [

            ],
            "todaysResolvedComplaints": [

            ],
            "slaAchievement": [],
            "completionRate": [

            ],
            "uniqueCitizens": 0,
            "todaysComplaints": [

            ],
            "todaysReopenedComplaints": [

            ],
            "todaysOpenComplaints": [

            ],
            "todaysAssignedComplaints": [

            ],
            "averageSolutionTime": [
                {
                    "groupBy": "department",
                    "buckets": [
                        {
                            "name": "DEPT1",
                            "value": 5
                        },
                        {
                            "name": "DEPT2",
                            "value": 8
                        },
                        {
                            "name": "DEPT3",
                            "value": 6
                        }
                    ]
                }
            ],
            "todaysRejectedComplaints": [

            ],
            "todaysReassignedComplaints": [

            ],
            "todaysReassignRequestedComplaints" : [
            ]
        }
    }