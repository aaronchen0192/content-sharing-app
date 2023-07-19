import json
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
fileTable = dynamodb.Table('SharedSpaceFileTable')

def lambda_handler(event, context):

    if 'queryStringParameters' not in event or not event['queryStringParameters']:    
        return {
            'statusCode': 422,
            'body': 'Request parameter error'
        }
    
    # Retrieve the file key from DynamoDB
    query_params = event['queryStringParameters']

    if 'sid' not in query_params:
        return {
            'statusCode': 422,
            'body': 'Request parameter error'
        }
    
    sid = query_params['sid']
    
    try:
        # find all entries for this sid
        response = fileTable.query(
            KeyConditionExpression = Key('sid').eq(sid)
        )
        
    except ClientError as e:
        return {
            'statusCode': 400,
            'body': 'Get data failed'
        }
    
    items = response['Items']

    keys = []
    for item in items:
        keys.append({
            'name': item['name'],
            'key': item['key'],
            'expire': int(item['expire'])
        })
    
    # frontend expects a list of {'name':string, 'key':string, 'expire':number}
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        'body': json.dumps(keys) 
    }
