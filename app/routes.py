from flask import render_template, request, url_for, jsonify, Flask
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

@app.route('/add', methods = ['GET','POST'])
def add():
    client = pymongo.MongoClient('mongodb://localhost:27017/')
    db = client.newDatabase
    collection = db.blog_test
    results = collection.find()
    new_documents = [
      {
        "_id" : "130",
        "name" : "asd",
        "content" : "12345"
      }, {
        "_id" : "131",
        "name" : "asd",
        "content" : "12346"
      },{
        "_id" : "1232",
        "name" : "asd",
        "content" : "12347"
      }
    ]
    # collection.insert(new_documents)
    print(results)
    client.close()
    return render_template('add.html', data=results)


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
        print(result)
        for item in data_list:
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

