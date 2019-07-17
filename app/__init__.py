from flask import Flask
from flask import Flask, render_template, request, redirect  # etc.
from flask_login import LoginManager

app = Flask(__name__)

from app import routes