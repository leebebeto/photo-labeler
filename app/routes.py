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
    images = os.listdir(os.path.join(APP_ROOT,'static/image/IU'))
    keyword_list = ["ATTRACTIVE", "CONFIDENTIAL","RATIONAL","OUT-GOING", "KIND","ADVENTUROUS","STUBBORN"]
    return render_template('photolabeling.html', images = images, keyword_list = keyword_list)