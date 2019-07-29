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
from operator import itemgetter


from datetime import datetime
import csv

from sklearn.cluster import AgglomerativeClustering
from sklearn.manifold import TSNE
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
batch_number = 14


client = pymongo.MongoClient('mongodb://localhost:27017/')
# client = pymongo.MongoClient("mongodb+srv://admin:davian@daviandb-9rvqg.gcp.mongodb.net/test?retryWrites=true&w=majority")
db = client.davian



collection_labeled = db.labeled

collist = db.list_collection_names()
if "images" in collist:
    print("check")
    db.images.drop()
if "user" in collist:
    db.user.drop()

collection_user = db.user
collection_user.insert([{'_id':'asdf','pwd':'asdf','isDone':False}, {'_id':'user101','pwd':'davian101','isDone':False}])
id_list = [items['_id'] for items in collection_user.find()]
pwd_list = [items['pwd'] for items in collection_user.find()]



collection_image = db.images
collection_log = db.log
collection_current = db.Current_toLabel
collection_before = db.Before_toLabel


adjective = ["ATTRACTIVE", "CONFIDENTIAL","GOODNESS","OUT-GOING", "KIND","ADVENTUROUS","STUBBORN"]

total_image_list = sorted(os.listdir(os.path.join(APP_ROOT,'static/image/FFHQ_SAMPLE2')))
total_num = len(total_image_list)



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
key_list = []

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
    key_list.append(each_key)
feature_np = np.array(feature_list)

cluster = AgglomerativeClustering(n_clusters=200, affinity='euclidean', linkage='ward').fit_predict(feature_list)


cluster = np.array(cluster)
points = TSNE(n_components = 2, random_state=2019).fit_transform(feature_list)


def centeroidnp(arr):
    length = arr.shape[0]
    sum_x = np.sum(arr[:, 0])
    sum_y = np.sum(arr[:, 1])
    return sum_x/length, sum_y/length
    
centeroid = []
cluster_data = []

for i in range(0,200):
    arr = np.array([points[item] for item in np.where(cluster==i)])
    idx = np.array([item for item in np.where(cluster==i)])
    center = centeroidnp(arr[0])
    dist = [np.linalg.norm(arr[0][j] - center) for j in range(len(arr[0]))]   
    # print(np.argmax(dist))
    # print(index[0])
    # print(arr[0].shape)
    cluster_data.append({"image_id":key_list[idx[0][np.argmax(dist)]], 
                         "image_list": [str(item) for item in list(idx[0])],
                         "image_id_list": [total_image_list[item] for item in list(idx[0])],
                         "x":str(center[0]), 
                         "y":str(center[1]), 
                         "count":str(len(list(idx[0])))
                         })



d3Dots = [{"x":str(points[i][0]), "y":str(points[i][1]), "image_id":key_list[i]} for i in range(len(points))]

def get_similar_images(image_name,feature_np,start,number):
    query_feature = np.expand_dims(np.array(features[image_name]), 0)

    ret = cosine_similarity(query_feature, feature_np)
    ret = np.squeeze(ret, 0)
    
    print("ret shape",ret.shape, ret.shape[0])

    sort_ret = np.argsort(ret)[::-1][start:number+start]
    print("sort_ret", sort_ret)
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

    temp = []
    for item in labeledList:
        temp.append(total_image_list.index(item))


    for i in sorted(temp, reverse = True):
        del Feature[i]

    return np.array(Feature)

def extractCluster(data, option):    
    labeled_cluster = []
    for item in data:
        for i in range(len(cluster_data)):
            if str(item) in cluster_data[i]['image_list']:
                if option == 'index':
                    labeled_cluster.append(i)
                elif option == 'image_id':
                    labeled_cluster.append(cluster_data[i]['image_id'])
    return labeled_cluster


