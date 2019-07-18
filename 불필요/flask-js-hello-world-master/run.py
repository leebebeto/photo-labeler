from flask import Flask, render_template
import json

app = Flask(__name__)

@app.route("/", methods = ['GET', 'POST'])
def index():
    
    input_list = {"1":"3","2":"4","3":"5"}
    M = dict(zip(range(1, len(input_list) + 1), input_list))
    test = json.dumps(M)
    test1 = '3'
    print(test)
    return render_template('index.html', test = test, test1 = test1)

if __name__ == '__main__':
    app.run(debug=True)