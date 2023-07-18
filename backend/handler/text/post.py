import json
import boto3
import time
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
textTable = dynamodb.Table('SharedSpaceTextTable')

def lambda_handler(event, context):

    if 'queryStringParameters' not in event or not event['queryStringParameters'] or 'body' not in event or not event['body']:    
        return {
            'statusCode': 422,
            'body': 'Request parameter error'
        }
    
    query_params = event['queryStringParameters']
    text = json.loads(event['body'])

    text_limit = 10000
    if len(text) > text_limit:
        return {
            'statusCode': 400,
            'body': 'Text reach limit'
        }

    if 'sid' not in query_params :
        return {
            'statusCode': 422,
            'body': 'Request parameter error'
        }
    
    sid = query_params['sid']

    # 15 min
    expire_time = 60*15 + int(time.time()) 
    status_code = 200

    try:
        textTable.put_item(Item={'sid': sid, 'value': text, 'expire': expire_time})
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': 'upsert data failed'
        }

    # front end expect number
    return {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        "body": expire_time,
    }
