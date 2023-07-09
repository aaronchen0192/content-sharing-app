import json
from datetime import datetime
# import requests
import boto3

dynamodb = boto3.resource('dynamodb')
textTable = dynamodb.Table('SharedSpaceUploadTable')

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

    #key = event['Records'][0]['s3']['object']['key']
    tmp = event['Records'][0]['s3']['object']
    print(tmp)

    # query_params = event['queryStringParameters']

    # sid = query_params['sid']

    # data = textTable.get_item(Key={'sid': sid})

    # if not 'Item' in data:
    #     respond_payload = {'value':''}
    # else:
    #     respond_payload = {'value':data['Item']['value'], 'expire':int(data['Item']['expire'])}

    return {
        "statusCode": 200,
    }
