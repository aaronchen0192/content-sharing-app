import json
from datetime import datetime
# import requests
import boto3

dynamodb = boto3.resource('dynamodb')
keyTable = dynamodb.Table('SharedSpaceUploadTable')

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
    
    response = keyTable.batch_get_item(Key={'sid': sid})
    
    items = response['Responses'].get('SharedSpaceUploadTable', [])
    if not items:
        return {
            'statusCode': 404,
            'body': 'sid not found in DynamoDB'
        }

    keys = []
    for item in items:
        keys.append({
            'file_key': item['file_key'],
            'expire': int(item['expire'])
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
            'keys': keys
        }
    }
