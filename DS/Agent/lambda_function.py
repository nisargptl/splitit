# your_script.py

from RecurringTxn import process_data
import json

def lambda_handler(event, context):
    # Extract information from the JSON payload (event)
    input_data = event.get("data")
    with open('./groq_api.json', 'r') as file:
        groq_api_key = json.load(file)

    output_json= process_data(input_data, groq_api_key)
    # Perform some processing (just an example here)
    processed_data = {
        "processed": True,
        "message": "Data processed successfully",
        "input": output_json
    }

    # Return a JSON response
    return {
        'statusCode': 200,
        'body': processed_data
    }
