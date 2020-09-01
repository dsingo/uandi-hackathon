import os

import boto3
from chalice import Chalice

import messagebird

app = Chalice(app_name='phone-routing-service')

def get_db():
    ddb = boto3.client("dynamodb")
    # Stupid fucking hack
    try:
        ddb.get_item(TableName=os.environ['PHONE_TABLE_NAME'])
        ddb.update_item(TableName=os.environ['PHONE_TABLE_NAME'])
        ddb.put_item(TableName=os.environ['PHONE_TABLE_NAME'])
    except:
        print("move along")
    resource = boto3.resource('dynamodb')
    return resource.Table(os.environ['PHONE_TABLE_NAME'])


TEST_ACCESS_KEY = "usemessagebirdkey"
PROD_ACCESS_KEY = "usemessagebirdkey"

def add_user(user):
    get_db().put_item(
        Item=user
    )

def get_user(number):
    return get_db().get_item(Key={'phonenumber':number})['Item']

def unmatch_numbers(masked_receiver, sender):
    # Query database for sender conversations
    current_conversations = get_user(sender)["conversations"]

    # Get masked sender and real recipient
    masked_sender = current_conversations[masked_receiver]["masked_sender"]
    receiver = current_conversations[masked_receiver]["real_receiver"]

    # Update Conversations on Sender
    del current_conversations[masked_receiver]
    #TODO: Add Put of Current Conversations
    get_db().update_item(
        Key={"phonenumber":sender},
        UpdateExpression='SET conversations = :new',
        ExpressionAttributeValues={
            ':new': {current_conversations}
        }
    )
    # Query and Update Conversations on Receiver
    current_conversations = get_user(sender)[receiver]["conversations"]

    del current_conversations[masked_sender]
    # Add Put of Current Conversations on Database
    get_db().update_item(
        Key={"phonenumber":sender},
        UpdateExpression='SET conversations = :new',
        ExpressionAttributeValues={
            ':new': {current_conversations}
        }
    )
    client = messagebird.Client(PROD_ACCESS_KEY)
    client.message_create(
        masked_receiver,
        sender,
        "uandi - Your conversation has ended.",
        {}
    )

    client.message_create(
        masked_sender,
        receiver,
        "uandi - Your conversation has ended.",
        {}
    ) 

AVAILABLE_NUMBERS = [
    "+61480078881",
    "+61480078995"
]

@app.route('/register', methods=['POST'], content_types=['application/json'])
def register():
    # Get profile and phone number of new user
    body = app.current_request.json_body
    new_user = {
        "phonenumber": body["number"],
        "name": body["name"],
        "conversations": {}
    }

    # Put user in DB
    add_user(new_user)


@app.route('/match', methods=['POST'], content_types=['application/json'])
def match():
    # Get list of phone numbers of match
    body = app.current_request.json_body
    numbers = body['match_numbers']
    assert len(numbers) == 2, 'Not enough participants to match'
    number1, number2 = numbers[0], numbers[1]

    # Search database for numbers in use by first participant
    # TODO: Implement real database
    
    user1 = get_user(number1)
    conversations1 = user1["conversations"]
    available1 = [number for number in AVAILABLE_NUMBERS if number not in conversations1.keys()]
    assert len(available1) > 0, 'Participant 1 does not have enough available numbers'
    masked1 = available1[0]

    # Search database for numbers in use by second participant
    # TODO: Implement real database
    user2 = get_user(number2)
    conversations2 = user2["conversations"]
    available2 = [number for number in AVAILABLE_NUMBERS if number not in conversations2.keys()]
    assert len(available2) > 0, 'Participant 2 does not have enough available numbers'
    masked2 = available2[0]

    # Add conversations for each participant
    new_conversation_1 = {
        masked1 : {
            "masked_sender": masked2,
            "real_receiver": number2
        }
    }
    new_conversation_2 = {
        masked2 : {
            "masked_sender": masked1,
            "real_receiver": number1
        }
    }
    # TODO: Save these to database
    get_db().update_item(
        Key={"phonenumber":number1},
        UpdateExpression='SET conversations = :new',
        ExpressionAttributeValues={
            ':new': {**conversations1, **new_conversation_1}
        }
    )
    get_db().update_item(
        Key={"phonenumber":number2},
        UpdateExpression='SET conversations = :new',
        ExpressionAttributeValues={
            ':new': {**conversations2, **new_conversation_2}
        }
    )

    client = messagebird.Client(PROD_ACCESS_KEY)
    client.message_create(
        masked1,
        number1,
        f"uandi - Say hello to {user2['name'][:30]}! YYou have 30 messages to workout whether they are a stranger or something more ❤️. Text ENDCONVO to end the conversation.",
        {}
    )

    client.message_create(
        masked2,
        number2,
        f"uandi - Say hello to {user1['name'][:30]}! You have 30 messages to workout whether they are a stranger or something more ❤️. Text ENDCONVO to end the conversation.",
        {}
    )    


    return [new_conversation_1, new_conversation_2]

@app.route('/unmatch', methods=['POST'], content_types=['application/json'])
def unmatch():
    # Get message from request
    message = app.current_request.json_body
    
    # Get real sender and masked recipient
    sender = message['originator']
    masked_receiver = message['recipient']
    unmatch_numbers(masked_receiver, sender)   


@app.route('/sms', methods=['POST'], content_types=['application/json'])
def inbound_sms():
    # Get message from request
    message = app.current_request.json_body

    # Get real sender and masked recipient
    sender = message['originator']
    masked_receiver = message['recipient']

    if sender[0] != '+':
        sender = '+'+sender

    if masked_receiver[0] != '+':
        masked_receiver = '+'+masked_receiver

    # Message Content
    content = message['body']
    if 'ENDCONVO' in content:
        unmatch_numbers(masked_receiver, sender)
        return

    # Query database for sender conversations
    # TODO: Create actual DB connection
    current_conversations = get_user(sender)["conversations"]

    # Get masked sender and real recipient
    masked_sender = current_conversations[masked_receiver]["masked_sender"]
    receiver = current_conversations[masked_receiver]["real_receiver"]

    print(receiver)

    client = messagebird.Client(PROD_ACCESS_KEY)
    result = client.message_create(
        masked_sender,
        receiver,
        content,
        {}
    )

    return {'status': 'success'}
