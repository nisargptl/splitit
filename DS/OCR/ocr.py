import boto3
import re
import openai
import os
from dotenv import load_dotenv
from pydantic import BaseModel
load_dotenv()
gemini_api_key = os.getenv('GEMINI_API_KEY')


from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    api_key=gemini_api_key,
    # other params...
)
textract_client = boto3.client('textract', region_name='us-east-1') 
bucket_name = 'billimages' 
document_name = 'bill2.jpg'
response = textract_client.analyze_document(
    Document={'S3Object': {'Bucket': bucket_name, 'Name': document_name}},
    FeatureTypes=['FORMS', 'TABLES']
)
lines = [block['Text'] for block in response['Blocks'] if block['BlockType'] == 'LINE']


formatted_text = f"""
Extracted Receipt Text:
{lines}

Task: Please segregate the items and their prices from the above text, including individual items and taxes including final total but exclude total tax. Provide the output in the following format:
- Item: <Item Name> | Price: <Price>
"""


messages = [
    ("system", "You are a helpful assistant that processes receipts."),
    ("human", f"""{formatted_text}"""),
]
ai_msg = llm.invoke(messages)
print(ai_msg)
structured_output = ai_msg.content
print("Structured Items and Prices:")
print(structured_output)



