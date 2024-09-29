# test_lambda.py

import json
from lambda_function import lambda_handler

# Simulate an incoming JSON payload (similar to what a POST request might look like)
event = {
    "data": [{
            "payer_id": "1",
            "payees": [
                {
                    "user_id": "1",
                    "amount": 200
                },
                {
                    "user_id": "2",
                    "amount": 200
                }
            ],
            "amount": 400,
            "date": "2024-08-01T00:00:00.000Z",
            "is_recurring": False,
            "txn_name": "OTT sub",
            "txn_id": "id1"
        },
        {
            "payer_id": "1",
            "payees": [
                {
                    "user_id": "3",
                    "amount": 200
                },
                {
                    "user_id": "1",
                    "amount": 200
                }
            ],
            "amount": 400,
            "date": "2024-09-01T00:00:00.000Z",
            "is_recurring": False,
            "txn_name": "Netflix Subscription",
            "txn_id": "id2"
}]

}

# You can ignore context for local testing
context = {}

# Invoke the Lambda function locally
response = lambda_handler(event, context)

# Print the response to see what would be returned by Lambda
print(response)
