import json
import time
# import requests
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
keyTable = dynamodb.Table('SharedSpaceFileTable')

BYTES_LIMIT = 15 * 1024 * 1024

def lambda_handler(event, context):
 
    query_params = event['queryStringParameters']

    if 'sid' not in query_params or 'key' not in query_params:
        return {
            'statusCode': 422,
            'body': 'Request parameter error'
        }
    
    sid = query_params['sid']
    key = query_params['key']
    
    # event['body'] is checked at the top
    fileName = json.loads(event['body'])

    s3_key = f'{sid}/{key}'  # Specify the desired prefix for the S3 object key
    
    # Store file key in DynamoDB
    # 15 minutes
    expire_time = 60*15 + int(time.time()) 

    item = {
        'sid': sid,
        'key': key,
        'name': fileName,
        'expire': expire_time
    }
    
    try:
        keyTable.put_item(Item=item)
    except ClientError as e:
        print(f"Failed to store file key '{s3_key}' in DynamoDB: {str(e)}")
        # Handle the error case
        return {
            'statusCode': 500,
            'body': 'Dynamodb storing failed'
        }
    
    # Return a success response
    # front end expect number
    return {
        'statusCode': 200,
        'headers': {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        "body": expire_time,
    }
