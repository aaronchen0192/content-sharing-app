import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
fileTable = dynamodb.Table('SharedSpaceFileTable')

def lambda_handler(event, context):

    # Retrieve the file key from DynamoDB
    
    query_params = event['queryStringParameters']

    sid = query_params['sid']
    
    response = fileTable.query(
        KeyConditionExpression = Key('sid').eq(sid)
    )
    
    items = response['Items']
    # if not items:
    #     return {
    #         'statusCode': 404,
    #         'body': 'sid not found in DynamoDB'
    #     }

    keys = []
    for item in items:
        keys.append({
            'name': item['name'],
            'key': item['key'],
            'expire': int(item['expire'])
        })
    
    # Return the files as the response
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        'body': json.dumps(keys) 
    }
