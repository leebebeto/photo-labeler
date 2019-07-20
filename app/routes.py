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
import random
import copy

import datetime
import csv

import pandas as pd
import numpy as np
import os
from facenet_pytorch import InceptionResnetV1
from PIL import Image
from torchvision import transforms
from tqdm import tqdm
from sklearn.metrics.pairwise import cosine_similarity

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
result = []


client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client.davian
collection_user = db.user
collection_labeled = db.labeled
id_list = [items['_id'] for items in collection_user.find()]
pwd_list = [items['pwd'] for items in collection_user.find()]

keyword_list = ["ATTRACTIVE", "CONFIDENTIAL","RATIONAL","OUT-GOING", "KIND","ADVENTUROUS","STUBBORN"]
total_image_list = os.listdir(os.path.join(APP_ROOT,'static/image/FFHQ_SAMPLE2')) 

image_name_list = []
feature_list = []

blue_list = []
red_list = []
neutral_list = []

def read_pck(filename):
    objects = []
    with (open(filename, "rb")) as openfile:
        while True:
            try:
                objects.append(pickle.load(openfile))
            except EOFError:
                break
        return objects

features = read_pck("ffhq600_facenet_vggface2.pkl")[0]
for each_key in sorted(features):
    feature_list.append(features[each_key])
feature_np = np.array(feature_list)
print(feature_np.shape)

    
def get_similar_images(image_name,k):
    query_feature = np.expand_dims(np.array(features[image_name]), 0)
    
    ret = cosine_similarity(query_feature, feature_np)
    ret = np.squeeze(ret, 0)
    
    sort_ret = np.argsort(ret)[::-1][1:k+1]
    print([ret[item] for item in sort_ret])
    return sort_ret

def appendImage(toList,query_indexes):
    global feature_np
    global total_image_list

    for i in sorted(query_indexes):
        toList.append(total_image_list[i])
    
    removeTemp(query_indexes)

def removeImage(data):

    global feature_np
    global total_image_list

    temp = []
    for item in data:
        temp.append(total_image_list.index(item['image_id']))

    for i in sorted(temp, reverse = True):
        del total_image_list[i]
        del feature_list[i]
            
    feature_np = np.array(feature_list)

def removeTemp(index):

    global feature_np
    global total_image_list

    for i in sorted(index, reverse = True):
        del total_image_list[i]
        del feature_list[i]
            
    feature_np = np.array(feature_list)


def choosingImage(data, adjective):
    global blue_list
    global red_list
    global neutral_list
    
    if data[0]['adjective'] == adjective:
        posi_temp = []
        nega_temp = []
        neu_temp = []
        for item in data:
            if item['label']==1:
                posi_temp.append(item)
            elif item['label']==-1:
                nega_temp.append(item)
            else:
                neu_temp.append(item)
        posi_name = posi_temp[random.randint(0,len(posi_temp)-1)]['image_id']
        print(posi_name)
        nega_name = nega_temp[random.randint(0,len(nega_temp)-1)]['image_id']
        print(nega_name)
        return [posi_name, nega_name]



# a = get_similar_images("00340.png",5)
# appended_features(blue_list,a)

# b = get_similar_images("00340.png",5)

# for items in collection_user.find():
#     print(items['pwd'])

# USERS = [
#     {"_id": "user101", "pwd": "davian101"},
#     {"_id": "user102", "pwd": "davian102"},
#     {"_id": "user103", "pwd": "davian103"},
#     {"_id": "user104", "pwd": "davian104"},
#     {"_id": "user105", "pwd": "davian105"}
# ]


client.close()

@app.route('/')
@app.route('/logIn', methods = ['GET','POST'])
def logIn():
    return render_template('login.html')

@app.route('/logout')
def logout():
    return render_template('logout.html')

@app.route('/getData', methods = ['GET','POST'])
def getData():
    #data 추가하는 것 try except 문으로 또 걸어주기 (id, pwd)까지
    if request.method == "POST":
        global blue_list
        global red_list
        global neutral_list
        global total_image_list
        global feature_list


        blue_list = []
        red_list = []
        neutral_list = []

        json_received = request.form
        data = json_received.to_dict(flat=False)
        data_list = json.loads(data['jsonData'][0])
        print(data_list[0])
        collection_labeled.insert(data_list)
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

        removeImage(data_list)
        print(len(total_image_list))
        imageStandard = choosingImage(data_list,"ATTRACTIVE")
        # 여기서 모델로 사진 결정
        total_image_temp = copy.deepcopy(total_image_list)
        feature_temp = copy.deepcopy(feature_list)



        appendImage(blue_list,get_similar_images(imageStandard[0],6))
        print(len(total_image_list))
        appendImage(red_list,get_similar_images(imageStandard[1],6))
        print(len(total_image_list))
        appendImage(neutral_list,random.sample(range(len(total_image_list)),2))
        print(len(total_image_list))

        total_image_list = copy.deepcopy(total_image_temp)
        feature_list = copy.deepcopy(feature_temp)
        print(len(total_image_list))

        del total_image_temp
        del feature_temp

        return jsonify({"blue":blue_list, "neutral":neutral_list, "red": red_list})
        

@app.route('/index', methods = ['GET', 'POST'])
def index():
    global blue_list
    global red_list
    global neutral_list

    blue_list = []
    red_list = []
    neutral_list = []
    if request.method == 'POST':
        user_id = request.form['user']
        password = request.form['password']
        result = [item for item in collection_user.find({'_id': str(user_id)})]
        try:
            check = result[0]['pwd']
            if (password == check): 
                dictOfImg = { i : total_image_list[i] for i in range(0, 14) }
                # 여기서 첫 세트 사진 결정
                # 형용사 결정
                user_id = str(user_id)
                images = json.dumps(dictOfImg)


                return render_template('photolabeling.html', keywords = keyword_list[0], images = images, user_id = user_id, test="abc")
            else:
                return render_template('loginFail.html')   
        except:
            return render_template('loginFail.html')
    else:
        return render_template('photolabeling.html')


def concat_images(sort_ret, top_k=4, image_size=160):
    dst = Image.new('RGB', (image_size*top_k, image_size))

    for i in range(1, 5):
        img = Image.open(os.path.join('selectedffhq600', total_image_list[sort_ret[i]]))
        img = img.resize((160, 160))
        dst.paste(img, (img.width*(i-1), 0))
    
    return dst
