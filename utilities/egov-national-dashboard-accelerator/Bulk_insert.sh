#!/bin/bash



# slightly malformed input data
input_start=$1
input_end=$2

sd=$input_start
while [ "$sd" != "$input_end" ]; do 
  echo $sd
  d=$(date -d $sd +"%d-%m-%Y" )
  echo "{\"conf\": {\"date\": \"$d\"},\"dag_run_id\": \"`uuidgen`\"}">d.json
  cat d.json
  curl --location --request POST 'https://airflow.mseva.lgpunjab.gov.in/api/v1/dags/national_dashboard_template_manual/dagRuns' --header 'Content-Type: application/json' --header 'Authorization: Basic YWRtaW46YWRtaW4=' --header 'Cookie: session=eyJfcGVybWFuZW50Ijp0cnVlfQ.YuAjsQ.tEFG5--mxGz284XvdrYwjUDZGi0' -d "@d.json"
  nd=$(date -d "$sd + 1 days" +"%Y-%m-%d")
  sd=$nd
  sleep 1
done
