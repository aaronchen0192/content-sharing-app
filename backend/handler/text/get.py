import json
from datetime import datetime
# import requests
import boto3
from botocore.exceptions import ClientError

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

    if 'queryStringParameters' not in event or not event['queryStringParameters']:    
        return {
            'statusCode': 422,
            'body': 'Request parameter error'
        }

    # get the dictionary for request parameter
    query_params = event['queryStringParameters']

    if 'sid' not in query_params:
        return {
            'statusCode': 422,
            'body': 'Request parameter error'
        }
    
    sid = query_params['sid']

    try:
        data = textTable.get_item(Key={'sid': sid})
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': 'Get data failed'
        }

    # if no Item return empty
    if not 'Item' in data:
        respond_payload = {'value':''}
    else:
        respond_payload = {'value':data['Item']['value'], 'expire':int(data['Item']['expire'])}

    # front end expect {'value':string, 'expire':number}
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        "body": json.dumps(respond_payload),
    }
