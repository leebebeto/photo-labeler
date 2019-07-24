from flask import render_template, request, url_for, jsonify, redirect, flash, session
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
# from facenet_pytorch import InceptionResnetV1
# from PIL import Image
# from torchvision import transforms
# from tqdm import tqdm
from sklearn.metrics.pairwise import cosine_similarity

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
result = []



# client = pymongo.MongoClient('mongodb://localhost:27017/')
client = pymongo.MongoClient("mongodb+srv://admin:davian@daviandb-9rvqg.gcp.mongodb.net/test?retryWrites=true&w=majority")
db = client.davian
collection_user = db.user
collection_labeled = db.labeled
id_list = [items['_id'] for items in collection_user.find()]
pwd_list = [items['pwd'] for items in collection_user.find()]


collist = db.list_collection_names()
if "images" in collist:
    print("check")
    db.images.drop()


collection_image = db.images
collection_current = db.Current_toLabel
collection_before = db.Before_toLabel


keyword_list = ["ATTRACTIVE", "CONFIDENTIAL","RATIONAL","OUT-GOING", "KIND","ADVENTUROUS","STUBBORN"]

total_image_list = os.listdir(os.path.join(APP_ROOT,'static/image/FFHQ_SAMPLE2'))

collection_image.insert([{"image_id" : total_image_list[i], "image_index" : i} for i in range(len(total_image_list))])



# resnet = InceptionResnetV1(pretrained='vggface2').eval()
# print(resnet)

# train = {}
# for each_img_name in tqdm(total_image_list):
#     img = Image.open(os.path.join(os.path.join(APP_ROOT,'static/image/FFHQ_SAMPLE2'), each_img_name))
#     img = transforms.ToTensor()(img)
#     img_embedding = resnet(img.unsqueeze(0))
#     # print("img_embedding : {}".format(img_embedding.shape))
#     train[each_img_name] = img_embedding.squeeze(0).data.numpy()

image_name_list = []
feature_list = []

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

    
def get_similar_images(image_name,feature_np,k):
    query_feature = np.expand_dims(np.array(features[image_name]), 0)

    ret = cosine_similarity(query_feature, feature_np)
    ret = np.squeeze(ret, 0)
    
    sort_ret = np.argsort(ret)[::-1][1:k+1]
    print([ret[item] for item in sort_ret])
    return sort_ret

def appendImage(toList,possible_temp,Feature, query_indexes):
    for i in sorted(query_indexes):
        toList.append(possible_temp[i])    
    removeTemp(query_indexes,possible_temp,Feature)

def removeTemp(index,possible_temp,Feature):
    for i in sorted(index, reverse = True):
        del possible_temp[i]
        del Feature[i]
            


def removeFeature(Feature, labeledList):
    global total_image_list

    print(len(total_image_list))
    temp = []
    for item in labeledList:
        temp.append(total_image_list.index(item))


    for i in sorted(temp, reverse = True):
        del Feature[i]

    return np.array(Feature)


# def removeImage(data, toDelImage, toDelFeature, total_image_list):

#     global feature_np
#     global total_image_list

#     temp = []
#     for item in data:
#         temp.append(total_image_list.index(item['image_id']))

#     for i in sorted(temp, reverse = True):
#         del toDelList[i]
#         del feature_list[i]
            
#     feature_np = np.array(feature_list)


def choosingImage(data, adjective):
    
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
    if request.method == 'GET':
        print("get")
        session.pop("logged_in",None)
        session.pop("user_id",None)
        print(session.get('logged_in'), session.get("user_id"))
        return render_template('logIn.html')
    else:
        user_id = request.form['user']
        password = request.form['password']
        print(user_id, password)
        try:
            result = [item for item in collection_user.find({'_id': str(user_id), "pwd":str(password)})]
            print(result)
            if result:    
                session['logged_in'] = True 
                session['user_id'] = user_id
        
                print(session.get('logged_in'))
                return redirect(url_for('index'))
            else:
                print("fail")
                return render_template('loginFail.html')
        except:
            print("except")
            return render_template('loginFail.html')

@app.route('/logout')
def logout():
    return render_template('logout.html')

@app.route('/getData', methods = ['GET','POST'])
def getData():
    user_id = session.get("user_id")
    #data 추가하는 것 try except 문으로 또 걸어주기 (id, pwd)까지
    if request.method == "POST":

        blue_list = []
        red_list = []
        neutral_list = []

        json_received = request.form
        data = json_received.to_dict(flat=False)
        data_list = json.loads(data['jsonData'][0])
        # print(data_list[0])
        for item in data_list:
            item['user_id'] = user_id

        collection_labeled.insert(data_list)
        
        imageStandard = choosingImage(data_list,"ATTRACTIVE")

        db_image_list = [item['image_id'] for item in collection_image.find()]
        prelabeled_image_list = [item['image_id'] for item in collection_labeled.find({"user_id" : user_id})]
        
        possible_images = sorted(list(set(db_image_list) - set(prelabeled_image_list)))
        print("possible_images", len(possible_images))
        possible_temp = copy.deepcopy(possible_images)
        feature_temp = copy.deepcopy(feature_list)
        
        feature_removed = removeFeature(feature_temp, prelabeled_image_list)
        # print(imageStandard[0])
        # print(get_similar_images(imageStandard[0],feature_removed,6))
        # print([possible_temp[item] for item in get_similar_images(imageStandard[0],feature_removed,6)])

        # 여기서 모델로 사진 결정

        appendImage(blue_list, possible_temp, feature_temp, get_similar_images(imageStandard[0],feature_removed,6))
        feature_removed = np.array(feature_temp)
        # print(len(possible_temp))
        # print(feature_removed.shape)
        appendImage(red_list, possible_temp, feature_temp, get_similar_images(imageStandard[1],feature_removed,6))
        feature_removed = np.array(feature_temp)
        # print(len(possible_temp))
        # print(feature_removed.shape)
        appendImage(neutral_list, possible_temp, feature_temp, random.sample(range(len(possible_temp)),2))
        # print(len(possible_temp))
        # print(feature_removed.shape)
        current_todo = blue_list + neutral_list + red_list
        for i in range(len(current_todo)):
            collection_current.update({"user_id":user_id , "index":i}, {"user_id":user_id , "index":i,"image_id" : current_todo[i]})
        
        return jsonify({"blue":blue_list, "neutral":neutral_list, "red": red_list})
        

@app.route('/index', methods = ['GET', 'POST'])
def index():
    global blue_list
    global red_list
    global neutral_list

    blue_list = []
    red_list = []
    neutral_list = []
    
    print(session.get('logged_in'))
    if session.get("logged_in")==True:
        print(session.get("user_id"), session.get("logged_in"))
        
        user_id = session.get("user_id")
        db_image_list = [item['image_id'] for item in collection_image.find()]
        
        todo_images = [item for item in collection_current.find({"user_id" : user_id})]
        if todo_images:
            print("old")
            dictOfImg = { i : todo_images[i]['image_id'] for i in range(0,14)}
        else:
            print("new")
            dictOfImg = { i : db_image_list[i] for i in range(0,14)}
            collection_current.insert([{'user_id' : user_id,'index' : i, 'image_id' : db_image_list[i]} for i in range(0,14)])
        
        # 여기서 첫 세트 사진 결정
        # 형용사 결정
        # user_id = str(user_id)

        images = json.dumps(dictOfImg)
        total_num = str(feature_np.shape[0])

        return render_template('photolabeling.html', keywords = keyword_list[0], images = images, user_id = user_id, test="abc", total_num = total_num)
    
    else:
        return redirect(url_for('logIn'))


