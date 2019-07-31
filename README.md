# CHI-2020-system
<p>
This system fits the '67% size' in 'Chrome Browser'. In other sizes or browsers, some contents may not be displayed as intended. 
</p>
<h2>
How to install
</h2>
<p>
1.Activate your virtual environment
</p>
<p>
2.Install all the required packages through 'pip install -r requirements.txt' in the directory
</p>
<p>
3.Build mongodb environment (If you want to use the system as cloud, you should use mongdb atlas)
</p>

<h2>
How to play with our system
</h2>
<p> 
- If you want to change adjectives, revise the 'CONST_ADJECTIVE'
</p>
<p> 
- If you want to change numbers, revise the 'CONST_BLUE_NUMBER, CONST_RED_NUMBER, CONST_NEUTRAL_NUMBER'
</p>
<p> 
- If you want to use MongoDB Atlas, direct your url in the client = pymongo.MongoClient("your_url")
</p>
<p> 
- If you want to use your own images, you can add them ./app/static/image/final_dir. Put this directory in CONST_IMAGE_PATH starting from static/
</p>
<p> 
- If you want to change any parameters including but not limited to 'keyword, images, user_id, numbers, labels, attributes, clusters, and etc', you need to revise codes in routes.py, photolabeling.html, main.js where parameters are handled
</p>
<p> 
- You must extract the feature vectors of images at first trial using the codes at route.py line 45 ~ 66, 
Please use image feature vectors from a saved pickle file. 
</p>
