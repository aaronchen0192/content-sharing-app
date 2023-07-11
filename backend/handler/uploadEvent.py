import json
from datetime import datetime
# import requests
import boto3

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

    # Retrieve files from the POST request
    files = event['files']
    
    # Store each file in S3 and its corresponding key in DynamoDB
    for file_data in files:
        # Store file in S3
        file = file_data['content']
        file_name = file_data['filename']

        # Check file size
        file_size = len(file)
        if file_size > BYTES_LIMIT:  # 15MB in bytes
            print(f"File '{file_name}' exceeds the maximum allowed size")
            # Handle the error case or skip storing the file
            continue

        bucket_name = 'content-shared-app-uploads'
        s3_key = f'{sid}/{file_name}'  # Specify the desired prefix for the S3 object key
        
        try:
            s3.upload_fileobj(file, bucket_name, s3_key)
        except ClientError as e:
            print(f"Failed to upload file '{file_name}' to S3: {str(e)}")
            # Handle the error case
        
        # Store file key in DynamoDB
        key_name = 'sid'
        
        item = {
            key_name: sid,
            'file_key': s3_key
        }
        
        try:
            keyTable.put_item(Item=item)
        except ClientError as e:
            print(f"Failed to store file key '{s3_key}' in DynamoDB: {str(e)}")
            # Handle the error case
    
    # Return a success response
    return {
        'statusCode': 200,
        'body': 'Files stored successfully'
    }
