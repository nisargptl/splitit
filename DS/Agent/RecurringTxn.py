# Import necessary libraries

from datetime import datetime
from groq import Groq
import json


def is_name_similar(name1, name2, groq_api_key):


    api_key = groq_api_key['api_key']
    client = Groq(api_key=api_key)

    completion = client.chat.completions.create(
        model="llama-3.2-90b-text-preview",
        messages=[
            {
                "role": "user",
                "content": "Task:  Given two transaction names, determine if they are similar.  Instructions:      Similarity Criteria:         The names are considered similar if they share a significant number of words or phrases.         The comparison should be case-insensitive.         Common words like 'the', 'and', 'of', etc., should be ignored.         The order of words should not matter.      Examples:         'Starbucks Coffee' and 'Coffee at Starbucks' are similar.         'Amazon Purchase' and 'Amazon Prime Subscription' are not similar.      Transaction Names:         Name 1: \" + name1 + \"         Name 2: \" + name2 + \"      Output:         Return 'True' if the names are similar, 'False' otherwise.      Note:         You do not need to implement any string comparison logic. Use the provided model to generate the answer.         The model can understand the context of the task and generate the appropriate response.         The model will handle the case-insensitivity and common word removal.         The model will consider the similarity of the names based on the examples provided.         The model will generate the response based on the input transaction names.         The model will return only 'True' or 'False' based on the similarity of the names. The model will NOT output anything other thatn True or False  Transaction names- " + str(name1) + " and " + str(name2)
            }
        ],
        temperature=0.11,
        max_tokens=1600,
        top_p=1,
        stream=True,
        stop=None,
        seed=1
    )
    for chunk in completion:
        delta_content = chunk.choices[0].delta.content
        if delta_content and 'True' in delta_content:
            return True

    # If no chunk with 'True' was found, return False
    return False

def is_date_proximity(date1, date2):
    delta_days = abs((date1 - date2).days)
    return 28 <= delta_days <= 32

# Method 3: Amount similarity
def is_amount_similar(amount1, amount2):
    return 0.95 * amount1 <= amount2 <= 1.05 * amount1




def process_data(transactions, groq_api_key):




    # Convert date strings to datetime objects
    for txn in transactions:
        txn['date'] = datetime.fromisoformat(txn['date'].replace('Z', '+00:00'))

    # Sort transactions by date in descending order
    transactions.sort(key=lambda x: x['date'], reverse=True)

    # The most recent transaction is the first one in the sorted list
    most_recent_txn = transactions[0]
    #print(f"Payer ID of the most recent transaction: {most_recent_txn['payer_id']}")

    payer_id = most_recent_txn['payer_id']

    # Filter transactions where the payer is the same
    payer_transactions = [txn for txn in transactions if txn['payer_id'] == payer_id]

    # Ensure we have at least two transactions
    if len(payer_transactions) < 2:
        #print("Not enough transactions to determine recurrence.")
        is_recurring = False
    else:
        # Get the two most recent transactions for the payer
        recent_two_txns = payer_transactions[:2]  # transactions are already sorted
        txn1 = recent_two_txns[0]  # Most recent transaction
        txn2 = recent_two_txns[1]  # Previous transaction


    name_similar = is_name_similar(txn1['txn_name'], txn2['txn_name'], groq_api_key)
    #print(f"Transaction names are similar: {name_similar}")

    # Method 2: Date proximity
    date_proximity = is_date_proximity(txn1['date'], txn2['date'])
    #print(f"Transaction dates are within 28-32 days apart: {date_proximity}")



    amount_similar = is_amount_similar(txn1['amount'], txn2['amount'])
    #print(f"Transaction amounts are similar: {amount_similar}")

    # Determine if the transaction is recurring
    is_recurring = name_similar or (date_proximity and amount_similar)
    #print(f"Is the most recent transaction recurring? {is_recurring}")

    create_json= {
        "payer_id": most_recent_txn['payer_id'],
        "txn_id": most_recent_txn['txn_id'],
        "is_recurring": is_recurring
    }
    json_object = json.dumps(create_json, indent=4)
    return(json_object)

