# -*- coding: utf-8 -*-
"""
Created on Fri May 24 11:25:14 2019

@author: Kyungmin Park
"""

from flask import render_template, request, url_for, jsonify
from app import app
import os
import json
import pickle
import time
import datetime
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
@app.route('/index', methods = ['GET', 'POST'])
def index():
    keyword_list = ["ATTRACTIVE", "CONFIDENTIAL","RATIONAL","OUT-GOING", "KIND","ADVENTUROUS","STUBBORN"]
    image_list = os.listdir(os.path.join(APP_ROOT,'static/image/FFHQ_SAMPLE'))	

    dictOfKey = { i : keyword_list[i] for i in range(0, len(keyword_list) ) }
    dictOfImg = { i : image_list[i] for i in range(0, len(image_list) ) }

    keywords = json.dumps(dictOfKey)
    images = json.dumps(dictOfImg)
    

    # for i in range(len(images)):
    #     images[i] = os.path.join(APP_ROOT,'static/image/FFHQ_SAMPLE/') + images[i]
        
    return render_template('photolabeling.html', keywords = keywords,images = images)
