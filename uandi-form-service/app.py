from chalice import Chalice, CORSConfig
import boto3
import os
from urllib.parse import parse_qs
from uuid import uuid4
import jinja2
import requests as req
from time import time


PHONE_ROUTER_API_URL = "https://69iu7rmjp7.execute-api.ap-southeast-2.amazonaws.com/api/"

def invalidate_cache(object):
    client = boto3.client('cloudfront')
    response = client.create_invalidation(
    DistributionId=os.environ['PROFILE_DISTRIBUTION_NAME'],
    InvalidationBatch={
        'Paths': {
            'Quantity': 2,
            'Items': [
            f'/{object}',
            f'/{object}.html'
            ],
        },
        'CallerReference': str(time()).replace(".", "")
    }
    )

app = Chalice(app_name='form-service')
app.api.cors = CORSConfig(allow_origin="https://uandi.cc")

def write_to_cdn(pid, file):
    client = boto3.client('s3')
    client.put_object(Body=file, Bucket=os.environ['PROFILE_BUCKET_NAME'], Key=f"{pid}.html", ContentType='text/html')
    client.put_object(Body=file, Bucket=os.environ['PROFILE_BUCKET_NAME'], Key=f"{pid}", ContentType='text/html')
    invalidate_cache(pid)

def generate_profile(pid, nickname, bio, questions):
    path, filename = os.path.split("chalicelib/templates/questionnaire.html")
    template = jinja2.Environment(loader=jinja2.FileSystemLoader(path or "./"), autoescape=True).get_template(filename)
    write_to_cdn(pid, template.render(nickname=nickname, bio=bio, questions=questions, pid=pid).encode())

def get_db():
    ddb = boto3.client("dynamodb")
    # Stupid fucking hack
    try:
        ddb.get_item(TableName=os.environ['FORM_TABLE_NAME'])
        ddb.update_item(TableName=os.environ['FORM_TABLE_NAME'])
        ddb.put_item(TableName=os.environ['FORM_TABLE_NAME'])
    except:
        print("move along")
    resource = boto3.resource('dynamodb')
    return resource.Table(os.environ['FORM_TABLE_NAME'])

@app.route('/register', methods=['POST'], content_types=['application/json'])
def register_new_profile():
	response = app.current_request.json_body
	phone_number = response["phonenumber"]
	profile_id = response["profile_id"]
	nickname = response["nickname"]

	user = {
		"Profile ID": profile_id,
		"nickname": nickname,
		"phone_number": phone_number,
		"submissions": []
	}

	get_db().put_item(Item=user)
	req.post(f"{PHONE_ROUTER_API_URL}/register", json={
		"name":nickname,
		"number":phone_number
	})

	return {'status':'success'}


@app.route('/submit_form/{profile_id}', methods=['POST'], content_types=['application/x-www-form-urlencoded'])
def input_response(profile_id):
	response = parse_qs(app.current_request.raw_body.decode())
	nickname = response["nickname"][0]
	phonenumber = response["phonenumber"][0]

	questions = [question[0] for qid, question in response.items() if 'question' in qid]
	answers = [answer[0] for aid, answer in response.items() if 'answer' in aid]

	responses = [ {question: answer} for question, answer in zip(questions, answers)]

	existing_submissions = get_db().get_item(Key={"Profile ID":profile_id})['Item']['submissions']

	new_submission = {
		"submissionId": str(uuid4()),
		"nickname":nickname,
		"phonenumber":phonenumber,
		"responses": responses
	}

	get_db().update_item(
		Key={"Profile ID":profile_id},
		UpdateExpression='SET submissions = :c',
        ExpressionAttributeValues={
            ':c': existing_submissions + [new_submission]
        })
	
	return {"status":"success"}

@app.route('/match', methods=['POST'], content_types=['application/json'], cors=CORSConfig(allow_origin='*'))
def get_responses():
    body = app.current_request.json_body
    profile_id = body["user"]
    submission_id = body['submissionId']

    user = get_db().get_item(Key={"Profile ID":profile_id})['Item']
    submissions = user['submissions']
    submission = [submission for submission in submissions if submission['submissionId']== submission_id][0]

    req.post(f"{PHONE_ROUTER_API_URL}/match", json={
		"match_numbers":[
            user['phone_number'],
            submission['phonenumber']
        ]
	})


@app.route('/responses/{profile_id}', methods=['GET'], cors=CORSConfig(allow_origin='*'))
def get_responses(profile_id):
	responses = get_db().get_item(Key={"Profile ID":profile_id})['Item']['submissions']
	responses = [{ key: value for key, value in response.items() if key != 'phonenumber' } for response in responses]
	return responses



# Create profile route
@app.route('/create_profile', methods=['POST'], content_types=['application/json'], cors=CORSConfig(allow_origin='*'))
def create_profile():
    body = app.current_request.json_body

    profile_id = body['profile_id'] # String
    nickname = body['nickname'] # String
    bio = body['bio'] # string
    questions = body['questions'] # List of strings

    generate_profile(profile_id, nickname, bio, questions)

    return profile_id
