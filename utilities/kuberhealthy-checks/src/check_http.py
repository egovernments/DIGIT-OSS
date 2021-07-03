from common import *

params = {
    "CHECK_URL": {"default": None, "message": "The URL to be checked"},
    "CHECK_STATUS": {"default": "200", "message": "Comma seperated list of expected status code to be considered passed"},
    "URL_METHOD": {"default": "GET", "message": "Method to be used for url GET, PUT, HEAD and POST"},
    "URL_PAYLOAD": {"default": None, "message": "A path to file using file:/// format or a string payload itself", "required": False},
    "RESPONSE_CONTAINS": {"default": None, "message": "Check if something should be contains in the response", "required": False},
    "URL_HEADERS": {"default": None, "message": "Double || seperated headers", "required": False},
}

def execute(config):
    try:
        import requests

        method = config["URL_METHOD"]
        url = config["CHECK_URL"]
        status = config["CHECK_STATUS"].split(",")
        response_contains = config["RESPONSE_CONTAINS"]
        payload = config["URL_PAYLOAD"]
        headers = config["URL_HEADERS"]

        if headers:
            headers_map = {h.split(":", 1)[0]: h.split(":", 1)[1] for h in headers.split("||") }
            headers = headers_map

        res = requests.request(method=method,
        url = url,
        headers = headers,
        data=payload)

        message = "Status = {}, Allowed List = {}".format(res.status_code, status)
        errors = []
        if str(res.status_code) not in status:
            check_failed = True
            message = message + ". Check failed"
            errors.append(message)
        
        log(message)

        if response_contains and response_contains not in res.text:
            message = "Response doesn't contain expected text"
            log(message)
            errors.append(message)

        if len(errors) > 0:
            report_failure(*errors)
        else:
            log("Check passed")
            report_success()
        pass
    except Exception as ex:
        message = "URL - {} check failed. Exception = {}".format(url, str(ex))
        log(message)
        report_failure(message)

if __name__ == "__main__":
    execute(get_config(params))
