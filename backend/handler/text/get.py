import json
from datetime import datetime
# import requests
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
textTable = dynamodb.Table('SharedSpaceTextTable')

def lambda_handler(event, context):

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