def choosingImage(data,adjective):
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
    if posi_temp:
        posi_name = posi_temp[random.randint(0,len(posi_temp)-1)]['image_id']
    else:
        posi_list = list(collection_labeled.find({"user_id":session.get("user_id"), "adjective":adjective, "label":1}))
        if not posi_list:
            posi_list= list(collection_image.find())
        posi_name = posi_list[random.randint(0,len(posi_list)-1)]['image_id']
    if nega_temp:
        nega_name = nega_temp[random.randint(0,len(nega_temp)-1)]['image_id']
    else:
        nega_list = list(collection_labeled.find({"user_id":session.get("user_id"), "adjective":adjective, "label":-1}))
        if not nega_list:
            nega_list = list(collection_image.find())
        nega_name = nega_list[random.randint(0,len(nega_list)-1)]['image_id']
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
        session.pop("logged_in",None)
        session.pop("user_id",None)
        print(session.get('logged_in'), session.get("user_id"))
        return render_template('logIn.html')
    else:
        user_id = request.form['user']
        password = request.form['password']
        print(user_id, password)
        try:
            result = [item for item in collection_user.find({'_id': str(user_id), "pwd":str(password), "isDone":False})]
            print(result)
            if result:    
                
                collection_user.update({'_id':user_id}, {'$set':{'isLogOn' : True}})
                session['logged_in'] = True 
                session['user_id'] = user_id
                
                time = datetime.today().strftime("%Y-%m-%d %H:%M:%S")
                collection_log.insert({"Time":time,"user_id": user_id, "What":"Login"})

                print(session.get('logged_in'))
                return redirect(url_for('index'))
            else:
                print("fail")
                return render_template('loginFail.html')
        except:
            print("except")
            return render_template('loginFail.html')

@app.route('/logout', methods = ['GET','POST'])
def logout():
    if request.method == 'GET':
        user_id = session.get("user_id")
        time = datetime.today().strftime("%Y-%m-%d %H:%M:%S")
        collection_log.insert({"Time":time,"user_id": user_id, "What":"Logout"})
        return redirect(url_for('logIn'))

@app.route('/getLog', methods = ['GET','POST'])
def getLog():
    if request.method == "POST":
        json_received = request.form
        data = json_received.to_dict(flat=False)
        data_list = json.loads(data['jsonData'][0])
        data_list['user_id'] = session.get('user_id')
        collection_log.insert(data_list)
        return jsonify("good")
        
@app.route('/getCurrent', methods = ['GET','POST'])
def getCurrent():
    blue_list = []
    red_list = []
    neutral_list = []

    user_id = session.get("user_id")
    if request.method == "POST":
        
        
        time = datetime.today().strftime("%Y-%m-%d %H:%M:%S")

        json_received = request.form
        data = json_received.to_dict(flat=False)
        selectedImage = data['image_id'][0]
        
        collection_log.insert({"Time":time,"user_id": user_id, "What":"explore", "To":selectedImage})

        keyword_index = collection_current.find({"user_id": user_id})[0]['adjective']

        db_image_list = [item['image_id'] for item in collection_image.find()]
        prelabeled_image_list = [item['image_id'] for item in collection_labeled.find({"user_id" : user_id, "adjective" : adjective[keyword_index]})]        
        possible_images = sorted(list(set(db_image_list) - set(prelabeled_image_list)))

        possible_temp = copy.deepcopy(possible_images)
        feature_temp = copy.deepcopy(feature_list)

        feature_removed = removeFeature(feature_temp, prelabeled_image_list)

        
        appendImage(blue_list, possible_temp, feature_temp, get_similar_images(selectedImage,feature_removed,0,6))
        feature_removed = np.array(feature_temp)

        appendImage(red_list, possible_temp, feature_temp, get_similar_images(selectedImage,feature_removed,0,6))
        feature_removed = np.array(feature_temp)

        appendImage(neutral_list, possible_temp, feature_temp, get_similar_images(selectedImage,feature_removed,0,2))

        current_todo = blue_list + neutral_list + red_list

        labeled = [total_image_list.index(item) for item in current_todo]        
        cluster = extractCluster(labeled,"image_id")
        print(cluster)
        # cluster_index = extractCluster(labeled,"index")
        
        # for i in range(len(cluster_index)):
        #     temp = cluster_data[cluster_index[i]]['image_id_list']
            
        #     for item2 in temp:
        #         labeled_list = list(collection_labeled.find({"user_id":user_id, "adjective": adjective[keyword_index], "image_id" : item2},
        #                                 {'_id':0,'user_id':0,'adjective':0,'time':0, 'label':0}))
        #         if labeled_list:
        #             outCluster[i]['labeled'] = True
        

        for i in range(batch_number):
            if len(current_todo) > i:
                collection_current.update({"user_id":user_id , "index":i}, {"user_id":user_id , "index":i, "adjective": keyword_index, "image_id" : current_todo[i]})
            else:
                collection_current.update({"user_id":user_id , "index":i}, {"user_id":user_id , "index":i, "adjective": keyword_index, "image_id" : None})

    return jsonify({"blue":blue_list, "neutral":neutral_list, "red": red_list,
                     "keyword": adjective[keyword_index],
                    "image_count" : (int((total_num - len(possible_images))/batch_number)+1), 
                    "index": keyword_index,
                    "isNewset" : False,
                    "score" : [],
                    "current_cluster" : cluster})

