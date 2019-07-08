# -*- coding: utf-8 -*-
"""
Created on Fri May 24 11:25:14 2019

@author: Kyungmin Park
"""

from flask import render_template
from app import app

@app.route('/')
@app.route('/index')
def index():
    return render_template('photolabeling.html')