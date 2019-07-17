from flask import render_template, request, url_for, jsonify, redirect, flash
import flask_login
from flask_login import LoginManager
from flask_pymongo import PyMongo
from app import app
import pymongo
import os
import json
import pickle
import time
import datetime
import csv

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
result = []

# USERS = [
#     {"_id": "user101", "pwd": "davian101"},
#     {"_id": "user102", "pwd": "davian102"},
#     {"_id": "user103", "pwd": "davian103"},
#     {"_id": "user104", "pwd": "davian104"},
#     {"_id": "user105", "pwd": "davian105"}
# ]

client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client.davian
collection_user = db.user
id_list = [items['id'] for items in collection_user.find()]
pwd_list = [items['pwd'] for items in collection_user.find()]
# for items in collection_user.find():
#     print(items['pwd'])
print(pwd_list)
client.close()


@app.route('/logIn', methods = ['GET','POST'])
def logIn():
    id = request.form.get('id')
    password = request.form.get('password')
    if (password in db.davian.user.pwd)


    return render_template('login.html')

@app.route('/logout')
def logout():
    return render_template('logout.html')

@app.route('/getData', methods = ['GET','POST'])
def getData():
    if request.method == "POST":
        json_received = request.form
        data = json_received.to_dict(flat=False)
        data_list = json.loads(data['jsonData'][0])
        outfile = open('labelData.csv', 'a', newline='')
        csvwriter = csv.writer(outfile)
        result.append(data)
        with open('pickle_file.pickle', 'wb') as f:
            pickle.dump(result,f)
        for item in data_list:
            if type(item) == str:
                csvwriter.writerow(item)    
            else:
                csvwriter.writerow(item.values())
        return jsonify(request.json)

@app.route('/')
@app.route('/index', methods = ['GET', 'POST'])
def index():
    keyword_list = ["ATTRACTIVE", "CONFIDENTIAL","RATIONAL","OUT-GOING", "KIND","ADVENTUROUS","STUBBORN"]
    image_list = os.listdir(os.path.join(APP_ROOT,'static/image/FFHQ_SAMPLE'))	

    dictOfKey = { i : keyword_list[i] for i in range(0, len(keyword_list) ) }
    dictOfImg = { i : image_list[i] for i in range(0, len(image_list) ) }

    keywords = json.dumps(dictOfKey)
    images = json.dumps(dictOfImg)
    return render_template('photolabeling.html', keywords = keywords,images = images)

