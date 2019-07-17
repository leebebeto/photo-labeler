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

# app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
# mongo = PyMongo(app)
# app.secret_key = os.urandom(24)
# login_manager = LoginManager()
# login_manager.init_app(app)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
result = []


# class User:
#     def __init__(self, user_id,passwd_hash=None, authenticated=False):
#         self.user_id = user_id
#         self.passwd_hash = passwd_hash
#         self.authenticated = authenticated

#     def __repr__(self):
#         r = {
#             'user_id': self.user_id,
#             'passwd_hash': self.passwd_hash,
#             'authenticated': self.authenticated,
#         }
#         return str(r)

#     def can_login(self, passwd_hash):
#         return self.passwd_hash == passwd_hash

#     def is_active(self):
#         return True

#     def get_id(self):
#         return self.user_id

#     def is_authenticated(self):
#         return self.authenticated

#     def is_anonymous(self):
#         return False

# USERS = {
#     "user99": User("user99", passwd_hash='davian99'),
#     "user98": User("user98", passwd_hash='davian98'),
#     "user97": User("user97", passwd_hash='davian97'),
# }

# @app.route('/api/login', methods=['POST'])
# def login():

@app.route('/logIn', methods = ['GET','POST'])
def logIn():
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
        client = pymongo.MongoClient('mongodb://localhost:27017/')
        db = client.newDatabase
        collection = db.blog_test
        collection.insert(data_list)
        client.close()
        outfile = open('labelData.csv', 'a', newline='')
        csvwriter = csv.writer(outfile)
        result.append(data)
        with open('pickle_file.pickle', 'wb') as f:
            pickle.dump(result,f)
        print(result)
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

