import boto3
import os
import json
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq

# Load environment variables
load_dotenv()
gemini_api_key = os.getenv('GEMINI_API_KEY')
groq_api_key = os.getenv('GROQ_API_KEY')

# Initialize LLMs
llm = ChatGroq(api_key=groq_api_key)

# AWS Lambda handler function
def lambda_handler(event, context):
    # Retrieve S3 bucket name and document name from query parameters
    bucket_name = event['queryStringParameters'].get('bucket', 'billimages')  # Default value: 'billimages'
    document_name = event['queryStringParameters'].get('key', 'bill1.jpg')    # Default value: 'bill1.jpg'

    # Initialize AWS Textract client
    textract_client = boto3.client('textract', region_name='us-east-1')
    
    # Analyze document using Textract
    response = textract_client.analyze_document(
        Document={'S3Object': {'Bucket': bucket_name, 'Name': document_name}},
        FeatureTypes=['FORMS', 'TABLES']
    )

    # Extract lines from Textract response
    lines = [block['Text'] for block in response['Blocks'] if block['BlockType'] == 'LINE']

    # Define Receipt model using Pydantic
    class Receipt(BaseModel):
        items: dict = Field(description="Items and their prices")
        taxes: dict = Field(description="Taxes")
        total: float = Field(description="Final total excluding tax")

    # Format text for the LLM
    formatted_text = f"""
    Extracted Receipt Text:
    {lines}

    Task: Please segregate the items and their prices from the above text, including individual items and taxes including final total but exclude total tax. Provide the output in the following JSON format:
    - "items": {"<Item Name>": <Price>, ...}
    - "taxes": {"<Tax Type>": <Amount>, ...}
    - "total": <Final Total Amount>
    """

    # Define messages for LLM
    messages = [
        ("system", "You are a helpful assistant that processes receipts."),
        ("human", f"""{formatted_text}"""),
    ]

    # Call the LLM to get structured output
    structured_llm = llm.with_structured_output(Receipt)
    structured_output = structured_llm.invoke(messages)

    # Create a JSON response from the structured output
    receipt_data = {
        "items": structured_output.items,
        "taxes": structured_output.taxes,
        "total": structured_output.total
    }

    # Return the JSON response
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
        },
        'body': json.dumps(receipt_data)
    }
