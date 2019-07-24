from flask import Flask
from flask import Flask, render_template, request, redirect  # etc.
# from flask_login import LoginManager

app = Flask(__name__)
app.secret_key = b'\x06_\xdfx\xb8\x11+\xb4\xf5@\xe0\xe9[g\x9b\xc2'

from app import routes

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)