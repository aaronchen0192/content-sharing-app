import json
from datetime import datetime
# import requests
import boto3
from botocore.exceptions import ClientError

s3 = boto3.client('s3')

def lambda_handler(event, context):
    query_params = event['queryStringParameters']

    sid = query_params['sid']
    key = query_params['key']
    
    bucket_name = 'content-shared-app-uploads'
    s3_key = f'{sid}/{key}'

    try:
        params = {'Bucket': bucket_name, 'Key': s3_key}
        url = s3.generate_presigned_url( 'get_object', Params=params, ExpiresIn=60)
    except ClientError as e:
        return {
            'statusCode': 404,
            'body': 'Resource not found'
        }
    
    return {
        'statusCode': 302,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Location": url,
        }
    }