@app.route('/getData', methods = ['GET','POST'])
def getData():
    user_id = session.get("user_id")
    #data 추가하는 것 try except 문으로 또 걸어주기 (id, pwd)까지
    if request.method == "POST":
        blue_list = []
        red_list = []
        neutral_list = []
        isNewset = None
        time = datetime.today().strftime("%Y-%m-%d %H:%M:%S")

        json_received = request.form
        data = json_received.to_dict(flat=False)
        data_list = json.loads(data['jsonData'][0])
        # print(data_list[0])
        for item in data_list:
            item['user_id'] = user_id

        collection_log.insert({"Time":time,"user_id": user_id, "What":"confirm"})
        collection_labeled.insert(data_list)

        keyword_index = collection_current.find({"user_id": user_id})[0]['adjective']
        print('main keyword' , keyword_index)
        imageStandard = choosingImage(data_list, adjective[keyword_index])

        db_image_list = [item['image_id'] for item in collection_image.find()]
        prelabeled_image_list = [item['image_id'] for item in collection_labeled.find({"user_id" : user_id, "adjective" : adjective[keyword_index]})]        
        possible_images = sorted(list(set(db_image_list) - set(prelabeled_image_list)))

        if not possible_images:
            isNewset = True
            keyword_index = keyword_index + 1
            db_image_list = [item['image_id'] for item in collection_image.find()]
            prelabeled_image_list = [item['image_id'] for item in collection_labeled.find({"user_id" : user_id, "adjective" : adjective[keyword_index]})]        
            possible_images = sorted(list(set(db_image_list) - set(prelabeled_image_list)))
            
            possible_temp = copy.deepcopy(possible_images)
            print(len(possible_temp))
            feature_temp = copy.deepcopy(feature_list)
                        
            appendImage(blue_list, possible_temp, feature_temp, [0,1,2,3,4,5])
            feature_removed = np.array(feature_temp)
            appendImage(neutral_list, possible_temp, feature_temp, [0,1])
            feature_removed = np.array(feature_temp)
            appendImage(red_list, possible_temp, feature_temp, [0,1,2,3,4,5])
        else:
            isNewset = False
            print("possible_images", len(possible_images))
            possible_temp = copy.deepcopy(possible_images)
            feature_temp = copy.deepcopy(feature_list)
            print("feature_temp", len(feature_temp))

            feature_removed = removeFeature(feature_temp, prelabeled_image_list)
            print("feature_removed", len(feature_removed))

            # print(imageStandard[0])
            # print(get_similar_images(imageStandard[0],feature_removed,6))
            # print([possible_temp[item] for item in get_similar_images(imageStandard[0],feature_removed,6)])

            # 여기서 모델로 사진 결정

            appendImage(blue_list, possible_temp, feature_temp, get_similar_images(imageStandard[0],feature_removed,1,6))
            feature_removed = np.array(feature_temp)
            # print(len(possible_temp))
            # print(feature_removed.shape)
            appendImage(red_list, possible_temp, feature_temp, get_similar_images(imageStandard[1],feature_removed,1,6))
            feature_removed = np.array(feature_temp)
            # print(feature_removed.shape)
            
            if len(possible_temp) >= 2:
                appendImage(neutral_list, possible_temp, feature_temp, random.sample(range(len(possible_temp)),2))
            else:
                appendImage(neutral_list, possible_temp, feature_temp, random.sample(range(len(possible_temp)),len(possible_temp)))

            # print(len(possible_temp))
            # print(feature_removed.shape)
        current_todo = blue_list + neutral_list + red_list
        for i in range(batch_number):
            if len(current_todo) > i:
                collection_current.update({"user_id":user_id , "index":i}, {"user_id":user_id , "index":i, "adjective": keyword_index, "image_id" : current_todo[i]})
            else:
                collection_current.update({"user_id":user_id , "index":i}, {"user_id":user_id , "index":i, "adjective": keyword_index, "image_id" : None})
        if keyword_index >= 3:
            collection_user.update({'_id':user_id}, {'$set':{'isDone' : True}})

        labeled = [total_image_list.index(item['image_id']) for item in data_list]
        current_cluster_index = [total_image_list.index(item) for item in current_todo]
        current_cluster = extractCluster(current_cluster_index, "image_id")
        print(current_cluster)
        labeled_cluster = extractCluster(labeled,'image_id')
        label = np.array([d['label'] for d in data_list])

        outScore = []
        temp = []
        for i in range(len(labeled_cluster)):
            if labeled_cluster[i] not in temp:
                temp.append(labeled_cluster[i])
                outScore.append({"image_id" : labeled_cluster[i], "score" : label[i], "labeled" : True})
            else:
                outScore[[d['image_id'] for d in outScore].index(labeled_cluster[i])]["score"] += label[i]
        
        for i in range(len(outScore)):
            count = int(cluster_data[[item['image_id'] for item in cluster_data].index(outScore[i]["image_id"])]['count'])
            outScore[i]['score'] = outScore[i]['score'] / count

        print(outScore)
        return jsonify({"blue":blue_list, "neutral":neutral_list, "red": red_list,
                     "keyword": adjective[keyword_index],
                    "image_count" : (int((total_num - len(possible_images))/batch_number)+1), 
                    "index": keyword_index,
                    "isNewset" : isNewset,
                    "score" : outScore,
                    "current_cluster" : current_cluster
                    })
        

