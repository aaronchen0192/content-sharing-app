import json
# import requests
import boto3
import time

dynamodb = boto3.resource('dynamodb')
textTable = dynamodb.Table('SharedSpaceTextTable')

def lambda_handler(event, context):
    """Sample pure Lambda function

    Parameters
    ----------
    event: dict, required
        API Gateway Lambda Proxy Input Format

        Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format

    context: object, required
        Lambda Context runtime methods and attributes

        Context doc: https://docs.aws.amazon.com/lambda/latest/dg/python-context-object.html

    Returns
    ------
    API Gateway Lambda Proxy Output Format: dict

        Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
    """

    # try:
    #     ip = requests.get("http://checkip.amazonaws.com/")
    # except requests.RequestException as e:
    #     # Send some context about this error to Lambda Logs
    #     print(e)

    #     raise e

    query_params = event['queryStringParameters']

    sid = query_params['sid']
    text = json.loads(event['body'])

    # 15 min
    expire_time = 60*15 + int(time.time()) 
    status_code = 200

    #try:
    textTable.put_item(Item={'sid': sid, 'value': text, 'expire': expire_time})
    # except ClientError as e:
    #     if e.response['Error']['Code'] == 'EntityAlreadyExists':
    #         print("User already exists")
    #     else:
    #         print("Unexpected error: %s" % e)
    #     status_code = 400

    return {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        "body": expire_time,
    }
