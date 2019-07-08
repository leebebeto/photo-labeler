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
    user = {'username': 'Miguel'}
    posts = [
    {
        'author': {'username': 'John'},
        'body': 'Beautiful day in Portland!'
    },
    {
        'author': {'username': 'Susan'},
        'body': 'The Avengers movie was so cool!'
    }
]
    return render_template('index.html', title='Home', user=user, posts=posts)