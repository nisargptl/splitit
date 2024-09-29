import boto3
import re
import openai
from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv
from langchain_core.pydantic_v1 import BaseModel, Field
load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')

# Initialize Textract client
textract_client = boto3.client('textract', region_name='us-east-1')  # Change to your region

# Define the S3 bucket and document name
bucket_name = 'billimages'  # Replace with your bucket name
document_name = 'bill2.jpg'  # Replace with your document name

# Call Textract to analyze the document
response = textract_client.analyze_document(
    Document={'S3Object': {'Bucket': bucket_name, 'Name': document_name}},
    FeatureTypes=['FORMS', 'TABLES']
)
# Extracted text lines from the Textract response
lines = [block['Text'] for block in response['Blocks'] if block['BlockType'] == 'LINE']


formatted_text = f"""
Extracted Receipt Text:
{lines}

Task: Please segregate the items and their prices from the above text, including individual items and taxes including  total values but exclude total tax. Provide the output in the following format:
- Item: <Item Name> | Price: <Price>
"""

from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
  model="gpt-4o-mini",
  messages=[
    {"role": "system", "content": "You are a helpful assistant that processes receipts."},
    {"role": "user", "content": formatted_text}
  ],
  temperature=0.7,
  max_tokens=10000,
  top_p=1
)



# Step 7: Get the structured response from OpenAI
structured_output = response.choices[0].message.content

# Step 8: Print the structured items and prices
print("Structured Items and Prices:")
print(structured_output)




# Define a pattern to match the prices (e.g., "$1.38")
# price_pattern = r'\$([0-9]+\.[0-9]{2})'

# # Store extracted items and their prices
# items = []

# # Iterate through lines to detect prices and extract item names
# for i, line in enumerate(lines):
#     # Search for the price in the line
#     price_match = re.search(price_pattern, line)
#     if price_match:
#         # Extract the price
#         price = float(price_match.group(1))
        
#         # Get the item name which is the text before the price
#         # Use slicing to get the text before the price
#         item_name = lines[i-1].strip()
#         # print(item_name)
#         # Additional check if the item_name is empty
#         if not item_name:
#             # Split the line and try to capture text parts before the price
#             parts = re.split(price_pattern, line)
#             if len(parts) > 1:
#                 item_name = parts[0].strip()
        
#         # If item_name is still empty, print for debugging
#         if not item_name:
#             print(f"Warning: Unable to extract item name from line: '{line}'")

#         # Store the item name and price as a tuple
#         items.append((item_name, price))

# # Print the extracted items and prices
# print("Extracted Items and Prices:")
# for item, price in items:
#     print(f"Item: {item}, Price: ${price:.2f}")