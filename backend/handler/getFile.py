import json
from datetime import datetime
# import requests
import boto3

dynamodb = boto3.resource('dynamodb')
keyTable = dynamodb.Table('SharedSpaceUploadTable')
s3 = boto3.client('s3')

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

    # Retrieve the file key from DynamoDB
    
    query_params = event['queryStringParameters']

    sid = query_params['sid']

    key_name = 'sid'
    key_value = sid
    
    response = keyTable.get_item(Key={key_name: key_value})
    
    item = response.get('Item')
    if not item:
        return {
            'statusCode': 404,
            'body': 'File key not found in DynamoDB'
        }
    
    file_key = item.get('file_key')
    if not file_key:
        return {
            'statusCode': 404,
            'body': 'File key not found in DynamoDB'
        }
    
    # Retrieve all files with the same key from Amazon S3
    bucket_name = 'content-shared-app-uploads'
    
    try:
        response = s3.list_objects_v2(Bucket=bucket_name, Prefix=key_value)
        file_objects = response.get('Contents', [])
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }
    
    files = []
    for file_obj in file_objects:
        file_key = file_obj['Key']
        response = s3.get_object(Bucket=bucket_name, Key=file_key)
        file_data = response['Body'].read()
        
        files.append({
            'file_key': file_key,
            'file_data': file_data
        })
    
    # Prepare the response
    http_status_code = 200
    headers = {
        'Content-Type': 'application/json'  # Set the appropriate content type
    }
    
    # Return the files as the response
    return {
        'statusCode': http_status_code,
        'headers': headers,
        'body': {
            'files': files
        }
    }
