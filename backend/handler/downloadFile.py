import json
from datetime import datetime
# import requests
import boto3
from botocore.exceptions import ClientError

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

    Returnss
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
    key = query_params['key']
    
    bucket_name = 'content-shared-app-uploads'
    s3_key = f'{sid}/{key}'

    try:
        params = {'Bucket': bucket_name, 'Key': s3_key}
        url = s3.generate_presigned_url('get_object', Params=params, ExpiresIn=3600)
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
            "Access-Control-Allow-Methods": "GET",
            "Location": url,
        }
    }
