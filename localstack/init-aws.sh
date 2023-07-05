#!/usr/bin/env bash

# buckets=(
#   safe-configs
#   safe-invoices
#   safe-attachments
#   safe-mock-endpoint-data
# )

# for bucket in "${buckets[@]}"; do
#     echo "Creating '$bucket' bucket"
#     awslocal s3 mb s3://$bucket > /dev/null
# done

tables=(
  HeartBeatState
  BackgroundCheckState
  AccessRequestsState
  FRequestState
  QgRequestState
  QnpRequestState
  StatePartnersState
  IaqRequestState
  DwRequestState
  QnrRequestState
)

for table in "${tables[@]}"; do
  echo "Creating $table DynamoDB table..."
  awslocal dynamodb create-table \
    --table-name $table \
    --key-schema AttributeName=PK,KeyType=HASH AttributeName=SK,KeyType=RANGE \
    --attribute-definitions AttributeName=PK,AttributeType=S AttributeName=SK,AttributeType=S \
    --billing-mode PAY_PER_REQUEST \
    --region us-gov-west-1 > /dev/null
done