@app.route('/index', methods = ['GET', 'POST'])
def index():
    # global blue_list
    # global red_list
    # global neutral_list

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
            keyword_index = todo_images[-1]["adjective"]
            print("keyword",keyword_index)
        else:
            print("new")
            dictOfImg = { i : db_image_list[i] for i in range(0,14)}
            keyword_index = 0
            collection_current.insert([{'user_id' : user_id, "adjective" : 0, 'index' : i, 'image_id' : db_image_list[i]} for i in range(0,14)])

        outCluster = copy.deepcopy(cluster_data)

        
        current_cluster_index = [total_image_list.index(dictOfImg[item]) for item in dictOfImg.keys()]
        current_cluster = extractCluster(current_cluster_index,"image_id")

        labeled_data = list(collection_labeled.find({'user_id':user_id,'adjective':adjective[keyword_index]},{'_id':0,'user_id':0,'adjective':0,'time':0}))
        labeled = [total_image_list.index(item['image_id']) for item in labeled_data]
        labeled_cluster = extractCluster(labeled,'index')
        print(labeled_cluster)

        for i in range(0,200):
            sum_score = 0
            for j in range(len(labeled_cluster)):
                if labeled_cluster[j] == i:
                    sum_score += labeled_data[j]['label']
                    outCluster[i]['labeled'] = True
            outCluster[i]['score'] = str(sum_score/len(outCluster[i]['image_list']))
        print(outCluster[0])

        

        count = int(len(labeled_data)/batch_number)+1
        attr_list = []
        with open('attr_list.pickle', 'rb') as f:
            attr_list = pickle.load(f)
        # 여기서 첫 세트 사진 결정
        # 형용사 결정
        # user_id = str(user_id)
        attr_list = json.dumps(attr_list)
        images = json.dumps(dictOfImg)
        label = json.dumps(labeled_data)
        d3Dots_json = json.dumps(d3Dots)
        current_cluster_json = json.dumps(current_cluster)
        cluster_json = json.dumps(outCluster)  
        print(adjective[keyword_index])
        return render_template('photolabeling.html', keyword = adjective[keyword_index],
                                                     images = images, user_id = user_id, 
                                                     total_num = int(total_num/batch_number)+1, 
                                                     count_num = count,
                                                     label = label,
                                                     attr_list = attr_list,
                                                     cluster = cluster_json,
                                                     current_cluster = current_cluster_json
                                                     )
    
    else:
        return redirect(url_for('logIn'))


