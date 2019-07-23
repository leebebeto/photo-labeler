from flask import Flask
from flask import Flask, render_template, request, redirect  # etc.
# from flask_login import LoginManager

app = Flask(__name__)

from app import routes

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)