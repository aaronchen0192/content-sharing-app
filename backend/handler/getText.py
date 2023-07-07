import json
from datetime import datetime
# import requests
import boto3

dynamodb = boto3.client('dynamodb')

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

    data = dynamodb.get_item(
        TableName='SharedSpaceText',
        Key={
            'sid': {
                'S': sid
            }
        }
    )

    if not 'Item' in data:
        respond_payload = {'value':''}
    else:
        respond_payload = {'value':data['Item']['value'], 'expire':data['Item']['ttl']}

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        },
        "body": json.dumps(respond_payload),
    }
