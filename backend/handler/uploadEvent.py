import json
from datetime import datetime
# import requests
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
keyTable = dynamodb.Table('SharedSpaceUploadTable')
s3 = boto3.client('s3')

BYTES_LIMIT = 15 * 1024 * 1024

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
    key = query_params['key']

    # Retrieve files from the POST request
    file_data = event['file']
    
    # Store file in S3 and its corresponding key in DynamoDB
    file = file_data['content']
    file_name = file_data['filename']

    # Check file size
    file_size = len(file)
    if file_size > BYTES_LIMIT:  # 15MB in bytes
        print(f"File '{file_name}' exceeds the maximum allowed size")
        # Handle the error case or skip storing the file
        return {
            'statusCode': 413,
            'body': 'File too big'
        }
    
    bucket_name = 'content-shared-app-uploads'
    s3_key = f'{sid}/{key}'  # Specify the desired prefix for the S3 object key
    
    try:
        s3.upload_fileobj(file, bucket_name, s3_key)
    except ClientError as e:
        print(f"Failed to upload file '{file_name}' to S3: {str(e)}")
        # Handle the error case
        return {
            'statusCode': 500,
            'body': 'S3 bucket storing failed'
        }
    
    # Store file key in DynamoDB
    minutes = 15
    expire_time = int(60*minutes + datetime.now().timestamp())

    item = {
        'sid': sid,
        'file_key': key,
        'expire': str(expire_time)
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
    return {
        'statusCode': 200,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        },
        "body": expire_time,
    }
